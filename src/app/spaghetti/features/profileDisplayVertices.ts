import type { ProfileOutput } from './featureTypes'
import { tessellateProfileLoop } from '../compiler/runtimeTessellation'

export const getProfileDisplayVertices = (
  profile: Pick<ProfileOutput, 'loop' | 'verticesProxy'>,
): Array<{ x: number; y: number }> =>
  profile.loop.segments.length > 0 ? tessellateProfileLoop(profile.loop.segments) : profile.verticesProxy
