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
  const canCycle = options.length > 1
  const fillPercent =
    options.length <= 1 ? 100 : (selectedIndex / Math.max(1, options.length - 1)) * 100

  const changeByStep = (direction: -1 | 1) => {
    if (options.length === 0) {
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

  return (
    <div className="ParaSelect">
      <button
        type="button"
        className="ParaSelectCap ParaSelectCap--left"
        aria-label={`Previous ${label}`}
        onClick={() => changeByStep(-1)}
        disabled={!canCycle}
      >
        {'<'}
      </button>
      <label className="ParaSelectTrack">
        <div className="ParaSelectFill" style={{ width: `${fillPercent}%` }} />
        <div className="ParaSelectValueMarker" style={{ left: `${fillPercent}%` }} />
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
        disabled={!canCycle}
      >
        {'>'}
      </button>
    </div>
  )
}
