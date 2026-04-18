import type { EnvPreset } from '../../shared/viewSettingsTypes'
import {
  isCatalogActionAvailable,
  type CatalogActionPlan,
} from './catalogActionPlan'
import type { CatalogItemRecord } from './catalogItemContract'

export type CatalogEnvironmentApplyRequest = {
  downstreamOwner: 'viewer-environment'
  envPreset: EnvPreset
}

function resolveCatalogEnvironmentPreset(item: CatalogItemRecord): EnvPreset | null {
  switch (item.itemId) {
    case 'environment:studio':
      return 'studio'
    default:
      return null
  }
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

  const envPreset = resolveCatalogEnvironmentPreset(item)
  if (envPreset === null) {
    return null
  }

  return {
    downstreamOwner: 'viewer-environment',
    envPreset,
  }
}
