# Brand Database Schema Documentation

## Overview

This document outlines the database schema changes and implementations for the Brand Management system in the Change Influence MVP Dashboard. These changes support comprehensive brand strategy, objectives, and analytics functionality.

## Recent Schema Changes (June 2024)

### 1. Brand Objectives Table Migration

**Date:** June 26, 2024

**Previous State:** Objectives were stored as JSONB in the `brands` table under the `objectives` column.

**New Implementation:** Created dedicated `brand_objectives` table with the following structure:

```sql
CREATE TABLE brand_objectives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    behavioral_change TEXT,
    target_audience_id UUID REFERENCES brand_audiences(id) ON DELETE SET NULL,
    scenario TEXT,
    timeline TEXT,
    owner TEXT,
    kpis JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX idx_brand_objectives_brand_id ON brand_objectives(brand_id);
CREATE INDEX idx_brand_objectives_target_audience ON brand_objectives(target_audience_id);
```

**Migration Process:**
1. Created new table structure
2. Migrated existing JSONB data to new table
3. Updated service layer to use new table
4. Implemented RLS policies for security

**Benefits:**
- Better querying capabilities
- Foreign key relationships (e.g., to brand_audiences)
- Individual field updates without replacing entire JSONB
- Better performance with proper indexing

### 2. Row Level Security (RLS) Policies

**Implemented comprehensive RLS policies for all brand-related tables:**

```sql
-- Example: brand_objectives policies
CREATE POLICY "Users can view objectives" ON brand_objectives
    FOR SELECT USING (true);

CREATE POLICY "Users can insert objectives" ON brand_objectives
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update objectives" ON brand_objectives
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete objectives" ON brand_objectives
    FOR DELETE USING (true);
```

### 3. Brand Content Synchronization

**Implemented bidirectional sync between `content` and `brand_content` tables:**

```sql
-- Sync function
CREATE OR REPLACE FUNCTION sync_content_tables() RETURNS TRIGGER AS $$
BEGIN
    -- Sync logic for status, format, type, audience, and content_name
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic synchronization
CREATE TRIGGER sync_brand_content_to_content
AFTER UPDATE ON brand_content
FOR EACH ROW EXECUTE FUNCTION sync_content_to_main();

CREATE TRIGGER sync_content_to_brand_content
AFTER UPDATE ON content
FOR EACH ROW EXECUTE FUNCTION sync_content_to_brand();
```

## Core Tables Structure

### 1. Brands Table (Enhanced)
```sql
brands
├── id (UUID, PK)
├── slug (TEXT, UNIQUE)
├── name (TEXT)
├── business_area (TEXT)
├── voice_attributes (JSONB) -- Still JSONB for flexibility
├── messages (JSONB) -- Still JSONB for flexibility
├── swot_data (JSONB)
├── personas (JSONB)
├── market_analysis (JSONB)
├── customer_segments (JSONB)
├── customer_journey (JSONB)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### 2. Related Tables

#### brand_objectives (NEW)
- Stores strategic objectives with full relational structure
- Links to brand_audiences via foreign key
- Supports KPIs as JSONB for flexibility

#### brand_audiences
```sql
├── id (UUID, PK)
├── brand_id (UUID, FK)
├── name (TEXT)
├── notes (TEXT)
├── demographics (JSONB)
├── order_index (INTEGER)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

#### brand_strategies
```sql
├── id (UUID, PK)
├── brand_id (UUID, FK)
├── name (TEXT)
├── description (TEXT)
├── score (INTEGER)
├── status (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

#### brand_campaigns
```sql
├── id (UUID, PK)
├── brand_id (UUID, FK)
├── name (TEXT)
├── status (TEXT)
├── timeframe (TEXT)
├── strategic_objective (TEXT)
├── audience (TEXT)
├── campaign_details (TEXT)
├── budget (NUMERIC)
├── [various score fields]
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Service Layer Implementation

### Key Service Methods

1. **Brand Service Extensions:**
   - `getBrandIdBySlug(slug)` - Maps slug to UUID
   - `updateBrandObjectives(brandId, objectives)` - Now uses dedicated table
   - `updateBrandMessages(brandId, messages)` - Updates JSONB field
   - `updateBrandVoiceAttributes(brandId, attributes)` - Updates JSONB field
   - `updateBrandAudiences(brandId, audiences)` - Manages audience table
   - `updateBrandStrategies(brandId, strategies)` - Manages strategies table

2. **Query Invalidation Pattern:**
   ```typescript
   // Invalidate all brand queries for proper refresh
   queryClient.invalidateQueries({ queryKey: ['brand'] });
   queryClient.invalidateQueries({ queryKey: ['brands'] });
   ```

## Frontend Integration

### Hooks Created
1. `useUpdateBrandObjectives` - Manages objectives CRUD
2. `useUpdateBrandStrategies` - Manages strategies CRUD
3. `useUpdateBrandMessages` - Updates brand messages
4. `useUpdateBrandContent` - Updates content status

### Component Updates
- **StrategicObjectives**: Full CRUD with database persistence
- **BrandMessages**: Save/delete with database persistence
- **ContentTable**: Status updates sync to database

## Best Practices Implemented

1. **Proper ID Handling:**
   - Use brand slug in URLs and context
   - Convert to UUID for database operations
   - Maintain consistency across the app

2. **Query Invalidation:**
   - Invalidate broadly when updating nested data
   - Use brand slug for query keys to match context

3. **Error Handling:**
   - Comprehensive try-catch in service methods
   - User-friendly toast notifications
   - Rollback on failed operations

4. **Performance:**
   - Indexed foreign keys
   - Efficient query patterns
   - Proper use of TanStack Query caching

## Migration Notes

### From JSONB to Relational Tables
When migrating from JSONB to dedicated tables:
1. Create new table with proper structure
2. Write migration query to transfer data
3. Update service layer to use new table
4. Update frontend components
5. Add proper indexes and RLS policies
6. Test thoroughly before removing JSONB column

### Example Migration Query
```sql
-- Migrate objectives from JSONB to table
INSERT INTO brand_objectives (brand_id, title, behavioral_change, status, order_index)
SELECT 
    b.id,
    obj->>'text' as title,
    obj->>'notes' as behavioral_change,
    COALESCE(obj->>'status', 'active') as status,
    (row_number() OVER (PARTITION BY b.id ORDER BY ordinality) - 1) as order_index
FROM brands b
CROSS JOIN LATERAL jsonb_array_elements(b.objectives) WITH ORDINALITY obj(obj, ordinality)
WHERE b.objectives IS NOT NULL AND b.objectives != '[]'::jsonb;
```

## Future Considerations

1. **Additional Migrations:**
   - Consider moving `personas` from JSONB to dedicated table
   - Consider moving `customer_segments` to dedicated table
   - Evaluate `messages` structure for potential normalization

2. **Performance Optimizations:**
   - Add materialized views for complex aggregations
   - Implement database-level functions for common operations
   - Consider partitioning for large tables

3. **Security Enhancements:**
   - Implement user-specific RLS policies when auth is added
   - Add audit logging for sensitive operations
   - Implement field-level encryption for PII

## Troubleshooting

### Common Issues and Solutions

1. **New data not appearing in UI:**
   - Check query invalidation keys match context usage
   - Verify brand ID/slug conversion
   - Check RLS policies allow read access

2. **Save operations failing:**
   - Verify foreign key relationships
   - Check required fields are provided
   - Review RLS policies for write access

3. **Performance issues:**
   - Check for missing indexes
   - Review query patterns for N+1 problems
   - Consider implementing pagination