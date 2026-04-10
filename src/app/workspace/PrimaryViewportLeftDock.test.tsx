// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PrimaryViewportLeftDock } from './PrimaryViewportLeftDock'
import { useBuildStatsStore } from '../store/buildStatsStore'
import { useRuntimeInspectorTaskStore } from '../store/runtimeInspectorTaskStore'
import { type RuntimeInspectorVm, useRuntimeInspectorVm } from '../store/runtimeInspectorVm'
import { useViewportRuntimeStatsStore } from '../store/viewportRuntimeStatsStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'

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

const resetRuntimeInspectorTaskStore = () => {
  useRuntimeInspectorTaskStore.setState({
    activeQueue: [],
    archive: [],
  })
}

const resetSpaghettiStore = () => {
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
}

describe('PrimaryViewportLeftDock', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  let latestVm: RuntimeInspectorVm | null = null

  beforeEach(() => {
    resetBuildStatsStore()
    resetViewportRuntimeStatsStore()
    resetRuntimeInspectorTaskStore()
    resetSpaghettiStore()
    latestVm = null
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
    resetRuntimeInspectorTaskStore()
    resetSpaghettiStore()
    latestVm = null
  })

  const RuntimeInspectorVmProbe = () => {
    latestVm = useRuntimeInspectorVm('model-viewer-primary')
    return null
  }

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

  const renderDockWithVmProbe = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const browserHostRef = { current: null }
    const meatballHostRef = { current: null }

    await act(async () => {
      root?.render(
        <>
          <RuntimeInspectorVmProbe />
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
          />
        </>,
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
    expect(inspectorShell?.textContent).toContain('Current Runtime Task')
    expect(inspectorShell?.textContent).toContain('No active runtime task')
    expect(inspectorShell?.textContent).not.toContain('Change Impact')
    expect(inspectorShell?.textContent).toContain('Waiting for the first viewer runtime sample')
    expect(collapsedToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(statusZone?.contains(inspectorShell)).toBe(true)

    const statusPosition = Array.from(statusZone?.parentElement?.children ?? []).indexOf(statusZone!)
    const panelStackPosition = Array.from(statusZone?.parentElement?.children ?? []).indexOf(panelStackShell!)
    expect(statusPosition).toBeLessThan(panelStackPosition)
  })

  it('renders the current runtime task card when accepted build work is active', async () => {
    useRuntimeInspectorTaskStore.setState({
      activeQueue: [
        {
          seq: 41,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
          partKey: 'cube',
          label: 'Building cube',
          status: 'In Progress',
          progress01: 0.5,
          detail: null,
          state: 'active',
        },
      ],
      archive: [],
    })

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null

    expect(inspectorShell?.textContent).toContain('Building cube')
    expect(inspectorShell?.textContent).toContain('In Progress')
    expect(inspectorShell?.textContent).toContain('50%')
    expect(inspectorShell?.textContent).toContain('graph-a')
  })

  it('renders the active queue beneath the current runtime task in accepted order', async () => {
    useRuntimeInspectorTaskStore.setState({
      activeQueue: [
        {
          seq: 52,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-2',
          partKey: 'cube',
          label: 'Building cube',
          status: 'In Progress',
          progress01: 0.5,
          detail: null,
          state: 'active',
        },
        {
          seq: 52,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-2',
          partKey: 'hook',
          label: 'Building hook',
          status: 'Queued',
          progress01: null,
          detail: 'Waiting for cube',
          state: 'queued',
        },
        {
          seq: 52,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-2',
          partKey: 'strap',
          label: 'Building strap',
          status: 'Queued',
          progress01: null,
          detail: 'Waiting for hook',
          state: 'queued',
        },
      ],
      archive: [],
    })

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null
    const queueList = container?.querySelector('.TitleStatusInspectorQueueList') as HTMLElement | null
    const queuedCards = Array.from(
      container?.querySelectorAll('.TitleStatusInspectorTaskCard.state-queued') ?? [],
    ) as HTMLElement[]

    expect(inspectorShell?.textContent).toContain('Current Runtime Task')
    expect(inspectorShell?.textContent).toContain('Active Queue')
    expect(inspectorShell?.textContent).toContain('2 queued')
    expect(inspectorShell?.textContent).toContain('Building cube')
    expect(inspectorShell?.textContent).toContain('Building hook')
    expect(inspectorShell?.textContent).toContain('Building strap')
    expect(queueList).not.toBeNull()
    expect(queuedCards).toHaveLength(2)
    expect(queuedCards[0]?.textContent).toContain('Building hook')
    expect(queuedCards[1]?.textContent).toContain('Building strap')
    expect(inspectorShell!.textContent!.indexOf('Building cube')).toBeLessThan(
      inspectorShell!.textContent!.indexOf('Building hook'),
    )
    expect(inspectorShell!.textContent!.indexOf('Building hook')).toBeLessThan(
      inspectorShell!.textContent!.indexOf('Building strap'),
    )
  })

  it('renders a quieter archive beneath the active queue with distinct resolved states', async () => {
    useRuntimeInspectorTaskStore.setState({
      activeQueue: [
        {
          seq: 61,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-3',
          partKey: 'cube',
          label: 'Building cube',
          status: 'In Progress',
          progress01: 0.5,
          detail: null,
          state: 'active',
        },
      ],
      archive: [
        {
          seq: 61,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-3',
          partKey: 'hook',
          label: 'Building hook',
          status: 'Done',
          progress01: 1,
          detail: 'Built successfully',
          state: 'done',
        },
        {
          seq: 61,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-3',
          partKey: 'strap',
          label: 'Building strap',
          status: 'Cache Hit',
          progress01: 1,
          detail: 'Reused accepted output',
          state: 'reused',
        },
        {
          seq: 61,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-3',
          partKey: null,
          label: 'Build graph-a',
          status: 'Superseded',
          progress01: null,
          detail: null,
          state: 'superseded',
        },
        {
          seq: 61,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-3',
          partKey: 'toe',
          label: 'Building toe',
          status: 'Failed',
          progress01: null,
          detail: 'Build failed',
          state: 'error',
        },
      ],
    })

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null
    const archiveList = container?.querySelector('.TitleStatusInspectorArchiveList') as HTMLElement | null
    const archiveCards = Array.from(
      container?.querySelectorAll('.TitleStatusInspectorTaskCard.isArchiveCard') ?? [],
    ) as HTMLElement[]

    expect(inspectorShell?.textContent).toContain('Archive')
    expect(inspectorShell?.textContent).toContain('4 recent')
    expect(inspectorShell?.textContent).toContain('Building hook')
    expect(inspectorShell?.textContent).toContain('Done')
    expect(inspectorShell?.textContent).toContain('Building strap')
    expect(inspectorShell?.textContent).toContain('Cache Hit')
    expect(inspectorShell?.textContent).toContain('Build graph-a')
    expect(inspectorShell?.textContent).toContain('Superseded')
    expect(inspectorShell?.textContent).toContain('Building toe')
    expect(inspectorShell?.textContent).toContain('Failed')
    expect(archiveList).not.toBeNull()
    expect(archiveCards).toHaveLength(4)
    expect(archiveCards[0]?.className).toContain('state-done')
    expect(archiveCards[1]?.className).toContain('state-reused')
    expect(archiveCards[2]?.className).toContain('state-superseded')
    expect(archiveCards[3]?.className).toContain('state-error')
  })

  it('renders available stats without the unavailable hint once the viewer has reported a sample', async () => {
    useViewportRuntimeStatsStore.setState({
      statsByViewportId: {
        'model-viewer-primary': {
          triangles: 2048,
          lines: 96,
          points: 12,
          fps: 60,
        },
      },
    })

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null

    expect(inspectorShell?.textContent).toContain('2,048')
    expect(inspectorShell?.textContent).toContain('96')
    expect(inspectorShell?.textContent).toContain('12')
    expect(inspectorShell?.textContent).toContain('60')
    expect(inspectorShell?.textContent).not.toContain('Waiting for the first viewer runtime sample')
    expect(inspectorShell?.textContent).toContain(
      'The first runtime task card now reflects the current accepted build lifecycle only.',
    )
  })

  it('renders a compact change impact summary only when the viewer target has accepted impact truth', async () => {
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          acceptedBuildImpact: {
            seq: 12,
            graphDocumentId: 'graph-document-1',
            buildRequestId: 'request-impact-1',
            changedParamIds: ['strapWidth', 'heelOffset', 'toeDepth'],
            affectedBuildUnitIds: ['unit-a', 'unit-b'],
            targetBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
            summary: {
              rebuiltCount: 2,
              retainedCount: 1,
              evictedCount: 1,
            },
            entries: [
              {
                buildUnitId: 'unit-a',
                outputEntryId: 'entry-a',
                sourceNodeId: 'node-a',
                status: 'rebuilt',
                resultClass: 'draft',
              },
            ],
          },
        },
      },
    }))

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null
    const impactCard = container?.querySelector('.TitleStatusInspectorImpactCard') as HTMLElement | null

    expect(impactCard).not.toBeNull()
    expect(inspectorShell?.textContent).toContain('Change Impact')
    expect(inspectorShell?.textContent).toContain('Latest Accepted Edit')
    expect(inspectorShell?.textContent).toContain('3 params changed')
    expect(inspectorShell?.textContent).toContain('Affected Units')
    expect(inspectorShell?.textContent).toContain('Rebuilt')
    expect(inspectorShell?.textContent).toContain('Reused')
    expect(inspectorShell?.textContent).toContain('Evicted')
    expect(inspectorShell?.textContent).toContain('Untouched')
    expect(inspectorShell?.textContent).toContain('2')
    expect(inspectorShell?.textContent).toContain('1')
  })

  it('renders grouped change impact rows beneath the compact summary in stable order', async () => {
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      partKeyByNodeId: {
        ...state.partKeyByNodeId,
        'node-a': 'toe-hook',
        'node-b': 'arch-shell',
        'node-c': 'heel-cap',
      },
      graphDocumentsById: {
        ...state.graphDocumentsById,
        'graph-document-1': {
          ...state.graphDocumentsById['graph-document-1'],
          graph: {
            ...state.graphDocumentsById['graph-document-1'].graph,
            nodes: [
              {
                nodeId: 'node-a',
                type: 'part',
                params: {},
                ...{ label: 'Toe Hook' },
              },
              {
                nodeId: 'node-b',
                type: 'part',
                params: {},
              },
            ],
          },
        },
      },
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          acceptedBuildImpact: {
            seq: 18,
            graphDocumentId: 'graph-document-1',
            buildRequestId: 'request-impact-2',
            changedParamIds: ['strapWidth'],
            affectedBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
            targetBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
            summary: {
              rebuiltCount: 1,
              retainedCount: 1,
              evictedCount: 1,
            },
            entries: [
              {
                buildUnitId: 'unit-a',
                outputEntryId: 'entry-a',
                sourceNodeId: 'node-a',
                status: 'rebuilt',
                resultClass: 'draft',
              },
              {
                buildUnitId: 'unit-b',
                outputEntryId: 'entry-b',
                sourceNodeId: 'node-b',
                status: 'retained',
                resultClass: 'draft',
              },
              {
                buildUnitId: 'unit-c',
                outputEntryId: 'entry-c',
                sourceNodeId: 'node-c',
                status: 'evicted',
                resultClass: 'draft',
              },
            ],
          },
        },
      },
    }))

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null
    const impactGroups = Array.from(
      container?.querySelectorAll('.TitleStatusInspectorImpactGroup') ?? [],
    ) as HTMLElement[]
    const impactRows = Array.from(
      container?.querySelectorAll('.TitleStatusInspectorImpactRow') ?? [],
    ) as HTMLElement[]

    expect(impactGroups).toHaveLength(3)
    expect(impactRows).toHaveLength(3)
    expect(impactGroups[0]?.className).toContain('state-rebuilt')
    expect(impactGroups[1]?.className).toContain('state-reused')
    expect(impactGroups[2]?.className).toContain('state-evicted')
    expect(inspectorShell?.textContent).toContain('Change Impact')
    expect(inspectorShell?.textContent).toContain('Latest Accepted Edit')
    expect(inspectorShell?.textContent).toContain('Rebuilt')
    expect(inspectorShell?.textContent).toContain('Reused')
    expect(inspectorShell?.textContent).toContain('Evicted')
    expect(inspectorShell?.textContent).toContain('Toe Hook')
    expect(inspectorShell?.textContent).toContain('toe-hook')
    expect(inspectorShell?.textContent).toContain('part')
    expect(inspectorShell?.textContent).toContain('arch-shell')
    expect(inspectorShell?.textContent).toContain('heel-cap')
    expect(inspectorShell?.textContent).toContain('entry-c')
    expect(inspectorShell!.textContent!.indexOf('Rebuilt')).toBeLessThan(
      inspectorShell!.textContent!.indexOf('Reused'),
    )
    expect(inspectorShell!.textContent!.indexOf('Reused')).toBeLessThan(
      inspectorShell!.textContent!.indexOf('Evicted'),
    )
    expect(inspectorShell!.textContent!.indexOf('3 params changed')).toBeLessThan(
      inspectorShell!.textContent!.indexOf('Rebuilt'),
    )
  })

  it('builds grouped change impact entries in stable order with authored labels before visible rows render', async () => {
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      partKeyByNodeId: {
        ...state.partKeyByNodeId,
        'node-a': 'toe-hook',
        'node-b': 'arch-shell',
        'node-c': 'heel-cap',
      },
      graphDocumentsById: {
        ...state.graphDocumentsById,
        'graph-document-1': {
          ...state.graphDocumentsById['graph-document-1'],
          graph: {
            ...state.graphDocumentsById['graph-document-1'].graph,
            nodes: [
              {
                nodeId: 'node-a',
                type: 'part',
                params: {},
                ...{ label: 'Toe Hook' },
              },
              {
                nodeId: 'node-b',
                type: 'part',
                params: {},
              },
            ],
          },
        },
      },
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          acceptedBuildImpact: {
            seq: 18,
            graphDocumentId: 'graph-document-1',
            buildRequestId: 'request-impact-2',
            changedParamIds: ['strapWidth'],
            affectedBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
            targetBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
            summary: {
              rebuiltCount: 1,
              retainedCount: 1,
              evictedCount: 1,
            },
            entries: [
              {
                buildUnitId: 'unit-a',
                outputEntryId: 'entry-a',
                sourceNodeId: 'node-a',
                status: 'rebuilt',
                resultClass: 'draft',
              },
              {
                buildUnitId: 'unit-b',
                outputEntryId: 'entry-b',
                sourceNodeId: 'node-b',
                status: 'retained',
                resultClass: 'draft',
              },
              {
                buildUnitId: 'unit-c',
                outputEntryId: 'entry-c',
                sourceNodeId: 'node-c',
                status: 'evicted',
                resultClass: 'draft',
              },
            ],
          },
        },
      },
    }))

    await renderDockWithVmProbe()

    expect(latestVm?.changeImpactGroups).not.toBeNull()
    expect(latestVm?.changeImpactGroups?.map((group) => group.key)).toEqual([
      'rebuilt',
      'reused',
      'evicted',
    ])
    expect(latestVm?.changeImpactGroups?.[0]?.rows[0]).toMatchObject({
      label: 'Toe Hook',
      detail: 'toe-hook',
      tone: 'rebuilt',
    })
    expect(latestVm?.changeImpactGroups?.[1]?.rows[0]).toMatchObject({
      label: 'part',
      detail: 'arch-shell',
      tone: 'reused',
    })
    expect(latestVm?.changeImpactGroups?.[2]?.rows[0]).toMatchObject({
      label: 'heel-cap',
      detail: 'entry-c',
      tone: 'evicted',
    })
  })

  it('keeps grouped change impact entries hidden before the first accepted impact snapshot exists', async () => {
    await renderDockWithVmProbe()

    expect(latestVm?.changeImpactGroups).toBeNull()
  })

  it('derives untouched change impact metrics from targeted versus affected accepted units', async () => {
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          acceptedBuildImpact: {
            seq: 19,
            graphDocumentId: 'graph-document-1',
            buildRequestId: 'request-impact-3',
            changedParamIds: ['strapWidth'],
            affectedBuildUnitIds: ['unit-a', 'unit-b'],
            targetBuildUnitIds: ['unit-a', 'unit-b', 'unit-c', 'unit-d'],
            summary: {
              rebuiltCount: 1,
              retainedCount: 1,
              evictedCount: 0,
            },
            entries: [
              {
                buildUnitId: 'unit-a',
                outputEntryId: 'entry-a',
                sourceNodeId: 'node-a',
                status: 'rebuilt',
                resultClass: 'draft',
              },
              {
                buildUnitId: 'unit-b',
                outputEntryId: 'entry-b',
                sourceNodeId: 'node-b',
                status: 'retained',
                resultClass: 'draft',
              },
            ],
          },
        },
      },
    }))

    await renderDockWithVmProbe()

    expect(latestVm?.changeImpactSummary?.metrics).toContainEqual({
      label: 'Untouched',
      value: '2',
    })
  })

  it('keeps untouched summary behavior stable when a later accepted edit replaces the prior impact snapshot', async () => {
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          acceptedBuildImpact: {
            seq: 20,
            graphDocumentId: 'graph-document-1',
            buildRequestId: 'request-impact-4',
            changedParamIds: ['strapWidth'],
            affectedBuildUnitIds: ['unit-a', 'unit-b'],
            targetBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
            summary: {
              rebuiltCount: 1,
              retainedCount: 1,
              evictedCount: 0,
            },
            entries: [
              {
                buildUnitId: 'unit-a',
                outputEntryId: 'entry-a',
                sourceNodeId: 'node-a',
                status: 'rebuilt',
                resultClass: 'draft',
              },
              {
                buildUnitId: 'unit-b',
                outputEntryId: 'entry-b',
                sourceNodeId: 'node-b',
                status: 'retained',
                resultClass: 'draft',
              },
            ],
          },
        },
      },
    }))

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    let inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null

    expect(inspectorShell?.textContent).toContain('Untouched')
    expect(inspectorShell?.textContent).toContain('1')

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            acceptedBuildImpact: {
              seq: 21,
              graphDocumentId: 'graph-document-1',
              buildRequestId: 'request-impact-5',
              changedParamIds: ['heelOffset'],
              affectedBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
              targetBuildUnitIds: ['unit-a', 'unit-b', 'unit-c'],
              summary: {
                rebuiltCount: 2,
                retainedCount: 1,
                evictedCount: 0,
              },
              entries: [
                {
                  buildUnitId: 'unit-a',
                  outputEntryId: 'entry-a',
                  sourceNodeId: 'node-a',
                  status: 'rebuilt',
                  resultClass: 'draft',
                },
                {
                  buildUnitId: 'unit-b',
                  outputEntryId: 'entry-b',
                  sourceNodeId: 'node-b',
                  status: 'rebuilt',
                  resultClass: 'draft',
                },
                {
                  buildUnitId: 'unit-c',
                  outputEntryId: 'entry-c',
                  sourceNodeId: 'node-c',
                  status: 'retained',
                  resultClass: 'draft',
                },
              ],
            },
          },
        },
      }))
    })

    inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null

    expect(inspectorShell?.textContent).toContain('Changed params: heelOffset')
    expect(inspectorShell?.textContent).toContain('Untouched')
    expect(inspectorShell?.textContent).not.toContain('Changed params: strapWidth')
    expect(inspectorShell?.textContent).not.toContain('Untouched1Changed params: strapWidth')
    expect(inspectorShell?.textContent).toContain('0')
  })

  it('renders the error task card state alongside the combined inspector shell reads', async () => {
    useBuildStatsStore.setState({
      activeSeq: 42,
      overallState: 'error',
      partOrder: [],
      partStatsByKey: {},
      pulseNonce: 0,
      pulseKind: null,
    })
    useRuntimeInspectorTaskStore.setState({
      activeQueue: [],
      archive: [
        {
          seq: 42,
          graphDocumentId: 'graph-b',
          buildRequestId: 'request-b-1',
          partKey: null,
          label: 'Build graph-b',
          status: 'Failed',
          progress01: null,
          detail: 'Build failed',
          state: 'error',
        },
      ],
    })

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null
    const taskCard = container?.querySelector('.TitleStatusInspectorTaskCard.state-error') as HTMLElement | null
    const archiveCards = Array.from(
      container?.querySelectorAll('.TitleStatusInspectorTaskCard.isArchiveCard') ?? [],
    ) as HTMLElement[]

    expect(taskCard).not.toBeNull()
    expect(inspectorShell?.textContent).toContain('Build graph-b')
    expect(inspectorShell?.textContent).toContain('Failed')
    expect(inspectorShell?.textContent).toContain('Build failed')
    expect(inspectorShell?.textContent).toContain('Progress unavailable')
    expect(inspectorShell?.textContent).not.toContain('Archive')
    expect(archiveCards).toHaveLength(0)
  })

  it('renders only the replacement build truth after prior queue and archive state is superseded', async () => {
    useBuildStatsStore.setState({
      activeSeq: 72,
      overallState: 'building',
      partOrder: ['new-cube'],
      partStatsByKey: {
        'new-cube': {
          state: 'building',
          progress01: 0.25,
          message: 'Rebuilding after edit',
          ms: null,
          cached: false,
        },
      },
      pulseNonce: 0,
      pulseKind: null,
    })
    useRuntimeInspectorTaskStore.setState({
      activeQueue: [
        {
          seq: 72,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-2',
          partKey: 'new-cube',
          label: 'Building new-cube',
          status: 'In Progress',
          progress01: 0.25,
          detail: 'Rebuilding after edit',
          state: 'active',
        },
      ],
      archive: [],
    })

    await renderDock()

    const toggleButton = container?.querySelector(
      'button[aria-label="Expand runtime inspector"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const inspectorShell = container?.querySelector('.TitleStatusInspectorShell') as HTMLElement | null

    expect(inspectorShell?.textContent).toContain('Building new-cube')
    expect(inspectorShell?.textContent).toContain('Rebuilding after edit')
    expect(inspectorShell?.textContent).not.toContain('Building old-cube')
    expect(inspectorShell?.textContent).not.toContain('Old build failed')
    expect(inspectorShell?.textContent).not.toContain('Archive')
  })
})
