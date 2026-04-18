import { describe, expect, it } from 'vitest'
import type { CatalogItemRecord } from './catalogItemContract'
import {
  isCatalogActionAvailable,
  resolveCatalogActionPlan,
} from './catalogActionPlan'

describe('catalogActionPlan', () => {
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
        assetPath: 'ReferenceModels/shoes/Shoe_1.glb',
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
