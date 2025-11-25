/**
 * Voice Installation Guide
 * Provides instructions for users to install language voices
 */

export interface VoiceInstallationGuide {
  language: string;
  languageCode: string;
  hasNativeSupport: boolean;
  browserInstructions: {
    chrome: string;
    edge: string;
    safari: string;
    firefox: string;
  };
  systemInstructions: {
    windows: string;
    mac: string;
    linux: string;
  };
  alternatives: string[];
}

export const VOICE_INSTALLATION_GUIDES: Record<string, VoiceInstallationGuide> = {
  hindi: {
    language: 'Hindi',
    languageCode: 'hi-IN',
    hasNativeSupport: false,
    browserInstructions: {
      chrome: 'Chrome supports Hindi voices on Windows 10/11 with speech packs installed.',
      edge: 'Edge has excellent Hindi support. Go to Settings > Time & Language > Speech > Add voices.',
      safari: 'Safari on macOS supports Hindi through system voices.',
      firefox: 'Firefox uses system voices. Install Hindi speech pack on your OS.'
    },
    systemInstructions: {
      windows: `
        Windows 10/11:
        1. Open Settings > Time & Language > Language & Region
        2. Click "Add a language"
        3. Select "Hindi" and install
        4. Under Hindi, click "Options"
        5. Download "Text-to-speech" feature
        6. Restart your browser
      `,
      mac: `
        macOS:
        1. Open System Preferences > Accessibility
        2. Select "Spoken Content"
        3. Click "System Voice" dropdown
        4. Select "Customize..."
        5. Find and download "Lekha" (Hindi female) or other Hindi voices
        6. Restart your browser
      `,
      linux: `
        Linux:
        1. Install espeak-ng: sudo apt-get install espeak-ng
        2. Install Hindi voice: sudo apt-get install espeak-ng-data
        3. Or use Festival: sudo apt-get install festival festvox-hindi-nsk
        4. Restart your browser
      `
    },
    alternatives: [
      'Our app uses intelligent chunking for better pronunciation even without native voices',
      'Text will be broken into smaller parts for clearer speech',
      'Consider using Microsoft Edge which has the best Hindi support'
    ]
  },
  
  urdu: {
    language: 'Urdu',
    languageCode: 'ur-PK',
    hasNativeSupport: false,
    browserInstructions: {
      chrome: 'Chrome supports Urdu voices on Windows 10/11 with speech packs installed.',
      edge: 'Edge has Urdu support. Go to Settings > Time & Language > Speech > Add voices.',
      safari: 'Safari on macOS may have limited Urdu support.',
      firefox: 'Firefox uses system voices. Install Urdu speech pack on your OS.'
    },
    systemInstructions: {
      windows: `
        Windows 10/11:
        1. Open Settings > Time & Language > Language & Region
        2. Click "Add a language"
        3. Select "Urdu (Pakistan)" and install
        4. Under Urdu, click "Options"
        5. Download "Text-to-speech" feature
        6. Restart your browser
      `,
      mac: `
        macOS:
        Urdu voices are limited on macOS. Consider using:
        1. Windows Subsystem (if available)
        2. Online TTS services
        3. Our built-in chunked speech for better clarity
      `,
      linux: `
        Linux:
        Urdu support is limited. Consider:
        1. Using espeak with custom voice files
        2. Online TTS services
        3. Our built-in chunked speech feature
      `
    },
    alternatives: [
      'Our app uses intelligent chunking for better Urdu pronunciation',
      'Text will be broken into smaller parts for clearer speech',
      'Consider using Microsoft Edge on Windows for best Urdu support',
      'Installing Urdu language pack on Windows provides excellent TTS quality'
    ]
  },
  
  bengali: {
    language: 'Bengali',
    languageCode: 'bn-IN',
    hasNativeSupport: false,
    browserInstructions: {
      chrome: 'Chrome supports Bengali voices on Windows 10/11 with speech packs installed.',
      edge: 'Edge has Bengali support through Windows TTS.',
      safari: 'Safari on macOS has limited Bengali support.',
      firefox: 'Firefox uses system voices. Install Bengali speech pack on your OS.'
    },
    systemInstructions: {
      windows: `
        Windows 10/11:
        1. Open Settings > Time & Language > Language & Region
        2. Click "Add a language"
        3. Select "Bengali (India)" or "Bengali (Bangladesh)"
        4. Under Bengali, click "Options"
        5. Download "Text-to-speech" feature
        6. Restart your browser
      `,
      mac: `
        macOS:
        1. Open System Preferences > Accessibility
        2. Select "Spoken Content"
        3. Click "System Voice" dropdown
        4. Bengali voices may be available through third-party sources
      `,
      linux: `
        Linux:
        1. Install espeak-ng with Bengali support
        2. Or use online TTS services
      `
    },
    alternatives: [
      'Our app uses intelligent chunking for better Bengali pronunciation',
      'Installing Bengali language pack on Windows provides good TTS quality'
    ]
  }
};

/**
 * Get installation guide for a language
 */
export function getVoiceInstallationGuide(language: string): VoiceInstallationGuide | null {
  return VOICE_INSTALLATION_GUIDES[language.toLowerCase()] || null;
}

/**
 * Detect user's browser
 */
export function detectBrowser(): 'chrome' | 'edge' | 'safari' | 'firefox' | 'unknown' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('edg/')) return 'edge';
  if (userAgent.includes('chrome')) return 'chrome';
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
  if (userAgent.includes('firefox')) return 'firefox';
  
  return 'unknown';
}

/**
 * Detect user's operating system
 */
export function detectOS(): 'windows' | 'mac' | 'linux' | 'unknown' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) return 'windows';
  if (userAgent.includes('mac')) return 'mac';
  if (userAgent.includes('linux')) return 'linux';
  
  return 'unknown';
}

/**
 * Get user-specific installation instructions
 */
export function getUserSpecificInstructions(language: string): string {
  const guide = getVoiceInstallationGuide(language);
  if (!guide) return '';
  
  const browser = detectBrowser();
  const os = detectOS();
  
  const browserInstructions = browser !== 'unknown' 
    ? guide.browserInstructions[browser] 
    : 'Please install language pack for your browser';
    
  const osInstructions = os !== 'unknown'
    ? guide.systemInstructions[os]
    : '';
  
  return `
📱 Browser: ${browser.toUpperCase()}
💻 System: ${os.toUpperCase()}

${browserInstructions}

${osInstructions}

💡 Alternatives:
${guide.alternatives.map(alt => `• ${alt}`).join('\n')}
  `.trim();
}

/**
 * Show installation guide in console for missing voices
 */
export function showVoiceInstallationHelpInConsole(language: string): void {
  const instructions = getUserSpecificInstructions(language);
  
  if (instructions) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔊 ${language.toUpperCase()} VOICE NOT FOUND - INSTALLATION GUIDE       ║
╚════════════════════════════════════════════════════════════╝

${instructions}

Note: The app will continue to work using:
✅ Intelligent text chunking for better pronunciation
✅ Slower speech rate for clarity
✅ Small pauses between phrases

For best results, please install the ${language} language pack.
    `);
  }
}
