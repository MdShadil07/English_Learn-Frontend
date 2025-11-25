import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Index from "./pages/Landing Page/Index.tsx";
import Login from "./pages/Auth/Login.tsx";
import Signup from "./pages/Auth/Signup.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";
import NewDashboard from "./pages/Dashboard Page/NewDashboard.tsx";
import Profile from "./pages/Profile Page/Profile.tsx";
import EditProfile from "./pages/Edit Profile Page/EditProfile.tsx";
import Settings from "./pages/Settings Page/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import AIChatPage from "./pages/AI Chat Page/AIChatPage";
import PricingPage from "./pages/pricing/PricingPage";
import CheckoutReturn from "./pages/payment/CheckoutReturn";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <NewDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
             <Route
               path="/ai-chat"
               element={
                 <ProtectedRoute>
                   <AIChatPage />
                 </ProtectedRoute>
               }
             />
            <Route path="/pricing" element={<PricingPage />} />
            <Route
              path="/payment/checkout-return"
              element={
                <ProtectedRoute>
                  <CheckoutReturn />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
