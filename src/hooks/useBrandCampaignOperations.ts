import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';
import type { Campaign } from '@/types/brand';

/**
 * Hook for campaign CRUD operations
 */

interface AddCampaignParams {
  brandId: string;
  campaign: Partial<Campaign>;
}

interface UpdateCampaignParams {
  campaignId: string;
  updates: Partial<Campaign>;
  brandSlug?: string;
}

export const useAddCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, campaign }: AddCampaignParams) =>
      brandService.addCampaign(brandId, campaign),
    onSuccess: async (data, variables) => {
      // Get brand slug from brand ID
      const brands = queryClient.getQueryData(['brands']) as any[];
      const brandSlug = brands?.find((b: any) => b.id === variables.brandId)?.slug;
      
      // Invalidate the specific brand query
      if (brandSlug) {
        await queryClient.invalidateQueries({ 
          queryKey: ['brand', brandSlug]
        });
      }
      
      // Also invalidate all brand queries
      await queryClient.invalidateQueries({ 
        queryKey: ['brand']
      });
      
      // Force immediate refetch
      await queryClient.refetchQueries({ 
        queryKey: ['brand'],
        exact: false,
        type: 'active'
      });
      
      toast({
        title: 'Success',
        description: 'Campaign created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create campaign',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ campaignId, updates }: UpdateCampaignParams) =>
      brandService.updateCampaign(campaignId, updates),
    onSuccess: async (data, variables) => {
      // Invalidate the specific brand query
      if (variables.brandSlug) {
        await queryClient.invalidateQueries({ 
          queryKey: ['brand', variables.brandSlug]
        });
      }
      
      // Also invalidate all brand queries
      await queryClient.invalidateQueries({ 
        queryKey: ['brand']
      });
      
      // Force immediate refetch
      await queryClient.refetchQueries({ 
        queryKey: ['brand'],
        exact: false,
        type: 'active'
      });
      
      toast({
        title: 'Success',
        description: 'Campaign updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update campaign',
        variant: 'destructive',
      });
    },
  });
};

interface DeleteCampaignParams {
  campaignId: string;
  forceDelete?: boolean;
  brandSlug?: string; // Add brand slug to know which query to invalidate
}

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ campaignId, forceDelete = false }: DeleteCampaignParams) =>
      brandService.deleteCampaign(campaignId, forceDelete),
    onSuccess: async (data, variables) => {
      if (data.hasContent && !data.contentCount) {
        // This means content check was requested but not forced
        return;
      }
      
      // Invalidate the specific brand query to ensure UI updates
      if (variables.brandSlug) {
        await queryClient.invalidateQueries({ 
          queryKey: ['brand', variables.brandSlug]
        });
      }
      
      // Also invalidate all brand queries as a fallback
      await queryClient.invalidateQueries({ 
        queryKey: ['brand']
      });
      
      // Force immediate refetch of active queries
      await queryClient.refetchQueries({ 
        queryKey: ['brand'],
        exact: false,
        type: 'active'
      });
      
      toast({
        title: 'Success',
        description: 'Campaign deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete campaign',
        variant: 'destructive',
      });
    },
  });
};