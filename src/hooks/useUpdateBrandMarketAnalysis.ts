import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';
import type { BrandMarketAnalysis } from '@/types/brand';

interface UpdateMarketAnalysisParams {
  brandId: string;
  marketAnalysis: BrandMarketAnalysis;
}

export const useUpdateBrandMarketAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ brandId, marketAnalysis }: UpdateMarketAnalysisParams) => {
      return brandService.updateMarketAnalysis(brandId, marketAnalysis);
    },
    onSuccess: (_, { brandId }) => {
      // Invalidate brand queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Market analysis updated successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to update market analysis:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update market analysis',
        variant: 'destructive',
      });
    },
  });
};