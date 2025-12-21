import { delegationWallets } from "../schema";
import { eq } from "drizzle-orm";

export interface CreateDelegationResult {
  delegationId: string;
  userWallet: string;
  delegationWalletPk: string;
}

export interface DelegationWallet {
  id: string;
  user: string;
  delegationWalletPk: string;
  createdAt: string | null;
}

export const createDelegation = async (
  database: any,
  delegationId: string,
  userWallet: string,
  delegationWalletPk: string
): Promise<CreateDelegationResult> => {
  await database.insert(delegationWallets).values({
    id: delegationId,
    user: userWallet,
    delegationWalletPk,
  });

  return {
    delegationId,
    userWallet,
    delegationWalletPk,
  };
};

export const getDelegationsByWallet = async (
  database: any,
  userWallet: string
): Promise<DelegationWallet[]> => {
  const delegations = await database
    .select()
    .from(delegationWallets)
    .where(eq(delegationWallets.user, userWallet));

  return delegations;
};

export const validateDelegationWalletOwnership = async (
  database: any,
  delegationWalletId: string,
  userWallet: string
): Promise<boolean> => {
  const wallet = await database
    .select()
    .from(delegationWallets)
    .where(eq(delegationWallets.id, delegationWalletId))
    .limit(1);

  if (!wallet || wallet.length === 0) {
    throw new Error("Delegation wallet not found");
  }

  if (wallet[0].user !== userWallet) {
    throw new Error("Delegation wallet does not belong to this user");
  }

  return true;
};
