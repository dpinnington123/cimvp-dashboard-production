import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ContentReportsPage from './pages/ContentReportsPage';
import BrandDashboardPage from './pages/BrandDashboardPage';
import StrategicDashboardPage from './pages/StrategicDashboardPage';
import BrandStrategyPage from './pages/BrandStrategyPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProcessContentPage from './pages/ProcessContentPage';
import ContentProcessingPage from './pages/ContentProcessingPage';
import { Toaster } from "@/components/ui/sonner";
import AuthProvider, { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppRoutes() {
  const { session, loading } = useAuth();

  console.log('AppRoutes rendering. Loading:', loading, 'Session:', session);

  if (!loading && !session) {
    console.log('AppRoutes: No session and not loading, navigating to /login');
  }
  if (session) {
    console.log('AppRoutes: Session found, rendering DashboardLayout');
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          session ? <DashboardLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="content-reports">
          <Route index element={<ContentReportsPage />} />
          <Route path=":contentId" element={<ContentReportsPage />} />
        </Route>
        <Route path="brand-dashboard" element={<BrandDashboardPage />} />
        <Route path="strategic-dashboard" element={<StrategicDashboardPage />} />
        <Route path="process-content" element={<ProcessContentPage />} />
        <Route path="content-processing" element={<ContentProcessingPage />} />
        <Route path="brand-strategy" element={<BrandStrategyPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
