import { describe, expect, it } from 'vitest'
import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import {
  assertPubPartsSourceMaterializationSamePath,
  buildPubPartsSourceMaterializationFreshness,
  buildPubPartsSourceMaterializationIdentity,
  doPubPartsSourceMaterializationFreshnessValuesMatch,
  doPubPartsSourceMaterializationIdentitiesMatch,
  isPubPartsSourceMaterialized,
  pubPartsSourceMaterializationSamePath,
  resolvePubPartsSourceMaterializationDecision,
  resolvePubPartsSourceMaterializationFallback,
} from './pubPartsSourceMaterialization'

const buildStagedRecord = (
  overrides: Partial<PubPartsStagedSourceRecord> = {},
): PubPartsStagedSourceRecord => ({
  stagedSourceId: 'pubparts:external:pubparts:sample',
  catalogItemId: 'external:pubparts:sample',
  catalogItemLabel: 'Sample PubParts Item',
  providerId: 'pubparts',
  providerName: 'PubParts',
  sourceCollectionKey: 'GT/GT-S',
  sourceCollectionLabel: 'GT/GT-S',
  sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/model-files.zip?dl=0',
  linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/source/model-files.zip?dl=0',
  sourcePageUrl: 'https://pubparts.xyz/part/sample',
  externalItemUrl: 'https://pubparts.xyz/part/sample',
  sourceUrl: 'https://pubparts.xyz/part/sample',
  previewImageUrl: 'https://pubparts.xyz/images/sample.webp',
  sourceLastUpdated: '2026-04-20T00:00:00.000Z',
  archiveLastUpdated: '2026-04-21T00:00:00.000Z',
  sourceMetadata: [],
  status: 'source-link-staged',
  binaryStatus: 'not-downloaded',
  inspectionStatus: 'not-inspected',
  importStatus: 'not-imported',
  stagedAt: '2026-04-21T01:00:00.000Z',
  updatedAt: '2026-04-21T01:00:00.000Z',
  ...overrides,
})

const buildDecisionInputs = (record = buildStagedRecord()) => ({
  identity: buildPubPartsSourceMaterializationIdentity(record, { sourceRecordKind: 'part' }),
  freshness: buildPubPartsSourceMaterializationFreshness(record),
})

describe('pubPartsSourceMaterialization', () => {
  it('represents a PubParts ZIP source as a direct materialization candidate with source freshness identity', () => {
    const record = buildStagedRecord()
    const identity = buildPubPartsSourceMaterializationIdentity(record, {
      sourceRecordKind: 'part',
    })
    const freshness = buildPubPartsSourceMaterializationFreshness(record, {
      byteSize: 12345,
      materializedAt: '2026-04-21T02:00:00.000Z',
    })
    const decision = resolvePubPartsSourceMaterializationDecision({
      identity,
      freshness,
      status: 'browser-fetch-readable',
    })

    expect(identity).toEqual({
      providerId: 'pubparts',
      providerName: 'PubParts',
      catalogItemId: 'external:pubparts:sample',
      catalogItemLabel: 'Sample PubParts Item',
      sourceKind: 'linked-archive',
      sourceRecordKind: 'part',
      sourceCandidateUrl: 'https://www.dropbox.com/scl/fi/source/model-files.zip?dl=0',
      linkedArchiveUrl: 'https://www.dropbox.com/scl/fi/source/model-files.zip?dl=0',
      sourcePageUrl: 'https://pubparts.xyz/part/sample',
      sourceUrl: 'https://pubparts.xyz/part/sample',
    })
    expect(freshness).toMatchObject({
      sourceVersionKey: '2026-04-21T00:00:00.000Z',
      sourceVersionKind: 'archiveLastUpdated',
      archiveLastUpdated: '2026-04-21T00:00:00.000Z',
      dropboxZipLastUpdated: '2026-04-21T00:00:00.000Z',
      sourceLastUpdated: '2026-04-20T00:00:00.000Z',
      byteSize: 12345,
      materializedAt: '2026-04-21T02:00:00.000Z',
    })
    expect(decision).toMatchObject({
      status: 'browser-fetch-readable',
      materialized: false,
      nextStep: 'attempt-browser-fetch',
      fallback: 'none',
    })
    expect(decision.archiveByteInput).toBeUndefined()
  })

  it('routes browser-fetch-blocked to the Upload ZIP fallback without marking bytes materialized', () => {
    const input = buildDecisionInputs()
    const decision = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'browser-fetch-blocked',
      reason: 'CORS denied this Dropbox response.',
    })

    expect(decision.status).toBe('browser-fetch-blocked')
    expect(isPubPartsSourceMaterialized(decision)).toBe(false)
    expect(resolvePubPartsSourceMaterializationFallback(decision)).toBe(
      'open-source-and-upload-zip',
    )
    expect(decision.nextStep).toBe('open-source-and-upload-zip')
    expect(decision.archiveByteInput).toBeUndefined()
    expect(() => assertPubPartsSourceMaterializationSamePath(decision)).toThrow(
      /not materialized/u,
    )
  })

  it('routes provider-unavailable and provider-blocked to fallback states without implying a provider exists', () => {
    const input = buildDecisionInputs()
    const unavailable = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'provider-unavailable',
    })
    const blocked = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'provider-blocked',
    })

    expect(unavailable).toMatchObject({
      materialized: false,
      fallback: 'open-source-and-upload-zip',
      nextStep: 'open-source-and-upload-zip',
    })
    expect(unavailable.archiveByteInput).toBeUndefined()
    expect(blocked).toMatchObject({
      materialized: false,
      fallback: 'open-source-and-upload-zip',
      nextStep: 'open-source-and-upload-zip',
    })
    expect(blocked.archiveByteInput).toBeUndefined()
  })

  it('treats uploaded-local-zip as a materialized byte origin for the shared archive path', () => {
    const input = buildDecisionInputs()
    const decision = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'uploaded-local-zip',
    })

    expect(isPubPartsSourceMaterialized(decision)).toBe(true)
    expect(decision.archiveByteInput).toEqual({
      samePath: pubPartsSourceMaterializationSamePath,
      byteOrigin: 'uploaded-local-zip',
    })
    expect(assertPubPartsSourceMaterializationSamePath(decision)).toBe(
      'archive-list-preview-select-stage',
    )
  })

  it('treats internal-library-cache-hit as a materialized byte origin only when source identity and freshness match', () => {
    const record = buildStagedRecord()
    const currentIdentity = buildPubPartsSourceMaterializationIdentity(record)
    const currentFreshness = buildPubPartsSourceMaterializationFreshness(record)
    const matchingIdentity = buildPubPartsSourceMaterializationIdentity(buildStagedRecord())
    const matchingFreshness = buildPubPartsSourceMaterializationFreshness(buildStagedRecord())
    const staleFreshness = buildPubPartsSourceMaterializationFreshness(
      buildStagedRecord({ archiveLastUpdated: '2026-04-19T00:00:00.000Z' }),
    )

    const match =
      doPubPartsSourceMaterializationIdentitiesMatch(currentIdentity, matchingIdentity) &&
      doPubPartsSourceMaterializationFreshnessValuesMatch(currentFreshness, matchingFreshness)
    const staleMatch =
      doPubPartsSourceMaterializationIdentitiesMatch(currentIdentity, matchingIdentity) &&
      doPubPartsSourceMaterializationFreshnessValuesMatch(currentFreshness, staleFreshness)

    const cacheHit = resolvePubPartsSourceMaterializationDecision({
      identity: currentIdentity,
      freshness: currentFreshness,
      status: 'internal-library-cache-hit',
      sourceIdentityMatches: match,
    })
    const staleCacheHit = resolvePubPartsSourceMaterializationDecision({
      identity: currentIdentity,
      freshness: staleFreshness,
      status: 'internal-library-cache-hit',
      sourceIdentityMatches: staleMatch,
    })

    expect(match).toBe(true)
    expect(staleMatch).toBe(false)
    expect(cacheHit.archiveByteInput).toEqual({
      samePath: pubPartsSourceMaterializationSamePath,
      byteOrigin: 'internal-library-cache',
    })
    expect(staleCacheHit).toMatchObject({
      status: 'failed',
      materialized: false,
      fallback: 'open-source-and-upload-zip',
      nextStep: 'open-source-and-upload-zip',
    })
    expect(staleCacheHit.archiveByteInput).toBeUndefined()
  })

  it('treats provider-materialized as a trusted-provider byte origin for the shared archive path', () => {
    const input = buildDecisionInputs()
    const decision = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'provider-materialized',
    })

    expect(decision).toMatchObject({
      status: 'provider-materialized',
      materialized: true,
      fallback: 'none',
      nextStep: 'use-materialized-archive-bytes',
    })
    expect(decision.archiveByteInput).toEqual({
      samePath: pubPartsSourceMaterializationSamePath,
      byteOrigin: 'trusted-provider',
    })
  })

  it('keeps failed materialization recoverable through Upload ZIP fallback', () => {
    const input = buildDecisionInputs()
    const decision = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'failed',
      reason: 'Response body could not be read.',
    })

    expect(decision).toMatchObject({
      status: 'failed',
      materialized: false,
      fallback: 'open-source-and-upload-zip',
      nextStep: 'open-source-and-upload-zip',
      reason: 'Response body could not be read.',
    })
    expect(decision.archiveByteInput).toBeUndefined()
  })

  it('does not expose any network fetch, OPFS write, ZIP listing, object URL, File, Import review, or project ownership fields in the contract result', () => {
    const input = buildDecisionInputs()
    const decision = resolvePubPartsSourceMaterializationDecision({
      ...input,
      status: 'materialized',
      byteOrigin: 'browser-fetch',
    })
    const serializedDecision = JSON.stringify(decision)

    expect(Object.keys(decision).sort()).toEqual([
      'archiveByteInput',
      'fallback',
      'freshness',
      'identity',
      'materialized',
      'nextStep',
      'status',
    ])
    expect(serializedDecision).not.toMatch(
      /fetchRef|opfs|getDirectory|writePubParts|zipEntries|objectUrl|Import review|projectAsset|referenceWorkspace/iu,
    )
    expect(decision.archiveByteInput).toEqual({
      samePath: pubPartsSourceMaterializationSamePath,
      byteOrigin: 'browser-fetch',
    })
  })
})
