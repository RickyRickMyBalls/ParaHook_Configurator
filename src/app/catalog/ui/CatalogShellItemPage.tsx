import type { CatalogItemRecord } from '../catalogItemContract'
import {
  getCatalogItemPrimaryPreviewMedia,
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
    onBackToCatalog,
  } = props
  const selectedItemPreviewMedia = getCatalogItemPrimaryPreviewMedia(item)
  const actionPlan = resolveCatalogActionPlan(item)
  const familyLabel = resolveCatalogItemPageFamilyLabel(item)
  const familySummary = resolveCatalogItemPageFamilySummary(item)
  const previewViewportSource = resolveCatalogRepoReferencePreviewSource(item)
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
          {isPreviewLoaded && previewViewportSource !== null ? (
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
    </div>
  )
}
