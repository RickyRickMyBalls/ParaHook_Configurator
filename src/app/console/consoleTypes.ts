export type ConsoleLayer =
  | 'Commands'
  | 'Shortcuts'
  | 'App'
  | 'Worker'
  | 'Diagnostics'
  | 'Params'
  | 'Selection'
  | 'View'
  | 'Browser'
  | 'Transforms'

export type ConsoleFilterMode = 'normal' | 'isolate' | 'subset'

export type ConsoleSeverity = 'normal' | 'info' | 'warn' | 'error'

export type ConsoleTranscriptEntry = {
  id: string
  sequence: number
  createdAtMs: number
  timestampLabel: string
  layer: ConsoleLayer
  text: string
  source: string | null
  severity: ConsoleSeverity
}

export type ConsoleLayerVisibility = Record<ConsoleLayer, boolean>

export type ConsoleBackgroundFillMode = 'blur' | 'flat' | 'clear'
export type ConsoleBackgroundColorMode = 'midnight' | 'slate' | 'navy'
export type ConsoleWindowMode = 'docked' | 'floating' | 'popout' | 'list'
export type ConsoleToolsPreset = 'default' | 'clear' | 'custom'

export type ConsoleFloatingRect = {
  x: number
  y: number
  width: number
  height: number
}

export type ConsoleAppendEntryInput = {
  layer: ConsoleLayer
  text: string
  source?: string | null
  severity?: ConsoleSeverity
}
