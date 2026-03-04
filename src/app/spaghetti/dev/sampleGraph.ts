import type { SpaghettiGraph } from '../schema/spaghettiTypes'

export const createValidBaseplateGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: {},
      ui: {
        x: 320,
        y: 140,
      },
    },
  ],
  edges: [],
})

export const createValidBaseplateToeHookGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: {},
      ui: {
        x: 220,
        y: 180,
      },
    },
    {
      nodeId: 'node-toehook-1',
      type: 'Part/ToeHook',
      params: {},
      ui: {
        x: 520,
        y: 180,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-baseplate-anchor-to-toehook-anchor',
      from: {
        nodeId: 'node-baseplate-1',
        portId: 'anchorSpline2',
      },
      to: {
        nodeId: 'node-toehook-1',
        portId: 'anchorSpline',
      },
    },
  ],
})

export const createValidBaseplateHeelKickGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: {},
      ui: {
        x: 220,
        y: 180,
      },
    },
    {
      nodeId: 'node-heelkick-1',
      type: 'Part/HeelKick',
      params: {},
      ui: {
        x: 520,
        y: 360,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-baseplate-anchor-to-heelkick-anchor',
      from: {
        nodeId: 'node-baseplate-1',
        portId: 'anchorSpline2',
      },
      to: {
        nodeId: 'node-heelkick-1',
        portId: 'anchorSpline',
      },
    },
  ],
})

export const createCycleGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-identity-spline2-a',
      type: 'Utility/IdentitySpline2',
      params: {},
      ui: {
        x: 200,
        y: 120,
      },
    },
    {
      nodeId: 'node-identity-spline2-b',
      type: 'Utility/IdentitySpline2',
      params: {},
      ui: {
        x: 520,
        y: 120,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-identity-a-to-b',
      from: {
        nodeId: 'node-identity-spline2-a',
        portId: 'out',
      },
      to: {
        nodeId: 'node-identity-spline2-b',
        portId: 'in',
      },
    },
    {
      edgeId: 'edge-identity-b-to-a',
      from: {
        nodeId: 'node-identity-spline2-b',
        portId: 'out',
      },
      to: {
        nodeId: 'node-identity-spline2-a',
        portId: 'in',
      },
    },
  ],
})

export const createSampleGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-primitive-number-1',
      type: 'Primitive/Number',
      params: {
        value: 42,
      },
      ui: {
        x: 120,
        y: 120,
      },
    },
    {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: {},
      ui: {
        x: 420,
        y: 120,
      },
    },
  ],
  edges: [],
})
