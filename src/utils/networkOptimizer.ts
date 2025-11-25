/**
 * Network Detection and Optimization Utilities
 * 
 * Detects user's connection speed and provides optimization recommendations
 */

export type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';

export interface NetworkInfo {
  type: ConnectionType;
  effectiveType: string;
  downlink: number; // Mbps
  rtt: number; // Round-trip time in ms
  saveData: boolean;
}

export class NetworkOptimizer {
  private static instance: NetworkOptimizer;
  
  private constructor() {}
  
  static getInstance(): NetworkOptimizer {
    if (!NetworkOptimizer.instance) {
      NetworkOptimizer.instance = new NetworkOptimizer();
    }
    return NetworkOptimizer.instance;
  }

  /**
   * Get current network information
   */
  getNetworkInfo(): NetworkInfo {
    // @ts-expect-error - NetworkInformation is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      return {
        type: 'unknown',
        effectiveType: 'unknown',
        downlink: 10,
        rtt: 50,
        saveData: false,
      };
    }

    return {
      type: connection.effectiveType as ConnectionType,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 50,
      saveData: connection.saveData || false,
    };
  }

  /**
   * Check if user is on a slow connection
   */
  isSlowConnection(): boolean {
    const info = this.getNetworkInfo();
    return info.type === 'slow-2g' || info.type === '2g' || info.type === '3g' || info.saveData;
  }

  /**
   * Get recommended quality settings based on connection
   */
  getRecommendedQuality(): 'low' | 'medium' | 'high' {
    const info = this.getNetworkInfo();
    
    if (info.saveData || info.type === 'slow-2g' || info.type === '2g') {
      return 'low';
    }
    
    if (info.type === '3g') {
      return 'medium';
    }
    
    return 'high';
  }

  /**
   * Get debounce delay based on connection speed
   */
  getDebounceDelay(): number {
    const info = this.getNetworkInfo();
    
    // Slower connections need longer debounce to reduce requests
    if (info.type === 'slow-2g' || info.type === '2g') {
      return 1000; // 1 second
    }
    
    if (info.type === '3g') {
      return 700; // 700ms
    }
    
    return 500; // 500ms for fast connections
  }

  /**
   * Get cache duration based on connection speed
   */
  getCacheDuration(): number {
    const info = this.getNetworkInfo();
    
    // Slower connections should cache longer
    if (info.type === 'slow-2g' || info.type === '2g') {
      return 10 * 60 * 1000; // 10 minutes
    }
    
    if (info.type === '3g') {
      return 5 * 60 * 1000; // 5 minutes
    }
    
    return 2 * 60 * 1000; // 2 minutes for fast connections
  }

  /**
   * Should enable real-time features based on connection
   */
  shouldEnableRealtime(): boolean {
    const info = this.getNetworkInfo();
    
    // Disable real-time on slow connections to save bandwidth
    return info.type !== 'slow-2g' && info.type !== '2g' && !info.saveData;
  }

  /**
   * Get image quality based on connection
   */
  getImageQuality(): { quality: number; format: 'webp' | 'jpeg' } {
    const info = this.getNetworkInfo();
    
    if (info.type === 'slow-2g' || info.type === '2g') {
      return { quality: 50, format: 'webp' };
    }
    
    if (info.type === '3g') {
      return { quality: 70, format: 'webp' };
    }
    
    return { quality: 90, format: 'webp' };
  }

  /**
   * Get animation preferences based on connection
   */
  shouldReduceAnimations(): boolean {
    const info = this.getNetworkInfo();
    
    // Reduce animations on slow connections to improve performance
    return info.type === 'slow-2g' || info.type === '2g' || info.saveData;
  }

  /**
   * Get API request timeout based on connection
   */
  getRequestTimeout(): number {
    const info = this.getNetworkInfo();
    
    if (info.type === 'slow-2g' || info.type === '2g') {
      return 30000; // 30 seconds
    }
    
    if (info.type === '3g') {
      return 15000; // 15 seconds
    }
    
    return 10000; // 10 seconds for fast connections
  }

  /**
   * Listen for connection changes
   */
  onConnectionChange(callback: (info: NetworkInfo) => void): () => void {
    // @ts-expect-error - NetworkInformation is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      return () => {}; // No-op cleanup
    }

    const handler = () => {
      callback(this.getNetworkInfo());
    };

    connection.addEventListener('change', handler);

    return () => {
      connection.removeEventListener('change', handler);
    };
  }

  /**
   * Get network status message for UI
   */
  getNetworkStatusMessage(): string {
    const info = this.getNetworkInfo();
    
    if (info.saveData) {
      return 'Data saver mode is on. Some features are limited.';
    }
    
    switch (info.type) {
      case 'slow-2g':
        return 'Very slow connection detected. Using minimal features.';
      case '2g':
        return 'Slow connection detected. Some features are disabled.';
      case '3g':
        return 'Moderate connection speed. Optimizing for performance.';
      case '4g':
        return 'Fast connection. All features enabled.';
      default:
        return '';
    }
  }

  /**
   * Get user-friendly connection type label
   */
  getConnectionTypeLabel(): string {
    const info = this.getNetworkInfo();
    
    switch (info.type) {
      case 'slow-2g':
        return 'Very Slow (2G)';
      case '2g':
        return 'Slow (2G)';
      case '3g':
        return 'Moderate (3G)';
      case '4g':
        return 'Fast (4G)';
      default:
        return 'Unknown';
    }
  }
}

// Export singleton instance
export const networkOptimizer = NetworkOptimizer.getInstance();
