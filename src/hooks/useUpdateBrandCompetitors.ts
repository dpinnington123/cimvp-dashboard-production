import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';
import type { BrandCompetitor } from '@/types/brand';

interface UpdateCompetitorsParams {
  brandId: string;
  competitors: BrandCompetitor[];
}

export const useUpdateBrandCompetitors = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ brandId, competitors }: UpdateCompetitorsParams) => {
      return brandService.updateCompetitors(brandId, competitors);
    },
    onSuccess: (_, { brandId }) => {
      // Invalidate brand queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Competitors updated successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to update competitors:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update competitors',
        variant: 'destructive',
      });
    },
  });
};