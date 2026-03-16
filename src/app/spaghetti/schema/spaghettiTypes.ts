export type SpaghettiSchemaVersion = 1

export type PortKind =
  | 'number'
  | 'boolean'
  | 'vec2'
  | 'vec3'
  | 'spline2'
  | 'spline3'
  | 'profileLoop'
  | 'stations'
  | 'railMath'
  | 'toeLoft'

export type Unit = 'mm' | 'deg' | 'unitless'

export type PortType = {
  kind: PortKind
  unit?: Unit
}

export type PortSpec = {
  portId: string
  label: string
  type: PortType
  optional?: boolean
  maxConnectionsIn?: number
}

export type NodeUI = {
  x: number
  y: number
  collapsed?: boolean
  color?: string
  zIndex?: number
}

export type EdgeEndpoint = {
  nodeId: string
  portId: string
  path?: string[]
}

export type PartSlots = {
  drivers: true
  inputs: true
  featureStack: true
  outputs: true
}

export type OutputPreviewSlot = {
  slotId: string
}

export type OutputPreviewObject = {
  objectId: string
  label: string
  slotId: string
  orderIndex: number
}

export type OutputPreviewParams = {
  componentLabel: string
  objects: OutputPreviewObject[]
  slots: OutputPreviewSlot[]
  nextSlotIndex: number
}

export type GraphReceiveMode = 'link'

export type GraphReceiveReference = {
  receiveId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  mode: GraphReceiveMode
  receiveNodeId?: string
}

export type SpaghettiNode = {
  nodeId: string
  type: string
  params: Record<string, unknown>
  partSlots?: PartSlots
  ui?: NodeUI
}

export type SpaghettiEdge = {
  edgeId: string
  from: EdgeEndpoint
  to: EdgeEndpoint
}

export type GraphNodePos = {
  x: number
  y: number
}

export type NodeRowMode = 'collapsed' | 'essentials' | 'expanded'

export type SpaghettiGraph = {
  schemaVersion: 1
  nodes: SpaghettiNode[]
  edges: SpaghettiEdge[]
  receiveReferences?: GraphReceiveReference[]
  ui?: {
    nodes?: Record<string, GraphNodePos>
    nodeModesByNodeId?: Record<string, NodeRowMode>
    viewport?: {
      x: number
      y: number
      zoom: number
    }
  }
}

export type GraphDocumentVersion = 1

export type GraphDocument = {
  graphDocumentId: string
  name: string
  version: GraphDocumentVersion
  graph: SpaghettiGraph
}

export type EditorViewportWindowMode =
  | 'collapsed'
  | 'meatball editor view'
  | 'expanded'
  | 'maximized'
  | 'split view'
  | 'separateWindow'

export type EditorViewportPosition = {
  x: number
  y: number
}

export type EditorViewportSize = {
  width: number
  height: number
}

export type EditorViewportRestoreFromCollapsed = {
  windowMode: 'expanded' | 'maximized' | 'split view'
  position?: EditorViewportPosition
  size?: EditorViewportSize
  splitRatio?: number
}

export type EditorViewportRestoreFromSplit = {
  windowMode: 'expanded' | 'maximized'
  position?: EditorViewportPosition
  size?: EditorViewportSize
}

export type EditorViewport = {
  editorViewportId: string
  graphDocumentId: string
  isFocused: boolean
  windowMode: EditorViewportWindowMode
  position: EditorViewportPosition
  size: EditorViewportSize
  splitRatio: number
  restoreFromCollapsed: EditorViewportRestoreFromCollapsed | null
  restoreFromSplit: EditorViewportRestoreFromSplit | null
  zOrder: number
}
