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
  sketchDraw: {
    hasSelection: boolean
    hasPrevious: boolean
    preferredTool: 'LINE' | 'PLINE' | 'RECTANGLE' | 'CIRCLE' | null
  }
}

export type ConsoleStagedNavigationChoiceKind = 'scope' | 'action'

export type ConsoleStagedNavigationChoice = {
  canonicalToken: string
  aliases: string[]
  label: string
  kind: ConsoleStagedNavigationChoiceKind
}

export type ConsoleStagedNavigationScopeId =
  | 'root'
  | 'cameraRoot'
  | 'cameraProjectionRoot'
  | 'zoomRoot'
  | 'sketchDrawRoot'
  | 'sketchDrawCameraRoot'
  | 'sketchDrawCameraProjectionRoot'
  | 'sketchDrawZoomRoot'
  | 'radioRoot'
  | 'graphRoot'
  | 'graphSelected'
  | 'graphZoomRoot'
  | 'graphZoomCanvas'
  | 'graphZoomModelViewport'
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
    | 'camera.pan'
    | 'camera.orbit'
    | 'camera.projection.orthographic'
    | 'camera.projection.perspective'
    | 'sketchdraw.tool.line'
    | 'sketchdraw.tool.pline'
    | 'sketchdraw.tool.rectangle'
    | 'sketchdraw.tool.circle'
    | 'sketchdraw.camera.projection.orthographic'
    | 'sketchdraw.camera.projection.perspective'
    | 'sketchdraw.previous'
    | 'sketchdraw.delete'
    | 'sketchdraw.back'
    | 'sketchdraw.exit'
    | 'zoom.model.all'
    | 'zoom.model.extents'
    | 'zoom.model.previous'
    | 'zoom.model.window'
    | 'zoom.model.object'
    | 'zoom.canvas.all'
    | 'zoom.canvas.extents'
    | 'zoom.canvas.previous'
    | 'zoom.canvas.window'
    | 'zoom.canvas.object'
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

const ROOT_CAMERA_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CAMERA',
  aliases: ['C'],
  label: 'Camera',
  kind: 'scope',
}

const ROOT_RADIO_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'RADIO',
  aliases: ['R'],
  label: 'Radio',
  kind: 'scope',
}

const ROOT_ZOOM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ZOOM',
  aliases: ['Z'],
  label: 'Zoom',
  kind: 'scope',
}

const ROOT_PAN_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'PAN',
  aliases: ['P'],
  label: 'Pan',
  kind: 'action',
}

const ROOT_ORBIT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ORBIT',
  aliases: ['O'],
  label: 'Orbit',
  kind: 'action',
}

const CAMERA_PROJECTION_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'PROJECTION',
  aliases: [],
  label: 'Projection',
  kind: 'scope',
}

const CAMERA_PROJECTION_ORTHOGRAPHIC_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ORTHOGRAPHIC',
  aliases: ['O'],
  label: 'Orthographic',
  kind: 'action',
}

const CAMERA_PROJECTION_PERSPECTIVE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'PERSPECTIVE',
  aliases: ['P'],
  label: 'Perspective',
  kind: 'action',
}

const SKETCH_DRAW_LINE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'LINE',
  aliases: ['L'],
  label: 'Line',
  kind: 'action',
}

const SKETCH_DRAW_PLINE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'PLINE',
  aliases: ['PL'],
  label: 'PLine',
  kind: 'action',
}

const SKETCH_DRAW_RECTANGLE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'RECTANGLE',
  aliases: ['REC'],
  label: 'Rectangle',
  kind: 'action',
}

const SKETCH_DRAW_CIRCLE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CIRCLE',
  aliases: ['CC'],
  label: 'Circle',
  kind: 'action',
}

const SKETCH_DRAW_CAMERA_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CAMERA',
  aliases: ['C'],
  label: 'Camera',
  kind: 'scope',
}

const SKETCH_DRAW_ZOOM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ZOOM',
  aliases: ['Z'],
  label: 'Zoom',
  kind: 'scope',
}

const SKETCH_DRAW_PREVIOUS_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'PREVIOUS',
  aliases: ['P'],
  label: 'Previous',
  kind: 'action',
}

const SKETCH_DRAW_DELETE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'DELETE',
  aliases: ['DEL'],
  label: 'Delete',
  kind: 'action',
}

const SKETCH_DRAW_EXIT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'X',
  aliases: [],
  label: 'X',
  kind: 'action',
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

const GRAPH_ZOOM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ZOOM',
  aliases: ['Z'],
  label: 'Zoom',
  kind: 'scope',
}

const ZOOM_CANVAS_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CANVAS',
  aliases: ['C'],
  label: 'Canvas',
  kind: 'scope',
}

const ZOOM_MODEL_VIEWPORT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'MODEL VIEWPORT',
  aliases: ['MODELVIEWPORT', 'MV', 'VIEWPORT', 'V'],
  label: 'Model Viewport',
  kind: 'scope',
}

const ZOOM_ALL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ALL',
  aliases: ['A'],
  label: 'All',
  kind: 'action',
}

const ZOOM_EXTENTS_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'EXTENTS',
  aliases: ['E'],
  label: 'Extents',
  kind: 'action',
}

const ZOOM_PREVIOUS_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'PREVIOUS',
  aliases: ['P'],
  label: 'Previous',
  kind: 'action',
}

const ZOOM_WINDOW_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'WINDOW',
  aliases: ['W'],
  label: 'Window',
  kind: 'action',
}

const ZOOM_OBJECT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OBJECT',
  aliases: ['O'],
  label: 'Object',
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

const buildRootChoices = (): ConsoleStagedNavigationChoice[] => [
  ROOT_GRAPH_CHOICE,
  ROOT_CAMERA_CHOICE,
  ROOT_RADIO_CHOICE,
  ROOT_ZOOM_CHOICE,
  ROOT_PAN_CHOICE,
  ROOT_ORBIT_CHOICE,
]

const buildCameraRootChoices = (): ConsoleStagedNavigationChoice[] => [
  CAMERA_PROJECTION_CHOICE,
  createBackChoice(),
]

const buildCameraProjectionChoices = (): ConsoleStagedNavigationChoice[] => [
  CAMERA_PROJECTION_ORTHOGRAPHIC_CHOICE,
  CAMERA_PROJECTION_PERSPECTIVE_CHOICE,
  createBackChoice(),
]

const buildSketchDrawRootChoices = (
  context: Pick<ConsoleStagedNavigationContext, 'sketchDraw'>,
): ConsoleStagedNavigationChoice[] => {
  const toolChoices = [
    SKETCH_DRAW_LINE_CHOICE,
    SKETCH_DRAW_PLINE_CHOICE,
    SKETCH_DRAW_RECTANGLE_CHOICE,
    SKETCH_DRAW_CIRCLE_CHOICE,
  ]
  const preferredTool = context.sketchDraw.preferredTool
  const orderedToolChoices =
    preferredTool === null
      ? toolChoices
      : [
          ...(toolChoices.find((choice) => choice.canonicalToken === preferredTool) !== undefined
            ? [toolChoices.find((choice) => choice.canonicalToken === preferredTool)!]
            : []),
          ...toolChoices.filter((choice) => choice.canonicalToken !== preferredTool),
        ]
  return [
  ...orderedToolChoices,
  SKETCH_DRAW_CAMERA_CHOICE,
  SKETCH_DRAW_ZOOM_CHOICE,
  ...(context.sketchDraw.hasSelection ? [SKETCH_DRAW_DELETE_CHOICE] : []),
  ...(context.sketchDraw.hasPrevious ? [SKETCH_DRAW_PREVIOUS_CHOICE] : []),
  createBackChoice(),
  SKETCH_DRAW_EXIT_CHOICE,
]
}

const buildSketchDrawCameraRootChoices = (): ConsoleStagedNavigationChoice[] => [
  CAMERA_PROJECTION_CHOICE,
  createBackChoice(),
]

const buildSketchDrawCameraProjectionChoices = (): ConsoleStagedNavigationChoice[] => [
  CAMERA_PROJECTION_ORTHOGRAPHIC_CHOICE,
  CAMERA_PROJECTION_PERSPECTIVE_CHOICE,
  createBackChoice(),
]

export const createConsoleRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'root',
  breadcrumb: ['Root'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildRootChoices(),
})

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
  GRAPH_ZOOM_CHOICE,
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

const buildZoomActionChoices = (): ConsoleStagedNavigationChoice[] => [
  ZOOM_ALL_CHOICE,
  ZOOM_EXTENTS_CHOICE,
  ZOOM_PREVIOUS_CHOICE,
  ZOOM_WINDOW_CHOICE,
  ZOOM_OBJECT_CHOICE,
  createBackChoice(),
]

const buildGraphZoomRootChoices = (): ConsoleStagedNavigationChoice[] => [
  ZOOM_CANVAS_CHOICE,
  ZOOM_MODEL_VIEWPORT_CHOICE,
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

const createCameraRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'cameraRoot',
  breadcrumb: ['Select', 'Camera'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildCameraRootChoices(),
})

const createCameraProjectionRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'cameraProjectionRoot',
  breadcrumb: ['Select', 'Camera', 'Projection'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildCameraProjectionChoices(),
})

const createZoomRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'zoomRoot',
  breadcrumb: ['Select', 'Zoom'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildZoomActionChoices(),
})

export const createSketchDrawZoomRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'sketchDrawZoomRoot',
  breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'Zoom'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildZoomActionChoices(),
})

export const createSketchDrawRootSession = (
  context: Pick<ConsoleStagedNavigationContext, 'sketchDraw'>,
): ConsoleStagedNavigationSession => ({
  scopeId: 'sketchDrawRoot',
  breadcrumb: ['Graph', 'Sketch', 'Sketch Draw'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildSketchDrawRootChoices(context),
})

const createSketchDrawCameraRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'sketchDrawCameraRoot',
  breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'Camera'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildSketchDrawCameraRootChoices(),
})

const createSketchDrawCameraProjectionRootSession = (): ConsoleStagedNavigationSession => ({
  scopeId: 'sketchDrawCameraProjectionRoot',
  breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'Camera', 'Projection'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
  },
  validChoices: buildSketchDrawCameraProjectionChoices(),
})

const createGraphZoomRootSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphZoomRoot',
  breadcrumb,
  selections,
  validChoices: buildGraphZoomRootChoices(),
})

const createGraphZoomCanvasSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphZoomCanvas',
  breadcrumb,
  selections,
  validChoices: buildZoomActionChoices(),
})

const createGraphZoomModelViewportSession = (
  breadcrumb: string[],
  selections: ConsoleStagedNavigationSelection,
): ConsoleStagedNavigationSession => ({
  scopeId: 'graphZoomModelViewport',
  breadcrumb,
  selections,
  validChoices: buildZoomActionChoices(),
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
  sketchDraw: ConsoleStagedNavigationContext['sketchDraw'] = {
    hasSelection: false,
    hasPrevious: false,
    preferredTool: 'LINE',
  },
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
  sketchDraw,
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
    if (matchedRootChoice.canonicalToken === ROOT_CAMERA_CHOICE.canonicalToken) {
      return createAdvanceResult(createCameraRootSession(), submittedToken, matchedRootChoice)
    }
    if (matchedRootChoice.canonicalToken === ROOT_RADIO_CHOICE.canonicalToken) {
      const radioRootSession = createRadioRootSession()
      return createAdvanceResult(radioRootSession, submittedToken, matchedRootChoice)
    }
    if (matchedRootChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(createZoomRootSession(), submittedToken, matchedRootChoice)
    }
    if (
      matchedRootChoice.canonicalToken === ROOT_PAN_CHOICE.canonicalToken ||
      matchedRootChoice.canonicalToken === ROOT_ORBIT_CHOICE.canonicalToken
    ) {
      return {
        kind: 'execute',
        session: createConsoleRootSession(),
        submittedToken,
        matchedChoice: matchedRootChoice,
        actionId:
          matchedRootChoice.canonicalToken === ROOT_PAN_CHOICE.canonicalToken
            ? 'camera.pan'
            : 'camera.orbit',
        breadcrumb: ['Select', matchedRootChoice.label],
        selections: createConsoleRootSession().selections,
      }
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

  if (session.scopeId === 'root') {
    const rootChoices = buildRootChoices()
    const matchedChoice =
      rootChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: rootChoices }, submittedToken, rootChoices)
    }
    if (matchedChoice.canonicalToken === ROOT_CAMERA_CHOICE.canonicalToken) {
      return createAdvanceResult(createCameraRootSession(), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === ROOT_RADIO_CHOICE.canonicalToken) {
      const radioRootSession = createRadioRootSession()
      return createAdvanceResult(radioRootSession, submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(createZoomRootSession(), submittedToken, matchedChoice)
    }
    if (
      matchedChoice.canonicalToken === ROOT_PAN_CHOICE.canonicalToken ||
      matchedChoice.canonicalToken === ROOT_ORBIT_CHOICE.canonicalToken
    ) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: rootChoices,
        },
        submittedToken,
        matchedChoice,
        actionId:
          matchedChoice.canonicalToken === ROOT_PAN_CHOICE.canonicalToken
            ? 'camera.pan'
            : 'camera.orbit',
        breadcrumb: ['Select', matchedChoice.label],
        selections: session.selections,
      }
    }
    const rootSession = createGraphRootSession(context)
    const graphAutoAdvance = resolveSingleGraphAutoAdvance(context)
    if (graphAutoAdvance !== null) {
      return createAdvanceResult(
        graphAutoAdvance.session,
        submittedToken,
        matchedChoice,
        graphAutoAdvance.autoSelections,
      )
    }
    return createAdvanceResult(rootSession, submittedToken, matchedChoice)
  }

  if (session.scopeId === 'cameraRoot') {
    const cameraRootChoices = buildCameraRootChoices()
    const matchedChoice =
      cameraRootChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: cameraRootChoices },
        submittedToken,
        cameraRootChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    return createAdvanceResult(createCameraProjectionRootSession(), submittedToken, matchedChoice)
  }

  if (session.scopeId === 'cameraProjectionRoot') {
    const projectionChoices = buildCameraProjectionChoices()
    const matchedChoice =
      projectionChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: projectionChoices },
        submittedToken,
        projectionChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createCameraRootSession(), submittedToken, matchedChoice)
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: projectionChoices,
      },
      submittedToken,
      matchedChoice,
      actionId:
        matchedChoice.canonicalToken === CAMERA_PROJECTION_ORTHOGRAPHIC_CHOICE.canonicalToken
          ? 'camera.projection.orthographic'
          : 'camera.projection.perspective',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (
    session.scopeId === 'sketchDrawRoot' ||
    session.scopeId === 'sketchDrawCameraRoot' ||
    session.scopeId === 'sketchDrawCameraProjectionRoot' ||
    session.scopeId === 'sketchDrawZoomRoot'
  ) {
    const radioRootChoice = buildRootChoices().find(
      (choice) => choice.canonicalToken === ROOT_RADIO_CHOICE.canonicalToken,
    )
    if (radioRootChoice !== undefined && matchesChoice(radioRootChoice, normalizedToken)) {
      return createAdvanceResult(createRadioRootSession(), submittedToken, radioRootChoice)
    }
  }

  if (session.scopeId === 'sketchDrawRoot') {
    const sketchDrawRootChoices = buildSketchDrawRootChoices(context)
    const matchedChoice =
      sketchDrawRootChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: sketchDrawRootChoices },
        submittedToken,
        sketchDrawRootChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'CAMERA') {
      return createAdvanceResult(createSketchDrawCameraRootSession(), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === 'ZOOM') {
      return createAdvanceResult(createSketchDrawZoomRootSession(), submittedToken, matchedChoice)
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: sketchDrawRootChoices,
      },
      submittedToken,
      matchedChoice,
      actionId:
        matchedChoice.canonicalToken === 'LINE'
          ? 'sketchdraw.tool.line'
          : matchedChoice.canonicalToken === 'PLINE'
            ? 'sketchdraw.tool.pline'
            : matchedChoice.canonicalToken === 'RECTANGLE'
              ? 'sketchdraw.tool.rectangle'
              : matchedChoice.canonicalToken === 'CIRCLE'
                ? 'sketchdraw.tool.circle'
                : matchedChoice.canonicalToken === 'PREVIOUS'
                  ? 'sketchdraw.previous'
                  : matchedChoice.canonicalToken === 'DELETE'
                    ? 'sketchdraw.delete'
                    : matchedChoice.canonicalToken === 'BACK'
                      ? 'sketchdraw.back'
                      : 'sketchdraw.exit',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'sketchDrawCameraRoot') {
    const sketchDrawCameraChoices = buildSketchDrawCameraRootChoices()
    const matchedChoice =
      sketchDrawCameraChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: sketchDrawCameraChoices },
        submittedToken,
        sketchDrawCameraChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createSketchDrawRootSession(context), submittedToken, matchedChoice)
    }
    return createAdvanceResult(createSketchDrawCameraProjectionRootSession(), submittedToken, matchedChoice)
  }

  if (session.scopeId === 'sketchDrawCameraProjectionRoot') {
    const sketchDrawProjectionChoices = buildSketchDrawCameraProjectionChoices()
    const matchedChoice =
      sketchDrawProjectionChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: sketchDrawProjectionChoices },
        submittedToken,
        sketchDrawProjectionChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createSketchDrawCameraRootSession(), submittedToken, matchedChoice)
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: sketchDrawProjectionChoices,
      },
      submittedToken,
      matchedChoice,
      actionId:
        matchedChoice.canonicalToken === CAMERA_PROJECTION_ORTHOGRAPHIC_CHOICE.canonicalToken
          ? 'sketchdraw.camera.projection.orthographic'
          : 'sketchdraw.camera.projection.perspective',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
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

  if (session.scopeId === 'zoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        | 'zoom.model.all'
        | 'zoom.model.extents'
        | 'zoom.model.previous'
        | 'zoom.model.window'
        | 'zoom.model.object'
      >
    > = {
      ALL: 'zoom.model.all',
      EXTENTS: 'zoom.model.extents',
      PREVIOUS: 'zoom.model.previous',
      WINDOW: 'zoom.model.window',
      OBJECT: 'zoom.model.object',
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: zoomChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'sketchDrawZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createSketchDrawRootSession(context), submittedToken, matchedChoice)
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        | 'zoom.model.all'
        | 'zoom.model.extents'
        | 'zoom.model.previous'
        | 'zoom.model.window'
        | 'zoom.model.object'
      >
    > = {
      ALL: 'zoom.model.all',
      EXTENTS: 'zoom.model.extents',
      PREVIOUS: 'zoom.model.previous',
      WINDOW: 'zoom.model.window',
      OBJECT: 'zoom.model.object',
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: zoomChoices,
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

    if (matchedChoice.canonicalToken === GRAPH_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createGraphZoomRootSession([...session.breadcrumb, matchedChoice.label], session.selections),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'graphZoomRoot') {
    const graphZoomRootChoices = buildGraphZoomRootChoices()
    const matchedChoice =
      graphZoomRootChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: graphZoomRootChoices },
        submittedToken,
        graphZoomRootChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const graphIndex = findGraphIndexByDocumentId(context, session.selections.graphDocumentId)
      if (graphIndex === null || session.selections.graphDocumentId === null) {
        return createInvalidResult(
          { ...session, validChoices: graphZoomRootChoices },
          submittedToken,
          graphZoomRootChoices,
        )
      }
      return createAdvanceResult(
        createGraphSelectedSession(graphIndex, session.selections.graphDocumentId),
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.canonicalToken === ZOOM_CANVAS_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createGraphZoomCanvasSession([...session.breadcrumb, matchedChoice.label], session.selections),
        submittedToken,
        matchedChoice,
      )
    }
    return createAdvanceResult(
      createGraphZoomModelViewportSession([...session.breadcrumb, matchedChoice.label], session.selections),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'graphZoomCanvas' || session.scopeId === 'graphZoomModelViewport') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createGraphZoomRootSession(
          session.breadcrumb.slice(0, -1),
          session.selections,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    const isCanvasScope = session.scopeId === 'graphZoomCanvas'
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        | 'zoom.model.all'
        | 'zoom.model.extents'
        | 'zoom.model.previous'
        | 'zoom.model.window'
        | 'zoom.model.object'
        | 'zoom.canvas.all'
        | 'zoom.canvas.extents'
        | 'zoom.canvas.previous'
        | 'zoom.canvas.window'
        | 'zoom.canvas.object'
      >
    > = isCanvasScope
      ? {
          ALL: 'zoom.canvas.all',
          EXTENTS: 'zoom.canvas.extents',
          PREVIOUS: 'zoom.canvas.previous',
          WINDOW: 'zoom.canvas.window',
          OBJECT: 'zoom.canvas.object',
        }
      : {
          ALL: 'zoom.model.all',
          EXTENTS: 'zoom.model.extents',
          PREVIOUS: 'zoom.model.previous',
          WINDOW: 'zoom.model.window',
          OBJECT: 'zoom.model.object',
        }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: zoomChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
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
