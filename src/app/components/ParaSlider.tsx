import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
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
  trackMin?: number
  trackMax?: number
  trackStep?: number
  valueToTrackValue?: (value: number) => number
  trackValueToValue?: (trackValue: number) => number
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
  onActivate?: () => void
  onContextMenu?: (event: ReactMouseEvent<HTMLElement>) => void
  hideCaps?: boolean
  disabled?: boolean
  className?: string
  style?: CSSProperties
  onChangeEnd?: (value: number) => void
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
  trackMin,
  trackMax,
  trackStep,
  valueToTrackValue,
  trackValueToValue,
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
  onActivate,
  onContextMenu,
  hideCaps = false,
  disabled = false,
  className,
  style,
  onChangeEnd,
}: ParaSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const valueInputRef = useRef<HTMLInputElement | null>(null)
  const [isValueEditing, setIsValueEditing] = useState(false)
  const [valueInput, setValueInput] = useState('')
  const [isClampMinEditing, setIsClampMinEditing] = useState(false)
  const [isClampMaxEditing, setIsClampMaxEditing] = useState(false)
  const [clampMinInput, setClampMinInput] = useState('')
  const [clampMaxInput, setClampMaxInput] = useState('')
  const [dragPreviewValue, setDragPreviewValue] = useState<number | null>(null)
  const usesCustomTrackMapping =
    trackMin !== undefined ||
    trackMax !== undefined ||
    trackStep !== undefined ||
    valueToTrackValue !== undefined ||
    trackValueToValue !== undefined
  const resolveTrackValue = valueToTrackValue ?? ((nextValue: number) => nextValue)
  const resolveValueFromTrack = trackValueToValue ?? ((nextTrackValue: number) => nextTrackValue)
  const effectiveTrackMin = trackMin ?? min
  const effectiveTrackMax = trackMax ?? max
  const effectiveTrackStep = trackStep ?? step
  const normalizedValue = allowWrap ? wrapValue(value, min, max) : clampValue(value, min, max)
  const normalizedTrackValue =
    allowWrap && !isEditingClamp
      ? wrapValue(resolveTrackValue(normalizedValue), effectiveTrackMin, effectiveTrackMax)
      : clampValue(resolveTrackValue(normalizedValue), effectiveTrackMin, effectiveTrackMax)
  const normalizedDisplayedTrackValue =
    displayedTrackValue === undefined
      ? normalizedTrackValue
      : allowWrap && !isEditingClamp
        ? wrapValue(resolveTrackValue(displayedTrackValue), effectiveTrackMin, effectiveTrackMax)
        : clampValue(resolveTrackValue(displayedTrackValue), effectiveTrackMin, effectiveTrackMax)
  const displayedValue = dragPreviewValue ?? normalizedDisplayedTrackValue
  const normalizedClampMin = normalizeValue(clampMin ?? min, min, max, step)
  const normalizedClampMax = normalizeValue(clampMax ?? max, min, max, step)
  const effectiveClampMin = Math.min(normalizedClampMin, normalizedClampMax)
  const effectiveClampMax = Math.max(normalizedClampMin, normalizedClampMax)
  const effectiveTrackClampMin = isEditingClamp
    ? effectiveClampMin
    : clampValue(resolveTrackValue(effectiveClampMin), effectiveTrackMin, effectiveTrackMax)
  const effectiveTrackClampMax = isEditingClamp
    ? effectiveClampMax
    : clampValue(resolveTrackValue(effectiveClampMax), effectiveTrackMin, effectiveTrackMax)
  const displayedFillPercent = useMemo(() => {
    if (effectiveTrackClampMax <= effectiveTrackClampMin || displayedValue <= effectiveTrackClampMin) {
      return 0
    }
    return (
      ((displayedValue - effectiveTrackClampMin) /
        (effectiveTrackClampMax - effectiveTrackClampMin)) *
      100
    )
  }, [displayedValue, effectiveTrackClampMax, effectiveTrackClampMin])
  const clampStartPercent = useMemo(() => {
    if (effectiveTrackMax <= effectiveTrackMin) {
      return 0
    }
    return ((effectiveTrackClampMin - effectiveTrackMin) / (effectiveTrackMax - effectiveTrackMin)) * 100
  }, [effectiveTrackClampMin, effectiveTrackMax, effectiveTrackMin])
  const clampWidthPercent = useMemo(() => {
    if (effectiveTrackMax <= effectiveTrackMin) {
      return 0
    }
    return (
      ((effectiveTrackClampMax - effectiveTrackClampMin) /
        (effectiveTrackMax - effectiveTrackMin)) *
      100
    )
  }, [effectiveTrackClampMax, effectiveTrackClampMin, effectiveTrackMax, effectiveTrackMin])
  const valuePercent = useMemo(() => {
    if (effectiveTrackMax <= effectiveTrackMin) {
      return 0
    }
    return ((displayedValue - effectiveTrackMin) / (effectiveTrackMax - effectiveTrackMin)) * 100
  }, [displayedValue, effectiveTrackMax, effectiveTrackMin])
  const normalizedValuePercent = useMemo(() => {
    if (effectiveTrackClampMax <= effectiveTrackClampMin) {
      return 0
    }
    return (
      ((normalizedTrackValue - effectiveTrackClampMin) /
        (effectiveTrackClampMax - effectiveTrackClampMin)) *
      100
    )
  }, [effectiveTrackClampMax, effectiveTrackClampMin, normalizedTrackValue])
  const inputPrecision = useMemo(() => inferStepPrecision(step), [step])
  const editableValueText = useMemo(() => normalizedValue.toFixed(inputPrecision), [inputPrecision, normalizedValue])
  const editableClampMinText = useMemo(
    () => effectiveClampMin.toFixed(inputPrecision),
    [effectiveClampMin, inputPrecision],
  )
  const editableClampMaxText = useMemo(
    () => effectiveClampMax.toFixed(inputPrecision),
    [effectiveClampMax, inputPrecision],
  )
  const fineStep = useMemo(() => (step <= 0 ? step : Math.max(step / 10, 0.0001)), [step])

  useEffect(() => {
    if (!isValueEditing) {
      setValueInput(editableValueText)
    }
  }, [editableValueText, isValueEditing])

  useEffect(() => {
    if (!isClampMinEditing) {
      setClampMinInput(editableClampMinText)
    }
  }, [editableClampMinText, isClampMinEditing])

  useEffect(() => {
    if (!isClampMaxEditing) {
      setClampMaxInput(editableClampMaxText)
    }
  }, [editableClampMaxText, isClampMaxEditing])

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
    if (isEditingClamp) {
      return clamp(
        normalizeValue(min + ratio * (max - min), min, max, step),
        effectiveClampMin,
        effectiveClampMax,
      )
    }
    const nextTrackValue = normalizeValue(
      effectiveTrackClampMin + ratio * (effectiveTrackClampMax - effectiveTrackClampMin),
      effectiveTrackClampMin,
      effectiveTrackClampMax,
      effectiveTrackStep,
    )
    return normalizeValue(resolveValueFromTrack(nextTrackValue), min, max, step)
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
    const activeRangeMin = isEditingClamp ? min : effectiveTrackClampMin
    const activeRangeMax = isEditingClamp ? max : effectiveTrackClampMax
    const dragDivisor = useFineAdjustment ? 10 : 1
    const activeStep = useFineAdjustment ? fineStep : isEditingClamp ? step : effectiveTrackStep
    const currentTrackValue = isEditingClamp
      ? currentValue
      : clampValue(resolveTrackValue(currentValue), activeRangeMin, activeRangeMax)
    const rawDeltaValue =
      currentTrackValue +
      ((deltaClientX / rect.width) * (activeRangeMax - activeRangeMin)) / dragDivisor
    const deltaValue = rawDeltaValue - currentTrackValue
    const snappedDeltaValue =
      activeStep > 0
        ? Number((Math.round(deltaValue / activeStep) * activeStep).toFixed(4))
        : Number(deltaValue.toFixed(4))
    const nextQuantizedValue = Number((currentTrackValue + snappedDeltaValue).toFixed(4))
    const nextValue =
      allowWrap && !isEditingClamp
        ? wrapValue(nextQuantizedValue, activeRangeMin, activeRangeMax)
        : clamp(nextQuantizedValue, activeRangeMin, activeRangeMax)
    const resolvedValue = isEditingClamp || !usesCustomTrackMapping
      ? nextValue
      : normalizeValue(resolveValueFromTrack(nextValue), min, max, step)
    onChange(resolvedValue)
    return resolvedValue
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
    if (event.button !== 0 || disabled) {
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
      onChangeEnd?.(dragValue)
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
    if (disabled) {
      return
    }
    onActivate?.()
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
    if (disabled) {
      return
    }
    const nextValue =
      allowWrap && !isEditingClamp
        ? wrapValue(normalizedValue + direction * step, min, max)
        : clamp(
            clampValue(normalizedValue + direction * step, min, max),
            effectiveClampMin,
            effectiveClampMax,
          )
    onChange(nextValue)
    onChangeEnd?.(nextValue)
  }

  const commitValueInput = () => {
    if (disabled) {
      setValueInput(editableValueText)
      setIsValueEditing(false)
      return
    }
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
    onChangeEnd?.(
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

  const commitClampInput = (edge: 'min' | 'max') => {
    if (onClampChange === undefined) {
      if (edge === 'min') {
        setClampMinInput(editableClampMinText)
        setIsClampMinEditing(false)
      } else {
        setClampMaxInput(editableClampMaxText)
        setIsClampMaxEditing(false)
      }
      return
    }
    const rawValue = edge === 'min' ? clampMinInput : clampMaxInput
    const parsedValue = Number(rawValue)
    if (!Number.isFinite(parsedValue)) {
      if (edge === 'min') {
        setClampMinInput(editableClampMinText)
        setIsClampMinEditing(false)
      } else {
        setClampMaxInput(editableClampMaxText)
        setIsClampMaxEditing(false)
      }
      return
    }
    const nextValue = normalizeValue(parsedValue, min, max, fineStep)
    if (edge === 'min') {
      onClampChange({
        min: Math.min(nextValue, effectiveClampMax),
        max: effectiveClampMax,
      })
      setIsClampMinEditing(false)
      return
    }
    onClampChange({
      min: effectiveClampMin,
      max: Math.max(nextValue, effectiveClampMin),
    })
    setIsClampMaxEditing(false)
  }

  const cancelClampInput = (edge: 'min' | 'max') => {
    if (edge === 'min') {
      setClampMinInput(editableClampMinText)
      setIsClampMinEditing(false)
      return
    }
    setClampMaxInput(editableClampMaxText)
    setIsClampMaxEditing(false)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return
    }
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
        onChangeEnd?.(effectiveClampMin)
        event.preventDefault()
        return
      case 'End':
        onChange(effectiveClampMax)
        onChangeEnd?.(effectiveClampMax)
        event.preventDefault()
        return
      default:
        return
    }
  }

  return (
    <div
      className={`ParaSlider${hideCaps ? ' isCapless' : ''}${disabled ? ' isDisabled' : ''}${
        className === undefined || className.length === 0 ? '' : ` ${className}`
      }`}
      style={style}
      onContextMenu={onContextMenu}
    >
      {hideCaps ? null : (
        <button
          type="button"
          className="ParaSliderCap ParaSliderCap--left"
          aria-label={`Decrease ${label}`}
          disabled={disabled}
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
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={effectiveClampMin}
        aria-valuemax={effectiveClampMax}
        aria-valuenow={normalizedValue}
        aria-valuetext={formatValue(normalizedValue)}
        aria-disabled={disabled}
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
          {isEditingClamp ? (
            <>
              <input
                className="ParaSliderValueInput ParaSliderClampInput ParaSliderClampInput--min"
              type="number"
              step={fineStep}
              value={clampMinInput}
              aria-label={`Edit minimum ${label} clamp`}
              disabled={disabled}
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
                onFocus={() => setIsClampMinEditing(true)}
                onInput={(event) => setClampMinInput((event.target as HTMLInputElement).value)}
                onChange={(event) => setClampMinInput(event.target.value)}
                onBlur={() => commitClampInput('min')}
                onContextMenu={onContextMenu}
                onKeyDown={(event) => {
                  event.stopPropagation()
                  if (event.key === 'Enter') {
                    commitClampInput('min')
                    return
                  }
                  if (event.key === 'Escape') {
                    cancelClampInput('min')
                  }
                }}
              />
              <input
                className="ParaSliderValueInput ParaSliderClampInput ParaSliderClampInput--max"
              type="number"
              step={fineStep}
              value={clampMaxInput}
              aria-label={`Edit maximum ${label} clamp`}
              disabled={disabled}
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
                onFocus={() => setIsClampMaxEditing(true)}
                onInput={(event) => setClampMaxInput((event.target as HTMLInputElement).value)}
                onChange={(event) => setClampMaxInput(event.target.value)}
                onBlur={() => commitClampInput('max')}
                onContextMenu={onContextMenu}
                onKeyDown={(event) => {
                  event.stopPropagation()
                  if (event.key === 'Enter') {
                    commitClampInput('max')
                    return
                  }
                  if (event.key === 'Escape') {
                    cancelClampInput('max')
                  }
                }}
              />
            </>
          ) : (
            <span className="ParaSliderLabel">{displayLabel ?? label}</span>
          )}
          {isEditingClamp ? null : isValueEditing ? (
            <input
              ref={valueInputRef}
              className="ParaSliderValueInput"
              type="number"
              step={fineStep}
              value={valueInput}
              aria-label={`Edit ${label} value`}
              disabled={disabled}
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
              disabled={disabled}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onClick={() => {
                if (disabled) {
                  return
                }
                onActivate?.()
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
          disabled={disabled}
          onClick={() => changeByStep(1)}
          onContextMenu={onContextMenu}
        >
          {'>'}
        </button>
      )}
    </div>
  )
}
