import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import PageSkeleton from "./components/ui/PageSkeleton";
import AuthSkeleton from "./components/ui/AuthSkeleton";

// ── Eager load ONLY the landing page (first user-visible route) ──────────────
import Index from "./pages/Landing Page/Index.tsx";

// ── Lazy load ALL other pages AND their heavy providers (Auth, Supabase, etc) ──
const HeavyApp = lazy(() => import("./HeavyApp"));

const FallbackRouter = () => {
  const path = window.location.pathname;
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/forgot-password') || path.startsWith('/reset-password') || path.startsWith('/auth');
  return isAuthRoute ? <AuthSkeleton /> : <PageSkeleton />;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" storageKey="theme" themes={['light', 'dark']}>
    <BrowserRouter>
      <Suspense fallback={<FallbackRouter />}>
        <Routes>
          {/* Landing page — eagerly loaded, completely isolated from Supabase/Auth/QueryClient */}
          <Route path="/" element={<Index />} />

          {/* All other routes are handled by the heavy app chunk */}
          <Route path="/*" element={<HeavyApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
