import {
  getNodeDef,
  readGeometryExtrudeBodyGenerationModeFromParams,
  type NodeDefinition,
} from '../registry/nodeRegistry'
import type {
  OutputPreviewParams,
  PortSpec,
  SpaghettiNode,
} from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import {
  listDriverVirtualInputPorts,
  listDriverVirtualOutputPorts,
} from './driverVirtualPorts'
import { listExtrudeBodyMemberOutputPorts } from './extrudeBodyVirtualPorts'
import { listFeatureVirtualInputPorts } from './featureVirtualPorts'
import { listSketchProfileMemberOutputPorts } from './sketchProfileVirtualPorts'

const findPortById = (ports: readonly PortSpec[], portId: string): PortSpec | undefined =>
  ports.find((port) => port.portId === portId)

const listOutputPreviewSlotInputPorts = (node: SpaghettiNode): PortSpec[] => {
  if (node.type !== OUTPUT_PREVIEW_NODE_TYPE) {
    return []
  }
  const params = node.params as OutputPreviewParams
  if (!Array.isArray(params.slots)) {
    return []
  }
  return params.slots.map((slot) => ({
    // "solid" is an ID contract token for OutputPreview slots.
    // Type compatibility is enforced by kind (`toeLoft`) in validators/resolvers.
    portId: `in:solid:${slot.slotId}`,
    label: slot.slotId,
    type: { kind: 'toeLoft' },
    // Optional means the slot may be unconnected without diagnostics.
    // It does not relax type/path validation for actual connections.
    optional: true,
    maxConnectionsIn: 1,
  }))
}

const listNodeDeclaredOutputPorts = (
  node: SpaghettiNode,
  nodeDef?: NodeDefinition | undefined,
): PortSpec[] => {
  const declaredOutputs = nodeDef?.outputs ?? getNodeDef(node.type)?.outputs ?? []
  if (node.type !== 'Geometry/Extrude') {
    return declaredOutputs
  }
  return declaredOutputs.map((port) => {
    if (port.portId !== 'SolidBody') {
      return port
    }
    const bodyGenerationMode = readGeometryExtrudeBodyGenerationModeFromParams(node.params)
    return bodyGenerationMode === 'NewObjects'
      ? {
          ...port,
          label: 'SolidBodies',
          type: { kind: 'solidBodies' },
        }
      : {
          ...port,
          label: 'SolidBody',
          type: { kind: 'solidBody' },
        }
  })
}

export const listEffectiveInputPorts = (
  node: SpaghettiNode,
  nodeDef?: NodeDefinition | undefined,
): PortSpec[] => {
  const resolvedNodeDef = nodeDef ?? getNodeDef(node.type)
  const declaredInputs = resolvedNodeDef?.inputs ?? []
  const outputPreviewSlotInputs = listOutputPreviewSlotInputPorts(node)
  const featureVirtualInputs = listFeatureVirtualInputPorts(node)
  const driverVirtualInputs = listDriverVirtualInputPorts(node, resolvedNodeDef)
  return [
    ...declaredInputs,
    ...outputPreviewSlotInputs,
    ...featureVirtualInputs,
    ...driverVirtualInputs,
  ]
}

export const listEffectiveOutputPorts = (
  node: SpaghettiNode,
  nodeDef?: NodeDefinition | undefined,
  graph?: import('../schema/spaghettiTypes').SpaghettiGraph | undefined,
): PortSpec[] => {
  const resolvedNodeDef = nodeDef ?? getNodeDef(node.type)
  const declaredOutputs = listNodeDeclaredOutputPorts(node, resolvedNodeDef)
  const virtualDriverOutputs = listDriverVirtualOutputPorts(node, resolvedNodeDef)
  const sketchProfileMemberOutputs = listSketchProfileMemberOutputPorts(node)
  const extrudeBodyMemberOutputs = listExtrudeBodyMemberOutputPorts(graph, node)
  return [
    ...declaredOutputs,
    ...virtualDriverOutputs,
    ...sketchProfileMemberOutputs,
    ...extrudeBodyMemberOutputs,
  ]
}

export const resolveEffectiveInputPort = (
  node: SpaghettiNode,
  portId: string,
  nodeDef?: NodeDefinition | undefined,
): PortSpec | undefined => {
  const declared = findPortById(nodeDef?.inputs ?? getNodeDef(node.type)?.inputs ?? [], portId)
  if (declared !== undefined) {
    return declared
  }
  const outputPreviewSlotPort = findPortById(listOutputPreviewSlotInputPorts(node), portId)
  if (outputPreviewSlotPort !== undefined) {
    return outputPreviewSlotPort
  }
  const featureVirtual = findPortById(listFeatureVirtualInputPorts(node), portId)
  if (featureVirtual !== undefined) {
    return featureVirtual
  }
  return findPortById(listDriverVirtualInputPorts(node, nodeDef), portId)
}

export const resolveEffectiveOutputPort = (
  node: SpaghettiNode,
  portId: string,
  nodeDef?: NodeDefinition | undefined,
  graph?: import('../schema/spaghettiTypes').SpaghettiGraph | undefined,
): PortSpec | undefined => {
  const declared = findPortById(listNodeDeclaredOutputPorts(node, nodeDef), portId)
  if (declared !== undefined) {
    return declared
  }
  const driverVirtual = findPortById(listDriverVirtualOutputPorts(node, nodeDef), portId)
  if (driverVirtual !== undefined) {
    return driverVirtual
  }
  const sketchProfileMember = findPortById(listSketchProfileMemberOutputPorts(node), portId)
  if (sketchProfileMember !== undefined) {
    return sketchProfileMember
  }
  return findPortById(listExtrudeBodyMemberOutputPorts(graph, node), portId)
}
