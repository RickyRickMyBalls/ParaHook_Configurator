import { z } from 'zod'
import { createDefaultSketchPlaneTransform } from './featureTypes'
import type {
  FeatureStack,
  ProfileOutput,
  SketchComponent,
  SketchFeature,
  SketchPlane,
} from './featureTypes'

const numberExpressionSchema = z
  .object({
    kind: z.literal('lit'),
    value: z.number(),
  })
  .strict()

const vec2ExpressionSchema = z
  .object({
    kind: z.literal('lit'),
    x: z.number(),
    y: z.number(),
  })
  .strict()

const sketchPlaneSchema = z.enum(['XY', 'YZ', 'XZ'])

const vec3LiteralSchema = z
  .object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  })
  .strict()

const sketchPlaneTransformSchema = z
  .object({
    offsetMm: z.number(),
    translation: vec3LiteralSchema,
    rotationDeg: vec3LiteralSchema,
    inPlaneRotationDeg: z.number(),
  })
  .strict()

const sketchPlaneTransformHistoryEntrySchema = z
  .object({
    entryId: z.string().min(1),
    point: vec3LiteralSchema,
    locked: z.boolean(),
  })
  .strict()

const segmentLineSchema = z
  .object({
    kind: z.literal('line2'),
    a: z.object({ x: z.number(), y: z.number() }).strict(),
    b: z.object({ x: z.number(), y: z.number() }).strict(),
  })
  .strict()

const segmentBezierSchema = z
  .object({
    kind: z.literal('bezier2'),
    p0: z.object({ x: z.number(), y: z.number() }).strict(),
    p1: z.object({ x: z.number(), y: z.number() }).strict(),
    p2: z.object({ x: z.number(), y: z.number() }).strict(),
    p3: z.object({ x: z.number(), y: z.number() }).strict(),
  })
  .strict()

const segmentArc3ptSchema = z
  .object({
    kind: z.literal('arc3pt2'),
    start: z.object({ x: z.number(), y: z.number() }).strict(),
    mid: z.object({ x: z.number(), y: z.number() }).strict(),
    end: z.object({ x: z.number(), y: z.number() }).strict(),
  })
  .strict()

const profileLoopSchema = z
  .object({
    segments: z.array(z.discriminatedUnion('kind', [segmentLineSchema, segmentBezierSchema, segmentArc3ptSchema])),
    winding: z.enum(['CCW', 'CW']),
  })
  .strict()

const profileOutputSchema = z
  .object({
    profileId: z.string().min(1),
    profileIndex: z.number().int().nonnegative().optional(),
    area: z.number().nonnegative(),
    loop: profileLoopSchema.optional(),
    verticesProxy: z.array(z.object({ x: z.number(), y: z.number() }).strict()).optional(),
    // Legacy compatibility
    entityIds: z.array(z.string().min(1)).optional(),
  })
  .strict()
  .transform((input): ProfileOutput => ({
    profileId: input.profileId,
    profileIndex: input.profileIndex ?? 0,
    area: input.area,
    loop:
      input.loop ?? {
        segments: [],
        winding: 'CCW',
      },
    verticesProxy: input.verticesProxy ?? [],
    ...(input.entityIds === undefined ? {} : { entityIds: input.entityIds }),
  }))

const lineComponentSchema = z
  .object({
    rowId: z.string().min(1),
    componentId: z.string().min(1),
    type: z.literal('line'),
    drawGroupId: z.string().min(1).optional(),
    a: vec2ExpressionSchema,
    b: vec2ExpressionSchema,
  })
  .strict()

const splineComponentSchema = z
  .object({
    rowId: z.string().min(1),
    componentId: z.string().min(1),
    type: z.literal('spline'),
    p0: vec2ExpressionSchema,
    p1: vec2ExpressionSchema,
    p2: vec2ExpressionSchema,
    p3: vec2ExpressionSchema,
  })
  .strict()

const arc3ptComponentSchema = z
  .object({
    rowId: z.string().min(1),
    componentId: z.string().min(1),
    type: z.literal('arc3pt'),
    start: vec2ExpressionSchema,
    mid: vec2ExpressionSchema,
    end: vec2ExpressionSchema,
  })
  .strict()

const rectangleComponentSchema = z
  .object({
    rowId: z.string().min(1),
    componentId: z.string().min(1),
    type: z.literal('rectangle'),
    a: vec2ExpressionSchema,
    b: vec2ExpressionSchema,
  })
  .strict()

const circleComponentSchema = z
  .object({
    rowId: z.string().min(1),
    componentId: z.string().min(1),
    type: z.literal('circle'),
    center: vec2ExpressionSchema,
    edge: vec2ExpressionSchema,
  })
  .strict()

const sketchComponentSchema = z.discriminatedUnion('type', [
  lineComponentSchema,
  splineComponentSchema,
  arc3ptComponentSchema,
  rectangleComponentSchema,
  circleComponentSchema,
])

const legacyLineEntitySchema = z
  .object({
    entityId: z.string().min(1),
    type: z.literal('line'),
    start: vec2ExpressionSchema,
    end: vec2ExpressionSchema,
  })
  .strict()

const profileReferenceSchema = z
  .object({
    sourceFeatureId: z.string().min(1),
    profileId: z.string().min(1),
    profileIndex: z.number().int().nonnegative().optional(),
  })
  .strict()

const closeProfileOutputRefSchema = z
  .object({
    sourceFeatureId: z.string().min(1),
    profileId: z.string().min(1),
    profileIndex: z.literal(0),
  })
  .strict()

export const sketchFeatureSchema = z
  .object({
    type: z.literal('sketch'),
    featureId: z.string().min(1),
    enabled: z.boolean().optional(),
    plane: sketchPlaneSchema.optional(),
    planeTransform: sketchPlaneTransformSchema.optional(),
    components: z.array(sketchComponentSchema).optional(),
    // Legacy input shape
    entities: z.array(legacyLineEntitySchema).optional(),
    outputs: z
      .object({
        profiles: z.array(profileOutputSchema).optional(),
        diagnostics: z
          .array(
            z
              .object({
                code: z.enum(['SKETCH_PROFILE_NOT_CLOSED', 'SKETCH_PROFILE_DEGENERATE']),
                message: z.string().min(1),
              })
              .strict(),
          )
          .optional(),
      })
      .optional(),
    uiState: z
      .object({
        collapsed: z.boolean(),
        selectedProfileId: z.string().min(1).optional(),
        sketchPlaneTransformHistory: z.array(sketchPlaneTransformHistoryEntrySchema).optional(),
      })
      .strict(),
  })
  .strict()
  .transform((feature): SketchFeature => {
    const components: SketchComponent[] =
      feature.components ??
      (feature.entities ?? []).map((entity) => ({
        rowId: `legacy-row-${entity.entityId}`,
        componentId: entity.entityId,
        type: 'line',
        a: entity.start,
        b: entity.end,
      }))
    return {
      type: 'sketch',
      featureId: feature.featureId,
      enabled: feature.enabled ?? true,
      plane: (feature.plane ?? 'XY') as SketchPlane,
      planeTransform: feature.planeTransform ?? createDefaultSketchPlaneTransform(),
      components,
      outputs: {
        profiles: feature.outputs?.profiles ?? [],
        ...(feature.outputs?.diagnostics === undefined
          ? {}
          : {
              diagnostics: feature.outputs.diagnostics,
            }),
      },
      uiState: {
        collapsed: feature.uiState.collapsed,
        ...(feature.uiState.selectedProfileId === undefined
          ? {}
          : { selectedProfileId: feature.uiState.selectedProfileId }),
        ...(feature.uiState.sketchPlaneTransformHistory === undefined
          ? {}
          : {
              sketchPlaneTransformHistory: feature.uiState.sketchPlaneTransformHistory.map((entry) => ({
                entryId: entry.entryId,
                point: { ...entry.point },
                locked: entry.locked,
              })),
            }),
      },
    }
  })

const closeProfileFeatureSchema = z
  .object({
    type: z.literal('closeProfile'),
    featureId: z.string().min(1),
    enabled: z.boolean().optional(),
    inputs: z
      .object({
        sourceSketchFeatureId: z.string().min(1).nullable(),
      })
      .strict(),
    outputs: z
      .object({
        profileRef: closeProfileOutputRefSchema.nullable(),
      })
      .strict(),
    uiState: z
      .object({
        collapsed: z.boolean(),
      })
      .strict(),
  })
  .strict()
  .transform((feature) => ({
    ...feature,
    enabled: feature.enabled ?? true,
  }))

const extrudeFeatureSchema = z
  .object({
    type: z.literal('extrude'),
    featureId: z.string().min(1),
    enabled: z.boolean().optional(),
    inputs: z
      .object({
        profileRef: profileReferenceSchema.nullable(),
      })
      .strict(),
    params: z
      .object({
        depth: numberExpressionSchema,
        taper: numberExpressionSchema.optional(),
        offset: numberExpressionSchema.optional(),
      })
      .strict(),
    outputs: z
      .object({
        bodyId: z.string().min(1),
      })
      .strict(),
    uiState: z
      .object({
        collapsed: z.boolean(),
      })
      .strict(),
  })
  .strict()
  .transform((feature) => ({
    ...feature,
    enabled: feature.enabled ?? true,
  }))

export const featureSchema = z.discriminatedUnion('type', [
  sketchFeatureSchema,
  closeProfileFeatureSchema,
  extrudeFeatureSchema,
])

export const featureStackSchema = z.array(featureSchema)

export const parseFeatureStack = (input: unknown): FeatureStack =>
  featureStackSchema.parse(input) as FeatureStack

export const readFeatureStack = (input: unknown): FeatureStack => {
  const parsed = featureStackSchema.safeParse(input)
  return parsed.success ? (parsed.data as FeatureStack) : []
}
