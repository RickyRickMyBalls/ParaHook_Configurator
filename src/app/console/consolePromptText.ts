import type { ConsolePromptSession } from './useConsoleStore'
import type {
  ConsoleStagedNavigationChoice,
  ConsoleStagedNavigationSession,
} from './stagedNavigation'

export const formatStagedBreadcrumb = (breadcrumb: string[]): string => breadcrumb.join(' > ')

export const formatStagedChoiceSummary = (choices: ConsoleStagedNavigationChoice[]): string =>
  choices.map((choice) => choice.label).join(', ')

export const getStagedScopeLabel = (session: ConsoleStagedNavigationSession | null): string | null => {
  if (session === null) {
    return null
  }
  switch (session.scopeId) {
    case 'root':
      return 'Root'
    case 'cameraRoot':
      return 'Camera'
    case 'cameraProjectionRoot':
      return 'Camera > Projection'
    case 'zoomRoot':
      return 'Zoom'
    case 'sketchDrawRoot':
      return 'Graph > Sketch > Sketch Draw'
    case 'sketchDrawCameraRoot':
      return 'Graph > Sketch > Sketch Draw > Camera'
    case 'sketchDrawCameraProjectionRoot':
      return 'Graph > Sketch > Sketch Draw > Camera > Projection'
    case 'sketchDrawZoomRoot':
      return 'Graph > Sketch > Sketch Draw > Zoom'
    case 'radioRoot':
      return 'Radio'
    case 'workspaceModesRoot':
    case 'workspaceModeViewportSelected':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'graphRoot':
    case 'graphSelected':
      return 'Graph'
    case 'graphZoomRoot':
      return 'Graph > Zoom'
    case 'graphZoomCanvas':
      return 'Graph > Zoom > Canvas'
    case 'graphZoomModelViewport':
      return 'Graph > Zoom > Model Viewport'
    case 'graphNodeList':
    case 'graphNodeSelected':
      return 'Focus Node'
    case 'graphSketchList':
    case 'graphSketchSelected':
      return 'Sketch'
    case 'graphExtrudeList':
    case 'graphExtrudeSelected':
      return 'Extrude'
    case 'graphOutputPreviewList':
    case 'graphOutputPreviewSelected':
      return 'Output Preview'
    case 'contentRoot':
      return 'Content'
    case 'contentAssemblySelected':
      return 'Content'
    case 'contentAssemblyZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'contentComponentSelected':
      return 'Content'
    case 'contentObjectSelected':
      return 'Content'
    case 'contentObjectTransformRoot':
    case 'contentObjectTransformSettingsRoot':
    case 'contentObjectTransformSpaceRoot':
    case 'contentObjectTransformSnapRoot':
    case 'contentObjectTransformMoveSnapRoot':
    case 'contentObjectTransformRotateSnapRoot':
    case 'contentObjectTransformScaleSnapRoot':
    case 'contentObjectTransformMoveSnapXRoot':
    case 'contentObjectTransformMoveSnapYRoot':
    case 'contentObjectTransformMoveSnapZRoot':
    case 'contentObjectTransformRotateSnapXRoot':
    case 'contentObjectTransformRotateSnapYRoot':
    case 'contentObjectTransformRotateSnapZRoot':
    case 'contentObjectTransformScaleSnapXRoot':
    case 'contentObjectTransformScaleSnapYRoot':
    case 'contentObjectTransformScaleSnapZRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'contentObjectZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'multiSelectSelected':
      return null
    case 'multiSelectZoomRoot':
      return 'Zoom'
    case 'referencesSelected':
      return 'References'
    case 'referencesZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'referenceCategorySelected':
      return 'References'
    case 'referenceCategoryZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'referenceSelected':
      return 'Reference'
    case 'referenceTransformRoot':
    case 'referenceTransformSettingsRoot':
    case 'referenceTransformSpaceRoot':
    case 'referenceTransformSnapRoot':
    case 'referenceTransformMoveSnapRoot':
    case 'referenceTransformRotateSnapRoot':
    case 'referenceTransformScaleSnapRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'referenceZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    default:
      return null
  }
}

export const buildStagedPromptText = (
  session: ConsoleStagedNavigationSession | null,
  choices: ConsoleStagedNavigationChoice[],
): string => {
  const scopeLabel = getStagedScopeLabel(session)
  if (
    session?.scopeId === 'referenceTransformMoveSnapRoot' ||
    session?.scopeId === 'referenceTransformRotateSnapRoot' ||
    session?.scopeId === 'referenceTransformScaleSnapRoot' ||
    session?.scopeId === 'contentObjectTransformMoveSnapRoot' ||
    session?.scopeId === 'contentObjectTransformRotateSnapRoot' ||
    session?.scopeId === 'contentObjectTransformScaleSnapRoot'
  ) {
    const choiceSummary = formatStagedChoiceSummary(choices)
    return `${scopeLabel} > Enter value [${choiceSummary}]`
  }
  const baseText =
    choices.length === 0
      ? 'No further choices in this staged scope yet'
      : `Choose next [${formatStagedChoiceSummary(choices)}]`
  return scopeLabel === null ? baseText : `${scopeLabel} > ${baseText}`
}

const buildReferenceTransformAxisPromptChoices = (
  promptSession: Extract<ConsolePromptSession, { kind: 'reference-transform.axis' }>,
): string[] => {
  const siblingAxes = (['X', 'Y', 'Z'] as const).filter(
    (axis) => axis !== promptSession.axis.toUpperCase(),
  )
  const modeChoices =
    promptSession.mode === 'translate'
      ? ['Scale', 'Rotate']
      : promptSession.mode === 'rotate'
        ? ['Move', 'Scale']
        : ['Move', 'Rotate']
  return ['Enter value', ...siblingAxes, ...modeChoices]
}

export const buildConsolePromptSessionText = (
  promptSession: ConsolePromptSession,
): string => {
  if (promptSession.kind === 'reference-transform.axis') {
    return `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Choose next [${buildReferenceTransformAxisPromptChoices(
      promptSession,
    ).join(', ')}]`
  }
  if (promptSession.kind === 'transform.delete-latest.confirm') {
    return `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Are you sure? [${promptSession.prefill}]`
  }
  return `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Enter value [${promptSession.prefill}]`
}

export const buildRootPromptText = (
  choices: string[] = [
    'Graph',
    'Content',
    'References',
    'Hide',
    'Unhide All',
    'Workspace Modes',
    'Camera',
    'Radio',
    'Zoom',
    'Pan',
    'Orbit',
  ],
): string =>
  `Root > Choose next [${choices.join(', ')}]`

export const ROOT_PROMPT_TEXT = buildRootPromptText()
