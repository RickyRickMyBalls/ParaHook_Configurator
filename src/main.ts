// FILE: src/main.ts
import "./style.css";
import { Viewer } from "./viewer";

const BASE = import.meta.env.BASE_URL; // e.g. "/ParaHook_Configurator/" on GitHub Pages

type ModelParams = Record<string, number>; // param1..paramN

type PartToggles = {
  baseEnabled: boolean;
  toeBEnabled: boolean; // Toe loft 1: A->B
  toeCEnabled: boolean; // Toe loft 2: B->C (independent)
  heelEnabled: boolean; // heel loft
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

  viewer.setShoeOffset(
    SHOE_BASE_OFFSET.x + dx,
    SHOE_BASE_OFFSET.y + dy,
    SHOE_BASE_OFFSET.z + dz
  );

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

// Baseplate viz toggle (HTML id is vizBasePts)
const vizBasePtsEl = mustEl<HTMLInputElement>("vizBasePts");

// Arc viz toggles
const vizAArcPtsEl = mustEl<HTMLInputElement>("vizAArcPts");
const vizBArcPtsEl = mustEl<HTMLInputElement>("vizBArcPts");
const vizCArcPtsEl = mustEl<HTMLInputElement>("vizCArcPts");
const vizHeelArcPtsEl = mustEl<HTMLInputElement>("vizHeelArcPts");

// Section cut UI
const sectionCutEnabledEl = mustEl<HTMLInputElement>("sectionCutEnabled");
const sectionCutYEl = mustEl<HTMLInputElement>("sectionCutY");

// Enable toggles
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
// Auto-discover param inputs: param1, param2, ... paramN
// -----------------------------
const paramEls = Array.from(document.querySelectorAll<HTMLInputElement>('input[id^="param"]'))
  .filter((el) => /^param\d+$/.test(el.id))
  .sort((a, b) => Number(a.id.slice(5)) - Number(b.id.slice(5)));

const paramValEls = paramEls.map(
  (el) => document.getElementById(`${el.id}Val`) as HTMLInputElement | null
);

function syncLabels() {
  tolVal.value = tolEl.value;
  for (let i = 0; i < paramEls.length; i++) {
    const v = paramValEls[i];
    if (v) v.value = paramEls[i].value;
  }
}

function readParams(): ModelParams {
  const p: any = {};
  for (const el of paramEls) p[el.id] = readNumber(el, 0);

  // Section cut lives outside param list
  p.sectionCutEnabled = sectionCutEnabledEl.checked ? 1 : 0;
  p.sectionCutY = clamp(readNumber(sectionCutYEl, 0), -5000, 5000);

  return p as ModelParams;
}

function readTolerance(): number {
  return clamp(readNumber(tolEl, 1.5), 0.3, 3.0);
}

// -----------------------------
// Baseplate viz helpers (ONLY control points now)
// -----------------------------
type XYZ = { x: number; y: number; z: number };
type Pt2 = { x: number; y: number };

function computeControlPoints(p: Record<string, number>): Pt2[] {
  const baseLen = clamp(Number(p.param1 ?? 195), 50, 2000);
  const heelPct = clamp(Number(p.param4 ?? 67), 1, 100);
  const toePct = clamp(Number(p.param5 ?? 46), 1, 100);

  const p2x = Number(p.param6 ?? -14);
  const p3x = Number(p.param7 ?? -2);
  const p4x = Number(p.param8 ?? 1);

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
// Arc viz math (MATCHES model.ts)
// -----------------------------
type Pt = { x: number; y: number };

function add2(a: Pt, b: Pt): Pt {
  return { x: a.x + b.x, y: a.y + b.y };
}
void add2;

function mul2(a: Pt, s: number): Pt {
  return { x: a.x * s, y: a.y * s };
}
void mul2;

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

function arcLenBetween(pts: Pt[], i0: number, i1: number) {
  let acc = 0;
  for (let i = i0 + 1; i <= i1; i++) acc += dist2(pts[i - 1], pts[i]);
  return acc;
}
void arcLenBetween;

function findEndIdxByArcLen(pts: Pt[], targetLen: number) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += dist2(pts[i - 1], pts[i]);
    if (acc >= targetLen) return i;
  }
  return pts.length - 1;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

function evalStationByArcLenBetween(
  pts: Pt[],
  tans: Pt[],
  i0: number,
  i1: number,
  targetLen: number
): { pt: Pt; tan: Pt } {
  const end = clamp(i1, i0 + 1, pts.length - 1);
  const start = clamp(i0, 0, end - 1);

  let acc = 0;
  for (let i = start + 1; i <= end; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = dist2(a, b);
    if (seg < 1e-9) continue;

    if (acc + seg >= targetLen) {
      const u = clamp((targetLen - acc) / seg, 0, 1);
      const pt = lerpPt(a, b, u);
      const ta = tans[i - 1] ?? tans[start];
      const tb = tans[i] ?? tans[end];
      const tan = vnorm2(lerpPt(ta, tb, u));
      return { pt, tan };
    }
    acc += seg;
  }

  const pt = pts[end];
  const tan = vnorm2(tans[end] ?? tans[end - 1] ?? { x: 0, y: 1 });
  return { pt, tan };
}
void evalStationByArcLenBetween; 

function sampleSpineMain(p: Record<string, number>) {
  const baseLen = clamp(num(p.param1, 195), 50, 2000);
  const heelPct = clamp(num(p.param4, 67), 1, 100);
  const toePct = clamp(num(p.param5, 46), 1, 100);

  const p2x = clamp(num(p.param6, -14), -1000, 1000);
  const p3x = clamp(num(p.param7, -2), -1000, 1000);
  const p4x = clamp(num(p.param8, 1), -1000, 1000);

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
  // rotate (0,1,0) about Z
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

  const u = rotateZDegOnYAxis(ang); // local X direction in world
  const v = { x: 0, y: 0, z: 1 };   // local Z direction in world

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

  // visibility first (so groups hide immediately)
  viewer.setAArcVizVisible(!!vizAArcPtsEl.checked);
  viewer.setBArcVizVisible(!!vizBArcPtsEl.checked);
  viewer.setCArcVizVisible(!!vizCArcPtsEl.checked);
  viewer.setHeelArcVizVisible(!!vizHeelArcPtsEl.checked);

  // if all off, skip work
  if (!vizAArcPtsEl.checked && !vizBArcPtsEl.checked && !vizCArcPtsEl.checked && !vizHeelArcPtsEl.checked) return;

  const { spinePts, spineTan } = sampleSpineMain(p);

  // Toe A is at start index 0
  const stA = { pt: spinePts[0], tan: spineTan[0] };

  // Station B by arc length (param15)
  const stationB = clamp(num(p.param15, 60), 1, 2000);
  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);
  const stB = { pt: spinePts[idxB], tan: spineTan[idxB] };

  // Station C by arc length (param21)
  const stationC = clamp(num(p.param21, 137), 1, 2000);
  let idxC = findEndIdxByArcLen(spinePts, stationC);
  idxC = clamp(idxC, idxB + 1, spinePts.length - 1);
  const stC = { pt: spinePts[idxC], tan: spineTan[idxC] };

  // FLIP_X is true everywhere for the arch profiles (sx = -1)
  const sx = -1;

  // A geom (param10..13)
  const A_arcX = clamp(num(p.param10, 0), -2000, 2000) * sx;
  const A_arcZ = clamp(num(p.param11, 27), -2000, 2000);
  const A_endX = clamp(num(p.param12, 47), 0.1, 2000) * sx;
  const A_endZ = clamp(num(p.param13, 35), 0.1, 2000);

  // B geom (param17..20)
  const B_arcX = clamp(num(p.param17, 0), -2000, 2000) * sx;
  const B_arcZ = clamp(num(p.param18, 41), -2000, 2000);
  const B_endX = clamp(num(p.param19, 20), 0.1, 2000) * sx;
  const B_endZ = clamp(num(p.param20, 50), 0.1, 2000);

  // C geom (param23..26)
  const C_arcX = clamp(num(p.param23, 0), -2000, 2000) * sx;
  const C_arcZ = clamp(num(p.param24, 29), -2000, 2000);
  const C_endX = clamp(num(p.param25, 19), 0.1, 2000) * sx;
  const C_endZ = clamp(num(p.param26, 65), 0.1, 2000);

  // Heel "arch" is the clipped C profile at station C (same 3 defining points)
  const H_arcX = C_arcX;
  const H_arcZ = C_arcZ;
  const H_endX = C_endX;
  const H_endZ = C_endZ;

  // Send points into viewer
  if (vizAArcPtsEl.checked) viewer.setAArcPoints(arc3PointsAtStation(stA.pt, stA.tan, A_arcX, A_arcZ, A_endX, A_endZ));
  if (vizBArcPtsEl.checked) viewer.setBArcPoints(arc3PointsAtStation(stB.pt, stB.tan, B_arcX, B_arcZ, B_endX, B_endZ));
  if (vizCArcPtsEl.checked) viewer.setCArcPoints(arc3PointsAtStation(stC.pt, stC.tan, C_arcX, C_arcZ, C_endX, C_endZ));
  if (vizHeelArcPtsEl.checked) viewer.setHeelArcPoints(arc3PointsAtStation(stC.pt, stC.tan, H_arcX, H_arcZ, H_endX, H_endZ));
}

// -----------------------------
// Download helper
// -----------------------------
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

// -----------------------------
// Worker
// -----------------------------
const worker = new Worker(new URL("./cad/worker.ts", import.meta.url), { type: "module" });

function asFloat32(x: any): Float32Array {
  if (x instanceof Float32Array) return x;
  if (ArrayBuffer.isView(x) && x.buffer)
    return new Float32Array(x.buffer, x.byteOffset, Math.floor(x.byteLength / 4));
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

// -----------------------------
// Build/export actions
// -----------------------------
let pending = false;
let lastSig = "";

function computeSignature(p: ModelParams): string {
  const base = !!baseEnabledEl.checked;
  const toeB = !!toeBEnabledEl.checked;
  const toeC = !!toeCEnabledEl.checked;
  const heel = !!heelEnabledEl.checked;

  const parts: string[] = [];
  parts.push([base ? 1 : 0, toeB ? 1 : 0, toeC ? 1 : 0, heel ? 1 : 0].join(","));

  parts.push(`sectionCut=${(p as any).sectionCutEnabled ?? 0},y=${(p as any).sectionCutY ?? 0}`);

  parts.push(paramEls.map((el) => (p as any)[el.id]).join(","));

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
  syncLabels();
  updateBaseplateViz();
  updateArcViz();

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
  syncLabels();
  updateBaseplateViz();
  updateArcViz();

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
  syncLabels();
  updateBaseplateViz();
  updateArcViz();

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

// -----------------------------
// Model enable
// -----------------------------
function applyModelEnabledState() {
  const on = isModelEnabled();
  viewer.setModelVisible(on);

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

// -----------------------------
// UI wiring
// -----------------------------
syncLabels();
updateBaseplateViz();
updateArcViz();

modelEnabledEl.addEventListener("change", applyModelEnabledState);

vizBasePtsEl.addEventListener("change", updateBaseplateViz);

[vizAArcPtsEl, vizBArcPtsEl, vizCArcPtsEl, vizHeelArcPtsEl].forEach((el) => {
  el.addEventListener("change", () => {
    updateArcViz();
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });
});

[sectionCutEnabledEl, sectionCutYEl].forEach((el) => {
  el.addEventListener("input", () => {
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });
  el.addEventListener("change", () => {
    if (!isModelEnabled()) return;
    rebuild();
  });
});

[baseEnabledEl, toeBEnabledEl, toeCEnabledEl, heelEnabledEl].forEach((el) =>
  el.addEventListener("change", () => rebuild())
);

rebuildBtn.addEventListener("click", rebuild);
exportStlBtn.addEventListener("click", exportStl);
exportStepBtn.addEventListener("click", exportStep);

([tolEl, ...paramEls]).forEach((el) => {
  el.addEventListener("input", () => {
    syncLabels();
    updateBaseplateViz();
    updateArcViz();
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });

  el.addEventListener("change", () => {
    syncLabels();
    updateBaseplateViz();
    updateArcViz();
    if (!isModelEnabled()) return;
    rebuild();
  });
});

log("main.ts loaded");
worker.postMessage({ type: "ping" });

setBusy(false);
applyModelEnabledState();