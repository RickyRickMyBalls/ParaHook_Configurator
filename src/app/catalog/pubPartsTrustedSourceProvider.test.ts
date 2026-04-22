import { describe, expect, it } from 'vitest'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import {
  assertPubPartsTrustedSourceProviderSamePath,
  getPubPartsTrustedSourceProvider,
  resetPubPartsTrustedSourceProviderForTests,
  resolvePubPartsTrustedSourceProviderCapabilityRead,
  resolvePubPartsTrustedSourceProviderMaterializationDecision,
  setPubPartsTrustedSourceProviderForTests,
  unavailablePubPartsTrustedSourceProvider,
  type PubPartsTrustedSourceProvider,
} from './pubPartsTrustedSourceProvider'

const stagedRecord: PubPartsStagedSourceRecord = {
  stagedSourceId: 'pubparts:gripples',
  catalogItemId: 'external:pubparts:gripples',
  catalogItemLabel: '3d Printed Gripples',
  providerId: 'pubparts',
  providerName: 'PubParts',
  sourceCandidateUrl:
    'https://www.dropbox.com/scl/fi/example/standard-gripples-for-onewheel-model_files.zip?dl=0',
  linkedArchiveUrl:
    'https://www.dropbox.com/scl/fi/example/standard-gripples-for-onewheel-model_files.zip?dl=0',
  sourcePageUrl: 'https://www.printables.com/model/598759',
  sourceUrl: 'https://www.printables.com/model/598759',
  archiveLastUpdated: '2026-04-21T00:00:00.000Z',
  sourceMetadata: [],
  status: 'source-link-staged',
  binaryStatus: 'not-downloaded',
  inspectionStatus: 'not-inspected',
  importStatus: 'not-imported',
  stagedAt: '2026-04-21T17:22:15.000Z',
  updatedAt: '2026-04-21T17:22:15.000Z',
}

describe('pubPartsTrustedSourceProvider', () => {
  it('defaults to an unavailable side-effect-free provider', async () => {
    resetPubPartsTrustedSourceProviderForTests()

    const provider = getPubPartsTrustedSourceProvider()
    const capability = provider.getCapability()
    const read = resolvePubPartsTrustedSourceProviderCapabilityRead(capability)
    const result = await provider.materializeArchiveBytes({
      stagedRecord,
      explicitUserAction: 'add-to-project-source-options',
    })
    const decision = resolvePubPartsTrustedSourceProviderMaterializationDecision(
      stagedRecord,
      result,
    )

    expect(provider).toBe(unavailablePubPartsTrustedSourceProvider)
    expect(read).toEqual({
      status: 'unavailable',
      configured: false,
      label: 'Trusted source-byte provider',
      description:
        'No trusted source-byte provider is configured. Browser fetch and Upload ZIP fallback remain available.',
    })
    expect(result.status).toBe('unavailable')
    expect(decision.status).toBe('provider-unavailable')
    expect(decision.materialized).toBe(false)
    expect(decision.fallback).toBe('open-source-and-upload-zip')
    expect(decision.nextStep).toBe('open-source-and-upload-zip')
  })

  it('represents configured provider capability without exposing credentials', () => {
    const read = resolvePubPartsTrustedSourceProviderCapabilityRead({
      status: 'configured',
      providerLabel: 'Fixture Provider',
      reason: 'Fixture provider is configured for tests.',
    })

    expect(read).toEqual({
      status: 'configured',
      configured: true,
      label: 'Fixture Provider',
      description: 'Fixture provider is configured for tests.',
    })
  })

  it('maps blocked provider results to the Phase 1 provider fallback decision', () => {
    const decision = resolvePubPartsTrustedSourceProviderMaterializationDecision(stagedRecord, {
      status: 'blocked-by-provider',
      providerLabel: 'Fixture Provider',
      reason: 'Fixture provider refused this source.',
    })

    expect(decision.status).toBe('provider-blocked')
    expect(decision.materialized).toBe(false)
    expect(decision.fallback).toBe('open-source-and-upload-zip')
    expect(decision.reason).toBe('Fixture provider refused this source.')
  })

  it('maps source-blocked provider results to the Phase 1 provider fallback decision', () => {
    const decision = resolvePubPartsTrustedSourceProviderMaterializationDecision(stagedRecord, {
      status: 'blocked-by-source',
      providerLabel: 'Fixture Provider',
      reason: 'The source did not allow provider materialization.',
    })

    expect(decision.status).toBe('provider-blocked')
    expect(decision.materialized).toBe(false)
    expect(decision.fallback).toBe('open-source-and-upload-zip')
    expect(decision.reason).toBe('The source did not allow provider materialization.')
  })

  it('maps failed provider results to the recoverable Phase 1 failed decision', () => {
    const decision = resolvePubPartsTrustedSourceProviderMaterializationDecision(stagedRecord, {
      status: 'failed',
      providerLabel: 'Fixture Provider',
      reason: 'The provider returned malformed bytes.',
    })

    expect(decision.status).toBe('failed')
    expect(decision.materialized).toBe(false)
    expect(decision.fallback).toBe('open-source-and-upload-zip')
    expect(decision.nextStep).toBe('open-source-and-upload-zip')
    expect(decision.reason).toBe('The provider returned malformed bytes.')
  })

  it('maps materialized provider bytes to trusted-provider same-path archive input', () => {
    const archiveBlob = new Blob(['zip bytes'], { type: 'application/zip' })
    const result = {
      status: 'materialized' as const,
      archiveBlob,
      sourceUrl: stagedRecord.sourceCandidateUrl,
      contentHash: 'fixture-content-hash',
      materializedAt: '2026-04-21T17:22:15.000Z',
      providerLabel: 'Fixture Provider',
    }
    const decision = resolvePubPartsTrustedSourceProviderMaterializationDecision(
      stagedRecord,
      result,
    )

    expect(decision.status).toBe('provider-materialized')
    expect(decision.materialized).toBe(true)
    expect(decision.fallback).toBe('none')
    expect(decision.nextStep).toBe('use-materialized-archive-bytes')
    expect(decision.archiveByteInput).toEqual({
      samePath: 'archive-list-preview-select-stage',
      byteOrigin: 'trusted-provider',
    })
    expect(decision.freshness.contentHash).toBe('fixture-content-hash')
    expect(decision.freshness.byteSize).toBe(9)
    expect(assertPubPartsTrustedSourceProviderSamePath(stagedRecord, result)).toBe(
      'archive-list-preview-select-stage',
    )
  })

  it('allows deterministic provider injection and reset in tests', async () => {
    const fakeProvider: PubPartsTrustedSourceProvider = {
      getCapability: () => ({
        status: 'configured',
        providerLabel: 'Fixture Provider',
      }),
      materializeArchiveBytes: async () => ({
        status: 'materialized',
        archiveBlob: new Blob(['zip bytes'], { type: 'application/zip' }),
        materializedAt: '2026-04-21T17:22:15.000Z',
        providerLabel: 'Fixture Provider',
      }),
    }

    const restoreProvider = setPubPartsTrustedSourceProviderForTests(fakeProvider)
    expect(getPubPartsTrustedSourceProvider()).toBe(fakeProvider)

    restoreProvider()
    expect(getPubPartsTrustedSourceProvider()).toBe(unavailablePubPartsTrustedSourceProvider)
  })
})
