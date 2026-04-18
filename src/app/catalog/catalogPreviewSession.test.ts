import { describe, expect, it } from 'vitest'
import {
  isCatalogPreviewLoaded,
  loadCatalogPreviewItems,
  readCatalogPreviewSession,
  resetCatalogPreviewSessionsForTests,
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
})
