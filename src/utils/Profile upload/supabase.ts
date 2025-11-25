import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

if (!supabaseUrl || !supabaseKey || !supabaseProjectId) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with optimized configuration for high concurrency
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 1000 // High event throughput for real-time updates
    },
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000)
  },
  global: {
    headers: {
      'x-client-info': 'english-practice-app',
      'x-client-version': '1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
});

// Profile picture upload utility with concurrency handling
export class ProfilePictureService {
  private static readonly BUCKET_NAME = 'profile-pictures';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  private static readonly MAX_CONCURRENT_UPLOADS = 3;

  // Active upload tracking for concurrency control
  private static activeUploads = new Map<string, AbortController>();
  private static uploadQueue: Array<{
    userId: string;
    file: File;
    onProgress?: (progress: number) => void;
    onComplete: (url: string) => void;
    onError: (error: Error) => void;
  }> = [];
  private static isProcessingQueue = false;

  /**
   * Upload profile picture with Supabase storage
   * Handles concurrency, real-time updates, and optimized performance
   * Falls back to backend upload if Supabase is not available
   */
  static async uploadProfilePicture(
    userId: string,
    file: File,
    options: {
      onProgress?: (progress: number) => void;
      onComplete?: (url: string) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const run = async () => {
        // Check if Supabase is available first
        const isSupabaseAvailable = await this.checkSupabaseAvailability();

        if (!isSupabaseAvailable) {
          console.warn('⚠️ Supabase not available, falling back to backend upload');
          const backendUrl = await this.fallbackToBackendUpload(userId, file, options);
          resolve(backendUrl);
          return;
        }

        // Validate input
        if (!this.validateFile(file)) {
          const error = new Error('Invalid file: must be an image under 5MB');
          options.onError?.(error);
          reject(error);
          return;
        }

        // Check if user already has an active upload
        if (this.activeUploads.has(userId)) {
          const error = new Error('Another upload is in progress for this user');
          options.onError?.(error);
          reject(error);
          return;
        }

        // Add to upload queue
        this.uploadQueue.push({
          userId,
          file,
          onProgress: options.onProgress,
          onComplete: (url: string) => {
            options.onComplete?.(url);
            resolve(url);
          },
          onError: (error: Error) => {
            options.onError?.(error);
            reject(error);
          }
        });

        // Process queue if not already processing
        if (!this.isProcessingQueue) {
          this.processUploadQueue();
        }
      };
      run();
    });
  }

  /**
   * Check if Supabase is available and properly configured
   */
  private static async checkSupabaseAvailability(): Promise<boolean> {
    try {
      // Test basic connectivity and check if bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

      if (bucketsError) {
        console.warn('⚠️ Supabase storage not configured or bucket not found:', bucketsError.message);
        return false;
      }

      // Check if our required bucket exists
      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        console.warn(`⚠️ Required bucket '${this.BUCKET_NAME}' not found. Available buckets:`, buckets?.map(b => b.name));
        console.warn(`💡 Please create the '${this.BUCKET_NAME}' bucket in your Supabase dashboard`);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('⚠️ Supabase availability check failed:', error);
      return false;
    }
  }

  /**
   * Fallback to backend upload when Supabase is not available
   */
  private static async fallbackToBackendUpload(
    userId: string,
    file: File,
    options: {
      onProgress?: (progress: number) => void;
      onComplete?: (url: string) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('avatar', file);

      console.log('📤 Preparing FormData upload:');
      console.log('📄 File name:', file.name);
      console.log('📄 File size:', file.size);
      console.log('📄 File type:', file.type);
      console.log('📋 FormData has avatar field:', formData.has('avatar'));
      console.log('📋 FormData entries:', Array.from(formData.entries()));

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options.onProgress(progress);
        }
      };

      xhr.onload = async () => {
        try {
          console.log('📡 Backend response status:', xhr.status);
          console.log('📡 Backend response headers:', xhr.getAllResponseHeaders());
          console.log('📡 Backend response:', xhr.responseText);

          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (response.success && response.data?.avatarUrl) {
              options.onComplete?.(response.data.avatarUrl);
              resolve(response.data.avatarUrl);
            } else {
              throw new Error(response.message || 'Upload failed');
            }
          } else {
            // Handle authentication errors specifically
            if (xhr.status === 401) {
              console.error('🔐 Authentication failed - user may not be logged in');
              throw new Error('Authentication required. Please log in again.');
            }
            throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
          }
        } catch (error) {
          options.onError?.(error as Error);
          reject(error);
        }
      };

      xhr.onerror = () => {
        console.error('🌐 Network error during backend upload');
        const error = new Error('Network error during upload');
        options.onError?.(error);
        reject(error);
      };

      xhr.onabort = () => {
        console.log('📤 Upload aborted');
      };

      // Use the optimized backend endpoint for fallback
      const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/profile/avatar-optimized`;
      const accessToken = localStorage.getItem('accessToken');

      console.log('🔑 Backend upload - Token available:', !!accessToken);
      console.log('🌐 Backend URL:', backendUrl);
      console.log('📤 FormData contents:', formData.get('avatar') ? 'File present' : 'No file');

      // Log FormData details
      for (const [key, value] of formData.entries()) {
        console.log(`📋 FormData ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }

      xhr.open('POST', backendUrl);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

      // Don't set Content-Type for FormData - let browser set it automatically
      xhr.send(formData);
    });
  }

  /**
   * Process upload queue with concurrency control
   */
  private static async processUploadQueue() {
    if (this.isProcessingQueue || this.uploadQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.uploadQueue.length > 0) {
      // Get next uploads up to max concurrent limit
      const batchSize = Math.min(this.MAX_CONCURRENT_UPLOADS - this.activeUploads.size, this.uploadQueue.length);
      const batch = this.uploadQueue.splice(0, batchSize);

      // Process batch concurrently
      const uploadPromises = batch.map(async (upload) => {
        const abortController = new AbortController();
        this.activeUploads.set(upload.userId, abortController);

        try {
          const url = await this.performUpload(upload.userId, upload.file, upload.onProgress);
          upload.onComplete(url);
        } catch (error) {
          upload.onError(error as Error);
        } finally {
          this.activeUploads.delete(upload.userId);
          if (abortController.signal.aborted) {
            console.log(`Upload cancelled for user ${upload.userId}`);
          }
        }
      });

      // Wait for current batch to complete before processing next
      await Promise.allSettled(uploadPromises);

      // Small delay to prevent overwhelming the system
      if (this.uploadQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Perform the actual upload to Supabase
   */
  private static async performUpload(
    userId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Generate unique filename with timestamp for cache busting
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}/profile-${timestamp}.${fileExtension}`;

    // Delete old profile picture if exists (cleanup)
    await this.deleteOldProfilePicture(userId);

    // Upload with progress tracking
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600', // Cache for 1 hour
        upsert: true, // Replace if same filename exists
        contentType: file.type,
        // Add metadata for tracking
        metadata: {
          userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          size: file.size.toString()
        }
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    // Trigger real-time update
    await this.notifyProfileUpdate(userId, publicUrl);

    return publicUrl;
  }

  /**
   * Delete old profile picture when uploading new one
   */
  private static async deleteOldProfilePicture(userId: string) {
    try {
      // Check if Supabase is available before attempting cleanup
      const isAvailable = await this.checkSupabaseAvailability();
      if (!isAvailable) {
        console.log('ℹ️ Skipping old profile picture cleanup - Supabase not available');
        return;
      }

      // List files for this user
      const { data: files } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (files && files.length > 0) {
        // Delete all profile pictures for this user (keep only the latest)
        const filesToDelete = files
          .filter(file => file.name.startsWith('profile-'))
          .map(file => `${userId}/${file.name}`);

        if (filesToDelete.length > 0) {
          await supabase.storage
            .from(this.BUCKET_NAME)
            .remove(filesToDelete);
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup old profile pictures:', error);
      // Don't fail the upload if cleanup fails
    }
  }

  /**
   * Notify other clients of profile picture update via real-time
   */
  private static async notifyProfileUpdate(userId: string, avatarUrl: string) {
    try {
      // Check if Supabase is available before sending notifications
      const isAvailable = await this.checkSupabaseAvailability();
      if (!isAvailable) {
        console.log('ℹ️ Skipping real-time notification - Supabase not available');
        return;
      }

      // Use Supabase real-time to notify other clients
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      // Also send a real-time broadcast
      supabase
        .channel(`profile-${userId}`)
        .send({
          type: 'broadcast',
          event: 'profile_picture_updated',
          payload: {
            userId,
            avatarUrl,
            timestamp: Date.now()
          }
        });
    } catch (error) {
      console.warn('Failed to send real-time notification:', error);
      // Don't fail the upload if notification fails
    }
  }

  /**
   * Subscribe to profile picture updates for a user
   */
  static subscribeToProfileUpdates(
    userId: string,
    callback: (payload: { userId: string; avatarUrl: string; timestamp: number }) => void
  ): RealtimeChannel {
    // For now, return a dummy channel since real-time subscriptions are not reliable
    // The system will fall back to manual refresh when needed
    console.log('ℹ️ Real-time subscription disabled - using manual refresh fallback');

    // Return a dummy object cast to RealtimeChannel to satisfy the type checker
    return {
      unsubscribe: () => {
        console.log('ℹ️ Dummy unsubscribe called - real-time disabled');
      },
      subscribe: () => {
        console.log('ℹ️ Dummy subscribe called - real-time disabled');
      },
      send: () => {
        console.log('ℹ️ Dummy send called - real-time disabled');
      },
      track: () => {
        console.log('ℹ️ Dummy track called - real-time disabled');
      },
      untrack: () => {
        console.log('ℹ️ Dummy untrack called - real-time disabled');
      },
      topic: '',
      params: {},
      socket: {},
      bindings: [],
      joinRef: '',
      timeout: 0,
      joinedOnce: false,
      state: '',
      pushBuffer: [],
      rejoinTimer: {},
      joinPush: {},
      on: () => {},
      off: () => {},
      push: () => {},
      rejoin: () => {},
      leave: () => {},
      isJoined: () => false,
      isLeaving: () => false,
      isClosed: () => false,
      onError: () => {},
      onClose: () => {},
      trigger: () => {},
      // Add missing properties to satisfy RealtimeChannel type
      presence: {},
      broadcastEndpointURL: '',
      subTopic: '',
      private: false,
      joinPayload: {},
      events: [],
      bindingsMap: {},
      joinTimeout: 0
    } as unknown as RealtimeChannel;
  }

  /**
   * Get current profile picture URL for a user
   */
  static async getProfilePictureUrl(userId: string): Promise<string | null> {
    try {
      // Check if Supabase is available before attempting to get URL
      const isAvailable = await this.checkSupabaseAvailability();
      if (!isAvailable) {
        console.log('ℹ️ Cannot get profile picture URL - Supabase not available');
        return null;
      }

      // List files for this user
      const { data: files } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (files && files.length > 0) {
        // Get the most recent profile picture
        const profileFiles = files
          .filter(file => file.name.startsWith('profile-'))
          .sort((a, b) => b.created_at.localeCompare(a.created_at));

        if (profileFiles.length > 0) {
          const { data: { publicUrl } } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(`${userId}/${profileFiles[0].name}`);

          return publicUrl;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get profile picture URL:', error);
      return null;
    }
  }

  /**
   * Delete profile picture for a user
   */
  static async deleteProfilePicture(userId: string): Promise<boolean> {
    try {
      // Check if Supabase is available before attempting deletion
      const isAvailable = await this.checkSupabaseAvailability();
      if (!isAvailable) {
        console.log('ℹ️ Cannot delete profile picture - Supabase not available');
        return false;
      }

      // List and delete all profile pictures for this user
      const { data: files } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (files && files.length > 0) {
        const filesToDelete = files
          .filter(file => file.name.startsWith('profile-'))
          .map(file => `${userId}/${file.name}`);

        if (filesToDelete.length > 0) {
          const { error } = await supabase.storage
            .from(this.BUCKET_NAME)
            .remove(filesToDelete);

          if (error) {
            throw error;
          }
        }
      }

      // Notify of deletion
      await this.notifyProfileUpdate(userId, '');

      return true;
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      return false;
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File): boolean {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return false;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return false;
    }

    return true;
  }

  /**
   * Cancel ongoing upload for a user
   */
  static cancelUpload(userId: string) {
    const controller = this.activeUploads.get(userId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(userId);
    }

    // Remove from queue
    this.uploadQueue = this.uploadQueue.filter(upload => upload.userId !== userId);
  }

  /**
   * Get upload progress for a user
   */
  static getUploadProgress(userId: string): number {
    // For now, return 0 or 100 based on whether upload is active
    // In a real implementation, you'd track actual progress
    return this.activeUploads.has(userId) ? 50 : 0;
  }
}

export default supabase;
