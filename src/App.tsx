import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ContentEffectivenessPage from './pages/ContentEffectivenessPage';
import CampaignPerformancePage from './pages/CampaignPerformancePage';
import AudienceChannelsPage from './pages/AudienceChannelsPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
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
        <Route path="effectiveness">
          <Route index element={<ContentEffectivenessPage />} />
          <Route path=":contentId" element={<ContentEffectivenessPage />} />
        </Route>
        <Route path="campaigns" element={<CampaignPerformancePage />} />
        <Route path="audience" element={<AudienceChannelsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
