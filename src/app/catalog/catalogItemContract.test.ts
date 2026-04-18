import { describe, expect, it } from 'vitest'
import {
  getCatalogItemPrimaryPreviewMedia,
  isCatalogItemActionKind,
  isCatalogItemAssetKind,
  isCatalogItemImportsEntry,
  isCatalogItemSourceKind,
  resolveCatalogRepoReferencePreviewSource,
  resolveCatalogPreviewMediaSrc,
  type CatalogItemRecord,
} from './catalogItemContract'

describe('catalogItemContract', () => {
  it('defines one explicit baseline catalog item shape for repo-backed browse entries', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'references',
      sectionKey: 'shoes',
      tags: ['shoe', 'reference'],
      description: 'Baseline repo-backed shoe reference for Catalog browse.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'ReferenceModels/shoes/Shoe_1.glb',
      },
      previewMedia: [
        {
          mediaKind: 'image',
          src: 'CatalogPreviews/shoes/Shoe_1.png',
          alt: 'Shoe 1 preview',
        },
      ],
    }

    expect(isCatalogItemAssetKind(item.assetKind)).toBe(true)
    expect(isCatalogItemActionKind(item.actionKind)).toBe(true)
    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(isCatalogItemImportsEntry(item)).toBe(false)
    expect(getCatalogItemPrimaryPreviewMedia(item)).toEqual(item.previewMedia[0])
  })

  it('keeps imports-area reuse entries explicit without pretending Catalog owns import intake', () => {
    const item: CatalogItemRecord = {
      itemId: 'imports:shoe-1',
      label: 'Imported Shoe 1',
      familyKey: 'imports',
      sectionKey: 'user-references',
      tags: ['imports', 'shoe'],
      description: 'Previously imported shoe surfaced for reuse in Catalog.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'imports',
        importId: 'import-record-1',
        assetPath: 'ImportedModels/shoes/imported-shoe-1.glb',
      },
      previewMedia: [],
    }

    expect(isCatalogItemImportsEntry(item)).toBe(true)
    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(getCatalogItemPrimaryPreviewMedia(item)).toBeNull()
  })

  it('resolves repo-backed preview media through the app base path', () => {
    expect(resolveCatalogPreviewMediaSrc('CatalogPreviews/shoes/shoe-1.svg')).toMatch(
      /\/CatalogPreviews\/shoes\/shoe-1\.svg$/,
    )
    expect(resolveCatalogPreviewMediaSrc('data:image/svg+xml,test')).toBe(
      'data:image/svg+xml,test',
    )
  })

  it('resolves repo-backed reference items into local interactive preview viewport sources', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'shoes',
      sectionKey: 'shoes',
      tags: ['shoe', 'reference'],
      description: 'Baseline repo-backed shoe reference for Catalog browse.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'ReferenceModels/shoes/Shoe_1.glb',
      },
      previewMedia: [],
    }

    expect(resolveCatalogRepoReferencePreviewSource(item)).toEqual({
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
    })
  })
})
