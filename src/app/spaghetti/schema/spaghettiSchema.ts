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

const partSlotsSchema = z
  .object({
    drivers: z.literal(true),
    inputs: z.literal(true),
    featureStack: z.literal(true),
    outputs: z.literal(true),
  })
  .strict()

const spaghettiNodeSchema = z
  .object({
    nodeId: z.string().min(1),
    type: z.string().min(1),
    params: z.record(z.string(), z.unknown()),
    // Keep parse/load non-fatal for malformed legacy partSlots payloads.
    // Canonical partSlots shape is enforced by app-level normalization/validation.
    partSlots: z.unknown().optional(),
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
    const normalizedNodes: SpaghettiGraph['nodes'] = graph.nodes.map((node) => ({
      nodeId: node.nodeId,
      type: node.type,
      params: node.params,
      ...(node.partSlots === undefined
        ? {}
        : {
            // Preserve legacy malformed payloads through parse so deterministic
            // repair/warning logic can run in app normalization/validation.
            partSlots: node.partSlots as SpaghettiGraph['nodes'][number]['partSlots'],
          }),
      ...(node.ui === undefined ? {} : { ui: node.ui }),
    }))

    if (graph.ui === undefined) {
      return {
        ...graph,
        nodes: normalizedNodes,
      }
    }
    return {
      ...graph,
      nodes: normalizedNodes,
      ui: {
        ...(graph.ui.nodes === undefined ? {} : { nodes: graph.ui.nodes }),
        ...(graph.ui.viewport === undefined ? {} : { viewport: graph.ui.viewport }),
      },
    }
  })

export const parseSpaghettiGraph = (input: unknown): SpaghettiGraph =>
  spaghettiGraphSchema.parse(input)

export {
  edgeEndpointSchema,
  nodeUISchema,
  partSlotsSchema,
  portSpecSchema,
  portTypeSchema,
  unitSchema,
}
