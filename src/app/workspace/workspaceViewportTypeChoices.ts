import type { WorkspaceSurfaceKind } from './workspaceShellTypes'
import {
  getWorkspaceSurfaceCatalogEntries,
  getWorkspaceSurfaceDefaultLabel,
} from './workspaceSurfaceCatalog'

export type WorkspaceViewportTypeChoiceEntry = {
  kind: WorkspaceSurfaceKind
  label: string
  aliases: readonly string[]
}

const workspaceViewportTypeAliasesByKind: Partial<
  Record<WorkspaceSurfaceKind, readonly string[]>
> = {
  modelViewer: ['MV'],
  browser: ['BRO'],
  console: ['C'],
  spaghettiEditor: ['SE', 'SP'],
  catalog: ['CAT'],
  dashboard: ['DASH'],
  notepad: ['NOTE'],
  homePage: ['HP', 'HOME'],
  properties: ['PROP', 'PROPS'],
}

export function getWorkspaceViewportTypeLabel(surfaceKind: WorkspaceSurfaceKind): string {
  const label = getWorkspaceSurfaceDefaultLabel(surfaceKind)
  return surfaceKind === 'modelViewer' ? label : label.replace(/ Viewport$/, '')
}

export function getWorkspaceViewportTypeChoiceEntries(
  surfaceKinds?: readonly WorkspaceSurfaceKind[],
): WorkspaceViewportTypeChoiceEntry[] {
  const resolvedSurfaceKinds =
    surfaceKinds ??
    getWorkspaceSurfaceCatalogEntries()
      .filter((entry) => entry.supports.slotted)
      .map((entry) => entry.kind)

  return resolvedSurfaceKinds.map((kind) => ({
    kind,
    label: getWorkspaceViewportTypeLabel(kind),
    aliases: workspaceViewportTypeAliasesByKind[kind] ?? [],
  }))
}
