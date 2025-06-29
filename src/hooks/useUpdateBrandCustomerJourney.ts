import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateBrandCustomerJourneyParams {
  brandId: string;
  customerJourney: any[];
}

export const useUpdateBrandCustomerJourney = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, customerJourney }: UpdateBrandCustomerJourneyParams) =>
      brandService.updateBrandCustomerJourney(brandId, customerJourney),
    onSuccess: (_, variables) => {
      // Invalidate all brand-related queries
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Customer journey updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update customer journey',
        variant: 'destructive',
      });
    },
  });
};