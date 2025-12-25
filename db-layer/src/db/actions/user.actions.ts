import { users } from "../schema";
import { eq } from "drizzle-orm";

export interface UserResult {
  id: string;
  wallet: string;
  username: string | null;
  createdAt: Date | null;
}

export const upsertUser = async (
  database: any,
  wallet: string,
  username?: string
): Promise<UserResult> => {
  const existing = await database
    .select()
    .from(users)
    .where(eq(users.wallet, wallet))
    .limit(1);

  if (existing && existing.length > 0) {
    return existing[0];
  }

  const inserted = await database
    .insert(users)
    .values({ wallet, username })
    .returning();

  return inserted[0];
};

export const getUserByWallet = async (
  database: any,
  wallet: string
): Promise<UserResult | null> => {
  const result = await database
    .select()
    .from(users)
    .where(eq(users.wallet, wallet))
    .limit(1);

  return result.length > 0 ? result[0] : null;
};

export const updateUsername = async (
  database: any,
  wallet: string,
  username: string
): Promise<UserResult | null> => {
  const result = await database
    .update(users)
    .set({ username })
    .where(eq(users.wallet, wallet))
    .returning();

  return result.length > 0 ? result[0] : null;
};
