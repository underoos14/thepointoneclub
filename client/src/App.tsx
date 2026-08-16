import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { PublicLayout } from './layout/PublicLayout';
import { EventsPage } from './features/events/EventsPage';
import { LoginPage } from './features/auth/LoginPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { ProfilePage } from './features/profile/ProfilePage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { EventFormPage } from './features/admin/EventFormPage';

function ScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToHash />
        <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/new"
                element={
                  <ProtectedRoute role="admin">
                    <EventFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/edit"
                element={
                  <ProtectedRoute role="admin">
                    <EventFormPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}
