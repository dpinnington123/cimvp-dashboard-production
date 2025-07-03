import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import type { BrandData } from '@/types/brand';
import { useAuth } from '@/hooks/useAuth';

// Feature flag to enable database brands
const USE_DATABASE_BRANDS = import.meta.env.VITE_USE_DATABASE_BRANDS === 'true';

// Fallback to static data if needed
import { brandsData, brandNames, regions } from '@/contexts/data/index';

interface BrandContextType {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  getBrandData: () => BrandData;
  isLoading: boolean;
  error: Error | null;
  availableBrands: string[];
  availableRegions: string[];
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: ReactNode;
}

// Empty brand data structure for loading states - stable reference
const EMPTY_BRAND_DATA: BrandData = {
  profile: {
    id: '',
    name: '',
    region: '',
    businessArea: '',
    financials: {
      annualSales: '$0',
      targetSales: '$0',
      growth: '0%'
    }
  },
  voice: [],
  objectives: [],
  messages: [],
  audiences: [],
  strategies: [],
  campaigns: [],
  content: [],
  overallScores: { overall: 0, strategic: 0, customer: 0, content: 0 },
  channelScores: {
    social: { overall: 0, strategic: 0, customer: 0, execution: 0 },
    email: { overall: 0, strategic: 0, customer: 0, execution: 0 },
    website: { overall: 0, strategic: 0, customer: 0, execution: 0 },
    digital: { overall: 0, strategic: 0, customer: 0, execution: 0 }
  },
  funnelData: [],
  // Add all optional fields to prevent undefined errors
  marketAnalysis: {
    marketSize: '',
    growthRate: '',
    keyTrends: [],
    opportunities: [],
    threats: []
  },
  customerAnalysis: {
    segments: [],
    insights: []
  },
  personas: [],
  performanceTimeData: [],
  customer_segments: [],
  customer_journey: [],
  market_analysis: {
    market_size: '',
    growth_rate: '',
    analysis_year: new Date().getFullYear()
  },
  competitors: []
};

export const DatabaseBrandProvider = ({ children }: BrandProviderProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('North America');
  const { session, user } = useAuth();

  // Only fetch data when user is authenticated
  const isAuthenticated = !!session;
  const userId = user?.id;

  // Reset selected brand when user changes
  useEffect(() => {
    if (!userId) {
      // Clear selection when user logs out
      setSelectedBrand('');
    }
  }, [userId]);

  // Fetch available brands
  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ['brands', userId], // Include user ID to prevent cross-user cache hits
    queryFn: brandService.getAllBrands,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAuthenticated && !!userId, // Only fetch when authenticated with user ID
  });

  // Fetch available regions
  const { data: regionsData = [], isLoading: regionsLoading } = useQuery({
    queryKey: ['regions', userId], // Include user ID to prevent cross-user cache hits
    queryFn: brandService.getAllRegions,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAuthenticated && !!userId, // Only fetch when authenticated with user ID
  });

  // Fetch selected brand data
  const { 
    data: brandData, 
    isLoading: brandDataLoading, 
    error 
  } = useQuery({
    queryKey: ['brand', selectedBrand, userId], // Include user ID to prevent cross-user cache hits
    queryFn: () => brandService.getBrandWithFullData(selectedBrand),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!selectedBrand && isAuthenticated && !!userId, // Only fetch when authenticated with user ID
    retry: USE_DATABASE_BRANDS ? 3 : 0,
    retryDelay: USE_DATABASE_BRANDS ? 1000 : 0,
  });

  const availableBrands = useMemo(() => 
    brands.map((brand) => brand.slug), 
    [brands]
  );

  // Set initial brand when brands are loaded and no brand is selected
  useEffect(() => {
    if (availableBrands.length > 0 && !selectedBrand && userId) {
      setSelectedBrand(availableBrands[0]);
    }
  }, [availableBrands, selectedBrand, userId]);

  const isLoading = brandsLoading || regionsLoading || brandDataLoading;


  const getBrandData = (): BrandData => {
    if (!brandData) {
      return EMPTY_BRAND_DATA;
    }
    return brandData as BrandData;
  };

  const handleSetSelectedBrand = (brandSlug: string) => {
    if (availableBrands.includes(brandSlug)) {
      setSelectedBrand(brandSlug);
    } else {
      console.warn(`Brand ${brandSlug} not found in available brands`);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        selectedBrand,
        setSelectedBrand: handleSetSelectedBrand,
        selectedRegion,
        setSelectedRegion,
        getBrandData,
        isLoading,
        error: error as Error | null,
        availableBrands,
        availableRegions: regionsData as string[]
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

// Static brand provider (fallback)
export const StaticBrandProvider = ({ children }: BrandProviderProps) => {
  const [selectedBrand, setSelectedBrand] = useState(brandNames[0]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);

  const getBrandData = (): BrandData => {
    return brandsData[selectedBrand];
  };

  return (
    <BrandContext.Provider
      value={{
        selectedBrand,
        setSelectedBrand,
        selectedRegion,
        setSelectedRegion,
        getBrandData,
        isLoading: false,
        error: null,
        availableBrands: brandNames,
        availableRegions: regions
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

// Main provider with feature flag
export const BrandProvider = ({ children }: BrandProviderProps) => {
  if (USE_DATABASE_BRANDS) {
    return <DatabaseBrandProvider>{children}</DatabaseBrandProvider>;
  }
  return <StaticBrandProvider>{children}</StaticBrandProvider>;
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  
  return context;
};

// Backwards compatibility exports
export { brandNames, regions }; 