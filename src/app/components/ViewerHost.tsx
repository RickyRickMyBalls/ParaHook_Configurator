import { useEffect, useMemo, useRef, useState } from 'react'
import {
  setViewer,
  type GeometrySketchOverlayVm,
  type SketchPlanePickOverlayVm,
  type VisibleGeometrySketchOverlayVm,
} from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import {
  selectCurrentProjectContentBrowserRows,
  selectShouldSuppressBrowserGraphRuntimeOutput,
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
import type { SketchFeature } from '../spaghetti/features/featureTypes'
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
  const currentProject = useAppStore((state) => state.currentProject)
  const projectContent = useAppStore((state) => state.projectContent)
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const sketchVisibilityByRowId = useAppStore((state) => state.sketchVisibilityByRowId)
  const browserGraphBuildPolicyByGraphDocumentId = useAppStore(
    (state) => state.browserGraphBuildPolicyByGraphDocumentId,
  )
  const browserContentBuildPolicyByRowId = useAppStore(
    (state) => state.browserContentBuildPolicyByRowId,
  )
  const setReferenceItemLoadState = useAppStore((state) => state.setReferenceItemLoadState)
  const setReferenceItemVisibility = useAppStore((state) => state.setReferenceItemVisibility)
  const endReferenceTransform = useAppStore((state) => state.endReferenceTransform)
  const setReferenceTransformMode = useAppStore((state) => state.setReferenceTransformMode)
  const setReferenceTransformSpace = useAppStore((state) => state.setReferenceTransformSpace)
  const setReferenceTransformOverride = useAppStore((state) => state.setReferenceTransformOverride)
  const graphRuntimeByDocumentId = useSpaghettiStore((state) => state.graphRuntimeByDocumentId)
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession)
  const geometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const viewerTargetGraphDocumentId = useSpaghettiStore((state) => state.viewerTargetGraphDocumentId)
  const viewerTargetPreviewPreparation = useSpaghettiStore(selectViewerTargetGraphPreviewPreparation)
  const viewerTargetBuildOutputs = useSpaghettiStore(selectViewerTargetGraphAcceptedPreviewBuildOutputs)
  const view = useUiPrefsStore((state) => state.view)
  const sketchPlaneToolbarGhostPlaneScale = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarGhostPlaneScale,
  )
  const sketchPlaneToolbarGizmoScale = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarGizmoScale,
  )
  const sketchPlaneToolbarTranslateSnapEnabled = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarTranslateSnapEnabled,
  )
  const sketchPlaneToolbarTranslateSnapValue = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarTranslateSnapValue,
  )
  const sketchPlaneToolbarRotateSnapEnabled = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarRotateSnapEnabled,
  )
  const sketchPlaneToolbarRotateSnapValue = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarRotateSnapValue,
  )
  const sketchDrawSnapEnabled = useUiPrefsStore((state) => state.sketchDrawSnapEnabled)
  const sketchDrawSnapDistancePx = useUiPrefsStore((state) => state.sketchDrawSnapDistancePx)
  const sketchDrawCrosshairSize = useUiPrefsStore((state) => state.sketchDrawCrosshairSize)
  const sketchDrawStartPointVisible = useUiPrefsStore(
    (state) => state.sketchDrawStartPointVisible,
  )
  const sketchDrawStartPointSymbolSize = useUiPrefsStore(
    (state) => state.sketchDrawStartPointSymbolSize,
  )
  const sketchDrawStartPointSymbolType = useUiPrefsStore(
    (state) => state.sketchDrawStartPointSymbolType,
  )
  const sketchDrawPlinePointVisible = useUiPrefsStore(
    (state) => state.sketchDrawPlinePointVisible,
  )
  const sketchDrawPlinePointSymbolSize = useUiPrefsStore(
    (state) => state.sketchDrawPlinePointSymbolSize,
  )
  const sketchDrawPlinePointSymbolType = useUiPrefsStore(
    (state) => state.sketchDrawPlinePointSymbolType,
  )
  const activeGeometrySketchNode = useSpaghettiStore((state) => {
    const nodeId = state.geometrySketchSession?.nodeId
    if (nodeId === undefined) {
      return null
    }
    return state.graph.nodes.find(
      (node) => node.nodeId === nodeId && node.type === 'Geometry/Sketch',
    ) ?? null
  })

  const previewList = useMemo(
    () => {
      if (sharedViewerComposition !== null) {
        return selectSharedPreviewRenderVm(
          sharedViewerComposition.graphDocumentIds.map((graphDocumentId) => ({
            graphDocumentId,
            previewPreparation: graphRuntimeByDocumentId[graphDocumentId]?.previewPreparation ?? null,
            buildOutputs:
              selectShouldSuppressBrowserGraphRuntimeOutput(
                {
                  currentProject,
                  projectContent,
                  browserGraphBuildPolicyByGraphDocumentId,
                  browserContentBuildPolicyByRowId,
                },
                graphDocumentId,
              )
                ? []
                : graphRuntimeByDocumentId[graphDocumentId]?.acceptedPreviewBuildOutputs ?? [],
          })),
        )
      }
      if (viewerTargetPreviewPreparation === null) {
        return EMPTY_PREVIEW_LIST
      }
      return selectPreviewRenderVmFromPreparation(
        viewerTargetPreviewPreparation,
        viewerTargetGraphDocumentId !== null &&
          selectShouldSuppressBrowserGraphRuntimeOutput(
            {
              currentProject,
              projectContent,
              browserGraphBuildPolicyByGraphDocumentId,
              browserContentBuildPolicyByRowId,
            },
            viewerTargetGraphDocumentId,
          )
          ? []
          : viewerTargetBuildOutputs,
      )
    },
    [
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      currentProject,
      graphRuntimeByDocumentId,
      projectContent,
      sharedViewerComposition,
      viewerTargetGraphDocumentId,
      viewerTargetBuildOutputs,
      viewerTargetPreviewPreparation,
    ],
  )

  const geometrySketchOverlay = useMemo<GeometrySketchOverlayVm | null>(() => {
    if (geometrySketchSession === null || activeGeometrySketchNode === null) {
      return null
    }

    const sketchFeature = activeGeometrySketchNode.params.sketch as SketchFeature | undefined
    if (sketchFeature === undefined) {
      return null
    }

    const profiles = (sketchFeature.outputs.profiles ?? []).map((profile) => ({
      profileId: profile.profileId,
      vertices: profile.verticesProxy,
    }))
    const selectedProfileId =
      sketchFeature.uiState.selectedProfileId ??
      (profiles.length === 1 ? profiles[0].profileId : undefined)

    return {
      mode: geometrySketchSession.mode,
      plane: sketchFeature.plane ?? 'XY',
      planeTransform: {
        ...(sketchFeature.planeTransform ?? {
          offsetMm: 0,
          inPlaneRotationDeg: 0,
          translation: { x: 0, y: 0, z: 0 },
          rotationDeg: { x: 0, y: 0, z: 0 },
        }),
        translation: {
          ...(sketchFeature.planeTransform?.translation ?? { x: 0, y: 0, z: 0 }),
        },
        rotationDeg: {
          ...(sketchFeature.planeTransform?.rotationDeg ?? { x: 0, y: 0, z: 0 }),
        },
      },
      drawStage: geometrySketchSession.drawStage,
      activeTool: geometrySketchSession.activeTool,
      components: sketchFeature.components ?? [],
      profiles,
      selectedProfileId,
      drawDraft:
        geometrySketchSession.drawDraft === null
          ? null
          : {
              points: geometrySketchSession.drawDraft.points.map((point) => ({ ...point })),
              hoverPoint:
                geometrySketchSession.drawDraft.hoverPoint === null
                  ? null
                  : { ...geometrySketchSession.drawDraft.hoverPoint },
              hoverSnapTarget: geometrySketchSession.drawDraft.hoverSnapTarget,
            },
      selectedComponentIds: geometrySketchSession.selectedComponentIds,
      hoveredComponentId: geometrySketchSession.hoveredComponentId,
      selectionWindowDraft: geometrySketchSession.selectionWindowDraft,
      ui: {
        snapEnabled: sketchDrawSnapEnabled,
        snapDistancePx: sketchDrawSnapDistancePx,
        crosshairSize: sketchDrawCrosshairSize,
        startPointVisible: sketchDrawStartPointVisible,
        startPointSymbolSize: sketchDrawStartPointSymbolSize,
        startPointSymbolType: sketchDrawStartPointSymbolType,
        plinePointVisible: sketchDrawPlinePointVisible,
        plinePointSymbolSize: sketchDrawPlinePointSymbolSize,
        plinePointSymbolType: sketchDrawPlinePointSymbolType,
      },
    }
  }, [
    activeGeometrySketchNode,
    geometrySketchSession,
    sketchDrawCrosshairSize,
    sketchDrawSnapDistancePx,
    sketchDrawSnapEnabled,
    sketchDrawPlinePointSymbolSize,
    sketchDrawPlinePointSymbolType,
    sketchDrawPlinePointVisible,
    sketchDrawStartPointSymbolType,
    sketchDrawStartPointVisible,
    sketchDrawStartPointSymbolSize,
  ])

  const visibleGeometrySketchOverlays = useMemo<VisibleGeometrySketchOverlayVm[]>(() => {
    const contentRows = selectCurrentProjectContentBrowserRows({
      currentProject,
      projectContent,
      sketchVisibilityByRowId,
      graphRuntimeByDocumentId,
      graphDocumentsById,
    })

    return contentRows
      .filter((row): row is Extract<typeof contentRows[number], { kind: 'sketch' }> => row.kind === 'sketch')
      .filter((row) => row.isVisible)
      .filter((row) => geometrySketchSession === null || row.nodeId !== geometrySketchSession.nodeId)
      .map((row) => {
        const graphDocument = graphDocumentsById[row.graphDocumentId]
        const sketchNode =
          graphDocument?.graph.nodes.find(
            (node) => node.nodeId === row.nodeId && node.type === 'Geometry/Sketch',
          ) ?? null
        const sketchFeature = sketchNode?.params.sketch as SketchFeature | undefined
        if (sketchFeature === undefined) {
          return null
        }
        return {
          overlayId: row.rowId,
          plane: sketchFeature.plane ?? row.plane,
          planeTransform: {
            ...(sketchFeature.planeTransform ?? {
              offsetMm: 0,
              inPlaneRotationDeg: 0,
              translation: { x: 0, y: 0, z: 0 },
              rotationDeg: { x: 0, y: 0, z: 0 },
            }),
            translation: {
              ...(sketchFeature.planeTransform?.translation ?? { x: 0, y: 0, z: 0 }),
            },
            rotationDeg: {
              ...(sketchFeature.planeTransform?.rotationDeg ?? { x: 0, y: 0, z: 0 }),
            },
          },
          components: sketchFeature.components ?? [],
          profiles: (sketchFeature.outputs.profiles ?? []).map((profile) => ({
            profileId: profile.profileId,
            vertices: profile.verticesProxy,
          })),
        } satisfies VisibleGeometrySketchOverlayVm
      })
      .filter((overlay): overlay is VisibleGeometrySketchOverlayVm => overlay !== null)
  }, [
    currentProject,
    geometrySketchSession,
    graphDocumentsById,
    graphRuntimeByDocumentId,
    projectContent,
    sketchVisibilityByRowId,
  ])

  const sketchPlanePickOverlay = useMemo<SketchPlanePickOverlayVm | null>(() => {
    if (sketchPlanePickSession === null) {
      return null
    }
    return {
      stage: sketchPlanePickSession.stage,
      gizmoMode: sketchPlanePickSession.gizmoMode,
      draftPlane: sketchPlanePickSession.draftPlane,
      previewPlane: sketchPlanePickSession.previewPlane,
      draftTransform: {
        ...sketchPlanePickSession.draftTransform,
        translation: { ...sketchPlanePickSession.draftTransform.translation },
        rotationDeg: { ...sketchPlanePickSession.draftTransform.rotationDeg },
      },
      commandOriginTransform:
        sketchPlanePickSession.transformCommandOrigin === null
          ? null
          : {
              ...sketchPlanePickSession.transformCommandOrigin,
              translation: { ...sketchPlanePickSession.transformCommandOrigin.translation },
              rotationDeg: { ...sketchPlanePickSession.transformCommandOrigin.rotationDeg },
            },
      transformHistoryPoints: [
        { x: 0, y: 0, z: 0 },
        ...sketchPlanePickSession.transformHistory.map((entry) => ({
          x: entry.point.x,
          y: entry.point.y,
          z: entry.point.z,
        })),
      ],
      showMoveCommandGuide:
        sketchPlanePickSession.adjustScope === 'move' ||
        sketchPlanePickSession.adjustScope === 'move-axis',
      snap: {
        translateMm: sketchPlaneToolbarTranslateSnapEnabled
          ? sketchPlaneToolbarTranslateSnapValue
          : null,
        rotateDeg: sketchPlaneToolbarRotateSnapEnabled
          ? sketchPlaneToolbarRotateSnapValue
          : null,
      },
      ui: {
        ghostPlaneScale: sketchPlaneToolbarGhostPlaneScale,
        gizmoScale: sketchPlaneToolbarGizmoScale,
      },
    }
  }, [
    sketchPlanePickSession,
    sketchPlaneToolbarGhostPlaneScale,
    sketchPlaneToolbarGizmoScale,
    sketchPlaneToolbarRotateSnapEnabled,
    sketchPlaneToolbarRotateSnapValue,
    sketchPlaneToolbarTranslateSnapEnabled,
    sketchPlaneToolbarTranslateSnapValue,
  ])

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
    viewer.setOnSketchPlanePickPlaneSelect((plane) => {
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane(plane)
    })
    viewer.setOnSketchPlanePickTransformChange((transform) => {
      useSpaghettiStore.getState().setSketchPlanePickDraftTransform(transform)
    })
    viewer.setOnSketchPlanePickTransformCommit(() => {
      useSpaghettiStore.getState().commitSketchPlaneTransformHistoryFromDraftRelease()
    })
    viewer.setOnGeometrySketchHoverPoint((point, snapTarget) => {
      useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint(point, snapTarget)
    })
    viewer.setOnGeometrySketchConfirmPoint((point, snapTarget) => {
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint(point, snapTarget)
    })
    viewer.setOnGeometrySketchHoverComponent((rowId) => {
      useSpaghettiStore.getState().setGeometrySketchHoveredComponent(rowId)
    })
    viewer.setOnGeometrySketchSelectComponents((rowIds) => {
      useSpaghettiStore.getState().setGeometrySketchSelectedComponents(rowIds)
    })
    viewer.setOnGeometrySketchSelectionWindowDraftChange((draft) => {
      useSpaghettiStore.getState().setGeometrySketchSelectionWindowDraft(draft ?? null)
    })
    viewer.setOnGeometrySketchDeleteSelection(() => {
      useSpaghettiStore.getState().deleteGeometrySketchSelectedComponents()
    })
    viewer.setOnGeometrySketchFinishDraft(() => {
      useSpaghettiStore.getState().finishGeometrySketchDrawDraft()
    })
    viewer.setOnGeometrySketchCancelDraft(() => {
      useSpaghettiStore.getState().cancelGeometrySketchDrawDraft()
    })

    return () => {
      viewer.setOnReferenceTransformChange(null)
      viewer.setOnReferenceTransformExit(null)
      viewer.setOnReferenceTransformModeChange(null)
      viewer.setOnReferenceTransformSpaceChange(null)
      viewer.setOnSketchPlanePickPlaneSelect(null)
      viewer.setOnSketchPlanePickTransformChange(null)
      viewer.setOnSketchPlanePickTransformCommit(null)
      viewer.setOnGeometrySketchHoverPoint(null)
      viewer.setOnGeometrySketchConfirmPoint(null)
      viewer.setOnGeometrySketchHoverComponent(null)
      viewer.setOnGeometrySketchSelectComponents(null)
      viewer.setOnGeometrySketchSelectionWindowDraftChange(null)
      viewer.setOnGeometrySketchDeleteSelection(null)
      viewer.setOnGeometrySketchFinishDraft(null)
      viewer.setOnGeometrySketchCancelDraft(null)
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

  useEffect(() => {
    viewerRef.current?.setGeometrySketchOverlay(geometrySketchOverlay)
  }, [geometrySketchOverlay])

  useEffect(() => {
    viewerRef.current?.setVisibleGeometrySketchOverlays(visibleGeometrySketchOverlays)
  }, [visibleGeometrySketchOverlays])

  useEffect(() => {
    viewerRef.current?.setSketchPlanePickOverlay(sketchPlanePickOverlay)
  }, [sketchPlanePickOverlay])

  return (
    <div className="ViewportRoot">
      <div className="ViewportCanvasLayer" ref={mountRef} />
    </div>
  )
}
