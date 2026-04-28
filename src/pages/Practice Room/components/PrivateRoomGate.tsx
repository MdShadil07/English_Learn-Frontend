import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PrivateRoomGateProps {
  prefillCode?: string;
  onSuccess: (code: string) => void;
  onBack: () => void;
}

const PrivateRoomGate = ({ prefillCode, onSuccess, onBack }: PrivateRoomGateProps) => {
  const [code, setCode] = useState(prefillCode || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      setError('Please enter a valid room code');
      return;
    }
    setLoading(true);
    onSuccess(code.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[15%] right-[15%] w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <img
            src="/logo.svg"
            alt="CognitoSpeak"
            className="w-8 h-8"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
            CognitoSpeak
          </span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto mb-6">
            <Lock className="w-6 h-6 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-1">Private Room</h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Enter the room code to join this private session
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 8)); setError(''); }}
                placeholder="XXXXXX"
                className={cn(
                  'w-full px-4 py-4 rounded-xl border bg-slate-50 text-slate-900 text-center text-2xl tracking-[0.4em] font-bold uppercase placeholder:text-slate-300 placeholder:text-base placeholder:tracking-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0',
                  error
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100',
                )}
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-2 text-center font-medium"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.trim().length < 4}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : 'Join Room →'}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button
            onClick={onBack}
            className="w-full mt-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/50 text-sm font-medium transition-all duration-200"
          >
            ← Browse public rooms
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivateRoomGate;
