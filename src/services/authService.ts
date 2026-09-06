/**
 * Authentication Service
 * Handles API calls to the backend for authentication
 */
const API_URL = import.meta.env.VITE_API_URL as string;

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  username?: string;
  targetLanguage?: string;
  nativeLanguage?: string;
  country?: string;
  proficiencyLevel?: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
  deviceToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      username?: string;
      fullName: string;
      avatar?: string;
      targetLanguage: string;
      proficiencyLevel: string;
      role: string;
      isEmailVerified: boolean;
      createdAt: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: {
    twoFactorRequired?: boolean;
    challengeId?: string;
    email?: string;
    expiresAt?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      username?: string;
      fullName: string;
      avatar?: string;
      targetLanguage: string;
      proficiencyLevel: string;
      role: string;
      isEmailVerified: boolean;
      lastLoginAt?: string;
      createdAt: string;
    };
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Registration failed',
          errors: result.errors,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Login failed',
          code: result.code,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Logout failed',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<{ success: boolean; message: string; data?: { accessToken: string; refreshToken: string } }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Token refresh failed',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async getProfile(accessToken: string): Promise<{ success: boolean; message: string; data?: unknown }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to get profile',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async updateProfile(accessToken: string, data: unknown): Promise<{ success: boolean; message: string; data?: unknown }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to update profile',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async getGoogleAuthUrl(): Promise<{ success: boolean; message: string; data?: { authUrl: string } }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/google/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to get Google auth URL',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async googleSignIn(idToken: string, deviceToken?: string | string[]): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/google/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, deviceToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Google sign-in failed',
          code: result.code,
          data: result.data,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async verifyTwoFactorLogin(challengeId: string, code: string, rememberDevice?: boolean): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/2fa/verify-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId, code, rememberDevice }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Security code verification failed',
          code: result.code,
          data: result.data,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Link Google account to existing user (direct method)
   */
  async linkGoogleAccount(googleToken: string): Promise<ApiResponse> {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return {
          success: false,
          message: 'Authentication required. Please log in first.',
        };
      }

      const response = await fetch(`${this.baseURL}/auth/google/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ googleToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to link Google account',
          code: result.code,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Send email-only verification code for Google account linking (maximum security)
   */
  async sendEmailOnlyGoogleLinkingVerification(email: string): Promise<ApiResponse> {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return {
          success: false,
          message: 'Authentication required. Please log in first.',
        };
      }

      const response = await fetch(`${this.baseURL}/auth/google/link/send-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to send verification code',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Verify email code and link Google account (maximum security)
   */
  async verifyEmailCodeAndLinkGoogle(email: string, code: string): Promise<ApiResponse> {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return {
          success: false,
          message: 'Authentication required. Please log in first.',
        };
      }

      const response = await fetch(`${this.baseURL}/auth/google/link/verify-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to verify and link Google account',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Resend email-only verification code for Google account linking
   */
  async resendEmailOnlyGoogleLinkingVerification(email: string): Promise<ApiResponse> {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return {
          success: false,
          message: 'Authentication required. Please log in first.',
        };
      }

      const response = await fetch(`${this.baseURL}/auth/google/link/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to resend verification code',
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, message: result.message || 'Failed to request password reset' };
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, message: result.message || 'Failed to reset password' };
      }
      return result;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }
  async getActiveSessions(accessToken: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/sessions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async revokeSession(accessToken: string, sessionId: string, twoFactorCode?: string, challengeId?: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/sessions/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, twoFactorCode, challengeId }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async setupTwoFactor(accessToken: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/2fa/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async verifyAndEnableTwoFactor(accessToken: string, challengeId: string, code: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/2fa/enable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId, code }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async disableTwoFactor(accessToken: string, challengeId?: string, twoFactorCode?: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/2fa/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId, twoFactorCode }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async changePassword(accessToken: string, data: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async getLoginHistory(accessToken: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async exportUserData(accessToken: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/data-export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async deleteAccount(accessToken: string, password?: string, twoFactorCode?: string, challengeId?: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, twoFactorCode, challengeId }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }
}

export const authService = new AuthService();
