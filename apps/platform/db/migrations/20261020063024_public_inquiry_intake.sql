CREATE SCHEMA "intake";

CREATE TABLE "intake"."inquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"key_hash" char(64) NOT NULL,
	"request_hash" char(64) NOT NULL,
	"topic" text NOT NULL,
	"payload" jsonb NOT NULL,
	"privacy_notice_version_id" uuid NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_interaction_at" timestamp with time zone DEFAULT now() NOT NULL,
	"retention_due_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '90 days' NOT NULL,
	CONSTRAINT "inquiries_reference_unique" UNIQUE("reference"),
	CONSTRAINT "inquiries_key_hash_unique" UNIQUE("key_hash"),
	CONSTRAINT "inquiries_topic_check" CHECK ("intake"."inquiries"."topic" IN ('operator', 'investor', 'partner'))
);

CREATE TABLE "intake"."notification_outbox" (
	"id" uuid PRIMARY KEY NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_outbox_inquiry_id_unique" UNIQUE("inquiry_id"),
	CONSTRAINT "inquiry_outbox_state_check" CHECK ("intake"."notification_outbox"."state" IN ('pending', 'delivered', 'failed'))
);

CREATE TABLE "intake"."rate_limits" (
	"bucket" text NOT NULL,
	"minute" timestamp with time zone NOT NULL,
	"attempts" integer NOT NULL,
	CONSTRAINT "rate_limits_bucket_minute_pk" PRIMARY KEY("bucket","minute")
);

ALTER TABLE "intake"."notification_outbox" ADD CONSTRAINT "notification_outbox_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "intake"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "inquiries_retention_due" ON "intake"."inquiries" USING btree ("retention_due_at");