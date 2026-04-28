import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image as ImageIcon, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { roomService } from '@/services/roomService';
import { useToast } from '@/hooks/use-toast';
import { RoomBannerSelector, BANNER_PRESETS, BannerSettings } from './RoomBannerSelector';

// --- Utility Function ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- UI Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg shadow-blue-500/25",
    outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-800",
  };
  const sizes = {
    default: "h-11 px-6 py-2 text-sm",
    lg: "h-14 rounded-2xl px-8 text-base",
    icon: "h-10 w-10",
  };
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none disabled:opacity-50 active:scale-95", variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Sub-Components for Mac Visuals ---
const MacControls = () => (
  <div className="flex gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/10"></div>
    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/10"></div>
    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/10"></div>
  </div>
);

// --- The Modal Component ---
interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateRoomModal({ isOpen, onClose, onSuccess }: CreateRoomModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('B2');
  const [privacy, setPrivacy] = useState('public');
  const [maxUsers, setMaxUsers] = useState<number | string>(4);
  const [banner, setBanner] = useState(BANNER_PRESETS[0].id);
  const [customBannerUrl, setCustomBannerUrl] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerSettings, setBannerSettings] = useState<BannerSettings>({
    text: 'English Practice Room',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    isBold: true,
    isItalic: false,
    fontSize: 24
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setIsSubmitting(true);
      
      let finalBannerStr = banner;


      if (banner === 'custom' && bannerFile) {
        try {
          const uploadedUrl = await roomService.uploadBanner(bannerFile);
          finalBannerStr = uploadedUrl;
        } catch (uploadError) {
          console.error('Failed to upload banner:', uploadError);
          toast({
            title: 'Upload Failed',
            description: 'Could not upload custom banner. Using default.',
            variant: 'destructive'
          });
          finalBannerStr = BANNER_PRESETS[0].id; // fallback
        }
      }


      const newRoom = await roomService.createRoom({
        maxParticipants: parseInt(maxUsers.toString()) || 4,
        isPrivate: privacy === 'private',
        topic: topic,
        description: `Target Level: ${level}`, // Storing the level in description since it's required backend context
        banner: finalBannerStr,
        bannerText: bannerSettings.text,
        bannerFontFamily: bannerSettings.fontFamily,
        bannerIsBold: bannerSettings.isBold,
        bannerIsItalic: bannerSettings.isItalic,
        bannerFontSize: bannerSettings.fontSize
      });

      setIsSuccess(true);
      toast({
        title: 'Room Created!',
        description: 'Your practice room is ready. Joining now...',
      });
      
      // Auto close and navigate after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setTopic('');
        setLevel('B2');
        setPrivacy('public');
        setCustomBannerUrl(null);
        setBannerFile(null);
        setBanner(BANNER_PRESETS[0].id);
        setBannerSettings({
            text: 'English Practice Room',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            isBold: true,
            isItalic: false,
            fontSize: 24
        });
        
        if (onSuccess) onSuccess();
        
        // Navigate to the new room immediately
        const codeSuffix = newRoom.isPrivate && newRoom.roomCode ? `?code=${newRoom.roomCode}` : '';
        navigate(`/practice-room/${newRoom.roomId}${codeSuffix}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Unsupported Image",
          description: "Please use a standard format like JPG, PNG, or WebP. HEIC formats are currently unsupported.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB to preserve performance.",
          variant: "destructive"
        });
        return;
      }

      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBannerUrl(reader.result as string);
        setBanner('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('hidden-banner-upload');
    if (fileInput) fileInput.click();
  };

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container (Mac Interface) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-[#1A1A1A]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-1 ring-white/5"
          >
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Room Created!</h3>
                <p className="text-white/50">Your practice room is live and ready for participants.</p>
              </motion.div>
            ) : (
              <>
                {/* Window Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <MacControls />
                    <h2 className="text-sm font-bold text-white tracking-wide ml-2">Create Practice Room</h2>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Body - Hidden scrollbars for a cleaner UI */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  
                  {/* Banner Selection */}
                  <div className="space-y-2">
                    <RoomBannerSelector 
                      selectedBannerId={banner === 'custom' ? undefined : banner}
                      onSelectBanner={(id) => {
                          setCustomBannerUrl(null);
                          setBannerFile(null);
                          setBanner(id);
                      }}
                      onUploadClick={triggerFileUpload}
                      customImageUrl={customBannerUrl}
                      bannerSettings={bannerSettings}
                      onBannerSettingsChange={setBannerSettings}
                    />
                    <input 
                      id="hidden-banner-upload"
                      type="file" 
                      accept="image/jpeg, image/png, image/webp" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </div>

                  {/* Topic Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Discussion Topic</label>
                    <input 
                      required
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Tech Interviews, Casual Coffee Chat..." 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/20"
                    />
                  </div>

                  {/* Two Column Row: Level & Participants */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Target Level */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Target Level</label>
                      <select 
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {levels.map(l => (
                          <option key={l} value={l} className="bg-slate-900 text-white">
                            {l} {l === 'B2' ? '(Upper Int.)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Max Participants Slider */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Max Users</label>
                      <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                         <input 
                           type="range" 
                           min="2" 
                           max="10" 
                           value={maxUsers}
                           onChange={(e) => setMaxUsers(e.target.value)}
                           className="flex-1 accent-blue-500 cursor-pointer"
                         />
                         <span className="text-white font-bold text-sm w-4 text-center">{maxUsers}</span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Room Privacy</label>
                    <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPrivacy('public')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                          privacy === 'public' ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white/80"
                        )}
                      >
                        <Unlock className="w-4 h-4" /> Public
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrivacy('private')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                          privacy === 'private' ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white/80"
                        )}
                      >
                        <Lock className="w-4 h-4" /> Private
                      </button>
                    </div>
                    <p className="text-[10px] text-white/40 mt-1 pl-1">
                      {privacy === 'public' 
                        ? 'Anyone can discover and join this room.' 
                        : 'Only people with the invite link can join.'}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 mt-2 border-t border-white/5 flex gap-3 shrink-0">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !topic.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Launch Room"}
                    </Button>
                  </div>

                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
