import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

type ParaSliderProps = {
  label: string
  value: number
  displayedTrackValue?: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  allowWrap?: boolean
  showContinuousDragPreview?: boolean
  clampMin?: number
  clampMax?: number
  isEditingClamp?: boolean
  onClampChange?: (range: { min: number; max: number }) => void
  formatValue?: (value: number) => string
  displayLabel?: string
  displayValue?: string
  onContextMenu?: (event: ReactMouseEvent<HTMLElement>) => void
  hideCaps?: boolean
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

const clampValue = (value: number, min: number, max: number): number =>
  clamp(Number(value.toFixed(4)), min, max)

const wrapValue = (value: number, min: number, max: number): number => {
  if (max <= min) {
    return min
  }
  const range = max - min
  const wrapped = (((value - min) % range) + range) % range + min
  if (Math.abs(wrapped - min) < 0.0001 && value > min) {
    return max
  }
  return Number(wrapped.toFixed(4))
}

const inferStepPrecision = (step: number): number => {
  if (!Number.isFinite(step) || step <= 0) {
    return 2
  }
  const normalized = step.toString().toLowerCase()
  if (normalized.includes('e-')) {
    const [, exponent] = normalized.split('e-')
    return Math.min(4, Math.max(0, Number(exponent) || 0))
  }
  const decimalIndex = normalized.indexOf('.')
  if (decimalIndex === -1) {
    return 0
  }
  return Math.min(4, Math.max(0, normalized.length - decimalIndex - 1))
}

export function ParaSlider({
  label,
  value,
  displayedTrackValue,
  min,
  max,
  step,
  onChange,
  allowWrap = false,
  showContinuousDragPreview = false,
  clampMin,
  clampMax,
  isEditingClamp = false,
  onClampChange,
  formatValue = (nextValue) => `${nextValue}`,
  displayLabel,
  displayValue,
  onContextMenu,
  hideCaps = false,
}: ParaSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const valueInputRef = useRef<HTMLInputElement | null>(null)
  const [isValueEditing, setIsValueEditing] = useState(false)
  const [valueInput, setValueInput] = useState('')
  const [dragPreviewValue, setDragPreviewValue] = useState<number | null>(null)
  const normalizedValue = allowWrap ? wrapValue(value, min, max) : clampValue(value, min, max)
  const normalizedDisplayedTrackValue =
    displayedTrackValue === undefined
      ? normalizedValue
      : allowWrap
        ? wrapValue(displayedTrackValue, min, max)
        : clampValue(displayedTrackValue, min, max)
  const displayedValue = dragPreviewValue ?? normalizedDisplayedTrackValue
  const normalizedClampMin = normalizeValue(clampMin ?? min, min, max, step)
  const normalizedClampMax = normalizeValue(clampMax ?? max, min, max, step)
  const effectiveClampMin = Math.min(normalizedClampMin, normalizedClampMax)
  const effectiveClampMax = Math.max(normalizedClampMin, normalizedClampMax)
  const displayedFillPercent = useMemo(() => {
    if (effectiveClampMax <= effectiveClampMin || displayedValue <= effectiveClampMin) {
      return 0
    }
    return ((displayedValue - effectiveClampMin) / (effectiveClampMax - effectiveClampMin)) * 100
  }, [displayedValue, effectiveClampMax, effectiveClampMin])
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
    return ((displayedValue - min) / (max - min)) * 100
  }, [displayedValue, max, min])
  const normalizedValuePercent = useMemo(() => {
    if (effectiveClampMax <= effectiveClampMin) {
      return 0
    }
    return ((normalizedValue - effectiveClampMin) / (effectiveClampMax - effectiveClampMin)) * 100
  }, [effectiveClampMax, effectiveClampMin, normalizedValue])
  const inputPrecision = useMemo(() => inferStepPrecision(step), [step])
  const editableValueText = useMemo(() => normalizedValue.toFixed(inputPrecision), [inputPrecision, normalizedValue])
  const fineStep = useMemo(() => (step <= 0 ? step : Math.max(step / 10, 0.0001)), [step])

  useEffect(() => {
    if (!isValueEditing) {
      setValueInput(editableValueText)
    }
  }, [editableValueText, isValueEditing])

  useEffect(() => {
    if (!isValueEditing) {
      return
    }
    valueInputRef.current?.focus()
    valueInputRef.current?.select()
  }, [isValueEditing])

  const resolveValueFromClientX = (clientX: number): number | null => {
    const trackElement = trackRef.current
    if (trackElement === null) {
      return null
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return null
    }
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return isEditingClamp
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
  }

  const updateFromClientX = (clientX: number): number | null => {
    const nextValue = resolveValueFromClientX(clientX)
    if (nextValue === null) {
      return null
    }
    onChange(nextValue)
    return nextValue
  }

  const updateValueFromDragDelta = (
    currentValue: number,
    deltaClientX: number,
    useFineAdjustment: boolean,
  ): number | null => {
    const trackElement = trackRef.current
    if (trackElement === null) {
      return null
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return null
    }
    const activeRangeMin = isEditingClamp ? min : effectiveClampMin
    const activeRangeMax = isEditingClamp ? max : effectiveClampMax
    const dragDivisor = useFineAdjustment ? 10 : 1
    const activeStep = useFineAdjustment ? fineStep : step
    const rawDeltaValue =
      currentValue + ((deltaClientX / rect.width) * (activeRangeMax - activeRangeMin)) / dragDivisor
    const deltaValue = rawDeltaValue - currentValue
    const snappedDeltaValue =
      activeStep > 0
        ? Number((Math.round(deltaValue / activeStep) * activeStep).toFixed(4))
        : Number(deltaValue.toFixed(4))
    const nextQuantizedValue = Number((currentValue + snappedDeltaValue).toFixed(4))
    const nextValue =
      allowWrap && !isEditingClamp
        ? wrapValue(nextQuantizedValue, activeRangeMin, activeRangeMax)
        : clamp(nextQuantizedValue, effectiveClampMin, effectiveClampMax)
    onChange(nextValue)
    return nextValue
  }

  const updateWrappedPreviewFromDrag = (
    anchorValue: number,
    totalDeltaClientX: number,
    useFineAdjustment: boolean,
  ): number | null => {
    const trackElement = trackRef.current
    if (trackElement === null) {
      return null
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return null
    }
    const activeRangeMin = isEditingClamp ? min : effectiveClampMin
    const activeRangeMax = isEditingClamp ? max : effectiveClampMax
    const dragDivisor = useFineAdjustment ? 10 : 1
    const rawPreviewValue =
      anchorValue + ((totalDeltaClientX / rect.width) * (activeRangeMax - activeRangeMin)) / dragDivisor
    const wrappedPreviewValue = wrapValue(rawPreviewValue, activeRangeMin, activeRangeMax)
    setDragPreviewValue(wrappedPreviewValue)
    const snappedDeltaValue =
      step > 0
        ? Number(
            (Math.round((rawPreviewValue - anchorValue) / step) * step).toFixed(4),
          )
        : Number((rawPreviewValue - anchorValue).toFixed(4))
    const nextValue = wrapValue(anchorValue + snappedDeltaValue, activeRangeMin, activeRangeMax)
    onChange(nextValue)
    return nextValue
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
    let dragValue = normalizedValue
    const dragAnchorValue = normalizedValue
    if (mode === 'value') {
      if (!allowWrap && !event.shiftKey) {
        const nextValue = updateFromClientX(event.clientX)
        if (nextValue !== null) {
          dragValue = nextValue
        }
      }
    } else {
      updateClampFromClientX(event.clientX, mode === 'clamp-min' ? 'min' : 'max')
    }
    let lastClientX = event.clientX
    const startClientX = event.clientX
    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (mode === 'value') {
        if (showContinuousDragPreview) {
          const nextValue = updateWrappedPreviewFromDrag(
            dragAnchorValue,
            moveEvent.clientX - startClientX,
            moveEvent.shiftKey,
          )
          if (nextValue !== null) {
            dragValue = nextValue
          }
        } else if (allowWrap || moveEvent.shiftKey) {
          const nextValue = updateValueFromDragDelta(
            dragValue,
            moveEvent.clientX - lastClientX,
            moveEvent.shiftKey,
          )
          if (nextValue !== null) {
            dragValue = nextValue
          }
        } else {
          const nextValue = updateFromClientX(moveEvent.clientX)
          if (nextValue !== null) {
            dragValue = nextValue
          }
        }
        lastClientX = moveEvent.clientX
        return
      }
      updateClampFromClientX(moveEvent.clientX, mode === 'clamp-min' ? 'min' : 'max')
    }
    const handlePointerUp = () => {
      setDragPreviewValue(null)
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
      allowWrap && !isEditingClamp
        ? wrapValue(normalizedValue + direction * step, min, max)
        : clamp(
            clampValue(normalizedValue + direction * step, min, max),
            effectiveClampMin,
            effectiveClampMax,
          ),
    )
  }

  const commitValueInput = () => {
    const parsedValue = Number(valueInput)
    if (!Number.isFinite(parsedValue)) {
      setValueInput(editableValueText)
      setIsValueEditing(false)
      return
    }
    onChange(
      allowWrap && !isEditingClamp
        ? wrapValue(parsedValue, min, max)
        : clamp(
            normalizeValue(parsedValue, min, max, fineStep),
            effectiveClampMin,
            effectiveClampMax,
          ),
    )
    setIsValueEditing(false)
  }

  const cancelValueInput = () => {
    setValueInput(editableValueText)
    setIsValueEditing(false)
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
    <div className={`ParaSlider${hideCaps ? ' isCapless' : ''}`} onContextMenu={onContextMenu}>
      {hideCaps ? null : (
        <button
          type="button"
          className="ParaSliderCap ParaSliderCap--left"
          aria-label={`Decrease ${label}`}
          onClick={() => changeByStep(-1)}
          onContextMenu={onContextMenu}
        >
          {'<'}
        </button>
      )}
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
        onContextMenu={onContextMenu}
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
            left: '0%',
            width: isEditingClamp ? `${valuePercent}%` : `${displayedFillPercent}%`,
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
              onContextMenu={onContextMenu}
            />
            <button
              type="button"
              className="ParaSliderClampHandle ParaSliderClampHandle--right"
              style={{ left: `${clampStartPercent + clampWidthPercent}%` }}
              aria-label={`Adjust maximum ${label} clamp`}
              onPointerDown={(event) => startPointerDrag(event, 'clamp-max')}
              onDoubleClick={() => onClampChange?.({ min: effectiveClampMin, max })}
              onContextMenu={onContextMenu}
            />
          </>
        ) : null}
        <div className="ParaSliderContent">
          <span className="ParaSliderLabel">{displayLabel ?? label}</span>
          {isEditingClamp ? (
            <span className="ParaSliderValue">{displayValue ?? formatValue(normalizedValue)}</span>
          ) : isValueEditing ? (
            <input
              ref={valueInputRef}
              className="ParaSliderValueInput"
              type="number"
              step={fineStep}
              value={valueInput}
              aria-label={`Edit ${label} value`}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onInput={(event) => setValueInput((event.target as HTMLInputElement).value)}
              onChange={(event) => setValueInput(event.target.value)}
              onBlur={commitValueInput}
              onContextMenu={onContextMenu}
              onKeyDown={(event) => {
                event.stopPropagation()
                if (event.key === 'Enter') {
                  commitValueInput()
                  return
                }
                if (event.key === 'Escape') {
                  cancelValueInput()
                }
              }}
            />
          ) : (
            <button
              type="button"
              className="ParaSliderValueButton"
              aria-label={`Edit ${label} value`}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onClick={() => {
                setValueInput(editableValueText)
                setIsValueEditing(true)
              }}
              onContextMenu={onContextMenu}
            >
              {displayValue ?? formatValue(normalizedValue)}
            </button>
          )}
        </div>
      </div>
      {hideCaps ? null : (
        <button
          type="button"
          className="ParaSliderCap ParaSliderCap--right"
          aria-label={`Increase ${label}`}
          onClick={() => changeByStep(1)}
          onContextMenu={onContextMenu}
        >
          {'>'}
        </button>
      )}
    </div>
  )
}
