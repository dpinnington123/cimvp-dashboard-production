import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';
import type { BrandSWOT } from '@/types/brand';

interface UpdateSwotParams {
  brandId: string;
  swotData: BrandSWOT;
}

export const useUpdateBrandSwot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ brandId, swotData }: UpdateSwotParams) => {
      return brandService.updateSwotData(brandId, swotData);
    },
    onSuccess: (_, { brandId }) => {
      // Invalidate brand queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'SWOT analysis updated successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to update SWOT data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update SWOT analysis',
        variant: 'destructive',
      });
    },
  });
};