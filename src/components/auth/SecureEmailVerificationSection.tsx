import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Lock
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
          googleAuth: result.data.user.googleAuth
        });
        
        // Also update localStorage
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...currentUserData,
          googleAuth: result.data.user.googleAuth
        }));
        
        console.log('✅ User state updated with googleAuth, component should re-render');
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
      {/* Email Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification
          </CardTitle>
          <CardDescription>
            Manage your email verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              {isEmailVerified ? (
                <UserCheck className="h-5 w-5 text-green-600" />
              ) : (
                <UserX className="h-5 w-5 text-red-600" />
              )}
              <div>
                <div className="font-medium">Email Address</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
            </div>
            <Badge 
              variant={isEmailVerified ? "secondary" : "destructive"}
              className={isEmailVerified ? "bg-green-100 text-green-800" : ""}
            >
              {isEmailVerified ? "Verified" : "Not Verified"}
            </Badge>
          </div>

          {!isEmailVerified && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Your email address is not verified. Please verify your email to enable all features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Google SSO Verification - Email Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Chrome className="h-5 w-5" />
            Google SSO Verification
          </CardTitle>
          <CardDescription>
            Link your Google account with secure email verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGoogleLinked ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-2">
                    <div className="font-medium">Google account successfully linked!</div>
                    <div className="text-sm">
                      <div>Linked: {user?.googleAuth?.linkedAt ? new Date(user.googleAuth.linkedAt).toLocaleDateString() : 'Unknown'}</div>
                      <div>Method: Secure Email Verification</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  <span className="text-sm font-medium">Google SSO</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Lock className="h-4 w-4 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium">Maximum Security</div>
                  <div>Account linked via secure email verification only</div>
                </div>
              </div>
            </div>
          ) : showVerification ? (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2">
                    <div className="font-medium">Check your email</div>
                    <div className="text-sm">
                      We've sent a 6-digit verification code to <strong>{user?.email}</strong>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <label className="text-sm font-medium">Verification Code</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify and Link Google Account
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleResendCode} 
                    disabled={isResending}
                    className="flex-1"
                  >
                    {isResending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                        Resending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Code
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                The verification code will expire in 10 minutes
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Lock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2">
                    <div className="font-medium">Maximum Security - Email Only Verification</div>
                    <div className="text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Click "Link Google Account" to start the secure process</li>
                        <li>Receive a verification code via email (no popups)</li>
                        <li>Enter the 6-digit code to verify ownership</li>
                        <li>Your Google account will be linked securely</li>
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  <span className="text-sm font-medium">Google SSO</span>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  Not Connected
                </Badge>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
                <div className="text-sm text-green-800">
                  <div className="font-medium">Enhanced Security</div>
                  <div>No OAuth popups - email verification only</div>
                </div>
              </div>

              <Button 
                onClick={handleLinkGoogleAccount} 
                disabled={isLinking}
                className="w-full"
              >
                {isLinking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Verification Code...
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Link Google Account
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <strong>Maximum Security:</strong> Email verification only, no OAuth popups
                </div>
                <div>
                  By linking your Google account, you'll be able to sign in with Google in the future.
                  Your existing email/password login will continue to work.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
