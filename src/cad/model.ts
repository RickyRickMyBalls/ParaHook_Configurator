// FILE: src/cad/model.ts
import { draw, drawCircle, makePlane, type Shape3D } from "replicad";

export type ParamMap = Record<string, unknown>;
type Pt = { x: number; y: number; arcMidFromPrev?: { x: number; y: number }; skipDraw?: boolean };

// =======================================================
// Shared helpers
// =======================================================
const DEBUG_SHOW_SH_FIL_1_INFILL_SEPARATE = false;
const DEBUG_SKIP_BASE_CUT_WHEN_SH_FIL_1 = false;
const DEBUG_SKIP_SH_FIL_1_INFILL_FUSE = false;
const DEBUG_FORCE_SH_FIL_1_OFFSET_SIDE: 0 | 1 | -1 = 0; // 0=auto, 1=offA, -1=offB

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
type ArchPts = { outerPts: Pt[]; innerPts: Pt[] };

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
  for (let i = 1; i < loop.length; i++) {
    const p = loop[i];
    if (p.skipDraw) continue;
    if (p.arcMidFromPrev) {
      d = (d as any).threePointsArcTo([p.x, p.y], [p.arcMidFromPrev.x, p.arcMidFromPrev.y]);
    } else {
      d = (d as any).lineTo([p.x, p.y]);
    }
  }
  return (d as any).close();
}

function signedArea2(loop: Pt[]) {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const p = loop[i];
    const q = loop[(i + 1) % loop.length];
    a += p.x * q.y - q.x * p.y;
  }
  return 0.5 * a;
}

function pruneLoopTinyKinks(loop: Pt[], distEps = 0.2, offLineEps = 0.08): Pt[] {
  let out = loop.slice();
  if (out.length < 4) return out;

  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    const next: Pt[] = [];
    const n = out.length;
    if (n < 4) break;

    for (let i = 0; i < n; i++) {
      const a = out[(i - 1 + n) % n];
      const b = out[i];
      const c = out[(i + 1) % n];

      const ab = dist(a, b);
      const bc = dist(b, c);
      const ac = dist(a, c);

      // Remove tiny spikes/edges.
      if (ab <= distEps || bc <= distEps) {
        changed = true;
        continue;
      }

      // Remove nearly-collinear points by perpendicular distance to AC.
      if (ac > 1e-6) {
        const area2 = Math.abs(cross2(sub(b, a), sub(c, a)));
        const h = area2 / ac;
        if (h <= offLineEps) {
          changed = true;
          continue;
        }
      }

      next.push(b);
    }

    out = dedupePts(next, 1e-6);
    if (!changed) break;
  }

  return out.length >= 3 ? out : loop;
}

function filletClosedLoopCorner(loop: Pt[], idx: number, radius: number, arcSegs = 8, emitTrueArc = false): Pt[] {
  if (loop.length < 3) return loop;
  const r = Math.max(0, radius);
  if (r <= 1e-6) return loop;

  const n = loop.length;
  const i1 = idx % n;
  const p1 = loop[i1];
  const minAdjDist = Math.max(1, r * 0.6);
  const pickNeighbor = (step: -1 | 1) => {
    let k = i1;
    let traveled = 0;
    for (let hops = 0; hops < n - 1; hops++) {
      const kNext = (k + step + n) % n;
      traveled += dist(loop[k], loop[kNext]);
      k = kNext;
      if (traveled >= minAdjDist) return { idx: k, pt: loop[k] };
    }
    const j = (i1 + step + n) % n;
    return { idx: j, pt: loop[j] };
  };
  const prevPick = pickNeighbor(-1);
  const nextPick = pickNeighbor(1);
  const p0 = prevPick.pt;
  const p2 = nextPick.pt;

  const a = sub(p0, p1);
  const b = sub(p2, p1);
  const la = vlen(a);
  const lb = vlen(b);
  if (la <= 1e-6 || lb <= 1e-6) return loop;

  const ua = mul(a, 1 / la);
  const ub = mul(b, 1 / lb);
  const dot = clamp(dot2(ua, ub), -1, 1);
  const theta = Math.acos(dot);
  if (!Number.isFinite(theta) || theta <= 1e-3 || theta >= Math.PI - 1e-3) return loop;

  const tanHalf = Math.tan(theta * 0.5);
  if (Math.abs(tanHalf) <= 1e-9) return loop;

  const maxTrim = Math.max(0, Math.min(la, lb) - 1e-4);
  const trim = Math.min(r / tanHalf, maxTrim);
  if (trim <= 1e-6) return loop;

  const rEff = trim * tanHalf;
  const sinHalf = Math.sin(theta * 0.5);
  if (Math.abs(sinHalf) <= 1e-9) return loop;

  const start = add(p1, mul(ua, trim));
  const end = add(p1, mul(ub, trim));
  const bis = vnorm(add(ua, ub));
  if (vlen(bis) <= 1e-6) return loop;

  const orient = signedArea2(loop) >= 0 ? 1 : -1; // +1 CCW, -1 CW
  const incoming = sub(p1, p0);
  const outgoing = sub(p2, p1);
  const centerDist = rEff / sinHalf;
  const cA = add(p1, mul(bis, centerDist));
  const cB = add(p1, mul(bis, -centerDist));
  const sideScore = (c: Pt) => {
    const s1 = cross2(incoming, sub(c, p0)) * orient;
    const s2 = cross2(outgoing, sub(c, p1)) * orient;
    return Math.min(s1, s2);
  };
  const center = sideScore(cA) >= sideScore(cB) ? cA : cB;

  const rs = sub(start, center);
  const re = sub(end, center);
  let a0 = Math.atan2(rs.y, rs.x);
  let a1 = Math.atan2(re.y, re.x);
  let da = a1 - a0;
  while (da <= -Math.PI) da += Math.PI * 2;
  while (da > Math.PI) da -= Math.PI * 2;

  const arcPts: Pt[] = [];
  const segs = Math.max(2, Math.round(arcSegs));
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    const a = a0 + da * t;
    arcPts.push({ x: center.x + Math.cos(a) * rEff, y: center.y + Math.sin(a) * rEff, skipDraw: emitTrueArc });
  }
  let endOut: Pt = end;
  if (emitTrueArc) {
    const aMid = a0 + da * 0.5;
    endOut = {
      x: end.x,
      y: end.y,
      arcMidFromPrev: { x: center.x + Math.cos(aMid) * rEff, y: center.y + Math.sin(aMid) * rEff },
    };
  }

  const shouldSkip = (i: number) => {
    if (i === i1) return true;
    // Skip points between prevPick -> corner and corner -> nextPick since the fillet trims them.
    let k = (prevPick.idx + 1) % n;
    while (k !== i1) {
      if (k === i) return true;
      k = (k + 1) % n;
    }
    k = (i1 + 1) % n;
    while (k !== nextPick.idx) {
      if (k === i) return true;
      k = (k + 1) % n;
    }
    return false;
  };

  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    if (i === prevPick.idx) {
      out.push(loop[i], start, ...arcPts, endOut);
      continue;
    }
    if (shouldSkip(i)) continue;
    out.push(loop[i]);
  }
  return dedupePts(out, 1e-6);
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

// Explicit stadium from two circle centers:
// top tangent line -> end half-circle -> bottom tangent line -> start half-circle
// (arcs are sampled as polylines for robustness with the current sketch code path)
function stadiumBetweenCentersLoop(a: Pt, b: Pt, diaMm: number, segsPerSemi = 24): Pt[] {
  const dia = Math.max(0, diaMm);
  const r = dia * 0.5;
  if (r <= 1e-6) return [];

  const d = sub(b, a);
  const L = vlen(d);
  if (L <= 1e-6) return stadiumLoop(dia, dia, Math.max(12, segsPerSemi));

  const u = vnorm(d);
  const n = { x: -u.y, y: u.x }; // left normal

  const out: Pt[] = [];

  // Start on the "top" tangent of the start circle, then line to end top tangent.
  out.push({ x: a.x + n.x * r, y: a.y + n.y * r });
  out.push({ x: b.x + n.x * r, y: b.y + n.y * r });

  // End cap: sweep from +n to -n through +u.
  for (let i = 1; i <= segsPerSemi; i++) {
    const t = i / segsPerSemi;
    const ang = Math.PI * t;
    const vx = n.x * Math.cos(ang) + u.x * Math.sin(ang);
    const vy = n.y * Math.cos(ang) + u.y * Math.sin(ang);
    out.push({ x: b.x + vx * r, y: b.y + vy * r });
  }

  // Bottom tangent back to start circle.
  out.push({ x: a.x - n.x * r, y: a.y - n.y * r });

  // Start cap: sweep from -n back to +n through -u.
  for (let i = 1; i <= segsPerSemi; i++) {
    const t = i / segsPerSemi;
    const ang = Math.PI * t;
    const vx = -n.x * Math.cos(ang) - u.x * Math.sin(ang);
    const vy = -n.y * Math.cos(ang) - u.y * Math.sin(ang);
    out.push({ x: a.x + vx * r, y: a.y + vy * r });
  }

  return dedupePts(out, 1e-6);
}

function segmentIntersectionPt(a0: Pt, a1: Pt, b0: Pt, b1: Pt, eps = 1e-9): Pt | null {
  const r = sub(a1, a0);
  const s = sub(b1, b0);
  const denom = cross2(r, s);
  if (Math.abs(denom) <= eps) return null;

  const qmp = sub(b0, a0);
  const t = cross2(qmp, s) / denom;
  const u = cross2(qmp, r) / denom;
  if (t < -eps || t > 1 + eps || u < -eps || u > 1 + eps) return null;

  return { x: a0.x + r.x * t, y: a0.y + r.y * t };
}

function closedLoopIntersections2D(loopA: Pt[], loopB: Pt[]): Pt[] {
  if (loopA.length < 2 || loopB.length < 2) return [];
  const out: Pt[] = [];
  for (let i = 0; i < loopA.length; i++) {
    const a0 = loopA[i];
    const a1 = loopA[(i + 1) % loopA.length];
    for (let j = 0; j < loopB.length; j++) {
      const b0 = loopB[j];
      const b1 = loopB[(j + 1) % loopB.length];
      const hit = segmentIntersectionPt(a0, a1, b0, b1);
      if (hit) out.push(hit);
    }
  }
  return out;
}

function dedupePtsAnyOrder(pts: Pt[], eps = 1e-3): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    if (!out.some((q) => Math.hypot(p.x - q.x, p.y - q.y) <= eps)) out.push(p);
  }
  return out;
}

function makeSlotCutter2D(centerX: number, centerY: number, diaMm: number, slotLenMm: number, angDeg: number) {
  const loopLocal = stadiumLoop(diaMm, slotLenMm, 26);
  if (loopLocal.length < 3) return null;

  const loopWorld = loopLocal.map((p) => rot2(p, angDeg)).map((p) => ({ x: p.x + centerX, y: p.y + centerY }));
  return polyToDraw(loopWorld);
}

function makeSlotCutter2DFromCenters(a: Pt, b: Pt, diaMm: number) {
  const loop = stadiumBetweenCentersLoop(a, b, diaMm, 26);
  if (loop.length < 3) return null;
  return polyToDraw(loop);
}

type SegHit2D = { pt: Pt; segIdx: number; t: number };
type LoopIntersectionHit2D = { pt: Pt; a: SegHit2D; b: SegHit2D };

function pointInClosedLoop2D(loop: Pt[], p: Pt): boolean {
  let inside = false;
  for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
    const pi = loop[i];
    const pj = loop[j];
    const yi = pi.y > p.y;
    const yj = pj.y > p.y;
    if (yi === yj) continue;
    const xCross = ((pj.x - pi.x) * (p.y - pi.y)) / ((pj.y - pi.y) || 1e-12) + pi.x;
    if (p.x < xCross) inside = !inside;
  }
  return inside;
}

function polylinePointAtFrac(path: Pt[], frac01: number): Pt {
  if (path.length <= 1) return path[0] ?? { x: 0, y: 0 };
  const t = clamp(frac01, 0, 1);
  let total = 0;
  for (let i = 1; i < path.length; i++) total += dist(path[i - 1], path[i]);
  if (total <= 1e-9) return path[0];

  const target = total * t;
  let acc = 0;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    const seg = dist(a, b);
    if (seg <= 1e-9) continue;
    if (acc + seg >= target) {
      const u = (target - acc) / seg;
      return lerpPt(a, b, u);
    }
    acc += seg;
  }
  return path[path.length - 1];
}

function closedLoopIntersectionsDetailed(loopA: Pt[], loopB: Pt[], eps = 1e-9): LoopIntersectionHit2D[] {
  if (loopA.length < 2 || loopB.length < 2) return [];
  const out: LoopIntersectionHit2D[] = [];
  for (let i = 0; i < loopA.length; i++) {
    const a0 = loopA[i];
    const a1 = loopA[(i + 1) % loopA.length];
    const r = sub(a1, a0);
    for (let j = 0; j < loopB.length; j++) {
      const b0 = loopB[j];
      const b1 = loopB[(j + 1) % loopB.length];
      const s = sub(b1, b0);
      const denom = cross2(r, s);
      if (Math.abs(denom) <= eps) continue;
      const qmp = sub(b0, a0);
      const t = cross2(qmp, s) / denom;
      const u = cross2(qmp, r) / denom;
      if (t < -eps || t > 1 + eps || u < -eps || u > 1 + eps) continue;
      out.push({
        pt: { x: a0.x + r.x * t, y: a0.y + r.y * t },
        a: { pt: { x: a0.x + r.x * t, y: a0.y + r.y * t }, segIdx: i, t: clamp(t, 0, 1) },
        b: { pt: { x: a0.x + r.x * t, y: a0.y + r.y * t }, segIdx: j, t: clamp(u, 0, 1) },
      });
    }
  }
  return out;
}

function traceClosedLoopBetweenHits(loop: Pt[], from: SegHit2D, to: SegHit2D): Pt[] {
  const n = loop.length;
  if (n < 2) return [];
  const out: Pt[] = [{ x: from.pt.x, y: from.pt.y }];

  if (from.segIdx === to.segIdx && to.t >= from.t) {
    out.push({ x: to.pt.x, y: to.pt.y });
    return dedupePts(out, 1e-6);
  }

  let seg = from.segIdx;
  for (let guard = 0; guard < n + 2; guard++) {
    const nextVertex = loop[(seg + 1) % n];
    out.push({ x: nextVertex.x, y: nextVertex.y });
    seg = (seg + 1) % n;
    if (seg === to.segIdx) break;
  }
  out.push({ x: to.pt.x, y: to.pt.y });
  return dedupePts(out, 1e-6);
}

// Keep these local helpers available for iterative seam/infill work even when a
// given build path does not currently call them.
void closedLoopIntersections2D;
void dedupePtsAnyOrder;
void polylinePointAtFrac;
void traceClosedLoopBetweenHits;

// Same stadium footprint as makeSlotCutter2DFromCenters, but built from true lines + arcs
// (used for washer outer pads so the seam is not polygonized).
function makeSlotProfile2DFromCentersArc(a: Pt, b: Pt, diaMm: number) {
  const dia = Math.max(0, diaMm);
  const r = dia * 0.5;
  if (r <= 1e-6) return null;

  const d = sub(b, a);
  const L = vlen(d);
  if (L <= 1e-6) return (drawCircle(r) as any).translate(a.x, a.y);

  const u = vnorm(d);
  const n = { x: -u.y, y: u.x }; // left normal

  const aTop = { x: a.x + n.x * r, y: a.y + n.y * r };
  const bTop = { x: b.x + n.x * r, y: b.y + n.y * r };
  const bBot = { x: b.x - n.x * r, y: b.y - n.y * r };
  const aBot = { x: a.x - n.x * r, y: a.y - n.y * r };

  // Points on the arc bulges (ensures semicircles, not straight chords)
  const bMid = { x: b.x + u.x * r, y: b.y + u.y * r };
  const aMid = { x: a.x - u.x * r, y: a.y - u.y * r };

  let d2 = draw([aTop.x, aTop.y]);
  d2 = (d2 as any).lineTo([bTop.x, bTop.y]);
  d2 = (d2 as any).threePointsArcTo([bBot.x, bBot.y], [bMid.x, bMid.y]);
  d2 = (d2 as any).lineTo([aBot.x, aBot.y]);
  d2 = (d2 as any).threePointsArcTo([aTop.x, aTop.y], [aMid.x, aMid.y]);
  return (d2 as any).close();
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

  const maxOuterZ = Math.max(...outerPts.map((p: Pt) => p.y));
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

  const maxOuterZ = Math.max(...outerPts.map((p: Pt) => p.y));
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
  const maxOuterZ = Math.max(...outerPts.map((p: Pt) => p.y));
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
    const maxOuterZ = Math.max(...outerPts.map((p: Pt) => p.y));
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
    const maxOuterZ = Math.max(...outerPts.map((p: Pt) => p.y));
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

  // Build the baseplate sketch loop as points so we can fillet the end-cap corners
  // (outer[last] and inner[last]) before extrusion.
  let baseLoop: Pt[] = [{ x: 0, y: 0 }, ...outer, inner[inner.length - 1], ...inner.slice(0, inner.length - 1).reverse()];
  const startCapOuterIdx = 1; // first point in outer[] == baseLoop[1]
  const endCapOuterIdx = outer.length; // [0]=origin, [1..outer.length]=outer[]
  const baseFilletEnabled = clamp(getV(input, "bp_fil_1", "param_bp_fil_1", 0), 0, 1) > 0.5;
  const baseFilletRadius = clamp(getV(input, "bp_fil_1_r", "param_bp_fil_1_r", 8), 0, 200);
  const baseEndFilletR = baseFilletEnabled ? baseFilletRadius : 0;

  // Fillet the toe outer end-cap corner plus the outer-start corner. Apply higher
  // index first to avoid shifting lower indices before we process them.
  baseLoop = filletClosedLoopCorner(baseLoop, endCapOuterIdx, baseEndFilletR, 10, true);
  baseLoop = filletClosedLoopCorner(baseLoop, startCapOuterIdx, baseEndFilletR, 10, true);
  baseLoop = pruneLoopTinyKinks(baseLoop, 0.25, 0.12);

  const base = (polyToDraw(baseLoop) as any).sketchOnPlane("XY").extrude(-baseThk) as Shape3D;

  // Screw holes (named + legacy param31..36)
  // UI-local screw-hole origin: (0,0) in the UI maps to this calibrated baseplate point.
  const SH_ORIGIN_X = -40;
  const SH_ORIGIN_Y = 25;
  const shX = clamp(getV(input, "bp_sh_x", "param31", 0), -1000, 1000);
  const shY = clamp(getV(input, "bp_sh_y", "param32", 0), -1000, 1000);
  const shDia = clamp(getV(input, "bp_sh_dia", "param33", 0), 0, 200);
  const shWasher = clamp(getV(input, "bp_sh_washer", "param33b", 10), 0, 400);
  const shSlot = clamp(getV(input, "bp_sh_slot", "param34", 30), 0, 400);
  const shDist = clamp(getV(input, "bp_sh_dist", "param35", 10), 0, 4000);
  const shAng = clamp(getV(input, "bp_sh_ang", "param36", 12), -360, 360);
  const shAng2 = clamp(getV(input, "bp_sh_ang2", "param36b", -20), -360, 360);
  const shOff2 = clamp(getV(input, "bp_sh_off2", "param36c", 60), -4000, 4000);
  const shFil1Enabled = clamp(getV(input, "sh_fil_1", "param_sh_fil_1", 0), 0, 1) > 0.5;
  const shFil1Radius = clamp(getV(input, "sh_fil_1_r", "param_sh_fil_1_r", 4), 0, 200);

  if (shFil1Enabled && shFil1Radius > 1e-6) {
    // Placeholder: values are now wired through UI -> main -> worker -> model.
    // Screw-hole fillet application can be added where slot/hole cutter loops are built.
  }

  if (shDia <= 1e-6) return base;

  // UI values are local offsets from the calibrated screw-hole origin.
  const cx = SH_ORIGIN_X + shX;
  const cy = SH_ORIGIN_Y + shY;

  // UI-friendly convention: 0 deg = +Y (baseplate length direction)
  const axis = rot2({ x: 0, y: 1 }, shAng);
  // Pair spacing semantics:
  // - round holes (slot=0): bp_sh_dist = center-to-center distance
  // - slots (slot>0):      bp_sh_dist = end-to-start gap between slots
  //   (measured along the slot centerline span, so add slot length to get center spacing)
  const pairCenterSpacing = shSlot > 1e-6 ? shDist + shSlot : shDist;
  // bp_sh_x / bp_sh_y define the FIRST hole/slot center.
  // The SECOND hole/slot is placed along the pattern axis by the computed spacing.
  const c1 = { x: cx, y: cy };
  const axis2 = rot2({ x: 0, y: 1 }, shAng + shAng2);
  const c2Base = { x: cx + axis.x * pairCenterSpacing, y: cy + axis.y * pairCenterSpacing };
  const c2 = { x: c2Base.x + axis2.x * shOff2, y: c2Base.y + axis2.y * shOff2 };

  // Build an inline round/slot profile anchored at the first hole center, extending
  // along local +Y by `slotExtra` when slotExtra > 0.
  const makeInlineProfileAt = (c: Pt, dia: number, slotExtra: number, slotAxis: Pt): any | null => {
    const dSafe = Math.max(0, dia);
    if (dSafe <= 1e-6) return null;
    if (slotExtra > 1e-6) {
      const cEnd = { x: c.x + slotAxis.x * slotExtra, y: c.y + slotAxis.y * slotExtra };
      return makeSlotCutter2DFromCenters(c, cEnd, dSafe);
    }
    return makeSlotCutter2D(c.x, c.y, dSafe, dSafe, 0);
  };
  const makeInlineProfileAtArc = (c: Pt, dia: number, slotExtra: number, slotAxis: Pt): any | null => {
    const dSafe = Math.max(0, dia);
    if (dSafe <= 1e-6) return null;
    if (slotExtra > 1e-6) {
      const cEnd = { x: c.x + slotAxis.x * slotExtra, y: c.y + slotAxis.y * slotExtra };
      return makeSlotProfile2DFromCentersArc(c, cEnd, dSafe);
    }
    return (drawCircle(dSafe * 0.5) as any).translate(c.x, c.y);
  };
  const makeInlineProfileLoopAt = (c: Pt, dia: number, slotExtra: number, slotAxis: Pt): Pt[] | null => {
    const dSafe = Math.max(0, dia);
    if (dSafe <= 1e-6) return null;
    if (slotExtra > 1e-6) {
      const cEnd = { x: c.x + slotAxis.x * slotExtra, y: c.y + slotAxis.y * slotExtra };
      return stadiumBetweenCentersLoop(c, cEnd, dSafe, 26);
    }
    return stadiumLoop(dSafe, dSafe, 26).map((p) => ({ x: p.x + c.x, y: p.y + c.y }));
  };

  const washerOffset = Math.max(0, shWasher);
  const washerOuterDia = shDia + washerOffset * 2;

  // 1) Washer profiles first (outer footprint only; no hole cut yet)
  const washer2D = [
    makeInlineProfileAtArc(c1, washerOuterDia, shSlot, axis),
    makeInlineProfileAtArc(c2, washerOuterDia, shSlot, axis2),
  ].filter(Boolean) as any[];
  const washerOuterLoops2D = [
    makeInlineProfileLoopAt(c1, washerOuterDia, shSlot, axis),
    makeInlineProfileLoopAt(c2, washerOuterDia, shSlot, axis2),
  ].filter((v): v is Pt[] => !!v && v.length >= 3);

  // 2) Hole/slot cutters second (actual through-cuts)
  const cutters2D = [makeInlineProfileAt(c1, shDia, shSlot, axis), makeInlineProfileAt(c2, shDia, shSlot, axis2)].filter(
    Boolean
  ) as any[];
  if (!cutters2D.length) return base;

  // Optional washer pads: add local thickness BELOW the baseplate bottom face (do not
  // protrude above the top face at z=0). The screw-hole cutters below intentionally
  // cut only through the original baseplate thickness, not through the added washer
  // solids, so the washer additions remain solid.
  let solid = base as any;
  let shFil1Deferred3D: any[] = [];
  const washerDepth = Math.max(0.1, Math.abs(baseThk));
  if (washer2D.length && washerDepth > 1e-6) {
    const baseBottomZ = Math.min(0, -baseThk);
    const washerPlane = makePlane("XY", [0, 0, baseBottomZ]);
    const washer3D = washer2D.map((w2d) => (w2d as any).sketchOnPlane(washerPlane).extrude(washerDepth));
    const washerSolid = fuseMany(washer3D);
    if (washerSolid && typeof solid.fuse === "function") {
      try {
        solid = solid.fuse(washerSolid);

        // SH_FIL_1: build 2D seam "infill" patches between the base outer loop and
        // each washer outer loop, fillet the two seam corners in 2D, then extrude.
        if (shFil1Enabled && shFil1Radius > 1e-6) {
          try {
            const infill2D: any[] = [];
            let dbgHits = 0;
            let dbgPatches = 0;
            let dbgRejectedWrongSide = 0;
            let dbgRejectedArea = 0;
            const armLen = clamp(shFil1Radius * 2.8, 2.0, 40);

            // Walk along the closed loop from an intersection hit by arc length, so on a
            // densely-sampled spline we can reach points farther away than the tiny local segment.
            const pointAlongHitLoop = (loop: Pt[], h: SegHit2D, dirSign: -1 | 1, len: number): Pt | null => {
              const n = loop.length;
              if (n < 2) return null;
              let remaining = Math.max(0, len);

              if (dirSign > 0) {
                let segIdx = h.segIdx;
                let cur = { x: h.pt.x, y: h.pt.y };
                let segEnd = loop[(segIdx + 1) % n];
                for (let guard = 0; guard < n + 2; guard++) {
                  const segVec = sub(segEnd, cur);
                  const segLen = vlen(segVec);
                  if (segLen > 1e-9) {
                    if (remaining <= segLen) {
                      const u = remaining / segLen;
                      return lerpPt(cur, segEnd, u);
                    }
                    remaining -= segLen;
                  }
                  segIdx = (segIdx + 1) % n;
                  cur = { x: segEnd.x, y: segEnd.y };
                  segEnd = loop[(segIdx + 1) % n];
                }
                return cur;
              }

              let segIdx = h.segIdx;
              let cur = { x: h.pt.x, y: h.pt.y };
              let segStart = loop[segIdx];
              for (let guard = 0; guard < n + 2; guard++) {
                const segVec = sub(segStart, cur);
                const segLen = vlen(segVec);
                if (segLen > 1e-9) {
                  if (remaining <= segLen) {
                    const u = remaining / segLen;
                    return lerpPt(cur, segStart, u);
                  }
                  remaining -= segLen;
                }
                segIdx = (segIdx - 1 + n) % n;
                cur = { x: segStart.x, y: segStart.y };
                segStart = loop[segIdx];
              }
              return cur;
            };

            for (const wLoop of washerOuterLoops2D) {
              const rawHits = closedLoopIntersectionsDetailed(baseLoop, wLoop);
              const hits = rawHits.filter(
                (h, idx) => !rawHits.slice(0, idx).some((q) => Math.hypot(q.pt.x - h.pt.x, q.pt.y - h.pt.y) <= 0.4)
              );
              dbgHits += hits.length;
              for (const h of hits) {
                type Cand = { basePt: Pt; washPt: Pt; score: number; areaAbs: number };
                const cands: Cand[] = [];

                for (const bDir of [-1, 1] as const) {
                  const basePt = pointAlongHitLoop(baseLoop, h.a, bDir, armLen);
                  if (!basePt) continue;
                  for (const wDir of [-1, 1] as const) {
                    const washPt = pointAlongHitLoop(wLoop, h.b, wDir, armLen);
                    if (!washPt) continue;

                    const triMid = {
                      x: (h.pt.x + basePt.x + washPt.x) / 3,
                      y: (h.pt.y + basePt.y + washPt.y) / 3,
                    };
                    const outsideBase = !pointInClosedLoop2D(baseLoop, triMid);
                    const outsideWasher = !pointInClosedLoop2D(wLoop, triMid);
                    const closureMid = { x: 0.5 * (basePt.x + washPt.x), y: 0.5 * (basePt.y + washPt.y) };
                    const closureOutsideBase = !pointInClosedLoop2D(baseLoop, closureMid);
                    const closureOutsideWasher = !pointInClosedLoop2D(wLoop, closureMid);
                    const closureSeamDist = dist(h.pt, closureMid);
                    const areaAbs = Math.abs(cross2(sub(basePt, h.pt), sub(washPt, h.pt))) * 0.5;
                    if (areaAbs <= 1e-4) continue;

                    // Primary rule: the closure edge (basePt->washPt) must sit on the outside
                    // of both loops (the "blue" side). This directly targets the side you drew.
                    let score = 0;
                    if (closureOutsideBase) score += 10000;
                    if (closureOutsideWasher) score += 10000;
                    if (closureOutsideBase && closureOutsideWasher) score += 20000;
                    // Choose the "blue side": the closure chord should be farther away
                    // from the seam, not the compact inner closure.
                    score += 8000 * closureSeamDist;

                    // Secondary heuristic: wedge interior also outside both solids.
                    if (outsideBase) score += 1000;
                    if (outsideWasher) score += 1000;
                    if (outsideBase && outsideWasher) score += 5000;

                    // Prefer a reasonably sized patch (not tiny shards, not giant slivers).
                    score += Math.min(areaAbs, armLen * armLen * 0.25) * 0.5;
                    score -= 0.005 * (dist(h.pt, basePt) + dist(h.pt, washPt));

                    cands.push({ basePt, washPt, score, areaAbs });
                  }
                }

                if (!cands.length) continue;
                cands.sort((a, b) => b.score - a.score);
                const best = cands[0];

                // Local clamp: tiny wedge corners cannot support the full UI radius.
                const lA = dist(h.pt, best.basePt);
                const lB = dist(h.pt, best.washPt);
                const localR = Math.min(shFil1Radius, Math.max(0, 0.42 * Math.min(lA, lB)));
                if (localR <= 0.05) continue;

                // Then make a NEW profile from only the good side (red seam fillet path),
                // and close it with a separate cap path so we don't redraw/keep the wrong
                // direct closure edge on top of itself.
                const nearestIdx = (loop: Pt[], p: Pt) => {
                  let bestI = -1;
                  let bestD = Infinity;
                  for (let i = 0; i < loop.length; i++) {
                    const d = dist(loop[i], p);
                    if (d < bestD) {
                      bestD = d;
                      bestI = i;
                    }
                  }
                  return bestI;
                };
                const pathBetweenIdx = (loop: Pt[], i0: number, i1: number): Pt[] => {
                  const n = loop.length;
                  const out: Pt[] = [];
                  let i = i0;
                  for (let guard = 0; guard < n + 1; guard++) {
                    out.push(loop[i]);
                    if (i === i1) break;
                    i = (i + 1) % n;
                  }
                  return dedupePts(out, 1e-6);
                };
                const minDistToSeam = (path: Pt[]) => Math.min(...path.map((p) => dist(p, h.pt)));
                const pathArcScore = (path: Pt[]) => {
                  if (path.length < 2) return -Infinity;
                  let plen = 0;
                  for (let i = 1; i < path.length; i++) plen += dist(path[i - 1], path[i]);
                  const chord = dist(path[0], path[path.length - 1]);
                  const bow = Math.max(0, plen - chord); // fillet arc path should have non-zero bow
                  const seamProx = minDistToSeam(path);
                  // Prefer visible curvature first, then points near seam as a tie-breaker.
                  return bow * 100 - seamProx;
                };
                const pathLen = (path: Pt[]) => {
                  let L = 0;
                  for (let i = 1; i < path.length; i++) L += dist(path[i - 1], path[i]);
                  return L;
                };
                const extractRedPathFromWedge = (seed: Pt[]) => {
                  let wedgeLoop = dedupePts(seed, 1e-6);
                  if (wedgeLoop.length < 3) return null;
                  wedgeLoop = filletClosedLoopCorner(wedgeLoop, 0, localR, 12);
                  wedgeLoop = pruneLoopTinyKinks(wedgeLoop, 0.05, 0.03);
                  if (wedgeLoop.length < 3) return null;

                  const iBase = nearestIdx(wedgeLoop, best.basePt);
                  const iWash = nearestIdx(wedgeLoop, best.washPt);
                  if (iBase < 0 || iWash < 0 || iBase === iWash) return null;

                  const pA = pathBetweenIdx(wedgeLoop, iBase, iWash);
                  const pB = pathBetweenIdx(wedgeLoop, iWash, iBase).reverse();
                  const sA = pathArcScore(pA);
                  const sB = pathArcScore(pB);
                  let rp = sA >= sB ? pA : pB;
                  if (rp.length < 2) return null;
                  if (dist(rp[0], best.basePt) > dist(rp[rp.length - 1], best.basePt)) rp = rp.slice().reverse();

                  const plen = pathLen(rp);
                  const chord = dist(rp[0], rp[rp.length - 1]);
                  const bow = Math.max(0, plen - chord);
                  const seamProx = minDistToSeam(rp);
                  const mid = rp[Math.floor(rp.length / 2)];
                  const midSeam = dist(mid, h.pt);
                  const maxSeam = Math.max(...rp.map((p) => dist(p, h.pt)));
                  // Prefer a curved path that stays local around the seam (purple path),
                  // and penalize the long "front edge" branch.
                  const pickScore = bow * 120 - plen * 8 - midSeam * 6 - seamProx * 4;
                  return { rp, pickScore, sA, sB, nA: pA.length, nB: pB.length, bow, plen, midSeam, maxSeam };
                };

                const candNorm = extractRedPathFromWedge([h.pt, best.basePt, best.washPt]);
                const candFlip = extractRedPathFromWedge([h.pt, best.washPt, best.basePt]);
                if (!candNorm && !candFlip) continue;
                let useFlip = !!candFlip && !candNorm;
                if (candNorm && candFlip) {
                  const normCurved = candNorm.bow > 0.25;
                  const flipCurved = candFlip.bow > 0.25;
                  if (normCurved && flipCurved) {
                    // Strong rule: prefer the curved path that remains local to the seam.
                    // This directly targets the "purple line" instead of the front radius.
                    const normLocal = candNorm.midSeam + 0.35 * candNorm.maxSeam + 0.05 * candNorm.plen;
                    const flipLocal = candFlip.midSeam + 0.35 * candFlip.maxSeam + 0.05 * candFlip.plen;
                    useFlip = flipLocal < normLocal;
                  } else if (flipCurved !== normCurved) {
                    useFlip = flipCurved;
                  } else {
                    useFlip = candFlip.pickScore > candNorm.pickScore;
                  }
                }
                let redPath = (useFlip ? candFlip : candNorm)!.rp;
                postModelDebugStatus(
                  `[sh_fil_1] redPath seam=(${h.pt.x.toFixed(1)},${h.pt.y.toFixed(1)}) ` +
                    `norm=${candNorm ? `${candNorm.pickScore.toFixed(1)}/b${candNorm.bow.toFixed(2)}/m${candNorm.midSeam.toFixed(1)}` : "x"} ` +
                    `flip=${candFlip ? `${candFlip.pickScore.toFixed(1)}/b${candFlip.bow.toFixed(2)}/m${candFlip.midSeam.toFixed(1)}` : "x"} ` +
                    `use=${useFlip ? "flip" : "norm"}`
                );

                // Build a closed ribbon by offsetting the good seam-fillet path and capping both ends.
                const pBase = redPath[0];
                const pWash = redPath[redPath.length - 1];
                if (redPath.length < 2) continue;

                const scoreOutside = (p: Pt) => {
                  let s = 0;
                  if (!pointInClosedLoop2D(baseLoop, p)) s += 10;
                  if (!pointInClosedLoop2D(wLoop, p)) s += 10;
                  s += 0.02 * dist(p, h.pt);
                  return s;
                };
                const seamChordMid = { x: 0.5 * (pBase.x + pWash.x), y: 0.5 * (pBase.y + pWash.y) };
                const seamChordDir = vnorm(sub(pWash, pBase));
                const seamChordN = { x: -seamChordDir.y, y: seamChordDir.x };
                const sideOfChord = (p: Pt) => dot2(sub(p, seamChordMid), seamChordN);
                const seamSideSign = Math.sign(sideOfChord(h.pt)) || 1;
                // Flip only the back pair (high-Y seams) while leaving the front pair unchanged.
                // This is a temporary targeted correction while we tune the auto-chooser.
                const isBackPair = h.pt.y > 90;
                const desiredSideSign = isBackPair ? -seamSideSign : seamSideSign;
                const sideMatchesDesired = (p: Pt) => (Math.sign(sideOfChord(p)) || 0) === desiredSideSign;

                // Keep the additive ribbon much thinner than the seam fillet radius.
                // If this scales too aggressively with radius, the patch can flip sides.
                const offDist = clamp(localR * 0.35, 0.25, Math.min(armLen * 0.35, 2.0));
                // Use a stable ribbon offset direction from the seam chord normal.
                // The local-path-normal approach flips on some short/faceted front corners.
                const buildOffsetPath = (sign: 1 | -1) => {
                  const n = sign > 0 ? seamChordN : { x: -seamChordN.x, y: -seamChordN.y };
                  return redPath.map((p) => ({ x: p.x + n.x * offDist, y: p.y + n.y * offDist }));
                };
                const offA = dedupePts(buildOffsetPath(1), 1e-6);
                const offB = dedupePts(buildOffsetPath(-1), 1e-6);
                if (offA.length < 2 || offB.length < 2) continue;

                const offsetMetrics = (off: Pt[]) => {
                  const mid = off[Math.floor(off.length / 2)];
                  const startCapMid = lerpPt(redPath[0], off[0], 0.5);
                  const endCapMid = lerpPt(redPath[redPath.length - 1], off[off.length - 1], 0.5);
                  const centroid = off.reduce(
                    (acc, p) => ({ x: acc.x + p.x / off.length, y: acc.y + p.y / off.length }),
                    { x: 0, y: 0 }
                  );
                  // Positive means "more on desired side of the seam chord"
                  const sideMetric =
                    desiredSideSign *
                    (0.6 * sideOfChord(mid) + 0.4 * sideOfChord(centroid));
                  let s = 0;
                  s += scoreOutside(mid) + scoreOutside(startCapMid) + scoreOutside(endCapMid);
                  s += 0.5 * scoreOutside(centroid);
                  if (sideMatchesDesired(mid)) s += 300;
                  else s -= 600;
                  if (sideMatchesDesired(centroid)) s += 150;
                  else s -= 300;

                  // Candidate penalty using the same side checks as the later patch guard.
                  let tmpPatch = dedupePts([...redPath, ...off.slice().reverse()], 1e-6);
                  tmpPatch = pruneLoopTinyKinks(tmpPatch, 0.05, 0.03);
                  const tmpArea = Math.abs(signedArea2(tmpPatch));
                  const areaBad = !Number.isFinite(tmpArea) || tmpArea < 0.01 || tmpArea > armLen * armLen * 4;
                  const closureSamples = [
                    lerpPt(redPath[0], off[0], 0.2),
                    startCapMid,
                    lerpPt(redPath[0], off[0], 0.8),
                    lerpPt(redPath[redPath.length - 1], off[off.length - 1], 0.2),
                    endCapMid,
                    lerpPt(redPath[redPath.length - 1], off[off.length - 1], 0.8),
                  ];
                  // Also score the offset edge itself; if this lies against/inside the baseplate
                  // side, the visible seam edge becomes the offset edge (looks shifted by ribbon thickness).
                  const offEdgeSamples = [
                    off[Math.max(0, Math.floor((off.length - 1) * 0.2))],
                    off[Math.max(0, Math.floor((off.length - 1) * 0.5))],
                    off[Math.max(0, Math.floor((off.length - 1) * 0.8))],
                  ];
                  const insideCount = closureSamples.reduce(
                    (acc, p) => acc + (pointInClosedLoop2D(baseLoop, p) || pointInClosedLoop2D(wLoop, p) ? 1 : 0),
                    0
                  );
                  const offEdgeInsideCount = offEdgeSamples.reduce(
                    (acc, p) => acc + (pointInClosedLoop2D(baseLoop, p) || pointInClosedLoop2D(wLoop, p) ? 1 : 0),
                    0
                  );
                  const centroidInside =
                    (pointInClosedLoop2D(baseLoop, centroid) ? 1 : 0) + (pointInClosedLoop2D(wLoop, centroid) ? 1 : 0);
                  const capMidInside =
                    (pointInClosedLoop2D(baseLoop, startCapMid) ? 1 : 0) +
                    (pointInClosedLoop2D(wLoop, startCapMid) ? 1 : 0) +
                    (pointInClosedLoop2D(baseLoop, endCapMid) ? 1 : 0) +
                    (pointInClosedLoop2D(wLoop, endCapMid) ? 1 : 0);
                  const penalty =
                    (areaBad ? 1000 : 0) +
                    insideCount * 100 +
                    offEdgeInsideCount * 180 +
                    capMidInside * 60 +
                    centroidInside * 40;

                  return { s, sideMetric, mid, centroid, penalty, offEdgeInsideCount };
                };
                const mA = offsetMetrics(offA);
                const mB = offsetMetrics(offB);
                let offPath = offA;
                // Optional hard override for debugging side selection.
                if (DEBUG_FORCE_SH_FIL_1_OFFSET_SIDE === 1) {
                  offPath = offA;
                } else if (DEBUG_FORCE_SH_FIL_1_OFFSET_SIDE === -1) {
                  offPath = offB;
                } else if (mA.penalty !== mB.penalty) {
                  // Choose the side that best passes the actual patch-side checks first.
                  offPath = mA.penalty <= mB.penalty ? offA : offB;
                } else if (Math.abs(mA.sideMetric - mB.sideMetric) > 1e-6) {
                  offPath = mA.sideMetric >= mB.sideMetric ? offA : offB;
                } else {
                  offPath = mA.s >= mB.s ? offA : offB;
                }

                postModelDebugStatus(
                  `[sh_fil_1] off pts seam=(${h.pt.x.toFixed(1)},${h.pt.y.toFixed(1)}) ` +
                    `force=${DEBUG_FORCE_SH_FIL_1_OFFSET_SIDE} ` +
                    `pa=${mA.penalty}(io${mA.offEdgeInsideCount}) pb=${mB.penalty}(io${mB.offEdgeInsideCount}) ` +
                    `sa=${mA.sideMetric.toFixed(2)} sb=${mB.sideMetric.toFixed(2)} ` +
                    `o0=(${offPath[0].x.toFixed(1)},${offPath[0].y.toFixed(1)}) ` +
                    `om=(${offPath[Math.floor(offPath.length / 2)].x.toFixed(1)},${offPath[Math.floor(offPath.length / 2)].y.toFixed(1)}) ` +
                    `oN=(${offPath[offPath.length - 1].x.toFixed(1)},${offPath[offPath.length - 1].y.toFixed(1)})`
                );

                let patchLoop: Pt[] = [...redPath, ...offPath.slice().reverse()];
                patchLoop = dedupePts(patchLoop, 1e-6);
                // Preserve the seam fillet curve points on the final ribbon patch.
                // Aggressive pruning here can flatten the front two patches into straight edges.
                // patchLoop = pruneLoopTinyKinks(patchLoop, 0.05, 0.03);
                if (patchLoop.length < 3) continue;

                // Extra guard: skip degenerate/oversized patches that can poison the fuse.
                const patchArea = Math.abs(signedArea2(patchLoop));
                if (!Number.isFinite(patchArea) || patchArea < 0.01 || patchArea > armLen * armLen * 4) {
                  dbgRejectedArea++;
                  if (!(DEBUG_SHOW_SH_FIL_1_INFILL_SEPARATE && DEBUG_SKIP_SH_FIL_1_INFILL_FUSE)) {
                    continue;
                  }
                  postModelDebugStatus(
                    `[sh_fil_1] debug keep patch (area) seam=(${h.pt.x.toFixed(1)},${h.pt.y.toFixed(1)}) a=${patchArea.toFixed(2)}`
                  );
                }

                // Validate only the ribbon end caps / centroid; the red seam path lies on the boundary.
                const startCapMid = lerpPt(redPath[0], offPath[0], 0.5);
                const endCapMid = lerpPt(redPath[redPath.length - 1], offPath[offPath.length - 1], 0.5);
                const patchCentroid = patchLoop.reduce(
                  (acc, p) => ({ x: acc.x + p.x / patchLoop.length, y: acc.y + p.y / patchLoop.length }),
                  { x: 0, y: 0 }
                );
                const closureSamples = [
                  lerpPt(redPath[0], offPath[0], 0.2),
                  startCapMid,
                  lerpPt(redPath[0], offPath[0], 0.8),
                  lerpPt(redPath[redPath.length - 1], offPath[offPath.length - 1], 0.2),
                  endCapMid,
                  lerpPt(redPath[redPath.length - 1], offPath[offPath.length - 1], 0.8),
                ];
                const closureCrossesInterior = closureSamples.some(
                  (s) => pointInClosedLoop2D(baseLoop, s) || pointInClosedLoop2D(wLoop, s)
                );
                const wrongSide =
                  closureCrossesInterior ||
                  pointInClosedLoop2D(baseLoop, startCapMid) ||
                  pointInClosedLoop2D(wLoop, startCapMid) ||
                  pointInClosedLoop2D(baseLoop, endCapMid) ||
                  pointInClosedLoop2D(wLoop, endCapMid) ||
                  pointInClosedLoop2D(baseLoop, patchCentroid) ||
                  pointInClosedLoop2D(wLoop, patchCentroid);
                if (wrongSide) {
                  dbgRejectedWrongSide++;
                  if (!(DEBUG_SHOW_SH_FIL_1_INFILL_SEPARATE && DEBUG_SKIP_SH_FIL_1_INFILL_FUSE)) {
                    continue;
                  }
                  postModelDebugStatus(
                    `[sh_fil_1] debug keep patch (side) seam=(${h.pt.x.toFixed(1)},${h.pt.y.toFixed(1)})`
                  );
                }

                infill2D.push(polyToDraw(patchLoop));
                dbgPatches++;
              }
            }

            postModelDebugStatus(
              `[sh_fil_1] 2d infill r=${shFil1Radius.toFixed(2)} hits=${dbgHits} patches=${dbgPatches} ` +
                `rejArea=${dbgRejectedArea} rejSide=${dbgRejectedWrongSide}`
            );

            if (infill2D.length) {
              const infill3D = infill2D.map((d2) => (d2 as any).sketchOnPlane(washerPlane).extrude(washerDepth));
              if (typeof solid.fuse === "function") {
                if (DEBUG_SKIP_SH_FIL_1_INFILL_FUSE) {
                  postModelDebugStatus(`[sh_fil_1] debug: skipping infill fuse for isolation`);
                } else {
                  // Defer SH_FIL_1 patch fusion until after the screw-hole cut(cutter) step.
                  // This avoids the "bad fuse -> bad cut" cascade if the intermediate solid
                  // becomes fragile before the normal through-cut boolean runs.
                  shFil1Deferred3D.push(...infill3D);
                  postModelDebugStatus(`[sh_fil_1] deferred patch fuse count=${infill3D.length}`);
                }
              }

              if (DEBUG_SHOW_SH_FIL_1_INFILL_SEPARATE) {
                const infillSolidDebug = fuseMany(infill3D);
                if (infillSolidDebug && typeof (infillSolidDebug as any).clone === "function" && typeof solid.fuse === "function") {
                  try {
                    const zLift = Math.abs(baseThk) + washerDepth + 8;
                    const infillDebug = (infillSolidDebug as any).clone().translateZ(zLift);
                    solid = solid.fuse(infillDebug);
                    postModelDebugStatus(`[sh_fil_1] debug infill copy shown at +Z ${zLift.toFixed(1)}`);
                  } catch {
                    postModelDebugStatus(`[sh_fil_1] debug infill copy fuse failed`);
                  }
                }
              }
            }
          } catch (e) {
            postModelDebugStatus(`[sh_fil_1] 2d infill failed: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      } catch {
        // Keep baseplate build resilient if the washer fuse fails for edge cases.
      }
    }
  }

  const z0 = Math.min(0, -baseThk);
  const z1 = Math.max(0, -baseThk);
  const depth = Math.max(0.1, z1 - z0 + 2);
  const plane = makePlane("XY", [0, 0, z0 - 1]);

  const cutters3D = cutters2D.map((c2d) => (c2d as any).sketchOnPlane(plane).extrude(depth));
  const cutter = fuseMany(cutters3D);
  if (!cutter || typeof solid.cut !== "function") {
    let outNoCut = solid as any;
    if (shFil1Deferred3D.length && typeof outNoCut.fuse === "function") {
      let fusedCount = 0;
      let failedCount = 0;
      for (let i = 0; i < shFil1Deferred3D.length; i++) {
        try {
          outNoCut = outNoCut.fuse(shFil1Deferred3D[i]);
          fusedCount++;
        } catch (e) {
          failedCount++;
          postModelDebugStatus(`[sh_fil_1] deferred patch fuse failed i=${i}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      postModelDebugStatus(`[sh_fil_1] deferred patch fuse summary fused=${fusedCount} failed=${failedCount}`);
    }
    return outNoCut as Shape3D;
  }

  if (DEBUG_SKIP_BASE_CUT_WHEN_SH_FIL_1 && shFil1Enabled && shFil1Radius > 1e-6) {
    postModelDebugStatus(`[sh_fil_1] debug: skipping base cut(cutter) for isolation`);
    return solid as Shape3D;
  }

  let outSolid: any = (solid.cut(cutter) as Shape3D) ?? (solid as Shape3D);
  if (shFil1Deferred3D.length && typeof outSolid.fuse === "function") {
    let fusedCount = 0;
    let failedCount = 0;
    for (let i = 0; i < shFil1Deferred3D.length; i++) {
      try {
        outSolid = outSolid.fuse(shFil1Deferred3D[i]);
        fusedCount++;
      } catch (e) {
        failedCount++;
        postModelDebugStatus(`[sh_fil_1] deferred patch fuse failed i=${i}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    postModelDebugStatus(`[sh_fil_1] deferred patch fuse summary fused=${fusedCount} failed=${failedCount}`);
  }

  return outSolid as Shape3D;
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
      const u = i / (refineSteps - 1);
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

  const sx = 1;
  const sxFirst = -sx;
  const cdLen = arcLenBetween(spinePts, idxC, idxEnd);
  const sectionCount = midCD + 2;

  // Model-side safety clamp based on the actual sampled C profile shape (more reliable
  // than using toe_c_endz alone). This prevents asking the cap-cut/loft for heights that
  // exceed the available profile C geometry.
  try {
    const { outerPts } = toeBezierOffsetProfileFixedPts(sxFirst * endX_C, endZ_C, p1s_C, p3s_C, enda_C, thickness);
    const cTopZ = Math.max(...outerPts.map((p: Pt) => p.y));
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
