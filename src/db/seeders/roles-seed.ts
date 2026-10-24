import { db } from "../index.js";
import { roles } from "../schema/roles.js";

export const rolesSeed = async () => {
  await db.insert(roles).values([
    {
      name: "admin",
      description: "Administrator sistem",
    },
    {
      name: "buyer",
      description: "Bagian purchasing",
    },
    {
      name: "accounting",
      description: "Bagian accounting",
    },
    {
      name: "cashier",
      description: "Petugas kasir",
    },
    {
      name: "warehouse",
      description: "Petugas gudang",
    },
  ]);
};
