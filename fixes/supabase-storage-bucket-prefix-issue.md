# Supabase Storage Bucket Prefix Issue Fix

## Issue Summary
Eye tracking images in ContentReportsPage were not displaying correctly due to malformed URLs caused by duplicate bucket names in the storage path.

## Root Cause
The **n8n AI workflow was recently updated to a newer version**, which changed how file paths are stored in the database. The updated workflow began including the Supabase storage bucket name (`client-content/`) as a prefix in the `eye_tracking_path` column of the `content` table.

### What Changed in n8n Workflow
- **Before**: Stored relative paths like `3cf888b7-72bf-4a2a-98d3-5ef3222d7a16/M4ZPL2QJv74K85pWaRK6.../e945f814-7d63-4112-94e6-c76e120d2a30.png`
- **After**: Stored paths with bucket prefix like `client-content/3cf888b7-72bf-4a2a-98d3-5ef3222d7a16/M4ZPL2QJv74K85pWaRK6.../e945f814-7d63-4112-94e6-c76e120d2a30.png`

## Problem Details

### Symptoms
1. Eye tracking images not displaying in ContentReportsPage
2. "COMING SOON" overlay appearing even when `eye_tracking_path` was populated
3. Console logs showing URL generation but images failing to load
4. Working URLs when manually removing `client-content/` prefix from database

### Technical Issue
The code in `ContentReportsPage.tsx` was calling:
```typescript
supabase.storage.from('client-content').getPublicUrl(contentDetails.eye_tracking_path)
```

When `eye_tracking_path` contained `client-content/path/to/file.png`, this resulted in malformed URLs like:
```
https://project.supabase.co/storage/v1/object/public/client-content/client-content/path/to/file.png
                                                                    ↑              ↑
                                                            from bucket     from stored path
```

Notice the **duplicate "client-content"** causing invalid URLs.

## Solution Implemented

### 1. Updated Eye Tracking URL Generation
Modified `eyeTrackingUrl` useMemo in `ContentReportsPage.tsx` (lines 314-334):

```typescript
const eyeTrackingUrl = React.useMemo(() => {
  if (contentDetails?.eye_tracking_path) {
    console.log("Generating eye tracking URL for path:", contentDetails.eye_tracking_path);
    
    // Check if it's already a full URL (starting with http/https)
    if (contentDetails.eye_tracking_path.startsWith('http')) {
      return contentDetails.eye_tracking_path;
    }
    
    // Use the bucket_id from the database, fallback to 'client-content' if not specified
    const bucketName = contentDetails.bucket_id || 'client-content';
    console.log("Using bucket:", bucketName);
    
    // Strip bucket prefix from path if it exists (for backwards compatibility)
    let cleanPath = contentDetails.eye_tracking_path;
    if (cleanPath.startsWith(`${bucketName}/`)) {
      cleanPath = cleanPath.replace(`${bucketName}/`, '');
      console.log("Stripped bucket prefix, clean path:", cleanPath);
    }
    
    // Generate public URL using the bucket_id from database
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(cleanPath);
    
    console.log("Generated eye tracking URL:", data?.publicUrl);
    return data?.publicUrl;
  }
  console.log("No eye_tracking_path found for content");
  return null;
}, [contentDetails?.eye_tracking_path, contentDetails?.bucket_id]);
```

### 2. Updated Image URL Generation for Consistency
Applied the same fix to `imageUrl` useMemo (lines 275-295) to handle similar issues with regular content images.

### Key Features of the Fix

1. **Dynamic Bucket Support**: Uses `contentDetails.bucket_id` from database instead of hardcoded 'client-content'
2. **Backwards Compatibility**: Handles both old (clean paths) and new (prefixed paths) data formats
3. **Automatic Prefix Stripping**: Removes bucket prefix if detected in the stored path
4. **Fallback Safety**: Defaults to 'client-content' if no bucket_id specified
5. **Enhanced Debugging**: Added comprehensive console logging for troubleshooting
6. **Full URL Support**: Passes through complete URLs unchanged

## Database Schema Context

The `content` table has these relevant fields:
- `eye_tracking_path: string | null` - File path (with or without bucket prefix)
- `file_storage_path: string | null` - Main content file path  
- `bucket_id: string | null` - Supabase storage bucket identifier

## Prevention Guidelines

### For n8n Workflow Updates
1. **Test storage path formats** before deploying workflow changes
2. **Store relative paths only** in `eye_tracking_path` and `file_storage_path` columns
3. **Use `bucket_id` field** to specify which bucket contains the files
4. **Validate generated URLs** in development environment

### For Frontend Development
1. **Always use `bucket_id`** from database rather than hardcoding bucket names
2. **Handle both path formats** (with and without bucket prefix) for backwards compatibility
3. **Add comprehensive logging** for storage URL generation to aid debugging
4. **Test with different bucket configurations**

## Debugging Similar Issues

### Console Log Checklist
When debugging storage URL issues, check these console messages:

1. `"Generating eye tracking URL for path:"` - Shows the raw path from database
2. `"Using bucket:"` - Confirms which bucket is being used
3. `"Stripped bucket prefix, clean path:"` - Shows path after prefix removal
4. `"Generated eye tracking URL:"` - Shows the final constructed URL
5. `"No eye_tracking_path found for content"` - Indicates missing database data

### Network Tab Investigation
1. Check if image requests are being made
2. Look for 404 errors indicating wrong paths
3. Verify URL structure matches expected Supabase storage format
4. Check for CORS or permission issues

### Database Verification
1. Confirm `eye_tracking_path` contains expected value
2. Verify `bucket_id` is set correctly
3. Check if paths include bucket prefix
4. Validate file actually exists in storage bucket

## Files Modified
- `src/pages/ContentReportsPage.tsx` - Updated URL generation logic for both eye tracking and main content images

## Related Issues
This fix also resolves similar potential issues with:
- Main content image display (`imageUrl` generation)
- Any future file storage features using Supabase storage
- Multi-bucket storage scenarios

## Testing
To verify the fix:
1. Check eye tracking images display correctly in ContentReportsPage
2. Verify console logs show proper URL generation
3. Test with content items that have different `bucket_id` values
4. Confirm backwards compatibility with old data formats 