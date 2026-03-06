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

export type OutputPreviewParams = {
  slots: OutputPreviewSlot[]
  nextSlotIndex: number
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

export type SpaghettiGraph = {
  schemaVersion: 1
  nodes: SpaghettiNode[]
  edges: SpaghettiEdge[]
  ui?: {
    nodes?: Record<string, GraphNodePos>
    viewport?: {
      x: number
      y: number
      zoom: number
    }
  }
}
