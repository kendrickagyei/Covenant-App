# Covenant Server Documentation

## Overview

This document explains the server-side code in `server/`, including key modules, middleware, database schema, route handlers, validation, and business logic. The backend uses Express 5, Drizzle ORM, and PostgreSQL.

## Folder Structure

- `server/package.json` — server dependencies and npm scripts.
- `server/drizzle.config.ts` — Drizzle Kit config for migrations and schema.
- `server/src/server.ts` — main Express app setup and route wiring.
- `server/src/index.ts` — backwards compatibility re-export of the db connection.
- `server/src/middleware.ts` — JSON body parser and simple CORS helper.
- `server/src/security.ts` — security headers, CORS, rate limiting, API key enforcement, environment validation.
- `server/src/http.ts` — HTTP error helpers, async route wrapper, and global error handling.
- `server/src/validation.ts` — reusable request body validation helpers.
- `server/src/db/index.ts` — Drizzle ORM database connection.
- `server/src/db/schema.ts` — relational schema definitions for all tables.
- `server/src/records/recordService.ts` — transaction CRUD and complex business logic.
- `server/src/records/recordValidation.ts` — mapping and validating transaction request data.
- `server/src/routes/` — REST route modules for settings, categories, subcategories, recorders, and records.

## Entry Point: `src/server.ts`

`src/server.ts` is the main Express application.

Behavior:
- Imports environment config and validates it.
- Sets up middleware:
  - disables `x-powered-by`
  - security headers
  - CORS
  - rate limiting
  - JSON request parsing
  - API-key enforcement for write operations
- Registers routes under `/api/*`.
- Adds fallback handlers for not found and error handling.
- Reads `PORT` from `process.env.PORT` or defaults to `3001`.
- Starts listening and logs the server URL.

## Server Compatibility: `src/index.ts`

This file is kept for backwards compatibility and simply re-exports the database connection from `src/db/index.ts`.

## Middleware: `src/middleware.ts`

- `jsonParser` uses `express.json()` to parse incoming JSON request bodies.
- `cors` is a minimal CORS helper that allows all origins and common HTTP methods.

## Security Helpers: `src/security.ts`

This module handles request-level security.

### Environment validation
- Ensures `DATABASE_PATH` exists.
- In production, enforces `API_KEY` for write protection.

### Security headers
- Adds `X-Content-Type-Options: nosniff`
- Adds `X-Frame-Options: DENY`
- Adds `Referrer-Policy: no-referrer`
- Adds `Cross-Origin-Resource-Policy: same-site`

### CORS handling
- Uses `ALLOWED_ORIGINS` environment variable or defaults to localhost origins.
- Validates the request origin and rejects unknown origins with `403`.
- Returns common `Access-Control-Allow-*` headers.
- Handles `OPTIONS` preflight requests with `204`.

### Rate limiting
- Tracks request counts in-memory per IP address.
- Uses `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` environment config.
- Rejects clients with more than the configured limit with `429`.

### API Key enforcement
- Allows all safe methods (`GET`, `HEAD`, `OPTIONS`) without an API key.
- For unsafe methods, validates `x-api-key` or `Authorization: Bearer <key>`.
- In non-production, allows writes when `API_KEY` is not configured.
- Rejects invalid or missing keys with `401`.

## HTTP Utilities: `src/http.ts`

### `HttpError`
- Custom error class containing an HTTP status code and message.

### `badRequest()`
- Creates `400 Bad Request` errors.

### `parseIdParam()`
- Converts route parameter values into positive integers.
- Throws `400` for invalid values.

### `notFound`
- Returns a `404 Not Found` JSON error.

### `errorHandler`
- Converts syntax errors and `HttpError` instances into proper HTTP responses.
- Handles PostgreSQL constraint errors:
  - `23505`: unique violation → `409`
  - `23503`: foreign-key violation → `409`
  - `23514` / `22P02`: invalid data → `400`
- Logs and returns `500` for unexpected server errors.

### `asyncRoute`
- Wraps async Express route handlers and forwards exceptions to the error handler.

## Validation: `src/validation.ts`

Reusable request body validation helpers used across route modules.

- `readBody(body)` ensures the request body is a JSON object.
- `requiredString(body, field, maxLength)` enforces non-empty trimmed strings.
- `optionalString(body, field, maxLength)` allows `null`, `undefined`, or empty values.
- `requiredPositiveInteger(body, field)` enforces positive integer fields.
- `requiredMoney(body, field)` enforces non-negative numeric amounts and returns a string formatted to two decimal places.
- `requiredDate(body, field)` enforces `YYYY-MM-DD` format and validates actual dates.
- `requiredEnum(body, field, allowed)` enforces that values are one of the provided allowed options.

## Database Connection: `src/db/index.ts`

- Creates a Drizzle ORM database instance using `process.env.DATABASE_PATH`.
- Exports `db` for use across route and service modules.

## Database Schema: `src/db/schema.ts`

Defines all PostgreSQL tables, constraints, and relationships.

### Tables

- `settings`
  - `id`, `congregation`, `currency`, `period`

- `categories`
  - `id`, `name`, `type`
  - `type` limited to `income`, `expense`, or `both`

- `subcategories`
  - `id`, `category_id`, `name`
  - unique constraint on `(category_id, name)`

- `recorders`
  - `id`, `name`

- `transactions`
  - `id`, `date`, `type`, `category_id`, `subcategory_id`, `amount`, `remarks`, `recorder_id`, `created_at`
  - `type` limited to `income` or `expense`
  - `amount >= 0`

### Relations

- `categories` → many `subcategories`
- `categories` → many `transactions`
- `subcategories` → one `category`
- `subcategories` → many `transactions`
- `recorders` → many `transactions`
- `transactions` → one `category`, `subcategory`, and `recorder`

## Business Logic: `src/records/recordService.ts`

This file contains more complex behavior around transaction creation, updates, and retrieval.

### Key responsibilities

- Translate database rows into frontend-friendly record objects.
- Resolve category, subcategory, and recorder names to IDs.
- Lazily create categories, subcategories, and recorders during transaction creation.
- Enforce category-type rules and existing lookup validation during updates.

### Main functions

- `getAllRecords()`
  - Loads all transactions and resolves related names using in-memory maps.
  - Returns an array of normalized record objects.

- `getTrackerResponse()`
  - Loads current settings and embed them with all records in a tracker response object.

- `getRecordById(id)`
  - Loads a single transaction by ID.
  - Throws `404` if missing.
  - Resolves related category, subcategory, and recorder names.

- `createRecord(payload)`
  - Finds or creates a category by name and transaction type.
  - Finds or creates a subcategory if provided.
  - Finds or creates a recorder by name.
  - Inserts a transaction row and returns the frontend-normalized record.

- `updateRecord(id, payload)`
  - Requires the category already exists.
  - Validates category support for the transaction type.
  - Requires the subcategory and recorder already exist.
  - Updates the transaction row, returning the normalized record.

- `deleteRecord(id)`
  - Deletes a transaction by ID.
  - Throws `404` when the record does not exist.

### Supporting helpers

- `findOrCreateCategory(name, type)` — create categories as `both` when missing.
- `validateCategoryType(categoryType, transactionType)` — prevents illegal type assignments.
- `findOrCreateSubcategoryId(categoryId, name)` — lazily creates subcategories.
- `findRequiredSubcategoryId(categoryId, name)` — requires subcategory to already exist for updates.
- `findOrCreateRecorder(name)` and `findRequiredRecorder(name)` — manage recorder lookup/upsert behavior.

## Record Validation: `src/records/recordValidation.ts`

- Defines the `TransactionType` and `RecordPayload` types.
- `parseRecordBody(body)` validates and transforms request body data for transaction create/update routes.
- Ensures fields like `date`, `type`, `category`, `amount`, and `recorded_by` are present and valid.

## Route Modules

Each file in `src/routes/` exposes a dedicated API resource.

### `routes/settings.ts`
- `GET /api/settings` — fetch current settings row or `null`.
- `PUT /api/settings` — create or update the single settings row.
- Uses a simple upsert strategy: update existing settings if present, otherwise insert.

### `routes/categories.ts`
- `GET /api/categories` — fetch all categories.
- `POST /api/categories` — create a category with `name` and `type`.
- `DELETE /api/categories/:id` — delete a category.

### `routes/subcategories.ts`
- `GET /api/subcategories` — fetch all subcategories.
- `GET /api/subcategories/:categoryId` — fetch subcategories for a category.
- `POST /api/subcategories` — create a subcategory.
- `DELETE /api/subcategories/:id` — delete a subcategory.

### `routes/recorders.ts`
- `GET /api/recorders` — fetch all recorders.
- `POST /api/recorders` — create a new recorder.
- `DELETE /api/recorders/:id` — delete a recorder.

### `routes/records.ts`
- `GET /api/records` — fetch all transaction records.
  - Supports `shape=tracker` to return the tracker payload.
- `GET /api/records/:id` — fetch one transaction by ID.
- `POST /api/records` — create a transaction record.
- `PUT /api/records/:id` — update a transaction record.
- `DELETE /api/records/:id` — delete a transaction record.

## Behavior Notes

- The server is designed to be defensive: validation happens at both API and service layers.
- Transaction creation is forgiving by auto-creating missing categories, subcategories, and recorders.
- Transaction updates are stricter: categories, subcategories, and recorders must already exist.
- Errors propagate through `asyncRoute` into a central error handler that maps common database errors to user-friendly responses.

## Deployment and Environment

Required environment variables:
- `DATABASE_URL` — SQLite database file path.
- `PORT` — optional server port (defaults to `3001`).
- `API_KEY` — required in production to protect write routes.
- `ALLOWED_ORIGINS` — optional comma-separated list of allowed origins.
- `RATE_LIMIT_WINDOW_MS` — optional rate limit window in milliseconds.
- `RATE_LIMIT_MAX_REQUESTS` — optional per-window request limit.

## Summary

The `server/` folder implements a small but structured backend with:
- centralized security and validation,
- a relational schema using Drizzle ORM,
- CRUD routes for settings, categories, subcategories, recorders, and transaction records,
- and a transaction service layer that handles the most complex business rules.

Use this document as the primary reference for understanding how the server modules work together.
