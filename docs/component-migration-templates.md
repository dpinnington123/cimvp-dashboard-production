# Component Migration Templates

This document provides templates and patterns for updating components to work with the new database-driven brand system.

## 1. Page Component Pattern

### Before (Static Data)
```typescript
// pages/BrandDashboardPage.tsx
import { useBrand } from '@/contexts/BrandContext';

const BrandDashboardPage = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  return (
    <div>
      <h1>{brandData.profile.name}</h1>
      {/* Rest of component */}
    </div>
  );
};
```

### After (Database with Loading)
```typescript
// pages/BrandDashboardPage.tsx
import { useBrand } from '@/contexts/BrandContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

const BrandDashboardPage = () => {
  const { getBrandData, isLoading, error } = useBrand();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorDisplay 
        message="Failed to load brand data" 
        error={error} 
        retry={() => window.location.reload()} 
      />
    );
  }
  
  const brandData = getBrandData();
  
  return (
    <div>
      <h1>{brandData.profile.name}</h1>
      {/* Rest of component remains the same */}
    </div>
  );
};
```

## 2. Form Component Pattern

### Before (Static Data)
```typescript
// hooks/useBrandFormOptions.ts
import { useBrand } from '@/contexts/BrandContext';

export const useBrandFormOptions = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  const campaignOptions = brandData.campaigns.map(campaign => ({
    value: campaign.name,
    label: campaign.name
  }));
  
  return { campaignOptions };
};
```

### After (Database with Loading)
```typescript
// hooks/useBrandFormOptions.ts
import { useBrand } from '@/contexts/BrandContext';
import { useMemo } from 'react';

export const useBrandFormOptions = () => {
  const { getBrandData, isLoading } = useBrand();
  
  const options = useMemo(() => {
    if (isLoading) {
      return {
        campaignOptions: [],
        audienceOptions: [],
        strategyOptions: []
      };
    }
    
    const brandData = getBrandData();
    
    return {
      campaignOptions: brandData.campaigns.map(campaign => ({
        value: campaign.name,
        label: campaign.name
      })),
      audienceOptions: brandData.audiences.map(audience => ({
        value: audience.id,
        label: audience.text
      })),
      strategyOptions: brandData.strategies.map(strategy => ({
        value: strategy.id,
        label: strategy.name
      }))
    };
  }, [getBrandData, isLoading]);
  
  return { 
    ...options, 
    isLoading 
  };
};
```

### Using in Components
```typescript
// components/views/processContent/ContentUploadForm.tsx
const ContentUploadForm = () => {
  const { campaignOptions, isLoading: optionsLoading } = useBrandFormOptions();
  
  return (
    <form>
      <Select
        placeholder={optionsLoading ? "Loading campaigns..." : "Select campaign"}
        disabled={optionsLoading}
        options={campaignOptions}
      />
    </form>
  );
};
```

## 3. Display Component Pattern

### Before (Static Data)
```typescript
// components/views/brand-strategy/BrandProfile.tsx
import { useBrand } from '@/contexts/BrandContext';

const BrandProfile = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  return (
    <div>
      <h2>{brandData.profile.name}</h2>
      <p>{brandData.profile.businessArea}</p>
      {brandData.voice.map(voice => (
        <div key={voice.id}>
          <h3>{voice.title}</h3>
          <p>{voice.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### After (Database with Skeleton Loading)
```typescript
// components/views/brand-strategy/BrandProfile.tsx
import { useBrand } from '@/contexts/BrandContext';
import { Skeleton } from '@/components/ui/skeleton';

const BrandProfile = () => {
  const { getBrandData, isLoading } = useBrand();
  
  if (isLoading) {
    return <BrandProfileSkeleton />;
  }
  
  const brandData = getBrandData();
  
  return (
    <div>
      <h2>{brandData.profile.name}</h2>
      <p>{brandData.profile.businessArea}</p>
      {brandData.voice.map(voice => (
        <div key={voice.id}>
          <h3>{voice.title}</h3>
          <p>{voice.description}</p>
        </div>
      ))}
    </div>
  );
};

const BrandProfileSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-32" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);
```

## 4. Header/Navigation Pattern

### Before (Static Data)
```typescript
// components/layout/Header.tsx
import { useBrand, brandNames } from '@/contexts/BrandContext';

const Header = () => {
  const { selectedBrand, setSelectedBrand } = useBrand();
  
  return (
    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
      {brandNames.map(brand => (
        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
      ))}
    </Select>
  );
};
```

### After (Database with Dynamic Loading)
```typescript
// components/layout/Header.tsx
import { useBrand } from '@/contexts/BrandContext';
import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';

const Header = () => {
  const { selectedBrand, setSelectedBrand, availableBrands, isLoading } = useBrand();
  
  // Get brand display names
  const { data: brands = [] } = useQuery(
    ['brands'],
    brandService.getAllBrands,
    { staleTime: 15 * 60 * 1000 }
  );
  
  const brandMap = Object.fromEntries(
    brands.map(brand => [brand.slug, brand.name])
  );
  
  return (
    <Select 
      value={selectedBrand} 
      onValueChange={setSelectedBrand}
      disabled={isLoading}
    >
      {availableBrands.map(brandSlug => (
        <SelectItem key={brandSlug} value={brandSlug}>
          {brandMap[brandSlug] || brandSlug}
        </SelectItem>
      ))}
    </Select>
  );
};
```

## 5. Error Boundary Pattern

### Wrap Providers
```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrandProvider } from '@/contexts/BrandContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<AppErrorFallback />}>
        <BrandProvider>
          {/* Your app components */}
        </BrandProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
```

## 6. Loading State Components

### Create Reusable Skeletons
```typescript
// components/common/BrandDataSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const BrandProfileSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-32" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

export const BrandCampaignsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4 border rounded-lg space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    ))}
  </div>
);
```

## 7. Migration Checklist Template

For each component that uses brand data:

```typescript
// Component Migration Checklist
// File: [COMPONENT_PATH]

// ✅ 1. Import changes
// - Updated useBrand import to use new context
// - Added any new imports (Skeleton, LoadingSpinner, etc.)

// ✅ 2. Hook usage
// - Destructured isLoading and error from useBrand
// - Updated getBrandData call if needed

// ✅ 3. Loading state
// - Added loading condition and appropriate UI
// - Used skeleton or spinner as appropriate

// ✅ 4. Error handling
// - Added error condition and fallback UI
// - Included retry mechanism if needed

// ✅ 5. Data access
// - Verified all brandData property access still works
// - Added null checks if accessing optional properties

// ✅ 6. Testing
// - Tested loading state
// - Tested error state
// - Tested with real data
// - Tested brand switching

// ✅ 7. Performance
// - Verified no unnecessary re-renders
// - Added memoization if needed
// - Confirmed caching is working
```

## 8. Environment Variable Setup

```bash
# .env.local
# Feature flag to enable database brands
VITE_USE_DATABASE_BRANDS=false  # Start with false, switch to true when ready

# Supabase configuration (already exists)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 9. Testing Utilities

```typescript
// tests/utils/brandTestUtils.ts
import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { BrandProvider } from '@/contexts/BrandContext';

export const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export const renderWithBrandContext = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrandProvider>
        {component}
      </BrandProvider>
    </QueryClientProvider>
  );
};

export const mockBrandData = {
  profile: {
    id: 'test-brand',
    name: 'Test Brand',
    region: 'Test Region',
    businessArea: 'Test Business',
    financials: {
      annualSales: '$1M',
      targetSales: '$2M',
      growth: '5%'
    }
  },
  // ... rest of mock data
};
```

This template provides comprehensive patterns for migrating all types of components that use brand data.