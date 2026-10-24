import { int, mysqlTable, tinytext, varchar } from "drizzle-orm/mysql-core";

export const permissions = mysqlTable("permissions", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  description: tinytext().notNull(),
});
