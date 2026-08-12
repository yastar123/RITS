import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  HeartPulse,
  ShieldCheck,
  Star,
  Stethoscope,
} from "lucide-react";

import heroImg from "@/assets/hero-clinic.jpg";
import aboutImg from "@/assets/about-herbs.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rumah Terapy Ikhtiar Sehat — Klinik TCM Holistik Surabaya" },
      {
        name: "description",
        content:
          "Layanan Pengobatan Tradisional Tiongkok profesional: akupunktur, herbal formula, Tuina, BSM, konseling, dan audioterapi bersama terapis bersertifikat.",
      },
      {
        property: "og:title",
        content: "Rumah Terapy Ikhtiar Sehat — Klinik TCM Holistik Surabaya",
      },
      {
        property: "og:description",
        content:
          "Solusi tepat untuk kesehatan holistik Anda bersama praktisi TCM bersertifikat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "23", label: "Layanan" },
  { value: "13", label: "Jumlah Pasien" },
  { value: "2", label: "Terapis" },
];

const reasons = [
  {
    icon: BadgeCheck,
    title: "Terapis Bersertifikat",
    text: "Tim praktisi kami memiliki sertifikasi resmi dan pengalaman mendalam di bidang Pengobatan Tradisional Tiongkok.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi Terjamin 100%",
    text: "Kami memprioritaskan kerahasiaan dan keamanan data pasien dalam setiap sesi konsultasi.",
  },
  {
    icon: HeartPulse,
    title: "Metode Terbukti",
    text: "Pendekatan holistik dan personal yang terbukti efektif mengembalikan keseimbangan tubuh dan menangani berbagai keluhan kesehatan.",
  },
];

const therapists = [
  { name: "Imroatus Solikhah, Amd.Akp", role: "Akupunturis" },
  {
    name: "Master Jun, S.Ud, B.Med, M.T (Biomed)",
    role: "TCM (Traditional Chinese Medicine)",
  },
];

const featured = [
  {
    title: "Formula Herbal",
    text: "Formula herbal personalisasi — kami memahami setiap tubuh itu unik, sehingga racikan disusun sesuai konstitusi dan akar masalah Anda.",
  },
  {
    title: "BSM & Tuina Lengkap",
    text: "Perpaduan Body Space Medicine berbasis energi dengan terapi manual Tuina untuk penyembuhan yang menyeluruh.",
  },
  {
    title: "Tuina Chuzhen Kepala",
    text: "Terapi pijat khas TCM pada area kepala untuk relaksasi mendalam, meredakan pusing, dan memperbaiki kualitas tidur.",
  },
  {
    title: "Akupunktur Face Lift 500 Jarum",
    text: "Transformasi alami tanpa operasi. Rangsangan maksimal untuk menyegarkan dan mengencangkan wajah dari dalam.",
  },
];

const reviews = [
  {
    quote:
      "Alhamdulillah dengan adanya TCM memberikan informasi yang akurat dan terstruktur, dan perawatan disesuaikan secara tepat dengan kondisi tubuh.",
    name: "Efendi Mohammad",
  },
  {
    quote:
      "Setelah diterapi akupunktur fullbody, badan langsung terasa enak dan ringan dibandingkan sebelumnya. Terima kasih.",
    name: "Triono Nugroho",
  },
  {
    quote: "Sangat puas dengan pelayanannya. Dan insyaAllah akan melanjutkan terapi.",
    name: "Tatik Rustin Rahayu Ningsih",
  },
  {
    quote:
      "Terapisnya ramah dan menjelaskan kondisi tubuh saya dengan detail. Keluhan migrain saya jauh berkurang setelah beberapa sesi.",
    name: "Dewi Anggraini",
  },
  {
    quote:
      "Tempatnya bersih, tenang, dan nyaman. Terapi Tuina di sini benar-benar membantu pegal di punggung saya hilang.",
    name: "Bagus Prasetyo",
  },
  {
    quote:
      "Herbalnya diracik sesuai kondisi tubuh, bukan asal. Tidur saya jadi lebih nyenyak dan badan terasa lebih segar.",
    name: "Siti Nurhaliza",
  },
  {
    quote:
      "Konsultasinya sabar dan tidak terburu-buru. Saya merasa benar-benar didengarkan sebagai pasien.",
    name: "Hendra Wijaya",
  },
  {
    quote:
      "Sudah beberapa kali akupunktur di sini dan hasilnya konsisten. Recommended untuk yang cari terapi holistik.",
    name: "Ratna Kusuma",
  },
];

const articles = [
  {
    title: "Mengenal Akupunktur: Mengembalikan Keseimbangan Energi Tubuh",
    text: "Akupunktur telah digunakan ribuan tahun untuk mengatasi berbagai masalah kesehatan dengan menyeimbangkan aliran energi tubuh (Qi).",
  },
  {
    title: "Pentingnya Menjaga Kesehatan Holistik di Era Modern",
    text: "Kesehatan sejati bukan sekadar bebas dari penyakit, melainkan harmoni antara pikiran, tubuh, dan jiwa.",
  },
  {
    title: "Herbal Tiongkok untuk Membantu Mengatasi Masalah Tidur",
    text: "Insomnia dan masalah tidur dapat diatasi secara alami menggunakan racikan herbal tradisional yang aman dan terbukti efektif.",
  },
  {
    title: "Pengobatan Holistik dan Terpersonalisasi",
    text: "Setiap individu memiliki kondisi tubuh yang unik. Chinese Medicine menawarkan pendekatan pengobatan yang holistik dan personal.",
  },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-5 sm:pt-14 md:pt-20">
        <p className="eyebrow fade-up">Solutions</p>
        <div className="mt-5 grid items-center gap-8 sm:mt-6 sm:gap-10 md:grid-cols-[1.05fr_1fr] md:gap-12">
          <div className="min-w-0">
            <h1 className="fade-up text-[clamp(2rem,7vw,3.75rem)] leading-[1.1] text-balance">
              <span className="block text-primary">
                Layanan Pengobatan Tradisional Tiongkok profesional
              </span>
            </h1>
            <p className="fade-up mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-7 sm:text-base">
              Tingkatkan vitalitas dan kembalikan keseimbangan tubuh Anda bersama praktisi
              bersertifikat kami melalui pendekatan Pengobatan Tradisional Tiongkok.
            </p>
            <div className="fade-up mt-7 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/reservasi"
                className="rounded-full bg-primary px-7 py-3 text-center text-sm text-primary-foreground transition-opacity hover:opacity-90"
              >
                Reservasi Sekarang!
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-7 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                Konsultasi Gratis <ArrowUpRight className="size-4 shrink-0" />
              </Link>
            </div>
          </div>

          <div className="relative order-first md:order-none">
            <img
              src={heroImg}
              alt="Ruang terapi klinik TCM dengan cahaya alami"
              width={1600}
              height={1100}
              loading="eager"
              className="aspect-16/10 w-full rounded-sm object-cover sm:aspect-16/10 md:aspect-4/3"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:mt-14 sm:gap-8 sm:pt-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="min-w-0">
              <p className="font-display text-[clamp(1.75rem,6vw,3rem)]">{s.value}</p>
              <p className="eyebrow mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <p className="eyebrow">Mengapa memilih kami?</p>
        <h2 className="mt-3 max-w-2xl text-2xl leading-tight sm:text-3xl md:text-4xl">
          Solusi nyata dalam memulihkan dan meningkatkan kesehatan Anda secara menyeluruh
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-border pt-6">
              <r.icon className="size-6 text-primary" />
              <h3 className="mt-5 text-xl">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THERAPISTS */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          <img
            src={aboutImg}
            alt="Racikan herbal Tiongkok di klinik"
            width={1400}
            height={1000}
            className="aspect-4/3 w-full rounded-sm object-cover"
          />
          <div>
            <p className="eyebrow">Profil Terapis Kami</p>
            <h2 className="mt-3 text-2xl leading-tight sm:text-3xl md:text-4xl">
              Para ahli bersertifikat yang mendampingi pemulihan Anda
            </h2>
            <div className="mt-8">
              {therapists.map((t) => (
                <div
                  key={t.name}
                  className="flex items-start gap-4 border-b border-border py-5 first:border-t"
                >
                  <Stethoscope className="mt-1 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-lg leading-snug">{t.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <p className="eyebrow">Layanan Unggulan</p>
        <h2 className="mt-3 max-w-3xl text-2xl leading-tight sm:text-3xl md:text-4xl">
          Layanan Pengobatan Tradisional Tiongkok kami
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Solusi terapi terpadu dengan pendekatan TCM modern dan dukungan klinis profesional untuk
          mengatasi keluhan fisik hingga masalah psikosomatis.
        </p>

        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2">
          {featured.map((f) => (
            <article key={f.title} className="flex flex-col bg-background p-6 sm:p-8">
              <h3 className="text-xl">{f.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              <Link
                to="/reservasi"
                className="mt-7 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
              >
                Pesan Sekarang <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-brand-soft/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <p className="eyebrow">Rating &amp; Ulasan</p>
          <h2 className="mt-3 text-2xl leading-tight sm:text-3xl md:text-4xl">Apa kata klien kami?</h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pelayanan yang konsisten, hasil terapi yang nyata, dan klien yang hidupnya membaik
            setelah mengikuti terapi.
          </p>

          <div className="marquee mt-12 -mx-4 px-4 sm:-mx-5 sm:px-5">
            <div className="marquee-track">
              {[...reviews, ...reviews].map((r, idx) => (
                <figure
                  key={`${r.name}-${idx}`}
                  aria-hidden={idx >= reviews.length}
                  className="w-[80vw] shrink-0 bg-background p-6 sm:w-[22rem] sm:p-7"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </span>
                    <span className="text-sm text-muted-foreground">5.0</span>
                  </div>
                  <blockquote className="mt-5 text-sm leading-relaxed">"{r.quote}"</blockquote>
                  <figcaption className="mt-5 text-sm text-muted-foreground">
                    — {r.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/reservasi"
              className="rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Jadwalkan Konsultasi Anda
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-border px-7 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              Tulis Ulasan
            </Link>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Wawasan Terbaru</p>
            <h2 className="mt-3 text-2xl leading-tight sm:text-3xl md:text-4xl">
              Artikel terkini seputar kesehatan holistik
            </h2>
          </div>
          <Link to="/artikel" className="text-sm text-primary underline-offset-4 hover:underline">
            Lihat Semua Artikel
          </Link>
        </div>

        <div className="mt-12 border-t border-border">
          {articles.map((a) => (
            <article
              key={a.title}
              className="grid gap-3 border-b border-border py-7 md:grid-cols-[1.1fr_1.4fr] md:gap-10"
            >
              <h3 className="text-xl leading-snug">{a.title}</h3>
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                <Link
                  to="/artikel"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                >
                  Baca Selengkapnya <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-5 sm:pb-24">
        <div className="bg-brand-soft/70 px-5 py-12 text-center sm:px-8 sm:py-16 md:px-16">
          <h2 className="mx-auto max-w-2xl text-2xl leading-tight sm:text-3xl md:text-5xl">
            Siap untuk perubahan yang lebih baik?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Kesehatan Anda terlalu berharga untuk ditunda. Jadwalkan sesi konsultasi pertama Anda
            bersama ahlinya hari ini.
          </p>
          <Link
            to="/reservasi"
            className="mt-9 inline-flex rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Reservasi Jadwal Saya
          </Link>
        </div>
      </section>
    </>
  );
}
