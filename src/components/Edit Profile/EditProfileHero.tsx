import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ImageCropModal from '@/components/Edit Profile/ImageCropModel';
import { ProfilePictureService } from '@/utils/Profile upload/supabase';
import { useAuth } from '@/contexts';

interface EditProfileData {
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar_url: string;
  bio: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  field: string;
  targetLanguage?: string;
  nativeLanguage?: string;
  country?: string;
  proficiencyLevel?: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'proficient';
}

interface EditProfileHeroProps {
  formData: EditProfileData;
  onUpdate: (field: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditProfileHero: React.FC<EditProfileHeroProps> = ({
  formData,
  onUpdate,
  onSave,
  isSaving
}) => {
  const { user } = useAuth();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Auto-generate display name from first and last name
  const updateDisplayName = (firstName: string, lastName: string) => {
    if (firstName || lastName) {
      const displayName = lastName ? `${firstName} ${lastName}` : firstName;
      onUpdate('displayName', displayName);
    }
  };

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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Reset input value
    (event.target as HTMLInputElement).value = '';
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user?.id) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    setUploadingPhoto(true);
    try {
      // Convert blob to File for upload
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });

      console.log('📤 Frontend - Creating file for upload:');
      console.log('📄 File name:', croppedFile.name);
      console.log('📄 File size:', croppedFile.size);
      console.log('📄 File type:', croppedFile.type);
      console.log('📄 File lastModified:', croppedFile.lastModified);
      console.log('📄 File constructor name:', croppedFile.constructor.name);

      // Test FormData construction
      const testFormData = new FormData();
      testFormData.append('avatar', croppedFile);
      console.log('📋 FormData test:');
      for (let [key, value] of testFormData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }

      // Upload using ProfilePictureService with automatic fallback
      const avatarUrl = await ProfilePictureService.uploadProfilePicture(
        user.id,
        croppedFile,
        {
          onProgress: (progress) => {
            console.log(`Upload progress: ${progress}%`);
          },
          onComplete: (url) => {
            console.log('Upload completed:', url);
          },
          onError: (error) => {
            console.error('Upload failed:', error);
          }
        }
      );

      // Update local state with the new URL
      onUpdate('avatar_url', avatarUrl);

      // Close modal and cleanup
      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

      alert('Profile photo updated successfully! The change will be visible across all devices.');
    } catch (error: any) {
      console.error('Error uploading photo:', error);

      // Close modal and cleanup on error too
      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

      alert(`Failed to upload photo: ${error.message}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-800/90 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

      {/* Enhanced Floating Icons */}
      <motion.div
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-emerald-500/40 sm:text-emerald-500/50 dark:text-emerald-400/30 dark:sm:text-emerald-400/40 hidden sm:block"
        animate={{
          y: [-8, 8, -8],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <User className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-teal-500/40 sm:text-teal-500/50 dark:text-teal-400/30 dark:sm:text-teal-400/40 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -3, 3, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Camera className="h-5 w-5 sm:h-7 sm:w-7 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-8 sm:bottom-20 sm:left-12 text-cyan-500/40 sm:text-cyan-500/50 dark:text-cyan-400/30 dark:sm:text-cyan-400/40 hidden sm:block"
        animate={{
          y: [-6, 6, -6],
          x: [-3, 3, -3],
          rotate: [0, 8, -8, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Upload className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-lg" />
      </motion.div>

      <div className="relative p-6 sm:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <User className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Edit Profile Information
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Update your profile details and preferences
            </p>
          </div>
        </motion.div>

        <CardContent className="space-y-6">
          {/* Enhanced Profile Photo Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative w-full"
          >
            <div className="flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-900/40 rounded-2xl border border-emerald-200/40 dark:border-emerald-700/40 backdrop-blur-sm">
              {/* Large Profile Photo Display */}
              <div className="relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                  {formData.avatar_url && formData.avatar_url.startsWith('blob:') ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        console.warn('Blob URL invalid, clearing avatar');
                        (e.target as HTMLImageElement).style.display = 'none';
                        onUpdate('avatar_url', '');
                      }}
                    />
                  ) : formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-24 h-24 sm:w-28 sm:h-28 text-slate-400 dark:text-slate-500" />
                  )}
                </div>

                {/* Upload Button Overlay */}
                <label className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 cursor-pointer flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-white dark:border-slate-800">
                  {uploadingPhoto ? (
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>

                {/* Premium Badge */}
                {/* {formData.isPremium && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2 shadow-lg border-4 border-white dark:border-slate-800">
                    <span className="text-xs font-bold text-white">★</span>
                  </div>
                )} */}
              </div>

              {/* Photo Info */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                  {uploadingPhoto
                    ? 'Uploading your photo...'
                    : 'Upload a professional photo that represents you. Click the camera icon to get started.'
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">Max 5MB</span>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">JPEG, PNG, GIF, WebP</span>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">Square recommended</span>
                </div>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => {
                const newFirstName = e.target.value;
                onUpdate('firstName', newFirstName);
                updateDisplayName(newFirstName, formData.lastName);
              }}
              placeholder="Enter your first name"
              className="bg-white dark:bg-slate-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => {
                const newLastName = e.target.value;
                onUpdate('lastName', newLastName);
                updateDisplayName(formData.firstName, newLastName);
              }}
              placeholder="Enter your last name"
              className="bg-white dark:bg-slate-700"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => onUpdate('username', e.target.value)}
              placeholder="Choose a unique username"
              className="bg-white dark:bg-slate-700"
            />
          </div>

          {/* Display Name (auto-generated) */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => onUpdate('displayName', e.target.value)}
              placeholder="This will be auto-generated from your name"
              className="bg-white dark:bg-slate-700"
              readOnly={formData.firstName || formData.lastName ? true : false}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formData.firstName || formData.lastName
                ? 'Display name is automatically generated from your first and last name'
                : 'Enter your first name above to auto-generate display name'
              }
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => onUpdate('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="bg-white dark:bg-slate-700"
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">English Level</Label>
            <Select value={formData.experienceLevel} onValueChange={(value) => onUpdate('experienceLevel', value)}>
              <SelectTrigger className="bg-white dark:bg-slate-700">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                {experienceOptions.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field of Study/Expertise */}
          <div className="space-y-2">
            <Label htmlFor="field">Field of Study/Expertise</Label>
            <Select value={formData.field} onValueChange={(value) => onUpdate('field', value)}>
              <SelectTrigger className="bg-white dark:bg-slate-700">
                <SelectValue placeholder="Select your field of study or expertise" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(field => (
                  <SelectItem key={field} value={field}>
                    {field.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Basic Information
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>

      {/* Image Cropping Modal */}
      {showCropModal && (
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
      )}
    </motion.div>
  );
};

export default EditProfileHero;
