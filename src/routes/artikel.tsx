import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/artikel")({
  head: () => ({
    meta: [
      { title: "Artikel & Edukasi TCM — Rumah Terapy Ikhtiar Sehat" },
      {
        name: "description",
        content:
          "Bacaan singkat seputar akupunktur, herbal, pola makan, dan keseimbangan tubuh menurut Traditional Chinese Medicine.",
      },
      { property: "og:title", content: "Artikel & Edukasi TCM" },
      { property: "og:description", content: "Bacaan seputar TCM, herbal, dan keseimbangan tubuh." },
    ],
  }),
  component: Artikel,
});

const articles = [
  {
    cat: "Akupunktur",
    title: "Apa yang sebenarnya terjadi saat jarum masuk?",
    excerpt:
      "Penjelasan sederhana tentang titik meridian, respons saraf, dan mengapa sensasi 'de qi' itu penting.",
    date: "12 Juli 2026",
    read: "5 menit",
  },
  {
    cat: "Herbal",
    title: "Mengapa racikan herbal Anda berbeda dari orang lain",
    excerpt:
      "Formula TCM disusun mengikuti sindrom, bukan nama penyakit. Ini alasan takarannya sering berubah.",
    date: "28 Juni 2026",
    read: "4 menit",
  },
  {
    cat: "Pola Hidup",
    title: "Ritme harian organ dan jam tidur yang ideal",
    excerpt: "Jam organ dalam TCM dan bagaimana menyesuaikan rutinitas agar pemulihan lebih cepat.",
    date: "9 Juni 2026",
    read: "6 menit",
  },
  {
    cat: "Tuina",
    title: "Kaku leher berulang: bukan hanya soal otot",
    excerpt: "Pola stagnasi qi yang sering menyertai keluhan leher dan bahu pada pekerja layar.",
    date: "21 Mei 2026",
    read: "5 menit",
  },
  {
    cat: "BSM",
    title: "Mengenal Body Space Medicine untuk kasus kronis",
    excerpt: "Bagaimana konsep ruang tubuh membantu membuka aliran pada keluhan yang lama menetap.",
    date: "3 Mei 2026",
    read: "7 menit",
  },
  {
    cat: "Audioterapi",
    title: "Frekuensi, napas, dan kualitas tidur",
    excerpt: "Peran terapi suara sebagai penunjang relaksasi sistem saraf parasimpatis.",
    date: "17 April 2026",
    read: "4 menit",
  },
];

function Artikel() {
  return (
    <>
      <PageHeader
        eyebrow="Artikel"
        title="Catatan dari ruang terapi"
        description="Tulisan ringkas untuk membantu Anda memahami tubuh dan proses pemulihannya."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <article key={a.title} className="group">
              <div className="rule-line" />
              <p className="eyebrow mt-5">{a.cat}</p>
              <h2 className="mt-3 text-xl leading-snug transition-colors group-hover:text-primary">
                {a.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
              <p className="mt-5 text-xs text-muted-foreground">
                {a.date} · {a.read} baca
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
