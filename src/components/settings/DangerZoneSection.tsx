import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { AlertTriangle, Download, Trash2, Loader2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export const DangerZoneSection: React.FC = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const res = await authService.exportUserData(token);
      if (res.success && res.data) {
        // Create a blob and trigger download
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_data_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Data Export Complete",
          description: "Your data archive has been successfully downloaded.",
        });
      } else {
        toast({
          title: "Export Failed",
          description: res.message || "Could not export your data at this time.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An unexpected error occurred while downloading your data.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const res = await authService.deleteAccount(
        token, 
        deletePassword, 
        twoFactorCode || undefined, 
        challengeId || undefined
      );

      if (res.code === 'TWO_FACTOR_REQUIRED' && res.data?.challengeId) {
        setChallengeId(res.data.challengeId);
        setIsDeleting(false);
        return; // Wait for user to input 2FA code
      }

      if (res.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been securely deactivated.",
        });
        setIsDeleteDialogOpen(false);
        // Delay slightly for toast, then trigger full app logout
        setTimeout(() => {
          signOut();
          window.location.href = '/login';
        }, 1500);
      } else {
        toast({
          title: "Deletion Failed",
          description: res.message || "Failed to delete account. Check your password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-red-500/5 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm transition-all mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
      
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <Label className="text-[11px] font-black uppercase tracking-widest text-red-700 dark:text-red-400 block mb-1">
            Danger Zone
          </Label>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm">
            Irreversible actions regarding your personal data and account existence.
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t border-red-100 dark:border-red-900/30 pt-5">
        {/* Data Download */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <Label className="text-xs font-bold text-slate-900 dark:text-slate-200 block">Download My Data</Label>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs">
              Export a complete JSON archive of your profile, learning history, and security logs.
            </p>
          </div>
          <Button 
            onClick={handleDownloadData}
            disabled={isDownloading}
            variant="outline"
            size="sm"
            className="mt-3 sm:mt-0 font-bold"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export JSON
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <div>
            <Label className="text-xs font-bold text-red-700 dark:text-red-400 block">Delete Account</Label>
            <p className="text-[10px] text-red-600/80 dark:text-red-400/80 mt-1 max-w-xs">
              Permanently disable your account. All data will be marked for secure deletion.
            </p>
          </div>
          <Button 
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
            size="sm"
            className="mt-3 sm:mt-0 font-bold bg-red-600 hover:bg-red-700 dark:bg-red-600/80 dark:hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="pt-2">
              This action cannot be undone. This will permanently delete your account and remove your data from our active servers.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleDeleteAccount} className="space-y-4 py-4 border-t border-slate-100 dark:border-slate-800 mt-2">
            {!challengeId && user?.hasPassword !== false && (
              <div className="space-y-2">
                <Label htmlFor="password">To verify it's you, please enter your password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            )}
            
            {!challengeId && user?.hasPassword === false && (
              <div className="space-y-2 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg border border-amber-200 dark:border-amber-500/30">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  Please confirm you want to delete your account. Since you use Google SSO, you do not need to enter a password.
                </p>
              </div>
            )}

            {challengeId && (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-emerald-600 dark:text-emerald-500">Two-Factor Verification Required</Label>
                <p className="text-xs text-slate-500 pb-2">Enter the 6-digit code from your authenticator or email.</p>
                <Input
                  id="code"
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center tracking-[0.5em] font-mono text-lg"
                  maxLength={6}
                  required
                />
              </div>
            )}
            
            <DialogFooter className="sm:justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setChallengeId(null);
                  setTwoFactorCode('');
                  setDeletePassword('');
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={
                  isDeleting || 
                  (!challengeId && user?.hasPassword !== false && !deletePassword) || 
                  (!!challengeId && twoFactorCode.length < 6)
                }
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {challengeId ? 'Verify & Delete' : 'Delete Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
