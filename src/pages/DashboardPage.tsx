import { useOrderStore, useTripStore } from '../stores';
import { Package, Truck, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { pedidos } = useOrderStore();
  const { viagens } = useTripStore();

  const pedidosHoje = pedidos.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.criadoEm).toDateString() === today;
  }).length;

  const entregasHoje = pedidos.filter(p => p.status === 'entregue').length;
  const entregasAtrasadas = pedidos.filter(p => {
    if (p.dataEntrega && p.status !== 'entregue') {
      return new Date(p.dataEntrega) < new Date();
    }
    return false;
  }).length;
  const viagensEmAndamento = viagens.filter(v => v.status === 'em_andamento').length;
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente').length;
  const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);

  const statusData = [
    { name: 'Pendente', value: pedidos.filter(p => p.status === 'pendente').length, color: '#eab308' },
    { name: 'Separando', value: pedidos.filter(p => p.status === 'separando').length, color: '#3b82f6' },
    { name: 'Expedido', value: pedidos.filter(p => p.status === 'expedido').length, color: '#8b5cf6' },
    { name: 'Em Trânsito', value: pedidos.filter(p => p.status === 'em_transito').length, color: '#f97316' },
    { name: 'Entregue', value: pedidos.filter(p => p.status === 'entregue').length, color: '#22c55e' },
  ];

  const entregasPorDia = [
    { dia: 'Seg', entregas: 12, pedidos: 18 },
    { dia: 'Ter', entregas: 15, pedidos: 20 },
    { dia: 'Qua', entregas: 8, pedidos: 14 },
    { dia: 'Qui', entregas: 18, pedidos: 22 },
    { dia: 'Sex', entregas: 22, pedidos: 28 },
    { dia: 'Sáb', entregas: 10, pedidos: 12 },
    { dia: 'Dom', entregas: 3, pedidos: 5 },
  ];

  const faturamentoSemanal = [
    { dia: 'Seg', valor: 12500 },
    { dia: 'Ter', valor: 18200 },
    { dia: 'Qua', valor: 15800 },
    { dia: 'Qui', valor: 22100 },
    { dia: 'Sex', valor: 28400 },
    { dia: 'Sáb', valor: 9600 },
    { dia: 'Dom', valor: 4200 },
  ];

  const kpis = [
    { label: 'Pedidos Hoje', value: pedidosHoje || 6, icon: Package, color: 'bg-blue-500', change: '+12%' },
    { label: 'Entregas Realizadas', value: entregasHoje, icon: CheckCircle, color: 'bg-green-500', change: '+8%' },
    { label: 'Entregas Atrasadas', value: entregasAtrasadas, icon: AlertTriangle, color: 'bg-red-500', change: '-3%' },
    { label: 'Viagens Ativas', value: viagensEmAndamento, icon: Truck, color: 'bg-orange-500', change: '+5%' },
    { label: 'Pendentes', value: pedidosPendentes, icon: Clock, color: 'bg-yellow-500', change: '-2%' },
    { label: 'Faturamento Total', value: formatCurrency(faturamentoTotal), icon: TrendingUp, color: 'bg-purple-500', change: '+15%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral das operações logísticas</p>
        </div>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`${kpi.color} p-2 rounded-lg`}>
                <kpi.icon className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xs font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entregas por dia */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Entregas vs Pedidos (Últimos 7 dias)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={entregasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="pedidos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pedidos" />
              <Bar dataKey="entregas" fill="#22c55e" radius={[4, 4, 0, 0]} name="Entregas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status de pedidos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status dos Pedidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Faturamento */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Faturamento Semanal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={faturamentoSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="valor" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Entregas pendentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Entregas Pendentes</h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {pedidos.filter(p => p.status !== 'entregue').slice(0, 5).map((pedido) => (
              <Link
                key={pedido.id}
                to={`/pedidos/${pedido.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{pedido.numero}</p>
                  <p className="text-xs text-gray-500">
                    {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.estado}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    pedido.status === 'em_transito' ? 'bg-orange-100 text-orange-700' :
                    pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                    pedido.status === 'separando' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {pedido.status === 'em_transito' ? 'Em Trânsito' : pedido.status === 'pendente' ? 'Pendente' : pedido.status === 'separando' ? 'Separando' : 'Expedido'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(pedido.valorTotal)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
