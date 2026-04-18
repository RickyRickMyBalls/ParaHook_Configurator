import type { CatalogItemActionKind, CatalogItemRecord } from './catalogItemContract'

export type CatalogActionAvailability = 'available' | 'planned'

export type CatalogActionSpec = {
  actionKind: CatalogItemActionKind
  label: string
  availability: CatalogActionAvailability
}

export type CatalogActionFamily = 'reference' | 'environment'

export type CatalogActionPlan = {
  actionFamily: CatalogActionFamily
  primaryAction: CatalogActionSpec
  secondaryAction: CatalogActionSpec | null
  allowsTemporaryPreview: boolean
  allowsMultipleTemporaryPreviews: boolean
  previewOwner: 'catalog-session' | null
  downstreamOwner: 'browser-project' | 'viewer-environment'
}

function buildCatalogActionSpec(actionKind: CatalogItemActionKind): CatalogActionSpec {
  switch (actionKind) {
    case 'add-to-project':
      return {
        actionKind,
        label: 'Add To Project',
        availability: 'available',
      }
    case 'apply-environment':
      return {
        actionKind,
        label: 'Apply Environment',
        availability: 'available',
      }
    case 'load-preview':
    default:
      return {
        actionKind: 'load-preview',
        label: 'Load Preview',
        availability: 'available',
      }
  }
}

export function resolveCatalogActionPlan(item: CatalogItemRecord): CatalogActionPlan {
  if (item.assetKind === 'environment') {
    return {
      actionFamily: 'environment',
      primaryAction: buildCatalogActionSpec('apply-environment'),
      secondaryAction: null,
      allowsTemporaryPreview: false,
      allowsMultipleTemporaryPreviews: false,
      previewOwner: null,
      downstreamOwner: 'viewer-environment',
    }
  }

  if (item.actionKind === 'load-preview') {
    return {
      actionFamily: 'reference',
      primaryAction: buildCatalogActionSpec('load-preview'),
      secondaryAction: null,
      allowsTemporaryPreview: true,
      allowsMultipleTemporaryPreviews: true,
      previewOwner: 'catalog-session',
      downstreamOwner: 'browser-project',
    }
  }

  return {
    actionFamily: 'reference',
    primaryAction: buildCatalogActionSpec(item.actionKind),
    secondaryAction: buildCatalogActionSpec('load-preview'),
    allowsTemporaryPreview: true,
    allowsMultipleTemporaryPreviews: true,
    previewOwner: 'catalog-session',
    downstreamOwner: 'browser-project',
  }
}

export function isCatalogActionAvailable(action: CatalogActionSpec): boolean {
  return action.availability === 'available'
}
