CREATE TABLE "creator_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid NOT NULL,
	"purchaseId" uuid NOT NULL,
	"amountMnt" numeric(18, 18) NOT NULL,
	"claimed" boolean DEFAULT false,
	"claimTxHash" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delegation_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"encryptedPrivateKey" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "delegation_wallets_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"strategyPrompt" text NOT NULL,
	"isPublic" boolean DEFAULT false,
	"priceMnt" numeric(18, 18),
	"subscriberCount" integer DEFAULT 0,
	"protocols" jsonb,
	"status" text DEFAULT 'draft',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "strategies_creator_name_unique" UNIQUE("creatorId","name")
);
--> statement-breakpoint
CREATE TABLE "strategy_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strategyId" uuid NOT NULL,
	"buyerId" uuid NOT NULL,
	"priceMnt" numeric(18, 18) NOT NULL,
	"txHash" text NOT NULL,
	"blockNumber" integer,
	"purchasedAt" timestamp DEFAULT now(),
	CONSTRAINT "strategy_purchases_txHash_unique" UNIQUE("txHash")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strategyId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"delegationWalletId" uuid NOT NULL,
	"isActive" boolean DEFAULT true,
	"subscribedAt" timestamp DEFAULT now(),
	"pausedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet" text NOT NULL,
	"username" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "users_wallet_unique" UNIQUE("wallet")
);
--> statement-breakpoint
CREATE TABLE "wallet_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscriptionId" uuid,
	"delegationWalletId" uuid NOT NULL,
	"actionType" text NOT NULL,
	"description" text NOT NULL,
	"note" text,
	"status" text DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "creator_earnings" ADD CONSTRAINT "creator_earnings_creator_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_earnings" ADD CONSTRAINT "creator_earnings_purchase_fk" FOREIGN KEY ("purchaseId") REFERENCES "public"."strategy_purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delegation_wallets" ADD CONSTRAINT "delegation_wallets_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_creator_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy_purchases" ADD CONSTRAINT "strategy_purchases_strategy_fk" FOREIGN KEY ("strategyId") REFERENCES "public"."strategies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy_purchases" ADD CONSTRAINT "strategy_purchases_buyer_fk" FOREIGN KEY ("buyerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_strategy_fk" FOREIGN KEY ("strategyId") REFERENCES "public"."strategies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_delegation_wallet_fk" FOREIGN KEY ("delegationWalletId") REFERENCES "public"."delegation_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD CONSTRAINT "wallet_actions_subscription_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD CONSTRAINT "wallet_actions_delegation_wallet_fk" FOREIGN KEY ("delegationWalletId") REFERENCES "public"."delegation_wallets"("id") ON DELETE no action ON UPDATE no action;