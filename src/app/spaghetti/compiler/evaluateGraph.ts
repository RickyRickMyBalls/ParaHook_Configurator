import { getNodeDef } from '../registry/nodeRegistry'
import type {
  PortType,
  SpaghettiEdge,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import type { SpaghettiDiagnostic } from './validateGraph'
import { validateGraph } from './validateGraph'
import {
  getFieldTree,
  isCompositeFieldNode,
  listLeafFieldPaths,
  type FieldNode,
} from '../types/fieldTree'

export type EvaluationValue = unknown
export type NodeOutputMap = Record<string, Record<string, EvaluationValue>>
export type NodeInputMap = Record<string, Record<string, EvaluationValue>>

export type EvaluationResult = {
  ok: boolean
  inputsByNodeId: NodeInputMap
  outputsByNodeId: NodeOutputMap
  diagnostics: {
    errors: SpaghettiDiagnostic[]
    warnings: SpaghettiDiagnostic[]
  }
  topoOrder: string[]
}

const compareDiagnostics = (a: SpaghettiDiagnostic, b: SpaghettiDiagnostic): number =>
  a.code.localeCompare(b.code) ||
  (a.nodeId ?? '').localeCompare(b.nodeId ?? '') ||
  (a.edgeId ?? '').localeCompare(b.edgeId ?? '') ||
  a.message.localeCompare(b.message)

const sortDiagnostics = (
  diagnostics: readonly SpaghettiDiagnostic[],
): SpaghettiDiagnostic[] => [...diagnostics].sort(compareDiagnostics)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isVec2 = (value: unknown): value is { x: number; y: number } =>
  isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y)

const isVec3 = (value: unknown): value is { x: number; y: number; z: number } =>
  isRecord(value) &&
  isFiniteNumber(value.x) &&
  isFiniteNumber(value.y) &&
  isFiniteNumber(value.z)

const isSpline2 = (
  value: unknown,
): value is { points: { x: number; y: number }[]; closed: boolean } =>
  isRecord(value) &&
  Array.isArray(value.points) &&
  value.points.every((point) => isVec2(point)) &&
  typeof value.closed === 'boolean'

const isSpline3 = (
  value: unknown,
): value is { points: { x: number; y: number; z: number }[]; closed: boolean } =>
  isRecord(value) &&
  Array.isArray(value.points) &&
  value.points.every((point) => isVec3(point)) &&
  typeof value.closed === 'boolean'

const isOpaqueRefToken = (value: unknown): value is { __opaqueRef: string } =>
  isRecord(value) &&
  Object.keys(value).length === 1 &&
  typeof value.__opaqueRef === 'string'

const isValidForPortType = (value: unknown, type: PortType): boolean => {
  switch (type.kind) {
    case 'number':
      return isFiniteNumber(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'vec2':
      return isVec2(value)
    case 'vec3':
      return isVec3(value)
    case 'spline2':
      return isSpline2(value)
    case 'spline3':
      return isSpline3(value)
    case 'profileLoop':
    case 'stations':
      return true
    case 'railMath':
    case 'toeLoft':
      return value === null || isOpaqueRefToken(value)
    default:
      return false
  }
}

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const pathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

const pathEquals = (a: string[] | undefined, b: string[] | undefined): boolean => {
  const normalizedA = normalizePath(a)
  const normalizedB = normalizePath(b)
  if (normalizedA === undefined || normalizedB === undefined) {
    return normalizedA === normalizedB
  }
  if (normalizedA.length !== normalizedB.length) {
    return false
  }
  for (let index = 0; index < normalizedA.length; index += 1) {
    if (normalizedA[index] !== normalizedB[index]) {
      return false
    }
  }
  return true
}

const getValueAtPath = (value: unknown, path: string[] | undefined): unknown => {
  const normalizedPath = normalizePath(path)
  if (normalizedPath === undefined) {
    return value
  }
  let current: unknown = value
  for (const segment of normalizedPath) {
    if (segment === '*') {
      if (!Array.isArray(current) || current.length === 0) {
        return undefined
      }
      current = current[0]
      continue
    }
    if (!isRecord(current)) {
      return undefined
    }
    current = current[segment]
  }
  return current
}

const withPathValue = (target: unknown, path: string[], nextValue: unknown): unknown => {
  if (path.length === 0) {
    return nextValue
  }

  const [segment, ...rest] = path
  if (segment === '*') {
    const currentArray = Array.isArray(target) ? [...target] : []
    currentArray[0] = withPathValue(currentArray[0], rest, nextValue)
    return currentArray
  }

  const currentRecord = isRecord(target) ? { ...target } : {}
  currentRecord[segment] = withPathValue(currentRecord[segment], rest, nextValue)
  return currentRecord
}

const defaultValueForLeafType = (type: PortType): unknown => {
  switch (type.kind) {
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'vec2':
      return { x: 0, y: 0 }
    case 'vec3':
      return { x: 0, y: 0, z: 0 }
    case 'spline2':
      return { points: [], closed: false }
    case 'spline3':
      return { points: [], closed: false }
    case 'profileLoop':
      return null
    case 'stations':
      return []
    case 'railMath':
    case 'toeLoft':
      return null
    default:
      return null
  }
}

const defaultValueFromFieldNode = (fieldNode: FieldNode): unknown => {
  if (fieldNode.kind === 'leaf') {
    return defaultValueForLeafType(fieldNode.type)
  }
  if (fieldNode.kind === 'array') {
    return []
  }
  const result: Record<string, unknown> = {}
  const entries = Object.entries(fieldNode.children ?? {}).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )
  for (const [key, childNode] of entries) {
    result[key] = defaultValueFromFieldNode(childNode)
  }
  return result
}

const compareNodes = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const computeTopoOrder = (graph: SpaghettiGraph): string[] => {
  const nodeIds = [...graph.nodes].map((node) => node.nodeId).sort((a, b) => a.localeCompare(b))
  const nodeIdSet = new Set(nodeIds)
  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()

  for (const nodeId of nodeIds) {
    adjacency.set(nodeId, new Set())
    indegree.set(nodeId, 0)
  }

  const sortedEdges = [...graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
  for (const edge of sortedEdges) {
    if (!nodeIdSet.has(edge.from.nodeId) || !nodeIdSet.has(edge.to.nodeId)) {
      continue
    }
    const targets = adjacency.get(edge.from.nodeId)
    if (targets === undefined || targets.has(edge.to.nodeId)) {
      continue
    }
    targets.add(edge.to.nodeId)
    indegree.set(edge.to.nodeId, (indegree.get(edge.to.nodeId) ?? 0) + 1)
  }

  const queue = [...indegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([nodeId]) => nodeId)
    .sort((a, b) => a.localeCompare(b))

  const topoOrder: string[] = []
  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (nodeId === undefined) {
      break
    }
    topoOrder.push(nodeId)
    const neighbors = [...(adjacency.get(nodeId) ?? [])].sort((a, b) => a.localeCompare(b))
    for (const neighbor of neighbors) {
      const nextInDegree = (indegree.get(neighbor) ?? 0) - 1
      indegree.set(neighbor, nextInDegree)
      if (nextInDegree === 0) {
        queue.push(neighbor)
        queue.sort((a, b) => a.localeCompare(b))
      }
    }
  }

  if (topoOrder.length === nodeIds.length) {
    return topoOrder
  }

  const seen = new Set(topoOrder)
  const remaining = nodeIds.filter((nodeId) => !seen.has(nodeId))
  return [...topoOrder, ...remaining]
}

const buildIncomingEdgesMap = (graph: SpaghettiGraph): Map<string, SpaghettiEdge[]> => {
  const incomingEdgesByNodeId = new Map<string, SpaghettiEdge[]>()
  for (const node of graph.nodes) {
    incomingEdgesByNodeId.set(node.nodeId, [])
  }

  const sortedEdges = [...graph.edges].sort((a, b) => a.edgeId.localeCompare(b.edgeId))
  for (const edge of sortedEdges) {
    if (!incomingEdgesByNodeId.has(edge.to.nodeId)) {
      continue
    }
    incomingEdgesByNodeId.get(edge.to.nodeId)?.push(edge)
  }
  return incomingEdgesByNodeId
}

export const evaluateSpaghettiGraph = (graph: SpaghettiGraph): EvaluationResult => {
  const validation = validateGraph(graph)
  if (validation.errors.length > 0) {
    return {
      ok: false,
      inputsByNodeId: {},
      outputsByNodeId: {},
      diagnostics: {
        errors: sortDiagnostics(validation.errors),
        warnings: sortDiagnostics(validation.warnings),
      },
      topoOrder: [],
    }
  }

  const errors: SpaghettiDiagnostic[] = []
  const warnings: SpaghettiDiagnostic[] = []
  const inputsByNodeId: NodeInputMap = {}
  const outputsByNodeId: NodeOutputMap = {}
  const topoOrder = computeTopoOrder(graph)
  const incomingEdgesByNodeId = buildIncomingEdgesMap(graph)
  const sortedNodes = [...graph.nodes].sort(compareNodes)
  const nodeById = new Map(sortedNodes.map((node) => [node.nodeId, node]))

  for (const nodeId of topoOrder) {
    const node = nodeById.get(nodeId)
    if (node === undefined) {
      continue
    }

    const nodeDef = getNodeDef(node.type)
    if (nodeDef === undefined) {
      continue
    }

    const incomingEdges = incomingEdgesByNodeId.get(nodeId) ?? []
    const inputs: Record<string, unknown> = {}
    let hasNodeError = false

    const resolveSourceValueFromEdge = (edge: SpaghettiEdge): unknown => {
      const sourceOutputs = outputsByNodeId[edge.from.nodeId]
      const sourceValue = sourceOutputs?.[edge.from.portId]
      if (sourceValue === undefined) {
        hasNodeError = true
        errors.push({
          level: 'error',
          code: 'INPUT_SOURCE_VALUE_MISSING',
          message: `Missing source value for "${edge.from.nodeId}.${edge.from.portId}" feeding "${nodeId}.${edge.to.portId}${edge.to.path === undefined ? '' : `.${pathKey(edge.to.path)}`}".`,
          nodeId,
          edgeId: edge.edgeId,
        })
        return undefined
      }
      return getValueAtPath(sourceValue, edge.from.path)
    }

    const resolveLiteralOrDefaultComposite = (
      fieldNode: FieldNode,
      literalValue: unknown,
      defaultValue: unknown,
      path: string[],
    ): unknown => {
      const fromLiteral = getValueAtPath(literalValue, path)
      if (isValidForPortType(fromLiteral, fieldNode.type)) {
        return fromLiteral
      }
      const fromDefault = getValueAtPath(defaultValue, path)
      if (isValidForPortType(fromDefault, fieldNode.type)) {
        return fromDefault
      }
      return defaultValueForLeafType(fieldNode.type)
    }

    for (const inputPort of nodeDef.inputs) {
      const matchingEdges = incomingEdges.filter((edge) => edge.to.portId === inputPort.portId)
      const fieldTree = getFieldTree(inputPort.type)
      const literalValue = node.params[inputPort.portId]
      const defaultValue = defaultValueFromFieldNode(fieldTree)

      if (isCompositeFieldNode(fieldTree)) {
        const wholeEdges = matchingEdges.filter(
          (edge) => normalizePath(edge.to.path) === undefined,
        )
        const leafEdges = matchingEdges.filter(
          (edge) => normalizePath(edge.to.path) !== undefined,
        )

        if (wholeEdges.length > 1) {
          hasNodeError = true
          errors.push({
            level: 'error',
            code: 'MULTIPLE_INPUTS',
            message: `Input "${inputPort.portId}" on node "${nodeId}" has multiple whole-port incoming edges.`,
            nodeId,
          })
          continue
        }

        const wholeEdge = wholeEdges[0]
        const wholeValue = wholeEdge === undefined ? undefined : resolveSourceValueFromEdge(wholeEdge)

        if (leafEdges.length > 0) {
          const leafPaths = listLeafFieldPaths(fieldTree)
          let assembledValue: unknown = defaultValue
          for (const leaf of leafPaths) {
            const leafEdge = leafEdges.find((edge) => pathEquals(edge.to.path, leaf.path))
            let resolvedLeafValue: unknown

            if (leafEdge !== undefined) {
              const sourceLeafValue = resolveSourceValueFromEdge(leafEdge)
              if (isValidForPortType(sourceLeafValue, leaf.node.type)) {
                resolvedLeafValue = sourceLeafValue
              } else {
                hasNodeError = true
                errors.push({
                  level: 'error',
                  code: 'INPUT_SOURCE_VALUE_MISSING',
                  message: `Missing source leaf value for "${leafEdge.from.nodeId}.${leafEdge.from.portId}${leafEdge.from.path === undefined ? '' : `.${pathKey(leafEdge.from.path)}`}" feeding "${nodeId}.${inputPort.portId}.${pathKey(leaf.path)}".`,
                  nodeId,
                  edgeId: leafEdge.edgeId,
                })
                resolvedLeafValue = resolveLiteralOrDefaultComposite(
                  leaf.node,
                  literalValue,
                  defaultValue,
                  leaf.path,
                )
              }
            } else {
              const wholeFieldValue = getValueAtPath(wholeValue, leaf.path)
              if (isValidForPortType(wholeFieldValue, leaf.node.type)) {
                resolvedLeafValue = wholeFieldValue
              } else {
                resolvedLeafValue = resolveLiteralOrDefaultComposite(
                  leaf.node,
                  literalValue,
                  defaultValue,
                  leaf.path,
                )
              }
            }
            assembledValue = withPathValue(assembledValue, leaf.path, resolvedLeafValue)
          }
          inputs[inputPort.portId] = assembledValue
          continue
        }

        if (wholeEdge !== undefined && isValidForPortType(wholeValue, inputPort.type)) {
          inputs[inputPort.portId] = wholeValue
          continue
        }

        if (isValidForPortType(literalValue, inputPort.type)) {
          inputs[inputPort.portId] = literalValue
          continue
        }

        inputs[inputPort.portId] = defaultValue
        continue
      }

      const wholeEdges = matchingEdges.filter((edge) => normalizePath(edge.to.path) === undefined)
      if (wholeEdges.length === 0) {
        if (inputPort.optional === true) {
          continue
        }
        hasNodeError = true
        errors.push({
          level: 'error',
          code: 'MISSING_REQUIRED_INPUT',
          message: `Missing required input "${inputPort.portId}" on node "${nodeId}".`,
          nodeId,
        })
        continue
      }

      if (wholeEdges.length > 1) {
        hasNodeError = true
        errors.push({
          level: 'error',
          code: 'MULTIPLE_INPUTS',
          message: `Input "${inputPort.portId}" on node "${nodeId}" has multiple incoming edges.`,
          nodeId,
        })
        continue
      }

      const edge = wholeEdges[0]
      const sourceValue = resolveSourceValueFromEdge(edge)
      if (sourceValue === undefined) {
        continue
      }
      inputs[inputPort.portId] = sourceValue
    }

    if (hasNodeError) {
      continue
    }
    inputsByNodeId[nodeId] = inputs

    let computedUnknown: unknown
    try {
      computedUnknown = nodeDef.compute({
        nodeId,
        params: node.params,
        inputs,
      })
    } catch (error) {
      errors.push({
        level: 'error',
        code: 'NODE_COMPUTE_THROW',
        message:
          error instanceof Error
            ? `Node compute threw: ${error.message}`
            : 'Node compute threw.',
        nodeId,
      })
      continue
    }

    if (!isRecord(computedUnknown)) {
      errors.push({
        level: 'error',
        code: 'OUTPUT_INVALID_SHAPE',
        message: `Node "${nodeId}" compute must return a plain object.`,
        nodeId,
      })
      continue
    }

    const computed = computedUnknown
    const outputPortIds = new Set(nodeDef.outputs.map((port) => port.portId))
    const nodeOutputs: Record<string, unknown> = {}

    for (const outputPort of nodeDef.outputs) {
      if (!(outputPort.portId in computed)) {
        errors.push({
          level: 'error',
          code: 'OUTPUT_MISSING_PORT',
          message: `Node "${nodeId}" did not return required output "${outputPort.portId}".`,
          nodeId,
        })
        continue
      }
      const value = computed[outputPort.portId]
      if (!isValidForPortType(value, outputPort.type)) {
        errors.push({
          level: 'error',
          code: 'OUTPUT_INVALID_SHAPE',
          message: `Invalid output shape for "${nodeId}.${outputPort.portId}" (${outputPort.type.kind}).`,
          nodeId,
        })
        continue
      }
      nodeOutputs[outputPort.portId] = value
    }

    for (const key of Object.keys(computed)) {
      if (outputPortIds.has(key)) {
        continue
      }
      errors.push({
        level: 'error',
        code: 'OUTPUT_EXTRA_PORT',
        message: `Node "${nodeId}" returned undeclared output "${key}".`,
        nodeId,
      })
    }

    outputsByNodeId[nodeId] = nodeOutputs
  }

  const sortedErrors = sortDiagnostics(errors)
  const sortedWarnings = sortDiagnostics(warnings)

  return {
    ok: sortedErrors.length === 0,
    inputsByNodeId,
    outputsByNodeId,
    diagnostics: {
      errors: sortedErrors,
      warnings: sortedWarnings,
    },
    topoOrder,
  }
}
