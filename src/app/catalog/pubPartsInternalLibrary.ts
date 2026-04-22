import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import type {
  PubPartsZipArchiveEntryBlockedReason,
  PubPartsZipArchiveEntryClassification,
  PubPartsZipArchiveEntryMetadata,
  PubPartsZipArchiveEntrySupportState,
  PubPartsZipArchiveExtractedEntry,
} from './pubPartsZipArchive'

export const pubPartsInternalLibraryRootPath = 'Internal Library/PubParts'
export const pubPartsInternalLibrarySchemaVersion = 1 as const

const pubPartsInternalLibraryArchiveInspectionSchemaVersion = 1 as const

export type PubPartsInternalLibraryStorageEstimate = {
  usage?: number
  quota?: number
}

export type PubPartsInternalLibraryWritableFileLike = {
  write: (data: Blob | string | Uint8Array) => Promise<void> | void
  close: () => Promise<void> | void
}

export type PubPartsInternalLibraryFileHandleLike = {
  getFile: () => Promise<Blob>
  createWritable: () => Promise<PubPartsInternalLibraryWritableFileLike>
}

export type PubPartsInternalLibraryDirectoryHandleLike = {
  getDirectoryHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<PubPartsInternalLibraryDirectoryHandleLike>
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<PubPartsInternalLibraryFileHandleLike>
}

export type PubPartsInternalLibraryStorageManager = {
  estimate?: () => Promise<PubPartsInternalLibraryStorageEstimate>
  getDirectory?: () => Promise<PubPartsInternalLibraryDirectoryHandleLike>
}

export type PubPartsInternalLibraryEnv = {
  storageManager?: PubPartsInternalLibraryStorageManager | null
}

export type PubPartsInternalLibraryCapabilityState =
  | 'available'
  | 'unsupported'
  | 'unavailable'
  | 'quota-unavailable'
  | 'error'

export type PubPartsInternalLibraryCapability = {
  state: PubPartsInternalLibraryCapabilityState
  rootPath: typeof pubPartsInternalLibraryRootPath
  usageBytes: number | null
  quotaBytes: number | null
  message: string
}

export type PubPartsInternalLibrarySourceVersionKind =
  | 'archiveLastUpdated'
  | 'sourceLastUpdated'
  | 'unversioned'

export type PubPartsInternalLibraryInspectionStatus =
  | 'not-inspected'
  | 'metadata-inspected'
  | 'extracted-candidates'

export type PubPartsInternalLibraryImportStatus =
  | 'not-imported'
  | 'ready-for-import-review'

export type PubPartsInternalLibraryPathInput = {
  catalogItemId: string
  catalogItemLabel: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceFileName?: string
  archiveFileName?: string
  extractedArchivePath?: string
  importableFileName?: string
}

export type PubPartsInternalLibraryItemPaths = {
  rootPath: typeof pubPartsInternalLibraryRootPath
  partsRootPath: string
  itemSlug: string
  sourceVersionKey: string
  sourceVersionKind: PubPartsInternalLibrarySourceVersionKind
  itemFolderPath: string
  manifestPath: string
  sourceFolderPath: string
  sourceFilePath: string
  archiveFolderPath: string
  archiveFilePath: string
  inspectionsFolderPath: string
  archiveManifestPath: string
  extractedFolderPath: string
  extractedEntryPath: string
  importableFolderPath: string
  importableFilePath: string
}

export type PubPartsInternalLibraryExtractedCandidate = {
  archivePath: string
  normalizedPath: string
  fileName: string
  fileType?: string
  fileSizeBytes?: number
  extractedPath: string
  importablePath: string
}

export type PubPartsInternalLibraryManifest = {
  schemaVersion: typeof pubPartsInternalLibrarySchemaVersion
  providerId: 'pubparts'
  providerName: 'PubParts'
  catalogItemId: string
  catalogItemLabel: string
  itemSlug: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  sourceUrl?: string
  sourceVersionKey: string
  sourceVersionKind: PubPartsInternalLibrarySourceVersionKind
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceFileName?: string
  sourceByteSize?: number
  inspectionStatus: PubPartsInternalLibraryInspectionStatus
  extractedCandidates: PubPartsInternalLibraryExtractedCandidate[]
  importStatus: PubPartsInternalLibraryImportStatus
  createdAt: string
  updatedAt: string
}

export type PubPartsInternalLibraryManifestInput = {
  catalogItemId: string
  catalogItemLabel: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  sourceUrl?: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceFileName?: string
  sourceByteSize?: number
  inspectionStatus?: PubPartsInternalLibraryInspectionStatus
  extractedCandidates?: PubPartsInternalLibraryExtractedCandidate[]
  importStatus?: PubPartsInternalLibraryImportStatus
  createdAt?: string
  updatedAt?: string
  now?: () => Date
}

export type PubPartsInternalLibraryArchiveInspectionManifest = {
  schemaVersion: typeof pubPartsInternalLibraryArchiveInspectionSchemaVersion
  providerId: 'pubparts'
  stagedSourceId: string
  catalogItemId: string
  sourceCandidateUrl: string
  sourceVersionKey: string
  inspectedAt: string
  entries: PubPartsZipArchiveEntryMetadata[]
}

export type PubPartsInternalLibraryArchiveCacheWriteInput = {
  stagedRecord: PubPartsStagedSourceRecord
  archiveBlob: Blob
  entries: PubPartsZipArchiveEntryMetadata[]
  sourceFileName?: string
  createdAt?: string
  updatedAt?: string
  env?: PubPartsInternalLibraryEnv
}

export type PubPartsInternalLibraryArchiveCacheHit = {
  manifest: PubPartsInternalLibraryManifest
  archiveInspection: PubPartsInternalLibraryArchiveInspectionManifest
  archiveBlob: Blob
  entries: PubPartsZipArchiveEntryMetadata[]
  paths: PubPartsInternalLibraryItemPaths
}

export type PubPartsInternalLibraryExtractedCandidateWriteInput = {
  stagedRecord: PubPartsStagedSourceRecord
  extractedEntry: PubPartsZipArchiveExtractedEntry
  env?: PubPartsInternalLibraryEnv
}

const resolveDefaultStorageManager = (): PubPartsInternalLibraryStorageManager | null => {
  if (typeof navigator === 'undefined') {
    return null
  }

  return (
    (navigator as unknown as { storage?: PubPartsInternalLibraryStorageManager }).storage ?? null
  )
}

const isFiniteNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const archiveEntryClassifications = new Set<PubPartsZipArchiveEntryClassification>([
  'supported',
  'unsupported',
  'unsafe',
  'directory',
  'blocked',
])

const archiveEntrySupportStates = new Set<PubPartsZipArchiveEntrySupportState>([
  'import-supported',
  'recognized-source-unsupported',
  'unsupported',
  'none',
])

const archiveEntryBlockedReasons = new Set<PubPartsZipArchiveEntryBlockedReason>([
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

const isArchiveEntryClassification = (
  value: unknown,
): value is PubPartsZipArchiveEntryClassification =>
  archiveEntryClassifications.has(value as PubPartsZipArchiveEntryClassification)

const isArchiveEntrySupportState = (
  value: unknown,
): value is PubPartsZipArchiveEntrySupportState =>
  archiveEntrySupportStates.has(value as PubPartsZipArchiveEntrySupportState)

const isArchiveEntryBlockedReason = (
  value: unknown,
): value is PubPartsZipArchiveEntryBlockedReason =>
  archiveEntryBlockedReasons.has(value as PubPartsZipArchiveEntryBlockedReason)

const sanitizeOptionalNumber = (value: unknown): number | undefined =>
  isFiniteNonNegativeNumber(value) ? value : undefined

const slugifyPathPart = (value: string, fallback: string): string => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/gu, '-')
    .replace(/^-+|-+$/gu, '')

  return slug.length > 0 ? slug.slice(0, 96) : fallback
}

const slugifyPubPartsCatalogItem = (catalogItemLabel: string, catalogItemId: string): string =>
  slugifyPathPart(`${catalogItemLabel}-${catalogItemId}`, 'pubparts-item')

const resolveSourceVersion = (
  input: Pick<PubPartsInternalLibraryPathInput, 'sourceLastUpdated' | 'archiveLastUpdated'>,
): {
  sourceVersionKey: string
  sourceVersionKind: PubPartsInternalLibrarySourceVersionKind
} => {
  const archiveLastUpdated = trimOptionalString(input.archiveLastUpdated)
  if (archiveLastUpdated !== undefined) {
    return {
      sourceVersionKey: slugifyPathPart(archiveLastUpdated, 'source-v1'),
      sourceVersionKind: 'archiveLastUpdated',
    }
  }

  const sourceLastUpdated = trimOptionalString(input.sourceLastUpdated)
  if (sourceLastUpdated !== undefined) {
    return {
      sourceVersionKey: slugifyPathPart(sourceLastUpdated, 'source-v1'),
      sourceVersionKind: 'sourceLastUpdated',
    }
  }

  return {
    sourceVersionKey: 'source-v1',
    sourceVersionKind: 'unversioned',
  }
}

const getFileName = (value: string | undefined, fallback: string): string => {
  const trimmedValue = trimOptionalString(value)
  if (trimmedValue === undefined) {
    return fallback
  }

  const normalizedValue = trimmedValue.replace(/\\/gu, '/')
  const fileName = normalizedValue
    .split('/')
    .filter((part) => part.length > 0)
    .at(-1)

  return slugifyPathPart(fileName ?? fallback, fallback)
}

const normalizeSafeRelativePath = (value: string | undefined, fallback: string): string => {
  const trimmedValue = trimOptionalString(value)
  if (trimmedValue === undefined) {
    return fallback
  }

  const segments = trimmedValue
    .replace(/\\/gu, '/')
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
    .map((segment) => slugifyPathPart(segment, 'entry'))

  return segments.length > 0 ? segments.join('/') : fallback
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${Math.round(bytes)} B`
  }

  const units = ['KiB', 'MiB', 'GiB', 'TiB']
  let size = bytes / 1024
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const splitInternalLibraryPath = (path: string): string[] =>
  path.split('/').filter((segment) => segment.length > 0)

const resolveInternalLibraryDirectory = async (
  rootDirectory: PubPartsInternalLibraryDirectoryHandleLike,
  path: string,
  options: { create: boolean },
): Promise<PubPartsInternalLibraryDirectoryHandleLike | null> => {
  let directory = rootDirectory
  try {
    for (const segment of splitInternalLibraryPath(path)) {
      directory = await directory.getDirectoryHandle(segment, options)
    }
  } catch {
    return null
  }

  return directory
}

const resolveInternalLibraryFile = async (
  rootDirectory: PubPartsInternalLibraryDirectoryHandleLike,
  path: string,
  options: { create: boolean },
): Promise<PubPartsInternalLibraryFileHandleLike | null> => {
  const segments = splitInternalLibraryPath(path)
  const fileName = segments.at(-1)
  if (fileName === undefined) {
    return null
  }

  const parentPath = segments.slice(0, -1).join('/')
  const parentDirectory = await resolveInternalLibraryDirectory(rootDirectory, parentPath, options)
  if (parentDirectory === null) {
    return null
  }

  try {
    return await parentDirectory.getFileHandle(fileName, options)
  } catch {
    return null
  }
}

const writeInternalLibraryFile = async (
  rootDirectory: PubPartsInternalLibraryDirectoryHandleLike,
  path: string,
  data: Blob | string | Uint8Array,
): Promise<void> => {
  const fileHandle = await resolveInternalLibraryFile(rootDirectory, path, { create: true })
  if (fileHandle === null) {
    throw new Error('OPFS Internal Library file could not be opened for writing.')
  }

  const writable = await fileHandle.createWritable()
  try {
    await writable.write(data)
  } finally {
    await writable.close()
  }
}

const readInternalLibraryBlob = async (
  rootDirectory: PubPartsInternalLibraryDirectoryHandleLike,
  path: string,
): Promise<Blob | null> => {
  const fileHandle = await resolveInternalLibraryFile(rootDirectory, path, { create: false })
  if (fileHandle === null) {
    return null
  }

  try {
    return await fileHandle.getFile()
  } catch {
    return null
  }
}

const readInternalLibraryJson = async (
  rootDirectory: PubPartsInternalLibraryDirectoryHandleLike,
  path: string,
): Promise<unknown | null> => {
  const blob = await readInternalLibraryBlob(rootDirectory, path)
  if (blob === null) {
    return null
  }

  try {
    return JSON.parse(await blob.text()) as unknown
  } catch {
    return null
  }
}

const sanitizePubPartsZipArchiveEntryMetadata = (
  value: unknown,
): PubPartsZipArchiveEntryMetadata | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsZipArchiveEntryMetadata>
  const archivePath = trimOptionalString(candidate.archivePath)
  const normalizedPath = trimOptionalString(candidate.normalizedPath)
  const fileName = trimOptionalString(candidate.fileName)
  const description = trimOptionalString(candidate.description)

  if (
    archivePath === undefined ||
    normalizedPath === undefined ||
    fileName === undefined ||
    description === undefined ||
    !isArchiveEntryClassification(candidate.classification) ||
    !isArchiveEntrySupportState(candidate.supportState) ||
    typeof candidate.isDirectory !== 'boolean' ||
    typeof candidate.selectable !== 'boolean'
  ) {
    return null
  }

  const blockedReason = candidate.blockedReason
  if (blockedReason !== undefined && !isArchiveEntryBlockedReason(blockedReason)) {
    return null
  }

  return {
    archivePath,
    normalizedPath,
    fileName,
    fileType: trimOptionalString(candidate.fileType),
    classification: candidate.classification,
    supportState: candidate.supportState,
    blockedReason,
    description,
    fileSizeBytes: sanitizeOptionalNumber(candidate.fileSizeBytes),
    compressedSizeBytes: sanitizeOptionalNumber(candidate.compressedSizeBytes),
    lastModifiedAt: trimOptionalString(candidate.lastModifiedAt),
    isDirectory: candidate.isDirectory,
    selectable: candidate.selectable,
  }
}

export async function resolvePubPartsInternalLibraryCapability(
  env: PubPartsInternalLibraryEnv = {},
): Promise<PubPartsInternalLibraryCapability> {
  const storageManager = env.storageManager ?? resolveDefaultStorageManager()
  const rootPath = pubPartsInternalLibraryRootPath

  if (storageManager === null || typeof storageManager.getDirectory !== 'function') {
    return {
      state: 'unsupported',
      rootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library is unavailable in this browser.',
    }
  }

  try {
    await storageManager.getDirectory()
  } catch {
    return {
      state: 'unavailable',
      rootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library could not be opened right now.',
    }
  }

  if (typeof storageManager.estimate !== 'function') {
    return {
      state: 'quota-unavailable',
      rootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library is available, but browser quota is unavailable.',
    }
  }

  let estimate: PubPartsInternalLibraryStorageEstimate
  try {
    estimate = await storageManager.estimate()
  } catch {
    return {
      state: 'error',
      rootPath,
      usageBytes: null,
      quotaBytes: null,
      message: 'OPFS Internal Library quota check failed.',
    }
  }

  const usageBytes = isFiniteNonNegativeNumber(estimate.usage) ? estimate.usage : null
  const quotaBytes = isFiniteNonNegativeNumber(estimate.quota) ? estimate.quota : null

  if (usageBytes === null || quotaBytes === null) {
    return {
      state: 'quota-unavailable',
      rootPath,
      usageBytes,
      quotaBytes,
      message: 'OPFS Internal Library is available, but browser quota is unavailable.',
    }
  }

  return {
    state: 'available',
    rootPath,
    usageBytes,
    quotaBytes,
    message: `OPFS Internal Library is available: ${formatBytes(usageBytes)} used of ${formatBytes(quotaBytes)}.`,
  }
}

export function resolvePubPartsInternalLibraryItemPaths(
  input: PubPartsInternalLibraryPathInput,
): PubPartsInternalLibraryItemPaths {
  const itemSlug = slugifyPubPartsCatalogItem(input.catalogItemLabel, input.catalogItemId)
  const { sourceVersionKey, sourceVersionKind } = resolveSourceVersion(input)
  const partsRootPath = `${pubPartsInternalLibraryRootPath}/parts`
  const itemFolderPath = `${partsRootPath}/${itemSlug}`
  const manifestPath = `${itemFolderPath}/pubparts-source.json`
  const sourceFolderPath = `${itemFolderPath}/source/${sourceVersionKey}`
  const archiveFolderPath = `${itemFolderPath}/archives/${sourceVersionKey}`
  const inspectionsFolderPath = `${itemFolderPath}/inspections/${sourceVersionKey}`
  const extractedFolderPath = `${itemFolderPath}/extracted/${sourceVersionKey}`
  const importableFolderPath = `${itemFolderPath}/importable/${sourceVersionKey}`
  const sourceFileName = getFileName(input.sourceFileName, 'source-file')
  const archiveFileName = getFileName(input.archiveFileName, 'source-archive.zip')
  const extractedArchivePath = normalizeSafeRelativePath(
    input.extractedArchivePath,
    'selected-entry',
  )
  const importableFileName = getFileName(input.importableFileName, 'importable-file')

  return {
    rootPath: pubPartsInternalLibraryRootPath,
    partsRootPath,
    itemSlug,
    sourceVersionKey,
    sourceVersionKind,
    itemFolderPath,
    manifestPath,
    sourceFolderPath,
    sourceFilePath: `${sourceFolderPath}/${sourceFileName}`,
    archiveFolderPath,
    archiveFilePath: `${archiveFolderPath}/${archiveFileName}`,
    inspectionsFolderPath,
    archiveManifestPath: `${inspectionsFolderPath}/archive-manifest.json`,
    extractedFolderPath,
    extractedEntryPath: `${extractedFolderPath}/${extractedArchivePath}`,
    importableFolderPath,
    importableFilePath: `${importableFolderPath}/${importableFileName}`,
  }
}

export function buildPubPartsInternalLibraryManifest(
  input: PubPartsInternalLibraryManifestInput,
): PubPartsInternalLibraryManifest {
  const paths = resolvePubPartsInternalLibraryItemPaths(input)
  const timestamp = (input.now ?? (() => new Date()))().toISOString()
  const sourceByteSize = isFiniteNonNegativeNumber(input.sourceByteSize)
    ? input.sourceByteSize
    : undefined

  return {
    schemaVersion: pubPartsInternalLibrarySchemaVersion,
    providerId: 'pubparts',
    providerName: 'PubParts',
    catalogItemId: input.catalogItemId,
    catalogItemLabel: input.catalogItemLabel,
    itemSlug: paths.itemSlug,
    sourceCandidateUrl: input.sourceCandidateUrl.trim(),
    linkedArchiveUrl: input.linkedArchiveUrl.trim(),
    sourcePageUrl: trimOptionalString(input.sourcePageUrl),
    sourceUrl: trimOptionalString(input.sourceUrl),
    sourceVersionKey: paths.sourceVersionKey,
    sourceVersionKind: paths.sourceVersionKind,
    sourceLastUpdated: trimOptionalString(input.sourceLastUpdated),
    archiveLastUpdated: trimOptionalString(input.archiveLastUpdated),
    sourceFileName: trimOptionalString(input.sourceFileName),
    sourceByteSize,
    inspectionStatus: input.inspectionStatus ?? 'not-inspected',
    extractedCandidates: input.extractedCandidates ?? [],
    importStatus: input.importStatus ?? 'not-imported',
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  }
}

const buildArchiveCacheManifestInput = (
  stagedRecord: PubPartsStagedSourceRecord,
  archiveBlob: Blob,
  options: Pick<
    PubPartsInternalLibraryArchiveCacheWriteInput,
    'sourceFileName' | 'createdAt' | 'updatedAt'
  > = {},
): PubPartsInternalLibraryManifestInput => ({
  catalogItemId: stagedRecord.catalogItemId,
  catalogItemLabel: stagedRecord.catalogItemLabel,
  sourceCandidateUrl: stagedRecord.sourceCandidateUrl,
  linkedArchiveUrl: stagedRecord.linkedArchiveUrl,
  sourcePageUrl: stagedRecord.sourcePageUrl,
  sourceUrl: stagedRecord.sourceUrl,
  sourceLastUpdated: stagedRecord.sourceLastUpdated,
  archiveLastUpdated: stagedRecord.archiveLastUpdated,
  sourceFileName: options.sourceFileName,
  sourceByteSize: archiveBlob.size,
  inspectionStatus: 'metadata-inspected',
  importStatus: 'not-imported',
  createdAt: options.createdAt,
  updatedAt: options.updatedAt,
})

const buildArchiveInspectionManifest = (
  stagedRecord: PubPartsStagedSourceRecord,
  manifest: PubPartsInternalLibraryManifest,
  entries: PubPartsZipArchiveEntryMetadata[],
): PubPartsInternalLibraryArchiveInspectionManifest => ({
  schemaVersion: pubPartsInternalLibraryArchiveInspectionSchemaVersion,
  providerId: 'pubparts',
  stagedSourceId: stagedRecord.stagedSourceId,
  catalogItemId: stagedRecord.catalogItemId,
  sourceCandidateUrl: stagedRecord.sourceCandidateUrl.trim(),
  sourceVersionKey: manifest.sourceVersionKey,
  inspectedAt: manifest.updatedAt,
  entries,
})

const sanitizePubPartsInternalLibraryArchiveInspectionManifest = (
  rawValue: unknown,
): PubPartsInternalLibraryArchiveInspectionManifest | null => {
  if (typeof rawValue !== 'object' || rawValue === null) {
    return null
  }

  const candidate = rawValue as Partial<PubPartsInternalLibraryArchiveInspectionManifest>
  const stagedSourceId = trimOptionalString(candidate.stagedSourceId)
  const catalogItemId = trimOptionalString(candidate.catalogItemId)
  const sourceCandidateUrl = trimOptionalString(candidate.sourceCandidateUrl)
  const sourceVersionKey = trimOptionalString(candidate.sourceVersionKey)
  const inspectedAt = trimOptionalString(candidate.inspectedAt)
  if (
    candidate.schemaVersion !== pubPartsInternalLibraryArchiveInspectionSchemaVersion ||
    candidate.providerId !== 'pubparts' ||
    stagedSourceId === undefined ||
    catalogItemId === undefined ||
    sourceCandidateUrl === undefined ||
    sourceVersionKey === undefined ||
    inspectedAt === undefined ||
    !Array.isArray(candidate.entries)
  ) {
    return null
  }

  const entries = candidate.entries.map(sanitizePubPartsZipArchiveEntryMetadata)
  if (entries.some((entry) => entry === null)) {
    return null
  }

  return {
    schemaVersion: pubPartsInternalLibraryArchiveInspectionSchemaVersion,
    providerId: 'pubparts',
    stagedSourceId,
    catalogItemId,
    sourceCandidateUrl,
    sourceVersionKey,
    inspectedAt,
    entries: entries as PubPartsZipArchiveEntryMetadata[],
  }
}

const resolveArchiveCachePaths = (
  stagedRecord: PubPartsStagedSourceRecord,
  sourceFileName?: string,
): PubPartsInternalLibraryItemPaths =>
  resolvePubPartsInternalLibraryItemPaths({
    catalogItemId: stagedRecord.catalogItemId,
    catalogItemLabel: stagedRecord.catalogItemLabel,
    sourceLastUpdated: stagedRecord.sourceLastUpdated,
    archiveLastUpdated: stagedRecord.archiveLastUpdated,
    sourceFileName,
    archiveFileName: sourceFileName,
  })

const isArchiveCacheHitForStagedRecord = (
  hit: Pick<
    PubPartsInternalLibraryArchiveCacheHit,
    'manifest' | 'archiveInspection'
  >,
  stagedRecord: PubPartsStagedSourceRecord,
): boolean => {
  const expectedPaths = resolveArchiveCachePaths(stagedRecord, hit.manifest.sourceFileName)
  return (
    hit.manifest.catalogItemId === stagedRecord.catalogItemId &&
    hit.manifest.providerId === 'pubparts' &&
    hit.manifest.sourceCandidateUrl === stagedRecord.sourceCandidateUrl.trim() &&
    hit.manifest.linkedArchiveUrl === stagedRecord.linkedArchiveUrl.trim() &&
    hit.manifest.sourceVersionKey === expectedPaths.sourceVersionKey &&
    hit.manifest.sourceVersionKind === expectedPaths.sourceVersionKind &&
    hit.archiveInspection.stagedSourceId === stagedRecord.stagedSourceId &&
    hit.archiveInspection.catalogItemId === stagedRecord.catalogItemId &&
    hit.archiveInspection.providerId === 'pubparts' &&
    hit.archiveInspection.sourceCandidateUrl === stagedRecord.sourceCandidateUrl.trim() &&
    hit.archiveInspection.sourceVersionKey === hit.manifest.sourceVersionKey
  )
}

const isSourceVersionKind = (
  value: unknown,
): value is PubPartsInternalLibrarySourceVersionKind =>
  value === 'archiveLastUpdated' || value === 'sourceLastUpdated' || value === 'unversioned'

const isInspectionStatus = (
  value: unknown,
): value is PubPartsInternalLibraryInspectionStatus =>
  value === 'not-inspected' ||
  value === 'metadata-inspected' ||
  value === 'extracted-candidates'

const isImportStatus = (value: unknown): value is PubPartsInternalLibraryImportStatus =>
  value === 'not-imported' || value === 'ready-for-import-review'

const sanitizeExtractedCandidate = (
  value: unknown,
): PubPartsInternalLibraryExtractedCandidate | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsInternalLibraryExtractedCandidate>
  const archivePath = trimOptionalString(candidate.archivePath)
  const normalizedPath = trimOptionalString(candidate.normalizedPath)
  const fileName = trimOptionalString(candidate.fileName)
  const extractedPath = trimOptionalString(candidate.extractedPath)
  const importablePath = trimOptionalString(candidate.importablePath)

  if (
    archivePath === undefined ||
    normalizedPath === undefined ||
    fileName === undefined ||
    extractedPath === undefined ||
    importablePath === undefined
  ) {
    return null
  }

  return {
    archivePath,
    normalizedPath,
    fileName,
    fileType: trimOptionalString(candidate.fileType),
    fileSizeBytes: isFiniteNonNegativeNumber(candidate.fileSizeBytes)
      ? candidate.fileSizeBytes
      : undefined,
    extractedPath,
    importablePath,
  }
}

export function sanitizePubPartsInternalLibraryManifest(
  rawValue: unknown,
): PubPartsInternalLibraryManifest | null {
  if (typeof rawValue !== 'object' || rawValue === null) {
    return null
  }

  const candidate = rawValue as Partial<PubPartsInternalLibraryManifest>
  const catalogItemId = trimOptionalString(candidate.catalogItemId)
  const catalogItemLabel = trimOptionalString(candidate.catalogItemLabel)
  const itemSlug = trimOptionalString(candidate.itemSlug)
  const sourceCandidateUrl = trimOptionalString(candidate.sourceCandidateUrl)
  const linkedArchiveUrl = trimOptionalString(candidate.linkedArchiveUrl)
  const sourceVersionKey = trimOptionalString(candidate.sourceVersionKey)
  const createdAt = trimOptionalString(candidate.createdAt)
  const updatedAt = trimOptionalString(candidate.updatedAt)

  if (
    candidate.schemaVersion !== pubPartsInternalLibrarySchemaVersion ||
    candidate.providerId !== 'pubparts' ||
    candidate.providerName !== 'PubParts' ||
    catalogItemId === undefined ||
    catalogItemLabel === undefined ||
    itemSlug === undefined ||
    sourceCandidateUrl === undefined ||
    linkedArchiveUrl === undefined ||
    sourceVersionKey === undefined ||
    !isSourceVersionKind(candidate.sourceVersionKind) ||
    !isInspectionStatus(candidate.inspectionStatus) ||
    !isImportStatus(candidate.importStatus) ||
    createdAt === undefined ||
    updatedAt === undefined ||
    !Array.isArray(candidate.extractedCandidates)
  ) {
    return null
  }

  const extractedCandidates = candidate.extractedCandidates.map(sanitizeExtractedCandidate)
  if (extractedCandidates.some((entry) => entry === null)) {
    return null
  }

  return {
    schemaVersion: pubPartsInternalLibrarySchemaVersion,
    providerId: 'pubparts',
    providerName: 'PubParts',
    catalogItemId,
    catalogItemLabel,
    itemSlug,
    sourceCandidateUrl,
    linkedArchiveUrl,
    sourcePageUrl: trimOptionalString(candidate.sourcePageUrl),
    sourceUrl: trimOptionalString(candidate.sourceUrl),
    sourceVersionKey,
    sourceVersionKind: candidate.sourceVersionKind,
    sourceLastUpdated: trimOptionalString(candidate.sourceLastUpdated),
    archiveLastUpdated: trimOptionalString(candidate.archiveLastUpdated),
    sourceFileName: trimOptionalString(candidate.sourceFileName),
    sourceByteSize: isFiniteNonNegativeNumber(candidate.sourceByteSize)
      ? candidate.sourceByteSize
      : undefined,
    inspectionStatus: candidate.inspectionStatus,
    extractedCandidates: extractedCandidates as PubPartsInternalLibraryExtractedCandidate[],
    importStatus: candidate.importStatus,
    createdAt,
    updatedAt,
  }
}

export async function writePubPartsInternalLibraryArchiveCache(
  input: PubPartsInternalLibraryArchiveCacheWriteInput,
): Promise<PubPartsInternalLibraryArchiveCacheHit> {
  const storageManager = input.env?.storageManager ?? resolveDefaultStorageManager()
  if (storageManager === null || typeof storageManager.getDirectory !== 'function') {
    throw new Error('OPFS Internal Library is unavailable in this browser.')
  }

  const sanitizedEntries = input.entries.map(sanitizePubPartsZipArchiveEntryMetadata)
  if (sanitizedEntries.some((entry) => entry === null)) {
    throw new Error('PubParts archive inspection metadata could not be cached.')
  }

  const entries = sanitizedEntries as PubPartsZipArchiveEntryMetadata[]
  const manifest = buildPubPartsInternalLibraryManifest(
    buildArchiveCacheManifestInput(input.stagedRecord, input.archiveBlob, {
      sourceFileName: input.sourceFileName,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    }),
  )
  const paths = resolveArchiveCachePaths(input.stagedRecord, manifest.sourceFileName)
  const archiveInspection = buildArchiveInspectionManifest(input.stagedRecord, manifest, entries)
  const rootDirectory = await storageManager.getDirectory()

  await writeInternalLibraryFile(
    rootDirectory,
    paths.manifestPath,
    JSON.stringify(manifest, null, 2),
  )
  await writeInternalLibraryFile(rootDirectory, paths.archiveFilePath, input.archiveBlob)
  await writeInternalLibraryFile(
    rootDirectory,
    paths.archiveManifestPath,
    JSON.stringify(archiveInspection, null, 2),
  )

  return {
    manifest,
    archiveInspection,
    archiveBlob: input.archiveBlob,
    entries,
    paths,
  }
}

export async function readPubPartsInternalLibraryArchiveCache(
  stagedRecord: PubPartsStagedSourceRecord,
  env: PubPartsInternalLibraryEnv = {},
): Promise<PubPartsInternalLibraryArchiveCacheHit | null> {
  const storageManager = env.storageManager ?? resolveDefaultStorageManager()
  if (storageManager === null || typeof storageManager.getDirectory !== 'function') {
    return null
  }

  let rootDirectory: PubPartsInternalLibraryDirectoryHandleLike
  try {
    rootDirectory = await storageManager.getDirectory()
  } catch {
    return null
  }

  const initialPaths = resolveArchiveCachePaths(stagedRecord)
  const manifest = sanitizePubPartsInternalLibraryManifest(
    await readInternalLibraryJson(rootDirectory, initialPaths.manifestPath),
  )
  if (manifest === null) {
    return null
  }

  const paths = resolveArchiveCachePaths(stagedRecord, manifest.sourceFileName)
  const archiveInspection = sanitizePubPartsInternalLibraryArchiveInspectionManifest(
    await readInternalLibraryJson(rootDirectory, paths.archiveManifestPath),
  )
  const archiveBlob = await readInternalLibraryBlob(rootDirectory, paths.archiveFilePath)
  if (archiveInspection === null || archiveBlob === null) {
    return null
  }

  const hit: PubPartsInternalLibraryArchiveCacheHit = {
    manifest,
    archiveInspection,
    archiveBlob,
    entries: archiveInspection.entries,
    paths,
  }
  if (!isArchiveCacheHitForStagedRecord(hit, stagedRecord)) {
    return null
  }

  return hit
}

export async function writePubPartsInternalLibraryExtractedCandidate(
  input: PubPartsInternalLibraryExtractedCandidateWriteInput,
): Promise<PubPartsInternalLibraryExtractedCandidate> {
  const storageManager = input.env?.storageManager ?? resolveDefaultStorageManager()
  if (storageManager === null || typeof storageManager.getDirectory !== 'function') {
    throw new Error('OPFS Internal Library is unavailable in this browser.')
  }

  const paths = resolvePubPartsInternalLibraryItemPaths({
    catalogItemId: input.stagedRecord.catalogItemId,
    catalogItemLabel: input.stagedRecord.catalogItemLabel,
    sourceLastUpdated: input.stagedRecord.sourceLastUpdated,
    archiveLastUpdated: input.stagedRecord.archiveLastUpdated,
    extractedArchivePath: input.extractedEntry.normalizedPath,
    importableFileName: input.extractedEntry.fileName,
  })
  const rootDirectory = await storageManager.getDirectory()
  await writeInternalLibraryFile(rootDirectory, paths.extractedEntryPath, input.extractedEntry.blob)
  await writeInternalLibraryFile(rootDirectory, paths.importableFilePath, input.extractedEntry.blob)

  const extractedCandidate: PubPartsInternalLibraryExtractedCandidate = {
    archivePath: input.extractedEntry.archivePath,
    normalizedPath: input.extractedEntry.normalizedPath,
    fileName: input.extractedEntry.fileName,
    fileType: input.extractedEntry.fileType,
    fileSizeBytes: input.extractedEntry.blob.size,
    extractedPath: paths.extractedEntryPath,
    importablePath: paths.importableFilePath,
  }

  const currentManifest =
    sanitizePubPartsInternalLibraryManifest(
      await readInternalLibraryJson(rootDirectory, paths.manifestPath),
    ) ??
    buildPubPartsInternalLibraryManifest({
      catalogItemId: input.stagedRecord.catalogItemId,
      catalogItemLabel: input.stagedRecord.catalogItemLabel,
      sourceCandidateUrl: input.stagedRecord.sourceCandidateUrl,
      linkedArchiveUrl: input.stagedRecord.linkedArchiveUrl,
      sourcePageUrl: input.stagedRecord.sourcePageUrl,
      sourceUrl: input.stagedRecord.sourceUrl,
      sourceLastUpdated: input.stagedRecord.sourceLastUpdated,
      archiveLastUpdated: input.stagedRecord.archiveLastUpdated,
      inspectionStatus: 'metadata-inspected',
      importStatus: 'not-imported',
    })
  const extractedCandidatesByPath = new Map(
    currentManifest.extractedCandidates.map((candidate) => [
      candidate.normalizedPath,
      candidate,
    ]),
  )
  extractedCandidatesByPath.set(extractedCandidate.normalizedPath, extractedCandidate)
  const updatedManifest: PubPartsInternalLibraryManifest = {
    ...currentManifest,
    inspectionStatus: 'extracted-candidates',
    importStatus: 'ready-for-import-review',
    extractedCandidates: Array.from(extractedCandidatesByPath.values()),
    updatedAt: new Date().toISOString(),
  }
  await writeInternalLibraryFile(
    rootDirectory,
    paths.manifestPath,
    JSON.stringify(updatedManifest, null, 2),
  )

  return extractedCandidate
}
