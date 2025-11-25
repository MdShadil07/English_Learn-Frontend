import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-blue-50/50 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-blue-900/20"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

        <div className="relative p-8 md:p-10 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="absolute left-4 top-4 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            <div className="mb-4">
              <div className="w-16 h-16 mx-auto flex items-center justify-center">
                <img src="/logo.svg" alt="CognitoSpeak Logo" className="w-16 h-16" />
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-800 dark:from-white dark:to-emerald-400 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </Card>
    </motion.div>
  );
};

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={
            type === 'password'
              ? 'current-password'
              : /email/i.test(label) || /@/.test(placeholder)
              ? 'email'
              : /user(name)?/i.test(label)
              ? 'username'
              : 'on'
          }
          className={cn(
            "pl-10 pr-10 h-12 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
};

interface AuthButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  loading = false,
  variant = 'primary',
  onClick,
  disabled = false,
  className
}) => {
  const baseClasses = "w-full h-12 font-medium transition-all duration-200 shadow-lg";

  const variantClasses = {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
    outline: "bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

interface SocialAuthButtonProps {
  provider: 'google' | 'github' | 'facebook';
  children: React.ReactNode;
  onClick: () => void;
}

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  children,
  onClick
}) => {
  const providerColors = {
    google: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    github: 'from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900',
    facebook: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
  };

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "w-full h-12 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200",
        `bg-gradient-to-r ${providerColors[provider]} text-white border-0 hover:shadow-lg`
      )}
    >
      {children}
    </Button>
  );
};

interface AuthDividerProps {
  text: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
          {text}
        </span>
      </div>
    </div>
  );
};

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-red-400',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-emerald-500'
  ];

  if (password.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">Password strength:</span>
        <span className={cn(
          "font-medium",
          strength <= 2 ? "text-red-600 dark:text-red-400" :
          strength <= 3 ? "text-yellow-600 dark:text-yellow-400" :
          "text-emerald-600 dark:text-emerald-400"
        )}>
          {strengthLabels[strength - 1] || 'Very Weak'}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              level <= strength
                ? strengthColors[strength - 1]
                : "bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
      </div>
    </div>
  );
};

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkTo: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  linkTo
}) => {
  return (
    <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {text}{' '}
        <Link
          to={linkTo}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};
