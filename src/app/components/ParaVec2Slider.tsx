import { ParaSlider } from './ParaSlider'

type Vec2Axis = 'x' | 'y'

type Vec2Value = {
  x: number
  y: number
}

type Vec2ClampRange = {
  min: number
  max: number
}

type ParaVec2SliderProps = {
  value: Vec2Value
  min: number
  max: number
  step: number
  onChangeAxis: (axis: Vec2Axis, value: number) => void
  clampMin?: Partial<Record<Vec2Axis, number>>
  clampMax?: Partial<Record<Vec2Axis, number>>
  isEditingClamp?: boolean
  onClampChangeAxis?: (axis: Vec2Axis, range: Vec2ClampRange) => void
  allowWrap?: boolean
  showContinuousDragPreview?: boolean
  formatValue?: (axis: Vec2Axis, value: number) => string
  displayValue?: (axis: Vec2Axis, value: number) => string
}

const axisOrder: readonly Vec2Axis[] = ['x', 'y'] as const

export function ParaVec2Slider({
  value,
  min,
  max,
  step,
  onChangeAxis,
  clampMin,
  clampMax,
  isEditingClamp = false,
  onClampChangeAxis,
  allowWrap = false,
  showContinuousDragPreview = false,
  formatValue = (_axis, nextValue) => `${nextValue}`,
  displayValue = (_axis, nextValue) => `${nextValue}`,
}: ParaVec2SliderProps) {
  return (
    <div className="ParaVec2Slider">
      {axisOrder.map((axis) => (
        <div key={axis} className="ParaVec2SliderAxis">
          <ParaSlider
            label={axis.toUpperCase()}
            displayLabel={
              isEditingClamp
                ? formatValue(
                    axis,
                    Math.min(clampMin?.[axis] ?? min, clampMax?.[axis] ?? max),
                  )
                : axis.toUpperCase()
            }
            displayValue={
              isEditingClamp
                ? formatValue(
                    axis,
                    Math.max(clampMin?.[axis] ?? min, clampMax?.[axis] ?? max),
                  )
                : displayValue(axis, value[axis])
            }
            value={value[axis]}
            min={min}
            max={max}
            step={step}
            clampMin={clampMin?.[axis]}
            clampMax={clampMax?.[axis]}
            isEditingClamp={isEditingClamp}
            onClampChange={
              onClampChangeAxis === undefined
                ? undefined
                : (nextRange) => onClampChangeAxis(axis, nextRange)
            }
            allowWrap={allowWrap}
            showContinuousDragPreview={showContinuousDragPreview}
            hideCaps
            onChange={(nextValue) => onChangeAxis(axis, nextValue)}
            formatValue={(nextValue) => formatValue(axis, nextValue)}
          />
        </div>
      ))}
    </div>
  )
}
