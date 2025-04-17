Okay, here's a step-by-step guide on how to implement the changes to display all relevant details from the `content` table within the "Content Details" tab of the `ContentReportsPage`.

**Goal:** To dynamically display all fetched metadata fields (like format, type, audience, campaign, agency, dates, etc.) from the `content` database table on the Content Report page.

**Prerequisites:**

1.  You have the `ContentReportsPage.tsx` component set up.
2.  The `useContentDetail` hook (from `src/hooks/useContent.ts`) is correctly fetching the data for a specific content item using `getContentById` (from `src/services/contentService.ts`).
3.  The `getContentById` service function is fetching *all* necessary columns from the `content` table (e.g., using `select('*')` or explicitly listing all required columns).
4.  You have the necessary icons installed (e.g., from `lucide-react`).

---

**Implementation Steps:**

**Step 1: Create the Reusable `DetailItem` Component**

This component provides a consistent way to display each piece of metadata with a label and an icon.

*   **Action:** Create a new file `src/components/views/content-reports/DetailItem.tsx`.
*   **Content:** Add the following code to the new file:

    ```typescript name=src/components/views/content-reports/DetailItem.tsx
    import React from 'react';
    import { cn } from "@/lib/utils";

    interface DetailItemProps {
      icon: React.ReactNode;
      label: string;
      value: string | number | null | undefined;
      className?: string;
    }

    export function DetailItem({ icon, label, value, className }: DetailItemProps) {
      // Display 'N/A' if the value is null, undefined, or an empty string
      const displayValue = value !== null && value !== undefined && value !== '' ? value : "N/A";

      return (
        <div className={cn("flex flex-col p-3 rounded-lg border bg-muted/30", className)}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            {icon}
            <span>{label}</span>
          </div>
          <p className="font-medium text-sm break-words">
            {displayValue} {/* Use the potentially modified display value */}
          </p>
        </div>
      );
    }
    ```

**Step 2: Prepare `ContentReportsPage.tsx`**

*   **Action:** Open `src/pages/ContentReportsPage.tsx`.
*   **Add Imports:** Ensure you import the new `DetailItem` component and any necessary icons from `lucide-react`.

    ```typescript name=src/pages/ContentReportsPage.tsx
    // ... other imports
    import { DetailItem } from "@/components/views/content-reports/DetailItem";
    import {
      Star, ArrowLeft, CalendarIcon, ClockIcon, UsersIcon, FileTextIcon,
      TypeIcon, TargetIcon, BriefcaseIcon, Building2Icon, BarChart3Icon,
      InfoIcon, AlertCircleIcon // Add other icons as needed
    } from "lucide-react";
    // ... rest of the component
    ```
*   **Add `formatDate` Helper (if not already present):** Add this helper function inside or outside the component scope to format date strings nicely.

    ```typescript name=src/pages/ContentReportsPage.tsx
    // Helper function to format dates
    const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return "N/A";
      try {
        // Example format: Jan 1, 2024
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } catch (e) {
        // Handle potential invalid date strings gracefully
        console.error("Error formatting date:", dateString, e);
        return "Invalid Date";
      }
    };

    export default function ContentReportsPage() {
      // ... component logic
    }
    ```

**Step 3: Implement the "Content Details" Tab**

*   **Action:** Locate the `TabsContent` component with `value="details"`.
*   **Replace Content:** Replace the existing content within this tab with the following structure, using the `DetailItem` component for each field you want to display from the `contentDetails` object.

    ```typescript name=src/pages/ContentReportsPage.tsx
            {/* Content Details Tab Content - Updated */}
            <TabsContent value="details" className="mt-0 p-0 animate-in fade-in-50">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Content Objectives (Displayed separately for potentially longer text) */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <TargetIcon className="w-5 h-5 text-primary" />
                      Content Objectives
                    </h3>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border">
                      {/* Access the objectives field from your contentDetails object */}
                      {contentDetails?.content_objectives || "No objectives specified."}
                    </p>
                  </div>

                  {/* Metadata Grid using DetailItem */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Map each field from contentDetails to a DetailItem */}
                    <DetailItem
                      icon={<FileTextIcon className="w-3.5 h-3.5" />}
                      label="Format"
                      value={contentDetails?.format} // Access the 'format' field
                    />
                    <DetailItem
                      icon={<TypeIcon className="w-3.5 h-3.5" />}
                      label="Type"
                      value={contentDetails?.type} // Access the 'type' field
                    />
                     <DetailItem
                      icon={<UsersIcon className="w-3.5 h-3.5" />}
                      label="Audience"
                      value={contentDetails?.audience} // Access the 'audience' field
                    />
                     <DetailItem
                      icon={<InfoIcon className="w-3.5 h-3.5" />}
                      label="Status"
                      value={contentDetails?.status} // Access the 'status' field
                    />
                    <DetailItem
                      icon={<BriefcaseIcon className="w-3.5 h-3.5" />}
                      label="Campaign"
                      value={contentDetails?.campaign_aligned_to} // Access the 'campaign_aligned_to' field
                    />
                     <DetailItem
                      icon={<Building2Icon className="w-3.5 h-3.5" />}
                      label="Agency"
                      value={contentDetails?.agency} // Access the 'agency' field
                    />
                    <DetailItem
                      icon={<TargetIcon className="w-3.5 h-3.5" />}
                      label="Strategy Alignment"
                      value={contentDetails?.strategy_aligned_to} // Access the 'strategy_aligned_to' field
                    />
                    <DetailItem
                      icon={<BarChart3Icon className="w-3.5 h-3.5" />}
                      label="Funnel Alignment"
                      value={contentDetails?.funnel_alignment} // Access the 'funnel_alignment' field
                    />
                     <DetailItem
                      icon={<CalendarIcon className="w-3.5 h-3.5" />}
                      label="Created On"
                      value={formatDate(contentDetails?.created_at)} // Format the date
                    />
                    <DetailItem
                      icon={<ClockIcon className="w-3.5 h-3.5" />}
                      label="Expiry Date"
                      value={formatDate(contentDetails?.expiry_date)} // Format the date
                    />
                    <DetailItem
                      icon={<AlertCircleIcon className="w-3.5 h-3.5" />}
                      label="Last Updated"
                      value={formatDate(contentDetails?.updated_at)} // Format the date
                    />
                    {/* Add more DetailItem components here for any other fields
                        in your 'content' table that you want to display,
                        e.g., client_id, bucket_id, file_storage_path if relevant */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
    ```
    *   **Key:** Make sure the field names used (e.g., `contentDetails?.format`, `contentDetails?.type`) exactly match the column names returned by your `getContentById` service function (which should reflect your database schema).

**Step 4: Update Page Header (Optional)**

*   **Action:** Update the main `<h1>` tag at the top of the detail view section to dynamically display the content's name.
*   **Code:**

    ```typescript name=src/pages/ContentReportsPage.tsx
      {/* 1. Header Area */}
      <header className="mb-6">
        {/* Update the h1 tag */}
        <h1 className="text-3xl font-bold">{contentDetails?.content_name || 'Content Report'}</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive analysis of content performance and recommendations for optimization.
        </p>
      </header>
    ```

**Step 5: Verification**

1.  Run your development server (`yarn dev` or `npm run dev`).
2.  Navigate to the `/content-reports` page.
3.  Click "View Report" for a content item.
4.  On the detail page, click the "Content Details" tab.
5.  **Verify:**
    *   All the fields you added using `<DetailItem>` are displayed.
    *   The values shown match the data in your Supabase `content` table for that specific `contentId`.
    *   Fields that are `null` or empty in the database correctly show "N/A".
    *   Date fields are formatted correctly.
    *   The icons appear next to the labels.
    *   The main page title now shows the specific content's name.

---

By following these steps, you will have successfully refactored the "Content Details" tab to display a comprehensive set of information directly fetched from your `content` table, using a reusable component for consistency.