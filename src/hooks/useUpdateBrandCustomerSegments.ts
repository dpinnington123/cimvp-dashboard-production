import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateBrandCustomerSegmentsParams {
  brandId: string;
  customerSegments: any[];
}

export const useUpdateBrandCustomerSegments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, customerSegments }: UpdateBrandCustomerSegmentsParams) =>
      brandService.updateBrandCustomerSegments(brandId, customerSegments),
    onSuccess: (_, variables) => {
      // Invalidate all brand-related queries
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Customer segments updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update customer segments',
        variant: 'destructive',
      });
    },
  });
};