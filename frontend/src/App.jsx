import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import Dashboard from './pages/home/Dashboard.jsx';
import ProjectsPage from './pages/projects/ProjectsPage.jsx';
import ProjectDetailLayout from './pages/projects/ProjectDetailLayout.jsx';
import OverviewTab from './pages/projects/tabs/OverviewTab.jsx';
import SettingsTab from './pages/projects/tabs/SettingsTab.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import GraphCanvasPage from './pages/graphs/GraphCanvasPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailLayout />}>
              <Route index element={<OverviewTab />} />
              <Route path="settings" element={<SettingsTab />} />
            </Route>
            <Route path="/graphs/:id" element={<GraphCanvasPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
