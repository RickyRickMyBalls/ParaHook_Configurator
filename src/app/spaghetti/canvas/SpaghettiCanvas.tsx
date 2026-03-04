import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  getDefaultNodeParams,
  getNodeDef,
  listNodeTypes,
  type NodeTypeId,
} from '../registry/nodeRegistry'
import type {
  PortSpec,
  SpaghettiGraph,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import { useSpaghettiStore, type ConnectionDragState } from '../store/useSpaghettiStore'
import { validateGraph } from '../compiler/validateGraph'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { NodeView, type NodeInputCompositeState } from './NodeView'
import {
  buildNodeDriverVm,
  type DriverNumberChange,
  type NodeDriverVm,
} from './driverVm'
import type { PortDetailLine } from './PortView'
import { getFieldNodeAtPath, getFieldTree } from '../types/fieldTree'
import { SpaghettiContextMenu } from '../ui/SpaghettiContextMenu'
import type {
  ConnectionValidationResult,
  PortAnchorMap,
  PortDirection,
} from './types'
import { buildPortAnchorKey, parsePortAnchorKey } from './types'
import { WireLayer } from './WireLayer'
import { getTypeColor } from './typeColors'
import type { RowViewMode } from './rowViewMode'
import {
  buildCompositeExpansionKey,
  type CompositeExpansionDirection,
} from './compositeExpansion'
import { isInteractiveTarget } from '../spInteractive'

type EndpointPayload = {
  nodeId: string
  portId: string
  path?: string[]
}

type InputTarget = EndpointPayload
type OutputTarget = EndpointPayload

type CanvasViewState = {
  panX: number
  panY: number
  zoom: number
}

type ConnectionDragAnchor = {
  direction: PortDirection
  nodeId: string
  portId: string
  path: string[] | undefined
}

const compareNodes = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const compareEdges = (a: SpaghettiGraph['edges'][number], b: SpaghettiGraph['edges'][number]): number =>
  a.edgeId.localeCompare(b.edgeId)

const describePortType = (type: PortSpec['type']): string =>
  type.unit === undefined ? type.kind : `${type.kind}:${type.unit}`

const clampNumber = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? value.toString() : value.toFixed(3)

const isSpline2Like = (value: unknown): value is { points: Array<{ x: number; y: number }>; closed: boolean } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as { points?: unknown; closed?: unknown }
  if (!Array.isArray(candidate.points) || typeof candidate.closed !== 'boolean') {
    return false
  }
  return candidate.points.every((point) => {
    if (typeof point !== 'object' || point === null) {
      return false
    }
    const vec = point as { x?: unknown; y?: unknown }
    return typeof vec.x === 'number' && Number.isFinite(vec.x) && typeof vec.y === 'number' && Number.isFinite(vec.y)
  })
}

const isVec2Like = (value: unknown): value is { x: number; y: number } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as { x?: unknown; y?: unknown }
  return (
    typeof candidate.x === 'number' &&
    Number.isFinite(candidate.x) &&
    typeof candidate.y === 'number' &&
    Number.isFinite(candidate.y)
  )
}

const resolveEndpointKind = (
  graph: SpaghettiGraph,
  endpoint: EndpointPayload,
  direction: PortDirection,
): PortSpec['type']['kind'] | null => {
  const node = graph.nodes.find((candidate) => candidate.nodeId === endpoint.nodeId)
  if (node === undefined) {
    return null
  }
  const nodeDef = getNodeDef(node.type)
  if (nodeDef === undefined) {
    return null
  }
  const ports = direction === 'out' ? nodeDef.outputs : nodeDef.inputs
  const port = ports.find((candidate) => candidate.portId === endpoint.portId)
  if (port === undefined) {
    return null
  }
  const fieldNode = getFieldNodeAtPath(getFieldTree(port.type), endpoint.path)
  if (fieldNode?.kind === 'leaf') {
    return fieldNode.type.kind
  }
  return port.type.kind
}

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const toEdgeEndpoint = (endpoint: EndpointPayload): EndpointPayload => {
  const normalized = normalizePath(endpoint.path)
  return {
    nodeId: endpoint.nodeId,
    portId: endpoint.portId,
    ...(normalized === undefined ? {} : { path: normalized }),
  }
}

const endpointPathKey = (path: string[] | undefined): string =>
  normalizePath(path)?.join('.') ?? ''

const leafPortPathKey = (portId: string, path: string[] | undefined): string =>
  `${portId}::${endpointPathKey(path)}`

const isSketchAnchorPointValueBarClickTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false
  }
  const valueBar = target.closest('.SpaghettiValueBar')
  if (valueBar === null) {
    return false
  }
  const compositeGroup = valueBar.closest('.SpaghettiCompositeGroup')
  let portElement = valueBar.closest('.SpaghettiPort--in')
  if (compositeGroup !== null) {
    for (const child of Array.from(compositeGroup.children)) {
      if (child instanceof HTMLElement && child.classList.contains('SpaghettiPort--in')) {
        portElement = child
        break
      }
    }
  }
  if (portElement === null) {
    return false
  }
  const portName = portElement.querySelector('.SpaghettiPortName')?.textContent?.trim() ?? ''
  if (!/^Anchor Point [1-5]$/.test(portName)) {
    return false
  }
  const nodeElement = portElement.closest('.SpaghettiNode')
  if (nodeElement === null) {
    return false
  }
  const sketchInputsLabel = nodeElement.querySelector('.SpaghettiNodeSketchInputsLabel')
  if (sketchInputsLabel === null) {
    return false
  }
  const relation = sketchInputsLabel.compareDocumentPosition(portElement)
  return (relation & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
}

const isTopDragHandle = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false
  }
  return (
    target.closest('.SpaghettiNodeHeader') !== null ||
    target.closest('.SpaghettiNodePresetRow') !== null ||
    target.closest('.SpaghettiNodeToolbarEditor') !== null
  )
}

const getValueAtPath = (value: unknown, path: string[] | undefined): unknown => {
  if (path === undefined || path.length === 0) {
    return value
  }
  let current: unknown = value
  for (const segment of path) {
    if (typeof current !== 'object' || current === null) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

const pathsEqual = (a: string[] | undefined, b: string[] | undefined): boolean => {
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

const toStagePoint = (
  event: PointerEvent,
  viewportElement: HTMLElement,
  view: CanvasViewState,
) => {
  return toStagePointFromClient(event.clientX, event.clientY, viewportElement, view)
}

const toStagePointFromClient = (
  clientX: number,
  clientY: number,
  viewportElement: HTMLElement,
  view: CanvasViewState,
) => {
  const rect = viewportElement.getBoundingClientRect()
  return {
    x: (clientX - rect.left - view.panX) / view.zoom,
    y: (clientY - rect.top - view.panY) / view.zoom,
  }
}

const buildTentativeEdgeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `edge-${crypto.randomUUID()}`
  }
  fallbackEdgeIdCounter += 1
  return `edge-fallback-${fallbackEdgeIdCounter}`
}

let fallbackEdgeIdCounter = 0

const generateUniqueEdgeId = (graph: SpaghettiGraph): string => {
  const existing = new Set(graph.edges.map((edge) => edge.edgeId))
  let candidate = buildTentativeEdgeId()
  let suffix = 2
  while (existing.has(candidate)) {
    candidate = `${buildTentativeEdgeId()}-${suffix}`
    suffix += 1
  }
  return candidate
}

const buildTentativeNodeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `node-${crypto.randomUUID()}`
  }
  fallbackNodeIdCounter += 1
  return `node-fallback-${fallbackNodeIdCounter}`
}

let fallbackNodeIdCounter = 0

const generateUniqueNodeId = (graph: SpaghettiGraph): string => {
  const existing = new Set(graph.nodes.map((node) => node.nodeId))
  let candidate = buildTentativeNodeId()
  let suffix = 2
  while (existing.has(candidate)) {
    candidate = `${buildTentativeNodeId()}-${suffix}`
    suffix += 1
  }
  return candidate
}

const buildBaseplateSketchPointParams = (lengthMm: number, widthMm: number) => ({
  anchorPoint1: { x: 0, y: 0 },
  anchorPoint2: { x: lengthMm, y: 0 },
  anchorPoint3: { x: lengthMm, y: widthMm },
  anchorPoint4: { x: 0, y: widthMm },
  anchorPoint5: { x: 0, y: 0 },
})

const validateConnectionCheap = (
  graph: SpaghettiGraph,
  payload: {
    from: EndpointPayload
    to: EndpointPayload
  },
): ConnectionValidationResult => {
  const fromNode = graph.nodes.find((node) => node.nodeId === payload.from.nodeId)
  const toNode = graph.nodes.find((node) => node.nodeId === payload.to.nodeId)
  if (fromNode === undefined || toNode === undefined) {
    return {
      ok: false,
      reason: 'Endpoint node not found.',
    }
  }

  const fromDef = getNodeDef(fromNode.type)
  const toDef = getNodeDef(toNode.type)
  if (fromDef === undefined || toDef === undefined) {
    return {
      ok: false,
      reason: 'Node definition not found.',
    }
  }

  const fromPort = fromDef.outputs.find((port) => port.portId === payload.from.portId)
  const toPort = toDef.inputs.find((port) => port.portId === payload.to.portId)
  if (fromPort === undefined || toPort === undefined) {
    return {
      ok: false,
      reason: 'Port not found.',
    }
  }

  const fromFieldNode = getFieldNodeAtPath(getFieldTree(fromPort.type), payload.from.path)
  const toFieldNode = getFieldNodeAtPath(getFieldTree(toPort.type), payload.to.path)
  if (fromFieldNode === undefined || toFieldNode === undefined) {
    return {
      ok: false,
      reason: 'Path not found.',
    }
  }
  if (
    (payload.from.path !== undefined && fromFieldNode.kind !== 'leaf') ||
    (payload.to.path !== undefined && toFieldNode.kind !== 'leaf')
  ) {
    return {
      ok: false,
      reason: 'Connection endpoint must target leaf fields.',
    }
  }

  if (fromFieldNode.type.kind !== toFieldNode.type.kind) {
    return {
      ok: false,
      reason: `Port kinds do not match (${fromFieldNode.type.kind} -> ${toFieldNode.type.kind}).`,
    }
  }

  if (fromFieldNode.type.unit !== toFieldNode.type.unit) {
    return {
      ok: false,
      reason: 'Port units do not match.',
    }
  }

  const duplicate = graph.edges.some(
    (edge) =>
      edge.from.nodeId === payload.from.nodeId &&
      edge.from.portId === payload.from.portId &&
      pathsEqual(edge.from.path, payload.from.path) &&
      edge.to.nodeId === payload.to.nodeId &&
      edge.to.portId === payload.to.portId &&
      pathsEqual(edge.to.path, payload.to.path),
  )
  if (duplicate) {
    return {
      ok: false,
      reason: 'Connection already exists.',
    }
  }

  const incomingCount = graph.edges.filter(
    (edge) =>
      edge.to.nodeId === payload.to.nodeId &&
      edge.to.portId === payload.to.portId &&
      pathsEqual(edge.to.path, payload.to.path),
  ).length
  const maxConnectionsIn = toPort.maxConnectionsIn ?? 1
  if (incomingCount >= maxConnectionsIn) {
    return {
      ok: false,
      reason: `Input allows up to ${maxConnectionsIn} connection(s).`,
    }
  }

  return { ok: true }
}

const areAnchorsEqual = (a: PortAnchorMap, b: PortAnchorMap): boolean => {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) {
    return false
  }
  for (const key of keysA) {
    const valueA = a[key]
    const valueB = b[key]
    if (valueB === undefined) {
      return false
    }
    if (valueA.x !== valueB.x || valueA.y !== valueB.y) {
      return false
    }
  }
  return true
}

const distanceSq = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

const distancePointToSegmentSq = (
  point: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number => {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const abLenSq = abx * abx + aby * aby
  if (abLenSq <= 0.000001) {
    return distanceSq(point, a)
  }
  const apx = point.x - a.x
  const apy = point.y - a.y
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLenSq))
  const closest = {
    x: a.x + abx * t,
    y: a.y + aby * t,
  }
  return distanceSq(point, closest)
}

type NodeRenderData = {
  inputPortDetails: Record<string, PortDetailLine[]>
  outputPortDetails: Record<string, PortDetailLine[]>
  inputCompositeState: NodeInputCompositeState
  primitiveNumberValue: number
  driverVm: NodeDriverVm | null
}

const EMPTY_NODE_INPUT_COMPOSITE_STATE: NodeInputCompositeState = {
  wholeDrivenByPortId: new Set<string>(),
  leafDrivenByPortIdPathKey: new Set<string>(),
  legacyLeafOverrideOnWhole: new Set<string>(),
  vec2DisplayByPortId: new Map<string, { x: number; y: number }>(),
}

const DEV = import.meta.env.DEV
const DEV_PROBE_NODE_ID_KEY = '__SP_PROBE_NODE_ID'
type DevProbeWindow = Window & { [DEV_PROBE_NODE_ID_KEY]?: string }

export function SpaghettiCanvas() {
  const graph = useSpaghettiStore((state) => state.graph)
  const selectedNodeId = useSpaghettiStore((state) => state.selectedNodeId)
  const selectedEdgeId = useSpaghettiStore((state) => state.selectedEdgeId)
  const hoveredEdgeId = useSpaghettiStore((state) => state.hoveredEdgeId)
  const connectionDrag = useSpaghettiStore((state) => state.connectionDrag)
  const uiMessage = useSpaghettiStore((state) => state.uiMessage)
  const edgeWaypoints = useSpaghettiStore((state) => state.edgeWaypoints)
  const ensureNodePositions = useSpaghettiStore((state) => state.ensureNodePositions)
  const applyGraphPatch = useSpaghettiStore((state) => state.applyGraphPatch)
  const setManyNodePos = useSpaghettiStore((state) => state.setManyNodePos)
  const addEdge = useSpaghettiStore((state) => state.addEdge)
  const removeEdge = useSpaghettiStore((state) => state.removeEdge)
  const insertEdgeWaypoint = useSpaghettiStore((state) => state.insertEdgeWaypoint)
  const setEdgeWaypointPos = useSpaghettiStore((state) => state.setEdgeWaypointPos)
  const removeEdgeWaypoint = useSpaghettiStore((state) => state.removeEdgeWaypoint)
  const toggleEdgeWaypointSide1 = useSpaghettiStore((state) => state.toggleEdgeWaypointSide1)
  const toggleEdgeWaypointSide2 = useSpaghettiStore((state) => state.toggleEdgeWaypointSide2)
  const setSelectedNodeId = useSpaghettiStore((state) => state.setSelectedNodeId)
  const setSelectedEdgeId = useSpaghettiStore((state) => state.setSelectedEdgeId)
  const setHoveredEdgeId = useSpaghettiStore((state) => state.setHoveredEdgeId)
  const setConnectionDrag = useSpaghettiStore((state) => state.setConnectionDrag)
  const clearConnectionDrag = useSpaghettiStore((state) => state.clearConnectionDrag)
  const setUiMessage = useSpaghettiStore((state) => state.setUiMessage)
  const clearUiMessage = useSpaghettiStore((state) => state.clearUiMessage)
  const setExtrudeDepth = useSpaghettiStore((state) => state.setExtrudeDepth)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const portElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const [portElementVersionByNodeId, setPortElementVersionByNodeId] = useState(
    () => new Map<string, number>(),
  )
  const [portAnchors, setPortAnchors] = useState<PortAnchorMap>({})
  const [hoverInputTarget, setHoverInputTarget] = useState<InputTarget | null>(null)
  const [hoverOutputTarget, setHoverOutputTarget] = useState<OutputTarget | null>(null)
  const [nodeAddMenu, setNodeAddMenu] = useState<{
    x: number
    y: number
    stageX: number
    stageY: number
    query: string
  } | null>(null)
  const [nodeRowModeMenu, setNodeRowModeMenu] = useState<{
    x: number
    y: number
  } | null>(null)
  const [wireCurviness, setWireCurviness] = useState(25)
  const [outputRowMinHeight, setOutputRowMinHeight] = useState(40)
  const [pinDotSize, setPinDotSize] = useState(8)
  const [rowViewMode, setRowViewMode] = useState<RowViewMode>('essentials')
  const [expandedComposites, setExpandedComposites] = useState(
    () => new Map<string, boolean>(),
  )
  const [compositeExpansionRevisionByNodeId, setCompositeExpansionRevisionByNodeId] =
    useState(() => new Map<string, number>())
  const [selectedWaypoint, setSelectedWaypoint] = useState<{
    edgeId: string
    waypointId: string
  } | null>(null)
  const [view, setView] = useState<CanvasViewState>({
    panX: 16,
    panY: 16,
    zoom: 1,
  })

  const dragStateRef = useRef<{
    nodeId: string
    startPointerX: number
    startPointerY: number
    startNodeX: number
    startNodeY: number
  } | null>(null)
  const queuedNodePosRef = useRef<Record<string, { x: number; y: number }>>({})
  const dragRafRef = useRef<number | null>(null)
  const connectionDragRef = useRef<ConnectionDragState | null>(connectionDrag)
  const hoverInputTargetRef = useRef<InputTarget | null>(hoverInputTarget)
  const hoverOutputTargetRef = useRef<OutputTarget | null>(hoverOutputTarget)
  const expandedCompositesRef = useRef(expandedComposites)
  const viewRef = useRef<CanvasViewState>(view)
  const nodeAddMenuRef = useRef<HTMLDivElement | null>(null)
  const nodeAddSearchRef = useRef<HTMLInputElement | null>(null)
  const canvasRenderCountRef = useRef(0)
  const probeNodeIdRef = useRef<string | null>(null)
  const pendingPortAnchorDirtyNodeIdsRef = useRef<Set<string>>(new Set())
  const portAnchorDirtyBumpRafRef = useRef<number | null>(null)
  const previousPortElementVersionByNodeIdRef = useRef(new Map<string, number>())
  const lastUiActionRef = useRef<string | null>(null)
  const evaluationRunCountRef = useRef(0)

  if (DEV) {
    canvasRenderCountRef.current += 1
    console.log('[perf] SpaghettiCanvas render', canvasRenderCountRef.current)
  }

  useEffect(() => {
    connectionDragRef.current = connectionDrag
  }, [connectionDrag])

  useEffect(() => {
    hoverInputTargetRef.current = hoverInputTarget
  }, [hoverInputTarget])

  useEffect(() => {
    hoverOutputTargetRef.current = hoverOutputTarget
  }, [hoverOutputTarget])

  useEffect(() => {
    expandedCompositesRef.current = expandedComposites
  }, [expandedComposites])

  useEffect(() => {
    viewRef.current = view
  }, [view])

  useEffect(() => {
    ensureNodePositions()
  }, [ensureNodePositions])

  useEffect(() => {
    if (selectedWaypoint === null) {
      return
    }
    const waypoints = edgeWaypoints[selectedWaypoint.edgeId] ?? []
    const exists = waypoints.some((waypoint) => waypoint.waypointId === selectedWaypoint.waypointId)
    if (!exists) {
      setSelectedWaypoint(null)
    }
  }, [edgeWaypoints, selectedWaypoint])

  const bumpCompositeExpansionRevision = useCallback((nodeId: string) => {
    setCompositeExpansionRevisionByNodeId((prev) => {
      const next = new Map(prev)
      next.set(nodeId, (next.get(nodeId) ?? 0) + 1)
      return next
    })
  }, [])

  const queuePortAnchorDirtyNode = useCallback((nodeId: string) => {
    pendingPortAnchorDirtyNodeIdsRef.current.add(nodeId)
    if (portAnchorDirtyBumpRafRef.current !== null) {
      return
    }
    portAnchorDirtyBumpRafRef.current = window.requestAnimationFrame(() => {
      portAnchorDirtyBumpRafRef.current = null
      const dirtyNodeIds = pendingPortAnchorDirtyNodeIdsRef.current
      if (dirtyNodeIds.size === 0) {
        return
      }
      setPortElementVersionByNodeId((prev) => {
        const next = new Map(prev)
        for (const dirtyNodeId of dirtyNodeIds) {
          next.set(dirtyNodeId, (next.get(dirtyNodeId) ?? 0) + 1)
        }
        return next
      })
      pendingPortAnchorDirtyNodeIdsRef.current = new Set<string>()
    })
  }, [])

  const getCompositeExpanded = useCallback(
    (
      direction: CompositeExpansionDirection,
      nodeId: string,
      portId: string,
    ): boolean => {
      const key = buildCompositeExpansionKey(direction, nodeId, portId)
      return expandedCompositesRef.current.get(key) === true
    },
    [],
  )

  const setCompositeExpanded = useCallback(
    (
      direction: CompositeExpansionDirection,
      nodeId: string,
      portId: string,
      expanded: boolean,
    ) => {
      const key = buildCompositeExpansionKey(direction, nodeId, portId)
      const current = expandedCompositesRef.current.get(key) === true
      if (current === expanded) {
        return
      }
      const t0 = DEV ? performance.now() : 0
      const actionLabel = DEV
        ? `expand:${nodeId}:${direction}:${portId}:${expanded ? 'on' : 'off'}`
        : null
      if (DEV) {
        lastUiActionRef.current = actionLabel
      }
      setExpandedComposites((prev) => {
        const next = new Map(prev)
        if (expanded) {
          next.set(key, true)
        } else {
          next.delete(key)
        }
        return next
      })
      bumpCompositeExpansionRevision(nodeId)
      queuePortAnchorDirtyNode(nodeId)
      if (DEV) {
        window.requestAnimationFrame(() => {
          console.log('[perf] expand->paint ms', performance.now() - t0, 'node', nodeId)
          if (actionLabel !== null && lastUiActionRef.current === actionLabel) {
            lastUiActionRef.current = null
          }
        })
      }
    },
    [bumpCompositeExpansionRevision, queuePortAnchorDirtyNode],
  )

  const availableNodeTypes = useMemo(
    () =>
      [...listNodeTypes()].sort(
        (a, b) => a.label.localeCompare(b.label) || a.type.localeCompare(b.type),
      ),
    [],
  )
  const filteredNodeTypes = useMemo(() => {
    const query = nodeAddMenu?.query.trim().toLowerCase() ?? ''
    if (query.length === 0) {
      return availableNodeTypes
    }
    return availableNodeTypes.filter((nodeDef) =>
      `${nodeDef.label} ${nodeDef.type}`.toLowerCase().includes(query),
    )
  }, [availableNodeTypes, nodeAddMenu?.query])

  const sortedNodes = useMemo(() => [...graph.nodes].sort(compareNodes), [graph.nodes])
  const sortedEdges = useMemo(() => [...graph.edges].sort(compareEdges), [graph.edges])
  useEffect(() => {
    if (!DEV || probeNodeIdRef.current !== null) {
      return
    }
    const nextProbeNodeId = selectedNodeId ?? sortedNodes[0]?.nodeId ?? null
    if (nextProbeNodeId === null) {
      return
    }
    probeNodeIdRef.current = nextProbeNodeId
    ;(window as DevProbeWindow)[DEV_PROBE_NODE_ID_KEY] = nextProbeNodeId
    console.log('[perf] probeNodeId', nextProbeNodeId)
  }, [selectedNodeId, sortedNodes])

  useEffect(
    () => () => {
      if (!DEV) {
        return
      }
      delete (window as DevProbeWindow)[DEV_PROBE_NODE_ID_KEY]
    },
    [],
  )

  const evaluation = useMemo(() => {
    const t0 = DEV ? performance.now() : 0
    const nextEvaluation = evaluateSpaghettiGraph(graph)
    if (DEV) {
      const elapsedMs = performance.now() - t0
      evaluationRunCountRef.current += 1
      console.log(
        '[perf] evaluateSpaghettiGraph ms',
        elapsedMs,
        'run',
        evaluationRunCountRef.current,
        'nodes',
        graph.nodes.length,
        'edges',
        graph.edges.length,
        'lastUiAction',
        lastUiActionRef.current ?? 'none',
      )
      if (lastUiActionRef.current?.startsWith('expand:')) {
        console.warn(
          '[perf] evaluateSpaghettiGraph ran after expand toggle; UI-only expand should not trigger eval.',
        )
      }
      lastUiActionRef.current = null
    }
    return nextEvaluation
  }, [graph])
  const nodePos = graph.ui?.nodes ?? {}
  const nodeRenderDataById = useMemo(() => {
    const t0 = DEV ? performance.now() : 0
    const byNodeId = new Map<string, NodeRenderData>()

    for (const node of sortedNodes) {
      const nodeDef = getNodeDef(node.type)
      const nodeInputs = nodeDef?.inputs ?? []
      const nodeOutputs = nodeDef?.outputs ?? []

      const incoming = sortedEdges.filter((edge) => edge.to.nodeId === node.nodeId)
      const inputConnectionCountByPortId = new Map<string, number>()
      for (const edge of incoming) {
        inputConnectionCountByPortId.set(
          edge.to.portId,
          (inputConnectionCountByPortId.get(edge.to.portId) ?? 0) + 1,
        )
      }
      const wholeDrivenByPortId = new Set<string>()
      const leafDrivenByPortIdPathKey = new Set<string>()
      const firstWholeIncomingByPortId = new Map<string, SpaghettiGraph['edges'][number]>()
      const hasLeafByPortId = new Set<string>()
      const hasWholeByPortId = new Set<string>()

      for (const edge of incoming) {
        const normalizedToPath =
          edge.to.path === undefined || edge.to.path.length === 0 ? undefined : edge.to.path
        if (normalizedToPath === undefined) {
          wholeDrivenByPortId.add(edge.to.portId)
          hasWholeByPortId.add(edge.to.portId)
          if (!firstWholeIncomingByPortId.has(edge.to.portId)) {
            firstWholeIncomingByPortId.set(edge.to.portId, edge)
          }
          continue
        }
        leafDrivenByPortIdPathKey.add(leafPortPathKey(edge.to.portId, normalizedToPath))
        hasLeafByPortId.add(edge.to.portId)
      }

      const legacyLeafOverrideOnWhole = new Set<string>()
      for (const portId of hasWholeByPortId) {
        if (hasLeafByPortId.has(portId)) {
          legacyLeafOverrideOnWhole.add(portId)
        }
      }

      const vec2DisplayByPortId = new Map<string, { x: number; y: number }>()
      for (const port of nodeInputs) {
        if (port.type.kind !== 'vec2') {
          continue
        }

        const raw = node.params[port.portId]
        const literalVec = isVec2Like(raw) ? raw : { x: 0, y: 0 }

        if (!wholeDrivenByPortId.has(port.portId)) {
          vec2DisplayByPortId.set(port.portId, literalVec)
          continue
        }

        const wholeEdge = firstWholeIncomingByPortId.get(port.portId)
        if (wholeEdge === undefined) {
          vec2DisplayByPortId.set(port.portId, literalVec)
          continue
        }

        const sourceOutput =
          evaluation.outputsByNodeId[wholeEdge.from.nodeId]?.[wholeEdge.from.portId]
        const sourceValue = getValueAtPath(sourceOutput, wholeEdge.from.path)
        vec2DisplayByPortId.set(port.portId, isVec2Like(sourceValue) ? sourceValue : literalVec)
      }

      const inputPortDetails: Record<string, PortDetailLine[]> = Object.fromEntries(
        nodeInputs.map((port) => {
          const incomingForPort = incoming.filter((edge) => edge.to.portId === port.portId)
          const lines: PortDetailLine[] = [
            { text: `type: ${describePortType(port.type)}`, kind: port.type.kind },
            { text: `optional: ${port.optional === true ? 'yes' : 'no'}` },
            { text: `connections in: ${incomingForPort.length}/${port.maxConnectionsIn ?? 1}` },
          ]
          for (const edge of incomingForPort) {
            lines.push({
              text: `from: ${edge.from.nodeId}.${edge.from.portId}${
                edge.from.path === undefined ? '' : `.${endpointPathKey(edge.from.path)}`
              }`,
            })
          }
          return [port.portId, lines]
        }),
      )

      const outgoing = sortedEdges.filter((edge) => edge.from.nodeId === node.nodeId)
      const outputPortDetails: Record<string, PortDetailLine[]> = Object.fromEntries(
        nodeOutputs.map((port) => {
          const outgoingForPort = outgoing.filter((edge) => edge.from.portId === port.portId)
          const lines: PortDetailLine[] = [
            { text: `type: ${describePortType(port.type)}`, kind: port.type.kind },
            { text: `connections out: ${outgoingForPort.length}` },
          ]

          const resolvedValue = evaluation.outputsByNodeId[node.nodeId]?.[port.portId]
          if (port.type.kind === 'spline2' && isSpline2Like(resolvedValue)) {
            const points = resolvedValue.points.slice(0, 5)
            points.forEach((point, index) => {
              lines.push({
                text: `vec2[${index + 1}]: (${formatNumber(point.x)}, ${formatNumber(point.y)})`,
                kind: 'vec2',
              })
            })
            lines.push({
              text: `closed: ${resolvedValue.closed ? 'true' : 'false'}`,
              kind: 'boolean',
            })
          }

          for (const edge of outgoingForPort) {
            lines.push({
              text: `to: ${edge.to.nodeId}.${edge.to.portId}${
                edge.to.path === undefined ? '' : `.${endpointPathKey(edge.to.path)}`
              }`,
            })
          }

          return [port.portId, lines]
        }),
      )

      byNodeId.set(node.nodeId, {
        inputPortDetails,
        outputPortDetails,
        inputCompositeState: {
          wholeDrivenByPortId,
          leafDrivenByPortIdPathKey,
          legacyLeafOverrideOnWhole,
          vec2DisplayByPortId,
        },
        primitiveNumberValue:
          node.type === 'Primitive/Number' && typeof node.params.value === 'number'
            ? node.params.value
            : 0,
        driverVm: buildNodeDriverVm(node, nodeDef, {
          resolvedInputsByPortId: evaluation.inputsByNodeId[node.nodeId],
          connectionCountByPortId: inputConnectionCountByPortId,
        }),
      })
    }

    if (DEV) {
      console.log(
        '[perf] buildNodeRenderData ms',
        performance.now() - t0,
        'nodes',
        sortedNodes.length,
      )
    }
    return byNodeId
  }, [evaluation.inputsByNodeId, evaluation.outputsByNodeId, sortedEdges, sortedNodes])

  const stageSize = useMemo(() => {
    const t0 = DEV ? performance.now() : 0
    let maxX = 0
    let maxY = 0
    for (const node of sortedNodes) {
      const pos = nodePos[node.nodeId]
      if (pos === undefined) {
        continue
      }
      maxX = Math.max(maxX, pos.x)
      maxY = Math.max(maxY, pos.y)
    }
    for (const waypoints of Object.values(edgeWaypoints)) {
      for (const waypoint of waypoints) {
        maxX = Math.max(maxX, waypoint.x)
        maxY = Math.max(maxY, waypoint.y)
      }
    }
    if (connectionDrag !== null) {
      maxX = Math.max(maxX, connectionDrag.pointerX)
      maxY = Math.max(maxY, connectionDrag.pointerY)
    }
    const nextStageSize = {
      width: Math.max(1200, Math.round(maxX + 440)),
      height: Math.max(720, Math.round(maxY + 320)),
    }
    if (DEV) {
      console.log('[perf] buildStageSize ms', performance.now() - t0, 'nodes', sortedNodes.length)
    }
    return nextStageSize
  }, [connectionDrag, edgeWaypoints, nodePos, sortedNodes])

  const flushQueuedNodePos = useCallback(() => {
    const entries = Object.entries(queuedNodePosRef.current)
    queuedNodePosRef.current = {}
    dragRafRef.current = null
    if (entries.length === 0) {
      return
    }
    setManyNodePos(
      entries.map(([nodeId, pos]) => ({
        nodeId,
        x: pos.x,
        y: pos.y,
      })),
    )
  }, [setManyNodePos])

  const queueNodePos = useCallback(
    (nodeId: string, x: number, y: number) => {
      queuedNodePosRef.current[nodeId] = { x, y }
      if (dragRafRef.current !== null) {
        return
      }
      dragRafRef.current = window.requestAnimationFrame(flushQueuedNodePos)
    },
    [flushQueuedNodePos],
  )

  useEffect(
    () => () => {
      if (dragRafRef.current !== null) {
        window.cancelAnimationFrame(dragRafRef.current)
      }
      if (portAnchorDirtyBumpRafRef.current !== null) {
        window.cancelAnimationFrame(portAnchorDirtyBumpRafRef.current)
      }
    },
    [],
  )

  const measureAllPortAnchors = useCallback(() => {
    const stageElement = stageRef.current
    if (stageElement === null) {
      return
    }
    const stageRect = stageElement.getBoundingClientRect()
    const nextAnchors: PortAnchorMap = {}
    const staleKeys: string[] = []
    for (const [key, element] of portElementsRef.current.entries()) {
      if (!element.isConnected) {
        staleKeys.push(key)
        continue
      }
      const rect = element.getBoundingClientRect()
      const parsedKey = parsePortAnchorKey(key)
      if (parsedKey === null) {
        continue
      }
      nextAnchors[key] = {
        key: key as keyof PortAnchorMap & string,
        nodeId: parsedKey.nodeId,
        direction: parsedKey.direction as PortDirection,
        portId: parsedKey.portId,
        path: parsedKey.path,
        x: (rect.left - stageRect.left + rect.width / 2) / viewRef.current.zoom,
        y: (rect.top - stageRect.top + rect.height / 2) / viewRef.current.zoom,
      }
    }
    for (const key of staleKeys) {
      portElementsRef.current.delete(key)
    }
    setPortAnchors((current) => (areAnchorsEqual(current, nextAnchors) ? current : nextAnchors))
  }, [])

  const measurePortAnchorsForNodeIds = useCallback((nodeIds: ReadonlySet<string>) => {
    if (nodeIds.size === 0) {
      return
    }
    const stageElement = stageRef.current
    if (stageElement === null) {
      return
    }
    const stageRect = stageElement.getBoundingClientRect()
    const nextForDirtyNodes: PortAnchorMap = {}
    const staleKeys: string[] = []

    for (const [key, element] of portElementsRef.current.entries()) {
      const parsedKey = parsePortAnchorKey(key)
      if (parsedKey === null || !nodeIds.has(parsedKey.nodeId)) {
        continue
      }
      if (!element.isConnected) {
        staleKeys.push(key)
        continue
      }
      const rect = element.getBoundingClientRect()
      nextForDirtyNodes[key] = {
        key: key as keyof PortAnchorMap & string,
        nodeId: parsedKey.nodeId,
        direction: parsedKey.direction as PortDirection,
        portId: parsedKey.portId,
        path: parsedKey.path,
        x: (rect.left - stageRect.left + rect.width / 2) / viewRef.current.zoom,
        y: (rect.top - stageRect.top + rect.height / 2) / viewRef.current.zoom,
      }
    }

    for (const key of staleKeys) {
      portElementsRef.current.delete(key)
    }

    setPortAnchors((current) => {
      const next: PortAnchorMap = {}
      for (const [key, anchor] of Object.entries(current)) {
        if (!nodeIds.has(anchor.nodeId)) {
          next[key] = anchor
        }
      }
      for (const [key, anchor] of Object.entries(nextForDirtyNodes)) {
        next[key] = anchor
      }
      return areAnchorsEqual(current, next) ? current : next
    })
  }, [])

  useLayoutEffect(() => {
    measureAllPortAnchors()
  }, [measureAllPortAnchors, nodePos, sortedNodes, view])

  useLayoutEffect(() => {
    if (portElementVersionByNodeId.size === 0) {
      return
    }
    const dirtyNodeIds = new Set<string>()
    for (const [nodeId, version] of portElementVersionByNodeId.entries()) {
      const previousVersion = previousPortElementVersionByNodeIdRef.current.get(nodeId) ?? 0
      if (version !== previousVersion) {
        dirtyNodeIds.add(nodeId)
      }
    }
    previousPortElementVersionByNodeIdRef.current = new Map(portElementVersionByNodeId)
    measurePortAnchorsForNodeIds(dirtyNodeIds)
  }, [measurePortAnchorsForNodeIds, portElementVersionByNodeId])

  useEffect(() => {
    const handleResize = () => {
      measureAllPortAnchors()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [measureAllPortAnchors])

  useEffect(() => {
    if (nodeAddMenu === null) {
      return
    }
    const handleWindowPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }
      if (nodeAddMenuRef.current?.contains(target)) {
        return
      }
      setNodeAddMenu(null)
    }
    window.addEventListener('pointerdown', handleWindowPointerDown)
    return () => {
      window.removeEventListener('pointerdown', handleWindowPointerDown)
    }
  }, [nodeAddMenu])

  useEffect(() => {
    if (nodeAddMenu === null) {
      return
    }
    const raf = window.requestAnimationFrame(() => {
      nodeAddSearchRef.current?.focus()
      nodeAddSearchRef.current?.select()
    })
    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [nodeAddMenu])

  const handleRegisterPortElement = useCallback(
    (
      nodeId: string,
      direction: PortDirection,
      portId: string,
      path: string[] | undefined,
      element: HTMLElement | null,
    ) => {
      const key = buildPortAnchorKey(nodeId, direction, portId, path)
      if (element === null) {
        // React callback refs receive `null` on each rebind; ignoring null prevents
        // a detach/attach state churn loop when nodes/ports are rendered.
        return
      }
      const existing = portElementsRef.current.get(key)
      if (existing === element) {
        return
      }
      portElementsRef.current.set(key, element)
      queuePortAnchorDirtyNode(nodeId)
    },
    [queuePortAnchorDirtyNode],
  )

  const handleNodePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, nodeId: string) => {
      if (event.button !== 0) {
        return
      }
      if (isInteractiveTarget(event.target)) {
        return
      }
      if (!isTopDragHandle(event.target)) {
        return
      }
      const node = graph.nodes.find((candidate) => candidate.nodeId === nodeId)
      if (node === undefined) {
        return
      }
      const pos = nodePos[nodeId]
      if (pos === undefined) {
        return
      }
      if (rowViewMode === 'collapsed') {
        const nodeDef = getNodeDef(node.type)
        const isInputNode =
          nodeDef !== undefined && nodeDef.inputs.length === 0 && nodeDef.outputs.length > 0
        if (isInputNode) {
          window.requestAnimationFrame(() => {
            setRowViewMode('essentials')
          })
        }
      }

      setSelectedNodeId(nodeId)
      setSelectedEdgeId(null)
      setSelectedWaypoint(null)
      clearUiMessage()

      dragStateRef.current = {
        nodeId,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startNodeX: pos.x,
        startNodeY: pos.y,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const dragState = dragStateRef.current
        if (dragState === null) {
          return
        }
        const zoom = viewRef.current.zoom
        const nextX = dragState.startNodeX + (moveEvent.clientX - dragState.startPointerX) / zoom
        const nextY = dragState.startNodeY + (moveEvent.clientY - dragState.startPointerY) / zoom
        queueNodePos(dragState.nodeId, nextX, nextY)
      }

      const handleUp = () => {
        dragStateRef.current = null
        flushQueuedNodePos()
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.stopPropagation()
      event.preventDefault()
    },
    [
      clearUiMessage,
      flushQueuedNodePos,
      graph.nodes,
      nodePos,
      queueNodePos,
      rowViewMode,
      setSelectedEdgeId,
      setSelectedNodeId,
      setRowViewMode,
      setSelectedWaypoint,
    ],
  )

  const connectionDragAnchor = useMemo((): ConnectionDragAnchor | null => {
    if (connectionDrag === null) {
      return null
    }
    return {
      direction: connectionDrag.anchorDirection,
      nodeId: connectionDrag.anchorNodeId,
      portId: connectionDrag.anchorPortId,
      path: normalizePath(connectionDrag.anchorPath),
    }
  }, [
    connectionDrag?.anchorDirection,
    connectionDrag?.anchorNodeId,
    connectionDrag?.anchorPortId,
    endpointPathKey(connectionDrag?.anchorPath),
  ])

  const hoverValidation = useMemo(() => {
    if (connectionDragAnchor === null) {
      return null
    }
    if (connectionDragAnchor.direction === 'out') {
      if (hoverInputTarget === null) {
        return null
      }
      return validateConnectionCheap(graph, {
        from: {
          nodeId: connectionDragAnchor.nodeId,
          portId: connectionDragAnchor.portId,
          path: connectionDragAnchor.path,
        },
        to: hoverInputTarget,
      })
    }
    if (hoverOutputTarget === null) {
      return null
    }
    return validateConnectionCheap(graph, {
      from: hoverOutputTarget,
      to: {
        nodeId: connectionDragAnchor.nodeId,
        portId: connectionDragAnchor.portId,
        path: connectionDragAnchor.path,
      },
    })
  }, [connectionDragAnchor, graph, hoverInputTarget, hoverOutputTarget])

  const edgeColorById = useMemo(() => {
    const next: Record<string, string> = {}
    for (const edge of graph.edges) {
      const sourceKind = resolveEndpointKind(graph, edge.from, 'out')
      next[edge.edgeId] = sourceKind === null ? getTypeColor('number') : getTypeColor(sourceKind)
    }
    return next
  }, [graph])

  const previewColor = useMemo(() => {
    if (connectionDragAnchor === null) {
      return null
    }
    if (connectionDragAnchor.direction === 'out') {
      const sourceKind = resolveEndpointKind(
        graph,
        {
          nodeId: connectionDragAnchor.nodeId,
          portId: connectionDragAnchor.portId,
          path: connectionDragAnchor.path,
        },
        'out',
      )
      return sourceKind === null ? null : getTypeColor(sourceKind)
    }
    if (hoverOutputTarget === null) {
      return null
    }
    const sourceKind = resolveEndpointKind(graph, hoverOutputTarget, 'out')
    return sourceKind === null ? null : getTypeColor(sourceKind)
  }, [connectionDragAnchor, graph, hoverOutputTarget])

  const getInputDropState = useCallback(
    (payload: EndpointPayload): 'compatible' | 'incompatible' | null => {
      if (
        hoverInputTarget === null ||
        connectionDragAnchor === null ||
        connectionDragAnchor.direction !== 'out'
      ) {
        return null
      }
      if (
        hoverInputTarget.nodeId !== payload.nodeId ||
        hoverInputTarget.portId !== payload.portId ||
        !pathsEqual(hoverInputTarget.path, payload.path)
      ) {
        return null
      }
      if (hoverValidation === null) {
        return null
      }
      return hoverValidation.ok ? 'compatible' : 'incompatible'
    },
    [connectionDragAnchor, hoverInputTarget, hoverValidation],
  )

  const getOutputDropState = useCallback(
    (payload: EndpointPayload): 'compatible' | 'incompatible' | null => {
      if (
        hoverOutputTarget === null ||
        connectionDragAnchor === null ||
        connectionDragAnchor.direction !== 'in'
      ) {
        return null
      }
      if (
        hoverOutputTarget.nodeId !== payload.nodeId ||
        hoverOutputTarget.portId !== payload.portId ||
        !pathsEqual(hoverOutputTarget.path, payload.path)
      ) {
        return null
      }
      if (hoverValidation === null) {
        return null
      }
      return hoverValidation.ok ? 'compatible' : 'incompatible'
    },
    [connectionDragAnchor, hoverOutputTarget, hoverValidation],
  )

  const beginConnectionDrag = useCallback(
    (
      nativeEvent: PointerEvent,
      payload: EndpointPayload,
      graphSnapshot: SpaghettiGraph,
      anchorDirection: PortDirection,
      options?: { preserveMessage?: boolean; startMessage?: string },
    ) => {
      const stageElement = stageRef.current
      if (stageElement === null) {
        return
      }
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      const point = toStagePoint(nativeEvent, viewportElement, viewRef.current)
      const nextDragState: ConnectionDragState = {
        anchorDirection,
        anchorNodeId: payload.nodeId,
        anchorPortId: payload.portId,
        anchorPath: normalizePath(payload.path),
        pointerX: point.x,
        pointerY: point.y,
      }
      setSelectedNodeId(payload.nodeId)
      setSelectedEdgeId(null)
      setSelectedWaypoint(null)
      if (options?.preserveMessage !== true) {
        clearUiMessage()
      }
      if (options?.startMessage !== undefined) {
        setUiMessage({
          level: 'info',
          text: options.startMessage,
        })
      }
      hoverInputTargetRef.current = null
      hoverOutputTargetRef.current = null
      setHoverInputTarget(null)
      setHoverOutputTarget(null)
      connectionDragRef.current = nextDragState
      setConnectionDrag(nextDragState)

      const handleMove = (moveEvent: PointerEvent) => {
        const viewport = viewportRef.current
        const activeDrag = connectionDragRef.current
        if (viewport === null || activeDrag === null) {
          return
        }
        const nextPoint = toStagePoint(moveEvent, viewport, viewRef.current)
        const nextDrag = {
          ...activeDrag,
          pointerX: nextPoint.x,
          pointerY: nextPoint.y,
        }
        connectionDragRef.current = nextDrag
        setConnectionDrag(nextDrag)
      }

      const handleUp = () => {
        const activeDrag = connectionDragRef.current
        if (activeDrag !== null) {
          const sourceEndpoint =
            activeDrag.anchorDirection === 'out'
              ? {
                  nodeId: activeDrag.anchorNodeId,
                  portId: activeDrag.anchorPortId,
                  path: activeDrag.anchorPath,
                }
              : hoverOutputTargetRef.current
          const targetEndpoint =
            activeDrag.anchorDirection === 'out'
              ? hoverInputTargetRef.current
              : {
                  nodeId: activeDrag.anchorNodeId,
                  portId: activeDrag.anchorPortId,
                  path: activeDrag.anchorPath,
                }

          if (sourceEndpoint === null || targetEndpoint === null) {
            connectionDragRef.current = null
            clearConnectionDrag()
            hoverInputTargetRef.current = null
            hoverOutputTargetRef.current = null
            setHoverInputTarget(null)
            setHoverOutputTarget(null)
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerup', handleUp)
            return
          }

          const cheap = validateConnectionCheap(graphSnapshot, {
            from: sourceEndpoint,
            to: targetEndpoint,
          })
          if (!cheap.ok) {
            setUiMessage({
              level: 'error',
              text: cheap.reason ?? 'Connection rejected.',
            })
          } else {
            const edgeId = generateUniqueEdgeId(graphSnapshot)
            const tentative = {
              ...graphSnapshot,
              edges: [
                ...graphSnapshot.edges,
                {
                  edgeId,
                  from: toEdgeEndpoint(sourceEndpoint),
                  to: toEdgeEndpoint(targetEndpoint),
                },
              ],
            }
            const cycleError = validateGraph(tentative).errors.some(
              (diagnostic) => diagnostic.code === 'GRAPH_CYCLE_DETECTED',
            )
            if (cycleError) {
              setUiMessage({
                level: 'error',
                text: 'Connection would introduce a cycle.',
              })
            } else {
              addEdge({
                edgeId,
                from: toEdgeEndpoint(sourceEndpoint),
                to: toEdgeEndpoint(targetEndpoint),
              })
              setSelectedEdgeId(edgeId)
              setUiMessage({
                level: 'info',
                text: 'Connection created.',
              })
            }
          }
        }

        connectionDragRef.current = null
        clearConnectionDrag()
        hoverInputTargetRef.current = null
        hoverOutputTargetRef.current = null
        setHoverInputTarget(null)
        setHoverOutputTarget(null)
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [
      addEdge,
      clearConnectionDrag,
      clearUiMessage,
      setConnectionDrag,
      setSelectedEdgeId,
      setSelectedNodeId,
      setSelectedWaypoint,
      setUiMessage,
    ],
  )

  const handleOutputPointerDown = useCallback(
    (
      event: ReactPointerEvent<HTMLElement>,
      payload: EndpointPayload,
    ) => {
      if (event.button !== 0) {
        return
      }
      beginConnectionDrag(event.nativeEvent, payload, graph, 'out')
      event.stopPropagation()
      event.preventDefault()
    },
    [beginConnectionDrag, graph],
  )

  const handleInputPointerDown = useCallback(
    (
      event: ReactPointerEvent<HTMLElement>,
      payload: EndpointPayload,
    ) => {
      if (event.button !== 0) {
        return
      }
      const incoming = [...sortedEdges]
        .filter(
          (edge) =>
            edge.to.nodeId === payload.nodeId &&
            edge.to.portId === payload.portId &&
            pathsEqual(edge.to.path, payload.path),
        )
      const existing = incoming[0]
      if (existing === undefined) {
        beginConnectionDrag(event.nativeEvent, payload, graph, 'in', {
          startMessage: 'Wire mode: choose an output source.',
        })
        event.stopPropagation()
        event.preventDefault()
        return
      }

      removeEdge(existing.edgeId)
      const detachedGraph: SpaghettiGraph = {
        ...graph,
        edges: sortedEdges.filter((edge) => edge.edgeId !== existing.edgeId),
      }
      beginConnectionDrag(
        event.nativeEvent,
        {
          nodeId: existing.from.nodeId,
          portId: existing.from.portId,
          path: existing.from.path,
        },
        detachedGraph,
        'out',
        {
          preserveMessage: true,
          startMessage: 'Rewire mode: choose a new input target.',
        },
      )
      event.stopPropagation()
      event.preventDefault()
    },
    [beginConnectionDrag, graph, removeEdge, sortedEdges],
  )

  const handleOutputPointerEnter = useCallback((target: OutputTarget) => {
    const activeDrag = connectionDragRef.current
    if (activeDrag === null || activeDrag.anchorDirection !== 'in') {
      return
    }
    hoverOutputTargetRef.current = target
    setHoverOutputTarget(target)
  }, [])

  const handleOutputPointerLeave = useCallback((target: OutputTarget) => {
    const current = hoverOutputTargetRef.current
    if (
      current !== null &&
      current.nodeId === target.nodeId &&
      current.portId === target.portId &&
      pathsEqual(current.path, target.path)
    ) {
      hoverOutputTargetRef.current = null
      setHoverOutputTarget(null)
    }
  }, [])

  const handleInputPointerEnter = useCallback((target: InputTarget) => {
    const activeDrag = connectionDragRef.current
    if (activeDrag === null || activeDrag.anchorDirection !== 'out') {
      return
    }
    hoverInputTargetRef.current = target
    setHoverInputTarget(target)
  }, [])

  const handleInputPointerLeave = useCallback((target: InputTarget) => {
    const current = hoverInputTargetRef.current
    if (
      current !== null &&
      current.nodeId === target.nodeId &&
      current.portId === target.portId &&
      pathsEqual(current.path, target.path)
    ) {
      hoverInputTargetRef.current = null
      setHoverInputTarget(null)
    }
  }, [])

  const handleDeleteSelectedEdge = useCallback(() => {
    if (selectedEdgeId === null) {
      return
    }
    removeEdge(selectedEdgeId)
    if (selectedWaypoint?.edgeId === selectedEdgeId) {
      setSelectedWaypoint(null)
    }
    setUiMessage({
      level: 'info',
      text: 'Edge deleted.',
    })
  }, [removeEdge, selectedEdgeId, selectedWaypoint, setUiMessage])

  const resolveWaypointInsertIndex = useCallback(
    (
      edgeId: string,
      point: { x: number; y: number },
    ): number => {
      const edge = graph.edges.find((candidate) => candidate.edgeId === edgeId)
      if (edge === undefined) {
        return 0
      }
      const from = portAnchors[
        buildPortAnchorKey(edge.from.nodeId, 'out', edge.from.portId, edge.from.path)
      ]
      const to = portAnchors[
        buildPortAnchorKey(edge.to.nodeId, 'in', edge.to.portId, edge.to.path)
      ]
      if (from === undefined || to === undefined) {
        return (edgeWaypoints[edgeId] ?? []).length
      }
      const waypoints = edgeWaypoints[edgeId] ?? []
      const chain: Array<{ x: number; y: number }> = [
        { x: from.x, y: from.y },
        ...waypoints.map((waypoint) => ({ x: waypoint.x, y: waypoint.y })),
        { x: to.x, y: to.y },
      ]
      let bestSegmentIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY
      for (let i = 0; i < chain.length - 1; i += 1) {
        const distance = distancePointToSegmentSq(point, chain[i], chain[i + 1])
        if (distance < bestDistance) {
          bestDistance = distance
          bestSegmentIndex = i
        }
      }
      return bestSegmentIndex
    },
    [edgeWaypoints, graph.edges, portAnchors],
  )

  const handleEdgeDoubleClick = useCallback(
    (edgeId: string, clientX: number, clientY: number) => {
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      const point = toStagePointFromClient(clientX, clientY, viewportElement, viewRef.current)
      const insertIndex = resolveWaypointInsertIndex(edgeId, point)
      insertEdgeWaypoint(edgeId, point.x, point.y, insertIndex)
      setSelectedNodeId(null)
      setSelectedEdgeId(edgeId)
      setSelectedWaypoint(null)
      setUiMessage({
        level: 'info',
        text: 'Reroute point added. Drag the point to arrange this wire.',
      })
    },
    [
      insertEdgeWaypoint,
      resolveWaypointInsertIndex,
      setSelectedEdgeId,
      setSelectedNodeId,
      setSelectedWaypoint,
      setUiMessage,
    ],
  )

  const handleWaypointPointerDown = useCallback(
    (edgeId: string, waypointId: string, clientX: number, clientY: number) => {
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      const start = toStagePointFromClient(clientX, clientY, viewportElement, viewRef.current)
      setEdgeWaypointPos(edgeId, waypointId, start.x, start.y)
      setSelectedNodeId(null)
      setSelectedEdgeId(edgeId)
      setSelectedWaypoint({ edgeId, waypointId })

      const handleMove = (moveEvent: PointerEvent) => {
        const viewport = viewportRef.current
        if (viewport === null) {
          return
        }
        const next = toStagePointFromClient(
          moveEvent.clientX,
          moveEvent.clientY,
          viewport,
          viewRef.current,
        )
        setEdgeWaypointPos(edgeId, waypointId, next.x, next.y)
      }

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [setEdgeWaypointPos, setSelectedEdgeId, setSelectedNodeId],
  )

  const handleWaypointDoubleClick = useCallback(
    (edgeId: string, waypointId: string) => {
      removeEdgeWaypoint(edgeId, waypointId)
      if (
        selectedWaypoint !== null &&
        selectedWaypoint.edgeId === edgeId &&
        selectedWaypoint.waypointId === waypointId
      ) {
        setSelectedWaypoint(null)
      }
      setUiMessage({
        level: 'info',
        text: 'Reroute point removed.',
      })
    },
    [removeEdgeWaypoint, selectedWaypoint, setUiMessage],
  )

  const handleFlipSelectedWaypointSide1 = useCallback(() => {
    if (selectedWaypoint === null) {
      return
    }
    toggleEdgeWaypointSide1(selectedWaypoint.edgeId, selectedWaypoint.waypointId)
    setUiMessage({
      level: 'info',
      text: 'Flipped tangent side 1 for selected reroute point.',
    })
  }, [selectedWaypoint, setUiMessage, toggleEdgeWaypointSide1])

  const handleFlipSelectedWaypointSide2 = useCallback(() => {
    if (selectedWaypoint === null) {
      return
    }
    toggleEdgeWaypointSide2(selectedWaypoint.edgeId, selectedWaypoint.waypointId)
    setUiMessage({
      level: 'info',
      text: 'Flipped tangent side 2 for selected reroute point.',
    })
  }, [selectedWaypoint, setUiMessage, toggleEdgeWaypointSide2])

  const handleAddNodeFromMenu = useCallback(
    (type: NodeTypeId) => {
      if (nodeAddMenu === null) {
        return
      }
      const nodeId = generateUniqueNodeId(graph)
      const x = Math.round(nodeAddMenu.stageX)
      const y = Math.round(nodeAddMenu.stageY)
      applyGraphPatch((prev) => ({
        ...prev,
        nodes: [
          ...prev.nodes,
          {
            nodeId,
            type,
            params: getDefaultNodeParams(type),
          },
        ],
        ui: {
          ...(prev.ui?.viewport === undefined ? {} : { viewport: prev.ui.viewport }),
          nodes: {
            ...(prev.ui?.nodes ?? {}),
            [nodeId]: { x, y },
          },
        },
      }))
      setSelectedNodeId(nodeId)
      setSelectedEdgeId(null)
      setUiMessage({
        level: 'info',
        text: `Added ${type}.`,
      })
      setNodeAddMenu(null)
    },
    [applyGraphPatch, graph, nodeAddMenu, setSelectedEdgeId, setSelectedNodeId, setUiMessage],
  )

  const handlePresetChange = useCallback(
    (nodeId: string, presetId: string) => {
      applyGraphPatch((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => {
          if (node.nodeId !== nodeId) {
            return node
          }
          return {
            ...node,
            params: {
              ...node.params,
              presetId,
            },
          }
        }),
      }))
    },
    [applyGraphPatch],
  )

  const handleDriverNumberChange = useCallback(
    (nodeId: string, change: DriverNumberChange, value: number) => {
      if (!Number.isFinite(value)) {
        return
      }

      if (change.kind === 'nodeParamVec2Axis') {
        applyGraphPatch((prev) => ({
          ...prev,
          nodes: prev.nodes.map((node) => {
            if (node.nodeId !== nodeId) {
              return node
            }
            const currentParam = node.params[change.paramId]
            const currentVec =
              typeof currentParam === 'object' &&
              currentParam !== null &&
              typeof (currentParam as { x?: unknown }).x === 'number' &&
              Number.isFinite((currentParam as { x: number }).x) &&
              typeof (currentParam as { y?: unknown }).y === 'number' &&
              Number.isFinite((currentParam as { y: number }).y)
                ? (currentParam as { x: number; y: number })
                : { x: 0, y: 0 }
            return {
              ...node,
              params: {
                ...node.params,
                [change.paramId]: {
                  ...currentVec,
                  [change.axis]: value,
                },
              },
            }
          }),
        }))
        return
      }

      if (change.kind === 'featureParam') {
        if (change.featureParamKind !== 'firstExtrudeDepth' || change.featureId === undefined) {
          return
        }
        setExtrudeDepth(nodeId, change.featureId, {
          kind: 'lit',
          value,
        })
        return
      }

      applyGraphPatch((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => {
          if (node.nodeId !== nodeId) {
            return node
          }

          const nextParams: Record<string, unknown> = {
            ...node.params,
            [change.paramId]: value,
          }

          const syncRect = change.syncRect
          if (syncRect !== undefined) {
            const widthValue =
              change.paramId === syncRect.widthParamId
                ? value
                : typeof nextParams[syncRect.widthParamId] === 'number' &&
                    Number.isFinite(nextParams[syncRect.widthParamId])
                  ? (nextParams[syncRect.widthParamId] as number)
                  : syncRect.widthFallback
            const lengthValue =
              change.paramId === syncRect.lengthParamId
                ? value
                : typeof nextParams[syncRect.lengthParamId] === 'number' &&
                    Number.isFinite(nextParams[syncRect.lengthParamId])
                  ? (nextParams[syncRect.lengthParamId] as number)
                  : syncRect.lengthFallback
            const points = buildBaseplateSketchPointParams(lengthValue, widthValue)
            syncRect.pointParamIds.forEach((paramId, index) => {
              const point = points[`anchorPoint${index + 1}` as keyof typeof points]
              nextParams[paramId] = point
            })
          }

          return {
            ...node,
            params: nextParams,
          }
        }),
      }))
    },
    [applyGraphPatch, setExtrudeDepth],
  )

  const handlePrimitiveNumberValueChange = useCallback(
    (nodeId: string, value: number) => {
      applyGraphPatch((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => {
          if (node.nodeId !== nodeId) {
            return node
          }
          return {
            ...node,
            params: {
              ...node.params,
              value,
            },
          }
        }),
      }))
    },
    [applyGraphPatch],
  )

  return (
    <div
      className={`SpaghettiCanvasRoot spView_root spView_mode-${rowViewMode}`}
      style={
        {
          '--sp-output-row-min-height': `${outputRowMinHeight}px`,
          '--sp-port-dot-size': `${pinDotSize}px`,
        } as CSSProperties
      }
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && nodeAddMenu !== null) {
          event.preventDefault()
          setNodeAddMenu(null)
          return
        }
        if (event.key === 'Escape' && nodeRowModeMenu !== null) {
          event.preventDefault()
          setNodeRowModeMenu(null)
          return
        }
        if ((event.key === 'Delete' || event.key === 'Backspace') && selectedEdgeId !== null) {
          event.preventDefault()
          handleDeleteSelectedEdge()
        }
      }}
    >
      <div className="SpaghettiCanvasToolbar">
        <button type="button" onClick={handleDeleteSelectedEdge} disabled={selectedEdgeId === null}>
          Delete Selected Edge
        </button>
        <button
          type="button"
          onClick={handleFlipSelectedWaypointSide1}
          disabled={selectedWaypoint === null}
        >
          Flip Tangent Side 1
        </button>
        <button
          type="button"
          onClick={handleFlipSelectedWaypointSide2}
          disabled={selectedWaypoint === null}
        >
          Flip Tangent Side 2
        </button>
        <label className="SpaghettiCanvasCurveControl">
          <span>Wire Curve: {wireCurviness}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={wireCurviness}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (Number.isFinite(next)) {
                setWireCurviness(Math.max(0, Math.min(100, Math.round(next))))
              }
            }}
          />
        </label>
        <label className="SpaghettiCanvasRowMode spView_modeControl">
          <span>Rows</span>
          <select
            value={rowViewMode}
            onChange={(event) => {
              const nextMode = event.target.value as RowViewMode
              if (
                nextMode === 'collapsed' ||
                nextMode === 'essentials' ||
                nextMode === 'everything'
              ) {
                setRowViewMode(nextMode)
              }
            }}
          >
            <option value="collapsed">Collapsed</option>
            <option value="essentials">Essentials</option>
            <option value="everything">Everything</option>
          </select>
        </label>
        {uiMessage !== null ? (
          <div
            className={`SpaghettiCanvasMessage ${
              uiMessage.level === 'error' ? 'SpaghettiCanvasMessage--error' : 'SpaghettiCanvasMessage--info'
            }`}
          >
            {uiMessage.text}
          </div>
        ) : null}
      </div>
      <div
        ref={viewportRef}
        className="SpaghettiCanvasScroller"
        onContextMenu={(event) => {
          event.preventDefault()
          event.stopPropagation()
          const target = event.target
          if (!(target instanceof Element)) {
            return
          }
          const viewportElement = viewportRef.current
          if (viewportElement === null) {
            return
          }
          const rect = viewportElement.getBoundingClientRect()
          const localX = event.clientX - rect.left
          const localY = event.clientY - rect.top
          if (target.closest('.SpaghettiNode') !== null) {
            setNodeAddMenu(null)
            setNodeRowModeMenu({
              x: clampNumber(localX, 8, Math.max(8, rect.width - 210)),
              y: clampNumber(localY, 8, Math.max(8, rect.height - 160)),
            })
            return
          }
          setNodeRowModeMenu(null)
          const stagePoint = toStagePointFromClient(
            event.clientX,
            event.clientY,
            viewportElement,
            viewRef.current,
          )
          setNodeAddMenu({
            x: clampNumber(localX, 8, Math.max(8, rect.width - 280)),
            y: clampNumber(localY, 8, Math.max(8, rect.height - 260)),
            stageX: stagePoint.x,
            stageY: stagePoint.y,
            query: '',
          })
        }}
        onWheel={(event) => {
          event.stopPropagation()
          event.preventDefault()
          const viewportElement = viewportRef.current
          if (viewportElement === null) {
            return
          }
          const zoomFactor = event.deltaY < 0 ? 1.08 : 0.92
          setView((current) => {
            const nextZoom = clampNumber(current.zoom * zoomFactor, 0.4, 2.6)
            const rect = viewportElement.getBoundingClientRect()
            const pointerX = event.clientX - rect.left
            const pointerY = event.clientY - rect.top
            const worldX = (pointerX - current.panX) / current.zoom
            const worldY = (pointerY - current.panY) / current.zoom
            return {
              zoom: nextZoom,
              panX: pointerX - worldX * nextZoom,
              panY: pointerY - worldY * nextZoom,
            }
          })
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return
          }
          const target = event.target
          if (!(target instanceof Element)) {
            return
          }
          // Only start panning from empty canvas background regions.
          if (
            target.closest('.SpaghettiNode') !== null ||
            target.closest('.SpaghettiPort') !== null ||
            target.closest('.SpaghettiWire') !== null ||
            target.closest('.SpaghettiWireWaypoint') !== null ||
            target.closest('.SpaghettiWireLoop') !== null ||
            target.closest('.SpaghettiWireGap') !== null
          ) {
            return
          }
          const startX = event.clientX
          const startY = event.clientY
          const startView = viewRef.current
          const handleMove = (moveEvent: PointerEvent) => {
            setView({
              ...viewRef.current,
              panX: startView.panX + (moveEvent.clientX - startX),
              panY: startView.panY + (moveEvent.clientY - startY),
            })
          }
          const handleUp = () => {
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerup', handleUp)
          }
          window.addEventListener('pointermove', handleMove)
          window.addEventListener('pointerup', handleUp)
          event.preventDefault()
        }}
      >
        {nodeAddMenu !== null ? (
          <div
            ref={nodeAddMenuRef}
            className="SpaghettiNodeAddMenu"
            style={{
              left: `${nodeAddMenu.x}px`,
              top: `${nodeAddMenu.y}px`,
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onContextMenu={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            <input
              ref={nodeAddSearchRef}
              className="SpaghettiNodeAddMenuSearch"
              placeholder="Search nodes..."
              value={nodeAddMenu.query}
              onChange={(event) => {
                const query = event.target.value
                setNodeAddMenu((current) =>
                  current === null
                    ? null
                    : {
                        ...current,
                        query,
                      },
                )
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  setNodeAddMenu(null)
                  return
                }
                if (event.key === 'Enter') {
                  event.preventDefault()
                  const first = filteredNodeTypes[0]
                  if (first !== undefined) {
                    handleAddNodeFromMenu(first.type)
                  }
                }
              }}
            />
            <div className="SpaghettiNodeAddMenuList">
              {filteredNodeTypes.map((nodeDef) => (
                <button
                  key={nodeDef.type}
                  type="button"
                  className="SpaghettiNodeAddMenuItem"
                  onClick={() => handleAddNodeFromMenu(nodeDef.type)}
                >
                  <span>{nodeDef.label}</span>
                  <span>{nodeDef.type}</span>
                </button>
              ))}
              {filteredNodeTypes.length === 0 ? (
                <div className="SpaghettiNodeAddMenuEmpty">No matching node types.</div>
              ) : null}
            </div>
          </div>
        ) : null}
        <SpaghettiContextMenu
          open={nodeRowModeMenu !== null}
          x={nodeRowModeMenu?.x ?? 0}
          y={nodeRowModeMenu?.y ?? 0}
          onClose={() => setNodeRowModeMenu(null)}
          items={[
            {
              id: 'node-mode-collapsed',
              label: 'collapsed',
              onSelect: () => {
                setRowViewMode('collapsed')
                setNodeRowModeMenu(null)
              },
            },
            {
              id: 'node-mode-essentials',
              label: 'essentials',
              onSelect: () => {
                setRowViewMode('essentials')
                setNodeRowModeMenu(null)
              },
            },
            {
              id: 'node-mode-expanded',
              label: 'expanded',
              onSelect: () => {
                setRowViewMode('everything')
                setNodeRowModeMenu(null)
              },
            },
          ]}
        />
        <div
          ref={stageRef}
          className={`SpaghettiCanvasStage spView_stage spView_mode-${rowViewMode}`}
          style={{
            width: `${stageSize.width}px`,
            height: `${stageSize.height}px`,
            transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`,
            transformOrigin: '0 0',
          }}
          onClickCapture={(event) => {
            if (event.button !== 0) {
              return
            }
            if (isSketchAnchorPointValueBarClickTarget(event.target)) {
              if (rowViewMode === 'essentials') {
                return
              }
              window.requestAnimationFrame(() => {
                setRowViewMode('essentials')
              })
            }
          }}
          onPointerDown={(event) => {
            if (isInteractiveTarget(event.target)) {
              return
            }
            setSelectedNodeId(null)
            setSelectedEdgeId(null)
            setSelectedWaypoint(null)
          }}
        >
          {sortedNodes.map((node, index) => {
            const pos = nodePos[node.nodeId] ?? {
              x: 40 + (index % 4) * 280,
              y: 40 + Math.floor(index / 4) * 200,
            }
            const nodeDef = getNodeDef(node.type)
            const renderData = nodeRenderDataById.get(node.nodeId)
            return (
              <NodeView
                key={node.nodeId}
                node={node}
                rowViewMode={rowViewMode}
                x={pos.x}
                y={pos.y}
                title={nodeDef?.label ?? node.type}
                template={nodeDef?.template}
                allInputs={nodeDef?.inputs ?? []}
                allOutputs={nodeDef?.outputs ?? []}
                uiSections={nodeDef?.uiSections}
                drivers={renderData?.driverVm?.drivers}
                inputs={renderData?.driverVm?.inputs}
                outputs={renderData?.driverVm?.outputs}
                otherOutputs={renderData?.driverVm?.otherOutputs}
                presetOptions={nodeDef?.presetOptions}
                inputPortDetails={renderData?.inputPortDetails}
                outputPortDetails={renderData?.outputPortDetails}
                inputCompositeState={
                  renderData?.inputCompositeState ?? EMPTY_NODE_INPUT_COMPOSITE_STATE
                }
                compositeExpansionRevision={
                  compositeExpansionRevisionByNodeId.get(node.nodeId) ?? 0
                }
                getCompositeExpanded={getCompositeExpanded}
                setCompositeExpanded={setCompositeExpanded}
                primitiveNumberValue={renderData?.primitiveNumberValue ?? 0}
                selected={selectedNodeId === node.nodeId}
                getInputDropState={getInputDropState}
                getOutputDropState={getOutputDropState}
                onPresetChange={handlePresetChange}
                onDriverNumberChange={handleDriverNumberChange}
                onNodePointerDown={handleNodePointerDown}
                onRegisterPortElement={handleRegisterPortElement}
                onOutputPointerDown={handleOutputPointerDown}
                onOutputPointerEnter={handleOutputPointerEnter}
                onOutputPointerLeave={handleOutputPointerLeave}
                onInputPointerDown={handleInputPointerDown}
                onInputPointerEnter={handleInputPointerEnter}
                onInputPointerLeave={handleInputPointerLeave}
                onPrimitiveNumberValueChange={handlePrimitiveNumberValueChange}
                outputRowMinHeight={outputRowMinHeight}
                onOutputRowMinHeightChange={setOutputRowMinHeight}
                pinDotSize={pinDotSize}
                onPinDotSizeChange={setPinDotSize}
              />
            )
          })}

          <WireLayer
            edges={graph.edges}
            edgeWaypoints={edgeWaypoints}
            edgeColorById={edgeColorById}
            portAnchors={portAnchors}
            wireCurviness={wireCurviness}
            width={stageSize.width}
            height={stageSize.height}
            selectedEdgeId={selectedEdgeId}
            hoveredEdgeId={hoveredEdgeId}
            selectedWaypoint={selectedWaypoint}
            previewFrom={
              connectionDrag === null
                ? null
                : {
                    nodeId: connectionDrag.anchorNodeId,
                    portId: connectionDrag.anchorPortId,
                    path: connectionDrag.anchorPath,
                    direction: connectionDrag.anchorDirection,
                  }
            }
            previewPointer={
              connectionDrag === null
                ? null
                : {
                    x: connectionDrag.pointerX,
                    y: connectionDrag.pointerY,
                  }
            }
            previewColor={previewColor}
            onEdgeHover={setHoveredEdgeId}
            onEdgeSelect={(edgeId) => {
              setSelectedNodeId(null)
              setSelectedEdgeId(edgeId)
              setSelectedWaypoint(null)
            }}
            onEdgeDoubleClick={handleEdgeDoubleClick}
            onWaypointPointerDown={handleWaypointPointerDown}
            onWaypointDoubleClick={handleWaypointDoubleClick}
          />
        </div>
      </div>
    </div>
  )
}
