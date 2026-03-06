import { readFeatureStack } from './featureSchema'
import type { FeatureStack } from './featureTypes'
import type { PortSpec, PortType, SpaghettiNode } from '../schema/spaghettiTypes'

type VirtualFeatureInputKind =
  | 'sketchRectWidth'
  | 'sketchRectLength'
  | 'extrudeDepth'
  | 'extrudeTaper'
  | 'extrudeOffset'

type ParsedVirtualFeatureInputPort = {
  kind: VirtualFeatureInputKind
  featureId: string
}

const VIRTUAL_PORT_PREFIX = 'fs:in'
const SKETCH_RECT_SEGMENT = 'sketchRect'
const EXTRUDE_SEGMENT = 'extrude'
const WIDTH_SEGMENT = 'width'
const LENGTH_SEGMENT = 'length'
const DEPTH_SEGMENT = 'depth'
const TAPER_SEGMENT = 'taper'
const OFFSET_SEGMENT = 'offset'

// v2.0 scope lock:
// - virtual feature inputs only
// - cube seed sketch width/length plus extrude depth/taper/offset only
// - no path support
// - single incoming edge
const FEATURE_DEPTH_PORT_TYPE: PortType = {
  kind: 'number',
  unit: 'mm',
}
const FEATURE_WIDTH_PORT_TYPE: PortType = {
  kind: 'number',
  unit: 'mm',
}
const FEATURE_LENGTH_PORT_TYPE: PortType = {
  kind: 'number',
  unit: 'mm',
}
const FEATURE_TAPER_PORT_TYPE: PortType = {
  kind: 'number',
  unit: 'deg',
}
const FEATURE_OFFSET_PORT_TYPE: PortType = {
  kind: 'number',
  unit: 'mm',
}

export const FEATURE_VIRTUAL_INPUT_MAX_CONNECTIONS = 1

const defaultNumberExpression = () => ({
  kind: 'lit' as const,
  value: 0,
})

export const buildExtrudeDepthVirtualInputPortId = (featureId: string): string =>
  `${VIRTUAL_PORT_PREFIX}:${featureId}:${EXTRUDE_SEGMENT}:${DEPTH_SEGMENT}`
export const buildSketchRectWidthVirtualInputPortId = (featureId: string): string =>
  `${VIRTUAL_PORT_PREFIX}:${featureId}:${SKETCH_RECT_SEGMENT}:${WIDTH_SEGMENT}`
export const buildSketchRectLengthVirtualInputPortId = (featureId: string): string =>
  `${VIRTUAL_PORT_PREFIX}:${featureId}:${SKETCH_RECT_SEGMENT}:${LENGTH_SEGMENT}`
export const buildExtrudeTaperVirtualInputPortId = (featureId: string): string =>
  `${VIRTUAL_PORT_PREFIX}:${featureId}:${EXTRUDE_SEGMENT}:${TAPER_SEGMENT}`
export const buildExtrudeOffsetVirtualInputPortId = (featureId: string): string =>
  `${VIRTUAL_PORT_PREFIX}:${featureId}:${EXTRUDE_SEGMENT}:${OFFSET_SEGMENT}`

export const parseFeatureVirtualInputPortId = (
  portId: string,
): ParsedVirtualFeatureInputPort | null => {
  const segments = portId.split(':')
  if (segments.length !== 5) {
    return null
  }
  if (segments[0] !== 'fs' || segments[1] !== 'in') {
    return null
  }
  const featureId = segments[2]
  if (featureId.length === 0) {
    return null
  }
  if (segments[3] === SKETCH_RECT_SEGMENT) {
    if (segments[4] === WIDTH_SEGMENT) {
      return {
        kind: 'sketchRectWidth',
        featureId,
      }
    }
    if (segments[4] === LENGTH_SEGMENT) {
      return {
        kind: 'sketchRectLength',
        featureId,
      }
    }
    return null
  }
  if (segments[3] === EXTRUDE_SEGMENT) {
    if (segments[4] === DEPTH_SEGMENT) {
      return {
        kind: 'extrudeDepth',
        featureId,
      }
    }
    if (segments[4] === TAPER_SEGMENT) {
      return {
        kind: 'extrudeTaper',
        featureId,
      }
    }
    if (segments[4] === OFFSET_SEGMENT) {
      return {
        kind: 'extrudeOffset',
        featureId,
      }
    }
  }
  return null
}

export const isFeatureVirtualInputPortId = (portId: string): boolean =>
  parseFeatureVirtualInputPortId(portId) !== null

export const buildSketchRectWidthVirtualInputPort = (featureId: string): PortSpec => ({
  portId: buildSketchRectWidthVirtualInputPortId(featureId),
  label: 'Width Input',
  type: FEATURE_WIDTH_PORT_TYPE,
  optional: true,
  maxConnectionsIn: FEATURE_VIRTUAL_INPUT_MAX_CONNECTIONS,
})

export const buildSketchRectLengthVirtualInputPort = (featureId: string): PortSpec => ({
  portId: buildSketchRectLengthVirtualInputPortId(featureId),
  label: 'Length Input',
  type: FEATURE_LENGTH_PORT_TYPE,
  optional: true,
  maxConnectionsIn: FEATURE_VIRTUAL_INPUT_MAX_CONNECTIONS,
})

export const buildExtrudeDepthVirtualInputPort = (featureId: string): PortSpec => ({
  portId: buildExtrudeDepthVirtualInputPortId(featureId),
  label: 'Depth Input',
  type: FEATURE_DEPTH_PORT_TYPE,
  optional: true,
  maxConnectionsIn: FEATURE_VIRTUAL_INPUT_MAX_CONNECTIONS,
})

export const buildExtrudeTaperVirtualInputPort = (featureId: string): PortSpec => ({
  portId: buildExtrudeTaperVirtualInputPortId(featureId),
  label: 'Taper Input',
  type: FEATURE_TAPER_PORT_TYPE,
  optional: true,
  maxConnectionsIn: FEATURE_VIRTUAL_INPUT_MAX_CONNECTIONS,
})

export const buildExtrudeOffsetVirtualInputPort = (featureId: string): PortSpec => ({
  portId: buildExtrudeOffsetVirtualInputPortId(featureId),
  label: 'Offset Input',
  type: FEATURE_OFFSET_PORT_TYPE,
  optional: true,
  maxConnectionsIn: FEATURE_VIRTUAL_INPUT_MAX_CONNECTIONS,
})

const isCubeSeedRectangleSketch = (
  feature: FeatureStack[number],
): feature is Extract<FeatureStack[number], { type: 'sketch' }> =>
  feature.type === 'sketch' &&
  feature.featureId === 'cube-sketch-1' &&
  feature.components.length === 4 &&
  feature.components.every((component) => component.type === 'line')

export const listFeatureVirtualInputPorts = (node: SpaghettiNode): PortSpec[] => {
  if (!node.type.startsWith('Part/')) {
    return []
  }
  const stack = readFeatureStack(node.params.featureStack)
  const ports: PortSpec[] = []
  for (const feature of stack) {
    if (isCubeSeedRectangleSketch(feature)) {
      ports.push(buildSketchRectWidthVirtualInputPort(feature.featureId))
      ports.push(buildSketchRectLengthVirtualInputPort(feature.featureId))
    }
    if (feature.type !== 'extrude') {
      continue
    }
    ports.push(buildExtrudeDepthVirtualInputPort(feature.featureId))
    ports.push(buildExtrudeTaperVirtualInputPort(feature.featureId))
    ports.push(buildExtrudeOffsetVirtualInputPort(feature.featureId))
  }
  return ports
}

const rewriteCubeSeedRectangleSketch = (
  feature: Extract<FeatureStack[number], { type: 'sketch' }>,
  dimensions: {
    width?: number
    length?: number
  },
) => {
  const currentLength = feature.components[0]?.type === 'line' ? feature.components[0].b.x : 0
  const currentWidth = feature.components[1]?.type === 'line' ? feature.components[1].b.y : 0
  const nextLength =
    typeof dimensions.length === 'number' && Number.isFinite(dimensions.length)
      ? dimensions.length
      : currentLength
  const nextWidth =
    typeof dimensions.width === 'number' && Number.isFinite(dimensions.width)
      ? dimensions.width
      : currentWidth

  const nextComponents = [
    {
      ...feature.components[0],
      a: { kind: 'lit' as const, x: 0, y: 0 },
      b: { kind: 'lit' as const, x: nextLength, y: 0 },
    },
    {
      ...feature.components[1],
      a: { kind: 'lit' as const, x: nextLength, y: 0 },
      b: { kind: 'lit' as const, x: nextLength, y: nextWidth },
    },
    {
      ...feature.components[2],
      a: { kind: 'lit' as const, x: nextLength, y: nextWidth },
      b: { kind: 'lit' as const, x: 0, y: nextWidth },
    },
    {
      ...feature.components[3],
      a: { kind: 'lit' as const, x: 0, y: nextWidth },
      b: { kind: 'lit' as const, x: 0, y: 0 },
    },
  ]

  const unchanged = nextComponents.every((component, index) => {
    const current = feature.components[index]
    return (
      current?.type === 'line' &&
      current.a.x === component.a.x &&
      current.a.y === component.a.y &&
      current.b.x === component.b.x &&
      current.b.y === component.b.y
    )
  })
  if (unchanged) {
    return feature
  }

  return {
    ...feature,
    components: nextComponents,
  }
}

export const applyFeatureVirtualInputOverrides = (
  stack: FeatureStack,
  resolvedInputsByPortId: Record<string, unknown> | undefined,
): FeatureStack => {
  if (resolvedInputsByPortId === undefined) {
    return stack
  }

  let changed = false
  const nextStack = stack.map((feature) => {
    if (isCubeSeedRectangleSketch(feature)) {
      const nextFeature = rewriteCubeSeedRectangleSketch(feature, {
        width: resolvedInputsByPortId[buildSketchRectWidthVirtualInputPortId(feature.featureId)] as
          | number
          | undefined,
        length: resolvedInputsByPortId[
          buildSketchRectLengthVirtualInputPortId(feature.featureId)
        ] as number | undefined,
      })
      if (nextFeature !== feature) {
        changed = true
      }
      return nextFeature
    }
    if (feature.type !== 'extrude') {
      return feature
    }
    const depthPortId = buildExtrudeDepthVirtualInputPortId(feature.featureId)
    const taperPortId = buildExtrudeTaperVirtualInputPortId(feature.featureId)
    const offsetPortId = buildExtrudeOffsetVirtualInputPortId(feature.featureId)
    const wiredDepth = resolvedInputsByPortId[depthPortId]
    const wiredTaper = resolvedInputsByPortId[taperPortId]
    const wiredOffset = resolvedInputsByPortId[offsetPortId]
    const nextDepth =
      typeof wiredDepth === 'number' && Number.isFinite(wiredDepth)
        ? {
            kind: 'lit' as const,
            value: wiredDepth,
          }
        : feature.params.depth
    const nextTaper =
      typeof wiredTaper === 'number' && Number.isFinite(wiredTaper)
        ? {
            kind: 'lit' as const,
            value: wiredTaper,
          }
        : feature.params.taper ?? defaultNumberExpression()
    const nextOffset =
      typeof wiredOffset === 'number' && Number.isFinite(wiredOffset)
        ? {
            kind: 'lit' as const,
            value: wiredOffset,
          }
        : feature.params.offset ?? defaultNumberExpression()

    if (
      nextDepth === feature.params.depth &&
      nextTaper === feature.params.taper &&
      nextOffset === feature.params.offset
    ) {
      return feature
    }
    changed = true
    return {
      ...feature,
      params: {
        ...feature.params,
        depth: nextDepth,
        taper: nextTaper,
        offset: nextOffset,
      },
    }
  })

  return changed ? nextStack : stack
}
