import { describe, expect, it } from 'vitest'
import type { SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { buildExtrudeBodyMemberPortId } from './extrudeBodyVirtualPorts'
import {
  listEffectiveInputPorts,
  listEffectiveOutputPorts,
  resolveEffectiveInputPort,
  resolveEffectiveOutputPort,
} from './effectivePorts'

const outputPreviewNode = (slotIds: string[]): SpaghettiNode => ({
  nodeId: 'n-output-preview',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: slotIds.map((slotId) => ({ slotId })),
    nextSlotIndex: slotIds.length + 1,
  },
})

describe('effectivePorts OutputPreview dynamic slots', () => {
  it('emits one deterministic input port per slot in params.slots order', () => {
    const node = outputPreviewNode(['s001', 's002'])
    const ports = listEffectiveInputPorts(node)

    expect(ports.map((port) => port.portId)).toEqual([
      'in:solid:s001',
      'in:solid:s002',
    ])
  })

  it('emits toeLoft-typed optional inputs with maxConnectionsIn=1', () => {
    const node = outputPreviewNode(['s001'])
    const port = resolveEffectiveInputPort(node, 'in:solid:s001')

    expect(port).toBeDefined()
    expect(port?.label).toBe('s001')
    expect(port?.type).toEqual({ kind: 'toeLoft' })
    expect(port?.optional).toBe(true)
    expect(port?.maxConnectionsIn).toBe(1)
  })

  it('returns identical ordering and content across repeated resolver calls', () => {
    const node = outputPreviewNode(['s001', 's002'])

    const first = listEffectiveInputPorts(node)
    const second = listEffectiveInputPorts(node)

    expect(second).toEqual(first)
  })
})

describe('effectivePorts driver virtual ports', () => {
  const baseplateNode: SpaghettiNode = {
    nodeId: 'n-baseplate',
    type: 'Part/Baseplate',
    params: {},
  }

  it('emits canonical input/output driver ports for numeric drivers', () => {
    const inputPorts = listEffectiveInputPorts(baseplateNode)
    const outputPorts = listEffectiveOutputPorts(baseplateNode)

    expect(inputPorts.map((port) => port.portId)).toEqual(
      expect.arrayContaining(['in:drv:widthMm', 'in:drv:lengthMm']),
    )
    expect(outputPorts.map((port) => port.portId)).toEqual(
      expect.arrayContaining(['out:drv:widthMm', 'out:drv:lengthMm']),
    )
  })

  it('keeps canonical driver type/unit exactly aligned with wireOutputType', () => {
    const inputPorts = listEffectiveInputPorts(baseplateNode).filter((port) =>
      port.portId.startsWith('in:drv:'),
    )
    const outputPorts = listEffectiveOutputPorts(baseplateNode).filter((port) =>
      port.portId.startsWith('out:drv:'),
    )

    expect(inputPorts.every((port) => port.type.kind === 'number')).toBe(true)
    expect(inputPorts.every((port) => port.type.unit === 'mm')).toBe(true)
    expect(outputPorts.every((port) => port.type.kind === 'number')).toBe(true)
    expect(outputPorts.every((port) => port.type.unit === 'mm')).toBe(true)
  })

  it('keeps canonical driver port ordering deterministic by driver definition order', () => {
    const inputCanonical = listEffectiveInputPorts(baseplateNode)
      .filter((port) => port.portId.startsWith('in:drv:'))
      .map((port) => port.portId)
    const outputCanonical = listEffectiveOutputPorts(baseplateNode)
      .filter((port) => port.portId.startsWith('out:drv:'))
      .map((port) => port.portId)

    expect(inputCanonical).toEqual(['in:drv:widthMm', 'in:drv:lengthMm'])
    expect(outputCanonical).toEqual(['out:drv:widthMm', 'out:drv:lengthMm'])
  })

  it('marks canonical driver input ports optional=true with maxConnectionsIn=1', () => {
    const inputCanonical = listEffectiveInputPorts(baseplateNode).filter((port) =>
      port.portId.startsWith('in:drv:'),
    )

    expect(inputCanonical).toHaveLength(2)
    expect(inputCanonical.every((port) => port.optional === true)).toBe(true)
    expect(inputCanonical.every((port) => port.maxConnectionsIn === 1)).toBe(true)
  })
})

describe('effectivePorts Geometry/Extrude dynamic output contract', () => {
  const extrudeNode = (bodyGenerationMode?: 'Combine' | 'NewObjects'): SpaghettiNode => ({
    nodeId: 'n-extrude',
    type: 'Geometry/Extrude',
    params: bodyGenerationMode === undefined ? {} : { bodyGenerationMode },
  })

  it('defaults the effective output to aggregate SolidBodies in NewObjects mode', () => {
    const outputPort = resolveEffectiveOutputPort(extrudeNode(), 'SolidBody')

    expect(outputPort).toEqual({
      portId: 'SolidBody',
      label: 'SolidBodies',
      type: { kind: 'solidBodies' },
    })
  })

  it('narrows the effective output to SolidBody in Combine mode', () => {
    const outputPort = resolveEffectiveOutputPort(
      extrudeNode('Combine'),
      'SolidBody',
    )

    expect(outputPort).toEqual({
      portId: 'SolidBody',
      label: 'SolidBody',
      type: { kind: 'solidBody' },
    })
  })

  it('keeps listEffectiveOutputPorts deterministic across repeated calls', () => {
    const node = extrudeNode('NewObjects')

    expect(listEffectiveOutputPorts(node)).toEqual(listEffectiveOutputPorts(node))
  })

  it('emits member SolidBody output ports for NewObjects when aggregate SketchProfiles is wired', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        { nodeId: 'n-sketch', type: 'Geometry/Sketch', params: {} },
        extrudeNode('NewObjects'),
      ],
      edges: [
        {
          edgeId: 'e-sketchprofile-a-to-extrude',
          from: { nodeId: 'n-sketch', portId: 'SketchProfile:profile-1' },
          to: { nodeId: 'n-extrude', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'e-sketchprofile-b-to-extrude',
          from: { nodeId: 'n-sketch', portId: 'SketchProfile:profile-2' },
          to: { nodeId: 'n-extrude', portId: 'ExtrusionProfile' },
        },
      ],
    }

    const ports = listEffectiveOutputPorts(extrudeNode('NewObjects'), undefined, graph)

    expect(ports.map((port) => port.portId)).toEqual(
      expect.arrayContaining([
        'SolidBody',
        buildExtrudeBodyMemberPortId(0),
        buildExtrudeBodyMemberPortId(1),
      ]),
    )
  })
})
