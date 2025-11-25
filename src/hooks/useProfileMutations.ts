import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { queryKeys } from '@/utils/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarUploadData {
  formData: FormData;
}

export const useAvatarUpload = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: AvatarUploadData) => {
      const response = await api.profile.uploadAvatar(data.formData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload avatar');
      }
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Avatar uploaded successfully:', data);

      // Invalidate all profile-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
      queryClient.invalidateQueries({ queryKey: queryKeys.global.currentUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });

      // Update AuthContext immediately
      if (data.user?.avatar || data.user?.avatar_url || data.profile?.avatar_url) {
        const avatarUrl = data.user?.avatar || data.user?.avatar_url || data.profile?.avatar_url;
        updateUser({ avatar: avatarUrl });

        // Trigger global update event
        window.dispatchEvent(new CustomEvent('authUpdate', {
          detail: {
            ...(queryClient.getQueryData(queryKeys.global.currentUser()) as any || {}),
            avatar: avatarUrl
          }
        }));
      }

      toast({
        title: 'Avatar Updated!',
        description: 'Your profile picture has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      console.error('❌ Avatar upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.profile.update(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Profile updated successfully:', data);

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
      queryClient.invalidateQueries({ queryKey: queryKeys.global.currentUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });

      // Update AuthContext
      if (data.user) {
        updateUser({
          fullName: data.user.fullName || data.user.displayName || data.profile?.displayName,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          username: data.user.username,
          avatar: data.user.avatar || data.user.avatar_url || data.profile?.avatar_url,
        });

        // Trigger global update
        window.dispatchEvent(new CustomEvent('authUpdate', {
          detail: {
            ...(queryClient.getQueryData(queryKeys.global.currentUser()) as any || {}),
            ...data.user,
            fullName: data.user.fullName || data.user.displayName || data.profile?.displayName,
            avatar: data.user.avatar || data.user.avatar_url || data.profile?.avatar_url,
          }
        }));
      }

      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      console.error('❌ Profile update failed:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
