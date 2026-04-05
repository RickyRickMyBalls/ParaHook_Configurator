import { describe, expect, it } from 'vitest'
import { createStructuredWireNumericRowProps } from './structuredWireNumericRowProps'

describe('structuredWireNumericRowProps', () => {
  it('builds a unit-aware numeric-row prop bundle for local editing', () => {
    const props = createStructuredWireNumericRowProps({
      effectiveValue: 42,
      localFallbackValue: 30,
      unitLabel: 'mm',
      driven: false,
      editorEnabled: true,
      inputRange: {
        min: 0.1,
        max: 2000,
        step: 0.1,
      },
      onChange: () => {
        // no-op for test
      },
      formatValueLabel: (value) => value.toFixed(0),
    })

    expect(props.drivenMessage).toBeUndefined()
    expect(props.valueInput).toMatchObject({
      value: 30,
      min: 0.1,
      max: 2000,
      step: 0.1,
      renderAs: 'paraSlider',
      primitiveRow: true,
      disabled: false,
      driven: false,
      displayedTrackValue: 30,
      unitLabel: 'mm',
    })
    expect('className' in props.valueInput).toBe(false)
    expect('hideSliderCaps' in props.valueInput).toBe(false)
    expect(props.valueInput.formatValue?.(45)).toBe('45 mm')
  })

  it('builds driven fallback messaging while keeping the local value in the editor', () => {
    const props = createStructuredWireNumericRowProps({
      effectiveValue: 42,
      localFallbackValue: 20,
      unitLabel: 'mm',
      driven: true,
      editorEnabled: true,
      onChange: () => {
        // no-op for test
      },
      formatValueLabel: (value) => value.toFixed(0),
    })

    expect(props.drivenMessage).toBe(
      'Wire drives the effective value. Local fallback stays at 20 mm.',
    )
    expect(props.valueInput).toMatchObject({
      value: 20,
      renderAs: 'paraSlider',
      primitiveRow: true,
      disabled: true,
      driven: true,
      displayedTrackValue: 42,
      unitLabel: 'mm',
    })
    expect(props.valueInput.formatValue?.(42)).toBe('42 mm')
  })
})
