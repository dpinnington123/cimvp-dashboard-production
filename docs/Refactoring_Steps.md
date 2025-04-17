Okay, here is a comprehensive plan focusing on the highest priority refactoring items identified: improving type safety in the service layer and verifying component interactions.

This plan assumes the tasks marked as "Completed" in `docs/refactor_progress.md` (CR-01, CR-02, CR-03, CR-04, RF-05, partial RF-01/RF-02/RF-03) are indeed done.

---

## Refactoring Plan: High-Priority Type Safety & Verification

**Version:** 1.0
**Date:** 2024-07-26
**Focus:** Addressing RF-01 (Type Safety) in services and verifying related component impacts.

**1. Objective**

*   Eliminate `any` types within the service layer (`uploadService.ts`, `contentProcessingService.ts`).
*   Ensure data structures used and returned by services align accurately with the Supabase schema (`src/types/supabase.ts`).
*   Verify that components consuming data from these services correctly handle the strongly-typed data structures.
*   Improve overall codebase maintainability and reduce potential runtime errors related to type mismatches.

**2. Scope**

*   **In Scope:**
    *   Refactoring `src/services/uploadService.ts` for type safety.
    *   Refactoring `src/services/contentProcessingService.ts` for type safety.
    *   Verifying and adjusting components that directly consume data from hooks related to these services (e.g., `useContent`, `useContentProcessing`).
    *   Basic code cleanup (unused imports) in modified files.
*   **Out of Scope:**
    *   Implementing actual backend analysis logic (replacing `simulateAnalysisProgress`).
    *   Addressing lower-priority refactoring items (QL-01, QL-02, QL-03 from `Refactoring_Steps.md`).
    *   Significant architectural changes.
    *   Adding new features or unit tests.
    *   Deep investigation into simplifying the RLS fallback in `uploadService.ts` (beyond ensuring types are correct).

**3. Priority Tasks (Detailed Steps)**

**Task 1: Refactor `uploadService.ts` for Type Safety (RF-01)**

*   **Goal:** Ensure all functions and internal helpers use specific types derived from the Supabase schema or defined interfaces.
*   **Steps:**
    1.  **(Done in Previous Suggestion)** Import `Tables` from `src/types/supabase.ts`.
    2.  **(Done)** Define `Content` type alias: `type Content = Tables<'content'>;`.
    3.  **(Done)** Define `FileInfo` type for clarity in representing file details.
    4.  **(Done)** Update `ProcessedContent` interface: Use `FileInfo[]` for `files`, review `status` enum possibilities.
    5.  **(Done)** Type the `data` parameter in `processContentData` function as `Content | null`.
    6.  **(Done)** Type the `files` parameter in `storeContentMetadata` and `processContentData` as `Omit<FileInfo, 'id'>[]`.
    7.  **(Done)** Update the return type of `processContentData` to `{ data: ProcessedContent | null, error: Error | null }`.
    8.  **Verify Mapping:** Carefully review the field mapping inside `processContentData` between the `Content` type (database row) and the `ProcessedContent` interface (frontend structure).
        *   Ensure fields like `description`, `category`, `tags`, `publishDate`, `location`, `cost` which are marked "Not in DB schema" in `processContentData` are handled correctly (either removed from `ProcessedContent` if truly not needed, or mapped from appropriate DB fields if they exist under different names).
        *   Confirm mapping for potentially ambiguous fields like `funnel_alignment`, `strategy_aligned_to`.
    9.  **Review Multi-File Logic:** Examine `getProcessedContent`. It currently reconstructs a single file based on `file_storage_path`. If multiple files per content item are a requirement *now*, this logic needs significant change (likely involving fetching related file records). If multi-file is *future* scope, document this limitation clearly. For now, ensure the single-file logic is type-safe.
    10. **Review RPC Fallback:** Briefly review the `insert_content` RPC call in `storeContentMetadata`. Ensure the parameters passed (`p_content_name`, `p_client_id`, `p_status`) match the expected parameters of the Supabase RPC function. Ensure the subsequent fetch uses the correct ID. *Note: Fully removing/simplifying the fallback is out of scope for this phase.*

**Task 2: Refactor `contentProcessingService.ts` for Type Safety (RF-01)**

*   **Goal:** Ensure functions returning or manipulating analysis data use specific types.
*   **Steps:**
    1.  **(Done in Previous Suggestion)** Import `Tables` from `src/types/supabase.ts`.
    2.  **(Done)** Define `ContentAnalysis` type alias: `type ContentAnalysis = Tables<'content_analysis'>;`.
    3.  **(Done)** Define `Content` type alias: `type Content = Tables<'content'>;`.
    4.  **(Done)** Update the return type of `getContentAnalysisResults` to `{ data: ContentAnalysis | null, error: Error | null }`.
    5.  **(Done)** Update `contentId` parameter types to `number` in all functions (`getContentAnalysisStatus`, `startContentAnalysis`, `getContentAnalysisResults`, `simulateAnalysisProgress`, `cancelContentAnalysis`) to match the schema's likely `content.id` type.
    6.  **Verify Simulation:** Review `simulateAnalysisProgress`. Ensure the fields inserted into the `content_analysis` table match the `ContentAnalysis` type definition. Adjust the mock data generation (`Math.random()`, etc.) if necessary to provide plausible values for the typed fields.
    7.  **Type Payloads:** Use `Partial<Content>` or `Partial<Tables<'content_analysis'>>` for update/insert payloads where applicable (e.g., in `startContentAnalysis`, `simulateAnalysisProgress`, `cancelContentAnalysis`) for better type checking.

**Task 3: Verify Component Type Safety & Data Consumption (RF-01 & RF-02 Verification)**

*   **Goal:** Ensure components correctly use the strongly-typed data from the refactored services and hooks.
*   **Steps:**
    1.  **Identify Consumers:** List components using `useContent` (`ContentUploadForm`, `ProcessContentPage`, `DashboardOverview`, `ContentReportsPage`, `AudiencePieChart`) and `useContentProcessing` (potentially future components, review if any exist now).
    2.  **Check for `any`:** Search within these components for explicit `any` types or implicit `any` resulting from data fetching (e.g., `const [myData, setMyData] = useState<any>()`). Replace with specific types (e.g., `ProcessedContent`, `ContentAnalysis`, `Content`).
    3.  **Verify Data Access:** Check how data returned from hooks (`useContent().data`, `useContentProcessing().useAnalysisResultsQuery().data`, etc.) is accessed. Ensure property names match the updated interfaces (`ProcessedContent`, `ContentAnalysis`). Adjust data access logic (e.g., `data?.metadata?.title` instead of `data?.title`).
    4.  **Check Prop Types:** If data is passed down as props, ensure the prop types in child components match the refined data structures.
    5.  **Review `ContentUploadForm`:** Double-check the `handleSubmit` function. Ensure the `mappedMetadata` object created correctly populates all *required* fields of the `ContentMetadata` interface before being passed to `uploadContentMutation.mutateAsync`.

**Task 4: Code Cleanup (CR-05 - Medium Priority)**

*   **Goal:** Remove clutter introduced during refactoring.
*   **Steps:**
    1.  **Remove Unused Imports:** Use IDE features or linters (`eslint --fix`) to automatically remove unused import statements in all modified files (`*.ts`, `*.tsx`).
    2.  **Remove Dead Code:** Manually review modified files for commented-out code blocks or console logs that are no longer necessary and remove them.

**4. Verification & Testing**

1.  **Static Analysis:**
    *   Run `tsc --noEmit` to ensure no TypeScript compilation errors.
    *   Run `eslint .` (or equivalent) to ensure code style and quality checks pass.
2.  **Manual Smoke Testing:**
    *   **Authentication:** Log in and log out successfully.
    *   **Navigation:** Access all main pages defined in the router (`/`, `/content-reports`, `/content-reports/:id`, `/brand-dashboard`, `/strategic-dashboard`, `/process-content`, `/brand-strategy`).
    *   **Content Upload:** Navigate to `/process-content`, upload a file (image or PDF), fill required metadata (Title), and submit. Verify success toast and check Supabase `content` table for the new record. Check `Storage` for the uploaded file.
    *   **Content List:** Verify the newly uploaded item appears correctly in lists (e.g., on `ProcessContentPage` recent items, `ContentReportsPage` list view).
    *   **Content Detail:** Navigate to the detail page (`/content-reports/:id`) for the newly uploaded item. Verify:
        *   Content preview displays correctly.
        *   Overall score (likely 0 initially or based on simulation) displays.
        *   Performance Scores tab shows scores generated by the simulation (if applicable).
        *   Content Details tab shows correct metadata.
        *   Improvements tab shows simulated recommendations.
    *   **Dashboard Views:** Briefly check `DashboardOverview`, `BrandDashboardPage`, `StrategicDashboardPage`, `BrandStrategyPage` to ensure they still load data (even if dummy) without new errors.

**5. Potential Risks & Considerations**

*   **RLS Complexity:** The RPC fallback in `uploadService.ts` might mask underlying RLS configuration issues. While not fixing RLS is out of scope, be aware that upload failures might still occur if the fallback is removed or the primary insert path has permission issues.
*   **Type Mapping Errors:** Incorrect mapping between database schema (`Content`, `ContentAnalysis`) and frontend interfaces (`ProcessedContent`, `ContentMetadata`) could lead to runtime errors or incorrect data display. Careful verification (Step 1.8, 2.5) is crucial.
*   **Component Breakage:** Changes to data structures returned by hooks might break components if verification (Task 3) is incomplete.
*   **Multi-File Handling:** The current assumption of single `file_storage_path` per content item might be insufficient. If multi-file support is needed, Task 1.9 requires significant expansion.

**6. Definition of Done**

*   All steps under Task 1, Task 2, and Task 3 are completed and verified.
*   Task 4 (Code Cleanup) is completed for all modified files.
*   TypeScript compilation (`tsc --noEmit`) passes without errors.
*   ESLint checks pass without errors.
*   All manual verification tests pass successfully.
*   No regressions in existing functionality (login, navigation, basic page rendering) are observed.
*   Code changes are reviewed and merged into the main development branch.

---