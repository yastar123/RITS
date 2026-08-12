import { createFileRoute, useNavigate } from "@/lib/route";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Upload, Camera, User, Mail, Lock, Phone, MapPin, Hash, Ruler, Weight, LocateFixed } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk / Daftar — Rumah Terapy Ikhtiar Sehat" },
      { name: "description", content: "Masuk atau daftar untuk menyimpan riwayat skrining dan reservasi klinik TCM." },
      { property: "og:title", content: "Masuk / Daftar — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Masuk atau daftar untuk menyimpan riwayat skrining dan reservasi klinik TCM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const profileSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  gender: z.enum(["Laki-laki", "Perempuan"], { message: "Pilih jenis kelamin" }),
  age: z.coerce.number().min(1, "Usia minimal 1 tahun").max(120, "Usia maksimal 120 tahun"),
  height: z.coerce.number().min(1, "Tinggi badan tidak valid").max(300, "Tinggi maksimal 300 cm"),
  weight: z.coerce.number().min(1, "Berat badan tidak valid").max(500, "Berat maksimal 500 kg"),
  phone: z.string().min(8, "Nomor HP minimal 8 digit").max(20, "Nomor terlalu panjang"),
  address: z.string().min(5, "Alamat terlalu singkat"),
  referral_code: z.string().optional(),
  tongue_photo_url: z.string().optional(),
});

const registerSchema = loginSchema.merge(profileSchema);

type FormField =
  | "email"
  | "password"
  | "full_name"
  | "gender"
  | "age"
  | "height"
  | "weight"
  | "phone"
  | "address"
  | "referral_code"
  | "tongue_photo_url";

const initialValues: Record<FormField, string> = {
  email: "",
  password: "",
  full_name: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
  phone: "",
  address: "",
  referral_code: "",
  tongue_photo_url: "",
};

function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<FormField, string>>({ ...initialValues });
  const [formError, setFormError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<FormField, string>>({ ...initialValues });


  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (field: FormField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const [isLocating, setIsLocating] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const handleUseGps = () => {
    if (!("geolocation" in navigator)) {
      setGpsMessage("Perangkat/browser Anda tidak mendukung GPS.");
      return;
    }
    setIsLocating(true);
    setGpsMessage("Mengambil lokasi Anda…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=id`,
          );
          const data = (await res.json()) as { display_name?: string };
          if (data.display_name) {
            handleChange("address", data.display_name);
            setGpsMessage("Alamat terisi dari GPS. Silakan periksa dan lengkapi bila perlu.");
          } else {
            handleChange("address", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            setGpsMessage("Alamat tidak ditemukan, koordinat GPS dipakai sementara.");
          }
        } catch {
          handleChange("address", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setGpsMessage("Gagal mengubah koordinat jadi alamat, koordinat GPS dipakai sementara.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setGpsMessage(
          err.code === err.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Aktifkan izin lokasi atau isi alamat manual."
            : "Gagal mendapatkan lokasi. Coba lagi atau isi alamat manual.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleTonguePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2_000_000) {
      setErrors((prev) => ({ ...prev, tongue_photo_url: "Ukuran foto maksimal 2 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValues((prev) => ({ ...prev, tongue_photo_url: String(reader.result ?? "") }));
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, tongue_photo_url: "" }));
  };

  const validate = () => {
    const schema = mode === "login" ? loginSchema : registerSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      const next = { ...initialValues };
      result.error.errors.forEach((err) => {
        const key = err.path[0] as FormField;
        if (key) {
          next[key] = err.message;
        }
      });
      setErrors(next);
      return false;
    }
    setErrors({ ...initialValues });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const signup = await fetch("/api/auth/signup", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password, profile: {
            full_name: values.full_name, gender: values.gender, age: Number(values.age),
            height: Number(values.height), weight: Number(values.weight), phone: values.phone,
            address: values.address, referral_code: values.referral_code,
          } }),
        });
        if (!signup.ok) throw new Error((await signup.json()).message ?? "Gagal membuat akun");
      }
      const login = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const result = await login.json();
      if (!login.ok) throw new Error(result.message ?? "Email atau password salah");
      window.localStorage.setItem("auth_token", result.token);
      window.location.assign("/dashboard");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-sand">
      <div className="min-h-screen w-full bg-card md:grid md:grid-cols-2">
        {/* Left panel: branding */}
        <div className="relative hidden min-h-screen flex-col justify-between bg-primary p-10 text-primary-foreground md:flex lg:p-16">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,_white_0%,_transparent_40%)]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-foreground/20">
                <span className="text-2xl">🌿</span>
              </div>
              <span className="font-display text-xl font-medium">Rumah Terapy Ikhtiar Sehat</span>
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-medium leading-tight">
              "Kesehatan terbaik dimulai dari langkah kecil yang konsisten."
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Pantau tren kesehatan Anda, riwayat skrining, dan reservasi layanan klinik TCM kami dalam satu tempat.
            </p>
          </div>
          <div className="relative z-10 text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Rumah Terapy Ikhtiar Sehat
          </div>
        </div>

        {/* Right panel: form */}
        <div className="no-scrollbar flex min-h-screen flex-col justify-start overflow-y-auto p-6 md:max-h-screen md:py-12 md:px-12 lg:px-20">
          <div className="m-auto w-full max-w-xl">
          <div className="mb-6 text-center md:text-left">
            <h1 className="font-display text-2xl font-medium text-foreground md:text-3xl">
              {mode === "login" ? "Selamat datang kembali" : "Buat akun baru"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "login"
                ? "Masuk untuk melihat riwayat skrining dan reservasi Anda."
                : "Daftar untuk menyimpan profil dan tren kesehatan Anda secara akurat."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setFormError("Login Google belum tersedia pada autentikasi lokal. Gunakan email dan password.")}
            className="mb-6 w-full justify-center gap-2 border-border py-5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Lanjutkan dengan Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">Atau isi manual</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nama Lengkap <span className="text-cinnabar">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={values.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      className={cn("pl-10", errors.full_name && "border-cinnabar focus-visible:ring-cinnabar")}
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  {errors.full_name && <p className="text-xs text-cinnabar">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin <span className="text-cinnabar">*</span></Label>
                  <select
                    id="gender"
                    value={values.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      errors.gender && "border-cinnabar focus-visible:ring-cinnabar",
                    )}
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.gender && <p className="text-xs text-cinnabar">{errors.gender}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">Usia <span className="text-cinnabar">*</span></Label>
                    <Input
                      id="age"
                      type="number"
                      value={values.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      className={cn(errors.age && "border-cinnabar focus-visible:ring-cinnabar")}
                      placeholder="Tahun"
                    />
                    {errors.age && <p className="text-xs text-cinnabar">{errors.age}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Tinggi Badan <span className="text-cinnabar">*</span></Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="height"
                        type="number"
                        value={values.height}
                        onChange={(e) => handleChange("height", e.target.value)}
                        className={cn("pl-10", errors.height && "border-cinnabar focus-visible:ring-cinnabar")}
                        placeholder="cm"
                      />
                    </div>
                    {errors.height && <p className="text-xs text-cinnabar">{errors.height}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Berat Badan <span className="text-cinnabar">*</span></Label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="weight"
                        type="number"
                        value={values.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                        className={cn("pl-10", errors.weight && "border-cinnabar focus-visible:ring-cinnabar")}
                        placeholder="kg"
                      />
                    </div>
                    {errors.weight && <p className="text-xs text-cinnabar">{errors.weight}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={cn("pl-10", errors.email && "border-cinnabar focus-visible:ring-cinnabar")}
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && <p className="text-xs text-cinnabar">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={cn("pl-10 pr-10", errors.password && "border-cinnabar focus-visible:ring-cinnabar")}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-cinnabar">{errors.password}</p>}
            </div>

            {mode === "register" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">No. HP / WhatsApp <span className="text-cinnabar">*</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={values.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={cn("pl-10", errors.phone && "border-cinnabar focus-visible:ring-cinnabar")}
                      placeholder="0812xxxxxxxx"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-cinnabar">{errors.phone}</p>}
                  <p className="text-xs text-muted-foreground">
                    * Hasil skrining akan dikirimkan ke WhatsApp ini. Pastikan nomor aktif.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label htmlFor="address">Alamat Domisili <span className="text-cinnabar">*</span></Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseGps}
                      disabled={isLocating}
                      className="gap-2"
                    >
                      <LocateFixed className={cn("h-4 w-4", isLocating && "animate-spin")} />
                      {isLocating ? "Mencari lokasi…" : "Gunakan GPS"}
                    </Button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="address"
                      value={values.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className={cn(
                        "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        errors.address && "border-cinnabar focus-visible:ring-cinnabar",
                      )}
                      placeholder="Alamat lengkap domisili"
                    />
                  </div>
                  {gpsMessage && <p className="text-xs text-muted-foreground">{gpsMessage}</p>}
                  {errors.address && <p className="text-xs text-cinnabar">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral_code">Kode Referal (Opsional)</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="referral_code"
                      value={values.referral_code}
                      onChange={(e) => handleChange("referral_code", e.target.value)}
                      className="pl-10"
                      placeholder="Masukkan kode referal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tongue_photo">Foto Lidah (Opsional)</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="tongue_photo"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <Camera className="h-4 w-4" />
                      Buka Kamera
                      <input
                        id="tongue_photo"
                        type="file"
                        accept="image/*;capture=camera"
                        className="sr-only"
                        onChange={handleTonguePhoto}
                      />
                    </label>
                    <label
                      htmlFor="tongue_gallery"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      Pilih Galeri
                      <input
                        id="tongue_gallery"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleTonguePhoto}
                      />
                    </label>
                  </div>
                  {values.tongue_photo_url && (
                    <p className="text-xs text-green-700">Foto lidah berhasil diunggah.</p>
                  )}
                  {errors.tongue_photo_url && <p className="text-xs text-cinnabar">{errors.tongue_photo_url}</p>}
                </div>
              </div>
            )}

            {formError && (
              <div className="rounded-md bg-cinnabar/10 p-3 text-sm text-cinnabar">{formError}</div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary py-5 text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {mode === "login" ? "Daftar" : "Masuk"}
            </button>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
