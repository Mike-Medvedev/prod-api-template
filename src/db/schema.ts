import {
  pgTable,
  pgEnum,
  integer,
  varchar,
  bigint,
  check,
  boolean,
  timestamp,
  doublePrecision,
  index,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const commitmentTypeEnum = pgEnum("commitment_type", ["walk", "run", "sleep", "screentime"]);

export const frequencyEnum = pgEnum("frequency", [
  "three_times_a_Week",
  "four_times_a_Week",
  "five_times_a_week",
  "six_times_a_week",
  "seven_times_a_week",
]);

export const durationEnum = pgEnum("duration", [
  "one_weeks",
  "two_weeks",
  "three_weeks",
  "four_weeks",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "stake",
  "payout",
  "forfeit",
  "rake",
]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 14 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const commitments = pgTable(
  "commitment",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: commitmentTypeEnum().notNull(),
    frequency: frequencyEnum().notNull(),
    duration: durationEnum().notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
    endDate: timestamp("end_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    stakeAmount: bigint("stake_amount", { mode: "number" }).notNull(),
  },
  (table) => [check("age_check1", sql`${table.stakeAmount} between 1 and 10000`)],
);

export const commitmentSessions = pgTable("commitment_session", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  commitmentId: integer("commitment_id").references(() => commitments.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sessionDuration: bigint("session_duration", { mode: "number" }).notNull().default(0),
  paused: boolean("paused").default(false),
  completed: boolean("completed").default(false),
  verified: boolean("verified").default(false),
  stepCount: integer("step_count"),
  distance: doublePrecision(),
  maxSpeed: doublePrecision(),
});

export const motionSamples = pgTable(
  "motion_samples",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => commitmentSessions.id, { onDelete: "cascade" }),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
    intervalMs: integer("interval_ms"),

    // Acceleration (m/s^2) without gravity
    accelX: doublePrecision("accel_x"),
    accelY: doublePrecision("accel_y"),
    accelZ: doublePrecision("accel_z"),

    // Acceleration including gravity (optional)
    accelGX: doublePrecision("accel_gx"),
    accelGY: doublePrecision("accel_gy"),
    accelGZ: doublePrecision("accel_gz"),

    // Rotation (degrees)
    rotAlpha: doublePrecision("rot_alpha"),
    rotBeta: doublePrecision("rot_beta"),
    rotGamma: doublePrecision("rot_gamma"),

    // Rotation rate (deg/s)
    rotRateAlpha: doublePrecision("rot_rate_alpha"),
    rotRateBeta: doublePrecision("rot_rate_beta"),
    rotRateGamma: doublePrecision("rot_rate_gamma"),

    orientation: integer("orientation"),
  },
  (t) => [index("motion_session_time_idx").on(t.sessionId, t.capturedAt)],
);

export const gpsSamples = pgTable(
  "gps_samples",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => commitmentSessions.id, { onDelete: "cascade" }),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),

    lat: doublePrecision().notNull(),
    lng: doublePrecision().notNull(),
    speedMps: doublePrecision("speed_mps"),
    headingDeg: doublePrecision("heading_deg"),
    horizAcc: doublePrecision("horiz_acc"), //accuracy in lat/lng readings in meters
  },
  (t) => [index("gps_session_time_idx").on(t.sessionId, t.capturedAt)],
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    commitmentId: integer("commitment_id")
      .notNull()
      .references(() => commitments.id, { onDelete: "cascade" }),
    transactionType: transactionTypeEnum().notNull(),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripeTransactionId: text("stripe_transaction_id").notNull(),
    amount: bigint("stake_amount", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("transaction_amount_validation", sql`${table.amount} > 50`)],
);
