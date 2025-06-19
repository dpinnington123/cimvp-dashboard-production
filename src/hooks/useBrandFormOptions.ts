import { useMemo } from 'react';
import { useBrand } from '@/contexts/BrandContext';

// Define a standard option type for select components
type SelectOption = {
  value: string;
  label: string;
};

/**
 * A hook that provides dropdown options from the current brand data
 * for use in forms throughout the application.
 */
export const useBrandFormOptions = () => {
  // Get the current brand data from context
  const { getBrandData } = useBrand();
  const brandData = getBrandData();

  // Generate campaign options
  const campaignOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.campaigns?.length) return [];
    
    return brandData.campaigns.map(campaign => ({
      value: (campaign as any).id || campaign.name, // Use ID if available, fallback to name
      label: campaign.name
    }));
  }, [brandData?.campaigns]);

  // Generate audience options
  const audienceOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.audiences?.length) return [];
    
    return brandData.audiences.map(audience => ({
      value: audience.id,
      label: audience.text
    }));
  }, [brandData?.audiences]);

  // Generate strategy options
  const strategyOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.strategies?.length) return [];
    
    return brandData.strategies.map(strategy => ({
      value: strategy.id,
      label: strategy.name
    }));
  }, [brandData?.strategies]);

  // Generate objective options
  const objectiveOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.objectives?.length) return [];
    
    return brandData.objectives.map(objective => ({
      value: objective.id,
      label: objective.text
    }));
  }, [brandData?.objectives]);

  // Generate agency options (de-duplicated)
  const agencyOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.campaigns?.length) return [];
    
    // Collect all agencies from all campaigns
    const agencies: string[] = [];
    brandData.campaigns.forEach(campaign => {
      if (campaign.agencies && campaign.agencies.length > 0) {
        campaign.agencies.forEach(agency => {
          if (!agencies.includes(agency)) {
            agencies.push(agency);
          }
        });
      }
    });
    
    // Sort alphabetically
    agencies.sort();
    
    // Convert to options format
    return agencies.map(agency => ({
      value: agency,
      label: agency
    }));
  }, [brandData?.campaigns]);

  // Generate funnel alignment options
  const funnelAlignmentOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.funnelData?.length) return [];
    
    return brandData.funnelData.map(funnelStep => ({
      value: funnelStep.name,
      label: funnelStep.name
    }));
  }, [brandData?.funnelData]);

  // Generate format options (de-duplicated)
  const formatOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.content?.length) return [];
    
    // Extract unique formats
    const uniqueFormats = Array.from(
      new Set(brandData.content.map(item => item.format))
    ).filter(Boolean) as string[];
    
    // Sort alphabetically
    uniqueFormats.sort();
    
    return uniqueFormats.map(format => ({
      value: format,
      label: format
    }));
  }, [brandData?.content]);

  // Generate type options
  const typeOptions = useMemo<SelectOption[]>(() => {
    if (!brandData?.content?.length) return [];
    
    // Extract unique types
    const uniqueTypes = Array.from(
      new Set(brandData.content.map(item => item.type))
    ).filter(Boolean) as string[];
    
    return uniqueTypes.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1) // Capitalize first letter
    }));
  }, [brandData?.content]);

  return {
    campaignOptions,
    audienceOptions,
    strategyOptions,
    objectiveOptions,
    agencyOptions,
    funnelAlignmentOptions,
    formatOptions,
    typeOptions
  };
};

export default useBrandFormOptions; 