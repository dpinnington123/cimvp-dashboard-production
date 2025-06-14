-- Create brand_full_data view for efficient brand data retrieval
-- This view joins all brand-related tables for optimal performance in the CIMVP Dashboard

CREATE OR REPLACE VIEW brand_full_data AS
SELECT 
  b.id,
  b.slug,
  b.name,
  b.business_area,
  b.created_at,
  b.updated_at,
  
  -- Primary region
  br.region as primary_region,
  
  -- Financial data as JSON object
  CASE 
    WHEN bf.id IS NOT NULL THEN
      jsonb_build_object(
        'annual_sales', bf.annual_sales,
        'target_sales', bf.target_sales,
        'growth_percentage', bf.growth_percentage,
        'year', bf.year
      )
    ELSE NULL
  END as financials,
  
  -- Voice attributes as JSON array (ordered)
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
  ) as voice,
  
  -- Objectives as JSON array (ordered)
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
  ) as objectives,
  
  -- Messages as JSON array (ordered)
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
  ) as messages,
  
  -- Audiences as JSON array (ordered)
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
  ) as audiences,
  
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
        ) ORDER BY bs.name
      )
      FROM brand_strategies bs 
      WHERE bs.brand_id = b.id
    ),
    '[]'::json
  ) as strategies,
  
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
        ) ORDER BY bc.created_at DESC
      )
      FROM brand_campaigns bc 
      WHERE bc.brand_id = b.id
    ),
    '[]'::json
  ) as campaigns

FROM brands b
LEFT JOIN brand_regions br ON b.id = br.brand_id AND br.is_primary = true
LEFT JOIN brand_financials bf ON b.id = bf.brand_id;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_brand_full_data_slug ON brands(slug);

-- Grant appropriate permissions
GRANT SELECT ON brand_full_data TO authenticated;
GRANT SELECT ON brand_full_data TO anon; 