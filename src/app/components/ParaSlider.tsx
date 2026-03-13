import { useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'

type ParaSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  clampMin?: number
  clampMax?: number
  isEditingClamp?: boolean
  onClampChange?: (range: { min: number; max: number }) => void
  formatValue?: (value: number) => string
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const quantize = (value: number, min: number, step: number): number => {
  if (step <= 0) {
    return value
  }
  const steps = Math.round((value - min) / step)
  return min + steps * step
}

const normalizeValue = (value: number, min: number, max: number, step: number): number =>
  clamp(Number(quantize(value, min, step).toFixed(4)), min, max)

export function ParaSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  clampMin,
  clampMax,
  isEditingClamp = false,
  onClampChange,
  formatValue = (nextValue) => `${nextValue}`,
}: ParaSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const normalizedValue = normalizeValue(value, min, max, step)
  const normalizedClampMin = normalizeValue(clampMin ?? min, min, max, step)
  const normalizedClampMax = normalizeValue(clampMax ?? max, min, max, step)
  const effectiveClampMin = Math.min(normalizedClampMin, normalizedClampMax)
  const effectiveClampMax = Math.max(normalizedClampMin, normalizedClampMax)
  const fillPercent = useMemo(() => {
    if (max <= min || normalizedValue <= effectiveClampMin) {
      return 0
    }
    return ((normalizedValue - effectiveClampMin) / (max - min)) * 100
  }, [effectiveClampMin, max, min, normalizedValue])
  const normalizedFillPercent = useMemo(() => {
    if (effectiveClampMax <= effectiveClampMin || normalizedValue <= effectiveClampMin) {
      return 0
    }
    return ((normalizedValue - effectiveClampMin) / (effectiveClampMax - effectiveClampMin)) * 100
  }, [effectiveClampMax, effectiveClampMin, normalizedValue])
  const clampStartPercent = useMemo(() => {
    if (max <= min) {
      return 0
    }
    return ((effectiveClampMin - min) / (max - min)) * 100
  }, [effectiveClampMin, max, min])
  const clampWidthPercent = useMemo(() => {
    if (max <= min) {
      return 0
    }
    return ((effectiveClampMax - effectiveClampMin) / (max - min)) * 100
  }, [effectiveClampMax, effectiveClampMin, max, min])
  const valuePercent = useMemo(() => {
    if (max <= min) {
      return 0
    }
    return ((normalizedValue - min) / (max - min)) * 100
  }, [max, min, normalizedValue])
  const normalizedValuePercent = useMemo(() => {
    if (effectiveClampMax <= effectiveClampMin) {
      return 0
    }
    return ((normalizedValue - effectiveClampMin) / (effectiveClampMax - effectiveClampMin)) * 100
  }, [effectiveClampMax, effectiveClampMin, normalizedValue])

  const updateFromClientX = (clientX: number) => {
    const trackElement = trackRef.current
    if (trackElement === null) {
      return
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return
    }
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    const nextValue = isEditingClamp
      ? clamp(
          normalizeValue(min + ratio * (max - min), min, max, step),
          effectiveClampMin,
          effectiveClampMax,
        )
      : normalizeValue(
          effectiveClampMin + ratio * (effectiveClampMax - effectiveClampMin),
          effectiveClampMin,
          effectiveClampMax,
          step,
        )
    onChange(nextValue)
  }

  const updateClampFromClientX = (clientX: number, edge: 'min' | 'max') => {
    const trackElement = trackRef.current
    if (trackElement === null || onClampChange === undefined) {
      return
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return
    }
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    const nextRawValue = normalizeValue(min + ratio * (max - min), min, max, step)
    if (edge === 'min') {
      onClampChange({
        min: Math.min(nextRawValue, effectiveClampMax),
        max: effectiveClampMax,
      })
      return
    }
    onClampChange({
      min: effectiveClampMin,
      max: Math.max(nextRawValue, effectiveClampMin),
    })
  }

  const startPointerDrag = (
    event: ReactPointerEvent<HTMLElement>,
    mode: 'value' | 'clamp-min' | 'clamp-max',
  ) => {
    if (event.button !== 0) {
      return
    }
    if (mode === 'value') {
      updateFromClientX(event.clientX)
    } else {
      updateClampFromClientX(event.clientX, mode === 'clamp-min' ? 'min' : 'max')
    }
    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (mode === 'value') {
        updateFromClientX(moveEvent.clientX)
        return
      }
      updateClampFromClientX(moveEvent.clientX, mode === 'clamp-min' ? 'min' : 'max')
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
  }

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isEditingClamp && onClampChange !== undefined) {
      const trackElement = trackRef.current
      if (trackElement === null) {
        return
      }
      const rect = trackElement.getBoundingClientRect()
      const leftHandleX = rect.left + (clampStartPercent / 100) * rect.width
      const rightHandleX = rect.left + ((clampStartPercent + clampWidthPercent) / 100) * rect.width
      const edge =
        Math.abs(event.clientX - leftHandleX) <= Math.abs(event.clientX - rightHandleX)
          ? 'clamp-min'
          : 'clamp-max'
      startPointerDrag(event, edge)
      return
    }
    startPointerDrag(event, 'value')
  }

  const changeByStep = (direction: -1 | 1) => {
    onChange(
      clamp(
        normalizeValue(normalizedValue + direction * step, min, max, step),
        effectiveClampMin,
        effectiveClampMax,
      ),
    )
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        changeByStep(-1)
        event.preventDefault()
        return
      case 'ArrowRight':
      case 'ArrowUp':
        changeByStep(1)
        event.preventDefault()
        return
      case 'Home':
        onChange(effectiveClampMin)
        event.preventDefault()
        return
      case 'End':
        onChange(effectiveClampMax)
        event.preventDefault()
        return
      default:
        return
    }
  }

  return (
    <div className="ParaSlider">
      <button
        type="button"
        className="ParaSliderCap ParaSliderCap--left"
        aria-label={`Decrease ${label}`}
        onClick={() => changeByStep(-1)}
      >
        {'<'}
      </button>
      <div
        ref={trackRef}
        className={`ParaSliderTrack ${isEditingClamp ? 'isClampEditing' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={effectiveClampMin}
        aria-valuemax={effectiveClampMax}
        aria-valuenow={normalizedValue}
        aria-valuetext={formatValue(normalizedValue)}
        onPointerDown={handleTrackPointerDown}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`ParaSliderClampRange ${isEditingClamp ? 'isClampEditing' : ''}`}
          style={{
            left: `${clampStartPercent}%`,
            width: `${clampWidthPercent}%`,
          }}
        />
        <div
          className="ParaSliderFill"
          style={{
            left: isEditingClamp ? `${clampStartPercent}%` : '0%',
            width: isEditingClamp ? `${fillPercent}%` : `${normalizedFillPercent}%`,
          }}
        />
        <div
          className="ParaSliderValueMarker"
          style={{ left: isEditingClamp ? `${valuePercent}%` : `${normalizedValuePercent}%` }}
        />
        {isEditingClamp ? (
          <>
            <button
              type="button"
              className="ParaSliderClampHandle ParaSliderClampHandle--left"
              style={{ left: `${clampStartPercent}%` }}
              aria-label={`Adjust minimum ${label} clamp`}
              onPointerDown={(event) => startPointerDrag(event, 'clamp-min')}
              onDoubleClick={() => onClampChange?.({ min, max: effectiveClampMax })}
            />
            <button
              type="button"
              className="ParaSliderClampHandle ParaSliderClampHandle--right"
              style={{ left: `${clampStartPercent + clampWidthPercent}%` }}
              aria-label={`Adjust maximum ${label} clamp`}
              onPointerDown={(event) => startPointerDrag(event, 'clamp-max')}
              onDoubleClick={() => onClampChange?.({ min: effectiveClampMin, max })}
            />
          </>
        ) : null}
        <div className="ParaSliderContent">
          <span className="ParaSliderLabel">{label}</span>
          <span className="ParaSliderValue">{formatValue(normalizedValue)}</span>
        </div>
      </div>
      <button
        type="button"
        className="ParaSliderCap ParaSliderCap--right"
        aria-label={`Increase ${label}`}
        onClick={() => changeByStep(1)}
      >
        {'>'}
      </button>
    </div>
  )
}
