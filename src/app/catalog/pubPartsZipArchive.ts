import { BlobReader, BlobWriter, ZipReader, type Entry } from '@zip.js/zip.js'
import {
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'

export const PUBPARTS_ZIP_MAX_ENTRY_SIZE_BYTES = 100 * 1024 * 1024
export const PUBPARTS_ZIP_MAX_ENTRY_COUNT = 2000

const RECOGNIZED_SOURCE_FILE_TYPES = ['step', 'stp', 'glb', 'obj', 'stl'] as const
const UNSUPPORTED_CONTEXT_FILE_TYPES = ['3mf', 'pdf'] as const

export type PubPartsZipArchiveEntryClassification =
  | 'supported'
  | 'unsupported'
  | 'unsafe'
  | 'directory'
  | 'blocked'

export type PubPartsZipArchiveEntrySupportState =
  | 'import-supported'
  | 'recognized-source-unsupported'
  | 'unsupported'
  | 'none'

export type PubPartsZipArchiveEntryBlockedReason =
  | 'path-traversal'
  | 'absolute-path'
  | 'windows-drive-path'
  | 'empty-path'
  | 'nul-path'
  | 'hidden-or-system-path'
  | 'directory'
  | 'unknown-size'
  | 'oversized'
  | 'too-many-entries'

export type PubPartsZipArchiveEntryMetadata = {
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
}

export type PubPartsZipArchiveExtractedEntry = {
  archivePath: string
  normalizedPath: string
  fileName: string
  fileType: ReferenceFileType
  fileSizeBytes: number
  blob: Blob
}

export class PubPartsZipArchiveInspectionError extends Error {
  constructor() {
    super('PubParts ZIP inspection failed.')
    this.name = 'PubPartsZipArchiveInspectionError'
  }
}

export class PubPartsZipArchiveExtractionError extends Error {
  constructor(message = 'PubParts ZIP entry extraction failed.') {
    super(message)
    this.name = 'PubPartsZipArchiveExtractionError'
  }
}

export type PubPartsZipArchiveOptions = {
  maxEntrySizeBytes?: number
  maxEntryCount?: number
}

type PubPartsZipArchiveEntryInput = {
  archivePath: string
  fileSizeBytes?: number
  compressedSizeBytes?: number
  lastModifiedAt?: Date | string
  isDirectory?: boolean
}

const isSupportedImportFileType = (fileType: string | undefined): fileType is ReferenceFileType =>
  fileType !== undefined &&
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES.includes(fileType as ReferenceFileType)

const isRecognizedSourceFileType = (
  fileType: string | undefined,
): fileType is (typeof RECOGNIZED_SOURCE_FILE_TYPES)[number] =>
  fileType !== undefined &&
  RECOGNIZED_SOURCE_FILE_TYPES.includes(fileType as (typeof RECOGNIZED_SOURCE_FILE_TYPES)[number])

const isUnsupportedContextFileType = (
  fileType: string | undefined,
): fileType is (typeof UNSUPPORTED_CONTEXT_FILE_TYPES)[number] =>
  fileType !== undefined &&
  UNSUPPORTED_CONTEXT_FILE_TYPES.includes(
    fileType as (typeof UNSUPPORTED_CONTEXT_FILE_TYPES)[number],
  )

const normalizeArchivePath = (archivePath: string): string => archivePath.replace(/\\/gu, '/')

const getArchiveFileName = (normalizedPath: string): string => {
  const trimmedPath = normalizedPath.replace(/\/+$/u, '')
  return trimmedPath.split('/').filter((part) => part.length > 0).at(-1) ?? ''
}

const getArchiveFileType = (fileName: string): string | undefined =>
  /\.([a-z0-9]+)$/iu.exec(fileName)?.[1]?.toLowerCase()

const getPathSegments = (normalizedPath: string): string[] =>
  normalizedPath.split('/').filter((segment) => segment.length > 0)

const isHiddenOrSystemPath = (normalizedPath: string): boolean => {
  const segments = getPathSegments(normalizedPath)
  return segments.some((segment) => {
    const normalizedSegment = segment.toLowerCase()
    return (
      segment.startsWith('.') ||
      normalizedSegment === '__macosx' ||
      normalizedSegment === 'thumbs.db' ||
      normalizedSegment === 'desktop.ini'
    )
  })
}

const getLastModifiedAt = (lastModifiedAt: Date | string | undefined): string | undefined => {
  if (lastModifiedAt === undefined) {
    return undefined
  }
  if (typeof lastModifiedAt === 'string') {
    return lastModifiedAt
  }
  const timestamp = lastModifiedAt.getTime()
  return Number.isFinite(timestamp) ? lastModifiedAt.toISOString() : undefined
}

const buildEntryMetadata = (
  entry: PubPartsZipArchiveEntryInput,
  classification: PubPartsZipArchiveEntryClassification,
  supportState: PubPartsZipArchiveEntrySupportState,
  description: string,
  blockedReason?: PubPartsZipArchiveEntryBlockedReason,
): PubPartsZipArchiveEntryMetadata => {
  const normalizedPath = normalizeArchivePath(entry.archivePath)
  const fileName = getArchiveFileName(normalizedPath)
  const fileType = getArchiveFileType(fileName)
  return {
    archivePath: entry.archivePath,
    normalizedPath,
    fileName,
    fileType,
    classification,
    supportState,
    blockedReason,
    description,
    fileSizeBytes: entry.fileSizeBytes,
    compressedSizeBytes: entry.compressedSizeBytes,
    lastModifiedAt: getLastModifiedAt(entry.lastModifiedAt),
    isDirectory: entry.isDirectory === true,
    selectable: classification === 'supported',
  }
}

const buildEntryInputFromZipEntry = (entry: Entry): PubPartsZipArchiveEntryInput => ({
  archivePath: entry.filename,
  fileSizeBytes: entry.uncompressedSize,
  compressedSizeBytes: entry.compressedSize,
  lastModifiedAt: entry.lastModDate,
  isDirectory: entry.directory,
})

export function classifyPubPartsZipArchiveEntry(
  entry: PubPartsZipArchiveEntryInput,
  options: PubPartsZipArchiveOptions = {},
): PubPartsZipArchiveEntryMetadata {
  const maxEntrySizeBytes = options.maxEntrySizeBytes ?? PUBPARTS_ZIP_MAX_ENTRY_SIZE_BYTES
  const normalizedPath = normalizeArchivePath(entry.archivePath)
  const fileName = getArchiveFileName(normalizedPath)
  const fileType = getArchiveFileType(fileName)
  const isDirectory = entry.isDirectory === true || /\/$/u.test(normalizedPath)

  if (normalizedPath.length === 0 || fileName.length === 0) {
    return buildEntryMetadata(
      entry,
      'unsafe',
      'none',
      'This ZIP entry has an empty path and cannot be inspected safely.',
      'empty-path',
    )
  }

  if (normalizedPath.includes('\0')) {
    return buildEntryMetadata(
      entry,
      'unsafe',
      'none',
      'This ZIP entry contains a NUL character in its path and cannot be used safely.',
      'nul-path',
    )
  }

  if (/^[a-z]:\//iu.test(normalizedPath)) {
    return buildEntryMetadata(
      entry,
      'unsafe',
      'none',
      'This ZIP entry uses a Windows drive path and cannot be extracted safely.',
      'windows-drive-path',
    )
  }

  if (normalizedPath.startsWith('/')) {
    return buildEntryMetadata(
      entry,
      'unsafe',
      'none',
      'This ZIP entry uses an absolute path and cannot be extracted safely.',
      'absolute-path',
    )
  }

  if (getPathSegments(normalizedPath).includes('..')) {
    return buildEntryMetadata(
      entry,
      'unsafe',
      'none',
      'This ZIP entry tries to leave the archive folder and cannot be extracted safely.',
      'path-traversal',
    )
  }

  if (isHiddenOrSystemPath(normalizedPath)) {
    return buildEntryMetadata(
      entry,
      'unsafe',
      'none',
      'This ZIP entry looks like hidden or system metadata and is not importable.',
      'hidden-or-system-path',
    )
  }

  if (isDirectory) {
    return buildEntryMetadata(
      { ...entry, isDirectory: true },
      'directory',
      'none',
      'This ZIP entry is a directory and cannot be staged as a source file.',
      'directory',
    )
  }

  if (entry.fileSizeBytes === undefined || !Number.isFinite(entry.fileSizeBytes)) {
    return buildEntryMetadata(
      entry,
      'blocked',
      isSupportedImportFileType(fileType)
        ? 'import-supported'
        : isRecognizedSourceFileType(fileType)
          ? 'recognized-source-unsupported'
          : 'unsupported',
      'This ZIP entry does not expose a stable uncompressed size, so it is blocked until extraction safety can be proven.',
      'unknown-size',
    )
  }

  if (entry.fileSizeBytes > maxEntrySizeBytes) {
    return buildEntryMetadata(
      entry,
      'blocked',
      isSupportedImportFileType(fileType)
        ? 'import-supported'
        : isRecognizedSourceFileType(fileType)
          ? 'recognized-source-unsupported'
          : 'unsupported',
      'This ZIP entry is larger than the current safe extraction limit.',
      'oversized',
    )
  }

  if (isSupportedImportFileType(fileType)) {
    return buildEntryMetadata(
      entry,
      'supported',
      'import-supported',
      'This ZIP entry is a supported source file candidate.',
    )
  }

  if (isRecognizedSourceFileType(fileType)) {
    return buildEntryMetadata(
      entry,
      'unsupported',
      'recognized-source-unsupported',
      'This ZIP entry is a recognized source file type, but Import cannot stage it yet.',
    )
  }

  return buildEntryMetadata(
    entry,
    'unsupported',
    isUnsupportedContextFileType(fileType) ? 'unsupported' : 'none',
    'This ZIP entry is not supported by the current Catalog-to-Import path.',
  )
}

export async function listPubPartsZipArchiveEntries(
  archiveBlob: Blob,
  options: PubPartsZipArchiveOptions = {},
): Promise<PubPartsZipArchiveEntryMetadata[]> {
  const maxEntryCount = options.maxEntryCount ?? PUBPARTS_ZIP_MAX_ENTRY_COUNT
  const zipReader = new ZipReader(new BlobReader(archiveBlob))

  try {
    const entries = await zipReader.getEntries()
    const normalizedEntries = entries.slice(0, maxEntryCount).map((entry) =>
      classifyPubPartsZipArchiveEntry(buildEntryInputFromZipEntry(entry), options),
    )

    if (entries.length > maxEntryCount) {
      return [
        ...normalizedEntries,
        {
          archivePath: '__parahook_entry_count_guard__',
          normalizedPath: '__parahook_entry_count_guard__',
          fileName: '__parahook_entry_count_guard__',
          classification: 'blocked',
          supportState: 'none',
          blockedReason: 'too-many-entries',
          description: 'This ZIP contains more entries than ParaHook will inspect in one pass.',
          isDirectory: false,
          selectable: false,
        },
      ]
    }

    return normalizedEntries
  } catch {
    throw new PubPartsZipArchiveInspectionError()
  } finally {
    try {
      await zipReader.close()
    } catch {
      // Prefer the original inspection result over cleanup failures.
    }
  }
}

export async function extractPubPartsZipArchiveEntries(
  archiveBlob: Blob,
  normalizedArchivePaths: string[],
  options: PubPartsZipArchiveOptions = {},
): Promise<PubPartsZipArchiveExtractedEntry[]> {
  const maxEntryCount = options.maxEntryCount ?? PUBPARTS_ZIP_MAX_ENTRY_COUNT
  const requestedPaths = Array.from(
    new Set(normalizedArchivePaths.map((archivePath) => normalizeArchivePath(archivePath))),
  )
  if (requestedPaths.length === 0) {
    return []
  }

  const zipReader = new ZipReader(new BlobReader(archiveBlob))

  try {
    const entries = await zipReader.getEntries()
    if (entries.length > maxEntryCount) {
      throw new PubPartsZipArchiveExtractionError(
        'This ZIP contains more entries than ParaHook will extract in one pass.',
      )
    }

    const entriesByNormalizedPath = new Map<string, Entry>()
    entries.forEach((entry) => {
      const normalizedPath = normalizeArchivePath(entry.filename)
      if (!entriesByNormalizedPath.has(normalizedPath)) {
        entriesByNormalizedPath.set(normalizedPath, entry)
      }
    })

    const extractedEntries: PubPartsZipArchiveExtractedEntry[] = []
    for (const requestedPath of requestedPaths) {
      const entry = entriesByNormalizedPath.get(requestedPath)
      if (entry === undefined) {
        throw new PubPartsZipArchiveExtractionError(
          'The selected ZIP entry is no longer present in the archive.',
        )
      }

      const metadata = classifyPubPartsZipArchiveEntry(buildEntryInputFromZipEntry(entry), options)
      if (
        entry.directory ||
        metadata.classification !== 'supported' ||
        !metadata.selectable ||
        !isSupportedImportFileType(metadata.fileType) ||
        metadata.fileSizeBytes === undefined
      ) {
        throw new PubPartsZipArchiveExtractionError(
          'The selected ZIP entry is not safe and supported for Import review staging.',
        )
      }

      let blob: Blob
      try {
        blob = await entry.getData<Blob>(new BlobWriter('application/octet-stream'), {
          checkOverlappingEntry: true,
        })
      } catch {
        throw new PubPartsZipArchiveExtractionError()
      }

      extractedEntries.push({
        archivePath: metadata.archivePath,
        normalizedPath: metadata.normalizedPath,
        fileName: metadata.fileName,
        fileType: metadata.fileType,
        fileSizeBytes: metadata.fileSizeBytes,
        blob,
      })
    }

    return extractedEntries
  } catch (error) {
    if (error instanceof PubPartsZipArchiveExtractionError) {
      throw error
    }
    throw new PubPartsZipArchiveExtractionError()
  } finally {
    try {
      await zipReader.close()
    } catch {
      // Prefer the original extraction result over cleanup failures.
    }
  }
}
