import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Landing and Auth Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import TenantsPage from '@/pages/admin/TenantsPage';
import AdminSettings from '@/pages/admin/Settings';

// Tenant Pages
import TenantDashboard from '@/pages/tenant/Dashboard';
import KnowledgeBasePage from '@/pages/tenant/KnowledgeBase';
import ChatHistoryPage from '@/pages/tenant/ChatHistory';
import WidgetCustomizationPage from '@/pages/tenant/WidgetCustomization';
import LiveChatTestPage from '@/pages/tenant/LiveChatTest';
import ClientsPage from '@/pages/tenant/Clients';
import AnalyticsPage from '@/pages/tenant/Analytics';
import TenantSettings from '@/pages/tenant/Settings';

// Shared Components
import PrivateRoute from '@/components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute role="admin">
                <Navigate to="/admin/dashboard\" replace />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/tenants" 
            element={
              <PrivateRoute role="admin">
                <TenantsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <PrivateRoute role="admin">
                <AdminSettings />
              </PrivateRoute>
            } 
          />

          {/* Tenant Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute role="tenant">
                <TenantDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/knowledge-base" 
            element={
              <PrivateRoute role="tenant">
                <KnowledgeBasePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chat-history" 
            element={
              <PrivateRoute role="tenant">
                <ChatHistoryPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/live-chat" 
            element={
              <PrivateRoute role="tenant">
                <LiveChatTestPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/widget" 
            element={
              <PrivateRoute role="tenant">
                <WidgetCustomizationPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <PrivateRoute role="tenant">
                <ClientsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute role="tenant">
                <AnalyticsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute role="tenant">
                <TenantSettings />
              </PrivateRoute>
            } 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;