import {
  normalizePubPartsPartSourceItem,
  readOptionalPubPartsString,
  readOptionalPubPartsStringList,
  type PubPartsNormalizedSourceItem,
  type PubPartsRawPartRecord,
} from './pubPartsSource'

export const PUB_PARTS_LIVE_PARTS_SOURCE_URL = 'https://pubparts.xyz/parts.json'
export const PUB_PARTS_LIVE_PARTS_PROXY_SOURCE_URL = '/pubparts-source/parts.json'
export const PUB_PARTS_LIVE_PARTS_SOURCE_SET_ID = 'parts/live'
export const PUB_PARTS_LIVE_PARTS_SOURCE_SET_LABEL = 'Live PubParts Parts'

export type PubPartsLiveSourceFetch = (
  input: string | URL,
  init?: RequestInit,
) => Promise<Pick<Response, 'json' | 'ok' | 'status'>>

export type PubPartsLivePartSourceRead =
  | {
      status: 'ready'
      sourceUrl: string
      fetchedAt: string
      sourceItems: PubPartsNormalizedSourceItem[]
    }
  | {
      status: 'fallback'
      sourceUrl: string
      reason: string
      sourceItems: []
    }

export type PubPartsLivePartSourceReadOptions = {
  fetchRef?: PubPartsLiveSourceFetch
  now?: () => Date
  requestUrls?: readonly string[]
  signal?: AbortSignal
  sourceUrl?: string
}

let pubPartsLiveSourceFetchForTests: PubPartsLiveSourceFetch | undefined
let isPubPartsLiveSourceDisabledForTests = false

export function setPubPartsLiveSourceFetchForTests(fetchRef: PubPartsLiveSourceFetch): void {
  pubPartsLiveSourceFetchForTests = fetchRef
  isPubPartsLiveSourceDisabledForTests = false
}

export function disablePubPartsLiveSourceForTests(): void {
  pubPartsLiveSourceFetchForTests = undefined
  isPubPartsLiveSourceDisabledForTests = true
}

export function resetPubPartsLiveSourceForTests(): void {
  pubPartsLiveSourceFetchForTests = undefined
  isPubPartsLiveSourceDisabledForTests = false
}

function createPubPartsLiveFallbackRead(sourceUrl: string, reason: string): PubPartsLivePartSourceRead {
  return {
    status: 'fallback',
    sourceUrl,
    reason,
    sourceItems: [],
  }
}

function isPubPartsRawPartRecord(value: unknown): value is PubPartsRawPartRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readLiveSourceDedupeValue(value: unknown): string {
  if (typeof value === 'string') {
    return readOptionalPubPartsString(value)?.toLowerCase() ?? ''
  }

  return readOptionalPubPartsStringList(value).join(', ').toLowerCase()
}

function buildLivePartDedupeKey(record: PubPartsRawPartRecord): string {
  const externalUrl = readLiveSourceDedupeValue(record.externalUrl)
  if (externalUrl.length > 0) {
    return `external:${externalUrl}`
  }

  const dropboxUrl = readLiveSourceDedupeValue(record.dropboxUrl)
  if (dropboxUrl.length > 0) {
    return `archive:${dropboxUrl}`
  }

  return [
    'fallback',
    readLiveSourceDedupeValue(record.title),
    readLiveSourceDedupeValue(record.typeOfPart),
    readLiveSourceDedupeValue(record.platform),
  ].join(':')
}

function readLivePartTitle(record: PubPartsRawPartRecord): string {
  return readOptionalPubPartsString(record.title) ?? ''
}

function sortLivePartRecords(records: readonly PubPartsRawPartRecord[]): PubPartsRawPartRecord[] {
  return [...records].sort((left, right) => {
    const leftKey = buildLivePartDedupeKey(left)
    const rightKey = buildLivePartDedupeKey(right)
    if (leftKey !== rightKey) {
      return leftKey.localeCompare(rightKey)
    }

    return readLivePartTitle(left).localeCompare(readLivePartTitle(right))
  })
}

function dedupeLivePartRecords(records: readonly PubPartsRawPartRecord[]): PubPartsRawPartRecord[] {
  const recordsByKey = new Map<string, PubPartsRawPartRecord>()

  for (const record of records) {
    const dedupeKey = buildLivePartDedupeKey(record)
    if (!recordsByKey.has(dedupeKey)) {
      recordsByKey.set(dedupeKey, record)
    }
  }

  return Array.from(recordsByKey.values())
}

function withLiveSourceSetMetadata(
  item: PubPartsNormalizedSourceItem,
  sourceUrl: string,
  fetchedAt: string,
): PubPartsNormalizedSourceItem {
  return {
    ...item,
    sourceLastUpdated: fetchedAt,
    sourceMetadata: {
      ...item.sourceMetadata,
      sourceSetId: PUB_PARTS_LIVE_PARTS_SOURCE_SET_ID,
      sourceSetLabel: PUB_PARTS_LIVE_PARTS_SOURCE_SET_LABEL,
      sourceSetUrl: sourceUrl,
      sourceSetReadAt: fetchedAt,
    },
  }
}

function normalizeLivePartSourceItems(
  payload: readonly unknown[],
  sourceUrl: string,
  fetchedAt: string,
): PubPartsNormalizedSourceItem[] {
  const records = payload.filter(isPubPartsRawPartRecord)
  return dedupeLivePartRecords(sortLivePartRecords(records)).map((record) =>
    withLiveSourceSetMetadata(normalizePubPartsPartSourceItem(record), sourceUrl, fetchedAt),
  )
}

function readLiveSourceErrorReason(error: unknown): string {
  if (error instanceof Error && error.name === 'AbortError') {
    return 'aborted'
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim()
  }

  return 'fetch-failed'
}

export async function readLivePubPartsPartSourceItems(
  options: PubPartsLivePartSourceReadOptions = {},
): Promise<PubPartsLivePartSourceRead> {
  const sourceUrl = options.sourceUrl ?? PUB_PARTS_LIVE_PARTS_SOURCE_URL
  const requestUrls = options.requestUrls ?? [
    sourceUrl,
    PUB_PARTS_LIVE_PARTS_PROXY_SOURCE_URL,
  ]

  if (isPubPartsLiveSourceDisabledForTests) {
    return createPubPartsLiveFallbackRead(sourceUrl, 'disabled-for-tests')
  }

  const fetchRef = options.fetchRef ?? pubPartsLiveSourceFetchForTests ?? globalThis.fetch
  if (typeof fetchRef !== 'function') {
    return createPubPartsLiveFallbackRead(sourceUrl, 'fetch-unavailable')
  }

  let fallbackReason = 'fetch-failed'

  for (const requestUrl of requestUrls) {
    try {
      const response = await fetchRef(requestUrl, {
        cache: 'no-store',
        signal: options.signal,
      })

      if (!response.ok) {
        fallbackReason = `http-${response.status}`
        continue
      }

      const payload = await response.json()
      if (!Array.isArray(payload)) {
        fallbackReason = 'payload-not-array'
        continue
      }

      const fetchedAt = (options.now?.() ?? new Date()).toISOString()
      return {
        status: 'ready',
        sourceUrl,
        fetchedAt,
        sourceItems: normalizeLivePartSourceItems(payload, sourceUrl, fetchedAt),
      }
    } catch (error) {
      fallbackReason = readLiveSourceErrorReason(error)
    }
  }

  return createPubPartsLiveFallbackRead(sourceUrl, fallbackReason)
}
