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
export type ConsoleCommandLineKind = 'user' | 'system'

export type ConsoleTranscriptEntry = {
  id: string
  sequence: number
  createdAtMs: number
  timestampLabel: string
  layer: ConsoleLayer
  commandLineKind: ConsoleCommandLineKind | null
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
  commandLineKind?: ConsoleCommandLineKind
  text: string
  source?: string | null
  severity?: ConsoleSeverity
}

export type ConsoleAssistChoice = {
  canonicalToken: string
  aliases: string[]
  label: string
}

export type ConsoleAssistDescriptor = {
  label: string
  choices: ConsoleAssistChoice[]
  prefill: string | null
}
