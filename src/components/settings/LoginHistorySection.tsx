import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { History, Monitor, Smartphone, Chrome, Globe, Loader2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LoginHistoryItem {
  _id: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  method: string;
  location?: string;
}

export const LoginHistorySection: React.FC = () => {
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        
        const res = await authService.getLoginHistory(token);
        if (res.success && res.data) {
          setHistory(res.data);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return <Smartphone className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const getBrowserIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return <Chrome className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const formatBrowserName = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Google Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edge')) return 'Microsoft Edge';
    return 'Web Browser';
  };

  const formatOS = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac os')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    return 'Unknown OS';
  };

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-emerald-500/5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-md mb-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-full bg-slate-100 text-slate-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <History className="w-6 h-6" />
        </div>
        <div>
          <Label className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 block mb-1">
            Login History
          </Label>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm">
            Review your recent login activity across all devices and browsers.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-6 text-sm text-slate-500">
          No login history found.
        </div>
      ) : (
        <div className="space-y-3">
          {history.slice(0, 5).map((session) => (
            <div key={session._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {getDeviceIcon(session.userAgent)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {formatOS(session.userAgent)}
                    </p>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider px-1.5 h-4 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      {session.method === 'google_sso' ? 'Google SSO' : 'Email'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      {getBrowserIcon(session.userAgent)}
                      {formatBrowserName(session.userAgent)}
                    </span>
                    {session.location && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </span>
                      </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="font-mono text-[10px]">{session.ipAddress}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 text-left sm:text-right">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                  {new Date(session.timestamp).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
