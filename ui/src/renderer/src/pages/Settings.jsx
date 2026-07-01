/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react'
import { Upload, FileDown, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react'
import { importData, resetData, getDataInfo, parseCSV, parseJSON } from '../store/dataStore.js'

const MAX_IMPORT_SIZE_BYTES = 2 * 1024 * 1024

const Settings = ({ theme, onThemeChange }) => {
  const isDark = theme === 'dark'
  const [dataInfo, setDataInfo] = useState(getDataInfo())
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message: string }
  const [isProcessing, setIsProcessing] = useState(false)

  const refreshDataInfo = useCallback(() => {
    setDataInfo(getDataInfo())
  }, [])

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setStatus(null)

    try {
      if (file.size > MAX_IMPORT_SIZE_BYTES) {
        throw new Error('Import file is too large. Please upload a file smaller than 2 MB.')
      }

      const text = await file.text()
      const ext = file.name.split('.').pop()?.toLowerCase()

      let parsed
      if (ext === 'csv') {
        parsed = parseCSV(text)
      } else if (ext === 'json') {
        parsed = parseJSON(text)
      } else {
        throw new Error('Unsupported file format. Please upload a .csv or .json file.')
      }

      importData(parsed)
      refreshDataInfo()
      setStatus({
        type: 'success',
        message: `Successfully imported ${parsed.church_expense_tracker.records.length} records from "${file.name}".`
      })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to import file. Please check the format and try again.'
      })
    } finally {
      setIsProcessing(false)
      // Reset file input so the same file can be re-imported
      e.target.value = ''
    }
  }, [refreshDataInfo])

  const handleReset = useCallback(() => {
    resetData()
    refreshDataInfo()
    setStatus({
      type: 'success',
      message: 'Reverted to the default bundled dataset.'
    })
  }, [refreshDataInfo])

  return (
    <main className="page-content">
      <section className="page-hero">
        <div>
          <p className="page-subtitle">Application settings</p>
          <h1>Settings</h1>
          <p className="page-description">
            Adjust the app experience and manage your church data.
          </p>
        </div>
      </section>

      {/* Status message */}
      {status && (
        <div className={`import-status import-status-${status.type}`}>
          {status.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <section className="settings-grid">
        <div className="summary-block">
          <h2>Profile</h2>
          <p>Signed in as <strong>Kendrick Agyei</strong></p>
          <p>Data source: <strong>{dataInfo.congregation}</strong></p>
          <p>Period: <strong>{dataInfo.period}</strong></p>
          <p>Records: <strong>{dataInfo.recordCount.toLocaleString()} entries</strong></p>
          <p>Categories: <strong>{dataInfo.categories.length} types</strong></p>
          {dataInfo.isImported && (
            <p style={{ color: 'var(--color-accent, #2563eb)', fontWeight: 600 }}>
              Using imported data
            </p>
          )}
        </div>

        <div className="summary-block">
          <h2>Appearance</h2>
          <p>Switch between a bright workspace and a darker low-glare view.</p>
          <div className="theme-toggle-row">
            <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
            >
              <span className={`theme-toggle-knob ${isDark ? 'dark' : 'light'}`} />
            </button>
          </div>
          <p className="theme-note">Current theme is <strong>{theme}</strong>.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Data Import</h2>
          <p>
            Upload a <strong>CSV</strong> or <strong>JSON</strong> file with your church&apos;s transaction records.
            The data will be stored locally in your browser and used across all pages (dashboard, charts, reports).
          </p>

          <div className="import-controls">
            {/* File upload */}
            <label className={`import-btn ${isProcessing ? 'processing' : ''}`}>
              <Upload size={16} />
              <span>{isProcessing ? 'Processing...' : 'Upload CSV / JSON'}</span>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                disabled={isProcessing}
                style={{ display: 'none' }}
              />
            </label>

            {/* Download sample CSV */}
            <button
              type="button"
              className="import-btn secondary"
              onClick={downloadSampleCSV}
            >
              <FileDown size={16} />
              <span>Download sample CSV</span>
            </button>

            {/* Reset to default */}
            {dataInfo.isImported && (
              <button
                type="button"
                className="import-btn danger"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                <span>Reset to default data</span>
              </button>
            )}
          </div>

          <div className="import-format-help">
            <p><strong>CSV format:</strong> The file must have these columns in the header row:</p>
            <code className="format-code">
              id,date,type,category,subcategory,amount,remarks,recorded_by
            </code>
            <p><strong>JSON format:</strong> Either a full object or a flat array:</p>
            <code className="format-code block">
{`// Full structure:
{ "church_expense_tracker": { "records": [...] } }

// Or flat array:
[{ "id": "001", "date": "2026-01-04", ... }]`}
            </code>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="summary-block">
          <h2>Preferences</h2>
          <ul className="bullet-list">
            <li>Notifications: Enabled</li>
            <li>Auto-save: On</li>
            <li>Local sync: Active</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

/**
 * Generate and download a sample CSV file so users can see the expected format.
 */
function downloadSampleCSV() {
  const headers = ['id', 'date', 'type', 'category', 'subcategory', 'amount', 'remarks', 'recorded_by']
  const rows = [
    ['001', '2026-01-04', 'income', 'Offertory', 'Sunday Offertory', '1850', 'First Sunday offertory', 'Treasurer'],
    ['002', '2026-01-05', 'expense', 'Utilities', 'Electricity', '420', 'ECG bill payment', 'Treasurer'],
    ['003', '2026-01-08', 'income', 'Tithe', 'Weekly Tithe', '3200', 'Tithe collection', 'Treasurer'],
  ]

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sample-church-records.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default Settings
