import { z } from 'zod'
import { featureStackSchema } from '../features/featureSchema'
import type { PortSpec } from '../schema/spaghettiTypes'

export type NodeTypeId =
  | 'Part/Baseplate'
  | 'Part/ToeHook'
  | 'Part/HeelKick'
  | 'Output/Assembled'
  | 'Primitive/Number'
  | 'Primitive/Vec2'
  | 'Primitive/SplineFromPoints'
  | 'Utility/IdentitySpline2'
  | 'Utility/IdentityNumberMm'

export type NodeComputeContext = {
  nodeId: string
  params: Record<string, unknown>
  inputs: Record<string, unknown>
}

export type NodeComputeResult = Record<string, unknown>

export type NodeUiSection = {
  sectionId: string
  label: string
  items: string[]
}

export type DriverEndpointRef = {
  portId: string
  path?: string[]
  label?: string
}

export type DriverNumberControlSpec = {
  kind: 'nodeParam'
  paramId: string
  min?: number
  max?: number
  step?: number
  showSlider?: boolean
  fallbackValue?: number
  syncRect?: {
    widthParamId: string
    lengthParamId: string
    pointParamIds: [string, string, string, string, string]
    widthFallback: number
    lengthFallback: number
  }
}

export type DriverVec2ControlSpec = {
  kind: 'nodeParamVec2'
  paramId: string
  min?: number
  max?: number
  step?: number
  fallbackValue?: {
    x: number
    y: number
  }
}

export type NodeInputDriverSpec =
  | {
      kind: 'endpoint'
      endpoint: DriverEndpointRef
      numberControl?: DriverNumberControlSpec
      groupLabel?: string
      wiringDisabled?: boolean
      visibility?: 'always' | 'connectedOnly'
    }
  | {
      kind: 'nodeParam'
      label: string
      control: DriverNumberControlSpec | DriverVec2ControlSpec
      groupLabel?: string
    }
  | {
      kind: 'featureParam'
      featureParam: {
        kind: 'firstExtrudeDepth'
      }
      label: string
      groupLabel?: string
    }

export type NodeOutputDriverSpec =
  | {
      kind: 'endpoint'
      endpoint: DriverEndpointRef
    }
  | {
      kind: 'reserved'
      reserved: {
        kind: 'mesh'
        state: 'pending'
      }
      label: string
    }

export type NodeDefinition = {
  type: NodeTypeId
  label: string
  paramsSchema: z.ZodTypeAny
  defaultParams?: Record<string, unknown>
  inputs: PortSpec[]
  outputs: PortSpec[]
  compute: (ctx: NodeComputeContext) => NodeComputeResult
  template?: 'part'
  inputDrivers?: NodeInputDriverSpec[]
  outputDrivers?: NodeOutputDriverSpec[]
  legacyInputPortAliases?: Record<string, string>
  uiSections?: NodeUiSection[]
  presetOptions?: string[]
}

const unitSchema = z.enum(['mm', 'deg', 'unitless'])
const emptyParamsSchema = z.object({}).strict()
const baseplateParamsSchema = z
  .object({
    presetId: z.string().min(1).optional(),
    featureStack: featureStackSchema.optional(),
    widthMm: z.number().positive().optional(),
    lengthMm: z.number().positive().optional(),
    anchorPoint1: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    anchorPoint2: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    anchorPoint3: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    anchorPoint4: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    anchorPoint5: z.object({ x: z.number(), y: z.number() }).strict().optional(),
  })
  .strict()
const toeHookParamsSchema = z
  .object({
    presetId: z.string().min(1).optional(),
    featureStack: featureStackSchema.optional(),
    hookWidth: z.number().finite().optional(),
    hookThickness: z.number().finite().optional(),
    hookTrim: z.number().finite().optional(),
    profileA_end: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    profileA_endCtrl: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    profileA_baseCtrl: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    profileB_end: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    profileB_endCtrl: z.object({ x: z.number(), y: z.number() }).strict().optional(),
    profileB_baseCtrl: z.object({ x: z.number(), y: z.number() }).strict().optional(),
  })
  .strict()
const defaultBaseplateWidth = 30
const defaultBaseplateLength = 200
const defaultToeHookWidth = 24
const defaultToeHookThickness = 4
const defaultToeHookTrim = 2
const defaultToeHookProfileAEnd = { x: 40, y: 18 }
const defaultToeHookProfileAEndCtrl = { x: 30, y: 14 }
const defaultToeHookProfileABaseCtrl = { x: 8, y: 6 }
const defaultToeHookProfileBEnd = { x: 40, y: -18 }
const defaultToeHookProfileBEndCtrl = { x: 30, y: -14 }
const defaultToeHookProfileBBaseCtrl = { x: 8, y: -6 }
const defaultHeelKickWidth = 24
const defaultHeelKickThickness = 4
const defaultHeelKickTrim = 2
const defaultHeelKickProfileAEnd = { x: 34, y: 14 }
const defaultHeelKickProfileAEndCtrl = { x: 24, y: 10 }
const defaultHeelKickProfileABaseCtrl = { x: 6, y: 4 }
const defaultHeelKickProfileBEnd = { x: 34, y: -24 }
const defaultHeelKickProfileBEndCtrl = { x: 26, y: -20 }
const defaultHeelKickProfileBBaseCtrl = { x: 7, y: -8 }

const toFiniteNumberOr = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const isVec2Like = (value: unknown): value is { x: number; y: number } =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { x?: unknown }).x === 'number' &&
  Number.isFinite((value as { x: number }).x) &&
  typeof (value as { y?: unknown }).y === 'number' &&
  Number.isFinite((value as { y: number }).y)

export const registry: Record<NodeTypeId, NodeDefinition> = {
  'Part/Baseplate': {
    type: 'Part/Baseplate',
    label: 'Baseplate',
    paramsSchema: baseplateParamsSchema,
    defaultParams: {
      presetId: 'default',
      featureStack: [],
      widthMm: defaultBaseplateWidth,
      lengthMm: defaultBaseplateLength,
      anchorPoint1: { x: 0, y: 0 },
      anchorPoint2: { x: defaultBaseplateLength, y: 0 },
      anchorPoint3: { x: defaultBaseplateLength, y: defaultBaseplateWidth },
      anchorPoint4: { x: 0, y: defaultBaseplateWidth },
      anchorPoint5: { x: 0, y: 0 },
    },
    template: 'part',
    inputs: [
      {
        portId: 'width',
        label: 'Width',
        type: { kind: 'number', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'length',
        label: 'Length',
        type: { kind: 'number', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'anchorPoint1',
        label: 'Anchor Point 1',
        type: { kind: 'vec2', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'anchorPoint2',
        label: 'Anchor Point 2',
        type: { kind: 'vec2', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'anchorPoint3',
        label: 'Anchor Point 3',
        type: { kind: 'vec2', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'anchorPoint4',
        label: 'Anchor Point 4',
        type: { kind: 'vec2', unit: 'mm' },
        optional: true,
      },
      {
        portId: 'anchorPoint5',
        label: 'Anchor Point 5',
        type: { kind: 'vec2', unit: 'mm' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'anchorSpline2',
        label: 'Base Plate Spline (Inner)',
        type: { kind: 'spline2' },
      },
    ],
    inputDrivers: [
      {
        kind: 'nodeParam',
        label: 'Width',
        control: {
          kind: 'nodeParam',
          paramId: 'widthMm',
          min: 1,
          max: 500,
          step: 0.1,
          showSlider: true,
          fallbackValue: defaultBaseplateWidth,
          syncRect: {
            widthParamId: 'widthMm',
            lengthParamId: 'lengthMm',
            pointParamIds: [
              'anchorPoint1',
              'anchorPoint2',
              'anchorPoint3',
              'anchorPoint4',
              'anchorPoint5',
            ],
            widthFallback: defaultBaseplateWidth,
            lengthFallback: defaultBaseplateLength,
          },
        },
      },
      {
        kind: 'nodeParam',
        label: 'Length',
        control: {
          kind: 'nodeParam',
          paramId: 'lengthMm',
          min: 1,
          max: 2000,
          step: 0.1,
          showSlider: true,
          fallbackValue: defaultBaseplateLength,
          syncRect: {
            widthParamId: 'widthMm',
            lengthParamId: 'lengthMm',
            pointParamIds: [
              'anchorPoint1',
              'anchorPoint2',
              'anchorPoint3',
              'anchorPoint4',
              'anchorPoint5',
            ],
            widthFallback: defaultBaseplateWidth,
            lengthFallback: defaultBaseplateLength,
          },
        },
      },
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'width',
          label: 'Width (Legacy Wire)',
        },
        wiringDisabled: true,
        visibility: 'connectedOnly',
      },
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'length',
          label: 'Length (Legacy Wire)',
        },
        wiringDisabled: true,
        visibility: 'connectedOnly',
      },
      {
        kind: 'featureParam',
        featureParam: {
          kind: 'firstExtrudeDepth',
        },
        label: 'Thickness',
      },
    ],
    outputDrivers: [
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'anchorSpline2',
          label: 'Inner Spline Anchor',
        },
      },
      {
        kind: 'reserved',
        reserved: {
          kind: 'mesh',
          state: 'pending',
        },
        label: 'Mesh Output',
      },
    ],
    uiSections: [
      {
        sectionId: 'sketch',
        label: '1 - Sketch',
        items: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
      },
      {
        sectionId: 'extrusion',
        label: '2 - Extrusion',
        items: ['baseplateThickness'],
      },
    ],
    presetOptions: ['default'],
    compute: ({ params, inputs }) => {
      const paramWidth = toFiniteNumberOr(params.widthMm, defaultBaseplateWidth)
      const paramLength = toFiniteNumberOr(params.lengthMm, defaultBaseplateLength)
      const width = toFiniteNumberOr(inputs.width, paramWidth)
      const length = toFiniteNumberOr(inputs.length, paramLength)
      const defaultPoints = [
        { x: 0, y: 0 },
        { x: length, y: 0 },
        { x: length, y: width },
        { x: 0, y: width },
        { x: 0, y: 0 },
      ]
      const points = defaultPoints.map((fallback, index) => {
        const key = `anchorPoint${index + 1}` as const
        const inputValue = inputs[key]
        if (isVec2Like(inputValue)) {
          return inputValue
        }
        const paramValue = params[key]
        if (isVec2Like(paramValue)) {
          return paramValue
        }
        return fallback
      })
      return {
        anchorSpline2: {
          points,
          closed: true,
        },
      }
    },
  },
  'Part/ToeHook': {
    type: 'Part/ToeHook',
    label: 'Toe Hook',
    paramsSchema: toeHookParamsSchema,
    defaultParams: {
      presetId: 'default',
      featureStack: [],
      hookWidth: defaultToeHookWidth,
      hookThickness: defaultToeHookThickness,
      hookTrim: defaultToeHookTrim,
      profileA_end: defaultToeHookProfileAEnd,
      profileA_endCtrl: defaultToeHookProfileAEndCtrl,
      profileA_baseCtrl: defaultToeHookProfileABaseCtrl,
      profileB_end: defaultToeHookProfileBEnd,
      profileB_endCtrl: defaultToeHookProfileBEndCtrl,
      profileB_baseCtrl: defaultToeHookProfileBBaseCtrl,
    },
    legacyInputPortAliases: {
      anchorSpline2: 'anchorSpline',
    },
    template: 'part',
    inputs: [
      {
        portId: 'anchorSpline',
        label: 'Anchor Spline',
        type: { kind: 'spline2' },
      },
      {
        portId: 'railMath',
        label: 'Rail Math',
        type: { kind: 'railMath' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'toeLoft',
        label: 'Toe Loft',
        type: { kind: 'toeLoft' },
      },
    ],
    inputDrivers: [
      {
        kind: 'nodeParam',
        label: 'Hook Width',
        groupLabel: 'Global',
        control: {
          kind: 'nodeParam',
          paramId: 'hookWidth',
          min: 0,
          max: 500,
          step: 0.1,
          fallbackValue: defaultToeHookWidth,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook Thickness',
        groupLabel: 'Global',
        control: {
          kind: 'nodeParam',
          paramId: 'hookThickness',
          min: 0,
          max: 200,
          step: 0.1,
          fallbackValue: defaultToeHookThickness,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook Trim',
        groupLabel: 'Global',
        control: {
          kind: 'nodeParam',
          paramId: 'hookTrim',
          min: 0,
          max: 200,
          step: 0.1,
          fallbackValue: defaultToeHookTrim,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook End',
        groupLabel: 'Profile A',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileA_end',
          step: 0.1,
          fallbackValue: defaultToeHookProfileAEnd,
        },
      },
      {
        kind: 'nodeParam',
        label: 'End Control',
        groupLabel: 'Profile A',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileA_endCtrl',
          step: 0.1,
          fallbackValue: defaultToeHookProfileAEndCtrl,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Base Point Control',
        groupLabel: 'Profile A',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileA_baseCtrl',
          step: 0.1,
          fallbackValue: defaultToeHookProfileABaseCtrl,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook End',
        groupLabel: 'Profile B',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileB_end',
          step: 0.1,
          fallbackValue: defaultToeHookProfileBEnd,
        },
      },
      {
        kind: 'nodeParam',
        label: 'End Control',
        groupLabel: 'Profile B',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileB_endCtrl',
          step: 0.1,
          fallbackValue: defaultToeHookProfileBEndCtrl,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Base Point Control',
        groupLabel: 'Profile B',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileB_baseCtrl',
          step: 0.1,
          fallbackValue: defaultToeHookProfileBBaseCtrl,
        },
      },
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'anchorSpline',
          label: 'Anchor Spline',
        },
      },
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'railMath',
          label: 'Rail Math',
        },
      },
    ],
    outputDrivers: [
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'toeLoft',
          label: 'Toe Loft',
        },
      },
    ],
    uiSections: [
      {
        sectionId: 'profiles',
        label: '1 - Profiles',
        items: ['Profile A - Start', 'Profile B - Control', 'Profile C - End'],
      },
      {
        sectionId: 'features',
        label: '2 - Features',
        items: ['Rail Math', 'Chamfer/Fillet'],
      },
    ],
    presetOptions: ['default'],
    compute: () => ({
      toeLoft: null,
    }),
  },
  'Part/HeelKick': {
    type: 'Part/HeelKick',
    label: 'Heel Kick',
    paramsSchema: toeHookParamsSchema,
    defaultParams: {
      presetId: 'default',
      featureStack: [],
      hookWidth: defaultHeelKickWidth,
      hookThickness: defaultHeelKickThickness,
      hookTrim: defaultHeelKickTrim,
      profileA_end: defaultHeelKickProfileAEnd,
      profileA_endCtrl: defaultHeelKickProfileAEndCtrl,
      profileA_baseCtrl: defaultHeelKickProfileABaseCtrl,
      profileB_end: defaultHeelKickProfileBEnd,
      profileB_endCtrl: defaultHeelKickProfileBEndCtrl,
      profileB_baseCtrl: defaultHeelKickProfileBBaseCtrl,
    },
    legacyInputPortAliases: {
      anchorSpline2: 'anchorSpline',
    },
    template: 'part',
    inputs: [
      {
        portId: 'anchorSpline',
        label: 'Anchor Spline',
        type: { kind: 'spline2' },
      },
      {
        portId: 'railMath',
        label: 'Rail Math',
        type: { kind: 'railMath' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'hookLoft',
        label: 'Heel Loft',
        type: { kind: 'toeLoft' },
      },
    ],
    inputDrivers: [
      {
        kind: 'nodeParam',
        label: 'Hook Width',
        groupLabel: 'Global',
        control: {
          kind: 'nodeParam',
          paramId: 'hookWidth',
          min: 0,
          max: 500,
          step: 0.1,
          fallbackValue: defaultHeelKickWidth,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook Thickness',
        groupLabel: 'Global',
        control: {
          kind: 'nodeParam',
          paramId: 'hookThickness',
          min: 0,
          max: 200,
          step: 0.1,
          fallbackValue: defaultHeelKickThickness,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook Trim',
        groupLabel: 'Global',
        control: {
          kind: 'nodeParam',
          paramId: 'hookTrim',
          min: 0,
          max: 200,
          step: 0.1,
          fallbackValue: defaultHeelKickTrim,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook End',
        groupLabel: 'Profile A',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileA_end',
          step: 0.1,
          fallbackValue: defaultHeelKickProfileAEnd,
        },
      },
      {
        kind: 'nodeParam',
        label: 'End Control',
        groupLabel: 'Profile A',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileA_endCtrl',
          step: 0.1,
          fallbackValue: defaultHeelKickProfileAEndCtrl,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Base Point Control',
        groupLabel: 'Profile A',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileA_baseCtrl',
          step: 0.1,
          fallbackValue: defaultHeelKickProfileABaseCtrl,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Hook End',
        groupLabel: 'Profile B',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileB_end',
          step: 0.1,
          fallbackValue: defaultHeelKickProfileBEnd,
        },
      },
      {
        kind: 'nodeParam',
        label: 'End Control',
        groupLabel: 'Profile B',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileB_endCtrl',
          step: 0.1,
          fallbackValue: defaultHeelKickProfileBEndCtrl,
        },
      },
      {
        kind: 'nodeParam',
        label: 'Base Point Control',
        groupLabel: 'Profile B',
        control: {
          kind: 'nodeParamVec2',
          paramId: 'profileB_baseCtrl',
          step: 0.1,
          fallbackValue: defaultHeelKickProfileBBaseCtrl,
        },
      },
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'anchorSpline',
          label: 'Anchor Spline',
        },
      },
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'railMath',
          label: 'Rail Math',
        },
      },
    ],
    outputDrivers: [
      {
        kind: 'endpoint',
        endpoint: {
          portId: 'hookLoft',
          label: 'Heel Loft',
        },
      },
    ],
    uiSections: [
      {
        sectionId: 'profiles',
        label: '1 - Profiles',
        items: ['Profile A - Start', 'Profile B - Control', 'Profile C - End'],
      },
      {
        sectionId: 'features',
        label: '2 - Features',
        items: ['Rail Math', 'Chamfer/Fillet'],
      },
    ],
    presetOptions: ['default'],
    compute: () => ({
      hookLoft: null,
    }),
  },
  'Output/Assembled': {
    type: 'Output/Assembled',
    label: 'Assembled Output',
    paramsSchema: emptyParamsSchema,
    inputs: [],
    outputs: [],
    compute: () => ({}),
  },
  'Primitive/Number': {
    type: 'Primitive/Number',
    label: 'Number',
    paramsSchema: z
      .object({
        value: z.number(),
        unit: unitSchema.default('unitless'),
      })
      .strict(),
    defaultParams: {
      value: 0,
      unit: 'unitless',
    },
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'number', unit: 'unitless' },
      },
    ],
    compute: ({ params }) => ({
      value: params.value,
    }),
  },
  'Primitive/Vec2': {
    type: 'Primitive/Vec2',
    label: 'Vec2',
    paramsSchema: z
      .object({
        x: z.number(),
        y: z.number(),
        unit: unitSchema.default('unitless'),
      })
      .strict(),
    defaultParams: {
      x: 0,
      y: 0,
      unit: 'unitless',
    },
    inputs: [],
    outputs: [
      {
        portId: 'value',
        label: 'Value',
        type: { kind: 'vec2', unit: 'unitless' },
      },
    ],
    compute: ({ params }) => ({
      value: {
        x: params.x,
        y: params.y,
      },
    }),
  },
  'Primitive/SplineFromPoints': {
    type: 'Primitive/SplineFromPoints',
    label: 'Spline From Points',
    paramsSchema: z
      .object({
        points: z.array(
          z
            .object({
              x: z.number(),
              y: z.number(),
            })
            .strict(),
        ),
        closed: z.boolean().optional(),
      })
      .strict(),
    defaultParams: {
      points: [],
      closed: false,
    },
    inputs: [
      {
        portId: 'points',
        label: 'Points',
        type: { kind: 'vec2', unit: 'unitless' },
        optional: true,
      },
    ],
    outputs: [
      {
        portId: 'spline',
        label: 'Spline',
        type: { kind: 'spline2' },
      },
    ],
    compute: ({ params }) => ({
      spline: {
        points: Array.isArray(params.points) ? params.points : [],
        closed: params.closed === true,
      },
    }),
  },
  'Utility/IdentitySpline2': {
    type: 'Utility/IdentitySpline2',
    label: 'Identity Spline2',
    paramsSchema: emptyParamsSchema,
    inputs: [
      {
        portId: 'in',
        label: 'In',
        type: { kind: 'spline2' },
      },
    ],
    outputs: [
      {
        portId: 'out',
        label: 'Out',
        type: { kind: 'spline2' },
      },
    ],
    compute: ({ inputs }) => ({
      out: inputs.in,
    }),
  },
  'Utility/IdentityNumberMm': {
    type: 'Utility/IdentityNumberMm',
    label: 'Identity Number (mm)',
    paramsSchema: emptyParamsSchema,
    inputs: [
      {
        portId: 'in',
        label: 'In',
        type: { kind: 'number', unit: 'mm' },
      },
    ],
    outputs: [
      {
        portId: 'out',
        label: 'Out',
        type: { kind: 'number', unit: 'mm' },
      },
    ],
    compute: ({ inputs }) => ({
      out: inputs.in,
    }),
  },
}

export const getNodeDef = (type: string): NodeDefinition | undefined =>
  registry[type as NodeTypeId]

export const listNodeTypes = (): NodeDefinition[] => Object.values(registry)

const cloneDefaultParams = (value: Record<string, unknown>): Record<string, unknown> =>
  JSON.parse(JSON.stringify(value)) as Record<string, unknown>

export const getDefaultNodeParams = (type: NodeTypeId): Record<string, unknown> => {
  const defaults = registry[type].defaultParams
  if (defaults === undefined) {
    return {}
  }
  return cloneDefaultParams(defaults)
}
