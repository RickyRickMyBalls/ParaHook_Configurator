import { ParaSlider } from './ParaSlider'

type Vec2Axis = 'x' | 'y'

type Vec2Value = {
  x: number
  y: number
}

type ParaVec2SliderProps = {
  value: Vec2Value
  min: number
  max: number
  step: number
  onChangeAxis: (axis: Vec2Axis, value: number) => void
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
            displayLabel={axis.toUpperCase()}
            displayValue={displayValue(axis, value[axis])}
            value={value[axis]}
            min={min}
            max={max}
            step={step}
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
