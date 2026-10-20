import { sql } from "drizzle-orm";
import {
  char,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

export const identity = pgSchema("identity");

export const walletAccounts = identity.table(
  "wallet_accounts",
  {
    id: uuid("id").primaryKey(),
    address: text("address").notNull(),
    namespace: text("namespace").notNull().default("solana"),
    chainId: text("chain_id").notNull().default("legacy"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
  },
  (table) => [
    unique("wallet_accounts_identity_key").on(
      table.namespace,
      table.chainId,
      table.address,
    ),
    check(
      "wallet_accounts_identity_check",
      sql`(
    (${table.namespace} = 'solana' AND ${table.chainId} = 'legacy') OR
    (${table.namespace} = 'eip155' AND ${table.chainId} IN ('8453', '84532')
      AND ${table.address} ~ '^0x[0-9a-f]{40}$')
  )`,
    ),
  ],
);

export const walletChallenges = identity.table(
  "wallet_challenges",
  {
    id: uuid("id").primaryKey(),
    browserBindingHash: char("browser_binding_hash", { length: 64 }).notNull(),
    input: jsonb("input").$type<Record<string, unknown>>().notNull(),
    environment: text("environment").$type<"demo" | "testnet">().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
  },
  (table) => [
    check(
      "wallet_challenges_environment_check",
      sql`${table.environment} IN ('demo', 'testnet')`,
    ),
    index("wallet_challenges_expiry").on(table.expiresAt),
    index("wallet_challenges_binding").on(table.browserBindingHash),
  ],
);

export const walletSessions = identity.table(
  "wallet_sessions",
  {
    tokenHash: char("token_hash", { length: 64 }).primaryKey(),
    accountId: uuid("account_id").notNull(),
    environment: text("environment").$type<"demo" | "testnet">().notNull(),
    proofMethod: text("proof_method").notNull().default("legacy-siws"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    foreignKey({
      name: "wallet_sessions_account_id_fkey",
      columns: [table.accountId],
      foreignColumns: [walletAccounts.id],
    }),
    check(
      "wallet_sessions_environment_check",
      sql`${table.environment} IN ('demo', 'testnet')`,
    ),
    index("wallet_sessions_account").on(table.accountId),
    index("wallet_sessions_expiry").on(table.expiresAt),
  ],
);

export const authRateLimits = identity.table(
  "auth_rate_limits",
  {
    bucket: text("bucket").notNull(),
    minute: timestamp("minute", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull(),
  },
  (table) => [
    primaryKey({
      name: "auth_rate_limits_pkey",
      columns: [table.bucket, table.minute],
    }),
  ],
);

export const intake = pgSchema("intake");
export const inquiries = intake.table(
  "inquiries",
  {
    id: uuid("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    keyHash: char("key_hash", { length: 64 }).notNull().unique(),
    requestHash: char("request_hash", { length: 64 }).notNull(),
    topic: text("topic").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    privacyNoticeVersionId: uuid("privacy_notice_version_id").notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastInteractionAt: timestamp("last_interaction_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    retentionDueAt: timestamp("retention_due_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '90 days'`),
  },
  (table) => [
    check(
      "inquiries_topic_check",
      sql`${table.topic} IN ('operator', 'investor', 'partner')`,
    ),
    index("inquiries_retention_due").on(table.retentionDueAt),
  ],
);

export const inquiryOutbox = intake.table(
  "notification_outbox",
  {
    id: uuid("id").primaryKey(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" })
      .unique(),
    state: text("state").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "inquiry_outbox_state_check",
      sql`${table.state} IN ('pending', 'delivered', 'failed')`,
    ),
  ],
);

export const inquiryRateLimits = intake.table(
  "rate_limits",
  {
    bucket: text("bucket").notNull(),
    minute: timestamp("minute", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull(),
  },
  (table) => [primaryKey({ columns: [table.bucket, table.minute] })],
);
