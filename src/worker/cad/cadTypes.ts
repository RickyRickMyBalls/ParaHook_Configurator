export type Point2 = {
  x: number
  y: number
}

export type Point3 = {
  x: number
  y: number
  z: number
}

export type Wire = {
  vertices: Point2[]
}

export type Face = {
  wire: Wire
}

export type MeshPack = {
  vertices: number[]
  indices: number[]
}

export type Shape3D = {
  kind: 'extrusion' | 'mesh_pack_merge'
  bodyId: string
  featureId: string
  op: string
  mesh: MeshPack
  partKey: string
}

export type RuntimeDiagnostic = {
  partKey: string
  featureId: string
  reason: string
  message: string
}

export type RuntimeTraceBody = {
  bodyKey: string
  bodyId: string
  partKey: string
  featureId: string
  op: string
  executionIndex: number
}
