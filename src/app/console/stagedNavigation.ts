export type ConsoleStagedNodeOption = {
  nodeId: string
  label?: string
}

export type ConsoleStagedGraphOption = {
  graphDocumentId: string
  name: string
  allNodeOptions?: ConsoleStagedNodeOption[]
  sketchOptions?: ConsoleStagedNodeOption[]
  extrudeOptions?: ConsoleStagedNodeOption[]
  outputPreviewOptions?: ConsoleStagedNodeOption[]
}

export type ConsoleStagedNavigationContext = {
  graphOptions: Array<{
    graphDocumentId: string
    name: string
    allNodeOptions: ConsoleStagedNodeOption[]
    sketchOptions: ConsoleStagedNodeOption[]
    extrudeOptions: ConsoleStagedNodeOption[]
    outputPreviewOptions: ConsoleStagedNodeOption[]
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
  | 'radioRoot'
  | 'graphRoot'
  | 'graphSelected'
  | 'graphNodeList'
  | 'graphNodeSelected'
  | 'graphSketchList'
  | 'graphSketchSelected'
  | 'graphExtrudeList'
  | 'graphExtrudeSelected'
  | 'graphOutputPreviewList'
  | 'graphOutputPreviewSelected'

export type ConsoleStagedNavigationSelection = {
  graphDocumentId: string | null
  selectedNodeId: string | null
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
    | 'radio.on'
    | 'radio.off'
    | 'radio.url'
    | 'radio.sampleBurstTime'
    | 'radio.randomizeSampleTimes'
    | 'radio.openToolbar'
    | 'radio.closeToolbar'
    | 'graph.list'
    | 'graph.editor.collapsed'
    | 'graph.editor.essentials'
    | 'graph.editor.expanded'
    | 'graph.references'
    | 'graph.open'
    | 'graph.build'
    | 'sketch.plane'
    | 'sketch.draw'
    | 'node.delete'
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

const ROOT_RADIO_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'RADIO',
  aliases: ['R'],
  label: 'Radio',
  kind: 'scope',
}

const RADIO_ON_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ON',
  aliases: ['O'],
  label: 'On',
  kind: 'action',
}

const RADIO_OFF_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OFF',
  aliases: [],
  label: 'Off',
  kind: 'action',
}

const RADIO_URL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'URL',
  aliases: ['U'],
  label: 'Url',
  kind: 'action',
}

const RADIO_SAMPLE_BURST_TIME_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SAMPLEBURSTTIME',
  aliases: ['SB'],
  label: 'SampleBurstTime',
  kind: 'action',
}

const RADIO_RANDOMIZE_SAMPLE_TIMES_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'RANDOMIZESAMPLETIMES',
  aliases: ['RS'],
  label: 'RandomizeSampleTimes',
  kind: 'action',
}

const RADIO_OPEN_TOOLBAR_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OPENTOOLBAR',
  aliases: ['OT'],
  label: 'OpenToolbar',
  kind: 'action',
}

const RADIO_CLOSE_TOOLBAR_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CLOSETOOLBAR',
  aliases: ['CT'],
  label: 'CloseToolbar',
  kind: 'action',
}

const GRAPH_SKETCH_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SKETCH',
  aliases: ['S'],
  label: 'Sketch',
  kind: 'scope',
}

const GRAPH_EXTRUDE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'EXTRUDE',
  aliases: ['E'],
  label: 'Extrude',
  kind: 'scope',
}

const GRAPH_OUTPUT_PREVIEW_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OUTPUT PREVIEW',
  aliases: ['OUTPUTPREVIEW', 'OP'],
  label: 'Output Preview',
  kind: 'scope',
}

const GRAPH_FOCUS_NODE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'FOCUS NODE',
  aliases: ['FOCUSNODE', 'FN', 'FIND NODE', 'FINDNODE'],
  label: 'Focus Node',
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
  aliases: ['ES'],
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

const NODE_DELETE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'DELETE',
  aliases: ['D'],
  label: 'Delete',
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

const buildRootChoices = (): ConsoleStagedNavigationChoice[] => [ROOT_GRAPH_CHOICE, ROOT_RADIO_CHOICE]

const buildRadioRootChoices = (): ConsoleStagedNavigationChoice[] => [
  RADIO_ON_CHOICE,
  RADIO_OFF_CHOICE,
  RADIO_URL_CHOICE,
  RADIO_SAMPLE_BURST_TIME_CHOICE,
  RADIO_RANDOMIZE_SAMPLE_TIMES_CHOICE,
  RADIO_OPEN_TOOLBAR_CHOICE,
  RADIO_CLOSE_TOOLBAR_CHOICE,
]

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
  GRAPH_EXTRUDE_CHOICE,
  GRAPH_OUTPUT_PREVIEW_CHOICE,
  GRAPH_FOCUS_NODE_CHOICE,
  GRAPH_EDITOR_COLLAPSED_CHOICE,
  GRAPH_EDITOR_ESSENTIALS_CHOICE,
  GRAPH_EDITOR_EXPANDED_CHOICE,
  GRAPH_REFERENCES_CHOICE,
  GRAPH_OPEN_CHOICE,
  GRAPH_BUILD_CHOICE,
  createBackChoice(),
]

const buildGraphSketchListChoices = (
  sketchOptions: ConsoleStagedNodeOption[],
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

const buildGraphExtrudeListChoices = (
  extrudeOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationChoice[] =>
  [
    ...extrudeOptions.map((_, index) => ({
      canonicalToken: `${index + 1}`,
      aliases: [],
      label: `extrude_[${index + 1}]`,
      kind: 'scope' as const,
    })),
    createBackChoice(),
  ]

const buildGraphOutputPreviewListChoices = (
  outputPreviewOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationChoice[] =>
  [
    ...outputPreviewOptions.map((_, index) => ({
      canonicalToken: `${index + 1}`,
      aliases: [],
      label: `outputPreview_[${index + 1}]`,
      kind: 'scope' as const,
    })),
    createBackChoice(),
  ]

const buildGraphNodeListChoices = (
  allNodeOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationChoice[] =>
  [
    ...allNodeOptions.map((option, index) => ({
      canonicalToken: `${index + 1}`,
      aliases: [],
      label: option.label ?? `node_[${index + 1}]`,
      kind: 'scope' as const,
    })),
    createBackChoice(),
  ]

const buildGraphSketchSelectedChoices = (): ConsoleStagedNavigationChoice[] => [
  SKETCH_PLANE_CHOICE,
  SKETCH_DRAW_CHOICE,
  NODE_DELETE_CHOICE,
  createBackChoice(),
]

const buildGraphNodeSelectedChoices = (): ConsoleStagedNavigationChoice[] => [
  NODE_DELETE_CHOICE,
  createBackChoice(),
]

const createGraphRootSession = (
  context: ConsoleStagedNavigationContext,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphRoot',
  breadcrumb: ['Select', 'Graph'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildGraphRootChoices(context.graphOptions),
})

const createRadioRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'radioRoot',
  breadcrumb: ['Select', 'Radio'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildRadioRootChoices(),
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
    selectedNodeId: null,
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

export type ConsoleWorkspaceContextSyncResolution = {
  session: ConsoleStagedNavigationSession | null
  selectedLabel: string | null
}

export const resolveConsoleWorkspaceContextSync = (
  context: ConsoleStagedNavigationContext,
  target: {
    graphDocumentId: string | null
    nodeId: string | null
  },
): ConsoleWorkspaceContextSyncResolution => {
  const graphIndex = findGraphIndexByDocumentId(context, target.graphDocumentId)
  if (graphIndex === null || target.graphDocumentId === null) {
    return {
      session: null,
      selectedLabel: null,
    }
  }

  if (target.nodeId === null) {
    return {
      session: createGraphSelectedSession(graphIndex, target.graphDocumentId),
      selectedLabel: `graph_[${graphIndex}]`,
    }
  }

  const selectedGraph = context.graphOptions[graphIndex - 1] ?? null
  if (selectedGraph === null) {
    return {
      session: createGraphSelectedSession(graphIndex, target.graphDocumentId),
      selectedLabel: `graph_[${graphIndex}]`,
    }
  }

  const sketchIndex = selectedGraph.sketchOptions.findIndex((option) => option.nodeId === target.nodeId)
  if (sketchIndex !== -1) {
    const label = `sketch_[${sketchIndex + 1}]`
    return {
      session: createGraphSketchSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Sketch', label],
        {
          graphDocumentId: target.graphDocumentId,
          selectedNodeId: target.nodeId,
          sketchNodeId: target.nodeId,
        },
      ),
      selectedLabel: label,
    }
  }

  const extrudeIndex = selectedGraph.extrudeOptions.findIndex(
    (option) => option.nodeId === target.nodeId,
  )
  if (extrudeIndex !== -1) {
    const label = `extrude_[${extrudeIndex + 1}]`
    return {
      session: createGraphExtrudeSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Extrude', label],
        {
          graphDocumentId: target.graphDocumentId,
          selectedNodeId: target.nodeId,
          sketchNodeId: null,
        },
      ),
      selectedLabel: label,
    }
  }

  const outputPreviewIndex = selectedGraph.outputPreviewOptions.findIndex(
    (option) => option.nodeId === target.nodeId,
  )
  if (outputPreviewIndex !== -1) {
    const label = `outputPreview_[${outputPreviewIndex + 1}]`
    return {
      session: createGraphOutputPreviewSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Output Preview', label],
        {
          graphDocumentId: target.graphDocumentId,
          selectedNodeId: target.nodeId,
          sketchNodeId: null,
        },
      ),
      selectedLabel: label,
    }
  }

  const allNodeIndex = selectedGraph.allNodeOptions.findIndex((option) => option.nodeId === target.nodeId)
  if (allNodeIndex !== -1) {
    const label = selectedGraph.allNodeOptions[allNodeIndex]?.label ?? `node_[${allNodeIndex + 1}]`
    return {
      session: createGraphNodeSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Focus Node', label],
        {
          graphDocumentId: target.graphDocumentId,
          selectedNodeId: target.nodeId,
          sketchNodeId: null,
        },
      ),
      selectedLabel: label,
    }
  }

  return {
    session: createGraphSelectedSession(graphIndex, target.graphDocumentId),
    selectedLabel: `graph_[${graphIndex}]`,
  }
}

const createGraphSketchListSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
  sketchOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphSketchList',
  breadcrumb,
  selections,
  validChoices: buildGraphSketchListChoices(sketchOptions),
})

const createGraphNodeListSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
  allNodeOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphNodeList',
  breadcrumb,
  selections,
  validChoices: buildGraphNodeListChoices(allNodeOptions),
})

const createGraphNodeSelectedSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphNodeSelected',
  breadcrumb,
  selections,
  validChoices: buildGraphNodeSelectedChoices(),
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

const createGraphExtrudeListSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
  extrudeOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphExtrudeList',
  breadcrumb,
  selections,
  validChoices: buildGraphExtrudeListChoices(extrudeOptions),
})

const createGraphExtrudeSelectedSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphExtrudeSelected',
  breadcrumb,
  selections,
  validChoices: buildGraphNodeSelectedChoices(),
})

const createGraphOutputPreviewListSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
  outputPreviewOptions: ConsoleStagedNodeOption[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphOutputPreviewList',
  breadcrumb,
  selections,
  validChoices: buildGraphOutputPreviewListChoices(outputPreviewOptions),
})

const createGraphOutputPreviewSelectedSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphOutputPreviewSelected',
  breadcrumb,
  selections,
  validChoices: buildGraphNodeSelectedChoices(),
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
      selectedNodeId: sketchNodeId,
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
    allNodeOptions: (option.allNodeOptions ?? []).map((nodeOption) => ({
      nodeId: nodeOption.nodeId,
      label: nodeOption.label,
    })),
    sketchOptions: (option.sketchOptions ?? []).map((sketchOption) => ({
      nodeId: sketchOption.nodeId,
      label: sketchOption.label,
    })),
    extrudeOptions: (option.extrudeOptions ?? []).map((extrudeOption) => ({
      nodeId: extrudeOption.nodeId,
      label: extrudeOption.label,
    })),
    outputPreviewOptions: (option.outputPreviewOptions ?? []).map((outputPreviewOption) => ({
      nodeId: outputPreviewOption.nodeId,
      label: outputPreviewOption.label,
    })),
  })),
})

export const isConsoleStagedNavigationRootToken = (submittedToken: string): boolean => {
  const normalizedToken = normalizeToken(submittedToken)
  return buildRootChoices().some((choice) => matchesChoice(choice, normalizedToken))
}

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
    const matchedRootChoice = buildRootChoices().find((choice) =>
      matchesChoice(choice, normalizedToken),
    )
    if (matchedRootChoice === undefined) {
      return createInvalidResult(null, submittedToken, buildRootChoices())
    }
    if (matchedRootChoice.canonicalToken === ROOT_RADIO_CHOICE.canonicalToken) {
      const radioRootSession = createRadioRootSession()
      return createAdvanceResult(radioRootSession, submittedToken, matchedRootChoice)
    }
    const rootSession = createGraphRootSession(context)
    const graphAutoAdvance = resolveSingleGraphAutoAdvance(context)
    if (graphAutoAdvance !== null) {
      return createAdvanceResult(
        graphAutoAdvance.session,
        submittedToken,
        matchedRootChoice,
        graphAutoAdvance.autoSelections,
      )
    }
    return createAdvanceResult(rootSession, submittedToken, matchedRootChoice)
  }

  if (session.scopeId === 'radioRoot') {
    const radioChoices = buildRadioRootChoices()
    const matchedChoice =
      radioChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: radioChoices }, submittedToken, radioChoices)
    }

    const actionIdByToken: Record<string, Extract<
      ConsoleStagedNavigationExecuteResult['actionId'],
      | 'radio.on'
      | 'radio.off'
      | 'radio.url'
      | 'radio.sampleBurstTime'
      | 'radio.randomizeSampleTimes'
      | 'radio.openToolbar'
      | 'radio.closeToolbar'
    >> = {
      ON: 'radio.on',
      OFF: 'radio.off',
      URL: 'radio.url',
      SAMPLEBURSTTIME: 'radio.sampleBurstTime',
      RANDOMIZESAMPLETIMES: 'radio.randomizeSampleTimes',
      OPENTOOLBAR: 'radio.openToolbar',
      CLOSETOOLBAR: 'radio.closeToolbar',
    }

    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: radioChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
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
    if (matchedChoice.canonicalToken === GRAPH_SKETCH_CHOICE.canonicalToken) {
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

    if (matchedChoice.canonicalToken === GRAPH_EXTRUDE_CHOICE.canonicalToken) {
      const extrudeOptions = selectedGraph?.extrudeOptions ?? []
      const extrudeChoices = buildGraphExtrudeListChoices(extrudeOptions)
      const extrudeListSession = createGraphExtrudeListSession(
        [...session.breadcrumb, matchedChoice.label],
        session.selections,
        extrudeOptions,
      )
      if (extrudeOptions.length === 1) {
        return createAdvanceResult(
          createGraphExtrudeSelectedSession(
            [...extrudeListSession.breadcrumb, 'extrude_[1]'],
            {
              ...session.selections,
              selectedNodeId: extrudeOptions[0]?.nodeId ?? null,
              sketchNodeId: null,
            },
          ),
          submittedToken,
          matchedChoice,
          [extrudeChoices[0]!],
        )
      }
      return createAdvanceResult(extrudeListSession, submittedToken, matchedChoice)
    }

    if (matchedChoice.canonicalToken === GRAPH_FOCUS_NODE_CHOICE.canonicalToken) {
      const allNodeOptions = selectedGraph?.allNodeOptions ?? []
      const nodeChoices = buildGraphNodeListChoices(allNodeOptions)
      const nodeListSession = createGraphNodeListSession(
        [...session.breadcrumb, matchedChoice.label],
        session.selections,
        allNodeOptions,
      )
      if (allNodeOptions.length === 1) {
        return createAdvanceResult(
          createGraphNodeSelectedSession(
            [...nodeListSession.breadcrumb, allNodeOptions[0]?.label ?? 'node_[1]'],
            {
              ...session.selections,
              selectedNodeId: allNodeOptions[0]?.nodeId ?? null,
              sketchNodeId: null,
            },
          ),
          submittedToken,
          matchedChoice,
          [nodeChoices[0]!],
        )
      }
      return createAdvanceResult(nodeListSession, submittedToken, matchedChoice)
    }

    const outputPreviewOptions = selectedGraph?.outputPreviewOptions ?? []
    const outputPreviewChoices = buildGraphOutputPreviewListChoices(outputPreviewOptions)
    const outputPreviewListSession = createGraphOutputPreviewListSession(
      [...session.breadcrumb, matchedChoice.label],
      session.selections,
      outputPreviewOptions,
    )
    if (outputPreviewOptions.length === 1) {
      return createAdvanceResult(
        createGraphOutputPreviewSelectedSession(
          [...outputPreviewListSession.breadcrumb, 'outputPreview_[1]'],
          {
            ...session.selections,
            selectedNodeId: outputPreviewOptions[0]?.nodeId ?? null,
            sketchNodeId: null,
          },
        ),
        submittedToken,
        matchedChoice,
        [outputPreviewChoices[0]!],
      )
    }
    return createAdvanceResult(outputPreviewListSession, submittedToken, matchedChoice)
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
        selectedNodeId: sketchOption.nodeId,
        sketchNodeId: sketchOption.nodeId,
      }),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'graphNodeList') {
    const selectedGraph = context.graphOptions.find(
      (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
    )
    const allNodeOptions = selectedGraph?.allNodeOptions ?? []
    const nodeChoices = buildGraphNodeListChoices(allNodeOptions)
    const backChoice = nodeChoices.find((choice) => choice.canonicalToken === 'BACK') ?? null
    if (backChoice !== null && matchesChoice(backChoice, normalizedToken)) {
      const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
      if (graphIndex === null || session.selections.graphDocumentId === null) {
        return createInvalidResult({ ...session, validChoices: nodeChoices }, submittedToken, nodeChoices)
      }
      return createAdvanceResult(
        createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
        submittedToken,
        backChoice,
      )
    }

    const nodeIndex = Number.parseInt(normalizedToken, 10)
    if (!Number.isInteger(nodeIndex) || `${nodeIndex}` !== normalizedToken) {
      return createInvalidResult(
        { ...session, validChoices: nodeChoices },
        submittedToken,
        nodeChoices,
      )
    }

    const nodeOption = allNodeOptions[nodeIndex - 1] ?? null
    if (nodeOption === null) {
      return createInvalidResult(
        { ...session, validChoices: nodeChoices },
        submittedToken,
        nodeChoices,
      )
    }

    const sketchIndex = selectedGraph?.sketchOptions.findIndex((option) => option.nodeId === nodeOption.nodeId) ?? -1
    if (sketchIndex !== -1) {
      return createAdvanceResult(
        createGraphSketchSelectedSession(
          [...session.breadcrumb, selectedGraph?.sketchOptions[sketchIndex]?.label ?? `sketch_[${sketchIndex + 1}]`],
          {
            ...session.selections,
            selectedNodeId: nodeOption.nodeId,
            sketchNodeId: nodeOption.nodeId,
          },
        ),
        submittedToken,
        nodeChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
          canonicalToken: normalizedToken,
          aliases: [],
          label: nodeOption.label ?? `node_[${nodeIndex}]`,
          kind: 'scope' as const,
        },
      )
    }

    const extrudeIndex =
      selectedGraph?.extrudeOptions.findIndex((option) => option.nodeId === nodeOption.nodeId) ?? -1
    if (extrudeIndex !== -1) {
      return createAdvanceResult(
        createGraphExtrudeSelectedSession(
          [...session.breadcrumb, selectedGraph?.extrudeOptions[extrudeIndex]?.label ?? `extrude_[${extrudeIndex + 1}]`],
          {
            ...session.selections,
            selectedNodeId: nodeOption.nodeId,
            sketchNodeId: null,
          },
        ),
        submittedToken,
        nodeChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
          canonicalToken: normalizedToken,
          aliases: [],
          label: nodeOption.label ?? `node_[${nodeIndex}]`,
          kind: 'scope' as const,
        },
      )
    }

    const outputPreviewIndex =
      selectedGraph?.outputPreviewOptions.findIndex((option) => option.nodeId === nodeOption.nodeId) ?? -1
    if (outputPreviewIndex !== -1) {
      return createAdvanceResult(
        createGraphOutputPreviewSelectedSession(
          [
            ...session.breadcrumb,
            selectedGraph?.outputPreviewOptions[outputPreviewIndex]?.label ??
              `outputPreview_[${outputPreviewIndex + 1}]`,
          ],
          {
            ...session.selections,
            selectedNodeId: nodeOption.nodeId,
            sketchNodeId: null,
          },
        ),
        submittedToken,
        nodeChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
          canonicalToken: normalizedToken,
          aliases: [],
          label: nodeOption.label ?? `node_[${nodeIndex}]`,
          kind: 'scope' as const,
        },
      )
    }

    return createAdvanceResult(
      createGraphNodeSelectedSession([...session.breadcrumb, nodeOption.label ?? `node_[${nodeIndex}]`], {
        ...session.selections,
        selectedNodeId: nodeOption.nodeId,
        sketchNodeId: null,
      }),
      submittedToken,
      nodeChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
        canonicalToken: normalizedToken,
        aliases: [],
        label: nodeOption.label ?? `node_[${nodeIndex}]`,
        kind: 'scope' as const,
      },
    )
  }

  if (session.scopeId === 'graphExtrudeList') {
    const selectedGraph = context.graphOptions.find(
      (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
    )
    const extrudeOptions = selectedGraph?.extrudeOptions ?? []
    const extrudeChoices = buildGraphExtrudeListChoices(extrudeOptions)
    const backChoice = extrudeChoices.find((choice) => choice.canonicalToken === 'BACK') ?? null
    if (backChoice !== null && matchesChoice(backChoice, normalizedToken)) {
      const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
      if (graphIndex === null || session.selections.graphDocumentId === null) {
        return createInvalidResult({ ...session, validChoices: extrudeChoices }, submittedToken, extrudeChoices)
      }
      return createAdvanceResult(
        createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
        submittedToken,
        backChoice,
      )
    }

    const extrudeIndex = Number.parseInt(normalizedToken, 10)
    if (!Number.isInteger(extrudeIndex) || `${extrudeIndex}` !== normalizedToken) {
      return createInvalidResult(
        { ...session, validChoices: extrudeChoices },
        submittedToken,
        extrudeChoices,
      )
    }

    const extrudeOption = extrudeOptions[extrudeIndex - 1] ?? null
    if (extrudeOption === null) {
      return createInvalidResult(
        { ...session, validChoices: extrudeChoices },
        submittedToken,
        extrudeChoices,
      )
    }

    const matchedChoice = extrudeChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
      canonicalToken: normalizedToken,
      aliases: [],
      label: `extrude_[${extrudeIndex}]`,
      kind: 'scope' as const,
    }

    return createAdvanceResult(
      createGraphExtrudeSelectedSession([...session.breadcrumb, `extrude_[${extrudeIndex}]`], {
        ...session.selections,
        selectedNodeId: extrudeOption.nodeId,
        sketchNodeId: null,
      }),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'graphOutputPreviewList') {
    const selectedGraph = context.graphOptions.find(
      (graphOption) => graphOption.graphDocumentId === session.selections.graphDocumentId,
    )
    const outputPreviewOptions = selectedGraph?.outputPreviewOptions ?? []
    const outputPreviewChoices = buildGraphOutputPreviewListChoices(outputPreviewOptions)
    const backChoice =
      outputPreviewChoices.find((choice) => choice.canonicalToken === 'BACK') ?? null
    if (backChoice !== null && matchesChoice(backChoice, normalizedToken)) {
      const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
      if (graphIndex === null || session.selections.graphDocumentId === null) {
        return createInvalidResult(
          { ...session, validChoices: outputPreviewChoices },
          submittedToken,
          outputPreviewChoices,
        )
      }
      return createAdvanceResult(
        createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
        submittedToken,
        backChoice,
      )
    }

    const outputPreviewIndex = Number.parseInt(normalizedToken, 10)
    if (!Number.isInteger(outputPreviewIndex) || `${outputPreviewIndex}` !== normalizedToken) {
      return createInvalidResult(
        { ...session, validChoices: outputPreviewChoices },
        submittedToken,
        outputPreviewChoices,
      )
    }

    const outputPreviewOption = outputPreviewOptions[outputPreviewIndex - 1] ?? null
    if (outputPreviewOption === null) {
      return createInvalidResult(
        { ...session, validChoices: outputPreviewChoices },
        submittedToken,
        outputPreviewChoices,
      )
    }

    const matchedChoice =
      outputPreviewChoices.find((choice) => choice.canonicalToken === normalizedToken) ?? {
        canonicalToken: normalizedToken,
        aliases: [],
        label: `outputPreview_[${outputPreviewIndex}]`,
        kind: 'scope' as const,
      }

    return createAdvanceResult(
      createGraphOutputPreviewSelectedSession(
        [...session.breadcrumb, `outputPreview_[${outputPreviewIndex}]`],
        {
          ...session.selections,
          selectedNodeId: outputPreviewOption.nodeId,
          sketchNodeId: null,
        },
      ),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'graphSketchSelected') {
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
      const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
      if (graphIndex === null || session.selections.graphDocumentId === null) {
        return createInvalidResult(
          { ...session, validChoices: sketchSelectedChoices },
          submittedToken,
          sketchSelectedChoices,
        )
      }
      return createAdvanceResult(
        createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
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
          : matchedChoice.canonicalToken === SKETCH_DRAW_CHOICE.canonicalToken
            ? 'sketch.draw'
            : 'node.delete',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  const nodeSelectedChoices = buildGraphNodeSelectedChoices()
  const matchedChoice =
    nodeSelectedChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
  if (matchedChoice === null) {
    return createInvalidResult(
      { ...session, validChoices: nodeSelectedChoices },
      submittedToken,
      nodeSelectedChoices,
    )
  }

  if (session.scopeId === 'graphExtrudeSelected' || session.scopeId === 'graphNodeSelected') {
    if (matchedChoice.canonicalToken !== 'BACK') {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: nodeSelectedChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'node.delete',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
    if (graphIndex === null || session.selections.graphDocumentId === null) {
      return createInvalidResult(
        { ...session, validChoices: nodeSelectedChoices },
        submittedToken,
        nodeSelectedChoices,
      )
    }
    return createAdvanceResult(
      createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
      submittedToken,
      matchedChoice,
    )
  }

  if (matchedChoice.canonicalToken !== 'BACK') {
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: nodeSelectedChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: 'node.delete',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }
  const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
  if (graphIndex === null || session.selections.graphDocumentId === null) {
    return createInvalidResult(
      { ...session, validChoices: nodeSelectedChoices },
      submittedToken,
      nodeSelectedChoices,
    )
  }
  return createAdvanceResult(
    createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
    submittedToken,
    matchedChoice,
  )
}

export const cancelConsoleStagedNavigationSession = (): ConsoleStagedNavigationCancelledResult => ({
  kind: 'cancelled',
  session: null,
  breadcrumb: [],
  validChoices: buildRootChoices(),
})
