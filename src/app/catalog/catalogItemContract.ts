import type { ReferenceFileType } from '../references/referenceManifest'
import { resolveReferenceAssetPath } from '../references/referenceManifest'

export const CATALOG_ITEM_ASSET_KINDS = ['reference-asset', 'environment'] as const
export type CatalogItemAssetKind = (typeof CATALOG_ITEM_ASSET_KINDS)[number]

export const CATALOG_ITEM_ACTION_KINDS = [
  'load-preview',
  'add-to-project',
  'apply-environment',
] as const
export type CatalogItemActionKind = (typeof CATALOG_ITEM_ACTION_KINDS)[number]

export const CATALOG_ITEM_SOURCE_KINDS = ['repo', 'imports'] as const
export type CatalogItemSourceKind = (typeof CATALOG_ITEM_SOURCE_KINDS)[number]

export const CATALOG_ITEM_SYSTEMS = ['Platform', 'Wheel', 'Hardware'] as const
export type CatalogItemSystem = (typeof CATALOG_ITEM_SYSTEMS)[number]

export const CATALOG_ITEM_PLATFORM_FAMILIES = ['ADV', 'XR', 'GT', 'Pint', 'XR Classic', 'Other'] as const
export type CatalogItemPlatformFamily = (typeof CATALOG_ITEM_PLATFORM_FAMILIES)[number]

export const CATALOG_ITEM_POSITIONS = ['Front', 'Rear', 'Pair', 'Universal'] as const
export type CatalogItemPosition = (typeof CATALOG_ITEM_POSITIONS)[number]

export const CATALOG_ITEM_PART_GROUPS = [
  'Footpads',
  'Bumpers',
  'Rails',
  'Motors',
  'Tires',
  'Boxes',
  'Axle Blocks',
  'FootHolds',
  'Shoes',
  'Screw & Nuts',
] as const
export type CatalogItemPartGroup = (typeof CATALOG_ITEM_PART_GROUPS)[number]

export const CATALOG_ITEM_PREVIEW_MEDIA_KINDS = ['image', 'video'] as const
export type CatalogItemPreviewMediaKind = (typeof CATALOG_ITEM_PREVIEW_MEDIA_KINDS)[number]

export type CatalogItemPreviewMedia = {
  mediaKind: CatalogItemPreviewMediaKind
  src: string
  alt: string
}

export type CatalogEnvironmentFileType = 'hdr' | 'exr'

export type CatalogItemMetadataEntry = {
  label: string
  value: string
}

const CATALOG_PREVIEW_MEDIA_BASE_URL = import.meta.env.BASE_URL ?? '/'

export type CatalogRepoItemSource = {
  sourceKind: 'repo'
  assetPath: string
}

export type CatalogImportsItemSource = {
  sourceKind: 'imports'
  importId: string
  assetPath: string
  catalogItemId?: string | null
}

export type CatalogItemSourceRef = CatalogRepoItemSource | CatalogImportsItemSource

export type CatalogItemRecord = {
  itemId: string
  label: string
  familyKey: string
  sectionKey: string
  tags: string[]
  systemKey?: CatalogItemSystem
  platformCompatibility?: CatalogItemPlatformFamily[]
  partType?: string
  position?: CatalogItemPosition
  productName?: string
  brand?: string
  partGroups?: CatalogItemPartGroup[]
  description: string
  assetKind: CatalogItemAssetKind
  actionKind: CatalogItemActionKind
  source: CatalogItemSourceRef
  previewMedia: CatalogItemPreviewMedia[]
  notes?: string[]
  metadata?: CatalogItemMetadataEntry[]
  projectUsageCount?: number
}

export function isCatalogItemAssetKind(value: unknown): value is CatalogItemAssetKind {
  return typeof value === 'string' && CATALOG_ITEM_ASSET_KINDS.includes(value as CatalogItemAssetKind)
}

export function isCatalogItemActionKind(value: unknown): value is CatalogItemActionKind {
  return (
    typeof value === 'string' &&
    CATALOG_ITEM_ACTION_KINDS.includes(value as CatalogItemActionKind)
  )
}

export function isCatalogItemSourceKind(value: unknown): value is CatalogItemSourceKind {
  return typeof value === 'string' && CATALOG_ITEM_SOURCE_KINDS.includes(value as CatalogItemSourceKind)
}

export function isCatalogItemImportsEntry(item: CatalogItemRecord): boolean {
  return item.source.sourceKind === 'imports'
}

export function getCatalogItemPrimaryPreviewMedia(
  item: CatalogItemRecord,
): CatalogItemPreviewMedia | null {
  return item.previewMedia[0] ?? null
}

export function resolveCatalogPreviewMediaSrc(src: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('blob:') || src.startsWith('data:')) {
    return src
  }

  const normalizedBase = CATALOG_PREVIEW_MEDIA_BASE_URL.endsWith('/')
    ? CATALOG_PREVIEW_MEDIA_BASE_URL
    : `${CATALOG_PREVIEW_MEDIA_BASE_URL}/`
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src
  return `${normalizedBase}${normalizedSrc}`
}

export function resolveCatalogRepoReferencePreviewSource(
  item: CatalogItemRecord,
): { fileType: ReferenceFileType; objectUrl: string } | null {
  if (item.assetKind !== 'reference-asset' || item.source.sourceKind !== 'repo') {
    return null
  }

  const normalizedAssetPath = item.source.assetPath.trim().toLowerCase()
  const fileType = (['glb', 'obj', 'stl', 'step'] as const).find((candidateFileType) =>
    normalizedAssetPath.endsWith(`.${candidateFileType}`),
  )

  if (fileType === undefined) {
    return null
  }

  return {
    fileType,
    objectUrl: resolveReferenceAssetPath(item.source.assetPath),
  }
}

export function resolveCatalogRepoEnvironmentSource(
  item: CatalogItemRecord,
): { fileType: CatalogEnvironmentFileType; objectUrl: string; label: string } | null {
  if (item.assetKind !== 'environment' || item.source.sourceKind !== 'repo') {
    return null
  }

  const normalizedAssetPath = item.source.assetPath.trim().toLowerCase()
  const fileType = (['hdr', 'exr'] as const).find((candidateFileType) =>
    normalizedAssetPath.endsWith(`.${candidateFileType}`),
  )

  if (fileType === undefined) {
    return null
  }

  return {
    fileType,
    objectUrl: resolveCatalogPreviewMediaSrc(item.source.assetPath),
    label: item.label,
  }
}
