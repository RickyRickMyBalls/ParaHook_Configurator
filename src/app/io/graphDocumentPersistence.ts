import { parseGraphDocument } from '../spaghetti/schema/spaghettiSchema'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'

export const GRAPH_DOCUMENT_FILE_EXTENSION = '.parahook-graph.json'
export const GRAPH_DOCUMENT_FILE_MIME = 'application/json'

type PersistedGraphDocument = {
  graphDocumentId: string
  name: string
  version: GraphDocument['version']
  graph: GraphDocument['graph']
}

type BlobCtor = typeof Blob

type AnchorLike = {
  href: string
  download: string
  click: () => void
  remove: () => void
}

type FileLike = {
  text: () => Promise<string>
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
  createElement: (tagName: 'a' | 'input') => AnchorLike | InputLike
  body?: {
    appendChild: (node: Node) => unknown
  }
}

type UrlLike = {
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
}

type BrowserPersistenceEnv = {
  BlobCtor: BlobCtor
  documentRef: DocumentLike
  urlRef: UrlLike
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  const entries = Object.entries(value as Record<string, unknown>).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )
  return `{${entries
    .map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`)
    .join(',')}}`
}

const toPersistedGraphDocument = (document: GraphDocument): PersistedGraphDocument => ({
  graphDocumentId: document.graphDocumentId,
  name: document.name,
  version: document.version,
  graph: document.graph,
})

const getBrowserPersistenceEnv = (): BrowserPersistenceEnv => {
  if (
    typeof Blob === 'undefined' ||
    typeof document === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    throw new Error('Graph document browser file IO is unavailable in this environment.')
  }

  return {
    BlobCtor: Blob,
    documentRef: document,
    urlRef: URL,
  }
}

const sanitizeFilenameFragment = (value: string): string => {
  const collapsed = value.trim().replace(/\s+/g, '-')
  const sanitized = collapsed.replace(/[^a-zA-Z0-9._-]/g, '')
  return sanitized.length > 0 ? sanitized : 'graph-document'
}

export const toGraphDocumentFilename = (
  document: Pick<GraphDocument, 'name'>,
  extension: string = GRAPH_DOCUMENT_FILE_EXTENSION,
): string => `${sanitizeFilenameFragment(document.name)}${extension}`

export const serializeGraphDocument = (document: GraphDocument): string =>
  stableStringify(toPersistedGraphDocument(document))

export const deserializeGraphDocument = (json: string): GraphDocument => {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse failure.'
    throw new Error(`Failed to parse graph document JSON: ${message}`)
  }
  return parseGraphDocument(parsed)
}

export const saveGraphDocumentToFile = async (
  document: GraphDocument,
  options?: {
    filename?: string
  },
  env: BrowserPersistenceEnv = getBrowserPersistenceEnv(),
): Promise<void> => {
  const json = serializeGraphDocument(document)
  const blob = new env.BlobCtor([json], {
    type: GRAPH_DOCUMENT_FILE_MIME,
  })
  const objectUrl = env.urlRef.createObjectURL(blob)
  const anchor = env.documentRef.createElement('a') as AnchorLike
  anchor.href = objectUrl
  anchor.download = options?.filename ?? toGraphDocumentFilename(document)
  if (env.documentRef.body !== undefined) {
    env.documentRef.body.appendChild(anchor as unknown as Node)
  }
  try {
    anchor.click()
  } finally {
    anchor.remove()
    env.urlRef.revokeObjectURL(objectUrl)
  }
}

export const loadGraphDocumentFromFile = async (
  options?: {
    accept?: string
  },
  env: BrowserPersistenceEnv = getBrowserPersistenceEnv(),
): Promise<GraphDocument> => {
  const input = env.documentRef.createElement('input') as InputLike
  input.type = 'file'
  input.accept = options?.accept ?? `${GRAPH_DOCUMENT_FILE_EXTENSION},${GRAPH_DOCUMENT_FILE_MIME}`

  if (env.documentRef.body !== undefined) {
    env.documentRef.body.appendChild(input as unknown as Node)
  }

  return new Promise<GraphDocument>((resolve, reject) => {
    const cleanup = () => {
      input.onchange = null
      input.remove()
    }

    input.onchange = () => {
      const file = input.files?.[0]
      if (file === undefined) {
        cleanup()
        reject(new Error('No graph document file selected.'))
        return
      }

      file
        .text()
        .then((json) => {
          resolve(deserializeGraphDocument(json))
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            reject(error)
            return
          }
          reject(new Error('Failed to read graph document file.'))
        })
        .finally(cleanup)
    }

    input.click()
  })
}

export const isPersistedGraphDocument = (value: unknown): value is PersistedGraphDocument => {
  if (!isRecord(value)) {
    return false
  }
  return (
    typeof value.graphDocumentId === 'string' &&
    typeof value.name === 'string' &&
    value.version === 1 &&
    isRecord(value.graph)
  )
}
