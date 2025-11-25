import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthCard, AuthInput, AuthButton, AuthFooter } from '@/components/auth/AuthComponents';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Reset email sent!",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-3xl dark:from-emerald-900/20 dark:to-teal-900/20"></div>
          <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-gradient-to-br from-emerald-100/40 to-green-100/40 blur-3xl dark:from-emerald-900/20 dark:to-green-900/20"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <AuthCard
            title="Check Your Email"
            subtitle="We've sent password reset instructions"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Reset link sent!
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Click the link in the email to reset your password.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>

              <div className="space-y-3">
                <AuthButton
                  variant="primary"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </AuthButton>

                <AuthButton
                  variant="outline"
                  onClick={() => navigate('/signup')}
                >
                  Create New Account
                </AuthButton>
              </div>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-3xl dark:from-emerald-900/20 dark:to-teal-900/20"></div>
        <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-gradient-to-br from-emerald-100/40 to-green-100/40 blur-3xl dark:from-emerald-900/20 dark:to-green-900/20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <AuthCard
          title="Reset Password"
          subtitle="Enter your email to receive reset instructions"
          showBackButton
          onBack={() => navigate('/login')}
        >
          <div className="text-center mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              required
              icon={<Mail className="h-4 w-4" />}
            />

            <AuthButton
              loading={loading}
              variant="primary"
            >
              Send Reset Link
              <ArrowRight className="h-4 w-4 ml-2" />
            </AuthButton>
          </form>

          <AuthFooter
            text="Remember your password?"
            linkText="Sign in here"
            linkTo="/login"
          />
        </AuthCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
