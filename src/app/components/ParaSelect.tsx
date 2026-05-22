import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type ParaSelectOption = {
  value: string
  label: string
}

type ParaSelectMenuAction = {
  label: string
  onSelect: () => void
}

type ParaSelectProps = {
  label: string
  value: string
  displayedValue?: string
  displayedLabel?: string
  options: ParaSelectOption[]
  onChange: (value: string) => void
  menuMode?: 'native' | 'custom'
  menuActions?: ParaSelectMenuAction[]
  capGlyph?: 'text' | 'chevron'
  disabled?: boolean
}

function ParaSelectCapIcon({
  direction,
  glyph,
}: {
  direction: 'left' | 'right'
  glyph: 'text' | 'chevron'
}) {
  if (glyph === 'chevron') {
    return (
      <svg
        className="ParaSelectCapIcon"
        viewBox="0 0 8 8"
        aria-hidden="true"
        focusable="false"
      >
        <polyline
          points={
            direction === 'left'
              ? '5.25,1.5 2.75,4 5.25,6.5'
              : '2.75,1.5 5.25,4 2.75,6.5'
          }
        />
      </svg>
    )
  }
  return <>{direction === 'left' ? '<' : '>'}</>
}

export function ParaSelect({
  label,
  value,
  displayedValue,
  displayedLabel,
  options,
  onChange,
  menuMode = 'native',
  menuActions = [],
  capGlyph = 'text',
  disabled = false,
}: ParaSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dragPreviewPercent, setDragPreviewPercent] = useState<number | null>(null)
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selectedOption = options[selectedIndex] ?? options[0] ?? { value: '', label: '' }
  const displayedOptionValue = displayedValue ?? value
  const displayedOptionIndex = options.findIndex((option) => option.value === displayedOptionValue)
  const displayedIndex = Math.max(0, displayedOptionIndex >= 0 ? displayedOptionIndex : selectedIndex)
  const displayedOption =
    displayedOptionIndex >= 0
      ? options[displayedOptionIndex]
      : displayedLabel === undefined
        ? selectedOption
        : { value: displayedOptionValue, label: displayedLabel }
  const canCycle = options.length > 1
  const selectedFillPercent =
    options.length <= 1 ? 100 : (displayedIndex / Math.max(1, options.length - 1)) * 100
  const fillPercent = dragPreviewPercent ?? selectedFillPercent

  const changeByStep = (direction: -1 | 1) => {
    if (options.length === 0) {
      return
    }
    if (disabled) {
      return
    }
    const nextIndex =
      direction === -1
        ? (selectedIndex - 1 + options.length) % options.length
        : (selectedIndex + 1) % options.length
    const nextOption = options[nextIndex]
    if (nextOption !== undefined && nextOption.value !== value) {
      onChange(nextOption.value)
    }
  }

  const resolveOptionIndexFromClientX = (clientX: number): number | null => {
    const trackElement = trackRef.current
    if (trackElement === null || options.length === 0) {
      return null
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return null
    }
    if (options.length === 1) {
      return 0
    }
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.round(ratio * (options.length - 1))
  }

  const resolveFillPercentFromClientX = (clientX: number): number | null => {
    const trackElement = trackRef.current
    if (trackElement === null) {
      return null
    }
    const rect = trackElement.getBoundingClientRect()
    if (rect.width <= 0) {
      return null
    }
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return ratio * 100
  }

  useEffect(() => {
    if (!isMenuOpen || menuMode !== 'custom') {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node) !== true) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen, menuMode])

  const handleTrackToggle = () => {
    if (menuMode !== 'custom') {
      return
    }
    if (options.length === 0) {
      return
    }
    setIsMenuOpen((current) => !current)
  }

  const handleNativeChange = (nextValue: string) => {
    setIsMenuOpen(false)
    setDragPreviewPercent(null)
    onChange(nextValue)
  }

  const handleOptionClick = (nextValue: string) => {
    if (nextValue !== value) {
      onChange(nextValue)
    }
    setDragPreviewPercent(null)
    setIsMenuOpen(false)
  }

  const handleMenuActionClick = (action: ParaSelectMenuAction) => {
    action.onSelect()
    setDragPreviewPercent(null)
    setIsMenuOpen(false)
  }

  const handleValueHandlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || menuMode !== 'custom' || options.length === 0) {
      return
    }
    if (disabled) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    setIsMenuOpen(false)
    let lastDraggedValue = selectedOption.value
    const initialPreviewPercent = resolveFillPercentFromClientX(event.clientX)
    if (initialPreviewPercent !== null) {
      setDragPreviewPercent(initialPreviewPercent)
    }
    const updateSelectionFromClientX = (clientX: number) => {
      const nextPreviewPercent = resolveFillPercentFromClientX(clientX)
      if (nextPreviewPercent !== null) {
        setDragPreviewPercent(nextPreviewPercent)
      }
      const nextIndex = resolveOptionIndexFromClientX(clientX)
      if (nextIndex === null) {
        return
      }
      const nextOption = options[nextIndex]
      if (nextOption !== undefined && nextOption.value !== lastDraggedValue) {
        lastDraggedValue = nextOption.value
        onChange(nextOption.value)
      }
    }
    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateSelectionFromClientX(moveEvent.clientX)
    }
    const handlePointerUp = () => {
      setDragPreviewPercent(null)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  if (menuMode === 'native') {
    return (
      <div className="ParaSelect">
        <button
          type="button"
          className="ParaSelectCap ParaSelectCap--left"
          aria-label={`Previous ${label}`}
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={() => changeByStep(-1)}
          disabled={!canCycle || disabled}
        >
          <ParaSelectCapIcon direction="left" glyph={capGlyph} />
        </button>
        <label className="ParaSelectTrack">
          <div className="ParaSelectFill" style={{ width: `${fillPercent}%` }} />
          <div className="ParaSelectValueMarker" style={{ left: `${fillPercent}%` }} />
          <span className="ParaSelectContent">
            <span className="ParaSelectLabel">{label}</span>
            <span className="ParaSelectValue">
              <span>{displayedOption.label}</span>
              <span className="ParaSelectChevron">v</span>
            </span>
          </span>
          <select
            className="ParaSelectNative"
            aria-label={label}
            value={selectedOption.value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="ParaSelectCap ParaSelectCap--right"
          aria-label={`Next ${label}`}
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={() => changeByStep(1)}
          disabled={!canCycle || disabled}
        >
          <ParaSelectCapIcon direction="right" glyph={capGlyph} />
        </button>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="ParaSelect">
      <button
        type="button"
        className="ParaSelectCap ParaSelectCap--left"
        aria-label={`Previous ${label}`}
        onPointerDown={(event) => {
          event.stopPropagation()
        }}
        onClick={() => changeByStep(-1)}
        disabled={!canCycle || disabled}
      >
        <ParaSelectCapIcon direction="left" glyph={capGlyph} />
      </button>
      <div
        ref={trackRef}
        className={`ParaSelectTrack ParaSelectTrack--custom ${isMenuOpen ? 'isMenuOpen' : ''}`}
      >
        <button
          type="button"
          className="ParaSelectTrackButton"
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={isMenuOpen}
          disabled={disabled}
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onClick={handleTrackToggle}
        >
          <div className="ParaSelectFill" style={{ width: `${fillPercent}%` }} />
          <span className="ParaSelectContent">
            <span className="ParaSelectLabel">{label}</span>
            <span className="ParaSelectValue">
              <span>{displayedOption.label}</span>
              <span className="ParaSelectChevron">v</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          className="ParaSelectValueHandle"
          aria-label={`Drag ${label} selection`}
          style={{ left: `${fillPercent}%` }}
          onPointerDown={handleValueHandlePointerDown}
        />
        <select
          className="ParaSelectNative"
          aria-label={label}
          value={selectedOption.value}
          disabled={disabled}
          tabIndex={-1}
          onChange={(event) => handleNativeChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isMenuOpen ? (
          <div className="ParaSelectMenu" role="listbox" aria-label={`${label} options`}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`ParaSelectMenuOption ${
                  option.value === selectedOption.value ? 'isSelected' : ''
                }`}
                onPointerDown={(event) => {
                  event.stopPropagation()
                }}
                onClick={() => handleOptionClick(option.value)}
                role="option"
                aria-selected={option.value === selectedOption.value}
              >
                {option.label}
              </button>
            ))}
            {menuActions.length > 0 ? (
              <div className="ParaSelectMenuActions">
                {menuActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="ParaSelectMenuAction"
                    onPointerDown={(event) => {
                      event.stopPropagation()
                    }}
                    onClick={() => handleMenuActionClick(action)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        className="ParaSelectCap ParaSelectCap--right"
        aria-label={`Next ${label}`}
        onPointerDown={(event) => {
          event.stopPropagation()
        }}
        onClick={() => changeByStep(1)}
        disabled={!canCycle || disabled}
      >
        <ParaSelectCapIcon direction="right" glyph={capGlyph} />
      </button>
    </div>
  )
}
