import { drizzle } from "drizzle-orm/neon-http";

function db(dbUrl: string) {
  return drizzle(dbUrl);
}

export default db;
