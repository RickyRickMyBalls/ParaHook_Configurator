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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

const vlen = (a: Pt) => Math.hypot(a.x, a.y);
const vnorm = (a: Pt): Pt => {
  const l = vlen(a);
  return l > 1e-9 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 1 };
};
function dist(a: Pt, b: Pt) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function cutWithBox(
  solid: Shape3D,
  minX: number,
  minY: number,
  minZ: number,
  sizeX: number,
  sizeY: number,
  sizeZ: number
): Shape3D {
  const box = (draw([0, 0]) as any)
    .lineTo([sizeX, 0])
    .lineTo([sizeX, sizeY])
    .lineTo([0, sizeY])
    .close()
    .sketchOnPlane("XY")
    .extrude(sizeZ);

  const moved = (box as any).translate([minX, minY, minZ]);
  return (solid as any).cut(moved) as Shape3D;
}

// =======================================================
// Catmull-Rom + derivative
// =======================================================
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
// Arc length helpers on sampled spine polyline
// =======================================================
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

/**
 * NEW: evaluate a station at an exact arc-length fraction between i0..i1.
 * This avoids snapping to integer indices (which causes lumpiness).
 */
function evalStationByArcLenBetween(
  pts: Pt[],
  tans: Pt[],
  i0: number,
  i1: number,
  targetLen: number
): { pt: Pt; tan: Pt; idxSeg: number; u: number } {
  const end = clamp(i1, i0 + 1, pts.length - 1);
  const start = clamp(i0, 0, end - 1);

  let acc = 0;
  for (let i = start + 1; i <= end; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = dist(a, b);
    if (seg < 1e-9) continue;

    if (acc + seg >= targetLen) {
      const u = clamp((targetLen - acc) / seg, 0, 1);
      const pt = lerpPt(a, b, u);
      // blend tangents and renormalize
      const ta = tans[i - 1] ?? tans[start];
      const tb = tans[i] ?? tans[end];
      const tan = vnorm(lerpPt(ta, tb, u));
      return { pt, tan, idxSeg: i, u };
    }

    acc += seg;
  }

  // fallback: exact end
  const pt = pts[end];
  const tan = vnorm(tans[end] ?? tans[end - 1] ?? { x: 0, y: 1 });
  return { pt, tan, idxSeg: end, u: 1 };
}

// =======================================================
// Profile builders
// =======================================================

// 2-arc outer+inner offset, returns a closed Draw
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
  for (let i = 1; i < outerPts.length; i++) dd = (dd as any).lineTo([outerPts[i].x, outerPts[i].y]);

  dd = (dd as any).lineTo([innerPts[innerPts.length - 1].x, innerPts[innerPts.length - 1].y]);
  for (let i = innerPts.length - 2; i >= 0; i--) {
    dd = (dd as any).lineTo([innerPts[i].x, innerPts[i].y]);
  }

  return (dd as any).close();
}

// Signed rectangle, lets us mirror left/right by sx=±1
function rectProfileXZSigned(widthX: number, heightZ: number, sx: number) {
  const w = clamp(Math.abs(widthX), 0.1, 2000);
  const h = clamp(heightZ, 0.0, 2000);
  const x1 = sx * w;

  let d = (draw([0, 0]) as any).lineTo([x1, 0]).lineTo([x1, h]).lineTo([0, h]);
  return (d as any).close();
}

// =======================================================
// Heel Profile 1: “Profile C, but clipped” (lower half)
// =======================================================
type ArchPts = { outerPts: Pt[]; innerPts: Pt[] };

function archOffsetProfileFixedPts(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number,
  ctrlX: number,
  ctrlZ: number,
  off: number
): ArchPts {
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
  return { outerPts, innerPts };
}

function drawFromOuterInner(outerPts: Pt[], innerPts: Pt[]) {
  let d = draw([outerPts[0].x, outerPts[0].y]);
  for (let i = 1; i < outerPts.length; i++) d = (d as any).lineTo([outerPts[i].x, outerPts[i].y]);

  d = (d as any).lineTo([innerPts[innerPts.length - 1].x, innerPts[innerPts.length - 1].y]);

  for (let i = innerPts.length - 2; i >= 0; i--) d = (d as any).lineTo([innerPts[i].x, innerPts[i].y]);
  return (d as any).close();
}

// Keep portion where y <= clipY (local “Z”)
function clipPolylineAtY(pts: Pt[], clipY: number): Pt[] {
  const out: Pt[] = [];
  if (pts.length < 2) return pts.slice();

  let anyAbove = false;
  for (const p of pts) {
    if (p.y > clipY) {
      anyAbove = true;
      break;
    }
  }
  if (!anyAbove) return pts.slice();

  out.push(pts[0]);

  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const aIn = a.y <= clipY;
    const bIn = b.y <= clipY;

    if (bIn) {
      out.push(b);
      continue;
    }

    if (aIn && !bIn) {
      const dy = b.y - a.y;
      const t = Math.abs(dy) < 1e-9 ? 0 : (clipY - a.y) / dy;
      const x = a.x + (b.x - a.x) * t;
      out.push({ x, y: clipY });
      break;
    }
  }

  return out.length >= 2 ? out : pts.slice(0, 2);
}

function clippedArchProfileLower(
  endX: number,
  endZ: number,
  ctrlX: number,
  ctrlZ: number,
  thickness: number,
  clipZ: number
) {
  const { outerPts, innerPts } = archOffsetProfileFixedPts(0, 0, endX, endZ, ctrlX, ctrlZ, thickness);

  const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
  const clip = clamp(clipZ, 0.1, Math.max(0.1, maxOuterZ - 0.1));

  const o2 = clipPolylineAtY(outerPts, clip);
  const i2 = clipPolylineAtY(innerPts, clip);

  return drawFromOuterInner(o2, i2);
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
  return { spinePts, spineTan, baseLen };
}

// =======================================================
// Baseplate (param1..param8)
// =======================================================
export async function buildBaseSolid(input: ParamMap): Promise<Shape3D> {
  const baseLen = clamp(num((input as any).param1, 195), 50, 2000);
  const baseWid = clamp(num((input as any).param2, 30), 1, 300);
  const baseThk = clamp(num((input as any).param3, 12), -40, 200);

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

  let d = draw([0, 0]);
  d = (d as any).lineTo([outer[0].x, outer[0].y]);
  for (let i = 1; i < outer.length; i++) d = (d as any).lineTo([outer[i].x, outer[i].y]);
  d = (d as any).lineTo([inner[inner.length - 1].x, inner[inner.length - 1].y]);
  for (let i = inner.length - 2; i >= 0; i--) d = (d as any).lineTo([inner[i].x, inner[i].y]);
  d = (d as any).close();

  return (d as any).sketchOnPlane("XY").extrude(-baseThk) as Shape3D;
}

// =======================================================
// Toe loft helpers
// =======================================================
type ToeProfile = { arcX: number; arcZ: number; endX: number; endZ: number };

function buildLoftBetweenStations(
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

  const Ts: number[] = [];
  for (let i = 0; i < sectionCount; i++) Ts.push(i / (sectionCount - 1));

  const sx = flipX ? -1 : 1;

  // unwrap angle to keep continuity as sections march along the path
  const angPrev = { v: null as number | null };

  function makeSectionPlane(pt: Pt, tan: Pt) {
    const t = vnorm(tan);
    let angDeg = (Math.atan2(t.y, t.x) * 180) / Math.PI;

    if (angPrev.v !== null) {
      while (angDeg - angPrev.v > 180) angDeg -= 360;
      while (angDeg - angPrev.v < -180) angDeg += 360;
    }
    angPrev.v = angDeg;

    return (makePlane("YZ", [pt.x, pt.y, 0]) as any).pivot(angDeg, [0, 0, 1]);
  }

  const sketches = Ts.map((tSection, k) => {
    const targetLen = totalLen * tSection;

    // endpoints: exact indices; middles: arc-length interpolation (NEW)
    const station =
      k === 0
        ? { pt: spinePts[idx0], tan: spineTan[idx0] }
        : k === Ts.length - 1
          ? { pt: spinePts[idx1], tan: spineTan[idx1] }
          : (() => {
              const s = evalStationByArcLenBetween(spinePts, spineTan, idx0, idx1, targetLen);
              return { pt: s.pt, tan: s.tan };
            })();

    const plane = makeSectionPlane(station.pt, station.tan);

    const endX = lerp(prof0.endX, prof1.endX, tSection);
    const endZ = lerp(prof0.endZ, prof1.endZ, tSection);
    const arcX = lerp(prof0.arcX, prof1.arcX, tSection);
    const arcZ = lerp(prof0.arcZ, prof1.arcZ, tSection);

    const prof2d = archOffsetProfileFixed(0, 0, sx * endX, endZ, sx * arcX, arcZ, thickness);
    return (prof2d as any).sketchOnPlane(plane);
  });

  return (sketches[0] as any).loftWith(sketches.slice(1)) as Shape3D;
}

// =======================================================
// Toe: TWO independent lofts (A->B, B->C)
// NEW numbering per HTML
//   A:  param10..13
//   B:  station=15, mid=16, B geom=17..20
//   C:  station=21, mid=22, C geom=23..26
//   thickness = param9
// =======================================================
export async function buildToeABSolid(input: ParamMap): Promise<Shape3D | null> {
  const enabled = !!num((input as any).toeBEnabled, 1);
  if (!enabled) return null;

  const toeThickness = clamp(num((input as any).param9, 12), 0.2, 80);

  const A: ToeProfile = {
    arcX: clamp(num((input as any).param10, 0), -2000, 2000),
    arcZ: clamp(num((input as any).param11, 27), -2000, 2000),
    endX: clamp(num((input as any).param12, 47), 0.1, 2000),
    endZ: clamp(num((input as any).param13, 35), 0.1, 2000),
  };

  const stationB = clamp(num((input as any).param15, 60), 1, 2000);
  const midAB = clamp(num((input as any).param16, 2), 0, 200);

  const B: ToeProfile = {
    arcX: clamp(num((input as any).param17, 0), -2000, 2000),
    arcZ: clamp(num((input as any).param18, 41), -2000, 2000),
    endX: clamp(num((input as any).param19, 20), 0.1, 2000),
    endZ: clamp(num((input as any).param20, 50), 0.1, 2000),
  };

  const { spinePts, spineTan } = sampleSpine(input);

  const idx0 = 0;
  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);

  const FLIP_X = true;
  return buildLoftBetweenStations(spinePts, spineTan, idx0, idxB, midAB, A, B, toeThickness, FLIP_X);
}

export async function buildToeBCSolid(input: ParamMap): Promise<Shape3D | null> {
  const enabled = !!num((input as any).toeCEnabled, 1);
  if (!enabled) return null;

  const toeThickness = clamp(num((input as any).param9, 12), 0.2, 80);

  const stationB = clamp(num((input as any).param15, 60), 1, 2000);
  const B: ToeProfile = {
    arcX: clamp(num((input as any).param17, 0), -2000, 2000),
    arcZ: clamp(num((input as any).param18, 41), -2000, 2000),
    endX: clamp(num((input as any).param19, 20), 0.1, 2000),
    endZ: clamp(num((input as any).param20, 50), 0.1, 2000),
  };

  const stationC = clamp(num((input as any).param21, 137), 1, 2000);
  const midBC = clamp(num((input as any).param22, 3), 0, 200);

  const C: ToeProfile = {
    arcX: clamp(num((input as any).param23, 0), -2000, 2000),
    arcZ: clamp(num((input as any).param24, 29), -2000, 2000),
    endX: clamp(num((input as any).param25, 19), 0.1, 2000),
    endZ: clamp(num((input as any).param26, 65), 0.1, 2000),
  };

  const { spinePts, spineTan } = sampleSpine(input);

  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);

  let idxC = findEndIdxByArcLen(spinePts, stationC);
  idxC = clamp(idxC, idxB + 1, spinePts.length - 1);

  const FLIP_X = true;
  return buildLoftBetweenStations(spinePts, spineTan, idxB, idxC, midBC, B, C, toeThickness, FLIP_X);
}

export async function buildToeSolid(input: ParamMap): Promise<Shape3D | null> {
  const toeAB = await buildToeABSolid(input);
  const toeBC = await buildToeBCSolid(input);

  if (!toeAB && !toeBC) return null;

  let toe =
    toeAB && toeBC ? (((toeAB as any).fuse(toeBC) as Shape3D) ?? toeAB) : (toeAB ?? toeBC)!;

  // =======================================================
  // Profile A fillet (NEW: param14)
  //
  // CHANGE: apply fillet BEFORE big trim cut (more stable topology)
  // =======================================================
  const rA = clamp(num((input as any).param14, 0), 0, 200);
  if (rA > 0.01 && toe && typeof (toe as any).edges === "function") {
    const { spinePts, spineTan } = sampleSpine(input);

    const ptA = spinePts[0];
    const tanA = vnorm(spineTan[0]);
    const angDegA = (Math.atan2(tanA.y, tanA.x) * 180) / Math.PI;
    const planeA = (makePlane("YZ", [ptA.x, ptA.y, 0]) as any).pivot(angDegA, [0, 0, 1]);

    const efPlane = (toe as any).edges().inPlane(planeA).ofLength((l: number) => l > 0.25);
    const rs = [rA, rA * 0.75, rA * 0.5, rA * 0.25].filter((r) => r > 0.25);

    let applied = false;
    let lastErr: any = null;

    for (const r of rs) {
      try {
        toe = (toe as any).fillet(r, efPlane);
        applied = true;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!applied) {
      const efAny = (toe as any).edges().ofLength((l: number) => l > 5);
      for (const r of rs) {
        try {
          toe = (toe as any).fillet(r, efAny);
          applied = true;
          break;
        } catch (e) {
          lastErr = e;
        }
      }
    }

    if (!applied) {
      const msg =
        typeof lastErr?.message === "string" ? lastErr.message : JSON.stringify(lastErr ?? "unknown");
      throw new Error(`Toe fillet failed (param14=${rA}). Last error: ${msg}`);
    }
  }

  // =======================================================
  // Large trim box AFTER fillet
  // =======================================================
  const cutWidth = 400;
  const cutHeight = 1000;
  const cutMinZ = -500;

  const cutMinY = -200;
  const cutSizeY = 200;

  toe = cutWithBox(toe, -cutWidth * 0.5, cutMinY, cutMinZ, cutWidth, cutSizeY, cutHeight);

  return toe;
}

// =======================================================
// Heel Kick: uses Profile C (param23..26) at stationC (param21)
// heights param28/29, mid param30
// =======================================================
export async function buildHeelSolid(input: ParamMap): Promise<Shape3D> {
  const { spinePts, spineTan } = sampleSpine(input);

  const stationC = clamp(num((input as any).param21, 137), 1, 2000);
  let idxC = findEndIdxByArcLen(spinePts, stationC);

  const idxEnd = spinePts.length - 1;
  idxC = clamp(idxC, 1, Math.max(1, idxEnd - 2));

  const heelH_C = clamp(num((input as any).param28, 40), 0.1, 400);
  const heelH_D = clamp(num((input as any).param29, 10), 0.1, 400);
  const midCD = Math.round(clamp(num((input as any).param30, 2), 0, 60));

  const thickness = clamp(num((input as any).param9, 12), 0.5, 80);

  const arcX_C = clamp(num((input as any).param23, 0), -2000, 2000);
  const arcZ_C = clamp(num((input as any).param24, 29), -2000, 2000);
  const endX_C = clamp(num((input as any).param25, 19), 0.1, 2000);
  const endZ_C = clamp(num((input as any).param26, 65), 0.1, 2000);

  const heelWidth = thickness;
  const sx = 1;

  const angPrev = { v: null as number | null };
  function makePlaneAt(pt: Pt, tan: Pt) {
    const t = vnorm(tan);
    let angDeg = (Math.atan2(t.y, t.x) * 180) / Math.PI;

    if (angPrev.v !== null) {
      while (angDeg - angPrev.v > 180) angDeg -= 360;
      while (angDeg - angPrev.v < -180) angDeg += 360;
    }
    angPrev.v = angDeg;

    return (makePlane("YZ", [pt.x, pt.y, 0]) as any).pivot(angDeg, [0, 0, 1]);
  }

  const sketches: any[] = [];

  // C section (use exact idxC)
  const planeC = makePlaneAt(spinePts[idxC], spineTan[idxC]);
  const sxFirst = -sx;

  const heelProf1 = clippedArchProfileLower(
    sxFirst * endX_C,
    endZ_C,
    sxFirst * arcX_C,
    arcZ_C,
    thickness,
    heelH_C
  );
  sketches.push((heelProf1 as any).sketchOnPlane(planeC));

  const cdLen = arcLenBetween(spinePts, idxC, idxEnd);
  const sectionCount = midCD + 2;

  // mids: arc-length interpolation (NEW)
  for (let k = 1; k < sectionCount - 1; k++) {
    const t = k / (sectionCount - 1);
    const targetLen = cdLen * t;

    const st = evalStationByArcLenBetween(spinePts, spineTan, idxC, idxEnd, targetLen);
    const h = heelH_C + (heelH_D - heelH_C) * t;
    const plane = makePlaneAt(st.pt, st.tan);

    sketches.push((rectProfileXZSigned(heelWidth, h, sx) as any).sketchOnPlane(plane));
  }

  // D section (exact end)
  const planeD = makePlaneAt(spinePts[idxEnd], spineTan[idxEnd]);
  sketches.push((rectProfileXZSigned(heelWidth, heelH_D, sx) as any).sketchOnPlane(planeD));

  const heelSolid = (sketches[0] as any).loftWith(sketches.slice(1));
  return heelSolid as Shape3D;
}

// =======================================================
// DEBUG CUTTER CUBE (exported so worker can call it)
// =======================================================
export async function buildDebugCutCube(_input: ParamMap): Promise<Shape3D> {
  const cubeMinX = -400;
  const cubeMinY = -800; // negative Y only
  const cubeMinZ = -400;

  const cubeSizeX = 800;
  const cubeSizeY = 800;
  const cubeSizeZ = 800;

  const cube = (draw([0, 0]) as any)
    .lineTo([cubeSizeX, 0])
    .lineTo([cubeSizeX, cubeSizeY])
    .lineTo([0, cubeSizeY])
    .close()
    .sketchOnPlane("XY")
    .extrude(cubeSizeZ);

  return (cube as any).translate([cubeMinX, cubeMinY, cubeMinZ]) as Shape3D;
}

// =======================================================
// Build full model (base + toe + heel)
// =======================================================
export async function buildModel(input: ParamMap): Promise<Shape3D> {
  const baseEnabled = !!num((input as any).baseEnabled, 1);
  const toeBEnabled = !!num((input as any).toeBEnabled, 1);
  const toeCEnabled = !!num((input as any).toeCEnabled, 1);
  const heelEnabled = !!num((input as any).heelEnabled, 1);

  let out: Shape3D | null = null;

  if (baseEnabled) out = await buildBaseSolid(input);

  if (toeBEnabled || toeCEnabled) {
    const toe = await buildToeSolid(input);
    if (toe) out = out ? (((out as any).fuse(toe) as Shape3D) ?? out) : toe;
  }

  if (heelEnabled) {
    const heel = await buildHeelSolid(input);
    out = out ? (((out as any).fuse(heel) as Shape3D) ?? out) : heel;
  }

  if (!out) {
    const placeholder = (draw([0, 0]) as any)
      .lineTo([1, 0])
      .lineTo([1, 1])
      .lineTo([0, 1])
      .close()
      .sketchOnPlane("XY")
      .extrude(1);
    return placeholder as Shape3D;
  }

  return out as Shape3D;
}