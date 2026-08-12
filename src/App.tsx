import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Link } from "@/lib/route";
import { Route as HomeRoute } from "@/routes/index";
import { Route as AboutRoute } from "@/routes/about";
import { Route as ArticleRoute } from "@/routes/artikel";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as TikTokRoute } from "@/routes/tiktok";
import { Route as ReservationRoute } from "@/routes/reservasi";
import { Route as CheckReservationRoute } from "@/routes/cek-reservasi";
import { Route as AuthRoute } from "@/routes/auth";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { Route as ProfileRoute } from "@/routes/_authenticated/profile";
import { Route as ScreeningRoute } from "@/routes/_authenticated/skrining";

function Page({ route }: { route: { component: React.ComponentType } }) {
  const Component = route.component;
  return <Component />;
}

function Shell() {
  const location = useLocation();
  const bare = location.pathname === "/auth";
  return bare ? (
    <Page route={AuthRoute} />
  ) : (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Page route={HomeRoute} />} />
          <Route path="/about" element={<Page route={AboutRoute} />} />
          <Route path="/artikel" element={<Page route={ArticleRoute} />} />
          <Route path="/contact" element={<Page route={ContactRoute} />} />
          <Route path="/tiktok" element={<Page route={TikTokRoute} />} />
          <Route path="/reservasi" element={<Page route={ReservationRoute} />} />
          <Route path="/cek-reservasi" element={<Page route={CheckReservationRoute} />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Page route={DashboardRoute} />} />
            <Route path="/profile" element={<Page route={ProfileRoute} />} />
            <Route path="/skrining" element={<Page route={ScreeningRoute} />} />
          </Route>
          <Route path="/auth" element={<Page route={AuthRoute} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Link
        to="/skrining"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
      >
        <span aria-hidden>🩺</span> Cek Skrining Mandiri
      </Link>
    </div>
  );
}

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading || !isAuthenticated) return null;
  return <Outlet />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-7xl text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Halaman tidak ditemukan.</p>
        <Link to="/" className="mt-6 inline-block text-primary underline">Kembali ke beranda</Link>
      </div>
    </div>
  );
}

export function App() {
  return <Routes><Route path="*" element={<Shell />} /></Routes>;
}