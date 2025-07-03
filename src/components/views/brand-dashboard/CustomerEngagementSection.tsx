
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, MessageSquare, Handshake, Star, Award, BadgeCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EngagementScore {
  overall: number;
  strategic: number;
  customer: number;
  execution: number;
}

interface Persona {
  name: string;
  description: string;
  icon: keyof typeof iconMap;
  scores: EngagementScore;
}

interface CustomerEngagementSectionProps {
  engagementScores: EngagementScore;
  personas: Persona[];
}

const iconMap = {
  User: User,
  MessageSquare: MessageSquare,
  Handshake: Handshake,
  Star: Star,
  Award: Award,
  BadgeCheck: BadgeCheck,
};

export function CustomerEngagementSection({ engagementScores, personas = [] }: CustomerEngagementSectionProps) {
  // Filter out personas without scores and add default scores if needed
  const validPersonas = personas.filter(p => p).map(persona => ({
    ...persona,
    scores: persona.scores || {
      overall: 0,
      strategic: 0,
      customer: 0,
      execution: 0
    }
  }));
  const getScoreClass = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-score-excellent";
    if (score >= 70) return "bg-score-good";
    if (score >= 50) return "bg-score-average";
    return "bg-score-poor";
  };

  return (
    <div className="space-y-6">
      {/* Personas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {validPersonas.map((persona, index) => {
          const IconComponent = iconMap[persona.icon];
          return (
            <Card key={index} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5 text-brand-blue" />
                  {`Persona ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{persona.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Overall</span>
                      <span className={cn("text-sm font-medium", getScoreClass(persona.scores.overall))}>
                        {persona.scores.overall}
                      </span>
                    </div>
                    <Progress value={persona.scores.overall} indicatorClassName={getProgressColor(persona.scores.overall)} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Strategic</span>
                      <span className={cn("text-sm font-medium", getScoreClass(persona.scores.strategic))}>
                        {persona.scores.strategic}
                      </span>
                    </div>
                    <Progress value={persona.scores.strategic} indicatorClassName={getProgressColor(persona.scores.strategic)} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Customer</span>
                      <span className={cn("text-sm font-medium", getScoreClass(persona.scores.customer))}>
                        {persona.scores.customer}
                      </span>
                    </div>
                    <Progress value={persona.scores.customer} indicatorClassName={getProgressColor(persona.scores.customer)} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Execution</span>
                      <span className={cn("text-sm font-medium", getScoreClass(persona.scores.execution))}>
                        {persona.scores.execution}
                      </span>
                    </div>
                    <Progress value={persona.scores.execution} indicatorClassName={getProgressColor(persona.scores.execution)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
