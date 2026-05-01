import type {
  ConsoleWorkspaceContextTarget,
  ReferenceTransformSnapAxis,
  ReferenceTransformSnapMode,
} from '../store/useAppStore'
import { REFERENCE_ROOT_ROW_ID, buildReferenceCategoryRowId } from '../store/useAppStore'
import type { WorkspaceSurfaceHostMode, WorkspaceSurfaceKind } from '../workspace/workspaceShellTypes'
import {
  getWorkspaceSurfaceCatalogEntries,
  getWorkspaceSurfaceDefaultLabel,
} from '../workspace/workspaceSurfaceCatalog'
import { getWorkspaceSurfaceActionEligibility } from '../workspace/workspaceSurfaceActionEligibility'

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
  workspaceViewportOptions: Array<{
    viewportId: string
    surfaceInstanceId?: string
    hostMode?: WorkspaceSurfaceHostMode
    slotId?: string
    isPrimary?: boolean
    label: string
    surfaceKind?: WorkspaceSurfaceKind
  }>
  contentAssemblies: Array<{
    assemblyId: string
    label: string
    canDelete: boolean
  }>
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
  referenceCategories: Array<{
    categoryId: string
    label: string
    canLoadAll: boolean
    items: Array<{
      referenceId: string
      label: string
      canLoadModel: boolean
      canDelete?: boolean
      canHide?: boolean
      canExplode?: boolean
    }>
  }>
  referenceTransformShellByReferenceId: Record<
    string,
    {
      activeSessionId: string | null
      activeSessionCommittedEntryCount: number
      totalCommittedEntryCount: number
    }
  >
  referenceTransformSnapLockByReferenceId: Record<
    string,
    Partial<Record<ReferenceTransformSnapMode, boolean>>
  >
  referenceTransformSnapEnabledByReferenceId: Record<
    string,
    Partial<Record<ReferenceTransformSnapMode, boolean>>
  >
  contentObjectTransformSnapLockByObjectId: Record<
    string,
    Partial<Record<ReferenceTransformSnapMode, boolean>>
  >
  contentObjectTransformSnapEnabledByObjectId: Record<
    string,
    Partial<Record<ReferenceTransformSnapMode, boolean>>
  >
  contentObjectTransformShellByObjectId: Record<
    string,
    {
      activeSessionId: string | null
      activeSessionCommittedEntryCount: number
      totalCommittedEntryCount: number
    }
  >
  environmentLightTransformShellByLightId: Record<
    string,
    {
      activeSessionId: string | null
      activeSessionCommittedEntryCount: number
      totalCommittedEntryCount: number
    }
  >
}

export type ConsoleStagedNavigationChoiceKind = 'scope' | 'action'

export type ConsoleStagedNavigationChoice = {
  canonicalToken: string
  aliases: string[]
  label: string
  kind: ConsoleStagedNavigationChoiceKind
  workspaceViewportId?: string
  workspaceSurfaceKind?: WorkspaceSurfaceKind
  contentAssemblyId?: string
  referenceCategoryId?: string
  referenceId?: string
}

export type ConsoleStagedNavigationScopeId =
  | 'root'
  | 'workspaceModesRoot'
  | 'workspaceModeViewportSelected'
  | 'workspaceModeViewportSplitSelected'
  | 'workspaceModeViewportTypeSelected'
  | 'workspaceModeViewportCloseConfirmSelected'
  | 'contentRoot'
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
  | 'contentAssemblySelected'
  | 'contentAssemblyZoomRoot'
  | 'contentComponentSelected'
  | 'contentObjectSelected'
  | 'contentObjectTransformRoot'
  | 'contentObjectTransformSettingsRoot'
  | 'contentObjectTransformSpaceRoot'
  | 'contentObjectTransformSnapRoot'
  | 'contentObjectTransformMoveSnapRoot'
  | 'contentObjectTransformRotateSnapRoot'
  | 'contentObjectTransformScaleSnapRoot'
  | 'contentObjectTransformMoveSnapXRoot'
  | 'contentObjectTransformMoveSnapYRoot'
  | 'contentObjectTransformMoveSnapZRoot'
  | 'contentObjectTransformRotateSnapXRoot'
  | 'contentObjectTransformRotateSnapYRoot'
  | 'contentObjectTransformRotateSnapZRoot'
  | 'contentObjectTransformScaleSnapXRoot'
  | 'contentObjectTransformScaleSnapYRoot'
  | 'contentObjectTransformScaleSnapZRoot'
  | 'contentObjectZoomRoot'
  | 'multiSelectSelected'
  | 'multiSelectZoomRoot'
  | 'referenceHideRoot'
  | 'referencesSelected'
  | 'referencesZoomRoot'
  | 'referenceCategorySelected'
  | 'referenceCategoryZoomRoot'
  | 'referenceSelected'
  | 'referenceTransformRoot'
  | 'referenceTransformSettingsRoot'
  | 'referenceTransformSpaceRoot'
  | 'referenceTransformSnapRoot'
  | 'referenceTransformMoveSnapRoot'
  | 'referenceTransformRotateSnapRoot'
  | 'referenceTransformScaleSnapRoot'
  | 'referenceTransformMoveSnapXRoot'
  | 'referenceTransformMoveSnapYRoot'
  | 'referenceTransformMoveSnapZRoot'
  | 'referenceTransformRotateSnapXRoot'
  | 'referenceTransformRotateSnapYRoot'
  | 'referenceTransformRotateSnapZRoot'
  | 'referenceTransformScaleSnapXRoot'
  | 'referenceTransformScaleSnapYRoot'
  | 'referenceTransformScaleSnapZRoot'
  | 'referenceZoomRoot'

export type ConsoleStagedNavigationSelection = {
  graphDocumentId: string | null
  selectedNodeId: string | null
  sketchNodeId: string | null
  workspaceViewportId?: string | null
  contentAssemblyId?: string | null
  contentComponentId?: string | null
  contentVisibilityPartKeys?: string[]
  contentCanHide?: boolean
  contentCanShow?: boolean
  contentObjectId?: string | null
  environmentLightId?: string | null
  referenceId?: string | null
  referenceCategoryId?: string | null
  referenceCanLoadModel?: boolean
  referenceCanDelete?: boolean
  referenceCanHide?: boolean
  referenceCanExplode?: boolean
  referenceZoomIds?: string[]
  multiSelectLabels?: string[]
  multiSelectCanDelete?: boolean
  multiSelectReferenceDeleteIds?: string[]
  multiSelectCanHide?: boolean
  multiSelectReferenceHideIds?: string[]
  multiSelectCanUnhide?: boolean
  multiSelectReferenceUnhideIds?: string[]
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
      | 'workspace.viewport.split.top'
      | 'workspace.viewport.split.right'
      | 'workspace.viewport.split.bottom'
      | 'workspace.viewport.split.left'
      | 'workspace.viewport.float'
      | 'workspace.viewport.close'
      | 'workspace.viewport.openInNewBrowser'
      | `workspace.viewport.type.${WorkspaceSurfaceKind}`
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
    | 'sketchdraw.done'
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
    | 'content.newAssembly'
    | 'content.newComponent'
    | 'content.rename'
    | 'content.delete'
    | 'content.visibility.hide'
    | 'content.visibility.show'
    | 'sketch.plane'
    | 'sketch.draw'
    | 'node.delete'
    | 'reference.loadAll'
    | 'reference.category.loadAll'
    | 'reference.loadModel'
    | 'reference.explode'
    | 'reference.delete'
    | 'reference.hide'
    | 'reference.unhideAll'
    | 'reference.multiDelete'
    | 'reference.multiHide'
    | 'reference.multiUnhide'
  | 'reference.transform.commitShell'
  | 'reference.transform.deleteLatest'
  | 'reference.transform.move'
  | 'reference.transform.rotate'
  | 'reference.transform.scale'
  | 'reference.transform.space.local'
  | 'reference.transform.space.world'
  | 'reference.transform.snap.translate.on'
  | 'reference.transform.snap.translate.off'
  | 'reference.transform.snap.translate.lock'
  | 'reference.transform.snap.translate.unlock'
  | 'reference.transform.snap.translate.value'
  | 'reference.transform.snap.translate.x.value'
  | 'reference.transform.snap.translate.y.value'
  | 'reference.transform.snap.translate.z.value'
  | 'reference.transform.snap.rotate.on'
  | 'reference.transform.snap.rotate.off'
  | 'reference.transform.snap.rotate.lock'
  | 'reference.transform.snap.rotate.unlock'
  | 'reference.transform.snap.rotate.value'
  | 'reference.transform.snap.rotate.x.value'
  | 'reference.transform.snap.rotate.y.value'
  | 'reference.transform.snap.rotate.z.value'
  | 'reference.transform.snap.scale.on'
  | 'reference.transform.snap.scale.off'
  | 'reference.transform.snap.scale.lock'
  | 'reference.transform.snap.scale.unlock'
    | 'reference.transform.snap.scale.value'
    | 'reference.transform.snap.scale.x.value'
    | 'reference.transform.snap.scale.y.value'
    | 'reference.transform.snap.scale.z.value'
    | 'content.selectAll'
    | 'content.transform.move'
    | 'content.transform.rotate'
    | 'content.transform.scale'
    | 'content.transform.deleteLatest'
    | 'content.transform.space.local'
    | 'content.transform.space.world'
    | 'content.transform.snap.translate.on'
    | 'content.transform.snap.translate.off'
    | 'content.transform.snap.translate.lock'
    | 'content.transform.snap.translate.unlock'
    | 'content.transform.snap.translate.value'
    | 'content.transform.snap.translate.x.value'
    | 'content.transform.snap.translate.y.value'
    | 'content.transform.snap.translate.z.value'
    | 'content.transform.snap.rotate.on'
    | 'content.transform.snap.rotate.off'
    | 'content.transform.snap.rotate.lock'
    | 'content.transform.snap.rotate.unlock'
    | 'content.transform.snap.rotate.value'
    | 'content.transform.snap.rotate.x.value'
    | 'content.transform.snap.rotate.y.value'
    | 'content.transform.snap.rotate.z.value'
    | 'content.transform.snap.scale.on'
    | 'content.transform.snap.scale.off'
    | 'content.transform.snap.scale.lock'
    | 'content.transform.snap.scale.unlock'
    | 'content.transform.snap.scale.value'
    | 'content.transform.snap.scale.x.value'
    | 'content.transform.snap.scale.y.value'
    | 'content.transform.snap.scale.z.value'
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

const VIEWER_TRANSFORM_LABEL = 'Viewer Transform'

const ROOT_GRAPH_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'GRAPH',
  aliases: ['G'],
  label: 'Graph',
  kind: 'scope',
}

const ROOT_CONTENT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CONTENT',
  aliases: ['CO'],
  label: 'Content',
  kind: 'scope',
}

const ROOT_REFERENCES_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'REFERENCES',
  aliases: ['REF', 'REFS', 'REFERENCE', 'REFRENCE'],
  label: 'References',
  kind: 'scope',
}

const ROOT_HIDE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'HIDE',
  aliases: ['H'],
  label: 'Hide',
  kind: 'scope',
}

const ROOT_UNHIDE_ALL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'UNHIDEALL',
  aliases: ['UH', 'UA'],
  label: 'Unhide All',
  kind: 'action',
}

const ROOT_WORKSPACE_MODES_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'WORKSPACEMODES',
  aliases: ['WM'],
  label: 'Workspace Modes',
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

const WORKSPACE_SPLIT_TOP_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SPLITTOP',
  aliases: ['TOP', 'ST'],
  label: 'Split Top',
  kind: 'action',
}

const WORKSPACE_SPLIT_RIGHT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SPLITRIGHT',
  aliases: ['RIGHT', 'SR'],
  label: 'Split Right',
  kind: 'action',
}

const WORKSPACE_SPLIT_BOTTOM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SPLITBOTTOM',
  aliases: ['BOTTOM', 'SB'],
  label: 'Split Bottom',
  kind: 'action',
}

const WORKSPACE_SPLIT_LEFT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SPLITLEFT',
  aliases: ['LEFT', 'SL'],
  label: 'Split Left',
  kind: 'action',
}

const WORKSPACE_SPLIT_MENU_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SPLITMENU',
  aliases: ['SM'],
  label: 'Split Menu',
  kind: 'scope',
}

const WORKSPACE_VIEWPORT_TYPE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'VIEWPORTTYPEMENU',
  aliases: ['VT', 'VTM'],
  label: 'Viewport Type Menu',
  kind: 'scope',
}

const WORKSPACE_OPEN_IN_NEW_BROWSER_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OPENINNEWBROWSER',
  aliases: ['OINB', 'ONB'],
  label: 'Open In New Browser',
  kind: 'action',
}

const WORKSPACE_FLOAT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'FLOAT',
  aliases: ['F'],
  label: 'Float',
  kind: 'action',
}

const WORKSPACE_CLOSE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CLOSE',
  aliases: ['CL'],
  label: 'Close',
  kind: 'scope',
}

const WORKSPACE_CONFIRM_CLOSE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'CONFIRMCLOSE',
  aliases: ['CC'],
  label: 'Confirm Close',
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

const SKETCH_DRAW_DONE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'DONE',
  aliases: ['D'],
  label: 'Done',
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

const ZOOM_OBJECT_DIRECT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ZOOMOBJECT',
  aliases: ['ZO'],
  label: 'ZoomObject',
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

const REFERENCE_LOAD_MODEL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'LOAD MODEL',
  aliases: ['LOADMODEL', 'LM'],
  label: 'Load Model',
  kind: 'action',
}

const REFERENCES_LOAD_ALL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'LOAD ALL',
  aliases: ['LOADALL', 'LA'],
  label: 'Load All',
  kind: 'action',
}

const getReferenceCategoryAliases = (categoryId: string): string[] => {
  switch (categoryId) {
    case 'footpads':
      return ['FP', 'FOODPADS']
    case 'shoes':
      return ['SH']
    case 'premade-foothooks':
      return ['PF', 'PFH', 'PREMADEFOOTHOOKS']
    default:
      return []
  }
}

const createReferenceCategoryChoice = (
  categoryId: string,
  label: string,
): ConsoleStagedNavigationChoice => ({
  canonicalToken: label.toUpperCase(),
  aliases: getReferenceCategoryAliases(categoryId),
  label,
  kind: 'scope',
  referenceCategoryId: categoryId,
})

const createReferenceItemChoice = (
  referenceId: string,
  label: string,
): ConsoleStagedNavigationChoice => ({
  canonicalToken: label.toUpperCase(),
  aliases: [],
  label,
  kind: 'scope',
  referenceId,
})

const createReferenceHideItemChoice = (
  referenceId: string,
  label: string,
  categoryId: string,
  categoryLabel: string,
  index: number,
): ConsoleStagedNavigationChoice => ({
  canonicalToken: `${categoryLabel} ${label}`.toUpperCase(),
  aliases: [`${index + 1}`, label.toUpperCase()],
  label: `${categoryLabel} / ${label}`,
  kind: 'action',
  referenceId,
  referenceCategoryId: categoryId,
})

const MOVE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'MOVE',
  aliases: ['M'],
  label: 'Move',
  kind: 'action',
}

const ROTATE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ROTATE',
  aliases: ['R'],
  label: 'Rotate',
  kind: 'action',
}

const SCALE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SCALE',
  aliases: ['S'],
  label: 'Scale',
  kind: 'action',
}

const SELECT_ALL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SELECTALL',
  aliases: ['SA'],
  label: 'SelectAll',
  kind: 'action',
}

const NEW_ASSEMBLY_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'NEWASSEMBLY',
  aliases: ['NEW', 'ASSEMBLY'],
  label: 'New Assembly',
  kind: 'action',
}

const NEW_COMPONENT_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'NEWCOMPONENT',
  aliases: ['NEW', 'COMPONENT'],
  label: 'New Component',
  kind: 'action',
}

const RENAME_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'RENAME',
  aliases: [],
  label: 'Rename',
  kind: 'action',
}

const DELETE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'DELETE',
  aliases: ['DEL'],
  label: 'Delete',
  kind: 'action',
}

const EXPLODE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'EXPLODE',
  aliases: ['EXP'],
  label: 'Explode',
  kind: 'action',
}

const HIDE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'HIDE',
  aliases: ['H'],
  label: 'Hide',
  kind: 'action',
}

const SHOW_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SHOW',
  aliases: ['SH'],
  label: 'Show',
  kind: 'action',
}

const UNHIDE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'UNHIDE',
  aliases: ['U'],
  label: 'Unhide',
  kind: 'action',
}

const TRANSFORM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'VIEWTRANSFORM',
  aliases: ['T', 'TRANSFORM'],
  label: 'ViewTransform',
  kind: 'scope',
}

const COMMIT_TRANSFORM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'COMMITTRANSFORM',
  aliases: ['COMMIT'],
  label: 'CommitTransform',
  kind: 'action',
}

const DELETE_LATEST_TRANSFORM_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'DELETELATEST',
  aliases: ['DELETE', 'DEL', 'D'],
  label: 'DeleteLatest',
  kind: 'action',
}

const SETTINGS_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SETTINGS',
  aliases: ['SE'],
  label: 'Settings',
  kind: 'scope',
}

const SPACE_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SPACE',
  aliases: ['SP'],
  label: 'Space',
  kind: 'scope',
}

const SNAP_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SNAP',
  aliases: ['SN'],
  label: 'Snap',
  kind: 'scope',
}

const LOCAL_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'LOCAL',
  aliases: ['L'],
  label: 'Local',
  kind: 'action',
}

const WORLD_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'WORLD',
  aliases: ['W'],
  label: 'World',
  kind: 'action',
}

const SNAP_ON_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'ON',
  aliases: ['O'],
  label: 'snap:On',
  kind: 'action',
}

const SNAP_OFF_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'OFF',
  aliases: [],
  label: 'snap:Off',
  kind: 'action',
}

const SNAP_XYZ_LOCK_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SNAPXYZ:LOCK',
  aliases: ['LOCK'],
  label: 'snapXYZ:Lock',
  kind: 'action',
}

const SNAP_XYZ_UNLOCK_CHOICE: ConsoleStagedNavigationChoice = {
  canonicalToken: 'SNAPXYZ:UNLOCK',
  aliases: ['UNLOCK'],
  label: 'snapXYZ:Unlock',
  kind: 'action',
}

const createBackChoice = (): ConsoleStagedNavigationChoice => ({
  canonicalToken: 'BACK',
  aliases: ['B'],
  label: 'Back',
  kind: 'scope',
})

const normalizeToken = (value: string): string => value.trim().toUpperCase()
const normalizeCompactChoiceToken = (value: string): string =>
  value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

const isWorkspaceModesScope = (
  scopeId: ConsoleStagedNavigationScopeId | null | undefined,
): boolean =>
  scopeId === 'workspaceModesRoot' ||
  scopeId === 'workspaceModeViewportSelected' ||
  scopeId === 'workspaceModeViewportSplitSelected' ||
  scopeId === 'workspaceModeViewportTypeSelected' ||
  scopeId === 'workspaceModeViewportCloseConfirmSelected'

const buildWorkspaceModesChoiceAliasCandidates = (
  choice: ConsoleStagedNavigationChoice,
): string[] => {
  if (choice.canonicalToken === 'BACK') {
    return ['B']
  }
  const compactLabel = normalizeCompactChoiceToken(choice.label)
  if (compactLabel.length === 0) {
    return []
  }
  const words = choice.label
    .split(/[^A-Za-z0-9]+/g)
    .map((segment) => segment.trim().toUpperCase())
    .filter((segment) => segment.length > 0)
  const anchorWord =
    words[0] === 'SPLIT' &&
    (words[1] === 'TOP' ||
      words[1] === 'RIGHT' ||
      words[1] === 'BOTTOM' ||
      words[1] === 'LEFT')
      ? words[1]!
      : (words[0] ?? compactLabel)
  const matchedTrailingDigits = compactLabel.match(/(\d+)$/)
  const trailingDigits = matchedTrailingDigits?.[1] ?? ''
  const candidates: string[] = []
  const pushCandidate = (value: string) => {
    const normalized = normalizeCompactChoiceToken(value)
    if (normalized.length === 0 || candidates.includes(normalized)) {
      return
    }
    candidates.push(normalized)
  }

  pushCandidate(anchorWord[0] ?? '')
  if (trailingDigits.length > 0) {
    pushCandidate(`${anchorWord[0] ?? ''}${trailingDigits}`)
  }
  for (let length = 2; length <= Math.min(anchorWord.length, 3); length += 1) {
    pushCandidate(anchorWord.slice(0, length))
  }
  for (let length = 4; length <= compactLabel.length; length += 1) {
    pushCandidate(anchorWord + compactLabel.slice(anchorWord.length, length))
    pushCandidate(compactLabel.slice(0, length))
  }

  return candidates
}

export const resolveWorkspaceModesChoiceAliases = (
  session: ConsoleStagedNavigationSession | null | undefined,
  choices: readonly ConsoleStagedNavigationChoice[],
): Map<string, string[]> => {
  const aliasMap = new Map<string, string[]>()
  const usedAliases = new Set<string>()
  const backChoice = choices.find((choice) => choice.canonicalToken === 'BACK') ?? null
  if (backChoice !== null) {
    const backAliases =
      session?.scopeId === 'workspaceModeViewportSplitSelected' ? ['BA'] : ['B']
    aliasMap.set(backChoice.canonicalToken, backAliases)
    for (const backAlias of backAliases) {
      usedAliases.add(backAlias)
    }
  }

  for (const choice of choices) {
    if (choice.canonicalToken === 'BACK') {
      continue
    }
    const candidates = buildWorkspaceModesChoiceAliasCandidates(choice)
    const selectedAlias = candidates.find((candidate) => !usedAliases.has(candidate)) ?? null
    const effectiveAliases = [
      ...(selectedAlias === null ? [] : [selectedAlias]),
      ...choice.aliases.filter((alias) => {
        const normalizedAlias = normalizeCompactChoiceToken(alias)
        return normalizedAlias.length > 0 && normalizedAlias !== selectedAlias
      }),
    ]
    if (selectedAlias !== null) {
      usedAliases.add(selectedAlias)
    }
    aliasMap.set(choice.canonicalToken, effectiveAliases)
  }

  return aliasMap
}

export const resolveEffectiveChoiceAliases = (
  session: ConsoleStagedNavigationSession | null | undefined,
  choices: readonly ConsoleStagedNavigationChoice[],
  choice: ConsoleStagedNavigationChoice,
): string[] => {
  if (!isWorkspaceModesScope(session?.scopeId)) {
    return choice.aliases
  }
  return resolveWorkspaceModesChoiceAliases(session, choices).get(choice.canonicalToken) ?? choice.aliases
}

const matchesChoice = (
  choice: ConsoleStagedNavigationChoice,
  normalizedToken: string,
  session?: ConsoleStagedNavigationSession | null,
  choices?: readonly ConsoleStagedNavigationChoice[],
): boolean => {
  const normalizedLabel = normalizeToken(choice.label)
  const compactLabel = normalizedLabel.replace(/\s+/gu, '')
  const effectiveAliases =
    session !== undefined && choices !== undefined
      ? resolveEffectiveChoiceAliases(session, choices, choice)
      : choice.aliases
  return (
    normalizedToken === choice.canonicalToken ||
    normalizedToken === normalizedLabel ||
    normalizedToken === compactLabel ||
    effectiveAliases.includes(normalizedToken)
  )
}

const buildRootChoices = (): ConsoleStagedNavigationChoice[] => [
  ROOT_GRAPH_CHOICE,
  ROOT_CONTENT_CHOICE,
  ROOT_REFERENCES_CHOICE,
  ROOT_HIDE_CHOICE,
  ROOT_UNHIDE_ALL_CHOICE,
  ROOT_WORKSPACE_MODES_CHOICE,
  ROOT_CAMERA_CHOICE,
  ROOT_RADIO_CHOICE,
  ROOT_ZOOM_CHOICE,
  ROOT_PAN_CHOICE,
  ROOT_ORBIT_CHOICE,
]

const createWorkspaceViewportChoice = (
  viewportId: string,
  label: string,
  index: number,
): ConsoleStagedNavigationChoice => ({
  canonicalToken: label.toUpperCase(),
  aliases: [`${index + 1}`],
  label,
  kind: 'scope',
  workspaceViewportId: viewportId,
})

const buildWorkspaceModesRootChoices = (
  context: Pick<ConsoleStagedNavigationContext, 'workspaceViewportOptions'>,
): ConsoleStagedNavigationChoice[] => [
  ...context.workspaceViewportOptions.map((viewportOption, index) =>
    createWorkspaceViewportChoice(viewportOption.viewportId, viewportOption.label, index),
  ),
  createBackChoice(),
]

const buildWorkspaceViewportActionChoices = (options?: {
  includeSplit?: boolean
  includeViewportType?: boolean
  includeFloat?: boolean
  includeClose?: boolean
  includeOpenInNewBrowser?: boolean
}): ConsoleStagedNavigationChoice[] => [
  ...(options?.includeSplit !== false ? [WORKSPACE_SPLIT_MENU_CHOICE] : []),
  ...(options?.includeViewportType !== false ? [WORKSPACE_VIEWPORT_TYPE_CHOICE] : []),
  ...(options?.includeFloat === true ? [WORKSPACE_FLOAT_CHOICE] : []),
  ...(options?.includeOpenInNewBrowser === true ? [WORKSPACE_OPEN_IN_NEW_BROWSER_CHOICE] : []),
  ...(options?.includeClose === true ? [WORKSPACE_CLOSE_CHOICE] : []),
  createBackChoice(),
]

const buildWorkspaceViewportSplitChoices = (): ConsoleStagedNavigationChoice[] => [
  WORKSPACE_SPLIT_TOP_CHOICE,
  WORKSPACE_SPLIT_RIGHT_CHOICE,
  WORKSPACE_SPLIT_BOTTOM_CHOICE,
  WORKSPACE_SPLIT_LEFT_CHOICE,
  createBackChoice(),
]

const workspaceViewportTypeAliasesByKind: Partial<Record<WorkspaceSurfaceKind, string[]>> = {
  modelViewer: ['MV'],
  browser: ['BRO'],
  console: ['C'],
  spaghettiEditor: ['SE', 'SP'],
  catalog: ['CAT'],
  dashboard: ['DASH'],
  notepad: ['NOTE'],
  homePage: ['HP', 'HOME'],
}

const getWorkspaceViewportTypeChoiceLabel = (surfaceKind: WorkspaceSurfaceKind): string => {
  const label = getWorkspaceSurfaceDefaultLabel(surfaceKind)
  return surfaceKind === 'modelViewer' ? label : label.replace(/ Viewport$/, '')
}

const createWorkspaceViewportTypeChoice = (
  surfaceKind: WorkspaceSurfaceKind,
): ConsoleStagedNavigationChoice => ({
  canonicalToken: normalizeCompactChoiceToken(getWorkspaceSurfaceDefaultLabel(surfaceKind)),
  aliases: workspaceViewportTypeAliasesByKind[surfaceKind] ?? [],
  label: getWorkspaceViewportTypeChoiceLabel(surfaceKind),
  kind: 'action',
  workspaceSurfaceKind: surfaceKind,
})

const buildWorkspaceViewportTypeChoices = (): ConsoleStagedNavigationChoice[] => [
  ...getWorkspaceSurfaceCatalogEntries()
    .filter((entry) => entry.supports.slotted)
    .map((entry) => createWorkspaceViewportTypeChoice(entry.kind)),
  createBackChoice(),
]

const buildWorkspaceViewportCloseConfirmChoices = (): ConsoleStagedNavigationChoice[] => [
  WORKSPACE_CONFIRM_CLOSE_CHOICE,
  createBackChoice(),
]

const createContentAssemblyChoice = (
  assemblyId: string,
  label: string,
): ConsoleStagedNavigationChoice => ({
  canonicalToken: label.toUpperCase(),
  aliases: [],
  label,
  kind: 'scope',
  contentAssemblyId: assemblyId,
})

const buildContentRootChoices = (
  contentAssemblies: ConsoleStagedNavigationContext['contentAssemblies'],
): ConsoleStagedNavigationChoice[] => [
  ...contentAssemblies.map((assembly) =>
    createContentAssemblyChoice(assembly.assemblyId, assembly.label),
  ),
  NEW_ASSEMBLY_CHOICE,
  createBackChoice(),
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
  SKETCH_DRAW_DONE_CHOICE,
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

const buildContentComponentSelectedChoices = (
  canRenameDelete: boolean,
  canHide: boolean,
  canShow: boolean,
): ConsoleStagedNavigationChoice[] => [
  ...(canShow ? [SHOW_CHOICE] : []),
  ...(canHide ? [HIDE_CHOICE] : []),
  ...(canRenameDelete ? [RENAME_CHOICE, DELETE_CHOICE] : []),
  SELECT_ALL_CHOICE,
  createBackChoice(),
]
const buildContentAssemblySelectedChoices = (
  canDelete: boolean,
  canHide: boolean,
  canShow: boolean,
): ConsoleStagedNavigationChoice[] => [
  NEW_COMPONENT_CHOICE,
  ...(canShow ? [SHOW_CHOICE] : []),
  ...(canHide ? [HIDE_CHOICE] : []),
  RENAME_CHOICE,
  ...(canDelete ? [DELETE_CHOICE] : []),
  SELECT_ALL_CHOICE,
  ROOT_ZOOM_CHOICE,
  createBackChoice(),
]
const buildContentObjectSelectedChoices = (): ConsoleStagedNavigationChoice[] => [
  TRANSFORM_CHOICE,
  MOVE_CHOICE,
  ROTATE_CHOICE,
  SCALE_CHOICE,
  ZOOM_OBJECT_DIRECT_CHOICE,
  ROOT_ZOOM_CHOICE,
  createBackChoice(),
]
const buildEnvironmentLightSelectedChoices = (options: {
  canDelete: boolean
  canHide: boolean
  canShow: boolean
}): ConsoleStagedNavigationChoice[] => [
  TRANSFORM_CHOICE,
  MOVE_CHOICE,
  ...(options.canShow ? [SHOW_CHOICE] : []),
  ...(options.canHide ? [HIDE_CHOICE] : []),
  ...(options.canDelete ? [DELETE_CHOICE] : []),
  ZOOM_OBJECT_DIRECT_CHOICE,
  ROOT_ZOOM_CHOICE,
  createBackChoice(),
]
const buildMultiSelectSelectedChoices = (
  canDelete: boolean,
  canHide: boolean,
  canUnhide: boolean,
): ConsoleStagedNavigationChoice[] => [
  ...(canUnhide ? [UNHIDE_CHOICE] : []),
  ...(canHide ? [HIDE_CHOICE] : []),
  ...(canDelete ? [DELETE_CHOICE] : []),
  ROOT_ZOOM_CHOICE,
  createBackChoice(),
]

const buildReferencesSelectedChoices = (
  categoryOptions: Array<{ categoryId: string; label: string; canLoadAll?: boolean }>,
  canLoadAll: boolean,
): ConsoleStagedNavigationChoice[] => [
  ...categoryOptions.map((category) =>
    createReferenceCategoryChoice(category.categoryId, category.label),
  ),
  ...(canLoadAll ? [REFERENCES_LOAD_ALL_CHOICE] : []),
  ROOT_ZOOM_CHOICE,
  createBackChoice(),
]

const buildReferenceCategorySelectedChoices = (
  itemOptions: Array<{ referenceId: string; label: string }>,
  canLoadAll: boolean,
): ConsoleStagedNavigationChoice[] => [
  ...itemOptions.map((item) => createReferenceItemChoice(item.referenceId, item.label)),
  ...(canLoadAll ? [REFERENCES_LOAD_ALL_CHOICE] : []),
  ROOT_ZOOM_CHOICE,
  createBackChoice(),
]

const buildReferenceHideRootChoices = (
  referenceCategories: ConsoleStagedNavigationContext['referenceCategories'],
): ConsoleStagedNavigationChoice[] => {
  let visibleItemIndex = 0
  const visibleChoices = referenceCategories.flatMap((category) =>
    category.items
      .filter((item) => item.canHide === true)
      .map((item) =>
        createReferenceHideItemChoice(
          item.referenceId,
          item.label,
          category.categoryId,
          category.label,
          visibleItemIndex++,
        ),
      ),
  )

  return [...visibleChoices, createBackChoice()]
}

const buildReferenceSelectedChoices = (
  canLoadModel: boolean,
  canDelete: boolean,
  canHide: boolean,
  canExplode: boolean,
): ConsoleStagedNavigationChoice[] => [
  ...(canLoadModel
    ? [
        REFERENCE_LOAD_MODEL_CHOICE,
        ...(canDelete ? [DELETE_CHOICE] : []),
        ROOT_ZOOM_CHOICE,
      ]
    : [
        TRANSFORM_CHOICE,
        MOVE_CHOICE,
        ROTATE_CHOICE,
        SCALE_CHOICE,
        ...(canExplode ? [EXPLODE_CHOICE] : []),
        ...(canHide ? [HIDE_CHOICE] : []),
        ...(canDelete ? [DELETE_CHOICE] : []),
        ROOT_ZOOM_CHOICE,
      ]),
  createBackChoice(),
]

export const buildContentTransformRootChoices = (
  hasCommittedEntriesInActiveShell = false,
): ConsoleStagedNavigationChoice[] =>
  hasCommittedEntriesInActiveShell
    ? [
        DELETE_LATEST_TRANSFORM_CHOICE,
        MOVE_CHOICE,
        ROTATE_CHOICE,
        SCALE_CHOICE,
        SNAP_CHOICE,
        SETTINGS_CHOICE,
      ]
    : [MOVE_CHOICE, ROTATE_CHOICE, SCALE_CHOICE, SNAP_CHOICE, SETTINGS_CHOICE, createBackChoice()]

const buildEnvironmentLightTransformRootChoices = (
  hasCommittedEntriesInActiveShell = false,
): ConsoleStagedNavigationChoice[] =>
  hasCommittedEntriesInActiveShell
    ? [DELETE_LATEST_TRANSFORM_CHOICE, MOVE_CHOICE]
    : [MOVE_CHOICE, createBackChoice()]

export const buildReferenceTransformRootChoices = (
  hasCommittedEntriesInActiveShell = false,
): ConsoleStagedNavigationChoice[] =>
  hasCommittedEntriesInActiveShell
    ? [
        COMMIT_TRANSFORM_CHOICE,
        DELETE_LATEST_TRANSFORM_CHOICE,
        MOVE_CHOICE,
        ROTATE_CHOICE,
        SCALE_CHOICE,
        SNAP_CHOICE,
        SETTINGS_CHOICE,
      ]
    : [MOVE_CHOICE, ROTATE_CHOICE, SCALE_CHOICE, SNAP_CHOICE, SETTINGS_CHOICE, createBackChoice()]

const buildReferenceTransformSettingsChoices = (): ConsoleStagedNavigationChoice[] => [
  SPACE_CHOICE,
  SNAP_CHOICE,
  createBackChoice(),
]

const buildReferenceTransformSpaceChoices = (): ConsoleStagedNavigationChoice[] => [
  LOCAL_CHOICE,
  WORLD_CHOICE,
  createBackChoice(),
]

const buildReferenceTransformSnapChoices = (): ConsoleStagedNavigationChoice[] => [
  MOVE_CHOICE,
  ROTATE_CHOICE,
  SCALE_CHOICE,
  createBackChoice(),
]

const createReferenceTransformSnapAxisChoice = (
  mode: ReferenceTransformSnapMode,
  axis: ReferenceTransformSnapAxis,
): ConsoleStagedNavigationChoice => {
  const modeLabel = mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'
  const axisLabel = axis.toUpperCase()
  const aliases =
    mode === 'translate'
      ? [axisLabel, `M${axisLabel}`]
      : mode === 'rotate'
        ? [axisLabel, `R${axisLabel}`]
        : [axisLabel, `S${axisLabel}`]
  return {
    canonicalToken: `${modeLabel.toUpperCase()} ${axisLabel}`,
    aliases,
    label: `${modeLabel} ${axisLabel}`,
    kind: 'scope',
  }
}

const buildReferenceTransformSnapModeChoices = (
  mode: ReferenceTransformSnapMode,
  xyzLocked: boolean,
  enabled: boolean,
): ConsoleStagedNavigationChoice[] => [
  ...(enabled ? [SNAP_OFF_CHOICE] : [SNAP_ON_CHOICE]),
  ...(xyzLocked ? [SNAP_XYZ_UNLOCK_CHOICE] : [SNAP_XYZ_LOCK_CHOICE]),
  createReferenceTransformSnapAxisChoice(mode, 'x'),
  createReferenceTransformSnapAxisChoice(mode, 'y'),
  createReferenceTransformSnapAxisChoice(mode, 'z'),
  createBackChoice(),
]

const hasAnyCommittedEntriesInReferenceTransformHistory = (
  context: ConsoleStagedNavigationContext,
  referenceId: string,
): boolean =>
  (context.referenceTransformShellByReferenceId[referenceId]?.totalCommittedEntryCount ?? 0) > 0

const hasAnyCommittedEntriesInContentObjectTransformHistory = (
  context: ConsoleStagedNavigationContext,
  objectId: string,
): boolean =>
  (context.contentObjectTransformShellByObjectId[objectId]?.totalCommittedEntryCount ?? 0) > 0

const hasAnyCommittedEntriesInEnvironmentLightTransformHistory = (
  context: ConsoleStagedNavigationContext,
  lightId: string,
): boolean =>
  (context.environmentLightTransformShellByLightId[lightId]?.totalCommittedEntryCount ?? 0) > 0

const isReferenceTransformSnapModeLocked = (
  context: ConsoleStagedNavigationContext,
  referenceId: string,
  mode: ReferenceTransformSnapMode,
): boolean => context.referenceTransformSnapLockByReferenceId[referenceId]?.[mode] ?? true

const isReferenceTransformSnapModeEnabled = (
  context: ConsoleStagedNavigationContext,
  referenceId: string,
  mode: ReferenceTransformSnapMode,
): boolean => context.referenceTransformSnapEnabledByReferenceId[referenceId]?.[mode] ?? false

const isContentObjectTransformSnapModeLocked = (
  context: ConsoleStagedNavigationContext,
  objectId: string,
  mode: ReferenceTransformSnapMode,
): boolean => context.contentObjectTransformSnapLockByObjectId[objectId]?.[mode] ?? true

const isContentObjectTransformSnapModeEnabled = (
  context: ConsoleStagedNavigationContext,
  objectId: string,
  mode: ReferenceTransformSnapMode,
): boolean => context.contentObjectTransformSnapEnabledByObjectId[objectId]?.[mode] ?? false

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

export const createWorkspaceModesRootSession = (
  context: Pick<ConsoleStagedNavigationContext, 'workspaceViewportOptions'>,
): ConsoleStagedNavigationSession => ({
  scopeId: 'workspaceModesRoot',
  breadcrumb: ['Root', 'Workspace Modes'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    workspaceViewportId: null,
  },
  validChoices: buildWorkspaceModesRootChoices(context),
})

const resolveWorkspaceViewportOption = (
  context: Pick<ConsoleStagedNavigationContext, 'workspaceViewportOptions'> | undefined,
  viewportId: string,
) => context?.workspaceViewportOptions.find((viewportOption) => viewportOption.viewportId === viewportId) ?? null

const resolveWorkspaceViewportActionChoiceOptions = (
  viewportOption: ConsoleStagedNavigationContext['workspaceViewportOptions'][number] | null,
): Parameters<typeof buildWorkspaceViewportActionChoices>[0] => {
  if (viewportOption?.surfaceKind === undefined) {
    return {
      includeSplit: true,
      includeViewportType: true,
      includeFloat: false,
      includeClose: false,
      includeOpenInNewBrowser: false,
    }
  }
  const eligibility = getWorkspaceSurfaceActionEligibility({
    surfaceKind: viewportOption.surfaceKind,
    hostMode: viewportOption.hostMode ?? 'slotted',
    isPrimary: viewportOption.isPrimary === true,
  })
  return {
    includeSplit: eligibility.split.visible,
    includeViewportType: eligibility.viewportType.visible,
    includeFloat: eligibility.float.visible,
    includeClose: eligibility.close.visible,
    includeOpenInNewBrowser: eligibility.popout.visible,
  }
}

export const createWorkspaceModeViewportSelectedSession = (
  viewportId: string,
  label: string,
  context?: Pick<ConsoleStagedNavigationContext, 'workspaceViewportOptions'>,
): ConsoleStagedNavigationSession => ({
  scopeId: 'workspaceModeViewportSelected',
  breadcrumb: ['Root', 'Workspace Modes', label],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    workspaceViewportId: viewportId,
  },
  validChoices: buildWorkspaceViewportActionChoices(
    resolveWorkspaceViewportActionChoiceOptions(resolveWorkspaceViewportOption(context, viewportId)),
  ),
})

const createWorkspaceModeViewportSplitSelectedSession = (
  viewportId: string,
  label: string,
): ConsoleStagedNavigationSession => ({
  scopeId: 'workspaceModeViewportSplitSelected',
  breadcrumb: ['Root', 'Workspace Modes', label, 'Split Menu'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    workspaceViewportId: viewportId,
  },
  validChoices: buildWorkspaceViewportSplitChoices(),
})

const createWorkspaceModeViewportTypeSelectedSession = (
  viewportId: string,
  label: string,
): ConsoleStagedNavigationSession => ({
  scopeId: 'workspaceModeViewportTypeSelected',
  breadcrumb: ['Root', 'Workspace Modes', label, 'Viewport Type Menu'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    workspaceViewportId: viewportId,
  },
  validChoices: buildWorkspaceViewportTypeChoices(),
})

const createWorkspaceModeViewportCloseConfirmSelectedSession = (
  viewportId: string,
  label: string,
): ConsoleStagedNavigationSession => ({
  scopeId: 'workspaceModeViewportCloseConfirmSelected',
  breadcrumb: ['Root', 'Workspace Modes', label, 'Close'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    workspaceViewportId: viewportId,
  },
  validChoices: buildWorkspaceViewportCloseConfirmChoices(),
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

const createContentRootSession = (
  context: Pick<ConsoleStagedNavigationContext, 'contentAssemblies'>,
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentRoot',
  breadcrumb: ['Select', 'Content'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    referenceId: null,
  },
  validChoices: buildContentRootChoices(context.contentAssemblies),
})

const buildContentBreadcrumb = (labels: string | string[]): string[] => [
  'Select',
  'Content',
  ...(Array.isArray(labels) ? labels : [labels]),
]

const extractContentBreadcrumbLabels = (
  breadcrumb: readonly string[],
  trailingCount = 0,
): string[] => {
  const endIndex =
    trailingCount === 0 ? breadcrumb.length : Math.max(2, breadcrumb.length - trailingCount)
  return breadcrumb.slice(2, endIndex)
}

const createContentAssemblySelectedSession = (
  labels: string | string[],
  assemblyId: string | null,
  canDelete: boolean,
  canHide = false,
  canShow = false,
  visibilityPartKeys: string[] = [],
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentAssemblySelected',
  breadcrumb: buildContentBreadcrumb(labels),
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: assemblyId,
    contentComponentId: null,
    contentVisibilityPartKeys: visibilityPartKeys,
    contentCanHide: canHide,
    contentCanShow: canShow,
    referenceId: null,
  },
  validChoices: buildContentAssemblySelectedChoices(canDelete, canHide, canShow),
})

const createContentAssemblyZoomRootSession = (
  labels: string | string[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentAssemblyZoomRoot',
  breadcrumb: [...buildContentBreadcrumb(labels), 'Zoom'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
  },
  validChoices: buildZoomActionChoices(),
})

const createContentComponentSelectedSession = (
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  componentId: string | null,
  canRenameDelete: boolean,
  canHide = false,
  canShow = false,
  visibilityPartKeys: string[] = [],
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentComponentSelected',
  breadcrumb: buildContentBreadcrumb(labels),
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: componentId,
    contentVisibilityPartKeys: visibilityPartKeys,
    contentCanHide: canHide,
    contentCanShow: canShow,
    referenceId: null,
  },
  validChoices: buildContentComponentSelectedChoices(canRenameDelete, canHide, canShow),
})

const createContentObjectSelectedSession = (
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null = null,
  environmentLightOptions: {
    environmentLightId: string | null
    canDelete: boolean
    canHide: boolean
    canShow: boolean
  } | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentObjectSelected',
  breadcrumb: buildContentBreadcrumb(labels),
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    environmentLightId: environmentLightOptions?.environmentLightId ?? null,
    referenceId: null,
  },
  validChoices:
    environmentLightOptions === null
      ? buildContentObjectSelectedChoices()
      : buildEnvironmentLightSelectedChoices(environmentLightOptions),
})

export const createContentObjectTransformRootSession = (
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null = null,
  hasCommittedEntriesInHistory = false,
  environmentLightId: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentObjectTransformRoot',
  breadcrumb: [...buildContentBreadcrumb(labels), VIEWER_TRANSFORM_LABEL],
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    environmentLightId,
    referenceId: null,
  },
  validChoices:
    environmentLightId === null
      ? buildContentTransformRootChoices(hasCommittedEntriesInHistory)
      : buildEnvironmentLightTransformRootChoices(hasCommittedEntriesInHistory),
})

const createContentObjectTransformSettingsRootSession = (
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentObjectTransformSettingsRoot',
  breadcrumb: [...buildContentBreadcrumb(labels), VIEWER_TRANSFORM_LABEL, 'Settings'],
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    referenceId: null,
  },
  validChoices: buildReferenceTransformSettingsChoices(),
})

const createContentObjectTransformSpaceRootSession = (
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentObjectTransformSpaceRoot',
  breadcrumb: [...buildContentBreadcrumb(labels), VIEWER_TRANSFORM_LABEL, 'Settings', 'Space'],
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    referenceId: null,
  },
  validChoices: buildReferenceTransformSpaceChoices(),
})

const createContentObjectTransformSnapRootSession = (
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'contentObjectTransformSnapRoot',
  breadcrumb: [...buildContentBreadcrumb(labels), VIEWER_TRANSFORM_LABEL, 'Settings', 'Snap'],
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    referenceId: null,
  },
  validChoices: buildReferenceTransformSnapChoices(),
})

const createContentObjectTransformModeSnapRootSession = (
  scopeId:
    | 'contentObjectTransformMoveSnapRoot'
    | 'contentObjectTransformRotateSnapRoot'
    | 'contentObjectTransformScaleSnapRoot',
  mode: ReferenceTransformSnapMode,
  modeLabel: 'Move' | 'Rotate' | 'Scale',
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null,
  xyzLocked: boolean,
  enabled: boolean,
): ConsoleStagedNavigationSession => ({
  scopeId,
  breadcrumb: [
    ...buildContentBreadcrumb(labels),
    VIEWER_TRANSFORM_LABEL,
    'Settings',
    'Snap',
    modeLabel,
  ],
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    referenceId: null,
  },
  validChoices: buildReferenceTransformSnapModeChoices(mode, xyzLocked, enabled),
})

const createContentObjectTransformAxisSnapRootSession = (
  scopeId:
    | 'contentObjectTransformMoveSnapXRoot'
    | 'contentObjectTransformMoveSnapYRoot'
    | 'contentObjectTransformMoveSnapZRoot'
    | 'contentObjectTransformRotateSnapXRoot'
    | 'contentObjectTransformRotateSnapYRoot'
    | 'contentObjectTransformRotateSnapZRoot'
    | 'contentObjectTransformScaleSnapXRoot'
    | 'contentObjectTransformScaleSnapYRoot'
    | 'contentObjectTransformScaleSnapZRoot',
  modeLabel: 'Move' | 'Rotate' | 'Scale',
  axisLabel: 'X' | 'Y' | 'Z',
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string | null,
): ConsoleStagedNavigationSession => ({
  scopeId,
  breadcrumb: [
    ...buildContentBreadcrumb(labels),
    VIEWER_TRANSFORM_LABEL,
    'Settings',
    'Snap',
    modeLabel,
    `${modeLabel} ${axisLabel}`,
  ],
  selections: {
    graphDocumentId: fallbackGraphDocumentId,
    selectedNodeId: null,
    sketchNodeId: null,
    contentAssemblyId: null,
    contentComponentId: null,
    contentObjectId: objectId,
    referenceId: null,
  },
  validChoices: [],
})

const formatMultiSelectLabels = (labels: readonly string[]): string => `[${labels.join(', ')}]`

const createMultiSelectSelectedSession = (
  labels: string[],
  canDelete = false,
  referenceDeleteIds: string[] = [],
  canHide = false,
  referenceHideIds: string[] = [],
  canUnhide = false,
  referenceUnhideIds: string[] = [],
): ConsoleStagedNavigationSession => ({
  scopeId: 'multiSelectSelected',
  breadcrumb: ['Multi-Select', formatMultiSelectLabels(labels)],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
    multiSelectLabels: labels,
    multiSelectCanDelete: canDelete,
    multiSelectReferenceDeleteIds: referenceDeleteIds,
    multiSelectCanHide: canHide,
    multiSelectReferenceHideIds: referenceHideIds,
    multiSelectCanUnhide: canUnhide,
    multiSelectReferenceUnhideIds: referenceUnhideIds,
  },
  validChoices: buildMultiSelectSelectedChoices(canDelete, canHide, canUnhide),
})

const createReferenceSelectedSession = (
  label: string,
  referenceId: string,
  canLoadModel: boolean,
  canDelete: boolean,
  canHide: boolean,
  canExplode: boolean,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceSelected',
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? ['Select', 'References', referenceCategoryLabel, label]
      : ['Select', 'Reference', label],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
    referenceCanLoadModel: canLoadModel,
    referenceCanDelete: canDelete,
    referenceCanHide: canHide,
    referenceCanExplode: canExplode,
  },
  validChoices: buildReferenceSelectedChoices(
    canLoadModel,
    canDelete,
    canHide,
    canExplode,
  ),
})

const createReferenceTransformRootSession = (
  context: ConsoleStagedNavigationContext,
  label: string,
  referenceId: string,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceTransformRoot',
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? ['Select', 'References', referenceCategoryLabel, label, VIEWER_TRANSFORM_LABEL]
      : ['Select', 'Reference', label, VIEWER_TRANSFORM_LABEL],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
  },
  validChoices: buildReferenceTransformRootChoices(
    hasAnyCommittedEntriesInReferenceTransformHistory(context, referenceId),
  ),
})

const createReferenceTransformSettingsRootSession = (
  label: string,
  referenceId: string,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceTransformSettingsRoot',
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? ['Select', 'References', referenceCategoryLabel, label, VIEWER_TRANSFORM_LABEL, 'Settings']
      : ['Select', 'Reference', label, VIEWER_TRANSFORM_LABEL, 'Settings'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
  },
  validChoices: buildReferenceTransformSettingsChoices(),
})

const createReferenceTransformSpaceRootSession = (
  label: string,
  referenceId: string,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceTransformSpaceRoot',
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? ['Select', 'References', referenceCategoryLabel, label, VIEWER_TRANSFORM_LABEL, 'Settings', 'Space']
      : ['Select', 'Reference', label, VIEWER_TRANSFORM_LABEL, 'Settings', 'Space'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
  },
  validChoices: buildReferenceTransformSpaceChoices(),
})

const createReferenceTransformSnapRootSession = (
  label: string,
  referenceId: string,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceTransformSnapRoot',
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? ['Select', 'References', referenceCategoryLabel, label, VIEWER_TRANSFORM_LABEL, 'Settings', 'Snap']
      : ['Select', 'Reference', label, VIEWER_TRANSFORM_LABEL, 'Settings', 'Snap'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
  },
  validChoices: buildReferenceTransformSnapChoices(),
})

const createReferenceTransformModeSnapRootSession = (
  scopeId:
    | 'referenceTransformMoveSnapRoot'
    | 'referenceTransformRotateSnapRoot'
    | 'referenceTransformScaleSnapRoot',
  mode: ReferenceTransformSnapMode,
  modeLabel: 'Move' | 'Rotate' | 'Scale',
  label: string,
  referenceId: string,
  xyzLocked: boolean,
  enabled: boolean,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId,
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? [
          'Select',
          'References',
          referenceCategoryLabel,
          label,
          VIEWER_TRANSFORM_LABEL,
          'Settings',
          'Snap',
          modeLabel,
        ]
      : ['Select', 'Reference', label, VIEWER_TRANSFORM_LABEL, 'Settings', 'Snap', modeLabel],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
  },
  validChoices: buildReferenceTransformSnapModeChoices(mode, xyzLocked, enabled),
})

const createReferenceTransformAxisSnapRootSession = (
  scopeId:
    | 'referenceTransformMoveSnapXRoot'
    | 'referenceTransformMoveSnapYRoot'
    | 'referenceTransformMoveSnapZRoot'
    | 'referenceTransformRotateSnapXRoot'
    | 'referenceTransformRotateSnapYRoot'
    | 'referenceTransformRotateSnapZRoot'
    | 'referenceTransformScaleSnapXRoot'
    | 'referenceTransformScaleSnapYRoot'
    | 'referenceTransformScaleSnapZRoot',
  modeLabel: 'Move' | 'Rotate' | 'Scale',
  axis: ReferenceTransformSnapAxis,
  label: string,
  referenceId: string,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession => ({
  scopeId,
  breadcrumb:
    referenceCategoryId !== null && referenceCategoryLabel !== null
      ? [
          'Select',
          'References',
          referenceCategoryLabel,
          label,
          VIEWER_TRANSFORM_LABEL,
          'Settings',
          'Snap',
          modeLabel,
          `${modeLabel} ${axis.toUpperCase()}`,
        ]
      : [
          'Select',
          'Reference',
          label,
          VIEWER_TRANSFORM_LABEL,
          'Settings',
          'Snap',
          modeLabel,
          `${modeLabel} ${axis.toUpperCase()}`,
        ],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId,
    referenceCategoryId,
  },
  validChoices: [createBackChoice()],
})

export const createReferenceTransformRootSessionForTarget = (
  context: ConsoleStagedNavigationContext,
  label: string,
  referenceId: string,
  referenceCategoryId: string | null = null,
  referenceCategoryLabel: string | null = null,
): ConsoleStagedNavigationSession =>
  createReferenceTransformRootSession(
    context,
    label,
    referenceId,
    referenceCategoryId,
    referenceCategoryLabel,
  )

const createReferenceTransformSnapModeSessionByToken = (
  context: ConsoleStagedNavigationContext,
  token: string,
  label: string,
  referenceId: string,
  referenceCategoryId: string | null,
  referenceCategoryLabel: string | null,
): ConsoleStagedNavigationSession => {
  switch (token) {
    case 'MOVE':
      return createReferenceTransformModeSnapRootSession(
        'referenceTransformMoveSnapRoot',
        'translate',
        'Move',
        label,
        referenceId,
        isReferenceTransformSnapModeLocked(context, referenceId, 'translate'),
        isReferenceTransformSnapModeEnabled(context, referenceId, 'translate'),
        referenceCategoryId,
        referenceCategoryLabel,
      )
    case 'ROTATE':
      return createReferenceTransformModeSnapRootSession(
        'referenceTransformRotateSnapRoot',
        'rotate',
        'Rotate',
        label,
        referenceId,
        isReferenceTransformSnapModeLocked(context, referenceId, 'rotate'),
        isReferenceTransformSnapModeEnabled(context, referenceId, 'rotate'),
        referenceCategoryId,
        referenceCategoryLabel,
      )
    case 'SCALE':
    default:
      return createReferenceTransformModeSnapRootSession(
        'referenceTransformScaleSnapRoot',
        'scale',
        'Scale',
        label,
        referenceId,
        isReferenceTransformSnapModeLocked(context, referenceId, 'scale'),
        isReferenceTransformSnapModeEnabled(context, referenceId, 'scale'),
        referenceCategoryId,
        referenceCategoryLabel,
      )
  }
}

const createReferenceTransformSnapAxisSession = (
  mode: ReferenceTransformSnapMode,
  axis: ReferenceTransformSnapAxis,
  label: string,
  referenceId: string,
  referenceCategoryId: string | null,
  referenceCategoryLabel: string | null,
): ConsoleStagedNavigationSession => {
  const modeLabel = mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'
  const scopeId =
    mode === 'translate'
      ? axis === 'x'
        ? 'referenceTransformMoveSnapXRoot'
        : axis === 'y'
          ? 'referenceTransformMoveSnapYRoot'
          : 'referenceTransformMoveSnapZRoot'
      : mode === 'rotate'
        ? axis === 'x'
          ? 'referenceTransformRotateSnapXRoot'
          : axis === 'y'
            ? 'referenceTransformRotateSnapYRoot'
            : 'referenceTransformRotateSnapZRoot'
        : axis === 'x'
          ? 'referenceTransformScaleSnapXRoot'
          : axis === 'y'
            ? 'referenceTransformScaleSnapYRoot'
            : 'referenceTransformScaleSnapZRoot'
  return createReferenceTransformAxisSnapRootSession(
    scopeId,
    modeLabel,
    axis,
    label,
    referenceId,
    referenceCategoryId,
    referenceCategoryLabel,
  )
}

const createContentObjectTransformSnapModeSessionByToken = (
  context: ConsoleStagedNavigationContext,
  token: string,
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string,
): ConsoleStagedNavigationSession | null => {
  switch (token) {
    case MOVE_CHOICE.canonicalToken:
      return createContentObjectTransformModeSnapRootSession(
        'contentObjectTransformMoveSnapRoot',
        'translate',
        'Move',
        labels,
        fallbackGraphDocumentId,
        objectId,
        isContentObjectTransformSnapModeLocked(context, objectId, 'translate'),
        isContentObjectTransformSnapModeEnabled(context, objectId, 'translate'),
      )
    case ROTATE_CHOICE.canonicalToken:
      return createContentObjectTransformModeSnapRootSession(
        'contentObjectTransformRotateSnapRoot',
        'rotate',
        'Rotate',
        labels,
        fallbackGraphDocumentId,
        objectId,
        isContentObjectTransformSnapModeLocked(context, objectId, 'rotate'),
        isContentObjectTransformSnapModeEnabled(context, objectId, 'rotate'),
      )
    case SCALE_CHOICE.canonicalToken:
      return createContentObjectTransformModeSnapRootSession(
        'contentObjectTransformScaleSnapRoot',
        'scale',
        'Scale',
        labels,
        fallbackGraphDocumentId,
        objectId,
        isContentObjectTransformSnapModeLocked(context, objectId, 'scale'),
        isContentObjectTransformSnapModeEnabled(context, objectId, 'scale'),
      )
    default:
      return null
  }
}

const createContentObjectTransformSnapAxisSession = (
  mode: ReferenceTransformSnapMode,
  axis: ReferenceTransformSnapAxis,
  labels: string | string[],
  fallbackGraphDocumentId: string | null,
  objectId: string,
): ConsoleStagedNavigationSession => {
  const modeLabel = mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'
  const axisLabel = axis.toUpperCase() as 'X' | 'Y' | 'Z'
  const scopeId =
    mode === 'translate'
      ? axis === 'x'
        ? 'contentObjectTransformMoveSnapXRoot'
        : axis === 'y'
          ? 'contentObjectTransformMoveSnapYRoot'
          : 'contentObjectTransformMoveSnapZRoot'
      : mode === 'rotate'
        ? axis === 'x'
          ? 'contentObjectTransformRotateSnapXRoot'
          : axis === 'y'
            ? 'contentObjectTransformRotateSnapYRoot'
            : 'contentObjectTransformRotateSnapZRoot'
        : axis === 'x'
          ? 'contentObjectTransformScaleSnapXRoot'
          : axis === 'y'
            ? 'contentObjectTransformScaleSnapYRoot'
            : 'contentObjectTransformScaleSnapZRoot'
  return createContentObjectTransformAxisSnapRootSession(
    scopeId,
    modeLabel,
    axisLabel,
    labels,
    fallbackGraphDocumentId,
    objectId,
  )
}

const parseReferenceTransformSnapValue = (token: string): number | null => {
  const trimmed = token.trim()
  if (trimmed.length === 0) {
    return null
  }
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const getReferenceTransformSnapModeFromScopeId = (
  scopeId: ConsoleStagedNavigationScopeId,
): ReferenceTransformSnapMode | null => {
  switch (scopeId) {
    case 'referenceTransformMoveSnapRoot':
    case 'referenceTransformMoveSnapXRoot':
    case 'referenceTransformMoveSnapYRoot':
    case 'referenceTransformMoveSnapZRoot':
      return 'translate'
    case 'referenceTransformRotateSnapRoot':
    case 'referenceTransformRotateSnapXRoot':
    case 'referenceTransformRotateSnapYRoot':
    case 'referenceTransformRotateSnapZRoot':
      return 'rotate'
    case 'referenceTransformScaleSnapRoot':
    case 'referenceTransformScaleSnapXRoot':
    case 'referenceTransformScaleSnapYRoot':
    case 'referenceTransformScaleSnapZRoot':
      return 'scale'
    default:
      return null
  }
}

const getReferenceTransformSnapAxisFromScopeId = (
  scopeId: ConsoleStagedNavigationScopeId,
): ReferenceTransformSnapAxis | null => {
  switch (scopeId) {
    case 'referenceTransformMoveSnapXRoot':
    case 'referenceTransformRotateSnapXRoot':
    case 'referenceTransformScaleSnapXRoot':
      return 'x'
    case 'referenceTransformMoveSnapYRoot':
    case 'referenceTransformRotateSnapYRoot':
    case 'referenceTransformScaleSnapYRoot':
      return 'y'
    case 'referenceTransformMoveSnapZRoot':
    case 'referenceTransformRotateSnapZRoot':
    case 'referenceTransformScaleSnapZRoot':
      return 'z'
    default:
      return null
  }
}

const getContentObjectTransformSnapModeFromScopeId = (
  scopeId: ConsoleStagedNavigationScopeId,
): ReferenceTransformSnapMode | null => {
  switch (scopeId) {
    case 'contentObjectTransformMoveSnapRoot':
    case 'contentObjectTransformMoveSnapXRoot':
    case 'contentObjectTransformMoveSnapYRoot':
    case 'contentObjectTransformMoveSnapZRoot':
      return 'translate'
    case 'contentObjectTransformRotateSnapRoot':
    case 'contentObjectTransformRotateSnapXRoot':
    case 'contentObjectTransformRotateSnapYRoot':
    case 'contentObjectTransformRotateSnapZRoot':
      return 'rotate'
    case 'contentObjectTransformScaleSnapRoot':
    case 'contentObjectTransformScaleSnapXRoot':
    case 'contentObjectTransformScaleSnapYRoot':
    case 'contentObjectTransformScaleSnapZRoot':
      return 'scale'
    default:
      return null
  }
}

const getContentObjectTransformSnapAxisFromScopeId = (
  scopeId: ConsoleStagedNavigationScopeId,
): ReferenceTransformSnapAxis | null => {
  switch (scopeId) {
    case 'contentObjectTransformMoveSnapXRoot':
    case 'contentObjectTransformRotateSnapXRoot':
    case 'contentObjectTransformScaleSnapXRoot':
      return 'x'
    case 'contentObjectTransformMoveSnapYRoot':
    case 'contentObjectTransformRotateSnapYRoot':
    case 'contentObjectTransformScaleSnapYRoot':
      return 'y'
    case 'contentObjectTransformMoveSnapZRoot':
    case 'contentObjectTransformRotateSnapZRoot':
    case 'contentObjectTransformScaleSnapZRoot':
      return 'z'
    default:
      return null
  }
}

const createReferencesSelectedSession = (
  label: string,
  categoryOptions: Array<{ categoryId: string; label: string; canLoadAll?: boolean }>,
  canLoadAll: boolean,
  referenceIds: string[] = [],
): ConsoleStagedNavigationSession => ({
  scopeId: 'referencesSelected',
  breadcrumb: ['Select', label],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
    referenceZoomIds: referenceIds,
  },
  validChoices: buildReferencesSelectedChoices(categoryOptions, canLoadAll),
})

const createReferenceHideRootSession = (
  referenceCategories: ConsoleStagedNavigationContext['referenceCategories'],
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceHideRoot',
  breadcrumb: ['Hide'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
    referenceCategoryId: null,
  },
  validChoices: buildReferenceHideRootChoices(referenceCategories),
})

const createReferencesZoomRootSession = (
  label: string,
  referenceIds: string[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'referencesZoomRoot',
  breadcrumb: ['Select', label, 'Zoom'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
    referenceZoomIds: referenceIds,
  },
  validChoices: buildZoomActionChoices(),
})

const createReferenceCategorySelectedSession = (
  rootLabel: string,
  categoryId: string,
  label: string,
  itemOptions: Array<{ referenceId: string; label: string }>,
  canLoadAll: boolean,
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceCategorySelected',
  breadcrumb: ['Select', rootLabel, label],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
    referenceCategoryId: categoryId,
    referenceZoomIds: itemOptions.map((item) => item.referenceId),
  },
  validChoices: buildReferenceCategorySelectedChoices(itemOptions, canLoadAll),
})

const createReferenceCategoryZoomRootSession = (
  rootLabel: string,
  categoryId: string,
  label: string,
  referenceIds: string[],
): ConsoleStagedNavigationSession => ({
  scopeId: 'referenceCategoryZoomRoot',
  breadcrumb: ['Select', rootLabel, label, 'Zoom'],
  selections: {
    graphDocumentId: null,
    selectedNodeId: null,
    sketchNodeId: null,
    referenceId: null,
    referenceCategoryId: categoryId,
    referenceZoomIds: referenceIds,
  },
  validChoices: buildZoomActionChoices(),
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
  target:
    | {
        graphDocumentId: string | null
        nodeId: string | null
      }
    | ConsoleWorkspaceContextTarget,
): ConsoleWorkspaceContextSyncResolution => {
  if ('kind' in target && target.kind === 'assembly') {
    if (target.assemblyId === REFERENCE_ROOT_ROW_ID && target.categoryOptions !== undefined) {
      return {
        session: createReferencesSelectedSession(
          target.label,
          target.categoryOptions,
          target.canLoadAll ?? false,
          context.referenceCategories.flatMap((category) =>
            category.items.map((item) => item.referenceId),
          ),
        ),
        selectedLabel: target.label,
      }
    }
    return {
      session: createContentAssemblySelectedSession(
        target.contentBreadcrumbLabels ?? target.label,
        target.assemblyId,
        target.canDelete,
        target.canHide ?? false,
        target.canShow ?? false,
        target.visibilityPartKeys ?? [],
      ),
      selectedLabel: target.label,
    }
  }

  if ('kind' in target && target.kind === 'component') {
    if (
      target.referenceCategoryId !== undefined &&
      target.componentId === buildReferenceCategoryRowId(target.referenceCategoryId)
    ) {
      const matchedCategory = context.referenceCategories.find(
        (category) => category.categoryId === target.referenceCategoryId,
      )
      return {
        session: createReferenceCategorySelectedSession(
          'References',
          target.referenceCategoryId,
          target.label,
          matchedCategory?.items.map((item) => ({
            referenceId: item.referenceId,
            label: item.label,
          })) ?? [],
          target.canLoadAll ?? false,
        ),
        selectedLabel: target.label,
      }
    }
    return {
      session: createContentComponentSelectedSession(
        target.contentBreadcrumbLabels ?? target.label,
        target.fallbackGraphDocumentId,
        target.componentId,
        target.canRename || target.canDelete,
        target.canHide ?? false,
        target.canShow ?? false,
        target.visibilityPartKeys ?? [],
      ),
      selectedLabel: target.label,
    }
  }

  if ('kind' in target && target.kind === 'object') {
    if (target.referenceId !== undefined) {
      return {
        session: createReferenceSelectedSession(
          target.label,
          target.referenceId,
          target.canLoadModel ?? false,
          target.canDelete ?? false,
          target.canHide ?? false,
          target.canExplode ?? false,
          target.referenceCategoryId ?? null,
          target.referenceCategoryLabel ?? null,
        ),
        selectedLabel: target.label,
      }
    }
    if (target.objectId !== undefined) {
      return {
        session: createContentObjectSelectedSession(
          target.contentBreadcrumbLabels ?? target.label,
          target.fallbackGraphDocumentId,
          target.objectId,
        ),
        selectedLabel: target.label,
      }
    }
  }

  if ('kind' in target && target.kind === 'environment-light') {
    return {
      session: createContentObjectSelectedSession(
        target.contentBreadcrumbLabels ?? ['Environment', target.label],
        target.fallbackGraphDocumentId,
        null,
        {
          environmentLightId: target.lightId,
          canDelete: target.canDelete,
          canHide: target.canHide ?? false,
          canShow: target.canShow ?? false,
        },
      ),
      selectedLabel: target.label,
    }
  }

  if ('kind' in target && target.kind === 'multi-select') {
    return {
      session: createMultiSelectSelectedSession(
        target.selectedLabels,
        target.canDelete ?? false,
        target.referenceDeleteIds ?? [],
        target.canHide ?? false,
        target.referenceHideIds ?? [],
        target.canUnhide ?? false,
        target.referenceUnhideIds ?? [],
      ),
      selectedLabel: target.label,
    }
  }

  if ('kind' in target && target.kind === 'references-root') {
      return {
        session: createReferencesSelectedSession(
          target.label,
          target.categoryOptions,
          target.canLoadAll,
          context.referenceCategories.flatMap((category) =>
            category.items.map((item) => item.referenceId),
          ),
        ),
        selectedLabel: target.label,
      }
  }

  if ('kind' in target && target.kind === 'reference-category') {
    const matchedCategory = context.referenceCategories.find(
      (category) => category.categoryId === target.categoryId,
    )
    return {
      session: createReferenceCategorySelectedSession(
        'References',
        target.categoryId,
        target.label,
        matchedCategory?.items.map((item) => ({
          referenceId: item.referenceId,
          label: item.label,
        })) ?? [],
        target.canLoadAll,
      ),
      selectedLabel: target.label,
    }
  }

  if ('kind' in target && target.kind === 'reference-item') {
    return {
      session: createReferenceSelectedSession(
        target.label,
        target.referenceId,
        target.canLoadModel,
        target.canDelete ?? false,
        target.canHide ?? false,
        target.canExplode ?? false,
        target.referenceCategoryId,
        target.referenceCategoryLabel,
      ),
      selectedLabel: target.label,
    }
  }

  const graphTarget =
    'kind' in target
      ? target.kind === 'graph-document'
        ? {
            graphDocumentId: target.graphDocumentId,
            nodeId: null,
          }
        : target.kind === 'graph-node'
          ? {
            graphDocumentId: target.graphDocumentId,
            nodeId: target.nodeId,
          }
          : null
      : target

  if (graphTarget === null) {
    return {
      session: null,
      selectedLabel: null,
    }
  }

  const graphIndex = findGraphIndexByDocumentId(context, graphTarget.graphDocumentId)
  if (graphIndex === null || graphTarget.graphDocumentId === null) {
    return {
      session: null,
      selectedLabel: null,
    }
  }

  if (graphTarget.nodeId === null) {
    return {
      session: createGraphSelectedSession(graphIndex, graphTarget.graphDocumentId),
      selectedLabel: `graph_[${graphIndex}]`,
    }
  }

  const selectedGraph = context.graphOptions[graphIndex - 1] ?? null
  if (selectedGraph === null) {
    return {
      session: createGraphSelectedSession(graphIndex, graphTarget.graphDocumentId),
      selectedLabel: `graph_[${graphIndex}]`,
    }
  }

  const sketchIndex = selectedGraph.sketchOptions.findIndex(
    (option) => option.nodeId === graphTarget.nodeId,
  )
  if (sketchIndex !== -1) {
    const label = `sketch_[${sketchIndex + 1}]`
    return {
      session: createGraphSketchSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Sketch', label],
        {
          graphDocumentId: graphTarget.graphDocumentId,
          selectedNodeId: graphTarget.nodeId,
          sketchNodeId: graphTarget.nodeId,
        },
      ),
      selectedLabel: label,
    }
  }

  const extrudeIndex = selectedGraph.extrudeOptions.findIndex(
    (option) => option.nodeId === graphTarget.nodeId,
  )
  if (extrudeIndex !== -1) {
    const label = `extrude_[${extrudeIndex + 1}]`
    return {
      session: createGraphExtrudeSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Extrude', label],
        {
          graphDocumentId: graphTarget.graphDocumentId,
          selectedNodeId: graphTarget.nodeId,
          sketchNodeId: null,
        },
      ),
      selectedLabel: label,
    }
  }

  const outputPreviewIndex = selectedGraph.outputPreviewOptions.findIndex(
    (option) => option.nodeId === graphTarget.nodeId,
  )
  if (outputPreviewIndex !== -1) {
    const label = `outputPreview_[${outputPreviewIndex + 1}]`
    return {
      session: createGraphOutputPreviewSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Output Preview', label],
        {
          graphDocumentId: graphTarget.graphDocumentId,
          selectedNodeId: graphTarget.nodeId,
          sketchNodeId: null,
        },
      ),
      selectedLabel: label,
    }
  }

  const allNodeIndex = selectedGraph.allNodeOptions.findIndex(
    (option) => option.nodeId === graphTarget.nodeId,
  )
  if (allNodeIndex !== -1) {
    const label = selectedGraph.allNodeOptions[allNodeIndex]?.label ?? `node_[${allNodeIndex + 1}]`
    return {
      session: createGraphNodeSelectedSession(
        ['Select', 'Graph', `graph_[${graphIndex}]`, 'Focus Node', label],
        {
          graphDocumentId: graphTarget.graphDocumentId,
          selectedNodeId: graphTarget.nodeId,
          sketchNodeId: null,
        },
      ),
      selectedLabel: label,
    }
  }

  return {
    session: createGraphSelectedSession(graphIndex, graphTarget.graphDocumentId),
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

const isReferenceCategoryContextEntry = (
  value: unknown,
): value is ConsoleStagedNavigationContext['referenceCategories'][number] =>
  typeof value === 'object' &&
  value !== null &&
  'categoryId' in value &&
  'items' in value

const isSketchDrawContext = (
  value: unknown,
): value is ConsoleStagedNavigationContext['sketchDraw'] =>
  typeof value === 'object' &&
  value !== null &&
  'hasSelection' in value &&
  'hasPrevious' in value &&
  'preferredTool' in value

export const createConsoleStagedNavigationContext = (
  graphOptions: ConsoleStagedGraphOption[],
  contentAssembliesOrReferenceCategories:
    | ConsoleStagedNavigationContext['contentAssemblies']
    | ConsoleStagedNavigationContext['referenceCategories'] = [],
  referenceCategoriesOrSketchDraw:
    | ConsoleStagedNavigationContext['referenceCategories']
    | ConsoleStagedNavigationContext['sketchDraw'] = [],
  sketchDrawOrReferenceTransformShellByReferenceId:
    | ConsoleStagedNavigationContext['sketchDraw']
    | ConsoleStagedNavigationContext['referenceTransformShellByReferenceId'] = {
      hasSelection: false,
      hasPrevious: false,
      preferredTool: 'LINE',
    },
  referenceTransformShellByReferenceIdOrSnapLock:
    | ConsoleStagedNavigationContext['referenceTransformShellByReferenceId']
    | ConsoleStagedNavigationContext['referenceTransformSnapLockByReferenceId'] = {},
  referenceTransformSnapLockByReferenceIdOrSnapEnabled:
    | ConsoleStagedNavigationContext['referenceTransformSnapLockByReferenceId']
    | ConsoleStagedNavigationContext['referenceTransformSnapEnabledByReferenceId'] = {},
  referenceTransformSnapEnabledByReferenceId: ConsoleStagedNavigationContext['referenceTransformSnapEnabledByReferenceId'] = {},
  contentObjectTransformSnapLockByObjectId: ConsoleStagedNavigationContext['contentObjectTransformSnapLockByObjectId'] = {},
  contentObjectTransformSnapEnabledByObjectId: ConsoleStagedNavigationContext['contentObjectTransformSnapEnabledByObjectId'] = {},
  contentObjectTransformShellByObjectId: ConsoleStagedNavigationContext['contentObjectTransformShellByObjectId'] = {},
  workspaceViewportOptions: ConsoleStagedNavigationContext['workspaceViewportOptions'] = [],
  environmentLightTransformShellByLightId: ConsoleStagedNavigationContext['environmentLightTransformShellByLightId'] = {},
): ConsoleStagedNavigationContext => {
  const usingLegacyArgumentOrder =
    (contentAssembliesOrReferenceCategories.length > 0 &&
      isReferenceCategoryContextEntry(contentAssembliesOrReferenceCategories[0])) ||
    isSketchDrawContext(referenceCategoriesOrSketchDraw)

  const contentAssemblies = usingLegacyArgumentOrder
    ? []
    : (contentAssembliesOrReferenceCategories as ConsoleStagedNavigationContext['contentAssemblies'])
  const referenceCategories = usingLegacyArgumentOrder
    ? (contentAssembliesOrReferenceCategories as ConsoleStagedNavigationContext['referenceCategories'])
    : Array.isArray(referenceCategoriesOrSketchDraw)
      ? (referenceCategoriesOrSketchDraw as ConsoleStagedNavigationContext['referenceCategories'])
      : []
  const sketchDraw = usingLegacyArgumentOrder
    ? (referenceCategoriesOrSketchDraw as ConsoleStagedNavigationContext['sketchDraw'])
    : (sketchDrawOrReferenceTransformShellByReferenceId as ConsoleStagedNavigationContext['sketchDraw'])
  const referenceTransformShellByReferenceId = usingLegacyArgumentOrder
    ? (sketchDrawOrReferenceTransformShellByReferenceId as ConsoleStagedNavigationContext['referenceTransformShellByReferenceId'])
    : (referenceTransformShellByReferenceIdOrSnapLock as ConsoleStagedNavigationContext['referenceTransformShellByReferenceId'])
  const referenceTransformSnapLockByReferenceId = usingLegacyArgumentOrder
    ? (referenceTransformShellByReferenceIdOrSnapLock as ConsoleStagedNavigationContext['referenceTransformSnapLockByReferenceId'])
    : (referenceTransformSnapLockByReferenceIdOrSnapEnabled as ConsoleStagedNavigationContext['referenceTransformSnapLockByReferenceId'])
  const normalizedReferenceTransformSnapEnabledByReferenceId = usingLegacyArgumentOrder
    ? (referenceTransformSnapLockByReferenceIdOrSnapEnabled as ConsoleStagedNavigationContext['referenceTransformSnapEnabledByReferenceId'])
    : referenceTransformSnapEnabledByReferenceId

  return {
    workspaceViewportOptions: workspaceViewportOptions.map((viewportOption) => ({
      viewportId: viewportOption.viewportId,
      surfaceInstanceId: viewportOption.surfaceInstanceId ?? viewportOption.viewportId,
      hostMode: viewportOption.hostMode ?? 'slotted',
      slotId: viewportOption.slotId,
      isPrimary: viewportOption.isPrimary,
      label: viewportOption.label,
      surfaceKind: viewportOption.surfaceKind,
    })),
    contentAssemblies: contentAssemblies.map((assembly) => ({
      assemblyId: assembly.assemblyId,
      label: assembly.label,
      canDelete: assembly.canDelete,
    })),
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
    referenceCategories: referenceCategories.map((category) => ({
      categoryId: category.categoryId,
      label: category.label,
      canLoadAll: category.canLoadAll,
      items: category.items.map((item) => ({
        referenceId: item.referenceId,
        label: item.label,
        canLoadModel: item.canLoadModel,
        canDelete: item.canDelete ?? false,
        canHide: item.canHide ?? false,
        canExplode: item.canExplode ?? false,
      })),
    })),
    sketchDraw,
    referenceTransformShellByReferenceId: { ...referenceTransformShellByReferenceId },
    referenceTransformSnapLockByReferenceId: { ...referenceTransformSnapLockByReferenceId },
    referenceTransformSnapEnabledByReferenceId: { ...normalizedReferenceTransformSnapEnabledByReferenceId },
    contentObjectTransformSnapLockByObjectId: { ...contentObjectTransformSnapLockByObjectId },
    contentObjectTransformSnapEnabledByObjectId: { ...contentObjectTransformSnapEnabledByObjectId },
    contentObjectTransformShellByObjectId: { ...contentObjectTransformShellByObjectId },
    environmentLightTransformShellByLightId: { ...environmentLightTransformShellByLightId },
  }
}

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
    if (matchedRootChoice.canonicalToken === ROOT_CONTENT_CHOICE.canonicalToken) {
      return createAdvanceResult(createContentRootSession(context), submittedToken, matchedRootChoice)
    }
    if (matchedRootChoice.canonicalToken === ROOT_REFERENCES_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferencesSelectedSession(
          ROOT_REFERENCES_CHOICE.label,
          context.referenceCategories,
          context.referenceCategories.some((category) => category.canLoadAll),
        ),
        submittedToken,
        matchedRootChoice,
      )
    }
    if (matchedRootChoice.canonicalToken === ROOT_HIDE_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferenceHideRootSession(context.referenceCategories),
        submittedToken,
        matchedRootChoice,
      )
    }
    if (matchedRootChoice.canonicalToken === ROOT_UNHIDE_ALL_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: createConsoleRootSession(),
        submittedToken,
        matchedChoice: matchedRootChoice,
        actionId: 'reference.unhideAll',
        breadcrumb: ['Root', matchedRootChoice.label],
        selections: createConsoleRootSession().selections,
      }
    }
    if (matchedRootChoice.canonicalToken === ROOT_WORKSPACE_MODES_CHOICE.canonicalToken) {
      return createAdvanceResult(createWorkspaceModesRootSession(context), submittedToken, matchedRootChoice)
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
    if (matchedChoice.canonicalToken === ROOT_REFERENCES_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferencesSelectedSession(
          ROOT_REFERENCES_CHOICE.label,
          context.referenceCategories,
          context.referenceCategories.some((category) => category.canLoadAll),
        ),
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.canonicalToken === ROOT_HIDE_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferenceHideRootSession(context.referenceCategories),
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.canonicalToken === ROOT_UNHIDE_ALL_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: rootChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.unhideAll',
        breadcrumb: ['Root', matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === ROOT_WORKSPACE_MODES_CHOICE.canonicalToken) {
      return createAdvanceResult(createWorkspaceModesRootSession(context), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === ROOT_CONTENT_CHOICE.canonicalToken) {
      return createAdvanceResult(createContentRootSession(context), submittedToken, matchedChoice)
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

  if (session.scopeId === 'workspaceModesRoot') {
    const workspaceModesChoices = buildWorkspaceModesRootChoices(context)
    const matchedChoice =
      workspaceModesChoices.find((choice) =>
        matchesChoice(choice, normalizedToken, session, workspaceModesChoices),
      ) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: workspaceModesChoices },
        submittedToken,
        workspaceModesChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    if (typeof matchedChoice.workspaceViewportId === 'string') {
      return createAdvanceResult(
        createWorkspaceModeViewportSelectedSession(
          matchedChoice.workspaceViewportId,
          matchedChoice.label,
          context,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    return createInvalidResult(
      { ...session, validChoices: workspaceModesChoices },
      submittedToken,
      workspaceModesChoices,
    )
  }

    if (session.scopeId === 'workspaceModeViewportSelected') {
      const choices = buildWorkspaceViewportActionChoices(
        resolveWorkspaceViewportActionChoiceOptions(
          resolveWorkspaceViewportOption(context, session.selections.workspaceViewportId ?? ''),
        ),
      )
      const matchedChoice =
        choices.find((choice) => matchesChoice(choice, normalizedToken, session, choices)) ?? null
      if (matchedChoice === null) {
        return createInvalidResult({ ...session, validChoices: choices }, submittedToken, choices)
      }
      if (matchedChoice.canonicalToken === WORKSPACE_SPLIT_MENU_CHOICE.canonicalToken) {
        return createAdvanceResult(
          createWorkspaceModeViewportSplitSelectedSession(
            session.selections.workspaceViewportId ?? '',
            session.breadcrumb.at(-1) ?? 'Viewport',
          ),
          submittedToken,
          matchedChoice,
        )
      }
      if (matchedChoice.canonicalToken === WORKSPACE_VIEWPORT_TYPE_CHOICE.canonicalToken) {
        return createAdvanceResult(
          createWorkspaceModeViewportTypeSelectedSession(
            session.selections.workspaceViewportId ?? '',
            session.breadcrumb.at(-1) ?? 'Viewport',
          ),
          submittedToken,
          matchedChoice,
        )
      }
      if (matchedChoice.canonicalToken === WORKSPACE_FLOAT_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session,
          submittedToken,
          matchedChoice,
          actionId: 'workspace.viewport.float',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === WORKSPACE_CLOSE_CHOICE.canonicalToken) {
        return createAdvanceResult(
          createWorkspaceModeViewportCloseConfirmSelectedSession(
            session.selections.workspaceViewportId ?? '',
            session.breadcrumb.at(-1) ?? 'Viewport',
          ),
          submittedToken,
          matchedChoice,
        )
      }
      if (matchedChoice.canonicalToken === WORKSPACE_OPEN_IN_NEW_BROWSER_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: {
            ...session,
            validChoices: choices,
          },
          submittedToken,
          matchedChoice,
          actionId: 'workspace.viewport.openInNewBrowser',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      return createAdvanceResult(createWorkspaceModesRootSession(context), submittedToken, matchedChoice)
    }

  if (session.scopeId === 'workspaceModeViewportSplitSelected') {
    const choices = buildWorkspaceViewportSplitChoices()
    const matchedChoice =
      choices.find((choice) => matchesChoice(choice, normalizedToken, session, choices)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: choices }, submittedToken, choices)
    }
    if (matchedChoice.canonicalToken === WORKSPACE_SPLIT_TOP_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: choices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'workspace.viewport.split.top',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === WORKSPACE_SPLIT_RIGHT_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: choices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'workspace.viewport.split.right',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === WORKSPACE_SPLIT_BOTTOM_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: choices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'workspace.viewport.split.bottom',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === WORKSPACE_SPLIT_LEFT_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: choices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'workspace.viewport.split.left',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    return createAdvanceResult(
      createWorkspaceModeViewportSelectedSession(
        session.selections.workspaceViewportId ?? '',
        session.breadcrumb.at(-2) ?? 'Viewport',
        context,
      ),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'workspaceModeViewportTypeSelected') {
    const choices = buildWorkspaceViewportTypeChoices()
    const matchedChoice =
      choices.find((choice) => matchesChoice(choice, normalizedToken, session, choices)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: choices }, submittedToken, choices)
    }
    if (matchedChoice.workspaceSurfaceKind !== undefined) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: choices,
        },
        submittedToken,
        matchedChoice,
        actionId: `workspace.viewport.type.${matchedChoice.workspaceSurfaceKind}`,
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    return createAdvanceResult(
      createWorkspaceModeViewportSelectedSession(
        session.selections.workspaceViewportId ?? '',
        session.breadcrumb.at(-2) ?? 'Viewport',
        context,
      ),
      submittedToken,
      matchedChoice,
    )
  }

  if (session.scopeId === 'workspaceModeViewportCloseConfirmSelected') {
    const choices = buildWorkspaceViewportCloseConfirmChoices()
    const matchedChoice =
      choices.find((choice) => matchesChoice(choice, normalizedToken, session, choices)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: choices }, submittedToken, choices)
    }
    if (matchedChoice.canonicalToken === WORKSPACE_CONFIRM_CLOSE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: choices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'workspace.viewport.close',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    return createAdvanceResult(
      createWorkspaceModeViewportSelectedSession(
        session.selections.workspaceViewportId ?? '',
        session.breadcrumb.at(-2) ?? 'Viewport',
        context,
      ),
      submittedToken,
      matchedChoice,
    )
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
                    : matchedChoice.canonicalToken === 'DONE'
                      ? 'sketchdraw.done'
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

  if (session.scopeId === 'contentObjectZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const isEnvironmentLight =
        typeof session.selections.environmentLightId === 'string' &&
        session.selections.environmentLightId.length > 0
      return createAdvanceResult(
        createContentObjectSelectedSession(
          extractContentBreadcrumbLabels(session.breadcrumb, 1),
          session.selections.graphDocumentId,
          session.selections.contentObjectId ?? null,
          isEnvironmentLight
            ? {
                environmentLightId: session.selections.environmentLightId ?? null,
                canDelete: true,
                canHide: session.selections.contentCanHide ?? false,
                canShow: session.selections.contentCanShow ?? false,
              }
            : null,
        ),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'referenceZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createReferenceSelectedSession(
          session.breadcrumb.at(-2) ?? 'Reference',
          session.selections.referenceId ?? '',
          session.selections.referenceCanLoadModel ?? false,
          session.selections.referenceCanDelete ?? false,
          session.selections.referenceCanHide ?? false,
          session.selections.referenceCanExplode ?? false,
          session.selections.referenceCategoryId ?? null,
          session.selections.referenceCategoryId !== null ? (session.breadcrumb.at(-3) ?? null) : null,
        ),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'contentRoot') {
    const contentChoices = buildContentRootChoices(context.contentAssemblies)
    const matchedChoice =
      contentChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: contentChoices }, submittedToken, contentChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === NEW_ASSEMBLY_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.newAssembly',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.contentAssemblyId !== undefined) {
      const assembly = context.contentAssemblies.find(
        (entry) => entry.assemblyId === matchedChoice.contentAssemblyId,
      )
      if (assembly !== undefined) {
        return createAdvanceResult(
          createContentAssemblySelectedSession(
            assembly.label,
            assembly.assemblyId,
            assembly.canDelete,
          ),
          submittedToken,
          matchedChoice,
        )
      }
    }
    return createInvalidResult({ ...session, validChoices: contentChoices }, submittedToken, contentChoices)
  }

  if (session.scopeId === 'contentAssemblySelected') {
    const canDelete = context.contentAssemblies.find(
      (assembly) => assembly.assemblyId === session.selections.contentAssemblyId,
    )?.canDelete ?? false
    const contentChoices = buildContentAssemblySelectedChoices(
      canDelete,
      session.selections.contentCanHide ?? false,
      session.selections.contentCanShow ?? false,
    )
    const matchedChoice =
      contentChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: contentChoices },
        submittedToken,
        contentChoices,
      )
    }
    if (matchedChoice.canonicalToken === SELECT_ALL_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: contentChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'content.selectAll',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === NEW_COMPONENT_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.newComponent',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === RENAME_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.rename',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === DELETE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.delete',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === HIDE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.visibility.hide',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === SHOW_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.visibility.show',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createContentAssemblyZoomRootSession(extractContentBreadcrumbLabels(session.breadcrumb)),
        submittedToken,
        matchedChoice,
      )
    }
    return createAdvanceResult(createContentRootSession(context), submittedToken, matchedChoice)
  }

  if (session.scopeId === 'contentAssemblyZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createContentAssemblySelectedSession(
          extractContentBreadcrumbLabels(session.breadcrumb, 1),
          session.selections.contentAssemblyId ?? null,
          context.contentAssemblies.find(
            (assembly) => assembly.assemblyId === session.selections.contentAssemblyId,
          )?.canDelete ?? false,
          session.selections.contentCanHide ?? false,
          session.selections.contentCanShow ?? false,
          session.selections.contentVisibilityPartKeys ?? [],
        ),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'contentComponentSelected') {
    const contentChoices = buildContentComponentSelectedChoices(
      session.selections.contentComponentId !== null &&
        session.selections.contentComponentId !== undefined,
      session.selections.contentCanHide ?? false,
      session.selections.contentCanShow ?? false,
    )
    const matchedChoice =
      contentChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: contentChoices },
        submittedToken,
        contentChoices,
      )
    }
    if (matchedChoice.canonicalToken === SELECT_ALL_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: contentChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'content.selectAll',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === RENAME_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.rename',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === DELETE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.delete',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === HIDE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.visibility.hide',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === SHOW_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'content.visibility.show',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    return createAdvanceResult(createContentRootSession(context), submittedToken, matchedChoice)
  }

  if (session.scopeId === 'contentObjectSelected') {
    const isEnvironmentLight =
      typeof session.selections.environmentLightId === 'string' &&
      session.selections.environmentLightId.length > 0
    const contentChoices =
      session.validChoices.length > 0
        ? session.validChoices
        : isEnvironmentLight
          ? buildEnvironmentLightSelectedChoices({
              canDelete: true,
              canHide: session.selections.contentCanHide ?? false,
              canShow: session.selections.contentCanShow ?? false,
            })
          : buildContentObjectSelectedChoices()
    const matchedChoice =
      contentChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: contentChoices },
        submittedToken,
        contentChoices,
      )
    }
    if (isEnvironmentLight) {
      if (matchedChoice.canonicalToken === DELETE_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: { ...session, validChoices: contentChoices },
          submittedToken,
          matchedChoice,
          actionId: 'content.delete',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === HIDE_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: { ...session, validChoices: contentChoices },
          submittedToken,
          matchedChoice,
          actionId: 'content.visibility.hide',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === SHOW_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: { ...session, validChoices: contentChoices },
          submittedToken,
          matchedChoice,
          actionId: 'content.visibility.show',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: { ...session, validChoices: contentChoices },
          submittedToken,
          matchedChoice,
          actionId: 'zoom.model.object',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === ZOOM_OBJECT_DIRECT_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: { ...session, validChoices: contentChoices },
          submittedToken,
          matchedChoice,
          actionId: 'zoom.model.object',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === TRANSFORM_CHOICE.canonicalToken) {
        return createAdvanceResult(
          createContentObjectTransformRootSession(
            extractContentBreadcrumbLabels(session.breadcrumb),
            session.selections.graphDocumentId,
            null,
            hasAnyCommittedEntriesInEnvironmentLightTransformHistory(
              context,
              session.selections.environmentLightId ?? '',
            ),
            session.selections.environmentLightId ?? null,
          ),
          submittedToken,
          matchedChoice,
        )
      }
      if (matchedChoice.canonicalToken === MOVE_CHOICE.canonicalToken) {
        const transformRootSession = createContentObjectTransformRootSession(
          extractContentBreadcrumbLabels(session.breadcrumb),
          session.selections.graphDocumentId,
          null,
          hasAnyCommittedEntriesInEnvironmentLightTransformHistory(
            context,
            session.selections.environmentLightId ?? '',
          ),
          session.selections.environmentLightId ?? null,
        )
        return {
          kind: 'execute',
          session: transformRootSession,
          submittedToken,
          matchedChoice,
          actionId: 'content.transform.move',
          breadcrumb: [...transformRootSession.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'zoom.model.object',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === ZOOM_OBJECT_DIRECT_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: { ...session, validChoices: contentChoices },
        submittedToken,
        matchedChoice,
        actionId: 'zoom.model.object',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === TRANSFORM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createContentObjectTransformRootSession(
          extractContentBreadcrumbLabels(session.breadcrumb),
          session.selections.graphDocumentId,
          session.selections.contentObjectId ?? null,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    if (
      matchedChoice.canonicalToken === MOVE_CHOICE.canonicalToken ||
      matchedChoice.canonicalToken === ROTATE_CHOICE.canonicalToken ||
      matchedChoice.canonicalToken === SCALE_CHOICE.canonicalToken
    ) {
      const transformRootSession = createContentObjectTransformRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      const actionIdByToken: Record<
        string,
        Extract<
          ConsoleStagedNavigationExecuteResult['actionId'],
          'content.transform.move' | 'content.transform.rotate' | 'content.transform.scale'
        >
      > = {
        MOVE: 'content.transform.move',
        ROTATE: 'content.transform.rotate',
        SCALE: 'content.transform.scale',
      }
      return {
        kind: 'execute',
        session: transformRootSession,
        submittedToken,
        matchedChoice,
        actionId: actionIdByToken[matchedChoice.canonicalToken],
        breadcrumb: [...transformRootSession.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
  }

  if (session.scopeId === 'contentObjectTransformRoot') {
    const isEnvironmentLight =
      typeof session.selections.environmentLightId === 'string' &&
      session.selections.environmentLightId.length > 0
    const transformChoices =
      session.validChoices.length > 0
        ? session.validChoices
        : isEnvironmentLight
          ? buildEnvironmentLightTransformRootChoices(
              hasAnyCommittedEntriesInEnvironmentLightTransformHistory(
                context,
                session.selections.environmentLightId ?? '',
              ),
            )
          : buildContentTransformRootChoices(
              hasAnyCommittedEntriesInContentObjectTransformHistory(
                context,
                session.selections.contentObjectId ?? '',
              ),
            )
    const matchedChoice =
      transformChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: transformChoices },
        submittedToken,
        transformChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createContentObjectSelectedSession(
          extractContentBreadcrumbLabels(session.breadcrumb, 1),
          session.selections.graphDocumentId,
          session.selections.contentObjectId ?? null,
          isEnvironmentLight
            ? {
                environmentLightId: session.selections.environmentLightId ?? null,
                canDelete: true,
                canHide: session.selections.contentCanHide ?? false,
                canShow: session.selections.contentCanShow ?? false,
              }
            : null,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    if (isEnvironmentLight) {
      if (matchedChoice.canonicalToken === DELETE_LATEST_TRANSFORM_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: {
            ...session,
            validChoices: transformChoices,
          },
          submittedToken,
          matchedChoice,
          actionId: 'content.transform.deleteLatest',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      if (matchedChoice.canonicalToken === MOVE_CHOICE.canonicalToken) {
        return {
          kind: 'execute',
          session: {
            ...session,
            validChoices: transformChoices,
          },
          submittedToken,
          matchedChoice,
          actionId: 'content.transform.move',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
        }
      }
      return createInvalidResult(
        { ...session, validChoices: transformChoices },
        submittedToken,
        transformChoices,
      )
    }
    if (matchedChoice.canonicalToken === SETTINGS_CHOICE.canonicalToken) {
      const nextSession = createContentObjectTransformSettingsRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb, 1),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    if (matchedChoice.canonicalToken === SNAP_CHOICE.canonicalToken) {
      const nextSession = createContentObjectTransformSnapRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb, 1),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    if (matchedChoice.canonicalToken === DELETE_LATEST_TRANSFORM_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: transformChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'content.transform.deleteLatest',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        | 'content.transform.move'
        | 'content.transform.rotate'
        | 'content.transform.scale'
      >
    > = {
      MOVE: 'content.transform.move',
      ROTATE: 'content.transform.rotate',
      SCALE: 'content.transform.scale',
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: transformChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'contentObjectTransformSettingsRoot') {
    const settingsChoices = buildReferenceTransformSettingsChoices()
    const matchedChoice =
      settingsChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: settingsChoices },
        submittedToken,
        settingsChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createContentObjectTransformRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb, 2),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const nextSession =
      matchedChoice.canonicalToken === SNAP_CHOICE.canonicalToken
        ? createContentObjectTransformSnapRootSession(
            extractContentBreadcrumbLabels(session.breadcrumb, 2),
            session.selections.graphDocumentId,
            session.selections.contentObjectId ?? null,
          )
        : createContentObjectTransformSpaceRootSession(
            extractContentBreadcrumbLabels(session.breadcrumb, 2),
            session.selections.graphDocumentId,
            session.selections.contentObjectId ?? null,
          )
    return {
      kind: 'advance',
      session: nextSession,
      submittedToken,
      matchedChoice,
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      validChoices: nextSession.validChoices,
      selections: nextSession.selections,
      autoSelections: [],
    }
  }

  if (session.scopeId === 'contentObjectTransformSpaceRoot') {
    const spaceChoices = buildReferenceTransformSpaceChoices()
    const matchedChoice =
      spaceChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: spaceChoices },
        submittedToken,
        spaceChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createContentObjectTransformSettingsRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb, 3),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        'content.transform.space.local' | 'content.transform.space.world'
      >
    > = {
      LOCAL: 'content.transform.space.local',
      WORLD: 'content.transform.space.world',
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: spaceChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'contentObjectTransformSnapRoot') {
    const snapChoices = buildReferenceTransformSnapChoices()
    const matchedChoice =
      snapChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: snapChoices },
        submittedToken,
        snapChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createContentObjectTransformSettingsRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb, 3),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const objectId = session.selections.contentObjectId ?? null
    const nextSession =
      objectId === null
        ? null
        : createContentObjectTransformSnapModeSessionByToken(
            context,
            matchedChoice.canonicalToken,
            extractContentBreadcrumbLabels(session.breadcrumb, 3),
            session.selections.graphDocumentId,
            objectId,
          )
    if (nextSession === null) {
      return createInvalidResult(
        { ...session, validChoices: snapChoices },
        submittedToken,
        snapChoices,
      )
    }
    return {
      kind: 'advance',
      session: nextSession,
      submittedToken,
      matchedChoice,
      breadcrumb: nextSession.breadcrumb,
      validChoices: nextSession.validChoices,
      selections: nextSession.selections,
      autoSelections: [],
    }
  }

  if (
    session.scopeId === 'contentObjectTransformMoveSnapRoot' ||
    session.scopeId === 'contentObjectTransformRotateSnapRoot' ||
    session.scopeId === 'contentObjectTransformScaleSnapRoot'
  ) {
    const mode = getContentObjectTransformSnapModeFromScopeId(session.scopeId) ?? 'translate'
    const objectId = session.selections.contentObjectId ?? null
    const modeChoices = buildReferenceTransformSnapModeChoices(
      mode,
      objectId === null ? true : isContentObjectTransformSnapModeLocked(context, objectId, mode),
      objectId === null ? false : isContentObjectTransformSnapModeEnabled(context, objectId, mode),
    )
    const numericValue = parseReferenceTransformSnapValue(submittedToken)
    if (numericValue !== null) {
      const actionIdByMode: Record<
        ReferenceTransformSnapMode,
        Extract<
          ConsoleStagedNavigationExecuteResult['actionId'],
          | 'content.transform.snap.translate.value'
          | 'content.transform.snap.rotate.value'
          | 'content.transform.snap.scale.value'
        >
      > = {
        translate: 'content.transform.snap.translate.value',
        rotate: 'content.transform.snap.rotate.value',
        scale: 'content.transform.snap.scale.value',
      }
      return {
        kind: 'execute',
        session: { ...session, validChoices: modeChoices },
        submittedToken,
        matchedChoice: {
          canonicalToken: String(numericValue),
          aliases: [],
          label: String(numericValue),
          kind: 'action',
        },
        actionId: actionIdByMode[mode],
        breadcrumb: [...session.breadcrumb, String(numericValue)],
        selections: session.selections,
      }
    }
    const matchedChoice =
      modeChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: modeChoices },
        submittedToken,
        modeChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createContentObjectTransformSnapRootSession(
        extractContentBreadcrumbLabels(session.breadcrumb, 4),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    if (
      matchedChoice.canonicalToken === 'SNAPXYZ:LOCK' ||
      matchedChoice.canonicalToken === 'SNAPXYZ:UNLOCK'
    ) {
      const actionIdByModeAndToken: Record<
        ReferenceTransformSnapMode,
        Record<
          'SNAPXYZ:LOCK' | 'SNAPXYZ:UNLOCK',
          Extract<
            ConsoleStagedNavigationExecuteResult['actionId'],
            | 'content.transform.snap.translate.lock'
            | 'content.transform.snap.translate.unlock'
            | 'content.transform.snap.rotate.lock'
            | 'content.transform.snap.rotate.unlock'
            | 'content.transform.snap.scale.lock'
            | 'content.transform.snap.scale.unlock'
          >
        >
      > = {
        translate: {
          'SNAPXYZ:LOCK': 'content.transform.snap.translate.lock',
          'SNAPXYZ:UNLOCK': 'content.transform.snap.translate.unlock',
        },
        rotate: {
          'SNAPXYZ:LOCK': 'content.transform.snap.rotate.lock',
          'SNAPXYZ:UNLOCK': 'content.transform.snap.rotate.unlock',
        },
        scale: {
          'SNAPXYZ:LOCK': 'content.transform.snap.scale.lock',
          'SNAPXYZ:UNLOCK': 'content.transform.snap.scale.unlock',
        },
      }
      return {
        kind: 'execute',
        session: { ...session, validChoices: modeChoices },
        submittedToken,
        matchedChoice,
        actionId: actionIdByModeAndToken[mode][matchedChoice.canonicalToken as 'SNAPXYZ:LOCK' | 'SNAPXYZ:UNLOCK'],
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === 'ON' || matchedChoice.canonicalToken === 'OFF') {
      const actionIdByModeAndToken: Record<
        ReferenceTransformSnapMode,
        Record<
          'ON' | 'OFF',
          Extract<
            ConsoleStagedNavigationExecuteResult['actionId'],
            | 'content.transform.snap.translate.on'
            | 'content.transform.snap.translate.off'
            | 'content.transform.snap.rotate.on'
            | 'content.transform.snap.rotate.off'
            | 'content.transform.snap.scale.on'
            | 'content.transform.snap.scale.off'
          >
        >
      > = {
        translate: {
          ON: 'content.transform.snap.translate.on',
          OFF: 'content.transform.snap.translate.off',
        },
        rotate: {
          ON: 'content.transform.snap.rotate.on',
          OFF: 'content.transform.snap.rotate.off',
        },
        scale: {
          ON: 'content.transform.snap.scale.on',
          OFF: 'content.transform.snap.scale.off',
        },
      }
      return {
        kind: 'execute',
        session: { ...session, validChoices: modeChoices },
        submittedToken,
        matchedChoice,
        actionId: actionIdByModeAndToken[mode][matchedChoice.canonicalToken as 'ON' | 'OFF'],
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    const axisChoice = matchedChoice.label.match(/^[A-Z]$/) ? matchedChoice.label.toLowerCase() : null
    if (axisChoice === 'x' || axisChoice === 'y' || axisChoice === 'z') {
      const nextSession = createContentObjectTransformSnapAxisSession(
        mode,
        axisChoice,
        extractContentBreadcrumbLabels(session.breadcrumb, 4),
        session.selections.graphDocumentId,
        session.selections.contentObjectId ?? '',
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
  }

  if (
    session.scopeId === 'contentObjectTransformMoveSnapXRoot' ||
    session.scopeId === 'contentObjectTransformMoveSnapYRoot' ||
    session.scopeId === 'contentObjectTransformMoveSnapZRoot' ||
    session.scopeId === 'contentObjectTransformRotateSnapXRoot' ||
    session.scopeId === 'contentObjectTransformRotateSnapYRoot' ||
    session.scopeId === 'contentObjectTransformRotateSnapZRoot' ||
    session.scopeId === 'contentObjectTransformScaleSnapXRoot' ||
    session.scopeId === 'contentObjectTransformScaleSnapYRoot' ||
    session.scopeId === 'contentObjectTransformScaleSnapZRoot'
  ) {
    const numericValue = parseReferenceTransformSnapValue(submittedToken)
    if (numericValue !== null) {
      const mode = getContentObjectTransformSnapModeFromScopeId(session.scopeId) ?? 'translate'
      const axis = getContentObjectTransformSnapAxisFromScopeId(session.scopeId) ?? 'x'
      const actionIdByModeAndAxis: Record<
        ReferenceTransformSnapMode,
        Record<
          ReferenceTransformSnapAxis,
          Extract<
            ConsoleStagedNavigationExecuteResult['actionId'],
            | 'content.transform.snap.translate.x.value'
            | 'content.transform.snap.translate.y.value'
            | 'content.transform.snap.translate.z.value'
            | 'content.transform.snap.rotate.x.value'
            | 'content.transform.snap.rotate.y.value'
            | 'content.transform.snap.rotate.z.value'
            | 'content.transform.snap.scale.x.value'
            | 'content.transform.snap.scale.y.value'
            | 'content.transform.snap.scale.z.value'
          >
        >
      > = {
        translate: {
          x: 'content.transform.snap.translate.x.value',
          y: 'content.transform.snap.translate.y.value',
          z: 'content.transform.snap.translate.z.value',
        },
        rotate: {
          x: 'content.transform.snap.rotate.x.value',
          y: 'content.transform.snap.rotate.y.value',
          z: 'content.transform.snap.rotate.z.value',
        },
        scale: {
          x: 'content.transform.snap.scale.x.value',
          y: 'content.transform.snap.scale.y.value',
          z: 'content.transform.snap.scale.z.value',
        },
      }
      return {
        kind: 'execute',
        session: { ...session, validChoices: [] },
        submittedToken,
        matchedChoice: {
          canonicalToken: String(numericValue),
          aliases: [],
          label: String(numericValue),
          kind: 'action',
        },
        actionId: actionIdByModeAndAxis[mode][axis],
        breadcrumb: [...session.breadcrumb, String(numericValue)],
        selections: session.selections,
      }
    }
    if (normalizedToken === 'BACK' || normalizedToken === 'B') {
      const mode = getContentObjectTransformSnapModeFromScopeId(session.scopeId) ?? 'translate'
      const modeLabel = mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'
      const activeObjectId = session.selections.contentObjectId ?? null
      const nextSession = createContentObjectTransformModeSnapRootSession(
        mode === 'translate'
          ? 'contentObjectTransformMoveSnapRoot'
          : mode === 'rotate'
            ? 'contentObjectTransformRotateSnapRoot'
            : 'contentObjectTransformScaleSnapRoot',
        mode,
        modeLabel,
        extractContentBreadcrumbLabels(session.breadcrumb, 5),
        session.selections.graphDocumentId,
        activeObjectId,
        activeObjectId === null
          ? true
          : isContentObjectTransformSnapModeLocked(context, activeObjectId, mode),
        activeObjectId === null
          ? false
          : isContentObjectTransformSnapModeEnabled(context, activeObjectId, mode),
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice: createBackChoice(),
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
  }

  if (session.scopeId === 'multiSelectSelected') {
    const multiSelectChoices = buildMultiSelectSelectedChoices(
      session.selections.multiSelectCanDelete ?? false,
      session.selections.multiSelectCanHide ?? false,
      session.selections.multiSelectCanUnhide ?? false,
    )
    const matchedChoice =
      multiSelectChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: multiSelectChoices },
        submittedToken,
        multiSelectChoices,
      )
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        {
          scopeId: 'multiSelectZoomRoot',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
          validChoices: buildZoomActionChoices(),
        },
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.canonicalToken === UNHIDE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: multiSelectChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.multiUnhide',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === HIDE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: multiSelectChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.multiHide',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === DELETE_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: multiSelectChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.multiDelete',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
  }

  if (session.scopeId === 'multiSelectZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createMultiSelectSelectedSession(
          session.selections.multiSelectLabels ?? [],
          session.selections.multiSelectCanDelete ?? false,
          session.selections.multiSelectReferenceDeleteIds ?? [],
          session.selections.multiSelectCanHide ?? false,
          session.selections.multiSelectReferenceHideIds ?? [],
          session.selections.multiSelectCanUnhide ?? false,
          session.selections.multiSelectReferenceUnhideIds ?? [],
        ),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'referencesSelected') {
    const referencesChoices = session.validChoices
    const matchedChoice =
      referencesChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: referencesChoices },
        submittedToken,
        referencesChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferencesZoomRootSession(
          session.breadcrumb.at(-1) ?? 'References',
          session.selections.referenceZoomIds ?? [],
        ),
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.kind === 'scope' && typeof matchedChoice.referenceCategoryId === 'string') {
      const matchedCategory = context.referenceCategories.find(
        (category) => category.categoryId === matchedChoice.referenceCategoryId,
      )
      return createAdvanceResult(
        createReferenceCategorySelectedSession(
          session.breadcrumb.at(-1) ?? 'References',
          matchedChoice.referenceCategoryId,
          matchedChoice.label,
          matchedCategory?.items.map((item) => ({
            referenceId: item.referenceId,
            label: item.label,
          })) ?? [],
          matchedCategory?.canLoadAll ?? true,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: referencesChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: 'reference.loadAll',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'referenceHideRoot') {
    const hideChoices = buildReferenceHideRootChoices(context.referenceCategories)
    const matchedChoice =
      hideChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: hideChoices }, submittedToken, hideChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    if (typeof matchedChoice.referenceId === 'string') {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: hideChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.hide',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: {
          ...session.selections,
          referenceId: matchedChoice.referenceId,
          referenceCategoryId: matchedChoice.referenceCategoryId ?? null,
        },
      }
    }
    return createInvalidResult({ ...session, validChoices: hideChoices }, submittedToken, hideChoices)
  }

  if (session.scopeId === 'referencesZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createReferencesSelectedSession(
          session.breadcrumb.at(-2) ?? 'References',
          context.referenceCategories,
          context.referenceCategories.some((category) => category.canLoadAll),
          session.selections.referenceZoomIds ?? [],
        ),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'referenceCategorySelected') {
    const categoryChoices = session.validChoices
    const matchedChoice =
      categoryChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: categoryChoices },
        submittedToken,
        categoryChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createReferencesSelectedSession(
          session.breadcrumb[1] ?? 'References',
          context.referenceCategories,
          context.referenceCategories.some((category) => category.canLoadAll),
          context.referenceCategories.flatMap((category) =>
            category.items.map((item) => item.referenceId),
          ),
        ),
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferenceCategoryZoomRootSession(
          session.breadcrumb[1] ?? 'References',
          session.selections.referenceCategoryId ?? '',
          session.breadcrumb.at(-1) ?? 'Category',
          session.selections.referenceZoomIds ?? [],
        ),
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.kind === 'scope' && typeof matchedChoice.referenceId === 'string') {
      const matchedCategory = context.referenceCategories.find(
        (category) => category.categoryId === session.selections.referenceCategoryId,
      )
      const matchedItem =
        matchedCategory?.items.find((item) => item.referenceId === matchedChoice.referenceId) ?? null
      return createAdvanceResult(
        createReferenceSelectedSession(
          matchedChoice.label,
          matchedChoice.referenceId,
          matchedItem?.canLoadModel ?? true,
          matchedItem?.canDelete ?? false,
          matchedItem?.canHide ?? false,
          matchedItem?.canExplode ?? false,
          session.selections.referenceCategoryId ?? null,
          session.breadcrumb.at(-1) ?? null,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: categoryChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: 'reference.category.loadAll',
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'referenceCategoryZoomRoot') {
    const zoomChoices = buildZoomActionChoices()
    const matchedChoice =
      zoomChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult({ ...session, validChoices: zoomChoices }, submittedToken, zoomChoices)
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      return createAdvanceResult(
        createReferenceCategorySelectedSession(
          session.breadcrumb[1] ?? 'References',
          session.selections.referenceCategoryId ?? '',
          session.breadcrumb.at(-2) ?? 'Category',
          (session.selections.referenceZoomIds ?? []).map((referenceId) => ({
            referenceId,
            label:
              context.referenceCategories
                .flatMap((category) => category.items)
                .find((item) => item.referenceId === referenceId)?.label ?? referenceId,
          })),
          context.referenceCategories.find(
            (category) => category.categoryId === session.selections.referenceCategoryId,
          )?.canLoadAll ?? true,
        ),
        submittedToken,
        matchedChoice,
      )
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

  if (session.scopeId === 'referenceSelected') {
    const referenceChoices = buildReferenceSelectedChoices(
      session.selections.referenceCanLoadModel ?? false,
      session.selections.referenceCanDelete ?? false,
      session.selections.referenceCanHide ?? false,
      session.selections.referenceCanExplode ?? false,
    )
    const matchedChoice =
      referenceChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: referenceChoices },
        submittedToken,
        referenceChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      if (session.selections.referenceCategoryId !== null) {
        const matchedCategory = context.referenceCategories.find(
          (category) => category.categoryId === session.selections.referenceCategoryId,
        )
        if (matchedCategory !== undefined) {
          return createAdvanceResult(
            createReferenceCategorySelectedSession(
              'References',
              matchedCategory.categoryId,
              matchedCategory.label,
              matchedCategory.items.map((item) => ({
                referenceId: item.referenceId,
                label: item.label,
              })),
              matchedCategory.canLoadAll,
            ),
            submittedToken,
            matchedChoice,
          )
        }
      }
      return createAdvanceResult(createConsoleRootSession(), submittedToken, matchedChoice)
    }
    if (matchedChoice.canonicalToken === ROOT_ZOOM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        {
          scopeId: 'referenceZoomRoot',
          breadcrumb: [...session.breadcrumb, matchedChoice.label],
          selections: session.selections,
          validChoices: buildZoomActionChoices(),
        },
        submittedToken,
        matchedChoice,
      )
    }
    if (matchedChoice.canonicalToken === TRANSFORM_CHOICE.canonicalToken) {
      return createAdvanceResult(
        createReferenceTransformRootSession(
          context,
          session.breadcrumb.at(-1) ?? 'Reference',
          session.selections.referenceId ?? '',
          session.selections.referenceCategoryId ?? null,
          session.selections.referenceCategoryId !== null ? (session.breadcrumb.at(-2) ?? null) : null,
        ),
        submittedToken,
        matchedChoice,
      )
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        | 'reference.loadModel'
        | 'reference.explode'
        | 'reference.delete'
        | 'reference.hide'
        | 'reference.transform.move'
        | 'reference.transform.rotate'
        | 'reference.transform.scale'
      >
    > = {
      'LOAD MODEL': 'reference.loadModel',
      EXPLODE: 'reference.explode',
      DELETE: 'reference.delete',
      HIDE: 'reference.hide',
      MOVE: 'reference.transform.move',
      ROTATE: 'reference.transform.rotate',
      SCALE: 'reference.transform.scale',
    }
    const transformRootSession = createReferenceTransformRootSession(
      context,
      session.breadcrumb.at(-1) ?? 'Reference',
      session.selections.referenceId ?? '',
      session.selections.referenceCategoryId ?? null,
      session.selections.referenceCategoryId !== null ? (session.breadcrumb.at(-2) ?? null) : null,
    )
    const useTransformRootSession =
      matchedChoice.canonicalToken === MOVE_CHOICE.canonicalToken ||
      matchedChoice.canonicalToken === ROTATE_CHOICE.canonicalToken ||
      matchedChoice.canonicalToken === SCALE_CHOICE.canonicalToken
    const executeBreadcrumb = useTransformRootSession
      ? [...transformRootSession.breadcrumb, matchedChoice.label]
      : [...session.breadcrumb, matchedChoice.label]
    return {
      kind: 'execute',
      session: useTransformRootSession
        ? transformRootSession
        : {
            ...session,
            validChoices: referenceChoices,
          },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: executeBreadcrumb,
      selections: session.selections,
    }
  }

  if (session.scopeId === 'referenceTransformRoot') {
    const transformChoices = buildReferenceTransformRootChoices(
      hasAnyCommittedEntriesInReferenceTransformHistory(context, session.selections.referenceId ?? ''),
    )
    if (normalizedToken === SPACE_CHOICE.canonicalToken || normalizedToken === 'SP') {
      const nextSession = createReferenceTransformSpaceRootSession(
        session.breadcrumb.at(-2) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-3) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice: SPACE_CHOICE,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    if (normalizedToken === LOCAL_CHOICE.canonicalToken || normalizedToken === 'L') {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: transformChoices,
        },
        submittedToken,
        matchedChoice: LOCAL_CHOICE,
        actionId: 'reference.transform.space.local',
        breadcrumb: [...session.breadcrumb, 'Settings', 'Space', LOCAL_CHOICE.label],
        selections: session.selections,
      }
    }
    if (normalizedToken === WORLD_CHOICE.canonicalToken || normalizedToken === 'W') {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: transformChoices,
        },
        submittedToken,
        matchedChoice: WORLD_CHOICE,
        actionId: 'reference.transform.space.world',
        breadcrumb: [...session.breadcrumb, 'Settings', 'Space', WORLD_CHOICE.label],
        selections: session.selections,
      }
    }
    const matchedChoice =
      transformChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: transformChoices },
        submittedToken,
        transformChoices,
      )
    }
    if (matchedChoice.canonicalToken === COMMIT_TRANSFORM_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: transformChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.transform.commitShell',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === DELETE_LATEST_TRANSFORM_CHOICE.canonicalToken) {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: transformChoices,
        },
        submittedToken,
        matchedChoice,
        actionId: 'reference.transform.deleteLatest',
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (matchedChoice.canonicalToken === SETTINGS_CHOICE.canonicalToken) {
      const nextSession = createReferenceTransformSettingsRootSession(
        session.breadcrumb.at(-2) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-3) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    if (matchedChoice.canonicalToken === SNAP_CHOICE.canonicalToken) {
      const nextSession = createReferenceTransformSnapRootSession(
        session.breadcrumb.at(-2) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-3) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        | 'reference.transform.move'
        | 'reference.transform.rotate'
        | 'reference.transform.scale'
      >
    > = {
      MOVE: 'reference.transform.move',
      ROTATE: 'reference.transform.rotate',
      SCALE: 'reference.transform.scale',
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: transformChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'referenceTransformSettingsRoot') {
    const settingsChoices = buildReferenceTransformSettingsChoices()
    if (normalizedToken === LOCAL_CHOICE.canonicalToken || normalizedToken === 'L') {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: settingsChoices,
        },
        submittedToken,
        matchedChoice: LOCAL_CHOICE,
        actionId: 'reference.transform.space.local',
        breadcrumb: [...session.breadcrumb, 'Space', LOCAL_CHOICE.label],
        selections: session.selections,
      }
    }
    if (normalizedToken === WORLD_CHOICE.canonicalToken || normalizedToken === 'W') {
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: settingsChoices,
        },
        submittedToken,
        matchedChoice: WORLD_CHOICE,
        actionId: 'reference.transform.space.world',
        breadcrumb: [...session.breadcrumb, 'Space', WORLD_CHOICE.label],
        selections: session.selections,
      }
    }
    const matchedChoice =
      settingsChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: settingsChoices },
        submittedToken,
        settingsChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createReferenceTransformRootSession(
        context,
        session.breadcrumb.at(-3) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-4) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const nextSession =
      matchedChoice.canonicalToken === SNAP_CHOICE.canonicalToken
        ? createReferenceTransformSnapRootSession(
            session.breadcrumb.at(-3) ?? session.selections.referenceId ?? 'Reference',
            session.selections.referenceId ?? '',
            session.selections.referenceCategoryId ?? null,
            session.breadcrumb.at(-4) ?? null,
          )
        : createReferenceTransformSpaceRootSession(
            session.breadcrumb.at(-3) ?? session.selections.referenceId ?? 'Reference',
            session.selections.referenceId ?? '',
            session.selections.referenceCategoryId ?? null,
            session.breadcrumb.at(-4) ?? null,
          )
    return {
      kind: 'advance',
      session: nextSession,
      submittedToken,
      matchedChoice,
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      validChoices: nextSession.validChoices,
      selections: nextSession.selections,
      autoSelections: [],
    }
  }

  if (session.scopeId === 'referenceTransformSpaceRoot') {
    const spaceChoices = buildReferenceTransformSpaceChoices()
    const matchedChoice =
      spaceChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: spaceChoices },
        submittedToken,
        spaceChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createReferenceTransformSettingsRootSession(
        session.breadcrumb.at(-4) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-5) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const actionIdByToken: Record<
      string,
      Extract<
        ConsoleStagedNavigationExecuteResult['actionId'],
        'reference.transform.space.local' | 'reference.transform.space.world'
      >
    > = {
      LOCAL: 'reference.transform.space.local',
      WORLD: 'reference.transform.space.world',
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: spaceChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByToken[matchedChoice.canonicalToken],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (session.scopeId === 'referenceTransformSnapRoot') {
    const snapChoices = buildReferenceTransformSnapChoices()
    const matchedChoice =
      snapChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: snapChoices },
        submittedToken,
        snapChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createReferenceTransformSettingsRootSession(
        session.breadcrumb.at(-4) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-5) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const nextSession = createReferenceTransformSnapModeSessionByToken(
      context,
      matchedChoice.canonicalToken,
      session.breadcrumb.at(-4) ?? session.selections.referenceId ?? 'Reference',
      session.selections.referenceId ?? '',
      session.selections.referenceCategoryId ?? null,
      session.breadcrumb.at(-5) ?? null,
    )
    return {
      kind: 'advance',
      session: nextSession,
      submittedToken,
      matchedChoice,
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      validChoices: nextSession.validChoices,
      selections: nextSession.selections,
      autoSelections: [],
    }
  }

  if (
    session.scopeId === 'referenceTransformMoveSnapRoot' ||
    session.scopeId === 'referenceTransformRotateSnapRoot' ||
    session.scopeId === 'referenceTransformScaleSnapRoot'
  ) {
    const mode = getReferenceTransformSnapModeFromScopeId(session.scopeId) ?? 'translate'
    const modeChoices = buildReferenceTransformSnapModeChoices(
      mode,
      isReferenceTransformSnapModeLocked(context, session.selections.referenceId ?? '', mode),
      isReferenceTransformSnapModeEnabled(context, session.selections.referenceId ?? '', mode),
    )
    const numericValue = parseReferenceTransformSnapValue(submittedToken)
    if (numericValue !== null) {
      const actionIdByMode: Record<
        'translate' | 'rotate' | 'scale',
        Extract<
          ConsoleStagedNavigationExecuteResult['actionId'],
          | 'reference.transform.snap.translate.value'
          | 'reference.transform.snap.rotate.value'
          | 'reference.transform.snap.scale.value'
        >
      > = {
        translate: 'reference.transform.snap.translate.value',
        rotate: 'reference.transform.snap.rotate.value',
        scale: 'reference.transform.snap.scale.value',
      }
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: modeChoices,
        },
        submittedToken,
        matchedChoice: {
          canonicalToken: String(numericValue),
          aliases: [],
          label: String(numericValue),
          kind: 'action',
        },
        actionId: actionIdByMode[mode],
        breadcrumb: [...session.breadcrumb, String(numericValue)],
        selections: session.selections,
      }
    }
    const matchedChoice =
      modeChoices.find((choice) => matchesChoice(choice, normalizedToken)) ?? null
    if (matchedChoice === null) {
      return createInvalidResult(
        { ...session, validChoices: modeChoices },
        submittedToken,
        modeChoices,
      )
    }
    if (matchedChoice.canonicalToken === 'BACK') {
      const nextSession = createReferenceTransformSnapRootSession(
        session.breadcrumb.at(-5) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-6) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    if (
      matchedChoice.canonicalToken === 'SNAPXYZ:LOCK' ||
      matchedChoice.canonicalToken === 'SNAPXYZ:UNLOCK'
    ) {
      const actionIdByModeAndToken: Record<
        ReferenceTransformSnapMode,
        Record<
          'SNAPXYZ:LOCK' | 'SNAPXYZ:UNLOCK',
          Extract<
            ConsoleStagedNavigationExecuteResult['actionId'],
            | 'reference.transform.snap.translate.lock'
            | 'reference.transform.snap.translate.unlock'
            | 'reference.transform.snap.rotate.lock'
            | 'reference.transform.snap.rotate.unlock'
            | 'reference.transform.snap.scale.lock'
            | 'reference.transform.snap.scale.unlock'
          >
        >
      > = {
        translate: {
          'SNAPXYZ:LOCK': 'reference.transform.snap.translate.lock',
          'SNAPXYZ:UNLOCK': 'reference.transform.snap.translate.unlock',
        },
        rotate: {
          'SNAPXYZ:LOCK': 'reference.transform.snap.rotate.lock',
          'SNAPXYZ:UNLOCK': 'reference.transform.snap.rotate.unlock',
        },
        scale: {
          'SNAPXYZ:LOCK': 'reference.transform.snap.scale.lock',
          'SNAPXYZ:UNLOCK': 'reference.transform.snap.scale.unlock',
        },
      }
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: modeChoices,
        },
        submittedToken,
        matchedChoice,
        actionId:
          actionIdByModeAndToken[mode][
            matchedChoice.canonicalToken as 'SNAPXYZ:LOCK' | 'SNAPXYZ:UNLOCK'
          ],
        breadcrumb: [...session.breadcrumb, matchedChoice.label],
        selections: session.selections,
      }
    }
    if (
      matchedChoice.canonicalToken.endsWith(' X') ||
      matchedChoice.canonicalToken.endsWith(' Y') ||
      matchedChoice.canonicalToken.endsWith(' Z')
    ) {
      const axis =
        matchedChoice.canonicalToken.endsWith(' X')
          ? 'x'
          : matchedChoice.canonicalToken.endsWith(' Y')
            ? 'y'
            : 'z'
      const nextSession = createReferenceTransformSnapAxisSession(
        mode,
        axis,
        session.breadcrumb.at(-5) ?? session.selections.referenceId ?? 'Reference',
        session.selections.referenceId ?? '',
        session.selections.referenceCategoryId ?? null,
        session.breadcrumb.at(-6) ?? null,
      )
      return {
        kind: 'advance',
        session: nextSession,
        submittedToken,
        matchedChoice,
        breadcrumb: nextSession.breadcrumb,
        validChoices: nextSession.validChoices,
        selections: nextSession.selections,
        autoSelections: [],
      }
    }
    const actionIdByModeAndToken: Record<
      'translate' | 'rotate' | 'scale',
      Record<
        'ON' | 'OFF',
        Extract<
          ConsoleStagedNavigationExecuteResult['actionId'],
          | 'reference.transform.snap.translate.on'
          | 'reference.transform.snap.translate.off'
          | 'reference.transform.snap.rotate.on'
          | 'reference.transform.snap.rotate.off'
          | 'reference.transform.snap.scale.on'
          | 'reference.transform.snap.scale.off'
        >
      >
    > = {
      translate: {
        ON: 'reference.transform.snap.translate.on',
        OFF: 'reference.transform.snap.translate.off',
      },
      rotate: {
        ON: 'reference.transform.snap.rotate.on',
        OFF: 'reference.transform.snap.rotate.off',
      },
      scale: {
        ON: 'reference.transform.snap.scale.on',
        OFF: 'reference.transform.snap.scale.off',
      },
    }
    return {
      kind: 'execute',
      session: {
        ...session,
        validChoices: modeChoices,
      },
      submittedToken,
      matchedChoice,
      actionId: actionIdByModeAndToken[mode][matchedChoice.canonicalToken as 'ON' | 'OFF'],
      breadcrumb: [...session.breadcrumb, matchedChoice.label],
      selections: session.selections,
    }
  }

  if (
    session.scopeId === 'referenceTransformMoveSnapXRoot' ||
    session.scopeId === 'referenceTransformMoveSnapYRoot' ||
    session.scopeId === 'referenceTransformMoveSnapZRoot' ||
    session.scopeId === 'referenceTransformRotateSnapXRoot' ||
    session.scopeId === 'referenceTransformRotateSnapYRoot' ||
    session.scopeId === 'referenceTransformRotateSnapZRoot' ||
    session.scopeId === 'referenceTransformScaleSnapXRoot' ||
    session.scopeId === 'referenceTransformScaleSnapYRoot' ||
    session.scopeId === 'referenceTransformScaleSnapZRoot'
  ) {
    const numericValue = parseReferenceTransformSnapValue(submittedToken)
    if (numericValue !== null) {
      const mode = getReferenceTransformSnapModeFromScopeId(session.scopeId) ?? 'translate'
      const axis = getReferenceTransformSnapAxisFromScopeId(session.scopeId) ?? 'x'
      const actionIdByModeAndAxis: Record<
        ReferenceTransformSnapMode,
        Record<
          ReferenceTransformSnapAxis,
          Extract<
            ConsoleStagedNavigationExecuteResult['actionId'],
            | 'reference.transform.snap.translate.x.value'
            | 'reference.transform.snap.translate.y.value'
            | 'reference.transform.snap.translate.z.value'
            | 'reference.transform.snap.rotate.x.value'
            | 'reference.transform.snap.rotate.y.value'
            | 'reference.transform.snap.rotate.z.value'
            | 'reference.transform.snap.scale.x.value'
            | 'reference.transform.snap.scale.y.value'
            | 'reference.transform.snap.scale.z.value'
          >
        >
      > = {
        translate: {
          x: 'reference.transform.snap.translate.x.value',
          y: 'reference.transform.snap.translate.y.value',
          z: 'reference.transform.snap.translate.z.value',
        },
        rotate: {
          x: 'reference.transform.snap.rotate.x.value',
          y: 'reference.transform.snap.rotate.y.value',
          z: 'reference.transform.snap.rotate.z.value',
        },
        scale: {
          x: 'reference.transform.snap.scale.x.value',
          y: 'reference.transform.snap.scale.y.value',
          z: 'reference.transform.snap.scale.z.value',
        },
      }
      return {
        kind: 'execute',
        session: {
          ...session,
          validChoices: [createBackChoice()],
        },
        submittedToken,
        matchedChoice: {
          canonicalToken: String(numericValue),
          aliases: [],
          label: String(numericValue),
          kind: 'action',
        },
        actionId: actionIdByModeAndAxis[mode][axis],
        breadcrumb: [...session.breadcrumb, String(numericValue)],
        selections: session.selections,
      }
    }
    const backChoice = createBackChoice()
    if (!matchesChoice(backChoice, normalizedToken)) {
      return createInvalidResult(
        { ...session, validChoices: [backChoice] },
        submittedToken,
        [backChoice],
      )
    }
    const mode = getReferenceTransformSnapModeFromScopeId(session.scopeId) ?? 'translate'
    const modeLabel = mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'
    const nextSession = createReferenceTransformModeSnapRootSession(
      mode === 'translate'
        ? 'referenceTransformMoveSnapRoot'
        : mode === 'rotate'
          ? 'referenceTransformRotateSnapRoot'
          : 'referenceTransformScaleSnapRoot',
      mode,
      modeLabel,
      session.breadcrumb.at(-6) ?? session.selections.referenceId ?? 'Reference',
      session.selections.referenceId ?? '',
      isReferenceTransformSnapModeLocked(context, session.selections.referenceId ?? '', mode),
      isReferenceTransformSnapModeEnabled(context, session.selections.referenceId ?? '', mode),
      session.selections.referenceCategoryId ?? null,
      session.breadcrumb.at(-7) ?? null,
    )
    return {
      kind: 'advance',
      session: nextSession,
      submittedToken,
      matchedChoice: backChoice,
      breadcrumb: nextSession.breadcrumb,
      validChoices: nextSession.validChoices,
      selections: nextSession.selections,
      autoSelections: [],
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
