import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import {
  LayoutDashboard, Users, Package, Truck, Route, FileText,
  BarChart3, Settings, LogOut, Menu, X, Building2, Shield
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/pedidos', icon: Package, label: 'Pedidos' },
  { to: '/motoristas', icon: Truck, label: 'Motoristas' },
  { to: '/veiculos', icon: Truck, label: 'Veículos' },
  { to: '/viagens', icon: Route, label: 'Viagens' },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { to: '/auditoria', icon: Shield, label: 'Auditoria' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuthStore();

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">TransLog</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-slate-700">
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors',
              isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              collapsed && 'justify-center mx-1 px-2'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={cn('p-4 border-t border-slate-700', collapsed && 'px-2')}>
        {!collapsed && currentUser && (
          <div className="mb-2">
            <p className="text-sm font-medium truncate">{currentUser.nome}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.papel}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export function Header() {
  const { logout, currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">TransLog Express</h1>
          <p className="text-xs text-gray-500">Gestão Logística Integrada</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {currentUser?.nome.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">{currentUser?.nome}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
