import type { PubPartsStagedSourceRecord } from './pubPartsDownloadsStorage'
import {
  assertPubPartsSourceMaterializationSamePath,
  buildPubPartsSourceMaterializationFreshness,
  buildPubPartsSourceMaterializationIdentity,
  resolvePubPartsSourceMaterializationDecision,
  type PubPartsSourceMaterializationDecision,
  type PubPartsSourceMaterializationDecisionInput,
  type PubPartsSourceMaterializationSamePath,
  type PubPartsSourceMaterializationStatus,
} from './pubPartsSourceMaterialization'

export type PubPartsTrustedSourceProviderCapabilityStatus =
  | 'configured'
  | 'unavailable'
  | 'requires-configuration'
  | 'blocked'

export type PubPartsTrustedSourceProviderCapability = {
  status: PubPartsTrustedSourceProviderCapabilityStatus
  providerLabel: string
  reason?: string
}

export type PubPartsTrustedSourceProviderMaterializationStatus =
  | 'not-attempted'
  | 'materialized'
  | 'unavailable'
  | 'blocked-by-provider'
  | 'blocked-by-source'
  | 'failed'

export type PubPartsTrustedSourceProviderRequest = {
  stagedRecord: PubPartsStagedSourceRecord
  explicitUserAction: 'add-to-project-source-options'
}

export type PubPartsTrustedSourceProviderMaterializedResult = {
  status: 'materialized'
  archiveBlob: Blob
  materializedAt: string
  providerLabel: string
  sourceUrl?: string
  contentHash?: string
}

export type PubPartsTrustedSourceProviderFallbackResult = {
  status: Exclude<PubPartsTrustedSourceProviderMaterializationStatus, 'not-attempted' | 'materialized'>
  reason: string
  providerLabel?: string
}

export type PubPartsTrustedSourceProviderResult =
  | PubPartsTrustedSourceProviderMaterializedResult
  | PubPartsTrustedSourceProviderFallbackResult

export type PubPartsTrustedSourceProvider = {
  getCapability: () => PubPartsTrustedSourceProviderCapability
  materializeArchiveBytes: (
    request: PubPartsTrustedSourceProviderRequest,
  ) => Promise<PubPartsTrustedSourceProviderResult>
}

export type PubPartsTrustedSourceProviderCapabilityRead = {
  status: PubPartsTrustedSourceProviderCapabilityStatus
  configured: boolean
  label: string
  description: string
}

const defaultUnavailableProviderLabel = 'Trusted source-byte provider'

const defaultUnavailableCapability = (): PubPartsTrustedSourceProviderCapability => ({
  status: 'unavailable',
  providerLabel: defaultUnavailableProviderLabel,
  reason:
    'No trusted source-byte provider is configured. Browser fetch and Upload ZIP fallback remain available.',
})

export const unavailablePubPartsTrustedSourceProvider: PubPartsTrustedSourceProvider = {
  getCapability: defaultUnavailableCapability,
  materializeArchiveBytes: async () => ({
    status: 'unavailable',
    providerLabel: defaultUnavailableProviderLabel,
    reason:
      'No trusted source-byte provider is configured. Browser fetch and Upload ZIP fallback remain available.',
  }),
}

let activePubPartsTrustedSourceProvider: PubPartsTrustedSourceProvider =
  unavailablePubPartsTrustedSourceProvider

export function getPubPartsTrustedSourceProvider(): PubPartsTrustedSourceProvider {
  return activePubPartsTrustedSourceProvider
}

export function setPubPartsTrustedSourceProviderForTests(
  provider: PubPartsTrustedSourceProvider,
): () => void {
  const previousProvider = activePubPartsTrustedSourceProvider
  activePubPartsTrustedSourceProvider = provider

  return () => {
    activePubPartsTrustedSourceProvider = previousProvider
  }
}

export function resetPubPartsTrustedSourceProviderForTests(): void {
  activePubPartsTrustedSourceProvider = unavailablePubPartsTrustedSourceProvider
}

export function resolvePubPartsTrustedSourceProviderCapabilityRead(
  capability: PubPartsTrustedSourceProviderCapability,
): PubPartsTrustedSourceProviderCapabilityRead {
  switch (capability.status) {
    case 'configured':
      return {
        status: capability.status,
        configured: true,
        label: capability.providerLabel,
        description:
          capability.reason ??
          'A trusted source-byte provider is configured for explicit source-options materialization.',
      }
    case 'requires-configuration':
      return {
        status: capability.status,
        configured: false,
        label: capability.providerLabel,
        description:
          capability.reason ??
          'A trusted source-byte provider exists but must be configured before it can materialize source bytes.',
      }
    case 'blocked':
      return {
        status: capability.status,
        configured: false,
        label: capability.providerLabel,
        description:
          capability.reason ??
          'The trusted source-byte provider is blocked. Browser fetch and Upload ZIP fallback remain available.',
      }
    case 'unavailable':
    default:
      return {
        status: 'unavailable',
        configured: false,
        label: capability.providerLabel,
        description:
          capability.reason ??
          'No trusted source-byte provider is available. Browser fetch and Upload ZIP fallback remain available.',
      }
  }
}

function mapProviderResultToMaterializationStatus(
  result: PubPartsTrustedSourceProviderResult,
): PubPartsSourceMaterializationStatus {
  switch (result.status) {
    case 'materialized':
      return 'provider-materialized'
    case 'unavailable':
      return 'provider-unavailable'
    case 'blocked-by-provider':
    case 'blocked-by-source':
      return 'provider-blocked'
    case 'failed':
    default:
      return 'failed'
  }
}

export function resolvePubPartsTrustedSourceProviderMaterializationDecision(
  stagedRecord: PubPartsStagedSourceRecord,
  result: PubPartsTrustedSourceProviderResult,
): PubPartsSourceMaterializationDecision {
  const decisionInput: PubPartsSourceMaterializationDecisionInput = {
    identity: buildPubPartsSourceMaterializationIdentity(stagedRecord),
    freshness: buildPubPartsSourceMaterializationFreshness(stagedRecord, {
      ...(result.status === 'materialized'
        ? {
            byteSize: result.archiveBlob.size,
            materializedAt: result.materializedAt,
            ...(result.contentHash === undefined ? {} : { contentHash: result.contentHash }),
          }
        : {}),
    }),
    status: mapProviderResultToMaterializationStatus(result),
    ...(result.status === 'materialized'
      ? { reason: `Trusted provider ${result.providerLabel} materialized archive bytes.` }
      : { reason: result.reason }),
  }

  return resolvePubPartsSourceMaterializationDecision(decisionInput)
}

export function assertPubPartsTrustedSourceProviderSamePath(
  stagedRecord: PubPartsStagedSourceRecord,
  result: PubPartsTrustedSourceProviderMaterializedResult,
): PubPartsSourceMaterializationSamePath {
  return assertPubPartsSourceMaterializationSamePath(
    resolvePubPartsTrustedSourceProviderMaterializationDecision(stagedRecord, result),
  )
}
