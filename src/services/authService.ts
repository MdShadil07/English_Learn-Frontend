/**
 * Authentication Service
 * Handles API calls to the backend for authentication
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      lastLoginAt?: string;
      createdAt: string;
    };
    tokens: {
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

  async googleSignIn(token: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/google/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Google sign-in failed',
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
}

export const authService = new AuthService();
