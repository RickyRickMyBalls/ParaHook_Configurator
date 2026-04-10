import {
  buildUnitAwareNumericRowDrivenMessage,
  buildUnitAwareNumericRowLabel,
} from './nodeTemplateContract'

type StructuredWireNumericRowValueInput = {
  value: number
  min?: number
  max?: number
  step?: number
  showSlider?: boolean
  renderAs?: 'numberField' | 'paraSlider'
  primitiveRow?: boolean
  disabled?: boolean
  driven?: boolean
  formatValue?: (value: number) => string
  displayedTrackValue?: number
  unitLabel?: string
  onInteractionStart?: () => void
  onInteractionEnd?: () => void
  onChange: (value: number) => void
}

export type StructuredWireNumericRowProps = {
  drivenMessage?: string
  valueInput: StructuredWireNumericRowValueInput
}

type StructuredWireNumericRowPropsOptions = {
  effectiveValue: number
  localFallbackValue: number
  unitLabel: string
  driven: boolean
  editorEnabled: boolean
  inputRange?: {
    min?: number
    max?: number
    step?: number
    showSlider?: boolean
  }
  onInteractionStart?: () => void
  onInteractionEnd?: () => void
  onChange: (value: number) => void
  formatValueLabel: (value: number) => string
}

export const createStructuredWireNumericRowProps = ({
  effectiveValue,
  localFallbackValue,
  unitLabel,
  driven,
  editorEnabled,
  inputRange,
  onInteractionStart,
  onInteractionEnd,
  onChange,
  formatValueLabel,
}: StructuredWireNumericRowPropsOptions): StructuredWireNumericRowProps => ({
  drivenMessage:
    driven
      ? buildUnitAwareNumericRowDrivenMessage(formatValueLabel(localFallbackValue), unitLabel)
      : undefined,
  valueInput: {
    value: localFallbackValue,
    min: inputRange?.min,
    max: inputRange?.max,
    step: inputRange?.step,
    showSlider: inputRange?.showSlider,
    renderAs: 'paraSlider',
    primitiveRow: true,
    disabled: driven || !editorEnabled,
    driven,
    formatValue: (value) => buildUnitAwareNumericRowLabel(formatValueLabel(value), unitLabel),
    displayedTrackValue: driven ? effectiveValue : localFallbackValue,
    unitLabel,
    onInteractionStart,
    onInteractionEnd,
    onChange,
  },
})
