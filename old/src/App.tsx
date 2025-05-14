import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout components
import MainLayout from './components/layout/MainLayout';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User pages
import UploadTrackPage from './pages/track/UploadTrackPage';
import TrackDetailPage from './pages/track/TrackDetailPage';
import ArtistRequestPage from './pages/user/ArtistRequestPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* App routes within MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadTrackPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/track/:id" element={<TrackDetailPage />} />
          <Route 
            path="/artist-request" 
            element={
              <ProtectedRoute>
                <ArtistRequestPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/search" element={<div className="p-10 text-white">Search Page</div>} />
          <Route path="/library" element={<div className="p-10 text-white">Library Page</div>} />
          <Route path="/likes" element={<div className="p-10 text-white">Liked Tracks Page</div>} />
          <Route path="/playlists" element={<div className="p-10 text-white">Playlists Page</div>} />
          <Route path="/artists" element={<div className="p-10 text-white">Artists Page</div>} />
          <Route path="/genres" element={<div className="p-10 text-white">Genres Page</div>} />
          <Route path="/profile" element={<div className="p-10 text-white">Profile Page</div>} />
          <Route path="/settings" element={<div className="p-10 text-white">Settings Page</div>} />
          <Route path="/notifications" element={<div className="p-10 text-white">Notifications Page</div>} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;