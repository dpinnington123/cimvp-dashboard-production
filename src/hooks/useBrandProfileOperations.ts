import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for brand profile operations (basic info, financials, voice attributes)
 */

interface UpdateBrandBasicInfoParams {
  brandId: string;
  updates: {
    name?: string;
    business_area?: string;
    region?: string;
  };
}

interface UpdateBrandFinancialsParams {
  brandId: string;
  financials: {
    annualSales?: string;
    targetSales?: string;
    growth?: string;
  };
}

interface UpdateBrandVoiceAttributesParams {
  brandId: string;
  voiceAttributes: any[];
}

export const useUpdateBrandBasicInfo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, updates }: UpdateBrandBasicInfoParams) =>
      brandService.updateBrandBasicInfo(brandId, updates),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Brand information updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update brand information',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBrandFinancials = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, financials }: UpdateBrandFinancialsParams) =>
      brandService.updateBrandFinancials(brandId, financials),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Financial data updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update financial data',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBrandVoiceAttributes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, voiceAttributes }: UpdateBrandVoiceAttributesParams) =>
      brandService.updateBrandVoiceAttributes(brandId, voiceAttributes),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Voice attributes updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update voice attributes',
        variant: 'destructive',
      });
    },
  });
};