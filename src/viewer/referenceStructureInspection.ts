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

export type ImportedReferenceStructureInspectionSummary = {
  hasMultipleObjects: boolean
  hasHierarchy: boolean
  hasParts: boolean
  labels: string[]
  partRows: ReferencePartDescriptor[]
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
    return {
      ...structureStats,
      hasParts: partDescriptors.length > 0,
      labels: combineMeaningfulLabels(
        collectMeaningfulStructureLabels(object),
        partDescriptors.map((descriptor) => descriptor.label),
      ),
      partRows: partDescriptors,
    }
  } finally {
    disposeReferenceObjectTree(object)
  }
}
