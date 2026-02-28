export type GizmoViewportRect = {
  left: number;
  top: number;
  size: number;
};

export type GizmoLayoutState = {
  gizmoOpen: boolean;
  gizmoPanelHeight: number;
  viewOpen: boolean;
  controlsOpen: boolean;
  collapsedMode: "horizontal" | "vertical" | null;
  spinEnabled: boolean;
  viewPanelHeight: number;
  toolbarWidthOverride: number | null;
  cardinalUpLabel: string;
};

export type GizmoLayoutResult = {
  handleLeft: number;
  handleTop: number;
  toolbarHandleLeft: number;
  toolbarHandleTop: number;
  fpsLeft: number;
  fpsTop: number;
  rollCcwLeft: number;
  rollCcwTop: number;
  rollCwLeft: number;
  rollCwTop: number;
  modeBaseLeft: number;
  toolbarWidth: number;
  auxRowTop: number;
  gizmoRowTop: number;
  gizmoPanelTop: number;
  viewRowTop: number;
  controlsRowTop: number;
  controlsStackTop: number;
  viewPanelLeft: number;
  viewPanelTop: number;
};

const HANDLE_HALF = 7;
const ROW_H = 22;
const VIEW_PANEL_GAP = 8;
const COLLAPSED_ROW_EXTRA_GAP = 10;
const COMPACT_TAB_ROW_STEP = 88;
const TOOLBAR_BTN_GAP = 4;

export type GizmoLayoutElements = {
  gizmoViewportResizeHandleEl: HTMLDivElement | null;
  gizmoToolbarResizeHandleEl: HTMLDivElement | null;
  gizmoToggleBtnEl: HTMLButtonElement | null;
  gizmoGizmoPanelEl: HTMLDivElement | null;
  gizmoCardinalUpBadgeEl: HTMLButtonElement | null;
  gizmoFpsBadgeEl: HTMLDivElement | null;
  gizmoRollCwBtnEl: HTMLButtonElement | null;
  gizmoRollCcwBtnEl: HTMLButtonElement | null;
  gizmoModeCurrentBtnEl: HTMLButtonElement | null;
  gizmoModeOrbitBtnEl: HTMLButtonElement | null;
  gizmoModeTrackballBtnEl: HTMLButtonElement | null;
  gizmoModeArcballBtnEl: HTMLButtonElement | null;
  gizmoGravityLabelEl: HTMLDivElement | null;
  gizmoGravityRangeEl: HTMLInputElement | null;
  gizmoDecayLabelEl: HTMLDivElement | null;
  gizmoDecayRangeEl: HTMLInputElement | null;
  gizmoSpinToggleBtnEl: HTMLButtonElement | null;
  gizmoSpinSpeedLabelEl: HTMLDivElement | null;
  gizmoSpinSpeedRangeEl: HTMLInputElement | null;
  gizmoZoomStopsInertiaBtnEl: HTMLButtonElement | null;
  gizmoViewBtnEl: HTMLButtonElement | null;
  gizmoControlsBtnEl: HTMLButtonElement | null;
  gizmoControlsPanelEl: HTMLDivElement | null;
  gizmoViewPanelEl: HTMLDivElement | null;
};

export function computeGizmoLayout(vp: GizmoViewportRect, state: GizmoLayoutState): GizmoLayoutResult {
  const expanded = state.gizmoOpen || state.viewOpen || state.controlsOpen;
  const compactTabsActive = state.collapsedMode === "vertical" && !expanded;
  const collapsedExtraGap = expanded ? 0 : compactTabsActive ? 0 : COLLAPSED_ROW_EXTRA_GAP;
  const viewportW = Math.round(window.visualViewport?.width ?? window.innerWidth);
  const toolbarRight = Math.min(Math.round(vp.left + vp.size), Math.max(8, viewportW - 8));
  const maxWidth = Math.max(24, Math.round(toolbarRight - 8));
  const desktopCollapsedWidth = Number.isFinite(state.toolbarWidthOverride as number)
    ? Math.max(108, Math.round(state.toolbarWidthOverride as number))
    : Math.max(180, Math.round(vp.size));
  const collapsedWidth = state.collapsedMode === "vertical" ? 24 : Math.min(maxWidth, desktopCollapsedWidth);
  const requestedWidth = compactTabsActive
    ? collapsedWidth
    : Number.isFinite(state.toolbarWidthOverride as number)
      ? Math.round(state.toolbarWidthOverride as number)
      : Math.round(vp.size);
  const toolbarWidth = expanded ? Math.min(maxWidth, Math.max(108, requestedWidth)) : collapsedWidth;
  const modeBaseLeft = Math.round(toolbarRight - toolbarWidth);
  const auxRowTop = Math.round(vp.top + vp.size + 4);
  const gizmoRowTop = compactTabsActive ? auxRowTop : Math.round(auxRowTop + ROW_H + 6);
  const gizmoPanelTop = compactTabsActive ? Math.round(gizmoRowTop + 24) : Math.round(gizmoRowTop + ROW_H + 6);
  const gizmoPanelDrop = state.gizmoOpen ? Math.round(state.gizmoPanelHeight + VIEW_PANEL_GAP) : 0;
  const rowStep = compactTabsActive ? COMPACT_TAB_ROW_STEP : 0;
  const viewRowTop = compactTabsActive
    ? gizmoRowTop + rowStep + gizmoPanelDrop + collapsedExtraGap
    : gizmoRowTop;
  const viewPanelDrop = state.viewOpen ? Math.round(state.viewPanelHeight + VIEW_PANEL_GAP) : 0;
  const controlsRowTop = compactTabsActive ? viewRowTop + rowStep + viewPanelDrop : gizmoRowTop;
  const controlsStackTop = compactTabsActive
    ? controlsRowTop + ROW_H
    : gizmoPanelTop + gizmoPanelDrop + viewPanelDrop;

  return {
    handleLeft: Math.round(vp.left - HANDLE_HALF),
    handleTop: Math.round(vp.top + vp.size - HANDLE_HALF),
    toolbarHandleLeft: Math.round(modeBaseLeft - HANDLE_HALF),
    toolbarHandleTop: Math.round(
      state.controlsOpen
        ? state.spinEnabled
          ? controlsStackTop + 170
          : controlsStackTop + 142
        : controlsRowTop + 20
    ),
    fpsLeft: Math.round(vp.left + vp.size - 52),
    fpsTop: Math.round(vp.top + vp.size - 18),
    rollCcwLeft: Math.round(vp.left + vp.size - 36),
    rollCcwTop: Math.round(vp.top + 4),
    rollCwLeft: Math.round(vp.left + vp.size - 8),
    rollCwTop: Math.round(vp.top + 28),
    modeBaseLeft,
    toolbarWidth,
    auxRowTop,
    gizmoRowTop,
    gizmoPanelTop,
    viewRowTop,
    controlsRowTop,
    controlsStackTop,
    viewPanelLeft: modeBaseLeft,
    viewPanelTop: Math.round(viewRowTop + 24),
  };
}

export function applyGizmoLayout(
  elements: GizmoLayoutElements,
  layout: GizmoLayoutResult,
  state: GizmoLayoutState
) {
  const setPos = (el: HTMLElement | null, left: number, top: number) => {
    if (!el) return;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };
  const setDisplay = (el: HTMLElement | null, on: boolean) => {
    if (!el) return;
    el.style.display = on ? "block" : "none";
  };
  const setScrollablePanelPlacement = (el: HTMLElement | null, desiredTop: number, minUsableHeight = 140) => {
    if (!el) return;
    const viewportH = Math.round(window.visualViewport?.height ?? window.innerHeight);
    const margin = 8;
    let top = Math.round(desiredTop);
    let maxH = viewportH - top - margin;
    if (maxH < minUsableHeight) {
      top = Math.max(margin, viewportH - minUsableHeight - margin);
      maxH = viewportH - top - margin;
    }
    el.style.top = `${Math.round(top)}px`;
    el.style.maxHeight = `${Math.max(80, Math.round(maxH))}px`;
    el.style.overflowY = "auto";
    el.style.overflowX = "hidden";
    el.style.setProperty("-webkit-overflow-scrolling", "touch");
    el.style.touchAction = "pan-y";
  };

  setPos(elements.gizmoViewportResizeHandleEl, layout.handleLeft, layout.handleTop);
  setPos(elements.gizmoToolbarResizeHandleEl, layout.toolbarHandleLeft, layout.toolbarHandleTop);
  setPos(elements.gizmoRollCcwBtnEl, layout.rollCcwLeft, layout.rollCcwTop);
  setPos(elements.gizmoRollCwBtnEl, layout.rollCwLeft, layout.rollCwTop);
  const expanded = state.gizmoOpen || state.viewOpen || state.controlsOpen;
  const compactTabsActive = state.collapsedMode === "vertical" && !expanded;
  const oneThirdW = Math.max(
    compactTabsActive ? 24 : 56,
    Math.floor((layout.toolbarWidth - TOOLBAR_BTN_GAP * 2) / 3)
  );
  const topHalfW = Math.max(44, Math.floor((layout.toolbarWidth - TOOLBAR_BTN_GAP) / 2));

  if (elements.gizmoToggleBtnEl) {
    setPos(elements.gizmoToggleBtnEl, layout.modeBaseLeft, layout.gizmoRowTop);
    elements.gizmoToggleBtnEl.style.width = `${compactTabsActive ? layout.toolbarWidth : oneThirdW}px`;
    elements.gizmoToggleBtnEl.setAttribute("aria-pressed", state.gizmoOpen ? "true" : "false");
  }
  if (elements.gizmoGizmoPanelEl) {
    setPos(elements.gizmoGizmoPanelEl, layout.modeBaseLeft, layout.gizmoPanelTop);
    elements.gizmoGizmoPanelEl.style.width = `${layout.toolbarWidth}px`;
    setScrollablePanelPlacement(elements.gizmoGizmoPanelEl, layout.gizmoPanelTop, 120);
    elements.gizmoGizmoPanelEl.classList.toggle("open", state.gizmoOpen);
  }
  if (elements.gizmoCardinalUpBadgeEl) {
    setPos(elements.gizmoCardinalUpBadgeEl, layout.modeBaseLeft, layout.auxRowTop);
    elements.gizmoCardinalUpBadgeEl.style.width = `${topHalfW}px`;
    elements.gizmoCardinalUpBadgeEl.style.minWidth = `${topHalfW}px`;
    const dirText = state.cardinalUpLabel.startsWith("-") ? "Down" : "Up";
    elements.gizmoCardinalUpBadgeEl.textContent = `${state.cardinalUpLabel} ${dirText}`;
  }
  if (elements.gizmoFpsBadgeEl) {
    setPos(elements.gizmoFpsBadgeEl, layout.modeBaseLeft + topHalfW + TOOLBAR_BTN_GAP, layout.auxRowTop);
    elements.gizmoFpsBadgeEl.style.width = `${topHalfW}px`;
    elements.gizmoFpsBadgeEl.style.minWidth = `${topHalfW}px`;
  }
  setDisplay(elements.gizmoCardinalUpBadgeEl, !compactTabsActive);
  setDisplay(elements.gizmoFpsBadgeEl, !compactTabsActive);

  if (elements.gizmoViewBtnEl) {
    setPos(
      elements.gizmoViewBtnEl,
      compactTabsActive ? layout.modeBaseLeft : layout.modeBaseLeft + oneThirdW + TOOLBAR_BTN_GAP,
      layout.viewRowTop
    );
    elements.gizmoViewBtnEl.style.width = `${compactTabsActive ? layout.toolbarWidth : oneThirdW}px`;
    elements.gizmoViewBtnEl.setAttribute("aria-pressed", state.viewOpen ? "true" : "false");
  }
  if (elements.gizmoControlsBtnEl) {
    setPos(elements.gizmoControlsBtnEl, compactTabsActive ? layout.modeBaseLeft : layout.modeBaseLeft + (oneThirdW + TOOLBAR_BTN_GAP) * 2, layout.controlsRowTop);
    elements.gizmoControlsBtnEl.style.width = `${compactTabsActive ? layout.toolbarWidth : oneThirdW}px`;
    elements.gizmoControlsBtnEl.setAttribute("aria-pressed", state.controlsOpen ? "true" : "false");
  }
  if (elements.gizmoControlsPanelEl) {
    setPos(elements.gizmoControlsPanelEl, layout.modeBaseLeft, layout.controlsStackTop);
    elements.gizmoControlsPanelEl.style.width = `${layout.toolbarWidth}px`;
    setScrollablePanelPlacement(elements.gizmoControlsPanelEl, layout.controlsStackTop, 160);
    elements.gizmoControlsPanelEl.classList.toggle("open", state.controlsOpen);
  }
  if (elements.gizmoViewPanelEl) {
    setPos(elements.gizmoViewPanelEl, layout.viewPanelLeft, layout.viewPanelTop);
    elements.gizmoViewPanelEl.style.width = `${layout.toolbarWidth}px`;
    setScrollablePanelPlacement(elements.gizmoViewPanelEl, layout.viewPanelTop, 180);
  }
  setDisplay(elements.gizmoToolbarResizeHandleEl, state.gizmoOpen || state.viewOpen || state.controlsOpen);

  const modeColW = Math.max(48, Math.floor((layout.toolbarWidth - 4) / 2));
  setPos(elements.gizmoModeCurrentBtnEl, layout.modeBaseLeft, layout.controlsStackTop);
  setPos(elements.gizmoModeOrbitBtnEl, layout.modeBaseLeft + modeColW + 4, layout.controlsStackTop);
  setPos(elements.gizmoModeTrackballBtnEl, layout.modeBaseLeft, layout.controlsStackTop + 24);
  setPos(elements.gizmoModeArcballBtnEl, layout.modeBaseLeft + modeColW + 4, layout.controlsStackTop + 24);
  setPos(elements.gizmoGravityLabelEl, layout.modeBaseLeft, layout.controlsStackTop + 44);
  setPos(elements.gizmoGravityRangeEl, layout.modeBaseLeft, layout.controlsStackTop + 50);
  setPos(elements.gizmoDecayLabelEl, layout.modeBaseLeft, layout.controlsStackTop + 66);
  setPos(elements.gizmoDecayRangeEl, layout.modeBaseLeft, layout.controlsStackTop + 72);
  setPos(elements.gizmoSpinToggleBtnEl, layout.modeBaseLeft, layout.controlsStackTop + 94);
  setPos(elements.gizmoSpinSpeedLabelEl, layout.modeBaseLeft, layout.controlsStackTop + 114);
  setPos(elements.gizmoSpinSpeedRangeEl, layout.modeBaseLeft, layout.controlsStackTop + 122);
  setPos(
    elements.gizmoZoomStopsInertiaBtnEl,
    layout.modeBaseLeft,
    layout.controlsStackTop + (state.spinEnabled ? 146 : 114)
  );
  if (elements.gizmoModeCurrentBtnEl) elements.gizmoModeCurrentBtnEl.style.width = `${modeColW}px`;
  if (elements.gizmoModeOrbitBtnEl) elements.gizmoModeOrbitBtnEl.style.width = `${modeColW}px`;
  if (elements.gizmoModeTrackballBtnEl) elements.gizmoModeTrackballBtnEl.style.width = `${modeColW}px`;
  if (elements.gizmoModeArcballBtnEl) elements.gizmoModeArcballBtnEl.style.width = `${modeColW}px`;
  if (elements.gizmoGravityLabelEl) elements.gizmoGravityLabelEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoGravityRangeEl) elements.gizmoGravityRangeEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoDecayLabelEl) elements.gizmoDecayLabelEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoDecayRangeEl) elements.gizmoDecayRangeEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoSpinToggleBtnEl) elements.gizmoSpinToggleBtnEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoSpinSpeedLabelEl) elements.gizmoSpinSpeedLabelEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoSpinSpeedRangeEl) elements.gizmoSpinSpeedRangeEl.style.width = `${layout.toolbarWidth}px`;
  if (elements.gizmoZoomStopsInertiaBtnEl) elements.gizmoZoomStopsInertiaBtnEl.style.width = `${layout.toolbarWidth}px`;

  const controlsVisible = state.controlsOpen;
  setDisplay(elements.gizmoControlsPanelEl, controlsVisible);
  setDisplay(elements.gizmoModeCurrentBtnEl, controlsVisible);
  setDisplay(elements.gizmoModeOrbitBtnEl, controlsVisible);
  setDisplay(elements.gizmoModeTrackballBtnEl, controlsVisible);
  setDisplay(elements.gizmoModeArcballBtnEl, controlsVisible);
  setDisplay(elements.gizmoGravityLabelEl, controlsVisible);
  setDisplay(elements.gizmoGravityRangeEl, controlsVisible);
  setDisplay(elements.gizmoDecayLabelEl, controlsVisible);
  setDisplay(elements.gizmoDecayRangeEl, controlsVisible);
  setDisplay(elements.gizmoSpinToggleBtnEl, controlsVisible);
  setDisplay(elements.gizmoSpinSpeedLabelEl, controlsVisible && state.spinEnabled);
  setDisplay(elements.gizmoSpinSpeedRangeEl, controlsVisible && state.spinEnabled);
  setDisplay(elements.gizmoZoomStopsInertiaBtnEl, controlsVisible);
}
