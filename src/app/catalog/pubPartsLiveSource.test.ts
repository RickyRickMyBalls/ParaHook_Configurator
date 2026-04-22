import { describe, expect, it, vi } from 'vitest'
import {
  PUB_PARTS_LIVE_PARTS_SOURCE_URL,
  PUB_PARTS_LIVE_PARTS_PROXY_SOURCE_URL,
  readLivePubPartsPartSourceItems,
  type PubPartsLiveSourceFetch,
} from './pubPartsLiveSource'

describe('pubPartsLiveSource', () => {
  const now = () => new Date('2026-04-21T19:45:00.000Z')

  it('normalizes live PubParts part metadata through the existing source adapter', async () => {
    const fetchRef = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => [
        {
          title: 'Zinc Fresh Concave Footpad',
          fabricationMethod: '3d Printed',
          typeOfPart: 'Footpad Attachment',
          imageSrc: '/images/parts/fresh-footpad.png',
          platform: 'Floatwheel',
          externalUrl: 'https://pubparts.xyz/parts/zinc-fresh-concave-footpad',
          dropboxUrl: 'https://www.dropbox.com/scl/fi/fresh/fresh.zip?dl=0',
          dropboxZipLastUpdated: '2026-04-21',
        },
      ],
    })) satisfies PubPartsLiveSourceFetch

    const read = await readLivePubPartsPartSourceItems({ fetchRef, now })

    expect(fetchRef).toHaveBeenCalledWith(PUB_PARTS_LIVE_PARTS_SOURCE_URL, {
      cache: 'no-store',
      signal: undefined,
    })
    expect(read).toEqual({
      status: 'ready',
      sourceUrl: PUB_PARTS_LIVE_PARTS_SOURCE_URL,
      fetchedAt: '2026-04-21T19:45:00.000Z',
      sourceItems: [
        expect.objectContaining({
          providerId: 'pubparts',
          providerName: 'PubParts',
          sourceRecordKind: 'part',
          sourceTitle: 'Zinc Fresh Concave Footpad',
          sourceCollectionKey: 'Footpad Attachment',
          sourceCollectionLabel: 'Floatwheel',
          sourceUrl: 'https://pubparts.xyz/parts/zinc-fresh-concave-footpad',
          externalItemUrl: 'https://pubparts.xyz/parts/zinc-fresh-concave-footpad',
          previewImageUrl: 'https://pubparts.xyz/images/parts/fresh-footpad.png',
          linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/fresh/fresh.zip?dl=0',
          archiveLastUpdated: '2026-04-21',
          sourceLastUpdated: '2026-04-21T19:45:00.000Z',
          sourceMetadata: expect.objectContaining({
            fabricationMethod: '3d Printed',
            typeOfPart: 'Footpad Attachment',
            platform: 'Floatwheel',
            sourceSetId: 'parts/live',
            sourceSetLabel: 'Live PubParts Parts',
            sourceSetUrl: PUB_PARTS_LIVE_PARTS_SOURCE_URL,
            sourceSetReadAt: '2026-04-21T19:45:00.000Z',
          }),
        }),
      ],
    })
  })

  it('returns fallback when the endpoint payload is not an array', async () => {
    const fetchRef = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ records: [] }),
    })) satisfies PubPartsLiveSourceFetch

    await expect(readLivePubPartsPartSourceItems({ fetchRef, now })).resolves.toEqual({
      status: 'fallback',
      sourceUrl: PUB_PARTS_LIVE_PARTS_SOURCE_URL,
      reason: 'payload-not-array',
      sourceItems: [],
    })
  })

  it('returns fallback when the endpoint rejects or responds with a non-ok status', async () => {
    const rejectedFetch = vi.fn(async () => {
      throw new Error('network denied')
    }) satisfies PubPartsLiveSourceFetch
    const nonOkFetch = vi.fn(async () => ({
      ok: false,
      status: 503,
      json: async () => [],
    })) satisfies PubPartsLiveSourceFetch

    await expect(readLivePubPartsPartSourceItems({ fetchRef: rejectedFetch, now })).resolves.toEqual({
      status: 'fallback',
      sourceUrl: PUB_PARTS_LIVE_PARTS_SOURCE_URL,
      reason: 'network denied',
      sourceItems: [],
    })
    await expect(readLivePubPartsPartSourceItems({ fetchRef: nonOkFetch, now })).resolves.toEqual({
      status: 'fallback',
      sourceUrl: PUB_PARTS_LIVE_PARTS_SOURCE_URL,
      reason: 'http-503',
      sourceItems: [],
    })
  })

  it('falls through to the same-origin metadata proxy when direct fetch is blocked', async () => {
    const fetchRef = vi.fn(async (input) => {
      if (input === PUB_PARTS_LIVE_PARTS_SOURCE_URL) {
        throw new Error('cors blocked')
      }

      return {
        ok: true,
        status: 200,
        json: async () => [
          {
            title: 'Proxy Read PubParts Part',
            externalUrl: 'https://pubparts.xyz/parts/proxy-read',
          },
        ],
      }
    }) satisfies PubPartsLiveSourceFetch

    const read = await readLivePubPartsPartSourceItems({ fetchRef, now })

    expect(fetchRef).toHaveBeenNthCalledWith(1, PUB_PARTS_LIVE_PARTS_SOURCE_URL, {
      cache: 'no-store',
      signal: undefined,
    })
    expect(fetchRef).toHaveBeenNthCalledWith(2, PUB_PARTS_LIVE_PARTS_PROXY_SOURCE_URL, {
      cache: 'no-store',
      signal: undefined,
    })
    expect(read.status).toBe('ready')
    expect(read.sourceUrl).toBe(PUB_PARTS_LIVE_PARTS_SOURCE_URL)
    expect(read.sourceItems.map((item) => item.sourceTitle)).toEqual([
      'Proxy Read PubParts Part',
    ])
  })

  it('skips malformed records while preserving valid live records', async () => {
    const fetchRef = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => [
        null,
        'not a part',
        {
          title: 'Valid PubParts Part',
          typeOfPart: 'Controller Box',
          platform: 'XR/Funwheel',
          externalUrl: 'https://pubparts.xyz/parts/valid',
        },
      ],
    })) satisfies PubPartsLiveSourceFetch

    const read = await readLivePubPartsPartSourceItems({ fetchRef, now })

    expect(read.status).toBe('ready')
    expect(read.sourceItems).toHaveLength(1)
    expect(read.sourceItems[0]?.sourceTitle).toBe('Valid PubParts Part')
    expect(read.sourceItems[0]?.sourceMetadata.typeOfPart).toBe('Controller Box')
  })

  it('orders and dedupes live records by stable source identity', async () => {
    const fetchRef = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => [
        {
          title: 'B Later Part',
          externalUrl: 'https://pubparts.xyz/parts/b',
        },
        {
          title: 'A Duplicate Part',
          externalUrl: 'https://pubparts.xyz/parts/a',
        },
        {
          title: 'A Duplicate Part Copy',
          externalUrl: 'https://pubparts.xyz/parts/a',
        },
      ],
    })) satisfies PubPartsLiveSourceFetch

    const read = await readLivePubPartsPartSourceItems({ fetchRef, now })

    expect(read.status).toBe('ready')
    expect(read.sourceItems.map((item) => item.sourceTitle)).toEqual([
      'A Duplicate Part',
      'B Later Part',
    ])
  })
})
