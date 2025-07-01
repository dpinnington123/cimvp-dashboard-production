import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InfoIcon, RotateCcw } from "lucide-react";

interface CharacteristicCardProps {
  icon?: React.ReactNode; // Icon is optional
  label: string;
  value: string | number | React.ReactNode; // Value can be text, number, or even another component
  comments?: string | null; // Added comments field for the back of the card
  className?: string;
  style?: React.CSSProperties; // Adding style prop for animation delays
}

// Card flip styles
const cardFlipStyles = {
  cardContainer: {
    perspective: '1000px',
    minHeight: '160px', // Changed from fixed height to minHeight
  },
  cardInner: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    transition: 'transform 0.5s',
    transformStyle: 'preserve-3d' as const,
  },
  cardInnerFlipped: {
    transform: 'rotateY(180deg)',
  },
  cardFace: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
  },
  cardBack: {
    transform: 'rotateY(180deg)',
  },
};

export function CharacteristicCard({ 
  icon, 
  label, 
  value, 
  comments, 
  className, 
  style 
}: CharacteristicCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const displayValue = value !== null && value !== undefined && value !== '' ? value : "N/A";
  const displayComments = comments || "No additional information available.";
  
  // Add ref for content height measurement
  const contentRef = useRef<HTMLDivElement>(null);
  const [backCardHeight, setBackCardHeight] = useState<number | null>(null);

  const toggleFlip = () => {
    // When flipping to the back, calculate the required height
    if (!isFlipped && contentRef.current) {
      // Add extra space for header and button (approximately 100px)
      const requiredHeight = contentRef.current.scrollHeight + 100;
      setBackCardHeight(Math.max(160, requiredHeight)); // Ensure minimum height
    }
    setIsFlipped(!isFlipped);
  };

  // Get container style with dynamic height when flipped
  const getContainerStyle = () => {
    const baseStyle = {...cardFlipStyles.cardContainer, ...style};
    if (isFlipped && backCardHeight) {
      return {
        ...baseStyle,
        height: `${backCardHeight}px`
      };
    }
    return baseStyle;
  };

  return (
    <div 
      className={cn("relative w-full", className)} 
      style={getContainerStyle()}
    >
      <div 
        style={{
          ...cardFlipStyles.cardInner,
          ...(isFlipped ? cardFlipStyles.cardInnerFlipped : {})
        }}
      >
        {/* Front of card */}
        <Card 
          className="overflow-hidden"
          style={cardFlipStyles.cardFace}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {icon}
              <span>{label}</span>
            </div>
            <div className="text-3xl font-bold text-center py-2">
              {displayValue}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-auto self-end" 
              onClick={toggleFlip}
              aria-label="Show details"
            >
              <InfoIcon className="w-4 h-4 mr-1" />
              Details
            </Button>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card 
          className="overflow-visible"
          style={{...cardFlipStyles.cardFace, ...cardFlipStyles.cardBack}}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{label} Details</span>
            </div>
            <div 
              ref={contentRef}
              className="text-sm px-1"
            >
              {displayComments}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-auto self-end z-10 bg-orange-500 text-white"
              onClick={toggleFlip}
              aria-label="Show front"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 