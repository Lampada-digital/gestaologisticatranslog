// Multi-tenancy
export interface Tenant {
  id: string;
  nome: string;
  cnpj: string;
  plano: 'basic' | 'pro' | 'enterprise';
  ativo: boolean;
  criadoEm: string;
}

export interface Filial {
  id: string;
  tenantId: string;
  nome: string;
  cnpj?: string;
  endereco: Endereco;
  ativo: boolean;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  lat?: number;
  lng?: number;
}

// Usuários e Permissões
export interface Usuario {
  id: string;
  tenantId: string;
  filialId: string;
  nome: string;
  email: string;
  cpf?: string;
  papel: string;
  ativo: boolean;
  ultimoAcesso?: string;
  criadoEm: string;
}

export interface Papel {
  id: string;
  nome: string;
  descricao?: string;
  permissoes: string[];
}

export interface LogAuditoria {
  id: string;
  tenantId: string;
  usuarioId: string;
  usuarioNome: string;
  acao: 'CREATE' | 'UPDATE' | 'DELETE';
  recurso: string;
  recursoId: string;
  dadosAntigos?: Record<string, unknown>;
  dadosNovos?: Record<string, unknown>;
  ipAddress?: string;
  criadoEm: string;
}

// Clientes
export interface Cliente {
  id: string;
  tenantId: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  ie?: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  ativo: boolean;
  criadoEm: string;
}

// Pedidos
export type StatusPedido = 'pendente' | 'separando' | 'expedido' | 'em_transito' | 'entregue';

export interface Pedido {
  id: string;
  tenantId: string;
  clienteId: string;
  numero: string;
  status: StatusPedido;
  valorTotal: number;
  pesoTotal: number;
  volumeTotal: number;
  enderecoEntrega: Endereco;
  dataEntrega?: string;
  criadoEm: string;
  atualizadoEm: string;
  volumes: Volume[];
  viagemId?: string;
}

export interface Volume {
  id: string;
  pedidoId: string;
  codigo: string;
  peso: number;
  dimensoes: { comprimento: number; largura: number; altura: number };
  quantidade: number;
  status: 'pendente' | 'separado' | 'expedido' | 'entregue';
}

// Frota
export interface Motorista {
  id: string;
  tenantId: string;
  nome: string;
  cpf: string;
  cnh: string;
  categoriaCnh: string;
  telefone: string;
  email: string;
  ativo: boolean;
}

export interface Veiculo {
  id: string;
  tenantId: string;
  placa: string;
  renavam: string;
  modelo: string;
  ano: number;
  capacidadeKg: number;
  capacidadeM3: number;
  status: 'disponivel' | 'em_viagem' | 'manutencao';
}

// Viagens
export type StatusViagem = 'planejada' | 'em_andamento' | 'concluida' | 'cancelada';

export interface Viagem {
  id: string;
  tenantId: string;
  numero: string;
  status: StatusViagem;
  motoristaId: string;
  veiculoId: string;
  dataInicio: string;
  dataFim?: string;
  custoTotal?: number;
  pedidoIds: string[];
  criadoEm: string;
}

// Comprovante de Entrega
export interface ComprovanteEntrega {
  id: string;
  volumeId: string;
  fotoCanhoto: string;
  fotoMercadoria?: string;
  assinaturaDigital: string;
  nomeRecebedor: string;
  documentoRecebedor: string;
  geolocalizacao: { lat: number; lng: number };
  dataEntrega: string;
  statusValidacao: 'pendente' | 'validado' | 'rejeitado';
}
