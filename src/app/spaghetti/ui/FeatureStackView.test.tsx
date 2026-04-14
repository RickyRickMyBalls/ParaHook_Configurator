// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let FeatureStackView!: typeof import('./FeatureStackView').FeatureStackView
let useSpaghettiStore!: typeof import('../store/useSpaghettiStore').useSpaghettiStore
let useAppStore!: typeof import('../../store/useAppStore').useAppStore

describe('FeatureStackView interaction wiring', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    ;({ FeatureStackView } = await import('./FeatureStackView'))
    ;({ useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    ;({ useAppStore } = await import('../../store/useAppStore'))
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
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
      if (input !== null) {
        input.value = '28.7'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useAppStore.getState().isInteracting).toBe(true)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBe(true)

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()
  })
})
