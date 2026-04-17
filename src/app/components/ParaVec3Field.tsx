import { useId, useState } from 'react'
import { ParaVec3Slider } from './ParaVec3Slider'

type Vec3Axis = 'x' | 'y' | 'z'

type Vec3Value = {
  x: number
  y: number
  z: number
}

type ParaVec3FieldProps = {
  label: string
  value: Vec3Value
  min: number
  max: number
  step: number
  onChangeAxis: (axis: Vec3Axis, value: number) => void
  onChangeEndAxis?: (axis: Vec3Axis, value: number) => void
  allowWrap?: boolean
  showContinuousDragPreview?: boolean
  formatValue?: (axis: Vec3Axis, value: number) => string
  displayValue?: (axis: Vec3Axis, value: number) => string
  defaultExpanded?: boolean
  className?: string
}

export function ParaVec3Field({
  label,
  value,
  min,
  max,
  step,
  onChangeAxis,
  onChangeEndAxis,
  allowWrap = false,
  showContinuousDragPreview = false,
  formatValue = (_axis, nextValue) => `${nextValue}`,
  displayValue,
  defaultExpanded = false,
  className,
}: ParaVec3FieldProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const bodyId = useId()
  const resolvedDisplayValue = (axis: Vec3Axis, nextValue: number): string =>
    displayValue?.(axis, nextValue) ?? formatValue(axis, nextValue)

  return (
    <div
      className={`ParaVec3Field${isExpanded ? ' isExpanded' : ''}${
        className === undefined || className.length === 0 ? '' : ` ${className}`
      }`}
    >
      <button
        type="button"
        className="ParaVec3FieldHeader"
        aria-label={`Toggle ${label}`}
        aria-expanded={isExpanded}
        aria-controls={bodyId}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span className="ParaVec3FieldLabel">{label}</span>
        <span className="ParaVec3FieldToggle" aria-hidden="true">
          {isExpanded ? 'v' : '>'}
        </span>
      </button>
      {isExpanded ? (
        <div id={bodyId} className="ParaVec3FieldBody">
          <ParaVec3Slider
            value={value}
            min={min}
            max={max}
            step={step}
            layout="stacked"
            onChangeAxis={onChangeAxis}
            onChangeEndAxis={onChangeEndAxis}
            allowWrap={allowWrap}
            showContinuousDragPreview={showContinuousDragPreview}
            formatValue={formatValue}
            displayValue={resolvedDisplayValue}
          />
        </div>
      ) : (
        <div id={bodyId} className="ParaVec3FieldCompact">
          <ParaVec3Slider
            value={value}
            min={min}
            max={max}
            step={step}
            layout="compact"
            onChangeAxis={onChangeAxis}
            onChangeEndAxis={onChangeEndAxis}
            allowWrap={allowWrap}
            showContinuousDragPreview={showContinuousDragPreview}
            formatValue={formatValue}
            displayValue={resolvedDisplayValue}
          />
        </div>
      )}
    </div>
  )
}
