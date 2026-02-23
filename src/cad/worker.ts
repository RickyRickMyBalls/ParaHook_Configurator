// FILE: src/cad/worker.ts
import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import * as replicad from "replicad";
import { setOC } from "replicad";

import {
  buildBaseSolid,
  buildToeABSolid,
  buildToeBCSolid,
  buildHeelSolid,
  type ParamMap,
} from "./model";

type PartToggles = {
  baseEnabled: boolean;
  toeBEnabled: boolean; // A->B
  toeCEnabled: boolean; // B->C
  heelEnabled: boolean; // heel loft
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
  const outNorm = aNorm && bNorm ? (aNorm as number[]).concat(bNorm as number[]) : undefined;

  const aVertCount = Math.floor(aPos.length / 3);
  const outIdx = aIdx.concat(bIdx.map((i) => i + aVertCount));

  return { positions: outPos, normals: outNorm, indices: outIdx };
}

// -----------------------------
// Signatures (UPDATED to match HTML numbering)
// -----------------------------
function numParam(params: ParamMap, key: string): number {
  const v = (params as any)[key];
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function baseSignature(params: ParamMap): string {
  return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => numParam(params, `param${i}`)).join(",");
}

// Toe A->B uses thickness(9) + A(10..13) + filletA(14) + stationB(15) + midAB(16) + B(17..20)
function toeABSignature(params: ParamMap): string {
  return [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    .map((i) => numParam(params, `param${i}`))
    .join(",");
}

// Toe B->C uses thickness(9) + stationB(15)+midAB(16)+B(17..20) + stationC(21)+midBC(22)+C(23..26) + filletC(27)
function toeBCSignature(params: ParamMap): string {
  return [9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    .map((i) => numParam(params, `param${i}`))
    .join(",");
}

// Heel uses thickness(9) + stationC(21) + C geom (23..26) + heel (28..30)
function heelSignature(params: ParamMap): string {
  return [9, 21, 23, 24, 25, 26, 28, 29, 30].map((i) => numParam(params, `param${i}`)).join(",");
}

function tolKey(toleranceRaw: unknown) {
  const t = clamp(Number(toleranceRaw) || 1.5, 0.05, 10);
  return String(Math.round(t * 1000) / 1000);
}

// -----------------------------
// Param flag injection (model reads these from params)
// -----------------------------
function applyToeFlags(params: ParamMap, toeB: boolean, toeC: boolean) {
  (params as any).toeBEnabled = toeB ? 1 : 0;
  (params as any).toeCEnabled = toeC ? 1 : 0;
}

// -----------------------------
// Section cut (Y plane)
// -----------------------------
function sectionCutEnabled(params: ParamMap): boolean {
  return numParam(params, "sectionCutEnabled") === 1;
}
function sectionCutY(params: ParamMap): number {
  const y = numParam(params, "sectionCutY");
  return Number.isFinite(y) ? y : 0;
}

function applySectionCutKeepBack(shape: any, cutYmm: number): any {
  const BIG = 100000;

  const r: any = replicad as any;
  if (typeof r.makeBox !== "function") {
    throw new Error("replicad.makeBox is not available; cannot perform section cut box");
  }

  const ySize = cutYmm - (-BIG);
  const halfBox = r.makeBox(BIG * 2, ySize, BIG * 2, [-BIG, -BIG, -BIG]);

  if (!shape || typeof shape.intersect !== "function") {
    throw new Error("Shape has no intersect(); cannot apply section cut");
  }

  return shape.intersect(halfBox);
}

// -----------------------------
// Caching (shapes + meshes) per-part
// -----------------------------
let cachedBaseShape: any | null = null;
let cachedToeABShape: any | null = null;
let cachedToeBCShape: any | null = null;
let cachedHeelShape: any | null = null;

let cachedBaseSig = "";
let cachedToeABSig = "";
let cachedToeBCSig = "";
let cachedHeelSig = "";

let cachedBaseMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedToeABMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedToeBCMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedHeelMesh: ReturnType<typeof toStdMesh> | null = null;

let cachedBaseMeshKey = "";
let cachedToeABMeshKey = "";
let cachedToeBCMeshKey = "";
let cachedHeelMeshKey = "";

async function getBaseShape(params: ParamMap, enabled: boolean) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = baseSignature(params);

  if (!cachedBaseShape || sig !== cachedBaseSig) {
    post({ type: "status", message: "building baseplate..." });
    const s = await buildBaseSolid(params);
    cachedBaseShape = s;
    cachedBaseSig = sig;

    cachedBaseMesh = null;
    cachedBaseMeshKey = "";
    return { shape: s, reused: false, sig };
  }

  return { shape: cachedBaseShape, reused: true, sig: cachedBaseSig };
}

async function getToeABShape(params: ParamMap, enabled: boolean) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = toeABSignature(params);

  if (!cachedToeABShape || sig !== cachedToeABSig) {
    post({ type: "status", message: "building toe A->B..." });
    applyToeFlags(params, true, false);
    const s = await buildToeABSolid(params);

    cachedToeABShape = s;
    cachedToeABSig = sig;

    cachedToeABMesh = null;
    cachedToeABMeshKey = "";
    return { shape: s, reused: false, sig };
  }

  return { shape: cachedToeABShape, reused: true, sig: cachedToeABSig };
}

async function getToeBCShape(params: ParamMap, enabled: boolean) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = toeBCSignature(params);

  if (!cachedToeBCShape || sig !== cachedToeBCSig) {
    post({ type: "status", message: "building toe B->C..." });
    applyToeFlags(params, false, true);
    const s = await buildToeBCSolid(params);

    cachedToeBCShape = s;
    cachedToeBCSig = sig;

    cachedToeBCMesh = null;
    cachedToeBCMeshKey = "";
    return { shape: s, reused: false, sig };
  }

  return { shape: cachedToeBCShape, reused: true, sig: cachedToeBCSig };
}

async function getHeelShape(params: ParamMap, enabled: boolean) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = heelSignature(params);

  if (!cachedHeelShape || sig !== cachedHeelSig) {
    post({ type: "status", message: "building heel kick..." });
    const s = await buildHeelSolid(params);

    cachedHeelShape = s;
    cachedHeelSig = sig;

    cachedHeelMesh = null;
    cachedHeelMeshKey = "";
    return { shape: s, reused: false, sig };
  }

  return { shape: cachedHeelShape, reused: true, sig: cachedHeelSig };
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

async function getToeABMesh(params: ParamMap, enabled: boolean, tolerance: unknown) {
  const s = await getToeABShape(params, enabled);
  if (!enabled || !s.shape) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedToeABMesh && cachedToeABMeshKey === key) {
    return { mesh: cachedToeABMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing toe A->B... (tol=${tolKey(tolerance)})` });
  const faces = meshShape(s.shape as any, tolerance);
  const m = toStdMesh(faces as any);

  cachedToeABMesh = m;
  cachedToeABMeshKey = key;

  return { mesh: m, reused: false, shapeReused: s.reused };
}

async function getToeBCMesh(params: ParamMap, enabled: boolean, tolerance: unknown) {
  const s = await getToeBCShape(params, enabled);
  if (!enabled || !s.shape) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedToeBCMesh && cachedToeBCMeshKey === key) {
    return { mesh: cachedToeBCMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing toe B->C... (tol=${tolKey(tolerance)})` });
  const faces = meshShape(s.shape as any, tolerance);
  const m = toStdMesh(faces as any);

  cachedToeBCMesh = m;
  cachedToeBCMeshKey = key;

  return { mesh: m, reused: false, shapeReused: s.reused };
}

async function getHeelMesh(params: ParamMap, enabled: boolean, tolerance: unknown) {
  const s = await getHeelShape(params, enabled);
  if (!enabled || !s.shape) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedHeelMesh && cachedHeelMeshKey === key) {
    return { mesh: cachedHeelMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing heel... (tol=${tolKey(tolerance)})` });
  const faces = meshShape(s.shape as any, tolerance);
  const m = toStdMesh(faces as any);

  cachedHeelMesh = m;
  cachedHeelMeshKey = key;

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

    if (msg.type === "build") {
      const { params, tolerance } = msg.payload;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;

      if (sectionCutEnabled(params)) {
        post({ type: "status", message: "building model for section cut..." });

        const base = await getBaseShape(params, baseEnabled);
        const toeAB = await getToeABShape(params, toeBEnabled);
        const toeBC = await getToeBCShape(params, toeCEnabled);
        const heel = await getHeelShape(params, heelEnabled);

        let combined: any = null;
        combined = baseEnabled ? base.shape : combined;
        combined = fuseOrThrow(combined, toeAB.shape);
        combined = fuseOrThrow(combined, toeBC.shape);
        combined = fuseOrThrow(combined, heel.shape);

        const yCut = sectionCutY(params);
        const cutResult = applySectionCutKeepBack(combined, yCut);

        post({ type: "status", message: `meshing section cut... (tol=${tolKey(tolerance)})` });
        const faces = meshShape(cutResult, tolerance);
        const m = toStdMesh(faces as any);

        post({ type: "mesh", payload: m });
        post({ type: "status", message: "ready (section cut preview)" });
        return;
      }

      const base = await getBaseMesh(params, baseEnabled, tolerance);
      const toeAB = await getToeABMesh(params, toeBEnabled, tolerance);
      const toeBC = await getToeBCMesh(params, toeCEnabled, tolerance);
      const heel = await getHeelMesh(params, heelEnabled, tolerance);

      const meshes: ReturnType<typeof toStdMesh>[] = [];
      if (baseEnabled && base.mesh) meshes.push(base.mesh);
      if (toeBEnabled && toeAB.mesh) meshes.push(toeAB.mesh);
      if (toeCEnabled && toeBC.mesh) meshes.push(toeBC.mesh);
      if (heelEnabled && heel.mesh) meshes.push(heel.mesh);

      if (meshes.length === 0) {
        post({ type: "mesh", payload: { positions: [], indices: [], normals: undefined } });
        post({ type: "status", message: "ready (nothing enabled)" });
        return;
      }

      let merged = meshes[0];
      for (let i = 1; i < meshes.length; i++) merged = mergeMeshes(merged, meshes[i]);

      post({
        type: "status",
        message:
          `preview mesh merged (` +
          `base:${baseEnabled ? (base.reused ? "cached" : "meshed") : "off"} ` +
          `toeAB:${toeBEnabled ? (toeAB.reused ? "cached" : "meshed") : "off"} ` +
          `toeBC:${toeCEnabled ? (toeBC.reused ? "cached" : "meshed") : "off"} ` +
          `heel:${heelEnabled ? (heel.reused ? "cached" : "meshed") : "off"}` +
          `)`,
      });

      post({ type: "mesh", payload: merged });
      post({ type: "status", message: "ready" });
      return;
    }

    if (msg.type === "export_step") {
      post({ type: "status", message: "exporting step..." });

      const params = msg.payload.params;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;

      const base = await getBaseShape(params, baseEnabled);
      const toeAB = await getToeABShape(params, toeBEnabled);
      const toeBC = await getToeBCShape(params, toeCEnabled);
      const heel = await getHeelShape(params, heelEnabled);

      let combined: any = null;
      combined = baseEnabled ? base.shape : combined;
      combined = fuseOrThrow(combined, toeAB.shape);
      combined = fuseOrThrow(combined, toeBC.shape);
      combined = fuseOrThrow(combined, heel.shape);

      let outShape: any = combined;

      if (sectionCutEnabled(params)) {
        post({ type: "status", message: "applying section cut (step)..." });
        outShape = applySectionCutKeepBack(combined, sectionCutY(params));
      }

      if (!outShape || typeof outShape.blobSTEP !== "function") {
        throw new Error("Shape has no blobSTEP().");
      }

      const blob = outShape.blobSTEP();
      if (!(blob instanceof Blob)) throw new Error("blobSTEP did not return a Blob");

      const buffer = await blobToArrayBuffer(blob);
      post({ type: "file", filename: msg.payload.filename, mime: "model/step", buffer }, [buffer]);
      post({ type: "status", message: "ready" });
      return;
    }

    if (msg.type === "export_stl") {
      post({ type: "status", message: "exporting stl..." });

      const params = msg.payload.params;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;

      const base = await getBaseShape(params, baseEnabled);
      const toeAB = await getToeABShape(params, toeBEnabled);
      const toeBC = await getToeBCShape(params, toeCEnabled);
      const heel = await getHeelShape(params, heelEnabled);

      let combined: any = null;
      combined = baseEnabled ? base.shape : combined;
      combined = fuseOrThrow(combined, toeAB.shape);
      combined = fuseOrThrow(combined, toeBC.shape);
      combined = fuseOrThrow(combined, heel.shape);

      let outShape: any = combined;

      if (sectionCutEnabled(params)) {
        post({ type: "status", message: "applying section cut (stl)..." });
        outShape = applySectionCutKeepBack(combined, sectionCutY(params));
      }

      if (!outShape || typeof outShape.blobSTL !== "function") {
        throw new Error("Shape has no blobSTL().");
      }

      const stlTol = 0.2;
      const blob = outShape.blobSTL({ tolerance: stlTol, binary: true });
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