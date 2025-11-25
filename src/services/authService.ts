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
}

export const authService = new AuthService();
