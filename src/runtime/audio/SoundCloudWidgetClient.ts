import type { SoundCloudWidgetRadioSourceDescriptor } from './ClipLibrary'

const SOUNDCLOUD_WIDGET_API_SCRIPT_SRC = 'https://w.soundcloud.com/player/api.js'

type SoundCloudWidgetLike = {
  bind: (eventName: string, callback: (payload?: unknown) => void) => void
  unbind?: (eventName: string) => void
  load: (url: string, options?: Record<string, unknown>) => void
  seekTo: (positionMs: number) => void
  play: () => void
  pause: () => void
  getDuration: (callback: (durationMs: number) => void) => void
  getPosition?: (callback: (positionMs: number) => void) => void
}

type SoundCloudWidgetFactory = ((iframe: HTMLIFrameElement) => SoundCloudWidgetLike) & {
  Events?: {
    READY?: string
    PLAY?: string
    PLAY_PROGRESS?: string
    ERROR?: string
  }
}

type SoundCloudApiGlobal = {
  Widget: SoundCloudWidgetFactory
}

declare global {
  interface Window {
    SC?: SoundCloudApiGlobal
  }
}

export type SoundCloudWidgetPlaybackClient = {
  ensureSourceReady: (
    descriptor: SoundCloudWidgetRadioSourceDescriptor,
  ) => Promise<{ durationSec: number }>
  getTransportState: (
    descriptor: SoundCloudWidgetRadioSourceDescriptor,
  ) => Promise<{
    currentTimeSec: number
    durationSec: number
    isSeekable: true
    isPlaying: boolean
  }>
  seekTo: (input: {
    descriptor: SoundCloudWidgetRadioSourceDescriptor
    timeSec: number
  }) => Promise<void>
  playWindow: (input: {
    descriptor: SoundCloudWidgetRadioSourceDescriptor
    startTimeSec: number
    durationSec: number
  }) => Promise<void>
  stop: () => void
  dispose: () => void
}

export type CreateBrowserSoundCloudWidgetClientOptions = {
  getIframe: () => HTMLIFrameElement | null
}

let loadSoundCloudWidgetApiPromise: Promise<SoundCloudApiGlobal> | null = null

const getReadyEventName = (api: SoundCloudApiGlobal): string =>
  api.Widget.Events?.READY ?? 'READY'
const getPlayEventName = (api: SoundCloudApiGlobal): string => api.Widget.Events?.PLAY ?? 'PLAY'
const getPlayProgressEventName = (api: SoundCloudApiGlobal): string =>
  api.Widget.Events?.PLAY_PROGRESS ?? 'PLAY_PROGRESS'
const getErrorEventName = (api: SoundCloudApiGlobal): string => api.Widget.Events?.ERROR ?? 'ERROR'

const loadSoundCloudWidgetApi = async (): Promise<SoundCloudApiGlobal> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('SoundCloud widget playback is not available in this environment')
  }

  if (window.SC?.Widget !== undefined) {
    return window.SC
  }

  if (loadSoundCloudWidgetApiPromise !== null) {
    return loadSoundCloudWidgetApiPromise
  }

  loadSoundCloudWidgetApiPromise = new Promise<SoundCloudApiGlobal>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-soundcloud-widget-api="true"]',
    )
    if (existingScript !== null) {
      const handleExistingLoad = () => {
        if (window.SC?.Widget !== undefined) {
          resolve(window.SC)
          return
        }
        reject(new Error('SoundCloud widget API loaded without exposing SC.Widget'))
      }
      existingScript.addEventListener('load', handleExistingLoad, { once: true })
      existingScript.addEventListener(
        'error',
        () => {
          reject(new Error('SoundCloud widget API failed to load'))
        },
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = SOUNDCLOUD_WIDGET_API_SCRIPT_SRC
    script.async = true
    script.dataset.soundcloudWidgetApi = 'true'
    script.addEventListener(
      'load',
      () => {
        if (window.SC?.Widget !== undefined) {
          resolve(window.SC)
          return
        }
        reject(new Error('SoundCloud widget API loaded without exposing SC.Widget'))
      },
      { once: true },
    )
    script.addEventListener(
      'error',
      () => {
        reject(new Error('SoundCloud widget API failed to load'))
      },
      { once: true },
    )
    document.head.appendChild(script)
  }).catch((error) => {
    loadSoundCloudWidgetApiPromise = null
    throw error
  })

  return loadSoundCloudWidgetApiPromise
}

const waitForWidgetReady = (input: {
  widget: SoundCloudWidgetLike
  readyEventName: string
  errorEventName: string
  timeoutMs: number
}): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    let settled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const settle = (fn: () => void) => {
      if (settled) {
        return
      }
      settled = true
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      input.widget.unbind?.(input.readyEventName)
      input.widget.unbind?.(input.errorEventName)
      fn()
    }

    input.widget.bind(input.readyEventName, () => {
      settle(() => resolve())
    })
    input.widget.bind(input.errorEventName, (payload) => {
      settle(() =>
        reject(
          new Error(
            typeof payload === 'string' && payload.trim().length > 0
              ? payload
              : 'SoundCloud widget failed to become ready',
          ),
        ),
      )
    })

    timeoutId = setTimeout(() => {
      settle(() => reject(new Error('SoundCloud widget did not become ready in time')))
    }, input.timeoutMs)
  })

const getWidgetDurationSec = (widget: SoundCloudWidgetLike): Promise<number> =>
  new Promise<number>((resolve) => {
    widget.getDuration((durationMs) => {
      resolve(Math.max(0.01, durationMs / 1000))
    })
  })

const getWidgetPositionSec = (widget: SoundCloudWidgetLike): Promise<number> =>
  new Promise<number>((resolve) => {
    if (widget.getPosition === undefined) {
      resolve(0)
      return
    }
    widget.getPosition((positionMs) => {
      resolve(Math.max(0, positionMs / 1000))
    })
  })

const waitForPlaybackStart = (input: {
  widget: SoundCloudWidgetLike
  playEventName: string
  playProgressEventName: string
  errorEventName: string
  timeoutMs: number
}): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    let settled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const settle = (fn: () => void) => {
      if (settled) {
        return
      }
      settled = true
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      input.widget.unbind?.(input.playEventName)
      input.widget.unbind?.(input.playProgressEventName)
      input.widget.unbind?.(input.errorEventName)
      fn()
    }

    input.widget.bind(input.playEventName, () => {
      settle(() => resolve())
    })
    input.widget.bind(input.playProgressEventName, () => {
      settle(() => resolve())
    })
    input.widget.bind(input.errorEventName, (payload) => {
      settle(() =>
        reject(
          new Error(
            typeof payload === 'string' && payload.trim().length > 0
              ? payload
              : 'SoundCloud widget playback failed',
          ),
        ),
      )
    })

    timeoutId = setTimeout(() => {
      settle(() => reject(new Error('SoundCloud playback did not start in time')))
    }, input.timeoutMs)
  })

export const createBrowserSoundCloudWidgetClient = (
  options: CreateBrowserSoundCloudWidgetClientOptions,
): SoundCloudWidgetPlaybackClient => {
  let widgetApi: SoundCloudApiGlobal | null = null
  let widget: SoundCloudWidgetLike | null = null
  let loadedSourceId: string | null = null
  let activePauseTimeoutId: ReturnType<typeof setTimeout> | null = null
  let isPlaying = false

  const clearPauseTimeout = (): void => {
    if (activePauseTimeoutId === null) {
      return
    }
    clearTimeout(activePauseTimeoutId)
    activePauseTimeoutId = null
  }

  const getOrCreateWidget = async (): Promise<{
    api: SoundCloudApiGlobal
    widget: SoundCloudWidgetLike
  }> => {
    const iframe = options.getIframe()
    if (iframe === null) {
      throw new Error('Radio SoundCloud iframe host is not mounted')
    }

    const api = widgetApi ?? (await loadSoundCloudWidgetApi())
    widgetApi = api

    if (widget === null) {
      if (iframe.src.length === 0) {
        iframe.src = 'https://w.soundcloud.com/player/'
      }
      widget = api.Widget(iframe)
    }

    return { api, widget }
  }

  const ensureDescriptorLoaded = async (
    descriptor: SoundCloudWidgetRadioSourceDescriptor,
  ): Promise<{
    api: SoundCloudApiGlobal
    widget: SoundCloudWidgetLike
    durationSec: number
  }> => {
    const { api, widget: currentWidget } = await getOrCreateWidget()
    if (loadedSourceId !== descriptor.sourceId) {
      const readyPromise = waitForWidgetReady({
        widget: currentWidget,
        readyEventName: getReadyEventName(api),
        errorEventName: getErrorEventName(api),
        timeoutMs: 3000,
      })
      currentWidget.load(descriptor.trackUrl, {
        auto_play: false,
        hide_related: true,
        show_comments: false,
        show_reposts: false,
        show_teaser: false,
        visual: false,
      })
      await readyPromise
      loadedSourceId = descriptor.sourceId
    }

    return {
      api,
      widget: currentWidget,
      durationSec: await getWidgetDurationSec(currentWidget),
    }
  }

  return {
    ensureSourceReady: async (descriptor) => {
      const ready = await ensureDescriptorLoaded(descriptor)
      return { durationSec: ready.durationSec }
    },
    getTransportState: async (descriptor) => {
      const ready = await ensureDescriptorLoaded(descriptor)

      return {
        currentTimeSec: await getWidgetPositionSec(ready.widget),
        durationSec: ready.durationSec,
        isSeekable: true as const,
        isPlaying,
      }
    },
    seekTo: async ({ descriptor, timeSec }) => {
      const ready = await ensureDescriptorLoaded(descriptor)
      clearPauseTimeout()
      ready.widget.seekTo(Math.max(0, Math.round(timeSec * 1000)))
      ready.widget.pause()
      isPlaying = false
    },
    playWindow: async ({ startTimeSec, durationSec }) => {
      const { api, widget: currentWidget } = await getOrCreateWidget()
      clearPauseTimeout()
      const playbackStartPromise = waitForPlaybackStart({
        widget: currentWidget,
        playEventName: getPlayEventName(api),
        playProgressEventName: getPlayProgressEventName(api),
        errorEventName: getErrorEventName(api),
        timeoutMs: 1500,
      })
      currentWidget.seekTo(Math.max(0, Math.round(startTimeSec * 1000)))
      currentWidget.play()
      await playbackStartPromise
      isPlaying = true
      activePauseTimeoutId = setTimeout(() => {
        currentWidget.pause()
        isPlaying = false
        activePauseTimeoutId = null
      }, Math.max(10, Math.round(durationSec * 1000)))
    },
    stop: () => {
      clearPauseTimeout()
      widget?.pause()
      isPlaying = false
    },
    dispose: () => {
      clearPauseTimeout()
      widget?.pause()
      isPlaying = false
      widget = null
      widgetApi = null
      loadedSourceId = null
    },
  }
}
