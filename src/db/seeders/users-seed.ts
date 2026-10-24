import { db } from "../index.js";
import { users } from "../schema/users.js";
import { hashPassword } from "../../utils/password.js";

export const usersSeed = async () => {
  const password = await hashPassword("1234567890");

  await db.insert(users).values([
    {
      fullName: "John",
      email: "john@example.com",
      password: password,
      username: "jhon30",
    },
    {
      fullName: "Jane",
      email: "jane@example.com",
      password: password,
      username: "jhane11",
    },
  ]);
};
