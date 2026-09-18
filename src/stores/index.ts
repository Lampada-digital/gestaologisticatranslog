import { create } from 'zustand';
import { Cliente, Pedido, Motorista, Veiculo, Viagem, Usuario, LogAuditoria, StatusPedido, StatusViagem } from '../types';
import { mockClientes, mockPedidos, mockMotoristas, mockVeiculos, mockViagens, mockUsuarios, mockLogs } from '../data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Usuario | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  login: (email: string, _password: string) => {
    const user = mockUsuarios.find(u => u.email === email);
    if (user) {
      set({ isAuthenticated: true, currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, currentUser: null }),
}));

interface ClientState {
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'tenantId' | 'criadoEm'>) => void;
  updateCliente: (id: string, data: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clientes: mockClientes,
  addCliente: (cliente) => set((state) => ({
    clientes: [...state.clientes, { ...cliente, id: `cli-${Date.now()}`, tenantId: 'tenant-001', criadoEm: new Date().toISOString() } as Cliente]
  })),
  updateCliente: (id, data) => set((state) => ({
    clientes: state.clientes.map(c => c.id === id ? { ...c, ...data } : c)
  })),
  deleteCliente: (id) => set((state) => ({
    clientes: state.clientes.filter(c => c.id !== id)
  })),
}));

interface OrderState {
  pedidos: Pedido[];
  addPedido: (pedido: Omit<Pedido, 'id' | 'tenantId' | 'criadoEm' | 'atualizadoEm'>) => void;
  updatePedido: (id: string, data: Partial<Pedido>) => void;
  updatePedidoStatus: (id: string, status: StatusPedido) => boolean;
  deletePedido: (id: string) => boolean;
}

const STATUS_TRANSITIONS: Record<StatusPedido, StatusPedido[]> = {
  'pendente': ['separando'],
  'separando': ['expedido'],
  'expedido': ['em_transito'],
  'em_transito': ['entregue'],
  'entregue': [],
};

export const useOrderStore = create<OrderState>((set) => ({
  pedidos: mockPedidos,
  addPedido: (pedido) => set((state) => ({
    pedidos: [...state.pedidos, {
      ...pedido, id: `ped-${Date.now()}`, tenantId: 'tenant-001',
      criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString()
    } as Pedido]
  })),
  updatePedido: (id, data) => set((state) => ({
    pedidos: state.pedidos.map(p => p.id === id ? { ...p, ...data, atualizadoEm: new Date().toISOString() } : p)
  })),
  updatePedidoStatus: (id, status) => {
    const state = useOrderStore.getState();
    const pedido = state.pedidos.find(p => p.id === id);
    if (!pedido) return false;
    if (!STATUS_TRANSITIONS[pedido.status].includes(status)) return false;
    set({
      pedidos: state.pedidos.map(p => p.id === id ? { ...p, status, atualizadoEm: new Date().toISOString() } : p)
    });
    return true;
  },
  deletePedido: (id) => {
    const state = useOrderStore.getState();
    const pedido = state.pedidos.find(p => p.id === id);
    if (!pedido) return false;
    if (['expedido', 'em_transito', 'entregue'].includes(pedido.status)) return false;
    set({ pedidos: state.pedidos.filter(p => p.id !== id) });
    return true;
  },
}));

interface FleetState {
  motoristas: Motorista[];
  veiculos: Veiculo[];
  addMotorista: (m: Omit<Motorista, 'id' | 'tenantId'>) => void;
  updateMotorista: (id: string, data: Partial<Motorista>) => void;
  deleteMotorista: (id: string) => boolean;
  addVeiculo: (v: Omit<Veiculo, 'id' | 'tenantId'>) => void;
  updateVeiculo: (id: string, data: Partial<Veiculo>) => void;
  deleteVeiculo: (id: string) => boolean;
}

export const useFleetStore = create<FleetState>((set) => ({
  motoristas: mockMotoristas,
  veiculos: mockVeiculos,
  addMotorista: (m) => set((state) => ({
    motoristas: [...state.motoristas, { ...m, id: `mot-${Date.now()}`, tenantId: 'tenant-001' } as Motorista]
  })),
  updateMotorista: (id, data) => set((state) => ({
    motoristas: state.motoristas.map(m => m.id === id ? { ...m, ...data } : m)
  })),
  deleteMotorista: (id) => {
    const state = useFleetStore.getState();
    const hasViagens = mockViagens.some(v => v.motoristaId === id && v.status !== 'concluida');
    if (hasViagens) return false;
    set({ motoristas: state.motoristas.filter(m => m.id !== id) });
    return true;
  },
  addVeiculo: (v) => set((state) => ({
    veiculos: [...state.veiculos, { ...v, id: `vei-${Date.now()}`, tenantId: 'tenant-001' } as Veiculo]
  })),
  updateVeiculo: (id, data) => set((state) => ({
    veiculos: state.veiculos.map(v => v.id === id ? { ...v, ...data } : v)
  })),
  deleteVeiculo: (id) => {
    const state = useFleetStore.getState();
    const hasViagens = mockViagens.some(v => v.veiculoId === id && v.status !== 'concluida');
    if (hasViagens) return false;
    set({ veiculos: state.veiculos.filter(v => v.id !== id) });
    return true;
  },
}));

interface TripState {
  viagens: Viagem[];
  addViagem: (v: Omit<Viagem, 'id' | 'tenantId' | 'criadoEm'>) => void;
  updateViagem: (id: string, data: Partial<Viagem>) => void;
  updateViagemStatus: (id: string, status: StatusViagem) => boolean;
}

const VIAGEM_TRANSITIONS: Record<StatusViagem, StatusViagem[]> = {
  'planejada': ['em_andamento', 'cancelada'],
  'em_andamento': ['concluida', 'cancelada'],
  'concluida': [],
  'cancelada': [],
};

export const useTripStore = create<TripState>((set) => ({
  viagens: mockViagens,
  addViagem: (v) => set((state) => ({
    viagens: [...state.viagens, { ...v, id: `via-${Date.now()}`, tenantId: 'tenant-001', criadoEm: new Date().toISOString() } as Viagem]
  })),
  updateViagem: (id, data) => set((state) => ({
    viagens: state.viagens.map(v => v.id === id ? { ...v, ...data } : v)
  })),
  updateViagemStatus: (id, status) => {
    const state = useTripStore.getState();
    const viagem = state.viagens.find(v => v.id === id);
    if (!viagem) return false;
    if (!VIAGEM_TRANSITIONS[viagem.status].includes(status)) return false;
    set({
      viagens: state.viagens.map(v => v.id === id ? {
        ...v, status,
        dataFim: status === 'concluida' || status === 'cancelada' ? new Date().toISOString() : v.dataFim
      } : v)
    });
    return true;
  },
}));

interface AuditState {
  logs: LogAuditoria[];
  addLog: (log: Omit<LogAuditoria, 'id' | 'criadoEm'>) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: mockLogs,
  addLog: (log) => set((state) => ({
    logs: [{ ...log, id: `log-${Date.now()}`, criadoEm: new Date().toISOString() }, ...state.logs]
  })),
}));
