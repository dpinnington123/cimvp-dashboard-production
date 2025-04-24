import { useQuery } from '@tanstack/react-query';
import { getScoresByContentId, getCategoryReviewSummaries, CategoryReviewSummary } from '../services/scoreService';

// Unique query key pattern for scores associated with a specific content item
const scoresByContentQueryKey = (contentId: number) => ['scores', 'byContent', contentId];
const categoryReviewSummariesQueryKey = (contentId: number) => ['categoryReviewSummaries', 'byContent', contentId];

/**
 * Custom hook to fetch scores for a specific content item using React Query.
 * This now works with the updated scoreService which joins scores through content_reviews.
 * Handles caching, refetching, loading, and error states.
 * @param contentId The ID of the content item for which to fetch scores.
 * @param options Optional query options, e.g., { enabled: false } to disable automatic fetching.
 */
export const useScores = (contentId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    // Query key includes the specific content ID
    queryKey: scoresByContentQueryKey(contentId!), // Use non-null assertion assuming enabled logic handles null
    // Pass the content ID to the service function
    queryFn: () => getScoresByContentId(contentId!), // Use non-null assertion here too
    // Enable the query only when contentId is a valid number and options.enabled is not false
    enabled: typeof contentId === 'number' && contentId > 0 && (options?.enabled ?? true),
    // Optional: Configure stale time, cache time, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to fetch category review summaries for a specific content item using React Query.
 * These summaries contain pre-calculated average scores for each category.
 * @param contentId The ID of the content item for which to fetch category review summaries.
 * @param options Optional query options, e.g., { enabled: false } to disable automatic fetching.
 */
export const useCategoryReviewSummaries = (contentId: number | null, options?: { enabled?: boolean }) => {
  return useQuery<CategoryReviewSummary[]>({
    queryKey: categoryReviewSummariesQueryKey(contentId!),
    queryFn: () => getCategoryReviewSummaries(contentId!),
    enabled: typeof contentId === 'number' && contentId > 0 && (options?.enabled ?? true),
  });
};

// Potential future hooks for working with content reviews could be added here
// export const useContentReviews = (contentId: number | null, options?: { enabled?: boolean }) => { ... }; 