import { supabase } from '@/lib/supabaseClient';

/**
 * Get the analysis status of a content item
 * 
 * @param contentId - The ID of the content to check
 * @returns The current analysis status
 */
export const getContentAnalysisStatus = async (
  contentId: string
): Promise<{ status: string, progress?: number, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('status, analysis_progress')
      .eq('id', contentId)
      .single();

    if (error) {
      throw error;
    }

    return { 
      status: data.status, 
      progress: data.analysis_progress, 
      error: null 
    };
  } catch (error) {
    console.error('Error getting content analysis status:', error);
    return { status: 'error', error: error as Error };
  }
};

/**
 * Start the content analysis process
 * This initiates the analysis workflow for the uploaded content
 * 
 * @param contentId - The ID of the content to analyze
 * @returns Success or failure status
 */
export const startContentAnalysis = async (
  contentId: string
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // First update the status to 'processing'
    const { error } = await supabase
      .from('content')
      .update({ 
        status: 'processing',
        analysis_progress: 0,
        analysis_started_at: new Date().toISOString()
      })
      .eq('id', contentId);

    if (error) {
      throw error;
    }

    // In a real implementation, this would trigger a background job or webhook
    // For now, we'll simulate this with a timeout that updates progress
    simulateAnalysisProgress(contentId);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error starting content analysis:', error);
    return { success: false, error: error as Error };
  }
};

/**
 * Get content analysis results
 * 
 * @param contentId - The ID of the content
 * @returns The analysis results
 */
export const getContentAnalysisResults = async (
  contentId: string
): Promise<{ data: unknown | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('content_analysis')
      .select('*')
      .eq('content_id', contentId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error getting content analysis results:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Helper function to simulate analysis progress updates
 * In a real implementation, this would be replaced by actual progress tracking
 * of a background job or webhook calls
 * 
 * @param contentId - The ID of the content being analyzed
 */
const simulateAnalysisProgress = (contentId: string) => {
  let progress = 0;
  
  const updateProgress = async () => {
    progress += 10;
    
    try {
      if (progress < 100) {
        await supabase
          .from('content')
          .update({ 
            analysis_progress: progress 
          })
          .eq('id', contentId);
          
        setTimeout(updateProgress, 1500); // Update every 1.5 seconds
      } else {
        // Final update when complete
        await supabase
          .from('content')
          .update({ 
            status: 'analyzed',
            analysis_progress: 100,
            analysis_completed_at: new Date().toISOString()
          })
          .eq('id', contentId);
          
        // Create mock analysis results
        await supabase
          .from('content_analysis')
          .insert({
            content_id: contentId,
            score: Math.floor(Math.random() * 100),
            strengths: ['Engaging headline', 'Good use of visuals', 'Clear call to action'],
            improvements: ['Could improve readability', 'Add more social proof', 'Consider A/B testing'],
            sentiment_score: (Math.random() * 2) - 1, // Between -1 and 1
            readability_score: Math.floor(Math.random() * 100),
            predicted_engagement: Math.floor(Math.random() * 100),
            created_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating analysis progress:', error);
      
      // Update status to error if we encounter issues
      await supabase
        .from('content')
        .update({ 
          status: 'error',
          analysis_progress: progress
        })
        .eq('id', contentId);
    }
  };
  
  // Start the progress updates
  setTimeout(updateProgress, 1500);
};

/**
 * Cancel an in-progress content analysis
 * 
 * @param contentId - The ID of the content being analyzed
 * @returns Success or failure status
 */
export const cancelContentAnalysis = async (
  contentId: string
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('content')
      .update({ 
        status: 'cancelled',
        analysis_completed_at: new Date().toISOString()
      })
      .eq('id', contentId)
      .eq('status', 'processing'); // Only cancel if it's currently processing

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error cancelling content analysis:', error);
    return { success: false, error: error as Error };
  }
}; 