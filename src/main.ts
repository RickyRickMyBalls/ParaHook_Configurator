// FILE: src/main.ts
import "./style.css";
import { Viewer } from "./viewer";

type ModelParams = Record<string, number>; // param1..paramN

type PartToggles = {
  baseEnabled: boolean;
  toeBEnabled: boolean; // A->B
  toeCEnabled: boolean; // B->C (requires toeBEnabled)
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

viewer.loadHookSTEP(1, "/hooks/small.step");
viewer.loadHookSTEP(2, "/hooks/medium.step");
viewer.loadHookSTEP(3, "/hooks/large.step");
viewer.loadHookSTEP(4, "/hooks/xl.step");

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

  [1, 2, 3, 4].forEach((id) => {
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

viewer.loadFootpad(1, "/footpad1.stl");
viewer.loadFootpad(2, "/footpad2.stl");
viewer.loadFootpad(3, "/footpad3.stl");
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

viewer.loadOBJ("/shoe.obj");

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
[shoeXEl, shoeYEl, shoeZEl, shoeRotEl].forEach((el) =>
  el.addEventListener("input", applyShoeUIToViewer)
);

// -----------------------------
// Main UI (parametric model)
// -----------------------------
const statusEl = mustEl<HTMLDivElement>("status");
const rebuildBtn = mustEl<HTMLButtonElement>("rebuild");
const exportStlBtn = mustEl<HTMLButtonElement>("exportStl");
const exportStepBtn = mustEl<HTMLButtonElement>("exportStep");

const modelEnabledEl = mustEl<HTMLInputElement>("modelEnabled");
const showPointsEl = mustEl<HTMLInputElement>("showPoints");

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
// This means you can add param38 in HTML and main.ts does not change.
// -----------------------------
const paramEls = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[id^="param"]')
)
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
  const p: Record<string, number> = {};
  for (const el of paramEls) {
    p[el.id] = readNumber(el, 0); // keys are "param1", "param2", ...
  }

  // -----------------------------
  // Clamp/normalize your known params
  // -----------------------------
  // Baseplate
  p.param1 = clamp(p.param1 ?? 195, 50, 500);
  p.param2 = clamp(p.param2 ?? 30, 1, 300);
  p.param3 = clamp(p.param3 ?? 12, 1, 80);
  p.param4 = clamp(p.param4 ?? 67, 1, 100);
  p.param5 = clamp(p.param5 ?? 46, 1, 100);
  p.param6 = clamp(p.param6 ?? -14, -300, 300);
  p.param7 = clamp(p.param7 ?? -2, -300, 300);
  p.param8 = clamp(p.param8 ?? 1, -300, 300);

  // Toe A
  p.param9 = clamp(p.param9 ?? 12, 0.2, 80);
  p.param10 = clamp(p.param10 ?? 13, -2000, 2000);
  p.param11 = clamp(p.param11 ?? 26, -2000, 2000);
  p.param12 = clamp(p.param12 ?? 50, 0.1, 2000);
  p.param13 = clamp(p.param13 ?? 35, 0.1, 2000);

  // Toe B station + A->B midcount + profile B geometry
  p.param14 = clamp(p.param14 ?? 60, 1, 2000);
  p.param15 = clamp(p.param15 ?? 2, 0, 200);
  p.param16 = clamp(p.param16 ?? -11, -2000, 2000);
  p.param17 = clamp(p.param17 ?? 41, -2000, 2000);
  p.param18 = clamp(p.param18 ?? 20, 0.1, 2000);
  p.param19 = clamp(p.param19 ?? 50, 0.1, 2000);

  // Toe C station + B->C midcount + profile C geometry
  p.param20 = clamp(p.param20 ?? 100, 1, 2000);
  p.param21 = clamp(p.param21 ?? 3, 0, 200);
  p.param22 = clamp(p.param22 ?? 13, -2000, 2000);
  p.param23 = clamp(p.param23 ?? 26, -2000, 2000);
  p.param24 = clamp(p.param24 ?? 50, 0.1, 2000);
  p.param25 = clamp(p.param25 ?? 35, 0.1, 2000);

  // Fillet placeholders
  p.param26 = clamp(p.param26 ?? 0, 0, 100);
  p.param27 = clamp(p.param27 ?? 0, 0, 100);

  // Heel kick UI
  p.param28 = clamp(p.param28 ?? 20, 0, 400);
  p.param29 = clamp(p.param29 ?? 10, 0, 400);
  p.param30 = clamp(p.param30 ?? 2, 0, 200);
  p.param31 = clamp(p.param31 ?? 0, 0, 100);
  p.param32 = clamp(p.param32 ?? 0, 0, 100);

  return p;
}

function readTolerance(): number {
  return clamp(readNumber(tolEl, 1.5), 0.3, 3.0);
}

// -----------------------------
// Baseplate viz helpers
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

function catmullRom(p0: Pt2, p1: Pt2, p2: Pt2, p3: Pt2, t: number): Pt2 {
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

function computeSpineSamplePoints(ctrl: Pt2[], samplesPerSegment = 60): XYZ[] {
  const spine = ctrl;
  const P = [spine[0], ...spine, spine[spine.length - 1]];

  const out: XYZ[] = [];
  for (let seg = 0; seg < spine.length - 1; seg++) {
    const p0 = P[seg + 0];
    const p1 = P[seg + 1];
    const p2 = P[seg + 2];
    const p3 = P[seg + 3];

    for (let i = 0; i <= samplesPerSegment; i++) {
      if (seg > 0 && i === 0) continue;
      const tt = i / samplesPerSegment;
      const pt = catmullRom(p0, p1, p2, p3, tt);
      out.push({ x: pt.x, y: pt.y, z: 0 });
    }
  }
  return out;
}

function updateBaseplateViz() {
  const p = readParams();
  const ctrl2 = computeControlPoints(p);

  viewer.setControlPoints(ctrl2.map((q) => ({ x: q.x, y: q.y, z: 0 })));
  viewer.setSpineSamplePoints(computeSpineSamplePoints(ctrl2, 60));
  viewer.setBaseplateVizVisible(!!showPointsEl.checked);
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

worker.onmessage = (ev: MessageEvent<WorkerIn>) => {
  const msg = ev.data;

  if (msg.type === "status") return setStatus(msg.message);

  if (msg.type === "error") {
    setBusy(false);
    return setStatus(`error: ${msg.message}`);
  }

  if (msg.type === "pong") return log("worker: pong");

  if (msg.type === "mesh") {
    const faces = msg.payload;
    const positions = (faces as any).positions ?? (faces as any).vertices;
    const normals = (faces as any).normals;
    const indices = (faces as any).indices ?? (faces as any).triangles;

    if (!positions || !indices) {
      setBusy(false);
      return setStatus("error: mesh missing positions/indices");
    }

    viewer.setMesh({ positions, normals, indices });
    setBusy(false);
    return setStatus("ready");
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

// Keep your existing signature strategy
function sig(p: ModelParams, ids: number[]) {
  return ids.map((i) => p[`param${i}`]).join(",");
}

function computeSignature(p: ModelParams): string {
  const base = !!baseEnabledEl.checked;
  const toeB = !!toeBEnabledEl.checked;
  const toeC = toeB && !!toeCEnabledEl.checked;
  const heel = !!heelEnabledEl.checked;

  const parts: string[] = [];
  parts.push([base ? 1 : 0, toeB ? 1 : 0, toeC ? 1 : 0, heel ? 1 : 0].join(","));

  if (base) parts.push(sig(p, [1, 2, 3, 4, 5, 6, 7, 8]));
  if (toeB) parts.push(sig(p, [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]));
  if (toeB && toeC) parts.push(sig(p, [20, 21, 22, 23, 24, 25]));
  if (heel) parts.push(sig(p, [20, 28, 29, 30])); // heel depends on station C
  parts.push(sig(p, [26, 27, 31, 32, 33, 34, 35, 36, 37])); // placeholders

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
  const toeC = toeB && !!toeCEnabledEl.checked; // enforce dependency
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

  if (!isModelEnabled()) {
    setBusy(false);
    return setStatus("model disabled");
  }

  setBusy(true);
  setStatus("exporting stl...");

  const params = readParams();

  const toeB = !!toeBEnabledEl.checked;
  const toeC = toeB && !!toeCEnabledEl.checked;

  const out: WorkerOut = {
    type: "export_stl",
    payload: {
      params,
      filename: "foothook.stl",
      baseEnabled: !!baseEnabledEl.checked,
      toeBEnabled: toeB,
      toeCEnabled: toeC,
      heelEnabled: !!heelEnabledEl.checked,
    },
  };

  worker.postMessage(out);
}

function exportStep() {
  syncLabels();
  updateBaseplateViz();

  if (!isModelEnabled()) {
    setBusy(false);
    return setStatus("model disabled");
  }

  setBusy(true);
  setStatus("exporting step...");

  const params = readParams();

  const toeB = !!toeBEnabledEl.checked;
  const toeC = toeB && !!toeCEnabledEl.checked;

  const out: WorkerOut = {
    type: "export_step",
    payload: {
      params,
      filename: "foothook.step",
      baseEnabled: !!baseEnabledEl.checked,
      toeBEnabled: toeB,
      toeCEnabled: toeC,
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

modelEnabledEl.addEventListener("change", applyModelEnabledState);
showPointsEl.addEventListener("change", updateBaseplateViz);

// Part toggles rebuild immediately
[baseEnabledEl, toeBEnabledEl, toeCEnabledEl, heelEnabledEl].forEach((el) =>
  el.addEventListener("change", () => rebuild())
);

rebuildBtn.addEventListener("click", rebuild);
exportStlBtn.addEventListener("click", exportStl);
exportStepBtn.addEventListener("click", exportStep);

// Any param/tolerance change rebuilds
([tolEl, ...paramEls]).forEach((el) => {
  el.addEventListener("input", () => {
    syncLabels();
    updateBaseplateViz();
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });

  el.addEventListener("change", () => {
    syncLabels();
    updateBaseplateViz();
    if (!isModelEnabled()) return;
    rebuild();
  });
});

log("main.ts loaded");
worker.postMessage({ type: "ping" });

setBusy(false);
applyModelEnabledState();