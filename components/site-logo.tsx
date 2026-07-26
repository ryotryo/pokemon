import Image from "next/image";
import Link from "next/link";

export function SiteLogo() {
  return (
    <Link
      href="/"
      aria-label="Poké Analytics トップページへ"
      className="inline-flex items-center gap-2.5 rounded-lg text-blue-950 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
    >
      <Image src="/logo.svg" alt="" width={36} height={36} priority />
      <span className="text-base font-black tracking-tight">Poké Analytics</span>
    </Link>
  );
}
