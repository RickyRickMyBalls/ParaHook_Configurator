import type { CatalogItemRecord } from '../catalogItemContract'
import type { CatalogSourceSnapshot } from '../catalogSource'
import { selectCatalogItemsForSection } from '../catalogSource'

export type CatalogSectionOption = {
  sectionKey: string
  label: string
  count: number
  description: string
}

export type CatalogContentMode = 'grid' | 'item-page'

export const formatCatalogSectionLabel = (sectionKey: string): string =>
  sectionKey
    .split('-')
    .map((part) => (part.length > 0 ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ')

export const formatCatalogFamilyLabel = (familyKey: string): string =>
  formatCatalogSectionLabel(familyKey)

export const resolveCatalogSectionBrowseDescription = (sectionKey: string): string => {
  switch (sectionKey) {
    case 'all':
      return 'Optional curated reference families now browse here: Foothooks, Shoes, and Footpads. They stay out of Browser until you explicitly add them.'
    case 'foothooks':
      return 'Foothooks family. Optional curated foothook references now browse here instead of arriving as default Browser content.'
    case 'shoes':
      return 'Shoes family. Optional curated shoe references now browse here instead of arriving as default Browser content.'
    case 'footpads':
      return 'Footpads family. Optional curated footpad references now browse here instead of arriving as default Browser content.'
    case 'imports':
      return 'Imports reuse stays separate from intake ownership. Previously uploaded items can be browsed again here without becoming Browser preload.'
    case 'hdris':
      return 'Environment presets stay on their own viewer-owned apply path instead of pretending to be reference content.'
    default:
      return `${formatCatalogSectionLabel(sectionKey)} now browses here through the shared Catalog shell.`
  }
}

export const resolveCatalogGridIntroCopy = (activeSection: string): string => {
  if (activeSection === 'imports') {
    return 'Imports now browse through the same shared content area as the curated catalog.'
  }

  return `${resolveCatalogSectionBrowseDescription(activeSection)} Click cards to build a selection. Double-click a card to open its full item page. Nothing auto-loads just because it is visible in the grid.`
}

export const resolveCatalogCardBrowseMeta = (item: CatalogItemRecord): string => {
  const previewSourceText = `${item.previewMedia.length} preview source${
    item.previewMedia.length === 1 ? '' : 's'
  } ready on demand`

  if (item.source.sourceKind === 'imports') {
    return `Imports reuse entry - ${previewSourceText}`
  }

  if (item.assetKind === 'environment') {
    return 'Viewer environment family - apply through the shared viewer owner'
  }

  return `Curated ${formatCatalogFamilyLabel(item.familyKey)} family - ${previewSourceText}`
}

export const resolveCatalogItemPageFamilyLabel = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind === 'imports') {
    return 'Imports Reuse Entry'
  }

  if (item.assetKind === 'environment') {
    return 'Environment Preset'
  }

  return `Curated ${formatCatalogFamilyLabel(item.familyKey)} Family`
}

export const resolveCatalogItemPageFamilySummary = (item: CatalogItemRecord): string => {
  if (item.source.sourceKind === 'imports') {
    return 'Previously imported items can be inspected again here without turning Catalog into the import-pipeline owner.'
  }

  if (item.assetKind === 'environment') {
    return 'Environment presets stay viewer-owned and apply through the shared viewer environment seam instead of becoming project geometry content.'
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
): CatalogSectionOption[] {
  const countsBySectionKey = new Map<string, number>()
  snapshot.repoItems.forEach((item) => {
    countsBySectionKey.set(item.sectionKey, (countsBySectionKey.get(item.sectionKey) ?? 0) + 1)
  })

  const sectionOptions = Array.from(countsBySectionKey.entries()).map(([sectionKey, count]) => ({
    sectionKey,
    label: formatCatalogSectionLabel(sectionKey),
    count,
    description: resolveCatalogSectionBrowseDescription(sectionKey),
  }))

  if (snapshot.importsItems.length > 0) {
    sectionOptions.push({
      sectionKey: 'imports',
      label: 'Imports',
      count: snapshot.importsItems.length,
      description: resolveCatalogSectionBrowseDescription('imports'),
    })
  }

  return sectionOptions
}

export function getCatalogVisibleItems(
  snapshot: CatalogSourceSnapshot,
  activeSection: string,
): CatalogItemRecord[] {
  if (activeSection === 'all') {
    return snapshot.allItems
  }

  if (activeSection === 'imports') {
    return snapshot.importsItems
  }

  return selectCatalogItemsForSection(snapshot, activeSection)
}
