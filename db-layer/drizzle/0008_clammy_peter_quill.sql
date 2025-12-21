ALTER TABLE "wallet_actions" ADD COLUMN "userWallet" text NOT NULL;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD COLUMN "delegationWalletId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD CONSTRAINT "wallet_actions_user_fk" FOREIGN KEY ("userWallet") REFERENCES "public"."users"("wallet") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD CONSTRAINT "wallet_actions_delegation_fk" FOREIGN KEY ("delegationWalletId") REFERENCES "public"."delegations"("id") ON DELETE no action ON UPDATE no action;