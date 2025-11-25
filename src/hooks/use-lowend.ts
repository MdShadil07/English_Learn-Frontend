import { useEffect, useState } from 'react';

// Lightweight heuristic to detect low-end devices.
// Uses navigator.hardwareConcurrency and navigator.deviceMemory when available
// and respects prefers-reduced-motion.
export default function useLowEnd() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    try {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hw = navigator.hardwareConcurrency || 4;
      // deviceMemory is fractional in GB in some browsers
      // default to 4 if not available
      // treat devices with <= 2 logical cores or <=1GB as low-end
      // clamp and guard for undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const devMem = (navigator as any).deviceMemory || 4;

      const low = prefersReduced || hw <= 2 || devMem <= 1;
      setIsLowEnd(Boolean(low));
    } catch (e) {
      setIsLowEnd(false);
    }
  }, []);

  return isLowEnd;
}
