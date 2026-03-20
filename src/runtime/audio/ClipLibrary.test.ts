import { describe, expect, it } from 'vitest'
import {
  buildSoundCloudPlayerUrl,
  createFallbackRadioSourceDescriptor,
  DEFAULT_GUSANO_URL,
  resolveRadioSourceDescriptor,
} from './ClipLibrary'

describe('ClipLibrary', () => {
  it('resolves the default Gusano radio url to the SoundCloud widget path', () => {
    const descriptor = resolveRadioSourceDescriptor(DEFAULT_GUSANO_URL)

    expect(descriptor).toEqual({
      sourceId: `radio-soundcloud:${DEFAULT_GUSANO_URL}`,
      sourceUrl: DEFAULT_GUSANO_URL,
      kind: 'soundcloud-widget',
      isFallback: false,
      provider: 'soundcloud',
      trackUrl: DEFAULT_GUSANO_URL,
      embedUrl: buildSoundCloudPlayerUrl(DEFAULT_GUSANO_URL),
    })
  })

  it('marks unsupported custom urls explicitly instead of silently downgrading them', () => {
    const descriptor = resolveRadioSourceDescriptor('https://example.com/not-soundcloud')

    expect(descriptor).toEqual({
      sourceId: 'radio-unsupported:https://example.com/not-soundcloud',
      sourceUrl: 'https://example.com/not-soundcloud',
      kind: 'unsupported-url',
      isFallback: false,
      unsupportedReason: 'custom-url-unsupported',
    })
  })

  it('can still create an explicit generated-tone fallback descriptor for runtime fallback', () => {
    const descriptor = createFallbackRadioSourceDescriptor(
      DEFAULT_GUSANO_URL,
      'supported-url-runtime-fallback',
    )

    expect(descriptor.kind).toBe('generated-tone')
    expect(descriptor.isFallback).toBe(true)
    expect(descriptor.fallbackReason).toBe('supported-url-runtime-fallback')
    expect(descriptor.sourceId).toBe(`radio-fallback-runtime:${DEFAULT_GUSANO_URL}`)
  })
})
