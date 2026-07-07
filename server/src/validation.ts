import { badRequest } from "./http";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const readBody = (body: unknown) => {
  if (!isObject(body)) {
    throw badRequest("Request body must be a JSON object");
  }

  return body;
};

export const requiredString = (
  body: Record<string, unknown>,
  field: string,
  maxLength: number
) => {
  const value = body[field];

  if (typeof value !== "string") {
    throw badRequest(`${field} is required`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw badRequest(`${field} cannot be empty`);
  }

  if (trimmed.length > maxLength) {
    throw badRequest(`${field} must be ${maxLength} characters or fewer`);
  }

  return trimmed;
};

export const optionalString = (
  body: Record<string, unknown>,
  field: string,
  maxLength: number
) => {
  const value = body[field];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw badRequest(`${field} must be a string`);
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    throw badRequest(`${field} must be ${maxLength} characters or fewer`);
  }

  return trimmed || null;
};

export const requiredPositiveInteger = (
  body: Record<string, unknown>,
  field: string
) => {
  const value = body[field];
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    throw badRequest(`${field} must be a positive integer`);
  }

  return numberValue;
};

export const requiredMoney = (body: Record<string, unknown>, field: string) => {
  const value = body[field];
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw badRequest(`${field} must be a non-negative number`);
  }

  if (numberValue > 9999999999.99) {
    throw badRequest(`${field} is too large`);
  }

  return numberValue;
};

export const requiredDate = (body: Record<string, unknown>, field: string) => {
  const value = requiredString(body, field, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw badRequest(`${field} must use YYYY-MM-DD format`);
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw badRequest(`${field} is not a valid date`);
  }

  return value;
};

export const requiredEnum = <T extends string>(
  body: Record<string, unknown>,
  field: string,
  allowed: readonly T[]
) => {
  const value = requiredString(body, field, 20);

  if (!allowed.includes(value as T)) {
    throw badRequest(`${field} must be one of: ${allowed.join(", ")}`);
  }

  return value as T;
};
