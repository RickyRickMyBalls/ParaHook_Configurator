import { describe, expect, it } from 'vitest'
import {
  buildConsolePromptSessionText,
  buildRootPromptText,
  buildStagedPromptText,
  formatStagedBreadcrumb,
  ROOT_PROMPT_TEXT,
} from './consolePromptText'
import type { ConsolePromptSession } from './useConsoleStore'
import type {
  ConsoleStagedNavigationChoice,
  ConsoleStagedNavigationSession,
} from './stagedNavigation'

const createChoice = (
  canonicalToken: string,
  label: string,
): ConsoleStagedNavigationChoice => ({
  canonicalToken,
  aliases: [],
  label,
  kind: 'scope',
})

const createSession = (
  scopeId: ConsoleStagedNavigationSession['scopeId'],
  breadcrumb: string[],
  validChoices: ConsoleStagedNavigationChoice[] = [],
): ConsoleStagedNavigationSession => ({
  scopeId,
  breadcrumb,
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices,
})

describe('consolePromptText', () => {
  it('formats breadcrumbs and root prompt text', () => {
    expect(formatStagedBreadcrumb(['Graph', 'Sketch'])).toBe('Graph > Sketch')
    expect(buildRootPromptText()).toBe(ROOT_PROMPT_TEXT)
    expect(buildRootPromptText(['One', 'Two'])).toBe('Root > Choose next [One, Two]')
  })

  it('builds staged prompt text for normal and snap-value scopes', () => {
    const rootSession = createSession('root', ['Root'], [
      createChoice('GRAPH', 'Graph'),
      createChoice('RADIO', 'Radio'),
    ])
    expect(buildStagedPromptText(rootSession, rootSession.validChoices)).toBe(
      'Root > Choose next [Graph, Radio]',
    )

    const snapSession = createSession(
      'referenceTransformMoveSnapRoot',
      ['References', 'Move', 'Snap'],
      [createChoice('1', '1'), createChoice('5', '5')],
    )
    expect(buildStagedPromptText(snapSession, snapSession.validChoices)).toBe(
      'References > Move > Snap > Enter value [1, 5]',
    )
  })

  it('builds prompt-session text for axis, confirmation, and generic prompts', () => {
    const axisPrompt: ConsolePromptSession = {
      kind: 'reference-transform.axis',
      breadcrumb: ['References', 'Move', 'X'],
      label: 'Move X',
      prefill: '1',
      returnSession: createSession('referenceTransformRoot', ['References', 'Move']),
      mode: 'translate',
      axis: 'x',
    }
    expect(buildConsolePromptSessionText(axisPrompt)).toBe(
      'References > Move > X > Choose next [Enter value, Y, Z, Scale, Rotate]',
    )

    const confirmPrompt: ConsolePromptSession = {
      kind: 'transform.delete-latest.confirm',
      breadcrumb: ['Content', 'Delete Latest'],
      label: 'Delete Latest',
      prefill: 'Yes / No',
      returnSession: createSession('contentObjectTransformRoot', ['Content', 'Move']),
      target: { kind: 'content-object', objectId: 'object-1' },
    }
    expect(buildConsolePromptSessionText(confirmPrompt)).toBe(
      'Content > Delete Latest > Are you sure? [Yes / No]',
    )

    const radioPrompt: ConsolePromptSession = {
      kind: 'radio.url',
      breadcrumb: ['Radio', 'Url'],
      label: 'Radio Url',
      prefill: 'https://example.com',
      returnSession: createSession('radioRoot', ['Radio']),
    }
    expect(buildConsolePromptSessionText(radioPrompt)).toBe(
      'Radio > Url > Enter value [https://example.com]',
    )
  })
})
