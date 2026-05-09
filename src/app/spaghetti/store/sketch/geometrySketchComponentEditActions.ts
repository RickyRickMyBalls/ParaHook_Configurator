import type { StoreApi } from 'zustand'
import type { SketchComponent, SketchFeature } from '../../features/featureTypes'
import type { SpaghettiGraph } from '../../schema/spaghettiTypes'
import type { SpaghettiStoreState } from '../useSpaghettiStore'

type GeometrySketchComponentEditActions = Pick<
  SpaghettiStoreState,
  | 'appendGeometrySketchComponent'
  | 'updateGeometrySketchComponentPoint'
  | 'setGeometrySketchComponentName'
  | 'setGeometrySketchDrawGroupName'
  | 'moveGeometrySketchComponentUp'
  | 'moveGeometrySketchComponentDown'
  | 'removeGeometrySketchComponent'
  | 'setGeometrySketchSelectedProfile'
>

type GeometrySketchComponentEditActionDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  updateGeometrySketchNode: (
    graph: SpaghettiGraph,
    nodeId: string,
    updateFn: (feature: SketchFeature) => SketchFeature,
  ) => SpaghettiGraph
  recomputeSketchFeature: (feature: SketchFeature) => SketchFeature
  withUpdatedActiveGraphDocumentState: (
    state: SpaghettiStoreState,
    nextGraph: SpaghettiGraph,
  ) => Partial<SpaghettiStoreState>
  pruneGeometrySketchSession: (
    graph: SpaghettiGraph,
    session: SpaghettiStoreState['geometrySketchSession'],
  ) => SpaghettiStoreState['geometrySketchSession']
  normalizeSketchComponentName: (name: string | null) => string | undefined
}

export const createGeometrySketchComponentEditActions = (
  dependencies: GeometrySketchComponentEditActionDependencies,
): GeometrySketchComponentEditActions => ({
  appendGeometrySketchComponent: (nodeId, component) => {
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) =>
        dependencies.recomputeSketchFeature({
          ...feature,
          components: [...feature.components, component],
        }),
      )
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
        geometrySketchSession: dependencies.pruneGeometrySketchSession(
          nextGraph,
          state.geometrySketchSession,
        ),
      }
    })
  },

  updateGeometrySketchComponentPoint: (nodeId, rowId, pointKey, value) => {
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const components = feature.components.map((component) => {
          if (component.rowId !== rowId || !(pointKey in component)) {
            return component
          }
          return {
            ...component,
            [pointKey]: value,
          } as SketchComponent
        })
        return dependencies.recomputeSketchFeature({
          ...feature,
          components,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },

  setGeometrySketchComponentName: (nodeId, rowId, name) => {
    dependencies.set((state) => {
      const normalizedName = dependencies.normalizeSketchComponentName(name)
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        let didChange = false
        const nextComponents = feature.components.map((component) => {
          if (component.rowId !== rowId) {
            return component
          }
          if (component.name === normalizedName) {
            return component
          }
          didChange = true
          if (normalizedName === undefined) {
            const { name: _name, ...rest } = component
            return rest as SketchComponent
          }
          return {
            ...component,
            name: normalizedName,
          }
        })
        if (!didChange) {
          return feature
        }
        return dependencies.recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },

  setGeometrySketchDrawGroupName: (nodeId, drawGroupId, name) => {
    dependencies.set((state) => {
      const normalizedName = dependencies.normalizeSketchComponentName(name)
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        let didChange = false
        const nextComponents = feature.components.map((component) => {
          if (component.type !== 'line' || component.drawGroupId !== drawGroupId) {
            return component
          }
          if (component.drawGroupName === normalizedName) {
            return component
          }
          didChange = true
          if (normalizedName === undefined) {
            const { drawGroupName: _drawGroupName, ...rest } = component
            return rest as SketchComponent
          }
          return {
            ...component,
            drawGroupName: normalizedName,
          }
        })
        if (!didChange) {
          return feature
        }
        return dependencies.recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },

  moveGeometrySketchComponentUp: (nodeId, rowId) => {
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const index = feature.components.findIndex((component) => component.rowId === rowId)
        if (index <= 0) {
          return feature
        }
        const nextComponents = feature.components.slice()
        const temp = nextComponents[index - 1]
        nextComponents[index - 1] = nextComponents[index]
        nextComponents[index] = temp
        return dependencies.recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },

  moveGeometrySketchComponentDown: (nodeId, rowId) => {
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const index = feature.components.findIndex((component) => component.rowId === rowId)
        if (index < 0 || index >= feature.components.length - 1) {
          return feature
        }
        const nextComponents = feature.components.slice()
        const temp = nextComponents[index + 1]
        nextComponents[index + 1] = nextComponents[index]
        nextComponents[index] = temp
        return dependencies.recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },

  removeGeometrySketchComponent: (nodeId, rowId) => {
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const nextComponents = feature.components.filter((component) => component.rowId !== rowId)
        if (nextComponents.length === feature.components.length) {
          return feature
        }
        return dependencies.recomputeSketchFeature({
          ...feature,
          components: nextComponents,
        })
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },

  setGeometrySketchSelectedProfile: (nodeId, profileId) => {
    dependencies.set((state) => {
      const nextGraph = dependencies.updateGeometrySketchNode(state.graph, nodeId, (feature) => {
        const nextSelectedProfileId =
          profileId === null || profileId.length === 0 ? undefined : profileId
        const nextFeature = dependencies.recomputeSketchFeature({
          ...feature,
          uiState: {
            ...feature.uiState,
            ...(nextSelectedProfileId === undefined
              ? {}
              : { selectedProfileId: nextSelectedProfileId }),
          },
        })
        if (
          nextSelectedProfileId === undefined &&
          nextFeature.uiState.selectedProfileId !== undefined
        ) {
          return {
            ...nextFeature,
            uiState: {
              collapsed: nextFeature.uiState.collapsed,
            },
          }
        }
        return nextFeature
      })
      if (nextGraph === state.graph) {
        return state
      }
      return {
        ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
      }
    })
  },
})
