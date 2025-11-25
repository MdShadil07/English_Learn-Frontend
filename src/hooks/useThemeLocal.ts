import { useEffect } from 'react';
import useLocalStorage from 'react-use-localstorage';

type Theme = 'light' | 'dark' | 'system';

export default function useThemeLocal() {
  const [theme, setThemeRaw] = useLocalStorage('theme', 'system');

  // Normalize returned theme value
  const normalized: Theme = (theme as Theme) || 'system';

  const setTheme = (t: Theme) => {
    setThemeRaw(t);
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (t === 'light') {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // On mount, apply theme to document (for SSR-safe clients this runs once)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (normalized === 'dark') document.documentElement.classList.add('dark');
    if (normalized === 'light') document.documentElement.classList.remove('dark');
  }, [normalized]);

  return { theme: normalized, setTheme } as const;
}
