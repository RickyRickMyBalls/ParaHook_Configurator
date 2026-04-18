import {
  type CatalogSectionOption,
  resolveCatalogSectionBrowseDescription,
} from './catalogShellShared'

type CatalogShellBrowseRailProps = {
  activeSection: string
  previewLoadedItems: Array<{
    itemId: string
    label: string
  }>
  totalItemCount: number
  sectionOptions: CatalogSectionOption[]
  onSectionChange: (sectionKey: string) => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
}

export function CatalogShellBrowseRail(props: CatalogShellBrowseRailProps) {
  const {
    activeSection,
    previewLoadedItems,
    totalItemCount,
    sectionOptions,
    onSectionChange,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
  } = props
  const activeSectionDescription =
    activeSection === 'all'
      ? resolveCatalogSectionBrowseDescription('all')
      : sectionOptions.find((option) => option.sectionKey === activeSection)?.description ??
        'Browse stays source-backed and preview-light through the shared Catalog shell.'

  return (
    <aside className="CatalogShellRegion CatalogShellFilters" data-catalog-region="filters">
      <div className="CatalogShellBrowseRailMain">
        <div className="CatalogShellRegionHeader">
          <p className="CatalogShellRegionEyebrow">Browse</p>
          <h2>Sections</h2>
        </div>
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
