import { useEffect, useMemo, useState } from 'react'
import { resolveCatalogEnvironmentApplyRequest } from '../catalog/catalogEnvironmentApply'
import type { WorkspaceViewportSlotId } from './workspaceShellTypes'
import { resolveCatalogActionPlan } from '../catalog/catalogActionPlan'
import { resolveCatalogReferenceCommitRequest } from '../catalog/catalogReferenceCommit'
import { CatalogShell } from '../catalog/ui/CatalogShell'
import {
  createCatalogImportsSourceSnapshotFromReferenceWorkspace,
  createCatalogSourceSnapshot,
} from '../catalog/catalogSource'
import {
  readCatalogPreviewSession,
  sanitizeCatalogPreviewSessionState,
  unloadAllCatalogPreviewItems,
  unloadCatalogPreviewItem,
  writeCatalogPreviewSession,
  type CatalogPreviewSessionState,
} from '../catalog/catalogPreviewSession'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'

type CatalogSurfaceProps = {
  slotId?: WorkspaceViewportSlotId
  surfaceInstanceId: string
  hostMode?: 'slotted' | 'floating' | 'popout'
}

export function CatalogSurface(props: CatalogSurfaceProps) {
  const { slotId, surfaceInstanceId, hostMode = 'slotted' } = props
  const addImportedReference = useAppStore((state) => state.addImportedReference)
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
    () =>
      createCatalogSourceSnapshot(
        createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace),
      ),
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
      />
    </div>
  )
}
