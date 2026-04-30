# Auth Components

This directory contains authentication-related components for the English Learning Platform.

## Components

### AccountVerificationSection.tsx
- **Purpose**: Main verification component for edit profile page
- **Features**: Email verification status, Google SSO linking with email verification
- **Used in**: Edit Profile page under "Account Verification" section

### AuthComponents.tsx
- **Purpose**: General authentication components
- **Features**: Login forms, signup forms, etc.

### GoogleLoginButton.tsx
- **Purpose**: Google OAuth login button
- **Features**: Google authentication, error handling
- **Used in**: Login and signup pages

### ProtectedRoute.tsx
- **Purpose**: Route protection for authenticated users
- **Features**: Authentication check, redirect logic

### index.ts
- **Purpose**: Export all auth components
- **Usage**: Centralized imports

## Removed Components

The following components have been removed as they are no longer needed:
- `GoogleAccountLinking.tsx` - Replaced by AccountVerificationSection.tsx
- `SecureGoogleAccountLinking.tsx` - Replaced by AccountVerificationSection.tsx  
- `GoogleSSOStatusDebug.tsx` - Debug component no longer needed

## Architecture

The verification system has been reorganized:
1. **Profile Page**: Shows verification status button in sidebar
2. **Edit Profile Page**: Contains full verification section
3. **Backend**: Email verification service and secure linking endpoints

## Security Features

- Email verification required for Google account linking
- Two-factor authentication (email + Google OAuth)
- Time-sensitive verification codes (10 minutes)
- Secure token handling
