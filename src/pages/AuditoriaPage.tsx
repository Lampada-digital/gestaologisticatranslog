import { useState } from 'react';
import { useAuditStore } from '../stores';
import { Shield, Search, Filter } from 'lucide-react';
import { formatDateTime, statusColors } from '../lib/utils';
import { cn } from '../lib/utils';

export function AuditoriaPage() {
  const { logs } = useAuditStore();
  const [search, setSearch] = useState('');
  const [recursoFilter, setRecursoFilter] = useState('');
  const [acaoFilter, setAcaoFilter] = useState('');

  const filtered = logs.filter(log => {
    const matchSearch = log.usuarioNome.toLowerCase().includes(search.toLowerCase()) || log.recursoId.includes(search);
    const matchRecurso = !recursoFilter || log.recurso === recursoFilter;
    const matchAcao = !acaoFilter || log.acao === acaoFilter;
    return matchSearch && matchRecurso && matchAcao;
  });

  const acaoColors: Record<string, string> = {
    'CREATE': 'bg-green-100 text-green-700',
    'UPDATE': 'bg-blue-100 text-blue-700',
    'DELETE': 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h1>
        <p className="text-gray-500">Rastreamento completo de todas as ações no sistema</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por usuário ou ID do recurso..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={recursoFilter} onChange={(e) => setRecursoFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
              <option value="">Todos os recursos</option>
              <option value="pedido">Pedidos</option>
              <option value="viagem">Viagens</option>
              <option value="cliente">Clientes</option>
              <option value="motorista">Motoristas</option>
              <option value="veiculo">Veículos</option>
            </select>
            <select value={acaoFilter} onChange={(e) => setAcaoFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
              <option value="">Todas as ações</option>
              <option value="CREATE">Criação</option>
              <option value="UPDATE">Atualização</option>
              <option value="DELETE">Exclusão</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ação</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Recurso</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDateTime(log.criadoEm)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{log.usuarioNome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', acaoColors[log.acao])}>
                      {log.acao}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{log.recurso}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.recursoId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ipAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500">Nenhum log encontrado</p></div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{logs.filter(l => l.acao === 'CREATE').length}</p>
          <p className="text-xs text-gray-500">Criações</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{logs.filter(l => l.acao === 'UPDATE').length}</p>
          <p className="text-xs text-gray-500">Atualizações</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{logs.filter(l => l.acao === 'DELETE').length}</p>
          <p className="text-xs text-gray-500">Exclusões</p>
        </div>
      </div>
    </div>
  );
}
