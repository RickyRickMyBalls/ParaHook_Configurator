import type { NumberExpression, Vec2Expression } from './expressions'

export type FeatureStack = Feature[]

export type Feature = SketchFeature | CloseProfileFeature | ExtrudeFeature

export type SketchPlane = 'XY' | 'YZ' | 'XZ'

export type Line2Component = {
  rowId: string
  componentId: string
  type: 'line'
  a: Vec2Expression
  b: Vec2Expression
}

export type Bezier2Component = {
  rowId: string
  componentId: string
  type: 'spline'
  p0: Vec2Expression
  p1: Vec2Expression
  p2: Vec2Expression
  p3: Vec2Expression
}

export type Arc3pt2Component = {
  rowId: string
  componentId: string
  type: 'arc3pt'
  start: Vec2Expression
  mid: Vec2Expression
  end: Vec2Expression
}

export type SketchComponent = Line2Component | Bezier2Component | Arc3pt2Component

export type Segment2Line = {
  kind: 'line2'
  a: { x: number; y: number }
  b: { x: number; y: number }
}

export type Segment2Bezier = {
  kind: 'bezier2'
  p0: { x: number; y: number }
  p1: { x: number; y: number }
  p2: { x: number; y: number }
  p3: { x: number; y: number }
}

export type Segment2Arc3pt = {
  kind: 'arc3pt2'
  start: { x: number; y: number }
  mid: { x: number; y: number }
  end: { x: number; y: number }
}

export type Segment2 = Segment2Line | Segment2Bezier | Segment2Arc3pt

export type ProfileLoop = {
  segments: Segment2[]
  winding: 'CCW' | 'CW'
}

export type SketchDerivationDiagnosticCode =
  | 'SKETCH_PROFILE_NOT_CLOSED'
  | 'SKETCH_PROFILE_DEGENERATE'

export type SketchDerivationDiagnostic = {
  code: SketchDerivationDiagnosticCode
  message: string
}

export type SketchFeature = {
  type: 'sketch'
  featureId: string
  enabled?: boolean
  plane: SketchPlane
  components: SketchComponent[]
  outputs: {
    profiles: ProfileOutput[]
    diagnostics?: SketchDerivationDiagnostic[]
  }
  uiState: {
    collapsed: boolean
  }
  // Legacy read-only compatibility.
  entities?: SketchEntity[]
}

export type SketchEntity = LineEntity

export type LineEntity = {
  entityId: string
  type: 'line'
  start: Vec2Expression
  end: Vec2Expression
}

export type ProfileOutput = {
  profileId: string
  profileIndex: number
  area: number
  loop: ProfileLoop
  // Deterministic preview/runtime conversion proxy. Not authoritative geometry.
  verticesProxy: Array<{ x: number; y: number }>
  // Legacy compatibility for existing tests and old data.
  entityIds?: string[]
}

export type CloseProfileOutputRef = {
  sourceFeatureId: string
  profileId: string
  profileIndex: 0
}

export type CloseProfileFeature = {
  type: 'closeProfile'
  featureId: string
  enabled?: boolean
  inputs: {
    sourceSketchFeatureId: string | null
  }
  outputs: {
    profileRef: CloseProfileOutputRef | null
  }
  uiState: {
    collapsed: boolean
  }
}

export type ExtrudeFeature = {
  type: 'extrude'
  featureId: string
  enabled?: boolean
  inputs: {
    profileRef: ProfileReference | null
  }
  params: {
    depth: NumberExpression
    taper?: NumberExpression
    offset?: NumberExpression
  }
  outputs: {
    bodyId: string
  }
  uiState: {
    collapsed: boolean
  }
}

export type ProfileReference = {
  sourceFeatureId: string
  profileId: string
  profileIndex?: number
}

export const isPartNodeType = (nodeType: string): boolean => nodeType.startsWith('Part/')

export const isFeatureEnabled = (feature: Feature): boolean => feature.enabled !== false
