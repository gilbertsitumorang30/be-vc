import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { roles } from "./roles.js";
import { permissions } from "./permissions.js";

export const rolePermissions = mysqlTable("role_permissions", {
  roleId: int("role_id").references(() => roles.id),
  permissionId: int("permission_id").references(() => permissions.id),
});
