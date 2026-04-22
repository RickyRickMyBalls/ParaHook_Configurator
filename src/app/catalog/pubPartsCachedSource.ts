import {
  normalizePubPartsPartSourceItem,
  normalizePubPartsResourceSourceItem,
  type PubPartsNormalizedSourceItem,
  type PubPartsRawPartRecord,
  type PubPartsRawResourceRecord,
} from './pubPartsSource'
import {
  PUB_PARTS_FULL_PARTS_CACHED_AT,
  PUB_PARTS_FULL_PARTS_RECORDS,
  PUB_PARTS_FULL_PARTS_SOURCE_URL,
} from './pubpartsSourceData/fullParts'
import {
  PUB_PARTS_ALL_PARTS_CACHED_AT,
  PUB_PARTS_ALL_PARTS_RECORDS,
  PUB_PARTS_ALL_PARTS_SOURCE_URL,
} from './pubpartsSourceData/parts'
import {
  PUB_PARTS_GT_PARTS_CACHED_AT,
  PUB_PARTS_GT_PARTS_RECORDS,
  PUB_PARTS_GT_PARTS_SOURCE_URL,
} from './pubpartsSourceData/partsGt'
import {
  PUB_PARTS_RESOURCE_RECORDS,
  PUB_PARTS_RESOURCES_CACHED_AT,
  PUB_PARTS_RESOURCES_SOURCE_URL,
} from './pubpartsSourceData/resources'

export type PubPartsCachedSourceSetKind = 'parts' | 'parts/full' | 'parts/gt' | 'resources'

export type PubPartsCachedSourceSet<RecordType> = {
  sourceSetId: PubPartsCachedSourceSetKind
  sourceCollectionLabel: string
  sourceUrl: string
  cachedAt: string
  records: readonly RecordType[]
}

export const PUB_PARTS_ALL_PARTS_SOURCE_SET = {
  sourceSetId: 'parts',
  sourceCollectionLabel: 'All Parts',
  sourceUrl: PUB_PARTS_ALL_PARTS_SOURCE_URL,
  cachedAt: PUB_PARTS_ALL_PARTS_CACHED_AT,
  records: PUB_PARTS_ALL_PARTS_RECORDS,
} as const satisfies PubPartsCachedSourceSet<PubPartsRawPartRecord>

export const PUB_PARTS_FULL_PARTS_SOURCE_SET = {
  sourceSetId: 'parts/full',
  sourceCollectionLabel: 'All Parts Full Cache',
  sourceUrl: PUB_PARTS_FULL_PARTS_SOURCE_URL,
  cachedAt: PUB_PARTS_FULL_PARTS_CACHED_AT,
  records: PUB_PARTS_FULL_PARTS_RECORDS,
} as const satisfies PubPartsCachedSourceSet<PubPartsRawPartRecord>

export const PUB_PARTS_GT_PARTS_SOURCE_SET = {
  sourceSetId: 'parts/gt',
  sourceCollectionLabel: 'GT Parts',
  sourceUrl: PUB_PARTS_GT_PARTS_SOURCE_URL,
  cachedAt: PUB_PARTS_GT_PARTS_CACHED_AT,
  records: PUB_PARTS_GT_PARTS_RECORDS,
} as const satisfies PubPartsCachedSourceSet<PubPartsRawPartRecord>

export const PUB_PARTS_RESOURCES_SOURCE_SET = {
  sourceSetId: 'resources',
  sourceCollectionLabel: 'Resources',
  sourceUrl: PUB_PARTS_RESOURCES_SOURCE_URL,
  cachedAt: PUB_PARTS_RESOURCES_CACHED_AT,
  records: PUB_PARTS_RESOURCE_RECORDS,
} as const satisfies PubPartsCachedSourceSet<PubPartsRawResourceRecord>

function withCachedSourceSetMetadata(
  item: PubPartsNormalizedSourceItem,
  sourceSet: Pick<
    PubPartsCachedSourceSet<unknown>,
    'cachedAt' | 'sourceCollectionLabel' | 'sourceSetId' | 'sourceUrl'
  >,
): PubPartsNormalizedSourceItem {
  return {
    ...item,
    sourceLastUpdated: sourceSet.cachedAt,
    sourceMetadata: {
      ...item.sourceMetadata,
      sourceSetId: sourceSet.sourceSetId,
      sourceSetLabel: sourceSet.sourceCollectionLabel,
      sourceSetUrl: sourceSet.sourceUrl,
      sourceSetCachedAt: sourceSet.cachedAt,
    },
  }
}

function readCachedPartSourceSet(
  sourceSet: PubPartsCachedSourceSet<PubPartsRawPartRecord>,
): PubPartsNormalizedSourceItem[] {
  return sourceSet.records.map((record) =>
    withCachedSourceSetMetadata(normalizePubPartsPartSourceItem(record), sourceSet),
  )
}

function normalizeCachedDedupeValue(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? ''
}

function buildCachedPartDedupeKey(item: PubPartsNormalizedSourceItem): string {
  const externalItemUrl = normalizeCachedDedupeValue(item.externalItemUrl ?? item.sourceUrl)
  if (externalItemUrl.length > 0) {
    return `external:${externalItemUrl}`
  }

  const linkedArchiveUrl = normalizeCachedDedupeValue(item.linkedArchiveUrl)
  if (linkedArchiveUrl.length > 0) {
    return `archive:${linkedArchiveUrl}`
  }

  return [
    'fallback',
    normalizeCachedDedupeValue(item.sourceTitle),
    normalizeCachedDedupeValue(item.sourceMetadata.typeOfPart),
    normalizeCachedDedupeValue(item.sourceMetadata.platform),
  ].join(':')
}

function withCachedSourceIdentityKey(
  item: PubPartsNormalizedSourceItem,
  sourceIdentityKey: string,
): PubPartsNormalizedSourceItem {
  return {
    ...item,
    sourceMetadata: {
      ...item.sourceMetadata,
      sourceIdentityKey,
    },
  }
}

function appendUniqueMetadataValue(existingValue: string | undefined, nextValue: string): string {
  const values = (existingValue ?? '')
    .split(', ')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)

  if (!values.includes(nextValue)) {
    values.push(nextValue)
  }

  return values.join(', ')
}

function mergeCachedSourceSetAttribution(
  primaryItem: PubPartsNormalizedSourceItem,
  duplicateItem: PubPartsNormalizedSourceItem,
): PubPartsNormalizedSourceItem {
  const mergedMetadata = { ...primaryItem.sourceMetadata }
  const attributionFields = [
    ['sourceSetId', 'sourceSetIds'],
    ['sourceSetLabel', 'sourceSetLabels'],
    ['sourceSetUrl', 'sourceSetUrls'],
    ['sourceSetCachedAt', 'sourceSetCachedAts'],
  ] as const

  for (const [sourceField, mergedField] of attributionFields) {
    for (const item of [primaryItem, duplicateItem]) {
      const value = item.sourceMetadata[sourceField]
      if (value !== undefined && value.length > 0) {
        mergedMetadata[mergedField] = appendUniqueMetadataValue(mergedMetadata[mergedField], value)
      }
    }
  }

  return {
    ...primaryItem,
    sourceMetadata: mergedMetadata,
  }
}

export function readCachedPubPartsDedupedPartSourceItems(
  sourceSets: readonly PubPartsCachedSourceSet<PubPartsRawPartRecord>[] = [
    PUB_PARTS_FULL_PARTS_SOURCE_SET,
  ],
): PubPartsNormalizedSourceItem[] {
  const itemsByDedupeKey = new Map<string, PubPartsNormalizedSourceItem>()

  for (const sourceSet of sourceSets) {
    const sourceSetSeenKeys = new Set<string>()

    for (const [sourceItemIndex, sourceItem] of readCachedPartSourceSet(sourceSet).entries()) {
      const dedupeKey = buildCachedPartDedupeKey(sourceItem)
      const existingItem = itemsByDedupeKey.get(dedupeKey)

      if (existingItem === undefined) {
        itemsByDedupeKey.set(dedupeKey, sourceItem)
        sourceSetSeenKeys.add(dedupeKey)
        continue
      }

      if (sourceSetSeenKeys.has(dedupeKey)) {
        const duplicateDedupeKey = `${dedupeKey}:source-duplicate:${sourceSet.sourceSetId}:${sourceItemIndex}`
        itemsByDedupeKey.set(
          duplicateDedupeKey,
          withCachedSourceIdentityKey(sourceItem, duplicateDedupeKey),
        )
        sourceSetSeenKeys.add(dedupeKey)
        continue
      }

      itemsByDedupeKey.set(dedupeKey, mergeCachedSourceSetAttribution(existingItem, sourceItem))
      sourceSetSeenKeys.add(dedupeKey)
    }
  }

  return Array.from(itemsByDedupeKey.values())
}

function readCachedResourceSourceSet(
  sourceSet: PubPartsCachedSourceSet<PubPartsRawResourceRecord>,
): PubPartsNormalizedSourceItem[] {
  return sourceSet.records.map((record) =>
    withCachedSourceSetMetadata(normalizePubPartsResourceSourceItem(record), sourceSet),
  )
}

export function readCachedPubPartsAllPartSourceItems(): PubPartsNormalizedSourceItem[] {
  return readCachedPartSourceSet(PUB_PARTS_ALL_PARTS_SOURCE_SET)
}

export function readCachedPubPartsFullPartSourceItems(): PubPartsNormalizedSourceItem[] {
  return readCachedPubPartsDedupedPartSourceItems([PUB_PARTS_FULL_PARTS_SOURCE_SET])
}

export function readCachedPubPartsGtPartSourceItems(): PubPartsNormalizedSourceItem[] {
  return readCachedPartSourceSet(PUB_PARTS_GT_PARTS_SOURCE_SET)
}

export function readCachedPubPartsResourceSourceItems(): PubPartsNormalizedSourceItem[] {
  return readCachedResourceSourceSet(PUB_PARTS_RESOURCES_SOURCE_SET)
}
