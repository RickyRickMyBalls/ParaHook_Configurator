import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { EnvironmentSourceSettings } from '../../../shared/viewSettingsTypes'
import type { CatalogItemRecord } from '../catalogItemContract'
import type { CatalogSourceSnapshot } from '../catalogSource'
import type {
  PubPartsLocalSourceRecord,
  PubPartsStagedSourceRecord,
} from '../pubPartsDownloadsStorage'
import type { PubPartsLocalLibraryMirrorRead } from '../pubPartsLocalLibraryMirror'
import {
  loadCatalogPreviewItems,
  resolveCatalogDisplayedPreviewLoadTargetItemIds,
  resolveCatalogPreviewTargetItemIds,
  type CatalogPreviewSessionState,
} from '../catalogPreviewSession'
import { resolveCatalogActionPlan } from '../catalogActionPlan'
import { CatalogShellBrowseRail } from './CatalogShellBrowseRail'
import { CatalogShellGridMode } from './CatalogShellGridMode'
import { CatalogShellInfoPage } from './CatalogShellInfoPage'
import { CatalogShellItemPage } from './CatalogShellItemPage'
import {
  buildCatalogFilterGroups,
  buildCatalogSectionOptions,
  commitCatalogNavigationSnapshot,
  createCatalogNavigationHistory,
  pruneCatalogFacetSelections,
  pruneCatalogFilterSelections,
  resetCatalogFilterSelection,
  resolveCatalogSelectedFilterCount,
  stepCatalogNavigationHistory,
  type CatalogBrowseMode,
  type CatalogFilterContext,
  type CatalogFacetSelectionMode,
  type CatalogFacetSelections,
  type CatalogContentMode,
  type CatalogFilterGroup,
  type CatalogNavigationSnapshot,
  type CatalogSelectedFilters,
  getCatalogVisibleItems,
  resolveCatalogResultsSummary,
  resolveCatalogSearchPlaceholder,
  toggleCatalogFacetSelection,
  toggleCatalogFilterSelection,
  type CatalogPubPartsDropboxChooserStatus,
} from './catalogShellShared'

type CatalogShellProps = {
  snapshot: CatalogSourceSnapshot
  previewLoadedItemIds: string[]
  onPreviewSessionChange: (
    nextState:
      | CatalogPreviewSessionState
      | ((currentState: CatalogPreviewSessionState) => CatalogPreviewSessionState),
  ) => void
  onAddItemToProject: (item: CatalogItemRecord) => void
  onStageExternalSourceLink: (item: CatalogItemRecord) => void
  onInspectStagedSource: (stagedSourceId: string) => void
  onSelectSupportedFileCandidate: (stagedSourceId: string) => void
  onPreparePubPartsLocalSource?: (item: CatalogItemRecord) => void
  onAddPubPartsDropboxFileToProject?: (item: CatalogItemRecord) => void
  onImportDownloadedPubPartsFiles: (
    item: CatalogItemRecord,
    stagedRecord: PubPartsStagedSourceRecord,
  ) => void
  pubPartsStagedSourceRecords: PubPartsStagedSourceRecord[]
  pubPartsStagedSourcesByCatalogItemId: Map<string, PubPartsStagedSourceRecord>
  pubPartsLocalSourceRecords?: PubPartsLocalSourceRecord[]
  pubPartsLocalSourcesByCatalogItemId?: Map<string, PubPartsLocalSourceRecord>
  pubPartsDropboxChooserStatusByCatalogItemId?: Map<string, CatalogPubPartsDropboxChooserStatus>
  pubPartsLocalLibraryMirrorRead: PubPartsLocalLibraryMirrorRead
  onApplyEnvironment: (item: CatalogItemRecord) => void
  onBrowseLocalEnvironment: (file: File) => void
  appliedEnvironmentSource: EnvironmentSourceSettings
  onSetHdriBackgroundVisible: (visible: boolean) => void
  onSetHdriIntensity: (intensity: number) => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
  onClearPubPartsStagedSource: (stagedSourceId: string) => void
  onClearAllPubPartsStagedSources: () => void
}

const CATALOG_BROWSE_RAIL_MIN_WIDTH = 184
const CATALOG_BROWSE_RAIL_DEFAULT_WIDTH = 240
const CATALOG_BROWSE_RAIL_MAX_WIDTH = 420
const CATALOG_BROWSE_RAIL_KEYBOARD_STEP = 16
const CATALOG_DEFAULT_FACET_SELECTIONS: CatalogFacetSelections = {
  platform: ['all'],
  part: ['all'],
}

function clampCatalogBrowseRailWidth(width: number): number {
  return Math.min(
    CATALOG_BROWSE_RAIL_MAX_WIDTH,
    Math.max(CATALOG_BROWSE_RAIL_MIN_WIDTH, width),
  )
}

function resolveCatalogShellActiveSection(
  facetSelections: CatalogFacetSelections,
  browseMode: CatalogBrowseMode,
): string {
  const selectedSectionKeys = facetSelections[browseMode] ?? []
  const concreteSelectedSectionKeys = selectedSectionKeys.filter(
    (sectionKey) => sectionKey !== 'all',
  )

  return concreteSelectedSectionKeys.length === 1 ? concreteSelectedSectionKeys[0] : 'all'
}

export function CatalogShell(props: CatalogShellProps) {
  const {
    snapshot,
    previewLoadedItemIds,
    onPreviewSessionChange,
    onAddItemToProject,
    onStageExternalSourceLink,
    onInspectStagedSource,
    onSelectSupportedFileCandidate,
    onPreparePubPartsLocalSource = () => {},
    onAddPubPartsDropboxFileToProject = () => {},
    onImportDownloadedPubPartsFiles,
    pubPartsStagedSourceRecords,
    pubPartsStagedSourcesByCatalogItemId,
    pubPartsLocalSourceRecords = [],
    pubPartsLocalSourcesByCatalogItemId = new Map<string, PubPartsLocalSourceRecord>(),
    pubPartsDropboxChooserStatusByCatalogItemId = new Map<string, CatalogPubPartsDropboxChooserStatus>(),
    pubPartsLocalLibraryMirrorRead,
    onApplyEnvironment,
    onBrowseLocalEnvironment,
    appliedEnvironmentSource,
    onSetHdriBackgroundVisible,
    onSetHdriIntensity,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
    onClearPubPartsStagedSource,
    onClearAllPubPartsStagedSources,
  } = props
  const [browseMode, setBrowseMode] = useState<CatalogBrowseMode>('part')
  const partSectionOptions = buildCatalogSectionOptions(snapshot, 'part')
  const platformSectionOptions = buildCatalogSectionOptions(snapshot, 'platform')
  const [facetSelections, setFacetSelections] =
    useState<CatalogFacetSelections>(CATALOG_DEFAULT_FACET_SELECTIONS)
  const [facetSelectionMode, setFacetSelectionMode] =
    useState<CatalogFacetSelectionMode>('add')
  const activeSection = resolveCatalogShellActiveSection(facetSelections, browseMode)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [contentMode, setContentMode] = useState<CatalogContentMode>('grid')
  const [searchText, setSearchText] = useState<string>('')
  const [selectedFilters, setSelectedFilters] = useState<CatalogSelectedFilters>({})
  const [catalogNavigationHistory, setCatalogNavigationHistory] = useState(() =>
    createCatalogNavigationHistory({
      contentMode: 'grid',
      selectedItemId: null,
      selectedItemIds: [],
      browseMode: 'part',
      facetSelections: CATALOG_DEFAULT_FACET_SELECTIONS,
      facetSelectionMode: 'add',
      searchText: '',
      selectedFilters: {},
    }),
  )
  const [browseRailWidth, setBrowseRailWidth] = useState(CATALOG_BROWSE_RAIL_DEFAULT_WIDTH)
  const [isBrowseRailResizing, setIsBrowseRailResizing] = useState(false)
  const browseRailResizeStartClientXRef = useRef(0)
  const browseRailResizeStartWidthRef = useRef(CATALOG_BROWSE_RAIL_DEFAULT_WIDTH)
  const catalogFilterContext: CatalogFilterContext = {
    previewLoadedItemIds,
    pubPartsStagedSourcesByCatalogItemId,
    pubPartsLocalSourcesByCatalogItemId,
  }

  useEffect(() => {
    setFacetSelections((currentSelections) => {
      const nextSelections = pruneCatalogFacetSelections(currentSelections, {
        part: partSectionOptions,
        platform: platformSectionOptions,
      })

      if (nextSelections !== currentSelections) {
        setCatalogNavigationHistory((currentHistory) => {
          const currentSnapshot = currentHistory.entries[currentHistory.activeIndex]
          return currentSnapshot === undefined
            ? currentHistory
            : commitCatalogNavigationSnapshot(
                currentHistory,
                { ...currentSnapshot, facetSelections: nextSelections },
                'replace',
              )
        })
      }

      return nextSelections
    })
  }, [partSectionOptions, platformSectionOptions])

  useEffect(() => {
    const availableItemIds = new Set(snapshot.allItems.map((item) => item.itemId))
    setSelectedItemIds((currentSelectedItemIds) =>
      currentSelectedItemIds.filter((itemId) => availableItemIds.has(itemId)),
    )

    if (selectedItemId !== null && !availableItemIds.has(selectedItemId)) {
      setSelectedItemId(null)
      setContentMode('grid')
      setCatalogNavigationHistory((currentHistory) => {
        const currentSnapshot = currentHistory.entries[currentHistory.activeIndex]
        return currentSnapshot === undefined
          ? currentHistory
          : commitCatalogNavigationSnapshot(
              currentHistory,
              {
                ...currentSnapshot,
                contentMode: 'grid',
                selectedItemId: null,
                selectedItemIds: currentSnapshot.selectedItemIds.filter((itemId) =>
                  availableItemIds.has(itemId),
                ),
              },
              'replace',
            )
      })
    }
  }, [selectedItemId, snapshot.allItems])

  const visibleItems = getCatalogVisibleItems(
    snapshot,
    facetSelections,
    searchText,
    selectedFilters,
    browseMode,
    catalogFilterContext,
  )
  const availableFilterGroups = buildCatalogFilterGroups(
    snapshot,
    facetSelections,
    searchText,
    browseMode,
    catalogFilterContext,
  )
  const selectedItem = snapshot.allItems.find((item) => item.itemId === selectedItemId) ?? null
  const selectedItemStagedSourceRecord =
    selectedItem === null
      ? null
      : pubPartsStagedSourcesByCatalogItemId.get(selectedItem.itemId) ?? null
  const selectedItemLocalSourceRecord =
    selectedItem === null
      ? null
      : pubPartsLocalSourcesByCatalogItemId.get(selectedItem.itemId) ?? null
  const selectedItemDropboxChooserStatus =
    selectedItem === null
      ? null
      : pubPartsDropboxChooserStatusByCatalogItemId.get(selectedItem.itemId) ?? null
  const isItemPageVisible = contentMode === 'item-page' && selectedItem !== null
  const isCatalogInfoVisible = contentMode === 'catalog-info'
  const displayedPreviewLoadableItemIds = resolveCatalogDisplayedPreviewLoadTargetItemIds(
    visibleItems,
  )
  const previewLoadedItems = previewLoadedItemIds
    .map((itemId) => snapshot.allItems.find((item) => item.itemId === itemId) ?? null)
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const createCurrentCatalogNavigationSnapshot = (
    overrides: Partial<CatalogNavigationSnapshot> = {},
  ): CatalogNavigationSnapshot => ({
    contentMode,
    selectedItemId,
    selectedItemIds,
    browseMode,
    facetSelections,
    facetSelectionMode,
    searchText,
    selectedFilters,
    ...overrides,
  })

  const resolveCatalogNavigationSnapshotForCurrentItems = (
    navigationSnapshot: CatalogNavigationSnapshot,
  ): CatalogNavigationSnapshot => {
    const availableItemIds = new Set(snapshot.allItems.map((item) => item.itemId))
    const nextSelectedItemIds = navigationSnapshot.selectedItemIds.filter((itemId) =>
      availableItemIds.has(itemId),
    )
    const nextSelectedItemId =
      navigationSnapshot.selectedItemId !== null &&
      availableItemIds.has(navigationSnapshot.selectedItemId)
        ? navigationSnapshot.selectedItemId
        : null

    return {
      ...navigationSnapshot,
      contentMode:
        navigationSnapshot.contentMode === 'item-page' && nextSelectedItemId === null
          ? 'grid'
          : navigationSnapshot.contentMode,
      selectedItemId: nextSelectedItemId,
      selectedItemIds: nextSelectedItemIds,
    }
  }

  const applyCatalogNavigationSnapshot = (navigationSnapshot: CatalogNavigationSnapshot) => {
    const resolvedSnapshot = resolveCatalogNavigationSnapshotForCurrentItems(navigationSnapshot)

    setContentMode(resolvedSnapshot.contentMode)
    setSelectedItemId(resolvedSnapshot.selectedItemId)
    setSelectedItemIds([...resolvedSnapshot.selectedItemIds])
    setBrowseMode(resolvedSnapshot.browseMode)
    setFacetSelections({
      platform: [...resolvedSnapshot.facetSelections.platform],
      part: [...resolvedSnapshot.facetSelections.part],
    })
    setFacetSelectionMode(resolvedSnapshot.facetSelectionMode)
    setSearchText(resolvedSnapshot.searchText)
    setSelectedFilters(
      Object.fromEntries(
        Object.entries(resolvedSnapshot.selectedFilters).map(([groupKey, selectedValues]) => [
          groupKey,
          [...(selectedValues ?? [])],
        ]),
      ) as CatalogSelectedFilters,
    )
  }

  const commitCatalogNavigation = (
    navigationSnapshot: CatalogNavigationSnapshot,
    mode: 'push' | 'replace' = 'push',
  ) => {
    const resolvedSnapshot = resolveCatalogNavigationSnapshotForCurrentItems(navigationSnapshot)
    setCatalogNavigationHistory((currentHistory) =>
      commitCatalogNavigationSnapshot(currentHistory, resolvedSnapshot, mode),
    )
    applyCatalogNavigationSnapshot(resolvedSnapshot)
  }

  useEffect(() => {
    setSelectedFilters((currentSelectedFilters) => {
      const nextSelectedFilters = pruneCatalogFilterSelections(
        currentSelectedFilters,
        availableFilterGroups,
      )

      if (nextSelectedFilters !== currentSelectedFilters) {
        setCatalogNavigationHistory((currentHistory) => {
          const currentSnapshot = currentHistory.entries[currentHistory.activeIndex]
          return currentSnapshot === undefined
            ? currentHistory
            : commitCatalogNavigationSnapshot(
                currentHistory,
                { ...currentSnapshot, selectedFilters: nextSelectedFilters },
                'replace',
              )
        })
      }

      return nextSelectedFilters
    })
  }, [availableFilterGroups])

  useEffect(() => {
    if (!isBrowseRailResizing) {
      return undefined
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const dragOffset = event.clientX - browseRailResizeStartClientXRef.current
      setBrowseRailWidth(
        clampCatalogBrowseRailWidth(browseRailResizeStartWidthRef.current + dragOffset),
      )
    }

    const handleMouseUp = () => {
      setIsBrowseRailResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add('CatalogShellIsResizing')

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('CatalogShellIsResizing')
    }
  }, [isBrowseRailResizing])

  const handleFacetSelectionChange = (nextBrowseMode: CatalogBrowseMode, sectionKey: string) => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        browseMode: nextBrowseMode,
        facetSelections: toggleCatalogFacetSelection(
          facetSelections,
          nextBrowseMode,
          sectionKey,
          facetSelectionMode,
        ),
        contentMode: 'grid',
        selectedFilters: {},
      }),
    )
  }

  const handleFacetSelectionModeChange = (nextSelectionMode: CatalogFacetSelectionMode) => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        facetSelectionMode: nextSelectionMode,
      }),
    )
  }

  const handleSearchTextChange = (nextSearchText: string) => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        searchText: nextSearchText,
      }),
      'replace',
    )
  }

  const handleClearFacetedFilters = () => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        facetSelections: {
          platform: ['all'],
          part: ['all'],
        },
        contentMode: 'grid',
        searchText: '',
        selectedFilters: {},
      }),
    )
  }

  const handleFilterToggle = (groupKey: CatalogFilterGroup['groupKey'], value: string) => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        selectedFilters: toggleCatalogFilterSelection(
          selectedFilters,
          groupKey,
          value,
          facetSelectionMode,
        ),
      }),
    )
  }

  const handleFilterReset = (groupKey: CatalogFilterGroup['groupKey']) => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        selectedFilters: resetCatalogFilterSelection(selectedFilters, groupKey),
      }),
    )
  }

  const handleOpenItemPage = (itemId: string) => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        selectedItemId: itemId,
        selectedItemIds: selectedItemIds.includes(itemId) ? selectedItemIds : [itemId],
        contentMode: 'item-page',
      }),
    )
  }

  const handleToggleItemSelection = (itemId: string) => {
    const wasSelected = selectedItemIds.includes(itemId)
    const nextSelectedItemIds = wasSelected
      ? selectedItemIds.filter((candidateItemId) => candidateItemId !== itemId)
      : [...selectedItemIds, itemId]
    const nextSelectedItemId = wasSelected
      ? selectedItemId === itemId
        ? nextSelectedItemIds[0] ?? null
        : selectedItemId
      : itemId

    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        selectedItemId: nextSelectedItemId,
        selectedItemIds: nextSelectedItemIds,
        contentMode:
          contentMode === 'item-page' && nextSelectedItemId === null ? 'grid' : contentMode,
      }),
    )
  }

  const handleLoadPreviewForItem = (itemId: string) => {
    const item = snapshot.allItems.find((candidateItem) => candidateItem.itemId === itemId) ?? null
    if (item === null || !resolveCatalogActionPlan(item).allowsTemporaryPreview) {
      return
    }

    const targetItemIds = resolveCatalogPreviewTargetItemIds(itemId, selectedItemIds).filter(
      (candidateItemId) => {
        const candidateItem =
          snapshot.allItems.find((snapshotItem) => snapshotItem.itemId === candidateItemId) ?? null
        return candidateItem !== null && resolveCatalogActionPlan(candidateItem).allowsTemporaryPreview
      },
    )
    onPreviewSessionChange((currentPreviewSession) =>
      loadCatalogPreviewItems(currentPreviewSession, targetItemIds),
    )
  }

  const handleLoadDisplayedPreviewItems = () => {
    onPreviewSessionChange((currentPreviewSession) =>
      loadCatalogPreviewItems(currentPreviewSession, displayedPreviewLoadableItemIds),
    )
  }

  const handleCatalogInfoToggle = () => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        contentMode: contentMode === 'catalog-info' ? 'grid' : 'catalog-info',
      }),
    )
  }

  const handleBackToCatalogGrid = () => {
    commitCatalogNavigation(
      createCurrentCatalogNavigationSnapshot({
        contentMode: 'grid',
      }),
    )
  }

  const handleCatalogNavigationStep = (direction: 'back' | 'forward') => {
    const navigationStep = stepCatalogNavigationHistory(catalogNavigationHistory, direction)
    if (navigationStep === null) {
      return
    }

    setCatalogNavigationHistory(navigationStep.history)
    applyCatalogNavigationSnapshot(navigationStep.snapshot)
  }

  const handleBrowseRailResizeStart = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    browseRailResizeStartClientXRef.current = event.clientX
    browseRailResizeStartWidthRef.current = browseRailWidth
    setIsBrowseRailResizing(true)
  }

  const handleBrowseRailResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setBrowseRailWidth((currentWidth) => {
      if (event.key === 'Home') {
        return CATALOG_BROWSE_RAIL_MIN_WIDTH
      }

      if (event.key === 'End') {
        return CATALOG_BROWSE_RAIL_MAX_WIDTH
      }

      const direction = event.key === 'ArrowLeft' ? -1 : 1
      return clampCatalogBrowseRailWidth(
        currentWidth + direction * CATALOG_BROWSE_RAIL_KEYBOARD_STEP,
      )
    })
  }

  const catalogShellStyle = {
    '--catalog-browse-rail-width': `${browseRailWidth}px`,
  } as CSSProperties
  const contentEyebrow = isCatalogInfoVisible
    ? 'Catalog Info'
    : isItemPageVisible
      ? 'Item Page'
      : 'Catalog Filters'
  const contentTitle = isCatalogInfoVisible
    ? 'Source Status'
    : isItemPageVisible
      ? selectedItem.label
      : 'Catalog Results'
  const canNavigateCatalogBack = catalogNavigationHistory.activeIndex > 0
  const canNavigateCatalogForward =
    catalogNavigationHistory.activeIndex < catalogNavigationHistory.entries.length - 1

  return (
    <div
      className={`CatalogShell ${isBrowseRailResizing ? 'isResizingBrowseRail' : ''}`}
      data-catalog-layout="owned-scroll"
      style={catalogShellStyle}
    >
      <CatalogShellBrowseRail
        facetSelections={facetSelections}
        facetSelectionMode={facetSelectionMode}
        previewLoadedItems={previewLoadedItems}
        totalItemCount={snapshot.allItems.length}
        searchText={searchText}
        searchPlaceholder={resolveCatalogSearchPlaceholder(activeSection, browseMode)}
        resultsSummary={resolveCatalogResultsSummary(
          visibleItems.length,
          activeSection,
          resolveCatalogSelectedFilterCount(selectedFilters),
          searchText,
          browseMode,
        )}
        partSectionOptions={partSectionOptions}
        platformSectionOptions={platformSectionOptions}
        filterGroups={availableFilterGroups}
        selectedFilters={selectedFilters}
        onSearchTextChange={handleSearchTextChange}
        onFacetSelectionChange={handleFacetSelectionChange}
        onFacetSelectionModeChange={handleFacetSelectionModeChange}
        onFilterToggle={handleFilterToggle}
        onFilterReset={handleFilterReset}
        onClearFacetedFilters={handleClearFacetedFilters}
        onUnloadAllPreviewItems={onUnloadAllPreviewItems}
        onUnloadPreviewItem={onUnloadPreviewItem}
      />

      <div
        className="CatalogShellColumnResizeHandle"
        role="separator"
        aria-label="Resize Catalog browse rail"
        aria-orientation="vertical"
        aria-valuemin={CATALOG_BROWSE_RAIL_MIN_WIDTH}
        aria-valuemax={CATALOG_BROWSE_RAIL_MAX_WIDTH}
        aria-valuenow={browseRailWidth}
        tabIndex={0}
        data-catalog-region="browse-rail-resize-handle"
        onMouseDown={handleBrowseRailResizeStart}
        onKeyDown={handleBrowseRailResizeKeyDown}
      />

      <section className="CatalogShellRegion CatalogShellContent" data-catalog-region="content">
        <div className="CatalogShellRegionHeader CatalogShellContentHeader">
          <div className="CatalogShellContentHeaderTitle">
            <p className="CatalogShellRegionEyebrow">{contentEyebrow}</p>
            <h2>{contentTitle}</h2>
          </div>
          <div className="CatalogShellTitleActions" aria-label="Catalog navigation actions">
            <button
              type="button"
              className="CatalogShellTitleAction CatalogShellTitleAction--icon"
              aria-label="Back in Catalog"
              data-catalog-action-kind="catalog-back"
              disabled={!canNavigateCatalogBack}
              onClick={() => handleCatalogNavigationStep('back')}
            >
              <span aria-hidden="true">{'‹'}</span>
            </button>
            <button
              type="button"
              className="CatalogShellTitleAction CatalogShellTitleAction--icon"
              aria-label="Forward in Catalog"
              data-catalog-action-kind="catalog-forward"
              disabled={!canNavigateCatalogForward}
              onClick={() => handleCatalogNavigationStep('forward')}
            >
              <span aria-hidden="true">{'›'}</span>
            </button>
            <button
              type="button"
              className={`CatalogShellTitleAction ${isCatalogInfoVisible ? 'isActive' : ''}`}
              data-catalog-action-kind="catalog-info"
              onClick={handleCatalogInfoToggle}
            >
              {isCatalogInfoVisible ? 'Back to Catalog' : 'Catalog Info'}
            </button>
          </div>
        </div>
        <div className="CatalogShellContentBody" data-catalog-region="content-body">
          {isCatalogInfoVisible ? (
            <CatalogShellInfoPage
              pubPartsStagedSourceRecords={pubPartsStagedSourceRecords}
              pubPartsLocalSourceRecords={pubPartsLocalSourceRecords}
              pubPartsLocalLibraryMirrorRead={pubPartsLocalLibraryMirrorRead}
              onClearPubPartsStagedSource={onClearPubPartsStagedSource}
              onClearAllPubPartsStagedSources={onClearAllPubPartsStagedSources}
            />
          ) : isItemPageVisible ? (
            <CatalogShellItemPage
              item={selectedItem}
              pubPartsStagedSourceRecord={selectedItemStagedSourceRecord}
              pubPartsLocalSourceRecord={selectedItemLocalSourceRecord}
              pubPartsDropboxChooserStatus={selectedItemDropboxChooserStatus}
              pubPartsLocalLibraryMirrorRead={pubPartsLocalLibraryMirrorRead}
              isPreviewLoaded={previewLoadedItemIds.includes(selectedItem.itemId)}
              previewTargetCount={resolveCatalogPreviewTargetItemIds(
                selectedItem.itemId,
                selectedItemIds,
              ).length}
              onLoadPreview={() => handleLoadPreviewForItem(selectedItem.itemId)}
              onAddToProject={() => onAddItemToProject(selectedItem)}
              onStageExternalSourceLink={() => onStageExternalSourceLink(selectedItem)}
              onInspectStagedSource={() =>
                onInspectStagedSource(`pubparts:${selectedItem.itemId}`)
              }
              onSelectSupportedFileCandidate={() =>
                onSelectSupportedFileCandidate(`pubparts:${selectedItem.itemId}`)
              }
              onPreparePubPartsLocalSource={() => onPreparePubPartsLocalSource(selectedItem)}
              onAddPubPartsDropboxFileToProject={() =>
                onAddPubPartsDropboxFileToProject(selectedItem)
              }
              onImportDownloadedPubPartsFiles={() => {
                if (selectedItemStagedSourceRecord !== null) {
                  onImportDownloadedPubPartsFiles(selectedItem, selectedItemStagedSourceRecord)
                }
              }}
              onApplyEnvironment={() => onApplyEnvironment(selectedItem)}
              onBrowseLocalEnvironment={onBrowseLocalEnvironment}
              appliedEnvironmentSource={appliedEnvironmentSource}
              onSetHdriBackgroundVisible={onSetHdriBackgroundVisible}
              onSetHdriIntensity={onSetHdriIntensity}
              onBackToCatalog={handleBackToCatalogGrid}
            />
          ) : (
            <CatalogShellGridMode
              browseMode={browseMode}
              activeSection={activeSection}
              selectedItemIds={selectedItemIds}
              previewLoadedItemIds={previewLoadedItemIds}
              visibleItems={visibleItems}
              onAddItemToProject={onAddItemToProject}
              onApplyEnvironment={onApplyEnvironment}
              onBrowseLocalEnvironment={onBrowseLocalEnvironment}
              appliedEnvironmentSource={appliedEnvironmentSource}
              onSetHdriBackgroundVisible={onSetHdriBackgroundVisible}
              onSetHdriIntensity={onSetHdriIntensity}
              displayedPreviewLoadableItemCount={displayedPreviewLoadableItemIds.length}
              onLoadDisplayedPreviews={handleLoadDisplayedPreviewItems}
              onLoadPreview={handleLoadPreviewForItem}
              onToggleItemSelection={handleToggleItemSelection}
              onOpenItemPage={handleOpenItemPage}
            />
          )}
        </div>
      </section>
    </div>
  )
}
