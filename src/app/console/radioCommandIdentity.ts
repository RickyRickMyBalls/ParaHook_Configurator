import type { ConsolePromptSessionKind } from './useConsoleStore'
import type {
  ConsoleStagedNavigationExecuteResult,
  ConsoleStagedNavigationScopeId,
} from './stagedNavigation'

type RadioCommandIdentityInput =
  | {
      kind: 'flatCommand'
      commandName: string | null
    }
  | {
      kind: 'promptSubmit'
      promptKind: ConsolePromptSessionKind
    }
  | {
      kind: 'stagedAdvance'
      activeScopeId: ConsoleStagedNavigationScopeId | null
      matchedCanonicalToken: string
      matchedLabel: string
    }
  | {
      kind: 'stagedChoice'
      activeScopeId: ConsoleStagedNavigationScopeId | null
      matchedCanonicalToken: string
      matchedLabel: string
    }
  | {
      kind: 'stagedExecute'
      activeScopeId: ConsoleStagedNavigationScopeId | null
      actionId: ConsoleStagedNavigationExecuteResult['actionId']
    }
  | {
      kind: 'featureAssistChoice'
      breadcrumb: string[] | undefined
      matchedCanonicalToken: string
      matchedLabel: string
    }
  | {
      kind: 'featureAssistSubmit'
      breadcrumb: string[] | undefined
      submittedToken: string
      matchedCanonicalToken: string | null
      matchedLabel: string | null
    }

const toIdentitySegment = (value: string): string => {
  const normalized = value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\[(\d+)\]/g, ' $1 ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()

  if (normalized.length === 0) {
    return 'Unknown'
  }

  return normalized
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => `${token[0]?.toUpperCase() ?? ''}${token.slice(1).toLowerCase()}`)
    .join('')
}

const buildIdentity = (...segments: string[]): string => segments.join('.')
const normalizeToken = (value: string): string => value.trim().toUpperCase()

const matchesBreadcrumb = (
  breadcrumb: string[] | undefined,
  expected: string[],
): boolean =>
  Array.isArray(breadcrumb) &&
  breadcrumb.length === expected.length &&
  breadcrumb.every((segment, index) => segment === expected[index])

const VEC3_LITERAL_PATTERN =
  /^\s*\(?\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)?\s*$/
const NUMERIC_LITERAL_PATTERN = /^\s*-?\d+(?:\.\d+)?\s*$/

const isVec3LiteralToken = (value: string): boolean => VEC3_LITERAL_PATTERN.test(value)
const isNumericLiteralToken = (value: string): boolean => NUMERIC_LITERAL_PATTERN.test(value)

const resolveSelectionIdentity = (
  prefix: string[],
  label: string,
): string => buildIdentity(...prefix, 'Select', toIdentitySegment(label))

const resolveGraphNodeDeleteIdentity = (
  activeScopeId: ConsoleStagedNavigationScopeId | null,
): string => {
  switch (activeScopeId) {
    case 'graphSketchSelected':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Delete')
    case 'graphExtrudeSelected':
      return buildIdentity('Console', 'Graph', 'Extrude', 'Delete')
    case 'graphOutputPreviewSelected':
      return buildIdentity('Console', 'Graph', 'OutputPreview', 'Delete')
    case 'graphNodeSelected':
      return buildIdentity('Console', 'Graph', 'FocusNode', 'Delete')
    default:
      return buildIdentity('Console', 'Graph', 'Node', 'Delete')
  }
}

const resolveStagedAdvanceIdentity = ({
  activeScopeId,
  matchedCanonicalToken,
  matchedLabel,
}: Extract<RadioCommandIdentityInput, { kind: 'stagedAdvance' }>): string | null => {
  if (activeScopeId === null) {
    if (matchedCanonicalToken === 'GRAPH') {
      return buildIdentity('Console', 'Root', 'Graph')
    }
    if (matchedCanonicalToken === 'RADIO') {
      return buildIdentity('Console', 'Root', 'Radio')
    }
    return null
  }

  switch (activeScopeId) {
    case 'radioRoot':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Radio', 'Back')
        : null
    case 'graphRoot':
      if (matchedCanonicalToken === 'LIST') {
        return buildIdentity('Console', 'Graph', 'List')
      }
      return resolveSelectionIdentity(['Console', 'Graph', 'SelectDocument'], matchedLabel)
    case 'graphSelected':
      switch (matchedCanonicalToken) {
        case 'SKETCH':
          return buildIdentity('Console', 'Graph', 'Sketch')
        case 'EXTRUDE':
          return buildIdentity('Console', 'Graph', 'Extrude')
        case 'OUTPUT PREVIEW':
          return buildIdentity('Console', 'Graph', 'OutputPreview')
        case 'FOCUS NODE':
          return buildIdentity('Console', 'Graph', 'FocusNode')
        case 'REFERENCES':
          return buildIdentity('Console', 'Graph', 'References')
        case 'COLLAPSED':
          return buildIdentity('Console', 'Graph', 'Editor', 'Collapsed')
        case 'ESSENTIALS':
          return buildIdentity('Console', 'Graph', 'Editor', 'Essentials')
        case 'EXPANDED':
          return buildIdentity('Console', 'Graph', 'Editor', 'Expanded')
        case 'OPEN':
          return buildIdentity('Console', 'Graph', 'Open')
        case 'BUILD':
          return buildIdentity('Console', 'Graph', 'Build')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'Back')
        default:
          return null
      }
    case 'graphSketchList':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'Sketch', 'Back')
        : resolveSelectionIdentity(['Console', 'Graph', 'Sketch'], matchedLabel)
    case 'graphExtrudeList':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'Extrude', 'Back')
        : resolveSelectionIdentity(['Console', 'Graph', 'Extrude'], matchedLabel)
    case 'graphOutputPreviewList':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'OutputPreview', 'Back')
        : resolveSelectionIdentity(['Console', 'Graph', 'OutputPreview'], matchedLabel)
    case 'graphNodeList':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'FocusNode', 'Back')
        : resolveSelectionIdentity(['Console', 'Graph', 'FocusNode'], matchedLabel)
    case 'graphSketchSelected':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'Sketch', 'Back')
        : null
    case 'graphExtrudeSelected':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'Extrude', 'Back')
        : null
    case 'graphOutputPreviewSelected':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'OutputPreview', 'Back')
        : null
    case 'graphNodeSelected':
      return matchedCanonicalToken === 'BACK'
        ? buildIdentity('Console', 'Graph', 'FocusNode', 'Back')
        : null
    default:
      return null
  }
}

const resolveStagedChoiceIdentity = ({
  activeScopeId,
  matchedCanonicalToken,
  matchedLabel,
}: Extract<RadioCommandIdentityInput, { kind: 'stagedChoice' }>): string | null => {
  if (activeScopeId === null) {
    return resolveStagedAdvanceIdentity({
      kind: 'stagedAdvance',
      activeScopeId,
      matchedCanonicalToken,
      matchedLabel,
    })
  }

  switch (activeScopeId) {
    case 'radioRoot':
      switch (matchedCanonicalToken) {
        case 'ON':
          return buildIdentity('Console', 'Radio', 'On')
        case 'OFF':
          return buildIdentity('Console', 'Radio', 'Off')
        case 'URL':
          return buildIdentity('Console', 'Radio', 'Url')
        case 'SAMPLEBURSTTIME':
          return buildIdentity('Console', 'Radio', 'SampleBurstTime')
        case 'RANDOMIZESAMPLETIMES':
          return buildIdentity('Console', 'Radio', 'RandomizeSampleTimes')
        case 'BACK':
          return buildIdentity('Console', 'Radio', 'Back')
        default:
          return null
      }
    case 'graphRoot':
    case 'graphSelected':
    case 'graphSketchList':
    case 'graphExtrudeList':
    case 'graphOutputPreviewList':
    case 'graphNodeList':
      return resolveStagedAdvanceIdentity({
        kind: 'stagedAdvance',
        activeScopeId,
        matchedCanonicalToken,
        matchedLabel,
      })
    case 'graphSketchSelected':
      switch (matchedCanonicalToken) {
        case 'SKETCH PLANE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Plane')
        case 'SKETCH DRAW':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw')
        case 'DELETE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Delete')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Back')
        default:
          return null
      }
    case 'graphExtrudeSelected':
      switch (matchedCanonicalToken) {
        case 'DELETE':
          return buildIdentity('Console', 'Graph', 'Extrude', 'Delete')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'Extrude', 'Back')
        default:
          return null
      }
    case 'graphOutputPreviewSelected':
      switch (matchedCanonicalToken) {
        case 'DELETE':
          return buildIdentity('Console', 'Graph', 'OutputPreview', 'Delete')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'OutputPreview', 'Back')
        default:
          return null
      }
    case 'graphNodeSelected':
      switch (matchedCanonicalToken) {
        case 'DELETE':
          return buildIdentity('Console', 'Graph', 'FocusNode', 'Delete')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'FocusNode', 'Back')
        default:
          return null
      }
    default:
      return null
  }
}

const resolveStagedExecuteIdentity = ({
  activeScopeId,
  actionId,
}: Extract<RadioCommandIdentityInput, { kind: 'stagedExecute' }>): string => {
  switch (actionId) {
    case 'radio.on':
      return buildIdentity('Console', 'Radio', 'On')
    case 'radio.off':
      return buildIdentity('Console', 'Radio', 'Off')
    case 'radio.url':
      return buildIdentity('Console', 'Radio', 'Url')
    case 'radio.sampleBurstTime':
      return buildIdentity('Console', 'Radio', 'SampleBurstTime')
    case 'radio.randomizeSampleTimes':
      return buildIdentity('Console', 'Radio', 'RandomizeSampleTimes')
    case 'graph.list':
      return buildIdentity('Console', 'Graph', 'List')
    case 'graph.editor.collapsed':
      return buildIdentity('Console', 'Graph', 'Editor', 'Collapsed')
    case 'graph.editor.essentials':
      return buildIdentity('Console', 'Graph', 'Editor', 'Essentials')
    case 'graph.editor.expanded':
      return buildIdentity('Console', 'Graph', 'Editor', 'Expanded')
    case 'graph.references':
      return buildIdentity('Console', 'Graph', 'References')
    case 'graph.open':
      return buildIdentity('Console', 'Graph', 'Open')
    case 'graph.build':
      return buildIdentity('Console', 'Graph', 'Build')
    case 'sketch.plane':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane')
    case 'sketch.draw':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw')
    case 'node.delete':
      return resolveGraphNodeDeleteIdentity(activeScopeId)
  }
}

const resolveFlatCommandIdentity = (
  commandName: string | null,
): string | null => {
  if (commandName === null) {
    return null
  }

  return buildIdentity('Console', 'Command', toIdentitySegment(commandName))
}

const resolveSketchPlaneFeatureAssistIdentity = ({
  breadcrumb,
  token,
  label,
}: {
  breadcrumb: string[] | undefined
  token: string
  label: string | null
}): string | null => {
  const normalizedToken = normalizeToken(token)
  const normalizedLabel = label === null ? null : normalizeToken(label)

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Plane'])) {
    switch (normalizedToken) {
      case 'XY':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'XY')
      case 'XZ':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'XZ')
      case 'YZ':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'YZ')
      case 'MOVE':
      case 'M':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move')
      case 'ROTATE':
      case 'R':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate')
      case 'DONE':
      case 'D':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Done')
      case 'CONFIRMTOSKETCH':
      case 'C':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'ConfirmToSketch')
      case 'BACK':
      case 'B':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Back')
      default:
        return null
    }
  }

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Plane', 'Move'])) {
    if (normalizedToken === 'SNAP') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Snap')
    }
    if (normalizedToken === 'BACK' || normalizedToken === 'B') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Back')
    }
    if (normalizedToken === 'MOVE X' || normalizedToken === 'X' || normalizedToken === 'MX') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'X')
    }
    if (normalizedToken === 'MOVE Y' || normalizedToken === 'Y' || normalizedToken === 'MY') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Y')
    }
    if (normalizedToken === 'MOVE Z' || normalizedToken === 'Z' || normalizedToken === 'MZ') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Z')
    }
    if (
      isVec3LiteralToken(token) ||
      (normalizedLabel !== null && normalizedLabel.startsWith('VEC3('))
    ) {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Vector')
    }
    return null
  }

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Plane', 'Move', 'Snap'])) {
    if (normalizedToken === 'ON') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Snap', 'On')
    }
    if (normalizedToken === 'OFF') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Snap', 'Off')
    }
    if (normalizedToken === 'BACK' || normalizedToken === 'B') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Snap', 'Back')
    }
    if (isNumericLiteralToken(token)) {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Move', 'Snap', 'Value')
    }
    return null
  }

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Plane', 'Rotate'])) {
    if (normalizedToken === 'SNAP') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Snap')
    }
    if (normalizedToken === 'BACK' || normalizedToken === 'B') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Back')
    }
    if (normalizedToken === 'ROTATE X' || normalizedToken === 'X' || normalizedToken === 'RX') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'X')
    }
    if (normalizedToken === 'ROTATE Y' || normalizedToken === 'Y' || normalizedToken === 'RY') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Y')
    }
    if (normalizedToken === 'ROTATE Z' || normalizedToken === 'Z' || normalizedToken === 'RZ') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Z')
    }
    if (
      isVec3LiteralToken(token) ||
      (normalizedLabel !== null && normalizedLabel.startsWith('VEC3('))
    ) {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Vector')
    }
    return null
  }

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Plane', 'Rotate', 'Snap'])) {
    if (normalizedToken === 'ON') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Snap', 'On')
    }
    if (normalizedToken === 'OFF') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Snap', 'Off')
    }
    if (normalizedToken === 'BACK' || normalizedToken === 'B') {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Snap', 'Back')
    }
    if (isNumericLiteralToken(token)) {
      return buildIdentity('Console', 'Graph', 'Sketch', 'Plane', 'Rotate', 'Snap', 'Value')
    }
    return null
  }

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Draw'])) {
    switch (normalizedToken) {
      case 'LINE':
      case 'L':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Line')
      case 'PLINE':
      case 'PL':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'PLine')
      case 'X':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Exit')
      default:
        return null
    }
  }

  return null
}

export const resolveConsoleRadioCommandIdentity = (
  input: RadioCommandIdentityInput,
): string | null => {
  switch (input.kind) {
    case 'flatCommand':
      return resolveFlatCommandIdentity(input.commandName)
    case 'promptSubmit':
      return input.promptKind === 'radio.url'
        ? buildIdentity('Console', 'Radio', 'Url', 'PromptSubmit')
        : buildIdentity('Console', 'Radio', 'SampleBurstTime', 'PromptSubmit')
    case 'stagedAdvance':
      return resolveStagedAdvanceIdentity(input)
    case 'stagedChoice':
      return resolveStagedChoiceIdentity(input)
    case 'stagedExecute':
      return resolveStagedExecuteIdentity(input)
    case 'featureAssistChoice':
      return resolveSketchPlaneFeatureAssistIdentity({
        breadcrumb: input.breadcrumb,
        token: input.matchedCanonicalToken,
        label: input.matchedLabel,
      })
    case 'featureAssistSubmit':
      return resolveSketchPlaneFeatureAssistIdentity({
        breadcrumb: input.breadcrumb,
        token: input.matchedCanonicalToken ?? input.submittedToken,
        label: input.matchedLabel,
      })
  }
}
