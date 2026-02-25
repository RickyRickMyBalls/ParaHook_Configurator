// FILE: src/main.ts
import "./style.css";
import { Viewer } from "./viewer";

const BASE = import.meta.env.BASE_URL;

type ModelParams = Record<string, number>;

type PartToggles = {
  baseEnabled: boolean;
  toeBEnabled: boolean;
  toeCEnabled: boolean;
  heelEnabled: boolean;
};

type BuildPayload = {
  params: ModelParams;
  tolerance: number;
} & PartToggles;

type ExportPayload = {
  params: ModelParams;
  filename: string;
} & PartToggles;

type WorkerIn =
  | { type: "status"; message: string }
  | { type: "error"; message: string }
  | { type: "mesh"; payload: any }
  | { type: "pong" }
  | { type: "file"; filename: string; mime: string; buffer: ArrayBuffer };

type WorkerOut =
  | { type: "ping" }
  | { type: "build"; payload: BuildPayload }
  | { type: "export_stl"; payload: ExportPayload }
  | { type: "export_step"; payload: ExportPayload };

function mustEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}
function readNumber(input: HTMLInputElement, fallback: number): number {
  const v = Number(input.value);
  return Number.isFinite(v) ? v : fallback;
}
function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
function clampInt(n: number, lo: number, hi: number) {
  return Math.round(clamp(n, lo, hi));
}
function num(v: any, f: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
}

const canvas = mustEl<HTMLCanvasElement>("c");
const viewer = new Viewer(canvas);

// -----------------------------
// Debug panel logger
// -----------------------------
const logEl = document.getElementById("log") as HTMLPreElement | null;
function log(line: string) {
  if (!logEl) return;
  const t = new Date().toLocaleTimeString();
  logEl.textContent = `[${t}] ${line}\n` + (logEl.textContent ?? "");
}
viewer.setOnShoeStatus((line) => log(line));

// -----------------------------
// Premade Hooks (4 checkboxes -> 4 STEP overlays)
// -----------------------------
const hookSmallEl = mustEl<HTMLInputElement>("hookSmallEnabled");
const hookMediumEl = mustEl<HTMLInputElement>("hookMediumEnabled");
const hookLargeEl = mustEl<HTMLInputElement>("hookLargeEnabled");
const hookXLEl = mustEl<HTMLInputElement>("hookXLEnabled");

viewer.loadHookSTEP(1 as const, `${BASE}hooks/small.step`);
viewer.loadHookSTEP(2 as const, `${BASE}hooks/medium.step`);
viewer.loadHookSTEP(3 as const, `${BASE}hooks/large.step`);
viewer.loadHookSTEP(4 as const, `${BASE}hooks/xl.step`);

function applyHookUIToViewer() {
  viewer.setHookVisible(1, !!hookSmallEl.checked);
  viewer.setHookVisible(2, !!hookMediumEl.checked);
  viewer.setHookVisible(3, !!hookLargeEl.checked);
  viewer.setHookVisible(4, !!hookXLEl.checked);
}
applyHookUIToViewer();

hookSmallEl.addEventListener("change", applyHookUIToViewer);
hookMediumEl.addEventListener("change", applyHookUIToViewer);
hookLargeEl.addEventListener("change", applyHookUIToViewer);
hookXLEl.addEventListener("change", applyHookUIToViewer);

// -----------------------------
// Premade Hooks transform sliders
// -----------------------------
const hookXEl = mustEl<HTMLInputElement>("hookX");
const hookYEl = mustEl<HTMLInputElement>("hookY");
const hookZEl = mustEl<HTMLInputElement>("hookZ");
const hookRotEl = mustEl<HTMLInputElement>("hookRot");

const hookXVal = document.getElementById("hookXVal") as HTMLInputElement | null;
const hookYVal = document.getElementById("hookYVal") as HTMLInputElement | null;
const hookZVal = document.getElementById("hookZVal") as HTMLInputElement | null;
const hookRotVal = document.getElementById("hookRotVal") as HTMLInputElement | null;

function syncHookLabels() {
  if (hookXVal) hookXVal.value = hookXEl.value;
  if (hookYVal) hookYVal.value = hookYEl.value;
  if (hookZVal) hookZVal.value = hookZEl.value;
  if (hookRotVal) hookRotVal.value = hookRotEl.value;
}

function applyHookTransformUIToViewer() {
  const dx = clamp(readNumber(hookXEl, 0), -150, 150);
  const dy = clamp(readNumber(hookYEl, 0), -150, 150);
  const dz = clamp(readNumber(hookZEl, 0), -100, 100);
  const rz = clamp(readNumber(hookRotEl, 0), -180, 180);

  ([1, 2, 3, 4] as const).forEach((id) => {
    viewer.setHookOffset(id, dx, dy, dz);
    viewer.setHookRotationDeg(id, 0, 0, rz);
  });

  syncHookLabels();
}
applyHookTransformUIToViewer();

[hookXEl, hookYEl, hookZEl, hookRotEl].forEach((el) => {
  el.addEventListener("input", applyHookTransformUIToViewer);
  el.addEventListener("change", applyHookTransformUIToViewer);
});

// -----------------------------
// Reference FOOTPADS
// -----------------------------
const footpad1EnabledEl = mustEl<HTMLInputElement>("footpad1Enabled");
const footpad2EnabledEl = mustEl<HTMLInputElement>("footpad2Enabled");
const footpad3EnabledEl = mustEl<HTMLInputElement>("footpad3Enabled");

const footpadXEl = mustEl<HTMLInputElement>("footpadX");
const footpadYEl = mustEl<HTMLInputElement>("footpadY");
const footpadZEl = mustEl<HTMLInputElement>("footpadZ");
const footpadRotEl = mustEl<HTMLInputElement>("footpadRot");

log("footpads: initializing...");

viewer.loadFootpad(1, `${BASE}footpad1.stl`);
viewer.loadFootpad(2, `${BASE}footpad2.stl`);
viewer.loadFootpad(3, `${BASE}footpad3.stl`);

viewer.setFootpadUnitScale(25.4);

function applyFootpadUIToViewer() {
  viewer.setFootpadVisible(1, !!footpad1EnabledEl.checked);
  viewer.setFootpadVisible(2, !!footpad2EnabledEl.checked);
  viewer.setFootpadVisible(3, !!footpad3EnabledEl.checked);

  const dx = clamp(readNumber(footpadXEl, 0), -100, 150);
  const dy = clamp(readNumber(footpadYEl, 0), -100, 150);
  const dz = clamp(readNumber(footpadZEl, 0), -100, 100);
  viewer.setFootpadOffset(dx, dy, dz);

  const rz = clamp(readNumber(footpadRotEl, 0), -180, 180);
  viewer.setFootpadRotationDeg(0, 0, rz);
}
applyFootpadUIToViewer();

[footpad1EnabledEl, footpad2EnabledEl, footpad3EnabledEl].forEach((el) =>
  el.addEventListener("change", applyFootpadUIToViewer)
);
[footpadXEl, footpadYEl, footpadZEl, footpadRotEl].forEach((el) =>
  el.addEventListener("input", applyFootpadUIToViewer)
);

// -----------------------------
// Shoe reference UI
// -----------------------------
const shoeEnabledEl = mustEl<HTMLInputElement>("shoeEnabled");
const shoeScaleEl = mustEl<HTMLInputElement>("shoeScale");
const shoeAlphaEl = mustEl<HTMLInputElement>("shoeAlpha");
const shoeXEl = mustEl<HTMLInputElement>("shoeX");
const shoeYEl = mustEl<HTMLInputElement>("shoeY");
const shoeZEl = mustEl<HTMLInputElement>("shoeZ");
const shoeRotEl = mustEl<HTMLInputElement>("shoeRot");

viewer.loadOBJ(`${BASE}shoe.obj`);

const SHOE_BASE_UNIT_SCALE = 60;
const SHOE_BASE_ROT = { x: 90, y: 0, z: 0 };
const SHOE_BASE_OFFSET = { x: 45, y: 102, z: 45 };

viewer.setShoeUnitScale(SHOE_BASE_UNIT_SCALE);

function applyShoeUIToViewer() {
  viewer.setShoeVisible(!!shoeEnabledEl.checked);

  const s = clamp(Number(shoeScaleEl.value) || 1.0, 0.5, 2.0);
  viewer.setShoeScale(s);

  const tRaw = Number(shoeAlphaEl.value);
  const t = clamp(Number.isFinite(tRaw) ? tRaw : 0.5, 0, 1);
  viewer.setShoeTransparency(t);

  const dx = clamp(readNumber(shoeXEl, 0), -5000, 5000);
  const dy = clamp(readNumber(shoeYEl, 0), -5000, 5000);
  const dz = clamp(readNumber(shoeZEl, 0), -5000, 5000);

  viewer.setShoeOffset(SHOE_BASE_OFFSET.x + dx, SHOE_BASE_OFFSET.y + dy, SHOE_BASE_OFFSET.z + dz);

  const rz = clamp(readNumber(shoeRotEl, 0), -360, 360);
  viewer.setShoeRotationDeg(SHOE_BASE_ROT.x, SHOE_BASE_ROT.y, rz);
}
applyShoeUIToViewer();

shoeEnabledEl.addEventListener("change", applyShoeUIToViewer);
shoeAlphaEl.addEventListener("input", applyShoeUIToViewer);
shoeScaleEl.addEventListener("input", applyShoeUIToViewer);
[shoeXEl, shoeYEl, shoeZEl, shoeRotEl].forEach((el) => el.addEventListener("input", applyShoeUIToViewer));

// -----------------------------
// Main UI (parametric model)
// -----------------------------
const statusEl = mustEl<HTMLDivElement>("status");
const rebuildBtn = mustEl<HTMLButtonElement>("rebuild");
const exportStlBtn = mustEl<HTMLButtonElement>("exportStl");
const exportStepBtn = mustEl<HTMLButtonElement>("exportStep");

const modelEnabledEl = mustEl<HTMLInputElement>("modelEnabled");

const vizBasePtsEl = mustEl<HTMLInputElement>("vizBasePts");

const vizAArcPtsEl = mustEl<HTMLInputElement>("vizAArcPts");
const vizBArcPtsEl = mustEl<HTMLInputElement>("vizBArcPts");
const vizCArcPtsEl = mustEl<HTMLInputElement>("vizCArcPts");
const vizHeelArcPtsEl = mustEl<HTMLInputElement>("vizHeelArcPts");

// Section cut UI (viewer-only)
const sectionCutEnabledEl = mustEl<HTMLInputElement>("sectionCutEnabled");
const sectionCutFlipEl = mustEl<HTMLInputElement>("sectionCutFlip");
const sectionCutZswitchEl = mustEl<HTMLInputElement>("sectionCutZswitch");
const sectionCutOffsetEl = mustEl<HTMLInputElement>("sectionCutOffset");

const baseEnabledEl = mustEl<HTMLInputElement>("baseEnabled");
const toeBEnabledEl = mustEl<HTMLInputElement>("toeBEnabled");
const toeCEnabledEl = mustEl<HTMLInputElement>("toeCEnabled");
const heelEnabledEl = mustEl<HTMLInputElement>("heelEnabled");

const tolEl = mustEl<HTMLInputElement>("tolerance");
const tolVal = mustEl<HTMLInputElement>("toleranceVal");

function setStatus(msg: string) {
  statusEl.textContent = msg;
  log(`status: ${msg}`);
}
function isModelEnabled() {
  return !!modelEnabledEl.checked;
}
function setBusy(busy: boolean) {
  const modelOn = isModelEnabled();
  rebuildBtn.disabled = busy || !modelOn;
  exportStlBtn.disabled = busy || !modelOn;
  exportStepBtn.disabled = busy || !modelOn;
}

// -----------------------------
// Named parameter wiring (matches index.html ids)
// -----------------------------
const paramIds: string[] = [
  // Baseplate: Dimensions
  "bp_len",
  "bp_wid",
  "bp_thk",
  "bp_heelPct",
  "bp_toePct",
  "bp_p2x",
  "bp_p3x",
  "bp_p4x",

  // Baseplate: Screw holes
  "bp_sh_x",
  "bp_sh_y",
  "bp_sh_dia",
  "bp_sh_slot",
  "bp_sh_dist",
  "bp_sh_ang",

  // Toe: shared
  "toe_thk",

  // Toe A
  "toe_a_p1s",
  "toe_a_p3s",
  "toe_a_endx",
  "toe_a_endz",
  "toe_a_enda",
  "toe_a_strength",

  // Toe B
  "toe_b_sta",
  "toe_ab_mid",
  "toe_b_p1s",
  "toe_b_p3s",
  "toe_b_endx",
  "toe_b_endz",
  "toe_b_enda",
  "toe_b_strength",

  // Toe C
  "toe_c_sta",
  "toe_bc_mid",
  "toe_c_p1s",
  "toe_c_p3s",
  "toe_c_endx",
  "toe_c_endz",
  "toe_c_enda",
  "toe_c_strength",

  // Heel
  "heel_h_c",
  "heel_h_d",
  "heel_cd_mid",
  "heel_f1",
  "heel_f2",

  // Fillets
  "fil_1",
  "fil_2",
  "fil_3",
  "fil_4",
  "fil_5",
];

const paramEls = paramIds.map((id) => mustEl<HTMLInputElement>(id));
const paramValEls = paramIds.map((id) => document.getElementById(`${id}Val`) as HTMLInputElement | null);
const toeCEndZEl = mustEl<HTMLInputElement>("toe_c_endz");
const heelHCEl = mustEl<HTMLInputElement>("heel_h_c");
const heelHDEl = mustEl<HTMLInputElement>("heel_h_d");
const heelHCValEl = document.getElementById("heel_h_cVal") as HTMLInputElement | null;
const heelHDValEl = document.getElementById("heel_h_dVal") as HTMLInputElement | null;

// -----------------------------
// Auto B-C intermediate profiles (toe_bc_mid)
// - Auto-fills toe_bc_mid unless user has manually adjusted it
// - User can re-enable auto by setting toe_bc_mid back to 0
// -----------------------------
const toeBCMidEl = mustEl<HTMLInputElement>("toe_bc_mid");
let toeBCMidUserTouched = false;

toeBCMidEl.addEventListener("input", () => {
  if (Number(toeBCMidEl.value) !== 0) toeBCMidUserTouched = true;
});

function readParams(): ModelParams {
  enforceHeelHeightMaxFromToeC();
  const p: ModelParams = {};
  for (let i = 0; i < paramIds.length; i++) {
    p[paramIds[i]] = readNumber(paramEls[i], 0);
  }
  return p;
}

function enforceHeelHeightMaxFromToeC() {
  const maxHeel = clamp(readNumber(toeCEndZEl, 65), 0.1, 2000);
  const maxStr = String(maxHeel);

  [heelHCEl, heelHDEl].forEach((el) => {
    el.max = maxStr;
    const v = clamp(readNumber(el, 0), 0, maxHeel);
    const vStr = String(v);
    if (el.value !== vStr) el.value = vStr;
  });

  if (heelHCValEl) {
    heelHCValEl.max = maxStr;
    heelHCValEl.value = heelHCEl.value;
  }
  if (heelHDValEl) {
    heelHDValEl.max = maxStr;
    heelHDValEl.value = heelHDEl.value;
  }
}

function computeSuggestedToeBCMid(p: ModelParams): number {
  const staB = clamp(num(p.toe_b_sta, 60), 1, 2000);
  const staC = clamp(num(p.toe_c_sta, 137), 1, 2000);
  const delta = Math.max(0, staC - staB);

  // 5mm = smoother (more profiles), 10mm = faster
  const targetSpacingMm = 5;

  return clampInt(delta / targetSpacingMm, 0, 200);
}

function applyAutoToeBCMidUI() {
  const current = Number(toeBCMidEl.value) || 0;

  // If user explicitly set 0, treat it as "auto"
  const allowAuto = !toeBCMidUserTouched || current === 0;
  if (!allowAuto) return;

  const p = readParams();
  const suggested = computeSuggestedToeBCMid(p);

  toeBCMidEl.value = String(suggested);
}

function syncLabels() {
  enforceHeelHeightMaxFromToeC();
  tolVal.value = tolEl.value;
  for (let i = 0; i < paramEls.length; i++) {
    const v = paramValEls[i];
    if (v) v.value = paramEls[i].value;
  }
}

function readTolerance(): number {
  return clamp(readNumber(tolEl, 1.5), 0.3, 3.0);
}

// viewer-only section cut wiring
function applySectionCutUIToViewer() {
  const enabled = !!sectionCutEnabledEl.checked;
  const flip = !!sectionCutFlipEl.checked;

  // unchecked = Section (XZ), checked = Plan (XY)
  const plane = sectionCutZswitchEl.checked ? ("XY" as const) : ("XZ" as const);

  const offset = clamp(readNumber(sectionCutOffsetEl, 0), -5000, 5000);

  viewer.setSectionCut({
    enabled,
    flip,
    plane,
    offset,
  });
}

// -----------------------------
// Baseplate viz helpers
// -----------------------------
type XYZ = { x: number; y: number; z: number };
type Pt2 = { x: number; y: number };

function computeControlPoints(p: Record<string, number>): Pt2[] {
  const baseLen = clamp(Number(p.bp_len ?? 195), 50, 2000);
  const heelPct = clamp(Number(p.bp_heelPct ?? 67), 1, 100);
  const toePct = clamp(Number(p.bp_toePct ?? 46), 1, 100);

  const p2x = Number(p.bp_p2x ?? -14);
  const p3x = Number(p.bp_p3x ?? -2);
  const p4x = Number(p.bp_p4x ?? 1);

  const p3y = clamp((baseLen * heelPct) / 100, 1, baseLen - 0.001);
  const p2y = clamp((p3y * toePct) / 100, 0.001, p3y - 0.001);

  return [
    { x: 0, y: 0 },
    { x: p2x, y: p2y },
    { x: p3x, y: p3y },
    { x: p4x, y: baseLen },
  ];
}

function updateBaseplateViz() {
  const p = readParams() as any;
  const ctrl2 = computeControlPoints(p);

  viewer.setControlPoints(ctrl2.map((q) => ({ x: q.x, y: q.y, z: 0 })));
  viewer.setBaseplateVizVisible(!!vizBasePtsEl.checked);
}

// -----------------------------
// Arc viz math
// -----------------------------
type Pt = { x: number; y: number };
type Pt3 = { x: number; y: number; z: number };

function vlen2(a: Pt) {
  return Math.hypot(a.x, a.y);
}
function vnorm2(a: Pt): Pt {
  const l = vlen2(a);
  return l > 1e-9 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 1 };
}
function dist2(a: Pt, b: Pt) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;

  const ax = 2 * p1.x;
  const ay = 2 * p1.y;

  const bx = (p2.x - p0.x) * t;
  const by = (p2.y - p0.y) * t;

  const cx = (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2;
  const cy = (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2;

  const dx = (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3;
  const dy = (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3;

  return { x: 0.5 * (ax + bx + cx + dx), y: 0.5 * (ay + by + cy + dy) };
}

function catmullRomDeriv(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;

  const bx = p2.x - p0.x;
  const by = p2.y - p0.y;

  const cx = (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * (2 * t);
  const cy = (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * (2 * t);

  const dx = (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * (3 * t2);
  const dy = (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * (3 * t2);

  return { x: 0.5 * (bx + cx + dx), y: 0.5 * (by + cy + dy) };
}

function catmullRom3(p0: Pt3, p1: Pt3, p2: Pt3, p3: Pt3, t: number): Pt3 {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (p2.x - p0.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (p2.y - p0.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    z:
      0.5 *
      (2 * p1.z +
        (p2.z - p0.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  };
}

function bezier3_2d(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  };
}

function bezier3Deriv2d(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: 3 * (u * u * (p1.x - p0.x) + 2 * u * t * (p2.x - p1.x) + t * t * (p3.x - p2.x)),
    y: 3 * (u * u * (p1.y - p0.y) + 2 * u * t * (p2.y - p1.y) + t * t * (p3.y - p2.y)),
  };
}

function dirFromDeg2(deg: number): Pt {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

function toeInnerEndLocal(endX: number, endZ: number, p1s: number, p3s: number, endAngDeg: number, off: number): Pt {
  const P0: Pt = { x: 0, y: 0 };
  const P3: Pt = { x: endX, y: endZ };
  const span = Math.hypot(P3.x - P0.x, P3.y - P0.y);
  const offSafe = clamp(off, 0.2, Math.max(0.2, span * 0.45));
  const P1: Pt = { x: 0, y: clamp(p1s, 0, 10000) };

  const dir = dirFromDeg2(endAngDeg - 180);
  const p3 = clamp(p3s, 0, Math.max(1, span * 1.5));
  let P2: Pt = { x: P3.x - dir.x * p3, y: P3.y - dir.y * p3 };
  P2 = { x: P2.x, y: Math.max(0, P2.y) };

  const mid: Pt = { x: (P0.x + P3.x) * 0.5, y: (P0.y + P3.y) * 0.5 };
  const testP = bezier3_2d(P0, P1, P2, P3, 0.5);
  const dvMid = vnorm2(bezier3Deriv2d(P0, P1, P2, P3, 0.5));
  const nLeftMid = vnorm2({ x: -dvMid.y, y: dvMid.x });
  const cand1 = { x: testP.x + nLeftMid.x * offSafe, y: testP.y + nLeftMid.y * offSafe };
  const cand2 = { x: testP.x - nLeftMid.x * offSafe, y: testP.y - nLeftMid.y * offSafe };
  const inwardSign = dist2(cand1, mid) < dist2(cand2, mid) ? 1 : -1;

  const dvEnd = vnorm2(bezier3Deriv2d(P0, P1, P2, P3, 1));
  const nLeftEnd = vnorm2({ x: -dvEnd.y, y: dvEnd.x });
  return {
    x: P3.x + nLeftEnd.x * offSafe * -inwardSign,
    y: Math.max(0, P3.y + nLeftEnd.y * offSafe * -inwardSign),
  };
}

function localToWorldAtStation(st: { pt: Pt; tan: Pt }, local: Pt): Pt3 {
  const t = vnorm2(st.tan);
  const u = { x: -t.y, y: t.x, z: 0 };
  const o = { x: st.pt.x, y: st.pt.y, z: 0 };
  return { x: o.x + u.x * local.x, y: o.y + u.y * local.x, z: o.z + local.y };
}

function findEndIdxByArcLen(pts: Pt[], targetLen: number) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += dist2(pts[i - 1], pts[i]);
    if (acc >= targetLen) return i;
  }
  return pts.length - 1;
}

function sampleSpineMain(p: Record<string, number>) {
  const baseLen = clamp(num(p.bp_len, 195), 50, 2000);
  const heelPct = clamp(num(p.bp_heelPct, 67), 1, 100);
  const toePct = clamp(num(p.bp_toePct, 46), 1, 100);

  const p2x = clamp(num(p.bp_p2x, -14), -1000, 1000);
  const p3x = clamp(num(p.bp_p3x, -2), -1000, 1000);
  const p4x = clamp(num(p.bp_p4x, 1), -1000, 1000);

  const p3y = clamp((baseLen * heelPct) / 100, 1, baseLen - 0.001);
  const p2y = clamp((p3y * toePct) / 100, 0.001, p3y - 0.001);

  const spineCtrl: Pt[] = [
    { x: 0, y: 0 },
    { x: p2x, y: p2y },
    { x: p3x, y: p3y },
    { x: p4x, y: baseLen },
  ];

  const samplesPerSegment = 60;
  const P: Pt[] = [spineCtrl[0], ...spineCtrl, spineCtrl[spineCtrl.length - 1]];

  const spinePts: Pt[] = [];
  const spineTan: Pt[] = [];

  for (let seg = 0; seg < spineCtrl.length - 1; seg++) {
    const p0 = P[seg + 0];
    const p1 = P[seg + 1];
    const p2 = P[seg + 2];
    const p3 = P[seg + 3];

    for (let i = 0; i <= samplesPerSegment; i++) {
      if (seg > 0 && i === 0) continue;
      const t = i / samplesPerSegment;
      spinePts.push(catmullRom(p0, p1, p2, p3, t));
      spineTan.push(vnorm2(catmullRomDeriv(p0, p1, p2, p3, t)));
    }
  }

  return { spinePts, spineTan };
}

function rotateZDegOnYAxis(angDeg: number): { x: number; y: number; z: number } {
  const a = (angDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: -s, y: c, z: 0 };
}

function sectionAngleDegFromTan(tan: Pt) {
  return (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
}

function arc3PointsAtStation(
  station: Pt,
  tan: Pt,
  localCtrlX: number,
  localCtrlZ: number,
  localEndX: number,
  localEndZ: number
): XYZ[] {
  const ang = sectionAngleDegFromTan(tan);

  const u = rotateZDegOnYAxis(ang);
  const v = { x: 0, y: 0, z: 1 };

  const o = { x: station.x, y: station.y, z: 0 };

  const p0 = o;
  const p1 = {
    x: o.x + u.x * localCtrlX + v.x * localCtrlZ,
    y: o.y + u.y * localCtrlX + v.y * localCtrlZ,
    z: o.z + u.z * localCtrlX + v.z * localCtrlZ,
  };
  const p2 = {
    x: o.x + u.x * localEndX + v.x * localEndZ,
    y: o.y + u.y * localEndX + v.y * localEndZ,
    z: o.z + u.z * localEndX + v.z * localEndZ,
  };

  return [p0, p1, p2];
}

function updateArcViz() {
  const p = readParams() as any;

  viewer.setAArcVizVisible(!!vizAArcPtsEl.checked);
  viewer.setBArcVizVisible(!!vizBArcPtsEl.checked);
  viewer.setCArcVizVisible(!!vizCArcPtsEl.checked);
  viewer.setHeelArcVizVisible(!!vizHeelArcPtsEl.checked);

  if (!vizAArcPtsEl.checked && !vizBArcPtsEl.checked && !vizCArcPtsEl.checked && !vizHeelArcPtsEl.checked) return;

  const { spinePts, spineTan } = sampleSpineMain(p);

  const stA = { pt: spinePts[0], tan: spineTan[0] };

  const stationB = clamp(num(p.toe_b_sta, 60), 1, 2000);
  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);
  const stB = { pt: spinePts[idxB], tan: spineTan[idxB] };

  const stationC = clamp(num(p.toe_c_sta, 137), 1, 2000);
  let idxC = findEndIdxByArcLen(spinePts, stationC);
  idxC = clamp(idxC, idxB + 1, spinePts.length - 1);
  const stC = { pt: spinePts[idxC], tan: spineTan[idxC] };

  // Mirror X for the arc controls (matches existing behavior)
  const sx = -1;

  // A controls
  const A_arcX = clamp(num(p.toe_a_p1s, 25), -2000, 2000) * sx;
  const A_arcZ = clamp(num(p.toe_a_p3s, 35), -2000, 2000);
  const A_endX = clamp(num(p.toe_a_endx, 47), 0.1, 2000) * sx;
  const A_endZ = clamp(num(p.toe_a_endz, 35), 0.1, 2000);

  // B controls
  const B_arcX = clamp(num(p.toe_b_p1s, 25), -2000, 2000) * sx;
  const B_arcZ = clamp(num(p.toe_b_p3s, 35), -2000, 2000);
  const B_endX = clamp(num(p.toe_b_endx, 20), 0.1, 2000) * sx;
  const B_endZ = clamp(num(p.toe_b_endz, 50), 0.1, 2000);

  // C controls
  const C_arcX = clamp(num(p.toe_c_p1s, 25), -2000, 2000) * sx;
  const C_arcZ = clamp(num(p.toe_c_p3s, 35), -2000, 2000);
  const C_endX = clamp(num(p.toe_c_endx, 19), 0.1, 2000) * sx;
  const C_endZ = clamp(num(p.toe_c_endz, 65), 0.1, 2000);

  // Rail debug overlay (reuses existing arc-point groups):
  // A = sampled OUTER rail, B = sampled INNER rail, C = outer anchors, Heel = inner anchors
  const toeThk = clamp(num(p.toe_thk, 12), 0.2, 80);
  const A_enda = clamp(num(p.toe_a_enda, 0), -180, 180);
  const B_enda = clamp(num(p.toe_b_enda, 0), -180, 180);
  const C_enda = clamp(num(p.toe_c_enda, 0), -180, 180);

  const A_endW = localToWorldAtStation(stA, { x: A_endX, y: A_endZ });
  const B_endW = localToWorldAtStation(stB, { x: B_endX, y: B_endZ });
  const C_endW = localToWorldAtStation(stC, { x: C_endX, y: C_endZ });

  const A_inW = localToWorldAtStation(stA, toeInnerEndLocal(A_endX, A_endZ, A_arcX / sx, A_arcZ, A_enda, toeThk));
  const B_inW = localToWorldAtStation(stB, toeInnerEndLocal(B_endX, B_endZ, B_arcX / sx, B_arcZ, B_enda, toeThk));
  const C_inW = localToWorldAtStation(stC, toeInnerEndLocal(C_endX, C_endZ, C_arcX / sx, C_arcZ, C_enda, toeThk));

  let lenAB = 0;
  for (let i = 1; i <= idxB; i++) lenAB += dist2(spinePts[i - 1], spinePts[i]);
  let lenBC = 0;
  for (let i = idxB + 1; i <= idxC; i++) lenBC += dist2(spinePts[i - 1], spinePts[i]);
  lenBC = Math.max(1e-6, lenBC);
  const lenAC = lenAB + lenBC;
  const railSamples = 80;
  const outerRailPts: XYZ[] = [];
  const innerRailPts: XYZ[] = [];
  for (let i = 0; i <= railSamples; i++) {
    const sAbs = (lenAC * i) / railSamples;
    if (sAbs <= lenAB) {
      const tAB = lenAB <= 1e-9 ? 0 : clamp(sAbs / lenAB, 0, 1);
      outerRailPts.push(catmullRom3(A_endW, A_endW, B_endW, C_endW, tAB));
      innerRailPts.push(catmullRom3(A_inW, A_inW, B_inW, C_inW, tAB));
    } else {
      const tBC = lenBC <= 1e-9 ? 0 : clamp((sAbs - lenAB) / lenBC, 0, 1);
      outerRailPts.push(catmullRom3(A_endW, B_endW, C_endW, C_endW, tBC));
      innerRailPts.push(catmullRom3(A_inW, B_inW, C_inW, C_inW, tBC));
    }
  }

  if (vizAArcPtsEl.checked) viewer.setAArcPoints(outerRailPts);
  if (vizBArcPtsEl.checked) viewer.setBArcPoints(innerRailPts);
  if (vizCArcPtsEl.checked) viewer.setCArcPoints([A_endW, B_endW, C_endW]);
  if (vizHeelArcPtsEl.checked) viewer.setHeelArcPoints([A_inW, B_inW, C_inW]);
}

function downloadArrayBuffer(buffer: ArrayBuffer, filename: string, mime: string) {
  const blob = new Blob([buffer], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const worker = new Worker(new URL("./cad/worker.ts", import.meta.url), { type: "module" });

function asFloat32(x: any): Float32Array {
  if (x instanceof Float32Array) return x;
  if (ArrayBuffer.isView(x) && x.buffer) return new Float32Array(x.buffer, x.byteOffset, Math.floor(x.byteLength / 4));
  if (Array.isArray(x)) return new Float32Array(x);
  throw new Error("positions/normals not array-like");
}

function asIndexArray(x: any, vertCount: number): Uint16Array | Uint32Array {
  if (x instanceof Uint16Array || x instanceof Uint32Array) return x;
  if (ArrayBuffer.isView(x) && x.buffer) {
    const arr = Array.from(x as any).map((v) => Number(v)) as number[];
    return vertCount > 65535 ? new Uint32Array(arr) : new Uint16Array(arr);
  }
  if (Array.isArray(x)) return vertCount > 65535 ? new Uint32Array(x) : new Uint16Array(x);
  throw new Error("indices not array-like");
}

worker.onmessage = (ev: MessageEvent<WorkerIn>) => {
  const msg = ev.data;

  if (msg.type === "status") return setStatus(msg.message);

  if (msg.type === "error") {
    setBusy(false);
    return setStatus(`error: ${msg.message}`);
  }

  if (msg.type === "pong") return log("worker: pong");

  if (msg.type === "mesh") {
    try {
      const m = msg.payload ?? {};
      const positionsRaw = m.positions ?? m.vertices;
      const normalsRaw = m.normals;
      const indicesRaw = m.indices ?? m.triangles;

      if (!positionsRaw || !indicesRaw) {
        setBusy(false);
        return setStatus("error: mesh missing positions/indices");
      }

      const positions = asFloat32(positionsRaw);
      const normals = normalsRaw ? asFloat32(normalsRaw) : undefined;

      const vertCount = Math.floor(positions.length / 3);
      const indices = asIndexArray(indicesRaw, vertCount);

      log(`mesh rx: verts=${vertCount} tris=${Math.floor(indices.length / 3)}`);

      viewer.setMesh({
        positions: Array.from(positions),
        normals: normals ? Array.from(normals) : undefined,
        indices: Array.from(indices),
      });

      setBusy(false);
      return setStatus("ready");
    } catch (e: any) {
      setBusy(false);
      return setStatus(`error: mesh parse failed: ${e?.message ?? String(e)}`);
    }
  }

  if (msg.type === "file") {
    downloadArrayBuffer(msg.buffer, msg.filename, msg.mime);
    setBusy(false);
    return setStatus(`downloaded: ${msg.filename}`);
  }

  log(`unknown worker message: ${JSON.stringify(msg)}`);
};

worker.addEventListener("error", (e: any) => {
  const parts = [
    e?.message ? `msg=${e.message}` : "msg=(empty)",
    e?.filename ? `file=${e.filename}` : null,
    Number.isFinite(e?.lineno) ? `line=${e.lineno}` : null,
    Number.isFinite(e?.colno) ? `col=${e.colno}` : null,
  ].filter(Boolean);

  setBusy(false);
  setStatus(`worker error: ${parts.join(" ")}`);
});

worker.addEventListener("messageerror", () => {
  setBusy(false);
  setStatus("worker messageerror");
});

let pending = false;
let lastSig = "";

function computeSignature(p: ModelParams): string {
  const base = !!baseEnabledEl.checked;
  const toeB = !!toeBEnabledEl.checked;
  const toeC = !!toeCEnabledEl.checked;
  const heel = !!heelEnabledEl.checked;

  const parts: string[] = [];
  parts.push([base ? 1 : 0, toeB ? 1 : 0, toeC ? 1 : 0, heel ? 1 : 0].join(","));

  parts.push(paramIds.map((id) => p[id]).join(","));

  parts.push(
    `vizBase=${vizBasePtsEl.checked ? 1 : 0},vizA=${vizAArcPtsEl.checked ? 1 : 0},vizB=${
      vizBArcPtsEl.checked ? 1 : 0
    },vizC=${vizCArcPtsEl.checked ? 1 : 0},vizH=${vizHeelArcPtsEl.checked ? 1 : 0}`
  );

  return parts.join("|");
}

function rebuildDebounced() {
  if (!isModelEnabled()) return;
  if (pending) return;

  pending = true;
  window.setTimeout(() => {
    pending = false;
    if (!isModelEnabled()) return;
    rebuild();
  }, 200);
}

function rebuild() {
  applyAutoToeBCMidUI();
  syncLabels();
  updateBaseplateViz();
  updateArcViz();
  applySectionCutUIToViewer();

  if (!isModelEnabled()) {
    setBusy(false);
    return setStatus("model disabled");
  }

  const params = readParams();
  const s = computeSignature(params);
  if (s === lastSig) return setStatus("ready (cached)");
  lastSig = s;

  const base = !!baseEnabledEl.checked;
  const toeB = !!toeBEnabledEl.checked;
  const toeC = !!toeCEnabledEl.checked;
  const heel = !!heelEnabledEl.checked;

  setBusy(true);
  setStatus("building...");

  const out: WorkerOut = {
    type: "build",
    payload: {
      params,
      tolerance: readTolerance(),
      baseEnabled: base,
      toeBEnabled: toeB,
      toeCEnabled: toeC,
      heelEnabled: heel,
    },
  };

  worker.postMessage(out);
}

function exportStl() {
  applyAutoToeBCMidUI();
  syncLabels();
  updateBaseplateViz();
  updateArcViz();
  applySectionCutUIToViewer();

  if (!isModelEnabled()) {
    setBusy(false);
    return setStatus("model disabled");
  }

  setBusy(true);
  setStatus("exporting stl...");

  const params = readParams();

  const out: WorkerOut = {
    type: "export_stl",
    payload: {
      params,
      filename: "foothook.stl",
      baseEnabled: !!baseEnabledEl.checked,
      toeBEnabled: !!toeBEnabledEl.checked,
      toeCEnabled: !!toeCEnabledEl.checked,
      heelEnabled: !!heelEnabledEl.checked,
    },
  };

  worker.postMessage(out);
}

function exportStep() {
  applyAutoToeBCMidUI();
  syncLabels();
  updateBaseplateViz();
  updateArcViz();
  applySectionCutUIToViewer();

  if (!isModelEnabled()) {
    setBusy(false);
    return setStatus("model disabled");
  }

  setBusy(true);
  setStatus("exporting step...");

  const params = readParams();

  const out: WorkerOut = {
    type: "export_step",
    payload: {
      params,
      filename: "foothook.step",
      baseEnabled: !!baseEnabledEl.checked,
      toeBEnabled: !!toeBEnabledEl.checked,
      toeCEnabled: !!toeCEnabledEl.checked,
      heelEnabled: !!heelEnabledEl.checked,
    },
  };

  worker.postMessage(out);
}

function applyModelEnabledState() {
  const on = isModelEnabled();
  viewer.setModelVisible(on);

  applySectionCutUIToViewer();

  pending = false;
  setBusy(false);
  lastSig = "";

  if (on) {
    setStatus("model enabled");
    rebuild();
  } else {
    setStatus("model disabled");
  }
}

syncLabels();
updateBaseplateViz();
updateArcViz();
applySectionCutUIToViewer();

modelEnabledEl.addEventListener("change", applyModelEnabledState);

vizBasePtsEl.addEventListener("change", updateBaseplateViz);

[vizAArcPtsEl, vizBArcPtsEl, vizCArcPtsEl, vizHeelArcPtsEl].forEach((el) => {
  el.addEventListener("change", () => {
    updateArcViz();
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });
});

// section cut should NEVER rebuild; viewer-only
[sectionCutEnabledEl, sectionCutFlipEl, sectionCutZswitchEl, sectionCutOffsetEl].forEach((el) => {
  el.addEventListener("input", applySectionCutUIToViewer);
  el.addEventListener("change", applySectionCutUIToViewer);
});

[baseEnabledEl, toeBEnabledEl, toeCEnabledEl, heelEnabledEl].forEach((el) => el.addEventListener("change", () => rebuild()));

rebuildBtn.addEventListener("click", rebuild);
exportStlBtn.addEventListener("click", exportStl);
exportStepBtn.addEventListener("click", exportStep);

([tolEl, ...paramEls]).forEach((el) => {
  el.addEventListener("input", () => {
    syncLabels();
    updateBaseplateViz();
    updateArcViz();
    applySectionCutUIToViewer();
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });

  el.addEventListener("change", () => {
    syncLabels();
    updateBaseplateViz();
    updateArcViz();
    applySectionCutUIToViewer();
    if (!isModelEnabled()) return;
    rebuild();
  });
});

log("main.ts loaded");
worker.postMessage({ type: "ping" });

setBusy(false);
applyModelEnabledState();
