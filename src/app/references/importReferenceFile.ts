import type { ReferenceFileType } from './referenceManifest'

type FileLike = Blob & {
  name?: string
}

type InputLike = {
  type: string
  accept: string
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

export type ImportedReferenceFile = {
  fileName: string
  fileType: ReferenceFileType
  objectUrl: string
}

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

export const importReferenceFileFromDisk = async (
  fileType: ReferenceFileType,
  env: ReferenceImportEnv = getBrowserReferenceImportEnv(),
): Promise<ImportedReferenceFile> => {
  const input = env.documentRef.createElement('input')
  input.type = 'file'
  input.accept = REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE[fileType]

  if (env.documentRef.body !== undefined) {
    env.documentRef.body.appendChild(input as unknown as Node)
  }

  return new Promise<ImportedReferenceFile>((resolve, reject) => {
    const cleanup = () => {
      input.onchange = null
      input.remove()
    }

    input.onchange = () => {
      const file = input.files?.[0]
      if (file === undefined) {
        cleanup()
        reject(new Error('No reference file selected.'))
        return
      }

      try {
        resolve({
          fileName: getReferenceFilename(file, fileType),
          fileType,
          objectUrl: env.urlRef.createObjectURL(file),
        })
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
