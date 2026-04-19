import type { CatalogItemRecord } from './catalogItemContract'
import { CATALOG_REPO_SEED_ITEMS, type CatalogRepoSeedItem } from './catalogSeedItems'

export type CatalogImportsSourceRecord = {
  referenceId: string
  categoryId: string
  label: string
  assetPath: string
  catalogItemId?: string | null
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
    systemKey: seedItem.systemKey,
    platformCompatibility:
      seedItem.platformCompatibility === undefined ? undefined : [...seedItem.platformCompatibility],
    partType: seedItem.partType,
    position: seedItem.position,
    productName: seedItem.productName,
    brand: seedItem.brand,
    partGroups: seedItem.partGroups === undefined ? undefined : [...seedItem.partGroups],
    description: seedItem.description,
    assetKind: seedItem.assetKind,
    actionKind: seedItem.actionKind,
    source: {
      sourceKind: 'repo',
      assetPath: seedItem.assetPath,
    },
    previewMedia: [...seedItem.previewMedia],
    notes: seedItem.notes === undefined ? undefined : [...seedItem.notes],
    metadata: seedItem.metadata === undefined ? undefined : [...seedItem.metadata],
    projectUsageCount: 0,
  }
}

export function getCatalogRepoItems(): CatalogItemRecord[] {
  return CATALOG_REPO_SEED_ITEMS.map(buildCatalogRepoItem)
}

function buildCatalogImportsItem(
  record: CatalogImportsSourceRecord,
  repoItemsById: Map<string, CatalogItemRecord>,
): CatalogItemRecord {
  const rememberedRepoItem =
    record.catalogItemId === undefined || record.catalogItemId === null
      ? null
      : repoItemsById.get(record.catalogItemId) ?? null

  if (rememberedRepoItem !== null) {
    return {
      itemId: `imports:${record.referenceId}`,
      label: record.label,
      familyKey: rememberedRepoItem.familyKey,
      sectionKey: 'imports',
      tags: Array.from(new Set(['imports', ...rememberedRepoItem.tags])),
      systemKey: rememberedRepoItem.systemKey,
      platformCompatibility:
        rememberedRepoItem.platformCompatibility === undefined
          ? undefined
          : [...rememberedRepoItem.platformCompatibility],
      partType: rememberedRepoItem.partType,
      position: rememberedRepoItem.position,
      productName: rememberedRepoItem.productName,
      brand: rememberedRepoItem.brand,
      partGroups:
        rememberedRepoItem.partGroups === undefined ? undefined : [...rememberedRepoItem.partGroups],
      description: `Imported project copy remembered from the curated Catalog item ${rememberedRepoItem.label}.`,
      assetKind: rememberedRepoItem.assetKind,
      actionKind: 'load-preview',
      source: {
        sourceKind: 'imports',
        importId: record.referenceId,
        assetPath: record.assetPath,
        catalogItemId: record.catalogItemId ?? null,
      },
      previewMedia: [...rememberedRepoItem.previewMedia],
      notes: [
        ...(rememberedRepoItem.notes ?? []),
        `Catalog identity remembered from ${rememberedRepoItem.label}.`,
      ],
      metadata: [
        ...(rememberedRepoItem.metadata ?? []),
        { label: 'Catalog Source', value: rememberedRepoItem.label },
        { label: 'Reuse Mode', value: 'Imported project copy' },
      ],
      projectUsageCount: 0,
    }
  }

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
      catalogItemId: record.catalogItemId ?? null,
    },
    previewMedia: [],
    notes: ['This item is available for Catalog-side reuse after its original import intake.'],
    metadata: [
      { label: 'Reuse Mode', value: 'Imported project copy' },
      { label: 'Original Category', value: record.categoryId },
    ],
    projectUsageCount: 0,
  }
}

export function getCatalogImportsItems(
  importsSnapshot: CatalogImportsSourceSnapshot,
  repoItemsById: Map<string, CatalogItemRecord>,
): CatalogItemRecord[] {
  return importsSnapshot.importedReferenceOrder
    .map((referenceId) => importsSnapshot.importedReferencesById[referenceId] ?? null)
    .filter((record): record is CatalogImportsSourceRecord => record !== null)
    .map((record) => buildCatalogImportsItem(record, repoItemsById))
}

export function createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace: {
  importedReferencesById: Record<string, CatalogReferenceWorkspaceImportsRecord>
  importedReferenceOrder: string[]
}): CatalogImportsSourceSnapshot {
  const importedReferencesById = referenceWorkspace.importedReferenceOrder.reduce<
    Record<string, CatalogImportsSourceRecord>
  >((recordsById, referenceId) => {
    const record = referenceWorkspace.importedReferencesById[referenceId] ?? null
    if (record === null || record.sourceKind !== 'imported') {
      return recordsById
    }

    recordsById[referenceId] = {
      referenceId: record.referenceId,
      categoryId: record.categoryId,
      label: record.label,
      assetPath: record.assetPath,
      catalogItemId: record.catalogItemId ?? null,
    }
    return recordsById
  }, {})

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
  const importedUsageCountByCatalogItemId = importsSnapshot.importedReferenceOrder.reduce(
    (counts, referenceId) => {
      const record = importsSnapshot.importedReferencesById[referenceId] ?? null
      if (record?.catalogItemId === undefined || record?.catalogItemId === null) {
        return counts
      }
      counts.set(record.catalogItemId, (counts.get(record.catalogItemId) ?? 0) + 1)
      return counts
    },
    new Map<string, number>(),
  )
  const repoItems = getCatalogRepoItems().map((item) => ({
    ...item,
    projectUsageCount: importedUsageCountByCatalogItemId.get(item.itemId) ?? 0,
  }))
  const repoItemsById = new Map(repoItems.map((item) => [item.itemId, item] as const))
  const importsItems = getCatalogImportsItems(importsSnapshot, repoItemsById)
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
