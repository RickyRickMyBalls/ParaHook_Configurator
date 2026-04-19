import { useEffect, useRef } from 'react'
import type { EnvironmentSourceSettings } from '../../../shared/viewSettingsTypes'
import type { CatalogItemRecord } from '../catalogItemContract'
import {
  getCatalogItemPrimaryPreviewMedia,
  resolveCatalogRepoEnvironmentSource,
  resolveCatalogRepoReferencePreviewSource,
  resolveCatalogPreviewMediaSrc,
} from '../catalogItemContract'
import { isCatalogActionAvailable, resolveCatalogActionPlan } from '../catalogActionPlan'
import { CatalogCardPreviewViewport } from './CatalogCardPreviewViewport'
import {
  formatCatalogSectionLabel,
  type CatalogBrowseMode,
  resolveCatalogCardBrowseMeta,
  resolveCatalogGridIntroCopy,
} from './catalogShellShared'

type CatalogShellGridModeProps = {
  browseMode: CatalogBrowseMode
  activeSection: string
  selectedItemIds: string[]
  previewLoadedItemIds: string[]
  visibleItems: CatalogItemRecord[]
  onAddItemToProject: (item: CatalogItemRecord) => void
  onApplyEnvironment: (item: CatalogItemRecord) => void
  onBrowseLocalEnvironment: (file: File) => void
  appliedEnvironmentSource: EnvironmentSourceSettings
  onSetHdriBackgroundVisible: (visible: boolean) => void
  onSetHdriIntensity: (intensity: number) => void
  displayedPreviewLoadableItemCount: number
  onLoadDisplayedPreviews: () => void
  onLoadPreview: (itemId: string) => void
  onToggleItemSelection: (itemId: string) => void
  onOpenItemPage: (itemId: string) => void
}

export function CatalogShellGridMode(props: CatalogShellGridModeProps) {
  const {
    browseMode,
    activeSection,
    selectedItemIds,
    previewLoadedItemIds,
    visibleItems,
    onAddItemToProject,
    onApplyEnvironment,
    onBrowseLocalEnvironment,
    appliedEnvironmentSource,
    onSetHdriBackgroundVisible,
    onSetHdriIntensity,
    displayedPreviewLoadableItemCount,
    onLoadDisplayedPreviews,
    onLoadPreview,
    onToggleItemSelection,
    onOpenItemPage,
  } = props
  const pendingSelectionItemIdRef = useRef<string | null>(null)
  const pendingSelectionTimeoutRef = useRef<number | null>(null)

  const clearPendingSelection = () => {
    if (pendingSelectionTimeoutRef.current !== null) {
      window.clearTimeout(pendingSelectionTimeoutRef.current)
      pendingSelectionTimeoutRef.current = null
    }
    pendingSelectionItemIdRef.current = null
  }

  const flushPendingSelection = () => {
    if (pendingSelectionItemIdRef.current === null) {
      clearPendingSelection()
      return
    }

    const itemId = pendingSelectionItemIdRef.current
    clearPendingSelection()
    onToggleItemSelection(itemId)
  }

  const scheduleSelectionToggle = (itemId: string) => {
    if (
      pendingSelectionItemIdRef.current !== null &&
      pendingSelectionItemIdRef.current !== itemId
    ) {
      flushPendingSelection()
    }

    clearPendingSelection()
    pendingSelectionItemIdRef.current = itemId
    pendingSelectionTimeoutRef.current = window.setTimeout(() => {
      flushPendingSelection()
    }, 180)
  }

  useEffect(() => clearPendingSelection, [])

  if (visibleItems.length === 0) {
    return (
      <div className="CatalogShellEmptyState" data-catalog-region="grid">
        <p>No entries are available in this browse section yet.</p>
        <p>Imports and curated entries will appear here through the shared content area.</p>
      </div>
    )
  }

  const showsEnvironmentItems = visibleItems.some((item) => item.assetKind === 'environment')

  return (
    <div className="CatalogShellGridMode" data-catalog-region="grid">
      <div className="CatalogShellGridIntro">
        <p className="CatalogShellRule">{resolveCatalogGridIntroCopy(activeSection, browseMode)}</p>
        <div className="CatalogShellGridIntroActions" data-catalog-region="grid-actions">
          <button
            type="button"
            className="CatalogShellCardActionButton"
            data-catalog-action-kind="load-displayed-previews"
            disabled={displayedPreviewLoadableItemCount === 0}
            onClick={onLoadDisplayedPreviews}
          >
            Load All Displayed Previews
          </button>
          <p className="CatalogShellRule CatalogShellGridIntroRead">
            {displayedPreviewLoadableItemCount === 0
              ? 'No currently displayed cards can load preview.'
              : `${displayedPreviewLoadableItemCount} currently displayed preview-capable card${
                  displayedPreviewLoadableItemCount === 1 ? '' : 's'
                } ready.`}
          </p>
        </div>
        {showsEnvironmentItems ? (
          <div className="CatalogEnvironmentToolbar" data-catalog-region="environment-toolbar">
            <label className="CatalogShellCardActionButton CatalogEnvironmentBrowseButton">
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
              Background
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
            <span className="CatalogEnvironmentActiveRead">
              {appliedEnvironmentSource.kind === 'hdri'
                ? `Applied: ${appliedEnvironmentSource.label}`
                : 'No HDRI/EXR applied'}
            </span>
          </div>
        ) : null}
      </div>
      <div className="CatalogShellCardGrid">
        {visibleItems.map((item) => {
          const actionPlan = resolveCatalogActionPlan(item)
          const isSelectedItem = selectedItemIds.includes(item.itemId)
          const isPreviewLoaded = previewLoadedItemIds.includes(item.itemId)
          const previewMedia = getCatalogItemPrimaryPreviewMedia(item)
          const previewAllowed = actionPlan.allowsTemporaryPreview
          const showAddToProjectAction =
            actionPlan.primaryAction.actionKind === 'add-to-project' &&
            isCatalogActionAvailable(actionPlan.primaryAction)
          const showApplyEnvironmentAction =
            actionPlan.primaryAction.actionKind === 'apply-environment' &&
            isCatalogActionAvailable(actionPlan.primaryAction)
          const previewViewportSource = resolveCatalogRepoReferencePreviewSource(item)
          const environmentPreviewSource = resolveCatalogRepoEnvironmentSource(item)

          return (
            <article
              key={item.itemId}
              className={`CatalogShellCard ${isSelectedItem ? 'isSelected' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={isSelectedItem}
              onClick={() => {
                scheduleSelectionToggle(item.itemId)
              }}
              onDoubleClick={() => {
                clearPendingSelection()
                onOpenItemPage(item.itemId)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  clearPendingSelection()
                  onToggleItemSelection(item.itemId)
                }
              }}
            >
              {environmentPreviewSource !== null ? (
                <div
                  className="CatalogShellPreviewBox CatalogShellPreviewBox--environment"
                  data-catalog-preview-box={item.itemId}
                  data-catalog-hdri-preview={environmentPreviewSource.fileType}
                >
                  {previewMedia !== null ? (
                    <img
                      src={resolveCatalogPreviewMediaSrc(previewMedia.src)}
                      alt={previewMedia.alt}
                    />
                  ) : null}
                  <span className="CatalogEnvironmentPreviewCube" aria-hidden="true" />
                  <span className="CatalogShellPreviewBoxCopy">
                    HDRI preview scene
                  </span>
                </div>
              ) : isPreviewLoaded && previewViewportSource !== null ? (
                <div
                  className="CatalogShellPreviewBox CatalogShellPreviewBox--interactive isLoaded"
                  data-catalog-preview-box={item.itemId}
                >
                  <CatalogCardPreviewViewport
                    itemId={item.itemId}
                    itemLabel={item.label}
                    previewSource={previewViewportSource}
                    fallbackPreviewMedia={previewMedia}
                  />
                </div>
              ) : !previewAllowed && previewMedia !== null ? (
                <button
                  type="button"
                  className="CatalogShellPreviewBox"
                  data-catalog-preview-box={item.itemId}
                  disabled
                >
                  {previewMedia.mediaKind === 'image' ? (
                    <img
                      src={resolveCatalogPreviewMediaSrc(previewMedia.src)}
                      alt={previewMedia.alt}
                    />
                  ) : (
                    <video aria-label={previewMedia.alt} muted playsInline>
                      <source src={resolveCatalogPreviewMediaSrc(previewMedia.src)} />
                    </video>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className={`CatalogShellPreviewBox ${isPreviewLoaded ? 'isLoaded' : ''}`}
                  data-catalog-preview-box={item.itemId}
                  disabled={!previewAllowed}
                  onClick={(event) => {
                    event.stopPropagation()
                    onLoadPreview(item.itemId)
                  }}
                >
                  {isPreviewLoaded && previewMedia !== null ? (
                    previewMedia.mediaKind === 'image' ? (
                      <img
                        src={resolveCatalogPreviewMediaSrc(previewMedia.src)}
                        alt={previewMedia.alt}
                      />
                    ) : (
                      <video aria-label={previewMedia.alt} muted playsInline>
                        <source src={resolveCatalogPreviewMediaSrc(previewMedia.src)} />
                      </video>
                    )
                  ) : (
                    <span className="CatalogShellPreviewBoxCopy">
                      {!previewAllowed
                        ? 'Environment apply stays on the shared viewer owner.'
                        : isPreviewLoaded
                        ? 'Preview loaded for this card.'
                        : 'Click to load preview into this card.'}
                    </span>
                  )}
                </button>
              )}
              <span className="CatalogShellCardSection">
                {item.source.sourceKind === 'imports'
                  ? 'Imports'
                  : formatCatalogSectionLabel(item.sectionKey)}
              </span>
              <strong className="CatalogShellCardLabel">{item.label}</strong>
              <span className="CatalogShellCardDescription">{item.description}</span>
              <span className="CatalogShellCardMeta">
                {resolveCatalogCardBrowseMeta(item, browseMode)}
              </span>
              <div className="CatalogShellCardActions">
                {showAddToProjectAction ? (
                  <button
                    type="button"
                    className="CatalogShellCardActionButton"
                    data-catalog-card-action-kind="add-to-project"
                    onClick={(event) => {
                      event.stopPropagation()
                      onAddItemToProject(item)
                    }}
                  >
                    Add To Project
                  </button>
                ) : null}
                {showApplyEnvironmentAction ? (
                  <button
                    type="button"
                    className="CatalogShellCardActionButton"
                    data-catalog-card-action-kind="apply-environment"
                    onClick={(event) => {
                      event.stopPropagation()
                      onApplyEnvironment(item)
                    }}
                  >
                    Apply Environment
                  </button>
                ) : null}
                <button
                  type="button"
                  className="CatalogShellCardActionButton"
                  data-catalog-card-action-kind="open-item-page"
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpenItemPage(item.itemId)
                  }}
                >
                  Open Item Page
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
