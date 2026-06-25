import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import DonorDashboard from './pages/dashboards/DonorDashboard';
import ReceiverDashboard from './pages/dashboards/ReceiverDashboard';
import CreateDonationPage from './pages/CreateDonationPage';
import DonationAnalyticsPage from './pages/DonationAnalyticsPage';

// Lazy placeholders - use existing pages if present, otherwise minimal stubs
import { lazy, Suspense } from 'react';
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard').catch(() => ({ default: () => <div className="p-8 text-center text-gray-500">Admin Dashboard</div> })));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage').catch(() => ({ default: () => <div className="p-8 text-center text-gray-500">Leaderboard</div> })));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage').catch(() => ({ default: () => <div className="p-8 text-center text-gray-500">Recommendations</div> })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').catch(() => ({ default: () => <div className="p-8 text-center text-gray-500">Messages</div> })));
const VerificationPage = lazy(() => import('./pages/VerificationPage').catch(() => ({ default: () => <div className="p-8 text-center text-gray-500">Verification</div> })));
const CreateRequestPage = lazy(() => import('./pages/CreateRequestPage').catch(() => ({ default: () => <div className="p-8 text-center text-gray-500">Create Request</div> })));

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/verification" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />

      <Route path="/donor/dashboard" element={<ProtectedRoute role="Donor"><DonorDashboard /></ProtectedRoute>} />
      <Route path="/donor/create-donation" element={<ProtectedRoute role="Donor"><CreateDonationPage /></ProtectedRoute>} />
      <Route path="/donor/analytics" element={<ProtectedRoute role="Donor"><DonationAnalyticsPage /></ProtectedRoute>} />

      <Route path="/receiver/dashboard" element={<ProtectedRoute role="Receiver"><ReceiverDashboard /></ProtectedRoute>} />
      <Route path="/receiver/create-request" element={<ProtectedRoute role="Receiver"><CreateRequestPage /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <AuthProvider>
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  </AuthProvider>
);

export default App;
