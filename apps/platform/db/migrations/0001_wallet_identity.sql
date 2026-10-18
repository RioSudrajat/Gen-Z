CREATE SCHEMA IF NOT EXISTS identity;

CREATE TABLE identity.wallet_accounts (
  id uuid PRIMARY KEY,
  address text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  disabled_at timestamptz
);

CREATE TABLE identity.wallet_challenges (
  id uuid PRIMARY KEY,
  browser_binding_hash char(64) NOT NULL,
  input jsonb NOT NULL,
  environment text NOT NULL CHECK (environment IN ('demo', 'testnet')),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);
CREATE INDEX wallet_challenges_expiry ON identity.wallet_challenges (expires_at);
CREATE INDEX wallet_challenges_binding ON identity.wallet_challenges (browser_binding_hash);

CREATE TABLE identity.wallet_sessions (
  token_hash char(64) PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES identity.wallet_accounts(id),
  environment text NOT NULL CHECK (environment IN ('demo', 'testnet')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL
);
CREATE INDEX wallet_sessions_account ON identity.wallet_sessions (account_id);
CREATE INDEX wallet_sessions_expiry ON identity.wallet_sessions (expires_at);

CREATE TABLE identity.auth_rate_limits (
  bucket text NOT NULL,
  minute timestamptz NOT NULL,
  attempts integer NOT NULL,
  PRIMARY KEY (bucket, minute)
);
