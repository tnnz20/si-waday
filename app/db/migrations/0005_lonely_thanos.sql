CREATE TYPE "public"."feedback_type" AS ENUM('submission', 'resolution', 'general');--> statement-breakpoint
CREATE TABLE "ticket_feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid,
	"type" "feedback_type" DEFAULT 'submission' NOT NULL,
	"rating" integer NOT NULL,
	"aspects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ticket_feedbacks" ADD CONSTRAINT "ticket_feedbacks_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ticket_feedbacks_ticket_id_idx" ON "ticket_feedbacks" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "ticket_feedbacks_type_idx" ON "ticket_feedbacks" USING btree ("type");--> statement-breakpoint
CREATE INDEX "ticket_feedbacks_rating_idx" ON "ticket_feedbacks" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "ticket_feedbacks_created_at_idx" ON "ticket_feedbacks" USING btree ("created_at");--> statement-breakpoint
INSERT INTO "ticket_feedbacks" ("ticket_id", "type", "rating", "aspects", "feedback", "created_at", "updated_at")
SELECT "id", 'submission', "satisfaction_rating", COALESCE("satisfaction_aspects", '[]'::jsonb), "satisfaction_feedback", "created_at", "updated_at"
FROM "tickets"
WHERE "satisfaction_rating" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "satisfaction_rating";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "satisfaction_aspects";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "satisfaction_feedback";