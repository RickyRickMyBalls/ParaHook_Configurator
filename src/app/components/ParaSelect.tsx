type ParaSelectOption = {
  value: string
  label: string
}

type ParaSelectProps = {
  label: string
  value: string
  options: ParaSelectOption[]
  onChange: (value: string) => void
}

export function ParaSelect({ label, value, options, onChange }: ParaSelectProps) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selectedOption = options[selectedIndex] ?? options[0] ?? { value: '', label: '' }
  const canDecrement = selectedIndex > 0
  const canIncrement = selectedIndex >= 0 && selectedIndex < options.length - 1

  const changeByStep = (direction: -1 | 1) => {
    if (options.length === 0) {
      return
    }
    const nextIndex = Math.min(options.length - 1, Math.max(0, selectedIndex + direction))
    const nextOption = options[nextIndex]
    if (nextOption !== undefined && nextOption.value !== value) {
      onChange(nextOption.value)
    }
  }

  return (
    <div className="ParaSelect">
      <button
        type="button"
        className="ParaSelectCap ParaSelectCap--left"
        aria-label={`Previous ${label}`}
        onClick={() => changeByStep(-1)}
        disabled={!canDecrement}
      >
        {'<'}
      </button>
      <label className="ParaSelectTrack">
        <span className="ParaSelectContent">
          <span className="ParaSelectLabel">{label}</span>
          <span className="ParaSelectValue">
            <span>{selectedOption.label}</span>
            <span className="ParaSelectChevron">v</span>
          </span>
        </span>
        <select
          className="ParaSelectNative"
          aria-label={label}
          value={selectedOption.value}
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
        onClick={() => changeByStep(1)}
        disabled={!canIncrement}
      >
        {'>'}
      </button>
    </div>
  )
}
