import { drizzle } from "drizzle-orm/neon-serverless";

function db(dbUrl: string) {
  return drizzle(dbUrl);
}

export default db;
