// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { ViewportFrame } from './ViewportFrame'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ViewportFrame', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
  })

  const renderFrame = async (props?: Partial<ComponentProps<typeof ViewportFrame>>) => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <ViewportFrame
          slotId="workspace-slot-secondary"
          surfaceKind="browser"
          onSplitTop={vi.fn()}
          onSplitRight={vi.fn()}
          onSplitBottom={vi.fn()}
          onSplitLeft={vi.fn()}
          onFloat={vi.fn()}
          onPopOut={vi.fn()}
          {...props}
        >
          <div>Body</div>
        </ViewportFrame>,
      )
    })
    const frame = container?.querySelector('.ViewportFrame')
    if (frame instanceof HTMLElement) {
      Object.defineProperty(frame, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          width: 500,
          height: 320,
          right: 500,
          bottom: 320,
          toJSON: () => '',
        }),
      })
    }
  }

  it('keeps the viewport action menu on titlebar right click instead of showing the action strip inline', async () => {
    await renderFrame()

    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
    expect(container?.textContent).not.toContain('Split Top')

    await act(async () => {
      const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()
    expect(container?.textContent).toContain('Split Top')
    expect(container?.textContent).toContain('Pop Out')
  })

  it('uses the top-right frame button as a direct pop out control', async () => {
    const onPopOut = vi.fn()

    await renderFrame({
      onPopOut,
    })

    const popOutButton = container?.querySelector(
      '.ViewportFrameActionMenuButton',
    ) as HTMLButtonElement | null

    await act(async () => {
      popOutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(popOutButton?.textContent).toBe('↗')
    expect(popOutButton?.getAttribute('aria-label')).toBe('Pop out Browser')
    expect(onPopOut).toHaveBeenCalledTimes(1)
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('opens the viewport action menu when the title bar is right-clicked', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()
    expect(container?.textContent).toContain('Split Right')
  })

  it('anchors the viewport action menu near the right-click position', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 210,
          clientY: 96,
        }),
      )
    })

    const menu = container?.querySelector('.ViewportFrameActionMenu') as HTMLDivElement | null
    expect(menu).not.toBeNull()
    expect(menu?.style.left).toBe('210px')
    expect(menu?.style.top).toBe('76px')
  })

  it('closes the viewport action menu when clicking elsewhere in the frame', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 210,
          clientY: 96,
        }),
      )
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()

    const body = container?.querySelector('.ViewportFrameBody') as HTMLDivElement | null
    await act(async () => {
      body?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('calls header drag-out when the title bar is dragged past the threshold', async () => {
    const onHeaderDragOut = vi.fn()
    await renderFrame({
      onHeaderDragOut,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(header).not.toBeNull()

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 80,
          clientY: 40,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 120,
          clientY: 78,
        }),
      )
    })

    expect(onHeaderDragOut).toHaveBeenCalledTimes(1)
  })

  it('prevents default text-selection behavior when titlebar drag-out begins', async () => {
    const onHeaderDragOut = vi.fn()
    await renderFrame({
      onHeaderDragOut,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(header).not.toBeNull()

    const pointerDownEvent = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      pointerId: 1,
      clientX: 80,
      clientY: 40,
    })

    await act(async () => {
      header?.dispatchEvent(pointerDownEvent)
    })

    expect(pointerDownEvent.defaultPrevented).toBe(true)
  })
})
