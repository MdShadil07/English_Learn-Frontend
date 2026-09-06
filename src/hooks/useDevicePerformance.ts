import { useState, useEffect } from 'react';

export interface DevicePerformance {
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  deviceMemory: number;
  hardwareConcurrency: number;
}

export function useDevicePerformance(): DevicePerformance {
  const [performance, setPerformance] = useState<DevicePerformance>({
    isLowEnd: false, // Default to false for SSR/initial render
    prefersReducedMotion: false,
    deviceMemory: 4,
    hardwareConcurrency: 4,
  });

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;
    
    // Check hardware
    // @ts-ignore - deviceMemory is not in standard TS DOM lib yet
    const deviceMemory = navigator.deviceMemory || 4; 
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Define low end: less than 4GB RAM or less than 4 cores, or prefers reduced motion
    const isLowEnd = prefersReducedMotion || deviceMemory < 4 || hardwareConcurrency < 4;

    setPerformance({
      isLowEnd,
      prefersReducedMotion,
      deviceMemory,
      hardwareConcurrency,
    });

    // Listen for changes in reduced motion preference
    const listener = (e: MediaQueryListEvent) => {
      setPerformance(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
        isLowEnd: e.matches || prev.deviceMemory < 4 || prev.hardwareConcurrency < 4
      }));
    };

    motionQuery.addEventListener('change', listener);
    return () => motionQuery.removeEventListener('change', listener);
  }, []);

  return performance;
}
