import { describe, expect, it } from 'vitest'
import {
  analyzeFeatureDependencyGraph,
  canMoveFeatureInStack,
  getEffectiveFeatureStack,
  getFeatureDependencyIssues,
  moveFeatureInStack,
} from './featureDependencies'
import type { FeatureStack } from './featureTypes'

const stackFixture = (): FeatureStack => [
  {
    type: 'sketch',
    featureId: 'sketch-1',
    plane: 'XY',
    components: [],
    outputs: {
      profiles: [
        {
          profileId: 'profile-1',
          profileIndex: 0,
          area: 10,
          loop: {
            segments: [],
            winding: 'CCW',
          },
          verticesProxy: [],
        },
      ],
    },
    uiState: {
      collapsed: false,
    },
  },
  {
    type: 'closeProfile',
    featureId: 'close-1',
    inputs: {
      sourceSketchFeatureId: 'sketch-1',
    },
    outputs: {
      profileRef: {
        sourceFeatureId: 'sketch-1',
        profileId: 'profile-1',
        profileIndex: 0,
      },
    },
    uiState: {
      collapsed: false,
    },
  },
  {
    type: 'extrude',
    featureId: 'extrude-1',
    inputs: {
      profileRef: {
        sourceFeatureId: 'close-1',
        profileId: 'profile-1',
        profileIndex: 0,
      },
    },
    params: {
      depth: {
        kind: 'lit',
        value: 10,
      },
    },
    outputs: {
      bodyId: 'body-1',
    },
    uiState: {
      collapsed: false,
    },
  },
]

describe('featureDependencies', () => {
  it('treats legacy features without explicit enabled state as enabled', () => {
    expect(getEffectiveFeatureStack(stackFixture()).map((feature) => feature.featureId)).toEqual([
      'sketch-1',
      'close-1',
      'extrude-1',
    ])
  })

  it('excludes disabled features from effective ordered execution', () => {
    const stack = stackFixture()
    stack[1] = {
      ...stack[1],
      enabled: false,
    }
    expect(getEffectiveFeatureStack(stack).map((feature) => feature.featureId)).toEqual([
      'sketch-1',
      'extrude-1',
    ])
  })

  it('reports enabled downstream features that reference disabled sources as invalid', () => {
    const stack = stackFixture()
    stack[0] = {
      ...stack[0],
      enabled: false,
    }

    expect(getFeatureDependencyIssues(stack)).toEqual([
      {
        featureId: 'close-1',
        code: 'CLOSE_PROFILE_SOURCE_MISSING',
      },
      {
        featureId: 'extrude-1',
        code: 'EXTRUDE_PROFILE_REF_INVALID',
      },
    ])
  })

  it('builds a deterministic dependency graph with feature and driver edges', () => {
    const graph = analyzeFeatureDependencyGraph(stackFixture(), {
      driverLinks: [
        {
          rowId: 'drv:feature:firstExtrudeDepth',
          targetFeatureId: 'extrude-1',
        },
      ],
    })

    expect(graph.featureRows).toEqual([
      {
        rowId: 'feature:sketch-1',
        featureId: 'sketch-1',
        featureType: 'sketch',
        orderIndex: 0,
        enabled: true,
        effective: true,
      },
      {
        rowId: 'feature:close-1',
        featureId: 'close-1',
        featureType: 'closeProfile',
        orderIndex: 1,
        enabled: true,
        effective: true,
      },
      {
        rowId: 'feature:extrude-1',
        featureId: 'extrude-1',
        featureType: 'extrude',
        orderIndex: 2,
        enabled: true,
        effective: true,
      },
    ])
    expect(graph.edges).toEqual([
      {
        id: 'dep:driver:drv:feature:firstExtrudeDepth->feature:extrude-1',
        kind: 'driverToFeature',
        sourceKind: 'driverRow',
        sourceId: 'drv:feature:firstExtrudeDepth',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: true,
      },
      {
        id: 'dep:feature:close-1->feature:extrude-1',
        kind: 'featureToFeature',
        sourceKind: 'feature',
        sourceId: 'close-1',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: true,
      },
      {
        id: 'dep:feature:sketch-1->feature:close-1',
        kind: 'featureToFeature',
        sourceKind: 'feature',
        sourceId: 'sketch-1',
        targetFeatureId: 'close-1',
        targetRowId: 'feature:close-1',
        enabled: true,
        effective: true,
      },
    ])
  })

  it('keeps disabled features visible but marks rows and edges inactive', () => {
    const stack = stackFixture()
    stack[0] = {
      ...stack[0],
      enabled: false,
    }

    const graph = analyzeFeatureDependencyGraph(stack)

    expect(graph.featureRows).toEqual([
      {
        rowId: 'feature:sketch-1',
        featureId: 'sketch-1',
        featureType: 'sketch',
        orderIndex: 0,
        enabled: false,
        effective: false,
      },
      {
        rowId: 'feature:close-1',
        featureId: 'close-1',
        featureType: 'closeProfile',
        orderIndex: 1,
        enabled: true,
        effective: false,
      },
      {
        rowId: 'feature:extrude-1',
        featureId: 'extrude-1',
        featureType: 'extrude',
        orderIndex: 2,
        enabled: true,
        effective: false,
      },
    ])
    expect(graph.edges).toEqual([
      {
        id: 'dep:feature:close-1->feature:extrude-1',
        kind: 'featureToFeature',
        sourceKind: 'feature',
        sourceId: 'close-1',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: false,
      },
      {
        id: 'dep:feature:sketch-1->feature:close-1',
        kind: 'featureToFeature',
        sourceKind: 'feature',
        sourceId: 'sketch-1',
        targetFeatureId: 'close-1',
        targetRowId: 'feature:close-1',
        enabled: false,
        effective: false,
      },
    ])
  })

  it('prevents dependency-breaking reorder operations deterministically', () => {
    const stack = stackFixture()
    expect(canMoveFeatureInStack(stack, 'extrude-1', 'up')).toBe(false)
    expect(moveFeatureInStack(stack, 'extrude-1', 'up')).toBe(stack)
  })

  it('allows reorder operations that preserve dependency ordering', () => {
    const stack = stackFixture()
    stack.push({
      type: 'sketch',
      featureId: 'sketch-2',
      plane: 'XY',
      components: [],
      outputs: {
        profiles: [],
      },
      uiState: {
        collapsed: false,
      },
    })
    const moved = moveFeatureInStack(stack, 'sketch-2', 'up')
    expect(moved.map((feature) => feature.featureId)).toEqual([
      'sketch-1',
      'close-1',
      'sketch-2',
      'extrude-1',
    ])
  })

  it('updates dependency edges after valid reorder operations', () => {
    const stack = stackFixture()
    stack.push({
      type: 'sketch',
      featureId: 'sketch-2',
      plane: 'XY',
      components: [],
      outputs: {
        profiles: [],
      },
      uiState: {
        collapsed: false,
      },
    })

    const moved = moveFeatureInStack(stack, 'sketch-2', 'up')
    const graph = analyzeFeatureDependencyGraph(moved)

    expect(graph.featureRows.map((row) => row.featureId)).toEqual([
      'sketch-1',
      'close-1',
      'sketch-2',
      'extrude-1',
    ])
    expect(graph.edges.map((edge) => edge.id)).toEqual([
      'dep:feature:close-1->feature:extrude-1',
      'dep:feature:sketch-1->feature:close-1',
    ])
  })
})
