import React, { Suspense, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import AuthProvider, { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import { BrandProvider } from './contexts/BrandContext';
import { EnvironmentCheck } from './components/common/EnvironmentCheck';
import { supabase } from './lib/supabaseClient';

// Keep DashboardLayout as a regular import since it's used everywhere
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy load all page components for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage.tsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.tsx'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage.tsx'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage.tsx'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage.tsx'));
const CheckEmailPage = React.lazy(() => import('./pages/CheckEmailPage.tsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.tsx'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage.tsx'));

// Dashboard pages - these benefit most from code splitting
const BrandDashboardPage = React.lazy(() => import('./pages/BrandDashboardPage.tsx'));
const ContentReportsPage = React.lazy(() => import('./pages/ContentReportsPage.tsx'));
const StrategicDashboardPage = React.lazy(() => import('./pages/StrategicDashboardPage.tsx'));
const BrandStrategyPage = React.lazy(() => import('./pages/BrandStrategyPage.tsx'));
const BrandStrategyBuilderPage = React.lazy(() => import('./pages/BrandStrategyBuilderPage.tsx'));
const ProcessContentPage = React.lazy(() => import('./pages/ProcessContentPage.tsx'));
const ContentProcessingPage = React.lazy(() => import('./pages/ContentProcessingPage.tsx'));
const CampaignPlannerPage = React.lazy(() => import('./pages/CampaignPlannerPage.tsx'));

// Tools pages
const AIMarketResearchPage = React.lazy(() => import('./pages/tools/AIMarketResearch.tsx'));
const AIMessageTestingPage = React.lazy(() => import('./pages/tools/AIMessageTesting.tsx'));

// Brand Strategy Builder sub-pages
const MarketOverview = React.lazy(() => import('./pages/brand-strategy-builder/MarketOverview.tsx'));
const BrandProfile = React.lazy(() => import('./pages/brand-strategy-builder/BrandProfile.tsx'));
const Audiences = React.lazy(() => import('./pages/brand-strategy-builder/Audiences.tsx'));
const StrategyMessages = React.lazy(() => import('./pages/brand-strategy-builder/StrategyMessages.tsx'));
const MarketResearch = React.lazy(() => import('./pages/brand-strategy-builder/MarketResearch.tsx'));
const StrategyDocument = React.lazy(() => import('./pages/brand-strategy-builder/StrategyDocument.tsx'));

function App() {
  // Create QueryClient inside component to manage it properly
  const queryClient = useMemo(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
        },
      },
    }),
    []
  );

  // Listen for auth state changes and clear cache on logout
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Security] Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          // CRITICAL: Clear all cached data when user signs out
          console.log('[Security] User signed out - clearing React Query cache');
          queryClient.clear();
        }
        
        if (event === 'SIGNED_IN' && session) {
          // Invalidate queries to ensure fresh data for new user
          console.log('[Security] User signed in - invalidating queries');
          queryClient.invalidateQueries();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <BrandProvider>
            <AppRoutes />
            <Toaster />
          </BrandProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Helper component for protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, emailVerified } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Note: We no longer use this condition for the check-email page since it's directly rendered in SignUpPage
  if (!emailVerified) {
    return <Navigate to="/check-email" replace />;
  }

  return <>{children}</>;
}

// Wrapper component that forces remount when user changes
function AuthenticatedLayout() {
  const { user } = useAuth();
  
  // Key prop forces full remount when user ID changes
  // This ensures all component state is reset on user switch
  return (
    <div key={user?.id || 'logged-out'}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EnvironmentCheck />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* User Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BrandDashboardPage />} />
        <Route path="content-reports">
          <Route index element={<ContentReportsPage />} />
          <Route path=":contentId" element={<ContentReportsPage />} />
        </Route>
        <Route path="brand-dashboard" element={<BrandDashboardPage />} />
        <Route path="strategic-dashboard" element={<StrategicDashboardPage />} />
        <Route path="process-content" element={<ProcessContentPage />} />
        <Route path="content-processing" element={<ContentProcessingPage />} />
        <Route path="brand-strategy" element={<BrandStrategyPage />} />
        <Route path="campaign-planner" element={<CampaignPlannerPage />} />
      </Route>

      {/* Application Pages with Direct Routes */}
      <Route
        path="/process-content"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProcessContentPage />} />
      </Route>

      <Route
        path="/campaign-planner"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CampaignPlannerPage />} />
      </Route>

      <Route
        path="/brand-dashboard"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BrandDashboardPage />} />
      </Route>

      {/* Add direct route for ContentProcessingPage */}
      <Route
        path="/content-processing"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ContentProcessingPage />} />
      </Route>

      {/* Additional Direct Routes for Sidebar Navigation */}
      <Route
        path="/strategic-dashboard"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StrategicDashboardPage />} />
      </Route>

      <Route
        path="/brand-strategy"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BrandStrategyPage />} />
      </Route>

      <Route
        path="/brand-strategy-builder"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BrandStrategyBuilderPage />} />
        <Route path="market-overview" element={<MarketOverview />} />
        <Route path="brand-profile" element={<BrandProfile />} />
        <Route path="audiences" element={<Audiences />} />
        <Route path="strategy-messages" element={<StrategyMessages />} />
        <Route path="market-research" element={<MarketResearch />} />
        <Route path="strategy-document" element={<StrategyDocument />} />
      </Route>

      <Route
        path="/content-reports"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ContentReportsPage />} />
        <Route path=":contentId" element={<ContentReportsPage />} />
      </Route>

      {/* Tools Routes */}
      <Route
        path="/tools/ai-market-research"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AIMarketResearchPage />} />
      </Route>

      <Route
        path="/tools/ai-message-testing"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AIMessageTestingPage />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}

export default App;
