export type PubPartsStringValue = string | readonly string[]

export type PubPartsRawPartRecord = {
  title?: unknown
  fabricationMethod?: PubPartsStringValue | null
  typeOfPart?: PubPartsStringValue | null
  imageSrc?: unknown
  platform?: PubPartsStringValue | null
  externalUrl?: unknown
  dropboxUrl?: unknown
  dropboxZipLastUpdated?: unknown
}

export type PubPartsRawResourceRecord = {
  title?: unknown
  typeOfResource?: PubPartsStringValue | null
  externalUrl?: unknown
  appStoreLink?: unknown
  playStoreLink?: unknown
  description?: unknown
}

export type PubPartsSourceRecordKind = 'part' | 'resource'

export type PubPartsNormalizedSourceItem = {
  providerId: string
  providerName: string
  sourceRecordKind: PubPartsSourceRecordKind
  sourceTitle: string
  sourceCollectionKey?: string
  sourceCollectionLabel?: string
  sourceUrl?: string
  externalItemUrl?: string
  previewImageUrl?: string
  linkedArchiveUrl?: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceMetadata: Record<string, string>
}

export function readOptionalPubPartsString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

export function readOptionalPubPartsStringList(value: unknown): string[] {
  if (typeof value === 'string') {
    const normalizedValue = readOptionalPubPartsString(value)
    return normalizedValue === undefined ? [] : [normalizedValue]
  }

  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => readOptionalPubPartsString(item))
    .filter((item): item is string => item !== undefined)
}

function readFirstPubPartsString(value: unknown): string | undefined {
  return readOptionalPubPartsStringList(value)[0]
}

export function normalizePubPartsPreviewImageUrl(value: unknown): string | undefined {
  const previewImageUrl = readFirstPubPartsString(value)

  if (previewImageUrl === undefined) {
    return undefined
  }

  if (/^https?:\/\//iu.test(previewImageUrl)) {
    return previewImageUrl
  }

  if (previewImageUrl.startsWith('//')) {
    return `https:${previewImageUrl}`
  }

  if (previewImageUrl.startsWith('/')) {
    return `https://pubparts.xyz${previewImageUrl}`
  }

  return previewImageUrl
}

function readPubPartsMetadataValue(value: unknown): string | undefined {
  const normalizedValues = readOptionalPubPartsStringList(value)
  return normalizedValues.length > 0 ? normalizedValues.join(', ') : undefined
}

export function normalizePubPartsProviderId(value: unknown): string {
  return readOptionalPubPartsString(value)?.toLowerCase() ?? 'pubparts'
}

export function normalizePubPartsPartSourceItem(
  record: PubPartsRawPartRecord,
  providerId: unknown = 'pubparts',
): PubPartsNormalizedSourceItem {
  return {
    providerId: normalizePubPartsProviderId(providerId),
    providerName: 'PubParts',
    sourceRecordKind: 'part',
    sourceTitle: readOptionalPubPartsString(record.title) ?? 'Untitled PubParts part',
    sourceCollectionKey: readPubPartsMetadataValue(record.typeOfPart),
    sourceCollectionLabel: readPubPartsMetadataValue(record.platform),
    sourceUrl: readOptionalPubPartsString(record.externalUrl),
    externalItemUrl: readOptionalPubPartsString(record.externalUrl),
    previewImageUrl: normalizePubPartsPreviewImageUrl(record.imageSrc),
    linkedArchiveUrl: readOptionalPubPartsString(record.dropboxUrl),
    archiveLastUpdated: readOptionalPubPartsString(record.dropboxZipLastUpdated),
    sourceMetadata: {
      fabricationMethod: readPubPartsMetadataValue(record.fabricationMethod) ?? '',
      typeOfPart: readPubPartsMetadataValue(record.typeOfPart) ?? '',
      platform: readPubPartsMetadataValue(record.platform) ?? '',
    },
  }
}

export function normalizePubPartsResourceSourceItem(
  record: PubPartsRawResourceRecord,
  providerId: unknown = 'pubparts',
): PubPartsNormalizedSourceItem {
  return {
    providerId: normalizePubPartsProviderId(providerId),
    providerName: 'PubParts',
    sourceRecordKind: 'resource',
    sourceTitle: readOptionalPubPartsString(record.title) ?? 'Untitled PubParts resource',
    sourceCollectionKey: readPubPartsMetadataValue(record.typeOfResource),
    sourceCollectionLabel: readPubPartsMetadataValue(record.typeOfResource),
    sourceUrl: readOptionalPubPartsString(record.externalUrl),
    externalItemUrl: readOptionalPubPartsString(record.externalUrl),
    sourceMetadata: {
      typeOfResource: readPubPartsMetadataValue(record.typeOfResource) ?? '',
      appStoreLink: readOptionalPubPartsString(record.appStoreLink) ?? '',
      playStoreLink: readOptionalPubPartsString(record.playStoreLink) ?? '',
      description: readOptionalPubPartsString(record.description) ?? '',
    },
  }
}
