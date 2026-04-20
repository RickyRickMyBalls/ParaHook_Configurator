import { describe, expect, it } from 'vitest'
import {
  createWorkspaceSurfaceInstanceIdForSlot,
  workspacePrimarySlotSupportsSurfaceKind,
} from './workspaceShellTypes'
import {
  getWorkspaceSurfaceCatalogEntry,
  isWorkspaceSurfaceOptional,
  parseWorkspaceSurfaceKind,
  workspaceSurfaceParticipatesInPersistence,
  workspaceSurfaceSupportsHostMode,
  workspaceSurfaceSupportsSplit,
} from './workspaceSurfaceCatalog'

describe('workspaceSurfaceCatalog', () => {
  it('registers catalog as an optional persisted split-capable workspace surface with popout deferred', () => {
    expect(parseWorkspaceSurfaceKind('catalog')).toBe('catalog')
    expect(isWorkspaceSurfaceOptional('catalog')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('catalog')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('catalog')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('catalog', 'floating')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('catalog', 'popout')).toBe(false)
    expect(getWorkspaceSurfaceCatalogEntry('catalog')).toEqual(
      expect.objectContaining({
        kind: 'catalog',
        defaultLabel: 'Catalog Viewport',
        renderFamily: 'catalog',
        scope: 'optional',
        participatesInPersistence: true,
        coordination: 'plain',
        supports: expect.objectContaining({
          slotted: true,
          floating: true,
          popout: false,
          split: true,
        }),
      }),
    )
  })

  it('creates explicit slot instance ids for catalog instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('catalog', 'workspace-slot-secondary')).toBe(
      'catalog-workspace-slot-secondary',
    )
  })

  it('registers home page as an optional persisted workspace surface', () => {
    expect(parseWorkspaceSurfaceKind('homePage')).toBe('homePage')
    expect(isWorkspaceSurfaceOptional('homePage')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('homePage')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('homePage')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('homePage', 'floating')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('homePage', 'popout')).toBe(true)
    expect(workspacePrimarySlotSupportsSurfaceKind('homePage')).toBe(true)
    expect(getWorkspaceSurfaceCatalogEntry('homePage')).toEqual(
      expect.objectContaining({
        kind: 'homePage',
        defaultLabel: 'Home Page',
        renderFamily: 'homePage',
        scope: 'optional',
        participatesInPersistence: true,
        coordination: 'plain',
        supports: expect.objectContaining({
          slotted: true,
          floating: true,
          popout: true,
          split: true,
        }),
      }),
    )
  })

  it('creates explicit slot instance ids for home page instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('homePage', 'workspace-slot-primary')).toBe(
      'home-page-workspace-slot-primary',
    )
  })
})
