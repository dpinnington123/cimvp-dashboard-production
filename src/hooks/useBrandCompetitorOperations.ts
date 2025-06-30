import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';
import type { BrandCompetitor } from '@/types/brand';

/**
 * Hook for individual brand competitor operations (add, update, delete)
 * Uses safe CRUD operations instead of DELETE-then-INSERT pattern
 */

interface AddCompetitorParams {
  brandId: string;
  competitor: BrandCompetitor;
}

interface UpdateCompetitorParams {
  competitorId: string;
  updates: Partial<BrandCompetitor>;
}

interface DeleteCompetitorParams {
  competitorId: string;
  brandId: string;
}

export const useAddBrandCompetitor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, competitor }: AddCompetitorParams) =>
      brandService.addCompetitor(brandId, competitor),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Competitor added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add competitor',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBrandCompetitor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ competitorId, updates }: UpdateCompetitorParams) =>
      brandService.updateSingleCompetitor(competitorId, updates),
    onSuccess: () => {
      // Invalidate all brand queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Competitor updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update competitor',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBrandCompetitor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ competitorId }: DeleteCompetitorParams) =>
      brandService.deleteCompetitor(competitorId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Competitor deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete competitor',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for safe batch update of all competitors
 * Uses the new safeUpdateRelationalData utility
 */
interface SafeUpdateCompetitorsParams {
  brandId: string;
  competitors: BrandCompetitor[];
}

export const useSafeBatchUpdateCompetitors = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, competitors }: SafeUpdateCompetitorsParams) =>
      brandService.safeUpdateCompetitors(brandId, competitors),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'All competitors updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update competitors',
        variant: 'destructive',
      });
    },
  });
};