import { z } from 'zod'
import type {
  FeatureStack,
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

const profileOutputSchema = z
  .object({
    profileId: z.string().min(1),
    entityIds: z.array(z.string().min(1)),
    area: z.number().nonnegative(),
  })
  .strict()

const lineEntitySchema = z
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
  })
  .strict()

const sketchFeatureSchema = z
  .object({
    type: z.literal('sketch'),
    featureId: z.string().min(1),
    entities: z.array(lineEntitySchema),
    outputs: z
      .object({
        profiles: z.array(profileOutputSchema),
      })
      .strict(),
    uiState: z
      .object({
        collapsed: z.boolean(),
      })
      .strict(),
  })
  .strict()

const extrudeFeatureSchema = z
  .object({
    type: z.literal('extrude'),
    featureId: z.string().min(1),
    inputs: z
      .object({
        profileRef: profileReferenceSchema.nullable(),
      })
      .strict(),
    params: z
      .object({
        depth: numberExpressionSchema,
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

export const featureSchema = z.discriminatedUnion('type', [
  sketchFeatureSchema,
  extrudeFeatureSchema,
])

export const featureStackSchema = z.array(featureSchema)

export const parseFeatureStack = (input: unknown): FeatureStack =>
  featureStackSchema.parse(input) as FeatureStack

export const readFeatureStack = (input: unknown): FeatureStack => {
  const parsed = featureStackSchema.safeParse(input)
  return parsed.success ? (parsed.data as FeatureStack) : []
}
