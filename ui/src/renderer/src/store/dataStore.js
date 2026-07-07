import defaultData from '../../../../data.js'

const STORAGE_KEY = 'covenant-imported-data'
const REQUIRED_RECORD_FIELDS = [
  'id',
  'date',
  'type',
  'category',
  'subcategory',
  'amount',
  'remarks',
  'recorded_by'
]
const DEFAULT_IMPORT_META = {
  congregation: 'Imported Congregation',
  currency: 'GHS',
  period: 'Custom Period',
  schema: {
    id: 'Unique transaction ID',
    date: 'ISO 8601 date (YYYY-MM-DD)',
    type: 'income | expense',
    category: 'Primary classification',
    subcategory: 'Specific sub-type within category',
    amount: 'Numeric value in GHS',
    remarks: 'Free-text description',
    recorded_by: 'Person who recorded the entry'
  }
}

const toCleanString = (value) => String(value ?? '').trim()

const normalizeRecord = (record) => ({
  id: toCleanString(record.id),
  date: toCleanString(record.date),
  type: toCleanString(record.type).toLowerCase(),
  category: toCleanString(record.category),
  subcategory: toCleanString(record.subcategory),
  amount: Number(record.amount ?? 0),
  remarks: toCleanString(record.remarks),
  recorded_by: toCleanString(record.recorded_by)
})

const validateRecord = (record, rowLabel = 'Record') => {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error(`${rowLabel}: must be an object`)
  }

  const normalized = normalizeRecord(record)

  const missing = REQUIRED_RECORD_FIELDS.filter((field) => {
    if (field === 'amount') return record.amount === undefined || record.amount === null || record.amount === ''
    return normalized[field] === ''
  })

  if (missing.length > 0) {
    throw new Error(`${rowLabel}: missing required field(s): ${missing.join(', ')}`)
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized.date) || Number.isNaN(new Date(`${normalized.date}T12:00:00`).getTime())) {
    throw new Error(`${rowLabel}: date must be a valid YYYY-MM-DD value`)
  }

  if (!['income', 'expense'].includes(normalized.type)) {
    throw new Error(`${rowLabel}: type must be "income" or "expense"`)
  }

  if (!Number.isFinite(normalized.amount) || normalized.amount < 0) {
    throw new Error(`${rowLabel}: amount must be a non-negative number`)
  }

  return normalized
}

const normalizeTrackerData = (data) => {
  const tracker = data?.church_expense_tracker
  if (!tracker || !Array.isArray(tracker.records)) {
    throw new Error('Data must contain { church_expense_tracker: { records: [...] } }')
  }

  return {
    church_expense_tracker: {
      ...DEFAULT_IMPORT_META,
      congregation: toCleanString(tracker.congregation) || DEFAULT_IMPORT_META.congregation,
      currency: toCleanString(tracker.currency) || DEFAULT_IMPORT_META.currency,
      period: toCleanString(tracker.period) || DEFAULT_IMPORT_META.period,
      schema: tracker.schema && typeof tracker.schema === 'object' ? tracker.schema : DEFAULT_IMPORT_META.schema,
      records: tracker.records.map((record, index) => validateRecord(record, `Record ${index + 1}`))
    }
  }
}

/**
 * Central data store for the application.
 *
 * Returns the imported data if the user has uploaded custom data,
 * otherwise falls back to the bundled default data from data.js.
 */
export const getData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return normalizeTrackerData(parsed)
    }
  } catch {
    // Ignore parse errors, fall through to default
  }
  return defaultData
}

/**
 * Replace the current dataset with imported data.
 * @param {object} data - Object with { church_expense_tracker: { records: [...] } }
 */
export const importData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeTrackerData(data)))
}

/**
 * Clear imported data and revert to the default bundled data.
 */
export const resetData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check whether the user is currently using imported data
 * rather than the default bundled data.
 */
export const hasImportedData = () => {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}


/**
 * Sync data from the backend API into localStorage.
 * Returns the fetched data in the normalized tracker format.
 * Throws if the API is unreachable.
 */
export const syncFromAPI = async () => {
  const { fetchTrackerData } = await import('./api.js')
  const data = await fetchTrackerData()
  const normalized = normalizeTrackerData(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  return normalized
}

/**
 * Get summary info about the current dataset (for display in UI).
 */
export const getDataInfo = () => {
  const data = getData()
  const tracker = data.church_expense_tracker || defaultData.church_expense_tracker
  const records = Array.isArray(tracker.records) ? tracker.records : []
  return {
    congregation: tracker.congregation,
    currency: tracker.currency,
    period: tracker.period,
    recordCount: records.length,
    categories: [...new Set(records.map((r) => r.category).filter(Boolean))],
    isImported: hasImportedData()
  }
}

/**
 * Parse a CSV string into the expected church_expense_tracker data format.
 * Expected CSV columns: id,date,type,category,subcategory,amount,remarks,recorded_by
 */
/**
 * Parse a single CSV line into an array of values, handling quoted fields
 * (values wrapped in double quotes that may contain commas).
 */
const parseCSVLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (inQuotes) {
    throw new Error('CSV contains an unterminated quoted field')
  }
  values.push(current.trim())
  return values
}

/**
 * Parse a CSV string into the expected church_expense_tracker data format.
 * Expected CSV columns: id,date,type,category,subcategory,amount,remarks,recorded_by
 * Properly handles values wrapped in double quotes (e.g. "remarks with, commas").
 */
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/).filter((line) => line.trim())
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row')

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim())
  const expected = REQUIRED_RECORD_FIELDS

  const missing = expected.filter((e) => !headers.includes(e))
  if (missing.length > 0) {
    throw new Error(`CSV missing columns: ${missing.join(', ')}. Expected: ${expected.join(', ')}`)
  }

  const records = lines.slice(1).map((line, idx) => {
    const values = parseCSVLine(line)
    const record = {}
    headers.forEach((header, i) => {
      record[header] = values[i] || ''
    })
    return validateRecord(record, `Row ${idx + 2}`)
  })

  return normalizeTrackerData({
    church_expense_tracker: {
      ...DEFAULT_IMPORT_META,
      records
    }
  })
}

/**
 * Parse a JSON string into the expected format.
 * Accepts either the full { church_expense_tracker: { records: [...] } }
 * or a flat array of records.
 */
export const parseJSON = (jsonText) => {
  const parsed = JSON.parse(jsonText)

  // Case 1: Full structure
  if (parsed?.church_expense_tracker?.records) {
    return normalizeTrackerData(parsed)
  }

  // Case 2: Flat array of records
  if (Array.isArray(parsed)) {
    return normalizeTrackerData({
      church_expense_tracker: {
        ...DEFAULT_IMPORT_META,
        records: parsed
      }
    })
  }

  throw new Error('JSON must contain either { church_expense_tracker: { records: [...] } } or a flat array of records.')
}
