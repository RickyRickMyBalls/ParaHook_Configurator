import type { PubPartsLocalLibraryMirrorRead } from '../pubPartsLocalLibraryMirror'
import type {
  PubPartsLocalSourceRecord,
  PubPartsStagedSourceRecord,
} from '../pubPartsDownloadsStorage'
import { resolveCatalogPubPartsStagedSourceInspectionRead } from './catalogShellShared'

type CatalogShellInfoPageProps = {
  pubPartsStagedSourceRecords: PubPartsStagedSourceRecord[]
  pubPartsLocalSourceRecords: PubPartsLocalSourceRecord[]
  pubPartsLocalLibraryMirrorRead: PubPartsLocalLibraryMirrorRead
  onClearPubPartsStagedSource: (stagedSourceId: string) => void
  onClearAllPubPartsStagedSources: () => void
}

export function CatalogShellInfoPage(props: CatalogShellInfoPageProps) {
  const {
    pubPartsStagedSourceRecords,
    pubPartsLocalSourceRecords,
    pubPartsLocalLibraryMirrorRead,
    onClearPubPartsStagedSource,
    onClearAllPubPartsStagedSources,
  } = props

  return (
    <div className="CatalogShellInfoPage" data-catalog-region="catalog-info-page">
      <section
        className="CatalogShellPreviewSession CatalogShellInfoPanel"
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
      </section>

      <section
        className="CatalogShellPreviewSession CatalogShellInfoPanel"
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
        <p
          className="CatalogShellRule"
          data-catalog-pubparts-local-library-mirror-status={pubPartsLocalLibraryMirrorRead.status}
        >
          Local Library mirror: {pubPartsLocalLibraryMirrorRead.status} -{' '}
          {pubPartsLocalLibraryMirrorRead.message}
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
      </section>
    </div>
  )
}
