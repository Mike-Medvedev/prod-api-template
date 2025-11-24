CREATE TYPE "public"."commitment_type" AS ENUM('walk', 'run', 'sleep', 'screentime');--> statement-breakpoint
CREATE TYPE "public"."duration" AS ENUM('one_weeks', 'two_weeks', 'three_weeks', 'four_weeks');--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('three_times_a_Week', 'four_times_a_Week', 'five_times_a_week', 'six_times_a_week', 'seven_times_a_week');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('stake', 'payout', 'forfeit', 'rake');--> statement-breakpoint
CREATE TABLE "commitment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "commitment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"type" "commitment_type" NOT NULL,
	"frequency" "frequency" NOT NULL,
	"duration" "duration" NOT NULL,
	"start_date" timestamp with time zone DEFAULT now() NOT NULL,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"stake_amount" bigint NOT NULL,
	CONSTRAINT "age_check1" CHECK ("commitment"."stake_amount" between 1 and 10000)
);
--> statement-breakpoint
CREATE TABLE "commitment_session" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "commitment_session_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"commitment_id" integer,
	"start_date" timestamp with time zone DEFAULT now() NOT NULL,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"session_duration" bigint DEFAULT 0 NOT NULL,
	"paused" boolean DEFAULT false,
	"completed" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"step_count" integer,
	"distance" double precision,
	"maxSpeed" double precision
);
--> statement-breakpoint
CREATE TABLE "gps_samples" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gps_samples_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"session_id" integer NOT NULL,
	"captured_at" timestamp with time zone NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"speed_mps" double precision,
	"heading_deg" double precision,
	"horiz_acc" double precision
);
--> statement-breakpoint
CREATE TABLE "motion_samples" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "motion_samples_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"session_id" integer NOT NULL,
	"captured_at" timestamp with time zone NOT NULL,
	"interval_ms" integer,
	"accel_x" double precision,
	"accel_y" double precision,
	"accel_z" double precision,
	"accel_gx" double precision,
	"accel_gy" double precision,
	"accel_gz" double precision,
	"rot_alpha" double precision,
	"rot_beta" double precision,
	"rot_gamma" double precision,
	"rot_rate_alpha" double precision,
	"rot_rate_beta" double precision,
	"rot_rate_gamma" double precision,
	"orientation" integer
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer,
	"commitment_id" integer NOT NULL,
	"transactionType" "transaction_type" NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_transaction_id" text NOT NULL,
	"stake_amount" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transaction_amount_validation" CHECK ("transactions"."stake_amount" > 50)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(50),
	"last_name" varchar(50),
	"phone" varchar(14),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "commitment" ADD CONSTRAINT "commitment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commitment_session" ADD CONSTRAINT "commitment_session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commitment_session" ADD CONSTRAINT "commitment_session_commitment_id_commitment_id_fk" FOREIGN KEY ("commitment_id") REFERENCES "public"."commitment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gps_samples" ADD CONSTRAINT "gps_samples_session_id_commitment_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."commitment_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "motion_samples" ADD CONSTRAINT "motion_samples_session_id_commitment_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."commitment_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_commitment_id_commitment_id_fk" FOREIGN KEY ("commitment_id") REFERENCES "public"."commitment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gps_session_time_idx" ON "gps_samples" USING btree ("session_id","captured_at");--> statement-breakpoint
CREATE INDEX "motion_session_time_idx" ON "motion_samples" USING btree ("session_id","captured_at");