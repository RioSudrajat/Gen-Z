ALTER TABLE "identity"."wallet_accounts" DROP CONSTRAINT "wallet_accounts_address_key";
ALTER TABLE "identity"."wallet_accounts" ADD COLUMN "namespace" text DEFAULT 'solana' NOT NULL;
ALTER TABLE "identity"."wallet_accounts" ADD COLUMN "chain_id" text DEFAULT 'legacy' NOT NULL;
ALTER TABLE "identity"."wallet_sessions" ADD COLUMN "proof_method" text DEFAULT 'legacy-siws' NOT NULL;
ALTER TABLE "identity"."wallet_accounts" ADD CONSTRAINT "wallet_accounts_identity_key" UNIQUE("namespace","chain_id","address");
ALTER TABLE "identity"."wallet_accounts" ADD CONSTRAINT "wallet_accounts_identity_check" CHECK ((
    ("identity"."wallet_accounts"."namespace" = 'solana' AND "identity"."wallet_accounts"."chain_id" = 'legacy') OR
    ("identity"."wallet_accounts"."namespace" = 'eip155' AND "identity"."wallet_accounts"."chain_id" IN ('8453', '84532')
      AND "identity"."wallet_accounts"."address" ~ '^0x[0-9a-f]{40}$')
  ));

-- Revoke legacy proofs at cutover; historical account identities remain intact.
DELETE FROM "identity"."wallet_sessions" WHERE "proof_method" = 'legacy-siws';
UPDATE "identity"."wallet_challenges" SET "consumed_at" = CURRENT_TIMESTAMP
WHERE "consumed_at" IS NULL AND "input"->>'namespace' IS DISTINCT FROM 'eip155';
