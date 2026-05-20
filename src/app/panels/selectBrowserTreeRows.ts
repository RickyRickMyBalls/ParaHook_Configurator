import type { EditorViewport, GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  BrowserBuildPolicy,
  ProjectContentBrowserRowVm,
  ProjectContentBuildState,
  ReferenceLoadBatchState,
  ReferenceWorkspaceBrowserTreeVm,
  ReferenceWorkspaceBrowserCategoryVm,
  ReferenceWorkspaceBrowserItemVm,
} from '../store/useAppStore'
import type { ViewSettings } from '../../shared/viewSettingsTypes'
import { resolveEnvironmentPresetRead } from '../../shared/viewSettingsTypes'
import { buildSketchProfileMemberPortId } from '../spaghetti/features/sketchProfileVirtualPorts'
import type { BrowserGraphRowVm } from './selectBrowserGraphRows'

export type BrowserBuildPolicySource = 'self' | 'graph' | 'assembly' | 'component' | 'default'

export type BrowserTreeRowKind =
  | 'references-root'
  | 'reference-category'
  | 'reference-item'
  | 'part'
  | 'assembly'
  | 'sketches-root'
  | 'sketch'
  | 'sketch-profiles'
  | 'sketch-profile'
  | 'component'
  | 'object'
  | 'graph-document'
  | 'graph-section'
  | 'graph-rebuild-object'
  | 'graph-node'
  | 'viewport'
  | 'environment-root'
  | 'environment-source'
  | 'environment-light'

export type BrowserTreeRowActionId =
  | 'open'
  | 'save'
  | 'export-step'
  | 'new-editor'
  | 'swap-editor'
  | 'reveal'
  | 'view-in-graph'
  | 'transform-object'
  | 'focus'
  | 'close'

export type BrowserTreeRowActionVm = {
  actionId: BrowserTreeRowActionId
  label: string
  ariaLabel: string
  disabled?: boolean
}

export type BrowserTreeGuideKind = 'none' | 'vertical' | 'elbow' | 'tee'

export type BrowserGraphSectionKind = 'needs-rebuild' | 'nodes'

type BrowserTreeRowBaseVm = {
  rowId: string
  rowKind: BrowserTreeRowKind
  depth: number
  treeGuides: BrowserTreeGuideKind[]
  iconLabel: string
  label: string
  meta: string
  isSelected: boolean
  isGroupedSelected?: boolean
  isExpandable: boolean
  isExpanded: boolean
  actions: BrowserTreeRowActionVm[]
  showOverflowButton?: boolean
  authoredBrowserBuildPolicy?: BrowserBuildPolicy | null
  effectiveBrowserBuildPolicy?: BrowserBuildPolicy
  effectiveBrowserBuildPolicySource?: BrowserBuildPolicySource
  effectiveBrowserBuildPolicySourceLabel?: string | null
}

export type BrowserReferenceRowState =
  | 'highlighted'
  | 'active'
  | 'dormant'
  | 'loading'
  | 'error'

export type BrowserReferencesRootTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'references-root'
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
  progress01?: number
}

export type BrowserReferenceCategoryTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'reference-category'
  categoryId: ReferenceWorkspaceBrowserCategoryVm['categoryId']
  itemCount: number
  emptyLabel: string
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
  progress01?: number
}

export type BrowserReferenceContainerKind = 'root' | 'category'

type BrowserReferenceContainerTraits = {
  referenceContainerKind?: BrowserReferenceContainerKind | null
  referenceCategoryId?: ReferenceWorkspaceBrowserCategoryVm['categoryId'] | null
  referenceContainerState?: BrowserReferenceRowState | null
  referenceContainerStateLabel?: string | null
  referenceContainerProgress01?: number | null
  referenceContainerItemCount?: number | null
  referenceContainerEmptyLabel?: string | null
}

export type BrowserReferenceItemTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'reference-item'
  referenceId: string
  sourceKind: ReferenceWorkspaceBrowserItemVm['sourceKind']
  categoryId: ReferenceWorkspaceBrowserItemVm['categoryId']
  fileType: ReferenceWorkspaceBrowserItemVm['fileType']
  assetPath: string
  isVisible: boolean
  state: BrowserReferenceRowState
  stateLabel: string
  errorMessage: string | null
}

export type BrowserPartTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'part'
  partKey: string
  parentReferenceId: string
  isVisible: boolean
  visibilityPartKeys: string[]
}

export type BrowserGraphSectionTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-section'
  graphDocumentId: string
  sectionKind: BrowserGraphSectionKind
  childCount: number
  emptyLabel: string
}

export type BrowserAssemblyTreeRowVm = BrowserTreeRowBaseVm &
  BrowserReferenceContainerTraits & {
  rowKind: 'assembly'
  isVisible: boolean
  visibilityPartKeys: string[]
  visibilityReferenceIds?: string[]
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
}

export type BrowserSketchesRootTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'sketches-root'
  sketchCount: number
}

export type BrowserSketchTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'sketch'
  isVisible: boolean
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  ownerGraphDocumentId: string
  graphDocumentId: string
  nodeId: string
  featureId: string
  plane: 'XY' | 'YZ' | 'XZ'
  componentCount: number
  profileCount: number
  diagnosticsCount: number
  authoringGraphDocumentId: string
  authoringNodeId: string
  profileProjectionRows?: BrowserSketchProfileProjectionTreeRowVm[]
}

export type BrowserSketchProfilesTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'sketch-profiles'
  graphDocumentId: string
  nodeId: string
  featureId: string
  profileCount: number
  authoringGraphDocumentId: string
  authoringNodeId: string
}

export type BrowserSketchProfileTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'sketch-profile'
  graphDocumentId: string
  nodeId: string
  featureId: string
  profileId: string
  profileIndex: number
  profilePortId: string
  authoringGraphDocumentId: string
  authoringNodeId: string
}

export type BrowserSketchProfileProjectionTreeRowVm =
  | BrowserSketchProfilesTreeRowVm
  | BrowserSketchProfileTreeRowVm

export type BrowserComponentTreeRowVm = BrowserTreeRowBaseVm &
  BrowserReferenceContainerTraits & {
  rowKind: 'component'
  parentComponentId?: string | null
  isVisible: boolean
  visibilityPartKeys: string[]
  visibilityReferenceIds?: string[]
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  ownerGraphDocumentId: string | null
  sourceGraphDocumentId: string | null
  sourceOutputEntryId: string | null
  componentSourceKind: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'component'; componentSourceKind: infer K }
      ? K
      : never
    : never
  resolutionState: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'component'; resolutionState: infer K }
      ? K
      : never
    : never
  receiveId: string | null
  slotId: string | null
  sourceNodeId: string | null
  highlightViewerKey: string | null
  authoringGraphDocumentId: string | null
  authoringNodeId: string | null
}

export type BrowserObjectTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'object'
  isVisible: boolean
  visibilityPartKeys: string[]
  buildState: ProjectContentBuildState
  buildStateLabel: string
  rebuildGraphDocumentIds: string[]
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  ownerGraphDocumentId: string | null
  parentComponentId: string | null
  objectSourceKind:
    | (ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; objectSourceKind: infer K }
      ? K
      : never
    : never)
    | null
  sourceGraphDocumentId: string | null
  sourceOutputEntryId: string | null
  slotId: string | null
  sourceNodeId: string | null
  resolutionState:
    | (ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; resolutionState: infer K }
      ? K
      : never
    : never)
    | null
  highlightViewerKey: string | null
  authoringGraphDocumentId: string | null
  authoringNodeId: string | null
  contentOriginKind?: 'generated' | 'imported-reference' | 'source-reference'
  referenceId?: string | null
  referenceSourceKind?: ReferenceWorkspaceBrowserItemVm['sourceKind'] | null
  referenceState?: BrowserReferenceRowState | null
  fileType?: ReferenceWorkspaceBrowserItemVm['fileType'] | null
  assetPath?: string | null
  errorMessage?: string | null
}

export type BrowserGraphTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-document'
  cachedGraphId: string
  graphDocumentId: string
  isInSharedViewerComposition: boolean
  saveState: BrowserGraphRowVm['saveState']
  openViewportCount: number
  hasFocusedViewport: boolean
  buildState: BrowserGraphRowVm['buildState']
  buildStateLabel: string
  children: BrowserGraphChildTreeRowVm[]
}

export type BrowserGraphRebuildObjectTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-rebuild-object'
  graphDocumentId: string
  objectRowId: string
  objectSourceKind: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; objectSourceKind: infer K }
      ? K
      : never
    : never
  buildState: ProjectContentBuildState
  buildStateLabel: string
  resolutionState: ProjectContentBrowserRowVm extends infer T
    ? T extends { kind: 'object'; resolutionState: infer K }
      ? K
      : never
    : never
  statusLabel?: string
  statusTone?: 'quiet' | 'ready' | 'warning'
  sourceOutputEntryId: string
  sourceNodeId: string | null
  authoringGraphDocumentId: string
  authoringNodeId: string | null
}

export type BrowserGraphNodeTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'graph-node'
  graphDocumentId: string
  nodeId: string
  nodeType: string
  authoringGraphDocumentId: string
  authoringNodeId: string
}

export type BrowserViewportTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'viewport'
  editorViewportId: string
  graphDocumentId: string
}

export type BrowserEnvironmentRootTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'environment-root'
  childCount: number
}

export type BrowserEnvironmentSourceTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'environment-source'
  envPreset: ViewSettings['envPreset']
  sourceKind: ViewSettings['environmentSource']['kind']
  sourceLabel: string
  sourceAssetPath: string | null
  backgroundVisible: boolean
  environmentGrade: ViewSettings['environmentGrade']
  background: string
  isDiverged: boolean
}

export type BrowserEnvironmentLightTreeRowVm = BrowserTreeRowBaseVm & {
  rowKind: 'environment-light'
  lightId: string
  lightType: ViewSettings['lighting']['lights'][number]['type']
  enabled: boolean
  color: string
  intensity: number
  isSelectedLight: boolean
}

export type BrowserRenderableRowVm =
  | BrowserReferencesRootTreeRowVm
  | BrowserReferenceCategoryTreeRowVm
  | BrowserReferenceItemTreeRowVm
  | BrowserPartTreeRowVm
  | BrowserAssemblyTreeRowVm
  | BrowserSketchesRootTreeRowVm
  | BrowserSketchTreeRowVm
  | BrowserSketchProfilesTreeRowVm
  | BrowserSketchProfileTreeRowVm
  | BrowserComponentTreeRowVm
  | BrowserObjectTreeRowVm
  | BrowserGraphTreeRowVm
  | BrowserGraphSectionTreeRowVm
  | BrowserGraphRebuildObjectTreeRowVm
  | BrowserGraphNodeTreeRowVm
  | BrowserViewportTreeRowVm
  | BrowserEnvironmentRootTreeRowVm
  | BrowserEnvironmentSourceTreeRowVm
  | BrowserEnvironmentLightTreeRowVm

export type BrowserGraphChildTreeRowVm =
  | BrowserGraphSectionTreeRowVm
  | BrowserGraphRebuildObjectTreeRowVm
  | BrowserGraphNodeTreeRowVm

export type BrowserTreeRowsVm = {
  referenceRows: Array<
    | BrowserReferencesRootTreeRowVm
    | BrowserReferenceCategoryTreeRowVm
    | BrowserReferenceItemTreeRowVm
    | BrowserObjectTreeRowVm
  >
  environmentRows: []
  contentRows: Array<
    | BrowserEnvironmentRootTreeRowVm
    | BrowserEnvironmentSourceTreeRowVm
    | BrowserEnvironmentLightTreeRowVm
    | BrowserAssemblyTreeRowVm
    | BrowserSketchesRootTreeRowVm
    | BrowserSketchTreeRowVm
    | BrowserSketchProfilesTreeRowVm
    | BrowserSketchProfileTreeRowVm
    | BrowserComponentTreeRowVm
    | BrowserObjectTreeRowVm
    | BrowserPartTreeRowVm
  >
  graphRows: BrowserGraphTreeRowVm[]
  viewportRows: BrowserViewportTreeRowVm[]
}

const buildGraphSectionRowId = (
  graphDocumentId: string,
  sectionKind: BrowserGraphSectionKind,
): string => `graph-section-row:${graphDocumentId}:${sectionKind}`

export const buildBrowserSketchProfilesRowId = (
  graphDocumentId: string,
  nodeId: string,
): string => `sketch-profiles-row:${graphDocumentId}:${nodeId}`

export const buildBrowserSketchProfileRowId = (
  graphDocumentId: string,
  nodeId: string,
  profileId: string,
): string => `sketch-profile-row:${graphDocumentId}:${nodeId}:${profileId}`

const isDefaultGraphSectionExpanded = (sectionKind: BrowserGraphSectionKind): boolean =>
  sectionKind === 'needs-rebuild'

const formatGraphSectionMeta = (
  sectionKind: BrowserGraphSectionKind,
  childCount: number,
): string => {
  if (sectionKind === 'needs-rebuild') {
    return childCount === 1 ? '1 object' : `${childCount} objects`
  }
  return childCount === 1 ? '1 node' : `${childCount} nodes`
}

const formatGraphNodeLabel = (nodeType: string): string => {
  const [lastSegment] = nodeType.split('/').slice(-1)
  return lastSegment?.trim().length ? lastSegment : nodeType
}

const buildGraphNodeMeta = (nodeType: string, nodeId: string): string => `${nodeType} | ${nodeId}`

const formatProfileCount = (profileCount: number): string =>
  profileCount === 1 ? '1 profile' : `${profileCount} profiles`

const buildSketchProfileProjectionRows = (
  sketchRow: Extract<ProjectContentBrowserRowVm, { kind: 'sketch' }>,
  selectedRowIdSet: ReadonlySet<string>,
): BrowserSketchProfileProjectionTreeRowVm[] => {
  const profiles = sketchRow.profiles ?? []
  if (profiles.length === 0) {
    return []
  }

  const aggregateRowId = buildBrowserSketchProfilesRowId(
    sketchRow.graphDocumentId,
    sketchRow.nodeId,
  )
  const aggregateRow: BrowserSketchProfilesTreeRowVm = {
    rowId: aggregateRowId,
    rowKind: 'sketch-profiles',
    depth: 2,
    treeGuides: [],
    graphDocumentId: sketchRow.graphDocumentId,
    nodeId: sketchRow.nodeId,
    featureId: sketchRow.featureId,
    profileCount: profiles.length,
    authoringGraphDocumentId: sketchRow.authoringGraphDocumentId,
    authoringNodeId: sketchRow.authoringNodeId,
    iconLabel: 'P',
    label: 'SketchProfiles',
    meta: formatProfileCount(profiles.length),
    isSelected: selectedRowIdSet.has(aggregateRowId),
    isExpandable: profiles.length > 0,
    isExpanded: false,
    actions: [],
  }

  const memberRows = profiles.map((profile, index) => {
    const rowId = buildBrowserSketchProfileRowId(
      sketchRow.graphDocumentId,
      sketchRow.nodeId,
      profile.profileId,
    )
    return {
      rowId,
      rowKind: 'sketch-profile' as const,
      depth: 3,
      treeGuides: [],
      graphDocumentId: sketchRow.graphDocumentId,
      nodeId: sketchRow.nodeId,
      featureId: sketchRow.featureId,
      profileId: profile.profileId,
      profileIndex: profile.profileIndex,
      profilePortId: buildSketchProfileMemberPortId(profile.profileId),
      authoringGraphDocumentId: sketchRow.authoringGraphDocumentId,
      authoringNodeId: sketchRow.authoringNodeId,
      iconLabel: 'P',
      label: 'SketchProfile',
      meta: `Profile ${index + 1}`,
      isSelected: selectedRowIdSet.has(rowId),
      isExpandable: false,
      isExpanded: false,
      actions: [],
    } satisfies BrowserSketchProfileTreeRowVm
  })

  return [aggregateRow, ...memberRows]
}

const formatReferenceStateLabel = (state: BrowserReferenceRowState): string => {
  switch (state) {
    case 'highlighted':
      return 'Highlight'
    case 'loading':
      return 'Loading'
    case 'error':
      return 'Error'
    case 'active':
      return 'Active'
    default:
      return 'Dormant'
  }
}

const clampProgress01 = (value: number): number => Math.max(0, Math.min(1, value))

const countBatchCompletedForIds = (
  batch: ReferenceLoadBatchState,
  referenceIds: readonly string[],
): number =>
  referenceIds.filter(
    (referenceId) =>
      batch.completedIds.includes(referenceId) || batch.failedIds.includes(referenceId),
  ).length

export const selectBrowserTreeRows = (options: {
  referenceWorkspaceTree?: ReferenceWorkspaceBrowserTreeVm | null
  referenceLoadBatch?: ReferenceLoadBatchState | null
  activeTransformReferenceId?: string | null
  environmentView?: Pick<
    ViewSettings,
    'envPreset' | 'environmentSource' | 'environmentGrade' | 'lighting'
  > | null
  contentRows: ProjectContentBrowserRowVm[]
  partsVisibility?: Record<string, boolean>
  contentOrderByParentKey?: Record<string, string[]>
  graphRows: BrowserGraphRowVm[]
  browserGraphBuildPolicyByGraphDocumentId?: Record<string, BrowserBuildPolicy>
  browserContentBuildPolicyByRowId?: Record<string, BrowserBuildPolicy>
  editorViewports: EditorViewport[]
  graphDocumentsById: Record<string, GraphDocument>
  selectedRowId: string | null
  selectedRowIds?: string[]
  groupedSelectedRowIds?: string[]
  collapsedContentRowIds: string[]
  expandedGraphDocumentIds: string[]
  graphSectionExpandedByRowId?: Record<string, boolean>
  hasActiveEditorViewport: boolean
  sharedViewerCompositionGraphDocumentIds: string[]
  sharedViewerCompositionActive: boolean
}): BrowserTreeRowsVm => {
  const {
    referenceLoadBatch = null,
    activeTransformReferenceId = null,
    environmentView = null,
    browserContentBuildPolicyByRowId = {},
    browserGraphBuildPolicyByGraphDocumentId = {},
    contentRows,
    partsVisibility = {},
    contentOrderByParentKey = {},
    editorViewports,
    expandedGraphDocumentIds,
    graphSectionExpandedByRowId = {},
    graphDocumentsById,
    graphRows,
    hasActiveEditorViewport,
    groupedSelectedRowIds = [],
    collapsedContentRowIds,
    selectedRowId,
    selectedRowIds = selectedRowId === null ? [] : [selectedRowId],
    sharedViewerCompositionGraphDocumentIds,
  } = options
  const groupedSelectedRowIdSet = new Set(groupedSelectedRowIds)
  const selectedRowIdSet = new Set(selectedRowIds)
  const buildContentParentOrderKey = (kind: 'assembly' | 'component', id: string): string =>
    `${kind}:${id}`
  const formatEnvironmentExposureValue = (value: number): string =>
    Number(value.toFixed(2)).toString()
  const dedupeOrderedRowIds = (orderedRowIds: readonly string[]): string[] => {
    const seen = new Set<string>()
    const deduped: string[] = []
    orderedRowIds.forEach((rowId) => {
      if (seen.has(rowId)) {
        return
      }
      seen.add(rowId)
      deduped.push(rowId)
    })
    return deduped
  }
  const normalizeOrderedRowIds = (orderedRowIds: string[] | undefined, defaultRowIds: string[]): string[] => {
    if (orderedRowIds === undefined) {
      return dedupeOrderedRowIds(defaultRowIds)
    }
    const defaultRowIdSet = new Set(defaultRowIds)
    const normalized = dedupeOrderedRowIds(
      orderedRowIds.filter((rowId) => defaultRowIdSet.has(rowId)),
    )
    defaultRowIds.forEach((rowId) => {
      if (!normalized.includes(rowId)) {
        normalized.push(rowId)
      }
    })
    return normalized
  }

  const environmentChildRows: Array<
    BrowserEnvironmentSourceTreeRowVm | BrowserEnvironmentLightTreeRowVm
  > = []
  if (environmentView !== null) {
    const environmentRead = resolveEnvironmentPresetRead(environmentView)
    const environmentSource = environmentView.environmentSource
    const sourceLabel =
      environmentSource.kind === 'preset'
        ? environmentRead.definition.label
        : environmentSource.label
    const sourceMetaPrefix =
      environmentSource.kind === 'hdri'
        ? 'HDRI source'
        : environmentSource.kind === 'custom' || environmentRead.isDiverged
          ? 'Custom source'
          : 'Current source'
    const sourceAssetMeta =
      environmentSource.kind === 'hdri' && environmentSource.assetPath !== null
        ? ` | ${environmentSource.assetPath}`
        : ''
    const sourceRowId = 'environment-source-row:active'
    const environmentChildCount = 1 + environmentView.lighting.lights.length
    environmentChildRows.push({
      rowId: sourceRowId,
      rowKind: 'environment-source',
      depth: 1,
      treeGuides: [environmentChildCount > 1 ? 'tee' : 'elbow'],
      iconLabel: 'E',
      label: environmentSource.kind === 'hdri' ? `HDRI: ${sourceLabel}` : `Source: ${sourceLabel}`,
      meta: `${sourceMetaPrefix} | Exposure ${formatEnvironmentExposureValue(
        environmentView.environmentGrade.exposure,
      )}${sourceAssetMeta}`,
      isSelected: selectedRowIdSet.has(sourceRowId),
      isExpandable: false,
      isExpanded: false,
      actions: [],
      envPreset: environmentRead.definition.id,
      sourceKind: environmentSource.kind,
      sourceLabel,
      sourceAssetPath: environmentSource.assetPath,
      backgroundVisible:
        environmentSource.kind !== 'hdri' || environmentSource.backgroundVisible !== false,
      environmentGrade: environmentView.environmentGrade,
      background: environmentRead.definition.background,
      isDiverged: environmentRead.isDiverged,
    } satisfies BrowserEnvironmentSourceTreeRowVm)

    environmentView.lighting.lights.forEach((light, index) => {
      const selectedLight = light.id === environmentView.lighting.selectedLightId
      environmentChildRows.push({
        rowId: `environment-light-row:${light.id}`,
        rowKind: 'environment-light',
        depth: 1,
        treeGuides: [index < environmentView.lighting.lights.length - 1 ? 'tee' : 'elbow'],
        iconLabel: 'L',
        label: light.name,
        meta: `${selectedLight ? 'Selected | ' : ''}${light.enabled ? 'On' : 'Off'} | ${
          light.type
        } | ${formatEnvironmentExposureValue(light.intensity)}`,
        isSelected: selectedRowIdSet.has(`environment-light-row:${light.id}`),
        isExpandable: false,
        isExpanded: false,
        actions: [],
        lightId: light.id,
        lightType: light.type,
        enabled: light.enabled,
        color: light.color,
        intensity: light.intensity,
        isSelectedLight: selectedLight,
      } satisfies BrowserEnvironmentLightTreeRowVm)
    })
  }

  const normalizedContentRows = contentRows

  const topLevelAssemblyRows = normalizedContentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }> =>
      row.kind === 'assembly' && row.parentAssemblyId == null,
  )
  const authoredTopLevelAssemblyRows = topLevelAssemblyRows.filter(
    (row) => row.referenceContainerKind !== 'root',
  )
  const defaultTopLevelAssemblyId =
    authoredTopLevelAssemblyRows.length === 1
      ? authoredTopLevelAssemblyRows[0].rowId
      : topLevelAssemblyRows.length === 1
        ? topLevelAssemblyRows[0].rowId
        : null
  const assemblyChildrenRowsByParentId = new Map<
    string,
    Array<
      | Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }>
      | Extract<ProjectContentBrowserRowVm, { kind: 'component' }>
      | Extract<ProjectContentBrowserRowVm, { kind: 'object' }>
    >
  >()
  const componentChildrenRowsByParentId = new Map<
    string,
    Array<
      | Extract<ProjectContentBrowserRowVm, { kind: 'component' }>
      | Extract<ProjectContentBrowserRowVm, { kind: 'object' }>
    >
  >()
  const objectRowsByParentId = new Map<
    string,
    Array<Extract<ProjectContentBrowserRowVm, { kind: 'object' }>>
  >()
  const orderedObjectRows = normalizedContentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'object' }> => row.kind === 'object',
  )
  const orderedSketchRoots = normalizedContentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'sketches-root' }> =>
      row.kind === 'sketches-root',
  )
  const orderedSketchRows = normalizedContentRows.filter(
    (row): row is Extract<ProjectContentBrowserRowVm, { kind: 'sketch' }> => row.kind === 'sketch',
  )
  orderedObjectRows.forEach((row) => {
    if (row.parentComponentId === null) {
      const parentAssemblyId = row.parentAssemblyId ?? defaultTopLevelAssemblyId
      if (parentAssemblyId != null) {
        const existing = assemblyChildrenRowsByParentId.get(parentAssemblyId)
        if (existing === undefined) {
          assemblyChildrenRowsByParentId.set(parentAssemblyId, [row])
        } else {
          existing.push(row)
        }
      }
      return
    }
    const existing = objectRowsByParentId.get(row.parentComponentId)
    if (existing === undefined) {
      objectRowsByParentId.set(row.parentComponentId, [row])
      return
    }
    existing.push(row)
  })
  normalizedContentRows
    .filter((row): row is Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }> => row.kind === 'assembly')
    .forEach((row) => {
      if (row.parentAssemblyId == null) {
        return
      }
      const existing = assemblyChildrenRowsByParentId.get(row.parentAssemblyId)
      if (existing === undefined) {
        assemblyChildrenRowsByParentId.set(row.parentAssemblyId, [row])
        return
      }
      existing.push(row)
    })
  normalizedContentRows
    .filter((row): row is Extract<ProjectContentBrowserRowVm, { kind: 'component' }> => row.kind === 'component')
    .forEach((row) => {
      if ((row.parentComponentId ?? null) !== null) {
        const existing = componentChildrenRowsByParentId.get(row.parentComponentId!)
        if (existing === undefined) {
          componentChildrenRowsByParentId.set(row.parentComponentId!, [row])
        } else {
          existing.push(row)
        }
        return
      }
      const parentAssemblyId = row.parentAssemblyId ?? defaultTopLevelAssemblyId
      if (parentAssemblyId == null) {
        return
      }
      const existing = assemblyChildrenRowsByParentId.get(parentAssemblyId)
      if (existing === undefined) {
        assemblyChildrenRowsByParentId.set(parentAssemblyId, [row])
        return
      }
      existing.push(row)
    })

  const visibleContentRows: BrowserTreeRowsVm['contentRows'] = []
  const assemblyRowById = new Map(
    normalizedContentRows
      .filter((row): row is Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }> => row.kind === 'assembly')
      .map((row) => [row.rowId, row] as const),
  )
  const componentRowById = new Map(
    normalizedContentRows
      .filter((row): row is Extract<ProjectContentBrowserRowVm, { kind: 'component' }> => row.kind === 'component')
      .map((row) => [row.rowId, row] as const),
  )
  const graphLabelByDocumentId = new Map(graphRows.map((row) => [row.graphDocumentId, row.label] as const))

  if (environmentView !== null) {
    const isEnvironmentExpanded =
      environmentChildRows.length > 0 && !collapsedContentRowIds.includes('environment-root')
    visibleContentRows.push({
      rowId: 'environment-root',
      rowKind: 'environment-root',
      depth: 0,
      treeGuides: [],
      iconLabel: 'E',
      label: 'Environment',
      meta: environmentChildRows.length === 1 ? '1 object' : `${environmentChildRows.length} objects`,
      isSelected: selectedRowIdSet.has('environment-root'),
      isExpandable: environmentChildRows.length > 0,
      isExpanded: isEnvironmentExpanded,
      actions: [],
      childCount: environmentChildRows.length,
    } satisfies BrowserEnvironmentRootTreeRowVm)
    if (isEnvironmentExpanded) {
      visibleContentRows.push(...environmentChildRows)
    }
  }

  const resolveGraphPolicy = (
    graphDocumentId: string,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy =
      browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? null
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy ?? 'live',
      effectiveBrowserBuildPolicySource: authoredBrowserBuildPolicy === null ? 'default' : 'self',
      effectiveBrowserBuildPolicySourceLabel:
        authoredBrowserBuildPolicy === null ? null : graphLabelByDocumentId.get(graphDocumentId) ?? graphDocumentId,
    }
  }

  const resolveAssemblyPolicy = (
    rowId: string,
    label: string,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy = browserContentBuildPolicyByRowId[rowId] ?? null
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy ?? 'live',
      effectiveBrowserBuildPolicySource: authoredBrowserBuildPolicy === null ? 'default' : 'self',
      effectiveBrowserBuildPolicySourceLabel: authoredBrowserBuildPolicy === null ? null : label,
    }
  }

  const resolveComponentPolicy = (
    row: Extract<ProjectContentBrowserRowVm, { kind: 'component' }>,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy = browserContentBuildPolicyByRowId[row.rowId] ?? null
    if (authoredBrowserBuildPolicy !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicySource: 'self',
        effectiveBrowserBuildPolicySourceLabel: row.label,
      }
    }
    const parentComponent =
      row.parentComponentId == null ? null : componentRowById.get(row.parentComponentId) ?? null
    if (parentComponent !== null) {
      const parentComponentAuthored = browserContentBuildPolicyByRowId[parentComponent.rowId] ?? null
      if (parentComponentAuthored !== null) {
        return {
          authoredBrowserBuildPolicy,
          effectiveBrowserBuildPolicy: parentComponentAuthored,
          effectiveBrowserBuildPolicySource: 'component',
          effectiveBrowserBuildPolicySourceLabel: parentComponent.label,
        }
      }
    }
    const parentAssemblyId = row.parentAssemblyId ?? defaultTopLevelAssemblyId
    const parentAssembly =
      parentAssemblyId == null ? null : assemblyRowById.get(parentAssemblyId) ?? null
    const assemblyAuthored =
      parentAssembly === null ? null : browserContentBuildPolicyByRowId[parentAssembly.rowId] ?? null
    if (assemblyAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: assemblyAuthored,
        effectiveBrowserBuildPolicySource: 'assembly',
        effectiveBrowserBuildPolicySourceLabel: parentAssembly?.label ?? null,
      }
    }
    const graphAuthored =
      row.ownerGraphDocumentId === null
        ? null
        : browserGraphBuildPolicyByGraphDocumentId[row.ownerGraphDocumentId] ?? null
    if (graphAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: graphAuthored,
        effectiveBrowserBuildPolicySource: 'graph',
          effectiveBrowserBuildPolicySourceLabel:
            row.ownerGraphDocumentId === null
              ? null
              : graphLabelByDocumentId.get(row.ownerGraphDocumentId) ?? row.ownerGraphDocumentId,
      }
    }
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: 'live',
      effectiveBrowserBuildPolicySource: 'default',
      effectiveBrowserBuildPolicySourceLabel: null,
    }
  }

  const resolveObjectPolicy = (
    row: Extract<ProjectContentBrowserRowVm, { kind: 'object' }>,
  ): Pick<
    BrowserTreeRowBaseVm,
    | 'authoredBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicy'
    | 'effectiveBrowserBuildPolicySource'
    | 'effectiveBrowserBuildPolicySourceLabel'
  > => {
    const authoredBrowserBuildPolicy = browserContentBuildPolicyByRowId[row.rowId] ?? null
    if (authoredBrowserBuildPolicy !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicySource: 'self',
        effectiveBrowserBuildPolicySourceLabel: row.label,
      }
    }
    const parentComponent =
      row.parentComponentId === null ? null : componentRowById.get(row.parentComponentId) ?? null
    if (parentComponent !== null) {
      const parentComponentAuthored = browserContentBuildPolicyByRowId[parentComponent.rowId] ?? null
      if (parentComponentAuthored !== null) {
        return {
          authoredBrowserBuildPolicy,
          effectiveBrowserBuildPolicy: parentComponentAuthored,
          effectiveBrowserBuildPolicySource: 'component',
          effectiveBrowserBuildPolicySourceLabel: parentComponent.label,
        }
      }
    }
    const parentAssemblyId = row.parentAssemblyId ?? defaultTopLevelAssemblyId
    const parentAssembly =
      parentAssemblyId == null ? null : assemblyRowById.get(parentAssemblyId) ?? null
    const assemblyAuthored =
      parentAssembly === null ? null : browserContentBuildPolicyByRowId[parentAssembly.rowId] ?? null
    if (assemblyAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: assemblyAuthored,
        effectiveBrowserBuildPolicySource: 'assembly',
        effectiveBrowserBuildPolicySourceLabel: parentAssembly?.label ?? null,
      }
    }
    const graphAuthored =
      row.ownerGraphDocumentId === null
        ? null
        : browserGraphBuildPolicyByGraphDocumentId[row.ownerGraphDocumentId] ?? null
    if (graphAuthored !== null) {
      return {
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: graphAuthored,
        effectiveBrowserBuildPolicySource: 'graph',
        effectiveBrowserBuildPolicySourceLabel:
          row.ownerGraphDocumentId === null
            ? null
            : graphLabelByDocumentId.get(row.ownerGraphDocumentId) ?? row.ownerGraphDocumentId,
      }
    }
    return {
      authoredBrowserBuildPolicy,
      effectiveBrowserBuildPolicy: 'live',
      effectiveBrowserBuildPolicySource: 'default',
      effectiveBrowserBuildPolicySourceLabel: null,
    }
  }

  const appendObjectRow = (
    objectRow: Extract<ProjectContentBrowserRowVm, { kind: 'object' }>,
    depth: number,
    treeGuides: BrowserTreeGuideKind[],
  ) => {
    const isReferenceBackedObject =
      objectRow.contentOriginKind === 'imported-reference' ||
      objectRow.contentOriginKind === 'source-reference'
    const referenceState: BrowserReferenceRowState | null =
      !isReferenceBackedObject || objectRow.referenceId == null
        ? null
        : objectRow.referenceLoadState === 'error'
          ? 'error'
          : activeTransformReferenceId === objectRow.referenceId
            ? 'highlighted'
            : objectRow.isVisible && objectRow.referenceLoadState === 'loading'
              ? 'loading'
              : objectRow.isVisible && objectRow.referenceLoadState === 'loaded'
                ? 'active'
                : 'dormant'
    const partRows = isReferenceBackedObject ? (objectRow.partRows ?? []) : []
    const isExpanded = partRows.length > 0 && !collapsedContentRowIds.includes(objectRow.rowId)
    visibleContentRows.push({
      rowId: objectRow.rowId,
      rowKind: 'object',
      depth,
      treeGuides,
      isVisible: objectRow.isVisible ?? false,
      visibilityPartKeys: objectRow.visibilityPartKeys ?? [],
      buildState: objectRow.buildState ?? 'done',
      buildStateLabel: objectRow.buildStateLabel ?? '',
      rebuildGraphDocumentIds: objectRow.rebuildGraphDocumentIds ?? [],
      ownerGraphDocumentId: objectRow.ownerGraphDocumentId,
      parentComponentId: objectRow.parentComponentId,
      objectSourceKind: objectRow.objectSourceKind,
      sourceGraphDocumentId: objectRow.sourceGraphDocumentId,
      sourceOutputEntryId: objectRow.sourceOutputEntryId,
      slotId: objectRow.slotId,
      sourceNodeId: objectRow.sourceNodeId,
      resolutionState: objectRow.resolutionState,
      highlightViewerKey: objectRow.highlightViewerKey,
      authoringGraphDocumentId: objectRow.authoringGraphDocumentId,
      authoringNodeId: objectRow.authoringNodeId,
      contentOriginKind: objectRow.contentOriginKind ?? 'generated',
      referenceId: objectRow.referenceId ?? null,
      referenceSourceKind: objectRow.referenceSourceKind ?? null,
      referenceState,
      fileType: objectRow.fileType ?? null,
      assetPath: objectRow.assetPath ?? null,
      errorMessage: objectRow.errorMessage ?? null,
      iconLabel: 'O',
      label: objectRow.label,
      meta: objectRow.meta,
      ...resolveObjectPolicy(objectRow),
      ...(objectRow.statusLabel !== undefined
        ? {
            statusLabel: objectRow.statusLabel,
            statusTone: objectRow.statusTone ?? 'quiet',
          }
        : {}),
      isSelected: selectedRowIdSet.has(objectRow.rowId),
      isGroupedSelected: groupedSelectedRowIdSet.has(objectRow.rowId),
      isExpandable: partRows.length > 0,
      isExpanded,
      actions: isReferenceBackedObject
        ? [
            {
              actionId: 'transform-object',
              label: 'Transform Object',
              ariaLabel: `Transform ${objectRow.label}`,
            },
          ]
        : [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${objectRow.label} in graph`,
            },
          ],
      showOverflowButton: objectRow.contentOriginKind === 'source-reference' ? false : undefined,
    } satisfies BrowserObjectTreeRowVm)

    if (!isExpanded || partRows.length === 0 || objectRow.referenceId == null) {
      return
    }

    const parentReferenceId = objectRow.referenceId
    const childAncestorGuides: BrowserTreeGuideKind[] = [
      ...treeGuides.slice(0, -1),
      treeGuides.at(-1) === 'tee' ? 'vertical' : 'none',
    ]
    partRows.forEach((partRow, partIndex) => {
      visibleContentRows.push({
        rowId: partRow.rowId,
        rowKind: 'part',
        depth: depth + 1,
        treeGuides: [
          ...childAncestorGuides,
          partIndex < partRows.length - 1 ? 'tee' : 'elbow',
        ],
        iconLabel: 'P',
        label: partRow.label,
        meta: '',
        isVisible: partsVisibility[partRow.partKey] ?? true,
        visibilityPartKeys: [partRow.partKey],
        isSelected: selectedRowIdSet.has(partRow.rowId),
        isGroupedSelected: groupedSelectedRowIdSet.has(partRow.rowId),
        isExpandable: false,
        isExpanded: false,
        actions: [],
        partKey: partRow.partKey,
        parentReferenceId,
      } satisfies BrowserPartTreeRowVm)
    })
  }

  const getOrderedContentChildrenForParent = (parent: {
    kind: 'assembly' | 'component'
    rowId: string
  }): Array<
    | Extract<ProjectContentBrowserRowVm, { kind: 'assembly' | 'component' | 'object' }>
  > => {
    const authoredChildren =
      parent.kind === 'assembly'
        ? (assemblyChildrenRowsByParentId.get(parent.rowId) ?? [])
        : [
            ...(componentChildrenRowsByParentId.get(parent.rowId) ?? []),
            ...(objectRowsByParentId.get(parent.rowId) ?? []),
          ]
    const authoredByRowId = new Map<string, typeof authoredChildren[number]>(
      authoredChildren.map((row) => [row.rowId, row]),
    )
    const defaultOrderIds = authoredChildren.map((row) => row.rowId)
    const orderedRowIds = normalizeOrderedRowIds(
      contentOrderByParentKey[buildContentParentOrderKey(parent.kind, parent.rowId)],
      defaultOrderIds,
    )
    const orderedChildren: Array<
      Extract<ProjectContentBrowserRowVm, { kind: 'assembly' | 'component' | 'object' }>
    > = []
    orderedRowIds.forEach((rowId) => {
      const authoredRow = authoredByRowId.get(rowId)
      if (authoredRow !== undefined) {
        orderedChildren.push(authoredRow)
      }
    })
    return orderedChildren
  }

  const resolveReferenceContainerPresentation = (
    referenceRows: Array<Extract<ProjectContentBrowserRowVm, { kind: 'object' }>>,
  ): {
    state: BrowserReferenceRowState
    progress01?: number
  } => {
    const referenceIds = referenceRows
      .map((row) => row.referenceId)
      .filter((referenceId): referenceId is string => typeof referenceId === 'string')
    const hasHighlightedReference =
      activeTransformReferenceId !== null &&
      referenceIds.includes(activeTransformReferenceId)
    if (hasHighlightedReference) {
      return { state: 'highlighted' }
    }
    const batchTargetIds =
      referenceLoadBatch === null
        ? []
        : referenceIds.filter((referenceId) => referenceLoadBatch.targetIds.includes(referenceId))
    if (batchTargetIds.length > 0 && referenceLoadBatch !== null) {
      return {
        state: 'loading',
        progress01: clampProgress01(
          countBatchCompletedForIds(referenceLoadBatch, batchTargetIds) / batchTargetIds.length,
        ),
      }
    }
    const hasVisibleLoadingReference = referenceRows.some(
      (row) => row.isVisible && row.referenceLoadState === 'loading',
    )
    if (hasVisibleLoadingReference) {
      return { state: 'loading' }
    }
    const hasErrorReference = referenceRows.some((row) => row.referenceLoadState === 'error')
    if (hasErrorReference) {
      return { state: 'error' }
    }
    const hasVisibleLoadedReference = referenceRows.some(
      (row) => row.isVisible && row.referenceLoadState === 'loaded',
    )
    return {
      state: hasVisibleLoadedReference ? 'active' : 'dormant',
    }
  }

  const appendComponentRow = (
    componentRow: Extract<ProjectContentBrowserRowVm, { kind: 'component' }>,
    depth: number,
    ancestorGuides: BrowserTreeGuideKind[],
    hasMoreSiblings: boolean,
  ) => {
    const orderedChildren = getOrderedContentChildrenForParent({
      kind: 'component',
      rowId: componentRow.rowId,
    }) as Array<Extract<ProjectContentBrowserRowVm, { kind: 'component' | 'object' }>>
    const childCount = orderedChildren.length
    const isComponentExpanded = childCount > 0 && !collapsedContentRowIds.includes(componentRow.rowId)
    const referenceContainerChildren =
      componentRow.referenceContainerKind === 'category'
        ? orderedChildren.filter(
            (
              row,
            ): row is Extract<ProjectContentBrowserRowVm, { kind: 'object' }> =>
              row.kind === 'object' && typeof row.referenceId === 'string',
          )
        : []
    const referenceContainerPresentation =
      componentRow.referenceContainerKind === 'category'
        ? resolveReferenceContainerPresentation(referenceContainerChildren)
        : null
    visibleContentRows.push({
      rowId: componentRow.rowId,
      rowKind: 'component',
      depth,
      treeGuides: [
        ...ancestorGuides,
        childCount > 0 && isComponentExpanded
          ? 'tee'
          : hasMoreSiblings
            ? 'tee'
            : 'elbow',
      ],
      isVisible: componentRow.isVisible ?? false,
      visibilityPartKeys: componentRow.visibilityPartKeys ?? [],
      visibilityReferenceIds: componentRow.visibilityReferenceIds ?? [],
      buildState: componentRow.buildState ?? 'done',
      buildStateLabel: componentRow.buildStateLabel ?? '',
      rebuildGraphDocumentIds: componentRow.rebuildGraphDocumentIds ?? [],
      ownerGraphDocumentId: componentRow.ownerGraphDocumentId,
      parentComponentId: componentRow.parentComponentId ?? null,
      sourceGraphDocumentId: componentRow.sourceGraphDocumentId,
      sourceOutputEntryId: componentRow.sourceOutputEntryId,
      componentSourceKind: componentRow.componentSourceKind,
      resolutionState: componentRow.resolutionState,
      receiveId: componentRow.receiveId,
      slotId: componentRow.slotId,
      sourceNodeId: componentRow.sourceNodeId,
      highlightViewerKey: componentRow.highlightViewerKey,
      authoringGraphDocumentId: componentRow.authoringGraphDocumentId,
      authoringNodeId: componentRow.authoringNodeId,
      iconLabel: 'C',
      label: componentRow.label,
      meta: componentRow.meta,
      ...resolveComponentPolicy(componentRow),
      ...(componentRow.statusLabel !== undefined
        ? {
            statusLabel: componentRow.statusLabel,
            statusTone: componentRow.statusTone ?? 'quiet',
          }
        : {}),
      isSelected: selectedRowIdSet.has(componentRow.rowId),
      isGroupedSelected: groupedSelectedRowIdSet.has(componentRow.rowId),
      isExpandable: childCount > 0,
      isExpanded: isComponentExpanded,
      ...(componentRow.referenceContainerKind === 'category'
        ? {
            referenceContainerKind: 'category' as const,
            referenceCategoryId: componentRow.referenceCategoryId ?? null,
            referenceContainerState: referenceContainerPresentation?.state ?? 'dormant',
            referenceContainerStateLabel: formatReferenceStateLabel(
              referenceContainerPresentation?.state ?? 'dormant',
            ),
            referenceContainerProgress01: referenceContainerPresentation?.progress01,
            referenceContainerItemCount: componentRow.referenceContainerItemCount ?? childCount,
            referenceContainerEmptyLabel: componentRow.referenceContainerEmptyLabel ?? null,
          }
        : {}),
      actions:
        componentRow.authoringGraphDocumentId === null
          ? []
          : [
              {
                actionId: 'view-in-graph',
                label: 'View In Graph',
                ariaLabel: `View ${componentRow.label} in graph`,
              },
            ],
    } satisfies BrowserComponentTreeRowVm)

    if (!isComponentExpanded) {
      return
    }

    const childAncestorGuides: BrowserTreeGuideKind[] = [
      ...ancestorGuides,
      hasMoreSiblings ? 'vertical' : 'none',
    ]
    orderedChildren.forEach((childRow, childIndex) => {
      const childHasMoreSiblings = childIndex < orderedChildren.length - 1
      if (childRow.kind === 'component') {
        appendComponentRow(childRow, depth + 1, childAncestorGuides, childHasMoreSiblings)
        return
      }
      const treeGuides = [
        ...childAncestorGuides,
        childHasMoreSiblings ? 'tee' : 'elbow',
      ] satisfies BrowserTreeGuideKind[]
      appendObjectRow(childRow, depth + 1, treeGuides)
    })
  }

  const appendAssemblyRow = (
    assemblyRow: Extract<ProjectContentBrowserRowVm, { kind: 'assembly' }>,
    depth: number,
    ancestorGuides: BrowserTreeGuideKind[],
    hasMoreSiblings: boolean,
  ) => {
    const orderedAssemblyChildren = getOrderedContentChildrenForParent({
      kind: 'assembly',
      rowId: assemblyRow.rowId,
    }) as Array<Extract<ProjectContentBrowserRowVm, { kind: 'assembly' | 'component' | 'object' }>>
    const isExpanded =
      orderedAssemblyChildren.length > 0 && !collapsedContentRowIds.includes(assemblyRow.rowId)
    const referenceContainerChildren =
      assemblyRow.referenceContainerKind === 'root'
        ? orderedObjectRows.filter(
            (row) =>
              typeof row.referenceId === 'string' && (row.parentAssemblyId ?? null) === assemblyRow.rowId,
          )
        : []
    const referenceContainerPresentation =
      assemblyRow.referenceContainerKind === 'root'
        ? resolveReferenceContainerPresentation(referenceContainerChildren)
        : null
    visibleContentRows.push({
      rowId: assemblyRow.rowId,
      rowKind: 'assembly',
      depth,
      treeGuides:
        depth === 0
          ? []
          : [
              ...ancestorGuides,
              orderedAssemblyChildren.length > 0 && isExpanded
                ? 'tee'
                : hasMoreSiblings
                  ? 'tee'
                  : 'elbow',
            ],
      isVisible: assemblyRow.isVisible ?? false,
      visibilityPartKeys: assemblyRow.visibilityPartKeys ?? [],
      visibilityReferenceIds: assemblyRow.visibilityReferenceIds ?? [],
      buildState: assemblyRow.buildState ?? 'done',
      buildStateLabel: assemblyRow.buildStateLabel ?? '',
      rebuildGraphDocumentIds: assemblyRow.rebuildGraphDocumentIds ?? [],
      iconLabel: 'A',
      label: assemblyRow.label,
      meta: assemblyRow.meta,
      ...resolveAssemblyPolicy(assemblyRow.rowId, assemblyRow.label),
      ...(assemblyRow.statusLabel !== undefined
        ? {
            statusLabel: assemblyRow.statusLabel,
            statusTone: assemblyRow.statusTone ?? 'quiet',
          }
        : {}),
      isSelected: selectedRowIdSet.has(assemblyRow.rowId),
      isGroupedSelected: groupedSelectedRowIdSet.has(assemblyRow.rowId),
      isExpandable: orderedAssemblyChildren.length > 0,
      isExpanded,
      ...(assemblyRow.referenceContainerKind === 'root'
        ? {
            referenceContainerKind: 'root' as const,
            referenceCategoryId: null,
            referenceContainerState: referenceContainerPresentation?.state ?? 'dormant',
            referenceContainerStateLabel: formatReferenceStateLabel(
              referenceContainerPresentation?.state ?? 'dormant',
            ),
            referenceContainerProgress01: referenceContainerPresentation?.progress01,
            referenceContainerItemCount:
              assemblyRow.referenceContainerItemCount ?? referenceContainerChildren.length,
            referenceContainerEmptyLabel: assemblyRow.referenceContainerEmptyLabel ?? null,
          }
        : {}),
      actions: [],
    } satisfies BrowserAssemblyTreeRowVm)

    if (!isExpanded) {
      return
    }

    const childAncestorGuides: BrowserTreeGuideKind[] =
      depth === 0 ? [] : [...ancestorGuides, hasMoreSiblings ? 'vertical' : 'none']
    orderedAssemblyChildren.forEach((childRow, childIndex) => {
      const childHasMoreSiblings = childIndex < orderedAssemblyChildren.length - 1
      if (childRow.kind === 'assembly') {
        appendAssemblyRow(childRow, depth + 1, childAncestorGuides, childHasMoreSiblings)
        return
      }
      if (childRow.kind === 'component') {
        appendComponentRow(childRow, depth + 1, childAncestorGuides, childHasMoreSiblings)
        return
      }
      appendObjectRow(childRow, depth + 1, [
        ...childAncestorGuides,
        childHasMoreSiblings ? 'tee' : 'elbow',
      ])
    })
  }

  topLevelAssemblyRows.forEach((assemblyRow, assemblyIndex) => {
    appendAssemblyRow(assemblyRow, 0, [], assemblyIndex < topLevelAssemblyRows.length - 1)
  })

  orderedSketchRoots.forEach((row) => {
    const isExpanded = orderedSketchRows.length > 0 && !collapsedContentRowIds.includes(row.rowId)
    visibleContentRows.push({
      rowId: row.rowId,
      rowKind: 'sketches-root',
      depth: 0,
      treeGuides: [],
      sketchCount: row.sketchCount,
      iconLabel: 'S',
      label: row.label,
      meta: row.meta,
      isSelected: selectedRowIdSet.has(row.rowId),
      isExpandable: orderedSketchRows.length > 0,
      isExpanded,
      actions: [],
    } satisfies BrowserSketchesRootTreeRowVm)

    if (!isExpanded) {
      return
    }

    orderedSketchRows.forEach((sketchRow, sketchIndex) => {
      const profileProjectionRows = buildSketchProfileProjectionRows(sketchRow, selectedRowIdSet)
      const sketchProfilesRow =
        profileProjectionRows[0]?.rowKind === 'sketch-profiles' ? profileProjectionRows[0] : null
      const sketchProfileRows = profileProjectionRows.slice(1).filter(
        (row): row is BrowserSketchProfileTreeRowVm => row.rowKind === 'sketch-profile',
      )
      const hasMoreSketchSiblings = sketchIndex < orderedSketchRows.length - 1
      const hasProfileProjectionRows = sketchProfilesRow !== null
      const isSketchExpanded =
        hasProfileProjectionRows && !collapsedContentRowIds.includes(sketchRow.rowId)
      const isSketchProfilesExpanded =
        sketchProfileRows.length > 0 &&
        sketchProfilesRow !== null &&
        !collapsedContentRowIds.includes(sketchProfilesRow.rowId)

      visibleContentRows.push({
        rowId: sketchRow.rowId,
        rowKind: 'sketch',
        depth: 1,
        treeGuides: [
          hasProfileProjectionRows && isSketchExpanded
            ? 'tee'
            : hasMoreSketchSiblings
              ? 'tee'
              : 'elbow',
        ],
        isVisible: sketchRow.isVisible,
        buildState: sketchRow.buildState ?? 'done',
        buildStateLabel: sketchRow.buildStateLabel ?? '',
        rebuildGraphDocumentIds: sketchRow.rebuildGraphDocumentIds ?? [],
        ownerGraphDocumentId: sketchRow.ownerGraphDocumentId,
        graphDocumentId: sketchRow.graphDocumentId,
        nodeId: sketchRow.nodeId,
        featureId: sketchRow.featureId,
        plane: sketchRow.plane,
        componentCount: sketchRow.componentCount,
        profileCount: sketchRow.profileCount,
        diagnosticsCount: sketchRow.diagnosticsCount,
        authoringGraphDocumentId: sketchRow.authoringGraphDocumentId,
        authoringNodeId: sketchRow.authoringNodeId,
        profileProjectionRows,
        iconLabel: 'S',
        label: sketchRow.label,
        meta: sketchRow.meta,
        ...(sketchRow.statusLabel !== undefined
          ? {
              statusLabel: sketchRow.statusLabel,
              statusTone: sketchRow.statusTone ?? 'quiet',
            }
          : {}),
        isSelected: selectedRowIdSet.has(sketchRow.rowId),
        isExpandable: hasProfileProjectionRows,
        isExpanded: isSketchExpanded,
        actions: [
          {
            actionId: 'view-in-graph',
            label: 'View In Graph',
            ariaLabel: `View ${sketchRow.label} in graph`,
          },
        ],
      } satisfies BrowserSketchTreeRowVm)

      if (!isSketchExpanded || sketchProfilesRow === null) {
        return
      }

      const sketchChildAncestorGuides: BrowserTreeGuideKind[] = [
        hasMoreSketchSiblings ? 'vertical' : 'none',
      ]
      visibleContentRows.push({
        ...sketchProfilesRow,
        depth: 2,
        treeGuides: [
          ...sketchChildAncestorGuides,
          isSketchProfilesExpanded ? 'tee' : 'elbow',
        ],
        isExpanded: isSketchProfilesExpanded,
      } satisfies BrowserSketchProfilesTreeRowVm)

      if (!isSketchProfilesExpanded) {
        return
      }

      sketchProfileRows.forEach((profileRow, profileIndex) => {
        visibleContentRows.push({
          ...profileRow,
          depth: 3,
          treeGuides: [
            ...sketchChildAncestorGuides,
            'none',
            profileIndex < sketchProfileRows.length - 1 ? 'tee' : 'elbow',
          ],
        } satisfies BrowserSketchProfileTreeRowVm)
      })
    })
  })

  const contentSectionRootBranchRowIds = visibleContentRows
    .filter((row) => row.depth === 0)
    .map((row) => row.rowId)
  const contentSectionRootGuideByRowId = new Map<string, BrowserTreeGuideKind>()
  const contentSectionContinuationGuideByRowId = new Map<string, BrowserTreeGuideKind>()
  contentSectionRootBranchRowIds.forEach((rowId, index) => {
    const hasMoreRootBranches = index < contentSectionRootBranchRowIds.length - 1
    contentSectionRootGuideByRowId.set(rowId, hasMoreRootBranches ? 'tee' : 'elbow')
    contentSectionContinuationGuideByRowId.set(rowId, hasMoreRootBranches ? 'vertical' : 'none')
  })

  let activeRootAssemblyRowId: string | null = null
  const transformedContentRows = visibleContentRows.map((row) => {
    if (row.depth === 0) {
      activeRootAssemblyRowId = row.rowId
      const rootGuide = contentSectionRootGuideByRowId.get(row.rowId)
      if (rootGuide === undefined) {
        return row
      }
      return {
        ...row,
        treeGuides: [rootGuide],
      }
    }
    if (activeRootAssemblyRowId === null) {
      return row
    }
    const continuationGuide = contentSectionContinuationGuideByRowId.get(activeRootAssemblyRowId)
    if (continuationGuide === undefined) {
      return row
    }
    return {
      ...row,
      treeGuides: [continuationGuide, ...row.treeGuides],
    }
  })

  return {
    referenceRows: [],
    environmentRows: [],
    contentRows: transformedContentRows,
    graphRows: graphRows.map((row) => {
      const isInSharedViewerComposition = sharedViewerCompositionGraphDocumentIds.includes(
        row.graphDocumentId,
      )
      const graphDocument = graphDocumentsById[row.graphDocumentId] ?? null
      const graphRebuildRows = orderedObjectRows
        .filter(
          (objectRow) =>
            objectRow.ownerGraphDocumentId === row.graphDocumentId &&
            objectRow.authoringGraphDocumentId === row.graphDocumentId &&
            objectRow.objectSourceKind === 'published-object' &&
            objectRow.sourceOutputEntryId !== null &&
            objectRow.authoringGraphDocumentId !== null &&
            (objectRow.buildState === 'rebuild' ||
              objectRow.buildState === 'building' ||
              objectRow.resolutionState === 'unresolved'),
        )
        .map((objectRow) => ({
          rowId: `graph-rebuild-row:${row.graphDocumentId}:${objectRow.rowId}`,
          rowKind: 'graph-rebuild-object',
          depth: 2,
          treeGuides: [],
          graphDocumentId: row.graphDocumentId,
          objectRowId: objectRow.rowId,
          objectSourceKind: objectRow.objectSourceKind!,
          buildState: objectRow.buildState ?? 'rebuild',
          buildStateLabel: objectRow.buildStateLabel ?? 'Rebuild',
          resolutionState: objectRow.resolutionState!,
          ...(objectRow.statusLabel !== undefined
            ? {
                statusLabel: objectRow.statusLabel,
                statusTone: objectRow.statusTone ?? 'quiet',
              }
            : objectRow.resolutionState === 'unresolved'
              ? {
                  statusLabel: 'Unresolved',
                  statusTone: 'warning' as const,
                }
              : {}),
          sourceOutputEntryId: objectRow.sourceOutputEntryId!,
          sourceNodeId: objectRow.sourceNodeId,
          authoringGraphDocumentId: objectRow.authoringGraphDocumentId!,
          authoringNodeId: objectRow.authoringNodeId,
          iconLabel: 'O',
          label: objectRow.label,
          meta:
            objectRow.meta === row.label || objectRow.meta === `${row.label} unresolved`
              ? ''
              : objectRow.meta,
          isSelected: selectedRowIdSet.has(`graph-rebuild-row:${row.graphDocumentId}:${objectRow.rowId}`),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${objectRow.label} in graph`,
            },
          ],
        } satisfies BrowserGraphRebuildObjectTreeRowVm))
      const graphNodeRows =
        graphDocument?.graph.nodes.map((node) => ({
          rowId: `graph-node-row:${row.graphDocumentId}:${node.nodeId}`,
          rowKind: 'graph-node',
          depth: 2,
          treeGuides: [],
          graphDocumentId: row.graphDocumentId,
          nodeId: node.nodeId,
          nodeType: node.type,
          authoringGraphDocumentId: row.graphDocumentId,
          authoringNodeId: node.nodeId,
          iconLabel: 'N',
          label: formatGraphNodeLabel(node.type),
          meta: buildGraphNodeMeta(node.type, node.nodeId),
          isSelected: selectedRowIdSet.has(`graph-node-row:${row.graphDocumentId}:${node.nodeId}`),
          isExpandable: false,
          isExpanded: false,
          actions: [
            {
              actionId: 'view-in-graph',
              label: 'View In Graph',
              ariaLabel: `View ${formatGraphNodeLabel(node.type)} in graph`,
            },
          ],
        } satisfies BrowserGraphNodeTreeRowVm)) ?? []

      const sectionDefinitions = [
        {
          sectionKind: 'needs-rebuild' as const,
          label: 'Needs Rebuild',
          iconLabel: '!',
          emptyLabel: '',
          children: graphRebuildRows,
        },
        {
          sectionKind: 'nodes' as const,
          label: 'Nodes',
          iconLabel: 'N',
          emptyLabel: 'No graph nodes.',
          children: graphNodeRows,
        },
      ]

      const graphChildRows = sectionDefinitions.flatMap((sectionDefinition, sectionIndex) => {
        const sectionRowId = buildGraphSectionRowId(row.graphDocumentId, sectionDefinition.sectionKind)
        const sectionExpanded =
          graphSectionExpandedByRowId[sectionRowId] ??
          isDefaultGraphSectionExpanded(sectionDefinition.sectionKind)
        const hasMoreSections = sectionIndex < sectionDefinitions.length - 1
        const sectionRow: BrowserGraphSectionTreeRowVm = {
          rowId: sectionRowId,
          rowKind: 'graph-section',
          depth: 1,
          treeGuides: [hasMoreSections ? 'tee' : 'elbow'],
          graphDocumentId: row.graphDocumentId,
          sectionKind: sectionDefinition.sectionKind,
          childCount: sectionDefinition.children.length,
          emptyLabel: sectionDefinition.emptyLabel,
          iconLabel: sectionDefinition.iconLabel,
          label: sectionDefinition.label,
          meta: formatGraphSectionMeta(sectionDefinition.sectionKind, sectionDefinition.children.length),
          isSelected: selectedRowIdSet.has(sectionRowId),
          isExpandable: true,
          isExpanded: sectionExpanded,
          actions: [],
        }

        if (!sectionExpanded) {
          return [sectionRow]
        }

        return [
          sectionRow,
          ...sectionDefinition.children.map((childRow, childIndex) => ({
            ...childRow,
            treeGuides: [
              hasMoreSections ? 'vertical' : 'none',
              childIndex < sectionDefinition.children.length - 1 ? 'tee' : 'elbow',
            ] as BrowserTreeGuideKind[],
          })),
        ]
      })

      return {
        rowId: `graph-row:${row.graphDocumentId}`,
        rowKind: 'graph-document',
        depth: 0,
        treeGuides: [],
        cachedGraphId: row.cachedGraphId,
        graphDocumentId: row.graphDocumentId,
        isInSharedViewerComposition,
        iconLabel: 'G',
        label: row.label,
        meta: isInSharedViewerComposition ? `${row.meta} | In Shared Viewer` : row.meta,
        isSelected: selectedRowIdSet.has(`graph-row:${row.graphDocumentId}`),
        isExpandable: true,
        isExpanded: expandedGraphDocumentIds.includes(row.graphDocumentId),
        saveState: row.saveState,
        openViewportCount: row.openViewportCount,
        hasFocusedViewport: row.hasFocusedViewport,
        buildState: row.buildState,
        buildStateLabel: row.buildStateLabel,
        ...resolveGraphPolicy(row.graphDocumentId),
        actions: [
          {
            actionId: 'export-step',
            label: 'Export STEP',
            ariaLabel: `Export ${row.label} as STEP`,
          },
          {
            actionId: 'save',
            label: 'Save Graph File',
            ariaLabel: `Save ${row.label} graph file`,
          },
          {
            actionId: 'open',
            label: 'Open',
            ariaLabel: `Open ${row.label}`,
          },
          {
            actionId: 'reveal',
            label: 'Reveal',
            ariaLabel: `Reveal ${row.label} in viewer`,
            disabled:
              (browserGraphBuildPolicyByGraphDocumentId[row.graphDocumentId] ?? 'live') === 'off',
          },
          {
            actionId: 'new-editor',
            label: 'New Editor',
            ariaLabel: `Open ${row.label} in a new editor`,
          },
          {
            actionId: 'swap-editor',
            label: 'Swap Editor',
            ariaLabel: `Swap focused editor to ${row.label}`,
            disabled: !hasActiveEditorViewport,
          },
        ],
        children: graphChildRows,
      }
    }),
    viewportRows: editorViewports.map((viewport) => {
      const document = graphDocumentsById[viewport.graphDocumentId] ?? null
      const label = document?.name ?? viewport.graphDocumentId
      return {
        rowId: `viewport-row:${viewport.editorViewportId}`,
        rowKind: 'viewport',
        depth: 0,
        treeGuides: [],
        editorViewportId: viewport.editorViewportId,
        graphDocumentId: viewport.graphDocumentId,
        iconLabel: 'V',
        label,
        meta: viewport.isFocused ? 'Active editor' : `Editor z${viewport.zOrder}`,
        isSelected: selectedRowIdSet.has(`viewport-row:${viewport.editorViewportId}`),
        isExpandable: false,
        isExpanded: false,
        actions: [
          {
            actionId: 'focus',
            label: 'Focus',
            ariaLabel: `Focus ${label}`,
            disabled: viewport.isFocused,
          },
          {
            actionId: 'close',
            label: 'Close',
            ariaLabel: `Close ${label}`,
          },
        ],
      } satisfies BrowserViewportTreeRowVm
    }),
  }
}
