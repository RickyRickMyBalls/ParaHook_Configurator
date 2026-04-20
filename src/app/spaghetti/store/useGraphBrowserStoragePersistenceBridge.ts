import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  clearGraphBrowserStorageSnapshot,
  graphBrowserStoragePolicyChangedEvent,
  readGraphBrowserStoragePolicy,
  readGraphBrowserStorageSnapshot,
  serializeGraphBrowserStorageSnapshot,
  writeGraphBrowserStorageSnapshot,
  type GraphBrowserStoragePolicy,
} from './graphBrowserStoragePersistence'
import {
  selectGraphBrowserStorageWorkingSetSnapshot,
  useSpaghettiStore,
} from './useSpaghettiStore'

const isGraphBrowserStoragePolicy = (value: unknown): value is GraphBrowserStoragePolicy =>
  typeof value === 'object' &&
  value !== null &&
  (value as GraphBrowserStoragePolicy).version === 1 &&
  typeof (value as GraphBrowserStoragePolicy).rememberGraphWorkingSet === 'boolean'

export function useGraphBrowserStoragePersistenceBridge() {
  const hasHydratedGraphBrowserStorageRef = useRef(false)
  const rememberGraphWorkingSetRef = useRef(
    readGraphBrowserStoragePolicy().rememberGraphWorkingSet,
  )

  useLayoutEffect(() => {
    if (hasHydratedGraphBrowserStorageRef.current) {
      return
    }
    hasHydratedGraphBrowserStorageRef.current = true

    const policy = readGraphBrowserStoragePolicy()
    rememberGraphWorkingSetRef.current = policy.rememberGraphWorkingSet

    if (policy.rememberGraphWorkingSet) {
      const persistedSnapshot = readGraphBrowserStorageSnapshot()
      if (persistedSnapshot !== null) {
        useSpaghettiStore.getState().hydrateGraphBrowserStorageSnapshot(persistedSnapshot)
      }
      writeGraphBrowserStorageSnapshot(
        serializeGraphBrowserStorageSnapshot(
          selectGraphBrowserStorageWorkingSetSnapshot(useSpaghettiStore.getState()),
        ),
      )
      return
    }

    clearGraphBrowserStorageSnapshot()
  }, [])

  useEffect(() => {
    const unsubscribe = useSpaghettiStore.subscribe((state) => {
      if (!hasHydratedGraphBrowserStorageRef.current || !rememberGraphWorkingSetRef.current) {
        return
      }
      writeGraphBrowserStorageSnapshot(
        serializeGraphBrowserStorageSnapshot(
          selectGraphBrowserStorageWorkingSetSnapshot(state),
        ),
      )
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const handlePolicyChanged = (event: Event) => {
      const policy =
        event instanceof CustomEvent && isGraphBrowserStoragePolicy(event.detail)
          ? event.detail
          : readGraphBrowserStoragePolicy()
      rememberGraphWorkingSetRef.current = policy.rememberGraphWorkingSet

      if (!hasHydratedGraphBrowserStorageRef.current) {
        return
      }
      if (policy.rememberGraphWorkingSet) {
        writeGraphBrowserStorageSnapshot(
          serializeGraphBrowserStorageSnapshot(
            selectGraphBrowserStorageWorkingSetSnapshot(useSpaghettiStore.getState()),
          ),
        )
        return
      }
      clearGraphBrowserStorageSnapshot()
    }

    window.addEventListener(graphBrowserStoragePolicyChangedEvent, handlePolicyChanged)
    return () => {
      window.removeEventListener(graphBrowserStoragePolicyChangedEvent, handlePolicyChanged)
    }
  }, [])
}
