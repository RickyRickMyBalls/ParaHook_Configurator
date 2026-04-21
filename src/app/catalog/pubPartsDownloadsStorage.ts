import type { CatalogItemMetadataEntry, CatalogItemRecord } from './catalogItemContract'

export const pubPartsDownloadsStorageKey = 'parahook:catalog:pubparts-downloads'

export const pubPartsDownloadsFolderPath = 'Catalog/PubParts/Downloads'
export const pubPartsLocalLibraryFolderPath = 'PubParts'

const pubPartsDownloadsStorageSchemaVersion = 1 as const

type PubPartsDownloadsStorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export type PubPartsStagedSourceStatus = 'source-link-staged'
export type PubPartsBinaryStorageStatus = 'not-downloaded'
export type PubPartsInspectionStatus = 'not-inspected' | 'metadata-inspected'
export type PubPartsImportStatus = 'not-imported'
export type PubPartsLocalLibraryStatus =
  | 'not-configured'
  | 'permission-needed'
  | 'enabled'
  | 'disabled'
  | 'unavailable'
export type PubPartsLocalSourceStatus =
  | 'prepared'
  | 'scan-ready'
  | 'import-ready'
  | 'needs-extraction'
  | 'unsupported-only'
  | 'imported'
export type PubPartsSupportedSourceFileType = 'step' | 'stp' | 'glb' | 'obj' | 'stl'
export type PubPartsSourceInspectionResultKind =
  | 'supported-direct-file-candidate'
  | 'unsupported-direct-file-candidate'
  | 'archive-source-needs-inspection'
  | 'unknown-source-candidate'

export type PubPartsSourceInspectionResult = {
  kind: PubPartsSourceInspectionResultKind
  label: string
  description: string
  sourceCandidateUrl: string
  fileExtension?: string
  supportedFileType?: PubPartsSupportedSourceFileType
  requiresArchiveInspection: boolean
  inspectedAt: string
}

export type PubPartsSelectedSupportedFile = {
  choiceId: string
  sourceCandidateUrl: string
  fileName: string
  fileExtension: PubPartsSupportedSourceFileType
  label: string
  selectedAt: string
}

export type PubPartsStagedSourceRecord = {
  stagedSourceId: string
  catalogItemId: string
  catalogItemLabel: string
  providerId: 'pubparts'
  providerName: 'PubParts'
  sourceCollectionKey?: string
  sourceCollectionLabel?: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  externalItemUrl?: string
  sourceUrl?: string
  previewImageUrl?: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceMetadata: CatalogItemMetadataEntry[]
  status: PubPartsStagedSourceStatus
  binaryStatus: PubPartsBinaryStorageStatus
  inspectionStatus: PubPartsInspectionStatus
  inspectionResult?: PubPartsSourceInspectionResult
  selectedSupportedFile?: PubPartsSelectedSupportedFile
  importStatus: PubPartsImportStatus
  stagedAt: string
  updatedAt: string
}

export type PubPartsLocalLibraryConfig = {
  status: PubPartsLocalLibraryStatus
  rootLabel?: string
  rootFolderPath?: string
  updatedAt?: string
}

export type PubPartsSourceManifest = {
  schemaVersion: 1
  catalogItemId: string
  catalogItemLabel: string
  providerId: 'pubparts'
  providerName: 'PubParts'
  sourcePageUrl?: string
  sourceCandidateUrl?: string
  linkedArchiveUrl?: string
  sourceTitle: string
  sourceCollectionKey?: string
  sourceCollectionLabel?: string
  sourceVersionKey: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceMetadata: CatalogItemMetadataEntry[]
}

export type PubPartsLocalSourceRecord = {
  catalogItemId: string
  catalogItemLabel: string
  providerId: 'pubparts'
  providerName: 'PubParts'
  itemSlug: string
  itemFolderPath: string
  manifestPath: string
  sourceFolderPath: string
  downloadsFolderPath: string
  extractedFolderPath: string
  importableFolderPath: string
  versionsFolderPath: string
  sourceVersionKey: string
  manifest: PubPartsSourceManifest
  localStatus: PubPartsLocalSourceStatus
  localStatusLabel: string
  localStatusDescription: string
  preparedAt: string
  updatedAt: string
  lastScannedAt?: string
}

export type PubPartsDownloadsStorageState = {
  schemaVersion: typeof pubPartsDownloadsStorageSchemaVersion
  library: PubPartsLocalLibraryConfig
  stagedSourcesById: Record<string, PubPartsStagedSourceRecord>
  stagedSourceOrder: string[]
  localSourcesByCatalogItemId: Record<string, PubPartsLocalSourceRecord>
  localSourceOrder: string[]
}

export type PubPartsSourceLinkStageResult = {
  state: PubPartsDownloadsStorageState
  record: PubPartsStagedSourceRecord
}

export type PubPartsDownloadsStorageBucketDescriptor = {
  id: 'pubparts-downloads'
  label: 'PubParts downloads'
  storageKey: typeof pubPartsDownloadsStorageKey
  ownerSeam: 'pubPartsDownloadsStorage.ts'
  folderPath: typeof pubPartsDownloadsFolderPath
  localLibraryFolderPath: typeof pubPartsLocalLibraryFolderPath
}

export const pubPartsDownloadsStorageBucketDescriptor: PubPartsDownloadsStorageBucketDescriptor = {
  id: 'pubparts-downloads',
  label: 'PubParts downloads',
  storageKey: pubPartsDownloadsStorageKey,
  ownerSeam: 'pubPartsDownloadsStorage.ts',
  folderPath: pubPartsDownloadsFolderPath,
  localLibraryFolderPath: pubPartsLocalLibraryFolderPath,
}

export function createInitialPubPartsDownloadsStorageState(): PubPartsDownloadsStorageState {
  return {
    schemaVersion: pubPartsDownloadsStorageSchemaVersion,
    library: {
      status: 'not-configured',
    },
    stagedSourcesById: {},
    stagedSourceOrder: [],
    localSourcesByCatalogItemId: {},
    localSourceOrder: [],
  }
}

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const isCatalogItemMetadataEntry = (value: unknown): value is CatalogItemMetadataEntry =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as CatalogItemMetadataEntry).label === 'string' &&
    typeof (value as CatalogItemMetadataEntry).value === 'string'

const isPubPartsLocalLibraryStatus = (value: unknown): value is PubPartsLocalLibraryStatus =>
  value === 'not-configured' ||
  value === 'permission-needed' ||
  value === 'enabled' ||
  value === 'disabled' ||
  value === 'unavailable'

const isPubPartsLocalSourceStatus = (value: unknown): value is PubPartsLocalSourceStatus =>
  value === 'prepared' ||
  value === 'scan-ready' ||
  value === 'import-ready' ||
  value === 'needs-extraction' ||
  value === 'unsupported-only' ||
  value === 'imported'

const pubPartsSupportedSourceFileTypes = new Set<PubPartsSupportedSourceFileType>([
  'step',
  'stp',
  'glb',
  'obj',
  'stl',
])

const pubPartsSharedArchiveHostPatterns = ['dropbox.com']

const isPubPartsSupportedSourceFileType = (
  value: unknown,
): value is PubPartsSupportedSourceFileType =>
  typeof value === 'string' && pubPartsSupportedSourceFileTypes.has(value as PubPartsSupportedSourceFileType)

const isPubPartsSourceInspectionResultKind = (
  value: unknown,
): value is PubPartsSourceInspectionResultKind =>
  value === 'supported-direct-file-candidate' ||
  value === 'unsupported-direct-file-candidate' ||
  value === 'archive-source-needs-inspection' ||
  value === 'unknown-source-candidate'

function resolvePubPartsSourceCandidateUrlParts(url: string): { hostname: string; path: string } {
  try {
    const parsedUrl = new URL(url)
    return {
      hostname: parsedUrl.hostname.toLowerCase(),
      path: parsedUrl.pathname,
    }
  } catch {
    const withoutQuery = url.split(/[?#]/u)[0] ?? ''
    return {
      hostname: '',
      path: withoutQuery,
    }
  }
}

function resolvePubPartsSourceCandidateExtension(path: string): string | undefined {
  const lastPathPart = path.split('/').filter((part) => part.length > 0).at(-1) ?? ''
  const extensionMatch = /\.([a-z0-9]+)$/iu.exec(lastPathPart)
  return extensionMatch?.[1]?.toLowerCase()
}

function resolvePubPartsSourceCandidateFileName(url: string): string {
  const { path } = resolvePubPartsSourceCandidateUrlParts(url)
  const lastPathPart = path.split('/').filter((part) => part.length > 0).at(-1) ?? ''
  return decodeURIComponent(lastPathPart).trim() || 'Supported source candidate'
}

function isPubPartsSharedArchiveHost(hostname: string): boolean {
  return pubPartsSharedArchiveHostPatterns.some(
    (hostPattern) => hostname === hostPattern || hostname.endsWith(`.${hostPattern}`),
  )
}

export function resolvePubPartsStagedSourceInspectionResult(
  sourceCandidateUrl: string,
  inspectedAt: string,
): PubPartsSourceInspectionResult {
  const trimmedSourceCandidateUrl = sourceCandidateUrl.trim()
  const { hostname, path } = resolvePubPartsSourceCandidateUrlParts(trimmedSourceCandidateUrl)
  const fileExtension = resolvePubPartsSourceCandidateExtension(path)

  if (isPubPartsSharedArchiveHost(hostname) || fileExtension === 'zip') {
    return {
      kind: 'archive-source-needs-inspection',
      label: 'Archive Source Needs Inspection',
      description:
        'This staged source link points to an archive or shared source. ParaHook has not downloaded, opened, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      sourceCandidateUrl: trimmedSourceCandidateUrl,
      fileExtension,
      requiresArchiveInspection: true,
      inspectedAt,
    }
  }

  if (isPubPartsSupportedSourceFileType(fileExtension)) {
    return {
      kind: 'supported-direct-file-candidate',
      label: 'Supported Direct File Candidate',
      description:
        'This staged source link looks like a supported direct model file candidate from URL metadata only. ParaHook has not downloaded, imported, or added it to the project.',
      sourceCandidateUrl: trimmedSourceCandidateUrl,
      fileExtension,
      supportedFileType: fileExtension,
      requiresArchiveInspection: false,
      inspectedAt,
    }
  }

  if (fileExtension !== undefined) {
    return {
      kind: 'unsupported-direct-file-candidate',
      label: 'Unsupported Direct File Candidate',
      description:
        'This staged source link has a file extension that is not currently supported as a direct Catalog model import candidate.',
      sourceCandidateUrl: trimmedSourceCandidateUrl,
      fileExtension,
      requiresArchiveInspection: false,
      inspectedAt,
    }
  }

  return {
    kind: 'unknown-source-candidate',
    label: 'Unknown Source Candidate',
    description:
      'This staged source link does not expose a reliable file extension from metadata, so ParaHook cannot classify it without a later inspection step.',
    sourceCandidateUrl: trimmedSourceCandidateUrl,
    requiresArchiveInspection: false,
    inspectedAt,
  }
}

function sanitizePubPartsSourceInspectionResult(
  value: unknown,
): PubPartsSourceInspectionResult | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsSourceInspectionResult>
  const kind = candidate.kind
  const label = trimOptionalString(candidate.label)
  const description = trimOptionalString(candidate.description)
  const sourceCandidateUrl = trimOptionalString(candidate.sourceCandidateUrl)
  const inspectedAt = trimOptionalString(candidate.inspectedAt)

  if (
    !isPubPartsSourceInspectionResultKind(kind) ||
    label === undefined ||
    description === undefined ||
    sourceCandidateUrl === undefined ||
    inspectedAt === undefined ||
    typeof candidate.requiresArchiveInspection !== 'boolean'
  ) {
    return null
  }

  return {
    kind,
    label,
    description,
    sourceCandidateUrl,
    fileExtension: trimOptionalString(candidate.fileExtension),
    supportedFileType: isPubPartsSupportedSourceFileType(candidate.supportedFileType)
      ? candidate.supportedFileType
      : undefined,
    requiresArchiveInspection: candidate.requiresArchiveInspection,
    inspectedAt,
  }
}

function sanitizePubPartsSelectedSupportedFile(
  value: unknown,
  inspectionResult: PubPartsSourceInspectionResult | null,
): PubPartsSelectedSupportedFile | null {
  if (
    inspectionResult === null ||
    inspectionResult.kind !== 'supported-direct-file-candidate' ||
    inspectionResult.supportedFileType === undefined ||
    typeof value !== 'object' ||
    value === null
  ) {
    return null
  }

  const candidate = value as Partial<PubPartsSelectedSupportedFile>
  const choiceId = trimOptionalString(candidate.choiceId)
  const sourceCandidateUrl = trimOptionalString(candidate.sourceCandidateUrl)
  const fileName = trimOptionalString(candidate.fileName)
  const label = trimOptionalString(candidate.label)
  const selectedAt = trimOptionalString(candidate.selectedAt)

  if (
    choiceId === undefined ||
    sourceCandidateUrl === undefined ||
    fileName === undefined ||
    label === undefined ||
    selectedAt === undefined ||
    candidate.fileExtension !== inspectionResult.supportedFileType ||
    sourceCandidateUrl !== inspectionResult.sourceCandidateUrl
  ) {
    return null
  }

  return {
    choiceId,
    sourceCandidateUrl,
    fileName,
    fileExtension: candidate.fileExtension,
    label,
    selectedAt,
  }
}

function sanitizePubPartsStagedSourceRecord(value: unknown): PubPartsStagedSourceRecord | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsStagedSourceRecord>
  const stagedSourceId = trimOptionalString(candidate.stagedSourceId)
  const catalogItemId = trimOptionalString(candidate.catalogItemId)
  const catalogItemLabel = trimOptionalString(candidate.catalogItemLabel)
  const sourceCandidateUrl = trimOptionalString(candidate.sourceCandidateUrl)
  const linkedArchiveUrl = trimOptionalString(candidate.linkedArchiveUrl)
  const stagedAt = trimOptionalString(candidate.stagedAt)
  const updatedAt = trimOptionalString(candidate.updatedAt)

  if (
    stagedSourceId === undefined ||
    catalogItemId === undefined ||
    catalogItemLabel === undefined ||
    sourceCandidateUrl === undefined ||
    linkedArchiveUrl === undefined ||
    stagedAt === undefined ||
    updatedAt === undefined ||
    candidate.providerId !== 'pubparts' ||
    candidate.providerName !== 'PubParts' ||
    candidate.status !== 'source-link-staged' ||
    candidate.binaryStatus !== 'not-downloaded' ||
    (candidate.inspectionStatus !== 'not-inspected' &&
      candidate.inspectionStatus !== 'metadata-inspected') ||
    candidate.importStatus !== 'not-imported'
  ) {
    return null
  }

  const inspectionResult =
    candidate.inspectionStatus === 'metadata-inspected'
      ? sanitizePubPartsSourceInspectionResult(candidate.inspectionResult)
      : null
  if (candidate.inspectionStatus === 'metadata-inspected' && inspectionResult === null) {
    return null
  }
  const selectedSupportedFile = sanitizePubPartsSelectedSupportedFile(
    candidate.inspectionStatus === 'metadata-inspected'
      ? candidate.selectedSupportedFile
      : undefined,
    inspectionResult,
  )

  return {
    stagedSourceId,
    catalogItemId,
    catalogItemLabel,
    providerId: 'pubparts',
    providerName: 'PubParts',
    sourceCollectionKey: trimOptionalString(candidate.sourceCollectionKey),
    sourceCollectionLabel: trimOptionalString(candidate.sourceCollectionLabel),
    sourceCandidateUrl,
    linkedArchiveUrl,
    sourcePageUrl: trimOptionalString(candidate.sourcePageUrl),
    externalItemUrl: trimOptionalString(candidate.externalItemUrl),
    sourceUrl: trimOptionalString(candidate.sourceUrl),
    previewImageUrl: trimOptionalString(candidate.previewImageUrl),
    sourceLastUpdated: trimOptionalString(candidate.sourceLastUpdated),
    archiveLastUpdated: trimOptionalString(candidate.archiveLastUpdated),
    sourceMetadata: Array.isArray(candidate.sourceMetadata)
      ? candidate.sourceMetadata.filter(isCatalogItemMetadataEntry)
      : [],
    status: 'source-link-staged',
    binaryStatus: 'not-downloaded',
    inspectionStatus: candidate.inspectionStatus,
    inspectionResult: inspectionResult ?? undefined,
    selectedSupportedFile: selectedSupportedFile ?? undefined,
    importStatus: 'not-imported',
    stagedAt,
    updatedAt,
  }
}

function sanitizePubPartsLocalLibraryConfig(value: unknown): PubPartsLocalLibraryConfig {
  if (typeof value !== 'object' || value === null) {
    return {
      status: 'not-configured',
    }
  }

  const candidate = value as Partial<PubPartsLocalLibraryConfig>
  if (!isPubPartsLocalLibraryStatus(candidate.status)) {
    return {
      status: 'not-configured',
    }
  }

  return {
    status: candidate.status,
    rootLabel: trimOptionalString(candidate.rootLabel),
    rootFolderPath: trimOptionalString(candidate.rootFolderPath),
    updatedAt: trimOptionalString(candidate.updatedAt),
  }
}

function sanitizePubPartsSourceManifest(value: unknown): PubPartsSourceManifest | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsSourceManifest>
  const catalogItemId = trimOptionalString(candidate.catalogItemId)
  const catalogItemLabel = trimOptionalString(candidate.catalogItemLabel)
  const sourceTitle = trimOptionalString(candidate.sourceTitle)
  const sourceVersionKey = trimOptionalString(candidate.sourceVersionKey)

  if (
    candidate.schemaVersion !== 1 ||
    catalogItemId === undefined ||
    catalogItemLabel === undefined ||
    sourceTitle === undefined ||
    sourceVersionKey === undefined ||
    candidate.providerId !== 'pubparts' ||
    candidate.providerName !== 'PubParts'
  ) {
    return null
  }

  return {
    schemaVersion: 1,
    catalogItemId,
    catalogItemLabel,
    providerId: 'pubparts',
    providerName: 'PubParts',
    sourcePageUrl: trimOptionalString(candidate.sourcePageUrl),
    sourceCandidateUrl: trimOptionalString(candidate.sourceCandidateUrl),
    linkedArchiveUrl: trimOptionalString(candidate.linkedArchiveUrl),
    sourceTitle,
    sourceCollectionKey: trimOptionalString(candidate.sourceCollectionKey),
    sourceCollectionLabel: trimOptionalString(candidate.sourceCollectionLabel),
    sourceVersionKey,
    sourceLastUpdated: trimOptionalString(candidate.sourceLastUpdated),
    archiveLastUpdated: trimOptionalString(candidate.archiveLastUpdated),
    sourceMetadata: Array.isArray(candidate.sourceMetadata)
      ? candidate.sourceMetadata.filter(isCatalogItemMetadataEntry)
      : [],
  }
}

function sanitizePubPartsLocalSourceRecord(value: unknown): PubPartsLocalSourceRecord | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<PubPartsLocalSourceRecord>
  const catalogItemId = trimOptionalString(candidate.catalogItemId)
  const catalogItemLabel = trimOptionalString(candidate.catalogItemLabel)
  const itemSlug = trimOptionalString(candidate.itemSlug)
  const itemFolderPath = trimOptionalString(candidate.itemFolderPath)
  const manifestPath = trimOptionalString(candidate.manifestPath)
  const sourceFolderPath = trimOptionalString(candidate.sourceFolderPath)
  const downloadsFolderPath = trimOptionalString(candidate.downloadsFolderPath)
  const extractedFolderPath = trimOptionalString(candidate.extractedFolderPath)
  const importableFolderPath = trimOptionalString(candidate.importableFolderPath)
  const versionsFolderPath = trimOptionalString(candidate.versionsFolderPath)
  const sourceVersionKey = trimOptionalString(candidate.sourceVersionKey)
  const localStatusLabel = trimOptionalString(candidate.localStatusLabel)
  const localStatusDescription = trimOptionalString(candidate.localStatusDescription)
  const preparedAt = trimOptionalString(candidate.preparedAt)
  const updatedAt = trimOptionalString(candidate.updatedAt)
  const manifest = sanitizePubPartsSourceManifest(candidate.manifest)

  if (
    catalogItemId === undefined ||
    catalogItemLabel === undefined ||
    itemSlug === undefined ||
    itemFolderPath === undefined ||
    manifestPath === undefined ||
    sourceFolderPath === undefined ||
    downloadsFolderPath === undefined ||
    extractedFolderPath === undefined ||
    importableFolderPath === undefined ||
    versionsFolderPath === undefined ||
    sourceVersionKey === undefined ||
    localStatusLabel === undefined ||
    localStatusDescription === undefined ||
    preparedAt === undefined ||
    updatedAt === undefined ||
    candidate.providerId !== 'pubparts' ||
    candidate.providerName !== 'PubParts' ||
    !isPubPartsLocalSourceStatus(candidate.localStatus) ||
    manifest === null ||
    manifest.catalogItemId !== catalogItemId ||
    manifest.sourceVersionKey !== sourceVersionKey
  ) {
    return null
  }

  return {
    catalogItemId,
    catalogItemLabel,
    providerId: 'pubparts',
    providerName: 'PubParts',
    itemSlug,
    itemFolderPath,
    manifestPath,
    sourceFolderPath,
    downloadsFolderPath,
    extractedFolderPath,
    importableFolderPath,
    versionsFolderPath,
    sourceVersionKey,
    manifest,
    localStatus: candidate.localStatus,
    localStatusLabel,
    localStatusDescription,
    preparedAt,
    updatedAt,
    lastScannedAt: trimOptionalString(candidate.lastScannedAt),
  }
}

export function sanitizePubPartsDownloadsStorageState(
  rawValue: unknown,
): PubPartsDownloadsStorageState {
  if (rawValue === null || rawValue === undefined) {
    return createInitialPubPartsDownloadsStorageState()
  }

  let parsedValue: unknown = rawValue
  if (typeof rawValue === 'string') {
    try {
      parsedValue = JSON.parse(rawValue) as unknown
    } catch {
      return createInitialPubPartsDownloadsStorageState()
    }
  }

  if (typeof parsedValue !== 'object' || parsedValue === null) {
    return createInitialPubPartsDownloadsStorageState()
  }

  const candidate = parsedValue as Partial<PubPartsDownloadsStorageState>
  if (
    candidate.schemaVersion !== pubPartsDownloadsStorageSchemaVersion ||
    typeof candidate.stagedSourcesById !== 'object' ||
    candidate.stagedSourcesById === null ||
    !Array.isArray(candidate.stagedSourceOrder)
  ) {
    return createInitialPubPartsDownloadsStorageState()
  }

  const stagedSourcesById = Object.entries(candidate.stagedSourcesById).reduce<
    Record<string, PubPartsStagedSourceRecord>
  >((recordsById, [recordId, record]) => {
    const sanitizedRecord = sanitizePubPartsStagedSourceRecord(record)
    if (sanitizedRecord !== null && sanitizedRecord.stagedSourceId === recordId) {
      recordsById[recordId] = sanitizedRecord
    }
    return recordsById
  }, {})

  const stagedSourceOrder = candidate.stagedSourceOrder.filter(
    (recordId, index, order) =>
      typeof recordId === 'string' &&
      Object.prototype.hasOwnProperty.call(stagedSourcesById, recordId) &&
      order.indexOf(recordId) === index,
  )

  Object.keys(stagedSourcesById).forEach((recordId) => {
    if (!stagedSourceOrder.includes(recordId)) {
      stagedSourceOrder.push(recordId)
    }
  })

  const localSourcesByCatalogItemId =
    typeof candidate.localSourcesByCatalogItemId === 'object' &&
    candidate.localSourcesByCatalogItemId !== null
      ? Object.entries(candidate.localSourcesByCatalogItemId).reduce<
          Record<string, PubPartsLocalSourceRecord>
        >((recordsById, [catalogItemId, record]) => {
          const sanitizedRecord = sanitizePubPartsLocalSourceRecord(record)
          if (sanitizedRecord !== null && sanitizedRecord.catalogItemId === catalogItemId) {
            recordsById[catalogItemId] = sanitizedRecord
          }
          return recordsById
        }, {})
      : {}

  const localSourceOrder = Array.isArray(candidate.localSourceOrder)
    ? candidate.localSourceOrder.filter(
        (catalogItemId, index, order) =>
          typeof catalogItemId === 'string' &&
          Object.prototype.hasOwnProperty.call(localSourcesByCatalogItemId, catalogItemId) &&
          order.indexOf(catalogItemId) === index,
      )
    : []

  Object.keys(localSourcesByCatalogItemId).forEach((catalogItemId) => {
    if (!localSourceOrder.includes(catalogItemId)) {
      localSourceOrder.push(catalogItemId)
    }
  })

  return {
    schemaVersion: pubPartsDownloadsStorageSchemaVersion,
    library: sanitizePubPartsLocalLibraryConfig(candidate.library),
    stagedSourcesById,
    stagedSourceOrder,
    localSourcesByCatalogItemId,
    localSourceOrder,
  }
}

const resolveDefaultStorage = (): PubPartsDownloadsStorageLike | null =>
  typeof window === 'undefined' ? null : window.localStorage

export function readPubPartsDownloadsStorage(
  storage: PubPartsDownloadsStorageLike | null = resolveDefaultStorage(),
): PubPartsDownloadsStorageState {
  return sanitizePubPartsDownloadsStorageState(storage?.getItem(pubPartsDownloadsStorageKey) ?? null)
}

export function writePubPartsDownloadsStorage(
  state: PubPartsDownloadsStorageState,
  storage: PubPartsDownloadsStorageLike | null = resolveDefaultStorage(),
): PubPartsDownloadsStorageState {
  const sanitizedState = sanitizePubPartsDownloadsStorageState(state)
  storage?.setItem(pubPartsDownloadsStorageKey, JSON.stringify(sanitizedState))
  return sanitizedState
}

function resolvePubPartsLocalSourceStatusRead(status: PubPartsLocalSourceStatus): {
  label: string
  description: string
} {
  switch (status) {
    case 'scan-ready':
      return {
        label: 'Scan Ready',
        description:
          'A PubParts item folder is prepared. Use the Import-owned local file picker or future folder scanner to find supported files in that known folder.',
      }
    case 'import-ready':
      return {
        label: 'Import Ready',
        description:
          'Supported local files are known for this PubParts item and should be handed to the staged Import review flow.',
      }
    case 'needs-extraction':
      return {
        label: 'Needs Extraction',
        description:
          'Local source archive state is known, but archive extraction is owned by a later Import phase.',
      }
    case 'unsupported-only':
      return {
        label: 'Unsupported Only',
        description:
          'The local source state currently has no supported model files for the Import handoff.',
      }
    case 'imported':
      return {
        label: 'Imported',
        description:
          'At least one local PubParts file has already been handed through Import as a project asset.',
      }
    case 'prepared':
    default:
      return {
        label: 'Prepared Folder',
        description:
          'The predictable PubParts item folder and manifest path are prepared as metadata. ParaHook has not silently created folders, scanned disk, downloaded bytes, or imported files.',
      }
  }
}

export function setPubPartsLocalLibraryEnabled(
  enabled: boolean,
  options: {
    now?: () => Date
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState {
  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  const timestamp = (options.now ?? (() => new Date()))().toISOString()

  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      library: enabled
        ? {
            status: 'permission-needed',
            rootLabel: 'Choose a PubParts Library folder',
            rootFolderPath: pubPartsLocalLibraryFolderPath,
            updatedAt: timestamp,
          }
        : {
            status: 'disabled',
            rootLabel: currentState.library.rootLabel,
            rootFolderPath: currentState.library.rootFolderPath,
            updatedAt: timestamp,
          },
    },
    storage,
  )
}

const slugifyPubPartsCatalogItem = (item: CatalogItemRecord): string => {
  const sourceText = `${item.label}-${item.itemId}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '')

  return sourceText.length > 0 ? sourceText.slice(0, 96) : 'pubparts-item'
}

const resolvePubPartsSourceVersionKey = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind !== 'external') {
    return 'source-v1'
  }

  const dateText =
    item.source.archiveLastUpdated?.trim() ||
    item.source.sourceLastUpdated?.trim() ||
    'source-v1'

  return dateText
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '') || 'source-v1'
}

export function preparePubPartsLocalSourceRecord(
  item: CatalogItemRecord,
  options: {
    now?: () => Date
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState | null {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return null
  }

  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  const existingRecord = currentState.localSourcesByCatalogItemId[item.itemId] ?? null
  const timestamp = (options.now ?? (() => new Date()))().toISOString()
  const itemSlug = existingRecord?.itemSlug ?? slugifyPubPartsCatalogItem(item)
  const sourceVersionKey = existingRecord?.sourceVersionKey ?? resolvePubPartsSourceVersionKey(item)
  const itemFolderPath = `${pubPartsLocalLibraryFolderPath}/parts/${itemSlug}`
  const statusRead = resolvePubPartsLocalSourceStatusRead('prepared')
  const manifest: PubPartsSourceManifest = {
    schemaVersion: 1,
    catalogItemId: item.itemId,
    catalogItemLabel: item.label,
    providerId: 'pubparts',
    providerName: 'PubParts',
    sourcePageUrl: item.source.externalItemUrl?.trim() || item.source.sourceUrl?.trim() || undefined,
    sourceCandidateUrl: item.source.linkedArchiveUrl?.trim() || undefined,
    linkedArchiveUrl: item.source.linkedArchiveUrl?.trim() || undefined,
    sourceTitle: item.label,
    sourceCollectionKey: item.source.provider.sourceCollectionKey?.trim() || undefined,
    sourceCollectionLabel: item.source.provider.sourceCollectionLabel?.trim() || undefined,
    sourceVersionKey,
    sourceLastUpdated: item.source.sourceLastUpdated?.trim() || undefined,
    archiveLastUpdated: item.source.archiveLastUpdated?.trim() || undefined,
    sourceMetadata: item.metadata ?? [],
  }
  const nextRecord: PubPartsLocalSourceRecord = {
    catalogItemId: item.itemId,
    catalogItemLabel: item.label,
    providerId: 'pubparts',
    providerName: 'PubParts',
    itemSlug,
    itemFolderPath,
    manifestPath: `${itemFolderPath}/pubparts-source.json`,
    sourceFolderPath: `${itemFolderPath}/source`,
    downloadsFolderPath: `${itemFolderPath}/downloads`,
    extractedFolderPath: `${itemFolderPath}/extracted`,
    importableFolderPath: `${itemFolderPath}/importable`,
    versionsFolderPath: `${itemFolderPath}/versions/${sourceVersionKey}/files`,
    sourceVersionKey,
    manifest,
    localStatus: 'prepared',
    localStatusLabel: statusRead.label,
    localStatusDescription: statusRead.description,
    preparedAt: existingRecord?.preparedAt ?? timestamp,
    updatedAt: timestamp,
    lastScannedAt: existingRecord?.lastScannedAt,
  }

  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      localSourcesByCatalogItemId: {
        ...currentState.localSourcesByCatalogItemId,
        [item.itemId]: nextRecord,
      },
      localSourceOrder: currentState.localSourceOrder.includes(item.itemId)
        ? currentState.localSourceOrder
        : [...currentState.localSourceOrder, item.itemId],
    },
    storage,
  )
}

export function findPubPartsStagedSourceRecordForCatalogItem(
  state: PubPartsDownloadsStorageState,
  catalogItemId: string,
): PubPartsStagedSourceRecord | null {
  const stagedSourceId = `pubparts:${catalogItemId}`
  return state.stagedSourcesById[stagedSourceId] ?? null
}

export function stagePubPartsSourceLink(
  item: CatalogItemRecord,
  options: {
    now?: () => Date
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsSourceLinkStageResult | null {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return null
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return null
  }

  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  const stagedSourceId = `pubparts:${item.itemId}`
  const existingRecord = currentState.stagedSourcesById[stagedSourceId] ?? null
  const timestamp = (options.now ?? (() => new Date()))().toISOString()
  const nextRecord: PubPartsStagedSourceRecord = {
    stagedSourceId,
    catalogItemId: item.itemId,
    catalogItemLabel: item.label,
    providerId: 'pubparts',
    providerName: 'PubParts',
    sourceCollectionKey: item.source.provider.sourceCollectionKey?.trim() || undefined,
    sourceCollectionLabel: item.source.provider.sourceCollectionLabel?.trim() || undefined,
    sourceCandidateUrl: linkedArchiveUrl,
    linkedArchiveUrl,
    sourcePageUrl: item.source.externalItemUrl?.trim() || item.source.sourceUrl?.trim() || undefined,
    externalItemUrl: item.source.externalItemUrl?.trim() || undefined,
    sourceUrl: item.source.sourceUrl?.trim() || undefined,
    previewImageUrl: item.source.previewImageUrl?.trim() || undefined,
    sourceLastUpdated: item.source.sourceLastUpdated?.trim() || undefined,
    archiveLastUpdated: item.source.archiveLastUpdated?.trim() || undefined,
    sourceMetadata: item.metadata ?? [],
    status: 'source-link-staged',
    binaryStatus: 'not-downloaded',
    inspectionStatus: 'not-inspected',
    importStatus: 'not-imported',
    stagedAt: existingRecord?.stagedAt ?? timestamp,
    updatedAt: timestamp,
  }

  const nextState: PubPartsDownloadsStorageState = {
    ...currentState,
    stagedSourcesById: {
      ...currentState.stagedSourcesById,
      [stagedSourceId]: nextRecord,
    },
    stagedSourceOrder: currentState.stagedSourceOrder.includes(stagedSourceId)
      ? currentState.stagedSourceOrder
      : [...currentState.stagedSourceOrder, stagedSourceId],
  }

  return {
    state: writePubPartsDownloadsStorage(nextState, storage),
    record: nextRecord,
  }
}

export function removePubPartsStagedSourceRecord(
  stagedSourceId: string,
  options: {
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState {
  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)

  if (!Object.prototype.hasOwnProperty.call(currentState.stagedSourcesById, stagedSourceId)) {
    return writePubPartsDownloadsStorage(currentState, storage)
  }

  const { [stagedSourceId]: _removedRecord, ...nextStagedSourcesById } =
    currentState.stagedSourcesById
  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      stagedSourcesById: nextStagedSourcesById,
      stagedSourceOrder: currentState.stagedSourceOrder.filter(
        (candidateId) => candidateId !== stagedSourceId,
      ),
    },
    storage,
  )
}

export function inspectPubPartsStagedSourceRecord(
  stagedSourceId: string,
  options: {
    now?: () => Date
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState {
  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  const currentRecord = currentState.stagedSourcesById[stagedSourceId] ?? null

  if (currentRecord === null) {
    return writePubPartsDownloadsStorage(currentState, storage)
  }

  const timestamp = (options.now ?? (() => new Date()))().toISOString()
  const nextRecord: PubPartsStagedSourceRecord = {
    ...currentRecord,
    inspectionStatus: 'metadata-inspected',
    inspectionResult: resolvePubPartsStagedSourceInspectionResult(
      currentRecord.sourceCandidateUrl,
      timestamp,
    ),
    selectedSupportedFile: undefined,
    updatedAt: timestamp,
  }

  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      stagedSourcesById: {
        ...currentState.stagedSourcesById,
        [stagedSourceId]: nextRecord,
      },
      stagedSourceOrder: currentState.stagedSourceOrder,
    },
    storage,
  )
}

export function selectPubPartsSupportedSourceFileCandidate(
  stagedSourceId: string,
  options: {
    now?: () => Date
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState {
  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  const currentRecord = currentState.stagedSourcesById[stagedSourceId] ?? null
  const inspectionResult = currentRecord?.inspectionResult ?? null
  const supportedFileType = inspectionResult?.supportedFileType

  if (
    currentRecord === null ||
    currentRecord.inspectionStatus !== 'metadata-inspected' ||
    inspectionResult?.kind !== 'supported-direct-file-candidate' ||
    supportedFileType === undefined
  ) {
    return writePubPartsDownloadsStorage(currentState, storage)
  }

  const timestamp = (options.now ?? (() => new Date()))().toISOString()
  const fileName = resolvePubPartsSourceCandidateFileName(inspectionResult.sourceCandidateUrl)
  const nextRecord: PubPartsStagedSourceRecord = {
    ...currentRecord,
    selectedSupportedFile: {
      choiceId: `${stagedSourceId}:supported-direct-file`,
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileName,
      fileExtension: supportedFileType,
      label: `${fileName} (${supportedFileType.toUpperCase()})`,
      selectedAt: timestamp,
    },
    updatedAt: timestamp,
  }

  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      stagedSourcesById: {
        ...currentState.stagedSourcesById,
        [stagedSourceId]: nextRecord,
      },
      stagedSourceOrder: currentState.stagedSourceOrder,
    },
    storage,
  )
}

export function clearPubPartsSupportedSourceFileSelection(
  stagedSourceId: string,
  options: {
    now?: () => Date
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState {
  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  const currentRecord = currentState.stagedSourcesById[stagedSourceId] ?? null

  if (currentRecord === null || currentRecord.selectedSupportedFile === undefined) {
    return writePubPartsDownloadsStorage(currentState, storage)
  }

  const timestamp = (options.now ?? (() => new Date()))().toISOString()
  const { selectedSupportedFile: _selectedSupportedFile, ...recordWithoutSelection } = currentRecord
  const nextRecord: PubPartsStagedSourceRecord = {
    ...recordWithoutSelection,
    updatedAt: timestamp,
  }

  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      stagedSourcesById: {
        ...currentState.stagedSourcesById,
        [stagedSourceId]: nextRecord,
      },
      stagedSourceOrder: currentState.stagedSourceOrder,
    },
    storage,
  )
}

export function clearPubPartsStagedSourceRecords(
  options: {
    storage?: PubPartsDownloadsStorageLike | null
  } = {},
): PubPartsDownloadsStorageState {
  const storage = options.storage ?? resolveDefaultStorage()
  const currentState = readPubPartsDownloadsStorage(storage)
  return writePubPartsDownloadsStorage(
    {
      ...currentState,
      stagedSourcesById: {},
      stagedSourceOrder: [],
    },
    storage,
  )
}
