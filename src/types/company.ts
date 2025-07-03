// src/types/company.ts
// Type definitions for company-level aggregated data

import { 
  Campaign, 
  ContentItem, 
  ChannelScores, 
  FunnelStep
} from './brand';

/**
 * Structure for aggregated brand scores
 */
export interface AggregatedScores {
  overall: number;
  strategic: number;
  customer: number;
  content: number;
}

/**
 * Brand summary for use in company-level views
 */
export interface BrandSummary {
  id: string;
  name: string;
  region: string;
  businessArea: string;
  scores: AggregatedScores;
  financials: {
    annualSales: string;
    growth: string;
    targetSales: string;
  };
  // Relationships between metrics for data analysis
  relationships?: {
    sizeEffectiveness: number;
    growthCustomerAlignment: number;
    campaignEffectivenessRatio: number;
    contentStrategyAlignment: number;
  };
  // Top performing campaign for this brand
  topCampaign?: Campaign | null;
  // Effectiveness by content type
  contentTypeEffectiveness?: Record<string, number>;
}

/**
 * Regional performance data
 */
export interface RegionalPerformance {
  region: string;
  overallScore: number;
  strategicScore: number;
  customerScore: number;
  contentScore: number;
  brandCount: number;
}

/**
 * Content type performance 
 */
export interface ContentTypePerformance {
  type: string;
  overallEffectiveness: number;
  strategicAlignment: number;
  customerAlignment: number;
  executionEffectiveness: number;
}

/**
 * Company overview data structure for aggregating data across all brands
 */
export interface CompanyOverviewData {
  // Overall company metrics
  overallScores: AggregatedScores;
  
  // Financial summary
  financialSummary: {
    totalAnnualSales: string;
    averageGrowth: string;
  };
  
  // Brand summaries for comparison
  brandSummaries: BrandSummary[];
  
  // Regional performance 
  regionalPerformance: RegionalPerformance[];
  
  // Top campaigns across all brands
  topCampaigns: Campaign[];
  
  // Top content items across all brands
  topContent: ContentItem[];
  
  // Aggregated channel scores
  channelScores: {
    social: ChannelScores;
    email: ChannelScores;
    website: ChannelScores;
    digital: ChannelScores;
  };
  
  // Aggregated funnel data
  funnelData: FunnelStep[];
  
  // Content performance by type
  contentTypePerformance: ContentTypePerformance[];
  
  // Performance over time (for charts)
  performanceOverTime: {
    month: string;
    overall: number;
    strategic: number;
    customer: number;
    content: number;
  }[];
  
  // Brand performance comparison over time
  brandPerformanceOverTime: {
    month: string;
    brands: Record<string, {
      overall: number;
      strategic: number;
      customer: number;
      execution: number;
    }>;
  }[];
} 