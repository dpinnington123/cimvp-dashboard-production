

\# Project Instructions: CIMVP

\#\# 1\. Overview

Welcome\! This document guides you through building a comprehensive Marketing Dashboard application. The goal is to merge functionalities from three conceptual dashboards into a single React application using Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts, and Supabase.

The dashboard will connect to an existing Supabase backend and feature several views:

1\.  \*\*Main Overview:\*\* High-level snapshot of key metrics.  
2\.  \*\*Content Analyzer:\*\* Detailed analysis of individual content pieces based on scores and recommendations from Supabase.  
3\.  \*\*Content Performance:\*\* (Initially using dummy data) Aggregated performance across campaigns, channels, and geography, including PDF report generation.  
4\.  \*\*Audience & Channels:\*\* (Partially using dummy data) Insights into audience types and channel performance.

You will implement user authentication using Supabase Auth and ensure data is fetched securely based on the logged-in user.

\#\# 2\. Prerequisites

Before you begin, ensure you have the following installed and set up:

\*   \*\*Node.js:\*\* Version 18.0.0 or later. (\[Download Node.js\](https://nodejs.org/))  
\*   \*\*Yarn:\*\* Version 1.22.0 or later (or npm v8.0.0+). We will use Yarn in these instructions. (\[Install Yarn\](https://classic.yarnpkg.com/en/docs/install))  
\*   \*\*Git:\*\* For version control. (\[Download Git\](https://git-scm.com/))  
\*   \*\*Code Editor:\*\* Visual Studio Code (Recommended) or any other editor of your choice.  
\*   \*\*Supabase Account:\*\* Access to the specific Supabase project (details will be needed for environment variables). You should have the Project URL and Anon Key.

\#\# 3\. Phase 1: Project Setup & Foundation

Let's initialize the React project using Vite and set up the core tooling.

1\.  \*\*Create Project:\*\*  
    Open your terminal and run:  
    \`\`\`bash  
    yarn create vite supabase-marketing-dashboard \--template react-ts  
    cd supabase-marketing-dashboard  
    \`\`\`

2\.  \*\*Install Dependencies:\*\*  
    Install the main libraries:  
    \`\`\`bash  
    yarn add react-router-dom@6 @tanstack/react-query@5 recharts lucide-react @supabase/supabase-js jspdf html2canvas class-variance-authority clsx tailwind-merge  
    \`\`\`  
    Install development dependencies:  
    \`\`\`bash  
    yarn add \-D tailwindcss postcss autoprefixer @types/node  
    \`\`\`  
    \*(Note: \`class-variance-authority\`, \`clsx\`, \`tailwind-merge\` are peer dependencies for shadcn/ui)\*

3\.  \*\*Configure Tailwind CSS:\*\*  
    \*   Initialize Tailwind:  
        \`\`\`bash  
        yarn tailwindcss init \-p  
        \`\`\`  
    \*   Configure \`tailwind.config.js\`: Replace the contents with the following (we'll customize the theme later via shadcn/ui):  
        \`\`\`javascript  
        /\*\* @type {import('tailwindcss').Config} \*/  
        module.exports \= {  
          darkMode: \["class"\], // Enable class-based dark mode  
          content: \[  
            './pages/\*\*/\*.{ts,tsx}',  
            './components/\*\*/\*.{ts,tsx}',  
            './app/\*\*/\*.{ts,tsx}',  
            './src/\*\*/\*.{ts,tsx}', // Make sure src is included  
            './index.html',        // Include index.html  
          \],  
          prefix: "",  
          theme: {  
            container: {  
              center: true,  
              padding: "2rem",  
              screens: {  
                "2xl": "1400px",  
              },  
            },  
            extend: {  
              keyframes: {  
                "accordion-down": {  
                  from: { height: "0" },  
                  to: { height: "var(--radix-accordion-content-height)" },  
                },  
                "accordion-up": {  
                  from: { height: "var(--radix-accordion-content-height)" },  
                  to: { height: "0" },  
                },  
              },  
              animation: {  
                "accordion-down": "accordion-down 0.2s ease-out",  
                "accordion-up": "accordion-up 0.2s ease-out",  
              },  
            },  
          },  
          plugins: \[require("tailwindcss-animate")\],  
        }  
        \`\`\`  
    \*   Setup Global Styles (\`src/index.css\`): Replace the contents of this file with:  
        \`\`\`css  
        @tailwind base;  
        @tailwind components;  
        @tailwind utilities;

        @layer base {  
          :root {  
            /\* Define CSS variables for colors, etc. here, shadcn/ui will populate these \*/  
          }

          .dark {  
            /\* Define dark mode variables here \*/  
          }  
        }

        @layer base {  
          \* {  
            @apply border-border;  
          }  
          body {  
            @apply bg-background text-foreground;  
            font-feature-settings: "rlig" 1, "calt" 1; /\* Enable ligatures \*/  
          }  
        }  
        \`\`\`

4\.  \*\*Setup \`shadcn/ui\`:\*\*  
    \*   Run the init command:  
        \`\`\`bash  
        yarn dlx shadcn-ui@latest init  
        \`\`\`  
    \*   Follow the prompts:  
        \*   Choose your base color, CSS variables preference, \`tailwind.config.js\` location (\`./tailwind.config.js\`), import alias (\`@/components\`), utils alias (\`@/lib/utils\`), etc. Confirm overwrite for \`tailwind.config.js\` and \`index.css\` if prompted (it adds theme variables).  
    \*   Install Essential Components: Let's add some commonly used ones now. Run these commands one by one:  
        \`\`\`bash  
        yarn dlx shadcn-ui@latest add button  
        yarn dlx shadcn-ui@latest add card  
        yarn dlx shadcn-ui@latest add table  
        yarn dlx shadcn-ui@latest add input  
        yarn dlx shadcn-ui@latest add label  
        yarn dlx shadcn-ui@latest add select  
        yarn dlx shadcn-ui@latest add popover  
        yarn dlx shadcn-ui@latest add command  
        yarn dlx shadcn-ui@latest add date-picker  
        yarn dlx shadcn-ui@latest add toast  
        yarn dlx shadcn-ui@latest add separator  
        \# Add more later as needed (e.g., dropdown-menu, tooltip)  
        \`\`\`  
        This will create files in \`src/components/ui/\` and potentially \`src/lib/utils.ts\`.

5\.  \*\*Environment Variables:\*\*  
    \*   Create a file named \`.env.local\` in the project root.  
    \*   Add your Supabase URL and Anon Key:  
        \`\`\`env  
        \# .env.local  
        VITE\_SUPABASE\_URL=https://gbzrparwhkacvfasltbe.supabase.co  
        VITE\_SUPABASE\_ANON\_KEY=YOUR\_SUPABASE\_ANON\_KEY\_HERE \# Replace with the actual key  
        \`\`\`  
    \*   \*\*IMPORTANT:\*\* Add \`.env.local\` to your \`.gitignore\` file to avoid committing sensitive keys. Open \`.gitignore\` and add this line:  
        \`\`\`gitignore  
        .env.local  
        \`\`\`

6\.  \*\*Create Project Structure:\*\*  
    Create the following directories inside the \`src\` folder:  
    \`\`\`  
    src/  
    ├── assets/  
    ├── components/  
    │   ├── common/  
    │   ├── layout/  
    │   └── ui/       \# (shadcn components live here)  
    │   └── views/  
    │       ├── overview/  
    │       ├── performance/  
    │       ├── analyzer/  
    │       └── audience/  
    ├── hooks/  
    ├── lib/          \# (utils.ts from shadcn lives here)  
    ├── pages/  
    ├── services/  
    ├── styles/       \# (index.css lives here)  
    └── types/  
    \`\`\`

7\.  \*\*Basic Routing Setup:\*\*  
    \*   Modify \`src/App.tsx\` to include React Router:  
        \`\`\`typescript  
        // src/App.tsx  
        import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';  
        import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  
        import DashboardLayout from './components/layout/DashboardLayout';  
        import DashboardOverview from './pages/DashboardOverview';  
        import ContentAnalyzerPage from './pages/ContentAnalyzerPage';  
        import ContentPerformancePage from './pages/ContentPerformancePage';  
        import AudienceChannelsPage from './pages/AudienceChannelsPage';  
        import LoginPage from './pages/LoginPage'; // We will create this  
        import NotFound from './pages/NotFound';  
        import { Toaster } from "@/components/ui/toaster"; // shadcn toaster  
        import AuthProvider, { useAuth } from './hooks/useAuth'; // We will create this

        const queryClient \= new QueryClient();

        function App() {  
          return (  
            \<QueryClientProvider client={queryClient}\>  
              \<BrowserRouter\>  
                \<AuthProvider\> {/\* Wrap with AuthProvider \*/}  
                  \<AppRoutes /\>  
                  \<Toaster /\> {/\* Add toaster for notifications \*/}  
                \</AuthProvider\>  
              \</BrowserRouter\>  
            \</QueryClientProvider\>  
          );  
        }

        // Separate component to use useAuth hook  
        function AppRoutes() {  
          const { session } \= useAuth();

          return (  
            \<Routes\>  
              \<Route path="/login" element={\<LoginPage /\>} /\>  
              \<Route  
                path="/"  
                element={  
                  session ? \<DashboardLayout /\> : \<Navigate to="/login" replace /\>  
                }  
              \>  
                {/\* Nested routes render inside DashboardLayout's Outlet \*/}  
                \<Route index element={\<DashboardOverview /\>} /\>  
                \<Route path="analyzer" element={\<ContentAnalyzerPage /\>} /\>  
                \<Route path="performance" element={\<ContentPerformancePage /\>} /\>  
                \<Route path="audience" element={\<AudienceChannelsPage /\>} /\>  
              \</Route\>  
              \<Route path="\*" element={\<NotFound /\>} /\>  
            \</Routes\>  
          );  
        }

        export default App;  
        \`\`\`  
    \*   Create placeholder page files (\`DashboardOverview.tsx\`, \`ContentAnalyzerPage.tsx\`, etc., and \`NotFound.tsx\`, \`LoginPage.tsx\`) in \`src/pages/\` with basic content, e.g.:  
        \`\`\`typescript  
        // src/pages/DashboardOverview.tsx  
        export default function DashboardOverview() {  
          return \<div\>Dashboard Overview Page\</div\>;  
        }  
        \`\`\`

8\.  \*\*Basic Layout Components:\*\*  
    \*   Create \`src/components/layout/DashboardLayout.tsx\`: This component will wrap the main dashboard pages and should include a sidebar and header. Use \`\<Outlet /\>\` from \`react-router-dom\` where the nested page content should render.  
        \`\`\`typescript  
        // src/components/layout/DashboardLayout.tsx (Basic Structure)  
        import { Outlet, Link } from 'react-router-dom';  
        import Header from './Header'; // Create Header.tsx  
        import Sidebar from './Sidebar'; // Create Sidebar.tsx

        export default function DashboardLayout() {  
          return (  
            \<div className="flex h-screen bg-gray-100 dark:bg-gray-900"\>  
              \<Sidebar /\>  
              \<div className="flex-1 flex flex-col overflow-hidden"\>  
                \<Header /\>  
                \<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800 p-4 md:p-6"\>  
                  {/\* Page content renders here \*/}  
                  \<Outlet /\>  
                \</main\>  
              \</div\>  
            \</div\>  
          );  
        }  
        \`\`\`  
    \*   Create \`src/components/layout/Sidebar.tsx\`: Include navigation links (\`Link\` from \`react-router-dom\`) for the different dashboard views. Style using Tailwind/shadcn.  
    \*   Create \`src/components/layout/Header.tsx\`: Include the page title, maybe a user menu/logout button later.

\#\# 4\. Phase 2: Supabase Integration & Authentication

Now, let's connect to Supabase, handle types, and set up user login.

1\.  \*\*Supabase Client:\*\*  
    \*   Create \`src/lib/supabaseClient.ts\` and add the client initialization code (as shown in the previous response). Make sure it uses the environment variables from \`.env.local\`.

2\.  \*\*TypeScript Types:\*\*  
    \*   \*\*Attempt CLI Generation (Recommended):\*\*  
        \*   Install Supabase CLI: \`yarn add \-D supabase\`  
        \*   Login: \`yarn supabase login\` (Follow terminal prompts)  
        \*   Link project: \`yarn supabase link \--project-ref gbzrparwhkacvfasltbe\` (Use your project ref)  
        \*   Generate types:  
            \`\`\`bash  
            yarn supabase gen types typescript \--linked \> src/types/supabase.ts  
            \`\`\`  
        \*   Verify \`src/types/supabase.ts\` looks correct based on your schema.  
    \*   \*\*Manual Fallback:\*\* If CLI fails, create \`src/types/supabase.ts\` manually using the structure provided in the previous response, carefully matching your \`content\` and \`scores\` table columns and types.

3\.  \*\*Authentication UI & Logic:\*\*  
    \*   Create \`src/pages/LoginPage.tsx\`: Build a simple login form using \`shadcn/ui\` \`Input\`, \`Label\`, \`Button\`, \`Card\`. Add state (\`useState\`) to manage email/password inputs.  
    \*   Create \`src/hooks/useAuth.ts\`:  
        \`\`\`typescript  
        // src/hooks/useAuth.ts  
        import { useState, useEffect, createContext, useContext, ReactNode } from 'react';  
        import { Session, User } from '@supabase/supabase-js';  
        import { supabase } from '../lib/supabaseClient';

        interface AuthContextType {  
          session: Session | null;  
          user: User | null;  
          loading: boolean;  
          signOut: () \=\> Promise\<void\>;  
          // Add signIn, signUp functions here later  
        }

        const AuthContext \= createContext\<AuthContextType | undefined\>(undefined);

        interface AuthProviderProps {  
          children: ReactNode;  
        }

        export default function AuthProvider({ children }: AuthProviderProps) {  
          const \[session, setSession\] \= useState\<Session | null\>(null);  
          const \[user, setUser\] \= useState\<User | null\>(null);  
          const \[loading, setLoading\] \= useState(true);

          useEffect(() \=\> {  
            const setData \= async (sessionData: Session | null) \=\> {  
              setSession(sessionData);  
              setUser(sessionData?.user ?? null);  
              setLoading(false);  
            };

            const { data: { subscription } } \= supabase.auth.onAuthStateChange((\_event, sessionData) \=\> {  
              setData(sessionData);  
            });

            // Initial check  
            supabase.auth.getSession().then(({ data: { session: initialSession } }) \=\> {  
                setData(initialSession);  
            });

            return () \=\> {  
              subscription.unsubscribe();  
            };  
          }, \[\]);

          const signOut \= async () \=\> {  
            await supabase.auth.signOut();  
            // State updates handled by onAuthStateChange  
          };

          // Implement signInWithPassword, signUp here later

          const value \= {  
            session,  
            user,  
            loading,  
            signOut,  
            // Add signIn, signUp to context value  
          };

          return (  
            \<AuthContext.Provider value={value}\>  
              {\!loading && children} {/\* Render children only when initial auth check is done \*/}  
            \</AuthContext.Provider\>  
          );  
        }

        export const useAuth \= () \=\> {  
          const context \= useContext(AuthContext);  
          if (context \=== undefined) {  
            throw new Error('useAuth must be used within an AuthProvider');  
          }  
          return context;  
        };  
        \`\`\`  
    \*   In \`LoginPage.tsx\`, use \`supabase.auth.signInWithPassword(...)\` on form submission. Handle errors and loading states. Redirect on success (React Router's \`useNavigate\`).  
    \*   In \`Header.tsx\` (or Sidebar), add a Logout button that calls \`signOut()\` from the \`useAuth\` hook.  
    \*   The \`AppRoutes\` component in \`App.tsx\` already handles basic redirection based on the session state from \`useAuth\`.

4\.  \*\*Row Level Security (RLS) Policies \- CRITICAL:\*\*  
    \*   Go to your Supabase Project Dashboard: \`https://app.supabase.com/project/gbzrparwhkacvfasltbe\`  
    \*   Navigate to \`Authentication\` \-\> \`Policies\`.  
    \*   Find the \`content\` table.  
        \*   Click "Enable RLS" if it's not already enabled.  
        \*   Click "New Policy" \-\> "Create a new policy from scratch".  
        \*   \*\*SELECT Policy:\*\*  
            \*   Policy Name: \`Allow authenticated users select own content\`  
            \*   Target roles: \`authenticated\`  
            \*   USING expression: \`(auth.uid() \= client\_id)\`  
            \*   Click "Review" and "Save policy".  
        \*   \*\*INSERT Policy:\*\*  
            \*   Click "New Policy" \-\> "Create a new policy from scratch".  
            \*   Policy Name: \`Allow authenticated users insert own content\`  
            \*   Target roles: \`authenticated\`  
            \*   WITH CHECK expression: \`(auth.uid() \= client\_id)\`  
            \*   Click "Review" and "Save policy".  
    \*   Repeat the process for the \`scores\` table, creating similar SELECT and INSERT policies using \`(auth.uid() \= client\_id)\`.  
    \*   \*\*Verification:\*\* After logging in, your app should only fetch data where the \`client\_id\` matches the logged-in user's ID.

\#\# 5\. Phase 3: Core Data Fetching & Shared Components

Let's set up React Query and create reusable UI elements.

1\.  \*\*Data Fetching Services:\*\*  
    \*   Create \`src/services/contentService.ts\`. Add the \`fetchContentList\` and \`fetchContentDetails\` functions (using \`supabase.from('content')...\`) as shown in the previous response. Ensure they handle errors.  
    \*   Create \`src/services/scoreService.ts\`. Add the \`fetchScoresForContent\` function (using \`supabase.from('scores')...\`) as shown previously. Ensure error handling.

2\.  \*\*React Query Hooks:\*\*  
    \*   Create \`src/hooks/useContent.ts\`. Add the \`useContentList\`, \`useContentDetails\`, and \`useContentScores\` hooks using \`@tanstack/react-query\` and the service functions, as shown previously. Pay attention to \`queryKey\`, \`queryFn\`, and \`enabled\`.

3\.  \*\*Shared Components (\`src/components/common/\`):\*\*  
    \*   Create \`StatCard.tsx\`: A simple card to display a title, value, and maybe a small trend indicator or description. Use \`shadcn/ui\` Card component.  
        \`\`\`typescript  
        // Example: src/components/common/StatCard.tsx  
        import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

        interface StatCardProps {  
          title: string;  
          value: string | number;  
          description?: string;  
          icon?: React.ReactNode; // e.g., Lucide icon  
        }

        export function StatCard({ title, value, description, icon }: StatCardProps) {  
          return (  
            \<Card\>  
              \<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"\>  
                \<CardTitle className="text-sm font-medium"\>{title}\</CardTitle\>  
                {icon}  
              \</CardHeader\>  
              \<CardContent\>  
                \<div className="text-2xl font-bold"\>{value}\</div\>  
                {description && \<p className="text-xs text-muted-foreground"\>{description}\</p\>}  
              \</CardContent\>  
            \</Card\>  
          );  
        }  
        \`\`\`  
    \*   Create \`ChartCard.tsx\`: A wrapper component for Recharts charts. Use \`shadcn/ui\` Card to provide consistent padding, title, etc. It should accept chart components as children.  
    \*   Create \`LoadingSpinner.tsx\`: A simple loading indicator (e.g., using a Lucide icon and Tailwind animation).  
    \*   Create \`ErrorDisplay.tsx\`: A component to show error messages nicely.

\#\# 6\. Phase 4: Building Dashboard Views

Implement the specific pages, using real data where possible and clearly marked dummy data elsewhere.

1\.  \*\*Overview Page (\`src/pages/DashboardOverview.tsx\`):\*\*  
    \*   Use the \`useContentList\` hook.  
    \*   Display loading and error states using \`LoadingSpinner\` and \`ErrorDisplay\`.  
    \*   Display "Total Content Items" using \`data.length\` in a \`StatCard\`.  
    \*   \*\*Add Dummy Stat Cards:\*\*  
        \`\`\`typescript  
        // \--- DUMMY DATA PLACEHOLDER \---  
        // Replace these with actual data fetching when available  
        const dummyImpressions \= "125,3k";  
        const dummyEngagement \= "72%";  
        // \--- END DUMMY DATA \---

        // ... inside component render  
        \<StatCard title="Total Impressions (Dummy)" value={dummyImpressions} description="+5.2% this month" /\>  
        \<StatCard title="Avg. Engagement (Dummy)" value={dummyEngagement} /\>  
        \`\`\`  
    \*   Optionally, add a simple Recharts chart using hardcoded data for now.

2\.  \*\*Content Analyzer Page (\`src/pages/ContentAnalyzerPage.tsx\`):\*\*  
    \*   Create \`src/components/views/analyzer/ContentSelector.tsx\`: Use \`shadcn/ui\` Select or Command component. Populate it with data from \`useContentList\` hook (\`data?.map(content \=\> ({ value: content.id, label: content.title }))\`). Manage the selected content ID in state.  
    \*   In the page component, get the selected \`contentId\` from the selector's state.  
    \*   Use \`useContentDetails(selectedContentId)\` and \`useContentScores(selectedContentId)\`. Handle their loading/error states.  
    \*   Create \`src/components/views/analyzer/ContentPreview.tsx\`: Display details from the \`contentDetails.data\`.  
        \*   Title: \`contentDetails.data?.title\`  
        \*   Type: \`contentDetails.data?.format\_type\`  
        \*   Audience: \`contentDetails.data?.audience\_type\`  
        \*   Image: Get from \`contentDetails.data?.metadata?.imageUrl\` (or similar key). \*\*Note:\*\* Add a placeholder image if \`metadata\` or the \`imageUrl\` key doesn't exist yet. Add a comment indicating this.  
    \*   Create \`src/components/views/analyzer/ScoreCard.tsx\`: Map over \`contentScores.data\`. For each score, display \`check\_name\` and \`score\_value\`. You might use the \`StatCard\` or create a custom card, perhaps with a simple progress bar or color coding based on score.  
    \*   Create \`src/components/views/analyzer/ImprovementArea.tsx\`: Map over \`contentScores.data\`. Display \`check\_name\` as title and \`fix\_recommendation\` as description. Use \`shadcn/ui\` Card or Accordion.

3\.  \*\*Content Performance Page (\`src/pages/ContentPerformancePage.tsx\`):\*\*  
    \*   \*\*Acknowledge Dummy Data:\*\* Add a prominent note at the top of the component or in comments that much of this data is currently static.  
    \*   Create \`src/components/views/performance/CampaignTable.tsx\`:  
        \`\`\`typescript  
          // \--- DUMMY DATA PLACEHOLDER \---  
          const dummyCampaigns \= \[  
            { id: 'C1', name: 'Spring Sale 2024', status: 'Active',startDate:'2024-03-01', endDate:'2024-03-31', budget: 5000, roi:'150%' },  
            { id: 'C2', name: 'New Product Launch', status: 'Completed',startDate:'2024-02-15', endDate:'2024-02-28', budget: 10000, roi:'210%' },  
            // Add more dummy campaigns  
          \];  
          // \--- END DUMMY DATA \---  
          // Use this array to render a shadcn/ui Table  
        \`\`\`  
    \*   Create \`src/components/views/performance/GeoChart.tsx\`:  
        \`\`\`typescript  
          // \--- DUMMY DATA PLACEHOLDER \---  
          const dummyGeoData \= \[  
            { country: 'USA', performance: 450 },  
            { country: 'Canada', performance: 200 },  
            { country: 'UK', performance: 300 },  
            { country: 'Germany', performance: 150 },  
          \];  
          // \--- END DUMMY DATA \---  
          // Use this data with a Recharts BarChart or potentially a map component later.  
        \`\`\`  
    \*   Create \`src/components/views/performance/MultiChannelChart.tsx\`:  
        \`\`\`typescript  
         // \--- DUMMY DATA PLACEHOLDER \---  
         const dummyChannelData \= \[  
           { date: '2024-03-01', Social: 120, Email: 80, Paid: 150 },  
           { date: '2024-03-08', Social: 135, Email: 85, Paid: 160 },  
           { date: '2024-03-15', Social: 150, Email: 95, Paid: 175 },  
           // Add more time points  
         \];  
         // \--- END DUMMY DATA \---  
         // Use this with a Recharts LineChart or BarChart.  
        \`\`\`  
    \*   Create \`src/components/views/performance/PdfReportButton.tsx\`:  
        \*   Add a button using \`shadcn/ui\` Button.  
        \*   In the \`onClick\` handler:  
            \*   Use \`useRef\` to get references to the DOM elements containing the charts/tables you want to include (start with elements from the Analyzer view if that's built first, or the dummy charts here).  
            \*   Use \`html2canvas\` to capture these elements as images.  
            \*   Use \`jspdf\` to create a new PDF document, add titles, text, and the captured images.  
            \*   Save the PDF (\`doc.save(...)\`).  
            \*   Use \`shadcn/ui\` \`useToast\` to show loading/success/error messages during generation.

4\.  \*\*Audience & Channels Page (\`src/pages/AudienceChannelsPage.tsx\`):\*\*  
    \*   Use \`useContentList\`. Handle loading/error states.  
    \*   Create \`src/components/views/audience/AudiencePieChart.tsx\`:  
        \*   Process \`contentList.data\` client-side to count content items per \`audience\_type\`.  
        \*   Use this aggregated data with a Recharts \`PieChart\`.  
    \*   Create \`src/components/views/audience/ChannelPerformanceChart.tsx\`:  
        \`\`\`typescript  
         // \--- DUMMY DATA PLACEHOLDER \---  
         const dummyChannelMetrics \= \[  
           { channel: 'Social Media', impressions: 50000, clicks: 2500, conversions: 120 },  
           { channel: 'Email Marketing', impressions: 20000, clicks: 1800, conversions: 150 },  
           { channel: 'Paid Search', impressions: 75000, clicks: 3500, conversions: 200 },  
           { channel: 'Organic Search', impressions: 40000, clicks: 2000, conversions: 90 },  
         \];  
         // \--- END DUMMY DATA \---  
         // Use this with a Recharts BarChart to show metrics per channel.  
        \`\`\`

\#\# 7\. Phase 5: Refinement

Once the basic structure and views are in place:

1\.  \*\*Global Filters:\*\* Consider adding a date range picker (\`shadcn/ui\` Date Picker with Range) to the \`Header\` or \`DashboardLayout\`. You'll need state management (React Context or Zustand) to share the selected range and update React Query keys to refetch data based on the selected dates (this is more advanced).  
2\.  \*\*Responsiveness:\*\* Test the layout thoroughly on different screen sizes (mobile, tablet, desktop) and adjust Tailwind classes as needed.  
3\.  \*\*Error & Loading States:\*\* Ensure \`isLoading\` and \`isError\` from all \`useQuery\` hooks are handled gracefully using your \`LoadingSpinner\` and \`ErrorDisplay\` components in every page/component that fetches data.  
4\.  \*\*Notifications:\*\* Use \`toast()\` from \`useToast\` (shadcn) for user feedback (e.g., "PDF generated", "Login failed", "Data saved").

\#\# 8\. Phase 6: Next Steps & Future Work

This initial build provides the foundation. The key next steps involve replacing the dummy data:

1\.  \*\*Define Data Sources:\*\* Work with the team to determine precisely where Campaign details, Channel info, Geographic data, and aggregated Performance Metrics (Impressions, Clicks, etc.) will come from.  
    \*   Will they be added as new columns/tables in Supabase?  
    \*   Will they be stored within the \`content.metadata\` JSONB field?  
    \*   Will they come from a different third-party API?  
2\.  \*\*Implement Dynamic Data Fetching:\*\* Once the sources are defined, update the \`services/\` functions and React Query hooks to fetch this data. Remove the \`DUMMY DATA PLACEHOLDER\` blocks and use the fetched data in the components (\`CampaignTable\`, \`GeoChart\`, \`MultiChannelChart\`, \`ChannelPerformanceChart\`, Overview \`StatCard\`s).  
3\.  \*\*Refine PDF Report:\*\* Update the \`PdfReportButton\` handler to capture the \*actual\* charts and tables once they are driven by real data.  
4\.  \*\*Enhancements:\*\* Consider adding features like dark mode toggle, more advanced filtering, data export options, etc.

\#\# 9\. Troubleshooting Tips

\*   \*\*Environment Variables:\*\* If Supabase connection fails, double-check \`.env.local\` is correctly named, in the root directory, and contains the exact \`VITE\_SUPABASE\_URL\` and \`VITE\_SUPABASE\_ANON\_KEY\`. Restart the Vite dev server (\`yarn dev\`) after changing \`.env.local\`.  
\*   \*\*RLS Issues:\*\* If you're logged in but see no data (or errors), verify your RLS policies in the Supabase dashboard are correct and enabled for SELECT on both \`content\` and \`scores\` tables, using \`(auth.uid() \= client\_id)\`. Check the browser's network tab for specific errors from Supabase.  
\*   \*\*Tailwind/shadcn Styles:\*\* If styles aren't applying, ensure \`tailwind.config.js\` and \`src/index.css\` are configured correctly, and that component class names are correct. Restart Vite if needed.  
\*   \*\*Type Errors:\*\* Carefully check the types defined in \`src/types/supabase.ts\` against the actual data structure returned by Supabase. Use \`console.log\` to inspect fetched data if unsure.

Good luck\! Build step-by-step, test frequently, and don't hesitate to ask questions.

\---  
