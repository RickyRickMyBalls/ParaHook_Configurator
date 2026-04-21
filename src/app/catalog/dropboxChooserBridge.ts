import {
  type ImportedReferenceFile,
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'

export const DROPBOX_CHOOSER_SCRIPT_ID = 'dropboxjs'
export const DROPBOX_CHOOSER_SCRIPT_SRC = 'https://www.dropbox.com/static/api/2/dropins.js'
export const DROPBOX_CHOOSER_SUPPORTED_EXTENSIONS = [
  '.step',
  '.stp',
  '.glb',
  '.obj',
  '.stl',
] as const

export type DropboxChooserSupportedExtension =
  (typeof DROPBOX_CHOOSER_SUPPORTED_EXTENSIONS)[number]

export type DropboxChooserSupportedFileType = 'step' | 'stp' | ReferenceFileType

export type DropboxChooserSelectedFile = {
  name: string
  link: string
  bytes?: number
  icon?: string
  thumbnailLink?: string
  fileType: DropboxChooserSupportedFileType
}

export type DropboxChooserBridgeResult =
  | {
      status: 'selected'
      file: DropboxChooserSelectedFile
    }
  | {
      status: 'unsupported-file'
      fileName: string
      fileType: string | null
    }
  | {
      status: 'canceled'
    }
  | {
      status: 'unavailable'
      reason: string
    }

export type DropboxChooserPreloadResult =
  | {
      status: 'ready'
    }
  | {
      status: 'unavailable'
      reason: string
    }

type DropboxChooserRawFile = {
  name?: string
  link?: string
  bytes?: number
  icon?: string
  thumbnailLink?: string
}

type DropboxChooserOptions = {
  success: (files: DropboxChooserRawFile[]) => void
  cancel: () => void
  linkType: 'direct'
  multiselect: false
  extensions: readonly string[]
}

type DropboxChooserGlobal = {
  choose: (options: DropboxChooserOptions) => void
}

type DropboxChooserDocumentLike = Pick<Document, 'getElementById' | 'createElement'> & {
  head?: Pick<HTMLElement, 'appendChild'>
  body?: Pick<HTMLElement, 'appendChild'>
}

type DropboxChooserEnv = {
  windowRef?: Window & { Dropbox?: DropboxChooserGlobal }
  documentRef?: DropboxChooserDocumentLike
  appKey?: string
}

type FetchSelectedFileEnv = {
  fetchRef?: typeof fetch
  urlRef?: Pick<typeof URL, 'createObjectURL'>
  fileCtor?: typeof File
}

const getDropboxChooserAppKey = (): string =>
  (import.meta.env.VITE_DROPBOX_CHOOSER_APP_KEY as string | undefined)?.trim() ?? ''

export const isDropboxChooserAppKeyConfigured = (): boolean =>
  getDropboxChooserAppKey().length > 0

const resolveBrowserDropboxChooserEnv = (): Required<
  Pick<DropboxChooserEnv, 'windowRef' | 'documentRef'>
> & {
  appKey: string
} | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  return {
    windowRef: window as Window & { Dropbox?: DropboxChooserGlobal },
    documentRef: document,
    appKey: getDropboxChooserAppKey(),
  }
}

export function resolveDropboxChooserFileType(fileName: string): DropboxChooserSupportedFileType | null {
  const normalizedFileName = fileName.trim().toLowerCase()
  const extension = DROPBOX_CHOOSER_SUPPORTED_EXTENSIONS.find((candidate) =>
    normalizedFileName.endsWith(candidate),
  )

  return extension === undefined ? null : extension.slice(1) as DropboxChooserSupportedFileType
}

function normalizeDropboxChooserSelectedFile(
  rawFile: DropboxChooserRawFile,
): DropboxChooserSelectedFile | { unsupportedFileName: string; unsupportedFileType: string | null } {
  const name = rawFile.name?.trim() ?? ''
  const link = rawFile.link?.trim() ?? ''
  const fileType = resolveDropboxChooserFileType(name)

  if (name.length === 0 || link.length === 0 || fileType === null) {
    return {
      unsupportedFileName: name.length > 0 ? name : 'Dropbox selected file',
      unsupportedFileType: name.includes('.') ? name.split('.').at(-1)?.toLowerCase() ?? null : null,
    }
  }

  return {
    name,
    link,
    bytes: rawFile.bytes,
    icon: rawFile.icon,
    thumbnailLink: rawFile.thumbnailLink,
    fileType,
  }
}

const isDropboxChooserReady = (
  windowRef: Window & { Dropbox?: DropboxChooserGlobal },
): windowRef is Window & { Dropbox: DropboxChooserGlobal } =>
  typeof windowRef.Dropbox?.choose === 'function'

let dropboxChooserScriptLoadPromise: Promise<void> | null = null

function loadDropboxChooserScript(env: Required<DropboxChooserEnv>): Promise<void> {
  if (isDropboxChooserReady(env.windowRef)) {
    return Promise.resolve()
  }

  if (env.appKey.trim().length === 0) {
    return Promise.reject(new Error('Dropbox Chooser app key is not configured.'))
  }

  if (dropboxChooserScriptLoadPromise !== null) {
    return dropboxChooserScriptLoadPromise
  }

  const existingScript = env.documentRef.getElementById(DROPBOX_CHOOSER_SCRIPT_ID) as
    | HTMLScriptElement
    | null

  if (existingScript !== null) {
    dropboxChooserScriptLoadPromise = new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Dropbox Chooser script failed to load.')),
        { once: true },
      )
    })
    return dropboxChooserScriptLoadPromise
  }

  dropboxChooserScriptLoadPromise = new Promise((resolve, reject) => {
    const script = env.documentRef.createElement('script') as HTMLScriptElement
    script.id = DROPBOX_CHOOSER_SCRIPT_ID
    script.src = DROPBOX_CHOOSER_SCRIPT_SRC
    script.type = 'text/javascript'
    script.dataset.appKey = env.appKey
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('Dropbox Chooser script failed to load.')),
      { once: true },
    )
    ;(env.documentRef.head ?? env.documentRef.body)?.appendChild(script)
  })

  return dropboxChooserScriptLoadPromise
}

export async function preloadDropboxChooserBridge(
  options: DropboxChooserEnv = {},
): Promise<DropboxChooserPreloadResult> {
  const browserEnv = resolveBrowserDropboxChooserEnv()
  const windowRef = options.windowRef ?? browserEnv?.windowRef
  const documentRef = options.documentRef ?? browserEnv?.documentRef
  const appKey = options.appKey ?? browserEnv?.appKey ?? ''

  if (windowRef === undefined || documentRef === undefined) {
    return {
      status: 'unavailable',
      reason: 'Dropbox Chooser is unavailable outside the browser.',
    }
  }

  try {
    await loadDropboxChooserScript({ windowRef, documentRef, appKey })
  } catch (error) {
    return {
      status: 'unavailable',
      reason:
        error instanceof Error
          ? error.message
          : 'Dropbox Chooser could not be loaded.',
    }
  }

  return isDropboxChooserReady(windowRef)
    ? { status: 'ready' }
    : {
        status: 'unavailable',
        reason: 'Dropbox Chooser did not become available.',
      }
}

export async function openDropboxChooserBridge(
  options: DropboxChooserEnv = {},
): Promise<DropboxChooserBridgeResult> {
  const browserEnv = resolveBrowserDropboxChooserEnv()
  const windowRef = options.windowRef ?? browserEnv?.windowRef
  const documentRef = options.documentRef ?? browserEnv?.documentRef
  const appKey = options.appKey ?? browserEnv?.appKey ?? ''

  if (windowRef === undefined || documentRef === undefined) {
    return {
      status: 'unavailable',
      reason: 'Dropbox Chooser is unavailable outside the browser.',
    }
  }

  try {
    await loadDropboxChooserScript({ windowRef, documentRef, appKey })
  } catch (error) {
    return {
      status: 'unavailable',
      reason:
        error instanceof Error
          ? error.message
          : 'Dropbox Chooser could not be loaded.',
    }
  }

  if (!isDropboxChooserReady(windowRef)) {
    return {
      status: 'unavailable',
      reason: 'Dropbox Chooser did not become available.',
    }
  }

  return new Promise<DropboxChooserBridgeResult>((resolve) => {
    windowRef.Dropbox.choose({
      linkType: 'direct',
      multiselect: false,
      extensions: DROPBOX_CHOOSER_SUPPORTED_EXTENSIONS,
      cancel: () => resolve({ status: 'canceled' }),
      success: (files) => {
        const selectedFile = files[0]
        if (selectedFile === undefined) {
          resolve({ status: 'canceled' })
          return
        }

        const normalizedFile = normalizeDropboxChooserSelectedFile(selectedFile)
        if ('unsupportedFileName' in normalizedFile) {
          resolve({
            status: 'unsupported-file',
            fileName: normalizedFile.unsupportedFileName,
            fileType: normalizedFile.unsupportedFileType,
          })
          return
        }

        resolve({
          status: 'selected',
          file: normalizedFile,
        })
      },
    })
  })
}

function resolveImportFileType(fileType: DropboxChooserSupportedFileType): ReferenceFileType | null {
  return SUPPORTED_REFERENCE_IMPORT_FILE_TYPES.includes(fileType as ReferenceFileType)
    ? fileType as ReferenceFileType
    : null
}

export async function fetchDropboxChooserSelectedReferenceFile(
  selectedFile: DropboxChooserSelectedFile,
  env: FetchSelectedFileEnv = {},
): Promise<ImportedReferenceFile | { status: 'unsupported-import-type'; fileType: string }> {
  const fileType = resolveImportFileType(selectedFile.fileType)
  if (fileType === null) {
    return {
      status: 'unsupported-import-type',
      fileType: selectedFile.fileType,
    }
  }

  const fetchRef = env.fetchRef ?? fetch
  const urlRef = env.urlRef ?? URL
  const response = await fetchRef(selectedFile.link)
  if (!response.ok) {
    throw new Error(`Dropbox file fetch failed with status ${response.status}.`)
  }

  const blob = await response.blob()
  const fileLike =
    env.fileCtor !== undefined
      ? new env.fileCtor([blob], selectedFile.name, {
          type: blob.type,
        })
      : blob

  return {
    fileName: selectedFile.name,
    fileType,
    objectUrl: urlRef.createObjectURL(fileLike),
  }
}
