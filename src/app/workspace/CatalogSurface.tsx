import { useEffect, useMemo, useState } from 'react'
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
import { CatalogShell } from '../catalog/ui/CatalogShell'
import { CatalogShellSourceOptionsDialog } from '../catalog/ui/CatalogShellSourceOptionsDialog'
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
import { listPubPartsZipArchiveEntries } from '../catalog/pubPartsZipArchive'
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
  archiveBlob?: Blob
  archiveBlobSourceUrl?: string
  archiveBlobStagedSourceId?: string
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

const resolvePubPartsArchiveInspectionSuccessStatus = (
  candidates: PubPartsSharedLinkCandidate[],
  selectedCandidateIds: string[],
): string => {
  const supportedArchiveCount = candidates.filter(
    (candidate) => candidate.kind === 'supported-archive-entry',
  ).length

  if (supportedArchiveCount === 0) {
    return 'ZIP inspected, but no supported entries are selectable. Use Open Source or Import Local Files after downloading and extracting manually.'
  }

  return `ZIP inspected. ${selectedCandidateIds.length} supported archive candidate${
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

const resolvePubPartsArchiveInspectionFailureStatus = (error: unknown): string =>
  error instanceof Error
    ? `${error.message} Use Download ZIP to open or save the archive, then upload that ZIP here.`
    : 'PubParts ZIP archive inspection failed. Use Download ZIP to open or save the archive, then upload that ZIP here.'

export function CatalogSurface(props: CatalogSurfaceProps) {
  const { slotId, surfaceInstanceId, hostMode = 'slotted' } = props
  const addImportedReference = useAppStore((state) => state.addImportedReference)
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
  const catalogSnapshot = useMemo(
    () => {
      const pubPartsSourceItems = [
        ...readCachedPubPartsFullPartSourceItems(),
        ...readCachedPubPartsResourceSourceItems(),
      ]

      return createCatalogSourceSnapshot(
        createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace),
        { pubPartsSourceItems },
      )
    },
    [referenceWorkspace],
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
  const [
    pubPartsDropboxChooserStatusByCatalogItemId,
    setPubPartsDropboxChooserStatusByCatalogItemId,
  ] = useState<Map<string, CatalogPubPartsDropboxChooserStatus>>(() => new Map())
  const [pubPartsSourceOptionsDialog, setPubPartsSourceOptionsDialog] =
    useState<PubPartsSourceOptionsDialogState>(null)
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

    addImportedReference({
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
    const cachedArchiveManifest =
      needsArchiveInspection ? readPubPartsArchiveManifestCacheRecord(stagedRecord) : null
    const dialogCandidates =
      cachedArchiveManifest === null
        ? candidates
        : mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
            stagedRecord,
            cachedArchiveManifest.entries,
          )
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

    setPubPartsSourceOptionsDialog({
      stagedRecord,
      candidates: dialogCandidates,
      selectedCandidateIds:
        needsArchiveInspection && cachedArchiveManifest === null ? [] : selectedCandidateIds,
      statusMessage:
        needsArchiveInspection && cachedArchiveManifest === null
          ? 'Inspecting ZIP archive from the PubParts source...'
          : needsArchiveInspection
            ? resolvePubPartsArchiveManifestCacheHitStatus(dialogCandidates, selectedCandidateIds)
          : selectedCandidateIds.length > 0
          ? resolvePubPartsSourceOptionsSelectionStatus(selectedCandidates)
          : 'No directly stageable files were found yet. Use Open Source or wait for archive and folder inspection support.',
      isInspectingArchive: needsArchiveInspection && cachedArchiveManifest === null,
      isStaging: false,
    })
    setPubPartsDropboxChooserStatus(item.itemId, {
      state:
        selectedCandidateIds.length > 0 || needsArchiveInspection
          ? 'chooser-opening'
          : 'chooser-unavailable',
      label:
        needsArchiveInspection && cachedArchiveManifest === null
          ? 'Inspecting ZIP Archive'
        : hasDirectStageableCandidates
          ? 'Source Options Open'
          : hasArchiveMetadataCandidates
            ? 'Archive Candidates Found'
            : 'Inspection Needed',
      description:
        needsArchiveInspection && cachedArchiveManifest === null
          ? 'Source options are open while ParaHook inspects this one PubParts ZIP archive.'
          : needsArchiveInspection
            ? 'Source options are open with cached archive metadata. Selected ZIP entries will still be revalidated from real archive bytes before Import review.'
          : hasDirectStageableCandidates
          ? 'Source options are open. Select the supported files to stage into Import review.'
          : hasArchiveMetadataCandidates
          ? 'Source options are open with archive candidates that can be extracted into Import review.'
          : 'This shared source link needs archive or folder inspection before files can be selected automatically.',
    })

    if (needsArchiveInspection && cachedArchiveManifest === null) {
      void inspectPubPartsSharedLinkArchive(stagedRecord)
        .then((archiveInspection) => {
          writePubPartsArchiveManifestCacheRecord(stagedRecord, archiveInspection.entries)
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
              statusMessage: resolvePubPartsArchiveInspectionSuccessStatus(
                archiveInspection.candidates,
                nextSelectedCandidateIds,
              ),
              isInspectingArchive: false,
              isStaging: false,
              archiveBlob: archiveInspection.archiveBlob,
              archiveBlobSourceUrl: archiveInspection.sourceUrl,
              archiveBlobStagedSourceId: stagedRecord.stagedSourceId,
            }
          })
          setPubPartsDropboxChooserStatus(item.itemId, {
            state:
              nextSelectedCandidateIds.length > 0 ? 'chooser-opening' : 'chooser-unavailable',
            label:
              nextSelectedCandidateIds.length > 0
                ? 'Archive Candidates Found'
                : 'No Supported Archive Entries',
            description:
              nextSelectedCandidateIds.length > 0
                ? 'Source options are open with real ZIP archive candidates ready for selected extraction into Import review.'
                : 'The ZIP was inspected, but no supported archive entries are selectable. Use Open Source or the manual local import fallback.',
          })
        })
        .catch((error: unknown) => {
          const statusMessage = resolvePubPartsArchiveInspectionFailureStatus(error)
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

  const handleChooseLocalPubPartsArchive = () => {
    const dialog = pubPartsSourceOptionsDialog
    if (dialog === null || dialog.isStaging || dialog.isInspectingArchive) {
      return
    }

    setPubPartsSourceOptionsDialog({
      ...dialog,
      isInspectingArchive: true,
      statusMessage: 'Waiting for the downloaded PubParts ZIP selection...',
    })

    void chooseLocalPubPartsZipArchive()
      .then(async (archiveBlob) => {
        const entries = await listPubPartsZipArchiveEntries(archiveBlob)
        const candidates = mapPubPartsZipArchiveEntriesToSharedLinkCandidates(
          dialog.stagedRecord,
          entries,
        )
        const selectedCandidateIds = candidates
          .filter((candidate) => candidate.selectable)
          .map((candidate) => candidate.candidateId)

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
            statusMessage: `Local ZIP inspected. ${selectedCandidateIds.length} supported archive candidate${
              selectedCandidateIds.length === 1 ? '' : 's'
            } selected for extraction into Import review.`,
            isInspectingArchive: false,
            archiveBlob,
            archiveBlobSourceUrl: dialog.stagedRecord.sourceCandidateUrl.trim(),
            archiveBlobStagedSourceId: dialog.stagedRecord.stagedSourceId,
          }
        })
        setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
          state: selectedCandidateIds.length > 0 ? 'chooser-opening' : 'chooser-unavailable',
          label: selectedCandidateIds.length > 0 ? 'Local ZIP Candidates Found' : 'No Supported ZIP Entries',
          description:
            selectedCandidateIds.length > 0
              ? 'The selected local PubParts ZIP is ready for selected extraction into Import review.'
              : 'The selected local PubParts ZIP did not contain supported import entries.',
        })
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === 'No PubParts ZIP file selected.') {
          setPubPartsSourceOptionsDialog((currentDialog) =>
            currentDialog === null
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

        setPubPartsSourceOptionsDialog((currentDialog) =>
          currentDialog === null
            ? currentDialog
            : {
                ...currentDialog,
                isInspectingArchive: false,
                statusMessage:
                  error instanceof Error
                    ? `${error.message} Choose the downloaded PubParts ZIP or use Import Local Files for already extracted models.`
                    : 'Local ZIP inspection failed. Choose the downloaded PubParts ZIP or use Import Local Files for already extracted models.',
              },
        )
        setPubPartsDropboxChooserStatus(dialog.stagedRecord.catalogItemId, {
          state: 'fetch-failed',
          label: 'Local ZIP Inspection Failed',
          description:
            error instanceof Error
              ? `${error.message} Choose the downloaded PubParts ZIP or use Import Local Files for already extracted models.`
              : 'Local ZIP inspection failed. Choose the downloaded PubParts ZIP or use Import Local Files for already extracted models.',
        })
      })
  }

  const handleClosePubPartsSourceOptionsDialog = () => {
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

    applyHdriEnvironment({
      label: applyRequest.label,
      assetPath: applyRequest.assetPath,
    })
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
    applyHdriEnvironment({
      label: normalizedName,
      assetPath: objectUrl,
    })
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
        onApplyEnvironment={handleApplyEnvironment}
        onBrowseLocalEnvironment={handleBrowseLocalEnvironment}
        appliedEnvironmentSource={environmentSource}
        onSetHdriBackgroundVisible={setHdriEnvironmentBackgroundVisible}
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
          onToggleCandidate={handleTogglePubPartsSourceOption}
          onSelectAllSupported={handleSelectAllPubPartsSourceOptions}
          onClearSelection={handleClearPubPartsSourceOptionsSelection}
          onChooseLocalArchive={handleChooseLocalPubPartsArchive}
          onStageSelected={handleStageSelectedPubPartsSourceOptions}
          onClose={handleClosePubPartsSourceOptionsDialog}
        />
      ) : null}
    </div>
  )
}
