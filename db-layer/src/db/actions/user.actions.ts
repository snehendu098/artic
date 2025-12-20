import { userTable } from "../schema";
import { eq } from "drizzle-orm";

export interface UpsertUserResult {
  id: string;
  wallet: string;
}

export const upsertUser = async (
  database: any,
  userId: string,
  wallet: string
): Promise<UpsertUserResult> => {
  await database.insert(userTable).values({
    id: userId,
    wallet,
  }).onConflictDoNothing();

  const existingUser = await database
    .select()
    .from(userTable)
    .where(eq(userTable.wallet, wallet))
    .limit(1);

  if (!existingUser || existingUser.length === 0) {
    throw new Error("Failed to find or create user");
  }

  return {
    id: existingUser[0].id,
    wallet: existingUser[0].wallet,
  };
};
