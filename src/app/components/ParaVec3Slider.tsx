import { ParaSlider } from './ParaSlider'

type Vec3Axis = 'x' | 'y' | 'z'

type Vec3Value = {
  x: number
  y: number
  z: number
}

type ParaVec3SliderProps = {
  value: Vec3Value
  min: number
  max: number
  step: number
  onChangeAxis: (axis: Vec3Axis, value: number) => void
  onActivate?: () => void
  onChangeEndAxis?: (axis: Vec3Axis, value: number) => void
  allowWrap?: boolean
  showContinuousDragPreview?: boolean
  formatValue?: (axis: Vec3Axis, value: number) => string
  displayValue?: (axis: Vec3Axis, value: number) => string
}

const axisOrder: readonly Vec3Axis[] = ['x', 'y', 'z'] as const

export function ParaVec3Slider({
  value,
  min,
  max,
  step,
  onChangeAxis,
  onActivate,
  onChangeEndAxis,
  allowWrap = false,
  showContinuousDragPreview = false,
  formatValue = (_axis, nextValue) => `${nextValue}`,
  displayValue = (_axis, nextValue) => `${nextValue}`,
}: ParaVec3SliderProps) {
  return (
    <div className="ParaVec3Slider">
      {axisOrder.map((axis) => (
        <div key={axis} className="ParaVec3SliderAxis">
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
            onActivate={onActivate}
            onChange={(nextValue) => onChangeAxis(axis, nextValue)}
            onChangeEnd={
              onChangeEndAxis === undefined
                ? undefined
                : (nextValue) => onChangeEndAxis(axis, nextValue)
            }
            formatValue={(nextValue) => formatValue(axis, nextValue)}
          />
        </div>
      ))}
    </div>
  )
}
