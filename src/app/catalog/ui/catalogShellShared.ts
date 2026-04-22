import {
  CATALOG_ITEM_PART_GROUPS,
  isCatalogStartingAssemblyItem,
  type CatalogItemRecord,
} from '../catalogItemContract'
import { resolveCatalogActionPlan } from '../catalogActionPlan'
import type { CatalogSourceSnapshot } from '../catalogSource'
import type {
  PubPartsLocalSourceRecord,
  PubPartsSelectedSupportedFile,
  PubPartsSourceInspectionResult,
  PubPartsStagedSourceRecord,
} from '../pubPartsDownloadsStorage'
import type { ReferenceFileType } from '../../references/referenceManifest'
import type { ImportedReferenceSourceAttribution } from '../../references/importReferenceFile'

export type CatalogBrowseMode = 'part' | 'platform'

export type CatalogFacetSelections = Record<CatalogBrowseMode, string[]>
export type CatalogFacetSelectionMode = 'add' | 'switch'

export type CatalogSectionOption = {
  sectionKey: string
  label: string
  count: number
  description: string
}

export type CatalogBrowseModeOption = {
  browseMode: CatalogBrowseMode
  label: string
  description: string
}

export type CatalogFilterGroupKey =
  | 'systemKey'
  | 'partType'
  | 'brand'
  | 'source'
  | 'availability'
  | 'resourceType'
  | 'localStatus'
  | 'previewStatus'
  | 'fileType'
  | 'position'
  | 'wheelFitment'

export type CatalogSelectedFilters = Partial<Record<CatalogFilterGroupKey, string[]>>

export type CatalogFilterOption = {
  value: string
  count: number
}

export type CatalogFilterGroup = {
  groupKey: CatalogFilterGroupKey
  label: string
  description: string
  options: CatalogFilterOption[]
}

type CatalogFilterGroupDefinition = {
  groupKey: CatalogFilterGroupKey
  label: string
  description: string
  resolveValues: (item: CatalogItemRecord, context: CatalogFilterContext) => string[]
}

export type CatalogFilterContext = {
  previewLoadedItemIds?: readonly string[]
  pubPartsStagedSourcesByCatalogItemId?: ReadonlyMap<string, PubPartsStagedSourceRecord>
  pubPartsLocalSourcesByCatalogItemId?: ReadonlyMap<string, PubPartsLocalSourceRecord>
}

const CATALOG_SUPPORTED_FILTER_FILE_TYPES = new Set([
  'STEP',
  'STP',
  'GLB',
  'OBJ',
  'STL',
  'HDR',
  'EXR',
])

function readCatalogKnownFileType(value: string | null | undefined): string[] {
  const normalizedValue = value?.trim() ?? ''
  if (normalizedValue.length === 0) {
    return []
  }

  const match = normalizedValue
    .split('?')[0]
    .match(/\.([a-z0-9]+)$/i)
  const fileType = match?.[1]?.toUpperCase() ?? ''

  return CATALOG_SUPPORTED_FILTER_FILE_TYPES.has(fileType) ? [fileType] : []
}

function resolveCatalogSourceFilterValues(item: CatalogItemRecord): string[] {
  switch (item.source.sourceKind) {
    case 'repo':
      return ['ParaHook']
    case 'imports':
      return ['Imported']
    case 'external':
      return [item.source.provider.providerName]
    case 'planned':
      return ['Planned']
  }
}

function resolveCatalogAvailabilityFilterValues(item: CatalogItemRecord): string[] {
  const actionPlan = resolveCatalogActionPlan(item)

  return Array.from(
    new Set(
      [actionPlan.primaryAction, actionPlan.secondaryAction]
        .flatMap((action) => (action === null ? [] : [action.label]))
        .filter((label) => label.trim().length > 0),
    ),
  )
}

function resolveCatalogResourceTypeFilterValues(item: CatalogItemRecord): string[] {
  if (isCatalogStartingAssemblyItem(item)) {
    return ['Starting Assembly']
  }

  if (item.assetKind === 'environment') {
    return ['Environment']
  }

  if (item.source.sourceKind === 'imports') {
    return ['Imported Reuse']
  }

  if (item.source.sourceKind === 'external') {
    return ['External Source']
  }

  return ['Part']
}

function resolveCatalogLocalStatusFilterValues(
  item: CatalogItemRecord,
  context: CatalogFilterContext,
): string[] {
  const localStatuses: string[] = []

  if (context.pubPartsLocalSourcesByCatalogItemId?.has(item.itemId)) {
    localStatuses.push('Local Prepared')
  }

  if (context.pubPartsStagedSourcesByCatalogItemId?.has(item.itemId)) {
    localStatuses.push('Source Staged')
  }

  return localStatuses.length > 0 ? localStatuses : ['Not Local']
}

function resolveCatalogPreviewStatusFilterValues(
  item: CatalogItemRecord,
  context: CatalogFilterContext,
): string[] {
  if (context.previewLoadedItemIds?.includes(item.itemId)) {
    return ['Preview Loaded']
  }

  return resolveCatalogActionPlan(item).allowsTemporaryPreview
    ? ['Previewable']
    : ['Not Previewable']
}

function resolveCatalogFileTypeFilterValues(item: CatalogItemRecord): string[] {
  const sourceFileTypes =
    item.source.sourceKind === 'repo'
      ? readCatalogKnownFileType(item.source.assetPath)
      : item.source.sourceKind === 'imports'
        ? readCatalogKnownFileType(item.source.assetPath)
        : item.source.sourceKind === 'external'
          ? [
              ...readCatalogKnownFileType(item.source.linkedArchiveUrl),
              ...readCatalogKnownFileType(item.source.sourceUrl),
              ...readCatalogKnownFileType(item.source.externalItemUrl),
              ...readCatalogKnownFileType(item.source.previewImageUrl),
            ]
          : [
              ...readCatalogKnownFileType(item.source.sourceAssetPath),
              ...(item.source.sourceAssetFormat === 'step-or-stp' ? ['STEP', 'STP'] : []),
              ...(item.source.sourceAssetSet?.versions.flatMap((version) =>
                version.variants.map((variant) => variant.format.toUpperCase()),
              ) ?? []),
            ]

  return Array.from(
    new Set(sourceFileTypes.filter((fileType) => CATALOG_SUPPORTED_FILTER_FILE_TYPES.has(fileType))),
  )
}

function resolveCatalogWheelFitmentFilterValues(item: CatalogItemRecord): string[] {
  if (item.wheelFitment === undefined) {
    return []
  }

  return [
    item.wheelFitment.motorVersion === undefined
      ? ''
      : `Motor: ${item.wheelFitment.motorVersion}`,
    item.wheelFitment.hubSizeInches === undefined
      ? ''
      : `Hub: ${item.wheelFitment.hubSizeInches}`,
    item.wheelFitment.tireSize === undefined ? '' : `Tire: ${item.wheelFitment.tireSize}`,
    item.wheelFitment.tireCompound === undefined
      ? ''
      : `Compound: ${item.wheelFitment.tireCompound}`,
  ].filter((value) => value.trim().length > 0)
}

const CATALOG_FILTER_GROUP_DEFINITIONS: CatalogFilterGroupDefinition[] = [
  {
    groupKey: 'partType',
    label: 'Part Type',
    description: 'Local part type metadata from the shared item contract.',
    resolveValues: (item) => (item.partType === undefined ? [] : [item.partType]),
  },
  {
    groupKey: 'systemKey',
    label: 'System',
    description: 'Local organizer values such as Platform, Wheel, and Hardware.',
    resolveValues: (item) => (item.systemKey === undefined ? [] : [item.systemKey]),
  },
  {
    groupKey: 'brand',
    label: 'Brand',
    description: 'Brand metadata kept on the shared catalog item contract.',
    resolveValues: (item) => (item.brand === undefined ? [] : [item.brand]),
  },
  {
    groupKey: 'source',
    label: 'Source',
    description: 'Catalog ownership such as ParaHook, PubParts, Imported, and Planned.',
    resolveValues: (item) => resolveCatalogSourceFilterValues(item),
  },
  {
    groupKey: 'availability',
    label: 'Availability',
    description: 'Available and planned actions such as Add To Project or Load Preview.',
    resolveValues: (item) => resolveCatalogAvailabilityFilterValues(item),
  },
  {
    groupKey: 'resourceType',
    label: 'Resource Type',
    description: 'Part, starting assembly, environment, imported reuse, or external source.',
    resolveValues: (item) => resolveCatalogResourceTypeFilterValues(item),
  },
  {
    groupKey: 'localStatus',
    label: 'Local Status',
    description: 'Local-library and staged-source status for Catalog entries.',
    resolveValues: (item, context) => resolveCatalogLocalStatusFilterValues(item, context),
  },
  {
    groupKey: 'previewStatus',
    label: 'Preview Status',
    description: 'Preview-loaded, previewable, or not-previewable Catalog entries.',
    resolveValues: (item, context) => resolveCatalogPreviewStatusFilterValues(item, context),
  },
  {
    groupKey: 'fileType',
    label: 'File Type',
    description: 'Known source and asset formats such as STEP, GLB, STL, HDR, and EXR.',
    resolveValues: (item) => resolveCatalogFileTypeFilterValues(item),
  },
  {
    groupKey: 'position',
    label: 'Position',
    description: 'Catalog position metadata such as Front, Rear, Pair, and Universal.',
    resolveValues: (item) => (item.position === undefined ? [] : [item.position]),
  },
  {
    groupKey: 'wheelFitment',
    label: 'Wheel Fitment',
    description: 'Wheel-specific motor, hub, tire, and compound values where known.',
    resolveValues: (item) => resolveCatalogWheelFitmentFilterValues(item),
  },
]

export type CatalogContentMode = 'grid' | 'item-page' | 'catalog-info'

export type CatalogNavigationSnapshot = {
  contentMode: CatalogContentMode
  selectedItemId: string | null
  selectedItemIds: string[]
  browseMode: CatalogBrowseMode
  facetSelections: CatalogFacetSelections
  facetSelectionMode: CatalogFacetSelectionMode
  searchText: string
  selectedFilters: CatalogSelectedFilters
}

export type CatalogNavigationHistoryState = {
  entries: CatalogNavigationSnapshot[]
  activeIndex: number
}

const areCatalogStringArraysEqual = (first: readonly string[], second: readonly string[]) =>
  first.length === second.length && first.every((value, index) => value === second[index])

function areCatalogSelectedFiltersEqual(
  first: CatalogSelectedFilters,
  second: CatalogSelectedFilters,
): boolean {
  const firstKeys = Object.keys(first).sort() as CatalogFilterGroupKey[]
  const secondKeys = Object.keys(second).sort() as CatalogFilterGroupKey[]

  return (
    areCatalogStringArraysEqual(firstKeys, secondKeys) &&
    firstKeys.every((groupKey) =>
      areCatalogStringArraysEqual(first[groupKey] ?? [], second[groupKey] ?? []),
    )
  )
}

export function areCatalogNavigationSnapshotsEqual(
  first: CatalogNavigationSnapshot,
  second: CatalogNavigationSnapshot,
): boolean {
  return (
    first.contentMode === second.contentMode &&
    first.selectedItemId === second.selectedItemId &&
    first.browseMode === second.browseMode &&
    first.facetSelectionMode === second.facetSelectionMode &&
    first.searchText === second.searchText &&
    areCatalogStringArraysEqual(first.selectedItemIds, second.selectedItemIds) &&
    areCatalogStringArraysEqual(first.facetSelections.platform, second.facetSelections.platform) &&
    areCatalogStringArraysEqual(first.facetSelections.part, second.facetSelections.part) &&
    areCatalogSelectedFiltersEqual(first.selectedFilters, second.selectedFilters)
  )
}

export function createCatalogNavigationHistory(
  initialSnapshot: CatalogNavigationSnapshot,
): CatalogNavigationHistoryState {
  return {
    entries: [initialSnapshot],
    activeIndex: 0,
  }
}

export function commitCatalogNavigationSnapshot(
  currentHistory: CatalogNavigationHistoryState,
  nextSnapshot: CatalogNavigationSnapshot,
  mode: 'push' | 'replace',
): CatalogNavigationHistoryState {
  const currentSnapshot = currentHistory.entries[currentHistory.activeIndex]
  if (
    currentSnapshot !== undefined &&
    areCatalogNavigationSnapshotsEqual(currentSnapshot, nextSnapshot)
  ) {
    return currentHistory
  }

  if (mode === 'replace') {
    return {
      entries: [...currentHistory.entries.slice(0, currentHistory.activeIndex), nextSnapshot],
      activeIndex: currentHistory.activeIndex,
    }
  }

  return {
    entries: [...currentHistory.entries.slice(0, currentHistory.activeIndex + 1), nextSnapshot],
    activeIndex: currentHistory.activeIndex + 1,
  }
}

export function stepCatalogNavigationHistory(
  currentHistory: CatalogNavigationHistoryState,
  direction: 'back' | 'forward',
): {
  history: CatalogNavigationHistoryState
  snapshot: CatalogNavigationSnapshot
} | null {
  const nextIndex =
    direction === 'back' ? currentHistory.activeIndex - 1 : currentHistory.activeIndex + 1
  const snapshot = currentHistory.entries[nextIndex]

  if (snapshot === undefined) {
    return null
  }

  return {
    history: {
      ...currentHistory,
      activeIndex: nextIndex,
    },
    snapshot,
  }
}

export const resolveCatalogBrowseModeLabel = (browseMode: CatalogBrowseMode): string =>
  browseMode === 'part' ? 'Part' : 'Platform'

export const resolveCatalogBrowseModeDescription = (browseMode: CatalogBrowseMode): string =>
  browseMode === 'part'
    ? 'Part facet filters by part family, part type, position, and local part-group metadata.'
    : 'Platform facet filters by system ownership and platform compatibility metadata.'

export function buildCatalogBrowseModeOptions(): CatalogBrowseModeOption[] {
  return (['part', 'platform'] as const).map((browseMode) => ({
    browseMode,
    label: resolveCatalogBrowseModeLabel(browseMode),
    description: resolveCatalogBrowseModeDescription(browseMode),
  }))
}

function resolveCatalogBrowseSectionKeys(
  item: CatalogItemRecord,
  browseMode: CatalogBrowseMode,
): string[] {
  if (item.source.sourceKind === 'imports') {
    return ['imports']
  }

  if (item.assetKind === 'environment') {
    return ['hdris']
  }

  const browseSectionKeys =
    browseMode === 'platform'
      ? item.platformCompatibility?.length
        ? item.platformCompatibility
        : ['Other']
      : item.partGroups?.length
        ? item.partGroups
        : [item.partType ?? item.familyKey]

  return Array.from(new Set(browseSectionKeys))
}

function normalizeCatalogFacetSelections(
  activeSectionOrSelections: string | CatalogFacetSelections,
  browseMode: CatalogBrowseMode,
): CatalogFacetSelections {
  if (typeof activeSectionOrSelections !== 'string') {
    return activeSectionOrSelections
  }

  return {
    part: browseMode === 'part' ? [activeSectionOrSelections] : ['all'],
    platform: browseMode === 'platform' ? [activeSectionOrSelections] : ['all'],
  }
}

function matchesCatalogFacetSelections(
  item: CatalogItemRecord,
  facetSelections: CatalogFacetSelections,
): boolean {
  return (['platform', 'part'] as const).every((browseMode) => {
    const selectedSectionKeys = facetSelections[browseMode] ?? []
    const concreteSelectedSectionKeys = selectedSectionKeys.filter(
      (sectionKey) => sectionKey !== 'all',
    )

    if (selectedSectionKeys.includes('all') || concreteSelectedSectionKeys.length === 0) {
      return true
    }

    const itemSectionKeys = resolveCatalogBrowseSectionKeys(item, browseMode)
    return concreteSelectedSectionKeys.some((sectionKey) => itemSectionKeys.includes(sectionKey))
  })
}

function resolveCatalogBaseItems(
  snapshot: CatalogSourceSnapshot,
  activeSectionOrSelections: string | CatalogFacetSelections,
  browseMode: CatalogBrowseMode,
): CatalogItemRecord[] {
  const facetSelections = normalizeCatalogFacetSelections(
    activeSectionOrSelections,
    browseMode,
  )

  return snapshot.allItems.filter((item) =>
    matchesCatalogFacetSelections(item, facetSelections),
  )
}

function resolveCatalogItemSearchableParts(item: CatalogItemRecord): string[] {
  return [
    item.label,
    item.familyKey,
    item.sectionKey,
    item.description,
    ...item.tags,
    ...(item.notes ?? []),
    ...((item.metadata ?? []).flatMap((entry) => [entry.label, entry.value])),
  ]
}

function resolveCatalogSearchFilteredItems(
  items: CatalogItemRecord[],
  searchText: string,
): CatalogItemRecord[] {
  const normalizedSearchText = searchText.trim().toLowerCase()

  if (normalizedSearchText.length === 0) {
    return items
  }

  return items.filter((item) =>
    resolveCatalogItemSearchableParts(item).some((part) =>
      part.toLowerCase().includes(normalizedSearchText),
    ),
  )
}

function resolveCatalogItemFilterValues(
  item: CatalogItemRecord,
  context: CatalogFilterContext = {},
): Record<CatalogFilterGroupKey, string[]> {
  return CATALOG_FILTER_GROUP_DEFINITIONS.reduce<Record<CatalogFilterGroupKey, string[]>>(
    (valuesByGroup, definition) => {
      valuesByGroup[definition.groupKey] = definition.resolveValues(item, context)
      return valuesByGroup
    },
    {
      systemKey: [],
      partType: [],
      brand: [],
      source: [],
      availability: [],
      resourceType: [],
      localStatus: [],
      previewStatus: [],
      fileType: [],
      position: [],
      wheelFitment: [],
    },
  )
}

function matchesCatalogSelectedFilters(
  item: CatalogItemRecord,
  selectedFilters: CatalogSelectedFilters,
  context: CatalogFilterContext = {},
): boolean {
  const valuesByGroup = resolveCatalogItemFilterValues(item, context)

  return Object.entries(selectedFilters).every(([groupKey, selectedValues]) => {
    if (selectedValues === undefined || selectedValues.length === 0) {
      return true
    }

    const candidateValues = valuesByGroup[groupKey as CatalogFilterGroupKey] ?? []
    return selectedValues.some((selectedValue) => candidateValues.includes(selectedValue))
  })
}

export const formatCatalogSectionLabel = (sectionKey: string): string =>
  sectionKey
    .split('-')
    .map((part) => (part.length > 0 ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ')

export const formatCatalogFamilyLabel = (familyKey: string): string =>
  formatCatalogSectionLabel(familyKey)

export type CatalogSourceDetailRow = {
  label: string
  value: string
}

function formatCatalogFileSize(fileSizeBytes: number | null | undefined): string {
  return fileSizeBytes === undefined || fileSizeBytes === null
    ? ''
    : `${(fileSizeBytes / 1_000_000).toFixed(1)} MB`
}

export type CatalogLinkedArchiveHandoffState =
  | 'no-linked-archive'
  | 'linked-archive-available'
  | 'linked-archive-planned'

export type CatalogLinkedArchiveHandoff = {
  state: CatalogLinkedArchiveHandoffState
  label: string
  description: string
  url: string | null
  isUserInspectable: boolean
}

export type CatalogLinkedArchiveClassificationKind =
  | 'no-linked-archive'
  | 'supported-model-candidate'
  | 'archive-container-inspect-needed'
  | 'unsupported-file-candidate'
  | 'unknown-linked-candidate'

export type CatalogLinkedArchiveClassification = {
  kind: CatalogLinkedArchiveClassificationKind
  label: string
  description: string
  url: string | null
  fileExtension: string | null
  isSupportedModelCandidate: boolean
  requiresArchiveInspection: boolean
}

export type CatalogExternalSourceActionBoundaryState =
  | 'not-external-pubparts'
  | 'source-link-stage-ready'
  | 'source-link-staged'
  | 'no-source-candidate'

export type CatalogExternalSourceActionBoundary = {
  state: CatalogExternalSourceActionBoundaryState
  label: string
  description: string
  candidateUrl: string | null
  isAvailable: false
}

export type CatalogPubPartsStagedSourceInspectionRead = {
  label: string
  description: string
  sourceCandidateUrl: string
  fileExtension: string | null
  requiresArchiveInspection: boolean
  isMetadataInspected: boolean
}

export type CatalogPubPartsSupportedFileChooserState =
  | 'not-inspected'
  | 'supported-file-choice-ready'
  | 'supported-file-selected'
  | 'archive-source-needs-inspection'
  | 'unsupported-source-candidate'
  | 'unknown-source-candidate'

export type CatalogPubPartsSupportedFileChooserRead = {
  state: CatalogPubPartsSupportedFileChooserState
  label: string
  description: string
  sourceCandidateUrl: string
  fileExtension: string | null
  selectedSupportedFile: PubPartsSelectedSupportedFile | null
  isSelectable: boolean
}

export type CatalogSelectedPubPartsImportHandoffState =
  | 'not-external-pubparts'
  | 'no-staged-source'
  | 'no-selected-supported-file'
  | 'selected-file-import-handoff-planned'
  | 'selected-file-import-type-needs-import-support'

export type CatalogSelectedPubPartsImportHandoffAttribution = {
  providerId: 'pubparts'
  providerName: 'PubParts'
  catalogItemId: string
  catalogItemLabel: string
  sourceCollectionKey?: string
  sourceCollectionLabel?: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  externalItemUrl?: string
  sourceUrl?: string
  previewImageUrl?: string
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceMetadata: PubPartsStagedSourceRecord['sourceMetadata']
  binaryStatus: PubPartsStagedSourceRecord['binaryStatus']
  importStatus: PubPartsStagedSourceRecord['importStatus']
}

export type CatalogSelectedPubPartsImportHandoff = {
  state: CatalogSelectedPubPartsImportHandoffState
  label: string
  description: string
  selectedFileUrl: string | null
  selectedFileType: PubPartsSelectedSupportedFile['fileExtension'] | null
  selectedFile: PubPartsSelectedSupportedFile | null
  sourceAttribution: CatalogSelectedPubPartsImportHandoffAttribution | null
  importOwner: 'import-family' | null
  canCreateProjectAsset: false
}

export type CatalogPubPartsSourceDownloadHandoffState =
  | 'not-external-pubparts'
  | 'no-source-download'
  | 'source-download-ready'

export type CatalogPubPartsSourceDownloadHandoff = {
  state: CatalogPubPartsSourceDownloadHandoffState
  label: string
  description: string
  sourceUrl: string | null
  downloadUrl: string | null
  canOpenDownload: boolean
}

export type CatalogPubPartsDropboxChooserStatusState =
  | 'idle'
  | 'chooser-opening'
  | 'fetching-selected-file'
  | 'ready-for-import-review'
  | 'chooser-canceled'
  | 'chooser-unavailable'
  | 'unsupported-dropbox-file'
  | 'fetch-failed'
  | 'import-type-unsupported'

export type CatalogPubPartsDropboxChooserStatus = {
  state: CatalogPubPartsDropboxChooserStatusState
  label: string
  description: string
  fileName?: string
}

const CATALOG_SUPPORTED_LINKED_MODEL_EXTENSIONS = new Set<ReferenceFileType | 'stp'>([
  'glb',
  'obj',
  'stl',
  'step',
  'stp',
])

const CATALOG_CURRENT_IMPORT_HANDOFF_FILE_TYPES = new Set<ReferenceFileType>([
  'glb',
  'obj',
  'stl',
  'step',
])

const CATALOG_SHARED_ARCHIVE_HOST_PATTERNS = ['dropbox.com']

const formatCatalogExternalProviderLabel = (item: CatalogItemRecord): string =>
  item.source.sourceKind === 'external' ? item.source.provider.providerName : 'External'

export const resolveCatalogItemSourceLabel = (item: CatalogItemRecord): string => {
  switch (item.source.sourceKind) {
    case 'repo':
      return 'Repo-backed'
    case 'imports':
      return 'Imports reuse'
    case 'external':
      return `External-linked ${formatCatalogExternalProviderLabel(item)}`
    case 'planned':
      return 'Planned source'
  }
}

export const resolveCatalogItemModeLabel = (item: CatalogItemRecord): string => {
  if (isCatalogStartingAssemblyItem(item)) {
    return 'Starting Assembly'
  }

  switch (item.source.sourceKind) {
    case 'repo':
      return 'Catalog Item'
    case 'imports':
      return 'Imports Reuse'
    case 'external':
      return 'External Linked Source'
    case 'planned':
      return 'Planned Source'
  }
}

export const resolveCatalogItemSectionLabel = (item: CatalogItemRecord): string => {
  switch (item.source.sourceKind) {
    case 'imports':
      return 'Imports'
    case 'external':
      return `${formatCatalogExternalProviderLabel(item)} External`
    case 'planned':
      return 'Planned Starting Assembly'
    case 'repo':
      return formatCatalogSectionLabel(item.sectionKey)
  }
}

export function buildCatalogItemSourceDetails(item: CatalogItemRecord): CatalogSourceDetailRow[] {
  switch (item.source.sourceKind) {
    case 'repo':
      return [{ label: 'Repo Asset Path', value: item.source.assetPath }]
    case 'imports':
      return [
        { label: 'Import Source', value: item.source.importId },
        { label: 'Import Asset Path', value: item.source.assetPath },
        { label: 'Remembered Catalog Item', value: item.source.catalogItemId ?? '' },
      ].filter((entry) => entry.value.trim().length > 0)
    case 'external':
      return [
        { label: 'External Provider', value: item.source.provider.providerName },
        {
          label: 'Source Collection',
          value:
            item.source.provider.sourceCollectionLabel ??
            item.source.provider.sourceCollectionKey ??
            '',
        },
        { label: 'Source URL', value: item.source.sourceUrl ?? '' },
        { label: 'External Item URL', value: item.source.externalItemUrl ?? '' },
        { label: 'Preview Image URL', value: item.source.previewImageUrl ?? '' },
        { label: 'Linked Archive URL', value: item.source.linkedArchiveUrl ?? '' },
        { label: 'Source Updated', value: item.source.sourceLastUpdated ?? '' },
        { label: 'Archive Updated', value: item.source.archiveLastUpdated ?? '' },
      ].filter((entry) => entry.value.trim().length > 0)
    case 'planned':
      return [
        { label: 'Planned Source', value: item.source.sourceLabel },
        { label: 'Source Candidate Path', value: item.source.sourceAssetPath ?? '' },
        {
          label: 'Source Format',
          value:
            item.source.sourceAssetFormat === 'step-or-stp'
              ? 'STEP/STP preferred source asset'
              : '',
        },
        {
          label: 'Source File Size',
          value: formatCatalogFileSize(item.source.sourceFileSizeBytes),
        },
        {
          label: 'Source Status',
          value:
            item.source.sourceStatus === 'known-heavy-source'
              ? 'Known heavy source - Add To Project imports source; preview and starting-configuration load are planned'
              : '',
        },
        ...buildCatalogSourceAssetSetDetails(item),
      ].filter((entry) => entry.value.trim().length > 0)
  }
}

export function buildCatalogSourceAssetSetDetails(
  item: CatalogItemRecord,
): CatalogSourceDetailRow[] {
  if (item.source.sourceKind !== 'planned' || item.source.sourceAssetSet === undefined) {
    return []
  }

  const sourceAssetSet = item.source.sourceAssetSet
  const currentVersion =
    sourceAssetSet.versions.find(
      (version) => version.versionId === sourceAssetSet.currentVersionId,
    ) ?? sourceAssetSet.versions[0] ?? null

  if (currentVersion === null) {
    return [
      { label: 'Source Identity', value: sourceAssetSet.sourceId },
      { label: 'Current Source Version', value: sourceAssetSet.currentVersionId },
    ].filter((entry) => entry.value.trim().length > 0)
  }

  const formatVariantValue = (variantRole: string): string => {
    const variant = currentVersion.variants.find(
      (candidateVariant) => candidateVariant.role === variantRole,
    )

    if (variant === undefined) {
      return ''
    }

    return [
      variant.label ?? '',
      variant.format.toUpperCase(),
      variant.sourcePath,
      formatCatalogFileSize(variant.fileSizeBytes),
    ]
      .filter((part) => part.trim().length > 0)
      .join(' - ')
  }

  return [
    { label: 'Source Identity', value: sourceAssetSet.sourceId },
    {
      label: 'Current Source Version',
      value: `${currentVersion.versionLabel} (${currentVersion.versionId})`,
    },
    { label: 'Source Version Status', value: currentVersion.status },
    { label: 'Preferred Source Variant', value: formatVariantValue('preferred-source') },
    { label: 'Companion Mesh Variant', value: formatVariantValue('companion-mesh') },
  ].filter((entry) => entry.value.trim().length > 0)
}

export function buildCatalogWheelFitmentDetails(item: CatalogItemRecord): CatalogSourceDetailRow[] {
  if (item.systemKey !== 'Wheel' || item.wheelFitment === undefined) {
    return []
  }

  return [
    { label: 'Motor Version', value: item.wheelFitment.motorVersion ?? '' },
    { label: 'Hub Size', value: item.wheelFitment.hubSizeInches ?? '' },
    { label: 'Tire Size', value: item.wheelFitment.tireSize ?? '' },
    { label: 'Tire Compound', value: item.wheelFitment.tireCompound ?? '' },
  ].filter((entry) => entry.value.trim().length > 0)
}

export function buildCatalogStartingAssemblyDetails(
  item: CatalogItemRecord,
): CatalogSourceDetailRow[] {
  if (!isCatalogStartingAssemblyItem(item)) {
    return []
  }

  const sourceAssetPreference =
    item.startingAssembly?.sourceAssetPreference === 'step-or-stp'
      ? 'STEP/STP preferred source asset'
      : ''

  return [
    { label: 'Catalog Role', value: 'Starting Assembly' },
    {
      label: 'Starting Configuration',
      value: 'Planned - load-as-starting-configuration is not wired yet',
    },
    { label: 'Platform Family', value: item.startingAssembly?.platformFamily ?? '' },
    { label: 'Source Asset Preference', value: sourceAssetPreference },
  ].filter((entry) => entry.value.trim().length > 0)
}

export function resolveCatalogExternalSourcePageUrl(item: CatalogItemRecord): string | null {
  if (item.source.sourceKind !== 'external') {
    return null
  }

  const externalItemUrl = item.source.externalItemUrl?.trim() ?? ''
  if (externalItemUrl.length > 0) {
    return externalItemUrl
  }

  const sourceUrl = item.source.sourceUrl?.trim() ?? ''
  return sourceUrl.length > 0 ? sourceUrl : null
}

export function resolveCatalogExternalSourceActionBoundary(
  item: CatalogItemRecord,
  stagedRecord: PubPartsStagedSourceRecord | null = null,
): CatalogExternalSourceActionBoundary {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return {
      state: 'not-external-pubparts',
      label: 'No External PubParts Source Action',
      description: 'This Catalog entry is not an external PubParts source entry.',
      candidateUrl: null,
      isAvailable: false,
    }
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return {
      state: 'no-source-candidate',
      label: 'No Source Candidate',
      description:
        'This external PubParts entry has no linked source candidate for a future staging or inspection action.',
      candidateUrl: null,
      isAvailable: false,
    }
  }

  if (stagedRecord !== null) {
    return {
      state: 'source-link-staged',
      label: 'Source Link Staged',
      description:
        'This PubParts source link is staged as metadata only. Source bytes are not downloaded, files are not inspected, and no project asset has been imported.',
      candidateUrl: linkedArchiveUrl,
      isAvailable: false,
    }
  }

  return {
    state: 'source-link-stage-ready',
    label: 'Stage Source Link',
    description:
      'Stage this PubParts source link as metadata for later inspection. ParaHook will not download, inspect, extract, import, or commit files in this step.',
    candidateUrl: linkedArchiveUrl,
    isAvailable: false,
  }
}

export function resolveCatalogLinkedArchiveHandoff(
  item: CatalogItemRecord,
): CatalogLinkedArchiveHandoff {
  if (item.source.sourceKind !== 'external') {
    return {
      state: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no external archive link metadata.',
      url: null,
      isUserInspectable: false,
    }
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return {
      state: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This external source record has no linked archive URL metadata.',
      url: null,
      isUserInspectable: false,
    }
  }

  return {
    state: 'linked-archive-available',
    label: 'Linked Archive Metadata Available',
    description:
      'External archive link metadata exists for source inspection only. ParaHook has not downloaded, extracted, imported, or classified this archive.',
    url: linkedArchiveUrl,
    isUserInspectable: true,
  }
}

function resolveLinkedArchiveUrlParts(url: string): { hostname: string; path: string } {
  try {
    const parsedUrl = new URL(url)
    return {
      hostname: parsedUrl.hostname.toLowerCase(),
      path: parsedUrl.pathname,
    }
  } catch {
    const withoutQuery = url.split(/[?#]/u)[0] ?? ''
    return {
      hostname: '',
      path: withoutQuery,
    }
  }
}

function resolveLinkedArchiveExtension(path: string): string | null {
  const lastPathPart = path.split('/').filter((part) => part.length > 0).at(-1) ?? ''
  const extensionMatch = /\.([a-z0-9]+)$/iu.exec(lastPathPart)
  return extensionMatch?.[1]?.toLowerCase() ?? null
}

function isSharedArchiveHost(hostname: string): boolean {
  return CATALOG_SHARED_ARCHIVE_HOST_PATTERNS.some(
    (hostPattern) => hostname === hostPattern || hostname.endsWith(`.${hostPattern}`),
  )
}

export function resolveCatalogLinkedArchiveClassification(
  item: CatalogItemRecord,
): CatalogLinkedArchiveClassification {
  if (item.source.sourceKind !== 'external') {
    return {
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no linked archive metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    }
  }

  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  if (linkedArchiveUrl.length === 0) {
    return {
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This external source record has no linked archive URL metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    }
  }

  const { hostname, path } = resolveLinkedArchiveUrlParts(linkedArchiveUrl)
  const fileExtension = resolveLinkedArchiveExtension(path)

  if (isSharedArchiveHost(hostname) || fileExtension === 'zip') {
    return {
      kind: 'archive-container-inspect-needed',
      label: 'Archive Container - Inspection Needed',
      description:
        'This linked URL points to an archive or shared source. ParaHook has not downloaded, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      url: linkedArchiveUrl,
      fileExtension,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: true,
    }
  }

  if (
    fileExtension !== null &&
    CATALOG_SUPPORTED_LINKED_MODEL_EXTENSIONS.has(fileExtension as ReferenceFileType | 'stp')
  ) {
    return {
      kind: 'supported-model-candidate',
      label: 'Supported Model Candidate',
      description:
        'This linked URL looks like a supported model file candidate from metadata only. ParaHook has not downloaded, imported, or added it to the project.',
      url: linkedArchiveUrl,
      fileExtension,
      isSupportedModelCandidate: true,
      requiresArchiveInspection: false,
    }
  }

  if (fileExtension !== null) {
    return {
      kind: 'unsupported-file-candidate',
      label: 'Unsupported File Candidate',
      description:
        'This linked URL has a file extension that is not currently supported as a direct Catalog model import candidate.',
      url: linkedArchiveUrl,
      fileExtension,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    }
  }

  return {
    kind: 'unknown-linked-candidate',
    label: 'Unknown Linked Candidate',
    description:
      'This linked URL does not expose a reliable file extension from metadata, so ParaHook cannot classify it without a later inspection step.',
    url: linkedArchiveUrl,
    fileExtension: null,
    isSupportedModelCandidate: false,
    requiresArchiveInspection: false,
  }
}

export function resolveCatalogPubPartsStagedSourceInspectionRead(
  record: PubPartsStagedSourceRecord,
): CatalogPubPartsStagedSourceInspectionRead {
  if (record.inspectionStatus !== 'metadata-inspected' || record.inspectionResult === undefined) {
    return {
      label: 'Not inspected',
      description:
        'This PubParts source link is staged as metadata only. Source bytes are not downloaded, files are not inspected, and no project asset has been imported.',
      sourceCandidateUrl: record.sourceCandidateUrl,
      fileExtension: null,
      requiresArchiveInspection: false,
      isMetadataInspected: false,
    }
  }

  const inspectionResult: PubPartsSourceInspectionResult = record.inspectionResult
  return {
    label: inspectionResult.label,
    description: inspectionResult.description,
    sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
    fileExtension: inspectionResult.fileExtension ?? null,
    requiresArchiveInspection: inspectionResult.requiresArchiveInspection,
    isMetadataInspected: true,
  }
}

export function resolveCatalogPubPartsSupportedFileChooserRead(
  record: PubPartsStagedSourceRecord,
): CatalogPubPartsSupportedFileChooserRead {
  if (record.inspectionStatus !== 'metadata-inspected' || record.inspectionResult === undefined) {
    return {
      state: 'not-inspected',
      label: 'Inspect staged source first',
      description: 'Inspect staged source metadata before choosing supported files.',
      sourceCandidateUrl: record.sourceCandidateUrl,
      fileExtension: null,
      selectedSupportedFile: null,
      isSelectable: false,
    }
  }

  const inspectionResult = record.inspectionResult

  if (
    inspectionResult.kind === 'supported-direct-file-candidate' &&
    inspectionResult.supportedFileType !== undefined
  ) {
    if (record.selectedSupportedFile !== undefined) {
      return {
        state: 'supported-file-selected',
        label: 'Supported Source File Selected',
        description:
          'Supported source file selected for later import handoff. ParaHook has not downloaded, imported, or added it to the project.',
        sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
        fileExtension: inspectionResult.supportedFileType,
        selectedSupportedFile: record.selectedSupportedFile,
        isSelectable: false,
      }
    }

    return {
      state: 'supported-file-choice-ready',
      label: 'Choose Supported Source File',
      description:
        'This direct source URL can be selected as metadata for a later import handoff. ParaHook will not download, import, or add it to the project in this step.',
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileExtension: inspectionResult.supportedFileType,
      selectedSupportedFile: null,
      isSelectable: true,
    }
  }

  if (inspectionResult.kind === 'archive-source-needs-inspection') {
    return {
      state: 'archive-source-needs-inspection',
      label: 'No Selectable Supported File',
      description:
        'No selectable supported file yet. Archive or shared-source contents are unknown until later inspection can list files.',
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileExtension: inspectionResult.fileExtension ?? null,
      selectedSupportedFile: null,
      isSelectable: false,
    }
  }

  if (inspectionResult.kind === 'unsupported-direct-file-candidate') {
    return {
      state: 'unsupported-source-candidate',
      label: 'No Supported Direct File',
      description: 'No supported direct file candidate from current source metadata.',
      sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
      fileExtension: inspectionResult.fileExtension ?? null,
      selectedSupportedFile: null,
      isSelectable: false,
    }
  }

  return {
    state: 'unknown-source-candidate',
    label: 'No Selectable Supported File',
    description: 'No selectable supported file from current URL metadata.',
    sourceCandidateUrl: inspectionResult.sourceCandidateUrl,
    fileExtension: inspectionResult.fileExtension ?? null,
    selectedSupportedFile: null,
    isSelectable: false,
  }
}

function resolvePubPartsBrowserDownloadUrl(sourceUrl: string): string {
  try {
    const parsedUrl = new URL(sourceUrl)
    const hostname = parsedUrl.hostname.toLowerCase()
    if (
      hostname === 'dropbox.com' ||
      hostname.endsWith('.dropbox.com')
    ) {
      parsedUrl.searchParams.set('dl', '1')
      return parsedUrl.toString()
    }
  } catch {
    return sourceUrl
  }

  return sourceUrl
}

export function resolveCatalogPubPartsSourceDownloadHandoff(
  item: CatalogItemRecord,
  stagedRecord: PubPartsStagedSourceRecord | null = null,
): CatalogPubPartsSourceDownloadHandoff {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return {
      state: 'not-external-pubparts',
      label: 'No PubParts Source Download',
      description: 'This Catalog entry is not an external PubParts source entry.',
      sourceUrl: null,
      downloadUrl: null,
      canOpenDownload: false,
    }
  }

  const stagedCandidateUrl =
    stagedRecord !== null && stagedRecord.catalogItemId === item.itemId
      ? stagedRecord.sourceCandidateUrl.trim()
      : ''
  const linkedArchiveUrl = item.source.linkedArchiveUrl?.trim() ?? ''
  const sourceUrl = stagedCandidateUrl.length > 0 ? stagedCandidateUrl : linkedArchiveUrl
  if (sourceUrl.length === 0) {
    return {
      state: 'no-source-download',
      label: 'No Source Download',
      description:
        'This PubParts entry has no linked source candidate to open or download.',
      sourceUrl: null,
      downloadUrl: null,
      canOpenDownload: false,
    }
  }

  return {
    state: 'source-download-ready',
    label: 'Open Source Download',
    description:
      'Opens the PubParts source candidate in the browser. ParaHook has not downloaded, inspected, extracted, imported, or committed source bytes.',
    sourceUrl,
    downloadUrl: resolvePubPartsBrowserDownloadUrl(sourceUrl),
    canOpenDownload: true,
  }
}

export function resolveCatalogPubPartsDropboxChooserStatusRead(
  status: CatalogPubPartsDropboxChooserStatus | null,
): CatalogPubPartsDropboxChooserStatus {
  if (status === null) {
    return {
      state: 'idle',
      label: 'Open Source Options',
      description:
        'Add To Project opens the PubParts source options window for this link. Pick one, some, or all supported files, then ParaHook stages them in Import review with PubParts attribution.',
    }
  }

  return status
}

export function buildCatalogPubPartsImportedReferenceSourceAttribution(
  record: PubPartsStagedSourceRecord,
): ImportedReferenceSourceAttribution {
  return {
    sourceKind: 'external-catalog',
    providerId: record.providerId,
    providerName: record.providerName,
    catalogItemId: record.catalogItemId,
    catalogItemLabel: record.catalogItemLabel,
    sourceCollectionKey: record.sourceCollectionKey,
    sourceCollectionLabel: record.sourceCollectionLabel,
    sourceCandidateUrl: record.sourceCandidateUrl,
    linkedArchiveUrl: record.linkedArchiveUrl,
    sourcePageUrl: record.sourcePageUrl,
    externalItemUrl: record.externalItemUrl,
    sourceUrl: record.sourceUrl,
    previewImageUrl: record.previewImageUrl,
    sourceLastUpdated: record.sourceLastUpdated,
    archiveLastUpdated: record.archiveLastUpdated,
  }
}

function buildCatalogSelectedPubPartsImportHandoffAttribution(
  record: PubPartsStagedSourceRecord,
): CatalogSelectedPubPartsImportHandoffAttribution {
  return {
    providerId: record.providerId,
    providerName: record.providerName,
    catalogItemId: record.catalogItemId,
    catalogItemLabel: record.catalogItemLabel,
    sourceCollectionKey: record.sourceCollectionKey,
    sourceCollectionLabel: record.sourceCollectionLabel,
    sourceCandidateUrl: record.sourceCandidateUrl,
    linkedArchiveUrl: record.linkedArchiveUrl,
    sourcePageUrl: record.sourcePageUrl,
    externalItemUrl: record.externalItemUrl,
    sourceUrl: record.sourceUrl,
    previewImageUrl: record.previewImageUrl,
    sourceLastUpdated: record.sourceLastUpdated,
    archiveLastUpdated: record.archiveLastUpdated,
    sourceMetadata: record.sourceMetadata,
    binaryStatus: record.binaryStatus,
    importStatus: record.importStatus,
  }
}

export function resolveCatalogSelectedPubPartsImportHandoff(
  item: CatalogItemRecord,
  stagedRecord: PubPartsStagedSourceRecord | null = null,
): CatalogSelectedPubPartsImportHandoff {
  if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
    return {
      state: 'not-external-pubparts',
      label: 'No PubParts Import Handoff',
      description: 'This Catalog entry is not an external PubParts source entry.',
      selectedFileUrl: null,
      selectedFileType: null,
      selectedFile: null,
      sourceAttribution: null,
      importOwner: null,
      canCreateProjectAsset: false,
    }
  }

  if (stagedRecord === null || stagedRecord.catalogItemId !== item.itemId) {
    return {
      state: 'no-staged-source',
      label: 'No Staged Source For Import',
      description:
        'Stage and inspect a PubParts source link before selecting a supported file for import handoff.',
      selectedFileUrl: null,
      selectedFileType: null,
      selectedFile: null,
      sourceAttribution: null,
      importOwner: null,
      canCreateProjectAsset: false,
    }
  }

  const sourceAttribution = buildCatalogSelectedPubPartsImportHandoffAttribution(stagedRecord)
  const selectedSupportedFile = stagedRecord.selectedSupportedFile ?? null

  if (selectedSupportedFile === null) {
    return {
      state: 'no-selected-supported-file',
      label: 'No Selected File For Import',
      description:
        'Choose a supported direct source file before import handoff. Archive, shared-source, unsupported, and unknown records do not create import candidates by themselves.',
      selectedFileUrl: null,
      selectedFileType: null,
      selectedFile: null,
      sourceAttribution,
      importOwner: null,
      canCreateProjectAsset: false,
    }
  }

  if (selectedSupportedFile.fileExtension === 'stp') {
    return {
      state: 'selected-file-import-type-needs-import-support',
      label: 'Import Type Support Needed',
      description:
        'This selected PubParts .stp source file is preserved as source metadata, but the current Import reference path does not accept .stp yet. ParaHook has not downloaded it and has not imported it.',
      selectedFileUrl: selectedSupportedFile.sourceCandidateUrl,
      selectedFileType: selectedSupportedFile.fileExtension,
      selectedFile: selectedSupportedFile,
      sourceAttribution,
      importOwner: 'import-family',
      canCreateProjectAsset: false,
    }
  }

  if (CATALOG_CURRENT_IMPORT_HANDOFF_FILE_TYPES.has(selectedSupportedFile.fileExtension)) {
    return {
      state: 'selected-file-import-handoff-planned',
      label: 'Import Handoff Planned',
      description:
        'This selected PubParts source file is ready as source metadata for a future Import-family handoff. ParaHook has not downloaded the remote file, created an object URL, imported it, or added it to the project.',
      selectedFileUrl: selectedSupportedFile.sourceCandidateUrl,
      selectedFileType: selectedSupportedFile.fileExtension,
      selectedFile: selectedSupportedFile,
      sourceAttribution,
      importOwner: 'import-family',
      canCreateProjectAsset: false,
    }
  }

  return {
    state: 'no-selected-supported-file',
    label: 'No Selected File For Import',
    description:
      'The selected source metadata does not match a current Import-family handoff type.',
    selectedFileUrl: null,
    selectedFileType: null,
    selectedFile: null,
    sourceAttribution,
    importOwner: null,
    canCreateProjectAsset: false,
  }
}

export function shouldRenderCatalogPreviewMediaEagerly(item: CatalogItemRecord): boolean {
  const previewMedia = item.previewMedia[0] ?? null

  return (
    item.source.sourceKind === 'external' &&
    item.source.provider.providerId === 'pubparts' &&
    previewMedia?.mediaKind === 'image' &&
    previewMedia.src.trim().length > 0 &&
    item.source.previewImageUrl === previewMedia.src
  )
}

export const resolveCatalogSectionBrowseDescription = (
  sectionKey: string,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  const browseModeLabel = resolveCatalogBrowseModeLabel(browseMode)
  const facetLabel = `${browseModeLabel} facet`

  switch (sectionKey) {
    case 'all':
      return `${facetLabel} is not narrowing the shared Catalog results.`
    case 'foothooks':
      return `${facetLabel} narrows results to Foothooks through the shared metadata contract.`
    case 'shoes':
      return `${facetLabel} narrows results to Shoes through the shared metadata contract.`
    case 'footpads':
      return `${facetLabel} narrows results to Footpads through the shared metadata contract.`
    case 'imports':
      return `Imports reuse stays separate from intake ownership while the ${facetLabel.toLowerCase()} keeps previously uploaded items browsable without becoming Browser preload.`
    case 'hdris':
      return 'HDRI and EXR environments stay on their own viewer-owned apply path instead of pretending to be reference content.'
    default:
      return `${formatCatalogSectionLabel(sectionKey)} narrows the shared Catalog shell through the ${facetLabel.toLowerCase()}.`
  }
}

export const resolveCatalogGridIntroCopy = (
  activeSection: string,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  if (activeSection === 'imports') {
    return 'Imports reuse stays in the same shared content area as the curated catalog.'
  }

  return `${resolveCatalogSectionBrowseDescription(
    activeSection,
    browseMode,
  )} Facet rows use OR within Platform or Part, and Platform plus Part combine together. Click cards to build a selection. Double-click a card to open its full item page.`
}

export const resolveCatalogCardBrowseMeta = (
  item: CatalogItemRecord,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  const previewSourceText = `${item.previewMedia.length} preview source${
    item.previewMedia.length === 1 ? '' : 's'
  } ready on demand`

  if (item.source.sourceKind === 'imports') {
    return item.source.catalogItemId
      ? `Imports reuse entry - remembered from Catalog - ${previewSourceText}`
      : `Imports reuse entry - ${previewSourceText}`
  }

  if (item.source.sourceKind === 'external') {
    const providerLabel = formatCatalogExternalProviderLabel(item)
    const collectionLabel =
      item.source.provider.sourceCollectionLabel ??
      item.source.provider.sourceCollectionKey ??
      'external source'
    return `External-linked ${providerLabel} entry - ${collectionLabel} - ${previewSourceText}`
  }

  if (item.source.sourceKind === 'planned') {
    return `Planned source entry - ${item.source.sourceLabel} - Add To Project imports source; preview and starting-configuration load unavailable`
  }

  if (item.assetKind === 'environment') {
    const format = item.metadata?.find((entry) => entry.label === 'Format')?.value ?? 'HDRI/EXR'
    return `Viewer environment family - ${format} - apply through the shared viewer owner`
  }

  if (isCatalogStartingAssemblyItem(item)) {
    const platformFamilyText =
      item.startingAssembly?.platformFamily ?? 'planned platform family'
    return `Starting assembly - ${platformFamilyText} - load-as-starting-configuration planned - ${previewSourceText}`
  }

  if (browseMode === 'platform') {
    const systemText = item.systemKey ?? 'Platform'
    const platformCompatibilityText =
      item.platformCompatibility?.join(', ') ?? 'local platform compatibility'
    const brandText = item.brand ?? 'Catalog'
    const productText = item.productName ?? item.label
    return `Platform facet - ${systemText} - ${platformCompatibilityText} - ${brandText} - ${productText} - ${previewSourceText}`
  }

  const partTypeText = item.partType ?? formatCatalogFamilyLabel(item.familyKey)
  const positionText = item.position ?? 'unspecified position'
  const partGroupsText = item.partGroups?.join(', ') ?? 'local part groups'
  const productText = item.productName ?? item.label

  return `Part facet - ${partTypeText} - ${positionText} - ${partGroupsText} - ${productText} - ${previewSourceText}`
}

export const resolveCatalogItemPageFamilyLabel = (item: CatalogItemRecord): string => {
  if (isCatalogStartingAssemblyItem(item)) {
    return 'Starting Assembly'
  }

  if (item.source.sourceKind === 'imports') {
    return 'Imports Reuse Entry'
  }

  if (item.source.sourceKind === 'external') {
    return `${formatCatalogExternalProviderLabel(item)} External Source`
  }

  if (item.source.sourceKind === 'planned') {
    return 'Planned Starting Assembly'
  }

  if (item.assetKind === 'environment') {
    return 'HDRI Environment'
  }

  return `Curated ${formatCatalogFamilyLabel(item.familyKey)} Family`
}

export const resolveCatalogItemPageFamilySummary = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind === 'planned') {
    return 'Planned starting assemblies can show verified source truth and add their source file as project reference content without enabling heavy preview or load as starting configuration until later owners are wired.'
  }

  if (isCatalogStartingAssemblyItem(item)) {
    return 'Starting assemblies are planned full-build start records. Load as starting configuration remains unavailable until a downstream builder owner is wired.'
  }

  if (item.source.sourceKind === 'imports') {
    return item.source.catalogItemId
      ? 'Previously imported items can be inspected again here while still remembering which curated Catalog entry they originally came from.'
      : 'Previously imported items can be inspected again here without turning Catalog into the import-pipeline owner.'
  }

  if (item.source.sourceKind === 'external') {
    return `${formatCatalogExternalProviderLabel(item)} entries are external-linked source records for preview and source inspection; archive download, extraction, import, and compatibility mapping stay in later phases.`
  }

  if (item.assetKind === 'environment') {
    return 'HDRI and EXR environments stay viewer-owned and apply through the shared viewer environment seam instead of becoming project geometry content.'
  }

  switch (item.familyKey) {
    case 'foothooks':
      return 'Optional curated foothook references stay out of Browser until you explicitly add them to project content.'
    case 'shoes':
      return 'Optional curated shoe references stay out of Browser until you explicitly add them to project content.'
    case 'footpads':
      return 'Optional curated footpad references stay out of Browser until you explicitly add them to project content.'
    default:
      return `${formatCatalogFamilyLabel(item.familyKey)} references stay optional and commit only when you explicitly add them to project content.`
  }
}

export const resolveCatalogPrimaryActionLabel = (item: CatalogItemRecord): string => {
  switch (item.actionKind) {
    case 'add-to-project':
      return 'Add To Project'
    case 'apply-environment':
      return 'Apply Environment'
    case 'load-preview':
    default:
      return 'Load Preview'
  }
}

export function buildCatalogSectionOptions(
  snapshot: CatalogSourceSnapshot,
  browseMode: CatalogBrowseMode = 'part',
): CatalogSectionOption[] {
  const countsBySectionKey = new Map<string, number>()
  const orderedSectionKeys: string[] = []

  const incrementSectionCount = (sectionKey: string) => {
    if (!countsBySectionKey.has(sectionKey)) {
      orderedSectionKeys.push(sectionKey)
    }
    countsBySectionKey.set(sectionKey, (countsBySectionKey.get(sectionKey) ?? 0) + 1)
  }

  if (browseMode === 'part') {
    CATALOG_ITEM_PART_GROUPS.forEach((partGroup) => {
      if (!countsBySectionKey.has(partGroup)) {
        orderedSectionKeys.push(partGroup)
      }
      countsBySectionKey.set(partGroup, 0)
    })
  }

  snapshot.repoItems.forEach((item) => {
    resolveCatalogBrowseSectionKeys(item, browseMode).forEach(incrementSectionCount)
  })

  snapshot.plannedItems.forEach((item) => {
    resolveCatalogBrowseSectionKeys(item, browseMode).forEach(incrementSectionCount)
  })

  snapshot.externalItems.forEach((item) => {
    resolveCatalogBrowseSectionKeys(item, browseMode).forEach(incrementSectionCount)
  })

  if (snapshot.importsItems.length > 0) {
    incrementSectionCount('imports')
  }

  return orderedSectionKeys.map((sectionKey) => ({
    sectionKey,
    label: sectionKey === 'imports' ? 'Imports' : formatCatalogSectionLabel(sectionKey),
    count: countsBySectionKey.get(sectionKey) ?? 0,
    description: resolveCatalogSectionBrowseDescription(sectionKey, browseMode),
  }))
}

export function buildCatalogFilterGroups(
  snapshot: CatalogSourceSnapshot,
  activeSectionOrSelections: string | CatalogFacetSelections,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
  context: CatalogFilterContext = {},
): CatalogFilterGroup[] {
  const searchFilteredItems = resolveCatalogSearchFilteredItems(
    resolveCatalogBaseItems(snapshot, activeSectionOrSelections, browseMode),
    searchText,
  )

  return CATALOG_FILTER_GROUP_DEFINITIONS.flatMap((definition) => {
    const countsByValue = new Map<string, number>()
    const orderedValues: string[] = []

    searchFilteredItems.forEach((item) => {
      definition.resolveValues(item, context).forEach((value) => {
        if (!countsByValue.has(value)) {
          orderedValues.push(value)
        }
        countsByValue.set(value, (countsByValue.get(value) ?? 0) + 1)
      })
    })

    if (orderedValues.length === 0) {
      return []
    }

    return [
      {
        groupKey: definition.groupKey,
        label: definition.label,
        description: definition.description,
        options: orderedValues.map((value) => ({
          value,
          count: countsByValue.get(value) ?? 0,
        })),
      },
    ]
  })
}

export function toggleCatalogFacetSelection(
  currentSelections: CatalogFacetSelections,
  browseMode: CatalogBrowseMode,
  sectionKey: string,
  selectionMode: CatalogFacetSelectionMode = 'add',
): CatalogFacetSelections {
  if (sectionKey === 'all') {
    return {
      ...currentSelections,
      [browseMode]: ['all'],
    }
  }

  const currentModeSelections = currentSelections[browseMode] ?? ['all']
  const concreteModeSelections = currentModeSelections.filter(
    (candidateSectionKey) => candidateSectionKey !== 'all',
  )

  if (selectionMode === 'switch') {
    const isOnlySelected =
      concreteModeSelections.length === 1 && concreteModeSelections[0] === sectionKey

    return {
      ...currentSelections,
      [browseMode]: isOnlySelected ? [] : [sectionKey],
    }
  }

  const nextModeSelections = concreteModeSelections.includes(sectionKey)
    ? concreteModeSelections.filter((candidateSectionKey) => candidateSectionKey !== sectionKey)
    : [...concreteModeSelections, sectionKey]

  return {
    ...currentSelections,
    [browseMode]: nextModeSelections,
  }
}

export function pruneCatalogFacetSelections(
  currentSelections: CatalogFacetSelections,
  sectionOptionsByMode: Record<CatalogBrowseMode, CatalogSectionOption[]>,
): CatalogFacetSelections {
  let hasChanges = false
  const nextSelections = (['platform', 'part'] as const).reduce<CatalogFacetSelections>(
    (workingSelections, browseMode) => {
      const currentModeSelections = currentSelections[browseMode] ?? ['all']

      if (currentModeSelections.includes('all')) {
        workingSelections[browseMode] = ['all']
        if (currentModeSelections.length !== 1 || currentModeSelections[0] !== 'all') {
          hasChanges = true
        }
        return workingSelections
      }

      const availableSectionKeys = new Set(
        sectionOptionsByMode[browseMode].map((option) => option.sectionKey),
      )
      const nextModeSelections = currentModeSelections.filter((sectionKey) =>
        availableSectionKeys.has(sectionKey),
      )

      if (
        nextModeSelections.length !== currentModeSelections.length ||
        nextModeSelections.some((sectionKey, index) => sectionKey !== currentModeSelections[index])
      ) {
        hasChanges = true
      }

      workingSelections[browseMode] = nextModeSelections
      return workingSelections
    },
    {
      platform: [],
      part: [],
    },
  )

  return hasChanges ? nextSelections : currentSelections
}

export function toggleCatalogFilterSelection(
  currentSelectedFilters: CatalogSelectedFilters,
  groupKey: CatalogFilterGroupKey,
  value: string,
  selectionMode: CatalogFacetSelectionMode = 'add',
): CatalogSelectedFilters {
  const currentGroupSelections = currentSelectedFilters[groupKey] ?? []
  if (selectionMode === 'switch') {
    const isOnlySelected =
      currentGroupSelections.length === 1 && currentGroupSelections[0] === value

    if (isOnlySelected) {
      const { [groupKey]: _removedGroupSelections, ...nextSelectedFilters } =
        currentSelectedFilters
      return nextSelectedFilters
    }

    return {
      ...currentSelectedFilters,
      [groupKey]: [value],
    }
  }

  const nextGroupSelections = currentGroupSelections.includes(value)
    ? currentGroupSelections.filter((candidateValue) => candidateValue !== value)
    : [...currentGroupSelections, value]

  if (nextGroupSelections.length === 0) {
    const { [groupKey]: _removedGroupSelections, ...nextSelectedFilters } = currentSelectedFilters
    return nextSelectedFilters
  }

  return {
    ...currentSelectedFilters,
    [groupKey]: nextGroupSelections,
  }
}

export function resetCatalogFilterSelection(
  currentSelectedFilters: CatalogSelectedFilters,
  groupKey: CatalogFilterGroupKey,
): CatalogSelectedFilters {
  const { [groupKey]: _removedGroupSelections, ...nextSelectedFilters } = currentSelectedFilters
  return nextSelectedFilters
}

export function pruneCatalogFilterSelections(
  currentSelectedFilters: CatalogSelectedFilters,
  availableFilterGroups: CatalogFilterGroup[],
): CatalogSelectedFilters {
  const availableValuesByGroup = new Map<CatalogFilterGroupKey, Set<string>>(
    availableFilterGroups.map((group) => [
      group.groupKey,
      new Set(group.options.map((option) => option.value)),
    ]),
  )

  let hasChanges = false
  const nextSelectedFilters = Object.entries(currentSelectedFilters).reduce<CatalogSelectedFilters>(
    (nextFilters, [groupKey, selectedValues]) => {
      if (selectedValues === undefined) {
        return nextFilters
      }

      const availableValues = availableValuesByGroup.get(groupKey as CatalogFilterGroupKey)
      if (availableValues === undefined) {
        hasChanges = true
        return nextFilters
      }

      const nextGroupSelections = selectedValues.filter((value) => availableValues.has(value))
      if (nextGroupSelections.length !== selectedValues.length) {
        hasChanges = true
      }

      if (nextGroupSelections.length > 0) {
        nextFilters[groupKey as CatalogFilterGroupKey] = nextGroupSelections
      } else {
        hasChanges = true
      }

      return nextFilters
    },
    {},
  )

  const currentGroupKeys = Object.keys(currentSelectedFilters)
  if (
    !hasChanges &&
    currentGroupKeys.length === Object.keys(nextSelectedFilters).length &&
    currentGroupKeys.every((groupKey) => {
      const currentSelections = currentSelectedFilters[groupKey as CatalogFilterGroupKey] ?? []
      const nextSelections = nextSelectedFilters[groupKey as CatalogFilterGroupKey] ?? []
      return (
        currentSelections.length === nextSelections.length &&
        currentSelections.every((value, index) => value === nextSelections[index])
      )
    })
  ) {
    return currentSelectedFilters
  }

  return nextSelectedFilters
}

export function resolveCatalogSelectedFilterCount(selectedFilters: CatalogSelectedFilters): number {
  return Object.values(selectedFilters).reduce(
    (total, selectedValues) => total + (selectedValues?.length ?? 0),
    0,
  )
}

export function getCatalogVisibleItems(
  snapshot: CatalogSourceSnapshot,
  activeSectionOrSelections: string | CatalogFacetSelections,
  searchText: string = '',
  selectedFilters: CatalogSelectedFilters = {},
  browseMode: CatalogBrowseMode = 'part',
  context: CatalogFilterContext = {},
): CatalogItemRecord[] {
  return resolveCatalogSearchFilteredItems(
    resolveCatalogBaseItems(snapshot, activeSectionOrSelections, browseMode).filter((item) =>
      matchesCatalogSelectedFilters(item, selectedFilters, context),
    ),
    searchText,
  )
}

export function buildCatalogTagOptions(
  snapshot: CatalogSourceSnapshot,
  activeSectionOrSelections: string | CatalogFacetSelections,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
  context: CatalogFilterContext = {},
): CatalogFilterGroup[] {
  return buildCatalogFilterGroups(snapshot, activeSectionOrSelections, searchText, browseMode, context)
}

export function resolveCatalogSearchPlaceholder(
  activeSection: string,
  browseMode: CatalogBrowseMode = 'part',
): string {
  if (activeSection === 'imports') {
    return 'Search imported reuse entries, notes, and metadata'
  }

  if (activeSection === 'hdris') {
    return 'Search HDRIs, tags, notes, and environment metadata'
  }

  if (browseMode === 'platform') {
    return 'Search platforms, parts, notes, and metadata'
  }

  return 'Search parts, platforms, groups, notes, and metadata'
}

export function resolveCatalogResultsSummary(
  visibleCount: number,
  activeSection: string,
  selectedFilterCount: number,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
): string {
  const sectionLabel = activeSection === 'all' ? 'catalog' : formatCatalogSectionLabel(activeSection)
  const searchState =
    searchText.trim().length === 0 ? 'No text filter.' : `Search active for "${searchText.trim()}".`
  const filterState =
    selectedFilterCount === 0
      ? 'No local taxonomy filters.'
      : `${selectedFilterCount} local taxonomy filter${selectedFilterCount === 1 ? '' : 's'} active.`
  const browseLabel = resolveCatalogBrowseModeLabel(browseMode)

  return `${visibleCount} visible result${visibleCount === 1 ? '' : 's'} in the filtered catalog, last adjusted by the ${browseLabel} facet for ${sectionLabel}. ${searchState} ${filterState}`
}
