
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type ReactionType = "like" | "heart" | "laugh" | "wow" | "sad" | "angry" | null;

interface ReactionPopoverProps {
  isOpen: boolean;
  onReactionSelect: (reaction: ReactionType) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  currentReaction: ReactionType;
}

const ReactionPopover: React.FC<ReactionPopoverProps> = ({
  isOpen,
  onReactionSelect,
  onClose,
  triggerRef,
  currentReaction
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0, width: 0 });

  const reactions = [
    { type: "like", emoji: "👍", label: "Like", color: "text-cendy-blue" },
    { type: "heart", emoji: "❤️", label: "Love", color: "text-red-500" },
    { type: "laugh", emoji: "😆", label: "Haha", color: "text-yellow-500" },
    { type: "wow", emoji: "😮", label: "Wow", color: "text-yellow-500" },
    { type: "sad", emoji: "😢", label: "Sad", color: "text-blue-500" },
    { type: "angry", emoji: "😡", label: "Angry", color: "text-orange-600" },
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Handle escape key to close popover
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Update popover position based on trigger element
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 320; // Fixed width for the reaction menu
      
      setPopoverPosition({
        top: triggerRect.top - 70, // Position above the button with some space
        left: triggerRect.left + (triggerRect.width / 2), // Center horizontally above the button
        width: menuWidth,
      });
    }
  }, [isOpen, triggerRef]);

  const handleReactionSelect = (reaction: ReactionType) => {
    // If the same reaction is selected, set it to null to remove it
    if (reaction === currentReaction) {
      onReactionSelect(null);
    } else {
      onReactionSelect(reaction);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay to help with closing on clicks outside */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      <div
        ref={popoverRef}
        className="reaction-container fixed z-50 bg-white py-2 px-2 rounded-full shadow-lg flex items-center justify-center"
        style={{
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
          transform: `translateX(-50%) scale(1)`, // Center horizontally
          width: `${popoverPosition.width}px`,
        }}
        onMouseLeave={() => setHoveredReaction(null)}
      >
        {reactions.map((reaction) => (
          <div
            key={reaction.type}
            className={cn(
              "relative group flex-1",
              currentReaction === reaction.type && "scale-110"
            )}
            onMouseEnter={() => setHoveredReaction(reaction.type as ReactionType)}
            onClick={() => handleReactionSelect(reaction.type as ReactionType)}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer mx-auto",
                "transition-all duration-200 hover:scale-125",
                hoveredReaction === reaction.type && "animate-bounce",
                currentReaction === reaction.type && "ring-2 ring-gray-200 ring-opacity-50"
              )}
            >
              <span className="text-2xl">{reaction.emoji}</span>
            </div>
            
            {/* Tooltip */}
            <div 
              className={cn(
                "absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md",
                "bg-black text-white text-xs whitespace-nowrap opacity-0 transition-opacity",
                "group-hover:opacity-100 pointer-events-none"
              )}
            >
              {reaction.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReactionPopover;
