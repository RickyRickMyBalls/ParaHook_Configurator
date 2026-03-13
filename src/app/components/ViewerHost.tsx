import { useEffect, useMemo, useRef } from 'react'
import { setViewer } from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  selectSharedViewerComposition,
  selectViewerTargetGraphAcceptedPreviewBuildOutputs,
  selectViewerTargetGraphPreviewPreparation,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  selectPreviewRenderVmFromPreparation,
  type PreviewRenderVm,
} from '../spaghetti/selectors/selectPreviewRenderVm'
import { selectSharedPreviewRenderVm } from '../spaghetti/selectors/selectSharedPreviewRenderVm'
import { toViewerRenderablePart } from '../../shared/buildTypes'

const EMPTY_PREVIEW_LIST: PreviewRenderVm = {
  items: [],
  viewerParts: [],
}

export function ViewerHost() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const parts = useAppStore((state) => state.parts)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const assembled = useAppStore((state) => state.assembled)
  const viewMode = useAppStore((state) => state.viewMode)
  const inputMode = useAppStore((state) => state.inputMode)
  const graphRuntimeByDocumentId = useSpaghettiStore((state) => state.graphRuntimeByDocumentId)
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const viewerTargetPreviewPreparation = useSpaghettiStore(selectViewerTargetGraphPreviewPreparation)
  const viewerTargetBuildOutputs = useSpaghettiStore(selectViewerTargetGraphAcceptedPreviewBuildOutputs)
  const view = useUiPrefsStore((state) => state.view)

  const previewList = useMemo(
    () => {
      if (inputMode !== 'spaghetti') {
        return EMPTY_PREVIEW_LIST
      }
      if (sharedViewerComposition !== null) {
        return selectSharedPreviewRenderVm(
          sharedViewerComposition.graphDocumentIds.map((graphDocumentId) => ({
            graphDocumentId,
            previewPreparation: graphRuntimeByDocumentId[graphDocumentId]?.previewPreparation ?? null,
            buildOutputs:
              graphRuntimeByDocumentId[graphDocumentId]?.acceptedPreviewBuildOutputs ?? [],
          })),
        )
      }
      if (viewerTargetPreviewPreparation === null) {
        return EMPTY_PREVIEW_LIST
      }
      return selectPreviewRenderVmFromPreparation(
        viewerTargetPreviewPreparation,
        viewerTargetBuildOutputs,
      )
    },
    [
      graphRuntimeByDocumentId,
      inputMode,
      sharedViewerComposition,
      viewerTargetBuildOutputs,
      viewerTargetPreviewPreparation,
    ],
  )

  useEffect(() => {
    if (mountRef.current === null) {
      return
    }

    const viewer = new Viewer(mountRef.current)
    viewerRef.current = viewer
    setViewer(viewer)

    return () => {
      viewer.dispose()
      viewerRef.current = null
      setViewer(null)
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    if (viewMode === 'parts') {
      viewer.setAssembled(null)
      if (
        inputMode === 'spaghetti' &&
        (sharedViewerComposition !== null || viewerTargetPreviewPreparation !== null)
      ) {
        viewer.setParts(previewList.viewerParts, partsVisibility, selectedPartKey)
        return
      }
      // Legacy parts use their canonical artifact key as viewer identity.
      viewer.setParts(parts.map((part) => toViewerRenderablePart(part)), partsVisibility, selectedPartKey)
      return
    }

    viewer.setParts([], partsVisibility, selectedPartKey)
    viewer.setAssembled(assembled)
  }, [
    assembled,
    inputMode,
    parts,
    partsVisibility,
    previewList,
    selectedPartKey,
    sharedViewerComposition,
    viewerTargetPreviewPreparation,
    viewMode,
  ])

  useEffect(() => {
    viewerRef.current?.setSelectedPart(selectedPartKey)
  }, [selectedPartKey])

  useEffect(() => {
    viewerRef.current?.applyViewSettings(view)
  }, [view])

  return (
    <div className="ViewportRoot">
      <div className="ViewportCanvasLayer" ref={mountRef} />
    </div>
  )
}
