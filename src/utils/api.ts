/**
 * API Configuration
 * Frontend API client for backend integration with comprehensive profile features
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

/**
 * Create API function with proper authentication and typing
 */
const createApiFunction = <T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  options: {
    requiresAuth?: boolean;
    isFormData?: boolean;
    customHeaders?: Record<string, string>;
    // If true, do not automatically clear tokens or redirect to login on 401.
    suppressAuthRedirect?: boolean;
  } = {}
) => {
  return async (data?: T) => {
    try {
      const { requiresAuth = true, isFormData = false, customHeaders = {} } = options;

      const headers: Record<string, string> = {};

      // Add authentication header if required
      if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Set content type based on data format
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      // Add custom headers
      Object.assign(headers, customHeaders);

      const config: RequestInit = {
        method,
        headers,
        // include credentials in case backend uses cookies (helps cross-origin dev setups)
        credentials: 'include',
      };

      // Debug: log outgoing request summary (mask token for safety)
      try {
        const maskedHeaders: Record<string, string> = {};
        Object.keys(headers).forEach((k) => {
          const v = (headers as Record<string, string>)[k] as string;
          if (k.toLowerCase() === 'authorization' && typeof v === 'string') {
            // show only first 8 characters of token
            const parts = v.split(' ');
            maskedHeaders[k] = parts.length > 1 ? `${parts[0]} *****${parts[1].slice(0, 8)}...` : '*****';
          } else {
            maskedHeaders[k] = v;
          }
        });
        console.debug(`api.createApiFunction -> ${method} ${endpoint} headers:`, maskedHeaders);
      } catch (e) {
        // ignore debug logging failures
      }

      // Handle different data formats
      if (data) {
        if (isFormData) {
          // For FormData (file uploads)
          config.body = data as BodyInit; // Explicitly cast to BodyInit
        } else {
          // For JSON data
          config.body = JSON.stringify(data);
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle unauthorized responses
      if (response.status === 401) {
        // For profile endpoint, don't redirect - let the frontend handle it
        if (endpoint === '/profile' && method === 'GET') {
          throw new Error('401: Authentication required');
        }

        // If caller requested to suppress auto-redirect, throw and let caller handle
        const suppress = (options as { suppressAuthRedirect?: boolean } | undefined)?.suppressAuthRedirect;
        if (suppress) {
          throw new Error('401: Authentication required');
        }

        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      // Some successful responses may not include a body (e.g., 204 No Content or 304 Not Modified).
      if (response.status === 204 || response.status === 304) {
        // If the server returns 304 Not Modified, prefer returning cached userData
        // (useful for the profile endpoint). This avoids JSON parsing errors
        // for empty responses and allows the frontend to continue using a
        // previously-cached user object.
        if (response.status === 304) {
          try {
            const cached = localStorage.getItem('userData');
            if (cached) {
              // Return structure similar to server: { success: true, data: { user: <cached> } }
              return {
                success: true,
                message: '',
                data: { user: JSON.parse(cached) },
                timestamp: '',
                requestId: '',
              } as ApiResponse<{ user: UserData }>;
            }
          } catch (e) {
            // ignore parse errors and fall through to empty success
            console.warn('api.createApiFunction: failed to parse cached userData for 304 response', e);
          }
        }

        // For 204 or when no cached data is available, return a minimal success.
        return { success: true, message: '', data: null, timestamp: '', requestId: '' } as ApiResponse<null>;
      }

      const result = await response.json();

      // Handle API errors
      if (!result.success && response.status >= 400) {
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);

      // Network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }

      throw error;
    }
  };
};

/**
 * API endpoints organized by feature with full backend alignment
 */
export const api = {
  // Authentication endpoints
  auth: {
    signup: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
      nativeLanguage?: string;
      targetLanguage?: string;
      country?: string;
      proficiencyLevel?: string;
    }) => createApiFunction('POST', '/auth/register', { requiresAuth: false })(data),

    login: (data: { email: string; password: string }) =>
      createApiFunction('POST', '/auth/login', { requiresAuth: false })(data),

    logout: () => createApiFunction('POST', '/auth/logout')(),

    getProfile: () => createApiFunction('GET', '/auth/profile')(),

    updateProfile: (data: Partial<UserData>) => createApiFunction('PUT', '/auth/profile')(data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      createApiFunction('POST', '/auth/change-password')(data),

    refreshToken: (data: { refreshToken: string }) =>
      createApiFunction('POST', '/auth/refresh-token', { requiresAuth: false })(data),
  },

  // Profile management endpoints (comprehensive system)
  profile: {
    // Basic profile operations
    get: () => createApiFunction('GET', '/profile')(),
    update: (data: Partial<ProfileData>) => createApiFunction('PUT', '/profile')(data),

    // Password management
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      createApiFunction('POST', '/profile/change-password')(data),

    // File upload endpoints (new comprehensive system)
    uploadAvatar: (data: FormData) =>
      createApiFunction('POST', '/profile/avatar-optimized', {
        requiresAuth: true,
        isFormData: true
      })(data),

    uploadDocument: (data: FormData) =>
      createApiFunction('POST', '/profile/document', {
        requiresAuth: true,
        isFormData: true
      })(data),

    deleteFile: (fileType: string, fileKey: string) =>
      createApiFunction('DELETE', `/profile/file/${fileType}/${fileKey}`)(),

    getFileUrl: (fileKey: string, expiresIn?: number) =>
      createApiFunction('GET', `/profile/file/${fileKey}${expiresIn ? `?expiresIn=${expiresIn}` : ''}`)(),

    // Legacy photo upload (maintained for compatibility)
    uploadPhoto: (data: FormData) => {
      return fetch(`${API_BASE_URL}/profile/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: data,
      }).then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.message || 'Upload failed');
        }
        return result;
      });
    },
  },

  // User management endpoints
  user: {
    getStats: () => createApiFunction('GET', '/user/stats')(),
    getLevel: () => createApiFunction('GET', '/user/level')(),
    initialize: (data: { userName?: string; userEmail?: string }) =>
      createApiFunction('POST', '/user/initialize')(data),
    addXP: (data: { xpAmount: number; reason?: string }) =>
      createApiFunction('POST', '/user/xp')(data),
    updateSession: () => createApiFunction('PUT', '/user/session')(),
    updateSkills: (skills: string[]) => createApiFunction('PUT', '/user/skills')(skills),
    update: (data: { firstName?: string; lastName?: string; username?: string }) =>
      createApiFunction('PUT', '/user/profile')(data),
    search: (query: string) =>
      createApiFunction('GET', `/user/search?q=${encodeURIComponent(query)}`, { requiresAuth: true })(),
    getPublicProfile: (userId: string) =>
      createApiFunction('GET', `/user/${userId}/public-profile`, { requiresAuth: true })(),
  },

  // Progress tracking endpoints
  progress: {
    calculateXPReward: (data: { action: string; multiplier?: number; customXP?: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-reward')(data),
    getLevelInfo: (data: { totalXP: number }) =>
      createApiFunction('POST', '/progress/get-level-info')(data),
    calculateXPForLevel: (data: { level: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-for-level')(data),
    calculateXPForNextLevel: (data: { currentLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-for-next-level')(data),
    calculateLevelFromXP: (data: { totalXP: number }) =>
      createApiFunction('POST', '/progress/calculate-level-from-xp')(data),
    calculateCurrentLevelXP: (data: { totalXP: number; currentLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-current-level-xp')(data),
    calculateXPToNextLevel: (data: { totalXP: number; currentLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-xp-to-next-level')(data),
    checkLevelUp: (data: { oldXP: number; newXP: number }) =>
      createApiFunction('POST', '/progress/check-level-up')(data),
    calculateTotalXPForLevel: (data: { targetLevel: number }) =>
      createApiFunction('POST', '/progress/calculate-total-xp-for-level')(data),
    updateProgress: (userId: string, data: { xpAmount?: number; accuracy?: number; skills?: string[] }) =>
      createApiFunction('POST', `/progress/${userId}/update`)(data),
  },

  // User level management endpoints
  level: {
    getUserLevel: (userId: string) => createApiFunction('GET', `/level/${userId}`)(),
    initializeUserLevel: (data: { userId: string; userName?: string; userEmail?: string }) =>
      createApiFunction('POST', '/level/initialize')(data),
    addXP: (userId: string, data: { xpAmount: number; reason?: string }) =>
      createApiFunction('POST', `/level/${userId}/xp`)(data),
    updateSession: (userId: string) => createApiFunction('POST', `/level/${userId}/session`)(),
    updateSkills: (userId: string, skills: string[]) =>
      createApiFunction('PUT', `/level/${userId}/skills`)(skills),
    getStats: (userId: string) => createApiFunction('GET', `/level/${userId}/stats`)(),
  },

  // Accuracy analysis endpoints
  accuracy: {
    analyzeMessage: (data: { userMessage: string; aiResponse?: string }) =>
      createApiFunction('POST', '/accuracy/analyze')(data),
  },

  // Audio / Speech endpoints
  audio: {
    // Upload base64-encoded PCM/WAV and return a transcript
    transcribe: async (data: { audioBase64: string; format?: string; sampleRate?: number }) => {
      // Use the generic API helper but catch 404s (route not implemented) and return
      // a structured error so the frontend can fallback gracefully in dev when
      // the backend transcription service is not available.
      try {
        return await createApiFunction('POST', '/audio/transcribe')(data);
      } catch (err: any) {
        const msg = String(err?.message || err);
        if (msg.includes('not found') || msg.includes('Route') || msg.includes('404')) {
          return {
            success: false,
            message: 'Route /audio/transcribe not found',
            data: null,
            code: 'ROUTE_NOT_FOUND'
          } as unknown as ApiResponse<null> & { code: string };
        }
        throw err;
      }
    },
  },

  // Admin endpoints
  admin: {
    getUsers: () => createApiFunction('GET', '/admin/users')(),
    getAnalytics: () => createApiFunction('GET', '/admin/analytics')(),
    updateUser: (id: string, data: Partial<UserData>) => createApiFunction('PUT', `/admin/users/${id}`)(data),
  },

  // Health check and monitoring
  health: {
    check: () => createApiFunction('GET', '/health', { requiresAuth: false })(),
    getMetrics: () => createApiFunction('GET', '/metrics', { requiresAuth: false })(),
    getApiDocs: () => createApiFunction('GET', '/api-docs.json', { requiresAuth: false })(),
  },

  // Payment endpoints
  payment: {
    // Start a trial (requires auth) - DISABLED
    // startTrial: (data: { planId?: string; planType?: string; trialDays?: number }) =>
    //   createApiFunction('POST', '/payment/start-trial', { requiresAuth: true, suppressAuthRedirect: true })(data),
    // Create subscription/order (returns razorpay order info)
    subscribe: (data: { amount: number; currency?: string; planId?: string; planType?: string; buyerState?: string; buyerGstin?: string }) =>
      createApiFunction('POST', '/payment/subscribe', { requiresAuth: true, suppressAuthRedirect: true })(data),
    // Confirm payment after checkout
    // Accepts either order payment confirm or subscription confirm payloads
    confirm: (data: { paymentId: string; orderId?: string } | { razorpay_payment_id?: string; razorpay_subscription_id?: string; razorpay_signature?: string }) =>
      createApiFunction('POST', '/payment/confirm', { requiresAuth: true, suppressAuthRedirect: true })(data as unknown),
    // Fetch payment details
    getPayment: (id: string) => createApiFunction('GET', `/payment/payment/${id}`, { requiresAuth: false })(),
    // Fetch active subscription plans (public)
    getPlans: () => createApiFunction('GET', '/payment/plans', { requiresAuth: false })(),
    // Get pricing configuration from environment variables (public)
    getPricingConfig: () => createApiFunction('GET', '/payment/pricing-config', { requiresAuth: false })(),
    // Create a production subscription (recurring) - returns gateway subscription id for client checkout
    createSubscription: (data: { planId?: string; planType?: string; idempotencyKey?: string }) =>
      createApiFunction('POST', '/payment/create-subscription', { requiresAuth: true, suppressAuthRedirect: true })(data),
    // Create a subscription with trial: creates Razorpay customer/subscription and returns subscription id for client checkout
    // DISABLED: trial flow is not ready for production
    // createSubscriptionTrial: (data: { planId?: string; planType?: string; trialDays?: number }) =>
    //   createApiFunction('POST', '/payment/create-subscription-trial', { requiresAuth: true, suppressAuthRedirect: true })(data),
    // Fetch current user's active subscription
    getMySubscription: () => createApiFunction('GET', '/payment/my-subscription', { requiresAuth: true })(undefined),
    // Tax preview (no persistence)
    taxPreview: (data: { amount: number; buyerState?: string; taxRatePercent?: number }) =>
      createApiFunction('POST', '/payment/tax-preview', { requiresAuth: false })(data),
  },
};

/**
 * API Response types for better TypeScript support
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
  requestId?: string;
}

export interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName?: string;
  username?: string;
  targetLanguage: string;
  nativeLanguage?: string;
  country?: string;
  proficiencyLevel: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

export interface ProfileData {
  full_name: string;
  avatar_url?: string;
  bio: string;
  isPremium: boolean;
  location: string;
  phone: string;
  address: string;
  personalInfo: {
    dateOfBirth?: string;
    gender: string;
    nationality: string;
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
  };
  role: string;
  experienceLevel: string;
  field: string;
  goals: string[];
  interests: string[];
  professionalInfo: {
    company: string;
    position: string;
    experienceYears?: number;
    industry: string;
    skills: string[];
    resumeUrl?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number;
    endYear?: number | null;
    grade?: string;
    isCurrentlyEnrolled: boolean;
    educationLevel: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    skills: string[];
    isVerified: boolean;
  }>;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
    size?: number;
    uploadedAt: string;
  }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    portfolio?: string;
  };
  learningPreferences: {
    preferredLearningStyle: string;
    dailyLearningGoal: number;
    weeklyLearningGoal: number;
    targetEnglishLevel: string;
    focusAreas: string[];
  };
  privacySettings: {
    profileVisibility: string;
    activityTracking: Record<string, boolean>;
    communicationPreferences: Record<string, boolean>;
  };
}
