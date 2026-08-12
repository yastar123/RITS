import { Link } from "@/lib/route";

import { navItems } from "./Header";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-5 sm:py-16 md:grid-cols-3">
        <div>
          <img src="/logo.png" alt="Rumah Terapy Ikhtiar Sehat" className="h-16 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Rumah sehat tradisional Chinese medicine. Perawatan holistik yang tenang, personal, dan
            berlandaskan keseimbangan tubuh.
          </p>
        </div>

        <div>
          <p className="eyebrow">Navigasi</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Kontak</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>HP / WA: 0813 6972 9617</li>
            <li>Senin – Sabtu, 08.00 – 20.00</li>
            <li>Minggu dengan perjanjian</li>
          </ul>
          <Link
            to="/reservasi"
            className="mt-6 inline-flex rounded-full border border-primary px-5 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Buat Reservasi
          </Link>
        </div>
      </div>
      <div className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Rumah Terapy Ikhtiar Sehat. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
