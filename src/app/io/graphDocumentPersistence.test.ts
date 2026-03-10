import { describe, expect, it, vi } from 'vitest'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import {
  GRAPH_DOCUMENT_FILE_EXTENSION,
  GRAPH_DOCUMENT_FILE_MIME,
  deserializeGraphDocument,
  loadGraphDocumentFromFile,
  saveGraphDocumentToFile,
  serializeGraphDocument,
  toGraphDocumentFilename,
} from './graphDocumentPersistence'

const createGraphDocument = (): GraphDocument => ({
  graphDocumentId: 'graph-document-1',
  name: 'Graph Document 1',
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes: [
      {
        nodeId: 'node-baseplate-1',
        type: 'Part/Baseplate',
        params: {},
      },
    ],
    edges: [],
    ui: {
      nodes: {
        'node-baseplate-1': { x: 120, y: 240 },
      },
      nodeModesByNodeId: {
        'node-baseplate-1': 'expanded',
      },
    },
  },
})

describe('graphDocumentPersistence', () => {
  it('serializes one graph document to stable JSON text', () => {
    const graphDocument = createGraphDocument()

    expect(serializeGraphDocument(graphDocument)).toBe(
      '{"graph":{"edges":[],"nodes":[{"nodeId":"node-baseplate-1","params":{},"type":"Part/Baseplate"}],"schemaVersion":1,"ui":{"nodeModesByNodeId":{"node-baseplate-1":"expanded"},"nodes":{"node-baseplate-1":{"x":120,"y":240}}}},"graphDocumentId":"graph-document-1","name":"Graph Document 1","version":1}',
    )
  })

  it('round-trips serialized graph documents through deserializeGraphDocument', () => {
    const graphDocument = createGraphDocument()

    expect(deserializeGraphDocument(serializeGraphDocument(graphDocument))).toEqual(graphDocument)
  })

  it('fails cleanly for invalid JSON', () => {
    expect(() => deserializeGraphDocument('{bad json')).toThrow(
      /Failed to parse graph document JSON:/,
    )
  })

  it('fails through the graph-document parser for invalid graph-document shape', () => {
    expect(() =>
      deserializeGraphDocument(
        JSON.stringify({
          graphDocumentId: 'graph-document-1',
          name: 'Graph Document 1',
          version: 1,
        }),
      ),
    ).toThrow()
  })

  it('builds the default saved filename from the graph document name', () => {
    expect(
      toGraphDocumentFilename({
        name: 'My Graph / Demo',
      }),
    ).toBe(`My-Graph--Demo${GRAPH_DOCUMENT_FILE_EXTENSION}`)
  })

  it('saves one graph document through the browser file IO seam', async () => {
    const graphDocument = createGraphDocument()
    const click = vi.fn()
    const remove = vi.fn()
    const appendChild = vi.fn()
    const createObjectURL = vi.fn((blob: Blob) => {
      void blob
      return 'blob:graph-document'
    })
    const revokeObjectURL = vi.fn((url: string) => {
      void url
    })

    const env: NonNullable<Parameters<typeof saveGraphDocumentToFile>[2]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'a') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return {
            href: '',
            download: '',
            click,
            remove,
          }
        },
        body: {
          appendChild,
        },
      },
      urlRef: {
        createObjectURL,
        revokeObjectURL,
      },
    }

    await saveGraphDocumentToFile(graphDocument, undefined, env)

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    const savedBlob = createObjectURL.mock.calls[0]?.[0] as Blob | undefined
    expect(savedBlob).toBeInstanceOf(Blob)
    await expect(savedBlob?.text()).resolves.toBe(serializeGraphDocument(graphDocument))
    expect(click).toHaveBeenCalledTimes(1)
    expect(appendChild).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:graph-document')
  })

  it('loads one graph document through the browser file IO seam', async () => {
    const graphDocument = createGraphDocument()
    const input = {
      type: '',
      accept: '',
      onchange: null as (() => void) | null,
      files: [
        {
          text: async () => serializeGraphDocument(graphDocument),
        },
      ],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }

    const env: NonNullable<Parameters<typeof loadGraphDocumentFromFile>[1]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'input') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return input
        },
        body: {
          appendChild: vi.fn(),
        },
      },
      urlRef: {
        createObjectURL: vi.fn(),
        revokeObjectURL: vi.fn(),
      },
    }

    await expect(loadGraphDocumentFromFile(undefined, env)).resolves.toEqual(graphDocument)
    expect(input.accept).toBe(`${GRAPH_DOCUMENT_FILE_EXTENSION},${GRAPH_DOCUMENT_FILE_MIME}`)
    expect(input.remove).toHaveBeenCalledTimes(1)
  })

  it('rejects load when no file is selected', async () => {
    const input = {
      type: '',
      accept: '',
      onchange: null as (() => void) | null,
      files: [],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }

    const env: NonNullable<Parameters<typeof loadGraphDocumentFromFile>[1]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'input') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return input
        },
        body: {
          appendChild: vi.fn(),
        },
      },
      urlRef: {
        createObjectURL: vi.fn(),
        revokeObjectURL: vi.fn(),
      },
    }

    await expect(loadGraphDocumentFromFile(undefined, env)).rejects.toThrow(
      'No graph document file selected.',
    )
    expect(input.remove).toHaveBeenCalledTimes(1)
  })
})
