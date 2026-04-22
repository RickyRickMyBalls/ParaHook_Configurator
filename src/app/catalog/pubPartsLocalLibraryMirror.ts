import type {
  PubPartsInternalLibraryExtractedCandidate,
  PubPartsInternalLibraryManifest,
} from './pubPartsInternalLibrary'
import {
  pubPartsLocalLibraryFolderPath,
  type PubPartsLocalLibraryConfig,
} from './pubPartsDownloadsStorage'

export const pubPartsLocalLibraryMirrorSchemaVersion = 1 as const

export type PubPartsLocalLibraryMirrorWritableFileLike = {
  write: (data: Blob | string | Uint8Array) => Promise<void> | void
  close: () => Promise<void> | void
}

export type PubPartsLocalLibraryMirrorFileHandleLike = {
  createWritable: () => Promise<PubPartsLocalLibraryMirrorWritableFileLike>
}

export type PubPartsLocalLibraryMirrorDirectoryHandleLike = {
  name?: string
  getDirectoryHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<PubPartsLocalLibraryMirrorDirectoryHandleLike>
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<PubPartsLocalLibraryMirrorFileHandleLike>
}

export type PubPartsLocalLibraryMirrorEnv = {
  showDirectoryPicker?: (options?: {
    mode?: 'read' | 'readwrite'
  }) => Promise<PubPartsLocalLibraryMirrorDirectoryHandleLike>
}

export type PubPartsLocalLibraryMirrorStatus =
  | 'unsupported'
  | 'not-configured'
  | 'permission-needed'
  | 'enabled'
  | 'disabled'
  | 'unavailable'
  | 'error'

export type PubPartsLocalLibraryMirrorRead = {
  status: PubPartsLocalLibraryMirrorStatus
  rootLabel: string
  rootFolderPath: typeof pubPartsLocalLibraryFolderPath
  message: string
}

export type PubPartsLocalLibraryMirrorChooseResult =
  | (Omit<PubPartsLocalLibraryMirrorRead, 'status'> & {
      status: 'enabled'
      directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike
    })
  | (Omit<PubPartsLocalLibraryMirrorRead, 'status'> & {
      status: Exclude<PubPartsLocalLibraryMirrorStatus, 'enabled'>
    })

export type PubPartsLocalLibraryMirrorSessionRoot = {
  directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike
  read: PubPartsLocalLibraryMirrorRead & { status: 'enabled' }
}

export type PubPartsLocalLibraryMirrorCandidatePath = {
  archivePath: string
  normalizedPath: string
  fileName: string
  extractedPath: string
  importablePath: string
}

export type PubPartsLocalLibraryMirrorPlan = {
  schemaVersion: typeof pubPartsLocalLibraryMirrorSchemaVersion
  rootFolderPath: typeof pubPartsLocalLibraryFolderPath
  catalogItemId: string
  catalogItemLabel: string
  itemSlug: string
  sourceVersionKey: string
  itemFolderPath: string
  manifestPath: string
  archivePath: string
  extractedPaths: PubPartsLocalLibraryMirrorCandidatePath[]
  importablePaths: PubPartsLocalLibraryMirrorCandidatePath[]
}

export type PubPartsLocalLibraryMirrorWriteResult =
  | {
      status: 'mirrored'
      path: string
      message: string
    }
  | {
      status: 'error'
      path: string
      message: string
    }

const defaultRootLabel = 'Choose a PubParts Library folder'
let pubPartsLocalLibraryMirrorSessionRoot: PubPartsLocalLibraryMirrorSessionRoot | null = null

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const slugifyPathPart = (value: string, fallback: string): string => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/gu, '-')
    .replace(/^-+|-+$/gu, '')

  return slug.length > 0 ? slug.slice(0, 96) : fallback
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

const isSafePathSegment = (segment: string): boolean =>
  segment.length > 0 &&
  segment !== '.' &&
  segment !== '..' &&
  !segment.includes('\0') &&
  !/^[a-z]:$/iu.test(segment)

const splitSafeRelativePath = (path: string): string[] => {
  const normalizedPath = path.replace(/\\/gu, '/')
  if (
    normalizedPath.length === 0 ||
    normalizedPath.startsWith('/') ||
    normalizedPath.startsWith('~') ||
    /^[a-z]:/iu.test(normalizedPath)
  ) {
    throw new Error('Local Library mirror path must be relative to the selected folder.')
  }

  const segments = normalizedPath.split('/')
  if (!segments.every(isSafePathSegment)) {
    throw new Error('Local Library mirror path contains unsafe path segments.')
  }

  return segments
}

const normalizeSafeArchivePath = (value: string): string => {
  const segments = splitSafeRelativePath(value)
  return segments.map((segment) => slugifyPathPart(segment, 'entry')).join('/')
}

const resolveDefaultEnv = (): PubPartsLocalLibraryMirrorEnv => {
  if (typeof window === 'undefined') {
    return {}
  }

  return window as unknown as PubPartsLocalLibraryMirrorEnv
}

const isPermissionDeniedError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name?: unknown }).name === 'AbortError'

const readRootLabel = (
  directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike,
): string => trimOptionalString(directoryHandle.name) ?? 'Selected PubParts Library folder'

const resolveManifestItemSlug = (manifest: PubPartsInternalLibraryManifest): string =>
  slugifyPathPart(
    trimOptionalString((manifest as { itemSlug?: unknown }).itemSlug) ??
      `${manifest.catalogItemLabel}-${manifest.catalogItemId}`,
    'pubparts-item',
  )

const resolveManifestSourceVersionKey = (manifest: PubPartsInternalLibraryManifest): string =>
  slugifyPathPart(
    trimOptionalString((manifest as { sourceVersionKey?: unknown }).sourceVersionKey) ??
      trimOptionalString((manifest as { archiveLastUpdated?: unknown }).archiveLastUpdated) ??
      trimOptionalString((manifest as { sourceLastUpdated?: unknown }).sourceLastUpdated) ??
      'source-v1',
    'source-v1',
  )

const resolveMirrorCandidatePath = (
  itemFolderPath: string,
  sourceVersionKey: string,
  candidate: PubPartsInternalLibraryExtractedCandidate,
): PubPartsLocalLibraryMirrorCandidatePath => {
  const normalizedPath = normalizeSafeArchivePath(candidate.normalizedPath)
  const fileName = getFileName(candidate.fileName, 'importable-file')
  return {
    archivePath: candidate.archivePath,
    normalizedPath,
    fileName,
    extractedPath: `${itemFolderPath}/extracted/${sourceVersionKey}/${normalizedPath}`,
    importablePath: `${itemFolderPath}/importable/${sourceVersionKey}/${fileName}`,
  }
}

const writeLocalLibraryMirrorFile = async (
  rootDirectory: PubPartsLocalLibraryMirrorDirectoryHandleLike,
  path: string,
  data: Blob | string | Uint8Array,
): Promise<void> => {
  const segments = splitSafeRelativePath(path)
  const fileName = segments.at(-1)
  if (fileName === undefined) {
    throw new Error('Local Library mirror path must include a file name.')
  }

  let directory = rootDirectory
  for (const segment of segments.slice(0, -1)) {
    directory = await directory.getDirectoryHandle(segment, { create: true })
  }

  const fileHandle = await directory.getFileHandle(fileName, { create: true })
  const writable = await fileHandle.createWritable()
  try {
    await writable.write(data)
  } finally {
    await writable.close()
  }
}

export function readPubPartsLocalLibraryMirrorCapability(
  env: PubPartsLocalLibraryMirrorEnv = resolveDefaultEnv(),
): PubPartsLocalLibraryMirrorRead {
  if (typeof env.showDirectoryPicker !== 'function') {
    return {
      status: 'unsupported',
      rootLabel: defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Local Library folder mirroring is unavailable in this browser.',
    }
  }

  return {
    status: 'not-configured',
    rootLabel: defaultRootLabel,
    rootFolderPath: pubPartsLocalLibraryFolderPath,
    message: 'Choose a Local Library folder to mirror PubParts files into a visible folder.',
  }
}

export async function choosePubPartsLocalLibraryMirrorRoot(
  env: PubPartsLocalLibraryMirrorEnv = resolveDefaultEnv(),
): Promise<PubPartsLocalLibraryMirrorChooseResult> {
  if (typeof env.showDirectoryPicker !== 'function') {
    return {
      status: 'unsupported',
      rootLabel: defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Local Library folder mirroring is unavailable in this browser.',
    }
  }

  try {
    const directoryHandle = await env.showDirectoryPicker({ mode: 'readwrite' })
    return {
      status: 'enabled',
      directoryHandle,
      rootLabel: readRootLabel(directoryHandle),
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Local Library mirror folder is connected for this browser session.',
    }
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      return {
        status: 'permission-needed',
        rootLabel: defaultRootLabel,
        rootFolderPath: pubPartsLocalLibraryFolderPath,
        message: 'Choose a Local Library folder before ParaHook can mirror visible files.',
      }
    }

    return {
      status: 'error',
      rootLabel: defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Local Library folder selection failed.',
    }
  }
}

export function readPubPartsLocalLibraryMirrorCandidatePath(
  manifest: PubPartsInternalLibraryManifest,
  candidate: PubPartsInternalLibraryExtractedCandidate,
): PubPartsLocalLibraryMirrorCandidatePath {
  const itemSlug = resolveManifestItemSlug(manifest)
  const sourceVersionKey = resolveManifestSourceVersionKey(manifest)
  const itemFolderPath = `${pubPartsLocalLibraryFolderPath}/parts/${itemSlug}`
  return resolveMirrorCandidatePath(itemFolderPath, sourceVersionKey, candidate)
}

export function setPubPartsLocalLibraryMirrorSessionRoot(
  result: PubPartsLocalLibraryMirrorRead & {
    status: 'enabled'
    directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike
  },
): PubPartsLocalLibraryMirrorSessionRoot {
  const read: PubPartsLocalLibraryMirrorRead & { status: 'enabled' } = {
    status: 'enabled',
    rootLabel: result.rootLabel,
    rootFolderPath: result.rootFolderPath,
    message: result.message,
  }
  pubPartsLocalLibraryMirrorSessionRoot = {
    directoryHandle: result.directoryHandle,
    read,
  }
  return pubPartsLocalLibraryMirrorSessionRoot
}

export function getPubPartsLocalLibraryMirrorSessionRoot():
  | PubPartsLocalLibraryMirrorSessionRoot
  | null {
  return pubPartsLocalLibraryMirrorSessionRoot
}

export function clearPubPartsLocalLibraryMirrorSessionRoot(): void {
  pubPartsLocalLibraryMirrorSessionRoot = null
}

export function readPubPartsLocalLibraryMirrorStatus(
  config: PubPartsLocalLibraryConfig | undefined,
  env: PubPartsLocalLibraryMirrorEnv = resolveDefaultEnv(),
): PubPartsLocalLibraryMirrorRead {
  if (config?.status === 'disabled') {
    return {
      status: 'disabled',
      rootLabel: trimOptionalString(config.rootLabel) ?? defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Local Library folder mirroring is disabled.',
    }
  }

  if (config?.status === 'enabled') {
    const sessionRoot = getPubPartsLocalLibraryMirrorSessionRoot()
    if (sessionRoot !== null) {
      return sessionRoot.read
    }

    return {
      status: 'permission-needed',
      rootLabel: trimOptionalString(config.rootLabel) ?? defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Reconnect the Local Library folder before ParaHook can mirror visible files.',
    }
  }

  if (config?.status === 'permission-needed') {
    return {
      status: 'permission-needed',
      rootLabel: trimOptionalString(config.rootLabel) ?? defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Choose a Local Library folder before ParaHook can mirror visible files.',
    }
  }

  if (config?.status === 'unavailable') {
    return {
      status: 'unavailable',
      rootLabel: trimOptionalString(config.rootLabel) ?? defaultRootLabel,
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      message: 'Local Library folder mirroring is unavailable for this browser session.',
    }
  }

  return readPubPartsLocalLibraryMirrorCapability(env)
}

export function resolvePubPartsLocalLibraryMirrorPlan(
  manifest: PubPartsInternalLibraryManifest,
): PubPartsLocalLibraryMirrorPlan {
  const itemSlug = resolveManifestItemSlug(manifest)
  const sourceVersionKey = resolveManifestSourceVersionKey(manifest)
  const itemFolderPath = `${pubPartsLocalLibraryFolderPath}/parts/${itemSlug}`
  const archiveFileName = getFileName(manifest.sourceFileName, 'source-archive.zip')
  const extractedCandidates =
    (manifest as { extractedCandidates?: PubPartsInternalLibraryExtractedCandidate[] })
      .extractedCandidates ?? []
  const extractedPaths = extractedCandidates.map((candidate) =>
    resolveMirrorCandidatePath(itemFolderPath, sourceVersionKey, candidate),
  )

  return {
    schemaVersion: pubPartsLocalLibraryMirrorSchemaVersion,
    rootFolderPath: pubPartsLocalLibraryFolderPath,
    catalogItemId: manifest.catalogItemId,
    catalogItemLabel: manifest.catalogItemLabel,
    itemSlug,
    sourceVersionKey,
    itemFolderPath,
    manifestPath: `${itemFolderPath}/pubparts-source.json`,
    archivePath: `${itemFolderPath}/archives/${sourceVersionKey}/${archiveFileName}`,
    extractedPaths,
    importablePaths: extractedPaths,
  }
}

export async function writePubPartsLocalLibraryMirrorManifest(
  directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike,
  manifest: PubPartsInternalLibraryManifest,
): Promise<PubPartsLocalLibraryMirrorWriteResult> {
  const plan = resolvePubPartsLocalLibraryMirrorPlan(manifest)
  try {
    await writeLocalLibraryMirrorFile(
      directoryHandle,
      plan.manifestPath,
      JSON.stringify(manifest, null, 2),
    )
    return {
      status: 'mirrored',
      path: plan.manifestPath,
      message: 'PubParts source manifest mirrored into the Local Library folder.',
    }
  } catch {
    return {
      status: 'error',
      path: plan.manifestPath,
      message: 'PubParts source manifest could not be mirrored into the Local Library folder.',
    }
  }
}

export async function writePubPartsLocalLibraryMirrorArchive(
  directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike,
  plan: PubPartsLocalLibraryMirrorPlan,
  archiveBlob: Blob,
): Promise<PubPartsLocalLibraryMirrorWriteResult> {
  try {
    await writeLocalLibraryMirrorFile(directoryHandle, plan.archivePath, archiveBlob)
    return {
      status: 'mirrored',
      path: plan.archivePath,
      message: 'PubParts source archive mirrored into the Local Library folder.',
    }
  } catch {
    return {
      status: 'error',
      path: plan.archivePath,
      message: 'PubParts source archive could not be mirrored into the Local Library folder.',
    }
  }
}

export async function writePubPartsLocalLibraryMirrorExtractedCandidate(
  directoryHandle: PubPartsLocalLibraryMirrorDirectoryHandleLike,
  candidatePath: PubPartsLocalLibraryMirrorCandidatePath,
  candidateBlob: Blob,
): Promise<PubPartsLocalLibraryMirrorWriteResult> {
  try {
    await writeLocalLibraryMirrorFile(directoryHandle, candidatePath.extractedPath, candidateBlob)
    await writeLocalLibraryMirrorFile(directoryHandle, candidatePath.importablePath, candidateBlob)
    return {
      status: 'mirrored',
      path: candidatePath.importablePath,
      message: 'PubParts extracted candidate mirrored into the Local Library folder.',
    }
  } catch {
    return {
      status: 'error',
      path: candidatePath.importablePath,
      message: 'PubParts extracted candidate could not be mirrored into the Local Library folder.',
    }
  }
}

export function toPubPartsLocalLibraryMirrorStorageConfig(
  read: PubPartsLocalLibraryMirrorRead,
  options: { now?: () => Date } = {},
): PubPartsLocalLibraryConfig {
  const timestamp = (options.now ?? (() => new Date()))().toISOString()
  const status: PubPartsLocalLibraryConfig['status'] =
    read.status === 'enabled' ||
    read.status === 'disabled' ||
    read.status === 'not-configured' ||
    read.status === 'permission-needed'
      ? read.status
      : 'unavailable'

  return {
    status,
    rootLabel: read.rootLabel,
    rootFolderPath: read.rootFolderPath,
    updatedAt: timestamp,
  }
}
