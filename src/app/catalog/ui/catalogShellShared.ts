import type { CatalogItemRecord } from '../catalogItemContract'
import type { CatalogSourceSnapshot } from '../catalogSource'

export type CatalogBrowseMode = 'part' | 'platform'

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
  | 'platformCompatibility'
  | 'partType'
  | 'partGroups'
  | 'brand'

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
  resolveValues: (item: CatalogItemRecord) => string[]
}

const CATALOG_FILTER_GROUP_DEFINITIONS: CatalogFilterGroupDefinition[] = [
  {
    groupKey: 'platformCompatibility',
    label: 'Platform Compatibility',
    description:
      'Canonical ADV, XR, GT, Pint, XR Classic, and Other families from the shared item contract.',
    resolveValues: (item) => item.platformCompatibility ?? [],
  },
  {
    groupKey: 'partType',
    label: 'Part Type',
    description: 'Local part type metadata from the shared item contract.',
    resolveValues: (item) => (item.partType === undefined ? [] : [item.partType]),
  },
  {
    groupKey: 'partGroups',
    label: 'Part Groups',
    description: 'First-pass part groups such as Footpads, FootHolds, and Shoes.',
    resolveValues: (item) => item.partGroups ?? [],
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
]

export type CatalogContentMode = 'grid' | 'item-page'

export const resolveCatalogBrowseModeLabel = (browseMode: CatalogBrowseMode): string =>
  browseMode === 'part' ? 'Part' : 'Platform'

export const resolveCatalogBrowseModeDescription = (browseMode: CatalogBrowseMode): string =>
  browseMode === 'part'
    ? 'Part read centers part type, product name, position, and local part-group metadata.'
    : 'Platform read centers system ownership and platform compatibility metadata.'

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

function resolveCatalogBaseItems(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
  browseMode: CatalogBrowseMode,
): CatalogItemRecord[] {
  if (activeSection === 'all') {
    return snapshot.allItems
  }

  if (activeSection === 'imports') {
    return snapshot.importsItems
  }

  if (activeSection === 'hdris') {
    return snapshot.repoItems.filter((item) => item.assetKind === 'environment')
  }

  return snapshot.allItems.filter((item) =>
    resolveCatalogBrowseSectionKeys(item, browseMode).includes(activeSection),
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
): Record<CatalogFilterGroupKey, string[]> {
  return CATALOG_FILTER_GROUP_DEFINITIONS.reduce<Record<CatalogFilterGroupKey, string[]>>(
    (valuesByGroup, definition) => {
      valuesByGroup[definition.groupKey] = definition.resolveValues(item)
      return valuesByGroup
    },
    {
      systemKey: [],
      platformCompatibility: [],
      partType: [],
      partGroups: [],
      brand: [],
    },
  )
}

function matchesCatalogSelectedFilters(
  item: CatalogItemRecord,
  selectedFilters: CatalogSelectedFilters,
): boolean {
  const valuesByGroup = resolveCatalogItemFilterValues(item)

  return Object.entries(selectedFilters).every(([groupKey, selectedValues]) => {
    if (selectedValues === undefined || selectedValues.length === 0) {
      return true
    }

    const candidateValues = valuesByGroup[groupKey as CatalogFilterGroupKey]
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

export const resolveCatalogSectionBrowseDescription = (
  sectionKey: string,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  const browseModeLabel = resolveCatalogBrowseModeLabel(browseMode)

  switch (sectionKey) {
    case 'all':
      return `${browseModeLabel} read keeps the curated reference families visible without changing the shared Catalog truth.`
    case 'foothooks':
      return `${browseModeLabel} read keeps Foothooks browsing through the shared metadata contract instead of arriving as default Browser content.`
    case 'shoes':
      return `${browseModeLabel} read keeps Shoes browsing through the shared metadata contract instead of arriving as default Browser content.`
    case 'footpads':
      return `${browseModeLabel} read keeps Footpads browsing through the shared metadata contract instead of arriving as default Browser content.`
    case 'imports':
      return `Imports reuse stays separate from intake ownership while the ${browseModeLabel.toLowerCase()} read keeps previously uploaded items browsable without becoming Browser preload.`
    case 'hdris':
      return 'HDRI and EXR environments stay on their own viewer-owned apply path instead of pretending to be reference content.'
    default:
      return `${formatCatalogSectionLabel(sectionKey)} now browses here through the shared Catalog shell in ${browseModeLabel.toLowerCase()} read.`
  }
}

export const resolveCatalogGridIntroCopy = (
  activeSection: string,
  browseMode: CatalogBrowseMode = 'part',
): string => {
  if (activeSection === 'imports') {
    return `${resolveCatalogBrowseModeLabel(browseMode)} read keeps imports in the same shared content area as the curated catalog.`
  }

  return `${resolveCatalogSectionBrowseDescription(
    activeSection,
    browseMode,
  )} Click cards to build a selection. Double-click a card to open its full item page. Nothing auto-loads just because it is visible in the grid.`
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

  if (item.assetKind === 'environment') {
    const format = item.metadata?.find((entry) => entry.label === 'Format')?.value ?? 'HDRI/EXR'
    return `Viewer environment family - ${format} - apply through the shared viewer owner`
  }

  if (browseMode === 'platform') {
    const systemText = item.systemKey ?? 'Platform'
    const platformCompatibilityText =
      item.platformCompatibility?.join(', ') ?? 'local platform compatibility'
    const brandText = item.brand ?? 'Catalog'
    const productText = item.productName ?? item.label
    return `Platform read - ${systemText} - ${platformCompatibilityText} - ${brandText} - ${productText} - ${previewSourceText}`
  }

  const partTypeText = item.partType ?? formatCatalogFamilyLabel(item.familyKey)
  const positionText = item.position ?? 'unspecified position'
  const partGroupsText = item.partGroups?.join(', ') ?? 'local part groups'
  const productText = item.productName ?? item.label

  return `Part read - ${partTypeText} - ${positionText} - ${partGroupsText} - ${productText} - ${previewSourceText}`
}

export const resolveCatalogItemPageFamilyLabel = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind === 'imports') {
    return 'Imports Reuse Entry'
  }

  if (item.assetKind === 'environment') {
    return 'HDRI Environment'
  }

  return `Curated ${formatCatalogFamilyLabel(item.familyKey)} Family`
}

export const resolveCatalogItemPageFamilySummary = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind === 'imports') {
    return item.source.catalogItemId
      ? 'Previously imported items can be inspected again here while still remembering which curated Catalog entry they originally came from.'
      : 'Previously imported items can be inspected again here without turning Catalog into the import-pipeline owner.'
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

  snapshot.repoItems.forEach((item) => {
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
  activeSection: string,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
): CatalogFilterGroup[] {
  const searchFilteredItems = resolveCatalogSearchFilteredItems(
    resolveCatalogBaseItems(snapshot, activeSection, browseMode),
    searchText,
  )

  return CATALOG_FILTER_GROUP_DEFINITIONS.flatMap((definition) => {
    const countsByValue = new Map<string, number>()
    const orderedValues: string[] = []

    searchFilteredItems.forEach((item) => {
      definition.resolveValues(item).forEach((value) => {
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

export function toggleCatalogFilterSelection(
  currentSelectedFilters: CatalogSelectedFilters,
  groupKey: CatalogFilterGroupKey,
  value: string,
): CatalogSelectedFilters {
  const currentGroupSelections = currentSelectedFilters[groupKey] ?? []
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
  activeSection: string,
  searchText: string = '',
  selectedFilters: CatalogSelectedFilters = {},
  browseMode: CatalogBrowseMode = 'part',
): CatalogItemRecord[] {
  return resolveCatalogSearchFilteredItems(
    resolveCatalogBaseItems(snapshot, activeSection, browseMode).filter((item) =>
      matchesCatalogSelectedFilters(item, selectedFilters),
    ),
    searchText,
  )
}

export function buildCatalogTagOptions(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
  searchText: string,
  browseMode: CatalogBrowseMode = 'part',
): CatalogFilterGroup[] {
  return buildCatalogFilterGroups(snapshot, activeSection, searchText, browseMode)
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
    return 'Search systems, compatibility, notes, and metadata'
  }

  return 'Search part types, product names, groups, notes, and metadata'
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

  return `${visibleCount} visible result${visibleCount === 1 ? '' : 's'} in ${browseLabel} read for ${sectionLabel}. ${searchState} ${filterState}`
}
