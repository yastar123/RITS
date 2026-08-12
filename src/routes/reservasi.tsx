import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import {
  serviceOptions,
  formatPrice,
  saveReservation,
  type Reservation,
} from "@/lib/reservations";

export const Route = createFileRoute("/reservasi")({
  head: () => ({
    meta: [
      { title: "Reservasi Terapi — Rumah Terapy Ikhtiar Sehat" },
      {
        name: "description",
        content:
          "Jadwalkan sesi akupunktur, herbal, Tuina, BSM, konseling, atau audioterapi di Rumah Terapy Ikhtiar Sehat.",
      },
      { property: "og:title", content: "Reservasi Terapi — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Pilih layanan dan jadwal terapi TCM Anda." },
    ],
  }),
  component: Reservasi,
});

const times = ["08.00", "09.30", "11.00", "13.30", "15.00", "16.30", "18.00", "19.30"];

const steps = ["Pilih Layanan", "Jadwal", "Identitas Pemesan"];

const inputClass =
  "mt-2 w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

type FormState = {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  note: string;
};

const emptyForm: FormState = {
  service: serviceOptions[0]?.name ?? "",
  date: "",
  time: times[0] ?? "",
  name: "",
  phone: "",
  note: "",
};

function Reservasi() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [result, setResult] = useState<Reservation | null>(null);
  const [customTime, setCustomTime] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canContinue =
    step === 0 ? Boolean(form.service) : step === 1 ? Boolean(form.date && form.time) : true;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) {
      if (canContinue) setStep(step + 1);
      return;
    }
    setResult(saveReservation({ ...form }));
    setForm(emptyForm);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Reservasi"
        title="Pilih layanan dan waktu Anda"
        description="Isi tiga langkah berikut. Tim kami akan menghubungi via WhatsApp untuk konfirmasi jadwal."
      />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-5 sm:py-20">
        {result && (
          <div className="mb-10 border border-primary/40 bg-brand-soft/50 p-5 sm:mb-12 sm:p-7">
            <CheckCircle2 className="size-6 text-primary" />
            <h2 className="mt-4 text-2xl">Reservasi tercatat</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Simpan kode ini untuk mengecek status reservasi Anda.
            </p>
            <p className="mt-5 font-display text-3xl tracking-wide text-primary">{result.code}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {result.service} · {result.date} · {result.time}
            </p>
          </div>
        )}

        <ol className="mb-10 grid gap-3 sm:grid-cols-3">
          {steps.map((label, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 border p-4 text-sm transition-colors ${
                  active
                    ? "border-primary bg-brand-soft/40 text-foreground"
                    : done
                      ? "border-primary/40 text-muted-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs ${
                    active || done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="size-4" /> : i + 1}
                </span>
                {label}
              </li>
            );
          })}
        </ol>

        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <form onSubmit={onSubmit} className="grid gap-6">
            {step === 0 && (
              <fieldset className="grid gap-3 sm:grid-cols-2">
                <legend className="mb-3 text-sm text-muted-foreground">
                  Pilih layanan yang Anda butuhkan
                </legend>
                {serviceOptions.map((s) => (
                  <label
                    key={s.name}
                    className={`cursor-pointer border p-4 text-sm transition-colors ${
                      form.service === s.name
                        ? "border-primary bg-brand-soft/40"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      className="sr-only"
                      checked={form.service === s.name}
                      onChange={() => set("service", s.name)}
                    />
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-primary">{formatPrice(s.price)}</span>
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{s.duration}</span>
                    <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                      {s.description}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {step === 1 && (
              <div className="grid gap-6">
                <label className="text-sm">
                  Tanggal
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className={inputClass}
                  />
                </label>
                <fieldset>
                  <legend className="text-sm">Jam</legend>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {times.map((t) => (
                      <label
                        key={t}
                        className={`cursor-pointer border p-3 text-center text-sm transition-colors ${
                          form.time === t
                            ? "border-primary bg-brand-soft/40"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="time"
                          className="sr-only"
                          checked={form.time === t}
                          onChange={() => {
                            setCustomTime("");
                            set("time", t);
                          }}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                  <label className="mt-4 block text-sm">
                    Atau tentukan jam sendiri
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustomTime(v);
                        if (v) set("time", v.replace(":", "."));
                      }}
                      className={inputClass}
                    />
                    <span className="mt-2 block text-xs text-muted-foreground">
                      Jam kustom akan kami konfirmasi ketersediaannya via WhatsApp.
                    </span>
                  </label>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="text-sm">
                  Nama Lengkap
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputClass}
                    placeholder="Nama Anda"
                  />
                </label>
                <label className="text-sm">
                  Nomor WhatsApp
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputClass}
                    placeholder="08xx xxxx xxxx"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  Keluhan Utama (opsional)
                  <textarea
                    rows={4}
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                    className={inputClass}
                    placeholder="Ceritakan singkat keluhan yang Anda rasakan"
                  />
                </label>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-primary"
                >
                  <ArrowLeft className="size-4" /> Kembali
                </button>
              )}
              <button
                type="submit"
                disabled={!canContinue}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {step < steps.length - 1 ? (
                  <>
                    Lanjut <ArrowRight className="size-4" />
                  </>
                ) : (
                  "Kirim Reservasi"
                )}
              </button>
            </div>
          </form>

          <aside className="h-fit border border-border bg-card p-5">
            <h2 className="text-lg">Ringkasan Reservasi</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Layanan</dt>
                <dd className="text-right">{form.service || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Estimasi Biaya</dt>
                <dd className="text-right text-primary">
                  {(() => {
                    const s = serviceOptions.find((o) => o.name === form.service);
                    return s ? formatPrice(s.price) : "—";
                  })()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tanggal</dt>
                <dd className="text-right">{form.date || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Jam</dt>
                <dd className="text-right">{form.time || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Nama</dt>
                <dd className="text-right">{form.name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">WhatsApp</dt>
                <dd className="text-right">{form.phone || "—"}</dd>
              </div>
              {form.note && (
                <div className="border-t border-border pt-3">
                  <dt className="text-muted-foreground">Keluhan</dt>
                  <dd className="mt-1">{form.note}</dd>
                </div>
              )}
            </dl>
            <p className="mt-5 text-xs text-muted-foreground">
              Jadwal final dikonfirmasi tim kami via WhatsApp.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
