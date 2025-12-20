import { pgTable, text, uuid, foreignKey, boolean } from "drizzle-orm/pg-core";

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
    delegationWallet: uuid(),
    isActive: boolean().default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.creatorWallet],
      foreignColumns: [userTable.wallet],
      name: "strategy_creator_wallet_fk",
    }),
    foreignKey({
      columns: [table.delegationWallet],
      foreignColumns: [delegationWallets.id],
      name: "strategy_delegation_wallet_fk",
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
  },
  (table) => [
    foreignKey({
      columns: [table.strategy],
      foreignColumns: [strategySchema.id],
      name: "wallet_actions_strategy_fk",
    }),
  ],
);
