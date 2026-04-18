import { useEffect, useState } from 'react'
import type { CatalogItemRecord } from '../catalogItemContract'
import type { CatalogSourceSnapshot } from '../catalogSource'
import {
  loadCatalogPreviewItems,
  resolveCatalogPreviewTargetItemIds,
  type CatalogPreviewSessionState,
} from '../catalogPreviewSession'
import { resolveCatalogActionPlan } from '../catalogActionPlan'
import { CatalogShellBrowseRail } from './CatalogShellBrowseRail'
import { CatalogShellGridMode } from './CatalogShellGridMode'
import { CatalogShellItemPage } from './CatalogShellItemPage'
import {
  buildCatalogSectionOptions,
  type CatalogContentMode,
  getCatalogVisibleItems,
} from './catalogShellShared'

type CatalogShellProps = {
  snapshot: CatalogSourceSnapshot
  previewLoadedItemIds: string[]
  onPreviewSessionChange: (
    nextState:
      | CatalogPreviewSessionState
      | ((currentState: CatalogPreviewSessionState) => CatalogPreviewSessionState),
  ) => void
  onAddItemToProject: (item: CatalogItemRecord) => void
  onApplyEnvironment: (item: CatalogItemRecord) => void
  onUnloadAllPreviewItems: () => void
  onUnloadPreviewItem: (itemId: string) => void
}

export function CatalogShell(props: CatalogShellProps) {
  const {
    snapshot,
    previewLoadedItemIds,
    onPreviewSessionChange,
    onAddItemToProject,
    onApplyEnvironment,
    onUnloadAllPreviewItems,
    onUnloadPreviewItem,
  } = props
  const sectionOptions = buildCatalogSectionOptions(snapshot)
  const [activeSection, setActiveSection] = useState<string>('all')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [contentMode, setContentMode] = useState<CatalogContentMode>('grid')

  useEffect(() => {
    if (
      activeSection !== 'all' &&
      sectionOptions.every((option) => option.sectionKey !== activeSection)
    ) {
      setActiveSection(sectionOptions[0]?.sectionKey ?? 'all')
    }
  }, [activeSection, sectionOptions])

  useEffect(() => {
    if (
      selectedItemId !== null &&
      snapshot.allItems.every((item) => item.itemId !== selectedItemId)
    ) {
      setSelectedItemId(null)
      setContentMode('grid')
    }
  }, [selectedItemId, snapshot.allItems])

  useEffect(() => {
    setSelectedItemIds((currentSelectedItemIds) =>
      currentSelectedItemIds.filter((itemId) =>
        snapshot.allItems.some((item) => item.itemId === itemId),
      ),
    )
  }, [snapshot.allItems])

  const visibleItems = getCatalogVisibleItems(snapshot, activeSection)
  const selectedItem = snapshot.allItems.find((item) => item.itemId === selectedItemId) ?? null
  const isItemPageVisible = contentMode === 'item-page' && selectedItem !== null
  const previewLoadedItems = previewLoadedItemIds
    .map((itemId) => snapshot.allItems.find((item) => item.itemId === itemId) ?? null)
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const handleSectionChange = (sectionKey: string) => {
    setActiveSection(sectionKey)
    setContentMode('grid')
  }

  const handleOpenItemPage = (itemId: string) => {
    setSelectedItemId(itemId)
    setSelectedItemIds((currentSelectedItemIds) =>
      currentSelectedItemIds.includes(itemId) ? currentSelectedItemIds : [itemId],
    )
    setContentMode('item-page')
  }

  const handleToggleItemSelection = (itemId: string) => {
    setSelectedItemIds((currentSelectedItemIds) => {
      if (currentSelectedItemIds.includes(itemId)) {
        const nextSelectedItemIds = currentSelectedItemIds.filter(
          (candidateItemId) => candidateItemId !== itemId,
        )
        if (selectedItemId === itemId) {
          setSelectedItemId(nextSelectedItemIds[0] ?? null)
        }
        return nextSelectedItemIds
      }

      setSelectedItemId(itemId)
      return [...currentSelectedItemIds, itemId]
    })
  }

  const handleLoadPreviewForItem = (itemId: string) => {
    const item = snapshot.allItems.find((candidateItem) => candidateItem.itemId === itemId) ?? null
    if (item === null || !resolveCatalogActionPlan(item).allowsTemporaryPreview) {
      return
    }

    const targetItemIds = resolveCatalogPreviewTargetItemIds(itemId, selectedItemIds).filter(
      (candidateItemId) => {
        const candidateItem =
          snapshot.allItems.find((snapshotItem) => snapshotItem.itemId === candidateItemId) ?? null
        return candidateItem !== null && resolveCatalogActionPlan(candidateItem).allowsTemporaryPreview
      },
    )
    onPreviewSessionChange((currentPreviewSession) =>
      loadCatalogPreviewItems(currentPreviewSession, targetItemIds),
    )
  }

  return (
    <div className="CatalogShell" data-catalog-layout="owned-scroll">
      <CatalogShellBrowseRail
        activeSection={activeSection}
        previewLoadedItems={previewLoadedItems}
        totalItemCount={snapshot.allItems.length}
        sectionOptions={sectionOptions}
        onSectionChange={handleSectionChange}
        onUnloadAllPreviewItems={onUnloadAllPreviewItems}
        onUnloadPreviewItem={onUnloadPreviewItem}
      />

      <section className="CatalogShellRegion CatalogShellContent" data-catalog-region="content">
        <div className="CatalogShellRegionHeader">
          <p className="CatalogShellRegionEyebrow">
            {isItemPageVisible ? 'Item Page' : activeSection === 'imports' ? 'Imports' : 'Grid'}
          </p>
          <h2>
            {isItemPageVisible
              ? selectedItem.label
              : activeSection === 'imports'
                ? 'Imported Catalog Entries'
              : 'Catalog Cards'}
          </h2>
        </div>
        <div className="CatalogShellContentBody" data-catalog-region="content-body">
          {isItemPageVisible ? (
            <CatalogShellItemPage
              item={selectedItem}
              isPreviewLoaded={previewLoadedItemIds.includes(selectedItem.itemId)}
              previewTargetCount={resolveCatalogPreviewTargetItemIds(
                selectedItem.itemId,
                selectedItemIds,
              ).length}
              onLoadPreview={() => handleLoadPreviewForItem(selectedItem.itemId)}
              onAddToProject={() => onAddItemToProject(selectedItem)}
              onApplyEnvironment={() => onApplyEnvironment(selectedItem)}
              onBackToCatalog={() => setContentMode('grid')}
            />
          ) : (
            <CatalogShellGridMode
              activeSection={activeSection}
              selectedItemIds={selectedItemIds}
              previewLoadedItemIds={previewLoadedItemIds}
              visibleItems={visibleItems}
              onAddItemToProject={onAddItemToProject}
              onLoadPreview={handleLoadPreviewForItem}
              onToggleItemSelection={handleToggleItemSelection}
              onOpenItemPage={handleOpenItemPage}
            />
          )}
        </div>
      </section>
    </div>
  )
}
