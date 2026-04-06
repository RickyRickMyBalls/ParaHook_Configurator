import { type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { ParaSelect } from '../../components/ParaSelect'
import { SP_INTERACTIVE_PROPS } from '../spInteractive'
import type { PortSpec } from '../schema/spaghettiTypes'
import { getTypeColor } from './typeColors'
import type { StructuredWireEnumRowProps } from './structuredWireEnumRowProps'

type PortDropState = 'compatible' | 'incompatible' | null

type EndpointPayload = {
  nodeId: string
  portId: string
  path?: string[]
}

type StructuredWireEnumRowViewProps = StructuredWireEnumRowProps & {
  className?: string
  nodeId: string
  endpointPortId?: string
  port: PortSpec
  setPortElement: (element: HTMLElement | null) => void
  dropState: PortDropState
  portColorOverride?: string
  inputWiringDisabled?: boolean
  onInputPointerDown?: (
    event: ReactPointerEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onInputPointerEnter?: (payload: EndpointPayload) => void
  onInputPointerLeave?: (payload: EndpointPayload) => void
}

const describePortType = (port: PortSpec): string =>
  port.type.unit === undefined ? port.type.kind : `${port.type.kind}:${port.type.unit}`

export function StructuredWireEnumRow({
  className,
  nodeId,
  endpointPortId,
  port,
  setPortElement,
  dropState,
  portColorOverride,
  inputWiringDisabled = false,
  label,
  value,
  displayedTrackValue,
  options,
  selectedIndex,
  displayedIndex,
  optionCount,
  disabled,
  drivenMessage,
  onChange,
  onInputPointerDown,
  onInputPointerEnter,
  onInputPointerLeave,
}: StructuredWireEnumRowViewProps) {
  const socketColor = portColorOverride ?? getTypeColor(port.type.kind)
  const resolvedPortId = endpointPortId ?? port.portId
  const payload: EndpointPayload = {
    nodeId,
    portId: resolvedPortId,
  }
  const dropStateClass =
    dropState === null
      ? ''
      : dropState === 'compatible'
        ? 'SpaghettiPort--compatible'
        : 'SpaghettiPort--incompatible'
  const portColorStyle = {
    '--sp-port-color': socketColor,
  } as CSSProperties
  const canCycle = !disabled && optionCount > 1
  const renderedValue = disabled ? displayedTrackValue : value

  return (
    <div
      className={`SpaghettiEnumInputRow SpaghettiPort SpRow SpRow--input SpaghettiPort--in SpaghettiPort--kind-${port.type.kind} ${
        inputWiringDisabled ? 'SpaghettiPort--input-disabled' : ''
      } ${drivenMessage !== undefined ? 'SpaghettiPort--driven' : ''}${dropStateClass}${
        className === undefined || className.length === 0 ? '' : ` ${className}`
      }`}
      data-sp-enum-row="1"
      data-sp-enum-selected-index={selectedIndex}
      data-sp-enum-displayed-index={displayedIndex}
      data-sp-enum-option-count={optionCount}
      style={portColorStyle}
      onPointerEnter={() => {
        if (inputWiringDisabled || onInputPointerEnter === undefined) {
          return
        }
        onInputPointerEnter(payload)
      }}
      onPointerLeave={() => {
        if (inputWiringDisabled || onInputPointerLeave === undefined) {
          return
        }
        onInputPointerLeave(payload)
      }}
      {...SP_INTERACTIVE_PROPS}
    >
      <div className="SpaghettiPortMain SpaghettiPortMain--enumValue" title={describePortType(port)}>
        <span
          ref={setPortElement}
          className={`SpaghettiPortAnchor SpaghettiPortAnchor--in ${inputWiringDisabled ? 'SpaghettiPortAnchor--disabled' : ''}`}
          style={{ backgroundColor: socketColor }}
          onPointerDown={(event) => {
            event.stopPropagation()
            if (event.button !== 0 || inputWiringDisabled || onInputPointerDown === undefined) {
              return
            }
            onInputPointerDown(event, payload)
          }}
        />
        <div className="SpaghettiPortEnumValueRow">
          <ParaSelect
            label={label}
            value={renderedValue}
            displayedValue={displayedTrackValue}
            options={options}
            onChange={(nextValue) => {
              if (disabled || nextValue === value) {
                return
              }
              onChange(nextValue)
            }}
            menuMode="custom"
            capGlyph="chevron"
            disabled={!canCycle}
          />
          {drivenMessage !== undefined ? (
            <span className="SpaghettiPortPrimitiveDrivenMessage">{drivenMessage}</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
