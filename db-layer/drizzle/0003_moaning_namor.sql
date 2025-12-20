ALTER TABLE "delegations" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "strategy" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "wallet_actions" ALTER COLUMN "createdAt" SET DEFAULT now();