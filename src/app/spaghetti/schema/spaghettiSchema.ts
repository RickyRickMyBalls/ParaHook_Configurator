import { z } from 'zod'
import type { SpaghettiGraph } from './spaghettiTypes'

const unitSchema = z.enum(['mm', 'deg', 'unitless'])

const portTypeSchema = z
  .object({
    kind: z.enum([
      'number',
      'boolean',
      'vec2',
      'vec3',
      'spline2',
      'spline3',
      'profileLoop',
      'stations',
      'railMath',
      'toeLoft',
    ]),
    unit: unitSchema.optional(),
  })
  .strict()

const portSpecSchema = z
  .object({
    portId: z.string().min(1),
    label: z.string().min(1),
    type: portTypeSchema,
    optional: z.boolean().optional(),
    maxConnectionsIn: z.number().int().positive().optional(),
  })
  .strict()

const nodeUISchema = z
  .object({
    x: z.number(),
    y: z.number(),
    collapsed: z.boolean().optional(),
    color: z.string().optional(),
    zIndex: z.number().optional(),
  })
  .strict()

const edgeEndpointSchema = z
  .object({
    nodeId: z.string().min(1),
    portId: z.string().min(1),
    path: z.array(z.string().min(1)).min(1).optional(),
  })
  .strict()

const spaghettiNodeSchema = z
  .object({
    nodeId: z.string().min(1),
    type: z.string().min(1),
    params: z.record(z.string(), z.unknown()),
    ui: nodeUISchema.optional(),
  })
  .strict()

const spaghettiEdgeSchema = z
  .object({
    edgeId: z.string().min(1),
    from: edgeEndpointSchema,
    to: edgeEndpointSchema,
  })
  .strict()

const graphUISchema = z
  .object({
    nodes: z
      .record(
        z.string(),
        z
          .object({
            x: z.number(),
            y: z.number(),
          })
          .strict(),
      )
      .optional(),
    viewport: z
      .object({
        x: z.number(),
        y: z.number(),
        zoom: z.number(),
      })
      .strict()
      .optional(),
    // Legacy read compatibility only. These keys are stripped by parseSpaghettiGraph.
    selectedNodeIds: z.array(z.string().min(1)).optional(),
    selectedEdgeIds: z.array(z.string().min(1)).optional(),
  })
  .strict()

const spaghettiGraphInputSchema = z
  .object({
    schemaVersion: z.literal(1).default(1),
    nodes: z.array(spaghettiNodeSchema),
    edges: z.array(spaghettiEdgeSchema),
    ui: graphUISchema.optional(),
  })
  .strict()

export const spaghettiGraphSchema: z.ZodType<SpaghettiGraph> =
  spaghettiGraphInputSchema.transform((graph) => {
    if (graph.ui === undefined) {
      return graph
    }
    return {
      ...graph,
      ui: {
        ...(graph.ui.nodes === undefined ? {} : { nodes: graph.ui.nodes }),
        ...(graph.ui.viewport === undefined ? {} : { viewport: graph.ui.viewport }),
      },
    }
  })

export const parseSpaghettiGraph = (input: unknown): SpaghettiGraph =>
  spaghettiGraphSchema.parse(input)

export { edgeEndpointSchema, nodeUISchema, portSpecSchema, portTypeSchema, unitSchema }
