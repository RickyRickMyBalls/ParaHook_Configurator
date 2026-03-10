import { useEffect, useMemo, useRef } from 'react'
import { setViewer } from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  selectActiveEditorViewport,
  selectGraphPreviewPreparationByDocumentId,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { selectPreviewRenderVmFromPreparation } from '../spaghetti/selectors/selectPreviewRenderVm'
import { toViewerRenderablePart } from '../../shared/buildTypes'

export function ViewerHost() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const parts = useAppStore((state) => state.parts)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const assembled = useAppStore((state) => state.assembled)
  const viewMode = useAppStore((state) => state.viewMode)
  const inputMode = useAppStore((state) => state.inputMode)
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const activeGraphPreviewPreparation = useSpaghettiStore((state) =>
    activeEditorViewport === null
      ? null
      : selectGraphPreviewPreparationByDocumentId(state, activeEditorViewport.graphDocumentId),
  )
  const view = useUiPrefsStore((state) => state.view)

  const previewList = useMemo(
    () =>
      inputMode === 'spaghetti' &&
      activeEditorViewport !== null &&
      activeGraphPreviewPreparation !== null
        ? selectPreviewRenderVmFromPreparation(activeGraphPreviewPreparation, parts)
        : { items: [], viewerParts: [] },
    [activeEditorViewport, activeGraphPreviewPreparation, inputMode, parts],
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
      if (inputMode === 'spaghetti' && activeEditorViewport !== null) {
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
    activeEditorViewport,
    inputMode,
    parts,
    partsVisibility,
    previewList,
    selectedPartKey,
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
