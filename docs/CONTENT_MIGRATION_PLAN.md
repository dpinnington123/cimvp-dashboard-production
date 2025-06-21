# Content Tables Migration Plan

## Overview

This document outlines the migration strategy for consolidating the `content` and `brand_content` tables using the **View-Plus-Join Model** recommended by architectural review. This approach minimizes risk to the service layer while eliminating data duplication.

**Migration Status**: 🟡 In Progress  
**Started**: December 19, 2024  
**Target Completion**: January 15, 2025

## Table of Contents
1. [Current Architecture](#current-architecture)
2. [Target Architecture](#target-architecture)
3. [Migration Phases](#migration-phases)
4. [Progress Tracking](#progress-tracking)
5. [Rollback Plan](#rollback-plan)
6. [Testing Checklist](#testing-checklist)

## Current Architecture

### Problem Statement
- Two tables (`content` and `brand_content`) with overlapping data
- Security vulnerability in `brand_content` (allows all users to read)
- Manual sync between tables is error-prone
- Dashboard reads from `brand_content`, services use `content`

### Dependencies
- **14 files** directly depend on `content` table
- **3 core services**: `contentService`, `uploadService`, `contentProcessingService`
- **Scoring system**: `content` → `content_reviews` → `scores`
- **React hooks**: Multiple hooks using React Query
- **RLS policies**: Critical for multi-tenant security

## Target Architecture

### View-Plus-Join Model
1. `content` remains the single source of truth
2. `brand_content` stores only dashboard-specific metadata
3. A VIEW joins both tables for dashboard consumption
4. No changes to existing service layer

### Benefits
- ✅ Zero data duplication
- ✅ No breaking changes to services
- ✅ Security inherited from `content` table
- ✅ Dashboard can have custom fields
- ✅ Single source of truth

## Migration Phases

### Phase 0: Security Fix (COMPLETED ✅)
**Status**: ✅ Completed on Dec 19, 2024

Fixed critical security vulnerability by updating RLS policies:
```sql
-- Policies now check ownership through content table
CREATE POLICY "Enable read access for content owners"
ON brand_content
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM content c
    WHERE c.id = brand_content.content_id
      AND c.client_id = auth.uid()
  )
);
```

### Phase 1: Create Comprehensive View
**Status**: 🔄 In Progress  
**Target Date**: Dec 20, 2024

Create a view that joins `content` and `brand_content`:

```sql
CREATE OR REPLACE VIEW brand_content_view AS
SELECT 
  -- All fields from content table
  c.id,
  c.content_name as name,
  c.brand_id,
  c.campaign_id,
  c.format,
  c.type,
  c.status,
  c.audience,
  c.audience_id,
  c.strategy_id,
  c.agency_id,
  c.format_id,
  c.type_id,
  c.job_id,
  c.bucket_id,
  c.file_storage_path,
  c.eye_tracking_path,
  c.processing_status,
  c.client_id,
  c.created_at,
  c.updated_at,
  c.expiry_date,
  c.funnel_alignment,
  c.content_objectives,
  
  -- Dashboard-specific fields from brand_content
  bc.content_id,
  bc.overall_score,
  bc.strategic_score,
  bc.customer_score,
  bc.execution_score,
  bc.campaign_overall_effectiveness,
  bc.campaign_strategic_alignment,
  bc.campaign_customer_alignment,
  bc.campaign_content_effectiveness,
  bc.cost,
  bc.quality_score,
  bc.description,
  bc.key_actions,
  bc.agencies
  
FROM content c
LEFT JOIN brand_content bc ON c.id = bc.content_id
WHERE c.brand_id IS NOT NULL;
```

### Phase 2: Update Sync Trigger
**Status**: ⏳ Pending  
**Target Date**: Dec 21, 2024

Simplify the trigger to only maintain the relationship:

```sql
CREATE OR REPLACE FUNCTION sync_content_to_brand_content()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO brand_content (brand_id, campaign_id, content_id)
    VALUES (NEW.brand_id, NEW.campaign_id, NEW.id)
    ON CONFLICT (content_id) DO NOTHING;
    
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE brand_content
    SET brand_id = NEW.brand_id,
        campaign_id = NEW.campaign_id,
        updated_at = NOW()
    WHERE content_id = NEW.id;
    
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM brand_content WHERE content_id = OLD.id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to all operations
CREATE TRIGGER content_sync_trigger
AFTER INSERT OR UPDATE OR DELETE ON content
FOR EACH ROW
WHEN (COALESCE(NEW.brand_id, OLD.brand_id) IS NOT NULL)
EXECUTE FUNCTION sync_content_to_brand_content();
```

### Phase 3: Update brand_full_data View
**Status**: ⏳ Pending  
**Target Date**: Dec 23, 2024

Update the main dashboard view to use `brand_content_view`:

1. Backup current view definition
2. Update to use new `brand_content_view`
3. Test all dashboard components

### Phase 4: Service Layer Updates
**Status**: ⏳ Pending  
**Target Date**: Jan 5, 2025

Update services to be aware of the new architecture:

- [ ] Update `brandService.ts` to use `brand_content_view`
- [ ] Add comments to `contentService.ts` about the relationship
- [ ] Update upload workflow documentation

### Phase 5: Testing & Validation
**Status**: ⏳ Pending  
**Target Date**: Jan 10, 2025

Comprehensive testing of all workflows:

- [ ] Upload new content
- [ ] View in dashboard
- [ ] Update content
- [ ] Delete content
- [ ] Score content
- [ ] Multi-user access testing

### Phase 6: Cleanup & Documentation
**Status**: ⏳ Pending  
**Target Date**: Jan 15, 2025

- [ ] Remove duplicate columns from `brand_content`
- [ ] Update API documentation
- [ ] Update CLAUDE.md with new architecture
- [ ] Team training on new structure

## Progress Tracking

| Phase | Status | Start Date | Complete Date | Notes |
|-------|--------|------------|---------------|-------|
| 0. Security Fix | ✅ Complete | Dec 19 | Dec 19 | Critical vulnerability fixed |
| 1. Create View | 🔄 In Progress | Dec 20 | - | |
| 2. Update Trigger | ⏳ Pending | - | - | |
| 3. Update brand_full_data | ⏳ Pending | - | - | |
| 4. Service Updates | ⏳ Pending | - | - | |
| 5. Testing | ⏳ Pending | - | - | |
| 6. Cleanup | ⏳ Pending | - | - | |

## Rollback Plan

Each phase is designed to be reversible:

1. **View Creation**: Simply `DROP VIEW brand_content_view`
2. **Trigger Update**: Restore original trigger from backup
3. **brand_full_data Update**: Restore from backup
4. **Service Updates**: Git revert commits

### Emergency Rollback SQL
```sql
-- In case of emergency, restore original state
DROP VIEW IF EXISTS brand_content_view;
DROP TRIGGER IF EXISTS content_sync_trigger ON content;
-- Restore original trigger from backup
-- Restore original brand_full_data view from backup
```

## Testing Checklist

### Security Testing
- [x] Verify user A cannot see user B's content
- [ ] Test with multiple brands per user
- [ ] Test with shared brands

### Functionality Testing
- [ ] Content upload creates brand_content entry
- [ ] Content update syncs to brand_content
- [ ] Content deletion removes brand_content
- [ ] Dashboard displays all content fields
- [ ] Scores update correctly
- [ ] Filters work on dashboard

### Performance Testing
- [ ] Dashboard load time < 2 seconds
- [ ] No N+1 queries in content list
- [ ] View performs well with 10k+ records

### Integration Testing
- [ ] Campaign planner shows content
- [ ] Content reports work
- [ ] Export functionality works
- [ ] All React hooks function correctly

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Dec 19 | Use View-Plus-Join Model | Minimizes risk to service layer |
| Dec 19 | Fix security before migration | Critical vulnerability |
| Dec 19 | Keep both tables | Separation of concerns |

## References

- [Original GitHub Issue](#)
- [Architecture Review Discussion](#)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

## Contact

**Migration Lead**: [Your Name]  
**Technical Review**: Zen AI Architecture Consultant  
**Stakeholders**: Development Team

---

Last Updated: December 19, 2024