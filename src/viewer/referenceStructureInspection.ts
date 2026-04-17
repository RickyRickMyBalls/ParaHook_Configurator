import type { Object3D } from 'three'
import type { ImportedReferenceFile } from '../app/references/importReferenceFile'
import {
  extractReferencePartDescriptors,
  isMeaningfulPartLabel,
  type ReferencePartDescriptor,
} from './referencePartDescriptors'
import {
  disposeReferenceObjectTree,
  loadReferenceAssetObject,
} from './referenceAssetLoader'

const MAX_PREVIEW_LABELS = 4
const MAX_HIERARCHY_ROWS = 24
const MAX_HIERARCHY_DEPTH = 4

export type ImportedReferenceHierarchyRow = {
  label: string
  children: ImportedReferenceHierarchyRow[]
}

export type ImportedReferenceStructureInspectionSummary = {
  hasMultipleObjects: boolean
  hasHierarchy: boolean
  hasParts: boolean
  labels: string[]
  partRows: ReferencePartDescriptor[]
  hierarchyRows?: ImportedReferenceHierarchyRow[]
}

const collectObjectStructureStats = (
  object: Object3D,
): Pick<ImportedReferenceStructureInspectionSummary, 'hasMultipleObjects' | 'hasHierarchy'> => {
  let descendantCount = 0
  let hasHierarchy = false

  object.traverse((child) => {
    if (child === object) {
      return
    }
    descendantCount += 1
    if (child.children.length > 0) {
      hasHierarchy = true
    }
  })

  return {
    hasMultipleObjects: descendantCount > 1,
    hasHierarchy,
  }
}

const collectMeaningfulStructureLabels = (object: Object3D): string[] => {
  const labels: string[] = []
  const seen = new Set<string>()

  object.traverse((child) => {
    if (child === object) {
      return
    }
    const label = child.name?.trim()
    if (!isMeaningfulPartLabel(label) || seen.has(label)) {
      return
    }
    seen.add(label)
    labels.push(label)
  })

  return labels
}

const combineMeaningfulLabels = (...lists: string[][]): string[] => {
  const labels: string[] = []
  const seen = new Set<string>()

  for (const list of lists) {
    for (const label of list) {
      const trimmed = label.trim()
      if (!isMeaningfulPartLabel(trimmed) || seen.has(trimmed)) {
        continue
      }
      seen.add(trimmed)
      labels.push(trimmed)
      if (labels.length >= MAX_PREVIEW_LABELS) {
        return labels
      }
    }
  }

  return labels
}

const collectMeaningfulHierarchyRows = (
  object: Object3D,
  depth = 0,
  state: { remainingRows: number } = { remainingRows: MAX_HIERARCHY_ROWS },
): ImportedReferenceHierarchyRow[] => {
  if (depth >= MAX_HIERARCHY_DEPTH || state.remainingRows <= 0) {
    return []
  }

  const rows: ImportedReferenceHierarchyRow[] = []

  for (const child of object.children) {
    if (state.remainingRows <= 0) {
      break
    }

    const childRows = collectMeaningfulHierarchyRows(child, depth + 1, state)
    const label = child.name?.trim()

    if (isMeaningfulPartLabel(label)) {
      rows.push({
        label,
        children: childRows,
      })
      state.remainingRows -= 1
      continue
    }

    if (childRows.length > 0) {
      rows.push(...childRows)
    }
  }

  return rows
}

export const inspectImportedReferenceFileStructure = async (
  referenceId: string,
  file: Pick<ImportedReferenceFile, 'fileType' | 'objectUrl'>,
): Promise<ImportedReferenceStructureInspectionSummary> => {
  const object = await loadReferenceAssetObject({
    fileType: file.fileType,
    assetPath: file.objectUrl,
  })

  try {
    const partDescriptors = extractReferencePartDescriptors(referenceId, object)
    const structureStats = collectObjectStructureStats(object)
    const hierarchyRows = collectMeaningfulHierarchyRows(object)
    return {
      ...structureStats,
      hasParts: partDescriptors.length > 0,
      labels: combineMeaningfulLabels(
        collectMeaningfulStructureLabels(object),
        partDescriptors.map((descriptor) => descriptor.label),
      ),
      partRows: partDescriptors,
      hierarchyRows,
    }
  } finally {
    disposeReferenceObjectTree(object)
  }
}
