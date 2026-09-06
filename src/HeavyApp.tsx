import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";
import PageSkeleton from "./components/ui/PageSkeleton";
import AIChatSkeleton from "./components/ui/AIChatSkeleton";

// ── Lazy load ALL pages ──
const Login           = lazy(() => import("./pages/Auth/Login.tsx"));
const Signup          = lazy(() => import("./pages/Auth/Signup.tsx"));
const ForgotPassword  = lazy(() => import("./pages/Auth/ForgotPassword.tsx"));
const ResetPassword   = lazy(() => import("./pages/Auth/ResetPassword.tsx"));
const NewDashboard    = lazy(() => import("./pages/Dashboard Page/NewDashboard.tsx"));
const Profile         = lazy(() => import("./pages/Profile Page/Profile.tsx"));
const Settings        = lazy(() => import("./pages/Settings Page/Settings.tsx"));
const NotFound        = lazy(() => import("./pages/NotFound.tsx"));
const AIChatPage      = lazy(() => import("./pages/AI Chat Page/AIChatPage"));
const PricingPage     = lazy(() => import("./pages/pricing/PricingPage"));
const CheckoutReturn  = lazy(() => import("./pages/payment/CheckoutReturn"));
const PracticeRoomPage = lazy(() => import("./pages/Practice Room/PracticeRoomPage"));
const PronunciationStudio = lazy(() => import("./pages/Pronunciation/PronunciationStudio"));
const LiveCallPage    = lazy(() => import("./pages/Pronunciation/LiveCallPage"));
const DemoVideoPage   = lazy(() => import("./pages/DemoVideo/DemoVideoPage"));
const DocumentationCenter = lazy(() => import("./pages/Documentation Page/DocumentationCenter"));
const GrammarTopicPage = lazy(() => import("./pages/Core Learning/Grammer/GrammarTopicPage"));

const queryClient = new QueryClient();

const HeavyApp = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/login" element={<Login />} />

            {/* Protected pages */}
            <Route path="/dashboard" element={<ProtectedRoute><NewDashboard /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings/*"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/ai-chat"   element={<ProtectedRoute><Suspense fallback={<AIChatSkeleton />}><AIChatPage /></Suspense></ProtectedRoute>} />
            <Route path="/payment/checkout-return" element={<ProtectedRoute><CheckoutReturn /></ProtectedRoute>} />
            <Route path="/practice-room/:roomId"   element={<ProtectedRoute><PracticeRoomPage /></ProtectedRoute>} />
            <Route path="/pronunciation"           element={<ProtectedRoute><PronunciationStudio /></ProtectedRoute>} />
            <Route path="/pronunciation/live-call" element={<ProtectedRoute><LiveCallPage /></ProtectedRoute>} />
            <Route path="/grammar/:topicId"        element={<ProtectedRoute><GrammarTopicPage /></ProtectedRoute>} />

            {/* Public pages */}
            <Route path="/pricing"       element={<PricingPage />} />
            <Route path="/docs"          element={<DocumentationCenter />} />
            <Route path="/documentation" element={<DocumentationCenter />} />
            <Route path="/demo"          element={<DemoVideoPage />} />

            {/* Catch-all */}
            <Route path="/edit-profile" element={<Navigate to="/settings/profile" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default HeavyApp;
