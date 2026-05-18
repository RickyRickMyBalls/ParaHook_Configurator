// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { useAppStore } from '../store/useAppStore'
import { ExportSurface } from './ExportSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ExportSurface', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    window.localStorage.clear()
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
    document.body.innerHTML = ''
  })

  it('renders STEP as the only executable first format', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const stepButton = container.querySelector(
      '.ExportSurfaceFormatButton[aria-pressed="true"]',
    )
    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement
    const headerPanel = container.querySelector('.ExportSurfaceHeader')
    const targetsPanel = container.querySelector('section[aria-label="Export targets"]')
    const bottomActionPanel = container.querySelector('section.ExportSurfacePanel--action')

    expect(container.textContent).toContain('Export Review')
    expect(container.textContent).toContain('STEP')
    expect(container.textContent).toContain('STL')
    expect(container.textContent).toContain('OBJ')
    expect(container.textContent).toContain('GLB')
    expect(container.textContent).toContain('Not wired yet')
    expect(container.textContent).toContain('STEP CAD Settings')
    expect(container.textContent).toContain('Authoritative worker B-rep')
    expect(container.textContent).toContain('Shape ownership')
    expect(container.textContent).toContain('Related Outputs')
    expect(container.textContent).toContain('Geometry export')
    expect(container.textContent).toContain('Export / Worker')
    expect(container.textContent).toContain('Graph file')
    expect(container.textContent).toContain('Save Graph File writes graph document JSON')
    expect(container.textContent).not.toContain('Executable controls deferred')
    expect(stepButton?.textContent).toContain('STEP')
    expect(headerPanel?.contains(exportButton)).toBe(true)
    expect(targetsPanel?.contains(exportButton)).toBe(false)
    expect(bottomActionPanel).toBeNull()
    expect(exportButton.disabled).toBe(false)
    expect(exportButton.textContent).toBe('Export STEP')
  })

  it('routes Export STEP through the app store graph export handoff', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({ requestGraphDocumentStepExport })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement

    await act(async () => {
      exportButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(requestGraphDocumentStepExport).toHaveBeenCalledWith('graph-document-1')
  })

  it('routes selected graph-document export targets through STEP export', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({
      requestGraphDocumentStepExport,
      exportWorkspaceTargets: [{ kind: 'graph-document', graphDocumentId: 'graph-document-1' }],
      activeExportWorkspaceTargetKey: 'graph-document:graph-document-1',
    })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement

    expect(container.textContent).toContain('Graph 1')
    expect(exportButton.disabled).toBe(false)

    await act(async () => {
      exportButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(requestGraphDocumentStepExport).toHaveBeenCalledWith('graph-document-1')
  })

  it('shows selected object export targets as review-only without STEP routing', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({
      requestGraphDocumentStepExport,
      exportWorkspaceTargets: [{ kind: 'object', objectId: 'project-object-1' }],
      activeExportWorkspaceTargetKey: 'object:project-object-1',
    })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement

    expect(container.textContent).toContain('project-object-1')
    expect(container.textContent).toContain('Target review only')
    expect(exportButton.disabled).toBe(true)

    await act(async () => {
      exportButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(requestGraphDocumentStepExport).not.toHaveBeenCalled()
  })

  it('removes export targets without changing workspace selection', async () => {
    useAppStore.setState((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: { kind: 'object', objectId: 'project-object-1' },
        explicitSelectedTargets: [{ kind: 'object', objectId: 'project-object-1' }],
        selectionAnchorTarget: { kind: 'object', objectId: 'project-object-1' },
      },
      exportWorkspaceTargets: [{ kind: 'object', objectId: 'project-object-1' }],
      activeExportWorkspaceTargetKey: 'object:project-object-1',
    }))
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const removeButton = container.querySelector(
      'button[aria-label="Remove project-object-1 from export targets"]',
    ) as HTMLButtonElement

    await act(async () => {
      removeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().exportWorkspaceTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([
      { kind: 'object', objectId: 'project-object-1' },
    ])
  })

  it('does not export unavailable formats', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({ requestGraphDocumentStepExport })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const stlButton = Array.from(container.querySelectorAll('.ExportSurfaceFormatButton')).find(
      (button) => button.textContent?.includes('STL'),
    ) as HTMLButtonElement

    await act(async () => {
      stlButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement
    expect(exportButton.disabled).toBe(true)
    expect(container.textContent).toContain('Format not wired yet')

    await act(async () => {
      exportButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(requestGraphDocumentStepExport).not.toHaveBeenCalled()
  })

  it('shows deferred mesh settings for STL without enabling export', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({ requestGraphDocumentStepExport })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const stlButton = Array.from(container.querySelectorAll('.ExportSurfaceFormatButton')).find(
      (button) => button.textContent?.includes('STL'),
    ) as HTMLButtonElement

    await act(async () => {
      stlButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement

    expect(container.textContent).toContain('STL Mesh Settings')
    expect(container.textContent).toContain('Deferred worker mesh writer')
    expect(container.textContent).toContain('Executable controls deferred')
    expect(container.textContent).toContain('Viewer mesh export')
    expect(exportButton.disabled).toBe(true)

    await act(async () => {
      exportButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(requestGraphDocumentStepExport).not.toHaveBeenCalled()
  })

  it('shows deferred scene and package settings for OBJ and GLB', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const objButton = Array.from(container.querySelectorAll('.ExportSurfaceFormatButton')).find(
      (button) => button.textContent?.includes('OBJ'),
    ) as HTMLButtonElement
    const glbButton = Array.from(container.querySelectorAll('.ExportSurfaceFormatButton')).find(
      (button) => button.textContent?.includes('GLB'),
    ) as HTMLButtonElement

    await act(async () => {
      objButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('OBJ Scene Settings')
    expect(container.textContent).toContain('Deferred worker scene writer')
    expect(container.textContent).toContain('Executable controls deferred')

    await act(async () => {
      glbButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('GLB Package Settings')
    expect(container.textContent).toContain('Deferred worker package writer')
    expect(container.textContent).toContain('Executable controls deferred')
  })

  it('keeps project and spaghetti file neighbors visible but non-executable', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({ requestGraphDocumentStepExport })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const projectFileButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Project file'),
    )
    const spaghettiFileButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Spaghetti file'),
    )

    expect(container.textContent).toContain('Project file')
    expect(container.textContent).toContain('Project persistence')
    expect(container.textContent).toContain('Durable project save/load stays with the project persistence owner.')
    expect(container.textContent).toContain('Spaghetti file')
    expect(container.textContent).toContain('Deferred graph-file path')
    expect(container.textContent).toContain('Spaghetti document save follows graph persistence')
    expect(projectFileButton).toBeUndefined()
    expect(spaghettiFileButton).toBeUndefined()
    expect(requestGraphDocumentStepExport).not.toHaveBeenCalled()
  })

  it('does not change neighbor ownership when an unavailable format is selected', async () => {
    const requestGraphDocumentStepExport = vi.fn()
    useAppStore.setState({ requestGraphDocumentStepExport })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const objButton = Array.from(container.querySelectorAll('.ExportSurfaceFormatButton')).find(
      (button) => button.textContent?.includes('OBJ'),
    ) as HTMLButtonElement

    await act(async () => {
      objButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement

    expect(container.textContent).toContain('OBJ Scene Settings')
    expect(container.textContent).toContain('Geometry export')
    expect(container.textContent).toContain('Available for STEP')
    expect(container.textContent).toContain('Graph file')
    expect(container.textContent).toContain('Available in Browser')
    expect(exportButton.disabled).toBe(true)

    await act(async () => {
      exportButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(requestGraphDocumentStepExport).not.toHaveBeenCalled()
  })

  it('disables export when no graph document is active', async () => {
    useSpaghettiStore.setState({
      graphDocumentsById: {},
      graphDocumentOrder: [],
      activeGraphDocumentId: 'missing-graph-document',
    })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ExportSurface
          slotId="workspace-slot-export"
          surfaceInstanceId="export-workspace-slot-export"
        />,
      )
    })

    const exportButton = container.querySelector('.ExportSurfacePrimaryAction') as HTMLButtonElement

    expect(container.textContent).toContain('No graph document is active')
    expect(exportButton.disabled).toBe(true)
    expect(container.textContent).toContain('No export target')
  })
})
