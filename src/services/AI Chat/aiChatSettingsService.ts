import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

export interface ResponseLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export interface AiChatSettings {
  _id?: string;
  userId?: string;
  responseLanguage: string;
  useNativeLanguageForTranslations: boolean;
  autoDetectLanguage: boolean;
  alwaysShowEnglish: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EffectiveLanguage {
  responseLanguage: string;
  translationLanguage: string | null;
  showEnglish: boolean;
}

/**
 * AI Chat Settings Service
 * Manages user's AI chat language preferences
 */
class AiChatSettingsService {
  private baseUrl = '/ai-chat/settings';

  /**
   * Get user's current AI chat settings
   */
  async getSettings(): Promise<AiChatSettings> {
    try {
      const response = await axios.get<{ success: boolean; data: AiChatSettings }>(
        `${API_BASE_URL}${this.baseUrl}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching AI chat settings:', error);
      // Return defaults if fetch fails
      return {
        responseLanguage: 'english',
        useNativeLanguageForTranslations: true,
        autoDetectLanguage: false,
        alwaysShowEnglish: true
      };
    }
  }

  /**
   * Update response language
   */
  async updateLanguage(language: string): Promise<AiChatSettings> {
    try {
      const response = await axios.put<{ success: boolean; data: AiChatSettings; message: string }>(
        `${API_BASE_URL}${this.baseUrl}/language`,
        { language },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error updating language:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update language');
    }
  }

  /**
   * Update all settings
   */
  async updateSettings(settings: Partial<AiChatSettings>): Promise<AiChatSettings> {
    try {
      const response = await axios.put<{ success: boolean; data: AiChatSettings }>(
        `${API_BASE_URL}${this.baseUrl}`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error updating settings:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update settings');
    }
  }

  /**
   * Get effective language settings
   */
  async getEffectiveLanguage(): Promise<EffectiveLanguage> {
    try {
      const response = await axios.get<{ success: boolean; data: EffectiveLanguage }>(
        `${API_BASE_URL}${this.baseUrl}/effective-language`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching effective language:', error);
      return {
        responseLanguage: 'english',
        translationLanguage: null,
        showEnglish: true
      };
    }
  }

  /**
   * Reset settings to default
   */
  async resetSettings(): Promise<AiChatSettings> {
    try {
      const response = await axios.post<{ success: boolean; data: AiChatSettings }>(
        `${API_BASE_URL}${this.baseUrl}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error resetting settings:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to reset settings');
    }
  }

  /**
   * Get available languages (public endpoint - no auth required)
   */
  async getAvailableLanguages(): Promise<ResponseLanguage[]> {
    try {
      const response = await axios.get<{ success: boolean; data: ResponseLanguage[] }>(
        `${API_BASE_URL}${this.baseUrl}/languages`
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching available languages:', error);
      // Return default languages if fetch fails
      return [
        { code: 'english', name: 'English', nativeName: 'English' },
        { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'spanish', name: 'Spanish', nativeName: 'Español' }
      ];
    }
  }

  /**
   * Map backend language codes to frontend codes
   */
  mapToFrontendCode(backendCode: string): string {
    const mapping: Record<string, string> = {
      'english': 'en',
      'hindi': 'hi',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'chinese': 'zh',
      'japanese': 'ja',
      'korean': 'ko',
      'arabic': 'ar',
      'portuguese': 'pt',
      'russian': 'ru',
      'italian': 'it',
      'dutch': 'nl',
      'turkish': 'tr',
      'polish': 'pl',
      'vietnamese': 'vi',
      'thai': 'th',
      'indonesian': 'id',
      'bengali': 'bn',
      'urdu': 'ur'
    };
    return mapping[backendCode] || 'en';
  }

  /**
   * Map frontend language codes to backend codes
   */
  mapToBackendCode(frontendCode: string): string {
    const mapping: Record<string, string> = {
      'en': 'english',
      'hi': 'hindi',
      'es': 'spanish',
      'fr': 'french',
      'de': 'german',
      'zh': 'chinese',
      'ja': 'japanese',
      'ko': 'korean',
      'ar': 'arabic',
      'pt': 'portuguese',
      'ru': 'russian',
      'it': 'italian',
      'nl': 'dutch',
      'tr': 'turkish',
      'pl': 'polish',
      'vi': 'vietnamese',
      'th': 'thai',
      'id': 'indonesian',
      'bn': 'bengali',
      'ur': 'urdu'
    };
    return mapping[frontendCode] || 'english';
  }
}

export default new AiChatSettingsService();
