# Hooks Documentation

## Form Options Hooks

### Current State

**`useBrandFormOptions`**
- **Current Purpose**: Provides dropdown options for content forms
- **Data Sources**:
  - Brand-specific: campaigns, audiences, strategies, objectives (from BrandContext)
  - Global lookups: agencies, formats, types (extracted from brand data)
- **Note**: Name is misleading - provides more than just brand options

### Future State (Post-Scoping Implementation)

```typescript
// Option 1: Separate hooks
useBrandOptions()      // Brand-specific only
useGlobalLookups()     // Global/scoped lookups
useContentFormOptions() // Combines both

// Option 2: Single hook with clear sections
useContentFormOptions() {
  return {
    brand: { campaigns, audiences, strategies },
    global: { agencies, formats, types },
    scoped: { /* future scoped data */ }
  }
}
```

### Migration Path

1. **Phase 1 (Current)**: Use existing `useBrandFormOptions`
2. **Phase 2**: Add scope filtering to global data
3. **Phase 3**: Refactor into separate hooks if needed

### Decision Log

- **2025-06-18**: Decided to keep existing hook names to avoid breaking changes
- Will refactor when implementing multi-tenancy scoping
- Global lookups will eventually move to database queries with scope filters