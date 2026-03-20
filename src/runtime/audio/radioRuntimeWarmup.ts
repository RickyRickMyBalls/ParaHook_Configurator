type RadioRuntimeWarmupHandler = (sourceUrl: string) => void

let activeRadioRuntimeWarmupHandler: RadioRuntimeWarmupHandler | null = null

export const registerRadioRuntimeWarmupHandler = (
  handler: RadioRuntimeWarmupHandler,
): (() => void) => {
  activeRadioRuntimeWarmupHandler = handler
  return () => {
    if (activeRadioRuntimeWarmupHandler === handler) {
      activeRadioRuntimeWarmupHandler = null
    }
  }
}

export const requestRadioRuntimeWarmup = (sourceUrl: string): void => {
  activeRadioRuntimeWarmupHandler?.(sourceUrl)
}
