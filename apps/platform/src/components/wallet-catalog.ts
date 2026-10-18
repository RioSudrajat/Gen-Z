export const walletCatalog = [
  {
    name: "MetaMask",
    icon: "/wallets/metamask.svg",
    download: "https://metamask.io/download/",
    matches: /metamask/i,
  },
  {
    name: "Rainbow",
    icon: "/wallets/rainbow.svg",
    download: "https://rainbow.me/download",
    matches: /rainbow/i,
  },
  {
    name: "Coinbase Wallet",
    icon: "/wallets/coinbase.svg",
    download: "https://www.coinbase.com/wallet/downloads",
    matches: /coinbase|base account/i,
  },
] as const;
