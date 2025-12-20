CREATE TABLE "delegations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"delegationWalletPk" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strategy" (
	"id" uuid PRIMARY KEY NOT NULL,
	"strategy" text NOT NULL,
	"creatorWallet" text,
	"delegationWallet" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"wallet" text NOT NULL,
	CONSTRAINT "users_wallet_unique" UNIQUE("wallet")
);
--> statement-breakpoint
CREATE TABLE "wallet_actions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"action" text,
	"strategy" uuid,
	"stateChange" text
);
--> statement-breakpoint
ALTER TABLE "delegations" ADD CONSTRAINT "delegations_user_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("wallet") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy" ADD CONSTRAINT "strategy_creator_wallet_fk" FOREIGN KEY ("creatorWallet") REFERENCES "public"."users"("wallet") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy" ADD CONSTRAINT "strategy_delegation_wallet_fk" FOREIGN KEY ("delegationWallet") REFERENCES "public"."delegations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD CONSTRAINT "wallet_actions_strategy_fk" FOREIGN KEY ("strategy") REFERENCES "public"."strategy"("id") ON DELETE no action ON UPDATE no action;