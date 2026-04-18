import type {
  CatalogItemActionKind,
  CatalogItemAssetKind,
  CatalogItemPreviewMedia,
} from './catalogItemContract'

export type CatalogRepoSeedItem = {
  itemId: string
  label: string
  familyKey: string
  sectionKey: string
  tags: string[]
  description: string
  assetKind: CatalogItemAssetKind
  actionKind: CatalogItemActionKind
  assetPath: string
  previewMedia: CatalogItemPreviewMedia[]
}

export const CATALOG_REPO_SEED_ITEMS: CatalogRepoSeedItem[] = [
  {
    itemId: 'reference:footpad-pubpad-full-assembly',
    label: 'PubPad Full Assembly',
    familyKey: 'footpads',
    sectionKey: 'footpads',
    tags: ['reference', 'footpad', 'assembly'],
    description: 'Repo-backed curated footpad assembly for the first optional Catalog footpads family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/footpads/pubpad-full-assembly.svg',
        alt: 'PubPad Full Assembly preview',
      },
    ],
  },
  {
    itemId: 'reference:shoe-1',
    label: 'Shoe 1',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable'],
    description: 'Repo-backed curated shoe reference for the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/Shoe_1.glb',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/shoes/shoe-1.svg',
        alt: 'Shoe 1 preview',
      },
    ],
  },
  {
    itemId: 'reference:shoe-2',
    label: 'Shoe 2',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable'],
    description: 'Repo-backed curated shoe reference for the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/Shoe_2.glb',
    previewMedia: [],
  },
  {
    itemId: 'reference:shoe-3',
    label: 'Shoe 3',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable'],
    description: 'Repo-backed curated shoe reference for the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/Shoe_3.glb',
    previewMedia: [],
  },
  {
    itemId: 'reference:vans-high-top-low',
    label: 'Vans High Top Low',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable', 'vans'],
    description: 'Catalog-owned shoe reference added to the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/vans-high-top-low.glb',
    previewMedia: [],
  },
  {
    itemId: 'reference:hook-large',
    label: 'Large Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/large.step',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/hooks/hook-large.svg',
        alt: 'Large Foothook preview',
      },
    ],
  },
  {
    itemId: 'reference:hook-medium',
    label: 'Medium Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/medium.step',
    previewMedia: [],
  },
  {
    itemId: 'reference:hook-small',
    label: 'Small Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/small.step',
    previewMedia: [],
  },
  {
    itemId: 'reference:hook-xl',
    label: 'XL Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/xl.step',
    previewMedia: [],
  },
  {
    itemId: 'environment:studio',
    label: 'Studio Environment',
    familyKey: 'environments',
    sectionKey: 'hdris',
    tags: ['environment', 'hdri', 'studio'],
    description: 'Repo-backed environment fixture entry for the first shared viewer-apply seam.',
    assetKind: 'environment',
    actionKind: 'apply-environment',
    assetPath: 'Environments/studio.hdr',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/environments/studio-environment.svg',
        alt: 'Studio Environment preview',
      },
    ],
  },
]
