import type { ViewerRenderablePart, PartArtifact } from '../../shared/buildTypes'
import {
  createDefaultSketchPlaneTransform,
  type SketchPlane,
  type SketchPlaneTransform,
  type Vec3Literal,
} from '../spaghetti/features/featureTypes'
import type { GraphDocument, SpaghettiGraph, SpaghettiNode } from '../spaghetti/schema/spaghettiTypes'
import type { SketchPlanePickSession } from '../spaghetti/store/useSpaghettiStore'
import type { RenderedProjectPartVm } from '../store/useAppStore'
import {
  projectSketchPointToWorld,
  projectWorldPointToSketchLocal,
} from '../../shared/sketchPlaneFrame'

type SketchPlaneState = {
  plane: SketchPlane
  transform: SketchPlaneTransform
}

type ApplyActiveDraftExtrudePreviewOverrideOptions = {
  graphDocumentsById: Record<string, GraphDocument>
  preferredGraphDocumentId: string | null
  renderedParts: readonly RenderedProjectPartVm[]
  viewerParts: readonly ViewerRenderablePart[]
  sketchPlanePickSession: SketchPlanePickSession | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isVec3Literal = (value: unknown): value is Vec3Literal =>
  isRecord(value) &&
  isFiniteNumber((value as { x?: unknown }).x) &&
  isFiniteNumber((value as { y?: unknown }).y) &&
  isFiniteNumber((value as { z?: unknown }).z)

const isSketchPlane = (value: unknown): value is SketchPlane =>
  value === 'XY' || value === 'XZ' || value === 'YZ'

const readSketchPlaneTransform = (value: unknown): SketchPlaneTransform => {
  const fallback = createDefaultSketchPlaneTransform()
  if (!isRecord(value)) {
    return fallback
  }
  return {
    offsetMm: isFiniteNumber((value as { offsetMm?: unknown }).offsetMm)
      ? (value as { offsetMm: number }).offsetMm
      : fallback.offsetMm,
    translation: isVec3Literal((value as { translation?: unknown }).translation)
      ? { ...(value as { translation: Vec3Literal }).translation }
      : fallback.translation,
    rotationDeg: isVec3Literal((value as { rotationDeg?: unknown }).rotationDeg)
      ? { ...(value as { rotationDeg: Vec3Literal }).rotationDeg }
      : fallback.rotationDeg,
    inPlaneRotationDeg: isFiniteNumber(
      (value as { inPlaneRotationDeg?: unknown }).inPlaneRotationDeg,
    )
      ? (value as { inPlaneRotationDeg: number }).inPlaneRotationDeg
      : fallback.inPlaneRotationDeg,
  }
}

const readGeometrySketchPlaneState = (
  graph: SpaghettiGraph,
  sketchNodeId: string,
): SketchPlaneState | null => {
  const sketchNode = graph.nodes.find(
    (node) => node.nodeId === sketchNodeId && node.type === 'Geometry/Sketch',
  )
  if (sketchNode === undefined) {
    return null
  }
  const sketch = (sketchNode.params as { sketch?: unknown }).sketch
  if (!isRecord(sketch)) {
    return {
      plane: 'XY',
      transform: createDefaultSketchPlaneTransform(),
    }
  }
  return {
    plane: isSketchPlane((sketch as { plane?: unknown }).plane)
      ? (sketch as { plane: SketchPlane }).plane
      : 'XY',
    transform: readSketchPlaneTransform((sketch as { planeTransform?: unknown }).planeTransform),
  }
}

const resolveGraphDocumentIdForSketchNode = (
  graphDocumentsById: Record<string, GraphDocument>,
  preferredGraphDocumentId: string | null,
  sketchNodeId: string,
): string | null => {
  if (preferredGraphDocumentId !== null) {
    const preferredGraph = graphDocumentsById[preferredGraphDocumentId]?.graph
    if (preferredGraph?.nodes.some((node) => node.nodeId === sketchNodeId)) {
      return preferredGraphDocumentId
    }
  }
  for (const graphDocument of Object.values(graphDocumentsById)) {
    if (graphDocument.graph.nodes.some((node) => node.nodeId === sketchNodeId)) {
      return graphDocument.graphDocumentId
    }
  }
  return null
}

const collectExtrudeNodeIdsDrivenBySketch = (
  graph: SpaghettiGraph,
  sketchNodeId: string,
): Set<string> => {
  const extrudeNodeIds = new Set<string>()
  const nodeById = new Map<string, SpaghettiNode>(graph.nodes.map((node) => [node.nodeId, node]))
  graph.edges.forEach((edge) => {
    if (edge.from.nodeId !== sketchNodeId || edge.to.portId !== 'ExtrusionProfile') {
      return
    }
    const targetNode = nodeById.get(edge.to.nodeId)
    if (targetNode?.type === 'Geometry/Extrude') {
      extrudeNodeIds.add(targetNode.nodeId)
    }
  })
  return extrudeNodeIds
}

const areSketchPlaneStatesEqual = (left: SketchPlaneState, right: SketchPlaneState): boolean =>
  left.plane === right.plane &&
  left.transform.offsetMm === right.transform.offsetMm &&
  left.transform.inPlaneRotationDeg === right.transform.inPlaneRotationDeg &&
  left.transform.translation.x === right.transform.translation.x &&
  left.transform.translation.y === right.transform.translation.y &&
  left.transform.translation.z === right.transform.translation.z &&
  left.transform.rotationDeg.x === right.transform.rotationDeg.x &&
  left.transform.rotationDeg.y === right.transform.rotationDeg.y &&
  left.transform.rotationDeg.z === right.transform.rotationDeg.z

const transformArtifactForDraftSketchPlane = (
  artifact: PartArtifact,
  committedState: SketchPlaneState,
  draftState: SketchPlaneState,
): PartArtifact => {
  if (artifact.kind !== 'mesh') {
    return artifact
  }

  const nextVertices = artifact.mesh.vertices.slice()
  for (let index = 0; index < nextVertices.length; index += 3) {
    const worldPoint = {
      x: artifact.mesh.vertices[index] ?? 0,
      y: artifact.mesh.vertices[index + 1] ?? 0,
      z: artifact.mesh.vertices[index + 2] ?? 0,
    }
    const sketchLocal = projectWorldPointToSketchLocal(
      committedState.plane,
      committedState.transform,
      worldPoint,
    )
    const nextWorldPoint = projectSketchPointToWorld(
      draftState.plane,
      draftState.transform,
      {
        x: sketchLocal.x,
        y: sketchLocal.y,
      },
      sketchLocal.z,
    )
    nextVertices[index] = nextWorldPoint.x
    nextVertices[index + 1] = nextWorldPoint.y
    nextVertices[index + 2] = nextWorldPoint.z
  }

  return {
    ...artifact,
    mesh: {
      vertices: nextVertices,
      indices: artifact.mesh.indices.slice(),
    },
  }
}

export const applyActiveDraftExtrudePreviewOverride = (
  options: ApplyActiveDraftExtrudePreviewOverrideOptions,
): ViewerRenderablePart[] => {
  const session = options.sketchPlanePickSession
  if (session === null || options.viewerParts.length === 0) {
    return [...options.viewerParts]
  }

  const graphDocumentId = resolveGraphDocumentIdForSketchNode(
    options.graphDocumentsById,
    options.preferredGraphDocumentId,
    session.nodeId,
  )
  if (graphDocumentId === null) {
    return [...options.viewerParts]
  }

  const graph = options.graphDocumentsById[graphDocumentId]?.graph
  if (graph === undefined) {
    return [...options.viewerParts]
  }

  const committedState = readGeometrySketchPlaneState(graph, session.nodeId)
  if (committedState === null) {
    return [...options.viewerParts]
  }

  const draftState: SketchPlaneState = {
    plane: session.draftPlane,
    transform: session.draftTransform,
  }
  if (areSketchPlaneStatesEqual(committedState, draftState)) {
    return [...options.viewerParts]
  }

  const drivenExtrudeNodeIds = collectExtrudeNodeIdsDrivenBySketch(graph, session.nodeId)
  if (drivenExtrudeNodeIds.size === 0) {
    return [...options.viewerParts]
  }

  const qualifyingViewerKeys = new Set(
    options.renderedParts
      .filter(
        (part) =>
          part.ownerGraphDocumentId === graphDocumentId &&
          part.sourceNodeId !== null &&
          drivenExtrudeNodeIds.has(part.sourceNodeId),
      )
      .map((part) => part.viewerKey),
  )
  if (qualifyingViewerKeys.size === 0) {
    return [...options.viewerParts]
  }

  return options.viewerParts.map((viewerPart) => {
    if (!qualifyingViewerKeys.has(viewerPart.viewerKey)) {
      return viewerPart
    }
    const nextArtifact = transformArtifactForDraftSketchPlane(
      viewerPart.artifact,
      committedState,
      draftState,
    )
    return nextArtifact === viewerPart.artifact
      ? viewerPart
      : {
          ...viewerPart,
          artifact: nextArtifact,
        }
  })
}
