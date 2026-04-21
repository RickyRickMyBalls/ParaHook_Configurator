import {
  type ImportedReferenceFile,
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import {
  extractPubPartsZipArchiveEntries,
  listPubPartsZipArchiveEntries,
  type PubPartsZipArchiveEntryBlockedReason,
  type PubPartsZipArchiveEntryClassification,
  type PubPartsZipArchiveEntryMetadata,
} from './pubPartsZipArchive'

export type PubPartsSharedLinkCandidateKind =
  | 'supported-direct-file'
  | 'supported-archive-entry'
  | 'import-type-unsupported'
  | 'archive-needs-inspection'
  | 'unsupported-archive-entry'
  | 'unsupported-direct-file'
  | 'unknown-source'

export type PubPartsSharedLinkCandidate = {
  candidateId: string
  kind: PubPartsSharedLinkCandidateKind
  fileName: string
  fileType?: string
  label: string
  description: string
  sourceUrl: string
  downloadUrl?: string
  archivePath?: string
  normalizedArchivePath?: string
  fileSizeBytes?: number
  compressedSizeBytes?: number
  isDirectory?: boolean
  archiveEntryClassification?: PubPartsZipArchiveEntryClassification
  archiveEntryBlockedReason?: PubPartsZipArchiveEntryBlockedReason
  selectable: boolean
}

type FetchSharedLinkCandidateEnv = {
  fetchRef?: typeof fetch
  urlRef?: Pick<typeof URL, 'createObjectURL'>
  fileCtor?: typeof File
}

type InspectSharedLinkArchiveEnv = {
  fetchRef?: typeof fetch
}

type MaterializeSharedLinkArchiveEnv = FetchSharedLinkCandidateEnv & {
  archiveBlob?: Blob
}

export type PubPartsSharedLinkArchiveInspectionResult = {
  candidates: PubPartsSharedLinkCandidate[]
  entries: PubPartsZipArchiveEntryMetadata[]
  archiveBlob: Blob
  sourceUrl: string
}

const SUPPORTED_SOURCE_FILE_TYPES = ['step', 'stp', 'glb', 'obj', 'stl'] as const

export class PubPartsSharedLinkArchiveInspectionError extends Error {
  constructor(message = 'PubParts ZIP archive inspection failed.') {
    super(message)
    this.name = 'PubPartsSharedLinkArchiveInspectionError'
  }
}

export class PubPartsSharedLinkArchiveExtractionError extends Error {
  constructor(message = 'PubParts ZIP archive entry extraction failed.') {
    super(message)
    this.name = 'PubPartsSharedLinkArchiveExtractionError'
  }
}

const getSharedLinkPathParts = (sourceUrl: string): { hostname: string; path: string } => {
  try {
    const parsedUrl = new URL(sourceUrl)
    return {
      hostname: parsedUrl.hostname.toLowerCase(),
      path: parsedUrl.pathname,
    }
  } catch {
    return {
      hostname: '',
      path: sourceUrl.split(/[?#]/u)[0] ?? '',
    }
  }
}

const getSharedLinkFileName = (sourceUrl: string): string => {
  const { path } = getSharedLinkPathParts(sourceUrl)
  const lastPathPart = path.split('/').filter((part) => part.length > 0).at(-1) ?? ''
  return decodeURIComponent(lastPathPart).trim() || 'PubParts source link'
}

const getSharedLinkExtension = (sourceUrl: string): string | undefined => {
  const fileName = getSharedLinkFileName(sourceUrl)
  return /\.([a-z0-9]+)$/iu.exec(fileName)?.[1]?.toLowerCase()
}

const isDropboxUrl = (sourceUrl: string): boolean => {
  const { hostname } = getSharedLinkPathParts(sourceUrl)
  return hostname === 'dropbox.com' || hostname.endsWith('.dropbox.com')
}

export const resolvePubPartsSharedLinkDirectDownloadUrl = (sourceUrl: string): string => {
  if (!isDropboxUrl(sourceUrl)) {
    return sourceUrl
  }

  const parsedUrl = new URL(sourceUrl)
  parsedUrl.searchParams.delete('raw')
  parsedUrl.searchParams.set('dl', '1')
  return parsedUrl.toString()
}

const isSupportedSourceFileType = (
  fileType: string | undefined,
): fileType is (typeof SUPPORTED_SOURCE_FILE_TYPES)[number] =>
  fileType !== undefined &&
  SUPPORTED_SOURCE_FILE_TYPES.includes(fileType as (typeof SUPPORTED_SOURCE_FILE_TYPES)[number])

const isImportSupportedFileType = (fileType: string | undefined): fileType is ReferenceFileType =>
  fileType !== undefined &&
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES.includes(fileType as ReferenceFileType)

const resolveArchiveEntryLabel = (entry: PubPartsZipArchiveEntryMetadata): string => {
  if (entry.classification === 'supported') {
    return `Archive Entry (${entry.fileType?.toUpperCase() ?? 'File'})`
  }

  if (entry.classification === 'unsafe') {
    return 'Unsafe Archive Entry'
  }

  if (entry.classification === 'blocked') {
    return 'Blocked Archive Entry'
  }

  if (entry.classification === 'directory') {
    return 'Archive Directory'
  }

  return 'Unsupported Archive Entry'
}

const resolveArchiveEntryDescription = (entry: PubPartsZipArchiveEntryMetadata): string => {
  if (entry.classification === 'supported') {
    return `${entry.description} Selecting it lets Stage Selected extract this entry into Import review.`
  }

  return entry.description
}

const mapPubPartsZipArchiveEntryToCandidate = (
  stagedRecord: PubPartsStagedSourceRecord,
  sourceUrl: string,
  entry: PubPartsZipArchiveEntryMetadata,
): PubPartsSharedLinkCandidate => {
  const isSelectable = entry.classification === 'supported' && entry.selectable

  return {
    candidateId: `${stagedRecord.stagedSourceId}:archive-entry:${entry.normalizedPath}`,
    kind: isSelectable ? 'supported-archive-entry' : 'unsupported-archive-entry',
    fileName: entry.fileName,
    fileType: entry.fileType,
    label: resolveArchiveEntryLabel(entry),
    description: resolveArchiveEntryDescription(entry),
    sourceUrl,
    archivePath: entry.archivePath,
    normalizedArchivePath: entry.normalizedPath,
    fileSizeBytes: entry.fileSizeBytes,
    compressedSizeBytes: entry.compressedSizeBytes,
    isDirectory: entry.isDirectory,
    archiveEntryClassification: entry.classification,
    archiveEntryBlockedReason: entry.blockedReason,
    selectable: isSelectable,
  }
}

export const mapPubPartsZipArchiveEntriesToSharedLinkCandidates = (
  stagedRecord: PubPartsStagedSourceRecord,
  entries: PubPartsZipArchiveEntryMetadata[],
): PubPartsSharedLinkCandidate[] => {
  const sourceUrl = stagedRecord.sourceCandidateUrl.trim()
  return entries.map((entry) => mapPubPartsZipArchiveEntryToCandidate(stagedRecord, sourceUrl, entry))
}

export function resolvePubPartsSharedLinkCandidates(
  stagedRecord: PubPartsStagedSourceRecord,
): PubPartsSharedLinkCandidate[] {
  const sourceUrl = stagedRecord.sourceCandidateUrl.trim()
  const fileName = getSharedLinkFileName(sourceUrl)
  const fileType = getSharedLinkExtension(sourceUrl)
  const candidateId = `${stagedRecord.stagedSourceId}:shared-link:${fileName}`

  if (fileType === 'zip') {
    return [
      {
        candidateId,
        kind: 'archive-needs-inspection',
        fileName,
        fileType,
        label: 'Archive Needs Inspection',
        description:
          'This PubParts Dropbox link points to a ZIP/archive. ParaHook must inspect it before supported files can be staged.',
        sourceUrl,
        selectable: false,
      },
    ]
  }

  if (isImportSupportedFileType(fileType)) {
    return [
      {
        candidateId,
        kind: 'supported-direct-file',
        fileName,
        fileType,
        label: `${fileName} (${fileType.toUpperCase()})`,
        description:
          'This shared link looks like one directly fetchable supported file. Stage it to Import review before it becomes project content.',
        sourceUrl,
        downloadUrl: resolvePubPartsSharedLinkDirectDownloadUrl(sourceUrl),
        selectable: true,
      },
    ]
  }

  if (isSupportedSourceFileType(fileType)) {
    return [
      {
        candidateId,
        kind: 'import-type-unsupported',
        fileName,
        fileType,
        label: 'Import Type Support Needed',
        description:
          'This source file type is recognized, but the current Import reference path cannot stage it yet.',
        sourceUrl,
        selectable: false,
      },
    ]
  }

  if (fileType !== undefined) {
    return [
      {
        candidateId,
        kind: 'unsupported-direct-file',
        fileName,
        fileType,
        label: 'Unsupported File',
        description:
          'This shared link points to a file type that is not supported by the current Catalog-to-Import path.',
        sourceUrl,
        selectable: false,
      },
    ]
  }

  return [
    {
      candidateId,
      kind: 'unknown-source',
      fileName,
      label: isDropboxUrl(sourceUrl) ? 'Dropbox Source Needs Inspection' : 'Source Needs Inspection',
      description:
        'This source link does not expose a direct supported file extension. A later inspection phase must list candidates before import.',
      sourceUrl,
      selectable: false,
    },
  ]
}

const fetchPubPartsSharedLinkArchiveBlob = async (
  sourceUrl: string,
  env: InspectSharedLinkArchiveEnv = {},
): Promise<Blob> => {
  const fileType = getSharedLinkExtension(sourceUrl)
  if (fileType !== 'zip') {
    throw new PubPartsSharedLinkArchiveInspectionError(
      'This PubParts source candidate is not a ZIP archive.',
    )
  }

  const fetchRef = env.fetchRef ?? fetch
  const downloadUrl = resolvePubPartsSharedLinkDirectDownloadUrl(sourceUrl)
  let response: Response
  try {
    response = await fetchRef(downloadUrl)
  } catch {
    throw new PubPartsSharedLinkArchiveInspectionError('PubParts ZIP archive fetch failed.')
  }

  if (!response.ok) {
    throw new PubPartsSharedLinkArchiveInspectionError(
      `PubParts ZIP archive fetch failed with status ${response.status}.`,
    )
  }

  try {
    return await response.blob()
  } catch {
    throw new PubPartsSharedLinkArchiveInspectionError(
      'PubParts ZIP archive response could not be read.',
    )
  }
}

export async function inspectPubPartsSharedLinkArchive(
  stagedRecord: PubPartsStagedSourceRecord,
  env: InspectSharedLinkArchiveEnv = {},
): Promise<PubPartsSharedLinkArchiveInspectionResult> {
  const sourceUrl = stagedRecord.sourceCandidateUrl.trim()
  const archiveBlob = await fetchPubPartsSharedLinkArchiveBlob(sourceUrl, env)

  try {
    const entries = await listPubPartsZipArchiveEntries(archiveBlob)
    return {
      candidates: entries.map((entry) =>
        mapPubPartsZipArchiveEntryToCandidate(stagedRecord, sourceUrl, entry),
      ),
      entries,
      archiveBlob,
      sourceUrl,
    }
  } catch {
    throw new PubPartsSharedLinkArchiveInspectionError()
  }
}

export async function inspectPubPartsSharedLinkArchiveCandidates(
  stagedRecord: PubPartsStagedSourceRecord,
  env: InspectSharedLinkArchiveEnv = {},
): Promise<PubPartsSharedLinkCandidate[]> {
  const inspection = await inspectPubPartsSharedLinkArchive(stagedRecord, env)
  return inspection.candidates
}

export async function fetchPubPartsSharedLinkCandidateFile(
  candidate: PubPartsSharedLinkCandidate,
  env: FetchSharedLinkCandidateEnv = {},
): Promise<ImportedReferenceFile> {
  if (
    candidate.kind !== 'supported-direct-file' ||
    candidate.downloadUrl === undefined ||
    !isImportSupportedFileType(candidate.fileType)
  ) {
    throw new Error('This PubParts source candidate is not currently stageable.')
  }

  const fetchRef = env.fetchRef ?? fetch
  const urlRef = env.urlRef ?? URL
  const response = await fetchRef(candidate.downloadUrl)
  if (!response.ok) {
    throw new Error(`PubParts shared source fetch failed with status ${response.status}.`)
  }

  const blob = await response.blob()
  const fileLike =
    env.fileCtor !== undefined
      ? new env.fileCtor([blob], candidate.fileName, {
          type: blob.type,
        })
      : blob

  return {
    fileName: candidate.fileName,
    fileType: candidate.fileType,
    objectUrl: urlRef.createObjectURL(fileLike),
  }
}

const getArchiveCandidateExpectedId = (
  stagedRecord: PubPartsStagedSourceRecord,
  normalizedArchivePath: string,
): string => `${stagedRecord.stagedSourceId}:archive-entry:${normalizedArchivePath}`

const validateStageableArchiveCandidate = (
  stagedRecord: PubPartsStagedSourceRecord,
  candidate: PubPartsSharedLinkCandidate,
): { normalizedArchivePath: string; fileType: ReferenceFileType } => {
  const sourceUrl = stagedRecord.sourceCandidateUrl.trim()
  if (
    candidate.kind !== 'supported-archive-entry' ||
    !candidate.selectable ||
    candidate.normalizedArchivePath === undefined ||
    candidate.archiveEntryClassification !== 'supported' ||
    candidate.archiveEntryBlockedReason !== undefined ||
    candidate.sourceUrl !== sourceUrl ||
    !isImportSupportedFileType(candidate.fileType)
  ) {
    throw new PubPartsSharedLinkArchiveExtractionError(
      'This PubParts archive candidate is not currently stageable.',
    )
  }

  if (
    candidate.candidateId !==
    getArchiveCandidateExpectedId(stagedRecord, candidate.normalizedArchivePath)
  ) {
    throw new PubPartsSharedLinkArchiveExtractionError(
      'This PubParts archive candidate no longer matches the staged source.',
    )
  }

  return {
    normalizedArchivePath: candidate.normalizedArchivePath,
    fileType: candidate.fileType,
  }
}

const resolveFileCtor = (fileCtor: typeof File | undefined): typeof File | undefined => {
  if (fileCtor !== undefined) {
    return fileCtor
  }

  return typeof File === 'undefined' ? undefined : File
}

export async function materializePubPartsSharedLinkArchiveCandidateFiles(
  stagedRecord: PubPartsStagedSourceRecord,
  candidates: PubPartsSharedLinkCandidate[],
  env: MaterializeSharedLinkArchiveEnv = {},
): Promise<ImportedReferenceFile[]> {
  if (candidates.length === 0) {
    return []
  }

  const validatedCandidates = candidates.map((candidate) =>
    validateStageableArchiveCandidate(stagedRecord, candidate),
  )
  const sourceUrl = stagedRecord.sourceCandidateUrl.trim()
  let archiveBlob: Blob
  try {
    archiveBlob = env.archiveBlob ?? (await fetchPubPartsSharedLinkArchiveBlob(sourceUrl, env))
  } catch (error) {
    throw error instanceof Error
      ? new PubPartsSharedLinkArchiveExtractionError(error.message)
      : new PubPartsSharedLinkArchiveExtractionError()
  }
  let extractedEntries: Awaited<ReturnType<typeof extractPubPartsZipArchiveEntries>>
  try {
    extractedEntries = await extractPubPartsZipArchiveEntries(
      archiveBlob,
      validatedCandidates.map((candidate) => candidate.normalizedArchivePath),
    )
  } catch (error) {
    throw error instanceof Error
      ? new PubPartsSharedLinkArchiveExtractionError(error.message)
      : new PubPartsSharedLinkArchiveExtractionError()
  }

  const extractedEntriesByPath = new Map(
    extractedEntries.map((entry) => [entry.normalizedPath, entry]),
  )
  const urlRef = env.urlRef ?? URL
  const fileCtor = resolveFileCtor(env.fileCtor)

  return validatedCandidates.map((candidate) => {
    const extractedEntry = extractedEntriesByPath.get(candidate.normalizedArchivePath)
    if (extractedEntry === undefined || extractedEntry.fileType !== candidate.fileType) {
      throw new PubPartsSharedLinkArchiveExtractionError(
        'The selected ZIP entry no longer matches the inspected archive candidate.',
      )
    }

    const fileLike =
      fileCtor !== undefined
        ? new fileCtor([extractedEntry.blob], extractedEntry.fileName, {
            type: extractedEntry.blob.type,
          })
        : extractedEntry.blob

    return {
      fileName: extractedEntry.fileName,
      fileType: extractedEntry.fileType,
      objectUrl: urlRef.createObjectURL(fileLike),
    }
  })
}
