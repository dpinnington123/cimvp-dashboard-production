# Plan: Implement Campaign Planner Page

## 1. Create Page Component File

*   **Action:** Create a new file for the page component.
*   **Location:** `src/pages/CampaignPlannerPage.tsx` (Assuming a `src/pages` directory exists; adjust if needed).
*   **Content:** Define a basic React functional component named `CampaignPlannerPage`.
    ```tsx
    // src/pages/CampaignPlannerPage.tsx
    import React from 'react';

    const CampaignPlannerPage: React.FC = () => {
      return (
        <div>
          {/* Page content will go here */}
          <h1>Campaign Planning</h1>
        </div>
      );
    };

    export default CampaignPlannerPage;
    ```

## 2. Set Up Basic Layout

*   **Action:** Modify `CampaignPlannerPage.tsx` to establish the main layout structure (sidebar and main content area).
*   **Details:** Use CSS Flexbox, Grid, or your project's UI library layout components.
*   **Example (Conceptual using Flexbox and placeholder divs):**
    ```tsx
    // src/pages/CampaignPlannerPage.tsx
    import React from 'react';
    // Import necessary components and styles

    const CampaignPlannerPage: React.FC = () => {
      return (
        <div style={{ padding: '20px' }}> {/* Add appropriate styling/classes */}
          <h1>Campaign Planning</h1>
          <p>Plan and visualize your content marketing journeys with drag and drop simplicity</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}> {/* Main layout container */}
            {/* Sidebar Column */}
            <div style={{ width: '250px', flexShrink: 0 }}> {/* Adjust width as needed */}
              {/* Sidebar content will go here (Step 3) */}
              <p>[Sidebar Placeholder]</p>
            </div>
            {/* Main Content Column */}
            <div style={{ flexGrow: 1 }}>
              {/* Main content sections will go here (Steps 4-6) */}
              <p>[Main Content Placeholder]</p>
            </div>
          </div>
        </div>
      );
    };

    export default CampaignPlannerPage;

    ```

## 3. Implement Sidebar Content

*   **Action:** Populate the sidebar div in `CampaignPlannerPage.tsx`.
*   **Components:**
    *   Add a "New Campaign" button (create a simple button or use a library component).
    *   Import and render `CampaignTabs` from `src/components/views/campaign-planner/CampaignTabs.tsx`.
*   **Context:** This section allows users to select different campaigns or create new ones, filtering the view in the main content area (though filtering logic is a later step).
*   **Code Snippet:**
    ```tsx
    // Inside the Sidebar Div in CampaignPlannerPage.tsx
    import CampaignTabs from '../components/views/campaign-planner/CampaignTabs';
    // ... other imports

    // Replace '[Sidebar Placeholder]' with:
    <button>+ New Campaign</button> {/* Style appropriately */}
    <CampaignTabs /> {/* Pass necessary props if any */}
    ```

## 4. Implement Campaign Overview Section

*   **Action:** Add the "All Campaigns Overview" section to the main content area in `CampaignPlannerPage.tsx`.
*   **Component:** Import and render `CampaignOverview` from `src/components/views/campaign-planner/CampaignOverview.tsx`.
*   **Context:** This provides a high-level summary of performance metrics across all campaigns, giving users immediate insights.
*   **Code Snippet:**
    ```tsx
    // Inside the Main Content Div in CampaignPlannerPage.tsx
    import CampaignOverview from '../components/views/campaign-planner/CampaignOverview';
    // ... other imports

    // Add within the main content div:
    <CampaignOverview /> {/* Pass necessary props if any */}
    {/* Placeholder for next sections */}
    ```

## 5. Implement Content Library Section

*   **Action:** Add the "Content Library" section below the overview in the main content area.
*   **Components:**
    *   Add the "Content Library" title and description.
    *   Import and render `ContentFilters` from `src/components/views/campaign-planner/ContentFilters.tsx`. (Verify if it includes the "Add Content" button, or add it separately).
    *   Import and render `ContentTable` from `src/components/views/campaign-planner/ContentTable.tsx`.
*   **Context:** This area serves as the central repository where users can browse, filter, and manage individual content pieces associated with campaigns. Users can add content items from here to the visual journey planner below.
*   **Code Snippet:**
    ```tsx
    // Below CampaignOverview in CampaignPlannerPage.tsx
    import ContentFilters from '../components/views/campaign-planner/ContentFilters';
    import ContentTable from '../components/views/campaign-planner/ContentTable';
    // ... other imports

    // Add:
    <h2>Content Library</h2>
    <p>Browse and drag content items to the canvas below or use the "Add to Journey" button</p>
    <ContentFilters /> {/* Check for Add Content button */}
    {/* Maybe add the Add Content button explicitly if not in Filters */}
    <ContentTable /> {/* Pass necessary props if any */}
    {/* Placeholder for next section */}
    ```

## 6. Implement Content Journey Planner Section

*   **Action:** Add the "Design Your Content Journey" section below the content library.
*   **Component:** Import and render `ContentJourneyPlanner` from `src/components/views/campaign-planner/ContentJourneyPlanner.tsx`. (This likely includes the `Canvas` and action buttons like "Clear Canvas", "Export", "Save Journey").
*   **Context:** This is the core interactive part of the page, allowing users to visually map out the sequence and connections between different content pieces for a specific campaign journey.
*   **Code Snippet:**
    ```tsx
    // Below ContentTable in CampaignPlannerPage.tsx
    import ContentJourneyPlanner from '../components/views/campaign-planner/ContentJourneyPlanner';
    // ... other imports

    // Add:
    <h2>Design Your Content Journey</h2>
    <ContentJourneyPlanner /> {/* Pass necessary props if any */}
    ```

## 7. Add Routing

*   **Action:** Configure the application's router to include the new page.
*   **Location:** Find your main routing file (e.g., `src/App.tsx`, `src/routes.tsx`).
*   **Details:** Add a route definition that maps a path (e.g., `/campaign-planner`) to the `CampaignPlannerPage` component.
*   **Example (Conceptual using react-router-dom):**
    ```tsx
    // In your router setup file
    import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
    import CampaignPlannerPage from './pages/CampaignPlannerPage';
    // ... other page imports

    function App() {
      return (
        <Router>
          <Switch>
            {/* Other routes */}
            <Route path="/campaign-planner" component={CampaignPlannerPage} />
            {/* Other routes */}
          </Switch>
        </Router>
      );
    }
    ```

## 8. Apply Styling

*   **Action:** Add CSS rules or utility classes (e.g., Tailwind) to style the `CampaignPlannerPage` and its child components to match the image.
*   **Focus Areas:** Overall layout spacing, background colors, button styles, typography (fonts, sizes, weights), table appearance, filter dropdowns, component borders/shadows.
*   **Context:** Ensures the page is visually consistent with the design specification and the rest of the application.

## 9. Initial Data/Props (Placeholder)

*   **Action:** Pass static or placeholder data as props to the imported components (`CampaignTabs`, `CampaignOverview`, `ContentTable`, `ContentJourneyPlanner`) to ensure they render correctly without live data.
*   **Example:** For `ContentTable`, you might pass an array of mock content objects.
*   **Context:** Allows for verification of the layout and component integration before tackling data fetching and state management.

## 10. Review and Refine

*   **Action:** Run the application (`npm start` or similar).
*   **Verification:** Navigate to `/campaign-planner`. Compare the rendered page against the provided image. Check component placement, basic styling, and ensure no console errors related to rendering. Adjust layout and styles as needed.
