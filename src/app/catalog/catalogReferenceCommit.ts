import type { ReferenceFileType } from '../references/referenceManifest'
import { resolveReferenceAssetPath } from '../references/referenceManifest'
import {
  isCatalogActionAvailable,
  type CatalogActionPlan,
} from './catalogActionPlan'
import type { CatalogItemRecord } from './catalogItemContract'

export type CatalogReferenceCommitRequest = {
  downstreamOwner: 'browser-project'
  fileName: string
  fileType: ReferenceFileType
  objectUrl: string
}

function resolveCatalogReferenceFileType(assetPath: string): ReferenceFileType | null {
  const normalizedAssetPath = assetPath.trim().toLowerCase()
  if (normalizedAssetPath.endsWith('.obj')) {
    return 'obj'
  }
  if (normalizedAssetPath.endsWith('.glb')) {
    return 'glb'
  }
  if (normalizedAssetPath.endsWith('.stl')) {
    return 'stl'
  }
  if (normalizedAssetPath.endsWith('.step')) {
    return 'step'
  }
  return null
}

export function resolveCatalogReferenceCommitRequest(
  item: CatalogItemRecord,
  actionPlan: CatalogActionPlan,
): CatalogReferenceCommitRequest | null {
  if (
    item.assetKind !== 'reference-asset' ||
    item.source.sourceKind !== 'repo' ||
    actionPlan.actionFamily !== 'reference' ||
    actionPlan.downstreamOwner !== 'browser-project' ||
    actionPlan.primaryAction.actionKind !== 'add-to-project' ||
    !isCatalogActionAvailable(actionPlan.primaryAction)
  ) {
    return null
  }

  const fileType = resolveCatalogReferenceFileType(item.source.assetPath)
  if (fileType === null) {
    return null
  }

  return {
    downstreamOwner: 'browser-project',
    fileName: item.label,
    fileType,
    objectUrl: resolveReferenceAssetPath(item.source.assetPath),
  }
}
