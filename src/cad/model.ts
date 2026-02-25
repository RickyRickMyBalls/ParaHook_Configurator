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

function postModelDebugStatus(message: string) {
  try {
    const g: any = globalThis as any;
    if (typeof g?.postMessage === "function") {
      g.postMessage({ type: "status", message });
    }
  } catch {}
}

const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
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

function smoothstep01(t: number) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}
function dot2(a: Pt, b: Pt) {
  return a.x * b.x + a.y * b.y;
}
function norm2(a: Pt): Pt {
  const l = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / l, y: a.y / l };
}

// Prefer named keys, but accept legacy paramN
function getV(input: ParamMap, namedKey: string, legacyParamKey: string, fallback: number) {
  const a = (input as any)?.[namedKey];
  if (a !== undefined && a !== null) return num(a, fallback);
  const b = (input as any)?.[legacyParamKey];
  return num(b, fallback);
}

function dedupePts(pts: Pt[], eps = 1e-6): Pt[] {
  if (pts.length <= 1) return pts.slice();
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const q = out[out.length - 1];
    if (Math.hypot(p.x - q.x, p.y - q.y) > eps) out.push(p);
  }
  return out;
}

function dirFromDeg(deg: number): Pt {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

// =======================================================
// Fake toe fillet (kept, but default OFF)
// =======================================================
function toeRoundByPushbackPts(
  pts: Pt[],
  uMm: number,
  filletMm: number,
  forwardDir: Pt,
  power = 3,
  bandMm?: number
): Pt[] {
  const R = Math.max(0, filletMm);
  if (R <= 1e-6) return pts;

  const d = norm2(forwardDir);

  const u = clamp(uMm, 0, R);
  const t = u / R;
  const ease = smoothstep01(t);
  const delta = R * (1 - ease);

  const band = bandMm ?? clamp(R * 1.2, 6, 40);

  let sMax = -Infinity;
  for (const p of pts) sMax = Math.max(sMax, dot2(p, d));
  const s0 = sMax - band;

  return pts.map((p) => {
    const s = dot2(p, d);
    const alpha = clamp((s - s0) / band, 0, 1);
    const push = delta * Math.pow(alpha, power);
    return { x: p.x - d.x * push, y: p.y - d.y * push };
  });
}

// =======================================================
// Catmull-Rom + derivative (spine)
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
// Cubic Bezier + derivative (toe profiles A/B/C)
// =======================================================
function bezier3(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
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
function bezier3Deriv(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = mul(sub(p1, p0), u * u);
  const b = mul(sub(p2, p1), 2 * u * t);
  const c = mul(sub(p3, p2), t * t);
  return mul(add(add(a, b), c), 3);
}

// =======================================================
// Arc length helpers
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
      const ta = tans[i - 1] ?? tans[start];
      const tb = tans[i] ?? tans[end];
      const tan = vnorm(lerpPt(ta, tb, u));
      return { pt, tan, idxSeg: i, u };
    }

    acc += seg;
  }

  const pt = pts[end];
  const tan = vnorm(tans[end] ?? tans[end - 1] ?? { x: 0, y: 1 });
  return { pt, tan, idxSeg: end, u: 1 };
}

// =======================================================
// Toe profile builder (Bezier + robust offset)
// Rules enforced:
// 1) Bottom attach edge is flat (y=0 at both bottom endpoints)
// 2) Start handle is straight up (P1 is vertical from origin; no angle param)
// =======================================================
function toeBezierOffsetProfile2D(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  endAngDeg: number,
  off: number,
  toeUmm = 0,
  toeFilletMm = 0,
  preserveOffset = false
) {
  const P0: Pt = { x: 0, y: 0 };
  const P3: Pt = { x: endX, y: endZ };

  const span = Math.hypot(P3.x - P0.x, P3.y - P0.y);
  const offSafe = preserveOffset ? Math.max(0.2, Number(off) || 0.2) : clamp(off, 0.2, Math.max(0.2, span * 0.45));

  const P1: Pt = { x: 0, y: clamp(p1s, 0, 10000) };

  // UI convention: 0deg should look "flat" -> offset by -180deg
  const dir = dirFromDeg(endAngDeg - 180);
  const p3 = clamp(p3s, 0, Math.max(1, span * 1.5));
  let P2: Pt = { x: P3.x - dir.x * p3, y: P3.y - dir.y * p3 };
  P2 = { x: P2.x, y: Math.max(0, P2.y) };

  const samples = 70;
  let outerPts: Pt[] = [];
  let outerN: Pt[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const pt = bezier3(P0, P1, P2, P3, t);
    const dv = vnorm(bezier3Deriv(P0, P1, P2, P3, t));
    const nLeft = vnorm({ x: -dv.y, y: dv.x });
    outerPts.push(pt);
    outerN.push(nLeft);
  }

  const mid: Pt = { x: (P0.x + P3.x) * 0.5, y: (P0.y + P3.y) * 0.5 };
  const midIdx = Math.floor(outerPts.length / 2);
  const testP = outerPts[midIdx];
  const testN = outerN[midIdx];
  const cand1 = add(testP, mul(testN, offSafe));
  const cand2 = add(testP, mul(testN, -offSafe));
  const inwardSign = vlen(sub(cand1, mid)) < vlen(sub(cand2, mid)) ? 1 : -1;

  let innerPts = outerPts.map((p, i) => add(p, mul(outerN[i], offSafe * -inwardSign)));

  outerPts[0] = { x: outerPts[0].x, y: 0 };

  const n0 = outerN[0] ?? { x: -1, y: 0 };
  innerPts[0] = add(outerPts[0], mul(n0, offSafe * -inwardSign));
  innerPts[0] = { x: innerPts[0].x, y: 0 };

  innerPts[innerPts.length - 1] = {
    x: innerPts[innerPts.length - 1].x,
    y: Math.max(0, innerPts[innerPts.length - 1].y),
  };

  outerPts = dedupePts(outerPts, 1e-6);
  innerPts = dedupePts(innerPts, 1e-6);

  if (outerPts.length < 3 || innerPts.length < 3) {
    return (draw([0, 0]) as any).lineTo([1, 0]).lineTo([1, 1]).lineTo([0, 1]).close();
  }

  let ddLoop: Pt[] = [...outerPts, ...innerPts.slice().reverse()];
  ddLoop = dedupePts(ddLoop, 1e-6);

  if (toeFilletMm > 0.01) {
    const R = clamp(toeFilletMm, 0, 200);
    const u = clamp(toeUmm, 0, R);
    ddLoop = toeRoundByPushbackPts(ddLoop, u, R, { x: 0, y: 1 }, 3);
    ddLoop = dedupePts(ddLoop, 1e-6);
  }

  if (ddLoop.length < 3) {
    return (draw([0, 0]) as any).lineTo([1, 0]).lineTo([1, 1]).lineTo([0, 1]).close();
  }

  let dd = draw([ddLoop[0].x, ddLoop[0].y]);
  for (let i = 1; i < ddLoop.length; i++) dd = (dd as any).lineTo([ddLoop[i].x, ddLoop[i].y]);
  return (dd as any).close();
}

function toeBezierOffsetProfileFixedPts(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  endAngDeg: number,
  off: number
): ArchPts {
  const P0: Pt = { x: 0, y: 0 };
  const P3: Pt = { x: endX, y: endZ };

  const span = Math.hypot(P3.x - P0.x, P3.y - P0.y);
  const offSafe = clamp(off, 0.2, Math.max(0.2, span * 0.45));

  const P1: Pt = { x: 0, y: clamp(p1s, 0, 10000) };

  const dir = dirFromDeg(endAngDeg - 180);
  const p3 = clamp(p3s, 0, Math.max(1, span * 1.5));
  let P2: Pt = { x: P3.x - dir.x * p3, y: P3.y - dir.y * p3 };
  P2 = { x: P2.x, y: Math.max(0, P2.y) };

  const samples = 70;
  let outerPts: Pt[] = [];
  let outerN: Pt[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const pt = bezier3(P0, P1, P2, P3, t);
    const dv = vnorm(bezier3Deriv(P0, P1, P2, P3, t));
    const nLeft = vnorm({ x: -dv.y, y: dv.x });
    outerPts.push(pt);
    outerN.push(nLeft);
  }

  const mid: Pt = { x: (P0.x + P3.x) * 0.5, y: (P0.y + P3.y) * 0.5 };
  const midIdx = Math.floor(outerPts.length / 2);
  const testP = outerPts[midIdx];
  const testN = outerN[midIdx];
  const cand1 = add(testP, mul(testN, offSafe));
  const cand2 = add(testP, mul(testN, -offSafe));
  const inwardSign = vlen(sub(cand1, mid)) < vlen(sub(cand2, mid)) ? 1 : -1;

  let innerPts = outerPts.map((p, i) => add(p, mul(outerN[i], offSafe * -inwardSign)));

  outerPts[0] = { x: outerPts[0].x, y: 0 };
  const n0 = outerN[0] ?? { x: -1, y: 0 };
  innerPts[0] = add(outerPts[0], mul(n0, offSafe * -inwardSign));
  innerPts[0] = { x: innerPts[0].x, y: 0 };
  innerPts[innerPts.length - 1] = {
    x: innerPts[innerPts.length - 1].x,
    y: Math.max(0, innerPts[innerPts.length - 1].y),
  };

  outerPts = dedupePts(outerPts, 1e-6);
  innerPts = dedupePts(innerPts, 1e-6);
  return { outerPts, innerPts };
}

function rectProfileXZSigned(widthX: number, heightZ: number, sx: number) {
  const w = clamp(Math.abs(widthX), 0.1, 2000);
  const h = clamp(heightZ, 0.0, 2000);
  const x1 = sx * w;

  let d = (draw([0, 0]) as any).lineTo([x1, 0]).lineTo([x1, h]).lineTo([0, h]);
  return (d as any).close();
}

// Toe-style near-rectangle heel profile:
// same construction family as the C->D toe-like mids (clipped toe bezier),
// but guarded so the offset does not collapse when heelWidth ~= thickness.
function heelNearRectToeProfileXZSigned(widthX: number, heightZ: number, sx: number, thickness: number) {
  const w = clamp(Math.abs(widthX), 0.1, 2000);
  const h = clamp(heightZ, 0.1, 2000);
  const x1 = sx * w;
  const makePolylineFallback = () => {
    const crownDip = clamp(Math.min(h * 0.05, w * 0.18), 0.08, 1.5);
    const shoulderDip = crownDip * 0.55;
    let d = (draw([0, 0]) as any)
      .lineTo([x1, 0])
      .lineTo([x1, h])
      .lineTo([x1 * 0.75, Math.max(0, h - shoulderDip)])
      .lineTo([x1 * 0.5, Math.max(0, h - crownDip)])
      .lineTo([x1 * 0.25, Math.max(0, h - shoulderDip)])
      .lineTo([0, h]);
    return (d as any).close();
  };

  // Guard against inner-offset collapse at D (often heelWidth ~= thickness).
  // Keep the offset well below half-width and below height.
  const offSafe = clamp(Math.min(thickness, w * 0.34, h * 0.8), 0.2, Math.max(0.2, Math.min(w * 0.45, h * 0.9)));

  // If the heel end is too narrow/short, prefer the robust fallback section.
  if (w <= 2.0 || h <= 1.0 || offSafe >= w * 0.48) {
    return makePolylineFallback();
  }

  // Very shallow toe-like crown so the result is visually near-rectangular but
  // still has the same profile topology/edge correspondence as the toe-like mids.
  const crownRise = clamp(Math.min(h * 0.04, 1.0), 0.05, 1.0);
  const endZ = h + crownRise;
  const p1s = Math.max(0.1, h * 0.9);
  const p3s = clamp(w * 0.14, 0.05, Math.max(0.05, w * 0.35));
  const enda = -90;

  try {
    return clippedToeBezierProfileLower(x1, endZ, p1s, p3s, enda, offSafe, h);
  } catch {
    return makePolylineFallback();
  }
}

// =======================================================
// Screw holes / slots (baseplate cutouts)
// - Uses ONLY line segments (no arc API assumptions)
// =======================================================
function rot2(p: Pt, angDeg: number): Pt {
  const a = (angDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}

function polyToDraw(loop: Pt[]) {
  if (loop.length < 3) throw new Error("polyToDraw: need >=3 points");
  let d = draw([loop[0].x, loop[0].y]);
  for (let i = 1; i < loop.length; i++) d = (d as any).lineTo([loop[i].x, loop[i].y]);
  return (d as any).close();
}

function stadiumLoop(diaMm: number, lengthMm: number, segsPerSemi = 24): Pt[] {
  const dia = Math.max(0, diaMm);
  const r = dia * 0.5;
  if (r <= 1e-6) return [];

  const L = Math.max(0, lengthMm);
  const straight = Math.max(0, L - 2 * r);

  if (straight <= 1e-6) {
    const N = Math.max(12, segsPerSemi * 2);
    const out: Pt[] = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      out.push({ x: r * Math.cos(t), y: r * Math.sin(t) });
    }
    return out;
  }

  const cxL = -straight * 0.5;
  const cxR = +straight * 0.5;

  const out: Pt[] = [];

  out.push({ x: cxL, y: +r });
  out.push({ x: cxR, y: +r });

  for (let i = 1; i <= segsPerSemi; i++) {
    const a = Math.PI / 2 + -Math.PI * (i / segsPerSemi);
    out.push({ x: cxR + r * Math.cos(a), y: r * Math.sin(a) });
  }

  out.push({ x: cxL, y: -r });

  for (let i = 1; i <= segsPerSemi; i++) {
    const a = -Math.PI / 2 + Math.PI * (i / segsPerSemi);
    out.push({ x: cxL + r * Math.cos(a), y: r * Math.sin(a) });
  }

  return out;
}

function makeSlotCutter2D(centerX: number, centerY: number, diaMm: number, slotLenMm: number, angDeg: number) {
  const loopLocal = stadiumLoop(diaMm, slotLenMm, 26);
  if (loopLocal.length < 3) return null;

  const loopWorld = loopLocal.map((p) => rot2(p, angDeg)).map((p) => ({ x: p.x + centerX, y: p.y + centerY }));
  return polyToDraw(loopWorld);
}

function fuseMany(shapes: any[]): any | null {
  let out: any | null = null;
  for (const s of shapes) {
    if (!s) continue;
    out = out ? ((out as any).fuse(s) as any) : s;
  }
  return out;
}

// =======================================================
// Heel helper
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
  const inwardSign = vlen(sub(cand1, mid)) < vlen(sub(cand2, mid)) ? 1 : -1;

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

function cross2(a: Pt, b: Pt) {
  return a.x * b.y - a.y * b.x;
}

function trimPolylineAtRayHit(pts: Pt[], origin: Pt, dir: Pt): Pt[] | null {
  if (pts.length < 2) return null;

  const d = vnorm(dir);
  let bestSeg = -1;
  let bestPt: Pt | null = null;
  let bestT = Infinity;

  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const s = sub(b, a);
    const denom = cross2(d, s);
    if (Math.abs(denom) < 1e-9) continue;

    const qmp = sub(a, origin);
    const t = cross2(qmp, s) / denom;
    const u = cross2(qmp, d) / denom;

    if (t < -1e-6) continue;
    if (u < -1e-6 || u > 1 + 1e-6) continue;

    // Use the nearest forward hit on the inner polyline. Taking a later hit can
    // create a self-crossing cap when the ray intersects more than once.
    if (t < bestT) {
      bestT = t;
      bestSeg = i;
      bestPt = { x: origin.x + d.x * t, y: origin.y + d.y * t };
    }
  }

  if (bestSeg < 1 || !bestPt) return null;
  return dedupePts([...pts.slice(0, bestSeg), bestPt], 1e-6);
}

function trimPolylineBackFromEnd(pts: Pt[], backLen: number): Pt[] | null {
  if (pts.length < 2) return null;
  let remain = Math.max(0, backLen);
  if (remain <= 1e-6) return pts.slice();

  let i = pts.length - 1;
  while (i > 0) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = dist(a, b);
    if (seg > 1e-9) {
      if (remain <= seg) {
        const u = 1 - remain / seg; // point from a toward b
        const p = lerpPt(a, b, clamp(u, 0, 1));
        const out = [...pts.slice(0, i), p];
        return dedupePts(out, 1e-6);
      }
      remain -= seg;
    }
    i--;
  }

  return null;
}

function clippedArchProfileLower(endX: number, endZ: number, ctrlX: number, ctrlZ: number, thickness: number, clipZ: number) {
  const { outerPts, innerPts } = archOffsetProfileFixedPts(0, 0, endX, endZ, ctrlX, ctrlZ, thickness);

  const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
  const clip = clamp(clipZ, 0.1, Math.max(0.1, maxOuterZ - 0.1));

  const o2 = clipPolylineAtY(outerPts, clip);
  const i2 = clipPolylineAtY(innerPts, clip);

  return drawFromOuterInner(o2, i2);
}

function clippedToeBezierProfileLower(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  enda: number,
  thickness: number,
  clipZ: number
) {
  const { outerPts, innerPts } = toeBezierOffsetProfileFixedPts(endX, endZ, p1s, p3s, enda, thickness);

  const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
  const clip = clamp(clipZ, 0.1, Math.max(0.1, maxOuterZ - 0.1));

  const o2 = clipPolylineAtY(outerPts, clip);
  const i2 = clipPolylineAtY(innerPts, clip);

  return drawFromOuterInner(o2, i2);
}

function clippedToeBezierProfileLowerNormalCap(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  enda: number,
  thickness: number,
  clipZ: number,
  shaveMm = 0
) {
  const { outerPts, innerPts } = toeBezierOffsetProfileFixedPts(endX, endZ, p1s, p3s, enda, thickness);

  const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
  const clip = clamp(clipZ, 0.1, Math.max(0.1, maxOuterZ - 0.1));

  const o2 = clipPolylineAtY(outerPts, clip);
  const iHoriz = clipPolylineAtY(innerPts, clip);

  if (o2.length < 2 || iHoriz.length < 2) {
    return drawFromOuterInner(o2, iHoriz);
  }

  const oEnd = o2[o2.length - 1];
  const oPrev = o2[o2.length - 2];
  const tan = vnorm(sub(oEnd, oPrev));
  const nL = vnorm({ x: -tan.y, y: tan.x });
  const toInner = sub(iHoriz[iHoriz.length - 1], oEnd);
  const inward = dot2(nL, toInner) >= 0 ? nL : mul(nL, -1);

  const i2 = trimPolylineAtRayHit(innerPts, oEnd, inward) ?? iHoriz;
  if (i2.length < 2) return drawFromOuterInner(o2, iHoriz);

  const shave = Math.max(0, shaveMm);
  if (shave <= 1e-6) return drawFromOuterInner(o2, i2);

  // Fake fillet/chamfer: shave both cap endpoints back along their respective
  // curves, then reconnect. This softens the top corner without changing topology.
  const o3 = trimPolylineBackFromEnd(o2, shave);
  const i3 = trimPolylineBackFromEnd(i2, shave);
  if (!o3 || !i3 || o3.length < 2 || i3.length < 2) return drawFromOuterInner(o2, i2);

  return drawFromOuterInner(o3, i3);
}

function toeBezierProfileTopCutByAmount(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  enda: number,
  thickness: number,
  cutMm: number
) {
  const cut = Math.max(0, cutMm);
  if (cut <= 1e-6) {
    return toeBezierOffsetProfile2D(endX, endZ, p1s, p3s, enda, thickness, 0, 0);
  }

  const baseMeta = toeBezierMeta2D(endX, endZ, p1s, p3s, enda, thickness);
  const { outerPts } = toeBezierOffsetProfileFixedPts(endX, endZ, p1s, p3s, enda, thickness);
  const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
  // Toe fillet semantics: cut amount is measured down from the sampled profile end/top Z
  // (e.g. endZ 35 with r=10 -> clip at z=25), then capped with a normal-cap cut.
  const refTopZ = clamp(baseMeta.outerEnd.y, 0.1, maxOuterZ);
  // Prevent degenerate "cut almost everything off" sections that can break lofts.
  const minCapZ = Math.max(0.5, Math.min(refTopZ * 0.25, refTopZ - 0.5));
  const cutSafe = clamp(cut, 0, Math.max(0, refTopZ - minCapZ));
  const clipZ = refTopZ - cutSafe;

  // Same idea as heel C/D: build full profile, then cut/cap it lower.
  try {
    return clippedToeBezierProfileLowerNormalCap(endX, endZ, p1s, p3s, enda, thickness, clipZ, 0);
  } catch {
    // Fail safe so slider changes don't "freeze" the model due to loft build errors.
    return toeBezierOffsetProfile2D(endX, endZ, p1s, p3s, enda, thickness, 0, 0);
  }
}

function toeBezierMetaTopCutByAmount(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  enda: number,
  thickness: number,
  cutMm: number
): ToeMeta2D {
  const base = toeBezierMeta2D(endX, endZ, p1s, p3s, enda, thickness);
  const cut = Math.max(0, cutMm);
  if (cut <= 1e-6) return base;
  try {
    const { outerPts, innerPts } = toeBezierOffsetProfileFixedPts(endX, endZ, p1s, p3s, enda, thickness);
    const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
    const minCapZ = Math.max(0.5, Math.min(maxOuterZ * 0.25, maxOuterZ - 0.5));
    const cutSafe = clamp(cut, 0, Math.max(0, maxOuterZ - minCapZ));
    const clip = clamp(maxOuterZ - cutSafe, 0.1, Math.max(0.1, maxOuterZ - 0.1));

    const o2 = clipPolylineAtY(outerPts, clip);
    const iHoriz = clipPolylineAtY(innerPts, clip);
    if (o2.length < 2 || iHoriz.length < 2) return base;

    const oEnd = o2[o2.length - 1];
    const oPrev = o2[o2.length - 2];
    const tan = vnorm(sub(oEnd, oPrev));
    const endNormal = vnorm({ x: -tan.y, y: tan.x });
    const toInner = sub(iHoriz[iHoriz.length - 1], oEnd);
    const inward = dot2(endNormal, toInner) >= 0 ? endNormal : mul(endNormal, -1);
    const i2 = trimPolylineAtRayHit(innerPts, oEnd, inward) ?? iHoriz;
    if (i2.length < 2) return base;

    return {
      outerEnd: oEnd,
      innerEnd: i2[i2.length - 1],
      inwardSign: base.inwardSign,
      offSafe: base.offSafe,
      endNormal,
    };
  } catch {
    return base;
  }
}

function toeBezierMetaNormalCapByClipZ(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  enda: number,
  thickness: number,
  clipZ: number
): ToeMeta2D {
  const base = toeBezierMeta2D(endX, endZ, p1s, p3s, enda, thickness);
  try {
    const { outerPts, innerPts } = toeBezierOffsetProfileFixedPts(endX, endZ, p1s, p3s, enda, thickness);
    const maxOuterZ = Math.max(...outerPts.map((p) => p.y));
    const clip = clamp(clipZ, 0.1, Math.max(0.1, maxOuterZ - 0.1));

    const o2 = clipPolylineAtY(outerPts, clip);
    const iHoriz = clipPolylineAtY(innerPts, clip);
    if (o2.length < 2 || iHoriz.length < 2) return base;

    const oEnd = o2[o2.length - 1];
    const oPrev = o2[o2.length - 2];
    const tan = vnorm(sub(oEnd, oPrev));
    const endNormal = vnorm({ x: -tan.y, y: tan.x });
    const toInner = sub(iHoriz[iHoriz.length - 1], oEnd);
    const inward = dot2(endNormal, toInner) >= 0 ? endNormal : mul(endNormal, -1);
    const i2 = trimPolylineAtRayHit(innerPts, oEnd, inward) ?? iHoriz;
    if (i2.length < 2) return base;

    return {
      outerEnd: oEnd,
      innerEnd: i2[i2.length - 1],
      inwardSign: base.inwardSign,
      offSafe: base.offSafe,
      endNormal,
    };
  } catch {
    return base;
  }
}

function fitToeEndAngleForLocalInnerTarget(
  desiredInnerLocal: Pt,
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  baseEnda: number,
  thickness: number,
  preserveOffset = false,
  searchDeg = 70,
  steps = 25
) {
  let bestAng = baseEnda;
  let bestErr = Infinity;
  const nSteps = Math.max(3, Math.round(steps));

  for (let i = 0; i < nSteps; i++) {
    const u = nSteps <= 1 ? 0.5 : i / (nSteps - 1);
    const cand = baseEnda + lerp(-searchDeg, searchDeg, u);
    const meta = toeBezierMeta2D(endX, endZ, p1s, p3s, cand, thickness, preserveOffset);
    const dx = meta.innerEnd.x - desiredInnerLocal.x;
    const dz = meta.innerEnd.y - desiredInnerLocal.y;
    const err = dx * dx + dz * dz;
    if (err < bestErr) {
      bestErr = err;
      bestAng = cand;
    }
  }
  return bestAng;
}

function toeBezierProfileMatchedToNormalCapRefByClipZ(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  enda: number,
  thickness: number,
  clipZ: number
) {
  const ref = toeBezierMetaNormalCapByClipZ(endX, endZ, p1s, p3s, enda, thickness, clipZ);

  // When the profile is cut much shorter (especially near D), reusing C's original
  // control lengths makes the toe-style fit "wiggly". Scale control lengths to the
  // shortened chord before fitting the end angle.
  const baseSpan = Math.max(1e-6, Math.hypot(endX, endZ));
  const refSpan = Math.max(1e-6, Math.hypot(ref.outerEnd.x, ref.outerEnd.y));
  const spanScale = clamp(refSpan / baseSpan, 0.18, 1.0);
  const hScale = clamp(ref.outerEnd.y / Math.max(1e-6, Math.abs(endZ)), 0.18, 1.0);
  const ctrlScale = Math.min(spanScale, hScale);

  const p1sFit = clamp(p1s * ctrlScale, 0.1, Math.max(0.1, ref.outerEnd.y * 1.1));
  const p3sFit = clamp(p3s * ctrlScale, 0.05, Math.max(0.05, refSpan * 0.9));

  const fittedEnda = fitToeEndAngleForLocalInnerTarget(
    ref.innerEnd,
    ref.outerEnd.x,
    ref.outerEnd.y,
    p1sFit,
    p3sFit,
    enda,
    thickness,
    true,
    60,
    31
  );

  return toeBezierOffsetProfile2D(ref.outerEnd.x, ref.outerEnd.y, p1sFit, p3sFit, fittedEnda, thickness, 0, 0, true);
}

// =======================================================
// Spine sampling
// =======================================================
function sampleSpine(input: ParamMap) {
  const baseLen = clamp(getV(input, "bp_len", "param1", 195), 50, 2000);
  const heelPct = clamp(getV(input, "bp_heelPct", "param4", 67), 1, 100);
  const toePct = clamp(getV(input, "bp_toePct", "param5", 46), 1, 100);

  const p2x = clamp(getV(input, "bp_p2x", "param6", -14), -1000, 1000);
  const p3x = clamp(getV(input, "bp_p3x", "param7", -2), -1000, 1000);
  const p4x = clamp(getV(input, "bp_p4x", "param8", 1), -1000, 1000);

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
// Baseplate + screw holes cut
// =======================================================
export async function buildBaseSolid(input: ParamMap): Promise<Shape3D> {
  const baseLen = clamp(getV(input, "bp_len", "param1", 195), 50, 2000);
  const baseWid = clamp(getV(input, "bp_wid", "param2", 30), 1, 300);
  const baseThk = clamp(getV(input, "bp_thk", "param3", 12), -40, 200);

  const heelPct = clamp(getV(input, "bp_heelPct", "param4", 67), 1, 100);
  const toePct = clamp(getV(input, "bp_toePct", "param5", 46), 1, 100);

  const p2x = clamp(getV(input, "bp_p2x", "param6", -14), -1000, 1000);
  const p3x = clamp(getV(input, "bp_p3x", "param7", -2), -1000, 1000);
  const p4x = clamp(getV(input, "bp_p4x", "param8", 1), -1000, 1000);

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

  const base = (d as any).sketchOnPlane("XY").extrude(-baseThk) as Shape3D;

  // Screw holes (named + legacy param31..36)
  const shX = clamp(getV(input, "bp_sh_x", "param31", 0), -1000, 1000);
  const shY = clamp(getV(input, "bp_sh_y", "param32", 0), -1000, 1000);
  const shDia = clamp(getV(input, "bp_sh_dia", "param33", 0), 0, 200);
  const shSlot = clamp(getV(input, "bp_sh_slot", "param34", 0), 0, 400);
  const shDist = clamp(getV(input, "bp_sh_dist", "param35", 60), 0, 4000);
  const shAng = clamp(getV(input, "bp_sh_ang", "param36", 0), -360, 360);

  if (shDia <= 1e-6) return base;

  const cx = baseWid * 0.5 + shX;
  const cy = baseLen * 0.5 + shY;

  const axis = rot2({ x: 1, y: 0 }, shAng);
  const half = shDist * 0.5;

  const c1 = { x: cx - axis.x * half, y: cy - axis.y * half };
  const c2 = { x: cx + axis.x * half, y: cy + axis.y * half };

  const slotLenTotal = Math.max(shDia, shSlot > 0 ? shSlot : shDia);

  const s1 = makeSlotCutter2D(c1.x, c1.y, shDia, slotLenTotal, shAng);
  const s2 = makeSlotCutter2D(c2.x, c2.y, shDia, slotLenTotal, shAng);

  const cutters2D = [s1, s2].filter(Boolean) as any[];
  if (!cutters2D.length) return base;

  const z0 = Math.min(0, -baseThk);
  const z1 = Math.max(0, -baseThk);
  const depth = Math.max(0.1, z1 - z0 + 2);
  const plane = makePlane("XY", [0, 0, z0 - 1]);

  const cutters3D = cutters2D.map((c2d) => (c2d as any).sketchOnPlane(plane).extrude(depth));
  const cutter = fuseMany(cutters3D);
  if (!cutter || typeof (base as any).cut !== "function") return base;

  return ((base as any).cut(cutter) as Shape3D) ?? base;
}

// =======================================================
// Toe loft helpers (Bezier profiles A/B/C)
// =======================================================
type ToeProfileBezier = {
  endX: number;
  endZ: number;
  p1s: number;
  p3s: number;
  enda: number;
};

// =======================================================
// Toe rail math (world-space) + fake rails
// - OUTER rail enforced exactly via solve endX/endZ per section
// - INNER rail approximated by fitting enda per section
// =======================================================
type Pt3 = { x: number; y: number; z: number };
function add3(a: Pt3, b: Pt3): Pt3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
function sub3(a: Pt3, b: Pt3): Pt3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
function mul3(a: Pt3, s: number): Pt3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}
function dot3(a: Pt3, b: Pt3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function len3(a: Pt3) {
  return Math.hypot(a.x, a.y, a.z);
}
function norm3(a: Pt3): Pt3 {
  const l = len3(a);
  return l > 1e-9 ? { x: a.x / l, y: a.y / l, z: a.z / l } : { x: 1, y: 0, z: 0 };
}
function catmullRom3(p0: Pt3, p1: Pt3, p2: Pt3, p3: Pt3, t: number): Pt3 {
  const t2 = t * t;
  const t3 = t2 * t;

  const ax = 2 * p1.x;
  const ay = 2 * p1.y;
  const az = 2 * p1.z;

  const bx = (p2.x - p0.x) * t;
  const by = (p2.y - p0.y) * t;
  const bz = (p2.z - p0.z) * t;

  const cx = (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2;
  const cy = (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2;
  const cz = (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2;

  const dx = (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3;
  const dy = (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3;
  const dz = (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3;

  return { x: 0.5 * (ax + bx + cx + dx), y: 0.5 * (ay + by + cy + dy), z: 0.5 * (az + bz + cz + dz) };
}

function hermite3(p0: Pt3, p1: Pt3, m0: Pt3, m1: Pt3, t: number): Pt3 {
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return {
    x: h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
    y: h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y,
    z: h00 * p0.z + h10 * m0.z + h01 * p1.z + h11 * m1.z,
  };
}

function endPointWorld(stPt: Pt, tan: Pt, endXSigned: number, endZ: number): Pt3 {
  const t = vnorm(tan);
  const u: Pt3 = { x: -t.y, y: t.x, z: 0 };
  const o: Pt3 = { x: stPt.x, y: stPt.y, z: 0 };
  return add3(o, add3(mul3(u, endXSigned), { x: 0, y: 0, z: endZ }));
}

function solveLocalEndXZ(stPt: Pt, tan: Pt, desiredEnd: Pt3): { endXSigned: number; endZ: number } {
  const t = vnorm(tan);
  const u: Pt3 = { x: -t.y, y: t.x, z: 0 };
  const o: Pt3 = { x: stPt.x, y: stPt.y, z: 0 };
  const d = sub3(desiredEnd, o);
  return {
    endXSigned: dot3(d, u),
    endZ: d.z,
  };
}

type ToeMeta2D = {
  outerEnd: Pt;
  innerEnd: Pt;
  inwardSign: number;
  offSafe: number;
  endNormal: Pt;
};

function toeBezierMeta2D(
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  endAngDeg: number,
  off: number,
  preserveOffset = false
): ToeMeta2D {
  const P0: Pt = { x: 0, y: 0 };
  const P3: Pt = { x: endX, y: endZ };

  const span = Math.hypot(P3.x - P0.x, P3.y - P0.y);
  const offSafe = preserveOffset ? Math.max(0.2, Number(off) || 0.2) : clamp(off, 0.2, Math.max(0.2, span * 0.45));

  const P1: Pt = { x: 0, y: clamp(p1s, 0, 10000) };

  const dir = dirFromDeg(endAngDeg - 180);
  const p3 = clamp(p3s, 0, Math.max(1, span * 1.5));
  let P2: Pt = { x: P3.x - dir.x * p3, y: P3.y - dir.y * p3 };
  P2 = { x: P2.x, y: Math.max(0, P2.y) };

  const mid: Pt = { x: (P0.x + P3.x) * 0.5, y: (P0.y + P3.y) * 0.5 };
  const testP = bezier3(P0, P1, P2, P3, 0.5);
  const dvMid = vnorm(bezier3Deriv(P0, P1, P2, P3, 0.5));
  const nLeftMid = vnorm({ x: -dvMid.y, y: dvMid.x });

  const cand1 = add(testP, mul(nLeftMid, offSafe));
  const cand2 = add(testP, mul(nLeftMid, -offSafe));
  const inwardSign = vlen(sub(cand1, mid)) < vlen(sub(cand2, mid)) ? 1 : -1;

  const dvEnd = vnorm(bezier3Deriv(P0, P1, P2, P3, 1));
  const nLeftEnd = vnorm({ x: -dvEnd.y, y: dvEnd.x });

  const innerEnd = add(P3, mul(nLeftEnd, offSafe * -inwardSign));

  return {
    outerEnd: { x: P3.x, y: P3.y },
    innerEnd: { x: innerEnd.x, y: Math.max(0, innerEnd.y) },
    inwardSign,
    offSafe,
    endNormal: nLeftEnd,
  };
}

function localToWorld(stPt: Pt, tan: Pt, local: Pt): Pt3 {
  const t = vnorm(tan);
  const u: Pt3 = { x: -t.y, y: t.x, z: 0 };
  const o: Pt3 = { x: stPt.x, y: stPt.y, z: 0 };
  return add3(o, add3(mul3(u, local.x), { x: 0, y: 0, z: local.y }));
}

function fitEndAngleForInnerRail(
  st: { pt: Pt; tan: Pt },
  desiredInnerW: Pt3,
  solvedEndXSigned: number,
  solvedEndZ: number,
  p1s: number,
  p3s: number,
  baseEnda: number,
  thickness: number,
  searchDeg = 55,
  steps = 17
): number {
  function errAt(ang: number): number {
    const meta = toeBezierMeta2D(solvedEndXSigned, solvedEndZ, p1s, p3s, ang, thickness);
    const innerW = localToWorld(st.pt, st.tan, meta.innerEnd);

    const dx = innerW.x - desiredInnerW.x;
    const dy = innerW.y - desiredInnerW.y;
    const dz = innerW.z - desiredInnerW.z;
    return dx * dx + dy * dy + dz * dz;
  }

  let bestAng = clamp(baseEnda, -180, 180);
  let bestErr = errAt(bestAng);

  // Coarse sweep (kept for robustness)
  const n = Math.max(9, Math.round(steps));
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const ang = clamp(baseEnda + (u * 2 - 1) * searchDeg, -180, 180);
    const err = errAt(ang);

    if (err < bestErr) {
      bestErr = err;
      bestAng = ang;
    }
  }

  // Local refinements remove visible quantization jumps from the coarse sweep.
  let window = Math.max(0.25, (2 * searchDeg) / Math.max(2, n - 1));
  for (let pass = 0; pass < 3; pass++) {
    const refineSteps = 9;
    let localBestAng = bestAng;
    let localBestErr = bestErr;

    for (let i = 0; i < refineSteps; i++) {
      const u = refineSteps === 1 ? 0.5 : i / (refineSteps - 1);
      const ang = clamp(bestAng + (u * 2 - 1) * window, -180, 180);
      const err = errAt(ang);
      if (err < localBestErr) {
        localBestErr = err;
        localBestAng = ang;
      }
    }

    bestAng = localBestAng;
    bestErr = localBestErr;
    window *= 0.35;
  }

  return clamp(bestAng, -180, 180);
}

// =======================================================
// ONE toe loft A -> B -> C (single loft, smooth through B)
// Fake rails:
// - OUTER rail: exact (solved endX/endZ per section)
// - INNER rail: fit enda per section
// =======================================================
function buildToeABCLoft(
  spinePts: Pt[],
  spineTan: Pt[],
  idxB: number,
  idxC: number,
  midAB: number,
  midBC: number,
  A: ToeProfileBezier,
  B: ToeProfileBezier,
  C: ToeProfileBezier,
  thickness: number,
  flipX: boolean,
  toeAFilletMm = 0,
  bRailStrength = 1,
  aRailStrength = 1,
  cRailStrength = 1
) {
  const sx = flipX ? -1 : 1;

  const lenAB = arcLenBetween(spinePts, 0, idxB);
  const lenBC = arcLenBetween(spinePts, idxB, idxC);
  const lenAC = lenAB + lenBC;

  const nAB = Math.max(0, Math.round(midAB));
  const nBC = Math.max(0, Math.round(midBC));

  const sList: number[] = [];
  sList.push(0);
  for (let i = 1; i <= nAB; i++) sList.push((lenAB * i) / (nAB + 1));
  sList.push(lenAB);
  for (let i = 1; i <= nBC; i++) sList.push(lenAB + (lenBC * i) / (nBC + 1));
  sList.push(lenAC);

  const stations: { pt: Pt; tan: Pt; s: number }[] = [];
  for (const s of sList) {
    if (s <= 1e-9) {
      stations.push({ pt: spinePts[0], tan: spineTan[0], s: 0 });
    } else if (Math.abs(s - lenAB) <= 1e-9) {
      stations.push({ pt: spinePts[idxB], tan: spineTan[idxB], s: lenAB });
    } else if (Math.abs(s - lenAC) <= 1e-9) {
      stations.push({ pt: spinePts[idxC], tan: spineTan[idxC], s: lenAC });
    } else if (s < lenAB) {
      const st = evalStationByArcLenBetween(spinePts, spineTan, 0, idxB, s);
      stations.push({ pt: st.pt, tan: st.tan, s });
    } else {
      const st = evalStationByArcLenBetween(spinePts, spineTan, idxB, idxC, s - lenAB);
      stations.push({ pt: st.pt, tan: st.tan, s });
    }
  }

  function lerpProf(p0: ToeProfileBezier, p1: ToeProfileBezier, t: number): ToeProfileBezier {
    return {
      endX: lerp(p0.endX, p1.endX, t),
      endZ: lerp(p0.endZ, p1.endZ, t),
      p1s: lerp(p0.p1s, p1.p1s, t),
      p3s: lerp(p0.p3s, p1.p3s, t),
      enda: lerp(p0.enda, p1.enda, t),
    };
  }

  const A_st = stations[0];
  const B_st =
    stations.find((q) => Math.abs(q.s - lenAB) <= 1e-9) ?? { pt: spinePts[idxB], tan: spineTan[idxB], s: lenAB };
  const C_st = stations[stations.length - 1];

  // OUTER anchors
  const A_meta = toeBezierMeta2D(sx * A.endX, A.endZ, A.p1s, A.p3s, A.enda, thickness);
  const A_endW = endPointWorld(A_st.pt, A_st.tan, sx * A.endX, A.endZ);
  const B_endW = endPointWorld(B_st.pt, B_st.tan, sx * B.endX, B.endZ);
  const C_endW = endPointWorld(C_st.pt, C_st.tan, sx * C.endX, C.endZ);

  // INNER anchors
  const B_meta = toeBezierMeta2D(sx * B.endX, B.endZ, B.p1s, B.p3s, B.enda, thickness);
  const C_meta = toeBezierMeta2D(sx * C.endX, C.endZ, C.p1s, C.p3s, C.enda, thickness);

  const A_inW = localToWorld(A_st.pt, A_st.tan, A_meta.innerEnd);
  const B_inW = localToWorld(B_st.pt, B_st.tan, B_meta.innerEnd);
  const C_inW = localToWorld(C_st.pt, C_st.tan, C_meta.innerEnd);
  const aTanScale = 1 / clamp(aRailStrength, 0.2, 8);
  const cTanScale = 1 / clamp(cRailStrength, 0.2, 8);

  // Relaxed A-side rail departure (hardcoded):
  // instead of duplicating A in Catmull-Rom, synthesize a pre-A point whose implied tangent
  // is blended between the AB chord and profile-A end tangent direction.
  function localDirToWorldDir(stTan: Pt, localDir: Pt): Pt3 {
    const t = vnorm(stTan);
    const u: Pt3 = { x: -t.y, y: t.x, z: 0 };
    return norm3({ x: u.x * localDir.x, y: u.y * localDir.x, z: localDir.y });
  }
  function makeRelaxedPrevPoint(
    Aw: Pt3,
    Bw: Pt3,
    stTan: Pt,
    localEndNormal: Pt,
    wantedLocalXSign: number
  ) {
    const chord = sub3(Bw, Aw);
    const chordLen = Math.max(1e-6, len3(chord));
    const chordDir = norm3(chord);
    const t = vnorm(stTan);
    const uAxis: Pt3 = { x: -t.y, y: t.x, z: 0 };

    // Reconstruct local end tangent from left normal used by toeBezierMeta2D.
    let localTan: Pt = { x: localEndNormal.y, y: -localEndNormal.x };
    let profDir = localDirToWorldDir(stTan, localTan);
    if (dot3(profDir, chordDir) < 0) {
      localTan = { x: -localTan.x, y: -localTan.y };
      profDir = localDirToWorldDir(stTan, localTan);
    }

    const DIR_BLEND = 0.55; // 0 = pure chord, 1 = pure profile tangent
    const MAG_SCALE = 0.30; // default Catmull duplicate-A gives ~0.5 * chordLen
    let dir = norm3(add3(mul3(chordDir, 1 - DIR_BLEND), mul3(profDir, DIR_BLEND)));

    // Preserve intended left/right side so the A->B rail doesn't invert.
    const wantedSign = Math.sign(wantedLocalXSign || 1);
    const side = dot3(dir, uAxis);
    if (side * wantedSign < 0) {
      dir = norm3(sub3(dir, mul3(uAxis, 2 * side)));
    }

    const tanAtA = mul3(dir, chordLen * MAG_SCALE * aTanScale);

    // Catmull tangent at p1 (A) is 0.5 * (p2 - p0), solve p0 from desired tangent.
    return sub3(Bw, mul3(tanAtA, 2));
  }

  const A_prevOuterW = makeRelaxedPrevPoint(A_endW, B_endW, A_st.tan, A_meta.endNormal, sx * A.endX);
  const A_prevInnerW = makeRelaxedPrevPoint(A_inW, B_inW, A_st.tan, A_meta.endNormal, A_meta.innerEnd.x);
  const bTanScale = 1 / clamp(bRailStrength, 0.2, 8);
  // Use Hermite rail so A/B/C strength sliders directly control endpoint tangent magnitudes.
  const USE_MAIN_DEBUG_RAIL_MATH = false;

  // Planes (unwrap)
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

  const sketches = stations.map((st, idx) => {
    const plane = makeSectionPlane(st.pt, st.tan);

    let prof: ToeProfileBezier;
    if (st.s <= lenAB) {
      const t = lenAB <= 1e-9 ? 0 : clamp(st.s / lenAB, 0, 1);
      prof = lerpProf(A, B, t);
    } else {
      const t = lenBC <= 1e-9 ? 0 : clamp((st.s - lenAB) / lenBC, 0, 1);
      prof = lerpProf(B, C, t);
    }

      // OUTER desired rail
      const filletCut = clamp(toeAFilletMm, 0, 200);
      const cutAmtAB =
        st.s <= lenAB && filletCut > 1e-6 ? filletCut * (1 - smoothstep01(clamp(st.s / filletCut, 0, 1))) : 0;

    let desiredOuterW: Pt3;
    if (st.s <= lenAB) {
      const tAB = lenAB <= 1e-9 ? 0 : clamp(st.s / lenAB, 0, 1);
      desiredOuterW = USE_MAIN_DEBUG_RAIL_MATH
        ? catmullRom3(A_endW, A_endW, B_endW, C_endW, tAB)
        : hermite3(
            A_endW,
            B_endW,
            mul3(sub3(B_endW, A_prevOuterW), 0.5),
            mul3(sub3(C_endW, A_endW), 0.5 * bTanScale),
            tAB
            );
    } else {
      const tBC = lenBC <= 1e-9 ? 0 : clamp((st.s - lenAB) / lenBC, 0, 1);
      desiredOuterW = USE_MAIN_DEBUG_RAIL_MATH
        ? catmullRom3(A_endW, B_endW, C_endW, C_endW, tBC)
        : hermite3(
            B_endW,
            C_endW,
            mul3(sub3(C_endW, A_endW), 0.5 * bTanScale),
            mul3(sub3(C_endW, B_endW), 0.5 * cTanScale),
            tBC
          );
    }

    // INNER desired rail
    let desiredInnerW: Pt3;
    if (st.s <= lenAB) {
      const tAB = lenAB <= 1e-9 ? 0 : clamp(st.s / lenAB, 0, 1);
      desiredInnerW = USE_MAIN_DEBUG_RAIL_MATH
        ? catmullRom3(A_inW, A_inW, B_inW, C_inW, tAB)
        : hermite3(
            A_inW,
            B_inW,
            mul3(sub3(B_inW, A_prevInnerW), 0.5),
            mul3(sub3(C_inW, A_inW), 0.5 * bTanScale),
            tAB
            );
    } else {
      const tBC = lenBC <= 1e-9 ? 0 : clamp((st.s - lenAB) / lenBC, 0, 1);
      desiredInnerW = USE_MAIN_DEBUG_RAIL_MATH
        ? catmullRom3(A_inW, B_inW, C_inW, C_inW, tBC)
        : hermite3(
            B_inW,
            C_inW,
            mul3(sub3(C_inW, A_inW), 0.5 * bTanScale),
            mul3(sub3(C_inW, B_inW), 0.5 * cTanScale),
            tBC
            );
    }

    const desiredOuterLocalBeforeCut = solveLocalEndXZ(st.pt, st.tan, desiredOuterW);
    const desiredInnerLocalBeforeCut = solveLocalEndXZ(st.pt, st.tan, desiredInnerW);

      const desiredOuterLocalAfterCut = desiredOuterLocalBeforeCut;
      const desiredInnerLocalAfterCut = desiredInnerLocalBeforeCut;

    const solved = solveLocalEndXZ(st.pt, st.tan, desiredOuterW);

    const fittedEnda = fitEndAngleForInnerRail(
      { pt: st.pt, tan: st.tan },
      desiredInnerW,
      solved.endXSigned,
      solved.endZ,
      prof.p1s,
      prof.p3s,
      prof.enda,
      thickness,
      55,
      17
    );

      // Temporary hard test disabled in combined ABC path (it can invalidate the
      // first loft section against the rail-fitted progression). Keep normal behavior.
      const sectionCapCutAmt = cutAmtAB;

    const actualMeta = toeBezierMetaTopCutByAmount(
      solved.endXSigned,
      solved.endZ,
      prof.p1s,
      prof.p3s,
      fittedEnda,
      thickness,
      sectionCapCutAmt
    );

        if ((filletCut > 1e-6 || idx === 0) && (idx <= 5 || (st.s > lenAB && idx === stations.length - 1))) {
          postModelDebugStatus(
              `[fil_1][ABC] i=${idx} s=${st.s.toFixed(1)} ${st.s <= lenAB ? "AB" : "BC"} ` +
              `railCut=0.0 secCut=${sectionCapCutAmt.toFixed(1)} ` +
          `oZ:${desiredOuterLocalBeforeCut.endZ.toFixed(1)}->${desiredOuterLocalAfterCut.endZ.toFixed(1)} ` +
          `iZ:${desiredInnerLocalBeforeCut.endZ.toFixed(1)}->${desiredInnerLocalAfterCut.endZ.toFixed(1)} ` +
          `railO=(${desiredOuterLocalAfterCut.endXSigned.toFixed(1)},${desiredOuterLocalAfterCut.endZ.toFixed(1)}) ` +
          `actO=(${actualMeta.outerEnd.x.toFixed(1)},${actualMeta.outerEnd.y.toFixed(1)}) ` +
          `railI=(${desiredInnerLocalAfterCut.endXSigned.toFixed(1)},${desiredInnerLocalAfterCut.endZ.toFixed(1)}) ` +
          `actI=(${actualMeta.innerEnd.x.toFixed(1)},${actualMeta.innerEnd.y.toFixed(1)})`
      );
    }

      const prof2d =
        sectionCapCutAmt > 1e-6
          ? toeBezierProfileTopCutByAmount(
              solved.endXSigned,
              solved.endZ,
              prof.p1s,
              prof.p3s,
              fittedEnda,
              thickness,
              sectionCapCutAmt
            )
          : toeBezierOffsetProfile2D(solved.endXSigned, solved.endZ, prof.p1s, prof.p3s, fittedEnda, thickness, 0, 0);

    return (prof2d as any).sketchOnPlane(plane);
  });

  if (sketches.length < 2) return (sketches[0] as any).extrude(1) as Shape3D;
  return (sketches[0] as any).loftWith(sketches.slice(1)) as Shape3D;
}

// =======================================================
// Toe (AB/BC kept as simple lofts; ABC is the smooth fake-rail loft)
// =======================================================
export async function buildToeABSolid(input: ParamMap): Promise<Shape3D | null> {
  const enabled = !!num((input as any).toeBEnabled, 1);
  if (!enabled) return null;

  const toeThickness = clamp(getV(input, "toe_thk", "param9", 12), 0.2, 80);
  const toeAFillet = clamp(getV(input, "fil_1", "param10", 0), 0, 200);

  const A: ToeProfileBezier = {
    p1s: clamp(getV(input, "toe_a_p1s", "param9991", 25), 0, 10000),
    p3s: clamp(getV(input, "toe_a_p3s", "param9992", 35), 0, 10000),
    endX: clamp(getV(input, "toe_a_endx", "param12", 47), 0.1, 2000),
    endZ: clamp(getV(input, "toe_a_endz", "param13", 35), 0.1, 2000),
    enda: clamp(getV(input, "toe_a_enda", "param9993", 0), -180, 180),
  };

  const stationB = clamp(getV(input, "toe_b_sta", "param15", 60), 1, 2000);
  const midAB = clamp(getV(input, "toe_ab_mid", "param16", 10), 0, 200);

  const B: ToeProfileBezier = {
    p1s: clamp(getV(input, "toe_b_p1s", "param9994", 25), 0, 10000),
    p3s: clamp(getV(input, "toe_b_p3s", "param9995", 36), 0, 10000),
    endX: clamp(getV(input, "toe_b_endx", "param19", 47), 0.1, 2000),
    endZ: clamp(getV(input, "toe_b_endz", "param20", 50), 0.1, 2000),
    enda: clamp(getV(input, "toe_b_enda", "param9996", -18), -180, 180),
  };

  const { spinePts, spineTan } = sampleSpine(input);

  const idx0 = 0;
  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);

  const sectionCount = Math.max(2, Math.round(midAB) + 2);
  const Ts: number[] = [];
  for (let i = 0; i < sectionCount; i++) Ts.push(i / (sectionCount - 1));

  const sx = -1;

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

  const totalLen = arcLenBetween(spinePts, idx0, idxB);

  const sketches = Ts.map((tSection, k) => {
    const targetLen = totalLen * tSection;

    const station =
      k === 0
        ? { pt: spinePts[idx0], tan: spineTan[idx0] }
        : k === Ts.length - 1
          ? { pt: spinePts[idxB], tan: spineTan[idxB] }
          : (() => {
              const s = evalStationByArcLenBetween(spinePts, spineTan, idx0, idxB, targetLen);
              return { pt: s.pt, tan: s.tan };
            })();

    const plane = makeSectionPlane(station.pt, station.tan);

    const endX = lerp(A.endX, B.endX, tSection);
    const endZ = lerp(A.endZ, B.endZ, tSection);
    const p1s = lerp(A.p1s, B.p1s, tSection);
    const p3s = lerp(A.p3s, B.p3s, tSection);
    const enda = lerp(A.enda, B.enda, tSection);

      const cutAmt = k === 0 ? 20 : 0;
      const actualMeta = toeBezierMetaTopCutByAmount(sx * endX, endZ, p1s, p3s, enda, toeThickness, cutAmt);
      if ((toeAFillet > 1e-6 || k === 0) && k <= 5) {
        postModelDebugStatus(
          `[fil_1][AB] i=${k} s=${targetLen.toFixed(1)} cut=${cutAmt.toFixed(1)} ` +
            `railO=(${(sx * endX).toFixed(1)},${endZ.toFixed(1)}) ` +
            `actO=(${actualMeta.outerEnd.x.toFixed(1)},${actualMeta.outerEnd.y.toFixed(1)}) ` +
            `actI=(${actualMeta.innerEnd.x.toFixed(1)},${actualMeta.innerEnd.y.toFixed(1)})`
        );
      }
      const prof2d = toeBezierProfileTopCutByAmount(sx * endX, endZ, p1s, p3s, enda, toeThickness, cutAmt);
      return (prof2d as any).sketchOnPlane(plane);
    });

  return (sketches[0] as any).loftWith(sketches.slice(1)) as Shape3D;
}

export async function buildToeBCSolid(input: ParamMap): Promise<Shape3D | null> {
  const enabled = !!num((input as any).toeCEnabled, 1);
  if (!enabled) return null;

  const toeThickness = clamp(getV(input, "toe_thk", "param9", 12), 0.2, 80);

  const stationB = clamp(getV(input, "toe_b_sta", "param15", 60), 1, 2000);
  const B: ToeProfileBezier = {
    p1s: clamp(getV(input, "toe_b_p1s", "param9994", 25), 0, 10000),
    p3s: clamp(getV(input, "toe_b_p3s", "param9995", 36), 0, 10000),
    endX: clamp(getV(input, "toe_b_endx", "param19", 47), 0.1, 2000),
    endZ: clamp(getV(input, "toe_b_endz", "param20", 50), 0.1, 2000),
    enda: clamp(getV(input, "toe_b_enda", "param9996", -18), -180, 180),
  };

  const stationC = clamp(getV(input, "toe_c_sta", "param21", 137), 1, 2000);
  const midBC = clamp(getV(input, "toe_bc_mid", "param22", 15), 0, 200);

  const C: ToeProfileBezier = {
    p1s: clamp(getV(input, "toe_c_p1s", "param9997", 25), 0, 10000),
    p3s: clamp(getV(input, "toe_c_p3s", "param9998", 35), 0, 10000),
    endX: clamp(getV(input, "toe_c_endx", "param25", 19), 0.1, 2000),
    endZ: clamp(getV(input, "toe_c_endz", "param26", 75), 0.1, 2000),
    enda: clamp(getV(input, "toe_c_enda", "param9999", -70), -180, 180),
  };

  const { spinePts, spineTan } = sampleSpine(input);

  let idxB = findEndIdxByArcLen(spinePts, stationB);
  idxB = clamp(idxB, 1, spinePts.length - 2);

  let idxC = findEndIdxByArcLen(spinePts, stationC);
  idxC = clamp(idxC, idxB + 1, spinePts.length - 1);

  const sectionCount = Math.max(2, Math.round(midBC) + 2);
  const Ts: number[] = [];
  for (let i = 0; i < sectionCount; i++) Ts.push(i / (sectionCount - 1));

  const sx = -1;

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

  const totalLen = arcLenBetween(spinePts, idxB, idxC);

  const sketches = Ts.map((tSection, k) => {
    const targetLen = totalLen * tSection;

    const station =
      k === 0
        ? { pt: spinePts[idxB], tan: spineTan[idxB] }
        : k === Ts.length - 1
          ? { pt: spinePts[idxC], tan: spineTan[idxC] }
          : (() => {
              const s = evalStationByArcLenBetween(spinePts, spineTan, idxB, idxC, targetLen);
              return { pt: s.pt, tan: s.tan };
            })();

    const plane = makeSectionPlane(station.pt, station.tan);

    const endX = lerp(B.endX, C.endX, tSection);
    const endZ = lerp(B.endZ, C.endZ, tSection);
    const p1s = lerp(B.p1s, C.p1s, tSection);
    const p3s = lerp(B.p3s, C.p3s, tSection);
    const enda = lerp(B.enda, C.enda, tSection);

    const prof2d = toeBezierOffsetProfile2D(sx * endX, endZ, p1s, p3s, enda, toeThickness, 0, 0);
    return (prof2d as any).sketchOnPlane(plane);
  });

  return (sketches[0] as any).loftWith(sketches.slice(1)) as Shape3D;
}

export async function buildToeSolid(input: ParamMap): Promise<Shape3D | null> {
  const toeBEnabled = !!num((input as any).toeBEnabled, 1);
  const toeCEnabled = !!num((input as any).toeCEnabled, 1);
  if (!toeBEnabled && !toeCEnabled) return null;

  // If both are on: build ONE smooth loft A->B->C using fake rails.
  if (toeBEnabled && toeCEnabled) {
    const toeThickness = clamp(getV(input, "toe_thk", "param9", 12), 0.2, 80);
    const toeAFillet = clamp(getV(input, "fil_1", "param10", 0), 0, 200);

    const A: ToeProfileBezier = {
      p1s: clamp(getV(input, "toe_a_p1s", "param9991", 25), 0, 10000),
      p3s: clamp(getV(input, "toe_a_p3s", "param9992", 35), 0, 10000),
      endX: clamp(getV(input, "toe_a_endx", "param12", 47), 0.1, 2000),
      endZ: clamp(getV(input, "toe_a_endz", "param13", 35), 0.1, 2000),
      enda: clamp(getV(input, "toe_a_enda", "param9993", 0), -180, 180),
    };

    const B: ToeProfileBezier = {
      p1s: clamp(getV(input, "toe_b_p1s", "param9994", 25), 0, 10000),
      p3s: clamp(getV(input, "toe_b_p3s", "param9995", 36), 0, 10000),
      endX: clamp(getV(input, "toe_b_endx", "param19", 47), 0.1, 2000),
      endZ: clamp(getV(input, "toe_b_endz", "param20", 50), 0.1, 2000),
      enda: clamp(getV(input, "toe_b_enda", "param9996", -18), -180, 180),
    };

    const C: ToeProfileBezier = {
      p1s: clamp(getV(input, "toe_c_p1s", "param9997", 25), 0, 10000),
      p3s: clamp(getV(input, "toe_c_p3s", "param9998", 35), 0, 10000),
      endX: clamp(getV(input, "toe_c_endx", "param25", 19), 0.1, 2000),
      endZ: clamp(getV(input, "toe_c_endz", "param26", 75), 0.1, 2000),
      enda: clamp(getV(input, "toe_c_enda", "param9999", -70), -180, 180),
    };

    const stationB = clamp(getV(input, "toe_b_sta", "param15", 60), 1, 2000);
    const stationC = clamp(getV(input, "toe_c_sta", "param21", 137), 1, 2000);
    const midAB = clamp(getV(input, "toe_ab_mid", "param16", 10), 0, 200);
    const midBC = clamp(getV(input, "toe_bc_mid", "param22", 15), 0, 200);
    const aRailStrength = clamp(getV(input, "toe_a_strength", "param10011", 2), 0.2, 8);
    const bRailStrength = clamp(getV(input, "toe_b_strength", "param10010", 2), 0.2, 8);
    const cRailStrength = clamp(getV(input, "toe_c_strength", "param10012", 7), 0.2, 8);

    const { spinePts, spineTan } = sampleSpine(input);

    let idxB = findEndIdxByArcLen(spinePts, stationB);
    idxB = clamp(idxB, 1, spinePts.length - 2);

    let idxC = findEndIdxByArcLen(spinePts, stationC);
    idxC = clamp(idxC, idxB + 1, spinePts.length - 1);

    const FLIP_X = true;
    return buildToeABCLoft(
      spinePts,
      spineTan,
      idxB,
      idxC,
      midAB,
      midBC,
      A,
      B,
      C,
      toeThickness,
      FLIP_X,
      toeAFillet,
      bRailStrength,
      aRailStrength,
      cRailStrength
    );
  }

  // Otherwise: keep the single segment lofts
  if (toeBEnabled && !toeCEnabled) return await buildToeABSolid(input);
  return await buildToeBCSolid(input);
}

// =======================================================
// Heel Kick
// =======================================================
export async function buildHeelSolid(input: ParamMap): Promise<Shape3D> {
  const { spinePts, spineTan } = sampleSpine(input);

  const stationC = clamp(getV(input, "toe_c_sta", "param21", 137), 1, 2000);
  let idxC = findEndIdxByArcLen(spinePts, stationC);

  const idxEnd = spinePts.length - 1;
  idxC = clamp(idxC, 1, Math.max(1, idxEnd - 2));

  let heelH_C = clamp(getV(input, "heel_h_c", "param28", 40), 0.1, 400);
  let heelH_D = clamp(getV(input, "heel_h_d", "param29", 10), 0.1, 400);
  const midCD = Math.round(clamp(getV(input, "heel_cd_mid", "param30", 2), 0, 60));
  const thickness = clamp(getV(input, "toe_thk", "param9", 12), 0.5, 80);

  const endX_C = clamp(getV(input, "toe_c_endx", "param25", 19), 0.1, 2000);
  const endZ_C = clamp(getV(input, "toe_c_endz", "param26", 75), 0.1, 2000);
  const p1s_C = clamp(getV(input, "toe_c_p1s", "param9997", 25), 0, 10000);
  const p3s_C = clamp(getV(input, "toe_c_p3s", "param9998", 35), 0, 10000);
  const enda_C = clamp(getV(input, "toe_c_enda", "param9999", -70), -180, 180);

  const heelWidth = thickness;
  const sx = 1;
  const sxFirst = -sx;
  const cdLen = arcLenBetween(spinePts, idxC, idxEnd);
  const sectionCount = midCD + 2;

  // Model-side safety clamp based on the actual sampled C profile shape (more reliable
  // than using toe_c_endz alone). This prevents asking the cap-cut/loft for heights that
  // exceed the available profile C geometry.
  try {
    const { outerPts } = toeBezierOffsetProfileFixedPts(sxFirst * endX_C, endZ_C, p1s_C, p3s_C, enda_C, thickness);
    const cTopZ = Math.max(...outerPts.map((p) => p.y));
    const safeTopZ = Math.max(0.1, cTopZ - 0.1);
    const prevHC = heelH_C;
    const prevHD = heelH_D;
    heelH_C = clamp(heelH_C, 0.1, safeTopZ);
    heelH_D = clamp(heelH_D, 0.1, safeTopZ);
    if (heelH_C !== prevHC || heelH_D !== prevHD) {
      postModelDebugStatus(
        `heel height clamp: safeTop=${safeTopZ.toFixed(1)} hc=${heelH_C.toFixed(1)} hd=${heelH_D.toFixed(1)}`
      );
    }
  } catch {
    // If sampling fails, keep original values and rely on retries below.
  }

  function makeHeelProfileAtHeight(h: number, useNormalCap: boolean) {
    if (useNormalCap) {
      // Reference = normal-cap cut at height h, then fit a toe-style profile to that
      // reference so the heel sections render with toe-like profile construction.
      return toeBezierProfileMatchedToNormalCapRefByClipZ(sxFirst * endX_C, endZ_C, p1s_C, p3s_C, enda_C, thickness, h);
    }
    return clippedToeBezierProfileLower(sxFirst * endX_C, endZ_C, p1s_C, p3s_C, enda_C, thickness, h);
  }

  function buildHeelSketches(useNormalCap: boolean, sectionCountLocal: number) {
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
    // Denser sampling near D helps define the cut-cap edge more cleanly.
    // Keep the user-controlled section count intact; only bias spacing.
    const sectionCountEff = Math.max(2, sectionCountLocal);

    const planeC = makePlaneAt(spinePts[idxC], spineTan[idxC]);
    sketches.push((makeHeelProfileAtHeight(heelH_C, useNormalCap) as any).sketchOnPlane(planeC));

      for (let k = 1; k < sectionCountEff - 1; k++) {
        const tLin = k / (sectionCountEff - 1);
        const t = tLin;
        const targetLen = cdLen * t;
        const st = evalStationByArcLenBetween(spinePts, spineTan, idxC, idxEnd, targetLen);
      const h = heelH_C + (heelH_D - heelH_C) * t;
      const plane = makePlaneAt(st.pt, st.tan);
      const midProf = makeHeelProfileAtHeight(h, useNormalCap);
      sketches.push((midProf as any).sketchOnPlane(plane));
      }

      const planeD = makePlaneAt(spinePts[idxEnd], spineTan[idxEnd]);
      sketches.push((makeHeelProfileAtHeight(heelH_D, useNormalCap) as any).sketchOnPlane(planeD));
      return sketches;
    }

  const sketches = buildHeelSketches(true, sectionCount);
  return (sketches[0] as any).loftWith(sketches.slice(1)) as Shape3D;
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
