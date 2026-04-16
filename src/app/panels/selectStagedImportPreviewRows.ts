import type {
  StagedImportDraftState,
  StagedImportPreviewNodeRecord,
} from '../store/useAppStore'

export type StagedImportPreviewRowVm = {
  rowId: string
  label: string
  meta: string
  depth: number
  rowKind: StagedImportPreviewNodeRecord['nodeKind']
  isExpandable: boolean
  isExpanded: boolean
  canCreateComponent: boolean
}

const resolvePreviewRowMeta = (node: StagedImportPreviewNodeRecord): string => {
  if (node.nodeKind === 'assembly') {
    return 'Draft assembly'
  }
  if (node.nodeKind === 'component') {
    return node.sourceKind === 'authored' ? 'Draft component' : 'Multiple objects'
  }
  if (node.sourceKind === 'staged-part') {
    return 'Part'
  }
  return node.fileType === null ? '' : `.${node.fileType.toUpperCase()}`
}

const buildPreviewRowsForParent = (
  draft: Pick<StagedImportDraftState, 'previewOrganization'>,
  parentNodeId: string | null,
  depth: number,
): StagedImportPreviewRowVm[] => {
  const orderedNodeIds =
    parentNodeId === null
      ? draft.previewOrganization.rootNodeIds
      : draft.previewOrganization.childNodeIdsByParentId[parentNodeId] ?? []

  return orderedNodeIds.flatMap((nodeId) => {
    const node = draft.previewOrganization.nodesById[nodeId]
    if (node === undefined) {
      return []
    }
    const childRows =
      node.nodeKind === 'assembly' || node.nodeKind === 'component'
        ? buildPreviewRowsForParent(draft, node.nodeId, depth + 1)
        : []
    return [
      {
        rowId: node.nodeId,
        label: node.label,
        meta: resolvePreviewRowMeta(node),
        depth,
        rowKind: node.nodeKind,
        isExpandable: childRows.length > 0,
        isExpanded: true,
        canCreateComponent: node.nodeKind === 'assembly',
      } satisfies StagedImportPreviewRowVm,
      ...childRows,
    ]
  })
}

export const selectStagedImportPreviewRows = (
  draft: Pick<StagedImportDraftState, 'previewOrganization'> | null,
): StagedImportPreviewRowVm[] => {
  if (draft === null) {
    return []
  }
  return buildPreviewRowsForParent(draft, null, 0)
}
