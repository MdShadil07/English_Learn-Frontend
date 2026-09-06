import React from 'react';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun } from 'lucide-react';

const AppearanceTab: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [uiLanguage, setUiLanguage] = React.useState('en');

  return (
    <div className="space-y-8 pb-4 max-w-3xl">
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Theme Preferences
        </h3>
        
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">
            Color Theme
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border transition-all ${
                theme === 'light' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-emerald-500/5 hover:border-slate-300 dark:hover:border-emerald-500/40'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">Light</span>
              </div>
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border transition-all ${
                theme === 'dark' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-emerald-500/5 hover:border-slate-300 dark:hover:border-emerald-500/40'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-full shadow-sm border border-slate-800 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-slate-700 shadow-inner" />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">Dark</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border transition-all ${
                theme === 'system' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-emerald-500/5 hover:border-slate-300 dark:hover:border-emerald-500/40'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-slate-200 to-slate-800 rounded-full shadow-sm flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-white to-slate-900 shadow-inner" />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">System</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Language Preferences
        </h3>
        
        <div className="space-y-3">
          <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">
            Display Language
          </Label>
          <Select value={uiLanguage} onValueChange={(val) => setUiLanguage(val)}>
            <SelectTrigger className="w-full bg-white border-slate-200 dark:bg-white/5 dark:border-emerald-500/20 text-slate-900 dark:text-white dark:focus:ring-emerald-500/30 rounded-xl">
              <SelectValue placeholder="Select display language" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#050C14] border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white">
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="es">Español (Spanish)</SelectItem>
              <SelectItem value="fr">Français (French)</SelectItem>
              <SelectItem value="de">Deutsch (German)</SelectItem>
              <SelectItem value="pt">Português (Portuguese)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] font-medium text-slate-500">This controls the language used in the platform UI.</p>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
