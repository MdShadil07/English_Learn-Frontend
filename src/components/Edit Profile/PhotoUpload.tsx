// @ts-nocheck
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, User } from "lucide-react";
import { api } from "@/utils/api";
import ImageCropModal from "@/components/ui/ImageCropModal";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string) => void;
}

const ProfilePhotoUpload = ({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert blob to File for upload
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });

      // Upload to server endpoint (secure server-side upload)
      const response = await api.profile.uploadProfileImage(token, croppedFile);

      if (!response.success) {
        throw new Error(response.error || 'Upload failed');
      }

      // Update with server response URL
      onPhotoUpdate(response.data.url);

      toast({
        title: "Profile Updated ✨",
        description: "Your profile picture has been cropped and updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Create preview URL for cropping
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowCropModal(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <Button
        size="icon"
        variant="secondary"
        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </Button>

      {/* Image Cropping Modal */}
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

export default ProfilePhotoUpload;
