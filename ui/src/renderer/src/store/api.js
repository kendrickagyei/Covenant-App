/**
 * API client for communicating with the Covenant backend server.
 *
 * All functions are async and return the parsed JSON response.
 * If the server is unreachable, callers should fall back to local data.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Generic fetch wrapper with error handling.
 */
const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `API request failed (${response.status})`)
  }

  return response.json()
}

// ─── Records ────────────────────────────────────────────────────────────────

/**
 * Fetch all tracker data in the frontend-compatible format:
 * { church_expense_tracker: { congregation, currency, period, records: [...] } }
 */
export const fetchTrackerData = () => apiFetch('/api/records?shape=tracker')

/**
 * Fetch all records as a flat array.
 */
export const fetchAllRecords = () => apiFetch('/api/records')

/**
 * Fetch a single record by ID.
 */
export const fetchRecordById = (id) => apiFetch(`/api/records/${id}`)

/**
 * Create a new record.
 * @param {object} payload - { date, type, category, subcategory, amount, remarks, recorded_by }
 */
export const createRecord = (payload) =>
  apiFetch('/api/records', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

/**
 * Update an existing record.
 * @param {number} id
 * @param {object} payload
 */
export const updateRecord = (id, payload) =>
  apiFetch(`/api/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

/**
 * Delete a record by ID.
 */
export const deleteRecord = (id) =>
  apiFetch(`/api/records/${id}`, {
    method: 'DELETE',
  })

// ─── Categories ─────────────────────────────────────────────────────────────

export const fetchCategories = () => apiFetch('/api/categories')

export const createCategory = (name, type) =>
  apiFetch('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ name, type }),
  })

export const deleteCategory = (id) =>
  apiFetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })

// ─── Subcategories ──────────────────────────────────────────────────────────

export const fetchSubcategories = () => apiFetch('/api/subcategories')

export const fetchSubcategoriesByCategory = (categoryId) =>
  apiFetch(`/api/subcategories/${categoryId}`)

export const createSubcategory = (categoryId, name) =>
  apiFetch('/api/subcategories', {
    method: 'POST',
    body: JSON.stringify({ categoryId, name }),
  })

export const deleteSubcategory = (id) =>
  apiFetch(`/api/subcategories/${id}`, {
    method: 'DELETE',
  })

// ─── Recorders ──────────────────────────────────────────────────────────────

export const fetchRecorders = () => apiFetch('/api/recorders')

export const createRecorder = (name) =>
  apiFetch('/api/recorders', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })

export const deleteRecorder = (id) =>
  apiFetch(`/api/recorders/${id}`, {
    method: 'DELETE',
  })

// ─── Settings ───────────────────────────────────────────────────────────────

export const fetchSettings = () => apiFetch('/api/settings')

export const updateSettings = (congregation, currency, period) =>
  apiFetch('/api/settings', {
    method: 'PUT',
    body: JSON.stringify({ congregation, currency, period }),
  })

// ─── Health check ───────────────────────────────────────────────────────────

/**
 * Check if the backend server is reachable.
 * Returns true if the server responds, false otherwise.
 */
export const checkServerHealth = async () => {
  try {
    const data = await apiFetch('/')
    return data?.message === 'Covenant App API is running'
  } catch {
    return false
  }
}
