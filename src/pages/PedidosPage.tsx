import { useState } from 'react';
import { useOrderStore, useClientStore } from '../stores';
import { Pedido, StatusPedido } from '../types';
import { Plus, Search, Eye, Trash2, X, ArrowRight, Filter } from 'lucide-react';
import { cn, formatCurrency, formatDate, statusLabels, statusColors } from '../lib/utils';
import { Link } from 'react-router-dom';

export function PedidosPage() {
  const { pedidos, addPedido, updatePedidoStatus, deletePedido } = useOrderStore();
  const { clientes } = useClientStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Pedido | null>(null);

  const filtered = pedidos.filter(p => {
    const matchSearch = p.numero.toLowerCase().includes(search.toLowerCase()) ||
      clientes.find(c => c.id === p.clienteId)?.razaoSocial.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const clienteId = form.get('clienteId') as string;
    const cliente = clientes.find(c => c.id === clienteId);
    
    addPedido({
      clienteId,
      numero: `PED-2024-${String(pedidos.length + 1).padStart(4, '0')}`,
      status: 'pendente',
      valorTotal: parseFloat(form.get('valorTotal') as string) || 0,
      pesoTotal: parseFloat(form.get('pesoTotal') as string) || 0,
      volumeTotal: parseInt(form.get('volumeTotal') as string) || 1,
      enderecoEntrega: {
        logradouro: form.get('logradouro') as string,
        numero: form.get('numero') as string,
        bairro: form.get('bairro') as string,
        cidade: form.get('cidade') as string,
        estado: form.get('estado') as string,
        cep: form.get('cep') as string,
      },
      dataEntrega: form.get('dataEntrega') as string || undefined,
      volumes: [{
        id: `vol-${Date.now()}`,
        pedidoId: '',
        codigo: 'VOL-001',
        peso: parseFloat(form.get('pesoTotal') as string) || 0,
        dimensoes: { comprimento: 60, largura: 40, altura: 30 },
        quantidade: parseInt(form.get('volumeTotal') as string) || 1,
        status: 'pendente'
      }]
    });
    setShowModal(false);
  };

  const getNextStatus = (current: StatusPedido): StatusPedido | null => {
    const transitions: Record<StatusPedido, StatusPedido | null> = {
      'pendente': 'separando',
      'separando': 'expedido',
      'expedido': 'em_transito',
      'em_transito': 'entregue',
      'entregue': null,
    };
    return transitions[current];
  };

  const handleStatusChange = (pedidoId: string) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;
    const nextStatus = getNextStatus(pedido.status);
    if (nextStatus) {
      updatePedidoStatus(pedidoId, nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500">{pedidos.length} pedidos cadastrados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Novo Pedido
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por número ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="separando">Separando</option>
              <option value="expedido">Expedido</option>
              <option value="em_transito">Em Trânsito</option>
              <option value="entregue">Entregue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Pedido</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Volumes</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data Entrega</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((pedido) => {
                const cliente = clientes.find(c => c.id === pedido.clienteId);
                return (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{pedido.numero}</p>
                      <p className="text-xs text-gray-500">{formatDate(pedido.criadoEm)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente?.nomeFantasia || cliente?.razaoSocial}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(pedido.valorTotal)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pedido.volumeTotal} vol / {pedido.pesoTotal}kg</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[pedido.status])}>
                        {statusLabels[pedido.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pedido.dataEntrega ? formatDate(pedido.dataEntrega) : '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowDetail(pedido)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detalhes">
                          <Eye className="w-4 h-4" />
                        </button>
                        {getNextStatus(pedido.status) && (
                          <button onClick={() => handleStatusChange(pedido.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Avançar status">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {!['expedido', 'em_transito', 'entregue'].includes(pedido.status) && (
                          <button onClick={() => deletePedido(pedido.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
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
        {filtered.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500">Nenhum pedido encontrado</p></div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Novo Pedido</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select name="clienteId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Selecione...</option>
                    {clientes.filter(c => c.ativo).map(c => <option key={c.id} value={c.id}>{c.nomeFantasia || c.razaoSocial}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
                  <input name="dataEntrega" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$) *</label>
                  <input name="valorTotal" type="number" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso Total (kg) *</label>
                  <input name="pesoTotal" type="number" step="0.1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Volumes *</label>
                  <input name="volumeTotal" type="number" required defaultValue={1} min={1} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Endereço de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro *</label>
                    <input name="logradouro" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                    <input name="numero" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                    <input name="bairro" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                    <input name="cidade" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UF *</label>
                    <select name="estado" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">UF</option>
                      {['SP','RJ','MG','PR','RS','SC','BA','PE','CE','GO','DF','ES','PA','AM','MA','MT','MS','PI','RN','PB','AL','SE','TO','AC','RO','RR','AP'].map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                    <input name="cep" required placeholder="00000-000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Criar Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold">{showDetail.numero}</h2>
                <p className="text-sm text-gray-500">{clientes.find(c => c.id === showDetail.clienteId)?.razaoSocial}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status do Pedido</h3>
                <div className="flex items-center gap-1">
                  {(['pendente', 'separando', 'expedido', 'em_transito', 'entregue'] as StatusPedido[]).map((status, idx) => {
                    const statuses: StatusPedido[] = ['pendente', 'separando', 'expedido', 'em_transito', 'entregue'];
                    const currentIdx = statuses.indexOf(showDetail.status);
                    const isActive = idx <= currentIdx;
                    return (
                      <div key={status} className="flex items-center">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500')}>
                          {idx + 1}
                        </div>
                        {idx < 4 && <div className={cn('w-8 h-0.5', isActive && idx < currentIdx ? 'bg-blue-600' : 'bg-gray-200')} />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {(['pendente', 'separando', 'expedido', 'em_transito', 'entregue'] as StatusPedido[]).map((status) => (
                    <span key={status} className="text-[10px] text-gray-500 w-12 text-center">{statusLabels[status]}</span>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Valor Total</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(showDetail.valorTotal)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Peso Total</p>
                  <p className="text-sm font-bold text-gray-900">{showDetail.pesoTotal} kg</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Volumes</p>
                  <p className="text-sm font-bold text-gray-900">{showDetail.volumeTotal}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Data Entrega</p>
                  <p className="text-sm font-bold text-gray-900">{showDetail.dataEntrega ? formatDate(showDetail.dataEntrega) : '-'}</p>
                </div>
              </div>

              {/* Volumes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Volumes</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Código</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Peso</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Dimensões</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Qtd</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {showDetail.volumes.map(vol => (
                        <tr key={vol.id}>
                          <td className="px-4 py-2 text-sm">{vol.codigo}</td>
                          <td className="px-4 py-2 text-sm">{vol.peso} kg</td>
                          <td className="px-4 py-2 text-sm">{vol.dimensoes.comprimento}x{vol.dimensoes.largura}x{vol.dimensoes.altura} cm</td>
                          <td className="px-4 py-2 text-sm">{vol.quantidade}</td>
                          <td className="px-4 py-2">
                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[vol.status])}>
                              {statusLabels[vol.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Endereço de Entrega</h3>
                <p className="text-sm text-gray-600">
                  {showDetail.enderecoEntrega.logradouro}, {showDetail.enderecoEntrega.numero} - {showDetail.enderecoEntrega.bairro}<br />
                  {showDetail.enderecoEntrega.cidade}/{showDetail.enderecoEntrega.estado} - CEP: {showDetail.enderecoEntrega.cep}
                </p>
              </div>

              {/* Actions */}
              {getNextStatus(showDetail.status) && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => { handleStatusChange(showDetail.id); setShowDetail({ ...showDetail, status: getNextStatus(showDetail.status)! }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Avançar para: {statusLabels[getNextStatus(showDetail.status)!]}
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
