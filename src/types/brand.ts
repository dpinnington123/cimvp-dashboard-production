// src/types/brand.ts
// Centralized type definitions for brand data

// Type definitions for brand data
export interface BrandProfile {
  id: string;
  name: string;
  logo?: string; // URL to logo image
  region: string;
  businessArea: string;
  financials: {
    annualSales: string;
    targetSales: string;
    growth: string;
  };
}

export interface BrandVoice {
  id: string;
  title: string;
  description: string;
}

export interface BrandObjective {
  id: string;
  text: string;
  notes: string;
}

export interface BrandMessage {
  id: string;
  text: string;
  notes: string;
}

export interface BrandAudience {
  id: string;
  text: string;
  notes: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  score: number;
}

export interface Campaign {
  name: string;
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
  status: 'active' | 'planned' | 'completed';
  timeframe: string;
  strategicObjective?: string;
  audience?: string;
  keyActions?: string[];
  campaignDetails?: string;
  agencies?: string[];
  campaignObjectives?: string[];
  customerValueProp?: string;
  budget?: number;
}

export interface ContentItem {
  id: string;
  name: string;
  campaign: string;
  format: string;
  type: "hero" | "driver";
  status: "draft" | "live";
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
  qualityScore?: number;
  description?: string;
  cost?: number;
  campaignScores?: {
    overallEffectiveness: number;
    strategicAlignment: number;
    customerAlignment: number;
    contentEffectiveness: number;
  };
  strategicObjective?: string;
  campaignObjectives?: string[];
  customerValueProp?: string;
  audience?: string;
  keyActions?: string[];
  campaignDetails?: string;
  agencies?: string[];
  objective?: string;
  kpis?: string[];
  agency?: string;
}

export interface ChannelScores {
  overall: number;
  strategic: number;
  customer: number;
  execution: number;
}

export interface FunnelStep {
  name: string;
  value: number;
  // Add metrics for different alignment and effectiveness scores
  metrics?: {
    overallEffectiveness: number;
    strategicAlignment: number;
    customerAlignment: number;
    executionEffectiveness: number;
  };
}

export interface MarketAnalysis {
  marketSize: string;
  growthRate: string;
  competitorAnalysis: Array<{
    name: string;
    marketShare: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface CustomerAnalysis {
  segments: Array<{
    name: string;
    size: string;
    description: string;
    needs: string[];
    painPoints: string[];
  }>;
  customerJourney: Array<{
    stage: string;
    touchpoints: string[];
    opportunities: string[];
  }>;
}

export interface BrandData {
  profile: BrandProfile;
  voice: BrandVoice[];
  objectives: BrandObjective[];
  messages: BrandMessage[];
  audiences: BrandAudience[];
  strategies: Strategy[];
  campaigns: Campaign[];
  content: ContentItem[];
  overallScores: {
    overall: number;
    strategic: number;
    customer: number;
    content: number;
  };
  channelScores: {
    social: ChannelScores;
    email: ChannelScores;
    website: ChannelScores;
    digital: ChannelScores;
  };
  funnelData: FunnelStep[];
  marketAnalysis?: MarketAnalysis;
  customerAnalysis?: CustomerAnalysis;
} 