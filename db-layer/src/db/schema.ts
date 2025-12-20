import {
  pgTable,
  text,
  uuid,
  foreignKey,
  boolean,
  date,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid().primaryKey(),
  wallet: text().notNull().unique(),
});

export const delegationWallets = pgTable(
  "delegations",
  {
    id: uuid().primaryKey(),
    user: text().notNull(),
    delegationWalletPk: text().notNull(),
    createdAt: date().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.user],
      foreignColumns: [userTable.wallet],
      name: "delegations_user_fk",
    }),
  ],
);

export const strategySchema = pgTable(
  "strategy",
  {
    id: uuid().primaryKey(),
    strategy: text().notNull(),
    creatorWallet: text(),
    isActive: boolean().default(false),
    createdAt: date().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.creatorWallet],
      foreignColumns: [userTable.wallet],
      name: "strategy_creator_wallet_fk",
    }),
  ],
);

export const strategySubscriptions = pgTable(
  "strategy_subscriptions",
  {
    id: uuid().primaryKey(),
    strategyId: uuid().notNull(),
    userWallet: text().notNull(),
    isActive: boolean().default(false),
    createdAt: date().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.strategyId],
      foreignColumns: [strategySchema.id],
      name: "strategy_subscription_strategy_fk",
    }),
    foreignKey({
      columns: [table.userWallet],
      foreignColumns: [userTable.wallet],
      name: "strategy_subscription_user_fk",
    }),
  ],
);

export const subscriptionWallets = pgTable(
  "subscription_wallets",
  {
    id: uuid().primaryKey(),
    subscriptionId: uuid().notNull(),
    delegationWalletId: uuid().notNull(),
    createdAt: date().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.subscriptionId],
      foreignColumns: [strategySubscriptions.id],
      name: "subscription_wallet_subscription_fk",
    }),
    foreignKey({
      columns: [table.delegationWalletId],
      foreignColumns: [delegationWallets.id],
      name: "subscription_wallet_delegation_fk",
    }),
  ],
);

export const walletActions = pgTable(
  "wallet_actions",
  {
    id: uuid().primaryKey(),
    action: text(),
    strategy: uuid(),
    stateChange: text(),
    createdAt: date().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.strategy],
      foreignColumns: [strategySchema.id],
      name: "wallet_actions_strategy_fk",
    }),
  ],
);
