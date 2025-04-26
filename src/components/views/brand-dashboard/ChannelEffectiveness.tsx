
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChannelScores {
  overall: number;
  strategic: number;
  customer: number;
  execution: number;
}

interface ChannelEffectivenessProps {
  channelScores: {
    social: ChannelScores;
    email: ChannelScores;
    website: ChannelScores;
    digital: ChannelScores;
  };
}

export function ChannelEffectiveness({ channelScores }: ChannelEffectivenessProps) {
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

  const channels = [
    { id: "social", name: "Social Media", scores: channelScores.social },
    { id: "email", name: "Email", scores: channelScores.email },
    { id: "website", name: "Website", scores: channelScores.website },
    { id: "digital", name: "Digital Advertising", scores: channelScores.digital }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {channels.map((channel) => (
        <Card key={channel.id} className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{channel.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Overall</span>
                <span className={cn("text-sm font-medium", getScoreClass(channel.scores.overall))}>
                  {channel.scores.overall}
                </span>
              </div>
              <Progress value={channel.scores.overall} indicatorClassName={getProgressColor(channel.scores.overall)} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Strategic</span>
                <span className={cn("text-sm font-medium", getScoreClass(channel.scores.strategic))}>
                  {channel.scores.strategic}
                </span>
              </div>
              <Progress value={channel.scores.strategic} indicatorClassName={getProgressColor(channel.scores.strategic)} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className={cn("text-sm font-medium", getScoreClass(channel.scores.customer))}>
                  {channel.scores.customer}
                </span>
              </div>
              <Progress value={channel.scores.customer} indicatorClassName={getProgressColor(channel.scores.customer)} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Execution</span>
                <span className={cn("text-sm font-medium", getScoreClass(channel.scores.execution))}>
                  {channel.scores.execution}
                </span>
              </div>
              <Progress value={channel.scores.execution} indicatorClassName={getProgressColor(channel.scores.execution)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
