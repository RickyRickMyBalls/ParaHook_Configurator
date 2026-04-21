import { describe, expect, it } from 'vitest'
import type { CatalogItemRecord } from '../catalogItemContract'
import { createCatalogSourceSnapshot } from '../catalogSource'
import type { PubPartsStagedSourceRecord } from '../pubPartsDownloadsStorage'
import {
  readCachedPubPartsAllPartSourceItems,
  readCachedPubPartsFullPartSourceItems,
  readCachedPubPartsGtPartSourceItems,
} from '../pubPartsCachedSource'
import {
  buildCatalogSectionOptions,
  buildCatalogItemSourceDetails,
  buildCatalogSourceAssetSetDetails,
  buildCatalogStartingAssemblyDetails,
  buildCatalogWheelFitmentDetails,
  buildCatalogFilterGroups,
  getCatalogVisibleItems,
  resolveCatalogCardBrowseMeta,
  resolveCatalogExternalSourceActionBoundary,
  resolveCatalogExternalSourcePageUrl,
  resolveCatalogItemModeLabel,
  resolveCatalogItemPageFamilyLabel,
  resolveCatalogItemPageFamilySummary,
  resolveCatalogItemSectionLabel,
  resolveCatalogSelectedFilterCount,
  resolveCatalogItemSourceLabel,
  resolveCatalogLinkedArchiveClassification,
  resolveCatalogLinkedArchiveHandoff,
  resolveCatalogPubPartsDropboxChooserStatusRead,
  resolveCatalogPubPartsSourceDownloadHandoff,
  resolveCatalogPubPartsStagedSourceInspectionRead,
  resolveCatalogPubPartsSupportedFileChooserRead,
  resolveCatalogSelectedPubPartsImportHandoff,
  shouldRenderCatalogPreviewMediaEagerly,
  type CatalogSelectedFilters,
} from './catalogShellShared'

describe('catalogShellShared grouped filter semantics', () => {
  const buildExternalSourceItem = (
    sourceOverrides: Partial<Extract<CatalogItemRecord['source'], { sourceKind: 'external' }>> = {},
  ): CatalogItemRecord => ({
    itemId: 'external:pubparts:test-source',
    label: 'External Source Test',
    familyKey: 'external-pubparts',
    sectionKey: 'external-pubparts-parts',
    tags: ['external', 'pubparts'],
    description: 'External source item for helper tests.',
    assetKind: 'reference-asset',
    actionKind: 'load-preview',
    source: {
      sourceKind: 'external',
      provider: {
        providerId: 'pubparts',
        providerName: 'PubParts',
      },
      externalItemUrl: 'https://example.com/specific-item',
      sourceUrl: 'https://example.com/source-set',
      linkedArchiveUrl: 'https://example.com/archive.zip',
      ...sourceOverrides,
    },
    previewMedia: [],
  })

  it('builds grouped local taxonomy filter options from the live catalog snapshot', () => {
    const snapshot = createCatalogSourceSnapshot()

    const filterGroups = buildCatalogFilterGroups(snapshot, 'all', '', 'part')

    expect(filterGroups.map((group) => group.label)).toEqual(
      expect.arrayContaining([
        'Platform Compatibility',
        'Part Type',
        'Part Groups',
        'System',
        'Brand',
      ]),
    )

    expect(
      filterGroups.find((group) => group.groupKey === 'platformCompatibility')?.options.map((option) => option.value),
    ).toEqual(expect.arrayContaining(['ADV', 'XR', 'GT', 'Pint', 'XR Classic']))
    expect(
      filterGroups.find((group) => group.groupKey === 'partGroups')?.options.map((option) => option.value),
    ).toEqual(expect.arrayContaining(['Shoes', 'FootHolds', 'Footpads']))
  })

  it('keeps OR inside one group and AND across groups while leaving search as a separate gate', () => {
    const snapshot = createCatalogSourceSnapshot()

    const orWithinOneGroup: CatalogSelectedFilters = {
      partGroups: ['Shoes', 'FootHolds'],
    }
    const andAcrossGroups: CatalogSelectedFilters = {
      platformCompatibility: ['XR'],
      partType: ['Shoe'],
      brand: ['Vans'],
    }
    const impossibleFilters: CatalogSelectedFilters = {
      ...andAcrossGroups,
      partGroups: ['FootHolds'],
    }

    expect(resolveCatalogSelectedFilterCount(orWithinOneGroup)).toBe(2)
    expect(
      getCatalogVisibleItems(snapshot, 'all', '', orWithinOneGroup, 'part').map((item) => item.label),
    ).toEqual(
      expect.arrayContaining([
        'Shoe 1',
        'Shoe 2',
        'Shoe 3',
        'Vans High Top Low',
        'Large Foothook',
        'Medium Foothook',
        'Small Foothook',
        'XL Foothook',
      ]),
    )
    expect(getCatalogVisibleItems(snapshot, 'all', '', orWithinOneGroup, 'part')).toHaveLength(8)

    expect(resolveCatalogSelectedFilterCount(andAcrossGroups)).toBe(3)
    expect(getCatalogVisibleItems(snapshot, 'all', '', andAcrossGroups, 'part')).toEqual([
      expect.objectContaining({
        itemId: 'reference:vans-high-top-low',
        label: 'Vans High Top Low',
      }),
    ])
    expect(getCatalogVisibleItems(snapshot, 'all', '', impossibleFilters, 'part')).toHaveLength(0)

    expect(
      getCatalogVisibleItems(snapshot, 'all', 'High Top', andAcrossGroups, 'part').map((item) => item.label),
    ).toEqual(['Vans High Top Low'])
    expect(getCatalogVisibleItems(snapshot, 'all', 'Shoe 1', andAcrossGroups, 'part')).toHaveLength(0)
  })

  it('labels external PubParts entries without falling through to repo or imports copy', () => {
    const snapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: readCachedPubPartsAllPartSourceItems(),
    })
    const externalItem = snapshot.externalItems.find(
      (item) => item.label === '3d Printed Gripples',
    )

    expect(externalItem).toBeDefined()
    expect(resolveCatalogItemModeLabel(externalItem!)).toBe('External Linked Source')
    expect(resolveCatalogItemSectionLabel(externalItem!)).toBe('PubParts External')
    expect(resolveCatalogItemSourceLabel(externalItem!)).toBe('External-linked PubParts')
    expect(resolveCatalogCardBrowseMeta(externalItem!, 'part')).toContain(
      'External-linked PubParts entry',
    )
    expect(resolveCatalogItemPageFamilyLabel(externalItem!)).toBe('PubParts External Source')
    expect(resolveCatalogItemPageFamilySummary(externalItem!)).toContain(
      'preview and source inspection',
    )
    expect(resolveCatalogItemPageFamilySummary(externalItem!)).not.toContain('Imports')

    const sourceDetails = buildCatalogItemSourceDetails(externalItem!)
    expect(sourceDetails).toEqual(
      expect.arrayContaining([
        { label: 'External Provider', value: 'PubParts' },
        { label: 'Source Collection', value: 'Miscellaneous Items' },
        { label: 'Source URL', value: 'https://www.printables.com/model/598759' },
        { label: 'External Item URL', value: 'https://www.printables.com/model/598759' },
        {
          label: 'Linked Archive URL',
          value:
            'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?rlkey=qw8jvfrcs5i4f4t7ukwu6y856&st=rp5mc7yj&dl=0',
        },
        { label: 'Source Updated', value: '2026-04-20' },
        { label: 'Archive Updated', value: '2024-11-16' },
      ]),
    )
    expect(sourceDetails.map((entry) => entry.label)).not.toContain('Repo Asset Path')
    expect(sourceDetails.map((entry) => entry.label)).not.toContain('Import Asset Path')
  })

  it('identifies only external PubParts image previews as eager-displayable', () => {
    const pubPartsImageItem = buildExternalSourceItem({
      previewImageUrl: 'https://pubparts.xyz/images/parts/example.png',
    })
    pubPartsImageItem.previewMedia = [
      {
        mediaKind: 'image',
        src: 'https://pubparts.xyz/images/parts/example.png',
        alt: 'PubParts example preview',
      },
    ]
    const archiveImageMismatchItem = buildExternalSourceItem({
      previewImageUrl: 'https://pubparts.xyz/images/parts/example.png',
      linkedArchiveUrl: 'https://example.com/archive.zip',
    })
    archiveImageMismatchItem.previewMedia = [
      {
        mediaKind: 'image',
        src: 'https://example.com/archive.zip',
        alt: 'Archive should not render as image',
      },
    ]
    const nonPubPartsItem = buildExternalSourceItem({
      provider: {
        providerId: 'other-source',
        providerName: 'Other Source',
      },
      previewImageUrl: 'https://example.com/image.png',
    })
    nonPubPartsItem.previewMedia = [
      {
        mediaKind: 'image',
        src: 'https://example.com/image.png',
        alt: 'Other source image',
      },
    ]
    const repoSnapshot = createCatalogSourceSnapshot()

    expect(shouldRenderCatalogPreviewMediaEagerly(pubPartsImageItem)).toBe(true)
    expect(shouldRenderCatalogPreviewMediaEagerly(archiveImageMismatchItem)).toBe(false)
    expect(shouldRenderCatalogPreviewMediaEagerly(nonPubPartsItem)).toBe(false)
    expect(shouldRenderCatalogPreviewMediaEagerly(repoSnapshot.repoItems[0])).toBe(false)
    expect(shouldRenderCatalogPreviewMediaEagerly(repoSnapshot.plannedItems[0])).toBe(false)
  })

  it('lets normalized external platform metadata use the existing platform filter path', () => {
    const snapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: [
        ...readCachedPubPartsAllPartSourceItems(),
        ...readCachedPubPartsGtPartSourceItems(),
      ],
    })

    const filterGroups = buildCatalogFilterGroups(snapshot, 'all', '', 'platform')
    expect(
      filterGroups.find((group) => group.groupKey === 'platformCompatibility')?.options.map(
        (option) => option.value,
      ),
    ).toEqual(expect.arrayContaining(['ADV', 'GT', 'Pint', 'XR Classic', 'XR', 'Other']))
    expect(
      getCatalogVisibleItems(
        snapshot,
        'all',
        '',
        { platformCompatibility: ['ADV'] },
        'platform',
      ).map((item) => item.label),
    ).toEqual(
      expect.arrayContaining(['FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs']),
    )
    expect(
      getCatalogVisibleItems(snapshot, 'all', 'GT/GT-S', {}, 'platform').map(
        (item) => item.label,
      ),
    ).toEqual(
      expect.arrayContaining([
        'Celeste: Stock Controller Box Gasket',
        'FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs',
      ]),
    )
    expect(
      getCatalogVisibleItems(snapshot, 'all', 'GT-S', {}, 'platform').map(
        (item) => item.label,
      ),
    ).toEqual(
      expect.arrayContaining([
        'Celeste: Stock Controller Box Gasket',
        'FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs',
      ]),
    )
  })

  it('counts full-cache external PubParts items in browse section options', () => {
    const snapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: readCachedPubPartsFullPartSourceItems(),
    })
    const externalPartItems = snapshot.externalItems.filter(
      (item) => item.sectionKey === 'external-pubparts-parts',
    )

    const partSections = buildCatalogSectionOptions(snapshot, 'part')
    const platformSections = buildCatalogSectionOptions(snapshot, 'platform')

    expect(externalPartItems).toHaveLength(319)
    expect(partSections.find((section) => section.sectionKey === 'Footpads')?.count).toBeGreaterThan(
      0,
    )
    expect(partSections.find((section) => section.sectionKey === 'Boxes')?.count).toBeGreaterThan(
      0,
    )
    expect(
      platformSections.find((section) => section.sectionKey === 'GT')?.count,
    ).toBeGreaterThan(0)
    expect(
      platformSections.find((section) => section.sectionKey === 'Other')?.count,
    ).toBeGreaterThan(0)
    expect(
      getCatalogVisibleItems(snapshot, 'all', 'GT/GT-S', {}, 'platform').map(
        (item) => item.label,
      ),
    ).toEqual(expect.arrayContaining(['Celeste: Stock Controller Box Gasket']))
  })

  it('lets safe external type classifications use existing system and part filter paths', () => {
    const snapshot = createCatalogSourceSnapshot(undefined, {
      pubPartsSourceItems: [
        ...readCachedPubPartsAllPartSourceItems(),
        ...readCachedPubPartsGtPartSourceItems(),
      ],
    })

    const filterGroups = buildCatalogFilterGroups(snapshot, 'all', '', 'part')
    expect(
      filterGroups.find((group) => group.groupKey === 'systemKey')?.options.map(
        (option) => option.value,
      ),
    ).toEqual(expect.arrayContaining(['Platform', 'Wheel']))
    expect(
      filterGroups.find((group) => group.groupKey === 'partType')?.options.map(
        (option) => option.value,
      ),
    ).toEqual(
      expect.arrayContaining(['Footpad Attachment', 'Controller Box', 'Rim Saver']),
    )
    expect(
      filterGroups.find((group) => group.groupKey === 'partGroups')?.options.map(
        (option) => option.value,
      ),
    ).toEqual(expect.arrayContaining(['Footpads', 'Boxes']))

    expect(
      getCatalogVisibleItems(
        snapshot,
        'all',
        '',
        { systemKey: ['Wheel'], partType: ['Rim Saver'] },
        'part',
      ).map((item) => item.label),
    ).toEqual(['FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs'])
    expect(
      getCatalogVisibleItems(
        snapshot,
        'all',
        '',
        { partGroups: ['Boxes'] },
        'part',
      ).map((item) => item.label),
    ).toEqual(expect.arrayContaining(['Celeste: Stock Controller Box Gasket']))
    expect(
      getCatalogVisibleItems(
        snapshot,
        'all',
        '',
        { partGroups: ['Boxes'] },
        'part',
      ).map((item) => item.label),
    ).not.toContain('FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs')
    expect(
      getCatalogVisibleItems(snapshot, 'all', 'Gasket, Controller Box', {}, 'part').map(
        (item) => item.label,
      ),
    ).toEqual(['Celeste: Stock Controller Box Gasket'])
  })

  it('resolves source-page URLs for external entries without using linked archives as fallback', () => {
    expect(resolveCatalogExternalSourcePageUrl(buildExternalSourceItem())).toBe(
      'https://example.com/specific-item',
    )
    expect(
      resolveCatalogExternalSourcePageUrl(
        buildExternalSourceItem({
          externalItemUrl: null,
        }),
      ),
    ).toBe('https://example.com/source-set')
    expect(
      resolveCatalogExternalSourcePageUrl(
        buildExternalSourceItem({
          externalItemUrl: '   ',
          sourceUrl: 'https://example.com/source-set-only',
        }),
      ),
    ).toBe('https://example.com/source-set-only')
    expect(
      resolveCatalogExternalSourcePageUrl(
        buildExternalSourceItem({
          externalItemUrl: null,
          sourceUrl: null,
          linkedArchiveUrl: 'https://example.com/archive-only.zip',
        }),
      ),
    ).toBeNull()

    const repoSnapshot = createCatalogSourceSnapshot()
    expect(resolveCatalogExternalSourcePageUrl(repoSnapshot.repoItems[0])).toBeNull()
  })

  it('resolves external PubParts source action boundaries without using source pages or preview images as candidates', () => {
    const archiveCandidateItem = buildExternalSourceItem({
      linkedArchiveUrl: '  https://example.com/source-files.zip  ',
    })
    const stagedRecord: PubPartsStagedSourceRecord = {
      stagedSourceId: 'pubparts:external:pubparts:test-source',
      catalogItemId: 'external:pubparts:test-source',
      catalogItemLabel: 'External Source Test',
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCandidateUrl: 'https://example.com/source-files.zip',
      linkedArchiveUrl: 'https://example.com/source-files.zip',
      sourceMetadata: [],
      status: 'source-link-staged',
      binaryStatus: 'not-downloaded',
      inspectionStatus: 'not-inspected',
      importStatus: 'not-imported',
      stagedAt: '2026-04-20T18:10:00.000Z',
      updatedAt: '2026-04-20T18:10:00.000Z',
    }
    const noCandidateItem = buildExternalSourceItem({
      linkedArchiveUrl: null,
    })
    const sourcePageOnlyItem = buildExternalSourceItem({
      externalItemUrl: 'https://example.com/item-page-only',
      sourceUrl: 'https://example.com/source-set-only',
      previewImageUrl: 'https://example.com/source-image.webp',
      linkedArchiveUrl: null,
    })
    const nonPubPartsExternalItem = buildExternalSourceItem({
      provider: {
        providerId: 'other-provider',
        providerName: 'Other Provider',
      },
    })
    const repoSnapshot = createCatalogSourceSnapshot()
    const importsItem: CatalogItemRecord = {
      itemId: 'imports:source-action-boundary',
      label: 'Imported Source Action Boundary',
      familyKey: 'imports',
      sectionKey: 'imports',
      tags: ['imports'],
      description: 'Imports source action boundary proof.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'imports',
        importId: 'imported-source-action-boundary',
        assetPath: 'blob:imported-source-action-boundary',
      },
      previewMedia: [],
    }

    expect(resolveCatalogExternalSourceActionBoundary(archiveCandidateItem)).toEqual({
      state: 'source-link-stage-ready',
      label: 'Stage Source Link',
      description:
        'Stage this PubParts source link as metadata for later inspection. ParaHook will not download, inspect, extract, import, or commit files in this step.',
      candidateUrl: 'https://example.com/source-files.zip',
      isAvailable: false,
    })
    expect(resolveCatalogExternalSourceActionBoundary(archiveCandidateItem, stagedRecord)).toEqual({
      state: 'source-link-staged',
      label: 'Source Link Staged',
      description:
        'This PubParts source link is staged as metadata only. Source bytes are not downloaded, files are not inspected, and no project asset has been imported.',
      candidateUrl: 'https://example.com/source-files.zip',
      isAvailable: false,
    })
    expect(resolveCatalogExternalSourceActionBoundary(noCandidateItem)).toEqual({
      state: 'no-source-candidate',
      label: 'No Source Candidate',
      description:
        'This external PubParts entry has no linked source candidate for a future staging or inspection action.',
      candidateUrl: null,
      isAvailable: false,
    })
    expect(resolveCatalogExternalSourceActionBoundary(sourcePageOnlyItem)).toEqual(
      expect.objectContaining({
        state: 'no-source-candidate',
        candidateUrl: null,
        isAvailable: false,
      }),
    )
    expect(resolveCatalogExternalSourceActionBoundary(nonPubPartsExternalItem)).toEqual(
      expect.objectContaining({
        state: 'not-external-pubparts',
        candidateUrl: null,
        isAvailable: false,
      }),
    )
    expect(resolveCatalogExternalSourceActionBoundary(repoSnapshot.repoItems[0])).toEqual(
      expect.objectContaining({
        state: 'not-external-pubparts',
        candidateUrl: null,
      }),
    )
    expect(resolveCatalogExternalSourceActionBoundary(repoSnapshot.plannedItems[0])).toEqual(
      expect.objectContaining({
        state: 'not-external-pubparts',
        candidateUrl: null,
      }),
    )
    expect(resolveCatalogExternalSourceActionBoundary(importsItem)).toEqual(
      expect.objectContaining({
        state: 'not-external-pubparts',
        candidateUrl: null,
      }),
    )
    expect(resolveCatalogExternalSourcePageUrl(sourcePageOnlyItem)).toBe(
      'https://example.com/item-page-only',
    )
  })

  it('resolves staged PubParts source inspection reads without implying downloads or imports', () => {
    const baseRecord: PubPartsStagedSourceRecord = {
      stagedSourceId: 'pubparts:external:pubparts:test-source',
      catalogItemId: 'external:pubparts:test-source',
      catalogItemLabel: 'External Source Test',
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCandidateUrl: 'https://example.com/source-files.zip',
      linkedArchiveUrl: 'https://example.com/source-files.zip',
      sourceMetadata: [],
      status: 'source-link-staged',
      binaryStatus: 'not-downloaded',
      inspectionStatus: 'not-inspected',
      importStatus: 'not-imported',
      stagedAt: '2026-04-20T18:10:00.000Z',
      updatedAt: '2026-04-20T18:10:00.000Z',
    }

    expect(resolveCatalogPubPartsStagedSourceInspectionRead(baseRecord)).toEqual({
      label: 'Not inspected',
      description:
        'This PubParts source link is staged as metadata only. Source bytes are not downloaded, files are not inspected, and no project asset has been imported.',
      sourceCandidateUrl: 'https://example.com/source-files.zip',
      fileExtension: null,
      requiresArchiveInspection: false,
      isMetadataInspected: false,
    })

    expect(
      resolveCatalogPubPartsStagedSourceInspectionRead({
        ...baseRecord,
        inspectionStatus: 'metadata-inspected',
        inspectionResult: {
          kind: 'archive-source-needs-inspection',
          label: 'Archive Source Needs Inspection',
          description:
            'This staged source link points to an archive or shared source. ParaHook has not downloaded, opened, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
          sourceCandidateUrl: 'https://example.com/source-files.zip',
          fileExtension: 'zip',
          requiresArchiveInspection: true,
          inspectedAt: '2026-04-20T18:25:00.000Z',
        },
      }),
    ).toEqual({
      label: 'Archive Source Needs Inspection',
      description:
        'This staged source link points to an archive or shared source. ParaHook has not downloaded, opened, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      sourceCandidateUrl: 'https://example.com/source-files.zip',
      fileExtension: 'zip',
      requiresArchiveInspection: true,
      isMetadataInspected: true,
    })
  })

  it('resolves supported-file chooser reads from inspected staged metadata only', () => {
    const baseRecord: PubPartsStagedSourceRecord = {
      stagedSourceId: 'pubparts:external:pubparts:test-source',
      catalogItemId: 'external:pubparts:test-source',
      catalogItemLabel: 'External Source Test',
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCandidateUrl: 'https://example.com/source-model.step',
      linkedArchiveUrl: 'https://example.com/source-model.step',
      sourceMetadata: [],
      status: 'source-link-staged',
      binaryStatus: 'not-downloaded',
      inspectionStatus: 'not-inspected',
      importStatus: 'not-imported',
      stagedAt: '2026-04-20T18:10:00.000Z',
      updatedAt: '2026-04-20T18:10:00.000Z',
    }
    const supportedRecord: PubPartsStagedSourceRecord = {
      ...baseRecord,
      inspectionStatus: 'metadata-inspected',
      inspectionResult: {
        kind: 'supported-direct-file-candidate',
        label: 'Supported Direct File Candidate',
        description:
          'This staged source link looks like a supported direct model file candidate from URL metadata only. ParaHook has not downloaded, imported, or added it to the project.',
        sourceCandidateUrl: 'https://example.com/source-model.step',
        fileExtension: 'step',
        supportedFileType: 'step',
        requiresArchiveInspection: false,
        inspectedAt: '2026-04-20T18:25:00.000Z',
      },
    }

    expect(resolveCatalogPubPartsSupportedFileChooserRead(baseRecord)).toEqual({
      state: 'not-inspected',
      label: 'Inspect staged source first',
      description: 'Inspect staged source metadata before choosing supported files.',
      sourceCandidateUrl: 'https://example.com/source-model.step',
      fileExtension: null,
      selectedSupportedFile: null,
      isSelectable: false,
    })

    expect(resolveCatalogPubPartsSupportedFileChooserRead(supportedRecord)).toEqual({
      state: 'supported-file-choice-ready',
      label: 'Choose Supported Source File',
      description:
        'This direct source URL can be selected as metadata for a later import handoff. ParaHook will not download, import, or add it to the project in this step.',
      sourceCandidateUrl: 'https://example.com/source-model.step',
      fileExtension: 'step',
      selectedSupportedFile: null,
      isSelectable: true,
    })

    expect(
      resolveCatalogPubPartsSupportedFileChooserRead({
        ...supportedRecord,
        selectedSupportedFile: {
          choiceId: 'pubparts:external:pubparts:test-source:supported-direct-file',
          sourceCandidateUrl: 'https://example.com/source-model.step',
          fileName: 'source-model.step',
          fileExtension: 'step',
          label: 'source-model.step (STEP)',
          selectedAt: '2026-04-20T18:32:00.000Z',
        },
      }),
    ).toEqual({
      state: 'supported-file-selected',
      label: 'Supported Source File Selected',
      description:
        'Supported source file selected for later import handoff. ParaHook has not downloaded, imported, or added it to the project.',
      sourceCandidateUrl: 'https://example.com/source-model.step',
      fileExtension: 'step',
      selectedSupportedFile: {
        choiceId: 'pubparts:external:pubparts:test-source:supported-direct-file',
        sourceCandidateUrl: 'https://example.com/source-model.step',
        fileName: 'source-model.step',
        fileExtension: 'step',
        label: 'source-model.step (STEP)',
        selectedAt: '2026-04-20T18:32:00.000Z',
      },
      isSelectable: false,
    })

    expect(
      resolveCatalogPubPartsSupportedFileChooserRead({
        ...baseRecord,
        inspectionStatus: 'metadata-inspected',
        inspectionResult: {
          kind: 'archive-source-needs-inspection',
          label: 'Archive Source Needs Inspection',
          description:
            'This staged source link points to an archive or shared source. ParaHook has not downloaded, opened, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
          sourceCandidateUrl: 'https://example.com/source-files.zip',
          fileExtension: 'zip',
          requiresArchiveInspection: true,
          inspectedAt: '2026-04-20T18:25:00.000Z',
        },
      }),
    ).toEqual({
      state: 'archive-source-needs-inspection',
      label: 'No Selectable Supported File',
      description:
        'No selectable supported file yet. Archive or shared-source contents are unknown until later inspection can list files.',
      sourceCandidateUrl: 'https://example.com/source-files.zip',
      fileExtension: 'zip',
      selectedSupportedFile: null,
      isSelectable: false,
    })

    expect(
      resolveCatalogPubPartsSupportedFileChooserRead({
        ...baseRecord,
        inspectionStatus: 'metadata-inspected',
        inspectionResult: {
          kind: 'unsupported-direct-file-candidate',
          label: 'Unsupported Direct File Candidate',
          description:
            'This staged source link has a file extension that is not currently supported as a direct Catalog model import candidate.',
          sourceCandidateUrl: 'https://example.com/readme.pdf',
          fileExtension: 'pdf',
          requiresArchiveInspection: false,
          inspectedAt: '2026-04-20T18:25:00.000Z',
        },
      }).state,
    ).toBe('unsupported-source-candidate')

    expect(
      resolveCatalogPubPartsSupportedFileChooserRead({
        ...baseRecord,
        inspectionStatus: 'metadata-inspected',
        inspectionResult: {
          kind: 'unknown-source-candidate',
          label: 'Unknown Source Candidate',
          description:
            'This staged source link does not expose a reliable file extension from metadata, so ParaHook cannot classify it without a later inspection step.',
          sourceCandidateUrl: 'not a url with no extension',
          requiresArchiveInspection: false,
          inspectedAt: '2026-04-20T18:25:00.000Z',
        },
      }).state,
    ).toBe('unknown-source-candidate')
  })

  it('resolves selected PubParts file import handoff reads without creating project assets', () => {
    const externalItem = buildExternalSourceItem()
    const baseRecord: PubPartsStagedSourceRecord = {
      stagedSourceId: 'pubparts:external:pubparts:test-source',
      catalogItemId: 'external:pubparts:test-source',
      catalogItemLabel: 'External Source Test',
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCollectionKey: 'gt',
      sourceCollectionLabel: 'GT/GT-S',
      sourceCandidateUrl: 'https://example.com/source-model.step',
      linkedArchiveUrl: 'https://example.com/source-model.step',
      sourcePageUrl: 'https://example.com/specific-item',
      externalItemUrl: 'https://example.com/specific-item',
      sourceUrl: 'https://example.com/source-set',
      previewImageUrl: 'https://example.com/source-image.webp',
      sourceLastUpdated: '2026-04-20',
      archiveLastUpdated: '2026-04-19',
      sourceMetadata: [{ label: 'Platform', value: 'GT/GT-S' }],
      status: 'source-link-staged',
      binaryStatus: 'not-downloaded',
      inspectionStatus: 'metadata-inspected',
      inspectionResult: {
        kind: 'supported-direct-file-candidate',
        label: 'Supported Direct File Candidate',
        description:
          'This staged source link looks like a supported direct model file candidate from URL metadata only. ParaHook has not downloaded, imported, or added it to the project.',
        sourceCandidateUrl: 'https://example.com/source-model.step',
        fileExtension: 'step',
        supportedFileType: 'step',
        requiresArchiveInspection: false,
        inspectedAt: '2026-04-20T18:25:00.000Z',
      },
      importStatus: 'not-imported',
      stagedAt: '2026-04-20T18:10:00.000Z',
      updatedAt: '2026-04-20T18:32:00.000Z',
    }
    const selectedStepRecord: PubPartsStagedSourceRecord = {
      ...baseRecord,
      selectedSupportedFile: {
        choiceId: 'pubparts:external:pubparts:test-source:supported-direct-file',
        sourceCandidateUrl: 'https://example.com/source-model.step',
        fileName: 'source-model.step',
        fileExtension: 'step',
        label: 'source-model.step (STEP)',
        selectedAt: '2026-04-20T18:32:00.000Z',
      },
    }

    expect(resolveCatalogSelectedPubPartsImportHandoff(externalItem, null)).toEqual(
      expect.objectContaining({
        state: 'no-staged-source',
        selectedFileUrl: null,
        importOwner: null,
        canCreateProjectAsset: false,
      }),
    )
    expect(resolveCatalogSelectedPubPartsImportHandoff(externalItem, baseRecord)).toEqual(
      expect.objectContaining({
        state: 'no-selected-supported-file',
        selectedFileUrl: null,
        importOwner: null,
        canCreateProjectAsset: false,
        sourceAttribution: expect.objectContaining({
          providerId: 'pubparts',
          providerName: 'PubParts',
          catalogItemId: 'external:pubparts:test-source',
          sourceCandidateUrl: 'https://example.com/source-model.step',
          linkedArchiveUrl: 'https://example.com/source-model.step',
          binaryStatus: 'not-downloaded',
          importStatus: 'not-imported',
        }),
      }),
    )
    expect(resolveCatalogSelectedPubPartsImportHandoff(externalItem, selectedStepRecord)).toEqual(
      expect.objectContaining({
        state: 'selected-file-import-handoff-planned',
        label: 'Import Handoff Planned',
        selectedFileUrl: 'https://example.com/source-model.step',
        selectedFileType: 'step',
        selectedFile: selectedStepRecord.selectedSupportedFile,
        importOwner: 'import-family',
        canCreateProjectAsset: false,
        sourceAttribution: expect.objectContaining({
          providerId: 'pubparts',
          providerName: 'PubParts',
          sourceCollectionKey: 'gt',
          sourceCollectionLabel: 'GT/GT-S',
          sourcePageUrl: 'https://example.com/specific-item',
          externalItemUrl: 'https://example.com/specific-item',
          sourceUrl: 'https://example.com/source-set',
          previewImageUrl: 'https://example.com/source-image.webp',
          sourceLastUpdated: '2026-04-20',
          archiveLastUpdated: '2026-04-19',
          sourceMetadata: [{ label: 'Platform', value: 'GT/GT-S' }],
          binaryStatus: 'not-downloaded',
          importStatus: 'not-imported',
        }),
      }),
    )

    ;(['glb', 'obj', 'stl'] as const).forEach((fileExtension) => {
      expect(
        resolveCatalogSelectedPubPartsImportHandoff(externalItem, {
          ...baseRecord,
          selectedSupportedFile: {
            choiceId: `pubparts:external:pubparts:test-source:${fileExtension}`,
            sourceCandidateUrl: `https://example.com/source-model.${fileExtension}`,
            fileName: `source-model.${fileExtension}`,
            fileExtension,
            label: `source-model.${fileExtension} (${fileExtension.toUpperCase()})`,
            selectedAt: '2026-04-20T18:32:00.000Z',
          },
        }).state,
      ).toBe('selected-file-import-handoff-planned')
    })

    expect(
      resolveCatalogSelectedPubPartsImportHandoff(externalItem, {
        ...baseRecord,
        selectedSupportedFile: {
          choiceId: 'pubparts:external:pubparts:test-source:supported-direct-file',
          sourceCandidateUrl: 'https://example.com/source-model.stp',
          fileName: 'source-model.stp',
          fileExtension: 'stp',
          label: 'source-model.stp (STP)',
          selectedAt: '2026-04-20T18:32:00.000Z',
        },
      }),
    ).toEqual(
      expect.objectContaining({
        state: 'selected-file-import-type-needs-import-support',
        label: 'Import Type Support Needed',
        selectedFileType: 'stp',
        importOwner: 'import-family',
        canCreateProjectAsset: false,
      }),
    )

    expect(
      resolveCatalogSelectedPubPartsImportHandoff(
        buildExternalSourceItem({
          provider: {
            providerId: 'other-provider',
            providerName: 'Other Provider',
          },
        }),
        selectedStepRecord,
      ).state,
    ).toBe('not-external-pubparts')
    expect(
      resolveCatalogSelectedPubPartsImportHandoff(createCatalogSourceSnapshot().repoItems[0], selectedStepRecord)
        .state,
    ).toBe('not-external-pubparts')
  })

  it('resolves browser source download handoff without claiming app-owned source bytes', () => {
    const externalItem = buildExternalSourceItem({
      linkedArchiveUrl:
        'https://www.dropbox.com/scl/fi/example/source-files.zip?rlkey=source-key&dl=0',
    })
    const stagedRecord: PubPartsStagedSourceRecord = {
      stagedSourceId: 'pubparts:external:pubparts:test-source',
      catalogItemId: 'external:pubparts:test-source',
      catalogItemLabel: 'External Source Test',
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCandidateUrl:
        'https://www.dropbox.com/scl/fi/example/source-files.zip?rlkey=source-key&dl=0',
      linkedArchiveUrl:
        'https://www.dropbox.com/scl/fi/example/source-files.zip?rlkey=source-key&dl=0',
      sourceMetadata: [],
      status: 'source-link-staged',
      binaryStatus: 'not-downloaded',
      inspectionStatus: 'not-inspected',
      importStatus: 'not-imported',
      stagedAt: '2026-04-20T18:10:00.000Z',
      updatedAt: '2026-04-20T18:10:00.000Z',
    }

    expect(resolveCatalogPubPartsSourceDownloadHandoff(externalItem, stagedRecord)).toEqual(
      expect.objectContaining({
        state: 'source-download-ready',
        label: 'Open Source Download',
        sourceUrl:
          'https://www.dropbox.com/scl/fi/example/source-files.zip?rlkey=source-key&dl=0',
        downloadUrl:
          'https://www.dropbox.com/scl/fi/example/source-files.zip?rlkey=source-key&dl=1',
        canOpenDownload: true,
        description:
          'Opens the PubParts source candidate in the browser. ParaHook has not downloaded, inspected, extracted, imported, or committed source bytes.',
      }),
    )
    expect(
      resolveCatalogPubPartsSourceDownloadHandoff(
        buildExternalSourceItem({ linkedArchiveUrl: '' }),
      ).state,
    ).toBe('no-source-download')
    expect(
      resolveCatalogPubPartsSourceDownloadHandoff(createCatalogSourceSnapshot().repoItems[0]).state,
    ).toBe('not-external-pubparts')
  })

  it('resolves PubParts source-options Add To Project status copy without hiding fallback states', () => {
    expect(resolveCatalogPubPartsDropboxChooserStatusRead(null)).toEqual({
      state: 'idle',
      label: 'Open Source Options',
      description:
        'Add To Project opens the PubParts source options window for this link. Pick one, some, or all supported files, then ParaHook stages them in Import review with PubParts attribution.',
    })

    expect(
      resolveCatalogPubPartsDropboxChooserStatusRead({
        state: 'chooser-unavailable',
        label: 'Dropbox Chooser Unavailable',
        description: 'Dropbox Chooser app key is not configured. Use the local fallback.',
      }),
    ).toEqual({
      state: 'chooser-unavailable',
      label: 'Dropbox Chooser Unavailable',
      description: 'Dropbox Chooser app key is not configured. Use the local fallback.',
    })
  })

  it('builds wheel fitment rows only for present local motor and tire fields', () => {
    const motorItem: CatalogItemRecord = {
      itemId: 'reference:test-motor-fitment',
      label: 'Test Motor Fitment',
      familyKey: 'motors',
      sectionKey: 'motors',
      tags: ['reference', 'motor'],
      systemKey: 'Wheel',
      partType: 'Motor',
      partGroups: ['Motors'],
      description: 'Motor fitment helper proof.',
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
      description: 'Tire fitment helper proof.',
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
    const nonWheelItem: CatalogItemRecord = {
      ...motorItem,
      itemId: 'reference:test-platform-fitment',
      systemKey: 'Platform',
      wheelFitment: {
        motorVersion: 'Should not display',
      },
    }

    expect(buildCatalogWheelFitmentDetails(motorItem)).toEqual([
      { label: 'Motor Version', value: 'Hypercore' },
      { label: 'Hub Size', value: '6' },
    ])
    expect(buildCatalogWheelFitmentDetails(tireItem)).toEqual([
      { label: 'Hub Size', value: '6' },
      { label: 'Tire Size', value: '11x6.0-6' },
      { label: 'Tire Compound', value: 'Soft' },
    ])
    expect(buildCatalogWheelFitmentDetails({ ...motorItem, wheelFitment: {} })).toEqual([])
    expect(buildCatalogWheelFitmentDetails(nonWheelItem)).toEqual([])
    expect(buildCatalogWheelFitmentDetails({ ...motorItem, wheelFitment: undefined })).toEqual([])
  })

  it('labels planned starting assemblies without implying builder load behavior', () => {
    const startingAssemblyItem: CatalogItemRecord = {
      itemId: 'reference:test-starting-assembly',
      label: 'Test Starting Assembly',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['reference', 'starting-assembly'],
      description: 'Starting assembly helper proof without a live seed record.',
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
      ...startingAssemblyItem,
      itemId: 'reference:test-ordinary-item',
      itemRole: undefined,
      startingAssembly: undefined,
    }
    const externalItem = buildExternalSourceItem()

    expect(buildCatalogStartingAssemblyDetails(startingAssemblyItem)).toEqual([
      { label: 'Catalog Role', value: 'Starting Assembly' },
      {
        label: 'Starting Configuration',
        value: 'Planned - load-as-starting-configuration is not wired yet',
      },
      { label: 'Platform Family', value: 'XR' },
      { label: 'Source Asset Preference', value: 'STEP/STP preferred source asset' },
    ])
    expect(resolveCatalogItemModeLabel(startingAssemblyItem)).toBe('Starting Assembly')
    expect(resolveCatalogCardBrowseMeta(startingAssemblyItem, 'part')).toContain(
      'load-as-starting-configuration planned',
    )
    expect(resolveCatalogItemPageFamilyLabel(startingAssemblyItem)).toBe('Starting Assembly')
    expect(resolveCatalogItemPageFamilySummary(startingAssemblyItem)).toContain(
      'Load as starting configuration remains unavailable',
    )
    expect(resolveCatalogItemPageFamilySummary(startingAssemblyItem)).not.toContain('Add To Project')
    expect(resolveCatalogItemPageFamilySummary(startingAssemblyItem)).not.toContain('Import')
    expect(buildCatalogStartingAssemblyDetails(ordinaryItem)).toEqual([])
    expect(buildCatalogStartingAssemblyDetails(externalItem)).toEqual([])
    expect(resolveCatalogItemModeLabel(externalItem)).toBe('External Linked Source')
  })

  it('labels planned heavy STEP source entries without repo preview copy', () => {
    const snapshot = createCatalogSourceSnapshot()
    const plannedItem = snapshot.plannedItems[0]

    expect(plannedItem?.itemId).toBe('starting-assembly:adv-full-assembly-planned')
    expect(resolveCatalogItemSourceLabel(plannedItem)).toBe('Planned source')
    expect(resolveCatalogItemModeLabel(plannedItem)).toBe('Starting Assembly')
    expect(resolveCatalogItemSectionLabel(plannedItem)).toBe('Planned Starting Assembly')
    expect(resolveCatalogCardBrowseMeta(plannedItem, 'part')).toContain(
      'preview and starting-configuration load unavailable',
    )
    expect(resolveCatalogItemPageFamilySummary(plannedItem)).toContain(
      'without enabling heavy preview',
    )

    const sourceDetails = buildCatalogItemSourceDetails(plannedItem)
    expect(sourceDetails).toEqual([
      { label: 'Planned Source', value: 'Verified ADV STEP source candidate' },
      {
        label: 'Source Candidate Path',
        value: 'Catalog/boards/adv/ADV_Full Assembly_parts.step',
      },
      { label: 'Source Format', value: 'STEP/STP preferred source asset' },
      { label: 'Source File Size', value: '55.8 MB' },
      {
        label: 'Source Status',
        value:
          'Known heavy source - Add To Project imports source; preview and starting-configuration load are planned',
      },
    ])
    expect(sourceDetails.map((entry) => entry.label)).not.toContain('Repo Asset Path')
    expect(sourceDetails.map((entry) => entry.label)).not.toContain('Import Asset Path')
  })

  it('renders planned source asset-set rows as metadata without enabling preview or import copy', () => {
    const plannedAssetSetItem: CatalogItemRecord = {
      itemId: 'starting-assembly:xr-pubwheel-1-planned',
      label: 'XR PubWheel Assembly 1',
      familyKey: 'starting-assemblies',
      sectionKey: 'starting-assemblies',
      tags: ['starting-assembly', 'xr', 'pubwheel', 'planned-source'],
      platformCompatibility: ['XR'],
      description: 'Planned XR source asset set helper proof.',
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

    expect(buildCatalogSourceAssetSetDetails(plannedAssetSetItem)).toEqual([
      { label: 'Source Identity', value: 'pubwheel_1' },
      { label: 'Current Source Version', value: 'Version 1 (v1)' },
      { label: 'Source Version Status', value: 'current' },
      {
        label: 'Preferred Source Variant',
        value: 'STEP - Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step - 73.1 MB',
      },
      {
        label: 'Companion Mesh Variant',
        value: 'GLB - Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb - 79.2 MB',
      },
    ])

    const sourceDetails = buildCatalogItemSourceDetails(plannedAssetSetItem)
    expect(sourceDetails).toEqual(
      expect.arrayContaining([
        { label: 'Planned Source', value: 'Verified XR STEP source candidate' },
        {
          label: 'Source Candidate Path',
          value: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step',
        },
        { label: 'Source Identity', value: 'pubwheel_1' },
        {
          label: 'Preferred Source Variant',
          value: 'STEP - Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step - 73.1 MB',
        },
        {
          label: 'Companion Mesh Variant',
          value: 'GLB - Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb - 79.2 MB',
        },
      ]),
    )
    expect(sourceDetails.map((entry) => entry.label)).not.toContain('Repo Asset Path')
    expect(sourceDetails.map((entry) => entry.value).join(' ')).not.toContain('Download')
    expect(sourceDetails.map((entry) => entry.value).join(' ')).not.toContain('Import')
    expect(resolveCatalogCardBrowseMeta(plannedAssetSetItem, 'part')).toContain(
      'preview and starting-configuration load unavailable',
    )
  })

  it('renders the live XR planned seed asset set without repo asset or import copy', () => {
    const snapshot = createCatalogSourceSnapshot()
    const plannedXrItem = snapshot.plannedItems.find(
      (item) => item.itemId === 'starting-assembly:xr-pubwheel-1-planned',
    )

    expect(plannedXrItem).toBeDefined()
    expect(
      plannedXrItem?.source.sourceKind === 'planned'
        ? plannedXrItem.source.sourceAssetSet
        : undefined,
    ).toEqual(
      expect.objectContaining({
        sourceId: 'pubwheel_1',
        currentVersionId: 'v1',
      }),
    )

    const sourceDetails = buildCatalogItemSourceDetails(plannedXrItem!)
    expect(sourceDetails).toEqual(
      expect.arrayContaining([
        { label: 'Source Identity', value: 'pubwheel_1' },
        { label: 'Current Source Version', value: 'Version 1 (v1)' },
        {
          label: 'Preferred Source Variant',
          value: 'STEP - Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step - 73.1 MB',
        },
        {
          label: 'Companion Mesh Variant',
          value: 'GLB - Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb - 79.2 MB',
        },
      ]),
    )
    expect(sourceDetails.map((entry) => entry.label)).not.toContain('Repo Asset Path')
    expect(sourceDetails.map((entry) => entry.value).join(' ')).not.toContain('Download')
    expect(sourceDetails.map((entry) => entry.value).join(' ')).not.toContain('Import')
  })

  it('resolves linked archive handoff state as metadata without treating archives as source pages', () => {
    const archiveItem = buildExternalSourceItem()

    expect(resolveCatalogLinkedArchiveHandoff(archiveItem)).toEqual({
      state: 'linked-archive-available',
      label: 'Linked Archive Metadata Available',
      description:
        'External archive link metadata exists for source inspection only. ParaHook has not downloaded, extracted, imported, or classified this archive.',
      url: 'https://example.com/archive.zip',
      isUserInspectable: true,
    })
    expect(resolveCatalogLinkedArchiveHandoff(archiveItem).url).not.toBe(
      resolveCatalogExternalSourcePageUrl(archiveItem),
    )

    expect(
      resolveCatalogLinkedArchiveHandoff(
        buildExternalSourceItem({
          linkedArchiveUrl: '   ',
        }),
      ),
    ).toEqual({
      state: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This external source record has no linked archive URL metadata.',
      url: null,
      isUserInspectable: false,
    })

    const repoSnapshot = createCatalogSourceSnapshot()
    expect(resolveCatalogLinkedArchiveHandoff(repoSnapshot.repoItems[0])).toEqual({
      state: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no external archive link metadata.',
      url: null,
      isUserInspectable: false,
    })
  })

  it('classifies linked archive candidates from metadata without downloading or importing them', () => {
    const supportedExtensions = ['glb', 'obj', 'stl', 'step', 'stp'] as const

    supportedExtensions.forEach((extension) => {
      expect(
        resolveCatalogLinkedArchiveClassification(
          buildExternalSourceItem({
            linkedArchiveUrl: `https://example.com/models/source-model.${extension}?download=1`,
          }),
        ),
      ).toEqual({
        kind: 'supported-model-candidate',
        label: 'Supported Model Candidate',
        description:
          'This linked URL looks like a supported model file candidate from metadata only. ParaHook has not downloaded, imported, or added it to the project.',
        url: `https://example.com/models/source-model.${extension}?download=1`,
        fileExtension: extension,
        isSupportedModelCandidate: true,
        requiresArchiveInspection: false,
      })
    })

    expect(
      resolveCatalogLinkedArchiveClassification(
        buildExternalSourceItem({
          linkedArchiveUrl: 'https://example.com/model-files.zip?rlkey=abc&dl=0',
        }),
      ),
    ).toEqual({
      kind: 'archive-container-inspect-needed',
      label: 'Archive Container - Inspection Needed',
      description:
        'This linked URL points to an archive or shared source. ParaHook has not downloaded, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      url: 'https://example.com/model-files.zip?rlkey=abc&dl=0',
      fileExtension: 'zip',
      isSupportedModelCandidate: false,
      requiresArchiveInspection: true,
    })

    expect(
      resolveCatalogLinkedArchiveClassification(
        buildExternalSourceItem({
          linkedArchiveUrl:
            'https://www.dropbox.com/scl/fi/example/model-files.zip?rlkey=abc&st=def&dl=0',
        }),
      ),
    ).toEqual({
      kind: 'archive-container-inspect-needed',
      label: 'Archive Container - Inspection Needed',
      description:
        'This linked URL points to an archive or shared source. ParaHook has not downloaded, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      url: 'https://www.dropbox.com/scl/fi/example/model-files.zip?rlkey=abc&st=def&dl=0',
      fileExtension: 'zip',
      isSupportedModelCandidate: false,
      requiresArchiveInspection: true,
    })

    expect(
      resolveCatalogLinkedArchiveClassification(
        buildExternalSourceItem({
          linkedArchiveUrl: 'https://example.com/readme.pdf',
        }),
      ),
    ).toEqual({
      kind: 'unsupported-file-candidate',
      label: 'Unsupported File Candidate',
      description:
        'This linked URL has a file extension that is not currently supported as a direct Catalog model import candidate.',
      url: 'https://example.com/readme.pdf',
      fileExtension: 'pdf',
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    })

    expect(
      resolveCatalogLinkedArchiveClassification(
        buildExternalSourceItem({
          linkedArchiveUrl: 'not a url with no extension',
        }),
      ),
    ).toEqual({
      kind: 'unknown-linked-candidate',
      label: 'Unknown Linked Candidate',
      description:
        'This linked URL does not expose a reliable file extension from metadata, so ParaHook cannot classify it without a later inspection step.',
      url: 'not a url with no extension',
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    })

    expect(
      resolveCatalogLinkedArchiveClassification(
        buildExternalSourceItem({
          linkedArchiveUrl: null,
        }),
      ),
    ).toEqual({
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This external source record has no linked archive URL metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    })

    const repoSnapshot = createCatalogSourceSnapshot()
    expect(resolveCatalogLinkedArchiveClassification(repoSnapshot.repoItems[0])).toEqual({
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no linked archive metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    })
    expect(
      resolveCatalogLinkedArchiveClassification({
        itemId: 'imports:test',
        label: 'Imported Test',
        familyKey: 'imports',
        sectionKey: 'imports',
        tags: ['imports'],
        description: 'Imported source item.',
        assetKind: 'reference-asset',
        actionKind: 'load-preview',
        source: {
          sourceKind: 'imports',
          importId: 'imported-reference-1',
          assetPath: 'blob:imported-reference-1',
        },
        previewMedia: [],
      }),
    ).toEqual({
      kind: 'no-linked-archive',
      label: 'No Linked Archive',
      description: 'This Catalog entry has no linked archive metadata to classify.',
      url: null,
      fileExtension: null,
      isSupportedModelCandidate: false,
      requiresArchiveInspection: false,
    })
    expect(
      resolveCatalogExternalSourcePageUrl(
        buildExternalSourceItem({
          externalItemUrl: null,
          sourceUrl: null,
          linkedArchiveUrl: 'https://example.com/source-model.glb',
        }),
      ),
    ).toBeNull()
  })
})
