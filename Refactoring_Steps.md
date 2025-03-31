# Refactoring Steps: Content Effectiveness Page to Content Analyzer

**Goal:** Transform `src/pages/ContentEffectivenessPage.tsx` from a content list view into a detailed Content Analyzer page for a single content item, matching the provided design image and `ContentEffectivenessImplementation.md`.

**Starting Point:** `src/pages/ContentEffectivenessPage.tsx` has been scaffolded with basic state management, data fetching hooks (`useContentDetail`, `useScores`), loading/error handling, and the main two-column layout structure.

---

## Step-by-Step Implementation Guide

### Phase 1: Core Structure & Data Flow

1.  **Implement Content Selection:**
    *   **Context:** The page needs to know *which* content item to analyze. The current hardcoded `selectedContentId` is temporary.
    *   **Action:** Replace the placeholder state logic in `ContentEffectivenessPage.tsx`. Options:
        *   **Route Parameter:** Modify routing (e.g., `/content/analyzer/:contentId`) and read the ID using a router hook (like `useParams` from `react-router-dom`). This is common for detail pages.
        *   **Dropdown Selector:** Create/use a `ContentSelector` component (as mentioned in the implementation guide). This component would use `useContentList` to fetch available content, display it in a `shadcn/ui Select` or `Command` component, and update the `selectedContentId` state in `ContentEffectivenessPage.tsx` via a callback prop (`onContentSelect`).
    *   **Files:** `src/pages/ContentEffectivenessPage.tsx`, potentially `src/components/views/analyzer/ContentSelector.tsx`, routing configuration.

2.  **Verify Data Hooks:**
    *   **Context:** Ensure the `useContentDetail` and `useScores` hooks are correctly implemented and fetch the necessary data based on the `selectedContentId`.
    *   **Action:** Test the hooks independently or within the page component using `console.log` or React DevTools to inspect the fetched `contentDetails` and `contentScores` data structure. Confirm they match the expected structure needed for the UI components. Resolve any issues with the hook implementation or data fetching logic.
    *   **Files:** `src/hooks/useContentDetail.ts`, `src/hooks/useScores.ts`, `src/pages/ContentEffectivenessPage.tsx`.

### Phase 2: Implement UI Components (Based on Design)

*   **Context:** Build the individual visual blocks that make up the Content Analyzer page, populating them with the fetched data. Each component represents a specific part of the report (like the preview, overall score, or individual metrics).

3.  **Implement `ContentPreview` Card (Left Column):**
    *   **Action:** Create `src/components/views/analyzer/ContentPreview.tsx`. Use `shadcn/ui Card`. Display the image (`contentDetails.data.metadata.imageUrl`), overlay title (`contentDetails.data.title`), format badge (`contentDetails.data.format_type`), date, duration, and audience using data from the `contentDetails` prop. Use `lucide-react` icons. Handle missing data gracefully (placeholders).
    *   **Integration:** Import and use `<ContentPreview content={contentDetails} />` in `ContentEffectivenessPage.tsx`, replacing its placeholder.
    *   **Files:** `src/components/views/analyzer/ContentPreview.tsx`, `src/pages/ContentEffectivenessPage.tsx`.

4.  **Implement `OverallScoreCard` (Left Column):**
    *   **Action:** Create `src/components/views/analyzer/OverallScoreCard.tsx`. Use `shadcn/ui Card` and `Badge`. Display title, description. Implement logic to map the overall score value to the badge text ("Very Good"). **Crucially, determine the source of the overall score (76 in the image)** - is it calculated client-side from `contentScores`, or fetched directly? Implement the Recharts radial chart (`RadialBarChart` or custom `PieChart`) to visualize this score. Style the chart to match the design.
    *   **Integration:** Import and use `<OverallScoreCard scores={contentScores} content={contentDetails} />` (adjust props as needed based on score source) in `ContentEffectivenessPage.tsx`, replacing its placeholder.
    *   **Files:** `src/components/views/analyzer/OverallScoreCard.tsx`, `src/pages/ContentEffectivenessPage.tsx`.

5.  **Implement Tabs (Right Column):**
    *   **Action:** In `ContentEffectivenessPage.tsx`, replace the right-column placeholder with `shadcn/ui Tabs`. Define the three triggers: "Performance Scores", "Content Details", "Areas to Improve". Set "Performance Scores" as the default tab.
    *   **Files:** `src/pages/ContentEffectivenessPage.tsx`.

6.  **Implement `ScoreGrid` & `IndividualScoreCard` (Right Column - Performance Scores Tab):**
    *   **Action (Individual Card):** Create `src/components/views/analyzer/IndividualScoreCard.tsx`. Use `shadcn/ui Card`. It should accept a single score object (from `contentScores.data` array) as a prop. Display `check_name`, formatted `score_value`, description (clarify source), and a Recharts radial progress bar. Implement color logic (green/orange) for the bar based on score value or category.
    *   **Action (Grid):** Create `src/components/views/analyzer/ScoreGrid.tsx`. It should accept the `contentScores.data` array as a prop. Use Tailwind CSS `grid` (e.g., `grid-cols-2`) to lay out multiple `IndividualScoreCard` components by mapping over the scores data.
    *   **Integration:** Import `ScoreGrid` into `ContentEffectivenessPage.tsx` and place it inside the `TabsContent` for the "Performance Scores" tab: `<ScoreGrid scores={contentScores.data} />`.
    *   **Files:** `src/components/views/analyzer/IndividualScoreCard.tsx`, `src/components/views/analyzer/ScoreGrid.tsx`, `src/pages/ContentEffectivenessPage.tsx`.

7.  **Implement `ContentDetailsTab` Content (Right Column):**
    *   **Action:** Create `src/components/views/analyzer/ContentDetailsTab.tsx`. It should accept `contentDetails.data` as a prop. Display relevant details (e.g., full text/body, specific metadata fields) using appropriate `shadcn/ui` components (like `Card`, `DescriptionList`, `Textarea` if needed).
    *   **Integration:** Import and use inside the "Content Details" `TabsContent` in `ContentEffectivenessPage.tsx`.
    *   **Files:** `src/components/views/analyzer/ContentDetailsTab.tsx`, `src/pages/ContentEffectivenessPage.tsx`.

8.  **Implement `ImprovementAreasTab` Content (Right Column):**
    *   **Action:** Create `src/components/views/analyzer/ImprovementAreasTab.tsx`. It should accept `contentScores.data` as a prop. Map over the scores, displaying the `check_name` and `fix_recommendation` for each. Use `shadcn/ui Card` or `Accordion` for structuring the recommendations.
    *   **Integration:** Import and use inside the "Areas to Improve" `TabsContent` in `ContentEffectivenessPage.tsx`.
    *   **Files:** `src/components/views/analyzer/ImprovementAreasTab.tsx`, `src/pages/ContentEffectivenessPage.tsx`.

### Phase 3: Refinement & Styling

9.  **Styling and Recharts Customization:**
    *   **Context:** Ensure the visual appearance matches the design image closely.
    *   **Action:** Refine Tailwind CSS classes across all components. Pay close attention to the Recharts components (`OverallScoreCard`, `IndividualScoreCard`) - adjust props like `innerRadius`, `outerRadius`, `startAngle`, `endAngle`, `fill`, and potentially use custom label components to match the exact look (percentage display, progress track style). Consult Recharts documentation. Ensure colors match the design (and implement the green/orange logic).
    *   **Files:** All `.tsx` component files, potentially `src/index.css` or theme configuration if needed.

10. **Address Data Assumptions:**
    *   **Context:** Resolve the "Key Questions / Assumptions" noted in `ContentEffectivenessImplementation.md`.
    *   **Action:** Confirm the exact data fields for image URL, duration, audience, overall score source, score descriptions, and the logic for score colors. Update component implementations based on these clarifications. This might involve adjusting data access patterns (e.g., `contentDetails.data.metadata.imageUrl` vs. `contentDetails.data.image_url`).
    *   **Files:** All relevant `.tsx` component files, potentially data fetching hooks.

11. **Final Review and Testing:**
    *   **Context:** Ensure the page functions correctly and looks polished.
    *   **Action:** Test the page with different content items (if selection is implemented). Check responsiveness across different screen sizes. Verify loading and error states work as expected. Perform a final visual comparison against the design image.
    *   **Files:** Primarily `src/pages/ContentEffectivenessPage.tsx` and its child components.

---

By following these steps, `ContentEffectivenessPage.tsx` will be successfully refactored into the detailed Content Analyzer view, providing users with valuable insights into their content's performance. Remember to create the component files (`ContentPreview.tsx`, `OverallScoreCard.tsx`, etc.) as you progress through the steps. 