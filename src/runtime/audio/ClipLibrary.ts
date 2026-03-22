import { buildGeneratedToneProfile, type GeneratedToneProfile } from './SamplerKeys'

export const DEFAULT_GUSANO_URL = 'https://soundcloud.com/keota-us/gusano'
const DEFAULT_FALLBACK_DURATION_SEC = 12

export type GeneratedToneRadioSourceDescriptor = {
  sourceId: string
  sourceUrl: string
  kind: 'generated-tone'
  durationSec: number
  isFallback: boolean
  fallbackReason:
    | 'default-url-fallback'
    | 'custom-url-fallback'
    | 'supported-url-runtime-fallback'
  toneProfile: GeneratedToneProfile
}

export type SoundCloudWidgetRadioSourceDescriptor = {
  sourceId: string
  sourceUrl: string
  kind: 'soundcloud-widget'
  isFallback: false
  provider: 'soundcloud'
  trackUrl: string
  embedUrl: string
}

export type UnsupportedRadioSourceDescriptor = {
  sourceId: string
  sourceUrl: string
  kind: 'unsupported-url'
  isFallback: false
  unsupportedReason: 'custom-url-unsupported'
}

export type RadioSourceDescriptor =
  | GeneratedToneRadioSourceDescriptor
  | SoundCloudWidgetRadioSourceDescriptor
  | UnsupportedRadioSourceDescriptor

export type RadioWaveformCapability = 'exact' | 'limited' | 'none'

const normalizeSourceUrl = (sourceUrl: string): string =>
  sourceUrl.trim().length > 0 ? sourceUrl.trim() : DEFAULT_GUSANO_URL

const isSoundCloudHost = (hostname: string): boolean => {
  const normalizedHostname = hostname.trim().toLowerCase()
  return (
    normalizedHostname === 'soundcloud.com' ||
    normalizedHostname === 'www.soundcloud.com' ||
    normalizedHostname === 'm.soundcloud.com'
  )
}

const isSoundCloudTrackUrl = (sourceUrl: string): boolean => {
  try {
    const parsedUrl = new URL(sourceUrl)
    return parsedUrl.protocol === 'https:' && isSoundCloudHost(parsedUrl.hostname)
  } catch {
    return false
  }
}

export const buildSoundCloudPlayerUrl = (trackUrl: string): string => {
  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'false',
  })
  return `https://w.soundcloud.com/player/?${params.toString()}`
}

export const createFallbackRadioSourceDescriptor = (
  sourceUrl: string,
  fallbackReason: GeneratedToneRadioSourceDescriptor['fallbackReason'] = 'custom-url-fallback',
): GeneratedToneRadioSourceDescriptor => {
  const normalizedSourceUrl = normalizeSourceUrl(sourceUrl)
  const isDefaultSource = normalizedSourceUrl === DEFAULT_GUSANO_URL
  const nextFallbackReason =
    fallbackReason === 'custom-url-fallback' && isDefaultSource
      ? 'default-url-fallback'
      : fallbackReason
  const sourceId =
    nextFallbackReason === 'supported-url-runtime-fallback'
      ? `radio-fallback-runtime:${normalizedSourceUrl}`
      : isDefaultSource
        ? 'radio-fallback-gusano'
        : `radio-fallback-custom:${normalizedSourceUrl}`

  return {
    sourceId,
    sourceUrl: normalizedSourceUrl,
    kind: 'generated-tone',
    durationSec: DEFAULT_FALLBACK_DURATION_SEC,
    isFallback: true,
    fallbackReason: nextFallbackReason,
    toneProfile: buildGeneratedToneProfile(sourceId),
  }
}

export const resolveRadioSourceDescriptor = (sourceUrl: string): RadioSourceDescriptor => {
  const normalizedSourceUrl = normalizeSourceUrl(sourceUrl)
  if (isSoundCloudTrackUrl(normalizedSourceUrl)) {
    return {
      sourceId: `radio-soundcloud:${normalizedSourceUrl}`,
      sourceUrl: normalizedSourceUrl,
      kind: 'soundcloud-widget',
      isFallback: false,
      provider: 'soundcloud',
      trackUrl: normalizedSourceUrl,
      embedUrl: buildSoundCloudPlayerUrl(normalizedSourceUrl),
    }
  }

  return {
    sourceId: `radio-unsupported:${normalizedSourceUrl}`,
    sourceUrl: normalizedSourceUrl,
    kind: 'unsupported-url',
    isFallback: false,
    unsupportedReason: 'custom-url-unsupported',
  }
}

export const resolveRadioWaveformCapability = (
  descriptor: RadioSourceDescriptor,
): RadioWaveformCapability => {
  switch (descriptor.kind) {
    case 'generated-tone':
      return 'exact'
    case 'soundcloud-widget':
      return 'limited'
    case 'unsupported-url':
    default:
      return 'none'
  }
}
