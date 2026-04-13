import type { NumberExpression, Vec2Expression } from './expressions'
import type {
  ProfileLoop,
  SketchPlane,
  SketchPlaneTransform,
  Vec3Literal,
} from '../../../shared/sketchTypes'

export type {
  ProfileLoop,
  Segment2,
  Segment2Arc3pt,
  Segment2Bezier,
  Segment2Line,
  SketchPlane,
  SketchPlaneTransform,
  Vec3Literal,
} from '../../../shared/sketchTypes'
export { createDefaultSketchPlaneTransform } from '../../../shared/sketchTypes'

export type FeatureStack = Feature[]

export type Feature = SketchFeature | CloseProfileFeature | ExtrudeFeature

export type SketchPlaneTransformHistoryEntry = {
  entryId: string
  point: Vec3Literal
  locked: boolean
}

export type Line2Component = {
  rowId: string
  componentId: string
  type: 'line'
  name?: string
  drawGroupId?: string
  drawGroupName?: string
  a: Vec2Expression
  b: Vec2Expression
}

export type Bezier2Component = {
  rowId: string
  componentId: string
  type: 'spline'
  name?: string
  p0: Vec2Expression
  p1: Vec2Expression
  p2: Vec2Expression
  p3: Vec2Expression
}

export type Arc3pt2Component = {
  rowId: string
  componentId: string
  type: 'arc3pt'
  name?: string
  start: Vec2Expression
  mid: Vec2Expression
  end: Vec2Expression
}

export type RectangleComponent = {
  rowId: string
  componentId: string
  type: 'rectangle'
  name?: string
  a: Vec2Expression
  b: Vec2Expression
}

export type CircleComponent = {
  rowId: string
  componentId: string
  type: 'circle'
  name?: string
  center: Vec2Expression
  edge: Vec2Expression
}

export type SketchComponent =
  | Line2Component
  | Bezier2Component
  | Arc3pt2Component
  | RectangleComponent
  | CircleComponent

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
  planeTransform?: SketchPlaneTransform
  components: SketchComponent[]
  outputs: {
    profiles: ProfileOutput[]
    diagnostics?: SketchDerivationDiagnostic[]
  }
  uiState: {
    collapsed: boolean
    selectedProfileId?: string
    sketchPlaneTransformHistory?: SketchPlaneTransformHistoryEntry[]
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
    extrudeType?: ExtrudeResultType
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

export type ExtrudeResultType = 'Body' | 'Walls'

export const isPartNodeType = (nodeType: string): boolean => nodeType.startsWith('Part/')

export const isFeatureEnabled = (feature: Feature): boolean => feature.enabled !== false
