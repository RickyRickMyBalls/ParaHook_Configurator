import {
  buildCatalogBrowseModeOptions,
  type CatalogBrowseMode,
  type CatalogSectionOption,
  resolveCatalogPubPartsStagedSourceInspectionRead,
  resolveCatalogBrowseModeDescription,
  resolveCatalogSectionBrowseDescription,
} from './catalogShellShared'
import type { PubPartsStagedSourceRecord } from '../pubPartsDownloadsStorage'
import type { PubPartsLocalSourceRecord } from '../pubPartsDownloadsStorage'

type CatalogShellBrowseRailProps = {
  browseMode: CatalogBrowseMode
  activeSection: string
  previewLoadedItems: Array<{
    itemId: string
    label: string
  }>
  pubPartsStagedSourceRecords: PubPartsStagedSourceRecord[]
  pubPartsLocalSourceRecords: PubPartsLocalSourceRecord[]
  totalItemCount: number
  sectionOptions: CatalogSectionOption[]
  onBrowseModeChange: (browseMode: CatalogBrowseMode) => void
  onSectionChange: (sectionKey: string) => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
  onClearPubPartsStagedSource: (stagedSourceId: string) => void
  onClearAllPubPartsStagedSources: () => void
}

export function CatalogShellBrowseRail(props: CatalogShellBrowseRailProps) {
  const {
    browseMode,
    activeSection,
    previewLoadedItems,
    pubPartsStagedSourceRecords,
    pubPartsLocalSourceRecords,
    totalItemCount,
    sectionOptions,
    onBrowseModeChange,
    onSectionChange,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
    onClearPubPartsStagedSource,
    onClearAllPubPartsStagedSources,
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
      <div
        className="CatalogShellPreviewSession CatalogShellPreviewSession--rail"
        data-catalog-region="pubparts-staged-sources"
      >
        <div className="CatalogShellPreviewSessionHeader">
          <div>
            <p className="CatalogShellRegionEyebrow">PubParts Source Staging</p>
            <h3>Staged Sources</h3>
          </div>
          {pubPartsStagedSourceRecords.length > 0 ? (
            <button
              type="button"
              className="CatalogShellPreviewSessionClearButton"
              data-catalog-clear-all-pubparts-staged-sources
              onClick={onClearAllPubPartsStagedSources}
            >
              Clear All
            </button>
          ) : null}
        </div>
        <p className="CatalogShellRule">
          {pubPartsStagedSourceRecords.length > 0
            ? `${pubPartsStagedSourceRecords.length} staged PubParts source link${
                pubPartsStagedSourceRecords.length === 1 ? '' : 's'
              }. These are metadata records only; source bytes are not downloaded and project assets are not imported.`
            : 'No staged PubParts source links yet.'}
        </p>
        {pubPartsStagedSourceRecords.length > 0 ? (
          <div className="CatalogShellPreviewSessionList">
            {pubPartsStagedSourceRecords.map((record) => {
              const inspectionRead = resolveCatalogPubPartsStagedSourceInspectionRead(record)
              return (
                <div
                  key={record.stagedSourceId}
                  className="CatalogShellPreviewSessionRow"
                  data-catalog-pubparts-staged-source={record.stagedSourceId}
                >
                  <span className="CatalogShellPreviewSessionRowBody">
                    <strong className="CatalogShellPreviewSessionRowLabel">
                      {record.catalogItemLabel}
                    </strong>
                    {' - '}
                    <span
                      className="CatalogShellPreviewSessionRowStatus"
                      data-catalog-pubparts-staged-source-status={record.stagedSourceId}
                    >
                      Source Link Staged - Not downloaded - {inspectionRead.label} - Not imported
                    </span>
                    {' - '}
                    <span
                      className="CatalogShellPreviewSessionRowInspection"
                      data-catalog-pubparts-staged-source-inspection={record.stagedSourceId}
                    >
                      {inspectionRead.description}
                    </span>
                    {' - '}
                    <span className="CatalogShellPreviewSessionRowUrl">
                      {record.sourceCandidateUrl}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="CatalogShellPreviewSessionUnloadButton"
                    data-catalog-clear-pubparts-staged-source={record.stagedSourceId}
                    onClick={() => onClearPubPartsStagedSource(record.stagedSourceId)}
                  >
                    Clear
                  </button>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
      <div
        className="CatalogShellPreviewSession CatalogShellPreviewSession--rail"
        data-catalog-region="pubparts-local-downloads"
      >
        <div className="CatalogShellPreviewSessionHeader">
          <div>
            <p className="CatalogShellRegionEyebrow">Local Downloads</p>
            <h3>PubParts Library</h3>
          </div>
        </div>
        <p className="CatalogShellRule">
          {pubPartsLocalSourceRecords.length > 0
            ? `${pubPartsLocalSourceRecords.length} PubParts item${
                pubPartsLocalSourceRecords.length === 1 ? '' : 's'
              } with local-library metadata. These records point to known folders and manifests; Catalog still does not scan arbitrary disk locations.`
            : 'No PubParts local-library records yet.'}
        </p>
        {pubPartsLocalSourceRecords.length > 0 ? (
          <div className="CatalogShellPreviewSessionList">
            {pubPartsLocalSourceRecords.map((record) => (
              <div
                key={record.catalogItemId}
                className="CatalogShellPreviewSessionRow"
                data-catalog-pubparts-local-source={record.catalogItemId}
              >
                <span className="CatalogShellPreviewSessionRowBody">
                  <strong className="CatalogShellPreviewSessionRowLabel">
                    {record.catalogItemLabel}
                  </strong>
                  {' - '}
                  <span
                    className="CatalogShellPreviewSessionRowStatus"
                    data-catalog-pubparts-local-source-status={record.catalogItemId}
                  >
                    {record.localStatusLabel}
                  </span>
                  {' - '}
                  <span className="CatalogShellPreviewSessionRowInspection">
                    {record.localStatusDescription}
                  </span>
                  {' - '}
                  <span className="CatalogShellPreviewSessionRowUrl">
                    {record.itemFolderPath}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
