import { describe, expect, it } from 'vitest'
import {
  getCatalogItemPrimaryPreviewMedia,
  isCatalogItemActionKind,
  isCatalogItemAssetKind,
  isCatalogItemImportsEntry,
  isCatalogItemRole,
  isCatalogItemSourceKind,
  isCatalogStartingAssemblyItem,
  resolveCatalogRepoReferencePreviewSource,
  resolveCatalogRepoEnvironmentSource,
  resolveCatalogPreviewMediaSrc,
  type CatalogItemRecord,
} from './catalogItemContract'

describe('catalogItemContract', () => {
  it('defines one explicit baseline catalog item shape for repo-backed browse entries', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'references',
      sectionKey: 'shoes',
      tags: ['shoe', 'reference'],
      systemKey: 'Platform',
      platformCompatibility: ['ADV', 'XR', 'GT', 'Pint', 'XR Classic'],
      partType: 'Shoe',
      position: 'Pair',
      productName: 'Shoe 1',
      brand: 'ParaHook',
      partGroups: ['Shoes'],
      description: 'Baseline repo-backed shoe reference for Catalog browse.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_1.glb',
      },
      previewMedia: [
        {
          mediaKind: 'image',
          src: 'CatalogPreviews/shoes/Shoe_1.png',
          alt: 'Shoe 1 preview',
        },
      ],
    }

    expect(isCatalogItemAssetKind(item.assetKind)).toBe(true)
    expect(isCatalogItemActionKind(item.actionKind)).toBe(true)
    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(isCatalogItemImportsEntry(item)).toBe(false)
    expect(getCatalogItemPrimaryPreviewMedia(item)).toEqual(item.previewMedia[0])
    expect(item.systemKey).toBe('Platform')
    expect(item.platformCompatibility).toEqual(['ADV', 'XR', 'GT', 'Pint', 'XR Classic'])
    expect(item.partType).toBe('Shoe')
    expect(item.position).toBe('Pair')
    expect(item.productName).toBe('Shoe 1')
    expect(item.brand).toBe('ParaHook')
    expect(item.partGroups).toEqual(['Shoes'])
  })

  it('keeps imports-area reuse entries explicit without pretending Catalog owns import intake', () => {
    const item: CatalogItemRecord = {
      itemId: 'imports:shoe-1',
      label: 'Imported Shoe 1',
      familyKey: 'imports',
      sectionKey: 'user-references',
      tags: ['imports', 'shoe'],
      description: 'Previously imported shoe surfaced for reuse in Catalog.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'imports',
        importId: 'import-record-1',
        assetPath: 'ImportedModels/shoes/imported-shoe-1.glb',
      },
      previewMedia: [],
    }

    expect(isCatalogItemImportsEntry(item)).toBe(true)
    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(getCatalogItemPrimaryPreviewMedia(item)).toBeNull()
  })

  it('recognizes generic external sources without making them imports or repo preview assets', () => {
    const item: CatalogItemRecord = {
      itemId: 'external:pubparts:part-1',
      label: 'PubParts Source Part',
      familyKey: 'external',
      sectionKey: 'pubparts',
      tags: ['external', 'pubparts'],
      description: 'External source groundwork entry that is not surfaced as a live Catalog item yet.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'external',
        provider: {
          providerId: 'pubparts',
          providerName: 'PubParts',
          sourceCollectionKey: 'platform',
          sourceCollectionLabel: 'XR',
        },
        sourceUrl: 'https://example.com/pubparts/parts.json',
        externalItemUrl: 'https://example.com/pubparts/part-1',
        previewImageUrl: 'https://example.com/pubparts/part-1.png',
        linkedArchiveUrl: 'https://example.com/pubparts/part-1.zip',
        sourceLastUpdated: '2026-04-20',
        archiveLastUpdated: '2026-04-19',
      },
      previewMedia: [],
    }

    expect(isCatalogItemSourceKind('external')).toBe(true)
    expect(isCatalogItemSourceKind('pubparts')).toBe(false)
    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(isCatalogItemImportsEntry(item)).toBe(false)
    expect(resolveCatalogRepoReferencePreviewSource(item)).toBeNull()
    expect(resolveCatalogRepoEnvironmentSource(item)).toBeNull()
    expect('assetPath' in item.source).toBe(false)

    if (item.source.sourceKind !== 'external') {
      throw new Error('Expected external source branch')
    }

    expect(item.source.provider.providerId).toBe('pubparts')
    expect(item.source.externalItemUrl).toBe('https://example.com/pubparts/part-1')
    expect(item.source.previewImageUrl).toBe('https://example.com/pubparts/part-1.png')
    expect(item.source.linkedArchiveUrl).toBe('https://example.com/pubparts/part-1.zip')
    expect(item.source.archiveLastUpdated).toBe('2026-04-19')
  })

  it('keeps wheel-specific motor and tire fitment as local structured metadata', () => {
    const motorItem: CatalogItemRecord = {
      itemId: 'reference:test-motor-fitment',
      label: 'Test Motor Fitment',
      familyKey: 'motors',
      sectionKey: 'motors',
      tags: ['reference', 'motor'],
      systemKey: 'Wheel',
      partType: 'Motor',
      partGroups: ['Motors'],
      description: 'Contract-only motor fitment proof without adding a live seed record.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/test-only/motor-fitment.step',
      },
      previewMedia: [],
      wheelFitment: {
        motorVersion: 'Hypercore',
        hubSizeInches: '6',
      },
    }
    const tireItem: CatalogItemRecord = {
      itemId: 'reference:test-tire-fitment',
      label: 'Test Tire Fitment',
      familyKey: 'tires',
      sectionKey: 'tires',
      tags: ['reference', 'tire'],
      systemKey: 'Wheel',
      partType: 'Tire',
      partGroups: ['Tires'],
      description: 'Contract-only tire fitment proof without adding a live seed record.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/test-only/tire-fitment.step',
      },
      previewMedia: [],
      wheelFitment: {
        tireSize: '11x6.0-6',
        tireCompound: 'Soft',
        hubSizeInches: '6',
      },
    }

    expect(motorItem.source.sourceKind).toBe('repo')
    expect(motorItem.actionKind).toBe('add-to-project')
    expect(motorItem.wheelFitment).toEqual({
      motorVersion: 'Hypercore',
      hubSizeInches: '6',
    })
    expect(tireItem.source.sourceKind).toBe('repo')
    expect(tireItem.actionKind).toBe('add-to-project')
    expect(tireItem.wheelFitment).toEqual({
      tireSize: '11x6.0-6',
      tireCompound: 'Soft',
      hubSizeInches: '6',
    })
  })

  it('keeps starting assemblies as an explicit opt-in role without adding a project action', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:test-starting-assembly',
      label: 'Test Starting Assembly',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['reference', 'starting-assembly'],
      description: 'Contract-only starting assembly proof without adding a live seed record.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/test-only/xr-starting-assembly.step',
      },
      previewMedia: [],
      itemRole: 'starting-assembly',
      startingAssembly: {
        status: 'planned',
        platformFamily: 'XR',
        sourceAssetPreference: 'step-or-stp',
      },
    }
    const ordinaryItem: CatalogItemRecord = {
      ...item,
      itemId: 'reference:test-ordinary-item',
      itemRole: undefined,
      startingAssembly: undefined,
    }

    expect(isCatalogItemRole('starting-assembly')).toBe(true)
    expect(isCatalogItemRole('standard')).toBe(false)
    expect(isCatalogStartingAssemblyItem(item)).toBe(true)
    expect(isCatalogStartingAssemblyItem(ordinaryItem)).toBe(false)
    expect(item.actionKind).toBe('load-preview')
    expect(isCatalogItemActionKind('load-as-starting-configuration')).toBe(false)
    expect(resolveCatalogRepoReferencePreviewSource(item)).toEqual({
      fileType: 'step',
      objectUrl: expect.stringMatching(/\/Catalog\/test-only\/xr-starting-assembly\.step$/),
    })
  })

  it('recognizes planned source entries without allowing repo preview asset paths', () => {
    const item: CatalogItemRecord = {
      itemId: 'starting-assembly:adv-full-assembly-planned',
      label: 'ADV Full Assembly',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['starting-assembly', 'adv', 'planned-source'],
      platformCompatibility: ['ADV'],
      description: 'Planned heavy STEP starting assembly source proof.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'planned',
        sourceLabel: 'Verified ADV STEP source candidate',
        sourceAssetPath: 'Catalog/boards/adv/ADV_Full Assembly_parts.step',
        sourceAssetFormat: 'step-or-stp',
        sourceFileSizeBytes: 55825705,
        sourceStatus: 'known-heavy-source',
      },
      previewMedia: [],
      itemRole: 'starting-assembly',
      startingAssembly: {
        status: 'planned',
        platformFamily: 'ADV',
        sourceAssetPreference: 'step-or-stp',
      },
    }

    expect(isCatalogItemSourceKind('planned')).toBe(true)
    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(isCatalogStartingAssemblyItem(item)).toBe(true)
    expect(resolveCatalogRepoReferencePreviewSource(item)).toBeNull()
    expect(resolveCatalogRepoEnvironmentSource(item)).toBeNull()
    expect('assetPath' in item.source).toBe(false)

    if (item.source.sourceKind !== 'planned') {
      throw new Error('Expected planned source branch')
    }

    expect(item.source.sourceAssetPath).toBe('Catalog/boards/adv/ADV_Full Assembly_parts.step')
    expect(item.source.sourceFileSizeBytes).toBe(55825705)
  })

  it('lets planned source entries carry versioned multi-file asset-set truth without enabling preview', () => {
    const item: CatalogItemRecord = {
      itemId: 'starting-assembly:xr-pubwheel-1-planned',
      label: 'XR PubWheel Assembly 1',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['starting-assembly', 'xr', 'pubwheel', 'planned-source'],
      platformCompatibility: ['XR'],
      description: 'Planned XR source asset set proof without live seed migration.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'planned',
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
            {
              versionId: 'v2',
              versionLabel: 'Version 2',
              status: 'archived',
              variants: [],
              notes: ['Fixture-only future version proof.'],
            },
          ],
        },
      },
      previewMedia: [],
      itemRole: 'starting-assembly',
      startingAssembly: {
        status: 'planned',
        platformFamily: 'XR',
        sourceAssetPreference: 'step-or-stp',
      },
    }

    expect(isCatalogItemSourceKind(item.source.sourceKind)).toBe(true)
    expect(resolveCatalogRepoReferencePreviewSource(item)).toBeNull()
    expect(resolveCatalogRepoEnvironmentSource(item)).toBeNull()
    expect('assetPath' in item.source).toBe(false)

    if (item.source.sourceKind !== 'planned') {
      throw new Error('Expected planned source branch')
    }

    expect(item.source.sourceAssetSet).toEqual({
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
        {
          versionId: 'v2',
          versionLabel: 'Version 2',
          status: 'archived',
          variants: [],
          notes: ['Fixture-only future version proof.'],
        },
      ],
    })
  })

  it('resolves repo-backed preview media through the app base path', () => {
    expect(resolveCatalogPreviewMediaSrc('CatalogPreviews/shoes/shoe-1.svg')).toMatch(
      /\/CatalogPreviews\/shoes\/shoe-1\.svg$/,
    )
    expect(resolveCatalogPreviewMediaSrc('data:image/svg+xml,test')).toBe(
      'data:image/svg+xml,test',
    )
  })

  it('resolves repo-backed reference items into local interactive preview viewport sources', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'shoes',
      sectionKey: 'shoes',
      tags: ['shoe', 'reference'],
      description: 'Baseline repo-backed shoe reference for Catalog browse.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_1.glb',
      },
      previewMedia: [],
    }

    expect(resolveCatalogRepoReferencePreviewSource(item)).toEqual({
      fileType: 'glb',
      objectUrl: expect.stringMatching(/\/Catalog\/shoes\/Shoe_1\.glb$/),
    })
  })

  it('resolves repo-backed HDRI and EXR items into environment source paths', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:docklands-02-2k-hdr',
      label: 'Docklands 02 2K',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri', 'hdr'],
      description: 'Repo-backed HDRI for Catalog browse.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'HDRI/docklands_02_2k.hdr',
      },
      previewMedia: [],
    }

    expect(resolveCatalogRepoEnvironmentSource(item)).toEqual({
      fileType: 'hdr',
      label: 'Docklands 02 2K',
      objectUrl: expect.stringMatching(/\/HDRI\/docklands_02_2k\.hdr$/),
    })
  })
})
