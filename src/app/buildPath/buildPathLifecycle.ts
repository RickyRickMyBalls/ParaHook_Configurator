import type { BuildPathEventSourceKind } from './buildPathEvents'

export type BuildPathLifecycleKind = 'graph-created' | 'graph-loaded'

export type BuildPathLifecycleCard = {
  buildPathLifecycleCardId: string
  sourceKind: BuildPathEventSourceKind
  lifecycleKind: BuildPathLifecycleKind
  graphDocumentId: string
  graphLabel: string
  eventSequence: number
  acceptedAt?: string
  isStructural: true
  affectsGeometry: false
}

export type CreateBuildPathLifecycleCardRequest = {
  lifecycleKind: BuildPathLifecycleKind
  graphDocumentId: string
  graphLabel?: string
  eventSequence: number
  sourceKind?: BuildPathEventSourceKind
  acceptedAt?: string
}

const lifecycleSlugByKind: Record<BuildPathLifecycleKind, string> = {
  'graph-created': 'graph-created',
  'graph-loaded': 'graph-loaded',
}

export const createBuildPathLifecycleCard = ({
  acceptedAt,
  eventSequence,
  graphDocumentId,
  graphLabel,
  lifecycleKind,
  sourceKind = 'recorded',
}: CreateBuildPathLifecycleCardRequest): BuildPathLifecycleCard => ({
  buildPathLifecycleCardId: [
    'build-path-lifecycle',
    eventSequence.toString(),
    lifecycleSlugByKind[lifecycleKind],
    graphDocumentId,
  ].join(':'),
  sourceKind,
  lifecycleKind,
  graphDocumentId,
  graphLabel: graphLabel?.trim() || graphDocumentId,
  eventSequence,
  ...(acceptedAt === undefined ? {} : { acceptedAt }),
  isStructural: true,
  affectsGeometry: false,
})
