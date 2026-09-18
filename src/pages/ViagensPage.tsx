import { useState } from 'react';
import { useTripStore, useFleetStore, useOrderStore, useClientStore } from '../stores';
import { Viagem, StatusViagem } from '../types';
import { Plus, Search, Eye, X, ArrowRight, MapPin, Clock } from 'lucide-react';
import { cn, formatCurrency, formatDate, formatDateTime, statusLabels, statusColors } from '../lib/utils';

export function ViagensPage() {
  const { viagens, addViagem, updateViagemStatus } = useTripStore();
  const { motoristas, veiculos } = useFleetStore();
  const { pedidos } = useOrderStore();
  const { clientes } = useClientStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Viagem | null>(null);

  const filtered = viagens.filter(v => {
    const motorista = motoristas.find(m => m.id === v.motoristaId);
    const matchSearch = v.numero.toLowerCase().includes(search.toLowerCase()) || motorista?.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getNextStatus = (current: StatusViagem): StatusViagem | null => {
    const transitions: Record<StatusViagem, StatusViagem | null> = {
      'planejada': 'em_andamento',
      'em_andamento': 'concluida',
      'concluida': null,
      'cancelada': null,
    };
    return transitions[current];
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pedidoIds = Array.from(e.currentTarget.querySelectorAll('input[name="pedidoIds"]:checked')).map((el: any) => el.value);
    const veiculo = veiculos.find(v => v.id === form.get('veiculoId'));
    
    // Validate capacity
    const totalPeso = pedidos.filter(p => pedidoIds.includes(p.id)).reduce((acc, p) => acc + p.pesoTotal, 0);
    if (veiculo && totalPeso > veiculo.capacidadeKg) {
      alert(`Peso total (${totalPeso}kg) excede capacidade do veículo (${veiculo.capacidadeKg}kg)`);
      return;
    }

    addViagem({
      numero: `VIA-2024-${String(viagens.length + 1).padStart(4, '0')}`,
      status: 'planejada',
      motoristaId: form.get('motoristaId') as string,
      veiculoId: form.get('veiculoId') as string,
      dataInicio: form.get('dataInicio') as string,
      pedidoIds,
    });
    setShowModal(false);
  };

  const handleStatusChange = (viagemId: string) => {
    const viagem = viagens.find(v => v.id === viagemId);
    if (!viagem) return;
    const nextStatus = getNextStatus(viagem.status);
    if (nextStatus) {
      // Validate: can't conclude if not all orders are delivered
      if (nextStatus === 'concluida') {
        const nonDelivered = pedidos.filter(p => viagem.pedidoIds.includes(p.id) && p.status !== 'entregue');
        if (nonDelivered.length > 0) {
          alert(`Não é possível finalizar: ${nonDelivered.length} pedido(s) ainda não foram entregues.`);
          return;
        }
      }
      updateViagemStatus(viagemId, nextStatus);
      if (showDetail?.id === viagemId) {
        setShowDetail({ ...viagem, status: nextStatus });
      }
    }
  };

  const availableMotoristas = motoristas.filter(m => m.ativo);
  const availableVeiculos = veiculos.filter(v => v.status === 'disponivel');
  const availablePedidos = pedidos.filter(p => !p.viagemId && ['pendente', 'separando', 'expedido'].includes(p.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viagens</h1>
          <p className="text-gray-500">{viagens.length} viagens registradas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Nova Viagem
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{viagens.filter(v => v.status === 'planejada').length}</p>
          <p className="text-xs text-gray-500">Planejadas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-orange-600">{viagens.filter(v => v.status === 'em_andamento').length}</p>
          <p className="text-xs text-gray-500">Em Andamento</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{viagens.filter(v => v.status === 'concluida').length}</p>
          <p className="text-xs text-gray-500">Concluídas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{viagens.filter(v => v.status === 'cancelada').length}</p>
          <p className="text-xs text-gray-500">Canceladas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por número ou motorista..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Todos os status</option>
            <option value="planejada">Planejada</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Viagem</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Motorista</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Veículo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data Início</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((viagem) => {
                const motorista = motoristas.find(m => m.id === viagem.motoristaId);
                const veiculo = veiculos.find(v => v.id === viagem.veiculoId);
                return (
                  <tr key={viagem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{viagem.numero}</p>
                      {viagem.custoTotal && <p className="text-xs text-gray-500">{formatCurrency(viagem.custoTotal)}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{motorista?.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="font-mono">{veiculo?.placa}</span>
                      <br /><span className="text-xs text-gray-400">{veiculo?.modelo}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{viagem.pedidoIds.length} pedidos</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(viagem.dataInicio)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[viagem.status])}>
                        {statusLabels[viagem.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowDetail(viagem)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {getNextStatus(viagem.status) && (
                          <button onClick={() => handleStatusChange(viagem.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Nova Viagem</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motorista *</label>
                  <select name="motoristaId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Selecione...</option>
                    {availableMotoristas.map(m => <option key={m.id} value={m.id}>{m.nome} (CNH {m.categoriaCnh})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Veículo *</label>
                  <select name="veiculoId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Selecione...</option>
                    {availableVeiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.modelo} ({v.capacidadeKg}kg)</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
                <input name="dataInicio" type="datetime-local" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pedidos *</label>
                {availablePedidos.length === 0 ? (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">Nenhum pedido disponível para vincular.</p>
                ) : (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {availablePedidos.map(p => {
                      const cliente = clientes.find(c => c.id === p.clienteId);
                      return (
                        <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer">
                          <input type="checkbox" name="pedidoIds" value={p.id} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{p.numero}</p>
                            <p className="text-xs text-gray-500">{cliente?.nomeFantasia || cliente?.razaoSocial} • {p.pesoTotal}kg • {formatCurrency(p.valorTotal)}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Criar Viagem</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold">{showDetail.numero}</h2>
                <p className="text-sm text-gray-500">{statusLabels[showDetail.status]}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Motorista</p>
                  <p className="text-sm font-bold">{motoristas.find(m => m.id === showDetail.motoristaId)?.nome}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Veículo</p>
                  <p className="text-sm font-bold">{veiculos.find(v => v.id === showDetail.veiculoId)?.placa} - {veiculos.find(v => v.id === showDetail.veiculoId)?.modelo}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Início</p>
                  <p className="text-sm font-bold">{formatDateTime(showDetail.dataInicio)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Pedidos</p>
                  <p className="text-sm font-bold">{showDetail.pedidoIds.length} entregas</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Progresso da Viagem</h3>
                <div className="flex items-center gap-2">
                  {(['planejada', 'em_andamento', 'concluida'] as StatusViagem[]).map((status, idx) => {
                    const statuses: StatusViagem[] = ['planejada', 'em_andamento', 'concluida'];
                    const currentIdx = showDetail.status === 'cancelada' ? -1 : statuses.indexOf(showDetail.status);
                    const isActive = idx <= currentIdx;
                    return (
                      <div key={status} className="flex items-center">
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold', isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500')}>
                          {idx + 1}
                        </div>
                        {idx < 2 && <div className={cn('w-12 h-0.5', isActive && idx < currentIdx ? 'bg-blue-600' : 'bg-gray-200')} />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 w-16 text-center">Planejada</span>
                  <span className="text-xs text-gray-500 w-20 text-center">Em Andamento</span>
                  <span className="text-xs text-gray-500 w-16 text-center">Concluída</span>
                </div>
              </div>

              {/* Pedidos */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Pedidos da Viagem</h3>
                <div className="space-y-2">
                  {showDetail.pedidoIds.map(pid => {
                    const pedido = pedidos.find(p => p.id === pid);
                    if (!pedido) return null;
                    const cliente = clientes.find(c => c.id === pedido.clienteId);
                    return (
                      <div key={pid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{pedido.numero}</p>
                          <p className="text-xs text-gray-500">{cliente?.nomeFantasia || cliente?.razaoSocial}</p>
                        </div>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[pedido.status])}>
                          {statusLabels[pedido.status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {getNextStatus(showDetail.status) && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleStatusChange(showDetail.id)}
                    className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-white',
                      getNextStatus(showDetail.status) === 'concluida' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                    )}
                  >
                    <ArrowRight className="w-4 h-4" />
                    {getNextStatus(showDetail.status) === 'em_andamento' ? 'Iniciar Viagem' : 'Finalizar Viagem'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
