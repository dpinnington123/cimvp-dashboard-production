import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateBrandStrategiesParams {
  brandId: string;
  strategies: any[];
}

export const useUpdateBrandStrategies = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, strategies }: UpdateBrandStrategiesParams) =>
      brandService.updateBrandStrategies(brandId, strategies),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Strategies updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update strategies',
        variant: 'destructive',
      });
    },
  });
};