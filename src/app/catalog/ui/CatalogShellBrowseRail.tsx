import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import {
  type CatalogBrowseMode,
  type CatalogFacetSelectionMode,
  type CatalogFacetSelections,
  type CatalogFilterGroup,
  type CatalogSelectedFilters,
  type CatalogSectionOption,
  resolveCatalogBrowseModeDescription,
} from './catalogShellShared'

type CatalogShellBrowseRailProps = {
  facetSelections: CatalogFacetSelections
  facetSelectionMode: CatalogFacetSelectionMode
  previewLoadedItems: Array<{
    itemId: string
    label: string
  }>
  totalItemCount: number
  searchText: string
  searchPlaceholder: string
  resultsSummary: string
  partSectionOptions: CatalogSectionOption[]
  platformSectionOptions: CatalogSectionOption[]
  filterGroups: CatalogFilterGroup[]
  selectedFilters: CatalogSelectedFilters
  onSearchTextChange: (searchText: string) => void
  onFacetSelectionChange: (browseMode: CatalogBrowseMode, sectionKey: string) => void
  onFacetSelectionModeChange: (selectionMode: CatalogFacetSelectionMode) => void
  onFilterToggle: (groupKey: CatalogFilterGroup['groupKey'], value: string) => void
  onFilterReset: (groupKey: CatalogFilterGroup['groupKey']) => void
  onClearFacetedFilters: () => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
}

const CATALOG_BROWSE_SECTION_MIN_HEIGHT = 64
const CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT = 170
const CATALOG_BROWSE_SECTION_MAX_HEIGHT = 220
const CATALOG_BROWSE_SECTION_KEYBOARD_STEP = 12
type CatalogRailFacetDisclosureKey =
  | `browse:${CatalogBrowseMode}`
  | `filter:${CatalogFilterGroup['groupKey']}`
type CatalogRailFilterGroupKey = CatalogFilterGroup['groupKey']

function clampCatalogBrowseSectionHeight(height: number): number {
  return Math.min(
    CATALOG_BROWSE_SECTION_MAX_HEIGHT,
    Math.max(CATALOG_BROWSE_SECTION_MIN_HEIGHT, height),
  )
}

export function CatalogShellBrowseRail(props: CatalogShellBrowseRailProps) {
  const {
    facetSelections,
    facetSelectionMode,
    previewLoadedItems,
    totalItemCount,
    searchText,
    searchPlaceholder,
    resultsSummary,
    partSectionOptions,
    platformSectionOptions,
    filterGroups,
    selectedFilters,
    onSearchTextChange,
    onFacetSelectionChange,
    onFacetSelectionModeChange,
    onFilterToggle,
    onFilterReset,
    onClearFacetedFilters,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
  } = props
  const [browseSectionHeights, setBrowseSectionHeights] = useState<
    Record<CatalogBrowseMode, number>
  >({
    part: CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT,
    platform: CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT,
  })
  const [filterSectionHeights, setFilterSectionHeights] = useState<
    Partial<Record<CatalogRailFilterGroupKey, number>>
  >({})
  const [resizingBrowseSection, setResizingBrowseSection] = useState<CatalogBrowseMode | null>(
    null,
  )
  const [resizingFilterSection, setResizingFilterSection] =
    useState<CatalogRailFilterGroupKey | null>(null)
  const [collapsedFacetKeys, setCollapsedFacetKeys] = useState<
    Partial<Record<CatalogRailFacetDisclosureKey, boolean>>
  >({})
  const browseSectionResizeStartClientYRef = useRef(0)
  const browseSectionResizeStartHeightRef = useRef(CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT)

  useEffect(() => {
    if (resizingBrowseSection === null && resizingFilterSection === null) {
      return undefined
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const dragOffset = event.clientY - browseSectionResizeStartClientYRef.current
      const nextHeight = clampCatalogBrowseSectionHeight(
        browseSectionResizeStartHeightRef.current + dragOffset,
      )

      if (resizingBrowseSection !== null) {
        setBrowseSectionHeights((currentHeights) => ({
          ...currentHeights,
          [resizingBrowseSection]: nextHeight,
        }))
        return
      }

      if (resizingFilterSection !== null) {
        setFilterSectionHeights((currentHeights) => ({
          ...currentHeights,
          [resizingFilterSection]: nextHeight,
        }))
      }
    }

    const handleMouseUp = () => {
      setResizingBrowseSection(null)
      setResizingFilterSection(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add('CatalogShellIsResizingBrowseSection')

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('CatalogShellIsResizingBrowseSection')
    }
  }, [resizingBrowseSection, resizingFilterSection])

  const handleBrowseSectionResizeStart = (
    sectionBrowseMode: CatalogBrowseMode,
    event: MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    browseSectionResizeStartClientYRef.current = event.clientY
    browseSectionResizeStartHeightRef.current = browseSectionHeights[sectionBrowseMode]
    setResizingBrowseSection(sectionBrowseMode)
  }

  const handleFilterSectionResizeStart = (
    groupKey: CatalogRailFilterGroupKey,
    event: MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    browseSectionResizeStartClientYRef.current = event.clientY
    browseSectionResizeStartHeightRef.current =
      filterSectionHeights[groupKey] ?? CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT
    setResizingFilterSection(groupKey)
  }

  const handleBrowseSectionResizeKeyDown = (
    sectionBrowseMode: CatalogBrowseMode,
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setBrowseSectionHeights((currentHeights) => {
      if (event.key === 'Home') {
        return {
          ...currentHeights,
          [sectionBrowseMode]: CATALOG_BROWSE_SECTION_MIN_HEIGHT,
        }
      }

      if (event.key === 'End') {
        return {
          ...currentHeights,
          [sectionBrowseMode]: CATALOG_BROWSE_SECTION_MAX_HEIGHT,
        }
      }

      const direction = event.key === 'ArrowUp' ? -1 : 1
      return {
        ...currentHeights,
        [sectionBrowseMode]: clampCatalogBrowseSectionHeight(
          currentHeights[sectionBrowseMode] +
            direction * CATALOG_BROWSE_SECTION_KEYBOARD_STEP,
        ),
      }
    })
  }

  const handleFilterSectionResizeKeyDown = (
    groupKey: CatalogRailFilterGroupKey,
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setFilterSectionHeights((currentHeights) => {
      if (event.key === 'Home') {
        return {
          ...currentHeights,
          [groupKey]: CATALOG_BROWSE_SECTION_MIN_HEIGHT,
        }
      }

      if (event.key === 'End') {
        return {
          ...currentHeights,
          [groupKey]: CATALOG_BROWSE_SECTION_MAX_HEIGHT,
        }
      }

      const direction = event.key === 'ArrowUp' ? -1 : 1
      return {
        ...currentHeights,
        [groupKey]: clampCatalogBrowseSectionHeight(
          (currentHeights[groupKey] ?? CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT) +
            direction * CATALOG_BROWSE_SECTION_KEYBOARD_STEP,
        ),
      }
    })
  }

  const resolveBrowseSectionHeightStyle = (sectionBrowseMode: CatalogBrowseMode) =>
    ({
      '--catalog-browse-section-height': `${browseSectionHeights[sectionBrowseMode]}px`,
    }) as CSSProperties

  const resolveFilterSectionHeightStyle = (groupKey: CatalogRailFilterGroupKey) =>
    ({
      '--catalog-browse-section-height': `${
        filterSectionHeights[groupKey] ?? CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT
      }px`,
    }) as CSSProperties

  const toggleFacetDisclosure = (facetKey: CatalogRailFacetDisclosureKey) => {
    setCollapsedFacetKeys((currentKeys) => ({
      ...currentKeys,
      [facetKey]: !currentKeys[facetKey],
    }))
  }

  const renderFacetHeader = (
    facetKey: CatalogRailFacetDisclosureKey,
    title: string,
    description: string,
  ) => {
    const isCollapsed = collapsedFacetKeys[facetKey] === true

    return (
      <div className="CatalogShellBrowseSectionHeader">
        <button
          type="button"
          className="CatalogShellFacetDisclosureButton"
          aria-expanded={!isCollapsed}
          data-catalog-action-kind={`toggle-${facetKey.replace(':', '-')}`}
          onClick={() => toggleFacetDisclosure(facetKey)}
        >
          <span className="CatalogShellFacetDisclosureTriangle" aria-hidden="true" />
          <span className="CatalogShellRegionEyebrow">{title}</span>
        </button>
        <p className="CatalogShellRule">{description}</p>
      </div>
    )
  }

  const renderBrowseSectionBox = (
    sectionBrowseMode: CatalogBrowseMode,
    title: string,
    sectionOptions: CatalogSectionOption[],
  ) => {
    const selectedSectionKeys = facetSelections[sectionBrowseMode] ?? []
    const isAllSelected = selectedSectionKeys.includes('all')
    const facetKey = `browse:${sectionBrowseMode}` as const
    const isCollapsed = collapsedFacetKeys[facetKey] === true

    return (
      <section
        className="CatalogShellBrowseSectionBox"
        data-catalog-browse-section-box={sectionBrowseMode}
      >
        {renderFacetHeader(
          facetKey,
          title,
          resolveCatalogBrowseModeDescription(sectionBrowseMode),
        )}
        {!isCollapsed ? (
          <>
            <div
              className="CatalogShellBrowseSectionScroll"
              data-catalog-region={`${sectionBrowseMode}-section-list`}
              style={resolveBrowseSectionHeightStyle(sectionBrowseMode)}
            >
              <button
                type="button"
                className={`CatalogShellFilterButton ${isAllSelected ? 'isActive' : ''}`}
                aria-pressed={isAllSelected}
                onClick={() => onFacetSelectionChange(sectionBrowseMode, 'all')}
              >
                <span>All</span>
                <strong>{totalItemCount}</strong>
              </button>
              {sectionOptions.map((option) => {
                const isSelected =
                  !isAllSelected && selectedSectionKeys.includes(option.sectionKey)
                return (
                  <button
                    key={`${sectionBrowseMode}:${option.sectionKey}`}
                    type="button"
                    className={`CatalogShellFilterButton ${isSelected ? 'isActive' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => onFacetSelectionChange(sectionBrowseMode, option.sectionKey)}
                  >
                    <span>{option.label}</span>
                    <strong>{option.count}</strong>
                  </button>
                )
              })}
            </div>
            <div
              className="CatalogShellBrowseSectionResizeHandle"
              role="separator"
              aria-label={`Resize ${title} browse list`}
              aria-orientation="horizontal"
              aria-valuemin={CATALOG_BROWSE_SECTION_MIN_HEIGHT}
              aria-valuemax={CATALOG_BROWSE_SECTION_MAX_HEIGHT}
              aria-valuenow={browseSectionHeights[sectionBrowseMode]}
              tabIndex={0}
              data-catalog-region={`${sectionBrowseMode}-section-resize-handle`}
              onMouseDown={(event) => handleBrowseSectionResizeStart(sectionBrowseMode, event)}
              onKeyDown={(event) => handleBrowseSectionResizeKeyDown(sectionBrowseMode, event)}
            />
          </>
        ) : null}
      </section>
    )
  }

  const renderFacetSelectionModeToggle = () => (
    <div
      className="CatalogShellFacetSelectionMode"
      data-catalog-region="facet-selection-mode-toggle"
      aria-label="Facet selection mode"
    >
      {(['add', 'switch'] as const).map((selectionMode) => {
        const isActive = facetSelectionMode === selectionMode
        const label = selectionMode === 'add' ? 'Add to selection' : 'Switch selection'

        return (
          <button
            key={selectionMode}
            type="button"
            className={`CatalogShellFacetSelectionModeButton ${isActive ? 'isActive' : ''}`}
            aria-pressed={isActive}
            data-catalog-action-kind={`facet-selection-mode-${selectionMode}`}
            onClick={() => onFacetSelectionModeChange(selectionMode)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )

  const renderFilterGroupBox = (group: CatalogFilterGroup) => {
    const selectedValues = selectedFilters[group.groupKey] ?? []
    const isAllSelected = selectedValues.length === 0
    const facetKey = `filter:${group.groupKey}` as const
    const isCollapsed = collapsedFacetKeys[facetKey] === true

    return (
      <section
        key={group.groupKey}
        className="CatalogShellBrowseSectionBox"
        data-catalog-filter-group={group.groupKey}
      >
        {renderFacetHeader(facetKey, group.label, group.description)}
        {!isCollapsed ? (
          <>
            <div
              className="CatalogShellBrowseSectionScroll CatalogShellBrowseSectionScroll--facet"
              data-catalog-region={`${group.groupKey}-filter-list`}
              style={resolveFilterSectionHeightStyle(group.groupKey)}
            >
              <button
                type="button"
                className={`CatalogShellFilterButton ${isAllSelected ? 'isActive' : ''}`}
                aria-pressed={isAllSelected}
                onClick={() => onFilterReset(group.groupKey)}
              >
                <span>All</span>
                <strong>{totalItemCount}</strong>
              </button>
              {group.options.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <button
                    key={`${group.groupKey}:${option.value}`}
                    type="button"
                    className={`CatalogShellFilterButton ${isSelected ? 'isActive' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => onFilterToggle(group.groupKey, option.value)}
                  >
                    <span>{option.value}</span>
                    <strong>{option.count}</strong>
                  </button>
                )
              })}
            </div>
            <div
              className="CatalogShellBrowseSectionResizeHandle"
              role="separator"
              aria-label={`Resize ${group.label} filter list`}
              aria-orientation="horizontal"
              aria-valuemin={CATALOG_BROWSE_SECTION_MIN_HEIGHT}
              aria-valuemax={CATALOG_BROWSE_SECTION_MAX_HEIGHT}
              aria-valuenow={
                filterSectionHeights[group.groupKey] ?? CATALOG_BROWSE_SECTION_DEFAULT_HEIGHT
              }
              tabIndex={0}
              data-catalog-region={`${group.groupKey}-filter-resize-handle`}
              onMouseDown={(event) => handleFilterSectionResizeStart(group.groupKey, event)}
              onKeyDown={(event) => handleFilterSectionResizeKeyDown(group.groupKey, event)}
            />
          </>
        ) : null}
      </section>
    )
  }

  return (
    <aside className="CatalogShellRegion CatalogShellFilters" data-catalog-region="filters">
      <div className="CatalogShellRegionHeader CatalogShellBrowseRailHeader">
        <div>
          <p className="CatalogShellRegionEyebrow">Catalog</p>
          <h2>Filters</h2>
        </div>
        <button
          type="button"
          className="CatalogShellBrowseRailClearButton"
          data-catalog-action-kind="clear-faceted-filters"
          onClick={onClearFacetedFilters}
        >
          Clear All
        </button>
      </div>
      <div className="CatalogShellBrowseRailBody" data-catalog-region="filter-scroll-body">
        <div
          className="CatalogShellSearchPanel CatalogShellSearchPanel--rail"
          data-catalog-region="search-panel"
        >
          <label className="CatalogShellSearchField">
            <span className="CatalogShellRegionEyebrow">Search</span>
            <input
              type="search"
              value={searchText}
              placeholder={searchPlaceholder}
              onChange={(event) => onSearchTextChange(event.target.value)}
            />
          </label>
          <p className="CatalogShellRule">{resultsSummary}</p>
        </div>
        <div className="CatalogShellBrowseSections" data-catalog-region="browse-section-boxes">
          {renderFacetSelectionModeToggle()}
          {renderBrowseSectionBox('platform', 'Platform', platformSectionOptions)}
          {renderBrowseSectionBox('part', 'Part', partSectionOptions)}
          {filterGroups.map(renderFilterGroupBox)}
        </div>
      </div>
      <div
        className="CatalogShellPreviewSession CatalogShellPreviewSession--rail"
        data-catalog-region="preview-session"
      >
        <div className="CatalogShellPreviewSessionHeader">
          <div>
            <p className="CatalogShellRegionEyebrow">Preview Session</p>
            <h3>Preview Loaded</h3>
          </div>
          {previewLoadedItems.length > 0 ? (
            <button
              type="button"
              className="CatalogShellPreviewSessionClearButton"
              onClick={onUnloadAllPreviewItems}
            >
              Unload All
            </button>
          ) : null}
        </div>
        <p className="CatalogShellRule">
          {previewLoadedItems.length > 0
            ? `${previewLoadedItems.length} temporary preview item${
                previewLoadedItems.length === 1 ? '' : 's'
              } currently ride with this Catalog surface.`
            : 'No preview-loaded items yet.'}
        </p>
        {previewLoadedItems.length > 0 ? (
          <div className="CatalogShellPreviewSessionList">
            {previewLoadedItems.map((item) => (
              <div key={item.itemId} className="CatalogShellPreviewSessionRow">
                <span>{item.label}</span>
                <button
                  type="button"
                  className="CatalogShellPreviewSessionUnloadButton"
                  onClick={() => onUnloadPreviewItem(item.itemId)}
                >
                  Unload
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
