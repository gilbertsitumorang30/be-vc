import { mysqlTable, int, varchar, tinytext } from "drizzle-orm/mysql-core";
export const roles = mysqlTable("roles", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 100 }),
  description: tinytext(),
});
