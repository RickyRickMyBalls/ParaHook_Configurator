import { useEffect, useMemo, useRef, useState } from 'react'
import { setViewer } from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import {
  selectReferenceWorkspaceItems,
  useAppStore,
} from '../store/useAppStore'
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
import {
  evaluateReferenceTimelineChannelValue,
  evaluateReferenceTransformOverrideWithTimelines,
  getReferenceTimelineDefaultRange,
  type ReferenceTimelineChannelKey,
} from '../references/referenceTimeline'

const EMPTY_PREVIEW_LIST: PreviewRenderVm = {
  items: [],
  viewerParts: [],
}

export function ViewerHost() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const isMountedRef = useRef(false)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const setReferenceItemLoadState = useAppStore((state) => state.setReferenceItemLoadState)
  const setReferenceItemVisibility = useAppStore((state) => state.setReferenceItemVisibility)
  const endReferenceTransform = useAppStore((state) => state.endReferenceTransform)
  const setReferenceTransformMode = useAppStore((state) => state.setReferenceTransformMode)
  const setReferenceTransformSpace = useAppStore((state) => state.setReferenceTransformSpace)
  const setReferenceTransformOverride = useAppStore((state) => state.setReferenceTransformOverride)
  const graphRuntimeByDocumentId = useSpaghettiStore((state) => state.graphRuntimeByDocumentId)
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const viewerTargetPreviewPreparation = useSpaghettiStore(selectViewerTargetGraphPreviewPreparation)
  const viewerTargetBuildOutputs = useSpaghettiStore(selectViewerTargetGraphAcceptedPreviewBuildOutputs)
  const view = useUiPrefsStore((state) => state.view)

  const previewList = useMemo(
    () => {
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
      sharedViewerComposition,
      viewerTargetBuildOutputs,
      viewerTargetPreviewPreparation,
    ],
  )

  const referenceWorkspaceItems = useMemo(
    () => selectReferenceWorkspaceItems({ referenceWorkspace }),
    [referenceWorkspace],
  )
  const [timelineNowMs, setTimelineNowMs] = useState(() => performance.now())
  const previousReferenceIdsRef = useRef<string[]>([])
  const activeReferenceTransformSession = useMemo(
    () =>
      referenceWorkspace.activeTransformReferenceId === null
        ? null
        : {
            referenceId: referenceWorkspace.activeTransformReferenceId,
            mode: referenceWorkspace.activeTransformMode,
            space: referenceWorkspace.activeTransformSpace,
          },
    [
      referenceWorkspace.activeTransformMode,
      referenceWorkspace.activeTransformReferenceId,
      referenceWorkspace.activeTransformSpace,
    ],
  )
  const hasActiveReferenceTimelines = useMemo(
    () =>
      Object.values(referenceWorkspace.timelineModeByReferenceId).some((channelModes) =>
        Object.values(channelModes ?? {}).some((mode) => mode === 'timeline'),
      ),
    [referenceWorkspace.timelineModeByReferenceId],
  )

  const evaluatedReferenceItems = useMemo(() => {
    const getChannelMode = (referenceId: string, channel: ReferenceTimelineChannelKey) =>
      referenceWorkspace.timelineModeByReferenceId[referenceId]?.[channel] ?? 'basic'
    const getChannelConfig = (referenceId: string, channel: ReferenceTimelineChannelKey) =>
      referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel] ?? null
    const getChannelRange = (referenceId: string, channel: ReferenceTimelineChannelKey) =>
      referenceWorkspace.channelClampRangeByReferenceId[referenceId]?.[channel] ??
      getReferenceTimelineDefaultRange(channel)

    return referenceWorkspaceItems.map((item) => {
      const evaluatedTransformOverride = evaluateReferenceTransformOverrideWithTimelines(
        item.transformOverride ?? null,
        timelineNowMs,
        (channel) => getChannelMode(item.referenceId, channel),
        (channel) => getChannelConfig(item.referenceId, channel),
        (channel) => getChannelRange(item.referenceId, channel),
      )
      const baseRotateSnap = referenceWorkspace.rotateSnapByReferenceId[item.referenceId] ?? {
        enabled: false,
        value: 15,
      }
      const evaluatedRotateSnap = {
        ...baseRotateSnap,
        value: evaluateReferenceTimelineChannelValue(
          getChannelMode(item.referenceId, 'rotate-snap'),
          getChannelConfig(item.referenceId, 'rotate-snap'),
          baseRotateSnap.value,
          getChannelRange(item.referenceId, 'rotate-snap'),
          timelineNowMs,
        ),
      }
      return {
        ...item,
        evaluatedTransformOverride,
        evaluatedRotateSnap,
      }
    })
  }, [
    referenceWorkspace.channelClampRangeByReferenceId,
    referenceWorkspace.rotateSnapByReferenceId,
    referenceWorkspace.timelineConfigByReferenceId,
    referenceWorkspace.timelineModeByReferenceId,
    referenceWorkspaceItems,
    timelineNowMs,
  ])

  useEffect(() => {
    if (!hasActiveReferenceTimelines) {
      return
    }
    let frameId = 0
    const tick = (nextNowMs: number) => {
      setTimelineNowMs(nextNowMs)
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [hasActiveReferenceTimelines])

  useEffect(() => {
    if (mountRef.current === null) {
      return
    }

    isMountedRef.current = true
    const viewer = new Viewer(mountRef.current)
    viewerRef.current = viewer
    setViewer(viewer)

    return () => {
      isMountedRef.current = false
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

    viewer.setAssembled(null)
    viewer.setParts(previewList.viewerParts, partsVisibility, selectedPartKey)
  }, [
    partsVisibility,
    previewList,
    selectedPartKey,
  ])

  useEffect(() => {
    viewerRef.current?.setSelectedPart(selectedPartKey)
  }, [selectedPartKey])

  useEffect(() => {
    viewerRef.current?.applyViewSettings(view)
  }, [view])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    viewer.setOnReferenceTransformChange((referenceId, transformOverride) => {
      useAppStore.getState().setReferenceTransformOverride(referenceId, transformOverride)
    })
    viewer.setOnReferenceTransformExit(() => {
      useAppStore.getState().endReferenceTransform()
    })
    viewer.setOnReferenceTransformModeChange((mode) => {
      useAppStore.getState().setReferenceTransformMode(mode)
    })
    viewer.setOnReferenceTransformSpaceChange((space) => {
      useAppStore.getState().setReferenceTransformSpace(space)
    })

    return () => {
      viewer.setOnReferenceTransformChange(null)
      viewer.setOnReferenceTransformExit(null)
      viewer.setOnReferenceTransformModeChange(null)
      viewer.setOnReferenceTransformSpaceChange(null)
    }
  }, [endReferenceTransform, setReferenceTransformMode, setReferenceTransformOverride, setReferenceTransformSpace])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    const currentReferenceIds = referenceWorkspaceItems.map((item) => item.referenceId)
    const removedReferenceIds = previousReferenceIdsRef.current.filter(
      (referenceId) => !currentReferenceIds.includes(referenceId),
    )
    removedReferenceIds.forEach((referenceId) => {
      viewer.removeReference(referenceId)
    })
    previousReferenceIdsRef.current = currentReferenceIds

    const syncReferences = async () => {
      for (const item of referenceWorkspaceItems) {
        if (!item.isVisible) {
          viewer.setReferenceVisible(item.referenceId, false)
          continue
        }
        if (item.loadState === 'loaded') {
          viewer.setReferenceVisible(item.referenceId, true)
          continue
        }
        if (item.loadState === 'loading') {
          continue
        }
        setReferenceItemLoadState(item.referenceId, 'loading')
        try {
          await viewer.ensureReferenceLoaded(item)
          if (!isMountedRef.current || viewerRef.current !== viewer) {
            return
          }
          setReferenceItemLoadState(item.referenceId, 'loaded')
          if (useAppStore.getState().referenceWorkspace.visibilityById[item.referenceId] ?? false) {
            viewer.setReferenceVisible(item.referenceId, true)
          }
        } catch (error) {
          if (!isMountedRef.current || viewerRef.current !== viewer) {
            return
          }
          const message =
            error instanceof Error ? error.message : 'Failed to load reference asset.'
          setReferenceItemLoadState(item.referenceId, 'error', message)
          setReferenceItemVisibility(item.referenceId, false)
          viewer.setReferenceVisible(item.referenceId, false)
        }
      }
    }

    void syncReferences()
  }, [referenceWorkspaceItems, setReferenceItemLoadState, setReferenceItemVisibility])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    evaluatedReferenceItems.forEach((item) => {
      viewer.setReferenceTransformOverride(item.referenceId, item.evaluatedTransformOverride)
    })
  }, [evaluatedReferenceItems])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }
    const activeReferenceId = referenceWorkspace.activeTransformReferenceId
    if (activeReferenceId === null) {
      viewer.setGizmoSnap({ rotateDeg: undefined })
      return
    }
    const activeReferenceItem =
      evaluatedReferenceItems.find((item) => item.referenceId === activeReferenceId) ?? null
    viewer.setGizmoSnap({
      rotateDeg: activeReferenceItem?.evaluatedRotateSnap.enabled === true
        ? activeReferenceItem.evaluatedRotateSnap.value
        : undefined,
    })
  }, [
    evaluatedReferenceItems,
    referenceWorkspace.activeTransformReferenceId,
  ])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformSession(activeReferenceTransformSession)
  }, [activeReferenceTransformSession])

  return (
    <div className="ViewportRoot">
      <div className="ViewportCanvasLayer" ref={mountRef} />
    </div>
  )
}
