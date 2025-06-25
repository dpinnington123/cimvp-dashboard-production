import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateBrandObjectivesParams {
  brandId: string;
  objectives: any[];
}

export const useUpdateBrandObjectives = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, objectives }: UpdateBrandObjectivesParams) =>
      brandService.updateBrandObjectives(brandId, objectives),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Objectives updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update objectives',
        variant: 'destructive',
      });
    },
  });
};