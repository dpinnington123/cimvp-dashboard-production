-- Migration: Update brand_full_data view to include new tables
-- Description: Updates the brand_full_data view to include market analysis, customer data, personas, content, and performance metrics
-- Created: 2025-06-14

-- Drop the existing view
DROP VIEW IF EXISTS brand_full_data;

-- Create the enhanced view with all brand data
CREATE VIEW brand_full_data AS
SELECT 
  b.id,
  b.slug,
  b.name,
  b.business_area,
  b.client_id,
  b.created_at,
  b.updated_at,
  
  -- Regions as JSON array
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'region', br.region,
        'is_primary', br.is_primary
      ) 
    ) FILTER (WHERE br.region IS NOT NULL), 
    '[]'::json
  ) AS regions,
  
  -- Financials as JSON object
  COALESCE(
    (
      SELECT jsonb_build_object(
        'annual_sales', bf.annual_sales,
        'target_sales', bf.target_sales,
        'growth_percentage', bf.growth_percentage,
        'year', bf.year
      )
      FROM brand_financials bf
      WHERE bf.brand_id = b.id
      ORDER BY bf.year DESC
      LIMIT 1
    ),
    '{}'::jsonb
  ) AS financials,
  
  -- Voice attributes as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bva.id,
          'title', bva.title,
          'description', bva.description
        ) ORDER BY bva.order_index
      )
      FROM brand_voice_attributes bva
      WHERE bva.brand_id = b.id
    ),
    '[]'::json
  ) AS voice_attributes,
  
  -- Objectives as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bo.id,
          'text', bo.text,
          'notes', bo.notes,
          'status', bo.status
        ) ORDER BY bo.order_index
      )
      FROM brand_objectives bo
      WHERE bo.brand_id = b.id
    ),
    '[]'::json
  ) AS objectives,
  
  -- Messages as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bm.id,
          'text', bm.text,
          'notes', bm.notes
        ) ORDER BY bm.order_index
      )
      FROM brand_messages bm
      WHERE bm.brand_id = b.id
    ),
    '[]'::json
  ) AS messages,
  
  -- Audiences as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', ba.id,
          'name', ba.name,
          'notes', ba.notes,
          'demographics', ba.demographics
        ) ORDER BY ba.order_index
      )
      FROM brand_audiences ba
      WHERE ba.brand_id = b.id
    ),
    '[]'::json
  ) AS audiences,
  
  -- Strategies as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bs.id,
          'name', bs.name,
          'description', bs.description,
          'score', bs.score,
          'status', bs.status
        ) ORDER BY bs.created_at
      )
      FROM brand_strategies bs
      WHERE bs.brand_id = b.id
    ),
    '[]'::json
  ) AS strategies,
  
  -- Campaigns as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bc.id,
          'name', bc.name,
          'status', bc.status,
          'timeframe', bc.timeframe,
          'strategic_objective', bc.strategic_objective,
          'audience', bc.audience,
          'campaign_details', bc.campaign_details,
          'budget', bc.budget,
          'overall_score', bc.overall_score,
          'strategic_score', bc.strategic_score,
          'customer_score', bc.customer_score,
          'execution_score', bc.execution_score
        ) ORDER BY bc.created_at
      )
      FROM brand_campaigns bc
      WHERE bc.brand_id = b.id
    ),
    '[]'::json
  ) AS campaigns,
  
  -- Market Analysis as JSON object
  COALESCE(
    (
      SELECT jsonb_build_object(
        'market_size', bma.market_size,
        'growth_rate', bma.growth_rate,
        'analysis_year', bma.analysis_year
      )
      FROM brand_market_analysis bma
      WHERE bma.brand_id = b.id
      ORDER BY bma.analysis_year DESC
      LIMIT 1
    ),
    '{}'::jsonb
  ) AS market_analysis,
  
  -- Competitors as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bc.id,
          'name', bc.name,
          'market_share', bc.market_share,
          'strengths', bc.strengths,
          'weaknesses', bc.weaknesses
        ) ORDER BY bc.order_index
      )
      FROM brand_competitors bc
      WHERE bc.brand_id = b.id
    ),
    '[]'::json
  ) AS competitors,
  
  -- SWOT as JSON object
  COALESCE(
    (
      SELECT jsonb_build_object(
        'strengths', bs.strengths,
        'weaknesses', bs.weaknesses,
        'opportunities', bs.opportunities,
        'threats', bs.threats
      )
      FROM brand_swot bs
      WHERE bs.brand_id = b.id
      LIMIT 1
    ),
    '{}'::jsonb
  ) AS swot,
  
  -- Customer Segments as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bcs.id,
          'name', bcs.name,
          'size_percentage', bcs.size_percentage,
          'description', bcs.description,
          'needs', bcs.needs,
          'pain_points', bcs.pain_points
        ) ORDER BY bcs.order_index
      )
      FROM brand_customer_segments bcs
      WHERE bcs.brand_id = b.id
    ),
    '[]'::json
  ) AS customer_segments,
  
  -- Customer Journey as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bcj.id,
          'stage', bcj.stage,
          'touchpoints', bcj.touchpoints,
          'opportunities', bcj.opportunities
        ) ORDER BY bcj.order_index
      )
      FROM brand_customer_journey bcj
      WHERE bcj.brand_id = b.id
    ),
    '[]'::json
  ) AS customer_journey,
  
  -- Personas as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bp.id,
          'name', bp.name,
          'description', bp.description,
          'icon', bp.icon,
          'overall_score', bp.overall_score,
          'strategic_score', bp.strategic_score,
          'customer_score', bp.customer_score,
          'execution_score', bp.execution_score
        ) ORDER BY bp.order_index
      )
      FROM brand_personas bp
      WHERE bp.brand_id = b.id
    ),
    '[]'::json
  ) AS personas,
  
  -- Content as JSON array (limited to 50 for performance)
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'id', bc.id,
          'content_id', bc.content_id,
          'campaign_id', bc.campaign_id,
          'name', bc.name,
          'format', bc.format,
          'type', bc.type,
          'status', bc.status,
          'description', bc.description,
          'quality_score', bc.quality_score,
          'cost', bc.cost,
          'audience', bc.audience,
          'key_actions', bc.key_actions,
          'agencies', bc.agencies,
          'overall_score', bc.overall_score,
          'strategic_score', bc.strategic_score,
          'customer_score', bc.customer_score,
          'execution_score', bc.execution_score,
          'campaign_overall_effectiveness', bc.campaign_overall_effectiveness,
          'campaign_strategic_alignment', bc.campaign_strategic_alignment,
          'campaign_customer_alignment', bc.campaign_customer_alignment,
          'campaign_content_effectiveness', bc.campaign_content_effectiveness
        ) ORDER BY bc.created_at DESC
      )
      FROM brand_content bc
      WHERE bc.brand_id = b.id
      LIMIT 50
    ),
    '[]'::json
  ) AS content,
  
  -- Overall Scores as JSON object
  COALESCE(
    (
      SELECT jsonb_build_object(
        'overall_score', bos.overall_score,
        'strategic_score', bos.strategic_score,
        'customer_score', bos.customer_score,
        'content_score', bos.content_score
      )
      FROM brand_overall_scores bos
      WHERE bos.brand_id = b.id
      ORDER BY bos.created_at DESC
      LIMIT 1
    ),
    '{}'::jsonb
  ) AS overall_scores,
  
  -- Channel Scores as JSON object
  COALESCE(
    (
      SELECT jsonb_object_agg(
        bcs.channel,
        jsonb_build_object(
          'overall_score', bcs.overall_score,
          'strategic_score', bcs.strategic_score,
          'customer_score', bcs.customer_score,
          'execution_score', bcs.execution_score
        )
      )
      FROM brand_channel_scores bcs
      WHERE bcs.brand_id = b.id
    ),
    '{}'::jsonb
  ) AS channel_scores,
  
  -- Funnel Data as JSON array
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'stage_name', bfd.stage_name,
          'value', bfd.value
        ) ORDER BY bfd.order_index
      )
      FROM brand_funnel_data bfd
      WHERE bfd.brand_id = b.id
    ),
    '[]'::json
  ) AS funnel_data,
  
  -- Performance History as JSON array (last 12 months)
  COALESCE(
    (
      SELECT json_agg(
        jsonb_build_object(
          'month', month,
          'year', year,
          'overall_score', overall_score,
          'strategic_score', strategic_score,
          'customer_score', customer_score,
          'content_score', content_score
        )
      )
      FROM (
        SELECT bph.month, bph.year, bph.overall_score, bph.strategic_score, bph.customer_score, bph.content_score
        FROM brand_performance_history bph
        WHERE bph.brand_id = b.id
        ORDER BY bph.year DESC, 
          CASE bph.month
            WHEN 'Jan' THEN 1 WHEN 'Feb' THEN 2 WHEN 'Mar' THEN 3
            WHEN 'Apr' THEN 4 WHEN 'May' THEN 5 WHEN 'Jun' THEN 6
            WHEN 'Jul' THEN 7 WHEN 'Aug' THEN 8 WHEN 'Sep' THEN 9
            WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 WHEN 'Dec' THEN 12
          END DESC
        LIMIT 12
      ) AS performance_history_ordered
    ),
    '[]'::json
  ) AS performance_history

FROM brands b
LEFT JOIN brand_regions br ON b.id = br.brand_id
GROUP BY b.id;

-- Grant appropriate permissions
GRANT SELECT ON brand_full_data TO authenticated;
GRANT SELECT ON brand_full_data TO anon;