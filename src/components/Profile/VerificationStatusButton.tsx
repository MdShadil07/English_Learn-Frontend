import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserCheck, 
  UserX, 
  Chrome, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface VerificationStatusButtonProps {
  profile: {
    avatar?: string;
    fullName: string;
    level: number;
    role?: 'student' | 'teacher' | 'admin';
    stats: {
      currentStreak: number;
      totalXP: number;
    };
    isPremium: boolean;
    subscriptionStatus: string;
    preferences: any;
  };
}

export const VerificationStatusButton: React.FC<VerificationStatusButtonProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEmailVerified = user?.isEmailVerified;
  const isGoogleLinked = user?.googleAuth?.isLinked;

  // Determine overall verification status
  const isFullyVerified = isEmailVerified && isGoogleLinked;
  const hasAnyVerification = isEmailVerified || isGoogleLinked;

  const handleClick = () => {
    navigate('/edit-profile?section=verification');
  };

  if (isFullyVerified) {
    // Fully verified - show green check button
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        className="w-full justify-start h-auto py-3 px-3 bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-green-800 dark:text-green-200">Verified</div>
              <div className="text-xs text-green-600 dark:text-green-400">Account fully secured</div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Complete
          </Badge>
        </div>
      </Button>
    );
  }

  if (hasAnyVerification) {
    // Partially verified - show yellow warning button
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        className="w-full justify-start h-auto py-3 px-3 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800 dark:hover:bg-yellow-900/30"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              {isEmailVerified ? (
                <UserCheck className="h-4 w-4 text-green-600" />
              ) : (
                <UserX className="h-4 w-4 text-red-600" />
              )}
              {isGoogleLinked ? (
                <Chrome className="h-4 w-4 text-blue-600" />
              ) : (
                <Chrome className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="text-left">
              <div className="font-medium text-yellow-800 dark:text-yellow-200">Partially Verified</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                {isEmailVerified ? 'Email verified' : 'Email not verified'}
                {isEmailVerified && isGoogleLinked && ' + Google linked'}
                {!isEmailVerified && !isGoogleLinked && 'Complete verification'}
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-yellow-600" />
        </div>
      </Button>
    );
  }

  // Not verified - show red action button
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full justify-start h-auto py-3 px-3 bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-600" />
            <Chrome className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-left">
            <div className="font-medium text-red-800 dark:text-red-200">Verify Account</div>
            <div className="text-xs text-red-600 dark:text-red-400">
              Secure your account now
            </div>
          </div>
        </div>
        <Badge variant="destructive" className="text-xs">
          Action Needed
        </Badge>
      </div>
    </Button>
  );
};
