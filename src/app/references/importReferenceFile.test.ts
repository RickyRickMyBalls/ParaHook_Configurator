import { describe, expect, it, vi } from 'vitest'
import {
  REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE,
  importReferenceFileFromDisk,
} from './importReferenceFile'

describe('importReferenceFileFromDisk', () => {
  it('opens a single-file input for the requested type and returns a workspace object URL', async () => {
    const input = {
      type: '',
      accept: '',
      onchange: null as (() => void) | null,
      files: [
        {
          name: 'shoe.glb',
        },
      ],
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
    expect(createObjectURL).toHaveBeenCalledWith(input.files[0])
    expect(input.remove).toHaveBeenCalledTimes(1)
  })

  it('rejects when the user cancels the import dialog', async () => {
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
})
