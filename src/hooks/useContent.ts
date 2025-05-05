import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContentById, getContent, deleteContentById } from '@/services/contentService';
import { uploadContent, getProcessedContent, ContentFile, ContentMetadata, ProcessedContent } from '@/services/uploadService';

// Unique query key for all content
const contentListQueryKey = ['content-list'];
// Unique query key pattern for single content items
const contentDetailQueryKey = (id: number) => ['content', 'detail', id];

/**
 * Custom hook to fetch all content items using React Query.
 * Handles caching, refetching, loading, and error states.
 */
export const useContentList = () => {
  return useQuery({
    queryKey: contentListQueryKey, // Unique key for this query
    queryFn: getContent,
    // Optional: Configure stale time, cache time, refetch behavior, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  });
};

/**
 * Custom hook to fetch a single content item by its ID using React Query.
 * Handles caching, refetching, loading, and error states for individual items.
 * @param contentId The ID of the content item to fetch.
 * @param options Optional query options, e.g., { enabled: false } to disable automatic fetching.
 */
export const useContentDetail = (contentId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    // Query key includes the specific ID
    queryKey: contentDetailQueryKey(contentId!), // Use non-null assertion assuming enabled logic handles null
    // Pass the ID to the service function
    queryFn: () => getContentById(contentId!), // Use non-null assertion here too
    // Enable the query only when contentId is a valid number and options.enabled is not false
    enabled: typeof contentId === 'number' && contentId > 0 && (options?.enabled ?? true),
    // Optional: Configure stale time, cache time, etc. specific to detail view
    // staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useContent = () => {
  const queryClient = useQueryClient();
  
  // Fetch a single piece of content by ID
  const useContentQuery = (id: number) => {
    return useQuery({
      queryKey: ['content', id],
      queryFn: () => getContentById(id),
      enabled: !!id,
    });
  };

  // Fetch all content with optional filters
  const useAllContentQuery = (filters?: Record<string, any>) => {
    return useQuery({
      queryKey: ['allContent', filters],
      queryFn: () => getContent(), // No filters support yet, using standard getContent
    });
  };
  
  // Fetch processed content (from content uploads)
  const useProcessedContentQuery = (limit?: number) => {
    return useQuery({
      queryKey: ['processedContent', limit],
      queryFn: () => getProcessedContent(limit),
    });
  };
  
  // Upload content mutation
  const useUploadContentMutation = () => {
    return useMutation({
      mutationFn: ({ files, metadata }: { files: ContentFile[], metadata: ContentMetadata }) => 
        uploadContent(files, metadata),
      onSuccess: (data) => {
        // If we have data, invalidate relevant queries to refetch data
        if (data.data) {
          queryClient.invalidateQueries({ queryKey: ['processedContent'] });
          queryClient.invalidateQueries({ queryKey: ['allContent'] });
          queryClient.invalidateQueries({ queryKey: contentListQueryKey });
        }
      },
    });
  };
  
  // Delete content mutation
  const useDeleteContentMutation = () => {
    return useMutation({
      mutationFn: (id: number) => deleteContentById(id),
      onSuccess: (result, id) => {
        // Log success result
        console.log(`Delete mutation success result:`, result);
        
        // Invalidate all potentially affected queries
        queryClient.invalidateQueries({ queryKey: ['processedContent'] });
        queryClient.invalidateQueries({ queryKey: ['allContent'] });
        queryClient.invalidateQueries({ queryKey: contentListQueryKey });
        queryClient.invalidateQueries({ queryKey: contentDetailQueryKey(id) });
        
        // Force content list refetch
        queryClient.refetchQueries({ queryKey: contentListQueryKey });
        
        // If delete was not successful, throw error to trigger onError
        if (!result.success) {
          throw result.error || new Error('Delete operation failed with unknown error');
        }
      },
      onError: (error, id) => {
        console.error(`Error in delete mutation for content ${id}:`, error);
        // We can add additional error handling here if needed
      }
    });
  };
  
  return {
    useContentQuery,
    useAllContentQuery,
    useProcessedContentQuery,
    useUploadContentMutation,
    useDeleteContentMutation,
  };
};

export default useContent;

// You might add mutation hooks here later using useMutation for creating, updating, or deleting content.
// Example:
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createContent } from '../services/contentService'; // Assuming createContent exists
//
// export const useCreateContent = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createContent,
//     onSuccess: () => {
//       // Invalidate and refetch the content list query after a successful creation
//       queryClient.invalidateQueries({ queryKey: contentListQueryKey });
//     },
//     // Add onError, onMutate, etc. as needed
//   });
// }; 