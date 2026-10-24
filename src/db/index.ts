import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { dbConfig } from "../config/db-config.js";

const poolConnection = mysql.createPool({
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  user: dbConfig.DB_USER,
  password: dbConfig.DB_PASSWORD,
  database: dbConfig.DB_NAME,
  connectionLimit: 20,
});
export const db = drizzle({ client: poolConnection.pool });
