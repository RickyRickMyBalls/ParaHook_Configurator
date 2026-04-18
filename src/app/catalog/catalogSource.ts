import type { CatalogItemRecord } from './catalogItemContract'
import { CATALOG_REPO_SEED_ITEMS, type CatalogRepoSeedItem } from './catalogSeedItems'

export type CatalogImportsSourceRecord = {
  referenceId: string
  categoryId: string
  label: string
  assetPath: string
}

export type CatalogReferenceWorkspaceImportsRecord = CatalogImportsSourceRecord & {
  sourceKind: 'manifest' | 'imported'
}

export type CatalogImportsSourceSnapshot = {
  importedReferencesById: Record<string, CatalogImportsSourceRecord>
  importedReferenceOrder: string[]
}

export type CatalogSourceSnapshot = {
  repoItems: CatalogItemRecord[]
  importsItems: CatalogItemRecord[]
  allItems: CatalogItemRecord[]
}

function buildCatalogRepoItem(seedItem: CatalogRepoSeedItem): CatalogItemRecord {
  return {
    itemId: seedItem.itemId,
    label: seedItem.label,
    familyKey: seedItem.familyKey,
    sectionKey: seedItem.sectionKey,
    tags: [...seedItem.tags],
    description: seedItem.description,
    assetKind: seedItem.assetKind,
    actionKind: seedItem.actionKind,
    source: {
      sourceKind: 'repo',
      assetPath: seedItem.assetPath,
    },
    previewMedia: [...seedItem.previewMedia],
  }
}

export function getCatalogRepoItems(): CatalogItemRecord[] {
  return CATALOG_REPO_SEED_ITEMS.map(buildCatalogRepoItem)
}

function buildCatalogImportsItem(record: CatalogImportsSourceRecord): CatalogItemRecord {
  return {
    itemId: `imports:${record.referenceId}`,
    label: record.label,
    familyKey: 'imports',
    sectionKey: record.categoryId,
    tags: ['imports', record.categoryId],
    description: `Previously imported ${record.label} entry surfaced for Catalog reuse.`,
    assetKind: 'reference-asset',
    actionKind: 'load-preview',
    source: {
      sourceKind: 'imports',
      importId: record.referenceId,
      assetPath: record.assetPath,
    },
    previewMedia: [],
  }
}

export function getCatalogImportsItems(
  importsSnapshot: CatalogImportsSourceSnapshot,
): CatalogItemRecord[] {
  return importsSnapshot.importedReferenceOrder
    .map((referenceId) => importsSnapshot.importedReferencesById[referenceId] ?? null)
    .filter((record): record is CatalogImportsSourceRecord => record !== null)
    .map(buildCatalogImportsItem)
}

export function createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace: {
  importedReferencesById: Record<string, CatalogReferenceWorkspaceImportsRecord>
  importedReferenceOrder: string[]
}): CatalogImportsSourceSnapshot {
  const importedReferencesById = Object.fromEntries(
    referenceWorkspace.importedReferenceOrder
      .map((referenceId) => {
        const record = referenceWorkspace.importedReferencesById[referenceId] ?? null
        if (record === null || record.sourceKind !== 'imported') {
          return null
        }
        return [
          referenceId,
          {
            referenceId: record.referenceId,
            categoryId: record.categoryId,
            label: record.label,
            assetPath: record.assetPath,
          } satisfies CatalogImportsSourceRecord,
        ] as const
      })
      .filter(
        (
          entry,
        ): entry is readonly [string, CatalogImportsSourceRecord] => entry !== null,
      ),
  ) as Record<string, CatalogImportsSourceRecord>

  return {
    importedReferencesById,
    importedReferenceOrder: referenceWorkspace.importedReferenceOrder.filter(
      (referenceId) => importedReferencesById[referenceId] !== undefined,
    ),
  }
}

export function createCatalogSourceSnapshot(
  importsSnapshot: CatalogImportsSourceSnapshot = {
    importedReferencesById: {},
    importedReferenceOrder: [],
  },
): CatalogSourceSnapshot {
  const repoItems = getCatalogRepoItems()
  const importsItems = getCatalogImportsItems(importsSnapshot)
  return {
    repoItems,
    importsItems,
    allItems: [...repoItems, ...importsItems],
  }
}

export function selectCatalogItemsForSection(
  snapshot: CatalogSourceSnapshot,
  sectionKey: string,
): CatalogItemRecord[] {
  return snapshot.allItems.filter((item) => item.sectionKey === sectionKey)
}
