export interface SavedSession {
  hasValidToken: boolean;
  isTrustedDevice: boolean;
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  } | null;
}

export const getSavedSession = (): SavedSession => {
  let user = null;
  let hasValidToken = false;
  let isTrustedDevice = false;

  try {
    // 1. Check for basic user data cache
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const parsedUser = JSON.parse(userDataStr);
      user = {
        fullName: parsedUser.fullName || `${parsedUser.firstName} ${parsedUser.lastName}`.trim() || 'User',
        email: parsedUser.email || '',
        avatar: parsedUser.avatar || parsedUser.avatar_url || parsedUser.googleAuth?.profilePicture || undefined,
      };
    }

    // 2. Check for active access token
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Basic validity check (if needed we can check JWT expiration, but existence is a good proxy for UI)
      hasValidToken = true;
    }

    // 3. Check for trusted device tokens
    if (user && user.email) {
      const deviceToken = localStorage.getItem(`trusted_device_token_${user.email.toLowerCase()}`);
      if (deviceToken) {
        isTrustedDevice = true;
      }
    } else {
      // If we don't have user.email but have ANY trusted device token, we can extract email from the key
      const deviceTokenKey = Object.keys(localStorage).find(key => key.startsWith('trusted_device_token_'));
      if (deviceTokenKey) {
        isTrustedDevice = true;
        if (!user) {
          const email = deviceTokenKey.replace('trusted_device_token_', '');
          user = { fullName: 'User', email, avatar: undefined };
        }
      }
    }
  } catch (error) {
    console.warn('sessionManager: Error reading saved session', error);
  }

  return {
    hasValidToken,
    isTrustedDevice,
    user,
  };
};

export const clearSavedSession = () => {
  try {
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Remove all trusted device tokens
    const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('trusted_device_token_'));
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('sessionManager: Error clearing saved session', error);
  }
};
