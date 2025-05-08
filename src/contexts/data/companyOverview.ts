// src/data/companyOverview.ts
// Logic for aggregating brand data into company-level overview

import { brandsData, regions } from './index';
import { 
  CompanyOverviewData, 
  AggregatedScores, 
  BrandSummary,
  RegionalPerformance,
  ContentTypePerformance 
} from '../../types/company';
import { 
  BrandData, 
  Campaign, 
  ChannelScores,
  ContentItem,
  FunnelStep
} from '../../types/brand';

/**
 * Calculate average scores across all brands
 */
function calculateAverageScores(brands: Record<string, BrandData>): AggregatedScores {
  const brandCount = Object.keys(brands).length;
  if (brandCount === 0) {
    return { overall: 0, strategic: 0, customer: 0, content: 0 };
  }

  const totalScores = Object.values(brands).reduce(
    (acc, brand) => {
      return {
        overall: acc.overall + brand.overallScores.overall,
        strategic: acc.strategic + brand.overallScores.strategic,
        customer: acc.customer + brand.overallScores.customer,
        content: acc.content + brand.overallScores.content
      };
    },
    { overall: 0, strategic: 0, customer: 0, content: 0 }
  );

  return {
    overall: Math.round(totalScores.overall / brandCount),
    strategic: Math.round(totalScores.strategic / brandCount),
    customer: Math.round(totalScores.customer / brandCount),
    content: Math.round(totalScores.content / brandCount)
  };
}

/**
 * Generate brand summaries for all brands
 */
function generateBrandSummaries(brands: Record<string, BrandData>): BrandSummary[] {
  const summaries = Object.entries(brands).map(([id, brand]) => ({
    id,
    name: brand.profile.name,
    region: brand.profile.region,
    businessArea: brand.profile.businessArea,
    scores: {
      overall: brand.overallScores.overall,
      strategic: brand.overallScores.strategic,
      customer: brand.overallScores.customer,
      content: brand.overallScores.content
    },
    financials: {
      annualSales: brand.profile.financials.annualSales,
      growth: brand.profile.financials.growth,
      targetSales: brand.profile.financials.targetSales
    },
    // Add relationships between performance and other metrics
    relationships: {
      // Correlation between size (annual sales) and marketing effectiveness
      sizeEffectiveness: calculateCorrelation(
        parseFloat(brand.profile.financials.annualSales.replace(/[^0-9.]/g, '')),
        brand.overallScores.overall
      ),
      // Correlation between growth rate and customer alignment
      growthCustomerAlignment: calculateCorrelation(
        parseFloat(brand.profile.financials.growth.replace(/[^0-9.]/g, '')),
        brand.overallScores.customer
      ),
      // Average campaign effectiveness relative to overall score
      campaignEffectivenessRatio: brand.campaigns.length > 0
        ? (brand.campaigns.reduce((sum, campaign) => sum + campaign.scores.overall, 0) / brand.campaigns.length) / brand.overallScores.overall
        : 1,
      // Content to strategy alignment ratio
      contentStrategyAlignment: brand.overallScores.content / brand.overallScores.strategic
    },
    // Top performing campaign for this brand
    topCampaign: brand.campaigns.length > 0
      ? brand.campaigns.reduce((top, campaign) => 
          campaign.scores.overall > top.scores.overall ? campaign : top, 
          brand.campaigns[0]
        )
      : null,
    // Content type effectiveness
    contentTypeEffectiveness: analyzeContentTypeEffectiveness(brand.content)
  }));

  // Sort by overall score descending
  return summaries.sort((a, b) => b.scores.overall - a.scores.overall);
}

/**
 * Calculate a simple correlation value between two metrics
 * This is a simplified version just for demonstration
 */
function calculateCorrelation(a: number, b: number): number {
  // This is just a placeholder implementation
  // In a real scenario, you would use proper statistical correlation
  const normalizedA = a / 100; // Normalize values
  const normalizedB = b / 100;
  
  // Simple relation calculation - produces values between -1 and 1
  return ((normalizedA * normalizedB) - ((1 - normalizedA) * (1 - normalizedB))) * 2;
}

/**
 * Analyze content type effectiveness for a brand
 */
function analyzeContentTypeEffectiveness(content: ContentItem[]): Record<string, number> {
  const contentTypes: Record<string, { total: number, count: number }> = {};
  
  // Group by content format and calculate average scores
  content.forEach(item => {
    if (!contentTypes[item.format]) {
      contentTypes[item.format] = { total: 0, count: 0 };
    }
    
    contentTypes[item.format].total += item.scores.overall;
    contentTypes[item.format].count += 1;
  });
  
  // Convert to average scores
  const result: Record<string, number> = {};
  Object.entries(contentTypes).forEach(([format, data]) => {
    result[format] = Math.round(data.total / data.count);
  });
  
  return result;
}

/**
 * Calculate regional performance metrics
 */
function calculateRegionalPerformance(brands: Record<string, BrandData>): RegionalPerformance[] {
  const regionalData = regions.map(region => {
    const regionalBrands = Object.values(brands).filter(brand => 
      brand.profile.region === region || region === "Global"
    );
    
    const brandCount = regionalBrands.length;
    if (brandCount === 0) {
      return {
        region,
        overallScore: 0,
        strategicScore: 0,
        customerScore: 0,
        contentScore: 0,
        brandCount: 0
      };
    }

    const totals = regionalBrands.reduce(
      (acc, brand) => {
        return {
          overall: acc.overall + brand.overallScores.overall,
          strategic: acc.strategic + brand.overallScores.strategic,
          customer: acc.customer + brand.overallScores.customer,
          content: acc.content + brand.overallScores.content
        };
      },
      { overall: 0, strategic: 0, customer: 0, content: 0 }
    );

    return {
      region,
      overallScore: Math.round(totals.overall / brandCount),
      strategicScore: Math.round(totals.strategic / brandCount),
      customerScore: Math.round(totals.customer / brandCount),
      contentScore: Math.round(totals.content / brandCount),
      brandCount
    };
  });

  return regionalData.filter(data => data.brandCount > 0);
}

/**
 * Get top campaigns across all brands
 */
function getTopCampaigns(brands: Record<string, BrandData>, limit: number = 5): Campaign[] {
  const allCampaigns = Object.entries(brands).flatMap(([brandName, brand]) => 
    brand.campaigns.map(campaign => ({
      ...campaign,
      brandName
    }))
  );

  return allCampaigns
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit)
    .map(campaign => ({
      ...campaign,
      name: `${campaign.name} (${(campaign as any).brandName})`
    }));
}

/**
 * Get top content items across all brands
 */
function getTopContent(brands: Record<string, BrandData>, limit: number = 5): ContentItem[] {
  const allContent = Object.entries(brands).flatMap(([brandName, brand]) => 
    brand.content.map(content => ({
      ...content,
      brandName
    }))
  );

  return allContent
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit)
    .map(content => ({
      ...content,
      name: `${content.name} (${(content as any).brandName})`
    }));
}

/**
 * Calculate average channel scores across all brands
 */
function calculateAverageChannelScores(brands: Record<string, BrandData>): {
  social: ChannelScores;
  email: ChannelScores;
  website: ChannelScores;
  digital: ChannelScores;
} {
  const brandCount = Object.keys(brands).length;
  if (brandCount === 0) {
    const emptyScores = { overall: 0, strategic: 0, customer: 0, execution: 0 };
    return {
      social: emptyScores,
      email: emptyScores,
      website: emptyScores,
      digital: emptyScores
    };
  }

  const totalChannelScores = Object.values(brands).reduce(
    (acc, brand) => {
      return {
        social: {
          overall: acc.social.overall + brand.channelScores.social.overall,
          strategic: acc.social.strategic + brand.channelScores.social.strategic,
          customer: acc.social.customer + brand.channelScores.social.customer,
          execution: acc.social.execution + brand.channelScores.social.execution
        },
        email: {
          overall: acc.email.overall + brand.channelScores.email.overall,
          strategic: acc.email.strategic + brand.channelScores.email.strategic,
          customer: acc.email.customer + brand.channelScores.email.customer,
          execution: acc.email.execution + brand.channelScores.email.execution
        },
        website: {
          overall: acc.website.overall + brand.channelScores.website.overall,
          strategic: acc.website.strategic + brand.channelScores.website.strategic,
          customer: acc.website.customer + brand.channelScores.website.customer,
          execution: acc.website.execution + brand.channelScores.website.execution
        },
        digital: {
          overall: acc.digital.overall + brand.channelScores.digital.overall,
          strategic: acc.digital.strategic + brand.channelScores.digital.strategic,
          customer: acc.digital.customer + brand.channelScores.digital.customer,
          execution: acc.digital.execution + brand.channelScores.digital.execution
        }
      };
    },
    {
      social: { overall: 0, strategic: 0, customer: 0, execution: 0 },
      email: { overall: 0, strategic: 0, customer: 0, execution: 0 },
      website: { overall: 0, strategic: 0, customer: 0, execution: 0 },
      digital: { overall: 0, strategic: 0, customer: 0, execution: 0 }
    }
  );

  // Calculate averages
  return {
    social: {
      overall: Math.round(totalChannelScores.social.overall / brandCount),
      strategic: Math.round(totalChannelScores.social.strategic / brandCount),
      customer: Math.round(totalChannelScores.social.customer / brandCount),
      execution: Math.round(totalChannelScores.social.execution / brandCount)
    },
    email: {
      overall: Math.round(totalChannelScores.email.overall / brandCount),
      strategic: Math.round(totalChannelScores.email.strategic / brandCount),
      customer: Math.round(totalChannelScores.email.customer / brandCount),
      execution: Math.round(totalChannelScores.email.execution / brandCount)
    },
    website: {
      overall: Math.round(totalChannelScores.website.overall / brandCount),
      strategic: Math.round(totalChannelScores.website.strategic / brandCount),
      customer: Math.round(totalChannelScores.website.customer / brandCount),
      execution: Math.round(totalChannelScores.website.execution / brandCount)
    },
    digital: {
      overall: Math.round(totalChannelScores.digital.overall / brandCount),
      strategic: Math.round(totalChannelScores.digital.strategic / brandCount),
      customer: Math.round(totalChannelScores.digital.customer / brandCount),
      execution: Math.round(totalChannelScores.digital.execution / brandCount)
    }
  };
}

/**
 * Calculate average funnel data across all brands with multiple metrics
 */
function calculateAverageFunnelData(brands: Record<string, BrandData>): FunnelStep[] {
  // Return fixed values that match the UI screenshot with multiple metrics for each step
  return [
    {
      name: "Awareness to Consider",
      value: 78,
      metrics: {
        overallEffectiveness: 78,
        strategicAlignment: 82,
        customerAlignment: 69,
        executionEffectiveness: 75
      }
    },
    {
      name: "Consider to Buy/Use",
      value: 65,
      metrics: {
        overallEffectiveness: 65,
        strategicAlignment: 70,
        customerAlignment: 75,
        executionEffectiveness: 62
      }
    },
    {
      name: "Buy/Use to Expand",
      value: 58,
      metrics: {
        overallEffectiveness: 58,
        strategicAlignment: 63,
        customerAlignment: 67,
        executionEffectiveness: 54
      }
    },
    {
      name: "Customer to Advocacy",
      value: 42,
      metrics: {
        overallEffectiveness: 42,
        strategicAlignment: 48,
        customerAlignment: 52,
        executionEffectiveness: 38
      }
    }
  ];
}

/**
 * Generate content type performance data
 */
function generateContentTypePerformance(): ContentTypePerformance[] {
  // Since this is simulated data, we'll create some reasonable content types and values
  return [
    {
      type: 'Social Media',
      overallEffectiveness: 72,
      strategicAlignment: 68,
      customerAlignment: 81,
      executionEffectiveness: 67
    },
    {
      type: 'Video',
      overallEffectiveness: 65,
      strategicAlignment: 70,
      customerAlignment: 75,
      executionEffectiveness: 62
    },
    {
      type: 'Blog',
      overallEffectiveness: 58,
      strategicAlignment: 63,
      customerAlignment: 67,
      executionEffectiveness: 54
    },
    {
      type: 'Email',
      overallEffectiveness: 62,
      strategicAlignment: 67,
      customerAlignment: 58,
      executionEffectiveness: 60
    },
    {
      type: 'Whitepaper',
      overallEffectiveness: 45,
      strategicAlignment: 58,
      customerAlignment: 42,
      executionEffectiveness: 48
    }
  ];
}

/**
 * Calculate total annual sales across all brands
 */
function calculateTotalAnnualSales(brands: Record<string, BrandData>): string {
  const totalSales = Object.values(brands).reduce((sum, brand) => {
    const salesStr = brand.profile.financials.annualSales;
    // Extract numeric value from string like "$10M"
    const numericValue = parseFloat(salesStr.replace(/[^0-9.]/g, ''));
    const multiplier = salesStr.includes('B') ? 1000 : 1; // Convert billions to millions
    return sum + (numericValue * multiplier);
  }, 0);

  // Format as "$XXM" or "$XXB"
  if (totalSales >= 1000) {
    return `$${(totalSales / 1000).toFixed(1)}B`;
  }
  return `$${totalSales.toFixed(0)}M`;
}

/**
 * Calculate average growth rate across all brands
 */
function calculateAverageGrowth(brands: Record<string, BrandData>): string {
  const brandCount = Object.keys(brands).length;
  if (brandCount === 0) return "0%";

  const totalGrowth = Object.values(brands).reduce((sum, brand) => {
    const growthStr = brand.profile.financials.growth;
    // Extract numeric value from string like "15%"
    const growthValue = parseFloat(growthStr.replace(/[^0-9.]/g, ''));
    return sum + growthValue;
  }, 0);

  return `${(totalGrowth / brandCount).toFixed(1)}%`;
}

/**
 * Generate simulated performance over time data
 */
function generatePerformanceOverTime(): Array<{
  month: string;
  overall: number;
  strategic: number;
  customer: number;
  content: number;
}> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    // Generate slightly increasing trend with some randomness
    const base = 40 + (index * 1.5);
    const randomFactor = () => Math.floor(Math.random() * 10) - 5; // -5 to +5

    return {
      month,
      overall: Math.min(100, Math.max(0, Math.round(base + randomFactor()))),
      strategic: Math.min(100, Math.max(0, Math.round(base + 5 + randomFactor()))),
      customer: Math.min(100, Math.max(0, Math.round(base - 5 + randomFactor()))),
      content: Math.min(100, Math.max(0, Math.round(base + 2 + randomFactor())))
    };
  });
}

/**
 * Generate brand performance comparison over time
 */
function generateBrandPerformanceOverTime(): Array<{
  month: string;
  brands: Record<string, {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  }>;
}> {
  // Get the top 3 brands from brand summaries (by overall score)
  const topBrands = generateBrandSummaries(brandsData)
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, 3);
    
  // Use first half of the year for the comparison chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  return months.map((month, index) => {
    // Generate data that matches the screenshot pattern with a base increase over time
    const baseValue = index * 3; 
    
    // Create an object to hold all brand data
    const brandData: Record<string, {
      overall: number;
      strategic: number;
      customer: number;
      execution: number;
    }> = {};
    
    // Generate data for each of the top brands
    topBrands.forEach((brand, brandIndex) => {
      // Different starting points and growth rates based on brand performance
      const baseScore = 60 + (10 * brandIndex) + baseValue;
      const variance = () => Math.floor(Math.random() * 5);
      
      brandData[brand.name] = {
        overall: baseScore + 5 + variance(),
        strategic: baseScore + variance(),
        customer: baseScore - 3 + variance(),
        execution: baseScore + 2 + variance(),
      };
    });
    
    return {
      month,
      brands: brandData
    };
  });
}

/**
 * Aggregate all brand data into company-level overview
 */
export const companyOverviewData: CompanyOverviewData = {
  overallScores: calculateAverageScores(brandsData),
  financialSummary: {
    totalAnnualSales: calculateTotalAnnualSales(brandsData),
    averageGrowth: calculateAverageGrowth(brandsData)
  },
  brandSummaries: generateBrandSummaries(brandsData),
  regionalPerformance: calculateRegionalPerformance(brandsData),
  topCampaigns: getTopCampaigns(brandsData),
  topContent: getTopContent(brandsData),
  channelScores: calculateAverageChannelScores(brandsData),
  funnelData: calculateAverageFunnelData(brandsData),
  contentTypePerformance: generateContentTypePerformance(),
  performanceOverTime: generatePerformanceOverTime(),
  brandPerformanceOverTime: generateBrandPerformanceOverTime()
}; 