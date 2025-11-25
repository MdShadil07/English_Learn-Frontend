import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X } from 'lucide-react';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (file: File) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ currentPhotoUrl, onPhotoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        onPhotoUpdate(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Camera className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Profile Photo</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Update your profile picture</p>
        </div>
      </div>

      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl text-slate-400">👤</span>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <Button
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            onClick={() => document.getElementById('photo-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
          JPG, PNG or GIF. Max size 2MB.
        </p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
