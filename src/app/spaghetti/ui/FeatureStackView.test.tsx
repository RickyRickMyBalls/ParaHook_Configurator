// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let FeatureStackView!: typeof import('./FeatureStackView').FeatureStackView
let useSpaghettiStore!: typeof import('../store/useSpaghettiStore').useSpaghettiStore
let useAppStore!: typeof import('../../store/useAppStore').useAppStore
let editHistoryStore!: typeof import('../../store/editHistoryStore').editHistoryStore

describe('FeatureStackView interaction wiring', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    ;({ FeatureStackView } = await import('./FeatureStackView'))
    ;({ useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    ;({ useAppStore } = await import('../../store/useAppStore'))
    ;({ editHistoryStore } = await import('../../store/editHistoryStore'))
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    editHistoryStore.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
  })

  it('drives both UI interaction and browser build interaction during feature-stack numeric edits', async () => {
    const partNode = {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: [
          {
            type: 'extrude' as const,
            featureId: 'feature-depth-1',
            inputs: {
              profileRef: null,
            },
            params: {
              depth: {
                kind: 'lit' as const,
                value: 10,
              },
            },
            outputs: {
              bodyId: 'body-1',
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      },
    }

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [partNode],
        edges: [],
      })
      root?.render(<FeatureStackView node={partNode} />)
    })

    const graphDocumentId = useSpaghettiStore.getState().activeGraphDocumentId
    const input = container?.querySelector('.SpaghettiValueBarInput') as HTMLInputElement | null

    expect(input).not.toBeNull()
    expect(graphDocumentId.length).toBeGreaterThan(0)
    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()

    await act(async () => {
      input?.focus()
    })

    expect(useAppStore.getState().isInteracting).toBe(true)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBe(true)

    await act(async () => {
      useSpaghettiStore.getState().setExtrudeDepth('node-baseplate-1', 'feature-depth-1', {
        kind: 'lit',
        value: 28.7,
      })
    })

    expect(useAppStore.getState().isInteracting).toBe(true)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change feature parameter',
      targetId: 'node-baseplate-1:feature-depth-1:depth',
      targetLabel: 'Extrude depth',
    })
  })

  it('routes sketch numeric edits through sketch history instead of feature-parameter history', async () => {
    const partNode = {
      nodeId: 'node-baseplate-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: [
          {
            type: 'sketch' as const,
            featureId: 'feature-sketch-1',
            plane: 'XY' as const,
            components: [
              {
                rowId: 'line-1',
                componentId: 'component-line-1',
                type: 'line' as const,
                a: {
                  kind: 'lit' as const,
                  x: 0,
                  y: 0,
                },
                b: {
                  kind: 'lit' as const,
                  x: 100,
                  y: 0,
                },
              },
            ],
            outputs: {
              profiles: [],
              diagnostics: [],
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      },
    }

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [partNode],
        edges: [],
      })
      root?.render(<FeatureStackView node={partNode} />)
    })

    const input = container?.querySelector('.SpaghettiValueBarInput') as HTMLInputElement | null

    expect(input).not.toBeNull()

    await act(async () => {
      input?.focus()
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])

    await act(async () => {
      useSpaghettiStore.getState().updateSketchComponentPoint(
        'node-baseplate-1',
        'feature-sketch-1',
        'line-1',
        'a',
        {
          kind: 'lit',
          x: 25,
          y: 0,
        },
      )
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change sketch component',
      source: {
        sourceId: 'graph-sketch-feature',
        sourceLabel: 'Graph Sketch Feature',
      },
      targetId: 'node-baseplate-1:feature-sketch-1:line-1:a:x',
      targetLabel: 'Sketch point X',
    })
  })
})
