import React, { createContext, useContext, useState, ReactNode } from 'react';
import { brandsData, brandNames, regions } from '@/data/index';
import type { BrandData } from '@/types/brand';

interface BrandContextType {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  getBrandData: () => BrandData;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: ReactNode;
}

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const [selectedBrand, setSelectedBrand] = useState(brandNames[0]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);

  // Function to get brand data based on current selection
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
        getBrandData
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  
  return context;
};

// Export the available brands and regions for use in components
export { brandNames, regions }; 