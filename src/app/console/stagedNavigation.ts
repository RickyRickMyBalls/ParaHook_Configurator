export type ConsoleStagedSketchOption = {
  nodeId: string
}

export type ConsoleStagedGraphOption = {
  graphDocumentId: string
  name: string
  sketchOptions?: ConsoleStagedSketchOption[]
}

export type ConsoleStagedNavigationContext = {
  graphOptions: Array<{
    graphDocumentId: string
    name: string
    sketchOptions: ConsoleStagedSketchOption[]
  }>
}

export type ConsoleStagedNavigationChoiceKind = 'scope' | 'action'

export type ConsoleStagedNavigationChoice = {
  canonicalToken: string
  aliases: string[]
  label: string
  kind: ConsoleStagedNavigationChoiceKind
}

export type ConsoleStagedNavigationScopeId =
  | 'graphRoot'
  | 'graphSelected'
  | 'graphSketchList'
  | 'graphSketchSelected'

export type ConsoleStagedNavigationSelection = {
  graphDocumentId: string | null
  sketchNodeId: string | null
}

export type ConsoleStagedNavigationSession = {
  scopeId: ConsoleStagedNavigationScopeId
  breadcrumb: string[]
  selections: ConsoleStagedNavigationSelection
  validChoices: ConsoleStagedNavigationChoice[]
}

export type ConsoleStagedNavigationExecuteResult = {
  kind: 'execute'
  session: ConsoleStagedNavigationSession
  submittedToken: string
  matchedChoice: ConsoleStagedNavigationChoice
  actionId:
    | 'graph.list'
    | 'graph.editor.collapsed'
    | 'graph.editor.essentials'
    | 'graph.editor.expanded'
    | 'graph.references'
    | 'graph.open'
    | 'graph.build'
    | 'sketch.plane'
    | 'sketch.draw'
  breadcrumb: string[]
  selections: ConsoleStagedNavigationSelection
}

export type ConsoleStagedNavigationAdvanceResult = {
  kind: 'advance'
  session: ConsoleStagedNavigationSession
  submittedToken: string
  matchedChoice: ConsoleStagedNavigationChoice
  breadcrumb: string[]
  validChoices: ConsoleStagedNavigationChoice[]
  selections: ConsoleStagedNavigationSelection
  autoSelections: ConsoleStagedNavigationChoice[]
}

export type ConsoleStagedNavigationInvalidResult = {
  kind: 'invalid'
  session: ConsoleStagedNavigationSession | null
  submittedToken: string
  breadcrumb: string[]
  validChoices: ConsoleStagedNavigationChoice[]
}

export type ConsoleStagedNavigationCancelledResult = {
  kind: 'cancelled'
  session: null
  breadcrumb: []
  validChoices: ConsoleStagedNavigationChoice[]
}

export type ConsoleStagedNavigationResult =
  | ConsoleStagedNavigationAdvanceResult
  | ConsoleStagedNavigationExecuteResult
  | ConsoleStagedNavigationInvalidResult
  | ConsoleStagedNavigationCancelledResult

const ROOT_GRAPH_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'GRAPH',
  aliases: ['G'],
  label: 'Graph',
  kind: 'scope',
}

const GRAPH_SKETCH_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SKETCH',
  aliases: ['S'],
  label: 'Sketch',
  kind: 'scope',
}

const GRAPH_REFERENCES_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'REFERENCES',
  aliases: ['R'],
  label: 'References',
  kind: 'action',
}

const GRAPH_EDITOR_COLLAPSED_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'COLLAPSED',
  aliases: ['-'],
  label: 'Collapsed',
  kind: 'action',
}

const GRAPH_EDITOR_ESSENTIALS_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ESSENTIALS',
  aliases: ['E'],
  label: 'Essentials',
  kind: 'action',
}

const GRAPH_EDITOR_EXPANDED_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'EXPANDED',
  aliases: ['+'],
  label: 'Expanded',
  kind: 'action',
}

const GRAPH_OPEN_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OPEN',
  aliases: ['O'],
  label: 'Open',
  kind: 'action',
}

const GRAPH_BUILD_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'BUILD',
  aliases: [],
  label: 'Build',
  kind: 'action',
}

const SKETCH_DRAW_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SKETCH DRAW',
  aliases: ['SKETCHDRAW', 'SD'],
  label: 'Sketch Draw',
  kind: 'action',
}

const SKETCH_PLANE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SKETCH PLANE',
  aliases: ['SKETCHPLANE', 'SP'],
  label: 'Sketch Plane',
  kind: 'action',
}

const createBackChoice = (): ConsoleStagedNavigationChoice => ({
  canonicalToken: 'BACK',
  aliases: ['B'],
  label: 'Back',
  kind: 'scope',
})

const normalizeToken = (value: string): string => value.trim().toUpperCase()

const matchesChoice = (choice: ConsoleStagedNavigationChoice, normalizedToken: string): boolean =>
  normalizedToken === choice.canonicalToken || choice.aliases.includes(normalizedToken)

const buildRootChoices = (): ConsoleStagedNavigationChoice[] => [ROOT_GRAPH_CHOICE]

const buildGraphRootChoices = (
  graphOptions: ConsoleStagedNavigationContext['graphOptions'],
): ConsoleStagedNavigationChoice[] => [
  ...graphOptions.map((_, index) => ({
    canonicalToken: `${index + 1}`,
    aliases: [],
    label: `graph_[${index + 1}]`,
    kind: 'scope' as const,
  })),
  {
    canonicalToken: 'LIST',
    aliases: [],
    label: 'List',
    kind: 'action' as const,
  },
]

const buildGraphSelectedChoices = (): ConsoleStagedNavigationChoice[] => [
  GRAPH_SKETCH_CHOICE,
  GRAPH_EDITOR_COLLAPSED_CHOICE,
  GRAPH_EDITOR_ESSENTIALS_CHOICE,
  GRAPH_EDITOR_EXPANDED_CHOICE,
  GRAPH_REFERENCES_CHOICE,
  GRAPH_OPEN_CHOICE,
  GRAPH_BUILD_CHOICE,
  createBackChoice(),
]

const buildGraphSketchListChoices = (
  sketchOptions: ConsoleStagedSketchOption[],
): ConsoleStagedNavigationChoice[] =>
  [
    ...sketchOptions.map((_, index) => ({
      canonicalToken: `${index + 1}`,
      aliases: [],
      label: `sketch_[${index + 1}]`,
      kind: 'scope' as const,
    })),
    createBackChoice(),
  ]

const buildGraphSketchSelectedChoices = (): ConsoleStagedNavigationChoice[] => [
  SKETCH_PLANE_CHOICE,
  SKETCH_DRAW_CHOICE,
  createBackChoice(),
]

const createGraphRootSession = (
  context: ConsoleStagedNavigationContext,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphRoot',
  breadcrumb: ['Select', 'Graph'],
  selections: {
    graphDocumentId: null,
    sketchNodeId: null,
  },
  validChoices: buildGraphRootChoices(context.graphOptions),
})

const createAdvanceResult = (
  session: ConsoleStagedNavigationSession,
  submittedToken: string,
  matchedChoice: ConsoleStagedNavigationChoice,
  autoSelections: ConsoleStagedNavigationChoice[] = [],
): ConsoleStagedNavigationAdvanceResult => ({
  kind: 'advance',
  session,
  submittedToken,
  matchedChoice,
  breadcrumb: session.breadcrumb,
  validChoices: session.validChoices,
  selections: session.selections,
  autoSelections,
})

const createInvalidResult = (
  session: ConsoleStagedNavigationSession | null,
  submittedToken: string,
  validChoices: ConsoleStagedNavigationChoice[],
): ConsoleStagedNavigationInvalidResult => ({
  kind: 'invalid',
  session,
  submittedToken,
  breadcrumb: session?.breadcrumb ?? [],
  validChoices,
})

const createGraphSelectedSession = (
  graphIndex: number,
  graphDocumentId: string,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphSelected',
  breadcrumb: ['Select', 'Graph', `graph_[${graphIndex}]`],
  selections: {
    graphDocumentId,
    sketchNodeId: null,
  },
  validChoices: buildGraphSelectedChoices(),
})

const findGraphIndexByDocumentId = (
  context: ConsoleStagedNavigationContext,
  graphDocumentId: string | null,
): number | null => {
  if (graphDocumentId === null) {
    return null
  }
  const graphIndex = context.graphOptions.findIndex(
    (graphOption) => graphOption.graphDocumentId === graphDocumentId,
  )
  return graphIndex === -1 ? null : graphIndex + 1
}

const createGraphSketchListSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
  sketchOptions: ConsoleStagedSketchOption[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphSketchList',
  breadcrumb,
  selections,
  validChoices: buildGraphSketchListChoices(sketchOptions),
})

const createGraphSketchSelectedSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphSketchSelected',
  breadcrumb,
  selections,
  validChoices: buildGraphSketchSelectedChoices(),
})

const resolveSingleGraphAutoAdvance = (
  context: ConsoleStagedNavigationContext,
): {
  session: ConsoleStagedNavigationSession
  autoSelections: ConsoleStagedNavigationChoice[]
} | null => {
  if (context.graphOptions.length !== 1) {
    return null
  }
  const graphDocumentId = context.graphOptions[0]?.graphDocumentId ?? null
  if (graphDocumentId === null) {
    return null
  }
  const autoChoice: ConsoleStagedNavigationChoice = {
    canonicalToken: '1',
    aliases: [],
    label: 'graph_[1]',
    kind: 'scope',
  }
  return {
    session: createGraphSelectedSession(1, graphDocumentId),
    autoSelections: [autoChoice],
  }
}

const resolveSingleSketchAutoAdvance = (
  session: ConsoleStagedNavigationSession,
  context: ConsoleStagedNavigationContext,
): {
  session: ConsoleStagedNavigationSession
  autoSelections: ConsoleStagedNavigationChoice[]
} | null => {
  const selectedGraph = context.graphOptions.find(
    (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
  )
  if (selectedGraph === undefined || selectedGraph.sketchOptions.length !== 1) {
    return null
  }
  const sketchNodeId = selectedGraph.sketchOptions[0]?.nodeId ?? null
  if (sketchNodeId === null) {
    return null
  }
  const autoChoice: ConsoleStagedNavigationChoice = {
    canonicalToken: '1',
    aliases: [],
    label: 'sketch_[1]',
    kind: 'scope',
  }
  return {
    session: createGraphSketchSelectedSession([...session.breadcrumb, 'sketch_[1]'], {
      ...session.selections,
      sketchNodeId,
    }),
    autoSelections: [autoChoice],
  }
}

export const createConsoleStagedNavigationContext = (
  graphOptions: ConsoleStagedGraphOption[],
): ConsoleStagedNavigationContext => ({
  graphOptions: graphOptions.map((option) => ({
    graphDocumentId: option.graphDocumentId,
    name: option.name,
    sketchOptions: (option.sketchOptions ?? []).map((sketchOption) => ({
      nodeId: sketchOption.nodeId,
    })),
  })),
})

export const isConsoleStagedNavigationRootToken = (submittedToken: string): boolean =>
  matchesChoice(ROOT_GRAPH_CHOICE, normalizeToken(submittedToken))

export const submitConsoleStagedNavigationToken = (
  session: ConsoleStagedNavigationSession | null,
  submittedToken: string,
  context: ConsoleStagedNavigationContext,
): ConsoleStagedNavigationResult => {
  const normalizedToken = normalizeToken(submittedToken)
  if (normalizedToken.length === 0) {
    return createInvalidResult(session, submittedToken, session?.validChoices ?? buildRootChoices())
  }

  if (session === null) {
    if (!matchesChoice(ROOT_GRAPH_CHOICE, normalizedToken)) {
      return createInvalidResult(null, submittedToken, buildRootChoices())
    }
    const rootSession = createGraphRootSession(context)
    const graphAutoAdvance = resolveSingleGraphAutoAdvance(context)
    if (graphAutoAdvance !== null) {
      return createAdvanceResult(
        graphAutoAdvance.session,
        submittedToken,
        ROOT_GRAPH_CHOICE,
        graphAutoAdvance.autoSelections,
      )
    }
    return createAdvanceResult(rootSession, submittedToken, ROOT_GRAPH_CHOICE)
  }

  if (session.scopeId === 'graphRoot') {
    const graphRootChoices = buildGraphRootChoices(context.graphOptions)
    const listChoice = graphRootChoices.find((choice) => choice.canonicalToken === 'LIST') ?? null
    if (listChoice !== null && matchesChoice(listChoice, normalizedToken)) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: graphRootChoices,
        },
        submittedToken,
        matchedChoice: listChoice,
        actionId: 'graph.list',
        breadcrumb: session.breadcrumb,
        selections: session.selections,
      }
    }

    const graphIndex = Number.parseInt(normalizedToken, 10)
    if (!Number.isInteger(graphIndex) || `${graphIndex}` !== normalizedToken) {
      return createInvalidResult(
        { ...session, validChoices: graphRootChoices },
        submittedToken,
        graphRootChoices,
      )
    }

    const graphOption = context.graphOptions[graphIndex - 1] ?? null
    if (graphOption === null) {
      return createInvalidResult(
        { ...session, validChoices: graphRootChoices },
        submittedToken,
        graphRootChoices,
      )
    }

    const matchedChoice = graphRootChoices.find(
      (choice) => choice.canonicalToken === normalizedToken,
    ) ?? {
      canonicalToken: normalizedToken,
      aliases: [],
      label: `graph_[${graphIndex}]`,
      kind: 'scope' as const,
    }
    return createAdvanceResult(
      createGraphSelectedSession(graphIndex, graphOption.graphDocumentId),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'graphSelected') {
    const graphSelectedChoices = buildGraphSelectedChoices()
    const matchedChoice =
      graphSelectedChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: graphSelectedChoices },
        submittedToken,
        graphSelectedChoices,
      )
    }

    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createGraphRootSession(context), submittedToken, matchedChoice)
    }

    if (matchedChoice.kind === 'action') {
      const actionIdByToken: Record<
        string,
        Exclude<ConsoleStagedNavigationExecuteResult['actionId'], 'sketch.draw' | 'sketch.plane'>
      > = {
        COLLAPSED: 'graph.editor.collapsed',
        ESSENTIALS: 'graph.editor.essentials',
        EXPANDED: 'graph.editor.expanded',
        REFERENCES: 'graph.references',
        OPEN: 'graph.open',
        BUILD: 'graph.build',
      }
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: graphSelectedChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: actionIdByToken[matchedChoice.canonicalToken],
        breadcrumb: session.breadcrumb,
        selections: session.selections,
      }
    }

    const selectedGraph = context.graphOptions.find(
      (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
    )
    const sketchOptions = selectedGraph?.sketchOptions ?? []
    const sketchListSession = createGraphSketchListSession(
      [...session.breadcrumb, matchedChoice.label],
      session.selections,
      sketchOptions,
    )
    const sketchAutoAdvance = resolveSingleSketchAutoAdvance(sketchListSession, context)
    if (sketchAutoAdvance !== null) {
      return createAdvanceResult(
        sketchAutoAdvance.session,
        submittedToken,
        matchedChoice,
        sketchAutoAdvance.autoSelections,
      )
    }
    return createAdvanceResult(sketchListSession, submittedToken, matchedChoice)
  }

  if (session.scopeId === 'graphSketchList') {
    const selectedGraph = context.graphOptions.find(
      (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
    )
    const sketchOptions = selectedGraph?.sketchOptions ?? []
    const sketchChoices = buildGraphSketchListChoices(sketchOptions)
    const backChoice = sketchChoices.find((choice) => choice.canonicalToken === 'BACK') ?? null
    if (backChoice !== null && matchesChoice(backChoice, normalizedToken)) {
      const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
      if (graphIndex === null || session.selections.graphDocumentId === null) {
        return createInvalidResult({ ...session, validChoices: sketchChoices }, submittedToken, sketchChoices)
      }
      return createAdvanceResult(
        createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
        submittedToken,
        backChoice,
      )
    }

    const sketchIndex = Number.parseInt(normalizedToken, 10)
    if (!Number.isInteger(sketchIndex) || `${sketchIndex}` !== normalizedToken) {
      return createInvalidResult(
        { ...session, validChoices: sketchChoices },
        submittedToken,
        sketchChoices,
      )
    }

    const sketchOption = sketchOptions[sketchIndex - 1] ?? null
    if (sketchOption === null) {
      return createInvalidResult(
        { ...session, validChoices: sketchChoices },
        submittedToken,
        sketchChoices,
      )
    }

    const matchedChoice = sketchChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
      canonicalToken: normalizedToken,
      aliases: [],
      label: `sketch_[${sketchIndex}]`,
      kind: 'scope' as const,
    }

    return createAdvanceResult(
      createGraphSketchSelectedSession([...session.breadcrumb, `sketch_[${sketchIndex}]`], {
        ...session.selections,
        sketchNodeId: sketchOption.nodeId,
      }),
      submittedToken,
      matchedChoice,
    )
  }

  const sketchSelectedChoices = buildGraphSketchSelectedChoices()
  const matchedChoice =
    sketchSelectedChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
  if (matchedChoice === null) {
    return createInvalidResult(
      { ...session, validChoices: sketchSelectedChoices },
      submittedToken,
      sketchSelectedChoices,
    )
  }

  if (matchedChoice.canonicalToken === 'BACK') {
    const selectedGraph = context.graphOptions.find(
      (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
    )
    const sketchOptions = selectedGraph?.sketchOptions ?? []
    return createAdvanceResult(
      createGraphSketchListSession(session.breadcrumb.slice(0, -1), {
        ...session.selections,
        sketchNodeId: null,
      }, sketchOptions),
      submittedToken,
      matchedChoice,
    )
  }

  return {
    kind: 'execute',
    session: {
      ...session,
      validChoices: sketchSelectedChoices,
    },
    submittedToken,
    matchedChoice,
    actionId:
      matchedChoice.canonicalToken === SKETCH_PLANE_CHOICE.canonicalToken
        ? 'sketch.plane'
        : 'sketch.draw',
    breadcrumb: [...session.breadcrumb, matchedChoice.label],
    selections: session.selections,
  }
}

export const cancelConsoleStagedNavigationSession = (): ConsoleStagedNavigationCancelledResult => ({
  kind: 'cancelled',
  session: null,
  breadcrumb: [],
  validChoices: buildRootChoices(),
})
