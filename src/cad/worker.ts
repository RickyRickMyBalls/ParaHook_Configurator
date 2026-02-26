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
  buildToeSolidParts,
  buildHeelSolidParts,
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
  freezeBaseRefit?: boolean;
  freezeToeRefit?: boolean;
  freezeHeelRefit?: boolean;
  forceFullRefit?: boolean;
  forceHeelRefit?: boolean;
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
    "bp_sh_ang",
    "bp_sh_dia",
    "bp_sh_washer",
    "bp_sh_slot",
    "bp_sh_dist",
    "bp_sh_ang2",
    "bp_sh_off2",
    "bp_fil_1",
    "bp_fil_1_r",
    "sh_fil_1",
    "sh_fil_1_r",
    // Rail math can affect baseplate sketch in certain modes (e.g. RM6)
    "rail_math_mode",
    "rail_math_6a",
    "rail_math_6b",
    "rail_math_6c",
    "tagent_a_bp_cut_perp",
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
    "th_fil_1",
    "th_fil_1_r",
    "th_fil_2",
    "th_fil_2_r",
    "tagent_a_offset_rot",
    "tagent_a_midpoint",
    "tagent_a_placeholder_1",
    "tagent_a_placeholder_2",

    // Profile A controls
    "toe_a_p1s",
    "toe_a_p3s",
    "toe_a_endx",
    "toe_a_endz",
    "toe_a_enda",
    "tagent_profile_a",
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
    "tagent_profile_b",
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
    "th_fil_1",
    "th_fil_1_r",
    "th_fil_2",
    "th_fil_2_r",
    "tagent_a_offset_rot",
    "tagent_a_midpoint",
    "tagent_a_placeholder_1",
    "tagent_a_placeholder_2",

    // Profile B controls
    "toe_b_p1s",
    "toe_b_p3s",
    "toe_b_endx",
    "toe_b_endz",
    "toe_b_enda",
    "tagent_profile_b",
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
  const railMathMode = Math.min(10, Math.max(1, Math.round(numParam(params, "rail_math_mode")) || 1));
  const railMath5Cull = Math.min(4, Math.max(0, Math.round(numParam(params, "rail_math_5_cull")) || 0));
  const railMath5Addback = Math.min(6, Math.max(0, Math.round(numParam(params, "rail_math_5_addback")) || 0));
  const railMath6a = Math.round(numParam(params, "rail_math_6a")) ? 1 : 0;
  const railMath6b = Math.round(numParam(params, "rail_math_6b")) ? 1 : 0;
  const railMath6c = Math.round(numParam(params, "rail_math_6c")) ? 1 : 0;
  return `modeB=${numParam(params, "toe_add_profile_b")}|railMath=${railMathMode}|railMath5Cull=${railMath5Cull}|railMath5Addback=${railMath5Addback}|railMath6=${railMath6a}${railMath6b}${railMath6c}|${toeABSignature(
    params
  )}|${toeBCSignature(params)}`;
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
    "heel_cd_mid_pct",
    "heel_rm3_sweep",
    "heel_rm3_bias",
    "heel_rm3_blend",
    "heel_rm4b_sweep",
    "heel_rm4b_bias",
    "heel_rm4b_blend",
    "heel_mid_ctrl",
    "heel_sweep",
    "heel_rail_math_4a",
    "heel_rail_math_4b",
    "tagent_profile_c",
    "tagent_profile_d",
    "tagent_d_cut_perp",
    "heel_fil_1",
    "heel_fil_1_r",
    "heel_fil_2",
    "heel_fil_2_r",
    "heel_f1",
    "heel_f2",
    "heel_rail_math_mode",
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
let cachedToeCombinedMainShape: any | null = null;
let cachedToeCombinedTailShape: any | null = null;
let cachedHeelMainShape: any | null = null;
let cachedHeelCrownShape: any | null = null;
let cachedHeelDebugShape: any | null = null;

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

type RefitOpts = { freezeRefit?: boolean; forceRefit?: boolean };

async function getBaseShape(params: ParamMap, enabled: boolean, opts?: RefitOpts) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = baseSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;

  if (freezeRefit && cachedBaseShape) {
    return { shape: cachedBaseShape, reused: true, sig: cachedBaseSig };
  }

  if (forceRefit || !cachedBaseShape || sig !== cachedBaseSig) {
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

async function getToeABShape(params: ParamMap, enabled: boolean, opts?: RefitOpts) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = toeABSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;

  if (freezeRefit && cachedToeABShape) {
    return { shape: cachedToeABShape, reused: true, sig: cachedToeABSig };
  }

  if (forceRefit || !cachedToeABShape || sig !== cachedToeABSig) {
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

async function getToeBCShape(params: ParamMap, enabled: boolean, opts?: RefitOpts) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = toeBCSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;

  if (freezeRefit && cachedToeBCShape) {
    return { shape: cachedToeBCShape, reused: true, sig: cachedToeBCSig };
  }

  if (forceRefit || !cachedToeBCShape || sig !== cachedToeBCSig) {
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

async function getToeCombinedShape(params: ParamMap, enabled: boolean, opts?: RefitOpts) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };

  const sig = toeCombinedSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;

  if (freezeRefit && cachedToeCombinedShape) {
    return { shape: cachedToeCombinedShape, reused: true, sig: cachedToeCombinedSig };
  }

  if (forceRefit || !cachedToeCombinedShape || sig !== cachedToeCombinedSig) {
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

async function getHeelShape(
  params: ParamMap,
  enabled: boolean,
  opts?: RefitOpts
) {
  if (!enabled) return { shape: null as any, reused: true, sig: "" };
  const p = await getHeelParts(params, enabled, opts);

  let shape: any = null;
  shape = safeFuse(shape, p.main);
  shape = safeFuse(shape, p.crown);
  if (!shape && p.debugOnly) {
    throw new Error("Heel loft failed (debug-only heel result). Disable debug/crown or adjust heel settings to export.");
  }
  return { shape, reused: p.reused, sig: p.sig };
}

async function getToeCombinedParts(params: ParamMap, enabled: boolean, opts?: RefitOpts) {
  if (!enabled) return { main: null as any, tail: null as any, reused: true, sig: "" };

  const sig = toeCombinedSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;
  const hasCachedToeParts = !!(cachedToeCombinedMainShape || cachedToeCombinedTailShape);

  if (freezeRefit && hasCachedToeParts) {
    return {
      main: cachedToeCombinedMainShape,
      tail: cachedToeCombinedTailShape,
      reused: true,
      sig: cachedToeCombinedSig,
    };
  }

  if (forceRefit || !hasCachedToeParts || sig !== cachedToeCombinedSig) {
    post({ type: "status", message: "building toe A->B->C..." });
    applyToeFlags(params, true, true);
    const parts = await buildToeSolidParts(params);

    cachedToeCombinedMainShape = parts.main;
    cachedToeCombinedTailShape = parts.tail;
    cachedToeCombinedSig = sig;

    cachedToeCombinedMesh = null;
    cachedToeCombinedMeshKey = "";
    return { main: parts.main, tail: parts.tail, reused: false, sig };
  }

  return {
    main: cachedToeCombinedMainShape,
    tail: cachedToeCombinedTailShape,
    reused: true,
    sig: cachedToeCombinedSig,
  };
}

async function getHeelParts(
  params: ParamMap,
  enabled: boolean,
  opts?: RefitOpts
) {
  if (!enabled) return { main: null as any, crown: null as any, debug: null as any, debugOnly: false, reused: true, sig: "" };

  const sig = heelSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;
  const hasCachedHeelParts = !!(cachedHeelMainShape || cachedHeelCrownShape || cachedHeelDebugShape);

  if (freezeRefit && hasCachedHeelParts) {
    return {
      main: cachedHeelMainShape,
      crown: cachedHeelCrownShape,
      debug: cachedHeelDebugShape,
      debugOnly: !cachedHeelMainShape && !!cachedHeelDebugShape,
      reused: true,
      sig: cachedHeelSig,
    };
  }

  if (forceRefit || !hasCachedHeelParts || sig !== cachedHeelSig) {
    post({ type: "status", message: "building heel kick..." });
    const parts = await buildHeelSolidParts(params);

    cachedHeelMainShape = parts.main;
    cachedHeelCrownShape = parts.crown;
    cachedHeelDebugShape = parts.debug;
    cachedHeelSig = sig;

    cachedHeelMesh = null;
    cachedHeelMeshKey = "";
    return {
      main: cachedHeelMainShape,
      crown: cachedHeelCrownShape,
      debug: cachedHeelDebugShape,
      debugOnly: !!parts.debugOnly,
      reused: false,
      sig,
    };
  }

  return {
    main: cachedHeelMainShape,
    crown: cachedHeelCrownShape,
    debug: cachedHeelDebugShape,
    debugOnly: !cachedHeelMainShape && !!cachedHeelDebugShape,
    reused: true,
    sig: cachedHeelSig,
  };
}

async function getBaseMesh(params: ParamMap, enabled: boolean, tolerance: unknown, opts?: RefitOpts) {
  const s = await getBaseShape(params, enabled, opts);
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

async function getToeABMesh(params: ParamMap, enabled: boolean, tolerance: unknown, opts?: RefitOpts) {
  const s = await getToeABShape(params, enabled, opts);
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

async function getToeBCMesh(params: ParamMap, enabled: boolean, tolerance: unknown, opts?: RefitOpts) {
  const s = await getToeBCShape(params, enabled, opts);
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

async function getToeCombinedMesh(params: ParamMap, enabled: boolean, tolerance: unknown, opts?: RefitOpts) {
  const s = await getToeCombinedParts(params, enabled, opts);
  const hasToePreviewParts = !!(s.main || s.tail);
  if (!enabled || !hasToePreviewParts) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedToeCombinedMesh && cachedToeCombinedMeshKey === key) {
    return { mesh: cachedToeCombinedMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing toe A->B->C... (tol=${tolKey(tolerance)})` });
  const meshes: ReturnType<typeof toStdMesh>[] = [];
  if (s.main) meshes.push(toStdMesh(meshShape(s.main as any, tolerance) as any));
  if (s.tail) meshes.push(toStdMesh(meshShape(s.tail as any, tolerance) as any));
  if (meshes.length === 0) return { mesh: null as any, reused: true, shapeReused: s.reused };
  let m = meshes[0];
  for (let i = 1; i < meshes.length; i++) m = mergeMeshes(m, meshes[i]);

  cachedToeCombinedMesh = m;
  cachedToeCombinedMeshKey = key;

  return { mesh: m, reused: false, shapeReused: s.reused };
}

// Legacy split toe helpers are retained for compatibility/testing but are no longer
// used by the UI-driven build/export paths after the Add Profile B mode switch.
void getToeABShape;
void getToeBCShape;
void getToeABMesh;
void getToeBCMesh;

async function getHeelMesh(
  params: ParamMap,
  enabled: boolean,
  tolerance: unknown,
  opts?: RefitOpts
) {
  const s = await getHeelParts(params, enabled, opts);
  const hasHeelPreviewParts = !!(s.main || s.crown || s.debug);
  if (!enabled || !hasHeelPreviewParts) return { mesh: null as any, reused: true, shapeReused: true };

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedHeelMesh && cachedHeelMeshKey === key) {
    return { mesh: cachedHeelMesh, reused: true, shapeReused: s.reused };
  }

  post({ type: "status", message: `meshing heel... (tol=${tolKey(tolerance)})` });
  const meshes: ReturnType<typeof toStdMesh>[] = [];
  if (s.main) meshes.push(toStdMesh(meshShape(s.main as any, tolerance) as any));
  if (s.crown) meshes.push(toStdMesh(meshShape(s.crown as any, tolerance) as any));
  if (s.debug) meshes.push(toStdMesh(meshShape(s.debug as any, tolerance) as any));
  if (meshes.length === 0) return { mesh: null as any, reused: true, shapeReused: s.reused };

  let m = meshes[0];
  for (let i = 1; i < meshes.length; i++) m = mergeMeshes(m, meshes[i]);

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
      const freezeBaseRefit = !!msg.payload.freezeBaseRefit;
      const freezeToeRefit = !!msg.payload.freezeToeRefit;
      const freezeHeelRefit = !!msg.payload.freezeHeelRefit;
      const forceFullRefit = !!msg.payload.forceFullRefit;
      const forceHeelRefit = !!msg.payload.forceHeelRefit;

      const baseEnabled = !!msg.payload.baseEnabled;
      const heelEnabled = !!msg.payload.heelEnabled;
      const toeEnabled = true;
      const toeWithB = !!(Number((params as any).toe_add_profile_b) || 0);
      const fil1 = Math.max(0, Number((params as any).fil_1) || 0);

      if (fil1 > 0.001) {
        const toePath = toeWithB ? "A->B->C" : "A->C";
        const fil1Applies = true; // fil_1 affects profile A, which exists in both modes
        post({
          type: "status",
          message: `fil_1 dbg: ${fil1.toFixed(2)}mm path=${toePath} ${fil1Applies ? "APPLY" : "IGNORED(no A)"}`,
        });
      }

      // Normal path: per-part cached meshes, merge in JS
      const base = await getBaseMesh(params, baseEnabled, tolerance, {
        freezeRefit: freezeBaseRefit,
        forceRefit: forceFullRefit,
      });
      const toeABC = await getToeCombinedMesh(params, toeEnabled, tolerance, {
        freezeRefit: freezeToeRefit,
        forceRefit: forceFullRefit,
      });
      const heel = await getHeelMesh(params, heelEnabled, tolerance, {
        freezeRefit: freezeHeelRefit,
        forceRefit: forceFullRefit || forceHeelRefit,
      });

      const meshes: ReturnType<typeof toStdMesh>[] = [];
      if (baseEnabled && base.mesh) meshes.push(base.mesh);
      if (toeEnabled && toeABC.mesh) meshes.push(toeABC.mesh);
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
            `toe:${toeEnabled ? (toeABC.reused ? (toeWithB ? "abc-cached" : "ac-cached") : (toeWithB ? "abc-meshed" : "ac-meshed")) : "off"} ` +
            `toeAB:off ` +
            `toeBC:off ` +
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
      const heelEnabled = !!msg.payload.heelEnabled;
      const toeEnabled = true;

      const base = await getBaseShape(params, baseEnabled);
      const toeABC = await getToeCombinedShape(params, toeEnabled);
      const heel = await getHeelShape(params, heelEnabled);

      let combined: any = null;
      if (baseEnabled) combined = safeFuse(combined, base.shape);
      if (toeEnabled) combined = safeFuse(combined, toeABC.shape);
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
      const heelEnabled = !!msg.payload.heelEnabled;
      const toeEnabled = true;

      const base = await getBaseShape(params, baseEnabled);
      const toeABC = await getToeCombinedShape(params, toeEnabled);
      const heel = await getHeelShape(params, heelEnabled);

      let combined: any = null;
      if (baseEnabled) combined = safeFuse(combined, base.shape);
      if (toeEnabled) combined = safeFuse(combined, toeABC.shape);
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
