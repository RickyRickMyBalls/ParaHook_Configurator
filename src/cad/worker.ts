// FILE: src/cad/worker.ts
import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import * as replicad from "replicad";
import { setOC } from "replicad";

// import part builders
import { buildBaseSolid, buildToeSolid, type ParamMap } from "./model";

type PartToggles = {
  baseEnabled: boolean;
  toeBEnabled: boolean; // A->B
  toeCEnabled: boolean; // B->C (requires toeBEnabled)
  heelEnabled: boolean;
};

type BuildPayload = {
  params: ParamMap;
  tolerance: number;
} & PartToggles;

type ExportPayload = {
  params: ParamMap;
  filename: string;
} & PartToggles;

type WorkerIn =
  | { type: "ping" }
  | { type: "build"; payload: BuildPayload }
  | { type: "export_stl"; payload: ExportPayload }
  | { type: "export_step"; payload: ExportPayload };

type WorkerOut =
  | { type: "status"; message: string }
  | { type: "mesh"; payload: any }
  | { type: "file"; filename: string; mime: string; buffer: ArrayBuffer }
  | { type: "error"; message: string }
  | { type: "pong" };

function post(msg: WorkerOut, transfer?: Transferable[]) {
  (self as any).postMessage(msg, transfer ?? []);
}

function errToString(e: unknown) {
  if (e instanceof Error) return `${e.message}\n${e.stack ?? ""}`;
  if (typeof e === "number") return `OC error code: ${e}`;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

async function blobToArrayBuffer(b: Blob): Promise<ArrayBuffer> {
  return await b.arrayBuffer();
}

// -----------------------------
// OC init (lazy, cached)
// -----------------------------
let ocLoaded = false;
let ocLoadingPromise: Promise<void> | null = null;

async function ensureOC() {
  if (ocLoaded) return;
  if (ocLoadingPromise) return ocLoadingPromise;

  ocLoadingPromise = (async () => {
    post({ type: "status", message: "loading opencascade..." });

    const raw = await (opencascade as any)({
      locateFile: () => opencascadeWasm,
    });

    const OC: any = (raw as any)?.default ?? raw;
    setOC(OC);

    ocLoaded = true;
    post({ type: "status", message: "opencascade ready" });
  })();

  return ocLoadingPromise;
}

// -----------------------------
// Meshing helper
// -----------------------------
function meshShape(shape: any, toleranceRaw: unknown) {
  const tolerance = clamp(Number(toleranceRaw) || 1.5, 0.05, 10);
  const r: any = replicad as any;

  if (typeof r.mesh === "function") {
    return r.mesh(shape, { tolerance });
  }
  if (shape && typeof shape.mesh === "function") {
    return shape.mesh({ tolerance });
  }

  throw new Error("Cannot mesh: neither replicad.mesh(...) nor shape.mesh(...) exists");
}

// -----------------------------
// Mesh merge helper (fast preview)
// -----------------------------
type MeshLike = {
  positions?: number[];
  normals?: number[];
  indices?: number[];
  vertices?: number[];
  triangles?: number[];
};

function toStdMesh(f: MeshLike) {
  const positions = (f as any).positions ?? (f as any).vertices;
  const normals = (f as any).normals;
  const indices = (f as any).indices ?? (f as any).triangles;

  if (!positions || !indices) throw new Error("mesh missing positions/indices");

  return {
    positions: positions as number[],
    normals: (normals as number[] | undefined) ?? undefined,
    indices: indices as number[],
  };
}

function mergeMeshes(a: ReturnType<typeof toStdMesh>, b: ReturnType<typeof toStdMesh>) {
  const aPos = a.positions;
  const bPos = b.positions;
  const aIdx = a.indices;
  const bIdx = b.indices;

  const aNorm = a.normals;
  const bNorm = b.normals;

  const outPos = aPos.concat(bPos);

  const outNorm =
    aNorm && bNorm ? (aNorm as number[]).concat(bNorm as number[]) : undefined;

  const aVertCount = Math.floor(aPos.length / 3);
  const outIdx = aIdx.concat(bIdx.map((i) => i + aVertCount));

  return { positions: outPos, normals: outNorm, indices: outIdx };
}

// -----------------------------
// Caching (shapes + meshes)
// -----------------------------
let cachedBaseShape: any | null = null;
let cachedToeShape: any | null = null;

let cachedBaseSig = "";
let cachedToeSig = "";

// Mesh cache keyed by (sig + tol)
let cachedBaseMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedToeMesh: ReturnType<typeof toStdMesh> | null = null;

let cachedBaseMeshKey = "";
let cachedToeMeshKey = "";

// signatures based on param groups (match main.ts)
function numParam(params: ParamMap, key: string): number {
  const v = (params as any)[key];
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function baseSignature(params: ParamMap): string {
  return [1, 2, 3, 4, 5, 6, 7, 8]
    .map((i) => numParam(params, `param${i}`))
    .join(",");
}

function toeSignature(params: ParamMap): string {
  // main.ts includes param9..param19 for toeB stage signature
  return [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    .map((i) => numParam(params, `param${i}`))
    .join(",");
}

async function getBaseShape(params: ParamMap, enabled: boolean) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = baseSignature(params);

  if (!cachedBaseShape || sig !== cachedBaseSig) {
    post({ type: "status", message: "building baseplate..." });
    const s = await buildBaseSolid(params);
    cachedBaseShape = s;
    cachedBaseSig = sig;

    // shape changed -> mesh cache invalid
    cachedBaseMesh = null;
    cachedBaseMeshKey = "";

    return { shape: s, reused: false, sig };
  }

  return { shape: cachedBaseShape, reused: true, sig: cachedBaseSig };
}

async function getToeShape(
  params: ParamMap,
  enabledToeB: boolean,
  enabledToeC: boolean
) {
  // Enforce dependency (same as main.ts): toeC only matters if toeB is on
  const toeB = !!enabledToeB;
  const toeC = toeB && !!enabledToeC;

  if (!toeB && !toeC) return { shape: null as any, reused: true, sig: "" };

  const sig = toeSignature(params);

  if (!cachedToeShape || sig !== cachedToeSig) {
    post({ type: "status", message: "building toe hook..." });

    // IMPORTANT: buildToeSolid must read toeBEnabled/toeCEnabled from params if needed,
    // OR you should update model.ts function signature later to accept toggles.
    // For now we pass flags via params so model.ts can branch without changing signatures.
    (params as any).toeBEnabled = toeB ? 1 : 0;
    (params as any).toeCEnabled = toeC ? 1 : 0;

    const s = await buildToeSolid(params);
    cachedToeShape = s;
    cachedToeSig = sig;

    cachedToeMesh = null;
    cachedToeMeshKey = "";

    return { shape: s, reused: false, sig };
  }

  return { shape: cachedToeShape, reused: true, sig: cachedToeSig };
}

function tolKey(toleranceRaw: unknown) {
  const t = clamp(Number(toleranceRaw) || 1.5, 0.05, 10);
  return String(Math.round(t * 1000) / 1000);
}

async function getBaseMesh(params: ParamMap, enabled: boolean, tolerance: unknown) {
  const s = await getBaseShape(params, enabled);
  if (!enabled || !s.shape) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;

  if (cachedBaseMesh && cachedBaseMeshKey === key) {
    return { mesh: cachedBaseMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing base... (tol=${tolKey(tolerance)})` });
  const faces = meshShape(s.shape as any, tolerance);
  const m = toStdMesh(faces as any);
  cachedBaseMesh = m;
  cachedBaseMeshKey = key;
  return { mesh: m, reused: false, shapeReused: s.reused };
}

async function getToeMesh(
  params: ParamMap,
  enabledToeB: boolean,
  enabledToeC: boolean,
  tolerance: unknown
) {
  const s = await getToeShape(params, enabledToeB, enabledToeC);
  if ((!enabledToeB && !enabledToeC) || !s.shape) {
    return { mesh: null as any, reused: true, shapeReused: true };
  }

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;

  if (cachedToeMesh && cachedToeMeshKey === key) {
    return { mesh: cachedToeMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing toe... (tol=${tolKey(tolerance)})` });
  const faces = meshShape(s.shape as any, tolerance);
  const m = toStdMesh(faces as any);
  cachedToeMesh = m;
  cachedToeMeshKey = key;
  return { mesh: m, reused: false, shapeReused: s.reused };
}

function fuseOrThrow(a: any, b: any) {
  if (!a && !b) throw new Error("No shapes to fuse");
  if (a && b) return a.fuse(b);
  return a ?? b;
}

// -----------------------------
// Crash reporting
// -----------------------------
self.addEventListener("error", (e: any) => {
  try {
    post({
      type: "error",
      message: `worker.error: ${e?.message || "(no message)"} @ ${e?.filename || "?"}:${e?.lineno || "?"}:${e?.colno || "?"}`,
    });
  } catch {}
});

self.addEventListener("unhandledrejection", (e: any) => {
  try {
    post({ type: "error", message: `worker.unhandledrejection: ${errToString(e?.reason)}` });
  } catch {}
});

post({ type: "status", message: "worker booted" });

// -----------------------------
// Main message handler
// -----------------------------
self.onmessage = async (ev: MessageEvent<WorkerIn>) => {
  const msg = ev.data;

  try {
    if (msg.type === "ping") {
      post({ type: "pong" });
      post({ type: "status", message: "worker alive" });
      return;
    }

    await ensureOC();

    // -------------------------
    // FAST PREVIEW BUILD:
    // mesh enabled parts separately and merge (no fuse)
    // -------------------------
    if (msg.type === "build") {
      const { params, tolerance } = msg.payload;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = toeBEnabled && !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;

      // Heel is not built in worker yet (no builder imported). Keep flag for future.
      if (heelEnabled) {
        post({ type: "status", message: "heel enabled (not built yet in worker/model)" });
      }

      const base = await getBaseMesh(params, baseEnabled, tolerance);
      const toe = await getToeMesh(params, toeBEnabled, toeCEnabled, tolerance);

      // Merge what exists
      const meshes: ReturnType<typeof toStdMesh>[] = [];
      if (baseEnabled && base.mesh) meshes.push(base.mesh);
      if ((toeBEnabled || toeCEnabled) && toe.mesh) meshes.push(toe.mesh);

      if (meshes.length === 0) {
        post({ type: "mesh", payload: { positions: [], indices: [], normals: undefined } });
        post({ type: "status", message: "ready (nothing enabled)" });
        return;
      }

      let merged = meshes[0];
      for (let i = 1; i < meshes.length; i++) merged = mergeMeshes(merged, meshes[i]);

      post({
        type: "status",
        message: `preview mesh merged (base:${baseEnabled ? (base.reused ? "cached" : "meshed") : "off"} toe:${(toeBEnabled || toeCEnabled) ? (toe.reused ? "cached" : "meshed") : "off"})`,
      });

      post({ type: "mesh", payload: merged });
      post({ type: "status", message: "ready" });
      return;
    }

    // -------------------------
    // EXPORT STEP (true CAD fuse)
    // -------------------------
    if (msg.type === "export_step") {
      post({ type: "status", message: "exporting step..." });

      const params = msg.payload.params;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = toeBEnabled && !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;

      if (heelEnabled) {
        post({ type: "status", message: "heel enabled (not exported yet)" });
      }

      const base = await getBaseShape(params, baseEnabled);
      const toe = await getToeShape(params, toeBEnabled, toeCEnabled);

      const combined = fuseOrThrow(base.shape, toe.shape);

      if (!combined || typeof combined.blobSTEP !== "function") {
        throw new Error("Shape has no blobSTEP().");
      }

      const blob = combined.blobSTEP();
      if (!(blob instanceof Blob)) throw new Error("blobSTEP did not return a Blob");

      const buffer = await blobToArrayBuffer(blob);
      post({ type: "file", filename: msg.payload.filename, mime: "model/step", buffer }, [buffer]);
      post({ type: "status", message: "ready" });
      return;
    }

    // -------------------------
    // EXPORT STL (true CAD fuse then export)
    // -------------------------
    if (msg.type === "export_stl") {
      post({ type: "status", message: "exporting stl..." });

      const params = msg.payload.params;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = toeBEnabled && !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;

      if (heelEnabled) {
        post({ type: "status", message: "heel enabled (not exported yet)" });
      }

      const base = await getBaseShape(params, baseEnabled);
      const toe = await getToeShape(params, toeBEnabled, toeCEnabled);

      const combined = fuseOrThrow(base.shape, toe.shape);

      if (!combined || typeof combined.blobSTL !== "function") {
        throw new Error("Shape has no blobSTL().");
      }

      const stlTol = 0.2;
      const blob = combined.blobSTL({ tolerance: stlTol, binary: true });
      if (!(blob instanceof Blob)) throw new Error("blobSTL did not return a Blob");

      const buffer = await blobToArrayBuffer(blob);
      post({ type: "file", filename: msg.payload.filename, mime: "model/stl", buffer }, [buffer]);
      post({ type: "status", message: "ready" });
      return;
    }
  } catch (e) {
    post({ type: "error", message: errToString(e) });
  }
};