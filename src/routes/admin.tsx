import { createFileRoute } from "@/lib/route";
import { useEffect, useState, type FormEvent } from "react";
import {
  CalendarDays,
  FilePenLine,
  FileText,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useAuth, authHeaders } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Rumah Terapy Ikhtiar Sehat" },
      { name: "description", content: "Kelola reservasi dan artikel Rumah Terapy Ikhtiar Sehat." },
    ],
  }),
  component: AdminPage,
});

type Section = "overview" | "reservations" | "articles";
type Reservation = {
  id: string;
  code: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  note: string | null;
  status: string;
};
type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  publishedAt: string;
};

const emptyReservation: Omit<Reservation, "id" | "code"> = {
  name: "",
  phone: "",
  service: "",
  date: "",
  time: "",
  note: "",
  status: "Menunggu Konfirmasi",
};
const emptyArticle: Omit<Article, "id" | "publishedAt"> = {
  category: "",
  title: "",
  excerpt: "",
  content: "",
  readTime: "5 menit",
};
const statusOptions = ["Menunggu Konfirmasi", "Dikonfirmasi", "Selesai", "Dibatalkan"];

async function adminFetch<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? "Permintaan gagal.");
  return data as T;
}

function AdminPage() {
  const { user, signOut } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservationDialog, setReservationDialog] = useState<Reservation | "new" | null>(null);
  const [articleDialog, setArticleDialog] = useState<Article | "new" | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [reservationData, articleData] = await Promise.all([
        adminFetch<Reservation[]>("/api/admin/reservations"),
        adminFetch<Article[]>("/api/articles"),
      ]);
      setReservations(reservationData);
      setArticles(articleData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const removeReservation = async (reservation: Reservation) => {
    if (!window.confirm(`Hapus reservasi ${reservation.code}?`)) return;
    try {
      await adminFetch(`/api/admin/reservations/${reservation.id}`, { method: "DELETE" });
      await loadData();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Gagal menghapus reservasi.");
    }
  };

  const removeArticle = async (article: Article) => {
    if (!window.confirm(`Hapus artikel "${article.title}"?`)) return;
    try {
      await adminFetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
      await loadData();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Gagal menghapus artikel.");
    }
  };

  const filteredReservations = reservations.filter((reservation) =>
    [reservation.code, reservation.name, reservation.phone, reservation.service, reservation.status]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const navItems: { key: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { key: "reservations", label: "Reservasi", icon: CalendarDays },
    { key: "articles", label: "Artikel", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="font-display text-xl text-foreground">Rumah Terapy</p>
              <p className="eyebrow">Admin dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /> Keluar</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:w-56">
          <p className="eyebrow mb-3 px-3">Workspace</p>
          <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => setSection(key)} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors lg:w-full ${section === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-8">
            <p className="eyebrow">Selamat datang kembali</p>
            <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              {section === "overview" ? "Ringkasan klinik" : section === "reservations" ? "Kelola reservasi" : "Kelola artikel"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Semua perubahan tersimpan langsung ke database klinik.</p>
          </div>

          {error && <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"><span>{error}</span><button type="button" onClick={() => setError("")}>Tutup</button></div>}
          {isLoading ? <div className="rounded-xl border bg-card p-12 text-center text-sm text-muted-foreground">Memuat data dashboard...</div> : (
            <>
              {section === "overview" && <Overview reservations={reservations} articles={articles} onNavigate={setSection} />}
              {section === "reservations" && (
                <ReservationSection
                  reservations={filteredReservations}
                  query={query}
                  onQueryChange={setQuery}
                  onCreate={() => setReservationDialog("new")}
                  onEdit={setReservationDialog}
                  onDelete={removeReservation}
                />
              )}
              {section === "articles" && (
                <ArticleSection articles={articles} onCreate={() => setArticleDialog("new")} onEdit={setArticleDialog} onDelete={removeArticle} />
              )}
            </>
          )}
        </main>
      </div>

      <ReservationDialog value={reservationDialog} onClose={() => setReservationDialog(null)} onSaved={loadData} />
      <ArticleDialog value={articleDialog} onClose={() => setArticleDialog(null)} onSaved={loadData} />
    </div>
  );
}

function Overview({ reservations, articles, onNavigate }: { reservations: Reservation[]; articles: Article[]; onNavigate: (section: Section) => void }) {
  const pending = reservations.filter((reservation) => reservation.status === "Menunggu Konfirmasi").length;
  const cards = [
    { label: "Total reservasi", value: reservations.length, icon: CalendarDays, section: "reservations" as Section },
    { label: "Menunggu konfirmasi", value: pending, icon: Users, section: "reservations" as Section },
    { label: "Artikel terbit", value: articles.length, icon: FileText, section: "articles" as Section },
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, section }) => (
          <button type="button" key={label} onClick={() => onNavigate(section)} className="text-left">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-display text-4xl text-foreground">{value}</p></div>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-primary"><Icon className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FilePenLine className="h-5 w-5 text-primary" /> Alur kerja admin</CardTitle></CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
          <p><strong className="text-foreground">1. Reservasi masuk</strong><br />Periksa detail pasien dan ubah status setelah dikonfirmasi.</p>
          <p><strong className="text-foreground">2. Konten edukasi</strong><br />Tulis artikel baru untuk membantu pasien memahami TCM.</p>
          <p><strong className="text-foreground">3. Website terbarui</strong><br />Artikel yang disimpan langsung muncul di halaman Artikel.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReservationSection({ reservations, query, onQueryChange, onCreate, onEdit, onDelete }: { reservations: Reservation[]; query: string; onQueryChange: (value: string) => void; onCreate: () => void; onEdit: (reservation: Reservation) => void; onDelete: (reservation: Reservation) => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>Reservasi pasien</CardTitle><p className="mt-1 text-sm text-muted-foreground">{reservations.length} data ditampilkan</p></div>
        <Button onClick={onCreate}><Plus className="h-4 w-4" /> Tambah reservasi</Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari nama, kode, nomor, layanan..." className="pl-9" />
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Pasien</TableHead><TableHead>Layanan</TableHead><TableHead>Jadwal</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell><p className="font-medium">{reservation.name}</p><p className="text-xs text-muted-foreground">{reservation.code} · {reservation.phone}</p></TableCell>
                <TableCell>{reservation.service}</TableCell>
                <TableCell className="whitespace-nowrap">{reservation.date}<br /><span className="text-xs text-muted-foreground">{reservation.time}</span></TableCell>
                <TableCell><Badge variant={reservation.status === "Dibatalkan" ? "destructive" : reservation.status === "Selesai" ? "secondary" : "outline"}>{reservation.status}</Badge></TableCell>
                <TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => onEdit(reservation)} aria-label="Edit reservasi"><Pencil /></Button><Button variant="ghost" size="icon" onClick={() => onDelete(reservation)} aria-label="Hapus reservasi"><Trash2 className="text-destructive" /></Button></div></TableCell>
              </TableRow>
            ))}
            {reservations.length === 0 && <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">Belum ada reservasi.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ArticleSection({ articles, onCreate, onEdit, onDelete }: { articles: Article[]; onCreate: () => void; onEdit: (article: Article) => void; onDelete: (article: Article) => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>Artikel edukasi</CardTitle><p className="mt-1 text-sm text-muted-foreground">{articles.length} artikel tampil di website</p></div>
        <Button onClick={onCreate}><Plus className="h-4 w-4" /> Tulis artikel</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{article.category}</Badge><span className="text-xs text-muted-foreground">{article.readTime} baca</span></div><h3 className="mt-2 font-display text-xl">{article.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p></div>
            <div className="flex shrink-0 gap-1"><Button variant="outline" size="sm" onClick={() => onEdit(article)}><Pencil className="h-4 w-4" /> Edit</Button><Button variant="ghost" size="icon" onClick={() => onDelete(article)} aria-label="Hapus artikel"><Trash2 className="text-destructive" /></Button></div>
          </div>
        ))}
        {articles.length === 0 && <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">Belum ada artikel. Tulis artikel pertama Anda.</div>}
      </CardContent>
    </Card>
  );
}

function ReservationDialog({ value, onClose, onSaved }: { value: Reservation | "new" | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState(emptyReservation);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!value) return;
    setForm(value === "new" ? emptyReservation : { name: value.name, phone: value.phone, service: value.service, date: value.date, time: value.time, note: value.note ?? "", status: value.status });
    setError("");
  }, [value]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await adminFetch(value === "new" ? "/api/admin/reservations" : `/api/admin/reservations/${value?.id}`, { method: value === "new" ? "POST" : "PATCH", body: JSON.stringify(form) });
      await onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan reservasi.");
    } finally {
      setIsSaving(false);
    }
  };
  return <Dialog open={!!value} onOpenChange={(open) => !open && onClose()}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{value === "new" ? "Tambah reservasi" : "Edit reservasi"}</DialogTitle><DialogDescription>Perbarui data jadwal pasien dari dashboard admin.</DialogDescription></DialogHeader><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><Field label="Nama pasien"><Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Nomor telepon"><Input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field><Field label="Layanan"><Input required value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} placeholder="Akupunktur, Herbal..." /></Field><Field label="Tanggal"><Input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field><Field label="Waktu"><Input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></Field><Field label="Status"><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option>{statusOptions[0]}</option><option>{statusOptions[1]}</option><option>{statusOptions[2]}</option><option>{statusOptions[3]}</option></select></Field><div className="sm:col-span-2"><Field label="Catatan"><Textarea value={form.note ?? ""} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Catatan tambahan..." /></Field></div>{error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}<DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={onClose}>Batal</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan reservasi"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function ArticleDialog({ value, onClose, onSaved }: { value: Article | "new" | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState(emptyArticle);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!value) return;
    setForm(value === "new" ? emptyArticle : { category: value.category, title: value.title, excerpt: value.excerpt, content: value.content, readTime: value.readTime });
    setError("");
  }, [value]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await adminFetch(value === "new" ? "/api/admin/articles" : `/api/admin/articles/${value?.id}`, { method: value === "new" ? "POST" : "PATCH", body: JSON.stringify(form) });
      await onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan artikel.");
    } finally {
      setIsSaving(false);
    }
  };
  return <Dialog open={!!value} onOpenChange={(open) => !open && onClose()}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{value === "new" ? "Tulis artikel baru" : "Edit artikel"}</DialogTitle><DialogDescription>Artikel yang disimpan akan tampil di halaman Artikel.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Kategori"><Input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Herbal" /></Field><Field label="Waktu baca"><Input required value={form.readTime} onChange={(event) => setForm({ ...form, readTime: event.target.value })} placeholder="5 menit" /></Field></div><Field label="Judul artikel"><Input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field><Field label="Ringkasan"><Textarea required value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} rows={3} /></Field><Field label="Isi artikel"><Textarea required value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={8} placeholder="Tulis isi artikel di sini..." /></Field>{error && <p className="text-sm text-destructive">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={onClose}>Batal</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan artikel"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}