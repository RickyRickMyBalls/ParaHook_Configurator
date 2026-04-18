import { describe, expect, it } from 'vitest'
import { resolveCatalogActionPlan } from './catalogActionPlan'
import type { CatalogItemRecord } from './catalogItemContract'
import { resolveCatalogReferenceCommitRequest } from './catalogReferenceCommit'
import { getCatalogRepoItems } from './catalogSource'

describe('catalogReferenceCommit', () => {
  it('resolves the first curated reference families into explicit browser-project handoff contracts', () => {
    const repoItems = getCatalogRepoItems()
    const expectedRequestsByItemId = {
      'reference:shoe-1': {
        downstreamOwner: 'browser-project',
        fileName: 'Shoe 1',
        fileType: 'glb',
        objectUrl: expect.stringMatching(/\/ReferenceModels\/shoes\/Shoe_1\.glb$/),
      },
      'reference:hook-large': {
        downstreamOwner: 'browser-project',
        fileName: 'Large Foothook',
        fileType: 'step',
        objectUrl: expect.stringMatching(/\/ReferenceModels\/hooks\/large\.step$/),
      },
      'reference:footpad-pubpad-full-assembly': {
        downstreamOwner: 'browser-project',
        fileName: 'PubPad Full Assembly',
        fileType: 'obj',
        objectUrl: expect.stringMatching(
          /\/ReferenceModels\/footpads\/XR_Footpad_PubPad_Full_Assembly\.obj$/,
        ),
      },
    } satisfies Record<string, NonNullable<ReturnType<typeof resolveCatalogReferenceCommitRequest>>>

    for (const [itemId, expectedCommitRequest] of Object.entries(expectedRequestsByItemId)) {
      const item = repoItems.find((candidate) => candidate.itemId === itemId)
      expect(item).toBeDefined()

      const commitRequest = resolveCatalogReferenceCommitRequest(
        item as CatalogItemRecord,
        resolveCatalogActionPlan(item as CatalogItemRecord),
      )

      expect(commitRequest).toEqual(expectedCommitRequest)
    }
  })

  it('does not invent a commit handoff for imports reuse preview entries', () => {
    const item: CatalogItemRecord = {
      itemId: 'imports:shoe-1',
      label: 'Imported Shoe 1',
      familyKey: 'imports',
      sectionKey: 'user-references',
      tags: ['imports', 'shoe'],
      description: 'Imports reuse entry.',
      assetKind: 'reference-asset',
      actionKind: 'load-preview',
      source: {
        sourceKind: 'imports',
        importId: 'imported-reference-1',
        assetPath: 'blob:imported-reference-1',
      },
      previewMedia: [],
    }

    expect(resolveCatalogReferenceCommitRequest(item, resolveCatalogActionPlan(item))).toBeNull()
  })

  it('does not route environment actions through the browser-project reference handoff', () => {
    const item: CatalogItemRecord = {
      itemId: 'environment:studio-1',
      label: 'Studio Lighting',
      familyKey: 'environments',
      sectionKey: 'hdris',
      tags: ['environment', 'hdri'],
      description: 'Environment fixture entry.',
      assetKind: 'environment',
      actionKind: 'apply-environment',
      source: {
        sourceKind: 'repo',
        assetPath: 'Environments/studio-1.hdr',
      },
      previewMedia: [],
    }

    expect(resolveCatalogReferenceCommitRequest(item, resolveCatalogActionPlan(item))).toBeNull()
  })
})
