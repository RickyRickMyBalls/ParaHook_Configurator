import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildPubPartsInternalLibraryManifest,
  type PubPartsInternalLibraryExtractedCandidate,
  type PubPartsInternalLibraryManifest,
} from './pubPartsInternalLibrary'
import {
  choosePubPartsLocalLibraryMirrorRoot,
  clearPubPartsLocalLibraryMirrorSessionRoot,
  getPubPartsLocalLibraryMirrorSessionRoot,
  pubPartsLocalLibraryMirrorSchemaVersion,
  readPubPartsLocalLibraryMirrorCapability,
  readPubPartsLocalLibraryMirrorCandidatePath,
  readPubPartsLocalLibraryMirrorStatus,
  resolvePubPartsLocalLibraryMirrorPlan,
  setPubPartsLocalLibraryMirrorSessionRoot,
  toPubPartsLocalLibraryMirrorStorageConfig,
  writePubPartsLocalLibraryMirrorArchive,
  writePubPartsLocalLibraryMirrorExtractedCandidate,
  writePubPartsLocalLibraryMirrorManifest,
  type PubPartsLocalLibraryMirrorDirectoryHandleLike,
  type PubPartsLocalLibraryMirrorFileHandleLike,
  type PubPartsLocalLibraryMirrorWritableFileLike,
} from './pubPartsLocalLibraryMirror'

class FakeLocalLibraryFileHandle implements PubPartsLocalLibraryMirrorFileHandleLike {
  private blob = new Blob([])

  async createWritable(): Promise<PubPartsLocalLibraryMirrorWritableFileLike> {
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

  async text(): Promise<string> {
    return this.blob.text()
  }
}

class FakeLocalLibraryDirectoryHandle implements PubPartsLocalLibraryMirrorDirectoryHandleLike {
  readonly name: string
  private readonly directories = new Map<string, FakeLocalLibraryDirectoryHandle>()
  private readonly files = new Map<string, FakeLocalLibraryFileHandle>()

  constructor(name = 'ParaHook Local Library') {
    this.name = name
  }

  async getDirectoryHandle(
    name: string,
    options: { create?: boolean } = {},
  ): Promise<PubPartsLocalLibraryMirrorDirectoryHandleLike> {
    const existingDirectory = this.directories.get(name)
    if (existingDirectory !== undefined) {
      return existingDirectory
    }
    if (options.create !== true) {
      throw new Error(`Missing directory: ${name}`)
    }

    const nextDirectory = new FakeLocalLibraryDirectoryHandle(name)
    this.directories.set(name, nextDirectory)
    return nextDirectory
  }

  async getFileHandle(
    name: string,
    options: { create?: boolean } = {},
  ): Promise<PubPartsLocalLibraryMirrorFileHandleLike> {
    const existingFile = this.files.get(name)
    if (existingFile !== undefined) {
      return existingFile
    }
    if (options.create !== true) {
      throw new Error(`Missing file: ${name}`)
    }

    const nextFile = new FakeLocalLibraryFileHandle()
    this.files.set(name, nextFile)
    return nextFile
  }

  async readText(path: string): Promise<string | null> {
    const segments = path.split('/').filter((segment) => segment.length > 0)
    const fileName = segments.at(-1)
    if (fileName === undefined) {
      return null
    }

    let directory: FakeLocalLibraryDirectoryHandle = this
    for (const segment of segments.slice(0, -1)) {
      const nextDirectory = directory.directories.get(segment)
      if (nextDirectory === undefined) {
        return null
      }
      directory = nextDirectory
    }

    return (await directory.files.get(fileName)?.text()) ?? null
  }
}

class FailingLocalLibraryDirectoryHandle implements PubPartsLocalLibraryMirrorDirectoryHandleLike {
  readonly name = 'Read Only Library'

  async getDirectoryHandle(): Promise<PubPartsLocalLibraryMirrorDirectoryHandleLike> {
    throw new Error('permission denied')
  }

  async getFileHandle(): Promise<PubPartsLocalLibraryMirrorFileHandleLike> {
    throw new Error('permission denied')
  }
}

const extractedCandidate: PubPartsInternalLibraryExtractedCandidate = {
  archivePath: 'models/gripple_body.stl',
  normalizedPath: 'models/gripple_body.stl',
  fileName: 'gripple_body.stl',
  fileType: 'stl',
  fileSizeBytes: 9,
  extractedPath:
    'Internal Library/PubParts/parts/gripple-body/extracted/2024-08-28/models/gripple_body.stl',
  importablePath:
    'Internal Library/PubParts/parts/gripple-body/importable/2024-08-28/gripple_body.stl',
}

const buildManifest = (
  overrides: Partial<PubPartsInternalLibraryManifest> = {},
): PubPartsInternalLibraryManifest => ({
  ...buildPubPartsInternalLibraryManifest({
    catalogItemId: 'external:pubparts:gripple-body',
    catalogItemLabel: 'Gripple Body',
    sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
    linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
    sourcePageUrl: 'https://pubparts.xyz/parts/gripple-body',
    sourceUrl: 'https://pubparts.xyz/parts/gripple-body',
    archiveLastUpdated: '2024-08-28',
    sourceFileName: 'Model Files.zip',
    sourceByteSize: 1234,
    inspectionStatus: 'extracted-candidates',
    extractedCandidates: [extractedCandidate],
    importStatus: 'ready-for-import-review',
    now: () => new Date('2026-04-21T15:26:20.000Z'),
  }),
  ...overrides,
})

describe('pubPartsLocalLibraryMirror', () => {
  afterEach(() => {
    clearPubPartsLocalLibraryMirrorSessionRoot()
  })

  it('reports the Local Library mirror as unsupported when no directory picker exists', () => {
    expect(readPubPartsLocalLibraryMirrorCapability({})).toEqual({
      status: 'unsupported',
      rootLabel: 'Choose a PubParts Library folder',
      rootFolderPath: 'PubParts',
      message: 'Local Library folder mirroring is unavailable in this browser.',
    })
  })

  it('opens the Local Library folder picker only through an explicit choose call', async () => {
    const directoryHandle = new FakeLocalLibraryDirectoryHandle('My PubParts Library')
    const showDirectoryPicker = vi.fn(async () => directoryHandle)

    expect(readPubPartsLocalLibraryMirrorCapability({ showDirectoryPicker })).toEqual({
      status: 'not-configured',
      rootLabel: 'Choose a PubParts Library folder',
      rootFolderPath: 'PubParts',
      message: 'Choose a Local Library folder to mirror PubParts files into a visible folder.',
    })
    expect(showDirectoryPicker).not.toHaveBeenCalled()

    await expect(
      choosePubPartsLocalLibraryMirrorRoot({ showDirectoryPicker }),
    ).resolves.toMatchObject({
      status: 'enabled',
      directoryHandle,
      rootLabel: 'My PubParts Library',
      rootFolderPath: 'PubParts',
      message: 'Local Library mirror folder is connected for this browser session.',
    })
    expect(showDirectoryPicker).toHaveBeenCalledTimes(1)
    expect(showDirectoryPicker).toHaveBeenCalledWith({ mode: 'readwrite' })
  })

  it('builds deterministic PubParts mirror paths from a staged source manifest', () => {
    const manifest = buildManifest()
    expect(resolvePubPartsLocalLibraryMirrorPlan(buildManifest())).toEqual({
      schemaVersion: pubPartsLocalLibraryMirrorSchemaVersion,
      rootFolderPath: 'PubParts',
      catalogItemId: 'external:pubparts:gripple-body',
      catalogItemLabel: 'Gripple Body',
      itemSlug: 'gripple-body-external-pubparts-gripple-body',
      sourceVersionKey: '2024-08-28',
      itemFolderPath: 'PubParts/parts/gripple-body-external-pubparts-gripple-body',
      manifestPath:
        'PubParts/parts/gripple-body-external-pubparts-gripple-body/pubparts-source.json',
      archivePath:
        'PubParts/parts/gripple-body-external-pubparts-gripple-body/archives/2024-08-28/model-files.zip',
      extractedPaths: [
        {
          archivePath: 'models/gripple_body.stl',
          normalizedPath: 'models/gripple_body.stl',
          fileName: 'gripple_body.stl',
          extractedPath:
            'PubParts/parts/gripple-body-external-pubparts-gripple-body/extracted/2024-08-28/models/gripple_body.stl',
          importablePath:
            'PubParts/parts/gripple-body-external-pubparts-gripple-body/importable/2024-08-28/gripple_body.stl',
        },
      ],
      importablePaths: [
        {
          archivePath: 'models/gripple_body.stl',
          normalizedPath: 'models/gripple_body.stl',
          fileName: 'gripple_body.stl',
          extractedPath:
            'PubParts/parts/gripple-body-external-pubparts-gripple-body/extracted/2024-08-28/models/gripple_body.stl',
          importablePath:
            'PubParts/parts/gripple-body-external-pubparts-gripple-body/importable/2024-08-28/gripple_body.stl',
        },
      ],
    })
    expect(readPubPartsLocalLibraryMirrorCandidatePath(manifest, extractedCandidate)).toEqual(
      resolvePubPartsLocalLibraryMirrorPlan(manifest).extractedPaths[0],
    )
  })

  it('rejects unsafe mirror path segments before writing to the selected folder', () => {
    const manifest = buildManifest({
      extractedCandidates: [
        {
          ...extractedCandidate,
          normalizedPath: '../secret.stl',
        },
      ],
    })

    expect(() => resolvePubPartsLocalLibraryMirrorPlan(manifest)).toThrow(
      'Local Library mirror path contains unsafe path segments.',
    )
  })

  it('writes manifest and archive bytes only under the selected Local Library root', async () => {
    const rootDirectory = new FakeLocalLibraryDirectoryHandle()
    const manifest = buildManifest()
    const plan = resolvePubPartsLocalLibraryMirrorPlan(manifest)

    await expect(
      writePubPartsLocalLibraryMirrorManifest(rootDirectory, manifest),
    ).resolves.toEqual({
      status: 'mirrored',
      path: plan.manifestPath,
      message: 'PubParts source manifest mirrored into the Local Library folder.',
    })
    await expect(
      writePubPartsLocalLibraryMirrorArchive(
        rootDirectory,
        plan,
        new Blob(['zip bytes'], { type: 'application/zip' }),
      ),
    ).resolves.toEqual({
      status: 'mirrored',
      path: plan.archivePath,
      message: 'PubParts source archive mirrored into the Local Library folder.',
    })

    await expect(rootDirectory.readText(plan.manifestPath)).resolves.toContain(
      '"providerId": "pubparts"',
    )
    await expect(rootDirectory.readText(plan.archivePath)).resolves.toBe('zip bytes')
    await expect(rootDirectory.readText('outside.txt')).resolves.toBeNull()
  })

  it('writes extracted supported candidates without changing Internal Library cache truth', async () => {
    const rootDirectory = new FakeLocalLibraryDirectoryHandle()
    const manifest = buildManifest()
    const plan = resolvePubPartsLocalLibraryMirrorPlan(manifest)
    const candidatePath = plan.extractedPaths[0]

    expect(candidatePath).toBeDefined()
    await expect(
      writePubPartsLocalLibraryMirrorExtractedCandidate(
        rootDirectory,
        candidatePath,
        new Blob(['stl bytes'], { type: 'model/stl' }),
      ),
    ).resolves.toEqual({
      status: 'mirrored',
      path: candidatePath.importablePath,
      message: 'PubParts extracted candidate mirrored into the Local Library folder.',
    })

    await expect(rootDirectory.readText(candidatePath.extractedPath)).resolves.toBe('stl bytes')
    await expect(rootDirectory.readText(candidatePath.importablePath)).resolves.toBe('stl bytes')
    expect(manifest.extractedCandidates).toEqual([extractedCandidate])
  })

  it('returns a nonblocking error result when a mirror write fails', async () => {
    const rootDirectory = new FailingLocalLibraryDirectoryHandle()
    const manifest = buildManifest()
    const plan = resolvePubPartsLocalLibraryMirrorPlan(manifest)

    await expect(
      writePubPartsLocalLibraryMirrorArchive(
        rootDirectory,
        plan,
        new Blob(['zip bytes'], { type: 'application/zip' }),
      ),
    ).resolves.toEqual({
      status: 'error',
      path: plan.archivePath,
      message: 'PubParts source archive could not be mirrored into the Local Library folder.',
    })
  })

  it('maps mirror reads into serializable Local Library storage config without handles or blobs', () => {
    const config = toPubPartsLocalLibraryMirrorStorageConfig(
      {
        status: 'error',
        rootLabel: 'My PubParts Library',
        rootFolderPath: 'PubParts',
        message: 'Local Library folder selection failed.',
      },
      {
        now: () => new Date('2026-04-21T15:26:20.000Z'),
      },
    )

    expect(config).toEqual({
      status: 'unavailable',
      rootLabel: 'My PubParts Library',
      rootFolderPath: 'PubParts',
      updatedAt: '2026-04-21T15:26:20.000Z',
    })
    const serializedConfig = JSON.stringify(config)
    expect(serializedConfig).not.toContain('FileSystemDirectoryHandle')
    expect(serializedConfig).not.toContain('Blob')
    expect(serializedConfig).not.toContain('File')
    expect(serializedConfig).not.toContain('objectUrl')
    expect(serializedConfig).not.toContain('importedReference')
  })

  it('keeps the selected Local Library folder handle in runtime session state only', async () => {
    const directoryHandle = new FakeLocalLibraryDirectoryHandle('Session Library')
    const chooseResult = await choosePubPartsLocalLibraryMirrorRoot({
      showDirectoryPicker: vi.fn(async () => directoryHandle),
    })

    expect(chooseResult.status).toBe('enabled')
    if (chooseResult.status !== 'enabled') {
      throw new Error('Expected enabled choose result')
    }

    setPubPartsLocalLibraryMirrorSessionRoot(chooseResult)

    expect(getPubPartsLocalLibraryMirrorSessionRoot()).toMatchObject({
      directoryHandle,
      read: {
        status: 'enabled',
        rootLabel: 'Session Library',
        rootFolderPath: 'PubParts',
      },
    })
    const serializedConfig = JSON.stringify(toPubPartsLocalLibraryMirrorStorageConfig(chooseResult))
    expect(serializedConfig).toContain('"status":"enabled"')
    expect(serializedConfig).not.toContain('directoryHandle')
    expect(serializedConfig).not.toContain('Session Library","getDirectoryHandle')
  })

  it('reports reconnect-needed when stored config is enabled but no session handle exists', () => {
    expect(
      readPubPartsLocalLibraryMirrorStatus(
        {
          status: 'enabled',
          rootLabel: 'Previous Library',
          rootFolderPath: 'PubParts',
          updatedAt: '2026-04-21T15:26:20.000Z',
        },
        {
          showDirectoryPicker: vi.fn(),
        },
      ),
    ).toEqual({
      status: 'permission-needed',
      rootLabel: 'Previous Library',
      rootFolderPath: 'PubParts',
      message: 'Reconnect the Local Library folder before ParaHook can mirror visible files.',
    })
  })

  it('reads connected status from the runtime handle when serialized config is enabled', async () => {
    const directoryHandle = new FakeLocalLibraryDirectoryHandle('Connected Library')
    const chooseResult = await choosePubPartsLocalLibraryMirrorRoot({
      showDirectoryPicker: vi.fn(async () => directoryHandle),
    })
    if (chooseResult.status !== 'enabled') {
      throw new Error('Expected enabled choose result')
    }
    setPubPartsLocalLibraryMirrorSessionRoot(chooseResult)

    expect(
      readPubPartsLocalLibraryMirrorStatus(
        {
          status: 'enabled',
          rootLabel: 'Previous Library',
          rootFolderPath: 'PubParts',
          updatedAt: '2026-04-21T15:26:20.000Z',
        },
        {
          showDirectoryPicker: vi.fn(),
        },
      ),
    ).toEqual({
      status: 'enabled',
      rootLabel: 'Connected Library',
      rootFolderPath: 'PubParts',
      message: 'Local Library mirror folder is connected for this browser session.',
    })
  })
})
