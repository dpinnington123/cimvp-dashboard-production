# Vercel Deployment Plan

This document outlines the steps to configure and deploy the React+Vite+TypeScript application to Vercel.

## 1. Project Configuration Verification ✅

*   **Build Command:** Confirm Vercel uses `yarn build` (`tsc -b && vite build`). Vercel usually detects this automatically from `package.json`.
*   **Output Directory:** Verify Vite's output directory. By default, it's `dist`. Ensure Vercel is configured to use this directory. Check `vite.config.ts` for any explicit `build.outDir` setting. If it's different, update Vercel settings accordingly.
*   **Node.js Version:** ✅ Added `engines` field in package.json to specify Node.js >=18.0.0.

## 2. Environment Variables ✅

*   **Identify Required Variables:** List all environment variables needed for the application to run in production. Based on dependencies, this will definitely include Supabase credentials:
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
    *   *(Add any other custom environment variables used)*
*   **Configure in Vercel:** Add these environment variables to the Vercel project settings (Settings -> Environment Variables). Ensure they are prefixed with `VITE_` as required by Vite to expose them to the client-side bundle, unless they are server-side only (which doesn't seem to be the case here, but good practice to check). **Important:** Do *not* commit sensitive keys to Git.
*   ✅ Created `env.example` to document required environment variables.

## 3. Routing Configuration ✅

*   **Client-Side Routing:** Since `react-router-dom` is used, ensure Vercel is configured to handle client-side routing correctly. This usually involves setting up a rewrite rule so that all paths fallback to `index.html`.
*   **Create `vercel.json`:** ✅ Created vercel.json file with the following content:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ],
      "buildCommand": "yarn build",
      "outputDirectory": "dist"
    }
    ```

## 4. Vercel Project Setup

*   **Connect Repository:** Connect the GitHub/GitLab/Bitbucket repository to Vercel.
*   **Framework Preset:** Ensure Vercel selects the "Vite" framework preset during project setup.
*   **Root Directory:** Confirm the root directory is set correctly (usually the repository root).
*   **Build & Output Settings:** Double-check that the Build Command (`yarn build`) and Output Directory (`dist`) are correctly configured in the Vercel project settings.

## 5. Deployment & Testing

*   **Trigger Deployment:** Push changes to the main branch (or the configured production branch) to trigger a deployment on Vercel.
*   **Monitor Build Logs:** Check the Vercel deployment logs for any build errors.
*   **Test Production URL:** Once deployed, thoroughly test the application using the Vercel production URL. Check:
    *   Core functionality.
    *   Routing between pages.
    *   Supabase integration (data fetching, authentication if used).
    *   Console for errors.
    *   Network requests.

## 6. (Optional) Custom Domain

*   If required, configure a custom domain in the Vercel project settings (Settings -> Domains).

## 7. Documentation Update ✅

*   ✅ Updated `README.md` with brief deployment instructions.
*   ✅ Created `docs/DEPLOYMENT.md` with detailed deployment instructions and troubleshooting info.
