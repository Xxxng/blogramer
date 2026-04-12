import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  BookOpen, 
  Send, 
  Settings as SettingsIcon 
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: '대시보드', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: '계정 관리', path: '/accounts', icon: <UserCircle size={20} /> },
    { name: '포스팅 관리', path: '/posts', icon: <Send size={20} /> },
    { name: '환경 설정', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-400">Blogramer</h1>
          <p className="text-xs text-slate-400">Mass Blog Producer</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
          v0.1.0 Beta
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-8 shrink-0">
          <h2 className="text-lg font-semibold">
            {navItems.find(i => i.path === location.pathname)?.name || 'Blogramer'}
          </h2>
        </header>
        
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
