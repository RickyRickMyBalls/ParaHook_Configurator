// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../../shared/viewSettingsTypes'
import type { CatalogPreviewSessionState } from '../catalogPreviewSession'
import { createCatalogSourceSnapshot } from '../catalogSource'
import { CatalogShell } from './CatalogShell'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

function renderCatalogShell(surfaceId: string) {
  let root: Root | null = null
  const container = document.createElement('div')
  document.body.appendChild(container)

  function Harness() {
    const [previewSession, setPreviewSession] = useState<CatalogPreviewSessionState>({
      loadedItemIds: [],
    })

    return (
      <CatalogShell
        snapshot={createCatalogSourceSnapshot({
          importedReferencesById: {
            'imported-reference-1': {
              referenceId: 'imported-reference-1',
              categoryId: 'user-references',
              label: 'Imported Reference 1',
              assetPath: 'blob:imported-reference-1',
              catalogItemId: null,
            },
          },
          importedReferenceOrder: ['imported-reference-1'],
        })}
        previewLoadedItemIds={previewSession.loadedItemIds}
        onPreviewSessionChange={(nextState) => {
          setPreviewSession((currentPreviewSession) =>
            typeof nextState === 'function' ? nextState(currentPreviewSession) : nextState,
          )
        }}
        onAddItemToProject={vi.fn()}
        onStageExternalSourceLink={vi.fn()}
        onInspectStagedSource={vi.fn()}
        onSelectSupportedFileCandidate={vi.fn()}
        onImportDownloadedPubPartsFiles={vi.fn()}
        pubPartsStagedSourceRecords={[]}
        pubPartsStagedSourcesByCatalogItemId={new Map()}
        pubPartsLocalLibraryMirrorRead={{
          status: 'not-configured',
          rootLabel: 'Choose a PubParts Library folder',
          rootFolderPath: 'PubParts',
          message: 'Choose a Local Library folder to mirror PubParts files into a visible folder.',
        }}
        onApplyEnvironment={vi.fn()}
        onBrowseLocalEnvironment={vi.fn()}
        appliedEnvironmentSource={DEFAULT_VIEW_SETTINGS.environmentSource}
        onSetHdriBackgroundVisible={vi.fn()}
        onSetHdriIntensity={vi.fn()}
        onUnloadAllPreviewItems={() => setPreviewSession({ loadedItemIds: [] })}
        onUnloadPreviewItem={(itemId) =>
          setPreviewSession((currentPreviewSession) => ({
            loadedItemIds: currentPreviewSession.loadedItemIds.filter(
              (loadedItemId) => loadedItemId !== itemId,
            ),
          }))
        }
        onClearPubPartsStagedSource={vi.fn()}
        onClearAllPubPartsStagedSources={vi.fn()}
      />
    )
  }

  act(() => {
    root = createRoot(container)
    root.render(<Harness key={surfaceId} />)
  })

  return { container, root }
}

async function setSearchText(element: HTMLInputElement | null, nextValue: string) {
  await act(async () => {
    if (element === null) {
      return
    }

    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    valueSetter?.call(element, nextValue)
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

const getCatalogActionButton = (container: HTMLElement, actionKind: string) =>
  container.querySelector(`[data-catalog-action-kind="${actionKind}"]`) as HTMLButtonElement | null

const getCatalogCard = (container: HTMLElement, label: string) =>
  Array.from(container.querySelectorAll('.CatalogShellCard')).find((element) =>
    element.textContent?.includes(label),
  ) as HTMLElement | undefined

const getCatalogCardActionButton = (card: HTMLElement | undefined, actionKind: string) =>
  card?.querySelector(`[data-catalog-card-action-kind="${actionKind}"]`) as HTMLButtonElement | null

const getCatalogFilterButton = (container: HTMLElement, region: string, label: string) =>
  Array.from(
    container.querySelectorAll(`[data-catalog-region="${region}"] .CatalogShellFilterButton`),
  ).find((element) => element.textContent?.replace(/\d+$/u, '').trim() === label) as
    | HTMLButtonElement
    | undefined

function renderCatalogShellWithRemovableImport(surfaceId: string) {
  let root: Root | null = null
  const container = document.createElement('div')
  document.body.appendChild(container)

  function Harness() {
    const [previewSession, setPreviewSession] = useState<CatalogPreviewSessionState>({
      loadedItemIds: [],
    })
    const [includeImportedReference, setIncludeImportedReference] = useState(true)

    return (
      <>
        <button
          type="button"
          data-test-action="remove-imported-reference"
          onClick={() => setIncludeImportedReference(false)}
        >
          Remove Imported Reference
        </button>
        <CatalogShell
          snapshot={createCatalogSourceSnapshot({
            importedReferencesById: includeImportedReference
              ? {
                  'imported-reference-1': {
                    referenceId: 'imported-reference-1',
                    categoryId: 'user-references',
                    label: 'Imported Reference 1',
                    assetPath: 'blob:imported-reference-1',
                    catalogItemId: null,
                  },
                }
              : {},
            importedReferenceOrder: includeImportedReference ? ['imported-reference-1'] : [],
          })}
          previewLoadedItemIds={previewSession.loadedItemIds}
          onPreviewSessionChange={(nextState) => {
            setPreviewSession((currentPreviewSession) =>
              typeof nextState === 'function' ? nextState(currentPreviewSession) : nextState,
            )
          }}
          onAddItemToProject={vi.fn()}
          onStageExternalSourceLink={vi.fn()}
          onInspectStagedSource={vi.fn()}
          onSelectSupportedFileCandidate={vi.fn()}
          onImportDownloadedPubPartsFiles={vi.fn()}
          pubPartsStagedSourceRecords={[]}
          pubPartsStagedSourcesByCatalogItemId={new Map()}
          pubPartsLocalLibraryMirrorRead={{
            status: 'not-configured',
            rootLabel: 'Choose a PubParts Library folder',
            rootFolderPath: 'PubParts',
            message:
              'Choose a Local Library folder to mirror PubParts files into a visible folder.',
          }}
          onApplyEnvironment={vi.fn()}
          onBrowseLocalEnvironment={vi.fn()}
          appliedEnvironmentSource={DEFAULT_VIEW_SETTINGS.environmentSource}
          onSetHdriBackgroundVisible={vi.fn()}
          onSetHdriIntensity={vi.fn()}
          onUnloadAllPreviewItems={() => setPreviewSession({ loadedItemIds: [] })}
          onUnloadPreviewItem={(itemId) =>
            setPreviewSession((currentPreviewSession) => ({
              loadedItemIds: currentPreviewSession.loadedItemIds.filter(
                (loadedItemId) => loadedItemId !== itemId,
              ),
            }))
          }
          onClearPubPartsStagedSource={vi.fn()}
          onClearAllPubPartsStagedSources={vi.fn()}
        />
      </>
    )
  }

  act(() => {
    root = createRoot(container)
    root.render(<Harness key={surfaceId} />)
  })

  return { container, root }
}

describe('CatalogShell', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  afterEach(() => {
    act(() => {
      root?.unmount()
    })
    container?.remove()
    root = null
    container = null
  })

  it('loads every currently displayed preview-capable card and skips apply-only environment cards', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-grid-batch-preview-all'))

    const loadDisplayedPreviewsButton = container.querySelector(
      '[data-catalog-action-kind="load-displayed-previews"]',
    ) as HTMLButtonElement | null
    expect(loadDisplayedPreviewsButton).not.toBeNull()
    expect(loadDisplayedPreviewsButton?.disabled).toBe(false)

    await act(async () => {
      loadDisplayedPreviewsButton?.click()
    })

    const previewSessionRegion = container.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('Shoe 1')
    expect(previewSessionRegion?.textContent).toContain('Large Foothook')
    expect(previewSessionRegion?.textContent).toContain('Imported Reference 1')
    expect(previewSessionRegion?.textContent).not.toContain('Studio Small 09 2K HDR')
  })

  it('shows separate Part and Platform browse lists over the same shared metadata contract', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-browse-mode-switch'))
    const currentContainer = container as HTMLDivElement

    const partSectionButtons = Array.from(
      currentContainer.querySelectorAll(
        '[data-catalog-region="part-section-list"] .CatalogShellFilterButton',
      ),
    ) as HTMLButtonElement[]
    const platformSectionButtons = Array.from(
      currentContainer.querySelectorAll(
        '[data-catalog-region="platform-section-list"] .CatalogShellFilterButton',
      ),
    ) as HTMLButtonElement[]
    const partAllButton = partSectionButtons.find((element) => element.textContent?.includes('All'))
    const platformAllButton = platformSectionButtons.find((element) =>
      element.textContent?.includes('All'),
    )
    const clearFacetedFiltersButton = currentContainer.querySelector(
      '[data-catalog-action-kind="clear-faceted-filters"]',
    ) as HTMLButtonElement | null
    const partSectionList = currentContainer.querySelector(
      '[data-catalog-region="part-section-list"]',
    ) as HTMLDivElement | null
    const partSectionResizeHandle = currentContainer.querySelector(
      '[data-catalog-region="part-section-resize-handle"]',
    ) as HTMLDivElement | null
    const filterScrollBody = currentContainer.querySelector(
      '[data-catalog-region="filter-scroll-body"]',
    ) as HTMLDivElement | null
    const railSearchInput = currentContainer.querySelector(
      '[data-catalog-region="filters"] input[type="search"]',
    ) as HTMLInputElement | null
    const contentSearchInput = currentContainer.querySelector(
      '[data-catalog-region="content"] input[type="search"]',
    ) as HTMLInputElement | null
    const previewSessionRegion = currentContainer.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    const browseSectionBoxes = Array.from(
      currentContainer.querySelectorAll('[data-catalog-browse-section-box]'),
    ) as HTMLDivElement[]
    const getSectionButton = (buttons: HTMLButtonElement[], value: string) =>
      buttons.find(
        (element) => element.textContent?.replace(/\d+$/u, '').trim() === value,
      )
    const sectionButtonLabels = (buttons: HTMLButtonElement[]) =>
      buttons
        .map((element) => element.textContent?.replace(/\d+$/u, '').trim() ?? '')
    const platformAdvButton = getSectionButton(platformSectionButtons, 'ADV')
    const platformXrButton = getSectionButton(platformSectionButtons, 'XR')
    const platformGtButton = getSectionButton(platformSectionButtons, 'GT')
    const addSelectionModeButton = currentContainer.querySelector(
      '[data-catalog-action-kind="facet-selection-mode-add"]',
    ) as HTMLButtonElement | null
    const switchSelectionModeButton = currentContainer.querySelector(
      '[data-catalog-action-kind="facet-selection-mode-switch"]',
    ) as HTMLButtonElement | null
    const platformDisclosureButton = currentContainer.querySelector(
      '[data-catalog-action-kind="toggle-browse-platform"]',
    ) as HTMLButtonElement | null
    const partTypeDisclosureButton = currentContainer.querySelector(
      '[data-catalog-action-kind="toggle-filter-partType"]',
    ) as HTMLButtonElement | null
    const partTypeFilterList = currentContainer.querySelector(
      '[data-catalog-region="partType-filter-list"]',
    ) as HTMLDivElement | null
    const partTypeResizeHandle = currentContainer.querySelector(
      '[data-catalog-region="partType-filter-resize-handle"]',
    ) as HTMLDivElement | null

    expect(currentContainer.querySelector('[data-catalog-region="browse-mode-switcher"]')).toBeNull()
    expect(filterScrollBody).not.toBeNull()
    expect(railSearchInput).not.toBeNull()
    expect(contentSearchInput).toBeNull()
    expect(previewSessionRegion).not.toBeNull()
    expect(previewSessionRegion?.parentElement).toBe(
      currentContainer.querySelector('[data-catalog-region="filters"]'),
    )
    expect(filterScrollBody?.contains(previewSessionRegion)).toBe(false)
    expect(browseSectionBoxes.map((element) => element.dataset.catalogBrowseSectionBox)).toEqual([
      'platform',
      'part',
    ])
    expect(partAllButton).toBeDefined()
    expect(platformAllButton).toBeDefined()
    expect(clearFacetedFiltersButton).not.toBeNull()
    expect(platformAdvButton).toBeDefined()
    expect(platformXrButton).toBeDefined()
    expect(platformGtButton).toBeDefined()
    expect(addSelectionModeButton?.textContent).toBe('Add to selection')
    expect(switchSelectionModeButton?.textContent).toBe('Switch selection')
    expect(addSelectionModeButton?.classList.contains('isActive')).toBe(true)
    expect(switchSelectionModeButton?.classList.contains('isActive')).toBe(false)
    expect(platformDisclosureButton?.getAttribute('aria-expanded')).toBe('true')
    expect(partTypeDisclosureButton?.getAttribute('aria-expanded')).toBe('true')
    expect(
      platformDisclosureButton?.querySelector('.CatalogShellFacetDisclosureTriangle'),
    ).not.toBeNull()
    expect(
      partTypeDisclosureButton?.querySelector('.CatalogShellFacetDisclosureTriangle'),
    ).not.toBeNull()
    expect(partSectionList?.style.getPropertyValue('--catalog-browse-section-height')).toBe('170px')
    expect(partSectionResizeHandle).not.toBeNull()
    expect(partSectionResizeHandle?.getAttribute('aria-valuenow')).toBe('170')
    expect(partTypeFilterList?.style.getPropertyValue('--catalog-browse-section-height')).toBe('170px')
    expect(partTypeResizeHandle).not.toBeNull()
    expect(partTypeResizeHandle?.getAttribute('aria-valuenow')).toBe('170')
    expect(partAllButton?.classList.contains('isActive')).toBe(true)
    expect(platformAllButton?.classList.contains('isActive')).toBe(true)
    expect(currentContainer.querySelector('[data-catalog-region="part-section-list"]')?.textContent)
      .toContain('Footpads')
    expect(currentContainer.querySelector('[data-catalog-region="platform-section-list"]')?.textContent)
      .toContain('XR Classic')
    expect(currentContainer.querySelector('[data-catalog-region="content"] [data-catalog-region="filter-groups"]')).toBeNull()
    expect(
      Array.from(currentContainer.querySelectorAll('[data-catalog-filter-group]')).map(
        (element) => (element as HTMLElement).dataset.catalogFilterGroup,
      ),
    ).toEqual(
      expect.arrayContaining([
        'systemKey',
        'partType',
        'brand',
        'source',
        'availability',
        'resourceType',
        'localStatus',
        'previewStatus',
        'fileType',
        'position',
      ]),
    )
    expect(currentContainer.querySelector('[data-catalog-region="partType-filter-list"]')).not.toBeNull()

    await act(async () => {
      partTypeDisclosureButton?.click()
    })

    expect(partTypeDisclosureButton?.getAttribute('aria-expanded')).toBe('false')
    expect(currentContainer.querySelector('[data-catalog-region="partType-filter-list"]')).toBeNull()
    expect(
      currentContainer.querySelector('[data-catalog-region="partType-filter-resize-handle"]'),
    ).toBeNull()

    await act(async () => {
      partTypeDisclosureButton?.click()
    })

    expect(partTypeDisclosureButton?.getAttribute('aria-expanded')).toBe('true')
    expect(currentContainer.querySelector('[data-catalog-region="partType-filter-list"]')).not.toBeNull()
    const reopenedPartTypeResizeHandle = currentContainer.querySelector(
      '[data-catalog-region="partType-filter-resize-handle"]',
    ) as HTMLDivElement | null
    const reopenedPartTypeFilterList = currentContainer.querySelector(
      '[data-catalog-region="partType-filter-list"]',
    ) as HTMLDivElement | null

    await act(async () => {
      reopenedPartTypeResizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
      )
    })

    expect(reopenedPartTypeResizeHandle?.getAttribute('aria-valuenow')).toBe('182')
    expect(reopenedPartTypeFilterList?.style.getPropertyValue('--catalog-browse-section-height')).toBe('182px')
    expect(sectionButtonLabels(partSectionButtons)).toEqual(
      expect.arrayContaining([
        'All',
        'Footpads',
        'Tires',
        'Controllers',
        'Fenders',
        'Rim Savers',
        'Shoes',
        'FootHolds',
        'Hdris',
        'Imports',
      ]),
    )
    expect(sectionButtonLabels(platformSectionButtons)).toEqual(
      expect.arrayContaining(['All', 'ADV', 'XR', 'GT', 'Pint', 'XR Classic', 'Hdris', 'Imports']),
    )

    await act(async () => {
      platformAdvButton?.click()
    })

    expect(platformAllButton?.classList.contains('isActive')).toBe(false)
    expect(platformAdvButton?.classList.contains('isActive')).toBe(true)
    expect(platformXrButton?.classList.contains('isActive')).toBe(false)
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )

    await act(async () => {
      platformXrButton?.click()
    })

    expect(platformAdvButton?.classList.contains('isActive')).toBe(true)
    expect(platformXrButton?.classList.contains('isActive')).toBe(true)
    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Shoe 1',
    )

    await act(async () => {
      switchSelectionModeButton?.click()
    })

    expect(addSelectionModeButton?.classList.contains('isActive')).toBe(false)
    expect(switchSelectionModeButton?.classList.contains('isActive')).toBe(true)

    await act(async () => {
      platformGtButton?.click()
    })

    expect(platformAdvButton?.classList.contains('isActive')).toBe(false)
    expect(platformXrButton?.classList.contains('isActive')).toBe(false)
    expect(platformGtButton?.classList.contains('isActive')).toBe(true)

    await act(async () => {
      platformGtButton?.click()
    })

    expect(platformGtButton?.classList.contains('isActive')).toBe(false)
    expect(platformAllButton?.classList.contains('isActive')).toBe(false)

    await act(async () => {
      platformAllButton?.click()
    })

    expect(platformAllButton?.classList.contains('isActive')).toBe(true)
    expect(platformAdvButton?.classList.contains('isActive')).toBe(false)
    expect(platformXrButton?.classList.contains('isActive')).toBe(false)

    await act(async () => {
      partAllButton?.click()
    })

    const shoeCard = Array.from(currentContainer.querySelectorAll('.CatalogShellCard')).find((element) =>
      element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard?.querySelector('.CatalogShellCardMeta')?.textContent).toContain('Part facet -')
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )

    const shoesFilterButton = getSectionButton(partSectionButtons, 'Shoes')
    expect(shoesFilterButton).toBeDefined()

    await act(async () => {
      shoesFilterButton?.click()
    })

    const shoesGridCards = Array.from(
      currentContainer.querySelectorAll('[data-catalog-region="grid"] .CatalogShellCard'),
    )
    expect(shoesGridCards.length).toBe(4)
    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Shoe 1',
    )
    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).not.toContain(
      'Large Foothook',
    )

    await setSearchText(railSearchInput, 'Shoe')
    expect(railSearchInput?.value).toBe('Shoe')

    await act(async () => {
      clearFacetedFiltersButton?.click()
    })

    expect(partAllButton?.classList.contains('isActive')).toBe(true)
    expect(platformAllButton?.classList.contains('isActive')).toBe(true)
    expect(shoesFilterButton?.classList.contains('isActive')).toBe(false)
    expect(railSearchInput?.value).toBe('')
    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Large Foothook',
    )

    await act(async () => {
      platformAllButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"] [data-catalog-region="filter-groups"]')).toBeNull()
    const platformShoeCard = Array.from(currentContainer.querySelectorAll('.CatalogShellCard')).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(platformShoeCard?.querySelector('.CatalogShellCardMeta')?.textContent).toContain(
      'Platform facet -',
    )
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )

    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Shoe 1',
    )

    await act(async () => {
      partAllButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )

    await act(async () => {
      partSectionResizeHandle?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientY: 100 }),
      )
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 140 }))
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(partSectionResizeHandle?.getAttribute('aria-valuenow')).toBe('210')
    expect(partSectionList?.style.getPropertyValue('--catalog-browse-section-height')).toBe('210px')

    await act(async () => {
      partSectionResizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }),
      )
    })

    expect(partSectionResizeHandle?.getAttribute('aria-valuenow')).toBe('198')
    expect(partSectionList?.style.getPropertyValue('--catalog-browse-section-height')).toBe('198px')

    await act(async () => {
      platformDisclosureButton?.click()
    })

    expect(platformDisclosureButton?.getAttribute('aria-expanded')).toBe('false')
    expect(currentContainer.querySelector('[data-catalog-region="platform-section-list"]')).toBeNull()
    expect(
      currentContainer.querySelector('[data-catalog-region="platform-section-resize-handle"]'),
    ).toBeNull()
  })

  it('lets the browse rail resize from the divider by drag and keyboard input', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-browse-rail-resize'))
    const currentContainer = container as HTMLDivElement
    const shell = currentContainer.querySelector('.CatalogShell') as HTMLDivElement | null
    const resizeHandle = currentContainer.querySelector(
      '[data-catalog-region="browse-rail-resize-handle"]',
    ) as HTMLDivElement | null

    expect(shell).not.toBeNull()
    expect(resizeHandle).not.toBeNull()
    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('240')
    expect(shell?.style.getPropertyValue('--catalog-browse-rail-width')).toBe('240px')

    await act(async () => {
      resizeHandle?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 240 }))
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 312 }))
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('312')
    expect(shell?.style.getPropertyValue('--catalog-browse-rail-width')).toBe('312px')

    await act(async () => {
      resizeHandle?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }))
    })

    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('296')
    expect(shell?.style.getPropertyValue('--catalog-browse-rail-width')).toBe('296px')

    await act(async () => {
      resizeHandle?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }))
    })

    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('184')
    expect(shell?.style.getPropertyValue('--catalog-browse-rail-width')).toBe('184px')
  })

  it('navigates Catalog-local item pages and Catalog Info with Back and Forward controls', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-navigation-item-info'))
    const currentContainer = container as HTMLDivElement
    const backButton = getCatalogActionButton(currentContainer, 'catalog-back')
    const forwardButton = getCatalogActionButton(currentContainer, 'catalog-forward')
    const catalogInfoButton = getCatalogActionButton(currentContainer, 'catalog-info')

    expect(backButton?.disabled).toBe(true)
    expect(forwardButton?.disabled).toBe(true)
    expect(backButton?.getAttribute('aria-label')).toBe('Back in Catalog')
    expect(forwardButton?.getAttribute('aria-label')).toBe('Forward in Catalog')

    await act(async () => {
      getCatalogCardActionButton(getCatalogCard(currentContainer, 'Shoe 1'), 'open-item-page')?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Item Page',
    )
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Shoe 1',
    )
    expect(backButton?.disabled).toBe(false)
    expect(forwardButton?.disabled).toBe(true)

    await act(async () => {
      backButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )
    expect(forwardButton?.disabled).toBe(false)

    await act(async () => {
      forwardButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Item Page',
    )
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Shoe 1',
    )

    await act(async () => {
      backButton?.click()
    })
    await act(async () => {
      catalogInfoButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="catalog-info-page"]')).not.toBeNull()
    expect(forwardButton?.disabled).toBe(true)

    await act(async () => {
      backButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="catalog-info-page"]')).toBeNull()
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )

    await act(async () => {
      forwardButton?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="catalog-info-page"]')).not.toBeNull()
  })

  it('restores Catalog filter, search, selection mode, selected cards, and clear-all states', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-navigation-filters'))
    const currentContainer = container as HTMLDivElement
    const backButton = getCatalogActionButton(currentContainer, 'catalog-back')
    const forwardButton = getCatalogActionButton(currentContainer, 'catalog-forward')
    const searchInput = currentContainer.querySelector(
      '[data-catalog-region="filters"] input[type="search"]',
    ) as HTMLInputElement | null

    await setSearchText(searchInput, 'Shoe 1')
    expect(searchInput?.value).toBe('Shoe 1')
    expect(backButton?.disabled).toBe(true)

    await act(async () => {
      getCatalogActionButton(currentContainer, 'catalog-info')?.click()
    })
    await act(async () => {
      backButton?.click()
    })

    expect(searchInput?.value).toBe('Shoe 1')
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )

    await setSearchText(searchInput, '')
    const platformXrButton = getCatalogFilterButton(
      currentContainer,
      'platform-section-list',
      'XR',
    )
    await act(async () => {
      platformXrButton?.click()
    })
    expect(platformXrButton?.classList.contains('isActive')).toBe(true)

    await act(async () => {
      backButton?.click()
    })
    expect(platformXrButton?.classList.contains('isActive')).toBe(false)

    await act(async () => {
      forwardButton?.click()
    })
    expect(platformXrButton?.classList.contains('isActive')).toBe(true)

    const sourceParaHookButton = getCatalogFilterButton(
      currentContainer,
      'source-filter-list',
      'ParaHook',
    )
    await act(async () => {
      sourceParaHookButton?.click()
    })
    expect(sourceParaHookButton?.classList.contains('isActive')).toBe(true)

    await act(async () => {
      getCatalogActionButton(currentContainer, 'clear-faceted-filters')?.click()
    })
    expect(sourceParaHookButton?.classList.contains('isActive')).toBe(false)
    expect(platformXrButton?.classList.contains('isActive')).toBe(false)

    await act(async () => {
      backButton?.click()
    })
    expect(sourceParaHookButton?.classList.contains('isActive')).toBe(true)
    expect(platformXrButton?.classList.contains('isActive')).toBe(true)

    await act(async () => {
      getCatalogActionButton(currentContainer, 'clear-faceted-filters')?.click()
    })

    await act(async () => {
      getCatalogCard(currentContainer, 'Shoe 1')?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }),
      )
    })
    expect(getCatalogCard(currentContainer, 'Shoe 1')?.classList.contains('isSelected')).toBe(true)

    await act(async () => {
      getCatalogActionButton(currentContainer, 'facet-selection-mode-switch')?.click()
    })
    expect(
      getCatalogActionButton(currentContainer, 'facet-selection-mode-switch')?.classList.contains(
        'isActive',
      ),
    ).toBe(true)

    await act(async () => {
      backButton?.click()
    })
    expect(getCatalogCard(currentContainer, 'Shoe 1')?.classList.contains('isSelected')).toBe(true)
    expect(
      getCatalogActionButton(currentContainer, 'facet-selection-mode-add')?.classList.contains(
        'isActive',
      ),
    ).toBe(true)

    await act(async () => {
      forwardButton?.click()
    })
    expect(
      getCatalogActionButton(currentContainer, 'facet-selection-mode-switch')?.classList.contains(
        'isActive',
      ),
    ).toBe(true)
  })

  it('returns safely to the grid when a restored item page target is pruned', async () => {
    ;({ container, root } = renderCatalogShellWithRemovableImport('catalog-shell-navigation-pruned-item'))
    const currentContainer = container as HTMLDivElement

    await act(async () => {
      getCatalogCardActionButton(
        getCatalogCard(currentContainer, 'Imported Reference 1'),
        'open-item-page',
      )?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Imported Reference 1',
    )

    await act(async () => {
      currentContainer
        .querySelector<HTMLButtonElement>('[data-test-action="remove-imported-reference"]')
        ?.click()
    })

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Catalog Results',
    )
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).not.toContain(
      'Imported Reference 1',
    )
  })

  it('opens Catalog Info from the title bar and keeps source utility sections out of the browse rail', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-info-page'))
    const currentContainer = container as HTMLDivElement
    const filtersRegion = currentContainer.querySelector(
      '[data-catalog-region="filters"]',
    ) as HTMLElement | null
    const contentRegion = currentContainer.querySelector(
      '[data-catalog-region="content"]',
    ) as HTMLElement | null
    const catalogInfoButton = currentContainer.querySelector(
      '[data-catalog-action-kind="catalog-info"]',
    ) as HTMLButtonElement | null

    expect(filtersRegion).not.toBeNull()
    expect(contentRegion).not.toBeNull()
    expect(catalogInfoButton).not.toBeNull()
    expect(catalogInfoButton?.textContent).toBe('Catalog Info')
    expect(filtersRegion?.querySelector('[data-catalog-region="pubparts-staged-sources"]')).toBeNull()
    expect(filtersRegion?.querySelector('[data-catalog-region="pubparts-local-downloads"]')).toBeNull()
    expect(contentRegion?.querySelector('[data-catalog-region="pubparts-staged-sources"]')).toBeNull()
    expect(contentRegion?.querySelector('[data-catalog-region="pubparts-local-downloads"]')).toBeNull()

    await act(async () => {
      catalogInfoButton?.click()
    })

    expect(catalogInfoButton?.textContent).toBe('Back to Catalog')
    expect(contentRegion?.textContent).toContain('Source Status')
    expect(contentRegion?.querySelector('[data-catalog-region="catalog-info-page"]')).not.toBeNull()
    expect(contentRegion?.querySelector('[data-catalog-region="pubparts-staged-sources"]')).not.toBeNull()
    expect(contentRegion?.querySelector('[data-catalog-region="pubparts-local-downloads"]')).not.toBeNull()
    expect(contentRegion?.querySelector('input[type="search"]')).toBeNull()
    expect(contentRegion?.textContent).toContain('No staged PubParts source links yet.')
    expect(contentRegion?.textContent).toContain('Local Library mirror: not-configured')
  })

  it('limits the batch action to filtered displayed preview-capable cards', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-grid-batch-preview-filtered'))

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement | null
    expect(searchInput).not.toBeNull()

    await setSearchText(searchInput, 'Shoe 1')

    const loadDisplayedPreviewsButton = container.querySelector(
      '[data-catalog-action-kind="load-displayed-previews"]',
    ) as HTMLButtonElement | null
    expect(loadDisplayedPreviewsButton).not.toBeNull()
    expect(loadDisplayedPreviewsButton?.disabled).toBe(false)

    await act(async () => {
      loadDisplayedPreviewsButton?.click()
    })

    const previewSessionRegion = container.querySelector(
      '[data-catalog-region="preview-session"]',
    ) as HTMLDivElement | null
    expect(previewSessionRegion?.textContent).toContain('1 temporary preview item')
    expect(previewSessionRegion?.textContent).toContain('Shoe 1')
    expect(previewSessionRegion?.textContent).not.toContain('Large Foothook')
    expect(previewSessionRegion?.textContent).not.toContain('Imported Reference 1')
  })
})
