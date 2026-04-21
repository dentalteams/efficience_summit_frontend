import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProgramPage from './pages/ProgramPage';
import SpeakersPage from './pages/SpeakersPage';
import AdminDashboard from './pages/AdminDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  return (isAuthenticated && user?.role === 'admin') 
    ? children 
    : <Navigate to="/login" />;
};
function App() {
  return (
    <div className="min-h-screen bg-black">
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/programme" element={<ProgramPage />} />
        <Route path="/speakers" element={<SpeakersPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />
      </Routes>

    </div>

  );
}

export default App;
