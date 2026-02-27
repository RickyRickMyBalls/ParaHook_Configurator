// FILE: src/main.ts
import "./style.css";
import { Viewer } from "./viewer";
import { applyGizmoLayout, computeGizmoLayout } from "./ui/gizmoLayout";

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
  freezeBaseRefit?: boolean;
  freezeToeRefit?: boolean;
  freezeHeelRefit?: boolean;
  forceFullRefit?: boolean;
  forceHeelRefit?: boolean;
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

type SoundCloudWidget = {
  bind(eventName: string, listener: (payload?: any) => void): void;
  play(): void;
  pause(): void;
  setVolume(volume: number): void;
  seekTo(positionMs: number): void;
  getDuration(cb: (durationMs: number) => void): void;
};

type SoundCloudWidgetFactory = {
  (iframe: HTMLIFrameElement): SoundCloudWidget;
  Events: Record<string, string>;
};

type SoundCloudGlobal = {
  Widget: SoundCloudWidgetFactory;
};

declare global {
  interface Window {
    SC?: SoundCloudGlobal;
  }
}

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
const bootLoadingOverlayEl = document.getElementById("bootLoadingOverlay") as HTMLDivElement | null;
let bootLoadingActive = !!bootLoadingOverlayEl;
const mobileLayoutMediaQuery = window.matchMedia("(max-width: 900px), (pointer: coarse)");
let isMobileLayoutActive = false;
let onLayoutModeChanged: ((isMobile: boolean) => void) | null = null;

function updateAppViewportHeightVar() {
  const next = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-vh", `${Math.round(next)}px`);
}

function applyLayoutModeFromMediaQuery() {
  isMobileLayoutActive = mobileLayoutMediaQuery.matches;
  document.body.classList.toggle("mobile-layout", isMobileLayoutActive);
  onLayoutModeChanged?.(isMobileLayoutActive);
}

updateAppViewportHeightVar();
applyLayoutModeFromMediaQuery();

window.addEventListener("resize", updateAppViewportHeightVar);
window.visualViewport?.addEventListener("resize", updateAppViewportHeightVar);
if ("addEventListener" in mobileLayoutMediaQuery) {
  mobileLayoutMediaQuery.addEventListener("change", applyLayoutModeFromMediaQuery);
}
const gizmoViewportResizeHandleEl = document.getElementById("gizmoViewportResizeHandle") as HTMLDivElement | null;
const gizmoToolbarResizeHandleEl = document.getElementById("gizmoToolbarResizeHandle") as HTMLDivElement | null;
const gizmoToggleBtnEl = document.getElementById("gizmoToggleBtn") as HTMLButtonElement | null;
const gizmoGizmoPanelEl = document.getElementById("gizmoGizmoPanel") as HTMLDivElement | null;
const gizmoLineOpacityRangeEl = document.getElementById("gizmoLineOpacityRange") as HTMLInputElement | null;
const gizmoSphereSizeRangeEl = document.getElementById("gizmoSphereSizeRange") as HTMLInputElement | null;
const gizmoTextSizeRangeEl = document.getElementById("gizmoTextSizeRange") as HTMLInputElement | null;
const gizmoCardinalUpBadgeEl = document.getElementById("gizmoCardinalUpBadge") as HTMLButtonElement | null;
const gizmoFpsBadgeEl = document.getElementById("gizmoFpsBadge") as HTMLDivElement | null;
const gizmoRollCwBtnEl = document.getElementById("gizmoRollCwBtn") as HTMLButtonElement | null;
const gizmoRollCcwBtnEl = document.getElementById("gizmoRollCcwBtn") as HTMLButtonElement | null;
const gizmoModeCurrentBtnEl = document.getElementById("gizmoModeCurrentBtn") as HTMLButtonElement | null;
const gizmoModeOrbitBtnEl = document.getElementById("gizmoModeOrbitBtn") as HTMLButtonElement | null;
const gizmoModeTrackballBtnEl = document.getElementById("gizmoModeTrackballBtn") as HTMLButtonElement | null;
const gizmoModeArcballBtnEl = document.getElementById("gizmoModeArcballBtn") as HTMLButtonElement | null;
const gizmoGravityLabelEl = document.getElementById("gizmoGravityLabel") as HTMLDivElement | null;
const gizmoGravityRangeEl = document.getElementById("gizmoGravityRange") as HTMLInputElement | null;
const gizmoDecayLabelEl = document.getElementById("gizmoDecayLabel") as HTMLDivElement | null;
const gizmoDecayRangeEl = document.getElementById("gizmoDecayRange") as HTMLInputElement | null;
const gizmoSpinToggleBtnEl = document.getElementById("gizmoSpinToggleBtn") as HTMLButtonElement | null;
const gizmoSpinSpeedLabelEl = document.getElementById("gizmoSpinSpeedLabel") as HTMLDivElement | null;
const gizmoSpinSpeedRangeEl = document.getElementById("gizmoSpinSpeedRange") as HTMLInputElement | null;
const gizmoZoomStopsInertiaBtnEl = document.getElementById("gizmoZoomStopsInertiaBtn") as HTMLButtonElement | null;
const gizmoViewBtnEl = document.getElementById("gizmoViewBtn") as HTMLButtonElement | null;
const gizmoControlsBtnEl = document.getElementById("gizmoControlsBtn") as HTMLButtonElement | null;
const gizmoControlsPanelEl = document.getElementById("gizmoControlsPanel") as HTMLDivElement | null;
const gizmoViewPanelEl = document.getElementById("gizmoViewPanel") as HTMLDivElement | null;
const gizmoViewResetBtnEl = document.getElementById("gizmoViewResetBtn") as HTMLButtonElement | null;
const gizmoViewPerspectiveBtnEl = document.getElementById("gizmoViewPerspectiveBtn") as HTMLButtonElement | null;
const gizmoViewOrthographicBtnEl = document.getElementById("gizmoViewOrthographicBtn") as HTMLButtonElement | null;
const gizmoViewStyleShadedBtnEl = document.getElementById("gizmoViewStyleShadedBtn") as HTMLButtonElement | null;
const gizmoViewStyleEdgesBtnEl = document.getElementById("gizmoViewStyleEdgesBtn") as HTMLButtonElement | null;
const gizmoViewStyleXrayBtnEl = document.getElementById("gizmoViewStyleXrayBtn") as HTMLButtonElement | null;
const gizmoViewStyleClayBtnEl = document.getElementById("gizmoViewStyleClayBtn") as HTMLButtonElement | null;
const gizmoViewZoomRangeEl = document.getElementById("gizmoViewZoomRange") as HTMLInputElement | null;
const gizmoViewBgDarkBlueBtnEl = document.getElementById("gizmoViewBgDarkBlueBtn") as HTMLButtonElement | null;
const gizmoViewBgBlackBtnEl = document.getElementById("gizmoViewBgBlackBtn") as HTMLButtonElement | null;
const gizmoGridSectionEl = document.getElementById("gizmoGridSection") as HTMLDetailsElement | null;
const gizmoGridControlsEl = document.getElementById("gizmoGridControls") as HTMLDivElement | null;
const gizmoGridSizeRangeEl = document.getElementById("gizmoGridSizeRange") as HTMLInputElement | null;
const gizmoGridDivisionsRangeEl = document.getElementById("gizmoGridDivisionsRange") as HTMLInputElement | null;
const gizmoGridMajorStepRangeEl = document.getElementById("gizmoGridMajorStepRange") as HTMLInputElement | null;
const gizmoGridOpacityRangeEl = document.getElementById("gizmoGridOpacityRange") as HTMLInputElement | null;
const gizmoGridContrastBtnEl = document.getElementById("gizmoGridContrastBtn") as HTMLButtonElement | null;
const gizmoViewFovRangeEl = document.getElementById("gizmoViewFovRange") as HTMLInputElement | null;
const gizmoViewTopBtnEl = document.getElementById("gizmoViewTopBtn") as HTMLButtonElement | null;
const gizmoViewFrontBtnEl = document.getElementById("gizmoViewFrontBtn") as HTMLButtonElement | null;
const gizmoViewStarsBtnEl = document.getElementById("gizmoViewStarsBtn") as HTMLButtonElement | null;
const gizmoViewNebulaBtnEl = document.getElementById("gizmoViewNebulaBtn") as HTMLButtonElement | null;
const gizmoViewSwarmBtnEl = document.getElementById("gizmoViewSwarmBtn") as HTMLButtonElement | null;
const gizmoStarsControlsEl = document.getElementById("gizmoStarsControls") as HTMLDivElement | null;
const gizmoStarsCountRangeEl = document.getElementById("gizmoStarsCountRange") as HTMLInputElement | null;
const gizmoStarsMotionRangeEl = document.getElementById("gizmoStarsMotionRange") as HTMLInputElement | null;
const gizmoStarsGlowRangeEl = document.getElementById("gizmoStarsGlowRange") as HTMLInputElement | null;
const gizmoStarsWireRangeEl = document.getElementById("gizmoStarsWireRange") as HTMLInputElement | null;
const gizmoStarsLikelihoodRangeEl = document.getElementById("gizmoStarsLikelihoodRange") as HTMLInputElement | null;
const gizmoStarsLineDistanceRangeEl = document.getElementById("gizmoStarsLineDistanceRange") as HTMLInputElement | null;
const gizmoStarsSizeRangeEl = document.getElementById("gizmoStarsSizeRange") as HTMLInputElement | null;
const gizmoStarsDistanceRangeEl = document.getElementById("gizmoStarsDistanceRange") as HTMLInputElement | null;
const gizmoNebulaControlsEl = document.getElementById("gizmoNebulaControls") as HTMLDivElement | null;
const gizmoNebulaDensityRangeEl = document.getElementById("gizmoNebulaDensityRange") as HTMLInputElement | null;
const gizmoNebulaScaleRangeEl = document.getElementById("gizmoNebulaScaleRange") as HTMLInputElement | null;
const gizmoNebulaTurbulenceRangeEl = document.getElementById("gizmoNebulaTurbulenceRange") as HTMLInputElement | null;
const gizmoNebulaDriftRangeEl = document.getElementById("gizmoNebulaDriftRange") as HTMLInputElement | null;
const gizmoNebulaGlowRangeEl = document.getElementById("gizmoNebulaGlowRange") as HTMLInputElement | null;
const gizmoNebulaColorShiftRangeEl = document.getElementById("gizmoNebulaColorShiftRange") as HTMLInputElement | null;
const gizmoSwarmControlsEl = document.getElementById("gizmoSwarmControls") as HTMLDivElement | null;
const gizmoSwarmCountRangeEl = document.getElementById("gizmoSwarmCountRange") as HTMLInputElement | null;
const gizmoSwarmSpeedRangeEl = document.getElementById("gizmoSwarmSpeedRange") as HTMLInputElement | null;
const gizmoSwarmCohesionRangeEl = document.getElementById("gizmoSwarmCohesionRange") as HTMLInputElement | null;
const gizmoSwarmSeparationRangeEl = document.getElementById("gizmoSwarmSeparationRange") as HTMLInputElement | null;
const gizmoSwarmAlignmentRangeEl = document.getElementById("gizmoSwarmAlignmentRange") as HTMLInputElement | null;
const gizmoSwarmJitterRangeEl = document.getElementById("gizmoSwarmJitterRange") as HTMLInputElement | null;
const gizmoSwarmDecayRangeEl = document.getElementById("gizmoSwarmDecayRange") as HTMLInputElement | null;
const gizmoSwarmProgressRangeEl = document.getElementById("gizmoSwarmProgressRange") as HTMLInputElement | null;
const gizmoSwarmExplodeBtnEl = document.getElementById("gizmoSwarmExplodeBtn") as HTMLButtonElement | null;
const gizmoSwarmExplodeStrengthRangeEl = document.getElementById("gizmoSwarmExplodeStrengthRange") as HTMLInputElement | null;
let gizmoViewPanelOpen = false;
let gizmoControlsPanelOpen = false;
let gizmoSettingsPanelOpen = false;
let gizmoToolbarWidthOverride: number | null = null;
let gizmoSwarmProgressDragging = false;
let lastVisualSceneMode: "off" | "stars" | "nebula" | "swarm" = "off";
let visualSceneCameraOverridesSaved: { inertia?: string; decay?: string } | null = null;
let mobileGizmoCollapsed = false;
let mobileGizmoFullSize = viewer.getAxisGizmoViewportSize?.() ?? 300;

function getMobileGizmoCompactSize() {
  const full = Math.max(72, Math.round(mobileGizmoFullSize || viewer.getAxisGizmoViewportSize?.() || 300));
  return Math.max(72, Math.round(full * 0.5));
}

function setMobileGizmoCollapsed(collapsed: boolean) {
  mobileGizmoCollapsed = !!collapsed;
  document.body.classList.toggle("mobile-gizmo-collapsed", isMobileLayoutActive && mobileGizmoCollapsed);
  if (!isMobileLayoutActive) {
    viewer.setAxisGizmoEnabled?.(true);
    return;
  }
  if (mobileGizmoCollapsed) {
    gizmoViewPanelOpen = false;
    gizmoControlsPanelOpen = false;
    gizmoSettingsPanelOpen = false;
    viewer.setAxisGizmoViewportSize(getMobileGizmoCompactSize());
    viewer.setAxisGizmoEnabled?.(false);
  } else {
    viewer.setAxisGizmoViewportSize(Math.max(72, Math.round(mobileGizmoFullSize)));
    viewer.setAxisGizmoEnabled?.(true);
  }
  positionGizmoViewportResizeHandle();
}

function setRangeValueAndApply(el: HTMLInputElement | null, value: string) {
  if (!el) return;
  if (el.value === value) return;
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function setupGizmoSliderValueRows() {
  const targets = document.querySelectorAll<HTMLInputElement>(
    "#gizmoGizmoPanel input[type='range'], #gizmoViewPanel input[type='range']"
  );
  targets.forEach((input) => {
    if (input.dataset.valueDecorated === "1") return;
    const parent = input.parentElement;
    if (!parent) return;
    const row = document.createElement("div");
    row.className = "gizmoSliderRow";
    const valueEl = document.createElement("div");
    valueEl.className = "gizmoSliderVal";
    const update = () => {
      valueEl.textContent = input.value;
    };
    input.dataset.valueDecorated = "1";
    parent.insertBefore(row, input);
    row.appendChild(input);
    row.appendChild(valueEl);
    input.addEventListener("input", update);
    input.addEventListener("change", update);
    update();
  });
}
setupGizmoSliderValueRows();

function syncGizmoModeButtons() {
  const mode = viewer.getCameraControlMode?.() ?? "current";
  const apply = (btn: HTMLButtonElement | null, key: string) => {
    if (!btn) return;
    const active = mode === key;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  };
  apply(gizmoModeCurrentBtnEl, "current");
  apply(gizmoModeOrbitBtnEl, "orbit");
  apply(gizmoModeTrackballBtnEl, "trackball");
  apply(gizmoModeArcballBtnEl, "arcball");
}

function positionGizmoViewportResizeHandle() {
  if (
    !gizmoViewportResizeHandleEl &&
    !gizmoToolbarResizeHandleEl &&
    !gizmoToggleBtnEl &&
    !gizmoGizmoPanelEl &&
    !gizmoCardinalUpBadgeEl &&
    !gizmoFpsBadgeEl &&
    !gizmoRollCwBtnEl &&
    !gizmoRollCcwBtnEl &&
    !gizmoModeCurrentBtnEl &&
    !gizmoModeOrbitBtnEl &&
    !gizmoModeTrackballBtnEl &&
    !gizmoModeArcballBtnEl &&
    !gizmoGravityLabelEl &&
    !gizmoGravityRangeEl &&
    !gizmoDecayLabelEl &&
    !gizmoDecayRangeEl &&
    !gizmoSpinToggleBtnEl &&
    !gizmoSpinSpeedLabelEl &&
    !gizmoSpinSpeedRangeEl &&
    !gizmoZoomStopsInertiaBtnEl &&
    !gizmoViewBtnEl &&
    !gizmoControlsBtnEl &&
    !gizmoControlsPanelEl &&
    !gizmoViewPanelEl
  ) return;
  const vp = viewer.getAxisGizmoViewportScreenRect?.();
  if (!vp) return;
  const state = {
    gizmoOpen: gizmoSettingsPanelOpen,
    gizmoPanelHeight: gizmoSettingsPanelOpen && gizmoGizmoPanelEl ? gizmoGizmoPanelEl.getBoundingClientRect().height : 0,
    viewOpen: gizmoViewPanelOpen,
    controlsOpen: gizmoControlsPanelOpen,
    spinEnabled: !!viewer.getAutoSpinEnabled?.(),
    viewPanelHeight: gizmoViewPanelOpen && gizmoViewPanelEl ? gizmoViewPanelEl.getBoundingClientRect().height : 0,
    toolbarWidthOverride: gizmoToolbarWidthOverride,
    cardinalUpLabel: viewer.getCardinalUpLabel?.() ?? "+Z",
  };
  const layout = computeGizmoLayout(vp, state);
  applyGizmoLayout(
    {
      gizmoViewportResizeHandleEl,
      gizmoToolbarResizeHandleEl,
      gizmoToggleBtnEl,
      gizmoGizmoPanelEl,
      gizmoCardinalUpBadgeEl,
      gizmoFpsBadgeEl,
      gizmoRollCwBtnEl,
      gizmoRollCcwBtnEl,
      gizmoModeCurrentBtnEl,
      gizmoModeOrbitBtnEl,
      gizmoModeTrackballBtnEl,
      gizmoModeArcballBtnEl,
      gizmoGravityLabelEl,
      gizmoGravityRangeEl,
      gizmoDecayLabelEl,
      gizmoDecayRangeEl,
      gizmoSpinToggleBtnEl,
      gizmoSpinSpeedLabelEl,
      gizmoSpinSpeedRangeEl,
      gizmoZoomStopsInertiaBtnEl,
      gizmoViewBtnEl,
      gizmoControlsBtnEl,
      gizmoControlsPanelEl,
      gizmoViewPanelEl,
    },
    layout,
    state
  );
}

canvas.addEventListener(
  "pointerdown",
  (e) => {
    if (!isMobileLayoutActive || !mobileGizmoCollapsed) return;
    const vp = viewer.getAxisGizmoViewportScreenRect?.();
    if (!vp) return;
    const insideViewport =
      e.clientX >= vp.left &&
      e.clientX <= vp.left + vp.size &&
      e.clientY >= vp.top &&
      e.clientY <= vp.top + vp.size;
    if (!insideViewport) return;
    e.preventDefault();
    e.stopPropagation();
    setMobileGizmoCollapsed(false);
  },
  { capture: true }
);

if (gizmoViewportResizeHandleEl) {
  let drag:
    | {
        startX: number;
        startY: number;
        startSize: number;
      }
    | null = null;

  const endDrag = () => {
    drag = null;
    document.body.style.userSelect = "";
  };

  gizmoViewportResizeHandleEl.addEventListener("pointerdown", (e) => {
    drag = {
      startX: e.clientX,
      startY: e.clientY,
      startSize: viewer.getAxisGizmoViewportSize?.() ?? 132,
    };
    document.body.style.userSelect = "none";
    try { gizmoViewportResizeHandleEl.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
    e.stopPropagation();
  });

  gizmoViewportResizeHandleEl.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = drag.startX - e.clientX; // dragging left increases size
    const dy = e.clientY - drag.startY; // dragging down increases size
    const delta = (dx + dy) * 0.5;
    viewer.setAxisGizmoViewportSize(drag.startSize + delta);
    positionGizmoViewportResizeHandle();
    e.preventDefault();
    e.stopPropagation();
  });

  gizmoViewportResizeHandleEl.addEventListener("pointerup", endDrag);
  gizmoViewportResizeHandleEl.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", positionGizmoViewportResizeHandle);
  window.setTimeout(positionGizmoViewportResizeHandle, 0);
}

if (gizmoToolbarResizeHandleEl) {
  let drag:
    | {
        startX: number;
        startWidth: number;
      }
    | null = null;

  const endDrag = () => {
    drag = null;
    document.body.style.userSelect = "";
  };

  gizmoToolbarResizeHandleEl.addEventListener("pointerdown", (e) => {
    const vp = viewer.getAxisGizmoViewportScreenRect?.();
    const fallbackWidth = vp ? Math.max(108, Math.round(vp.size)) : 108;
    drag = {
      startX: e.clientX,
      startWidth: gizmoToolbarWidthOverride ?? fallbackWidth,
    };
    document.body.style.userSelect = "none";
    try { gizmoToolbarResizeHandleEl.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
    e.stopPropagation();
  });

  gizmoToolbarResizeHandleEl.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = drag.startX - e.clientX; // drag left = wider
    const vp = viewer.getAxisGizmoViewportScreenRect?.();
    const maxWidth = vp ? Math.max(108, Math.round(vp.left + vp.size - 8)) : 700;
    gizmoToolbarWidthOverride = Math.max(108, Math.min(maxWidth, Math.round(drag.startWidth + dx)));
    positionGizmoViewportResizeHandle();
    e.preventDefault();
    e.stopPropagation();
  });

  gizmoToolbarResizeHandleEl.addEventListener("pointerup", endDrag);
  gizmoToolbarResizeHandleEl.addEventListener("pointercancel", endDrag);
}

if (gizmoCardinalUpBadgeEl) {
  gizmoCardinalUpBadgeEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.toggleCardinalUp?.();
    positionGizmoViewportResizeHandle();
  });
}
if (gizmoToggleBtnEl) {
  gizmoToggleBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    gizmoSettingsPanelOpen = !gizmoSettingsPanelOpen;
    positionGizmoViewportResizeHandle();
  });
}

if (gizmoLineOpacityRangeEl) {
  const apply = () => {
    const v = Number(gizmoLineOpacityRangeEl.value);
    const alpha = Number.isFinite(v) ? Math.max(0, Math.min(1, v / 100)) : 0.12;
    viewer.setAxisGizmoLineOpacity?.(alpha);
  };
  gizmoLineOpacityRangeEl.addEventListener("input", apply);
  const current = Math.round((viewer.getAxisGizmoLineOpacity?.() ?? 0.12) * 100);
  gizmoLineOpacityRangeEl.value = String(Math.max(0, Math.min(100, current)));
  apply();
}

if (gizmoSphereSizeRangeEl) {
  const apply = () => {
    const v = Number(gizmoSphereSizeRangeEl.value);
    const scale = Number.isFinite(v) ? Math.max(0.4, Math.min(2.5, v / 100)) : 1;
    viewer.setAxisGizmoSphereScale?.(scale);
  };
  gizmoSphereSizeRangeEl.addEventListener("input", apply);
  const current = Math.round((viewer.getAxisGizmoSphereScale?.() ?? 1) * 100);
  gizmoSphereSizeRangeEl.value = String(Math.max(40, Math.min(250, current)));
  apply();
}

if (gizmoTextSizeRangeEl) {
  const apply = () => {
    const v = Number(gizmoTextSizeRangeEl.value);
    const scale = Number.isFinite(v) ? Math.max(0.5, Math.min(3, v / 100)) : 1;
    viewer.setAxisGizmoTextScale?.(scale);
  };
  gizmoTextSizeRangeEl.addEventListener("input", apply);
  const current = Math.round((viewer.getAxisGizmoTextScale?.() ?? 1) * 100);
  gizmoTextSizeRangeEl.value = String(Math.max(50, Math.min(250, current)));
  apply();
}

if (gizmoRollCwBtnEl) {
  gizmoRollCwBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.rollViewByDegrees?.(-90);
    positionGizmoViewportResizeHandle();
  });
}

if (gizmoRollCcwBtnEl) {
  gizmoRollCcwBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.rollViewByDegrees?.(90);
    positionGizmoViewportResizeHandle();
  });
}

const bindGizmoModeBtn = (btn: HTMLButtonElement | null, mode: "current" | "orbit" | "trackball" | "arcball") => {
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.setCameraControlMode?.(mode);
    syncGizmoModeButtons();
    positionGizmoViewportResizeHandle();
  });
};
bindGizmoModeBtn(gizmoModeCurrentBtnEl, "current");
bindGizmoModeBtn(gizmoModeOrbitBtnEl, "orbit");
bindGizmoModeBtn(gizmoModeTrackballBtnEl, "trackball");
bindGizmoModeBtn(gizmoModeArcballBtnEl, "arcball");
if (gizmoGravityRangeEl) {
  const applyGravity = () => {
    const v = Number(gizmoGravityRangeEl.value);
    const normalized = Number.isFinite(v) ? Math.min(1, Math.max(0, v / 100)) : 0.55;
    viewer.setCameraInertia?.(normalized);
  };
  gizmoGravityRangeEl.addEventListener("input", applyGravity);
  applyGravity();
}
if (gizmoDecayRangeEl) {
  const applyDecay = () => {
    const v = Number(gizmoDecayRangeEl.value);
    const clamped = Number.isFinite(v) ? Math.min(101, Math.max(0, Math.round(v))) : 0;
    if (clamped >= 101) {
      viewer.setMomentumDecaySeconds?.(Infinity);
      gizmoDecayRangeEl.title = "Decay: ∞";
      return;
    }
    if (clamped <= 0) {
      viewer.setMomentumDecaySeconds?.(0.001);
      gizmoDecayRangeEl.title = "Decay: 0.0s";
      return;
    }
    const t = (clamped - 1) / 99; // 0..1
    const secs = 0.1 + t * (10 - 0.1);
    viewer.setMomentumDecaySeconds?.(secs);
    gizmoDecayRangeEl.title = `Decay: ${secs.toFixed(1)}s`;
  };
  gizmoDecayRangeEl.addEventListener("input", applyDecay);
  applyDecay();
}
if (gizmoSpinToggleBtnEl) {
  const syncSpinBtn = () => {
    const active = !!viewer.getAutoSpinEnabled?.();
    gizmoSpinToggleBtnEl.setAttribute("aria-pressed", active ? "true" : "false");
    gizmoSpinToggleBtnEl.textContent = "Spin";
    if (gizmoSpinSpeedRangeEl) {
      gizmoSpinSpeedRangeEl.style.display = gizmoControlsPanelOpen && active ? "block" : "none";
    }
    if (gizmoSpinSpeedLabelEl) {
      gizmoSpinSpeedLabelEl.style.display = gizmoControlsPanelOpen && active ? "block" : "none";
    }
  };
  gizmoSpinToggleBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !(viewer.getAutoSpinEnabled?.() ?? false);
    viewer.setAutoSpinEnabled?.(next);
    syncSpinBtn();
    positionGizmoViewportResizeHandle();
  });
  syncSpinBtn();
}
if (gizmoSpinSpeedRangeEl) {
  const applySpinSpeed = () => {
    const v = Number(gizmoSpinSpeedRangeEl.value);
    const clamped = Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 55;
    // Bidirectional spin map:
    //  - 0%   => max speed left
    //  - 50%  => stop
    //  - 100% => max speed right
    const signed = (clamped - 50) / 50; // -1..1
    const maxSpeed = 13.0;
    const speed = Math.sign(signed) * Math.pow(Math.abs(signed), 1.2) * maxSpeed;
    viewer.setAutoSpinSpeed?.(speed);
  };
  gizmoSpinSpeedRangeEl.addEventListener("input", applySpinSpeed);
  applySpinSpeed();
}
if (gizmoZoomStopsInertiaBtnEl) {
  const syncZoomStopsInertiaBtn = () => {
    const active = !!viewer.getZoomStopsInertia?.();
    gizmoZoomStopsInertiaBtnEl.setAttribute("aria-pressed", active ? "true" : "false");
    gizmoZoomStopsInertiaBtnEl.textContent = "Zoom Stops Inertia";
  };
  gizmoZoomStopsInertiaBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !(viewer.getZoomStopsInertia?.() ?? false);
    viewer.setZoomStopsInertia?.(next);
    syncZoomStopsInertiaBtn();
    positionGizmoViewportResizeHandle();
  });
  syncZoomStopsInertiaBtn();
}
const syncViewProjectionButtons = () => {
  const isOrtho = !!viewer.isOrthographicLikeView?.();
  if (gizmoViewPerspectiveBtnEl) {
    gizmoViewPerspectiveBtnEl.setAttribute("aria-pressed", isOrtho ? "false" : "true");
  }
  if (gizmoViewOrthographicBtnEl) {
    gizmoViewOrthographicBtnEl.setAttribute("aria-pressed", isOrtho ? "true" : "false");
  }
};
const syncFovSliderFromViewState = () => {
  if (!gizmoViewFovRangeEl) return;
  const isOrtho = !!viewer.isOrthographicLikeView?.();
  if (isOrtho) {
    gizmoViewFovRangeEl.value = "0";
    return;
  }
  const fov = Math.round(viewer.getCameraFov?.() ?? 45);
  gizmoViewFovRangeEl.value = String(Math.min(100, Math.max(1, fov)));
};
if (gizmoViewBtnEl) {
  gizmoViewBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    gizmoViewPanelOpen = !gizmoViewPanelOpen;
    gizmoViewPanelEl?.classList.toggle("open", gizmoViewPanelOpen);
    positionGizmoViewportResizeHandle();
  });
}
if (gizmoControlsBtnEl) {
  gizmoControlsBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    gizmoControlsPanelOpen = !gizmoControlsPanelOpen;
    positionGizmoViewportResizeHandle();
  });
}
if (gizmoViewResetBtnEl) {
  gizmoViewResetBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.resetCameraView?.();
  });
}
if (gizmoViewPerspectiveBtnEl) {
  gizmoViewPerspectiveBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.setPerspectiveView?.();
    syncViewProjectionButtons();
    syncFovSliderFromViewState();
  });
}
if (gizmoViewOrthographicBtnEl) {
  gizmoViewOrthographicBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.setOrthographicLikeView?.();
    viewer.resetCameraView?.();
    syncViewProjectionButtons();
    syncFovSliderFromViewState();
  });
}
const syncViewStyleButtons = () => {
  const mode = (viewer.getDisplayStyleMode?.() ?? "shaded") as "shaded" | "edges" | "shaded_edges" | "xray" | "xray_edges" | "clay";
  gizmoViewStyleShadedBtnEl?.setAttribute("aria-pressed", mode === "shaded" ? "true" : "false");
  gizmoViewStyleEdgesBtnEl?.setAttribute("aria-pressed", mode === "edges" ? "true" : "false");
  gizmoViewStyleXrayBtnEl?.setAttribute("aria-pressed", mode === "xray" ? "true" : "false");
  gizmoViewStyleClayBtnEl?.setAttribute("aria-pressed", mode === "clay" ? "true" : "false");
};
const syncViewBackgroundButtons = () => {
  const mode = (viewer.getBackgroundMode?.() ?? "dark_blue") as "dark_blue" | "black" | "grid";
  if (mode === "dark_blue" || mode === "black") {
    lastNonGridBackgroundMode = mode;
  }
  gizmoViewBgDarkBlueBtnEl?.setAttribute("aria-pressed", mode === "dark_blue" ? "true" : "false");
  gizmoViewBgBlackBtnEl?.setAttribute("aria-pressed", mode === "black" ? "true" : "false");
  if (gizmoGridSectionEl && gizmoGridSectionEl.open !== (mode === "grid")) {
    gizmoGridSectionEl.open = mode === "grid";
  }
  gizmoGridControlsEl?.classList.add("open");
  gizmoGridContrastBtnEl?.setAttribute("aria-pressed", viewer.getGridHighContrast?.() ? "true" : "false");
};
const bindViewStyleBtn = (
  btn: HTMLButtonElement | null,
  mode: "shaded" | "edges" | "shaded_edges" | "xray" | "xray_edges" | "clay"
) => {
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.setDisplayStyleMode?.(mode);
    syncViewStyleButtons();
  });
};
bindViewStyleBtn(gizmoViewStyleShadedBtnEl, "shaded");
bindViewStyleBtn(gizmoViewStyleEdgesBtnEl, "edges");
bindViewStyleBtn(gizmoViewStyleXrayBtnEl, "xray");
bindViewStyleBtn(gizmoViewStyleClayBtnEl, "clay");
syncViewStyleButtons();
let lastNonGridBackgroundMode: "dark_blue" | "black" = "dark_blue";
{
  const mode = (viewer.getBackgroundMode?.() ?? "dark_blue") as "dark_blue" | "black" | "grid";
  if (mode === "black") lastNonGridBackgroundMode = "black";
}
const bindViewBackgroundBtn = (
  btn: HTMLButtonElement | null,
  mode: "dark_blue" | "black" | "grid"
) => {
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === "dark_blue" || mode === "black") lastNonGridBackgroundMode = mode;
    viewer.setBackgroundMode?.(mode);
    syncViewBackgroundButtons();
  });
};
bindViewBackgroundBtn(gizmoViewBgDarkBlueBtnEl, "dark_blue");
bindViewBackgroundBtn(gizmoViewBgBlackBtnEl, "black");
if (gizmoGridSectionEl) {
  gizmoGridSectionEl.addEventListener("toggle", () => {
    if (gizmoGridSectionEl.open) {
      viewer.setBackgroundMode?.("grid");
    } else {
      if ((viewer.getBackgroundMode?.() ?? "dark_blue") === "grid") {
        viewer.setBackgroundMode?.(lastNonGridBackgroundMode);
      }
    }
    syncViewBackgroundButtons();
  });
}
syncViewBackgroundButtons();
if (gizmoGridSizeRangeEl) {
  const apply = () => {
    const v = Number(gizmoGridSizeRangeEl.value);
    viewer.setGridSize?.(Number.isFinite(v) ? v : 600);
  };
  gizmoGridSizeRangeEl.addEventListener("input", apply);
  const current = Math.round(viewer.getGridSize?.() ?? 600);
  gizmoGridSizeRangeEl.value = String(Math.min(4000, Math.max(100, current)));
  apply();
}
if (gizmoGridDivisionsRangeEl) {
  const apply = () => {
    const v = Number(gizmoGridDivisionsRangeEl.value);
    viewer.setGridDivisions?.(Number.isFinite(v) ? v : 30);
  };
  gizmoGridDivisionsRangeEl.addEventListener("input", apply);
  const current = Math.round(viewer.getGridDivisions?.() ?? 30);
  gizmoGridDivisionsRangeEl.value = String(Math.min(240, Math.max(4, current)));
  apply();
}
if (gizmoGridMajorStepRangeEl) {
  const apply = () => {
    const v = Number(gizmoGridMajorStepRangeEl.value);
    viewer.setGridMajorStep?.(Number.isFinite(v) ? v : 5);
  };
  gizmoGridMajorStepRangeEl.addEventListener("input", apply);
  const current = Math.round(viewer.getGridMajorStep?.() ?? 5);
  gizmoGridMajorStepRangeEl.value = String(Math.min(40, Math.max(1, current)));
  apply();
}
if (gizmoGridOpacityRangeEl) {
  const apply = () => {
    const v = Number(gizmoGridOpacityRangeEl.value);
    viewer.setGridOpacity?.(Number.isFinite(v) ? Math.max(0, Math.min(1, v / 100)) : 0.45);
  };
  gizmoGridOpacityRangeEl.addEventListener("input", apply);
  const current = Math.round((viewer.getGridOpacity?.() ?? 0.45) * 100);
  gizmoGridOpacityRangeEl.value = String(Math.min(100, Math.max(0, current)));
  apply();
}
if (gizmoGridContrastBtnEl) {
  gizmoGridContrastBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !(viewer.getGridHighContrast?.() ?? false);
    viewer.setGridHighContrast?.(next);
    syncViewBackgroundButtons();
  });
}
if (gizmoViewFovRangeEl) {
  gizmoViewFovRangeEl.addEventListener("input", () => {
    const raw = Number(gizmoViewFovRangeEl.value);
    if (!Number.isFinite(raw) || raw <= 0) {
      viewer.setOrthographicLikeView?.();
      syncViewProjectionButtons();
      syncFovSliderFromViewState();
      return;
    }
    if (viewer.isOrthographicLikeView?.()) {
      viewer.setPerspectiveView?.(false);
    }
    viewer.setCameraFov?.(raw);
    syncViewProjectionButtons();
    syncFovSliderFromViewState();
  });
  syncFovSliderFromViewState();
}
if (gizmoViewZoomRangeEl) {
  const syncZoomFromViewer = () => {
    const zoom = Math.round((viewer.getCameraZoomFactor?.() ?? 1) * 100);
    gizmoViewZoomRangeEl.value = String(Math.min(400, Math.max(25, zoom)));
  };
  gizmoViewZoomRangeEl.addEventListener("input", () => {
    const zoom = Number(gizmoViewZoomRangeEl.value);
    const factor = Number.isFinite(zoom) ? Math.max(0.25, Math.min(4, zoom / 100)) : 1;
    viewer.setCameraZoomFactor?.(factor);
  });
  syncZoomFromViewer();
}
if (gizmoViewTopBtnEl) {
  gizmoViewTopBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.snapToTopView?.();
  });
}
if (gizmoViewFrontBtnEl) {
  gizmoViewFrontBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.snapToFrontView?.();
  });
}
const syncVisualSceneUI = () => {
  const mode = viewer.getVisualSceneMode?.() ?? "off";
  const wasActive = lastVisualSceneMode !== "off";
  const isActive = mode !== "off";
  if (!wasActive && isActive) {
    visualSceneCameraOverridesSaved = {
      inertia: gizmoGravityRangeEl?.value,
      decay: gizmoDecayRangeEl?.value,
    };
    setRangeValueAndApply(gizmoGravityRangeEl, "100");
    setRangeValueAndApply(gizmoDecayRangeEl, "100");
  } else if (wasActive && !isActive && visualSceneCameraOverridesSaved) {
    if (typeof visualSceneCameraOverridesSaved.inertia === "string") {
      setRangeValueAndApply(gizmoGravityRangeEl, visualSceneCameraOverridesSaved.inertia);
    }
    if (typeof visualSceneCameraOverridesSaved.decay === "string") {
      setRangeValueAndApply(gizmoDecayRangeEl, visualSceneCameraOverridesSaved.decay);
    }
    visualSceneCameraOverridesSaved = null;
  }
  lastVisualSceneMode = mode;

  gizmoViewStarsBtnEl?.setAttribute("aria-pressed", mode === "stars" ? "true" : "false");
  gizmoViewNebulaBtnEl?.setAttribute("aria-pressed", mode === "nebula" ? "true" : "false");
  gizmoViewSwarmBtnEl?.setAttribute("aria-pressed", mode === "swarm" ? "true" : "false");
  gizmoStarsControlsEl?.classList.toggle("open", mode === "stars");
  gizmoNebulaControlsEl?.classList.toggle("open", mode === "nebula");
  gizmoSwarmControlsEl?.classList.toggle("open", mode === "swarm");
  gizmoViewPanelEl?.classList.toggle("starsOpen", mode !== "off");
};
if (gizmoViewStarsBtnEl) {
  gizmoViewStarsBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.toggleVisualScene?.("stars");
    syncVisualSceneUI();
  });
}
if (gizmoViewNebulaBtnEl) {
  gizmoViewNebulaBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.toggleVisualScene?.("nebula");
    syncVisualSceneUI();
  });
}
if (gizmoViewSwarmBtnEl) {
  gizmoViewSwarmBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewer.toggleVisualScene?.("swarm");
    syncVisualSceneUI();
  });
}
syncVisualSceneUI();
if (gizmoStarsMotionRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsMotionRangeEl.value);
    const scale = Number.isFinite(v) ? Math.max(0, v / 100) : 1;
    viewer.setStarsMotionScale?.(scale);
  };
  gizmoStarsMotionRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsCountRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsCountRangeEl.value);
    const count = Number.isFinite(v) ? Math.max(20, Math.round(v)) : 80;
    viewer.setStarsNodeCount?.(count);
  };
  gizmoStarsCountRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsGlowRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsGlowRangeEl.value);
    const scale = Number.isFinite(v) ? Math.max(0, v / 100) : 1;
    viewer.setStarsGlowScale?.(scale);
  };
  gizmoStarsGlowRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsWireRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsWireRangeEl.value);
    const opacity = Number.isFinite(v) ? Math.min(1, Math.max(0, v / 100)) : 0.24;
    viewer.setStarsWireOpacity?.(opacity);
  };
  gizmoStarsWireRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsLikelihoodRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsLikelihoodRangeEl.value);
    const likelihood = Number.isFinite(v) ? Math.min(1, Math.max(0, v / 100)) : 0.5;
    viewer.setStarsLineLikelihood?.(likelihood);
  };
  gizmoStarsLikelihoodRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsLineDistanceRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsLineDistanceRangeEl.value);
    if (!Number.isFinite(v)) {
      viewer.setStarsLineDistanceScale?.(1);
      return;
    }
    const clamped = Math.max(25, Math.min(500, v));
    // Keep 100 = 1x, then ramp upper range to 10x at 500.
    const scale = clamped <= 100
      ? clamped / 100
      : 1 + ((clamped - 100) / 400) * 9;
    viewer.setStarsLineDistanceScale?.(Math.max(0.1, scale));
  };
  gizmoStarsLineDistanceRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsSizeRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsSizeRangeEl.value);
    const scale = Number.isFinite(v) ? Math.max(0.1, v / 100) : 1;
    viewer.setStarsNodeScale?.(scale);
  };
  gizmoStarsSizeRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoStarsDistanceRangeEl) {
  const apply = () => {
    const v = Number(gizmoStarsDistanceRangeEl.value);
    if (!Number.isFinite(v)) {
      viewer.setStarsDistanceScale?.(1);
      return;
    }
    const clamped = Math.max(25, Math.min(10000, v));
    // Keep 100 = 1x, then ramp upper range to 10x at 10000.
    const scale = clamped <= 100
      ? clamped / 100
      : 1 + ((clamped - 100) / 9900) * 9;
    viewer.setStarsDistanceScale?.(Math.max(0.1, scale));
  };
  gizmoStarsDistanceRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoNebulaDensityRangeEl) {
  const apply = () => {
    const v = Number(gizmoNebulaDensityRangeEl.value);
    viewer.setNebulaDensity?.(Number.isFinite(v) ? Math.max(0.1, v / 100) : 1);
  };
  gizmoNebulaDensityRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoNebulaScaleRangeEl) {
  const apply = () => {
    const v = Number(gizmoNebulaScaleRangeEl.value);
    if (!Number.isFinite(v)) {
      viewer.setNebulaScale?.(1);
      return;
    }
    const clamped = Math.max(20, Math.min(300, v));
    // Keep 100 = 1x, then ramp upper range to 10x at 300.
    const scale = clamped <= 100
      ? clamped / 100
      : 1 + ((clamped - 100) / 200) * 9;
    viewer.setNebulaScale?.(Math.max(0.2, scale));
  };
  gizmoNebulaScaleRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoNebulaTurbulenceRangeEl) {
  const apply = () => {
    const v = Number(gizmoNebulaTurbulenceRangeEl.value);
    viewer.setNebulaTurbulence?.(Number.isFinite(v) ? Math.max(0, v / 100) : 0.35);
  };
  gizmoNebulaTurbulenceRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoNebulaDriftRangeEl) {
  const apply = () => {
    const v = Number(gizmoNebulaDriftRangeEl.value);
    viewer.setNebulaDrift?.(Number.isFinite(v) ? Math.max(0, v / 100) : 1);
  };
  gizmoNebulaDriftRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoNebulaGlowRangeEl) {
  const apply = () => {
    const v = Number(gizmoNebulaGlowRangeEl.value);
    viewer.setNebulaGlow?.(Number.isFinite(v) ? Math.max(0, v / 100) : 1);
  };
  gizmoNebulaGlowRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoNebulaColorShiftRangeEl) {
  const apply = () => {
    const v = Number(gizmoNebulaColorShiftRangeEl.value);
    viewer.setNebulaColorShift?.(Number.isFinite(v) ? Math.max(0, Math.min(1, v / 100)) : 0);
  };
  gizmoNebulaColorShiftRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmCountRangeEl) {
  const apply = () => {
    const v = Number(gizmoSwarmCountRangeEl.value);
    viewer.setSwarmCount?.(Number.isFinite(v) ? Math.max(50, Math.round(v)) : 300);
  };
  gizmoSwarmCountRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmSpeedRangeEl) {
  const apply = () => {
    const v = Number(gizmoSwarmSpeedRangeEl.value);
    viewer.setSwarmSpeed?.(Number.isFinite(v) ? Math.max(0.1, v / 100) : 1);
  };
  gizmoSwarmSpeedRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmCohesionRangeEl) {
  const apply = () => {
    const v = Number(gizmoSwarmCohesionRangeEl.value);
    viewer.setSwarmCohesion?.(Number.isFinite(v) ? Math.max(0, v / 100) : 0.45);
  };
  gizmoSwarmCohesionRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmSeparationRangeEl) {
  const apply = () => {
    const v = Number(gizmoSwarmSeparationRangeEl.value);
    viewer.setSwarmSeparation?.(Number.isFinite(v) ? Math.max(0, v / 100) : 0.5);
  };
  gizmoSwarmSeparationRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmAlignmentRangeEl) {
  const apply = () => {
    const v = Number(gizmoSwarmAlignmentRangeEl.value);
    viewer.setSwarmAlignment?.(Number.isFinite(v) ? Math.max(0, v / 100) : 0.5);
  };
  gizmoSwarmAlignmentRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmJitterRangeEl) {
  const apply = () => {
    const v = Number(gizmoSwarmJitterRangeEl.value);
    viewer.setSwarmJitter?.(Number.isFinite(v) ? Math.max(0, v / 100) : 0.2);
  };
  gizmoSwarmJitterRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmDecayRangeEl) {
  const sliderToSeconds = (v: number) => {
    if (v >= 101) return Infinity;
    const t = Math.max(0, Math.min(1, (v - 1) / 100));
    return 0.1 + t * 9.9; // 0.1s..10s
  };
  const apply = () => {
    const raw = Number(gizmoSwarmDecayRangeEl.value);
    const secs = sliderToSeconds(Number.isFinite(raw) ? raw : 40);
    viewer.setSwarmSpinDecaySeconds?.(secs);
    gizmoSwarmDecayRangeEl.title = Number.isFinite(secs)
      ? `Swarm anim length: ${secs.toFixed(1)}s`
      : "Swarm anim length: unlimited";
  };
  gizmoSwarmDecayRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmProgressRangeEl) {
  const apply = () => {
    const raw = Number(gizmoSwarmProgressRangeEl.value);
    const v = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0;
    viewer.setSwarmAnimationProgressPercent?.(v);
    gizmoSwarmProgressRangeEl.title = `Swarm progress: ${Math.round(v)}%`;
  };
  gizmoSwarmProgressRangeEl.addEventListener("pointerdown", () => {
    gizmoSwarmProgressDragging = true;
  });
  const endDrag = () => {
    gizmoSwarmProgressDragging = false;
  };
  gizmoSwarmProgressRangeEl.addEventListener("pointerup", endDrag);
  gizmoSwarmProgressRangeEl.addEventListener("pointercancel", endDrag);
  gizmoSwarmProgressRangeEl.addEventListener("change", endDrag);
  gizmoSwarmProgressRangeEl.addEventListener("input", apply);
  apply();
}
if (gizmoSwarmExplodeBtnEl) {
  const sync = () => {
    const active = !!viewer.getSwarmExplodeEnabled?.();
    gizmoSwarmExplodeBtnEl.setAttribute("aria-pressed", active ? "true" : "false");
  };
  gizmoSwarmExplodeBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !(viewer.getSwarmExplodeEnabled?.() ?? false);
    viewer.setSwarmExplodeEnabled?.(next);
    sync();
  });
  sync();
}
if (gizmoSwarmExplodeStrengthRangeEl) {
  const apply = () => {
    const raw = Number(gizmoSwarmExplodeStrengthRangeEl.value);
    const v = Number.isFinite(raw) ? Math.max(0, raw / 100) : 1;
    viewer.setSwarmExplodeStrength?.(v);
    gizmoSwarmExplodeStrengthRangeEl.title = `Explode strength: ${v.toFixed(2)}`;
  };
  gizmoSwarmExplodeStrengthRangeEl.addEventListener("input", apply);
  apply();
}
syncViewProjectionButtons();
syncGizmoModeButtons();

// Keep overlay aligned and cardinal-up label current as camera orientation changes.
let fpsLastTs = performance.now();
let fpsSmooth = 0;
const tickGizmoOverlay = () => {
  const now = performance.now();
  const dtMs = Math.max(1, now - fpsLastTs);
  fpsLastTs = now;
  const fpsInst = 1000 / dtMs;
  fpsSmooth = fpsSmooth > 0 ? (fpsSmooth * 0.9 + fpsInst * 0.1) : fpsInst;
  if (gizmoFpsBadgeEl) {
    gizmoFpsBadgeEl.textContent = `${Math.round(fpsSmooth)} fps`;
  }
  positionGizmoViewportResizeHandle();
  syncVisualSceneUI();
  if (gizmoSwarmProgressRangeEl && !gizmoSwarmProgressDragging) {
    const v = viewer.getSwarmAnimationProgressPercent?.();
    if (Number.isFinite(v as number)) {
      const s = String(v);
      if (gizmoSwarmProgressRangeEl.value !== s) gizmoSwarmProgressRangeEl.value = s;
      gizmoSwarmProgressRangeEl.title = `Swarm progress: ${s}%`;
    }
  }
  if (gizmoViewZoomRangeEl && document.activeElement !== gizmoViewZoomRangeEl) {
    const zoomPct = Math.round((viewer.getCameraZoomFactor?.() ?? 1) * 100);
    const clamped = Math.min(400, Math.max(25, zoomPct));
    const next = String(clamped);
    if (gizmoViewZoomRangeEl.value !== next) gizmoViewZoomRangeEl.value = next;
  }
  requestAnimationFrame(tickGizmoOverlay);
};
requestAnimationFrame(tickGizmoOverlay);

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

function normalizeUIContainerHeight() {
  const uiEl = document.getElementById("ui");
  if (!uiEl) return;
  // `resize: both` previously left a persistent inline height on the element.
  // We now control height via CSS and only allow horizontal resize.
  uiEl.style.removeProperty("height");
}

function logUILayoutHeights() {
  const uiEl = document.getElementById("ui");
  if (!uiEl) return;
  const uiRect = uiEl.getBoundingClientRect();
  const viewportH = window.innerHeight;
  log(
    `ui-height: ${Math.round(uiRect.height)}px | viewport-height: ${Math.round(viewportH)}px` +
    ` | inline-ui-height: ${uiEl.style.height || "(none)"}`
  );
}

normalizeUIContainerHeight();
window.addEventListener("resize", logUILayoutHeights);
window.setTimeout(logUILayoutHeights, 0);

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
viewer.loadFootpadOBJWithMTL(
  2,
  `${BASE}footpads/XR_Footpad_PubPad_Full_Assembly.obj`,
  `${BASE}footpads/XR_Footpad_PubPad_Full_Assembly.mtl`,
  1 / 25.4,
  { z: 180 },
  { x: -15, z: 5 }
);
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
[footpad1EnabledEl, footpad2EnabledEl, footpad3EnabledEl].forEach((el) =>
  el.addEventListener("change", syncReferenceLayerRowsFromCheckboxes)
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

viewer.loadOBJWithMTL(`${BASE}Blue_Vans_Shoe_SF.obj`, `${BASE}Blue_Vans_Shoe_SF.mtl`);

const SHOE_BASE_UNIT_SCALE = 66; // +10% reference shoe import baseline
const SHOE_BASE_ROT = { x: 90, y: 0, z: 0 };
const SHOE_BASE_OFFSET = { x: 45, y: 102, z: 45 };
let shoeMaterialsEnabled = true;

viewer.setShoeUnitScale(SHOE_BASE_UNIT_SCALE);
viewer.setShoeMaterialsEnabled(shoeMaterialsEnabled);
viewer.setFootpadMaterialsEnabled(shoeMaterialsEnabled);

function syncLayersMaterialsToggleBtn() {
  const btn = document.getElementById("layersMaterialsToggle") as HTMLButtonElement | null;
  if (!btn) return;
  btn.textContent = shoeMaterialsEnabled ? "Mats On" : "Mats Off";
  btn.setAttribute("aria-pressed", shoeMaterialsEnabled ? "true" : "false");
  btn.title = shoeMaterialsEnabled ? "Turn shoe materials off" : "Turn shoe materials on";
}
syncLayersMaterialsToggleBtn();

function applyShoeUIToViewer() {
  viewer.setShoeVisible(!!shoeEnabledEl.checked);
  const modelMirrorXZElEarly = document.getElementById("modelMirrorXZ") as HTMLInputElement | null;
  viewer.setShoeMirrorXZ(!!modelMirrorXZElEarly?.checked);
  viewer.setShoeMaterialsEnabled(shoeMaterialsEnabled);
  viewer.setFootpadMaterialsEnabled(shoeMaterialsEnabled);

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
shoeEnabledEl.addEventListener("change", syncReferenceLayerRowsFromCheckboxes);
shoeAlphaEl.addEventListener("input", applyShoeUIToViewer);
shoeScaleEl.addEventListener("input", applyShoeUIToViewer);
[shoeXEl, shoeYEl, shoeZEl, shoeRotEl].forEach((el) => el.addEventListener("input", applyShoeUIToViewer));
document.getElementById("layersMaterialsToggle")?.addEventListener("click", () => {
  shoeMaterialsEnabled = !shoeMaterialsEnabled;
  viewer.setShoeMaterialsEnabled(shoeMaterialsEnabled);
  viewer.setFootpadMaterialsEnabled(shoeMaterialsEnabled);
  syncLayersMaterialsToggleBtn();
});

// -----------------------------
// Radio (SoundCloud widget, custom shell)
// -----------------------------
const RADIO_SOUNDCLOUD_URL = "https://soundcloud.com/keota-us/gusano?in=keota-us/sets/1000-answers-ep";
const RADIO_DEFAULT_VOLUME = 60;

const radioSectionEl = mustEl<HTMLDetailsElement>("radioSection");
const radioPlayPauseEl = mustEl<HTMLButtonElement>("radioPlayPause");
const radioVolumeEl = mustEl<HTMLInputElement>("radioVolume");
const radioSeekEl = mustEl<HTMLInputElement>("radioSeek");
const radioSeekTimeEl = document.getElementById("radioSeekTime") as HTMLDivElement | null;
const radioBurstDurationEl = mustEl<HTMLInputElement>("radioBurstDuration");
const radioBurstDurationValEl = document.getElementById("radioBurstDurationVal") as HTMLInputElement | null;
const radioOpenLinkEl = mustEl<HTMLButtonElement>("radioOpenLink");
const radioScIframeEl = mustEl<HTMLIFrameElement>("radioScIframe");
const radioStatusEl = document.getElementById("radioStatus") as HTMLDivElement | null;

let soundCloudApiPromise: Promise<SoundCloudGlobal> | null = null;
let radioInitPromise: Promise<void> | null = null;
let radioWidget: SoundCloudWidget | null = null;
let radioWidgetReady = false;
let radioIsPlaying = false;
let radioAutoSliderHoldActive = false;
let radioAutoCheckboxBurstActive = false;
let radioAutoCheckboxTimer: number | null = null;
let radioTrackDurationMs = 0;
let radioCurrentPositionMs = 0;
let radioSeekScrubbing = false;
const radioParaHookCueRatioById = new Map<string, number>();
let radioPendingAutoCueRatio: number | null = null;

function setRadioStatus(message: string) {
  if (radioStatusEl) radioStatusEl.textContent = message;
}

function syncRadioPlayPauseButton() {
  radioPlayPauseEl.textContent = radioIsPlaying ? "⏸" : "▶";
  radioPlayPauseEl.setAttribute("aria-label", radioIsPlaying ? "Pause" : "Play");
  radioPlayPauseEl.title = radioIsPlaying ? "Pause" : "Play";
}

function setRadioControlsEnabled(enabled: boolean) {
  radioPlayPauseEl.disabled = !enabled;
  radioVolumeEl.disabled = !enabled;
  radioSeekEl.disabled = !enabled;
}

function formatRadioTime(ms: number) {
  const clampedMs = Math.max(0, Math.round(ms));
  const totalSec = Math.floor(clampedMs / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function syncRadioSeekUI(positionMs = radioCurrentPositionMs) {
  const dur = Math.max(0, Math.round(radioTrackDurationMs));
  const pos = clamp(Math.round(positionMs), 0, dur || Math.max(1, Math.round(positionMs)));
  radioCurrentPositionMs = pos;

  const max = Math.max(1, dur);
  radioSeekEl.max = String(max);
  if (!radioSeekScrubbing) {
    radioSeekEl.value = String(clampInt(pos, 0, max));
  }
  if (radioSeekTimeEl) {
    radioSeekTimeEl.textContent = `${formatRadioTime(pos)} / ${formatRadioTime(dur)}`;
  }
}

function tryApplyPendingAutoCue() {
  if (radioPendingAutoCueRatio == null) return;
  if (!radioWidgetReady || !radioWidget) return;
  if (!(radioTrackDurationMs > 0)) return;
  const maxSeek = Math.max(0, radioTrackDurationMs - 1);
  const targetMs = clampInt(radioPendingAutoCueRatio * maxSeek, 0, maxSeek);
  radioPendingAutoCueRatio = null;
  radioWidget.seekTo(targetMs);
  syncRadioSeekUI(targetMs);
}

function clearRadioAutoCheckboxTimer() {
  if (radioAutoCheckboxTimer == null) return;
  window.clearTimeout(radioAutoCheckboxTimer);
  radioAutoCheckboxTimer = null;
}

function stopRadioAutoSampler() {
  clearRadioAutoCheckboxTimer();
  radioAutoCheckboxBurstActive = false;
  radioAutoSliderHoldActive = false;
  syncRadioAutoPlayback();
}

function radioAutoHasActiveTrigger() {
  return radioAutoSliderHoldActive || radioAutoCheckboxBurstActive;
}

function syncRadioAutoPlayback() {
  if (!radioAutoHasActiveTrigger()) {
    if (radioWidgetReady && radioWidget) radioWidget.pause();
    return;
  }
  void ensureRadioWidget()
    .then(() => {
      if (!radioAutoHasActiveTrigger()) return;
      if (!radioWidget) return;
      radioWidget.play();
    })
    .catch(() => {
      // ensureRadioWidget handles status/logging
    });
}

function scheduleRadioCheckboxBurstStop(durationMs: number) {
  clearRadioAutoCheckboxTimer();
  radioAutoCheckboxBurstActive = true;
  syncRadioAutoPlayback();
  radioAutoCheckboxTimer = window.setTimeout(() => {
    radioAutoCheckboxTimer = null;
    radioAutoCheckboxBurstActive = false;
    syncRadioAutoPlayback();
  }, Math.max(10, Math.round(durationMs)));
}

function readRadioCheckboxBurstMs() {
  const secs = clamp(readNumber(radioBurstDurationEl, 1), 0.01, 1);
  return secs * 1000;
}

function isInsideRadioSection(el: Element | null) {
  return !!el?.closest("#radioSection");
}

function isInsideParaHookParamsSection(el: Element | null) {
  return !!el?.closest("#paraHookParamsSection");
}

function getEventInputTarget(target: EventTarget | null): HTMLInputElement | null {
  if (!(target instanceof Element)) return null;
  if (target instanceof HTMLInputElement) return target;
  const input = target.closest("input");
  return input instanceof HTMLInputElement ? input : null;
}

function isArrowAdjustKey(ev: KeyboardEvent) {
  return ev.key === "ArrowLeft" || ev.key === "ArrowRight" || ev.key === "ArrowUp" || ev.key === "ArrowDown";
}

function startRadioAutoSliderHold() {
  radioAutoSliderHoldActive = true;
  syncRadioAutoPlayback();
}

function stopRadioAutoSliderHold() {
  if (!radioAutoSliderHoldActive) return;
  radioAutoSliderHoldActive = false;
  syncRadioAutoPlayback();
}

function getOrCreateParaHookCueRatio(inputId: string) {
  const existing = radioParaHookCueRatioById.get(inputId);
  if (existing != null) return existing;
  // Avoid the exact tail of the track so short bursts still produce audible sound.
  const ratio = Math.random() * 0.97;
  radioParaHookCueRatioById.set(inputId, ratio);
  log(`radio: assigned cue ${inputId} -> ${(ratio * 100).toFixed(1)}%`);
  return ratio;
}

function maybeApplyAssignedParaHookCue(input: HTMLInputElement) {
  if (!input.id) return;
  if (!isInsideParaHookParamsSection(input)) return;
  const ratio = getOrCreateParaHookCueRatio(input.id);
  if (!radioWidgetReady || !radioWidget || !(radioTrackDurationMs > 0)) {
    radioPendingAutoCueRatio = ratio;
    return;
  }
  const maxSeek = Math.max(0, radioTrackDurationMs - 1);
  const targetMs = clampInt(ratio * maxSeek, 0, maxSeek);
  radioWidget.seekTo(targetMs);
  syncRadioSeekUI(targetMs);
}

function bindGusanoInteractionSoundFx() {
  const controlsPanelEl = document.getElementById("controlsPanel");
  const paraHookParamsSectionEl = document.getElementById("paraHookParamsSection");
  const roots = [controlsPanelEl, paraHookParamsSectionEl].filter(
    (el): el is HTMLElement => !!el
  );

  const onCheckboxChange = (ev: Event) => {
    if (!radioSectionEl.open) return;
    const input = getEventInputTarget(ev.target);
    if (!input) return;
    if (input.type !== "checkbox") return;
    if (input.hidden) return;
    if (isInsideRadioSection(input)) return;
    maybeApplyAssignedParaHookCue(input);
    scheduleRadioCheckboxBurstStop(readRadioCheckboxBurstMs());
  };

  const onRangePress = (ev: Event) => {
    if (!radioSectionEl.open) return;
    const input = getEventInputTarget(ev.target);
    if (!input) return;
    if (input.type !== "range") return;
    if (isInsideRadioSection(input)) return;
    maybeApplyAssignedParaHookCue(input);
    startRadioAutoSliderHold();
  };

  const onKeyboardAdjustStart = (ev: KeyboardEvent) => {
    if (!radioSectionEl.open) return;
    if (!isArrowAdjustKey(ev)) return;
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const input = getEventInputTarget(ev.target);
    if (!input) return;
    if (input.type !== "range" && input.type !== "number") return;
    if (isInsideRadioSection(input)) return;
    maybeApplyAssignedParaHookCue(input);
    startRadioAutoSliderHold();
  };

  const onKeyboardAdjustEnd = (ev: KeyboardEvent) => {
    if (!isArrowAdjustKey(ev)) return;
    stopRadioAutoSliderHold();
  };

  for (const root of roots) {
    root.addEventListener("change", onCheckboxChange);
    root.addEventListener("pointerdown", onRangePress);
    root.addEventListener("mousedown", onRangePress);
    root.addEventListener("touchstart", onRangePress, { passive: true });
    root.addEventListener("keydown", onKeyboardAdjustStart);
    root.addEventListener("keyup", onKeyboardAdjustEnd);
  }

  window.addEventListener("pointerup", stopRadioAutoSliderHold);
  window.addEventListener("pointercancel", stopRadioAutoSliderHold);
  window.addEventListener("mouseup", stopRadioAutoSliderHold);
  window.addEventListener("touchend", stopRadioAutoSliderHold, { passive: true });
  window.addEventListener("touchcancel", stopRadioAutoSliderHold, { passive: true });
  window.addEventListener("blur", stopRadioAutoSliderHold);
}

function buildSoundCloudWidgetSrc(trackUrl: string) {
  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: "false",
    hide_related: "false",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function loadSoundCloudWidgetApi(): Promise<SoundCloudGlobal> {
  if (window.SC?.Widget) return Promise.resolve(window.SC);
  if (soundCloudApiPromise) return soundCloudApiPromise;

  soundCloudApiPromise = new Promise<SoundCloudGlobal>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-sc-widget-api="1"]');
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.SC?.Widget) resolve(window.SC);
        else reject(new Error("SoundCloud widget API loaded without SC.Widget"));
      }, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load SoundCloud widget API")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.dataset.scWidgetApi = "1";
    script.addEventListener(
      "load",
      () => {
        if (window.SC?.Widget) resolve(window.SC);
        else reject(new Error("SoundCloud widget API loaded without SC.Widget"));
      },
      { once: true }
    );
    script.addEventListener("error", () => reject(new Error("Failed to load SoundCloud widget API")), { once: true });
    document.head.appendChild(script);
  }).catch((err) => {
    soundCloudApiPromise = null;
    throw err;
  });

  return soundCloudApiPromise;
}

async function ensureRadioWidget() {
  if (radioWidgetReady && radioWidget) return;
  if (radioInitPromise) return radioInitPromise;

  radioInitPromise = (async () => {
    setRadioStatus("Loading radio...");
    setRadioControlsEnabled(false);

    if (!radioScIframeEl.src) {
      radioScIframeEl.src = buildSoundCloudWidgetSrc(RADIO_SOUNDCLOUD_URL);
    }

    const sc = await loadSoundCloudWidgetApi();
    const widget = sc.Widget(radioScIframeEl);
    const events = sc.Widget.Events;

    radioWidget = widget;

    widget.bind(events.READY, () => {
      radioWidgetReady = true;
      widget.setVolume(clampInt(readNumber(radioVolumeEl, RADIO_DEFAULT_VOLUME), 0, 100));
      widget.getDuration((durationMs) => {
        radioTrackDurationMs = Math.max(0, Math.round(durationMs || 0));
        syncRadioSeekUI(radioCurrentPositionMs);
        tryApplyPendingAutoCue();
      });
      setRadioControlsEnabled(true);
      setRadioStatus("Ready");
      syncRadioPlayPauseButton();
      log("radio: soundcloud widget ready");
    });
    widget.bind(events.PLAY, () => {
      radioIsPlaying = true;
      syncRadioPlayPauseButton();
      setRadioStatus("Playing");
    });
    widget.bind(events.PAUSE, () => {
      radioIsPlaying = false;
      syncRadioPlayPauseButton();
      setRadioStatus("Paused");
    });
    widget.bind(events.FINISH, () => {
      radioIsPlaying = false;
      syncRadioSeekUI(radioTrackDurationMs);
      syncRadioPlayPauseButton();
      setRadioStatus("Finished");
    });
    widget.bind(events.PLAY_PROGRESS ?? "PLAY_PROGRESS", (payload?: any) => {
      const nextPos = Number(payload?.currentPosition);
      if (!Number.isFinite(nextPos)) return;
      syncRadioSeekUI(nextPos);
    });
  })().catch((err) => {
    radioInitPromise = null;
    radioWidgetReady = false;
    radioWidget = null;
    radioIsPlaying = false;
    syncRadioPlayPauseButton();
    setRadioControlsEnabled(false);
    setRadioStatus("Radio unavailable");
    log(`radio: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  });

  return radioInitPromise;
}

function initRadioUI() {
  radioVolumeEl.value = String(clampInt(readNumber(radioVolumeEl, RADIO_DEFAULT_VOLUME), 0, 100));
  radioSeekEl.min = "0";
  radioSeekEl.max = "1";
  radioSeekEl.step = "1";
  radioSeekEl.value = "0";
  radioBurstDurationEl.value = String(clamp(readNumber(radioBurstDurationEl, 1), 0.01, 1));
  if (radioBurstDurationValEl) {
    radioBurstDurationValEl.value = Number(radioBurstDurationEl.value).toFixed(2);
  }
  syncRadioSeekUI(0);
  syncRadioPlayPauseButton();
  setRadioControlsEnabled(false);
  setRadioStatus("Radio idle");

  radioOpenLinkEl.addEventListener("click", () => {
    window.open(RADIO_SOUNDCLOUD_URL, "_blank", "noopener,noreferrer");
  });

  radioSectionEl.addEventListener("toggle", () => {
    if (!radioSectionEl.open) {
      stopRadioAutoSampler();
      return;
    }
    void ensureRadioWidget().catch(() => {
      // Status/logging handled in ensureRadioWidget().
    });
  });

  radioPlayPauseEl.addEventListener("click", async () => {
    if (!radioWidgetReady || !radioWidget) {
      try {
        await ensureRadioWidget();
      } catch {
        return;
      }
    }
    if (!radioWidget) return;
    if (radioIsPlaying) {
      radioWidget.pause();
      return;
    }
    radioWidget.play();
  });

  const applyRadioVolume = () => {
    const volume = clampInt(readNumber(radioVolumeEl, RADIO_DEFAULT_VOLUME), 0, 100);
    radioVolumeEl.value = String(volume);
    if (!radioWidgetReady || !radioWidget) return;
    radioWidget.setVolume(volume);
  };
  radioVolumeEl.addEventListener("input", applyRadioVolume);
  radioVolumeEl.addEventListener("change", applyRadioVolume);

  const commitRadioSeek = () => {
    const targetMs = clampInt(readNumber(radioSeekEl, 0), 0, Math.max(1, radioTrackDurationMs || 1));
    radioCurrentPositionMs = targetMs;
    syncRadioSeekUI(targetMs);
    if (!radioWidgetReady || !radioWidget) return;
    radioWidget.seekTo(targetMs);
  };
  const onRadioSeekInput = () => {
    radioSeekScrubbing = true;
    const targetMs = clampInt(readNumber(radioSeekEl, 0), 0, Math.max(1, radioTrackDurationMs || 1));
    syncRadioSeekUI(targetMs);
    if (radioWidgetReady && radioWidget) radioWidget.seekTo(targetMs);
  };
  const endRadioSeekScrub = () => {
    radioSeekScrubbing = false;
  };
  radioSeekEl.addEventListener("input", onRadioSeekInput);
  radioSeekEl.addEventListener("change", () => {
    commitRadioSeek();
    endRadioSeekScrub();
  });
  radioSeekEl.addEventListener("pointerdown", () => {
    radioSeekScrubbing = true;
  });
  radioSeekEl.addEventListener("mousedown", () => {
    radioSeekScrubbing = true;
  });
  radioSeekEl.addEventListener("touchstart", () => {
    radioSeekScrubbing = true;
  }, { passive: true });
  window.addEventListener("pointerup", endRadioSeekScrub);
  window.addEventListener("pointercancel", endRadioSeekScrub);
  window.addEventListener("mouseup", endRadioSeekScrub);
  window.addEventListener("touchend", endRadioSeekScrub, { passive: true });
  window.addEventListener("touchcancel", endRadioSeekScrub, { passive: true });

  const syncBurstDurationFromRange = () => {
    const secs = clamp(readNumber(radioBurstDurationEl, 1), 0.01, 1);
    radioBurstDurationEl.value = secs.toFixed(2);
    if (radioBurstDurationValEl) radioBurstDurationValEl.value = secs.toFixed(2);
  };
  const syncBurstDurationFromVal = () => {
    if (!radioBurstDurationValEl) return;
    const secs = clamp(readNumber(radioBurstDurationValEl, 1), 0.01, 1);
    radioBurstDurationValEl.value = secs.toFixed(2);
    radioBurstDurationEl.value = secs.toFixed(2);
  };
  radioBurstDurationEl.addEventListener("input", syncBurstDurationFromRange);
  radioBurstDurationEl.addEventListener("change", syncBurstDurationFromRange);
  if (radioBurstDurationValEl) {
    radioBurstDurationValEl.addEventListener("input", syncBurstDurationFromVal);
    radioBurstDurationValEl.addEventListener("change", syncBurstDurationFromVal);
  }

  bindGusanoInteractionSoundFx();
}

initRadioUI();

// -----------------------------
// Main UI (parametric model)
// -----------------------------
const statusEl = mustEl<HTMLDivElement>("status");
const statusTextEl = mustEl<HTMLSpanElement>("statusText");
const statusProgressFillEl = mustEl<HTMLDivElement>("statusProgressFill");
const uiShellEl = mustEl<HTMLDivElement>("ui");
const rebuildBtn = mustEl<HTMLButtonElement>("rebuild");
const modelLivePauseBtn = mustEl<HTMLButtonElement>("modelLivePauseBtn");
const titleStatsToggleBtn = mustEl<HTMLButtonElement>("titleStatsToggleBtn");
const controlsPanelEl = mustEl<HTMLDivElement>("controlsPanel");
const toolbarMinimizeEdgeBtnEl = mustEl<HTMLButtonElement>("toolbarMinimizeEdgeBtn");
const exportStlBtn = mustEl<HTMLButtonElement>("exportStl");
const exportStepBtn = mustEl<HTMLButtonElement>("exportStep");
const loadSettingsBtn = mustEl<HTMLButtonElement>("loadSettings");
const exportSettingsBtn = mustEl<HTMLButtonElement>("exportSettings");
const layersReferenceListEl = mustEl<HTMLDivElement>("layersReferenceList");
const layersModelVisibilityListEl = mustEl<HTMLDivElement>("layersModelVisibilityList");
const layersModelListEl = mustEl<HTMLDivElement>("layersModelList");
const layerSaveCurrentBtn = mustEl<HTMLButtonElement>("layerSaveCurrent");
const layerUpdateActiveBtn = mustEl<HTMLButtonElement>("layerUpdateActive");
const layerDeleteActiveBtn = mustEl<HTMLButtonElement>("layerDeleteActive");
const meshVertsEl = document.getElementById("meshVerts") as HTMLSpanElement | null;
const meshTrisEl = document.getElementById("meshTris") as HTMLSpanElement | null;
const modelXEl = mustEl<HTMLInputElement>("modelX");
const modelYEl = mustEl<HTMLInputElement>("modelY");
const modelZEl = mustEl<HTMLInputElement>("modelZ");
const modelMirrorXZEl = mustEl<HTMLInputElement>("modelMirrorXZ");
const modelRotXEl = mustEl<HTMLInputElement>("modelRotX");
const modelRotYEl = mustEl<HTMLInputElement>("modelRotY");
const modelRotEl = mustEl<HTMLInputElement>("modelRot");
const modelTransformResetBtn = mustEl<HTMLButtonElement>("modelTransformReset");
const toolbarPanelEl = mustEl<HTMLDivElement>("titleBlockPanel");
const titleStatsPanelEl = mustEl<HTMLDivElement>("titleStatsPanel");
const titleStatBuildMsEl = mustEl<HTMLSpanElement>("titleStatBuildMs");
const titleStatQueueEl = mustEl<HTMLSpanElement>("titleStatQueue");
const titleStatMeshMBEl = mustEl<HTMLSpanElement>("titleStatMeshMB");
const titleStatRebuildModeEl = mustEl<HTMLSpanElement>("titleStatRebuildMode");
const titleStatBuildCountEl = mustEl<HTMLSpanElement>("titleStatBuildCount");
const titleStatCameraDistEl = mustEl<HTMLSpanElement>("titleStatCameraDist");
const titleStatActivePartsEl = mustEl<HTMLSpanElement>("titleStatActiveParts");
const titleStatLastSourceEl = mustEl<HTMLSpanElement>("titleStatLastSource");

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
const sectionCutModeSectionEl = mustEl<HTMLInputElement>("sectionCutModeSection");
const sectionCutModePlanEl = mustEl<HTMLInputElement>("sectionCutModePlan");

const baseEnabledEl = mustEl<HTMLInputElement>("baseEnabled");
const toeAddProfileBEl = mustEl<HTMLInputElement>("toeAddProfileB");
const toeProfileBSectionEl = mustEl<HTMLElement>("toeProfileBSection");
const heelEnabledEl = mustEl<HTMLInputElement>("heelEnabled");
const heelMidCtrlEl = mustEl<HTMLInputElement>("heel_mid_ctrl");
const heelSweepEl = mustEl<HTMLInputElement>("heel_sweep");
const heelSweepRm3WrapEl = mustEl<HTMLElement>("heelSweepRm3Wrap");
const drGoodFilletEl = mustEl<HTMLInputElement>("dr_good_fillet");
const drGoodFilletDietWrapEl = mustEl<HTMLElement>("dr_good_fillet_diet_wrap");
const drGoodFilletDietEl = mustEl<HTMLInputElement>("dr_good_fillet_diet");
const bpFil1El = mustEl<HTMLInputElement>("bp_fil_1");
const shFil1El = mustEl<HTMLInputElement>("sh_fil_1");
const thFil1El = mustEl<HTMLInputElement>("th_fil_1");
const thFil2El = mustEl<HTMLInputElement>("th_fil_2");
const heelFil1El = mustEl<HTMLInputElement>("heel_fil_1");
const railMathCurrentEl = mustEl<HTMLInputElement>("rail_math_current");
const railMath2El = mustEl<HTMLInputElement>("rail_math_2");
const railMath3El = mustEl<HTMLInputElement>("rail_math_3");
const railMath4El = mustEl<HTMLInputElement>("rail_math_4");
const railMath5El = mustEl<HTMLInputElement>("rail_math_5");
const railMath6El = mustEl<HTMLInputElement>("rail_math_6");
const railMath7El = mustEl<HTMLInputElement>("rail_math_7");
const railMath8El = mustEl<HTMLInputElement>("rail_math_8");
const railMath9El = mustEl<HTMLInputElement>("rail_math_9");
const railMath10El = mustEl<HTMLInputElement>("rail_math_10");
const railMath5CullWrapEl = mustEl<HTMLElement>("railMath5CullWrap");
const railMath5AddbackWrapEl = mustEl<HTMLElement>("railMath5AddbackWrap");
const railMath6SubWrapEl = mustEl<HTMLElement>("railMath6SubWrap");
const heelRailMath3WrapEl = mustEl<HTMLElement>("heelRailMath3Wrap");
const heelRailMath4SubWrapEl = mustEl<HTMLElement>("heelRailMath4SubWrap");
const heelRailMath4bWrapEl = mustEl<HTMLElement>("heelRailMath4bWrap");
const railMath6aEl = mustEl<HTMLInputElement>("rail_math_6a");
const railMath6bEl = mustEl<HTMLInputElement>("rail_math_6b");
const railMath6cEl = mustEl<HTMLInputElement>("rail_math_6c");
const heelRailMath1El = mustEl<HTMLInputElement>("heel_rail_math_1");
const heelRailMath2El = mustEl<HTMLInputElement>("heel_rail_math_2");
const heelRailMath3El = mustEl<HTMLInputElement>("heel_rail_math_3");
const heelRailMath4El = mustEl<HTMLInputElement>("heel_rail_math_4");
const heelRailMath5El = mustEl<HTMLInputElement>("heel_rail_math_5");
const heelRailMath4aEl = mustEl<HTMLInputElement>("heel_rail_math_4a");
const heelRailMath4bEl = mustEl<HTMLInputElement>("heel_rail_math_4b");
const tagentProfileAEl = mustEl<HTMLInputElement>("tagent_profile_a");
const tagentProfileBEl = mustEl<HTMLInputElement>("tagent_profile_b");
const tagentProfileCEl = mustEl<HTMLInputElement>("tagent_profile_c");
const tagentProfileDEl = mustEl<HTMLInputElement>("tagent_profile_d");
const tagentDCutPerpEl = mustEl<HTMLInputElement>("tagent_d_cut_perp");
const tagentABpCutPerpEl = mustEl<HTMLInputElement>("tagent_a_bp_cut_perp");
const railMath5CullEl = mustEl<HTMLInputElement>("rail_math_5_cull");
const railMath5CullValEl = document.getElementById("rail_math_5_cullVal") as HTMLInputElement | null;
const railMath5AddbackEl = mustEl<HTMLInputElement>("rail_math_5_addback");
const railMath5AddbackValEl = document.getElementById("rail_math_5_addbackVal") as HTMLInputElement | null;
const heelRm3SweepEl = mustEl<HTMLInputElement>("heel_rm3_sweep");
const heelRm3SweepValEl = document.getElementById("heel_rm3_sweepVal") as HTMLInputElement | null;
const heelRm3BiasEl = mustEl<HTMLInputElement>("heel_rm3_bias");
const heelRm3BiasValEl = document.getElementById("heel_rm3_biasVal") as HTMLInputElement | null;
const heelRm3BlendEl = mustEl<HTMLInputElement>("heel_rm3_blend");
const heelRm3BlendValEl = document.getElementById("heel_rm3_blendVal") as HTMLInputElement | null;
const heelRm4bSweepEl = mustEl<HTMLInputElement>("heel_rm4b_sweep");
const heelRm4bSweepValEl = document.getElementById("heel_rm4b_sweepVal") as HTMLInputElement | null;
const heelRm4bBiasEl = mustEl<HTMLInputElement>("heel_rm4b_bias");
const heelRm4bBiasValEl = document.getElementById("heel_rm4b_biasVal") as HTMLInputElement | null;
const heelRm4bBlendEl = mustEl<HTMLInputElement>("heel_rm4b_blend");
const heelRm4bBlendValEl = document.getElementById("heel_rm4b_blendVal") as HTMLInputElement | null;
const heelSweepRm3SweepEl = mustEl<HTMLInputElement>("heel_sweep_rm3_sweep");
const heelSweepRm3SweepValEl = document.getElementById("heel_sweep_rm3_sweepVal") as HTMLInputElement | null;
const heelSweepRm3BiasEl = mustEl<HTMLInputElement>("heel_sweep_rm3_bias");
const heelSweepRm3BiasValEl = document.getElementById("heel_sweep_rm3_biasVal") as HTMLInputElement | null;
const heelSweepRm3BlendEl = mustEl<HTMLInputElement>("heel_sweep_rm3_blend");
const heelSweepRm3BlendValEl = document.getElementById("heel_sweep_rm3_blendVal") as HTMLInputElement | null;

const tolEl = mustEl<HTMLInputElement>("tolerance");
const tolVal = mustEl<HTMLInputElement>("toleranceVal");
const debounceMsEl = mustEl<HTMLInputElement>("debounceMs");
const rebuildAsOneEl = mustEl<HTMLInputElement>("rebuildAsOne");

function setStatus(msg: string) {
  titleStatCurrentStatus = msg;
  setStatusText(msg);
  updateStatusProgressFromMessage(msg);
  if (
    bootLoadingActive &&
    (isSuccessLikeStatus(msg) ||
      msg === "model disabled" ||
      msg.startsWith("error:") ||
      msg.startsWith("worker error:") ||
      msg === "worker messageerror")
  ) {
    bootLoadingActive = false;
    bootLoadingOverlayEl?.classList.add("hidden");
    bootLoadingOverlayEl?.setAttribute("aria-hidden", "true");
  }
  log(`status: ${msg}`);
  syncTitleStatsPanel();
}
function setMiniMeshStats(verts: number | null, tris: number | null) {
  if (meshVertsEl) meshVertsEl.textContent = verts == null ? "-" : verts.toLocaleString();
  if (meshTrisEl) meshTrisEl.textContent = tris == null ? "-" : tris.toLocaleString();
}
function applyGeneratedModelTransformUIToViewer() {
  const dx = clamp(readNumber(modelXEl, 0), -300, 300);
  const dy = clamp(readNumber(modelYEl, 0), -300, 300);
  const dz = clamp(readNumber(modelZEl, 0), -300, 300);
  const rx = clamp(readNumber(modelRotXEl, 0), -180, 180);
  const ry = clamp(readNumber(modelRotYEl, 0), -180, 180);
  const rz = clamp(readNumber(modelRotEl, 0), -180, 180);
  viewer.setParamMeshOffset(dx, dy, dz);
  viewer.setParamMeshMirrorXZ(!!modelMirrorXZEl.checked);
  viewer.setShoeMirrorXZ(!!modelMirrorXZEl.checked);
  viewer.setParamMeshRotationDeg(rx, ry, rz);
}
function resetGeneratedModelTransformUI() {
  const els = [modelXEl, modelYEl, modelZEl, modelRotXEl, modelRotYEl, modelRotEl];
  for (const el of els) {
    el.value = "0";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  modelMirrorXZEl.checked = false;
  modelMirrorXZEl.dispatchEvent(new Event("change", { bubbles: true }));
  applyGeneratedModelTransformUIToViewer();
}
function isModelEnabled() {
  return !!modelEnabledEl.checked;
}
let liveAutoRebuildPaused = false;
let toolbarCollapsed = false;
let titleStatsOpen = false;
let titleStatBuildCount = 0;
let titleStatLastBuildDurationMs: number | null = null;
let titleStatMeshBytesApprox: number | null = null;
let titleStatCurrentBusy = false;
let titleStatCurrentStatus = "idle";
let titleStatLastRebuildSource = "startup";
let lastBuildStartAtMs: number | null = null;
let statusProgressActive = false;
let statusProgressPct = 0;
let statusProgressClearTimer: number | null = null;
let toolbarMinimizeEdgeBtnPositionRaf = 0;
let lastVisibleUiRectForToolbarBtn: DOMRect | null = null;

function clearStatusProgressTimer() {
  if (statusProgressClearTimer == null) return;
  window.clearTimeout(statusProgressClearTimer);
  statusProgressClearTimer = null;
}

function clampStatusProgressPct(pct: number) {
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function renderStatusBarState() {
  statusEl.classList.toggle("progressActive", statusProgressActive);
  statusProgressFillEl.style.width = `${clampStatusProgressPct(statusProgressPct)}%`;
}

function setStatusText(msg: string) {
  statusTextEl.textContent = msg;
}

function setStatusProgress(pct: number, active: boolean) {
  clearStatusProgressTimer();
  statusProgressPct = clampStatusProgressPct(pct);
  statusProgressActive = active;
  renderStatusBarState();
}

function resetStatusProgress() {
  setStatusProgress(0, false);
}

function completeStatusProgress() {
  clearStatusProgressTimer();
  statusProgressPct = 100;
  statusProgressActive = true;
  renderStatusBarState();
  statusProgressClearTimer = window.setTimeout(() => {
    statusProgressClearTimer = null;
    if (titleStatCurrentBusy) return;
    resetStatusProgress();
  }, 120);
}

function mapStatusMessageToProgress(msg: string): number | null {
  const s = msg.trim().toLowerCase();

  if (s === "building...") return 5;
  if (s.startsWith("exporting stl")) return 10;
  if (s.startsWith("exporting step")) return 10;
  if (s.startsWith("loading opencascade")) return 12;
  if (s.startsWith("opencascade ready")) return 18;

  if (s.startsWith("building baseplate")) return 28;
  if (s.startsWith("building toe")) return 42;
  if (s.startsWith("building heel kick")) return 56;

  if (s.startsWith("meshing base")) return 68;
  if (s.startsWith("meshing toe")) return 80;
  if (s.startsWith("meshing heel")) return 90;

  if (s.includes("preview mesh merged")) return 96;
  if (s.startsWith("ready (nothing enabled)")) return 100;
  if (s === "ready") return 100;
  if (s.startsWith("downloaded:")) return 100;

  return null;
}

function isSuccessLikeStatus(msg: string) {
  const s = msg.trim().toLowerCase();
  return s === "ready" || s.startsWith("ready (") || s.startsWith("downloaded:");
}

function updateStatusProgressFromMessage(msg: string) {
  const mapped = mapStatusMessageToProgress(msg);

  if (titleStatCurrentBusy) {
    const nextPct =
      mapped != null
        ? Math.max(statusProgressPct, mapped)
        : statusProgressPct > 0
          ? statusProgressPct
          : 15;
    setStatusProgress(nextPct, true);
    return;
  }

  if (mapped === 100 && isSuccessLikeStatus(msg)) {
    completeStatusProgress();
    return;
  }

  resetStatusProgress();
}
function isLiveAutoRebuildEnabled() {
  return !liveAutoRebuildPaused;
}
function positionToolbarMinimizeEdgeButton() {
  const uiRect = uiShellEl.getBoundingClientRect();
  if (!toolbarCollapsed && uiRect.width > 0 && uiRect.height > 0) {
    lastVisibleUiRectForToolbarBtn = uiRect;
  }
  const btnW = toolbarMinimizeEdgeBtnEl.offsetWidth || 28;
  const btnH = toolbarMinimizeEdgeBtnEl.offsetHeight || 28;
  const maxLeft = Math.max(8, window.innerWidth - btnW - 8);
  const maxTop = Math.max(8, window.innerHeight - btnH - 8);
  let targetLeft = 16;
  let targetTop = 110;
  if (toolbarCollapsed) {
    const rect = lastVisibleUiRectForToolbarBtn;
    const dockLeftBase = rect ? Math.round(rect.left - 8) : 8;
    const dockTopBase = rect ? Math.round(rect.top + 20) : 16;
    targetLeft = Math.max(8, Math.min(dockLeftBase, maxLeft));
    targetTop = Math.max(8, Math.min(dockTopBase, maxTop));
  } else {
    const edgeInset = 14;
    const unclampedLeft = Math.round(uiRect.right - edgeInset);
    const maxTopAnchor = Math.max(18, uiRect.height - btnH - 10);
    const anchoredTop = Math.max(18, Math.min(110, maxTopAnchor));
    const unclampedTop = Math.round(uiRect.top + anchoredTop);
    targetLeft = Math.max(8, Math.min(unclampedLeft, maxLeft));
    targetTop = Math.max(8, Math.min(unclampedTop, maxTop));
  }
  toolbarMinimizeEdgeBtnEl.style.left = `${targetLeft}px`;
  toolbarMinimizeEdgeBtnEl.style.top = `${targetTop}px`;
}
function scheduleToolbarMinimizeEdgeButtonPosition() {
  if (toolbarMinimizeEdgeBtnPositionRaf) return;
  toolbarMinimizeEdgeBtnPositionRaf = window.requestAnimationFrame(() => {
    toolbarMinimizeEdgeBtnPositionRaf = 0;
    positionToolbarMinimizeEdgeButton();
  });
}
function setToolbarCollapsed(collapsed: boolean) {
  toolbarCollapsed = collapsed;
  if (collapsed) {
    setTitleStatsOpen(false);
  }
  const active = collapsed;
  document.body.classList.toggle("toolbar-collapsed", active);
  toolbarMinimizeEdgeBtnEl.textContent = active ? "▶" : "◀";
  toolbarMinimizeEdgeBtnEl.setAttribute("aria-pressed", active ? "true" : "false");
  toolbarMinimizeEdgeBtnEl.setAttribute("aria-label", active ? "Show toolbar" : "Hide toolbar");
  toolbarMinimizeEdgeBtnEl.title = active ? "Show toolbar" : "Hide toolbar";
  controlsPanelEl.setAttribute("aria-hidden", active ? "true" : "false");
  uiShellEl.setAttribute("aria-hidden", active ? "true" : "false");
  scheduleToolbarMinimizeEdgeButtonPosition();
}
function canAutoRebuild() {
  return isModelEnabled() && isLiveAutoRebuildEnabled();
}
function formatTitleMeshMB(bytes: number | null) {
  if (bytes == null || !(bytes >= 0)) return "-";
  return (bytes / (1024 * 1024)).toFixed(2);
}
function readActivePartsSummary() {
  return `Base:${baseEnabledEl.checked ? "on" : "off"} ToeB:${toeAddProfileBEl.checked ? "on" : "off"} Heel:${heelEnabledEl.checked ? "on" : "off"}`;
}
function syncTitleStatsPanel() {
  titleStatBuildMsEl.textContent = titleStatLastBuildDurationMs == null ? "-" : String(Math.round(titleStatLastBuildDurationMs));
  titleStatQueueEl.textContent = `${titleStatCurrentBusy ? "busy" : "idle"}: ${titleStatCurrentStatus}`;
  titleStatMeshMBEl.textContent = formatTitleMeshMB(titleStatMeshBytesApprox);
  titleStatRebuildModeEl.textContent = isLiveAutoRebuildEnabled() ? "Live" : "Paused";
  titleStatBuildCountEl.textContent = String(titleStatBuildCount);
  titleStatCameraDistEl.textContent = "-";
  titleStatActivePartsEl.textContent = readActivePartsSummary();
  titleStatLastSourceEl.textContent = titleStatLastRebuildSource;
}
function setTitleStatsOpen(open: boolean) {
  if (toolbarPanelEl.classList.contains("titleOnly")) open = false;
  const wasOpen = titleStatsOpen;
  titleStatsOpen = open;
  toolbarPanelEl.classList.toggle("statsExpanded", open);
  titleStatsPanelEl.classList.toggle("open", open);
  titleStatsPanelEl.setAttribute("aria-hidden", open ? "false" : "true");
  titleStatsToggleBtn.textContent = open ? "Hide Stats" : "Show Stats";
  titleStatsToggleBtn.setAttribute("aria-pressed", open ? "true" : "false");
  titleStatsToggleBtn.title = open ? "Hide stats" : "Show stats";
  if (open && !wasOpen) {
    const desiredH = Math.ceil(toolbarPanelEl.scrollHeight - 70);
    if (desiredH > 0) {
      toolbarPanelEl.style.height = `${desiredH}px`;
    }
  }
  if (!open) {
    // Drop any manual resize height once stats are closed/collapsed.
    toolbarPanelEl.style.removeProperty("height");
  }
}
function syncTitleStatsVisibilityWithToolbarCollapse() {
  if (toolbarPanelEl.classList.contains("titleOnly")) {
    setTitleStatsOpen(false);
  }
}
function setLastRebuildSource(source: string) {
  titleStatLastRebuildSource = source;
  syncTitleStatsPanel();
}
function markParamChangeRebuildSource() {
  setLastRebuildSource("param-change");
}
function setBusy(busy: boolean) {
  const modelOn = isModelEnabled();
  titleStatCurrentBusy = busy;
  if (busy) {
    // Start all busy flows with a visible minimum fill.
    setStatusProgress(Math.max(statusProgressPct, 5), true);
  } else if (!isSuccessLikeStatus(titleStatCurrentStatus)) {
    resetStatusProgress();
  }
  rebuildBtn.disabled = busy || !modelOn;
  exportStlBtn.disabled = busy || !modelOn;
  exportStepBtn.disabled = busy || !modelOn;
  syncTitleStatsPanel();
}

function syncToeProfileBUI() {
  toeProfileBSectionEl.style.display = toeAddProfileBEl.checked ? "" : "none";
}

function syncRailMathUI() {
  const showRailMath5 = readRailMathMode() === 5;
  const showRailMath6 = readRailMathMode() === 6;
  const showHeelRailMath4 = heelRailMath4El.checked;
  const showHeelRailMath4b = showHeelRailMath4 && heelRailMath4bEl.checked;
  railMath5CullWrapEl.style.display = showRailMath5 ? "" : "none";
  railMath5AddbackWrapEl.style.display = showRailMath5 ? "" : "none";
  railMath6SubWrapEl.style.display = showRailMath6 ? "" : "none";
  heelRailMath3WrapEl.style.display = heelRailMath3El.checked ? "" : "none";
  heelSweepRm3WrapEl.style.display = heelSweepEl.checked ? "" : "none";
  heelRailMath4SubWrapEl.style.display = showHeelRailMath4 ? "" : "none";
  heelRailMath4bWrapEl.style.display = showHeelRailMath4b ? "" : "none";
  if (showRailMath6 && !railMath6aEl.checked && !railMath6bEl.checked && !railMath6cEl.checked) {
    railMath6aEl.checked = true;
  }
  if (showHeelRailMath4 && !heelRailMath4aEl.checked && !heelRailMath4bEl.checked) {
    heelRailMath4aEl.checked = true;
  }
}

let syncingHeelSweepRm3 = false;
let syncingHeelRm3Mirrors = false;

function syncHeelRm3MirrorValuesFromCanonical() {
  if (syncingHeelRm3Mirrors) return;
  syncingHeelRm3Mirrors = true;
  heelSweepRm3SweepEl.value = heelRm3SweepEl.value;
  if (heelSweepRm3SweepValEl) heelSweepRm3SweepValEl.value = heelRm3SweepEl.value;
  heelSweepRm3BiasEl.value = heelRm3BiasEl.value;
  if (heelSweepRm3BiasValEl) heelSweepRm3BiasValEl.value = heelRm3BiasEl.value;
  heelSweepRm3BlendEl.value = heelRm3BlendEl.value;
  if (heelSweepRm3BlendValEl) heelSweepRm3BlendValEl.value = heelRm3BlendEl.value;
  syncingHeelRm3Mirrors = false;
}

function pushSweepRm3MirrorToCanonical(
  srcRange: HTMLInputElement,
  dstRange: HTMLInputElement,
  dstVal: HTMLInputElement | null,
  eventType: "input" | "change"
) {
  if (syncingHeelRm3Mirrors) return;
  syncingHeelRm3Mirrors = true;
  dstRange.value = srcRange.value;
  if (dstVal) dstVal.value = srcRange.value;
  syncingHeelRm3Mirrors = false;
  dstRange.dispatchEvent(new Event(eventType, { bubbles: true }));
}

function syncHeelSweepAndRailMath3FromSweep() {
  if (syncingHeelSweepRm3) return;
  syncingHeelSweepRm3 = true;
  if (heelSweepEl.checked) {
    heelRailMath3El.checked = true;
    [heelRailMath1El, heelRailMath2El, heelRailMath4El, heelRailMath5El].forEach((el) => (el.checked = false));
  } else if (heelRailMath3El.checked) {
    heelRailMath3El.checked = false;
    heelRailMath1El.checked = true;
    [heelRailMath2El, heelRailMath4El, heelRailMath5El].forEach((el) => (el.checked = false));
  }
  syncingHeelSweepRm3 = false;
}

function syncHeelSweepFromHeelRailMathSelection() {
  if (syncingHeelSweepRm3) return;
  syncingHeelSweepRm3 = true;
  heelSweepEl.checked = heelRailMath3El.checked;
  syncingHeelSweepRm3 = false;
}

function wireParamValMirror(valEl: HTMLInputElement | null, rangeEl: HTMLInputElement) {
  if (!valEl) return;
  valEl.addEventListener("input", () => {
    rangeEl.value = valEl.value;
    rangeEl.dispatchEvent(new Event("input", { bubbles: true }));
  });
  valEl.addEventListener("change", () => {
    rangeEl.value = valEl.value;
    rangeEl.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function setupExclusiveCheckboxGroup(group: HTMLInputElement[], defaultEl: HTMLInputElement) {
  let syncing = false;
  const isRailMathGroup = group.some((g) => g.id.startsWith("rail_math_"));
  const isHeelRailMathGroup = group.some((g) => g.id.startsWith("heel_rail_math_"));
  const apply = (active: HTMLInputElement) => {
    syncing = true;
    for (const el of group) el.checked = el === active;
    syncing = false;
  };
  for (const el of group) {
    el.addEventListener("change", () => {
      if (syncing) return;
      if (el.checked) {
        apply(el);
      } else {
        apply(defaultEl);
      }
      if (isHeelRailMathGroup) syncHeelSweepFromHeelRailMathSelection();
      if (isRailMathGroup || isHeelRailMathGroup) syncRailMathUI();
      if (!canAutoRebuild()) return;
      markParamChangeRebuildSource();
      if (isRailMathGroup) {
        if (rebuildAsOneEl.checked) {
          crossRefitPendingManual = false;
          return rebuild();
        }
        crossRefitPendingManual = true;
        return rebuild({ freezeHeelRefit: true });
      }
      rebuildDebounced();
    });
  }
  const initiallyChecked = group.find((el) => el.checked) ?? defaultEl;
  apply(initiallyChecked);
}

function readRailMathMode(): number {
  if (railMath10El.checked) return 10;
  if (railMath9El.checked) return 9;
  if (railMath8El.checked) return 8;
  if (railMath7El.checked) return 7;
  if (railMath6El.checked) return 6;
  if (railMath5El.checked) return 5;
  if (railMath2El.checked) return 2;
  if (railMath3El.checked) return 3;
  if (railMath4El.checked) return 4;
  return 1;
}

function readHeelRailMathMode(): number {
  if (heelRailMath5El.checked) return 5;
  if (heelRailMath4El.checked) return 4;
  if (heelRailMath3El.checked) return 3;
  if (heelRailMath2El.checked) return 2;
  return 1;
}

function rebuildHeelToeBasePreset() {
  if (!canAutoRebuild()) return;
  setLastRebuildSource("preset");
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild();
}

function applyDrGoodDietPreset(isDiet: boolean) {
  // UI-only hook for preset variations.
  // `isDiet === true`  -> default Dr Good preset
  // `isDiet === false` -> non-diet variant
  if (isDiet) {
    heelMidCtrlEl.checked = true;
    heelSweepEl.checked = false;
    return;
  }
  heelMidCtrlEl.checked = false;
  heelSweepEl.checked = true;
  const heelCdMidEl = document.getElementById("heel_cd_mid") as HTMLInputElement | null;
  const heelCdMidValEl = document.getElementById("heel_cd_midVal") as HTMLInputElement | null;
  if (heelCdMidEl) {
    const cur = Number(heelCdMidEl.value) || 0;
    if (cur < 10) {
      heelCdMidEl.value = "10";
      if (heelCdMidValEl) heelCdMidValEl.value = "10";
    }
  }
}

let drGoodPresetReady = false;

function syncDrGoodDietUIOnLoad() {
  if (!drGoodFilletEl.checked) {
    drGoodFilletDietWrapEl.style.display = "none";
    drGoodFilletDietEl.checked = true;
    return;
  }
  drGoodFilletDietWrapEl.style.display = "";
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
  "bp_sh_ang",
  "bp_sh_dia",
  "bp_sh_washer",
  "bp_sh_slot",
  "bp_sh_dist",
  "bp_sh_ang2",
  "bp_sh_off2",

  // Toe: shared
  "toe_thk",

  // Toe A
  "tagent_a_offset_rot",
  "tagent_a_midpoint",
  "tagent_a_placeholder_1",
  "tagent_a_placeholder_2",
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
  "rail_math_5_cull",
  "rail_math_5_addback",

  // Heel
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
  "heel_f1",
  "heel_f2",

  // Fillets
  "fil_1",
  "fil_2",
  "fil_3",
  "fil_4",
  "fil_5",
  "sh_fil_1_r",
  "th_fil_1_r",
  "th_fil_2_r",
  "heel_fil_1_r",
  "heel_fil_2_r",
  "bp_fil_1_r",
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
// Treat a non-zero authored HTML default as an intentional value so startup auto-fill
// doesn't overwrite it on the first rebuild.
let toeBCMidUserTouched = Number(toeBCMidEl.value) !== 0;

toeBCMidEl.addEventListener("input", () => {
  if (Number(toeBCMidEl.value) !== 0) toeBCMidUserTouched = true;
});

function readParams(): ModelParams {
  enforceHeelHeightMaxFromToeC();
  const p: ModelParams = {};
  for (let i = 0; i < paramIds.length; i++) {
    p[paramIds[i]] = readNumber(paramEls[i], 0);
  }
  p.bp_fil_1 = bpFil1El.checked ? 1 : 0;
  p.sh_fil_1 = shFil1El.checked ? 1 : 0;
  p.th_fil_1 = thFil1El.checked ? 1 : 0;
  p.th_fil_2 = thFil2El.checked ? 1 : 0;
  p.heel_fil_1 = heelFil1El.checked ? 1 : 0;
  p.heel_fil_2 = 1;
  p.toe_add_profile_b = toeAddProfileBEl.checked ? 1 : 0;
  p.rail_math_mode = readRailMathMode();
  p.rail_math_6a = railMath6aEl.checked ? 1 : 0;
  p.rail_math_6b = railMath6bEl.checked ? 1 : 0;
  p.rail_math_6c = railMath6cEl.checked ? 1 : 0;
  p.heel_rail_math_mode = readHeelRailMathMode();
  p.heel_rail_math_4a = heelRailMath4aEl.checked ? 1 : 0;
  p.heel_rail_math_4b = heelRailMath4bEl.checked ? 1 : 0;
  p.tagent_profile_a = tagentProfileAEl.checked ? 1 : 0;
  p.tagent_profile_b = tagentProfileBEl.checked ? 1 : 0;
  p.tagent_profile_c = tagentProfileCEl.checked ? 1 : 0;
  p.tagent_profile_d = tagentProfileDEl.checked ? 1 : 0;
  p.tagent_d_cut_perp = tagentDCutPerpEl.checked ? 1 : 0;
  p.tagent_a_bp_cut_perp = tagentABpCutPerpEl.checked ? 1 : 0;
  p.toeBEnabled = toeAddProfileBEl.checked ? 1 : 0; // compat routing
  p.toeCEnabled = 1; // C always on
  if (!toeAddProfileBEl.checked) p.toe_ab_mid = 0;
  p.heel_mid_ctrl = heelMidCtrlEl.checked ? 1 : 0;
  p.heel_sweep = heelSweepEl.checked ? 1 : 0;
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

let syncingSectionCutModeUI = false;

function syncSectionCutModeRadiosFromCheckbox() {
  if (syncingSectionCutModeUI) return;
  syncingSectionCutModeUI = true;
  const isPlan = !!sectionCutZswitchEl.checked;
  sectionCutModePlanEl.checked = isPlan;
  sectionCutModeSectionEl.checked = !isPlan;
  syncingSectionCutModeUI = false;
}

function syncSectionCutCheckboxFromRadios() {
  if (syncingSectionCutModeUI) return;
  syncingSectionCutModeUI = true;
  const nextPlan = !!sectionCutModePlanEl.checked;
  const changed = sectionCutZswitchEl.checked !== nextPlan;
  sectionCutZswitchEl.checked = nextPlan;
  syncingSectionCutModeUI = false;
  if (changed) {
    sectionCutZswitchEl.dispatchEvent(new Event("change", { bubbles: true }));
  }
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

function profileHandlePointsWorldAtStation(
  st: { pt: Pt; tan: Pt },
  endX: number,
  endZ: number,
  p1s: number,
  p3s: number,
  endAngDeg: number
): XYZ[] {
  const P1: Pt = { x: 0, y: clamp(p1s, 0, 10000) };
  const P3: Pt = { x: endX, y: endZ };
  const span = Math.hypot(P3.x, P3.y);
  const dir = dirFromDeg2(endAngDeg - 180);
  const p3 = clamp(p3s, 0, Math.max(1, span * 1.5));
  let P2: Pt = { x: P3.x - dir.x * p3, y: P3.y - dir.y * p3 };
  P2 = { x: P2.x, y: Math.max(0, P2.y) };

  // A markers map to [P1, P2, P3] to preserve the existing 3-sphere visualizer pattern.
  return [P1, P2, P3].map((p) => localToWorldAtStation(st, p));
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

  // Debug overlay (reuses existing arc-point groups):
  // A/B/C = Profile handle markers (P1/P2/P3), Heel = inner anchors
  const toeThk = clamp(num(p.toe_thk, 12), 0.2, 80);
  const A_enda = clamp(num(p.toe_a_enda, 0), -180, 180);
  const B_enda = clamp(num(p.toe_b_enda, 0), -180, 180);
  const C_enda = clamp(num(p.toe_c_enda, 0), -180, 180);

  const A_inW = localToWorldAtStation(stA, toeInnerEndLocal(A_endX, A_endZ, A_arcX / sx, A_arcZ, A_enda, toeThk));
  const B_inW = localToWorldAtStation(stB, toeInnerEndLocal(B_endX, B_endZ, B_arcX / sx, B_arcZ, B_enda, toeThk));
  const C_inW = localToWorldAtStation(stC, toeInnerEndLocal(C_endX, C_endZ, C_arcX / sx, C_arcZ, C_enda, toeThk));
  const A_handlePtsW = profileHandlePointsWorldAtStation(stA, A_endX, A_endZ, A_arcX / sx, A_arcZ, A_enda);
  const B_handlePtsW = profileHandlePointsWorldAtStation(stB, B_endX, B_endZ, B_arcX / sx, B_arcZ, B_enda);
  const C_handlePtsW = profileHandlePointsWorldAtStation(stC, C_endX, C_endZ, C_arcX / sx, C_arcZ, C_enda);

  if (vizAArcPtsEl.checked) viewer.setAArcPoints(A_handlePtsW);
  if (vizBArcPtsEl.checked) viewer.setBArcPoints(B_handlePtsW);
  if (vizCArcPtsEl.checked) viewer.setCArcPoints(C_handlePtsW);
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

function downloadTextFile(text: string, filename: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type SettingsValue = string | boolean;
type SettingsSnapshot = {
  kind: "parahook-settings";
  version: 1;
  exportedAt: string;
  inputs: Record<string, SettingsValue>;
};

type CachedModelLayer = {
  id: string;
  name: string;
  snapshot: SettingsSnapshot;
  createdAt: string;
  updatedAt: string;
};

type LayersState = {
  modelLayers: CachedModelLayer[];
  activeModelLayerId: string | null;
};

const layersState: LayersState = {
  modelLayers: [],
  activeModelLayerId: null,
};
let nextParahookLayerCounter = 1;
let nextLoadedParahookLayerCounter = 1;

function collectSettingsSnapshot(): SettingsSnapshot {
  const inputs: Record<string, SettingsValue> = {};
  const allInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input[id]"));

  for (const el of allInputs) {
    if (!el.id) continue;
    if (el.id.startsWith("radio")) continue; // keep music player state out of settings snapshots
    if (el.id.endsWith("Val")) continue; // mirrored numeric boxes
    if (el.type === "file") continue;
    if (el.type === "checkbox" || el.type === "radio") {
      inputs[el.id] = !!el.checked;
    } else {
      inputs[el.id] = String(el.value ?? "");
    }
  }

  return {
    kind: "parahook-settings",
    version: 1,
    exportedAt: new Date().toISOString(),
    inputs,
  };
}

function normalizeExclusiveChecks(group: HTMLInputElement[], defaultEl: HTMLInputElement) {
  const active = group.find((el) => el.checked) ?? defaultEl;
  for (const el of group) el.checked = el === active;
}

function syncTagentProfileControlVisibility() {
  const aWrap = document.getElementById("tagentProfileAControls") as HTMLElement | null;
  const dWrap = document.getElementById("tagentProfileDControls") as HTMLElement | null;
  if (aWrap) aWrap.style.display = tagentProfileAEl.checked ? "none" : "";
  if (dWrap) dWrap.style.display = tagentProfileDEl.checked ? "none" : "";
}

function applySettingsSnapshot(snapshot: SettingsSnapshot) {
  const entries = Object.entries(snapshot.inputs ?? {});
  for (const [id, raw] of entries) {
    if (id.startsWith("radio")) continue;
    const el = document.getElementById(id);
    if (!(el instanceof HTMLInputElement)) continue;
    if (el.type === "file") continue;

    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = !!raw;
      continue;
    }

    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
      el.value = String(raw);
      const pairedVal = document.getElementById(`${id}Val`);
      if (pairedVal instanceof HTMLInputElement) pairedVal.value = el.value;
    }
  }

  // Preserve imported toe_bc_mid instead of letting auto-mode overwrite it on rebuild.
  if (Object.prototype.hasOwnProperty.call(snapshot.inputs, "toe_bc_mid")) {
    const v = Number((snapshot.inputs as Record<string, unknown>).toe_bc_mid);
    toeBCMidUserTouched = Number.isFinite(v) && v !== 0;
  }

  normalizeExclusiveChecks(
    [
      railMathCurrentEl,
      railMath2El,
      railMath3El,
      railMath4El,
      railMath5El,
      railMath6El,
      railMath7El,
      railMath8El,
      railMath9El,
      railMath10El,
    ],
    railMathCurrentEl
  );
  normalizeExclusiveChecks([railMath6aEl, railMath6bEl, railMath6cEl], railMath6aEl);
  normalizeExclusiveChecks([heelRailMath4aEl, heelRailMath4bEl], heelRailMath4aEl);
  normalizeExclusiveChecks(
    [heelRailMath1El, heelRailMath2El, heelRailMath3El, heelRailMath4El, heelRailMath5El],
    heelRailMath1El
  );

  if (heelSweepEl.checked) {
    syncHeelSweepAndRailMath3FromSweep();
  } else {
    syncHeelSweepFromHeelRailMathSelection();
  }

  syncSectionCutModeRadiosFromCheckbox();
  syncToeProfileBUI();
  syncRailMathUI();
  syncDrGoodDietUIOnLoad();
  syncTagentProfileControlVisibility();
  syncHeelRm3MirrorValuesFromCanonical();
  syncLabels();

  applyHookUIToViewer();
  applyHookTransformUIToViewer();
  applyFootpadUIToViewer();
  applyShoeUIToViewer();
  applySectionCutUIToViewer();
  updateBaseplateViz();
  updateArcViz();
}

function applySettingsSnapshotAndRebuild(snapshot: SettingsSnapshot) {
  cancelPendingRebuild();
  crossRefitPendingManual = false;
  applySettingsSnapshot(snapshot);
  lastSig = "";
  applyModelEnabledState();
}

type ReferenceLayerKind =
  | "shoe"
  | "footpad"
  | "control-point-viz"
  | "baseplate-viz"
  | "profile-a-viz"
  | "profile-b-viz"
  | "profile-c-viz";

type ReferenceLayerDef = {
  kind: ReferenceLayerKind;
  label: string;
  isOn: () => boolean;
  toggle: () => void;
};

const topReferenceLayerDefs: ReferenceLayerDef[] = [
  {
    kind: "shoe",
    label: "Shoe",
    isOn: () => !!shoeEnabledEl.checked,
    toggle: () => {
      shoeEnabledEl.checked = !shoeEnabledEl.checked;
      shoeEnabledEl.dispatchEvent(new Event("change", { bubbles: true }));
    },
  },
  {
    kind: "footpad",
    label: "Footpad",
    isOn: () => !!(footpad1EnabledEl.checked || footpad2EnabledEl.checked || footpad3EnabledEl.checked),
    toggle: () => {
      const anyOn = !!(footpad1EnabledEl.checked || footpad2EnabledEl.checked || footpad3EnabledEl.checked);
      const next = !anyOn;
      [footpad1EnabledEl, footpad2EnabledEl, footpad3EnabledEl].forEach((el) => {
        el.checked = next;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      });
    },
  },
];

let controlPointVizGroupOpen = false;

function setCheckboxChecked(el: HTMLInputElement, next: boolean) {
  if (el.checked === next) return;
  el.checked = next;
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

const controlPointVizChildDefs: ReferenceLayerDef[] = [
  {
    kind: "baseplate-viz",
    label: "Baseplate control points",
    isOn: () => !!vizBasePtsEl.checked,
    toggle: () => setCheckboxChecked(vizBasePtsEl, !vizBasePtsEl.checked),
  },
  {
    kind: "profile-a-viz",
    label: "Profile A control handles",
    isOn: () => !!vizAArcPtsEl.checked,
    toggle: () => setCheckboxChecked(vizAArcPtsEl, !vizAArcPtsEl.checked),
  },
  {
    kind: "profile-b-viz",
    label: "Profile B control handles",
    isOn: () => !!vizBArcPtsEl.checked,
    toggle: () => setCheckboxChecked(vizBArcPtsEl, !vizBArcPtsEl.checked),
  },
  {
    kind: "profile-c-viz",
    label: "Profile C control handles",
    isOn: () => !!vizCArcPtsEl.checked,
    toggle: () => setCheckboxChecked(vizCArcPtsEl, !vizCArcPtsEl.checked),
  },
];

function toggleControlPointVizGroup() {
  const next = !controlPointVizGroupOpen;
  controlPointVizGroupOpen = next;
  renderLayersUI();

  setCheckboxChecked(vizBasePtsEl, next);
  setCheckboxChecked(vizAArcPtsEl, next);
  setCheckboxChecked(vizBArcPtsEl, next);
  setCheckboxChecked(vizCArcPtsEl, next);

  syncReferenceLayerRowsFromCheckboxes();
}

const controlPointVizParentDef: ReferenceLayerDef = {
  kind: "control-point-viz",
  label: "Control point Viz",
  isOn: () => controlPointVizGroupOpen,
  toggle: () => toggleControlPointVizGroup(),
};

function getAllReferenceLayerDefsForUI(): ReferenceLayerDef[] {
  return [...topReferenceLayerDefs, controlPointVizParentDef, ...controlPointVizChildDefs];
}

function getReferenceLayerDef(kind: ReferenceLayerKind): ReferenceLayerDef | undefined {
  return getAllReferenceLayerDefsForUI().find((d) => d.kind === kind);
}

function nextParahookLayerIndex(): number {
  return nextParahookLayerCounter++;
}

function nextParahookLayerName(): string {
  return `parahook_${nextParahookLayerIndex()}`;
}

function nextLoadedParahookLayerName(): string {
  return `loaded Parahook_${nextLoadedParahookLayerCounter++}`;
}

function getActiveModelLayerIndex(): number {
  return layersState.modelLayers.findIndex((l) => l.id === layersState.activeModelLayerId);
}

function getActiveModelLayer(): CachedModelLayer | null {
  const i = getActiveModelLayerIndex();
  return i >= 0 ? layersState.modelLayers[i] : null;
}

function getCurrentGeneratedModelLabel(): string {
  const active = getActiveModelLayer();
  return active ? active.name.replace(/^parahook_/, "Parahook_") : "unsaved Parahook_1";
}

function toggleReferenceVisibility(kind: ReferenceLayerKind) {
  const def = getReferenceLayerDef(kind);
  if (!def) return;
  def.toggle();
}

function syncReferenceLayerRowsFromCheckboxes() {
  for (const def of getAllReferenceLayerDefsForUI()) {
    const row = layersReferenceListEl.querySelector<HTMLElement>(`.layerRow.ref[data-ref-kind="${def.kind}"]`);
    const eyeBtn = row?.querySelector<HTMLButtonElement>(".eyeBtn");
    const on = def.isOn();
    row?.classList.toggle("off", !on);
    eyeBtn?.classList.toggle("off", !on);
    if (eyeBtn) {
      eyeBtn.setAttribute("aria-pressed", on ? "true" : "false");
      eyeBtn.title = `${on ? "Hide" : "Show"} ${def.label}`;
    }
  }
}

function appendReferenceRow(container: HTMLElement, def: ReferenceLayerDef, opts?: { group?: boolean; sub?: boolean; hidden?: boolean }) {
  const canFocus =
    def.kind === "shoe" ||
    def.kind === "baseplate-viz" ||
    def.kind === "profile-a-viz" ||
    def.kind === "profile-b-viz" ||
    def.kind === "profile-c-viz";
  const row = document.createElement("div");
  row.className = "layerRow ref";
  if (opts?.group) row.classList.add("group");
  if (opts?.sub) row.classList.add("sub");
  if (opts?.hidden) row.classList.add("hidden");
  if (canFocus) row.classList.add("hasAction");
  row.dataset.refKind = def.kind;
  row.style.cursor = "pointer";
  row.tabIndex = 0;
  row.setAttribute("role", "button");
  row.addEventListener("click", () => toggleReferenceVisibility(def.kind));
  row.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    toggleReferenceVisibility(def.kind);
  });

  const eyeBtn = document.createElement("button");
  eyeBtn.type = "button";
  eyeBtn.className = "eyeBtn";
  eyeBtn.textContent = "\u{1F441}";
  eyeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleReferenceVisibility(def.kind);
  });

  const label = document.createElement("div");
  label.className = "layerRowLabel";
  label.textContent = def.label;

  row.appendChild(eyeBtn);
  row.appendChild(label);

  if (canFocus) {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "layerRowActionBtn";
    actionBtn.textContent = "\u2316";
    actionBtn.title = `Focus ${def.label}`;
    actionBtn.setAttribute("aria-label", `Focus ${def.label}`);
    actionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (def.kind === "shoe") viewer.frameShoe();
      else if (def.kind === "baseplate-viz") viewer.frameBaseplateControlPoints();
      else if (def.kind === "profile-a-viz") viewer.frameAControlPoints();
      else if (def.kind === "profile-b-viz") viewer.frameBControlPoints();
      else if (def.kind === "profile-c-viz") viewer.frameCControlPoints();
    });
    row.appendChild(actionBtn);
  }

  container.appendChild(row);
}

function toggleGeneratedModelVisibility() {
  modelEnabledEl.checked = !modelEnabledEl.checked;
  modelEnabledEl.dispatchEvent(new Event("change", { bubbles: true }));
}

function syncGeneratedModelLayerRow() {
  const row = layersModelVisibilityListEl.querySelector<HTMLElement>('.layerRow.ref[data-ref-kind="generated-model"]');
  const eyeBtn = row?.querySelector<HTMLButtonElement>(".eyeBtn");
  const on = !!modelEnabledEl.checked;
  row?.classList.toggle("off", !on);
  eyeBtn?.classList.toggle("off", !on);
  if (eyeBtn) {
    eyeBtn.setAttribute("aria-pressed", on ? "true" : "false");
    eyeBtn.title = `${on ? "Hide" : "Show"} Generated Model`;
  }
}

function renderLayersUI() {
  layersReferenceListEl.innerHTML = "";
  for (const def of topReferenceLayerDefs) appendReferenceRow(layersReferenceListEl, def);
  appendReferenceRow(layersReferenceListEl, controlPointVizParentDef, { group: true });
  for (const def of controlPointVizChildDefs) {
    appendReferenceRow(layersReferenceListEl, def, { sub: true, hidden: !controlPointVizGroupOpen });
  }

  layersModelVisibilityListEl.innerHTML = "";
  layersModelListEl.innerHTML = "";
  const generatedRow = document.createElement("div");
  generatedRow.className = "layerRow ref";
  generatedRow.dataset.refKind = "generated-model";
  generatedRow.style.cursor = "pointer";
  generatedRow.tabIndex = 0;
  generatedRow.setAttribute("role", "button");
  generatedRow.addEventListener("click", () => toggleGeneratedModelVisibility());
  generatedRow.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    toggleGeneratedModelVisibility();
  });

  const generatedEyeBtn = document.createElement("button");
  generatedEyeBtn.type = "button";
  generatedEyeBtn.className = "eyeBtn";
  generatedEyeBtn.textContent = "\u{1F441}";
  generatedEyeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleGeneratedModelVisibility();
  });

  const generatedLabel = document.createElement("div");
  generatedLabel.className = "layerRowLabel";
  generatedLabel.textContent = getCurrentGeneratedModelLabel();

  generatedRow.appendChild(generatedEyeBtn);
  generatedRow.appendChild(generatedLabel);
  layersModelVisibilityListEl.appendChild(generatedRow);

  if (layersState.modelLayers.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sectionMeta";
    empty.textContent = "No cached parahook layers yet.";
    layersModelListEl.appendChild(empty);
  } else {
    for (const layer of layersState.modelLayers) {
      const rowBtn = document.createElement("button");
      rowBtn.type = "button";
      rowBtn.className = "layerRow model";
      if (layer.id === layersState.activeModelLayerId) rowBtn.classList.add("active");
      rowBtn.setAttribute("aria-pressed", layer.id === layersState.activeModelLayerId ? "true" : "false");

      const label = document.createElement("div");
      label.className = "layerRowLabel";
      label.textContent = layer.name;
      rowBtn.appendChild(label);

      rowBtn.addEventListener("click", () => activateModelLayer(layer.id));
      layersModelListEl.appendChild(rowBtn);
    }
  }

  const hasActive = !!getActiveModelLayer();
  layerUpdateActiveBtn.disabled = !hasActive;
  layerDeleteActiveBtn.disabled = !hasActive;

  syncReferenceLayerRowsFromCheckboxes();
  syncGeneratedModelLayerRow();
}

function activateModelLayer(layerId: string) {
  const layer = layersState.modelLayers.find((l) => l.id === layerId);
  if (!layer) return;
  layersState.activeModelLayerId = layer.id;
  renderLayersUI();
  applySettingsSnapshotAndRebuild(layer.snapshot);
}

function createModelLayer(snapshot: SettingsSnapshot, name: string) {
  const now = new Date().toISOString();
  const layer: CachedModelLayer = {
    id: name,
    name,
    snapshot,
    createdAt: now,
    updatedAt: now,
  };
  layersState.modelLayers.push(layer);
  layersState.activeModelLayerId = layer.id;
  renderLayersUI();
  return layer;
}

function createModelLayerFromCurrent() {
  const layer = createModelLayer(collectSettingsSnapshot(), nextParahookLayerName());
  setStatus(`saved layer: ${layer.name}`);
}

function updateActiveModelLayerFromCurrent() {
  const layer = getActiveModelLayer();
  if (!layer) return;
  layer.snapshot = collectSettingsSnapshot();
  layer.updatedAt = new Date().toISOString();
  renderLayersUI();
  setStatus(`updated layer: ${layer.name}`);
}

function deleteActiveModelLayer() {
  const idx = getActiveModelLayerIndex();
  if (idx < 0) return;
  const removed = layersState.modelLayers[idx];
  layersState.modelLayers.splice(idx, 1);

  if (layersState.modelLayers.length === 0) {
    layersState.activeModelLayerId = null;
    renderLayersUI();
    setStatus(`deleted layer: ${removed.name}`);
    return;
  }

  const nextIdx = Math.min(idx, layersState.modelLayers.length - 1);
  const nextId = layersState.modelLayers[nextIdx].id;
  layersState.activeModelLayerId = nextId;
  renderLayersUI();
  setStatus(`deleted layer: ${removed.name}`);
  activateModelLayer(nextId);
}

function exportSettings() {
  const snapshot = collectSettingsSnapshot();
  const timestamp = new Date().toISOString().replace(/[:]/g, "-").replace(/\..+$/, "Z");
  downloadTextFile(JSON.stringify(snapshot, null, 2), `parahook-settings-${timestamp}.json`);
  setStatus("exported settings");
}

async function importSettingsFromFile(file: File) {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON file");
  }

  const raw = parsed as Partial<SettingsSnapshot> & { inputs?: Record<string, SettingsValue> };
  if (!raw || typeof raw !== "object" || !raw.inputs || typeof raw.inputs !== "object") {
    throw new Error("Settings file missing `inputs` object");
  }

  const snapshot: SettingsSnapshot = {
    kind: "parahook-settings",
    version: 1,
    exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : new Date().toISOString(),
    inputs: raw.inputs,
  };

  let autoSavedName: string | null = null;
  const activeBeforeImport = getActiveModelLayer();
  if (activeBeforeImport) {
    activeBeforeImport.snapshot = collectSettingsSnapshot();
    activeBeforeImport.updatedAt = new Date().toISOString();
    autoSavedName = activeBeforeImport.name;
  } else {
    const autoSaved = createModelLayer(collectSettingsSnapshot(), nextParahookLayerName());
    autoSavedName = autoSaved.name;
  }

  applySettingsSnapshotAndRebuild(snapshot);
  const loadedLayer = createModelLayer(collectSettingsSnapshot(), nextLoadedParahookLayerName());
  setStatus(`loaded settings: ${loadedLayer.name}${autoSavedName ? ` (auto-saved ${autoSavedName})` : ""}`);
}

const settingsFileInputEl = document.createElement("input");
settingsFileInputEl.type = "file";
settingsFileInputEl.accept = ".json,application/json";
settingsFileInputEl.style.display = "none";
document.body.appendChild(settingsFileInputEl);

let worker = createCadWorker();

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

function bindWorkerHandlers(targetWorker: Worker) {
  targetWorker.onmessage = (ev: MessageEvent<WorkerIn>) => {
    if (targetWorker !== worker) return;
    const msg = ev.data;

    if (msg.type === "status") return setStatus(msg.message);

    if (msg.type === "error") {
      if (lastBuildStartAtMs != null) {
        titleStatLastBuildDurationMs = Math.max(0, performance.now() - lastBuildStartAtMs);
        lastBuildStartAtMs = null;
        syncTitleStatsPanel();
      }
      setBusy(false);
      setMiniMeshStats(null, null);
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
        const meshBytes =
          positions.byteLength +
          (normals ? normals.byteLength : 0) +
          indices.byteLength;
        titleStatMeshBytesApprox = meshBytes;
        titleStatBuildCount += 1;
        if (lastBuildStartAtMs != null) {
          titleStatLastBuildDurationMs = Math.max(0, performance.now() - lastBuildStartAtMs);
          lastBuildStartAtMs = null;
        }
        syncTitleStatsPanel();

        log(`mesh rx: verts=${vertCount} tris=${Math.floor(indices.length / 3)}`);
        setMiniMeshStats(vertCount, Math.floor(indices.length / 3));

        viewer.setMesh({
          positions: Array.from(positions),
          normals: normals ? Array.from(normals) : undefined,
          indices: Array.from(indices),
        });

        setBusy(false);
        return setStatus("ready");
      } catch (e: any) {
        setBusy(false);
        setMiniMeshStats(null, null);
        return setStatus(`error: mesh parse failed: ${e?.message ?? String(e)}`);
      }
    }

    if (msg.type === "file") {
      lastBuildStartAtMs = null;
      downloadArrayBuffer(msg.buffer, msg.filename, msg.mime);
      setBusy(false);
      return setStatus(`downloaded: ${msg.filename}`);
    }

    log(`unknown worker message: ${JSON.stringify(msg)}`);
  };

  targetWorker.addEventListener("error", (e: any) => {
    if (targetWorker !== worker) return;
    const parts = [
      e?.message ? `msg=${e.message}` : "msg=(empty)",
      e?.filename ? `file=${e.filename}` : null,
      Number.isFinite(e?.lineno) ? `line=${e.lineno}` : null,
      Number.isFinite(e?.colno) ? `col=${e.colno}` : null,
    ].filter(Boolean);

    setBusy(false);
    setStatus(`worker error: ${parts.join(" ")}`);
  });

  targetWorker.addEventListener("messageerror", () => {
    if (targetWorker !== worker) return;
    setBusy(false);
    setStatus("worker messageerror");
  });
}

function createCadWorker() {
  const w = new Worker(new URL("./cad/worker.ts", import.meta.url), { type: "module" });
  bindWorkerHandlers(w);
  return w;
}

function restartCadWorkerForInterruption(reason: string) {
  try {
    worker.terminate();
  } catch {}
  worker = createCadWorker();
  lastBuildStartAtMs = null;
  log(`worker: interrupted and restarted (${reason})`);
}

let rebuildTimer: number | null = null;
let lastSig = "";
let crossRefitPendingManual = false;

function cancelPendingRebuild() {
  if (rebuildTimer != null) {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = null;
  }
}

function readRebuildDebounceMs(): number {
  return clampInt(readNumber(debounceMsEl, 200), 0, 1000);
}

type RebuildOptions = {
  freezeBaseRefit?: boolean;
  freezeToeRefit?: boolean;
  freezeHeelRefit?: boolean;
  forceFullRefit?: boolean;
  forceHeelRefit?: boolean;
};

type ParamGroup = "base" | "toe" | "heel" | "other";

function classifyParamGroup(id: string): ParamGroup {
  if (id.startsWith("bp_") || id.startsWith("sh_")) return "base";
  if (
    id.startsWith("toe_") ||
    id.startsWith("fil_") ||
    id.startsWith("th_") ||
    id.startsWith("rail_math_") ||
    id.startsWith("tagent_a_")
  )
    return "toe";
  if (id.startsWith("heel_")) return "heel";
  return "other";
}

function computeSignature(p: ModelParams): string {
  const base = !!baseEnabledEl.checked;
  const toeAddB = !!toeAddProfileBEl.checked;
  const heel = !!heelEnabledEl.checked;

  const parts: string[] = [];
  parts.push([base ? 1 : 0, toeAddB ? 1 : 0, heel ? 1 : 0].join(","));

  parts.push(paramIds.map((id) => p[id]).join(","));
  parts.push(`bp_fil_1=${bpFil1El.checked ? 1 : 0}`);
  parts.push(`sh_fil_1=${shFil1El.checked ? 1 : 0}`);
  parts.push(`th_fil_1=${thFil1El.checked ? 1 : 0}`);
  parts.push(`th_fil_2=${thFil2El.checked ? 1 : 0}`);
  parts.push(`heel_fil_1=${heelFil1El.checked ? 1 : 0}`);
  parts.push(`heel_fil_2=1`);
  parts.push(`toe_add_profile_b=${toeAddB ? 1 : 0}`);
  parts.push(`rail_math_mode=${readRailMathMode()}`);
  parts.push(`rail_math_5_cull=${readNumber(railMath5CullEl, 1)}`);
  parts.push(`rail_math_5_addback=${readNumber(mustEl<HTMLInputElement>("rail_math_5_addback"), 0)}`);
  parts.push(`rail_math_6a=${railMath6aEl.checked ? 1 : 0}`);
  parts.push(`rail_math_6b=${railMath6bEl.checked ? 1 : 0}`);
  parts.push(`rail_math_6c=${railMath6cEl.checked ? 1 : 0}`);
  parts.push(`heel_rail_math_mode=${readHeelRailMathMode()}`);
  parts.push(`heel_rail_math_4a=${heelRailMath4aEl.checked ? 1 : 0}`);
  parts.push(`heel_rail_math_4b=${heelRailMath4bEl.checked ? 1 : 0}`);
  parts.push(`tagent_profile_a=${tagentProfileAEl.checked ? 1 : 0}`);
  parts.push(`tagent_profile_b=${tagentProfileBEl.checked ? 1 : 0}`);
  parts.push(`tagent_profile_c=${tagentProfileCEl.checked ? 1 : 0}`);
  parts.push(`tagent_profile_d=${tagentProfileDEl.checked ? 1 : 0}`);
  parts.push(`tagent_d_cut_perp=${tagentDCutPerpEl.checked ? 1 : 0}`);
  parts.push(`tagent_a_bp_cut_perp=${tagentABpCutPerpEl.checked ? 1 : 0}`);
  parts.push(`heel_mid_ctrl=${heelMidCtrlEl.checked ? 1 : 0}`);
  parts.push(`heel_sweep=${heelSweepEl.checked ? 1 : 0}`);

  parts.push(
    `vizBase=${vizBasePtsEl.checked ? 1 : 0},vizA=${vizAArcPtsEl.checked ? 1 : 0},vizB=${
      vizBArcPtsEl.checked ? 1 : 0
    },vizC=${vizCArcPtsEl.checked ? 1 : 0},vizH=${vizHeelArcPtsEl.checked ? 1 : 0}`
  );

  return parts.join("|");
}

function rebuildDebounced(source = "param-change") {
  if (!canAutoRebuild()) return;
  cancelPendingRebuild();
  rebuildTimer = window.setTimeout(() => {
    rebuildTimer = null;
    if (!canAutoRebuild()) return;
    setLastRebuildSource(source);
    rebuild();
  }, readRebuildDebounceMs());
}

function rebuild(opts: RebuildOptions = {}) {
  cancelPendingRebuild();
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
  if (s === lastSig && !opts.forceFullRefit && !opts.forceHeelRefit) return setStatus("ready (cached)");
  lastSig = s;

  const base = !!baseEnabledEl.checked;
  const toeAddB = !!toeAddProfileBEl.checked;
  const toeB = toeAddB;
  const toeC = true;
  const heel = !!heelEnabledEl.checked;

  const wasBusy = titleStatCurrentBusy;
  setBusy(true);
  setStatus("building...");

  // Interrupt the current worker job so the newest UI input rebuild starts immediately.
  if (wasBusy) {
    restartCadWorkerForInterruption("new rebuild request");
    setBusy(true);
    setStatus("building...");
  }

  const out: WorkerOut = {
    type: "build",
    payload: {
      params,
      tolerance: readTolerance(),
      baseEnabled: base,
      toeBEnabled: toeB,
      toeCEnabled: toeC,
      heelEnabled: heel,
      freezeBaseRefit: !!opts.freezeBaseRefit,
      freezeToeRefit: !!opts.freezeToeRefit,
      freezeHeelRefit: !!opts.freezeHeelRefit,
      forceFullRefit: !!opts.forceFullRefit,
      forceHeelRefit: !!opts.forceHeelRefit,
    },
  };

  lastBuildStartAtMs = performance.now();
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
      toeBEnabled: !!toeAddProfileBEl.checked,
      toeCEnabled: true,
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
      toeBEnabled: !!toeAddProfileBEl.checked,
      toeCEnabled: true,
      heelEnabled: !!heelEnabledEl.checked,
    },
  };

  worker.postMessage(out);
}

function applyModelEnabledState() {
  const on = isModelEnabled();
  viewer.setModelVisible(on);

  applySectionCutUIToViewer();

  cancelPendingRebuild();
  setBusy(false);
  lastSig = "";

  if (on) {
    setLastRebuildSource("model-enabled");
    setStatus("model enabled");
    rebuild();
  } else {
    setMiniMeshStats(null, null);
    setStatus("model disabled");
  }
}

function syncModelLivePauseButton() {
  const liveOn = isLiveAutoRebuildEnabled();
  modelLivePauseBtn.textContent = liveOn ? "Live" : "Paused";
  modelLivePauseBtn.classList.toggle("secondary", !liveOn);
  modelLivePauseBtn.title = liveOn ? "Pause live mesh rebuilding" : "Resume live mesh rebuilding";
  modelLivePauseBtn.setAttribute("aria-pressed", liveOn ? "true" : "false");
  syncTitleStatsPanel();
}

syncLabels();
syncToeProfileBUI();
setupExclusiveCheckboxGroup(
  [
    railMathCurrentEl,
    railMath2El,
    railMath3El,
    railMath4El,
    railMath5El,
    railMath6El,
    railMath7El,
    railMath8El,
    railMath9El,
    railMath10El,
  ],
  railMathCurrentEl
);
setupExclusiveCheckboxGroup([railMath6aEl, railMath6bEl, railMath6cEl], railMath6aEl);
setupExclusiveCheckboxGroup([heelRailMath4aEl, heelRailMath4bEl], heelRailMath4aEl);
setupExclusiveCheckboxGroup(
  [heelRailMath1El, heelRailMath2El, heelRailMath3El, heelRailMath4El, heelRailMath5El],
  heelRailMath1El
);
if (heelSweepEl.checked) {
  syncHeelSweepAndRailMath3FromSweep();
} else {
  syncHeelSweepFromHeelRailMathSelection();
}
syncRailMathUI();
updateBaseplateViz();
updateArcViz();
applySectionCutUIToViewer();

modelEnabledEl.addEventListener("change", applyModelEnabledState);
modelEnabledEl.addEventListener("change", syncGeneratedModelLayerRow);
modelEnabledEl.addEventListener("change", syncModelLivePauseButton);
modelEnabledEl.addEventListener("change", syncTitleStatsPanel);
toolbarMinimizeEdgeBtnEl.addEventListener("click", () => {
  setToolbarCollapsed(!toolbarCollapsed);
});
window.addEventListener("resize", scheduleToolbarMinimizeEdgeButtonPosition);
window.visualViewport?.addEventListener("resize", scheduleToolbarMinimizeEdgeButtonPosition);
new ResizeObserver(() => {
  scheduleToolbarMinimizeEdgeButtonPosition();
}).observe(uiShellEl);
onLayoutModeChanged = (isMobile) => {
  if (isMobile) {
    mobileGizmoFullSize = Math.max(72, Math.round(viewer.getAxisGizmoViewportSize?.() ?? mobileGizmoFullSize));
    setToolbarCollapsed(true);
    gizmoControlsPanelOpen = false;
    gizmoSettingsPanelOpen = false;
    setMobileGizmoCollapsed(true);
    positionGizmoViewportResizeHandle();
    return;
  }
  setMobileGizmoCollapsed(false);
  viewer.setAxisGizmoViewportSize(Math.max(72, Math.round(mobileGizmoFullSize)));
  setToolbarCollapsed(false);
  positionGizmoViewportResizeHandle();
};
onLayoutModeChanged(isMobileLayoutActive);
titleStatsToggleBtn.addEventListener("click", () => {
  if (toolbarPanelEl.classList.contains("titleOnly")) return;
  setTitleStatsOpen(!titleStatsOpen);
});
window.addEventListener("toolbarTitleCollapseChange", () => {
  syncTitleStatsVisibilityWithToolbarCollapse();
  scheduleToolbarMinimizeEdgeButtonPosition();
});
modelLivePauseBtn.addEventListener("click", () => {
  liveAutoRebuildPaused = !liveAutoRebuildPaused;
  if (liveAutoRebuildPaused) {
    cancelPendingRebuild();
    setBusy(false);
    setStatus("live rebuild paused");
  } else {
    setLastRebuildSource("live-resume");
    setStatus("live rebuild enabled");
    if (isModelEnabled()) rebuild();
  }
  syncModelLivePauseButton();
});
syncModelLivePauseButton();
syncTitleStatsVisibilityWithToolbarCollapse();
syncTitleStatsPanel();
scheduleToolbarMinimizeEdgeButtonPosition();

vizBasePtsEl.addEventListener("change", () => {
  if (vizBasePtsEl.checked && !controlPointVizGroupOpen) {
    controlPointVizGroupOpen = true;
    renderLayersUI();
  }
  updateBaseplateViz();
  syncReferenceLayerRowsFromCheckboxes();
});

[vizAArcPtsEl, vizBArcPtsEl, vizCArcPtsEl, vizHeelArcPtsEl].forEach((el) => {
  el.addEventListener("change", () => {
    if (
      (el === vizAArcPtsEl || el === vizBArcPtsEl || el === vizCArcPtsEl) &&
      (el as HTMLInputElement).checked &&
      !controlPointVizGroupOpen
    ) {
      controlPointVizGroupOpen = true;
      renderLayersUI();
    }
    updateArcViz();
    syncReferenceLayerRowsFromCheckboxes();
    if (!isModelEnabled()) return;
    rebuildDebounced();
  });
});

// section cut should NEVER rebuild; viewer-only
[sectionCutEnabledEl, sectionCutFlipEl, sectionCutZswitchEl, sectionCutOffsetEl].forEach((el) => {
  el.addEventListener("input", applySectionCutUIToViewer);
  el.addEventListener("change", applySectionCutUIToViewer);
});
sectionCutZswitchEl.addEventListener("change", syncSectionCutModeRadiosFromCheckbox);
[sectionCutModeSectionEl, sectionCutModePlanEl].forEach((el) => {
  el.addEventListener("change", syncSectionCutCheckboxFromRadios);
});
syncSectionCutModeRadiosFromCheckbox();

[baseEnabledEl, heelEnabledEl].forEach((el) =>
  el.addEventListener("change", () => {
    syncTitleStatsPanel();
    if (!canAutoRebuild()) return;
    markParamChangeRebuildSource();
    rebuild();
  })
);
toeAddProfileBEl.addEventListener("change", () => {
  syncToeProfileBUI();
  syncTitleStatsPanel();
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeBaseRefit: true, freezeHeelRefit: true });
});
[railMathCurrentEl, railMath2El, railMath3El, railMath4El, railMath5El, railMath6El, railMath7El, railMath8El, railMath9El, railMath10El].forEach(
  (el) => el.addEventListener("change", syncRailMathUI)
);
heelMidCtrlEl.addEventListener("change", () => {
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeBaseRefit: true, freezeToeRefit: true });
});
heelSweepEl.addEventListener("change", () => {
  syncHeelSweepAndRailMath3FromSweep();
  syncRailMathUI();
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeBaseRefit: true, freezeToeRefit: true });
});

bpFil1El.addEventListener("change", () => {
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeToeRefit: true, freezeHeelRefit: true });
});
shFil1El.addEventListener("change", () => {
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeToeRefit: true, freezeHeelRefit: true });
});
thFil1El.addEventListener("change", () => {
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeBaseRefit: true, freezeHeelRefit: true });
});
thFil2El.addEventListener("change", () => {
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeBaseRefit: true, freezeHeelRefit: true });
});
heelFil1El.addEventListener("change", () => {
  if (!canAutoRebuild()) return;
  markParamChangeRebuildSource();
  if (rebuildAsOneEl.checked) {
    crossRefitPendingManual = false;
    return rebuild();
  }
  crossRefitPendingManual = true;
  return rebuild({ freezeBaseRefit: true, freezeToeRefit: true });
});
[tagentProfileAEl, tagentProfileBEl].forEach((el) => {
  el.addEventListener("change", () => {
    if (!canAutoRebuild()) return;
    markParamChangeRebuildSource();
    if (rebuildAsOneEl.checked) {
      crossRefitPendingManual = false;
      return rebuild();
    }
    crossRefitPendingManual = true;
    return rebuild({ freezeBaseRefit: true, freezeHeelRefit: true });
  });
});
[tagentABpCutPerpEl].forEach((el) => {
  el.addEventListener("change", () => {
    if (!canAutoRebuild()) return;
    markParamChangeRebuildSource();
    if (rebuildAsOneEl.checked) {
      crossRefitPendingManual = false;
      return rebuild();
    }
    crossRefitPendingManual = true;
    return rebuild({ freezeToeRefit: true, freezeHeelRefit: true });
  });
});
[tagentProfileCEl, tagentProfileDEl].forEach((el) => {
  el.addEventListener("change", () => {
    if (!canAutoRebuild()) return;
    markParamChangeRebuildSource();
    if (rebuildAsOneEl.checked) {
      crossRefitPendingManual = false;
      return rebuild();
    }
    crossRefitPendingManual = true;
    return rebuild({ freezeBaseRefit: true, freezeToeRefit: true });
  });
});
[tagentDCutPerpEl].forEach((el) => {
  el.addEventListener("change", () => {
    if (!canAutoRebuild()) return;
    markParamChangeRebuildSource();
    if (rebuildAsOneEl.checked) {
      crossRefitPendingManual = false;
      return rebuild();
    }
    crossRefitPendingManual = true;
    return rebuild({ freezeBaseRefit: true, freezeToeRefit: true });
  });
});
drGoodFilletEl.addEventListener("change", () => {
  if (!drGoodPresetReady) return;
  if (!drGoodFilletEl.checked) {
    drGoodFilletDietWrapEl.style.display = "none";
    drGoodFilletDietEl.checked = false;
    // Reset hidden child state so next enable starts from Diet=on.
    drGoodFilletDietEl.checked = true;
    return;
  }

  drGoodFilletDietWrapEl.style.display = "";
  drGoodFilletDietEl.checked = true;

  bpFil1El.checked = true;
  thFil1El.checked = true;
  thFil2El.checked = true;
  heelFil1El.checked = true;
  applyDrGoodDietPreset(true);
  return rebuildHeelToeBasePreset();
});
drGoodFilletDietEl.addEventListener("change", () => {
  if (!drGoodPresetReady) return;
  if (!drGoodFilletEl.checked) return;
  applyDrGoodDietPreset(!!drGoodFilletDietEl.checked);
  return rebuildHeelToeBasePreset();
});
rebuildBtn.addEventListener("click", () => {
  crossRefitPendingManual = false;
  setLastRebuildSource("manual");
  rebuild({ forceFullRefit: true, forceHeelRefit: true });
});
exportStlBtn.addEventListener("click", exportStl);
exportStepBtn.addEventListener("click", exportStep);
exportSettingsBtn.addEventListener("click", exportSettings);
layerSaveCurrentBtn.addEventListener("click", createModelLayerFromCurrent);
layerUpdateActiveBtn.addEventListener("click", updateActiveModelLayerFromCurrent);
layerDeleteActiveBtn.addEventListener("click", deleteActiveModelLayer);
loadSettingsBtn.addEventListener("click", () => {
  settingsFileInputEl.value = "";
  settingsFileInputEl.click();
});
settingsFileInputEl.addEventListener("change", async () => {
  const file = settingsFileInputEl.files?.[0];
  if (!file) return;
  try {
    setStatus("loading settings...");
    await importSettingsFromFile(file);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setBusy(false);
    setStatus(`settings load failed: ${msg}`);
    log(`settings import error: ${msg}`);
  } finally {
    settingsFileInputEl.value = "";
  }
});

syncDrGoodDietUIOnLoad();
drGoodPresetReady = true;
wireParamValMirror(railMath5CullValEl, railMath5CullEl);
wireParamValMirror(railMath5AddbackValEl, railMath5AddbackEl);
wireParamValMirror(heelRm3SweepValEl, heelRm3SweepEl);
wireParamValMirror(heelRm3BiasValEl, heelRm3BiasEl);
wireParamValMirror(heelRm3BlendValEl, heelRm3BlendEl);
wireParamValMirror(heelSweepRm3SweepValEl, heelSweepRm3SweepEl);
wireParamValMirror(heelSweepRm3BiasValEl, heelSweepRm3BiasEl);
wireParamValMirror(heelSweepRm3BlendValEl, heelSweepRm3BlendEl);
wireParamValMirror(heelRm4bSweepValEl, heelRm4bSweepEl);
wireParamValMirror(heelRm4bBiasValEl, heelRm4bBiasEl);
wireParamValMirror(heelRm4bBlendValEl, heelRm4bBlendEl);

[heelRm3SweepEl, heelRm3BiasEl, heelRm3BlendEl].forEach((el) => {
  el.addEventListener("input", syncHeelRm3MirrorValuesFromCanonical);
  el.addEventListener("change", syncHeelRm3MirrorValuesFromCanonical);
});
heelSweepRm3SweepEl.addEventListener("input", () =>
  pushSweepRm3MirrorToCanonical(heelSweepRm3SweepEl, heelRm3SweepEl, heelRm3SweepValEl, "input")
);
heelSweepRm3SweepEl.addEventListener("change", () =>
  pushSweepRm3MirrorToCanonical(heelSweepRm3SweepEl, heelRm3SweepEl, heelRm3SweepValEl, "change")
);
heelSweepRm3BiasEl.addEventListener("input", () =>
  pushSweepRm3MirrorToCanonical(heelSweepRm3BiasEl, heelRm3BiasEl, heelRm3BiasValEl, "input")
);
heelSweepRm3BiasEl.addEventListener("change", () =>
  pushSweepRm3MirrorToCanonical(heelSweepRm3BiasEl, heelRm3BiasEl, heelRm3BiasValEl, "change")
);
heelSweepRm3BlendEl.addEventListener("input", () =>
  pushSweepRm3MirrorToCanonical(heelSweepRm3BlendEl, heelRm3BlendEl, heelRm3BlendValEl, "input")
);
heelSweepRm3BlendEl.addEventListener("change", () =>
  pushSweepRm3MirrorToCanonical(heelSweepRm3BlendEl, heelRm3BlendEl, heelRm3BlendValEl, "change")
);
syncHeelRm3MirrorValuesFromCanonical();
renderLayersUI();
applyGeneratedModelTransformUIToViewer();

[modelXEl, modelYEl, modelZEl, modelRotXEl, modelRotYEl, modelRotEl].forEach((el) => {
  el.addEventListener("input", applyGeneratedModelTransformUIToViewer);
  el.addEventListener("change", applyGeneratedModelTransformUIToViewer);
});
modelMirrorXZEl.addEventListener("change", applyGeneratedModelTransformUIToViewer);
modelTransformResetBtn.addEventListener("click", () => {
  resetGeneratedModelTransformUI();
});

([tolEl, ...paramEls]).forEach((el) => {
  el.addEventListener("input", () => {
    syncLabels();
    updateBaseplateViz();
    updateArcViz();
    applySectionCutUIToViewer();
  });

  el.addEventListener("change", () => {
    syncLabels();
    updateBaseplateViz();
    updateArcViz();
    applySectionCutUIToViewer();
    if (!canAutoRebuild()) return;
    markParamChangeRebuildSource();
    if (rebuildAsOneEl.checked) {
      crossRefitPendingManual = false;
      return rebuild();
    }

    if (el.id === "tolerance") {
      return rebuild({ freezeBaseRefit: crossRefitPendingManual, freezeToeRefit: crossRefitPendingManual, freezeHeelRefit: crossRefitPendingManual });
    }

    if (el.id.startsWith("rail_math_")) {
      crossRefitPendingManual = true;
      return rebuild({ freezeHeelRefit: true });
    }

    const group = classifyParamGroup(el.id);
    if (group === "base") {
      crossRefitPendingManual = true;
      return rebuild({ freezeToeRefit: true, freezeHeelRefit: true });
    }
    if (group === "toe") {
      crossRefitPendingManual = true;
      return rebuild({ freezeBaseRefit: true, freezeHeelRefit: true });
    }
    if (group === "heel") {
      crossRefitPendingManual = true;
      return rebuild({ freezeBaseRefit: true, freezeToeRefit: true });
    }

    rebuild({ freezeBaseRefit: crossRefitPendingManual, freezeToeRefit: crossRefitPendingManual, freezeHeelRefit: crossRefitPendingManual });
  });
});

log("main.ts loaded");
worker.postMessage({ type: "ping" });

setBusy(false);
applyModelEnabledState();
