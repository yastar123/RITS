import { createFileRoute } from "@/lib/route";
import { useState } from "react";
import { SearchX } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { findReservation, type Reservation } from "@/lib/reservations";

export const Route = createFileRoute("/cek-reservasi")({
  head: () => ({
    meta: [
      { title: "Cek Reservasi — Rumah Terapy Ikhtiar Sehat" },
      {
        name: "description",
        content: "Periksa status jadwal terapi Anda dengan kode reservasi atau nomor WhatsApp.",
      },
      { property: "og:title", content: "Cek Reservasi — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Periksa status jadwal terapi Anda." },
    ],
  }),
  component: CekReservasi,
});

function CekReservasi() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Cek Reservasi"
        title="Lihat status jadwal Anda"
        description="Masukkan kode reservasi (contoh: RIS-A1B2C) atau nomor WhatsApp yang Anda daftarkan."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-5 sm:py-20">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFound((await findReservation(query)) ?? null);
            setSearched(true);
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="RIS-XXXXX atau 08xx xxxx xxxx"
            className="w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Cek
          </button>
        </form>

        {searched && found && (
          <div className="mt-12 border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-7">
              <span className="font-display text-2xl text-primary">{found.code}</span>
              <span className="rounded-full bg-brand-soft px-4 py-1 text-xs text-primary">
                {found.status}
              </span>
            </div>
            <dl className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7 sm:py-7">
              {[
                ["Nama", found.name],
                ["WhatsApp", found.phone],
                ["Layanan", found.service],
                ["Jadwal", `${found.date} · ${found.time}`],
                ["Keluhan", found.note || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-1 text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {searched && !found && (
          <div className="mt-12 border border-dashed border-border px-5 py-12 sm:px-7 sm:py-14 text-center">
            <SearchX className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Reservasi tidak ditemukan. Periksa kembali kode atau nomor Anda.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
