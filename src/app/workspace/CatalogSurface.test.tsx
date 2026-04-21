// @vitest-environment jsdom

import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetCatalogPreviewSessionsForTests } from '../catalog/catalogPreviewSession'
import {
  pubPartsArchiveManifestCacheStorageKey,
  writePubPartsArchiveManifestCacheRecord,
} from '../catalog/pubPartsArchiveManifestCache'
import {
  pubPartsDownloadsStorageKey,
  readPubPartsDownloadsStorage,
} from '../catalog/pubPartsDownloadsStorage'
import type { PubPartsStagedSourceRecord } from '../catalog/pubPartsDownloadsStorage'
import type { ImportedReferenceFile } from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { CatalogSurface } from './CatalogSurface'
import type { AppState } from '../store/useAppStore'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'

type CatalogSurfaceTestState = {
  referenceWorkspace: {
    importedReferencesById: Record<
      string,
        {
          referenceId: string
          sourceKind: 'manifest' | 'imported'
          categoryId: string
          label: string
          assetPath: string
          catalogItemId?: string | null
          catalogFamilyKey?: string | null
          fileType?: ReferenceFileType
        }
    >
    importedReferenceOrder: string[]
  }
  addImportedReference: (reference: {
    catalogItemId?: string | null
    catalogFamilyKey?: string | null
    fileName: string
    fileType: ReferenceFileType
    objectUrl: string
    parentAssemblyId?: string | null
    parentComponentId?: string | null
  }) => string
  openStagedImportDraft: (draft: {
    parentAssemblyId?: string | null
    parentComponentId?: string | null
  }) => void
  appendStagedImportDraftFiles: (files: ImportedReferenceFile[]) => void
}
let currentAppState: CatalogSurfaceTestState
let addImportedReferenceSpy: ReturnType<typeof vi.fn>
let openStagedImportDraftSpy: ReturnType<typeof vi.fn>
let appendStagedImportDraftFilesSpy: ReturnType<typeof vi.fn>
let importSupportedReferenceFilesFromDiskMock: ReturnType<typeof vi.fn>
let openDropboxChooserBridgeMock: ReturnType<typeof vi.fn>
let fetchDropboxChooserSelectedReferenceFileMock: ReturnType<typeof vi.fn>
let preloadDropboxChooserBridgeMock: ReturnType<typeof vi.fn>
let isDropboxChooserAppKeyConfiguredMock: ReturnType<typeof vi.fn>
let createObjectURLMock: ReturnType<typeof vi.fn>

type FixtureZipEntry = {
  path: string
  content?: string
  directory?: boolean
}

const createFixtureZipBlob = async (entries: FixtureZipEntry[]): Promise<Blob> => {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'))
  try {
    for (const entry of entries) {
      await zipWriter.add(
        entry.path,
        entry.directory === true ? undefined : new TextReader(entry.content ?? 'fixture'),
        {
          directory: entry.directory,
          lastModDate: new Date('2026-04-21T00:00:00.000Z'),
        },
      )
    }
    return await zipWriter.close()
  } catch (error) {
    await zipWriter.close().catch(() => undefined)
    throw error
  }
}

vi.mock('../store/useAppStore', () => {
  const store = ((selector: (state: typeof currentAppState) => unknown) =>
    selector(currentAppState)) as unknown as typeof import('../store/useAppStore').useAppStore
  ;(store as typeof store & { getState: () => AppState }).getState = () =>
    currentAppState as unknown as AppState
  return {
    useAppStore: store,
  }
})

vi.mock('../references/importReferenceFile', () => ({
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES: ['step', 'stl', 'obj', 'glb'],
  importSupportedReferenceFilesFromDisk: (...args: unknown[]) =>
    importSupportedReferenceFilesFromDiskMock(...args),
}))

vi.mock('../catalog/dropboxChooserBridge', () => ({
  isDropboxChooserAppKeyConfigured: () => isDropboxChooserAppKeyConfiguredMock(),
  preloadDropboxChooserBridge: (...args: unknown[]) => preloadDropboxChooserBridgeMock(...args),
  openDropboxChooserBridge: (...args: unknown[]) => openDropboxChooserBridgeMock(...args),
  fetchDropboxChooserSelectedReferenceFile: (...args: unknown[]) =>
    fetchDropboxChooserSelectedReferenceFileMock(...args),
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('CatalogSurface', () => {
  const CARD_CLICK_SETTLE_MS = 220
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  const clickCardAndWait = async (element: HTMLElement | undefined) => {
    await act(async () => {
      element?.click()
      await new Promise((resolve) => window.setTimeout(resolve, CARD_CLICK_SETTLE_MS))
    })
  }

  beforeEach(() => {
    window.localStorage.clear()
    resetCatalogPreviewSessionsForTests()
    useUiPrefsStore.setState({
      view: structuredClone(DEFAULT_VIEW_SETTINGS),
    })
    addImportedReferenceSpy = vi.fn(({ catalogItemId, catalogFamilyKey, fileName, fileType, objectUrl }) => {
      const nextReferenceId = `catalog-commit-${currentAppState.referenceWorkspace.importedReferenceOrder.length}`
      currentAppState = {
        ...currentAppState,
        referenceWorkspace: {
          importedReferencesById: {
            ...currentAppState.referenceWorkspace.importedReferencesById,
            [nextReferenceId]: {
              referenceId: nextReferenceId,
              sourceKind: 'imported',
              categoryId: 'user-references',
              label: fileName,
              assetPath: objectUrl,
              catalogItemId: catalogItemId ?? null,
              catalogFamilyKey: catalogFamilyKey ?? null,
              fileType,
            },
          },
          importedReferenceOrder: [
            ...currentAppState.referenceWorkspace.importedReferenceOrder,
            nextReferenceId,
          ],
        },
      }
      return nextReferenceId
    })
    openStagedImportDraftSpy = vi.fn()
    appendStagedImportDraftFilesSpy = vi.fn()
    importSupportedReferenceFilesFromDiskMock = vi.fn()
    createObjectURLMock = vi.fn(() => 'blob:catalog-surface-pubparts-source')
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURLMock,
    })
    isDropboxChooserAppKeyConfiguredMock = vi.fn(() => true)
    preloadDropboxChooserBridgeMock = vi.fn().mockResolvedValue({ status: 'ready' })
    openDropboxChooserBridgeMock = vi.fn().mockResolvedValue({
      status: 'unavailable',
      reason: 'Dropbox Chooser app key is not configured.',
    })
    fetchDropboxChooserSelectedReferenceFileMock = vi.fn()
    currentAppState = {
      referenceWorkspace: {
        importedReferencesById: {
          'imported-reference-1': {
            referenceId: 'imported-reference-1',
            sourceKind: 'imported',
            categoryId: 'user-references',
            label: 'Imported Reference 1',
            assetPath: 'blob:imported-reference-1',
          },
        },
        importedReferenceOrder: ['imported-reference-1'],
      },
      addImportedReference: addImportedReferenceSpy,
      openStagedImportDraft: openStagedImportDraftSpy,
      appendStagedImportDraftFiles: appendStagedImportDraftFilesSpy,
    }
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    resetCatalogPreviewSessionsForTests()
    useUiPrefsStore.setState({
      view: structuredClone(DEFAULT_VIEW_SETTINGS),
    })
    vi.unstubAllGlobals()
  })

  it('renders the two-column browse-plus-content shell over the shared catalog source seam', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <CatalogSurface
          slotId="workspace-slot-secondary"
          surfaceInstanceId="catalog-workspace-slot-secondary"
        />,
      )
    })

    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Sections',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Part Catalog Cards',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).not.toContain(
      'Imports Area',
    )
    expect(container?.textContent).toContain('Shoe 1')
    expect(container?.textContent).toContain('Large Foothook')
    expect(container?.textContent).toContain('Imported Reference 1')
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Imports',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Shoes',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'FootHolds',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Footpads',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Hdris',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Starting Assemblies',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'ADV Full Assembly',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Part read keeps the curated reference families visible',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Part read keeps the curated reference families visible',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Part Catalog Cards',
    )
    const stagedSourcesRegion = container?.querySelector(
      '[data-catalog-region="pubparts-staged-sources"]',
    ) as HTMLDivElement | null
    expect(stagedSourcesRegion).not.toBeNull()
    expect(stagedSourcesRegion?.textContent).toContain('No staged PubParts source links yet.')
  })

  it('surfaces the verified starting assemblies as planned sources with add-to-project enabled', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-planned-starting-assembly" />)
    })

    const plannedCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('ADV Full Assembly'),
    ) as HTMLElement | undefined
    const plannedXrCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('XR PubWheel Assembly 1'),
    ) as HTMLElement | undefined
    expect(plannedCard).toBeDefined()
    expect(plannedXrCard).toBeDefined()
    expect(plannedCard?.querySelector('.CatalogShellCardSection')?.textContent).toContain(
      'Planned Starting Assembly',
    )
    expect(plannedXrCard?.querySelector('.CatalogShellCardSection')?.textContent).toContain(
      'Planned Starting Assembly',
    )
    expect(plannedCard?.querySelector('.CatalogShellCardMeta')?.textContent).toContain(
      'Add To Project imports source; preview and starting-configuration load unavailable',
    )
    const plannedCardAddButton = plannedCard?.querySelector(
      '[data-catalog-card-action-kind="add-to-project"]',
    ) as HTMLButtonElement | null
    const plannedXrCardAddButton = plannedXrCard?.querySelector(
      '[data-catalog-card-action-kind="add-to-project"]',
    ) as HTMLButtonElement | null
    expect(plannedCardAddButton).not.toBeNull()
    expect(plannedCardAddButton?.disabled).toBe(false)
    expect(plannedXrCardAddButton).not.toBeNull()
    expect(plannedXrCardAddButton?.disabled).toBe(false)

    const plannedPreviewBox = plannedCard?.querySelector(
      '[data-catalog-preview-box="starting-assembly:adv-full-assembly-planned"]',
    ) as HTMLButtonElement | null
    const plannedXrPreviewBox = plannedXrCard?.querySelector(
      '[data-catalog-preview-box="starting-assembly:xr-pubwheel-1-planned"]',
    ) as HTMLButtonElement | null
    expect(plannedPreviewBox).not.toBeNull()
    expect(plannedPreviewBox?.disabled).toBe(true)
    expect(plannedPreviewBox?.textContent).toContain('Preview planned after heavy STEP guardrails.')
    expect(plannedXrPreviewBox).not.toBeNull()
    expect(plannedXrPreviewBox?.disabled).toBe(true)

    await act(async () => {
      plannedPreviewBox?.click()
    })

    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('No preview-loaded items yet')

    await act(async () => {
      plannedCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    expect(itemPageRegion).not.toBeNull()
    expect(itemPageRegion?.textContent).toContain('Starting Assembly')
    expect(itemPageRegion?.textContent).toContain('Planned source')
    expect(itemPageRegion?.textContent).toContain('Planned Starting Assembly')
    expect(itemPageRegion?.textContent).toContain(
      'Catalog/boards/adv/ADV_Full Assembly_parts.step',
    )
    expect(itemPageRegion?.textContent).toContain(
      'Known heavy source - Add To Project imports source; preview and starting-configuration load are planned',
    )
    expect(itemPageRegion?.textContent).toContain(
      'heavy preview and load-as-starting-configuration unavailable',
    )
    const itemPreviewSurface = itemPageRegion?.querySelector(
      '[data-catalog-item-preview-surface="starting-assembly:adv-full-assembly-planned"]',
    ) as HTMLDivElement | null
    expect(itemPreviewSurface).not.toBeNull()
    expect(itemPreviewSurface?.classList.contains('CatalogShellItemPreviewSurface')).toBe(true)
    expect(itemPageRegion?.textContent).not.toContain('Repo Asset Path')
    const itemPageAddToProjectButton = itemPageRegion?.querySelector(
      '[data-catalog-action-kind="add-to-project"]',
    ) as HTMLButtonElement | null
    expect(itemPageAddToProjectButton).not.toBeNull()
    expect(itemPageAddToProjectButton?.disabled).toBe(false)
    const plannedActionButton = itemPageRegion?.querySelector(
      '[data-catalog-action-kind="load-preview"]',
    ) as HTMLButtonElement | null
    expect(plannedActionButton).not.toBeNull()
    expect(plannedActionButton?.textContent).toBe('Preview Planned')
    expect(plannedActionButton?.disabled).toBe(true)

    await act(async () => {
      itemPageAddToProjectButton?.click()
    })

    expect(addImportedReferenceSpy).toHaveBeenCalledWith({
      catalogFamilyKey: 'starting-assemblies',
      catalogItemId: 'starting-assembly:adv-full-assembly-planned',
      fileName: 'ADV Full Assembly',
      fileType: 'step',
      objectUrl: expect.stringMatching(/\/Catalog\/boards\/adv\/ADV_Full Assembly_parts\.step$/),
    })
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-1']).toEqual(
      expect.objectContaining({
        label: 'ADV Full Assembly',
        assetPath: expect.stringMatching(/\/Catalog\/boards\/adv\/ADV_Full Assembly_parts\.step$/),
        catalogItemId: 'starting-assembly:adv-full-assembly-planned',
        catalogFamilyKey: 'starting-assemblies',
        fileType: 'step',
      }),
    )
    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toContain('catalog-commit-1')
  })

  it('adds the XR PubWheel full assembly source to project from the catalog grid', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-xr-pubwheel-add" />)
    })

    const plannedXrCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('XR PubWheel Assembly 1'),
    ) as HTMLElement | undefined
    const plannedXrCardAddButton = plannedXrCard?.querySelector(
      '[data-catalog-card-action-kind="add-to-project"]',
    ) as HTMLButtonElement | null

    expect(plannedXrCard).toBeDefined()
    expect(plannedXrCardAddButton).not.toBeNull()

    await act(async () => {
      plannedXrCardAddButton?.click()
    })

    expect(addImportedReferenceSpy).toHaveBeenCalledWith({
      catalogFamilyKey: 'starting-assemblies',
      catalogItemId: 'starting-assembly:xr-pubwheel-1-planned',
      fileName: 'XR PubWheel Assembly 1',
      fileType: 'step',
      objectUrl: expect.stringMatching(
        /\/Catalog\/assemblies\/xr\/Assembly_XR_Pubwheel_1\.step$/,
      ),
    })
  })

  it('surfaces cached PubParts entries as external-linked source records without add-to-project behavior', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-external-pubparts" />)
    })

    const fullCacheOnlyCard = Array.from(
      container?.querySelectorAll('.CatalogShellCard') ?? [],
    ).find((element) =>
      element.textContent?.includes('Warzon3: Floatwheel Footpad PCB'),
    ) as HTMLElement | undefined
    expect(fullCacheOnlyCard).toBeDefined()
    const rootRelativeImage = fullCacheOnlyCard?.querySelector(
      '[data-catalog-preview-box] img',
    ) as HTMLImageElement | null
    expect(rootRelativeImage).not.toBeNull()
    expect(rootRelativeImage?.getAttribute('alt')).toBe('Warzon3: Floatwheel Footpad PCB preview')
    expect(rootRelativeImage?.getAttribute('src')).toBe(
      'https://pubparts.xyz/images/parts/floatwheel/floatwheel-footpad-pcb.png',
    )

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()
    expect(externalCard?.querySelector('.CatalogShellCardSection')?.textContent).toContain(
      'PubParts External',
    )
    expect(externalCard?.querySelector('.CatalogShellCardMeta')?.textContent).toContain(
      'External-linked PubParts entry',
    )
    expect(
      externalCard?.querySelector('[data-catalog-card-action-kind="add-to-project"]'),
    ).toBeNull()

    const externalPreviewBox = externalCard?.querySelector(
      '[data-catalog-preview-box]',
    ) as HTMLButtonElement | null
    expect(externalPreviewBox).not.toBeNull()
    const externalPreviewItemId = externalPreviewBox?.getAttribute('data-catalog-preview-box')
    expect(externalPreviewItemId).toMatch(/^external:pubparts:3d-printed-gripples-/u)
    expect(externalPreviewBox?.querySelector('img')?.getAttribute('alt')).toBe(
      '3d Printed Gripples preview',
    )
    expect(externalPreviewBox?.querySelector('img')?.getAttribute('src')).toBe(
      'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
    )

    const previewSessionBeforeClick = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionBeforeClick?.textContent).toContain('No preview-loaded items yet')

    await act(async () => {
      externalPreviewBox?.click()
    })

    expect(externalPreviewBox?.querySelector('img')?.getAttribute('alt')).toBe(
      '3d Printed Gripples preview',
    )
    expect(externalPreviewBox?.querySelector('img')?.getAttribute('src')).toBe(
      'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
    )

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    expect(itemPageRegion).not.toBeNull()
    expect(itemPageRegion?.textContent).toContain('External Linked Source')
    expect(itemPageRegion?.textContent).toContain('PubParts External Source')
    expect(itemPageRegion?.textContent).toContain('External-linked PubParts')
    expect(itemPageRegion?.textContent).not.toContain('Imports Reuse')
    expect(itemPageRegion?.textContent).toContain('Source URL')
    expect(itemPageRegion?.textContent).toContain('https://www.printables.com/model/598759')
    expect(itemPageRegion?.textContent).toContain('Linked Archive URL')
    expect(itemPageRegion?.textContent).toContain('2024-11-16')
    expect(itemPageRegion?.querySelector('.CatalogShellItemPreviewSurface img')?.getAttribute('src')).toBe(
      'https://media.printables.com/media/prints/598759/images/4771812_7f901f92-4361-45f4-8527-f2138176b0cc_2b4d4f70-7556-4a39-9213-6cec593be284/thumbs/inside/1280x960/jpg/pxl_20230930_171633812.webp',
    )
    expect(itemPageRegion?.querySelector('[data-catalog-region="source-details"]')).not.toBeNull()
    const sourcePageLink = itemPageRegion?.querySelector(
      '[data-catalog-source-page-link]',
    ) as HTMLAnchorElement | null
    expect(sourcePageLink).not.toBeNull()
    expect(sourcePageLink?.getAttribute('data-catalog-source-page-link')).toBe(
      externalPreviewItemId,
    )
    expect(sourcePageLink?.textContent).toBe('Open Source Page')
    expect(sourcePageLink?.getAttribute('href')).toBe('https://www.printables.com/model/598759')
    expect(sourcePageLink?.getAttribute('target')).toBe('_blank')
    expect(sourcePageLink?.getAttribute('rel')).toBe('noreferrer')
    expect(sourcePageLink?.getAttribute('href')).not.toContain('dropbox.com')
    const linkedArchiveLink = itemPageRegion?.querySelector(
      '[data-catalog-linked-archive-link]',
    ) as HTMLAnchorElement | null
    expect(linkedArchiveLink).not.toBeNull()
    expect(linkedArchiveLink?.getAttribute('data-catalog-linked-archive-link')).toBe(
      externalPreviewItemId,
    )
    expect(linkedArchiveLink?.textContent).toBe('Inspect Linked Archive Source')
    expect(linkedArchiveLink?.getAttribute('href')).toBe(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
    )
    expect(linkedArchiveLink?.getAttribute('href')).not.toBe(sourcePageLink?.getAttribute('href'))
    expect(linkedArchiveLink?.getAttribute('href')).not.toBe(
      externalPreviewBox?.querySelector('img')?.getAttribute('src'),
    )
    expect(linkedArchiveLink?.getAttribute('target')).toBe('_blank')
    expect(linkedArchiveLink?.getAttribute('rel')).toBe('noreferrer')
    const sourceDownloadLink = itemPageRegion?.querySelector(
      '[data-catalog-source-download-link]',
    ) as HTMLAnchorElement | null
    expect(sourceDownloadLink).not.toBeNull()
    expect(sourceDownloadLink?.getAttribute('data-catalog-source-download-link')).toBe(
      externalPreviewItemId,
    )
    expect(sourceDownloadLink?.textContent).toBe('Open Source Download')
    expect(sourceDownloadLink?.getAttribute('href')).toBe(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=1',
    )
    expect(itemPageRegion?.textContent).toContain(
      'ParaHook has not downloaded, inspected, extracted, imported, or committed source bytes.',
    )
    expect(itemPageRegion?.textContent).toContain('Linked Archive Metadata Available')
    expect(itemPageRegion?.textContent).toContain(
      'ParaHook has not downloaded, extracted, imported, or classified this archive.',
    )
    const archiveClassification = itemPageRegion?.querySelector(
      '[data-catalog-linked-archive-classification]',
    ) as HTMLDivElement | null
    expect(archiveClassification).not.toBeNull()
    expect(archiveClassification?.getAttribute('data-catalog-linked-archive-classification')).toBe(
      externalPreviewItemId,
    )
    expect(archiveClassification?.textContent).toContain(
      'Archive Container - Inspection Needed',
    )
    expect(archiveClassification?.textContent).toContain(
      'supported files inside remain unknown',
    )
    const sourceActionBoundary = itemPageRegion?.querySelector(
      '[data-catalog-external-source-action-boundary]',
    ) as HTMLButtonElement | null
    expect(sourceActionBoundary).not.toBeNull()
    expect(sourceActionBoundary?.getAttribute('data-catalog-external-source-action-boundary')).toBe(
      externalPreviewItemId,
    )
    expect(sourceActionBoundary?.getAttribute('data-catalog-stage-source-link')).toBe(
      externalPreviewItemId,
    )
    expect(sourceActionBoundary?.disabled).toBe(false)
    expect(sourceActionBoundary?.textContent).toBe('Stage Source Link')
    expect(itemPageRegion?.textContent).toContain(
      'Stage this PubParts source link as metadata for later inspection. ParaHook will not download, inspect, extract, import, or commit files in this step.',
    )
    expect(window.localStorage.getItem(pubPartsDownloadsStorageKey)).toBeNull()

    await act(async () => {
      sourceActionBoundary?.click()
    })

    const stagedState = readPubPartsDownloadsStorage(window.localStorage)
    expect(stagedState.stagedSourceOrder).toEqual([`pubparts:${externalPreviewItemId}`])
    const stagedRecord = stagedState.stagedSourcesById[`pubparts:${externalPreviewItemId}`]
    expect(stagedRecord).toEqual(
      expect.objectContaining({
        catalogItemId: externalPreviewItemId,
        catalogItemLabel: '3d Printed Gripples',
        providerId: 'pubparts',
        providerName: 'PubParts',
        sourceCandidateUrl:
          'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
        linkedArchiveUrl:
          'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'not-inspected',
        importStatus: 'not-imported',
      }),
    )
    expect(JSON.stringify(stagedRecord)).not.toContain('assetPath')
    expect(JSON.stringify(stagedRecord)).not.toContain('objectUrl')
    const stagedSourcesRegion = container?.querySelector(
      '[data-catalog-region="pubparts-staged-sources"]',
    ) as HTMLDivElement | null
    expect(stagedSourcesRegion).not.toBeNull()
    expect(stagedSourcesRegion?.textContent).toContain('1 staged PubParts source link')
    expect(stagedSourcesRegion?.textContent).toContain('metadata records only')
    expect(stagedSourcesRegion?.textContent).toContain('source bytes are not downloaded')
    expect(stagedSourcesRegion?.textContent).toContain('project assets are not imported')
    const stagedSourceRow = stagedSourcesRegion?.querySelector(
      `[data-catalog-pubparts-staged-source="pubparts:${externalPreviewItemId}"]`,
    ) as HTMLDivElement | null
    expect(stagedSourceRow).not.toBeNull()
    expect(stagedSourceRow?.querySelector('.CatalogShellPreviewSessionRowBody')).not.toBeNull()
    expect(stagedSourceRow?.querySelector('.CatalogShellPreviewSessionRowLabel')?.textContent).toBe(
      '3d Printed Gripples',
    )
    expect(stagedSourceRow?.textContent).toContain('3d Printed Gripples')
    expect(stagedSourceRow?.textContent).toContain(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
    )
    expect(
      stagedSourceRow
        ?.querySelector(`[data-catalog-pubparts-staged-source-status="pubparts:${externalPreviewItemId}"]`)
        ?.textContent,
    ).toBe('Source Link Staged - Not downloaded - Not inspected - Not imported')
    expect(
      stagedSourceRow?.querySelector('.CatalogShellPreviewSessionRowUrl')?.textContent,
    ).toContain('https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong')

    const stagedStatus = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-source-stage-status]',
    ) as HTMLSpanElement | null
    const stagedSourceActionBoundary = itemPageRegion?.querySelector(
      '[data-catalog-external-source-action-boundary]',
    ) as HTMLButtonElement | null
    expect(stagedStatus).not.toBeNull()
    expect(stagedStatus?.getAttribute('data-catalog-pubparts-source-stage-status')).toBe(
      externalPreviewItemId,
    )
    expect(stagedSourceActionBoundary?.textContent).toBe('Source Link Staged')
    expect(stagedSourceActionBoundary?.disabled).toBe(true)
    expect(stagedSourceActionBoundary?.hasAttribute('data-catalog-stage-source-link')).toBe(false)
    expect(stagedStatus?.textContent).toContain('metadata only')
    expect(stagedStatus?.textContent).toContain('not downloaded')
    expect(stagedStatus?.textContent).toContain('not inspected')
    expect(stagedStatus?.textContent).toContain('no project asset has been imported')
    const importDownloadedFilesButton = itemPageRegion?.querySelector(
      '[data-catalog-import-downloaded-pubparts-files-action]',
    ) as HTMLButtonElement | null
    expect(importDownloadedFilesButton).not.toBeNull()
    expect(importDownloadedFilesButton?.getAttribute('data-catalog-import-downloaded-pubparts-files-action')).toBe(
      externalPreviewItemId,
    )
    expect(importDownloadedFilesButton?.textContent).toBe('Import Downloaded Files')
    expect(itemPageRegion?.textContent).toContain(
      'Choose local files you downloaded or extracted from the PubParts source.',
    )
    importSupportedReferenceFilesFromDiskMock.mockResolvedValue([
      {
        fileName: 'gripples-source.glb',
        fileType: 'glb',
        objectUrl: 'blob:gripples-source-glb',
      },
    ])

    await act(async () => {
      importDownloadedFilesButton?.click()
      await Promise.resolve()
    })

    expect(importSupportedReferenceFilesFromDiskMock).toHaveBeenCalledTimes(1)
    expect(openStagedImportDraftSpy).toHaveBeenCalledWith({})
    expect(appendStagedImportDraftFilesSpy).toHaveBeenCalledWith([
      expect.objectContaining({
        fileName: 'gripples-source.glb',
        fileType: 'glb',
        objectUrl: 'blob:gripples-source-glb',
        sourceAttribution: expect.objectContaining({
          sourceKind: 'external-catalog',
          providerId: 'pubparts',
          providerName: 'PubParts',
          catalogItemId: externalPreviewItemId,
          catalogItemLabel: '3d Printed Gripples',
          sourceCandidateUrl:
            'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
          linkedArchiveUrl:
            'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
          sourcePageUrl: 'https://www.printables.com/model/598759',
        }),
      }),
    ])
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()
    const inspectStagedSourceButton = itemPageRegion?.querySelector(
      '[data-catalog-inspect-staged-source]',
    ) as HTMLButtonElement | null
    expect(inspectStagedSourceButton).not.toBeNull()
    expect(inspectStagedSourceButton?.getAttribute('data-catalog-inspect-staged-source')).toBe(
      externalPreviewItemId,
    )
    expect(inspectStagedSourceButton?.textContent).toBe('Inspect Staged Source Metadata')

    await act(async () => {
      inspectStagedSourceButton?.click()
    })

    const inspectedState = readPubPartsDownloadsStorage(window.localStorage)
    const inspectedRecord =
      inspectedState.stagedSourcesById[`pubparts:${externalPreviewItemId}`]
    expect(inspectedRecord).toEqual(
      expect.objectContaining({
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'metadata-inspected',
        importStatus: 'not-imported',
      }),
    )
    expect(inspectedRecord?.inspectionResult).toEqual(
      expect.objectContaining({
        kind: 'archive-source-needs-inspection',
        label: 'Archive Source Needs Inspection',
        fileExtension: 'zip',
        requiresArchiveInspection: true,
      }),
    )
    const inspectionStatus = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-source-inspection-status]',
    ) as HTMLSpanElement | null
    expect(inspectionStatus).not.toBeNull()
    expect(inspectionStatus?.getAttribute('data-catalog-pubparts-source-inspection-status')).toBe(
      externalPreviewItemId,
    )
    expect(inspectionStatus?.textContent).toContain('Metadata Inspection Complete')
    expect(inspectionStatus?.textContent).toContain('Archive Source Needs Inspection')
    expect(inspectionStatus?.textContent).toContain('supported files inside remain unknown')
    const archiveChooserEmpty = itemPageRegion?.querySelector(
      '[data-catalog-supported-file-chooser-empty]',
    ) as HTMLDivElement | null
    expect(archiveChooserEmpty).not.toBeNull()
    expect(archiveChooserEmpty?.getAttribute('data-catalog-supported-file-chooser-empty')).toBe(
      externalPreviewItemId,
    )
    expect(archiveChooserEmpty?.textContent).toContain('No Selectable Supported File')
    expect(archiveChooserEmpty?.textContent).toContain('Archive or shared-source contents are unknown')
    expect(itemPageRegion?.querySelector('[data-catalog-supported-file-choice]')).toBeNull()
    expect(itemPageRegion?.querySelector('[data-catalog-inspect-staged-source]')).toBeNull()
    expect(
      stagedSourceRow
        ?.querySelector(
          `[data-catalog-pubparts-staged-source-status="pubparts:${externalPreviewItemId}"]`,
        )
        ?.textContent,
    ).toBe(
      'Source Link Staged - Not downloaded - Archive Source Needs Inspection - Not imported',
    )

    const clearStagedSourceButton = stagedSourcesRegion?.querySelector(
      `[data-catalog-clear-pubparts-staged-source="pubparts:${externalPreviewItemId}"]`,
    ) as HTMLButtonElement | null
    expect(clearStagedSourceButton).not.toBeNull()

    await act(async () => {
      clearStagedSourceButton?.click()
    })

    expect(readPubPartsDownloadsStorage(window.localStorage).stagedSourceOrder).toEqual([])
    expect(stagedSourcesRegion?.textContent).toContain('No staged PubParts source links yet.')
    const restagedSourceActionBoundary = itemPageRegion?.querySelector(
      '[data-catalog-external-source-action-boundary]',
    ) as HTMLButtonElement | null
    expect(restagedSourceActionBoundary?.textContent).toBe('Stage Source Link')
    expect(restagedSourceActionBoundary?.disabled).toBe(false)
    expect(
      itemPageRegion?.querySelector('[data-catalog-pubparts-source-stage-status]'),
    ).toBeNull()

    await act(async () => {
      restagedSourceActionBoundary?.click()
    })

    expect(readPubPartsDownloadsStorage(window.localStorage).stagedSourceOrder).toEqual([
      `pubparts:${externalPreviewItemId}`,
    ])
    const clearAllStagedSourcesButton = stagedSourcesRegion?.querySelector(
      '[data-catalog-clear-all-pubparts-staged-sources]',
    ) as HTMLButtonElement | null
    expect(clearAllStagedSourcesButton).not.toBeNull()

    await act(async () => {
      clearAllStagedSourcesButton?.click()
    })

    expect(readPubPartsDownloadsStorage(window.localStorage).stagedSourceOrder).toEqual([])
    expect(stagedSourcesRegion?.textContent).toContain('No staged PubParts source links yet.')
    expect(itemPageRegion?.textContent).not.toContain('Import Archive')
    expect(itemPageRegion?.querySelector('[data-catalog-action-kind="add-to-project"]')).toBeNull()
    expect(itemPageRegion?.querySelector('[data-catalog-action-kind="apply-environment"]')).toBeNull()
    expect(itemPageRegion?.querySelector('[data-catalog-action-kind="load-preview"]')).not.toBeNull()
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()
  })

  it('selects an inspected direct supported PubParts source candidate as staged metadata only', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-supported-file-id-read" />)
    })

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    const externalPreviewBox = externalCard?.querySelector(
      '[data-catalog-preview-box]',
    ) as HTMLButtonElement | null
    const externalPreviewItemId = externalPreviewBox?.getAttribute('data-catalog-preview-box')

    expect(externalPreviewItemId).toMatch(/^external:pubparts:3d-printed-gripples-/u)

    await act(async () => {
      root?.unmount()
    })
    root = createRoot(container)

    const stagedSourceId = `pubparts:${externalPreviewItemId}`
    window.localStorage.setItem(
      pubPartsDownloadsStorageKey,
      JSON.stringify({
        schemaVersion: 1,
        stagedSourcesById: {
          [stagedSourceId]: {
            stagedSourceId,
            catalogItemId: externalPreviewItemId,
            catalogItemLabel: '3d Printed Gripples',
            providerId: 'pubparts',
            providerName: 'PubParts',
            sourceCandidateUrl: 'https://example.com/models/gripples-source.stp?download=1',
            linkedArchiveUrl: 'https://example.com/models/gripples-source.stp?download=1',
            sourcePageUrl: 'https://www.printables.com/model/598759',
            sourceMetadata: [],
            status: 'source-link-staged',
            binaryStatus: 'not-downloaded',
            inspectionStatus: 'metadata-inspected',
            inspectionResult: {
              kind: 'supported-direct-file-candidate',
              label: 'Supported Direct File Candidate',
              description:
                'This staged source link looks like a supported direct model file candidate from URL metadata only. ParaHook has not downloaded, imported, or added it to the project.',
              sourceCandidateUrl: 'https://example.com/models/gripples-source.stp?download=1',
              fileExtension: 'stp',
              supportedFileType: 'stp',
              requiresArchiveInspection: false,
              inspectedAt: '2026-04-20T18:25:00.000Z',
            },
            importStatus: 'not-imported',
            stagedAt: '2026-04-20T18:10:00.000Z',
            updatedAt: '2026-04-20T18:25:00.000Z',
          },
        },
        stagedSourceOrder: [stagedSourceId],
      }),
    )

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-supported-file-choice" />)
    })

    const stagedExternalCard = Array.from(
      container?.querySelectorAll('.CatalogShellCard') ?? [],
    ).find((element) => element.textContent?.includes('3d Printed Gripples')) as
      | HTMLElement
      | undefined

    await act(async () => {
      stagedExternalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const chooserRegion = itemPageRegion?.querySelector(
      '[data-catalog-supported-file-chooser]',
    ) as HTMLDivElement | null
    const supportedFileChoice = itemPageRegion?.querySelector(
      '[data-catalog-supported-file-choice]',
    ) as HTMLButtonElement | null

    expect(chooserRegion).not.toBeNull()
    expect(chooserRegion?.getAttribute('data-catalog-supported-file-chooser')).toBe(
      externalPreviewItemId,
    )
    expect(supportedFileChoice).not.toBeNull()
    expect(supportedFileChoice?.getAttribute('data-catalog-supported-file-choice')).toBe(
      externalPreviewItemId,
    )
    expect(supportedFileChoice?.textContent).toBe('Choose Supported Source File')
    expect(itemPageRegion?.textContent).toContain(
      'This direct source URL can be selected as metadata for a later import handoff.',
    )

    await act(async () => {
      supportedFileChoice?.click()
    })

    const selectedState = readPubPartsDownloadsStorage(window.localStorage)
    const selectedRecord = selectedState.stagedSourcesById[stagedSourceId]
    expect(selectedRecord).toEqual(
      expect.objectContaining({
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'metadata-inspected',
        importStatus: 'not-imported',
      }),
    )
    expect(selectedRecord?.selectedSupportedFile).toEqual(
      expect.objectContaining({
        sourceCandidateUrl: 'https://example.com/models/gripples-source.stp?download=1',
        fileName: 'gripples-source.stp',
        fileExtension: 'stp',
        label: 'gripples-source.stp (STP)',
      }),
    )
    expect(JSON.stringify(selectedRecord)).not.toContain('assetPath')
    expect(JSON.stringify(selectedRecord)).not.toContain('objectUrl')
    expect(JSON.stringify(selectedRecord)).not.toContain('importedReference')

    const selectedStatus = itemPageRegion?.querySelector(
      '[data-catalog-supported-file-selection-status]',
    ) as HTMLSpanElement | null
    expect(selectedStatus).not.toBeNull()
    expect(selectedStatus?.getAttribute('data-catalog-supported-file-selection-status')).toBe(
      externalPreviewItemId,
    )
    expect(selectedStatus?.textContent).toContain(
      'Supported source file selected for later import handoff',
    )
    expect(selectedStatus?.textContent).toContain('gripples-source.stp (STP)')
    const selectedImportHandoff = itemPageRegion?.querySelector(
      '[data-catalog-selected-file-import-handoff]',
    ) as HTMLDivElement | null
    const selectedImportHandoffStatus = itemPageRegion?.querySelector(
      '[data-catalog-selected-file-import-handoff-status]',
    ) as HTMLSpanElement | null
    expect(selectedImportHandoff).not.toBeNull()
    expect(selectedImportHandoff?.getAttribute('data-catalog-selected-file-import-handoff')).toBe(
      externalPreviewItemId,
    )
    expect(selectedImportHandoffStatus).not.toBeNull()
    expect(
      selectedImportHandoffStatus?.getAttribute('data-catalog-selected-file-import-handoff-status'),
    ).toBe(externalPreviewItemId)
    expect(selectedImportHandoffStatus?.textContent).toContain('Import Type Support Needed')
    expect(selectedImportHandoffStatus?.textContent).toContain(
      'current Import reference path does not accept .stp yet',
    )
    expect(selectedImportHandoffStatus?.textContent).toContain('not downloaded')
    expect(selectedImportHandoffStatus?.textContent).toContain('not imported')
    expect(itemPageRegion?.querySelector('[data-catalog-supported-file-choice]')).toBeNull()
    expect(itemPageRegion?.querySelector('[data-catalog-action-kind="add-to-project"]')).toBeNull()
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()

    const stagedSourcesRegion = container?.querySelector(
      '[data-catalog-region="pubparts-staged-sources"]',
    ) as HTMLDivElement | null
    const clearStagedSourceButton = stagedSourcesRegion?.querySelector(
      `[data-catalog-clear-pubparts-staged-source="${stagedSourceId}"]`,
    ) as HTMLButtonElement | null

    await act(async () => {
      clearStagedSourceButton?.click()
    })

    expect(readPubPartsDownloadsStorage(window.localStorage).stagedSourceOrder).toEqual([])
    expect(itemPageRegion?.querySelector('[data-catalog-supported-file-chooser]')).toBeNull()
    expect(itemPageRegion?.querySelector('[data-catalog-supported-file-choice]')).toBeNull()
    expect(itemPageRegion?.querySelector('[data-catalog-selected-file-import-handoff]')).toBeNull()
  })

  it('advances PubParts item pages through the local-library action loop', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-pubparts-local-library" />)
    })

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const externalPreviewItemId = itemPageRegion
      ?.querySelector('[data-catalog-source-page-link]')
      ?.getAttribute('data-catalog-source-page-link')
    expect(externalPreviewItemId).toMatch(/^external:pubparts:3d-printed-gripples-/u)

    const firstLocalAction = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-local-library-primary-action]',
    ) as HTMLButtonElement | null
    expect(firstLocalAction).not.toBeNull()
    expect(firstLocalAction?.textContent).toBe('Add To Project')
    const prepareFallback = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-prepare-local-fallback]',
    ) as HTMLButtonElement | null
    expect(prepareFallback).not.toBeNull()
    expect(prepareFallback?.textContent).toBe('Prepare PubParts Folder')
    expect(itemPageRegion?.textContent).toContain('Not Prepared')
    expect(
      container?.querySelector('[data-catalog-region="pubparts-local-downloads"]')?.textContent,
    ).toContain('No PubParts local-library records yet.')

    await act(async () => {
      prepareFallback?.click()
    })

    const localDownloadsRegion = container?.querySelector(
      '[data-catalog-region="pubparts-local-downloads"]',
    ) as HTMLDivElement | null
    expect(localDownloadsRegion?.textContent).toContain('1 PubParts item')
    expect(localDownloadsRegion?.textContent).toContain('3d Printed Gripples')
    expect(localDownloadsRegion?.textContent).toContain('Prepared Folder')
    expect(localDownloadsRegion?.textContent).toContain('PubParts/parts')

    const preparedFolderRow = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-local-folder]',
    ) as HTMLDivElement | null
    expect(preparedFolderRow).not.toBeNull()
    expect(preparedFolderRow?.textContent).toContain('pubparts-source.json')

    const secondLocalAction = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-stage-local-fallback]',
    ) as HTMLButtonElement | null
    expect(secondLocalAction?.textContent).toBe('Stage Source Link')

    await act(async () => {
      secondLocalAction?.click()
    })

    const stagedState = readPubPartsDownloadsStorage(window.localStorage)
    expect(stagedState.localSourceOrder).toEqual([externalPreviewItemId])
    expect(stagedState.stagedSourceOrder).toEqual([`pubparts:${externalPreviewItemId}`])
    expect(stagedState.localSourcesByCatalogItemId[externalPreviewItemId ?? '']?.manifest).toEqual(
      expect.objectContaining({
        providerId: 'pubparts',
        catalogItemLabel: '3d Printed Gripples',
      }),
    )

    const thirdLocalAction = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-import-local-fallback]',
    ) as HTMLButtonElement | null
    expect(thirdLocalAction?.textContent).toBe('Import Local Files')
    expect(itemPageRegion?.textContent).toContain('known PubParts item folder')
  })

  it('opens real ZIP-inspected PubParts archive source options and stages selected entries', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 's'.repeat(42684) },
      { path: 'gripple_standard.3mf', content: 'm'.repeat(28573) },
      {
        path: '598759-standard-gripples-for-onewheel-b51d2e2c-59bb-4ccf-bef0-14adeac089fb.pdf',
        content: 'p'.repeat(138830),
      },
    ])
    let resolveFetch: (response: Response) => void = () => undefined
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve
    })
    const fetchMock = vi.fn(() => fetchPromise)
    vi.stubGlobal('fetch', fetchMock)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-source-options" />)
    })

    expect(fetchMock).not.toHaveBeenCalled()

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const externalPreviewItemId = itemPageRegion
      ?.querySelector('[data-catalog-source-page-link]')
      ?.getAttribute('data-catalog-source-page-link')
    expect(externalPreviewItemId).toMatch(/^external:pubparts:3d-printed-gripples-/u)
    const addToProjectButton = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-add-to-project-action]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()
    expect(addToProjectButton?.textContent).toBe('Add To Project')
    expect(itemPageRegion?.textContent).toContain('Open Source Options')
    expect(fetchMock).not.toHaveBeenCalled()

    await act(async () => {
      addToProjectButton?.click()
      await Promise.resolve()
    })

    expect(readPubPartsDownloadsStorage(window.localStorage).stagedSourceOrder).toEqual([
      `pubparts:${externalPreviewItemId}`,
    ])
    const sourceOptionsDialog = container?.querySelector(
      '[data-catalog-pubparts-source-options-dialog]',
    ) as HTMLElement | null
    expect(sourceOptionsDialog).not.toBeNull()
    expect(sourceOptionsDialog?.getAttribute('data-catalog-pubparts-source-options-dialog')).toBe(
      externalPreviewItemId,
    )
    expect(sourceOptionsDialog?.textContent).toContain('PubParts Source Options')
    expect(sourceOptionsDialog?.textContent).toContain('model_files.zip')
    expect(sourceOptionsDialog?.textContent).toContain(
      'Inspecting ZIP archive from the PubParts source',
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=1',
    )
    let candidateCheckboxes = Array.from(
      sourceOptionsDialog?.querySelectorAll('input[type="checkbox"]') ?? [],
    ) as HTMLInputElement[]
    expect(candidateCheckboxes).toHaveLength(1)
    expect(candidateCheckboxes[0]?.checked).toBe(false)
    expect(candidateCheckboxes[0]?.disabled).toBe(true)
    let stageSelectedButton = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-stage-selected-source-options]',
    ) as HTMLButtonElement | null
    expect(stageSelectedButton?.textContent).toBe('Inspecting...')
    expect(stageSelectedButton?.disabled).toBe(true)

    await act(async () => {
      resolveFetch(
        {
          ok: true,
          status: 200,
          blob: async () => archiveBlob,
        } as Response,
      )
      await fetchPromise
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(sourceOptionsDialog?.textContent).toContain('gripple_standard.stl')
    expect(sourceOptionsDialog?.textContent).toContain('gripple_standard.3mf')
    expect(sourceOptionsDialog?.textContent).toContain(
      '598759-standard-gripples-for-onewheel-b51d2e2c-59bb-4ccf-bef0-14adeac089fb.pdf',
    )
    const stagedZipEntryList = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-staged-zip-entry-list]',
    ) as HTMLElement | null
    expect(stagedZipEntryList).not.toBeNull()
    expect(stagedZipEntryList?.getAttribute('aria-label')).toBe(
      'PubParts staged ZIP entry list',
    )
    const stagedZipEntryRows = Array.from(
      sourceOptionsDialog?.querySelectorAll('[data-catalog-pubparts-staged-zip-entry-row]') ??
        [],
    ) as HTMLElement[]
    expect(stagedZipEntryRows).toHaveLength(3)
    const stagedZipEntryPreviewStates = Array.from(
      sourceOptionsDialog?.querySelectorAll(
        '[data-catalog-pubparts-staged-zip-entry-preview-state]',
      ) ?? [],
    ) as HTMLElement[]
    expect(stagedZipEntryPreviewStates).toHaveLength(3)
    expect(stagedZipEntryRows[0]?.textContent).toContain('Archive path: gripple_standard.stl')
    expect(stagedZipEntryRows[0]?.textContent).toContain('File name: gripple_standard.stl')
    expect(stagedZipEntryRows[0]?.textContent).toContain('Type: STL')
    expect(stagedZipEntryRows[0]?.textContent).toContain('Size: 41.7 KB')
    expect(stagedZipEntryRows[0]?.textContent).toContain('Support state: Supported')
    expect(stagedZipEntryRows[0]?.textContent).toContain(
      'Preview: In Import review after staging',
    )
    expect(stagedZipEntryRows[0]?.textContent).toContain('Selected: Yes')
    expect(stagedZipEntryRows[1]?.textContent).toContain('Archive path: gripple_standard.3mf')
    expect(stagedZipEntryRows[1]?.textContent).toContain('Type: 3MF')
    expect(stagedZipEntryRows[1]?.textContent).toContain('Size: 27.9 KB')
    expect(stagedZipEntryRows[1]?.textContent).toContain('Support state: Unsupported')
    expect(stagedZipEntryRows[1]?.textContent).toContain('Preview: Not available')
    expect(stagedZipEntryRows[1]?.textContent).toContain('Selected: No')
    expect(stagedZipEntryRows[2]?.textContent).toContain('Support state: Unsupported')
    expect(stagedZipEntryRows[2]?.textContent).toContain('Preview: Not available')
    expect(stagedZipEntryRows[2]?.textContent).toContain('Size: 135.6 KB')
    expect(sourceOptionsDialog?.textContent).toContain(
      'ZIP inspected. 1 supported archive candidate selected for extraction into Import review',
    )
    candidateCheckboxes = Array.from(
      sourceOptionsDialog?.querySelectorAll(
        '[data-catalog-pubparts-staged-zip-entry-checkbox]',
      ) ?? [],
    ) as HTMLInputElement[]
    expect(candidateCheckboxes).toHaveLength(3)
    expect(candidateCheckboxes[0]?.checked).toBe(true)
    expect(candidateCheckboxes[0]?.disabled).toBe(false)
    expect(candidateCheckboxes[1]?.checked).toBe(false)
    expect(candidateCheckboxes[1]?.disabled).toBe(true)
    expect(candidateCheckboxes[2]?.checked).toBe(false)
    expect(candidateCheckboxes[2]?.disabled).toBe(true)
    const selectAllButton = Array.from(
      sourceOptionsDialog?.querySelectorAll('.CatalogSourceOptionsAction') ?? [],
    ).find((element) => element.textContent === 'Select All Supported') as
      | HTMLButtonElement
      | undefined
    stageSelectedButton = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-stage-selected-source-options]',
    ) as HTMLButtonElement | null
    expect(selectAllButton?.disabled).toBe(false)
    expect(stageSelectedButton?.disabled).toBe(false)
    expect(stageSelectedButton?.textContent).toBe('Stage Selected to Import Review')
    const downloadZipLink = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-source-download-link]',
    ) as HTMLAnchorElement | null
    expect(downloadZipLink?.textContent).toBe('Download ZIP')
    expect(downloadZipLink?.getAttribute('href')).toBe(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=1',
    )

    await act(async () => {
      stageSelectedButton?.click()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
      await new Promise((resolve) => window.setTimeout(resolve, 100))
    })

    expect(sourceOptionsDialog?.textContent).toContain(
      '1 PubParts source file staged in Import review with PubParts attribution',
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(File))
    expect(openDropboxChooserBridgeMock).not.toHaveBeenCalled()
    expect(fetchDropboxChooserSelectedReferenceFileMock).not.toHaveBeenCalled()
    expect(openStagedImportDraftSpy).toHaveBeenCalledWith({})
    expect(appendStagedImportDraftFilesSpy).toHaveBeenCalledWith([
      expect.objectContaining({
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        objectUrl: 'blob:catalog-surface-pubparts-source',
        sourceAttribution: expect.objectContaining({
          sourceKind: 'external-catalog',
          providerId: 'pubparts',
          providerName: 'PubParts',
          catalogItemId: externalPreviewItemId,
          catalogItemLabel: '3d Printed Gripples',
          sourceCandidateUrl:
            'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
          linkedArchiveUrl:
            'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
          sourcePageUrl: 'https://www.printables.com/model/598759',
        }),
      }),
    ])
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()
  })

  it('uses cached ZIP manifests for repeat source-options opens and still refetches for extraction', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
      { path: 'gripple_standard.3mf', content: 'unsupported bytes' },
    ])
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => archiveBlob,
    })
    vi.stubGlobal('fetch', fetchMock)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-source-options-cache" />)
    })

    expect(fetchMock).not.toHaveBeenCalled()

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const addToProjectButton = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-add-to-project-action]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()

    await act(async () => {
      addToProjectButton?.click()
      await Promise.resolve()
      await Promise.resolve()
      await new Promise((resolve) => window.setTimeout(resolve, 20))
    })

    let sourceOptionsDialog = container?.querySelector(
      '[data-catalog-pubparts-source-options-dialog]',
    ) as HTMLElement | null
    expect(sourceOptionsDialog?.textContent).toContain('gripple_standard.stl')
    expect(sourceOptionsDialog?.textContent).toContain(
      'ZIP inspected. 1 supported archive candidate selected for extraction into Import review',
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(pubPartsArchiveManifestCacheStorageKey)).toContain(
      'gripple_standard.stl',
    )
    expect(window.localStorage.getItem(pubPartsArchiveManifestCacheStorageKey)).not.toContain(
      'objectUrl',
    )
    expect(window.localStorage.getItem(pubPartsArchiveManifestCacheStorageKey)).not.toContain(
      'archiveBlob',
    )

    const closeButton = sourceOptionsDialog?.querySelector(
      '.CatalogSourceOptionsClose',
    ) as HTMLButtonElement | null
    await act(async () => {
      closeButton?.click()
    })
    expect(container?.querySelector('[data-catalog-pubparts-source-options-dialog]')).toBeNull()

    fetchMock.mockClear()
    await act(async () => {
      addToProjectButton?.click()
      await Promise.resolve()
    })

    sourceOptionsDialog = container?.querySelector(
      '[data-catalog-pubparts-source-options-dialog]',
    ) as HTMLElement | null
    expect(sourceOptionsDialog?.textContent).toContain('gripple_standard.stl')
    expect(sourceOptionsDialog?.textContent).toContain('Loaded cached ZIP manifest')
    expect(fetchMock).not.toHaveBeenCalled()

    const stageSelectedButton = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-stage-selected-source-options]',
    ) as HTMLButtonElement | null
    expect(stageSelectedButton?.disabled).toBe(false)

    await act(async () => {
      stageSelectedButton?.click()
      await Promise.resolve()
      await Promise.resolve()
      await new Promise((resolve) => window.setTimeout(resolve, 100))
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sourceOptionsDialog?.textContent).toContain(
      '1 PubParts source file staged in Import review with PubParts attribution',
    )
    expect(appendStagedImportDraftFilesSpy).toHaveBeenCalledWith([
      expect.objectContaining({
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
      }),
    ])
  })

  it('ignores stale cached ZIP manifests when the source version changes', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
    ])
    let resolveFetch: (response: Response) => void = () => undefined
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve
    })
    const fetchMock = vi.fn(() => fetchPromise)
    vi.stubGlobal('fetch', fetchMock)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-source-options-cache-stale" />)
    })

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const externalPreviewItemId = itemPageRegion
      ?.querySelector('[data-catalog-source-page-link]')
      ?.getAttribute('data-catalog-source-page-link')
    const sourceUrl =
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0'
    writePubPartsArchiveManifestCacheRecord(
      {
        stagedSourceId: `pubparts:${externalPreviewItemId}`,
        catalogItemId: externalPreviewItemId ?? '',
        catalogItemLabel: '3d Printed Gripples',
        providerId: 'pubparts',
        providerName: 'PubParts',
        sourceCandidateUrl: sourceUrl,
        linkedArchiveUrl: sourceUrl,
        sourcePageUrl: 'https://www.printables.com/model/598759',
        sourceUrl: 'https://www.printables.com/model/598759',
        archiveLastUpdated: 'stale-version',
        sourceMetadata: [],
        status: 'source-link-staged',
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'not-inspected',
        importStatus: 'not-imported',
        stagedAt: '2026-04-21T00:00:00.000Z',
        updatedAt: '2026-04-21T00:00:00.000Z',
      } satisfies PubPartsStagedSourceRecord,
      [
        {
          archivePath: 'stale.stl',
          normalizedPath: 'stale.stl',
          fileName: 'stale.stl',
          fileType: 'stl',
          classification: 'supported',
          supportState: 'import-supported',
          description: 'Stale cached entry.',
          fileSizeBytes: 1,
          isDirectory: false,
          selectable: true,
        },
      ],
      { storage: window.localStorage },
    )

    const addToProjectButton = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-add-to-project-action]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()

    await act(async () => {
      addToProjectButton?.click()
      await Promise.resolve()
    })

    const sourceOptionsDialog = container?.querySelector(
      '[data-catalog-pubparts-source-options-dialog]',
    ) as HTMLElement | null
    expect(sourceOptionsDialog?.textContent).toContain(
      'Inspecting ZIP archive from the PubParts source',
    )
    expect(sourceOptionsDialog?.textContent).not.toContain('stale.stl')
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveFetch({
        ok: true,
        status: 200,
        blob: async () => archiveBlob,
      } as Response)
      await fetchPromise
      await Promise.resolve()
    })
  })

  it('does not append partial files when selected archive entry staging fails', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const archiveBlob = await createFixtureZipBlob([
      { path: 'gripple_standard.stl', content: 'stl bytes' },
    ])
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => archiveBlob,
    })
    vi.stubGlobal('fetch', fetchMock)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-source-options-fail-stage" />)
    })

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const addToProjectButton = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-add-to-project-action]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()

    await act(async () => {
      addToProjectButton?.click()
      await Promise.resolve()
      await Promise.resolve()
      await new Promise((resolve) => window.setTimeout(resolve, 20))
    })

    const sourceOptionsDialog = container?.querySelector(
      '[data-catalog-pubparts-source-options-dialog]',
    ) as HTMLElement | null
    expect(sourceOptionsDialog?.textContent).toContain('gripple_standard.stl')
    const stageSelectedButton = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-stage-selected-source-options]',
    ) as HTMLButtonElement | null
    expect(stageSelectedButton?.disabled).toBe(false)
    createObjectURLMock.mockImplementation(() => {
      throw new Error('Object URL creation failed.')
    })

    await act(async () => {
      stageSelectedButton?.click()
      await Promise.resolve()
      await Promise.resolve()
      await new Promise((resolve) => window.setTimeout(resolve, 100))
    })

    expect(sourceOptionsDialog?.textContent).toContain(
      'Object URL creation failed. No files were added.',
    )
    expect(openStagedImportDraftSpy).not.toHaveBeenCalled()
    expect(appendStagedImportDraftFilesSpy).not.toHaveBeenCalled()
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()
  })

  it('falls back to browser-honest ZIP download and upload guidance when ZIP inspection fails', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const localArchiveBlob = await createFixtureZipBlob([
      { path: 'manual_download/gripple_standard.stl', content: 'local stl bytes' },
      { path: 'manual_download/gripple_body.obj', content: 'local obj bytes' },
      { path: 'manual_download/gripple_preview.glb', content: 'local glb bytes' },
      { path: 'manual_download/gripple_bracket.step', content: 'local step bytes' },
      { path: 'manual_download/gripple_bracket.stp', content: 'local stp bytes' },
      { path: 'manual_download/gripple_standard.pdf', content: 'local pdf bytes' },
      { path: 'manual_download/reference_folder/', directory: true },
      { path: '__MACOSX/._gripple_standard.stl', content: 'hidden system bytes' },
    ])
    const fetchMock = vi.fn().mockResolvedValue(
      {
        ok: true,
        status: 200,
        blob: async () => new Blob(['not a zip'], { type: 'application/zip' }),
      },
    )
    vi.stubGlobal('fetch', fetchMock)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-source-options-failure" />)
    })

    const externalCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('3d Printed Gripples'),
    ) as HTMLElement | undefined
    expect(externalCard).toBeDefined()

    await act(async () => {
      externalCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const addToProjectButton = itemPageRegion?.querySelector(
      '[data-catalog-pubparts-add-to-project-action]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()

    await act(async () => {
      addToProjectButton?.click()
      await Promise.resolve()
      await Promise.resolve()
    })

    const sourceOptionsDialog = container?.querySelector(
      '[data-catalog-pubparts-source-options-dialog]',
    ) as HTMLElement | null
    expect(sourceOptionsDialog).not.toBeNull()
    expect(sourceOptionsDialog?.textContent).toContain(
      'This staged importer uses the PubParts source link for this item.',
    )
    expect(sourceOptionsDialog?.textContent).toContain(
      'The browser controls where the ZIP is saved; ParaHook only reads the file after you choose it here.',
    )
    expect(sourceOptionsDialog?.textContent).toContain('Provider: PubParts')
    expect(sourceOptionsDialog?.textContent).toContain(
      'Source page: https://www.printables.com/model/598759',
    )
    expect(sourceOptionsDialog?.textContent).toContain(
      'Source ZIP: https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
    )
    expect(sourceOptionsDialog?.textContent).toContain(
      'PubParts ZIP archive inspection failed. Use Download ZIP to open or save the archive, then upload that ZIP here.',
    )
    expect(sourceOptionsDialog?.textContent).toContain('Archive Needs Inspection')
    const downloadZipLink = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-source-download-link]',
    ) as HTMLAnchorElement | null
    expect(downloadZipLink?.textContent).toBe('Download ZIP')
    expect(downloadZipLink?.getAttribute('href')).toBe(
      'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=1',
    )
    expect(downloadZipLink?.getAttribute('target')).toBe('_blank')
    expect(downloadZipLink?.getAttribute('rel')).toBe('noreferrer')
    const chooseLocalZipButton = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-choose-local-zip]',
    ) as HTMLButtonElement | null
    expect(chooseLocalZipButton).not.toBeNull()
    expect(chooseLocalZipButton?.textContent).toBe('Upload ZIP')
    expect(chooseLocalZipButton?.disabled).toBe(false)
    const candidateCheckbox = sourceOptionsDialog?.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null
    const stageSelectedButton = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-stage-selected-source-options]',
    ) as HTMLButtonElement | null
    expect(candidateCheckbox?.checked).toBe(false)
    expect(candidateCheckbox?.disabled).toBe(true)
    expect(stageSelectedButton?.disabled).toBe(true)
    expect(openStagedImportDraftSpy).not.toHaveBeenCalled()
    expect(appendStagedImportDraftFilesSpy).not.toHaveBeenCalled()
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()

    await act(async () => {
      chooseLocalZipButton?.click()
      await Promise.resolve()
    })

    const localZipInput = document.body.querySelector(
      'input[type="file"][accept=".zip,application/zip"]',
    ) as HTMLInputElement | null
    expect(localZipInput).not.toBeNull()
    Object.defineProperty(localZipInput, 'files', {
      configurable: true,
      value: [
        new File([localArchiveBlob], 'standard-gripples-for-onewheel-model_files.zip', {
          type: 'application/zip',
        }),
      ],
    })

    await act(async () => {
      localZipInput?.dispatchEvent(new Event('change'))
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(sourceOptionsDialog?.textContent).toContain('manual_download/gripple_standard.stl')
    expect(sourceOptionsDialog?.textContent).toContain('manual_download/gripple_standard.pdf')
    expect(sourceOptionsDialog?.textContent).toContain('manual_download/reference_folder/')
    expect(sourceOptionsDialog?.textContent).toContain('__MACOSX/._gripple_standard.stl')
    expect(sourceOptionsDialog?.textContent).toContain(
      'Local ZIP inspected. 4 supported archive candidates selected for extraction into Import review',
    )
    expect(sourceOptionsDialog?.textContent).toContain('Provider: PubParts')
    expect(sourceOptionsDialog?.textContent).toContain(
      'Source ZIP: https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
    )
    const localStagedZipEntryList = sourceOptionsDialog?.querySelector(
      '[data-catalog-pubparts-staged-zip-entry-list]',
    ) as HTMLElement | null
    expect(localStagedZipEntryList).not.toBeNull()
    const localStagedRows = Array.from(
      sourceOptionsDialog?.querySelectorAll('[data-catalog-pubparts-staged-zip-entry-row]') ??
        [],
    ) as HTMLElement[]
    expect(localStagedRows).toHaveLength(8)
    const localPreviewStates = Array.from(
      sourceOptionsDialog?.querySelectorAll(
        '[data-catalog-pubparts-staged-zip-entry-preview-state]',
      ) ?? [],
    ) as HTMLElement[]
    expect(localPreviewStates).toHaveLength(8)
    expect(localStagedRows[0]?.textContent).toContain(
      'Archive path: manual_download/gripple_standard.stl',
    )
    expect(localStagedRows[0]?.textContent).toContain('File name: gripple_standard.stl')
    expect(localStagedRows[0]?.textContent).toContain('Type: STL')
    expect(localStagedRows[0]?.textContent).toContain('Size: 15 bytes')
    expect(localStagedRows[0]?.textContent).toContain('Support state: Supported')
    expect(localStagedRows[0]?.textContent).toContain(
      'Preview: In Import review after staging',
    )
    expect(localStagedRows[0]?.textContent).toContain('Selected: Yes')
    expect(localStagedRows[1]?.textContent).toContain(
      'Archive path: manual_download/gripple_body.obj',
    )
    expect(localStagedRows[1]?.textContent).toContain('Support state: Supported')
    expect(localStagedRows[1]?.textContent).toContain(
      'Preview: In Import review after staging',
    )
    expect(localStagedRows[1]?.textContent).toContain('Selected: Yes')
    expect(localStagedRows[2]?.textContent).toContain(
      'Archive path: manual_download/gripple_preview.glb',
    )
    expect(localStagedRows[2]?.textContent).toContain('Support state: Supported')
    expect(localStagedRows[2]?.textContent).toContain(
      'Preview: In Import review after staging',
    )
    expect(localStagedRows[2]?.textContent).toContain('Selected: Yes')
    expect(localStagedRows[3]?.textContent).toContain(
      'Archive path: manual_download/gripple_bracket.step',
    )
    expect(localStagedRows[3]?.textContent).toContain('Support state: Supported')
    expect(localStagedRows[3]?.textContent).toContain(
      'Preview: In Import review after staging',
    )
    expect(localStagedRows[3]?.textContent).toContain('Selected: Yes')
    expect(localStagedRows[4]?.textContent).toContain(
      'Archive path: manual_download/gripple_bracket.stp',
    )
    expect(localStagedRows[4]?.textContent).toContain('Support state: Unsupported')
    expect(localStagedRows[4]?.textContent).toContain('Preview: Not available')
    expect(localStagedRows[4]?.textContent).toContain('Selected: No')
    expect(localStagedRows[5]?.textContent).toContain(
      'Archive path: manual_download/gripple_standard.pdf',
    )
    expect(localStagedRows[5]?.textContent).toContain('Support state: Unsupported')
    expect(localStagedRows[5]?.textContent).toContain('Preview: Not available')
    expect(localStagedRows[5]?.textContent).toContain('Selected: No')
    expect(localStagedRows[6]?.textContent).toContain('Support state: Directory')
    expect(localStagedRows[6]?.textContent).toContain('Preview: Not available')
    expect(localStagedRows[6]?.textContent).toContain('Blocked reason: Directory')
    expect(localStagedRows[7]?.textContent).toContain('Support state: Hidden/system path')
    expect(localStagedRows[7]?.textContent).toContain('Preview: Not available')
    expect(localStagedRows[7]?.textContent).toContain('Blocked reason: Hidden/system path')
    const localCandidateCheckboxes = Array.from(
      sourceOptionsDialog?.querySelectorAll(
        '[data-catalog-pubparts-staged-zip-entry-checkbox]',
      ) ?? [],
    ) as HTMLInputElement[]
    expect(localCandidateCheckboxes).toHaveLength(8)
    expect(localCandidateCheckboxes[0]?.checked).toBe(true)
    expect(localCandidateCheckboxes[0]?.disabled).toBe(false)
    expect(localCandidateCheckboxes[1]?.checked).toBe(true)
    expect(localCandidateCheckboxes[1]?.disabled).toBe(false)
    expect(localCandidateCheckboxes[2]?.checked).toBe(true)
    expect(localCandidateCheckboxes[2]?.disabled).toBe(false)
    expect(localCandidateCheckboxes[3]?.checked).toBe(true)
    expect(localCandidateCheckboxes[3]?.disabled).toBe(false)
    expect(localCandidateCheckboxes[4]?.checked).toBe(false)
    expect(localCandidateCheckboxes[4]?.disabled).toBe(true)
    expect(localCandidateCheckboxes[5]?.checked).toBe(false)
    expect(localCandidateCheckboxes[5]?.disabled).toBe(true)
    expect(localCandidateCheckboxes[6]?.checked).toBe(false)
    expect(localCandidateCheckboxes[6]?.disabled).toBe(true)
    expect(localCandidateCheckboxes[7]?.checked).toBe(false)
    expect(localCandidateCheckboxes[7]?.disabled).toBe(true)

    const clearSelectionButton = Array.from(
      sourceOptionsDialog?.querySelectorAll('.CatalogSourceOptionsAction') ?? [],
    ).find((element) => element.textContent === 'Clear Selection') as
      | HTMLButtonElement
      | undefined
    const selectAllSupportedButton = Array.from(
      sourceOptionsDialog?.querySelectorAll('.CatalogSourceOptionsAction') ?? [],
    ).find((element) => element.textContent === 'Select All Supported') as
      | HTMLButtonElement
      | undefined

    await act(async () => {
      clearSelectionButton?.click()
      await Promise.resolve()
    })

    expect(sourceOptionsDialog?.textContent).toContain('0 selected')
    expect(localStagedRows[0]?.textContent).toContain('Selected: No')
    expect(stageSelectedButton?.disabled).toBe(true)

    await act(async () => {
      selectAllSupportedButton?.click()
      await Promise.resolve()
    })

    expect(sourceOptionsDialog?.textContent).toContain('4 selected')
    expect(localStagedRows[0]?.textContent).toContain('Selected: Yes')
    expect(localCandidateCheckboxes[0]?.checked).toBe(true)
    expect(localCandidateCheckboxes[1]?.checked).toBe(true)
    expect(localCandidateCheckboxes[2]?.checked).toBe(true)
    expect(localCandidateCheckboxes[3]?.checked).toBe(true)
    expect(localCandidateCheckboxes[4]?.checked).toBe(false)
    expect(localCandidateCheckboxes[5]?.checked).toBe(false)
    expect(localCandidateCheckboxes[6]?.checked).toBe(false)
    expect(localCandidateCheckboxes[7]?.checked).toBe(false)
    expect(stageSelectedButton?.disabled).toBe(false)

    await act(async () => {
      stageSelectedButton?.click()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
      await new Promise((resolve) => window.setTimeout(resolve, 100))
    })

    expect(sourceOptionsDialog?.textContent).toContain(
      '4 PubParts source files staged in Import review with PubParts attribution',
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(openStagedImportDraftSpy).toHaveBeenCalledWith({})
    expect(appendStagedImportDraftFilesSpy).toHaveBeenCalledWith([
      expect.objectContaining({
        fileName: 'gripple_standard.stl',
        fileType: 'stl',
        objectUrl: 'blob:catalog-surface-pubparts-source',
        sourceAttribution: expect.objectContaining({
          providerId: 'pubparts',
          catalogItemLabel: '3d Printed Gripples',
        }),
      }),
      expect.objectContaining({
        fileName: 'gripple_body.obj',
        fileType: 'obj',
      }),
      expect.objectContaining({
        fileName: 'gripple_preview.glb',
        fileType: 'glb',
      }),
      expect.objectContaining({
        fileName: 'gripple_bracket.step',
        fileType: 'step',
      }),
    ])
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()
  })

  it('uses an explicit content scroll owner inside the shared Catalog shell', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <CatalogSurface
          slotId="workspace-slot-secondary"
          surfaceInstanceId="catalog-workspace-owned-scroll"
        />,
      )
    })

    const surface = container?.querySelector('.CatalogSurface') as HTMLDivElement | null
    const shell = surface?.querySelector('.CatalogShell') as HTMLDivElement | null
    const contentRegion = surface?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    const contentBody = surface?.querySelector(
      '[data-catalog-region="content-body"]',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-workspace-host-mode')).toBe('slotted')
    expect(shell?.getAttribute('data-catalog-layout')).toBe('owned-scroll')
    expect(contentRegion).not.toBeNull()
    expect(contentBody).not.toBeNull()
    expect(contentBody?.querySelector('[data-catalog-region="grid"]')).not.toBeNull()
  })

  it('switches the shared surface between Part and Platform browse reads without changing the item contract', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const currentContainer = container

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-browse-mode" />)
    })

    const browseModeButtons = Array.from(
      currentContainer?.querySelectorAll('[data-catalog-region="browse-mode-switcher"] .CatalogShellTag') ??
        [],
    ) as HTMLButtonElement[]
    const partButton = browseModeButtons.find((element) => element.textContent === 'Part')
    const platformButton = browseModeButtons.find((element) => element.textContent === 'Platform')
    const getFilterGroupButton = (groupKey: string, value: string) =>
      Array.from(
        currentContainer?.querySelectorAll(`[data-catalog-filter-group="${groupKey}"] .CatalogShellTag`) ??
          [],
      ).find(
        (element) => element.textContent?.replace(/\s*\(\d+\)$/u, '').trim() === value,
      ) as HTMLButtonElement | undefined
    const sectionButtonLabels = () =>
      Array.from(
        currentContainer?.querySelectorAll('[data-catalog-region="filters"] .CatalogShellFilterButton') ??
          [],
      )
        .map((element) => element.textContent?.replace(/\d+$/u, '').trim() ?? '')

    expect(partButton).toBeDefined()
    expect(platformButton).toBeDefined()
    expect(currentContainer?.querySelector('[data-catalog-region="browse-mode-description"]')?.textContent)
      .toContain('Part read centers part type')
    expect(currentContainer?.querySelector('[data-catalog-region="filter-groups"]')?.textContent).toContain(
      'Part Groups',
    )
    expect(sectionButtonLabels()).toEqual(
      expect.arrayContaining(['All', 'Footpads', 'Shoes', 'FootHolds', 'Hdris', 'Imports']),
    )

    const shoesFilterButton = getFilterGroupButton('partGroups', 'Shoes')
    expect(shoesFilterButton).toBeDefined()

    await act(async () => {
      shoesFilterButton?.click()
    })

    expect(
      Array.from(currentContainer?.querySelectorAll('[data-catalog-region="grid"] .CatalogShellCard') ?? [])
        .length,
    ).toBe(4)
    expect(currentContainer?.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Shoe 1',
    )
    expect(currentContainer?.querySelector('[data-catalog-region="grid"]')?.textContent).not.toContain(
      'Large Foothook',
    )

    await act(async () => {
      platformButton?.click()
    })

    expect(
      currentContainer?.querySelector('[data-catalog-region="browse-mode-description"]')?.textContent,
    ).toContain('Platform read centers system ownership')
    expect(currentContainer?.querySelector('[data-catalog-region="filter-groups"]')?.textContent).toContain(
      'Platform Compatibility',
    )
    expect(sectionButtonLabels()).toEqual(
      expect.arrayContaining(['All', 'ADV', 'XR', 'GT', 'Pint', 'XR Classic', 'Hdris', 'Imports']),
    )
    expect(
      currentContainer
        ?.querySelector('[data-catalog-filter-group="partGroups"]')
        ?.querySelector('.CatalogShellTag.isSelected')?.textContent,
    ).toContain('Shoes')
    expect(currentContainer?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Platform Catalog Cards',
    )

    expect(
      Array.from(currentContainer?.querySelectorAll('[data-catalog-region="grid"] .CatalogShellCard') ?? [])
        .length,
    ).toBe(4)
    expect(currentContainer?.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Shoe 1',
    )
    expect(currentContainer?.querySelector('[data-catalog-region="grid"]')?.textContent).not.toContain(
      'Large Foothook',
    )

    await act(async () => {
      partButton?.click()
    })

    expect(
      currentContainer?.querySelector('[data-catalog-region="browse-mode-description"]')?.textContent,
    ).toContain('Part read centers part type')
    expect(sectionButtonLabels()).toEqual(
      expect.arrayContaining(['All', 'Footpads', 'Shoes', 'FootHolds', 'Hdris', 'Imports']),
    )

    expect(currentContainer?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Part Catalog Cards',
    )
  })

  it('swaps the shared content area between the card grid and a full item page without auto-loading media', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-1" />)
    })

    const openItemPageButton = Array.from(
      container?.querySelectorAll('.CatalogShellCardActionButton') ?? [],
    ).find(
      (element) =>
        element.textContent?.includes('Open Item Page') &&
        element.parentElement?.parentElement?.textContent?.includes('Shoe 1'),
    ) as HTMLButtonElement | undefined

    expect(openItemPageButton).toBeDefined()

    await act(async () => {
      openItemPageButton?.click()
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.querySelector('[data-catalog-region="item-page"]')).not.toBeNull()
    expect(contentRegion?.textContent).toContain('Back To Catalog')
    expect(contentRegion?.textContent).toContain('Curated Shoes Family')
    expect(contentRegion?.textContent).toContain(
      'Optional curated shoe references stay out of Browser until you explicitly add them to project content.',
    )
    expect(contentRegion?.textContent).toContain('No auto-preview.')
    expect(contentRegion?.textContent).toContain(
      'temporary Catalog preview session for this curated shoes family',
    )
    expect(contentRegion?.textContent).toContain('Add To Project')
    expect(contentRegion?.querySelector('img')).toBeNull()
    expect(contentRegion?.querySelector('video')).toBeNull()

    const backButton = contentRegion?.querySelector('.CatalogShellBackButton') as
      | HTMLButtonElement
      | null
    expect(backButton).not.toBeNull()

    await act(async () => {
      backButton?.click()
    })

    expect(contentRegion?.querySelector('[data-catalog-region="grid"]')).not.toBeNull()
    expect(contentRegion?.textContent).toContain('Part Catalog Cards')
  })

  it('renders the interactive preview viewport on a repo-backed item page once preview is loaded', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-item-page-preview-viewport" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard).toBeDefined()

    await act(async () => {
      shoeCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const loadPreviewButton = container?.querySelector(
      '[data-catalog-action-kind="load-preview"]',
    ) as HTMLButtonElement | null
    expect(loadPreviewButton).not.toBeNull()

    await act(async () => {
      loadPreviewButton?.click()
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const itemPageViewport = itemPageRegion?.querySelector(
      '[data-catalog-preview-viewport="reference:shoe-1"]',
    ) as HTMLDivElement | null

    expect(itemPageViewport).not.toBeNull()
    expect(itemPageViewport?.getAttribute('data-catalog-preview-surface-kind')).toBe('item-page')
    expect(itemPageViewport?.textContent).toMatch(
      /Preparing 3D preview|Drag to rotate|Interactive preview unavailable here/,
    )
    expect(itemPageRegion?.textContent).toContain(
      'is currently loaded through the temporary Catalog preview session for this curated shoes family',
    )
  })

  it('loads preview when the user clicks the unloaded item-page preview surface', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-item-page-preview-click" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard).toBeDefined()

    await act(async () => {
      shoeCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPagePreviewTrigger = container?.querySelector(
      '[data-catalog-item-preview-trigger="reference:shoe-1"]',
    ) as HTMLButtonElement | null
    expect(itemPagePreviewTrigger).not.toBeNull()
    expect(itemPagePreviewTrigger?.textContent).toContain('Click to load preview into this item page.')

    await act(async () => {
      itemPagePreviewTrigger?.click()
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const itemPageViewport = itemPageRegion?.querySelector(
      '[data-catalog-preview-viewport="reference:shoe-1"]',
    ) as HTMLDivElement | null
    expect(itemPageViewport).not.toBeNull()
    expect(itemPageViewport?.getAttribute('data-catalog-preview-surface-kind')).toBe('item-page')
  })

  it('hands a repo-backed Add To Project action off to the downstream browser-project owner instead of keeping it catalog-local', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-add-to-project" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard).toBeDefined()

    await act(async () => {
      shoeCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const addToProjectButton = container?.querySelector(
      '[data-catalog-action-kind="add-to-project"]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()
    expect(addToProjectButton?.disabled).toBe(false)

    await act(async () => {
      addToProjectButton?.click()
    })

    expect(addImportedReferenceSpy).toHaveBeenCalledWith({
      catalogFamilyKey: 'shoes',
      catalogItemId: 'reference:shoe-1',
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
    })
    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toContain('catalog-commit-1')
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-1']).toEqual(
      expect.objectContaining({
        referenceId: 'catalog-commit-1',
        sourceKind: 'imported',
        categoryId: 'user-references',
        label: 'Shoe 1',
        assetPath: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
        catalogItemId: 'reference:shoe-1',
        catalogFamilyKey: 'shoes',
      }),
    )

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-add-to-project" />)
    })

    const importsFilter = Array.from(
      container?.querySelectorAll('.CatalogShellFilterButton') ?? [],
    ).find((element) => element.textContent?.includes('Imports')) as HTMLButtonElement | undefined
    expect(importsFilter).toBeDefined()

    await act(async () => {
      importsFilter?.click()
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.textContent).toContain('Imported Catalog Entries')
    expect(contentRegion?.textContent).toContain('Shoe 1')
    expect(previewSessionRegion?.textContent).toContain('No preview-loaded items yet')
  })

  it('shows a direct grid-card Add To Project action only for eligible repo-backed cards and reuses the same downstream browser-project handoff', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-grid-card-add-to-project" />)
    })

    const shoeAddToProjectButton = Array.from(
      container?.querySelectorAll('[data-catalog-card-action-kind="add-to-project"]') ?? [],
    ).find((element) =>
      element.parentElement?.parentElement?.textContent?.includes('Shoe 1'),
    ) as HTMLButtonElement | undefined
    expect(shoeAddToProjectButton).toBeDefined()
    expect(shoeAddToProjectButton?.disabled).toBe(false)

    const importedReferenceCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Imported Reference 1'),
    ) as HTMLElement | undefined
    expect(importedReferenceCard).toBeDefined()
    expect(
      importedReferenceCard?.querySelector('[data-catalog-card-action-kind="add-to-project"]'),
    ).toBeNull()

    const environmentCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Studio Small 09 2K HDR'),
    ) as HTMLElement | undefined
    expect(environmentCard).toBeDefined()
    expect(
      environmentCard?.querySelector('[data-catalog-card-action-kind="add-to-project"]'),
    ).toBeNull()

    await act(async () => {
      shoeAddToProjectButton?.click()
    })

    expect(addImportedReferenceSpy).toHaveBeenCalledWith({
      catalogFamilyKey: 'shoes',
      catalogItemId: 'reference:shoe-1',
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
    })
    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toContain('catalog-commit-1')

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-grid-card-add-to-project" />)
    })

    const importsFilter = Array.from(
      container?.querySelectorAll('.CatalogShellFilterButton') ?? [],
    ).find((element) => element.textContent?.includes('Imports')) as HTMLButtonElement | undefined
    expect(importsFilter).toBeDefined()

    await act(async () => {
      importsFilter?.click()
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.textContent).toContain('Imported Catalog Entries')
    expect(contentRegion?.textContent).toContain('Shoe 1')
  })

  it('keeps the first curated reference families on the same downstream browser-project owner path after family onboarding widens', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-family-commit-follow-through" />)
    })

    const familyExpectations = [
      {
        label: 'Shoe 1',
        objectUrlPattern: /\/Catalog\/shoes\/Shoe_1\.glb$/,
        fileType: 'glb',
      },
      {
        label: 'Large Foothook',
        objectUrlPattern: /\/Catalog\/hooks\/large\.step$/,
        fileType: 'step',
      },
      {
        label: 'PubPad Full Assembly',
        objectUrlPattern: /\/Catalog\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/,
        fileType: 'obj',
      },
    ] as const

    for (const expectation of familyExpectations) {
      const card = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
        (element) => element.textContent?.includes(expectation.label),
      ) as HTMLElement | undefined
      expect(card).toBeDefined()

      await act(async () => {
        card?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      })

      const addToProjectButton = container?.querySelector(
        '[data-catalog-action-kind="add-to-project"]',
      ) as HTMLButtonElement | null
      expect(addToProjectButton).not.toBeNull()
      expect(addToProjectButton?.disabled).toBe(false)

      await act(async () => {
        addToProjectButton?.click()
      })

      const backButton = container?.querySelector('.CatalogShellBackButton') as
        | HTMLButtonElement
        | null
      expect(backButton).not.toBeNull()

      await act(async () => {
        backButton?.click()
      })
    }

    expect(addImportedReferenceSpy).toHaveBeenNthCalledWith(1, {
      catalogFamilyKey: 'shoes',
      catalogItemId: 'reference:shoe-1',
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
    })
    expect(addImportedReferenceSpy).toHaveBeenNthCalledWith(2, {
      catalogFamilyKey: 'foothooks',
      catalogItemId: 'reference:hook-large',
      fileName: 'Large Foothook',
      fileType: 'step',
      objectUrl: expect.stringMatching(/\/Catalog\/hooks\/large\.step$/),
    })
    expect(addImportedReferenceSpy).toHaveBeenNthCalledWith(3, {
      catalogFamilyKey: 'footpads',
      catalogItemId: 'reference:footpad-pubpad-full-assembly',
      fileName: 'PubPad Full Assembly',
      fileType: 'obj',
      objectUrl: expect.stringMatching(/\/Catalog\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/),
    })

    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toEqual([
      'imported-reference-1',
      'catalog-commit-1',
      'catalog-commit-2',
      'catalog-commit-3',
    ])
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-1']).toEqual(
      expect.objectContaining({
        label: 'Shoe 1',
        assetPath: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
        catalogItemId: 'reference:shoe-1',
        catalogFamilyKey: 'shoes',
      }),
    )
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-2']).toEqual(
      expect.objectContaining({
        label: 'Large Foothook',
        assetPath: expect.stringMatching(/\/Catalog\/hooks\/large\.step$/),
        catalogItemId: 'reference:hook-large',
        catalogFamilyKey: 'foothooks',
      }),
    )
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-3']).toEqual(
      expect.objectContaining({
        label: 'PubPad Full Assembly',
        assetPath: expect.stringMatching(/\/Catalog\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/),
        catalogItemId: 'reference:footpad-pubpad-full-assembly',
        catalogFamilyKey: 'footpads',
      }),
    )

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-family-commit-follow-through" />)
    })

    const importsFilter = Array.from(
      container?.querySelectorAll('.CatalogShellFilterButton') ?? [],
    ).find((element) => element.textContent?.includes('Imports')) as HTMLButtonElement | undefined
    expect(importsFilter).toBeDefined()

    await act(async () => {
      importsFilter?.click()
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.textContent).toContain('Imported Catalog Entries')
    expect(contentRegion?.textContent).toContain('Shoe 1')
    expect(contentRegion?.textContent).toContain('Large Foothook')
    expect(contentRegion?.textContent).toContain('PubPad Full Assembly')
    expect(previewSessionRegion?.textContent).toContain('No preview-loaded items yet')
  })

  it('keeps preview-session state temporary and keeps imports reuse on a preview-only path after repo-backed commit lands', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-preview-boundary-proof" />)
    })

    const shoePreviewBox = container?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLButtonElement | null
    expect(shoePreviewBox).not.toBeNull()

    await act(async () => {
      shoePreviewBox?.click()
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard).toBeDefined()

    await act(async () => {
      shoeCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const addToProjectButton = container?.querySelector(
      '[data-catalog-action-kind="add-to-project"]',
    ) as HTMLButtonElement | null
    expect(addToProjectButton).not.toBeNull()

    await act(async () => {
      addToProjectButton?.click()
    })

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-preview-boundary-proof" />)
    })

    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('1 temporary preview item')
    expect(previewSessionRegion?.textContent).toContain('Shoe 1')

    const importsFilter = Array.from(
      container?.querySelectorAll('.CatalogShellFilterButton') ?? [],
    ).find((element) => element.textContent?.includes('Imports')) as HTMLButtonElement | undefined
    expect(importsFilter).toBeDefined()

    await act(async () => {
      importsFilter?.click()
    })

    const importedShoeCardAction = Array.from(
      container?.querySelectorAll('.CatalogShellCardActionButton') ?? [],
    ).find(
      (element) =>
        element.textContent?.includes('Open Item Page') &&
        element.parentElement?.parentElement?.textContent?.includes('Shoe 1'),
    ) as HTMLButtonElement | undefined
    expect(importedShoeCardAction).toBeDefined()

    await act(async () => {
      importedShoeCardAction?.click()
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.querySelector('[data-catalog-action-kind="add-to-project"]')).toBeNull()
    const loadPreviewButton = contentRegion?.querySelector(
      '[data-catalog-action-kind="load-preview"]',
    ) as HTMLButtonElement | null
    expect(loadPreviewButton).not.toBeNull()
    expect(loadPreviewButton?.disabled).toBe(false)
    expect(previewSessionRegion?.textContent).toContain('1 temporary preview item')
    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toContain('catalog-commit-1')
  })

  it('hands an environment apply action off to the shared viewer-environment owner instead of browser-project content', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-environment-apply" />)
    })

    const environmentCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Studio Small 09 2K HDR'),
    ) as HTMLElement | undefined
    expect(environmentCard).toBeDefined()

    const environmentPreviewBox = environmentCard?.querySelector(
      '[data-catalog-preview-box="environment:studio-small-09-2k-hdr"]',
    ) as HTMLElement | null
    expect(environmentPreviewBox).not.toBeNull()
    expect(environmentPreviewBox?.textContent).toContain('HDRI preview scene')

    await act(async () => {
      environmentCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.querySelector('[data-catalog-action-kind="load-preview"]')).toBeNull()

    const applyEnvironmentButton = contentRegion?.querySelector(
      '[data-catalog-action-kind="apply-environment"]',
    ) as HTMLButtonElement | null
    expect(applyEnvironmentButton).not.toBeNull()
    expect(applyEnvironmentButton?.disabled).toBe(false)

    await act(async () => {
      applyEnvironmentButton?.click()
    })

    expect(useUiPrefsStore.getState().view.environmentSource).toEqual(
      expect.objectContaining({
        kind: 'hdri',
        label: 'Studio Small 09 2K HDR',
        assetPath: expect.stringMatching(/\/HDRI\/studio_small_09_2k\.hdr$/),
        backgroundVisible: true,
        intensity: 1,
      }),
    )
    expect(addImportedReferenceSpy).not.toHaveBeenCalled()
    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toEqual([
      'imported-reference-1',
    ])

    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('No preview-loaded items yet')
  })

  it('keeps grid selection visible as a separate highlight state before opening the item page', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-selection" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined

    expect(shoeCard).toBeDefined()
    expect(shoeCard?.classList.contains('isSelected')).toBe(false)

    await clickCardAndWait(shoeCard)

    expect(shoeCard?.classList.contains('isSelected')).toBe(true)
    expect(container?.querySelector('[data-catalog-region="item-page"]')).toBeNull()
  })

  it('allows more than one card to be selected directly from card clicks', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-direct-multi-select" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    const hookCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Large Foothook'),
    ) as HTMLElement | undefined

    expect(shoeCard).toBeDefined()
    expect(hookCard).toBeDefined()

    await clickCardAndWait(shoeCard)

    await clickCardAndWait(hookCard)

    expect(shoeCard?.classList.contains('isSelected')).toBe(true)
    expect(hookCard?.classList.contains('isSelected')).toBe(true)
    expect(container?.textContent).not.toContain('Add To Selection')
  })

  it('opens the item page when a card is double-clicked', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-double-click-open" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined

    expect(shoeCard).toBeDefined()

    await act(async () => {
      shoeCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.querySelector('[data-catalog-region="item-page"]')).not.toBeNull()
    expect(contentRegion?.textContent).toContain('Back To Catalog')
  })

  it('loads preview into card boxes and keeps a temporary preview-loaded list in the left browse rail', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-preview-grid" />)
    })

    const shoePreviewBox = container?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLButtonElement | null
    expect(shoePreviewBox).not.toBeNull()
    expect(shoePreviewBox?.textContent).toContain('Click to load preview')

    await act(async () => {
      shoePreviewBox?.click()
    })

    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    const filtersRegion = container?.querySelector(
      '[data-catalog-region="filters"]',
    ) as HTMLDivElement | null
    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('1 temporary preview item')
    expect(previewSessionRegion?.textContent).toContain('Shoe 1')
    expect(filtersRegion?.contains(previewSessionRegion)).toBe(true)
    expect(contentRegion?.querySelector('[data-catalog-region="preview-session"]')).toBeNull()

    const loadedShoePreviewViewport = container?.querySelector(
      '[data-catalog-preview-viewport="reference:shoe-1"]',
    ) as HTMLDivElement | null
    expect(loadedShoePreviewViewport).not.toBeNull()
    expect(loadedShoePreviewViewport?.textContent).toMatch(
      /Preparing 3D preview|Drag to rotate|Interactive preview unavailable here/,
    )

    const loadedShoePreviewBox = container?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLDivElement | null
    expect(loadedShoePreviewBox?.querySelector('img')?.getAttribute('alt')).toBe('Shoe 1 preview')
  })

  it('reuses already-loaded grid preview state when the same repo-backed item page opens', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-grid-to-item-page-preview" />)
    })

    const shoePreviewBox = container?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLButtonElement | null
    expect(shoePreviewBox).not.toBeNull()

    await act(async () => {
      shoePreviewBox?.click()
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard).toBeDefined()

    await act(async () => {
      shoeCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    })

    const itemPageRegion = container?.querySelector(
      '[data-catalog-region="item-page"]',
    ) as HTMLDivElement | null
    const itemPageViewport = itemPageRegion?.querySelector(
      '[data-catalog-preview-viewport="reference:shoe-1"]',
    ) as HTMLDivElement | null

    expect(itemPageViewport).not.toBeNull()
    expect(itemPageViewport?.getAttribute('data-catalog-preview-surface-kind')).toBe('item-page')
    expect(itemPageRegion?.textContent).toContain(
      'is currently loaded through the temporary Catalog preview session for this curated shoes family',
    )
    expect(itemPageRegion?.querySelector('[data-catalog-action-kind="load-preview"]')).not.toBeNull()
  })

  it('loads preview for more than one locally selected card from one preview action', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-multi-preview" />)
    })

    const shoeCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    const hookCard = Array.from(container?.querySelectorAll('.CatalogShellCard') ?? []).find(
      (element) => element.textContent?.includes('Large Foothook'),
    ) as HTMLElement | undefined
    const shoePreviewBox = shoeCard?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLButtonElement | null

    expect(shoeCard).toBeDefined()
    expect(hookCard).toBeDefined()
    expect(shoePreviewBox).not.toBeNull()

    await clickCardAndWait(shoeCard)

    await clickCardAndWait(hookCard)

    await act(async () => {
      shoePreviewBox?.click()
    })

    const previewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('2 temporary preview items')
    expect(previewSessionRegion?.textContent).toContain('Shoe 1')
    expect(previewSessionRegion?.textContent).toContain('Large Foothook')
  })

  it('restores the same retained surface preview session when the Catalog surface remounts with the same surface id', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-retained-preview" />)
    })

    const shoePreviewBox = container?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLButtonElement | null
    expect(shoePreviewBox).not.toBeNull()

    await act(async () => {
      shoePreviewBox?.click()
    })

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-retained-preview" />)
    })

    const restoredPreviewSessionRegion = container?.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    const filtersRegion = container?.querySelector(
      '[data-catalog-region="filters"]',
    ) as HTMLDivElement | null
    expect(restoredPreviewSessionRegion?.textContent).toContain('Shoe 1')
    expect(filtersRegion?.contains(restoredPreviewSessionRegion)).toBe(true)

    const restoredPreviewViewport = container?.querySelector(
      '[data-catalog-preview-viewport="reference:shoe-1"]',
    ) as HTMLDivElement | null
    expect(restoredPreviewViewport).not.toBeNull()

    const restoredPreviewBox = container?.querySelector(
      '[data-catalog-preview-box="reference:shoe-1"]',
    ) as HTMLDivElement | null
    expect(restoredPreviewBox?.querySelector('img')?.getAttribute('alt')).toBe('Shoe 1 preview')
  })

  it('keeps imports reuse on the simpler preview path instead of turning imported cards into interactive viewports', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-imports-preview-path" />)
    })

    const importsFilter = Array.from(
      container?.querySelectorAll('.CatalogShellFilterButton') ?? [],
    ).find((element) => element.textContent?.includes('Imports')) as HTMLButtonElement | undefined
    expect(importsFilter).toBeDefined()

    await act(async () => {
      importsFilter?.click()
    })

    const importsPreviewBox = container?.querySelector(
      '[data-catalog-preview-box="imports:imported-reference-1"]',
    ) as HTMLButtonElement | null
    expect(importsPreviewBox).not.toBeNull()

    await act(async () => {
      importsPreviewBox?.click()
    })

    expect(
      container?.querySelector('[data-catalog-preview-viewport="imports:imported-reference-1"]'),
    ).toBeNull()
    expect(importsPreviewBox?.textContent).toContain('Preview loaded for this card.')
  })

  it('browses imported entries through the shared content area instead of a separate imports panel', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<CatalogSurface surfaceInstanceId="catalog-surface-imports" />)
    })

    const importsFilter = Array.from(
      container?.querySelectorAll('.CatalogShellFilterButton') ?? [],
    ).find((element) => element.textContent?.includes('Imports')) as HTMLButtonElement | undefined

    expect(importsFilter).toBeDefined()

    await act(async () => {
      importsFilter?.click()
    })

    const contentRegion = container?.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLDivElement | null
    expect(contentRegion?.textContent).toContain('Imported Catalog Entries')
    expect(contentRegion?.textContent).toContain('Imported Reference 1')
    expect(container?.querySelector('[data-catalog-region="imports"]')).toBeNull()
  })
})
