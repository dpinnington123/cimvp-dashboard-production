import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ContentReportsPage from './pages/ContentReportsPage';
import BrandDashboardPage from './pages/BrandDashboardPage';
import StrategicDashboardPage from './pages/StrategicDashboardPage';
import BrandStrategyPage from './pages/BrandStrategyPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckEmailPage from './pages/CheckEmailPage';
import NotFound from './pages/NotFound';
import ProcessContentPage from './pages/ProcessContentPage';
import ContentProcessingPage from './pages/ContentProcessingPage';
import CampaignPlannerPage from './pages/CampaignPlannerPage';
import HomePage from './pages/HomePage';
import { Toaster } from "@/components/ui/sonner";
import AuthProvider, { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import { BrandProvider } from './contexts/BrandContext';

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
  );
}

export default App;
