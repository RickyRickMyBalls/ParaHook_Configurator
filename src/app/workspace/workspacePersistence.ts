import {
  defaultBrowserViewportSplitDockSide,
  defaultBrowserViewportSplitRatio,
  createDefaultEditorWorkspaceSurfaceState,
  createDefaultWorkspaceViewportChromeState,
  defaultBrowserPopoutState,
  defaultLeftDockWidth,
  defaultPrimaryWorkspaceViewportId,
  type BrowserShellState,
  type EditorWorkspaceSurfaceState,
  type PersistedWorkspaceLayout,
  type WorkspacePopoutSurfaceState,
  type WorkspaceViewportChromeState,
  type WorkspaceViewportId,
} from './workspaceShellTypes'
import { resolveDefaultWorkspaceSplitDockSide } from './workspaceSplitTypes'

export const workspaceLayoutStorageKey = 'parahook.workspace.lastLayout.v1'

type WorkspacePersistenceSource = {
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  browserShell: BrowserShellState
  primaryViewportId: WorkspaceViewportId
  viewportChromeById: Record<string, WorkspaceViewportChromeState>
  editorSurfacePlacementById: Record<string, EditorWorkspaceSurfaceState>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const roundNumber = (value: number, fallback: number): number =>
  Number.isFinite(value) ? Math.round(value) : fallback

const cloneBrowserShellState = (browserShell: BrowserShellState): BrowserShellState => ({
  isCollapsed: browserShell.isCollapsed,
  isFloating: browserShell.isFloating,
  isPoppedOut: browserShell.isPoppedOut,
  isViewportSplit: browserShell.isViewportSplit,
  position: {
    x: roundNumber(browserShell.position.x, 16),
    y: roundNumber(browserShell.position.y, 96),
  },
  size: {
    width: roundNumber(browserShell.size.width, 320),
    height: roundNumber(browserShell.size.height, 560),
  },
  viewportSplitRatio:
    typeof browserShell.viewportSplitRatio === 'number' && Number.isFinite(browserShell.viewportSplitRatio)
      ? Math.min(0.85, Math.max(0.15, browserShell.viewportSplitRatio))
      : defaultBrowserViewportSplitRatio,
  viewportSplitDockSide:
    browserShell.viewportSplitDockSide === 'top' ||
    browserShell.viewportSplitDockSide === 'right' ||
    browserShell.viewportSplitDockSide === 'bottom' ||
    browserShell.viewportSplitDockSide === 'left'
      ? browserShell.viewportSplitDockSide
      : defaultBrowserViewportSplitDockSide,
  popoutState:
    browserShell.popoutState === null
      ? null
      : cloneWorkspacePopoutSurfaceState(browserShell.popoutState),
})

const cloneWorkspacePopoutSurfaceState = (
  popoutState: WorkspacePopoutSurfaceState,
): WorkspacePopoutSurfaceState => ({
  childWindowId:
    typeof popoutState.childWindowId === 'string' && popoutState.childWindowId.length > 0
      ? popoutState.childWindowId
      : defaultBrowserPopoutState.childWindowId,
  owner: popoutState.owner === 'child-window' ? 'child-window' : 'main-app',
  windowName:
    typeof popoutState.windowName === 'string' && popoutState.windowName.length > 0
      ? popoutState.windowName
      : defaultBrowserPopoutState.windowName,
  windowTitle:
    typeof popoutState.windowTitle === 'string' && popoutState.windowTitle.length > 0
      ? popoutState.windowTitle
      : defaultBrowserPopoutState.windowTitle,
  windowFeatures:
    typeof popoutState.windowFeatures === 'string' && popoutState.windowFeatures.length > 0
      ? popoutState.windowFeatures
      : defaultBrowserPopoutState.windowFeatures,
})

const cloneEditorSurfacePlacement = (
  surface: EditorWorkspaceSurfaceState,
): EditorWorkspaceSurfaceState => ({
  ...surface,
  position: {
    x: roundNumber(surface.position.x, 344),
    y: roundNumber(surface.position.y, 16),
  },
  size: {
    width: roundNumber(surface.size.width, 980),
    height: roundNumber(surface.size.height, 760),
  },
  splitDockSide: surface.splitDockSide,
  restoreFromCollapsed:
    surface.restoreFromCollapsed === null
      ? null
      : {
          ...surface.restoreFromCollapsed,
          position:
            surface.restoreFromCollapsed.position === undefined
              ? undefined
              : {
                  x: roundNumber(surface.restoreFromCollapsed.position.x, surface.position.x),
                  y: roundNumber(surface.restoreFromCollapsed.position.y, surface.position.y),
                },
          size:
            surface.restoreFromCollapsed.size === undefined
              ? undefined
              : {
                  width: roundNumber(surface.restoreFromCollapsed.size.width, surface.size.width),
                  height: roundNumber(surface.restoreFromCollapsed.size.height, surface.size.height),
                },
        },
  restoreFromSplit:
    surface.restoreFromSplit === null
      ? null
      : {
          ...surface.restoreFromSplit,
          position:
            surface.restoreFromSplit.position === undefined
              ? undefined
              : {
                  x: roundNumber(surface.restoreFromSplit.position.x, surface.position.x),
                  y: roundNumber(surface.restoreFromSplit.position.y, surface.position.y),
                },
          size:
            surface.restoreFromSplit.size === undefined
              ? undefined
              : {
                  width: roundNumber(surface.restoreFromSplit.size.width, surface.size.width),
                  height: roundNumber(surface.restoreFromSplit.size.height, surface.size.height),
                },
        },
})

const normalizeViewportChromeRecord = (
  value: unknown,
  fallbackViewportId: WorkspaceViewportId,
): WorkspaceViewportChromeState | null => {
  if (!isRecord(value)) {
    return null
  }
  const viewportId =
    typeof value.viewportId === 'string' && value.viewportId.length > 0
      ? value.viewportId
      : fallbackViewportId
  return createDefaultWorkspaceViewportChromeState(viewportId)
}

const normalizeEditorSurfacePlacement = (
  surfaceInstanceId: string,
  value: unknown,
): EditorWorkspaceSurfaceState | null => {
  if (!isRecord(value)) {
    return null
  }
  const base = createDefaultEditorWorkspaceSurfaceState(surfaceInstanceId)
  const normalized: EditorWorkspaceSurfaceState = {
    ...base,
    presentationMode: value.presentationMode === 'tiled' ? 'tiled' : 'windowed',
    windowMode:
      value.windowMode === 'collapsed' ||
      value.windowMode === 'meatball editor view' ||
      value.windowMode === 'expanded' ||
      value.windowMode === 'maximized' ||
      value.windowMode === 'split view' ||
      value.windowMode === 'separateWindow'
        ? value.windowMode
        : base.windowMode,
    position: {
      x: roundNumber(typeof value.position === 'object' && value.position !== null ? Number((value.position as Record<string, unknown>).x) : NaN, base.position.x),
      y: roundNumber(typeof value.position === 'object' && value.position !== null ? Number((value.position as Record<string, unknown>).y) : NaN, base.position.y),
    },
    size: {
      width: roundNumber(typeof value.size === 'object' && value.size !== null ? Number((value.size as Record<string, unknown>).width) : NaN, base.size.width),
      height: roundNumber(typeof value.size === 'object' && value.size !== null ? Number((value.size as Record<string, unknown>).height) : NaN, base.size.height),
    },
    splitRatio:
      typeof value.splitRatio === 'number' && Number.isFinite(value.splitRatio)
        ? value.splitRatio
        : base.splitRatio,
    splitDirection:
      value.splitDirection === 'vertical' || value.splitDirection === 'horizontal'
        ? value.splitDirection
        : base.splitDirection,
    splitDockSide: base.splitDockSide,
    splitPriority:
      value.splitPriority === 'balanced' ||
      value.splitPriority === 'favorFirst' ||
      value.splitPriority === 'favorSecond'
        ? value.splitPriority
        : base.splitPriority,
    restoreFromCollapsed: base.restoreFromCollapsed,
    restoreFromSplit: base.restoreFromSplit,
  }

  normalized.splitDockSide =
    value.splitDockSide === 'top' ||
    value.splitDockSide === 'right' ||
    value.splitDockSide === 'bottom' ||
    value.splitDockSide === 'left'
      ? value.splitDockSide
      : resolveDefaultWorkspaceSplitDockSide(normalized.splitDirection)

  if (isRecord(value.restoreFromCollapsed)) {
    normalized.restoreFromCollapsed = {
      windowMode:
        value.restoreFromCollapsed.windowMode === 'expanded' ||
        value.restoreFromCollapsed.windowMode === 'maximized' ||
        value.restoreFromCollapsed.windowMode === 'split view'
          ? value.restoreFromCollapsed.windowMode
          : 'expanded',
      position: isRecord(value.restoreFromCollapsed.position)
        ? {
            x: roundNumber(Number(value.restoreFromCollapsed.position.x), normalized.position.x),
            y: roundNumber(Number(value.restoreFromCollapsed.position.y), normalized.position.y),
          }
        : undefined,
      size: isRecord(value.restoreFromCollapsed.size)
        ? {
            width: roundNumber(Number(value.restoreFromCollapsed.size.width), normalized.size.width),
            height: roundNumber(Number(value.restoreFromCollapsed.size.height), normalized.size.height),
          }
        : undefined,
      splitRatio:
        typeof value.restoreFromCollapsed.splitRatio === 'number' &&
        Number.isFinite(value.restoreFromCollapsed.splitRatio)
          ? value.restoreFromCollapsed.splitRatio
          : undefined,
    }
  }

  if (isRecord(value.restoreFromSplit)) {
    normalized.restoreFromSplit = {
      windowMode:
        value.restoreFromSplit.windowMode === 'expanded' ||
        value.restoreFromSplit.windowMode === 'maximized'
          ? value.restoreFromSplit.windowMode
          : 'expanded',
      position: isRecord(value.restoreFromSplit.position)
        ? {
            x: roundNumber(Number(value.restoreFromSplit.position.x), normalized.position.x),
            y: roundNumber(Number(value.restoreFromSplit.position.y), normalized.position.y),
          }
        : undefined,
      size: isRecord(value.restoreFromSplit.size)
        ? {
            width: roundNumber(Number(value.restoreFromSplit.size.width), normalized.size.width),
            height: roundNumber(Number(value.restoreFromSplit.size.height), normalized.size.height),
          }
        : undefined,
    }
  }

  return cloneEditorSurfacePlacement(normalized)
}

export const serializeWorkspaceLayout = (
  state: WorkspacePersistenceSource,
): PersistedWorkspaceLayout => ({
  version: 1,
  leftDockWidth: roundNumber(state.leftDockWidth, defaultLeftDockWidth),
  isLeftDockViewportSplit: state.isLeftDockViewportSplit,
  browserShell: cloneBrowserShellState(state.browserShell),
  primaryViewportId: state.primaryViewportId,
  viewportChromeById: Object.fromEntries(
    Object.entries(state.viewportChromeById).map(([viewportId, chrome]) => [
      viewportId,
      createDefaultWorkspaceViewportChromeState(chrome.viewportId),
    ]),
  ),
  editorSurfacePlacementById: Object.fromEntries(
    Object.entries(state.editorSurfacePlacementById).map(([surfaceInstanceId, surface]) => [
      surfaceInstanceId,
      cloneEditorSurfacePlacement(surface),
    ]),
  ),
})

export const normalizePersistedWorkspaceLayout = (
  value: unknown,
): PersistedWorkspaceLayout | null => {
  if (!isRecord(value)) {
    return null
  }
  const primaryViewportId =
    typeof value.primaryViewportId === 'string' && value.primaryViewportId.length > 0
      ? value.primaryViewportId
      : defaultPrimaryWorkspaceViewportId
  const viewportChromeEntries = isRecord(value.viewportChromeById)
    ? Object.entries(value.viewportChromeById)
        .map(([viewportId, chrome]) => [
          viewportId,
          normalizeViewportChromeRecord(chrome, viewportId),
        ] as const)
        .filter((entry): entry is readonly [string, WorkspaceViewportChromeState] => entry[1] !== null)
    : []
  const viewportChromeById =
    viewportChromeEntries.length > 0
      ? Object.fromEntries(viewportChromeEntries)
      : {
          [primaryViewportId]: createDefaultWorkspaceViewportChromeState(primaryViewportId),
        }
  if (viewportChromeById[primaryViewportId] === undefined) {
    viewportChromeById[primaryViewportId] =
      createDefaultWorkspaceViewportChromeState(primaryViewportId)
  }

  const editorSurfaceEntries = isRecord(value.editorSurfacePlacementById)
    ? Object.entries(value.editorSurfacePlacementById)
        .map(([surfaceInstanceId, surface]) => [
          surfaceInstanceId,
          normalizeEditorSurfacePlacement(surfaceInstanceId, surface),
        ] as const)
        .filter((entry): entry is readonly [string, EditorWorkspaceSurfaceState] => entry[1] !== null)
    : []

  return {
    version: 1,
    leftDockWidth: roundNumber(
      typeof value.leftDockWidth === 'number' ? value.leftDockWidth : NaN,
      defaultLeftDockWidth,
    ),
    isLeftDockViewportSplit: value.isLeftDockViewportSplit === true,
    browserShell: cloneBrowserShellState({
      isCollapsed: isRecord(value.browserShell) && value.browserShell.isCollapsed === true,
      isFloating: isRecord(value.browserShell) && value.browserShell.isFloating === true,
      isPoppedOut: isRecord(value.browserShell) && value.browserShell.isPoppedOut === true,
      isViewportSplit: isRecord(value.browserShell) && value.browserShell.isViewportSplit === true,
      position: {
        x:
          isRecord(value.browserShell) && isRecord(value.browserShell.position)
            ? roundNumber(Number(value.browserShell.position.x), 16)
            : 16,
        y:
          isRecord(value.browserShell) && isRecord(value.browserShell.position)
            ? roundNumber(Number(value.browserShell.position.y), 96)
            : 96,
      },
      size: {
        width:
          isRecord(value.browserShell) && isRecord(value.browserShell.size)
            ? roundNumber(Number(value.browserShell.size.width), 320)
            : 320,
        height:
          isRecord(value.browserShell) && isRecord(value.browserShell.size)
            ? roundNumber(Number(value.browserShell.size.height), 560)
            : 560,
      },
      viewportSplitRatio:
        isRecord(value.browserShell) &&
        typeof value.browserShell.viewportSplitRatio === 'number' &&
        Number.isFinite(value.browserShell.viewportSplitRatio)
          ? value.browserShell.viewportSplitRatio
          : defaultBrowserViewportSplitRatio,
      viewportSplitDockSide:
        isRecord(value.browserShell) &&
        (value.browserShell.viewportSplitDockSide === 'top' ||
          value.browserShell.viewportSplitDockSide === 'right' ||
          value.browserShell.viewportSplitDockSide === 'bottom' ||
          value.browserShell.viewportSplitDockSide === 'left')
          ? value.browserShell.viewportSplitDockSide
          : defaultBrowserViewportSplitDockSide,
      popoutState:
        isRecord(value.browserShell) && isRecord(value.browserShell.popoutState)
          ? cloneWorkspacePopoutSurfaceState({
              childWindowId:
                typeof value.browserShell.popoutState.childWindowId === 'string'
                  ? value.browserShell.popoutState.childWindowId
                  : defaultBrowserPopoutState.childWindowId,
              owner:
                value.browserShell.popoutState.owner === 'main-app'
                  ? 'main-app'
                  : 'child-window',
              windowName:
                typeof value.browserShell.popoutState.windowName === 'string'
                  ? value.browserShell.popoutState.windowName
                  : defaultBrowserPopoutState.windowName,
              windowTitle:
                typeof value.browserShell.popoutState.windowTitle === 'string'
                  ? value.browserShell.popoutState.windowTitle
                  : defaultBrowserPopoutState.windowTitle,
              windowFeatures:
                typeof value.browserShell.popoutState.windowFeatures === 'string'
                  ? value.browserShell.popoutState.windowFeatures
                  : defaultBrowserPopoutState.windowFeatures,
            })
          : defaultBrowserPopoutState,
    }),
    primaryViewportId,
    viewportChromeById,
    editorSurfacePlacementById: Object.fromEntries(editorSurfaceEntries),
  }
}

export const readPersistedWorkspaceLayout = (): PersistedWorkspaceLayout | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  try {
    const rawValue = window.localStorage.getItem(workspaceLayoutStorageKey)
    if (rawValue === null || rawValue.length === 0) {
      return null
    }
    return normalizePersistedWorkspaceLayout(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export const writePersistedWorkspaceLayout = (layout: PersistedWorkspaceLayout): void => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(workspaceLayoutStorageKey, JSON.stringify(layout))
  } catch {
    // Ignore storage write failures so the workspace keeps working without persistence.
  }
}
