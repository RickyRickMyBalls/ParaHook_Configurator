import { useMemo } from 'react'
import { getNodeDef } from '../registry/nodeRegistry'
import type { SpaghettiEdge, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from '../store/useSpaghettiStore'

type CollapsedEditorProps = {
  focusNodeId: string | null
}

const compareByNodeId = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const compareByEdgeId = (a: SpaghettiEdge, b: SpaghettiEdge): number =>
  a.edgeId.localeCompare(b.edgeId)

const insertSorted = (queue: string[], value: string): void => {
  queue.push(value)
  queue.sort((a, b) => a.localeCompare(b))
}

export const getUpstreamTopoNodeIds = (
  graph: SpaghettiGraph,
  focusNodeId: string,
): string[] => {
  const nodeIds = new Set(graph.nodes.map((node) => node.nodeId))
  if (!nodeIds.has(focusNodeId)) {
    return []
  }

  const upstreamSet = new Set<string>()
  const exploreQueue: string[] = [focusNodeId]
  const sortedEdges = [...graph.edges].sort(compareByEdgeId)

  while (exploreQueue.length > 0) {
    const current = exploreQueue.shift()
    if (current === undefined) {
      break
    }

    for (const edge of sortedEdges) {
      if (edge.to.nodeId !== current) {
        continue
      }
      const upstreamNodeId = edge.from.nodeId
      if (!nodeIds.has(upstreamNodeId) || upstreamNodeId === focusNodeId) {
        continue
      }
      if (upstreamSet.has(upstreamNodeId)) {
        continue
      }
      upstreamSet.add(upstreamNodeId)
      exploreQueue.push(upstreamNodeId)
    }
  }

  const upstreamNodeIds = [...upstreamSet].sort((a, b) => a.localeCompare(b))
  if (upstreamNodeIds.length === 0) {
    return upstreamNodeIds
  }

  const indegree = new Map<string, number>()
  const adjacency = new Map<string, Set<string>>()
  for (const nodeId of upstreamNodeIds) {
    indegree.set(nodeId, 0)
    adjacency.set(nodeId, new Set<string>())
  }

  for (const edge of sortedEdges) {
    if (!upstreamSet.has(edge.from.nodeId) || !upstreamSet.has(edge.to.nodeId)) {
      continue
    }
    const neighbors = adjacency.get(edge.from.nodeId)
    if (neighbors === undefined || neighbors.has(edge.to.nodeId)) {
      continue
    }
    neighbors.add(edge.to.nodeId)
    indegree.set(edge.to.nodeId, (indegree.get(edge.to.nodeId) ?? 0) + 1)
  }

  const ready: string[] = []
  for (const nodeId of upstreamNodeIds) {
    if ((indegree.get(nodeId) ?? 0) === 0) {
      insertSorted(ready, nodeId)
    }
  }

  const topo: string[] = []
  while (ready.length > 0) {
    const nodeId = ready.shift()
    if (nodeId === undefined) {
      break
    }
    topo.push(nodeId)
    const neighbors = adjacency.get(nodeId)
    if (neighbors === undefined) {
      continue
    }
    for (const nextId of [...neighbors].sort((a, b) => a.localeCompare(b))) {
      const nextIndegree = (indegree.get(nextId) ?? 0) - 1
      indegree.set(nextId, nextIndegree)
      if (nextIndegree === 0) {
        insertSorted(ready, nextId)
      }
    }
  }

  if (topo.length !== upstreamNodeIds.length) {
    const seen = new Set(topo)
    const unresolved = upstreamNodeIds
      .filter((nodeId) => !seen.has(nodeId))
      .sort((a, b) => a.localeCompare(b))
    return [...topo, ...unresolved]
  }

  return topo
}

export function CollapsedEditor({ focusNodeId }: CollapsedEditorProps) {
  const graph = useSpaghettiStore((state) => state.graph)

  const sortedNodes = useMemo(() => [...graph.nodes].sort(compareByNodeId), [graph.nodes])
  const nodesById = useMemo(() => {
    const map = new Map<string, SpaghettiNode>()
    for (const node of sortedNodes) {
      map.set(node.nodeId, node)
    }
    return map
  }, [sortedNodes])

  const focusNode = focusNodeId === null ? undefined : nodesById.get(focusNodeId)
  const upstreamNodeIds = useMemo(() => {
    if (focusNodeId === null) {
      return []
    }
    return getUpstreamTopoNodeIds(graph, focusNodeId)
  }, [focusNodeId, graph])

  return (
    <div className="SpaghettiCollapsedRoot">
      <div className="SpaghettiCollapsedHeader">
        <strong>Focused Node</strong>
      </div>
      {focusNode === undefined ? (
        <div className="V15Meta">Select a focus node to inspect upstream flow.</div>
      ) : (
        <div className="SpaghettiCollapsedFocusCard">
          <div className="SpaghettiCollapsedFocusLabel">
            {getNodeDef(focusNode.type)?.label ?? focusNode.type}
          </div>
          <div className="V15Meta">{focusNode.nodeId}</div>
        </div>
      )}

      <div className="SpaghettiCollapsedHeader">
        <strong>Upstream (Topo Ordered)</strong>
      </div>
      {focusNode === undefined ? null : upstreamNodeIds.length === 0 ? (
        <div className="V15Meta">No upstream nodes.</div>
      ) : (
        <div className="ItemList">
          {upstreamNodeIds.map((nodeId) => {
            const node = nodesById.get(nodeId)
            const label = node === undefined ? nodeId : getNodeDef(node.type)?.label ?? node.type
            return (
              <div key={nodeId} className="ListRow">
                <span className="ListRowName">{label}</span>
                <span className="TypeChip">{nodeId}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
