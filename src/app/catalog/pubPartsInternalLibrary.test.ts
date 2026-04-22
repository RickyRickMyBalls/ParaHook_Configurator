import { describe, expect, it } from 'vitest'
import {
  buildPubPartsInternalLibraryManifest,
  pubPartsInternalLibraryRootPath,
  readPubPartsInternalLibraryArchiveCache,
  resolvePubPartsInternalLibraryCapability,
  resolvePubPartsInternalLibraryItemPaths,
  sanitizePubPartsInternalLibraryManifest,
  writePubPartsInternalLibraryArchiveCache,
  writePubPartsInternalLibraryExtractedCandidate,
  type PubPartsInternalLibraryDirectoryHandleLike,
  type PubPartsInternalLibraryFileHandleLike,
  type PubPartsInternalLibraryStorageManager,
  type PubPartsInternalLibraryWritableFileLike,
} from './pubPartsInternalLibrary'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import type { PubPartsZipArchiveEntryMetadata } from './pubPartsZipArchive'

class FakeOpfsFileHandle implements PubPartsInternalLibraryFileHandleLike {
  private blob = new Blob([])

  async getFile(): Promise<Blob> {
    return this.blob
  }

  async createWritable(): Promise<PubPartsInternalLibraryWritableFileLike> {
    const chunks: BlobPart[] = []
    return {
      write: (data) => {
        chunks.push(data as BlobPart)
      },
      close: () => {
        this.blob = new Blob(chunks)
      },
    }
  }
}

class FakeOpfsDirectoryHandle implements PubPartsInternalLibraryDirectoryHandleLike {
  private readonly directories = new Map<string, FakeOpfsDirectoryHandle>()
  private readonly files = new Map<string, FakeOpfsFileHandle>()

  async getDirectoryHandle(
    name: string,
    options: { create?: boolean } = {},
  ): Promise<PubPartsInternalLibraryDirectoryHandleLike> {
    const existingDirectory = this.directories.get(name)
    if (existingDirectory !== undefined) {
      return existingDirectory
    }
    if (options.create !== true) {
      throw new Error(`Missing directory: ${name}`)
    }

    const nextDirectory = new FakeOpfsDirectoryHandle()
    this.directories.set(name, nextDirectory)
    return nextDirectory
  }

  async getFileHandle(
    name: string,
    options: { create?: boolean } = {},
  ): Promise<PubPartsInternalLibraryFileHandleLike> {
    const existingFile = this.files.get(name)
    if (existingFile !== undefined) {
      return existingFile
    }
    if (options.create !== true) {
      throw new Error(`Missing file: ${name}`)
    }

    const nextFile = new FakeOpfsFileHandle()
    this.files.set(name, nextFile)
    return nextFile
  }

  async readText(path: string): Promise<string | null> {
    const blob = await this.readBlob(path)
    return blob === null ? null : blob.text()
  }

  async readBlob(path: string): Promise<Blob | null> {
    const segments = path.split('/').filter((segment) => segment.length > 0)
    const fileName = segments.at(-1)
    if (fileName === undefined) {
      return null
    }

    let directory: FakeOpfsDirectoryHandle = this
    for (const segment of segments.slice(0, -1)) {
      const nextDirectory = directory.directories.get(segment)
      if (nextDirectory === undefined) {
        return null
      }
      directory = nextDirectory
    }

    return (await directory.files.get(fileName)?.getFile()) ?? null
  }
}

const buildStagedRecord = (
  overrides: Partial<PubPartsStagedSourceRecord> = {},
): PubPartsStagedSourceRecord => ({
  stagedSourceId: 'pubparts:external:pubparts:gripple-body',
  catalogItemId: 'external:pubparts:gripple-body',
  catalogItemLabel: 'Gripple Body',
  providerId: 'pubparts',
  providerName: 'PubParts',
  sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
  linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
  sourcePageUrl: 'https://pubparts.xyz/parts/gripple-body',
  sourceUrl: 'https://pubparts.xyz/parts/gripple-body',
  archiveLastUpdated: '2024-08-28',
  sourceMetadata: [],
  status: 'source-link-staged',
  binaryStatus: 'not-downloaded',
  inspectionStatus: 'not-inspected',
  importStatus: 'not-imported',
  stagedAt: '2026-04-21T14:31:37.000Z',
  updatedAt: '2026-04-21T14:31:37.000Z',
  ...overrides,
})

const archiveEntries: PubPartsZipArchiveEntryMetadata[] = [
  {
    archivePath: 'models/gripple_body.stl',
    normalizedPath: 'models/gripple_body.stl',
    fileName: 'gripple_body.stl',
    fileType: 'stl',
    classification: 'supported',
    supportState: 'import-supported',
    description: 'Supported STL model.',
    fileSizeBytes: 4096,
    compressedSizeBytes: 2048,
    isDirectory: false,
    selectable: true,
  },
]

describe('pubPartsInternalLibrary', () => {
  it('reports OPFS internal library capability as available with origin usage and quota', async () => {
    const storageManager: PubPartsInternalLibraryStorageManager = {
      getDirectory: async () => new FakeOpfsDirectoryHandle(),
      estimate: async () => ({
        usage: 4096,
        quota: 16384,
      }),
    }

    await expect(resolvePubPartsInternalLibraryCapability({ storageManager })).resolves.toEqual({
      state: 'available',
      rootPath: pubPartsInternalLibraryRootPath,
      usageBytes: 4096,
      quotaBytes: 16384,
      message: 'OPFS Internal Library is available: 4.0 KiB used of 16.0 KiB.',
    })
  })

  it('reports OPFS internal library capability as unsupported when getDirectory is missing', async () => {
    await expect(
      resolvePubPartsInternalLibraryCapability({
        storageManager: {
          estimate: async () => ({
            usage: 4096,
            quota: 16384,
          }),
        },
      }),
    ).resolves.toEqual({
      state: 'unsupported',
      rootPath: pubPartsInternalLibraryRootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library is unavailable in this browser.',
    })
  })

  it('reports OPFS internal library capability as quota-unavailable when estimate data is missing', async () => {
    await expect(
      resolvePubPartsInternalLibraryCapability({
        storageManager: {
          getDirectory: async () => new FakeOpfsDirectoryHandle(),
          estimate: async () => ({}),
        },
      }),
    ).resolves.toEqual({
      state: 'quota-unavailable',
      rootPath: pubPartsInternalLibraryRootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library is available, but browser quota is unavailable.',
    })
  })

  it('reports OPFS internal library capability as unavailable when the OPFS root cannot open', async () => {
    await expect(
      resolvePubPartsInternalLibraryCapability({
        storageManager: {
          getDirectory: async () => {
            throw new Error('blocked')
          },
          estimate: async () => ({
            usage: 4096,
            quota: 16384,
          }),
        },
      }),
    ).resolves.toEqual({
      state: 'unavailable',
      rootPath: pubPartsInternalLibraryRootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library could not be opened right now.',
    })
  })

  it('reports OPFS internal library capability as error when the quota check fails', async () => {
    await expect(
      resolvePubPartsInternalLibraryCapability({
        storageManager: {
          getDirectory: async () => new FakeOpfsDirectoryHandle(),
          estimate: async () => {
            throw new Error('estimate failed')
          },
        },
      }),
    ).resolves.toEqual({
      state: 'error',
      rootPath: pubPartsInternalLibraryRootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library quota check failed.',
    })
  })

  it('resolves deterministic PubParts internal library paths for source, archive, inspection, extracted, and importable files', () => {
    const paths = resolvePubPartsInternalLibraryItemPaths({
      catalogItemId: 'external:pubparts:gripple-body',
      catalogItemLabel: 'Gripple Body',
      archiveLastUpdated: '2024-08-28',
      sourceFileName: 'Model Files.zip',
      archiveFileName: 'PubParts Source.zip',
      extractedArchivePath: 'models/Gripple Body.stl',
      importableFileName: 'Gripple Body.stl',
    })

    expect(paths).toEqual({
      rootPath: pubPartsInternalLibraryRootPath,
      partsRootPath: 'Internal Library/PubParts/parts',
      itemSlug: 'gripple-body-external-pubparts-gripple-body',
      sourceVersionKey: '2024-08-28',
      sourceVersionKind: 'archiveLastUpdated',
      itemFolderPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body',
      manifestPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/pubparts-source.json',
      sourceFolderPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/source/2024-08-28',
      sourceFilePath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/source/2024-08-28/model-files.zip',
      archiveFolderPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/archives/2024-08-28',
      archiveFilePath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/archives/2024-08-28/pubparts-source.zip',
      inspectionsFolderPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/inspections/2024-08-28',
      archiveManifestPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/inspections/2024-08-28/archive-manifest.json',
      extractedFolderPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/extracted/2024-08-28',
      extractedEntryPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/extracted/2024-08-28/models/gripple-body.stl',
      importableFolderPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/importable/2024-08-28',
      importableFilePath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/importable/2024-08-28/gripple-body.stl',
    })
  })

  it('builds and sanitizes PubParts internal library manifests without Blob File objectUrl or imported-reference ownership', () => {
    const paths = resolvePubPartsInternalLibraryItemPaths({
      catalogItemId: 'external:pubparts:gripple-body',
      catalogItemLabel: 'Gripple Body',
      archiveLastUpdated: '2024-08-28',
      extractedArchivePath: 'models/gripple_body.stl',
      importableFileName: 'gripple_body.stl',
    })
    const manifest = buildPubPartsInternalLibraryManifest({
      catalogItemId: 'external:pubparts:gripple-body',
      catalogItemLabel: 'Gripple Body',
      sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
      linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
      sourcePageUrl: 'https://pubparts.xyz/parts/gripple-body',
      sourceUrl: 'https://pubparts.xyz/parts/gripple-body',
      archiveLastUpdated: '2024-08-28',
      sourceFileName: 'source.zip',
      sourceByteSize: 123456,
      inspectionStatus: 'extracted-candidates',
      extractedCandidates: [
        {
          archivePath: 'models/gripple_body.stl',
          normalizedPath: 'models/gripple_body.stl',
          fileName: 'gripple_body.stl',
          fileType: 'stl',
          fileSizeBytes: 4096,
          extractedPath: paths.extractedEntryPath,
          importablePath: paths.importableFilePath,
        },
      ],
      importStatus: 'ready-for-import-review',
      now: () => new Date('2026-04-21T14:30:00.000Z'),
    })

    expect(manifest).toEqual({
      schemaVersion: 1,
      providerId: 'pubparts',
      providerName: 'PubParts',
      catalogItemId: 'external:pubparts:gripple-body',
      catalogItemLabel: 'Gripple Body',
      itemSlug: 'gripple-body-external-pubparts-gripple-body',
      sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
      linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
      sourcePageUrl: 'https://pubparts.xyz/parts/gripple-body',
      sourceUrl: 'https://pubparts.xyz/parts/gripple-body',
      sourceVersionKey: '2024-08-28',
      sourceVersionKind: 'archiveLastUpdated',
      archiveLastUpdated: '2024-08-28',
      sourceFileName: 'source.zip',
      sourceByteSize: 123456,
      inspectionStatus: 'extracted-candidates',
      extractedCandidates: [
        {
          archivePath: 'models/gripple_body.stl',
          normalizedPath: 'models/gripple_body.stl',
          fileName: 'gripple_body.stl',
          fileType: 'stl',
          fileSizeBytes: 4096,
          extractedPath:
            'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/extracted/2024-08-28/models/gripple_body.stl',
          importablePath:
            'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/importable/2024-08-28/gripple_body.stl',
        },
      ],
      importStatus: 'ready-for-import-review',
      createdAt: '2026-04-21T14:30:00.000Z',
      updatedAt: '2026-04-21T14:30:00.000Z',
    })

    expect(
      sanitizePubPartsInternalLibraryManifest({
        ...manifest,
        Blob: 'not persisted',
        File: 'not persisted',
        objectUrl: 'blob:example',
        importedReferenceId: 'reference-1',
      }),
    ).toEqual(manifest)
    const serializedManifest = JSON.stringify(manifest)
    expect(serializedManifest).not.toContain('"Blob":')
    expect(serializedManifest).not.toContain('"File":')
    expect(serializedManifest).not.toContain('objectUrl')
    expect(serializedManifest).not.toContain('importedReference')
    expect(sanitizePubPartsInternalLibraryManifest({ ...manifest, providerId: 'other' })).toBeNull()
  })

  it('writes and reads PubParts archive bytes with inspected manifest metadata from OPFS', async () => {
    const rootDirectory = new FakeOpfsDirectoryHandle()
    const storageManager: PubPartsInternalLibraryStorageManager = {
      getDirectory: async () => rootDirectory,
      estimate: async () => ({ usage: 0, quota: 1024 * 1024 }),
    }
    const stagedRecord = buildStagedRecord()
    const archiveBlob = new Blob(['zip bytes'], { type: 'application/zip' })

    const writeResult = await writePubPartsInternalLibraryArchiveCache({
      stagedRecord,
      archiveBlob,
      entries: archiveEntries,
      sourceFileName: 'Model Files.zip',
      createdAt: '2026-04-21T14:31:37.000Z',
      updatedAt: '2026-04-21T14:31:37.000Z',
      env: { storageManager },
    })
    const readResult = await readPubPartsInternalLibraryArchiveCache(stagedRecord, {
      storageManager,
    })

    expect(readResult).toEqual({
      ...writeResult,
      archiveBlob: expect.any(Blob),
    })
    await expect(readResult?.archiveBlob.text()).resolves.toBe('zip bytes')
    await expect(rootDirectory.readText(writeResult.paths.manifestPath)).resolves.toContain(
      '"inspectionStatus": "metadata-inspected"',
    )
    await expect(rootDirectory.readText(writeResult.paths.archiveManifestPath)).resolves.toContain(
      'gripple_body.stl',
    )
  })

  it('returns null for an Internal Library archive cache miss when source freshness changes', async () => {
    const rootDirectory = new FakeOpfsDirectoryHandle()
    const storageManager: PubPartsInternalLibraryStorageManager = {
      getDirectory: async () => rootDirectory,
    }
    const stagedRecord = buildStagedRecord()
    await writePubPartsInternalLibraryArchiveCache({
      stagedRecord,
      archiveBlob: new Blob(['zip bytes'], { type: 'application/zip' }),
      entries: archiveEntries,
      env: { storageManager },
    })

    await expect(
      readPubPartsInternalLibraryArchiveCache(
        buildStagedRecord({ archiveLastUpdated: '2026-04-21' }),
        { storageManager },
      ),
    ).resolves.toBeNull()
  })

  it('reports archive cache writes as unavailable without mutating Catalog behavior when OPFS is unsupported', async () => {
    await expect(
      writePubPartsInternalLibraryArchiveCache({
        stagedRecord: buildStagedRecord(),
        archiveBlob: new Blob(['zip bytes'], { type: 'application/zip' }),
        entries: archiveEntries,
        env: {
          storageManager: {},
        },
      }),
    ).rejects.toThrow('OPFS Internal Library is unavailable in this browser.')
  })

  it('writes extracted supported candidate bytes under the source version path', async () => {
    const rootDirectory = new FakeOpfsDirectoryHandle()
    const storageManager: PubPartsInternalLibraryStorageManager = {
      getDirectory: async () => rootDirectory,
    }
    const stagedRecord = buildStagedRecord()
    await writePubPartsInternalLibraryArchiveCache({
      stagedRecord,
      archiveBlob: new Blob(['zip bytes'], { type: 'application/zip' }),
      entries: archiveEntries,
      env: { storageManager },
    })

    const extractedCandidate = await writePubPartsInternalLibraryExtractedCandidate({
      stagedRecord,
      extractedEntry: {
        archivePath: 'models/gripple_body.stl',
        normalizedPath: 'models/gripple_body.stl',
        fileName: 'gripple_body.stl',
        fileType: 'stl',
        fileSizeBytes: 9,
        blob: new Blob(['stl bytes'], { type: 'model/stl' }),
      },
      env: { storageManager },
    })

    expect(extractedCandidate).toEqual({
      archivePath: 'models/gripple_body.stl',
      normalizedPath: 'models/gripple_body.stl',
      fileName: 'gripple_body.stl',
      fileType: 'stl',
      fileSizeBytes: 9,
      extractedPath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/extracted/2024-08-28/models/gripple_body.stl',
      importablePath:
        'Internal Library/PubParts/parts/gripple-body-external-pubparts-gripple-body/importable/2024-08-28/gripple_body.stl',
    })
    await expect(rootDirectory.readText(extractedCandidate.extractedPath)).resolves.toBe(
      'stl bytes',
    )
    await expect(rootDirectory.readText(extractedCandidate.importablePath)).resolves.toBe(
      'stl bytes',
    )
    const cacheHit = await readPubPartsInternalLibraryArchiveCache(stagedRecord, {
      storageManager,
    })
    expect(cacheHit?.manifest.inspectionStatus).toBe('extracted-candidates')
    expect(cacheHit?.manifest.importStatus).toBe('ready-for-import-review')
    expect(cacheHit?.manifest.extractedCandidates).toEqual([extractedCandidate])
  })
})
