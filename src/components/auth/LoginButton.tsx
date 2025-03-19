
import React from 'react';
import { cn } from '@/lib/utils';

interface LoginButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
  isLoading?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  icon,
  label,
  className,
  isLoading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium',
        'transition-all duration-300 hover:shadow-md active:scale-[0.98]',
        'border border-cendy-gray-medium bg-white text-cendy-text',
        'focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50',
        'disabled:cursor-not-allowed disabled:opacity-70',
        className
      )}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-cendy-gray-medium border-t-cendy-blue" />
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );
};

export default LoginButton;
