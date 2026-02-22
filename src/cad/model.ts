// FILE: src/cad/model.ts
import { draw, makePlane, type Shape3D } from "replicad";

export type ParamMap = Record<string, unknown>;
type Pt = { x: number; y: number };

// =======================================================
// Shared helpers
// =======================================================
function num(v: unknown, f: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
}
function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Pt, s: number): Pt => ({ x: a.x * s, y: a.y * s });
const vlen = (a: Pt) => Math.hypot(a.x, a.y);
const vnorm = (a: Pt): Pt => {
  const l = vlen(a);
  return l > 1e-9 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 1 };
};

function dist(a: Pt, b: Pt) {
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
  for (let i = i0 + 1; i <= i1; i++) acc += dist(pts[i - 1], pts[i]);
  return acc;
}
function findEndIdxByArcLen(pts: Pt[], targetLen: number) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += dist(pts[i - 1], pts[i]);
    if (acc >= targetLen) return i;
  }
  return pts.length - 1;
}
function findIdxBetweenByArcLen(pts: Pt[], i0: number, i1: number, target: number) {
  let acc = 0;
  for (let i = i0 + 1; i <= i1; i++) {
    acc += dist(pts[i - 1], pts[i]);
    if (acc >= target) return i;
  }
  return i1;
}

function archOffsetProfileFixed(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number,
  ctrlX: number,
  ctrlZ: number,
  off: number
) {
  const A: Pt = { x: startX, y: startZ };
  const C: Pt = { x: endX, y: endZ };

  const span = Math.hypot(C.x - A.x, C.y - A.y);
  const offSafe = clamp(off, 0.2, Math.max(0.2, span * 0.45));

  const minX = Math.min(startX, endX);
  const maxX = Math.max(startX, endX);
  const minZ = Math.min(startZ, endZ);
  const maxZ = Math.max(startZ, endZ);

  const B: Pt = {
    x: clamp(ctrlX, minX, maxX),
    y: clamp(ctrlZ, minZ, maxZ + 200),
  };

  const samples = 60;
  const outerPts: Pt[] = [];
  const outerN: Pt[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const pt = catmullRom(A, A, B, C, t);
    const dv = vnorm(catmullRomDeriv(A, A, B, C, t));
    const nLeft = vnorm({ x: -dv.y, y: dv.x });
    outerPts.push(pt);
    outerN.push(nLeft);
  }
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const pt = catmullRom(A, B, C, C, t);
    const dv = vnorm(catmullRomDeriv(A, B, C, C, t));
    const nLeft = vnorm({ x: -dv.y, y: dv.x });
    outerPts.push(pt);
    outerN.push(nLeft);
  }

  const mid: Pt = { x: (A.x + C.x) * 0.5, y: (A.y + C.y) * 0.5 };
  const midIdx = Math.floor(outerPts.length / 2);
  const testP = outerPts[midIdx];
  const testN = outerN[midIdx];

  const cand1 = add(testP, mul(testN, offSafe));
  const cand2 = add(testP, mul(testN, -offSafe));
  const inwardSign =
    vlen({ x: cand1.x - mid.x, y: cand1.y - mid.y }) <
    vlen({ x: cand2.x - mid.x, y: cand2.y - mid.y })
      ? 1
      : -1;

  const innerPts = outerPts.map((p, i) => add(p, mul(outerN[i], offSafe * -inwardSign)));

  let dd = draw([outerPts[0].x, outerPts[0].y]);
  for (let i = 1; i < outerPts.length; i++) dd = dd.lineTo([outerPts[i].x, outerPts[i].y]);

  dd = dd.lineTo([innerPts[innerPts.length - 1].x, innerPts[innerPts.length - 1].y]);
  for (let i = innerPts.length - 2; i >= 0; i--) dd = dd.lineTo([innerPts[i].x, innerPts[i].y]);

  return dd.close();
}

// Simple rectangular heel profile in XZ plane (x = width, y = height)
function rectProfileXZ(widthX: number, heightZ: number) {
  const w = clamp(widthX, 0.1, 2000);
  const h = clamp(heightZ, 0, 2000);
  let d = draw([0, 0]).lineTo([w, 0]).lineTo([w, h]).lineTo([0, h]);
  return d.close();
}

// =======================================================
// Spine sampling (shared by toe + heel)
// =======================================================
function sampleSpine(input: ParamMap) {
  const baseLen = clamp(num((input as any).param1, 195), 50, 2000);
  const heelPct = clamp(num((input as any).param4, 67), 1, 100);
  const toePct = clamp(num((input as any).param5, 46), 1, 100);

  const p2x = clamp(num((input as any).param6, -14), -1000, 1000);
  const p3x = clamp(num((input as any).param7, -2), -1000, 1000);
  const p4x = clamp(num((input as any).param8, 1), -1000, 1000);

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
      spineTan.push(vnorm(catmullRomDeriv(p0, p1, p2, p3, t)));
    }
  }

  if (spinePts.length < 4) throw new Error("spine too short");

  return { spinePts, spineTan };
}

// =======================================================
// Baseplate
// =======================================================
export async function buildBaseSolid(input: ParamMap): Promise<Shape3D> {
  const baseLen = clamp(num((input as any).param1, 195), 50, 2000);
  const baseWid = clamp(num((input as any).param2, 30), 1, 300);
  const baseThk = clamp(num((input as any).param3, 12), 0.5, 200);

  const heelPct = clamp(num((input as any).param4, 67), 1, 100);
  const toePct = clamp(num((input as any).param5, 46), 1, 100);

  const p2x = clamp(num((input as any).param6, -14), -1000, 1000);
  const p3x = clamp(num((input as any).param7, -2), -1000, 1000);
  const p4x = clamp(num((input as any).param8, 1), -1000, 1000);

  const p3y = clamp((baseLen * heelPct) / 100, 1, baseLen - 0.001);
  const p2y = clamp((p3y * toePct) / 100, 0.001, p3y - 0.001);

  const spine: Pt[] = [
    { x: 0, y: 0 },
    { x: p2x, y: p2y },
    { x: p3x, y: p3y },
    { x: p4x, y: baseLen },
  ];

  const P: Pt[] = [spine[0], ...spine, spine[spine.length - 1]];
  const inner: Pt[] = [];
  const outer: Pt[] = [];
  const samplesPerSegment = 60;

  for (let seg = 0; seg < spine.length - 1; seg++) {
    const p0 = P[seg + 0];
    const p1 = P[seg + 1];
    const p2 = P[seg + 2];
    const p3 = P[seg + 3];

    for (let i = 0; i <= samplesPerSegment; i++) {
      if (seg > 0 && i === 0) continue;
      const t = i / samplesPerSegment;

      const pt = catmullRom(p0, p1, p2, p3, t);
      const dv = vnorm(catmullRomDeriv(p0, p1, p2, p3, t));
      const nLeft = vnorm({ x: -dv.y, y: dv.x });

      inner.push(pt);
      outer.push(add(pt, mul(nLeft, baseWid)));
    }
  }

  inner[0] = { x: 0, y: 0 };

  let d = draw([0, 0]).lineTo([outer[0].x, outer[0].y]);
  for (let i = 1; i < outer.length; i++) d = d.lineTo([outer[i].x, outer[i].y]);
  d = d.lineTo([inner[inner.length - 1].x, inner[inner.length - 1].y]);
  for (let i = inner.length - 2; i >= 0; i--) d = d.lineTo([inner[i].x, inner[i].y]);
  d = d.close();

  return d.sketchOnPlane("XY").extrude(-baseThk);
}

// =======================================================
// Toe: two lofts (A->B) and (B->C)
// =======================================================
type ToeProfile = { arcX: number; arcZ: number; endX: number; endZ: number };

function buildToeLoftBetweenStations(
  spinePts: Pt[],
  spineTan: Pt[],
  idx0: number,
  idx1: number,
  midCount: number,
  prof0: ToeProfile,
  prof1: ToeProfile,
  thickness: number,
  flipX: boolean
) {
  const totalLen = arcLenBetween(spinePts, idx0, idx1);
  const sectionCount = Math.max(2, Math.round(midCount) + 2);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const Ts: number[] = [];
  for (let i = 0; i < sectionCount; i++) Ts.push(i / (sectionCount - 1));

  const sx = flipX ? -1 : 1;

  const sketches = Ts.map((tSection, k) => {
    const targetLen = totalLen * tSection;
    const idx =
      k === 0
        ? idx0
        : k === Ts.length - 1
          ? idx1
          : findIdxBetweenByArcLen(spinePts, idx0, idx1, targetLen);

    const pt = spinePts[idx];
    const tan = vnorm(spineTan[idx]);

    // NOTE: keeping your plane strategy
    let plane: any;
    if (k === Ts.length - 1) {
      plane = makePlane("XZ", [pt.x, pt.y, 0]);
    } else {
      const angDeg = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
      plane = (makePlane("YZ", [pt.x, pt.y, 0]) as any).pivot(angDeg, [0, 0, 1]);
    }

    const endX = lerp(prof0.endX, prof1.endX, tSection);
    const endZ = lerp(prof0.endZ, prof1.endZ, tSection);
    const arcX = lerp(prof0.arcX, prof1.arcX, tSection);
    const arcZ = lerp(prof0.arcZ, prof1.arcZ, tSection);

    const prof = archOffsetProfileFixed(0, 0, sx * endX, endZ, sx * arcX, arcZ, thickness);
    return prof.sketchOnPlane(plane);
  });

  const solid = (sketches[0] as any).loftWith(sketches.slice(1));
  return solid as Shape3D;
}

export async function buildToeSolid(input: ParamMap): Promise<Shape3D | null> {
  const toeHookThickness = clamp(num((input as any).param9, 12), 0.2, 80);

  // Flags injected by worker (numbers 0/1). Defaults ON if not provided.
  const toeBEnabled = !!num((input as any).toeBEnabled, 1);
  const toeCEnabledRaw = !!num((input as any).toeCEnabled, 1);
  const toeCEnabled = toeBEnabled && toeCEnabledRaw;

  // Profile A geometry
  const A: ToeProfile = {
    arcX: clamp(num((input as any).param10, 13), -2000, 2000),
    arcZ: clamp(num((input as any).param11, 26), -2000, 2000),
    endX: clamp(num((input as any).param12, 50), 0.1, 2000),
    endZ: clamp(num((input as any).param13, 35), 0.1, 2000),
  };

  // Station B + A->B midcount + Profile B geometry
  const stationB = clamp(num((input as any).param14, 60), 1, 2000);
  const midAB = clamp(num((input as any).param15, 2), 0, 200);
  const B: ToeProfile = {
    arcX: clamp(num((input as any).param16, -11), -2000, 2000),
    arcZ: clamp(num((input as any).param17, 41), -2000, 2000),
    endX: clamp(num((input as any).param18, 20), 0.1, 2000),
    endZ: clamp(num((input as any).param19, 50), 0.1, 2000),
  };

  // Station C + B->C midcount + Profile C geometry
  const stationC = clamp(num((input as any).param20, 100), 1, 2000);
  const midBC = clamp(num((input as any).param21, 3), 0, 200);
  const C: ToeProfile = {
    arcX: clamp(num((input as any).param22, 13), -2000, 2000),
    arcZ: clamp(num((input as any).param23, 26), -2000, 2000),
    endX: clamp(num((input as any).param24, 50), 0.1, 2000),
    endZ: clamp(num((input as any).param25, 35), 0.1, 2000),
  };

  const { spinePts, spineTan } = sampleSpine(input);

  const idx0 = 0;
  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);

  let idxC = findEndIdxByArcLen(spinePts, stationC);
  idxC = clamp(idxC, idxB + 1, spinePts.length - 1);

  // Your toe needed mirror in X; keep it consistent across toe lofts
  const TOE_FLIP_X = true;

  let toe1: Shape3D | null = null;
  let toe2: Shape3D | null = null;

  if (toeBEnabled) {
    toe1 = buildToeLoftBetweenStations(
      spinePts,
      spineTan,
      idx0,
      idxB,
      midAB,
      A,
      B,
      toeHookThickness,
      TOE_FLIP_X
    );
  }
  if (toeBEnabled && toeCEnabled) {
    toe2 = buildToeLoftBetweenStations(
      spinePts,
      spineTan,
      idxB,
      idxC,
      midBC,
      B,
      C,
      toeHookThickness,
      TOE_FLIP_X
    );
  }

  if (!toe1 && !toe2) return null;
  if (toe1 && !toe2) return toe1;
  if (!toe1 && toe2) return toe2;

  const fused = (toe1 as any).fuse(toe2);
  return fused as Shape3D;
}

// =======================================================
// Heel Kick: station C -> end
// Uses your HTML params 28..30 and uses profile width from toe C endX (param24)
// =======================================================
export async function buildHeelSolid(input: ParamMap): Promise<Shape3D> {
  const { spinePts, spineTan } = sampleSpine(input);

  // start at station C
  const stationC = clamp(num((input as any).param20, 100), 1, 2000);
  let idxC = findEndIdxByArcLen(spinePts, stationC);
  idxC = clamp(idxC, 1, spinePts.length - 2);

  const idxEnd = spinePts.length - 1;

  // heel controls from your HTML
  const hC = clamp(num((input as any).param28, 20), 0, 400);
  const hD = clamp(num((input as any).param29, 10), 0, 400);
  const mid = clamp(num((input as any).param30, 2), 0, 200);

  // width: reuse toe profile C endX
  const widthX = clamp(num((input as any).param24, 50), 0.1, 2000);

  const totalLen = arcLenBetween(spinePts, idxC, idxEnd);
  const sectionCount = Math.max(2, Math.round(mid) + 2);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const Ts: number[] = [];
  for (let i = 0; i < sectionCount; i++) Ts.push(i / (sectionCount - 1));

  const sketches = Ts.map((tSection, k) => {
    const targetLen = totalLen * tSection;
    const idx =
      k === 0
        ? idxC
        : k === Ts.length - 1
          ? idxEnd
          : findIdxBetweenByArcLen(spinePts, idxC, idxEnd, targetLen);

    const pt = spinePts[idx];
	
    const tan = vnorm(spineTan[idx]);

    let plane: any;
    if (k === Ts.length - 1) {
      plane = makePlane("XZ", [pt.x, pt.y, 0]);
    } else {
      const angDeg = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
      plane = (makePlane("YZ", [pt.x, pt.y, 0]) as any).pivot(angDeg, [0, 0, 1]);
    }

    const h = lerp(hC, hD, tSection);
    const prof = rectProfileXZ(widthX, h);
    return prof.sketchOnPlane(plane);
  });

  const heelSolid = (sketches[0] as any).loftWith(sketches.slice(1));
  return heelSolid as Shape3D;
}

// =======================================================
// buildModel: conditionally build/fuse enabled parts
// =======================================================
export async function buildModel(
  input: ParamMap,
  opts: { baseEnabled: boolean; toeBEnabled: boolean; toeCEnabled: boolean; heelEnabled: boolean }
): Promise<Shape3D> {
  let out: any = null;

  if (opts.baseEnabled) {
    out = await buildBaseSolid(input);
  }

  // Inject toe flags so buildToeSolid(input) can branch without a 2nd arg
  (input as any).toeBEnabled = opts.toeBEnabled ? 1 : 0;
  (input as any).toeCEnabled = opts.toeBEnabled && opts.toeCEnabled ? 1 : 0;

  const toe = await buildToeSolid(input);
  if (toe) out = out ? (out as any).fuse(toe) : toe;

  if (opts.heelEnabled) {
    const heel = await buildHeelSolid(input);
    out = out ? (out as any).fuse(heel) : heel;
  }

  if (!out) {
    // never return null; viewer expects a meshable shape
    const d = draw([0, 0]).lineTo([1, 0]).lineTo([1, 1]).lineTo([0, 1]).close();
    out = d.sketchOnPlane("XY").extrude(-1);
  }

  return out as Shape3D;
}