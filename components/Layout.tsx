import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/router";

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const router = useRouter();
  const active = router.asPath === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm ${
        active ? "bg-black text-white" : "text-neutral-800 hover:bg-neutral-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <header className="header">
        <div className="container h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Hemp Brand Directory
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Directory" />
            <NavLink href="/submit" label="Submit" />
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-300"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <div className="w-5 h-0.5 bg-neutral-900" />
              <div className="w-5 h-0.5 bg-neutral-900" />
              <div className="w-5 h-0.5 bg-neutral-900" />
            </div>
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden border-t border-neutral-200">
            <nav className="container py-3 flex flex-col gap-2">
              <NavLink href="/" label="Directory" />
              <NavLink href="/submit" label="Submit" />
            </nav>
          </div>
        )}
      </header>

      <main className="main py-6">{children}</main>
      <footer className="footer">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Hemp’in</p>
          <nav className="flex items-center gap-3">
            <NavLink href="/admin" label="Admin" />
            <NavLink href="/print-catalog" label="Print" />
          </nav>
        </div>
      </footer>
    </div>
  );
}

