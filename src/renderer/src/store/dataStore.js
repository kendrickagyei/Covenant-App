import defaultData from '../../../../data.js'

const STORAGE_KEY = 'covenant-imported-data'

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
      // Validate that it has the expected structure
      if (parsed?.church_expense_tracker?.records) {
        return parsed
      }
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
 * Get summary info about the current dataset (for display in UI).
 */
export const getDataInfo = () => {
  const data = getData()
  const tracker = data.church_expense_tracker
  return {
    congregation: tracker.congregation,
    currency: tracker.currency,
    period: tracker.period,
    recordCount: tracker.records.length,
    categories: [...new Set(tracker.records.map((r) => r.category))],
    isImported: hasImportedData()
  }
}

/**
 * Parse a CSV string into the expected church_expense_tracker data format.
 * Expected CSV columns: id,date,type,category,subcategory,amount,remarks,recorded_by
 */
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row')

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const expected = ['id', 'date', 'type', 'category', 'subcategory', 'amount', 'remarks', 'recorded_by']

  const missing = expected.filter((e) => !headers.includes(e))
  if (missing.length > 0) {
    throw new Error(`CSV missing columns: ${missing.join(', ')}. Expected: ${expected.join(', ')}`)
  }

  const records = lines.slice(1).map((line, idx) => {
    const values = line.split(',').map((v) => v.trim())
    const record = {}
    headers.forEach((header, i) => {
      record[header] = values[i] || ''
    })
    record.amount = Number(record.amount)
    if (isNaN(record.amount)) {
      throw new Error(`Row ${idx + 2}: amount "${values[headers.indexOf('amount')]}" is not a valid number`)
    }
    return record
  })

  return {
    church_expense_tracker: {
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
      },
      records
    }
  }
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
    return parsed
  }

  // Case 2: Flat array of records
  if (Array.isArray(parsed)) {
    return {
      church_expense_tracker: {
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
        },
        records: parsed
      }
    }
  }

  throw new Error('JSON must contain either { church_expense_tracker: { records: [...] } } or a flat array of records.')
}