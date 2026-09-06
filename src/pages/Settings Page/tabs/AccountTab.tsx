import React, { useState, useEffect } from 'react';
import { EditPersonalInformation } from '@/components/settings';
import { useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';

interface AccountTabProps {
  profileData: any;
}

const AccountTab: React.FC<AccountTabProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const profileUpdateMutation = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    location: '',
    goals: [] as string[],
    interests: [] as string[],
    personalInfo: {
      nationality: '',
      dateOfBirth: '',
      gender: 'prefer-not-to-say',
      languages: [] as any[],
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      }
    }
  });

  useEffect(() => {
    if (profileData) {
      const userData = profileData.user || profileData;
      const profileInfo = profileData.profile || profileData;
      
      setFormData({
        location: userData.location || profileInfo.location || '',
        goals: profileInfo.goals || [],
        interests: profileInfo.interests || [],
        personalInfo: {
          nationality: profileInfo.personalInfo?.nationality || '',
          dateOfBirth: profileInfo.personalInfo?.dateOfBirth
            ? (profileInfo.personalInfo.dateOfBirth instanceof Date
                ? profileInfo.personalInfo.dateOfBirth.toISOString().split('T')[0]
                : profileInfo.personalInfo.dateOfBirth)
            : '',
          gender: profileInfo.personalInfo?.gender || 'prefer-not-to-say',
          languages: profileInfo.personalInfo?.languages || [],
          phone: profileInfo.personalInfo?.phone || profileInfo.phone || userData.phone || '',
          address: profileInfo.personalInfo?.address || {
            street: typeof profileInfo.address === 'string' ? profileInfo.address : '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          }
        }
      });
    }
  }, [profileData]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdatePersonal = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleToggleArray = (field: 'goals' | 'interests', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleToggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.some((l: any) => l.language === language)
          ? prev.personalInfo.languages.filter((l: any) => l.language !== language)
          : [...prev.personalInfo.languages, { language, proficiency: 'intermediate' }]
      }
    }));
  };

  const handleUpdateLanguageProficiency = (language: string, proficiency: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.map((l: any) =>
          l.language === language ? { ...l, proficiency } : l
        )
      }
    }));
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
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Account Details</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your personal information, location, and communication details.</p>
      </div>
      <div className="pt-2">
        <EditPersonalInformation
          personalInfo={formData.personalInfo}
          location={formData.location}
          goals={formData.goals}
          interests={formData.interests}
          onUpdatePersonal={handleUpdatePersonal}
          onUpdate={handleUpdate}
          onToggleArray={handleToggleArray}
          onToggleLanguage={handleToggleLanguage}
          onUpdateLanguageProficiency={handleUpdateLanguageProficiency}
          onSave={handleSave}
          isSaving={profileUpdateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AccountTab;
