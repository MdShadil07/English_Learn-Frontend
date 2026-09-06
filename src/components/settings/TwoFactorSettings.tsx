import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Key, Copy, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

interface TwoFactorSettingsProps {
  isTwoFactorEnabled: boolean;
  onUpdateNested: (section: string, field: string, value: any) => void;
}

export const TwoFactorSettings: React.FC<TwoFactorSettingsProps> = ({ isTwoFactorEnabled, onUpdateNested }) => {
  const { user, refreshUser } = useAuth();
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isBackupCodesModalOpen, setIsBackupCodesModalOpen] = useState(false);
  const [step, setStep] = useState<'init' | 'verify'>('init');
  const [challengeId, setChallengeId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      // User wants to enable 2FA
      setIsSetupModalOpen(true);
      setStep('init');
      setError('');
    } else {
      // User wants to disable 2FA
      onUpdateNested('security', 'twoFactorEnabled', false);
    }
  };

  const handleSetupInit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.auth.setupTwoFactor();
      if (response.success && response.data?.challengeId) {
        setChallengeId(response.data.challengeId);
        setStep('verify');
      } else {
        setError(response.message || 'Failed to initiate 2FA setup');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate 2FA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.auth.enableTwoFactor({
        challengeId,
        code: verificationCode
      });
      if (response.success && response.data?.backupCodes) {
        setBackupCodes(response.data.backupCodes);
        setIsSetupModalOpen(false);
        setIsBackupCodesModalOpen(true);
        // Refresh the user so the context knows 2FA is enabled
        await refreshUser();
        onUpdateNested('security', 'twoFactorEnabled', true);
      } else {
        setError(response.message || 'Failed to verify code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const content = `CognitoSpeak Backup Codes\n\nGenerated on: ${new Date().toLocaleDateString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognitospeak-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseBackupCodes = () => {
    setIsBackupCodesModalOpen(false);
    setBackupCodes([]);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isTwoFactorEnabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300 block mb-1">Two-Factor Authentication (2FA)</Label>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 max-w-md">
                Add an extra layer of security to your account. We'll send a code to your email when you sign in from a new device.
              </p>
            </div>
          </div>
          <Switch
            checked={isTwoFactorEnabled}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>

      {/* Setup Modal */}
      <Dialog open={isSetupModalOpen} onOpenChange={setIsSetupModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              {step === 'init' 
                ? 'Protect your account from unauthorized access.'
                : 'Enter the verification code sent to your email.'}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {step === 'init' ? (
            <div className="py-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                When 2FA is enabled, you'll need to enter a security code sent to <strong>{user?.email}</strong> whenever you sign in from a new or unrecognized device.
              </p>
              <Button 
                className="w-full" 
                onClick={handleSetupInit} 
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleVerifyAndEnable} 
                disabled={isLoading || verificationCode.length < 6}
              >
                {isLoading ? 'Verifying...' : 'Verify and Enable'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Backup Codes Modal */}
      <Dialog open={isBackupCodesModalOpen} onOpenChange={(open) => !open && handleCloseBackupCodes()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-xl">2FA Enabled Successfully!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Please save these backup codes. If you lose access to your email, these codes are your <strong>only</strong> way to access your account.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 my-4 font-mono text-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-slate-400 select-none">{index + 1}.</span>
                  <span className="font-semibold tracking-wider text-slate-700 dark:text-slate-200">{code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyCodes}>
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Codes'}
            </Button>
            <Button variant="default" className="flex-1 gap-2" onClick={handleDownloadCodes}>
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          <DialogFooter className="mt-6 sm:justify-center">
            <Button variant="ghost" onClick={handleCloseBackupCodes} className="w-full">
              I have saved my backup codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
