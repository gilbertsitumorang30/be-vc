import { db } from "../index.js";
import { users } from "../schema/users.js";

export const usersSeed = async () => {
  await db.insert(users).values([
    {
      name: "John",
      roleId: 1,
      password: "1234567890",
      username: "jhon30",
    },
    {
      name: "Jane",
      roleId: 1,
      password: "1234567890",
      username: "jhane11",
    },
  ]);
};
