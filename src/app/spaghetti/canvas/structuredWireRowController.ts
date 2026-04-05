import type { Dispatch, SetStateAction } from 'react'
import type { StructuredWireRowMode } from './nodeTemplateContract'

type ExpandedDetailsState = Record<string, boolean>
type StructuredWireRowDirection = 'input' | 'output'

type StructuredWireRowControllerOptions = {
  rowOpen: boolean
  rowExpanded: boolean
  rowKey: string
  detailsKey: string
  label: string
  direction: StructuredWireRowDirection
  setCollapsed: (key: string, collapsed: boolean) => void
  setExpandedDetails: Dispatch<SetStateAction<ExpandedDetailsState>>
}

type StructuredWireRowController = {
  rowChevronState: StructuredWireRowMode
  rowToggleAriaLabel: string
  onCycleRowChevron: () => void
}

export const getStructuredWireRowMode = (
  rowOpen: boolean,
  rowExpanded: boolean,
): StructuredWireRowMode => {
  if (!rowOpen) {
    return 'collapsed'
  }
  return rowExpanded ? 'expanded' : 'essentials'
}

export const buildStructuredWireRowToggleLabel = (
  rowMode: StructuredWireRowMode,
  label: string,
  direction: 'input' | 'output',
): string => {
  if (rowMode === 'collapsed') {
    return `Open ${label} ${direction} row`
  }
  if (rowMode === 'essentials') {
    return `Expand ${label} ${direction} row`
  }
  return `Collapse ${label} ${direction} row`
}

export const cycleStructuredWireRowMode = (
  rowMode: StructuredWireRowMode,
  rowKey: string,
  detailsKey: string,
  setCollapsed: (key: string, collapsed: boolean) => void,
  setExpandedDetails: Dispatch<SetStateAction<ExpandedDetailsState>>,
) => {
  if (rowMode === 'collapsed') {
    setCollapsed(rowKey, false)
    setExpandedDetails((current) => ({
      ...current,
      [detailsKey]: false,
    }))
    return
  }

  if (rowMode === 'essentials') {
    setExpandedDetails((current) => ({
      ...current,
      [detailsKey]: true,
    }))
    return
  }

  setExpandedDetails((current) => ({
    ...current,
    [detailsKey]: false,
  }))
  setCollapsed(rowKey, true)
}

export const createStructuredWireRowController = ({
  rowOpen,
  rowExpanded,
  rowKey,
  detailsKey,
  label,
  direction,
  setCollapsed,
  setExpandedDetails,
}: StructuredWireRowControllerOptions): StructuredWireRowController => {
  const rowChevronState = getStructuredWireRowMode(rowOpen, rowExpanded)
  return {
    rowChevronState,
    rowToggleAriaLabel: buildStructuredWireRowToggleLabel(rowChevronState, label, direction),
    onCycleRowChevron: () =>
      cycleStructuredWireRowMode(
        rowChevronState,
        rowKey,
        detailsKey,
        setCollapsed,
        setExpandedDetails,
      ),
  }
}
