import { describe, expect, it, vi } from 'vitest'
import {
  buildStructuredWireRowToggleLabel,
  cycleStructuredWireRowMode,
  createStructuredWireRowController,
  getStructuredWireRowMode,
} from './structuredWireRowController'

describe('structuredWireRowController', () => {
  it('derives row mode from open and expanded state', () => {
    expect(getStructuredWireRowMode(false, false)).toBe('collapsed')
    expect(getStructuredWireRowMode(true, false)).toBe('essentials')
    expect(getStructuredWireRowMode(true, true)).toBe('expanded')
  })

  it('builds the expected toggle labels for input and output rows', () => {
    expect(buildStructuredWireRowToggleLabel('collapsed', 'SketchPlane', 'input')).toBe(
      'Open SketchPlane input row',
    )
    expect(buildStructuredWireRowToggleLabel('essentials', 'SketchProfiles', 'output')).toBe(
      'Expand SketchProfiles output row',
    )
    expect(buildStructuredWireRowToggleLabel('expanded', 'SketchProfile', 'input')).toBe(
      'Collapse SketchProfile input row',
    )
  })

  it('opens a collapsed row into essentials', () => {
    const setCollapsed = vi.fn()
    let nextState: Record<string, boolean> | null = null

    cycleStructuredWireRowMode(
      'collapsed',
      'row-key',
      'details-key',
      setCollapsed,
      (updater) => {
        nextState = typeof updater === 'function' ? updater({}) : updater
      },
    )

    expect(setCollapsed).toHaveBeenCalledWith('row-key', false)
    expect(nextState).toEqual({
      'details-key': false,
    })
  })

  it('expands an essentials row without reclosing it', () => {
    const setCollapsed = vi.fn()
    let nextState: Record<string, boolean> | null = null

    cycleStructuredWireRowMode(
      'essentials',
      'row-key',
      'details-key',
      setCollapsed,
      (updater) => {
        nextState = typeof updater === 'function' ? updater({ existing: false }) : updater
      },
    )

    expect(setCollapsed).not.toHaveBeenCalled()
    expect(nextState).toEqual({
      existing: false,
      'details-key': true,
    })
  })

  it('collapses an expanded row and clears expanded details', () => {
    const setCollapsed = vi.fn()
    let nextState: Record<string, boolean> | null = null

    cycleStructuredWireRowMode(
      'expanded',
      'row-key',
      'details-key',
      setCollapsed,
      (updater) => {
        nextState = typeof updater === 'function' ? updater({ 'details-key': true }) : updater
      },
    )

    expect(setCollapsed).toHaveBeenCalledWith('row-key', true)
    expect(nextState).toEqual({
      'details-key': false,
    })
  })

  it('builds shared row props around the row-mode seam', () => {
    const setCollapsed = vi.fn()
    let nextState: Record<string, boolean> | null = null

    const controller = createStructuredWireRowController({
      rowOpen: true,
      rowExpanded: false,
      rowKey: 'row-key',
      detailsKey: 'details-key',
      label: 'SketchProfile',
      direction: 'input',
      setCollapsed,
      setExpandedDetails: (updater) => {
        nextState = typeof updater === 'function' ? updater({}) : updater
      },
    })

    expect(controller.rowChevronState).toBe('essentials')
    expect(controller.rowToggleAriaLabel).toBe('Expand SketchProfile input row')

    controller.onCycleRowChevron()

    expect(setCollapsed).not.toHaveBeenCalled()
    expect(nextState).toEqual({
      'details-key': true,
    })
  })
})
