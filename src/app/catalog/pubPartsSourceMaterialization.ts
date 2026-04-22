import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import type { PubPartsSourceRecordKind } from './pubPartsSource'

export const pubPartsSourceMaterializationSamePath =
  'archive-list-preview-select-stage' as const

export type PubPartsSourceByteOrigin =
  | 'browser-fetch'
  | 'uploaded-local-zip'
  | 'internal-library-cache'
  | 'trusted-provider'

export type PubPartsSourceMaterializationStatus =
  | 'browser-fetch-readable'
  | 'browser-fetch-blocked'
  | 'uploaded-local-zip'
  | 'internal-library-cache-hit'
  | 'provider-materialized'
  | 'provider-unavailable'
  | 'provider-blocked'
  | 'upload-required'
  | 'materialized'
  | 'failed'

export type PubPartsSourceMaterializationFallback =
  | 'none'
  | 'upload-zip'
  | 'open-source-and-upload-zip'
  | 'configure-provider'

export type PubPartsSourceMaterializationSamePath =
  typeof pubPartsSourceMaterializationSamePath

export type PubPartsSourceMaterializationSourceKind =
  | 'linked-archive'
  | 'direct-file'
  | 'uploaded-archive'
  | 'cached-archive'

export type PubPartsSourceMaterializationSourceVersionKind =
  | 'archiveLastUpdated'
  | 'sourceLastUpdated'
  | 'contentHash'
  | 'unversioned'

export type PubPartsSourceMaterializationNextStep =
  | 'attempt-browser-fetch'
  | 'use-materialized-archive-bytes'
  | 'open-source-and-upload-zip'
  | 'configure-provider'
  | 'none'

export type PubPartsSourceMaterializationIdentity = {
  providerId: 'pubparts' | string
  providerName: string
  catalogItemId: string
  catalogItemLabel: string
  sourceKind: PubPartsSourceMaterializationSourceKind
  sourceRecordKind?: PubPartsSourceRecordKind
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  sourceUrl?: string
}

export type PubPartsSourceMaterializationFreshness = {
  sourceVersionKey: string
  sourceVersionKind: PubPartsSourceMaterializationSourceVersionKind
  archiveLastUpdated?: string
  dropboxZipLastUpdated?: string
  sourceLastUpdated?: string
  contentHash?: string
  byteSize?: number
  materializedAt?: string
}

export type PubPartsSourceMaterializationArchiveByteInput = {
  samePath: PubPartsSourceMaterializationSamePath
  byteOrigin: PubPartsSourceByteOrigin
}

export type PubPartsSourceMaterializationDecisionInput = {
  identity: PubPartsSourceMaterializationIdentity
  freshness: PubPartsSourceMaterializationFreshness
  status: PubPartsSourceMaterializationStatus
  reason?: string
  byteOrigin?: PubPartsSourceByteOrigin
  sourceIdentityMatches?: boolean
}

export type PubPartsSourceMaterializationDecision = {
  identity: PubPartsSourceMaterializationIdentity
  freshness: PubPartsSourceMaterializationFreshness
  status: PubPartsSourceMaterializationStatus
  materialized: boolean
  nextStep: PubPartsSourceMaterializationNextStep
  fallback: PubPartsSourceMaterializationFallback
  reason?: string
  archiveByteInput?: PubPartsSourceMaterializationArchiveByteInput
}

export type PubPartsSourceMaterializationFreshnessOptions = {
  contentHash?: string
  byteSize?: number
  materializedAt?: string
}

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const trimRequiredString = (value: string): string => value.trim()

const isFiniteNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

export function buildPubPartsSourceMaterializationIdentity(
  stagedRecord: PubPartsStagedSourceRecord,
  options: {
    sourceKind?: PubPartsSourceMaterializationSourceKind
    sourceRecordKind?: PubPartsSourceRecordKind
  } = {},
): PubPartsSourceMaterializationIdentity {
  return {
    providerId: stagedRecord.providerId,
    providerName: stagedRecord.providerName,
    catalogItemId: stagedRecord.catalogItemId,
    catalogItemLabel: stagedRecord.catalogItemLabel,
    sourceKind: options.sourceKind ?? 'linked-archive',
    sourceRecordKind: options.sourceRecordKind,
    sourceCandidateUrl: trimRequiredString(stagedRecord.sourceCandidateUrl),
    linkedArchiveUrl: trimRequiredString(stagedRecord.linkedArchiveUrl),
    sourcePageUrl: trimOptionalString(stagedRecord.sourcePageUrl),
    sourceUrl: trimOptionalString(stagedRecord.sourceUrl),
  }
}

export function buildPubPartsSourceMaterializationFreshness(
  stagedRecord: PubPartsStagedSourceRecord,
  options: PubPartsSourceMaterializationFreshnessOptions = {},
): PubPartsSourceMaterializationFreshness {
  const contentHash = trimOptionalString(options.contentHash)
  const archiveLastUpdated = trimOptionalString(stagedRecord.archiveLastUpdated)
  const sourceLastUpdated = trimOptionalString(stagedRecord.sourceLastUpdated)
  const byteSize = isFiniteNonNegativeNumber(options.byteSize) ? options.byteSize : undefined
  const materializedAt = trimOptionalString(options.materializedAt)

  if (contentHash !== undefined) {
    return {
      sourceVersionKey: contentHash,
      sourceVersionKind: 'contentHash',
      archiveLastUpdated,
      dropboxZipLastUpdated: archiveLastUpdated,
      sourceLastUpdated,
      contentHash,
      byteSize,
      materializedAt,
    }
  }

  if (archiveLastUpdated !== undefined) {
    return {
      sourceVersionKey: archiveLastUpdated,
      sourceVersionKind: 'archiveLastUpdated',
      archiveLastUpdated,
      dropboxZipLastUpdated: archiveLastUpdated,
      sourceLastUpdated,
      byteSize,
      materializedAt,
    }
  }

  if (sourceLastUpdated !== undefined) {
    return {
      sourceVersionKey: sourceLastUpdated,
      sourceVersionKind: 'sourceLastUpdated',
      sourceLastUpdated,
      byteSize,
      materializedAt,
    }
  }

  return {
    sourceVersionKey: 'unversioned',
    sourceVersionKind: 'unversioned',
    byteSize,
    materializedAt,
  }
}

export function doPubPartsSourceMaterializationIdentitiesMatch(
  left: PubPartsSourceMaterializationIdentity,
  right: PubPartsSourceMaterializationIdentity,
): boolean {
  return (
    left.providerId === right.providerId &&
    left.catalogItemId === right.catalogItemId &&
    left.sourceCandidateUrl === right.sourceCandidateUrl &&
    left.linkedArchiveUrl === right.linkedArchiveUrl
  )
}

export function doPubPartsSourceMaterializationFreshnessValuesMatch(
  left: PubPartsSourceMaterializationFreshness,
  right: PubPartsSourceMaterializationFreshness,
): boolean {
  return (
    left.sourceVersionKind === right.sourceVersionKind &&
    left.sourceVersionKey === right.sourceVersionKey &&
    left.archiveLastUpdated === right.archiveLastUpdated &&
    left.sourceLastUpdated === right.sourceLastUpdated &&
    left.contentHash === right.contentHash
  )
}

function buildMaterializedDecision(
  input: PubPartsSourceMaterializationDecisionInput,
  byteOrigin: PubPartsSourceByteOrigin,
  status: PubPartsSourceMaterializationStatus = input.status,
): PubPartsSourceMaterializationDecision {
  return {
    identity: input.identity,
    freshness: input.freshness,
    status,
    materialized: true,
    nextStep: 'use-materialized-archive-bytes',
    fallback: 'none',
    ...(input.reason === undefined ? {} : { reason: input.reason }),
    archiveByteInput: {
      samePath: pubPartsSourceMaterializationSamePath,
      byteOrigin,
    },
  }
}

function buildFallbackDecision(
  input: PubPartsSourceMaterializationDecisionInput,
  options: {
    fallback: PubPartsSourceMaterializationFallback
    nextStep: PubPartsSourceMaterializationNextStep
    status?: PubPartsSourceMaterializationStatus
    reason?: string
  },
): PubPartsSourceMaterializationDecision {
  const reason = options.reason ?? input.reason
  return {
    identity: input.identity,
    freshness: input.freshness,
    status: options.status ?? input.status,
    materialized: false,
    nextStep: options.nextStep,
    fallback: options.fallback,
    ...(reason === undefined ? {} : { reason }),
  }
}

export function resolvePubPartsSourceMaterializationDecision(
  input: PubPartsSourceMaterializationDecisionInput,
): PubPartsSourceMaterializationDecision {
  switch (input.status) {
    case 'browser-fetch-readable':
      return buildFallbackDecision(input, {
        fallback: 'none',
        nextStep: 'attempt-browser-fetch',
      })
    case 'browser-fetch-blocked':
      return buildFallbackDecision(input, {
        fallback: 'open-source-and-upload-zip',
        nextStep: 'open-source-and-upload-zip',
        reason:
          input.reason ??
          'Browser source access is blocked; use Open Source and Upload ZIP fallback.',
      })
    case 'uploaded-local-zip':
      return buildMaterializedDecision(input, 'uploaded-local-zip')
    case 'internal-library-cache-hit':
      if (input.sourceIdentityMatches === false) {
        return buildFallbackDecision(input, {
          status: 'failed',
          fallback: 'open-source-and-upload-zip',
          nextStep: 'open-source-and-upload-zip',
          reason:
            input.reason ??
            'Internal Library cache bytes do not match the current source identity and freshness.',
        })
      }
      return buildMaterializedDecision(input, 'internal-library-cache')
    case 'provider-materialized':
      return buildMaterializedDecision(input, 'trusted-provider')
    case 'provider-unavailable':
      return buildFallbackDecision(input, {
        fallback: 'open-source-and-upload-zip',
        nextStep: 'open-source-and-upload-zip',
        reason:
          input.reason ??
          'No trusted source-byte provider is available; use Upload ZIP fallback.',
      })
    case 'provider-blocked':
      return buildFallbackDecision(input, {
        fallback: 'open-source-and-upload-zip',
        nextStep: 'open-source-and-upload-zip',
        reason:
          input.reason ??
          'The trusted source-byte provider cannot materialize this source; use Upload ZIP fallback.',
      })
    case 'upload-required':
      return buildFallbackDecision(input, {
        fallback: 'upload-zip',
        nextStep: 'open-source-and-upload-zip',
        reason: input.reason ?? 'Upload ZIP is required before ParaHook owns source bytes.',
      })
    case 'materialized':
      if (input.byteOrigin === undefined) {
        return buildFallbackDecision(input, {
          status: 'failed',
          fallback: 'open-source-and-upload-zip',
          nextStep: 'open-source-and-upload-zip',
          reason: input.reason ?? 'Materialized source bytes must declare a legal byte origin.',
        })
      }
      return buildMaterializedDecision(input, input.byteOrigin)
    case 'failed':
    default:
      return buildFallbackDecision(input, {
        fallback: 'open-source-and-upload-zip',
        nextStep: 'open-source-and-upload-zip',
        reason: input.reason ?? 'Source bytes could not be materialized.',
      })
  }
}

export function isPubPartsSourceMaterialized(
  decision: PubPartsSourceMaterializationDecision,
): decision is PubPartsSourceMaterializationDecision & {
  materialized: true
  archiveByteInput: PubPartsSourceMaterializationArchiveByteInput
} {
  return decision.materialized && decision.archiveByteInput !== undefined
}

export function resolvePubPartsSourceMaterializationFallback(
  decision: PubPartsSourceMaterializationDecision,
): PubPartsSourceMaterializationFallback {
  return decision.fallback
}

export function assertPubPartsSourceMaterializationSamePath(
  decision: PubPartsSourceMaterializationDecision,
): PubPartsSourceMaterializationSamePath {
  if (!isPubPartsSourceMaterialized(decision)) {
    throw new Error('PubParts source bytes are not materialized for the shared archive path.')
  }

  return decision.archiveByteInput.samePath
}
