import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createBrowserRowInteractionHandlers,
  resolveBrowserSelectedRowIdFromTarget,
} from './browserInteractions'
import type {
  BrowserAssemblyTreeRowVm,
  BrowserComponentTreeRowVm,
  BrowserEnvironmentRootTreeRowVm,
  BrowserEnvironmentLightTreeRowVm,
  BrowserEnvironmentSourceTreeRowVm,
  BrowserGraphTreeRowVm,
  BrowserGraphNodeTreeRowVm,
  BrowserObjectTreeRowVm,
  BrowserPartTreeRowVm,
  BrowserReferenceItemTreeRowVm,
  BrowserSketchProfileTreeRowVm,
  BrowserSketchTreeRowVm,
} from './selectBrowserTreeRows'
import type { BrowserRowInteractionDeps } from './browserInteractions'

const {
  activateGraphDocumentIntentMock,
  activateGraphNodeIntentMock,
  activateSurfaceIntentMock,
  selectTargetIntentMock,
} = vi.hoisted(() => ({
  activateGraphDocumentIntentMock: vi.fn(() => ({ editorViewportId: 'editor-viewport-1' })),
  activateGraphNodeIntentMock: vi.fn(() => ({ editorViewportId: 'editor-viewport-1' })),
  activateSurfaceIntentMock: vi.fn(),
  selectTargetIntentMock: vi.fn(),
}))
const { viewerFrameSelectionSetMock } = vi.hoisted(() => ({
  viewerFrameSelectionSetMock: vi.fn(),
}))
const { frameEnvironmentLightCommandMock } = vi.hoisted(() => ({
  frameEnvironmentLightCommandMock: vi.fn(() => true),
}))

vi.mock('../store/workspaceIntents', () => ({
  activateSurfaceIntent: activateSurfaceIntentMock,
  activateGraphDocumentIntent: activateGraphDocumentIntentMock,
  activateGraphNodeIntent: activateGraphNodeIntentMock,
  selectTargetIntent: selectTargetIntentMock,
}))

vi.mock('../viewerBridge', () => ({
  getViewer: () => ({
    frameSelectionSet: viewerFrameSelectionSetMock,
  }),
}))

vi.mock('../viewCommands', () => ({
  frameEnvironmentLightCommand: frameEnvironmentLightCommandMock,
}))

const graphDocument = {
  graphDocumentId: 'graph-document-1',
  name: 'Graph 1',
  version: 1 as const,
  graph: {
    schemaVersion: 1 as const,
    nodes: [],
    edges: [],
  },
}

const assemblyRow = (assemblyId: string, label: string): BrowserAssemblyTreeRowVm => ({
  rowId: assemblyId,
  rowKind: 'assembly',
  depth: 0,
  treeGuides: [],
  iconLabel: 'A',
  label,
  meta: '',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [`part:${assemblyId}`],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
})

const objectRow = (objectId: string, label: string, partKey = 'part:object-1'): BrowserObjectTreeRowVm => ({
  rowId: objectId,
  rowKind: 'object',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'O',
  label,
  meta: 'Graph 1',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [partKey],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: 'graph-document-1',
  parentComponentId: 'component-1',
  objectSourceKind: 'published-object',
  sourceGraphDocumentId: 'graph-document-1',
  sourceOutputEntryId: 'output-entry:s001:node-1',
  slotId: 's001',
  sourceNodeId: 'node-1',
  resolutionState: 'resolved',
  highlightViewerKey: partKey,
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-1',
})

const environmentLightRow = (
  lightId: string,
  label: string,
  options: { isSelected?: boolean; isSelectedLight?: boolean; enabled?: boolean } = {},
): BrowserEnvironmentLightTreeRowVm => ({
  rowId: `environment-light-row:${lightId}`,
  rowKind: 'environment-light',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'L',
  label,
  meta: `${options.isSelectedLight ? 'Selected | ' : ''}${options.enabled === false ? 'Off' : 'On'} | directional | 1.85`,
  isSelected: options.isSelected ?? false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  lightId,
  lightType: 'directional',
  enabled: options.enabled ?? true,
  color: '#fff2e6',
  intensity: 1.85,
  isSelectedLight: options.isSelectedLight ?? false,
})

const environmentRootRow = (): BrowserEnvironmentRootTreeRowVm => ({
  rowId: 'environment-root',
  rowKind: 'environment-root',
  depth: 0,
  treeGuides: ['tee'],
  iconLabel: 'E',
  label: 'Environment',
  meta: '2 objects',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  childCount: 2,
})

const environmentSourceRow = (
  options: { backgroundVisible?: boolean } = {},
): BrowserEnvironmentSourceTreeRowVm => ({
  rowId: 'environment-source-row:active',
  rowKind: 'environment-source',
  depth: 1,
  treeGuides: ['tee'],
  iconLabel: 'E',
  label: 'HDRI: Workshop Loft',
  meta: 'HDRI source | Exposure 1.15 | /HDRI/workshop_loft.hdr',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  envPreset: 'baseline',
  sourceKind: 'hdri',
  sourceLabel: 'Workshop Loft',
  sourceAssetPath: '/HDRI/workshop_loft.hdr',
  backgroundVisible: options.backgroundVisible ?? true,
  environmentGrade: {
    toneMapping: 'aces',
    exposure: 1.15,
    contrast: 1,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    temperature: 0,
    tint: 0,
    saturation: 1,
  },
  background: '#0b0b0f',
  isDiverged: false,
})

const componentRow = (componentId: string, label: string): BrowserComponentTreeRowVm => ({
  rowId: componentId,
  rowKind: 'component',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'C',
  label,
  meta: '',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [`part:${componentId}`],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: null,
  sourceGraphDocumentId: null,
  sourceOutputEntryId: null,
  componentSourceKind: 'receive-link',
  resolutionState: 'resolved',
  receiveId: null,
  slotId: null,
  sourceNodeId: null,
  highlightViewerKey: null,
  authoringGraphDocumentId: null,
  authoringNodeId: null,
})

const graphRow = (): BrowserGraphTreeRowVm => ({
  rowId: 'graph-row:graph-document-1',
  rowKind: 'graph-document',
  depth: 0,
  treeGuides: [],
  cachedGraphId: 'cached-graph-1',
  graphDocumentId: 'graph-document-1',
  isInSharedViewerComposition: false,
  iconLabel: 'G',
  label: 'Graph 1',
  meta: 'Saved',
  isSelected: false,
  isExpandable: true,
  isExpanded: false,
  actions: [],
  saveState: 'saved',
  openViewportCount: 0,
  hasFocusedViewport: false,
  buildState: 'done',
  buildStateLabel: 'Done',
  children: [],
})

const graphNodeRow = (): BrowserGraphNodeTreeRowVm => ({
  rowId: 'graph-node-row:graph-document-1:node-1',
  rowKind: 'graph-node',
  depth: 1,
  treeGuides: ['elbow'],
  graphDocumentId: 'graph-document-1',
  nodeId: 'node-1',
  nodeType: 'Part/Cube',
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-1',
  iconLabel: 'N',
  label: 'Cube',
  meta: 'Part/Cube',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
})

const sketchRow = (): BrowserSketchTreeRowVm => ({
  rowId: 'project-sketch:graph-document-1:node-2:feature-1',
  rowKind: 'sketch',
  depth: 1,
  treeGuides: ['elbow'],
  iconLabel: 'S',
  label: 'Sketch 1',
  meta: '',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
  ownerGraphDocumentId: 'graph-document-1',
  graphDocumentId: 'graph-document-1',
  nodeId: 'node-2',
  featureId: 'feature-1',
  plane: 'XY',
  componentCount: 0,
  profileCount: 0,
  diagnosticsCount: 0,
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-2',
})

const sketchProfileRow = (
  profileId: string,
  profileIndex: number,
): BrowserSketchProfileTreeRowVm => ({
  rowId: `sketch-profile-row:graph-document-1:node-2:${profileId}`,
  rowKind: 'sketch-profile',
  depth: 3,
  treeGuides: ['vertical', 'vertical', 'elbow'],
  iconLabel: 'P',
  label: 'SketchProfile',
  meta: `Profile ${profileIndex + 1}`,
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  graphDocumentId: 'graph-document-1',
  nodeId: 'node-2',
  featureId: 'feature-1',
  profileId,
  profileIndex,
  profilePortId: `SketchProfile:${profileId}`,
  authoringGraphDocumentId: 'graph-document-1',
  authoringNodeId: 'node-2',
})

const referenceItemRow = (): BrowserReferenceItemTreeRowVm => ({
  rowId: 'reference-item-row:shoe-1',
  rowKind: 'reference-item',
  depth: 2,
  treeGuides: ['vertical', 'elbow'],
  iconLabel: 'O',
  label: 'Shoe 1',
  meta: 'GLB',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  referenceId: 'shoe-1',
  sourceKind: 'manifest',
  categoryId: 'shoes',
  fileType: 'glb',
  assetPath: '/Catalog/shoes/shoe-1.glb',
  isVisible: false,
  state: 'dormant',
  stateLabel: 'Dormant',
  errorMessage: null,
})

const createDeps = (
  overrides: Partial<BrowserRowInteractionDeps> = {},
): BrowserRowInteractionDeps => ({
  browserTreeRows: {
    referenceRows: [],
    contentRows: [],
  },
  graphDocumentsById: {
    'graph-document-1': graphDocument,
  },
  referenceWorkspaceRootRowId: 'reference-root',
  buildProjectSketchBrowserRowId: (graphDocumentId, nodeId, featureId) =>
    `project-sketch:${graphDocumentId}:${nodeId}:${featureId}`,
  workspaceSelectedTarget: null,
  workspaceExplicitSelectedTargets: [],
  workspaceSelectionAnchorTarget: null,
  workspaceResolvedContentSelection: null,
  workspaceIntentDeps: {
    app: {} as never,
    spaghetti: {} as never,
  },
  newEditorSpawnPosition: { x: 100, y: 200 },
  sharedViewerCompositionActive: false,
  closeMenus: vi.fn(),
  setLocalSelectedBrowserRowId: vi.fn(),
  setWorkspaceSelectedTarget: vi.fn(),
  setWorkspaceExplicitSelection: vi.fn(),
  viewportSelectedSketchProfiles: [],
  extrudeCommandSession: null,
  setViewportSelectedSketchProfiles: vi.fn(),
  setExtrudeCommandSelectedProfileSources: vi.fn(),
  setActiveSurface: vi.fn(),
  activeViewerViewportId: 'model-viewer-primary',
  selectLight: vi.fn(),
  selectPart: vi.fn(),
  requestConsoleContextSync: vi.fn(),
  requestConsoleWorkspaceContextHandoff: vi.fn(),
  setActiveEditorViewportId: vi.fn(),
  toggleReferenceWorkspaceExpanded: vi.fn(),
  toggleReferenceCategoryExpanded: vi.fn(),
  toggleReferenceItemVisibility: vi.fn(),
  setReferenceItemVisibility: vi.fn(),
  toggleReferenceCategoryVisibility: vi.fn(),
  toggleSketchVisibility: vi.fn(),
  setEnvironmentSourceBackgroundVisible: vi.fn(),
  setEnvironmentLightEnabled: vi.fn(),
  setPartVisibility: vi.fn(),
  setExpandedGraphDocumentIds: vi.fn(),
  setGraphSectionExpandedByRowId: vi.fn(),
  setCollapsedContentRowIds: vi.fn(),
  setViewportLocalViewState: vi.fn(),
  appendBrowserEntry: vi.fn(),
  ...overrides,
})

describe('createBrowserRowInteractionHandlers', () => {
  beforeEach(() => {
    activateGraphDocumentIntentMock.mockReset()
    activateGraphNodeIntentMock.mockReset()
    activateSurfaceIntentMock.mockReset()
    selectTargetIntentMock.mockReset()
    activateGraphDocumentIntentMock.mockReturnValue({ editorViewportId: 'editor-viewport-1' })
    activateGraphNodeIntentMock.mockReturnValue({ editorViewportId: 'editor-viewport-1' })
    viewerFrameSelectionSetMock.mockReset()
    frameEnvironmentLightCommandMock.mockReset()
    frameEnvironmentLightCommandMock.mockReturnValue(true)
  })

  it('clears Browser selection and requests console sync for empty-body deselect', () => {
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.clearBrowserSelection()

    expect(deps.setLocalSelectedBrowserRowId).toHaveBeenCalledWith(null)
    expect(deps.setWorkspaceSelectedTarget).toHaveBeenCalledWith(null)
    expect(deps.selectPart).toHaveBeenCalledWith(null)
    expect(deps.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: null,
    })
    expect(deps.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
  })

  it('commits single explicit selection for content rows and keeps viewer highlighting outside the panel', () => {
    const row = objectRow('object-1', 'Pedal Body')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [{ kind: 'object', objectId: 'object-1' }],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })
    expect(deps.setActiveSurface).toHaveBeenCalledWith('browser')
    expect(deps.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: { kind: 'object', objectId: 'object-1' },
    })
    expect(deps.selectPart).toHaveBeenCalledWith('part:object-1')
    expect(deps.appendBrowserEntry).not.toHaveBeenCalled()
  })

  it('keeps forwarding object highlight keys into viewer selection even during shared composition', () => {
    const row = objectRow('object-1', 'Pedal Body')
    const deps = createDeps({
      sharedViewerCompositionActive: true,
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [{ kind: 'object', objectId: 'object-1' }],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })
    expect(deps.selectPart).toHaveBeenCalledWith('part:object-1')
  })

  it('keeps converged reference container rows on owner targets instead of legacy reference targets', () => {
    const row: BrowserAssemblyTreeRowVm = {
      ...assemblyRow('reference-root', 'References'),
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'assembly', assemblyId: 'reference-root' },
      explicitSelectedTargets: [{ kind: 'assembly', assemblyId: 'reference-root' }],
      selectionAnchorTarget: { kind: 'assembly', assemblyId: 'reference-root' },
    })
  })

  it('keeps converged reference-backed object rows on object targets', () => {
    const row: BrowserObjectTreeRowVm = {
      ...objectRow('reference-item-row:shoe-1', 'Shoe 1', 'reference:shoe-1'),
      contentOriginKind: 'imported-reference',
      referenceId: 'shoe-1',
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      slotId: null,
      sourceNodeId: null,
      highlightViewerKey: null,
      authoringGraphDocumentId: null,
      authoringNodeId: null,
      objectSourceKind: null,
      ownerGraphDocumentId: null,
      parentComponentId: 'reference-category-row:shoes',
      visibilityPartKeys: [],
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'reference-item-row:shoe-1' },
      explicitSelectedTargets: [{ kind: 'object', objectId: 'reference-item-row:shoe-1' }],
      selectionAnchorTarget: { kind: 'object', objectId: 'reference-item-row:shoe-1' },
    })
  })

  it('selects environment lights through the shared environment target contract', () => {
    const row = environmentLightRow('light-key', 'Key', { isSelectedLight: true })
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [],
      },
      workspaceSelectedTarget: { kind: 'environment-light', lightId: 'light-key' },
      workspaceExplicitSelectedTargets: [{ kind: 'environment-light', lightId: 'light-key' }],
      workspaceSelectionAnchorTarget: { kind: 'environment-light', lightId: 'light-key' },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'environment-light', lightId: 'light-key' },
      explicitSelectedTargets: [{ kind: 'environment-light', lightId: 'light-key' }],
      selectionAnchorTarget: { kind: 'environment-light', lightId: 'light-key' },
    })
    expect(deps.selectLight).toHaveBeenCalledWith('light-key')
  })

  it('resolves viewport-picked environment-light targets to the matching Browser row id', () => {
    expect(
      resolveBrowserSelectedRowIdFromTarget(
        { kind: 'environment-light', lightId: 'light-key' },
        {
          graphDocumentsById: {},
          referenceWorkspaceRootRowId: 'reference-root',
          buildProjectSketchBrowserRowId: (graphDocumentId, nodeId, featureId) =>
            `project-sketch:${graphDocumentId}:${nodeId}:${featureId}`,
        },
      ),
    ).toBe('environment-light-row:light-key')
  })

  it('frames environment-light rows and opens the selected light settings', () => {
    const row = environmentLightRow('light-key', 'Key')
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleDoubleSelectBrowserRow(row)

    expect(frameEnvironmentLightCommandMock).toHaveBeenCalledWith('light-key')
    expect(deps.selectLight).toHaveBeenCalledWith('light-key')
    expect(deps.setViewportLocalViewState).toHaveBeenCalledWith('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarActiveTab: 'environment',
    })
    const collapseUpdater = vi.mocked(deps.setCollapsedContentRowIds).mock.calls[0]?.[0]
    expect(collapseUpdater?.(['assembly-1', 'environment-root', 'graph-row:1'])).toEqual([
      'assembly-1',
      'graph-row:1',
    ])
    expect(viewerFrameSelectionSetMock).not.toHaveBeenCalled()
  })

  it('adds ctrl-clicked rows into explicit multi-select without rewriting the anchor logic in BrowserPanel', () => {
    const firstRow = assemblyRow('assembly-1', 'Assembly 1')
    const secondRow = objectRow('object-1', 'Pedal Body')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      workspaceSelectedTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
      workspaceExplicitSelectedTargets: [{ kind: 'assembly', assemblyId: 'assembly-1' }],
      workspaceSelectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(secondRow, { ctrlKey: true, shiftKey: false })

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [
        { kind: 'assembly', assemblyId: 'assembly-1' },
        { kind: 'object', objectId: 'object-1' },
      ],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })
  })

  it('toggles Browser sketch profile rows through viewport profile selection without workspace multi-select', () => {
    const row = sketchProfileRow('profile-a', 0)
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(row)

    expect(deps.setLocalSelectedBrowserRowId).toHaveBeenCalledWith(row.rowId)
    expect(deps.setViewportSelectedSketchProfiles).toHaveBeenCalledWith([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-2',
        profileId: 'profile-a',
        portId: 'SketchProfile:profile-a',
      },
    ])
    expect(deps.setWorkspaceExplicitSelection).not.toHaveBeenCalled()
    expect(activateGraphNodeIntentMock).not.toHaveBeenCalled()

    const selectedDeps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [row],
      },
      viewportSelectedSketchProfiles: [
        {
          graphDocumentId: 'graph-document-1',
          sketchNodeId: 'node-2',
          profileId: 'profile-a',
          portId: 'SketchProfile:profile-a',
        },
      ],
    })
    const selectedHandlers = createBrowserRowInteractionHandlers(selectedDeps)

    selectedHandlers.handleSelectBrowserRow(row)

    expect(selectedDeps.setViewportSelectedSketchProfiles).toHaveBeenCalledWith([])
  })

  it('shift-selects all Browser sketch profile rows for the clicked sketch', () => {
    const firstRow = sketchProfileRow('profile-a', 0)
    const secondRow = sketchProfileRow('profile-b', 1)
    const otherSketchRow: BrowserSketchProfileTreeRowVm = {
      ...sketchProfileRow('profile-c', 0),
      rowId: 'sketch-profile-row:graph-document-1:node-other:profile-c',
      nodeId: 'node-other',
      profilePortId: 'SketchProfile:profile-c',
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow, otherSketchRow],
      },
      viewportSelectedSketchProfiles: [
        {
          graphDocumentId: 'graph-document-1',
          sketchNodeId: 'node-other',
          profileId: 'profile-c',
          portId: 'SketchProfile:profile-c',
        },
      ],
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(secondRow, { ctrlKey: false, shiftKey: true })

    expect(deps.setViewportSelectedSketchProfiles).toHaveBeenCalledWith([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-other',
        profileId: 'profile-c',
        portId: 'SketchProfile:profile-c',
      },
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-2',
        profileId: 'profile-a',
        portId: 'SketchProfile:profile-a',
      },
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-2',
        profileId: 'profile-b',
        portId: 'SketchProfile:profile-b',
      },
    ])
  })

  it('mirrors Browser sketch profile clicks into an active Extrude command session', () => {
    const firstRow = sketchProfileRow('profile-a', 0)
    const secondRow = sketchProfileRow('profile-b', 1)
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      extrudeCommandSession: {
        graphDocumentId: 'graph-document-1',
        selectedProfileSources: [
          {
            nodeId: 'node-2',
            portId: 'SketchProfile:profile-a',
          },
        ],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(secondRow)

    expect(deps.setViewportSelectedSketchProfiles).toHaveBeenCalledWith([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-2',
        profileId: 'profile-a',
        portId: 'SketchProfile:profile-a',
      },
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-2',
        profileId: 'profile-b',
        portId: 'SketchProfile:profile-b',
      },
    ])
    expect(deps.setExtrudeCommandSelectedProfileSources).toHaveBeenCalledWith([
      {
        nodeId: 'node-2',
        portId: 'SketchProfile:profile-a',
      },
      {
        nodeId: 'node-2',
        portId: 'SketchProfile:profile-b',
      },
    ])
  })

  it('extends shift-click selection across the eligible section rows', () => {
    const firstRow = assemblyRow('assembly-1', 'Assembly 1')
    const middleRow = objectRow('object-1', 'Pedal Body')
    const lastRow = objectRow('object-2', 'Pedal Cap', 'part:object-2')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, middleRow, lastRow],
      },
      workspaceSelectedTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
      workspaceExplicitSelectedTargets: [{ kind: 'assembly', assemblyId: 'assembly-1' }],
      workspaceSelectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(lastRow, { ctrlKey: false, shiftKey: true })

    expect(deps.setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-2' },
      explicitSelectedTargets: [
        { kind: 'assembly', assemblyId: 'assembly-1' },
        { kind: 'object', objectId: 'object-1' },
        { kind: 'object', objectId: 'object-2' },
      ],
      selectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
  })

  it('selects graph rows without opening them and still routes sketch selection through the workspace intent seam', () => {
    const nextGraphRow = graphRow()
    const nextSketchRow = sketchRow()
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleSelectBrowserRow(nextGraphRow)
    handlers.handleSelectBrowserRow(nextSketchRow)

    expect(selectTargetIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      {
        kind: 'graph-document',
        graphDocumentId: 'graph-document-1',
      },
    )
    expect(activateSurfaceIntentMock).toHaveBeenCalledWith(deps.workspaceIntentDeps, 'browser')
    expect(deps.requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: 'graph-document-1',
      nodeId: null,
      editorViewportId: null,
      selectedTarget: {
        kind: 'graph-document',
        graphDocumentId: 'graph-document-1',
      },
    })
    expect(deps.appendBrowserEntry).toHaveBeenCalledTimes(1)
    expect(deps.appendBrowserEntry).toHaveBeenCalledWith('Focused Sketch Sketch 1')
    expect(activateGraphDocumentIntentMock).not.toHaveBeenCalled()
    expect(activateGraphNodeIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      'graph-document-1',
      'node-2',
      {
        strategy: 'open-or-focus',
        spawnPosition: { x: 100, y: 200 },
        fitCanvasInViewport: true,
      },
    )
  })

  it('routes graph-document double select into a brand-new editor viewport', () => {
    const row = graphRow()
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleDoubleSelectBrowserRow(row)

    expect(activateGraphDocumentIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      'graph-document-1',
      {
        strategy: 'open-new',
        spawnPosition: { x: 100, y: 200 },
        fitCanvasInViewport: true,
      },
    )
  })

  it('routes graph-child double select through the authoring graph intent path', () => {
    const row = graphNodeRow()
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleDoubleSelectBrowserRow(row)

    expect(activateGraphNodeIntentMock).toHaveBeenCalledWith(
      deps.workspaceIntentDeps,
      'graph-document-1',
      'node-1',
      {
        strategy: 'open-or-focus',
        spawnPosition: { x: 100, y: 200 },
        fitCanvasInViewport: true,
      },
    )
  })

  it('routes object-row double select into the model viewer instead of the authoring graph', () => {
    const row = objectRow('object-1', 'Pedal Body')
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleDoubleSelectBrowserRow(row)

    expect(viewerFrameSelectionSetMock).toHaveBeenCalledWith(['part:object-1'], [])
    expect(activateGraphDocumentIntentMock).not.toHaveBeenCalled()
    expect(activateGraphNodeIntentMock).not.toHaveBeenCalled()
  })

  it('frames imported-reference object rows by their reference id when double-clicked', () => {
    const row: BrowserObjectTreeRowVm = {
      ...objectRow('reference-item-row:shoe-1', 'Shoe 1'),
      visibilityPartKeys: [],
      highlightViewerKey: null,
      contentOriginKind: 'imported-reference',
      referenceId: 'shoe-1',
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      slotId: null,
      sourceNodeId: null,
      authoringGraphDocumentId: null,
      authoringNodeId: null,
    }
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleDoubleSelectBrowserRow(row)

    expect(viewerFrameSelectionSetMock).toHaveBeenCalledWith([], ['shoe-1'])
    expect(activateGraphDocumentIntentMock).not.toHaveBeenCalled()
    expect(activateGraphNodeIntentMock).not.toHaveBeenCalled()
  })

  it('dispatches expand toggles to the family-specific ownership seam', () => {
    const graphDocumentRow = graphRow()
    const categoryRow: BrowserComponentTreeRowVm = {
      ...componentRow('reference-category-row:footpads', 'Footpads'),
      referenceCategoryId: 'footpads',
    }
    const environmentRow = environmentRootRow()
    const setExpandedGraphDocumentIds = vi.fn()
    const setCollapsedContentRowIds = vi.fn()
    const deps = createDeps({
      setExpandedGraphDocumentIds,
      setCollapsedContentRowIds,
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleBrowserRowExpand(graphDocumentRow)
    handlers.handleToggleBrowserRowExpand(categoryRow)
    handlers.handleToggleBrowserRowExpand(environmentRow)

    expect(deps.toggleReferenceCategoryExpanded).toHaveBeenCalledWith('footpads')
    expect(setExpandedGraphDocumentIds).toHaveBeenCalledTimes(1)
    const graphUpdater = setExpandedGraphDocumentIds.mock.calls[0]?.[0] as
      | ((currentIds: string[]) => string[])
      | undefined
    expect(graphUpdater?.([])).toEqual(['graph-document-1'])
    expect(graphUpdater?.(['graph-document-1'])).toEqual([])
    expect(setCollapsedContentRowIds).toHaveBeenCalledTimes(1)
    const environmentUpdater = setCollapsedContentRowIds.mock.calls[0]?.[0] as
      | ((currentIds: string[]) => string[])
      | undefined
    expect(environmentUpdater?.([])).toEqual(['environment-root'])
    expect(environmentUpdater?.(['environment-root'])).toEqual([])
  })

  it('dispatches visibility toggles through reference, sketch, content, and environment handlers', () => {
    const nextReferenceRow = referenceItemRow()
    const nextSketchRow = sketchRow()
    const nextObjectRow = objectRow('object-1', 'Pedal Body')
    const nextEnvironmentSourceRow = environmentSourceRow()
    const nextEnvironmentLightRow = environmentLightRow('light-key', 'Key')
    const nextPartRow: BrowserPartTreeRowVm = {
      rowId: 'part-row:1',
      rowKind: 'part' as const,
      depth: 2,
      treeGuides: ['none', 'vertical', 'elbow'],
      iconLabel: 'P',
      label: 'Part 1',
      meta: '',
      isVisible: true,
      visibilityPartKeys: ['part:object-1:1'],
      isSelected: false,
      isExpandable: false,
      isExpanded: false,
      actions: [],
      partKey: 'part:object-1:1',
      parentReferenceId: 'reference-1',
    }
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleReferenceVisibility(nextReferenceRow)
    handlers.handleToggleSketchVisibility(nextSketchRow)
    handlers.handleToggleContentVisibility(nextEnvironmentSourceRow)
    handlers.handleToggleContentVisibility(nextEnvironmentLightRow)
    handlers.handleToggleContentVisibility(nextObjectRow)
    handlers.handleToggleContentVisibility(nextPartRow)

    expect(deps.toggleReferenceItemVisibility).toHaveBeenCalledWith('shoe-1')
    expect(deps.toggleSketchVisibility).toHaveBeenCalledWith(nextSketchRow.rowId)
    expect(deps.setEnvironmentSourceBackgroundVisible).toHaveBeenCalledWith(false)
    expect(deps.setEnvironmentLightEnabled).toHaveBeenCalledWith('light-key', false)
    expect(deps.setPartVisibility).toHaveBeenCalledWith('part:object-1', false)
    expect(deps.setPartVisibility).toHaveBeenCalledWith('part:object-1:1', false)
  })

  it('dispatches authored parent visibility toggles through reference-backed child visibility when no part keys exist', () => {
    const row: BrowserAssemblyTreeRowVm = {
      ...assemblyRow('assembly-1', 'Assembly 1'),
      visibilityPartKeys: [],
      visibilityReferenceIds: ['reference-import:1', 'reference-import:2'],
    }
    const deps = createDeps()
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleContentVisibility(row)

    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(1, 'reference-import:1', false)
    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(2, 'reference-import:2', false)
    expect(deps.setPartVisibility).not.toHaveBeenCalled()
  })

  it('fans a reference-backed object row visibility click across selected reference-item targets', () => {
    const firstRow: BrowserObjectTreeRowVm = {
      ...objectRow('reference-item-row:shoe-1', 'Shoe 1'),
      visibilityPartKeys: [],
      highlightViewerKey: null,
      contentOriginKind: 'imported-reference',
      referenceId: 'shoe-1',
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      slotId: null,
      sourceNodeId: null,
      authoringGraphDocumentId: null,
      authoringNodeId: null,
    }
    const secondRow: BrowserObjectTreeRowVm = {
      ...objectRow('reference-item-row:shoe-2', 'Shoe 2'),
      visibilityPartKeys: [],
      highlightViewerKey: null,
      contentOriginKind: 'imported-reference',
      referenceId: 'shoe-2',
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      slotId: null,
      sourceNodeId: null,
      authoringGraphDocumentId: null,
      authoringNodeId: null,
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      workspaceSelectedTarget: {
        kind: 'reference-item',
        referenceId: 'shoe-1',
      },
      workspaceExplicitSelectedTargets: [
        {
          kind: 'reference-item',
          referenceId: 'shoe-1',
        },
        {
          kind: 'reference-item',
          referenceId: 'shoe-2',
        },
      ],
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleReferenceVisibility(firstRow)

    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(1, 'shoe-1', false)
    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(2, 'shoe-2', false)
    expect(deps.appendBrowserEntry).toHaveBeenCalledWith('Selected browser visibility toggled')
    expect(deps.toggleReferenceItemVisibility).not.toHaveBeenCalled()
  })

  it('uses grouped selected reference rows when explicit targets are narrower', () => {
    const firstRow: BrowserReferenceItemTreeRowVm = {
      ...referenceItemRow(),
      isVisible: true,
    }
    const secondRow: BrowserReferenceItemTreeRowVm = {
      ...referenceItemRow(),
      rowId: 'reference-item-row:shoe-2',
      label: 'Shoe 2',
      referenceId: 'shoe-2',
      assetPath: '/Catalog/shoes/shoe-2.glb',
      isVisible: true,
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [firstRow, secondRow],
        contentRows: [],
      },
      workspaceSelectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe-1',
      },
      workspaceExplicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'reference-item-row:shoe-1',
        },
      ],
      workspaceResolvedContentSelection: {
        rootRowId: 'multi-select',
        rootKind: 'multi-select',
        partKeys: [],
        groupedRowIds: ['reference-item-row:shoe-1', 'reference-item-row:shoe-2'],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleReferenceVisibility(firstRow)

    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(1, 'shoe-1', false)
    expect(deps.setReferenceItemVisibility).toHaveBeenNthCalledWith(2, 'shoe-2', false)
    expect(deps.appendBrowserEntry).toHaveBeenCalledWith('Selected browser visibility toggled')
    expect(deps.toggleReferenceItemVisibility).not.toHaveBeenCalled()
  })

  it('fans an object row visibility click across the resolved selected content set', () => {
    const firstRow = {
      ...objectRow('object-1', 'Object 1', 'part:object-1'),
    }
    const secondRow = {
      ...objectRow('object-2', 'Object 2', 'part:object-2'),
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      workspaceSelectedTarget: {
        kind: 'object',
        objectId: 'object-1',
      },
      workspaceResolvedContentSelection: {
        rootRowId: 'multi-select',
        rootKind: 'multi-select',
        partKeys: ['part:object-1', 'part:object-2'],
        groupedRowIds: [],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleContentVisibility(firstRow)

    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(1, 'part:object-1', false)
    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(2, 'part:object-2', false)
    expect(deps.appendBrowserEntry).toHaveBeenCalledWith('Selected browser visibility toggled')
  })

  it('prefers explicit selected target roots for authored container visibility fan-out', () => {
    const firstRow = assemblyRow('assembly-1', 'Assembly 1')
    const secondRow = componentRow('component-2', 'Component 2')
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      workspaceSelectedTarget: {
        kind: 'assembly',
        assemblyId: 'assembly-1',
      },
      workspaceExplicitSelectedTargets: [
        {
          kind: 'assembly',
          assemblyId: 'assembly-1',
        },
        {
          kind: 'component',
          componentId: 'component-2',
        },
      ],
      workspaceResolvedContentSelection: {
        rootRowId: 'multi-select',
        rootKind: 'multi-select',
        partKeys: ['part:assembly-1', 'part:component-2'],
        groupedRowIds: [],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleContentVisibility(firstRow)

    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(1, 'part:assembly-1', false)
    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(2, 'part:component-2', false)
  })

  it('uses resolved selected content object keys when explicit targets are stale or narrower', () => {
    const firstRow = {
      ...objectRow('object-1', 'Object 1', 'part:object-1'),
    }
    const secondRow = {
      ...objectRow('object-2', 'Object 2', 'part:object-2'),
    }
    const deps = createDeps({
      browserTreeRows: {
        referenceRows: [],
        contentRows: [firstRow, secondRow],
      },
      workspaceSelectedTarget: {
        kind: 'object',
        objectId: 'object-1',
      },
      workspaceResolvedContentSelection: {
        rootRowId: 'multi-select',
        rootKind: 'multi-select',
        partKeys: ['part:object-1', 'part:object-2'],
        groupedRowIds: [],
      },
    })
    const handlers = createBrowserRowInteractionHandlers(deps)

    handlers.handleToggleContentVisibility(firstRow)

    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(1, 'part:object-1', false)
    expect(deps.setPartVisibility).toHaveBeenNthCalledWith(2, 'part:object-2', false)
  })
})
