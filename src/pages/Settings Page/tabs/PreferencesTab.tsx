import React, { useState, useEffect } from 'react';
import { EditLearningPreferences } from '@/components/settings';
import { useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';

interface PreferencesTabProps {
  profileData: any;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const profileUpdateMutation = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    learningPreferences: {
      preferredLearningStyle: 'mixed',
      dailyLearningGoal: 30,
      weeklyLearningGoal: 210,
      targetEnglishLevel: 'intermediate',
      focusAreas: [] as string[]
    }
  });

  useEffect(() => {
    if (profileData) {
      const profileInfo = profileData.profile || profileData;
      
      setFormData({
        learningPreferences: {
          preferredLearningStyle: profileInfo.learningPreferences?.preferredLearningStyle || 'mixed',
          dailyLearningGoal: profileInfo.learningPreferences?.dailyLearningGoal || 30,
          weeklyLearningGoal: profileInfo.learningPreferences?.weeklyLearningGoal || 210,
          targetEnglishLevel: profileInfo.learningPreferences?.targetEnglishLevel || 'intermediate',
          focusAreas: profileInfo.learningPreferences?.focusAreas || []
        }
      });
    }
  }, [profileData]);

  const handleUpdatePreferences = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      learningPreferences: {
        ...prev.learningPreferences,
        [field]: value
      }
    }));
  };

  const handleToggleFocusArea = (field: string, value: string) => {
    // Only 'focusAreas' comes here based on EditLearningPreferences usage
    if (field === 'focusAreas') {
      setFormData(prev => {
        const currentFocusAreas = prev.learningPreferences.focusAreas || [];
        const updatedFocusAreas = currentFocusAreas.includes(value)
          ? currentFocusAreas.filter(item => item !== value)
          : [...currentFocusAreas, value];

        return {
          ...prev,
          learningPreferences: {
            ...prev.learningPreferences,
            focusAreas: updatedFocusAreas
          }
        };
      });
    }
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
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Learning Preferences</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Customize your language learning goals and study habits.</p>
      </div>
      <div className="pt-2">
        <EditLearningPreferences
          learningPreferences={formData.learningPreferences}
          onUpdate={handleUpdatePreferences}
          onToggleArray={handleToggleFocusArea}
          onSave={handleSave}
          isSaving={profileUpdateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default PreferencesTab;
