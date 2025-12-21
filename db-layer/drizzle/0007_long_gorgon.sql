ALTER TABLE "strategy" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "strategy" ADD COLUMN "isPublic" boolean DEFAULT false;