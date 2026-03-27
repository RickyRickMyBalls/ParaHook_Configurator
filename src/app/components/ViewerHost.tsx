import { useEffect, useMemo, useRef, useState } from 'react'
import { appendConsoleEntry } from '../console/useConsoleStore'
import {
  setViewer,
  type GeometrySketchOverlayVm,
  type ReferenceTransformHistoryOverlayVm,
  type ReferenceTransformHistoryVec3Vm,
  type SketchPlanePickOverlayVm,
  type VisibleGeometrySketchOverlayVm,
} from '../viewerBridge'
import { Viewer } from '../../viewer/Viewer'
import {
  DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
  getReferenceTransformHistoryEntriesThroughScrubIndex,
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

const isExplicitSelectionTarget = (
  target: WorkspaceSelectedTarget | null,
): target is Extract<
  WorkspaceSelectedTarget,
  | { kind: 'references-root' }
  | { kind: 'reference-category' }
  | { kind: 'reference-item' }
  | { kind: 'assembly' }
  | { kind: 'component' }
  | { kind: 'object' }
> =>
  target !== null &&
  (target.kind === 'references-root' ||
    target.kind === 'reference-category' ||
    target.kind === 'reference-item' ||
    target.kind === 'assembly' ||
    target.kind === 'component' ||
    target.kind === 'object')

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

const buildReferenceTransformHistoryOverlayVm = (
  referenceId: string,
  entries: readonly ReferenceTransformHistoryEntry[],
): ReferenceTransformHistoryOverlayVm | null => {
  if (entries.length === 0) {
    return null
  }

  const movePoints: ReferenceTransformHistoryVec3Vm[] = [{ x: 0, y: 0, z: 0 }]
  const rotateEntries: ReferenceTransformHistoryOverlayVm['rotateEntries'] = []
  const scaleEntries: ReferenceTransformHistoryOverlayVm['scaleEntries'] = []

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
    referenceId,
    movePoints,
    rotateEntries,
    scaleEntries,
  }
}

export function ViewerHost() {
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
  const setReferenceItemVisibility = useAppStore((state) => state.setReferenceItemVisibility)
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
      if (target.kind === 'references-root') {
        referenceWorkspaceItems.forEach((item) => highlightedReferenceIdSet.add(item.referenceId))
        continue
      }
      if (target.kind === 'reference-category') {
        referenceWorkspaceItems
          .filter((item) => item.categoryId === target.categoryId)
          .forEach((item) => highlightedReferenceIdSet.add(item.referenceId))
        continue
      }
      if (target.kind === 'reference-item') {
        highlightedReferenceIdSet.add(target.referenceId)
      }
    }

    return [...highlightedReferenceIdSet].filter((referenceId) =>
      referenceWorkspaceItems.some((item) => item.referenceId === referenceId),
    )
  }, [referenceWorkspaceItems, workspaceExplicitSelectedTargets, workspaceSelectedTarget])
  const [timelineNowMs, setTimelineNowMs] = useState(() => performance.now())
  const previousReferenceIdsRef = useRef<string[]>([])
  const activeReferenceTransformSession = useMemo(
    () =>
      referenceWorkspace.activeReferenceTransformSession === null
        ? null
        : {
            referenceId: referenceWorkspace.activeReferenceTransformSession.referenceId,
            mode: referenceWorkspace.activeReferenceTransformSession.mode,
            space: referenceWorkspace.activeReferenceTransformSession.space,
          },
    [referenceWorkspace.activeReferenceTransformSession],
  )
  const activeReferenceTransformHistoryOverlay = useMemo<ReferenceTransformHistoryOverlayVm | null>(() => {
    const activeSession = referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeReferenceId === null) {
      return null
    }
    const currentEntries = referenceWorkspace.transformHistoryByReferenceId[activeReferenceId] ?? []
    return buildReferenceTransformHistoryOverlayVm(
      activeReferenceId,
      getReferenceTransformHistoryEntriesThroughScrubIndex(
        currentEntries,
        activeSession?.historyScrubIndex ?? currentEntries.length,
      ),
    )
  }, [
    referenceWorkspace.activeReferenceTransformSession,
    referenceWorkspace.transformHistoryByReferenceId,
  ])
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
        translate: { ...baseTransformSnap.translate },
        scale: { ...baseTransformSnap.scale },
        rotate: {
          ...baseTransformSnap.rotate,
        value: evaluateReferenceTimelineChannelValue(
          getChannelMode(item.referenceId, 'rotate-snap'),
          getChannelConfig(item.referenceId, 'rotate-snap'),
          baseTransformSnap.rotate.value,
          getChannelRange(item.referenceId, 'rotate-snap'),
          timelineNowMs,
        ),
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

    viewer.setOnReferenceTransformChange((referenceId, transformOverride) => {
      const store = useAppStore.getState()
      const activeReferenceId =
        store.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
      if (activeReferenceId !== referenceId) {
        return
      }
      store.setActiveReferenceTransformDraft(transformOverride)
    })
    viewer.setOnReferenceTransformCommit(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    viewer.setOnReferenceTransformExit(() => {
      useAppStore.getState().exitReferenceTransformShell()
    })
    viewer.setOnReferenceTransformHandleChange((handle) => {
      const store = useAppStore.getState()
      const activeSession = store.referenceWorkspace.activeReferenceTransformSession
      if (handle !== null && activeSession !== null) {
        const nextMode =
          handle.mode === 'translate'
            ? 'translate'
            : handle.mode === 'rotate'
              ? 'rotate'
              : 'scale'
        if (!activeSession.entryActive || activeSession.mode !== nextMode) {
          store.beginReferenceTransformEntry(nextMode)
        }
      }
      store.setActiveReferenceTransformHandle(handle)
    })
    viewer.setOnReferenceTransformModeChange((mode) => {
      useAppStore.getState().beginReferenceTransformEntry(mode)
    })
    viewer.setOnReferenceTransformSpaceChange((space) => {
      useAppStore.getState().setActiveReferenceTransformSpace(space)
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
    viewer.setOnWorkspaceSelectionPick(({ pick, ctrlKey }) => {
      const appState = useAppStore.getState()
      appState.setActiveSurface('viewer')
      const commitViewportExplicitSelection = (
        explicitSelectionTarget: WorkspaceSelectedTarget,
        options: {
          selectedPartKey: string | null
        },
      ) => {
        const commitExplicitSelection = (
          explicitSelectedTargets: WorkspaceSelectedTarget[],
          selectedTarget: WorkspaceSelectedTarget | null,
          selectionAnchorTarget: WorkspaceSelectedTarget | null,
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
              selectedPartKey: options.selectedPartKey,
            },
          )
        }

        if (ctrlKey) {
          const currentExplicitTargets =
            appState.workspaceSelection.explicitSelectedTargets.length > 0
              ? appState.workspaceSelection.explicitSelectedTargets
              : isExplicitSelectionTarget(appState.workspaceSelection.selectedTarget)
                ? [appState.workspaceSelection.selectedTarget]
                : []
          const existingIndex = currentExplicitTargets.findIndex(
            (target) => getWorkspaceTargetKey(target) === getWorkspaceTargetKey(explicitSelectionTarget),
          )
          if (existingIndex === -1) {
            commitExplicitSelection(
              [...currentExplicitTargets, explicitSelectionTarget],
              explicitSelectionTarget,
              explicitSelectionTarget,
            )
            return
          }

          const nextExplicitTargets = currentExplicitTargets.filter(
            (target) => getWorkspaceTargetKey(target) !== getWorkspaceTargetKey(explicitSelectionTarget),
          )
          if (nextExplicitTargets.length === 0) {
            commitWorkspaceExplicitSelection(
              {
                setWorkspaceExplicitSelection: appState.setWorkspaceExplicitSelection,
                selectPart: appState.selectPart,
                requestConsoleContextSync: appState.requestConsoleContextSync,
              },
              {
                selectedTarget: null,
                explicitSelectedTargets: [],
                selectionAnchorTarget: explicitSelectionTarget,
              },
              {
                selectedPartKey: null,
              },
            )
            return
          }

          const nextPrimaryTarget =
            appState.workspaceSelection.selectedTarget !== null &&
            getWorkspaceTargetKey(appState.workspaceSelection.selectedTarget) !==
              getWorkspaceTargetKey(explicitSelectionTarget) &&
            nextExplicitTargets.some(
              (target) =>
                getWorkspaceTargetKey(target) ===
                getWorkspaceTargetKey(appState.workspaceSelection.selectedTarget!),
            )
              ? appState.workspaceSelection.selectedTarget
              : nextExplicitTargets.at(-1) ?? null

          commitExplicitSelection(
            nextExplicitTargets,
            nextPrimaryTarget,
            explicitSelectionTarget,
          )
          return
        }

        commitExplicitSelection(
          [explicitSelectionTarget],
          explicitSelectionTarget,
          explicitSelectionTarget,
        )
      }

      if (pick === null) {
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
      if (pick.kind === 'reference-item') {
        commitViewportExplicitSelection(
          {
            kind: 'reference-item',
            referenceId: pick.referenceId,
          },
          {
            selectedPartKey: null,
          },
        )
        return
      }
      const objectRow = contentObjectRowByViewerPartKey.get(pick.partKey)
      if (objectRow !== undefined) {
        commitViewportExplicitSelection(
          {
            kind: 'object',
            objectId: objectRow.rowId,
          },
          {
            selectedPartKey: pick.partKey,
          },
        )
      } else {
        commitWorkspaceTargetSelection(
          {
            setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
            selectPart: appState.selectPart,
            requestConsoleContextSync: appState.requestConsoleContextSync,
          },
          {
            kind: 'part',
            partKey: pick.partKey,
          },
          {
            selectedPartKey: pick.partKey,
          },
        )
        return
      }
    })

    return () => {
      viewer.setOnReferenceTransformChange(null)
      viewer.setOnReferenceTransformCommit(null)
      viewer.setOnReferenceTransformExit(null)
      viewer.setOnReferenceTransformHandleChange(null)
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
          appendConsoleEntry({
            layer: 'Browser',
            text: `Loaded Model: ${item.label}`,
            source: item.referenceId,
            severity: 'info',
          })
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
  }, [
    referenceWorkspace.referenceLoadBatch,
    referenceWorkspaceItems,
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
        appendConsoleEntry({
          layer: 'Browser',
          text: `Loaded Model: ${nextItem.label}`,
          source: nextReferenceId,
          severity: 'info',
        })
        if (useAppStore.getState().referenceWorkspace.visibilityById[nextReferenceId] ?? false) {
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
    if (activeReferenceId === null) {
      viewer.setGizmoSnap({ rotateDeg: undefined })
      return
    }
    const activeReferenceItem =
      evaluatedReferenceItems.find((item) => item.referenceId === activeReferenceId) ?? null
    viewer.setGizmoSnap({
      translateMm:
        activeReferenceItem?.evaluatedTransformSnap.translate.enabled === true
          ? activeReferenceItem.evaluatedTransformSnap.translate.value
          : undefined,
      rotateDeg:
        activeReferenceItem?.evaluatedTransformSnap.rotate.enabled === true
          ? activeReferenceItem.evaluatedTransformSnap.rotate.value
          : undefined,
      scale:
        activeReferenceItem?.evaluatedTransformSnap.scale.enabled === true
          ? activeReferenceItem.evaluatedTransformSnap.scale.value
          : undefined,
    })
  }, [
    evaluatedReferenceItems,
    referenceWorkspace.activeReferenceTransformSession,
  ])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformSession(activeReferenceTransformSession)
  }, [activeReferenceTransformSession])

  useEffect(() => {
    viewerRef.current?.setReferenceTransformHistoryOverlay(activeReferenceTransformHistoryOverlay)
  }, [activeReferenceTransformHistoryOverlay])

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
