import { describe, expect, it } from 'vitest'
import { resolveCatalogActionPlan } from './catalogActionPlan'
import { resolveCatalogEnvironmentApplyRequest } from './catalogEnvironmentApply'
import type { CatalogItemRecord } from './catalogItemContract'

describe('catalogEnvironmentApply', () => {
  it('resolves repo-backed environment items into one explicit viewer-environment handoff contract', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:studio',
      label: 'Studio Environment',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri', 'studio'],
      description: 'Shared viewer environment fixture entry.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'Environments/studio.hdr',
      },
      previewMedia: [],
    }

    expect(resolveCatalogEnvironmentApplyRequest(item, resolveCatalogActionPlan(item))).toEqual({
      downstreamOwner: 'viewer-environment',
      label: 'Studio Environment',
      assetPath: expect.stringMatching(/\/Environments\/studio\.hdr$/),
      fileType: 'hdr',
    })
  })

  it('keeps real repo HDRI identity in the viewer-environment handoff', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:rogland-clear-night-2k-hdr',
      label: 'Rogland Clear Night 2K',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri', 'night'],
      description: 'Repo-backed night HDRI entry.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'HDRI/rogland_clear_night_2k.hdr',
      },
      previewMedia: [],
    }

    expect(resolveCatalogEnvironmentApplyRequest(item, resolveCatalogActionPlan(item))).toEqual({
      downstreamOwner: 'viewer-environment',
      label: 'Rogland Clear Night 2K',
      assetPath: expect.stringMatching(/\/HDRI\/rogland_clear_night_2k\.hdr$/),
      fileType: 'hdr',
    })
  })

  it('does not invent an environment handoff for reference items', () => {
    const item: CatalogItemRecord = {
      itemId: 'reference:shoe-1',
      label: 'Shoe 1',
      familyKey: 'references',
      sectionKey: 'shoes',
      tags: ['reference', 'shoe'],
      description: 'Repo-backed shoe reference.',
      assetKind: 'reference-asset',
      actionKind: 'add-to-project',
      source: {
        sourceKind: 'repo',
        assetPath: 'Catalog/shoes/Shoe_1.glb',
      },
      previewMedia: [],
    }

    expect(resolveCatalogEnvironmentApplyRequest(item, resolveCatalogActionPlan(item))).toBeNull()
  })
})
