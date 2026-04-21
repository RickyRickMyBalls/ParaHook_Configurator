import { describe, expect, it } from 'vitest'
import {
  normalizePubPartsPreviewImageUrl,
  normalizePubPartsPartSourceItem,
  normalizePubPartsProviderId,
  normalizePubPartsResourceSourceItem,
  readOptionalPubPartsStringList,
  readOptionalPubPartsString,
} from './pubPartsSource'

describe('pubPartsSource', () => {
  it('reads only non-empty optional source strings', () => {
    expect(readOptionalPubPartsString(' PubParts ')).toBe('PubParts')
    expect(readOptionalPubPartsString('')).toBeUndefined()
    expect(readOptionalPubPartsString('   ')).toBeUndefined()
    expect(readOptionalPubPartsString(42)).toBeUndefined()
    expect(readOptionalPubPartsString(null)).toBeUndefined()
  })

  it('preserves scalar strings and string arrays as optional source string lists', () => {
    expect(readOptionalPubPartsStringList(' XR Classic ')).toEqual(['XR Classic'])
    expect(readOptionalPubPartsStringList([' Floatwheel ', '', 'GT/GT-S', 42, 'XR/Funwheel'])).toEqual([
      'Floatwheel',
      'GT/GT-S',
      'XR/Funwheel',
    ])
    expect(readOptionalPubPartsStringList(undefined)).toEqual([])
  })

  it('normalizes unknown provider-ish values to the generic PubParts provider id', () => {
    expect(normalizePubPartsProviderId(' PubParts-Beta ')).toBe('pubparts-beta')
    expect(normalizePubPartsProviderId({ provider: 'pubparts' })).toBe('pubparts')
    expect(normalizePubPartsProviderId(undefined)).toBe('pubparts')
  })

  it('preserves optional PubParts part source metadata without requiring live Catalog items', () => {
    expect(
      normalizePubPartsPartSourceItem(
        {
          title: ' Wedge Rail ',
          fabricationMethod: '3D Print',
          typeOfPart: 'Rails',
          imageSrc: 'https://pubparts.example/wedge.png',
          platform: 'XR',
          externalUrl: 'https://pubparts.example/parts/wedge',
          dropboxUrl: 'https://dropbox.example/wedge.zip',
          dropboxZipLastUpdated: '2026-04-18',
        },
        'PubParts',
      ),
    ).toEqual({
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceRecordKind: 'part',
      sourceTitle: 'Wedge Rail',
      sourceCollectionKey: 'Rails',
      sourceCollectionLabel: 'XR',
      sourceUrl: 'https://pubparts.example/parts/wedge',
      externalItemUrl: 'https://pubparts.example/parts/wedge',
      previewImageUrl: 'https://pubparts.example/wedge.png',
      linkedArchiveUrl: 'https://dropbox.example/wedge.zip',
      archiveLastUpdated: '2026-04-18',
      sourceMetadata: {
        fabricationMethod: '3D Print',
        typeOfPart: 'Rails',
        platform: 'XR',
      },
    })
  })

  it('preserves live-like PubParts part array metadata in stable normalized source fields', () => {
    expect(
      normalizePubPartsPartSourceItem({
        title: 'GT Fender',
        fabricationMethod: ['3D Print', 'CNC'],
        typeOfPart: ['Fender', 'Body'],
        platform: ['Floatwheel', 'GT/GT-S', 'Pint/X/S', 'XR Classic', 'XR/Funwheel'],
        externalUrl: 'https://pubparts.example/parts/gt-fender',
      }),
    ).toEqual(
      expect.objectContaining({
        sourceCollectionKey: 'Fender, Body',
        sourceCollectionLabel: 'Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel',
        sourceMetadata: {
          fabricationMethod: '3D Print, CNC',
          typeOfPart: 'Fender, Body',
          platform: 'Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel',
        },
      }),
    )
  })

  it('uses the first usable PubParts image source when image metadata is an array', () => {
    expect(
      normalizePubPartsPartSourceItem({
        title: 'Array Image Part',
        imageSrc: [' https://pubparts.example/preview-a.webp ', 'https://pubparts.example/preview-b.webp'],
      }),
    ).toEqual(
      expect.objectContaining({
        previewImageUrl: 'https://pubparts.example/preview-a.webp',
      }),
    )
  })

  it('normalizes PubParts preview image URLs without rewriting raw cached source data', () => {
    expect(normalizePubPartsPreviewImageUrl(' https://example.com/preview.webp ')).toBe(
      'https://example.com/preview.webp',
    )
    expect(normalizePubPartsPreviewImageUrl('http://example.com/preview.webp')).toBe(
      'http://example.com/preview.webp',
    )
    expect(normalizePubPartsPreviewImageUrl('//cdn.example.com/preview.webp')).toBe(
      'https://cdn.example.com/preview.webp',
    )
    expect(normalizePubPartsPreviewImageUrl('/images/parts/floatwheel/preview.png')).toBe(
      'https://pubparts.xyz/images/parts/floatwheel/preview.png',
    )
    expect(
      normalizePubPartsPreviewImageUrl([
        '',
        ' /images/parts/gt/simple_gt_rails.png ',
        'https://example.com/fallback.webp',
      ]),
    ).toBe('https://pubparts.xyz/images/parts/gt/simple_gt_rails.png')
    expect(normalizePubPartsPreviewImageUrl(['', 42, null])).toBeUndefined()
    expect(normalizePubPartsPreviewImageUrl(undefined)).toBeUndefined()
  })

  it('tolerates missing optional PubParts part fields', () => {
    expect(normalizePubPartsPartSourceItem({ title: 123 }, null)).toEqual({
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceRecordKind: 'part',
      sourceTitle: 'Untitled PubParts part',
      sourceCollectionKey: undefined,
      sourceCollectionLabel: undefined,
      sourceUrl: undefined,
      externalItemUrl: undefined,
      previewImageUrl: undefined,
      linkedArchiveUrl: undefined,
      archiveLastUpdated: undefined,
      sourceMetadata: {
        fabricationMethod: '',
        typeOfPart: '',
        platform: '',
      },
    })
  })

  it('preserves PubParts resource source links as source metadata', () => {
    expect(
      normalizePubPartsResourceSourceItem({
        title: ' Install Guide ',
        typeOfResource: 'Guide',
        externalUrl: 'https://pubparts.example/resources/install-guide',
        appStoreLink: 'https://apps.example/app',
        playStoreLink: 'https://play.example/app',
        description: 'Companion setup resource',
      }),
    ).toEqual({
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceRecordKind: 'resource',
      sourceTitle: 'Install Guide',
      sourceCollectionKey: 'Guide',
      sourceCollectionLabel: 'Guide',
      sourceUrl: 'https://pubparts.example/resources/install-guide',
      externalItemUrl: 'https://pubparts.example/resources/install-guide',
      sourceMetadata: {
        typeOfResource: 'Guide',
        appStoreLink: 'https://apps.example/app',
        playStoreLink: 'https://play.example/app',
        description: 'Companion setup resource',
      },
    })
  })

  it('preserves live-like PubParts resource array metadata in stable normalized source fields', () => {
    expect(
      normalizePubPartsResourceSourceItem({
        title: 'Setup Resources',
        typeOfResource: ['Guide', 'App'],
        externalUrl: 'https://pubparts.example/resources/setup',
      }),
    ).toEqual(
      expect.objectContaining({
        sourceCollectionKey: 'Guide, App',
        sourceCollectionLabel: 'Guide, App',
        sourceMetadata: expect.objectContaining({
          typeOfResource: 'Guide, App',
        }),
      }),
    )
  })
})
