import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export interface ContentMetadata {
  title: string;
  description: string;
  category: string;
  audience: string;
  businessObjective: string;
  contentFormat: string;
  tags: string[];
  publishDate: string;
  expiryDate?: string;
  location?: string;
  campaign?: string;
  agency?: string;
  cost?: string;
  contentType?: string;
}

export interface ContentFile {
  file: File;
  id: string;
  preview?: string;
}

export interface ProcessedContent {
  id: string;
  metadata: ContentMetadata;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    bucket_id?: string;
    storage_path?: string;
  }[];
  createdAt: string;
  status: 'processing' | 'analyzed' | 'error';
}

/**
 * Uploads a file to Supabase storage
 * 
 * @param file - The file to upload
 * @param subpath - Optional subfolder within the client-content bucket (defaults to empty string)
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, subpath = ''): Promise<{ url: string, bucket_id: string, storage_path: string, error: Error | null }> => {
  try {
    // Check if user is authenticated with more detailed logging
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session retrieval error:', sessionError);
      throw sessionError;
    }
    
    if (!session) {
      console.error('No active session found for file upload');
      throw new Error('User must be authenticated to upload files');
    }

    // Log auth details for debugging
    console.log('Session found for file upload:', {
      userId: session.user.id,
      hasAccessToken: !!session.access_token,
      expiresAt: session.expires_at
    });
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Structure path to include user ID for RLS policies
    // Format: userId/fileName
    const filePath = `${session.user.id}/${fileName}`;
    
    console.log('Attempting to upload file to path:', filePath);

    // Set custom headers to pass auth context if needed
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false
    };

    // Define the bucket name
    const bucketName = 'client-content';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, uploadOptions);

    if (error) {
      console.error('Detailed upload error:', JSON.stringify(error, null, 2));
      
      // Provide more specific error information
      if (error.message.includes('permission') || error.message.includes('authorized')) {
        console.error('Storage permission error. This could be due to:');
        console.error('1. Incorrect storage bucket RLS policies');
        console.error('2. User not having permission to this bucket');
        console.error('3. Misconfigured storage permissions');
      }
      
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('File uploaded successfully:', urlData.publicUrl);
    return { 
      url: urlData.publicUrl, 
      bucket_id: bucketName, 
      storage_path: filePath, 
      error: null 
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { 
      url: '', 
      bucket_id: '', 
      storage_path: '', 
      error: error as Error 
    };
  }
};

/**
 * Stores content metadata in the database
 * 
 * @param metadata - Content metadata
 * @param files - Array of uploaded file information
 * @returns The newly created content record
 */
export const storeContentMetadata = async (
  metadata: ContentMetadata,
  files: { name: string; type: string; size: number; url: string; bucket_id?: string; storage_path?: string; }[]
): Promise<{ data: ProcessedContent | null, error: Error | null }> => {
  try {
    // Get the current user with more detailed logging
    const authResponse = await supabase.auth.getUser();
    console.log('Auth response structure:', JSON.stringify(Object.keys(authResponse), null, 2));
    console.log('Auth data structure:', JSON.stringify(Object.keys(authResponse.data || {}), null, 2));
    
    const { data: { user } } = authResponse;
    
    if (!user) {
      console.error('No authenticated user found!');
      throw new Error('User must be authenticated to upload content');
    }
    
    // Log more details about the user to diagnose RLS issues
    console.log('Authenticated user details:', {
      id: user.id,
      email: user.email,
      role: user.role,
      app_metadata: user.app_metadata,
      aud: user.aud
    });
    
    // Get session to verify active session exists
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session found!');
      throw new Error('Active session required for database operations');
    }
    
    console.log('Active session found with ID:', session.access_token ? 'Token exists' : 'No token');
    
    // CRITICAL: For RLS policy to work, client_id must EXACTLY match auth.uid()
    // Ensure we're using the UUID in the correct format for client_id
    const userId = user.id;
    console.log('Using user ID for client_id:', userId);
    
    // Use bucket information from the first file (if available)
    const firstFile = files.length > 0 ? files[0] : null;
    const bucketId = firstFile?.bucket_id || null;
    const filePath = firstFile?.storage_path || null;
    
    console.log('Creating insert data with content_name:', metadata.title || 'Untitled Content');
    console.log('Using bucket_id:', bucketId);
    console.log('Using file_storage_path:', filePath);
    
    // First, let's try to directly access the table (this should fail if it's a pure RLS issue)
    const testResult = await supabase
      .from('content')
      .select('count')
      .limit(1);
    
    console.log('Test table access result:', testResult);
    
    // Create insert data structure matching ONLY the actual database schema fields
    const insertData = {
      // Required fields
      content_name: metadata.title || 'Untitled Content', // REQUIRED FIELD
      
      // Optional fields
      agency: metadata.agency || null,
      audience: metadata.audience || null,
      bucket_id: bucketId,
      campaign_aligned_to: metadata.campaign || null,
      client_id: userId, // Must match auth.uid()
      content_objectives: metadata.businessObjective || null,
      expiry_date: metadata.expiryDate || null,
      file_storage_path: filePath,
      format: metadata.contentFormat || null,
      funnel_alignment: metadata.campaign || null,
      strategy_aligned_to: metadata.businessObjective || null,
      status: 'processing',
      type: metadata.contentType || null
    };
    
    console.log('Content data being inserted:', JSON.stringify(insertData, null, 2));
    
    // Try an upsert in case the issue is with insert specifically
    const { data, error } = await supabase
      .from('content')
      .upsert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Database insertion error details:', JSON.stringify(error, null, 2));
      
      if (error.code === '42501') {
        console.error('RLS policy violation. This typically means:');
        console.error('1. The client_id might not match the authenticated user ID');
        console.error('2. The RLS policy might have additional requirements');
        console.error('3. The user might not have the right role/permissions');
        
        console.error('Current auth.uid():', userId);
        console.error('Check if client_id and auth.uid() match EXACTLY (including format)');
        console.error('Check required fields: content_name must not be null');
        
        // Try a fallback approach using a raw SQL query via RPC
        console.log('Attempting fallback insertion via RPC...');
        
        // Warning: This is a last resort and should be replaced with a proper solution
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('insert_content', {
            p_content_name: insertData.content_name,
            p_client_id: insertData.client_id,
            p_status: insertData.status
          });
          
          if (rpcError) {
            console.error('RPC insertion failed:', rpcError);
            throw rpcError;
          }
          
          console.log('RPC insertion successful:', rpcData);
          
          // If RPC worked, query the newly inserted content
          const { data: newContent, error: fetchError } = await supabase
            .from('content')
            .select('*')
            .eq('content_name', insertData.content_name)
            .eq('client_id', insertData.client_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (fetchError) {
            console.error('Failed to fetch newly inserted content:', fetchError);
            throw fetchError;
          }
          
          // Use the fetched data instead of modifying the constant
          return processContentData(newContent, files);
        } catch (rpcAttemptError) {
          console.error('All insertion attempts failed:', rpcAttemptError);
          throw error; // Throw the original error
        }
      } else {
        throw error;
      }
    }

    // If we get here, we have successful data
    console.log('Content record created successfully:', data?.id);
    
    return processContentData(data, files);
  } catch (error) {
    console.error('Error storing content metadata:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Helper function to process database content into ProcessedContent format
 */
function processContentData(
  data: any, 
  files: { name: string; type: string; size: number; url: string; bucket_id?: string; storage_path?: string; }[]
): { data: ProcessedContent | null, error: Error | null } {
  // Transform the data to match our ProcessedContent interface
  const processedContent: ProcessedContent = {
    id: data?.id?.toString() || '0', // Convert integer ID to string for consistency
    metadata: {
      title: data?.content_name || "",
      description: "", // Not in DB schema
      category: "", // Not in DB schema
      audience: data?.audience || "",
      businessObjective: data?.content_objectives || "",
      contentFormat: data?.format || "",
      tags: [], // Not in DB schema
      publishDate: "", // Not in DB schema
      expiryDate: data?.expiry_date || undefined,
      location: undefined, // Not in DB schema
      campaign: data?.campaign_aligned_to || undefined,
      agency: data?.agency || undefined,
      cost: undefined, // Not in DB schema
      contentType: data?.type || undefined
    },
    // Add id property to each file to match the expected interface
    files: files.map((file) => ({
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.url,
      bucket_id: file.bucket_id || data?.bucket_id,
      storage_path: file.storage_path || data?.file_storage_path
    })),
    createdAt: data?.created_at || new Date().toISOString(),
    status: data?.status || 'processing'
  };

  return { data: processedContent, error: null };
}

/**
 * Upload multiple files and store content metadata
 * 
 * @param files - Array of files to upload
 * @param metadata - Content metadata
 * @returns The processed content record
 */
export const uploadContent = async (
  files: ContentFile[],
  metadata: ContentMetadata
): Promise<{ data: ProcessedContent | null, error: Error | null }> => {
  try {
    // Upload all files
    const uploadPromises = files.map(({ file }) => uploadFile(file));
    const results = await Promise.all(uploadPromises);
    
    // Check for upload errors
    const errors = results.filter(result => result.error !== null);
    if (errors.length > 0) {
      throw new Error(`Failed to upload ${errors.length} files`);
    }
    
    // Prepare file information for storage
    const fileData = files.map(({ file }, index) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: results[index].url,
      bucket_id: results[index].bucket_id,
      storage_path: results[index].storage_path
    }));
    
    // Store metadata and file references
    return await storeContentMetadata(metadata, fileData);
  } catch (error) {
    console.error('Error in uploadContent:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Retrieve a list of processed content items
 * 
 * @param limit - Maximum number of items to retrieve
 * @returns Array of processed content items
 */
export const getProcessedContent = async (
  limit = 10
): Promise<{ data: ProcessedContent[] | null, error: Error | null }> => {
  try {
    // Check if user is authenticated with detailed logging
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session retrieval error in getProcessedContent:', sessionError);
      throw sessionError;
    }
    
    if (!session) {
      console.error('No active session found in getProcessedContent');
      throw new Error('User must be authenticated to retrieve content');
    }
    
    // CRITICAL: For RLS policy to work, client_id must EXACTLY match auth.uid()
    const userId = session.user.id;
    console.log('Fetching content for user ID:', userId);
    
    // Try a simple count query first to check permissions
    try {
      const testCountResult = await supabase
        .from('content')
        .select('count')
        .eq('client_id', userId);
        
      console.log('Test count query result:', testCountResult);
      
      if (testCountResult.error) {
        console.error('Cannot run count query, possible RLS issue:', testCountResult.error);
      }
    } catch (testError) {
      console.error('Test count query failed:', testError);
    }
    
    // Now try the actual content query
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('client_id', userId) // Apply RLS filter explicitly
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching content:', JSON.stringify(error, null, 2));
      
      // Provide context for RLS errors
      if (error.code === '42501') {
        console.error('RLS policy violation in getProcessedContent. This typically means:');
        console.error('1. The RLS policy might have additional requirements beyond client_id');
        console.error('2. The user might not have the right role/permissions');
        console.error('Current auth.uid():', userId);
      }
      
      throw error;
    }

    console.log('Retrieved content items:', data.length);
    console.log('First item sample (if any):', data.length > 0 ? JSON.stringify(data[0], null, 2) : 'No items');
    
    // Transform the data to match our ProcessedContent interface
    const processedContent: ProcessedContent[] = data.map(item => {
      return {
        id: item.id.toString(),
        metadata: {
          title: item.content_name || "",
          description: "", // Not in DB schema
          category: "", // Not in DB schema
          audience: item.audience || "",
          businessObjective: item.content_objectives || "",
          contentFormat: item.format || "",
          tags: [], // Not in DB schema
          publishDate: "", // Not in DB schema
          expiryDate: item.expiry_date || undefined,
          location: undefined, // Not in DB schema
          campaign: item.campaign_aligned_to || undefined,
          agency: item.agency || undefined,
          cost: undefined, // Not in DB schema
          contentType: item.type || undefined
        },
        // In a production app, you would fetch files from storage based on content ID
        files: item.file_storage_path ? [
          {
            id: uuidv4(),
            name: item.file_storage_path.split('/').pop() || 'file',
            type: '', // Not known without fetching
            size: 0, // Not known without fetching
            url: item.file_storage_path ? supabase.storage.from(item.bucket_id || 'client-content').getPublicUrl(item.file_storage_path).data.publicUrl : '',
            bucket_id: item.bucket_id || 'client-content',
            storage_path: item.file_storage_path
          }
        ] : [], 
        createdAt: item.created_at || new Date().toISOString(),
        status: item.status || 'processing'
      };
    });

    return { data: processedContent, error: null };
  } catch (error) {
    console.error('Error retrieving processed content:', error);
    return { data: null, error: error as Error };
  }
}; 