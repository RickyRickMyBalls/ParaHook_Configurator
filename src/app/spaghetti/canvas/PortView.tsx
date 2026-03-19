import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import type { PortKind, PortSpec } from '../schema/spaghettiTypes'
import { NumberField } from './fields/NumberField'
import { getTypeColor } from './typeColors'
import type { PortDirection } from './types'
import { SP_INTERACTIVE_PROPS } from '../spInteractive'

type PortDropState = 'compatible' | 'incompatible' | null
export type PortDetailLine = {
  text: string
  kind?: PortKind
}

type EndpointPayload = {
  nodeId: string
  portId: string
  path?: string[]
}

type ValueInputConfig = {
  value: number
  min?: number
  max?: number
  step?: number
  showSlider?: boolean
  disabled?: boolean
  driven?: boolean
  onChange: (value: number) => void
}

type InlineValueInputConfig = {
  id: string
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  driven?: boolean
  onChange: (value: number) => void
}

type PortViewProps = {
  nodeId: string
  direction: PortDirection
  endpointPortId?: string
  endpointPath?: string[]
  labelOverride?: string
  port: PortSpec
  setPortElement: (element: HTMLElement | null) => void
  dropState: PortDropState
  details?: PortDetailLine[]
  detailsTitle?: string
  attachedBodyContent?: ReactNode
  detailsExpanded?: boolean
  onToggleDetails?: () => void
  compositeExpanded?: boolean
  onToggleComposite?: () => void
  rowChevronState?: 'collapsed' | 'essentials' | 'expanded'
  onCycleRowChevron?: () => void
  rowExpanded?: boolean
  onToggleRowExpanded?: () => void
  rowToggleAriaLabel?: string
  hideDetailsToggle?: boolean
  childTone?: boolean
  valueInput?: ValueInputConfig
  inlineValueInputs?: InlineValueInputConfig[]
  scrubSpeed?: number
  valueBarTone?: 'blue' | 'white'
  inputWiringDisabled?: boolean
  drivenMessage?: string
  resolvedValueLabel?: string
  onContextMenu?: (
    event: ReactMouseEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onOutputPointerDown?: (
    event: ReactPointerEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onOutputPointerEnter?: (payload: EndpointPayload) => void
  onOutputPointerLeave?: (payload: EndpointPayload) => void
  onInputPointerDown?: (
    event: ReactPointerEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onInputPointerEnter?: (payload: EndpointPayload) => void
  onInputPointerLeave?: (payload: EndpointPayload) => void
}

const describePortType = (port: PortSpec): string =>
  port.type.unit === undefined ? port.type.kind : `${port.type.kind}:${port.type.unit}`

const detailKindClass = (kind: PortKind | undefined): string => {
  if (kind === undefined) {
    return ''
  }
  return `SpaghettiPortDetail--${kind}`
}

const portKindClass = (kind: PortKind): string => `SpaghettiPort--kind-${kind}`
const portAnchorKindClass = (kind: PortKind): string => `SpaghettiPortAnchor--kind-${kind}`

export function PortView({
  nodeId,
  direction,
  endpointPortId,
  endpointPath,
  labelOverride,
  port,
  setPortElement,
  dropState,
  details,
  detailsTitle,
  attachedBodyContent,
  detailsExpanded = false,
  onToggleDetails,
  compositeExpanded,
  onToggleComposite,
  rowChevronState,
  onCycleRowChevron,
  rowExpanded = true,
  onToggleRowExpanded,
  rowToggleAriaLabel,
  hideDetailsToggle = false,
  childTone = false,
  valueInput,
  inlineValueInputs,
  scrubSpeed = 0,
  valueBarTone = 'blue',
  inputWiringDisabled = false,
  drivenMessage,
  resolvedValueLabel,
  onContextMenu,
  onOutputPointerDown,
  onOutputPointerEnter,
  onOutputPointerLeave,
  onInputPointerDown,
  onInputPointerEnter,
  onInputPointerLeave,
}: PortViewProps) {
  const socketColor = getTypeColor(port.type.kind)
  const portColorStyle = {
    '--sp-port-color': socketColor,
  } as CSSProperties
  const resolvedPortId = endpointPortId ?? port.portId
  const payload: EndpointPayload = {
    nodeId,
    portId: resolvedPortId,
    ...(endpointPath === undefined || endpointPath.length === 0 ? {} : { path: endpointPath }),
  }

  const effectiveDropState =
    direction === 'in' && inputWiringDisabled === true ? null : dropState
  const effectiveRowChevronState =
    rowChevronState ??
    (onToggleRowExpanded !== undefined ? (rowExpanded ? 'essentials' : 'collapsed') : undefined)
  const rowCollapsed =
    effectiveRowChevronState !== undefined
      ? effectiveRowChevronState === 'collapsed'
      : onToggleRowExpanded !== undefined && rowExpanded === false
  const rowChevronGlyph =
    effectiveRowChevronState === 'expanded'
      ? '\u25BE'
      : effectiveRowChevronState === 'essentials'
        ? '\u25C2'
        : '\u25B8'
  const dropStateClass =
    effectiveDropState === null
      ? ''
      : effectiveDropState === 'compatible'
        ? 'SpaghettiPort--compatible'
        : 'SpaghettiPort--incompatible'
  const canCycleRow = onCycleRowChevron !== undefined || onToggleRowExpanded !== undefined
  const handleCycleRow = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation()
    ;(onCycleRowChevron ?? onToggleRowExpanded)?.()
  }

  return (
    <div
      className={`SpaghettiPort SpRow ${
        direction === 'in' ? 'SpRow--input' : 'SpRow--output'
      } SpaghettiPort--${direction} ${portKindClass(port.type.kind)} ${
        childTone ? 'SpaghettiPort--child' : ''
      } ${direction === 'in' && inputWiringDisabled ? 'SpaghettiPort--input-disabled' : ''} ${
        drivenMessage !== undefined ? 'SpaghettiPort--driven' : ''
      } ${dropStateClass}`}
      data-sp-port-row-open={rowCollapsed ? '0' : '1'}
      style={portColorStyle}
      onPointerEnter={() => {
        if (direction === 'out' && onOutputPointerEnter !== undefined) {
          onOutputPointerEnter(payload)
        }
        if (
          direction === 'in' &&
          inputWiringDisabled !== true &&
          onInputPointerEnter !== undefined
        ) {
          onInputPointerEnter(payload)
        }
      }}
      onPointerLeave={() => {
        if (direction === 'out' && onOutputPointerLeave !== undefined) {
          onOutputPointerLeave(payload)
        }
        if (
          direction === 'in' &&
          inputWiringDisabled !== true &&
          onInputPointerLeave !== undefined
        ) {
          onInputPointerLeave(payload)
        }
      }}
      onContextMenu={(event) => {
        if (onContextMenu === undefined) {
          return
        }
        onContextMenu(event, payload)
      }}
    >
      <div className="SpaghettiPortMain" title={describePortType(port)}>
        <span
          ref={setPortElement}
          className={`SpaghettiPortAnchor SpaghettiPortAnchor--${direction} ${portAnchorKindClass(port.type.kind)} ${
            direction === 'in' && inputWiringDisabled ? 'SpaghettiPortAnchor--disabled' : ''
          }`}
          style={{ backgroundColor: socketColor }}
          onPointerDown={(event) => {
            event.stopPropagation()
            if (event.button !== 0) {
              return
            }
            if (direction === 'out' && onOutputPointerDown !== undefined) {
              onOutputPointerDown(event, payload)
              return
            }
            if (direction === 'in' && onInputPointerDown !== undefined) {
              if (inputWiringDisabled) {
                return
              }
              onInputPointerDown(event, payload)
            }
          }}
        />
        <div className="SpaghettiPortHeader">
          <div
            className={`SpaghettiPortHeaderLeft ${canCycleRow ? 'isRowToggle' : ''}`}
            {...(canCycleRow ? SP_INTERACTIVE_PROPS : {})}
            onClick={canCycleRow ? handleCycleRow : undefined}
          >
            {onToggleRowExpanded !== undefined ? (
              <button
                type="button"
                className="SpaghettiPortChevron SpaghettiPortChevron--leading"
                {...SP_INTERACTIVE_PROPS}
                aria-label={
                  rowToggleAriaLabel ??
                  (rowCollapsed ? 'Expand input row' : 'Collapse input row')
                }
                onClick={handleCycleRow}
              >
                {rowChevronGlyph}
              </button>
            ) : onCycleRowChevron !== undefined ? (
              <button
                type="button"
                className="SpaghettiPortChevron SpaghettiPortChevron--leading"
                {...SP_INTERACTIVE_PROPS}
                aria-label={
                  rowToggleAriaLabel ??
                  (rowCollapsed ? 'Expand input row' : 'Collapse input row')
                }
                onClick={handleCycleRow}
              >
                {rowChevronGlyph}
              </button>
            ) : null}
            <span className="SpaghettiPortName">{labelOverride ?? port.label}</span>
          </div>
          <div
            className={`SpaghettiPortHeaderRight ${
              direction === 'out' ? 'SpaghettiPortHeaderRight--out' : ''
            }`}
          >
            <span className="SpaghettiPortType">{resolvedValueLabel ?? describePortType(port)}</span>
            {!rowCollapsed && onToggleComposite !== undefined ? (
              <button
                type="button"
                className="SpaghettiPortChevron"
                {...SP_INTERACTIVE_PROPS}
                aria-label={
                  compositeExpanded === true ? 'Collapse composite fields' : 'Expand composite fields'
                }
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleComposite()
                }}
              >
                {compositeExpanded === true ? '\u25BE' : '\u25B8'}
              </button>
            ) : null}
            {!rowCollapsed && !hideDetailsToggle && onToggleDetails !== undefined ? (
              <button
                type="button"
                className="SpaghettiPortChevron SpaghettiPortChevron--details"
                {...SP_INTERACTIVE_PROPS}
                aria-label={detailsExpanded ? 'Hide details' : 'Show details'}
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleDetails()
                }}
              >
                {detailsExpanded ? '\u25BE' : '\u25B8'}
              </button>
            ) : null}
          </div>
        </div>
        {!rowCollapsed && inlineValueInputs !== undefined && inlineValueInputs.length > 0 ? (
          <div className="SpaghettiPortInlineValueBars">
            {inlineValueInputs.map((inlineInput) => (
              <div key={inlineInput.id} className="SpaghettiPortInlineValueBar">
                <NumberField
                  value={inlineInput.value}
                  min={inlineInput.min}
                  max={inlineInput.max}
                  step={inlineInput.step}
                  disabled={inlineInput.disabled}
                  driven={inlineInput.driven}
                  onChange={inlineInput.onChange}
                  scrubSpeed={scrubSpeed}
                  tone={valueBarTone}
                  scrubLabel={inlineInput.label}
                  compact
                />
              </div>
            ))}
          </div>
        ) : !rowCollapsed && valueInput !== undefined ? (
          <>
            <NumberField
              value={valueInput.value}
              min={valueInput.min}
              max={valueInput.max}
              step={valueInput.step}
              disabled={valueInput.disabled}
              driven={valueInput.driven}
              onChange={valueInput.onChange}
              scrubSpeed={scrubSpeed}
              tone={valueBarTone}
              scrubLabel={labelOverride ?? port.label}
            />
            {valueInput.showSlider === true ? (
              <input
                className="SpaghettiPortRangeInput"
                {...SP_INTERACTIVE_PROPS}
                type="range"
                min={valueInput.min ?? 0}
                max={valueInput.max ?? 100}
                step={valueInput.step ?? 0.1}
                value={valueInput.value}
                disabled={valueInput.disabled === true}
                onChange={(event) => {
                  if (valueInput.disabled === true) {
                    return
                  }
                  const nextValue = Number(event.target.value)
                  if (!Number.isFinite(nextValue)) {
                    return
                  }
                  valueInput.onChange(nextValue)
                }}
                onClick={(event) => event.stopPropagation()}
              />
            ) : null}
          </>
        ) : null}
        {!rowCollapsed && drivenMessage !== undefined ? (
          <div className="SpaghettiPortDrivenMessage">{drivenMessage}</div>
        ) : null}
      </div>
      {!rowCollapsed && attachedBodyContent !== undefined ? (
        <div className="SpaghettiPortDetailsBox SpaghettiPortDetailsBox--custom">
          {attachedBodyContent}
        </div>
      ) : !rowCollapsed && detailsExpanded ? (
        <div className="SpaghettiPortDetailsBox">
          <div className="SpaghettiPortDetailsSection">
            {detailsTitle !== undefined ? (
              <div className="SpaghettiPortDetailsTitle">{detailsTitle}</div>
            ) : null}
            <div className="SpaghettiPortDetails">
              {(details ?? []).map((line, index) => (
                <div
                  key={`${resolvedPortId}-${line.text}-${index}`}
                  className={`SpaghettiPortDetail SpaghettiPortDetail--${direction} ${detailKindClass(line.kind)}`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
