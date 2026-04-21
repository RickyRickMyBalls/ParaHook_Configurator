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
  downstreamOwner: 'browser-project' | 'viewer-environment' | null
}

function buildCatalogActionSpec(
  actionKind: CatalogItemActionKind,
  availability: CatalogActionAvailability = 'available',
): CatalogActionSpec {
  switch (actionKind) {
    case 'add-to-project':
      return {
        actionKind,
        label: 'Add To Project',
        availability,
      }
    case 'apply-environment':
      return {
        actionKind,
        label: 'Apply Environment',
        availability,
      }
    case 'load-preview':
    default:
      return {
        actionKind: 'load-preview',
        label: availability === 'planned' ? 'Preview Planned' : 'Load Preview',
        availability,
      }
  }
}

export function resolveCatalogActionPlan(item: CatalogItemRecord): CatalogActionPlan {
  if (item.source.sourceKind === 'planned') {
    if (item.itemRole === 'starting-assembly' && item.source.sourceAssetPath) {
      return {
        actionFamily: 'reference',
        primaryAction: buildCatalogActionSpec('add-to-project'),
        secondaryAction: buildCatalogActionSpec('load-preview', 'planned'),
        allowsTemporaryPreview: false,
        allowsMultipleTemporaryPreviews: false,
        previewOwner: null,
        downstreamOwner: 'browser-project',
      }
    }

    return {
      actionFamily: 'reference',
      primaryAction: buildCatalogActionSpec('load-preview', 'planned'),
      secondaryAction: null,
      allowsTemporaryPreview: false,
      allowsMultipleTemporaryPreviews: false,
      previewOwner: null,
      downstreamOwner: null,
    }
  }

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
