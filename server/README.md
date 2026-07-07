# Covenant App — Server

Backend API for the Covenant financial record-keeping application.  
Built with **Express 5**, **Drizzle ORM**, and **PostgreSQL**.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js + tsx |
| Framework | Express 5 |
| ORM | Drizzle ORM 0.45 |
| Database | PostgreSQL 18 |
| Driver | pg (node-postgres) |

---

## Project Structure

```
server/
├── .env                     # Environment variables
├── drizzle.config.ts        # Drizzle Kit config
├── package.json
└── src/
    ├── server.ts            # Entry point
    ├── index.ts             # Backwards-compat re-export
    ├── middleware.ts         # JSON body parser
    ├── security.ts          # CORS, rate limit, API key auth
    ├── http.ts              # HttpError, error handler, asyncRoute
    ├── validation.ts        # Body validation helpers
    ├── db/
    │   ├── index.ts         # DB connection
    │   └── schema.ts        # Table definitions
    ├── records/
    │   ├── recordService.ts
    │   └── recordValidation.ts
    └── routes/
        ├── settings.ts
        ├── categories.ts
        ├── subcategories.ts
        ├── recorders.ts
        └── records.ts
```

---

## Getting Started

**Prerequisites:** Node.js 18+, PostgreSQL 14+

```bash
cd server
npm install
psql -U postgres -c "CREATE DATABASE covenant;"
npm run db:push
npm run dev
```

Server runs at **http://localhost:3001**

---

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_PATH` | Yes | — | SQLite database file path (e.g. `./data/covenant.db`) |
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | No | `development` | `production` enforces API key |
| `API_KEY` | In prod | — | Protects write routes |
| `ALLOWED_ORIGINS` | No | `localhost:3000,3001,5173` | CORS origins |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window |
| `RATE_LIMIT_MAX_REQUESTS` | No | `300` | Max requests per window |
| `JSON_BODY_LIMIT` | No | `100kb` | Max body size |

---

## NPM Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start with auto-reload |
| `npm run start` | Start once |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to DB |
| `npm run db:studio` | Open Drizzle Studio |

---

## Database Schema

**settings** — Congregation metadata (single row)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | serial PK | |
| `congregation` | varchar(200) | Required |
| `currency` | varchar(10) | Default: GHS |
| `period` | varchar(100) | e.g. "Jan-Jun 2026" |

**categories** — Transaction groups

| Column | Type | Notes |
| --- | --- | --- |
| `id` | serial PK | |
| `name` | varchar(50) | Unique |
| `type` | varchar(10) | income, expense, or both |

**subcategories** — Category breakdowns

| Column | Type | Notes |
| --- | --- | --- |
| `id` | serial PK | |
| `category_id` | integer FK | References categories |
| `name` | varchar(100) | Unique per category |

**recorders** — People who record transactions

| Column | Type | Notes |
| --- | --- | --- |
| `id` | serial PK | |
| `name` | varchar(100) | Unique |

**transactions** — Core financial records

| Column | Type | Notes |
| --- | --- | --- |
| `id` | serial PK | |
| `date` | date | Required |
| `type` | varchar(10) | income or expense |
| `category_id` | integer FK | References categories |
| `subcategory_id` | integer FK | Nullable |
| `amount` | numeric(12,2) | >= 0 |
| `remarks` | text | Optional |
| `recorder_id` | integer FK | References recorders |
| `created_at` | timestamptz | Default: now() |

**Relationships:** categories -> subcategories (1:N), categories -> transactions (1:N), subcategories -> transactions (1:N), recorders -> transactions (1:N)

---

## API Reference

All responses are JSON. Base URL: `http://localhost:3001`

### Health Check

`GET /` — Returns `{ "message": "Covenant App API is running", "version": "1.0.0" }`

---

### Settings

`GET /api/settings` — Returns settings object or `null`

`PUT /api/settings` — Create or update

```json
{ "congregation": "Covenant Family", "currency": "GHS", "period": "Jan-Jun 2026" }
```

---

### Categories

`GET /api/categories` — List all

`POST /api/categories` — Create: `{ "name": "Welfare", "type": "both" }`

`DELETE /api/categories/:id` — Delete

---

### Subcategories

`GET /api/subcategories` — List all

`GET /api/subcategories/:categoryId` — List by category

`POST /api/subcategories` — Create: `{ "categoryId": 1, "name": "Sunday Offertory" }`

`DELETE /api/subcategories/:id` — Delete

---

### Recorders

`GET /api/recorders` — List all

`POST /api/recorders` — Create: `{ "name": "Treasurer" }`

`DELETE /api/recorders/:id` — Delete

---

### Records (Transactions)

`GET /api/records` — List all with resolved names

```json
[{
  "id": 1, "date": "2026-07-01", "type": "income",
  "category": "Offertory", "subcategory": "Sunday Offertory",
  "amount": 5000, "remarks": "Morning service", "recorded_by": "Treasurer"
}]
```

`GET /api/records?shape=tracker` — Records wrapped with settings metadata

`GET /api/records/:id` — Get single record

`POST /api/records` — Create a record

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `date` | string | Yes | YYYY-MM-DD |
| `type` | string | Yes | income or expense |
| `category` | string | Yes | Auto-created if new |
| `subcategory` | string | No | Auto-created if new |
| `amount` | number | Yes | >= 0, max 9,999,999,999.99 |
| `remarks` | string | No | Max 500 chars |
| `recorded_by` | string | Yes | Auto-created if new |

`PUT /api/records/:id` — Update (same body as create)

`DELETE /api/records/:id` — Delete

---

## Architecture Notes

### Middleware Pipeline

Requests pass through in this order:

1. **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Cross-Origin-Resource-Policy`
2. **CORS** — Allowlist-based origin validation, handles `OPTIONS` preflight
3. **Rate limiting** — In-memory per-IP sliding window (300 req / 15 min default)
4. **JSON parser** — Parses `application/json` bodies
5. **API key check** — Requires key for `POST`/`PUT`/`DELETE` (relaxed in development)

### Error Handling

- `asyncRoute` wraps handlers so thrown errors forward to the error handler (no try/catch)
- `errorHandler` translates errors into HTTP responses:
  - `HttpError` -> its status code (400, 404, etc.)
  - PG unique violation (`23505`) -> 409 Conflict
  - PG FK violation (`23503`) -> 409 Conflict
  - PG check constraint (`23514`, `22P02`) -> 400 Bad Request
  - Malformed JSON -> 400 Bad Request
  - Everything else -> 500 Internal Server Error

### Validation

| Helper | Description |
| --- | --- |
| `readBody(body)` | Ensures body is a JSON object |
| `requiredString(body, field, max)` | Non-empty, trimmed, within length |
| `optionalString(body, field, max)` | Returns null if missing/empty |
| `requiredPositiveInteger(body, field)` | Positive integer > 0 |
| `requiredMoney(body, field)` | Non-negative, 2 decimal places |
| `requiredDate(body, field)` | YYYY-MM-DD format |
| `requiredEnum(body, field, allowed)` | Must be one of allowed values |

### Security

- **Environment validation** — Fails fast on startup if required vars are missing
- **Security headers** — nosniff, DENY frame, no-referrer, same-site resource policy
- **CORS** — Configurable allowlist via `ALLOWED_ORIGINS`
- **Rate limiting** — Configurable window + max via env vars
- **API key auth** — `X-API-Key` header or `Authorization: Bearer <key>`, timing-safe comparison