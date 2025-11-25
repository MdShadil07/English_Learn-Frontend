import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AuthCard, AuthInput, AuthButton, AuthDivider, AuthFooter, SocialAuthButton, PasswordStrength } from '@/components/auth/AuthComponents';
import { User, Mail, Lock, Calendar, Globe, BookOpen, ArrowRight, Github, Chrome, CheckCircle } from 'lucide-react';
import { authService } from '@/services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    currentLevel: '',
    preferredLearningStyle: '',
    role: 'student'
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.",
        variant: "destructive",
      });
      return false;
    }

    // Check password complexity
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    if (!hasLowercase || !hasUppercase || !hasNumber) {
      toast({
        title: "Password requirements not met",
        description: "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
        variant: "destructive",
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const signupData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        targetLanguage: 'English',
        nativeLanguage: undefined, // Will be set to default in backend
        country: undefined,
        proficiencyLevel: formData.currentLevel || 'beginner',
        role: formData.role as 'student' | 'teacher' | 'admin',
      };

      const response = await authService.signup(signupData);

      if (response.success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to our platform. You can now start learning!",
        });

        // Store tokens in localStorage
        if (response.data?.tokens) {
          localStorage.setItem('accessToken', response.data.tokens.accessToken);
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }

        // Cache user data immediately for faster subsequent access
        if (response.data?.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        // Small delay to ensure localStorage is updated, then navigate
        setTimeout(() => {
          navigate('/dashboard');
          // Fallback: if React Router doesn't work, use window.location
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard') {
              window.location.href = '/dashboard';
            }
          }, 500);
        }, 100);
      } else {
        toast({
          title: "Signup failed",
          description: response.message || "Please check your information and try again.",
          variant: "destructive",
        });

        // Show specific field errors if available
        if (response.errors) {
          response.errors.forEach(error => {
            toast({
              title: "Validation Error",
              description: `${error.field}: ${error.message}`,
              variant: "destructive",
            });
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast({
      title: "Coming soon",
      description: `${provider} signup will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-3xl dark:from-emerald-900/20 dark:to-teal-900/20"></div>
        <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-gradient-to-br from-emerald-100/40 to-green-100/40 blur-3xl dark:from-emerald-900/20 dark:to-green-900/20"></div>

        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath opacity='.1' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <AuthCard
          title="Join CognitoSpeak"
          subtitle="Start your AI-powered English learning journey today"
        >
          {/* Social Signup Options */}
          <div className="space-y-3 mb-6">
            <SocialAuthButton
              provider="google"
              onClick={() => handleSocialSignup('Google')}
            >
              <Chrome className="h-4 w-4 mr-2" />
              Sign up with Google
            </SocialAuthButton>
            <SocialAuthButton
              provider="github"
              onClick={() => handleSocialSignup('GitHub')}
            >
              <Github className="h-4 w-4 mr-2" />
              Sign up with GitHub
            </SocialAuthButton>
          </div>

          <AuthDivider text="or create account with email" />

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuthInput
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
                required
                icon={<User className="h-4 w-4" />}
              />

              <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                required
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                required
                icon={<Lock className="h-4 w-4" />}
              />

              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                required
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full h-12 px-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  I am a
                </label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <PasswordStrength password={formData.password} />

            {/* Terms and Conditions */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  I'd like to receive updates and tips to improve my English learning
                </span>
              </label>
            </div>

            <AuthButton
              loading={loading}
              variant="primary"
            >
              Create Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </AuthButton>
          </form>

          <AuthFooter
            text="Already have an account?"
            linkText="Sign in here"
            linkTo="/login"
          />
        </AuthCard>
      </div>
    </div>
  );
};

export default Signup;
