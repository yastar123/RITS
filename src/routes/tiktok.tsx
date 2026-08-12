import { createFileRoute } from "@/lib/route";
import { Play } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/tiktok")({
  head: () => ({
    meta: [
      { title: "TikTok — Rumah Terapy Ikhtiar Sehat" },
      {
        name: "description",
        content:
          "Kumpulan video edukasi TCM dari Rumah Terapy Ikhtiar Sehat: akupunktur, herbal, Tuina, dan tips harian.",
      },
      { property: "og:title", content: "TikTok — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Video edukasi TCM singkat dari ruang terapi kami." },
    ],
  }),
  component: TikTok,
});

const videos = [
  { title: "3 titik akupresur untuk sakit kepala", views: "128 rb", tag: "Akupresur" },
  { title: "Cara menyeduh herbal agar tidak pahit", views: "94 rb", tag: "Herbal" },
  { title: "Peregangan leher 60 detik ala Tuina", views: "212 rb", tag: "Tuina" },
  { title: "Tanda tubuh kelebihan lembap (damp)", views: "76 rb", tag: "Diagnosa" },
  { title: "Rutinitas malam untuk tidur nyenyak", views: "153 rb", tag: "Pola Hidup" },
  { title: "Apa itu audioterapi di klinik kami", views: "48 rb", tag: "Audioterapi" },
];

function TikTok() {
  return (
    <>
      <PageHeader
        eyebrow="TikTok"
        title="Edukasi singkat, langsung dipraktikkan"
        description="Kami merangkum pengetahuan TCM dalam video pendek — mudah dipahami dan bisa dicoba di rumah."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl">@ikhtiarsehat.tcm</p>
            <p className="mt-1 text-sm text-muted-foreground">Video terbaru dari ruang terapi</p>
          </div>
          <a
            href="https://www.tiktok.com/@ikhtiarsehat.tcm"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ikuti di TikTok
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-3">
          {videos.map((v) => (
            <a
              key={v.title}
              href="https://www.tiktok.com/@ikhtiarsehat.tcm"
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <div className="relative flex aspect-9/16 items-center justify-center bg-sand transition-colors group-hover:bg-brand-soft">
                <Play className="size-8 text-primary" />
                <span className="absolute left-4 top-4 text-xs text-muted-foreground">{v.tag}</span>
              </div>
              <h2 className="mt-4 text-base leading-snug">{v.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{v.views} ditonton</p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
