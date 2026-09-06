import React, { useState } from 'react';
import { Camera, User, Save, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ImageCropModal from '@/components/settings/ImageCropModel';
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
  onAvatarUpdate?: () => void;
}

const EditProfileHero: React.FC<EditProfileHeroProps> = ({
  formData,
  onUpdate,
  onSave,
  isSaving,
  onAvatarUpdate
}) => {
  const { user } = useAuth();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

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

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    (event.target as HTMLInputElement).value = '';
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user?.id) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });

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

      onUpdate('avatar_url', avatarUrl);
      onAvatarUpdate?.();

      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

    } catch (error: any) {
      console.error('Error uploading photo:', error);
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
    <div className="space-y-8 pb-8">
      
      {/* Profile Photo Section (GitHub Style) */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-3xl bg-emerald-500/10 flex items-center justify-center overflow-hidden border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            {formData.avatar_url && formData.avatar_url.startsWith('blob:') ? (
              <img
                src={formData.avatar_url}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  onUpdate('avatar_url', '');
                }}
              />
            ) : formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-emerald-500/50" />
            )}
          </div>

          <label className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm z-10 mx-auto">
            {uploadingPhoto ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <span className="text-xs text-slate-900 dark:text-white font-medium flex items-center gap-1">
                <Camera className="w-3 h-3" /> Edit
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploadingPhoto}
            />
          </label>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Profile picture</h3>
          <p className="text-[10px] text-slate-400 max-w-sm">
            Upload a picture that represents you. We support JPEG, PNG, GIF or WebP. Max size is 5MB.
          </p>
          <div className="pt-2">
            <label className="text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-300 transition-all cursor-pointer inline-flex items-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              Upload new picture
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </label>
          </div>
        </div>
      </div>

      <Separator className="bg-emerald-500/10" />

      {/* Form Fields */}
      <div className="space-y-5 max-w-2xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">First name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => {
                const newFirstName = e.target.value;
                onUpdate('firstName', newFirstName);
                updateDisplayName(newFirstName, formData.lastName);
              }}
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Last name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => {
                const newLastName = e.target.value;
                onUpdate('lastName', newLastName);
                updateDisplayName(formData.firstName, newLastName);
              }}
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Public display name</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => onUpdate('displayName', e.target.value)}
            className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
            readOnly={!!(formData.firstName || formData.lastName)}
          />
          <p className="text-[10px] text-slate-500 font-medium">
            {formData.firstName || formData.lastName
              ? 'Your display name is automatically generated from your first and last name.'
              : 'Enter your first name above to auto-generate.'
            }
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => onUpdate('username', e.target.value)}
            className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onUpdate('bio', e.target.value)}
            placeholder="Tell us a little bit about yourself"
            rows={4}
            className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl resize-y"
          />
          <p className="text-[10px] text-slate-500 font-medium">You can @mention other users and organizations to link to them.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="experienceLevel" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">English level</Label>
            <Select value={formData.experienceLevel} onValueChange={(value) => onUpdate('experienceLevel', value)}>
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white">
                {experienceOptions.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field" className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Field of expertise</Label>
            <Select value={formData.field} onValueChange={(value) => onUpdate('field', value)}>
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white max-h-60">
                {roleOptions.map(field => (
                  <SelectItem key={field} value={field}>
                    {field.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
          >
            {isSaving ? 'Updating...' : 'Save Profile'}
          </Button>
        </div>
      </div>

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
    </div>
  );
};

export default EditProfileHero;
