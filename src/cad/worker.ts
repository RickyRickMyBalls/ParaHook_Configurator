// FILE: src/cad/worker.ts
import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import * as replicad from "replicad";
import { setOC } from "replicad";

import {
  buildBaseSolid,
  buildToeABSolid,
  buildToeBCSolid,
  buildToeSolid,
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
// Signatures (NAMED PARAM KEYS)
// -----------------------------
function numParam(params: ParamMap, key: string): number {
  const v = (params as any)[key];
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function sigFromKeys(params: ParamMap, keys: string[]) {
  return keys.map((k) => numParam(params, k)).join(",");
}

// Baseplate: dimensions + screw holes
function baseSignature(params: ParamMap): string {
  return sigFromKeys(params, [
    "bp_len",
    "bp_wid",
    "bp_thk",
    "bp_heelPct",
    "bp_toePct",
    "bp_p2x",
    "bp_p3x",
    "bp_p4x",

    // screw holes
    "bp_sh_x",
    "bp_sh_y",
    "bp_sh_dia",
    "bp_sh_slot",
    "bp_sh_dist",
    "bp_sh_ang",
  ]);
}

// Toe A->B: thickness + A geom + stationB + midAB + B geom
function toeABSignature(params: ParamMap): string {
  return sigFromKeys(params, [
    // Spine/base path controls (toe sections ride sampled spine)
    "bp_len",
    "bp_heelPct",
    "bp_toePct",
    "bp_p2x",
    "bp_p3x",
    "bp_p4x",

    "toe_thk",
    "fil_1",

    // Profile A controls
    "toe_a_p1s",
    "toe_a_p3s",
    "toe_a_endx",
    "toe_a_endz",
    "toe_a_enda",
    "toe_a_strength",

    // Loft
    "toe_b_sta",
    "toe_ab_mid",

    // Profile B controls
    "toe_a_strength",
    "toe_b_strength",
    "toe_b_p1s",
    "toe_b_p3s",
    "toe_b_endx",
    "toe_b_endz",
    "toe_b_enda",
    "toe_b_strength",
  ]);
}

// Toe B->C: thickness + B geom + stationC + midBC + C geom
function toeBCSignature(params: ParamMap): string {
  return sigFromKeys(params, [
    // Spine/base path controls (toe sections ride sampled spine)
    "bp_len",
    "bp_heelPct",
    "bp_toePct",
    "bp_p2x",
    "bp_p3x",
    "bp_p4x",

    "toe_thk",
    "fil_1",

    // Profile B controls
    "toe_b_p1s",
    "toe_b_p3s",
    "toe_b_endx",
    "toe_b_endz",
    "toe_b_enda",
    "toe_b_strength",

    // Loft
    "toe_b_sta",
    "toe_c_sta",
    "toe_bc_mid",

    // Profile C controls
    "toe_b_strength",
    "toe_c_strength",
    "toe_c_p1s",
    "toe_c_p3s",
    "toe_c_endx",
    "toe_c_endz",
    "toe_c_enda",
    "toe_c_strength",
  ]);
}

function toeCombinedSignature(params: ParamMap): string {
  return `${toeABSignature(params)}|${toeBCSignature(params)}`;
}

// Heel: uses toe C station/control as upstream anchor + heel params
function heelSignature(params: ParamMap): string {
  return sigFromKeys(params, [
    // Spine/base path controls (heel rides the sampled spine)
    "bp_len",
    "bp_heelPct",
    "bp_toePct",
    "bp_p2x",
    "bp_p3x",
    "bp_p4x",

    // Shared thickness (used by fitted heel profile offset)
    "toe_thk",

    // toe C anchor
    "toe_c_sta",
    "toe_c_p1s",
    "toe_c_p3s",
    "toe_c_endx",
    "toe_c_endz",
    "toe_c_enda",

    // heel controls
    "heel_h_c",
    "heel_h_d",
    "heel_cd_mid",
    "heel_f1",
    "heel_f2",
  ]);
}

function tolKey(toleranceRaw: unknown) {
  const t = clamp(Number(toleranceRaw) || 1.5, 0.05, 10);
  return String(Math.round(t * 1000) / 1000);
}

// -----------------------------
// Param flag injection (model reads these from params if desired)
// -----------------------------
function applyToeFlags(params: ParamMap, toeB: boolean, toeC: boolean) {
  (params as any).toeBEnabled = toeB ? 1 : 0;
  (params as any).toeCEnabled = toeC ? 1 : 0;
}

// -----------------------------
// Caching (shapes + meshes) per-part
// -----------------------------
let cachedBaseShape: any | null = null;
let cachedToeABShape: any | null = null;
let cachedToeBCShape: any | null = null;
let cachedToeCombinedShape: any | null = null;
let cachedHeelShape: any | null = null;

let cachedBaseSig = "";
let cachedToeABSig = "";
let cachedToeBCSig = "";
let cachedToeCombinedSig = "";
let cachedHeelSig = "";

let cachedBaseMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedToeABMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedToeBCMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedToeCombinedMesh: ReturnType<typeof toStdMesh> | null = null;
let cachedHeelMesh: ReturnType<typeof toStdMesh> | null = null;

let cachedBaseMeshKey = "";
let cachedToeABMeshKey = "";
let cachedToeBCMeshKey = "";
let cachedToeCombinedMeshKey = "";
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

async function getToeCombinedShape(params: ParamMap, enabled: boolean) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = toeCombinedSignature(params);

  if (!cachedToeCombinedShape || sig !== cachedToeCombinedSig) {
    post({ type: "status", message: "building toe A->B->C..." });
    applyToeFlags(params, true, true);
    const s = await buildToeSolid(params);

    cachedToeCombinedShape = s;
    cachedToeCombinedSig = sig;

    cachedToeCombinedMesh = null;
    cachedToeCombinedMeshKey = "";
    return { shape: s, reused: false, sig };
  }

  return { shape: cachedToeCombinedShape, reused: true, sig: cachedToeCombinedSig };
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

async function getToeCombinedMesh(params: ParamMap, enabled: boolean, tolerance: unknown) {
  const s = await getToeCombinedShape(params, enabled);
  if (!enabled || !s.shape) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedToeCombinedMesh && cachedToeCombinedMeshKey === key) {
    return { mesh: cachedToeCombinedMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing toe A->B->C... (tol=${tolKey(tolerance)})` });
  const faces = meshShape(s.shape as any, tolerance);
  const m = toStdMesh(faces as any);

  cachedToeCombinedMesh = m;
  cachedToeCombinedMeshKey = key;

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

function safeFuse(a: any, b: any) {
  if (!a) return b ?? null;
  if (!b) return a ?? null;
  if (typeof a.fuse !== "function") throw new Error("Shape missing fuse()");
  return a.fuse(b);
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
      const toeBothEnabled = toeBEnabled && toeCEnabled;
      const fil1 = Math.max(0, Number((params as any).fil_1) || 0);

      if (fil1 > 0.001) {
        const toePath =
          toeBothEnabled ? "A->B->C" : toeBEnabled ? "A->B" : toeCEnabled ? "B->C only" : "toe off";
        const fil1Applies = toeBEnabled; // fil_1 affects profile A, so requires A->B presence
        post({
          type: "status",
          message: `fil_1 dbg: ${fil1.toFixed(2)}mm path=${toePath} ${fil1Applies ? "APPLY" : "IGNORED(no A)"}`,
        });
      }

      // Normal path: per-part cached meshes, merge in JS
      const base = await getBaseMesh(params, baseEnabled, tolerance);
      const toeABC = await getToeCombinedMesh(params, toeBothEnabled, tolerance);
      const toeAB = toeBothEnabled
        ? ({ mesh: null as any, reused: true } as { mesh: any; reused: boolean })
        : await getToeABMesh(params, toeBEnabled, tolerance);
      const toeBC = toeBothEnabled
        ? ({ mesh: null as any, reused: true } as { mesh: any; reused: boolean })
        : await getToeBCMesh(params, toeCEnabled, tolerance);
      const heel = await getHeelMesh(params, heelEnabled, tolerance);

      const meshes: ReturnType<typeof toStdMesh>[] = [];
      if (baseEnabled && base.mesh) meshes.push(base.mesh);
      if (toeBothEnabled && toeABC.mesh) meshes.push(toeABC.mesh);
      if (!toeBothEnabled && toeBEnabled && toeAB.mesh) meshes.push(toeAB.mesh);
      if (!toeBothEnabled && toeCEnabled && toeBC.mesh) meshes.push(toeBC.mesh);
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
          `toe:${toeBothEnabled ? (toeABC.reused ? "abc-cached" : "abc-meshed") : "split"} ` +
          `toeAB:${!toeBothEnabled && toeBEnabled ? (toeAB.reused ? "cached" : "meshed") : "off"} ` +
          `toeBC:${!toeBothEnabled && toeCEnabled ? (toeBC.reused ? "cached" : "meshed") : "off"} ` +
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
      const toeBothEnabled = toeBEnabled && toeCEnabled;

      const base = await getBaseShape(params, baseEnabled);
      const toeABC = await getToeCombinedShape(params, toeBothEnabled);
      const toeAB = toeBothEnabled
        ? ({ shape: null as any } as { shape: any })
        : await getToeABShape(params, toeBEnabled);
      const toeBC = toeBothEnabled
        ? ({ shape: null as any } as { shape: any })
        : await getToeBCShape(params, toeCEnabled);
      const heel = await getHeelShape(params, heelEnabled);

      let combined: any = null;
      if (baseEnabled) combined = safeFuse(combined, base.shape);
      if (toeBothEnabled) combined = safeFuse(combined, toeABC.shape);
      if (!toeBothEnabled && toeBEnabled) combined = safeFuse(combined, toeAB.shape);
      if (!toeBothEnabled && toeCEnabled) combined = safeFuse(combined, toeBC.shape);
      if (heelEnabled) combined = safeFuse(combined, heel.shape);

      if (!combined) throw new Error("Nothing enabled to export.");

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

    if (msg.type === "export_stl") {
      post({ type: "status", message: "exporting stl..." });

      const params = msg.payload.params;

      const baseEnabled = !!msg.payload.baseEnabled;
      const toeBEnabled = !!msg.payload.toeBEnabled;
      const toeCEnabled = !!msg.payload.toeCEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;
      const toeBothEnabled = toeBEnabled && toeCEnabled;

      const base = await getBaseShape(params, baseEnabled);
      const toeABC = await getToeCombinedShape(params, toeBothEnabled);
      const toeAB = toeBothEnabled
        ? ({ shape: null as any } as { shape: any })
        : await getToeABShape(params, toeBEnabled);
      const toeBC = toeBothEnabled
        ? ({ shape: null as any } as { shape: any })
        : await getToeBCShape(params, toeCEnabled);
      const heel = await getHeelShape(params, heelEnabled);

      let combined: any = null;
      if (baseEnabled) combined = safeFuse(combined, base.shape);
      if (toeBothEnabled) combined = safeFuse(combined, toeABC.shape);
      if (!toeBothEnabled && toeBEnabled) combined = safeFuse(combined, toeAB.shape);
      if (!toeBothEnabled && toeCEnabled) combined = safeFuse(combined, toeBC.shape);
      if (heelEnabled) combined = safeFuse(combined, heel.shape);

      if (!combined) throw new Error("Nothing enabled to export.");

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
