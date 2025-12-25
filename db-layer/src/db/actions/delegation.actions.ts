import { delegationWallets, users } from "../schema";
import { eq } from "drizzle-orm";

export interface DelegationWallet {
  id: string;
  userId: string;
  name: string;
  address: string;
  createdAt: Date | null;
}

export interface CreateDelegationParams {
  userId: string;
  name: string;
  address: string;
  encryptedPrivateKey: string;
}

export const createDelegation = async (
  database: any,
  params: CreateDelegationParams
): Promise<DelegationWallet> => {
  const inserted = await database
    .insert(delegationWallets)
    .values({
      userId: params.userId,
      name: params.name,
      address: params.address,
      encryptedPrivateKey: params.encryptedPrivateKey,
    })
    .returning();

  const { encryptedPrivateKey, ...rest } = inserted[0];
  return rest;
};

export const getDelegationsByWallet = async (
  database: any,
  userWallet: string
): Promise<DelegationWallet[]> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) {
    return [];
  }

  const delegations = await database
    .select({
      id: delegationWallets.id,
      userId: delegationWallets.userId,
      name: delegationWallets.name,
      address: delegationWallets.address,
      createdAt: delegationWallets.createdAt,
    })
    .from(delegationWallets)
    .where(eq(delegationWallets.userId, user[0].id));

  return delegations;
};

export const getDelegationById = async (
  database: any,
  delegationId: string
): Promise<(DelegationWallet & { encryptedPrivateKey: string }) | null> => {
  const result = await database
    .select()
    .from(delegationWallets)
    .where(eq(delegationWallets.id, delegationId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
};

export const validateDelegationOwnership = async (
  database: any,
  delegationWalletId: string,
  userId: string
): Promise<boolean> => {
  const wallet = await database
    .select()
    .from(delegationWallets)
    .where(eq(delegationWallets.id, delegationWalletId))
    .limit(1);

  if (!wallet || wallet.length === 0) {
    throw new Error("Delegation wallet not found");
  }

  if (wallet[0].userId !== userId) {
    throw new Error("Delegation wallet does not belong to this user");
  }

  return true;
};
