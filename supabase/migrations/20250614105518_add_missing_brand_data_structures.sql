-- Migration: Add Missing Brand Data Structures
-- Description: Adds market analysis, customer analysis, personas, content, and performance tracking tables
-- Created: 2025-06-14

-- 1. Brand Market Analysis Table
CREATE TABLE IF NOT EXISTS brand_market_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  market_size TEXT,
  growth_rate TEXT,
  analysis_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Brand Competitors Table
CREATE TABLE IF NOT EXISTS brand_competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  market_share TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Brand SWOT Analysis Table
CREATE TABLE IF NOT EXISTS brand_swot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  strengths TEXT[],
  weaknesses TEXT[],
  opportunities TEXT[],
  threats TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Brand Customer Segments Table
CREATE TABLE IF NOT EXISTS brand_customer_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size_percentage TEXT,
  description TEXT,
  needs TEXT[],
  pain_points TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Brand Customer Journey Table
CREATE TABLE IF NOT EXISTS brand_customer_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  touchpoints TEXT[],
  opportunities TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Brand Personas Table
CREATE TABLE IF NOT EXISTS brand_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  strategic_score INTEGER CHECK (strategic_score >= 0 AND strategic_score <= 100),
  customer_score INTEGER CHECK (customer_score >= 0 AND customer_score <= 100),
  execution_score INTEGER CHECK (execution_score >= 0 AND execution_score <= 100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Brand Content Table
CREATE TABLE IF NOT EXISTS brand_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES brand_campaigns(id) ON DELETE SET NULL,
  content_id TEXT, -- Original ID from TypeScript data
  name TEXT NOT NULL,
  format TEXT, -- Social Media, Email, Blog Post, etc.
  type TEXT, -- hero, driver
  status TEXT DEFAULT 'draft', -- draft, live
  description TEXT,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  cost DECIMAL(10, 2),
  audience TEXT,
  key_actions TEXT[],
  agencies TEXT[],
  -- Individual scores
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  strategic_score INTEGER CHECK (strategic_score >= 0 AND strategic_score <= 100),
  customer_score INTEGER CHECK (customer_score >= 0 AND customer_score <= 100),
  execution_score INTEGER CHECK (execution_score >= 0 AND execution_score <= 100),
  -- Campaign scores
  campaign_overall_effectiveness INTEGER CHECK (campaign_overall_effectiveness >= 0 AND campaign_overall_effectiveness <= 100),
  campaign_strategic_alignment INTEGER CHECK (campaign_strategic_alignment >= 0 AND campaign_strategic_alignment <= 100),
  campaign_customer_alignment INTEGER CHECK (campaign_customer_alignment >= 0 AND campaign_customer_alignment <= 100),
  campaign_content_effectiveness INTEGER CHECK (campaign_content_effectiveness >= 0 AND campaign_content_effectiveness <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Brand Overall Scores Table
CREATE TABLE IF NOT EXISTS brand_overall_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  strategic_score INTEGER CHECK (strategic_score >= 0 AND strategic_score <= 100),
  customer_score INTEGER CHECK (customer_score >= 0 AND customer_score <= 100),
  content_score INTEGER CHECK (content_score >= 0 AND content_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Brand Channel Scores Table
CREATE TABLE IF NOT EXISTS brand_channel_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- social, email, website, digital
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  strategic_score INTEGER CHECK (strategic_score >= 0 AND strategic_score <= 100),
  customer_score INTEGER CHECK (customer_score >= 0 AND customer_score <= 100),
  execution_score INTEGER CHECK (execution_score >= 0 AND execution_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Brand Funnel Data Table
CREATE TABLE IF NOT EXISTS brand_funnel_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  value INTEGER CHECK (value >= 0 AND value <= 100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Brand Performance History Table
CREATE TABLE IF NOT EXISTS brand_performance_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  strategic_score INTEGER CHECK (strategic_score >= 0 AND strategic_score <= 100),
  customer_score INTEGER CHECK (customer_score >= 0 AND customer_score <= 100),
  content_score INTEGER CHECK (content_score >= 0 AND content_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_brand_market_analysis_brand_id ON brand_market_analysis(brand_id);
CREATE INDEX idx_brand_competitors_brand_id ON brand_competitors(brand_id);
CREATE INDEX idx_brand_swot_brand_id ON brand_swot(brand_id);
CREATE INDEX idx_brand_customer_segments_brand_id ON brand_customer_segments(brand_id);
CREATE INDEX idx_brand_customer_journey_brand_id ON brand_customer_journey(brand_id);
CREATE INDEX idx_brand_personas_brand_id ON brand_personas(brand_id);
CREATE INDEX idx_brand_content_brand_id ON brand_content(brand_id);
CREATE INDEX idx_brand_content_campaign_id ON brand_content(campaign_id);
CREATE INDEX idx_brand_overall_scores_brand_id ON brand_overall_scores(brand_id);
CREATE INDEX idx_brand_channel_scores_brand_id ON brand_channel_scores(brand_id);
CREATE INDEX idx_brand_funnel_data_brand_id ON brand_funnel_data(brand_id);
CREATE INDEX idx_brand_performance_history_brand_id ON brand_performance_history(brand_id);
CREATE INDEX idx_brand_performance_history_date ON brand_performance_history(brand_id, year, month);

-- Enable Row Level Security on new tables
ALTER TABLE brand_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_swot ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_customer_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_overall_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_channel_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_funnel_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_performance_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables (allowing access to all authenticated users for now)
CREATE POLICY "Enable read access for all users" ON brand_market_analysis FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_competitors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_swot FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_customer_segments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_customer_journey FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_personas FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_content FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_overall_scores FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_channel_scores FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_funnel_data FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brand_performance_history FOR SELECT USING (true);

-- Add update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_market_analysis_updated_at BEFORE UPDATE ON brand_market_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_competitors_updated_at BEFORE UPDATE ON brand_competitors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_swot_updated_at BEFORE UPDATE ON brand_swot
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_customer_segments_updated_at BEFORE UPDATE ON brand_customer_segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_customer_journey_updated_at BEFORE UPDATE ON brand_customer_journey
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_personas_updated_at BEFORE UPDATE ON brand_personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_content_updated_at BEFORE UPDATE ON brand_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_overall_scores_updated_at BEFORE UPDATE ON brand_overall_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_channel_scores_updated_at BEFORE UPDATE ON brand_channel_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_funnel_data_updated_at BEFORE UPDATE ON brand_funnel_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();