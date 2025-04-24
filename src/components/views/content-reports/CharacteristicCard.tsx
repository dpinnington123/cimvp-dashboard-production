import React, { useState } from 'react';
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
    height: '160px',
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

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn("relative w-full", className)} 
      style={{...cardFlipStyles.cardContainer, ...style}}
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
          className="overflow-hidden"
          style={{...cardFlipStyles.cardFace, ...cardFlipStyles.cardBack}}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{label} Details</span>
            </div>
            <div className="text-sm py-2 overflow-auto max-h-[80px]">
              {displayComments}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-auto self-end"
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