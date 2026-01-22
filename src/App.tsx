import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';

// Landing and Auth Pages
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import GoogleCallbackPage from '@/pages/auth/GoogleCallback';

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

// Static Pages
import Features from '@/pages/Features';
import Documentation from '@/pages/Documentation';
import API from '@/pages/API';
import Blog from '@/pages/Blog';
import Careers from '@/pages/Careers';
import Contact from '@/pages/Contact';
import HelpCenter from '@/pages/HelpCenter';
import ContactSupport from '@/pages/ContactSupport';
import Status from '@/pages/Status';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

// Shared Components
import PrivateRoute from '@/components/PrivateRoute';
import { ToastProvider } from '@/components/ToastContainer';

// RAG Pages
import RAGKnowledgeBasePage from '@/pages/tenant/RAGKnowledgeBase';
import RetrievalTestPage from '@/pages/tenant/RetrievalTest';
import BillingUsagePage from '@/pages/tenant/BillingUsage';

function App() {
  useEffect(() => {
    console.log('🚀 App component mounted');
    console.log('📍 Current URL:', window.location.href);
    console.log('🌍 Environment:', import.meta.env.MODE);
    
    // Log any unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Unhandled Error:', event.error);
    };
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      // Filter out MetaMask connection errors (common browser extension issue)
      if (event.reason && event.reason.toString().includes('MetaMask')) {
        console.warn('⚠️ MetaMask extension detected but not used by this app');
        event.preventDefault(); // Prevent the error from showing in console
        return;
      }
      console.error('🚨 Unhandled Promise Rejection:', event.reason);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/api" element={<API />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/status" element={<Status />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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
            path="/rag/knowledge-base" 
            element={
              <PrivateRoute role="tenant">
                <RAGKnowledgeBasePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/rag/retrieval" 
            element={
              <PrivateRoute role="tenant">
                <RetrievalTestPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/rag/chat" 
            element={
              <PrivateRoute role="tenant">
                <LiveChatTestPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/rag/billing" 
            element={
              <PrivateRoute role="tenant">
                <BillingUsagePage />
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
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;