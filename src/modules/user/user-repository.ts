import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";

const publicUserColumns = {
  id: users.id,
  username: users.username,
  name: users.name,
  roleId: users.roleId,
  createAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export const findByUsername = async (username: string) => {
  const result = await db
    .select(publicUserColumns)
    .from(users)
    .where(eq(users.username, username));

  return result[0];
};

export const findByUsernameWithPassword = async (username: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  return result[0];
};

export const create = async (data: typeof users.$inferInsert) => {
  const result = await db.insert(users).values(data);

  const [user] = await db
    .select(publicUserColumns)
    .from(users)
    .where(eq(users.id, result[0].insertId));

  return user;
};

export const userRepository = {
  findByUsername,
  create,
  findByUsernameWithPassword,
};
