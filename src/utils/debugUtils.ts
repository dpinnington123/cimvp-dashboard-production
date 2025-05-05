import { supabase } from '../lib/supabaseClient';

/**
 * Debugging utility to check if a content record exists
 * @param contentId - The ID of the content to check
 * @returns Promise with debug information
 */
export const debugContentExists = async (contentId: number) => {
  console.log(`🔍 Checking if content with ID ${contentId} exists...`);
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting current user:', userError);
      return { exists: false, error: userError };
    }
    
    console.log(`👤 Current user ID: ${user?.id}`);
    
    // Try to get the content record
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('id, content_name, client_id, created_at')
      .eq('id', contentId)
      .single();
    
    if (contentError) {
      console.error(`❌ Error checking content with ID ${contentId}:`, contentError);
      
      if (contentError.code === 'PGRST116') {
        console.log('💡 Error indicates content does not exist or you do not have permission');
      }
      
      if (contentError.message.includes('RLS')) {
        console.log('💡 Error indicates Row Level Security policy blocking access');
      }
      
      return { exists: false, error: contentError };
    }
    
    if (contentData) {
      console.log(`✅ Content found:`, contentData);
      
      // Check if user owns this content (for RLS debugging)
      if (contentData.client_id !== user?.id) {
        console.log(`⚠️ RLS Warning: Content client_id (${contentData.client_id}) does not match current user ID (${user?.id})`);
      }
      
      return { exists: true, data: contentData };
    }
    
    console.log(`❌ Content with ID ${contentId} not found`);
    return { exists: false };
    
  } catch (error) {
    console.error('❌ Unexpected error checking content:', error);
    return { exists: false, error };
  }
};

/**
 * Tests delete permissions by attempting a dummy delete
 * @param contentId - The ID of the content to test deletion rights on
 * @returns Promise with debug information
 */
export const debugDeletePermission = async (contentId: number) => {
  console.log(`🔍 Testing delete permission for content ID ${contentId}...`);
  
  try {
    // First verify the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting current user:', userError);
      return { canDelete: false, error: userError };
    }
    
    console.log(`👤 Current user ID: ${user?.id}`);
    
    // Try to get the content record first to check if it exists
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('id, content_name, client_id')
      .eq('id', contentId)
      .single();
    
    if (contentError) {
      console.error(`❌ Cannot check content - either it doesn't exist or you don't have permission:`, contentError);
      return { canDelete: false, error: contentError };
    }
    
    if (contentData.client_id !== user?.id) {
      console.log(`⚠️ RLS Warning: Content client_id (${contentData.client_id}) does not match current user ID (${user?.id})`);
    }
    
    // Now try a dummy delete operation without actually deleting
    // This will tell us if RLS would allow the delete
    const testParams = { id: contentId, dryRun: true };
    
    const { data: deleteTestData, error: deleteTestError } = await supabase.rpc(
      'test_delete_permission',
      testParams
    );
    
    if (deleteTestError) {
      console.error('❌ Delete permission test failed:', deleteTestError);
      
      if (deleteTestError.message.includes('function') && deleteTestError.message.includes('does not exist')) {
        console.log(`💡 The 'test_delete_permission' function doesn't exist in your database. You may need to create it.`);
      }
      
      // Try an alternative approach if the RPC function doesn't exist
      console.log('🔄 Trying alternative permission check...');
      
      // Try to get the table's RLS policies
      const { data: rlsData, error: rlsError } = await supabase
        .from('content')
        .select('id')
        .eq('id', contentId)
        .limit(1);
      
      if (rlsError) {
        console.error('❌ Alternative check failed:', rlsError);
        return { canDelete: false, error: deleteTestError };
      }
      
      console.log('✅ You have at least SELECT permission on this record');
      console.log('⚠️ Cannot conclusively determine DELETE permission without testing');
      return { canDelete: 'unknown', checkResult: 'SELECT permission confirmed, DELETE unknown' };
    }
    
    console.log('✅ You have permission to delete this content');
    return { canDelete: true, result: deleteTestData };
    
  } catch (error) {
    console.error('❌ Unexpected error testing delete permission:', error);
    return { canDelete: false, error };
  }
}; 