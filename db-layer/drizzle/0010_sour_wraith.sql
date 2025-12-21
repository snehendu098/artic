CREATE TABLE "subscription_wallets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"subscriptionId" uuid NOT NULL,
	"delegationWalletId" uuid NOT NULL,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "subscription_wallets" ADD CONSTRAINT "subscription_wallet_subscription_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."strategy_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_wallets" ADD CONSTRAINT "subscription_wallet_delegation_fk" FOREIGN KEY ("delegationWalletId") REFERENCES "public"."delegations"("id") ON DELETE no action ON UPDATE no action;