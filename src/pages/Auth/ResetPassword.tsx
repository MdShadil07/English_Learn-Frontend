import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { AuthCard, AuthInput, AuthButton, PasswordStrength } from '@/components/auth/AuthComponents';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      navigate('/forgot-password');
    }
  }, [token, navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) return;

    setError('');
    setLoading(true);

    try {
      const response = await authService.resetPassword(token, password);

      if (!response.success) {
        throw new Error(response.message || "Failed to reset password");
      }

      setSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
          <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <AuthCard
            title="Password Reset Complete"
            subtitle="Your password has been successfully updated"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-3">
                <AuthButton
                  variant="primary"
                  onClick={() => navigate('/login')}
                >
                  Log In Now
                  <ArrowRight className="h-4 w-4 ml-2" />
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
        <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <AuthCard
          title="Create New Password"
          subtitle="Please enter your new password"
        >
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <AuthInput
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                required
                icon={<Lock className="h-5 w-5" />}
                error={error.includes('match') ? undefined : error}
              />
              
              <PasswordStrength password={password} />

              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                icon={<Lock className="h-5 w-5" />}
                error={error.includes('match') ? error : undefined}
              />
            </div>

            <AuthButton
              type="submit"
              loading={loading}
              disabled={!password || !confirmPassword || password.length < 8}
            >
              Reset Password
            </AuthButton>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default ResetPassword;
