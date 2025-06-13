# Brand Data Migration Plan: Static TypeScript to Database

## Overview
This document outlines the plan to migrate static brand data from TypeScript files to a dynamic database structure, enabling easier management and scalability.

## Current State Analysis

### Existing Structure
- **Location**: `/src/contexts/data/brands/`
- **Format**: Static TypeScript files (ecoSolutions.ts, techNova.ts, vitalWellness.ts)
- **Data Model**: Complex nested structure including:
  - Brand profile (id, name, region, business area, financials)
  - Brand voice attributes
  - Strategic objectives
  - Key messages
  - Target audiences
  - Strategies with scores
  - Campaigns with detailed metrics
  - Content items
  - Performance scores and analytics

### Current Usage
- Data imported statically in `BrandContext`
- No database connection for brand data
- All brand switching happens in-memory

## Proposed Database Schema

### Core Tables

#### 1. `brands`
```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL, -- e.g., "eco-solutions"
    name VARCHAR(255) NOT NULL,
    business_area VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 2. `brand_regions`
```sql
CREATE TABLE brand_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 3. `brand_financials`
```sql
CREATE TABLE brand_financials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    annual_sales VARCHAR(50),
    target_sales VARCHAR(50),
    growth_percentage DECIMAL(5,2),
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 4. `brand_voice_attributes`
```sql
CREATE TABLE brand_voice_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 5. `brand_objectives`
```sql
CREATE TABLE brand_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 6. `brand_messages`
```sql
CREATE TABLE brand_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 7. `brand_audiences`
```sql
CREATE TABLE brand_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    notes TEXT,
    demographics JSONB,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 8. `brand_strategies`
```sql
CREATE TABLE brand_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    score INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 9. `brand_campaigns`
```sql
CREATE TABLE brand_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    timeframe VARCHAR(255),
    strategic_objective TEXT,
    audience TEXT,
    campaign_details TEXT,
    budget DECIMAL(12,2),
    overall_score INTEGER,
    strategic_score INTEGER,
    customer_score INTEGER,
    execution_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 10. `brand_campaign_actions`
```sql
CREATE TABLE brand_campaign_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaigns(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 11. `brand_campaign_agencies`
```sql
CREATE TABLE brand_campaign_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaigns(id) ON DELETE CASCADE,
    agency_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Migration Steps

### Phase 1: Database Setup
1. Create migration file for new tables
2. Add indexes for performance:
   - Index on `brands.slug`
   - Index on foreign keys
   - Composite index on `brand_regions(brand_id, region)`
3. Create views for common queries

### Phase 2: Data Migration
1. Create migration scripts to:
   - Insert existing brands (EcoSolutions, TechNova, VitalWellness)
   - Populate all related tables with existing data
   - Maintain all IDs for referential integrity

### Phase 3: API Layer Development
1. Create new services in `/src/services/`:
   - `brandService.ts` - Core brand operations
   - `brandCampaignService.ts` - Campaign management
   - `brandStrategyService.ts` - Strategy operations

2. Key functions needed:
   ```typescript
   // brandService.ts
   - getAllBrands()
   - getBrandBySlug(slug: string)
   - getBrandWithFullData(brandId: string)
   - updateBrandProfile(brandId: string, data: Partial<Brand>)
   
   // brandCampaignService.ts
   - getBrandCampaigns(brandId: string)
   - createCampaign(brandId: string, campaign: CampaignInput)
   - updateCampaignScores(campaignId: string, scores: CampaignScores)
   ```

### Phase 4: Context Refactoring
1. Update `BrandContext.tsx`:
   - Replace static imports with API calls
   - Add loading states
   - Implement caching with React Query
   - Handle errors gracefully

2. Create custom hooks:
   ```typescript
   // hooks/useBrands.ts
   export const useBrands = () => {
     return useQuery(['brands'], brandService.getAllBrands);
   };
   
   // hooks/useBrandData.ts
   export const useBrandData = (brandSlug: string) => {
     return useQuery(
       ['brand', brandSlug],
       () => brandService.getBrandWithFullData(brandSlug),
       { enabled: !!brandSlug }
     );
   };
   ```

### Phase 5: Component Updates
1. Update components that use `useBrand()` hook
2. Add loading states where needed
3. Update type imports from database types

### Phase 6: Testing & Validation
1. Verify data integrity after migration
2. Test all CRUD operations
3. Performance testing with larger datasets
4. Update existing tests

## Implementation Timeline

### Week 1: Database & Migration
- [ ] Create and test database schema
- [ ] Write data migration scripts
- [ ] Populate database with existing data

### Week 2: API Development
- [ ] Implement brand services
- [ ] Add error handling and validation
- [ ] Create comprehensive API tests

### Week 3: Frontend Integration
- [ ] Update BrandContext
- [ ] Implement React Query hooks
- [ ] Update consuming components

### Week 4: Testing & Deployment
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Production deployment

## Benefits of Migration

1. **Scalability**: Easy to add new brands without code changes
2. **Management**: Admin interface can manage brand data
3. **Performance**: Database queries with proper indexing
4. **Flexibility**: Dynamic regions and attributes
5. **Versioning**: Track changes over time
6. **Multi-tenancy**: Better client/brand isolation

## Rollback Plan

1. Keep static files as backup during transition
2. Feature flag for switching between static/dynamic
3. Database backup before migration
4. Ability to export database back to static files

## Future Enhancements

1. Brand versioning/history
2. Brand templates for quick setup
3. Import/export functionality
4. Brand comparison features
5. API for external integrations