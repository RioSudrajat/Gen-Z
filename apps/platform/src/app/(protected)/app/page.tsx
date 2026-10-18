import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/server/auth/session";
import { SignOut } from "@/components/sign-out";

export const metadata: Metadata = { title: "Wallet session" };
export default async function AppPage() {
  const session = await requireSession();
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-20"
    >
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Your wallet session is verified
      </h1>
      <p className="mt-4 leading-8 text-muted-foreground">
        You have signed in to the Gen-Z platform foundation.
      </p>
      <section
        className="mt-8 rounded-xl border bg-card p-6"
        aria-labelledby="verified-wallet"
      >
        <h2 id="verified-wallet" className="font-semibold">
          Verified wallet
        </h2>
        <p className="mt-3 break-all text-sm leading-7">{session.address}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Base Sepolia · Chain {session.chainId}
        </p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Investment workspaces are not implemented yet. This sign-in does not
          grant admin access, investment eligibility, or permission to move
          funds.
        </p>
      </section>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <SignOut />
        <Link className="button button-secondary" href="/auth">
          Sign in with another wallet
        </Link>
      </div>
    </main>
  );
}
