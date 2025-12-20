import { strategySchema } from "../schema";

export interface CreateStrategyResult {
  strategyId: string;
  strategy: string;
  creatorWallet: string;
  delegationWallet: string | null;
  isActive: boolean;
}

export const createStrategy = async (
  database: any,
  strategyId: string,
  strategy: string,
  creatorWallet: string,
  delegationWallet: string | null,
  isActive: boolean
): Promise<CreateStrategyResult> => {
  await database.insert(strategySchema).values({
    id: strategyId,
    strategy,
    creatorWallet,
    delegationWallet,
    isActive,
  });

  return {
    strategyId,
    strategy,
    creatorWallet,
    delegationWallet,
    isActive,
  };
};
