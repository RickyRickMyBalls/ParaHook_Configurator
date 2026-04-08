import { resolveNumberExpression } from './expressions'
import { deriveProfilesWithDiagnostics } from './profileDerivation'
import { getEffectiveFeatureStack } from './featureDependencies'
import type {
  GeometryRequestExtrudeOp,
  GeometryRequestExtrudeProfileSelection,
  GeometryRequestProfileRef,
  GeometryRequestSketchOp,
  GeometryRequestSketchProfile,
} from '../contracts/geometryRequest'
import type { FeatureStack, ProfileReference } from './featureTypes'

type IRProfileReference = GeometryRequestProfileRef
type IRProfileSelection = GeometryRequestExtrudeProfileSelection

export type IRSketchProfileResolved = GeometryRequestSketchProfile

export type IRSketch = GeometryRequestSketchOp

export type IRCloseProfile = {
  op: 'closeProfile'
  featureId: string
  sourceSketchFeatureId: string | null
  profileRefResolved: IRProfileReference | null
}

export type IRExtrude = GeometryRequestExtrudeOp

export type FeatureStackIR = Array<IRSketch | IRCloseProfile | IRExtrude>

const toIRProfileRef = (profileRef: ProfileReference | null): IRProfileReference | null => {
  if (profileRef === null) {
    return null
  }
  return {
    sketchFeatureId: profileRef.sourceFeatureId,
    profileId: profileRef.profileId,
    profileIndex: profileRef.profileIndex ?? 0,
  }
}

const toIRProfileSelection = (profileRef: IRProfileReference | null): IRProfileSelection | null => {
  if (profileRef === null) {
    return null
  }
  return {
    mode: 'single',
    sketchFeatureId: profileRef.sketchFeatureId,
    profileId: profileRef.profileId,
    profileIndex: profileRef.profileIndex,
  }
}

const reconcileProfileIds = (
  resolved: ReturnType<typeof deriveProfilesWithDiagnostics>,
  legacyProfileId: string | undefined,
): IRSketchProfileResolved[] => {
  const next = resolved.profiles.map((profile, index) => ({
    profileId: profile.profileId,
    profileIndex: profile.profileIndex ?? index,
    area: profile.area,
    loop: profile.loop,
    verticesProxy: profile.verticesProxy,
  }))
  if (next.length === 1 && legacyProfileId !== undefined && legacyProfileId.length > 0) {
    next[0] = {
      ...next[0],
      profileId: legacyProfileId,
      profileIndex: 0,
    }
  }
  return next
}

export const compileFeatureStack = (stack: FeatureStack): FeatureStackIR => {
  const effectiveStack = getEffectiveFeatureStack(stack)
  const sketchProfilesByFeatureId = new Map<string, IRSketchProfileResolved[]>()
  const closeProfileByFeatureId = new Map<string, IRCloseProfile>()
  const out: FeatureStackIR = []

  for (const feature of effectiveStack) {
    if (feature.type === 'sketch') {
      const resolved = deriveProfilesWithDiagnostics(feature.components)
      const legacyPreferredProfileId = feature.outputs.profiles[0]?.profileId
      const profilesResolved = reconcileProfileIds(resolved, legacyPreferredProfileId)
      sketchProfilesByFeatureId.set(feature.featureId, profilesResolved)
      out.push({
        op: 'sketch',
        featureId: feature.featureId,
        plane: feature.plane,
        planeTransform: feature.planeTransform,
        profilesResolved,
      })
      continue
    }

    if (feature.type === 'closeProfile') {
      const sourceSketchFeatureId = feature.inputs.sourceSketchFeatureId
      const sourceProfiles =
        sourceSketchFeatureId === null
          ? []
          : (sketchProfilesByFeatureId.get(sourceSketchFeatureId) ?? [])
      const selected = sourceProfiles[0]
      const profileRefResolved =
        sourceSketchFeatureId === null || selected === undefined
          ? null
          : {
              sketchFeatureId: sourceSketchFeatureId,
              profileId: selected.profileId,
              profileIndex: 0,
            }
      const op: IRCloseProfile = {
        op: 'closeProfile',
        featureId: feature.featureId,
        sourceSketchFeatureId,
        profileRefResolved,
      }
      closeProfileByFeatureId.set(feature.featureId, op)
      out.push(op)
      continue
    }

    const directCandidate = toIRProfileRef(feature.inputs.profileRef)
    const direct =
      directCandidate === null
        ? null
        : sketchProfilesByFeatureId.has(directCandidate.sketchFeatureId)
          ? directCandidate
          : closeProfileByFeatureId.has(directCandidate.sketchFeatureId)
            ? directCandidate
            : null
    const viaClose =
      direct === null ? null : closeProfileByFeatureId.get(direct.sketchFeatureId) ?? null
    const profileRef =
      viaClose === null
        ? direct
        : viaClose.profileRefResolved === null
          ? null
          : {
              sketchFeatureId: viaClose.profileRefResolved.sketchFeatureId,
              profileId: viaClose.profileRefResolved.profileId,
              profileIndex: 0,
            }
    const profileSelection = toIRProfileSelection(profileRef)

    out.push({
      op: 'extrude',
      featureId: feature.featureId,
      profileSelection,
      profileRef,
      extrudeType: feature.params.extrudeType ?? 'Body',
      depthResolved: resolveNumberExpression(feature.params.depth),
      taperResolved: resolveNumberExpression(
        feature.params.taper ?? {
          kind: 'lit',
          value: 0,
        },
      ),
      offsetResolved: resolveNumberExpression(
        feature.params.offset ?? {
          kind: 'lit',
          value: 0,
        },
      ),
      bodyId: feature.outputs.bodyId,
    })
  }

  return out
}
