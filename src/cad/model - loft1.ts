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
const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Pt, s: number): Pt => ({ x: a.x * s, y: a.y * s });
const vlen = (a: Pt) => Math.hypot(a.x, a.y);
const vnorm = (a: Pt): Pt => {
  const l = vlen(a);
  return l > 1e-9 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 1 };
};

function dist(a: Pt, b: Pt) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function findEndIdxByArcLen(pts: Pt[], targetLen: number) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += dist(pts[i - 1], pts[i]);
    if (acc >= targetLen) return i;
  }
  return pts.length - 1;
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
// Toe Hook (2-section loft, Profile A tangent to rail at start)
//
// Plane A: YZ at start point, rotated about world Z to match tangent direction
// Plane B: XZ at end point (stable)
// =======================================================
export async function buildToeSolid(input: ParamMap): Promise<Shape3D> {
  // --- Profile A params
  const toeHookOffset = clamp(num((input as any).param9, 6), 0.5, 50);
  const toeArcX = clamp(num((input as any).param10, 30), -2000, 2000);
  const toeArcZ = clamp(num((input as any).param11, 30), -2000, 2000);

  const toeEndX = clamp(num((input as any).param12, 60), 1, 2000);
  const toeEndZ = clamp(num((input as any).param13, 50), 1, 2000);

  // intended length along the rail
  const toeHookLen = clamp(num((input as any).param14, 100), 1, 2000);

  // --- Profile B params
  const toeArcXB = clamp(num((input as any).param15, toeArcX), -2000, 2000);
  const toeArcZB = clamp(num((input as any).param16, toeArcZ), -2000, 2000);

  const toeEndXB = clamp(num((input as any).param17, toeEndX), 1, 2000);
  const toeEndZB = clamp(num((input as any).param18, toeEndZ), 1, 2000);

  // Backwards fix (mirror across the rail anchor)
// Flip only Profile A (because its plane is rotated YZ)
// Leave Profile B in normal XZ orientation
const TOE_FLIP_X = true;

const sxA = TOE_FLIP_X ? -1 : 1;
const sxB = 1;

  // =======================================================
  // Sample the same spline used by baseplate (centerline)
  // Also compute tangent at the START (for plane A)
  // =======================================================
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

  if (spinePts.length < 4) throw new Error("toe: spine too short");

  const startIdx = 0;
  let endIdx = findEndIdxByArcLen(spinePts, toeHookLen);
  endIdx = clamp(endIdx, 1, spinePts.length - 1);

  const startPt = spinePts[startIdx];
  const endPt = spinePts[endIdx];
  const startTan = vnorm(spineTan[startIdx]);

  // =======================================================
  // Profile builder (offset arch) in local 2D:
  // x = across, y = up (Z)
  // =======================================================
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
    const inwardSign = vlen(sub(cand1, mid)) < vlen(sub(cand2, mid)) ? 1 : -1;

    const innerPts = outerPts.map((p, i) => add(p, mul(outerN[i], offSafe * -inwardSign)));

    let dd = draw([outerPts[0].x, outerPts[0].y]);
    for (let i = 1; i < outerPts.length; i++) dd = dd.lineTo([outerPts[i].x, outerPts[i].y]);

    dd = dd.lineTo([innerPts[innerPts.length - 1].x, innerPts[innerPts.length - 1].y]);
    for (let i = innerPts.length - 2; i >= 0; i--) dd = dd.lineTo([innerPts[i].x, innerPts[i].y]);

    return dd.close();
  }

  // =======================================================
  // Planes:
  // - A: tangent at start (rotate YZ around world Z)
  // - B: simple XZ at end (stable)
  // =======================================================
  const startAngDeg = (Math.atan2(startTan.y, startTan.x) * 180) / Math.PI;

  const planeA = (makePlane("YZ", [startPt.x, startPt.y, 0]) as any).pivot(startAngDeg, [0, 0, 1]);
  const planeB = makePlane("XZ", [endPt.x, endPt.y, 0]);

const profA = archOffsetProfileFixed(
  0, 0,
  sxA * toeEndX, toeEndZ,
  sxA * toeArcX, toeArcZ,
  toeHookOffset
);

const profB = archOffsetProfileFixed(
  0, 0,
  sxB * toeEndXB, toeEndZB,
  sxB * toeArcXB, toeArcZB,
  toeHookOffset
);

  const skA = profA.sketchOnPlane(planeA);
  const skB = profB.sketchOnPlane(planeB);

  const toeSolid = skA.loftWith(skB);
  return toeSolid as Shape3D;
}