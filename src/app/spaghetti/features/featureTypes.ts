import type { NumberExpression, Vec2Expression } from './expressions'

export type FeatureStack = Feature[]

export type Feature = SketchFeature | ExtrudeFeature

export type SketchFeature = {
  type: 'sketch'
  featureId: string
  entities: SketchEntity[]
  outputs: {
    profiles: ProfileOutput[]
  }
  uiState: {
    collapsed: boolean
  }
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
  entityIds: string[]
  area: number
}

export type ExtrudeFeature = {
  type: 'extrude'
  featureId: string
  inputs: {
    profileRef: ProfileReference | null
  }
  params: {
    depth: NumberExpression
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
}

export const isPartNodeType = (nodeType: string): boolean => nodeType.startsWith('Part/')
