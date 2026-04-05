export type StructuredWireEnumRowOption = {
  value: string
  label: string
}

export type StructuredWireEnumRowProps = {
  label: string
  value: string
  valueLabel: string
  displayedTrackValue: string
  displayedTrackLabel: string
  options: StructuredWireEnumRowOption[]
  selectedIndex: number
  displayedIndex: number
  optionCount: number
  disabled: boolean
  driven: boolean
  drivenMessage?: string
  onChange: (value: string) => void
}

type StructuredWireEnumRowPropsOptions = {
  label: string
  localFallbackValue: string
  effectiveValue: string
  driven: boolean
  options: StructuredWireEnumRowOption[]
  onChange: (value: string) => void
}

const toOptionLabel = (
  options: StructuredWireEnumRowOption[],
  value: string,
): string => options.find((option) => option.value === value)?.label ?? value

const toOptionIndex = (
  options: StructuredWireEnumRowOption[],
  value: string,
): number => {
  const index = options.findIndex((option) => option.value === value)
  return index < 0 ? 0 : index
}

export const createStructuredWireEnumRowProps = ({
  label,
  localFallbackValue,
  effectiveValue,
  driven,
  options,
  onChange,
}: StructuredWireEnumRowPropsOptions): StructuredWireEnumRowProps => {
  const displayedTrackValue = driven ? effectiveValue : localFallbackValue
  return {
    label,
    value: localFallbackValue,
    valueLabel: toOptionLabel(options, localFallbackValue),
    displayedTrackValue,
    displayedTrackLabel: toOptionLabel(options, displayedTrackValue),
    options,
    selectedIndex: toOptionIndex(options, localFallbackValue),
    displayedIndex: toOptionIndex(options, displayedTrackValue),
    optionCount: options.length,
    disabled: driven,
    driven,
    drivenMessage:
      driven && localFallbackValue !== effectiveValue
        ? `Wire drives the effective value. Local fallback stays at ${toOptionLabel(options, localFallbackValue)}.`
        : driven
          ? 'Wire drives the effective value.'
          : undefined,
    onChange,
  }
}
