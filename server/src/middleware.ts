import express from "express";

export const jsonParser = express.json({
  limit: process.env.JSON_BODY_LIMIT ?? "100kb",
  strict: true,
});
