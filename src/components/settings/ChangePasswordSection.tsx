import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { KeyRound, ShieldCheck, Loader2 } from 'lucide-react';

export const ChangePasswordSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isOAuthOnly = user?.googleAuth?.isLinked && user?.hasPassword === false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation must match exactly.",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your new password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error("Authentication required");

      const res = await authService.changePassword(accessToken, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (res.success) {
        // Save the new tokens if the backend provided them so the user doesn't get logged out
        if (res.data?.tokens) {
          localStorage.setItem('accessToken', res.data.tokens.accessToken);
          localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        }
        
        toast({
          title: "Password Changed",
          description: "Your password has been successfully updated.",
        });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast({
          title: "Update Failed",
          description: res.message || "Failed to change password",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isOAuthOnly) {
    return (
      <div className="flex flex-col p-5 bg-white dark:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-md mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 block mb-1">
              Password Settings
            </Label>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              You are logging in exclusively with Google SSO. You don't have a password set.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
        <div className="flex items-start gap-4 mb-4 sm:mb-0">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 block mb-1">
              Change Password
            </Label>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm">
              Update your password regularly to keep your account secure.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 pt-5 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
        <div className="grid gap-2 max-w-md">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Current Password
          </Label>
          <Input 
            type="password" 
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="bg-white border-slate-200 dark:bg-slate-900/50 dark:border-emerald-500/20 text-slate-900 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
              New Password
            </Label>
            <Input 
              type="password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="bg-white border-slate-200 dark:bg-slate-900/50 dark:border-emerald-500/20 text-slate-900 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
              Confirm New Password
            </Label>
            <Input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-white border-slate-200 dark:bg-slate-900/50 dark:border-emerald-500/20 text-slate-900 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isUpdating || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:border dark:border-emerald-500/30 dark:hover:bg-emerald-500/30 shadow-sm"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};
