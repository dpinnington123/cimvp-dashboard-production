# Process Content Page Implementation Plan

This document outlines the steps to create the new "Process Content" page.

1.  **Create Page File:**
    *   **Action:** Create a new file at `src/pages/ProcessContentPage.tsx`.
    *   **Context:** This file will contain the React component defining the structure and content of the new "Process Content" page. Placing it in the `src/pages` directory follows common React project structure conventions.

2.  **Basic Page Structure & Component Import:**
    *   **Action:** Inside `ProcessContentPage.tsx`, create a basic functional React component structure.
    *   **Action:** Import the `ContentUploadForm` component from `@/components/views/processContent/ContentUploadForm.tsx`.
    *   **Context:** This sets up the foundation for the page and brings in the core element – the form you've already built – making it available for use within the page layout.

3.  **Implement Layout and Header (Based on Images):**
    *   **Action:** Add JSX structure within the `ProcessContentPage` component to create the overall page layout seen in the images. This will likely involve:
        *   A main container `div` to manage padding and potentially center the content.
        *   A header section at the top (as seen in `image2.png`) containing:
            *   The "change influence" logo (Need to check if a logo component/asset exists or create a placeholder).
            *   The "Content Analysis" tag/badge.
        *   The main title "Add Your Content".
        *   The subtitle/step indicator text ("1. Upload your files 2. Add the context content 3. Analyse").
    *   **Action:** Render the imported `<ContentUploadForm />` component below the title and subtitle.
    *   **Context:** This step translates the visual design from the images into the component's structure. It adds the branding, titles, and integrates the existing form component into its designated place on the page.

4.  **Apply Styling:**
    *   **Action:** Use Tailwind CSS classes on the elements created in step 3 to match the visual appearance (spacing, alignment, text sizes, colors, background) shown in the images. Pay attention to centering the main content block.
    *   **Context:** Styling ensures the page visually aligns with the provided mockups, creating a consistent user interface. The `ContentUploadForm` already contains much of its own styling within its `Card` structure, so this step focuses on the page's container, header, and titles.

5.  **Set Up Routing:**
    *   **Action:** Add a new route definition to your application's router setup (likely located in `src/App.tsx` or a dedicated routing file like `src/routes.tsx`). This route should map a URL path (e.g., `/process-content`) to the `ProcessContentPage` component.
    *   **Action:** Ensure `ProcessContentPage` is imported into the router file.
    *   **Context:** This makes the newly created page accessible within the application via a specific URL, integrating it into the overall navigation flow.

6.  **Review and Refine:**
    *   **Action:** Run the application and navigate to the `/process-content` route.
    *   **Action:** Compare the rendered page against the provided images (`image1.png`, `image2.png`).
    *   **Action:** Make any necessary adjustments to the layout or styling in `ProcessContentPage.tsx` to ensure visual fidelity.
    *   **Context:** This final step verifies the implementation against the requirements and allows for fine-tuning to achieve the desired look and feel. 