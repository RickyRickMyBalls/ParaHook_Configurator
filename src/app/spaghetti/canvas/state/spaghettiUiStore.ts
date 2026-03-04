import { create } from 'zustand'

const encodeNodeSegment = (value: string): string => value.replace(/\|/g, '%7C')

export type SpaghettiUiStoreState = {
  collapsed: Record<string, boolean>
  isCollapsed: (key: string) => boolean
  toggleCollapsed: (key: string) => void
  setCollapsed: (key: string, collapsed: boolean) => void
  clearCollapsedForNode: (nodeId: string) => void
}

export const buildSectionCollapseKey = (nodeId: string, sectionId: string): string => {
  return `spSec|${encodeNodeSegment(nodeId)}|${encodeNodeSegment(sectionId)}`
}

export const buildGroupCollapseKey = (
  nodeId: string,
  sectionId: string,
  groupId: string,
): string => {
  return `spGrp|${encodeNodeSegment(nodeId)}|${encodeNodeSegment(sectionId)}|${encodeNodeSegment(groupId)}`
}

export const buildCompositeCollapseKey = (
  nodeId: string,
  sectionId: string,
  portId: string,
): string => {
  return `spComp|${encodeNodeSegment(nodeId)}|${encodeNodeSegment(sectionId)}|${encodeNodeSegment(portId)}`
}

export const useSpaghettiUiStore = create<SpaghettiUiStoreState>((set, get) => ({
  collapsed: {},
  isCollapsed: (key: string): boolean => get().collapsed[key] === true,
  toggleCollapsed: (key: string) => {
    const current = get().collapsed[key] === true
    set((state) => {
      const next = { ...state.collapsed }
      if (current) {
        delete next[key]
      } else {
        next[key] = true
      }
      return { collapsed: next }
    })
  },
  setCollapsed: (key: string, collapsed: boolean) => {
    set((state) => {
      const next = { ...state.collapsed }
      if (collapsed) {
        next[key] = true
      } else {
        delete next[key]
      }
      return { collapsed: next }
    })
  },
  clearCollapsedForNode: (nodeId: string) => {
    set((state) => {
      const prefix = `|${encodeNodeSegment(nodeId)}|`
      let changed = false
      const next = { ...state.collapsed }
      for (const key of Object.keys(next)) {
        if (!key.includes(prefix)) {
          continue
        }
        delete next[key]
        changed = true
      }
      if (!changed) {
        return state
      }
      return { collapsed: next }
    })
  },
}))
