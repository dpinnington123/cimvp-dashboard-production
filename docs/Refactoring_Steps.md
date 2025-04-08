Okay, here is a Product Requirements Document (PRD) based on the codebase analysis, outlining the necessary refactoring and cleanup tasks.

---

## Product Requirements Document: Marketing Dashboard Codebase Refactoring

**Version:** 1.0
**Date:** 2024-07-26
**Author:** AI Assistant (based on user request)
**Status:** Draft

**1. Introduction**

This document outlines the requirements for refactoring and cleaning up the existing Marketing Dashboard codebase. The analysis identified several areas with unused code, potential improvements in code quality and type safety, and reliance on placeholder data. Addressing these points will improve maintainability, reduce complexity, and prepare the codebase for future feature development and integration of real data sources.

**2. Goals**

*   **Reduce Codebase Size & Complexity:** Remove unused components, data, and CSS files.
*   **Improve Maintainability & Readability:** Enhance code structure, use constants, and ensure consistent patterns.
*   **Increase Type Safety:** Replace `any` types with specific interfaces or inferred types, leveraging TypeScript and Supabase types.
*   **Prepare for Real Data Integration:** Identify and replace dummy data placeholders with structures ready for actual data fetching hooks/services.
*   **Enhance UI Consistency:** Ensure consistent use of `shadcn/ui` components and styling.
*   **Fix Identified Issues:** Address specific problems like the PDF generation target.

**3. Target Audience**

*   Development Team responsible for maintaining and extending the Marketing Dashboard application.

**4. Requirements**

This section details the specific tasks derived from the codebase analysis. Priorities are suggested (High, Medium, Low).

**4.1. Code Removal & Cleanup (High Priority)**

| ID    | Requirement                                                                                                                               | Files Affected                                                                                                                               | Notes                                                                                                | Priority |
| :---- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :------- |
| CR-01 | **Verify and Remove Duplicate Layout:** Remove the potentially unused `DashboardLayout.tsx` within the `campaigns` view.                    | `src/components/views/campaigns/DashboardLayout.tsx`, `src/components/views/campaigns/Logo.tsx` (if only used by removed layout)           | **Verify** this layout isn't used elsewhere or planned for imminent integration before removal.      | High     |
| CR-02 | **Verify and Remove Unused Campaign Components:** Remove components seemingly designed for `CampaignPerformancePage` but not integrated. | `src/components/views/campaigns/AudienceInsights.tsx`, `EditableMetricsTable.tsx`, `MetricsCard.tsx`, `PerformanceChart.tsx`, `AnimatedCounter.tsx` | **Verify** these are not needed for current or near-future functionality. Check `CampaignPerformancePage`. | High     |
| CR-03 | **Remove Unused Demo Data:** Remove sections from `demoData` corresponding to removed components (CR-02).                               | `src/assets/avatars.ts`                                                                                                                      | Dependent on CR-02. Remove `performanceData`, `kpis`, `audienceData` sections if components are removed. | High     |
| CR-04 | **Remove Unused CSS:** Delete the default Vite `App.css` file.                                                                            | `src/App.css`                                                                                                                                | Ensure no imports exist.                                                                             | High     |
| CR-05 | **Remove Unused Imports:** Clean up unused import statements across all modified files.                                                   | All modified files                                                                                                                           | Can often be automated by linters/IDEs.                                                              | Medium   |

**4.2. Refactoring & Bug Fixes (Medium-High Priority)**

| ID    | Requirement                                                                                                                             | Files Affected                                                                                                                                  | Notes                                                                                                                            | Priority |
| :---- | :-------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------- |
| RF-01 | **Improve Type Safety:** Replace `any` types with specific types (inferred, interfaces, or Supabase types).                             | `src/pages/CampaignPerformancePage.tsx` (state variables), Potentially others using `any`.                                                    | Use `Tables` helper from `src/types/supabase.ts` where applicable.                                                               | High     |
| RF-02 | **Replace Dummy Data Placeholders:** Refactor components using hardcoded dummy data to be ready for real data fetching.                 | `src/components/views/strategy/ChannelPerformanceChart.tsx`, `GeoChart.tsx`, `MultiChannelChart.tsx`, `CampaignTable.tsx` (standalone file) | This involves *preparing* the component structure. Actual data fetching implementation might be a separate task/PR.              | High     |
| RF-03 | **Ensure Consistent Error Handling:** Use the `ErrorDisplay` component in all views/components that perform data fetching.              | Components identified in RF-02, potentially `CampaignPerformancePage` if fetching live data.                                                  | Wrap data-dependent JSX in loading/error checks based on `react-query` state.                                                    | Medium   |
| RF-04 | **Use Constants for Magic Values:** Replace hardcoded score thresholds, status strings, etc., with named constants.                     | `src/pages/CampaignPerformancePage.tsx`, potentially others.                                                                                  | Improves readability and maintainability. Define constants locally or in `src/lib/constants.ts`.                                 | Medium   |
| RF-05 | **Fix PDF Generation Target:** Update `PdfReportButton` to target the specific content area of the report instead of `document.body`. | `src/components/views/campaigns/PdfReportButton.tsx`                                                                                          | Requires identifying the correct container element/ID in the pages where the button is used (e.g., `CampaignPerformancePage`). | Medium   |

**4.3. Code Quality & Optional Optimizations (Medium-Low Priority)**

| ID    | Requirement                                                                                                                             | Files Affected                                  | Notes                                                                                                                                                              | Priority |
| :---- | :-------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| QL-01 | **Review Component Structure:** Evaluate if `CampaignPerformancePage.tsx` should be split into separate List and Detail components.     | `src/pages/CampaignPerformancePage.tsx`         | Optional refactoring for better separation of concerns if the component becomes too large.                                                                         | Low      |
| QL-02 | **Review Sidebar Complexity:** Assess if the features provided by the custom `src/components/ui/sidebar.tsx` are all necessary.         | `src/components/ui/sidebar.tsx`                 | Optional optimization. If only basic sidebar functionality is needed, consider simplifying or using a more standard `shadcn/ui` pattern if applicable.             | Low      |
| QL-03 | **Verify Shadcn Component Usage:** Confirm that all installed `shadcn/ui` components (e.g., `Command`, `Dialog`, `Popover`) are used. | `components.json`, `src/components/ui/` | Optional cleanup. If components were installed but are not used in the final intended UI, they could potentially be removed via the `shadcn/ui` CLI (use with caution). | Low      |

**5. Non-Functional Requirements**

*   **Maintainability:** Code should be easy to understand, modify, and debug after refactoring.
*   **Readability:** Code should follow consistent formatting and naming conventions. Use of constants and specific types contributes to this.
*   **Performance:** Removing unused code may slightly improve load times and reduce bundle size. Ensure refactoring does not introduce performance regressions.
*   **Testability:** Well-structured components with clear responsibilities are easier to test (though tests are not part of this PRD).

**6. Design Considerations**

*   Maintain the established visual style defined by `shadcn/ui` and Tailwind configuration.
*   Ensure UI elements remain consistent across different views after refactoring.

**7. Release Criteria / Definition of Done**

The refactoring effort is considered complete when:

*   All "High" priority requirements (CR-01 to CR-04, RF-01, RF-02) are implemented and verified.
*   All "Medium" priority requirements (CR-05, RF-03, RF-04, RF-05) are implemented.
*   Code has been reviewed and approved.
*   The application builds successfully without errors.
*   The application runs without any new runtime errors or regressions in existing functionality.
*   Linters and type checks pass successfully.
*   Low priority items (QL-01, QL-02, QL-03) are considered but not strictly required for completion of this specific refactoring phase.

**8. Future Considerations / Out of Scope**

*   Implementation of actual data fetching logic for components identified in RF-02.
*   Implementation of new features not related to refactoring.
*   Major UI redesigns.
*   Adding unit or integration tests.
*   Implementing deferred pages like "Audience & Channels".

---