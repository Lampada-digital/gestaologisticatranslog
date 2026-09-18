import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores';
import { DashboardLayout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientesPage } from './pages/ClientesPage';
import { PedidosPage } from './pages/PedidosPage';
import { MotoristasPage } from './pages/MotoristasPage';
import { VeiculosPage } from './pages/VeiculosPage';
import { ViagensPage } from './pages/ViagensPage';
import { RelatoriosPage } from './pages/RelatoriosPage';
import { AuditoriaPage } from './pages/AuditoriaPage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';
import { MotoristaApp } from './pages/MotoristaApp';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/motorista" element={<MotoristaApp />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><DashboardLayout><ClientesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/pedidos" element={<ProtectedRoute><DashboardLayout><PedidosPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/pedidos/:id" element={<ProtectedRoute><DashboardLayout><PedidosPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/motoristas" element={<ProtectedRoute><DashboardLayout><MotoristasPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/veiculos" element={<ProtectedRoute><DashboardLayout><VeiculosPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/viagens" element={<ProtectedRoute><DashboardLayout><ViagensPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute><DashboardLayout><RelatoriosPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/auditoria" element={<ProtectedRoute><DashboardLayout><AuditoriaPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><DashboardLayout><ConfiguracoesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
