import { create } from 'zustand'
import {
  createDefaultEditorWorkspaceSurfaceState,
  createDefaultWorkspaceViewportChromeState,
  defaultBrowserFloatingPosition,
  defaultBrowserPopoutState,
  defaultBrowserFloatingSize,
  defaultBrowserViewportSplitDockSide,
  defaultBrowserViewportSplitRatio,
  defaultLeftDockWidth,
  defaultPrimaryWorkspaceViewportId,
  type BrowserShellState,
  type BrowserFloatingPosition,
  type BrowserFloatingSize,
  type EditorWorkspaceSurfaceState,
  type LeftDockPanelId,
  type LeftDockResizeMenuState,
  type PersistedWorkspaceLayout,
  type WorkspacePopoutSurfaceState,
  type WorkspaceViewportChromeState,
  type WorkspaceViewportId,
  type WorkspaceSplitMenuState,
} from './workspaceShellTypes'
import { type WorkspaceSplitDockSide } from './workspaceSplitTypes'

type WorkspaceStoreState = {
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  activeLeftDockPreviewPanelId: LeftDockPanelId | null
  leftDockResizeMenu: LeftDockResizeMenuState | null
  workspaceSplitMenu: WorkspaceSplitMenuState | null
  browserShell: BrowserShellState
  primaryViewportId: WorkspaceViewportId
  viewportChromeById: Record<string, WorkspaceViewportChromeState>
  editorSurfacePlacementById: Record<string, EditorWorkspaceSurfaceState>
  setLeftDockWidth: (width: number) => void
  setLeftDockViewportSplit: (isSplit: boolean) => void
  setActiveLeftDockPreviewPanelId: (panelId: LeftDockPanelId | null) => void
  setLeftDockResizeMenu: (menu: LeftDockResizeMenuState | null) => void
  setWorkspaceSplitMenu: (menu: WorkspaceSplitMenuState | null) => void
  setBrowserCollapsed: (isCollapsed: boolean) => void
  setBrowserFloating: (isFloating: boolean) => void
  setBrowserPoppedOut: (isPoppedOut: boolean) => void
  setBrowserViewportSplit: (isViewportSplit: boolean) => void
  setBrowserFloatingPosition: (position: BrowserFloatingPosition) => void
  setBrowserFloatingSize: (size: BrowserFloatingSize) => void
  setBrowserViewportSplitRatio: (splitRatio: number) => void
  setBrowserViewportSplitDockSide: (splitDockSide: WorkspaceSplitDockSide) => void
  setBrowserPopoutState: (popoutState: WorkspacePopoutSurfaceState | null) => void
  hydratePersistedWorkspaceLayout: (layout: PersistedWorkspaceLayout) => void
  ensureViewportChrome: (viewportId: WorkspaceViewportId) => void
  ensureEditorSurfacePlacement: (
    surfaceInstanceId: string,
    seed?: Partial<EditorWorkspaceSurfaceState>,
  ) => void
  setEditorSurfacePlacement: (
    surfaceInstanceId: string,
    placement: EditorWorkspaceSurfaceState,
  ) => void
  removeEditorSurfacePlacement: (surfaceInstanceId: string) => void
}

const createInitialState = (): Omit<
  WorkspaceStoreState,
  | 'setLeftDockWidth'
  | 'setLeftDockViewportSplit'
  | 'setActiveLeftDockPreviewPanelId'
  | 'setLeftDockResizeMenu'
  | 'setWorkspaceSplitMenu'
  | 'setBrowserCollapsed'
  | 'setBrowserFloating'
  | 'setBrowserPoppedOut'
  | 'setBrowserViewportSplit'
  | 'setBrowserFloatingPosition'
  | 'setBrowserFloatingSize'
  | 'setBrowserViewportSplitRatio'
  | 'setBrowserViewportSplitDockSide'
  | 'setBrowserPopoutState'
  | 'hydratePersistedWorkspaceLayout'
  | 'ensureViewportChrome'
  | 'ensureEditorSurfacePlacement'
  | 'setEditorSurfacePlacement'
  | 'removeEditorSurfacePlacement'
> => ({
  leftDockWidth: defaultLeftDockWidth,
  isLeftDockViewportSplit: false,
  activeLeftDockPreviewPanelId: null,
  leftDockResizeMenu: null,
  workspaceSplitMenu: null,
  browserShell: {
    isCollapsed: false,
    isFloating: false,
    isPoppedOut: false,
    isViewportSplit: false,
    position: defaultBrowserFloatingPosition,
    size: defaultBrowserFloatingSize,
    viewportSplitRatio: defaultBrowserViewportSplitRatio,
    viewportSplitDockSide: defaultBrowserViewportSplitDockSide,
    popoutState: defaultBrowserPopoutState,
  },
  primaryViewportId: defaultPrimaryWorkspaceViewportId,
  viewportChromeById: {
    [defaultPrimaryWorkspaceViewportId]:
      createDefaultWorkspaceViewportChromeState(defaultPrimaryWorkspaceViewportId),
  },
  editorSurfacePlacementById: {},
})

export const useWorkspaceStore = create<WorkspaceStoreState>((set) => ({
  ...createInitialState(),
  setLeftDockWidth: (leftDockWidth) => {
    set({
      leftDockWidth: Math.round(leftDockWidth),
    })
  },
  setLeftDockViewportSplit: (isLeftDockViewportSplit) => {
    set({
      isLeftDockViewportSplit,
    })
  },
  setActiveLeftDockPreviewPanelId: (activeLeftDockPreviewPanelId) => {
    set({
      activeLeftDockPreviewPanelId,
    })
  },
  setLeftDockResizeMenu: (leftDockResizeMenu) => {
    set({
      leftDockResizeMenu,
    })
  },
  setWorkspaceSplitMenu: (workspaceSplitMenu) => {
    set({
      workspaceSplitMenu,
    })
  },
  setBrowserCollapsed: (isCollapsed) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isCollapsed,
      },
    }))
  },
  setBrowserFloating: (isFloating) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isFloating,
        isPoppedOut: isFloating ? false : state.browserShell.isPoppedOut,
        isViewportSplit: isFloating ? false : state.browserShell.isViewportSplit,
      },
    }))
  },
  setBrowserPoppedOut: (isPoppedOut) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isFloating: isPoppedOut ? false : state.browserShell.isFloating,
        isViewportSplit: isPoppedOut ? false : state.browserShell.isViewportSplit,
        isPoppedOut,
        popoutState: isPoppedOut
          ? state.browserShell.popoutState ?? defaultBrowserPopoutState
          : state.browserShell.popoutState,
      },
    }))
  },
  setBrowserViewportSplit: (isViewportSplit) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        isFloating: isViewportSplit ? false : state.browserShell.isFloating,
        isPoppedOut: isViewportSplit ? false : state.browserShell.isPoppedOut,
        isViewportSplit,
      },
    }))
  },
  setBrowserFloatingPosition: (position) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        position: {
          x: Math.round(position.x),
          y: Math.round(position.y),
        },
      },
    }))
  },
  setBrowserFloatingSize: (size) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        size: {
          width: Math.round(size.width),
          height: Math.round(size.height),
        },
      },
    }))
  },
  setBrowserViewportSplitRatio: (viewportSplitRatio) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        viewportSplitRatio: Math.min(0.85, Math.max(0.15, viewportSplitRatio)),
      },
    }))
  },
  setBrowserViewportSplitDockSide: (viewportSplitDockSide) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        viewportSplitDockSide,
      },
    }))
  },
  setBrowserPopoutState: (popoutState) => {
    set((state) => ({
      browserShell: {
        ...state.browserShell,
        popoutState,
      },
    }))
  },
  hydratePersistedWorkspaceLayout: (layout) => {
    set({
      leftDockWidth: Math.round(layout.leftDockWidth),
      isLeftDockViewportSplit: layout.isLeftDockViewportSplit,
      browserShell: {
        isCollapsed: layout.browserShell.isCollapsed,
        isFloating: layout.browserShell.isFloating,
        isPoppedOut: layout.browserShell.isPoppedOut,
        isViewportSplit: layout.browserShell.isViewportSplit,
        position: {
          x: Math.round(layout.browserShell.position.x),
          y: Math.round(layout.browserShell.position.y),
        },
        size: {
          width: Math.round(layout.browserShell.size.width),
          height: Math.round(layout.browserShell.size.height),
        },
        viewportSplitRatio: layout.browserShell.viewportSplitRatio,
        viewportSplitDockSide: layout.browserShell.viewportSplitDockSide,
        popoutState: layout.browserShell.popoutState,
      },
      primaryViewportId: layout.primaryViewportId,
      viewportChromeById: {
        ...layout.viewportChromeById,
      },
      editorSurfacePlacementById: {
        ...layout.editorSurfacePlacementById,
      },
    })
  },
  ensureViewportChrome: (viewportId) => {
    set((state) => {
      if (state.viewportChromeById[viewportId] !== undefined) {
        return state
      }
      return {
        viewportChromeById: {
          ...state.viewportChromeById,
          [viewportId]: createDefaultWorkspaceViewportChromeState(viewportId),
        },
      }
    })
  },
  ensureEditorSurfacePlacement: (surfaceInstanceId, seed) => {
    set((state) => {
      if (state.editorSurfacePlacementById[surfaceInstanceId] !== undefined) {
        return state
      }
      return {
        editorSurfacePlacementById: {
          ...state.editorSurfacePlacementById,
          [surfaceInstanceId]: {
            ...createDefaultEditorWorkspaceSurfaceState(surfaceInstanceId),
            ...seed,
          },
        },
      }
    })
  },
  setEditorSurfacePlacement: (surfaceInstanceId, placement) => {
    set((state) => ({
      editorSurfacePlacementById: {
        ...state.editorSurfacePlacementById,
        [surfaceInstanceId]: {
          ...placement,
          surfaceInstanceId,
        },
      },
    }))
  },
  removeEditorSurfacePlacement: (surfaceInstanceId) => {
    set((state) => {
      if (state.editorSurfacePlacementById[surfaceInstanceId] === undefined) {
        return state
      }
      const nextEditorSurfacePlacementById = { ...state.editorSurfacePlacementById }
      delete nextEditorSurfacePlacementById[surfaceInstanceId]
      return {
        editorSurfacePlacementById: nextEditorSurfacePlacementById,
      }
    })
  },
}))
