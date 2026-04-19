import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  readPersistedUiPrefs,
  serializePersistedUiPrefs,
  writePersistedUiPrefs,
} from './uiPrefsPersistence'
import { useUiPrefsStore } from './uiPrefsStore'

export function useUiPrefsPersistenceBridge() {
  const hasHydratedUiPrefsPersistenceRef = useRef(false)

  useLayoutEffect(() => {
    if (hasHydratedUiPrefsPersistenceRef.current) {
      return
    }
    hasHydratedUiPrefsPersistenceRef.current = true

    const persistedUiPrefs = readPersistedUiPrefs()
    if (persistedUiPrefs !== null) {
      useUiPrefsStore.setState({
        view: persistedUiPrefs.view,
      })
    }

    writePersistedUiPrefs(serializePersistedUiPrefs(useUiPrefsStore.getState().view))
  }, [])

  useEffect(() => {
    const unsubscribe = useUiPrefsStore.subscribe((state) => {
      if (!hasHydratedUiPrefsPersistenceRef.current) {
        return
      }
      writePersistedUiPrefs(serializePersistedUiPrefs(state.view))
    })
    return unsubscribe
  }, [])
}
