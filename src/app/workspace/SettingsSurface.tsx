import { useMemo, useState, type CSSProperties } from 'react'
import { readGraphBrowserStoragePolicy } from '../spaghetti/store/graphBrowserStoragePersistence'
import { readRecentItemsPolicy } from '../recentItems/recentItemsPersistence'
import { readPubPartsDownloadsStorage } from '../catalog/pubPartsDownloadsStorage'
import { ParaSelect } from '../components/ParaSelect'
import { ParaSlider } from '../components/ParaSlider'
import {
  defaultSpaghettiWindowAppearance,
  spaghettiWindowSliderBounds,
  type SpaghettiWindowAppearance,
} from '../panels/spaghettiWindowAppearance'
import {
  setConsoleInputPriorityModeWithHistory,
  setSpaghettiWindowAppearanceDefaultsWithHistory,
  setWorkspacePanelShellPaddingWithHistory,
  setWorkspacePaneFilletRadiusWithHistory,
  setWorkspaceNestedResizeKeepsFarPaneWithHistory,
} from '../store/uiPreferenceEditHistory'
import {
  DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX,
  DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX,
  MAX_WORKSPACE_PANEL_SHELL_PADDING_PX,
  MAX_WORKSPACE_PANE_FILLET_RADIUS_PX,
  MIN_WORKSPACE_PANEL_SHELL_PADDING_PX,
  MIN_WORKSPACE_PANE_FILLET_RADIUS_PX,
  type ConsoleInputPriorityMode,
  useUiPrefsStore,
} from '../store/uiPrefsStore'
import { WorkspacePanelSplitShell } from './WorkspacePanelSplitShell'
import { useWorkspaceStore } from './useWorkspaceStore'
import type { WorkspaceViewportSlotId } from './workspaceShellTypes'

export type SettingsSectionId =
  | 'all'
  | 'general'
  | 'keyBindings'
  | 'workspace'
  | 'viewport'
  | 'spaghettiEditor'
  | 'browser'
  | 'storage'

type SettingsSection = {
  id: SettingsSectionId
  label: string
  eyebrow: string
  description: string
}

type SettingsRow = {
  id: string
  label: string
  value: string
  description: string
  sectionIds: Exclude<SettingsSectionId, 'all'>[]
}

const settingsSections: readonly SettingsSection[] = [
  {
    id: 'all',
    label: 'All',
    eyebrow: 'Overview',
    description: 'Read-only phase 1 shell showing the current workspace settings surface.',
  },
  {
    id: 'general',
    label: 'General',
    eyebrow: 'Startup',
    description: 'Entry preference and persistence defaults.',
  },
  {
    id: 'keyBindings',
    label: 'Key Bindings',
    eyebrow: 'Shortcuts',
    description: 'Shortcut behavior and the future mode-aware shortcut reference.',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    eyebrow: 'Layout',
    description: 'Workspace shell behavior and dock sizing.',
  },
  {
    id: 'viewport',
    label: 'Viewport',
    eyebrow: 'View',
    description: 'Current view and projection state.',
  },
  {
    id: 'spaghettiEditor',
    label: 'Spaghetti Editor',
    eyebrow: 'Defaults',
    description: 'Window appearance defaults that seed new Spaghetti Editor windows.',
  },
  {
    id: 'browser',
    label: 'Browser',
    eyebrow: 'Dock',
    description: 'Browser shell presentation controls.',
  },
  {
    id: 'storage',
    label: 'Storage',
    eyebrow: 'Persistence',
    description: 'Stored working-set and content ownership toggles.',
  },
] as const

const settingsSectionsById = new Map(settingsSections.map((section) => [section.id, section]))
const settingsContentSections = settingsSections.filter((section) => section.id !== 'all')

const titlebarTintOptions: Array<{
  value: SpaghettiWindowAppearance['titlebarTint']
  label: string
}> = [
  { value: 'default', label: 'Default' },
  { value: 'slate', label: 'Slate' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
]

const bodyTintOptions: Array<{
  value: SpaghettiWindowAppearance['bodyTint']
  label: string
}> = [
  { value: 'default', label: 'Default' },
  { value: 'cool-dark', label: 'Cool Dark' },
  { value: 'neutral-dark', label: 'Neutral Dark' },
  { value: 'glass-dark', label: 'Glass Dark' },
]

const fontScaleOptions: Array<{
  value: SpaghettiWindowAppearance['fontScale']
  label: string
}> = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Normal' },
  { value: 'lg', label: 'Large' },
]

const fontFamilyOptions: Array<{
  value: SpaghettiWindowAppearance['fontFamily']
  label: string
}> = [
  { value: 'default', label: 'Default' },
  { value: 'mono', label: 'Mono' },
  { value: 'serif', label: 'Serif' },
]

const paddingScaleOptions: Array<{
  value: SpaghettiWindowAppearance['paddingScale']
  label: string
}> = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'loose', label: 'Loose' },
]

const formatOnOff = (value: boolean): string => (value ? 'On' : 'Off')

const formatStartupSurface = (value: 'homePage' | 'modelViewer'): string =>
  value === 'modelViewer' ? 'Model Viewport' : 'Home Page'

const formatConsoleInputPriorityMode = (value: ConsoleInputPriorityMode): string =>
  value === 'shortcuts-first' ? 'Shortcuts first' : 'Console first'

const formatProjectionMode = (value: string): string =>
  value === 'orthographic' ? 'Orthographic' : 'Perspective'

const formatBrowserPresentationMode = (value: string): string =>
  value === 'collapsed'
    ? 'Collapsed'
    : value === 'essentials'
      ? 'Essentials'
      : 'Expanded'

const formatLibraryStatus = (value: string): string =>
  value === 'enabled' ? 'Connected' : value === 'disabled' ? 'Disabled' : 'Not configured'

const buildSettingsRows = (options: {
  workspaceStartupSurface: 'homePage' | 'modelViewer'
  consoleInputPriorityMode: ConsoleInputPriorityMode
  workspaceRestorePersistence: boolean
  viewSettingsPersistence: boolean
  environmentPersistence: boolean
  dashboardPersistence: boolean
  notepadPersistence: boolean
  leftDockWidth: number
  projectionMode: string
  axisOverlayEnabled: boolean
  browserPresentationMode: string
  browserIsFloating: boolean
  browserIsViewportSplit: boolean
  workspacePaneFilletRadiusPx: number
  workspacePanelShellPaddingPx: number
  workspaceNestedResizeKeepsFarPane: boolean
}): readonly SettingsRow[] => [
  {
    id: 'startup-surface',
    label: 'Startup surface',
    value: formatStartupSurface(options.workspaceStartupSurface),
    description: 'Where the workspace opens first.',
    sectionIds: ['general'],
  },
  {
    id: 'console-input-priority',
    label: 'Console input priority',
    value: formatConsoleInputPriorityMode(options.consoleInputPriorityMode),
    description:
      'Console first types plain letters into Console and uses Shift+letter shortcuts; Shortcuts first lets letters trigger shortcuts and uses C to enter Console.',
    sectionIds: ['keyBindings'],
  },
  {
    id: 'workspace-restore',
    label: 'Workspace restore',
    value: formatOnOff(options.workspaceRestorePersistence),
    description: 'Keeps the workspace layout persistence bridge on.',
    sectionIds: ['general', 'workspace'],
  },
  {
    id: 'view-settings',
    label: 'View settings persistence',
    value: formatOnOff(options.viewSettingsPersistence),
    description: 'Persists projection and viewport view defaults.',
    sectionIds: ['general', 'viewport'],
  },
  {
    id: 'environment-persistence',
    label: 'Environment persistence',
    value: formatOnOff(options.environmentPersistence),
    description: 'Persists the current environment look and HDRI source.',
    sectionIds: ['general', 'viewport', 'storage'],
  },
  {
    id: 'left-dock-width',
    label: 'Left dock width',
    value: `${Math.round(options.leftDockWidth)} px`,
    description: 'Current workspace shell dock width.',
    sectionIds: ['workspace'],
  },
  {
    id: 'workspace-corner-radius',
    label: 'Workspace corner radius',
    value: `${Math.round(options.workspacePaneFilletRadiusPx)} px`,
    description: 'Shared fillet radius used by the split-corner pane shell.',
    sectionIds: ['workspace'],
  },
  {
    id: 'workspace-panel-shell-padding',
    label: 'Workspace panel shell padding',
    value: `${Math.round(options.workspacePanelShellPaddingPx)} px`,
    description: 'Outer gutter around shared Settings and Properties panel shells.',
    sectionIds: ['workspace'],
  },
  {
    id: 'workspace-nested-resize',
    label: 'Keep far pane fixed on nested resize',
    value: formatOnOff(options.workspaceNestedResizeKeepsFarPane),
    description:
      'When resizing a divider beside a same-direction nested split, keep the outer pane fixed and resize only the adjacent pane.',
    sectionIds: ['workspace'],
  },
  {
    id: 'dashboard-persistence',
    label: 'Dashboard persistence',
    value: formatOnOff(options.dashboardPersistence),
    description: 'Keeps dashboard cards and layout state between sessions.',
    sectionIds: ['workspace', 'storage'],
  },
  {
    id: 'notepad-persistence',
    label: 'Notepad persistence',
    value: formatOnOff(options.notepadPersistence),
    description: 'Keeps notepad notes and selection state between sessions.',
    sectionIds: ['workspace', 'storage'],
  },
  {
    id: 'projection-mode',
    label: 'Projection mode',
    value: formatProjectionMode(options.projectionMode),
    description: 'Current viewport projection setting.',
    sectionIds: ['viewport'],
  },
  {
    id: 'axis-overlay',
    label: 'Axis overlay',
    value: formatOnOff(options.axisOverlayEnabled),
    description: 'Shows the viewport axis overlay.',
    sectionIds: ['viewport'],
  },
  {
    id: 'browser-presentation',
    label: 'Browser presentation',
    value: formatBrowserPresentationMode(options.browserPresentationMode),
    description: 'Browser shell presentation mode.',
    sectionIds: ['browser'],
  },
  {
    id: 'browser-floating',
    label: 'Browser floating',
    value: formatOnOff(options.browserIsFloating),
    description: 'Whether the browser shell is detached into a floating window.',
    sectionIds: ['browser'],
  },
  {
    id: 'browser-split',
    label: 'Browser viewport split',
    value: formatOnOff(options.browserIsViewportSplit),
    description: 'Whether the browser shell is split into the viewport.',
    sectionIds: ['browser'],
  },
  {
    id: 'graph-working-set',
    label: 'Graph working set',
    value: formatOnOff(readGraphBrowserStoragePolicy().rememberGraphWorkingSet),
    description: 'Keeps the graph working set remembered across sessions.',
    sectionIds: ['storage'],
  },
  {
    id: 'recent-items',
    label: 'Recent items',
    value: formatOnOff(readRecentItemsPolicy().rememberRecentItems),
    description: 'Keeps recent items remembered across sessions.',
    sectionIds: ['storage'],
  },
  {
    id: 'pubparts-library',
    label: 'PubParts library',
    value: formatLibraryStatus(readPubPartsDownloadsStorage().library.status),
    description: 'Current PubParts local library mirror state.',
    sectionIds: ['storage'],
  },
]

type SettingsSurfaceProps = {
  slotId?: WorkspaceViewportSlotId
  surfaceInstanceId: string
  initialSectionId?: SettingsSectionId
}

export function SettingsSurface(props: SettingsSurfaceProps) {
  const { slotId, surfaceInstanceId, initialSectionId = 'all' } = props
  const [activeSectionState, setActiveSectionState] = useState<{
    surfaceInstanceId: string
    initialSectionId: SettingsSectionId
    activeSectionId: SettingsSectionId
  }>(() => ({
    surfaceInstanceId,
    initialSectionId,
    activeSectionId: initialSectionId,
  }))
  const spaghettiWindowAppearanceDefaults = useUiPrefsStore(
    (state) => state.spaghettiWindowAppearanceDefaults,
  )
  const workspaceStartupSurface = useUiPrefsStore((state) => state.workspaceStartupSurface)
  const consoleInputPriorityMode = useUiPrefsStore((state) => state.consoleInputPriorityMode)
  const workspaceRestorePersistence = useUiPrefsStore(
    (state) => state.workspaceRestorePersistence,
  )
  const workspacePaneFilletRadiusPx = useUiPrefsStore((state) => state.workspacePaneFilletRadiusPx)
  const workspacePanelShellPaddingPx = useUiPrefsStore(
    (state) => state.workspacePanelShellPaddingPx,
  )
  const workspaceNestedResizeKeepsFarPane = useUiPrefsStore(
    (state) => state.workspaceNestedResizeKeepsFarPane,
  )
  const viewSettingsPersistence = useUiPrefsStore((state) => state.viewSettingsPersistence)
  const environmentPersistence = useUiPrefsStore((state) => state.environmentPersistence)
  const dashboardPersistence = useUiPrefsStore((state) => state.dashboardPersistence)
  const notepadPersistence = useUiPrefsStore((state) => state.notepadPersistence)
  const leftDockWidth = useWorkspaceStore((state) => state.leftDockWidth)
  const projectionMode = useUiPrefsStore((state) => state.view.projectionMode)
  const axisOverlayEnabled = useUiPrefsStore((state) => state.view.axisOverlayEnabled)
  const browserPresentationMode = useWorkspaceStore(
    (state) => state.browserShell.presentationMode,
  )
  const browserIsFloating = useWorkspaceStore((state) => state.browserShell.isFloating)
  const browserIsViewportSplit = useWorkspaceStore((state) => state.browserShell.isViewportSplit)

  const activeSectionId =
    activeSectionState.surfaceInstanceId === surfaceInstanceId &&
    activeSectionState.initialSectionId === initialSectionId
      ? activeSectionState.activeSectionId
      : initialSectionId

  const setActiveSectionId = (nextSectionId: SettingsSectionId) => {
    setActiveSectionState({
      surfaceInstanceId,
      initialSectionId,
      activeSectionId: nextSectionId,
    })
  }

  const updateSpaghettiWindowAppearanceDefaults = (
    patch: Partial<SpaghettiWindowAppearance>,
  ) => {
    setSpaghettiWindowAppearanceDefaultsWithHistory({
      ...spaghettiWindowAppearanceDefaults,
      ...patch,
    })
  }

  const resetSpaghettiWindowAppearanceDefaults = () => {
    setSpaghettiWindowAppearanceDefaultsWithHistory(defaultSpaghettiWindowAppearance)
  }

  const settingsRows = useMemo(
    () =>
      buildSettingsRows({
        workspaceStartupSurface,
        consoleInputPriorityMode,
        workspaceRestorePersistence,
        viewSettingsPersistence,
        environmentPersistence,
        dashboardPersistence,
        notepadPersistence,
        leftDockWidth,
        workspacePaneFilletRadiusPx,
        workspacePanelShellPaddingPx,
        workspaceNestedResizeKeepsFarPane,
        projectionMode,
        axisOverlayEnabled,
        browserPresentationMode,
        browserIsFloating,
        browserIsViewportSplit,
      }),
    [
      axisOverlayEnabled,
      browserIsFloating,
      browserIsViewportSplit,
      browserPresentationMode,
      consoleInputPriorityMode,
      dashboardPersistence,
      environmentPersistence,
      leftDockWidth,
      notepadPersistence,
      projectionMode,
      viewSettingsPersistence,
      workspacePaneFilletRadiusPx,
      workspacePanelShellPaddingPx,
      workspaceNestedResizeKeepsFarPane,
      workspaceRestorePersistence,
      workspaceStartupSurface,
    ],
  )

  const visibleSections = useMemo(() => {
    if (activeSectionId === 'all') {
      return settingsContentSections
        .map((section) => ({
          section,
          rows:
            section.id === 'spaghettiEditor'
              ? []
              : settingsRows.filter((row) =>
                  row.sectionIds.includes(section.id as Exclude<SettingsSectionId, 'all'>),
                ),
        }))
        .filter((group) => group.rows.length > 0 || group.section.id === 'spaghettiEditor')
    }

    const section = settingsSectionsById.get(activeSectionId)
    if (section === undefined) {
      return []
    }

    return [
      {
        section,
        rows:
          section.id === 'spaghettiEditor'
            ? []
            : settingsRows.filter((row) =>
                row.sectionIds.includes(section.id as Exclude<SettingsSectionId, 'all'>),
              ),
      },
    ]
  }, [activeSectionId, settingsRows])

  const settingsSurfaceStyle = {
    '--settings-surface-panel-shell-padding': `${workspacePanelShellPaddingPx}px`,
  } as CSSProperties

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--settings SettingsSurface"
      data-workspace-slot-id={slotId}
      data-workspace-surface-instance-id={surfaceInstanceId}
      style={settingsSurfaceStyle}
    >
      <WorkspacePanelSplitShell
        className="SettingsSurfacePanelShell"
        dataShellKind="settings"
        leftLabel="Settings sections"
        rightLabel="Settings content"
        resizeLabel="Resize Settings sections panel"
        left={
          <aside className="SettingsSurfaceRail" aria-label="Settings sections">
          <header className="SettingsSurfaceRailHeader">
            <span className="SettingsSurfaceRailEyebrow">Workspace</span>
            <strong>Settings</strong>
            <p>Unreal-style shell, phase 1.</p>
          </header>
          <div className="SettingsSurfaceSectionList" role="list" aria-label="Settings section list">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`SettingsSurfaceSectionButton ${
                  activeSectionId === section.id ? 'isActive' : ''
                }`}
                aria-pressed={activeSectionId === section.id}
                onClick={() => setActiveSectionId(section.id)}
              >
                <span className="SettingsSurfaceSectionButtonLabel">{section.label}</span>{' '}
                <span className="SettingsSurfaceSectionButtonMeta">{section.eyebrow}</span>
              </button>
            ))}
          </div>
          </aside>
        }
        right={
          <main className="SettingsSurfaceContent" aria-label="Settings content">
          <header className="SettingsSurfaceContentHeader">
            <div>
              <span className="SettingsSurfaceContentEyebrow">
                {settingsSectionsById.get(activeSectionId)?.eyebrow ?? 'Overview'}
              </span>
              <h2>{settingsSectionsById.get(activeSectionId)?.label ?? 'Settings'}</h2>
              <p>{settingsSectionsById.get(activeSectionId)?.description ?? ''}</p>
            </div>
          </header>
          <div className="SettingsSurfaceContentBody">
            {visibleSections.map(({ section, rows }) => (
              <section key={section.id} className="SettingsSurfaceGroup" aria-label={section.label}>
                <header className="SettingsSurfaceGroupHeader">
                  <span className="SettingsSurfaceGroupEyebrow">{section.eyebrow}</span>
                  <strong>{section.label}</strong>
                  <p>{section.description}</p>
                </header>
                {section.id === 'spaghettiEditor' ? (
                  <div className="SettingsSurfaceEditorPanel">
                    <div className="SettingsSurfaceEditorActions">
                      <button
                        type="button"
                        className="SettingsSurfaceEditorResetButton"
                        onClick={resetSpaghettiWindowAppearanceDefaults}
                      >
                        Reset to defaults
                      </button>
                    </div>
                    <div className="SettingsSurfaceEditorGrid">
                      <div className="SettingsSurfaceEditorField">
                        <ParaSlider
                          label="Title bar opacity"
                          value={spaghettiWindowAppearanceDefaults.titlebarOpacity}
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          clampMin={spaghettiWindowAppearanceDefaults.titlebarClamp.min}
                          clampMax={spaghettiWindowAppearanceDefaults.titlebarClamp.max}
                          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              titlebarOpacity: nextValue,
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSlider
                          label="Window opacity"
                          value={spaghettiWindowAppearanceDefaults.windowOpacity}
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          clampMin={spaghettiWindowAppearanceDefaults.windowClamp.min}
                          clampMax={spaghettiWindowAppearanceDefaults.windowClamp.max}
                          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              windowOpacity: nextValue,
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSlider
                          label="Graph content opacity"
                          value={spaghettiWindowAppearanceDefaults.graphContentOpacity}
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          clampMin={spaghettiWindowAppearanceDefaults.graphContentClamp.min}
                          clampMax={spaghettiWindowAppearanceDefaults.graphContentClamp.max}
                          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              graphContentOpacity: nextValue,
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSlider
                          label="Body side padding"
                          value={spaghettiWindowAppearanceDefaults.bodyInsetX}
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          clampMin={spaghettiWindowAppearanceDefaults.bodyInsetXClamp.min}
                          clampMax={spaghettiWindowAppearanceDefaults.bodyInsetXClamp.max}
                          formatValue={(nextValue) => `${Math.round(nextValue * 12)}px`}
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              bodyInsetX: nextValue,
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSlider
                          label="Body top/bottom padding"
                          value={spaghettiWindowAppearanceDefaults.bodyInsetY}
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          clampMin={spaghettiWindowAppearanceDefaults.bodyInsetYClamp.min}
                          clampMax={spaghettiWindowAppearanceDefaults.bodyInsetYClamp.max}
                          formatValue={(nextValue) => `${Math.round(nextValue * 12)}px`}
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              bodyInsetY: nextValue,
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSelect
                          label="Title bar color"
                          value={spaghettiWindowAppearanceDefaults.titlebarTint}
                          options={titlebarTintOptions}
                          menuMode="custom"
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              titlebarTint: nextValue as SpaghettiWindowAppearance['titlebarTint'],
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSelect
                          label="Body color"
                          value={spaghettiWindowAppearanceDefaults.bodyTint}
                          options={bodyTintOptions}
                          menuMode="custom"
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              bodyTint: nextValue as SpaghettiWindowAppearance['bodyTint'],
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSelect
                          label="Text size"
                          value={spaghettiWindowAppearanceDefaults.fontScale}
                          options={fontScaleOptions}
                          menuMode="custom"
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              fontScale: nextValue as SpaghettiWindowAppearance['fontScale'],
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSelect
                          label="Text type"
                          value={spaghettiWindowAppearanceDefaults.fontFamily}
                          options={fontFamilyOptions}
                          menuMode="custom"
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              fontFamily: nextValue as SpaghettiWindowAppearance['fontFamily'],
                            })
                          }
                        />
                      </div>
                      <div className="SettingsSurfaceEditorField">
                        <ParaSelect
                          label="Padding scale"
                          value={spaghettiWindowAppearanceDefaults.paddingScale}
                          options={paddingScaleOptions}
                          menuMode="custom"
                          onChange={(nextValue) =>
                            updateSpaghettiWindowAppearanceDefaults({
                              paddingScale: nextValue as SpaghettiWindowAppearance['paddingScale'],
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : section.id === 'keyBindings' ? (
                  <>
                    <div className="SettingsSurfaceEditorPanel">
                      <div className="SettingsSurfaceEditorGrid">
                        <div className="SettingsSurfaceEditorField">
                          <label className="HomePageSurfaceStoragePolicyToggle">
                            <span>Console first input priority</span>
                            <input
                              className="HomePageSurfacePersistenceSwitch"
                              type="checkbox"
                              role="switch"
                              aria-label="Console first input priority"
                              checked={consoleInputPriorityMode === 'console-first'}
                              onChange={() =>
                                setConsoleInputPriorityModeWithHistory(
                                  consoleInputPriorityMode === 'console-first'
                                    ? 'shortcuts-first'
                                    : 'console-first',
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                      <p className="SettingsSurfaceEditorNote">
                        Grouped shortcut rows and preset selection are prepared for the next
                        Settings 2 phase.
                      </p>
                    </div>
                    <div className="SettingsSurfaceRowList" role="list">
                      {rows.map((row) => (
                        <article
                          key={row.id}
                          className="SettingsSurfaceRowCard"
                          role="listitem"
                          data-settings-row-id={row.id}
                        >
                          <div className="SettingsSurfaceRowCopy">
                            <strong>{row.label}</strong>
                            <p>{row.description}</p>
                          </div>
                          <div className="SettingsSurfaceRowValue" aria-label={`${row.label} value`}>
                            {row.value}
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                ) : section.id === 'workspace' ? (
                  <>
                    <div className="SettingsSurfaceEditorPanel">
                      <div className="SettingsSurfaceEditorGrid">
                        <div className="SettingsSurfaceEditorField">
                          <ParaSlider
                            label="Workspace corner radius"
                            value={workspacePaneFilletRadiusPx}
                            min={MIN_WORKSPACE_PANE_FILLET_RADIUS_PX}
                            max={MAX_WORKSPACE_PANE_FILLET_RADIUS_PX}
                            step={1}
                            clampMin={MIN_WORKSPACE_PANE_FILLET_RADIUS_PX}
                            clampMax={MAX_WORKSPACE_PANE_FILLET_RADIUS_PX}
                            formatValue={(nextValue) => `${Math.round(nextValue)} px`}
                            displayValue={
                              workspacePaneFilletRadiusPx === DEFAULT_WORKSPACE_PANE_FILLET_RADIUS_PX
                                ? `${workspacePaneFilletRadiusPx} px (default)`
                                : `${workspacePaneFilletRadiusPx} px`
                            }
                            onChange={(nextValue) =>
                              setWorkspacePaneFilletRadiusWithHistory(nextValue)
                            }
                          />
                        </div>
                        <div className="SettingsSurfaceEditorField">
                          <ParaSlider
                            label="Workspace panel shell padding"
                            value={workspacePanelShellPaddingPx}
                            min={MIN_WORKSPACE_PANEL_SHELL_PADDING_PX}
                            max={MAX_WORKSPACE_PANEL_SHELL_PADDING_PX}
                            step={1}
                            clampMin={MIN_WORKSPACE_PANEL_SHELL_PADDING_PX}
                            clampMax={MAX_WORKSPACE_PANEL_SHELL_PADDING_PX}
                            formatValue={(nextValue) => `${Math.round(nextValue)} px`}
                            displayValue={
                              workspacePanelShellPaddingPx ===
                              DEFAULT_WORKSPACE_PANEL_SHELL_PADDING_PX
                                ? `${workspacePanelShellPaddingPx} px (default)`
                                : `${workspacePanelShellPaddingPx} px`
                            }
                            onChange={(nextValue) =>
                              setWorkspacePanelShellPaddingWithHistory(nextValue)
                            }
                          />
                        </div>
                        <div className="SettingsSurfaceEditorField">
                          <label className="HomePageSurfaceStoragePolicyToggle">
                            <span>Keep far pane fixed on nested resize</span>
                            <input
                              className="HomePageSurfacePersistenceSwitch"
                              type="checkbox"
                              role="switch"
                              aria-label="Keep far pane fixed on nested resize"
                              checked={workspaceNestedResizeKeepsFarPane}
                              onChange={() =>
                                setWorkspaceNestedResizeKeepsFarPaneWithHistory(
                                  !workspaceNestedResizeKeepsFarPane,
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="SettingsSurfaceRowList" role="list">
                      {rows.map((row) => (
                        <article
                          key={row.id}
                          className="SettingsSurfaceRowCard"
                          role="listitem"
                          data-settings-row-id={row.id}
                        >
                          <div className="SettingsSurfaceRowCopy">
                            <strong>{row.label}</strong>
                            <p>{row.description}</p>
                          </div>
                          <div className="SettingsSurfaceRowValue" aria-label={`${row.label} value`}>
                            {row.value}
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="SettingsSurfaceRowList" role="list">
                    {rows.map((row) => (
                      <article
                        key={row.id}
                        className="SettingsSurfaceRowCard"
                        role="listitem"
                        data-settings-row-id={row.id}
                      >
                        <div className="SettingsSurfaceRowCopy">
                          <strong>{row.label}</strong>
                          <p>{row.description}</p>
                        </div>
                        <div className="SettingsSurfaceRowValue" aria-label={`${row.label} value`}>
                          {row.value}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
          </main>
        }
      />
    </div>
  )
}
