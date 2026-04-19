import { describe, expect, it } from 'vitest'
import {
  getCatalogItemPrimaryPreviewMedia,
  isCatalogItemActionKind,
  isCatalogItemAssetKind,
  isCatalogItemImportsEntry,
  isCatalogItemSourceKind,
  resolveCatalogRepoReferencePreviewSource,
  resolveCatalogRepoEnvironmentSource,
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
      systemKey: 'Platform',
      platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
      partType: 'Shoe',
      position: 'Pair',
      productName: 'Shoe 1',
      brand: 'ParaHook',
      partGroups: ['Shoes'],
      description: 'Baseline repo-backed shoe reference for Catalog browse.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_1.glb',
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
    expect(item.systemKey).toBe('Platform')
    expect(item.platformCompatibility).toEqual(['ADV', 'XR', 'GT', 'Pint', 'XR Classic'])
    expect(item.partType).toBe('Shoe')
    expect(item.position).toBe('Pair')
    expect(item.productName).toBe('Shoe 1')
    expect(item.brand).toBe('ParaHook')
    expect(item.partGroups).toEqual(['Shoes'])
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
        assetPath: 'Catalog/shoes/Shoe_1.glb',
      },
      previewMedia: [],
    }

    expect(resolveCatalogRepoReferencePreviewSource(item)).toEqual({
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
    })
  })

  it('resolves repo-backed HDRI and EXR items into environment source paths', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:docklands-02-2k-hdr',
      label: 'Docklands 02 2K',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri', 'hdr'],
      description: 'Repo-backed HDRI for Catalog browse.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'HDRI/docklands_02_2k.hdr',
      },
      previewMedia: [],
    }

    expect(resolveCatalogRepoEnvironmentSource(item)).toEqual({
      fileType: 'hdr',
      label: 'Docklands 02 2K',
      objectUrl: expect.stringMatching(/\/HDRI\/docklands_02_2k\.hdr$/),
    })
  })
})
