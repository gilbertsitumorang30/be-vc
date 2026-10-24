import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { roles } from "./roles.js";

export const users = mysqlTable("users", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 150 }).notNull(),
  username: varchar({ length: 150 }).notNull().unique(),
  password: varchar({ length: 150 }).notNull(),
  roleId: int("role_id")
    .notNull()
    .references(() => roles.id),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
