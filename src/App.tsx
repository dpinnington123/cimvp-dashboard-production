import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import AuthProvider, { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import { BrandProvider } from './contexts/BrandContext';

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
const ProcessContentPage = React.lazy(() => import('./pages/ProcessContentPage.tsx'));
const ContentProcessingPage = React.lazy(() => import('./pages/ContentProcessingPage.tsx'));
const CampaignPlannerPage = React.lazy(() => import('./pages/CampaignPlannerPage.tsx'));

const queryClient = new QueryClient();

function App() {
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

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
            <DashboardLayout />
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
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProcessContentPage />} />
      </Route>

      <Route
        path="/campaign-planner"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CampaignPlannerPage />} />
      </Route>

      <Route
        path="/brand-dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
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
            <DashboardLayout />
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
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StrategicDashboardPage />} />
      </Route>

      <Route
        path="/brand-strategy"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BrandStrategyPage />} />
      </Route>

      <Route
        path="/content-reports"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ContentReportsPage />} />
        <Route path=":contentId" element={<ContentReportsPage />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}

export default App;
