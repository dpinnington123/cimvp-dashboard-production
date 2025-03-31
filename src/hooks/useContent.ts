import { useQuery } from '@tanstack/react-query';
import { getContent, getContentById } from '../services/contentService';

// Unique query key for all content
const contentListQueryKey = ['content', 'list'];
// Unique query key pattern for single content items
const contentDetailQueryKey = (id: number) => ['content', 'detail', id];

/**
 * Custom hook to fetch all content items using React Query.
 * Handles caching, refetching, loading, and error states.
 */
export const useContentList = () => {
  return useQuery({
    queryKey: contentListQueryKey, // Unique key for this query
    queryFn: getContent, // The function that fetches the data
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