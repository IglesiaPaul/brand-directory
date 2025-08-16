import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <header className="header">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="font-semibold tracking-tight">Brand Directory</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/submit" className="btn btn-ghost">Submit</Link>
            <Link href="/print-catalog" className="btn btn-ghost">Print</Link>
          </nav>
        </div>
      </header>
      <main className="main py-6">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} Hemp’in</footer>
    </div>
  );
}
