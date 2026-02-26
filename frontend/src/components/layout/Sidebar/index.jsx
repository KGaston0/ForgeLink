import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  HomeIcon, 
  Square3Stack3DIcon, 
  ShareIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Proyectos', href: '/projects', icon: Square3Stack3DIcon },
  { name: 'Tipos de Nodos', href: '/node-types', icon: ShareIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-[rgb(var(--color-bg-secondary))] border-r border-[rgb(var(--color-border))]">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[rgb(var(--color-border))]">
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
          ForgeLink
        </span>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                        ${isActive 
                          ? 'bg-cyan-500/10 text-cyan-500' 
                          : 'text-[rgb(var(--color-text-secondary))] hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${isActive ? 'text-cyan-500' : 'text-[rgb(var(--color-text-secondary))] group-hover:text-white'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
             <div className="flex items-center gap-x-4 p-2 text-sm font-semibold leading-6 text-[rgb(var(--color-text))] border-t border-[rgb(var(--color-border))] pt-6">
              <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                {user?.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">{user?.user?.username || 'Usuario'}</p>
                <p className="truncate text-xs text-[rgb(var(--color-text-secondary))] font-normal">{user?.user?.email || 'user@example.com'}</p>
              </div>
              <button
                onClick={logout}
                className="text-[rgb(var(--color-text-secondary))] hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
