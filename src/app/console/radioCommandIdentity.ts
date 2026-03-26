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
    if (matchedCanonicalToken === 'CAMERA') {
      return buildIdentity('Console', 'Root', 'Camera')
    }
    if (matchedCanonicalToken === 'RADIO') {
      return buildIdentity('Console', 'Root', 'Radio')
    }
    if (matchedCanonicalToken === 'ZOOM') {
      return buildIdentity('Console', 'Root', 'Zoom')
    }
    if (matchedCanonicalToken === 'PAN') {
      return buildIdentity('Console', 'Root', 'Pan')
    }
    if (matchedCanonicalToken === 'ORBIT') {
      return buildIdentity('Console', 'Root', 'Orbit')
    }
    return null
  }

  switch (activeScopeId) {
    case 'cameraRoot':
      return matchedCanonicalToken === 'PROJECTION'
        ? buildIdentity('Console', 'Camera', 'Projection')
        : matchedCanonicalToken === 'BACK'
          ? buildIdentity('Console', 'Camera', 'Back')
          : null
    case 'cameraProjectionRoot':
      switch (matchedCanonicalToken) {
        case 'ORTHOGRAPHIC':
          return buildIdentity('Console', 'Camera', 'Projection', 'Orthographic')
        case 'PERSPECTIVE':
          return buildIdentity('Console', 'Camera', 'Projection', 'Perspective')
        case 'BACK':
          return buildIdentity('Console', 'Camera', 'Projection', 'Back')
        default:
          return null
      }
    case 'sketchDrawRoot':
      switch (matchedCanonicalToken) {
        case 'LINE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Line')
        case 'PLINE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'PLine')
        case 'RECTANGLE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Rectangle')
        case 'CIRCLE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Circle')
        case 'CAMERA':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera')
        case 'ZOOM':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Zoom')
        case 'PREVIOUS':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Previous')
        case 'DELETE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Delete')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Back')
        case 'X':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Exit')
        default:
          return null
      }
    case 'sketchDrawCameraRoot':
      return matchedCanonicalToken === 'PROJECTION'
        ? buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection')
        : matchedCanonicalToken === 'BACK'
          ? buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Back')
          : null
    case 'sketchDrawCameraProjectionRoot':
      switch (matchedCanonicalToken) {
        case 'ORTHOGRAPHIC':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Orthographic')
        case 'PERSPECTIVE':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Perspective')
        case 'BACK':
          return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Back')
        default:
          return null
      }
    case 'zoomRoot':
    case 'sketchDrawZoomRoot':
    case 'contentAssemblyZoomRoot':
    case 'contentObjectZoomRoot':
    case 'multiSelectZoomRoot':
    case 'referencesZoomRoot':
    case 'referenceCategoryZoomRoot':
    case 'referenceZoomRoot':
      switch (matchedCanonicalToken) {
        case 'ALL':
        case 'EXTENTS':
        case 'PREVIOUS':
        case 'WINDOW':
        case 'OBJECT':
          return activeScopeId === 'sketchDrawZoomRoot'
            ? buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Zoom', toIdentitySegment(matchedLabel))
            : activeScopeId === 'contentAssemblyZoomRoot'
              ? buildIdentity('Console', 'Assembly', 'Zoom', toIdentitySegment(matchedLabel))
            : activeScopeId === 'contentObjectZoomRoot'
              ? buildIdentity('Console', 'Object', 'Zoom', toIdentitySegment(matchedLabel))
            : activeScopeId === 'multiSelectZoomRoot'
                ? buildIdentity('Console', 'MultiSelect', 'Zoom', toIdentitySegment(matchedLabel))
              : activeScopeId === 'referencesZoomRoot'
                ? buildIdentity('Console', 'References', 'Zoom', toIdentitySegment(matchedLabel))
              : activeScopeId === 'referenceCategoryZoomRoot'
                ? buildIdentity('Console', 'References', 'Category', 'Zoom', toIdentitySegment(matchedLabel))
              : activeScopeId === 'referenceZoomRoot'
                ? buildIdentity('Console', 'Reference', 'Zoom', toIdentitySegment(matchedLabel))
              : buildIdentity('Console', 'Zoom', toIdentitySegment(matchedLabel))
        case 'BACK':
          return activeScopeId === 'sketchDrawZoomRoot'
            ? buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Zoom', 'Back')
            : activeScopeId === 'contentAssemblyZoomRoot'
              ? buildIdentity('Console', 'Assembly', 'Zoom', 'Back')
            : activeScopeId === 'contentObjectZoomRoot'
              ? buildIdentity('Console', 'Object', 'Zoom', 'Back')
              : activeScopeId === 'multiSelectZoomRoot'
                ? buildIdentity('Console', 'MultiSelect', 'Zoom', 'Back')
              : activeScopeId === 'referencesZoomRoot'
                ? buildIdentity('Console', 'References', 'Zoom', 'Back')
              : activeScopeId === 'referenceCategoryZoomRoot'
                ? buildIdentity('Console', 'References', 'Category', 'Zoom', 'Back')
              : activeScopeId === 'referenceZoomRoot'
                ? buildIdentity('Console', 'Reference', 'Zoom', 'Back')
              : buildIdentity('Console', 'Zoom', 'Back')
        default:
          return null
      }
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
        case 'ZOOM':
          return buildIdentity('Console', 'Graph', 'Zoom')
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
    case 'contentAssemblySelected':
      switch (matchedCanonicalToken) {
        case 'ZOOM':
          return buildIdentity('Console', 'Assembly', 'Zoom')
        case 'BACK':
          return buildIdentity('Console', 'Assembly', 'Back')
        default:
          return null
      }
    case 'contentObjectSelected':
      switch (matchedCanonicalToken) {
        case 'ZOOM':
          return buildIdentity('Console', 'Object', 'Zoom')
        case 'BACK':
          return buildIdentity('Console', 'Object', 'Back')
        default:
          return null
      }
    case 'multiSelectSelected':
      switch (matchedCanonicalToken) {
        case 'ZOOM':
          return buildIdentity('Console', 'MultiSelect', 'Zoom')
        case 'BACK':
          return buildIdentity('Console', 'MultiSelect', 'Back')
        default:
          return null
      }
    case 'referenceSelected':
      switch (matchedCanonicalToken) {
        case 'LOAD MODEL':
          return buildIdentity('Console', 'Reference', 'LoadModel')
        case 'MOVE':
          return buildIdentity('Console', 'Reference', 'Move')
        case 'ROTATE':
          return buildIdentity('Console', 'Reference', 'Rotate')
        case 'SCALE':
          return buildIdentity('Console', 'Reference', 'Scale')
        case 'ZOOM':
          return buildIdentity('Console', 'Reference', 'Zoom')
        case 'BACK':
          return buildIdentity('Console', 'Reference', 'Back')
        default:
          return null
      }
    case 'referencesSelected':
      switch (matchedCanonicalToken) {
        case 'LOAD ALL':
          return buildIdentity('Console', 'References', 'LoadAll')
        case 'ZOOM':
          return buildIdentity('Console', 'References', 'Zoom')
        case 'BACK':
          return buildIdentity('Console', 'References', 'Back')
        default:
          return matchedLabel.length > 0
            ? buildIdentity('Console', 'References', toIdentitySegment(matchedLabel))
            : null
      }
    case 'referenceCategorySelected':
      switch (matchedCanonicalToken) {
        case 'LOAD ALL':
          return buildIdentity('Console', 'References', 'Category', 'LoadAll')
        case 'ZOOM':
          return buildIdentity('Console', 'References', 'Category', 'Zoom')
        case 'BACK':
          return buildIdentity('Console', 'References', 'Category', 'Back')
        default:
          return matchedLabel.length > 0
            ? buildIdentity('Console', 'References', 'Category', toIdentitySegment(matchedLabel))
            : null
      }
    case 'graphZoomRoot':
    case 'graphZoomCanvas':
    case 'graphZoomModelViewport':
      return resolveSelectionIdentity(['Console', 'Graph', 'Zoom'], matchedLabel)
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
        case 'OPENTOOLBAR':
          return buildIdentity('Console', 'Radio', 'OpenToolbar')
        case 'CLOSETOOLBAR':
          return buildIdentity('Console', 'Radio', 'CloseToolbar')
        case 'BACK':
          return buildIdentity('Console', 'Radio', 'Back')
        default:
          return null
      }
    case 'graphRoot':
    case 'graphSelected':
    case 'sketchDrawRoot':
    case 'sketchDrawCameraRoot':
    case 'sketchDrawCameraProjectionRoot':
    case 'zoomRoot':
    case 'sketchDrawZoomRoot':
    case 'contentAssemblySelected':
    case 'contentAssemblyZoomRoot':
    case 'contentObjectSelected':
    case 'contentObjectZoomRoot':
    case 'multiSelectSelected':
    case 'multiSelectZoomRoot':
    case 'referencesSelected':
    case 'referencesZoomRoot':
    case 'referenceCategorySelected':
    case 'referenceCategoryZoomRoot':
    case 'referenceSelected':
    case 'referenceZoomRoot':
    case 'cameraRoot':
    case 'cameraProjectionRoot':
    case 'graphZoomRoot':
    case 'graphZoomCanvas':
    case 'graphZoomModelViewport':
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
    case 'radio.openToolbar':
      return buildIdentity('Console', 'Radio', 'OpenToolbar')
    case 'radio.closeToolbar':
      return buildIdentity('Console', 'Radio', 'CloseToolbar')
    case 'graph.list':
      return buildIdentity('Console', 'Graph', 'List')
    case 'camera.pan':
      return buildIdentity('Console', 'Camera', 'Pan')
    case 'camera.orbit':
      return buildIdentity('Console', 'Camera', 'Orbit')
    case 'camera.projection.orthographic':
      return buildIdentity('Console', 'Camera', 'Projection', 'Orthographic')
    case 'camera.projection.perspective':
      return buildIdentity('Console', 'Camera', 'Projection', 'Perspective')
    case 'sketchdraw.tool.line':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Line')
    case 'sketchdraw.tool.pline':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'PLine')
    case 'sketchdraw.tool.rectangle':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Rectangle')
    case 'sketchdraw.tool.circle':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Circle')
    case 'sketchdraw.camera.projection.orthographic':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Orthographic')
    case 'sketchdraw.camera.projection.perspective':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Perspective')
    case 'sketchdraw.previous':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Previous')
    case 'sketchdraw.delete':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Delete')
    case 'sketchdraw.done':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Done')
    case 'sketchdraw.back':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Back')
    case 'sketchdraw.exit':
      return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Exit')
    case 'zoom.model.all':
      return buildIdentity('Console', 'Zoom', 'ModelViewport', 'All')
    case 'zoom.model.extents':
      return buildIdentity('Console', 'Zoom', 'ModelViewport', 'Extents')
    case 'zoom.model.previous':
      return buildIdentity('Console', 'Zoom', 'ModelViewport', 'Previous')
    case 'zoom.model.window':
      return buildIdentity('Console', 'Zoom', 'ModelViewport', 'Window')
    case 'zoom.model.object':
      return buildIdentity('Console', 'Zoom', 'ModelViewport', 'Object')
    case 'zoom.canvas.all':
      return buildIdentity('Console', 'Zoom', 'Canvas', 'All')
    case 'zoom.canvas.extents':
      return buildIdentity('Console', 'Zoom', 'Canvas', 'Extents')
    case 'zoom.canvas.previous':
      return buildIdentity('Console', 'Zoom', 'Canvas', 'Previous')
    case 'zoom.canvas.window':
      return buildIdentity('Console', 'Zoom', 'Canvas', 'Window')
    case 'zoom.canvas.object':
      return buildIdentity('Console', 'Zoom', 'Canvas', 'Object')
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
    case 'reference.loadAll':
      return buildIdentity('Console', 'References', 'LoadAll')
    case 'reference.category.loadAll':
      return buildIdentity('Console', 'References', 'Category', 'LoadAll')
    case 'reference.loadModel':
      return buildIdentity('Console', 'References', 'Item', 'LoadModel')
    case 'reference.transform.move':
      return buildIdentity('Console', 'References', 'Transform', 'Move')
    case 'reference.transform.rotate':
      return buildIdentity('Console', 'References', 'Transform', 'Rotate')
    case 'reference.transform.scale':
      return buildIdentity('Console', 'References', 'Transform', 'Scale')
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
      case 'CAMERA':
      case 'C':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera')
      case 'ZOOM':
      case 'Z':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Zoom')
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

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Draw', 'Camera'])) {
    switch (normalizedToken) {
      case 'PROJECTION':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection')
      case 'BACK':
      case 'B':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Back')
      default:
        return null
    }
  }

  if (matchesBreadcrumb(breadcrumb, ['Graph', 'Sketch', 'Sketch Draw', 'Camera', 'Projection'])) {
    switch (normalizedToken) {
      case 'ORTHOGRAPHIC':
      case 'O':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Orthographic')
      case 'PERSPECTIVE':
      case 'P':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Perspective')
      case 'BACK':
      case 'B':
        return buildIdentity('Console', 'Graph', 'Sketch', 'Draw', 'Camera', 'Projection', 'Back')
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
