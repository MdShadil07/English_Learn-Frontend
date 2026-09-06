import React, { useState, useEffect } from 'react';
import { EditProfessionalInfo, EditEducation, EditCertifications } from '@/components/settings';
import { useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

interface ProfessionalTabProps {
  profileData: any;
}

const ProfessionalTab: React.FC<ProfessionalTabProps> = ({ profileData }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileUpdateMutation = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    professionalInfo: {
      company: '',
      position: '',
      experienceYears: 0,
      industry: '',
      skills: [] as string[],
      interests: [] as string[],
      careerGoals: '',
      resumeUrl: ''
    },
    education: [] as any[],
    certifications: [] as any[]
  });

  const isProfessional = ['professional', 'teacher', 'professor', 'researcher', 'software-engineer', 'data-scientist', 'writer', 'entrepreneur', 'freelancer'].includes(user?.role || 'student');

  useEffect(() => {
    if (profileData) {
      const profileInfo = profileData.profile || profileData;
      
      setFormData({
        professionalInfo: {
          company: profileInfo.professionalInfo?.company || '',
          position: profileInfo.professionalInfo?.position || '',
          experienceYears: profileInfo.professionalInfo?.experienceYears || 0,
          industry: profileInfo.professionalInfo?.industry || '',
          skills: profileInfo.professionalInfo?.skills || [],
          interests: profileInfo.professionalInfo?.interests || [],
          careerGoals: profileInfo.professionalInfo?.careerGoals || '',
          resumeUrl: profileInfo.professionalInfo?.resumeUrl || ''
        },
        education: (profileInfo.education || []).map((edu: any) => ({
          ...edu,
          endYear: edu.isCurrentlyEnrolled ? null : (edu.endYear || undefined),
          issueDate: edu.issueDate ? new Date(edu.issueDate).toISOString().split('T')[0] : '',
          expiryDate: edu.expiryDate ? new Date(edu.expiryDate).toISOString().split('T')[0] : ''
        })),
        certifications: (profileInfo.certifications || []).map((cert: any) => ({
          ...cert,
          issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : ''
        })),
      });
    }
  }, [profileData]);

  // Handlers for Professional Info
  const handleUpdateProfessional = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: value
      }
    }));
  };

  const handleToggleProfessionalArray = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev.professionalInfo[field as keyof typeof prev.professionalInfo] as string[] || [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          [field]: updatedArray
        }
      };
    });
  };

  // Handlers for Education
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        educationLevel: 'bachelors-degree',
        isCurrentlyEnrolled: false,
        startYear: undefined,
        endYear: undefined,
        grade: '',
        description: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => {
        if (i === index) {
          if (field === 'isCurrentlyEnrolled') {
            return { ...edu, [field]: value, ...(value && { endYear: null }) };
          } else if (field === 'endYear') {
            return edu.isCurrentlyEnrolled ? edu : { ...edu, [field]: value };
          }
          return { ...edu, [field]: value };
        }
        return edu;
      })
    }));
  };

  // Handlers for Certifications
  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        issueDate: '',
        skills: [],
        isVerified: false
      }]
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      )
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
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Professional & Education</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your educational background and professional experience.</p>
      </div>

      {isProfessional && (
        <div className="space-y-4">
          <EditProfessionalInfo
            professionalInfo={formData.professionalInfo}
            onUpdate={handleUpdateProfessional}
            onToggleArray={handleToggleProfessionalArray}
            onSave={handleSave}
            isSaving={profileUpdateMutation.isPending}
          />
        </div>
      )}

      {isProfessional && <Separator className="my-8 bg-emerald-500/10" />}

      <div className="space-y-4">
        <EditEducation
          education={formData.education}
          onAddEducation={addEducation}
          onRemoveEducation={removeEducation}
          onUpdateEducation={updateEducation}
          onSave={handleSave}
          isSaving={profileUpdateMutation.isPending}
        />
      </div>

      <Separator className="my-8 bg-emerald-500/10" />

      <div className="space-y-4">
        <EditCertifications
          certifications={formData.certifications}
          onAddCertification={addCertification}
          onRemoveCertification={removeCertification}
          onUpdateCertification={updateCertification}
          onSave={handleSave}
          isSaving={profileUpdateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ProfessionalTab;
