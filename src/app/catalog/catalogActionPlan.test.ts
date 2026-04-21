import { describe, expect, it } from 'vitest'
import {
  CATALOG_ITEM_ACTION_KINDS,
  type CatalogItemRecord,
} from './catalogItemContract'
import {
  isCatalogActionAvailable,
  resolveCatalogActionPlan,
} from './catalogActionPlan'

describe('catalogActionPlan', () => {
  it('keeps the Catalog action kind contract unchanged for the external source boundary', () => {
    expect(CATALOG_ITEM_ACTION_KINDS).toEqual([
      'load-preview',
      'add-to-project',
      'apply-environment',
    ])
  })

  it('keeps repo-backed reference entries on an explicit commit-plus-preview action split', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'references',
      sectionKey: 'shoes',
      tags: ['reference', 'shoe'],
      description: 'Repo-backed shoe reference.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_1.glb',
      },
      previewMedia: [],
    }

    const actionPlan = resolveCatalogActionPlan(item)

    expect(actionPlan).toEqual(
      expect.objectContaining({
        actionFamily: 'reference',
        allowsTemporaryPreview: true,
        allowsMultipleTemporaryPreviews: true,
        previewOwner: 'catalog-session',
        downstreamOwner: 'browser-project',
        primaryAction: expect.objectContaining({
          actionKind: 'add-to-project',
          label: 'Add To Project',
          availability: 'available',
        }),
        secondaryAction: expect.objectContaining({
          actionKind: 'load-preview',
          label: 'Load Preview',
          availability: 'available',
        }),
      }),
    )
    expect(isCatalogActionAvailable(actionPlan.primaryAction)).toBe(true)
    expect(isCatalogActionAvailable(actionPlan.secondaryAction!)).toBe(true)
  })

  it('keeps imports reuse entries on a preview-only action family without inventing a fake commit', () => {
    const item: CatalogItemRecord = {
      itemId: 'imports:shoe-1',
      label: 'Imported Shoe 1',
      familyKey: 'imports',
      sectionKey: 'user-references',
      tags: ['imports', 'shoe'],
      description: 'Imports reuse entry.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'imports',
        importId: 'imported-reference-1',
        assetPath: 'blob:imported-reference-1',
      },
      previewMedia: [],
    }

    const actionPlan = resolveCatalogActionPlan(item)

    expect(actionPlan.primaryAction).toEqual(
      expect.objectContaining({
        actionKind: 'load-preview',
        label: 'Load Preview',
        availability: 'available',
      }),
    )
    expect(actionPlan.secondaryAction).toBeNull()
    expect(actionPlan.previewOwner).toBe('catalog-session')
    expect(actionPlan.downstreamOwner).toBe('browser-project')
  })

  it('keeps external source entries preview-only instead of turning source pages into project actions', () => {
    const item: CatalogItemRecord = {
      itemId: 'external:pubparts:source-page',
      label: 'External PubParts Source',
      familyKey: 'external-pubparts',
      sectionKey: 'external-pubparts-parts',
      tags: ['external', 'pubparts'],
      description: 'External source entry.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'external',
        provider: {
          providerId: 'pubparts',
          providerName: 'PubParts',
        },
        externalItemUrl: 'https://www.printables.com/model/598759',
        sourceUrl: 'https://pubparts.xyz/parts.json',
        linkedArchiveUrl: 'https://www.dropbox.com/example.zip',
      },
      previewMedia: [],
    }

    const actionPlan = resolveCatalogActionPlan(item)

    expect(actionPlan.primaryAction).toEqual(
      expect.objectContaining({
        actionKind: 'load-preview',
        label: 'Load Preview',
        availability: 'available',
      }),
    )
    expect(actionPlan.secondaryAction).toBeNull()
    expect(actionPlan.previewOwner).toBe('catalog-session')
    expect(actionPlan.downstreamOwner).toBe('browser-project')
  })

  it('keeps planned starting assemblies preview-only until a builder load owner exists', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:test-starting-assembly',
      label: 'Test Starting Assembly',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['reference', 'starting-assembly'],
      description: 'Starting assembly proof without downstream load behavior.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/test-only/xr-starting-assembly.step',
      },
      previewMedia: [],
      itemRole: 'starting-assembly',
      startingAssembly: {
        status: 'planned',
        platformFamily: 'XR',
        sourceAssetPreference: 'step-or-stp',
      },
    }

    const actionPlan = resolveCatalogActionPlan(item)

    expect(actionPlan.primaryAction).toEqual(
      expect.objectContaining({
        actionKind: 'load-preview',
        label: 'Load Preview',
        availability: 'available',
      }),
    )
    expect(actionPlan.secondaryAction).toBeNull()
    expect(actionPlan.previewOwner).toBe('catalog-session')
    expect(actionPlan.downstreamOwner).toBe('browser-project')
    expect(isCatalogActionAvailable(actionPlan.primaryAction)).toBe(true)
  })

  it('lets planned heavy STEP starting assemblies add their source file while preview stays planned', () => {
    const item: CatalogItemRecord = {
      itemId: 'starting-assembly:adv-full-assembly-planned',
      label: 'ADV Full Assembly',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['starting-assembly', 'adv', 'planned-source'],
      description: 'Planned heavy STEP source entry.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'planned',
        sourceLabel: 'Verified ADV STEP source candidate',
        sourceAssetPath: 'Catalog/boards/adv/ADV_Full Assembly_parts.step',
        sourceAssetFormat: 'step-or-stp',
        sourceFileSizeBytes: 55825705,
        sourceStatus: 'known-heavy-source',
      },
      previewMedia: [],
      itemRole: 'starting-assembly',
      startingAssembly: {
        status: 'planned',
        platformFamily: 'ADV',
        sourceAssetPreference: 'step-or-stp',
      },
    }

    const actionPlan = resolveCatalogActionPlan(item)

    expect(actionPlan).toEqual({
      actionFamily: 'reference',
      primaryAction: {
        actionKind: 'add-to-project',
        label: 'Add To Project',
        availability: 'available',
      },
      secondaryAction: {
        actionKind: 'load-preview',
        label: 'Preview Planned',
        availability: 'planned',
      },
      allowsTemporaryPreview: false,
      allowsMultipleTemporaryPreviews: false,
      previewOwner: null,
      downstreamOwner: 'browser-project',
    })
    expect(isCatalogActionAvailable(actionPlan.primaryAction)).toBe(true)
    expect(isCatalogActionAvailable(actionPlan.secondaryAction!)).toBe(false)
  })

  it('keeps environment entries on their own apply family instead of pretending they are references', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:studio-1',
      label: 'Studio Lighting',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri'],
      description: 'Environment fixture entry.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'Environments/studio-1.hdr',
      },
      previewMedia: [],
    }

    const actionPlan = resolveCatalogActionPlan(item)

    expect(actionPlan).toEqual(
      expect.objectContaining({
        actionFamily: 'environment',
        allowsTemporaryPreview: false,
        allowsMultipleTemporaryPreviews: false,
        previewOwner: null,
        downstreamOwner: 'viewer-environment',
        primaryAction: expect.objectContaining({
          actionKind: 'apply-environment',
          label: 'Apply Environment',
          availability: 'available',
        }),
        secondaryAction: null,
      }),
    )
    expect(isCatalogActionAvailable(actionPlan.primaryAction)).toBe(true)
  })
})
