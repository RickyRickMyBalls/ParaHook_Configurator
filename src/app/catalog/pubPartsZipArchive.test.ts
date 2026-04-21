// @vitest-environment jsdom

import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import { describe, expect, it } from 'vitest'
import {
  PUBPARTS_ZIP_MAX_ENTRY_COUNT,
  PUBPARTS_ZIP_MAX_ENTRY_SIZE_BYTES,
  PubPartsZipArchiveExtractionError,
  PubPartsZipArchiveInspectionError,
  classifyPubPartsZipArchiveEntry,
  extractPubPartsZipArchiveEntries,
  listPubPartsZipArchiveEntries,
} from './pubPartsZipArchive'

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

describe('pubPartsZipArchive', () => {
  it('lists ZIP entries and classifies supported, unsupported, unsafe, directory, and blocked entries', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'models/gripple_standard.stl' },
      { path: 'cad/source.step' },
      { path: 'cad/source.obj' },
      { path: 'cad/source.glb' },
      { path: 'cad/source.stp' },
      { path: 'slicer/model.3mf' },
      { path: 'docs/readme.pdf' },
      { path: 'docs/', directory: true },
      { path: '../escape.stl' },
      { path: '/absolute.stl' },
      { path: 'C:/escape.stl' },
      { path: '.DS_Store' },
      { path: '__MACOSX/metadata' },
      { path: 'large/oversized.glb', content: 'oversized bytes' },
    ])

    const entries = await listPubPartsZipArchiveEntries(archiveBlob, {
      maxEntrySizeBytes: 10,
    })
    const entriesByPath = new Map(entries.map((entry) => [entry.archivePath, entry]))

    expect(entriesByPath.get('models/gripple_standard.stl')).toEqual(
      expect.objectContaining({
        normalizedPath: 'models/gripple_standard.stl',
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        classification: 'supported',
        supportState: 'import-supported',
        selectable: true,
        fileSizeBytes: 7,
        compressedSizeBytes: expect.any(Number),
        lastModifiedAt: '2026-04-21T00:00:00.000Z',
        isDirectory: false,
      }),
    )
    expect(entriesByPath.get('cad/source.step')).toEqual(
      expect.objectContaining({
        fileType: 'step',
        classification: 'supported',
        supportState: 'import-supported',
        selectable: true,
      }),
    )
    expect(entriesByPath.get('cad/source.obj')).toEqual(
      expect.objectContaining({
        fileType: 'obj',
        classification: 'supported',
        supportState: 'import-supported',
        selectable: true,
      }),
    )
    expect(entriesByPath.get('cad/source.glb')).toEqual(
      expect.objectContaining({
        fileType: 'glb',
        classification: 'supported',
        supportState: 'import-supported',
        selectable: true,
      }),
    )
    expect(entriesByPath.get('cad/source.stp')).toEqual(
      expect.objectContaining({
        fileType: 'stp',
        classification: 'unsupported',
        supportState: 'recognized-source-unsupported',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('slicer/model.3mf')).toEqual(
      expect.objectContaining({
        fileType: '3mf',
        classification: 'unsupported',
        supportState: 'unsupported',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('docs/readme.pdf')).toEqual(
      expect.objectContaining({
        fileType: 'pdf',
        classification: 'unsupported',
        supportState: 'unsupported',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('docs/')).toEqual(
      expect.objectContaining({
        classification: 'directory',
        blockedReason: 'directory',
        isDirectory: true,
        selectable: false,
      }),
    )
    expect(entriesByPath.get('../escape.stl')).toEqual(
      expect.objectContaining({
        classification: 'unsafe',
        blockedReason: 'path-traversal',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('/absolute.stl')).toEqual(
      expect.objectContaining({
        classification: 'unsafe',
        blockedReason: 'absolute-path',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('C:/escape.stl')).toEqual(
      expect.objectContaining({
        classification: 'unsafe',
        blockedReason: 'windows-drive-path',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('.DS_Store')).toEqual(
      expect.objectContaining({
        classification: 'unsafe',
        blockedReason: 'hidden-or-system-path',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('__MACOSX/metadata')).toEqual(
      expect.objectContaining({
        classification: 'unsafe',
        blockedReason: 'hidden-or-system-path',
        selectable: false,
      }),
    )
    expect(entriesByPath.get('large/oversized.glb')).toEqual(
      expect.objectContaining({
        fileType: 'glb',
        classification: 'blocked',
        supportState: 'import-supported',
        blockedReason: 'oversized',
        selectable: false,
      }),
    )
  })

  it('blocks entries with unknown or invalid size metadata', () => {
    expect(
      classifyPubPartsZipArchiveEntry({
        archivePath: 'models/unknown-size.stl',
      }),
    ).toEqual(
      expect.objectContaining({
        classification: 'blocked',
        supportState: 'import-supported',
        blockedReason: 'unknown-size',
        selectable: false,
      }),
    )
    expect(
      classifyPubPartsZipArchiveEntry({
        archivePath: 'models/not-finite.stl',
        fileSizeBytes: Number.NaN,
      }),
    ).toEqual(
      expect.objectContaining({
        classification: 'blocked',
        blockedReason: 'unknown-size',
        selectable: false,
      }),
    )
  })

  it('exposes default guard constants for later Manager tuning', () => {
    expect(PUBPARTS_ZIP_MAX_ENTRY_SIZE_BYTES).toBe(100 * 1024 * 1024)
    expect(PUBPARTS_ZIP_MAX_ENTRY_COUNT).toBe(2000)
  })

  it('adds a blocked guard record when an archive has too many entries', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'one.stl' },
      { path: 'two.stl' },
      { path: 'three.stl' },
    ])

    await expect(
      listPubPartsZipArchiveEntries(archiveBlob, {
        maxEntryCount: 2,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        archivePath: 'one.stl',
        classification: 'supported',
        selectable: true,
      }),
      expect.objectContaining({
        archivePath: 'two.stl',
        classification: 'supported',
        selectable: true,
      }),
      expect.objectContaining({
        archivePath: '__parahook_entry_count_guard__',
        classification: 'blocked',
        blockedReason: 'too-many-entries',
        selectable: false,
      }),
    ])
  })

  it('extracts only selected supported entries by normalized archive path', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'models/gripple_standard.stl', content: 'stl bytes' },
      { path: 'cad/source.step', content: 'step bytes' },
      { path: 'cad/source.obj', content: 'obj bytes' },
      { path: 'cad/source.glb', content: 'glb bytes' },
      { path: 'slicer/model.3mf', content: 'unsupported bytes' },
    ])

    const extractedEntries = await extractPubPartsZipArchiveEntries(archiveBlob, [
      'models/gripple_standard.stl',
      'cad/source.step',
      'cad/source.obj',
      'cad/source.glb',
    ])

    expect(
      extractedEntries.map((entry) => ({
        normalizedPath: entry.normalizedPath,
        fileName: entry.fileName,
        fileType: entry.fileType,
        fileSizeBytes: entry.fileSizeBytes,
      })),
    ).toEqual([
      {
        normalizedPath: 'models/gripple_standard.stl',
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        fileSizeBytes: 9,
      },
      {
        normalizedPath: 'cad/source.step',
        fileName: 'source.step',
        fileType: 'step',
        fileSizeBytes: 10,
      },
      {
        normalizedPath: 'cad/source.obj',
        fileName: 'source.obj',
        fileType: 'obj',
        fileSizeBytes: 9,
      },
      {
        normalizedPath: 'cad/source.glb',
        fileName: 'source.glb',
        fileType: 'glb',
        fileSizeBytes: 9,
      },
    ])
    await expect(extractedEntries[0]?.blob.text()).resolves.toBe('stl bytes')
    await expect(extractedEntries[1]?.blob.text()).resolves.toBe('step bytes')
  })

  it('rejects selected entries that are unsupported, unsafe, directory, oversized, missing, or over count', async () => {
    const archiveBlob = await createFixtureZipBlob([
      { path: 'models/gripple_standard.stl', content: 'stl bytes' },
      { path: 'cad/source.stp', content: 'stp bytes' },
      { path: 'slicer/model.3mf', content: 'unsupported bytes' },
      { path: 'docs/readme.pdf', content: 'pdf bytes' },
      { path: 'docs/', directory: true },
      { path: '../escape.stl', content: 'escape bytes' },
      { path: '.hidden.stl', content: 'hidden bytes' },
      { path: 'large/oversized.glb', content: 'oversized bytes' },
    ])

    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['cad/source.stp']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['slicer/model.3mf']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['docs/readme.pdf']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['docs/']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['../escape.stl']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['.hidden.stl']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['large/oversized.glb'], {
        maxEntrySizeBytes: 10,
      }),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
    await expect(
      extractPubPartsZipArchiveEntries(archiveBlob, ['missing.stl']),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)

    const tooManyEntriesArchiveBlob = await createFixtureZipBlob([
      { path: 'one.stl' },
      { path: 'two.stl' },
      { path: 'three.stl' },
    ])
    await expect(
      extractPubPartsZipArchiveEntries(tooManyEntriesArchiveBlob, ['one.stl'], {
        maxEntryCount: 2,
      }),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
  })

  it('wraps malformed ZIP inspection failures in a stable error', async () => {
    await expect(
      listPubPartsZipArchiveEntries(new Blob(['not a zip'], { type: 'application/zip' })),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveInspectionError)

    await expect(
      extractPubPartsZipArchiveEntries(new Blob(['not a zip'], { type: 'application/zip' }), [
        'model.stl',
      ]),
    ).rejects.toBeInstanceOf(PubPartsZipArchiveExtractionError)
  })
})
