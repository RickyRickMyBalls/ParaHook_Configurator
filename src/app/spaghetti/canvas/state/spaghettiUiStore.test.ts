import { afterEach, describe, expect, it } from 'vitest'
import { useSpaghettiStore } from '../../store/useSpaghettiStore'
import { buildSectionCollapseKey, useSpaghettiUiStore } from './spaghettiUiStore'

describe('spaghettiUiStore', () => {
  afterEach(() => {
    useSpaghettiUiStore.setState({
      collapsed: {},
    })
    useSpaghettiStore.setState({
      selectedNodeId: null,
      selectedEdgeId: null,
    })
  })

  it('toggleCollapsed stores section collapse deterministically', () => {
    const sectionKey = buildSectionCollapseKey('node-a', 'drivers')
    useSpaghettiUiStore.getState().toggleCollapsed(sectionKey)

    expect(useSpaghettiUiStore.getState().collapsed).toEqual({
      [sectionKey]: true,
    })
  })

  it('clearCollapsedForNode clears local collapsed state for that node only', () => {
    const sectionKeyA = buildSectionCollapseKey('node-a', 'drivers')
    const sectionKeyB = buildSectionCollapseKey('node-b', 'drivers')
    useSpaghettiUiStore.setState({
      collapsed: {
        [sectionKeyA]: true,
        [sectionKeyB]: true,
      },
    })

    useSpaghettiUiStore.getState().clearCollapsedForNode('node-a')

    expect(useSpaghettiUiStore.getState().collapsed).toEqual({
      [sectionKeyB]: true,
    })
  })

  it('collapse changes do not affect selection state', () => {
    useSpaghettiStore.setState({
      selectedNodeId: 'node-selected',
      selectedEdgeId: 'edge-selected',
    })

    useSpaghettiUiStore.getState().setCollapsed(buildSectionCollapseKey('node-a', 'drivers'), true)

    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-selected')
    expect(useSpaghettiStore.getState().selectedEdgeId).toBe('edge-selected')
  })
})
