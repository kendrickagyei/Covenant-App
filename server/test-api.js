// test-api.js - Tests every API endpoint.
// Run: node test-api.js (server must be running on port 3001)

const BASE = process.env.API_URL || 'http://localhost:3001'
let passed = 0, failed = 0, failures = []

async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  const text = await res.text()
  let json = null; try { json = JSON.parse(text) } catch {}
  return { status: res.status, json, text }
}

function assert(label, ok, detail) {
  if (ok) { passed++; console.log('  \u2713 ' + label) }
  else { failed++; const msg = '  \u2717 ' + label + (detail ? ' - ' + detail : ''); console.log(msg); failures.push(msg) }
}

async function run() {
  console.log('\n\ud83e\uddea Covenant API Tests\n')
  let r

  console.log('\n--- GET / ---')
  r = await api('GET', '/')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('message', r.json?.message === 'Covenant App API is running')

  console.log('\n--- GET /api/settings ---')
  r = await api('GET', '/api/settings')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('has congregation', typeof r.json?.congregation === 'string')
  assert('has currency', typeof r.json?.currency === 'string')

  console.log('\n--- PUT /api/settings ---')
  r = await api('PUT', '/api/settings', { congregation: 'Test Church', currency: 'USD', period: 'Q3 2026' })
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('success message', r.json?.message?.includes('saved'))
  await api('PUT', '/api/settings', { congregation: 'Presbyterian Church of Ghana \u2014 Covenant Family', currency: 'GHS', period: 'January\u2013June 2026' })

  console.log('\n--- PUT /api/settings validation ---')
  r = await api('PUT', '/api/settings', {})
  assert('Missing fields returns 400', r.status === 400, 'got ' + r.status)

  console.log('\n--- GET /api/categories ---')
  r = await api('GET', '/api/categories')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('15 categories', r.json.length === 15, 'got ' + r.json.length)

  console.log('\n--- POST /api/categories ---')
  r = await api('POST', '/api/categories', { name: 'TestAPI', type: 'both' })
  assert('Status 201', r.status === 201, 'got ' + r.status)
  const catId = r.json?.id

  console.log('\n--- POST /api/categories validation ---')
  r = await api('POST', '/api/categories', {})
  assert('Missing fields returns 400', r.status === 400, 'got ' + r.status)

  console.log('\n--- GET /api/subcategories ---')
  r = await api('GET', '/api/subcategories')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('34 subcategories', r.json.length === 34, 'got ' + r.json.length)

  console.log('\n--- GET /api/subcategories/1 ---')
  r = await api('GET', '/api/subcategories/1')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('All categoryId 1', r.json.every(s => s.categoryId === 1))

  console.log('\n--- POST /api/subcategories ---')
  r = await api('POST', '/api/subcategories', { categoryId: catId, name: 'TestSub' })
  assert('Status 201', r.status === 201, 'got ' + r.status)
  const subId = r.json?.id

  console.log('\n--- POST /api/subcategories FK violation ---')
  r = await api('POST', '/api/subcategories', { categoryId: 99999, name: 'Orphan' })
  assert('Invalid FK returns 409', r.status === 409, 'got ' + r.status)

  console.log('\n--- GET /api/recorders ---')
  r = await api('GET', '/api/recorders')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('10 recorders', r.json.length === 10, 'got ' + r.json.length)

  console.log('\n--- POST /api/recorders ---')
  r = await api('POST', '/api/recorders', { name: 'TestRecorder' })
  assert('Status 201', r.status === 201, 'got ' + r.status)
  const recId = r.json?.id

  console.log('\n--- GET /api/records ---')
  r = await api('GET', '/api/records')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('68 records', r.json.length === 68, 'got ' + r.json.length)
  assert('Has category name', typeof r.json[0]?.category === 'string')

  console.log('\n--- GET /api/records?shape=tracker ---')
  r = await api('GET', '/api/records?shape=tracker')
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('Has tracker shape', !!r.json?.church_expense_tracker)
  assert('68 records in tracker', r.json?.church_expense_tracker?.records?.length === 68)

  console.log('\n--- POST /api/records ---')
  r = await api('POST', '/api/records', { date: '2026-07-01', type: 'income', category: 'Offertory', subcategory: 'Sunday Offertory', amount: 2500, remarks: 'July test', recorded_by: 'Treasurer' })
  assert('Status 201', r.status === 201, 'got ' + r.status)
  assert('amount 2500', r.json?.amount === 2500)
  const txId = r.json?.id

  console.log('\n--- GET /api/records/' + txId + ' ---')
  r = await api('GET', '/api/records/' + txId)
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('category Offertory', r.json?.category === 'Offertory')

  console.log('\n--- GET /api/records/99999 ---')
  r = await api('GET', '/api/records/99999')
  assert('Status 404', r.status === 404, 'got ' + r.status)

  console.log('\n--- PUT /api/records/' + txId + ' ---')
  r = await api('PUT', '/api/records/' + txId, { date: '2026-07-15', type: 'expense', category: 'Utilities', subcategory: 'Electricity', amount: 350, remarks: 'Updated', recorded_by: 'Treasurer' })
  assert('Status 200', r.status === 200, 'got ' + r.status)
  assert('amount 350', r.json?.amount === 350)
  assert('type expense', r.json?.type === 'expense')

  console.log('\n--- PUT /api/records/99999 ---')
  r = await api('PUT', '/api/records/99999', { date: '2026-01-01', type: 'income', category: 'Offertory', amount: 10, recorded_by: 'Treasurer' })
  assert('Status 404', r.status === 404, 'got ' + r.status)

  console.log('\n--- POST /api/records validation ---')
  r = await api('POST', '/api/records', {})
  assert('Missing fields 400', r.status === 400, 'got ' + r.status)
  r = await api('POST', '/api/records', { date: 'bad', type: 'income', category: 'X', amount: 10, recorded_by: 'Y' })
  assert('Invalid date 400', r.status === 400, 'got ' + r.status)
  r = await api('POST', '/api/records', { date: '2026-01-01', type: 'nope', category: 'X', amount: 10, recorded_by: 'Y' })
  assert('Invalid type 400', r.status === 400, 'got ' + r.status)
  r = await api('POST', '/api/records', { date: '2026-01-01', type: 'income', category: 'X', amount: -5, recorded_by: 'Y' })
  assert('Negative amount 400', r.status === 400, 'got ' + r.status)

  console.log('\n--- DELETE /api/records/' + txId + ' ---')
  r = await api('DELETE', '/api/records/' + txId)
  assert('Status 200', r.status === 200, 'got ' + r.status)
  r = await api('GET', '/api/records/' + txId)
  assert('Gone after delete', r.status === 404)

  console.log('\n--- DELETE /api/records/99999 ---')
  r = await api('DELETE', '/api/records/99999')
  assert('Status 404', r.status === 404, 'got ' + r.status)

  console.log('\n--- Cleanup ---')
  r = await api('DELETE', '/api/subcategories/' + subId)
  assert('Delete subcategory', r.status === 200)
  r = await api('DELETE', '/api/categories/' + catId)
  assert('Delete category', r.status === 200)
  r = await api('DELETE', '/api/recorders/' + recId)
  assert('Delete recorder', r.status === 200)

  console.log('\n--- Final verification ---')
  r = await api('GET', '/api/records')
  assert('68 records intact', r.json.length === 68, 'got ' + r.json.length)
  r = await api('GET', '/api/categories')
  assert('15 categories intact', r.json.length === 15, 'got ' + r.json.length)
  r = await api('GET', '/api/subcategories')
  assert('34 subcategories intact', r.json.length === 34, 'got ' + r.json.length)
  r = await api('GET', '/api/recorders')
  assert('10 recorders intact', r.json.length === 10, 'got ' + r.json.length)

  console.log('\n--- Unknown route ---')
  r = await api('GET', '/api/nonexistent')
  assert('Status 404', r.status === 404, 'got ' + r.status)

  console.log('\n' + '='.repeat(50))
  console.log(' RESULTS: ' + passed + ' passed, ' + failed + ' failed')
  console.log('='.repeat(50))
  if (failures.length > 0) { console.log('\nFailures:'); failures.forEach(f => console.log(f)) }
  process.exit(failed > 0 ? 1 : 0)
}

run().catch(e => { console.error(e); process.exit(1) })
