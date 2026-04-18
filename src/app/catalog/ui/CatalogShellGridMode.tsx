import { useEffect, useRef } from 'react'
import type { CatalogItemRecord } from '../catalogItemContract'
import {
  getCatalogItemPrimaryPreviewMedia,
  resolveCatalogRepoReferencePreviewSource,
  resolveCatalogPreviewMediaSrc,
} from '../catalogItemContract'
import { isCatalogActionAvailable, resolveCatalogActionPlan } from '../catalogActionPlan'
import { CatalogCardPreviewViewport } from './CatalogCardPreviewViewport'
import {
  formatCatalogSectionLabel,
  resolveCatalogCardBrowseMeta,
  resolveCatalogGridIntroCopy,
} from './catalogShellShared'

type CatalogShellGridModeProps = {
  activeSection: string
  selectedItemIds: string[]
  previewLoadedItemIds: string[]
  visibleItems: CatalogItemRecord[]
  onAddItemToProject: (item: CatalogItemRecord) => void
  onLoadPreview: (itemId: string) => void
  onToggleItemSelection: (itemId: string) => void
  onOpenItemPage: (itemId: string) => void
}

export function CatalogShellGridMode(props: CatalogShellGridModeProps) {
  const {
    activeSection,
    selectedItemIds,
    previewLoadedItemIds,
    visibleItems,
    onAddItemToProject,
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

  return (
    <div className="CatalogShellGridMode" data-catalog-region="grid">
      <div className="CatalogShellGridIntro">
        <p className="CatalogShellRule">{resolveCatalogGridIntroCopy(activeSection)}</p>
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
          const previewViewportSource = resolveCatalogRepoReferencePreviewSource(item)

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
              {isPreviewLoaded && previewViewportSource !== null ? (
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
                {resolveCatalogCardBrowseMeta(item)}
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
