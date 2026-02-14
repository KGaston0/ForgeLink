import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <h2>ForgeLink</h2>
        </div>
        <div className="dashboard-user">
          <span className="user-name">
            {user?.username || 'User'}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.first_name || user?.username}! 👋</h1>
          <p>Your workspace is ready</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">📁</div>
            <h3>Projects</h3>
            <p className="card-value">0</p>
            <p className="card-description">Create your first project</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔗</div>
            <h3>Graphs</h3>
            <p className="card-value">0</p>
            <p className="card-description">Start building connections</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚫</div>
            <h3>Nodes</h3>
            <p className="card-value">0</p>
            <p className="card-description">Add your first node</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="btn btn-primary">
              + New Project
            </button>
            <button className="btn btn-secondary">
              + New Graph
            </button>
            <button className="btn btn-secondary">
              + New Node
            </button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="empty-state">
            <p>No recent activity yet</p>
            <p className="empty-state-hint">Start creating projects to see your activity here</p>
          </div>
        </div>
      </main>
    </div>
  );
}


