import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import {
  clearWorkspaceTargetSelection,
  commitWorkspaceExplicitSelection,
} from '../store/workspaceSelectionCommands'
import type {
  ConsoleContextSyncReason,
  WorkspaceSelectedTarget,
  WorkspaceSurface,
} from '../store/useAppStore'
import type { ReferenceCategoryId } from '../references/referenceManifest'
import { describeBrowserRow, isExplicitSelectionRow } from './browserRowFamilies'
import type { BrowserRenderableRowVm } from './selectBrowserTreeRows'

export type BrowserSelectionModifiers = {
  ctrlKey: boolean
  shiftKey: boolean
}

export type BrowserRowInteractionHandlers = {
  clearBrowserSelection: () => void
  handleSelectBrowserRow: (
    row: BrowserRenderableRowVm,
    modifiers?: BrowserSelectionModifiers,
  ) => void
  handleDoubleSelectBrowserRow: (row: BrowserRenderableRowVm) => void
  handleToggleBrowserRowExpand: (row: BrowserRenderableRowVm) => void
  handleToggleReferenceVisibility: (row: BrowserRenderableRowVm) => void
  handleToggleSketchVisibility: (row: BrowserRenderableRowVm) => void
  handleToggleContentVisibility: (row: BrowserRenderableRowVm) => void
  resolveSelectedBrowserRowIdFromTarget: (target: WorkspaceSelectedTarget | null) => string | null
}

type BrowserTreeRowsForInteraction = {
  referenceRows: BrowserRenderableRowVm[]
  contentRows: BrowserRenderableRowVm[]
}

export type BrowserRowInteractionDeps = {
  browserTreeRows: BrowserTreeRowsForInteraction
  graphDocumentsById: Record<string, GraphDocument>
  referenceWorkspaceRootRowId: string
  buildProjectSketchBrowserRowId: (
    graphDocumentId: string,
    nodeId: string,
    featureId: string,
  ) => string
  workspaceSelectedTarget: WorkspaceSelectedTarget | null
  workspaceExplicitSelectedTargets: WorkspaceSelectedTarget[]
  workspaceSelectionAnchorTarget: WorkspaceSelectedTarget | null
  workspaceIntentDeps: WorkspaceIntentDeps
  newEditorSpawnPosition: { x: number; y: number }
  sharedViewerCompositionActive: boolean
  closeMenus: () => void
  setLocalSelectedBrowserRowId: (rowId: string | null | ((current: string | null) => string | null)) => void
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => void
  setWorkspaceExplicitSelection: (selection: {
    selectedTarget: WorkspaceSelectedTarget | null
    explicitSelectedTargets: WorkspaceSelectedTarget[]
    selectionAnchorTarget: WorkspaceSelectedTarget | null
  }) => void
  setActiveSurface: (surface: WorkspaceSurface | null) => void
  selectPart: (partKey: string | null) => void
  requestConsoleContextSync: (reason: ConsoleContextSyncReason) => void
  setActiveEditorViewportId: (editorViewportId: string) => void
  toggleReferenceWorkspaceExpanded: () => void
  toggleReferenceCategoryExpanded: (categoryId: ReferenceCategoryId) => void
  toggleReferenceItemVisibility: (referenceId: string) => void
  toggleReferenceCategoryVisibility: (categoryId: ReferenceCategoryId) => void
  toggleSketchVisibility: (rowId: string) => void
  setPartVisibility: (partKey: string, isVisible: boolean) => void
  setExpandedGraphDocumentIds: (
    updater: (currentIds: string[]) => string[],
  ) => void
  setGraphSectionExpandedByRowId: (
    updater: (current: Record<string, boolean>) => Record<string, boolean>,
  ) => void
  setCollapsedContentRowIds: (
    updater: (currentIds: string[]) => string[],
  ) => void
  appendBrowserEntry: (text: string) => void
}

export type BrowserTargetRowResolverDeps = {
  graphDocumentsById: Record<string, GraphDocument>
  referenceWorkspaceRootRowId: string
  buildProjectSketchBrowserRowId: (
    graphDocumentId: string,
    nodeId: string,
    featureId: string,
  ) => string
}

const isExplicitSelectionTarget = (
  target: WorkspaceSelectedTarget | null,
): target is Extract<
  WorkspaceSelectedTarget,
  | { kind: 'assembly' }
  | { kind: 'component' }
  | { kind: 'object' }
> =>
  target !== null &&
  (target.kind === 'assembly' ||
    target.kind === 'component' ||
    target.kind === 'object')

const getWorkspaceTargetKey = (target: WorkspaceSelectedTarget): string => {
  switch (target.kind) {
    case 'references-root':
      return 'references-root'
    case 'reference-category':
      return `reference-category:${target.categoryId}`
    case 'reference-item':
      return `reference-item:${target.referenceId}`
    case 'assembly':
      return `assembly:${target.assemblyId}`
    case 'component':
      return `component:${target.componentId}`
    case 'object':
      return `object:${target.objectId}`
    case 'graph-document':
      return `graph-document:${target.graphDocumentId}`
    case 'graph-node':
      return `graph-node:${target.graphDocumentId}:${target.nodeId}`
    case 'part':
      return `part:${target.partKey}`
  }
}

const buildExplicitSelectionTargetFromRow = (
  row: BrowserRenderableRowVm,
): WorkspaceSelectedTarget | null => {
  switch (row.rowKind) {
    case 'references-root':
      return { kind: 'assembly', assemblyId: row.rowId }
    case 'reference-category':
      return { kind: 'component', componentId: row.rowId }
    case 'reference-item':
      return { kind: 'object', objectId: row.rowId }
    case 'assembly':
      return { kind: 'assembly', assemblyId: row.rowId }
    case 'component':
      return { kind: 'component', componentId: row.rowId }
    case 'object':
      return { kind: 'object', objectId: row.rowId }
    default:
      return null
  }
}

export const createBrowserRowInteractionHandlers = (
  deps: BrowserRowInteractionDeps,
): BrowserRowInteractionHandlers => {
  const resolveSelectedBrowserRowIdFromTarget = (target: WorkspaceSelectedTarget | null): string | null =>
    resolveBrowserSelectedRowIdFromTarget(target, deps)

  const getExplicitSelectionSectionRows = (row: BrowserRenderableRowVm): BrowserRenderableRowVm[] => {
    if (
      row.rowKind === 'reference-item' ||
      row.rowKind === 'assembly' ||
      row.rowKind === 'component' ||
      row.rowKind === 'object' ||
      row.rowKind === 'part'
    ) {
      return deps.browserTreeRows.contentRows.filter(
        (contentRow) =>
          contentRow.rowKind === 'assembly' ||
          contentRow.rowKind === 'component' ||
          contentRow.rowKind === 'object' ||
          contentRow.rowKind === 'part',
      )
    }
    return []
  }

  const commitExplicitSelectionTargets = (
    explicitTargets: WorkspaceSelectedTarget[],
    selectedTarget: WorkspaceSelectedTarget | null,
    selectionAnchorTarget: WorkspaceSelectedTarget | null,
    selectedRow: BrowserRenderableRowVm,
  ) => {
    commitWorkspaceExplicitSelection(
      {
        setWorkspaceExplicitSelection: deps.setWorkspaceExplicitSelection,
        setActiveSurface: deps.setActiveSurface,
        selectPart: deps.selectPart,
        requestConsoleContextSync: deps.requestConsoleContextSync,
      },
      {
        selectedTarget,
        explicitSelectedTargets: explicitTargets,
        selectionAnchorTarget,
      },
      {
        activeSurface: 'browser',
        selectedPartKey:
          selectedRow.rowKind === 'part'
            ? selectedRow.partKey
            : selectedRow.rowKind === 'object' && !deps.sharedViewerCompositionActive
              ? selectedRow.highlightViewerKey
            : null,
      },
    )
  }

  const clearBrowserSelection = () => {
    deps.setLocalSelectedBrowserRowId(null)
    clearWorkspaceTargetSelection(
      {
        setWorkspaceSelectedTarget: deps.setWorkspaceSelectedTarget,
        selectPart: deps.selectPart,
        requestConsoleContextSync: deps.requestConsoleContextSync,
      },
      {
        syncReason: 'target-selection',
      },
    )
  }

  const handleSelectBrowserRow = (
    row: BrowserRenderableRowVm,
    modifiers: BrowserSelectionModifiers = { ctrlKey: false, shiftKey: false },
  ) => {
    deps.setLocalSelectedBrowserRowId(row.rowId)
    deps.closeMenus()

    if (isExplicitSelectionRow(row)) {
      const explicitSelectionTarget = buildExplicitSelectionTargetFromRow(row)
      if (explicitSelectionTarget !== null) {
        const currentExplicitTargets =
          deps.workspaceExplicitSelectedTargets.length > 0
            ? deps.workspaceExplicitSelectedTargets
            : deps.workspaceSelectedTarget !== null
              ? isExplicitSelectionTarget(deps.workspaceSelectedTarget)
                ? [deps.workspaceSelectedTarget]
                : []
              : []

        if (modifiers.shiftKey) {
          const sectionRows = getExplicitSelectionSectionRows(row)
          const anchorRowId =
            deps.workspaceSelectionAnchorTarget === null
              ? null
              : resolveSelectedBrowserRowIdFromTarget(deps.workspaceSelectionAnchorTarget)
          const eligibleSectionRows = sectionRows.filter(isExplicitSelectionRow)
          const anchorIndex =
            anchorRowId === null
              ? -1
              : eligibleSectionRows.findIndex((sectionRow) => sectionRow.rowId === anchorRowId)
          const clickedIndex = eligibleSectionRows.findIndex(
            (sectionRow) => sectionRow.rowId === row.rowId,
          )
          if (anchorIndex !== -1 && clickedIndex !== -1) {
            const rangeTargets = eligibleSectionRows
              .slice(Math.min(anchorIndex, clickedIndex), Math.max(anchorIndex, clickedIndex) + 1)
              .map((sectionRow) => buildExplicitSelectionTargetFromRow(sectionRow))
              .filter((target): target is WorkspaceSelectedTarget => target !== null)
            deps.appendBrowserEntry(`Selected ${describeBrowserRow(row)}`)
            commitExplicitSelectionTargets(
              rangeTargets,
              explicitSelectionTarget,
              deps.workspaceSelectionAnchorTarget,
              row,
            )
            return
          }
        } else if (modifiers.ctrlKey) {
          const existingIndex = currentExplicitTargets.findIndex(
            (target) =>
              getWorkspaceTargetKey(target) === getWorkspaceTargetKey(explicitSelectionTarget),
          )
          deps.appendBrowserEntry(`Selected ${describeBrowserRow(row)}`)
          if (existingIndex === -1) {
            commitExplicitSelectionTargets(
              [...currentExplicitTargets, explicitSelectionTarget],
              explicitSelectionTarget,
              explicitSelectionTarget,
              row,
            )
            return
          }

          const nextExplicitTargets = currentExplicitTargets.filter(
            (target) =>
              getWorkspaceTargetKey(target) !== getWorkspaceTargetKey(explicitSelectionTarget),
          )
          if (nextExplicitTargets.length === 0) {
            commitWorkspaceExplicitSelection(
              {
                setWorkspaceExplicitSelection: deps.setWorkspaceExplicitSelection,
                setActiveSurface: deps.setActiveSurface,
                selectPart: deps.selectPart,
                requestConsoleContextSync: deps.requestConsoleContextSync,
              },
              {
                selectedTarget: null,
                explicitSelectedTargets: [],
                selectionAnchorTarget: explicitSelectionTarget,
              },
              {
                activeSurface: 'browser',
                selectedPartKey: null,
              },
            )
            return
          }

          const nextPrimaryTarget =
            deps.workspaceSelectedTarget !== null &&
            getWorkspaceTargetKey(deps.workspaceSelectedTarget) !==
              getWorkspaceTargetKey(explicitSelectionTarget) &&
            nextExplicitTargets.some(
              (target) =>
                getWorkspaceTargetKey(target) === getWorkspaceTargetKey(deps.workspaceSelectedTarget!),
            )
              ? deps.workspaceSelectedTarget
              : nextExplicitTargets.at(-1) ?? null

          commitExplicitSelectionTargets(
            nextExplicitTargets,
            nextPrimaryTarget,
            explicitSelectionTarget,
            row,
          )
          return
        }

        deps.appendBrowserEntry(`Selected ${describeBrowserRow(row)}`)
        commitExplicitSelectionTargets(
          [explicitSelectionTarget],
          explicitSelectionTarget,
          explicitSelectionTarget,
          row,
        )
        return
      }
    }

    if (row.rowKind === 'sketches-root' || row.rowKind === 'graph-section') {
      return
    }
    if (row.rowKind === 'viewport') {
      deps.appendBrowserEntry(`Focused ${describeBrowserRow(row)}`)
      deps.setActiveEditorViewportId(row.editorViewportId)
      return
    }
    if (row.rowKind === 'sketch') {
      deps.appendBrowserEntry(`Focused ${describeBrowserRow(row)}`)
      activateGraphNodeIntent(deps.workspaceIntentDeps, row.authoringGraphDocumentId, row.authoringNodeId, {
        strategy: 'open-or-focus',
        spawnPosition: deps.newEditorSpawnPosition,
        fitNodeInViewport: true,
      })
      return
    }
    if (row.rowKind === 'graph-rebuild-object' || row.rowKind === 'graph-node') {
      deps.appendBrowserEntry(`Focused ${describeBrowserRow(row)}`)
      if (row.authoringNodeId === null) {
        activateGraphDocumentIntent(deps.workspaceIntentDeps, row.authoringGraphDocumentId, {
          strategy: 'open-or-focus',
          spawnPosition: deps.newEditorSpawnPosition,
        })
      } else {
        activateGraphNodeIntent(
          deps.workspaceIntentDeps,
          row.authoringGraphDocumentId,
          row.authoringNodeId,
          {
            strategy: 'open-or-focus',
            spawnPosition: deps.newEditorSpawnPosition,
            fitNodeInViewport: row.rowKind === 'graph-node',
          },
        )
      }
      return
    }
    if (row.rowKind !== 'graph-document') {
      return
    }
    const editorViewportId = activateGraphDocumentIntent(deps.workspaceIntentDeps, row.graphDocumentId, {
      strategy: 'swap-focused-or-open',
      spawnPosition: deps.newEditorSpawnPosition,
    }).editorViewportId
    if (editorViewportId !== null) {
      deps.appendBrowserEntry(`Opened ${describeBrowserRow(row)}`)
    }
  }

  const handleDoubleSelectBrowserRow = (row: BrowserRenderableRowVm) => {
    if (row.rowKind === 'graph-document') {
      activateGraphDocumentIntent(deps.workspaceIntentDeps, row.graphDocumentId, {
        strategy: 'open-or-focus',
        spawnPosition: deps.newEditorSpawnPosition,
      })
      return
    }
    if (
      row.rowKind !== 'component' &&
      row.rowKind !== 'object' &&
      row.rowKind !== 'sketch' &&
      row.rowKind !== 'graph-rebuild-object' &&
      row.rowKind !== 'graph-node'
    ) {
      return
    }
    if (row.authoringGraphDocumentId === null) {
      return
    }
    if (row.authoringNodeId === null) {
      activateGraphDocumentIntent(deps.workspaceIntentDeps, row.authoringGraphDocumentId, {
        strategy: 'open-or-focus',
        spawnPosition: deps.newEditorSpawnPosition,
      })
    } else {
      activateGraphNodeIntent(
        deps.workspaceIntentDeps,
        row.authoringGraphDocumentId,
        row.authoringNodeId,
        {
          strategy: 'open-or-focus',
          spawnPosition: deps.newEditorSpawnPosition,
          fitNodeInViewport: true,
        },
      )
    }
  }

  const handleToggleBrowserRowExpand = (row: BrowserRenderableRowVm) => {
    if (row.rowKind === 'assembly' && row.rowId === deps.referenceWorkspaceRootRowId) {
      deps.closeMenus()
      deps.toggleReferenceWorkspaceExpanded()
      return
    }
    if (
      row.rowKind === 'component' &&
      row.referenceCategoryId !== null &&
      row.referenceCategoryId !== undefined
    ) {
      deps.closeMenus()
      deps.toggleReferenceCategoryExpanded(row.referenceCategoryId)
      return
    }
    if (row.rowKind === 'graph-document') {
      deps.closeMenus()
      deps.setExpandedGraphDocumentIds((currentIds) =>
        currentIds.includes(row.graphDocumentId)
          ? currentIds.filter((currentId) => currentId !== row.graphDocumentId)
          : [...currentIds, row.graphDocumentId],
      )
      return
    }
    if (row.rowKind === 'graph-section') {
      deps.closeMenus()
      deps.setGraphSectionExpandedByRowId((current) => ({
        ...current,
        [row.rowId]: !row.isExpanded,
      }))
      return
    }
    if (
      row.rowKind === 'assembly' ||
      row.rowKind === 'component' ||
      row.rowKind === 'reference-item' ||
      (row.rowKind === 'object' &&
        (row.isExpandable || row.contentOriginKind === 'source-reference')) ||
      row.rowKind === 'sketches-root'
    ) {
      deps.closeMenus()
      deps.setCollapsedContentRowIds((currentIds) =>
        currentIds.includes(row.rowId)
          ? currentIds.filter((currentId) => currentId !== row.rowId)
          : [...currentIds, row.rowId],
      )
    }
  }

  const handleToggleReferenceVisibility = (row: BrowserRenderableRowVm) => {
    deps.setLocalSelectedBrowserRowId(row.rowId)
    deps.closeMenus()
    if (
      row.rowKind === 'component' &&
      row.referenceCategoryId !== null &&
      row.referenceCategoryId !== undefined
    ) {
      deps.appendBrowserEntry(`${row.label} visibility toggled`)
      deps.toggleReferenceCategoryVisibility(row.referenceCategoryId)
      return
    }
    if (row.rowKind === 'reference-item') {
      deps.appendBrowserEntry(`${row.label} visibility toggled`)
      deps.toggleReferenceItemVisibility(row.referenceId)
      return
    }
    if (
      row.rowKind === 'object' &&
      (row.contentOriginKind === 'imported-reference' || row.contentOriginKind === 'source-reference') &&
      row.referenceId
    ) {
      deps.appendBrowserEntry(`${row.label} visibility toggled`)
      deps.toggleReferenceItemVisibility(row.referenceId)
    }
  }

  const handleToggleSketchVisibility = (row: BrowserRenderableRowVm) => {
    if (row.rowKind !== 'sketch') {
      return
    }
    deps.setLocalSelectedBrowserRowId(row.rowId)
    deps.closeMenus()
    deps.appendBrowserEntry(`${row.label} visibility toggled`)
    deps.toggleSketchVisibility(row.rowId)
  }

  const handleToggleContentVisibility = (row: BrowserRenderableRowVm) => {
    if (row.rowKind !== 'assembly' && row.rowKind !== 'component' && row.rowKind !== 'object') {
      return
    }
    if (row.visibilityPartKeys.length === 0) {
      return
    }
    deps.setLocalSelectedBrowserRowId(row.rowId)
    deps.closeMenus()
    deps.appendBrowserEntry(`${row.label} visibility toggled`)
    const nextVisible = !row.isVisible
    row.visibilityPartKeys.forEach((partKey) => {
      deps.setPartVisibility(partKey, nextVisible)
    })
  }

  return {
    clearBrowserSelection,
    handleSelectBrowserRow,
    handleDoubleSelectBrowserRow,
    handleToggleBrowserRowExpand,
    handleToggleReferenceVisibility,
    handleToggleSketchVisibility,
    handleToggleContentVisibility,
    resolveSelectedBrowserRowIdFromTarget,
  }
}

export const resolveBrowserSelectedRowIdFromTarget = (
  target: WorkspaceSelectedTarget | null,
  deps: BrowserTargetRowResolverDeps,
): string | null => {
  if (target === null) {
    return null
  }
  if (target.kind === 'graph-document') {
    return `graph-row:${target.graphDocumentId}`
  }
  if (target.kind === 'graph-node') {
    const graphNode = deps.graphDocumentsById[target.graphDocumentId]?.graph.nodes.find(
      (node) => node.nodeId === target.nodeId,
    )
    if (graphNode?.type === 'Geometry/Sketch') {
      const rawSketch = graphNode.params.sketch as { featureId?: unknown } | undefined
      if (typeof rawSketch?.featureId === 'string' && rawSketch.featureId.length > 0) {
        return deps.buildProjectSketchBrowserRowId(
          target.graphDocumentId,
          target.nodeId,
          rawSketch.featureId,
        )
      }
    }
    return `graph-node-row:${target.graphDocumentId}:${target.nodeId}`
  }
  if (target.kind === 'references-root') {
    return deps.referenceWorkspaceRootRowId
  }
  if (target.kind === 'reference-category') {
    return `reference-category-row:${target.categoryId}`
  }
  if (target.kind === 'reference-item') {
    return `reference-item-row:${target.referenceId}`
  }
  if (target.kind === 'part') {
    return null
  }
  if (target.kind === 'assembly') {
    return target.assemblyId
  }
  if (target.kind === 'component') {
    return target.componentId
  }
  if (target.kind === 'object') {
    return target.objectId
  }
  return null
}
