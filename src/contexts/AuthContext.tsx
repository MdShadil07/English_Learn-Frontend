import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { api } from '@/utils/api';
import { queryKeys, queryOptions } from '@/utils/queryKeys';
import { SubscriptionDetails } from '@/types/user';

// Declare Google OAuth types
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  fullName: string;
  avatar?: string;
  targetLanguage: string;
  proficiencyLevel: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  tier: 'free' | 'pro' | 'premium';
  // Google OAuth fields
  googleAuth?: {
    googleId: string;
    email: string;
    profilePicture?: string;
    isLinked: boolean;
    linkedAt?: string;
    linkedBy?: 'manual' | 'sso_first_time' | 'email_verification';
  };
  // Backward compatibility flags from profile data
  isPremium?: boolean;
  isPro?: boolean;
  subscriptionStatus?: string;
  subscriptionDetails?: SubscriptionDetails;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
  refreshUser: () => Promise<unknown>;
  updateUser: (updates: Partial<User>) => void;
  signInWithGoogle: () => Promise<{ success: boolean; message: string }>;
  linkGoogleAccount: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Unified user profile query - single source of truth
  const {
    data: userData,
    isLoading,
    error,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: queryKeys.global.currentUser(),
    queryFn: async () => {
      console.log('🔄 AuthProvider: Fetching user profile via React Query...');

      // Define extended user/profile types for extra fields
      type ExtendedUser = Partial<User> & {
        isPremium?: boolean;
        subscriptionStatus?: string;
        avatar_url?: string;
        subscriptionDetails?: SubscriptionDetails;
      };
      type ExtendedProfile = Record<string, unknown> & {
        isPremium?: boolean;
        subscriptionStatus?: string;
        avatar_url?: string;
        displayName?: string;
        targetLanguage?: string;
        proficiencyLevel?: string;
        subscriptionDetails?: SubscriptionDetails;
      };

      function hasIsPremium(obj: unknown): obj is { isPremium: boolean } {
        return typeof obj === 'object' && obj !== null && 'isPremium' in obj;
      }
      function hasSubscriptionStatus(obj: unknown): obj is { subscriptionStatus: string } {
        return typeof obj === 'object' && obj !== null && 'subscriptionStatus' in obj;
      }
      function hasAvatarUrl(obj: unknown): obj is { avatar_url: string } {
        return typeof obj === 'object' && obj !== null && 'avatar_url' in obj;
      }
      function hasObjectId(obj: unknown): obj is { _id: unknown } {
        return typeof obj === 'object' && obj !== null && '_id' in obj;
      }
      function hasId(obj: unknown): obj is { id: unknown } {
        return typeof obj === 'object' && obj !== null && 'id' in obj;
      }

      const normalizeId = (value: unknown): string | undefined => {
        if (!value) {
          return undefined;
        }

        if (typeof value === 'string') {
          const trimmed = value.trim();
          return trimmed.length > 0 ? trimmed : undefined;
        }

        if (typeof value === 'number') {
          const numericString = String(value);
          return numericString.length > 0 ? numericString : undefined;
        }

        if (typeof value === 'object' && value !== null && 'toString' in value) {
          const str = (value as { toString: () => string }).toString();
          const trimmed = str.trim();
          if (trimmed && trimmed !== '[object Object]') {
            return trimmed;
          }
        }

        return undefined;
      };

      try {
        // Try main profile API first (consistent with EditProfile)
        const result = await api.profile.get() as { success: boolean; data?: { user?: ExtendedUser; profile?: ExtendedProfile } };
        console.log('📡 AuthProvider: Profile API result:', result);

        if (result.success && result.data) {
          const resolvedUserId =
            (result.data.user && hasObjectId(result.data.user) && normalizeId(result.data.user._id)) ||
            normalizeId(result.data.user?.id) ||
            normalizeId((result.data.profile as { userId?: unknown } | undefined)?.userId) ||
            (result.data.profile && hasObjectId(result.data.profile) && normalizeId(result.data.profile._id));

          // Transform to consistent format
          const transformedUser: User = {
            id: resolvedUserId ?? '',
            email: result.data.user?.email || 'user@example.com',
            firstName: result.data.user?.firstName || '',
            lastName: result.data.user?.lastName || '',
            username: result.data.user?.username || '',
            fullName: result.data.user?.fullName || String(result.data.profile?.displayName) || 'User',
            avatar: result.data.user?.avatar
              || (result.data.user && hasAvatarUrl(result.data.user) ? result.data.user.avatar_url : undefined)
              || (result.data.profile && hasAvatarUrl(result.data.profile) ? result.data.profile.avatar_url : undefined)
              || undefined,
            targetLanguage: String(result.data.profile?.targetLanguage || result.data.user?.targetLanguage || 'English'),
            proficiencyLevel: String(result.data.profile?.proficiencyLevel || result.data.user?.proficiencyLevel || 'beginner'),
            role: result.data.user?.role || 'student',
            isEmailVerified: true, // Assume verified if we have profile data
            createdAt: result.data.user?.createdAt || new Date().toISOString(),
            lastLoginAt: result.data.user?.lastLoginAt,
            // Google OAuth fields
            googleAuth: result.data.user?.googleAuth ? {
              googleId: result.data.user.googleAuth.googleId,
              email: result.data.user.googleAuth.email,
              profilePicture: result.data.user.googleAuth.profilePicture,
              isLinked: result.data.user.googleAuth.isLinked || false,
              linkedAt: result.data.user.googleAuth.linkedAt,
              linkedBy: result.data.user.googleAuth.linkedBy,
            } : undefined,
            // Canonical tier logic - check tier field first, then fallback to isPremium/subscriptionStatus
            tier: (
              // Direct tier field from user or profile
              (result.data.user?.tier === 'premium' || result.data.profile?.tier === 'premium') ||
              // Fallback to isPremium or subscriptionStatus
              ((result.data.user && hasIsPremium(result.data.user) && result.data.user.isPremium) ||
              (result.data.profile && hasIsPremium(result.data.profile) && result.data.profile.isPremium) ||
              (result.data.user && hasSubscriptionStatus(result.data.user) && result.data.user.subscriptionStatus === 'premium') ||
              (result.data.profile && hasSubscriptionStatus(result.data.profile) && result.data.profile.subscriptionStatus === 'premium'))
            )
              ? 'premium'
              : (
                result.data.user?.tier === 'pro' || result.data.profile?.tier === 'pro' ||
                (result.data.user && hasSubscriptionStatus(result.data.user) && result.data.user.subscriptionStatus === 'pro') ||
                (result.data.profile && hasSubscriptionStatus(result.data.profile) && result.data.profile.subscriptionStatus === 'pro')
              )
                ? 'pro'
                : 'free',
            subscriptionDetails: result.data.user?.subscriptionDetails || result.data.profile?.subscriptionDetails,
          };

          console.log('✅ AuthProvider: User data transformed and cached');

          // Also expose legacy boolean flags for components that may check them directly
          const computedIsPremium = (
            transformedUser?.tier === 'premium' ||
            (result.data.user && hasIsPremium(result.data.user) && result.data.user.isPremium) ||
            (result.data.profile && hasIsPremium(result.data.profile) && result.data.profile.isPremium) ||
            (result.data.user && hasSubscriptionStatus(result.data.user) && result.data.user.subscriptionStatus === 'premium') ||
            (result.data.profile && hasSubscriptionStatus(result.data.profile) && result.data.profile.subscriptionStatus === 'premium')
          );

          const computedIsPro = (
            transformedUser?.tier === 'pro' ||
            (result.data.user && hasSubscriptionStatus(result.data.user) && result.data.user.subscriptionStatus === 'pro') ||
            (result.data.profile && hasSubscriptionStatus(result.data.profile) && result.data.profile.subscriptionStatus === 'pro')
          );

          // Attach computed flags to the transformed user object before returning
          (transformedUser as any).isPremium = !!computedIsPremium;
          (transformedUser as any).isPro = !!computedIsPro;
          (transformedUser as any).subscriptionStatus =
            (result.data.user && (result.data.user as any).subscriptionStatus) ||
            (result.data.profile && (result.data.profile as any).subscriptionStatus) ||
            undefined;

          console.log('✅ AuthProvider: Computed legacy flags (isPremium/isPro) attached');
          return transformedUser;
        }
      } catch (error) {
        console.error('❌ AuthProvider: Main profile API failed, trying auth API:', error);

        // If it's a 401 error, the user is not authenticated
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('unauthorized'))) {
          console.log('🚫 AuthProvider: User not authenticated (401)');
          throw new Error('Not authenticated');
        }

        // Fallback to auth API
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const authResult = await authService.getProfile(accessToken);
          if (authResult.success && authResult.data && (authResult.data as any).user) {
            console.log('✅ AuthProvider: Fallback to auth API successful');
            const fallbackUser = (authResult.data as any).user;
            const resolvedUserId =
              (hasObjectId(fallbackUser) && normalizeId(fallbackUser._id)) ||
              (hasId(fallbackUser) && normalizeId(fallbackUser.id));

            if (resolvedUserId) {
              return { ...fallbackUser, id: resolvedUserId };
            }

            return fallbackUser;
          }
        }

        // If fallback also fails, throw the original error
        throw error;
      }
    },
    ...queryOptions.user,
    enabled: !!localStorage.getItem('accessToken'), // Only fetch if user has an access token
    staleTime: 30 * 1000, // 30 seconds for user data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        console.log('🚫 AuthContext: 401 error detected, not retrying');
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update local user state when query data changes
  useEffect(() => {
    if (userData) {
      console.log('🔄 AuthProvider: User state updated from React Query');
      setUser(userData);
      // Update localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
    } else if (error) {
      console.log('🚨 AuthProvider: User authentication failed, clearing data');
      // Only clear data if it's an authentication error, not other types of errors
      if (error.message === 'Not authenticated' || error.message?.includes('401') || error.message?.includes('unauthorized')) {
        console.log('🚫 AuthProvider: Authentication error detected, clearing user data');
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
  }, [userData, error]);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('ℹ️ AuthProvider: No access token found, user not authenticated');
        setUser(null);
        return;
      }

      // Check if we have cached user data
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        try {
          const userData = JSON.parse(cachedUserData);
          console.log('✅ AuthProvider: Using cached user data');
          setUser(userData);
        } catch (parseError) {
          console.error('❌ AuthProvider: Error parsing cached user data:', parseError);
          localStorage.removeItem('userData');
        }
      }

      // Always refetch to ensure fresh data
      refetchUserData();
    };

    initializeAuth();

    // Listen for localStorage changes (cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'userData') {
        console.log('🔄 AuthProvider: Storage changed, reinitializing auth');
        initializeAuth();
      }
    };

    // Listen for manual auth updates (e.g., profile changes)
    const handleAuthUpdate = (event: CustomEvent) => {
      console.log('🔄 AuthProvider: Manual auth update received:', event.detail);
      setUser(event.detail);
      queryClient.setQueryData(queryKeys.global.currentUser(), event.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authUpdate', handleAuthUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authUpdate', handleAuthUpdate as EventListener);
    };
  }, [refetchUserData, queryClient]);

  // Sign out function
  const signOut = useCallback(async () => {
    console.log('🚪 AuthProvider: Signing out user');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('❌ AuthProvider: Logout API call failed:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');

      // Clear React Query cache
      queryClient.clear();

      // Reset user state
      setUser(null);

      // Reset Google OAuth state by removing the Google script
      const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (googleScript) {
        googleScript.remove();
      }
      // Clear window.google to force reload
      if (window.google) {
        delete (window as any).google;
      }

      console.log('✅ AuthProvider: User signed out successfully');
    }
  }, [queryClient]);

  // Refresh user data (returns the refetch promise so callers can await)
  const refreshUser = useCallback(() => {
    console.log('AuthProvider: Manual user refresh requested');
    return refetchUserData();
  }, [refetchUserData]);

  // Update user data (for optimistic updates)
  const updateUser = useCallback((updates: Partial<User>) => {
    console.log('AuthProvider: Updating user data:', updates);
    setUser(prev => prev ? { ...prev, ...updates } : null);
    queryClient.setQueryData(queryKeys.global.currentUser(), (prev: User | undefined) =>
      prev ? { ...prev, ...updates } : prev
    );
  }, [queryClient]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean; message: string; code?: string }> => {
    try {
      // Load Google API script if not already loaded
      if (!window.google) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Check if popup blocker might be active
      const testPopup = window.open('', '_blank', 'width=1,height=1,left=-9999,top=-9999');
      if (!testPopup) {
        console.warn('⚠️ Popup blocker detected. Google OAuth may not work.');
        return { 
          success: false, 
          message: 'Popup blocker is blocking Google Sign-In. Please allow popups for this site:\n\n1. Click the popup blocker icon in your browser address bar\n2. Select "Always allow popups from this site"\n3. Try signing in with Google again' 
        };
      }
      testPopup.close();

      // Initialize Google Sign-In with redirect flow to avoid COOP issues
      return new Promise((resolve) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          callback: async (response) => {
            if (response.error) {
              console.error('Google OAuth error:', response.error);
              const errorMessage = response.error === 'popup_closed' 
                ? 'Google sign-in was cancelled' 
                : 'Failed to sign in with Google';
              resolve({ success: false, message: errorMessage });
              return;
            }

            try {
              // Send the ID token to backend for verification
              const result = await authService.googleSignIn(response.access_token || response.id_token);
              
              if (result.success && result.data) {
                // Store tokens
                localStorage.setItem('accessToken', result.data.tokens.accessToken);
                localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
                
                // Update user state
                updateUser(result.data.user);
                
                // Invalidate and refetch user data to ensure consistency
                await refetchUserData();
                
                resolve({ success: true, message: 'Successfully signed in with Google!' });
              } else {
                // Handle specific error codes for account linking
                if (result.code === 'ACCOUNT_NOT_LINKED') {
                  resolve({ 
                    success: false, 
                    message: 'Your Google account needs to be linked. Please sign in with your email/password first, then link your Google account in profile settings.',
                    code: result.code
                  });
                } else if (result.code === 'EMAIL_EXISTS_NOT_LINKED') {
                  resolve({ 
                    success: false, 
                    message: 'An account with this email already exists. Please sign in with your email/password first, then link your Google account in profile settings.',
                    code: result.code
                  });
                } else if (result.code === 'GOOGLE_ID_MISMATCH') {
                  resolve({ 
                    success: false, 
                    message: 'Security alert: This Google account is already linked to a different account. Please contact support.',
                    code: result.code
                  });
                } else {
                  throw new Error(result.message || 'Authentication failed');
                }
              }
            } catch (error) {
              console.error('Backend authentication error:', error);
              const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
              resolve({ success: false, message: errorMessage });
            }
          },
          error_callback: (error) => {
            console.error('Google OAuth error:', error);
            if (error?.type === 'popup_closed' || error?.message?.includes('Popup window closed')) {
              resolve({ success: false, message: 'Google sign-in was cancelled. Please try again.' });
            } else if (error?.type === 'popup_failed_to_open' || error?.message?.includes('Failed to open popup window')) {
              resolve({ 
                success: false, 
                message: 'Popup blocker is blocking Google Sign-In. Please allow popups for this site:\n\n1. Click the popup blocker icon in your browser address bar (usually top-right)\n2. Select "Always allow popups from this site" or "Allow"\n3. Refresh the page and try signing in with Google again\n\nIf you still see this error, try:\n- Disabling your popup blocker temporarily\n- Using a different browser\n- Using incognito/private mode' 
              });
            } else {
              resolve({ success: false, message: 'Failed to sign in with Google. Please try again.' });
            }
          },
        });

        // Request the token
        client.requestAccessToken();
      });
    } catch (error) {
      console.error('Google login initialization error:', error);
      return { success: false, message: 'Failed to initialize Google sign-in' };
    }
  }, [updateUser, refetchUserData]);

  // Link Google account to existing user
  const linkGoogleAccount = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Load Google API script if not already loaded
      if (!window.google) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Check if popup blocker might be active
      const testPopup = window.open('', '_blank', 'width=1,height=1,left=-9999,top=-9999');
      if (!testPopup) {
        console.warn('⚠️ Popup blocker detected. Google OAuth may not work.');
        return { 
          success: false, 
          message: 'Popup blocker is blocking Google Sign-In. Please allow popups for this site:\n\n1. Click the popup blocker icon in your browser address bar\n2. Select "Always allow popups from this site"\n3. Try linking your Google account again' 
        };
      }
      testPopup.close();

      // Initialize Google Sign-In for linking
      return new Promise((resolve) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          callback: async (response) => {
            if (response.error) {
              console.error('Google OAuth error:', response.error);
              const errorMessage = response.error === 'popup_closed' 
                ? 'Google linking was cancelled' 
                : 'Failed to link Google account';
              resolve({ success: false, message: errorMessage });
              return;
            }

            try {
              // Send the token to backend for linking
              const result = await authService.linkGoogleAccount(response.access_token || response.id_token);
              
              if (result.success) {
                // Update user state with linked Google info
                await refetchUserData();
                resolve({ success: true, message: 'Google account linked successfully!' });
              } else {
                resolve({ success: false, message: result.message || 'Failed to link Google account' });
              }
            } catch (error) {
              console.error('Google account linking error:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to link Google account';
              resolve({ success: false, message: errorMessage });
            }
          },
          error_callback: (error) => {
            console.error('Google OAuth error:', error);
            if (error?.type === 'popup_closed' || error?.message?.includes('Popup window closed')) {
              resolve({ success: false, message: 'Google linking was cancelled. Please try again.' });
            } else if (error?.type === 'popup_failed_to_open' || error?.message?.includes('Failed to open popup window')) {
              resolve({ 
                success: false, 
                message: 'Popup blocker is blocking Google Sign-In. Please allow popups for this site:\n\n1. Click the popup blocker icon in your browser address bar (usually top-right)\n2. Select "Always allow popups from this site" or "Allow"\n3. Refresh the page and try linking your Google account again\n\nIf you still see this error, try:\n- Disabling your popup blocker temporarily\n- Using a different browser\n- Using incognito/private mode' 
              });
            } else {
              resolve({ success: false, message: 'Failed to link Google account. Please try again.' });
            }
          },
        });

        // Request the token
        client.requestAccessToken();
      });
    } catch (error) {
      console.error('Google linking initialization error:', error);
      return { success: false, message: 'Failed to initialize Google linking' };
    }
  }, [refetchUserData]);

  // Check authentication status
  const isAuthenticated = !!user && !error;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || (!user && !error), // Loading if no user data and no error
    signOut,
    refreshUser,
    updateUser,
    signInWithGoogle,
    linkGoogleAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
