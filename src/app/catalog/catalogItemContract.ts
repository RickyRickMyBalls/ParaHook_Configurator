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

export const CATALOG_ITEM_SOURCE_KINDS = ['repo', 'imports', 'external', 'planned'] as const
export type CatalogItemSourceKind = (typeof CATALOG_ITEM_SOURCE_KINDS)[number]

export const CATALOG_ITEM_ROLES = ['starting-assembly'] as const
export type CatalogItemRole = (typeof CATALOG_ITEM_ROLES)[number]

export const CATALOG_STARTING_ASSEMBLY_STATUSES = ['planned'] as const
export type CatalogStartingAssemblyStatus = (typeof CATALOG_STARTING_ASSEMBLY_STATUSES)[number]

export const CATALOG_STARTING_ASSEMBLY_SOURCE_ASSET_PREFERENCES = ['step-or-stp'] as const
export type CatalogStartingAssemblySourceAssetPreference =
  (typeof CATALOG_STARTING_ASSEMBLY_SOURCE_ASSET_PREFERENCES)[number]

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
  'Battery Boxes',
  'Controllers',
  'Fenders',
  'Rim Savers',
  'Axle Blocks',
  'Bearings',
  'Guards',
  'Brackets',
  'Adapters',
  'Tools',
  'Electronics',
  'Lights',
  'Remotes',
  'Stands',
  'FootHolds',
  'Shoes',
  'Screw & Nuts',
  'Miscellaneous',
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

export type CatalogItemWheelFitment = {
  motorVersion?: string
  hubSizeInches?: string
  tireSize?: string
  tireCompound?: string
}

export type CatalogStartingAssembly = {
  status: CatalogStartingAssemblyStatus
  platformFamily?: CatalogItemPlatformFamily
  sourceAssetPreference?: CatalogStartingAssemblySourceAssetPreference
}

export const CATALOG_SOURCE_ASSET_VARIANT_ROLES = [
  'preferred-source',
  'companion-mesh',
  'preview-candidate',
  'fallback',
] as const
export type CatalogSourceAssetVariantRole =
  (typeof CATALOG_SOURCE_ASSET_VARIANT_ROLES)[number]

export const CATALOG_SOURCE_ASSET_VARIANT_FORMATS = [
  'step',
  'stp',
  'glb',
  'obj',
  'stl',
] as const
export type CatalogSourceAssetVariantFormat =
  (typeof CATALOG_SOURCE_ASSET_VARIANT_FORMATS)[number]

export type CatalogSourceAssetVariant = {
  variantId: string
  role: CatalogSourceAssetVariantRole
  format: CatalogSourceAssetVariantFormat
  sourcePath: string
  fileSizeBytes?: number | null
  label?: string
}

export const CATALOG_SOURCE_VERSION_STATUSES = ['current', 'archived'] as const
export type CatalogSourceVersionStatus = (typeof CATALOG_SOURCE_VERSION_STATUSES)[number]

export type CatalogSourceVersion = {
  versionId: string
  versionLabel: string
  status: CatalogSourceVersionStatus
  variants: CatalogSourceAssetVariant[]
  notes?: string[]
}

export type CatalogSourceAssetSet = {
  sourceId: string
  currentVersionId: string
  versions: CatalogSourceVersion[]
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

export type CatalogExternalProviderMetadata = {
  providerId: string
  providerName: string
  sourceCollectionKey?: string | null
  sourceCollectionLabel?: string | null
}

export type CatalogExternalItemSource = {
  sourceKind: 'external'
  provider: CatalogExternalProviderMetadata
  sourceUrl?: string | null
  externalItemUrl?: string | null
  previewImageUrl?: string | null
  linkedArchiveUrl?: string | null
  sourceLastUpdated?: string | null
  archiveLastUpdated?: string | null
  assetPath?: never
}

export type CatalogPlannedItemSource = {
  sourceKind: 'planned'
  sourceLabel: string
  sourceAssetPath?: string | null
  sourceAssetFormat?: CatalogStartingAssemblySourceAssetPreference
  sourceFileSizeBytes?: number | null
  sourceStatus: 'known-heavy-source'
  sourceAssetSet?: CatalogSourceAssetSet
  assetPath?: never
}

export type CatalogItemSourceRef =
  | CatalogRepoItemSource
  | CatalogImportsItemSource
  | CatalogExternalItemSource
  | CatalogPlannedItemSource

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
  wheelFitment?: CatalogItemWheelFitment
  itemRole?: CatalogItemRole
  startingAssembly?: CatalogStartingAssembly
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

export function isCatalogItemRole(value: unknown): value is CatalogItemRole {
  return typeof value === 'string' && CATALOG_ITEM_ROLES.includes(value as CatalogItemRole)
}

export function isCatalogItemImportsEntry(item: CatalogItemRecord): boolean {
  return item.source.sourceKind === 'imports'
}

export function isCatalogStartingAssemblyItem(item: CatalogItemRecord): boolean {
  return item.itemRole === 'starting-assembly'
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
