import { supabase } from '@/lib/supabaseClient';

/**
 * A utility function to check storage permissions
 */
export const checkStoragePermissions = async (): Promise<void> => {
  try {
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Auth status:', !!session);
    
    if (session) {
      console.log('User is authenticated with ID:', session.user.id);
    } else {
      console.error('No active session found!');
      return;
    }

    // List buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
    } else {
      console.log('Available buckets:', buckets.map(b => b.name));
    }

    // Try to list files in client-content bucket
    const { data: files, error: filesError } = await supabase
      .storage
      .from('client-content')
      .list();
    
    if (filesError) {
      console.error('Error listing files in client-content bucket:', filesError);
    } else {
      console.log('Files in client-content bucket:', files);
    }

    // Check bucket policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies') // Note: You may need to create this function in Supabase
      .eq('schema', 'storage')
      .eq('table', 'objects')
      .select();
    
    if (policiesError) {
      console.error('Error getting policies (this might fail if the RPC function doesn\'t exist):', policiesError);
    } else {
      console.log('Storage policies:', policies);
    }

  } catch (error) {
    console.error('Error checking permissions:', error);
  }
};

// Export a function to run the check
export const testStoragePermissions = () => {
  console.log('Testing storage permissions...');
  checkStoragePermissions().then(() => {
    console.log('Storage permission check complete');
  });
}; 