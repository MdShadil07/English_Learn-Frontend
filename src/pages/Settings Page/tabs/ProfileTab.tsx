import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { EditProfileHero } from '@/components/settings';
import { useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';

interface ProfileTabProps {
  profileData: any;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const profileUpdateMutation = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    displayName: '',
    firstName: '',
    lastName: '',
    username: '',
    avatar_url: '',
    bio: '',
    experienceLevel: 'beginner',
    field: '',
    targetLanguage: 'English',
    nativeLanguage: '',
    country: '',
    proficiencyLevel: 'beginner',
  });

  useEffect(() => {
    if (profileData) {
      const userData = profileData.user || profileData;
      const profileInfo = profileData.profile || profileData;
      
      setFormData({
        displayName: userData.fullName || profileInfo.displayName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        avatar_url: userData.avatar || profileInfo.avatar_url || '',
        bio: userData.bio || profileInfo.bio || '',
        experienceLevel: profileInfo.experienceLevel || 'beginner',
        field: profileInfo.field || '',
        targetLanguage: profileInfo.targetLanguage || userData.targetLanguage || 'English',
        nativeLanguage: profileInfo.nativeLanguage || userData.nativeLanguage || '',
        country: profileInfo.country || userData.country || '',
        proficiencyLevel: profileInfo.proficiencyLevel || userData.proficiencyLevel || 'beginner',
      });
    }
  }, [profileData]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    profileUpdateMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Public Profile</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage how you appear to others on CognitoSpeak.</p>
      </div>
      <div className="pt-2">
        <EditProfileHero
          formData={formData}
          onUpdate={handleUpdate}
          onSave={handleSave}
          isSaving={profileUpdateMutation.isPending}
          onAvatarUpdate={() => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
            queryClient.invalidateQueries({ queryKey: queryKeys.global.currentUser() });
          }}
        />
      </div>
    </div>
  );
};

export default ProfileTab;
