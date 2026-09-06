import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Globe, ShieldAlert, LogOut, Clock, Loader2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  device?: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrentSession: boolean;
}

export const ActiveSessionsSection = () => {
  const queryClient = useQueryClient();
  const [revokeSessionId, setRevokeSessionId] = useState<string | null>(null);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [challengeId, setChallengeId] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return [];
      const res = await authService.getActiveSessions(token);
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async ({ sessionId, code, challenge }: { sessionId: string; code?: string; challenge?: string }) => {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Not authenticated');
      return authService.revokeSession(token, sessionId, code, challenge);
    },
    onSuccess: (res, variables) => {
      if (res.code === 'TWO_FACTOR_REQUIRED' && res.data?.challengeId) {
        setChallengeId(res.data.challengeId);
        setRevokeSessionId(variables.sessionId);
        setIs2FADialogOpen(true);
        return;
      }
      
      if (res.success) {
        toast({ title: 'Session revoked successfully' });
        queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
        setIs2FADialogOpen(false);
        setTwoFactorCode('');
        setRevokeSessionId(null);
      } else {
        toast({ title: 'Failed to revoke session', description: res.message, variant: 'destructive' });
      }
    },
    onError: (error: any) => {
      toast({ title: 'Failed to revoke session', description: error.message || 'Unknown error', variant: 'destructive' });
    }
  });

  const handleRevoke = (sessionId: string) => {
    revokeMutation.mutate({ sessionId });
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeSessionId || !twoFactorCode || !challengeId) return;
    revokeMutation.mutate({ 
      sessionId: revokeSessionId, 
      code: twoFactorCode,
      challenge: challengeId
    });
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  const parseUserAgent = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('edg')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';

    if (ua.includes('win')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return `${browser} on ${os}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-500/10 pb-3">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Logged In Devices
        </h3>
        <ShieldAlert className="w-4 h-4 text-emerald-500/50" />
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Review all devices that are currently logged into your account. If you recognize an unfamiliar device, log out immediately.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg border-slate-200 dark:border-slate-800 text-slate-500">
          No active sessions found.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                session.isCurrentSession 
                  ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-emerald-500/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${session.isCurrentSession ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {getDeviceIcon(session.userAgent)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {session.device || parseUserAgent(session.userAgent)}
                    </span>
                    {session.isCurrentSession && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        Current Device
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      {session.location && session.location !== 'Unknown Location' 
                        ? session.location 
                        : session.ipAddress === '127.0.0.1' || session.ipAddress === '::1' 
                          ? 'Local Network' 
                          : session.ipAddress}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Active {formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrentSession && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRevoke(session.id)}
                  disabled={revokeMutation.isPending && revokeSessionId === session.id}
                  className="w-full md:w-auto text-red-600 dark:text-red-400 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                >
                  {revokeMutation.isPending && revokeSessionId === session.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-2" />
                  )}
                  Log Out
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={is2FADialogOpen} onOpenChange={(open) => !revokeMutation.isPending && setIs2FADialogOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
              Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Please enter the 6-digit code from your authenticator app or email to revoke this session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handle2FASubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Authentication Code</Label>
              <Input
                id="code"
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center tracking-widest text-lg font-mono"
                maxLength={6}
                required
              />
            </div>
            {revokeMutation.isError && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>Incorrect code. Please try again.</span>
              </div>
            )}
            <DialogFooter className="sm:justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIs2FADialogOpen(false)}
                disabled={revokeMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={twoFactorCode.length < 6 || revokeMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {revokeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Verify & Revoke
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
