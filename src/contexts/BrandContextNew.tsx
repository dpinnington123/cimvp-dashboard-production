// New BrandContext with database integration
// This will replace the existing BrandContext.tsx

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import type { BrandData } from '@/types/brand';

// Feature flag to enable database brands
const USE_DATABASE_BRANDS = process.env.VITE_USE_DATABASE_BRANDS === 'true';

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

// Empty brand data structure for loading states
const getEmptyBrandData = (): BrandData => ({
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
  overallScores: { overall: 0, strategic: 0, customer: 0, execution: 0 },
  channelScores: [],
  funnelData: []
});

export const DatabaseBrandProvider = ({ children }: BrandProviderProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('eco-solutions');
  const [selectedRegion, setSelectedRegion] = useState<string>('North America');

  // Fetch available brands
  const { data: brands = [], isLoading: brandsLoading } = useQuery(
    ['brands'],
    brandService.getAllBrands,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  // Fetch available regions
  const { data: regionsData = [], isLoading: regionsLoading } = useQuery(
    ['regions'],
    brandService.getAllRegions,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  // Fetch selected brand data
  const { 
    data: brandData, 
    isLoading: brandDataLoading, 
    error 
  } = useQuery(
    ['brand', selectedBrand],
    () => brandService.getBrandWithFullData(selectedBrand),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      enabled: !!selectedBrand,
      retry: 3,
      retryDelay: 1000,
    }
  );

  const availableBrands = useMemo(() => 
    brands.map(brand => brand.slug), 
    [brands]
  );

  const isLoading = brandsLoading || regionsLoading || brandDataLoading;

  const getBrandData = (): BrandData => {
    if (!brandData || isLoading) {
      return getEmptyBrandData();
    }
    return brandData;
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
        availableRegions: regionsData
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