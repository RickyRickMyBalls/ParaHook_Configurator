// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PrimaryViewportLeftDock } from './PrimaryViewportLeftDock'
import { useBuildStatsStore } from '../store/buildStatsStore'
import { useViewportRuntimeStatsStore } from '../store/viewportRuntimeStatsStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const resetBuildStatsStore = () => {
  useBuildStatsStore.setState({
    activeSeq: null,
    overallState: 'idle',
    partOrder: [],
    partStatsByKey: {},
    pulseNonce: 0,
    pulseKind: null,
  })
}

const resetViewportRuntimeStatsStore = () => {
  useViewportRuntimeStatsStore.setState({
    statsByViewportId: {},
  })
}

describe('PrimaryViewportLeftDock', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    resetBuildStatsStore()
    resetViewportRuntimeStatsStore()
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
    resetBuildStatsStore()
    resetViewportRuntimeStatsStore()
  })

  const renderDock = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const browserHostRef = { current: null }
    const meatballHostRef = { current: null }

    await act(async () => {
      root?.render(
        <PrimaryViewportLeftDock
          viewportId="model-viewer-primary"
          leftDockWidth={320}
          bottomInset="0px"
          isConstrained={true}
          isViewportSplitHandleConstrained={false}
          isLeftDockViewportSplit={false}
          isBrowserDockPreviewActive={false}
          isMeatballDockPreviewActive={false}
          dockedBrowserHostRef={browserHostRef}
          dockedMeatballHostRef={meatballHostRef}
          onResizeStart={() => {}}
          onResizeContextMenu={() => {}}
          onSplitTogglePointerDown={() => {}}
          onSplitToggleClick={() => {}}
        />,
      )
    })
  }

  it('keeps the runtime inspector shell collapsed by default', async () => {
    await renderDock()

    expect(container?.querySelector('.TitleStatusInspectorShell')).toBeNull()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    expect(toggleButton).not.toBeNull()
    expect(toggleButton?.getAttribute('aria-expanded')).toBe('false')
  })

  it('expands the runtime inspector shell inside the status zone ahead of the panel stack', async () => {
    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null
    const statusZone = container?.querySelector('.PrimaryViewportLeftDockStatus') as HTMLElement | null
    const panelStackShell = container?.querySelector(
      '.PrimaryViewportLeftDockPanelStackShell',
    ) as HTMLElement | null

    expect(toggleButton).not.toBeNull()
    expect(statusZone).not.toBeNull()
    expect(panelStackShell).not.toBeNull()

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null
    const collapsedToggle = container?.querySelector(
      'button[aria-label="Collapse runtime inspector"]',
    ) as HTMLButtonElement | null

    expect(inspectorShell).not.toBeNull()
    expect(inspectorShell?.textContent).toContain('Runtime Inspector')
    expect(inspectorShell?.textContent).toContain('Triangles')
    expect(inspectorShell?.textContent).toContain('Lines')
    expect(inspectorShell?.textContent).toContain('Points')
    expect(inspectorShell?.textContent).toContain('FPS')
    expect(inspectorShell?.textContent).toContain('Waiting for the first viewer runtime sample')
    expect(collapsedToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(statusZone?.contains(inspectorShell)).toBe(true)

    const statusPosition = Array.from(statusZone?.parentElement?.children ?? []).indexOf(statusZone!)
    const panelStackPosition = Array.from(statusZone?.parentElement?.children ?? []).indexOf(panelStackShell!)
    expect(statusPosition).toBeLessThan(panelStackPosition)
  })
})
