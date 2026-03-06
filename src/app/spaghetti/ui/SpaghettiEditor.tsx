import { useEffect, useMemo, useState } from 'react'
import { getDefaultNodeParams, type NodeTypeId } from '../registry/nodeRegistry'
import { addNode as addNodeCommand } from '../graphCommands'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from '../store/useSpaghettiStore'
import { CollapsedEditor } from './CollapsedEditor'
import { ExpandedEditor } from './ExpandedEditor'

type SpaghettiEditorViewMode = 'expanded' | 'collapsed'
type PartNodeType = Extract<NodeTypeId, 'Part/Baseplate' | 'Part/ToeHook' | 'Part/HeelKick'>

const compareNodes = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const partTypeOptions: Array<{ value: PartNodeType; label: string }> = [
  { value: 'Part/Baseplate', label: 'Baseplate' },
  { value: 'Part/ToeHook', label: 'Toe Hook' },
  { value: 'Part/HeelKick', label: 'Heel Kick' },
]

const typeLegend: Array<{ type: string; colorToken: string; className: string }> = [
  { type: 'number', colorToken: '#ffffff', className: 'SpaghettiTypeSwatch--number' },
  { type: 'boolean', colorToken: '#f6d365', className: 'SpaghettiTypeSwatch--boolean' },
  { type: 'vec2', colorToken: '#38bdf8', className: 'SpaghettiTypeSwatch--vec2' },
  { type: 'vec3', colorToken: '#22d3ee', className: 'SpaghettiTypeSwatch--vec3' },
  { type: 'spline2', colorToken: '#ff4e4e', className: 'SpaghettiTypeSwatch--spline2' },
  { type: 'spline3', colorToken: '#fb7185', className: 'SpaghettiTypeSwatch--spline3' },
  { type: 'profileLoop', colorToken: '#34d399', className: 'SpaghettiTypeSwatch--profileLoop' },
  { type: 'stations', colorToken: '#a78bfa', className: 'SpaghettiTypeSwatch--stations' },
  { type: 'railMath', colorToken: '#9ca3af', className: 'SpaghettiTypeSwatch--railMath' },
  { type: 'toeLoft', colorToken: '#cbd5e1', className: 'SpaghettiTypeSwatch--toeLoft' },
]

let fallbackNodeCounter = 0

const createNodeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `node-${crypto.randomUUID()}`
  }
  fallbackNodeCounter += 1
  return `node-fallback-${fallbackNodeCounter}`
}

type SpaghettiEditorProps = {
  showHeaderControls?: boolean
}

export function SpaghettiEditor({ showHeaderControls = true }: SpaghettiEditorProps) {
  const graph = useSpaghettiStore((state) => state.graph)
  const selectedNodeId = useSpaghettiStore((state) => state.selectedNodeId)
  const applyGraphCommand = useSpaghettiStore((state) => state.applyGraphCommand)
  const setSelectedNodeId = useSpaghettiStore((state) => state.setSelectedNodeId)
  const setUiMessage = useSpaghettiStore((state) => state.setUiMessage)

  const [viewMode, setViewMode] = useState<SpaghettiEditorViewMode>('expanded')
  const [focusNodeId, setFocusNodeId] = useState<string | null>(selectedNodeId)
  const [focusPartKey] = useState<string | null>(null)
  const [newPartType, setNewPartType] = useState<PartNodeType>('Part/Baseplate')

  const sortedNodes = useMemo(() => [...graph.nodes].sort(compareNodes), [graph.nodes])
  const availableNodeIds = useMemo(
    () => new Set(sortedNodes.map((node) => node.nodeId)),
    [sortedNodes],
  )

  useEffect(() => {
    if (selectedNodeId !== null && availableNodeIds.has(selectedNodeId)) {
      setFocusNodeId(selectedNodeId)
    }
  }, [availableNodeIds, selectedNodeId])

  useEffect(() => {
    if (focusNodeId !== null && availableNodeIds.has(focusNodeId)) {
      return
    }
    setFocusNodeId(sortedNodes[0]?.nodeId ?? null)
  }, [availableNodeIds, focusNodeId, sortedNodes])

  const handleAddPartNode = () => {
    const nodeId = createNodeId()
    applyGraphCommand(
      addNodeCommand({
        node: {
          nodeId,
          type: newPartType,
          params: getDefaultNodeParams(newPartType),
        },
      }),
    )
    setSelectedNodeId(nodeId)
    setFocusNodeId(nodeId)
    setUiMessage({
      level: 'info',
      text: `Added ${newPartType} node.`,
    })
  }

  return (
    <div className="SpaghettiEditorRoot">
      <div className="SpaghettiEditorShell">
        <div className="SpaghettiEditorBody">
          {showHeaderControls ? (
            <div
              className={`SpaghettiEditorToolbarScroll ${
                viewMode === 'expanded' ? 'SpaghettiEditorToolbarScroll--expanded' : ''
              }`}
            >
              <div className="SpaghettiEditorHeader">
                <div className="V15Wrap">
                  <button
                    type="button"
                    className={`SpaghettiEditorModeButton ${
                      viewMode === 'expanded' ? 'SpaghettiEditorModeButton--active' : ''
                    }`}
                    onClick={() => setViewMode('expanded')}
                  >
                    Expanded
                  </button>
                  <button
                    type="button"
                    className={`SpaghettiEditorModeButton ${
                      viewMode === 'collapsed' ? 'SpaghettiEditorModeButton--active' : ''
                    }`}
                    onClick={() => setViewMode('collapsed')}
                  >
                    Collapsed
                  </button>
                </div>

                <div className="SpaghettiTypeLegend">
                  {typeLegend.map((item) => (
                    <div key={item.type} className="SpaghettiTypeLegendItem">
                      <span className={`SpaghettiTypeSwatch ${item.className}`} />
                      <span>{item.type}</span>
                      <span className="SpaghettiTypeLegendHex">{item.colorToken}</span>
                    </div>
                  ))}
                </div>

                <label className="SpaghettiEditorFocusField">
                  <span>Focus Node</span>
                  <select
                    value={focusNodeId ?? ''}
                    onChange={(event) => {
                      const next = event.target.value.trim()
                      setFocusNodeId(next.length > 0 ? next : null)
                    }}
                  >
                    {sortedNodes.length === 0 ? (
                      <option value="">No nodes</option>
                    ) : (
                      sortedNodes.map((node) => (
                        <option key={node.nodeId} value={node.nodeId}>
                          {node.nodeId}
                        </option>
                      ))
                    )}
                  </select>
                </label>
              </div>

              <div className="SpaghettiEditorAddRow">
                <label className="SpaghettiEditorFocusField">
                  <span>New Part Node</span>
                  <select
                    value={newPartType}
                    onChange={(event) => {
                      setNewPartType(event.target.value as PartNodeType)
                    }}
                  >
                    {partTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={handleAddPartNode}>
                  Add Part Node
                </button>
              </div>
            </div>
          ) : null}

          {viewMode === 'expanded' ? (
            <ExpandedEditor />
          ) : (
            <CollapsedEditor focusNodeId={focusNodeId} />
          )}

          {focusPartKey !== null ? (
            <div className="V15Meta">Focused part: {focusPartKey}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
