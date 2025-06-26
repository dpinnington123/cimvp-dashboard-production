# Comprehensive Service Layer Plan

## Overview

This document outlines a complete service layer architecture plan for the Change Influence MVP Dashboard, mapping all components to their required database operations based on existing Supabase tables.

## Current State Analysis

### Existing Services
1. **brandService.ts** - Partial CRUD (missing many update operations)
2. **contentService.ts** - Basic CRUD + status updates
3. **contentProcessingService.ts** - Processing workflows
4. **scoreService.ts** - Read-only operations
5. **uploadService.ts** - File uploads
6. **exportService.ts** - Export functionality

### Key Gaps Identified
- Missing update operations for brand-related data (objectives, messages, personas, etc.)
- No company-level aggregation service
- Limited bulk operations
- No research files service

## Service Layer Architecture

### 1. Core Design Principles

```typescript
// Standard service function pattern
export const updateEntity = async (
  id: string,
  updates: Partial<EntityType>
): Promise<{ data: EntityType | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating entity:', error);
    return { data: null, error: error as Error };
  }
};
```

### 2. Service Organization by Domain

## Detailed Service Mapping

### A. Brand Service Extensions

#### Current brandService.ts Enhancements

```typescript
// Brand Profile Updates
updateBrandProfile(brandId: string, profile: {
  name?: string;
  business_area?: string;
  [key: string]: any;
})

// JSONB Field Updates (stored in brands table)
updateBrandObjectives(brandId: string, objectives: Objective[])
updateBrandMessages(brandId: string, messages: Message[])
updateBrandPersonas(brandId: string, personas: Persona[])
updateBrandCustomerSegments(brandId: string, segments: CustomerSegment[])
updateBrandCustomerJourney(brandId: string, journey: CustomerJourney[])

// Related Table Updates
updateBrandRegions(brandId: string, regions: Region[])
updateBrandFinancials(brandId: string, financials: Financials)
updateBrandCompetitors(brandId: string, competitors: Competitor[])
```

### B. Campaign Service (New)

```typescript
// campaignService.ts
getAllCampaigns(brandId: string)
getCampaignById(campaignId: string)
createCampaign(brandId: string, campaign: CampaignInput)
updateCampaign(campaignId: string, updates: Partial<Campaign>)
deleteCampaign(campaignId: string)
updateCampaignScores(campaignId: string, scores: CampaignScores)
```

### C. Content Service Extensions

```typescript
// Enhanced contentService.ts
// Brand Content Operations
getBrandContent(brandId: string, filters?: ContentFilters)
updateBrandContent(contentId: string, updates: {
  name?: string;
  format?: string;
  type?: string;
  status?: 'live' | 'draft' | 'planned';
  description?: string;
  quality_score?: number;
  cost?: number;
  audience?: string;
  key_actions?: string[];
  agencies?: string[];
})
bulkUpdateContentStatus(contentIds: string[], status: 'live' | 'draft' | 'planned')
assignContentToCampaign(contentId: string, campaignId: string)
updateContentScores(contentId: string, scores: ContentScores)
```

### D. Analytics Service (New)

```typescript
// analyticsService.ts
// Overall Scores
updateOverallScores(brandId: string, scores: OverallScores)
getOverallScores(brandId: string)

// Channel Scores
updateChannelScores(brandId: string, channelScores: ChannelScore[])
getChannelScores(brandId: string)

// Performance History
addPerformanceEntry(brandId: string, entry: PerformanceEntry)
getPerformanceHistory(brandId: string, dateRange?: DateRange)

// Funnel Data
updateFunnelData(brandId: string, funnelData: FunnelData)
getFunnelData(brandId: string)
```

### E. Company Service (New)

```typescript
// companyService.ts
// Aggregation across all brands
getCompanyOverview()
getAggregatedScores()
getTopPerformingContent(limit?: number)
getTopCampaigns(limit?: number)
getRegionalPerformance()
getChannelEffectivenessAcrossBrands()
getMarketShareAnalysis()
getCompetitiveLandscape()
```

### F. Research Service (New)

```typescript
// researchService.ts
createResearchFilesTable() // One-time setup
uploadResearchFile(brandId: string, file: File, metadata: FileMetadata)
getResearchFiles(brandId: string)
deleteResearchFile(fileId: string)
updateFileMetadata(fileId: string, metadata: Partial<FileMetadata>)
```

## Component to Service Mapping

### 1. Brand Dashboard Page
- **Components**: ScoreCard, StrategyEffectiveness, CampaignCard, etc.
- **Services Used**: brandService (read operations)
- **New Services Needed**: None (read-only dashboard)

### 2. Brand Strategy Page

#### BrandProfile Component
- **Current**: Reads from context
- **Needed**: `brandService.updateBrandProfile()`

#### CustomerAnalysis Component
- **Current**: Local state only
- **Needed**: 
  - `brandService.updateBrandPersonas()`
  - `brandService.updateBrandCustomerSegments()`
  - `brandService.updateBrandCustomerJourney()`

#### StrategicObjectives Component
- **Current**: Local state only
- **Needed**: 
  - `brandService.updateBrandObjectives()`
  - `brandService.updateBrandStrategies()`

#### BrandMessages Component
- **Current**: Local state only
- **Needed**: 
  - `brandService.updateBrandMessages()`
  - `brandService.getBrandAudiences()`

#### ResearchFiles Component
- **Current**: Hardcoded
- **Needed**: 
  - `researchService.uploadResearchFile()`
  - `researchService.getResearchFiles()`
  - `researchService.deleteResearchFile()`

### 3. Campaign Planner Page

#### ContentTable Component
- **Current**: Local state for status
- **Needed**: 
  - `contentService.updateBrandContent()`
  - `contentService.bulkUpdateContentStatus()`

#### CampaignTabs Component
- **Current**: Read-only
- **Needed**: 
  - `campaignService.createCampaign()`
  - `campaignService.updateCampaign()`

### 4. Strategic Dashboard Page
- **Current**: Static data from companyOverviewData
- **Needed**: All methods from `companyService.ts`


## Implementation Priority

### Phase 1: Critical Updates (1-2 weeks)
1. **Brand Strategy Components**
   - Extend brandService with JSONB update methods
   - Create hooks for each component
   - Update components to use new hooks

2. **Campaign Planner** ✅ **PARTIALLY COMPLETE**
   - ✅ Enhanced contentService with status update capability
   - ✅ Created useUpdateBrandContent hook with TanStack Query
   - ✅ Updated ContentTable component to use new hook
   - ✅ Implemented database-level sync between content and brand_content tables
   - ⏳ Add bulk operations
   - ⏳ Add full content update capabilities (beyond just status)

### Phase 2: New Services (1 week)
1. **Campaign Service**
   - Full CRUD for campaigns
   - Score management

2. **Analytics Service**
   - Score updates
   - Performance tracking

3. **Research Service**
   - File management
   - Metadata tracking

### Phase 3: Company Aggregations (1 week)
1. **Company Service**
   - Create aggregation views in database
   - Implement service methods
   - Update Strategic Dashboard

## Hook Layer Pattern

### Standard Hook Pattern
```typescript
// useUpdateEntity.ts
export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Entity> }) =>
      entityService.updateEntity(id, updates),
    onSuccess: (result, variables) => {
      if (result.data) {
        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ queryKey: ['entity', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['entities'] });
        
        // Show success toast
        toast.success('Entity updated successfully');
      }
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
};
```

### Optimistic Updates Pattern
```typescript
export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateEntity,
    onMutate: async ({ id, updates }) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: ['entity', id] });
      
      // Snapshot previous value
      const previousEntity = queryClient.getQueryData(['entity', id]);
      
      // Optimistically update
      queryClient.setQueryData(['entity', id], (old) => ({
        ...old,
        ...updates,
      }));
      
      return { previousEntity };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousEntity) {
        queryClient.setQueryData(['entity', variables.id], context.previousEntity);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};
```

## Database Considerations

### 1. JSONB Updates
For JSONB fields in the brands table, updates need to replace the entire field:
```sql
UPDATE brands 
SET personas = $1::jsonb, 
    updated_at = NOW() 
WHERE id = $2;
```

### 2. Bulk Operations
Use Supabase's bulk operations where possible:
```typescript
const { data, error } = await supabase
  .from('brand_content')
  .update({ status: 'live' })
  .in('id', contentIds);
```

### 3. Transaction Support
For related updates, consider using Supabase's RPC functions:
```sql
CREATE OR REPLACE FUNCTION update_brand_with_relations(
  p_brand_id UUID,
  p_profile JSONB,
  p_regions JSONB[]
) RETURNS VOID AS $$
BEGIN
  -- Update brand
  UPDATE brands SET ... WHERE id = p_brand_id;
  
  -- Update regions
  DELETE FROM brand_regions WHERE brand_id = p_brand_id;
  INSERT INTO brand_regions ...;
END;
$$ LANGUAGE plpgsql;
```

## Testing Strategy

1. **Service Layer Tests**
   - Unit tests for each service function
   - Mock Supabase client
   - Test error scenarios

2. **Hook Layer Tests**
   - Test mutations and queries
   - Test cache invalidation
   - Test optimistic updates

3. **Integration Tests**
   - Test full flow from component to database
   - Test bulk operations
   - Test error recovery

## Migration Path

1. **Start with high-impact fixes**
   - Brand Strategy persistence
   - Campaign Planner status updates

2. **Gradual rollout**
   - Implement service functions
   - Create hooks
   - Update components one at a time

3. **Monitor and iterate**
   - Track performance
   - Gather user feedback
   - Optimize queries as needed

## Success Metrics

- All user changes persist across sessions
- Response time < 500ms for updates
- 0% data loss
- Proper error handling and user feedback
- Consistent UX across all update operations

## Implementation Progress Log

### 2024-06-25: Campaign Planner Content Status Updates
- **Implemented**: Content status updates with database persistence
- **Created**: `updateBrandContent` and `updateContentStatus` service methods
- **Created**: `useUpdateBrandContent` and `useUpdateContentStatus` hooks
- **Fixed**: UUID vs integer ID mismatch between tables
- **Implemented**: Database-level synchronization between `content` and `brand_content` tables
  - Created Supabase function `sync_content_tables()`
  - Added bidirectional triggers for automatic sync
  - Syncs: status, format, type, audience, and content_name
- **Result**: Status changes now persist and stay synchronized across both tables

### 2024-06-25: Brand Strategy CRUD Operations
- **Implemented**: BrandMessages component database integration
  - Created `useUpdateBrandMessages` hook with TanStack Query
  - Added methods to brandService: `updateBrandMessages`, `updateBrandObjectives`, `updateBrandVoiceAttributes`, etc.
  - Added `getBrandIdBySlug` method to map slug to UUID
  - Connected BrandMessages component to database (messages stored as JSONB in brands table)
  - Added loading states and error handling
  - Messages now persist to database on save/delete
- **Next**: Continue with StrategicObjectives and CustomerAnalysis components

### 2024-06-26: Strategic Objectives Component
- **Implemented**: StrategicObjectives component database integration
  - Created `useUpdateBrandObjectives` hook
  - Created `useUpdateBrandStrategies` hook
  - Connected objectives to database (stored as JSONB in brands table)
  - Connected strategies to database (stored in brand_strategies table)
  - Added full CRUD operations: create, update, delete objectives
  - Added loading states and error handling
  - Objectives and strategies now persist to database on save/delete
- **Next**: CustomerAnalysis component (personas, segments, journey)