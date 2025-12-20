CREATE TABLE "strategy_delegation_mappings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"strategyId" uuid NOT NULL,
	"delegationWalletId" uuid NOT NULL,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "strategy" DROP CONSTRAINT "strategy_delegation_wallet_fk";
--> statement-breakpoint
ALTER TABLE "strategy_delegation_mappings" ADD CONSTRAINT "strategy_delegation_mapping_strategy_fk" FOREIGN KEY ("strategyId") REFERENCES "public"."strategy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy_delegation_mappings" ADD CONSTRAINT "strategy_delegation_mapping_wallet_fk" FOREIGN KEY ("delegationWalletId") REFERENCES "public"."delegations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy" DROP COLUMN "delegationWallet";