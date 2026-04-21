import { describe, expect, it } from 'vitest'
import type { CatalogItemRecord } from './catalogItemContract'
import {
  clearPubPartsStagedSourceRecords,
  clearPubPartsSupportedSourceFileSelection,
  createInitialPubPartsDownloadsStorageState,
  findPubPartsStagedSourceRecordForCatalogItem,
  inspectPubPartsStagedSourceRecord,
  preparePubPartsLocalSourceRecord,
  pubPartsDownloadsStorageKey,
  pubPartsLocalLibraryFolderPath,
  readPubPartsDownloadsStorage,
  removePubPartsStagedSourceRecord,
  resolvePubPartsStagedSourceInspectionResult,
  sanitizePubPartsDownloadsStorageState,
  selectPubPartsSupportedSourceFileCandidate,
  setPubPartsLocalLibraryEnabled,
  stagePubPartsSourceLink,
} from './pubPartsDownloadsStorage'

const createMemoryStorage = (initialValues: Record<string, string> = {}) => {
  const values = { ...initialValues }
  return {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => {
      values[key] = value
    },
    values,
  }
}

const buildExternalPubPartsItem = (
  overrides: Partial<Extract<CatalogItemRecord['source'], { sourceKind: 'external' }>> = {},
): CatalogItemRecord => ({
  itemId: 'external:pubparts:stage-source-proof',
  label: 'Stage Source Proof',
  familyKey: 'external-pubparts',
  sectionKey: 'external-pubparts-parts',
  tags: ['external', 'pubparts'],
  description: 'External PubParts source staging proof.',
  assetKind: 'reference-asset',
  actionKind: 'load-preview',
  source: {
    sourceKind: 'external',
    provider: {
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCollectionKey: 'GT/GT-S',
      sourceCollectionLabel: 'GT/GT-S',
    },
    externalItemUrl: 'https://www.printables.com/model/919483',
    sourceUrl: 'https://www.printables.com/model/919483',
    previewImageUrl: 'https://media.printables.com/example.webp',
    linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
    sourceLastUpdated: '2026-04-20',
    archiveLastUpdated: '2024-08-28',
    ...overrides,
  },
  previewMedia: [
    {
      mediaKind: 'image',
      src: 'https://media.printables.com/example.webp',
      alt: 'Stage Source Proof preview',
    },
  ],
  metadata: [
    { label: 'Platform', value: 'GT/GT-S' },
    { label: 'Part Type', value: 'Gasket, Controller Box' },
  ],
})

describe('pubPartsDownloadsStorage', () => {
  it('reads an empty schema state and sanitizes malformed values', () => {
    const storage = createMemoryStorage()

    expect(readPubPartsDownloadsStorage(storage)).toEqual(
      createInitialPubPartsDownloadsStorageState(),
    )
    expect(sanitizePubPartsDownloadsStorageState('not json')).toEqual(
      createInitialPubPartsDownloadsStorageState(),
    )
    expect(
      sanitizePubPartsDownloadsStorageState({
        schemaVersion: 999,
        stagedSourcesById: {},
        stagedSourceOrder: [],
      }),
    ).toEqual(createInitialPubPartsDownloadsStorageState())
  })

  it('stages external PubParts source links as metadata-only records', () => {
    const storage = createMemoryStorage()
    const item = buildExternalPubPartsItem()

    const result = stagePubPartsSourceLink(item, {
      storage,
      now: () => new Date('2026-04-20T18:10:00.000Z'),
    })

    expect(result).not.toBeNull()
    expect(result?.record).toEqual({
      stagedSourceId: 'pubparts:external:pubparts:stage-source-proof',
      catalogItemId: 'external:pubparts:stage-source-proof',
      catalogItemLabel: 'Stage Source Proof',
      providerId: 'pubparts',
      providerName: 'PubParts',
      sourceCollectionKey: 'GT/GT-S',
      sourceCollectionLabel: 'GT/GT-S',
      sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
      linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
      sourcePageUrl: 'https://www.printables.com/model/919483',
      externalItemUrl: 'https://www.printables.com/model/919483',
      sourceUrl: 'https://www.printables.com/model/919483',
      previewImageUrl: 'https://media.printables.com/example.webp',
      sourceLastUpdated: '2026-04-20',
      archiveLastUpdated: '2024-08-28',
      sourceMetadata: [
        { label: 'Platform', value: 'GT/GT-S' },
        { label: 'Part Type', value: 'Gasket, Controller Box' },
      ],
      status: 'source-link-staged',
      binaryStatus: 'not-downloaded',
      inspectionStatus: 'not-inspected',
      importStatus: 'not-imported',
      stagedAt: '2026-04-20T18:10:00.000Z',
      updatedAt: '2026-04-20T18:10:00.000Z',
    })
    expect(storage.values[pubPartsDownloadsStorageKey]).toBeDefined()
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('assetPath')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('objectUrl')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('importedReference')

    const storedState = readPubPartsDownloadsStorage(storage)
    expect(storedState.stagedSourceOrder).toEqual([
      'pubparts:external:pubparts:stage-source-proof',
    ])
    expect(
      findPubPartsStagedSourceRecordForCatalogItem(
        storedState,
        'external:pubparts:stage-source-proof',
      ),
    ).toEqual(result?.record)
  })

  it('tracks the user-granted local PubParts library status without claiming disk access', () => {
    const storage = createMemoryStorage()

    const enabledState = setPubPartsLocalLibraryEnabled(true, {
      storage,
      now: () => new Date('2026-04-20T20:45:00.000Z'),
    })

    expect(enabledState.library).toEqual({
      status: 'permission-needed',
      rootLabel: 'Choose a PubParts Library folder',
      rootFolderPath: pubPartsLocalLibraryFolderPath,
      updatedAt: '2026-04-20T20:45:00.000Z',
    })
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('FileSystemDirectoryHandle')

    const disabledState = setPubPartsLocalLibraryEnabled(false, {
      storage,
      now: () => new Date('2026-04-20T20:46:00.000Z'),
    })

    expect(disabledState.library).toEqual(
      expect.objectContaining({
        status: 'disabled',
        rootFolderPath: pubPartsLocalLibraryFolderPath,
        updatedAt: '2026-04-20T20:46:00.000Z',
      }),
    )
  })

  it('prepares predictable per-item folder and manifest metadata for a PubParts source', () => {
    const storage = createMemoryStorage()
    const item = buildExternalPubPartsItem()

    const nextState = preparePubPartsLocalSourceRecord(item, {
      storage,
      now: () => new Date('2026-04-20T20:47:00.000Z'),
    })

    expect(nextState).not.toBeNull()
    expect(nextState?.localSourceOrder).toEqual(['external:pubparts:stage-source-proof'])
    const record =
      nextState?.localSourcesByCatalogItemId['external:pubparts:stage-source-proof']
    expect(record).toEqual(
      expect.objectContaining({
        catalogItemLabel: 'Stage Source Proof',
        providerId: 'pubparts',
        providerName: 'PubParts',
        itemFolderPath: expect.stringContaining('PubParts/parts/stage-source-proof'),
        manifestPath: expect.stringContaining('pubparts-source.json'),
        sourceFolderPath: expect.stringContaining('/source'),
        downloadsFolderPath: expect.stringContaining('/downloads'),
        extractedFolderPath: expect.stringContaining('/extracted'),
        importableFolderPath: expect.stringContaining('/importable'),
        versionsFolderPath: expect.stringContaining('/versions/2024-08-28/files'),
        localStatus: 'prepared',
        localStatusLabel: 'Prepared Folder',
        preparedAt: '2026-04-20T20:47:00.000Z',
        updatedAt: '2026-04-20T20:47:00.000Z',
      }),
    )
    expect(record?.manifest).toEqual(
      expect.objectContaining({
        schemaVersion: 1,
        catalogItemId: 'external:pubparts:stage-source-proof',
        providerId: 'pubparts',
        sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
        linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/source.zip?dl=0',
        sourceVersionKey: '2024-08-28',
      }),
    )
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('objectUrl')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('assetPath')
  })

  it('restages the same source without duplicating order or staged time', () => {
    const storage = createMemoryStorage()
    const item = buildExternalPubPartsItem()

    stagePubPartsSourceLink(item, {
      storage,
      now: () => new Date('2026-04-20T18:10:00.000Z'),
    })
    const secondResult = stagePubPartsSourceLink(item, {
      storage,
      now: () => new Date('2026-04-20T18:11:00.000Z'),
    })

    expect(secondResult?.record.stagedAt).toBe('2026-04-20T18:10:00.000Z')
    expect(secondResult?.record.updatedAt).toBe('2026-04-20T18:11:00.000Z')
    expect(secondResult?.state.stagedSourceOrder).toEqual([
      'pubparts:external:pubparts:stage-source-proof',
    ])
  })

  it('does not stage non-candidate or non-PubParts items', () => {
    const storage = createMemoryStorage()
    const repoItem: CatalogItemRecord = {
      itemId: 'reference:test',
      label: 'Repo Test',
      familyKey: 'references',
      sectionKey: 'references',
      tags: ['reference'],
      description: 'Repo item.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/test/model.glb',
      },
      previewMedia: [],
    }

    expect(
      stagePubPartsSourceLink(buildExternalPubPartsItem({ linkedArchiveUrl: null }), { storage }),
    ).toBeNull()
    expect(
      stagePubPartsSourceLink(
        buildExternalPubPartsItem({
          provider: {
            providerId: 'other-provider',
            providerName: 'Other Provider',
          },
        }),
        { storage },
      ),
    ).toBeNull()
    expect(stagePubPartsSourceLink(repoItem, { storage })).toBeNull()
    expect(readPubPartsDownloadsStorage(storage)).toEqual(
      createInitialPubPartsDownloadsStorageState(),
    )
  })

  it('removes one staged source record without touching other staged metadata', () => {
    const storage = createMemoryStorage()
    const firstItem = buildExternalPubPartsItem()
    const secondItem = {
      ...buildExternalPubPartsItem({
        linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/example/second-source.zip?dl=0',
      }),
      itemId: 'external:pubparts:second-stage-source-proof',
      label: 'Second Stage Source Proof',
    }

    stagePubPartsSourceLink(firstItem, {
      storage,
      now: () => new Date('2026-04-20T18:10:00.000Z'),
    })
    stagePubPartsSourceLink(secondItem, {
      storage,
      now: () => new Date('2026-04-20T18:11:00.000Z'),
    })

    const nextState = removePubPartsStagedSourceRecord(
      'pubparts:external:pubparts:stage-source-proof',
      { storage },
    )

    expect(nextState.stagedSourceOrder).toEqual([
      'pubparts:external:pubparts:second-stage-source-proof',
    ])
    expect(
      nextState.stagedSourcesById['pubparts:external:pubparts:stage-source-proof'],
    ).toBeUndefined()
    expect(
      nextState.stagedSourcesById['pubparts:external:pubparts:second-stage-source-proof'],
    ).toEqual(
      expect.objectContaining({
        catalogItemLabel: 'Second Stage Source Proof',
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'not-inspected',
        importStatus: 'not-imported',
      }),
    )
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('objectUrl')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('assetPath')

    const noOpState = removePubPartsStagedSourceRecord('pubparts:missing-record', { storage })
    expect(noOpState).toEqual(nextState)
  })

  it('clears all staged source records back to an empty schema state', () => {
    const storage = createMemoryStorage()

    stagePubPartsSourceLink(buildExternalPubPartsItem(), {
      storage,
      now: () => new Date('2026-04-20T18:10:00.000Z'),
    })

    const clearedState = clearPubPartsStagedSourceRecords({ storage })

    expect(clearedState).toEqual(createInitialPubPartsDownloadsStorageState())
    expect(readPubPartsDownloadsStorage(storage)).toEqual(
      createInitialPubPartsDownloadsStorageState(),
    )
  })

  it('classifies staged source candidate URLs from metadata only', () => {
    const inspectedAt = '2026-04-20T18:25:00.000Z'

    ;(['step', 'stp', 'glb', 'obj', 'stl'] as const).forEach((extension) => {
      expect(
        resolvePubPartsStagedSourceInspectionResult(
          `https://example.com/models/source-model.${extension}?download=1`,
          inspectedAt,
        ),
      ).toEqual({
        kind: 'supported-direct-file-candidate',
        label: 'Supported Direct File Candidate',
        description:
          'This staged source link looks like a supported direct model file candidate from URL metadata only. ParaHook has not downloaded, imported, or added it to the project.',
        sourceCandidateUrl: `https://example.com/models/source-model.${extension}?download=1`,
        fileExtension: extension,
        supportedFileType: extension,
        requiresArchiveInspection: false,
        inspectedAt,
      })
    })

    expect(
      resolvePubPartsStagedSourceInspectionResult(
        'https://www.dropbox.com/scl/fi/example/model-files.zip?rlkey=abc&st=def&dl=0',
        inspectedAt,
      ),
    ).toEqual({
      kind: 'archive-source-needs-inspection',
      label: 'Archive Source Needs Inspection',
      description:
        'This staged source link points to an archive or shared source. ParaHook has not downloaded, opened, extracted, imported, or inspected its contents, so supported files inside remain unknown.',
      sourceCandidateUrl:
        'https://www.dropbox.com/scl/fi/example/model-files.zip?rlkey=abc&st=def&dl=0',
      fileExtension: 'zip',
      requiresArchiveInspection: true,
      inspectedAt,
    })

    expect(
      resolvePubPartsStagedSourceInspectionResult('https://example.com/readme.pdf', inspectedAt),
    ).toEqual({
      kind: 'unsupported-direct-file-candidate',
      label: 'Unsupported Direct File Candidate',
      description:
        'This staged source link has a file extension that is not currently supported as a direct Catalog model import candidate.',
      sourceCandidateUrl: 'https://example.com/readme.pdf',
      fileExtension: 'pdf',
      requiresArchiveInspection: false,
      inspectedAt,
    })

    expect(
      resolvePubPartsStagedSourceInspectionResult('not a url with no extension', inspectedAt),
    ).toEqual({
      kind: 'unknown-source-candidate',
      label: 'Unknown Source Candidate',
      description:
        'This staged source link does not expose a reliable file extension from metadata, so ParaHook cannot classify it without a later inspection step.',
      sourceCandidateUrl: 'not a url with no extension',
      requiresArchiveInspection: false,
      inspectedAt,
    })
  })

  it('inspects one staged source record without downloading or importing files', () => {
    const storage = createMemoryStorage()
    const item = buildExternalPubPartsItem({
      linkedArchiveUrl: 'https://example.com/models/source-model.stp?download=1',
      externalItemUrl: 'https://example.com/source-page',
      sourceUrl: 'https://example.com/source-url',
      previewImageUrl: 'https://example.com/preview.webp',
    })

    stagePubPartsSourceLink(item, {
      storage,
      now: () => new Date('2026-04-20T18:10:00.000Z'),
    })
    const inspectedState = inspectPubPartsStagedSourceRecord(
      'pubparts:external:pubparts:stage-source-proof',
      {
        storage,
        now: () => new Date('2026-04-20T18:25:00.000Z'),
      },
    )
    const inspectedRecord =
      inspectedState.stagedSourcesById['pubparts:external:pubparts:stage-source-proof']

    expect(inspectedRecord).toEqual(
      expect.objectContaining({
        stagedAt: '2026-04-20T18:10:00.000Z',
        updatedAt: '2026-04-20T18:25:00.000Z',
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'metadata-inspected',
        importStatus: 'not-imported',
        sourceCandidateUrl: 'https://example.com/models/source-model.stp?download=1',
        sourcePageUrl: 'https://example.com/source-page',
        sourceUrl: 'https://example.com/source-url',
        previewImageUrl: 'https://example.com/preview.webp',
      }),
    )
    expect(inspectedRecord?.inspectionResult).toEqual({
      kind: 'supported-direct-file-candidate',
      label: 'Supported Direct File Candidate',
      description:
        'This staged source link looks like a supported direct model file candidate from URL metadata only. ParaHook has not downloaded, imported, or added it to the project.',
      sourceCandidateUrl: 'https://example.com/models/source-model.stp?download=1',
      fileExtension: 'stp',
      supportedFileType: 'stp',
      requiresArchiveInspection: false,
      inspectedAt: '2026-04-20T18:25:00.000Z',
    })
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('objectUrl')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('assetPath')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('importedReference')

    const noOpState = inspectPubPartsStagedSourceRecord('pubparts:missing-record', { storage })
    expect(noOpState).toEqual(inspectedState)
  })

  it('selects only inspected supported direct file candidates as staged metadata', () => {
    const storage = createMemoryStorage()
    const item = buildExternalPubPartsItem({
      linkedArchiveUrl: 'https://example.com/models/source-model.step?download=1',
    })

    stagePubPartsSourceLink(item, {
      storage,
      now: () => new Date('2026-04-20T18:10:00.000Z'),
    })

    const stagedSourceId = 'pubparts:external:pubparts:stage-source-proof'
    const uninspectedState = selectPubPartsSupportedSourceFileCandidate(stagedSourceId, {
      storage,
      now: () => new Date('2026-04-20T18:31:00.000Z'),
    })
    expect(uninspectedState.stagedSourcesById[stagedSourceId]?.selectedSupportedFile).toBeUndefined()

    inspectPubPartsStagedSourceRecord(stagedSourceId, {
      storage,
      now: () => new Date('2026-04-20T18:25:00.000Z'),
    })
    const selectedState = selectPubPartsSupportedSourceFileCandidate(stagedSourceId, {
      storage,
      now: () => new Date('2026-04-20T18:32:00.000Z'),
    })
    const selectedRecord = selectedState.stagedSourcesById[stagedSourceId]

    expect(selectedRecord).toEqual(
      expect.objectContaining({
        binaryStatus: 'not-downloaded',
        inspectionStatus: 'metadata-inspected',
        importStatus: 'not-imported',
        updatedAt: '2026-04-20T18:32:00.000Z',
      }),
    )
    expect(selectedRecord?.selectedSupportedFile).toEqual({
      choiceId: 'pubparts:external:pubparts:stage-source-proof:supported-direct-file',
      sourceCandidateUrl: 'https://example.com/models/source-model.step?download=1',
      fileName: 'source-model.step',
      fileExtension: 'step',
      label: 'source-model.step (STEP)',
      selectedAt: '2026-04-20T18:32:00.000Z',
    })
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('objectUrl')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('assetPath')
    expect(storage.values[pubPartsDownloadsStorageKey]).not.toContain('importedReference')

    const clearedSelectionState = clearPubPartsSupportedSourceFileSelection(stagedSourceId, {
      storage,
      now: () => new Date('2026-04-20T18:33:00.000Z'),
    })
    expect(
      clearedSelectionState.stagedSourcesById[stagedSourceId]?.selectedSupportedFile,
    ).toBeUndefined()
    expect(clearedSelectionState.stagedSourcesById[stagedSourceId]?.updatedAt).toBe(
      '2026-04-20T18:33:00.000Z',
    )
  })

  it('does not select archive, unsupported, unknown, or missing staged candidates', () => {
    const storage = createMemoryStorage()
    const stagedSourceIds = [
      ['archive', 'https://www.dropbox.com/scl/fi/example/source-files.zip?dl=0'],
      ['unsupported', 'https://example.com/source-files.pdf'],
      ['unknown', 'not a url with no extension'],
    ] as const

    stagedSourceIds.forEach(([suffix, linkedArchiveUrl], index) => {
      stagePubPartsSourceLink(
        {
          ...buildExternalPubPartsItem({ linkedArchiveUrl }),
          itemId: `external:pubparts:${suffix}-source-proof`,
          label: `${suffix} source proof`,
        },
        {
          storage,
          now: () => new Date(`2026-04-20T18:1${index}:00.000Z`),
        },
      )
      inspectPubPartsStagedSourceRecord(`pubparts:external:pubparts:${suffix}-source-proof`, {
        storage,
        now: () => new Date(`2026-04-20T18:2${index}:00.000Z`),
      })
    })

    stagedSourceIds.forEach(([suffix]) => {
      const stagedSourceId = `pubparts:external:pubparts:${suffix}-source-proof`
      const nextState = selectPubPartsSupportedSourceFileCandidate(stagedSourceId, { storage })
      expect(nextState.stagedSourcesById[stagedSourceId]?.selectedSupportedFile).toBeUndefined()
    })

    const noOpState = selectPubPartsSupportedSourceFileCandidate('pubparts:missing-record', {
      storage,
    })
    expect(noOpState.stagedSourceOrder).toHaveLength(3)
  })

  it('drops invalid stored supported-file selections during sanitization', () => {
    const stagedSourceId = 'pubparts:external:pubparts:stage-source-proof'
    const rawState = {
      schemaVersion: 1,
      stagedSourcesById: {
        [stagedSourceId]: {
          stagedSourceId,
          catalogItemId: 'external:pubparts:stage-source-proof',
          catalogItemLabel: 'Stage Source Proof',
          providerId: 'pubparts',
          providerName: 'PubParts',
          sourceCandidateUrl: 'https://example.com/models/source-model.step',
          linkedArchiveUrl: 'https://example.com/models/source-model.step',
          sourceMetadata: [],
          status: 'source-link-staged',
          binaryStatus: 'not-downloaded',
          inspectionStatus: 'metadata-inspected',
          inspectionResult: {
            kind: 'supported-direct-file-candidate',
            label: 'Supported Direct File Candidate',
            description: 'Supported direct candidate.',
            sourceCandidateUrl: 'https://example.com/models/source-model.step',
            fileExtension: 'step',
            supportedFileType: 'step',
            requiresArchiveInspection: false,
            inspectedAt: '2026-04-20T18:25:00.000Z',
          },
          selectedSupportedFile: {
            choiceId: `${stagedSourceId}:supported-direct-file`,
            sourceCandidateUrl: 'https://example.com/other-model.step',
            fileName: 'other-model.step',
            fileExtension: 'step',
            label: 'other-model.step (STEP)',
            selectedAt: '2026-04-20T18:32:00.000Z',
          },
          importStatus: 'not-imported',
          stagedAt: '2026-04-20T18:10:00.000Z',
          updatedAt: '2026-04-20T18:32:00.000Z',
        },
      },
      stagedSourceOrder: [stagedSourceId],
    }

    expect(
      sanitizePubPartsDownloadsStorageState(rawState).stagedSourcesById[stagedSourceId]
        ?.selectedSupportedFile,
    ).toBeUndefined()
  })

  it('drops injected inspection and selection truth from not-inspected records during sanitization', () => {
    const stagedSourceId = 'pubparts:external:pubparts:not-inspected-injection-proof'
    const rawState = {
      schemaVersion: 1,
      stagedSourcesById: {
        [stagedSourceId]: {
          stagedSourceId,
          catalogItemId: 'external:pubparts:not-inspected-injection-proof',
          catalogItemLabel: 'Not Inspected Injection Proof',
          providerId: 'pubparts',
          providerName: 'PubParts',
          sourceCandidateUrl: 'https://example.com/models/source-model.step',
          linkedArchiveUrl: 'https://example.com/models/source-model.step',
          sourceMetadata: [],
          status: 'source-link-staged',
          binaryStatus: 'not-downloaded',
          inspectionStatus: 'not-inspected',
          inspectionResult: {
            kind: 'supported-direct-file-candidate',
            label: 'Supported Direct File Candidate',
            description: 'Injected supported direct candidate.',
            sourceCandidateUrl: 'https://example.com/models/source-model.step',
            fileExtension: 'step',
            supportedFileType: 'step',
            requiresArchiveInspection: false,
            inspectedAt: '2026-04-20T18:25:00.000Z',
          },
          selectedSupportedFile: {
            choiceId: `${stagedSourceId}:supported-direct-file`,
            sourceCandidateUrl: 'https://example.com/models/source-model.step',
            fileName: 'source-model.step',
            fileExtension: 'step',
            label: 'source-model.step (STEP)',
            selectedAt: '2026-04-20T18:32:00.000Z',
          },
          importStatus: 'not-imported',
          stagedAt: '2026-04-20T18:10:00.000Z',
          updatedAt: '2026-04-20T18:32:00.000Z',
        },
      },
      stagedSourceOrder: [stagedSourceId],
    }

    const sanitizedRecord =
      sanitizePubPartsDownloadsStorageState(rawState).stagedSourcesById[stagedSourceId]

    expect(sanitizedRecord).toEqual(
      expect.objectContaining({
        inspectionStatus: 'not-inspected',
        binaryStatus: 'not-downloaded',
        importStatus: 'not-imported',
      }),
    )
    expect(sanitizedRecord?.inspectionResult).toBeUndefined()
    expect(sanitizedRecord?.selectedSupportedFile).toBeUndefined()
  })
})
