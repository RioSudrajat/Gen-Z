import Image from "next/image";
import Link from "next/link";

export function Brand({ href = "/auth" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Gen-Z home"
      className="inline-flex min-h-11 items-center gap-2.5 rounded-sm font-semibold"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-[#1a1d23]">
        <Image src="/gen-z-symbol.svg" width={32} height={32} alt="" />
      </span>
      Gen-Z
    </Link>
  );
}
