import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import type {
  PubPartsZipArchiveEntryBlockedReason,
  PubPartsZipArchiveEntryClassification,
  PubPartsZipArchiveEntryMetadata,
  PubPartsZipArchiveEntrySupportState,
} from './pubPartsZipArchive'

export const pubPartsArchiveManifestCacheStorageKey =
  'parahook:catalog:pubparts-archive-manifest-cache'

const pubPartsArchiveManifestCacheSchemaVersion = 1 as const

type PubPartsArchiveManifestCacheStorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem?: (key: string) => void
}

export type PubPartsArchiveManifestCacheSourceVersionKind =
  | 'archiveLastUpdated'
  | 'sourceLastUpdated'

export type PubPartsArchiveManifestCacheRecord = {
  schemaVersion: typeof pubPartsArchiveManifestCacheSchemaVersion
  providerId: 'pubparts'
  catalogItemId: string
  catalogItemLabel: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  sourceUrl?: string
  sourceCollectionKey?: string
  sourceCollectionLabel?: string
  sourceVersion: string
  sourceVersionKind: PubPartsArchiveManifestCacheSourceVersionKind
  archiveLastUpdated?: string
  sourceLastUpdated?: string
  inspectedAt: string
  entries: PubPartsZipArchiveEntryMetadata[]
}

export type PubPartsArchiveManifestCacheState = {
  schemaVersion: typeof pubPartsArchiveManifestCacheSchemaVersion
  recordsByCacheKey: Record<string, PubPartsArchiveManifestCacheRecord>
}

type PubPartsArchiveManifestCacheIdentity = {
  cacheKey: string
  sourceVersion: string
  sourceVersionKind: PubPartsArchiveManifestCacheSourceVersionKind
}

const entryClassifications = new Set<PubPartsZipArchiveEntryClassification>([
  'supported',
  'unsupported',
  'unsafe',
  'directory',
  'blocked',
])

const entrySupportStates = new Set<PubPartsZipArchiveEntrySupportState>([
  'import-supported',
  'recognized-source-unsupported',
  'unsupported',
  'none',
])

const entryBlockedReasons = new Set<PubPartsZipArchiveEntryBlockedReason>([
  'path-traversal',
  'absolute-path',
  'windows-drive-path',
  'empty-path',
  'nul-path',
  'hidden-or-system-path',
  'directory',
  'unknown-size',
  'oversized',
  'too-many-entries',
])

const isPubPartsZipArchiveEntryClassification = (
  value: unknown,
): value is PubPartsZipArchiveEntryClassification =>
  entryClassifications.has(value as PubPartsZipArchiveEntryClassification)

const isPubPartsZipArchiveEntrySupportState = (
  value: unknown,
): value is PubPartsZipArchiveEntrySupportState =>
  entrySupportStates.has(value as PubPartsZipArchiveEntrySupportState)

const isPubPartsZipArchiveEntryBlockedReason = (
  value: unknown,
): value is PubPartsZipArchiveEntryBlockedReason =>
  entryBlockedReasons.has(value as PubPartsZipArchiveEntryBlockedReason)

const createInitialPubPartsArchiveManifestCacheState =
  (): PubPartsArchiveManifestCacheState => ({
    schemaVersion: pubPartsArchiveManifestCacheSchemaVersion,
    recordsByCacheKey: {},
  })

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const isFiniteNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

const sanitizeOptionalNumber = (value: unknown): number | undefined =>
  isFiniteNonNegativeNumber(value) ? value : undefined

function sanitizePubPartsZipArchiveEntryMetadata(
  value: unknown,
): PubPartsZipArchiveEntryMetadata | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsZipArchiveEntryMetadata>
  const archivePath = trimOptionalString(candidate.archivePath)
  const normalizedPath = trimOptionalString(candidate.normalizedPath)
  const fileName = trimOptionalString(candidate.fileName)
  const description = trimOptionalString(candidate.description)
  const classification = candidate.classification
  const supportState = candidate.supportState

  if (
    archivePath === undefined ||
    normalizedPath === undefined ||
    fileName === undefined ||
    description === undefined ||
    !isPubPartsZipArchiveEntryClassification(classification) ||
    !isPubPartsZipArchiveEntrySupportState(supportState) ||
    typeof candidate.isDirectory !== 'boolean' ||
    typeof candidate.selectable !== 'boolean'
  ) {
    return null
  }

  const blockedReason = candidate.blockedReason
  if (blockedReason !== undefined && !isPubPartsZipArchiveEntryBlockedReason(blockedReason)) {
    return null
  }

  return {
    archivePath,
    normalizedPath,
    fileName,
    fileType: trimOptionalString(candidate.fileType),
    classification,
    supportState,
    blockedReason,
    description,
    fileSizeBytes: sanitizeOptionalNumber(candidate.fileSizeBytes),
    compressedSizeBytes: sanitizeOptionalNumber(candidate.compressedSizeBytes),
    lastModifiedAt: trimOptionalString(candidate.lastModifiedAt),
    isDirectory: candidate.isDirectory,
    selectable: candidate.selectable,
  }
}

function sanitizePubPartsArchiveManifestCacheRecord(
  value: unknown,
): PubPartsArchiveManifestCacheRecord | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsArchiveManifestCacheRecord>
  const catalogItemId = trimOptionalString(candidate.catalogItemId)
  const catalogItemLabel = trimOptionalString(candidate.catalogItemLabel)
  const sourceCandidateUrl = trimOptionalString(candidate.sourceCandidateUrl)
  const linkedArchiveUrl = trimOptionalString(candidate.linkedArchiveUrl)
  const sourceVersion = trimOptionalString(candidate.sourceVersion)
  const inspectedAt = trimOptionalString(candidate.inspectedAt)

  if (
    candidate.schemaVersion !== pubPartsArchiveManifestCacheSchemaVersion ||
    candidate.providerId !== 'pubparts' ||
    catalogItemId === undefined ||
    catalogItemLabel === undefined ||
    sourceCandidateUrl === undefined ||
    linkedArchiveUrl === undefined ||
    sourceVersion === undefined ||
    inspectedAt === undefined ||
    (candidate.sourceVersionKind !== 'archiveLastUpdated' &&
      candidate.sourceVersionKind !== 'sourceLastUpdated') ||
    !Array.isArray(candidate.entries)
  ) {
    return null
  }

  const entries = candidate.entries.map(sanitizePubPartsZipArchiveEntryMetadata)
  if (entries.some((entry) => entry === null)) {
    return null
  }

  return {
    schemaVersion: pubPartsArchiveManifestCacheSchemaVersion,
    providerId: 'pubparts',
    catalogItemId,
    catalogItemLabel,
    sourceCandidateUrl,
    linkedArchiveUrl,
    sourcePageUrl: trimOptionalString(candidate.sourcePageUrl),
    sourceUrl: trimOptionalString(candidate.sourceUrl),
    sourceCollectionKey: trimOptionalString(candidate.sourceCollectionKey),
    sourceCollectionLabel: trimOptionalString(candidate.sourceCollectionLabel),
    sourceVersion,
    sourceVersionKind: candidate.sourceVersionKind,
    archiveLastUpdated: trimOptionalString(candidate.archiveLastUpdated),
    sourceLastUpdated: trimOptionalString(candidate.sourceLastUpdated),
    inspectedAt,
    entries: entries as PubPartsZipArchiveEntryMetadata[],
  }
}

export function sanitizePubPartsArchiveManifestCacheState(
  rawValue: unknown,
): PubPartsArchiveManifestCacheState {
  if (rawValue === null || rawValue === undefined) {
    return createInitialPubPartsArchiveManifestCacheState()
  }

  let parsedValue: unknown = rawValue
  if (typeof rawValue === 'string') {
    try {
      parsedValue = JSON.parse(rawValue) as unknown
    } catch {
      return createInitialPubPartsArchiveManifestCacheState()
    }
  }

  if (typeof parsedValue !== 'object' || parsedValue === null) {
    return createInitialPubPartsArchiveManifestCacheState()
  }

  const candidate = parsedValue as Partial<PubPartsArchiveManifestCacheState>
  if (
    candidate.schemaVersion !== pubPartsArchiveManifestCacheSchemaVersion ||
    typeof candidate.recordsByCacheKey !== 'object' ||
    candidate.recordsByCacheKey === null
  ) {
    return createInitialPubPartsArchiveManifestCacheState()
  }

  const recordsByCacheKey = Object.entries(candidate.recordsByCacheKey).reduce<
    Record<string, PubPartsArchiveManifestCacheRecord>
  >((records, [cacheKey, record]) => {
    const sanitizedRecord = sanitizePubPartsArchiveManifestCacheRecord(record)
    if (sanitizedRecord === null) {
      return records
    }

    const expectedIdentity = resolvePubPartsArchiveManifestCacheIdentity(sanitizedRecord)
    if (expectedIdentity?.cacheKey === cacheKey) {
      records[cacheKey] = sanitizedRecord
    }
    return records
  }, {})

  return {
    schemaVersion: pubPartsArchiveManifestCacheSchemaVersion,
    recordsByCacheKey,
  }
}

const resolveDefaultStorage = (): PubPartsArchiveManifestCacheStorageLike | null =>
  typeof window === 'undefined' ? null : window.localStorage

export function readPubPartsArchiveManifestCache(
  storage: PubPartsArchiveManifestCacheStorageLike | null = resolveDefaultStorage(),
): PubPartsArchiveManifestCacheState {
  try {
    return sanitizePubPartsArchiveManifestCacheState(
      storage?.getItem(pubPartsArchiveManifestCacheStorageKey) ?? null,
    )
  } catch {
    return createInitialPubPartsArchiveManifestCacheState()
  }
}

function writePubPartsArchiveManifestCache(
  state: PubPartsArchiveManifestCacheState,
  storage: PubPartsArchiveManifestCacheStorageLike | null = resolveDefaultStorage(),
): PubPartsArchiveManifestCacheState {
  const sanitizedState = sanitizePubPartsArchiveManifestCacheState(state)
  storage?.setItem(pubPartsArchiveManifestCacheStorageKey, JSON.stringify(sanitizedState))
  return sanitizedState
}

export function clearPubPartsArchiveManifestCache(
  storage: PubPartsArchiveManifestCacheStorageLike | null = resolveDefaultStorage(),
): PubPartsArchiveManifestCacheState {
  storage?.removeItem?.(pubPartsArchiveManifestCacheStorageKey)
  return createInitialPubPartsArchiveManifestCacheState()
}

function resolvePubPartsArchiveManifestCacheIdentity(
  record: Pick<
    PubPartsStagedSourceRecord | PubPartsArchiveManifestCacheRecord,
    'providerId' | 'catalogItemId' | 'sourceCandidateUrl' | 'archiveLastUpdated' | 'sourceLastUpdated'
  >,
): PubPartsArchiveManifestCacheIdentity | null {
  const providerId = trimOptionalString(record.providerId)
  const catalogItemId = trimOptionalString(record.catalogItemId)
  const sourceCandidateUrl = trimOptionalString(record.sourceCandidateUrl)
  const archiveLastUpdated = trimOptionalString(record.archiveLastUpdated)
  const sourceLastUpdated = trimOptionalString(record.sourceLastUpdated)

  if (
    providerId !== 'pubparts' ||
    catalogItemId === undefined ||
    sourceCandidateUrl === undefined
  ) {
    return null
  }

  const sourceVersion =
    archiveLastUpdated !== undefined ? archiveLastUpdated : sourceLastUpdated
  const sourceVersionKind: PubPartsArchiveManifestCacheSourceVersionKind =
    archiveLastUpdated !== undefined ? 'archiveLastUpdated' : 'sourceLastUpdated'

  if (sourceVersion === undefined) {
    return null
  }

  const cacheKey = [
    'v1',
    providerId,
    catalogItemId,
    sourceCandidateUrl,
    sourceVersion,
  ]
    .map(encodeURIComponent)
    .join('|')

  return {
    cacheKey,
    sourceVersion,
    sourceVersionKind,
  }
}

export function readPubPartsArchiveManifestCacheRecord(
  stagedRecord: PubPartsStagedSourceRecord,
  storage: PubPartsArchiveManifestCacheStorageLike | null = resolveDefaultStorage(),
): PubPartsArchiveManifestCacheRecord | null {
  const identity = resolvePubPartsArchiveManifestCacheIdentity(stagedRecord)
  if (identity === null) {
    return null
  }

  const state = readPubPartsArchiveManifestCache(storage)
  const record = state.recordsByCacheKey[identity.cacheKey] ?? null
  if (
    record === null ||
    record.catalogItemId !== stagedRecord.catalogItemId ||
    record.providerId !== stagedRecord.providerId ||
    record.sourceCandidateUrl !== stagedRecord.sourceCandidateUrl.trim() ||
    record.sourceVersion !== identity.sourceVersion
  ) {
    return null
  }

  return record
}

export function writePubPartsArchiveManifestCacheRecord(
  stagedRecord: PubPartsStagedSourceRecord,
  entries: PubPartsZipArchiveEntryMetadata[],
  options: {
    inspectedAt?: string
    storage?: PubPartsArchiveManifestCacheStorageLike | null
  } = {},
): PubPartsArchiveManifestCacheRecord | null {
  const identity = resolvePubPartsArchiveManifestCacheIdentity(stagedRecord)
  if (identity === null) {
    return null
  }

  const sanitizedEntries = entries.map(sanitizePubPartsZipArchiveEntryMetadata)
  if (sanitizedEntries.some((entry) => entry === null)) {
    return null
  }

  const storage = options.storage ?? resolveDefaultStorage()
  const state = readPubPartsArchiveManifestCache(storage)
  const record: PubPartsArchiveManifestCacheRecord = {
    schemaVersion: pubPartsArchiveManifestCacheSchemaVersion,
    providerId: 'pubparts',
    catalogItemId: stagedRecord.catalogItemId,
    catalogItemLabel: stagedRecord.catalogItemLabel,
    sourceCandidateUrl: stagedRecord.sourceCandidateUrl.trim(),
    linkedArchiveUrl: stagedRecord.linkedArchiveUrl.trim(),
    sourcePageUrl: trimOptionalString(stagedRecord.sourcePageUrl),
    sourceUrl: trimOptionalString(stagedRecord.sourceUrl),
    sourceCollectionKey: trimOptionalString(stagedRecord.sourceCollectionKey),
    sourceCollectionLabel: trimOptionalString(stagedRecord.sourceCollectionLabel),
    sourceVersion: identity.sourceVersion,
    sourceVersionKind: identity.sourceVersionKind,
    archiveLastUpdated: trimOptionalString(stagedRecord.archiveLastUpdated),
    sourceLastUpdated: trimOptionalString(stagedRecord.sourceLastUpdated),
    inspectedAt: options.inspectedAt ?? new Date().toISOString(),
    entries: sanitizedEntries as PubPartsZipArchiveEntryMetadata[],
  }

  try {
    writePubPartsArchiveManifestCache(
      {
        ...state,
        recordsByCacheKey: {
          ...state.recordsByCacheKey,
          [identity.cacheKey]: record,
        },
      },
      storage,
    )
  } catch {
    return record
  }

  return record
}
