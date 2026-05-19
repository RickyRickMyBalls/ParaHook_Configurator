import {
  cancelGraphCommandBeforeCommit,
  commitReadyGraphCommandPlan,
  createReadyGraphCommandCommitPlan,
  type CancelledGraphCommandSummary,
  type CommittedGraphCommandSummary,
  type GraphCommandEntryPoint,
} from './commandCommitContract'

export type GraphCommandNode = {
  nodeId: string
  type: string
}

export type SketchGraphCommandNode = GraphCommandNode

export type CreatedSketchGraphCommandNode = {
  nodeId: string
  nodeLabel: string
}

export type CreatedExtrudeGraphCommandNode = {
  nodeId: string
  nodeLabel: string
}

export type GraphCommandEdgeEndpoint = {
  nodeId: string
  portId: string
}

export type ExtrudeGraphCommandProfileSource = GraphCommandEdgeEndpoint

export type CreatedGraphCommandEdge = {
  edgeId: string
}

export type ExtrudeGraphCommandTarget =
  | { kind: 'create' }
  | { kind: 'reuse'; nodeId: string }

export type ExtrudeGraphCommandPlan = {
  graphDocumentId: string
  target: ExtrudeGraphCommandTarget
  selectedProfileSources: readonly ExtrudeGraphCommandProfileSource[]
  targetProfilePortId: 'ExtrusionProfile'
}

export type CommittedExtrudeGraphCommandPlan = {
  kind: 'committed'
  extrudeNodeId: string
  createdNode: CreatedExtrudeGraphCommandNode | null
  addedEdges: readonly CreatedGraphCommandEdge[]
}

export type CancelledExtrudeGraphCommandPlan = {
  kind: 'cancelled'
  reason: 'create-extrude-node-failed' | 'profile-wire-failed'
}

export type ExtrudeGraphCommandPlanCommitResult =
  | CommittedExtrudeGraphCommandPlan
  | CancelledExtrudeGraphCommandPlan

export type AuthorSketchGraphCommandRequest = {
  graphDocumentId: string | null
  selectedNodeId: string | null
  graphNodes: readonly GraphCommandNode[]
  entryPoint: GraphCommandEntryPoint
  forceNew?: boolean
  createSketchNode: (graphDocumentId: string) => CreatedSketchGraphCommandNode | null
}

export type AuthorSketchGraphCommandCommittedResult = {
  kind: 'committed'
  graphDocumentId: string
  sketchNodeId: string
  createdNode: CreatedSketchGraphCommandNode | null
  commitSummary: CommittedGraphCommandSummary
}

export type AuthorSketchGraphCommandCancelledResult = {
  kind: 'cancelled'
  reason: 'missing-graph-document' | 'create-sketch-node-failed'
  commitSummary: CancelledGraphCommandSummary
}

export type AuthorSketchGraphCommandResult =
  | AuthorSketchGraphCommandCommittedResult
  | AuthorSketchGraphCommandCancelledResult

export type AuthorExtrudeGraphCommandRequest = {
  graphDocumentId: string | null
  selectedNodeId: string | null
  graphNodes: readonly GraphCommandNode[]
  entryPoint: GraphCommandEntryPoint
  selectedProfileSources: readonly ExtrudeGraphCommandProfileSource[]
  commitExtrudeGraphPlan: (
    plan: ExtrudeGraphCommandPlan,
  ) => ExtrudeGraphCommandPlanCommitResult
}

export type AuthorExtrudeGraphCommandCommittedResult = {
  kind: 'committed'
  graphDocumentId: string
  extrudeNodeId: string
  createdNode: CreatedExtrudeGraphCommandNode | null
  addedEdgeIds: string[]
  selectedProfileSources: readonly ExtrudeGraphCommandProfileSource[]
  commitSummary: CommittedGraphCommandSummary
}

export type AuthorExtrudeGraphCommandCancelledResult = {
  kind: 'cancelled'
  reason:
    | 'missing-graph-document'
    | 'missing-profile-selection'
    | 'create-extrude-node-failed'
    | 'profile-wire-failed'
  commitSummary: CancelledGraphCommandSummary
}

export type AuthorExtrudeGraphCommandResult =
  | AuthorExtrudeGraphCommandCommittedResult
  | AuthorExtrudeGraphCommandCancelledResult

const isGeometrySketchNode = (
  node: SketchGraphCommandNode,
): boolean => node.type === 'Geometry/Sketch'

const isGeometryExtrudeNode = (node: GraphCommandNode): boolean =>
  node.type === 'Geometry/Extrude'

const findReusableSketchNode = ({
  forceNew,
  graphNodes,
  selectedNodeId,
}: Pick<
  AuthorSketchGraphCommandRequest,
  'forceNew' | 'graphNodes' | 'selectedNodeId'
>): SketchGraphCommandNode | null => {
  if (forceNew === true) {
    return null
  }

  const selectedSketchNode =
    selectedNodeId === null
      ? null
      : graphNodes.find(
          (node) => node.nodeId === selectedNodeId && isGeometrySketchNode(node),
        ) ?? null

  return selectedSketchNode ?? graphNodes.find(isGeometrySketchNode) ?? null
}

const findReusableExtrudeNode = ({
  graphNodes,
  selectedNodeId,
}: Pick<
  AuthorExtrudeGraphCommandRequest,
  'graphNodes' | 'selectedNodeId'
>): GraphCommandNode | null => {
  if (selectedNodeId === null) {
    return null
  }

  return graphNodes.find(
    (node) => node.nodeId === selectedNodeId && isGeometryExtrudeNode(node),
  ) ?? null
}

export const authorSketchGraphCommand = ({
  createSketchNode,
  entryPoint,
  forceNew = false,
  graphDocumentId,
  graphNodes,
  selectedNodeId,
}: AuthorSketchGraphCommandRequest): AuthorSketchGraphCommandResult => {
  if (graphDocumentId === null) {
    return {
      kind: 'cancelled',
      reason: 'missing-graph-document',
      commitSummary: cancelGraphCommandBeforeCommit({
        commandFamily: 'Sketch',
        entryPoint,
        reason: 'missing-graph-document',
      }),
    }
  }

  const reusableSketchNode = findReusableSketchNode({
    forceNew,
    graphNodes,
    selectedNodeId,
  })
  const createdNode =
    reusableSketchNode === null ? createSketchNode(graphDocumentId) : null
  const sketchNodeId = reusableSketchNode?.nodeId ?? createdNode?.nodeId ?? null

  if (sketchNodeId === null) {
    return {
      kind: 'cancelled',
      reason: 'create-sketch-node-failed',
      commitSummary: cancelGraphCommandBeforeCommit({
        commandFamily: 'Sketch',
        entryPoint,
        reason: 'create-sketch-node-failed',
      }),
    }
  }

  const commandCommitPlan = createReadyGraphCommandCommitPlan({
    commandFamily: 'Sketch',
    entryPoint,
    intendedMutations: [createdNode !== null ? 'create-node' : 'reuse-node'],
  })

  return {
    kind: 'committed',
    graphDocumentId,
    sketchNodeId,
    createdNode,
    commitSummary: commitReadyGraphCommandPlan(commandCommitPlan, {
      createdNodeIds: createdNode !== null ? [sketchNodeId] : [],
      reusedNodeIds: createdNode === null ? [sketchNodeId] : [],
    }),
  }
}

export const authorExtrudeGraphCommand = ({
  commitExtrudeGraphPlan,
  entryPoint,
  graphDocumentId,
  graphNodes,
  selectedNodeId,
  selectedProfileSources,
}: AuthorExtrudeGraphCommandRequest): AuthorExtrudeGraphCommandResult => {
  if (graphDocumentId === null) {
    return {
      kind: 'cancelled',
      reason: 'missing-graph-document',
      commitSummary: cancelGraphCommandBeforeCommit({
        commandFamily: 'Extrude',
        entryPoint,
        reason: 'missing-graph-document',
      }),
    }
  }

  if (selectedProfileSources.length === 0) {
    return {
      kind: 'cancelled',
      reason: 'missing-profile-selection',
      commitSummary: cancelGraphCommandBeforeCommit({
        commandFamily: 'Extrude',
        entryPoint,
        reason: 'missing-profile-selection',
      }),
    }
  }

  const reusableExtrudeNode = findReusableExtrudeNode({
    graphNodes,
    selectedNodeId,
  })

  const planResult = commitExtrudeGraphPlan({
    graphDocumentId,
    target:
      reusableExtrudeNode === null
        ? { kind: 'create' }
        : { kind: 'reuse', nodeId: reusableExtrudeNode.nodeId },
    selectedProfileSources: [...selectedProfileSources],
    targetProfilePortId: 'ExtrusionProfile',
  })

  if (planResult.kind === 'cancelled') {
    return {
      kind: 'cancelled',
      reason: planResult.reason,
      commitSummary: cancelGraphCommandBeforeCommit({
        commandFamily: 'Extrude',
        entryPoint,
        reason: planResult.reason,
      }),
    }
  }

  const addedEdgeIds = planResult.addedEdges.map((edge) => edge.edgeId)
  const commandCommitPlan = createReadyGraphCommandCommitPlan({
    commandFamily: 'Extrude',
    entryPoint,
    intendedMutations: [
      planResult.createdNode !== null ? 'create-node' : 'reuse-node',
      'add-wire',
    ],
  })

  return {
    kind: 'committed',
    graphDocumentId,
    extrudeNodeId: planResult.extrudeNodeId,
    createdNode: planResult.createdNode,
    addedEdgeIds,
    selectedProfileSources,
    commitSummary: commitReadyGraphCommandPlan(commandCommitPlan, {
      createdNodeIds:
        planResult.createdNode !== null ? [planResult.extrudeNodeId] : [],
      reusedNodeIds:
        planResult.createdNode === null ? [planResult.extrudeNodeId] : [],
      addedEdgeIds,
    }),
  }
}
