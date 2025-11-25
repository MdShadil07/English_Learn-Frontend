import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RouteLoading from './components/ui/RouteLoading';

// Route-based code splitting: lazy-load pages to keep landing page light
const Index = lazy(() => import("./pages/Landing Page/Index.tsx"));
const Login = lazy(() => import("./pages/Auth/Login.tsx"));
const Signup = lazy(() => import("./pages/Auth/Signup.tsx"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword.tsx"));
const NewDashboard = lazy(() => import("./pages/Dashboard Page/NewDashboard.tsx"));
const Profile = lazy(() => import("./pages/Profile Page/Profile.tsx"));
const EditProfile = lazy(() => import("./pages/Edit Profile Page/EditProfile.tsx"));
const Settings = lazy(() => import("./pages/Settings Page/Settings.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AIChatPage = lazy(() => import("./pages/AI Chat Page/AIChatPage"));
const PricingPage = lazy(() => import("./pages/pricing/PricingPage"));
const CheckoutReturn = lazy(() => import("./pages/payment/CheckoutReturn"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* Public routes: do NOT wrap with AuthProvider so landing stays lightweight */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
            <Route path="/signup" element={<AuthProvider><Signup /></AuthProvider>} />
            <Route path="/forgot-password" element={<AuthProvider><ForgotPassword /></AuthProvider>} />
            <Route path="/auth/login" element={<AuthProvider><Login /></AuthProvider>} />

            {/* Protected routes: wrap each protected page with AuthProvider so auth fetch only happens when needed */}
            <Route
              path="/dashboard"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <NewDashboard />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <AIChatPage />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />
            <Route path="/pricing" element={<PricingPage />} />
            <Route
              path="/payment/checkout-return"
              element={
                <AuthProvider>
                  <ProtectedRoute>
                    <CheckoutReturn />
                  </ProtectedRoute>
                </AuthProvider>
              }
            />

            {/* Catch-all -> lazy NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
