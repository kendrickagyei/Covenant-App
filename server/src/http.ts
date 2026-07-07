import type { ErrorRequestHandler, Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message: string) => new HttpError(400, message);

export const parseIdParam = (req: Request, name = "id") => {
  const raw = req.params[name];
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest(`Invalid ${name}`);
  }

  return id;
};

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  // SQLite error codes
  const code = typeof error?.code === "string" ? error.code : "";

  // UNIQUE constraint violation
  if (code === "SQLITE_CONSTRAINT_UNIQUE" || code === "23505") {
    res.status(409).json({ error: "A matching record already exists" });
    return;
  }

  // FOREIGN KEY constraint violation
  if (code === "SQLITE_CONSTRAINT_FOREIGNKEY" || code === "23503") {
    res.status(409).json({ error: "Record is still referenced by other data" });
    return;
  }

  // CHECK constraint violation or general constraint
  if (code === "SQLITE_CONSTRAINT" || code === "23514" || code === "22P02") {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};

export const asyncRoute =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
