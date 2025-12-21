ALTER TABLE "subscription_wallets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "subscription_wallets" CASCADE;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD COLUMN "subscriptionId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD CONSTRAINT "wallet_actions_subscription_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."strategy_subscriptions"("id") ON DELETE no action ON UPDATE no action;