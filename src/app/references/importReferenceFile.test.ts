import { describe, expect, it, vi } from 'vitest'
import {
  REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE,
  importReferenceFileFromDisk,
  importReferenceFilesFromDisk,
  importSupportedReferenceFilesFromDisk,
  SUPPORTED_REFERENCE_IMPORT_ACCEPT,
} from './importReferenceFile'

describe('importReferenceFileFromDisk', () => {
  it('opens a single-file input for the requested type and returns a workspace object URL', async () => {
    const file = Object.assign(new Blob(['shoe']), { name: 'shoe.glb' })
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [file],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }
    const createObjectURL = vi.fn(() => 'blob:shoe-1')

    await expect(
      importReferenceFileFromDisk('glb', {
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual({
      fileName: 'shoe.glb',
      fileType: 'glb',
      objectUrl: 'blob:shoe-1',
    })

    expect(input.type).toBe('file')
    expect(input.accept).toBe(REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE.glb)
    expect(input.multiple).toBeUndefined()
    expect(createObjectURL).toHaveBeenCalledWith(input.files[0])
    expect(input.remove).toHaveBeenCalledTimes(1)
  })

  it('rejects when the user cancels the import dialog', async () => {
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }

    await expect(
      importReferenceFileFromDisk('step', {
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL: vi.fn(),
        },
      }),
    ).rejects.toThrow('No reference file selected.')

    expect(input.accept).toBe(REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE.step)
    expect(input.remove).toHaveBeenCalledTimes(1)
  })

  it('keeps returning the first imported file when the batch helper yields more than one file', async () => {
    const firstFile = Object.assign(new Blob(['shoe']), { name: 'shoe-1.obj' })
    const secondFile = Object.assign(new Blob(['shoe']), { name: 'shoe-2.obj' })
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [firstFile, secondFile],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }
    const createObjectURL = vi
      .fn()
      .mockReturnValueOnce('blob:shoe-1')
      .mockReturnValueOnce('blob:shoe-2')

    await expect(
      importReferenceFileFromDisk('obj', {
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual({
      fileName: 'shoe-1.obj',
      fileType: 'obj',
      objectUrl: 'blob:shoe-1',
    })

    expect(input.multiple).toBeUndefined()
    expect(createObjectURL).toHaveBeenCalledTimes(2)
  })
})

describe('importReferenceFilesFromDisk', () => {
  it('returns every selected file as imported reference metadata', async () => {
    const firstFile = Object.assign(new Blob(['shoe']), { name: 'shoe-1.obj' })
    const secondFile = Object.assign(new Blob(['shoe']), { name: 'shoe-2.obj' })
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [firstFile, secondFile],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }
    const createObjectURL = vi
      .fn()
      .mockReturnValueOnce('blob:shoe-1')
      .mockReturnValueOnce('blob:shoe-2')

    await expect(
      importReferenceFilesFromDisk('obj', {
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual([
      {
        fileName: 'shoe-1.obj',
        fileType: 'obj',
        objectUrl: 'blob:shoe-1',
      },
      {
        fileName: 'shoe-2.obj',
        fileType: 'obj',
        objectUrl: 'blob:shoe-2',
      },
    ])

    expect(input.type).toBe('file')
    expect(input.accept).toBe(REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE.obj)
    expect(input.multiple).toBe(true)
    expect(createObjectURL).toHaveBeenCalledWith(firstFile)
    expect(createObjectURL).toHaveBeenCalledWith(secondFile)
    expect(input.remove).toHaveBeenCalledTimes(1)
  })

  it('keeps non-obj batch helper calls single-select by default', async () => {
    const file = Object.assign(new Blob(['shoe']), { name: 'shoe.glb' })
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [file],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }
    const createObjectURL = vi.fn(() => 'blob:shoe-1')

    await expect(
      importReferenceFilesFromDisk('glb', {
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual([
      {
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-1',
      },
    ])

    expect(input.multiple).toBeUndefined()
  })
})

describe('importSupportedReferenceFilesFromDisk', () => {
  it('accepts all supported reference types through one multi-file picker and infers each file type from its name', async () => {
    const firstFile = Object.assign(new Blob(['shoe']), { name: 'shoe.step' })
    const secondFile = Object.assign(new Blob(['shoe']), { name: 'shoe.GLB' })
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [firstFile, secondFile],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }
    const createObjectURL = vi
      .fn()
      .mockReturnValueOnce('blob:shoe-step')
      .mockReturnValueOnce('blob:shoe-glb')

    await expect(
      importSupportedReferenceFilesFromDisk({
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL,
        },
      }),
    ).resolves.toEqual([
      {
        fileName: 'shoe.step',
        fileType: 'step',
        objectUrl: 'blob:shoe-step',
      },
      {
        fileName: 'shoe.GLB',
        fileType: 'glb',
        objectUrl: 'blob:shoe-glb',
      },
    ])

    expect(input.type).toBe('file')
    expect(input.accept).toBe(SUPPORTED_REFERENCE_IMPORT_ACCEPT)
    expect(input.multiple).toBe(true)
    expect(input.remove).toHaveBeenCalledTimes(1)
  })

  it('rejects unsupported file extensions in the staged import picker', async () => {
    const file = Object.assign(new Blob(['shoe']), { name: 'shoe.unsupported' })
    const input = {
      type: '',
      accept: '',
      multiple: undefined as boolean | undefined,
      onchange: null as (() => void) | null,
      files: [file],
      click: () => {
        input.onchange?.()
      },
      remove: vi.fn(),
    }

    await expect(
      importSupportedReferenceFilesFromDisk({
        documentRef: {
          createElement: () => input,
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL: vi.fn(),
        },
      }),
    ).rejects.toThrow('Unsupported reference file type selected.')

    expect(input.remove).toHaveBeenCalledTimes(1)
  })
})
