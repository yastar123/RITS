import { createFileRoute, useNavigate } from "@/lib/route";
import { useEffect, useState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Login Admin — Rumah Terapy Ikhtiar Sehat" },
      { name: "description", content: "Login administrator Rumah Terapy Ikhtiar Sehat." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role === "admin") navigate("/admin");
  }, [isLoading, navigate, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Login gagal.");
      if (result.user?.role !== "admin") throw new Error("Akun ini bukan administrator.");
      window.localStorage.setItem("auth_token", result.token);
      window.location.assign("/admin");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-primary p-10 text-primary-foreground md:flex md:flex-col md:justify-between lg:p-14">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-foreground/15">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-xl">Rumah Terapy</p>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Admin workspace</p>
              </div>
            </div>
            <p className="eyebrow text-primary-foreground/60">Panel pengelola</p>
            <h1 className="mt-4 font-display text-4xl leading-tight">Kelola klinik dengan lebih tenang.</h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
              Atur jadwal reservasi dan terbitkan artikel edukasi dari satu dashboard yang aman.
            </p>
          </div>
          <p className="text-xs text-primary-foreground/50">Akses terbatas untuk administrator klinik.</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-md">
            <p className="eyebrow">Administrator</p>
            <h2 className="mt-3 font-display text-3xl text-foreground">Masuk ke dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Gunakan email dan password admin yang telah disiapkan untuk klinik.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email admin</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="pl-9" placeholder="admin@rumahterapy.id" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="pl-9" placeholder="Masukkan password admin" minLength={8} required />
                </div>
              </div>
              {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Memeriksa..." : "Masuk sebagai admin"}
              </Button>
            </form>

            <button type="button" onClick={() => navigate("/")} className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-primary">
              Kembali ke website utama
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}