import "../../config/env.js";

import { rolesSeed } from "./roles-seed.js";
import { usersSeed } from "./users-seed.js";

const seed = async () => {
  try {
    await rolesSeed();
    await usersSeed();
    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
