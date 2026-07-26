import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={compact ? "トップページへ戻る" : "Poké Analytics トップページへ"}
      className={`inline-flex items-center rounded-lg text-blue-950 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${compact ? "gap-1.5" : "gap-2.5"}`}
    >
      <Image src="/logo.svg" alt="" width={compact ? 18 : 36} height={compact ? 18 : 36} priority />
      <span className={compact ? "text-xs font-bold tracking-tight" : "text-base font-black tracking-tight"}>Poké Analytics</span>
    </Link>
  );
}
