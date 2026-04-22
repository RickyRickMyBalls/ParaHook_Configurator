import { useEffect, useMemo, useRef, useState } from 'react'
import { resolveCatalogEnvironmentApplyRequest } from '../catalog/catalogEnvironmentApply'
import type { WorkspaceViewportSlotId } from './workspaceShellTypes'
import { resolveCatalogActionPlan } from '../catalog/catalogActionPlan'
import { resolveCatalogReferenceCommitRequest } from '../catalog/catalogReferenceCommit'
import {
  fetchPubPartsSharedLinkCandidateFile,
  inspectPubPartsSharedLinkArchive,
  mapPubPartsZipArchiveEntriesToSharedLinkCandidates,
  materializePubPartsSharedLinkArchiveCandidateFiles,
  resolvePubPartsSharedLinkCandidates,
  type PubPartsSharedLinkCandidate,
} from '../catalog/pubPartsSharedLinkResolver'
import {
  readPubPartsArchiveManifestCacheRecord,
  writePubPartsArchiveManifestCacheRecord,
} from '../catalog/pubPartsArchiveManifestCache'
import {
  buildPubPartsInternalLibraryManifest,
  readPubPartsInternalLibraryArchiveCache,
  writePubPartsInternalLibraryArchiveCache,
  writePubPartsInternalLibraryExtractedCandidate,
  type PubPartsInternalLibraryExtractedCandidate,
  type PubPartsInternalLibraryManifest,
} from '../catalog/pubPartsInternalLibrary'
import {
  assertPubPartsSourceMaterializationSamePath,
  buildPubPartsSourceMaterializationFreshness,
  buildPubPartsSourceMaterializationIdentity,
  resolvePubPartsSourceMaterializationDecision,
  type PubPartsSourceByteOrigin,
  type PubPartsSourceMaterializationDecision,
  type PubPartsSourceMaterializationDecisionInput,
  type PubPartsSourceMaterializationSourceKind,
  type PubPartsSourceMaterializationStatus,
} from '../catalog/pubPartsSourceMaterialization'
import {
  assertPubPartsTrustedSourceProviderSamePath,
  getPubPartsTrustedSourceProvider,
  resolvePubPartsTrustedSourceProviderMaterializationDecision,
} from '../catalog/pubPartsTrustedSourceProvider'
import { CatalogShell } from '../catalog/ui/CatalogShell'
import {
  CatalogShellSourceOptionsDialog,
  type CatalogShellSourceOptionsPreviewState,
} from '../catalog/ui/CatalogShellSourceOptionsDialog'
import {
  buildCatalogPubPartsImportedReferenceSourceAttribution,
  type CatalogPubPartsDropboxChooserStatus,
} from '../catalog/ui/catalogShellShared'
import {
  createCatalogImportsSourceSnapshotFromReferenceWorkspace,
  createCatalogSourceSnapshot,
} from '../catalog/catalogSource'
import {
  readCachedPubPartsFullPartSourceItems,
  readCachedPubPartsResourceSourceItems,
} from '../catalog/pubPartsCachedSource'
import { readLivePubPartsPartSourceItems } from '../catalog/pubPartsLiveSource'
import {
  readCatalogPreviewSession,
  sanitizeCatalogPreviewSessionState,
  unloadAllCatalogPreviewItems,
  unloadCatalogPreviewItem,
  writeCatalogPreviewSession,
  type CatalogPreviewSessionState,
} from '../catalog/catalogPreviewSession'
import {
  clearPubPartsStagedSourceRecords,
  inspectPubPartsStagedSourceRecord,
  preparePubPartsLocalSourceRecord,
  readPubPartsDownloadsStorage,
  removePubPartsStagedSourceRecord,
  selectPubPartsSupportedSourceFileCandidate,
  stagePubPartsSourceLink,
  type PubPartsLocalSourceRecord,
  type PubPartsStagedSourceRecord,
} from '../catalog/pubPartsDownloadsStorage'
import {
  importSupportedReferenceFilesFromDisk,
  type ImportedReferenceFile,
} from '../references/importReferenceFile'
import {
  extractPubPartsZipArchiveEntries,
  listPubPartsZipArchiveEntries,
} from '../catalog/pubPartsZipArchive'
import {
  resolvePubPartsZipEntryPreviewActionState,
  resolvePubPartsZipEntryPreviewActionStates,
  type PubPartsZipEntryPreviewActionState,
  type PubPartsZipEntryPreviewArchiveByteAvailability,
} from '../catalog/pubPartsZipEntryPreview'
import {
  getPubPartsLocalLibraryMirrorSessionRoot,
  readPubPartsLocalLibraryMirrorCandidatePath,
  readPubPartsLocalLibraryMirrorStatus,
  resolvePubPartsLocalLibraryMirrorPlan,
  writePubPartsLocalLibraryMirrorArchive,
  writePubPartsLocalLibraryMirrorExtractedCandidate,
  writePubPartsLocalLibraryMirrorManifest,
  type PubPartsLocalLibraryMirrorRead,
} from '../catalog/pubPartsLocalLibraryMirror'
import { runEnvironmentLookHistoryAction } from '../store/environmentLookEditHistory'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'

type CatalogSurfaceProps = {
  slotId?: WorkspaceViewportSlotId
  surfaceInstanceId: string
  hostMode?: 'slotted' | 'floating' | 'popout'
}

type PubPartsSourceOptionsDialogState = {
  stagedRecord: PubPartsStagedSourceRecord
  candidates: PubPartsSharedLinkCandidate[]
  selectedCandidateIds: string[]
  statusMessage: string | null
  isInspectingArchive: boolean
  isStaging: boolean
  previewState: CatalogShellSourceOptionsPreviewState
  archiveBlob?: Blob
  archiveBlobSourceUrl?: string
  archiveBlobStagedSourceId?: string
  archiveBlobPreviewSource?: Extract<
    PubPartsZipEntryPreviewArchiveByteAvailability,
    { state: 'available' }
  >['source']
} | null

type LocalZipInputLike = HTMLInputElement & {
  remove: () => void
}

const chooseLocalPubPartsZipArchive = (): Promise<Blob> => {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Local ZIP selection is unavailable in this environment.'))
  }

  const input = document.createElement('input') as LocalZipInputLike
  input.type = 'file'
  input.accept = '.zip,application/zip'

  if (document.body !== null) {
    document.body.appendChild(input)
  }

  return new Promise<Blob>((resolve, reject) => {
    const cleanup = () => {
      input.onchange = null
      input.remove()
    }

    input.onchange = () => {
      const [file] = Array.from(input.files ?? [])
      cleanup()
      if (file === undefined) {
        reject(new Error('No PubParts ZIP file selected.'))
        return
      }

      if (!/\.zip$/iu.test(file.name.trim())) {
        reject(new Error('Select the downloaded PubParts .zip archive.'))
        return
      }

      resolve(file)
    }

    input.click()
  })
}

const resolvePubPartsSourceOptionsSelectionStatus = (
  selectedCandidates: PubPartsSharedLinkCandidate[],
): string => {
  const directFileCount = selectedCandidates.filter(
    (candidate) => candidate.kind === 'supported-direct-file',
  ).length
  const archiveEntryCount = selectedCandidates.filter(
    (candidate) => candidate.kind === 'supported-archive-entry',
  ).length

  if (selectedCandidates.length === 0) {
    return 'Select at least one supported file candidate to continue.'
  }

  if (archiveEntryCount > 0 && directFileCount === 0) {
    return `${archiveEntryCount} archive candidate${
      archiveEntryCount === 1 ? '' : 's'
    } selected for extraction to Import review.`
  }

  if (archiveEntryCount > 0) {
    return `${directFileCount} direct source file${
      directFileCount === 1 ? '' : 's'
    } and ${archiveEntryCount} archive candidate${
      archiveEntryCount === 1 ? '' : 's'
    } selected for Import review.`
  }

  return `${directFileCount} supported direct file${
    directFileCount === 1 ? '' : 's'
  } selected for Import review.`
}

const resolvePubPartsSourceOptionsArchiveByteAvailability = (
  dialog: Exclude<PubPartsSourceOptionsDialogState, null>,
): PubPartsZipEntryPreviewArchiveByteAvailability => {
  if (
    dialog.archiveBlob !== undefined &&
    dialog.archiveBlobSourceUrl === dialog.stagedRecord.sourceCandidateUrl.trim() &&
    dialog.archiveBlobStagedSourceId === dialog.stagedRecord.stagedSourceId
  ) {
    return {
      state: 'available',
      source: dialog.archiveBlobPreviewSource ?? 'source-options-archive',
    }
  }

  if (dialog.archiveBlob !== undefined) {
    return {
      state: 'missing',
      reason: 'stale-archive-bytes',
    }
  }

  if (
    dialog.candidates.some(
      (candidate) =>
        candidate.kind === 'supported-archive-entry' ||
        candidate.kind === 'unsupported-archive-entry',
    )
  ) {
    return {
      state: 'metadata-only',
      source: 'local-storage-manifest',
    }
  }

  return {
    state: 'missing',
    reason: 'no-archive-bytes',
  }
}

const buildPubPartsPreviewErrorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : 'This ZIP entry could not be prepared for preview.'

const isCurrentPubPartsSourceOptionsPreviewRequest = (
  dialog: PubPartsSourceOptionsDialogState,
  stagedSourceId: string,
  archiveBlob: Blob,
  candidateId: string,
): dialog is Exclude<PubPartsSourceOptionsDialogState, null> =>
  dialog !== null &&
  dialog.stagedRecord.stagedSourceId === stagedSourceId &&
  dialog.archiveBlob === archiveBlob &&
  dialog.previewState.status === 'loading' &&
  dialog.previewState.candidateId === candidateId

const resolvePubPartsArchiveInspectionSuccessStatus = (
  candidates: PubPartsSharedLinkCandidate[],
  selectedCandidateIds: string[],
): string => {
  const supportedArchiveCount = candidates.filter(
    (candidate) => candidate.kind === 'supported-archive-entry',
  ).length

  if (supportedArchiveCount === 0) {
    return 'ZIP inspected, but no supported entries are selectable. Direct browser source fetch materialized archive bytes for the existing ZIP list/preview/select/stage path. Use Open Source or Import Local Files after downloading and extracting manually.'
  }

  return `ZIP inspected. ${selectedCandidateIds.length} supported archive candidate${
    selectedCandidateIds.length === 1 ? '' : 's'
  } selected for extraction into Import review. Direct browser source fetch materialized archive bytes for the existing ZIP list/preview/select/stage path.`
}

const resolvePubPartsProviderArchiveInspectionSuccessStatus = (
  candidates: PubPartsSharedLinkCandidate[],
  selectedCandidateIds: string[],
  providerLabel: string,
): string => {
  const supportedArchiveCount = candidates.filter(
    (candidate) => candidate.kind === 'supported-archive-entry',
  ).length

  if (supportedArchiveCount === 0) {
    return `Trusted provider ${providerLabel} materialized archive bytes for the existing ZIP list/preview/select/stage path, but no supported entries are selectable. Use Open Source or Import Local Files after downloading and extracting manually.`
  }

  return `Trusted provider ${providerLabel} materialized archive bytes for the existing ZIP list/preview/select/stage path. ${
    selectedCandidateIds.length
  } supported archive candidate${
    selectedCandidateIds.length === 1 ? '' : 's'
  } selected for extraction into Import review.`
}

const resolvePubPartsArchiveManifestCacheHitStatus = (
  candidates: PubPartsSharedLinkCandidate[],
  selectedCandidateIds: string[],
): string => {
  const supportedArchiveCount = candidates.filter(
    (candidate) => candidate.kind === 'supported-archive-entry',
  ).length

  if (supportedArchiveCount === 0) {
    return 'Loaded cached ZIP manifest for this PubParts source version, but no supported entries are selectable. Use Open Source or Import Local Files after downloading and extracting manually.'
  }

  return `Loaded cached ZIP manifest for this PubParts source version. ${
    selectedCandidateIds.length
  } supported archive candidate${
    selectedCandidateIds.length === 1 ? '' : 's'
  } selected; files will still be revalidated from the ZIP before Import review.`
}

const buildPubPartsSourceMaterializationDecisionForStagedRecord = (
  stagedRecord: PubPartsStagedSourceRecord,
  options: {
    status: PubPartsSourceMaterializationStatus
    sourceKind?: PubPartsSourceMaterializationSourceKind
    byteOrigin?: PubPartsSourceByteOrigin
    byteSize?: number
    materializedAt?: string
    reason?: string
    sourceIdentityMatches?: boolean
  },
): PubPartsSourceMaterializationDecision => {
  const decisionInput: PubPartsSourceMaterializationDecisionInput = {
    identity: buildPubPartsSourceMaterializationIdentity(
      stagedRecord,
      options.sourceKind === undefined ? {} : { sourceKind: options.sourceKind },
    ),
    freshness: buildPubPartsSourceMaterializationFreshness(stagedRecord, {
      ...(options.byteSize === undefined ? {} : { byteSize: options.byteSize }),
      ...(options.materializedAt === undefined
        ? {}
        : { materializedAt: options.materializedAt }),
    }),
    status: options.status,
    ...(options.byteOrigin === undefined ? {} : { byteOrigin: options.byteOrigin }),
    ...(options.reason === undefined ? {} : { reason: options.reason }),
    ...(options.sourceIdentityMatches === undefined
      ? {}
      : { sourceIdentityMatches: options.sourceIdentityMatches }),
  }

  return resolvePubPartsSourceMaterializationDecision(decisionInput)
}

const resolvePubPartsBrowserFetchAttemptStatus = (
  decision: PubPartsSourceMaterializationDecision,
): string =>
  decision.nextStep === 'attempt-browser-fetch'
    ? 'Inspecting ZIP archive from the PubParts source after your Add To Project action. Direct browser source fetch is being attempted; if the source blocks access, use Download ZIP and Upload ZIP.'
    : 'Inspecting ZIP archive from the PubParts source...'

const resolvePubPartsArchiveInspectionFailureStatus = (
  decision: PubPartsSourceMaterializationDecision,
  error: unknown,
): string => {
  const fallbackStatus =
    error instanceof Error
      ? `${error.message} Use Download ZIP to open or save the archive, then upload that ZIP here.`
      : 'PubParts ZIP archive inspection failed. Use Download ZIP to open or save the archive, then upload that ZIP here.'

  if (decision.fallback !== 'open-source-and-upload-zip') {
    return fallbackStatus
  }

  return `${fallbackStatus} Browser source fetch failed or was blocked; ParaHook has not materialized archive bytes from this source.`
}

export function CatalogSurface(props: CatalogSurfaceProps) {
  const { slotId, surfaceInstanceId, hostMode = 'slotted' } = props
  const addImportedReferenceWithHistory = useAppStore(
    (state) => state.addImportedReferenceWithHistory,
  )
  const openStagedImportDraft = useAppStore((state) => state.openStagedImportDraft)
  const appendStagedImportDraftFiles = useAppStore(
    (state) => state.appendStagedImportDraftFiles,
  )
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const environmentSource = useUiPrefsStore((state) => state.view.environmentSource)
  const applyHdriEnvironment = useUiPrefsStore((state) => state.applyHdriEnvironment)
  const setHdriEnvironmentBackgroundVisible = useUiPrefsStore(
    (state) => state.setHdriEnvironmentBackgroundVisible,
  )
  const setHdriEnvironmentIntensity = useUiPrefsStore(
    (state) => state.setHdriEnvironmentIntensity,
  )
  const cachedPubPartsPartSourceItems = useMemo(() => readCachedPubPartsFullPartSourceItems(), [])
  const cachedPubPartsResourceSourceItems = useMemo(
    () => readCachedPubPartsResourceSourceItems(),
    [],
  )
  const [livePubPartsPartSourceItems, setLivePubPartsPartSourceItems] = useState<
    typeof cachedPubPartsPartSourceItems | null
  >(null)
  const pubPartsSourceItems = useMemo(
    () => [
      ...(livePubPartsPartSourceItems ?? cachedPubPartsPartSourceItems),
      ...cachedPubPartsResourceSourceItems,
    ],
    [
      cachedPubPartsPartSourceItems,
      cachedPubPartsResourceSourceItems,
      livePubPartsPartSourceItems,
    ],
  )
  const catalogSnapshot = useMemo(
    () =>
      createCatalogSourceSnapshot(
        createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace),
        { pubPartsSourceItems },
      ),
    [pubPartsSourceItems, referenceWorkspace],
  )
  const validCatalogPreviewItemIds = useMemo(
    () =>
      catalogSnapshot.allItems
        .filter((item) => resolveCatalogActionPlan(item).allowsTemporaryPreview)
        .map((item) => item.itemId),
    [catalogSnapshot.allItems],
  )
  const validCatalogPreviewItemIdsKey = validCatalogPreviewItemIds.join('|')
  const [previewSession, setPreviewSession] = useState<CatalogPreviewSessionState>(() =>
    sanitizeCatalogPreviewSessionState(
      readCatalogPreviewSession(surfaceInstanceId),
      validCatalogPreviewItemIds,
    ),
  )
  const [pubPartsDownloadsState, setPubPartsDownloadsState] = useState(() =>
    readPubPartsDownloadsStorage(),
  )
  const [pubPartsLocalLibraryMirrorRead, setPubPartsLocalLibraryMirrorRead] =
    useState<PubPartsLocalLibraryMirrorRead>(() =>
      readPubPartsLocalLibraryMirrorStatus(readPubPartsDownloadsStorage().library),
    )
  const [
    pubPartsDropboxChooserStatusByCatalogItemId,
    setPubPartsDropboxChooserStatusByCatalogItemId,
  ] = useState<Map<string, CatalogPubPartsDropboxChooserStatus>>(() => new Map())
  const [pubPartsSourceOptionsDialog, setPubPartsSourceOptionsDialogState] =
    useState<PubPartsSourceOptionsDialogState>(null)
  const pubPartsSourceOptionsDialogRef = useRef<PubPartsSourceOptionsDialogState>(null)
  const pubPartsSourceOptionsPreviewObjectUrlRef = useRef<string | null>(null)
  const setPubPartsSourceOptionsDialog = (
    nextState:
      | PubPartsSourceOptionsDialogState
      | ((currentDialog: PubPartsSourceOptionsDialogState) => PubPartsSourceOptionsDialogState),
  ) => {
    if (typeof nextState === 'function') {
      setPubPartsSourceOptionsDialogState((currentDialog) => {
        const resolvedState = nextState(currentDialog)
        pubPartsSourceOptionsDialogRef.current = resolvedState
        return resolvedState
      })
      return
    }

    pubPartsSourceOptionsDialogRef.current = nextState
    setPubPartsSourceOptionsDialogState(nextState)
  }
  useEffect(() => {
    let shouldIgnoreRead = false

    void readLivePubPartsPartSourceItems().then((read) => {
      if (shouldIgnoreRead || read.status !== 'ready') {
        return
      }

      setLivePubPartsPartSourceItems(read.sourceItems)
    })

    return () => {
      shouldIgnoreRead = true
    }
  }, [])
  const pubPartsStagedSourcesByCatalogItemId = useMemo(
    () =>
      new Map(
        Object.values(pubPartsDownloadsState.stagedSourcesById).map((record) => [
          record.catalogItemId,
          record,
        ]),
      ),
    [pubPartsDownloadsState],
  )
  const pubPartsStagedSourceRecords = useMemo(
    () =>
      pubPartsDownloadsState.stagedSourceOrder
        .map((stagedSourceId) => pubPartsDownloadsState.stagedSourcesById[stagedSourceId] ?? null)
        .filter((record): record is NonNullable<typeof record> => record !== null),
    [pubPartsDownloadsState],
  )
  const pubPartsLocalSourceRecords = useMemo(
    () =>
      pubPartsDownloadsState.localSourceOrder
        .map(
          (catalogItemId) =>
            pubPartsDownloadsState.localSourcesByCatalogItemId[catalogItemId] ?? null,
        )
        .filter((record): record is PubPartsLocalSourceRecord => record !== null),
    [pubPartsDownloadsState],
  )
  const pubPartsLocalSourcesByCatalogItemId = useMemo(
    () =>
      new Map(
        pubPartsLocalSourceRecords.map((record) => [record.catalogItemId, record]),
      ),
    [pubPartsLocalSourceRecords],
  )

  useEffect(() => {
    setPreviewSession(
      sanitizeCatalogPreviewSessionState(
        readCatalogPreviewSession(surfaceInstanceId),
        validCatalogPreviewItemIds,
      ),
    )
  }, [surfaceInstanceId, validCatalogPreviewItemIds, validCatalogPreviewItemIdsKey])

  useEffect(() => {
    writeCatalogPreviewSession(surfaceInstanceId, previewSession)
  }, [previewSession, surfaceInstanceId])

  const handleAddItemToProject = (item: (typeof catalogSnapshot.allItems)[number]) => {
    const commitRequest = resolveCatalogReferenceCommitRequest(
      item,
      resolveCatalogActionPlan(item),
    )
    if (commitRequest === null) {
      return
    }

    addImportedReferenceWithHistory({
      catalogItemId: commitRequest.catalogItemId,
      catalogFamilyKey: commitRequest.catalogFamilyKey,
      fileName: commitRequest.fileName,
      fileType: commitRequest.fileType,
      objectUrl: commitRequest.objectUrl,
    })
  }

  const handleStageExternalSourceLink = (item: (typeof catalogSnapshot.allItems)[number]) => {
    const stageResult = stagePubPartsSourceLink(item)
    if (stageResult === null) {
      return
    }

    setPubPartsDownloadsState(stageResult.state)
  }

  const handleClearPubPartsStagedSource = (stagedSourceId: string) => {
    setPubPartsDownloadsState(removePubPartsStagedSourceRecord(stagedSourceId))
  }

  const handleClearAllPubPartsStagedSources = () => {
    setPubPartsDownloadsState(clearPubPartsStagedSourceRecords())
  }

  const handleInspectPubPartsStagedSource = (stagedSourceId: string) => {
    setPubPartsDownloadsState(inspectPubPartsStagedSourceRecord(stagedSourceId))
  }

  const handleSelectPubPartsSupportedFileCandidate = (stagedSourceId: string) => {
    setPubPartsDownloadsState(selectPubPartsSupportedSourceFileCandidate(stagedSourceId))
  }

  const handlePreparePubPartsLocalSource = (item: (typeof catalogSnapshot.allItems)[number]) => {
    const nextState = preparePubPartsLocalSourceRecord(item)
    if (nextState !== null) {
      setPubPartsDownloadsState(nextState)
    }
  }

  const handleImportDownloadedPubPartsFiles = (
    item: (typeof catalogSnapshot.allItems)[number],
    stagedRecord: PubPartsStagedSourceRecord,
  ) => {
    if (
      item.source.sourceKind !== 'external' ||
      item.source.provider.providerId !== 'pubparts' ||
      stagedRecord.catalogItemId !== item.itemId
    ) {
      return
    }

    const sourceAttribution = buildCatalogPubPartsImportedReferenceSourceAttribution(stagedRecord)
    void importSupportedReferenceFilesFromDisk()
      .then((files) => {
        if (files.length === 0) {
          return
        }
        openStagedImportDraft({})
        appendStagedImportDraftFiles(
          files.map((file) => ({
            ...file,
            sourceAttribution,
          })),
        )
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === 'No reference file selected.') {
          return
        }
        console.error('Failed to stage PubParts downloaded files for import.', error)
      })
  }

  const setPubPartsDropboxChooserStatus = (
    catalogItemId: string,
    status: CatalogPubPartsDropboxChooserStatus,
  ) => {
    setPubPartsDropboxChooserStatusByCatalogItemId((currentStatuses) => {
      const nextStatuses = new Map(currentStatuses)
      nextStatuses.set(catalogItemId, status)
      return nextStatuses
    })
  }

  const revokePubPartsSourceOptionsPreviewObjectUrl = () => {
    const objectUrl = pubPartsSourceOptionsPreviewObjectUrlRef.current
    if (objectUrl !== null && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(objectUrl)
    }
    pubPartsSourceOptionsPreviewObjectUrlRef.current = null
  }

  useEffect(
    () => () => {
      revokePubPartsSourceOptionsPreviewObjectUrl()
    },
    [],
  )

  useEffect(() => {
    pubPartsSourceOptionsDialogRef.current = pubPartsSourceOptionsDialog
  }, [pubPartsSourceOptionsDialog])

  useEffect(() => {
    setPubPartsLocalLibraryMirrorRead(
      readPubPartsLocalLibraryMirrorStatus(pubPartsDownloadsState.library),
    )
  }, [pubPartsDownloadsState.library])

  const refreshPubPartsLocalLibraryMirrorRead = () => {
    setPubPartsLocalLibraryMirrorRead(
      readPubPartsLocalLibraryMirrorStatus(readPubPartsDownloadsStorage().library),
    )
  }

  const buildPubPartsLocalLibraryMirrorManifest = (
    stagedRecord: PubPartsStagedSourceRecord,
    options: {
      archiveBlob?: Blob
      sourceFileName?: string
      extractedCandidates?: PubPartsInternalLibraryExtractedCandidate[]
      importStatus?: PubPartsInternalLibraryManifest['importStatus']
    } = {},
  ): PubPartsInternalLibraryManifest =>
    buildPubPartsInternalLibraryManifest({
      catalogItemId: stagedRecord.catalogItemId,
      catalogItemLabel: stagedRecord.catalogItemLabel,
      sourceCandidateUrl: stagedRecord.sourceCandidateUrl,
      linkedArchiveUrl: stagedRecord.linkedArchiveUrl,
      sourcePageUrl: stagedRecord.sourcePageUrl,
      sourceUrl: stagedRecord.sourceUrl,
      sourceLastUpdated: stagedRecord.sourceLastUpdated,
      archiveLastUpdated: stagedRecord.archiveLastUpdated,
      sourceFileName: options.sourceFileName,
      sourceByteSize: options.archiveBlob?.size,
      inspectionStatus:
        options.extractedCandidates !== undefined ? 'extracted-candidates' : 'metadata-inspected',
      extractedCandidates: options.extractedCandidates,
      importStatus: options.importStatus ?? 'not-imported',
    })

  const mirrorPubPartsArchiveToLocalLibrary = async (input: {
    stagedRecord: PubPartsStagedSourceRecord
    archiveBlob: Blob
    manifest?: PubPartsInternalLibraryManifest
    sourceFileName?: string
  }): Promise<string> => {
    const sessionRoot = getPubPartsLocalLibraryMirrorSessionRoot()
    refreshPubPartsLocalLibraryMirrorRead()
    if (sessionRoot === null) {
      const read = readPubPartsLocalLibraryMirrorStatus(readPubPartsDownloadsStorage().library)
      return read.status === 'permission-needed'
        ? ' Local Library mirror needs reconnect; Internal Library cache remains available.'
        : ''
    }

    const manifest =
      input.manifest ??
      buildPubPartsLocalLibraryMirrorManifest(input.stagedRecord, {
        archiveBlob: input.archiveBlob,
        sourceFileName: input.sourceFileName,
      })
    const plan = resolvePubPartsLocalLibraryMirrorPlan(manifest)
    const [manifestResult, archiveResult] = await Promise.all([
      writePubPartsLocalLibraryMirrorManifest(sessionRoot.directoryHandle, manifest),
      writePubPartsLocalLibraryMirrorArchive(
        sessionRoot.directoryHandle,
        plan,
        input.archiveBlob,
      ),
    ])
    refreshPubPartsLocalLibraryMirrorRead()

    return manifestResult.status === 'mirrored' && archiveResult.status === 'mirrored'
      ? ' Mirrored to the visible Local Library folder.'
      : ' Local Library mirror write failed; source options and Internal Library cache still work.'
  }

  const mirrorPubPartsExtractedEntriesToLocalLibrary = async (
    stagedRecord: PubPartsStagedSourceRecord,
    extractedEntries: Awaited<ReturnType<typeof extractPubPartsZipArchiveEntries>>,
    archiveBlob?: Blob,
    sourceFileName?: string,
  ): Promise<void> => {
    const sessionRoot = getPubPartsLocalLibraryMirrorSessionRoot()
    if (sessionRoot === null) {
      refreshPubPartsLocalLibraryMirrorRead()
      return
    }

    const extractedCandidates: PubPartsInternalLibraryExtractedCandidate[] = extractedEntries.map(
      (extractedEntry) => ({
        archivePath: extractedEntry.archivePath,
        normalizedPath: extractedEntry.normalizedPath,
        fileName: extractedEntry.fileName,
        fileType: extractedEntry.fileType,
        fileSizeBytes: extractedEntry.blob.size,
        extractedPath: '',
        importablePath: '',
      }),
    )
    if (extractedCandidates.length === 0) {
      return
    }
    const manifest = buildPubPartsLocalLibraryMirrorManifest(stagedRecord, {
      archiveBlob,
      sourceFileName,
      extractedCandidates,
      importStatus: 'ready-for-import-review',
    })

    await writePubPartsLocalLibraryMirrorManifest(sessionRoot.directoryHandle, manifest)
    await Promise.all(
      extractedEntries.map((extractedEntry, index) => {
        const candidate = extractedCandidates[index]
        if (candidate === undefined) {
          return Promise.resolve()
        }
        const candidatePath = readPubPartsLocalLibraryMirrorCandidatePath(manifest, candidate)
        return writePubPartsLocalLibraryMirrorExtractedCandidate(
          sessionRoot.directoryHandle,
          candidatePath,
          extractedEntry.blob,
        )
      }),
    )
    refreshPubPartsLocalLibraryMirrorRead()
  }

  const handleAddPubPartsDropboxFileToProject = (
    item: (typeof catalogSnapshot.allItems)[number],
  ) => {
    if (item.source.sourceKind !== 'external' || item.source.provider.providerId !== 'pubparts') {
      return
    }

    let stagedRecord = pubPartsStagedSourcesByCatalogItemId.get(item.itemId) ?? null
    if (stagedRecord === null) {
      const stageResult = stagePubPartsSourceLink(item)
      if (stageResult === null) {
        setPubPartsDropboxChooserStatus(item.itemId, {
          state: 'chooser-unavailable',
          label: 'Source Options Unavailable',
          description:
            'This PubParts item has no source candidate to inspect. Use the source page or local fallback instead.',
        })
        return
      }

      stagedRecord = stageResult.record
      setPubPartsDownloadsState(stageResult.state)
    }

    const candidates = resolvePubPartsSharedLinkCandidates(stagedRecord)
    const needsArchiveInspection = candidates.some(
      (candidate) => candidate.kind === 'archive-needs-inspection',
    )
    const browserFetchAttemptDecision = buildPubPartsSourceMaterializationDecisionForStagedRecord(
      stagedRecord,
      { status: 'browser-fetch-readable' },
    )
    const openSourceOptionsFromCandidates = (
      dialogCandidates: PubPartsSharedLinkCandidate[],
      options: {
        cachedArchiveManifest: boolean
        internalLibraryCacheHit?: Awaited<
          ReturnType<typeof readPubPartsInternalLibraryArchiveCache>
        >
        requireCurrentDialog?: boolean
      },
    ) => {
      const selectedCandidateIds = dialogCandidates
        .filter((candidate) => candidate.selectable)
        .map((candidate) => candidate.candidateId)
      const selectedCandidates = dialogCandidates.filter((candidate) =>
        selectedCandidateIds.includes(candidate.candidateId),
      )
      const hasDirectStageableCandidates = selectedCandidates.some(
        (candidate) => candidate.kind === 'supported-direct-file',
      )
      const hasArchiveMetadataCandidates = selectedCandidates.some(
        (candidate) => candidate.kind === 'supported-archive-entry',
      )
      const internalLibraryCacheHit = options.internalLibraryCacheHit ?? null
      const cacheHitStatus =
        internalLibraryCacheHit === null
          ? resolvePubPartsArchiveManifestCacheHitStatus(dialogCandidates, selectedCandidateIds)
          : `Loaded PubParts Internal Library ZIP cache. ${selectedCandidateIds.length} supported archive candidate${
              selectedCandidateIds.length === 1 ? '' : 's'
            } selected for extraction into Import review from cached archive bytes.`

      setPubPartsSourceOptionsDialog((currentDialog) => {
        if (
          options.requireCurrentDialog === true &&
          (currentDialog === null ||
            currentDialog.stagedRecord.stagedSourceId !== stagedRecord.stagedSourceId)
        ) {
          return currentDialog
        }

        revokePubPartsSourceOptionsPreviewObjectUrl()
        return {
          stagedRecord,
          candidates: dialogCandidates,
          selectedCandidateIds:
            needsArchiveInspection && !options.cachedArchiveManifest && internalLibraryCacheHit === null
              ? []
              : selectedCandidateIds,
          statusMessage:
            needsArchiveInspection && !options.cachedArchiveManifest && internalLibraryCacheHit === null
              ? resolvePubPartsBrowserFetchAttemptStatus(browserFetchAttemptDecision)
              : needsArchiveInspection
                ? cacheHitStatus
              : selectedCandidateIds.length > 0
              ? resolvePubPartsSourceOptionsSelectionStatus(selectedCandidates)
              : 'No directly stageable files were found yet. Use Open Source or wait for archive and folder inspection support.',
          isInspectingArchive:
            needsArchiveInspection && !options.cachedArchiveManifest && internalLibraryCacheHit === null,
          isStaging: false,
          previewState: { status: 'idle' },
          archiveBlob: internalLibraryCacheHit?.archiveBlob,
          archiveBlobSourceUrl:
            internalLibraryCacheHit === null ? undefined : stagedRecord.sourceCandidateUrl.trim(),
          archiveBlobStagedSourceId:
            internalLibraryCacheHit === null ? undefined : stagedRecord.stagedSourceId,
          archiveBlobPreviewSource:
            internalLibraryCacheHit === null ? undefined : 'internal-library-archive',
        }
      })
      setPubPartsDropboxChooserStatus(item.itemId, {
        state:
          selectedCandidateIds.length > 0 || needsArchiveInspection
            ? 'chooser-opening'
            : 'chooser-unavailable',
        label:
          internalLibraryCacheHit !== null
            ? 'Internal Library Cache Hit'
          : needsArchiveInspection && !options.cachedArchiveManifest
            ? 'Inspecting ZIP Archive'
          : hasDirectStageableCandidates
            ? 'Source Options Open'
          : hasArchiveMetadataCandidates
            ? 'Archive Candidates Found'
            : 'Inspection Needed',
        description:
          internalLibraryCacheHit !== null
            ? 'Source options are open with cached Internal Library archive bytes. Selected ZIP entries will be revalidated from cached bytes before Import review.'
          : needsArchiveInspection && !options.cachedArchiveManifest
            ? 'Source options are open while ParaHook inspects this one PubParts ZIP archive.'
          : needsArchiveInspection
            ? 'Source options are open with cached archive metadata. Selected ZIP entries will still be revalidated from real archive bytes before Import review.'
          : hasDirectStageableCandidates
          ? 'Source options are open. Select the supported files to stage into Import review.'
          : hasArchiveMetadataCandidates
          ? 'Source options are open with archive candidates that can be extracted into Import review.'
          : 'This shared source link needs archive or folder inspection before files can be selected automatically.',
      })
    }

    const isCurrentSourceOptionsDialog = (): boolean =>
      pubPartsSourceOptionsDialogRef.current?.stagedRecord.stagedSourceId ===
      stagedRecord.stagedSourceId

    const applyMaterializedArchiveInspection = (archiveInspection: {
      archiveBlob: Blob
      candidates: PubPartsSharedLinkCandidate[]
      entries: Awaited<ReturnType<typeof listPubPartsZipArchiveEntries>>
      sourceUrl: string
      materializedDecision: PubPartsSourceMaterializationDecision
      statusMessage: string
      chooserSuccessDescription: string
      chooserUnavailableDescription: string
    }) => {
      assertPubPartsSourceMaterializationSamePath(archiveInspection.materializedDecision)
      writePubPartsArchiveManifestCacheRecord(stagedRecord, archiveInspection.entries)
      void mirrorPubPartsArchiveToLocalLibrary({
        stagedRecord,
        archiveBlob: archiveInspection.archiveBlob,
      })
        .then((mirrorStatus) => {
          if (mirrorStatus.length === 0) {
            return
          }
          setPubPartsSourceOptionsDialog((currentDialog) =>
            currentDialog === null ||
            currentDialog.stagedRecord.stagedSourceId !== stagedRecord.stagedSourceId
              ? currentDialog
              : {
                  ...currentDialog,
                  statusMessage:
                    currentDialog.statusMessage === null
                      ? mirrorStatus.trim()
                      : `${currentDialog.statusMessage}${mirrorStatus}`,
                },
          )
        })
        .catch(() => undefined)
      void writePubPartsInternalLibraryArchiveCache({
        stagedRecord,
        archiveBlob: archiveInspection.archiveBlob,
        entries: archiveInspection.entries,
      })
        .catch((error: unknown) => {
          console.warn('Failed to cache PubParts archive in Internal Library.', error)
        })
      const nextSelectedCandidateIds = archiveInspection.candidates
        .filter((candidate) => candidate.selectable)
        .map((candidate) => candidate.candidateId)
      setPubPartsSourceOptionsDialog((currentDialog) => {
        if (
          currentDialog === null ||
          currentDialog.stagedRecord.stagedSourceId !== stagedRecord.stagedSourceId
        ) {
          return currentDialog
        }

        return {
          ...currentDialog,
          candidates: archiveInspection.candidates,
          selectedCandidateIds: nextSelectedCandidateIds,
          statusMessage: archiveInspection.statusMessage,
          isInspectingArchive: false,
          isStaging: false,
          previewState: { status: 'idle' },
          archiveBlob: archiveInspection.archiveBlob,
          archiveBlobSourceUrl: archiveInspection.sourceUrl,
          archiveBlobStagedSourceId: stagedRecord.stagedSourceId,
          archiveBlobPreviewSource: 'source-options-archive',
        }
      })
      setPubPartsDropboxChooserStatus(item.itemId, {
        state: nextSelectedCandidateIds.length > 0 ? 'chooser-opening' : 'chooser-unavailable',
        label:
          nextSelectedCandidateIds.length > 0
            ? 'Archive Candidates Found'
            : 'No Supported Archive Entries',
        description:
          nextSelectedCandidateIds.length > 0
            ? archiveInspection.chooserSuccessDescription
            : archiveInspection.chooserUnavailableDescription,
      })
    }

    const inspectArchiveFromSource = () => {
      void inspectPubPartsSharedLinkArchive(stagedRecord)
        .then((archiveInspection) => {
          const materializedAt = new Date().toISOString()
          const materializedDecision = buildPubPartsSourceMaterializationDecisionForStagedRecord(
            stagedRecord,
            {
              status: 'materialized',
              byteOrigin: 'browser-fetch',
              byteSize: archiveInspection.archiveBlob.size,
              materializedAt,
            },
          )
          applyMaterializedArchiveInspection({
            ...archiveInspection,
            materializedDecision,
            statusMessage: resolvePubPartsArchiveInspectionSuccessStatus(
              archiveInspection.candidates,
              archiveInspection.candidates
                .filter((candidate) => candidate.selectable)
                .map((candidate) => candidate.candidateId),
            ),
            chooserSuccessDescription:
              'Source options are open with real ZIP archive candidates ready for selected extraction into Import review.',
            chooserUnavailableDescription:
              'The ZIP was inspected, but no supported archive entries are selectable. Use Open Source or the manual local import fallback.',
          })
        })
        .catch((error: unknown) => {
          const failureDecision = buildPubPartsSourceMaterializationDecisionForStagedRecord(
            stagedRecord,
            {
              status: 'browser-fetch-blocked',
              reason: 'Browser source fetch failed or was blocked for this PubParts ZIP source.',
            },
          )
          const statusMessage = resolvePubPartsArchiveInspectionFailureStatus(
            failureDecision,
            error,
          )
          setPubPartsSourceOptionsDialog((currentDialog) => {
            if (
              currentDialog === null ||
              currentDialog.stagedRecord.stagedSourceId !== stagedRecord.stagedSourceId
            ) {
              return currentDialog
            }

            return {
              ...currentDialog,
              candidates,
              selectedCandidateIds: [],
              statusMessage,
              isInspectingArchive: false,
              isStaging: false,
            }
          })
          setPubPartsDropboxChooserStatus(item.itemId, {
            state: 'fetch-failed',
            label: 'Archive Inspection Failed',
            description: statusMessage,
          })
        })
    }

    const inspectArchiveFromTrustedProviderOrSource = () => {
      const trustedProvider = getPubPartsTrustedSourceProvider()
      const providerCapability = trustedProvider.getCapability()

      if (providerCapability.status !== 'configured') {
        inspectArchiveFromSource()
        return
      }

      setPubPartsSourceOptionsDialog((currentDialog) =>
        currentDialog === null ||
        currentDialog.stagedRecord.stagedSourceId !== stagedRecord.stagedSourceId
          ? currentDialog
          : {
              ...currentDialog,
              statusMessage: `Trusted provider ${providerCapability.providerLabel} is materializing archive bytes after your Add To Project action. Browser fetch and Upload ZIP remain available if provider materialization fails.`,
              isInspectingArchive: true,
            },
      )

      void trustedProvider
        .materializeArchiveBytes({
          stagedRecord,
          explicitUserAction: 'add-to-project-source-options',
        })
        .then(async (providerResult) => {
          if (!isCurrentSourceOptionsDialog()) {
            return
          }

          if (providerResult.status !== 'materialized') {
            inspectArchiveFromSource()
            return
          }

          const materializedDecision =
            resolvePubPartsTrustedSourceProviderMaterializationDecision(
              stagedRecord,
              providerResult,
            )
          assertPubPartsTrustedSourceProviderSamePath(stagedRecord, providerResult)
          const entries = await listPubPartsZipArchiveEntries(providerResult.archiveBlob)
          const providerCandidates = mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
            stagedRecord,
            entries,
          )
          const providerSelectedCandidateIds = providerCandidates
            .filter((candidate) => candidate.selectable)
            .map((candidate) => candidate.candidateId)

          applyMaterializedArchiveInspection({
            archiveBlob: providerResult.archiveBlob,
            candidates: providerCandidates,
            entries,
            sourceUrl: stagedRecord.sourceCandidateUrl.trim(),
            materializedDecision,
            statusMessage: resolvePubPartsProviderArchiveInspectionSuccessStatus(
              providerCandidates,
              providerSelectedCandidateIds,
              providerResult.providerLabel,
            ),
            chooserSuccessDescription:
              'Source options are open with trusted-provider ZIP archive candidates ready for selected extraction into Import review.',
            chooserUnavailableDescription:
              'The trusted provider materialized the ZIP, but no supported archive entries are selectable. Use Open Source or the manual local import fallback.',
          })
        })
        .catch(() => {
          if (isCurrentSourceOptionsDialog()) {
            inspectArchiveFromSource()
          }
        })
    }

    if (!needsArchiveInspection) {
      openSourceOptionsFromCandidates(candidates, { cachedArchiveManifest: false })
      return
    }

    openSourceOptionsFromCandidates(candidates, { cachedArchiveManifest: false })

    void readPubPartsInternalLibraryArchiveCache(stagedRecord)
      .then((internalLibraryCacheHit) => {
        if (internalLibraryCacheHit !== null) {
          const cacheHitDecision = buildPubPartsSourceMaterializationDecisionForStagedRecord(
            stagedRecord,
            {
              status: 'internal-library-cache-hit',
              sourceKind: 'cached-archive',
              byteSize: internalLibraryCacheHit.archiveBlob.size,
              sourceIdentityMatches: true,
            },
          )
          assertPubPartsSourceMaterializationSamePath(cacheHitDecision)
          openSourceOptionsFromCandidates(
            mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
              stagedRecord,
              internalLibraryCacheHit.entries,
            ),
            {
              cachedArchiveManifest: true,
              internalLibraryCacheHit,
              requireCurrentDialog: true,
            },
          )
          return
        }

        const cachedArchiveManifest = readPubPartsArchiveManifestCacheRecord(stagedRecord)
        if (cachedArchiveManifest !== null) {
          openSourceOptionsFromCandidates(
            mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
              stagedRecord,
              cachedArchiveManifest.entries,
            ),
            { cachedArchiveManifest: true, requireCurrentDialog: true },
          )
          return
        }

        inspectArchiveFromTrustedProviderOrSource()
      })
      .catch(() => {
        const cachedArchiveManifest = readPubPartsArchiveManifestCacheRecord(stagedRecord)
        if (cachedArchiveManifest !== null) {
          openSourceOptionsFromCandidates(
            mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
              stagedRecord,
              cachedArchiveManifest.entries,
            ),
            { cachedArchiveManifest: true, requireCurrentDialog: true },
          )
          return
        }

        inspectArchiveFromTrustedProviderOrSource()
      })
  }

  const handleTogglePubPartsSourceOption = (candidateId: string) => {
    setPubPartsSourceOptionsDialog((currentDialog) => {
      if (currentDialog === null || currentDialog.isStaging || currentDialog.isInspectingArchive) {
        return currentDialog
      }

      const candidate = currentDialog.candidates.find(
        (candidateRecord) => candidateRecord.candidateId === candidateId,
      )
      if (candidate === undefined || !candidate.selectable) {
        return currentDialog
      }

      const selectedCandidateIds = currentDialog.selectedCandidateIds.includes(candidateId)
        ? currentDialog.selectedCandidateIds.filter(
            (selectedCandidateId) => selectedCandidateId !== candidateId,
          )
        : [...currentDialog.selectedCandidateIds, candidateId]
      const selectedCandidates = currentDialog.candidates.filter((candidateRecord) =>
        selectedCandidateIds.includes(candidateRecord.candidateId),
      )

      return {
        ...currentDialog,
        selectedCandidateIds,
        statusMessage: resolvePubPartsSourceOptionsSelectionStatus(selectedCandidates),
      }
    })
  }

  const handleSelectAllPubPartsSourceOptions = () => {
    setPubPartsSourceOptionsDialog((currentDialog) => {
      if (currentDialog === null || currentDialog.isStaging || currentDialog.isInspectingArchive) {
        return currentDialog
      }

      const selectedCandidateIds = currentDialog.candidates
        .filter((candidate) => candidate.selectable)
        .map((candidate) => candidate.candidateId)
      const selectedCandidates = currentDialog.candidates.filter((candidate) =>
        selectedCandidateIds.includes(candidate.candidateId),
      )

      return {
        ...currentDialog,
        selectedCandidateIds,
        statusMessage:
          selectedCandidateIds.length > 0
            ? resolvePubPartsSourceOptionsSelectionStatus(selectedCandidates)
            : 'No supported source files are available from this link yet.',
      }
    })
  }

  const handleClearPubPartsSourceOptionsSelection = () => {
    setPubPartsSourceOptionsDialog((currentDialog) => {
      if (currentDialog === null || currentDialog.isStaging || currentDialog.isInspectingArchive) {
        return currentDialog
      }

      return {
        ...currentDialog,
        selectedCandidateIds: [],
        statusMessage: 'Selection cleared. Pick one or more supported files to continue.',
      }
    })
  }

  const inspectLocalPubPartsArchive = async (
    dialog: Exclude<PubPartsSourceOptionsDialogState, null>,
    archiveBlob: Blob,
    inspectedStatusLabel: string,
  ) => {
    const entries = await listPubPartsZipArchiveEntries(archiveBlob)
    const candidates = mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
      dialog.stagedRecord,
      entries,
    )
    const selectedCandidateIds = candidates
      .filter((candidate) => candidate.selectable)
      .map((candidate) => candidate.candidateId)
    let internalLibraryCacheStatus = ''
    let localLibraryMirrorStatus = ''
    const sourceFileName =
      typeof File !== 'undefined' && archiveBlob instanceof File ? archiveBlob.name : undefined
    try {
      await writePubPartsInternalLibraryArchiveCache({
        stagedRecord: dialog.stagedRecord,
        archiveBlob,
        entries,
        sourceFileName,
      })
      internalLibraryCacheStatus = ' Saved to the PubParts Internal Library.'
    } catch {
      internalLibraryCacheStatus =
        ' Internal Library cache unavailable; this ZIP remains available for the current source-options session.'
    }
    localLibraryMirrorStatus = await mirrorPubPartsArchiveToLocalLibrary({
      stagedRecord: dialog.stagedRecord,
      archiveBlob,
      sourceFileName,
    })

    setPubPartsSourceOptionsDialog((currentDialog) => {
      if (
        currentDialog === null ||
        currentDialog.stagedRecord.stagedSourceId !== dialog.stagedRecord.stagedSourceId
      ) {
        return currentDialog
      }

      return {
        ...currentDialog,
        candidates,
        selectedCandidateIds,
        statusMessage: `${inspectedStatusLabel} ${selectedCandidateIds.length} supported archive candidate${
          selectedCandidateIds.length === 1 ? '' : 's'
        } selected for extraction into Import review.${internalLibraryCacheStatus}${localLibraryMirrorStatus}`,
        isInspectingArchive: false,
        previewState: { status: 'idle' },
        archiveBlob,
        archiveBlobSourceUrl: dialog.stagedRecord.sourceCandidateUrl.trim(),
        archiveBlobStagedSourceId: dialog.stagedRecord.stagedSourceId,
        archiveBlobPreviewSource: 'source-options-archive',
      }
    })
    if (localLibraryMirrorStatus.length > 0 && selectedCandidateIds.length > 0) {
      setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
        state: 'chooser-opening',
        label: 'Local ZIP Candidates Found',
        description: `The selected local PubParts ZIP is ready for selected extraction into Import review.${internalLibraryCacheStatus}${localLibraryMirrorStatus}`,
      })
    } else if (selectedCandidateIds.length > 0) {
      setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
        state: 'chooser-opening',
        label: 'Local ZIP Candidates Found',
        description: `The selected local PubParts ZIP is ready for selected extraction into Import review.${internalLibraryCacheStatus}`,
      })
    } else {
      setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
        state: 'chooser-unavailable',
        label: 'No Supported ZIP Entries',
        description: 'The selected local PubParts ZIP did not contain supported import entries.',
      })
    }
  }

  const handleLocalPubPartsArchiveInspectionError = (
    dialog: Exclude<PubPartsSourceOptionsDialogState, null>,
    error: unknown,
  ) => {
    if (error instanceof Error && error.message === 'No PubParts ZIP file selected.') {
      setPubPartsSourceOptionsDialog((currentDialog) =>
        currentDialog === null ||
        currentDialog.stagedRecord.stagedSourceId !== dialog.stagedRecord.stagedSourceId
          ? currentDialog
          : {
              ...currentDialog,
              isInspectingArchive: false,
              statusMessage:
                'Local ZIP selection canceled. Use Download ZIP to open or save the archive, then upload that ZIP here.',
            },
      )
      return
    }

    const description =
      error instanceof Error
        ? `${error.message} Choose the downloaded PubParts ZIP or use Import Local Files for already extracted models.`
        : 'Local ZIP inspection failed. Choose the downloaded PubParts ZIP or use Import Local Files for already extracted models.'

    setPubPartsSourceOptionsDialog((currentDialog) =>
      currentDialog === null ||
      currentDialog.stagedRecord.stagedSourceId !== dialog.stagedRecord.stagedSourceId
        ? currentDialog
        : {
            ...currentDialog,
            isInspectingArchive: false,
            statusMessage: description,
          },
    )
    setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
      state: 'fetch-failed',
      label: 'Local ZIP Inspection Failed',
      description,
    })
  }

  const handleChooseLocalPubPartsArchive = () => {
    const dialog = pubPartsSourceOptionsDialog
    if (dialog === null || dialog.isStaging || dialog.isInspectingArchive) {
      return
    }

    revokePubPartsSourceOptionsPreviewObjectUrl()
    setPubPartsSourceOptionsDialog({
      ...dialog,
      isInspectingArchive: true,
      previewState: { status: 'idle' },
      statusMessage: 'Waiting for the downloaded PubParts ZIP selection...',
    })

    void chooseLocalPubPartsZipArchive()
      .then((archiveBlob) => inspectLocalPubPartsArchive(dialog, archiveBlob, 'Local ZIP inspected.'))
      .catch((error: unknown) => handleLocalPubPartsArchiveInspectionError(dialog, error))
  }

  const handleAcceptDroppedLocalPubPartsArchive = (archiveFile: File) => {
    const dialog = pubPartsSourceOptionsDialog
    if (dialog === null || dialog.isStaging || dialog.isInspectingArchive) {
      return
    }

    revokePubPartsSourceOptionsPreviewObjectUrl()

    if (!/\.zip$/iu.test(archiveFile.name.trim())) {
      setPubPartsSourceOptionsDialog({
        ...dialog,
        previewState: { status: 'idle' },
        statusMessage:
          'Select the downloaded PubParts .zip archive. Drop a .zip file or use Upload ZIP.',
      })
      return
    }

    setPubPartsSourceOptionsDialog({
      ...dialog,
      isInspectingArchive: true,
      previewState: { status: 'idle' },
      statusMessage: `Inspecting dropped PubParts ZIP ${archiveFile.name}...`,
    })

    void inspectLocalPubPartsArchive(dialog, archiveFile, 'Dropped ZIP inspected.').catch(
      (error: unknown) => handleLocalPubPartsArchiveInspectionError(dialog, error),
    )
  }

  const pubPartsSourceOptionsPreviewActionStatesByCandidateId = useMemo(() => {
    if (pubPartsSourceOptionsDialog === null) {
      return {} as Record<string, PubPartsZipEntryPreviewActionState>
    }

    const archiveByteAvailability =
      resolvePubPartsSourceOptionsArchiveByteAvailability(pubPartsSourceOptionsDialog)
    return Object.fromEntries(
      resolvePubPartsZipEntryPreviewActionStates(
        pubPartsSourceOptionsDialog.candidates,
        archiveByteAvailability,
      ).map((previewActionState) => [previewActionState.candidateId, previewActionState]),
    ) as Record<string, PubPartsZipEntryPreviewActionState>
  }, [pubPartsSourceOptionsDialog])

  const handlePreviewPubPartsSourceOption = (candidateId: string) => {
    const dialog = pubPartsSourceOptionsDialog
    if (dialog === null || dialog.isStaging || dialog.isInspectingArchive) {
      return
    }

    const candidate = dialog.candidates.find(
      (candidateRecord) => candidateRecord.candidateId === candidateId,
    )
    if (candidate === undefined || dialog.archiveBlob === undefined) {
      return
    }

    const archiveByteAvailability = resolvePubPartsSourceOptionsArchiveByteAvailability(dialog)
    const previewActionState = resolvePubPartsZipEntryPreviewActionState(
      candidate,
      archiveByteAvailability,
    )
    if (!previewActionState.canPreview) {
      setPubPartsSourceOptionsDialog({
        ...dialog,
        previewState: {
          status: 'error',
          candidateId,
          fileName: candidate.fileName,
          message: previewActionState.description,
        },
      })
      return
    }

    revokePubPartsSourceOptionsPreviewObjectUrl()
    const previewArchiveBlob = dialog.archiveBlob
    setPubPartsSourceOptionsDialog({
      ...dialog,
      previewState: {
        status: 'loading',
        candidateId,
        fileName: previewActionState.fileName,
      },
    })

    void extractPubPartsZipArchiveEntries(previewArchiveBlob, [
      previewActionState.normalizedArchivePath,
    ])
      .then((extractedEntries) => {
        const [extractedEntry] = extractedEntries
        if (extractedEntry === undefined) {
          throw new Error('This ZIP entry could not be prepared for preview.')
        }

        const latestDialog = pubPartsSourceOptionsDialogRef.current
        if (
          !isCurrentPubPartsSourceOptionsPreviewRequest(
            latestDialog,
            dialog.stagedRecord.stagedSourceId,
            previewArchiveBlob,
            candidateId,
          )
        ) {
          return
        }

        const objectUrl = URL.createObjectURL(extractedEntry.blob)
        pubPartsSourceOptionsPreviewObjectUrlRef.current = objectUrl
        setPubPartsSourceOptionsDialog({
          ...latestDialog,
          previewState: {
            status: 'ready',
            candidateId,
            fileName: extractedEntry.fileName,
            fileType: extractedEntry.fileType,
            objectUrl,
          },
        })
      })
      .catch((error: unknown) => {
        const latestDialog = pubPartsSourceOptionsDialogRef.current
        if (
          !isCurrentPubPartsSourceOptionsPreviewRequest(
            latestDialog,
            dialog.stagedRecord.stagedSourceId,
            previewArchiveBlob,
            candidateId,
          )
        ) {
          return
        }

        setPubPartsSourceOptionsDialog({
          ...latestDialog,
          previewState: {
            status: 'error',
            candidateId,
            fileName: candidate.fileName,
            message: buildPubPartsPreviewErrorMessage(error),
          },
        })
      })
  }

  const handleClosePubPartsSourceOptionsDialog = () => {
    revokePubPartsSourceOptionsPreviewObjectUrl()
    setPubPartsSourceOptionsDialog(null)
  }

  const handleStageSelectedPubPartsSourceOptions = () => {
    const dialog = pubPartsSourceOptionsDialog
    if (
      dialog === null ||
      dialog.isStaging ||
      dialog.isInspectingArchive ||
      dialog.selectedCandidateIds.length === 0
    ) {
      return
    }

    const selectedCandidates = dialog.candidates.filter(
      (candidate) =>
        candidate.selectable && dialog.selectedCandidateIds.includes(candidate.candidateId),
    )
    if (selectedCandidates.length === 0) {
      return
    }
    const directFileCandidates = selectedCandidates.filter(
      (candidate) => candidate.kind === 'supported-direct-file',
    )
    const archiveEntryCandidates = selectedCandidates.filter(
      (candidate) => candidate.kind === 'supported-archive-entry',
    )
    const reusableArchiveBlob =
      archiveEntryCandidates.length > 0 &&
      dialog.archiveBlob !== undefined &&
      dialog.archiveBlobSourceUrl === dialog.stagedRecord.sourceCandidateUrl.trim() &&
      dialog.archiveBlobStagedSourceId === dialog.stagedRecord.stagedSourceId
        ? dialog.archiveBlob
        : undefined

    setPubPartsSourceOptionsDialog({
      ...dialog,
      isStaging: true,
      statusMessage: 'Staging selected PubParts source files to Import review...',
    })

    setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
      state: 'fetching-selected-file',
      label: 'Fetching Selected Source',
      description:
        'ParaHook is fetching and extracting the selected PubParts source files so Import can review them.',
    })

    const sourceAttribution =
      buildCatalogPubPartsImportedReferenceSourceAttribution(dialog.stagedRecord)

    const materializeSelectedFiles = async (): Promise<ImportedReferenceFile[]> => {
      const [directFiles, archiveFiles] = await Promise.all([
        Promise.all(
          directFileCandidates.map(async (candidate) => {
            const fetchedFile = await fetchPubPartsSharedLinkCandidateFile(candidate)
            return {
              ...fetchedFile,
              sourceAttribution: {
                ...sourceAttribution,
                sourceCandidateUrl: candidate.sourceUrl,
              },
            }
          }),
        ),
        archiveEntryCandidates.length === 0
          ? Promise.resolve([])
          : materializePubPartsSharedLinkArchiveCandidateFiles(
              dialog.stagedRecord,
              archiveEntryCandidates,
              {
                archiveBlob: reusableArchiveBlob,
                onExtractedEntries: async (extractedEntries) => {
                  await Promise.all(
                    extractedEntries.map((extractedEntry) =>
                      writePubPartsInternalLibraryExtractedCandidate({
                        stagedRecord: dialog.stagedRecord,
                        extractedEntry,
                      }),
                    ),
                  ).catch(() => undefined)
                  await mirrorPubPartsExtractedEntriesToLocalLibrary(
                    dialog.stagedRecord,
                    extractedEntries,
                    reusableArchiveBlob,
                    typeof File !== 'undefined' && reusableArchiveBlob instanceof File
                      ? reusableArchiveBlob.name
                      : undefined,
                  )
                },
              },
            ).then((files) =>
              files.map((file, index) => ({
                ...file,
                sourceAttribution: {
                  ...sourceAttribution,
                  sourceCandidateUrl:
                    archiveEntryCandidates[index]?.sourceUrl ??
                    dialog.stagedRecord.sourceCandidateUrl,
                },
              })),
            ),
      ])

      return [...directFiles, ...archiveFiles]
    }

    void materializeSelectedFiles()
      .then((files) => {
        openStagedImportDraft({})
        appendStagedImportDraftFiles(files)
        setPubPartsSourceOptionsDialog((currentDialog) =>
          currentDialog === null
            ? currentDialog
            : {
                ...currentDialog,
                isStaging: false,
                statusMessage: `${files.length} PubParts source file${
                  files.length === 1 ? '' : 's'
                } staged in Import review with PubParts attribution.`,
              },
        )
        setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
          state: 'ready-for-import-review',
          label: 'Ready For Import Review',
          description:
            'The selected PubParts shared-link files are staged in the Import review dialog with PubParts attribution.',
        })
      })
      .catch((error: unknown) => {
        setPubPartsSourceOptionsDialog((currentDialog) =>
          currentDialog === null
            ? currentDialog
            : {
                ...currentDialog,
                isStaging: false,
                statusMessage:
                  error instanceof Error
                    ? `${error.message} No files were added. Use Open Source or the local-library/manual fallback instead.`
                    : 'The selected PubParts source files could not be staged. No files were added. Use Open Source or the local-library/manual fallback instead.',
              },
        )
        setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
          state: 'fetch-failed',
          label: 'Source Staging Failed',
          description:
            error instanceof Error
              ? `${error.message} No files were added. Use Open Source or the local-library/manual fallback instead.`
              : 'The selected PubParts source files could not be staged. No files were added. Use Open Source or the local-library/manual fallback instead.',
        })
      })
  }

  const handleApplyEnvironment = (item: (typeof catalogSnapshot.allItems)[number]) => {
    const applyRequest = resolveCatalogEnvironmentApplyRequest(item, resolveCatalogActionPlan(item))
    if (applyRequest === null) {
      return
    }

    runEnvironmentLookHistoryAction(
      () =>
        applyHdriEnvironment({
          label: applyRequest.label,
          assetPath: applyRequest.assetPath,
        }),
      {
        targetId: 'environment-source:catalog',
        targetLabel: applyRequest.label,
      },
    )
  }

  const handleBrowseLocalEnvironment = (file: File) => {
    const normalizedName = file.name.trim()
    if (!/\.(?:hdr|exr)$/i.test(normalizedName)) {
      return
    }

    const objectUrl =
      typeof URL.createObjectURL === 'function'
        ? URL.createObjectURL(file)
        : `local:${normalizedName}`
    runEnvironmentLookHistoryAction(
      () =>
        applyHdriEnvironment({
          label: normalizedName,
          assetPath: objectUrl,
        }),
      {
        targetId: 'environment-source:local-file',
        targetLabel: normalizedName,
      },
    )
  }

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--catalog CatalogSurface"
      data-workspace-slot-id={slotId}
      data-workspace-surface-instance-id={surfaceInstanceId}
      data-workspace-host-mode={hostMode}
    >
      <CatalogShell
        snapshot={catalogSnapshot}
        previewLoadedItemIds={previewSession.loadedItemIds}
        onPreviewSessionChange={setPreviewSession}
        onAddItemToProject={handleAddItemToProject}
        onStageExternalSourceLink={handleStageExternalSourceLink}
        onInspectStagedSource={handleInspectPubPartsStagedSource}
        onSelectSupportedFileCandidate={handleSelectPubPartsSupportedFileCandidate}
        onPreparePubPartsLocalSource={handlePreparePubPartsLocalSource}
        onAddPubPartsDropboxFileToProject={handleAddPubPartsDropboxFileToProject}
        onImportDownloadedPubPartsFiles={handleImportDownloadedPubPartsFiles}
        pubPartsStagedSourceRecords={pubPartsStagedSourceRecords}
        pubPartsStagedSourcesByCatalogItemId={pubPartsStagedSourcesByCatalogItemId}
        pubPartsLocalSourceRecords={pubPartsLocalSourceRecords}
        pubPartsLocalSourcesByCatalogItemId={pubPartsLocalSourcesByCatalogItemId}
        pubPartsDropboxChooserStatusByCatalogItemId={
          pubPartsDropboxChooserStatusByCatalogItemId
        }
        pubPartsLocalLibraryMirrorRead={pubPartsLocalLibraryMirrorRead}
        onApplyEnvironment={handleApplyEnvironment}
        onBrowseLocalEnvironment={handleBrowseLocalEnvironment}
        appliedEnvironmentSource={environmentSource}
        onSetHdriBackgroundVisible={(visible) =>
          runEnvironmentLookHistoryAction(
            () => setHdriEnvironmentBackgroundVisible(visible),
            {
              targetId: 'environment-source:background',
              targetLabel: 'HDRI background',
            },
          )
        }
        onSetHdriIntensity={setHdriEnvironmentIntensity}
        onUnloadAllPreviewItems={() => setPreviewSession(unloadAllCatalogPreviewItems())}
        onUnloadPreviewItem={(itemId) =>
          setPreviewSession((currentSession) =>
            unloadCatalogPreviewItem(currentSession, itemId),
          )
        }
        onClearPubPartsStagedSource={handleClearPubPartsStagedSource}
        onClearAllPubPartsStagedSources={handleClearAllPubPartsStagedSources}
      />
      {pubPartsSourceOptionsDialog !== null ? (
        <CatalogShellSourceOptionsDialog
          stagedRecord={pubPartsSourceOptionsDialog.stagedRecord}
          candidates={pubPartsSourceOptionsDialog.candidates}
          selectedCandidateIds={pubPartsSourceOptionsDialog.selectedCandidateIds}
          statusMessage={pubPartsSourceOptionsDialog.statusMessage}
          isInspectingArchive={pubPartsSourceOptionsDialog.isInspectingArchive}
          isStaging={pubPartsSourceOptionsDialog.isStaging}
          previewActionStatesByCandidateId={pubPartsSourceOptionsPreviewActionStatesByCandidateId}
          previewState={pubPartsSourceOptionsDialog.previewState}
          onToggleCandidate={handleTogglePubPartsSourceOption}
          onPreviewCandidate={handlePreviewPubPartsSourceOption}
          onSelectAllSupported={handleSelectAllPubPartsSourceOptions}
          onClearSelection={handleClearPubPartsSourceOptionsSelection}
          onChooseLocalArchive={handleChooseLocalPubPartsArchive}
          onAcceptLocalArchive={handleAcceptDroppedLocalPubPartsArchive}
          onStageSelected={handleStageSelectedPubPartsSourceOptions}
          onClose={handleClosePubPartsSourceOptionsDialog}
        />
      ) : null}
    </div>
  )
}
