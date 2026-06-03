/**
 * Device Capability Detector
 * 
 * Analyzes the browser's hardware and network to determine a capability profile.
 * Used to cap the number of active WebRTC video consumers and prevent tab crashes
 * or thermal throttling on low-end devices.
 */

export type DeviceProfile = 'low' | 'medium' | 'high';

export interface DeviceStats {
  cores: number;
  memory: number; // in GB
  connectionType: string;
  isMobile: boolean;
}

class DeviceCapability {
  private profile: DeviceProfile | null = null;
  private stats: DeviceStats | null = null;

  public getStats(): DeviceStats {
    if (this.stats) return this.stats;

    const nav = navigator as any;

    // Default to conservative estimates if APIs are unavailable
    const cores = nav.hardwareConcurrency || 4;
    
    // deviceMemory is only available in Chrome/Edge, defaults to 4
    const memory = nav.deviceMemory || 4; 
    
    // connection is only available in some browsers
    const connectionType = nav.connection?.effectiveType || '4g';
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    this.stats = {
      cores,
      memory,
      connectionType,
      isMobile
    };

    return this.stats;
  }

  public getProfile(): DeviceProfile {
    if (this.profile) return this.profile;

    const stats = this.getStats();

    // Low Profile: Weak mobile chips, very low RAM, or slow networks
    if (
      stats.connectionType === '2g' || 
      stats.connectionType === '3g' || 
      stats.cores <= 2 || 
      stats.memory <= 2 ||
      (stats.isMobile && stats.cores <= 4)
    ) {
      this.profile = 'low';
      return this.profile;
    }

    // High Profile: Powerful desktops/laptops
    if (!stats.isMobile && stats.cores >= 8 && stats.memory >= 8) {
      this.profile = 'high';
      return this.profile;
    }

    // Medium Profile: Average modern phones and 4-core laptops
    this.profile = 'medium';
    return this.profile;
  }

  /**
   * Returns the maximum number of simultaneous video tiles this device should render
   */
  public getMaxVideoTiles(): number {
    const profile = this.getProfile();
    
    // Cap to prevent hardware decoder exhaustion
    if (profile === 'low') return 4;
    if (profile === 'medium') return 9; // 3x3 grid
    return 16; // 4x4 grid (High)
  }
}

export const deviceCapability = new DeviceCapability();
