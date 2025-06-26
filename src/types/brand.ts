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
  // Additional fields from new table
  title?: string;
  audience_id?: string;
  objective_id?: string;
  behavioral_change?: string;
  framing?: string;
  order_index?: number;
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

// New interface for customer personas
export interface Persona {
  name: string;
  description: string;
  icon: "User" | "MessageSquare" | "Handshake" | "Star" | "Award" | "BadgeCheck"; // Icon identifier must be one of these values
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
}

// New interface for performance time data
export interface PerformanceTimeData {
  month: string;
  year?: number; // Optional for backwards compatibility
  overall: number;
  strategic: number;
  customer: number;
  content: number;
}

// Database-specific interfaces for new tables

export interface BrandMarketAnalysis {
  id?: string;
  market_size?: string;
  growth_rate?: string;
  analysis_year?: number;
}

export interface BrandCompetitor {
  id?: string;
  name: string;
  market_share?: string;
  strengths?: string[];
  weaknesses?: string[];
  order_index?: number;
}

export interface BrandSWOT {
  id?: string;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

export interface BrandCustomerSegment {
  id?: string;
  name: string;
  size_percentage?: string;
  description?: string;
  needs?: string[];
  pain_points?: string[];
  order_index?: number;
}

export interface BrandCustomerJourney {
  id?: string;
  stage: string;
  touchpoints?: string[];
  opportunities?: string[];
  order_index?: number;
}

export interface BrandPersona {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  overall_score?: number;
  strategic_score?: number;
  customer_score?: number;
  execution_score?: number;
  order_index?: number;
}

export interface BrandContent {
  id?: string;
  campaign_id?: string;
  content_id?: string;
  name: string;
  format?: string;
  type?: string;
  status?: string;
  description?: string;
  quality_score?: number;
  cost?: number;
  audience?: string;
  key_actions?: string[];
  agencies?: string[];
  overall_score?: number;
  strategic_score?: number;
  customer_score?: number;
  execution_score?: number;
  campaign_overall_effectiveness?: number;
  campaign_strategic_alignment?: number;
  campaign_customer_alignment?: number;
  campaign_content_effectiveness?: number;
}

export interface BrandOverallScores {
  id?: string;
  overall_score?: number;
  strategic_score?: number;
  customer_score?: number;
  content_score?: number;
}

export interface BrandChannelScores {
  id?: string;
  channel: string;
  overall_score?: number;
  strategic_score?: number;
  customer_score?: number;
  execution_score?: number;
}

export interface BrandFunnelData {
  id?: string;
  stage_name: string;
  value?: number;
  order_index?: number;
}

export interface BrandPerformanceHistory {
  id?: string;
  month: string;
  year: number;
  overall_score?: number;
  strategic_score?: number;
  customer_score?: number;
  content_score?: number;
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
  // New fields
  personas?: Persona[];
  performanceTimeData?: PerformanceTimeData[];
}

// Enhanced BrandData interface for database operations
export interface DatabaseBrandData {
  id: string;
  slug: string;
  name: string;
  business_area?: string;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related data as JSON from brand_full_data view
  regions?: any[];
  financials?: any;
  voice_attributes?: any[];
  objectives?: any[];
  messages?: any[];
  audiences?: any[];
  strategies?: any[];
  campaigns?: any[];
  
  // New structures
  market_analysis?: BrandMarketAnalysis;
  competitors?: BrandCompetitor[];
  swot?: BrandSWOT;
  customer_segments?: BrandCustomerSegment[];
  customer_journey?: BrandCustomerJourney[];
  personas?: BrandPersona[];
  content?: BrandContent[];
  overall_scores?: BrandOverallScores;
  channel_scores?: Record<string, BrandChannelScores>;
  funnel_data?: BrandFunnelData[];
  performance_history?: BrandPerformanceHistory[];
} 