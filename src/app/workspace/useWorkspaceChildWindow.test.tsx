// @vitest-environment jsdom

import { act } from 'react'
import { createPortal } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceChildWindow } from './useWorkspaceChildWindow'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

function ChildWindowHarness() {
  const { host } = useWorkspaceChildWindow({
    isOpen: true,
    spec: {
      childWindowId: 'workspace-child-window-test',
      windowName: 'workspace-child-window-test',
      windowTitle: 'Workspace Child Window Test',
      windowFeatures: 'popup=yes,width=640,height=480',
    },
    rootClassName: 'WorkspaceChildWindowTestRoot',
  })

  return host !== null
    ? createPortal(<div className="WorkspaceChildWindowTestContent">Mounted popup content</div>, host)
    : null
}

describe('useWorkspaceChildWindow', () => {
  const originalWindowOpen = window.open
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  afterEach(async () => {
    window.open = originalWindowOpen
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    root = null
    container?.remove()
    container = null
    document.body.innerHTML = ''
  })

  it('recreates the popup host after the child document body is replaced and mounts visible portal content again', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const popupDocument = document.implementation.createHTMLDocument('Popup')
    let loadHandler: (() => void) | null = null
    const popupWindow = {
      closed: false,
      document: popupDocument,
      focus: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === 'load' && typeof handler === 'function') {
          loadHandler = handler as () => void
        }
      }),
      removeEventListener: vi.fn((type: string) => {
        if (type === 'load') {
          loadHandler = null
        }
      }),
    } as unknown as Window

    window.open = vi.fn(() => popupWindow) as typeof window.open

    await act(async () => {
      root?.render(<ChildWindowHarness />)
    })

    expect(
      popupDocument.body.querySelector('.WorkspaceChildWindowTestContent')?.textContent,
    ).toContain('Mounted popup content')

    const replacementBody = popupDocument.createElement('body')
    popupDocument.documentElement.replaceChild(replacementBody, popupDocument.body)

    expect(popupDocument.body.querySelector('.WorkspaceChildWindowTestContent')).toBeNull()

    await act(async () => {
      loadHandler?.()
    })

    expect(
      popupDocument.body.querySelector('[data-workspace-child-window-host="workspace-child-window-test"]'),
    ).not.toBeNull()
    expect(
      popupDocument.body.querySelector('.WorkspaceChildWindowTestContent')?.textContent,
    ).toContain('Mounted popup content')
  })
})
