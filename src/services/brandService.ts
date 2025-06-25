// Brand Service - Database operations for brand data
// This service provides all brand-related database operations

import { supabase } from '@/lib/supabaseClient';
import type { 
  BrandData, 
  DatabaseBrandData,
  BrandMarketAnalysis,
  BrandCompetitor,
  BrandSWOT,
  BrandCustomerSegment,
  BrandCustomerJourney,
  BrandPersona,
  BrandContent,
  BrandOverallScores,
  BrandChannelScores,
  BrandFunnelData,
  BrandPerformanceHistory
} from '@/types/brand';

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
    if (!slug) {
      console.error('getBrandWithFullData called with empty slug');
      return null;
    }

    try {
      // First get the brand ID and core data
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select(`
          id, slug, name, business_area,
          voice_attributes, objectives, messages,
          swot_data, personas, market_analysis,
          customer_segments, customer_journey
        `)
        .eq('slug', slug)
        .single();

      if (brandError || !brand) {
        if (brandError?.code === 'PGRST116') {
          return null; // Brand not found
        }
        throw new Error(`Failed to fetch brand: ${brandError?.message}`);
      }

      // Fetch related data in parallel for better performance
      const [
        regions,
        financials, 
        scores,
        channelScores,
        performanceHistory,
        funnelData,
        strategies,
        campaigns,
        content,
        audiences,
        competitors
      ] = await Promise.all([
        // Regions
        supabase.from('brand_regions').select('*').eq('brand_id', brand.id),
        // Latest financials
        supabase.from('brand_financials').select('*').eq('brand_id', brand.id)
          .order('year', { ascending: false }).limit(1),
        // Latest overall scores
        supabase.from('brand_overall_scores').select('*').eq('brand_id', brand.id)
          .order('created_at', { ascending: false }).limit(1),
        // Channel scores
        supabase.from('brand_channel_scores').select('*').eq('brand_id', brand.id),
        // Performance history (last 12 months)
        supabase.from('brand_performance_history').select('*').eq('brand_id', brand.id)
          .order('year', { ascending: false }).limit(12),
        // Funnel data
        supabase.from('brand_funnel_data').select('*').eq('brand_id', brand.id)
          .order('order_index'),
        // Strategies
        supabase.from('brand_strategies').select('*').eq('brand_id', brand.id)
          .order('created_at'),
        // Campaigns
        supabase.from('brand_campaigns').select('*').eq('brand_id', brand.id)
          .order('created_at'),
        // Content with campaign names (limited to 50)
        supabase.from('brand_content')
          .select(`
            *,
            brand_campaigns!brand_content_campaign_id_fkey (
              name
            )
          `)
          .eq('brand_id', brand.id)
          .order('created_at', { ascending: false })
          .limit(50),
        // Audiences
        supabase.from('brand_audiences').select('*').eq('brand_id', brand.id)
          .order('order_index'),
        // Competitors
        supabase.from('brand_competitors').select('*').eq('brand_id', brand.id)
          .order('order_index')
      ]);

      // Construct the data object similar to the view structure
      const viewData = {
        ...brand,
        swot: brand.swot_data, // Map JSONB column names to expected names
        regions: regions.data || [],
        financials: financials.data?.[0] || {},
        overall_scores: scores.data?.[0] || {},
        channel_scores: channelScores.data || [],
        performance_history: performanceHistory.data || [],
        funnel_data: funnelData.data || [],
        strategies: strategies.data || [],
        campaigns: campaigns.data || [],
        content: content.data || [],
        audiences: audiences.data || [],
        competitors: competitors.data || []
      };

      // Transform to BrandData format
      return await this.transformToBrandData(viewData);
    } catch (error) {
      console.error('Error in optimized getBrandWithFullData:', error);
      throw error;
    }
  }

  /**
   * Transform database format to legacy BrandData format
   * This ensures compatibility with existing components
   */
  private async transformToBrandData(dbData: any): Promise<BrandData> {
    // Get primary region from regions array
    const primaryRegion = dbData.regions?.find((r: any) => r.is_primary)?.region || 
                         dbData.regions?.[0]?.region || 'Global';

    return {
      profile: {
        id: dbData.slug,
        name: dbData.name,
        region: primaryRegion,
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
      voice: (dbData.voice_attributes || []).map((voice: any) => ({
        id: voice.id,
        title: voice.title,
        description: voice.description
      })),
      objectives: dbData.objectives || [],
      messages: dbData.messages || [],
      audiences: (dbData.audiences || []).map((audience: any) => ({
        id: audience.id,
        text: audience.name,
        notes: audience.notes || ''
      })),
      strategies: (dbData.strategies || []).map((strategy: any) => ({
        id: strategy.id, // Include the ID for form dropdowns
        name: strategy.name,
        description: strategy.description || ''
      })),
      campaigns: (dbData.campaigns || []).map((campaign: any) => ({
        id: campaign.id, // Include the ID for form dropdowns
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
        keyActions: [],
        agencies: []
      })),
      content: (dbData.content || []).map((content: any) => {
        return {
          id: content.id || content.content_id, // Use UUID id first, fallback to content_id
          name: content.name,
          campaign: content.brand_campaigns?.name || '', // Use campaign name from join
          campaign_id: content.campaign_id, // Include campaign_id for mapping
          format: content.format || '',
          type: content.type || 'driver',
          status: content.status || 'draft',
          scores: {
            overall: content.overall_score || 0,
            strategic: content.strategic_score || 0,
            customer: content.customer_score || 0,
            execution: content.execution_score || 0
          },
          qualityScore: content.quality_score,
          description: content.description,
          cost: content.cost,
          campaignScores: {
            overallEffectiveness: content.campaign_overall_effectiveness || 0,
            strategicAlignment: content.campaign_strategic_alignment || 0,
            customerAlignment: content.campaign_customer_alignment || 0,
            contentEffectiveness: content.campaign_content_effectiveness || 0
          },
          audience: content.audience,
          keyActions: content.key_actions || [],
          agencies: content.agencies || []
        };
      }),
      overallScores: dbData.overall_scores ? {
        overall: dbData.overall_scores.overall_score || 0,
        strategic: dbData.overall_scores.strategic_score || 0,
        customer: dbData.overall_scores.customer_score || 0,
        content: dbData.overall_scores.content_score || 0
      } : { overall: 0, strategic: 0, customer: 0, content: 0 },
      channelScores: this.transformChannelScores(dbData.channel_scores),
      funnelData: (dbData.funnel_data || []).map((funnel: any) => ({
        name: funnel.stage_name,
        value: funnel.value || 0
      })),
      marketAnalysis: dbData.market_analysis && dbData.competitors && dbData.swot ? {
        marketSize: dbData.market_analysis.market_size || '',
        growthRate: dbData.market_analysis.growth_rate || '',
        competitorAnalysis: dbData.competitors || [],
        swot: dbData.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] }
      } : undefined,
      customerAnalysis: dbData.customer_segments && dbData.customer_journey ? {
        segments: (dbData.customer_segments || []).map((segment: any) => ({
          name: segment.name,
          size: segment.size_percentage || '',
          description: segment.description || '',
          needs: segment.needs || [],
          painPoints: segment.pain_points || []
        })),
        customerJourney: (dbData.customer_journey || []).map((journey: any) => ({
          stage: journey.stage,
          touchpoints: journey.touchpoints || [],
          opportunities: journey.opportunities || []
        }))
      } : undefined,
      personas: (dbData.personas || []).map((persona: any) => ({
        name: persona.name,
        description: persona.description || '',
        icon: persona.icon as any,
        scores: {
          overall: persona.overall_score || 0,
          strategic: persona.strategic_score || 0,
          customer: persona.customer_score || 0,
          execution: persona.execution_score || 0
        }
      })),
      performanceTimeData: (dbData.performance_history || []).map((history: any) => ({
        month: history.month,
        year: history.year,
        overall: history.overall_score || 0,
        strategic: history.strategic_score || 0,
        customer: history.customer_score || 0,
        content: history.content_score || 0
      }))
    };
  }

  /**
   * Transform channel scores from database format
   */
  private transformChannelScores(channelScores: any) {
    const defaultChannelScore = { overall: 0, strategic: 0, customer: 0, execution: 0 };
    
    return {
      social: channelScores?.social || defaultChannelScore,
      email: channelScores?.email || defaultChannelScore,
      website: channelScores?.website || defaultChannelScore,
      digital: channelScores?.digital || defaultChannelScore
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

  // ==========================================
  // NEW DATA STRUCTURE METHODS
  // ==========================================

  /**
   * Market Analysis Operations (JSONB)
   */
  async getBrandMarketAnalysis(brandId: string): Promise<BrandMarketAnalysis | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('market_analysis')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching market analysis:', error);
      throw new Error(`Failed to fetch market analysis: ${error.message}`);
    }

    return data?.market_analysis || null;
  }

  async upsertBrandMarketAnalysis(brandId: string, data: Omit<BrandMarketAnalysis, 'id'>): Promise<BrandMarketAnalysis> {
    const { data: result, error } = await supabase
      .from('brands')
      .update({ 
        market_analysis: data,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId)
      .select('market_analysis')
      .single();

    if (error) {
      console.error('Error upserting market analysis:', error);
      throw new Error(`Failed to update market analysis: ${error.message}`);
    }

    return result.market_analysis;
  }

  /**
   * Competitor Operations
   */
  async getBrandCompetitors(brandId: string): Promise<BrandCompetitor[]> {
    const { data, error } = await supabase
      .from('brand_competitors')
      .select('*')
      .eq('brand_id', brandId)
      .order('order_index');

    if (error) {
      console.error('Error fetching competitors:', error);
      throw new Error(`Failed to fetch competitors: ${error.message}`);
    }

    return data || [];
  }

  async createBrandCompetitor(brandId: string, competitor: Omit<BrandCompetitor, 'id'>): Promise<BrandCompetitor> {
    const { data, error } = await supabase
      .from('brand_competitors')
      .insert({ brand_id: brandId, ...competitor })
      .select()
      .single();

    if (error) {
      console.error('Error creating competitor:', error);
      throw new Error(`Failed to create competitor: ${error.message}`);
    }

    return data;
  }

  /**
   * SWOT Analysis Operations (JSONB)
   */
  async getBrandSWOT(brandId: string): Promise<BrandSWOT | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('swot_data')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching SWOT:', error);
      throw new Error(`Failed to fetch SWOT analysis: ${error.message}`);
    }

    return data?.swot_data || null;
  }

  async upsertBrandSWOT(brandId: string, swot: Omit<BrandSWOT, 'id'>): Promise<BrandSWOT> {
    const { data, error } = await supabase
      .from('brands')
      .update({ 
        swot_data: swot,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId)
      .select('swot_data')
      .single();

    if (error) {
      console.error('Error upserting SWOT:', error);
      throw new Error(`Failed to update SWOT analysis: ${error.message}`);
    }

    return data.swot_data;
  }

  /**
   * Customer Segments Operations (JSONB)
   */
  async getBrandCustomerSegments(brandId: string): Promise<BrandCustomerSegment[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('customer_segments')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching customer segments:', error);
      throw new Error(`Failed to fetch customer segments: ${error.message}`);
    }

    return data?.customer_segments || [];
  }

  /**
   * Customer Journey Operations (JSONB)
   */
  async getBrandCustomerJourney(brandId: string): Promise<BrandCustomerJourney[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('customer_journey')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching customer journey:', error);
      throw new Error(`Failed to fetch customer journey: ${error.message}`);
    }

    return data?.customer_journey || [];
  }

  /**
   * Personas Operations (JSONB)
   */
  async getBrandPersonas(brandId: string): Promise<BrandPersona[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('personas')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching personas:', error);
      throw new Error(`Failed to fetch personas: ${error.message}`);
    }

    return data?.personas || [];
  }

  /**
   * Performance History Operations
   */
  async getBrandPerformanceHistory(brandId: string, limit = 12): Promise<BrandPerformanceHistory[]> {
    const { data, error } = await supabase
      .from('brand_performance_history')
      .select('*')
      .eq('brand_id', brandId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching performance history:', error);
      throw new Error(`Failed to fetch performance history: ${error.message}`);
    }

    return data || [];
  }

  async addBrandPerformanceHistory(brandId: string, history: Omit<BrandPerformanceHistory, 'id'>): Promise<BrandPerformanceHistory> {
    const { data, error } = await supabase
      .from('brand_performance_history')
      .insert({ brand_id: brandId, ...history })
      .select()
      .single();

    if (error) {
      console.error('Error adding performance history:', error);
      throw new Error(`Failed to add performance history: ${error.message}`);
    }

    return data;
  }

  /**
   * Get complete database brand data (for debugging/admin)
   */
  async getDatabaseBrandData(slug: string): Promise<DatabaseBrandData | null> {
    const { data, error } = await supabase
      .from('brand_full_data')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Brand not found
      }
      console.error('Error fetching database brand data:', error);
      throw new Error(`Failed to fetch database brand data: ${error.message}`);
    }

    return data;
  }
}

export const brandService = new BrandService();