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

### Phase 1: Immediate Client-Side Protection (Day 1)

#### 1.1 Clear React Query Cache on Logout

**File**: `/src/App.tsx`
```typescript
// Move QueryClient inside component to access in auth listener
function App() {
  const queryClient = new QueryClient({
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

#### 1.2 Force Component Remount on User Change

**File**: `/src/App.tsx`
```typescript
function AuthenticatedLayout() {
  const { user } = useAuth();
  
  // Key prop forces full remount when user changes
  return (
    <DashboardLayout key={user?.id || 'logged-out'}>
      <BrandProvider>
        <Outlet />
      </BrandProvider>
    </DashboardLayout>
  );
}
```

#### 1.3 Add User Context to Query Keys

**File**: `/src/contexts/BrandContext.tsx`
```typescript
const { user } = useAuth();

// Update all queries to include user ID
const { data: brands = [], isLoading: brandsLoading } = useQuery({
  queryKey: ['brands', user?.id],
  queryFn: brandService.getAllBrands,
  enabled: isAuthenticated && !!user?.id,
});

const { data: brandData } = useQuery({
  queryKey: ['brand', selectedBrand, user?.id],
  queryFn: () => brandService.getBrandWithFullData(selectedBrand),
  enabled: !!selectedBrand && isAuthenticated && !!user?.id,
});
```

### Phase 2: Database Security Implementation (Day 2-3)

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