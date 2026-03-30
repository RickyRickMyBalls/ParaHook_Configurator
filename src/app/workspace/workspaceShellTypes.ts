import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDockSide,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from './workspaceSplitTypes'

export type LeftDockPanelId = 'browser' | 'meatball-editor'

export type LeftDockResizeMenuState = {
  x: number
  y: number
}

export type WorkspaceSplitMenuState = {
  x: number
  y: number
  scope: 'floating-titlebar' | 'divider'
}

export type BrowserFloatingPosition = {
  x: number
  y: number
}

export type BrowserFloatingSize = {
  width: number
  height: number
}

export type BrowserShellState = {
  isCollapsed: boolean
  isFloating: boolean
  isPoppedOut: boolean
  isViewportSplit: boolean
  position: BrowserFloatingPosition
  size: BrowserFloatingSize
  viewportSplitRatio: number
  viewportSplitDockSide: WorkspaceSplitDockSide
  popoutState: WorkspacePopoutSurfaceState | null
}

export type WorkspaceSurfaceKind = 'modelViewer' | 'browser' | 'console' | 'spaghettiEditor'

export type WorkspaceSurfaceInstanceId = string
export type WorkspaceViewportId = WorkspaceSurfaceInstanceId

export type WorkspacePresentationMode = 'windowed' | 'tiled'

export type WorkspaceHostedSurfaceWindowOwner = 'main-app' | 'child-window'
export type WorkspaceChildWindowId = string

export type WorkspaceChildWindowSpec = {
  childWindowId: WorkspaceChildWindowId
  windowName: string
  windowTitle: string
  windowFeatures: string
}

export type WorkspacePopoutSurfaceState = WorkspaceChildWindowSpec & {
  owner: WorkspaceHostedSurfaceWindowOwner
}

export type EditorSurfaceWindowMode =
  | 'collapsed'
  | 'meatball editor view'
  | 'expanded'
  | 'maximized'
  | 'split view'
  | 'separateWindow'

export type EditorSurfacePosition = {
  x: number
  y: number
}

export type EditorSurfaceSize = {
  width: number
  height: number
}

export type EditorSurfaceRestoreFromCollapsed = {
  windowMode: 'expanded' | 'maximized' | 'split view'
  position?: EditorSurfacePosition
  size?: EditorSurfaceSize
  splitRatio?: number
}

export type EditorSurfaceRestoreFromSplit = {
  windowMode: 'expanded' | 'maximized'
  position?: EditorSurfacePosition
  size?: EditorSurfaceSize
}

export type EditorWorkspaceSurfaceState = {
  surfaceKind: 'spaghettiEditor'
  surfaceInstanceId: WorkspaceSurfaceInstanceId
  presentationMode: WorkspacePresentationMode
  windowMode: EditorSurfaceWindowMode
  position: EditorSurfacePosition
  size: EditorSurfaceSize
  splitRatio: number
  splitDirection: WorkspaceSplitDirection
  splitDockSide: WorkspaceSplitDockSide
  splitPriority: WorkspaceSplitPriority
  restoreFromCollapsed: EditorSurfaceRestoreFromCollapsed | null
  restoreFromSplit: EditorSurfaceRestoreFromSplit | null
}

export type WorkspaceViewportChromeState = {
  viewportId: WorkspaceViewportId
  surfaceKind: 'modelViewer'
}

export type PersistedWorkspaceLayout = {
  version: 1
  leftDockWidth: number
  isLeftDockViewportSplit: boolean
  browserShell: BrowserShellState
  primaryViewportId: WorkspaceViewportId
  viewportChromeById: Record<string, WorkspaceViewportChromeState>
  editorSurfacePlacementById: Record<string, EditorWorkspaceSurfaceState>
}

export const defaultLeftDockWidth = 320
export const defaultPrimaryWorkspaceViewportId: WorkspaceViewportId = 'model-viewer-primary'

export const defaultBrowserFloatingPosition: BrowserFloatingPosition = { x: 16, y: 96 }
export const defaultBrowserFloatingSize: BrowserFloatingSize = { width: 320, height: 560 }
export const defaultBrowserViewportSplitRatio = 0.5
export const defaultBrowserViewportSplitDockSide: WorkspaceSplitDockSide = 'right'
export const defaultBrowserPopoutState: WorkspacePopoutSurfaceState = {
  childWindowId: 'browser-surface-popout',
  owner: 'child-window',
  windowName: 'parahook-browser',
  windowTitle: 'ParaHook Browser',
  windowFeatures: 'popup=yes,width=1080,height=720,resizable=yes,scrollbars=no',
}
export const defaultEditorSurfacePosition: EditorSurfacePosition = { x: 344, y: 16 }
export const defaultEditorSurfaceSize: EditorSurfaceSize = { width: 980, height: 760 }
export const defaultEditorSurfaceSplitRatio = 0.5

export const resolveWorkspacePresentationMode = (
  windowMode: EditorSurfaceWindowMode,
): WorkspacePresentationMode => (windowMode === 'split view' ? 'tiled' : 'windowed')

export const createDefaultEditorWorkspaceSurfaceState = (
  surfaceInstanceId: WorkspaceSurfaceInstanceId,
): EditorWorkspaceSurfaceState => ({
  surfaceKind: 'spaghettiEditor',
  surfaceInstanceId,
  presentationMode: 'windowed',
  windowMode: 'expanded',
  position: defaultEditorSurfacePosition,
  size: defaultEditorSurfaceSize,
  splitRatio: defaultEditorSurfaceSplitRatio,
  splitDirection: defaultWorkspaceSplitDirection,
  splitDockSide: resolveDefaultWorkspaceSplitDockSide(defaultWorkspaceSplitDirection),
  splitPriority: defaultWorkspaceSplitPriority,
  restoreFromCollapsed: null,
  restoreFromSplit: null,
})

export const createDefaultWorkspaceViewportChromeState = (
  viewportId: WorkspaceViewportId,
): WorkspaceViewportChromeState => ({
  viewportId,
  surfaceKind: 'modelViewer',
})
