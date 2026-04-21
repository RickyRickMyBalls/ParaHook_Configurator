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

  it('switches between Part and Platform reads over the same shared metadata contract', async () => {
    ;({ container, root } = renderCatalogShell('catalog-shell-browse-mode-switch'))
    const currentContainer = container as HTMLDivElement

    const browseModeButtons = Array.from(
      currentContainer.querySelectorAll('[data-catalog-region="browse-mode-switcher"] .CatalogShellTag'),
    ) as HTMLButtonElement[]
    const partButton = browseModeButtons.find((element) => element.textContent === 'Part')
    const platformButton = browseModeButtons.find((element) => element.textContent === 'Platform')
    const getFilterGroupButton = (groupKey: string, value: string) =>
      Array.from(
        currentContainer.querySelectorAll(`[data-catalog-filter-group="${groupKey}"] .CatalogShellTag`),
      ).find(
        (element) => element.textContent?.replace(/\s*\(\d+\)$/u, '').trim() === value,
      ) as HTMLButtonElement | undefined
    const sectionButtonLabels = () =>
      Array.from(currentContainer.querySelectorAll('[data-catalog-region="filters"] .CatalogShellFilterButton'))
        .map((element) => element.textContent?.replace(/\d+$/u, '').trim() ?? '')

    expect(partButton).toBeDefined()
    expect(platformButton).toBeDefined()
    expect(currentContainer.querySelector('[data-catalog-region="browse-mode-description"]')?.textContent)
      .toContain('Part read centers part type')
    expect(currentContainer.querySelector('[data-catalog-region="filter-groups"]')?.textContent).toContain(
      'Part Groups',
    )
    expect(sectionButtonLabels()).toEqual(
      expect.arrayContaining(['All', 'Footpads', 'Shoes', 'FootHolds', 'Hdris', 'Imports']),
    )

    const shoeCard = Array.from(currentContainer.querySelectorAll('.CatalogShellCard')).find((element) =>
      element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(shoeCard?.querySelector('.CatalogShellCardMeta')?.textContent).toContain('Part read -')
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Part Catalog Cards',
    )

    const shoesFilterButton = getFilterGroupButton('partGroups', 'Shoes')
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

    await act(async () => {
      platformButton?.click()
    })

    expect(
      currentContainer.querySelector('[data-catalog-region="browse-mode-description"]')?.textContent,
    ).toContain('Platform read centers system ownership')
    expect(currentContainer.querySelector('[data-catalog-region="filter-groups"]')?.textContent).toContain(
      'Platform Compatibility',
    )
    expect(sectionButtonLabels()).toEqual(
      expect.arrayContaining(['All', 'ADV', 'XR', 'GT', 'Pint', 'XR Classic', 'Hdris', 'Imports']),
    )
    const platformShoeCard = Array.from(currentContainer.querySelectorAll('.CatalogShellCard')).find(
      (element) => element.textContent?.includes('Shoe 1'),
    ) as HTMLElement | undefined
    expect(platformShoeCard?.querySelector('.CatalogShellCardMeta')?.textContent).toContain(
      'Platform read -',
    )
    expect(
      currentContainer
        .querySelector('[data-catalog-filter-group="partGroups"]')
        ?.querySelector('.CatalogShellTag.isSelected')?.textContent,
    ).toContain('Shoes')
    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Platform Catalog Cards',
    )

    const platformGridCards = Array.from(
      currentContainer.querySelectorAll('[data-catalog-region="grid"] .CatalogShellCard'),
    )
    expect(platformGridCards.length).toBe(4)
    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).toContain(
      'Shoe 1',
    )
    expect(currentContainer.querySelector('[data-catalog-region="grid"]')?.textContent).not.toContain(
      'Large Foothook',
    )

    await act(async () => {
      partButton?.click()
    })

    expect(
      currentContainer.querySelector('[data-catalog-region="browse-mode-description"]')?.textContent,
    ).toContain('Part read centers part type')
    expect(sectionButtonLabels()).toEqual(
      expect.arrayContaining(['All', 'Footpads', 'Shoes', 'FootHolds', 'Hdris', 'Imports']),
    )

    expect(currentContainer.querySelector('[data-catalog-region="content"]')?.textContent).toContain(
      'Part Catalog Cards',
    )
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
