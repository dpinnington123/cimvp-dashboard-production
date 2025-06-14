// Brand Service - Database operations for brand data
// This service provides all brand-related database operations

import { supabase } from '@/lib/supabaseClient';
import type { BrandData } from '@/types/brand';

export interface DatabaseBrand {
  id: string;
  slug: string;
  name: string;
  business_area: string;
  created_at: string;
  updated_at: string;
}

export interface BrandWithRelations extends DatabaseBrand {
  regions: { region: string; is_primary: boolean }[];
  financials: {
    annual_sales: string;
    target_sales: string;
    growth_percentage: number;
    year: number;
  } | null;
  voice: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  objectives: Array<{
    id: string;
    text: string;
    notes: string;
    status: string;
  }>;
  messages: Array<{
    id: string;
    text: string;
    notes: string;
  }>;
  audiences: Array<{
    id: string;
    name: string;
    notes: string;
    demographics: Record<string, any>;
  }>;
  strategies: Array<{
    id: string;
    name: string;
    description: string;
    score: number;
    status: string;
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    timeframe: string;
    strategic_objective: string;
    audience: string;
    campaign_details: string;
    budget: number;
    overall_score: number;
    strategic_score: number;
    customer_score: number;
    execution_score: number;
    agencies: string[];
    actions: string[];
  }>;
}

class BrandService {
  /**
   * Get all available brands (for dropdown/selection)
   */
  async getAllBrands(): Promise<DatabaseBrand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('id, slug, name, business_area, created_at, updated_at')
      .order('name');

    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get all available regions
   */
  async getAllRegions(): Promise<string[]> {
    const { data, error } = await supabase
      .from('brand_regions')
      .select('region')
      .order('region');

    if (error) {
      console.error('Error fetching regions:', error);
      throw new Error(`Failed to fetch regions: ${error.message}`);
    }

    // Extract unique regions
    const regions = [...new Set((data || []).map(item => item.region))];
    return regions;
  }

  /**
   * Get brand by slug with minimal data
   */
  async getBrandBySlug(slug: string): Promise<DatabaseBrand | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('id, slug, name, business_area, created_at, updated_at')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Brand not found
      }
      console.error('Error fetching brand:', error);
      throw new Error(`Failed to fetch brand: ${error.message}`);
    }

    return data;
  }

  /**
   * Get brand with all related data (for dashboard/detailed views)
   */
  async getBrandWithFullData(slug: string): Promise<BrandData | null> {
    // First get the brand
    const brand = await this.getBrandBySlug(slug);
    if (!brand) return null;

    // Use the database view for efficient data retrieval
    const { data, error } = await supabase
      .from('brand_full_data')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Brand not found
      }
      console.error('Error fetching full brand data:', error);
      throw new Error(`Failed to fetch brand data: ${error.message}`);
    }

    // Transform database format to BrandData format
    return await this.transformToBrandData(data);
  }

  /**
   * Transform database format to legacy BrandData format
   * This ensures compatibility with existing components
   */
  private async transformToBrandData(dbData: any): Promise<BrandData> {
    return {
      profile: {
        id: dbData.slug,
        name: dbData.name,
        region: dbData.primary_region || 'Global',
        businessArea: dbData.business_area || '',
        financials: dbData.financials ? {
          annualSales: dbData.financials.annual_sales || '$0',
          targetSales: dbData.financials.target_sales || '$0',
          growth: `${dbData.financials.growth_percentage || 0}%`
        } : {
          annualSales: '$0',
          targetSales: '$0',
          growth: '0%'
        }
      },
      voice: dbData.voice || [],
      objectives: dbData.objectives || [],
      messages: dbData.messages || [],
      audiences: (dbData.audiences || []).map((audience: any) => ({
        id: audience.id,
        text: audience.name,
        notes: audience.notes || ''
      })),
      strategies: dbData.strategies || [],
      campaigns: (dbData.campaigns || []).map((campaign: any) => ({
        name: campaign.name,
        scores: {
          overall: campaign.overall_score || 0,
          strategic: campaign.strategic_score || 0,
          customer: campaign.customer_score || 0,
          execution: campaign.execution_score || 0
        },
        status: campaign.status || 'draft',
        timeframe: campaign.timeframe || '',
        strategicObjective: campaign.strategic_objective || '',
        audience: campaign.audience || '',
        campaignDetails: campaign.campaign_details || '',
        budget: campaign.budget || 0,
        keyActions: [], // Would need additional table for actions
        agencies: [] // Would need additional table for agencies
      })),
      content: await this.getBrandContent(dbData.id),
      overallScores: await this.getBrandOverallScores(dbData.id),
      channelScores: await this.getBrandChannelScores(dbData.id),
      funnelData: await this.getBrandFunnelData(dbData.id),
      // Optional fields that might not exist in database yet
      marketAnalysis: undefined,
      customerAnalysis: undefined,
      personas: undefined,
      performanceTimeData: undefined
    };
  }

  /**
   * Get enriched campaign data with agencies and actions
   */
  private async enrichCampaignsData(brandId: string) {
    const { data: campaigns, error } = await supabase
      .from('brand_campaigns')
      .select(`
        *,
        brand_campaign_agencies (agency_name),
        brand_campaign_actions (action, order_index)
      `)
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching campaigns:', error);
      return [];
    }

    return (campaigns || []).map(campaign => ({
      name: campaign.name,
      scores: {
        overall: campaign.overall_score || 0,
        strategic: campaign.strategic_score || 0,
        customer: campaign.customer_score || 0,
        execution: campaign.execution_score || 0
      },
      status: campaign.status || 'draft',
      timeframe: campaign.timeframe || '',
      strategicObjective: campaign.strategic_objective || '',
      audience: campaign.audience || '',
      keyActions: (campaign.brand_campaign_actions || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((action: any) => action.action),
      campaignDetails: campaign.campaign_details || '',
      agencies: (campaign.brand_campaign_agencies || [])
        .map((agency: any) => agency.agency_name),
      budget: campaign.budget || 0
    }));
  }

  /**
   * Get brand content (placeholder - would link to existing content table)
   */
  private async getBrandContent(brandId: string) {
    // This would query the content table with brand association
    // For now, return empty array
    return [];
  }

  /**
   * Get brand overall scores (placeholder)
   */
  private async getBrandOverallScores(brandId: string) {
    // This would aggregate scores from various sources
    return {
      overall: 85,
      strategic: 82,
      customer: 88,
      content: 84
    };
  }

  /**
   * Get brand channel scores (placeholder)
   */
  private async getBrandChannelScores(brandId: string) {
    return {
      social: { overall: 88, strategic: 85, customer: 92, execution: 80 },
      email: { overall: 85, strategic: 88, customer: 85, execution: 85 },
      website: { overall: 82, strategic: 80, customer: 88, execution: 78 },
      digital: { overall: 86, strategic: 84, customer: 90, execution: 82 }
    };
  }

  /**
   * Get brand funnel data (placeholder)
   */
  private async getBrandFunnelData(brandId: string) {
    return [
      { name: 'Awareness', value: 100 },
      { name: 'Interest', value: 25 },
      { name: 'Consideration', value: 15 },
      { name: 'Purchase', value: 6 },
      { name: 'Advocacy', value: 4.8 }
    ];
  }

  /**
   * Create a new brand
   */
  async createBrand(brandData: {
    slug: string;
    name: string;
    businessArea?: string;
    region?: string;
  }): Promise<DatabaseBrand> {
    const { data, error } = await supabase
      .from('brands')
      .insert({
        slug: brandData.slug,
        name: brandData.name,
        business_area: brandData.businessArea
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating brand:', error);
      throw new Error(`Failed to create brand: ${error.message}`);
    }

    // Add region if provided
    if (brandData.region) {
      await supabase
        .from('brand_regions')
        .insert({
          brand_id: data.id,
          region: brandData.region,
          is_primary: true
        });
    }

    return data;
  }

  /**
   * Update brand profile
   */
  async updateBrand(slug: string, updates: Partial<{
    name: string;
    businessArea: string;
  }>): Promise<DatabaseBrand> {
    const { data, error } = await supabase
      .from('brands')
      .update({
        name: updates.name,
        business_area: updates.businessArea,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating brand:', error);
      throw new Error(`Failed to update brand: ${error.message}`);
    }

    return data;
  }
}

export const brandService = new BrandService();