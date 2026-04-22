import { describe, expect, it } from 'vitest'
import type { PubPartsArchiveManifestCacheRecord } from './pubPartsArchiveManifestCache'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import type {
  PubPartsInternalLibraryArchiveInspectionManifest,
  PubPartsInternalLibraryManifest,
} from './pubPartsInternalLibrary'
import {
  buildPubPartsSourceMaterializationFreshness,
  buildPubPartsSourceMaterializationIdentity,
  resolvePubPartsSourceMaterializationDecision,
} from './pubPartsSourceMaterialization'
import type { PubPartsTrustedSourceProviderCapabilityRead } from './pubPartsTrustedSourceProvider'
import type { PubPartsZipArchiveEntryMetadata } from './pubPartsZipArchive'
import {
  buildPubPartsSourceLibraryMetadataRecord,
  createPubPartsSourceLibraryMetadataIndex,
  findPubPartsSourceLibraryMetadataRecordById,
  getPubPartsSourceLibraryMetadataRecordsByCatalogItemId,
  getPubPartsSourceLibraryMetadataRecordsBySourceVersion,
  queryPubPartsSourceLibraryMetadataIndex,
} from './pubPartsSourceLibraryMetadataIndex'

const indexedAt = '2026-04-21T17:33:36.000Z'

const buildStagedRecord = (
  overrides: Partial<PubPartsStagedSourceRecord> = {},
): PubPartsStagedSourceRecord => ({
  stagedSourceId: 'pubparts:external:pubparts:sample',
  catalogItemId: 'external:pubparts:sample',
  catalogItemLabel: 'Sample PubParts Item',
  providerId: 'pubparts',
  providerName: 'PubParts',
  sourceCollectionKey: 'GT/GT-S',
  sourceCollectionLabel: 'GT/GT-S',
  sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
  linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
  sourcePageUrl: 'https://www.printables.com/model/sample',
  sourceUrl: 'https://www.printables.com/model/sample',
  sourceLastUpdated: '2026-04-20',
  archiveLastUpdated: '2026-04-21',
  sourceMetadata: [],
  status: 'source-link-staged',
  binaryStatus: 'not-downloaded',
  inspectionStatus: 'not-inspected',
  importStatus: 'not-imported',
  stagedAt: '2026-04-21T00:00:00.000Z',
  updatedAt: '2026-04-21T00:00:00.000Z',
  ...overrides,
})

const buildEntries = (): PubPartsZipArchiveEntryMetadata[] => [
  {
    archivePath: 'models/source.stl',
    normalizedPath: 'models/source.stl',
    fileName: 'source.stl',
    fileType: 'stl',
    classification: 'supported',
    supportState: 'import-supported',
    description: 'This ZIP entry is a supported source file candidate.',
    fileSizeBytes: 1234,
    compressedSizeBytes: 789,
    lastModifiedAt: '2026-04-21T00:00:00.000Z',
    isDirectory: false,
    selectable: true,
  },
  {
    archivePath: 'models/source.step',
    normalizedPath: 'models/source.step',
    fileName: 'source.step',
    fileType: 'step',
    classification: 'supported',
    supportState: 'import-supported',
    description: 'This ZIP entry is a supported source file candidate.',
    fileSizeBytes: 2345,
    isDirectory: false,
    selectable: true,
  },
  {
    archivePath: 'docs/readme.pdf',
    normalizedPath: 'docs/readme.pdf',
    fileName: 'readme.pdf',
    fileType: 'pdf',
    classification: 'unsupported',
    supportState: 'unsupported',
    description: 'This ZIP entry is not supported by the current Catalog-to-Import path.',
    fileSizeBytes: 4321,
    isDirectory: false,
    selectable: false,
  },
  {
    archivePath: 'huge/source.stl',
    normalizedPath: 'huge/source.stl',
    fileName: 'source.stl',
    fileType: 'stl',
    classification: 'blocked',
    supportState: 'import-supported',
    blockedReason: 'oversized',
    description: 'This ZIP entry is larger than the current safe extraction limit.',
    fileSizeBytes: 123456789,
    isDirectory: false,
    selectable: false,
  },
]

const buildMaterializationDecision = (
  stagedRecord: PubPartsStagedSourceRecord,
  status: Parameters<typeof resolvePubPartsSourceMaterializationDecision>[0]['status'],
) =>
  resolvePubPartsSourceMaterializationDecision({
    identity: buildPubPartsSourceMaterializationIdentity(stagedRecord),
    freshness: buildPubPartsSourceMaterializationFreshness(stagedRecord, {
      byteSize: 98765,
      materializedAt: '2026-04-21T01:00:00.000Z',
    }),
    status,
  })

const buildInternalLibraryManifest = (
  stagedRecord = buildStagedRecord(),
  overrides: Partial<PubPartsInternalLibraryManifest> = {},
): PubPartsInternalLibraryManifest => ({
  schemaVersion: 1,
  providerId: 'pubparts',
  providerName: 'PubParts',
  catalogItemId: stagedRecord.catalogItemId,
  catalogItemLabel: stagedRecord.catalogItemLabel,
  itemSlug: 'sample-pubparts-item-external-pubparts-sample',
  sourceCandidateUrl: stagedRecord.sourceCandidateUrl,
  linkedArchiveUrl: stagedRecord.linkedArchiveUrl,
  sourcePageUrl: stagedRecord.sourcePageUrl,
  sourceUrl: stagedRecord.sourceUrl,
  sourceVersionKey: stagedRecord.archiveLastUpdated ?? 'source-v1',
  sourceVersionKind: 'archiveLastUpdated',
  sourceLastUpdated: stagedRecord.sourceLastUpdated,
  archiveLastUpdated: stagedRecord.archiveLastUpdated,
  sourceFileName: 'model_files.zip',
  sourceByteSize: 98765,
  inspectionStatus: 'metadata-inspected',
  extractedCandidates: [],
  importStatus: 'not-imported',
  createdAt: '2026-04-21T00:00:00.000Z',
  updatedAt: '2026-04-21T01:00:00.000Z',
  ...overrides,
})

const buildInternalLibraryArchiveInspection = (
  stagedRecord = buildStagedRecord(),
  entries = buildEntries(),
): PubPartsInternalLibraryArchiveInspectionManifest => ({
  schemaVersion: 1,
  providerId: 'pubparts',
  stagedSourceId: stagedRecord.stagedSourceId,
  catalogItemId: stagedRecord.catalogItemId,
  sourceCandidateUrl: stagedRecord.sourceCandidateUrl,
  sourceVersionKey: stagedRecord.archiveLastUpdated ?? 'source-v1',
  inspectedAt: '2026-04-21T01:00:00.000Z',
  entries,
})

const buildArchiveManifestRecord = (
  stagedRecord = buildStagedRecord(),
  entries = buildEntries(),
): PubPartsArchiveManifestCacheRecord => ({
  schemaVersion: 1,
  providerId: 'pubparts',
  catalogItemId: stagedRecord.catalogItemId,
  catalogItemLabel: stagedRecord.catalogItemLabel,
  sourceCandidateUrl: stagedRecord.sourceCandidateUrl,
  linkedArchiveUrl: stagedRecord.linkedArchiveUrl,
  sourcePageUrl: stagedRecord.sourcePageUrl,
  sourceUrl: stagedRecord.sourceUrl,
  sourceVersion: stagedRecord.archiveLastUpdated ?? stagedRecord.sourceLastUpdated ?? 'source-v1',
  sourceVersionKind: stagedRecord.archiveLastUpdated === undefined ? 'sourceLastUpdated' : 'archiveLastUpdated',
  archiveLastUpdated: stagedRecord.archiveLastUpdated,
  sourceLastUpdated: stagedRecord.sourceLastUpdated,
  inspectedAt: '2026-04-21T00:30:00.000Z',
  entries,
})

const providerConfigured: PubPartsTrustedSourceProviderCapabilityRead = {
  status: 'configured',
  configured: true,
  label: 'Fixture Provider',
  description: 'Fixture provider is configured.',
}

describe('pubPartsSourceLibraryMetadataIndex', () => {
  it('builds cached Internal Library metadata with inspected, previewable, and importable reads', () => {
    const stagedRecord = buildStagedRecord()
    const record = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord,
      indexedAt,
      materializationDecision: buildMaterializationDecision(
        stagedRecord,
        'internal-library-cache-hit',
      ),
      providerCapability: providerConfigured,
      internalLibrary: {
        manifest: buildInternalLibraryManifest(stagedRecord),
        archiveInspection: buildInternalLibraryArchiveInspection(stagedRecord),
        paths: {
          manifestPath: 'Internal Library/PubParts/parts/sample/pubparts-source.json',
          archiveFilePath: 'Internal Library/PubParts/parts/sample/archives/source.zip',
          archiveManifestPath:
            'Internal Library/PubParts/parts/sample/inspections/archive-manifest.json',
        },
      },
    })

    expect(record.archive).toMatchObject({
      source: 'internal-library',
      inspected: true,
      entryCount: 4,
      supportedEntryCount: 2,
      previewableEntryCount: 2,
      importableEntryCount: 2,
      blockedEntryCount: 1,
      stale: false,
    })
    expect(record.storage.internalLibrary).toMatchObject({
      state: 'cached',
      archivePath: 'Internal Library/PubParts/parts/sample/archives/source.zip',
      byteSize: 98765,
    })
    expect(record.reads).toMatchObject({
      cached: true,
      inspected: true,
      previewable: true,
      importable: true,
      stale: false,
      blocked: true,
      uploadFallbackAvailable: false,
      providerConfigured: true,
    })
    expect(record.materialization.byteOrigin).toBe('internal-library-cache')
    expect(record.entries.filter((entry) => entry.importable)).toHaveLength(2)
  })

  it('maps metadata-only manifest cache as inspected without claiming cached bytes', () => {
    const stagedRecord = buildStagedRecord()
    const record = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord: {
        ...stagedRecord,
        inspectionStatus: 'metadata-inspected',
      },
      indexedAt,
      archiveManifestRecord: buildArchiveManifestRecord(stagedRecord),
    })

    expect(record.archive.source).toBe('metadata-cache')
    expect(record.archive.inspected).toBe(true)
    expect(record.storage.internalLibrary.state).toBe('not-cached')
    expect(record.reads.cached).toBe(false)
    expect(record.reads.inspected).toBe(true)
    expect(record.reads.importable).toBe(true)
    expect(record.materialization.materialized).toBe(false)
  })

  it('maps Local Library mirror status without turning it into byte ownership', () => {
    const stagedRecord = buildStagedRecord()
    const record = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord,
      indexedAt,
      archiveManifestRecord: buildArchiveManifestRecord(stagedRecord),
      localLibraryMirror: {
        status: 'mirrored',
        mirrored: true,
        archivePath: 'PubParts/parts/sample/archives/2026-04-21/model_files.zip',
        importablePaths: ['PubParts/parts/sample/importable/2026-04-21/source.stl'],
        mirroredAt: '2026-04-21T02:00:00.000Z',
      },
    })
    const serializedRecord = JSON.stringify(record)

    expect(record.storage.localLibraryMirror).toEqual({
      status: 'mirrored',
      mirrored: true,
      archivePath: 'PubParts/parts/sample/archives/2026-04-21/model_files.zip',
      importablePaths: ['PubParts/parts/sample/importable/2026-04-21/source.stl'],
      updatedAt: '2026-04-21T02:00:00.000Z',
    })
    expect(record.reads.mirrored).toBe(true)
    expect(serializedRecord).not.toMatch(
      /Blob|File|ArrayBuffer|Uint8Array|objectUrl|directoryHandle|fileHandle|archiveBlob/u,
    )
  })

  it('marks stale archive metadata when the current source version changes', () => {
    const currentRecord = buildStagedRecord({ archiveLastUpdated: '2026-04-22' })
    const staleManifest = buildInternalLibraryManifest(buildStagedRecord(), {
      archiveLastUpdated: '2026-04-21',
      sourceVersionKey: '2026-04-21',
    })
    const record = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord: currentRecord,
      indexedAt,
      materializationDecision: buildMaterializationDecision(currentRecord, 'browser-fetch-readable'),
      internalLibrary: {
        manifest: staleManifest,
        archiveInspection: buildInternalLibraryArchiveInspection(buildStagedRecord()),
      },
    })

    expect(record.freshness.sourceVersionKey).toBe('2026-04-22')
    expect(record.archive.stale).toBe(true)
    expect(record.storage.internalLibrary.state).toBe('stale')
    expect(record.reads.cached).toBe(false)
    expect(record.reads.stale).toBe(true)
  })

  it('maps blocked provider/browser decisions to truthful fallback reads', () => {
    const stagedRecord = buildStagedRecord()
    const blockedDecision = resolvePubPartsSourceMaterializationDecision({
      identity: buildPubPartsSourceMaterializationIdentity(stagedRecord),
      freshness: buildPubPartsSourceMaterializationFreshness(stagedRecord),
      status: 'provider-blocked',
      reason: 'Fixture provider refused this source.',
    })
    const record = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord,
      indexedAt,
      materializationDecision: blockedDecision,
      providerCapability: providerConfigured,
    })

    expect(record.materialization).toMatchObject({
      status: 'provider-blocked',
      materialized: false,
      providerState: 'blocked',
      reason: 'Fixture provider refused this source.',
    })
    expect(record.reads).toMatchObject({
      blocked: true,
      uploadFallbackAvailable: true,
      browserFetchAttemptable: true,
      providerBlocked: true,
    })
    expect(record.archive.source).toBe('none')
  })

  it('queries by catalog item, source version, reads, provider state, and id', () => {
    const cachedStagedRecord = buildStagedRecord()
    const cachedRecord = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord: cachedStagedRecord,
      indexedAt,
      materializationDecision: buildMaterializationDecision(
        cachedStagedRecord,
        'provider-materialized',
      ),
      providerCapability: providerConfigured,
      archiveInspection: {
        source: 'trusted-provider',
        inspectedAt: '2026-04-21T01:00:00.000Z',
        entries: buildEntries(),
      },
      localLibraryMirror: {
        status: 'mirrored',
        mirrored: true,
      },
    })
    const blockedStagedRecord = buildStagedRecord({
      stagedSourceId: 'pubparts:external:pubparts:other',
      catalogItemId: 'external:pubparts:other',
      catalogItemLabel: 'Other PubParts Item',
      sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/other.zip?dl=0',
      linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/source/other.zip?dl=0',
      archiveLastUpdated: '2026-04-22',
    })
    const blockedRecord = buildPubPartsSourceLibraryMetadataRecord({
      stagedRecord: blockedStagedRecord,
      indexedAt,
      materializationDecision: resolvePubPartsSourceMaterializationDecision({
        identity: buildPubPartsSourceMaterializationIdentity(blockedStagedRecord),
        freshness: buildPubPartsSourceMaterializationFreshness(blockedStagedRecord),
        status: 'browser-fetch-blocked',
        reason: 'Browser fetch failed.',
      }),
    })
    const index = createPubPartsSourceLibraryMetadataIndex([cachedRecord, blockedRecord])

    expect(getPubPartsSourceLibraryMetadataRecordsByCatalogItemId(index, cachedRecord.identity.catalogItemId)).toEqual([
      cachedRecord,
    ])
    expect(
      getPubPartsSourceLibraryMetadataRecordsBySourceVersion(index, '2026-04-21'),
    ).toEqual([cachedRecord])
    expect(findPubPartsSourceLibraryMetadataRecordById(index, cachedRecord.recordId)).toBe(
      cachedRecord,
    )
    expect(queryPubPartsSourceLibraryMetadataIndex(index, { read: 'previewable' })).toEqual([
      cachedRecord,
    ])
    expect(queryPubPartsSourceLibraryMetadataIndex(index, { read: 'blocked' })).toEqual([
      cachedRecord,
      blockedRecord,
    ])
    expect(
      queryPubPartsSourceLibraryMetadataIndex(index, {
        providerState: 'materialized',
      }),
    ).toEqual([cachedRecord])
    expect(
      queryPubPartsSourceLibraryMetadataIndex(index, {
        catalogItemId: blockedRecord.identity.catalogItemId,
        read: 'uploadFallbackAvailable',
      }),
    ).toEqual([blockedRecord])
  })
})

