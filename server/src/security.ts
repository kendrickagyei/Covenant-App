import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "null", // Electron production (file:// protocol)
];

const parseList = (value: string | undefined, fallback: string[]) =>
  (value ?? fallback.join(","))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const allowedOrigins = new Set(parseList(process.env.ALLOWED_ORIGINS, defaultAllowedOrigins));

export const validateEnvironment = () => {
  // SQLite: no URL required, just a file path.

  if (process.env.NODE_ENV === "production" && !process.env.API_KEY) {
    throw new Error("API_KEY is required in production to protect write routes");
  }
};

export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
};

export const cors = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (origin) {
    if (!allowedOrigins.has(origin)) {
      res.status(403).json({ error: "Origin is not allowed" });
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key, Authorization");
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
};

const readPositiveIntegerEnv = (name: string, fallback: number) => {
  const raw = process.env[name];

  if (raw === undefined) {
    return fallback;
  }

  const value = Number(raw);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
};

const windows = new Map<string, { count: number; resetAt: number }>();
const rateLimitWindowMs = readPositiveIntegerEnv("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000);
const rateLimitMaxRequests = readPositiveIntegerEnv("RATE_LIMIT_MAX_REQUESTS", 300);

export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    next();
    return;
  }

  current.count += 1;

  if (current.count > rateLimitMaxRequests) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  next();
};

const getSubmittedApiKey = (req: Request) => {
  const headerKey = req.header("x-api-key");
  const auth = req.header("authorization");

  if (headerKey) {
    return headerKey;
  }

  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice("bearer ".length);
  }

  return "";
};

const secureCompare = (submitted: string, expected: string) => {
  const submittedBuffer = Buffer.from(submitted);
  const expectedBuffer = Buffer.from(expected);

  return (
    submittedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(submittedBuffer, expectedBuffer)
  );
};

export const requireApiKeyForWrites = (req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey && process.env.NODE_ENV !== "production") {
    next();
    return;
  }

  if (!expectedApiKey || !secureCompare(getSubmittedApiKey(req), expectedApiKey)) {
    res.status(401).json({ error: "A valid API key is required" });
    return;
  }

  next();
};
