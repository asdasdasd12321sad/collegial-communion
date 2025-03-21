
import React from 'react';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  title,
  description,
  icon,
  onClick,
  className
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'channel-card ripple hover-card-effect',
        'p-4 cursor-pointer bg-white rounded-xl shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-cendy-text">{title}</h3>
          <p className="mt-0.5 text-sm text-cendy-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
