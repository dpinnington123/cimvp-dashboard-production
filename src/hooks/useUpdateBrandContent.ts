// Hook for updating brand content with TanStack Query
// This hook provides a mutation for updating content items in the Campaign Planner

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBrandContent, updateContentStatus } from '@/services/contentService';
import { toast } from 'sonner';

interface UpdateBrandContentParams {
  contentId: string | number;
  updates: {
    name?: string;
    format?: string;
    type?: string;
    status?: 'live' | 'draft' | 'planned' | 'active';
    description?: string;
    quality_score?: number;
    cost?: number;
    audience?: string;
    key_actions?: string[];
    agencies?: string[];
    overall_score?: number;
    strategic_score?: number;
    customer_score?: number;
    execution_score?: number;
  };
}

export const useUpdateBrandContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, updates }: UpdateBrandContentParams) =>
      updateBrandContent(contentId, updates),
    
    onSuccess: (result, variables) => {
      if (result.data) {
        // Invalidate relevant queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['brand'] });
        queryClient.invalidateQueries({ queryKey: ['brandContent'] });
        queryClient.invalidateQueries({ queryKey: ['content'] });
        
        // Show success notification
        toast.success('Content updated successfully', {
          description: `Updated ${Object.keys(variables.updates).join(', ')}`
        });
      } else if (result.error) {
        toast.error('Failed to update content', {
          description: result.error.message
        });
      }
    },
    
    onError: (error: Error) => {
      console.error('Content update error:', error);
      toast.error('An error occurred', {
        description: error.message || 'Failed to update content'
      });
    }
  });
};

// Convenience hook specifically for status updates
export const useUpdateContentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contentId, status }: { contentId: string | number; status: 'live' | 'draft' | 'planned' | 'active' }) =>
      updateContentStatus(contentId, status),
    
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate relevant queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['brand'] });
        queryClient.invalidateQueries({ queryKey: ['brandContent'] });
        queryClient.invalidateQueries({ queryKey: ['content'] });
        
        // Show success notification
        toast.success('Status updated successfully', {
          description: `Changed to ${variables.status}`
        });
        
        console.log(`Content status updated to ${variables.status}`);
      } else if (result.error) {
        toast.error('Failed to update status', {
          description: result.error.message
        });
      }
    },
    
    onError: (error: Error) => {
      console.error('Status update error:', error);
      toast.error('An error occurred', {
        description: error.message || 'Failed to update status'
      });
    }
  });
};