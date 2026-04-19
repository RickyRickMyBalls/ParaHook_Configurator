import type { CatalogItemRecord } from './catalogItemContract'
import { resolveCatalogActionPlan } from './catalogActionPlan'

export type CatalogPreviewSessionState = {
  loadedItemIds: string[]
}

const EMPTY_CATALOG_PREVIEW_SESSION: CatalogPreviewSessionState = {
  loadedItemIds: [],
}

const catalogPreviewSessionsBySurfaceInstanceId = new Map<string, CatalogPreviewSessionState>()

function dedupeCatalogPreviewItemIds(itemIds: string[]): string[] {
  return [...new Set(itemIds.filter((itemId) => itemId.length > 0))]
}

export function readCatalogPreviewSession(
  surfaceInstanceId: string,
): CatalogPreviewSessionState {
  const existingSession = catalogPreviewSessionsBySurfaceInstanceId.get(surfaceInstanceId)
  if (existingSession === undefined) {
    return EMPTY_CATALOG_PREVIEW_SESSION
  }

  return {
    loadedItemIds: [...existingSession.loadedItemIds],
  }
}

export function writeCatalogPreviewSession(
  surfaceInstanceId: string,
  session: CatalogPreviewSessionState,
): void {
  const nextSession = sanitizeCatalogPreviewSessionState(session, session.loadedItemIds)
  if (nextSession.loadedItemIds.length === 0) {
    catalogPreviewSessionsBySurfaceInstanceId.delete(surfaceInstanceId)
    return
  }

  catalogPreviewSessionsBySurfaceInstanceId.set(surfaceInstanceId, nextSession)
}

export function sanitizeCatalogPreviewSessionState(
  session: CatalogPreviewSessionState,
  validItemIds: string[],
): CatalogPreviewSessionState {
  const validItemIdSet = new Set(validItemIds)
  return {
    loadedItemIds: dedupeCatalogPreviewItemIds(session.loadedItemIds).filter((itemId) =>
      validItemIdSet.has(itemId),
    ),
  }
}

export function loadCatalogPreviewItems(
  session: CatalogPreviewSessionState,
  itemIds: string[],
): CatalogPreviewSessionState {
  return {
    loadedItemIds: dedupeCatalogPreviewItemIds([...session.loadedItemIds, ...itemIds]),
  }
}

export function unloadCatalogPreviewItem(
  session: CatalogPreviewSessionState,
  itemId: string,
): CatalogPreviewSessionState {
  return {
    loadedItemIds: session.loadedItemIds.filter((candidateItemId) => candidateItemId !== itemId),
  }
}

export function unloadAllCatalogPreviewItems(): CatalogPreviewSessionState {
  return EMPTY_CATALOG_PREVIEW_SESSION
}

export function resolveCatalogDisplayedPreviewLoadTargetItemIds(
  visibleItems: CatalogItemRecord[],
): string[] {
  return visibleItems
    .filter((item) => resolveCatalogActionPlan(item).allowsTemporaryPreview)
    .map((item) => item.itemId)
}

export function isCatalogPreviewLoaded(
  session: CatalogPreviewSessionState,
  itemId: string,
): boolean {
  return session.loadedItemIds.includes(itemId)
}

export function resolveCatalogPreviewTargetItemIds(
  triggerItemId: string,
  selectedItemIds: string[],
): string[] {
  const normalizedSelectedItemIds = dedupeCatalogPreviewItemIds(selectedItemIds)
  if (
    normalizedSelectedItemIds.length > 1 &&
    normalizedSelectedItemIds.includes(triggerItemId)
  ) {
    return normalizedSelectedItemIds
  }

  return [triggerItemId]
}

export function resetCatalogPreviewSessionsForTests(): void {
  catalogPreviewSessionsBySurfaceInstanceId.clear()
}
