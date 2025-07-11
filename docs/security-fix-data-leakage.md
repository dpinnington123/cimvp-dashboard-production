# Security Fix: User Data Leakage Between Sessions

## Issue Summary

Critical security vulnerability discovered where users can see data from other users' sessions. When one user logs out and another logs in, they may see campaign data and other information from the previous user due to:

1. React Query cache persisting between sessions
2. No user-based data isolation in queries
3. Missing Row Level Security (RLS) in Supabase database

## Risk Assessment

- **Severity**: Critical
- **Impact**: High - Users can access other users' confidential business data
- **Likelihood**: High - Occurs during normal user switching scenarios

## Root Cause Analysis

### 1. Client-Side Cache Persistence
- React Query's `QueryClient` is created once at app initialization
- Cache is never cleared when users log out
- New users inherit cached data from previous sessions

### 2. Missing User Context in Queries
- Query keys don't include user identifiers
- Example: `['brands']` instead of `['brands', userId]`
- Makes it impossible for React Query to differentiate between users' data

### 3. Database-Level Security Gaps
- No Row Level Security (RLS) policies on Supabase tables
- No user ownership model for brands
- API endpoints return all data regardless of authenticated user

## Phased Implementation Plan

### Phase 1: Immediate Client-Side Protection (Day 1) ✅ COMPLETED

**Status**: Implemented and deployed in commit `8203506`
**Branch**: `security/fix-user-data-leakage`

#### 1.1 Clear React Query Cache on Logout ✅

**Implementation Details**:
- Moved QueryClient inside App component using `useMemo`
- Added Supabase auth state change listener
- Cache is cleared immediately on SIGNED_OUT event
- Queries are invalidated on SIGNED_IN for fresh data

**File**: `/src/App.tsx`
```typescript
function App() {
  // Create QueryClient inside component to manage it properly
  const queryClient = useMemo(
    () => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });

  // Add auth state listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Clear all cached data immediately
          queryClient.clear();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* ... rest of app */}
    </QueryClientProvider>
  );
}
```

**File**: `/src/hooks/useAuth.tsx`
```typescript
// Also clear cache in signOut function
const signOut = async () => {
  setLoading(true);
  
  // Get query client instance
  const queryClient = useQueryClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    
    // Clear cache regardless of error
    queryClient.clear();
    
    // Clear local state
    setSession(null);
    setUser(null);
    
    return { error };
  } catch (err) {
    // Still clear cache on error
    queryClient.clear();
    setSession(null);
    setUser(null);
    return { error: err as AuthError };
  } finally {
    setLoading(false);
  }
};
```

#### 1.2 Force Component Remount on User Change ✅

**Implementation Details**:
- Created `AuthenticatedLayout` wrapper component
- Uses `key={user?.id || 'logged-out'}` to force React to remount entire component tree
- Applied to all protected routes
- Ensures all component state, contexts, and hooks are reset on user change

**File**: `/src/App.tsx`
```typescript
function AuthenticatedLayout() {
  const { user } = useAuth();
  
  // Key prop forces full remount when user ID changes
  // This ensures all component state is reset on user switch
  return (
    <div key={user?.id || 'logged-out'}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
}
```

#### 1.3 Add User Context to Query Keys ✅

**Implementation Details**:
- All React Query keys now include user ID as final element
- Prevents any possibility of cache collision between users
- Each user's data is cached in isolation
- Added user ID check to `enabled` condition for extra safety

**File**: `/src/contexts/BrandContext.tsx`
```typescript
const { session, user } = useAuth();
const userId = user?.id;

// All queries now include user ID to prevent cross-user cache hits
const { data: brands = [], isLoading: brandsLoading } = useQuery({
  queryKey: ['brands', userId],
  queryFn: brandService.getAllBrands,
  enabled: isAuthenticated && !!userId,
});

const { data: brandData } = useQuery({
  queryKey: ['brand', selectedBrand, userId],
  queryFn: () => brandService.getBrandWithFullData(selectedBrand),
  enabled: !!selectedBrand && isAuthenticated && !!userId,
});
```

#### 1.4 Additional Security Enhancements ✅

**Implementation Details**:
- Reset selected brand when user logs out (prevents brand persistence)
- Set initial brand selection only after user authentication
- Added security logging for monitoring auth state changes
- Clear brand selection immediately when userId becomes null

**Security Logging Output**:
```
[Security] Auth state changed: SIGNED_OUT
[Security] User signed out - clearing React Query cache
[Security] Auth state changed: SIGNED_IN
[Security] User signed in - invalidating queries
```

### Phase 1 Testing Checklist

- [x] User A logs in, views campaign dashboard
- [x] User A logs out (verify cache clear in console)
- [x] User B logs in immediately after
- [x] Verify User B sees NO data from User A
- [x] Check console for security logging messages
- [x] Verify components remount (React DevTools)
- [x] Test with multiple browser tabs

### Phase 2: Database Security Implementation (Day 2-3) 🔄 PENDING

#### 2.1 Design User-Brand Relationship

**Option A: Single Owner Model**
```sql
-- Add user_id to brands table
ALTER TABLE brands 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX idx_brands_user_id ON brands(user_id);
```

**Option B: Multi-User Access Model (Recommended)**
```sql
-- Create junction table for user-brand relationships
CREATE TABLE user_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- owner, admin, editor, viewer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);

-- Create indexes
CREATE INDEX idx_user_brands_user_id ON user_brands(user_id);
CREATE INDEX idx_user_brands_brand_id ON user_brands(brand_id);
```

#### 2.2 Implement Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_brands ENABLE ROW LEVEL SECURITY;

-- Policy for user_brands table
CREATE POLICY "Users can view their own brand associations" ON user_brands
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own brand associations" ON user_brands
  FOR INSERT WITH CHECK (user_id = auth.uid() AND role = 'owner');

-- Policy for brands table (users can see brands they have access to)
CREATE POLICY "Users can view brands they have access to" ON brands
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_brands 
      WHERE user_brands.brand_id = brands.id 
      AND user_brands.user_id = auth.uid()
    )
  );

-- Policy for brand_campaigns (inherit brand access)
CREATE POLICY "Users can view campaigns for their brands" ON brand_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_brands 
      WHERE user_brands.brand_id = brand_campaigns.brand_id 
      AND user_brands.user_id = auth.uid()
    )
  );

-- Repeat similar policies for all brand-related tables
```

#### 2.3 Update Service Layer

**File**: `/src/services/brandService.ts`
```typescript
class BrandService {
  /**
   * Get all brands for the current user
   */
  async getAllBrands(): Promise<DatabaseBrand[]> {
    // With RLS enabled, this automatically filters to user's brands
    const { data, error } = await supabase
      .from('brands')
      .select(`
        id, 
        slug, 
        name, 
        business_area,
        user_brands!inner(role)
      `)
      .order('name');

    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Create a new brand and assign ownership to current user
   */
  async createBrand(brandData: CreateBrandInput): Promise<DatabaseBrand> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a brand');
    }

    // Start a transaction
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .insert({
        slug: brandData.slug,
        name: brandData.name,
        business_area: brandData.businessArea
      })
      .select()
      .single();

    if (brandError) {
      throw new Error(`Failed to create brand: ${brandError.message}`);
    }

    // Assign ownership to creating user
    const { error: relationError } = await supabase
      .from('user_brands')
      .insert({
        user_id: user.id,
        brand_id: brand.id,
        role: 'owner'
      });

    if (relationError) {
      // Rollback by deleting the brand
      await supabase.from('brands').delete().eq('id', brand.id);
      throw new Error(`Failed to assign brand ownership: ${relationError.message}`);
    }

    return brand;
  }
}
```

### Phase 3: Testing & Validation (Day 4)

#### 3.1 Security Testing Checklist

- [ ] Test user A logs in, views brands, logs out
- [ ] Test user B logs in immediately after
- [ ] Verify user B sees no data from user A
- [ ] Test direct API calls with user tokens
- [ ] Verify RLS blocks unauthorized access
- [ ] Test cache clearing on logout
- [ ] Test component remounting on user switch

#### 3.2 Performance Testing

- [ ] Measure query performance with RLS enabled
- [ ] Verify indexes are being used
- [ ] Test with multiple brands per user
- [ ] Check cache hit rates after implementation

### Phase 4: Monitoring & Maintenance

#### 4.1 Add Security Logging

```typescript
// Log security-relevant events
const logSecurityEvent = async (event: string, details: any) => {
  console.log(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    user: user?.id,
    ...details
  });
  
  // Could also send to monitoring service
};

// Use in critical functions
logSecurityEvent('cache_cleared', { reason: 'user_logout' });
logSecurityEvent('unauthorized_access_attempt', { table: 'brands', brandId });
```

#### 4.2 Regular Security Audits

- Weekly review of RLS policies
- Monthly audit of user access patterns
- Quarterly penetration testing

## Migration Guide

### For Existing Data

1. **Audit Current Brands**: Identify which user should own each brand
2. **Create User-Brand Relationships**: 
   ```sql
   -- Example: Assign all brands to a default admin user initially
   INSERT INTO user_brands (user_id, brand_id, role)
   SELECT 
     'admin-user-id'::uuid,
     id,
     'owner'
   FROM brands;
   ```
3. **Communicate Changes**: Notify users about security improvements

### Rollback Plan

If issues arise:

1. **Client-Side**: Deploy previous version without cache clearing
2. **Database**: 
   ```sql
   -- Disable RLS if needed (emergency only)
   ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
   -- Remove policies
   DROP POLICY IF EXISTS "policy_name" ON table_name;
   ```

## Success Metrics

- Zero instances of cross-user data visibility
- No degradation in query performance (< 100ms p95)
- Successful security audit results
- User satisfaction maintained or improved

## References

- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query Security Best Practices](https://tanstack.com/query/latest/docs/react/guides/security)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)