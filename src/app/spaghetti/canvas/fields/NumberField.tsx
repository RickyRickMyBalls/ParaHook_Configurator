import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  SP_INTERACTIVE_PROPS,
  stopInteractivePointerDown,
} from '../../spInteractive'

type NumberFieldTone = 'blue' | 'white'

type NumberFieldProps = {
  id?: string
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  driven?: boolean
  compact?: boolean
  scrubSpeed?: number
  tone?: NumberFieldTone
  scrubLabel?: string
  className?: string
  onChange: (value: number) => void
}

const scrubPixelsPerStep = 0.1666666667
const highScrubPixelsPerStep = 0.0008333333

const getStepPrecision = (step: number): number => {
  const asText = step.toString()
  const dotIndex = asText.indexOf('.')
  if (dotIndex < 0) {
    return 0
  }
  return asText.length - dotIndex - 1
}

const clampNumber = (value: number, min?: number, max?: number): number => {
  if (min !== undefined && value < min) {
    return min
  }
  if (max !== undefined && value > max) {
    return max
  }
  return value
}

const applyStepDelta = (
  value: number,
  step: number,
  deltaSteps: number,
  onChange: (value: number) => void,
  min?: number,
  max?: number,
) => {
  const precision = getStepPrecision(step)
  const raw = value + deltaSteps * step
  const rounded = Number(raw.toFixed(precision))
  onChange(clampNumber(rounded, min, max))
}

export function NumberField({
  id,
  value,
  min,
  max,
  step = 0.1,
  disabled = false,
  driven = false,
  compact = false,
  scrubSpeed = 0,
  tone = 'blue',
  scrubLabel = 'Value',
  className,
  onChange,
}: NumberFieldProps) {
  const [isScrubbing, setIsScrubbing] = useState(false)
  const canStep = !disabled

  const startScrubDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      stopInteractivePointerDown(event)
      if (event.button !== 0 || disabled) {
        return
      }
      const startX = event.clientX
      const startValue = value
      let dragging = false

      const handleMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX
        const scrubPercent = clampNumber(scrubSpeed, 0, 100) / 100
        const dragThreshold = 1 + (0.25 - 1) * scrubPercent
        if (!dragging && Math.abs(deltaX) < dragThreshold) {
          return
        }
        dragging = true
        setIsScrubbing(true)
        moveEvent.preventDefault()
        const pixelsPerStep =
          scrubPixelsPerStep + (highScrubPixelsPerStep - scrubPixelsPerStep) * scrubPercent
        const deltaSteps = deltaX / pixelsPerStep
        applyStepDelta(startValue, step, deltaSteps, onChange, min, max)
      }

      const handleUp = (upEvent: PointerEvent) => {
        if (dragging) {
          upEvent.preventDefault()
        }
        setIsScrubbing(false)
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [disabled, max, min, onChange, scrubSpeed, step, value],
  )

  const stepBy = useCallback(
    (deltaSteps: number) => {
      if (!canStep) {
        return
      }
      applyStepDelta(value, step, deltaSteps, onChange, min, max)
    },
    [canStep, max, min, onChange, step, value],
  )

  const precision = getStepPrecision(step)
  const fillPercent = useMemo(() => {
    if (min === undefined || max === undefined || max <= min) {
      return 0
    }
    return clampNumber(((value - min) / (max - min)) * 100, 0, 100)
  }, [max, min, value])

  const rootClassName = [
    'SpNumberField',
    compact ? 'SpNumberField--compact' : '',
    isScrubbing ? 'isScrubbing' : '',
    disabled ? 'isDisabled' : '',
    tone === 'white' ? 'SpNumberField--white' : 'SpNumberField--blue',
    className ?? '',
  ]
    .filter((token) => token.length > 0)
    .join(' ')

  return (
    <div
      className={rootClassName}
      data-sp-interactive="1"
      onPointerDown={startScrubDrag}
      style={
        {
          '--sp-number-fill-percent': `${fillPercent}%`,
          '--sp-number-fill-ratio': `${fillPercent / 100}`,
        } as CSSProperties
      }
    >
      <span
        className={`SpNumberFieldEdge SpNumberFieldEdge--left ${canStep ? '' : 'isDisabled'}`}
        {...SP_INTERACTIVE_PROPS}
        role="button"
        aria-label={`Decrease ${scrubLabel}`}
        aria-disabled={!canStep}
        tabIndex={canStep ? 0 : -1}
        onClick={(event) => {
          event.stopPropagation()
          stepBy(-1)
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return
          }
          event.preventDefault()
          event.stopPropagation()
          stepBy(-1)
        }}
      />
      <span
        className={`SpNumberFieldEdge SpNumberFieldEdge--right ${canStep ? '' : 'isDisabled'}`}
        {...SP_INTERACTIVE_PROPS}
        role="button"
        aria-label={`Increase ${scrubLabel}`}
        aria-disabled={!canStep}
        tabIndex={canStep ? 0 : -1}
        onClick={(event) => {
          event.stopPropagation()
          stepBy(1)
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return
          }
          event.preventDefault()
          event.stopPropagation()
          stepBy(1)
        }}
      />
      {scrubLabel.length > 0 ? (
        <span className="SpNumberFieldLabel">{scrubLabel}</span>
      ) : null}
      <div className="SpNumberFieldValueWrap">
        {driven ? <span className="SpNumberFieldDrivenBadge">Driven</span> : null}
        <input
          id={id}
          className="SpNumberFieldInput"
          {...SP_INTERACTIVE_PROPS}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            if (disabled) {
              return
            }
            const nextValue = Number(event.target.value)
            if (!Number.isFinite(nextValue)) {
              return
            }
            const rounded = Number(nextValue.toFixed(precision))
            onChange(clampNumber(rounded, min, max))
          }}
        />
      </div>
    </div>
  )
}
