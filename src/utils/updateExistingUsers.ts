import { supabase } from '../lib/supabaseClient';

/**
 * Updates an existing user's metadata to include name information
 * 
 * @param userId The ID of the user to update
 * @param firstName The user's first name
 * @param lastName The user's last name
 * @returns Success status and any error
 */
export const updateUserMetadata = async (
  userId: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // Get admin permissions to update user
    // Note: This should only be called server-side in a secure environment
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`
      }
    });

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { success: false, error: error as Error };
  }
};

/**
 * Alternative client-side approach for a logged-in user to update their own metadata
 */
export const updateCurrentUserMetadata = async (
  firstName: string,
  lastName: string
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // First check if we have a valid session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw sessionError;
    }
    
    if (!sessionData.session) {
      throw new Error('No active session found. Please log in again.');
    }
    
    // Now update the user metadata with confidence that we have a session
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`
      }
    });

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating current user metadata:', error);
    return { success: false, error: error as Error };
  }
}; 