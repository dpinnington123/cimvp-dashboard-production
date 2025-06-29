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
      customer_journey: dbData.customer_journey || []
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
   * Update brand objectives (now uses brand_objectives table)
   */
  async updateBrandObjectives(brandId: string, objectives: any[]): Promise<void> {
    try {
      // First check if there are existing objectives to delete
      const { data: existingObjectives } = await supabase
        .from('brand_objectives')
        .select('id')
        .eq('brand_id', brandId);

      // Only delete if there are existing objectives
      if (existingObjectives && existingObjectives.length > 0) {
        const { error: deleteError } = await supabase
          .from('brand_objectives')
          .delete()
          .eq('brand_id', brandId);

        if (deleteError) {
          console.error('Error deleting objectives:', deleteError);
          throw new Error(`Failed to delete objectives: ${deleteError.message}`);
        }
      }

      // Then insert new ones
      if (objectives.length > 0) {
        const objectivesToInsert = objectives.map((objective, index) => ({
          brand_id: brandId,
          title: objective.text || objective.title,
          behavioral_change: objective.notes || objective.behavioral_change || objective.behavioralChange,
          target_audience_id: objective.target_audience_id,
          scenario: objective.scenario,
          timeline: objective.timeline,
          owner: objective.owner,
          kpis: objective.kpis || [],
          status: objective.status || 'active',
          order_index: objective.order_index !== undefined ? objective.order_index : index
        }));

        const { error } = await supabase
          .from('brand_objectives')
          .insert(objectivesToInsert);

        if (error) {
          console.error('Error inserting objectives:', error);
          throw new Error(`Failed to insert objectives: ${error.message}`);
        }
      }

      // JSONB field no longer used - objectives are now in separate table
        
    } catch (error) {
      console.error('Error updating objectives:', error);
      throw error;
    }
  }

  /**
   * Update brand messages (now in separate table)
   */
  async updateBrandMessages(brandId: string, messages: any[]): Promise<void> {
    try {
      // First, delete existing messages
      const { error: deleteError } = await supabase
        .from('brand_messages')
        .delete()
        .eq('brand_id', brandId);

      if (deleteError) {
        console.error('Error deleting messages:', deleteError);
        throw new Error(`Failed to delete messages: ${deleteError.message}`);
      }

      // Then insert new ones if there are any
      if (messages.length > 0) {
        const messagesToInsert = messages.map((message, index) => ({
          id: message.id || undefined, // Let DB generate if not provided
          brand_id: brandId,
          title: message.title || `Message ${index + 1}`,
          text: message.text || message.quote || '',
          narrative: message.notes || message.narrative || '',
          audience_id: message.audience_id || null,
          objective_id: message.objective_id || null,
          behavioral_change: message.behavioral_change || message.behavioralChange || '',
          framing: message.framing || '',
          order_index: message.order_index !== undefined ? message.order_index : index
        }));

        const { error } = await supabase
          .from('brand_messages')
          .insert(messagesToInsert);

        if (error) {
          console.error('Error inserting messages:', error);
          throw new Error(`Failed to insert messages: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error updating messages:', error);
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
   * Update brand financials
   */
  async updateBrandFinancials(brandId: string, financials: {
    annualSales: string;
    targetSales: string; 
    growthPercentage: number;
  }): Promise<void> {
    const currentYear = new Date().getFullYear();
    
    const { error } = await supabase
      .from('brand_financials')
      .upsert({
        brand_id: brandId,
        year: currentYear,
        annual_sales: financials.annualSales,
        target_sales: financials.targetSales,
        growth_percentage: financials.growthPercentage,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'brand_id,year'
      });

    if (error) {
      console.error('Error updating financials:', error);
      throw new Error(`Failed to update financials: ${error.message}`);
    }
  }
}

export const brandService = new BrandService();