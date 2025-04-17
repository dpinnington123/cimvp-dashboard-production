Okay, let's create a guide for implementing the new "Characteristics" tab in the `ContentReportsPage`, using dummy data for now.

**Goal:** Add a fourth tab, "Characteristics," to the Content Report page, displaying various content attributes in a card grid layout, populated with placeholder data.

**Prerequisites:**

1.  You have the `ContentReportsPage.tsx` component with the existing three tabs ("Performance Scores," "Content Details," "Areas to Improve").
2.  You have `shadcn/ui` components (`Tabs`, `Card`, etc.) available.
3.  You have `lucide-react` installed for icons.

---

**Implementation Steps:**

**Step 1: Create the Reusable `CharacteristicCard` Component**

This component will display a single characteristic (icon, label, value) in a consistent card format.

*   **Action:** Create a new file `src/components/views/content-reports/CharacteristicCard.tsx`.
*   **Content:** Add the following code:

    ```typescript name=src/components/views/content-reports/CharacteristicCard.tsx
    import React from 'react';
    import { Card, CardContent } from "@/components/ui/card";
    import { cn } from "@/lib/utils";

    interface CharacteristicCardProps {
      icon?: React.ReactNode; // Icon is optional
      label: string;
      value: string | number | React.ReactNode; // Value can be text, number, or even another component
      className?: string;
    }

    export function CharacteristicCard({ icon, label, value, className }: CharacteristicCardProps) {
      const displayValue = value !== null && value !== undefined && value !== '' ? value : "N/A";

      return (
        <Card className={cn("p-4", className)}> {/* Adjusted padding */}
          <CardContent className="p-0 space-y-1"> {/* Remove default CardContent padding */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {icon}
              <span>{label}</span>
            </div>
            <div className="text-lg font-semibold">
              {displayValue}
            </div>
          </CardContent>
        </Card>
      );
    }
    ```

**Step 2: Prepare `ContentReportsPage.tsx`**

*   **Action:** Open `src/pages/ContentReportsPage.tsx`.
*   **Add Imports:**
    *   Import the new `CharacteristicCard` component.
    *   Import necessary icons from `lucide-react` for the characteristics.

    ```typescript name=src/pages/ContentReportsPage.tsx
    // ... other imports
    import { CharacteristicCard } from "@/components/views/content-reports/CharacteristicCard"; // Import the new card
    import {
      Hash, // For Headlines
      Image as ImageIcon, // For Images (rename to avoid conflict with React.Image)
      Video, // For Videos
      FileText as FileTextIcon, // For Pages (reuse or choose another)
      AlignLeft, // For Words
      Thermometer, // For Reading Age
      Smile, // For Emotional Strength
      Target as TargetIcon, // For Calls to Action (reuse or choose another)
      // ... other existing icons
    } from "lucide-react";
    // ... rest of the component
    ```
*   **Define Dummy Data:** Add a constant array inside the `ContentReportsPage` component (or outside if preferred) to hold the dummy characteristic data.

    ```typescript name=src/pages/ContentReportsPage.tsx
    // --- Dummy Data for Characteristics ---
    const dummyCharacteristics = [
      { id: 'headlines', label: 'Number of Headlines', value: 12, icon: <Hash className="w-4 h-4" /> },
      { id: 'images', label: 'Number of Images', value: 8, icon: <ImageIcon className="w-4 h-4" /> },
      { id: 'videos', label: 'Number of Videos', value: 2, icon: <Video className="w-4 h-4" /> },
      { id: 'pages', label: 'Number of Pages', value: 5, icon: <FileTextIcon className="w-4 h-4" /> },
      { id: 'words', label: 'Number of Words', value: 1850, icon: <AlignLeft className="w-4 h-4" /> },
      { id: 'readingAge', label: 'Reading Age', value: '14-16 years', icon: <Thermometer className="w-4 h-4" /> },
      { id: 'emotion', label: 'Emotional Strength', value: 'Moderate to Strong', icon: <Smile className="w-4 h-4" /> },
      { id: 'cta', label: 'Number of Calls to Action', value: 6, icon: <TargetIcon className="w-4 h-4" /> },
    ];
    // --- End Dummy Data ---

    export default function ContentReportsPage() {
      // ... existing hooks and logic
    ```

**Step 3: Update the Tabs Structure**

*   **Action:** Find the `<TabsList>` component within the detail view section.
*   **Modify:**
    *   Add a new `<TabsTrigger value="characteristics">Characteristics</TabsTrigger>`.
    *   Update the `grid-cols-*` class on `<TabsList>` to accommodate the fourth tab (e.g., `grid-cols-4`).

    ```typescript name=src/pages/ContentReportsPage.tsx
          <Tabs defaultValue="performance" className="w-full">
            {/* Update grid-cols class here */}
            <TabsList className="grid grid-cols-4 mb-6"> {/* Changed to grid-cols-4 */}
              <TabsTrigger value="performance">Performance Scores</TabsTrigger>
              <TabsTrigger value="details">Content Details</TabsTrigger>
              {/* Add the new trigger */}
              <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
              <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
            </TabsList>

            {/* ... existing TabsContent for performance, details ... */}
          </Tabs>
    ```

**Step 4: Add the New Tab Content**

*   **Action:** Add a new `<TabsContent value="characteristics">...</TabsContent>` block after the "details" tab content.
*   **Populate:** Inside this new tab, create a grid and map over the `dummyCharacteristics` array, rendering a `CharacteristicCard` for each item.

    ```typescript name=src/pages/ContentReportsPage.tsx
            {/* ... TabsContent for performance ... */}
            {/* ... TabsContent for details ... */}

            {/* Characteristics Tab Content */}
            <TabsContent value="characteristics" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dummyCharacteristics.map((char) => (
                  <CharacteristicCard
                    key={char.id}
                    icon={char.icon}
                    label={char.label}
                    value={char.value}
                    // Add animation classes if desired
                    className="animate-in fade-in zoom-in-95"
                    style={{ animationDelay: `${dummyCharacteristics.indexOf(char) * 0.05}s` }} // Stagger animation
                  />
                ))}
              </div>
              {/* Placeholder for future notes or summary related to characteristics */}
              {/* <p className="text-xs text-muted-foreground mt-4 text-center">
                These characteristics are based on automated analysis.
              </p> */}
            </TabsContent>

            {/* ... TabsContent for improvements ... */}
          </Tabs>
    ```

**Step 5: Verification**

1.  Run your development server (`yarn dev` or `npm run dev`).
2.  Navigate to the detail view of a content report (e.g., `/content-reports/123`).
3.  **Verify:**
    *   A fourth tab labeled "Characteristics" appears in the tab list.
    *   Clicking the "Characteristics" tab displays the content.
    *   The content area shows a grid of cards (likely 2 columns on wider screens).
    *   Each card displays the correct icon, label, and dummy value from the `dummyCharacteristics` array.
    *   The layout and styling roughly match the target image.

---

You have now successfully added the "Characteristics" tab using dummy data. When you have the real data source (presumably from the `content_analysis` table or similar in Supabase):

1.  Fetch this data alongside the `contentDetails` and `scoresData` (perhaps using a new hook or modifying an existing one).
2.  Replace the `dummyCharacteristics` array with logic to process the fetched analysis data into the same structure (`{ id, label, value, icon }`).
3.  The rest of the rendering logic using `.map()` and `<CharacteristicCard>` will remain the same.