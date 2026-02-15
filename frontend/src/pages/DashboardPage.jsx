import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">ForgeLink</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[rgb(var(--color-text-secondary))]">
            Welcome, {user?.user?.username || 'User'}!
          </span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[rgb(var(--color-text))] mb-4">Dashboard</h1>
        <p className="text-[rgb(var(--color-text-secondary))] mb-8">Your knowledge network starts here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">Projects</h3>
            <p className="text-[rgb(var(--color-text-secondary))] text-sm">Manage your knowledge projects</p>
            <p className="text-3xl font-bold text-cyan-500 mt-4">0</p>
          </div>

          <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">Graphs</h3>
            <p className="text-[rgb(var(--color-text-secondary))] text-sm">Visual representations of data</p>
            <p className="text-3xl font-bold text-purple-500 mt-4">0</p>
          </div>

          <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">Nodes</h3>
            <p className="text-[rgb(var(--color-text-secondary))] text-sm">Individual knowledge points</p>
            <p className="text-3xl font-bold text-cyan-500 mt-4">0</p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl">
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-4">🚀 Getting Started</h2>
          <p className="text-[rgb(var(--color-text-secondary))] mb-6">
            Welcome to ForgeLink! Start by creating your first project to organize your knowledge network.
          </p>
          <button className="btn-primary">
            Create Your First Project
          </button>
        </div>
      </main>
    </div>
  );
}


