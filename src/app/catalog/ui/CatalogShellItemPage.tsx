import type { EnvironmentSourceSettings } from '../../../shared/viewSettingsTypes'
import type { CatalogItemRecord } from '../catalogItemContract'
import type {
  PubPartsLocalSourceRecord,
  PubPartsStagedSourceRecord,
} from '../pubPartsDownloadsStorage'
import type { PubPartsLocalLibraryMirrorRead } from '../pubPartsLocalLibraryMirror'
import {
  getCatalogItemPrimaryPreviewMedia,
  isCatalogStartingAssemblyItem,
  resolveCatalogRepoEnvironmentSource,
  resolveCatalogRepoReferencePreviewSource,
  resolveCatalogPreviewMediaSrc,
} from '../catalogItemContract'
import {
  isCatalogActionAvailable,
  resolveCatalogActionPlan,
} from '../catalogActionPlan'
import { CatalogCardPreviewViewport } from './CatalogCardPreviewViewport'
import {
  buildCatalogItemSourceDetails,
  buildCatalogStartingAssemblyDetails,
  buildCatalogWheelFitmentDetails,
  resolveCatalogExternalSourceActionBoundary,
  resolveCatalogExternalSourcePageUrl,
  resolveCatalogItemModeLabel,
  resolveCatalogItemPageFamilyLabel,
  resolveCatalogItemPageFamilySummary,
  resolveCatalogItemSectionLabel,
  resolveCatalogItemSourceLabel,
  resolveCatalogLinkedArchiveClassification,
  resolveCatalogLinkedArchiveHandoff,
  resolveCatalogPubPartsDropboxChooserStatusRead,
  resolveCatalogPubPartsSourceDownloadHandoff,
  resolveCatalogPubPartsStagedSourceInspectionRead,
  resolveCatalogPubPartsSupportedFileChooserRead,
  resolveCatalogSelectedPubPartsImportHandoff,
  shouldRenderCatalogPreviewMediaEagerly,
  type CatalogPubPartsDropboxChooserStatus,
} from './catalogShellShared'

type CatalogShellItemPageProps = {
  item: CatalogItemRecord
  pubPartsStagedSourceRecord: PubPartsStagedSourceRecord | null
  pubPartsLocalSourceRecord: PubPartsLocalSourceRecord | null
  pubPartsDropboxChooserStatus: CatalogPubPartsDropboxChooserStatus | null
  pubPartsLocalLibraryMirrorRead: PubPartsLocalLibraryMirrorRead
  isPreviewLoaded: boolean
  previewTargetCount: number
  onLoadPreview: () => void
  onAddToProject: () => void
  onStageExternalSourceLink: () => void
  onInspectStagedSource: () => void
  onSelectSupportedFileCandidate: () => void
  onPreparePubPartsLocalSource: () => void
  onAddPubPartsDropboxFileToProject: () => void
  onImportDownloadedPubPartsFiles: () => void
  onApplyEnvironment: () => void
  onBrowseLocalEnvironment: (file: File) => void
  appliedEnvironmentSource: EnvironmentSourceSettings
  onSetHdriBackgroundVisible: (visible: boolean) => void
  onSetHdriIntensity: (intensity: number) => void
  onBackToCatalog: () => void
}

export function CatalogShellItemPage(props: CatalogShellItemPageProps) {
  const {
    item,
    isPreviewLoaded,
    previewTargetCount,
    onLoadPreview,
    onAddToProject,
    onStageExternalSourceLink,
    onInspectStagedSource,
    onSelectSupportedFileCandidate,
    onPreparePubPartsLocalSource,
    onAddPubPartsDropboxFileToProject,
    onImportDownloadedPubPartsFiles,
    onApplyEnvironment,
    onBrowseLocalEnvironment,
    appliedEnvironmentSource,
    onSetHdriBackgroundVisible,
    onSetHdriIntensity,
    onBackToCatalog,
  } = props
  const selectedItemPreviewMedia = getCatalogItemPrimaryPreviewMedia(item)
  const actionPlan = resolveCatalogActionPlan(item)
  const familyLabel = resolveCatalogItemPageFamilyLabel(item)
  const familySummary = resolveCatalogItemPageFamilySummary(item)
  const previewViewportSource = resolveCatalogRepoReferencePreviewSource(item)
  const environmentPreviewSource = resolveCatalogRepoEnvironmentSource(item)
  const shouldRenderEagerPreviewMedia = shouldRenderCatalogPreviewMediaEagerly(item)
  const canClickPreviewSurfaceToLoad =
    !shouldRenderEagerPreviewMedia && !isPreviewLoaded && actionPlan.allowsTemporaryPreview
  const itemPageActions = [actionPlan.primaryAction, actionPlan.secondaryAction].filter(
    (action): action is NonNullable<typeof action> => action !== null,
  )
  const sourceDetails = buildCatalogItemSourceDetails(item)
  const startingAssemblyDetails = buildCatalogStartingAssemblyDetails(item)
  const wheelFitmentDetails = buildCatalogWheelFitmentDetails(item)
  const externalSourceActionBoundary = resolveCatalogExternalSourceActionBoundary(
    item,
    props.pubPartsStagedSourceRecord,
  )
  const externalSourcePageUrl = resolveCatalogExternalSourcePageUrl(item)
  const linkedArchiveHandoff = resolveCatalogLinkedArchiveHandoff(item)
  const linkedArchiveClassification = resolveCatalogLinkedArchiveClassification(item)
  const stagedSourceInspectionRead =
    props.pubPartsStagedSourceRecord !== null
      ? resolveCatalogPubPartsStagedSourceInspectionRead(props.pubPartsStagedSourceRecord)
      : null
  const supportedFileChooserRead =
    props.pubPartsStagedSourceRecord !== null
      ? resolveCatalogPubPartsSupportedFileChooserRead(props.pubPartsStagedSourceRecord)
      : null
  const selectedFileImportHandoff = resolveCatalogSelectedPubPartsImportHandoff(
    item,
    props.pubPartsStagedSourceRecord,
  )
  const sourceDownloadHandoff = resolveCatalogPubPartsSourceDownloadHandoff(
    item,
    props.pubPartsStagedSourceRecord,
  )
  const dropboxChooserStatusRead = resolveCatalogPubPartsDropboxChooserStatusRead(
    props.pubPartsDropboxChooserStatus,
  )
  const localLibraryAction =
    item.source.sourceKind === 'external' && item.source.provider.providerId === 'pubparts'
      ? {
          label: 'Add To Project',
          description: `${dropboxChooserStatusRead.description} The local-library/manual file picker fallback remains available below.`,
          onClick: onAddPubPartsDropboxFileToProject,
        }
      : null
  const actionAreaCopy =
    item.source.sourceKind === 'planned'
      ? 'This page is the main decision surface once the user leaves the catalog grid. Planned source entries can add their verified source file as project reference content while keeping heavy preview and load-as-starting-configuration unavailable.'
      : isCatalogStartingAssemblyItem(item)
      ? 'This page is the main decision surface once the user leaves the catalog grid. Starting assemblies keep preview separate from the planned load-as-starting-configuration handoff; no downstream builder load owner is wired yet.'
      : item.source.sourceKind === 'external'
      ? 'This page is the main decision surface once the user leaves the catalog grid. External-linked source records keep preview and source inspection separate from archive download, extraction, import, or project commit behavior.'
      : `This page is the main decision surface once the user leaves the catalog grid. ${familyLabel} keeps preview and commit meaning explicit.`

  return (
    <div className="CatalogShellItemPage" data-catalog-region="item-page">
      <div className="CatalogShellItemPageToolbar">
        <button
          type="button"
          className="CatalogShellBackButton"
          onClick={onBackToCatalog}
        >
          Back To Catalog
        </button>
        <span className="CatalogShellItemPageMode">
          {resolveCatalogItemModeLabel(item)}
        </span>
      </div>
      <div className="CatalogShellDetailMeta">
        <span>{familyLabel}</span>
        <span>{resolveCatalogItemSectionLabel(item)}</span>
        <span>{resolveCatalogItemSourceLabel(item)}</span>
      </div>
      <div className="CatalogShellItemPageIntro">
        <h3>{familyLabel}</h3>
        <p className="CatalogShellRule">{familySummary}</p>
      </div>
      <p className="CatalogShellDetailDescription">{item.description}</p>
      <div className="CatalogShellDetailTags">
        {item.tags.map((tag) => (
          <span key={tag} className="CatalogShellTag">
            {tag}
          </span>
        ))}
      </div>
      {(item.metadata?.length ?? 0) > 0 ? (
        <dl className="CatalogShellDetailMetadata">
          {(item.metadata ?? []).map((entry) => (
            <div key={`${item.itemId}:${entry.label}`} className="CatalogShellDetailMetadataRow">
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {startingAssemblyDetails.length > 0 ? (
        <dl
          className="CatalogShellDetailMetadata"
          data-catalog-region="starting-assembly-details"
        >
          {startingAssemblyDetails.map((entry) => (
            <div
              key={`${item.itemId}:starting-assembly:${entry.label}`}
              className="CatalogShellDetailMetadataRow"
            >
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {wheelFitmentDetails.length > 0 ? (
        <dl className="CatalogShellDetailMetadata" data-catalog-region="wheel-fitment-details">
          {wheelFitmentDetails.map((entry) => (
            <div
              key={`${item.itemId}:wheel-fitment:${entry.label}`}
              className="CatalogShellDetailMetadataRow"
            >
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {(item.notes?.length ?? 0) > 0 ? (
        <ul className="CatalogShellDetailNotes">
          {(item.notes ?? []).map((note) => (
            <li key={`${item.itemId}:${note}`}>{note}</li>
          ))}
        </ul>
      ) : null}
      {canClickPreviewSurfaceToLoad ? (
        <button
          type="button"
          className="CatalogShellItemPreviewSurface CatalogShellItemPreviewSurfaceButton"
          data-catalog-item-preview-surface={item.itemId}
          data-catalog-item-preview-trigger={item.itemId}
          onClick={onLoadPreview}
        >
          <div className="CatalogShellItemPreviewSurfaceCopy">
            Click to load preview into this item page.
          </div>
        </button>
      ) : (
        <div
          className={`CatalogShellItemPreviewSurface ${isPreviewLoaded ? 'isLoaded' : ''}`}
          data-catalog-item-preview-surface={item.itemId}
        >
          {environmentPreviewSource !== null ? (
            <div
              className="CatalogEnvironmentItemPreview"
              data-catalog-hdri-preview={environmentPreviewSource.fileType}
            >
              {selectedItemPreviewMedia !== null ? (
                <img
                  src={resolveCatalogPreviewMediaSrc(selectedItemPreviewMedia.src)}
                  alt={selectedItemPreviewMedia.alt}
                />
              ) : null}
              <span className="CatalogEnvironmentPreviewCube" aria-hidden="true" />
              <span className="CatalogShellItemPreviewSurfaceCopy">
                Simple applied-environment preview for {item.label}.
              </span>
            </div>
          ) : shouldRenderEagerPreviewMedia && selectedItemPreviewMedia !== null ? (
            <img
              src={resolveCatalogPreviewMediaSrc(selectedItemPreviewMedia.src)}
              alt={selectedItemPreviewMedia.alt}
            />
          ) : isPreviewLoaded && previewViewportSource !== null ? (
            <CatalogCardPreviewViewport
              itemId={item.itemId}
              itemLabel={item.label}
              previewSource={previewViewportSource}
              fallbackPreviewMedia={selectedItemPreviewMedia}
              surfaceKind="item-page"
            />
          ) : isPreviewLoaded && selectedItemPreviewMedia !== null ? (
            selectedItemPreviewMedia.mediaKind === 'image' ? (
              <img
                src={resolveCatalogPreviewMediaSrc(selectedItemPreviewMedia.src)}
                alt={selectedItemPreviewMedia.alt}
              />
            ) : (
              <video aria-label={selectedItemPreviewMedia.alt} muted playsInline>
                <source src={resolveCatalogPreviewMediaSrc(selectedItemPreviewMedia.src)} />
              </video>
            )
          ) : !actionPlan.allowsTemporaryPreview && selectedItemPreviewMedia !== null ? (
            selectedItemPreviewMedia.mediaKind === 'image' ? (
              <img
                src={resolveCatalogPreviewMediaSrc(selectedItemPreviewMedia.src)}
                alt={selectedItemPreviewMedia.alt}
              />
            ) : (
              <video aria-label={selectedItemPreviewMedia.alt} muted playsInline>
                <source src={resolveCatalogPreviewMediaSrc(selectedItemPreviewMedia.src)} />
              </video>
            )
          ) : (
            <div className="CatalogShellItemPreviewSurfaceCopy">
              {isPreviewLoaded
                ? 'Preview loaded for this item page.'
                : 'Preview stays unloaded until you explicitly trigger it.'}
            </div>
          )}
        </div>
      )}
      <div className="CatalogShellPreviewNotice">
        <strong>No auto-preview.</strong>
        <span>
          {actionPlan.allowsTemporaryPreview
            ? selectedItemPreviewMedia === null
              ? `${familyLabel} has no preview media loaded by default.`
              : shouldRenderEagerPreviewMedia
                ? `${selectedItemPreviewMedia.alt} is displayed eagerly as external image browse context; model, archive, STEP, and builder loads remain user-driven or unavailable.`
              : isPreviewLoaded
                ? `${selectedItemPreviewMedia.alt} is currently loaded through the temporary Catalog preview session for this ${familyLabel.toLowerCase()}.`
                : `${selectedItemPreviewMedia.alt} is available on demand through the temporary Catalog preview session for this ${familyLabel.toLowerCase()}.`
            : item.source.sourceKind === 'planned'
              ? 'This planned source entry is visible for source inspection only; heavy preview and starting-configuration load are unavailable.'
              : 'This entry applies through the shared viewer environment owner instead of the temporary Catalog preview session.'}
        </span>
      </div>
      {(item.projectUsageCount ?? 0) > 0 ? (
        <div className="CatalogShellPreviewNotice">
          <strong>Remembered project use.</strong>
          <span>
            {item.projectUsageCount} imported project cop{item.projectUsageCount === 1 ? 'y' : 'ies'} currently trace back to this curated Catalog item.
          </span>
        </div>
      ) : null}
      {sourceDetails.length > 0 ? (
        <dl className="CatalogShellSourcePath" data-catalog-region="source-details">
          {externalSourcePageUrl !== null ? (
            <div className="CatalogShellDetailMetadataRow">
              <dt>Source Page</dt>
              <dd>
                <a
                  href={externalSourcePageUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-catalog-source-page-link={item.itemId}
                >
                  Open Source Page
                </a>
              </dd>
            </div>
          ) : null}
          {linkedArchiveHandoff.state !== 'no-linked-archive' ? (
            <div className="CatalogShellDetailMetadataRow">
              <dt>Archive Handoff</dt>
              <dd>
                {linkedArchiveHandoff.isUserInspectable && linkedArchiveHandoff.url !== null ? (
                  <a
                    href={linkedArchiveHandoff.url}
                    target="_blank"
                    rel="noreferrer"
                    data-catalog-linked-archive-link={item.itemId}
                  >
                    Inspect Linked Archive Source
                  </a>
                ) : (
                  linkedArchiveHandoff.label
                )}
                {' '}
                <span className="CatalogShellSourceHandoffState">
                  {linkedArchiveHandoff.label} - {linkedArchiveHandoff.description}
                </span>
              </dd>
            </div>
          ) : null}
          {linkedArchiveClassification.kind !== 'no-linked-archive' ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-linked-archive-classification={item.itemId}
            >
              <dt>Archive Classification</dt>
              <dd>
                {linkedArchiveClassification.label}
                <span className="CatalogShellSourceHandoffState">
                  {' '}
                  {linkedArchiveClassification.description}
                </span>
              </dd>
            </div>
          ) : null}
          {sourceDownloadHandoff.state === 'source-download-ready' &&
          sourceDownloadHandoff.downloadUrl !== null ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-source-download-handoff={item.itemId}
            >
              <dt>Source Download</dt>
              <dd>
                <a
                  href={sourceDownloadHandoff.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-catalog-source-download-link={item.itemId}
                >
                  {sourceDownloadHandoff.label}
                </a>
                {' '}
                <span className="CatalogShellSourceHandoffState">
                  {sourceDownloadHandoff.description}
                </span>
              </dd>
            </div>
          ) : null}
          {externalSourceActionBoundary.state !== 'not-external-pubparts' ? (
            <div className="CatalogShellDetailMetadataRow">
              <dt>Source Action</dt>
              <dd>
                <button
                  type="button"
                  disabled={externalSourceActionBoundary.state !== 'source-link-stage-ready'}
                  data-catalog-external-source-action-boundary={item.itemId}
                  data-catalog-stage-source-link={
                    externalSourceActionBoundary.state === 'source-link-stage-ready'
                      ? item.itemId
                      : undefined
                  }
                  onClick={
                    externalSourceActionBoundary.state === 'source-link-stage-ready'
                      ? onStageExternalSourceLink
                      : undefined
                  }
                >
                  {externalSourceActionBoundary.label}
                </button>
                {' '}
                <span
                  className="CatalogShellSourceHandoffState"
                  data-catalog-pubparts-source-stage-status={
                    externalSourceActionBoundary.state === 'source-link-staged'
                      ? item.itemId
                      : undefined
                  }
                >
                  {externalSourceActionBoundary.description}
                </span>
              </dd>
            </div>
          ) : null}
          {props.pubPartsStagedSourceRecord !== null ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-import-downloaded-pubparts-files={item.itemId}
            >
              <dt>Import Downloaded Files</dt>
              <dd>
                <button
                  type="button"
                  data-catalog-import-downloaded-pubparts-files-action={item.itemId}
                  onClick={onImportDownloadedPubPartsFiles}
                >
                  Import Downloaded Files
                </button>
                {' '}
                <span className="CatalogShellSourceHandoffState">
                  Choose local files you downloaded or extracted from the PubParts source. ParaHook will stage them in the normal Import review dialog with PubParts attribution.
                </span>
              </dd>
            </div>
          ) : null}
          {localLibraryAction !== null ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-pubparts-local-library-action={item.itemId}
              data-catalog-pubparts-add-to-project-bridge={item.itemId}
            >
              <dt>Add To Project</dt>
              <dd>
                <button
                  type="button"
                  data-catalog-pubparts-local-library-primary-action={item.itemId}
                  data-catalog-pubparts-add-to-project-action={item.itemId}
                  onClick={localLibraryAction.onClick}
                >
                  {localLibraryAction.label}
                </button>
                {' '}
                <span
                  className="CatalogShellSourceHandoffState"
                  data-catalog-pubparts-local-library-status={item.itemId}
                  data-catalog-pubparts-dropbox-chooser-status={item.itemId}
                >
                  {dropboxChooserStatusRead.label}
                  {' - '}
                  {localLibraryAction.description}
                </span>
              </dd>
            </div>
          ) : null}
          {item.source.sourceKind === 'external' && item.source.provider.providerId === 'pubparts' ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-pubparts-local-library-mirror={item.itemId}
              data-catalog-pubparts-local-library-mirror-status={
                props.pubPartsLocalLibraryMirrorRead.status
              }
            >
              <dt>Local Library Mirror</dt>
              <dd>
                <span className="CatalogShellSourceHandoffState">
                  {props.pubPartsLocalLibraryMirrorRead.status} -{' '}
                  {props.pubPartsLocalLibraryMirrorRead.message}
                </span>
              </dd>
            </div>
          ) : null}
          {item.source.sourceKind === 'external' && item.source.provider.providerId === 'pubparts' ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-pubparts-local-fallback={item.itemId}
            >
              <dt>Local Fallback</dt>
              <dd>
                <button
                  type="button"
                  data-catalog-pubparts-prepare-local-fallback={item.itemId}
                  onClick={onPreparePubPartsLocalSource}
                >
                  Prepare PubParts Folder
                </button>
                {props.pubPartsStagedSourceRecord === null ? (
                  <>
                    {' '}
                    <button
                      type="button"
                      data-catalog-pubparts-stage-local-fallback={item.itemId}
                      onClick={onStageExternalSourceLink}
                    >
                      Stage Source Link
                    </button>
                  </>
                ) : (
                  <>
                    {' '}
                    <button
                      type="button"
                      data-catalog-pubparts-import-local-fallback={item.itemId}
                      onClick={onImportDownloadedPubPartsFiles}
                    >
                      Import Local Files
                    </button>
                  </>
                )}
                {' '}
                <span className="CatalogShellSourceHandoffState">
                  {props.pubPartsLocalSourceRecord === null
                    ? 'Not Prepared'
                    : props.pubPartsLocalSourceRecord.localStatusLabel}
                  {' - '}
                  Use this known PubParts item folder fallback when source options cannot resolve the file automatically or the file must be downloaded manually.
                </span>
              </dd>
            </div>
          ) : null}
          {props.pubPartsLocalSourceRecord !== null ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-pubparts-local-folder={item.itemId}
            >
              <dt>Local Folder</dt>
              <dd>
                <span className="CatalogShellSourceHandoffState">
                  {props.pubPartsLocalSourceRecord.itemFolderPath}
                  {' - Manifest: '}
                  {props.pubPartsLocalSourceRecord.manifestPath}
                </span>
              </dd>
            </div>
          ) : null}
          {props.pubPartsStagedSourceRecord !== null ? (
            <div className="CatalogShellDetailMetadataRow">
              <dt>Source Inspection</dt>
              <dd>
                {props.pubPartsStagedSourceRecord.inspectionStatus === 'not-inspected' ? (
                  <button
                    type="button"
                    data-catalog-inspect-staged-source={item.itemId}
                    onClick={onInspectStagedSource}
                  >
                    Inspect Staged Source Metadata
                  </button>
                ) : null}
                {props.pubPartsStagedSourceRecord.inspectionStatus === 'not-inspected'
                  ? ' '
                  : null}
                <span
                  className="CatalogShellSourceHandoffState"
                  data-catalog-pubparts-source-inspection-status={item.itemId}
                >
                  {props.pubPartsStagedSourceRecord.inspectionStatus === 'metadata-inspected'
                    ? 'Metadata Inspection Complete - '
                    : ''}
                  {stagedSourceInspectionRead?.label ?? 'Not inspected'} -{' '}
                  {stagedSourceInspectionRead?.description ??
                    'This PubParts source link has not been inspected.'}
                </span>
              </dd>
            </div>
          ) : null}
          {supportedFileChooserRead !== null ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-supported-file-chooser={
                supportedFileChooserRead.state === 'supported-file-choice-ready' ||
                supportedFileChooserRead.state === 'supported-file-selected'
                  ? item.itemId
                  : undefined
              }
              data-catalog-supported-file-chooser-empty={
                supportedFileChooserRead.state !== 'supported-file-choice-ready' &&
                supportedFileChooserRead.state !== 'supported-file-selected'
                  ? item.itemId
                  : undefined
              }
            >
              <dt>Supported File Chooser</dt>
              <dd>
                {supportedFileChooserRead.isSelectable ? (
                  <button
                    type="button"
                    data-catalog-supported-file-choice={item.itemId}
                    onClick={onSelectSupportedFileCandidate}
                  >
                    {supportedFileChooserRead.label}
                  </button>
                ) : null}
                {supportedFileChooserRead.isSelectable ? ' ' : null}
                <span
                  className="CatalogShellSourceHandoffState"
                  data-catalog-supported-file-selection-status={item.itemId}
                >
                  {supportedFileChooserRead.selectedSupportedFile !== null
                    ? `${supportedFileChooserRead.description} ${supportedFileChooserRead.selectedSupportedFile.label}.`
                    : `${supportedFileChooserRead.label} - ${supportedFileChooserRead.description}`}
                </span>
              </dd>
            </div>
          ) : null}
          {selectedFileImportHandoff.state !== 'not-external-pubparts' &&
          selectedFileImportHandoff.state !== 'no-staged-source' ? (
            <div
              className="CatalogShellDetailMetadataRow"
              data-catalog-selected-file-import-handoff={item.itemId}
            >
              <dt>Selected File Import</dt>
              <dd>
                <span
                  className="CatalogShellSourceHandoffState"
                  data-catalog-selected-file-import-handoff-status={item.itemId}
                >
                  {selectedFileImportHandoff.selectedFile !== null
                    ? `${selectedFileImportHandoff.label} - ${selectedFileImportHandoff.description} ${selectedFileImportHandoff.selectedFile.label}.`
                    : `${selectedFileImportHandoff.label} - ${selectedFileImportHandoff.description}`}
                </span>
              </dd>
            </div>
          ) : null}
          {sourceDetails.map((entry) => (
            <div key={`${item.itemId}:source:${entry.label}`} className="CatalogShellDetailMetadataRow">
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div className="CatalogShellActionArea" data-catalog-region="actions">
        <div className="CatalogShellActionCopy">
          <p className="CatalogShellRegionEyebrow">Action Area</p>
          <h3>Next Step</h3>
          <p>{actionAreaCopy}</p>
          {previewTargetCount > 1 ? (
            <p>
              Loading preview here will target {previewTargetCount} currently selected cards in this
              Catalog surface.
            </p>
          ) : null}
        </div>
        <div className="CatalogShellActionButtons">
          {item.assetKind === 'environment' ? (
            <label className="CatalogShellActionUploadButton">
              Browse HDRI/EXR
              <input
                type="file"
                accept=".hdr,.exr"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null
                  event.currentTarget.value = ''
                  if (file !== null) {
                    onBrowseLocalEnvironment(file)
                  }
                }}
              />
            </label>
          ) : null}
          {itemPageActions.map((action) => (
            <button
              key={`${item.itemId}:${action.actionKind}`}
              type="button"
              data-catalog-action-kind={action.actionKind}
              disabled={!isCatalogActionAvailable(action)}
              onClick={
                !isCatalogActionAvailable(action)
                  ? undefined
                  : action.actionKind === 'load-preview'
                    ? onLoadPreview
                    : action.actionKind === 'add-to-project'
                      ? onAddToProject
                      : action.actionKind === 'apply-environment'
                        ? onApplyEnvironment
                        : undefined
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
      {item.assetKind === 'environment' ? (
        <div className="CatalogEnvironmentControls" data-catalog-region="environment-controls">
          <div>
            <p className="CatalogShellRegionEyebrow">Applied HDRI/EXR</p>
            <strong>
              {appliedEnvironmentSource.kind === 'hdri'
                ? appliedEnvironmentSource.label
                : 'No HDRI/EXR applied'}
            </strong>
          </div>
          <label className="CatalogEnvironmentToggle">
            <input
              type="checkbox"
              checked={
                appliedEnvironmentSource.kind === 'hdri'
                  ? appliedEnvironmentSource.backgroundVisible ?? true
                  : true
              }
              disabled={appliedEnvironmentSource.kind !== 'hdri'}
              onChange={(event) => onSetHdriBackgroundVisible(event.currentTarget.checked)}
            />
            Background visible
          </label>
          <label className="CatalogEnvironmentRange">
            Intensity
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={appliedEnvironmentSource.kind === 'hdri' ? appliedEnvironmentSource.intensity ?? 1 : 1}
              disabled={appliedEnvironmentSource.kind !== 'hdri'}
              onChange={(event) => onSetHdriIntensity(Number(event.currentTarget.value))}
            />
          </label>
        </div>
      ) : null}
    </div>
  )
}
