import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AuthCard, AuthInput, AuthButton, AuthDivider, AuthFooter } from '@/components/auth';
import { Mail, Lock, ArrowRight, Github, Chrome, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService, type LoginResponse } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const authError = searchParams.get('error');

  const { toast } = useToast();
  const { refreshUser, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorChallenge, setTwoFactorChallenge] = useState<{
    challengeId: string;
    email?: string;
    expiresAt?: string;
  } | null>(null);
  const emailParam = searchParams.get('email');
  const [formData, setFormData] = useState({
    email: emailParam || '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [rememberDevice, setRememberDevice] = useState(false);

  const startTwoFactorChallenge = (challenge: {
    challengeId: string;
    email?: string;
    expiresAt?: string;
  }) => {
    setTwoFactorChallenge(challenge);
    setTwoFactorCode('');
    setRememberDevice(false);
    toast({
      title: 'Security code sent',
      description: `Enter the code we sent to ${challenge.email || 'your email address'}.`,
    });
  };

  const completeLogin = async (response: LoginResponse) => {
    if (!response.data?.tokens || !response.data.user) {
      throw new Error('Login response did not include a session.');
    }

    localStorage.setItem('accessToken', response.data.tokens.accessToken);
    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    localStorage.setItem('userData', JSON.stringify(response.data.user));

    if (response.data.deviceToken && response.data.user?.email) {
      localStorage.setItem(`trusted_device_token_${response.data.user.email}`, response.data.deviceToken);
    }

    try {
      await refreshUser();
    } catch (refreshError) {
      console.warn('⚠️ AuthContext refresh failed, but tokens are valid:', refreshError);
    }

    navigate('/dashboard', { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deviceToken = localStorage.getItem(`trusted_device_token_${formData.email.toLowerCase()}`) || undefined;
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        deviceToken,
      });

      if (response.success) {
        if (response.code === 'TWO_FACTOR_REQUIRED' && response.data?.challengeId) {
          startTwoFactorChallenge({
            challengeId: response.data.challengeId,
            email: response.data.email,
            expiresAt: response.data.expiresAt,
          });
          return;
        }

        console.log('✅ Login successful:', response.data);
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });

        await completeLogin(response);
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

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorChallenge) return;

    setTwoFactorLoading(true);
    try {
      const response = await authService.verifyTwoFactorLogin(
        twoFactorChallenge.challengeId,
        twoFactorCode.trim(),
        rememberDevice
      );

      if (response.success) {
        toast({
          title: 'Welcome back!',
          description: 'Your account has been verified successfully.',
        });
        await completeLogin(response);
      } else {
        toast({
          title: 'Verification failed',
          description: response.message || 'Enter the latest security code and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setTwoFactorLoading(false);
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
        if (result.code === 'TWO_FACTOR_REQUIRED' && result.challengeId) {
          startTwoFactorChallenge({
            challengeId: result.challengeId,
            email: result.email,
            expiresAt: result.expiresAt,
          });
        } else if (result.code === 'ACCOUNT_NOT_LINKED' || result.code === 'EMAIL_EXISTS_NOT_LINKED') {
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
        {/* Large gradient orbs optimized with radial-gradient instead of heavy blur */}
        <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <AuthCard
          title={twoFactorChallenge ? 'Security Check' : 'Welcome Back'}
          subtitle={twoFactorChallenge ? 'Enter your verification code to finish signing in' : 'Sign in to continue your English learning journey'}
        >
          {authError && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 text-red-800 dark:text-red-300">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  {authError === 'suspended' && (
                    <>
                      <p className="font-semibold mb-1">Account Suspended</p>
                      <p>Your account has been temporarily suspended due to a violation of our terms.</p>
                    </>
                  )}
                  {authError === 'banned' && (
                    <>
                      <p className="font-semibold mb-1">Account Banned</p>
                      <p>Your account has been permanently banned.</p>
                    </>
                  )}
                  {authError === 'deleted' && (
                    <>
                      <p className="font-semibold mb-1">Account Deleted</p>
                      <p>This account has been deleted and is no longer accessible.</p>
                    </>
                  )}
                  <Link to="/support" className="inline-block mt-3 px-4 py-2 bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg text-red-700 dark:text-red-200 font-medium transition-colors">
                    Contact Support for Review
                  </Link>
                </div>
              </div>
            </div>
          )}

          {twoFactorChallenge ? (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Protecting your account</p>
                    <p className="mt-1 text-emerald-800/80 dark:text-emerald-100/75">
                      We sent a 6-digit code to {twoFactorChallenge.email || 'your email address'}. You can also use an 8-character backup code.
                    </p>
                  </div>
                </div>
              </div>

              <AuthInput
                label="Security code or backup code"
                type="text"
                placeholder="123456 or 8-character backup code"
                value={twoFactorCode}
                onChange={(value) => setTwoFactorCode(value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8))}
                required
                icon={<ShieldCheck className="h-4 w-4" />}
              />

              <div className="flex items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" 
                  />
                  <span>Don't ask again on this device for 30 days</span>
                </label>
              </div>

              <AuthButton
                loading={twoFactorLoading}
                variant="primary"
                disabled={twoFactorCode.length !== 6}
              >
                Verify and Sign In
                <ArrowRight className="h-4 w-4 ml-2" />
              </AuthButton>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setTwoFactorChallenge(null)}
              >
                Back to login
              </Button>
            </form>
          ) : (
            <>
              {/* Returning User Welcome / Social Login Options */}
              {!searchParams.get('email') || formData.email !== searchParams.get('email') ? (
                <>
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
                </>
              ) : (
                <div className="mb-6 p-4 rounded-xl border border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Welcome back! Please enter your password to continue as <br/>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{formData.email}</span>
                  </p>
                  <button 
                    type="button" 
                    onClick={() => {
                      searchParams.delete('email');
                      navigate({ search: searchParams.toString() }, { replace: true });
                      setFormData(prev => ({ ...prev, email: '' }));
                    }} 
                    className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 mt-3 inline-block underline underline-offset-2 transition-colors"
                  >
                    Not you? Switch account
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {!searchParams.get('email') || formData.email !== searchParams.get('email') ? (
                  <AuthInput
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    required
                    icon={<Mail className="h-4 w-4" />}
                  />
                ) : (
                  <input type="hidden" name="email" value={formData.email} />
                )}

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
            </>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
