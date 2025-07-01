import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { BrandContent } from '@/types/BrandData';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to add new content to a brand
 */
export function useAddBrandContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ brandId, content }: { brandId: string; content: Partial<BrandContent> }) => {
      return await brandService.addBrandContent(brandId, content);
    },
    onSuccess: async (data, variables) => {
      // Invalidate and refetch brand data to include new content
      await queryClient.invalidateQueries({ queryKey: ['brand'] });
      
      toast({
        title: 'Success',
        description: 'Content added successfully',
      });
    },
    onError: (error) => {
      console.error('Error adding content:', error);
      toast({
        title: 'Error',
        description: 'Failed to add content. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update existing content
 */
export function useUpdateBrandContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ contentId, updates }: { contentId: string; updates: Partial<BrandContent> }) => {
      return await brandService.updateBrandContent(contentId, updates);
    },
    onSuccess: async () => {
      // Invalidate and refetch brand data to reflect updates
      await queryClient.invalidateQueries({ queryKey: ['brand'] });
      
      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete content
 */
export function useDeleteBrandContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contentId: string) => {
      return await brandService.deleteBrandContent(contentId);
    },
    onSuccess: async () => {
      // Invalidate and refetch brand data to remove deleted content
      await queryClient.invalidateQueries({ queryKey: ['brand'] });
      
      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update only the status of content (commonly used operation)
 */
export function useUpdateContentStatus() {
  const { mutate: updateContent } = useUpdateBrandContent();

  return useMutation({
    mutationFn: async ({ contentId, status }: { contentId: string; status: string }) => {
      updateContent({ contentId, updates: { status } });
    },
  });
}