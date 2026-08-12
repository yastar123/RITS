import { Link } from "@/lib/route";
import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/reservasi", label: "Reservasi" },
  { to: "/cek-reservasi", label: "Cek Reservasi" },
  { to: "/artikel", label: "Artikel" },
  { to: "/tiktok", label: "TikTok" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5 md:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/logo.png"
            alt="Logo Rumah Terapy Ikhtiar Sehat"
            className="h-9 w-auto shrink-0 md:h-11"
          />
          <span className="hidden min-w-0 text-sm leading-tight sm:block">
            <span className="block font-display text-base">Rumah Terapy Ikhtiar Sehat</span>
            <span className="eyebrow">Traditional Chinese Medicine</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.slice(0, 6).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void signOut()}
                className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              <User className="h-4 w-4" />
              Masuk
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label="Buka menu"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 pb-6 pt-2 sm:px-5 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border/60 py-3 text-sm font-medium text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="flex w-full items-center gap-2 py-3 text-sm text-muted-foreground"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm text-primary-foreground"
            >
              <User className="h-4 w-4" />
              Masuk / Daftar
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
