import type {
  ProjectAssemblyRecord,
  ProjectComponentRecord,
  ProjectContentState,
  ProjectFile,
  ProjectGraphDocumentEntry,
} from './projectContentTypes'

type CurrentProjectState = {
  currentProject: ProjectFile
}

type ProjectContentStateSource = {
  projectContent: ProjectContentState
}

type CurrentProjectContentState = CurrentProjectState & ProjectContentStateSource

export const selectCurrentProject = (state: CurrentProjectState): ProjectFile => state.currentProject

export const selectCurrentProjectId = (state: CurrentProjectState): string =>
  state.currentProject.projectFileId

export const selectCurrentProjectGraphDocuments = (
  state: CurrentProjectState,
): ProjectGraphDocumentEntry[] => state.currentProject.graphDocuments

export const selectCurrentProjectContent = (
  state: ProjectContentStateSource,
): ProjectContentState => state.projectContent

export const selectCurrentProjectRootAssembly = (
  state: CurrentProjectContentState,
): ProjectAssemblyRecord | null => {
  const rootAssemblyId = state.currentProject.rootAssemblyId
  if (rootAssemblyId === null) {
    return null
  }
  return state.projectContent.assembliesById[rootAssemblyId] ?? null
}

export const selectCurrentProjectRootComponents = (
  state: CurrentProjectContentState,
): ProjectComponentRecord[] => {
  const rootAssembly = selectCurrentProjectRootAssembly(state)
  if (rootAssembly === null) {
    return []
  }
  return rootAssembly.childRowIds
    .map((rowId) => state.projectContent.componentsById[rowId] ?? null)
    .filter((component): component is ProjectComponentRecord => component !== null)
}
