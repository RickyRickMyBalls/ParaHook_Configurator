import { useEffect, useState } from 'react'
import type { EnvironmentSourceSettings } from '../../../shared/viewSettingsTypes'
import type { CatalogItemRecord } from '../catalogItemContract'
import type { CatalogSourceSnapshot } from '../catalogSource'
import {
  loadCatalogPreviewItems,
  resolveCatalogDisplayedPreviewLoadTargetItemIds,
  resolveCatalogPreviewTargetItemIds,
  type CatalogPreviewSessionState,
} from '../catalogPreviewSession'
import { resolveCatalogActionPlan } from '../catalogActionPlan'
import { CatalogShellBrowseRail } from './CatalogShellBrowseRail'
import { CatalogShellGridMode } from './CatalogShellGridMode'
import { CatalogShellItemPage } from './CatalogShellItemPage'
import {
  buildCatalogFilterGroups,
  buildCatalogSectionOptions,
  pruneCatalogFilterSelections,
  resolveCatalogSelectedFilterCount,
  type CatalogBrowseMode,
  type CatalogContentMode,
  type CatalogFilterGroup,
  type CatalogSelectedFilters,
  getCatalogVisibleItems,
  resolveCatalogResultsSummary,
  resolveCatalogSearchPlaceholder,
  toggleCatalogFilterSelection,
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
  onApplyEnvironment: (item: CatalogItemRecord) => void
  onBrowseLocalEnvironment: (file: File) => void
  appliedEnvironmentSource: EnvironmentSourceSettings
  onSetHdriBackgroundVisible: (visible: boolean) => void
  onSetHdriIntensity: (intensity: number) => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
}

export function CatalogShell(props: CatalogShellProps) {
  const {
    snapshot,
    previewLoadedItemIds,
    onPreviewSessionChange,
    onAddItemToProject,
    onApplyEnvironment,
    onBrowseLocalEnvironment,
    appliedEnvironmentSource,
    onSetHdriBackgroundVisible,
    onSetHdriIntensity,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
  } = props
  const [browseMode, setBrowseMode] = useState<CatalogBrowseMode>('part')
  const sectionOptions = buildCatalogSectionOptions(snapshot, browseMode)
  const [activeSection, setActiveSection] = useState<string>('all')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [contentMode, setContentMode] = useState<CatalogContentMode>('grid')
  const [searchText, setSearchText] = useState<string>('')
  const [selectedFilters, setSelectedFilters] = useState<CatalogSelectedFilters>({})

  useEffect(() => {
    if (
      activeSection !== 'all' &&
      sectionOptions.every((option) => option.sectionKey !== activeSection)
    ) {
      setActiveSection(sectionOptions[0]?.sectionKey ?? 'all')
    }
  }, [activeSection, sectionOptions])

  useEffect(() => {
    if (
      selectedItemId !== null &&
      snapshot.allItems.every((item) => item.itemId !== selectedItemId)
    ) {
      setSelectedItemId(null)
      setContentMode('grid')
    }
  }, [selectedItemId, snapshot.allItems])

  useEffect(() => {
    setSelectedItemIds((currentSelectedItemIds) =>
      currentSelectedItemIds.filter((itemId) =>
        snapshot.allItems.some((item) => item.itemId === itemId),
      ),
    )
  }, [snapshot.allItems])

  const visibleItems = getCatalogVisibleItems(
    snapshot,
    activeSection,
    searchText,
    selectedFilters,
    browseMode,
  )
  const availableFilterGroups = buildCatalogFilterGroups(
    snapshot,
    activeSection,
    searchText,
    browseMode,
  )
  const selectedItem = snapshot.allItems.find((item) => item.itemId === selectedItemId) ?? null
  const isItemPageVisible = contentMode === 'item-page' && selectedItem !== null
  const displayedPreviewLoadableItemIds = resolveCatalogDisplayedPreviewLoadTargetItemIds(
    visibleItems,
  )
  const previewLoadedItems = previewLoadedItemIds
    .map((itemId) => snapshot.allItems.find((item) => item.itemId === itemId) ?? null)
    .filter((item): item is NonNullable<typeof item> => item !== null)

  useEffect(() => {
    setSelectedFilters((currentSelectedFilters) =>
      pruneCatalogFilterSelections(currentSelectedFilters, availableFilterGroups),
    )
  }, [availableFilterGroups])

  const handleSectionChange = (sectionKey: string) => {
    setActiveSection(sectionKey)
    setContentMode('grid')
    setSelectedFilters({})
  }

  const handleFilterToggle = (groupKey: CatalogFilterGroup['groupKey'], value: string) => {
    setSelectedFilters((currentSelectedFilters) =>
      toggleCatalogFilterSelection(currentSelectedFilters, groupKey, value),
    )
  }

  const handleOpenItemPage = (itemId: string) => {
    setSelectedItemId(itemId)
    setSelectedItemIds((currentSelectedItemIds) =>
      currentSelectedItemIds.includes(itemId) ? currentSelectedItemIds : [itemId],
    )
    setContentMode('item-page')
  }

  const handleToggleItemSelection = (itemId: string) => {
    setSelectedItemIds((currentSelectedItemIds) => {
      if (currentSelectedItemIds.includes(itemId)) {
        const nextSelectedItemIds = currentSelectedItemIds.filter(
          (candidateItemId) => candidateItemId !== itemId,
        )
        if (selectedItemId === itemId) {
          setSelectedItemId(nextSelectedItemIds[0] ?? null)
        }
        return nextSelectedItemIds
      }

      setSelectedItemId(itemId)
      return [...currentSelectedItemIds, itemId]
    })
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

  return (
    <div className="CatalogShell" data-catalog-layout="owned-scroll">
      <CatalogShellBrowseRail
        browseMode={browseMode}
        activeSection={activeSection}
        previewLoadedItems={previewLoadedItems}
        totalItemCount={snapshot.allItems.length}
        sectionOptions={sectionOptions}
        onBrowseModeChange={setBrowseMode}
        onSectionChange={handleSectionChange}
        onUnloadAllPreviewItems={onUnloadAllPreviewItems}
        onUnloadPreviewItem={onUnloadPreviewItem}
      />

      <section className="CatalogShellRegion CatalogShellContent" data-catalog-region="content">
        <div className="CatalogShellRegionHeader">
          <p className="CatalogShellRegionEyebrow">
            {isItemPageVisible
              ? 'Item Page'
              : `${browseMode === 'part' ? 'Part' : 'Platform'} Read`}
          </p>
          <h2>
            {isItemPageVisible
              ? selectedItem.label
              : activeSection === 'imports'
                ? 'Imported Catalog Entries'
                : browseMode === 'part'
                  ? 'Part Catalog Cards'
                  : 'Platform Catalog Cards'}
          </h2>
        </div>
        <div className="CatalogShellContentBody" data-catalog-region="content-body">
          {!isItemPageVisible ? (
            <div className="CatalogShellSearchPanel" data-catalog-region="search-panel">
              <label className="CatalogShellSearchField">
                <span className="CatalogShellRegionEyebrow">Search</span>
                <input
                  type="search"
                  value={searchText}
                  placeholder={resolveCatalogSearchPlaceholder(activeSection, browseMode)}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </label>
              <p className="CatalogShellRule">
                {resolveCatalogResultsSummary(
                  visibleItems.length,
                  activeSection,
                  resolveCatalogSelectedFilterCount(selectedFilters),
                  searchText,
                  browseMode,
                )}
              </p>
              {availableFilterGroups.length > 0 ? (
                <div className="CatalogShellFilterGroups" data-catalog-region="filter-groups">
                  {availableFilterGroups.map((group) => {
                    const selectedValues = selectedFilters[group.groupKey] ?? []
                    return (
                      <section
                        key={group.groupKey}
                        className="CatalogShellFilterGroup"
                        data-catalog-filter-group={group.groupKey}
                      >
                        <div className="CatalogShellFilterGroupHeader">
                          <p className="CatalogShellRegionEyebrow">{group.label}</p>
                          <p className="CatalogShellRule">{group.description}</p>
                        </div>
                        <div className="CatalogShellTagFilters">
                          {group.options.map((option) => {
                            const selected = selectedValues.includes(option.value)
                            return (
                              <button
                                key={`${group.groupKey}:${option.value}`}
                                type="button"
                                className={`CatalogShellTag ${selected ? 'isSelected' : ''}`}
                                onClick={() => handleFilterToggle(group.groupKey, option.value)}
                              >
                                {option.value} ({option.count})
                              </button>
                            )
                          })}
                        </div>
                      </section>
                    )
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
          {isItemPageVisible ? (
            <CatalogShellItemPage
              item={selectedItem}
              isPreviewLoaded={previewLoadedItemIds.includes(selectedItem.itemId)}
              previewTargetCount={resolveCatalogPreviewTargetItemIds(
                selectedItem.itemId,
                selectedItemIds,
              ).length}
              onLoadPreview={() => handleLoadPreviewForItem(selectedItem.itemId)}
              onAddToProject={() => onAddItemToProject(selectedItem)}
              onApplyEnvironment={() => onApplyEnvironment(selectedItem)}
              onBrowseLocalEnvironment={onBrowseLocalEnvironment}
              appliedEnvironmentSource={appliedEnvironmentSource}
              onSetHdriBackgroundVisible={onSetHdriBackgroundVisible}
              onSetHdriIntensity={onSetHdriIntensity}
              onBackToCatalog={() => setContentMode('grid')}
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
