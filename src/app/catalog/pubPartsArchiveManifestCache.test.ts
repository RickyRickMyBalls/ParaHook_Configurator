import { describe, expect, it } from 'vitest'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import {
  clearPubPartsStagedSourceRecords,
  pubPartsDownloadsStorageKey,
} from './pubPartsDownloadsStorage'
import {
  clearPubPartsArchiveManifestCache,
  pubPartsArchiveManifestCacheStorageKey,
  readPubPartsArchiveManifestCache,
  readPubPartsArchiveManifestCacheRecord,
  sanitizePubPartsArchiveManifestCacheState,
  writePubPartsArchiveManifestCacheRecord,
} from './pubPartsArchiveManifestCache'
import type { PubPartsZipArchiveEntryMetadata } from './pubPartsZipArchive'

const createMemoryStorage = (initialValues: Record<string, string> = {}) => {
  const values = { ...initialValues }
  return {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => {
      values[key] = value
    },
    removeItem: (key: string) => {
      delete values[key]
    },
    values,
  }
}

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
  archiveLastUpdated: '2024-11-16',
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
]

describe('pubPartsArchiveManifestCache', () => {
  it('writes and reads metadata-only manifests by item, source URL, and source version', () => {
    const storage = createMemoryStorage()
    const stagedRecord = buildStagedRecord()

    const writtenRecord = writePubPartsArchiveManifestCacheRecord(stagedRecord, buildEntries(), {
      storage,
      inspectedAt: '2026-04-21T00:44:34.000Z',
    })

    expect(writtenRecord).toEqual(
      expect.objectContaining({
        providerId: 'pubparts',
        catalogItemId: 'external:pubparts:sample',
        sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
        sourceVersion: '2024-11-16',
        sourceVersionKind: 'archiveLastUpdated',
        inspectedAt: '2026-04-21T00:44:34.000Z',
      }),
    )
    expect(readPubPartsArchiveManifestCacheRecord(stagedRecord, storage)).toEqual(writtenRecord)
    expect(Object.keys(readPubPartsArchiveManifestCache(storage).recordsByCacheKey)).toEqual([
      expect.stringContaining('2024-11-16'),
    ])

    const serializedCache = storage.values[pubPartsArchiveManifestCacheStorageKey] ?? ''
    expect(serializedCache).toContain('models/source.stl')
    expect(serializedCache).not.toContain('Blob')
    expect(serializedCache).not.toContain('File')
    expect(serializedCache).not.toContain('objectUrl')
    expect(serializedCache).not.toContain('archiveBlob')
    expect(serializedCache).not.toContain('ImportedReferenceFile')
    expect(serializedCache).not.toContain('stl bytes')
    expect(serializedCache).not.toContain('zip bytes')
  })

  it('misses when item id, source URL, or source version changes and skips unversioned records', () => {
    const storage = createMemoryStorage()
    const stagedRecord = buildStagedRecord()

    writePubPartsArchiveManifestCacheRecord(stagedRecord, buildEntries(), { storage })

    expect(
      readPubPartsArchiveManifestCacheRecord(
        buildStagedRecord({ catalogItemId: 'external:pubparts:other' }),
        storage,
      ),
    ).toBeNull()
    expect(
      readPubPartsArchiveManifestCacheRecord(
        buildStagedRecord({
          sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/changed.zip?dl=0',
          linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/source/changed.zip?dl=0',
        }),
        storage,
      ),
    ).toBeNull()
    expect(
      readPubPartsArchiveManifestCacheRecord(
        buildStagedRecord({ archiveLastUpdated: '2026-01-01' }),
        storage,
      ),
    ).toBeNull()
    expect(
      writePubPartsArchiveManifestCacheRecord(
        buildStagedRecord({
          archiveLastUpdated: undefined,
          sourceLastUpdated: undefined,
        }),
        buildEntries(),
        { storage },
      ),
    ).toBeNull()
  })

  it('falls back to sourceLastUpdated only when archiveLastUpdated is missing', () => {
    const storage = createMemoryStorage()
    const stagedRecord = buildStagedRecord({
      archiveLastUpdated: undefined,
      sourceLastUpdated: '2026-04-20',
    })

    const writtenRecord = writePubPartsArchiveManifestCacheRecord(stagedRecord, buildEntries(), {
      storage,
    })

    expect(writtenRecord).toEqual(
      expect.objectContaining({
        sourceVersion: '2026-04-20',
        sourceVersionKind: 'sourceLastUpdated',
      }),
    )
    expect(readPubPartsArchiveManifestCacheRecord(stagedRecord, storage)).toEqual(writtenRecord)
  })

  it('sanitizes malformed cache state and malformed entries as misses', () => {
    expect(sanitizePubPartsArchiveManifestCacheState('not json')).toEqual({
      schemaVersion: 1,
      recordsByCacheKey: {},
    })
    expect(
      sanitizePubPartsArchiveManifestCacheState({
        schemaVersion: 999,
        recordsByCacheKey: {},
      }),
    ).toEqual({
      schemaVersion: 1,
      recordsByCacheKey: {},
    })

    const storage = createMemoryStorage({
      [pubPartsArchiveManifestCacheStorageKey]: JSON.stringify({
        schemaVersion: 1,
        recordsByCacheKey: {
          bad: {
            schemaVersion: 1,
            providerId: 'pubparts',
            catalogItemId: 'external:pubparts:sample',
            catalogItemLabel: 'Sample PubParts Item',
            sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
            linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
            sourceVersion: '2024-11-16',
            sourceVersionKind: 'archiveLastUpdated',
            inspectedAt: '2026-04-21T00:44:34.000Z',
            entries: [
              {
                archivePath: 'models/source.stl',
                normalizedPath: 'models/source.stl',
                fileName: 'source.stl',
                classification: 'surprise',
                supportState: 'import-supported',
                description: 'Injected malformed entry.',
                isDirectory: false,
                selectable: true,
              },
            ],
          },
        },
      }),
    })

    expect(readPubPartsArchiveManifestCache(storage)).toEqual({
      schemaVersion: 1,
      recordsByCacheKey: {},
    })
  })

  it('clears only the manifest cache and is not cleared by staged-source reset controls', () => {
    const storage = createMemoryStorage({
      [pubPartsDownloadsStorageKey]: JSON.stringify({
        schemaVersion: 1,
        library: {
          status: 'not-configured',
        },
        stagedSourcesById: {},
        stagedSourceOrder: [],
        localSourcesByCatalogItemId: {},
        localSourceOrder: [],
      }),
    })
    const stagedRecord = buildStagedRecord()

    writePubPartsArchiveManifestCacheRecord(stagedRecord, buildEntries(), { storage })
    clearPubPartsStagedSourceRecords({ storage })

    expect(storage.values[pubPartsArchiveManifestCacheStorageKey]).toBeDefined()
    clearPubPartsArchiveManifestCache(storage)
    expect(storage.values[pubPartsArchiveManifestCacheStorageKey]).toBeUndefined()
    expect(storage.values[pubPartsDownloadsStorageKey]).toBeDefined()
  })
})
