import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AuthCard, AuthInput, AuthButton, AuthDivider, AuthFooter } from '@/components/auth';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        console.log('✅ Login successful:', response.data);
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });

        // Store tokens in localStorage
        if (response.data?.tokens) {
          console.log('💾 Storing tokens in localStorage...');
          localStorage.setItem('accessToken', response.data.tokens.accessToken);
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }

        // Cache user data immediately for faster subsequent access
        if (response.data?.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        // Ensure AuthContext is updated with the new authentication state
        console.log('🔄 Refreshing user state in AuthContext...');
        try {
          await refreshUser();
        } catch (refreshError) {
          console.warn('⚠️ AuthContext refresh failed, but tokens are valid:', refreshError);
          // Continue with navigation even if refresh fails
        }

        // Navigate to dashboard - React Router should handle this
        console.log('🔄 Navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        toast({
          title: "Google sign-in successful!",
          description: "You have been successfully logged in.",
        });
        navigate('/dashboard', { replace: true });
      } else {
        // Handle specific error codes
        if (result.code === 'ACCOUNT_NOT_LINKED' || result.code === 'EMAIL_EXISTS_NOT_LINKED') {
          toast({
            title: "Account needs linking",
            description: result.message,
            variant: "destructive",
          });
          // Redirect to login with email/password
          // User will need to sign in first, then link Google in profile settings
        } else if (result.code === 'GOOGLE_ID_MISMATCH') {
          toast({
            title: "Security alert",
            description: result.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Google sign-in failed",
            description: result.message || "Failed to sign in with Google.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Implement other social login logic here
    toast({
      title: "Social Login",
      description: `${provider} login will be available soon!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        {/* Large gradient orbs */}
        <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-3xl dark:from-emerald-900/20 dark:to-teal-900/20"></div>
        <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-gradient-to-br from-emerald-100/40 to-green-100/40 blur-3xl dark:from-emerald-900/20 dark:to-green-900/20"></div>
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <AuthCard
          title="Welcome Back"
          subtitle="Sign in to continue your English learning journey"
        >
          {/* Social Login Options */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full"
            >
              {googleLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <Chrome className="h-4 w-4 mr-2" />
                  Continue with Google
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full"
            >
              <Github className="h-4 w-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <AuthDivider text="or continue with email" />

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              icon={<Mail className="h-4 w-4" />}
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              required
              icon={<Lock className="h-4 w-4" />}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500" />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <AuthButton
              loading={loading}
              variant="primary"
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </AuthButton>
          </form>

          <AuthFooter
            text="Don't have an account?"
            linkText="Create one here"
            linkTo="/signup"
          />
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
