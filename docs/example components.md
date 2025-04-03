import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScoreCard } from "./ScoreCard";
import { ImprovementArea } from "./ImprovementArea";
import { ContentPreview } from "./ContentPreview";
import { Badge } from "@/components/ui/badge";
import { Star, BarChart2, TrendingUp, Target, Award, FileText, Share2, Users, Calendar, Clock, ArrowUpRight } from "lucide-react";

export interface ContentReport {
  id: string;
  name: string;
  imageSrc: string;
  contentType?: string;
  datePublished?: string;
  duration?: string;
  audience?: string;
  description?: string;
  goals?: string[];
  keyFindings?: string[];
  scores: {
    overall: number;
    persuasiveness: number;
    customerCentricity: number;
    attention: number;
    engagement: number;
    impact: number;
    formatEffectiveness: number;
    contextAlignment: number;
  };
  improvementAreas: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

interface ContentEffectivenessReportProps {
  report: ContentReport;
  className?: string;
}

export function ContentEffectivenessReport({ report, className }: ContentEffectivenessReportProps) {
  const getOverallScoreLabel = (score: number) => {
    if (score >= 80) return "Exceptional";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Average";
    if (score >= 40) return "Below Average";
    return "Needs Improvement";
  };

  return (
    <div className={cn("space-y-8 animate-in fade-in", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ContentPreview 
            imageSrc={report.imageSrc} 
            title={report.name}
            contentType={report.contentType}
            datePublished={report.datePublished}
            duration={report.duration}
            audience={report.audience}
          />
          <Card className="mt-4 animate-in slide-up card-hover">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Overall Score</CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {getOverallScoreLabel(report.scores.overall)}
                </Badge>
              </div>
              <CardDescription>Content performance summary</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-center my-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0">
                    <CircularProgressIndicator 
                      value={report.scores.overall} 
                      size={128} 
                      strokeWidth={10}
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-3xl font-semibold">{report.scores.overall}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="scores" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="scores">Performance Scores</TabsTrigger>
              <TabsTrigger value="details">Content Details</TabsTrigger>
              <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
            </TabsList>
            <TabsContent value="scores" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ScoreCard 
                  title="Persuasiveness" 
                  value={report.scores.persuasiveness}
                  description="Ability to convince and convert the audience"
                />
                <ScoreCard 
                  title="Customer Centricity" 
                  value={report.scores.customerCentricity}
                  description="Focus on customer needs and pain points"
                />
                <ScoreCard 
                  title="Attention" 
                  value={report.scores.attention}
                  description="Ability to grab and maintain audience attention"
                />
                <ScoreCard 
                  title="Engagement" 
                  value={report.scores.engagement}
                  description="Level of audience interaction with content"
                />
                <ScoreCard 
                  title="Impact" 
                  value={report.scores.impact}
                  description="Overall effect on target audience"
                />
                <ScoreCard 
                  title="Format Effectiveness" 
                  value={report.scores.formatEffectiveness}
                  description="Appropriateness of chosen content format"
                />
                <ScoreCard 
                  title="Context Alignment" 
                  value={report.scores.contextAlignment}
                  description="Relevance to current market context"
                  className="sm:col-span-2"
                />
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-0 p-0 animate-in fade-in-50">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {report.description && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Content Overview
                        </h3>
                        <p className="text-muted-foreground">{report.description}</p>
                      </div>
                    )}
                    
                    {report.goals && report.goals.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Content Goals
                        </h3>
                        <ul className="space-y-2">
                          {report.goals.map((goal, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {report.keyFindings && report.keyFindings.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Audience
                        </h3>
                        <ul className="space-y-2">
                          {report.keyFindings.map((finding, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                      <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Published On</span>
                        </div>
                        <p className="font-medium">{report.datePublished || "Not specified"}</p>
                      </div>
                      
                      <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Duration</span>
                        </div>
                        <p className="font-medium">{report.duration || "Not specified"}</p>
                      </div>
                      
                      <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Users className="w-4 h-4" />
                          <span>Target Audience</span>
                        </div>
                        <p className="font-medium">{report.audience || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="improvements" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 gap-4">
                {report.improvementAreas.map((area) => (
                  <ImprovementArea
                    key={area.id}
                    title={area.title}
                    description={area.description}
                    priority={area.priority}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* Import the circular progress indicator component */
import { CircularProgressIndicator } from "./CircularProgressIndicator";


import React from 'react';
import { cn } from "@/lib/utils";

interface CircularProgressIndicatorProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgressIndicator = ({
  value,
  size = 48,
  strokeWidth = 4,
  className,
}: CircularProgressIndicatorProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="stroke-muted"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn("transition-all duration-700 ease-out-expo", getScoreColor(value))}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
    </div>
  );
};


import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CalendarIcon, ClockIcon, UsersIcon, GlobeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContentPreviewProps {
  imageSrc: string;
  title: string;
  className?: string;
  contentType?: string;
  datePublished?: string;
  duration?: string;
  audience?: string;
}

export function ContentPreview({ 
  imageSrc, 
  title, 
  className,
  contentType,
  datePublished,
  duration,
  audience
}: ContentPreviewProps) {
  return (
    <Card className={cn("overflow-hidden border animate-in fade-in card-hover", className)}>
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <img 
              src="/lovable-uploads/dc5c76a1-e7d8-4ee3-8c9a-44f69fb5274e.png" 
              alt={title}
              className="object-cover w-full h-full rounded-t-lg" 
              loading="lazy"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <GlobeIcon className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs font-medium">Website</span>
            </div>
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>
        </div>
        
        {(contentType || datePublished || duration || audience) && (
          <div className="p-4 space-y-3">
            {contentType && (
              <Badge variant="secondary" className="text-xs">{contentType}</Badge>
            )}
            
            <div className="grid grid-cols-1 gap-2 text-sm">
              {datePublished && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{datePublished}</span>
                </div>
              )}
              
              {duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{duration}</span>
                </div>
              )}
              
              {audience && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>{audience}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check, Info } from "lucide-react";

export interface ImprovementAreaProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  className?: string;
}

export function ImprovementArea({ title, description, priority, className }: ImprovementAreaProps) {
  const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: "text-rose-500",
          bgColor: "bg-rose-50 dark:bg-rose-950/30",
          borderColor: "border-rose-200 dark:border-rose-900/50"
        };
      case 'medium':
        return {
          icon: Info,
          color: "text-amber-500",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          borderColor: "border-amber-200 dark:border-amber-900/50"
        };
      case 'low':
        return {
          icon: Check,
          color: "text-emerald-500",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          borderColor: "border-emerald-200 dark:border-emerald-900/50"
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <Card className={cn("border animate-in slide-up card-hover", config.borderColor, className)}>
      <CardHeader className={cn("flex flex-row items-center gap-4 py-4", config.bgColor)}>
        <div className={cn("p-2 rounded-full", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-5">
        <CardDescription className="text-sm text-foreground/80">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
