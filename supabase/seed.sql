-- Brand Data Seed File
-- This file populates the brand tables with initial data from the static TypeScript files
-- It runs with admin privileges during db reset/seed operations

-- Temporarily disable RLS for seeding
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_regions DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_financials DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_attributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_objectives DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_audiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_strategies DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_campaigns DISABLE ROW LEVEL SECURITY;

-- Clear existing data if any
TRUNCATE TABLE brand_campaigns CASCADE;
TRUNCATE TABLE brand_strategies CASCADE;
TRUNCATE TABLE brand_audiences CASCADE;
TRUNCATE TABLE brand_messages CASCADE;
TRUNCATE TABLE brand_objectives CASCADE;
TRUNCATE TABLE brand_voice_attributes CASCADE;
TRUNCATE TABLE brand_financials CASCADE;
TRUNCATE TABLE brand_regions CASCADE;
TRUNCATE TABLE brands CASCADE;

-- Insert EcoSolutions brand
INSERT INTO brands (id, slug, name, business_area, created_at, updated_at) VALUES 
('11111111-1111-1111-1111-111111111111', 'eco-solutions', 'EcoSolutions', 'Sustainable Consumer Products', NOW(), NOW());

-- Insert EcoSolutions data
INSERT INTO brand_regions (brand_id, region, is_primary) VALUES 
('11111111-1111-1111-1111-111111111111', 'North America', true);

INSERT INTO brand_financials (brand_id, annual_sales, target_sales, growth_percentage) VALUES 
('11111111-1111-1111-1111-111111111111', '$38.5M', '$50M', 15.2);

INSERT INTO brand_voice_attributes (brand_id, title, description, order_index) VALUES 
('11111111-1111-1111-1111-111111111111', 'Confident and authoritative', 'Establishing expertise in sustainability', 0),
('11111111-1111-1111-1111-111111111111', 'Approachable and friendly', 'Creating connection with eco-conscious consumers', 1),
('11111111-1111-1111-1111-111111111111', 'Clear and straightforward', 'Communicating benefits without greenwashing', 2),
('11111111-1111-1111-1111-111111111111', 'Inspiring and motivational', 'Encouraging sustainable lifestyle choices', 3);

INSERT INTO brand_objectives (brand_id, text, notes, order_index) VALUES 
('11111111-1111-1111-1111-111111111111', 'Increase brand awareness by 30%', 'Focus on digital channels and sustainability influencers', 0),
('11111111-1111-1111-1111-111111111111', 'Expand product line by 5 new items', 'Target zero-waste household essentials', 1),
('11111111-1111-1111-1111-111111111111', 'Reduce carbon footprint by 25%', 'Implement across supply chain and highlight in marketing', 2);

INSERT INTO brand_messages (brand_id, text, notes, order_index) VALUES 
('11111111-1111-1111-1111-111111111111', 'Planet-friendly innovation', 'Emphasize research and development of sustainable materials', 0),
('11111111-1111-1111-1111-111111111111', 'Affordable sustainability', 'Counter perception that eco-friendly equals expensive', 1),
('11111111-1111-1111-1111-111111111111', 'Small changes, big impact', 'Show how small consumer choices add up to significant change', 2);

INSERT INTO brand_audiences (brand_id, name, notes, order_index) VALUES 
('11111111-1111-1111-1111-111111111111', 'Eco-conscious Millennials', 'Urban, educated, income >$65k, values-driven purchasing', 0),
('11111111-1111-1111-1111-111111111111', 'Sustainability-curious families', 'Suburban, seeking practical ways to be more eco-friendly', 1),
('11111111-1111-1111-1111-111111111111', 'Corporate procurement teams', 'Looking to improve corporate sustainability metrics', 2);

INSERT INTO brand_strategies (brand_id, name, description, score) VALUES 
('11111111-1111-1111-1111-111111111111', 'Zero-Waste Leadership', 'Position as the leading zero-waste consumer brand through product innovation and educational content', 85),
('11111111-1111-1111-1111-111111111111', 'Digital-First Education', 'Use digital channels to educate consumers on sustainability practices while showcasing products', 78),
('11111111-1111-1111-1111-111111111111', 'Community Building', 'Create a community of eco-conscious consumers who advocate for the brand and sustainability', 82);

INSERT INTO brand_campaigns (brand_id, name, status, timeframe, strategic_objective, audience, campaign_details, budget, overall_score, strategic_score, customer_score, execution_score) VALUES 
('11111111-1111-1111-1111-111111111111', 'Earth Month Awareness', 'active', 'Mar 15 - Apr 30, 2023', 'Position EcoSolutions as a thought leader in sustainable living during Earth Month', 'Eco-conscious Millennials and Gen Z consumers', 'Annual flagship campaign targeting environmentally conscious consumers', 75000, 83, 86, 80, 84);

-- Insert TechNova brand
INSERT INTO brands (id, slug, name, business_area, created_at, updated_at) VALUES 
('22222222-2222-2222-2222-222222222222', 'tech-nova', 'TechNova', 'AI-Powered SaaS Solutions', NOW(), NOW());

-- Insert TechNova data
INSERT INTO brand_regions (brand_id, region, is_primary) VALUES 
('22222222-2222-2222-2222-222222222222', 'Global', true);

INSERT INTO brand_financials (brand_id, annual_sales, target_sales, growth_percentage) VALUES 
('22222222-2222-2222-2222-222222222222', '$12.3M', '$25M', 45.7);

INSERT INTO brand_voice_attributes (brand_id, title, description, order_index) VALUES 
('22222222-2222-2222-2222-222222222222', 'Innovative and forward-thinking', 'Showcasing cutting-edge AI technology', 0),
('22222222-2222-2222-2222-222222222222', 'Professional and reliable', 'Building trust in enterprise solutions', 1),
('22222222-2222-2222-2222-222222222222', 'Accessible and educational', 'Making complex AI concepts understandable', 2),
('22222222-2222-2222-2222-222222222222', 'Results-oriented', 'Focusing on measurable business outcomes', 3);

INSERT INTO brand_objectives (brand_id, text, notes, order_index) VALUES 
('22222222-2222-2222-2222-222222222222', 'Achieve $25M ARR by end of 2024', 'Focus on enterprise clients and platform expansion', 0),
('22222222-2222-2222-2222-222222222222', 'Launch 3 new AI modules', 'Natural language processing and predictive analytics', 1),
('22222222-2222-2222-2222-222222222222', 'Expand to European markets', 'GDPR compliance and localization strategy', 2);

INSERT INTO brand_messages (brand_id, text, notes, order_index) VALUES 
('22222222-2222-2222-2222-222222222222', 'AI that works for you', 'Emphasize user-friendly AI solutions', 0),
('22222222-2222-2222-2222-222222222222', 'Transform your business intelligence', 'Focus on data-driven insights', 1),
('22222222-2222-2222-2222-222222222222', 'Future-proof your operations', 'Position as essential for competitive advantage', 2);

INSERT INTO brand_audiences (brand_id, name, notes, order_index) VALUES 
('22222222-2222-2222-2222-222222222222', 'Enterprise IT Directors', 'Decision makers for technology infrastructure', 0),
('22222222-2222-2222-2222-222222222222', 'Data Scientists', 'Technical users evaluating AI platforms', 1),
('22222222-2222-2222-2222-222222222222', 'C-suite Executives', 'Strategic leaders focused on digital transformation', 2);

INSERT INTO brand_strategies (brand_id, name, description, score) VALUES 
('22222222-2222-2222-2222-222222222222', 'Thought Leadership', 'Establish TechNova as the go-to source for AI business insights', 88),
('22222222-2222-2222-2222-222222222222', 'Product-Led Growth', 'Use freemium model and product experience to drive adoption', 82);

INSERT INTO brand_campaigns (brand_id, name, status, timeframe, strategic_objective, audience, campaign_details, budget, overall_score, strategic_score, customer_score, execution_score) VALUES 
('22222222-2222-2222-2222-222222222222', 'AI Transformation Summit', 'planned', 'Q2 2024', 'Establish thought leadership in AI business transformation', 'Enterprise executives and IT leaders', 'Virtual summit featuring industry experts and TechNova solutions', 120000, 85, 90, 85, 0);

-- Insert VitalWellness brand
INSERT INTO brands (id, slug, name, business_area, created_at, updated_at) VALUES 
('33333333-3333-3333-3333-333333333333', 'vital-wellness', 'VitalWellness', 'Health & Wellness Technology', NOW(), NOW());

-- Insert VitalWellness data
INSERT INTO brand_regions (brand_id, region, is_primary) VALUES 
('33333333-3333-3333-3333-333333333333', 'North America', true);

INSERT INTO brand_financials (brand_id, annual_sales, target_sales, growth_percentage) VALUES 
('33333333-3333-3333-3333-333333333333', '$8.7M', '$15M', 28.4);

INSERT INTO brand_voice_attributes (brand_id, title, description, order_index) VALUES 
('33333333-3333-3333-3333-333333333333', 'Caring and empathetic', 'Understanding health challenges and aspirations', 0),
('33333333-3333-3333-3333-333333333333', 'Evidence-based', 'Grounded in scientific research and data', 1),
('33333333-3333-3333-3333-333333333333', 'Encouraging and positive', 'Motivating users on their wellness journey', 2),
('33333333-3333-3333-3333-333333333333', 'Accessible and inclusive', 'Wellness solutions for everyone', 3);

INSERT INTO brand_objectives (brand_id, text, notes, order_index) VALUES 
('33333333-3333-3333-3333-333333333333', 'Reach 1M active users', 'Expand user base through referral and content marketing', 0),
('33333333-3333-3333-3333-333333333333', 'Launch corporate wellness program', 'B2B offering for employee health initiatives', 1),
('33333333-3333-3333-3333-333333333333', 'Integrate with 5 major health platforms', 'API connections with popular health apps', 2);

INSERT INTO brand_messages (brand_id, text, notes, order_index) VALUES 
('33333333-3333-3333-3333-333333333333', 'Your wellness journey, powered by technology', 'Personalized health insights', 0),
('33333333-3333-3333-3333-333333333333', 'Small steps, lasting change', 'Sustainable wellness habits', 1),
('33333333-3333-3333-3333-333333333333', 'Health data that makes sense', 'Clear, actionable insights from health metrics', 2);

INSERT INTO brand_audiences (brand_id, name, notes, order_index) VALUES 
('33333333-3333-3333-3333-333333333333', 'Health-conscious professionals', 'Busy individuals seeking efficient wellness solutions', 0),
('33333333-3333-3333-3333-333333333333', 'Fitness enthusiasts', 'Active users looking to optimize performance', 1),
('33333333-3333-3333-3333-333333333333', 'Healthcare providers', 'Professionals using technology to support patient care', 2);

INSERT INTO brand_strategies (brand_id, name, description, score) VALUES 
('33333333-3333-3333-3333-333333333333', 'Community-Driven Growth', 'Build engaged user community sharing wellness journeys', 79),
('33333333-3333-3333-3333-333333333333', 'Data-Driven Personalization', 'Use AI to provide personalized wellness recommendations', 86);

INSERT INTO brand_campaigns (brand_id, name, status, timeframe, strategic_objective, audience, campaign_details, budget, overall_score, strategic_score, customer_score, execution_score) VALUES 
('33333333-3333-3333-3333-333333333333', 'New Year, New You', 'completed', 'Jan 1 - Feb 14, 2024', 'Capitalize on New Year wellness resolutions to drive user acquisition', 'Health-conscious individuals starting wellness journeys', 'Comprehensive campaign targeting New Year resolution makers', 85000, 81, 84, 83, 76);

-- Re-enable RLS after seeding
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_campaigns ENABLE ROW LEVEL SECURITY; 