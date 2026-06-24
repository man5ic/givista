/**
 * App Component
 * 
 * Main application component with routing setup.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DonorDashboard from './pages/dashboards/DonorDashboard';
import ReceiverDashboard from './pages/dashboards/ReceiverDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import CreateDonationPage from './pages/CreateDonationPage';
import CreateRequestPage from './pages/CreateRequestPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MessagesPage from './pages/MessagesPage';
import VerificationPage from './pages/VerificationPage';
import DonationAnalyticsPage from './pages/DonationAnalyticsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PrivacySettingsPage from './pages/PrivacySettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receiver/dashboard"
        element={
          <ProtectedRoute>
            <ReceiverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/create-donation"
        element={
          <ProtectedRoute>
            <CreateDonationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receiver/create-request"
        element={
          <ProtectedRoute>
            <CreateRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <RecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verification"
        element={
          <ProtectedRoute>
            <VerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/analytics"
        element={
          <ProtectedRoute>
            <DonationAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/privacy-settings"
        element={
          <ProtectedRoute>
            <PrivacySettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

