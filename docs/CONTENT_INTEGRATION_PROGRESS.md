# Content Integration Progress

## Overview
This document tracks the progress of integrating the process content system with the brand database, ensuring proper relationships between uploaded content and brand data (campaigns, audiences, strategies, etc.).

## Problem Statement
- Content table was storing text values instead of foreign key IDs
- No link between uploaded content and brands
- Brand data was fake while content data was real with actual scores

## Solution Approach
Instead of trying to match content to fake brand data, we created brand data to match the real content data, then normalized the database with proper foreign keys.

## Migration Status

### ✅ Phase 1: Database Migration (COMPLETED)

#### 1.1 Created Brand Data from Content
- **Campaigns**: 11 created (e.g., "Earth Month Awareness", "Zero-Waste Challenge")
- **Audiences**: 6 created (e.g., "general", "business", "employees")
- **Strategies**: 8 created (e.g., "es-obj-1", "Re-engagement")
- **Agencies**: 5 created in new `agencies` table
- **Formats**: 4 created in new `content_formats` table
- **Types**: 2 created in new `content_types` table

#### 1.2 Added Foreign Key Columns
Added to `content` table:
- `campaign_id` → `brand_campaigns`
- `audience_id` → `brand_audiences`
- `strategy_id` → `brand_strategies`
- `brand_id` → `brands`
- `agency_id` → `agencies`
- `format_id` → `content_formats`
- `type_id` → `content_types`

#### 1.3 Updated Content Records
- 53 total content records updated
- All linked to eco-solutions brand
- Original text columns preserved for backward compatibility

#### 1.4 Created Brand-Content Links
- 51 records created in `brand_content` table
- Links content to brands and campaigns

#### 1.5 Performance Optimization
- Added indexes on all foreign key columns

### ✅ Phase 2: Frontend Updates (COMPLETED)

#### 2.1 Update ContentUploadForm
- [x] Modified `useBrandFormOptions` to return IDs for campaigns
- [x] Added brandId from BrandContext to form submission
- [x] Made brandId a required field in ContentMetadata
- [x] Added validation to ensure brand is selected before upload

#### 2.2 Update Upload Service
- [x] Updated ContentMetadata interface to include required brandId
- [x] Modified uploadService to use brandId from metadata
- [x] Content now properly linked to both user (client_id) and brand (brand_id)

#### 2.3 Architecture Decisions Made
- [x] Keep existing hook names to avoid breaking changes
- [x] Use dynamic brand selection instead of hardcoding
- [x] Added future-proofing scope columns to lookup tables
- [x] Documented hook strategy in README_HOOKS.md

### ✅ Phase 3: Backend Integration (COMPLETED)

#### 3.1 Update Content Service
- [x] Added ID lookup functions to contentService.ts
- [x] Modified uploadService.ts to use service layer pattern
- [x] Implemented automatic ID population during upload
- [x] UUID detection for fields that might already have IDs
- [x] Backward compatibility maintained with text fields

#### 3.2 ID Lookup Implementation
- [x] getCampaignIdByName() - Looks up campaign ID by name and brand
- [x] getAudienceIdByName() - Looks up audience ID by name and brand
- [x] getStrategyIdByName() - Looks up strategy ID by name and brand
- [x] getAgencyIdByName() - Global lookup for agency ID
- [x] getFormatIdByName() - Global lookup for format ID
- [x] getTypeIdByName() - Global lookup for type ID

### ✅ Phase 4: Fix RLS Policies (COMPLETED)

#### 4.1 Initial RLS Policy Fix
- [x] Added SELECT policies for brand_campaigns
- [x] Added SELECT policies for brand_audiences  
- [x] Added SELECT policies for brand_strategies

#### 4.2 Additional RLS Policies
- [x] Added SELECT policies for brand_financials
- [x] Added SELECT policies for brand_regions
- [x] Added INSERT/UPDATE/DELETE policies for brand_content

### ✅ Phase 5: Brand Content Integration (COMPLETED)

#### 5.1 Brand Content Record Creation
- [x] Modified uploadService to create brand_content records after upload
- [x] Links content to brand via brand_id
- [x] Links content to campaign via campaign_id (when selected)
- [x] Preserves all metadata in brand_content table
- [x] Handles errors gracefully without failing the upload

### 📋 Phase 6: Scoring Pipeline (PENDING)
- [ ] Implement content analysis after upload
- [ ] Populate content_reviews table
- [ ] Calculate scores based on brand alignment
- [ ] Store results in scores table

### 🔄 Phase 5: Migration Cleanup (FUTURE)

#### 5.1 Remove Old Columns
- [ ] Drop text columns from content table
- [ ] Update all queries to use only IDs
- [ ] Clean up any remaining references

## Database Schema Changes

### New Tables Created
```sql
-- Agencies table
CREATE TABLE agencies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Content formats table
CREATE TABLE content_formats (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ
);

-- Content types table
CREATE TABLE content_types (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ
);
```

### Content Table Modifications
```sql
ALTER TABLE content ADD COLUMN campaign_id UUID REFERENCES brand_campaigns(id);
ALTER TABLE content ADD COLUMN audience_id UUID REFERENCES brand_audiences(id);
ALTER TABLE content ADD COLUMN strategy_id UUID REFERENCES brand_strategies(id);
ALTER TABLE content ADD COLUMN brand_id UUID REFERENCES brands(id);
ALTER TABLE content ADD COLUMN agency_id UUID REFERENCES agencies(id);
ALTER TABLE content ADD COLUMN format_id UUID REFERENCES content_formats(id);
ALTER TABLE content ADD COLUMN type_id UUID REFERENCES content_types(id);
```

## Testing Checklist

### Database Testing ✅
- [x] Verify all brand data created correctly
- [x] Confirm foreign keys populated
- [x] Check brand_content links created
- [x] Validate indexes created

### Frontend Testing ✅
- [x] Form sends IDs when available (campaigns, audiences, strategies)
- [x] Form sends text for other fields (agencies, formats, types)
- [x] BrandId properly included in metadata
- [x] Backward compatibility maintained

### Backend Testing (TODO)
- [ ] Test ID lookups are working correctly
- [ ] Verify foreign key columns are populated
- [ ] Test UUID detection logic
- [ ] Ensure null handling for missing lookups

### Integration Testing (TODO)
- [ ] End-to-end content upload flow with ID population
- [ ] Verify brand_content record creation
- [ ] Test with both UUID and text values from form
- [ ] Scoring pipeline execution
- [ ] Report generation with linked data

## Rollback Plan
If issues arise:
1. Foreign key columns can be dropped without affecting original data
2. Text columns are preserved and still functional
3. Brand_content table can be truncated if needed
4. New tables (agencies, content_formats, content_types) can be dropped

## Next Steps
1. Update ContentUploadForm component
2. Modify uploadService.ts
3. Test thoroughly before removing old columns
4. Implement scoring pipeline

## Multi-Tenancy Considerations

### Future Architecture Requirements
The system will support hierarchical multi-tenancy:
- Company → Brand → Region → Campaign
- Users will have different permission levels
- Data needs to be properly scoped and isolated

### Scope Columns Added (Future-Proofing)
Added to all lookup tables for future RLS implementation:
```sql
company_id UUID          -- Future company scope
brand_id UUID            -- Future brand scope  
scope_type VARCHAR(20)   -- 'global', 'company', 'brand', 'region'
created_by UUID          -- Audit trail
is_active BOOLEAN        -- Soft delete capability
```

Current values: All records have `scope_type = 'global'`

### Design Decision
Using "Future-Proof Lite" approach:
- Added scope columns now (prevents migration later)
- Not enforcing them yet (keeps implementation simple)
- Will implement RLS when permission model is defined

## Notes
- All changes are backward compatible
- Original text data is preserved
- Migration was done through Supabase MCP tools
- Default brand is eco-solutions (ID: 11111111-1111-1111-1111-111111111111)
- Scope columns added for future multi-tenancy support

---
Last Updated: 2025-06-18