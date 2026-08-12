import { createFileRoute } from "@/lib/route";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontak & Lokasi — Rumah Terapy Ikhtiar Sehat" },
      {
        name: "description",
        content:
          "Hubungi Rumah Terapy Ikhtiar Sehat di 0813 6972 9617 untuk konsultasi, jadwal terapi, dan informasi layanan TCM.",
      },
      { property: "og:title", content: "Kontak & Lokasi — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Hubungi kami untuk konsultasi dan jadwal terapi." },
    ],
  }),
  component: Contact,
});

const info = [
  { icon: Phone, label: "Telepon / WhatsApp", value: "0813 6972 9617" },
  { icon: MapPin, label: "Lokasi", value: "Jl. Sehat Sentosa No. 12, Medan" },
  { icon: Clock, label: "Jam Praktik", value: "Senin – Sabtu, 08.00 – 20.00" },
  { icon: MessageCircle, label: "Email", value: "halo@ikhtiarsehat.id" },
];

const inputClass =
  "mt-2 w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Kami senang mendengar keluhan Anda"
        description="Tanyakan apa pun seputar layanan, biaya, atau kesesuaian terapi dengan kondisi Anda."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-5 sm:py-20 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <div className="border-t border-border">
            {info.map((i) => (
              <div key={i.label} className="flex gap-4 border-b border-border py-6">
                <i.icon className="mt-1 size-5 text-primary" />
                <div>
                  <p className="eyebrow">{i.label}</p>
                  <p className="mt-1 text-sm">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://wa.me/6281369729617"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Chat via WhatsApp
          </a>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-5 border border-border bg-card p-5 sm:gap-6 sm:p-8"
        >
          <h2 className="text-2xl">Kirim pesan</h2>
          <label className="text-sm">
            Nama
            <input required className={inputClass} placeholder="Nama Anda" />
          </label>
          <label className="text-sm">
            Email atau WhatsApp
            <input required className={inputClass} placeholder="Cara kami membalas" />
          </label>
          <label className="text-sm">
            Pesan
            <textarea rows={5} required className={inputClass} placeholder="Tulis pesan Anda" />
          </label>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Kirim Pesan
          </button>
        </form>
      </section>
    </>
  );
}
