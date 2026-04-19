import { describe, expect, it } from 'vitest'
import {
  createCatalogImportsSourceSnapshotFromReferenceWorkspace,
  createCatalogSourceSnapshot,
  getCatalogRepoItems,
  selectCatalogItemsForSection,
} from './catalogSource'

describe('catalogSource', () => {
  it('exposes authored repo-backed catalog entries through one catalog-owned source seam', () => {
    const repoItems = getCatalogRepoItems()

    expect(repoItems.length).toBeGreaterThan(0)
    expect(repoItems.filter((item) => item.assetKind === 'reference-asset')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          systemKey: 'Platform',
          platformCompatibility: expect.arrayContaining(['ADV', 'XR', 'GT', 'Pint', 'XR Classic']),
          partGroups: expect.any(Array),
        }),
      ]),
    )
    expect(repoItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemId: 'reference:footpad-pubpad-full-assembly',
          familyKey: 'footpads',
          sectionKey: 'footpads',
          assetKind: 'reference-asset',
          actionKind: 'add-to-project',
          systemKey: 'Platform',
          partType: 'Footpad',
          position: 'Pair',
          partGroups: ['Footpads'],
          source: expect.objectContaining({
            sourceKind: 'repo',
          }),
        }),
        expect.objectContaining({
          itemId: 'reference:shoe-1',
          familyKey: 'shoes',
          sectionKey: 'shoes',
          assetKind: 'reference-asset',
          actionKind: 'add-to-project',
          systemKey: 'Platform',
          partType: 'Shoe',
          productName: 'Shoe 1',
          brand: 'ParaHook',
          partGroups: ['Shoes'],
          source: expect.objectContaining({
            sourceKind: 'repo',
          }),
        }),
        expect.objectContaining({
          itemId: 'reference:hook-large',
          label: 'Large Foothook',
          familyKey: 'foothooks',
          sectionKey: 'foothooks',
          assetKind: 'reference-asset',
          actionKind: 'add-to-project',
          systemKey: 'Platform',
          partType: 'FootHold',
          position: 'Universal',
          partGroups: ['FootHolds'],
          source: expect.objectContaining({
            sourceKind: 'repo',
          }),
        }),
      ]),
    )
  })

  it('keeps the first curated reference families explicit instead of flattening them back into generic references', () => {
    const repoItems = getCatalogRepoItems().filter((item) => item.assetKind === 'reference-asset')

    expect(repoItems.map((item) => item.familyKey)).toEqual(
      expect.arrayContaining(['foothooks', 'shoes', 'footpads']),
    )
    expect(repoItems.every((item) => item.familyKey !== 'references')).toBe(true)
    expect(repoItems.find((item) => item.itemId === 'reference:hook-large')).toEqual(
      expect.objectContaining({
        familyKey: 'foothooks',
        sectionKey: 'foothooks',
        systemKey: 'Platform',
        partType: 'FootHold',
      }),
    )
  })

  it('surfaces every current repo HDRI and EXR as an environment catalog item', () => {
    const hdriItems = getCatalogRepoItems().filter((item) => item.sectionKey === 'hdris')

    expect(hdriItems.map((item) => item.source.assetPath).sort()).toEqual([
      'HDRI/citrus_orchard_road_puresky_2k.exr',
      'HDRI/docklands_02_2k.hdr',
      'HDRI/rogland_clear_night_2k.hdr',
      'HDRI/studio_small_09_2k.exr',
      'HDRI/studio_small_09_2k.hdr',
    ])
    expect(hdriItems.every((item) => item.assetKind === 'environment')).toBe(true)
    expect(hdriItems.every((item) => item.actionKind === 'apply-environment')).toBe(true)
    expect(hdriItems.every((item) => item.previewMedia.length > 0)).toBe(true)
  })

  it('surfaces imports-area reuse entries through the same source seam without hiding apply behavior in the read', () => {
    const snapshot = createCatalogSourceSnapshot({
      importedReferencesById: {
        'imported-reference-1': {
          referenceId: 'imported-reference-1',
          categoryId: 'user-references',
          label: 'Imported Reference 1',
          assetPath: 'blob:imported-reference-1',
          catalogItemId: null,
        },
      },
      importedReferenceOrder: ['imported-reference-1'],
    })

    expect(snapshot.importsItems).toEqual([
      expect.objectContaining({
        itemId: 'imports:imported-reference-1',
        familyKey: 'imports',
        sectionKey: 'user-references',
        actionKind: 'load-preview',
        source: expect.objectContaining({
          sourceKind: 'imports',
          importId: 'imported-reference-1',
        }),
      }),
    ])
    expect(selectCatalogItemsForSection(snapshot, 'user-references')).toEqual(snapshot.importsItems)
    expect(
      snapshot.allItems.every((item) => typeof (item as Record<string, unknown>).source === 'object'),
    ).toBe(true)
  })

  it('filters the imports snapshot to true imported references so Catalog reuse does not become the import pipeline owner', () => {
    const importsSnapshot = createCatalogImportsSourceSnapshotFromReferenceWorkspace({
      importedReferencesById: {
        'manifest-reference-1': {
          referenceId: 'manifest-reference-1',
          sourceKind: 'manifest',
          categoryId: 'shoes',
          label: 'Manifest Shoe',
          assetPath: '/Catalog/shoes/Shoe_1.glb',
        },
        'imported-reference-1': {
          referenceId: 'imported-reference-1',
          sourceKind: 'imported',
          categoryId: 'user-references',
          label: 'Imported Reference 1',
          assetPath: 'blob:imported-reference-1',
        },
      },
      importedReferenceOrder: ['manifest-reference-1', 'imported-reference-1'],
    })

    expect(importsSnapshot).toEqual({
      importedReferencesById: {
        'imported-reference-1': {
          referenceId: 'imported-reference-1',
          categoryId: 'user-references',
          label: 'Imported Reference 1',
          assetPath: 'blob:imported-reference-1',
          catalogItemId: null,
        },
      },
      importedReferenceOrder: ['imported-reference-1'],
    })

    const snapshot = createCatalogSourceSnapshot(importsSnapshot)
    expect(snapshot.importsItems).toEqual([
      expect.objectContaining({
        itemId: 'imports:imported-reference-1',
        actionKind: 'load-preview',
        source: expect.objectContaining({
          sourceKind: 'imports',
          importId: 'imported-reference-1',
        }),
      }),
    ])
  })
})
