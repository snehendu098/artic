ALTER TABLE "strategies" RENAME COLUMN "description" TO "strategyCode";--> statement-breakpoint
ALTER TABLE "strategies" DROP COLUMN "strategyPrompt";