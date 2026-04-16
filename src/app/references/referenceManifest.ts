export type ManifestReferenceCategoryId = 'footpads' | 'shoes' | 'premade-foothooks'
export type ReferenceCategoryId = ManifestReferenceCategoryId | 'user-references'
export type ReferenceFileType = 'obj' | 'glb' | 'stl' | 'step'
export type ReferenceSourceKind = 'manifest' | 'imported'

export type ReferenceManifestCategory = {
  categoryId: ManifestReferenceCategoryId
  label: string
}

export type ReferenceDisplayTransform = {
  scale?: number
  rotationDeg?: {
    x?: number
    y?: number
    z?: number
  }
  offset?: {
    x?: number
    y?: number
    z?: number
  }
  centerUnderPivot?: boolean
}

export type ReferenceTransformVector3 = {
  x: number
  y: number
  z: number
}

export type ReferenceTransformOverride = {
  position: ReferenceTransformVector3
  rotationDeg: ReferenceTransformVector3
  scale: ReferenceTransformVector3
}

export type ReferenceManifestItem = {
  referenceId: string
  label: string
  categoryId: ManifestReferenceCategoryId
  assetPath: string
  fileType: ReferenceFileType
  displayTransform?: ReferenceDisplayTransform
}

export type ReferenceLoadableItem = {
  referenceId: string
  assetPath: string
  fileType: ReferenceFileType
  displayTransform?: ReferenceDisplayTransform
  transformOverride?: ReferenceTransformOverride | null
  explodedFromReferenceId?: string | null
  sourcePartKey?: string | null
  sourceMeshIndex?: number | null
}

export const USER_REFERENCE_CATEGORY_ID = 'user-references' as const
export const USER_REFERENCE_CATEGORY_LABEL = 'User References'

const REFERENCE_ASSET_BASE_URL = import.meta.env.BASE_URL ?? '/'

export const resolveReferenceAssetPath = (assetPath: string): string => {
  const normalizedBase = REFERENCE_ASSET_BASE_URL.endsWith('/')
    ? REFERENCE_ASSET_BASE_URL
    : `${REFERENCE_ASSET_BASE_URL}/`
  const normalizedAssetPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  return `${normalizedBase}${normalizedAssetPath}`
}

export const REFERENCE_MANIFEST_CATEGORIES: ReferenceManifestCategory[] = [
  {
    categoryId: 'footpads',
    label: 'Footpads',
  },
  {
    categoryId: 'shoes',
    label: 'Shoes',
  },
  {
    categoryId: 'premade-foothooks',
    label: 'Premade Foothooks',
  },
]

export const REFERENCE_MANIFEST_ITEMS: ReferenceManifestItem[] = [
  {
    referenceId: 'footpad:pubpad-full-assembly',
    label: 'PubPad Full Assembly',
    categoryId: 'footpads',
    assetPath: 'ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
    fileType: 'obj',
    displayTransform: {
      scale: 1,
      rotationDeg: { y: 180 },
      centerUnderPivot: true,
    },
  },
  {
    referenceId: 'shoe:shoe-1',
    label: 'Shoe 1',
    categoryId: 'shoes',
    assetPath: 'ReferenceModels/shoes/Shoe_1.glb',
    fileType: 'glb',
  },
  {
    referenceId: 'shoe:shoe-2',
    label: 'Shoe 2',
    categoryId: 'shoes',
    assetPath: 'ReferenceModels/shoes/Shoe_2.glb',
    fileType: 'glb',
  },
  {
    referenceId: 'shoe:shoe-3',
    label: 'Shoe 3',
    categoryId: 'shoes',
    assetPath: 'ReferenceModels/shoes/Shoe_3.glb',
    fileType: 'glb',
  },
  {
    referenceId: 'hook:large',
    label: 'Large',
    categoryId: 'premade-foothooks',
    assetPath: 'ReferenceModels/hooks/large.step',
    fileType: 'step',
  },
  {
    referenceId: 'hook:medium',
    label: 'Medium',
    categoryId: 'premade-foothooks',
    assetPath: 'ReferenceModels/hooks/medium.step',
    fileType: 'step',
  },
  {
    referenceId: 'hook:small',
    label: 'Small',
    categoryId: 'premade-foothooks',
    assetPath: 'ReferenceModels/hooks/small.step',
    fileType: 'step',
  },
  {
    referenceId: 'hook:xl',
    label: 'XL',
    categoryId: 'premade-foothooks',
    assetPath: 'ReferenceModels/hooks/xl.step',
    fileType: 'step',
  },
]

export const REFERENCE_MANIFEST_ITEMS_BY_ID = Object.fromEntries(
  REFERENCE_MANIFEST_ITEMS.map((item) => [item.referenceId, item]),
) as Record<string, ReferenceManifestItem>

export const selectReferenceManifestItemsForCategory = (
  categoryId: ManifestReferenceCategoryId,
): ReferenceManifestItem[] =>
  REFERENCE_MANIFEST_ITEMS.filter((item) => item.categoryId === categoryId)
