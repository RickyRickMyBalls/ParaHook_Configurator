export type DashboardLaneId = string

export type DashboardStickyNoteLane = DashboardLaneId

export type DashboardLaneRecord = {
  id: DashboardLaneId
  title: string
  order: number
  width: number
}

export type DashboardStickyNoteLayout = {
  noteId: string
  laneId: DashboardLaneId
  x: number
  y: number
  parentNoteId?: string
  width?: number
  height?: number
}

export type PersistedDashboardState = {
  version: 4
  lanes: DashboardLaneRecord[]
  stickyNoteLayoutsByNoteId: Record<string, DashboardStickyNoteLayout>
}

export const defaultDashboardStickyNoteWidth = 248
export const defaultDashboardStickyNoteHeight = 196
export const minimumDashboardStickyNoteWidth = 180
export const minimumDashboardStickyNoteHeight = 140

export const defaultDashboardLanes: DashboardLaneRecord[] = [
  {
    id: 'todo',
    title: 'TO DO',
    order: 0,
    width: 1,
  },
  {
    id: 'completed',
    title: 'Completed',
    order: 1,
    width: 1,
  },
]

export const defaultDashboardLaneId = defaultDashboardLanes[0]?.id ?? 'todo'
