// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  toViewerRenderablePart,
  type BuildResultBundle,
  type PartArtifact,
} from '../../shared/buildTypes'
import {
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
} from '../../shared/geometryResult'
import {
  prepareGraphPreviewPreparation,
  type GraphPreviewPreparation,
} from '../spaghetti/previewPreparation'
import type { SpaghettiGraph } from '../spaghetti/schema/spaghettiTypes'

let viewerEnsureReferenceLoaded: ReturnType<typeof vi.fn>
let viewerHasReference: ReturnType<typeof vi.fn>
let viewerSetReferenceVisible: ReturnType<typeof vi.fn>
let viewerRemoveReference: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformSession: ReturnType<typeof vi.fn>
let viewerSetContentObjectTransformGroups: ReturnType<typeof vi.fn>
let viewerSetContentObjectMaterialFallbackGroups: ReturnType<typeof vi.fn>
let viewerSetContentObjectTransformSession: ReturnType<typeof vi.fn>
let viewerSetContentObjectTransformOverrides: ReturnType<typeof vi.fn>
let viewerSetViewerTransformSession: ReturnType<typeof vi.fn>
let viewerSetViewerTransformHistoryOverlay: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformOverride: ReturnType<typeof vi.fn>
let viewerGetReferencePartDescriptors: ReturnType<typeof vi.fn>
let viewerHandoffExplodedReferenceChildren: ReturnType<typeof vi.fn>
let viewerHandoffDirectPartBackedReferenceChildren: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformCommit: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformExit: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformHandleChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformModeChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformSpaceChange: ReturnType<typeof vi.fn>
let viewerSetOnViewerTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnViewerTransformCommit: ReturnType<typeof vi.fn>
let viewerSetOnViewerTransformExit: ReturnType<typeof vi.fn>
let viewerSetOnViewerTransformHandleChange: ReturnType<typeof vi.fn>
let viewerSetOnViewerTransformModeChange: ReturnType<typeof vi.fn>
let viewerSetOnViewerTransformSpaceChange: ReturnType<typeof vi.fn>
let viewerSetOnContentObjectTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnContentObjectTransformCommit: ReturnType<typeof vi.fn>
let viewerSetOnContentObjectTransformHandleChange: ReturnType<typeof vi.fn>
let viewerSetOnContentObjectTransformModeChange: ReturnType<typeof vi.fn>
let viewerSetOnContentObjectTransformSpaceChange: ReturnType<typeof vi.fn>
let viewerSetGizmoSnap: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformMoveSnapDotsEnabled: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformPreviewLastMoveSnapDotsEnabled: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformMoveSnapDotScale: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformMoveSnapDotDelayMs: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformMoveSnapDotNearScale: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformMoveSnapDotFarScale: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformMoveSnapDotVisibleRadiusMultiplier: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformRotateSnapPreviewEnabled: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformRotateSnapPreviewLineSize: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformRotateSnapPreviewLineThickness: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformRotateSnapPreviewRadiusDeg: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformRotateSnapPreviewDelayMs: ReturnType<typeof vi.fn>
let viewerSetGeometrySketchOverlay: ReturnType<typeof vi.fn>
let viewerSetVisibleGeometrySketchOverlays: ReturnType<typeof vi.fn>
let viewerSetExtrudeCommandPreviewOverlay: ReturnType<typeof vi.fn>
let viewerSetParts: ReturnType<typeof vi.fn>
let viewerSetViewportRenderLayers: ReturnType<typeof vi.fn>
let viewerSetHighlightedPartKeys: ReturnType<typeof vi.fn>
let viewerSetHighlightedReferenceIds: ReturnType<typeof vi.fn>
let viewerSetSelectedTopologyEntity: ReturnType<typeof vi.fn>
let viewerSetSketchPlanePickOverlay: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickPlaneSelect: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickTransformCommit: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchHoverPoint: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchConfirmPoint: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchHoverComponent: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchSelectComponents: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchSelectProfile: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchHoverProfile: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchSelectionWindowDraftChange: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchDeleteSelection: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchFinishDraft: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchCancelDraft: ReturnType<typeof vi.fn>
let viewerSetOnWorkspaceSelectionPick: ReturnType<typeof vi.fn>
let viewerApplyCameraPose: ReturnType<typeof vi.fn>
let viewerSetOnCameraPoseChange: ReturnType<typeof vi.fn>
let viewerSetOnRuntimeStatsChange: ReturnType<typeof vi.fn>
let viewerGetRuntimeStats: ReturnType<typeof vi.fn>
let viewerSetOnRenderPreviewStatusChange: ReturnType<typeof vi.fn>

const createArtifact = (partKeyStr: string): PartArtifact => ({
  id: `artifact:${partKeyStr}`,
  kind: 'box',
  label: partKeyStr,
  partKeyStr,
  partKey: { id: partKeyStr, instance: null },
  params: { width: 10, length: 20, height: 5 },
})

vi.mock('../viewerBridge', () => {
  const queuedCameraPoseByViewportId = new Map<string, unknown>()
  const latestCameraPoseByViewportId = new Map<string, unknown>()
  const viewerByViewportId = new Map<string, unknown>()
  return {
    setViewer: vi.fn((viewportId: string, viewer: unknown) => {
      if (viewer === null) {
        viewerByViewportId.delete(viewportId)
        return
      }
      viewerByViewportId.set(viewportId, viewer)
    }),
    getViewer: vi.fn((viewportId: string) => viewerByViewportId.get(viewportId) ?? null),
    queueViewerCameraPose: vi.fn((viewportId: string, pose: unknown) => {
      queuedCameraPoseByViewportId.set(viewportId, pose)
      latestCameraPoseByViewportId.set(viewportId, pose)
    }),
    consumeQueuedViewerCameraPose: vi.fn((viewportId: string) => {
      const pose = queuedCameraPoseByViewportId.get(viewportId) ?? null
      queuedCameraPoseByViewportId.delete(viewportId)
      return pose
    }),
    setLatestViewerCameraPose: vi.fn((viewportId: string, pose: unknown) => {
      latestCameraPoseByViewportId.set(viewportId, pose)
    }),
    getLatestViewerCameraPose: vi.fn((viewportId: string) => {
      return latestCameraPoseByViewportId.get(viewportId) ?? null
    }),
  }
})

vi.mock('../../viewer/Viewer', () => ({
  Viewer: class MockViewer {
    public constructor(_container: HTMLElement) {}
    public dispose(): void {}
    public isFlyModeActive(): boolean {
      return false
    }
    public setParts = (...args: unknown[]) => viewerSetParts(...args)
    public setViewportRenderLayers = (...args: unknown[]) => {
      viewerSetViewportRenderLayers(...args)
      const layers = args[0] as {
        baseParts?: unknown[]
        baselineParts?: unknown[]
        overlayParts?: unknown[]
      }
      return viewerSetParts(
        [...(layers.baseParts ?? []), ...(layers.baselineParts ?? []), ...(layers.overlayParts ?? [])],
        args[1],
        args[2],
      )
    }
    public setSelectedPart(): void {}
    public setSelectedTopologyFace(): void {}
    public setSelectedTopologyEntity = (...args: unknown[]) => viewerSetSelectedTopologyEntity(...args)
    public setHighlightedPartKeys = (...args: unknown[]) => viewerSetHighlightedPartKeys(...args)
    public setHighlightedReferenceIds = (...args: unknown[]) =>
      viewerSetHighlightedReferenceIds(...args)
    public applyViewSettings(): void {}
    public applyCameraPose = (...args: unknown[]) => viewerApplyCameraPose(...args)
    public setOnCameraPoseChange = (...args: unknown[]) => viewerSetOnCameraPoseChange(...args)
    public getRuntimeStats = (...args: unknown[]) => viewerGetRuntimeStats(...args)
    public setOnRuntimeStatsChange = (...args: unknown[]) => viewerSetOnRuntimeStatsChange(...args)
    public setOnRenderPreviewStatusChange = (...args: unknown[]) =>
      viewerSetOnRenderPreviewStatusChange(...args)
    public ensureReferenceLoaded = (...args: unknown[]) => viewerEnsureReferenceLoaded(...args)
    public hasReference = (...args: unknown[]) => viewerHasReference(...args)
    public setReferenceVisible = (...args: unknown[]) => viewerSetReferenceVisible(...args)
    public removeReference = (...args: unknown[]) => viewerRemoveReference(...args)
    public setReferenceTransformSession = (...args: unknown[]) =>
      viewerSetReferenceTransformSession(...args)
    public setContentObjectTransformGroups = (...args: unknown[]) =>
      viewerSetContentObjectTransformGroups(...args)
    public setContentObjectMaterialFallbackGroups = (...args: unknown[]) =>
      viewerSetContentObjectMaterialFallbackGroups(...args)
    public setContentObjectTransformSession = (...args: unknown[]) =>
      viewerSetContentObjectTransformSession(...args)
    public setContentObjectTransformOverrides = (...args: unknown[]) =>
      viewerSetContentObjectTransformOverrides(...args)
    public setViewerTransformSession = (...args: unknown[]) =>
      viewerSetViewerTransformSession(...args)
    public setViewerTransformHistoryOverlay = (...args: unknown[]) =>
      viewerSetViewerTransformHistoryOverlay(...args)
    public setReferenceTransformOverride = (...args: unknown[]) =>
      viewerSetReferenceTransformOverride(...args)
    public getReferencePartDescriptors = (...args: unknown[]) =>
      viewerGetReferencePartDescriptors(...args)
    public handoffExplodedReferenceChildren = (...args: unknown[]) =>
      viewerHandoffExplodedReferenceChildren(...args)
    public handoffDirectPartBackedReferenceChildren = (...args: unknown[]) =>
      viewerHandoffDirectPartBackedReferenceChildren(...args)
    public setOnReferenceTransformChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformChange(...args)
    public setOnReferenceTransformCommit = (...args: unknown[]) =>
      viewerSetOnReferenceTransformCommit(...args)
    public setOnReferenceTransformExit = (...args: unknown[]) =>
      viewerSetOnReferenceTransformExit(...args)
    public setOnReferenceTransformHandleChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformHandleChange(...args)
    public setOnReferenceTransformModeChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformModeChange(...args)
    public setOnReferenceTransformSpaceChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformSpaceChange(...args)
    public setOnViewerTransformChange = (...args: unknown[]) =>
      viewerSetOnViewerTransformChange(...args)
    public setOnViewerTransformCommit = (...args: unknown[]) =>
      viewerSetOnViewerTransformCommit(...args)
    public setOnViewerTransformExit = (...args: unknown[]) =>
      viewerSetOnViewerTransformExit(...args)
    public setOnViewerTransformHandleChange = (...args: unknown[]) =>
      viewerSetOnViewerTransformHandleChange(...args)
    public setOnViewerTransformModeChange = (...args: unknown[]) =>
      viewerSetOnViewerTransformModeChange(...args)
    public setOnViewerTransformSpaceChange = (...args: unknown[]) =>
      viewerSetOnViewerTransformSpaceChange(...args)
    public setOnContentObjectTransformChange = (...args: unknown[]) =>
      viewerSetOnContentObjectTransformChange(...args)
    public setOnContentObjectTransformCommit = (...args: unknown[]) =>
      viewerSetOnContentObjectTransformCommit(...args)
    public setOnContentObjectTransformHandleChange = (...args: unknown[]) =>
      viewerSetOnContentObjectTransformHandleChange(...args)
    public setOnContentObjectTransformModeChange = (...args: unknown[]) =>
      viewerSetOnContentObjectTransformModeChange(...args)
    public setOnContentObjectTransformSpaceChange = (...args: unknown[]) =>
      viewerSetOnContentObjectTransformSpaceChange(...args)
    public setGizmoSnap = (...args: unknown[]) => viewerSetGizmoSnap(...args)
    public setReferenceTransformMoveSnapDotsEnabled = (...args: unknown[]) =>
      viewerSetReferenceTransformMoveSnapDotsEnabled(...args)
    public setReferenceTransformPreviewLastMoveSnapDotsEnabled = (...args: unknown[]) =>
      viewerSetReferenceTransformPreviewLastMoveSnapDotsEnabled(...args)
    public setReferenceTransformMoveSnapDotScale = (...args: unknown[]) =>
      viewerSetReferenceTransformMoveSnapDotScale(...args)
    public setReferenceTransformMoveSnapDotDelayMs = (...args: unknown[]) =>
      viewerSetReferenceTransformMoveSnapDotDelayMs(...args)
    public setReferenceTransformMoveSnapDotNearScale = (...args: unknown[]) =>
      viewerSetReferenceTransformMoveSnapDotNearScale(...args)
    public setReferenceTransformMoveSnapDotFarScale = (...args: unknown[]) =>
      viewerSetReferenceTransformMoveSnapDotFarScale(...args)
    public setReferenceTransformMoveSnapDotVisibleRadiusMultiplier = (...args: unknown[]) =>
      viewerSetReferenceTransformMoveSnapDotVisibleRadiusMultiplier(...args)
    public setReferenceTransformRotateSnapPreviewEnabled = (...args: unknown[]) =>
      viewerSetReferenceTransformRotateSnapPreviewEnabled(...args)
    public setReferenceTransformRotateSnapPreviewLineSize = (...args: unknown[]) =>
      viewerSetReferenceTransformRotateSnapPreviewLineSize(...args)
    public setReferenceTransformRotateSnapPreviewLineThickness = (...args: unknown[]) =>
      viewerSetReferenceTransformRotateSnapPreviewLineThickness(...args)
    public setReferenceTransformRotateSnapPreviewRadiusDeg = (...args: unknown[]) =>
      viewerSetReferenceTransformRotateSnapPreviewRadiusDeg(...args)
    public setReferenceTransformRotateSnapPreviewDelayMs = (...args: unknown[]) =>
      viewerSetReferenceTransformRotateSnapPreviewDelayMs(...args)
    public setGeometrySketchOverlay = (...args: unknown[]) => viewerSetGeometrySketchOverlay(...args)
    public setVisibleGeometrySketchOverlays = (...args: unknown[]) =>
      viewerSetVisibleGeometrySketchOverlays(...args)
    public setExtrudeCommandPreviewOverlay = (...args: unknown[]) =>
      viewerSetExtrudeCommandPreviewOverlay(...args)
    public setOnGeometrySketchHoverPoint = (...args: unknown[]) =>
      viewerSetOnGeometrySketchHoverPoint(...args)
    public setOnGeometrySketchConfirmPoint = (...args: unknown[]) =>
      viewerSetOnGeometrySketchConfirmPoint(...args)
    public setOnGeometrySketchHoverComponent = (...args: unknown[]) =>
      viewerSetOnGeometrySketchHoverComponent(...args)
    public setOnGeometrySketchSelectComponents = (...args: unknown[]) =>
      viewerSetOnGeometrySketchSelectComponents(...args)
    public setOnGeometrySketchSelectProfile = (...args: unknown[]) =>
      viewerSetOnGeometrySketchSelectProfile(...args)
    public setOnGeometrySketchHoverProfile = (...args: unknown[]) =>
      viewerSetOnGeometrySketchHoverProfile(...args)
    public setOnGeometrySketchSelectionWindowDraftChange = (...args: unknown[]) =>
      viewerSetOnGeometrySketchSelectionWindowDraftChange(...args)
    public setOnGeometrySketchDeleteSelection = (...args: unknown[]) =>
      viewerSetOnGeometrySketchDeleteSelection(...args)
    public setOnGeometrySketchFinishDraft = (...args: unknown[]) =>
      viewerSetOnGeometrySketchFinishDraft(...args)
    public setOnGeometrySketchCancelDraft = (...args: unknown[]) =>
      viewerSetOnGeometrySketchCancelDraft(...args)
    public setOnWorkspaceSelectionPick = (...args: unknown[]) =>
      viewerSetOnWorkspaceSelectionPick(...args)
    public setSketchPlanePickOverlay = (...args: unknown[]) =>
      viewerSetSketchPlanePickOverlay(...args)
    public setOnSketchPlanePickPlaneSelect = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickPlaneSelect(...args)
    public setOnSketchPlanePickTransformChange = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickTransformChange(...args)
    public setOnSketchPlanePickTransformCommit = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickTransformCommit(...args)
  },
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void
type WorkspaceSelectionPickPayload = {
  picks: Array<
    | {
        kind: 'part'
        partKey: string
        faceId?: string
        edgeId?: string
        pointId?: string
        topologyBodyId?: string
      }
    | { kind: 'reference-item'; referenceId: string }
    | { kind: 'environment-light'; lightId: string }
  >
  ctrlKey: boolean
  doubleClick?: boolean
}

type GeometrySketchProfilePickHandler = (event: {
  sketchNodeId: string
  profileId: string
  shiftKey: boolean
}) => void

type GeometrySketchProfileHoverHandler = (
  event: { sketchNodeId: string; profileId: string } | null,
) => void

class MockWorker {
  private readonly handlers = new Set<WorkerMessageHandler>()

  public addEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.add(handler as WorkerMessageHandler)
  }

  public removeEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.delete(handler as WorkerMessageHandler)
  }

  public postMessage(_message: unknown): void {}

  public terminate(): void {}
}

const deferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const createPreviewPreparation = (
  slots: Array<{
    slotId: string
    sourceNodeId: string
    sourcePartKey: string
    status?: 'ok' | 'empty' | 'unresolved'
  }>,
): GraphPreviewPreparation => ({
  outputPreviewNodeId: 'node-output-preview-1',
  outputSlotIds: slots.map((slot) => slot.slotId),
  previewCandidateSlotIds: slots.map((slot) => slot.slotId),
  previewCandidatePartKeys: slots.map((slot) => slot.sourcePartKey),
  sourceNodeIdBySlotId: Object.fromEntries(slots.map((slot) => [slot.slotId, slot.sourceNodeId])),
  sourcePartKeyBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, slot.sourcePartKey]),
  ),
  sourcePortIdBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, `out:${slot.sourcePartKey}`]),
  ),
  sourcePartKeyByNodeId: Object.fromEntries(
    slots.map((slot) => [slot.sourceNodeId, slot.sourcePartKey]),
  ),
  slotStatusBySlotId: Object.fromEntries(slots.map((slot) => [slot.slotId, slot.status ?? 'ok'])),
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
})

const createAcceptedPreviewBundle = (options: {
  seq: number
  graphDocumentId: string
  buildRequestId: string
  resultClass?: BuildResultBundle['resultClass']
  entries: Array<{
    artifact: PartArtifact
    outputEntryId: string
    sourceNodeId: string | null
    status: 'rebuilt' | 'retained' | 'evicted'
  }>
}): BuildResultBundle => {
  const rebuiltCount = options.entries.filter((entry) => entry.status === 'rebuilt').length
  const retainedCount = options.entries.filter((entry) => entry.status === 'retained').length
  const evictedCount = options.entries.filter((entry) => entry.status === 'evicted').length

  return {
    buildRequestId: options.buildRequestId,
    graphDocumentId: options.graphDocumentId,
    seq: options.seq,
    resultClass: options.resultClass ?? 'draft',
    executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
    summary: {
      rebuiltCount,
      retainedCount,
      evictedCount,
    },
    entries: options.entries.map((entry) => ({
      buildUnitId: entry.outputEntryId,
      outputEntryId: entry.outputEntryId,
      sourceNodeId: entry.sourceNodeId,
      status: entry.status,
      resultClass: options.resultClass ?? 'draft',
      artifacts: entry.status === 'evicted' ? [] : [entry.artifact],
    })),
  }
}

const seedViewportObjectSelectionGraph = async (
  slots: Array<{
    slotId: string
    sourceNodeId: string
    sourcePartKey: string
    objectId: string
    label: string
  }>,
) => {
  const { useAppStore } = await import('../store/useAppStore')
  const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
  const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

  const previewPreparation = createPreviewPreparation(slots)
  const componentId = 'project-component:project-file-1:graph-document-1:published'

  act(() => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: 'System/OutputPreview',
          params: {
            slots: slots.map((slot) => ({ slotId: slot.slotId })),
            objects: slots.map((slot) => ({
              objectId: slot.objectId,
              label: slot.label,
              slotId: slot.slotId,
            })),
          },
        },
        ...slots.map((slot) => ({
          nodeId: slot.sourceNodeId,
          type: 'Baseplate',
          params: {},
        })),
      ],
      edges: slots.map((slot, index) => ({
        edgeId: `edge-${index + 1}`,
        from: { nodeId: slot.sourceNodeId, portId: 'out:solid' },
        to: { nodeId: 'node-output-preview-1', portId: `in:solid:${slot.slotId}` },
      })),
    })
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          previewPreparation,
          acceptedBuildOutputs: slots.map((slot, index) => ({
            id: `artifact-${index + 1}`,
            kind: 'box',
            label: slot.label,
            partKeyStr: slot.sourcePartKey,
            partKey: { id: slot.sourcePartKey, instance: null },
            params: { width: 10, length: 20, height: 5 },
          })),
          acceptedPreviewBuildOutputs: slots.map((slot, index) => ({
            id: `artifact-${index + 1}`,
            kind: 'box',
            label: slot.label,
            partKeyStr: slot.sourcePartKey,
            partKey: { id: slot.sourcePartKey, instance: null },
            params: { width: 10, length: 20, height: 5 },
          })),
          outputSurface: buildGraphOutputSurface({
            graphDocumentId: 'graph-document-1',
            previewPreparation,
            acceptedBuildOutputs: slots.map((slot, index) => ({
              id: `artifact-${index + 1}`,
              kind: 'box',
              label: slot.label,
              partKeyStr: slot.sourcePartKey,
              partKey: { id: slot.sourcePartKey, instance: null },
              params: { width: 10, length: 20, height: 5 },
            })),
            publishedAtBuildSeq: 1,
          }),
        },
      },
    }))
    useAppStore.setState((state) => ({
      currentProject: {
        ...state.currentProject,
        graphDocuments: [
          {
            graphDocumentId: 'graph-document-1',
            label: 'Graph 1',
            sourceFilePath: null,
            orderIndex: 0,
          },
        ],
        rootAssemblyId: 'assembly-root:project-file-1',
      },
      projectContent: {
        assembliesById: {
          'assembly-root:project-file-1': {
            assemblyId: 'assembly-root:project-file-1',
            label: 'Assembly 1',
            childRowIds: [componentId],
          },
        },
        componentsById: {
          [componentId]: {
            componentId,
            ownerGraphDocumentId: 'graph-document-1',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: `output-entry:${slots[0]?.slotId ?? 'slot-a'}:${slots[0]?.sourceNodeId ?? 'node-1'}`,
            sourceNodeId: slots[0]?.sourceNodeId ?? 'node-1',
            label: 'Component 1',
            componentSourceKind: 'published-component',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: slots.map((slot) => slot.objectId),
          },
        },
        objectsById: Object.fromEntries(
          slots.map((slot) => [
            slot.objectId,
            {
              objectId: slot.objectId,
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: componentId,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: `output-entry:${slot.slotId}:${slot.sourceNodeId}`,
              sourceNodeId: slot.sourceNodeId,
              slotId: slot.slotId,
              label: slot.label,
              resolutionState: 'resolved',
            },
          ]),
        ),
      },
    }))
  })
}

describe('ViewerHost reference loading', () => {
  const originalWorker = globalThis.Worker
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    viewerEnsureReferenceLoaded = vi.fn()
    viewerHasReference = vi.fn(() => false)
    viewerSetReferenceVisible = vi.fn()
    viewerRemoveReference = vi.fn()
    viewerSetReferenceTransformSession = vi.fn()
    viewerSetContentObjectTransformGroups = vi.fn()
    viewerSetContentObjectMaterialFallbackGroups = vi.fn()
    viewerSetContentObjectTransformSession = vi.fn()
    viewerSetContentObjectTransformOverrides = vi.fn()
    viewerSetViewerTransformSession = vi.fn()
    viewerSetViewerTransformHistoryOverlay = vi.fn()
    viewerSetReferenceTransformOverride = vi.fn()
    viewerGetReferencePartDescriptors = vi.fn(() => [])
    viewerHandoffExplodedReferenceChildren = vi.fn(() => [])
    viewerHandoffDirectPartBackedReferenceChildren = vi.fn(() => [])
    viewerSetOnReferenceTransformChange = vi.fn()
    viewerSetOnReferenceTransformCommit = vi.fn()
    viewerSetOnReferenceTransformExit = vi.fn()
    viewerSetOnReferenceTransformHandleChange = vi.fn()
    viewerSetOnReferenceTransformModeChange = vi.fn()
    viewerSetOnReferenceTransformSpaceChange = vi.fn()
    viewerSetOnViewerTransformChange = vi.fn()
    viewerSetOnViewerTransformCommit = vi.fn()
    viewerSetOnViewerTransformExit = vi.fn()
    viewerSetOnViewerTransformHandleChange = vi.fn()
    viewerSetOnViewerTransformModeChange = vi.fn()
    viewerSetOnViewerTransformSpaceChange = vi.fn()
    viewerSetOnContentObjectTransformChange = vi.fn()
    viewerSetOnContentObjectTransformCommit = vi.fn()
    viewerSetOnContentObjectTransformHandleChange = vi.fn()
    viewerSetOnContentObjectTransformModeChange = vi.fn()
    viewerSetOnContentObjectTransformSpaceChange = vi.fn()
    viewerSetGizmoSnap = vi.fn()
    viewerSetReferenceTransformMoveSnapDotsEnabled = vi.fn()
    viewerSetReferenceTransformPreviewLastMoveSnapDotsEnabled = vi.fn()
    viewerSetReferenceTransformMoveSnapDotScale = vi.fn()
    viewerSetReferenceTransformMoveSnapDotDelayMs = vi.fn()
    viewerSetReferenceTransformMoveSnapDotNearScale = vi.fn()
    viewerSetReferenceTransformMoveSnapDotFarScale = vi.fn()
    viewerSetReferenceTransformMoveSnapDotVisibleRadiusMultiplier = vi.fn()
    viewerSetReferenceTransformRotateSnapPreviewEnabled = vi.fn()
    viewerSetReferenceTransformRotateSnapPreviewLineSize = vi.fn()
    viewerSetReferenceTransformRotateSnapPreviewLineThickness = vi.fn()
    viewerSetReferenceTransformRotateSnapPreviewRadiusDeg = vi.fn()
    viewerSetReferenceTransformRotateSnapPreviewDelayMs = vi.fn()
    viewerSetGeometrySketchOverlay = vi.fn()
    viewerSetVisibleGeometrySketchOverlays = vi.fn()
    viewerSetExtrudeCommandPreviewOverlay = vi.fn()
    viewerSetParts = vi.fn()
    viewerSetViewportRenderLayers = vi.fn()
    viewerSetHighlightedPartKeys = vi.fn()
    viewerSetHighlightedReferenceIds = vi.fn()
    viewerSetSelectedTopologyEntity = vi.fn()
    viewerSetSketchPlanePickOverlay = vi.fn()
    viewerSetOnSketchPlanePickPlaneSelect = vi.fn()
    viewerSetOnSketchPlanePickTransformChange = vi.fn()
    viewerSetOnSketchPlanePickTransformCommit = vi.fn()
    viewerSetOnGeometrySketchHoverPoint = vi.fn()
    viewerSetOnGeometrySketchConfirmPoint = vi.fn()
    viewerSetOnGeometrySketchHoverComponent = vi.fn()
    viewerSetOnGeometrySketchSelectComponents = vi.fn()
    viewerSetOnGeometrySketchSelectProfile = vi.fn()
    viewerSetOnGeometrySketchHoverProfile = vi.fn()
    viewerSetOnGeometrySketchSelectionWindowDraftChange = vi.fn()
    viewerSetOnGeometrySketchDeleteSelection = vi.fn()
    viewerSetOnGeometrySketchFinishDraft = vi.fn()
    viewerSetOnGeometrySketchCancelDraft = vi.fn()
    viewerSetOnWorkspaceSelectionPick = vi.fn()
    viewerApplyCameraPose = vi.fn()
    viewerSetOnCameraPoseChange = vi.fn()
    viewerSetOnRuntimeStatsChange = vi.fn()
    viewerGetRuntimeStats = vi.fn(() => ({
      triangles: null,
      lines: null,
      points: null,
      fps: null,
    }))
    viewerSetOnRenderPreviewStatusChange = vi.fn()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    const { useAppStore } = await import('../store/useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    try {
      const { buildDispatcher } = await import('../buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    globalThis.Worker = originalWorker
  })

  it('keeps the Extrude command toolbar hidden when no Extrude session is active', async () => {
    const { ViewerHost } = await import('./ViewerHost')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(container.querySelector('[aria-label="Extrude command toolbar"]')).toBeNull()
  })

  it('renders the Extrude command toolbar from the active session owner', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'console-root',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const toolbar = container.querySelector('[aria-label="Extrude command toolbar"]')
    const okButton = container.querySelector('[aria-label="Confirm Extrude"]') as
      | HTMLButtonElement
      | null
    const cancelButton = container.querySelector('[aria-label="Cancel Extrude"]') as
      | HTMLButtonElement
      | null

    expect(toolbar).not.toBeNull()
    expect(toolbar?.textContent).toContain('Extrude')
    expect(toolbar?.textContent).toContain('Select Profiles')
    expect(toolbar?.textContent).toContain('0 selected')
    expect(toolbar?.textContent).toContain('10')
    expect(toolbar?.textContent).toContain('New Body')
    expect(okButton?.disabled).toBe(true)
    expect(cancelButton?.disabled).toBe(false)
  })

  it('renders the Extrude command toolbar depth state from selected profile sources', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'viewport-toolbar',
        selectedProfileSources: [
          {
            nodeId: 'node-sketch-1',
            portId: 'sketch-profile:profile-a',
          },
          {
            nodeId: 'node-sketch-1',
            portId: 'sketch-profile:profile-b',
          },
        ],
        depth: 25,
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const toolbar = container.querySelector('[aria-label="Extrude command toolbar"]')
    const okButton = container.querySelector('[aria-label="Confirm Extrude"]') as
      | HTMLButtonElement
      | null

    expect(toolbar?.getAttribute('data-extrude-command-step')).toBe('depth')
    expect(toolbar?.textContent).toContain('Depth')
    expect(toolbar?.textContent).toContain('2 selected')
    expect(toolbar?.textContent).toContain('25')
    expect(okButton?.disabled).toBe(false)
  })

  it('projects the active Extrude command preview from selected profile sources', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XZ',
                planeTransform: {
                  offsetMm: 0,
                  translation: { x: 1, y: 2, z: 3 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  inPlaneRotationDeg: 0,
                },
                components: [],
                outputs: {
                  diagnostics: [],
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                      ],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [
                        { x: 20, y: 0 },
                        { x: 28, y: 0 },
                        { x: 28, y: 8 },
                        { x: 20, y: 8 },
                      ],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'viewport-toolbar',
        selectedProfileSources: [
          { nodeId: 'node-sketch-1', portId: 'SketchProfile:profile-a' },
          { nodeId: 'node-sketch-1', portId: 'SketchProfile:profile-b' },
        ],
        depth: 25,
      })
    })
    const graphAfterCommandStart = useSpaghettiStore.getState().graph

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetExtrudeCommandPreviewOverlay).toHaveBeenLastCalledWith({
      graphDocumentId: 'graph-document-1',
      depthMm: 25,
      profiles: [
        expect.objectContaining({
          sketchNodeId: 'node-sketch-1',
          profileId: 'profile-a',
          plane: 'XZ',
          vertices: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
          ],
        }),
        expect.objectContaining({
          sketchNodeId: 'node-sketch-1',
          profileId: 'profile-b',
          plane: 'XZ',
        }),
      ],
    })
    expect(useSpaghettiStore.getState().graph).toEqual(graphAfterCommandStart)
  })

  it('confirms the Extrude command toolbar by accepting the live graph node', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { editHistoryStore } = await import('../store/editHistoryStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  diagnostics: [],
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                      ],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'viewport-toolbar',
        selectedProfileSources: [
          {
            nodeId: 'node-sketch-1',
            portId: 'SketchProfile:profile-a',
          },
        ],
        depth: 32,
      })
    })
    const liveExtrudeNodeId =
      useSpaghettiStore.getState().extrudeCommandSession?.liveGraph?.liveExtrudeNodeId

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      const okButton = container?.querySelector('[aria-label="Confirm Extrude"]') as
        | HTMLButtonElement
        | null
      okButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const acceptedExtrudeNode = useSpaghettiStore
      .getState()
      .graph.nodes.find((node) => node.nodeId === liveExtrudeNodeId)
    expect(useSpaghettiStore.getState().extrudeCommandSession).toBeNull()
    expect(container.querySelector('[aria-label="Extrude command toolbar"]')).toBeNull()
    expect(acceptedExtrudeNode).toMatchObject({
      type: 'Geometry/Extrude',
      params: expect.objectContaining({
        depthMm: 32,
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        bodyGenerationMode: 'NewObjects',
      }),
    })
    expect(
      useSpaghettiStore.getState().graph.edges.filter(
        (edge) => edge.to.nodeId === liveExtrudeNodeId && edge.to.portId === 'ExtrusionProfile',
      ),
    ).toHaveLength(1)
    expect(
      useSpaghettiStore.getState().graph.edges.filter(
        (edge) => edge.from.nodeId === liveExtrudeNodeId && edge.to.portId === 'in:solid:s001',
      ),
    ).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries().at(-1)).toMatchObject({
      label: 'Extrude',
      targetId: liveExtrudeNodeId,
      targetLabel: 'Extrude',
    })
    expect(viewerSetExtrudeCommandPreviewOverlay).toHaveBeenLastCalledWith(null)

    act(() => {
      editHistoryStore.undo()
    })

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === liveExtrudeNodeId),
    ).toBe(false)
  })

  it('cancels the Extrude command toolbar by rolling back the live graph node', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {},
          },
        ],
        edges: [],
      })
    })
    const graphBefore = useSpaghettiStore.getState().graph

    act(() => {
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'console-root',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      const cancelButton = container?.querySelector('[aria-label="Cancel Extrude"]') as
        | HTMLButtonElement
        | null
      cancelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().extrudeCommandSession).toBeNull()
    expect(useSpaghettiStore.getState().graph).toEqual(graphBefore)
    expect(container.querySelector('[aria-label="Extrude command toolbar"]')).toBeNull()
  })

  it('preselects a viewport sketch profile without graph mutation when no Extrude session is active', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
    })
    const graphBefore = useSpaghettiStore.getState().graph

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profilePickHandler = viewerSetOnGeometrySketchSelectProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfilePickHandler
      | undefined

    act(() => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        shiftKey: false,
      })
    })

    expect(useSpaghettiStore.getState().extrudeCommandSession).toBeNull()
    expect(useSpaghettiStore.getState().viewportSelectedSketchProfiles).toEqual([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        portId: 'SketchProfile:profile-a',
      },
    ])
    expect(useSpaghettiStore.getState().graph).toEqual(graphBefore)
    expect(container.querySelector('[aria-label="Extrude command toolbar"]')).toBeNull()
  })

  it('preselects every profile from the picked sketch on outside-Extrude shift-click', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
          {
            nodeId: 'node-sketch-2',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-2',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-c',
                      profileIndex: 0,
                      area: 25,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
    })
    const graphBefore = useSpaghettiStore.getState().graph

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profilePickHandler = viewerSetOnGeometrySketchSelectProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfilePickHandler
      | undefined

    act(() => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        shiftKey: true,
      })
    })

    expect(useSpaghettiStore.getState().viewportSelectedSketchProfiles).toEqual([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        portId: 'SketchProfile:profile-a',
      },
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        portId: 'SketchProfile:profile-b',
      },
    ])
    expect(useSpaghettiStore.getState().viewportSelectedSketchProfiles).not.toContainEqual(
      expect.objectContaining({ profileId: 'profile-c' }),
    )
    expect(useSpaghettiStore.getState().graph).toEqual(graphBefore)
  })

  it('toggles multiple viewport sketch profile preselections outside Extrude', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
    })
    const graphBefore = useSpaghettiStore.getState().graph

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profilePickHandler = viewerSetOnGeometrySketchSelectProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfilePickHandler
      | undefined

    act(() => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        shiftKey: false,
      })
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        shiftKey: false,
      })
    })

    expect(useSpaghettiStore.getState().viewportSelectedSketchProfiles).toEqual([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        portId: 'SketchProfile:profile-a',
      },
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        portId: 'SketchProfile:profile-b',
      },
    ])

    act(() => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        shiftKey: false,
      })
    })

    expect(useSpaghettiStore.getState().viewportSelectedSketchProfiles).toEqual([
      {
        graphDocumentId: 'graph-document-1',
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        portId: 'SketchProfile:profile-b',
      },
    ])
    expect(useSpaghettiStore.getState().graph).toEqual(graphBefore)
  })

  it('stores viewport sketch profile hover for overlay highlighting', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profileHoverHandler = viewerSetOnGeometrySketchHoverProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfileHoverHandler
      | undefined

    act(() => {
      profileHoverHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
      })
    })

    expect(useSpaghettiStore.getState().viewportHoveredSketchProfile).toEqual({
      sketchNodeId: 'node-sketch-1',
      profileId: 'profile-a',
    })

    act(() => {
      profileHoverHandler?.(null)
    })

    expect(useSpaghettiStore.getState().viewportHoveredSketchProfile).toBeNull()
  })

  it('routes one viewport sketch profile pick into the active Extrude session', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'viewport-toolbar',
      })
    })
    const graphBefore = useSpaghettiStore.getState().graph

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profilePickHandler = viewerSetOnGeometrySketchSelectProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfilePickHandler
      | undefined

    await act(async () => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        shiftKey: false,
      })
    })

    const session = useSpaghettiStore.getState().extrudeCommandSession
    const toolbar = container.querySelector('[aria-label="Extrude command toolbar"]')

    expect(session).toMatchObject({
      activeStep: 'depth',
      validation: 'readyForDepth',
      selectedProfileSources: [
        {
          nodeId: 'node-sketch-1',
          portId: 'SketchProfile:profile-a',
        },
      ],
    })
    expect(toolbar?.textContent).toContain('Depth')
    expect(toolbar?.textContent).toContain('1 selected')
    expect(useSpaghettiStore.getState().graph).not.toEqual(graphBefore)
    expect(
      useSpaghettiStore.getState().graph.edges.filter(
        (edge) =>
          edge.to.nodeId === session?.liveGraph?.liveExtrudeNodeId &&
          edge.to.portId === 'ExtrusionProfile',
      ),
    ).toMatchObject([
      {
        from: {
          nodeId: 'node-sketch-1',
          portId: 'SketchProfile:profile-a',
        },
      },
    ])
  })

  it('routes shift-picked viewport sketch profiles into the active Extrude session', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
          {
            nodeId: 'node-sketch-2',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-2',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-c',
                      profileIndex: 0,
                      area: 25,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'viewport-toolbar',
      })
    })
    const graphBefore = useSpaghettiStore.getState().graph

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profilePickHandler = viewerSetOnGeometrySketchSelectProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfilePickHandler
      | undefined

    await act(async () => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        shiftKey: true,
      })
    })

    const session = useSpaghettiStore.getState().extrudeCommandSession
    const toolbar = container.querySelector('[aria-label="Extrude command toolbar"]')

    expect(session?.selectedProfileSources).toEqual([
      {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfile:profile-a',
      },
      {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfile:profile-b',
      },
    ])
    expect(session?.selectedProfileSources).not.toContainEqual({
      nodeId: 'node-sketch-2',
      portId: 'SketchProfile:profile-c',
    })
    expect(toolbar?.textContent).toContain('2 selected')
    expect(useSpaghettiStore.getState().graph).not.toEqual(graphBefore)
    expect(
      useSpaghettiStore.getState().graph.edges.filter(
        (edge) =>
          edge.to.nodeId === session?.liveGraph?.liveExtrudeNodeId &&
          edge.to.portId === 'ExtrusionProfile',
      ),
    ).toMatchObject([
      {
        from: {
          nodeId: 'node-sketch-1',
          portId: 'SketchProfile:profile-a',
        },
      },
      {
        from: {
          nodeId: 'node-sketch-1',
          portId: 'SketchProfile:profile-b',
        },
      },
    ])
  })

  it('toggles viewport-picked sketch profiles into and out of the active Extrude session', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: { winding: 'CCW', segments: [] },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startExtrudeCommandSession({
        graphDocumentId: 'graph-document-1',
        entryPoint: 'viewport-toolbar',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const profilePickHandler = viewerSetOnGeometrySketchSelectProfile.mock.calls.at(-1)?.[0] as
      | GeometrySketchProfilePickHandler
      | undefined

    await act(async () => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        shiftKey: false,
      })
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-b',
        shiftKey: false,
      })
    })

    let session = useSpaghettiStore.getState().extrudeCommandSession
    expect(session?.selectedProfileSources).toEqual([
      {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfile:profile-a',
      },
      {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfile:profile-b',
      },
    ])
    expect(
      useSpaghettiStore.getState().graph.edges.filter(
        (edge) =>
          edge.to.nodeId === session?.liveGraph?.liveExtrudeNodeId &&
          edge.to.portId === 'ExtrusionProfile',
      ),
    ).toHaveLength(2)

    await act(async () => {
      profilePickHandler?.({
        sketchNodeId: 'node-sketch-1',
        profileId: 'profile-a',
        shiftKey: false,
      })
    })

    session = useSpaghettiStore.getState().extrudeCommandSession
    expect(session?.selectedProfileSources).toEqual([
      {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfile:profile-b',
      },
    ])
    expect(
      useSpaghettiStore.getState().graph.edges.filter(
        (edge) =>
          edge.to.nodeId === session?.liveGraph?.liveExtrudeNodeId &&
          edge.to.portId === 'ExtrusionProfile',
      ),
    ).toMatchObject([
      {
        from: {
          nodeId: 'node-sketch-1',
          portId: 'SketchProfile:profile-b',
        },
      },
    ])
  })

  it('promotes a visible reference from loading to loaded after the async viewer load resolves', async () => {
    const load = deferred<void>()
    viewerEnsureReferenceLoaded.mockReturnValue(load.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('loading')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)

    await act(async () => {
      load.resolve()
      await load.promise
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('loaded')
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith('shoe:shoe-1', true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Loaded Model: Shoe 1'),
    ).toBe(true)
  })

  it('rehydrates a visible loaded reference missing from the mounted viewer runtime', async () => {
    const load = deferred<void>()
    let viewerOwnsReference = false

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    let referenceId = ''
    act(() => {
      referenceId = useAppStore.getState().addImportedReference({
        fileName: 'rehydrate.glb',
        fileType: 'glb',
        objectUrl: 'blob:rehydrate',
      })
      useAppStore.getState().setReferenceItemLoadState(referenceId, 'loaded')
    })

    viewerHasReference.mockImplementation(
      (candidateReferenceId: string) => candidateReferenceId === referenceId && viewerOwnsReference,
    )
    viewerEnsureReferenceLoaded.mockImplementation(async () => {
      await load.promise
      viewerOwnsReference = true
    })
    viewerGetReferencePartDescriptors.mockReturnValue([
      {
        partKey: `reference-part:${referenceId}:0`,
        label: 'Recovered Mesh',
        sourceMeshIndex: 0,
      },
    ])

    const importedReferenceOrderBefore = [
      ...useAppStore.getState().referenceWorkspace.importedReferenceOrder,
    ]

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById[referenceId]).toBe('loading')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({ referenceId })

    await act(async () => {
      load.resolve()
      await load.promise
      await Promise.resolve()
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(useAppStore.getState().referenceWorkspace.loadStateById[referenceId]).toBe('loaded')
    expect(useAppStore.getState().referenceWorkspace.partRowsByReferenceId[referenceId]).toEqual([
      {
        rowId: `reference-part-row:reference-part:${referenceId}:0`,
        partKey: `reference-part:${referenceId}:0`,
        label: 'Recovered Mesh',
        sourceMeshIndex: 0,
      },
    ])
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith(referenceId, true)
    expect(useAppStore.getState().referenceWorkspace.importedReferenceOrder).toEqual(
      importedReferenceOrderBefore,
    )
  })

  it('rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache', async () => {
    const load = deferred<void>()
    const sourceAttribution = {
      sourceKind: 'external-catalog' as const,
      providerId: 'pubparts',
      providerName: 'PubParts',
      catalogItemId: 'external:pubparts:gripples',
      catalogItemLabel: '3d Printed Gripples',
      sourceCandidateUrl:
        'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?dl=0',
      linkedArchiveUrl:
        'https://www.dropbox.com/scl/fi/8y9sup2xbsc98hlq8hong/standard-gripples-for-onewheel-model_files.zip?dl=0',
      sourcePageUrl: 'https://www.printables.com/model/598759',
    }

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    let referenceId = ''
    act(() => {
      referenceId = useAppStore.getState().addImportedReference({
        fileName: 'gripple_body.obj',
        fileType: 'obj',
        objectUrl: 'blob:pubparts-gripple-body',
        sourceAttribution,
      })
      useAppStore.getState().setReferenceItemLoadState(referenceId, 'loaded')
      useAppStore.getState().setReferenceItemVisibility(referenceId, true)
    })

    const importedReferenceOrderBefore = [
      ...useAppStore.getState().referenceWorkspace.importedReferenceOrder,
    ]

    let viewerOwnsReference = true
    viewerHasReference.mockImplementation(
      (candidateReferenceId: string) => candidateReferenceId === referenceId && viewerOwnsReference,
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(viewerEnsureReferenceLoaded).not.toHaveBeenCalled()

    await act(async () => {
      root?.unmount()
    })
    container.remove()
    root = null
    container = null

    viewerEnsureReferenceLoaded.mockClear()
    viewerSetReferenceVisible.mockClear()
    viewerOwnsReference = false
    viewerEnsureReferenceLoaded.mockImplementation(async () => {
      await load.promise
      viewerOwnsReference = true
    })
    viewerGetReferencePartDescriptors.mockReturnValue([
      {
        partKey: `reference-part:${referenceId}:0`,
        label: 'Gripple Body',
        sourceMeshIndex: 0,
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById[referenceId]).toBe('loading')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({ referenceId })

    await act(async () => {
      load.resolve()
      await load.promise
      await Promise.resolve()
    })

    const referenceWorkspace = useAppStore.getState().referenceWorkspace
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(referenceWorkspace.loadStateById[referenceId]).toBe('loaded')
    expect(referenceWorkspace.partRowsByReferenceId[referenceId]).toEqual([
      {
        rowId: `reference-part-row:reference-part:${referenceId}:0`,
        partKey: `reference-part:${referenceId}:0`,
        label: 'Gripple Body',
        sourceMeshIndex: 0,
      },
    ])
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith(referenceId, true)
    expect(referenceWorkspace.importedReferenceOrder).toEqual(importedReferenceOrderBefore)
    expect(referenceWorkspace.importedReferenceOrder.filter((id) => id === referenceId)).toHaveLength(
      1,
    )
    expect(referenceWorkspace.importedReferencesById[referenceId]?.sourceAttribution).toEqual(
      sourceAttribution,
    )
  })

  it('rehydrates a loaded obj import in a newly mounted secondary model viewer', async () => {
    const load = deferred<void>()
    let viewerOwnsReference = false

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    let referenceId = ''
    act(() => {
      referenceId = useAppStore.getState().addImportedReference({
        fileName: 'split-rehydrate.obj',
        fileType: 'obj',
        objectUrl: 'blob:split-rehydrate-obj',
      })
      useAppStore.getState().setReferenceItemLoadState(referenceId, 'loaded')
      useAppStore.getState().setReferenceItemVisibility(referenceId, true)
    })

    const importedReferenceOrderBefore = [
      ...useAppStore.getState().referenceWorkspace.importedReferenceOrder,
    ]

    viewerHasReference.mockImplementation(
      (candidateReferenceId: string) => candidateReferenceId === referenceId && viewerOwnsReference,
    )
    viewerEnsureReferenceLoaded.mockImplementation(async () => {
      await load.promise
      viewerOwnsReference = true
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-secondary" />)
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById[referenceId]).toBe('loading')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({ referenceId })

    await act(async () => {
      load.resolve()
      await load.promise
      await Promise.resolve()
    })

    const referenceWorkspace = useAppStore.getState().referenceWorkspace
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(referenceWorkspace.loadStateById[referenceId]).toBe('loaded')
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith(referenceId, true)
    expect(referenceWorkspace.importedReferenceOrder).toEqual(importedReferenceOrderBefore)
    expect(referenceWorkspace.importedReferenceOrder.filter((id) => id === referenceId)).toHaveLength(
      1,
    )
  })

  it('does not rehydrate a visible loaded reference already present in the mounted viewer runtime', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    let referenceId = ''
    act(() => {
      referenceId = useAppStore.getState().addImportedReference({
        fileName: 'already-owned.glb',
        fileType: 'glb',
        objectUrl: 'blob:already-owned',
      })
      useAppStore.getState().setReferenceItemLoadState(referenceId, 'loaded')
    })

    viewerHasReference.mockImplementation(
      (candidateReferenceId: string) => candidateReferenceId === referenceId,
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(viewerEnsureReferenceLoaded).not.toHaveBeenCalled()
    expect(useAppStore.getState().referenceWorkspace.loadStateById[referenceId]).toBe('loaded')
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith(referenceId, true)
  })

  it('uses the existing error path when loaded-but-missing rehydration fails', async () => {
    viewerHasReference.mockReturnValue(false)
    viewerEnsureReferenceLoaded.mockRejectedValueOnce(new Error('rehydration failed'))

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    let referenceId = ''
    act(() => {
      referenceId = useAppStore.getState().addImportedReference({
        fileName: 'failed-rehydrate.glb',
        fileType: 'glb',
        objectUrl: 'blob:failed-rehydrate',
      })
      useAppStore.getState().setReferenceItemLoadState(referenceId, 'loaded')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({ referenceId })
    expect(useAppStore.getState().referenceWorkspace.loadStateById[referenceId]).toBe('error')
    expect(useAppStore.getState().referenceWorkspace.visibilityById[referenceId]).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.errorById[referenceId]).toBe(
      'rehydration failed',
    )
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith(referenceId, false)
  })

  it('applies a queued camera pose when a viewer viewport mounts', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { queueViewerCameraPose } = await import('../viewerBridge')
    const { Vector3 } = await import('three')

    queueViewerCameraPose('model-viewer-secondary', {
      position: new Vector3(10, 20, 30),
      target: new Vector3(1, 2, 3),
      up: new Vector3(0, 1, 0),
      projectionMode: 'orthographic',
      perspectiveFovDeg: 42,
      orthoViewHeight: 18,
      clipRangeMode: 'auto',
      clipStart: 0.1,
      clipEnd: 1000,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-secondary" />)
    })

    expect(viewerApplyCameraPose).toHaveBeenCalledTimes(1)
    expect(viewerApplyCameraPose.mock.calls[0]?.[0]).toMatchObject({
      projectionMode: 'orthographic',
      perspectiveFovDeg: 42,
      orthoViewHeight: 18,
    })
  })

  it('forwards viewer-owned runtime stats into the app-facing viewport stats store', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const {
      useViewportRuntimeStatsStore,
      selectViewportRuntimeStats,
    } = await import('../store/viewportRuntimeStatsStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetOnRuntimeStatsChange).toHaveBeenCalledWith(expect.any(Function))

    const runtimeStatsHandler = viewerSetOnRuntimeStatsChange.mock.calls.at(-1)?.[0] as
      | ((stats: { triangles: number | null; lines: number | null; points: number | null; fps: number | null }) => void)
      | null

    act(() => {
      runtimeStatsHandler?.({
        triangles: 2048,
        lines: 96,
        points: 0,
        fps: 60,
      })
    })

    expect(
      selectViewportRuntimeStats(useViewportRuntimeStatsStore.getState(), 'model-viewer-primary'),
    ).toEqual({
      triangles: 2048,
      lines: 96,
      points: 0,
      fps: 60,
    })
  })

  it('forwards viewer-owned render-preview progress into the viewport status store', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const {
      selectRenderPreviewStatus,
      useRenderPreviewStatusStore,
    } = await import('../store/renderPreviewStatusStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetOnRenderPreviewStatusChange).toHaveBeenCalledWith(expect.any(Function))

    const renderPreviewStatusHandler = viewerSetOnRenderPreviewStatusChange.mock.calls.at(-1)?.[0] as
      | ((status: {
          status: 'rendering' | 'complete'
          completedSamples: number
          targetSamples: number
        }) => void)
      | null

    act(() => {
      renderPreviewStatusHandler?.({
        status: 'rendering',
        completedSamples: 12,
        targetSamples: 64,
      })
    })

    expect(
      selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
    ).toMatchObject({
      status: 'rendering',
      completedSamples: 12,
      targetSamples: 64,
    })

    act(() => {
      renderPreviewStatusHandler?.({
        status: 'complete',
        completedSamples: 64,
        targetSamples: 64,
      })
    })

    expect(
      selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
    ).toMatchObject({
      status: 'complete',
      completedSamples: 64,
      targetSamples: 64,
    })
  })

  it('suppresses draft graph preview parts when the viewport result mode is final', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetParts.mock.calls.at(-1)?.[0]).toEqual([])
  })

  it('renders final mode from authoritative mesh preview instead of artifact preview outputs', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const acceptedPreviewArtifact = {
      id: 'artifact-1',
      kind: 'box' as const,
      label: 'Baseplate',
      partKeyStr: 'baseplate',
      partKey: { id: 'baseplate', instance: null },
      params: { width: 10, length: 20, height: 5 },
    }

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedPreviewBuildOutputs: [acceptedPreviewArtifact],
            acceptedAuthoritativeGeometryResult: createAuthoritativeGeometryResultBundle({
              request: {
                graphDocumentId: 'graph-document-1',
                buildRequestId: 'build-request-1',
                partKeys: ['baseplate'],
              },
              bodies: {},
              meshPreview: {
                vertices: [
                  0, 0, 0,
                  2, 0, 0,
                  0, 1, 0,
                ],
                indices: [0, 1, 2],
              },
              diagnostics: [],
              trace: [],
              authoritativeHandle: {
                resourceType: 'shape_set',
                handleId: 'shape-set-1',
              },
            }),
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const finalLayerArgs = [...viewerSetViewportRenderLayers.mock.calls]
      .map((call) => call[0] as { baseParts?: unknown[]; overlayParts?: unknown[] })
      .reduce<{ baseParts?: unknown[]; overlayParts?: unknown[] }>(
        (best, current) =>
          ((current.baseParts?.length ?? 0) + (current.overlayParts?.length ?? 0)) >
          ((best.baseParts?.length ?? 0) + (best.overlayParts?.length ?? 0))
            ? current
            : best,
        {},
      )
    expect(finalLayerArgs.baseParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
        artifact: expect.objectContaining({
          kind: 'mesh',
          label: 'Authoritative Preview',
          partKeyStr: 'graph-document-1:authoritative-preview',
          mesh: {
            vertices: [
              0, 0, 0,
              2, 0, 0,
              0, 1, 0,
            ],
            indices: [0, 1, 2],
          },
        }),
      }),
    ])
  })

  it('captures real loaded reference part rows into the workspace after load succeeds', async () => {
    const load = deferred<void>()
    viewerEnsureReferenceLoaded.mockReturnValue(load.promise)
    viewerGetReferencePartDescriptors.mockReturnValue([
      { partKey: 'reference-part:shoe:shoe-1:0', label: 'Upper', sourceMeshIndex: 0 },
      { partKey: 'reference-part:shoe:shoe-1:1', label: 'Sole', sourceMeshIndex: 1 },
    ])

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      load.resolve()
      await load.promise
    })

    expect(useAppStore.getState().referenceWorkspace.partRowsByReferenceId['shoe:shoe-1']).toEqual([
      {
        rowId: 'reference-part-row:reference-part:shoe:shoe-1:0',
        partKey: 'reference-part:shoe:shoe-1:0',
        label: 'Upper',
        sourceMeshIndex: 0,
      },
      {
        rowId: 'reference-part-row:reference-part:shoe:shoe-1:1',
        partKey: 'reference-part:shoe:shoe-1:1',
        label: 'Sole',
        sourceMeshIndex: 1,
      },
    ])
  })

  it('passes exploded reference provenance into viewer loads and keeps exploded child part rows empty', async () => {
    const load = deferred<void>()
    viewerEnsureReferenceLoaded.mockReturnValue(load.promise)
    viewerGetReferencePartDescriptors.mockReturnValue([
      { partKey: 'reference-part:child:0', label: 'Should Stay Hidden', sourceMeshIndex: 0 },
    ])

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    const wrapperReferenceId = useAppStore.getState().addImportedReference({
      fileName: 'wrapper.glb',
      fileType: 'glb',
      objectUrl: 'blob:wrapper',
    })
    useAppStore.getState().setReferenceItemLoadState(wrapperReferenceId, 'loaded')
    useAppStore.getState().setReferenceItemPartRows(wrapperReferenceId, [
      {
        partKey: 'reference-part:wrapper:0',
        label: 'Upper',
        sourceMeshIndex: 0,
      },
      {
        partKey: 'reference-part:wrapper:1',
        label: 'Sole',
        sourceMeshIndex: 1,
      },
    ])
    expect(useAppStore.getState().explodeImportedReference(wrapperReferenceId)).toBe(true)

    const explodedChildReferenceId = useAppStore
      .getState()
      .referenceWorkspace.importedReferenceOrder.find(
        (referenceId) =>
          useAppStore.getState().referenceWorkspace.importedReferencesById[referenceId]
            ?.explodedFromReferenceId === wrapperReferenceId,
      )
    expect(explodedChildReferenceId).not.toBeNull()

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility(explodedChildReferenceId!)
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({
      referenceId: explodedChildReferenceId,
      assetPath: 'blob:wrapper',
      explodedFromReferenceId: wrapperReferenceId,
      sourcePartKey: 'reference-part:wrapper:0',
      sourceMeshIndex: 0,
    })

    await act(async () => {
      load.resolve()
      await load.promise
    })

    expect(
      useAppStore.getState().referenceWorkspace.partRowsByReferenceId[explodedChildReferenceId!],
    ).toEqual([])
  })

  it('keeps exploded children loaded and visible after splitting a wrapper that is already live in the viewer', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    const wrapperReferenceId = useAppStore.getState().addImportedReference({
      fileName: 'wrapper.glb',
      fileType: 'glb',
      objectUrl: 'blob:wrapper',
    })

    act(() => {
      useAppStore.getState().setReferenceItemLoadState(wrapperReferenceId, 'loaded')
      useAppStore.getState().setReferenceItemVisibility(wrapperReferenceId, true)
      useAppStore.getState().setReferenceItemPartRows(wrapperReferenceId, [
        {
          partKey: 'reference-part:wrapper:0',
          label: 'Upper',
          sourceMeshIndex: 0,
        },
        {
          partKey: 'reference-part:wrapper:1',
          label: 'Sole',
          sourceMeshIndex: 1,
        },
      ])
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetReferenceVisible).toHaveBeenCalledWith(wrapperReferenceId, true)

    viewerHandoffExplodedReferenceChildren.mockImplementation(
      (
        _wrapperReferenceId: string,
        children: Array<{ referenceId: string }>,
      ) => children.map((child) => child.referenceId),
    )

    await act(async () => {
      expect(useAppStore.getState().explodeImportedReference(wrapperReferenceId)).toBe(true)
    })

    const state = useAppStore.getState()
    const childReferenceIds = state.referenceWorkspace.importedReferenceOrder.filter(
      (referenceId) =>
        state.referenceWorkspace.importedReferencesById[referenceId]?.explodedFromReferenceId ===
        wrapperReferenceId,
    )

    expect(viewerHandoffExplodedReferenceChildren).toHaveBeenCalledTimes(1)
    expect(viewerHandoffExplodedReferenceChildren.mock.calls[0]?.[0]).toBe(wrapperReferenceId)
    expect(viewerHandoffExplodedReferenceChildren.mock.calls[0]?.[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          explodedFromReferenceId: wrapperReferenceId,
          sourcePartKey: 'reference-part:wrapper:0',
          sourceMeshIndex: 0,
        }),
        expect.objectContaining({
          explodedFromReferenceId: wrapperReferenceId,
          sourcePartKey: 'reference-part:wrapper:1',
          sourceMeshIndex: 1,
        }),
      ]),
    )
    expect(viewerHandoffExplodedReferenceChildren.mock.calls[0]?.[2]).toBe(true)
    expect(viewerEnsureReferenceLoaded).not.toHaveBeenCalled()
    expect(state.referenceWorkspace.loadStateById[childReferenceIds[0]!]).toBe('loaded')
    expect(state.referenceWorkspace.loadStateById[childReferenceIds[1]!]).toBe('loaded')
    expect(state.referenceWorkspace.visibilityById[childReferenceIds[0]!]).toBe(true)
    expect(state.referenceWorkspace.visibilityById[childReferenceIds[1]!]).toBe(true)
  })

  it('hands off unloaded direct split siblings from one loaded group source without falling back to repeated child loads', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        importedReferencesById: {
          ...state.referenceWorkspace.importedReferencesById,
          'split-child-a': {
            referenceId: 'split-child-a',
            sourceKind: 'imported',
            categoryId: 'user-references',
            label: 'Split Child A',
            fileType: 'glb',
            assetPath: 'blob:shared-split-glb',
            parentAssemblyId: null,
            parentComponentId: 'component-split',
            directPartSourceKind: 'split-import-child',
            directPartSourceGroupId: 'direct-part-source-group:1',
            explodedFromReferenceId: null,
            sourcePartKey: 'reference-part:shared:0',
            sourceMeshIndex: 0,
          },
          'split-child-b': {
            referenceId: 'split-child-b',
            sourceKind: 'imported',
            categoryId: 'user-references',
            label: 'Split Child B',
            fileType: 'glb',
            assetPath: 'blob:shared-split-glb',
            parentAssemblyId: null,
            parentComponentId: 'component-split',
            directPartSourceKind: 'split-import-child',
            directPartSourceGroupId: 'direct-part-source-group:1',
            explodedFromReferenceId: null,
            sourcePartKey: 'reference-part:shared:1',
            sourceMeshIndex: 1,
          },
          'split-child-c': {
            referenceId: 'split-child-c',
            sourceKind: 'imported',
            categoryId: 'user-references',
            label: 'Split Child C',
            fileType: 'glb',
            assetPath: 'blob:shared-split-glb',
            parentAssemblyId: null,
            parentComponentId: 'component-split',
            directPartSourceKind: 'split-import-child',
            directPartSourceGroupId: 'direct-part-source-group:1',
            explodedFromReferenceId: null,
            sourcePartKey: 'reference-part:shared:0',
            sourceMeshIndex: 0,
          },
        },
        importedReferenceOrder: ['split-child-a', 'split-child-b', 'split-child-c'],
        visibilityById: {
          ...state.referenceWorkspace.visibilityById,
          'split-child-a': true,
          'split-child-b': true,
          'split-child-c': true,
        },
        loadStateById: {
          ...state.referenceWorkspace.loadStateById,
          'split-child-a': 'loaded',
          'split-child-b': 'unloaded',
          'split-child-c': 'unloaded',
        },
        errorById: {
          ...state.referenceWorkspace.errorById,
          'split-child-a': null,
          'split-child-b': null,
          'split-child-c': null,
        },
        partRowsByReferenceId: {
          ...state.referenceWorkspace.partRowsByReferenceId,
          'split-child-a': [],
          'split-child-b': [],
          'split-child-c': [],
        },
      },
    }))

    viewerHandoffDirectPartBackedReferenceChildren.mockImplementation(
      (_groupId: string, children: Array<{ referenceId: string }>) =>
        children.map((child) => child.referenceId),
    )

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(viewerHandoffDirectPartBackedReferenceChildren).toHaveBeenCalledTimes(1)
    expect(viewerHandoffDirectPartBackedReferenceChildren.mock.calls[0]?.[0]).toBe(
      'direct-part-source-group:1',
    )
    expect(viewerHandoffDirectPartBackedReferenceChildren.mock.calls[0]?.[1]).toEqual([
      expect.objectContaining({
        referenceId: 'split-child-b',
        directPartSourceKind: 'split-import-child',
        directPartSourceGroupId: 'direct-part-source-group:1',
        sourcePartKey: 'reference-part:shared:1',
        sourceMeshIndex: 1,
      }),
      expect.objectContaining({
        referenceId: 'split-child-c',
        directPartSourceKind: 'split-import-child',
        directPartSourceGroupId: 'direct-part-source-group:1',
        sourcePartKey: 'reference-part:shared:0',
        sourceMeshIndex: 0,
      }),
    ])
    expect(viewerHandoffDirectPartBackedReferenceChildren.mock.calls[0]?.[2]).toBe(true)
    expect(viewerEnsureReferenceLoaded).not.toHaveBeenCalled()
    expect(useAppStore.getState().referenceWorkspace.loadStateById['split-child-b']).toBe('loaded')
    expect(useAppStore.getState().referenceWorkspace.loadStateById['split-child-c']).toBe('loaded')
    expect(useAppStore.getState().referenceWorkspace.partRowsByReferenceId['split-child-b']).toEqual(
      [],
    )
    expect(useAppStore.getState().referenceWorkspace.partRowsByReferenceId['split-child-c']).toEqual(
      [],
    )
  })

  it('keeps a failed STEP row retryable by clearing visibility on error and loading again after the next click', async () => {
    const firstError = new Error('STEP import failed')
    viewerEnsureReferenceLoaded
      .mockRejectedValueOnce(firstError)
      .mockResolvedValueOnce(undefined)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('hook:large')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['hook:large']).toBe('error')
    expect(useAppStore.getState().referenceWorkspace.visibilityById['hook:large']).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.errorById['hook:large']).toBe('STEP import failed')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('hook:large')
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['hook:large']).toBe('loaded')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith('hook:large', true)
  })

  it('renders Browser-enabled graph outputs even when they are not the focused editor graph', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const firstPreviewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const secondPreviewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-cube',
        sourceNodeId: 'node-second-1',
        sourcePartKey: 'cube',
      },
    ])

    act(() => {
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation: firstPreviewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            acceptedBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation: firstPreviewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
          [secondGraphId]: {
            ...state.graphRuntimeByDocumentId[secondGraphId],
            previewPreparation: secondPreviewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-2',
                kind: 'box',
                label: 'Cube',
                partKeyStr: 'cube',
                partKey: { id: 'cube', instance: null },
                params: { width: 4, length: 4, height: 4 },
              },
            ],
            acceptedBuildOutputs: [
              {
                id: 'artifact-2',
                kind: 'box',
                label: 'Cube',
                partKeyStr: 'cube',
                partKey: { id: 'cube', instance: null },
                params: { width: 4, length: 4, height: 4 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: secondGraphId,
              previewPreparation: secondPreviewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-2',
                  kind: 'box',
                  label: 'Cube',
                  partKeyStr: 'cube',
                  partKey: { id: 'cube', instance: null },
                  params: { width: 4, length: 4, height: 4 },
                },
              ],
              publishedAtBuildSeq: 2,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
            {
              graphDocumentId: secondGraphId,
              label: 'Graph 2',
              sourceFilePath: null,
              orderIndex: 1,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: [
                'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
                `project-object:project-file-1:${secondGraphId}:output-object:slot-cube`,
              ],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object:slot-baseplate': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
            [`project-object:project-file-1:${secondGraphId}:output-object:slot-cube`]: {
              objectId: `project-object:project-file-1:${secondGraphId}:output-object:slot-cube`,
              ownerGraphDocumentId: secondGraphId,
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: secondGraphId,
              sourceOutputEntryId: 'output-entry:slot-cube:node-second-1',
              sourceNodeId: 'node-second-1',
              slotId: 'slot-cube',
              label: 'Object 2',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const initialParts = [...viewerSetParts.mock.calls]
      .map((call) => (call[0] ?? []) as Array<{ viewerKey: string }>)
      .reduce<Array<{ viewerKey: string }>>(
        (best, parts) => (parts.length > best.length ? parts : best),
        [],
      )
    expect(initialParts.map((part) => part.viewerKey)).toEqual([
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
      `${secondGraphId}:output-entry:slot-cube:node-second-1`,
    ])

    act(() => {
      useAppStore.setState((state) => ({
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          [secondGraphId]: 'off',
        },
      }))
    })

    const partsAfterSuppressingSecondGraph = (viewerSetParts.mock.calls.at(-1)?.[0] ?? []) as Array<{
      viewerKey: string
    }>
    expect(partsAfterSuppressingSecondGraph.map((part) => part.viewerKey)).toEqual([
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    ])
  })

  it('renders a new graphs first published output immediately even when preview outputs lag behind', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const firstPreviewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const secondPreviewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-cube',
        sourceNodeId: 'node-second-1',
        sourcePartKey: 'cube',
      },
    ])

    act(() => {
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation: firstPreviewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            acceptedBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation: firstPreviewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
          [secondGraphId]: {
            ...state.graphRuntimeByDocumentId[secondGraphId],
            previewPreparation: secondPreviewPreparation,
            acceptedPreviewBuildOutputs: [],
            acceptedBuildOutputs: [
              {
                id: 'artifact-2',
                kind: 'box',
                label: 'Cube',
                partKeyStr: 'cube',
                partKey: { id: 'cube', instance: null },
                params: { width: 4, length: 4, height: 4 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: secondGraphId,
              previewPreparation: secondPreviewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-2',
                  kind: 'box',
                  label: 'Cube',
                  partKeyStr: 'cube',
                  partKey: { id: 'cube', instance: null },
                  params: { width: 4, length: 4, height: 4 },
                },
              ],
              publishedAtBuildSeq: 2,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
            {
              graphDocumentId: secondGraphId,
              label: 'Graph 2',
              sourceFilePath: null,
              orderIndex: 1,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: [
                'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
                `project-object:project-file-1:${secondGraphId}:output-object:slot-cube`,
              ],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object:slot-baseplate': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
            [`project-object:project-file-1:${secondGraphId}:output-object:slot-cube`]: {
              objectId: `project-object:project-file-1:${secondGraphId}:output-object:slot-cube`,
              ownerGraphDocumentId: secondGraphId,
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: secondGraphId,
              sourceOutputEntryId: 'output-entry:slot-cube:node-second-1',
              sourceNodeId: 'node-second-1',
              slotId: 'slot-cube',
              label: 'Object 2',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const initialParts = (viewerSetParts.mock.calls.at(-1)?.[0] ?? []) as Array<{ viewerKey: string }>
    expect(initialParts.map((part) => part.viewerKey)).toEqual([
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
      `${secondGraphId}:output-entry:slot-cube:node-second-1`,
    ])
  })

  it('only renders shared viewer parts that are backed by current project content rows', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const firstPreviewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const secondPreviewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-cube',
        sourceNodeId: 'node-second-1',
        sourcePartKey: 'cube',
      },
    ])

    act(() => {
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation: firstPreviewPreparation,
            acceptedBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation: firstPreviewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
          [secondGraphId]: {
            ...state.graphRuntimeByDocumentId[secondGraphId],
            previewPreparation: secondPreviewPreparation,
            acceptedBuildOutputs: [
              {
                id: 'artifact-2',
                kind: 'box',
                label: 'Cube',
                partKeyStr: 'cube',
                partKey: { id: 'cube', instance: null },
                params: { width: 4, length: 4, height: 4 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: secondGraphId,
              previewPreparation: secondPreviewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-2',
                  kind: 'box',
                  label: 'Cube',
                  partKeyStr: 'cube',
                  partKey: { id: 'cube', instance: null },
                  params: { width: 4, length: 4, height: 4 },
                },
              ],
              publishedAtBuildSeq: 2,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
            {
              graphDocumentId: secondGraphId,
              label: 'Graph 2',
              sourceFilePath: null,
              orderIndex: 1,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-object:project-file-1:graph-document-1:output-object:slot-baseplate'],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object:slot-baseplate': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const initialParts = (viewerSetParts.mock.calls.at(-1)?.[0] ?? []) as Array<{ viewerKey: string }>
    expect(initialParts.map((part) => part.viewerKey)).toEqual([
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    ])
  })

  it('loads a reference batch one item at a time in queue order', async () => {
    const firstLoad = deferred<void>()
    const secondLoad = deferred<void>()
    viewerEnsureReferenceLoaded
      .mockImplementationOnce(() => firstLoad.promise)
      .mockImplementationOnce(() => secondLoad.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForCategory('shoes')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-1' })
    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch?.activeReferenceId).toBe(
      'shoe:shoe-1',
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)

    await act(async () => {
      firstLoad.resolve()
      await firstLoad.promise
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerEnsureReferenceLoaded.mock.calls[1]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-2' })

    await act(async () => {
      secondLoad.resolve()
      await secondLoad.promise
    })
  })

  it('replaces queued batch work after the in-flight item settles without letting stale completion corrupt the new batch', async () => {
    const firstLoad = deferred<void>()
    const secondLoad = deferred<void>()
    viewerEnsureReferenceLoaded
      .mockImplementationOnce(() => firstLoad.promise)
      .mockImplementationOnce(() => secondLoad.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForAll()
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({
      referenceId: 'footpad:pubpad-full-assembly',
    })

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForCategory('shoes')
    })

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      activeReferenceId: 'footpad:pubpad-full-assembly',
      targetIds: ['shoe:shoe-1', 'shoe:shoe-2', 'shoe:shoe-3'],
    })

    await act(async () => {
      firstLoad.resolve()
      await firstLoad.promise
    })

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch?.completedIds).toEqual([])
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerEnsureReferenceLoaded.mock.calls[1]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-1' })

    await act(async () => {
      secondLoad.resolve()
      await secondLoad.promise
    })
  })

  it('advances the batch after a failed reference load and counts the failure as completed progress', async () => {
    const secondLoad = deferred<void>()
    viewerEnsureReferenceLoaded
      .mockRejectedValueOnce(new Error('Shoe 1 failed'))
      .mockImplementationOnce(() => secondLoad.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForCategory('shoes')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('error')
    expect(useAppStore.getState().referenceWorkspace.visibilityById['shoe:shoe-1']).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      failedIds: ['shoe:shoe-1'],
      activeReferenceId: 'shoe:shoe-2',
    })
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerEnsureReferenceLoaded.mock.calls[1]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-2' })

    await act(async () => {
      secondLoad.resolve()
      await secondLoad.promise
    })
  })

  it('removes an imported reference object from the viewer when the workspace row is removed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    let importedReferenceId: string | null = null
    act(() => {
      importedReferenceId = useAppStore.getState().addImportedReference({
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-1',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(importedReferenceId).not.toBeNull()

    act(() => {
      useAppStore.getState().removeImportedReference(importedReferenceId!)
    })

    expect(viewerRemoveReference).toHaveBeenCalledWith(importedReferenceId)
  })

  it('syncs an active reference transform session into the viewer and exits when the reference is hidden', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetViewerTransformSession).toHaveBeenCalledWith({
      targetKind: 'reference',
      targetId: 'shoe:shoe-1',
      mode: 'translate',
      space: 'local',
      entryOrigin: null,
    })

    act(() => {
      useAppStore.getState().setReferenceItemVisibility('shoe:shoe-1', false)
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
  })

  it('keeps reference transform space synced between the viewer callback and shared session state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const spaceChangeHandler = viewerSetOnViewerTransformSpaceChange.mock.calls.at(-1)?.[0] as
      | ((space: 'local' | 'world') => void)
      | undefined

    expect(spaceChangeHandler).toBeTypeOf('function')

    act(() => {
      spaceChangeHandler?.('world')
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.space).toBe(
      'world',
    )
    expect(viewerSetViewerTransformSession).toHaveBeenLastCalledWith({
      targetKind: 'reference',
      targetId: 'shoe:shoe-1',
      mode: 'translate',
      space: 'world',
      entryOrigin: null,
    })
  })

  it('syncs published-object viewer transform groups, session, and overrides into the viewer', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-a',
        sourceNodeId: 'node-box-a',
        sourcePartKey: 'slot-a',
        objectId: 'object-a',
        label: 'Object A',
      },
      {
        slotId: 'slot-b',
        sourceNodeId: 'node-box-b',
        sourcePartKey: 'slot-b',
        objectId: 'object-b',
        label: 'Object B',
      },
    ])

    act(() => {
      useAppStore.getState().beginContentObjectTransformShell('object-a')
      useAppStore.getState().beginContentObjectTransformEntry('rotate')
      useAppStore.getState().setContentObjectTransformSnapEnabled('object-a', 'translate', true)
      useAppStore.getState().setContentObjectTransformSnapValue('object-a', 'translate', 10)
      useAppStore.getState().setContentObjectTransformSnapEnabled('object-a', 'rotate', true)
      useAppStore.getState().setContentObjectTransformSnapValue('object-a', 'rotate', 15)
      useAppStore.getState().setContentObjectTransformOverride('object-a', {
        position: { x: 12, y: -3, z: 5 },
        rotationDeg: { x: 0, y: 30, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetContentObjectTransformGroups).toHaveBeenCalledWith([
      {
        objectId: 'object-a',
        partKeys: ['graph-document-1:output-entry:slot-a:node-box-a'],
      },
    ])
    expect(viewerSetViewerTransformSession).toHaveBeenCalledWith({
      targetKind: 'content-object',
      targetId: 'object-a',
      mode: 'rotate',
      space: 'local',
      entryOrigin: {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    })
    expect(viewerSetContentObjectTransformOverrides).toHaveBeenCalledWith(
      expect.objectContaining({
        'object-a': {
          position: { x: 12, y: -3, z: 5 },
          rotationDeg: { x: 0, y: 30, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
      }),
    )
    expect(viewerSetGizmoSnap).toHaveBeenCalledWith({
      translate: { x: 10, y: 10, z: 10 },
      rotate: { x: 15, y: 15, z: 15 },
      scale: undefined,
    })
  })

  it('appends reference transform history when the viewer commit callback fires', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 5, y: -2, z: 9 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const commitHandler = viewerSetOnViewerTransformCommit.mock.calls.at(-1)?.[0] as
      | (() => void)
      | undefined
    const exitHandler = viewerSetOnViewerTransformExit.mock.calls.at(-1)?.[0] as
      | (() => void)
      | undefined

    expect(commitHandler).toBeTypeOf('function')
    expect(exitHandler).toBeTypeOf('function')

    act(() => {
      commitHandler?.()
    })

    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'],
    ).toMatchObject([
      {
        kind: 'move',
        delta: { x: 5, y: -2, z: 9 },
        after: { x: 5, y: -2, z: 9 },
        transformAfter: {
          position: { x: 5, y: -2, z: 9 },
          rotationDeg: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
        locked: false,
      },
    ])

    act(() => {
      exitHandler?.()
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
  })

  it('builds the active reference history overlay vm from committed move rotate and scale rows', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.setState((state) => ({
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession:
            state.referenceWorkspace.activeReferenceTransformSession === null
              ? null
              : {
                  ...state.referenceWorkspace.activeReferenceTransformSession,
                  historyScrubIndex: 4,
                  draftTransform: {
                    position: { x: 9, y: -1, z: 2 },
                    rotationDeg: { x: 0, y: 20, z: 0 },
                    scale: { x: 1.5, y: 1, z: 1 },
                  },
                },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            'shoe:shoe-1': [
              {
                entryId: 'move-1',
                sessionId: 'transform-session:shoe:shoe-1:1',
                sessionOrdinal: 1,
                kind: 'move',
                delta: { x: 5, y: 0, z: 0 },
                after: { x: 5, y: 0, z: 0 },
                transformAfter: {
                  position: { x: 5, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'rotate-1',
                sessionId: 'transform-session:shoe:shoe-1:1',
                sessionOrdinal: 1,
                kind: 'rotate',
                delta: { x: 0, y: 20, z: 0 },
                after: { x: 0, y: 20, z: 0 },
                transformAfter: {
                  position: { x: 5, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 20, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'scale-1',
                sessionId: 'transform-session:shoe:shoe-1:1',
                sessionOrdinal: 1,
                kind: 'scale',
                delta: { x: 0.5, y: 0, z: 0 },
                after: { x: 1.5, y: 1, z: 1 },
                transformAfter: {
                  position: { x: 5, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 20, z: 0 },
                  scale: { x: 1.5, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'move-2',
                sessionId: 'transform-session:shoe:shoe-1:2',
                sessionOrdinal: 2,
                kind: 'move',
                delta: { x: 4, y: -1, z: 2 },
                after: { x: 9, y: -1, z: 2 },
                transformAfter: {
                  position: { x: 9, y: -1, z: 2 },
                  rotationDeg: { x: 0, y: 20, z: 0 },
                  scale: { x: 1.5, y: 1, z: 1 },
                },
                locked: false,
              },
            ],
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetViewerTransformHistoryOverlay.mock.calls).toContainEqual([
      {
        target: { kind: 'reference', referenceId: 'shoe:shoe-1' },
        movePoints: [
          { x: 0, y: 0, z: 0 },
          { x: 5, y: 0, z: 0 },
          { x: 9, y: -1, z: 2 },
        ],
        rotateEntries: [
          {
            entryId: 'rotate-1',
            position: { x: 5, y: 0, z: 0 },
            beforeRotationDeg: { x: 0, y: 0, z: 0 },
            afterRotationDeg: { x: 0, y: 20, z: 0 },
          },
        ],
        scaleEntries: [
          {
            entryId: 'scale-1',
            position: { x: 5, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 20, z: 0 },
            beforeScale: { x: 1, y: 1, z: 1 },
            afterScale: { x: 1.5, y: 1, z: 1 },
          },
        ],
      },
    ])
  })

  it('hides future history overlay rows beyond the active scrub head', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.setState((state) => ({
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession:
            state.referenceWorkspace.activeReferenceTransformSession === null
              ? null
              : {
                  ...state.referenceWorkspace.activeReferenceTransformSession,
                  historyScrubIndex: 2,
                  draftTransform: {
                    position: { x: 5, y: 0, z: 0 },
                    rotationDeg: { x: 0, y: 20, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                  },
                },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            'shoe:shoe-1': [
              {
                entryId: 'move-1',
                sessionId: 'transform-session:shoe:shoe-1:1',
                sessionOrdinal: 1,
                kind: 'move',
                delta: { x: 5, y: 0, z: 0 },
                after: { x: 5, y: 0, z: 0 },
                transformAfter: {
                  position: { x: 5, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'rotate-1',
                sessionId: 'transform-session:shoe:shoe-1:1',
                sessionOrdinal: 1,
                kind: 'rotate',
                delta: { x: 0, y: 20, z: 0 },
                after: { x: 0, y: 20, z: 0 },
                transformAfter: {
                  position: { x: 5, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 20, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'scale-1',
                sessionId: 'transform-session:shoe:shoe-1:1',
                sessionOrdinal: 1,
                kind: 'scale',
                delta: { x: 0.5, y: 0, z: 0 },
                after: { x: 1.5, y: 1, z: 1 },
                transformAfter: {
                  position: { x: 5, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 20, z: 0 },
                  scale: { x: 1.5, y: 1, z: 1 },
                },
                locked: false,
              },
            ],
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetViewerTransformHistoryOverlay).toHaveBeenCalledWith({
      target: { kind: 'reference', referenceId: 'shoe:shoe-1' },
      movePoints: [
        { x: 0, y: 0, z: 0 },
        { x: 5, y: 0, z: 0 },
      ],
      rotateEntries: [
        {
          entryId: 'rotate-1',
          position: { x: 5, y: 0, z: 0 },
          beforeRotationDeg: { x: 0, y: 0, z: 0 },
          afterRotationDeg: { x: 0, y: 20, z: 0 },
        },
      ],
      scaleEntries: [],
    })
  })

  it('builds the active content-object history overlay vm from committed move rotate and scale rows', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginContentObjectTransformShell('object-a')
      useAppStore.setState((state) => ({
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession:
            state.referenceWorkspace.activeContentObjectTransformSession === null
              ? null
              : {
                  ...state.referenceWorkspace.activeContentObjectTransformSession,
                  historyScrubIndex: 4,
                  draftTransform: {
                    position: { x: 6, y: -3, z: 4 },
                    rotationDeg: { x: 0, y: 35, z: 0 },
                    scale: { x: 1.5, y: 1.2, z: 1 },
                  },
                },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            'object-a': [
              {
                entryId: 'move-1',
                sessionId: 'content-object-transform-session:object-a:1',
                sessionOrdinal: 1,
                kind: 'move',
                delta: { x: 2, y: 0, z: 0 },
                after: { x: 2, y: 0, z: 0 },
                transformAfter: {
                  position: { x: 2, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'rotate-1',
                sessionId: 'content-object-transform-session:object-a:1',
                sessionOrdinal: 1,
                kind: 'rotate',
                delta: { x: 0, y: 35, z: 0 },
                after: { x: 0, y: 35, z: 0 },
                transformAfter: {
                  position: { x: 2, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 35, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'scale-1',
                sessionId: 'content-object-transform-session:object-a:1',
                sessionOrdinal: 1,
                kind: 'scale',
                delta: { x: 0.5, y: 0.2, z: 0 },
                after: { x: 1.5, y: 1.2, z: 1 },
                transformAfter: {
                  position: { x: 2, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 35, z: 0 },
                  scale: { x: 1.5, y: 1.2, z: 1 },
                },
                locked: false,
              },
              {
                entryId: 'move-2',
                sessionId: 'content-object-transform-session:object-a:2',
                sessionOrdinal: 2,
                kind: 'move',
                delta: { x: 4, y: -3, z: 4 },
                after: { x: 6, y: -3, z: 4 },
                transformAfter: {
                  position: { x: 6, y: -3, z: 4 },
                  rotationDeg: { x: 0, y: 35, z: 0 },
                  scale: { x: 1.5, y: 1.2, z: 1 },
                },
                locked: false,
              },
            ],
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetViewerTransformHistoryOverlay.mock.calls).toContainEqual([
      {
        target: { kind: 'content-object', objectId: 'object-a' },
        movePoints: [
          { x: 0, y: 0, z: 0 },
          { x: 2, y: 0, z: 0 },
          { x: 6, y: -3, z: 4 },
        ],
        rotateEntries: [
          {
            entryId: 'rotate-1',
            position: { x: 2, y: 0, z: 0 },
            beforeRotationDeg: { x: 0, y: 0, z: 0 },
            afterRotationDeg: { x: 0, y: 35, z: 0 },
          },
        ],
        scaleEntries: [
          {
            entryId: 'scale-1',
            position: { x: 2, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 35, z: 0 },
            beforeScale: { x: 1, y: 1, z: 1 },
            afterScale: { x: 1.5, y: 1.2, z: 1 },
          },
        ],
      },
    ])
  })

  it('stores the active reference transform handle when the viewer handle callback fires', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformEntry('translate')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const handleChangeHandler = viewerSetOnViewerTransformHandleChange.mock.calls.at(-1)?.[0] as
      | ((handle: { mode: 'translate'; kind: 'axis'; axis: 'y' }) => void)
      | undefined

    expect(handleChangeHandler).toBeTypeOf('function')

    act(() => {
      handleChangeHandler?.({ mode: 'translate', kind: 'axis', axis: 'y' })
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.activeHandle).toMatchObject(
      {
        mode: 'translate',
        kind: 'axis',
        axis: 'y',
      },
    )
  })

  it('promotes the reference transform shell into an active entry when the viewer center handle callback fires', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const handleChangeHandler = viewerSetOnViewerTransformHandleChange.mock.calls.at(-1)?.[0] as
      | ((handle: { mode: 'translate'; kind: 'center' }) => void)
      | undefined

    expect(handleChangeHandler).toBeTypeOf('function')

    act(() => {
      handleChangeHandler?.({ mode: 'translate', kind: 'center' })
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      mode: 'translate',
      entryActive: true,
      activeHandle: {
        mode: 'translate',
        kind: 'center',
      },
    })
  })

  it('pushes the active reference transform snap values into the viewer gizmo snap state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.getState().setReferenceTransformSnapEnabled('shoe:shoe-1', 'translate', true)
      useAppStore.getState().setReferenceTransformSnapValue('shoe:shoe-1', 'translate', 10)
      useAppStore.getState().setReferenceTransformSnapEnabled('shoe:shoe-1', 'rotate', true)
      useAppStore.getState().setReferenceTransformSnapValue('shoe:shoe-1', 'rotate', 22.5)
      useAppStore.getState().setReferenceTransformSnapEnabled('shoe:shoe-1', 'scale', true)
      useAppStore.getState().setReferenceTransformSnapValue('shoe:shoe-1', 'scale', 0.25)
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetGizmoSnap).toHaveBeenCalledWith({
      translate: { x: 10, y: 10, z: 10 },
      rotate: { x: 22.5, y: 22.5, z: 22.5 },
      scale: { x: 0.25, y: 0.25, z: 0.25 },
    })
  })

  it('pushes the active content-object transform snap values into the viewer gizmo snap state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().beginContentObjectTransformShell('object-a')
      useAppStore.getState().setViewerTransformSnapEnabled(
        { kind: 'content-object', objectId: 'object-a' },
        'translate',
        true,
      )
      useAppStore.getState().setViewerTransformSnapValue(
        { kind: 'content-object', objectId: 'object-a' },
        'translate',
        12,
      )
      useAppStore.getState().setViewerTransformSnapEnabled(
        { kind: 'content-object', objectId: 'object-a' },
        'rotate',
        true,
      )
      useAppStore.getState().setViewerTransformSnapValue(
        { kind: 'content-object', objectId: 'object-a' },
        'rotate',
        30,
      )
      useAppStore.getState().setViewerTransformSnapEnabled(
        { kind: 'content-object', objectId: 'object-a' },
        'scale',
        true,
      )
      useAppStore.getState().setViewerTransformSnapValue(
        { kind: 'content-object', objectId: 'object-a' },
        'scale',
        0.5,
      )
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetGizmoSnap).toHaveBeenCalledWith({
      translate: { x: 12, y: 12, z: 12 },
      rotate: { x: 30, y: 30, z: 30 },
      scale: { x: 0.5, y: 0.5, z: 0.5 },
    })
  })

  it('forwards move snap dot radius changes into the viewer helper seam', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetReferenceTransformMoveSnapDotVisibleRadiusMultiplier).toHaveBeenCalledWith(40)

    act(() => {
      useAppStore.getState().setReferenceTransformMoveSnapDotVisibleRadiusMultiplier(170)
    })

    expect(viewerSetReferenceTransformMoveSnapDotVisibleRadiusMultiplier).toHaveBeenLastCalledWith(
      170,
    )
  })

  it('forwards move snap dots enabled changes into the viewer helper seam', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetReferenceTransformMoveSnapDotsEnabled).toHaveBeenCalledWith(true)

    act(() => {
      useAppStore.getState().setReferenceTransformMoveSnapDotsEnabled(false)
    })

    expect(viewerSetReferenceTransformMoveSnapDotsEnabled).toHaveBeenLastCalledWith(false)
  })

  it('forwards preview last move snap dots changes into the viewer helper seam', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetReferenceTransformPreviewLastMoveSnapDotsEnabled).toHaveBeenCalledWith(false)

    act(() => {
      useAppStore.getState().setReferenceTransformPreviewLastMoveSnapDotsEnabled(true)
    })

    expect(viewerSetReferenceTransformPreviewLastMoveSnapDotsEnabled).toHaveBeenLastCalledWith(
      true,
    )
  })

  it('forwards rotate snap preview enabled changes into the viewer helper seam', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetReferenceTransformRotateSnapPreviewEnabled).toHaveBeenCalledWith(true)

    act(() => {
      useAppStore.getState().setReferenceTransformRotateSnapPreviewEnabled(false)
    })

    expect(viewerSetReferenceTransformRotateSnapPreviewEnabled).toHaveBeenLastCalledWith(false)
  })

  it('forwards rotate snap preview presentation changes into the viewer helper seam', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetReferenceTransformRotateSnapPreviewLineSize).toHaveBeenCalledWith(1)
    expect(viewerSetReferenceTransformRotateSnapPreviewLineThickness).toHaveBeenCalledWith(1)
    expect(viewerSetReferenceTransformRotateSnapPreviewRadiusDeg).toHaveBeenCalledWith(60)
    expect(viewerSetReferenceTransformRotateSnapPreviewDelayMs).toHaveBeenCalledWith(120)

    act(() => {
      useAppStore.getState().setReferenceTransformRotateSnapPreviewLineSize(1.5)
      useAppStore.getState().setReferenceTransformRotateSnapPreviewLineThickness(1.25)
      useAppStore.getState().setReferenceTransformRotateSnapPreviewRadiusDeg(75)
      useAppStore.getState().setReferenceTransformRotateSnapPreviewDelayMs(180)
    })

    expect(viewerSetReferenceTransformRotateSnapPreviewLineSize).toHaveBeenLastCalledWith(1.5)
    expect(viewerSetReferenceTransformRotateSnapPreviewLineThickness).toHaveBeenLastCalledWith(
      1.25,
    )
    expect(viewerSetReferenceTransformRotateSnapPreviewRadiusDeg).toHaveBeenLastCalledWith(75)
    expect(viewerSetReferenceTransformRotateSnapPreviewDelayMs).toHaveBeenLastCalledWith(180)
  })

  it('pushes the active geometry sketch session into the viewer overlay and clears it when closed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XZ',
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 25, y: 10 },
                  },
                ],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'draw',
        plane: 'XZ',
        planeTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
        drawStage: 'sessionIdle',
        activeTool: null,
        drawDraft: null,
        ui: expect.objectContaining({
          snapEnabled: true,
          snapDistancePx: 14,
          crosshairSize: 1,
          startPointVisible: true,
          startPointSymbolSize: 0.1,
          startPointSymbolType: 'circle',
          plinePointVisible: true,
          plinePointSymbolSize: 0.05,
          plinePointSymbolType: 'circle',
        }),
        components: expect.any(Array),
      }),
    )

    act(() => {
      useSpaghettiStore.getState().closeGeometrySketchSession()
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenLastCalledWith(null)
  })

  it('updates the viewer overlay mode and selected profile when sketch review becomes active', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: {
                        winding: 'CCW',
                        segments: [],
                      },
                      verticesProxy: [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                      ],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: {
                        winding: 'CCW',
                        segments: [],
                      },
                      verticesProxy: [
                        { x: 20, y: 0 },
                        { x: 28, y: 0 },
                        { x: 28, y: 8 },
                        { x: 20, y: 8 },
                      ],
                    },
                  ],
                },
                uiState: {
                  collapsed: false,
                  selectedProfileId: 'profile-b',
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'review')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'review',
        selectedProfileId: 'profile-b',
        profiles: expect.arrayContaining([
          expect.objectContaining({ profileId: 'profile-a' }),
          expect.objectContaining({ profileId: 'profile-b' }),
        ]),
      }),
    )
  })

  it('pushes browser-visible sketch rows into the passive viewer sketch overlay lane', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'YZ',
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 20, y: 0 },
                  },
                ],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useAppStore.getState().setSketchVisibility(
        'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        true,
      )
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetVisibleGeometrySketchOverlays).toHaveBeenCalledWith([
      expect.objectContaining({
        overlayId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        plane: 'YZ',
        components: expect.any(Array),
        profiles: [],
      }),
    ])
  })

  it('keeps project-mode body rendering on accepted outputs while visible sketch overlays follow newer sketch transforms', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    const acceptedArtifact = {
      id: 'artifact-accepted-baseplate',
      kind: 'box' as const,
      label: 'Baseplate',
      partKeyStr: 'baseplate',
      partKey: { id: 'baseplate', instance: null as number | null },
      params: { width: 10, length: 20, height: 5 },
    }

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
              objects: [
                {
                  objectId: 'output-object:slot-baseplate',
                  label: 'Object 1',
                  slotId: 'slot-baseplate',
                },
              ],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                planeTransform: {
                  offsetMm: 0,
                  translation: { x: 0, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  inPlaneRotationDeg: 0,
                },
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 12, y: 0 },
                  },
                ],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [acceptedArtifact],
            acceptedBuildOutputs: [acceptedArtifact],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation,
              acceptedBuildOutputs: [acceptedArtifact],
              publishedAtBuildSeq: 1,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setSketchVisibility(
        'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        true,
      )
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetVisibleGeometrySketchOverlays).toHaveBeenCalledWith([
      expect.objectContaining({
        overlayId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        planeTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
      }),
    ])

    const initialPartCall = viewerSetParts.mock.calls.at(-1)?.[0] as
      | Array<{ viewerKey: string; artifact: unknown }>
      | undefined
    expect(initialPartCall?.[0]?.viewerKey).toBe(
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    )
    expect(initialPartCall?.[0]?.artifact).toBe(acceptedArtifact)

    const revisionBefore =
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.compileBuild
        .currentGraphRevision ?? -1

    act(() => {
      useSpaghettiStore.getState().setGeometrySketchPlaneTranslationAxis('node-sketch-1', 'x', 25)
    })

    const revisionAfter =
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.compileBuild
        .currentGraphRevision ?? -1
    expect(revisionAfter).toBeGreaterThan(revisionBefore)

    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.acceptedBuildOutputs[0],
    ).toBe(acceptedArtifact)

    expect(viewerSetVisibleGeometrySketchOverlays).toHaveBeenLastCalledWith([
      expect.objectContaining({
        overlayId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        planeTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 25, y: 0, z: 0 }),
        }),
      }),
    ])
  })

  it('live-updates the active project-mode extrude body during sketch-plane draft edits without mutating accepted output', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const acceptedArtifact = {
      id: 'artifact-extrude-1',
      label: 'Extrude 1',
      kind: 'mesh' as const,
      mesh: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      partKeyStr: 'extrude-body',
      partKey: {
        id: 'extrude-body',
        instance: null,
      },
    }

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                planeTransform: {
                  offsetMm: 0,
                  translation: { x: 0, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  inPlaneRotationDeg: 0,
                },
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 12, y: 0 },
                  },
                ],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 20,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-sketch-extrude-1',
            from: { nodeId: 'node-sketch-1', portId: 'SketchProfile' },
            to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
          },
          {
            edgeId: 'edge-extrude-output-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [acceptedArtifact],
            acceptedBuildOutputs: [acceptedArtifact],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation,
              acceptedBuildOutputs: [acceptedArtifact],
              publishedAtBuildSeq: 1,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-extrude:node-extrude-1',
              sourceNodeId: 'node-extrude-1',
              slotId: 'slot-extrude',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const initialPartCall = viewerSetParts.mock.calls.at(-1)?.[0] as
      | Array<{ viewerKey: string; artifact: typeof acceptedArtifact }>
      | undefined
    expect(initialPartCall?.[0]?.viewerKey).toBe(
      'graph-document-1:output-entry:slot-extrude:node-extrude-1',
    )
    expect(initialPartCall?.[0]?.artifact).toBe(acceptedArtifact)

    act(() => {
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 25)
    })

    const draftPartCall = viewerSetParts.mock.calls.at(-1)?.[0] as
      | Array<{ viewerKey: string; artifact: typeof acceptedArtifact }>
      | undefined
    expect(draftPartCall?.[0]?.viewerKey).toBe(
      'graph-document-1:output-entry:slot-extrude:node-extrude-1',
    )
    expect(draftPartCall?.[0]?.artifact).not.toBe(acceptedArtifact)
    expect(draftPartCall?.[0]?.artifact.mesh.vertices).toEqual([
      25, 0, 0,
      27, 0, 0,
      25, 1, 0,
    ])

    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.acceptedBuildOutputs[0],
    ).toBe(acceptedArtifact)
    expect(acceptedArtifact.mesh.vertices).toEqual([
      0, 0, 0,
      2, 0, 0,
      0, 1, 0,
    ])

    act(() => {
      useSpaghettiStore.getState().cancelSketchPlanePick()
    })

    const revertedPartCall = viewerSetParts.mock.calls.at(-1)?.[0] as
      | Array<{ viewerKey: string; artifact: typeof acceptedArtifact }>
      | undefined
    expect(revertedPartCall?.[0]?.artifact).toBe(acceptedArtifact)

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('clears a stale extrude preview immediately when the required SketchProfiles contributor no longer resolves a valid body', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const acceptedArtifact = {
      id: 'artifact-extrude-stale-1',
      label: 'Extrude 1',
      kind: 'mesh' as const,
      mesh: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      partKeyStr: 'extrude-body',
      partKey: {
        id: 'extrude-body',
        instance: null,
      },
    }

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    const connectedGraph = {
      schemaVersion: 1 as const,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: 'System/OutputPreview',
          params: {
            slots: [{ slotId: 'slot-extrude' }],
            objects: [
              {
                objectId: 'output-object:slot-extrude',
                label: 'Object 1',
                slotId: 'slot-extrude',
              },
            ],
          },
        },
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'edge-1',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 12, y: 8 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Basic',
            depthMm: 20,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-extrude-1',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-extrude-output-1',
          from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
        },
      ],
    }

    await act(async () => {
      useSpaghettiStore.getState().setGraph(connectedGraph)
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [acceptedArtifact],
            acceptedBuildOutputs: [acceptedArtifact],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-extrude:node-extrude-1',
              sourceNodeId: 'node-extrude-1',
              slotId: 'slot-extrude',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const initialPartCall = viewerSetParts.mock.calls.at(-1)?.[0] as
      | Array<{ viewerKey: string; artifact: typeof acceptedArtifact }>
      | undefined
    expect(initialPartCall?.[0]?.viewerKey).toBe(
      'graph-document-1:output-entry:slot-extrude:node-extrude-1',
    )
    expect(initialPartCall?.[0]?.artifact).toBe(acceptedArtifact)

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        ...connectedGraph,
        edges: connectedGraph.edges.filter((edge) => edge.edgeId !== 'edge-sketch-extrude-1'),
      })
    })

    const clearedPartCall = viewerSetParts.mock.calls.at(-1)?.[0] as
      | Array<{ viewerKey: string; artifact: typeof acceptedArtifact }>
      | undefined
    expect(clearedPartCall).toEqual([])
    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.acceptedPreviewBuildOutputs,
    ).toEqual([acceptedArtifact])

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('clears stale final geometry immediately when the required SketchProfiles contributor no longer resolves a valid body', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    const connectedGraph = {
      schemaVersion: 1 as const,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: 'System/OutputPreview',
          params: {
            slots: [{ slotId: 'slot-extrude' }],
            objects: [
              {
                objectId: 'output-object:slot-extrude',
                label: 'Object 1',
                slotId: 'slot-extrude',
              },
            ],
          },
        },
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'edge-1',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 12, y: 8 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Basic',
            depthMm: 20,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-extrude-1',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-extrude-output-1',
          from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
        },
      ],
    }

    await act(async () => {
      useSpaghettiStore.getState().setGraph(connectedGraph)
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: createAuthoritativeGeometryResultBundle({
              request: {
                graphDocumentId: 'graph-document-1',
                buildRequestId: 'build-request-final-extrude-1',
                partKeys: ['extrude-body'],
              },
              bodies: {},
              meshPreview: {
                vertices: [
                  0, 0, 0,
                  2, 0, 0,
                  0, 1, 0,
                ],
                indices: [0, 1, 2],
              },
              diagnostics: [],
              trace: [],
              authoritativeHandle: {
                resourceType: 'shape_set',
                handleId: 'shape-set-final-extrude-1',
              },
            }),
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const initialFinalLayerArgs = [...viewerSetViewportRenderLayers.mock.calls]
      .map((call) => call[0] as { baseParts?: unknown[]; overlayParts?: unknown[] })
      .reduce<{ baseParts?: unknown[]; overlayParts?: unknown[] }>(
        (best, current) =>
          ((current.baseParts?.length ?? 0) + (current.overlayParts?.length ?? 0)) >
          ((best.baseParts?.length ?? 0) + (best.overlayParts?.length ?? 0))
            ? current
            : best,
        {},
      )
    expect(initialFinalLayerArgs.baseParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        ...connectedGraph,
        edges: connectedGraph.edges.filter((edge) => edge.edgeId !== 'edge-sketch-extrude-1'),
      })
    })

    expect((viewerSetViewportRenderLayers.mock.calls.at(-1)?.[0] as { baseParts?: unknown[] })?.baseParts).toEqual([])

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('pushes assembly and component content selection into the viewer highlighted-part lane', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
              objects: [
                {
                  objectId: 'output-object:slot-baseplate',
                  label: 'Object 1',
                  slotId: 'slot-baseplate',
                },
              ],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            acceptedBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-component:project-file-1:graph-document-1:published'],
            },
          },
          componentsById: {
            'project-component:project-file-1:graph-document-1:published': {
              componentId: 'project-component:project-file-1:graph-document-1:published',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              childObjectIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'project-component:project-file-1:graph-document-1:published',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'assembly',
        assemblyId: 'assembly-root:project-file-1',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetHighlightedPartKeys).toHaveBeenCalledWith(
      expect.arrayContaining(['graph-document-1:output-entry:slot-baseplate:node-baseplate-1']),
    )
  })

  it('does not group ordinary project-mode graph preview solids into content-object pivots by default', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
              objects: [
                {
                  objectId: 'output-object:slot-baseplate',
                  label: 'Object 1',
                  slotId: 'slot-baseplate',
                },
              ],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            acceptedBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetContentObjectTransformGroups).toHaveBeenLastCalledWith([])
  })

  it('still groups a project-mode graph solid when an active content-object transform session exists', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
              objects: [
                {
                  objectId: 'output-object:slot-baseplate',
                  label: 'Object 1',
                  slotId: 'slot-baseplate',
                },
              ],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            acceptedBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          componentsById: {},
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            objectId: 'project-object:project-file-1:graph-document-1:output-object',
            sessionId: 'content-transform-session-1',
            sessionOrdinal: 1,
            mode: 'translate',
            space: 'world',
            shellActive: true,
            entryActive: false,
            activeHandle: null,
            draftTransform: {
              position: { x: 0, y: 0, z: 0 },
              rotationDeg: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
            },
            entryOrigin: null,
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetContentObjectTransformGroups).toHaveBeenLastCalledWith([
      {
        objectId: 'project-object:project-file-1:graph-document-1:output-object',
        partKeys: ['graph-document-1:output-entry:slot-baseplate:node-baseplate-1'],
      },
    ])
  })

  it('keeps retained final visible by itself in auto mode until a narrowed live artifact overlay is available', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const draftArtifact = {
      id: 'artifact-draft-1',
      label: 'Extrude Draft',
      kind: 'mesh' as const,
      mesh: {
        vertices: [
          5, 0, 0,
          7, 0, 0,
          5, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      partKeyStr: 'extrude-body',
      partKey: {
        id: 'extrude-body',
        instance: null,
      },
    }
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-committed',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-retained-final',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-current',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 2,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewBuildOutputs: [draftArtifact],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string; artifact?: unknown }>
            overlayStyle?: { opacity: number; color: string }
            overlayOpacity?: number
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true && (layers.overlayParts?.length ?? 0) === 0,
      )

    expect(layeredCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:authoritative-preview',
          }),
        ],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
    expect(layeredCall?.overlayStyle).toBeUndefined()

    expect(layeredCall?.baseParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(layeredCall?.overlayParts).toEqual([])

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('renders retained final by itself in auto mode while geometry is temporarily waiting', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
        status: 'unresolved',
      },
    ])
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-committed-waiting',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-retained-final-waiting',
      },
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedPreviewGraphRevision: 1,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: null,
            acceptedPreviewBuildOutputs: [],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
            overlayOpacity?: number
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true && (layers.overlayParts?.length ?? 0) === 0,
      )

    expect(layeredCall).toEqual(
      expect.objectContaining({
        overlayOpacity: 0.5,
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:authoritative-preview',
          }),
        ],
        overlayParts: [],
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('renders empty viewport layers when output preview is disconnected even if accepted final geometry still exists', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = {
      ...createPreviewPreparation([
        {
          slotId: 'slot-extrude',
          sourceNodeId: 'node-extrude-1',
          sourcePartKey: 'extrude-body',
          status: 'empty' as const,
        },
      ]),
      previewCandidateSlotIds: [],
      previewCandidatePartKeys: [],
      sourceNodeIdBySlotId: {},
      sourcePartKeyBySlotId: {},
      sourcePortIdBySlotId: {},
      sourcePartKeyByNodeId: {},
    }
    const acceptedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-disconnected-host',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-disconnected-host',
      },
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedPreviewGraphRevision: 1,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: acceptedFinalGeometry,
            acceptedDraftGeometryResult: null,
            acceptedPreviewBuildOutputs: [createArtifact('extrude-body')],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const emptyLayerCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baselineParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .find(
        (layers) =>
          (layers.baseParts?.length ?? 0) === 0 &&
          (layers.baselineParts?.length ?? 0) === 0 &&
          (layers.overlayParts?.length ?? 0) === 0,
      )

    expect(emptyLayerCall).toEqual(
      expect.objectContaining({
        baseParts: [],
        baselineParts: [],
        overlayParts: [],
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('keeps retained final visible without a whole-scene committed draft overlay in auto mode while waiting for newer live draft work', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
        status: 'unresolved',
      },
    ])
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-committed-waiting-overlay',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-retained-final-waiting-overlay',
      },
    })
    const committedDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-committed-waiting-overlay',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          5, 0, 0,
          7, 0, 0,
          5, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
              latestAcceptedGraphRevision: 1,
              inFlightGraphRevision: 2,
              inFlightBuildRequestId: 'build-request-draft-next',
              inFlightBuildSeq: 612,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: committedDraftGeometry,
            acceptedPreviewBuildOutputs: [],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          previewMesh: {
            opacity: 0.52,
            color: '#d4a100',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
            overlayStyle?: { opacity: number; color: string }
            overlayOpacity?: number
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true && (layers.overlayParts?.length ?? 0) === 0,
      )

    expect(layeredCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:authoritative-preview',
          }),
        ],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
    expect(layeredCall?.overlayStyle).toBeUndefined()

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('renders settled auto live accepted draft as the visible lastLoaded base after interaction ends', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-release-settle',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          3, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-before-release-settle',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-after-release-settle',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          5, 0, 0,
          7, 0, 0,
          5, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-settled-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
              latestAcceptedGraphRevision: 2,
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 2,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewBuildOutputs: [],
          },
        },
      }))
      useAppStore.setState((state) => {
        const {
          ['graph-document-1']: _removedGraphDocumentInteraction,
          ...remainingInteractionGraphDocumentIds
        } = state.browserInteractionGraphDocumentIds

        return {
          currentProject: {
            ...state.currentProject,
            graphDocuments: [],
          },
          browserGraphBuildPolicyByGraphDocumentId: {
            ...state.browserGraphBuildPolicyByGraphDocumentId,
            'graph-document-1': 'live',
          },
          browserInteractionGraphDocumentIds: remainingInteractionGraphDocumentIds,
          viewportPresentationSettings: {
            ...state.viewportPresentationSettings,
            lastLoaded: {
              opacity: 0.92,
              color: '#224466',
            },
            previewMesh: {
              opacity: 0.33,
              color: '#aa5500',
            },
          },
        }
      })
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const visibleCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some((part) => part.viewerKey === 'graph-document-1:draft-preview') ===
          true,
      )

    expect(visibleCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:draft-preview',
          }),
        ],
        overlayParts: [],
      }),
    )
    expect(visibleCall?.baseStyle).toEqual({
      opacity: 0.92,
      color: '#224466',
    })

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('renders settled draft artifact-preview truth with lastLoaded base styling in draft mode', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const currentDraftArtifact = {
      id: 'artifact-draft-current-1',
      label: 'Extrude Draft Current',
      kind: 'mesh' as const,
      mesh: {
        vertices: [
          5, 0, 0,
          7, 0, 0,
          5, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      partKeyStr: 'extrude-body',
      partKey: {
        id: 'extrude-body',
        instance: null,
      },
    }
    const committedDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-committed',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedDraftGraphRevision: 2,
            acceptedDraftGeometryResult: committedDraftGeometry,
            acceptedPreviewBuildOutputs: [currentDraftArtifact],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 0.9,
            color: '#224466',
          },
          previewMesh: {
            opacity: 0.33,
            color: '#aa5500',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'draft')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const visibleCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string; artifact?: unknown }>
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:draft-preview',
          ) ===
          true,
      )

    expect(visibleCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:draft-preview',
          }),
        ],
        overlayParts: [],
      }),
    )
    expect(visibleCall?.baseStyle).toEqual({
      opacity: 0.9,
      color: '#224466',
    })

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('renders current draft geometry as a single visible previewMesh layer in draft mode when artifact preview is empty', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-current-visible',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-draft-visible-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedPreviewGraphRevision: 2,
            acceptedDraftGraphRevision: 2,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewBuildOutputs: [],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          previewMesh: {
            opacity: 0.41,
            color: '#1188cc',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'draft')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const visibleCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some((part) => part.viewerKey === 'graph-document-1:draft-preview') ===
          true,
      )

    expect(visibleCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:draft-preview',
          }),
        ],
        overlayParts: [],
      }),
    )
    expect(visibleCall?.baseStyle).toEqual({
      opacity: 0.41,
      color: '#1188cc',
    })

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('keeps retained final visible without drawing the whole-scene draft mesh fallback as an auto overlay while output is temporarily unresolved', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
        status: 'unresolved',
      },
    ])
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-auto-cleared-final',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          3, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-auto-cleared-final',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-auto-current-draft-visible',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-auto-visible-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 2,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewBuildOutputs: [],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          previewMesh: {
            opacity: 0.52,
            color: '#d4a100',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
            overlayStyle?: { opacity: number; color: string }
            overlayOpacity?: number
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true,
      )

    if (layeredCall === undefined) {
      throw new Error(
        JSON.stringify(
          viewerSetViewportRenderLayers.mock.calls.map((call) => call[0]),
          null,
          2,
        ),
      )
    }

    expect(layeredCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:authoritative-preview',
          }),
        ],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
    expect(layeredCall?.overlayStyle).toBeUndefined()

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('maps lastLoaded base style while leaving previewMesh overlay styling unused when the broad draft fallback is suppressed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const currentDraftArtifact = {
      id: 'artifact-draft-current-style-1',
      label: 'Extrude Draft Current Styled',
      kind: 'mesh' as const,
      mesh: {
        vertices: [
          5, 0, 0,
          7, 0, 0,
          5, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      partKeyStr: 'extrude-body',
      partKey: {
        id: 'extrude-body',
        instance: null,
      },
    }
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-style-committed',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-style-committed',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-style-current',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-style-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 2,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewBuildOutputs: [currentDraftArtifact],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 0.92,
            color: '#224466',
          },
          previewMesh: {
            opacity: 0.33,
            color: '#aa5500',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string; artifact?: unknown }>
            overlayStyle?: { opacity: number; color: string }
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true && (layers.overlayParts?.length ?? 0) === 0,
      )

    expect(layeredCall?.baseStyle).toEqual({
      opacity: 0.92,
      color: '#224466',
    })
    expect(layeredCall?.overlayStyle).toBeUndefined()
  })

  it('keeps ordinary base styling when authoritative geometry is already accepted instead of a distinct previewBrep state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const currentAuthoritativeGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-brep-visible',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          3, 0, 0,
          0, 2, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-brep-visible',
      },
    })

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-style-2',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 2,
            acceptedAuthoritativeGeometryResult: currentAuthoritativeGeometry,
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          previewBrep: {
            opacity: 0.74,
            color: '#00aa88',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const visibleCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true,
      )

    expect(visibleCall?.baseStyle).toBeUndefined()
    expect(visibleCall?.overlayParts).toEqual([])
  })

  it('renders retained lastLoaded base plus previewBrep overlay in auto mode when a distinct authoritative preview-ready result exists', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-brep-committed-auto',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 2, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-brep-committed-auto',
      },
    })
    const previewReadyGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-brep-preview-ready-auto',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 3, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-brep-preview-ready-auto',
      },
    })

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-style-3',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            stagedAuthoritativePreviewResult: {
              buildSeq: 411,
              buildRequestId: 'build-request-brep-preview-ready-auto',
              graphRevision: 2,
              targetBuildUnitIds: [],
              acceptedBuildImpact: {
                seq: 411,
                graphDocumentId: 'graph-document-1',
                buildRequestId: 'build-request-brep-preview-ready-auto',
                changedParamIds: ['sp_depth'],
                affectedBuildUnitIds: [],
                targetBuildUnitIds: [],
                summary: {
                  rebuiltCount: 0,
                  retainedCount: 0,
                  evictedCount: 0,
                },
                entries: [],
              },
              acceptedBuildBundle: {
                buildRequestId: 'build-request-brep-preview-ready-auto',
                graphDocumentId: 'graph-document-1',
                seq: 411,
                resultClass: 'final',
                executionIntent: {
                  buildMode: 'final',
                  quality: 'full',
                  updatePolicy: 'auto',
                  draftPolicy: 'live',
                  authoritativePolicy: 'live',
                  outputIntent: 'accepted_final',
                  geometryTarget: 'authoritative',
                },
                summary: {
                  rebuiltCount: 0,
                  retainedCount: 0,
                  evictedCount: 0,
                },
                entries: [],
              },
              acceptedPreviewBuildBundle: {
                buildRequestId: 'build-request-brep-preview-ready-auto',
                graphDocumentId: 'graph-document-1',
                seq: 411,
                resultClass: 'final',
                executionIntent: {
                  buildMode: 'final',
                  quality: 'full',
                  updatePolicy: 'auto',
                  draftPolicy: 'live',
                  authoritativePolicy: 'live',
                  outputIntent: 'accepted_final',
                  geometryTarget: 'authoritative',
                },
                summary: {
                  rebuiltCount: 0,
                  retainedCount: 0,
                  evictedCount: 0,
                },
                entries: [],
              },
              acceptedBuildOutputs: [],
              acceptedPreviewBuildOutputs: [],
              authoritativeGeometryResult: previewReadyGeometry,
            },
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 1,
            color: '#224466',
          },
          previewBrep: {
            opacity: 0.75,
            color: '#00aa88',
          },
        },
        isInteracting: true,
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
            overlayStyle?: { opacity: number; color: string }
            overlayOpacity?: number
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true &&
          layers.overlayParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true,
      )

    expect(layeredCall?.baseStyle).toEqual({
      opacity: 1,
      color: '#224466',
    })
    expect(layeredCall?.overlayStyle).toEqual({
      opacity: 0.75,
      color: '#00aa88',
    })
    expect(layeredCall?.overlayOpacity).toBe(0.75)
  })

  it('keeps final mode authoritative-only by rendering retained final without draft overlay fallback', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-body',
      },
    ])
    const currentDraftArtifact = {
      id: 'artifact-draft-current-2',
      label: 'Extrude Draft Current',
      kind: 'mesh' as const,
      mesh: {
        vertices: [
          5, 0, 0,
          7, 0, 0,
          5, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      partKeyStr: 'extrude-body',
      partKey: {
        id: 'extrude-body',
        instance: null,
      },
    }
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-committed-only',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-retained-final-only',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-current-only',
        partKeys: ['extrude-body'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude',
                  label: 'Object 1',
                  slotId: 'slot-extrude',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-output-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedDraftGraphRevision: 2,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewBuildOutputs: [currentDraftArtifact],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'manual',
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const layeredCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
            overlayOpacity?: number
          },
      )
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true,
      )

    expect(layeredCall).toEqual(
      expect.objectContaining({
        overlayOpacity: 0.5,
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:authoritative-preview',
          }),
        ],
        overlayParts: [],
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('maps selector-owned branch-local recipe layers into viewer render layers with dimmed baseline styling', async () => {
    const { buildViewerViewportRenderLayers } = await import('./ViewerHost')

    const extrude1 = toViewerRenderablePart(
      createArtifact('extrude-1'),
      'graph-document-1:output-entry:slot-extrude-1:node-extrude-1',
    )
    const extrude2 = toViewerRenderablePart(
      createArtifact('extrude-2'),
      'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
    )

    const layers = buildViewerViewportRenderLayers({
      viewportPresentationSettings: {
        lastLoaded: {
          opacity: 1,
          color: '#224466',
        },
        previewMesh: {
          opacity: 1,
          color: '#d4a100',
        },
        previewBrep: {
          opacity: 0.75,
          color: '#00aa88',
        },
      },
      layerRecipe: {
        kind: 'branch-local-retained-baseline',
        baseParts: [extrude1],
        basePresentationStateId: 'lastLoaded',
        baselineParts: [extrude2],
        baselinePresentationStateId: 'lastLoaded',
        baselineUsesDimmedBaseStyle: true,
        overlayParts: [extrude2],
        overlayPresentationStateId: 'previewMesh',
        overlayOpacity: 0.5,
      },
    })

    expect(layers).toEqual({
      baseParts: [extrude1],
      baseStyle: {
        opacity: 1,
        color: '#224466',
      },
      baselineParts: [extrude2],
      baselineStyle: {
        opacity: 0.5,
        color: '#224466',
      },
      overlayParts: [extrude2],
      overlayStyle: {
        opacity: 1,
        color: '#d4a100',
      },
      overlayOpacity: 0.5,
    })
  })

  describe('Phase 5 host layer matrix', () => {
    const phase5PresentationSettings = {
      lastLoaded: {
        opacity: 0.92,
        color: '#224466',
      },
      previewMesh: {
        opacity: 0.33,
        color: '#aa5500',
      },
      previewBrep: {
        opacity: 0.75,
        color: '#00aa88',
      },
    } as const

    const phase5FinalPart = toViewerRenderablePart(
      createArtifact('baseplate-final'),
      'graph-document-1:authoritative-preview',
    )
    const phase5DraftPart = toViewerRenderablePart(
      createArtifact('baseplate-draft'),
      'graph-document-1:draft-preview',
    )

    const cases = [
      {
        label: 'Auto / Live - Settled Draft',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5DraftPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:draft-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Auto / On Release - Active Drag',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5FinalPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:authoritative-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Auto / Manual - Before Build',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5FinalPart],
          basePresentationStateId: null,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:authoritative-preview'],
          baseStyle: undefined,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Draft / Live - Active Drag',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5DraftPart],
          basePresentationStateId: 'previewMesh' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:draft-preview'],
          baseStyle: phase5PresentationSettings.previewMesh,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Draft / On Release - Settled Draft',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5DraftPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:draft-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Draft / Manual - Before Build',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5DraftPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:draft-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Final / Live - Preview Ready',
        layerRecipe: {
          kind: 'retained-plus-overlay' as const,
          baseParts: [phase5FinalPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [phase5FinalPart],
          overlayPresentationStateId: 'previewBrep' as const,
          overlayOpacity: 0.75,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:authoritative-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: ['graph-document-1:authoritative-preview'],
          overlayStyle: phase5PresentationSettings.previewBrep,
          overlayOpacity: 0.75,
        },
      },
      {
        label: 'Final / On Release - Post Release',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5FinalPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:authoritative-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
      {
        label: 'Final / Manual - After Build',
        layerRecipe: {
          kind: 'base-only' as const,
          baseParts: [phase5FinalPart],
          basePresentationStateId: 'lastLoaded' as const,
          baselineParts: [],
          baselinePresentationStateId: null,
          baselineUsesDimmedBaseStyle: false,
          overlayParts: [],
          overlayPresentationStateId: null,
          overlayOpacity: 0.5,
        },
        expected: {
          baseViewerKeys: ['graph-document-1:authoritative-preview'],
          baseStyle: phase5PresentationSettings.lastLoaded,
          baselineViewerKeys: [],
          overlayViewerKeys: [],
          overlayStyle: undefined,
          overlayOpacity: 0.5,
        },
      },
    ]

    it.each(cases)('maps viewer layers for $label', async ({ layerRecipe, expected }) => {
      const { buildViewerViewportRenderLayers } = await import('./ViewerHost')

      const layers = buildViewerViewportRenderLayers({
        viewportPresentationSettings: phase5PresentationSettings,
        layerRecipe,
      })

      expect(layers.baseParts.map((part) => part.viewerKey)).toEqual(expected.baseViewerKeys)
      expect((layers.baselineParts ?? []).map((part) => part.viewerKey)).toEqual(
        expected.baselineViewerKeys,
      )
      expect((layers.overlayParts ?? []).map((part) => part.viewerKey)).toEqual(
        expected.overlayViewerKeys,
      )
      expect(layers.baseStyle).toEqual(expected.baseStyle)
      expect(layers.overlayStyle).toEqual(expected.overlayStyle)
      expect(layers.overlayOpacity).toBe(expected.overlayOpacity)
    })
  })

  it('uses interaction-time accepted preview bundle fallback so rebuilt-only overlay is available for branch-local layers during drag', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude-1',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-1',
      },
      {
        slotId: 'slot-extrude-2',
        sourceNodeId: 'node-extrude-2',
        sourcePartKey: 'extrude-2',
      },
    ])
    const retainedExtrude1 = createArtifact('extrude-1')
    const retainedExtrude2 = createArtifact('extrude-2')
    const rebuiltExtrude2 = createArtifact('extrude-2')
    const acceptedFinalPreviewBundle = createAcceptedPreviewBundle({
      seq: 26,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-final-branch-local-idle',
      resultClass: 'final',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: retainedExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'retained',
        },
      ],
    })
    const acceptedPreviewBundle = createAcceptedPreviewBundle({
      seq: 27,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-draft-branch-local',
      resultClass: 'draft',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: rebuiltExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
        },
      ],
    })
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-branch-local-drag',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-branch-local-before-drag',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-branch-local',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude-1' }, { slotId: 'slot-extrude-2' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude-1',
                  label: 'Extrude 1',
                  slotId: 'slot-extrude-1',
                },
                {
                  objectId: 'output-object:slot-extrude-2',
                  label: 'Extrude 2',
                  slotId: 'slot-extrude-2',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
          {
            nodeId: 'node-extrude-2',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 25,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-1-output',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-1' },
          },
          {
            edgeId: 'edge-extrude-2-output',
            from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-2' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedFinalPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, retainedExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 1,
            color: '#224466',
          },
          previewMesh: {
            opacity: 1,
            color: '#d4a100',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            acceptedDraftGraphRevision: 2,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, rebuiltExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
      }))
    })

    const branchLocalCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baselineParts?: Array<{ viewerKey: string }>
            baselineStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
            overlayStyle?: { opacity: number; color: string }
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-1:node-extrude-1',
          ) === true &&
          layers.baselineParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true &&
          layers.overlayParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true,
      )

    expect(branchLocalCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-1:node-extrude-1',
          }),
        ],
        baselineParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
        overlayParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
        baselineStyle: {
          opacity: 0.5,
          color: '#224466',
        },
        overlayStyle: {
          opacity: 1,
          color: '#d4a100',
        },
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('keeps the unaffected sibling fully loaded when parallel branches publish through separate Output Preview surfaces', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-1',
                  componentId: 'rect-a',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 40, y: 20 },
                },
                {
                  rowId: 'row-2',
                  componentId: 'rect-b',
                  type: 'rectangle',
                  a: { kind: 'lit', x: 60, y: 0 },
                  b: { kind: 'lit', x: 100, y: 20 },
                },
              ],
              outputs: {
                profiles: [],
                diagnostics: [],
              },
              uiState: {
                collapsed: false,
              },
            },
          },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Basic',
            depthMm: 50,
          },
        },
        {
          nodeId: 'node-extrude-2',
          type: 'Geometry/Extrude',
          params: {
            extrudeType: 'Basic',
            depthMm: 25,
          },
        },
        {
          nodeId: 'node-output-preview-1',
          type: 'System/OutputPreview',
          params: {
            slots: [{ slotId: 'slot-extrude-1' }],
            objects: [
              {
                objectId: 'output-object:slot-extrude-1',
                label: 'Extrude 1',
                slotId: 'slot-extrude-1',
              },
            ],
          },
        },
        {
          nodeId: 'node-output-preview-2',
          type: 'System/OutputPreview',
          params: {
            slots: [{ slotId: 'slot-extrude-2' }],
            objects: [
              {
                objectId: 'output-object:slot-extrude-2',
                label: 'Extrude 2',
                slotId: 'slot-extrude-2',
              },
            ],
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-to-extrude-1-separate-preview',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-sketch-to-extrude-2-separate-preview',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-2', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-extrude-1-output-separate-preview',
          from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-1' },
        },
        {
          edgeId: 'edge-extrude-2-output-separate-preview',
          from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-2', portId: 'in:solid:slot-extrude-2' },
        },
      ],
    }
    const previewPreparation = prepareGraphPreviewPreparation(graph)
    const rebuiltExtrude1 = createArtifact('extrude-1')
    const retainedExtrude2 = createArtifact('extrude-2')
    const acceptedFinalPreviewBundle = createAcceptedPreviewBundle({
      seq: 511,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-final-separate-preview-idle',
      resultClass: 'final',
      entries: [
        {
          artifact: createArtifact('extrude-1'),
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: retainedExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'retained',
        },
      ],
    })
    const acceptedPreviewBundle = createAcceptedPreviewBundle({
      seq: 512,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-draft-separate-preview-live',
      entries: [
        {
          artifact: rebuiltExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
        },
        {
          artifact: retainedExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'retained',
        },
      ],
    })
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-separate-preview-committed',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-separate-preview-committed',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-separate-preview-live',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          5, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph(graph)
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedFinalPreviewBundle,
            acceptedPreviewBuildOutputs: [createArtifact('extrude-1'), retainedExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 1,
            color: '#224466',
          },
          previewMesh: {
            opacity: 1,
            color: '#d4a100',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            acceptedDraftGraphRevision: 2,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedPreviewBundle,
            acceptedPreviewBuildOutputs: [rebuiltExtrude1, retainedExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
      }))
    })

    const branchLocalCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baselineParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true &&
          layers.baselineParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-1:node-extrude-1',
          ) === true &&
          layers.overlayParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-1:node-extrude-1',
          ) === true,
      )

    expect(branchLocalCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
        baselineParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-1:node-extrude-1',
          }),
        ],
        overlayParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-1:node-extrude-1',
          }),
        ],
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('drops the old branch-local baseline after settle while keeping the changed winner visible for the same two-branch graph', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude-1',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-1',
      },
      {
        slotId: 'slot-extrude-2',
        sourceNodeId: 'node-extrude-2',
        sourcePartKey: 'extrude-2',
      },
    ])
    const retainedExtrude1 = createArtifact('extrude-1')
    const retainedExtrude2 = createArtifact('extrude-2')
    const rebuiltExtrude2 = createArtifact('extrude-2')
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-branch-local-settle-host',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-before-branch-local-settle-host',
      },
    })
    const currentDraftGeometry = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-after-branch-local-settle-host',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const acceptedFinalPreviewBundle = createAcceptedPreviewBundle({
      seq: 301,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-final-before-branch-local-settle-host',
      resultClass: 'final',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: retainedExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'retained',
        },
      ],
    })
    const acceptedPreviewBundle = createAcceptedPreviewBundle({
      seq: 302,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-draft-after-branch-local-settle-host',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: rebuiltExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
        },
      ],
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [
                { slotId: 'slot-extrude-1' },
                { slotId: 'slot-extrude-2' },
              ],
              objects: [
                {
                  objectId: 'output-object:slot-extrude-1',
                  label: 'Object 1',
                  slotId: 'slot-extrude-1',
                },
                {
                  objectId: 'output-object:slot-extrude-2',
                  label: 'Object 2',
                  slotId: 'slot-extrude-2',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
          {
            nodeId: 'node-extrude-2',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 25,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-extrude-1-output-settle',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-1' },
          },
          {
            edgeId: 'edge-extrude-2-output-settle',
            from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-2' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
              inFlightGraphRevision: null,
              inFlightBuildRequestId: null,
              inFlightBuildSeq: null,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedFinalPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, retainedExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 1,
            color: '#224466',
          },
          previewMesh: {
            opacity: 1,
            color: '#d4a100',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'auto')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            acceptedDraftGraphRevision: 2,
            acceptedDraftGeometryResult: currentDraftGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, rebuiltExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
      }))
    })

    const activeBranchLocalCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baselineParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-1:node-extrude-1',
          ) === true &&
          layers.baselineParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true &&
          layers.overlayParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true,
      )

    expect(activeBranchLocalCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-1:node-extrude-1',
          }),
        ],
        baselineParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
        overlayParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
      }),
    )

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
              latestAcceptedGraphRevision: 2,
            },
          },
        },
      }))
      useAppStore.setState((state) => ({
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: false,
      }))
    })

    const settledCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baseStyle?: { opacity: number; color: string }
            baselineParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some((part) => part.viewerKey === 'graph-document-1:draft-preview') ===
            true &&
          (layers.baselineParts?.length ?? 0) === 0 &&
          (layers.overlayParts?.length ?? 0) === 0,
      )

    expect(settledCall).toEqual(
      expect.objectContaining({
        baseParts: [
          expect.objectContaining({
            viewerKey: 'graph-document-1:draft-preview',
          }),
        ],
        baseStyle: {
          opacity: 1,
          color: '#224466',
        },
        baselineParts: [],
        overlayParts: [],
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('does not render branch-local yellow draft overlay in final live mode when the selector has no visible overlay state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude-1',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-1',
      },
      {
        slotId: 'slot-extrude-2',
        sourceNodeId: 'node-extrude-2',
        sourcePartKey: 'extrude-2',
      },
    ])
    const retainedExtrude1 = createArtifact('extrude-1')
    const retainedExtrude2 = createArtifact('extrude-2')
    const rebuiltExtrude2 = createArtifact('extrude-2')
    const acceptedFinalPreviewBundle = createAcceptedPreviewBundle({
      seq: 26,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-final-branch-local-idle',
      resultClass: 'final',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: retainedExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'retained',
        },
      ],
    })
    const acceptedDraftPreviewBundle = createAcceptedPreviewBundle({
      seq: 27,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-draft-branch-local-should-not-show',
      resultClass: 'draft',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: rebuiltExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
        },
      ],
    })
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-final-live-protection',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-before-final-live-protection',
      },
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude-1' }, { slotId: 'slot-extrude-2' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude-1',
                  label: 'Extrude 1',
                  slotId: 'slot-extrude-1',
                },
                {
                  objectId: 'output-object:slot-extrude-2',
                  label: 'Extrude 2',
                  slotId: 'slot-extrude-2',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
          {
            nodeId: 'node-extrude-2',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 25,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-final-live-protection-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-1' },
          },
          {
            edgeId: 'edge-final-live-protection-2',
            from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-2' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedFinalPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, retainedExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 1,
            color: '#224466',
          },
          previewMesh: {
            opacity: 1,
            color: '#d4a100',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
              latestAcceptedGraphRevision: 1,
            },
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedDraftPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, rebuiltExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
      }))
    })

    const branchLocalCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baselineParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-1:node-extrude-1',
          ) === true &&
          layers.baselineParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true &&
          layers.overlayParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true,
      )

    expect(branchLocalCall).toBeUndefined()

    const finalVisibleCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            overlayParts?: Array<{ viewerKey: string }>
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'graph-document-1:authoritative-preview',
          ) === true,
      )

    expect(finalVisibleCall?.overlayParts).toEqual([])

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('renders branch-local previewBrep overlay with green styling during live authoritative preview-ready interaction', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude-1',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-1',
      },
      {
        slotId: 'slot-extrude-2',
        sourceNodeId: 'node-extrude-2',
        sourcePartKey: 'extrude-2',
      },
    ])
    const retainedExtrude1 = createArtifact('extrude-1')
    const retainedExtrude2 = createArtifact('extrude-2')
    const rebuiltExtrude2 = createArtifact('extrude-2')
    const acceptedFinalPreviewBundle = createAcceptedPreviewBundle({
      seq: 28,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-final-branch-local-brep-idle',
      resultClass: 'final',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: retainedExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'retained',
        },
      ],
    })
    const previewReadyFinalPreviewBundle = createAcceptedPreviewBundle({
      seq: 29,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-final-branch-local-brep-live',
      resultClass: 'final',
      entries: [
        {
          artifact: retainedExtrude1,
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
        },
        {
          artifact: rebuiltExtrude2,
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
        },
      ],
    })
    const committedFinalGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-branch-local-brep-host',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-before-branch-local-brep-host',
      },
    })
    const previewReadyGeometry = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-preview-ready-branch-local-brep-host',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          7, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-preview-ready-branch-local-brep-host',
      },
    })

    let container: HTMLDivElement | null = null
    let root: Root | null = null

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-extrude-1' }, { slotId: 'slot-extrude-2' }],
              objects: [
                {
                  objectId: 'output-object:slot-extrude-1',
                  label: 'Extrude 1',
                  slotId: 'slot-extrude-1',
                },
                {
                  objectId: 'output-object:slot-extrude-2',
                  label: 'Extrude 2',
                  slotId: 'slot-extrude-2',
                },
              ],
            },
          },
          {
            nodeId: 'node-extrude-1',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 50,
            },
          },
          {
            nodeId: 'node-extrude-2',
            type: 'Geometry/Extrude',
            params: {
              extrudeType: 'Basic',
              depthMm: 25,
            },
          },
        ],
        edges: [
          {
            edgeId: 'edge-branch-local-brep-host-1',
            from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-1' },
          },
          {
            edgeId: 'edge-branch-local-brep-host-2',
            from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-extrude-2' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 1,
              latestAcceptedGraphRevision: 1,
            },
            previewPreparation,
            acceptedAuthoritativeGraphRevision: 1,
            acceptedAuthoritativeGeometryResult: committedFinalGeometry,
            acceptedPreviewGraphRevision: 1,
            acceptedPreviewBuildBundle: acceptedFinalPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, retainedExtrude2],
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [],
        },
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          'graph-document-1': 'live',
        },
        viewportPresentationSettings: {
          ...state.viewportPresentationSettings,
          lastLoaded: {
            opacity: 1,
            color: '#224466',
          },
          previewBrep: {
            opacity: 0.75,
            color: '#00aa88',
          },
        },
      }))
      useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'final')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            compileBuild: {
              ...state.graphRuntimeByDocumentId['graph-document-1']!.compileBuild,
              currentGraphRevision: 2,
              latestAcceptedGraphRevision: 1,
            },
            acceptedPreviewGraphRevision: 2,
            acceptedPreviewBuildBundle: previewReadyFinalPreviewBundle,
            acceptedPreviewBuildOutputs: [retainedExtrude1, rebuiltExtrude2],
            stagedAuthoritativePreviewResult: {
              buildSeq: 412,
              buildRequestId: 'build-request-final-branch-local-brep-live',
              graphRevision: 2,
              targetBuildUnitIds: [],
              acceptedBuildImpact: {
                seq: 412,
                graphDocumentId: 'graph-document-1',
                buildRequestId: 'build-request-final-branch-local-brep-live',
                changedParamIds: ['sp_depth'],
                affectedBuildUnitIds: [],
                targetBuildUnitIds: [],
                summary: {
                  rebuiltCount: 1,
                  retainedCount: 1,
                  evictedCount: 0,
                },
                entries: [],
              },
              acceptedBuildBundle: previewReadyFinalPreviewBundle,
              acceptedPreviewBuildBundle: previewReadyFinalPreviewBundle,
              acceptedBuildOutputs: [retainedExtrude1, rebuiltExtrude2],
              acceptedPreviewBuildOutputs: [retainedExtrude1, rebuiltExtrude2],
              authoritativeGeometryResult: previewReadyGeometry,
            },
          },
        },
      }))
      useAppStore.setState((state) => ({
        browserInteractionGraphDocumentIds: {
          ...state.browserInteractionGraphDocumentIds,
          'graph-document-1': true,
        },
        isInteracting: true,
      }))
    })

    const branchLocalCall = [...viewerSetViewportRenderLayers.mock.calls]
      .map(
        (call) =>
          call[0] as {
            baseParts?: Array<{ viewerKey: string }>
            baselineParts?: Array<{ viewerKey: string }>
            baselineStyle?: { opacity: number; color: string }
            overlayParts?: Array<{ viewerKey: string }>
            overlayStyle?: { opacity: number; color: string }
            overlayOpacity?: number
          },
      )
      .reverse()
      .find(
        (layers) =>
          layers.baseParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-1:node-extrude-1',
          ) === true &&
          layers.baselineParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true &&
          layers.overlayParts?.some(
            (part) => part.viewerKey === 'output-entry:slot-extrude-2:node-extrude-2',
          ) === true,
      )

    expect(branchLocalCall).toEqual(
      expect.objectContaining({
        baselineStyle: {
          opacity: 0.5,
          color: '#224466',
        },
        overlayStyle: {
          opacity: 0.75,
          color: '#00aa88',
        },
        overlayOpacity: 0.75,
      }),
    )

    await act(async () => {
      root?.unmount()
    })
    container?.remove()
  })

  it('routes viewport object picks into shared explicit selection and clears on empty clicks', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        label: 'Object 1',
      },
      {
        slotId: 'slot-cover',
        sourceNodeId: 'node-cover-1',
        sourcePartKey: 'cover',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        label: 'Object 2',
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          },
        ],
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'project-object:project-file-1:graph-document-1:output-object-1',
        rootKind: 'object',
        partKeys: expect.arrayContaining([
          'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
        ]),
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe(
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    )
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('target-selection')

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-cover:node-cover-1',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'object:project-object:project-file-1:graph-document-1:output-object-1',
        rootKind: 'multi-select',
        partKeys: expect.arrayContaining([
          'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          'graph-document-1:output-entry:slot-cover:node-cover-1',
        ]),
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe(
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    )

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-cover:node-cover-1',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'project-object:project-file-1:graph-document-1:output-object-1',
        rootKind: 'object',
        partKeys: expect.arrayContaining([
          'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
        ]),
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe(
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    )

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: null,
      explicitSelectedTargets: [],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: null,
    })
    expect(useAppStore.getState().selectedPartKey).toBeNull()

    act(() => {
      useSpaghettiStore.getState().setViewportSelectedSketchProfiles([
        {
          graphDocumentId: 'graph-document-1',
          sketchNodeId: 'node-sketch-1',
          profileId: 'profile-a',
          portId: 'SketchProfile:profile-a',
        },
      ])
    })

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [],
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().selectedPartKey).toBeNull()
    expect(useSpaghettiStore.getState().viewportSelectedSketchProfiles).toEqual([])
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('surface-clear')
  })

  it('promotes double-clicked topology picks to whole-body selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        label: 'Object 1',
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    await act(async () => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
            edgeId: 'edge:top',
            topologyBodyId: 'body:1',
          },
        ],
        ctrlKey: false,
      })
    })

    expect(viewerSetSelectedTopologyEntity).toHaveBeenLastCalledWith({
      kind: 'edge',
      partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
      edgeId: 'edge:top',
      bodyId: 'body:1',
    })

    await act(async () => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
            edgeId: 'edge:top',
            topologyBodyId: 'body:1',
          },
        ],
        ctrlKey: false,
        doubleClick: true,
      })
    })

    expect(viewerSetSelectedTopologyEntity).toHaveBeenLastCalledWith(null)
    expect(useAppStore.getState().selectedPartKey).toBe(
      'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
    )
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'object',
      objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
    })
  })

  it('commits viewport marquee batches as explicit multi-selection across picked objects', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        label: 'Object 1',
      },
      {
        slotId: 'slot-cover',
        sourceNodeId: 'node-cover-1',
        sourcePartKey: 'cover',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        label: 'Object 2',
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          },
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-cover:node-cover-1',
          },
        ],
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'object:project-object:project-file-1:graph-document-1:output-object-2',
        rootKind: 'multi-select',
        partKeys: expect.arrayContaining([
          'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          'graph-document-1:output-entry:slot-cover:node-cover-1',
        ]),
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe(
      'graph-document-1:output-entry:slot-cover:node-cover-1',
    )
  })

  it('commits mixed viewport marquee batches for objects and references through shared explicit selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        label: 'Object 1',
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          },
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
        ],
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
        {
          kind: 'object',
          objectId: 'reference-item-row:shoe:shoe-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'object:reference-item-row:shoe:shoe-1',
        rootKind: 'multi-select',
        partKeys: expect.arrayContaining([
          'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
        ]),
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBeNull()
  })

  it('keeps viewport explicit multi-select highlighted across all picked objects', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        label: 'Object 1',
      },
      {
        slotId: 'slot-cover',
        sourceNodeId: 'node-cover-1',
        sourcePartKey: 'cover',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        label: 'Object 2',
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
          },
        ],
        ctrlKey: false,
      })
    })

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'graph-document-1:output-entry:slot-cover:node-cover-1',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(viewerSetHighlightedPartKeys).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        'graph-document-1:output-entry:slot-baseplate:node-baseplate-1',
        'graph-document-1:output-entry:slot-cover:node-cover-1',
      ]),
    )
  })

  it('routes viewport reference picks back into workspace selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
        ],
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'reference-item-row:shoe:shoe-1',
        rootKind: 'object',
        partKeys: [],
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBeNull()
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('target-selection')
  })

  it('ctrl-click toggles viewport-picked references through shared explicit selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
        ],
        ctrlKey: false,
      })
    })

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-2',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'reference-item-row:shoe:shoe-1',
        },
        {
          kind: 'object',
          objectId: 'reference-item-row:shoe:shoe-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: null,
    })
    expect(useAppStore.getState().selectedPartKey).toBeNull()

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-2',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'reference-item-row:shoe:shoe-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'reference-item-row:shoe:shoe-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'reference-item-row:shoe:shoe-1',
        rootKind: 'object',
        partKeys: [],
        groupedRowIds: [],
      },
    })
  })

  it('keeps unmapped viewport part picks as single part selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        picks: [
          {
            kind: 'part',
            partKey: 'unmapped-part-key',
          },
        ],
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'part',
        partKey: 'unmapped-part-key',
      },
      explicitSelectedTargets: [],
      selectionAnchorTarget: null,
      resolvedContentSelection: null,
      activeSurface: 'viewer',
    })
    expect(useAppStore.getState().selectedPartKey).toBe('unmapped-part-key')
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('target-selection')
  })

  it('pushes selected references into the viewer highlight lane without starting transform ownership', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.setState((state) => ({
        ...state,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'object',
            objectId: 'reference-item-row:shoe:shoe-1',
          },
          activeSurface: 'browser',
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetHighlightedReferenceIds).toHaveBeenCalledWith(['shoe:shoe-1'])
    expect(viewerSetViewerTransformSession).not.toHaveBeenCalledWith(
      expect.objectContaining({ targetKind: 'reference', targetId: 'shoe:shoe-1' }),
    )
  })

  it('keeps Browser-selected environment lights out of Viewer Transform until Console opt-in', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    act(() => {
      useUiPrefsStore.setState((state) => ({
        ...state,
        view: {
          ...state.view,
          lighting: {
            ...state.view.lighting,
            lights: [
              {
                id: 'light-key',
                name: 'Key',
                type: 'point',
                enabled: true,
                color: '#ffffff',
                intensity: 1,
                position: { x: 0, y: 10, z: 0 },
              },
            ],
          },
        },
      }))
      useAppStore.setState((state) => ({
        ...state,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'environment-light',
            lightId: 'light-key',
          },
          activeSurface: 'browser',
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(
      useAppStore.getState().referenceWorkspace.activeEnvironmentLightTransformSession,
    ).toBeNull()
    expect(viewerSetViewerTransformSession).not.toHaveBeenCalledWith(
      expect.objectContaining({ targetKind: 'environment-light', targetId: 'light-key' }),
    )
  })

  it('pushes explicit multi-selected references into the viewer highlight lane', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.setState((state) => ({
        ...state,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'object',
            objectId: 'reference-item-row:shoe:shoe-2',
          },
          explicitSelectedTargets: [
            {
              kind: 'object',
              objectId: 'reference-item-row:shoe:shoe-1',
            },
            {
              kind: 'object',
              objectId: 'reference-item-row:shoe:shoe-2',
            },
          ],
          selectionAnchorTarget: {
            kind: 'object',
            objectId: 'reference-item-row:shoe:shoe-2',
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetHighlightedReferenceIds).toHaveBeenCalledWith(['shoe:shoe-1', 'shoe:shoe-2'])
  })

  it('pushes the active sketch-plane pick session into the viewer and routes plane picks back into the store', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                planeTransform: {
                  offsetMm: 0,
                  translation: { x: 0, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  inPlaneRotationDeg: 0,
                },
                components: [],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    expect(viewerSetSketchPlanePickOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        stage: 'pick',
        gizmoMode: 'translate',
        draftPlane: 'XY',
        draftTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
      }),
    )
    expect(viewerSetOnSketchPlanePickPlaneSelect).toHaveBeenCalledWith(expect.any(Function))
    expect(viewerSetOnSketchPlanePickTransformChange).toHaveBeenCalledWith(expect.any(Function))
    expect(viewerSetOnSketchPlanePickTransformCommit).toHaveBeenCalledWith(expect.any(Function))

    const planeSelectHandler = viewerSetOnSketchPlanePickPlaneSelect.mock.calls.at(-1)?.[0] as
      | ((plane: 'XY' | 'XZ' | 'YZ') => void)
      | null

    act(() => {
      planeSelectHandler?.('YZ')
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftPlane: 'YZ',
      stage: 'adjust',
    })

    const transformChangeHandler =
      viewerSetOnSketchPlanePickTransformChange.mock.calls.at(-1)?.[0] as
        | ((transform: {
            offsetMm: number
            inPlaneRotationDeg: number
            translation: { x: number; y: number; z: number }
            rotationDeg: { x: number; y: number; z: number }
          }) => void)
        | null

    act(() => {
      transformChangeHandler?.({
        offsetMm: 0,
        inPlaneRotationDeg: 0,
        translation: { x: 12, y: -4, z: 8 },
        rotationDeg: { x: 0, y: 30, z: 45 },
      })
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftTransform: {
        translation: { x: 12, y: -4, z: 8 },
        rotationDeg: { x: 0, y: 30, z: 45 },
      },
    })

    const transformCommitHandler =
      viewerSetOnSketchPlanePickTransformCommit.mock.calls.at(-1)?.[0] as (() => void) | null

    act(() => {
      transformCommitHandler?.()
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.transformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-1',
        point: { x: 12, y: -4, z: 8 },
        locked: false,
      },
    ])
  })

  it('renders Shift+D center edge controls and updates the edge display mode', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    const { useWorkspaceStore } = await import('../workspace/useWorkspaceStore')

    act(() => {
      useAppStore.getState().setActiveSurface('viewer')
      useWorkspaceStore.getState().setActiveViewerViewportId('model-viewer-primary')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost viewportId="model-viewer-primary" />)
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'D',
          code: 'KeyD',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(container.querySelector('[data-testid="viewport-display-mode-menu"]')).not.toBeNull()

    const visibleEdgesOnlyButton = container.querySelector(
      'button[aria-label="Visible edges only"]',
    ) as HTMLButtonElement | null
    expect(visibleEdgesOnlyButton).not.toBeNull()

    await act(async () => {
      visibleEdgesOnlyButton?.click()
    })

    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('visibleEdgesOnly')
    expect(container.querySelector('[data-testid="viewport-display-mode-menu"]')).not.toBeNull()
    expect(visibleEdgesOnlyButton?.getAttribute('aria-checked')).toBe('true')
  })
})
