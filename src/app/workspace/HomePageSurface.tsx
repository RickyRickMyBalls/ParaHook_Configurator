import { useEffect, useState } from 'react'
import {
  readGraphBrowserStoragePolicy,
  setGraphBrowserStorageRememberEnabled,
} from '../spaghetti/store/graphBrowserStoragePersistence'
import {
  readRecentItemsPolicy,
  setRecentItemsRememberEnabled,
} from '../recentItems/recentItemsPersistence'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  homePageGraphDocumentPersistenceNote,
  homePageRecentItemsPersistenceNote,
  readHomePageOriginStorageEstimate,
  readHomePageStorageBuckets,
} from './homePageStorageTransparency'
import {
  homePageDocsUrl,
  homePageGithubUrl,
  homePageVersionLabel,
  homePageWhatIsNewSummary,
} from './homePageOrientation'
import {
  getWorkspaceSurfaceCatalogEntries,
  type WorkspaceSurfaceCatalogEntry,
} from './workspaceSurfaceCatalog'
import type { WorkspaceSurfaceKind, WorkspaceViewportSlotId } from './workspaceShellTypes'

type HomePageLaunchSurfaceEntry = WorkspaceSurfaceCatalogEntry & {
  kind: Exclude<WorkspaceSurfaceKind, 'homePage'>
}

const homePageLaunchSurfaceEntries = getWorkspaceSurfaceCatalogEntries().filter(
  (entry): entry is HomePageLaunchSurfaceEntry => entry.kind !== 'homePage',
)

const resolveHomePageLaunchButtonLabel = (defaultLabel: string): string => {
  if (defaultLabel === 'Model Viewport') {
    return defaultLabel
  }
  return defaultLabel.endsWith(' Viewport')
    ? defaultLabel.slice(0, -' Viewport'.length)
    : defaultLabel
}

type HomePageSurfaceProps = {
  slotId?: WorkspaceViewportSlotId
  surfaceInstanceId: string
  hostMode?: 'slotted' | 'floating' | 'popout'
  onOpenSurface?: (surfaceKind: WorkspaceSurfaceKind) => void
}

export function HomePageSurface(props: HomePageSurfaceProps) {
  const {
    slotId,
    surfaceInstanceId,
    hostMode = 'slotted',
    onOpenSurface,
  } = props
  const workspaceStartupSurface = useUiPrefsStore((state) => state.workspaceStartupSurface)
  const setWorkspaceStartupSurface = useUiPrefsStore((state) => state.setWorkspaceStartupSurface)
  const [storageRefreshIndex, setStorageRefreshIndex] = useState(0)
  const storageBuckets = readHomePageStorageBuckets(
    typeof window === 'undefined' ? undefined : window.localStorage,
    storageRefreshIndex,
  )
  const [originStorageEstimateText, setOriginStorageEstimateText] = useState(
    'Checking browser origin storage...',
  )
  const [graphBrowserStorageRemembered, setGraphBrowserStorageRemembered] = useState(
    () => readGraphBrowserStoragePolicy().rememberGraphWorkingSet,
  )
  const [recentItemsRemembered, setRecentItemsRemembered] = useState(
    () => readRecentItemsPolicy().rememberRecentItems,
  )
  const workspaceRestorePersistence = useUiPrefsStore(
    (state) => state.workspaceRestorePersistence,
  )
  const viewSettingsPersistence = useUiPrefsStore((state) => state.viewSettingsPersistence)
  const environmentPersistence = useUiPrefsStore((state) => state.environmentPersistence)
  const dashboardPersistence = useUiPrefsStore((state) => state.dashboardPersistence)
  const notepadPersistence = useUiPrefsStore((state) => state.notepadPersistence)
  const setWorkspaceRestorePersistence = useUiPrefsStore(
    (state) => state.setWorkspaceRestorePersistence,
  )
  const setViewSettingsPersistence = useUiPrefsStore((state) => state.setViewSettingsPersistence)
  const setEnvironmentPersistence = useUiPrefsStore((state) => state.setEnvironmentPersistence)
  const setDashboardPersistence = useUiPrefsStore((state) => state.setDashboardPersistence)
  const setNotepadPersistence = useUiPrefsStore((state) => state.setNotepadPersistence)

  useEffect(() => {
    const storageManager =
      typeof navigator === 'undefined' || navigator.storage === undefined
        ? null
        : navigator.storage
    if (storageManager === null) {
      setOriginStorageEstimateText('Unavailable in this browser.')
      return
    }

    let isCurrent = true
    void readHomePageOriginStorageEstimate(storageManager).then((estimate) => {
      if (isCurrent) {
        setOriginStorageEstimateText(estimate.message)
      }
    })

    return () => {
      isCurrent = false
    }
  }, [])

  const renderStoragePolicySwitch = (
    label: string,
    checked: boolean,
    onChange: () => void,
  ) => (
    <label className="HomePageSurfaceStoragePolicyToggle">
      <span>{label}</span>
      <input
        className="HomePageSurfacePersistenceSwitch"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={onChange}
      />
    </label>
  )

  const wipeStorageBucket = (storageKey: string) => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return
    }
    window.localStorage.removeItem(storageKey)
    setStorageRefreshIndex((current) => current + 1)
  }

  const storagePolicyControlsByBucketId = new Map([
    [
      'workspace-layout',
      [
        renderStoragePolicySwitch('Workspace restore', workspaceRestorePersistence, () => {
          setWorkspaceRestorePersistence(!workspaceRestorePersistence)
        }),
      ],
    ],
    [
      'ui-prefs',
      [
        renderStoragePolicySwitch('View settings', viewSettingsPersistence, () => {
          setViewSettingsPersistence(!viewSettingsPersistence)
        }),
        renderStoragePolicySwitch('Environment', environmentPersistence, () => {
          setEnvironmentPersistence(!environmentPersistence)
        }),
      ],
    ],
    [
      'dashboard',
      [
        renderStoragePolicySwitch('Dashboard', dashboardPersistence, () => {
          setDashboardPersistence(!dashboardPersistence)
        }),
      ],
    ],
    [
      'notepad',
      [
        renderStoragePolicySwitch('Notepad', notepadPersistence, () => {
          setNotepadPersistence(!notepadPersistence)
        }),
      ],
    ],
    [
      'graph-working-set',
      [
        renderStoragePolicySwitch('Graph working set', graphBrowserStorageRemembered, () => {
          const nextRemembered = !graphBrowserStorageRemembered
          setGraphBrowserStorageRememberEnabled(nextRemembered)
          setGraphBrowserStorageRemembered(nextRemembered)
        }),
      ],
    ],
    [
      'recent-items',
      [
        renderStoragePolicySwitch('Recent items', recentItemsRemembered, () => {
          const nextRemembered = !recentItemsRemembered
          setRecentItemsRememberEnabled(nextRemembered)
          setRecentItemsRemembered(nextRemembered)
        }),
      ],
    ],
  ])

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--homePage HomePageSurface"
      data-workspace-slot-id={slotId}
      data-workspace-surface-instance-id={surfaceInstanceId}
      data-workspace-host-mode={hostMode}
    >
      <div className="WorkspaceViewportSlotPlaceholder">
        <div className="HomePageSurfacePanel">
          <div className="HomePageSurfaceControlDeck" aria-label="Home Page control deck">
            <aside className="HomePageSurfaceControlRail" aria-label="Home Page control rail">
              <div className="HomePageSurfaceIntro">
                <strong>Home Page</strong>
                <p>Workspace landing surface</p>
              </div>
              <fieldset className="HomePageSurfaceStartupToggle">
                <legend>Startup surface</legend>
                <label className="HomePageSurfaceStartupSurfaceSwitch">
                  <span>Home Page</span>
                  <input
                    className="HomePageSurfacePersistenceSwitch"
                    type="checkbox"
                    role="switch"
                    aria-label="Start in Model Viewport"
                    checked={workspaceStartupSurface === 'modelViewer'}
                    onChange={() =>
                      setWorkspaceStartupSurface(
                        workspaceStartupSurface === 'modelViewer' ? 'homePage' : 'modelViewer',
                      )
                    }
                  />
                  <span>Model Viewport</span>
                </label>
              </fieldset>
              <div className="HomePageSurfaceLaunchActions" aria-label="Home Page launch actions">
                <strong>Open viewport</strong>
                {homePageLaunchSurfaceEntries.map((entry) => (
                  <button
                    key={entry.kind}
                    type="button"
                    onClick={() => onOpenSurface?.(entry.kind)}
                    disabled={onOpenSurface === undefined}
                  >
                    {resolveHomePageLaunchButtonLabel(entry.defaultLabel)}
                  </button>
                ))}
              </div>
              <div className="HomePageSurfaceRailUtilityGroup" aria-label="Home Page help shortcuts">
                <strong>Help</strong>
                <div className="HomePageSurfaceRailShortcutLinks">
                  <a
                    href={homePageDocsUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-home-page-rail-shortcut="docs"
                  >
                    Docs
                  </a>
                  <a
                    href={homePageGithubUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-home-page-rail-shortcut="github"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div
                className="HomePageSurfaceRailDebugAffordance"
                role="note"
                aria-label="Home Page advanced status"
                data-home-page-rail-debug-affordance="advanced"
              >
                <span>Advanced</span>
                <strong>Read-only status</strong>
              </div>
            </aside>
            <main className="HomePageSurfaceMainRegion" aria-label="Home Page main region">
              <section className="HomePageSurfaceOrientationCard" aria-label="Orientation">
                <div className="HomePageSurfaceOrientationHeader">
                  <span className="HomePageSurfaceOrientationEyebrow">Quick start</span>
                  <strong>Orientation</strong>
                  <p>Status, repo, and version read.</p>
                </div>
                <div className="HomePageSurfaceOrientationBody">
                  <div
                    className="HomePageSurfaceOrientationAffordance"
                    role="note"
                    aria-label="Get Started with ParaHook"
                    data-home-page-orientation-affordance="get-started"
                  >
                    <span className="HomePageSurfaceOrientationAffordanceKicker">
                      Intro
                    </span>
                    <strong>Get Started with ParaHook</strong>
                  </div>
                  <div className="HomePageSurfaceOrientationStatus">
                    <div className="HomePageSurfaceOrientationLinks">
                      <a
                        className="HomePageSurfaceOrientationLink"
                        href={homePageGithubUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-home-page-orientation-link="github"
                      >
                        GitHub
                      </a>
                      <a
                        className="HomePageSurfaceOrientationLink"
                        href={homePageDocsUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-home-page-orientation-link="docs"
                      >
                        Docs
                      </a>
                    </div>
                    <div className="HomePageSurfaceOrientationReadout">
                      <p className="HomePageSurfaceOrientationVersion">
                        <strong>Version</strong>
                        <span>{homePageVersionLabel}</span>
                      </p>
                      <p className="HomePageSurfaceOrientationWhatIsNew">
                        <strong>What&apos;s new</strong>
                        <span>{homePageWhatIsNewSummary}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="HomePageSurfaceStorageTransparency HomePageSurfaceStorageManagement"
                aria-label="Storage Management"
              >
                <div className="HomePageSurfaceStorageTransparencyHeader">
                  <strong>Storage Management</strong>
                  <p>Manage ParaHook-owned browser persistence buckets without changing owners.</p>
                </div>
                <div className="HomePageSurfaceStorageTransparencyList" role="list">
                  {storageBuckets.map((bucket) => (
                    <div
                      key={bucket.storageKey}
                      className="HomePageSurfaceStorageTransparencyRow"
                      role="listitem"
                      data-home-page-storage-bucket-key={bucket.storageKey}
                    >
                      <div className="HomePageSurfaceStorageTransparencyRowLabel">
                        <strong>{bucket.label}</strong>
                        <code className="HomePageSurfaceStorageTransparencyKey">
                          {bucket.storageKey}
                        </code>
                        <span className="HomePageSurfaceStorageTransparencySeam">
                          {bucket.ownerSeam}
                        </span>
                      </div>
                      <div className="HomePageSurfaceStoragePolicyControls">
                        {storagePolicyControlsByBucketId.get(bucket.id)?.map((control, index) => (
                          <span
                            key={`${bucket.id}-policy-${index}`}
                            data-home-page-storage-policy-bucket-id={bucket.id}
                          >
                            {control}
                          </span>
                        ))}
                      </div>
                      <span
                        className="HomePageSurfaceStorageDetailAffordance"
                        aria-label={`${bucket.label} storage details`}
                        title={`${bucket.label} uses ${bucket.storageKey} from ${bucket.ownerSeam}`}
                      >
                        Details
                      </span>
                      <button
                        className="HomePageSurfaceStorageWipeButton"
                        type="button"
                        aria-label={`Wipe ${bucket.label} storage`}
                        onClick={() => wipeStorageBucket(bucket.storageKey)}
                      >
                        X
                      </button>
                      <div className="HomePageSurfaceStorageTransparencySize">
                        {bucket.present
                          ? `${bucket.approximateSizeLabel} approx.`
                          : `0 B stored`}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="HomePageSurfaceStorageTransparencyOrigin">
                  Browser origin storage estimate: {originStorageEstimateText}
                </p>
                <p className="HomePageSurfaceStorageTransparencyNote">
                  {homePageGraphDocumentPersistenceNote}
                </p>
                <p className="HomePageSurfaceStorageTransparencyNote">
                  {homePageRecentItemsPersistenceNote}
                </p>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
