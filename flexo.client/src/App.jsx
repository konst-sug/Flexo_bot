import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage1';
import DashboardPage from './pages/Dashboard';
import DocumentsPage from './pages/Documents';
import SettingsPage from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} /> 
        <Route path="documents" element={<DocumentsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
