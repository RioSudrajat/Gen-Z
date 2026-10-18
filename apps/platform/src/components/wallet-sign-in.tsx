"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  WalletIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useConfig, useConnectors, type Connector } from "wagmi";
import { connect, disconnect, signMessage, switchChain } from "wagmi/actions";
import { isAddressEqual } from "viem";
import { baseSepoliaChainId } from "@/lib/base";
import { WalletProvider } from "./wallet-provider";
import { Button } from "./button";
import { walletCatalog } from "./wallet-catalog";

async function post(path: string, body: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.error?.message || "Sign-in failed. Please try again.",
    );
  return result;
}

function WalletOptions({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const config = useConfig();
  const connectors = useConnectors();
  const [wallets, setWallets] = useState<readonly Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"network" | "wallet">("network");
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const signing = useRef(false);

  const providerOptions = [
    ...walletCatalog.map((entry) => ({
      ...entry,
      connector: wallets.find((wallet) =>
        entry.matches.test(`${wallet.id} ${wallet.name}`),
      ),
    })),
    ...wallets
      .filter(
        (wallet) =>
          !walletCatalog.some((entry) =>
            entry.matches.test(`${wallet.id} ${wallet.name}`),
          ),
      )
      .map((wallet) => ({
        name: wallet.id === "injected" ? "Browser wallet" : wallet.name,
        icon: wallet.icon?.startsWith("data:image/") ? wallet.icon : "",
        download: "",
        connector: wallet,
      })),
  ];

  useEffect(() => {
    if (open) heading.current?.focus();
  }, [step]);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    if (!open) {
      modal.close();
      return;
    }
    modal.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      modal.close();
    };
  }, [open]);

  useEffect(() => {
    let active = true;
    Promise.all(
      connectors.map(async (connector) => {
        try {
          return (await connector.getProvider()) ? connector : null;
        } catch {
          return null;
        }
      }),
    ).then((available) => {
      if (!active) return;
      const found = available.filter(
        (connector): connector is Connector => connector !== null,
      );
      const discovered = found.filter(
        (connector) => connector.id !== "injected",
      );
      setWallets(discovered.length ? discovered : found);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [connectors, refresh]);

  async function signIn(connector: Connector) {
    if (signing.current) return;
    signing.current = true;
    setPending(connector.uid);
    setError("");
    try {
      await disconnect(config);
      const connection = await connect(config, {
        connector,
        chainId: baseSepoliaChainId,
      });
      const address = connection.accounts[0];
      if ((await connector.getChainId()) !== baseSepoliaChainId)
        await switchChain(config, { connector, chainId: baseSepoliaChainId });
      const challenge: {
        challengeId: string;
        message: string;
        chainId: number;
      } = await post("/api/v1/auth/challenges", {
        address,
        chainId: baseSepoliaChainId,
      });
      const signature = await signMessage(config, {
        connector,
        account: address,
        message: challenge.message,
      });
      const [current] = await connector.getAccounts();
      if (
        !current ||
        !isAddressEqual(current, address) ||
        (await connector.getChainId()) !== challenge.chainId
      )
        throw new Error(
          "Your wallet account or network changed. Sign in again with the account you want to use.",
        );
      await post("/api/v1/auth/verify", {
        challengeId: challenge.challengeId,
        address,
        message: challenge.message,
        signature,
      });
      router.replace(returnTo);
      router.refresh();
    } catch (failure) {
      const rejected =
        failure instanceof Error &&
        /rejected|denied|cancel/i.test(failure.message);
      setError(
        rejected
          ? "Sign-in cancelled in your wallet. You can try again."
          : failure instanceof Error
            ? failure.message
            : "Sign-in failed. Please try again.",
      );
    } finally {
      signing.current = false;
      setPending(null);
    }
  }

  return (
    <section className="wallet-sign-in" aria-label="Wallet sign-in">
      <Button
        className="wallet-connect"
        aria-haspopup="dialog"
        onClick={() => {
          setStep(pending ? "wallet" : "network");
          if (!pending) setError("");
          setOpen(true);
        }}
      >
        <WalletIcon size={22} weight="regular" aria-hidden="true" />
        Connect Wallet
      </Button>
      <dialog
        ref={dialog}
        className="wallet-dialog"
        aria-labelledby="wallet-dialog-title"
        aria-describedby="wallet-dialog-description"
        onCancel={() => setOpen(false)}
        onClose={() => {
          if (!dialog.current?.open) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], [tabindex="0"]',
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            setOpen(false);
        }}
      >
        <button
          type="button"
          className="wallet-dialog-close"
          aria-label="Close wallet selection"
          onClick={() => setOpen(false)}
        >
          <XIcon size={22} aria-hidden="true" />
        </button>
        {step === "wallet" && (
          <button
            type="button"
            className="wallet-dialog-back"
            disabled={Boolean(pending)}
            onClick={() => {
              setStep("network");
              setError("");
            }}
          >
            <ArrowLeftIcon size={18} aria-hidden="true" /> Back
          </button>
        )}
        <h2 id="wallet-dialog-title" ref={heading} tabIndex={-1}>
          {step === "network" ? "Connect Wallet" : "Select Wallet"}
        </h2>
        <p id="wallet-dialog-description" className="wallet-dialog-description">
          {step === "network"
            ? "Choose a network to continue."
            : "Available wallets on Base Network"}
        </p>
        {step === "network" ? (
          <ul className="wallet-network-list">
            {/* TODO: Enable Solana and BNB after their authentication flows are implemented. */}
            <li>
              <button
                type="button"
                className="wallet-option wallet-network"
                disabled
              >
                <span className="wallet-option-icon">
                  <Image
                    src="/wallets/solana.svg"
                    width={30}
                    height={30}
                    alt=""
                  />
                </span>
                <span className="wallet-option-copy">
                  <span>Solana Network</span>
                  <span className="wallet-option-hint">Coming soon</span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="wallet-option wallet-network"
                onClick={() => setStep("wallet")}
              >
                <span className="wallet-option-icon">
                  <Image
                    src="/wallets/base.svg"
                    width={30}
                    height={30}
                    alt=""
                  />
                </span>
                <span className="wallet-option-copy">
                  <span>Base Network</span>
                  <span className="wallet-option-hint">
                    Select wallet · Base Sepolia
                  </span>
                </span>
                <ArrowRightIcon
                  size={20}
                  className="wallet-network-arrow"
                  aria-hidden="true"
                />
              </button>
            </li>
            <li>
              <button
                type="button"
                className="wallet-option wallet-network"
                disabled
              >
                <span className="wallet-option-icon">
                  <Image src="/wallets/bnb.svg" width={30} height={30} alt="" />
                </span>
                <span className="wallet-option-copy">
                  <span>BNB Chain</span>
                  <span className="wallet-option-hint">Coming soon</span>
                </span>
              </button>
            </li>
          </ul>
        ) : (
          <div
            className="wallet-dialog-options"
            aria-busy={Boolean(pending) || loading}
          >
            {loading ? (
              <p role="status" className="text-muted-foreground">
                Looking for compatible wallets…
              </p>
            ) : (
              <ul className="wallet-list">
                {providerOptions.map((option) => (
                  <li key={option.name + (option.connector?.uid ?? "")}>
                    {option.connector ? (
                      <button
                        type="button"
                        className="wallet-option wallet-provider-option"
                        disabled={Boolean(pending)}
                        onClick={() => signIn(option.connector!)}
                      >
                        <span className="wallet-option-icon">
                          {option.icon ? (
                            <Image
                              src={option.icon}
                              width={28}
                              height={28}
                              alt=""
                              unoptimized
                            />
                          ) : (
                            <span>{option.name.charAt(0)}</span>
                          )}
                        </span>
                        <span className="wallet-option-copy">
                          <span>{option.name}</span>
                          {pending === option.connector.uid && (
                            <span className="wallet-option-hint">
                              Confirm in your wallet…
                            </span>
                          )}
                        </span>
                      </button>
                    ) : (
                      <a
                        className="wallet-option wallet-provider-option"
                        href={option.download}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="wallet-option-icon">
                          <Image
                            src={option.icon}
                            width={28}
                            height={28}
                            alt=""
                          />
                        </span>
                        <span className="wallet-option-copy">
                          <span>{option.name}</span>
                        </span>
                        <span className="wallet-install">Get wallet</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!loading && wallets.length === 0 && (
              <p className="wallet-availability">
                No wallet detected. Choose one to install, then refresh.
              </p>
            )}
            {!loading && !pending && (
              <button
                type="button"
                className="wallet-refresh"
                onClick={() => {
                  setLoading(true);
                  window.dispatchEvent(new Event("eip6963:requestProvider"));
                  setRefresh((value) => value + 1);
                }}
              >
                Refresh wallet list
              </button>
            )}
            {pending && (
              <p role="status" className="mt-4 text-sm text-muted-foreground">
                Confirm the sign-in request in your wallet.
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-destructive/30 p-4 text-sm leading-7 text-destructive"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}

export function WalletSignIn({ returnTo }: { returnTo: string }) {
  return (
    <WalletProvider>
      <WalletOptions returnTo={returnTo} />
    </WalletProvider>
  );
}
