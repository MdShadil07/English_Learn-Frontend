import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  AlertTriangle, 
  UserMinus, 
  ShieldAlert, 
  Info,
  PhoneOff,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type WarningType = 'locked' | 'kicked' | 'blocked' | 'exit' | 'error' | 'info';

interface RoomWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: WarningType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryAction?: () => void;
}

const RoomWarningModal: React.FC<RoomWarningModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  description,
  actionLabel = 'Understand',
  onAction,
  secondaryActionLabel,
  secondaryAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'locked': return <Lock className="w-8 h-8 text-amber-500" />;
      case 'kicked': return <UserMinus className="w-8 h-8 text-red-500" />;
      case 'blocked': return <ShieldAlert className="w-8 h-8 text-red-600" />;
      case 'exit': return <LogOut className="w-8 h-8 text-emerald-500" />;
      case 'error': return <PhoneOff className="w-8 h-8 text-red-500" />;
      default: return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'locked': return 'from-amber-500';
      case 'kicked':
      case 'blocked':
      case 'error': return 'from-red-500';
      case 'exit': return 'from-emerald-500';
      default: return 'from-blue-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] bg-slate-950/95 backdrop-blur-2xl border border-white/10 p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden outline-none">
        {/* Dynamic Accent Glow */}
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r via-current to-transparent opacity-50", getAccentColor())} />
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 blur-3xl -z-10 opacity-20", getAccentColor().replace('from-', 'bg-'))} />
        
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto mb-6 shadow-inner relative group">
           <div className={cn("absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl", getAccentColor().replace('from-', 'bg-'))} />
           {getIcon()}
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm leading-relaxed text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className={cn("mt-8 flex flex-col gap-3", secondaryActionLabel && "sm:flex-row")}>
          {secondaryActionLabel && (
            <Button 
              variant="outline"
              onClick={secondaryAction || onClose}
              className="flex-1 py-6 rounded-2xl border-white/5 bg-white/5 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              {secondaryActionLabel}
            </Button>
          )}
          <Button 
            onClick={onAction || onClose}
            className={cn(
               "flex-1 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg",
               type === 'exit' ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-white text-slate-950 hover:bg-emerald-400 hover:text-slate-950 shadow-white/5"
            )}
          >
            {actionLabel}
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-2 opacity-40">
           <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Security Verified</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomWarningModal;
