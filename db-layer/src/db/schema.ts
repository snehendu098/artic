import {
  pgTable,
  text,
  uuid,
  foreignKey,
  boolean,
  timestamp,
  decimal,
  integer,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

// ============================================
// 1. USERS
// ============================================
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  wallet: text().notNull().unique(),
  username: text(),
  createdAt: timestamp().defaultNow(),
});

// ============================================
// 2. DELEGATION WALLETS
// ============================================
export const delegationWallets = pgTable(
  "delegation_wallets",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    name: text().notNull(),
    address: text().notNull().unique(),
    encryptedPrivateKey: text().notNull(),
    createdAt: timestamp().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "delegation_wallets_user_fk",
    }),
  ],
);

// ============================================
// 3. STRATEGIES
// ============================================
export const strategies = pgTable(
  "strategies",
  {
    id: uuid().primaryKey().defaultRandom(),
    creatorId: uuid().notNull(),
    name: text().notNull(),
    strategyCode: text().notNull(),
    isPublic: boolean().default(false),
    priceMnt: decimal({ precision: 18, scale: 18 }),
    subscriberCount: integer().default(0),
    protocols: jsonb().$type<string[]>(),
    status: text().$type<"draft" | "active" | "paused">().default("draft"),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [users.id],
      name: "strategies_creator_fk",
    }),
    unique("strategies_creator_name_unique").on(table.creatorId, table.name),
  ],
);

// ============================================
// 4. STRATEGY PURCHASES
// ============================================
export const strategyPurchases = pgTable(
  "strategy_purchases",
  {
    id: uuid().primaryKey().defaultRandom(),
    strategyId: uuid().notNull(),
    buyerId: uuid().notNull(),
    priceMnt: decimal({ precision: 18, scale: 18 }).notNull(),
    txHash: text().notNull().unique(),
    blockNumber: integer(),
    purchasedAt: timestamp().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.strategyId],
      foreignColumns: [strategies.id],
      name: "strategy_purchases_strategy_fk",
    }),
    foreignKey({
      columns: [table.buyerId],
      foreignColumns: [users.id],
      name: "strategy_purchases_buyer_fk",
    }),
  ],
);

// ============================================
// 5. SUBSCRIPTIONS
// ============================================
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid().primaryKey().defaultRandom(),
    strategyId: uuid().notNull(),
    userId: uuid().notNull(),
    delegationWalletId: uuid().notNull(),
    isActive: boolean().default(true),
    subscribedAt: timestamp().defaultNow(),
    pausedAt: timestamp(),
  },
  (table) => [
    foreignKey({
      columns: [table.strategyId],
      foreignColumns: [strategies.id],
      name: "subscriptions_strategy_fk",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "subscriptions_user_fk",
    }),
    foreignKey({
      columns: [table.delegationWalletId],
      foreignColumns: [delegationWallets.id],
      name: "subscriptions_delegation_wallet_fk",
    }),
  ],
);

// ============================================
// 6. WALLET ACTIONS
// ============================================
export const walletActions = pgTable(
  "wallet_actions",
  {
    id: uuid().primaryKey().defaultRandom(),
    subscriptionId: uuid(),
    delegationWalletId: uuid().notNull(),
    actionType: text()
      .$type<
        | "execution"
        | "deposit"
        | "withdrawal"
        | "subscription"
        | "strategy_created"
      >()
      .notNull(),
    description: text().notNull(),
    note: text(),
    status: text()
      .$type<"pending" | "completed" | "failed">()
      .default("pending"),
    createdAt: timestamp().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.subscriptionId],
      foreignColumns: [subscriptions.id],
      name: "wallet_actions_subscription_fk",
    }),
    foreignKey({
      columns: [table.delegationWalletId],
      foreignColumns: [delegationWallets.id],
      name: "wallet_actions_delegation_wallet_fk",
    }),
  ],
);

// ============================================
// 7. CREATOR EARNINGS
// ============================================
export const creatorEarnings = pgTable(
  "creator_earnings",
  {
    id: uuid().primaryKey().defaultRandom(),
    creatorId: uuid().notNull(),
    purchaseId: uuid().notNull(),
    amountMnt: decimal({ precision: 18, scale: 18 }).notNull(),
    claimed: boolean().default(false),
    claimTxHash: text(),
    createdAt: timestamp().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [users.id],
      name: "creator_earnings_creator_fk",
    }),
    foreignKey({
      columns: [table.purchaseId],
      foreignColumns: [strategyPurchases.id],
      name: "creator_earnings_purchase_fk",
    }),
  ],
);
