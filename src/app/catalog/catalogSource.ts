import type {
  CatalogItemMetadataEntry,
  CatalogItemPartGroup,
  CatalogItemPlatformFamily,
  CatalogItemRecord,
  CatalogItemSystem,
} from './catalogItemContract'
import {
  CATALOG_PLANNED_STARTING_ASSEMBLY_SEED_ITEMS,
  CATALOG_REPO_SEED_ITEMS,
  type CatalogPlannedStartingAssemblySeedItem,
  type CatalogRepoSeedItem,
} from './catalogSeedItems'
import type { PubPartsNormalizedSourceItem } from './pubPartsSource'

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
  plannedItems: CatalogItemRecord[]
  externalItems: CatalogItemRecord[]
  allItems: CatalogItemRecord[]
}

export type CatalogExternalSourceSnapshotInput = {
  pubPartsSourceItems?: readonly PubPartsNormalizedSourceItem[]
}

export type CatalogExternalTypeClassification = {
  systemKey?: CatalogItemSystem
  partType?: string
  partGroups?: CatalogItemPartGroup[]
}

const CATALOG_EXTERNAL_TYPE_CLASSIFICATIONS = new Map<
  string,
  CatalogExternalTypeClassification
>([
  [
    'adapter',
    {
      systemKey: 'Hardware',
      partType: 'Adapter',
      partGroups: ['Adapters'],
    },
  ],
  [
    'axle block',
    {
      systemKey: 'Hardware',
      partType: 'Axle Block',
      partGroups: ['Axle Blocks'],
    },
  ],
  [
    'battery assembly',
    {
      systemKey: 'Platform',
      partType: 'Battery Assembly',
      partGroups: ['Battery Boxes'],
    },
  ],
  [
    'battery box',
    {
      systemKey: 'Platform',
      partType: 'Battery Box',
      partGroups: ['Battery Boxes'],
    },
  ],
  [
    'bearing cover',
    {
      systemKey: 'Wheel',
      partType: 'Bearing Cover',
      partGroups: ['Bearings'],
    },
  ],
  [
    'bms',
    {
      systemKey: 'Platform',
      partType: 'BMS',
      partGroups: ['Electronics'],
    },
  ],
  [
    'bracket',
    {
      systemKey: 'Hardware',
      partType: 'Bracket',
      partGroups: ['Brackets'],
    },
  ],
  [
    'breakout board',
    {
      systemKey: 'Hardware',
      partType: 'Breakout Board',
      partGroups: ['Electronics'],
    },
  ],
  [
    'bumper',
    {
      systemKey: 'Platform',
      partType: 'Bumper',
      partGroups: ['Bumpers'],
    },
  ],
  [
    'connector cover',
    {
      systemKey: 'Hardware',
      partType: 'Connector Cover',
      partGroups: ['Guards'],
    },
  ],
  [
    'controller',
    {
      systemKey: 'Platform',
      partType: 'Controller',
      partGroups: ['Controllers'],
    },
  ],
  [
    'controller box',
    {
      systemKey: 'Platform',
      partType: 'Controller Box',
      partGroups: ['Boxes', 'Controllers'],
    },
  ],
  [
    'fender',
    {
      systemKey: 'Platform',
      partType: 'Fender',
      partGroups: ['Fenders'],
    },
  ],
  [
    'fender attachment',
    {
      systemKey: 'Platform',
      partType: 'Fender Attachment',
      partGroups: ['Fenders'],
    },
  ],
  [
    'fender delete',
    {
      systemKey: 'Platform',
      partType: 'Fender Delete',
      partGroups: ['Fenders'],
    },
  ],
  [
    'footpad',
    {
      systemKey: 'Platform',
      partType: 'Footpad',
      partGroups: ['Footpads'],
    },
  ],
  [
    'footpad attachment',
    {
      systemKey: 'Platform',
      partType: 'Footpad Attachment',
      partGroups: ['Footpads'],
    },
  ],
  [
    'gasket',
    {
      systemKey: 'Hardware',
      partType: 'Gasket',
      partGroups: ['Screw & Nuts'],
    },
  ],
  [
    'hall sensor',
    {
      systemKey: 'Hardware',
      partType: 'Hall Sensor',
      partGroups: ['Electronics'],
    },
  ],
  [
    'led',
    {
      systemKey: 'Hardware',
      partType: 'LED',
      partGroups: ['Lights', 'Electronics'],
    },
  ],
  [
    'miscellaneous',
    {
      systemKey: 'Hardware',
      partType: 'Miscellaneous',
      partGroups: ['Miscellaneous'],
    },
  ],
  [
    'miscellaneous items',
    {
      systemKey: 'Hardware',
      partType: 'Miscellaneous Items',
      partGroups: ['Miscellaneous'],
    },
  ],
  [
    'plug',
    {
      systemKey: 'Hardware',
      partType: 'Plug',
      partGroups: ['Guards'],
    },
  ],
  [
    'port cover',
    {
      systemKey: 'Hardware',
      partType: 'Port Cover',
      partGroups: ['Guards'],
    },
  ],
  [
    'rail attachment',
    {
      systemKey: 'Platform',
      partType: 'Rail Attachment',
      partGroups: ['Rails', 'Guards'],
    },
  ],
  [
    'rails',
    {
      systemKey: 'Platform',
      partType: 'Rails',
      partGroups: ['Rails'],
    },
  ],
  [
    'remote',
    {
      systemKey: 'Hardware',
      partType: 'Remote',
      partGroups: ['Remotes'],
    },
  ],
  [
    'rim saver',
    {
      systemKey: 'Wheel',
      partType: 'Rim Saver',
      partGroups: ['Rim Savers', 'Guards'],
    },
  ],
  [
    'stand',
    {
      systemKey: 'Hardware',
      partType: 'Stand',
      partGroups: ['Stands'],
    },
  ],
  [
    'tire',
    {
      systemKey: 'Wheel',
      partType: 'Tire',
      partGroups: ['Tires'],
    },
  ],
  [
    'tool',
    {
      systemKey: 'Hardware',
      partType: 'Tool',
      partGroups: ['Tools'],
    },
  ],
])

const CATALOG_EXTERNAL_PRIMARY_TYPE_PRIORITY = [
  'rim saver',
  'controller box',
  'controller',
  'battery box',
  'battery assembly',
  'footpad attachment',
  'footpad',
  'rails',
  'rail attachment',
  'tire',
  'fender',
  'fender delete',
  'fender attachment',
  'bumper',
  'axle block',
  'bearing cover',
  'breakout board',
  'bms',
  'hall sensor',
  'led',
  'connector cover',
  'port cover',
  'plug',
  'adapter',
  'bracket',
  'tool',
  'remote',
  'stand',
  'gasket',
  'miscellaneous',
  'miscellaneous items',
] as const

function mergeCatalogExternalTypeClassifications(
  classifications: CatalogExternalTypeClassification[],
): CatalogExternalTypeClassification {
  if (classifications.length === 0) {
    return {}
  }

  const primaryClassification = classifications[0]
  const partGroups = Array.from(
    new Set(classifications.flatMap((classification) => classification.partGroups ?? [])),
  )

  return {
    ...primaryClassification,
    ...(partGroups.length === 0 ? {} : { partGroups }),
  }
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
    wheelFitment:
      seedItem.wheelFitment === undefined ? undefined : { ...seedItem.wheelFitment },
    itemRole: seedItem.itemRole,
    startingAssembly:
      seedItem.startingAssembly === undefined ? undefined : { ...seedItem.startingAssembly },
    projectUsageCount: 0,
  }
}

function buildCatalogPlannedStartingAssemblyItem(
  seedItem: CatalogPlannedStartingAssemblySeedItem,
): CatalogItemRecord {
  return {
    itemId: seedItem.itemId,
    label: seedItem.label,
    familyKey: seedItem.familyKey,
    sectionKey: seedItem.sectionKey,
    tags: [...seedItem.tags],
    platformCompatibility:
      seedItem.platformCompatibility === undefined ? undefined : [...seedItem.platformCompatibility],
    description: seedItem.description,
    assetKind: seedItem.assetKind,
    actionKind: seedItem.actionKind,
    source: {
      sourceKind: 'planned',
      sourceLabel: seedItem.sourceLabel,
      sourceAssetPath: seedItem.sourceAssetPath,
      sourceAssetFormat: seedItem.sourceAssetFormat,
      sourceFileSizeBytes: seedItem.sourceFileSizeBytes,
      sourceStatus: seedItem.sourceStatus,
      ...(seedItem.sourceAssetSet === undefined
        ? {}
        : {
            sourceAssetSet: {
              sourceId: seedItem.sourceAssetSet.sourceId,
              currentVersionId: seedItem.sourceAssetSet.currentVersionId,
              versions: seedItem.sourceAssetSet.versions.map((version) => ({
                versionId: version.versionId,
                versionLabel: version.versionLabel,
                status: version.status,
                variants: version.variants.map((variant) => ({ ...variant })),
                ...(version.notes === undefined ? {} : { notes: [...version.notes] }),
              })),
            },
          }),
    },
    previewMedia: [...seedItem.previewMedia],
    notes: seedItem.notes === undefined ? undefined : [...seedItem.notes],
    metadata: seedItem.metadata === undefined ? undefined : [...seedItem.metadata],
    itemRole: seedItem.itemRole,
    startingAssembly: { ...seedItem.startingAssembly },
    projectUsageCount: 0,
  }
}

export function getCatalogRepoItems(): CatalogItemRecord[] {
  return CATALOG_REPO_SEED_ITEMS.map(buildCatalogRepoItem)
}

export function getCatalogPlannedStartingAssemblyItems(): CatalogItemRecord[] {
  return CATALOG_PLANNED_STARTING_ASSEMBLY_SEED_ITEMS.map(
    buildCatalogPlannedStartingAssemblyItem,
  )
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
      wheelFitment:
        rememberedRepoItem.wheelFitment === undefined
          ? undefined
          : { ...rememberedRepoItem.wheelFitment },
      itemRole: rememberedRepoItem.itemRole,
      startingAssembly:
        rememberedRepoItem.startingAssembly === undefined
          ? undefined
          : { ...rememberedRepoItem.startingAssembly },
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

function slugifyCatalogExternalItemId(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug.length > 0 ? slug : 'untitled'
}

function readCatalogExternalStableIdentityValue(sourceItem: PubPartsNormalizedSourceItem): string {
  return (
    sourceItem.sourceMetadata.sourceIdentityKey?.trim() ||
    sourceItem.externalItemUrl?.trim() ||
    sourceItem.sourceUrl?.trim() ||
    sourceItem.linkedArchiveUrl?.trim() ||
    [
      sourceItem.sourceRecordKind,
      sourceItem.sourceTitle,
      sourceItem.sourceMetadata.typeOfPart ?? '',
      sourceItem.sourceMetadata.platform ?? '',
      sourceItem.sourceMetadata.typeOfResource ?? '',
    ].join(':')
  )
}

function buildCatalogExternalPubPartsItemId(sourceItem: PubPartsNormalizedSourceItem): string {
  return `external:pubparts:${sourceItem.sourceRecordKind}:${slugifyCatalogExternalItemId(
    readCatalogExternalStableIdentityValue(sourceItem),
  )}`
}

function buildExternalMetadataRows(sourceItem: PubPartsNormalizedSourceItem) {
  return [
    { label: 'Source', value: sourceItem.providerName },
    { label: 'Source Set', value: sourceItem.sourceMetadata.sourceSetLabel ?? 'PubParts' },
    { label: 'Source Type', value: sourceItem.sourceRecordKind },
    { label: 'Fabrication Method', value: sourceItem.sourceMetadata.fabricationMethod ?? '' },
    { label: 'Part Type', value: sourceItem.sourceMetadata.typeOfPart ?? '' },
    { label: 'Platform', value: sourceItem.sourceMetadata.platform ?? '' },
    { label: 'Resource Type', value: sourceItem.sourceMetadata.typeOfResource ?? '' },
    { label: 'Archive Updated', value: sourceItem.archiveLastUpdated ?? '' },
    { label: 'Source URL', value: sourceItem.sourceUrl ?? '' },
    { label: 'Linked Archive URL', value: sourceItem.linkedArchiveUrl ?? '' },
  ].filter((entry) => entry.value.trim().length > 0)
}

function readCatalogExternalSourceLabels(
  sourceValue: string | readonly string[] | null | undefined,
): string[] {
  if (sourceValue === null || sourceValue === undefined) {
    return []
  }

  const sourceValues = typeof sourceValue === 'string' ? [sourceValue] : sourceValue
  return sourceValues.flatMap((value) =>
    value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label.length > 0),
  )
}

export function buildCatalogExternalTypeClassification(
  sourceTypeOfPart: string | readonly string[] | null | undefined,
): CatalogExternalTypeClassification {
  const sourceLabels = readCatalogExternalSourceLabels(sourceTypeOfPart)
  const sourceLabelSet = new Set(sourceLabels.map((sourceLabel) => sourceLabel.toLowerCase()))
  const classifications = CATALOG_EXTERNAL_PRIMARY_TYPE_PRIORITY.flatMap((sourceLabel) => {
    if (!sourceLabelSet.has(sourceLabel)) {
      return []
    }

    const classification = CATALOG_EXTERNAL_TYPE_CLASSIFICATIONS.get(sourceLabel)

    if (classification !== undefined) {
      return [{
        ...classification,
        partGroups:
          classification.partGroups === undefined ? undefined : [...classification.partGroups],
      }]
    }

    return []
  })

  return mergeCatalogExternalTypeClassifications(classifications)
}

const CATALOG_EXTERNAL_PLATFORM_COMPATIBILITY_MAP = new Map<
  string,
  CatalogItemPlatformFamily
>([
  ['floatwheel', 'ADV'],
  ['gt/gt-s', 'GT'],
  ['pint/x/s', 'Pint'],
  ['xr classic', 'XR Classic'],
  ['xr/funwheel', 'XR'],
  ['miscellaneous items', 'Other'],
])

function readCatalogExternalPlatformLabels(
  sourcePlatform: string | readonly string[] | null | undefined,
): string[] {
  return readCatalogExternalSourceLabels(sourcePlatform)
}

export function normalizeCatalogExternalPlatformCompatibility(
  sourcePlatform: string | readonly string[] | null | undefined,
): CatalogItemPlatformFamily[] {
  return readCatalogExternalPlatformLabels(sourcePlatform).reduce<CatalogItemPlatformFamily[]>(
    (platformFamilies, sourceLabel) => {
      const normalizedSourceLabel = sourceLabel.toLowerCase()
      const platformFamily =
        CATALOG_EXTERNAL_PLATFORM_COMPATIBILITY_MAP.get(normalizedSourceLabel) ?? 'Other'

      if (!platformFamilies.includes(platformFamily)) {
        platformFamilies.push(platformFamily)
      }

      return platformFamilies
    },
    [],
  )
}

export function buildCatalogExternalPlatformFitmentMetadataRows(
  sourcePlatform: string | readonly string[] | null | undefined,
): CatalogItemMetadataEntry[] {
  const hasGtSourceFitmentLabel = readCatalogExternalPlatformLabels(sourcePlatform).some(
    (sourceLabel) => ['gt/gt-s', 'gt-s', 'gts'].includes(sourceLabel.toLowerCase()),
  )

  return hasGtSourceFitmentLabel
    ? [
        {
          label: 'Source Fitment Note',
          value: 'GT-S source label preserved; canonical platform family remains GT',
        },
      ]
    : []
}

function buildCatalogExternalPubPartsItem(sourceItem: PubPartsNormalizedSourceItem): CatalogItemRecord {
  const sourceCollectionTag =
    sourceItem.sourceCollectionKey ?? sourceItem.sourceCollectionLabel ?? sourceItem.sourceRecordKind
  const platformCompatibility = normalizeCatalogExternalPlatformCompatibility(
    sourceItem.sourceMetadata.platform,
  )
  const typeClassification = buildCatalogExternalTypeClassification(
    sourceItem.sourceMetadata.typeOfPart,
  )

  return {
    itemId: buildCatalogExternalPubPartsItemId(sourceItem),
    label: sourceItem.sourceTitle,
    familyKey: 'external-pubparts',
    sectionKey:
      sourceItem.sourceRecordKind === 'resource'
        ? 'external-pubparts-resources'
        : 'external-pubparts-parts',
    tags: Array.from(
      new Set(['external', 'pubparts', sourceItem.sourceRecordKind, sourceCollectionTag]),
    ),
    description: 'External PubParts source record cached for Catalog source intake.',
    ...typeClassification,
    assetKind: 'reference-asset',
    actionKind: 'load-preview',
    source: {
      sourceKind: 'external',
      provider: {
        providerId: sourceItem.providerId,
        providerName: sourceItem.providerName,
        sourceCollectionKey: sourceItem.sourceCollectionKey ?? null,
        sourceCollectionLabel: sourceItem.sourceCollectionLabel ?? null,
      },
      sourceUrl: sourceItem.sourceUrl ?? null,
      externalItemUrl: sourceItem.externalItemUrl ?? null,
      previewImageUrl: sourceItem.previewImageUrl ?? null,
      linkedArchiveUrl: sourceItem.linkedArchiveUrl ?? null,
      sourceLastUpdated: sourceItem.sourceLastUpdated ?? null,
      archiveLastUpdated: sourceItem.archiveLastUpdated ?? null,
    },
    previewMedia:
      sourceItem.previewImageUrl === undefined
        ? []
        : [
            {
              mediaKind: 'image',
              src: sourceItem.previewImageUrl,
              alt: `${sourceItem.sourceTitle} preview`,
            },
          ],
    notes: ['External PubParts source record. Final source labeling belongs to a later phase.'],
    metadata: [
      ...buildExternalMetadataRows(sourceItem),
      ...buildCatalogExternalPlatformFitmentMetadataRows(sourceItem.sourceMetadata.platform),
    ],
    platformCompatibility:
      platformCompatibility.length > 0 ? platformCompatibility : undefined,
    projectUsageCount: 0,
  }
}

export function getCatalogExternalPubPartsItems(
  sourceItems: readonly PubPartsNormalizedSourceItem[] = [],
): CatalogItemRecord[] {
  return sourceItems.map(buildCatalogExternalPubPartsItem)
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
  externalInput: CatalogExternalSourceSnapshotInput = {},
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
  const plannedItems = getCatalogPlannedStartingAssemblyItems()
  const externalItems = getCatalogExternalPubPartsItems(externalInput.pubPartsSourceItems ?? [])
  return {
    repoItems,
    importsItems,
    plannedItems,
    externalItems,
    allItems: [...repoItems, ...importsItems, ...plannedItems, ...externalItems],
  }
}

export function selectCatalogItemsForSection(
  snapshot: CatalogSourceSnapshot,
  sectionKey: string,
): CatalogItemRecord[] {
  return snapshot.allItems.filter((item) => item.sectionKey === sectionKey)
}
