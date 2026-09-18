import { useState } from 'react';
import { useFleetStore } from '../stores';
import { Motorista } from '../types';
import { Plus, Search, Edit, Trash2, X, User } from 'lucide-react';
import { cn, statusColors } from '../lib/utils';

export function MotoristasPage() {
  const { motoristas, addMotorista, updateMotorista, deleteMotorista } = useFleetStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Motorista | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filtered = motoristas.filter(m =>
    m.nome.toLowerCase().includes(search.toLowerCase()) ||
    m.cpf.includes(search) ||
    m.cnh.includes(search)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      nome: form.get('nome') as string,
      cpf: form.get('cpf') as string,
      cnh: form.get('cnh') as string,
      categoriaCnh: form.get('categoriaCnh') as string,
      telefone: form.get('telefone') as string,
      email: form.get('email') as string,
      ativo: true,
    };
    if (editing) {
      updateMotorista(editing.id, data);
    } else {
      addMotorista(data);
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Motoristas</h1>
          <p className="text-gray-500">{motoristas.length} motoristas cadastrados</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Novo Motorista
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nome, CPF ou CNH..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((motorista) => (
          <div key={motorista.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{motorista.nome}</p>
                  <p className="text-xs text-gray-500">CNH: {motorista.cnh} ({motorista.categoriaCnh})</p>
                </div>
              </div>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', motorista.ativo ? statusColors['disponivel'] : 'bg-red-100 text-red-700')}>
                {motorista.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>CPF: {motorista.cpf}</p>
              <p>Tel: {motorista.telefone}</p>
              <p>Email: {motorista.email}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t">
              <button onClick={() => { setEditing(motorista); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit className="w-3.5 h-3.5" /> Editar
              </button>
              <button onClick={() => setShowDeleteConfirm(motorista.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Editar Motorista' : 'Novo Motorista'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                <input name="nome" defaultValue={editing?.nome} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input name="cpf" defaultValue={editing?.cpf} required placeholder="000.000.000-00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNH *</label>
                  <input name="cnh" defaultValue={editing?.cnh} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria CNH *</label>
                <select name="categoriaCnh" defaultValue={editing?.categoriaCnh} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Selecione</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input name="telefone" defaultValue={editing?.telefone} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input name="email" type="email" defaultValue={editing?.email} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">Tem certeza? Não é possível excluir motoristas com viagens ativas.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={() => { const ok = deleteMotorista(showDeleteConfirm); if (!ok) alert('Não é possível excluir: motorista possui viagens ativas.'); setShowDeleteConfirm(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
