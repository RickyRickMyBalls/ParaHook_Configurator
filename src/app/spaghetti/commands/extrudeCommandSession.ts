import type { GraphCommandEntryPoint } from '../../console/commandCommitContract'
import type {
  ExtrudeGraphCommandProfileSource,
} from '../../console/graphCommandAuthoring'
import {
  buildSketchProfileMemberPortId,
  listSketchProfileMemberOutputPorts,
  parseSketchProfileMemberPortId,
} from '../families/Geometry/contracts/sketchExtrudeProfileContract'
import type { SpaghettiEdge, SpaghettiNode } from '../schema/spaghettiTypes'

export const EXTRUDE_COMMAND_PATH = ['Extrude', 'Select Profiles', 'Depth'] as const

export type ExtrudeCommandStep = 'selectProfiles' | 'depth'

export type ExtrudeCommandValidationState = 'needsProfiles' | 'readyForDepth'

export type ExtrudeCommandOperationMode = 'newBody'

export type ExtrudeCommandLiveGraphState = {
  liveExtrudeNodeId: string
  createdExtrudeNodeId: string | null
  commandOwnedProfileEdgeIds: readonly string[]
  replacedProfileEdges: readonly SpaghettiEdge[]
}

export type ExtrudeCommandSession = {
  commandFamily: 'Extrude'
  lifecycleState: 'previewing'
  graphDocumentId: string
  entryPoint: GraphCommandEntryPoint
  activeStep: ExtrudeCommandStep
  selectedProfileSources: readonly ExtrudeGraphCommandProfileSource[]
  depth: number
  operationMode: ExtrudeCommandOperationMode
  validation: ExtrudeCommandValidationState
  commandPath: typeof EXTRUDE_COMMAND_PATH
  liveGraph: ExtrudeCommandLiveGraphState | null
}

export type CreateExtrudeCommandSessionOptions = {
  graphDocumentId: string
  entryPoint: GraphCommandEntryPoint
  selectedProfileSources?: readonly ExtrudeGraphCommandProfileSource[]
  depth?: number
  liveGraph?: ExtrudeCommandLiveGraphState | null
  reuseSelectedExtrudeNode?: boolean
}

export type ExtrudeProfileConsoleChoice = {
  label: string
  aliases: string[]
  profileSource: ExtrudeGraphCommandProfileSource
}

export type ResolveExtrudeProfileTokenResult =
  | { kind: 'resolved'; choice: ExtrudeProfileConsoleChoice }
  | { kind: 'ambiguous'; choices: ExtrudeProfileConsoleChoice[] }
  | { kind: 'not-found' }
  | { kind: 'no-profiles' }

export const DEFAULT_EXTRUDE_COMMAND_DEPTH = 10

const resolveExtrudeCommandSelectionState = (
  selectedProfileSources: readonly ExtrudeGraphCommandProfileSource[],
): Pick<ExtrudeCommandSession, 'activeStep' | 'validation'> => {
  if (selectedProfileSources.length > 0) {
    return {
      activeStep: 'depth',
      validation: 'readyForDepth',
    }
  }

  return {
    activeStep: 'selectProfiles',
    validation: 'needsProfiles',
  }
}

export const createExtrudeCommandSession = ({
  depth = DEFAULT_EXTRUDE_COMMAND_DEPTH,
  entryPoint,
  graphDocumentId,
  liveGraph = null,
  selectedProfileSources = [],
}: CreateExtrudeCommandSessionOptions): ExtrudeCommandSession => {
  const selectionState = resolveExtrudeCommandSelectionState(selectedProfileSources)

  return {
    commandFamily: 'Extrude',
    lifecycleState: 'previewing',
    graphDocumentId,
    entryPoint,
    activeStep: selectionState.activeStep,
    selectedProfileSources: [...selectedProfileSources],
    depth,
    operationMode: 'newBody',
    validation: selectionState.validation,
    commandPath: EXTRUDE_COMMAND_PATH,
    liveGraph,
  }
}

export const setExtrudeCommandSessionProfileSources = (
  session: ExtrudeCommandSession,
  selectedProfileSources: readonly ExtrudeGraphCommandProfileSource[],
): ExtrudeCommandSession => {
  const selectionState = resolveExtrudeCommandSelectionState(selectedProfileSources)

  return {
    ...session,
    activeStep: selectionState.activeStep,
    selectedProfileSources: [...selectedProfileSources],
    validation: selectionState.validation,
  }
}

export const setExtrudeCommandSessionDepth = (
  session: ExtrudeCommandSession,
  depth: number,
): ExtrudeCommandSession => ({
  ...session,
  depth,
})

export const setExtrudeCommandSessionLiveGraphState = (
  session: ExtrudeCommandSession,
  liveGraph: ExtrudeCommandLiveGraphState | null,
): ExtrudeCommandSession => ({
  ...session,
  liveGraph,
})

const normalizeExtrudeProfileToken = (value: string): string =>
  value.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase()

const shortenProfileId = (profileId: string): string => profileId.slice(0, 8)

export const listExtrudeProfileConsoleChoices = (
  graphNodes: readonly SpaghettiNode[],
): ExtrudeProfileConsoleChoice[] => {
  const choices: ExtrudeProfileConsoleChoice[] = []

  graphNodes
    .filter((node) => node.type === 'Geometry/Sketch')
    .forEach((node) => {
      listSketchProfileMemberOutputPorts(node).forEach((port) => {
        const parsedProfile = parseSketchProfileMemberPortId(port.portId)
        if (parsedProfile === null) {
          return
        }
        const profileIndex = choices.length + 1
        const profileId = parsedProfile.profileId
        const sourcePortId = buildSketchProfileMemberPortId(profileId)
        choices.push({
          label: `Profile ${profileIndex}`,
          aliases: [
            profileId,
            shortenProfileId(profileId),
            sourcePortId,
            `${node.nodeId}:${profileId}`,
            `${node.nodeId}:${shortenProfileId(profileId)}`,
          ],
          profileSource: {
            nodeId: node.nodeId,
            portId: sourcePortId,
          },
        })
      })
    })

  return choices
}

export const resolveExtrudeProfileConsoleToken = (
  choices: readonly ExtrudeProfileConsoleChoice[],
  token: string,
): ResolveExtrudeProfileTokenResult => {
  if (choices.length === 0) {
    return { kind: 'no-profiles' }
  }

  const normalizedToken = normalizeExtrudeProfileToken(token)
  if (normalizedToken.length === 0) {
    return { kind: 'not-found' }
  }

  const matches = choices.filter((choice) => {
    const tokens = [choice.label, ...choice.aliases]
    return tokens.some((candidate) => normalizeExtrudeProfileToken(candidate) === normalizedToken)
  })

  if (matches.length === 0) {
    return { kind: 'not-found' }
  }

  if (matches.length > 1) {
    return {
      kind: 'ambiguous',
      choices: matches,
    }
  }

  return {
    kind: 'resolved',
    choice: matches[0]!,
  }
}
