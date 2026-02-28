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
  | { type: "build_trace"; payload: BuildTracePayload }
  | { type: "mesh_progress"; payload: any }
  | { type: "mesh"; payload: any }
  | { type: "file"; filename: string; mime: string; buffer: ArrayBuffer }
  | { type: "error"; message: string }
  | { type: "pong" };

type BuildTracePart = {
  id: string;
  name: string;
  enabled: boolean;
  shapeState: "off" | "rebuilt" | "reused";
  meshState: "off" | "meshed" | "cached";
  verts: number;
  tris: number;
};

type BuildTracePayload = {
  buildId: string;
  tolerance: number;
  toggles: { baseEnabled: boolean; toeEnabled: boolean; toeWithB: boolean; heelEnabled: boolean };
  operations: string[];
  separateMeshes: BuildTracePart[];
  mergedMeshes: Array<{ id: string; name: string; contributors: string[]; verts: number; tris: number }>;
  generatedParts: Array<{ id: string; name: string; start: number; count: number }>;
};

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

function meshStats(mesh: ReturnType<typeof toStdMesh> | null | undefined) {
  if (!mesh) return { verts: 0, tris: 0 };
  return {
    verts: Math.floor(mesh.positions.length / 3),
    tris: Math.floor(mesh.indices.length / 3),
  };
}

type GeneratedMeshPart = {
  id: string;
  name: string;
  start: number;
  count: number;
};

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
    "th_fil_3_mode",
    "th_fil_3x",
    "th_fil_3y",
    "th_fil_3y_actual",
    "th_fil_debug_profiles",
    "dbg_profile_a",
    "dbg_profile_b",
    "dbg_profile_c",
    "dbg_ab",
    "dbg_bc",
    "dbg_profile_a_x",
    "dbg_profile_a_z",
    "dbg_profile_b_x",
    "dbg_profile_b_z",
    "dbg_profile_c_x",
    "dbg_profile_c_z",
    "dbg_ab_first_x",
    "dbg_ab_first_y",
    "dbg_ab_step_x",
    "dbg_ab_step_y",
    "dbg_bc_first_x",
    "dbg_bc_first_y",
    "dbg_bc_step_x",
    "dbg_bc_step_y",
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
    "th_fil_3_mode",
    "th_fil_3x",
    "th_fil_3y",
    "th_fil_3y_actual",
    "th_fil_debug_profiles",
    "dbg_profile_a",
    "dbg_profile_b",
    "dbg_profile_c",
    "dbg_ab",
    "dbg_bc",
    "dbg_profile_a_x",
    "dbg_profile_a_z",
    "dbg_profile_b_x",
    "dbg_profile_b_z",
    "dbg_profile_c_x",
    "dbg_profile_c_z",
    "dbg_ab_first_x",
    "dbg_ab_first_y",
    "dbg_ab_step_x",
    "dbg_ab_step_y",
    "dbg_bc_first_x",
    "dbg_bc_first_y",
    "dbg_bc_step_x",
    "dbg_bc_step_y",
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
  const railMathMode = Math.min(11, Math.max(1, Math.round(numParam(params, "rail_math_mode")) || 1));
  const railMath5Cull = Math.min(4, Math.max(0, Math.round(numParam(params, "rail_math_5_cull")) || 0));
  const railMath5Addback = Math.min(6, Math.max(0, Math.round(numParam(params, "rail_math_5_addback")) || 0));
  const railMath6a = Math.round(numParam(params, "rail_math_6a")) ? 1 : 0;
  const railMath6b = Math.round(numParam(params, "rail_math_6b")) ? 1 : 0;
  const railMath6c = Math.round(numParam(params, "rail_math_6c")) ? 1 : 0;
  const peEnabled = Math.round(numParam(params, "pe_enabled")) ? 1 : 0;
  const peSection = Math.round(numParam(params, "pe_section_mode")) ? 1 : 0;
  const peIso = Math.round(numParam(params, "pe_isolated_mode")) ? 1 : 0;
  const pePrev = Math.round(numParam(params, "pe_loft_prev")) ? 1 : 0;
  const peNext = Math.round(numParam(params, "pe_loft_next")) ? 1 : 0;
  const peFocus = String((params as any).pe_focus_key ?? "");
  const peBlob = String((params as any).pe_edit_blob ?? "");
  return `modeB=${numParam(params, "toe_add_profile_b")}|railMath=${railMathMode}|railMath5Cull=${railMath5Cull}|railMath5Addback=${railMath5Addback}|railMath6=${railMath6a}${railMath6b}${railMath6c}|pe=${peEnabled}${peSection}${peIso}${pePrev}${peNext}|peFocus=${peFocus}|peBlob=${peBlob}|${toeABSignature(
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
    "th_fil_debug_profiles",
    "dbg_profile_hc",
    "dbg_profile_hd",
    "dbg_cd",
    "dbg_profile_hc_x",
    "dbg_profile_hc_z",
    "dbg_profile_hd_x",
    "dbg_profile_hd_z",
    "dbg_cd_first_x",
    "dbg_cd_first_y",
    "dbg_cd_step_x",
    "dbg_cd_step_y",
  ]);
}

function tolKey(toleranceRaw: unknown) {
  const t = clamp(Number(toleranceRaw) || 1.5, 0.05, 10);
  return String(Math.round(t * 1000) / 1000);
}

function profileEditorSectionModeEnabled(params: ParamMap) {
  const peEnabled = Math.round(numParam(params, "pe_enabled")) === 1;
  const peSection = Math.round(numParam(params, "pe_section_mode")) === 1;
  const railMathMode = Math.round(numParam(params, "rail_math_mode"));
  const railMath11 = Math.round(numParam(params, "rail_math_11")) === 1;
  const mode11 = railMathMode === 11 || railMath11;
  return peEnabled && peSection && mode11;
}

function readProfileEditorHiddenSectionIds(params: ParamMap) {
  const out = new Set<string>();
  const raw = String((params as any).pe_hidden_sections_blob ?? "");
  if (!raw.trim()) return out;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return out;
    for (const v of parsed) {
      const id = String(v ?? "").trim();
      if (id) out.add(id);
    }
  } catch {}
  return out;
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
let cachedToeCombinedSectionParts: Array<{ id: string; name: string; cacheKey: string; shape: any | null }> | null = null;
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
const cachedToeSectionMeshByKey = new Map<string, ReturnType<typeof toStdMesh>>();
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
    post({
      type: "status",
      message:
        `[toe_worker] mode3=${Math.round(numParam(params, "th_fil_3_mode"))}` +
        ` dbgProfiles=${Math.round(numParam(params, "th_fil_debug_profiles"))}` +
        ` th1=${Math.round(numParam(params, "th_fil_1"))}` +
        ` th2=${Math.round(numParam(params, "th_fil_2"))}`,
    });
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
  if (!enabled) return { main: null as any, tail: null as any, sections: null as any, reused: true, sig: "" };

  const sig = toeCombinedSignature(params);
  const freezeRefit = !!opts?.freezeRefit;
  const forceRefit = !!opts?.forceRefit;
  const hasCachedToeParts = !!(cachedToeCombinedMainShape || cachedToeCombinedTailShape || (cachedToeCombinedSectionParts && cachedToeCombinedSectionParts.length));

  if (freezeRefit && hasCachedToeParts) {
    return {
      main: cachedToeCombinedMainShape,
      tail: cachedToeCombinedTailShape,
      sections: cachedToeCombinedSectionParts,
      reused: true,
      sig: cachedToeCombinedSig,
    };
  }

  if (forceRefit || !hasCachedToeParts || sig !== cachedToeCombinedSig) {
    post({ type: "status", message: "building toe A->B->C..." });
    post({
      type: "status",
      message:
        `[toe_worker] parts mode3=${Math.round(numParam(params, "th_fil_3_mode"))}` +
        ` dbgProfiles=${Math.round(numParam(params, "th_fil_debug_profiles"))}` +
        ` th1=${Math.round(numParam(params, "th_fil_1"))}` +
        ` th2=${Math.round(numParam(params, "th_fil_2"))}`,
    });
    applyToeFlags(params, true, true);
    const parts = await buildToeSolidParts(params);

    cachedToeCombinedMainShape = parts.main;
    cachedToeCombinedTailShape = parts.tail;
    cachedToeCombinedSectionParts = parts.sections ?? null;
    cachedToeCombinedSig = sig;

    cachedToeCombinedMesh = null;
    cachedToeCombinedMeshKey = "";
    cachedToeSectionMeshByKey.clear();
    return { main: parts.main, tail: parts.tail, sections: parts.sections ?? null, reused: false, sig };
  }

  return {
    main: cachedToeCombinedMainShape,
    tail: cachedToeCombinedTailShape,
    sections: cachedToeCombinedSectionParts,
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
  const hasToePreviewParts = !!(s.main || s.tail || (s.sections && s.sections.length));
  if (!enabled || !hasToePreviewParts) return { mesh: null as any, reused: true, shapeReused: true };

  const useSectionParts = profileEditorSectionModeEnabled(params) && !!(s.sections && s.sections.length);
  if (useSectionParts) {
    post({ type: "status", message: `meshing toe sections... (tol=${tolKey(tolerance)})` });
    const hiddenSectionIds = readProfileEditorHiddenSectionIds(params);
    const activeSectionMeshKeys = new Set<string>();
    let allReused = true;
    const rawSections = (s.sections ?? []).filter((sec: any) => !!sec?.shape);
    const visibleTotal = rawSections.reduce((count: number, sec: any) => {
      if (!sec?.id) return count;
      return hiddenSectionIds.has(sec.id) ? count : count + 1;
    }, 0);
    let visibleBuilt = 0;
    let mergedVisible: ReturnType<typeof toStdMesh> | null = null;
    const mergedVisibleParts: GeneratedMeshPart[] = [];
    let mergedVisibleIndexOffset = 0;
    for (let secIdx = 0; secIdx < rawSections.length; secIdx++) {
      const sec = rawSections[secIdx];
      if (!sec?.shape) continue;
      const meshKey = `${sec.cacheKey}|tol=${tolKey(tolerance)}`;
      activeSectionMeshKeys.add(meshKey);
      const hidden = hiddenSectionIds.has(sec.id);
      const cached = cachedToeSectionMeshByKey.get(meshKey);
      let mesh: ReturnType<typeof toStdMesh>;
      if (cached) {
        post({ type: "status", message: `[toe_sections] ${secIdx + 1}/${rawSections.length} cached: ${sec.name}` });
        mesh = cached;
      } else {
        post({ type: "status", message: `[toe_sections] ${secIdx + 1}/${rawSections.length} meshing: ${sec.name}` });
        const faces = meshShape(sec.shape as any, tolerance);
        mesh = toStdMesh(faces as any);
        cachedToeSectionMeshByKey.set(meshKey, mesh);
        allReused = false;
      }
      if (hidden) continue;
      if (!mergedVisible) {
        mergedVisible = mesh;
        mergedVisibleParts.push({
          id: sec.id,
          name: sec.name,
          start: 0,
          count: mesh.indices.length,
        });
        mergedVisibleIndexOffset = mesh.indices.length;
      } else {
        mergedVisible = mergeMeshes(mergedVisible, mesh);
        mergedVisibleParts.push({
          id: sec.id,
          name: sec.name,
          start: mergedVisibleIndexOffset,
          count: mesh.indices.length,
        });
        mergedVisibleIndexOffset += mesh.indices.length;
      }
      visibleBuilt += 1;
      post({
        type: "mesh_progress",
        payload: {
          ...mergedVisible,
          generatedParts: mergedVisibleParts.map((p) => ({ ...p })),
          phase: "toe_sections",
          current: visibleBuilt,
          total: visibleTotal,
          label: sec.name,
        },
      });
    }
    for (const key of Array.from(cachedToeSectionMeshByKey.keys())) {
      if (!activeSectionMeshKeys.has(key)) cachedToeSectionMeshByKey.delete(key);
    }
    post({
      type: "status",
      message: `[toe_sections] visible=${visibleBuilt} hidden=${Math.max(0, rawSections.length - visibleBuilt)}`,
    });
    if (!mergedVisible || mergedVisibleParts.length === 0) {
      return { mesh: null as any, parts: [] as GeneratedMeshPart[], reused: true, shapeReused: s.reused };
    }
    const merged = mergedVisible;
    const parts = mergedVisibleParts;
    return { mesh: merged, parts, reused: allReused, shapeReused: s.reused };
  }

  const key = `${s.sig}|tol=${tolKey(tolerance)}`;
  if (cachedToeCombinedMesh && cachedToeCombinedMeshKey === key) {
    return { mesh: cachedToeCombinedMesh, parts: [] as GeneratedMeshPart[], reused: true, shapeReused: s.reused };
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

  return { mesh: m, parts: [] as GeneratedMeshPart[], reused: false, shapeReused: s.reused };
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
let buildTraceCounter = 0;

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
      buildTraceCounter += 1;
      const buildId = `build-${Date.now()}-${buildTraceCounter}`;
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
      const traceOps: string[] = [];
      const trace = (line: string) => traceOps.push(line);
      trace(
        `start: tol=${tolKey(tolerance)} base=${baseEnabled ? "on" : "off"} toe=${toeEnabled ? (toeWithB ? "A->B->C" : "A->C") : "off"} heel=${heelEnabled ? "on" : "off"}`
      );

      if (fil1 > 0.001) {
        const toePath = toeWithB ? "A->B->C" : "A->C";
        const fil1Applies = true; // fil_1 affects profile A, which exists in both modes
        trace(`fil_1 debug active: ${fil1.toFixed(2)} path=${toePath}`);
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
      trace(`base: shape=${baseEnabled ? (base.shapeReused ? "reused" : "rebuilt") : "off"} mesh=${baseEnabled ? (base.reused ? "cached" : "meshed") : "off"}`);
      const toeABC = await getToeCombinedMesh(params, toeEnabled, tolerance, {
        freezeRefit: freezeToeRefit,
        forceRefit: forceFullRefit,
      });
      trace(
        `toe: shape=${toeEnabled ? (toeABC.shapeReused ? "reused" : "rebuilt") : "off"} mesh=${toeEnabled ? (toeABC.reused ? "cached" : "meshed") : "off"} mode=${toeWithB ? "A->B->C" : "A->C"}`
      );
      const heel = await getHeelMesh(params, heelEnabled, tolerance, {
        freezeRefit: freezeHeelRefit,
        forceRefit: forceFullRefit || forceHeelRefit,
      });
      trace(`heel: shape=${heelEnabled ? (heel.shapeReused ? "reused" : "rebuilt") : "off"} mesh=${heelEnabled ? (heel.reused ? "cached" : "meshed") : "off"}`);

      const entriesToMerge: Array<{ mesh: ReturnType<typeof toStdMesh>; parts: GeneratedMeshPart[] }> = [];
      const separateMeshes: BuildTracePart[] = [];
      if (baseEnabled && base.mesh) {
        const stats = meshStats(base.mesh);
        separateMeshes.push({
          id: "generated:baseplate",
          name: "Baseplate",
          enabled: true,
          shapeState: base.shapeReused ? "reused" : "rebuilt",
          meshState: base.reused ? "cached" : "meshed",
          verts: stats.verts,
          tris: stats.tris,
        });
        entriesToMerge.push({
          mesh: base.mesh,
          parts: [{ id: "generated:baseplate", name: "Baseplate", start: 0, count: base.mesh.indices.length }],
        });
      } else {
        separateMeshes.push({
          id: "generated:baseplate",
          name: "Baseplate",
          enabled: false,
          shapeState: "off",
          meshState: "off",
          verts: 0,
          tris: 0,
        });
      }
      if (toeEnabled && toeABC.mesh) {
        const stats = meshStats(toeABC.mesh);
        separateMeshes.push({
          id: "generated:toe",
          name: toeWithB ? "Toe Loft (A->B->C)" : "Toe Loft (A->C)",
          enabled: true,
          shapeState: toeABC.shapeReused ? "reused" : "rebuilt",
          meshState: toeABC.reused ? "cached" : "meshed",
          verts: stats.verts,
          tris: stats.tris,
        });
        entriesToMerge.push({
          mesh: toeABC.mesh,
          parts: toeABC.parts && toeABC.parts.length
            ? toeABC.parts.map((p) => ({ id: p.id, name: p.name, start: p.start, count: p.count }))
            : [{ id: "generated:toe", name: "Toe Loft", start: 0, count: toeABC.mesh.indices.length }],
        });
      } else {
        separateMeshes.push({
          id: "generated:toe",
          name: toeWithB ? "Toe Loft (A->B->C)" : "Toe Loft (A->C)",
          enabled: !!toeEnabled,
          shapeState: toeEnabled ? "rebuilt" : "off",
          meshState: "off",
          verts: 0,
          tris: 0,
        });
      }
      if (heelEnabled && heel.mesh) {
        const stats = meshStats(heel.mesh);
        separateMeshes.push({
          id: "generated:heel",
          name: "Heel Loft",
          enabled: true,
          shapeState: heel.shapeReused ? "reused" : "rebuilt",
          meshState: heel.reused ? "cached" : "meshed",
          verts: stats.verts,
          tris: stats.tris,
        });
        entriesToMerge.push({
          mesh: heel.mesh,
          parts: [{ id: "generated:heel", name: "Heel Loft", start: 0, count: heel.mesh.indices.length }],
        });
      } else {
        separateMeshes.push({
          id: "generated:heel",
          name: "Heel Loft",
          enabled: false,
          shapeState: "off",
          meshState: "off",
          verts: 0,
          tris: 0,
        });
      }

      if (entriesToMerge.length === 0) {
        trace("merge: no enabled mesh entries");
        post({
          type: "build_trace",
          payload: {
            buildId,
            tolerance: clamp(Number(tolerance) || 1.5, 0.05, 10),
            toggles: { baseEnabled, toeEnabled, toeWithB, heelEnabled },
            operations: traceOps,
            separateMeshes,
            mergedMeshes: [],
            generatedParts: [],
          },
        });
        post({ type: "mesh", payload: { positions: [], indices: [], normals: undefined } });
        post({ type: "status", message: "ready (nothing enabled)" });
        return;
      }

      trace(`merge: entries=${entriesToMerge.length}`);
      let merged = entriesToMerge[0].mesh;
      const generatedParts: GeneratedMeshPart[] = entriesToMerge[0].parts.map((p) => ({ ...p }));
      let indexOffset = entriesToMerge[0].mesh.indices.length;
      for (let i = 1; i < entriesToMerge.length; i++) {
        const entry = entriesToMerge[i];
        merged = mergeMeshes(merged, entry.mesh);
        for (const p of entry.parts) {
          generatedParts.push({
            id: p.id,
            name: p.name,
            start: indexOffset + p.start,
            count: p.count,
          });
        }
        indexOffset += entry.mesh.indices.length;
      }
      const mergedStats = meshStats(merged);
      trace(`merge: combined verts=${mergedStats.verts} tris=${mergedStats.tris}`);

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

      post({
        type: "build_trace",
        payload: {
          buildId,
          tolerance: clamp(Number(tolerance) || 1.5, 0.05, 10),
          toggles: { baseEnabled, toeEnabled, toeWithB, heelEnabled },
          operations: traceOps,
          separateMeshes,
          mergedMeshes: [
            {
              id: "generated:preview_combined",
              name: "Preview Combined Mesh",
              contributors: generatedParts.map((p) => p.name),
              verts: mergedStats.verts,
              tris: mergedStats.tris,
            },
          ],
          generatedParts: generatedParts.map((p) => ({ ...p })),
        },
      });

      post({ type: "mesh", payload: { ...merged, generatedParts } });
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
