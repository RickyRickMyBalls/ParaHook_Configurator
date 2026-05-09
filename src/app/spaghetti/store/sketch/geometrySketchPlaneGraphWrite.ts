import type { StoreApi } from 'zustand'
import type {
  SketchFeature,
  SketchPlane,
} from '../../features/featureTypes'
import type { SpaghettiGraph } from '../../schema/spaghettiTypes'
import type { SpaghettiStoreState } from '../useSpaghettiStore'

type GeometrySketchPlaneGraphWriteActions = Pick<
  SpaghettiStoreState,
  | 'setGeometrySketchPlane'
  | 'setGeometrySketchPlaneOffset'
  | 'setGeometrySketchPlaneTranslationAxis'
  | 'setGeometrySketchPlaneRotationAxis'
  | 'setGeometrySketchPlaneInPlaneRotation'
>

type GeometrySketchPlaneGraphWriteDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  isSketchPlane: (value: unknown) => value is SketchPlane
  updateGeometrySketchNode: (
    graph: SpaghettiGraph,
    nodeId: string,
    updateFn: (feature: SketchFeature) => SketchFeature,
  ) => SpaghettiGraph
  ensureSketchPlaneTransform: (feature: SketchFeature) => NonNullable<SketchFeature['planeTransform']>
  withUpdatedActiveGraphDocumentState: (
    state: SpaghettiStoreState,
    nextGraph: SpaghettiGraph,
  ) => Partial<SpaghettiStoreState>
  pruneSketchPlanePickSession: (
    graph: SpaghettiGraph,
    session: SpaghettiStoreState['sketchPlanePickSession'],
  ) => SpaghettiStoreState['sketchPlanePickSession']
}

type SketchPlaneAxis = 'x' | 'y' | 'z'

export const createGeometrySketchPlaneGraphWriteActions = (
  dependencies: GeometrySketchPlaneGraphWriteDependencies,
): GeometrySketchPlaneGraphWriteActions => ({
  setGeometrySketchPlane: (nodeId, plane) => {
    if (!dependencies.isSketchPlane(plane)) {
      return
    }
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        if (feature.plane === plane) {
          return feature
        }
        return {
          ...feature,
          plane,
        }
      })
      const nextSession =
        state.sketchPlanePickSession?.nodeId === nodeId
          ? null
          : dependencies.pruneSketchPlanePickSession(nextGraph, state.sketchPlanePickSession)
      if (nextGraph === state.graph && nextSession === state.sketchPlanePickSession) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
        sketchPlanePickSession: nextSession,
      }
    })
  },

  setGeometrySketchPlaneOffset: (nodeId, offsetMm) => {
    if (!Number.isFinite(offsetMm)) {
      return
    }
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const currentTransform = dependencies.ensureSketchPlaneTransform(feature)
        if (currentTransform.offsetMm === offsetMm) {
          return feature
        }
        return {
          ...feature,
          planeTransform: {
            ...currentTransform,
            offsetMm,
          },
        }
      })
      if (nextGraph === state.graph) {
        return state
      }
      return dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },

  setGeometrySketchPlaneTranslationAxis: (nodeId, axis, value) => {
    if (!Number.isFinite(value)) {
      return
    }
    dependencies.set((state) => {
      const nextGraph = updateGeometrySketchPlaneTransformAxis(
        dependencies,
        state.graph,
        nodeId,
        'translation',
        axis,
        value,
      )
      if (nextGraph === state.graph) {
        return state
      }
      return dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },

  setGeometrySketchPlaneRotationAxis: (nodeId, axis, value) => {
    if (!Number.isFinite(value)) {
      return
    }
    dependencies.set((state) => {
      const nextGraph = updateGeometrySketchPlaneTransformAxis(
        dependencies,
        state.graph,
        nodeId,
        'rotationDeg',
        axis,
        value,
      )
      if (nextGraph === state.graph) {
        return state
      }
      return dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },

  setGeometrySketchPlaneInPlaneRotation: (nodeId, rotationDeg) => {
    if (!Number.isFinite(rotationDeg)) {
      return
    }
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const currentTransform = dependencies.ensureSketchPlaneTransform(feature)
        if (currentTransform.inPlaneRotationDeg === rotationDeg) {
          return feature
        }
        return {
          ...feature,
          planeTransform: {
            ...currentTransform,
            inPlaneRotationDeg: rotationDeg,
          },
        }
      })
      if (nextGraph === state.graph) {
        return state
      }
      return dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph)
    })
  },
})

const updateGeometrySketchPlaneTransformAxis = (
  dependencies: GeometrySketchPlaneGraphWriteDependencies,
  graph: SpaghettiGraph,
  nodeId: string,
  field: 'translation' | 'rotationDeg',
  axis: SketchPlaneAxis,
  value: number,
): SpaghettiGraph =>
  dependencies.updateGeometrySketchNode(graph, nodeId, (feature) => {
    const currentTransform = dependencies.ensureSketchPlaneTransform(feature)
    if (currentTransform[field][axis] === value) {
      return feature
    }
    return {
      ...feature,
      planeTransform: {
        ...currentTransform,
        [field]: {
          ...currentTransform[field],
          [axis]: value,
        },
      },
    }
  })
