import type { Metadata } from "next";
import { WalletSignIn } from "@/components/wallet-sign-in";
import { Brand } from "@/components/brand";
import { InteractiveGenZEcosystem } from "@/components/InteractiveGenZEcosystem";
import { allowedReturnTo } from "@/lib/return-to";

export const metadata: Metadata = { title: "Wallet sign-in" };
export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const marketingOrigin =
    process.env.GENZ_MARKETING_ORIGIN?.trim() ||
    (process.env.NODE_ENV === "development" ? "http://localhost:4321" : "");
  return (
    <main id="main-content" className="auth-page" tabIndex={-1}>
      <div className="auth-sidebar">
        <header className="auth-header">
          <Brand href={marketingOrigin ? `${marketingOrigin}/` : "/auth"} />
        </header>
        <div className="auth-form" id="wallet-sign-in">
          <h1>Login</h1>
          <p className="auth-intro">
            Sign in with your wallet to continue to Gen-Z.
          </p>
          <WalletSignIn returnTo={allowedReturnTo(returnTo)} />
        </div>
        <footer className="auth-footer">
          {marketingOrigin ? (
            <>
              <a href={`${marketingOrigin}/#why`}>
                About Gen-Z <span aria-hidden="true">→</span>
              </a>
              <a href={`${marketingOrigin}/contact/`}>
                Contact Gen-Z <span aria-hidden="true">→</span>
              </a>
            </>
          ) : (
            <p>Gen-Z · Energy infrastructure and capital</p>
          )}
        </footer>
      </div>
      <aside className="auth-showcase" aria-label="Gen-Z energy ecosystem">
        <div className="auth-banner">
          <div>
            <h2>Energy, connected.</h2>
            <p>A view of the energy ecosystem behind Gen-Z.</p>
          </div>
          <a
            href={
              marketingOrigin
                ? `${marketingOrigin}/#ecosystem`
                : "#wallet-sign-in"
            }
          >
            {marketingOrigin ? "About the ecosystem" : "Wallet sign-in"}{" "}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="auth-scene">
          <InteractiveGenZEcosystem />
        </div>
      </aside>
    </main>
  );
}
