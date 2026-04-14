import { useRef } from 'react'

type FeatureValueBarProps = {
  label: string
  value: number
  onChange: (value: number) => void
  onInteractionStart?: () => void
  onInteractionEnd?: () => void
  min?: number
  max?: number
  step?: number
  compact?: boolean
  tone?: 'blue' | 'white'
  disabled?: boolean
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

const getStepPrecision = (step: number): number => {
  const asText = step.toString()
  const dotIndex = asText.indexOf('.')
  return dotIndex < 0 ? 0 : asText.length - dotIndex - 1
}

const getFillPercent = (value: number, min?: number, max?: number): number => {
  if (
    min === undefined ||
    max === undefined ||
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    max <= min
  ) {
    return 0
  }
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

export function FeatureValueBar({
  label,
  value,
  onChange,
  onInteractionStart,
  onInteractionEnd,
  min,
  max,
  step = 0.1,
  compact = false,
  tone = 'blue',
  disabled = false,
}: FeatureValueBarProps) {
  const precision = getStepPrecision(step)
  const fillPercent = getFillPercent(value, min, max)
  const fillColor =
    tone === 'white' ? 'rgba(233, 239, 252, 0.95)' : 'rgba(74, 124, 212, 0.95)'
  const skipBlurEndInteractionRef = useRef(false)

  const beginInteraction = () => {
    if (disabled) {
      return
    }
    onInteractionStart?.()
  }

  const endInteraction = () => {
    if (disabled) {
      return
    }
    onInteractionEnd?.()
  }

  const changeBy = (deltaSteps: number) => {
    if (disabled) {
      return
    }
    const raw = value + deltaSteps * step
    const rounded = Number(raw.toFixed(precision))
    onChange(clampNumber(rounded, min, max))
  }

  return (
    <div
      className={`SpaghettiValueBar ${compact ? 'SpaghettiValueBar--half' : ''} ${
        disabled ? 'SpaghettiValueBar--disabled' : ''
      }`}
    >
      <button
        type="button"
        className="SpaghettiValueBarArrow"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation()
          beginInteraction()
          changeBy(-1)
          endInteraction()
        }}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={`Decrease ${label}`}
      >
        {'<'}
      </button>
      <div
        className={`SpaghettiValueBarTrack ${disabled ? 'SpaghettiValueBarTrack--disabled' : ''}`}
        style={{
          background: `linear-gradient(90deg, ${fillColor} 0%, ${fillColor} ${fillPercent}%, rgba(255, 255, 255, 0.16) ${fillPercent}%, rgba(255, 255, 255, 0.16) 100%)`,
        }}
      >
        <span className="SpaghettiValueBarLabel">{label}</span>
        <div className="SpaghettiValueBarMeta">
          <input
            className="SpaghettiValueBarInput"
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onFocus={() => {
              skipBlurEndInteractionRef.current = false
              beginInteraction()
            }}
            onChange={(event) => {
              if (disabled) {
                return
              }
              const nextValue = Number(event.target.value)
              if (!Number.isFinite(nextValue)) {
                return
              }
              onChange(clampNumber(Number(nextValue.toFixed(precision)), min, max))
            }}
            onBlur={() => {
              if (skipBlurEndInteractionRef.current) {
                skipBlurEndInteractionRef.current = false
                return
              }
              endInteraction()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                event.stopPropagation()
                skipBlurEndInteractionRef.current = true
                endInteraction()
                event.currentTarget.blur()
              }
            }}
          />
        </div>
      </div>
      <button
        type="button"
        className="SpaghettiValueBarArrow"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation()
          beginInteraction()
          changeBy(1)
          endInteraction()
        }}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={`Increase ${label}`}
      >
        {'>'}
      </button>
    </div>
  )
}
