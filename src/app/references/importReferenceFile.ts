import type { ReferenceFileType } from './referenceManifest'

type FileLike = Blob & {
  name?: string
}

type InputLike = {
  type: string
  accept: string
  multiple?: boolean
  onchange: (() => void) | null
  files?: ArrayLike<FileLike> | null
  click: () => void
  remove: () => void
}

type DocumentLike = {
  createElement: (tagName: 'input') => InputLike
  body?: {
    appendChild: (node: Node) => unknown
  }
}

type UrlLike = {
  createObjectURL: (blob: Blob) => string
}

type ReferenceImportEnv = {
  documentRef: DocumentLike
  urlRef: UrlLike
}

type ReferenceImportOptions = {
  multiple?: boolean
}

export type ImportedReferenceFile = {
  fileName: string
  fileType: ReferenceFileType
  objectUrl: string
}

export const SUPPORTED_REFERENCE_IMPORT_FILE_TYPES = ['step', 'stl', 'obj', 'glb'] as const

export const REFERENCE_IMPORT_LABEL_BY_FILE_TYPE: Record<ReferenceFileType, string> = {
  step: 'Import .step',
  stl: 'Import .stl',
  obj: 'Import .obj',
  glb: 'Import .glb',
}

export const REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE: Record<ReferenceFileType, string> = {
  step: '.step',
  stl: '.stl',
  obj: '.obj',
  glb: '.glb',
}

export const SUPPORTED_REFERENCE_IMPORT_ACCEPT = SUPPORTED_REFERENCE_IMPORT_FILE_TYPES.map(
  (fileType) => REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE[fileType],
).join(',')

const getBrowserReferenceImportEnv = (): ReferenceImportEnv => {
  if (
    typeof document === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function'
  ) {
    throw new Error('Reference file import is unavailable in this environment.')
  }

  return {
    documentRef: document,
    urlRef: URL,
  }
}

const getReferenceFilename = (file: FileLike, fileType: ReferenceFileType): string => {
  const fileName = file.name?.trim()
  if (fileName !== undefined && fileName.length > 0) {
    return fileName
  }
  return `Imported Reference.${fileType}`
}

const createReferenceImportInput = (
  fileType: ReferenceFileType,
  env: ReferenceImportEnv,
  options: ReferenceImportOptions = {},
): InputLike => {
  const input = env.documentRef.createElement('input')
  input.type = 'file'
  input.accept = REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE[fileType]
  if (options.multiple === true) {
    input.multiple = true
  }

  if (env.documentRef.body !== undefined) {
    env.documentRef.body.appendChild(input as unknown as Node)
  }

  return input
}

const createImportedReferenceFile = (
  file: FileLike,
  fileType: ReferenceFileType,
  env: ReferenceImportEnv,
): ImportedReferenceFile => ({
  fileName: getReferenceFilename(file, fileType),
  fileType,
  objectUrl: env.urlRef.createObjectURL(file),
})

const getSelectedReferenceFiles = (input: InputLike): FileLike[] =>
  input.files === undefined || input.files === null ? [] : Array.from(input.files)

const inferReferenceFileTypeFromName = (fileName: string): ReferenceFileType | null => {
  const normalizedFileName = fileName.trim().toLowerCase()
  const matchedFileType = SUPPORTED_REFERENCE_IMPORT_FILE_TYPES.find((fileType) =>
    normalizedFileName.endsWith(`.${fileType}`),
  )
  return matchedFileType ?? null
}

const importReferenceFilesWithOptions = async (
  fileType: ReferenceFileType,
  env: ReferenceImportEnv,
  options: ReferenceImportOptions = {},
): Promise<ImportedReferenceFile[]> => {
  const input = createReferenceImportInput(fileType, env, options)

  return new Promise<ImportedReferenceFile[]>((resolve, reject) => {
    const cleanup = () => {
      input.onchange = null
      input.remove()
    }

    input.onchange = () => {
      const files = getSelectedReferenceFiles(input)
      if (files.length === 0) {
        cleanup()
        reject(new Error('No reference file selected.'))
        return
      }

      try {
        resolve(files.map((file) => createImportedReferenceFile(file, fileType, env)))
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error('Failed to create a workspace URL for the imported reference.'),
        )
      } finally {
        cleanup()
      }
    }

    input.click()
  })
}

export const importReferenceFilesFromDisk = async (
  fileType: ReferenceFileType,
  env: ReferenceImportEnv = getBrowserReferenceImportEnv(),
): Promise<ImportedReferenceFile[]> =>
  importReferenceFilesWithOptions(fileType, env, {
    multiple: fileType === 'obj',
  })

export const importReferenceFileFromDisk = async (
  fileType: ReferenceFileType,
  env: ReferenceImportEnv = getBrowserReferenceImportEnv(),
): Promise<ImportedReferenceFile> => {
  const [file] = await importReferenceFilesWithOptions(fileType, env)
  if (file === undefined) {
    throw new Error('No reference file selected.')
  }
  return file
}

export const importSupportedReferenceFilesFromDisk = async (
  env: ReferenceImportEnv = getBrowserReferenceImportEnv(),
): Promise<ImportedReferenceFile[]> => {
  const input = env.documentRef.createElement('input')
  input.type = 'file'
  input.accept = SUPPORTED_REFERENCE_IMPORT_ACCEPT
  input.multiple = true

  if (env.documentRef.body !== undefined) {
    env.documentRef.body.appendChild(input as unknown as Node)
  }

  return new Promise<ImportedReferenceFile[]>((resolve, reject) => {
    const cleanup = () => {
      input.onchange = null
      input.remove()
    }

    input.onchange = () => {
      const files = getSelectedReferenceFiles(input)
      if (files.length === 0) {
        cleanup()
        reject(new Error('No reference file selected.'))
        return
      }

      try {
        const importedFiles = files.map((file) => {
          const fileType = inferReferenceFileTypeFromName(file.name ?? '')
          if (fileType === null) {
            throw new Error('Unsupported reference file type selected.')
          }
          return createImportedReferenceFile(file, fileType, env)
        })
        resolve(importedFiles)
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error('Failed to create workspace URLs for the imported references.'),
        )
      } finally {
        cleanup()
      }
    }

    input.click()
  })
}
