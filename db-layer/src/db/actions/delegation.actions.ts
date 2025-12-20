import { delegationWallets } from "../schema";

export interface CreateDelegationResult {
  delegationId: string;
  userWallet: string;
  delegationWalletPk: string;
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
