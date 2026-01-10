import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function db(connectionString: string) {
  const pool = new Pool({ connectionString, max: 5 });
  return drizzle(pool);
}

export default db;
