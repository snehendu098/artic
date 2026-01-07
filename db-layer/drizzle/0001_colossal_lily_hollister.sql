ALTER TABLE "wallet_actions" ADD COLUMN "txHash" text;--> statement-breakpoint
ALTER TABLE "wallet_actions" ADD COLUMN "blockNumber" text;--> statement-breakpoint
CREATE INDEX "wallet_actions_tx_hash_idx" ON "wallet_actions" USING btree ("txHash");