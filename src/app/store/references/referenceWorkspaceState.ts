import { newId } from '../../spaghetti/utils/id'
import {
  REFERENCE_MANIFEST_CATEGORIES,
  REFERENCE_MANIFEST_ITEMS,
  USER_REFERENCE_CATEGORY_ID,
  type ReferenceCategoryId,
  type ReferenceTransformOverride,
} from '../../references/referenceManifest'
import {
  resolveStagedImportScaleMultiplier,
  resolveStagedImportUpAxisRotationDeg,
} from '../../references/stagedImportTransforms'
import type { ProjectContentOwnerTarget, ReferenceItemLoadState } from '../useAppStore'
import type {
  ReferenceWorkspaceState,
  StagedImportDraftFileRecord,
  StagedImportDraftState,
  StagedImportPreviewNodeRecord,
  StagedImportPreviewOrganizationState,
  StagedImportScaleAlignment,
  StagedImportStructureInspectionState,
} from './referenceWorkspaceTypes'

const DEFAULT_COLLAPSED_REFERENCE_CATEGORY_IDS: ReferenceCategoryId[] = [
  'footpads',
  'shoes',
  'premade-foothooks',
]

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

export const createInitialReferenceWorkspaceState = (): ReferenceWorkspaceState => ({
  referencesExpanded: true,
  categoryExpandedById: Object.fromEntries(
    [...REFERENCE_MANIFEST_CATEGORIES.map((category) => category.categoryId), USER_REFERENCE_CATEGORY_ID].map(
      (categoryId) => [categoryId, !DEFAULT_COLLAPSED_REFERENCE_CATEGORY_IDS.includes(categoryId)],
    ),
  ) as Record<ReferenceCategoryId, boolean>,
  visibilityById: Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, false]),
  ) as Record<string, boolean>,
  loadStateById: Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, 'unloaded']),
  ) as Record<string, ReferenceItemLoadState>,
  errorById: Object.fromEntries(
    REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, null]),
  ) as Record<string, string | null>,
  referenceLoadBatch: null,
  transformOverrideById: {},
  channelClampRangeByReferenceId: {},
  timelineModeByReferenceId: {},
  timelineConfigByReferenceId: {},
  transformSnapByReferenceId: {},
  transformSnapByObjectId: {},
  moveSnapDotsEnabled: true,
  previewLastMoveSnapDotsEnabled: false,
  moveSnapDotScale: 1,
  moveSnapDotDelayMs: 120,
  moveSnapDotNearScale: 1.45,
  moveSnapDotFarScale: 0.04,
  moveSnapDotVisibleRadiusMultiplier: 40,
  rotateSnapPreviewEnabled: true,
  rotateSnapPreviewLineSize: 1,
  rotateSnapPreviewLineThickness: 1,
  rotateSnapPreviewRadiusDeg: 60,
  rotateSnapPreviewDelayMs: 120,
  transformHistoryByReferenceId: {},
  activeReferenceTransformSession: null,
  contentObjectTransformOverrideById: {},
  transformHistoryByObjectId: {},
  environmentLightTransformBaseById: {},
  transformHistoryByEnvironmentLightId: {},
  activeContentObjectTransformSession: null,
  activeEnvironmentLightTransformSession: null,
  stagedImportDraft: null,
  importedReferencesById: {},
  importedReferenceOrder: [],
  partRowsByReferenceId: {},
  contentOrderByParentKey: {},
})

export const buildStagedImportDraftFileId = () => newId('staged-import-file')

export const DEFAULT_STAGED_IMPORT_SCALE_ALIGNMENT: StagedImportScaleAlignment = 'current-size'

export const resolveStagedImportAcceptedTransformOverride = (
  file: Pick<StagedImportDraftFileRecord, 'upAxis' | 'scaleAlignment' | 'scaleMultiplier'>,
): ReferenceTransformOverride | null => {
  const rotationDeg = resolveStagedImportUpAxisRotationDeg(file.upAxis)
  const scaleFactor = resolveStagedImportScaleMultiplier(file)
  const hasRotation = rotationDeg.x !== 0 || rotationDeg.y !== 0 || rotationDeg.z !== 0
  const hasScale = scaleFactor !== 1
  if (!hasRotation && !hasScale) {
    return null
  }
  return {
    position: { x: 0, y: 0, z: 0 },
    rotationDeg,
    scale: {
      x: scaleFactor,
      y: scaleFactor,
      z: scaleFactor,
    },
  }
}

export const buildInitialStagedImportStructureInspectionState =
  (): StagedImportStructureInspectionState => ({
    status: 'idle',
    summary: null,
    errorMessage: null,
  })

export const buildInitialStagedImportPreviewOrganizationState =
  (): StagedImportPreviewOrganizationState => ({
    nodesById: {},
    rootNodeIds: [],
    childNodeIdsByParentId: {},
  })

export const buildStagedImportPreviewAssemblyNodeId = () =>
  newId('staged-import-preview-assembly')

export const buildStagedImportPreviewComponentNodeId = () =>
  newId('staged-import-preview-component')

const buildStagedImportPreviewFileObjectNodeId = (stagedFileId: string) =>
  `staged-import-preview-object:file:${stagedFileId}`

const buildStagedImportPreviewFileComponentNodeId = (stagedFileId: string) =>
  `staged-import-preview-component:file:${stagedFileId}`

const buildStagedImportPreviewPartObjectNodeId = (
  stagedFileId: string,
  sourceMeshIndex: number,
) => `staged-import-preview-object:part:${stagedFileId}:${sourceMeshIndex}`

const isStagedImportPreviewOwnerNode = (
  node: StagedImportPreviewNodeRecord | null | undefined,
): node is StagedImportPreviewNodeRecord & { nodeKind: 'assembly' | 'component' } =>
  node?.nodeKind === 'assembly' || node?.nodeKind === 'component'

export const resolveStagedImportPreviewNodeIdFromTarget = (
  target: ProjectContentOwnerTarget,
): string =>
  target.kind === 'assembly'
    ? target.assemblyId
    : target.kind === 'component'
      ? target.componentId
      : target.kind === 'object'
        ? target.objectId
        : target.referenceId

const canStagedImportPreviewNodeUseMultipleObjects = (
  file: Pick<StagedImportDraftFileRecord, 'importMode' | 'structureInspection'>,
): file is Pick<StagedImportDraftFileRecord, 'importMode' | 'structureInspection'> & {
  importMode: 'multiple-objects-in-component'
  structureInspection: Extract<StagedImportStructureInspectionState, { status: 'ready' }>
} =>
  file.importMode === 'multiple-objects-in-component' &&
  file.structureInspection.status === 'ready' &&
  file.structureInspection.summary.partRows.length > 0

export const canStagedImportPreviewNodeParentNode = (
  nodesById: Record<string, StagedImportPreviewNodeRecord>,
  nodeId: string,
  parentNodeId: string | null,
): boolean => {
  if (parentNodeId === null) {
    return true
  }

  const node = nodesById[nodeId]
  const parentNode = nodesById[parentNodeId]
  if (node === undefined || parentNode === undefined) {
    return false
  }
  if (!isStagedImportPreviewOwnerNode(parentNode) || parentNode.nodeId === nodeId) {
    return false
  }
  if (parentNode.nodeKind === 'component' && node.nodeKind !== 'object') {
    return false
  }

  let currentParentId: string | null = parentNode.parentNodeId
  while (currentParentId !== null) {
    if (currentParentId === nodeId) {
      return false
    }
    currentParentId = nodesById[currentParentId]?.parentNodeId ?? null
  }
  return true
}

export const resolveStagedImportPreviewParentTarget = (
  node: Pick<StagedImportPreviewNodeRecord, 'parentNodeId'>,
  previewOrganization: StagedImportPreviewOrganizationState,
): { kind: 'assembly'; assemblyId: string } | { kind: 'component'; componentId: string } | null => {
  if (node.parentNodeId === null) {
    return null
  }
  const parentNode = previewOrganization.nodesById[node.parentNodeId]
  if (parentNode?.nodeKind === 'assembly') {
    return {
      kind: 'assembly',
      assemblyId: parentNode.nodeId,
    }
  }
  if (parentNode?.nodeKind === 'component') {
    return {
      kind: 'component',
      componentId: parentNode.nodeId,
    }
  }
  return null
}

const normalizeStagedImportPreviewChildOrder = (
  orderedNodeIds: readonly string[] | undefined,
  defaultNodeIds: readonly string[],
): string[] => {
  if (orderedNodeIds === undefined) {
    return dedupeOrderedRowIds(defaultNodeIds)
  }
  const defaultNodeIdSet = new Set(defaultNodeIds)
  const normalized = dedupeOrderedRowIds(
    orderedNodeIds.filter((nodeId) => defaultNodeIdSet.has(nodeId)),
  )
  defaultNodeIds.forEach((nodeId) => {
    if (!normalized.includes(nodeId)) {
      normalized.push(nodeId)
    }
  })
  return normalized
}

export const syncStagedImportPreviewOrganizationState = (
  stagedFiles: StagedImportDraftFileRecord[],
  currentPreviewOrganization: StagedImportPreviewOrganizationState | null,
): StagedImportPreviewOrganizationState => {
  const nextNodesById: Record<string, StagedImportPreviewNodeRecord> = {}
  const fallbackRankByNodeId = new Map<string, number>()
  let nextFallbackRank = 0

  stagedFiles.forEach((file) => {
    if (canStagedImportPreviewNodeUseMultipleObjects(file)) {
      const componentNodeId = buildStagedImportPreviewFileComponentNodeId(file.stagedFileId)
      nextNodesById[componentNodeId] = {
        nodeId: componentNodeId,
        nodeKind: 'component',
        sourceKind: 'staged-file',
        label: file.fileName,
        parentNodeId: null,
        stagedFileId: file.stagedFileId,
        fileType: file.fileType,
        sourcePartKey: null,
        sourceMeshIndex: null,
      }
      fallbackRankByNodeId.set(componentNodeId, nextFallbackRank++)
      file.structureInspection.summary.partRows.forEach((partRow) => {
        const nodeId = buildStagedImportPreviewPartObjectNodeId(
          file.stagedFileId,
          partRow.sourceMeshIndex,
        )
        nextNodesById[nodeId] = {
          nodeId,
          nodeKind: 'object',
          sourceKind: 'staged-part',
          label: partRow.label,
          parentNodeId: componentNodeId,
          stagedFileId: file.stagedFileId,
          fileType: file.fileType,
          sourcePartKey: partRow.partKey,
          sourceMeshIndex: partRow.sourceMeshIndex,
        }
        fallbackRankByNodeId.set(nodeId, nextFallbackRank++)
      })
      return
    }

    const nodeId = buildStagedImportPreviewFileObjectNodeId(file.stagedFileId)
    nextNodesById[nodeId] = {
      nodeId,
      nodeKind: 'object',
      sourceKind: 'staged-file',
      label: file.fileName,
      parentNodeId: null,
      stagedFileId: file.stagedFileId,
      fileType: file.fileType,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }
    fallbackRankByNodeId.set(nodeId, nextFallbackRank++)
  })

  const authoredNodes = Object.values(currentPreviewOrganization?.nodesById ?? {}).filter(
    (node) => node.sourceKind === 'authored',
  )
  authoredNodes.forEach((node) => {
    nextNodesById[node.nodeId] = node
    fallbackRankByNodeId.set(node.nodeId, nextFallbackRank++)
  })

  const nextNodeIds = new Set(Object.keys(nextNodesById))
  const nextResolvedNodesById: Record<string, StagedImportPreviewNodeRecord> = {}
  Object.values(nextNodesById).forEach((node) => {
    const currentParentId =
      currentPreviewOrganization?.nodesById[node.nodeId]?.parentNodeId ?? node.parentNodeId
    const fallbackParentId = node.parentNodeId
    const parentNodeId = canStagedImportPreviewNodeParentNode(
      nextNodesById,
      node.nodeId,
      currentParentId,
    )
      ? currentParentId
      : canStagedImportPreviewNodeParentNode(nextNodesById, node.nodeId, fallbackParentId)
        ? fallbackParentId
        : null
    nextResolvedNodesById[node.nodeId] = {
      ...node,
      parentNodeId,
    }
  })

  const childNodeIdsByParentId = new Map<string | null, string[]>()
  Object.values(nextResolvedNodesById).forEach((node) => {
    const siblingNodeIds = childNodeIdsByParentId.get(node.parentNodeId) ?? []
    siblingNodeIds.push(node.nodeId)
    childNodeIdsByParentId.set(node.parentNodeId, siblingNodeIds)
  })

  const sortByFallbackRank = (nodeIds: string[]): string[] =>
    [...nodeIds].sort(
      (left, right) =>
        (fallbackRankByNodeId.get(left) ?? Number.MAX_SAFE_INTEGER) -
          (fallbackRankByNodeId.get(right) ?? Number.MAX_SAFE_INTEGER) ||
        left.localeCompare(right),
    )

  const nextRootNodeIds = normalizeStagedImportPreviewChildOrder(
    currentPreviewOrganization?.rootNodeIds,
    sortByFallbackRank(childNodeIdsByParentId.get(null) ?? []),
  )

  const nextChildNodeIdsByParentId: Record<string, string[]> = {}
  Object.values(nextResolvedNodesById).forEach((node) => {
    if (!isStagedImportPreviewOwnerNode(node)) {
      return
    }
    const childNodeIds = sortByFallbackRank(childNodeIdsByParentId.get(node.nodeId) ?? [])
    if (childNodeIds.length === 0) {
      return
    }
    const previousOrderedNodeIds = currentPreviewOrganization?.childNodeIdsByParentId[node.nodeId]
    const normalizedChildNodeIds = normalizeStagedImportPreviewChildOrder(
      previousOrderedNodeIds,
      childNodeIds,
    ).filter((childNodeId) => nextNodeIds.has(childNodeId))
    if (normalizedChildNodeIds.length > 0) {
      nextChildNodeIdsByParentId[node.nodeId] = normalizedChildNodeIds
    }
  })

  return {
    nodesById: nextResolvedNodesById,
    rootNodeIds: nextRootNodeIds.filter((nodeId) => nextNodeIds.has(nodeId)),
    childNodeIdsByParentId: nextChildNodeIdsByParentId,
  }
}

export const canStagedImportFileUseMultipleObjects = (
  file: Pick<StagedImportDraftFileRecord, 'structureInspection'>,
): boolean =>
  file.structureInspection.status === 'ready' && file.structureInspection.summary.hasParts

export const buildStagedImportDraftFileCommitFailureMessage = (
  file: Pick<StagedImportDraftFileRecord, 'structureInspection'>,
): string => {
  if (file.structureInspection.status === 'error') {
    return file.structureInspection.errorMessage
  }
  return 'Structure inspection is still pending.'
}

export const pruneEmptyStagedImportPreviewAuthoredNodes = (
  previewOrganization: StagedImportPreviewOrganizationState,
): StagedImportPreviewOrganizationState => {
  const hasRetainedDescendantByNodeId = new Map<string, boolean>()

  const hasRetainedDescendant = (nodeId: string): boolean => {
    const cached = hasRetainedDescendantByNodeId.get(nodeId)
    if (cached !== undefined) {
      return cached
    }
    const node = previewOrganization.nodesById[nodeId]
    if (node === undefined) {
      hasRetainedDescendantByNodeId.set(nodeId, false)
      return false
    }
    if (node.sourceKind !== 'authored') {
      hasRetainedDescendantByNodeId.set(nodeId, true)
      return true
    }
    const childNodeIds = previewOrganization.childNodeIdsByParentId[nodeId] ?? []
    const retained = childNodeIds.some((childNodeId) => hasRetainedDescendant(childNodeId))
    hasRetainedDescendantByNodeId.set(nodeId, retained)
    return retained
  }

  const retainedNodeIds = new Set(
    Object.keys(previewOrganization.nodesById).filter((nodeId) => hasRetainedDescendant(nodeId)),
  )
  return {
    nodesById: Object.fromEntries(
      Object.entries(previewOrganization.nodesById).filter(([nodeId]) => retainedNodeIds.has(nodeId)),
    ),
    rootNodeIds: previewOrganization.rootNodeIds.filter((nodeId) => retainedNodeIds.has(nodeId)),
    childNodeIdsByParentId: Object.fromEntries(
      Object.entries(previewOrganization.childNodeIdsByParentId)
        .filter(([parentNodeId]) => retainedNodeIds.has(parentNodeId))
        .map(([parentNodeId, childNodeIds]) => [
          parentNodeId,
          childNodeIds.filter((childNodeId) => retainedNodeIds.has(childNodeId)),
        ])
        .filter(([, childNodeIds]) => childNodeIds.length > 0),
    ),
  }
}

export const updateStagedImportDraftFileRecord = (
  draft: StagedImportDraftState,
  stagedFileId: string,
  updater: (file: StagedImportDraftFileRecord) => StagedImportDraftFileRecord,
): StagedImportDraftState | null => {
  let changed = false
  const stagedFiles = draft.stagedFiles.map((file) => {
    if (file.stagedFileId !== stagedFileId) {
      return file
    }
    changed = true
    return updater(file)
  })

  return changed
    ? {
        ...draft,
        stagedFiles,
      }
    : null
}

export const revokeStagedImportDraftObjectUrls = (
  draft: StagedImportDraftState | null,
  referenceWorkspace?: Pick<
    ReferenceWorkspaceState,
    'importedReferencesById' | 'importedReferenceOrder'
  >,
) => {
  if (
    draft === null ||
    draft.stagedFiles.length === 0 ||
    typeof URL === 'undefined' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return
  }
  draft.stagedFiles.forEach((file) => {
    if (
      referenceWorkspace?.importedReferenceOrder.some((referenceId) => {
        const importedReference = referenceWorkspace.importedReferencesById[referenceId]
        return (
          importedReference?.sourceKind === 'imported' &&
          importedReference.assetPath === file.objectUrl
        )
      }) === true
    ) {
      return
    }
    URL.revokeObjectURL(file.objectUrl)
  })
}
