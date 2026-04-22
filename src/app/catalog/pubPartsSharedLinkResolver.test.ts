// @vitest-environment jsdom

import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchPubPartsSharedLinkCandidateFile,
  inspectPubPartsSharedLinkArchive,
  inspectPubPartsSharedLinkArchiveCandidates,
  mapPubPartsZipArchiveEntriesToSharedLinkCandidates,
  materializePubPartsSharedLinkArchiveCandidateFiles,
  PubPartsSharedLinkArchiveExtractionError,
  PubPartsSharedLinkArchiveInspectionError,
  resolvePubPartsSharedLinkCandidates,
} from './pubPartsSharedLinkResolver'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'

const buildStagedRecord = (sourceCandidateUrl: string): PubPartsStagedSourceRecord => ({
  stagedSourceId: 'pubparts:sample',
  catalogItemId: 'sample',
  catalogItemLabel: 'Sample PubParts Item',
  providerId: 'pubparts',
  providerName: 'PubParts',
  sourceCandidateUrl,
  linkedArchiveUrl: sourceCandidateUrl,
  sourceMetadata: [],
  status: 'source-link-staged',
  binaryStatus: 'not-downloaded',
  inspectionStatus: 'not-inspected',
  importStatus: 'not-imported',
  stagedAt: '2026-04-20T23:26:39.000Z',
  updatedAt: '2026-04-20T23:26:39.000Z',
})

type FixtureZipEntry = {
  path: string
  content?: string
  directory?: boolean
}

const createFixtureZipBlob = async (entries: FixtureZipEntry[]): Promise<Blob> => {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'))
  try {
    for (const entry of entries) {
      await zipWriter.add(
        entry.path,
        entry.directory === true ? undefined : new TextReader(entry.content ?? 'fixture'),
        {
          directory: entry.directory,
          lastModDate: new Date('2026-04-21T00:00:00.000Z'),
        },
      )
    }
    return await zipWriter.close()
  } catch (error) {
    await zipWriter.close().catch(() => undefined)
    throw error
  }
}

describe('pubPartsSharedLinkResolver', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves a Dropbox shared direct model file into a stageable candidate', () => {
    expect(
      resolvePubPartsSharedLinkCandidates(
        buildStagedRecord('https://www.dropbox.com/scl/fi/source/sample-part.glb?dl=0'),
      ),
    ).toEqual([
      expect.objectContaining({
        kind: 'supported-direct-file',
        fileName: 'sample-part.glb',
        fileType: 'glb',
        selectable: true,
        downloadUrl: 'https://www.dropbox.com/scl/fi/source/sample-part.glb?dl=1',
      }),
    ])
  })

  it('keeps ZIP links as non-stageable archive candidates', () => {
    expect(
      resolvePubPartsSharedLinkCandidates(
        buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
      )[0],
    ).toEqual(
      expect.objectContaining({
        kind: 'archive-needs-inspection',
        fileName: 'model_files.zip',
        fileType: 'zip',
        selectable: false,
      }),
    )
  })

  it('keeps the Gripples ZIP as a sync placeholder until async archive inspection runs', () => {
    expect(
      resolvePubPartsSharedLinkCandidates(
        buildStagedRecord(
          'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
        ),
      )[0],
    ).toEqual(
      expect.objectContaining({
        kind: 'archive-needs-inspection',
        fileName: 'standard-gripples-for-onewheel-model_files.zip',
        fileType: 'zip',
        selectable: false,
      }),
    )
  })

  it('inspects a fetched ZIP and maps Gripples archive entries into source candidates', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 's'.repeat(42684) },
      { path: 'gripple_standard.3mf', content: 'm'.repeat(28573) },
      {
        path: '598759-standard-gripples-for-onewheel-b51d2e2c-59bb-4ccf-bef0-14adeac089fb.pdf',
        content: 'p'.repeat(138830),
      },
    ])
    const fetchRef = vi.fn().mockResolvedValue(
      {
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      },
    )

    await expect(
      inspectPubPartsSharedLinkArchiveCandidates(
        buildStagedRecord(
          'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
        ),
        { fetchRef },
      ),
    ).resolves.toEqual([
      expect.objectContaining({
        kind: 'supported-archive-entry',
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        archivePath: 'gripple_standard.stl',
        normalizedArchivePath: 'gripple_standard.stl',
        archiveEntryClassification: 'supported',
        fileSizeBytes: 42684,
        selectable: true,
      }),
      expect.objectContaining({
        kind: 'unsupported-archive-entry',
        fileName: 'gripple_standard.3mf',
        fileType: '3mf',
        archivePath: 'gripple_standard.3mf',
        archiveEntryClassification: 'unsupported',
        fileSizeBytes: 28573,
        selectable: false,
      }),
      expect.objectContaining({
        kind: 'unsupported-archive-entry',
        fileName:
          '598759-standard-gripples-for-onewheel-b51d2e2c-59bb-4ccf-bef0-14adeac089fb.pdf',
        fileType: 'pdf',
        archivePath:
          '598759-standard-gripples-for-onewheel-b51d2e2c-59bb-4ccf-bef0-14adeac089fb.pdf',
        archiveEntryClassification: 'unsupported',
        fileSizeBytes: 138830,
        selectable: false,
      }),
    ])
    expect(fetchRef).toHaveBeenCalledWith(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=1',
    )
  })

  it('maps unsafe, directory, and supported archive metadata into disabled or selectable candidates', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'cad/source.step' },
      { path: 'cad/source.obj' },
      { path: 'cad/source.glb' },
      { path: 'cad/source.stp' },
      { path: '../escape.stl' },
      { path: 'docs/', directory: true },
    ])
    const fetchRef = vi.fn().mockResolvedValue(
      {
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      },
    )

    const candidates = await inspectPubPartsSharedLinkArchiveCandidates(
      buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
      { fetchRef },
    )
    const candidatesByPath = new Map(candidates.map((candidate) => [candidate.archivePath, candidate]))

    expect(candidatesByPath.get('cad/source.step')).toEqual(
      expect.objectContaining({
        kind: 'supported-archive-entry',
        fileType: 'step',
        selectable: true,
      }),
    )
    expect(candidatesByPath.get('cad/source.obj')).toEqual(
      expect.objectContaining({
        kind: 'supported-archive-entry',
        fileType: 'obj',
        selectable: true,
      }),
    )
    expect(candidatesByPath.get('cad/source.glb')).toEqual(
      expect.objectContaining({
        kind: 'supported-archive-entry',
        fileType: 'glb',
        selectable: true,
      }),
    )
    expect(candidatesByPath.get('cad/source.stp')).toEqual(
      expect.objectContaining({
        kind: 'unsupported-archive-entry',
        fileType: 'stp',
        archiveEntryClassification: 'unsupported',
        selectable: false,
      }),
    )
    expect(candidatesByPath.get('../escape.stl')).toEqual(
      expect.objectContaining({
        kind: 'unsupported-archive-entry',
        archiveEntryClassification: 'unsafe',
        archiveEntryBlockedReason: 'path-traversal',
        selectable: false,
      }),
    )
    expect(candidatesByPath.get('docs/')).toEqual(
      expect.objectContaining({
        kind: 'unsupported-archive-entry',
        archiveEntryClassification: 'directory',
        archiveEntryBlockedReason: 'directory',
        isDirectory: true,
        selectable: false,
      }),
    )
  })

  it('maps cached archive entry metadata into current staged source candidates', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'models/source.step', content: 'step bytes' },
      { path: 'docs/readme.pdf', content: 'pdf bytes' },
    ])
    const fetchRef = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => archiveBlob,
    })
    const stagedRecord = buildStagedRecord(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
    )
    const inspection = await inspectPubPartsSharedLinkArchive(stagedRecord, { fetchRef })
    const currentStagedRecord = {
      ...stagedRecord,
      stagedSourceId: 'pubparts:current-source',
    }

    expect(
      mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
        currentStagedRecord,
        inspection.entries,
      ),
    ).toEqual([
      expect.objectContaining({
        candidateId: 'pubparts:current-source:archive-entry:models/source.step',
        kind: 'supported-archive-entry',
        sourceUrl: 'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
        fileName: 'source.step',
        fileType: 'step',
        selectable: true,
      }),
      expect.objectContaining({
        candidateId: 'pubparts:current-source:archive-entry:docs/readme.pdf',
        kind: 'unsupported-archive-entry',
        fileName: 'readme.pdf',
        fileType: 'pdf',
        selectable: false,
      }),
    ])
  })

  it('keeps stp visible while Import support is missing', () => {
    expect(
      resolvePubPartsSharedLinkCandidates(
        buildStagedRecord('https://example.com/source/source-cad.stp'),
      )[0],
    ).toEqual(
      expect.objectContaining({
        kind: 'import-type-unsupported',
        fileName: 'source-cad.stp',
        fileType: 'stp',
        selectable: false,
      }),
    )
  })

  it('fetches a selected direct candidate into an Import-staged file object', async () => {
    const [candidate] = resolvePubPartsSharedLinkCandidates(
      buildStagedRecord('https://www.dropbox.com/scl/fi/source/sample-part.stl?dl=0'),
    )
    const createObjectURL = vi.fn(() => 'blob:pubparts-shared-source')
    const fetchRef = vi.fn().mockResolvedValue(
      new Response(new Blob(['stl bytes'], { type: 'model/stl' }), {
        status: 200,
      }),
    )

    await expect(
      fetchPubPartsSharedLinkCandidateFile(candidate!, {
        fetchRef,
        urlRef: {
          createObjectURL,
        },
        fileCtor: File,
      }),
    ).resolves.toEqual({
      fileName: 'sample-part.stl',
      fileType: 'stl',
      objectUrl: 'blob:pubparts-shared-source',
    })
    expect(fetchRef).toHaveBeenCalledWith(
      'https://www.dropbox.com/scl/fi/source/sample-part.stl?dl=1',
    )
  })

  it('rejects archive-entry metadata before a later extraction owner materializes bytes', async () => {
    const archiveBlob = await createFixtureZipBlob([{ path: 'gripple_standard.stl' }])
    const fetchRef = vi.fn().mockResolvedValue(
      {
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      },
    )
    const [candidate] = await inspectPubPartsSharedLinkArchiveCandidates(
      buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
      {
        fetchRef,
      },
    )
    const archiveEntryFetchRef = vi.fn()

    await expect(
      fetchPubPartsSharedLinkCandidateFile(candidate!, {
        fetchRef: archiveEntryFetchRef,
      }),
    ).rejects.toThrow('This PubParts source candidate is not currently stageable.')
    expect(archiveEntryFetchRef).not.toHaveBeenCalled()
  })

  it('materializes selected supported archive candidates from a reusable ZIP blob', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
      { path: 'gripple_standard.3mf', content: 'unsupported bytes' },
    ])
    const fetchRef = vi.fn()
    const [candidate] = await inspectPubPartsSharedLinkArchiveCandidates(
      buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
      {
        fetchRef: vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          blob: async () => archiveBlob,
        }),
      },
    )
    const createObjectURL = vi.fn((blob: Blob) =>
      blob instanceof File ? 'blob:archive-file' : 'blob:archive-blob',
    )

    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(
        buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
        [candidate!],
        {
          archiveBlob,
          fetchRef,
          urlRef: {
            createObjectURL,
          },
          fileCtor: File,
        },
      ),
    ).resolves.toEqual([
      {
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        objectUrl: 'blob:archive-file',
      },
    ])
    expect(fetchRef).not.toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(File))
  })

  it('passes extracted archive entries to the optional cache callback while preserving imported file materialization', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
    ])
    const stagedRecord = buildStagedRecord(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
    )
    const [candidate] = await inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, {
      fetchRef: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      }),
    })
    const createObjectURL = vi.fn(() => 'blob:archive-file')
    const onExtractedEntries = vi.fn()

    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, [candidate!], {
        archiveBlob,
        urlRef: {
          createObjectURL,
        },
        fileCtor: File,
        onExtractedEntries,
      }),
    ).resolves.toEqual([
      {
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        objectUrl: 'blob:archive-file',
      },
    ])
    expect(onExtractedEntries).toHaveBeenCalledWith([
      expect.objectContaining({
        archivePath: 'gripple_standard.stl',
        normalizedPath: 'gripple_standard.stl',
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        blob: expect.any(Blob),
      }),
    ])
  })

  it('stages selected archive entries when the optional cache callback fails', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
    ])
    const stagedRecord = buildStagedRecord(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
    )
    const [candidate] = await inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, {
      fetchRef: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      }),
    })
    const createObjectURL = vi.fn(() => 'blob:archive-file')

    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, [candidate!], {
        archiveBlob,
        urlRef: {
          createObjectURL,
        },
        onExtractedEntries: () => {
          throw new Error('cache write failed')
        },
      }),
    ).resolves.toEqual([
      {
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        objectUrl: 'blob:archive-file',
      },
    ])
  })

  it('refetches one ZIP for archive materialization when no reusable blob is provided', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'models/source.step', content: 'step bytes' },
    ])
    const stagedRecord = buildStagedRecord(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
    )
    const [candidate] = await inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, {
      fetchRef: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      }),
    })
    const fetchRef = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => archiveBlob,
    })
    const createObjectURL = vi.fn(() => 'blob:refetched-archive-entry')

    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, [candidate!], {
        fetchRef,
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual([
      {
        fileName: 'source.step',
        fileType: 'step',
        objectUrl: 'blob:refetched-archive-entry',
      },
    ])
    expect(fetchRef).toHaveBeenCalledWith(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=1',
    )
  })

  it('falls back to object URLs from Blobs when File is unavailable', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'models/source.obj', content: 'obj bytes' },
    ])
    const stagedRecord = buildStagedRecord(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
    )
    const [candidate] = await inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, {
      fetchRef: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      }),
    })
    const createObjectURL = vi.fn(() => 'blob:archive-blob-fallback')
    vi.stubGlobal('File', undefined)

    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, [candidate!], {
        archiveBlob,
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual([
      {
        fileName: 'source.obj',
        fileType: 'obj',
        objectUrl: 'blob:archive-blob-fallback',
      },
    ])
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  })

  it('rejects stale or unsupported archive candidates before materialization', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
      { path: 'gripple_standard.3mf', content: 'unsupported bytes' },
    ])
    const stagedRecord = buildStagedRecord(
      'https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0',
    )
    const candidates = await inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, {
      fetchRef: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      }),
    })
    const supportedCandidate = candidates.find(
      (candidate) => candidate.kind === 'supported-archive-entry',
    )!
    const unsupportedCandidate = candidates.find(
      (candidate) => candidate.fileName === 'gripple_standard.3mf',
    )!
    const createObjectURL = vi.fn()

    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(
        stagedRecord,
        [
          {
            ...supportedCandidate,
            candidateId: `${stagedRecord.stagedSourceId}:archive-entry:stale.stl`,
          },
        ],
        {
          archiveBlob,
          urlRef: {
            createObjectURL,
          },
        },
      ),
    ).rejects.toBeInstanceOf(PubPartsSharedLinkArchiveExtractionError)
    await expect(
      materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, [unsupportedCandidate], {
        archiveBlob,
        urlRef: {
          createObjectURL,
        },
      }),
    ).rejects.toBeInstanceOf(PubPartsSharedLinkArchiveExtractionError)
    expect(createObjectURL).not.toHaveBeenCalled()
  })

  it('reports stable archive inspection failures for non-OK and malformed ZIP responses', async () => {
    await expect(
      inspectPubPartsSharedLinkArchiveCandidates(
        buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
        {
          fetchRef: vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
            blob: async () => new Blob(['missing']),
          }),
        },
      ),
    ).rejects.toThrow('PubParts ZIP archive fetch failed with status 404.')

    await expect(
      inspectPubPartsSharedLinkArchiveCandidates(
        buildStagedRecord('https://www.dropbox.com/scl/fi/source/model_files.zip?dl=0'),
        {
          fetchRef: vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            blob: async () => new Blob(['not a zip'], { type: 'application/zip' }),
          }),
        },
      ),
    ).rejects.toBeInstanceOf(PubPartsSharedLinkArchiveInspectionError)
  })
})
