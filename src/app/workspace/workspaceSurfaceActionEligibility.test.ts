import { describe, expect, it } from 'vitest'
import { getWorkspaceSurfaceCatalogEntries } from './workspaceSurfaceCatalog'
import { getWorkspaceSurfaceActionEligibility } from './workspaceSurfaceActionEligibility'
import type { WorkspaceSurfaceKind } from './workspaceShellTypes'

const getSlottedEligibility = (surfaceKind: WorkspaceSurfaceKind, isPrimary: boolean) =>
  getWorkspaceSurfaceActionEligibility({
    surfaceKind,
    hostMode: 'slotted',
    isPrimary,
  })

describe('workspaceSurfaceActionEligibility', () => {
  it('represents primary model viewport protections explicitly', () => {
    const eligibility = getSlottedEligibility('modelViewer', true)

    expect(eligibility.canSplit).toBe(true)
    expect(eligibility.canChangeViewportType).toBe(true)
    expect(eligibility.canPopout).toBe(true)
    expect(eligibility.float).toEqual(
      expect.objectContaining({
        supported: false,
        visible: false,
        blockedReason: 'primary-slot-protected',
      }),
    )
    expect(eligibility.close).toEqual(
      expect.objectContaining({
        supported: false,
        visible: false,
        blockedReason: 'primary-slot-protected',
      }),
    )
  })

  it('allows non-primary model viewport workspace actions from catalog support', () => {
    const eligibility = getSlottedEligibility('modelViewer', false)

    expect(eligibility.canSplit).toBe(true)
    expect(eligibility.canChangeViewportType).toBe(true)
    expect(eligibility.canFloat).toBe(true)
    expect(eligibility.canPopout).toBe(true)
    expect(eligibility.canClose).toBe(true)
  })

  it('allows browser actions from the shared workspace surface support model', () => {
    const eligibility = getSlottedEligibility('browser', false)

    expect(eligibility.split.blockedReason).toBeNull()
    expect(eligibility.float.blockedReason).toBeNull()
    expect(eligibility.popout.blockedReason).toBeNull()
    expect(eligibility.close.blockedReason).toBeNull()
  })

  it('allows console actions without a console-local allowlist', () => {
    const eligibility = getSlottedEligibility('console', false)

    expect(eligibility.canSplit).toBe(true)
    expect(eligibility.canFloat).toBe(true)
    expect(eligibility.canPopout).toBe(true)
    expect(eligibility.canClose).toBe(true)
  })

  it('covers optional catalog-backed surfaces without per-action console allowlists', () => {
    const homePageEligibility = getSlottedEligibility('homePage', false)

    expect(homePageEligibility.canSplit).toBe(true)
    expect(homePageEligibility.canChangeViewportType).toBe(true)
    expect(homePageEligibility.canFloat).toBe(true)
    expect(homePageEligibility.canPopout).toBe(true)
    expect(homePageEligibility.canClose).toBe(true)
  })

  it('mirrors catalog support for every catalog surface without console-specific action lists', () => {
    for (const catalogEntry of getWorkspaceSurfaceCatalogEntries()) {
      const eligibility = getSlottedEligibility(catalogEntry.kind, false)

      expect(eligibility.canChangeViewportType).toBe(catalogEntry.supports.slotted)
      expect(eligibility.canSplit).toBe(catalogEntry.supports.slotted && catalogEntry.supports.split)
      expect(eligibility.canFloat).toBe(catalogEntry.supports.slotted && catalogEntry.supports.floating)
      expect(eligibility.canPopout).toBe(catalogEntry.supports.slotted && catalogEntry.supports.popout)
      expect(eligibility.canClose).toBe(catalogEntry.supports.slotted)
    }
  })

  it('blocks unsupported popout through catalog support reasons', () => {
    const eligibility = getSlottedEligibility('catalog', false)

    expect(eligibility.canSplit).toBe(true)
    expect(eligibility.canFloat).toBe(true)
    expect(eligibility.popout).toEqual(
      expect.objectContaining({
        supported: false,
        visible: false,
        blockedReason: 'catalog-host-mode-unsupported',
      }),
    )
  })

  it('blocks slotted surface actions when the target is already detached', () => {
    const eligibility = getWorkspaceSurfaceActionEligibility({
      surfaceKind: 'browser',
      hostMode: 'floating',
      isPrimary: false,
    })

    expect(eligibility.split.blockedReason).toBe('surface-not-slotted')
    expect(eligibility.viewportType.blockedReason).toBe('surface-not-slotted')
    expect(eligibility.float.blockedReason).toBe('surface-not-slotted')
    expect(eligibility.popout.blockedReason).toBe('surface-not-slotted')
    expect(eligibility.close.blockedReason).toBe('surface-not-slotted')
  })
})
