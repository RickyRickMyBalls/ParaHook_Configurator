// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import {
  DROPBOX_CHOOSER_SUPPORTED_EXTENSIONS,
  fetchDropboxChooserSelectedReferenceFile,
  openDropboxChooserBridge,
  preloadDropboxChooserBridge,
  resolveDropboxChooserFileType,
} from './dropboxChooserBridge'

type DropboxChooserTestOptions = {
  success: (files: Array<{ name?: string; link?: string; bytes?: number }>) => void
  cancel: () => void
  linkType: 'direct'
  multiselect: false
  extensions: readonly string[]
}

describe('dropboxChooserBridge', () => {
  it('normalizes supported Dropbox Chooser file extensions', () => {
    expect(resolveDropboxChooserFileType('Assembly.step')).toBe('step')
    expect(resolveDropboxChooserFileType('Assembly.stp')).toBe('stp')
    expect(resolveDropboxChooserFileType('preview.GLB')).toBe('glb')
    expect(resolveDropboxChooserFileType('part.obj')).toBe('obj')
    expect(resolveDropboxChooserFileType('part.stl')).toBe('stl')
    expect(resolveDropboxChooserFileType('archive.zip')).toBeNull()
  })

  it('opens Chooser with direct links and supported source extensions', async () => {
    const choose = vi.fn((options: DropboxChooserTestOptions) => {
      expect(options.linkType).toBe('direct')
      expect(options.multiselect).toBe(false)
      expect(options.extensions).toEqual(DROPBOX_CHOOSER_SUPPORTED_EXTENSIONS)
      options.success([
        {
          name: 'source-model.glb',
          link: 'https://dl.dropboxusercontent.com/source-model.glb',
          bytes: 1024,
        },
      ])
    })
    const chooserResult = await openDropboxChooserBridge({
      windowRef: {
        Dropbox: {
          choose,
        },
      } as unknown as Window & { Dropbox: { choose: typeof choose } },
      documentRef: document,
    })

    expect(chooserResult).toEqual({
      status: 'selected',
      file: {
        name: 'source-model.glb',
        link: 'https://dl.dropboxusercontent.com/source-model.glb',
        bytes: 1024,
        icon: undefined,
        thumbnailLink: undefined,
        fileType: 'glb',
      },
    })
  })

  it('reports unsupported selected files without fetching them', async () => {
    const chooserResult = await openDropboxChooserBridge({
      windowRef: {
        Dropbox: {
          choose: (options: DropboxChooserTestOptions) =>
            options.success([
              {
                name: 'readme.pdf',
                link: 'https://dl.dropboxusercontent.com/readme.pdf',
              },
            ]),
        },
      } as unknown as Window & { Dropbox: { choose: (options: DropboxChooserTestOptions) => void } },
      documentRef: document,
    })

    expect(chooserResult).toEqual({
      status: 'unsupported-file',
      fileName: 'readme.pdf',
      fileType: 'pdf',
    })
  })

  it('reports setup-needed when Chooser is not loaded and no app key is configured', async () => {
    await expect(
      openDropboxChooserBridge({
        windowRef: window as Window,
        documentRef: document,
        appKey: '',
      }),
    ).resolves.toEqual({
      status: 'unavailable',
      reason: 'Dropbox Chooser app key is not configured.',
    })
  })

  it('can preload Chooser when the script is already available', async () => {
    await expect(
      preloadDropboxChooserBridge({
        windowRef: {
          Dropbox: {
            choose: vi.fn(),
          },
        } as unknown as Window & { Dropbox: { choose: (options: DropboxChooserTestOptions) => void } },
        documentRef: document,
      }),
    ).resolves.toEqual({ status: 'ready' })
  })

  it('fetches selected direct links into Import-staged reference files', async () => {
    const createObjectURL = vi.fn(() => 'blob:dropbox-source')
    const fetchRef = vi.fn().mockResolvedValue(
      new Response(new Blob(['glb bytes'], { type: 'model/gltf-binary' }), {
        status: 200,
      }),
    )

    await expect(
      fetchDropboxChooserSelectedReferenceFile(
        {
          name: 'source-model.glb',
          link: 'https://dl.dropboxusercontent.com/source-model.glb',
          fileType: 'glb',
        },
        {
          fetchRef,
          urlRef: {
            createObjectURL,
          },
          fileCtor: File,
        },
      ),
    ).resolves.toEqual({
      fileName: 'source-model.glb',
      fileType: 'glb',
      objectUrl: 'blob:dropbox-source',
    })
    expect(fetchRef).toHaveBeenCalledWith('https://dl.dropboxusercontent.com/source-model.glb')
  })

  it('keeps .stp as selected source metadata until Import owns that type', async () => {
    await expect(
      fetchDropboxChooserSelectedReferenceFile({
        name: 'source-model.stp',
        link: 'https://dl.dropboxusercontent.com/source-model.stp',
        fileType: 'stp',
      }),
    ).resolves.toEqual({
      status: 'unsupported-import-type',
      fileType: 'stp',
    })
  })
})
