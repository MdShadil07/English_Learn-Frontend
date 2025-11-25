import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePictureService } from '@/utils/Profile upload/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatarUpload, useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BasicHeader from '@/components/layout/BasicHeader';
import Footer from '../../components/Landing Page Component/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth, User as AuthUser } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';
import { queryKeys } from '@/utils/queryKeys';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  User as UserIcon,
  MapPin,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Link as LinkIcon,
  Save,
  Camera,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  BookOpen,
  Target,
  Globe,
  Building,
  Star,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import ImageCropModal from '../../components/Edit Profile/ImageCropModel';
import {
  EditProfileHero,
  EditPersonalInformation,
  EditEducation,
  EditProfessionalInfo,
  EditCertifications,
  EditSocialLinks,
  EditLearningPreferences,
  EditPrivacySettings
} from '../../components/Edit Profile';

// Types based on backend Profile model
interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear?: number;
  endYear?: number | null;
  grade?: string;
  description?: string;
  isCurrentlyEnrolled: boolean;
  educationLevel: 'high-school' | 'associate-degree' | 'bachelors-degree' | 'masters-degree' | 'phd' | 'certificate' | 'diploma' | 'other';
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: string | Date | null;
  expiryDate?: string | Date | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
  isVerified: boolean;
}

interface Document {
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: string;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  portfolio?: string;
  other?: string;
}

interface EditProfileData {
  // Basic Information
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar_url: string;
  bio: string;
  isPremium: boolean;

  // Contact Information (location only, phone/address moved to personalInfo)
  location: string;

  // Language and Learning Information
  targetLanguage: string;
  nativeLanguage?: string;
  country?: string;
  proficiencyLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'proficient';

  // Personal Information
  personalInfo: {
    dateOfBirth?: string;
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    nationality: string;
    languages: Array<{
      language: string;
      proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }>;
  };

  // Experience Level and Field
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  field: string;

  // Learning Goals and Interests
  goals: string[];
  interests: string[];

  // Professional Information (for professionals, teachers, etc.)
  professionalInfo: {
    company: string;
    position: string;
    experienceYears?: number;
    industry: string;
    skills: string[];
    interests: string[];
    careerGoals: string;
    resumeUrl?: string;
  };

  // Educational Information
  education: Education[];

  // Certifications
  certifications: Certification[];

  // Documents (resumes, portfolios, certificates, etc.)
  documents?: Document[];

  // Social Links
  socialLinks: SocialLinks;

  // Learning Preferences
  learningPreferences: {
    preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing' | 'mixed';
    dailyLearningGoal: number;
    weeklyLearningGoal: number;
    targetEnglishLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native';
    focusAreas: string[];
  };

  // Privacy Settings
  privacySettings: {
    profileVisibility: 'public' | 'friends-only' | 'private';
    showContactInfo: boolean;
    showEducation: boolean;
    showCertifications: boolean;
    showAchievements: boolean;
    // Advanced privacy settings
    activityTracking: {
      trackLearningProgress: boolean;
      trackTimeSpent: boolean;
      trackCourseCompletions: boolean;
      trackQuizResults: boolean;
      trackLoginHistory: boolean;
      trackDeviceInfo: boolean;
      trackLocationData: boolean;
    };
    communicationPreferences: {
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      marketingEmails: boolean;
      weeklyReports: boolean;
      achievementAlerts: boolean;
      reminderNotifications: boolean;
    };
    dataSharing: {
      shareWithPartners: boolean;
      shareAnonymousUsage: boolean;
      shareForResearch: boolean;
      allowPersonalization: boolean;
      thirdPartyIntegrations: boolean;
    };
    dataManagement: {
      autoDeleteInactive: boolean;
      dataRetentionPeriod: number;
      downloadData: boolean;
      deleteAccount: boolean;
    };
    security: {
      twoFactorEnabled: boolean;
      loginAlerts: boolean;
      suspiciousActivityAlerts: boolean;
      sessionTimeout: number;
    };
    emergency: {
      emergencyContact: string;
      emergencyPhone: string;
      emergencyEmail: string;
      allowEmergencyAccess: boolean;
    };
  };
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('basic');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // React Query// Optimized profile data fetching with React Query
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: queryKeys.profile.get(), // Fix queryKeys function call
    queryFn: async () => {
      console.log('🔄 React Query: Fetching profile data...');
      const response = await api.profile.get();
      console.log('📡 React Query: Profile API response:', response);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Use unified mutations for consistent caching and updates
  const avatarUploadMutation = useAvatarUpload();
  const profileUpdateMutation = useProfileUpdate();

  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ formData, documentType }: { formData: FormData; documentType: string }) => {
      const response = await api.profile.uploadDocument(formData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload document');
      }
      return { ...response.data, documentType };
    },
    onSuccess: (data) => {
      // Update the profile cache with new document
      queryClient.setQueryData(queryKeys.profile.get(), (old: any) => {
        let updatedProfile = { ...old };

        if (data.documentType === 'resume') {
          // Update resume URL in professional info
          updatedProfile.professionalInfo = {
            ...updatedProfile.professionalInfo,
            resumeUrl: data.documentUrl
          };
        } else {
          // Add to documents array
          const newDocument = {
            name: data.documentUrl.split('/').pop() || 'document',
            url: data.documentUrl,
            type: data.documentType,
            size: 0,
            uploadedAt: new Date().toISOString()
          };

          const currentDocs = updatedProfile.documents || [];
          updatedProfile.documents = [...currentDocs, newDocument];
        }

        return updatedProfile;
      });

      // Invalidate profile queries to trigger automatic updates
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });

      // Update local state
      setFormData(prev => {
        let updated = { ...prev };

        if (data.documentType === 'resume') {
          updated.professionalInfo = {
            ...updated.professionalInfo,
            resumeUrl: data.documentUrl
          };
        } else {
          const newDocument = {
            name: data.documentUrl.split('/').pop() || 'document',
            url: data.documentUrl,
            type: data.documentType,
            size: 0,
            uploadedAt: new Date().toISOString()
          };

          const currentDocs = updated.documents || [];
          updated.documents = [...currentDocs, newDocument];
        }

        return updated;
      });

      toast({
        title: "Document Uploaded Successfully! ",
        description: `${data.documentType.charAt(0).toUpperCase() + data.documentType.slice(1)} has been uploaded.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async ({ fileType, fileKey }: { fileType: string; fileKey: string }) => {
      const response = await api.profile.deleteFile(fileType, fileKey);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete document');
      }
      return { fileType, fileKey };
    },
    onSuccess: (data) => {
      // Update the profile cache to remove the deleted avatar
      queryClient.setQueryData(queryKeys.profile.get(), (old: any) => {
        let updatedProfile = { ...old };

        if (data.fileType === 'avatar') {
          updatedProfile.user = updatedProfile.user ? { ...updatedProfile.user, avatar: null } : null;
          updatedProfile.profile = updatedProfile.profile ? { ...updatedProfile.profile, avatar_url: null } : null;
          updatedProfile.avatar_url = null; // Keep for backward compatibility
        } else if (data.fileType === 'document') {
          const currentDocs = updatedProfile.documents || [];
          updatedProfile.documents = currentDocs.filter((doc: any) =>
            !doc.url.includes(data.fileKey)
          );

          // Also check if it's a resume URL to remove
          if (updatedProfile.professionalInfo?.resumeUrl?.includes(data.fileKey)) {
            updatedProfile.professionalInfo = {
              ...updatedProfile.professionalInfo,
              resumeUrl: undefined
            };
          }
        }

        return updatedProfile;
      });

      // Invalidate profile queries to trigger automatic updates
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });

      // Update local state
      setFormData(prev => {
        let updated = { ...prev };

        if (data.fileType === 'avatar') {
          updated.avatar_url = '';
        } else if (data.fileType === 'document') {
          const currentDocs = updated.documents || [];
          updated.documents = currentDocs.filter((doc: any) =>
            !doc.url.includes(data.fileKey)
          );

          // Also check if it's a resume URL to remove
          if (updated.professionalInfo?.resumeUrl?.includes(data.fileKey)) {
            updated.professionalInfo = {
              ...updated.professionalInfo,
              resumeUrl: undefined
            };
          }
        }

        return updated;
      });

      toast({
        title: "Document Deleted",
        description: "Document has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  // Optimized profile update mutation with optimistic updates
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // Transform frontend data format to backend format
      const backendData = {
        displayName: data.displayName,
        avatar_url: data.avatar_url,
        bio: data.bio,
        isPremium: data.isPremium,
        location: data.location,
        targetLanguage: data.targetLanguage,
        nativeLanguage: data.nativeLanguage,
        country: data.country,
        proficiencyLevel: data.proficiencyLevel,
        personalInfo: {
          ...data.personalInfo,
          phone: data.personalInfo.phone,
          address: data.personalInfo.address,
          dateOfBirth: data.personalInfo.dateOfBirth
            ? new Date(data.personalInfo.dateOfBirth)
            : undefined
        },
        experienceLevel: data.experienceLevel,
        field: data.field,
        goals: data.goals,
        interests: data.interests,
        professionalInfo: data.professionalInfo,
        education: data.education
          .filter((edu: any) => edu.institution.trim() && edu.educationLevel)
          .map((edu: any) => ({
            // Only include education-specific fields
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startYear: edu.startYear,
            endYear: edu.isCurrentlyEnrolled ? null : edu.endYear,
            grade: edu.grade,
            description: edu.description,
            isCurrentlyEnrolled: edu.isCurrentlyEnrolled,
            educationLevel: edu.educationLevel
          })),
        certifications: data.certifications.map((cert: any) => ({
          ...cert,
          issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null
        })),
        socialLinks: data.socialLinks,
        learningPreferences: data.learningPreferences,
        privacySettings: data.privacySettings
      };

      console.log('🔄 Frontend: Sending profile update data:', JSON.stringify(backendData, null, 2));
      const response = await api.profile.update(backendData);
      console.log('✅ Frontend: Profile update response:', response);

      // Also update user data if firstName, lastName, or username changed
      if (data.firstName !== undefined || data.lastName !== undefined || data.username !== undefined) {
        const userUpdateData: any = {};
        if (data.firstName !== undefined) userUpdateData.firstName = data.firstName;
        if (data.lastName !== undefined) userUpdateData.lastName = data.lastName;
        if (data.username !== undefined) userUpdateData.username = data.username;

        if (Object.keys(userUpdateData).length > 0) {
          const userResponse = await api.user.update(userUpdateData);
          if (!userResponse.success) {
            throw new Error(userResponse.message || 'Failed to update user information');
          }
        }
      }

      return response.data;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.get() });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(queryKeys.profile.get());

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.profile.get(), (old: any) => {
        if (!old) return old;

        const updated = { ...old };

        // Update user data optimistically
        if (updated.user) {
          if (newData.firstName !== undefined) updated.user.firstName = newData.firstName;
          if (newData.lastName !== undefined) updated.user.lastName = newData.lastName;
          if (newData.username !== undefined) updated.user.username = newData.username;
          if (newData.firstName !== undefined || newData.lastName !== undefined) {
            updated.user.fullName = newData.firstName && newData.lastName
              ? `${newData.firstName} ${newData.lastName}`
              : newData.firstName || newData.lastName || updated.user.fullName;
          }
        }

        // Update profile data optimistically
        if (updated.profile) {
          if (newData.displayName !== undefined) updated.profile.displayName = newData.displayName;
          if (newData.username !== undefined) updated.profile.username = newData.username;
        }

        return updated;
      });

      return { previousProfile };
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile information has been saved.",
      });

      // Update form data with server response
      if (data.user) {
        setFormData(prev => ({
          ...prev,
          firstName: data.user.firstName || prev.firstName,
          lastName: data.user.lastName || prev.lastName,
          username: data.user.username || prev.username,
          displayName: data.profile?.displayName || prev.displayName,
        }));
      }

      // Invalidate profile queries to trigger automatic updates across all components
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });

      // Update AuthContext and localStorage with fresh avatar data
      if (data.user) {
        const updatedUserData = {
          ...user,
          avatar: data.user.avatar || data.user.avatar_url || data.profile?.avatar_url,
          fullName: data.user.fullName || data.user.displayName || data.profile?.displayName || user?.fullName,
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        // Trigger AuthContext update
        window.dispatchEvent(new CustomEvent('authUpdate', { detail: updatedUserData }));
      }
    },
    onError: (error: Error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.profile.get(), context.previousProfile);
      }

      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleDocumentUpload = useCallback(async (formData: FormData, documentType: string) => {
    uploadDocumentMutation.mutate({ formData, documentType });
  }, [uploadDocumentMutation]);

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setUploadingPhoto(true);
    try {
      // Convert blob to File for upload
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', croppedFile);

      // Upload using mutation
      await avatarUploadMutation.mutateAsync({ formData });

      // Close modal and cleanup
      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

    } catch (error: any) {
      console.error('Error uploading avatar:', error);

      // Close modal and cleanup on error too
      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar to cloud storage",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteDocument = useCallback(async (documentUrl: string) => {
    const urlParts = documentUrl.split('/');
    const fileKey = urlParts[urlParts.length - 1];
    const fileType = profileData?.documents?.find(doc => doc.url === documentUrl)?.type || 'document';

    deleteDocumentMutation.mutate({ fileType, fileKey });
  }, [deleteDocumentMutation, profileData]);

  // Form data update handlers
  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateNestedFormData = useCallback((section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<EditProfileData>({
    // Basic Information
    displayName: '',
    firstName: '',
    lastName: '',
    username: '',
    avatar_url: '',
    bio: '',
    isPremium: false,

    // Contact Information (location only)
    location: '',

    // Language and Learning Information
    targetLanguage: 'English',
    nativeLanguage: '',
    country: '',
    proficiencyLevel: 'beginner',

    // Personal Information
    personalInfo: {
      dateOfBirth: '',
      gender: 'prefer-not-to-say',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
      nationality: '',
      languages: []
    },

    // Experience Level and Field
    experienceLevel: 'beginner',
    field: '',

    // Learning Goals and Interests
    goals: [],
    interests: [],

    // Professional Information (for professionals, teachers, etc.)
    professionalInfo: {
      company: '',
      position: '',
      experienceYears: 0,
      industry: '',
      skills: [],
      interests: [],
      careerGoals: '',
      resumeUrl: ''
    },

    // Educational Information
    education: [],

    // Certifications
    certifications: [],

    // Documents (resumes, portfolios, certificates, etc.)
    documents: [],

    // Social Links
    socialLinks: {},

    // Learning Preferences
    learningPreferences: {
      preferredLearningStyle: 'visual',
      dailyLearningGoal: 30,
      weeklyLearningGoal: 210,
      targetEnglishLevel: 'intermediate',
      focusAreas: []
    },

    // Privacy Settings
    privacySettings: {
      profileVisibility: 'public',
      showContactInfo: true,
      showEducation: true,
      showCertifications: true,
      showAchievements: true,
      // Advanced privacy settings
      activityTracking: {
        trackLearningProgress: true,
        trackTimeSpent: true,
        trackCourseCompletions: true,
        trackQuizResults: true,
        trackLoginHistory: true,
        trackDeviceInfo: false,
        trackLocationData: false,
      },
      communicationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        weeklyReports: true,
        achievementAlerts: true,
        reminderNotifications: true,
      },
      dataSharing: {
        shareWithPartners: false,
        shareAnonymousUsage: true,
        shareForResearch: false,
        allowPersonalization: true,
        thirdPartyIntegrations: false,
      },
      dataManagement: {
        autoDeleteInactive: false,
        dataRetentionPeriod: 365,
        downloadData: true,
        deleteAccount: false,
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true,
        suspiciousActivityAlerts: true,
        sessionTimeout: 30,
      },
      emergency: {
        emergencyContact: '',
        emergencyPhone: '',
        emergencyEmail: '',
        allowEmergencyAccess: false,
      },
    }
  });

  useEffect(() => {
    return () => {
      if (currentAvatarUrl && currentAvatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentAvatarUrl);
      }
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [currentAvatarUrl, selectedImage]);

  // Populate form data when profile data is loaded
  useEffect(() => {
    console.log('🔄 Profile data effect triggered:', { profileData, isProfileLoading });
    if (profileData && !isProfileLoading) {
      console.log('📊 Profile data received:', profileData);
      // Handle backend response format (user and profile objects)
      const userData = profileData.user || profileData;
      const profileInfo = profileData.profile || profileData;

      // Transform backend data to frontend format and populate form
      setFormData({
        displayName: userData.fullName || userData.full_name || profileInfo.displayName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        avatar_url: userData.avatar || userData.avatar_url || profileInfo.avatar_url || '',
        bio: userData.bio || profileInfo.bio || '',
        isPremium: userData.isPremium || profileInfo.isPremium || false,
        location: userData.location || profileInfo.location || '',
        targetLanguage: profileInfo.targetLanguage || userData.targetLanguage || 'English',
        nativeLanguage: profileInfo.nativeLanguage || userData.nativeLanguage || '',
        country: profileInfo.country || userData.country || '',
        proficiencyLevel: profileInfo.proficiencyLevel || userData.proficiencyLevel || 'beginner',
        personalInfo: {
          nationality: profileInfo.personalInfo?.nationality || '',
          dateOfBirth: profileInfo.personalInfo?.dateOfBirth
            ? (profileInfo.personalInfo.dateOfBirth instanceof Date
                ? profileInfo.personalInfo.dateOfBirth.toISOString().split('T')[0]
                : profileInfo.personalInfo.dateOfBirth)
            : '',
          gender: profileInfo.personalInfo?.gender || 'prefer-not-to-say',
          languages: profileInfo.personalInfo?.languages || [],
          phone: profileInfo.personalInfo?.phone || profileInfo.phone || userData.phone || '', // Handle both formats
          address: profileInfo.personalInfo?.address || (() => {
            // Handle migration from old format (root level address string) to new format (nested object)
            if (profileInfo.address && typeof profileInfo.address === 'string') {
              // Try to parse address string or create default object
              return {
                street: profileInfo.address,
                city: '',
                state: '',
                country: '',
                zipCode: '',
              };
            }
            if (profileInfo.address && typeof profileInfo.address === 'object') {
              return profileInfo.address;
            }
            return {
              street: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
            };
          })(),
        },
        experienceLevel: profileInfo.experienceLevel || 'beginner',
        field: profileInfo.field && profileInfo.field !== 'student' ? profileInfo.field : '',
        goals: profileInfo.goals || [],
        interests: profileInfo.interests || [],
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
          // Ensure endYear is properly handled for currently enrolled
          endYear: edu.isCurrentlyEnrolled ? null : (edu.endYear || undefined),
          // Convert dates back to strings for form inputs
          issueDate: edu.issueDate ? new Date(edu.issueDate).toISOString().split('T')[0] : '',
          expiryDate: edu.expiryDate ? new Date(edu.expiryDate).toISOString().split('T')[0] : ''
        })),
        certifications: (profileInfo.certifications || []).map((cert: any) => ({
          ...cert,
          issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : ''
        })),
        documents: profileInfo.documents || [],
        socialLinks: profileInfo.socialLinks || {},
        learningPreferences: {
          preferredLearningStyle: profileInfo.learningPreferences?.preferredLearningStyle || 'mixed',
          dailyLearningGoal: profileInfo.learningPreferences?.dailyLearningGoal || 30,
          weeklyLearningGoal: profileInfo.learningPreferences?.weeklyLearningGoal || 210,
          targetEnglishLevel: profileInfo.learningPreferences?.targetEnglishLevel || 'intermediate',
          focusAreas: profileInfo.learningPreferences?.focusAreas || []
        },
        privacySettings: profileInfo.privacySettings || {
          profileVisibility: 'public',
          showContactInfo: true,
          showEducation: true,
          showCertifications: true,
          showAchievements: true,
          activityTracking: {
            trackLearningProgress: true,
            trackTimeSpent: true,
            trackCourseCompletions: true,
            trackQuizResults: true,
            trackLoginHistory: true,
            trackDeviceInfo: false,
            trackLocationData: false,
          },
          communicationPreferences: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            marketingEmails: false,
            weeklyReports: true,
            achievementAlerts: true,
            reminderNotifications: true,
          },
          dataSharing: {
            shareWithPartners: false,
            shareAnonymousUsage: true,
            shareForResearch: false,
            allowPersonalization: true,
            thirdPartyIntegrations: false,
          },
          dataManagement: {
            autoDeleteInactive: false,
            dataRetentionPeriod: 365,
            downloadData: true,
            deleteAccount: false,
          },
          security: {
            twoFactorEnabled: false,
            loginAlerts: true,
            suspiciousActivityAlerts: true,
            sessionTimeout: 30,
          },
          emergency: {
            emergencyContact: '',
            emergencyPhone: '',
            emergencyEmail: '',
            allowEmergencyAccess: false,
          },
        }
      });

      // Set current avatar URL for blob URL management
      if (userData.avatar || userData.avatar_url || profileInfo.avatar_url) {
        const avatarUrl = userData.avatar || userData.avatar_url || profileInfo.avatar_url;
        if (avatarUrl.startsWith('blob:')) {
          setCurrentAvatarUrl(avatarUrl);
        } else {
          setCurrentAvatarUrl(avatarUrl);
        }
      } else {
        setCurrentAvatarUrl('/default-avatar.jpg');
      }
      console.log('✅ Form data populated successfully');
    }
  }, [profileData, isProfileLoading]);

  // Real-time subscription is disabled due to Supabase connectivity issues
  // Profile updates will be handled through manual refresh
  useEffect(() => {
    console.log('ℹ️ Real-time subscription disabled - using manual refresh');
  }, [user?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateProfileMutation.mutate(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      educationLevel: 'bachelors-degree',
      isCurrentlyEnrolled: false,
      startYear: undefined,
      endYear: undefined,
      grade: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
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
            // When currently enrolled is checked, clear end year
            return { ...edu, [field]: value, ...(value && { endYear: null }) };
          } else if (field === 'endYear') {
            // When setting end year, only allow if not currently enrolled
            return edu.isCurrentlyEnrolled ? edu : { ...edu, [field]: value };
          }
          return { ...edu, [field]: value };
        }
        return edu;
      })
    }));
  };

  const addCertification = () => {
    const newCertification: Certification = {
      name: '',
      issuer: '',
      issueDate: '',
      skills: [],
      isVerified: false
    };
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
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

  const toggleArrayField = (field: 'goals' | 'interests' | 'focusAreas' | 'skills', value: string) => {
    setFormData(prev => {
      if (field === 'focusAreas') {
        // focusAreas is nested in learningPreferences
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
      } else {
        // goals, interests, skills are at top level
        const currentArray = prev[field] || [];
        return {
          ...prev,
          [field]: currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value]
        };
      }
    });
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.some(l => l.language === language)
          ? prev.personalInfo.languages.filter(l => l.language !== language)
          : [...prev.personalInfo.languages, { language, proficiency: 'intermediate' }]
      }
    }));
  };

  const updateLanguageProficiency = (language: string, proficiency: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.map(l =>
          l.language === language ? { ...l, proficiency: proficiency as any } : l
        )
      }
    }));
  };

  // Role-based field visibility
  const isProfessional = ['professional', 'teacher', 'professor', 'researcher', 'software-engineer', 'data-scientist', 'writer', 'entrepreneur', 'freelancer'].includes(user?.role || 'student');
  const isStudent = ['student', 'high-school-student', 'college-student', 'graduate-student'].includes(user?.role || 'student');

  // Predefined options
  const roleOptions = [
    'student', 'high-school-student', 'college-student', 'graduate-student',
    'professional', 'teacher', 'professor', 'researcher', 'software-engineer',
    'data-scientist', 'writer', 'entrepreneur', 'freelancer', 'admin',
    'computer-science', 'business', 'medicine', 'engineering', 'law',
    'education', 'arts', 'science', 'mathematics', 'literature',
    'psychology', 'economics', 'finance', 'marketing', 'design',
    'technology', 'healthcare', 'research', 'consulting', 'other'
  ];

  const experienceOptions = ['beginner', 'intermediate', 'advanced'];
  const genderOptions = ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'];
  const proficiencyOptions = ['beginner', 'intermediate', 'advanced', 'native'];
  const educationLevelOptions = ['high-school', 'associate-degree', 'bachelors-degree', 'masters-degree', 'phd', 'certificate', 'diploma', 'other'];
  const learningStyleOptions = ['visual', 'auditory', 'kinesthetic', 'reading-writing', 'mixed'];
  const targetLevelOptions = ['beginner', 'intermediate', 'advanced', 'expert', 'native'];
  const focusAreaOptions = ['speaking', 'listening', 'reading', 'writing', 'grammar', 'vocabulary', 'pronunciation', 'business-english', 'academic-english'];
  const goalOptions = [
    'improve-speaking-skills', 'enhance-vocabulary', 'master-grammar',
    'prepare-for-exams', 'business-english', 'travel-communication',
    'academic-writing', 'pronunciation-improvement', 'reading-comprehension', 'writing-skills'
  ];
  const interestOptions = [
    'technology', 'business', 'science', 'literature', 'travel',
    'movies', 'music', 'sports', 'cooking', 'art', 'politics',
    'history', 'medicine', 'law', 'finance', 'education'
  ];
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];
  const industryOptions = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Marketing',
    'Sales', 'Engineering', 'Legal', 'Creative', 'Research', 'Other'
  ];

  const sections = [
    { id: 'basic', title: 'Basic Information', icon: UserIcon },
    { id: 'personal', title: 'Personal Details', icon: Calendar },
    { id: 'education', title: 'Education', icon: GraduationCap },
    ...(isProfessional ? [{ id: 'professional', title: 'Professional Info', icon: Briefcase }] : []),
    { id: 'certifications', title: 'Certifications', icon: Award },
    { id: 'social', title: 'Social Links', icon: LinkIcon },
    { id: 'preferences', title: 'Learning Preferences', icon: Target },
    { id: 'privacy', title: 'Privacy Settings', icon: Settings }
  ];

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    console.error('❌ Profile loading error:', profileError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load profile data</p>
          <Button onClick={() => refetchProfile()}>Retry</Button>
        </div>
      </div>
    );
  }

  console.log('🏗️ EditProfile component rendering with formData:', {
    displayName: formData.displayName,
    targetLanguage: formData.targetLanguage,
    nativeLanguage: formData.nativeLanguage,
    country: formData.country,
    proficiencyLevel: formData.proficiencyLevel,
    isProfileLoading,
    profileData: !!profileData
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'user@example.com',
          ...(user || {}),
          fullName: formData.displayName || user?.fullName || user?.firstName || user?.email?.split('@')[0] || 'User',
          avatar: user?.avatar, // Use avatar field from AuthContext
          isPremium: formData.isPremium || false,
          role: (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student') as 'student' | 'teacher' | 'admin',
        }}
        onLogout={() => {
          console.log('Logout clicked');
        }}
        showSidebarToggle={false}
        sidebarOpen={false}
        title="CognitoSpeak"
        subtitle="AI Learning Platform"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Profile Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeSection === 'basic' && (
                <EditProfileHero
                  formData={{
                    displayName: formData.displayName,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    avatar_url: formData.avatar_url,
                    bio: formData.bio,
                    experienceLevel: formData.experienceLevel,
                    field: formData.field,
                    targetLanguage: formData.targetLanguage,
                    nativeLanguage: formData.nativeLanguage,
                    country: formData.country,
                    proficiencyLevel: formData.proficiencyLevel,
                  }}
                  onUpdate={updateFormData}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'personal' && (
                <EditPersonalInformation
                  personalInfo={formData.personalInfo}
                  location={formData.location}
                  goals={formData.goals}
                  interests={formData.interests}
                  onUpdatePersonal={(field, value) => updateNestedFormData('personalInfo', field, value)}
                  onUpdate={updateFormData}
                  onToggleArray={toggleArrayField}
                  onToggleLanguage={toggleLanguage}
                  onUpdateLanguageProficiency={updateLanguageProficiency}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'education' && (
                <EditEducation
                  education={formData.education}
                  onAddEducation={addEducation}
                  onRemoveEducation={removeEducation}
                  onUpdateEducation={updateEducation}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'professional' && isProfessional && (
                <EditProfessionalInfo
                  professionalInfo={formData.professionalInfo}
                  onUpdate={(field, value) => updateNestedFormData('professionalInfo', field, value)}
                  onToggleArray={(field, value) => {
                    const currentArray = formData.professionalInfo[field] || [];
                    const updatedArray = currentArray.includes(value)
                      ? currentArray.filter(item => item !== value)
                      : [...currentArray, value];
                    updateNestedFormData('professionalInfo', field, updatedArray);
                  }}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'certifications' && (
                <EditCertifications
                  certifications={formData.certifications}
                  onAddCertification={addCertification}
                  onRemoveCertification={removeCertification}
                  onUpdateCertification={updateCertification}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'social' && (
                <EditSocialLinks
                  socialLinks={formData.socialLinks}
                  onUpdate={(field, value) => updateNestedFormData('socialLinks', field, value)}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'preferences' && (
                <EditLearningPreferences
                  learningPreferences={formData.learningPreferences}
                  onUpdate={(field, value) => updateNestedFormData('learningPreferences', field, value)}
                  onToggleArray={toggleArrayField}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}

              {activeSection === 'privacy' && (
                <EditPrivacySettings
                  privacySettings={formData.privacySettings}
                  onUpdate={(field, value) => updateNestedFormData('privacySettings', field, value)}
                  onUpdateNested={(section, field, value) => {
                    setFormData(prev => {
                      const currentSection = prev.privacySettings[section as keyof typeof prev.privacySettings];
                      if (currentSection && typeof currentSection === 'object') {
                        return {
                          ...prev,
                          privacySettings: {
                            ...prev.privacySettings,
                            [section]: {
                              ...currentSection,
                              [field]: value
                            }
                          }
                        };
                      }
                      return prev;
                    });
                  }}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                View Profile
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          if (selectedImage && selectedImage.startsWith('blob:')) {
            URL.revokeObjectURL(selectedImage);
          }
          setSelectedImage('');
        }}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
    </div>
  );
};

export default EditProfile;
