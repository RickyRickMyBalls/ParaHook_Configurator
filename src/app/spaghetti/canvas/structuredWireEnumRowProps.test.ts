import { describe, expect, it, vi } from 'vitest'
import { createStructuredWireEnumRowProps } from './structuredWireEnumRowProps'

describe('structuredWireEnumRowProps', () => {
  it('uses the local authored enum value when the row is unwired', () => {
    const onChange = vi.fn()
    const props = createStructuredWireEnumRowProps({
      label: 'Type',
      localFallbackValue: 'Body',
      effectiveValue: 'Body',
      driven: false,
      options: [
        { value: 'Body', label: 'Body' },
        { value: 'Walls', label: 'Walls' },
      ],
      onChange,
    })

    expect(props).toEqual({
      label: 'Type',
      value: 'Body',
      valueLabel: 'Body',
      displayedTrackValue: 'Body',
      displayedTrackLabel: 'Body',
      options: [
        { value: 'Body', label: 'Body' },
        { value: 'Walls', label: 'Walls' },
      ],
      selectedIndex: 0,
      displayedIndex: 0,
      optionCount: 2,
      disabled: false,
      driven: false,
      drivenMessage: undefined,
      onChange,
    })
  })

  it('uses the effective enum value only while the row is driven by a real wire', () => {
    const props = createStructuredWireEnumRowProps({
      label: 'Type',
      localFallbackValue: 'Body',
      effectiveValue: 'Walls',
      driven: true,
      options: [
        { value: 'Body', label: 'Body' },
        { value: 'Walls', label: 'Walls' },
      ],
      onChange: vi.fn(),
    })

    expect(props.value).toBe('Body')
    expect(props.valueLabel).toBe('Body')
    expect(props.displayedTrackValue).toBe('Walls')
    expect(props.displayedTrackLabel).toBe('Walls')
    expect(props.selectedIndex).toBe(0)
    expect(props.displayedIndex).toBe(1)
    expect(props.optionCount).toBe(2)
    expect(props.disabled).toBe(true)
    expect(props.driven).toBe(true)
    expect(props.drivenMessage).toBe(
      'Wire drives the effective value. Local fallback stays at Body.',
    )
  })
})
