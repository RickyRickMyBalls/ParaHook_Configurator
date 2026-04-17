import type {
  StagedImportDraftState,
  StagedImportDraftFileRecord,
  StagedImportPreviewNodeRecord,
  StagedImportStructureInspectionState,
} from '../store/useAppStore'
import { canStagedImportFileUseMultipleObjects } from '../store/useAppStore'

type StagedImportPreviewRowKind = StagedImportPreviewNodeRecord['nodeKind'] | 'part'
export type StagedImportPreviewTargetKind = 'preview-target' | 'organization-only' | 'inspection-only'
export type StagedImportPreviewSelectionState = {
  stagedFileId: string
  sourceRowId: string | null
}

export type StagedImportPreviewRowVm = {
  rowId: string
  label: string
  meta: string
  depth: number
  rowKind: StagedImportPreviewRowKind
  previewTargetKind: StagedImportPreviewTargetKind
  canDeleteFromPreviewOrganization: boolean
  previewLoadStagedFileId: string | null
  canLoadIntoObjectPreview: boolean
  isActivePreviewSelection: boolean
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

const buildDerivedStagedImportPartRowId = (
  stagedFileId: string,
  sourceMeshIndex: number,
): string => `staged-import-preview-derived-part:${stagedFileId}:${sourceMeshIndex}`

const canDraftFileShowDerivedInspectionParts = (
  file: Pick<StagedImportDraftFileRecord, 'importMode' | 'structureInspection'>,
): file is Pick<StagedImportDraftFileRecord, 'importMode' | 'structureInspection'> & {
  importMode: 'single-object'
  structureInspection: Extract<StagedImportStructureInspectionState, { status: 'ready' }>
} =>
  file.importMode === 'single-object' &&
  canStagedImportFileUseMultipleObjects(file) &&
  file.structureInspection.status === 'ready' &&
  file.structureInspection.summary.partRows.length > 0

const buildDerivedInspectionPartRows = (
  draft: Pick<StagedImportDraftState, 'stagedFiles'>,
  node: StagedImportPreviewNodeRecord,
  depth: number,
): StagedImportPreviewRowVm[] => {
  if (
    node.nodeKind !== 'object' ||
    node.sourceKind !== 'staged-file' ||
    node.stagedFileId === null
  ) {
    return []
  }

  const stagedFile =
    draft.stagedFiles.find((candidate) => candidate.stagedFileId === node.stagedFileId) ?? null
  if (stagedFile === null || !canDraftFileShowDerivedInspectionParts(stagedFile)) {
    return []
  }

  return stagedFile.structureInspection.summary.partRows.map((partRow) => ({
    rowId: buildDerivedStagedImportPartRowId(stagedFile.stagedFileId, partRow.sourceMeshIndex),
    label: partRow.label,
    meta: 'Part',
    depth,
    rowKind: 'part',
    previewTargetKind: 'inspection-only',
    canDeleteFromPreviewOrganization: false,
    previewLoadStagedFileId: null,
    canLoadIntoObjectPreview: false,
    isActivePreviewSelection: false,
    isExpandable: false,
    isExpanded: true,
    canCreateComponent: false,
  }))
}

const buildPreviewRowsForParent = (
  draft: Pick<StagedImportDraftState, 'previewOrganization' | 'stagedFiles'>,
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
        : buildDerivedInspectionPartRows(draft, node, depth + 1)
    return [
      {
        rowId: node.nodeId,
        label: node.label,
        meta: resolvePreviewRowMeta(node),
        depth,
        rowKind: node.nodeKind,
        previewTargetKind: node.nodeKind === 'object' ? 'preview-target' : 'organization-only',
        canDeleteFromPreviewOrganization:
          (node.nodeKind === 'assembly' || node.nodeKind === 'component') &&
          node.sourceKind === 'authored',
        previewLoadStagedFileId: node.nodeKind === 'object' ? node.stagedFileId : null,
        canLoadIntoObjectPreview: node.nodeKind === 'object' && node.stagedFileId !== null,
        isActivePreviewSelection: false,
        isExpandable: childRows.length > 0,
        isExpanded: true,
        canCreateComponent: node.nodeKind === 'assembly',
      } satisfies StagedImportPreviewRowVm,
      ...childRows,
    ]
  })
}

const applyActivePreviewSelection = (
  rows: StagedImportPreviewRowVm[],
  previewSelection: StagedImportPreviewSelectionState | null,
): StagedImportPreviewRowVm[] => {
  if (previewSelection === null) {
    return rows
  }

  let activeRowId: string | null = null
  if (previewSelection.sourceRowId !== null) {
    const explicitRow = rows.find(
      (row) =>
        row.rowId === previewSelection.sourceRowId &&
        row.previewLoadStagedFileId === previewSelection.stagedFileId,
    )
    activeRowId = explicitRow?.rowId ?? null
  }

  if (activeRowId === null) {
    const matchingRows = rows.filter(
      (row) =>
        row.canLoadIntoObjectPreview && row.previewLoadStagedFileId === previewSelection.stagedFileId,
    )
    if (matchingRows.length === 1) {
      activeRowId = matchingRows[0]?.rowId ?? null
    }
  }

  if (activeRowId === null) {
    return rows
  }

  return rows.map((row) =>
    row.rowId === activeRowId ? { ...row, isActivePreviewSelection: true } : row,
  )
}

export const selectStagedImportPreviewRows = (
  draft: Pick<StagedImportDraftState, 'previewOrganization' | 'stagedFiles'> | null,
  previewSelection: StagedImportPreviewSelectionState | null = null,
): StagedImportPreviewRowVm[] => {
  if (draft === null) {
    return []
  }
  const rows = buildPreviewRowsForParent(draft, null, 0)
  return applyActivePreviewSelection(rows, previewSelection)
}
