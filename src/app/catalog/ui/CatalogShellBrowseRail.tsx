import {
  buildCatalogBrowseModeOptions,
  type CatalogBrowseMode,
  type CatalogSectionOption,
  resolveCatalogBrowseModeDescription,
  resolveCatalogSectionBrowseDescription,
} from './catalogShellShared'

type CatalogShellBrowseRailProps = {
  browseMode: CatalogBrowseMode
  activeSection: string
  previewLoadedItems: Array<{
    itemId: string
    label: string
  }>
  totalItemCount: number
  sectionOptions: CatalogSectionOption[]
  onBrowseModeChange: (browseMode: CatalogBrowseMode) => void
  onSectionChange: (sectionKey: string) => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
}

export function CatalogShellBrowseRail(props: CatalogShellBrowseRailProps) {
  const {
    browseMode,
    activeSection,
    previewLoadedItems,
    totalItemCount,
    sectionOptions,
    onBrowseModeChange,
    onSectionChange,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
  } = props
  const browseModeOptions = buildCatalogBrowseModeOptions()
  const activeSectionDescription =
    activeSection === 'all'
      ? resolveCatalogSectionBrowseDescription('all', browseMode)
      : sectionOptions.find((option) => option.sectionKey === activeSection)?.description ??
        'Browse stays source-backed and preview-light through the shared Catalog shell.'

  return (
    <aside className="CatalogShellRegion CatalogShellFilters" data-catalog-region="filters">
      <div className="CatalogShellBrowseRailMain">
        <div className="CatalogShellRegionHeader">
          <p className="CatalogShellRegionEyebrow">Browse</p>
          <h2>Sections</h2>
        </div>
        <div className="CatalogShellTagFilters" data-catalog-region="browse-mode-switcher">
          {browseModeOptions.map((option) => {
            const selected = browseMode === option.browseMode
            return (
              <button
                key={option.browseMode}
                type="button"
                className={`CatalogShellTag ${selected ? 'isSelected' : ''}`}
                title={option.description}
                onClick={() => onBrowseModeChange(option.browseMode)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <p className="CatalogShellRule" data-catalog-region="browse-mode-description">
          {resolveCatalogBrowseModeDescription(browseMode)}
        </p>
        <div className="CatalogShellFilterList">
          <button
            type="button"
            className={`CatalogShellFilterButton ${activeSection === 'all' ? 'isActive' : ''}`}
            onClick={() => onSectionChange('all')}
          >
            <span>All</span>
            <strong>{totalItemCount}</strong>
          </button>
          {sectionOptions.map((option) => (
            <button
              key={option.sectionKey}
              type="button"
              className={`CatalogShellFilterButton ${
                activeSection === option.sectionKey ? 'isActive' : ''
              }`}
              onClick={() => onSectionChange(option.sectionKey)}
            >
              <span>{option.label}</span>
              <strong>{option.count}</strong>
            </button>
          ))}
        </div>
        <p className="CatalogShellRule">
          {activeSectionDescription}
        </p>
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
