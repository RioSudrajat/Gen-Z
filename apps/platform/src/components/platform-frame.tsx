"use client";

import { usePathname } from "next/navigation";
import { Brand } from "./brand";

export function PlatformFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/auth") return children;

  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
        <Brand />
      </header>
      <div className="grow">{children}</div>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:px-10">
        <span>Gen-Z</span>
        <span>Platform foundation</span>
      </footer>
    </>
  );
}
