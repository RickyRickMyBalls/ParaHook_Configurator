import {
  GEOMETRY_EXTRUDE_BODY_GENERATION_MODE_OPTIONS,
  GEOMETRY_EXTRUDE_DIRECTION_OPTIONS,
  GEOMETRY_EXTRUDE_TYPE_OPTIONS,
  readGeometryExtrudeBodyGenerationModeFromParams,
  readGeometryExtrudeDepthMmFromParams,
  readGeometryExtrudeDirectionFromParams,
  readGeometryExtrudeEndDepthMmFromParams,
  readGeometryExtrudeStartDepthMmFromParams,
  readGeometryExtrudeTaperAngleDegFromParams,
  readGeometryExtrudeTypeFromParams,
  type GeometryExtrudeBodyGenerationMode,
  type GeometryExtrudeDirection,
  type GeometryExtrudeType,
} from '../families/Geometry/contracts/sketchExtrudeProfileContract'

export type ExtrudeControlSelectOption<T extends string> = {
  value: T
  label: string
}

export const GEOMETRY_EXTRUDE_TYPE_SELECT_OPTIONS: readonly ExtrudeControlSelectOption<GeometryExtrudeType>[] =
  GEOMETRY_EXTRUDE_TYPE_OPTIONS.map((value) => ({ value, label: value }))

export const GEOMETRY_EXTRUDE_DIRECTION_SELECT_OPTIONS: readonly ExtrudeControlSelectOption<GeometryExtrudeDirection>[] =
  GEOMETRY_EXTRUDE_DIRECTION_OPTIONS.map((value) => ({
    value,
    label:
      value === 'OneSide'
        ? 'One Side'
        : value === 'TwoSides'
          ? 'Two Sides'
          : 'Symmetric',
  }))

export const GEOMETRY_EXTRUDE_BODY_GENERATION_MODE_SELECT_OPTIONS: readonly ExtrudeControlSelectOption<GeometryExtrudeBodyGenerationMode>[] =
  GEOMETRY_EXTRUDE_BODY_GENERATION_MODE_OPTIONS.map((value) => ({
    value,
    label: value === 'NewObjects' ? 'New Objects' : 'Combine',
  }))

export type GeometryExtrudeControlModel = {
  localExtrudeType: GeometryExtrudeType
  effectiveExtrudeType: GeometryExtrudeType
  typeDriven: boolean
  localExtrudeDirection: GeometryExtrudeDirection
  effectiveExtrudeDirection: GeometryExtrudeDirection
  directionDriven: boolean
  localBodyGenerationMode: GeometryExtrudeBodyGenerationMode
  effectiveBodyGenerationMode: GeometryExtrudeBodyGenerationMode
  bodyGenerationModeDriven: boolean
  localDepthMm: number
  effectiveDepthMm: number
  depthVisible: boolean
  depthDriven: boolean
  localStartDepthMm: number
  effectiveStartDepthMm: number
  startDepthVisible: boolean
  startDepthDriven: boolean
  localEndDepthMm: number
  effectiveEndDepthMm: number
  endDepthVisible: boolean
  endDepthDriven: boolean
  localTaperAngleDeg: number
  effectiveTaperAngleDeg: number
  taperVisible: boolean
  taperDriven: boolean
}

type BuildGeometryExtrudeControlModelInput = {
  params: Record<string, unknown>
  effectiveExtrudeType?: GeometryExtrudeType
  typeDriven?: boolean
  effectiveExtrudeDirection?: GeometryExtrudeDirection
  directionDriven?: boolean
  effectiveBodyGenerationMode?: GeometryExtrudeBodyGenerationMode
  bodyGenerationModeDriven?: boolean
  effectiveDepthMm?: number
  depthDriven?: boolean
  effectiveStartDepthMm?: number
  startDepthDriven?: boolean
  effectiveEndDepthMm?: number
  endDepthDriven?: boolean
  effectiveTaperAngleDeg?: number
  taperDriven?: boolean
}

export const buildGeometryExtrudeControlModel = ({
  params,
  effectiveExtrudeType,
  typeDriven = false,
  effectiveExtrudeDirection,
  directionDriven = false,
  effectiveBodyGenerationMode,
  bodyGenerationModeDriven = false,
  effectiveDepthMm,
  depthDriven = false,
  effectiveStartDepthMm,
  startDepthDriven = false,
  effectiveEndDepthMm,
  endDepthDriven = false,
  effectiveTaperAngleDeg,
  taperDriven = false,
}: BuildGeometryExtrudeControlModelInput): GeometryExtrudeControlModel => {
  const localExtrudeType = readGeometryExtrudeTypeFromParams(params)
  const resolvedExtrudeType = effectiveExtrudeType ?? localExtrudeType
  const localExtrudeDirection = readGeometryExtrudeDirectionFromParams(params)
  const resolvedExtrudeDirection = effectiveExtrudeDirection ?? localExtrudeDirection
  const localBodyGenerationMode = readGeometryExtrudeBodyGenerationModeFromParams(params)
  const resolvedBodyGenerationMode = effectiveBodyGenerationMode ?? localBodyGenerationMode
  const localDepthMm = readGeometryExtrudeDepthMmFromParams(params)
  const resolvedDepthMm = effectiveDepthMm ?? localDepthMm
  const localStartDepthMm = readGeometryExtrudeStartDepthMmFromParams(params)
  const resolvedStartDepthMm = effectiveStartDepthMm ?? localStartDepthMm
  const localEndDepthMm = readGeometryExtrudeEndDepthMmFromParams(params)
  const resolvedEndDepthMm = effectiveEndDepthMm ?? localEndDepthMm
  const localTaperAngleDeg = readGeometryExtrudeTaperAngleDegFromParams(params)
  const resolvedTaperAngleDeg = effectiveTaperAngleDeg ?? localTaperAngleDeg

  return {
    localExtrudeType,
    effectiveExtrudeType: resolvedExtrudeType,
    typeDriven,
    localExtrudeDirection,
    effectiveExtrudeDirection: resolvedExtrudeDirection,
    directionDriven,
    localBodyGenerationMode,
    effectiveBodyGenerationMode: resolvedBodyGenerationMode,
    bodyGenerationModeDriven,
    localDepthMm,
    effectiveDepthMm: resolvedDepthMm,
    depthVisible: resolvedExtrudeDirection !== 'TwoSides',
    depthDriven,
    localStartDepthMm,
    effectiveStartDepthMm: resolvedStartDepthMm,
    startDepthVisible: resolvedExtrudeDirection === 'TwoSides',
    startDepthDriven,
    localEndDepthMm,
    effectiveEndDepthMm: resolvedEndDepthMm,
    endDepthVisible: resolvedExtrudeDirection === 'TwoSides',
    endDepthDriven,
    localTaperAngleDeg,
    effectiveTaperAngleDeg: resolvedTaperAngleDeg,
    taperVisible: resolvedExtrudeType === 'Body' && resolvedExtrudeDirection === 'OneSide',
    taperDriven,
  }
}
