import { useState } from 'react';
import { Building2, Users, Shield, Bell, Database, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockTenant } from '../data/mockData';

export function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('empresa');

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: Building2 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'integracoes', label: 'Integrações', icon: Globe },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500">Gerencie as configurações do sistema</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'empresa' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold">Dados da Empresa</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                  <input defaultValue={mockTenant.nome} className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input defaultValue={mockTenant.cnpj} className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium capitalize">{mockTenant.plano}</span>
                    <button className="text-sm text-blue-600 hover:text-blue-700">Fazer upgrade</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Ativo</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usuarios' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Gestão de Usuários</h2>
              <p className="text-sm text-gray-500">Gerencie papéis e permissões dos usuários do sistema.</p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Nome</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Email</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Papel</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="px-4 py-3 text-sm">Carlos Admin</td><td className="px-4 py-3 text-sm">admin@translog.com.br</td><td className="px-4 py-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">ADMIN</span></td><td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Ativo</span></td></tr>
                    <tr><td className="px-4 py-3 text-sm">Maria Operações</td><td className="px-4 py-3 text-sm">maria@translog.com.br</td><td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">GERENTE_OPERACOES</span></td><td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Ativo</span></td></tr>
                    <tr><td className="px-4 py-3 text-sm">João Financeiro</td><td className="px-4 py-3 text-sm">joao@translog.com.br</td><td className="px-4 py-3"><span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">ADMIN_FINANCEIRO</span></td><td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Ativo</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Segurança</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Autenticação em dois fatores (2FA)</p>
                    <p className="text-xs text-gray-500">Adiciona uma camada extra de segurança</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Rate Limiting</p>
                    <p className="text-xs text-gray-500">Limita requisições por IP/usuário</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Logs de Auditoria</p>
                    <p className="text-xs text-gray-500">Rastreia todas as ações no sistema</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integracoes' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Integrações</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Focus NFe', desc: 'Emissão de CT-e e MDF-e', status: 'Conectado', color: 'green' },
                  { name: 'Stripe', desc: 'Pagamentos e assinaturas', status: 'Conectado', color: 'green' },
                  { name: 'Google Maps', desc: 'Geocoding e rotas', status: 'Conectado', color: 'green' },
                  { name: 'Resend', desc: 'E-mails transacionais', status: 'Configurar', color: 'yellow' },
                  { name: 'Supabase Storage', desc: 'Upload de arquivos', status: 'Conectado', color: 'green' },
                  { name: 'Redis', desc: 'Cache e filas', status: 'Conectado', color: 'green' },
                ].map(integration => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{integration.name}</p>
                      <p className="text-xs text-gray-500">{integration.desc}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium',
                      integration.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>{integration.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Notificações</h2>
              <div className="space-y-3">
                {['Confirmação de entrega para cliente', 'Nova viagem criada', 'Veículo em manutenção', 'Pedido atrasado', 'Cobrança para tenant inadimplente'].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{notif}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Backup & Dados</h2>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">✓ Último backup realizado com sucesso</p>
                <p className="text-xs text-green-600 mt-1">Hoje às 03:00 - 245 MB</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Backup Manual</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Restaurar Backup</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Exportar Dados</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
