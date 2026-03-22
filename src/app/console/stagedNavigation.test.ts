import { describe, expect, it } from 'vitest'
import {
  cancelConsoleStagedNavigationSession,
  createConsoleRootSession,
  createConsoleStagedNavigationContext,
  submitConsoleStagedNavigationToken,
} from './stagedNavigation'

describe('stagedNavigation', () => {
  it('creates a root staged session with Graph and Radio choices', () => {
    const result = createConsoleRootSession()

    expect(result.scopeId).toBe('root')
    expect(result.breadcrumb).toEqual(['Root'])
    expect(result.validChoices.map((choice) => choice.canonicalToken)).toEqual(['GRAPH', 'RADIO'])
  })

  it('advances from the explicit root session into graph and radio scopes', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const graphResult = submitConsoleStagedNavigationToken(createConsoleRootSession(), 'graph', context)
    const radioResult = submitConsoleStagedNavigationToken(createConsoleRootSession(), 'radio', context)

    expect(graphResult).toMatchObject({
      kind: 'advance',
      session: {
        scopeId: 'graphRoot',
      },
    })
    expect(radioResult).toMatchObject({
      kind: 'advance',
      session: {
        scopeId: 'radioRoot',
      },
    })
  })

  it('accepts both graph and g as the same staged root token', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const graphResult = submitConsoleStagedNavigationToken(null, 'graph', context)
    const aliasResult = submitConsoleStagedNavigationToken(null, 'g', context)

    expect(graphResult.kind).toBe('advance')
    expect(aliasResult.kind).toBe('advance')
    if (graphResult.kind !== 'advance' || aliasResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    expect(graphResult.breadcrumb).toEqual(['Select', 'Graph'])
    expect(aliasResult.breadcrumb).toEqual(['Select', 'Graph'])
    expect(graphResult.autoSelections).toEqual([])
    expect(aliasResult.autoSelections).toEqual([])
    expect(graphResult.validChoices.map((choice) => choice.canonicalToken)).toEqual(['1', '2', 'LIST'])
  })

  it('accepts both radio and r as the same staged root token', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const radioResult = submitConsoleStagedNavigationToken(null, 'radio', context)
    const aliasResult = submitConsoleStagedNavigationToken(null, 'r', context)

    expect(radioResult.kind).toBe('advance')
    expect(aliasResult.kind).toBe('advance')
    if (radioResult.kind !== 'advance' || aliasResult.kind !== 'advance') {
      throw new Error('Expected radio root token to advance')
    }

    expect(radioResult.session.scopeId).toBe('radioRoot')
    expect(aliasResult.session.scopeId).toBe('radioRoot')
    expect(radioResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'ON',
      'OFF',
      'URL',
      'SAMPLEBURSTTIME',
      'RANDOMIZESAMPLETIMES',
      'OPENTOOLBAR',
      'CLOSETOOLBAR',
    ])
  })

  it('accepts the cleaned radio aliases o, off, u, sb, rs, ot, and ct', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'r', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected radio root token to advance')
    }

    expect(submitConsoleStagedNavigationToken(rootResult.session, 'o', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.on',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'off', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.off',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'u', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.url',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'sb', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.sampleBurstTime',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'rs', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.randomizeSampleTimes',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'ot', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.openToolbar',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'ct', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.closeToolbar',
    })
  })

  it('auto-selects the only graph when graph root has one real entity choice', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const result = submitConsoleStagedNavigationToken(null, 'g', context)
    expect(result.kind).toBe('advance')
    if (result.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    expect(result.session.scopeId).toBe('graphSelected')
    expect(result.breadcrumb).toEqual(['Select', 'Graph', 'graph_[1]'])
    expect(result.autoSelections.map((choice) => choice.label)).toEqual(['graph_[1]'])
    expect(result.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'SKETCH',
      'EXTRUDE',
      'OUTPUT PREVIEW',
      'FOCUS NODE',
      'COLLAPSED',
      'ESSENTIALS',
      'EXPANDED',
      'REFERENCES',
      'OPEN',
      'BUILD',
      'BACK',
    ])
  })

  it('resolves numeric graph selections against deterministic visible order', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-7', name: 'Graph 7' },
      { graphDocumentId: 'graph-document-3', name: 'Graph 3' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '2', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected numeric graph token to advance')
    }

    expect(graphChoiceResult.breadcrumb).toEqual(['Select', 'Graph', 'graph_[2]'])
    expect(graphChoiceResult.selections.graphDocumentId).toBe('graph-document-3')
    expect(graphChoiceResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'SKETCH',
      'EXTRUDE',
      'OUTPUT PREVIEW',
      'FOCUS NODE',
      'COLLAPSED',
      'ESSENTIALS',
      'EXPANDED',
      'REFERENCES',
      'OPEN',
      'BUILD',
      'BACK',
    ])
  })

  it('auto-selects the only sketch after entering sketch scope', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const sketchResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'S', context)
    expect(sketchResult.kind).toBe('advance')
    if (sketchResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }

    expect(sketchResult.session.scopeId).toBe('graphSketchSelected')
    expect(sketchResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Sketch',
      'sketch_[1]',
    ])
    expect(sketchResult.selections.sketchNodeId).toBe('node-sketch-1')
    expect(sketchResult.autoSelections.map((choice) => choice.label)).toEqual(['sketch_[1]'])
    expect(sketchResult.validChoices.map((choice) => choice.label)).toEqual([
      'Sketch Plane',
      'Sketch Draw',
      'Delete',
      'Back',
    ])
  })

  it('keeps the current staged session when an invalid token is submitted', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected numeric graph token to advance')
    }

    const invalidResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'Q', context)
    expect(invalidResult.kind).toBe('invalid')
    if (invalidResult.kind !== 'invalid') {
      throw new Error('Expected invalid result')
    }

    expect(invalidResult.session?.breadcrumb).toEqual(['Select', 'Graph', 'graph_[1]'])
    expect(invalidResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'SKETCH',
      'EXTRUDE',
      'OUTPUT PREVIEW',
      'FOCUS NODE',
      'COLLAPSED',
      'ESSENTIALS',
      'EXPANDED',
      'REFERENCES',
      'OPEN',
      'BUILD',
      'BACK',
    ])
  })

  it('uses b to return to the parent graph scope and keeps build available by its full token', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const buildResult = submitConsoleStagedNavigationToken(
      graphChoiceResult.session,
      'build',
      context,
    )
    expect(buildResult.kind).toBe('execute')
    if (buildResult.kind !== 'execute') {
      throw new Error('Expected build to stay available in graph scope')
    }
    expect(buildResult.actionId).toBe('graph.build')

    const backResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected b to return to graph root')
    }

    expect(backResult.session.scopeId).toBe('graphRoot')
    expect(backResult.breadcrumb).toEqual(['Select', 'Graph'])
  })

  it('uses b to return directly to graph scope from a selected sketch node', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }, { nodeId: 'node-sketch-2' }],
      },
      {
        graphDocumentId: 'graph-document-2',
        name: 'Graph 2',
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const sketchListResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'S', context)
    expect(sketchListResult.kind).toBe('advance')
    if (sketchListResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }

    const selectedSketchResult = submitConsoleStagedNavigationToken(sketchListResult.session, '1', context)
    expect(selectedSketchResult.kind).toBe('advance')
    if (selectedSketchResult.kind !== 'advance') {
      throw new Error('Expected sketch selection to advance')
    }

    const backToGraph = submitConsoleStagedNavigationToken(selectedSketchResult.session, 'b', context)
    expect(backToGraph.kind).toBe('advance')
    if (backToGraph.kind !== 'advance') {
      throw new Error('Expected b to go back to graph selected')
    }
    expect(backToGraph.session.scopeId).toBe('graphSelected')
    expect(backToGraph.breadcrumb).toEqual(['Select', 'Graph', 'graph_[1]'])
  })

  it('auto-selects the only extrude after entering extrude scope', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        extrudeOptions: [{ nodeId: 'node-extrude-1' }],
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const extrudeResult = submitConsoleStagedNavigationToken(rootResult.session, 'E', context)
    expect(extrudeResult.kind).toBe('advance')
    if (extrudeResult.kind !== 'advance') {
      throw new Error('Expected extrude token to advance')
    }

    expect(extrudeResult.session.scopeId).toBe('graphExtrudeSelected')
    expect(extrudeResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Extrude',
      'extrude_[1]',
    ])
    expect(extrudeResult.selections.selectedNodeId).toBe('node-extrude-1')
    expect(extrudeResult.selections.sketchNodeId).toBeNull()
    expect(extrudeResult.validChoices.map((choice) => choice.label)).toEqual(['Delete', 'Back'])
  })

  it('lists all nodes from focus node scope and can focus a generic node', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        allNodeOptions: [
          { nodeId: 'node-part-1', label: 'node_[1] Cube' },
          { nodeId: 'node-sketch-1', label: 'node_[2] Sketch' },
        ],
        sketchOptions: [{ nodeId: 'node-sketch-1', label: 'sketch_[1]' }],
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const focusNodeResult = submitConsoleStagedNavigationToken(rootResult.session, 'FN', context)
    expect(focusNodeResult.kind).toBe('advance')
    if (focusNodeResult.kind !== 'advance') {
      throw new Error('Expected focus node token to advance')
    }

    expect(focusNodeResult.session.scopeId).toBe('graphNodeList')
    expect(focusNodeResult.validChoices.map((choice) => choice.label)).toEqual([
      'node_[1] Cube',
      'node_[2] Sketch',
      'Back',
    ])

    const selectedNodeResult = submitConsoleStagedNavigationToken(
      focusNodeResult.session,
      '1',
      context,
    )
    expect(selectedNodeResult.kind).toBe('advance')
    if (selectedNodeResult.kind !== 'advance') {
      throw new Error('Expected focus node selection to advance')
    }

    expect(selectedNodeResult.session.scopeId).toBe('graphNodeSelected')
    expect(selectedNodeResult.selections.selectedNodeId).toBe('node-part-1')
    expect(selectedNodeResult.validChoices.map((choice) => choice.label)).toEqual([
      'Delete',
      'Back',
    ])
  })

  it('returns execute metadata for graph editor modes, sketch plane, sketch draw, and graph action nodes', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const buildResult = submitConsoleStagedNavigationToken(
      graphChoiceResult.session,
      'build',
      context,
    )
    expect(buildResult.kind).toBe('execute')
    if (buildResult.kind !== 'execute') {
      throw new Error('Expected build token to execute')
    }
    expect(buildResult.actionId).toBe('graph.build')

    const essentialsResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'ES', context)
    expect(essentialsResult.kind).toBe('execute')
    if (essentialsResult.kind !== 'execute') {
      throw new Error('Expected essentials token to execute')
    }
    expect(essentialsResult.actionId).toBe('graph.editor.essentials')

    const sketchResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'S', context)
    expect(sketchResult.kind).toBe('advance')
    if (sketchResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }

    expect(sketchResult.validChoices.map((choice) => choice.label)).toEqual([
      'Sketch Plane',
      'Sketch Draw',
      'Delete',
      'Back',
    ])

    const planeResult = submitConsoleStagedNavigationToken(sketchResult.session, 'SP', context)
    expect(planeResult.kind).toBe('execute')
    if (planeResult.kind !== 'execute') {
      throw new Error('Expected sketch plane token to execute')
    }
    expect(planeResult.actionId).toBe('sketch.plane')
    expect(planeResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Sketch',
      'sketch_[1]',
      'Sketch Plane',
    ])

    const drawResult = submitConsoleStagedNavigationToken(sketchResult.session, 'SD', context)
    expect(drawResult.kind).toBe('execute')
    if (drawResult.kind !== 'execute') {
      throw new Error('Expected sketch draw token to execute')
    }
    expect(drawResult.actionId).toBe('sketch.draw')
    expect(drawResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Sketch',
      'sketch_[1]',
      'Sketch Draw',
    ])
    expect(drawResult.selections.graphDocumentId).toBe('graph-document-1')
    expect(drawResult.selections.sketchNodeId).toBe('node-sketch-1')
  })

  it('supports explicit cancellation/reset of the staged session', () => {
    const cancelledResult = cancelConsoleStagedNavigationSession()

    expect(cancelledResult.kind).toBe('cancelled')
    expect(cancelledResult.session).toBeNull()
    expect(cancelledResult.breadcrumb).toEqual([])
    expect(cancelledResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'GRAPH',
      'RADIO',
    ])
  })

  it('exposes delete as a node-local action for selected node scopes', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        extrudeOptions: [{ nodeId: 'node-extrude-1' }],
        outputPreviewOptions: [{ nodeId: 'node-output-1' }],
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'g', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const sketchResult = submitConsoleStagedNavigationToken(rootResult.session, 's', context)
    expect(sketchResult.kind).toBe('advance')
    if (sketchResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }
    const sketchDeleteResult = submitConsoleStagedNavigationToken(sketchResult.session, 'd', context)
    expect(sketchDeleteResult.kind).toBe('execute')
    if (sketchDeleteResult.kind !== 'execute') {
      throw new Error('Expected sketch delete token to execute')
    }
    expect(sketchDeleteResult.actionId).toBe('node.delete')

    const extrudeResult = submitConsoleStagedNavigationToken(rootResult.session, 'e', context)
    expect(extrudeResult.kind).toBe('advance')
    if (extrudeResult.kind !== 'advance') {
      throw new Error('Expected extrude token to advance')
    }
    const extrudeDeleteResult = submitConsoleStagedNavigationToken(extrudeResult.session, 'd', context)
    expect(extrudeDeleteResult.kind).toBe('execute')
    if (extrudeDeleteResult.kind !== 'execute') {
      throw new Error('Expected extrude delete token to execute')
    }
    expect(extrudeDeleteResult.actionId).toBe('node.delete')
  })
})
