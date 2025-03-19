
import React from 'react';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  count?: number;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  title,
  description,
  icon,
  onClick,
  className,
  count
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'channel-card ripple hover-card-effect',
        'p-4 cursor-pointer',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cendy-blue/10 text-cendy-blue">
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cendy-text">{title}</h3>
            {count !== undefined && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cendy-blue text-xs font-medium text-white">
                {count}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-cendy-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
