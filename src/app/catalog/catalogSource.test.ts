import { describe, expect, it } from 'vitest'
import {
  buildCatalogExternalTypeClassification,
  buildCatalogExternalPlatformFitmentMetadataRows,
  createCatalogImportsSourceSnapshotFromReferenceWorkspace,
  createCatalogSourceSnapshot,
  getCatalogPlannedStartingAssemblyItems,
  getCatalogRepoItems,
  normalizeCatalogExternalPlatformCompatibility,
  selectCatalogItemsForSection,
} from './catalogSource'
import { resolveCatalogActionPlan } from './catalogActionPlan'
import {
  readCachedPubPartsFullPartSourceItems,
  readCachedPubPartsResourceSourceItems,
} from './pubPartsCachedSource'
import { resolveCatalogRepoReferencePreviewSource } from './catalogItemContract'
import type { PubPartsNormalizedSourceItem } from './pubPartsSource'

describe('catalogSource', () => {
  const gtSourceFitmentMetadataRow = {
    label: 'Source Fitment Note',
    value: 'GT-S source label preserved; canonical platform family remains GT',
  }
  const buildPubPartsSourceItem = (
    overrides: Partial<PubPartsNormalizedSourceItem> = {},
  ): PubPartsNormalizedSourceItem => ({
    providerId: 'pubparts',
    providerName: 'PubParts',
    sourceRecordKind: 'part',
    sourceTitle: 'Live Source Stable Footpad',
    sourceCollectionKey: 'Footpad Attachment',
    sourceCollectionLabel: 'Floatwheel',
    sourceUrl: 'https://pubparts.xyz/parts/live-source-stable-footpad',
    externalItemUrl: 'https://pubparts.xyz/parts/live-source-stable-footpad',
    previewImageUrl: 'https://pubparts.xyz/images/live-source-stable-footpad.png',
    linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/live/source-stable-footpad.zip?dl=0',
    sourceLastUpdated: '2026-04-21T19:45:00.000Z',
    archiveLastUpdated: '2026-04-21',
    sourceMetadata: {
      fabricationMethod: '3d Printed',
      typeOfPart: 'Footpad Attachment',
      platform: 'Floatwheel',
    },
    ...overrides,
  })

  it('normalizes external PubParts platform source labels into canonical Catalog platform families', () => {
    expect(normalizeCatalogExternalPlatformCompatibility('Floatwheel')).toEqual(['ADV'])
    expect(normalizeCatalogExternalPlatformCompatibility('GT/GT-S')).toEqual(['GT'])
    expect(normalizeCatalogExternalPlatformCompatibility('Pint/X/S')).toEqual(['Pint'])
    expect(normalizeCatalogExternalPlatformCompatibility('XR Classic')).toEqual(['XR Classic'])
    expect(normalizeCatalogExternalPlatformCompatibility('XR/Funwheel')).toEqual(['XR'])
    expect(normalizeCatalogExternalPlatformCompatibility('Miscellaneous Items')).toEqual(['Other'])
    expect(normalizeCatalogExternalPlatformCompatibility('Custom Platform')).toEqual(['Other'])
    expect(normalizeCatalogExternalPlatformCompatibility('')).toEqual([])
    expect(normalizeCatalogExternalPlatformCompatibility('   ')).toEqual([])
    expect(normalizeCatalogExternalPlatformCompatibility(null)).toEqual([])
    expect(normalizeCatalogExternalPlatformCompatibility(undefined)).toEqual([])
  })

  it('normalizes array and comma-joined external platform labels without duplicate canonical families', () => {
    expect(
      normalizeCatalogExternalPlatformCompatibility([
        ' Floatwheel ',
        'GT/GT-S',
        'Pint/X/S',
        'XR Classic',
        'XR/Funwheel',
      ]),
    ).toEqual(['ADV', 'GT', 'Pint', 'XR Classic', 'XR'])
    expect(
      normalizeCatalogExternalPlatformCompatibility(
        'Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel',
      ),
    ).toEqual(['ADV', 'GT', 'Pint', 'XR Classic', 'XR'])
    expect(normalizeCatalogExternalPlatformCompatibility('GT/GT-S, GT/GT-S, Unknown')).toEqual([
      'GT',
      'Other',
    ])
    expect(normalizeCatalogExternalPlatformCompatibility(['Unknown', 'Miscellaneous Items'])).toEqual([
      'Other',
    ])
  })

  it('builds narrow external platform fitment metadata rows for GT-S source labels only', () => {
    expect(buildCatalogExternalPlatformFitmentMetadataRows('GT/GT-S')).toEqual([
      gtSourceFitmentMetadataRow,
    ])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('GT-S')).toEqual([
      gtSourceFitmentMetadataRow,
    ])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('GTS')).toEqual([
      gtSourceFitmentMetadataRow,
    ])
    expect(
      buildCatalogExternalPlatformFitmentMetadataRows('GT/GT-S, GT-S, GTS'),
    ).toEqual([gtSourceFitmentMetadataRow])
    expect(
      buildCatalogExternalPlatformFitmentMetadataRows(['Floatwheel', 'gt-s', 'GTS']),
    ).toEqual([gtSourceFitmentMetadataRow])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('Floatwheel')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('Pint/X/S')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('XR/Funwheel')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('XR Classic')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('Miscellaneous Items')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('Custom Platform')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows('   ')).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows(null)).toEqual([])
    expect(buildCatalogExternalPlatformFitmentMetadataRows(undefined)).toEqual([])
  })

  it('classifies safe external PubParts type labels into existing Catalog system fields', () => {
    expect(buildCatalogExternalTypeClassification('Footpad Attachment')).toEqual({
      systemKey: 'Platform',
      partType: 'Footpad Attachment',
      partGroups: ['Footpads'],
    })
    expect(buildCatalogExternalTypeClassification(['Gasket', 'Controller Box'])).toEqual({
      systemKey: 'Platform',
      partType: 'Controller Box',
      partGroups: ['Boxes', 'Controllers', 'Screw & Nuts'],
    })
    expect(buildCatalogExternalTypeClassification('Gasket, Controller Box')).toEqual({
      systemKey: 'Platform',
      partType: 'Controller Box',
      partGroups: ['Boxes', 'Controllers', 'Screw & Nuts'],
    })
    expect(buildCatalogExternalTypeClassification('Rim Saver')).toEqual({
      systemKey: 'Wheel',
      partType: 'Rim Saver',
      partGroups: ['Rim Savers', 'Guards'],
    })
    expect(buildCatalogExternalTypeClassification([' Rim Saver ', 'Rim Saver'])).toEqual({
      systemKey: 'Wheel',
      partType: 'Rim Saver',
      partGroups: ['Rim Savers', 'Guards'],
    })
    expect(buildCatalogExternalTypeClassification(['Rim Saver', 'Controller Box'])).toEqual({
      systemKey: 'Wheel',
      partType: 'Rim Saver',
      partGroups: ['Rim Savers', 'Guards', 'Boxes', 'Controllers'],
    })
    expect(buildCatalogExternalTypeClassification(['Tire', 'Fender', 'Rails'])).toEqual({
      systemKey: 'Platform',
      partType: 'Rails',
      partGroups: ['Rails', 'Tires', 'Fenders'],
    })
    expect(buildCatalogExternalTypeClassification(['Battery Box', 'Axle Block'])).toEqual({
      systemKey: 'Platform',
      partType: 'Battery Box',
      partGroups: ['Battery Boxes', 'Axle Blocks'],
    })
    expect(buildCatalogExternalTypeClassification('Unknown Type')).toEqual({})
    expect(buildCatalogExternalTypeClassification('')).toEqual({})
    expect(buildCatalogExternalTypeClassification('   ')).toEqual({})
    expect(buildCatalogExternalTypeClassification(null)).toEqual({})
    expect(buildCatalogExternalTypeClassification(undefined)).toEqual({})
  })

  it('keeps live PubParts projection ParaHook-owned and item ids source-stable', () => {
    const targetSourceItem = buildPubPartsSourceItem()
    const insertedSourceItem = buildPubPartsSourceItem({
      sourceTitle: 'New Zinc Source Addition',
      sourceCollectionKey: 'Mystery PubParts Type',
      sourceCollectionLabel: 'Future Board',
      sourceUrl: 'https://pubparts.xyz/parts/new-zinc-source-addition',
      externalItemUrl: 'https://pubparts.xyz/parts/new-zinc-source-addition',
      linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/live/new-source-addition.zip?dl=0',
      sourceMetadata: {
        fabricationMethod: '3d Printed',
        typeOfPart: 'Mystery PubParts Type',
        platform: 'Future Board',
      },
    })
    const renamedTargetSourceItem = buildPubPartsSourceItem({
      sourceTitle: 'Renamed Live Source Stable Footpad',
    })
    const targetItemId = 'external:pubparts:part:https-pubparts-xyz-parts-live-source-stable-footpad'

    const initialSnapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: [targetSourceItem],
    })
    const updatedSnapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: [insertedSourceItem, renamedTargetSourceItem],
    })
    const initialTargetItem = initialSnapshot.externalItems.find(
      (item) => item.source.sourceKind === 'external' && item.source.sourceUrl === targetSourceItem.sourceUrl,
    )
    const updatedTargetItem = updatedSnapshot.externalItems.find(
      (item) => item.source.sourceKind === 'external' && item.source.sourceUrl === targetSourceItem.sourceUrl,
    )
    const insertedItem = updatedSnapshot.externalItems.find(
      (item) => item.source.sourceKind === 'external' && item.source.sourceUrl === insertedSourceItem.sourceUrl,
    )

    expect(initialTargetItem).toEqual(
      expect.objectContaining({
        itemId: targetItemId,
        label: 'Live Source Stable Footpad',
        platformCompatibility: ['ADV'],
        systemKey: 'Platform',
        partType: 'Footpad Attachment',
        partGroups: ['Footpads'],
      }),
    )
    expect(updatedTargetItem).toEqual(
      expect.objectContaining({
        itemId: targetItemId,
        label: 'Renamed Live Source Stable Footpad',
        platformCompatibility: ['ADV'],
        systemKey: 'Platform',
        partType: 'Footpad Attachment',
        partGroups: ['Footpads'],
      }),
    )
    expect(insertedItem).toEqual(
      expect.objectContaining({
        itemId: 'external:pubparts:part:https-pubparts-xyz-parts-new-zinc-source-addition',
        label: 'New Zinc Source Addition',
        platformCompatibility: ['Other'],
      }),
    )
    expect(insertedItem?.systemKey).toBeUndefined()
    expect(insertedItem?.partType).toBeUndefined()
    expect(insertedItem?.partGroups).toBeUndefined()
    expect(insertedItem?.metadata).toEqual(
      expect.arrayContaining([
        { label: 'Part Type', value: 'Mystery PubParts Type' },
        { label: 'Platform', value: 'Future Board' },
      ]),
    )
  })

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

  it('keeps wheel fitment optional until honest repo-backed motor or tire records exist', () => {
    const snapshot = createCatalogSourceSnapshot()

    expect(snapshot.repoItems.filter((item) => item.wheelFitment !== undefined)).toEqual([])
    expect(snapshot.importsItems.filter((item) => item.wheelFitment !== undefined)).toEqual([])
    expect(snapshot.plannedItems.filter((item) => item.wheelFitment !== undefined)).toEqual([])
    expect(snapshot.externalItems).toEqual([])
  })

  it('surfaces verified heavy STEP starting assemblies as planned source truth with add-to-project enabled', () => {
    const snapshot = createCatalogSourceSnapshot()
    const plannedAdvItem = snapshot.plannedItems.find(
      (item) => item.itemId === 'starting-assembly:adv-full-assembly-planned',
    )
    const plannedXrItem = snapshot.plannedItems.find(
      (item) => item.itemId === 'starting-assembly:xr-pubwheel-1-planned',
    )
    const plannedXrItems = snapshot.plannedItems.filter(
      (item) => item.itemId === 'starting-assembly:xr-pubwheel-1-planned',
    )

    expect(snapshot.repoItems.filter((item) => item.itemRole === 'starting-assembly')).toEqual([])
    expect(snapshot.repoItems.filter((item) => item.startingAssembly !== undefined)).toEqual([])
    expect(snapshot.importsItems.filter((item) => item.itemRole === 'starting-assembly')).toEqual([])
    expect(snapshot.importsItems.filter((item) => item.startingAssembly !== undefined)).toEqual([])
    expect(snapshot.plannedItems).toHaveLength(2)
    expect(plannedAdvItem).toEqual(
      expect.objectContaining({
        label: 'ADV Full Assembly',
        familyKey: 'starting-assemblies',
        sectionKey: 'starting-assemblies',
        platformCompatibility: ['ADV'],
        actionKind: 'load-preview',
        itemRole: 'starting-assembly',
        startingAssembly: {
          status: 'planned',
          platformFamily: 'ADV',
          sourceAssetPreference: 'step-or-stp',
        },
      }),
    )
    expect(plannedAdvItem?.source).toEqual({
      sourceKind: 'planned',
      sourceLabel: 'Verified ADV STEP source candidate',
      sourceAssetPath: 'Catalog/boards/adv/ADV_Full Assembly_parts.step',
      sourceAssetFormat: 'step-or-stp',
      sourceFileSizeBytes: 55825705,
      sourceStatus: 'known-heavy-source',
    })
    expect(
      plannedAdvItem?.source.sourceKind === 'planned'
        ? plannedAdvItem.source.sourceAssetSet
        : undefined,
    ).toBeUndefined()
    expect(plannedAdvItem?.source).not.toHaveProperty('assetPath')
    expect(resolveCatalogRepoReferencePreviewSource(plannedAdvItem!)).toBeNull()
    expect(resolveCatalogActionPlan(plannedAdvItem!).allowsTemporaryPreview).toBe(false)
    expect(resolveCatalogActionPlan(plannedAdvItem!).primaryAction.actionKind).toBe('add-to-project')
    expect(resolveCatalogActionPlan(plannedAdvItem!).primaryAction.availability).toBe('available')
    expect(resolveCatalogActionPlan(plannedAdvItem!).secondaryAction).toEqual(
      expect.objectContaining({
        actionKind: 'load-preview',
        availability: 'planned',
      }),
    )
    expect(plannedXrItem).toEqual(
      expect.objectContaining({
        label: 'XR PubWheel Assembly 1',
        familyKey: 'starting-assemblies',
        sectionKey: 'starting-assemblies',
        platformCompatibility: ['XR'],
        actionKind: 'load-preview',
        itemRole: 'starting-assembly',
        startingAssembly: {
          status: 'planned',
          platformFamily: 'XR',
          sourceAssetPreference: 'step-or-stp',
        },
      }),
    )
    expect(plannedXrItem?.source).toEqual({
      sourceKind: 'planned',
      sourceLabel: 'Verified XR STEP source candidate',
      sourceAssetPath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step',
      sourceAssetFormat: 'step-or-stp',
      sourceFileSizeBytes: 73126597,
      sourceStatus: 'known-heavy-source',
      sourceAssetSet: {
        sourceId: 'pubwheel_1',
        currentVersionId: 'v1',
        versions: [
          {
            versionId: 'v1',
            versionLabel: 'Version 1',
            status: 'current',
            variants: [
              {
                variantId: 'pubwheel_1:v1:step-source',
                role: 'preferred-source',
                format: 'step',
                sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step',
                fileSizeBytes: 73126597,
              },
              {
                variantId: 'pubwheel_1:v1:glb-companion',
                role: 'companion-mesh',
                format: 'glb',
                sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb',
                fileSizeBytes: 79230220,
              },
            ],
          },
        ],
      },
    })
    expect(plannedXrItems).toHaveLength(1)
    expect(
      plannedXrItem?.source.sourceKind === 'planned'
        ? plannedXrItem.source.sourceAssetSet
        : undefined,
    ).toEqual(
      expect.objectContaining({
        sourceId: 'pubwheel_1',
        currentVersionId: 'v1',
      }),
    )
    expect(plannedXrItem?.metadata).toEqual(
      expect.arrayContaining([
        { label: 'Companion Mesh Path', value: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb' },
      ]),
    )
    expect(plannedXrItem?.source).not.toHaveProperty('assetPath')
    expect(resolveCatalogRepoReferencePreviewSource(plannedXrItem!)).toBeNull()
    expect(resolveCatalogActionPlan(plannedXrItem!).allowsTemporaryPreview).toBe(false)
    expect(resolveCatalogActionPlan(plannedXrItem!).primaryAction.actionKind).toBe('add-to-project')
    expect(resolveCatalogActionPlan(plannedXrItem!).primaryAction.availability).toBe('available')
    expect(resolveCatalogActionPlan(plannedXrItem!).secondaryAction).toEqual(
      expect.objectContaining({
        actionKind: 'load-preview',
        availability: 'planned',
      }),
    )
    expect(snapshot.externalItems).toEqual([])
  })

  it('keeps planned starting assembly source separate from repo items and placeholder platforms', () => {
    const plannedItems = getCatalogPlannedStartingAssemblyItems()
    const snapshot = createCatalogSourceSnapshot()

    expect(plannedItems).toHaveLength(2)
    expect(snapshot.repoItems.every((item) => item.source.sourceKind === 'repo')).toBe(true)
    expect(snapshot.plannedItems.every((item) => item.source.sourceKind === 'planned')).toBe(true)
    expect(snapshot.allItems).toEqual([
      ...snapshot.repoItems,
      ...snapshot.importsItems,
      ...snapshot.plannedItems,
      ...snapshot.externalItems,
    ])
    expect(snapshot.plannedItems.map((item) => item.startingAssembly?.platformFamily)).toEqual([
      'ADV',
      'XR',
    ])
    const plannedPlatformFamilies = snapshot.plannedItems.map(
      (item) => item.startingAssembly?.platformFamily,
    )
    expect(plannedPlatformFamilies).not.toContain('GT')
    expect(plannedPlatformFamilies).not.toContain('Pint')
    expect(plannedPlatformFamilies).not.toContain('XR Classic')
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
    expect(snapshot.externalItems).toEqual([])
  })

  it('keeps default snapshots repo and imports only until external input is explicitly composed', () => {
    const snapshot = createCatalogSourceSnapshot()

    expect(snapshot.externalItems).toEqual([])
    expect(snapshot.allItems).toEqual([
      ...snapshot.repoItems,
      ...snapshot.importsItems,
      ...snapshot.plannedItems,
    ])
    expect(
      snapshot.allItems.every((item) =>
        ['repo', 'imports', 'planned'].includes(item.source.sourceKind),
      ),
    ).toBe(true)
  })

  it('composes explicit cached PubParts source input into a distinct external snapshot lane', () => {
    const sourceItems = [
      ...readCachedPubPartsFullPartSourceItems(),
      ...readCachedPubPartsResourceSourceItems(),
    ]
    const snapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: sourceItems,
    })
    const externalPartItems = snapshot.externalItems.filter(
      (item) => item.sectionKey === 'external-pubparts-parts',
    )
    const externalResourceItems = snapshot.externalItems.filter(
      (item) => item.sectionKey === 'external-pubparts-resources',
    )

    expect(snapshot.externalItems).toHaveLength(sourceItems.length)
    expect(externalPartItems).toHaveLength(319)
    expect(externalResourceItems).toHaveLength(readCachedPubPartsResourceSourceItems().length)
    expect(snapshot.allItems).toEqual([
      ...snapshot.repoItems,
      ...snapshot.importsItems,
      ...snapshot.plannedItems,
      ...snapshot.externalItems,
    ])
    expect(snapshot.repoItems.every((item) => item.source.sourceKind === 'repo')).toBe(true)
    expect(snapshot.importsItems.every((item) => item.source.sourceKind === 'imports')).toBe(true)
    expect(snapshot.externalItems.every((item) => item.source.sourceKind === 'external')).toBe(true)
    expect(snapshot.externalItems.every((item) => item.itemRole !== 'starting-assembly')).toBe(true)
    expect(snapshot.externalItems.every((item) => item.startingAssembly === undefined)).toBe(true)
    expect(snapshot.externalItems.every((item) => !('assetPath' in item.source))).toBe(true)
    expect(
      snapshot.externalItems.every(
        (item) => resolveCatalogActionPlan(item).primaryAction.actionKind === 'load-preview',
      ),
    ).toBe(true)
    expect(
      snapshot.externalItems.every((item) => resolveCatalogActionPlan(item).secondaryAction === null),
    ).toBe(true)

    const gripplesItem = snapshot.externalItems.find(
      (item) =>
        item.label === '3d Printed Gripples' &&
        item.source.sourceKind === 'external' &&
        item.source.externalItemUrl === 'https://www.printables.com/model/598759',
    )
    expect(gripplesItem).toEqual(
      expect.objectContaining({
        familyKey: 'external-pubparts',
        sectionKey: 'external-pubparts-parts',
        assetKind: 'reference-asset',
        actionKind: 'load-preview',
        platformCompatibility: ['Other'],
        systemKey: 'Platform',
        partType: 'Footpad Attachment',
        partGroups: ['Footpads'],
      }),
    )
    expect(gripplesItem?.source).toEqual({
      sourceKind: 'external',
      provider: {
        providerId: 'pubparts',
        providerName: 'PubParts',
        sourceCollectionKey: 'Footpad Attachment',
        sourceCollectionLabel: 'Miscellaneous Items',
      },
      sourceUrl: 'https://www.printables.com/model/598759',
      externalItemUrl: 'https://www.printables.com/model/598759',
      previewImageUrl:
        'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
      linkedArchiveUrl:
        'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
      sourceLastUpdated: '2026-04-20',
      archiveLastUpdated: '2024-11-16',
    })
    expect(gripplesItem?.source).not.toHaveProperty('assetPath')
    expect(gripplesItem?.metadata).toEqual(
      expect.arrayContaining([
        { label: 'Source', value: 'PubParts' },
        { label: 'Source Set', value: 'All Parts Full Cache' },
        { label: 'Source Type', value: 'part' },
        { label: 'Fabrication Method', value: '3d Printed' },
        { label: 'Part Type', value: 'Footpad Attachment' },
        { label: 'Platform', value: 'Miscellaneous Items' },
        { label: 'Archive Updated', value: '2024-11-16' },
      ]),
    )
    expect(gripplesItem?.metadata).not.toEqual(
      expect.arrayContaining([gtSourceFitmentMetadataRow]),
    )
    expect(gripplesItem?.previewMedia).toEqual([
      {
        mediaKind: 'image',
        src: 'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
        alt: '3d Printed Gripples preview',
      },
    ])
    expect(resolveCatalogActionPlan(gripplesItem!).primaryAction.actionKind).toBe('load-preview')
    expect(resolveCatalogActionPlan(gripplesItem!).secondaryAction).toBeNull()

    const rootRelativeImageItem = snapshot.externalItems.find(
      (item) =>
        item.label === 'Warzon3: Floatwheel Footpad PCB' &&
        item.source.sourceKind === 'external',
    )
    expect(rootRelativeImageItem?.source).toEqual(
      expect.objectContaining({
        previewImageUrl:
          'https://pubparts.xyz/images/parts/floatwheel/floatwheel-footpad-pcb.png',
      }),
    )
    expect(rootRelativeImageItem?.previewMedia).toEqual([
      {
        mediaKind: 'image',
        src: 'https://pubparts.xyz/images/parts/floatwheel/floatwheel-footpad-pcb.png',
        alt: 'Warzon3: Floatwheel Footpad PCB preview',
      },
    ])
    expect(rootRelativeImageItem?.source).toEqual(
      expect.objectContaining({
        linkedArchiveUrl: expect.stringContaining('dropbox.com'),
      }),
    )
    expect(rootRelativeImageItem?.previewMedia[0]?.src).not.toContain('dropbox.com')

    const celesteItem = snapshot.externalItems.find(
      (item) =>
        item.label === 'Celeste: Stock Controller Box Gasket' &&
        item.source.sourceKind === 'external' &&
        item.source.externalItemUrl === 'https://www.printables.com/model/919483',
    )
    expect(
      snapshot.externalItems.filter(
        (item) =>
          item.label === 'Celeste: Stock Controller Box Gasket' &&
          item.source.sourceKind === 'external' &&
          item.source.externalItemUrl === 'https://www.printables.com/model/919483',
      ),
    ).toHaveLength(1)
    expect(celesteItem).toEqual(
      expect.objectContaining({
        platformCompatibility: ['GT'],
        systemKey: 'Platform',
        partType: 'Controller Box',
        partGroups: ['Boxes', 'Controllers', 'Screw & Nuts'],
      }),
    )
    expect(celesteItem?.metadata).toEqual(
      expect.arrayContaining([
        { label: 'Part Type', value: 'Gasket, Controller Box' },
        { label: 'Platform', value: 'GT/GT-S' },
        gtSourceFitmentMetadataRow,
      ]),
    )

    const floatNlcItem = snapshot.externalItems.find((item) =>
      item.label.startsWith('FloatNLC: Rimmy OneWheel Rim Protection'),
    )
    expect(floatNlcItem?.platformCompatibility).toEqual([
      'ADV',
      'GT',
      'Pint',
      'XR Classic',
      'XR',
    ])
    expect(floatNlcItem).toEqual(
      expect.objectContaining({
        systemKey: 'Wheel',
        partType: 'Rim Saver',
        partGroups: ['Rim Savers', 'Guards'],
      }),
    )
    expect(floatNlcItem?.metadata).toEqual(
      expect.arrayContaining([
        { label: 'Part Type', value: 'Rim Saver' },
        {
          label: 'Platform',
          value: 'Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel',
        },
        gtSourceFitmentMetadataRow,
      ]),
    )

    const resourceItem = snapshot.externalItems.find((item) => item.label === 'ADV 3d Printed List')
    expect(resourceItem?.platformCompatibility).toBeUndefined()
    expect(resourceItem?.systemKey).toBeUndefined()
    expect(resourceItem?.partType).toBeUndefined()
    expect(resourceItem?.partGroups).toBeUndefined()
    expect(resourceItem?.metadata).not.toEqual(
      expect.arrayContaining([gtSourceFitmentMetadataRow]),
    )
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
