import { create } from 'zustand'

export const RUNTIME_INSPECTOR_ARCHIVE_LIMIT = 6

export type RuntimeInspectorTaskState = 'queued' | 'active' | 'done' | 'reused' | 'error'

export type RuntimeInspectorTaskIdentity = {
  seq: number
  graphDocumentId: string | null
  buildRequestId: string | null
  partKey: string | null
}

export type RuntimeInspectorTask = RuntimeInspectorTaskIdentity & {
  label: string
  status: string
  progress01: number | null
  detail: string | null
  state: RuntimeInspectorTaskState
}

type RuntimeInspectorTaskStoreState = {
  activeQueue: RuntimeInspectorTask[]
  archive: RuntimeInspectorTask[]
  beginBuild: (task: RuntimeInspectorTask) => void
  upsertActiveEntry: (task: RuntimeInspectorTask) => void
  resolveEntry: (task: RuntimeInspectorTask) => void
  failBuild: (task: RuntimeInspectorTask) => void
  settleBuild: (identity: Omit<RuntimeInspectorTaskIdentity, 'partKey'>) => void
}

const sameTaskIdentity = (
  left: RuntimeInspectorTaskIdentity,
  right: RuntimeInspectorTaskIdentity,
): boolean =>
  left.seq === right.seq &&
  left.graphDocumentId === right.graphDocumentId &&
  left.buildRequestId === right.buildRequestId &&
  left.partKey === right.partKey

const sameBuildIdentity = (
  task: RuntimeInspectorTaskIdentity,
  identity: Omit<RuntimeInspectorTaskIdentity, 'partKey'>,
): boolean =>
  task.seq === identity.seq &&
  task.graphDocumentId === identity.graphDocumentId &&
  task.buildRequestId === identity.buildRequestId

const clampProgress = (value: number | null): number | null => {
  if (value === null) {
    return null
  }
  if (value < 0) {
    return 0
  }
  if (value > 1) {
    return 1
  }
  return value
}

const normalizeTask = (task: RuntimeInspectorTask): RuntimeInspectorTask => ({
  ...task,
  progress01: clampProgress(task.progress01),
})

const pushArchiveEntry = (
  archive: RuntimeInspectorTask[],
  task: RuntimeInspectorTask,
): RuntimeInspectorTask[] => {
  const normalized = normalizeTask(task)
  const withoutDuplicate = archive.filter((entry) => !sameTaskIdentity(entry, normalized))
  return [normalized, ...withoutDuplicate].slice(0, RUNTIME_INSPECTOR_ARCHIVE_LIMIT)
}

const stripBuildPlaceholder = (
  activeQueue: RuntimeInspectorTask[],
  task: RuntimeInspectorTaskIdentity,
): RuntimeInspectorTask[] => {
  if (task.partKey === null) {
    return activeQueue
  }
  return activeQueue.filter(
    (entry) => !(sameBuildIdentity(entry, task) && entry.partKey === null),
  )
}

const upsertActiveQueueEntry = (
  activeQueue: RuntimeInspectorTask[],
  task: RuntimeInspectorTask,
): RuntimeInspectorTask[] => {
  const normalized = normalizeTask(task)
  const queueWithoutPlaceholder = stripBuildPlaceholder(activeQueue, normalized)
  const existingIndex = queueWithoutPlaceholder.findIndex((entry) => sameTaskIdentity(entry, normalized))
  if (existingIndex === -1) {
    return [...queueWithoutPlaceholder, normalized]
  }
  return queueWithoutPlaceholder.map((entry, index) => (index === existingIndex ? normalized : entry))
}

const removeActiveQueueEntry = (
  activeQueue: RuntimeInspectorTask[],
  task: RuntimeInspectorTask,
): RuntimeInspectorTask[] =>
  stripBuildPlaceholder(activeQueue, task).filter((entry) => !sameTaskIdentity(entry, task))

export const selectCurrentRuntimeInspectorTask = (
  state: Pick<RuntimeInspectorTaskStoreState, 'activeQueue'>,
): RuntimeInspectorTask | null => state.activeQueue[0] ?? null

export const selectLatestArchivedRuntimeInspectorTask = (
  state: Pick<RuntimeInspectorTaskStoreState, 'archive'>,
): RuntimeInspectorTask | null => state.archive[0] ?? null

export const useRuntimeInspectorTaskStore = create<RuntimeInspectorTaskStoreState>((set) => ({
  activeQueue: [],
  archive: [],
  beginBuild: (task) => {
    set({
      activeQueue: [normalizeTask(task)],
      archive: [],
    })
  },
  upsertActiveEntry: (task) => {
    set((state) => ({
      activeQueue: upsertActiveQueueEntry(state.activeQueue, task),
    }))
  },
  resolveEntry: (task) => {
    const normalized = normalizeTask(task)
    set((state) => ({
      activeQueue: removeActiveQueueEntry(state.activeQueue, normalized),
      archive: pushArchiveEntry(state.archive, normalized),
    }))
  },
  failBuild: (task) => {
    const normalized = normalizeTask(task)
    set((state) => ({
      activeQueue: state.activeQueue.filter((entry) => !sameBuildIdentity(entry, normalized)),
      archive: pushArchiveEntry(state.archive, normalized),
    }))
  },
  settleBuild: (identity) => {
    set((state) => ({
      activeQueue: state.activeQueue.filter(
        (entry) => !(sameBuildIdentity(entry, identity) && entry.partKey === null),
      ),
    }))
  },
}))
