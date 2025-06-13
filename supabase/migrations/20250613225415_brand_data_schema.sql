-- Brand Data Schema Migration
-- This migration creates the schema for moving brand data from static TypeScript files to the database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Brands table - Core brand information
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_area VARCHAR(255),
    client_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Brand regions - Support multiple regions per brand
CREATE TABLE IF NOT EXISTS brand_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(brand_id, region)
);

-- 3. Brand financials - Track financial metrics
CREATE TABLE IF NOT EXISTS brand_financials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    annual_sales VARCHAR(50),
    target_sales VARCHAR(50),
    growth_percentage DECIMAL(5,2),
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Brand voice attributes
CREATE TABLE IF NOT EXISTS brand_voice_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Brand objectives
CREATE TABLE IF NOT EXISTS brand_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Brand messages
CREATE TABLE IF NOT EXISTS brand_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Brand audiences
CREATE TABLE IF NOT EXISTS brand_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    notes TEXT,
    demographics JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Brand strategies
CREATE TABLE IF NOT EXISTS brand_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Brand campaigns
CREATE TABLE IF NOT EXISTS brand_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    timeframe VARCHAR(255),
    strategic_objective TEXT,
    audience TEXT,
    campaign_details TEXT,
    budget DECIMAL(12,2),
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    strategic_score INTEGER CHECK (strategic_score >= 0 AND strategic_score <= 100),
    customer_score INTEGER CHECK (customer_score >= 0 AND customer_score <= 100),
    execution_score INTEGER CHECK (execution_score >= 0 AND execution_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brand_regions_brand_id ON brand_regions(brand_id);
CREATE INDEX idx_brand_campaigns_brand_id ON brand_campaigns(brand_id);
CREATE INDEX idx_brand_strategies_brand_id ON brand_strategies(brand_id);

-- Add RLS policies
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all brands" ON brands
    FOR SELECT USING (auth.role() = 'authenticated');
EOF < /dev/null
