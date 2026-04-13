import type {
  WorkspaceSurfaceHostMode,
  WorkspaceSurfaceKind,
} from './workspaceShellTypes'

export type WorkspaceSurfaceRenderFamily =
  | 'modelViewer'
  | 'browser'
  | 'console'
  | 'spaghettiEditor'
  | 'dashboard'
  | 'notepad'

export type WorkspaceSurfaceScope = 'core' | 'optional'
export type WorkspaceSurfaceCoordination =
  | 'plain'
  | 'browserShell'
  | 'consoleStore'
  | 'spaghettiViewport'

export type WorkspaceSurfaceCatalogEntry = {
  kind: WorkspaceSurfaceKind
  defaultLabel: string
  renderFamily: WorkspaceSurfaceRenderFamily
  scope: WorkspaceSurfaceScope
  supports: {
    slotted: boolean
    floating: boolean
    popout: boolean
    split: boolean
  }
  participatesInPersistence: boolean
  coordination: WorkspaceSurfaceCoordination
}

export type CoreWorkspaceSurfaceKind =
  | 'modelViewer'
  | 'browser'
  | 'console'
  | 'spaghettiEditor'

export type OptionalWorkspaceSurfaceKind = 'dashboard' | 'notepad'

const workspaceSurfaceCatalogEntries: readonly WorkspaceSurfaceCatalogEntry[] = [
  {
    kind: 'modelViewer',
    defaultLabel: 'Model Viewport',
    renderFamily: 'modelViewer',
    scope: 'core',
    supports: {
      slotted: true,
      floating: true,
      popout: true,
      split: true,
    },
    participatesInPersistence: true,
    coordination: 'plain',
  },
  {
    kind: 'browser',
    defaultLabel: 'Browser Viewport',
    renderFamily: 'browser',
    scope: 'core',
    supports: {
      slotted: true,
      floating: true,
      popout: true,
      split: true,
    },
    participatesInPersistence: true,
    coordination: 'browserShell',
  },
  {
    kind: 'console',
    defaultLabel: 'Console Viewport',
    renderFamily: 'console',
    scope: 'core',
    supports: {
      slotted: true,
      floating: true,
      popout: true,
      split: true,
    },
    participatesInPersistence: true,
    coordination: 'consoleStore',
  },
  {
    kind: 'spaghettiEditor',
    defaultLabel: 'Spaghetti Editor Viewport',
    renderFamily: 'spaghettiEditor',
    scope: 'core',
    supports: {
      slotted: true,
      floating: true,
      popout: true,
      split: true,
    },
    participatesInPersistence: true,
    coordination: 'spaghettiViewport',
  },
  {
    kind: 'dashboard',
    defaultLabel: 'Dashboard Viewport',
    renderFamily: 'dashboard',
    scope: 'optional',
    supports: {
      slotted: true,
      floating: true,
      popout: true,
      split: true,
    },
    participatesInPersistence: true,
    coordination: 'plain',
  },
  {
    kind: 'notepad',
    defaultLabel: 'Notepad',
    renderFamily: 'notepad',
    scope: 'optional',
    supports: {
      slotted: true,
      floating: true,
      popout: true,
      split: true,
    },
    participatesInPersistence: true,
    coordination: 'plain',
  },
] as const

const workspaceSurfaceCatalogByKind = Object.fromEntries(
  workspaceSurfaceCatalogEntries.map((entry) => [entry.kind, entry]),
) as Record<WorkspaceSurfaceKind, WorkspaceSurfaceCatalogEntry>

export function getWorkspaceSurfaceCatalogEntry(
  kind: WorkspaceSurfaceKind,
): WorkspaceSurfaceCatalogEntry {
  return workspaceSurfaceCatalogByKind[kind]
}

export function parseWorkspaceSurfaceKind(value: unknown): WorkspaceSurfaceKind | null {
  if (typeof value !== 'string') {
    return null
  }
  return value in workspaceSurfaceCatalogByKind ? (value as WorkspaceSurfaceKind) : null
}

export function getWorkspaceSurfaceDefaultLabel(kind: WorkspaceSurfaceKind): string {
  return getWorkspaceSurfaceCatalogEntry(kind).defaultLabel
}

export function getWorkspaceSurfaceRenderFamily(
  kind: WorkspaceSurfaceKind,
): WorkspaceSurfaceRenderFamily {
  return getWorkspaceSurfaceCatalogEntry(kind).renderFamily
}

export function getWorkspaceSurfaceCoordination(
  kind: WorkspaceSurfaceKind,
): WorkspaceSurfaceCoordination {
  return getWorkspaceSurfaceCatalogEntry(kind).coordination
}

export function workspaceSurfaceSupportsHostMode(
  kind: WorkspaceSurfaceKind,
  hostMode: WorkspaceSurfaceHostMode,
): boolean {
  return getWorkspaceSurfaceCatalogEntry(kind).supports[hostMode]
}

export function workspaceSurfaceSupportsSplit(kind: WorkspaceSurfaceKind): boolean {
  return getWorkspaceSurfaceCatalogEntry(kind).supports.split
}

export function workspaceSurfaceParticipatesInPersistence(
  kind: WorkspaceSurfaceKind,
): boolean {
  return getWorkspaceSurfaceCatalogEntry(kind).participatesInPersistence
}

export function isWorkspaceSurfaceCore(
  kind: WorkspaceSurfaceKind,
): kind is CoreWorkspaceSurfaceKind {
  return getWorkspaceSurfaceCatalogEntry(kind).scope === 'core'
}

export function isWorkspaceSurfaceOptional(
  kind: WorkspaceSurfaceKind,
): kind is OptionalWorkspaceSurfaceKind {
  return getWorkspaceSurfaceCatalogEntry(kind).scope === 'optional'
}
