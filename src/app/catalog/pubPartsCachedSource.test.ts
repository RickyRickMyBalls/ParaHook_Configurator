import { describe, expect, it } from 'vitest'
import { createCatalogSourceSnapshot } from './catalogSource'
import {
  PUB_PARTS_FULL_PARTS_SOURCE_SET,
  PUB_PARTS_GT_PARTS_SOURCE_SET,
  readCachedPubPartsDedupedPartSourceItems,
  readCachedPubPartsAllPartSourceItems,
  readCachedPubPartsFullPartSourceItems,
  readCachedPubPartsGtPartSourceItems,
  readCachedPubPartsResourceSourceItems,
} from './pubPartsCachedSource'

describe('pubPartsCachedSource', () => {
  it('reads the full cached parts endpoint through normalized PubParts source items', () => {
    const fullPartItems = readCachedPubPartsFullPartSourceItems()

    expect(fullPartItems).toHaveLength(319)
    expect(fullPartItems.every((item) => item.sourceRecordKind === 'part')).toBe(true)
    expect(fullPartItems.every((item) => item.previewImageUrl !== undefined)).toBe(true)
    expect(fullPartItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceTitle: 'Warzon3: Floatwheel Footpad PCB',
          previewImageUrl: 'https://pubparts.xyz/images/parts/floatwheel/floatwheel-footpad-pcb.png',
          sourceMetadata: expect.objectContaining({
            sourceSetId: 'parts/full',
            sourceSetLabel: 'All Parts Full Cache',
          }),
        }),
        expect.objectContaining({
          providerId: 'pubparts',
          providerName: 'PubParts',
          sourceRecordKind: 'part',
          sourceTitle: 'Celeste: Stock Controller Box Gasket',
          sourceCollectionKey: 'Gasket, Controller Box',
          sourceCollectionLabel: 'GT/GT-S',
          sourceUrl: 'https://www.printables.com/model/919483',
          externalItemUrl: 'https://www.printables.com/model/919483',
          previewImageUrl:
            'https://media.printables.com/media/prints/919483/images/7018416_1b0e6aed-f664-435b-a98c-965818ff9e01_af6fb348-20d1-4f38-85d3-a96b1c6f4743/thumbs/inside/1280x960/jpeg/img_0609.webp',
          linkedArchiveUrl:
            'https://www.dropbox.com/scl/fi/6n3fasa6g0oam9srgi4qh/onewheel-gt-controller-box-gasket-model_files.zip?rlkey=sns2p0a6n5qdxkruqfo4jgzmm&st=xb6yjzx4&dl=0',
          sourceLastUpdated: '2026-04-20',
          archiveLastUpdated: '2024-08-28',
          sourceMetadata: expect.objectContaining({
            fabricationMethod: '3d Printed',
            typeOfPart: 'Gasket, Controller Box',
            platform: 'GT/GT-S',
            sourceSetId: 'parts/full',
            sourceSetLabel: 'All Parts Full Cache',
            sourceSetUrl: 'https://pubparts.xyz/parts.json',
            sourceSetCachedAt: '2026-04-20',
          }),
        }),
      ]),
    )
  })

  it('keeps filtered endpoint records from duplicating full parts while preserving attribution', () => {
    const dedupedItems = readCachedPubPartsDedupedPartSourceItems([
      PUB_PARTS_FULL_PARTS_SOURCE_SET,
      PUB_PARTS_GT_PARTS_SOURCE_SET,
    ])
    const celesteItems = dedupedItems.filter(
      (item) => item.sourceTitle === 'Celeste: Stock Controller Box Gasket',
    )

    expect(dedupedItems).toHaveLength(319)
    expect(celesteItems).toHaveLength(1)
    expect(celesteItems[0]).toEqual(
      expect.objectContaining({
        sourceMetadata: expect.objectContaining({
          sourceSetId: 'parts/full',
          sourceSetLabel: 'All Parts Full Cache',
          sourceSetUrl: 'https://pubparts.xyz/parts.json',
          sourceSetIds: 'parts/full, parts/gt',
          sourceSetLabels: 'All Parts Full Cache, GT Parts',
          sourceSetUrls: 'https://pubparts.xyz/parts.json, https://pubparts.xyz/parts/gt.json',
          sourceSetCachedAts: '2026-04-20',
        }),
      }),
    )
  })

  it('reads tiny all-parts cached source records through normalized PubParts source items', () => {
    expect(readCachedPubPartsAllPartSourceItems()).toEqual([
      expect.objectContaining({
        providerId: 'pubparts',
        providerName: 'PubParts',
        sourceRecordKind: 'part',
        sourceTitle: '3d Printed Gripples',
        sourceCollectionKey: 'Footpad Attachment',
        sourceCollectionLabel: 'Miscellaneous Items',
        sourceUrl: 'https://www.printables.com/model/598759',
        externalItemUrl: 'https://www.printables.com/model/598759',
        previewImageUrl:
          'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
        linkedArchiveUrl:
          'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
        sourceLastUpdated: '2026-04-20',
        archiveLastUpdated: '2024-11-16',
        sourceMetadata: expect.objectContaining({
          fabricationMethod: '3d Printed',
          typeOfPart: 'Footpad Attachment',
          platform: 'Miscellaneous Items',
          sourceSetId: 'parts',
          sourceSetLabel: 'All Parts',
          sourceSetUrl: 'https://pubparts.xyz/parts.json',
          sourceSetCachedAt: '2026-04-20',
        }),
      }),
    ])
  })

  it('reads filtered-platform cached part records while preserving array metadata', () => {
    expect(readCachedPubPartsGtPartSourceItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceRecordKind: 'part',
          sourceTitle: 'Celeste: Stock Controller Box Gasket',
          sourceCollectionKey: 'Gasket, Controller Box',
          sourceCollectionLabel: 'GT/GT-S',
          sourceUrl: 'https://www.printables.com/model/919483',
          previewImageUrl:
            'https://media.printables.com/media/prints/919483/images/7018416_1b0e6aed-f664-435b-a98c-965818ff9e01_af6fb348-20d1-4f38-85d3-a96b1c6f4743/thumbs/inside/1280x960/jpeg/img_0609.webp',
          linkedArchiveUrl:
            'https://www.dropbox.com/scl/fi/6n3fasa6g0oam9srgi4qh/onewheel-gt-controller-box-gasket-model_files.zip?rlkey=sns2p0a6n5qdxkruqfo4jgzmm&st=xb6yjzx4&dl=0',
          sourceLastUpdated: '2026-04-20',
          archiveLastUpdated: '2024-08-28',
          sourceMetadata: expect.objectContaining({
            fabricationMethod: '3d Printed',
            typeOfPart: 'Gasket, Controller Box',
            platform: 'GT/GT-S',
            sourceSetId: 'parts/gt',
            sourceSetLabel: 'GT Parts',
            sourceSetUrl: 'https://pubparts.xyz/parts/gt.json',
          }),
        }),
      ]),
    )
  })

  it('keeps real multi-platform filtered source metadata without inventing links', () => {
    expect(readCachedPubPartsGtPartSourceItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceTitle: 'FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs',
          sourceCollectionKey: 'Rim Saver',
          sourceCollectionLabel: 'Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel',
          sourceUrl: 'https://www.printables.com/model/1207270',
          externalItemUrl: 'https://www.printables.com/model/1207270',
          previewImageUrl:
            'https://media.printables.com/media/prints/1207270/images/9067137_6e3cb25e-35e8-4ad5-8acd-cf325702863d_8bc31f64-1368-4943-9aa0-f7861103cae6/thumbs/inside/1280x960/jpg/1000003801.webp',
          linkedArchiveUrl:
            'https://www.dropbox.com/scl/fi/vbl66ojz68jrhmoq9iuib/floatnlc-rimmy-one-wheel-rim-protection-for-6-and-65-hubs-model_files-1.zip?rlkey=41s5zalhowpc65gcg7aakynca&st=jh4569t8&dl=0',
          archiveLastUpdated: '2025-03-24',
          sourceMetadata: expect.objectContaining({
            fabricationMethod: '3d Printed',
            typeOfPart: 'Rim Saver',
            platform: 'Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel',
          }),
        }),
      ]),
    )
  })

  it('reads cached resources while preserving array-shaped resource metadata', () => {
    expect(readCachedPubPartsResourceSourceItems()).toEqual([
      expect.objectContaining({
        providerId: 'pubparts',
        providerName: 'PubParts',
        sourceRecordKind: 'resource',
        sourceTitle: 'ADV 3d Printed List',
        sourceCollectionKey: 'Spreadsheet',
        sourceCollectionLabel: 'Spreadsheet',
        sourceUrl:
          'https://docs.google.com/spreadsheets/d/1mq-P3KeisLS-J33Qv6TXYyChz70qhU_axgL4iG-yIJk/edit',
        externalItemUrl:
          'https://docs.google.com/spreadsheets/d/1mq-P3KeisLS-J33Qv6TXYyChz70qhU_axgL4iG-yIJk/edit',
        sourceLastUpdated: '2026-04-20',
        sourceMetadata: expect.objectContaining({
          typeOfResource: 'Spreadsheet',
          appStoreLink: '',
          playStoreLink: '',
          description: '3d parts and accessories for the Floatwheel ADV platform',
          sourceSetId: 'resources',
          sourceSetLabel: 'Resources',
          sourceSetUrl: 'https://pubparts.xyz/resources.json',
        }),
      }),
    ])
  })

  it('does not create live Catalog snapshot, UI, or action behavior during cached intake', () => {
    const sourceItems = [
      ...readCachedPubPartsAllPartSourceItems(),
      ...readCachedPubPartsFullPartSourceItems(),
      ...readCachedPubPartsGtPartSourceItems(),
      ...readCachedPubPartsResourceSourceItems(),
    ]
    const snapshot = createCatalogSourceSnapshot({
      importedReferencesById: {},
      importedReferenceOrder: [],
    })

    expect(sourceItems.length).toBeGreaterThan(0)
    expect(sourceItems.every((item) => !('actionKind' in item))).toBe(true)
    expect(sourceItems.every((item) => !('source' in item))).toBe(true)
    expect(sourceItems.every((item) => !('assetPath' in item))).toBe(true)
    expect(snapshot.externalItems).toEqual([])
  })
})
