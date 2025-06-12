# Eye Tracking Feature Documentation

## Overview
The eye tracking feature provides visual heatmap analysis showing where users focus their attention when viewing content. This feature is integrated into the ContentReportsPage and displays eye tracking visualizations with expand functionality for detailed analysis.

## Architecture Overview

```mermaid
graph TB
    subgraph "Database Layer"
        A[content table] --> A1[eye_tracking_path]
        A --> A2[bucket_id]
        A --> A3[content_name]
    end
    
    subgraph "Data Fetching"
        B[useContentDetail Hook] --> B1[Fetch Content Details]
        B1 --> B2[contentDetails Object]
    end
    
    subgraph "URL Generation"
        C[eyeTrackingUrl useMemo] --> C1{Path Type?}
        C1 -->|Full URL| C2[Return as-is]
        C1 -->|Relative Path| C3[Process Path]
        C3 --> C4[Strip Bucket Prefix]
        C4 --> C5[Generate Public URL]
        C5 --> C6[supabase.storage.getPublicUrl]
    end
    
    subgraph "UI Components"
        D[Characteristics Tab] --> D1[Eye Tracking Card]
        D1 --> D2[Preview Image]
        D1 --> D3[Expand Buttons]
        D3 --> D4[Eye Tracking Modal]
        D4 --> D5[Full-size Image]
    end
    
    A --> B
    B2 --> C
    C6 --> D2
    C6 --> D5
```


## Data Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant UI as ContentReportsPage
    participant Hook as useContentDetail
    participant DB as Supabase Database
    participant Storage as Supabase Storage
    participant Modal as Eye Tracking Modal

    User->>UI: Navigate to content report
    UI->>Hook: Request content details
    Hook->>DB: Query content table
    DB-->>Hook: Return content data
    Hook-->>UI: contentDetails object
    
    UI->>UI: Generate eyeTrackingUrl
    
    alt Eye tracking path exists
        UI->>UI: Check if full URL
        alt Full URL
            UI->>UI: Use URL directly
        else Relative path
            UI->>UI: Strip bucket prefix if exists
            UI->>Storage: getPublicUrl(cleanPath)
            Storage-->>UI: Return public URL
        end
    end
    
    UI->>User: Display Characteristics tab
    User->>UI: Click expand button
    UI->>Modal: Open eye tracking modal
    Modal->>User: Display full-size image
    User->>Modal: Click close
    Modal->>UI: Close modal
```

## Component Structure

```mermaid
graph LR
    subgraph "ContentReportsPage"
        A[Tabs Component] --> B[Characteristics Tab]
        B --> C[Eye Tracking Card]
        
        subgraph "Eye Tracking Card"
            C --> D[Card Header]
            C --> E[Image Container]
            E --> F[Preview Image]
            E --> G[Overlay Expand Button]
            E --> H[Corner Expand Button]
            E --> I[Coming Soon Banner]
        end
        
        subgraph "Modal System"
            J[Eye Tracking Modal] --> K[Modal Header]
            J --> L[Full-size Image]
            J --> M[Modal Footer]
        end
    end
    
    G --> J
    H --> J
```

## URL Generation Logic

```mermaid
flowchart TD
    Start([eyeTrackingUrl useMemo]) --> Check{contentDetails.eye_tracking_path exists?}
    
    Check -->|No| End1[Return null]
    Check -->|Yes| FullURL{"Starts with 'http'?"}
    
    FullURL -->|Yes| Return1[Return path as-is]
    FullURL -->|No| GetBucket[Get bucketName from bucket_id or default]
    
    GetBucket --> StripCheck{Path starts with bucketName/?}
    StripCheck -->|Yes| Strip[Remove bucket prefix]
    StripCheck -->|No| Clean[Use path as-is]
    
    Strip --> Generate[supabase.storage getPublicUrl]
    Clean --> Generate
    
    Generate --> Return2[Return generated URL]
    
    Return1 --> End2[eyeTrackingUrl ready]
    Return2 --> End2
    End1 --> End2
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> Loading: Component mounts
    Loading --> DataReady: Content details loaded
    DataReady --> URLGenerated: eyeTrackingUrl computed
    
    state URLGenerated {
        [*] --> URLAvailable: Valid URL generated
        [*] --> URLNull: No path or generation failed
        
        URLAvailable --> ModalClosed: Default state
        URLNull --> ShowComingSoon: Display placeholder
        
        ModalClosed --> ModalOpen: User clicks expand
        ModalOpen --> ModalClosed: User closes modal
    }
```

## Key Features

### 1. Dynamic Bucket Support
The system uses the `bucket_id` field from the database to support multiple storage buckets:

```typescript
const bucketName = contentDetails.bucket_id || 'client-content';
```

### 2. Backwards Compatibility
Handles paths with and without bucket prefixes:

```typescript
if (cleanPath.startsWith(`${bucketName}/`)) {
  cleanPath = cleanPath.replace(`${bucketName}/`, '');
}
```

### 3. URL Type Detection
Supports both relative paths and full URLs:

```typescript
if (contentDetails.eye_tracking_path.startsWith('http')) {
  return contentDetails.eye_tracking_path;
}
```

### 4. Conditional UI Elements
- **Coming Soon Banner**: Displayed when no eye tracking URL is available
- **Expand Buttons**: Only functional when valid URL exists
- **Modal**: Opens with full-size image for detailed analysis

## Database Schema

```mermaid
erDiagram
    content {
        int id PK
        string eye_tracking_path
        string bucket_id
        string content_name
        string file_storage_path
        timestamp created_at
    }
    
    content ||--|| content_reviews : "has"
    content_reviews ||--o{ scores : "contains"
```

### Relevant Fields
- `eye_tracking_path`: File path to eye tracking image (with or without bucket prefix)
- `bucket_id`: Supabase storage bucket identifier
- `file_storage_path`: Main content file path

## User Interface Flow

```mermaid
journey
    title Eye Tracking User Experience
    section View Content Report
      Navigate to report: 5: User
      Load content details: 3: System
      Display tabs: 5: User
    section Access Eye Tracking
      Click Characteristics tab: 5: User
      View eye tracking card: 4: User
      See preview image: 4: User
    section Detailed Analysis
      Click expand button: 5: User
      Open modal: 5: System
      View full-size heatmap: 5: User
      Analyze attention patterns: 5: User
      Close modal: 4: User
```

## Error Handling

```mermaid
flowchart TD
    A[Eye Tracking Request] --> B{URL Generated?}
    B -->|Yes| C{Image Loads?}
    B -->|No| D[Show Coming Soon Banner]
    
    C -->|Yes| E[Display Image]
    C -->|No| F[Check Network Tab]
    
    F --> G{404 Error?}
    G -->|Yes| H[Path Issue - Check Database]
    G -->|No| I{CORS Error?}
    I -->|Yes| J[Storage Permissions Issue]
    I -->|No| K[Other Network Issue]
    
    D --> L[Log: No eye_tracking_path found]
    H --> M[Verify file exists in bucket]
    J --> N[Check Supabase storage settings]
    K --> O[Check console for details]
```

## Console Logging

The system provides comprehensive logging for debugging:

1. **Path Detection**: `"Generating eye tracking URL for path:"`
2. **Bucket Selection**: `"Using bucket:"`
3. **Path Cleaning**: `"Stripped bucket prefix, clean path:"`
4. **URL Generation**: `"Generated eye tracking URL:"`
5. **Missing Data**: `"No eye_tracking_path found for content"`

## Integration Points

### With n8n Workflow
- Eye tracking images uploaded via automated workflow
- Paths stored in `eye_tracking_path` column
- Recent workflow updates include bucket prefixes

### With Supabase Storage
- Images stored in configurable buckets
- Public URLs generated dynamically
- Supports multiple bucket configurations

### With Content Analysis
- Eye tracking complements performance scores
- Provides visual attention data
- Enhances content effectiveness insights

## Best Practices

### For Developers
1. **Always check console logs** when debugging display issues
2. **Test with different bucket configurations** 
3. **Verify URLs in Network tab** for loading issues
4. **Handle both old and new path formats** for compatibility

### For Content Management
1. **Store relative paths** in database (without bucket prefix)
2. **Use bucket_id field** to specify storage location
3. **Validate file uploads** before saving paths
4. **Test URL generation** after n8n workflow changes

## Testing Scenarios

1. **Happy Path**: Valid eye tracking path generates working URL
2. **Missing Path**: Graceful handling with Coming Soon banner
3. **Invalid Path**: Error logging and fallback behavior
4. **Different Buckets**: Dynamic bucket selection works
5. **Full URLs**: Direct URLs pass through unchanged
6. **Modal Functionality**: Expand buttons and modal work correctly

## Future Enhancements

- **Multiple Eye Tracking Views**: Support for different analysis types
- **Interactive Heatmaps**: Clickable attention zones
- **Comparison Tools**: Side-by-side eye tracking analysis
- **Analytics Integration**: Eye tracking metrics in performance scores 