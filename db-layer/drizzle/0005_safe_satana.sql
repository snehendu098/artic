CREATE TABLE "strategy_subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"strategyId" uuid NOT NULL,
	"userWallet" text NOT NULL,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscription_wallets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"subscriptionId" uuid NOT NULL,
	"delegationWalletId" uuid NOT NULL,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "strategy_delegation_mappings" CASCADE;--> statement-breakpoint
ALTER TABLE "strategy_subscriptions" ADD CONSTRAINT "strategy_subscription_strategy_fk" FOREIGN KEY ("strategyId") REFERENCES "public"."strategy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy_subscriptions" ADD CONSTRAINT "strategy_subscription_user_fk" FOREIGN KEY ("userWallet") REFERENCES "public"."users"("wallet") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_wallets" ADD CONSTRAINT "subscription_wallet_subscription_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."strategy_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_wallets" ADD CONSTRAINT "subscription_wallet_delegation_fk" FOREIGN KEY ("delegationWalletId") REFERENCES "public"."delegations"("id") ON DELETE no action ON UPDATE no action;