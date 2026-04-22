import type { PubPartsArchiveManifestCacheRecord } from './pubPartsArchiveManifestCache'
import type {
  PubPartsLocalSourceRecord,
  PubPartsStagedSourceRecord,
} from './pubPartsDownloadsStorage'
import type {
  PubPartsInternalLibraryArchiveInspectionManifest,
  PubPartsInternalLibraryItemPaths,
  PubPartsInternalLibraryManifest,
} from './pubPartsInternalLibrary'
import type { PubPartsLocalLibraryMirrorRead } from './pubPartsLocalLibraryMirror'
import {
  buildPubPartsSourceMaterializationFreshness,
  buildPubPartsSourceMaterializationIdentity,
  type PubPartsSourceByteOrigin,
  type PubPartsSourceMaterializationDecision,
  type PubPartsSourceMaterializationFallback,
  type PubPartsSourceMaterializationFreshness,
  type PubPartsSourceMaterializationIdentity,
  type PubPartsSourceMaterializationNextStep,
  type PubPartsSourceMaterializationStatus,
} from './pubPartsSourceMaterialization'
import type { PubPartsTrustedSourceProviderCapabilityRead } from './pubPartsTrustedSourceProvider'
import type {
  PubPartsZipArchiveEntryBlockedReason,
  PubPartsZipArchiveEntryClassification,
  PubPartsZipArchiveEntryMetadata,
  PubPartsZipArchiveEntrySupportState,
} from './pubPartsZipArchive'
import { isPubPartsZipEntryPreviewFileType } from './pubPartsZipEntryPreview'

export const pubPartsSourceLibraryMetadataIndexSchemaVersion = 1 as const

export type PubPartsSourceLibraryMetadataArchiveSource =
  | 'none'
  | 'metadata-cache'
  | 'internal-library'
  | 'browser-fetch'
  | 'trusted-provider'
  | 'uploaded-local-zip'

export type PubPartsSourceLibraryMetadataInternalLibraryState =
  | 'not-cached'
  | 'cached'
  | 'stale'

export type PubPartsSourceLibraryMetadataLocalMirrorStatus =
  | PubPartsLocalLibraryMirrorRead['status']
  | 'mirrored'
  | 'not-mirrored'

export type PubPartsSourceLibraryMetadataProviderState =
  | PubPartsTrustedSourceProviderCapabilityRead['status']
  | 'materialized'
  | 'blocked'
  | 'failed'
  | 'not-attempted'

export type PubPartsSourceLibraryMetadataEntryRecord = {
  candidateId: string
  archivePath: string
  normalizedPath: string
  fileName: string
  fileType?: string
  classification: PubPartsZipArchiveEntryClassification
  supportState: PubPartsZipArchiveEntrySupportState
  blockedReason?: PubPartsZipArchiveEntryBlockedReason
  description: string
  fileSizeBytes?: number
  compressedSizeBytes?: number
  lastModifiedAt?: string
  isDirectory: boolean
  selectable: boolean
  previewable: boolean
  importable: boolean
  blocked: boolean
}

export type PubPartsSourceLibraryMetadataRecord = {
  schemaVersion: typeof pubPartsSourceLibraryMetadataIndexSchemaVersion
  recordId: string
  indexedAt: string
  identity: PubPartsSourceMaterializationIdentity & {
    stagedSourceId: string
    sourceCollectionKey?: string
    sourceCollectionLabel?: string
  }
  freshness: PubPartsSourceMaterializationFreshness
  materialization: {
    status: PubPartsSourceMaterializationStatus | 'not-attempted'
    materialized: boolean
    byteOrigin?: PubPartsSourceByteOrigin
    fallback: PubPartsSourceMaterializationFallback
    nextStep: PubPartsSourceMaterializationNextStep
    reason?: string
    providerState: PubPartsSourceLibraryMetadataProviderState
    byteSize?: number
    materializedAt?: string
  }
  archive: {
    source: PubPartsSourceLibraryMetadataArchiveSource
    inspected: boolean
    inspectedAt?: string
    entryCount: number
    supportedEntryCount: number
    previewableEntryCount: number
    importableEntryCount: number
    blockedEntryCount: number
    stale: boolean
  }
  entries: PubPartsSourceLibraryMetadataEntryRecord[]
  storage: {
    internalLibrary: {
      state: PubPartsSourceLibraryMetadataInternalLibraryState
      sourceVersionKey?: string
      sourceVersionKind?: string
      manifestPath?: string
      archivePath?: string
      archiveManifestPath?: string
      updatedAt?: string
      byteSize?: number
    }
    localLibraryMirror: {
      status: PubPartsSourceLibraryMetadataLocalMirrorStatus
      mirrored: boolean
      rootLabel?: string
      rootFolderPath?: string
      message?: string
      archivePath?: string
      importablePaths: string[]
      updatedAt?: string
    }
  }
  reads: {
    cached: boolean
    inspected: boolean
    previewable: boolean
    importable: boolean
    mirrored: boolean
    stale: boolean
    blocked: boolean
    uploadFallbackAvailable: boolean
    browserFetchAttemptable: boolean
    providerConfigured: boolean
    providerUnavailable: boolean
    providerBlocked: boolean
    providerMaterialized: boolean
  }
}

export type PubPartsSourceLibraryMetadataMirrorInput = {
  read?: PubPartsLocalLibraryMirrorRead
  status?: PubPartsSourceLibraryMetadataLocalMirrorStatus
  mirrored?: boolean
  archivePath?: string
  importablePaths?: string[]
  mirroredAt?: string
  message?: string
}

export type PubPartsSourceLibraryMetadataInternalLibraryInput = {
  manifest: PubPartsInternalLibraryManifest
  archiveInspection?: PubPartsInternalLibraryArchiveInspectionManifest
  paths?: Pick<
    PubPartsInternalLibraryItemPaths,
    'manifestPath' | 'archiveFilePath' | 'archiveManifestPath'
  >
}

export type PubPartsSourceLibraryMetadataArchiveInspectionInput = {
  source: Exclude<PubPartsSourceLibraryMetadataArchiveSource, 'none'>
  inspectedAt?: string
  entries: PubPartsZipArchiveEntryMetadata[]
}

export type BuildPubPartsSourceLibraryMetadataRecordInput = {
  stagedRecord: PubPartsStagedSourceRecord
  materializationDecision?: PubPartsSourceMaterializationDecision
  providerCapability?: PubPartsTrustedSourceProviderCapabilityRead
  archiveManifestRecord?: PubPartsArchiveManifestCacheRecord
  archiveInspection?: PubPartsSourceLibraryMetadataArchiveInspectionInput
  internalLibrary?: PubPartsSourceLibraryMetadataInternalLibraryInput
  localLibraryMirror?: PubPartsSourceLibraryMetadataMirrorInput
  localSourceRecord?: PubPartsLocalSourceRecord
  indexedAt?: string
}

export type PubPartsSourceLibraryMetadataIndexRead =
  | 'cached'
  | 'inspected'
  | 'previewable'
  | 'importable'
  | 'mirrored'
  | 'stale'
  | 'blocked'
  | 'uploadFallbackAvailable'
  | 'browserFetchAttemptable'
  | 'providerConfigured'
  | 'providerUnavailable'
  | 'providerBlocked'
  | 'providerMaterialized'

export type PubPartsSourceLibraryMetadataIndex = {
  schemaVersion: typeof pubPartsSourceLibraryMetadataIndexSchemaVersion
  records: PubPartsSourceLibraryMetadataRecord[]
  recordsById: Record<string, PubPartsSourceLibraryMetadataRecord>
  recordsByCatalogItemId: Record<string, PubPartsSourceLibraryMetadataRecord[]>
  recordsBySourceVersionKey: Record<string, PubPartsSourceLibraryMetadataRecord[]>
}

export type PubPartsSourceLibraryMetadataQuery = {
  catalogItemId?: string
  sourceVersionKey?: string
  read?: PubPartsSourceLibraryMetadataIndexRead
  providerState?: PubPartsSourceLibraryMetadataProviderState
}

const defaultFallback: PubPartsSourceMaterializationFallback = 'open-source-and-upload-zip'
const defaultNextStep: PubPartsSourceMaterializationNextStep = 'open-source-and-upload-zip'

const isFallbackUploadAvailable = (
  fallback: PubPartsSourceMaterializationFallback,
): boolean => fallback === 'upload-zip' || fallback === 'open-source-and-upload-zip'

const isBrowserFetchAttemptable = (status: PubPartsSourceMaterializationStatus | 'not-attempted') =>
  status === 'not-attempted' ||
  status === 'browser-fetch-readable' ||
  status === 'provider-unavailable' ||
  status === 'provider-blocked' ||
  status === 'failed'

const mapByteOriginToArchiveSource = (
  byteOrigin: PubPartsSourceByteOrigin | undefined,
): PubPartsSourceLibraryMetadataArchiveSource => {
  switch (byteOrigin) {
    case 'browser-fetch':
      return 'browser-fetch'
    case 'internal-library-cache':
      return 'internal-library'
    case 'trusted-provider':
      return 'trusted-provider'
    case 'uploaded-local-zip':
      return 'uploaded-local-zip'
    default:
      return 'none'
  }
}

const mapProviderState = (
  decision: PubPartsSourceMaterializationDecision | undefined,
  capability: PubPartsTrustedSourceProviderCapabilityRead | undefined,
): PubPartsSourceLibraryMetadataProviderState => {
  switch (decision?.status) {
    case 'provider-materialized':
      return 'materialized'
    case 'provider-unavailable':
      return 'unavailable'
    case 'provider-blocked':
      return 'blocked'
    case 'failed':
      return capability?.status ?? 'failed'
    default:
      return capability?.status ?? 'not-attempted'
  }
}

const normalizeEntry = (
  stagedRecord: PubPartsStagedSourceRecord,
  entry: PubPartsZipArchiveEntryMetadata,
): PubPartsSourceLibraryMetadataEntryRecord => {
  const previewable =
    entry.classification === 'supported' &&
    entry.selectable &&
    isPubPartsZipEntryPreviewFileType(entry.fileType)
  const importable =
    entry.classification === 'supported' &&
    entry.selectable &&
    entry.supportState === 'import-supported'

  return {
    candidateId: `${stagedRecord.stagedSourceId}:archive-entry:${entry.normalizedPath}`,
    archivePath: entry.archivePath,
    normalizedPath: entry.normalizedPath,
    fileName: entry.fileName,
    ...(entry.fileType === undefined ? {} : { fileType: entry.fileType }),
    classification: entry.classification,
    supportState: entry.supportState,
    ...(entry.blockedReason === undefined ? {} : { blockedReason: entry.blockedReason }),
    description: entry.description,
    ...(entry.fileSizeBytes === undefined ? {} : { fileSizeBytes: entry.fileSizeBytes }),
    ...(entry.compressedSizeBytes === undefined
      ? {}
      : { compressedSizeBytes: entry.compressedSizeBytes }),
    ...(entry.lastModifiedAt === undefined ? {} : { lastModifiedAt: entry.lastModifiedAt }),
    isDirectory: entry.isDirectory,
    selectable: entry.selectable,
    previewable,
    importable,
    blocked: entry.classification === 'blocked' || entry.classification === 'unsafe',
  }
}

const resolveArchiveInspection = (
  input: BuildPubPartsSourceLibraryMetadataRecordInput,
): {
  source: PubPartsSourceLibraryMetadataArchiveSource
  inspectedAt?: string
  entries: PubPartsZipArchiveEntryMetadata[]
} => {
  if (input.internalLibrary?.archiveInspection !== undefined) {
    return {
      source: 'internal-library',
      inspectedAt: input.internalLibrary.archiveInspection.inspectedAt,
      entries: input.internalLibrary.archiveInspection.entries,
    }
  }

  if (input.archiveInspection !== undefined) {
    return {
      source: input.archiveInspection.source,
      ...(input.archiveInspection.inspectedAt === undefined
        ? {}
        : { inspectedAt: input.archiveInspection.inspectedAt }),
      entries: input.archiveInspection.entries,
    }
  }

  if (input.archiveManifestRecord !== undefined) {
    return {
      source: 'metadata-cache',
      inspectedAt: input.archiveManifestRecord.inspectedAt,
      entries: input.archiveManifestRecord.entries,
    }
  }

  return {
    source: mapByteOriginToArchiveSource(input.materializationDecision?.archiveByteInput?.byteOrigin),
    entries: [],
  }
}

const resolveMetadataVersion = (
  source: PubPartsArchiveManifestCacheRecord | PubPartsInternalLibraryManifest | undefined,
): { sourceVersionKey: string; sourceVersionKind: string } | null => {
  if (source === undefined) {
    return null
  }

  if ('sourceVersion' in source) {
    return {
      sourceVersionKey: source.sourceVersion,
      sourceVersionKind: source.sourceVersionKind,
    }
  }

  if (source.archiveLastUpdated !== undefined) {
    return {
      sourceVersionKey: source.archiveLastUpdated,
      sourceVersionKind: 'archiveLastUpdated',
    }
  }

  if (source.sourceLastUpdated !== undefined) {
    return {
      sourceVersionKey: source.sourceLastUpdated,
      sourceVersionKind: 'sourceLastUpdated',
    }
  }

  return {
    sourceVersionKey: source.sourceVersionKey,
    sourceVersionKind: source.sourceVersionKind,
  }
}

const isMetadataVersionStale = (
  freshness: PubPartsSourceMaterializationFreshness,
  metadataVersion: { sourceVersionKey: string; sourceVersionKind: string } | null,
): boolean =>
  metadataVersion !== null &&
  (metadataVersion.sourceVersionKey !== freshness.sourceVersionKey ||
    metadataVersion.sourceVersionKind !== freshness.sourceVersionKind)

const resolveArchiveMetadataVersion = (
  input: BuildPubPartsSourceLibraryMetadataRecordInput,
): { sourceVersionKey: string; sourceVersionKind: string } | null =>
  resolveMetadataVersion(input.internalLibrary?.manifest) ??
  resolveMetadataVersion(input.archiveManifestRecord)

const resolveRecordId = (
  stagedRecord: PubPartsStagedSourceRecord,
  freshness: PubPartsSourceMaterializationFreshness,
): string =>
  [
    'pubparts-source-library-metadata',
    stagedRecord.providerId,
    stagedRecord.catalogItemId,
    stagedRecord.sourceCandidateUrl.trim(),
    freshness.sourceVersionKind,
    freshness.sourceVersionKey,
  ]
    .map(encodeURIComponent)
    .join('|')

const resolveInternalLibraryStorage = (
  input: BuildPubPartsSourceLibraryMetadataRecordInput,
  stale: boolean,
): PubPartsSourceLibraryMetadataRecord['storage']['internalLibrary'] => {
  const internalLibrary = input.internalLibrary
  if (internalLibrary === undefined) {
    return {
      state: 'not-cached',
    }
  }

  return {
    state: stale ? 'stale' : 'cached',
    sourceVersionKey: internalLibrary.manifest.sourceVersionKey,
    sourceVersionKind: internalLibrary.manifest.sourceVersionKind,
    ...(internalLibrary.paths?.manifestPath === undefined
      ? {}
      : { manifestPath: internalLibrary.paths.manifestPath }),
    ...(internalLibrary.paths?.archiveFilePath === undefined
      ? {}
      : { archivePath: internalLibrary.paths.archiveFilePath }),
    ...(internalLibrary.paths?.archiveManifestPath === undefined
      ? {}
      : { archiveManifestPath: internalLibrary.paths.archiveManifestPath }),
    updatedAt: internalLibrary.manifest.updatedAt,
    ...(internalLibrary.manifest.sourceByteSize === undefined
      ? {}
      : { byteSize: internalLibrary.manifest.sourceByteSize }),
  }
}

const resolveLocalMirrorStorage = (
  input: BuildPubPartsSourceLibraryMetadataRecordInput,
): PubPartsSourceLibraryMetadataRecord['storage']['localLibraryMirror'] => {
  const read = input.localLibraryMirror?.read
  const status =
    input.localLibraryMirror?.status ??
    (input.localLibraryMirror?.mirrored === true
      ? 'mirrored'
      : read?.status ?? (input.localSourceRecord === undefined ? 'not-mirrored' : 'not-configured'))
  const mirrored = status === 'mirrored' || input.localLibraryMirror?.mirrored === true
  const rootLabel = read?.rootLabel ?? input.localSourceRecord?.itemFolderPath
  const rootFolderPath = read?.rootFolderPath
  const message = input.localLibraryMirror?.message ?? read?.message
  const archivePath = input.localLibraryMirror?.archivePath
  const importablePaths = input.localLibraryMirror?.importablePaths ?? []
  const updatedAt = input.localLibraryMirror?.mirroredAt ?? input.localSourceRecord?.updatedAt

  return {
    status,
    mirrored,
    ...(rootLabel === undefined ? {} : { rootLabel }),
    ...(rootFolderPath === undefined ? {} : { rootFolderPath }),
    ...(message === undefined ? {} : { message }),
    ...(archivePath === undefined ? {} : { archivePath }),
    importablePaths,
    ...(updatedAt === undefined ? {} : { updatedAt }),
  }
}

export function buildPubPartsSourceLibraryMetadataRecord(
  input: BuildPubPartsSourceLibraryMetadataRecordInput,
): PubPartsSourceLibraryMetadataRecord {
  const decision = input.materializationDecision
  const identity =
    decision?.identity ?? buildPubPartsSourceMaterializationIdentity(input.stagedRecord)
  const freshness =
    decision?.freshness ?? buildPubPartsSourceMaterializationFreshness(input.stagedRecord)
  const archiveInspection = resolveArchiveInspection(input)
  const entries = archiveInspection.entries.map((entry) => normalizeEntry(input.stagedRecord, entry))
  const archiveMetadataVersion = resolveArchiveMetadataVersion(input)
  const stale = isMetadataVersionStale(freshness, archiveMetadataVersion)
  const internalLibrary = resolveInternalLibraryStorage(input, stale)
  const localLibraryMirror = resolveLocalMirrorStorage(input)
  const status = decision?.status ?? 'not-attempted'
  const fallback = decision?.fallback ?? defaultFallback
  const providerState = mapProviderState(decision, input.providerCapability)
  const blocked =
    entries.some((entry) => entry.blocked) ||
    status === 'browser-fetch-blocked' ||
    status === 'provider-blocked' ||
    status === 'failed' ||
    providerState === 'blocked' ||
    providerState === 'failed'

  const record: PubPartsSourceLibraryMetadataRecord = {
    schemaVersion: pubPartsSourceLibraryMetadataIndexSchemaVersion,
    recordId: resolveRecordId(input.stagedRecord, freshness),
    indexedAt: input.indexedAt ?? new Date().toISOString(),
    identity: {
      ...identity,
      stagedSourceId: input.stagedRecord.stagedSourceId,
      ...(input.stagedRecord.sourceCollectionKey === undefined
        ? {}
        : { sourceCollectionKey: input.stagedRecord.sourceCollectionKey }),
      ...(input.stagedRecord.sourceCollectionLabel === undefined
        ? {}
        : { sourceCollectionLabel: input.stagedRecord.sourceCollectionLabel }),
    },
    freshness,
    materialization: {
      status,
      materialized: decision?.materialized ?? false,
      ...(decision?.archiveByteInput?.byteOrigin === undefined
        ? {}
        : { byteOrigin: decision.archiveByteInput.byteOrigin }),
      fallback,
      nextStep: decision?.nextStep ?? defaultNextStep,
      ...(decision?.reason === undefined ? {} : { reason: decision.reason }),
      providerState,
      ...(freshness.byteSize === undefined ? {} : { byteSize: freshness.byteSize }),
      ...(freshness.materializedAt === undefined
        ? {}
        : { materializedAt: freshness.materializedAt }),
    },
    archive: {
      source: archiveInspection.source,
      inspected: entries.length > 0 || input.stagedRecord.inspectionStatus === 'metadata-inspected',
      ...(archiveInspection.inspectedAt === undefined
        ? {}
        : { inspectedAt: archiveInspection.inspectedAt }),
      entryCount: entries.length,
      supportedEntryCount: entries.filter((entry) => entry.classification === 'supported').length,
      previewableEntryCount: entries.filter((entry) => entry.previewable).length,
      importableEntryCount: entries.filter((entry) => entry.importable).length,
      blockedEntryCount: entries.filter((entry) => entry.blocked).length,
      stale,
    },
    entries,
    storage: {
      internalLibrary,
      localLibraryMirror,
    },
    reads: {
      cached: internalLibrary.state === 'cached',
      inspected: entries.length > 0 || input.stagedRecord.inspectionStatus === 'metadata-inspected',
      previewable: entries.some((entry) => entry.previewable),
      importable: entries.some((entry) => entry.importable),
      mirrored: localLibraryMirror.mirrored,
      stale,
      blocked,
      uploadFallbackAvailable: isFallbackUploadAvailable(fallback),
      browserFetchAttemptable: isBrowserFetchAttemptable(status),
      providerConfigured: providerState === 'configured' || providerState === 'materialized',
      providerUnavailable: providerState === 'unavailable',
      providerBlocked: providerState === 'blocked',
      providerMaterialized: providerState === 'materialized',
    },
  }

  return record
}

const appendToIndex = (
  target: Record<string, PubPartsSourceLibraryMetadataRecord[]>,
  key: string,
  record: PubPartsSourceLibraryMetadataRecord,
): void => {
  target[key] = [...(target[key] ?? []), record]
}

export function createPubPartsSourceLibraryMetadataIndex(
  records: PubPartsSourceLibraryMetadataRecord[],
): PubPartsSourceLibraryMetadataIndex {
  const recordsById: Record<string, PubPartsSourceLibraryMetadataRecord> = {}
  const recordsByCatalogItemId: Record<string, PubPartsSourceLibraryMetadataRecord[]> = {}
  const recordsBySourceVersionKey: Record<string, PubPartsSourceLibraryMetadataRecord[]> = {}

  records.forEach((record) => {
    recordsById[record.recordId] = record
    appendToIndex(recordsByCatalogItemId, record.identity.catalogItemId, record)
    appendToIndex(recordsBySourceVersionKey, record.freshness.sourceVersionKey, record)
  })

  return {
    schemaVersion: pubPartsSourceLibraryMetadataIndexSchemaVersion,
    records: [...records],
    recordsById,
    recordsByCatalogItemId,
    recordsBySourceVersionKey,
  }
}

export function queryPubPartsSourceLibraryMetadataIndex(
  index: PubPartsSourceLibraryMetadataIndex,
  query: PubPartsSourceLibraryMetadataQuery,
): PubPartsSourceLibraryMetadataRecord[] {
  const initialRecords =
    query.catalogItemId === undefined
      ? index.records
      : index.recordsByCatalogItemId[query.catalogItemId] ?? []

  return initialRecords.filter((record) => {
    if (
      query.sourceVersionKey !== undefined &&
      record.freshness.sourceVersionKey !== query.sourceVersionKey
    ) {
      return false
    }

    if (query.read !== undefined && record.reads[query.read] !== true) {
      return false
    }

    if (
      query.providerState !== undefined &&
      record.materialization.providerState !== query.providerState
    ) {
      return false
    }

    return true
  })
}

export function findPubPartsSourceLibraryMetadataRecordById(
  index: PubPartsSourceLibraryMetadataIndex,
  recordId: string,
): PubPartsSourceLibraryMetadataRecord | null {
  return index.recordsById[recordId] ?? null
}

export function getPubPartsSourceLibraryMetadataRecordsByCatalogItemId(
  index: PubPartsSourceLibraryMetadataIndex,
  catalogItemId: string,
): PubPartsSourceLibraryMetadataRecord[] {
  return index.recordsByCatalogItemId[catalogItemId] ?? []
}

export function getPubPartsSourceLibraryMetadataRecordsBySourceVersion(
  index: PubPartsSourceLibraryMetadataIndex,
  sourceVersionKey: string,
): PubPartsSourceLibraryMetadataRecord[] {
  return index.recordsBySourceVersionKey[sourceVersionKey] ?? []
}
