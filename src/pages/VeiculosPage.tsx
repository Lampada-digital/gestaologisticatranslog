import { useState } from 'react';
import { useFleetStore } from '../stores';
import { Veiculo } from '../types';
import { Plus, Search, Edit, Trash2, X, Truck as TruckIcon } from 'lucide-react';
import { cn, statusColors, statusLabels } from '../lib/utils';

export function VeiculosPage() {
  const { veiculos, addVeiculo, updateVeiculo, deleteVeiculo } = useFleetStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Veiculo | null>(null);

  const filtered = veiculos.filter(v => {
    const matchSearch = v.placa.toLowerCase().includes(search.toLowerCase()) || v.modelo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      placa: (form.get('placa') as string).toUpperCase(),
      renavam: form.get('renavam') as string,
      modelo: form.get('modelo') as string,
      ano: parseInt(form.get('ano') as string),
      capacidadeKg: parseFloat(form.get('capacidadeKg') as string),
      capacidadeM3: parseFloat(form.get('capacidadeM3') as string),
      status: 'disponivel' as const,
    };
    if (editing) {
      updateVeiculo(editing.id, data);
    } else {
      addVeiculo(data);
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
          <p className="text-gray-500">{veiculos.length} veículos cadastrados</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Novo Veículo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por placa ou modelo..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Todos os status</option>
            <option value="disponivel">Disponível</option>
            <option value="em_viagem">Em Viagem</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{veiculos.filter(v => v.status === 'disponivel').length}</p>
          <p className="text-xs text-gray-500">Disponíveis</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-orange-600">{veiculos.filter(v => v.status === 'em_viagem').length}</p>
          <p className="text-xs text-gray-500">Em Viagem</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{veiculos.filter(v => v.status === 'manutencao').length}</p>
          <p className="text-xs text-gray-500">Manutenção</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Placa</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Modelo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ano</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Capacidade</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((veiculo) => (
                <tr key={veiculo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <TruckIcon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 font-mono">{veiculo.placa}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{veiculo.modelo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{veiculo.ano}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{veiculo.capacidadeKg.toLocaleString()} kg / {veiculo.capacidadeM3} m³</td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[veiculo.status])}>
                      {statusLabels[veiculo.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(veiculo); setShowModal(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { const ok = deleteVeiculo(veiculo.id); if (!ok) alert('Não é possível excluir: veículo possui viagens ativas.'); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Editar Veículo' : 'Novo Veículo'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                  <input name="placa" defaultValue={editing?.placa} required placeholder="ABC-1D23" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RENAVAM *</label>
                  <input name="renavam" defaultValue={editing?.renavam} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                  <input name="modelo" defaultValue={editing?.modelo} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
                  <input name="ano" type="number" defaultValue={editing?.ano} required min={2000} max={2025} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (kg) *</label>
                  <input name="capacidadeKg" type="number" defaultValue={editing?.capacidadeKg} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (m³) *</label>
                  <input name="capacidadeM3" type="number" step="0.1" defaultValue={editing?.capacidadeM3} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Salvar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
