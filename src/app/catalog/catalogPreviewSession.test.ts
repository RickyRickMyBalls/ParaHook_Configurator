import { describe, expect, it, vi } from 'vitest'
import * as catalogActionPlan from './catalogActionPlan'
import type { CatalogItemRecord } from './catalogItemContract'
import {
  isCatalogPreviewLoaded,
  loadCatalogPreviewItems,
  readCatalogPreviewSession,
  resetCatalogPreviewSessionsForTests,
  resolveCatalogDisplayedPreviewLoadTargetItemIds,
  resolveCatalogPreviewTargetItemIds,
  sanitizeCatalogPreviewSessionState,
  unloadAllCatalogPreviewItems,
  unloadCatalogPreviewItem,
  writeCatalogPreviewSession,
} from './catalogPreviewSession'

describe('catalogPreviewSession', () => {
  it('keeps one preview session per surface instance and restores it on the same surface id', () => {
    resetCatalogPreviewSessionsForTests()

    writeCatalogPreviewSession('catalog-surface-1', {
      loadedItemIds: ['reference:shoe-1', 'reference:hook-large'],
    })

    expect(readCatalogPreviewSession('catalog-surface-1')).toEqual({
      loadedItemIds: ['reference:shoe-1', 'reference:hook-large'],
    })
    expect(readCatalogPreviewSession('catalog-surface-2')).toEqual({
      loadedItemIds: [],
    })
  })

  it('loads, unloads, and clears temporary preview ids without pretending they are project truth', () => {
    const loadedSession = loadCatalogPreviewItems(
      { loadedItemIds: ['reference:shoe-1'] },
      ['reference:shoe-1', 'reference:hook-large'],
    )

    expect(loadedSession).toEqual({
      loadedItemIds: ['reference:shoe-1', 'reference:hook-large'],
    })
    expect(isCatalogPreviewLoaded(loadedSession, 'reference:hook-large')).toBe(true)

    const partiallyUnloadedSession = unloadCatalogPreviewItem(
      loadedSession,
      'reference:shoe-1',
    )
    expect(partiallyUnloadedSession).toEqual({
      loadedItemIds: ['reference:hook-large'],
    })
    expect(unloadAllCatalogPreviewItems()).toEqual({
      loadedItemIds: [],
    })
  })

  it('resolves multi-card preview targets locally without requiring workspace-wide selection semantics', () => {
    expect(
      resolveCatalogPreviewTargetItemIds('reference:shoe-1', [
        'reference:shoe-1',
        'reference:hook-large',
      ]),
    ).toEqual(['reference:shoe-1', 'reference:hook-large'])

    expect(
      resolveCatalogPreviewTargetItemIds('reference:shoe-1', ['reference:hook-large']),
    ).toEqual(['reference:shoe-1'])
  })

  it('sanitizes stale preview session ids against the current catalog snapshot', () => {
    expect(
      sanitizeCatalogPreviewSessionState(
        {
          loadedItemIds: ['reference:shoe-1', 'stale:item', 'reference:shoe-1'],
        },
        ['reference:shoe-1', 'reference:hook-large'],
      ),
    ).toEqual({
      loadedItemIds: ['reference:shoe-1'],
    })
  })

  it('keeps downstream committed imports entries out of preview ownership until preview is explicitly loaded for them', () => {
    const sanitizedSession = sanitizeCatalogPreviewSessionState(
      {
        loadedItemIds: ['reference:shoe-1'],
      },
      ['reference:shoe-1', 'imports:catalog-commit-1'],
    )

    expect(sanitizedSession).toEqual({
      loadedItemIds: ['reference:shoe-1'],
    })
    expect(isCatalogPreviewLoaded(sanitizedSession, 'imports:catalog-commit-1')).toBe(false)
  })

  it('filters out commit-only and apply-environment cards when resolving displayed preview targets', () => {
    const resolveCatalogActionPlanSpy = vi
      .spyOn(catalogActionPlan, 'resolveCatalogActionPlan')
      .mockImplementation((item: CatalogItemRecord) => {
        if (item.itemId === 'reference:shoe-1') {
          return {
            actionFamily: 'reference',
            primaryAction: {
              actionKind: 'load-preview',
              label: 'Load Preview',
              availability: 'available',
            },
            secondaryAction: null,
            allowsTemporaryPreview: true,
            allowsMultipleTemporaryPreviews: true,
            previewOwner: 'catalog-session',
            downstreamOwner: 'browser-project',
          }
        }

        return {
          actionFamily: item.assetKind === 'environment' ? 'environment' : 'reference',
          primaryAction: {
            actionKind: item.assetKind === 'environment' ? 'apply-environment' : 'add-to-project',
            label: item.assetKind === 'environment' ? 'Apply Environment' : 'Add To Project',
            availability: 'available',
          },
          secondaryAction: null,
          allowsTemporaryPreview: false,
          allowsMultipleTemporaryPreviews: false,
          previewOwner: null,
          downstreamOwner:
            item.assetKind === 'environment' ? 'viewer-environment' : 'browser-project',
        }
      })

    const previewableItem: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'shoes',
      sectionKey: 'shoes',
      tags: ['reference', 'shoe'],
      description: 'Preview-capable reference item.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_1.glb',
      },
      previewMedia: [],
    }

    const commitOnlyItem: CatalogItemRecord = {
      itemId: 'reference:shoe-commit-only',
      label: 'Commit Only Shoe',
      familyKey: 'shoes',
      sectionKey: 'shoes',
      tags: ['reference', 'shoe'],
      description: 'Commit-only reference item.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_Commit_Only.glb',
      },
      previewMedia: [],
    }

    const applyOnlyItem: CatalogItemRecord = {
      itemId: 'environment:studio-small-09-2k-hdr',
      label: 'Studio Small 09 2K HDR',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri'],
      description: 'Apply-only environment item.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'HDRI/studio_small_09_2k.hdr',
      },
      previewMedia: [],
    }

    expect(
      resolveCatalogDisplayedPreviewLoadTargetItemIds([
        previewableItem,
        commitOnlyItem,
        applyOnlyItem,
      ]),
    ).toEqual(['reference:shoe-1'])
    expect(resolveCatalogActionPlanSpy).toHaveBeenCalledTimes(3)

    resolveCatalogActionPlanSpy.mockRestore()
  })
})
