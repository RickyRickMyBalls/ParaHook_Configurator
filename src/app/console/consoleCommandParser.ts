export type ConsoleCommandName =
  | 'help'
  | 'console'
  | 'clear'
  | 'history'
  | 'frame'
  | 'zoom'
  | 'pan'
  | 'orbit'
  | 'move'
  | 'rotate'
  | 'scale'
  | 'snap'
  | 'echo'
  | 'status'

const CONSOLE_COMMAND_ALIASES: Record<string, ConsoleCommandName> = {
  help: 'help',
  console: 'console',
  clear: 'clear',
  history: 'history',
  frame: 'frame',
  f: 'frame',
  zoom: 'zoom',
  z: 'zoom',
  pan: 'pan',
  orbit: 'orbit',
  move: 'move',
  m: 'move',
  rotate: 'rotate',
  r: 'rotate',
  scale: 'scale',
  s: 'scale',
  snap: 'snap',
  echo: 'echo',
  status: 'status',
}

export const parseConsoleCommand = (
  inputText: string,
): {
  raw: string
  name: ConsoleCommandName | null
  args: string[]
  argumentText: string
} | null => {
  const raw = inputText.trim()
  if (raw.length === 0) {
    return null
  }
  const firstSpaceIndex = raw.search(/\s/)
  const commandText =
    firstSpaceIndex === -1 ? raw.toLowerCase() : raw.slice(0, firstSpaceIndex).toLowerCase()
  const argumentText = firstSpaceIndex === -1 ? '' : raw.slice(firstSpaceIndex).trim()
  const args = argumentText.length === 0 ? [] : argumentText.split(/\s+/)
  return {
    raw,
    name: CONSOLE_COMMAND_ALIASES[commandText] ?? null,
    args,
    argumentText,
  }
}

export const normalizeConsoleBranchTokens = (args: string[]): string[] =>
  args
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && token !== '>')
    .map((token) => token.toLowerCase())

export const parseZoomCommandAction = (
  args: string[],
): 'all' | 'extents' | 'previous' | 'window' | 'object' | null => {
  const normalizedTokens = normalizeConsoleBranchTokens(args)
  const terminalToken = normalizedTokens.at(-1) ?? null
  if (terminalToken === null) {
    return null
  }
  if (terminalToken === 'a' || terminalToken === 'all') {
    return 'all'
  }
  if (terminalToken === 'e' || terminalToken === 'extents') {
    return 'extents'
  }
  if (terminalToken === 'p' || terminalToken === 'previous') {
    return 'previous'
  }
  if (terminalToken === 'w' || terminalToken === 'window') {
    return 'window'
  }
  if (terminalToken === 'o' || terminalToken === 'object') {
    return 'object'
  }
  return null
}

export const normalizeRadioCommandIdentity = (rawToken: string): string =>
  rawToken.trim().toUpperCase().replace(/\s+/g, ' ')
