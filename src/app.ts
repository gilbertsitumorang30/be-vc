import express from "express";
import cors from "cors";
import helmet from "helmet";

import "./config/env.js";
import { errorHandler } from "./middlewares/error-middleware.js";
import { httpLogger } from "./lib/http-logger.js";
import { notFound } from "./middlewares/not-found-middleware.js";
import allRoutes from "./routes/index.js";
import { appConfig } from "./config/app-config.js";

const app = express();

const appUrls = appConfig.FRONTEND_URLS.split(",").map((url) => url.trim());

app.use(helmet());
app.use(
  cors({
    origin: appUrls,
    credentials: true,
  }),
);

app.use(httpLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", allRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
