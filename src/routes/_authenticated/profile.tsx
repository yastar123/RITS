import { createFileRoute } from "@/lib/route";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profil Saya — Rumah Terapy Ikhtiar Sehat" },
      { name: "description", content: "Profil dan data kesehatan pengguna." },
      { property: "og:title", content: "Profil Saya — Rumah Terapy Ikhtiar Sehat" },
      { property: "og:description", content: "Profil dan data kesehatan pengguna." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();
  const [tonguePhotoUrl, setTonguePhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.tongue_photo_url) {
      setTonguePhotoUrl(null);
      return;
    }
    setTonguePhotoUrl(profile.tongue_photo_url);
  }, [profile?.tongue_photo_url]);

  return (
    <div className="bg-sand px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-3xl font-medium text-foreground">Profil Saya</h1>

        {isLoading && (
          <Card className="bg-card">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-2/3" />
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="rounded-md bg-cinnabar/10 p-4 text-sm text-cinnabar">
            Gagal memuat profil. Silakan coba lagi nanti.
          </div>
        )}

        {profile && (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-display text-xl font-medium">{profile.full_name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <ProfileRow label="Jenis Kelamin" value={profile.gender} />
              <ProfileRow label="Usia" value={`${profile.age} tahun`} />
              <ProfileRow label="Tinggi Badan" value={`${profile.height} cm`} />
              <ProfileRow label="Berat Badan" value={`${profile.weight} kg`} />
              <ProfileRow label="No. HP / WhatsApp" value={profile.phone} />
              <ProfileRow label="Alamat Domisili" value={profile.address} />
              {profile.referral_code && <ProfileRow label="Kode Referal" value={profile.referral_code} />}
              {tonguePhotoUrl && (
                <div className="pt-2">
                  <p className="mb-2 text-muted-foreground">Foto Lidah</p>
                  <img
                    src={tonguePhotoUrl}
                    alt="Foto lidah"
                    className="h-32 w-auto rounded-md object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-border/60 py-2 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
