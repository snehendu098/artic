import { walletActions, subscriptions, strategies, delegationWallets, users } from "../schema";
import { eq, desc, inArray } from "drizzle-orm";

export type ActionType = "execution" | "deposit" | "withdrawal" | "subscription" | "strategy_created";
export type ActionStatus = "pending" | "completed" | "failed";

export interface WalletAction {
  id: string;
  subscriptionId: string | null;
  delegationWalletId: string;
  actionType: ActionType;
  description: string;
  note: string | null;
  status: ActionStatus;
  createdAt: Date | null;
}

export interface CreateWalletActionParams {
  subscriptionId?: string;
  delegationWalletId: string;
  actionType: ActionType;
  description: string;
  note?: string;
  status?: ActionStatus;
  createdAt?: Date | string;
}

export const createWalletAction = async (
  database: any,
  params: CreateWalletActionParams
): Promise<WalletAction> => {
  const createdAt = params.createdAt
    ? new Date(params.createdAt)
    : new Date();

  const inserted = await database
    .insert(walletActions)
    .values({
      subscriptionId: params.subscriptionId,
      delegationWalletId: params.delegationWalletId,
      actionType: params.actionType,
      description: params.description,
      note: params.note,
      status: params.status ?? "completed",
      createdAt,
    })
    .returning();

  return inserted[0];
};

export const createWalletActions = async (
  database: any,
  actions: CreateWalletActionParams[]
): Promise<WalletAction[]> => {
  const results: WalletAction[] = [];
  for (const action of actions) {
    const result = await createWalletAction(database, action);
    results.push(result);
  }
  return results;
};

export interface WalletActionWithDetails {
  id: string;
  actionType: ActionType;
  description: string;
  note: string | null;
  status: ActionStatus;
  createdAt: Date | null;
  strategyName: string | null;
  delegationWalletName: string;
}

export const getActionsByWallet = async (
  database: any,
  userWallet: string,
  limit: number = 20
): Promise<WalletActionWithDetails[]> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) return [];

  // Get user's delegation wallets
  const userDelegations = await database
    .select({ id: delegationWallets.id })
    .from(delegationWallets)
    .where(eq(delegationWallets.userId, user[0].id));

  if (userDelegations.length === 0) return [];

  const delegationIds = userDelegations.map((d: any) => d.id);

  // Get actions with strategy and delegation wallet names
  const results = await database
    .select({
      id: walletActions.id,
      actionType: walletActions.actionType,
      description: walletActions.description,
      note: walletActions.note,
      status: walletActions.status,
      createdAt: walletActions.createdAt,
      strategyName: strategies.name,
      delegationWalletName: delegationWallets.name,
    })
    .from(walletActions)
    .innerJoin(delegationWallets, eq(walletActions.delegationWalletId, delegationWallets.id))
    .leftJoin(subscriptions, eq(walletActions.subscriptionId, subscriptions.id))
    .leftJoin(strategies, eq(subscriptions.strategyId, strategies.id))
    .where(inArray(walletActions.delegationWalletId, delegationIds))
    .orderBy(desc(walletActions.createdAt))
    .limit(limit);

  return results;
};

export const updateActionStatus = async (
  database: any,
  actionId: string,
  status: ActionStatus,
  note?: string
): Promise<WalletAction | null> => {
  const updates: any = { status };
  if (note) updates.note = note;

  const result = await database
    .update(walletActions)
    .set(updates)
    .where(eq(walletActions.id, actionId))
    .returning();

  return result.length > 0 ? result[0] : null;
};
