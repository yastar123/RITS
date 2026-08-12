import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, UserCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Rumah Terapy Ikhtiar Sehat" },
      { name: "description", content: "Dashboard pengguna Rumah Terapy Ikhtiar Sehat." },
      { property: "og:title", content: "Dashboard — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Dashboard pengguna Rumah Terapy Ikhtiar Sehat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-sand px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-medium text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Selamat datang, {user?.email ?? "Pengguna"}
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Keluar
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <UserCircle className="h-5 w-5 text-primary" />
                Profil Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Kelola data kesehatan dan informasi pribadi Anda.
              </p>
              <Link to="/profile" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                Lihat profil →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Calendar className="h-5 w-5 text-primary" />
                Reservasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Jadwalkan janji temu atau lihat riwayat reservasi Anda.
              </p>
              <Link to="/reservasi" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                Buat reservasi →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <FileText className="h-5 w-5 text-primary" />
                Riwayat Skrining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pantau perkembangan tren kesehatan dan hasil skrining Anda.
              </p>
              <Link to="/skrining" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                Skrining mandiri →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
