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

  it('registers settings as an optional persisted workspace surface with split support only', () => {
    expect(parseWorkspaceSurfaceKind('settings')).toBe('settings')
    expect(isWorkspaceSurfaceOptional('settings')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('settings')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('settings')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('settings', 'floating')).toBe(false)
    expect(workspaceSurfaceSupportsHostMode('settings', 'popout')).toBe(false)
    expect(workspacePrimarySlotSupportsSurfaceKind('settings')).toBe(true)
    expect(getWorkspaceSurfaceCatalogEntry('settings')).toEqual(
      expect.objectContaining({
        kind: 'settings',
        defaultLabel: 'Settings',
        renderFamily: 'settings',
        scope: 'optional',
        participatesInPersistence: true,
        coordination: 'plain',
        supports: expect.objectContaining({
          slotted: true,
          floating: false,
          popout: false,
          split: true,
        }),
      }),
    )
  })

  it('creates explicit slot instance ids for settings instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('settings', 'workspace-slot-settings')).toBe(
      'settings-workspace-slot-settings',
    )
  })

  it('registers properties as an optional persisted workspace surface with split support only', () => {
    expect(parseWorkspaceSurfaceKind('properties')).toBe('properties')
    expect(isWorkspaceSurfaceOptional('properties')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('properties')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('properties')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('properties', 'floating')).toBe(false)
    expect(workspaceSurfaceSupportsHostMode('properties', 'popout')).toBe(false)
    expect(workspacePrimarySlotSupportsSurfaceKind('properties')).toBe(true)
    expect(getWorkspaceSurfaceCatalogEntry('properties')).toEqual(
      expect.objectContaining({
        kind: 'properties',
        defaultLabel: 'Properties',
        renderFamily: 'properties',
        scope: 'optional',
        participatesInPersistence: true,
        coordination: 'plain',
        supports: expect.objectContaining({
          slotted: true,
          floating: false,
          popout: false,
          split: true,
        }),
      }),
    )
  })

  it('creates explicit slot instance ids for properties instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('properties', 'workspace-slot-properties')).toBe(
      'properties-workspace-slot-properties',
    )
  })

  it('registers export as an optional persisted workspace surface with split support only', () => {
    expect(parseWorkspaceSurfaceKind('export')).toBe('export')
    expect(isWorkspaceSurfaceOptional('export')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('export')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('export')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('export', 'floating')).toBe(false)
    expect(workspaceSurfaceSupportsHostMode('export', 'popout')).toBe(false)
    expect(workspacePrimarySlotSupportsSurfaceKind('export')).toBe(true)
    expect(getWorkspaceSurfaceCatalogEntry('export')).toEqual(
      expect.objectContaining({
        kind: 'export',
        defaultLabel: 'Export',
        renderFamily: 'export',
        scope: 'optional',
        participatesInPersistence: true,
        coordination: 'plain',
        supports: expect.objectContaining({
          slotted: true,
          floating: false,
          popout: false,
          split: true,
        }),
      }),
    )
  })

  it('creates explicit slot instance ids for export instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('export', 'workspace-slot-export')).toBe(
      'export-workspace-slot-export',
    )
  })

  it('creates explicit slot instance ids for home page instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('homePage', 'workspace-slot-primary')).toBe(
      'home-page-workspace-slot-primary',
    )
  })

  it('registers edit history as an optional persisted workspace surface', () => {
    expect(parseWorkspaceSurfaceKind('editHistory')).toBe('editHistory')
    expect(isWorkspaceSurfaceOptional('editHistory')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('editHistory')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('editHistory')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('editHistory', 'floating')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('editHistory', 'popout')).toBe(true)
    expect(workspacePrimarySlotSupportsSurfaceKind('editHistory')).toBe(true)
    expect(getWorkspaceSurfaceCatalogEntry('editHistory')).toEqual(
      expect.objectContaining({
        kind: 'editHistory',
        defaultLabel: 'Edit History',
        renderFamily: 'editHistory',
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

  it('creates explicit slot instance ids for edit history instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('editHistory', 'workspace-slot-history')).toBe(
      'edit-history-workspace-slot-history',
    )
  })
})
