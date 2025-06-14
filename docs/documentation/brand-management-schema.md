# Brand Management Database Schema

## Overview

The Change Influence MVP Dashboard includes a comprehensive **brand management and analytics platform** powered by a Supabase PostgreSQL database. This schema supports multi-brand strategy analysis, competitive intelligence, customer journey mapping, and performance tracking.

**Last Updated:** June 14, 2025  
**Status:** Production Ready ✅

## Database Architecture

The brand management system consists of **20 tables** organized into functional domains:

### 1. Core Brand Management (9 tables)
- `brands` - Core brand information
- `brand_regions` - Multi-region support  
- `brand_financials` - Financial metrics and targets
- `brand_voice_attributes` - Brand voice characteristics
- `brand_objectives` - Strategic objectives
- `brand_messages` - Key messaging
- `brand_audiences` - Target audience definitions
- `brand_strategies` - Brand strategies with scores
- `brand_campaigns` - Marketing campaigns with metrics

### 2. Market & Competitive Analysis (3 tables)
- `brand_market_analysis` - Market size and growth data
- `brand_competitors` - Competitive analysis
- `brand_swot` - SWOT analysis components

### 3. Customer Intelligence (3 tables)  
- `brand_customer_segments` - Customer segment analysis
- `brand_customer_journey` - Journey stage mapping
- `brand_personas` - Brand personas with scoring

### 4. Content & Performance (5 tables)
- `brand_content` - Enhanced content management
- `brand_overall_scores` - Brand-level performance metrics
- `brand_channel_scores` - Channel-specific performance
- `brand_funnel_data` - Conversion funnel tracking
- `brand_performance_history` - Historical performance data

### 5. Optimized Views (1 view)
- `brand_full_data` - Aggregated brand data for efficient queries

## Core Tables

### `brands`
**Purpose:** Central registry for all brands in the system

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique brand identifier |
| `slug` | `VARCHAR(255)` | URL-friendly brand identifier |
| `name` | `VARCHAR(255)` | Brand display name |
| `business_area` | `VARCHAR(255)` | Industry/business focus |
| `client_id` | `UUID` | References auth.users(id) |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | Last modification timestamp |

### `brand_regions`
**Purpose:** Multi-region support for global brands

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique region record identifier |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `region` | `VARCHAR(100)` | Geographic region name |
| `is_primary` | `BOOLEAN` | Primary region flag |

### `brand_market_analysis`
**Purpose:** Market intelligence and competitive landscape

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique analysis identifier |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `market_size` | `TEXT` | Total addressable market |
| `growth_rate` | `TEXT` | Market growth rate |
| `analysis_year` | `INTEGER` | Year of analysis |

### `brand_competitors`
**Purpose:** Competitive analysis and positioning

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique competitor record |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `name` | `TEXT` | Competitor name |
| `market_share` | `TEXT` | Market share percentage |
| `strengths` | `TEXT[]` | Array of competitive strengths |
| `weaknesses` | `TEXT[]` | Array of competitive weaknesses |
| `order_index` | `INTEGER` | Display order |

### `brand_customer_segments`
**Purpose:** Customer segmentation and targeting

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique segment identifier |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `name` | `TEXT` | Segment name |
| `size_percentage` | `TEXT` | Segment size as percentage |
| `description` | `TEXT` | Segment description |
| `needs` | `TEXT[]` | Array of customer needs |
| `pain_points` | `TEXT[]` | Array of customer pain points |

### `brand_personas`
**Purpose:** Brand personas with multi-dimensional scoring

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique persona identifier |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `name` | `TEXT` | Persona name |
| `description` | `TEXT` | Persona description |
| `icon` | `TEXT` | Icon identifier |
| `overall_score` | `INTEGER` | Overall effectiveness score (0-100) |
| `strategic_score` | `INTEGER` | Strategic alignment score (0-100) |
| `customer_score` | `INTEGER` | Customer alignment score (0-100) |
| `execution_score` | `INTEGER` | Execution effectiveness score (0-100) |

### `brand_content`
**Purpose:** Enhanced content management with campaign association

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique content identifier |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `campaign_id` | `UUID` (FK) | References brand_campaigns(id) |
| `content_id` | `TEXT` | Original TypeScript content ID |
| `name` | `TEXT` | Content name |
| `format` | `TEXT` | Content format (Social Media, Email, etc.) |
| `type` | `TEXT` | Content type (hero, driver) |
| `status` | `TEXT` | Content status (draft, live) |
| `description` | `TEXT` | Content description |
| `quality_score` | `INTEGER` | Quality score (0-100) |
| `cost` | `DECIMAL(10,2)` | Content creation cost |
| `audience` | `TEXT` | Target audience |
| `key_actions` | `TEXT[]` | Array of key actions |
| `agencies` | `TEXT[]` | Array of agency names |

### `brand_performance_history`
**Purpose:** Time-series performance tracking

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` (PK) | Unique history record |
| `brand_id` | `UUID` (FK) | References brands(id) |
| `month` | `TEXT` | Month name (Jan, Feb, etc.) |
| `year` | `INTEGER` | Year |
| `overall_score` | `INTEGER` | Overall performance score (0-100) |
| `strategic_score` | `INTEGER` | Strategic performance score (0-100) |
| `customer_score` | `INTEGER` | Customer performance score (0-100) |
| `content_score` | `INTEGER` | Content performance score (0-100) |

## Optimized Data Access

### `brand_full_data` View
**Purpose:** Single-query access to complete brand information

This view aggregates data from all brand tables into JSON structures for efficient frontend consumption:

```sql
SELECT 
  b.id, b.slug, b.name, b.business_area,
  -- Related data as JSON arrays/objects
  regions, financials, voice_attributes, objectives, 
  messages, audiences, strategies, campaigns,
  market_analysis, competitors, swot, 
  customer_segments, customer_journey, personas,
  content, overall_scores, channel_scores, 
  funnel_data, performance_history
FROM brands b
-- [Complex JOIN and aggregation logic]
```

## Key Features

### Security & Access Control
- **Row Level Security (RLS)** enabled on all brand tables
- **User-based data isolation** via client_id fields
- **Cascade deletes** maintain referential integrity

### Performance Optimizations
- **Indexed foreign keys** for fast JOIN operations
- **Aggregate view** reduces complex query overhead
- **UUID primary keys** for globally unique identifiers
- **Automatic timestamps** for audit trails

### Data Integrity
- **Foreign key constraints** ensure referential integrity
- **Check constraints** validate score ranges (0-100)
- **Unique constraints** prevent duplicate slugs and regions
- **Array data types** for flexible list storage

## Usage Patterns

### Brand Data Retrieval
```javascript
// Get complete brand data (recommended)
const brandData = await supabase
  .from('brand_full_data')
  .select('*')
  .eq('slug', 'eco-solutions')
  .single();

// Get specific data subset
const competitors = await supabase
  .from('brand_competitors')
  .select('*')
  .eq('brand_id', brandId)
  .order('order_index');
```

### Performance Tracking
```javascript
// Add new performance data
const newPerformance = await supabase
  .from('brand_performance_history')
  .insert({
    brand_id: brandId,
    month: 'Jun',
    year: 2025,
    overall_score: 85,
    strategic_score: 88,
    customer_score: 82,
    content_score: 86
  });
```

### Market Analysis Updates
```javascript
// Update market analysis
const marketUpdate = await supabase
  .from('brand_market_analysis')
  .upsert({
    brand_id: brandId,
    market_size: '$4.8B',
    growth_rate: '15.2% CAGR',
    analysis_year: 2025
  });
```

## Development Notes

- **Service Layer:** All operations abstracted in `brandService.ts`
- **Type Safety:** Complete TypeScript interfaces in `/types/brand.ts`
- **Environment:** Configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Feature Flags:** `VITE_USE_DATABASE_BRANDS=true` enables database mode

---

*Last Updated: June 14, 2025*  
*Schema Version: 2.0 (Enhanced Brand Management)*