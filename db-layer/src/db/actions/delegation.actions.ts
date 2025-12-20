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
