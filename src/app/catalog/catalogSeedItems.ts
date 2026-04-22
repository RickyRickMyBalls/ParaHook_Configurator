import type {
  CatalogItemActionKind,
  CatalogItemAssetKind,
  CatalogItemMetadataEntry,
  CatalogItemPlatformFamily,
  CatalogItemPreviewMedia,
  CatalogItemWheelFitment,
  CatalogItemRole,
  CatalogSourceAssetSet,
  CatalogStartingAssembly,
  CatalogStartingAssemblySourceAssetPreference,
} from './catalogItemContract'

export type CatalogRepoSeedItem = {
  itemId: string
  label: string
  familyKey: string
  sectionKey: string
  tags: string[]
  systemKey?: 'Platform' | 'Wheel' | 'Hardware'
  platformCompatibility?: Array<'ADV' | 'XR' | 'GT' | 'Pint' | 'XR Classic' | 'Other'>
  partType?: string
  position?: 'Front' | 'Rear' | 'Pair' | 'Universal'
  productName?: string
  brand?: string
  partGroups?: Array<
    | 'Footpads'
    | 'Bumpers'
    | 'Rails'
    | 'Motors'
    | 'Tires'
    | 'Boxes'
    | 'Battery Boxes'
    | 'Controllers'
    | 'Fenders'
    | 'Rim Savers'
    | 'Axle Blocks'
    | 'Bearings'
    | 'Guards'
    | 'Brackets'
    | 'Adapters'
    | 'Tools'
    | 'Electronics'
    | 'Lights'
    | 'Remotes'
    | 'Stands'
    | 'FootHolds'
    | 'Shoes'
    | 'Screw & Nuts'
    | 'Miscellaneous'
  >
  description: string
  assetKind: CatalogItemAssetKind
  actionKind: CatalogItemActionKind
  assetPath: string
  previewMedia: CatalogItemPreviewMedia[]
  notes?: string[]
  metadata?: CatalogItemMetadataEntry[]
  wheelFitment?: CatalogItemWheelFitment
  itemRole?: CatalogItemRole
  startingAssembly?: CatalogStartingAssembly
}

export type CatalogPlannedStartingAssemblySeedItem = {
  itemId: string
  label: string
  familyKey: string
  sectionKey: string
  tags: string[]
  platformCompatibility?: CatalogItemPlatformFamily[]
  description: string
  assetKind: 'reference-asset'
  actionKind: 'load-preview'
  sourceLabel: string
  sourceAssetPath: string
  sourceAssetFormat: CatalogStartingAssemblySourceAssetPreference
  sourceFileSizeBytes: number
  sourceStatus: 'known-heavy-source'
  sourceAssetSet?: CatalogSourceAssetSet
  previewMedia: CatalogItemPreviewMedia[]
  notes?: string[]
  metadata?: CatalogItemMetadataEntry[]
  itemRole: 'starting-assembly'
  startingAssembly: CatalogStartingAssembly
}

export const CATALOG_PLANNED_STARTING_ASSEMBLY_SEED_ITEMS: CatalogPlannedStartingAssemblySeedItem[] = [
  {
    itemId: 'starting-assembly:adv-full-assembly-planned',
    label: 'ADV Full Assembly',
    familyKey: 'starting-assemblies',
    sectionKey: 'starting-assemblies',
    tags: ['starting-assembly', 'adv', 'pubwheel', 'step', 'planned-source'],
    platformCompatibility: ['ADV'],
    description:
      'Verified ADV full assembly STEP source candidate. Add To Project can place the source as a project reference; preview and starting-configuration load remain planned behind later owners.',
    assetKind: 'reference-asset',
    actionKind: 'load-preview',
    sourceLabel: 'Verified ADV STEP source candidate',
    sourceAssetPath: 'Catalog/boards/adv/ADV_Full Assembly_parts.step',
    sourceAssetFormat: 'step-or-stp',
    sourceFileSizeBytes: 55825705,
    sourceStatus: 'known-heavy-source',
    previewMedia: [],
    notes: [
      'Verified source candidate exists in public/Catalog and can now be added to project as a normal reference from its source path.',
      'Heavy preview remains disabled so Catalog does not load the 55.8 MB STEP file through the temporary preview path before Import-5 guardrails.',
      'Import-5 owns large STEP units, tessellation, heavy-load progress, parse reuse, and loader fidelity.',
      'Load as starting configuration remains unavailable until a downstream builder owner is wired.',
    ],
    metadata: [
      { label: 'Family', value: 'Starting Assemblies' },
      { label: 'Platform Family', value: 'ADV' },
      { label: 'Format', value: 'STEP/STP preferred source asset' },
      { label: 'Add To Project Mode', value: 'Adds the full assembly source as a project reference' },
      { label: 'Source Candidate Path', value: 'Catalog/boards/adv/ADV_Full Assembly_parts.step' },
      { label: 'Source File Size', value: '55.8 MB' },
      { label: 'Source Asset Preference', value: 'STEP/STP preferred source asset' },
    ],
    itemRole: 'starting-assembly',
    startingAssembly: {
      status: 'planned',
      platformFamily: 'ADV',
      sourceAssetPreference: 'step-or-stp',
    },
  },
  {
    itemId: 'starting-assembly:xr-pubwheel-1-planned',
    label: 'XR PubWheel Assembly 1',
    familyKey: 'starting-assemblies',
    sectionKey: 'starting-assemblies',
    tags: ['starting-assembly', 'xr', 'pubwheel', 'step', 'glb', 'planned-source'],
    platformCompatibility: ['XR'],
    description:
      'Verified XR PubWheel full assembly STEP source candidate. Add To Project can place the source as a project reference; preview and starting-configuration load remain planned behind later owners.',
    assetKind: 'reference-asset',
    actionKind: 'load-preview',
    sourceLabel: 'Verified XR STEP source candidate',
    sourceAssetPath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step',
    sourceAssetFormat: 'step-or-stp',
    sourceFileSizeBytes: 73126597,
    sourceStatus: 'known-heavy-source',
    sourceAssetSet: {
      sourceId: 'pubwheel_1',
      currentVersionId: 'v1',
      versions: [
        {
          versionId: 'v1',
          versionLabel: 'Version 1',
          status: 'current',
          variants: [
            {
              variantId: 'pubwheel_1:v1:step-source',
              role: 'preferred-source',
              format: 'step',
              sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step',
              fileSizeBytes: 73126597,
            },
            {
              variantId: 'pubwheel_1:v1:glb-companion',
              role: 'companion-mesh',
              format: 'glb',
              sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb',
              fileSizeBytes: 79230220,
            },
          ],
        },
      ],
    },
    previewMedia: [],
    notes: [
      'Verified XR source candidate exists in public/Catalog/assemblies/xr and can now be added to project as a normal reference from its preferred STEP source path.',
      'Companion GLB exists at Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb for later preview or fallback mesh planning.',
      'Heavy preview remains disabled so Catalog does not load the 73.1 MB STEP file through the temporary preview path before Import-5 guardrails.',
      'Import-5 owns large STEP units, tessellation, heavy-load progress, parse reuse, and loader fidelity.',
      'Load as starting configuration remains unavailable until a downstream builder owner is wired.',
    ],
    metadata: [
      { label: 'Family', value: 'Starting Assemblies' },
      { label: 'Platform Family', value: 'XR' },
      { label: 'Format', value: 'STEP/STP preferred source asset' },
      { label: 'Add To Project Mode', value: 'Adds the full assembly source as a project reference' },
      { label: 'Source Candidate Path', value: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step' },
      { label: 'Companion Mesh Path', value: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb' },
      { label: 'Source File Size', value: '73.1 MB' },
      { label: 'Companion Mesh File Size', value: '79.2 MB' },
      { label: 'Source Asset Preference', value: 'STEP/STP preferred source asset' },
    ],
    itemRole: 'starting-assembly',
    startingAssembly: {
      status: 'planned',
      platformFamily: 'XR',
      sourceAssetPreference: 'step-or-stp',
    },
  },
]

export const CATALOG_REPO_SEED_ITEMS: CatalogRepoSeedItem[] = [
  {
    itemId: 'reference:footpad-pubpad-full-assembly',
    label: 'PubPad Full Assembly',
    familyKey: 'footpads',
    sectionKey: 'footpads',
    tags: ['reference', 'footpad', 'assembly'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'Footpad',
    position: 'Pair',
    productName: 'PubPad Full Assembly',
    brand: 'ParaHook',
    partGroups: ['Footpads'],
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
    notes: [
      'Published full-assembly footpad entry for the first Catalog-owned footpads family.',
      'This stays a reference-family add-to-project item instead of a viewer-only preset.',
    ],
    metadata: [
      { label: 'Family', value: 'Footpads' },
      { label: 'Format', value: 'OBJ assembly' },
      { label: 'Catalog Home', value: 'Catalog/footpads' },
    ],
  },
  {
    itemId: 'reference:shoe-1',
    label: 'Shoe 1',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'Shoe',
    position: 'Pair',
    productName: 'Shoe 1',
    brand: 'ParaHook',
    partGroups: ['Shoes'],
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
    notes: [
      'Curated repo-backed shoe reference that now lives in the Catalog-owned shoes home.',
      'Best used when the user wants an explicit project-content add from the lightweight Catalog browse flow.',
    ],
    metadata: [
      { label: 'Family', value: 'Shoes' },
      { label: 'Format', value: 'GLB' },
      { label: 'Catalog Home', value: 'Catalog/shoes' },
    ],
  },
  {
    itemId: 'reference:shoe-2',
    label: 'Shoe 2',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'Shoe',
    position: 'Pair',
    productName: 'Shoe 2',
    brand: 'ParaHook',
    partGroups: ['Shoes'],
    description: 'Repo-backed curated shoe reference for the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/Shoe_2.glb',
    previewMedia: [],
    notes: [
      'Companion curated shoe entry in the first Catalog-owned shoes set.',
      'Keeps the same explicit add-to-project contract as the rest of the reference families.',
    ],
    metadata: [
      { label: 'Family', value: 'Shoes' },
      { label: 'Format', value: 'GLB' },
      { label: 'Catalog Home', value: 'Catalog/shoes' },
    ],
  },
  {
    itemId: 'reference:shoe-3',
    label: 'Shoe 3',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'Shoe',
    position: 'Pair',
    productName: 'Shoe 3',
    brand: 'ParaHook',
    partGroups: ['Shoes'],
    description: 'Repo-backed curated shoe reference for the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/Shoe_3.glb',
    previewMedia: [],
    notes: [
      'Companion curated shoe entry in the first Catalog-owned shoes set.',
      'Stays intentionally lightweight until later richer preview coverage is added.',
    ],
    metadata: [
      { label: 'Family', value: 'Shoes' },
      { label: 'Format', value: 'GLB' },
      { label: 'Catalog Home', value: 'Catalog/shoes' },
    ],
  },
  {
    itemId: 'reference:vans-high-top-low',
    label: 'Vans High Top Low',
    familyKey: 'shoes',
    sectionKey: 'shoes',
    tags: ['reference', 'shoe', 'wearable', 'vans'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'Shoe',
    position: 'Pair',
    productName: 'Vans High Top Low',
    brand: 'Vans',
    partGroups: ['Shoes'],
    description: 'Catalog-owned shoe reference added to the first optional Catalog shoes family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/shoes/vans-high-top-low.glb',
    previewMedia: [],
    notes: [
      'Externally sourced shoe model copied into the Catalog-owned shoes family home.',
      'Useful as a slightly more product-like shoe option inside the same curated family.',
    ],
    metadata: [
      { label: 'Family', value: 'Shoes' },
      { label: 'Format', value: 'GLB' },
      { label: 'Catalog Home', value: 'Catalog/shoes' },
    ],
  },
  {
    itemId: 'reference:hook-large',
    label: 'Large Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'FootHold',
    position: 'Universal',
    productName: 'Large Foothook',
    brand: 'ParaHook',
    partGroups: ['FootHolds'],
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
    notes: [
      'Large foothook entry from the migrated Catalog-owned hooks family.',
      'Remains a reference add-to-project item rather than a viewer-side preset.',
    ],
    metadata: [
      { label: 'Family', value: 'Foothooks' },
      { label: 'Format', value: 'STEP' },
      { label: 'Catalog Home', value: 'Catalog/hooks' },
    ],
  },
  {
    itemId: 'reference:hook-medium',
    label: 'Medium Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'FootHold',
    position: 'Universal',
    productName: 'Medium Foothook',
    brand: 'ParaHook',
    partGroups: ['FootHolds'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/medium.step',
    previewMedia: [],
    notes: [
      'Medium foothook option in the first Catalog-owned hook set.',
      'Kept on the same explicit add-to-project path as the rest of the curated hook family.',
    ],
    metadata: [
      { label: 'Family', value: 'Foothooks' },
      { label: 'Format', value: 'STEP' },
      { label: 'Catalog Home', value: 'Catalog/hooks' },
    ],
  },
  {
    itemId: 'reference:hook-small',
    label: 'Small Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'FootHold',
    position: 'Universal',
    productName: 'Small Foothook',
    brand: 'ParaHook',
    partGroups: ['FootHolds'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/small.step',
    previewMedia: [],
    notes: [
      'Small foothook option in the first Catalog-owned hook set.',
      'Stays in the same curated family contract without widening into new runtime owners.',
    ],
    metadata: [
      { label: 'Family', value: 'Foothooks' },
      { label: 'Format', value: 'STEP' },
      { label: 'Catalog Home', value: 'Catalog/hooks' },
    ],
  },
  {
    itemId: 'reference:hook-xl',
    label: 'XL Foothook',
    familyKey: 'foothooks',
    sectionKey: 'foothooks',
    tags: ['reference', 'foothook', 'premade'],
    systemKey: 'Platform',
    platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
    partType: 'FootHold',
    position: 'Universal',
    productName: 'XL Foothook',
    brand: 'ParaHook',
    partGroups: ['FootHolds'],
    description:
      'Repo-backed curated foothook reference for the first optional Catalog foothooks family.',
    assetKind: 'reference-asset',
    actionKind: 'add-to-project',
    assetPath: 'Catalog/hooks/xl.step',
    previewMedia: [],
    notes: [
      'XL foothook option in the first Catalog-owned hook set.',
      'Supports the same explicit preview-versus-commit read as the rest of the reference catalog.',
    ],
    metadata: [
      { label: 'Family', value: 'Foothooks' },
      { label: 'Format', value: 'STEP' },
      { label: 'Catalog Home', value: 'Catalog/hooks' },
    ],
  },
  {
    itemId: 'environment:citrus-orchard-road-puresky-2k-exr',
    label: 'Citrus Orchard Road Puresky 2K',
    familyKey: 'environments',
    sectionKey: 'hdris',
    tags: ['environment', 'hdri', 'exr', 'outdoor', 'sky'],
    description: 'Repo-backed EXR environment from the live HDRI folder for bright outdoor scene lighting.',
    assetKind: 'environment',
    actionKind: 'apply-environment',
    assetPath: 'HDRI/citrus_orchard_road_puresky_2k.exr',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/environments/citrus-orchard-road-puresky-2k.svg',
        alt: 'Citrus Orchard Road Puresky 2K environment thumbnail',
      },
    ],
    notes: [
      'Live repo HDRI inventory item from public/HDRI.',
      'Applies through viewer environment state instead of Browser project content.',
    ],
    metadata: [
      { label: 'Family', value: 'HDRIs' },
      { label: 'Format', value: 'EXR' },
      { label: 'Catalog Home', value: 'public/HDRI' },
    ],
  },
  {
    itemId: 'environment:docklands-02-2k-hdr',
    label: 'Docklands 02 2K',
    familyKey: 'environments',
    sectionKey: 'hdris',
    tags: ['environment', 'hdri', 'hdr', 'urban', 'outdoor'],
    description: 'Repo-backed HDR environment from the live HDRI folder for dockside outdoor lighting.',
    assetKind: 'environment',
    actionKind: 'apply-environment',
    assetPath: 'HDRI/docklands_02_2k.hdr',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/environments/docklands-02-2k.svg',
        alt: 'Docklands 02 2K environment thumbnail',
      },
    ],
    notes: [
      'Live repo HDRI inventory item from public/HDRI.',
      'Keeps HDRI apply behavior viewer-owned and separate from reference adds.',
    ],
    metadata: [
      { label: 'Family', value: 'HDRIs' },
      { label: 'Format', value: 'HDR' },
      { label: 'Catalog Home', value: 'public/HDRI' },
    ],
  },
  {
    itemId: 'environment:rogland-clear-night-2k-hdr',
    label: 'Rogland Clear Night 2K',
    familyKey: 'environments',
    sectionKey: 'hdris',
    tags: ['environment', 'hdri', 'hdr', 'night', 'outdoor'],
    description: 'Repo-backed HDR environment from the live HDRI folder for clear night lighting.',
    assetKind: 'environment',
    actionKind: 'apply-environment',
    assetPath: 'HDRI/rogland_clear_night_2k.hdr',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/environments/rogland-clear-night-2k.svg',
        alt: 'Rogland Clear Night 2K environment thumbnail',
      },
    ],
    notes: [
      'Live repo HDRI inventory item from public/HDRI.',
      'Applies through the Catalog-to-viewer environment seam.',
    ],
    metadata: [
      { label: 'Family', value: 'HDRIs' },
      { label: 'Format', value: 'HDR' },
      { label: 'Catalog Home', value: 'public/HDRI' },
    ],
  },
  {
    itemId: 'environment:studio-small-09-2k-exr',
    label: 'Studio Small 09 2K EXR',
    familyKey: 'environments',
    sectionKey: 'hdris',
    tags: ['environment', 'hdri', 'exr', 'studio'],
    description: 'Repo-backed EXR studio environment from the live HDRI folder.',
    assetKind: 'environment',
    actionKind: 'apply-environment',
    assetPath: 'HDRI/studio_small_09_2k.exr',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/environments/studio-small-09-2k.svg',
        alt: 'Studio Small 09 2K environment thumbnail',
      },
    ],
    notes: [
      'Live repo HDRI inventory item from public/HDRI.',
      'EXR companion to the HDR studio entry.',
    ],
    metadata: [
      { label: 'Family', value: 'HDRIs' },
      { label: 'Format', value: 'EXR' },
      { label: 'Catalog Home', value: 'public/HDRI' },
    ],
  },
  {
    itemId: 'environment:studio-small-09-2k-hdr',
    label: 'Studio Small 09 2K HDR',
    familyKey: 'environments',
    sectionKey: 'hdris',
    tags: ['environment', 'hdri', 'hdr', 'studio'],
    description: 'Repo-backed HDR studio environment from the live HDRI folder.',
    assetKind: 'environment',
    actionKind: 'apply-environment',
    assetPath: 'HDRI/studio_small_09_2k.hdr',
    previewMedia: [
      {
        mediaKind: 'image',
        src: 'CatalogPreviews/environments/studio-small-09-2k.svg',
        alt: 'Studio Small 09 2K environment thumbnail',
      },
    ],
    notes: [
      'Live repo HDRI inventory item from public/HDRI.',
      'HDR companion to the EXR studio entry.',
    ],
    metadata: [
      { label: 'Family', value: 'HDRIs' },
      { label: 'Format', value: 'HDR' },
      { label: 'Catalog Home', value: 'public/HDRI' },
    ],
  },
]
