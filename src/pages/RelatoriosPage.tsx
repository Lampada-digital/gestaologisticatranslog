import { useState } from 'react';
import { useOrderStore, useTripStore, useClientStore, useFleetStore } from '../stores';
import { BarChart3, Download, FileText, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency, formatDate, statusLabels, statusColors } from '../lib/utils';
import { cn } from '../lib/utils';

export function RelatoriosPage() {
  const { pedidos } = useOrderStore();
  const { viagens } = useTripStore();
  const { clientes } = useClientStore();
  const { motoristas } = useFleetStore();
  const [activeTab, setActiveTab] = useState<'entregas' | 'viagens' | 'financeiro'>('entregas');

  const entregasData = pedidos.map(p => ({
    ...p,
    clienteNome: clientes.find(c => c.id === p.clienteId)?.nomeFantasia || clientes.find(c => c.id === p.clienteId)?.razaoSocial || '',
    motoristaNome: viagens.find(v => v.pedidoIds.includes(p.id)) ? motoristas.find(m => m.id === viagens.find(v => v.pedidoIds.includes(p.id))?.motoristaId)?.nome || '-' : '-',
  }));

  const faturamentoMensal = [
    { mes: 'Jan', valor: 125000 },
    { mes: 'Fev', valor: 142000 },
    { mes: 'Mar', valor: 158000 },
    { mes: 'Abr', valor: 175000 },
    { mes: 'Mai', valor: 198000 },
    { mes: 'Jun', valor: 210000 },
  ];

  const performanceMotoristas = motoristas.filter(m => m.ativo).map(m => {
    const mViagens = viagens.filter(v => v.motoristaId === m.id);
    const totalEntregas = mViagens.reduce((acc, v) => acc + v.pedidoIds.length, 0);
    return { nome: m.nome.split(' ')[0], entregas: totalEntregas, viagens: mViagens.length };
  });

  const exportCSV = () => {
    const headers = 'Pedido,Cliente,Valor,Status,Data Entrega\n';
    const rows = entregasData.map(p => `${p.numero},${p.clienteNome},${p.valorTotal},${statusLabels[p.status]},${p.dataEntrega ? formatDate(p.dataEntrega) : '-'}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_entregas.csv';
    a.click();
  };

  const tabs = [
    { id: 'entregas' as const, label: 'Entregas', icon: FileText },
    { id: 'viagens' as const, label: 'Viagens', icon: BarChart3 },
    { id: 'financeiro' as const, label: 'Financeiro', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500">Análise de desempenho e métricas operacionais</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Entregas Report */}
      {activeTab === 'entregas' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Relatório de Entregas</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{pedidos.length} registros</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Pedido</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Motorista</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Data Entrega</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {entregasData.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{p.numero}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.clienteNome}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.motoristaNome}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.valorTotal)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[p.status])}>
                          {statusLabels[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.dataEntrega ? formatDate(p.dataEntrega) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Viagens Report */}
      {activeTab === 'viagens' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance dos Motoristas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceMotoristas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="entregas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Entregas" />
                <Bar dataKey="viagens" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Viagens" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Viagens Realizadas</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Viagem</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Motorista</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Custo</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {viagens.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{v.numero}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{motoristas.find(m => m.id === v.motoristaId)?.nome}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{v.pedidoIds.length}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(v.dataInicio)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[v.status])}>
                          {statusLabels[v.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{v.custoTotal ? formatCurrency(v.custoTotal) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Financeiro Report */}
      {activeTab === 'financeiro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm text-gray-500">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pedidos.reduce((acc, p) => acc + p.valorTotal, 0))}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm text-gray-500">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pedidos.reduce((acc, p) => acc + p.valorTotal, 0) / pedidos.length)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm text-gray-500">Custo Viagens</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(viagens.reduce((acc, v) => acc + (v.custoTotal || 0), 0))}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Faturamento Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={faturamentoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="valor" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
