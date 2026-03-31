import { useEffect, useMemo, useRef, useState } from 'react'
import { appendConsoleEntry } from '../console/useConsoleStore'
import {
  setViewer,
  type GeometrySketchOverlayVm,
  type ViewerTransformHistoryOverlayVm,
  type ViewerTransformTarget,
  type ReferenceTransformHistoryVec3Vm,
  type SketchPlanePickOverlayVm,
  type VisibleGeometrySketchOverlayVm,
} from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import {
  buildImportedReferenceRowId,
  DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
  getReferenceTransformHistoryEntriesThroughScrubIndex,
  resolveReferenceRuntimeTraits,
  resolveReferenceIdsForWorkspaceTarget,
  selectActiveViewerTransformHistoryEntries,
  selectActiveViewerTransformSession,
  selectActiveViewerTransformTarget,
  selectCurrentProjectContentBrowserRows,
  type ReferenceTransformHistoryEntry,
  selectShouldSuppressBrowserGraphRuntimeOutput,
  selectReferenceWorkspaceItems,
  useAppStore,
} from '../store/useAppStore'
import type { WorkspaceSelectedTarget } from '../store/useAppStore'
import {
  clearWorkspaceTargetSelection,
  commitWorkspaceExplicitSelection,
  commitWorkspaceTargetSelection,
} from '../store/workspaceSelectionCommands'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import type { WorkspaceViewportId } from '../workspace/workspaceShellTypes'
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

const scaleSnapValuesFromDriver = (
  values: { x: number; y: number; z: number },
  nextDriverValue: number,
): { x: number; y: number; z: number } => {
  if (Math.abs(values.x) < 0.000001) {
    return {
      x: nextDriverValue,
      y: values.y,
      z: values.z,
    }
  }
  const scaleFactor = nextDriverValue / values.x
  return {
    x: nextDriverValue,
    y: Math.abs(values.y) < 0.000001 ? 0 : Number((values.y * scaleFactor).toFixed(4)),
    z: Math.abs(values.z) < 0.000001 ? 0 : Number((values.z * scaleFactor).toFixed(4)),
  }
}

const getWorkspaceTargetKey = (target: WorkspaceSelectedTarget): string => {
  switch (target.kind) {
    case 'references-root':
      return 'references-root'
    case 'reference-category':
      return `reference-category:${target.categoryId}`
    case 'reference-item':
      return `reference-item:${target.referenceId}`
    case 'assembly':
      return `assembly:${target.assemblyId}`
    case 'component':
      return `component:${target.componentId}`
    case 'object':
      return `object:${target.objectId}`
    case 'graph-document':
      return `graph-document:${target.graphDocumentId}`
    case 'graph-node':
      return `graph-node:${target.graphDocumentId}:${target.nodeId}`
    case 'part':
      return `part:${target.partKey}`
  }
}

const cloneHistoryVec3 = (value: ReferenceTransformHistoryVec3Vm): ReferenceTransformHistoryVec3Vm => ({
  x: value.x,
  y: value.y,
  z: value.z,
})

const buildReferenceTransformIdentity = () => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const buildViewerTransformHistoryOverlayVm = (
  target: ViewerTransformTarget,
  entries: readonly ReferenceTransformHistoryEntry[],
): ViewerTransformHistoryOverlayVm | null => {
  if (entries.length === 0) {
    return null
  }

  const movePoints: ReferenceTransformHistoryVec3Vm[] = [{ x: 0, y: 0, z: 0 }]
  const rotateEntries: ViewerTransformHistoryOverlayVm['rotateEntries'] = []
  const scaleEntries: ViewerTransformHistoryOverlayVm['scaleEntries'] = []

  entries.forEach((entry, index) => {
    const previousTransform =
      index === 0
        ? buildReferenceTransformIdentity()
        : entries[index - 1]!.transformAfter
    if (entry.kind === 'move') {
      movePoints.push(cloneHistoryVec3(entry.transformAfter.position))
      return
    }
    if (entry.kind === 'rotate') {
      rotateEntries.push({
        entryId: entry.entryId,
        position: cloneHistoryVec3(entry.transformAfter.position),
        beforeRotationDeg: cloneHistoryVec3(previousTransform.rotationDeg),
        afterRotationDeg: cloneHistoryVec3(entry.transformAfter.rotationDeg),
      })
      return
    }
    scaleEntries.push({
      entryId: entry.entryId,
      position: cloneHistoryVec3(entry.transformAfter.position),
      rotationDeg: cloneHistoryVec3(entry.transformAfter.rotationDeg),
      beforeScale: cloneHistoryVec3(previousTransform.scale),
      afterScale: cloneHistoryVec3(entry.transformAfter.scale),
    })
  })

  return {
    target,
    movePoints,
    rotateEntries,
    scaleEntries,
  }
}

type ViewerHostProps = {
  viewportId: WorkspaceViewportId
}

export function ViewerHost(props: ViewerHostProps) {
  const { viewportId } = props
  const mountRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const isMountedRef = useRef(false)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection.selectedTarget)
  const workspaceExplicitSelectedTargets = useAppStore(
    (state) => state.workspaceSelection.explicitSelectedTargets,
  )
  const workspaceResolvedContentSelection = useAppStore(
    (state) => state.workspaceSelection.resolvedContentSelection,
  )
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
  const markReferenceBatchItemStarted = useAppStore((state) => state.markReferenceBatchItemStarted)
  const markReferenceBatchItemCompleted = useAppStore((state) => state.markReferenceBatchItemCompleted)
  const setReferenceItemLoadState = useAppStore((state) => state.setReferenceItemLoadState)
  const setReferenceItemPartRows = useAppStore((state) => state.setReferenceItemPartRows)
  const setReferenceItemVisibility = useAppStore((state) => state.setReferenceItemVisibility)
  const graphRuntimeByDocumentId = useSpaghettiStore((state) => state.graphRuntimeByDocumentId)
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession)
  const geometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const viewerTargetGraphDocumentId = useSpaghettiStore((state) => state.viewerTargetGraphDocumentId)
  const viewerTargetPreviewPreparation = useSpaghettiStore(selectViewerTargetGraphPreviewPreparation)
  const viewerTargetBuildOutputs = useSpaghettiStore(selectViewerTargetGraphAcceptedPreviewBuildOutputs)
  const globalView = useUiPrefsStore((state) => state.view)
  const viewportLocalViewState = useWorkspaceStore(
    (state) => state.viewportChromeById[viewportId]?.localViewState ?? null,
  )
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

  const view = useMemo(
    () => ({
      ...globalView,
      projectionMode: viewportLocalViewState?.projectionMode ?? globalView.projectionMode,
      axisOverlayEnabled:
        viewportLocalViewState?.axisOverlayEnabled ?? globalView.axisOverlayEnabled,
    }),
    [globalView, viewportId, viewportLocalViewState],
  )

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

  const projectContentRows = useMemo(
    () =>
      selectCurrentProjectContentBrowserRows({
        currentProject,
        projectContent,
        partsVisibility,
        sketchVisibilityByRowId,
        graphRuntimeByDocumentId,
        graphDocumentsById,
      }),
    [
      currentProject,
      graphDocumentsById,
      graphRuntimeByDocumentId,
      partsVisibility,
      projectContent,
      sketchVisibilityByRowId,
    ],
  )

  const contentObjectRowByViewerPartKey = useMemo(() => {
    const nextRowsByViewerPartKey = new Map<
      string,
      Extract<(typeof projectContentRows)[number], { kind: 'object' }>
    >()
    for (const row of projectContentRows) {
      if (row.kind !== 'object') {
        continue
      }
      for (const partKey of row.visibilityPartKeys ?? []) {
        if (!nextRowsByViewerPartKey.has(partKey)) {
          nextRowsByViewerPartKey.set(partKey, row)
        }
      }
    }
    return nextRowsByViewerPartKey
  }, [projectContentRows])

  const highlightedPartKeys = useMemo(() => {
    type HighlightableContentRow = Extract<
      (typeof projectContentRows)[number],
      { kind: 'assembly' | 'component' | 'object' }
    >
    const activeViewerPartKeys = new Set(previewList.viewerParts.map((part) => part.viewerKey))
    const filterActiveKeys = (keys: readonly string[]) =>
      keys.filter((key) => activeViewerPartKeys.has(key))

    if (workspaceResolvedContentSelection != null) {
      return filterActiveKeys(workspaceResolvedContentSelection.partKeys)
    }
    if (workspaceSelectedTarget === null) {
      return selectedPartKey === null ? [] : filterActiveKeys([selectedPartKey])
    }
    if (workspaceSelectedTarget.kind === 'part') {
      return filterActiveKeys([workspaceSelectedTarget.partKey])
    }
    if (
      workspaceSelectedTarget.kind === 'assembly' ||
      workspaceSelectedTarget.kind === 'component' ||
      workspaceSelectedTarget.kind === 'object'
    ) {
      const targetRowId =
        workspaceSelectedTarget.kind === 'assembly'
          ? workspaceSelectedTarget.assemblyId
          : workspaceSelectedTarget.kind === 'component'
            ? workspaceSelectedTarget.componentId
            : workspaceSelectedTarget.objectId
      const contentRow = projectContentRows.find(
        (row): row is HighlightableContentRow =>
          (row.kind === 'assembly' || row.kind === 'component' || row.kind === 'object') &&
          row.rowId === targetRowId,
      )
      if (contentRow !== undefined) {
        const keys = filterActiveKeys(contentRow.visibilityPartKeys ?? [])
        if (keys.length > 0) {
          return keys
        }
      }
    }
    return selectedPartKey === null ? [] : filterActiveKeys([selectedPartKey])
  }, [
    previewList.viewerParts,
    projectContentRows,
    selectedPartKey,
    workspaceResolvedContentSelection,
    workspaceSelectedTarget,
  ])

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
    return projectContentRows
      .filter(
        (row): row is Extract<(typeof projectContentRows)[number], { kind: 'sketch' }> =>
          row.kind === 'sketch',
      )
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
    geometrySketchSession,
    graphDocumentsById,
    projectContentRows,
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
  const referenceWorkspaceItemById = useMemo(
    () => new Map(referenceWorkspaceItems.map((item) => [item.referenceId, item] as const)),
    [referenceWorkspaceItems],
  )
  const highlightedReferenceIds = useMemo(() => {
    const highlightedReferenceIdSet = new Set<string>()
    const explicitWorkspaceTargets = workspaceExplicitSelectedTargets ?? []
    const explicitTargets =
      explicitWorkspaceTargets.length > 0
        ? explicitWorkspaceTargets
        : workspaceSelectedTarget === null
          ? []
          : [workspaceSelectedTarget]

    for (const target of explicitTargets) {
      resolveReferenceIdsForWorkspaceTarget({ projectContent, referenceWorkspace }, target).forEach(
        (referenceId) => highlightedReferenceIdSet.add(referenceId),
      )
    }

    return [...highlightedReferenceIdSet].filter((referenceId) =>
      referenceWorkspaceItems.some((item) => item.referenceId === referenceId),
    )
  }, [
    projectContent,
    referenceWorkspace,
    referenceWorkspaceItems,
    workspaceExplicitSelectedTargets,
    workspaceSelectedTarget,
  ])
  const [timelineNowMs, setTimelineNowMs] = useState(() => performance.now())
  const previousReferenceIdsRef = useRef<string[]>([])
  const activeViewerTransformSession = useMemo(() => {
    const activeSession = selectActiveViewerTransformSession(referenceWorkspace)
    if (activeSession === null) {
      return null
    }
    return {
      targetKind: activeSession.targetKind,
      targetId: activeSession.targetId,
      mode: activeSession.mode,
      space: activeSession.space,
      entryOrigin: activeSession.entryOrigin,
    }
  }, [referenceWorkspace])
  const contentObjectTransformGroups = useMemo(
    () =>
      projectContentRows
        .filter(
          (
            row,
          ): row is Extract<(typeof projectContentRows)[number], { kind: 'object' }> =>
            row.kind === 'object' &&
            row.objectSourceKind === 'published-object' &&
            (row.visibilityPartKeys?.length ?? 0) > 0,
        )
        .map((row) => ({
          objectId: row.rowId,
          partKeys: [...new Set(row.visibilityPartKeys ?? [])],
        })),
    [projectContentRows],
  )
  const activeViewerTransformHistoryOverlay = useMemo<ViewerTransformHistoryOverlayVm | null>(() => {
    const activeTarget = selectActiveViewerTransformTarget(referenceWorkspace)
    const activeSession = selectActiveViewerTransformSession(referenceWorkspace)
    if (activeTarget === null || activeSession === null) {
      return null
    }
    const currentEntries = selectActiveViewerTransformHistoryEntries(referenceWorkspace)
    return buildViewerTransformHistoryOverlayVm(
      activeTarget,
      getReferenceTransformHistoryEntriesThroughScrubIndex(
        currentEntries,
        activeSession?.historyScrubIndex ?? currentEntries.length,
      ),
    )
  }, [referenceWorkspace])
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
      const baseTransformOverride =
        referenceWorkspace.activeReferenceTransformSession?.referenceId === item.referenceId
          ? referenceWorkspace.activeReferenceTransformSession.draftTransform
          : item.transformOverride ?? null
      const evaluatedTransformOverride = evaluateReferenceTransformOverrideWithTimelines(
        baseTransformOverride,
        timelineNowMs,
        (channel) => getChannelMode(item.referenceId, channel),
        (channel) => getChannelConfig(item.referenceId, channel),
        (channel) => getChannelRange(item.referenceId, channel),
      )
      const baseTransformSnap =
        referenceWorkspace.transformSnapByReferenceId[item.referenceId] ??
        DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
      const evaluatedTransformSnap = {
        ...baseTransformSnap,
        translate: {
          ...baseTransformSnap.translate,
          values: { ...baseTransformSnap.translate.values },
        },
        scale: {
          ...baseTransformSnap.scale,
          values: { ...baseTransformSnap.scale.values },
        },
        rotate: {
          ...baseTransformSnap.rotate,
          values:
            getChannelMode(item.referenceId, 'rotate-snap') === 'timeline' &&
            baseTransformSnap.rotate.xyzLocked
              ? scaleSnapValuesFromDriver(
                  baseTransformSnap.rotate.values,
                  evaluateReferenceTimelineChannelValue(
                    getChannelMode(item.referenceId, 'rotate-snap'),
                    getChannelConfig(item.referenceId, 'rotate-snap'),
                    baseTransformSnap.rotate.values.x,
                    getChannelRange(item.referenceId, 'rotate-snap'),
                    timelineNowMs,
                  ),
                )
              : { ...baseTransformSnap.rotate.values },
        },
      }
      return {
        ...item,
        evaluatedTransformOverride,
        evaluatedTransformSnap,
      }
    })
  }, [
    referenceWorkspace.channelClampRangeByReferenceId,
    referenceWorkspace.activeReferenceTransformSession,
    referenceWorkspace.transformSnapByReferenceId,
    referenceWorkspace.timelineConfigByReferenceId,
    referenceWorkspace.timelineModeByReferenceId,
    referenceWorkspaceItems,
    timelineNowMs,
  ])

  const activeContentObjectTransformSnap = useMemo(() => {
    const activeObjectId = referenceWorkspace.activeContentObjectTransformSession?.objectId ?? null
    if (activeObjectId === null) {
      return null
    }
    return (
      referenceWorkspace.transformSnapByObjectId[activeObjectId] ??
      DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
    )
  }, [
    referenceWorkspace.activeContentObjectTransformSession,
    referenceWorkspace.transformSnapByObjectId,
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
    setViewer(viewportId, viewer)

    return () => {
      isMountedRef.current = false
      viewer.dispose()
      viewerRef.current = null
      setViewer(viewportId, null)
    }
  }, [viewportId])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    viewer.setContentObjectTransformGroups(contentObjectTransformGroups)
  }, [contentObjectTransformGroups])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

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
    viewerRef.current?.setHighlightedPartKeys(highlightedPartKeys)
  }, [highlightedPartKeys])

  useEffect(() => {
    viewerRef.current?.setHighlightedReferenceIds(highlightedReferenceIds)
  }, [highlightedReferenceIds])

  useEffect(() => {
    viewerRef.current?.applyViewSettings(view)
  }, [view])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    viewer.setOnViewerTransformChange((target, transformOverride) => {
      const store = useAppStore.getState()
      const activeSession = selectActiveViewerTransformSession(store.referenceWorkspace)
      if (activeSession === null) {
        return
      }
      if (
        (target.kind === 'reference' &&
          (activeSession.targetKind !== 'reference' ||
            activeSession.targetId !== target.referenceId)) ||
        (target.kind === 'content-object' &&
          (activeSession.targetKind !== 'content-object' ||
            activeSession.targetId !== target.objectId))
      ) {
        return
      }
      store.setActiveViewerTransformDraft(transformOverride)
    })
    viewer.setOnViewerTransformCommit(() => {
      useAppStore.getState().commitActiveViewerTransformEntry()
    })
    viewer.setOnViewerTransformExit(() => {
      useAppStore.getState().exitActiveViewerTransformShell()
    })
    viewer.setOnViewerTransformHandleChange((handle) => {
      const store = useAppStore.getState()
      const activeSession = selectActiveViewerTransformSession(store.referenceWorkspace)
      if (handle !== null && activeSession !== null) {
        const nextMode =
          handle.mode === 'translate'
            ? 'translate'
            : handle.mode === 'rotate'
              ? 'rotate'
              : 'scale'
        if (!activeSession.entryActive || activeSession.mode !== nextMode) {
          store.beginActiveViewerTransformEntry(nextMode)
        }
      }
      store.setActiveViewerTransformHandle(handle)
    })
    viewer.setOnViewerTransformModeChange((mode) => {
      useAppStore.getState().beginActiveViewerTransformEntry(mode)
    })
    viewer.setOnViewerTransformSpaceChange((space) => {
      useAppStore.getState().setActiveViewerTransformSpace(space)
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
    viewer.setOnWorkspaceSelectionPick(({ picks, ctrlKey }) => {
      const appState = useAppStore.getState()
      appState.setActiveSurface('viewer')
      const selectionTargetEntries = (() => {
        const entries = new Map<
          string,
          {
            target: WorkspaceSelectedTarget
            selectedPartKey: string | null
          }
        >()
        for (const pick of picks) {
          const entry =
            pick.kind === 'reference-item'
              ? {
                  target: {
                    kind: 'object',
                    objectId: buildImportedReferenceRowId(pick.referenceId),
                  } satisfies WorkspaceSelectedTarget,
                  selectedPartKey: null,
                }
              : (() => {
                  const objectRow = contentObjectRowByViewerPartKey.get(pick.partKey)
                  if (objectRow !== undefined) {
                    return {
                      target: {
                        kind: 'object',
                        objectId: objectRow.rowId,
                      } satisfies WorkspaceSelectedTarget,
                      selectedPartKey: pick.partKey,
                    }
                  }
                  return {
                    target: {
                      kind: 'part',
                      partKey: pick.partKey,
                    } satisfies WorkspaceSelectedTarget,
                    selectedPartKey: pick.partKey,
                  }
                })()
          const key = getWorkspaceTargetKey(entry.target)
          if (entries.has(key)) {
            entries.delete(key)
          }
          entries.set(key, entry)
        }
        return [...entries.values()]
      })()
      const resolveSelectedPartKeyForTarget = (
        target: WorkspaceSelectedTarget | null,
        fallbackSelectedPartKey: string | null = null,
      ): string | null => {
        if (target === null) {
          return null
        }
        if (target.kind === 'part') {
          return target.partKey
        }
        if (target.kind === 'object') {
          if (fallbackSelectedPartKey !== null) {
            return fallbackSelectedPartKey
          }
          return appState.projectContent.objectsById[target.objectId]?.slotId ?? null
        }
        return null
      }
      const commitExplicitSelection = (
        explicitSelectedTargets: WorkspaceSelectedTarget[],
        selectedTarget: WorkspaceSelectedTarget | null,
        selectionAnchorTarget: WorkspaceSelectedTarget | null,
        selectedPartKey: string | null,
      ) => {
        commitWorkspaceExplicitSelection(
          {
            setWorkspaceExplicitSelection: appState.setWorkspaceExplicitSelection,
            selectPart: appState.selectPart,
            requestConsoleContextSync: appState.requestConsoleContextSync,
          },
          {
            selectedTarget,
            explicitSelectedTargets,
            selectionAnchorTarget,
          },
          {
            selectedPartKey,
          },
        )
      }

      if (selectionTargetEntries.length === 0) {
        clearWorkspaceTargetSelection(
          {
            setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
            selectPart: appState.selectPart,
            requestConsoleContextSync: appState.requestConsoleContextSync,
          },
          {
            syncReason: 'surface-clear',
          },
        )
        return
      }

      if (
        selectionTargetEntries.length === 1 &&
        selectionTargetEntries[0]!.target.kind === 'part'
      ) {
        const singlePartSelection = selectionTargetEntries[0]!
        commitWorkspaceTargetSelection(
          {
            setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
            selectPart: appState.selectPart,
            requestConsoleContextSync: appState.requestConsoleContextSync,
          },
          singlePartSelection.target,
          {
            selectedPartKey: singlePartSelection.selectedPartKey,
          },
        )
        return
      }

      if (!ctrlKey) {
        const primarySelection = selectionTargetEntries.at(-1) ?? null
        commitExplicitSelection(
          selectionTargetEntries.map((entry) => entry.target),
          primarySelection?.target ?? null,
          primarySelection?.target ?? null,
          resolveSelectedPartKeyForTarget(
            primarySelection?.target ?? null,
            primarySelection?.selectedPartKey ?? null,
          ),
        )
        return
      }

      const currentExplicitTargets =
        appState.workspaceSelection.explicitSelectedTargets.length > 0
          ? [...appState.workspaceSelection.explicitSelectedTargets]
          : appState.workspaceSelection.selectedTarget !== null
            ? [appState.workspaceSelection.selectedTarget]
            : []
      const currentSelectedTarget = appState.workspaceSelection.selectedTarget
      const nextExplicitTargets = [...currentExplicitTargets]
      let lastToggledTarget: WorkspaceSelectedTarget | null = null
      let lastAddedTarget: WorkspaceSelectedTarget | null = null

      for (const entry of selectionTargetEntries) {
        lastToggledTarget = entry.target
        const existingIndex = nextExplicitTargets.findIndex(
          (target) => getWorkspaceTargetKey(target) === getWorkspaceTargetKey(entry.target),
        )
        if (existingIndex === -1) {
          nextExplicitTargets.push(entry.target)
          lastAddedTarget = entry.target
          continue
        }
        nextExplicitTargets.splice(existingIndex, 1)
      }

      if (nextExplicitTargets.length === 0) {
        commitExplicitSelection([], null, lastToggledTarget, null)
        return
      }

      const nextPrimaryTarget =
        currentSelectedTarget !== null &&
        nextExplicitTargets.some(
          (target) => getWorkspaceTargetKey(target) === getWorkspaceTargetKey(currentSelectedTarget),
        )
          ? currentSelectedTarget
          : lastAddedTarget !== null &&
              nextExplicitTargets.some(
                (target) => getWorkspaceTargetKey(target) === getWorkspaceTargetKey(lastAddedTarget),
              )
            ? lastAddedTarget
            : nextExplicitTargets.at(-1) ?? null
      const primarySelectionEntry =
        selectionTargetEntries.find(
          (entry) =>
            nextPrimaryTarget !== null &&
            getWorkspaceTargetKey(entry.target) === getWorkspaceTargetKey(nextPrimaryTarget),
        ) ?? null

      commitExplicitSelection(
        nextExplicitTargets,
        nextPrimaryTarget,
        lastToggledTarget,
        resolveSelectedPartKeyForTarget(
          nextPrimaryTarget,
          primarySelectionEntry?.selectedPartKey ??
            (currentSelectedTarget !== null &&
            nextPrimaryTarget !== null &&
            getWorkspaceTargetKey(currentSelectedTarget) === getWorkspaceTargetKey(nextPrimaryTarget)
              ? appState.selectedPartKey
              : null),
        ),
      )
    })

    return () => {
      viewer.setOnViewerTransformChange(null)
      viewer.setOnViewerTransformCommit(null)
      viewer.setOnViewerTransformExit(null)
      viewer.setOnViewerTransformHandleChange(null)
      viewer.setOnViewerTransformModeChange(null)
      viewer.setOnViewerTransformSpaceChange(null)
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
      viewer.setOnWorkspaceSelectionPick(null)
    }
  }, [
    contentObjectRowByViewerPartKey,
  ])

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
  }, [referenceWorkspaceItems])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null) {
      return
    }

    referenceWorkspaceItems.forEach((item) => {
      if (!item.isVisible) {
        viewer.setReferenceVisible(item.referenceId, false)
        return
      }
      if (item.loadState === 'loaded') {
        viewer.setReferenceVisible(item.referenceId, true)
      }
    })
  }, [referenceWorkspaceItems])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer === null || referenceWorkspace.referenceLoadBatch !== null) {
      return
    }

    const syncReferences = async () => {
      for (const item of referenceWorkspaceItems) {
        if (useAppStore.getState().referenceWorkspace.referenceLoadBatch !== null) {
          return
        }
        if (
          !item.isVisible ||
          (item.loadState !== 'unloaded' && item.loadState !== 'error')
        ) {
          continue
        }
        setReferenceItemLoadState(item.referenceId, 'loading')
        try {
          await viewer.ensureReferenceLoaded(item)
          if (!isMountedRef.current || viewerRef.current !== viewer) {
            return
          }
          setReferenceItemLoadState(item.referenceId, 'loaded')
          setReferenceItemPartRows(item.referenceId, viewer.getReferencePartDescriptors(item.referenceId))
          appendConsoleEntry({
            layer: 'Browser',
            text: `Loaded Model: ${item.label}`,
            source: item.referenceId,
            severity: 'info',
          })
          if (resolveReferenceRuntimeTraits(useAppStore.getState(), item.referenceId).isVisible) {
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
  }, [
    referenceWorkspace.referenceLoadBatch,
    referenceWorkspaceItems,
    setReferenceItemPartRows,
    setReferenceItemLoadState,
    setReferenceItemVisibility,
  ])

  useEffect(() => {
    const viewer = viewerRef.current
    const referenceLoadBatch = referenceWorkspace.referenceLoadBatch
    if (viewer === null || referenceLoadBatch === null) {
      return
    }
    if (referenceLoadBatch.activeReferenceId !== null) {
      return
    }

    const nextReferenceId = referenceLoadBatch.remainingIds[0] ?? null
    if (nextReferenceId === null) {
      return
    }
    const nextItem = referenceWorkspaceItemById.get(nextReferenceId) ?? null
    if (nextItem === null) {
      markReferenceBatchItemCompleted(nextReferenceId, referenceLoadBatch.requestId, 'error')
      return
    }

    const runBatchLoad = async () => {
      markReferenceBatchItemStarted(nextReferenceId, referenceLoadBatch.requestId)
      setReferenceItemLoadState(nextReferenceId, 'loading')
      try {
        await viewer.ensureReferenceLoaded(nextItem)
        if (!isMountedRef.current || viewerRef.current !== viewer) {
          return
        }
        setReferenceItemLoadState(nextReferenceId, 'loaded')
        setReferenceItemPartRows(nextReferenceId, viewer.getReferencePartDescriptors(nextReferenceId))
        appendConsoleEntry({
          layer: 'Browser',
          text: `Loaded Model: ${nextItem.label}`,
          source: nextReferenceId,
          severity: 'info',
        })
        if (resolveReferenceRuntimeTraits(useAppStore.getState(), nextReferenceId).isVisible) {
          viewer.setReferenceVisible(nextReferenceId, true)
        }
        markReferenceBatchItemCompleted(nextReferenceId, referenceLoadBatch.requestId, 'loaded')
      } catch (error) {
        if (!isMountedRef.current || viewerRef.current !== viewer) {
          return
        }
        const message =
          error instanceof Error ? error.message : 'Failed to load reference asset.'
        setReferenceItemLoadState(nextReferenceId, 'error', message)
        setReferenceItemVisibility(nextReferenceId, false)
        viewer.setReferenceVisible(nextReferenceId, false)
        markReferenceBatchItemCompleted(nextReferenceId, referenceLoadBatch.requestId, 'error')
      }
    }

    void runBatchLoad()
  }, [
    markReferenceBatchItemCompleted,
    markReferenceBatchItemStarted,
    referenceWorkspace.referenceLoadBatch,
    referenceWorkspaceItemById,
    setReferenceItemPartRows,
    setReferenceItemLoadState,
    setReferenceItemVisibility,
  ])

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
    const activeReferenceId = referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
    if (activeReferenceId !== null) {
      const activeReferenceItem =
        evaluatedReferenceItems.find((item) => item.referenceId === activeReferenceId) ?? null
      viewer.setGizmoSnap({
        translate:
          activeReferenceItem?.evaluatedTransformSnap.translate.enabled === true
            ? activeReferenceItem.evaluatedTransformSnap.translate.values
            : undefined,
        rotate:
          activeReferenceItem?.evaluatedTransformSnap.rotate.enabled === true
            ? activeReferenceItem.evaluatedTransformSnap.rotate.values
            : undefined,
        scale:
          activeReferenceItem?.evaluatedTransformSnap.scale.enabled === true
            ? activeReferenceItem.evaluatedTransformSnap.scale.values
            : undefined,
      })
      return
    }
    if (activeContentObjectTransformSnap !== null) {
      viewer.setGizmoSnap({
        translate:
          activeContentObjectTransformSnap.translate.enabled === true
            ? activeContentObjectTransformSnap.translate.values
            : undefined,
        rotate:
          activeContentObjectTransformSnap.rotate.enabled === true
            ? activeContentObjectTransformSnap.rotate.values
            : undefined,
        scale:
          activeContentObjectTransformSnap.scale.enabled === true
            ? activeContentObjectTransformSnap.scale.values
            : undefined,
      })
      return
    }
    viewer.setGizmoSnap({})
  }, [
    activeContentObjectTransformSnap,
    evaluatedReferenceItems,
    referenceWorkspace.activeReferenceTransformSession,
  ])

  useEffect(() => {
    viewerRef.current?.setViewerTransformSession(activeViewerTransformSession)
  }, [activeViewerTransformSession])

  useEffect(() => {
    viewerRef.current?.setContentObjectTransformOverrides(
      referenceWorkspace.contentObjectTransformOverrideById,
    )
  }, [referenceWorkspace.contentObjectTransformOverrideById])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformMoveSnapDotsEnabled(
      referenceWorkspace.moveSnapDotsEnabled,
    )
  }, [referenceWorkspace.moveSnapDotsEnabled])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformPreviewLastMoveSnapDotsEnabled(
      referenceWorkspace.previewLastMoveSnapDotsEnabled,
    )
  }, [referenceWorkspace.previewLastMoveSnapDotsEnabled])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformMoveSnapDotScale(
      referenceWorkspace.moveSnapDotScale,
    )
  }, [referenceWorkspace.moveSnapDotScale])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformMoveSnapDotDelayMs(
      referenceWorkspace.moveSnapDotDelayMs,
    )
  }, [referenceWorkspace.moveSnapDotDelayMs])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformMoveSnapDotNearScale(
      referenceWorkspace.moveSnapDotNearScale,
    )
  }, [referenceWorkspace.moveSnapDotNearScale])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformMoveSnapDotFarScale(
      referenceWorkspace.moveSnapDotFarScale,
    )
  }, [referenceWorkspace.moveSnapDotFarScale])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformMoveSnapDotVisibleRadiusMultiplier(
      referenceWorkspace.moveSnapDotVisibleRadiusMultiplier,
    )
  }, [referenceWorkspace.moveSnapDotVisibleRadiusMultiplier])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformRotateSnapPreviewEnabled(
      referenceWorkspace.rotateSnapPreviewEnabled,
    )
  }, [referenceWorkspace.rotateSnapPreviewEnabled])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformRotateSnapPreviewLineSize(
      referenceWorkspace.rotateSnapPreviewLineSize,
    )
  }, [referenceWorkspace.rotateSnapPreviewLineSize])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformRotateSnapPreviewLineThickness(
      referenceWorkspace.rotateSnapPreviewLineThickness,
    )
  }, [referenceWorkspace.rotateSnapPreviewLineThickness])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformRotateSnapPreviewRadiusDeg(
      referenceWorkspace.rotateSnapPreviewRadiusDeg,
    )
  }, [referenceWorkspace.rotateSnapPreviewRadiusDeg])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformRotateSnapPreviewDelayMs(
      referenceWorkspace.rotateSnapPreviewDelayMs,
    )
  }, [referenceWorkspace.rotateSnapPreviewDelayMs])

  useEffect(() => {
    viewerRef.current?.setViewerTransformHistoryOverlay(activeViewerTransformHistoryOverlay)
  }, [activeViewerTransformHistoryOverlay])

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
