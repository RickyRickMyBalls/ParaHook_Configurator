import type { EnvironmentSourceSettings } from '../../../shared/viewSettingsTypes'
import type { CatalogItemRecord } from '../catalogItemContract'
import {
  getCatalogItemPrimaryPreviewMedia,
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
  formatCatalogSectionLabel,
  resolveCatalogItemPageFamilyLabel,
  resolveCatalogItemPageFamilySummary,
} from './catalogShellShared'

type CatalogShellItemPageProps = {
  item: CatalogItemRecord
  isPreviewLoaded: boolean
  previewTargetCount: number
  onLoadPreview: () => void
  onAddToProject: () => void
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
  const canClickPreviewSurfaceToLoad = !isPreviewLoaded && actionPlan.allowsTemporaryPreview
  const itemPageActions = [actionPlan.primaryAction, actionPlan.secondaryAction].filter(
    (action): action is NonNullable<typeof action> => action !== null,
  )

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
          {item.source.sourceKind === 'repo' ? 'Catalog Item' : 'Imports Reuse'}
        </span>
      </div>
      <div className="CatalogShellDetailMeta">
        <span>{familyLabel}</span>
        <span>
          {item.source.sourceKind === 'imports'
            ? 'Imports'
            : formatCatalogSectionLabel(item.sectionKey)}
        </span>
        <span>{item.source.sourceKind === 'repo' ? 'Repo-backed' : 'Imports reuse'}</span>
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
          data-catalog-item-preview-trigger={item.itemId}
          onClick={onLoadPreview}
        >
          <div className="CatalogShellItemPreviewSurfaceCopy">
            Click to load preview into this item page.
          </div>
        </button>
      ) : (
        <div className={`CatalogShellItemPreviewSurface ${isPreviewLoaded ? 'isLoaded' : ''}`}>
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
              : isPreviewLoaded
                ? `${selectedItemPreviewMedia.alt} is currently loaded through the temporary Catalog preview session for this ${familyLabel.toLowerCase()}.`
                : `${selectedItemPreviewMedia.alt} is available on demand through the temporary Catalog preview session for this ${familyLabel.toLowerCase()}.`
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
      <div className="CatalogShellSourcePath">{item.source.assetPath}</div>
      <div className="CatalogShellActionArea" data-catalog-region="actions">
        <div className="CatalogShellActionCopy">
          <p className="CatalogShellRegionEyebrow">Action Area</p>
          <h3>Next Step</h3>
          <p>
            This page is the main decision surface once the user leaves the catalog grid. {familyLabel} keeps preview and commit meaning explicit.
          </p>
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
