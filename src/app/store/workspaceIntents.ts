import type {
  ConsoleContextSyncReason,
  ConsoleWorkspaceContextHandoff,
  FloatingShellActivationTarget,
  WorkspaceSelectedTarget,
  WorkspaceSurface,
} from './useAppStore'
import { buildImportedReferenceRowId } from './useAppStore'
import { commitWorkspaceTargetSelection } from './workspaceSelectionCommands'

type ViewportPosition = {
  x: number
  y: number
}

type EditorViewportRecord = {
  editorViewportId: string
  graphDocumentId: string
}

type WorkspaceIntentAppDeps = {
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => void
  setActiveSurface: (surface: WorkspaceSurface | null) => void
  requestFloatingShellActivation: (target: FloatingShellActivationTarget) => void
  requestConsoleContextSync?: (reason: ConsoleContextSyncReason) => void
  requestConsoleWorkspaceContextHandoff?: (
    handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
  ) => void
  setReferenceItemVisibility?: (referenceId: string, visible: boolean) => void
  beginReferenceTransform?: (referenceId: string) => void
  beginReferenceTransformShell?: (referenceId: string) => void
  selectPart?: (partKey: string | null) => void
}

type WorkspaceIntentSpaghettiDeps = {
  activeEditorViewportId: string
  editorViewportsById: Record<string, EditorViewportRecord>
  openGraphDocumentInViewport: (graphDocumentId: string) => string | null
  openGraphDocumentInNewViewport: (graphDocumentId: string) => string | null
  swapFocusedEditorViewportToGraphDocument: (graphDocumentId: string) => string | null
  setActiveEditorViewportId: (editorViewportId: string) => void
  setEditorViewportPosition: (editorViewportId: string, position: ViewportPosition) => void
  setSelectedNodeId: (nodeId: string | null) => void
  requestEditorViewportNodeFit: (editorViewportId: string, nodeId: string) => void
  startSketchPlanePick?: (nodeId: string) => void
  startGeometrySketchSession?: (nodeId: string, mode: 'draw' | 'review') => void
}

export type WorkspaceIntentDeps = {
  app: WorkspaceIntentAppDeps
  spaghetti: WorkspaceIntentSpaghettiDeps
}

export type OpenGraphDocumentIntentStrategy =
  | 'open-or-focus'
  | 'swap-focused-or-open'
  | 'open-new'

export type OpenGraphDocumentIntentOptions = {
  strategy?: OpenGraphDocumentIntentStrategy
  spawnPosition?: ViewportPosition
}

export type OpenGraphDocumentIntentResult = {
  graphDocumentId: string
  editorViewportId: string | null
  createdNewViewport: boolean
}

export type ActivateGraphDocumentIntentOptions = OpenGraphDocumentIntentOptions

export type ActivateGraphNodeIntentOptions = OpenGraphDocumentIntentOptions & {
  fitNodeInViewport?: boolean
}

const findViewportForGraphDocument = (
  editorViewportsById: Record<string, EditorViewportRecord>,
  graphDocumentId: string,
): EditorViewportRecord | undefined =>
  Object.values(editorViewportsById).find((viewport) => viewport.graphDocumentId === graphDocumentId)

export const selectTargetIntent = (
  deps: WorkspaceIntentDeps,
  target: WorkspaceSelectedTarget | null,
): WorkspaceSelectedTarget | null => {
  commitWorkspaceTargetSelection(
    {
      setWorkspaceSelectedTarget: deps.app.setWorkspaceSelectedTarget,
      requestConsoleContextSync: deps.app.requestConsoleContextSync,
    },
    target,
  )
  if (target === null || target.kind === 'graph-document') {
    deps.spaghetti.setSelectedNodeId(null)
  } else if (target.kind === 'graph-node') {
    deps.spaghetti.setSelectedNodeId(target.nodeId)
  }
  return target
}

export const activateSurfaceIntent = (
  deps: WorkspaceIntentDeps,
  surface: WorkspaceSurface | null,
): WorkspaceSurface | null => {
  deps.app.setActiveSurface(surface)
  if (surface === 'browser' || surface === 'spaghetti') {
    deps.app.requestFloatingShellActivation(surface)
  }
  return surface
}

export const focusEditorViewportIntent = (
  deps: WorkspaceIntentDeps,
  editorViewportId: string,
): string | null => {
  if (deps.spaghetti.editorViewportsById[editorViewportId] === undefined) {
    return null
  }
  deps.spaghetti.setActiveEditorViewportId(editorViewportId)
  return editorViewportId
}

export const openGraphDocumentIntent = (
  deps: WorkspaceIntentDeps,
  graphDocumentId: string,
  options: OpenGraphDocumentIntentOptions = {},
): OpenGraphDocumentIntentResult => {
  const strategy = options.strategy ?? 'open-or-focus'
  const existingViewport = findViewportForGraphDocument(
    deps.spaghetti.editorViewportsById,
    graphDocumentId,
  )

  if (strategy === 'open-new') {
    const editorViewportId = deps.spaghetti.openGraphDocumentInNewViewport(graphDocumentId)
    if (editorViewportId !== null && options.spawnPosition !== undefined) {
      deps.spaghetti.setEditorViewportPosition(editorViewportId, options.spawnPosition)
    }
    return {
      graphDocumentId,
      editorViewportId,
      createdNewViewport: editorViewportId !== null,
    }
  }

  if (strategy === 'swap-focused-or-open' && deps.spaghetti.activeEditorViewportId.length > 0) {
    const swappedViewportId = deps.spaghetti.swapFocusedEditorViewportToGraphDocument(graphDocumentId)
    if (swappedViewportId !== null) {
      return {
        graphDocumentId,
        editorViewportId: swappedViewportId,
        createdNewViewport: false,
      }
    }
  }

  const editorViewportId = deps.spaghetti.openGraphDocumentInViewport(graphDocumentId)
  const createdNewViewport = existingViewport === undefined && editorViewportId !== null
  if (createdNewViewport && editorViewportId !== null && options.spawnPosition !== undefined) {
    deps.spaghetti.setEditorViewportPosition(editorViewportId, options.spawnPosition)
  }
  return {
    graphDocumentId,
    editorViewportId,
    createdNewViewport,
  }
}

export const activateGraphDocumentIntent = (
  deps: WorkspaceIntentDeps,
  graphDocumentId: string,
  options: ActivateGraphDocumentIntentOptions = {},
): OpenGraphDocumentIntentResult => {
  const result = openGraphDocumentIntent(deps, graphDocumentId, options)
  selectTargetIntent(deps, {
    kind: 'graph-document',
    graphDocumentId,
  })
  activateSurfaceIntent(deps, 'spaghetti')
  return result
}

export const activateGraphNodeIntent = (
  deps: WorkspaceIntentDeps,
  graphDocumentId: string,
  nodeId: string,
  options: ActivateGraphNodeIntentOptions = {},
): OpenGraphDocumentIntentResult & { nodeId: string } => {
  const result = openGraphDocumentIntent(deps, graphDocumentId, options)
  selectTargetIntent(deps, {
    kind: 'graph-node',
    graphDocumentId,
    nodeId,
  })
  activateSurfaceIntent(deps, 'spaghetti')
  if (options.fitNodeInViewport && result.editorViewportId !== null) {
    deps.spaghetti.requestEditorViewportNodeFit(result.editorViewportId, nodeId)
  }
  return {
    ...result,
    nodeId,
  }
}

export const startSketchPlaneIntent = (
  deps: WorkspaceIntentDeps,
  graphDocumentId: string,
  nodeId: string,
): OpenGraphDocumentIntentResult & { nodeId: string } => {
  const result = activateGraphNodeIntent(deps, graphDocumentId, nodeId)
  deps.spaghetti.startSketchPlanePick?.(nodeId)
  return result
}

export const startSketchDrawIntent = (
  deps: WorkspaceIntentDeps,
  graphDocumentId: string,
  nodeId: string,
): OpenGraphDocumentIntentResult & { nodeId: string } => {
  const result = activateGraphNodeIntent(deps, graphDocumentId, nodeId)
  deps.spaghetti.startGeometrySketchSession?.(nodeId, 'draw')
  return result
}

export const activateReferenceItemIntent = (
  deps: WorkspaceIntentDeps,
  referenceId: string,
  options: {
    ensureVisible?: boolean
    beginTransform?: boolean
  } = {},
): { referenceId: string } => {
  if (options.ensureVisible ?? false) {
    deps.app.setReferenceItemVisibility?.(referenceId, true)
  }
  commitWorkspaceTargetSelection(
    {
      setWorkspaceSelectedTarget: deps.app.setWorkspaceSelectedTarget,
      selectPart: deps.app.selectPart,
      requestConsoleContextSync: deps.app.requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff: deps.app.requestConsoleWorkspaceContextHandoff,
    },
    {
      kind: 'object',
      objectId: buildImportedReferenceRowId(referenceId),
    },
    {
      activeSurface: 'browser',
      selectedPartKey: null,
    },
  )
  activateSurfaceIntent(deps, 'browser')
  if (options.beginTransform ?? false) {
    deps.app.beginReferenceTransform?.(referenceId)
    deps.app.beginReferenceTransformShell?.(referenceId)
  }
  return { referenceId }
}

export const activateObjectIntent = (
  deps: WorkspaceIntentDeps,
  objectId: string,
  options: {
    partKey?: string | null
  } = {},
): { objectId: string } => {
  commitWorkspaceTargetSelection(
    {
      setWorkspaceSelectedTarget: deps.app.setWorkspaceSelectedTarget,
      selectPart: deps.app.selectPart,
      requestConsoleContextSync: deps.app.requestConsoleContextSync,
      requestConsoleWorkspaceContextHandoff: deps.app.requestConsoleWorkspaceContextHandoff,
    },
    {
      kind: 'object',
      objectId,
    },
    {
      activeSurface: 'browser',
      selectedPartKey: options.partKey,
    },
  )
  activateSurfaceIntent(deps, 'browser')
  return { objectId }
}
