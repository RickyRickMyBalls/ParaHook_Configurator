import type { ReferenceFileType } from '../references/referenceManifest'
import { resolveReferenceAssetPath } from '../references/referenceManifest'
import {
  isCatalogActionAvailable,
  type CatalogActionPlan,
} from './catalogActionPlan'
import type { CatalogItemRecord } from './catalogItemContract'

export type CatalogReferenceCommitRequest = {
  downstreamOwner: 'browser-project'
  catalogItemId: string
  catalogFamilyKey: string
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

function resolveCatalogReferenceCommitAssetPath(item: CatalogItemRecord): string | null {
  switch (item.source.sourceKind) {
    case 'repo':
      return item.source.assetPath
    case 'planned':
      return item.source.sourceAssetPath ?? null
    case 'external':
    case 'imports':
      return null
  }
}

export function resolveCatalogReferenceCommitRequest(
  item: CatalogItemRecord,
  actionPlan: CatalogActionPlan,
): CatalogReferenceCommitRequest | null {
  if (
    item.assetKind !== 'reference-asset' ||
    actionPlan.actionFamily !== 'reference' ||
    actionPlan.downstreamOwner !== 'browser-project' ||
    actionPlan.primaryAction.actionKind !== 'add-to-project' ||
    !isCatalogActionAvailable(actionPlan.primaryAction)
  ) {
    return null
  }

  const assetPath = resolveCatalogReferenceCommitAssetPath(item)
  if (assetPath === null) {
    return null
  }

  const fileType = resolveCatalogReferenceFileType(assetPath)
  if (fileType === null) {
    return null
  }

  return {
    downstreamOwner: 'browser-project',
    catalogItemId: item.itemId,
    catalogFamilyKey: item.familyKey,
    fileName: item.label,
    fileType,
    objectUrl: resolveReferenceAssetPath(assetPath),
  }
}
