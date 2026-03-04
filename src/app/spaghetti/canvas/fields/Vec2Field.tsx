import { NumberField } from './NumberField'
import { SP_INTERACTIVE_PROPS } from '../../spInteractive'

type Vec2AxisField = {
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  driven?: boolean
  onChange: (value: number) => void
}

type Vec2FieldProps = {
  x: Vec2AxisField
  y: Vec2AxisField
  scrubSpeed?: number
  tone?: 'blue' | 'white'
}

export function Vec2Field({ x, y, scrubSpeed = 0, tone = 'blue' }: Vec2FieldProps) {
  return (
    <div className="SpVec2Field" {...SP_INTERACTIVE_PROPS}>
      <div className="SpVec2FieldAxis">
        <span className="SpVec2FieldAxisLabel">X</span>
        <NumberField
          scrubLabel=""
          value={x.value}
          min={x.min}
          max={x.max}
          step={x.step}
          disabled={x.disabled}
          driven={x.driven}
          scrubSpeed={scrubSpeed}
          tone={tone}
          compact
          onChange={x.onChange}
        />
      </div>
      <div className="SpVec2FieldAxis">
        <span className="SpVec2FieldAxisLabel">Y</span>
        <NumberField
          scrubLabel=""
          value={y.value}
          min={y.min}
          max={y.max}
          step={y.step}
          disabled={y.disabled}
          driven={y.driven}
          scrubSpeed={scrubSpeed}
          tone={tone}
          compact
          onChange={y.onChange}
        />
      </div>
    </div>
  )
}
