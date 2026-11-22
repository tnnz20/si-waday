CREATE TYPE "public"."ticket_status" AS ENUM('menunggu_verifikasi', 'terverifikasi', 'sedang_diproses', 'selesai', 'ditolak');--> statement-breakpoint
CREATE TYPE "public"."ticket_type" AS ENUM('dapil', 'masyarakat');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" text NOT NULL,
	"type" "ticket_type" NOT NULL,
	"reporter_nik" text NOT NULL,
	"reporter_name" text NOT NULL,
	"reporter_phone" text NOT NULL,
	"reporter_email" text,
	"reporter_address" text NOT NULL,
	"id_card_url" text,
	"kabupaten" text NOT NULL,
	"kecamatan" text NOT NULL,
	"kelurahan" text NOT NULL,
	"alamat_lokasi" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"title" text,
	"description" text NOT NULL,
	"representative_id" uuid,
	"dapil_id" text,
	"kamus_usulan" text,
	"agency" text,
	"category" text,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"document_url" text,
	"status" "ticket_status" DEFAULT 'menunggu_verifikasi' NOT NULL,
	"admin_notes" text,
	"assigned_to_user_id" uuid,
	"satisfaction_rating" integer,
	"satisfaction_aspects" jsonb,
	"satisfaction_feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_representative_id_user_profiles_id_fk" FOREIGN KEY ("representative_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_user_id_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tickets_number_idx" ON "tickets" USING btree ("ticket_number");--> statement-breakpoint
CREATE INDEX "tickets_type_status_idx" ON "tickets" USING btree ("type","status");--> statement-breakpoint
CREATE INDEX "tickets_representative_idx" ON "tickets" USING btree ("representative_id");--> statement-breakpoint
CREATE INDEX "tickets_reporter_nik_idx" ON "tickets" USING btree ("reporter_nik");--> statement-breakpoint
CREATE INDEX "tickets_created_at_idx" ON "tickets" USING btree ("created_at");