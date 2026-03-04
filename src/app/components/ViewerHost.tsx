import { useEffect, useRef } from 'react'
import { setViewer } from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'

export function ViewerHost() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const parts = useAppStore((state) => state.parts)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const assembled = useAppStore((state) => state.assembled)
  const viewMode = useAppStore((state) => state.viewMode)
  const view = useUiPrefsStore((state) => state.view)

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
      viewer.setParts(parts, partsVisibility, selectedPartKey)
      return
    }

    viewer.setParts([], partsVisibility, selectedPartKey)
    viewer.setAssembled(assembled)
  }, [parts, partsVisibility, selectedPartKey, assembled, viewMode])

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
