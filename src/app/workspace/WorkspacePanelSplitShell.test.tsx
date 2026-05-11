// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { WorkspacePanelSplitShell } from './WorkspacePanelSplitShell'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('WorkspacePanelSplitShell', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
    document.body.innerHTML = ''
    document.body.className = ''
  })

  const renderShell = async (
    props: Partial<Parameters<typeof WorkspacePanelSplitShell>[0]> = {},
  ) => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <WorkspacePanelSplitShell
          left={<div data-testid="left-slot">Left slot</div>}
          right={<div data-testid="right-slot">Right slot</div>}
          leftLabel="Left workspace panel"
          rightLabel="Right workspace panel"
          {...props}
        />,
      )
    })
  }

  it('renders labeled left and right slots with an accessible separator', async () => {
    await renderShell({ dataShellKind: 'test-shell' })

    const shell = container?.querySelector('.WorkspacePanelSplitShell') as HTMLDivElement | null
    const leftPanel = container?.querySelector(
      '[data-workspace-panel-shell-region="left"]',
    ) as HTMLElement | null
    const rightPanel = container?.querySelector(
      '[data-workspace-panel-shell-region="right"]',
    ) as HTMLElement | null
    const resizeHandle = container?.querySelector('[role="separator"]') as HTMLElement | null

    expect(shell?.dataset.workspacePanelShell).toBe('test-shell')
    expect(leftPanel?.getAttribute('aria-label')).toBe('Left workspace panel')
    expect(leftPanel?.textContent).toBe('Left slot')
    expect(rightPanel?.getAttribute('aria-label')).toBe('Right workspace panel')
    expect(rightPanel?.textContent).toBe('Right slot')
    expect(resizeHandle?.getAttribute('aria-label')).toBe('Resize workspace panel')
    expect(resizeHandle?.getAttribute('aria-orientation')).toBe('vertical')
    expect(resizeHandle?.getAttribute('aria-valuemin')).toBe('184')
    expect(resizeHandle?.getAttribute('aria-valuemax')).toBe('420')
    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('240')
    expect(shell?.style.getPropertyValue('--workspace-panel-shell-left-width')).toBe('240px')
  })

  it('clamps keyboard resizing to the configured minimum and maximum widths', async () => {
    await renderShell({
      defaultLeftWidth: 200,
      minLeftWidth: 190,
      maxLeftWidth: 220,
      keyboardStep: 16,
    })

    const shell = container?.querySelector('.WorkspacePanelSplitShell') as HTMLDivElement | null
    const resizeHandle = container?.querySelector('[role="separator"]') as HTMLElement | null
    expect(resizeHandle).not.toBeNull()

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
      )
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
      )
    })

    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('220')
    expect(shell?.style.getPropertyValue('--workspace-panel-shell-left-width')).toBe('220px')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }),
      )
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }),
      )
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }),
      )
    })

    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('190')
    expect(shell?.style.getPropertyValue('--workspace-panel-shell-left-width')).toBe('190px')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }),
      )
    })
    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('220')

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }),
      )
    })
    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('190')
  })

  it('updates the left width on mouse drag and cleans up resizing state on mouseup', async () => {
    await renderShell({
      defaultLeftWidth: 240,
      minLeftWidth: 184,
      maxLeftWidth: 420,
    })

    const shell = container?.querySelector('.WorkspacePanelSplitShell') as HTMLDivElement | null
    const resizeHandle = container?.querySelector('[role="separator"]') as HTMLElement | null
    expect(resizeHandle).not.toBeNull()

    await act(async () => {
      resizeHandle?.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          clientX: 300,
        }),
      )
    })

    expect(shell?.classList.contains('isResizingPanel')).toBe(true)
    expect(document.body.classList.contains('WorkspacePanelSplitShellIsResizing')).toBe(true)

    await act(async () => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
        }),
      )
    })

    expect(resizeHandle?.getAttribute('aria-valuenow')).toBe('420')
    expect(shell?.style.getPropertyValue('--workspace-panel-shell-left-width')).toBe('420px')

    await act(async () => {
      document.dispatchEvent(
        new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
        }),
      )
    })

    expect(shell?.classList.contains('isResizingPanel')).toBe(false)
    expect(document.body.classList.contains('WorkspacePanelSplitShellIsResizing')).toBe(false)
  })
})
