import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { ParaSlider } from '../../components/ParaSlider'
import type { PortKind, PortSpec } from '../schema/spaghettiTypes'
import { NumberField } from './fields/NumberField'
import type { StructuredWireRowMode } from './nodeTemplateContract'
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
  renderAs?: 'numberField' | 'paraSlider'
  primitiveRow?: boolean
  disabled?: boolean
  driven?: boolean
  formatValue?: (value: number) => string
  displayLabel?: string
  displayValue?: string
  displayedTrackValue?: number
  className?: string
  hideSliderCaps?: boolean
  unitLabel?: string
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
  className?: string
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
  rowChevronState?: StructuredWireRowMode
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
const clampNumber = (value: number, min?: number, max?: number): number => {
  if (min !== undefined && value < min) {
    return min
  }
  if (max !== undefined && value > max) {
    return max
  }
  return value
}

const getStepPrecision = (step: number): number => {
  const asText = step.toString()
  const dotIndex = asText.indexOf('.')
  return dotIndex < 0 ? 0 : asText.length - dotIndex - 1
}

export function PortView({
  className,
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
  const headerValueLabel = resolvedValueLabel ?? describePortType(port)
  const isOutputRow = direction === 'out'
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
  const rendersPrimitiveValueRow =
    valueInput?.renderAs === 'paraSlider' && valueInput.primitiveRow === true
  const showsAttachedBody =
    !rendersPrimitiveValueRow && !rowCollapsed && attachedBodyContent !== undefined
  const primitiveStep = valueInput?.step ?? 0.1
  const primitivePrecision = useMemo(() => getStepPrecision(primitiveStep), [primitiveStep])
  const [primitiveEditorValue, setPrimitiveEditorValue] = useState('')
  const primitiveLaneRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!rendersPrimitiveValueRow || valueInput === undefined) {
      return
    }
    setPrimitiveEditorValue(valueInput.value.toFixed(primitivePrecision))
  }, [primitivePrecision, rendersPrimitiveValueRow, valueInput])

  const primitiveFillPercent = useMemo(() => {
    if (!rendersPrimitiveValueRow || valueInput === undefined) {
      return 0
    }
    const min = valueInput.min
    const max = valueInput.max
    const displayedValue = valueInput.displayedTrackValue ?? valueInput.value
    if (
      min === undefined ||
      max === undefined ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      max <= min
    ) {
      return 0
    }
    return Math.min(100, Math.max(0, ((displayedValue - min) / (max - min)) * 100))
  }, [rendersPrimitiveValueRow, valueInput])

  const commitPrimitiveEditorValue = () => {
    if (!rendersPrimitiveValueRow || valueInput === undefined || valueInput.disabled === true) {
      return
    }
    const nextValue = Number(primitiveEditorValue)
    if (!Number.isFinite(nextValue)) {
      setPrimitiveEditorValue(valueInput.value.toFixed(primitivePrecision))
      return
    }
    const rounded = Number(nextValue.toFixed(primitivePrecision))
    valueInput.onChange(clampNumber(rounded, valueInput.min, valueInput.max))
  }

  const stepPrimitiveValue = (deltaSteps: number) => {
    if (!rendersPrimitiveValueRow || valueInput === undefined || valueInput.disabled === true) {
      return
    }
    const raw = valueInput.value + deltaSteps * primitiveStep
    const rounded = Number(raw.toFixed(primitivePrecision))
    valueInput.onChange(clampNumber(rounded, valueInput.min, valueInput.max))
  }

  const resolvePrimitiveValueFromClientX = (clientX: number): number | null => {
    if (!rendersPrimitiveValueRow || valueInput === undefined) {
      return null
    }
    const laneElement = primitiveLaneRef.current
    if (laneElement === null) {
      return null
    }
    const min = valueInput.min
    const max = valueInput.max
    if (
      min === undefined ||
      max === undefined ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      max <= min
    ) {
      return null
    }
    const rect = laneElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return null
    }
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const rawValue = min + ratio * (max - min)
    const rounded = Number(rawValue.toFixed(primitivePrecision))
    return clampNumber(rounded, min, max)
  }

  const startPrimitiveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!rendersPrimitiveValueRow || valueInput === undefined || valueInput.disabled === true) {
      return
    }
    if (event.button !== 0) {
      return
    }
    const applyClientX = (clientX: number) => {
      const nextValue = resolvePrimitiveValueFromClientX(clientX)
      if (nextValue === null) {
        return
      }
      valueInput.onChange(nextValue)
    }
    applyClientX(event.clientX)
    const handlePointerMove = (moveEvent: PointerEvent) => {
      applyClientX(moveEvent.clientX)
    }
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      className={`SpaghettiPort SpRow ${
        direction === 'in' ? 'SpRow--input' : 'SpRow--output'
      } SpaghettiPort--${direction} ${portKindClass(port.type.kind)} ${
        childTone ? 'SpaghettiPort--child' : ''
      } ${direction === 'in' && inputWiringDisabled ? 'SpaghettiPort--input-disabled' : ''} ${
        drivenMessage !== undefined ? 'SpaghettiPort--driven' : ''
      } ${dropStateClass}${className === undefined || className.length === 0 ? '' : ` ${className}`}`}
      data-sp-port-row-open={rowCollapsed ? '0' : '1'}
      data-sp-endpoint-port-id={resolvedPortId}
      data-sp-endpoint-path={endpointPath?.join('.') ?? ''}
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
      <div
        className={`SpaghettiPortMain${rendersPrimitiveValueRow ? ' SpaghettiPortMain--primitiveValue' : ''}`}
        title={describePortType(port)}
      >
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
        {rendersPrimitiveValueRow ? (
          <div className="SpaghettiPortPrimitiveValueRow">
            <button
              type="button"
              className="SpaghettiPortPrimitiveEndcap SpaghettiPortPrimitiveEndcap--left"
              {...SP_INTERACTIVE_PROPS}
              aria-label={`Decrease ${labelOverride ?? port.label}`}
              disabled={valueInput.disabled === true}
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onClick={(event) => {
                event.stopPropagation()
                stepPrimitiveValue(-1)
              }}
            >
              <svg
                className="SpaghettiPortPrimitiveEndcapIcon"
                viewBox="0 0 8 8"
                aria-hidden="true"
              >
                <polyline points="5.25,1.5 2.75,4 5.25,6.5" />
              </svg>
            </button>
            <span className="SpaghettiPortPrimitiveDivider" aria-hidden="true" />
            <div
              ref={primitiveLaneRef}
              className="SpaghettiPortPrimitiveLane"
              onPointerDown={startPrimitiveDrag}
            >
              <div
                className="SpaghettiPortPrimitiveFill"
                style={{
                  width: primitiveFillPercent <= 0 ? '0%' : `${primitiveFillPercent.toFixed(3)}%`,
                  minWidth: primitiveFillPercent > 0 ? '6px' : undefined,
                }}
                aria-hidden="true"
              />
              <div
                className="SpaghettiPortPrimitiveValueMarker"
                style={{ left: `${primitiveFillPercent.toFixed(3)}%` }}
                aria-hidden="true"
              />
              <div className="SpaghettiPortPrimitiveLaneContent">
                <span className="SpaghettiPortPrimitiveLabel">{labelOverride ?? port.label}</span>
                <div className="SpaghettiPortPrimitiveValueWrap">
                  <input
                    className="SpaghettiPortPrimitiveValueInput"
                    {...SP_INTERACTIVE_PROPS}
                    type="number"
                    min={valueInput.min}
                    max={valueInput.max}
                    step={primitiveStep}
                    value={primitiveEditorValue}
                    disabled={valueInput.disabled === true}
                    aria-label={`Edit ${labelOverride ?? port.label} value`}
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      setPrimitiveEditorValue(event.target.value)
                    }}
                    onBlur={() => {
                      commitPrimitiveEditorValue()
                    }}
                    onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
                      event.stopPropagation()
                      if (event.key === 'Enter') {
                        commitPrimitiveEditorValue()
                        return
                      }
                      if (event.key === 'Escape' && valueInput !== undefined) {
                        setPrimitiveEditorValue(valueInput.value.toFixed(primitivePrecision))
                      }
                    }}
                  />
                  <span className="SpaghettiPortPrimitiveUnit">{valueInput.unitLabel}</span>
                </div>
              </div>
              {drivenMessage !== undefined ? (
                <span className="SpaghettiPortPrimitiveDrivenMessage">{drivenMessage}</span>
              ) : null}
            </div>
            <span className="SpaghettiPortPrimitiveDivider" aria-hidden="true" />
            <button
              type="button"
              className="SpaghettiPortPrimitiveEndcap SpaghettiPortPrimitiveEndcap--right"
              {...SP_INTERACTIVE_PROPS}
              aria-label={`Increase ${labelOverride ?? port.label}`}
              disabled={valueInput.disabled === true}
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onClick={(event) => {
                event.stopPropagation()
                stepPrimitiveValue(1)
              }}
            >
              <svg
                className="SpaghettiPortPrimitiveEndcapIcon"
                viewBox="0 0 8 8"
                aria-hidden="true"
              >
                <polyline points="2.75,1.5 5.25,4 2.75,6.5" />
              </svg>
            </button>
          </div>
        ) : (
          <>
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
                data-sp-port-header-lane={isOutputRow ? 'status' : 'value'}
              >
                <span
                  className={`SpaghettiPortType${isOutputRow ? ' SpaghettiPortHeaderStatus' : ''}`}
                  {...(isOutputRow ? { 'data-sp-port-header-status': '1' } : {})}
                >
                  {headerValueLabel}
                </span>
                {!rowCollapsed && onToggleComposite !== undefined ? (
                  <button
                    type="button"
                    className="SpaghettiPortChevron"
                    {...SP_INTERACTIVE_PROPS}
                    aria-label={
                      compositeExpanded === true
                        ? 'Collapse composite fields'
                        : 'Expand composite fields'
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
            {valueInput.renderAs === 'paraSlider' ? (
              <ParaSlider
                label={labelOverride ?? port.label}
                displayLabel={valueInput.displayLabel}
                value={valueInput.value}
                displayedTrackValue={valueInput.displayedTrackValue}
                min={valueInput.min ?? 0}
                max={valueInput.max ?? 100}
                step={valueInput.step ?? 0.1}
                disabled={valueInput.disabled === true}
                onChange={valueInput.onChange}
                formatValue={valueInput.formatValue}
                displayValue={valueInput.displayValue}
                hideCaps={valueInput.hideSliderCaps === true}
                className={valueInput.className}
              />
            ) : (
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
            )}
          </>
        ) : null}
          </>
        )}
        {!rendersPrimitiveValueRow && !rowCollapsed && drivenMessage !== undefined ? (
          <div className="SpaghettiPortDrivenMessage">{drivenMessage}</div>
        ) : null}
      </div>
      {showsAttachedBody ? (
        <div
          className="SpaghettiPortDetailsBox SpaghettiPortDetailsBox--custom SpaghettiPortAttachedBody"
          data-sp-port-attached-body={isOutputRow ? 'output' : 'input'}
        >
          {attachedBodyContent}
        </div>
      ) : !rendersPrimitiveValueRow && !rowCollapsed && detailsExpanded ? (
        <div
          className="SpaghettiPortDetailsBox SpaghettiPortAttachedBody"
          data-sp-port-attached-body={isOutputRow ? 'output' : 'input'}
        >
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
