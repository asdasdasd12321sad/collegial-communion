
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReactionButtonProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  activeColor?: string;
  onClick?: () => void;
  onLongPress?: () => void;
  className?: string;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  icon,
  text,
  active = false,
  activeColor = "text-cendy-blue",
  onClick,
  onLongPress,
  className,
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    if (onLongPress) {
      e.preventDefault(); // Prevent text selection
      setIsLongPressing(true);
      
      const timer = setTimeout(() => {
        if (onLongPress) {
          // Provide haptic feedback on supported browsers
          if (navigator.vibrate) {
            navigator.vibrate(25);
          }
          onLongPress();
          setIsLongPressing(false);
        }
      }, 500); // 500ms for long press detection
      
      longPressTimer.current = timer;
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };
  
  const handlePointerLeave = (e: React.PointerEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if not part of a long press
    if (!isLongPressing && onClick) {
      onClick();
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
      className={cn(
        "flex items-center justify-center gap-1 py-1 px-2 rounded-md font-medium transition-all duration-200",
        "hover:bg-gray-100 active:bg-gray-200 focus:outline-none",
        active ? activeColor : "text-cendy-text-secondary",
        isLongPressing && "scale-105",
        className
      )}
    >
      <span className={cn("text-[18px]", isLongPressing && "animate-pulse")}>{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default ReactionButton;
