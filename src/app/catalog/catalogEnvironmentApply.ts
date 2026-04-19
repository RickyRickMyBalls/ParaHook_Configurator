import {
  isCatalogActionAvailable,
  type CatalogActionPlan,
} from './catalogActionPlan'
import {
  resolveCatalogRepoEnvironmentSource,
  type CatalogEnvironmentFileType,
  type CatalogItemRecord,
} from './catalogItemContract'

export type CatalogEnvironmentApplyRequest = {
  downstreamOwner: 'viewer-environment'
  label: string
  assetPath: string
  fileType: CatalogEnvironmentFileType
}

export function resolveCatalogEnvironmentApplyRequest(
  item: CatalogItemRecord,
  actionPlan: CatalogActionPlan,
): CatalogEnvironmentApplyRequest | null {
  if (
    item.assetKind !== 'environment' ||
    item.source.sourceKind !== 'repo' ||
    actionPlan.actionFamily !== 'environment' ||
    actionPlan.downstreamOwner !== 'viewer-environment' ||
    actionPlan.primaryAction.actionKind !== 'apply-environment' ||
    !isCatalogActionAvailable(actionPlan.primaryAction)
  ) {
    return null
  }

  const environmentSource = resolveCatalogRepoEnvironmentSource(item)
  if (environmentSource === null) {
    return null
  }

  return {
    downstreamOwner: 'viewer-environment',
    label: environmentSource.label,
    assetPath: environmentSource.objectUrl,
    fileType: environmentSource.fileType,
  }
}
