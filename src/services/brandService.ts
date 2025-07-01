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
import type { BrandStyleGuide } from '@/types/brandStyleGuide';
import { 
  safeUpdateRelationalData, 
  safeAddItem, 
  safeUpdateItem, 
  safeDeleteItem 
} from '@/utils/safeRelationalUpdate';

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
   * Get brand ID by slug
   */
  async getBrandIdBySlug(slug: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Brand not found
      }
      console.error('Error fetching brand ID:', error);
      return null;
    }

    return data?.id || null;
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
          voice_attributes, objectives,
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
        competitors,
        objectives,
        messages
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
        // Campaigns (excluding soft deleted)
        supabase.from('brand_campaigns').select('*').eq('brand_id', brand.id)
          .is('deleted_at', null)
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
          .order('order_index'),
        // Objectives from new table
        supabase.from('brand_objectives').select('*').eq('brand_id', brand.id)
          .order('order_index'),
        // Messages from new table
        supabase.from('brand_messages').select('*').eq('brand_id', brand.id)
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
        competitors: competitors.data || [],
        objectives: objectives.data || [], // Use data from new table instead of JSONB
        messages: messages.data || [] // Use data from new table instead of JSONB
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
      objectives: (dbData.objectives || []).map((obj: any) => ({
        id: obj.id,
        text: obj.title,
        notes: obj.behavioral_change || '',
        status: obj.status || 'active',
        // Additional fields from new table
        target_audience_id: obj.target_audience_id,
        scenario: obj.scenario,
        timeline: obj.timeline,
        owner: obj.owner,
        kpis: obj.kpis || []
      })),
      messages: (dbData.messages || []).map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        notes: msg.narrative || '',
        // Additional fields from new table
        title: msg.title,
        audience_id: msg.audience_id,
        objective_id: msg.objective_id,
        behavioral_change: msg.behavioral_change,
        framing: msg.framing,
        order_index: msg.order_index
      })),
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
        keyActions: campaign.key_actions || [],
        agencies: campaign.agencies || []
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
      marketAnalysis: {
        marketSize: dbData.market_analysis?.market_size || '',
        growthRate: dbData.market_analysis?.growth_rate || '',
        competitorAnalysis: dbData.competitors || [],
        swot: dbData.swot || dbData.swot_data || { strengths: [], weaknesses: [], opportunities: [], threats: [] }
      },
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
      personas: dbData.personas || [],
      performanceTimeData: (dbData.performance_history || []).map((history: any) => ({
        month: history.month,
        year: history.year,
        overall: history.overall_score || 0,
        strategic: history.strategic_score || 0,
        customer: history.customer_score || 0,
        content: history.content_score || 0
      })),
      // Also expose at top level for components that expect them there
      customer_segments: dbData.customer_segments || [],
      customer_journey: dbData.customer_journey || [],
      market_analysis: dbData.market_analysis || null,
      competitors: dbData.competitors || []
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


  /**
   * Safe update method for brand objectives using the new utility
   */
  async safeUpdateBrandObjectives(brandId: string, objectives: any[]): Promise<void> {
    try {
      const result = await safeUpdateRelationalData({
        tableName: 'brand_objectives',
        brandId,
        items: objectives.map((obj, index) => ({
          id: obj.id,
          title: obj.text || obj.title,
          behavioral_change: obj.notes || obj.behavioral_change || obj.behavioralChange,
          target_audience_id: obj.target_audience_id || obj.targetAudienceId || null,
          scenario: obj.scenario || '',
          timeline: obj.timeline || '',
          owner: obj.owner || '',
          kpis: obj.kpis || [],
          status: obj.status || 'active',
          order_index: index
        }))
      });

      console.log('Brand objectives update result:', result);
    } catch (error) {
      console.error('Error in safeUpdateBrandObjectives:', error);
      throw error;
    }
  }

  /**
   * Add a single brand objective
   */
  async addBrandObjective(brandId: string, objective: any): Promise<any> {
    try {
      return await safeAddItem('brand_objectives', brandId, {
        title: objective.text || objective.title || 'New Objective',
        behavioral_change: objective.notes || objective.behavioral_change || objective.behavioralChange || '',
        target_audience_id: objective.target_audience_id || objective.targetAudienceId || null,
        scenario: objective.scenario || '',
        timeline: objective.timeline || '',
        owner: objective.owner || '',
        kpis: objective.kpis || [],
        status: objective.status || 'active'
      });
    } catch (error) {
      console.error('Error adding brand objective:', error);
      throw error;
    }
  }

  /**
   * Update a single brand objective
   */
  async updateSingleBrandObjective(objectiveId: string, updates: any): Promise<void> {
    try {
      const updateData: any = {};
      
      // Map fields that might have different names
      if ('title' in updates || 'text' in updates) updateData.title = updates.title || updates.text;
      if ('behavioral_change' in updates || 'behavioralChange' in updates || 'notes' in updates) {
        updateData.behavioral_change = updates.behavioral_change || updates.behavioralChange || updates.notes;
      }
      if ('target_audience_id' in updates || 'targetAudienceId' in updates) {
        updateData.target_audience_id = updates.target_audience_id || updates.targetAudienceId;
      }
      if ('scenario' in updates) updateData.scenario = updates.scenario;
      if ('timeline' in updates) updateData.timeline = updates.timeline;
      if ('owner' in updates) updateData.owner = updates.owner;
      if ('kpis' in updates) updateData.kpis = updates.kpis;
      if ('status' in updates) updateData.status = updates.status;
      
      await safeUpdateItem('brand_objectives', objectiveId, updateData);
    } catch (error) {
      console.error('Error updating brand objective:', error);
      throw error;
    }
  }

  /**
   * Delete a single brand objective
   */
  async deleteBrandObjective(objectiveId: string): Promise<void> {
    try {
      await safeDeleteItem('brand_objectives', objectiveId);
    } catch (error) {
      console.error('Error deleting brand objective:', error);
      throw error;
    }
  }


  /**
   * Safe update method for brand messages using the new utility
   */
  async safeUpdateBrandMessages(brandId: string, messages: any[]): Promise<void> {
    try {
      const result = await safeUpdateRelationalData({
        tableName: 'brand_messages',
        brandId,
        items: messages.map((msg, index) => ({
          ...msg,
          title: msg.title || `Message ${index + 1}`,
          text: msg.text || msg.quote || '',
          narrative: msg.notes || msg.narrative || '',
          behavioral_change: msg.behavioral_change || msg.behavioralChange || '',
          framing: msg.framing || '',
          order_index: index
        }))
      });

      console.log('Brand messages update result:', result);
    } catch (error) {
      console.error('Error in safeUpdateBrandMessages:', error);
      throw error;
    }
  }

  /**
   * Add a single brand message
   */
  async addBrandMessage(brandId: string, message: any): Promise<any> {
    try {
      return await safeAddItem('brand_messages', brandId, {
        title: message.title || 'New Message',
        text: message.text || message.quote || '',
        narrative: message.notes || message.narrative || '',
        audience_id: message.audience_id || null,
        objective_id: message.objective_id || null,
        behavioral_change: message.behavioral_change || message.behavioralChange || '',
        framing: message.framing || ''
      });
    } catch (error) {
      console.error('Error adding brand message:', error);
      throw error;
    }
  }

  /**
   * Update a single brand message
   */
  async updateSingleBrandMessage(messageId: string, updates: any): Promise<void> {
    try {
      const updateData: any = {};
      
      // Map fields that might have different names
      if ('title' in updates) updateData.title = updates.title;
      if ('text' in updates || 'quote' in updates) updateData.text = updates.text || updates.quote;
      if ('narrative' in updates || 'notes' in updates) updateData.narrative = updates.narrative || updates.notes;
      if ('audience_id' in updates) updateData.audience_id = updates.audience_id;
      if ('objective_id' in updates) updateData.objective_id = updates.objective_id;
      if ('behavioral_change' in updates || 'behavioralChange' in updates) {
        updateData.behavioral_change = updates.behavioral_change || updates.behavioralChange;
      }
      if ('framing' in updates) updateData.framing = updates.framing;
      
      await safeUpdateItem('brand_messages', messageId, updateData);
    } catch (error) {
      console.error('Error updating brand message:', error);
      throw error;
    }
  }

  /**
   * Delete a single brand message
   */
  async deleteBrandMessage(messageId: string): Promise<void> {
    try {
      await safeDeleteItem('brand_messages', messageId);
    } catch (error) {
      console.error('Error deleting brand message:', error);
      throw error;
    }
  }

  /**
   * Update brand voice attributes (JSONB field)
   */
  async updateBrandVoiceAttributes(brandId: string, voiceAttributes: any[]): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .update({ 
        voice_attributes: voiceAttributes,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId);

    if (error) {
      console.error('Error updating voice attributes:', error);
      throw new Error(`Failed to update voice attributes: ${error.message}`);
    }
  }

  /**
   * Brand Style Guide Operations (JSONB)
   */
  async getBrandStyleGuide(brandId: string): Promise<BrandStyleGuide | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('style_guide')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching style guide:', error);
      throw new Error(`Failed to fetch style guide: ${error.message}`);
    }

    return data?.style_guide || null;
  }

  async updateBrandStyleGuide(brandId: string, styleGuide: BrandStyleGuide): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .update({ 
        style_guide: styleGuide,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId);

    if (error) {
      console.error('Error updating style guide:', error);
      throw new Error(`Failed to update style guide: ${error.message}`);
    }
  }

  /**
   * Update brand audiences
   */
  async updateBrandAudiences(brandId: string, audiences: any[]): Promise<void> {
    try {
      // First check if there are existing audiences to delete
      const { data: existingAudiences } = await supabase
        .from('brand_audiences')
        .select('id')
        .eq('brand_id', brandId);

      // Only delete if there are existing audiences
      if (existingAudiences && existingAudiences.length > 0) {
        const { error: deleteError } = await supabase
          .from('brand_audiences')
          .delete()
          .eq('brand_id', brandId);

        if (deleteError) {
          console.error('Error deleting audiences:', deleteError);
          throw new Error(`Failed to delete audiences: ${deleteError.message}`);
        }
      }

      // Then insert new ones
      if (audiences.length > 0) {
        const audiencesToInsert = audiences.map((audience, index) => ({
          brand_id: brandId,
          name: audience.text || audience.name,
          notes: audience.notes,
          demographics: audience.demographics || {},
          order_index: index
        }));

        const { error } = await supabase
          .from('brand_audiences')
          .insert(audiencesToInsert);

        if (error) {
          console.error('Error inserting audiences:', error);
          throw new Error(`Failed to insert audiences: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error updating audiences:', error);
      throw error;
    }
  }

  /**
   * Update brand strategies
   */
  async updateBrandStrategies(brandId: string, strategies: any[]): Promise<void> {
    try {
      // First check if there are existing strategies to delete
      const { data: existingStrategies } = await supabase
        .from('brand_strategies')
        .select('id')
        .eq('brand_id', brandId);

      // Only delete if there are existing strategies
      if (existingStrategies && existingStrategies.length > 0) {
        const { error: deleteError } = await supabase
          .from('brand_strategies')
          .delete()
          .eq('brand_id', brandId);

        if (deleteError) {
          console.error('Error deleting strategies:', deleteError);
          throw new Error(`Failed to delete strategies: ${deleteError.message}`);
        }
      }

      // Then insert new ones
      if (strategies.length > 0) {
        // Don't include ID - let database generate it
        const strategiesToInsert = strategies.map((strategy) => ({
          brand_id: brandId,
          name: strategy.name,
          description: strategy.description || '',
          score: strategy.score || 0,
          status: strategy.status || 'active'
        }));

        const { error } = await supabase
          .from('brand_strategies')
          .insert(strategiesToInsert);

        if (error) {
          console.error('Error inserting strategies:', error);
          // Check if it's a unique constraint violation
          if (error.code === '23505') {
            throw new Error('Duplicate strategy detected. Please refresh and try again.');
          }
          throw new Error(`Failed to insert strategies: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error updating strategies:', error);
      throw error;
    }
  }

  /**
   * Update brand personas (JSONB field)
   */
  async updateBrandPersonas(brandId: string, personas: any[]): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .update({ 
        personas,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId);

    if (error) {
      console.error('Error updating personas:', error);
      throw new Error(`Failed to update personas: ${error.message}`);
    }
  }

  /**
   * Update brand customer segments (JSONB field)
   */
  async updateBrandCustomerSegments(brandId: string, customerSegments: any[]): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .update({ 
        customer_segments: customerSegments,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId);

    if (error) {
      console.error('Error updating customer segments:', error);
      throw new Error(`Failed to update customer segments: ${error.message}`);
    }
  }

  /**
   * Update brand customer journey (JSONB field)
   */
  async updateBrandCustomerJourney(brandId: string, customerJourney: any[]): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .update({ 
        customer_journey: customerJourney,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId);

    if (error) {
      console.error('Error updating customer journey:', error);
      throw new Error(`Failed to update customer journey: ${error.message}`);
    }
  }


  /**
   * Update market analysis for a brand
   */
  async updateMarketAnalysis(brandId: string, marketAnalysis: BrandMarketAnalysis): Promise<void> {
    console.log('updateMarketAnalysis called with:', { brandId, marketAnalysis });
    
    const { error } = await supabase
      .from('brands')
      .update({
        market_analysis: marketAnalysis,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId);

    if (error) {
      console.error('Error updating market analysis:', error);
      throw new Error(`Failed to update market analysis: ${error.message}`);
    }
  }


  /**
   * Safe update method for competitors using the new utility
   */
  async safeUpdateCompetitors(brandId: string, competitors: BrandCompetitor[]): Promise<void> {
    try {
      const result = await safeUpdateRelationalData({
        tableName: 'brand_competitors',
        brandId,
        items: competitors.map((comp, index) => ({
          id: comp.id,
          name: comp.name || '',
          strengths: comp.strengths || [],
          weaknesses: comp.weaknesses || [],
          market_share: comp.market_share || comp.marketShare || 0,
          unique_selling_points: comp.unique_selling_points || comp.uniqueSellingPoints || [],
          order_index: index
        }))
      });

      console.log('Competitors update result:', result);
    } catch (error) {
      console.error('Error in safeUpdateCompetitors:', error);
      throw error;
    }
  }

  /**
   * Add a single competitor
   */
  async addCompetitor(brandId: string, competitor: BrandCompetitor): Promise<any> {
    try {
      return await safeAddItem('brand_competitors', brandId, {
        name: competitor.name || 'New Competitor',
        strengths: competitor.strengths || [],
        weaknesses: competitor.weaknesses || [],
        market_share: competitor.market_share || competitor.marketShare || 0,
        unique_selling_points: competitor.unique_selling_points || competitor.uniqueSellingPoints || []
      });
    } catch (error) {
      console.error('Error adding competitor:', error);
      throw error;
    }
  }

  /**
   * Update a single competitor
   */
  async updateSingleCompetitor(competitorId: string, updates: Partial<BrandCompetitor>): Promise<void> {
    try {
      const updateData: any = {};
      
      if ('name' in updates) updateData.name = updates.name;
      if ('strengths' in updates) updateData.strengths = updates.strengths;
      if ('weaknesses' in updates) updateData.weaknesses = updates.weaknesses;
      if ('market_share' in updates || 'marketShare' in updates) {
        updateData.market_share = updates.market_share || updates.marketShare;
      }
      if ('unique_selling_points' in updates || 'uniqueSellingPoints' in updates) {
        updateData.unique_selling_points = updates.unique_selling_points || updates.uniqueSellingPoints;
      }
      
      await safeUpdateItem('brand_competitors', competitorId, updateData);
    } catch (error) {
      console.error('Error updating competitor:', error);
      throw error;
    }
  }

  /**
   * Delete a single competitor
   */
  async deleteCompetitor(competitorId: string): Promise<void> {
    try {
      await safeDeleteItem('brand_competitors', competitorId);
    } catch (error) {
      console.error('Error deleting competitor:', error);
      throw error;
    }
  }

  /**
   * Update qualitative profiles for all competitors of a brand
   * This updates the qualitative_profiles JSONB field for each competitor
   */
  async updateCompetitorQualitativeProfiles(
    brandId: string, 
    profiles: Array<{
      competitorId: string;
      qualitativeProfiles: Record<string, string>;
    }>
  ): Promise<void> {
    try {
      // Update each competitor's qualitative profiles
      const updatePromises = profiles.map(({ competitorId, qualitativeProfiles }) => 
        supabase
          .from('brand_competitors')
          .update({ 
            qualitative_profiles: qualitativeProfiles,
            updated_at: new Date().toISOString()
          })
          .eq('id', competitorId)
          .eq('brand_id', brandId) // Extra safety check
      );

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Errors updating qualitative profiles:', errors);
        throw new Error('Failed to update some competitor qualitative profiles');
      }
    } catch (error) {
      console.error('Error updating competitor qualitative profiles:', error);
      throw error;
    }
  }

  /**
   * Update qualitative profile for a single competitor
   */
  async updateSingleCompetitorQualitativeProfile(
    competitorId: string, 
    qualitativeProfiles: Record<string, string>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('brand_competitors')
        .update({ 
          qualitative_profiles: qualitativeProfiles,
          updated_at: new Date().toISOString()
        })
        .eq('id', competitorId);

      if (error) {
        console.error('Error updating competitor qualitative profile:', error);
        throw new Error(`Failed to update qualitative profile: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating competitor qualitative profile:', error);
      throw error;
    }
  }

  /**
   * Add a new characteristic to all competitors of a brand
   * This adds a new key-value pair to the qualitative_profiles JSONB for all competitors
   */
  async addCharacteristicToAllCompetitors(
    brandId: string, 
    characteristicName: string, 
    defaultValue: string = 'Not Assessed'
  ): Promise<void> {
    try {
      // First get all competitors for this brand
      const { data: competitors, error: fetchError } = await supabase
        .from('brand_competitors')
        .select('id, qualitative_profiles')
        .eq('brand_id', brandId);

      if (fetchError) {
        throw new Error(`Failed to fetch competitors: ${fetchError.message}`);
      }

      if (!competitors || competitors.length === 0) {
        return; // No competitors to update
      }

      // Update each competitor's qualitative profiles with the new characteristic
      const updatePromises = competitors.map(competitor => {
        const updatedProfiles = {
          ...(competitor.qualitative_profiles || {}),
          [characteristicName]: defaultValue
        };

        return supabase
          .from('brand_competitors')
          .update({ 
            qualitative_profiles: updatedProfiles,
            updated_at: new Date().toISOString()
          })
          .eq('id', competitor.id);
      });

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Errors adding characteristic:', errors);
        throw new Error('Failed to add characteristic to some competitors');
      }
    } catch (error) {
      console.error('Error adding characteristic to competitors:', error);
      throw error;
    }
  }

  /**
   * Update brand basic information
   */
  async updateBrandBasicInfo(brandId: string, updates: {
    name?: string;
    business_area?: string;
    region?: string;
  }): Promise<void> {
    try {
      // Update fields in brands table (only name and business_area)
      const brandUpdates: any = {
        updated_at: new Date().toISOString()
      };
      
      if ('name' in updates && updates.name !== undefined) {
        brandUpdates.name = updates.name;
      }
      if ('business_area' in updates && updates.business_area !== undefined) {
        brandUpdates.business_area = updates.business_area;
      }
      
      // Only update if there are fields to update
      if (Object.keys(brandUpdates).length > 1) { // More than just updated_at
        const { error } = await supabase
          .from('brands')
          .update(brandUpdates)
          .eq('id', brandId);

        if (error) {
          throw new Error(`Failed to update brand info: ${error.message}`);
        }
      }

      // Handle region update in brand_regions table
      if ('region' in updates && updates.region !== undefined) {
        // Check if a primary region exists
        const { data: existingRegion } = await supabase
          .from('brand_regions')
          .select('id')
          .eq('brand_id', brandId)
          .eq('is_primary', true)
          .single();

        if (existingRegion) {
          // Update existing primary region
          const { error: regionError } = await supabase
            .from('brand_regions')
            .update({
              region: updates.region
            })
            .eq('brand_id', brandId)
            .eq('is_primary', true);

          if (regionError) {
            throw new Error(`Failed to update region: ${regionError.message}`);
          }
        } else {
          // Insert new primary region
          const { error: regionError } = await supabase
            .from('brand_regions')
            .insert({
              brand_id: brandId,
              region: updates.region,
              is_primary: true
            });

          if (regionError) {
            throw new Error(`Failed to insert region: ${regionError.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error updating brand basic info:', error);
      throw error;
    }
  }

  /**
   * Update brand financial data in brand_financials table
   */
  async updateBrandFinancials(brandId: string, financials: {
    annualSales?: string;
    targetSales?: string;
    growth?: string;
  }): Promise<void> {
    try {
      const currentYear = new Date().getFullYear();
      
      // Parse growth percentage from string (e.g., "15%" -> 15)
      const growthPercentage = financials.growth 
        ? parseFloat(financials.growth.replace('%', '')) 
        : null;

      // Check if financial record exists for current year
      const { data: existing } = await supabase
        .from('brand_financials')
        .select('id')
        .eq('brand_id', brandId)
        .eq('year', currentYear)
        .single();

      if (existing) {
        // Update existing record
        const updateData: any = {
          updated_at: new Date().toISOString()
        };
        
        if (financials.annualSales !== undefined) updateData.annual_sales = financials.annualSales;
        if (financials.targetSales !== undefined) updateData.target_sales = financials.targetSales;
        if (growthPercentage !== null) updateData.growth_percentage = growthPercentage;

        const { error } = await supabase
          .from('brand_financials')
          .update(updateData)
          .eq('brand_id', brandId)
          .eq('year', currentYear);

        if (error) {
          throw new Error(`Failed to update financials: ${error.message}`);
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('brand_financials')
          .insert({
            brand_id: brandId,
            year: currentYear,
            annual_sales: financials.annualSales || '$0',
            target_sales: financials.targetSales || '$0',
            growth_percentage: growthPercentage || 0
          });

        if (error) {
          throw new Error(`Failed to insert financials: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error updating brand financials:', error);
      throw error;
    }
  }

  /**
   * Campaign CRUD Operations
   */
  
  /**
   * Add a new campaign
   */
  async addCampaign(brandId: string, campaign: Partial<Campaign>): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('brand_campaigns')
        .insert({
          brand_id: brandId,
          name: campaign.name || 'New Campaign',
          status: campaign.status || 'planned',
          timeframe: campaign.timeframe || '',
          strategic_objective: campaign.strategicObjective || '',
          audience: campaign.audience || '',
          campaign_details: campaign.campaignDetails || '',
          budget: campaign.budget || 0,
          overall_score: campaign.scores?.overall || 0,
          strategic_score: campaign.scores?.strategic || 0,
          customer_score: campaign.scores?.customer || 0,
          execution_score: campaign.scores?.execution || 0,
          agencies: campaign.agencies || [],
          key_actions: campaign.keyActions || []
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add campaign: ${error.message}`);
      }

      // Transform database response to Campaign interface
      return this.transformDatabaseCampaign(data);
    } catch (error) {
      console.error('Error adding campaign:', error);
      throw error;
    }
  }

  /**
   * Update an existing campaign
   */
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map Campaign interface fields to database columns
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.timeframe !== undefined) updateData.timeframe = updates.timeframe;
      if (updates.strategicObjective !== undefined) updateData.strategic_objective = updates.strategicObjective;
      if (updates.audience !== undefined) updateData.audience = updates.audience;
      if (updates.campaignDetails !== undefined) updateData.campaign_details = updates.campaignDetails;
      if (updates.budget !== undefined) updateData.budget = updates.budget;
      if (updates.agencies !== undefined) updateData.agencies = updates.agencies;
      if (updates.keyActions !== undefined) updateData.key_actions = updates.keyActions;
      
      // Handle scores object
      if (updates.scores) {
        if (updates.scores.overall !== undefined) updateData.overall_score = updates.scores.overall;
        if (updates.scores.strategic !== undefined) updateData.strategic_score = updates.scores.strategic;
        if (updates.scores.customer !== undefined) updateData.customer_score = updates.scores.customer;
        if (updates.scores.execution !== undefined) updateData.execution_score = updates.scores.execution;
      }

      const { error } = await supabase
        .from('brand_campaigns')
        .update(updateData)
        .eq('id', campaignId);

      if (error) {
        throw new Error(`Failed to update campaign: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  /**
   * Check if a campaign has associated content
   */
  async getCampaignContentCount(campaignId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('brand_content')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId);

      if (error) {
        throw new Error(`Failed to check campaign content: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('Error checking campaign content:', error);
      throw error;
    }
  }

  /**
   * Delete a campaign (soft delete)
   */
  async deleteCampaign(campaignId: string, forceDelete: boolean = false): Promise<{ hasContent: boolean; contentCount: number }> {
    try {
      // First check if campaign has content
      const contentCount = await this.getCampaignContentCount(campaignId);

      // If campaign has content and force delete is not set, return the count
      if (contentCount > 0 && !forceDelete) {
        return { hasContent: true, contentCount };
      }

      // Soft delete the campaign
      const { error } = await supabase
        .from('brand_campaigns')
        .update({ 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)
        .is('deleted_at', null); // Only delete if not already deleted

      if (error) {
        throw new Error(`Failed to delete campaign: ${error.message}`);
      }

      return { hasContent: false, contentCount: 0 };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  /**
   * Transform database campaign to Campaign interface
   */
  private transformDatabaseCampaign(dbCampaign: any): Campaign {
    return {
      id: dbCampaign.id,
      name: dbCampaign.name,
      scores: {
        overall: dbCampaign.overall_score || 0,
        strategic: dbCampaign.strategic_score || 0,
        customer: dbCampaign.customer_score || 0,
        execution: dbCampaign.execution_score || 0
      },
      status: dbCampaign.status || 'planned',
      timeframe: dbCampaign.timeframe || '',
      strategicObjective: dbCampaign.strategic_objective || '',
      audience: dbCampaign.audience || '',
      keyActions: dbCampaign.key_actions || [],
      campaignDetails: dbCampaign.campaign_details || '',
      agencies: dbCampaign.agencies || [],
      budget: dbCampaign.budget || 0
    };
  }

  /**
   * Get brand audiences
   */
  async getBrandAudiences(brandId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('brand_audiences')
        .select('*')
        .eq('brand_id', brandId)
        .order('order_index');

      if (error) {
        console.error('Error fetching brand audiences:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBrandAudiences:', error);
      throw error;
    }
  }

  /**
   * Get brand strategies
   */
  async getBrandStrategies(brandId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('brand_strategies')
        .select('*')
        .eq('brand_id', brandId)
        .order('order_index');

      if (error) {
        console.error('Error fetching brand strategies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBrandStrategies:', error);
      throw error;
    }
  }

  /**
   * Get content scores for a specific content item
   */
  async getContentScores(contentId: number): Promise<Score[]> {
    try {
      // First get the content review for this content
      const { data: reviewData, error: reviewError } = await supabase
        .from('content_reviews')
        .select('id')
        .eq('content_id', contentId)
        .order('reviewed_at', { ascending: false })
        .limit(1)
        .single();

      if (reviewError || !reviewData) {
        console.log('No content review found for content:', contentId);
        return [];
      }

      // Then get all scores for this review
      const { data: scoresData, error: scoresError } = await supabase
        .from('scores')
        .select('*')
        .eq('content_review_id', reviewData.id);

      if (scoresError) {
        console.error('Error fetching content scores:', scoresError);
        throw scoresError;
      }

      return scoresData || [];
    } catch (error) {
      console.error('Error in getContentScores:', error);
      return [];
    }
  }

  /**
   * Get all content for a brand
   */
  async getBrandContentBySlug(brandSlug: string): Promise<BrandContent[]> {
    try {
      const brand = await this.getBrandBySlug(brandSlug);
      if (!brand) {
        console.error('Brand not found:', brandSlug);
        return [];
      }

      const { data, error } = await supabase
        .from('brand_content')
        .select(`
          *,
          content:content_id (
            id,
            content_objectives,
            funnel_alignment,
            expiry_date,
            created_at: created_at,
            updated_at: updated_at,
            campaign_id,
            audience_id,
            strategy_id
          )
        `)
        .eq('brand_id', brand.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching brand content:', error);
        throw error;
      }

      // Fetch all campaigns, audiences, and strategies for this brand for efficient lookup
      const [campaigns, audiences, strategies] = await Promise.all([
        this.getCampaigns(brand.id),
        this.getBrandAudiences(brand.id),
        this.getBrandStrategies(brand.id)
      ]);

      // Create lookup maps for efficient access
      const campaignMap = new Map(campaigns.map(c => [c.id, c]));
      const audienceMap = new Map(audiences.map(a => [a.id, a]));
      const strategyMap = new Map(strategies.map(s => [s.id, s]));

      // Transform content and fetch scores for each item
      const transformedContent = await Promise.all((data || []).map(async item => {
        const transformed = this.transformDatabaseContent(item, campaignMap, audienceMap, strategyMap);
        
        // If we have a content_id, fetch the scores
        if (item.content_id) {
          const scores = await this.getContentScores(item.content_id);
          transformed.scores = scores;
          
          // Extract characteristics and areas to improve
          transformed.characteristics = scores.filter(s => s.check_sub_category === 'Characteristics');
          transformed.areasToImprove = scores.filter(s => 
            s.fix_recommendation && 
            s.score_value < 80
          );
        }
        
        return transformed;
      }));

      return transformedContent;
    } catch (error) {
      console.error('Error in getBrandContentBySlug:', error);
      throw error;
    }
  }

  /**
   * Add new content to a brand
   */
  async addBrandContent(brandId: string, content: Partial<BrandContent>): Promise<BrandContent> {
    try {
      const { data, error } = await supabase
        .from('brand_content')
        .insert({
          brand_id: brandId,
          campaign_id: content.campaignId,
          content_id: content.contentId,
          name: content.name,
          format: content.format,
          type: content.type,
          status: content.status || 'pending',
          description: content.description,
          quality_score: content.qualityScore || 0,
          cost: content.cost || 0,
          audience: content.audience,
          key_actions: content.keyActions || [],
          agencies: content.agencies || [],
          overall_score: content.overallScore || 0,
          strategic_score: content.strategicScore || 0,
          customer_score: content.customerScore || 0,
          execution_score: content.executionScore || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding brand content:', error);
        throw error;
      }

      return this.transformDatabaseContent(data);
    } catch (error) {
      console.error('Error in addBrandContent:', error);
      throw error;
    }
  }

  /**
   * Update existing content
   */
  async updateBrandContent(contentId: string, updates: Partial<BrandContent>): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map the BrandContent interface fields to database columns
      if (updates.campaignId !== undefined) updateData.campaign_id = updates.campaignId;
      if (updates.contentId !== undefined) updateData.content_id = updates.contentId;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.format !== undefined) updateData.format = updates.format;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.qualityScore !== undefined) updateData.quality_score = updates.qualityScore;
      if (updates.cost !== undefined) updateData.cost = updates.cost;
      if (updates.audience !== undefined) updateData.audience = updates.audience;
      if (updates.keyActions !== undefined) updateData.key_actions = updates.keyActions;
      if (updates.agencies !== undefined) updateData.agencies = updates.agencies;
      if (updates.overallScore !== undefined) updateData.overall_score = updates.overallScore;
      if (updates.strategicScore !== undefined) updateData.strategic_score = updates.strategicScore;
      if (updates.customerScore !== undefined) updateData.customer_score = updates.customerScore;
      if (updates.executionScore !== undefined) updateData.execution_score = updates.executionScore;

      const { error } = await supabase
        .from('brand_content')
        .update(updateData)
        .eq('id', contentId);

      if (error) {
        console.error('Error updating brand content:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateBrandContent:', error);
      throw error;
    }
  }

  /**
   * Delete content (soft delete)
   */
  async deleteBrandContent(contentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('brand_content')
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) {
        console.error('Error deleting brand content:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteBrandContent:', error);
      throw error;
    }
  }

  /**
   * Transform database content to BrandContent interface
   */
  private transformDatabaseContent(
    dbContent: any, 
    campaignMap?: Map<string, any>,
    audienceMap?: Map<string, any>,
    strategyMap?: Map<string, any>
  ): BrandContent {
    // Get related data from maps if content table join exists
    let campaignName = '';
    let audienceName = '';
    let strategyName = '';
    
    if (dbContent.content) {
      // Look up campaign name from campaign_id
      if (dbContent.content.campaign_id && campaignMap) {
        const campaign = campaignMap.get(dbContent.content.campaign_id);
        campaignName = campaign?.name || '';
      }
      
      // Look up audience name from audience_id
      if (dbContent.content.audience_id && audienceMap) {
        const audience = audienceMap.get(dbContent.content.audience_id);
        audienceName = audience?.name || '';
      }
      
      // Look up strategy name from strategy_id
      if (dbContent.content.strategy_id && strategyMap) {
        const strategy = strategyMap.get(dbContent.content.strategy_id);
        strategyName = strategy?.name || '';
      }
    }

    return {
      id: dbContent.id,
      campaignId: dbContent.campaign_id,
      contentId: dbContent.content_id,
      name: dbContent.name,
      format: dbContent.format,
      type: dbContent.type,
      status: dbContent.status || 'pending',
      description: dbContent.description,
      qualityScore: dbContent.quality_score || 0,
      cost: dbContent.cost || 0,
      audience: dbContent.audience || audienceName, // Use audience from brand_content or from lookup
      keyActions: dbContent.key_actions || [],
      agencies: dbContent.agencies || [],
      overallScore: dbContent.overall_score || 0,
      strategicScore: dbContent.strategic_score || 0,
      customerScore: dbContent.customer_score || 0,
      executionScore: dbContent.execution_score || 0,
      // Include fields from the joined content table with proper lookups
      contentObjectives: dbContent.content?.content_objectives,
      strategyAlignedTo: strategyName,
      campaignAlignedTo: campaignName,
      funnelAlignment: dbContent.content?.funnel_alignment,
      expiryDate: dbContent.content?.expiry_date,
      agency: dbContent.agencies && dbContent.agencies[0], // Use agencies array from brand_content
      // Add timestamps
      createdAt: dbContent.content?.created_at || dbContent.created_at,
      updatedAt: dbContent.content?.updated_at || dbContent.updated_at
    };
  }
}

export const brandService = new BrandService();