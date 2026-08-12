import { useState } from "react";
import { createFileRoute, Link } from "@/lib/route";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/_authenticated/skrining")({
  head: () => ({
    meta: [
      { title: "Skrining Mandiri — Rumah Terapy Ikhtiar Sehat" },
      {
        name: "description",
        content:
          "Cek mandiri kondisi kesehatan Anda dengan kuesioner sederhana berbasis pendekatan Traditional Chinese Medicine.",
      },
      { property: "og:title", content: "Skrining Mandiri — Rumah Terapy Ikhtiar Sehat" },
      {
        property: "og:description",
        content:
          "Kuesioner mandiri untuk membantu mengenali pola ketidakseimbangan tubuh.",
      },
    ],
  }),
  component: Skrining,
});

type Pertanyaan = {
  id: string;
  teks: string;
};

const pertanyaan: Pertanyaan[] = [
  { id: "q1", teks: "Saya sering merasa lelah atau kehilangan energi meski sudah cukup tidur." },
  { id: "q2", teks: "Saya sulit tidur atau sering terbangun di tengah malam." },
  { id: "q3", teks: "Saya sering merasa cemas, gelisah, atau sulit berkonsentrasi." },
  { id: "q4", teks: "Saya mengalami nyeri atau ketegangan otot secara berulang." },
  { id: "q5", teks: "Pencernaan saya tidak stabil (kembung, nyeri lambung, atau BAB tidak teratur)." },
  { id: "q6", teks: "Saya sering merasakan ketidakseimbangan emosi (mudah marah, sedih, atau murung)." },
  { id: "q7", teks: "Saya merasakan tubuh saya mudah dingin atau sebaliknya mudah panas." },
  { id: "q8", teks: "Saya merasa kualitas hidup saya menurun akibat keluhan di atas." },
];

function Skrining() {
  const [jawaban, setJawaban] = useState<Record<string, number>>({});
  const [selesai, setSelesai] = useState(false);

  const total = pertanyaan.length;
  const terjawab = Object.keys(jawaban).length;
  const skor = Object.values(jawaban).reduce((a, b) => a + b, 0);
  const semuaTerjawab = terjawab === total;

  const hasil = () => {
    if (skor <= 4)
      return {
        tingkat: "Rendah",
        saran:
          "Kondisi tubuh Anda relatif seimbang. Pertahankan pola hidup sehat dan istirahat cukup. Skrining berkala dapat membantu memantau keseimbangan jangka panjang.",
      };
    if (skor <= 12)
      return {
        tingkat: "Sedang",
        saran:
          "Terdapat beberapa tanda ketidakseimbangan. Pertimbangkan konsultasi awal untuk mengetahui pola tubuh Anda dan pilihan terapi yang sesuai.",
      };
    return {
      tingkat: "Tinggi",
      saran:
        "Banyak tanda ketidakseimbangan terdeteksi. Kami menyarankan segera menjadwalkan konsultasi agar keluhan dapat ditangani lebih awal.",
    };
  };

  return (
    <>
      <PageHeader
        eyebrow="Self Check"
        title="Skrining Mandiri Kesehatan"
        description="Jawab pertanyaan berikut secara jujur untuk mendapatkan gambaran awal kondisi tubuh Anda berdasarkan pendekatan Traditional Chinese Medicine. Hasil ini bukan diagnosis medis."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-14">
        {!selesai ? (
          <div className="space-y-6">
            {pertanyaan.map((p, i) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
              >
                <p className="text-sm font-medium text-foreground">
                  {i + 1}. {p.teks}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {[
                    ["Tidak pernah", 0],
                    ["Kadang", 1],
                    ["Sering", 2],
                    ["Selalu", 3],
                  ].map(([label, nilai]) => {
                    const aktif = jawaban[p.id] === nilai;
                    return (
                      <button
                        key={label as string}
                        type="button"
                        onClick={() =>
                          setJawaban((prev) => ({ ...prev, [p.id]: nilai as number }))
                        }
                        className={`rounded-full px-4 py-2 text-xs transition-colors ${
                          aktif
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {label as string}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-muted-foreground">
                {terjawab}/{total} terjawab
              </p>
              <button
                type="button"
                disabled={!semuaTerjawab}
                onClick={() => setSelesai(true)}
                className="rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lihat Hasil
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-8">
            <p className="eyebrow">Hasil Skrining</p>
            <h2 className="mt-3 text-2xl text-primary sm:text-3xl">Tingkat: {hasil().tingkat}</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {hasil().saran}
            </p>
            <p className="mt-6 text-xs text-muted-foreground/80">
              Hasil ini bersifat informatif dan bukan pengganti diagnosis medis profesional.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/reservasi"
                className="rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
              >
                Jadwalkan Konsultasi
              </Link>
              <button
                type="button"
                onClick={() => {
                  setJawaban({});
                  setSelesai(false);
                }}
                className="rounded-full border border-border px-7 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                Ulangi Skrining
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
