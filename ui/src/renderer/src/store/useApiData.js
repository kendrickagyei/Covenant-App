import { useState, useEffect, useCallback } from 'react'
import { getData, syncFromAPI } from './dataStore.js'
import { checkServerHealth } from './api.js'

/**
 * React hook that manages tracker data with API synchronization.
 *
 * On mount, it:
 *  1. Checks if the backend server is reachable.
 *  2. If reachable, fetches fresh data from the API and caches it locally.
 *  3. Falls back to localStorage / bundled defaults if the server is offline.
 *
 * Returns { data, loading, error, refresh } where:
 *  - data: the current tracker data object
 *  - loading: true while the initial API sync is in progress
 *  - error: any error message from the API sync (null if successful)
 *  - refresh: a function to force re-fetch from the API
 */
export function useApiData() {
  const [data, setData] = useState(() => getData())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const serverOnline = await checkServerHealth()

      if (serverOnline) {
        const apiData = await syncFromAPI()
        setData(apiData)
      } else {
        // Server is offline — use whatever is in localStorage / defaults
        setData(getData())
      }
    } catch (err) {
      // API failed — fall back to local data
      console.warn('API sync failed, using local data:', err.message)
      setError(err.message)
      setData(getData())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh: fetchData }
}
