import "./src/config/env.ts";
import { defineConfig } from "drizzle-kit";
import { dbConfig } from "./src/config/db-config.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "mysql",
  dbCredentials: {
    host: dbConfig.DB_HOST,
    port: dbConfig.DB_PORT,
    user: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
  },
});
