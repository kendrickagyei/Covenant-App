import "dotenv/config";
import express, { type Request, type Response } from "express";

import { jsonParser } from "./middleware";
import {
  cors,
  rateLimit,
  requireApiKeyForWrites,
  securityHeaders,
  validateEnvironment,
} from "./security";
import { errorHandler, notFound } from "./http";
import settingsRoutes from "./routes/settings";
import categoriesRoutes from "./routes/categories";
import subcategoriesRoutes from "./routes/subcategories";
import recordersRoutes from "./routes/recorders";
import recordsRoutes from "./routes/records";

validateEnvironment();

const app = express();

app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors);
app.use(rateLimit);
app.use(jsonParser);
app.use(requireApiKeyForWrites);

app.get("/", async (_req: Request, res: Response) => {
  res.json({
    message: "Covenant App API is running",
    version: "1.0.0",
  });
});

app.use("/api/settings", settingsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/subcategories", subcategoriesRoutes);
app.use("/api/recorders", recordersRoutes);
app.use("/api/records", recordsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

app.listen(PORT, () => {
  console.log(`Covenant API server is running on http://localhost:${PORT}`);
});
