// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let currentSpaghettiState: any

vi.mock('../store/useSpaghettiStore', () => ({
  useSpaghettiStore: (selector: (state: any) => unknown) => selector(currentSpaghettiState),
  selectGraphByDocumentId: (state: any, graphDocumentId: string) =>
    state.graphDocumentsById[graphDocumentId]?.graph ?? null,
}))

import { CollapsedEditor } from './CollapsedEditor'

const renderCollapsedEditor = async (
  onSetViewMode = vi.fn(),
  isCanvasToolbarVisible = true,
) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(
      <CollapsedEditor
        graphDocumentId="graph-document-1"
        focusNodeId="node-1"
        isCanvasToolbarVisible={isCanvasToolbarVisible}
        viewMode="collapsed"
        onSetViewMode={onSetViewMode}
      />,
    )
  })

  return { container, root, onSetViewMode }
}

describe('CollapsedEditor', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    currentSpaghettiState = {
      graphDocumentsById: {
        'graph-document-1': {
          graphDocumentId: 'graph-document-1',
          name: 'Graph 1',
          graph: {
            schemaVersion: 1,
            nodes: [{ nodeId: 'node-1', type: 'Part/Baseplate', params: {} }],
            edges: [],
          },
        },
      },
    }
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

  it('keeps the mode toolbar visible in collapsed view so the user can return to expanded', async () => {
    const rendered = await renderCollapsedEditor()
    container = rendered.container
    root = rendered.root

    const expandedButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Expanded',
    )

    expect(container.textContent).toContain('Collapsed')
    expect(container.querySelector('.SpaghettiCanvasToolbar')).not.toBeNull()
    expect(expandedButton).not.toBeNull()

    await act(async () => {
      expandedButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(rendered.onSetViewMode).toHaveBeenCalledWith('expanded')
  })
})
