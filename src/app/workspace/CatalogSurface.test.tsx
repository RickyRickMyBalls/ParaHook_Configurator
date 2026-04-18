// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetCatalogPreviewSessionsForTests } from '../catalog/catalogPreviewSession'
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
        fileType?: ReferenceFileType
      }
    >
    importedReferenceOrder: string[]
  }
  addImportedReference: (reference: {
    fileName: string
    fileType: ReferenceFileType
    objectUrl: string
    parentAssemblyId?: string | null
    parentComponentId?: string | null
  }) => string
}
let currentAppState: CatalogSurfaceTestState
let addImportedReferenceSpy: ReturnType<typeof vi.fn>

vi.mock('../store/useAppStore', () => {
  const store = ((selector: (state: typeof currentAppState) => unknown) =>
    selector(currentAppState)) as unknown as typeof import('../store/useAppStore').useAppStore
  ;(store as typeof store & { getState: () => AppState }).getState = () =>
    currentAppState as unknown as AppState
  return {
    useAppStore: store,
  }
})

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
    resetCatalogPreviewSessionsForTests()
    useUiPrefsStore.setState({
      view: structuredClone(DEFAULT_VIEW_SETTINGS),
    })
    addImportedReferenceSpy = vi.fn(({ fileName, fileType, objectUrl }) => {
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
      'Catalog Cards',
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
      'Foothooks',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Shoes',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Footpads',
    )
    expect(container?.querySelector('[data-catalog-region="filters"]')?.textContent).toContain(
      'Optional curated reference families now browse here',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Curated Shoes family',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Curated Foothooks family',
    )
    expect(container?.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Curated Footpads family',
    )
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
    expect(contentRegion?.textContent).toContain('Catalog Cards')
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
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
    })
    expect(currentAppState.referenceWorkspace.importedReferenceOrder).toContain('catalog-commit-1')
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-1']).toEqual(
      expect.objectContaining({
        referenceId: 'catalog-commit-1',
        sourceKind: 'imported',
        categoryId: 'user-references',
        label: 'Shoe 1',
        assetPath: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
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
      (element) => element.textContent?.includes('Studio Environment'),
    ) as HTMLElement | undefined
    expect(environmentCard).toBeDefined()
    expect(
      environmentCard?.querySelector('[data-catalog-card-action-kind="add-to-project"]'),
    ).toBeNull()

    await act(async () => {
      shoeAddToProjectButton?.click()
    })

    expect(addImportedReferenceSpy).toHaveBeenCalledWith({
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
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
        objectUrlPattern: /\/ReferenceModels\/shoes\/Shoe_1\.glb$/,
        fileType: 'glb',
      },
      {
        label: 'Large Foothook',
        objectUrlPattern: /\/ReferenceModels\/hooks\/large\.step$/,
        fileType: 'step',
      },
      {
        label: 'PubPad Full Assembly',
        objectUrlPattern: /\/ReferenceModels\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/,
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
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
    })
    expect(addImportedReferenceSpy).toHaveBeenNthCalledWith(2, {
      fileName: 'Large Foothook',
      fileType: 'step',
      objectUrl: expect.stringMatching(/\/ReferenceModels\/hooks\/large\.step$/),
    })
    expect(addImportedReferenceSpy).toHaveBeenNthCalledWith(3, {
      fileName: 'PubPad Full Assembly',
      fileType: 'obj',
      objectUrl: expect.stringMatching(
        /\/ReferenceModels\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/,
      ),
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
        assetPath: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
      }),
    )
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-2']).toEqual(
      expect.objectContaining({
        label: 'Large Foothook',
        assetPath: expect.stringMatching(/\/ReferenceModels\/hooks\/large\.step$/),
      }),
    )
    expect(currentAppState.referenceWorkspace.importedReferencesById['catalog-commit-3']).toEqual(
      expect.objectContaining({
        label: 'PubPad Full Assembly',
        assetPath: expect.stringMatching(
          /\/ReferenceModels\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/,
        ),
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
      (element) => element.textContent?.includes('Studio Environment'),
    ) as HTMLElement | undefined
    expect(environmentCard).toBeDefined()

    const environmentPreviewBox = environmentCard?.querySelector(
      '[data-catalog-preview-box="environment:studio"]',
    ) as HTMLButtonElement | null
    expect(environmentPreviewBox).not.toBeNull()
    expect(environmentPreviewBox?.disabled).toBe(true)

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

    expect(useUiPrefsStore.getState().view.envPreset).toBe('studio')
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
