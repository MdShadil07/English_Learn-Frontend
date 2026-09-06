import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';
import { 
  Chrome, 
  CheckCircle, 
  AlertCircle, 
  Link, 
  Mail, 
  Shield, 
  Clock, 
  RefreshCw,
  UserCheck,
  UserX,
  Lock,
  Loader2
} from 'lucide-react';

export const SecureEmailVerificationSection: React.FC = () => {
  const { user, isAuthenticated, refreshUser, updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLinking, setIsLinking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isGoogleLinked = user?.googleAuth?.isLinked;
  const isEmailVerified = user?.isEmailVerified;

  // Debug: Log user googleAuth changes
  React.useEffect(() => {
    console.log('🔍 SecureEmailVerificationSection - user.googleAuth:', user?.googleAuth);
    console.log('🔍 isGoogleLinked:', isGoogleLinked);
  }, [user?.googleAuth, isGoogleLinked]);

  const handleLinkGoogleAccount = async () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to link your Google account",
        variant: "destructive",
      });
      return;
    }

    setIsLinking(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Send verification email directly without OAuth popup
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/link/send-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          email: user.email 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error(result.message || 'Failed to send verification code');
      }

      setShowVerification(true);
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit verification code has been sent to ${user.email}`,
      });
    } catch (error) {
      console.error('Google linking error:', error);
      let errorMessage = 'Failed to send verification code';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Linking Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated before proceeding
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to verify the code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/link/verify-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          code: verificationCode,
          email: user.email
        }),
      });

      const result = await response.json();
      console.log('🔍 verify-email-code API response:', JSON.stringify(result, null, 2));
      console.log('🔍 result.data?', !!result.data);
      console.log('🔍 result.data.user?', !!result.data?.user);
      console.log('🔍 result.data.user.googleAuth?', !!result.data?.user?.googleAuth);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error(result.message || 'Failed to verify code');
      }

      toast({
        title: "Success!",
        description: "Your Google account has been linked successfully!",
      });
      
      setShowVerification(false);
      setVerificationCode('');
      
      // Update user data from response if available
      if (result.data?.user?.googleAuth) {
        console.log('🔄 Updating user googleAuth from response:', result.data.user.googleAuth);
        
        // Directly update AuthContext user state with googleAuth data
        updateUser({
          googleAuth: {
            googleId: result.data.user.googleAuth.googleId,
            email: result.data.user.googleAuth.email,
            profilePicture: result.data.user.googleAuth.profilePicture,
            isLinked: result.data.user.googleAuth.isLinked || false,
            linkedAt: result.data.user.googleAuth.linkedAt,
            linkedBy: result.data.user.googleAuth.linkedBy,
          }
        });
        
        // Also update localStorage
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...currentUserData,
          googleAuth: {
            googleId: result.data.user.googleAuth.googleId,
            email: result.data.user.googleAuth.email,
            profilePicture: result.data.user.googleAuth.profilePicture,
            isLinked: result.data.user.googleAuth.isLinked || false,
            linkedAt: result.data.user.googleAuth.linkedAt,
            linkedBy: result.data.user.googleAuth.linkedBy,
          }
        }));
        
        console.log('✅ User state updated with googleAuth, component should re-render');
        
        // Ensure all application state is perfectly synchronized with backend
        await refreshUser();
      }
    } catch (error) {
      console.error('Verification error:', error);
      let errorMessage = 'Failed to verify code';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to resend verification code",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/link/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          email: user.email 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error(result.message || 'Failed to resend verification code');
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      console.error('Resend error:', error);
      let errorMessage = 'Failed to resend verification code';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Resend Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    setShowVerification(false);
    setVerificationCode('');
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-500/10 pb-3">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Account Verification
        </h3>
        <Shield className="w-4 h-4 text-emerald-500/50" />
      </div>

      {/* Email Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-4 mb-4 sm:mb-0">
          <div className={`p-3 rounded-full ${isEmailVerified ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 block mb-1">
              Email Address
            </Label>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.email}
            </p>
            {!isEmailVerified && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                Please verify your email to unlock all features
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {isEmailVerified ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Verified</span>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20">
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Verification
            </Button>
          )}
        </div>
      </div>

      {/* Google SSO Verification */}
      <div className="flex flex-col p-5 bg-white dark:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div className="flex items-start gap-4 mb-4 sm:mb-0">
            <div className={`p-3 rounded-full ${isGoogleLinked ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'}`}>
              <Chrome className="w-6 h-6" />
            </div>
            <div>
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 block mb-1">
                Google Single Sign-On
              </Label>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm">
                Link your Google account for faster, one-click logins. This uses a secure email verification process without popups.
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {isGoogleLinked ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Connected</span>
              </div>
            ) : !showVerification && (
              <Button 
                onClick={handleLinkGoogleAccount} 
                disabled={isLinking}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md"
              >
                {isLinking ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Link className="w-4 h-4 mr-2" />
                )}
                Link Account
              </Button>
            )}
          </div>
        </div>

        {/* Verification State Flow */}
        {showVerification && !isGoogleLinked && (
          <div className="mt-4 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">Enter Verification Code</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                We've sent a 6-digit code to <strong>{user?.email}</strong>. It expires in 10 minutes.
              </p>
              
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-[0.5em] font-mono h-12 max-w-[200px] border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-500"
                  maxLength={6}
                />
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    onClick={handleVerifyCode} 
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Verify & Link
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleResendCode} 
                    disabled={isResending}
                    className="text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Resend
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleCancel}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
