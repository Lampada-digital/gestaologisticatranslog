import { Tenant, Cliente, Pedido, Motorista, Veiculo, Viagem, Usuario, LogAuditoria } from '../types';

export const mockTenant: Tenant = {
  id: 'tenant-001',
  nome: 'TransLog Express LTDA',
  cnpj: '12.345.678/0001-90',
  plano: 'pro',
  ativo: true,
  criadoEm: '2024-01-15T00:00:00Z',
};

export const mockUsuarios: Usuario[] = [
  { id: 'user-001', tenantId: 'tenant-001', filialId: 'filial-001', nome: 'Carlos Admin', email: 'admin@translog.com.br', papel: 'ADMIN', ativo: true, criadoEm: '2024-01-15T00:00:00Z' },
  { id: 'user-002', tenantId: 'tenant-001', filialId: 'filial-001', nome: 'Maria Operações', email: 'maria@translog.com.br', papel: 'GERENTE_OPERACOES', ativo: true, criadoEm: '2024-02-01T00:00:00Z' },
  { id: 'user-003', tenantId: 'tenant-001', filialId: 'filial-001', nome: 'João Financeiro', email: 'joao@translog.com.br', papel: 'ADMIN_FINANCEIRO', ativo: true, criadoEm: '2024-02-15T00:00:00Z' },
];

export const mockClientes: Cliente[] = [
  {
    id: 'cli-001', tenantId: 'tenant-001', razaoSocial: 'Indústria Brasileira de Alimentos S.A.', nomeFantasia: 'IBA Alimentos',
    cnpj: '11.222.333/0001-44', ie: '123.456.789.000', email: 'logistica@iba.com.br', telefone: '(11) 3333-4444',
    endereco: { logradouro: 'Av. Industrial', numero: '1500', bairro: 'Distrito Industrial', cidade: 'São Paulo', estado: 'SP', cep: '01000-000' },
    ativo: true, criadoEm: '2024-01-20T00:00:00Z'
  },
  {
    id: 'cli-002', tenantId: 'tenant-001', razaoSocial: 'TechParts Distribuidora LTDA', nomeFantasia: 'TechParts',
    cnpj: '22.333.444/0001-55', ie: '987.654.321.000', email: 'compras@techparts.com.br', telefone: '(11) 4444-5555',
    endereco: { logradouro: 'Rua das Tecnologia', numero: '800', bairro: 'Alphaville', cidade: 'Barueri', estado: 'SP', cep: '06454-000' },
    ativo: true, criadoEm: '2024-02-10T00:00:00Z'
  },
  {
    id: 'cli-003', tenantId: 'tenant-001', razaoSocial: 'Farmácia Popular do Brasil ME', nomeFantasia: 'FarmaBrasil',
    cnpj: '33.444.555/0001-66', ie: '456.789.123.000', email: 'distribuicao@farmabrasil.com.br', telefone: '(21) 5555-6666',
    endereco: { logradouro: 'Rua da Saúde', numero: '200', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20000-000' },
    ativo: true, criadoEm: '2024-03-01T00:00:00Z'
  },
  {
    id: 'cli-004', tenantId: 'tenant-001', razaoSocial: 'MegaStore E-commerce LTDA', nomeFantasia: 'MegaStore',
    cnpj: '44.555.666/0001-77', email: 'fulfillment@megastore.com.br', telefone: '(31) 6666-7777',
    endereco: { logradouro: 'Av. do Comércio', numero: '3000', bairro: 'Savassi', cidade: 'Belo Horizonte', estado: 'MG', cep: '30000-000' },
    ativo: true, criadoEm: '2024-03-15T00:00:00Z'
  },
  {
    id: 'cli-005', tenantId: 'tenant-001', razaoSocial: 'AutoPeças Nacional S.A.', nomeFantasia: 'AutoNacional',
    cnpj: '55.666.777/0001-88', ie: '321.654.987.000', email: 'logistica@autonacional.com.br', telefone: '(41) 7777-8888',
    endereco: { logradouro: 'Rod. BR-116', numero: '5000', bairro: 'CIC', cidade: 'Curitiba', estado: 'PR', cep: '80000-000' },
    ativo: false, criadoEm: '2024-04-01T00:00:00Z'
  },
];

export const mockPedidos: Pedido[] = [
  {
    id: 'ped-001', tenantId: 'tenant-001', clienteId: 'cli-001', numero: 'PED-2024-0001', status: 'entregue',
    valorTotal: 15420.00, pesoTotal: 850, volumeTotal: 12,
    enderecoEntrega: { logradouro: 'Rua da Entrega', numero: '100', bairro: 'Vila Nova', cidade: 'Campinas', estado: 'SP', cep: '13000-000' },
    dataEntrega: '2024-06-10T14:30:00Z', criadoEm: '2024-06-08T08:00:00Z', atualizadoEm: '2024-06-10T14:30:00Z',
    volumes: [
      { id: 'vol-001', pedidoId: 'ped-001', codigo: 'VOL-001-A', peso: 25, dimensoes: { comprimento: 60, largura: 40, altura: 30 }, quantidade: 6, status: 'entregue' },
      { id: 'vol-002', pedidoId: 'ped-001', codigo: 'VOL-001-B', peso: 15, dimensoes: { comprimento: 40, largura: 30, altura: 20 }, quantidade: 6, status: 'entregue' },
    ],
    viagemId: 'via-001'
  },
  {
    id: 'ped-002', tenantId: 'tenant-001', clienteId: 'cli-002', numero: 'PED-2024-0002', status: 'em_transito',
    valorTotal: 8750.50, pesoTotal: 420, volumeTotal: 8,
    enderecoEntrega: { logradouro: 'Av. Paulista', numero: '2000', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', cep: '01310-000' },
    dataEntrega: '2024-06-15T18:00:00Z', criadoEm: '2024-06-12T09:00:00Z', atualizadoEm: '2024-06-14T06:00:00Z',
    volumes: [
      { id: 'vol-003', pedidoId: 'ped-002', codigo: 'VOL-002-A', peso: 30, dimensoes: { comprimento: 80, largura: 50, altura: 40 }, quantidade: 4, status: 'expedido' },
      { id: 'vol-004', pedidoId: 'ped-002', codigo: 'VOL-002-B', peso: 20, dimensoes: { comprimento: 50, largura: 35, altura: 25 }, quantidade: 4, status: 'expedido' },
    ],
    viagemId: 'via-002'
  },
  {
    id: 'ped-003', tenantId: 'tenant-001', clienteId: 'cli-003', numero: 'PED-2024-0003', status: 'separando',
    valorTotal: 22100.00, pesoTotal: 1200, volumeTotal: 20,
    enderecoEntrega: { logradouro: 'Rua dos Medicamentos', numero: '50', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20020-000' },
    dataEntrega: '2024-06-18T12:00:00Z', criadoEm: '2024-06-14T10:00:00Z', atualizadoEm: '2024-06-14T14:00:00Z',
    volumes: [
      { id: 'vol-005', pedidoId: 'ped-003', codigo: 'VOL-003-A', peso: 40, dimensoes: { comprimento: 100, largura: 60, altura: 50 }, quantidade: 10, status: 'separado' },
      { id: 'vol-006', pedidoId: 'ped-003', codigo: 'VOL-003-B', peso: 20, dimensoes: { comprimento: 50, largura: 40, altura: 30 }, quantidade: 10, status: 'pendente' },
    ],
  },
  {
    id: 'ped-004', tenantId: 'tenant-001', clienteId: 'cli-004', numero: 'PED-2024-0004', status: 'pendente',
    valorTotal: 5680.00, pesoTotal: 180, volumeTotal: 5,
    enderecoEntrega: { logradouro: 'Rua do Comércio', numero: '300', bairro: 'Savassi', cidade: 'Belo Horizonte', estado: 'MG', cep: '30100-000' },
    dataEntrega: '2024-06-20T16:00:00Z', criadoEm: '2024-06-15T08:00:00Z', atualizadoEm: '2024-06-15T08:00:00Z',
    volumes: [
      { id: 'vol-007', pedidoId: 'ped-004', codigo: 'VOL-004-A', peso: 35, dimensoes: { comprimento: 70, largura: 45, altura: 35 }, quantidade: 5, status: 'pendente' },
    ],
  },
  {
    id: 'ped-005', tenantId: 'tenant-001', clienteId: 'cli-001', numero: 'PED-2024-0005', status: 'expedido',
    valorTotal: 12300.00, pesoTotal: 650, volumeTotal: 10,
    enderecoEntrega: { logradouro: 'Av. Brasil', numero: '800', bairro: 'Industrial', cidade: 'Guarulhos', estado: 'SP', cep: '07000-000' },
    dataEntrega: '2024-06-16T10:00:00Z', criadoEm: '2024-06-13T11:00:00Z', atualizadoEm: '2024-06-15T16:00:00Z',
    volumes: [
      { id: 'vol-008', pedidoId: 'ped-005', codigo: 'VOL-005-A', peso: 50, dimensoes: { comprimento: 90, largura: 55, altura: 45 }, quantidade: 5, status: 'expedido' },
      { id: 'vol-009', pedidoId: 'ped-005', codigo: 'VOL-005-B', peso: 15, dimensoes: { comprimento: 40, largura: 30, altura: 20 }, quantidade: 5, status: 'expedido' },
    ],
  },
  {
    id: 'ped-006', tenantId: 'tenant-001', clienteId: 'cli-002', numero: 'PED-2024-0006', status: 'entregue',
    valorTotal: 9800.00, pesoTotal: 320, volumeTotal: 6,
    enderecoEntrega: { logradouro: 'Rua das Flores', numero: '150', bairro: 'Jardins', cidade: 'São Paulo', estado: 'SP', cep: '01402-000' },
    dataEntrega: '2024-06-09T11:00:00Z', criadoEm: '2024-06-07T09:00:00Z', atualizadoEm: '2024-06-09T11:00:00Z',
    volumes: [
      { id: 'vol-010', pedidoId: 'ped-006', codigo: 'VOL-006-A', peso: 55, dimensoes: { comprimento: 75, largura: 50, altura: 40 }, quantidade: 6, status: 'entregue' },
    ],
    viagemId: 'via-001'
  },
];

export const mockMotoristas: Motorista[] = [
  { id: 'mot-001', tenantId: 'tenant-001', nome: 'Roberto Silva Santos', cpf: '123.456.789-00', cnh: '01234567890', categoriaCnh: 'E', telefone: '(11) 99999-1111', email: 'roberto@translog.com.br', ativo: true },
  { id: 'mot-002', tenantId: 'tenant-001', nome: 'Fernando Oliveira Lima', cpf: '234.567.890-11', cnh: '09876543210', categoriaCnh: 'D', telefone: '(11) 99999-2222', email: 'fernando@translog.com.br', ativo: true },
  { id: 'mot-003', tenantId: 'tenant-001', nome: 'André Costa Pereira', cpf: '345.678.901-22', cnh: '05432167890', categoriaCnh: 'E', telefone: '(11) 99999-3333', email: 'andre@translog.com.br', ativo: true },
  { id: 'mot-004', tenantId: 'tenant-001', nome: 'Marcos Rodrigues', cpf: '456.789.012-33', cnh: '06789123450', categoriaCnh: 'C', telefone: '(11) 99999-4444', email: 'marcos@translog.com.br', ativo: false },
];

export const mockVeiculos: Veiculo[] = [
  { id: 'vei-001', tenantId: 'tenant-001', placa: 'ABC-1D23', renavam: '12345678901', modelo: 'Volvo FH 540', ano: 2022, capacidadeKg: 15000, capacidadeM3: 45, status: 'em_viagem' },
  { id: 'vei-002', tenantId: 'tenant-001', placa: 'DEF-4G56', renavam: '23456789012', modelo: 'Scania R450', ano: 2021, capacidadeKg: 12000, capacidadeM3: 38, status: 'disponivel' },
  { id: 'vei-003', tenantId: 'tenant-001', placa: 'GHI-7J89', renavam: '34567890123', modelo: 'Mercedes Actros 2651', ano: 2023, capacidadeKg: 18000, capacidadeM3: 52, status: 'disponivel' },
  { id: 'vei-004', tenantId: 'tenant-001', placa: 'JKL-0K12', renavam: '45678901234', modelo: 'DAF XF 530', ano: 2020, capacidadeKg: 10000, capacidadeM3: 30, status: 'manutencao' },
  { id: 'vei-005', tenantId: 'tenant-001', placa: 'MNO-3L45', renavam: '56789012345', modelo: 'Iveco S-Way 570', ano: 2023, capacidadeKg: 14000, capacidadeM3: 42, status: 'disponivel' },
];

export const mockViagens: Viagem[] = [
  {
    id: 'via-001', tenantId: 'tenant-001', numero: 'VIA-2024-0001', status: 'concluida',
    motoristaId: 'mot-001', veiculoId: 'vei-001', dataInicio: '2024-06-09T06:00:00Z', dataFim: '2024-06-09T20:00:00Z',
    custoTotal: 2850.00, pedidoIds: ['ped-001', 'ped-006'], criadoEm: '2024-06-08T16:00:00Z'
  },
  {
    id: 'via-002', tenantId: 'tenant-001', numero: 'VIA-2024-0002', status: 'em_andamento',
    motoristaId: 'mot-002', veiculoId: 'vei-001', dataInicio: '2024-06-14T05:00:00Z',
    pedidoIds: ['ped-002'], criadoEm: '2024-06-13T14:00:00Z'
  },
  {
    id: 'via-003', tenantId: 'tenant-001', numero: 'VIA-2024-0003', status: 'planejada',
    motoristaId: 'mot-003', veiculoId: 'vei-002', dataInicio: '2024-06-17T06:00:00Z',
    pedidoIds: ['ped-003', 'ped-004'], criadoEm: '2024-06-15T10:00:00Z'
  },
];

export const mockLogs: LogAuditoria[] = [
  { id: 'log-001', tenantId: 'tenant-001', usuarioId: 'user-001', usuarioNome: 'Carlos Admin', acao: 'CREATE', recurso: 'pedido', recursoId: 'ped-004', dadosNovos: { numero: 'PED-2024-0004' }, ipAddress: '192.168.1.100', criadoEm: '2024-06-15T08:00:00Z' },
  { id: 'log-002', tenantId: 'tenant-001', usuarioId: 'user-002', usuarioNome: 'Maria Operações', acao: 'UPDATE', recurso: 'pedido', recursoId: 'ped-003', dadosAntigos: { status: 'pendente' }, dadosNovos: { status: 'separando' }, ipAddress: '192.168.1.101', criadoEm: '2024-06-14T14:00:00Z' },
  { id: 'log-003', tenantId: 'tenant-001', usuarioId: 'user-002', usuarioNome: 'Maria Operações', acao: 'UPDATE', recurso: 'viagem', recursoId: 'via-002', dadosAntigos: { status: 'planejada' }, dadosNovos: { status: 'em_andamento' }, ipAddress: '192.168.1.101', criadoEm: '2024-06-14T05:00:00Z' },
  { id: 'log-004', tenantId: 'tenant-001', usuarioId: 'user-001', usuarioNome: 'Carlos Admin', acao: 'CREATE', recurso: 'cliente', recursoId: 'cli-004', dadosNovos: { razaoSocial: 'MegaStore E-commerce LTDA' }, ipAddress: '192.168.1.100', criadoEm: '2024-03-15T09:00:00Z' },
  { id: 'log-005', tenantId: 'tenant-001', usuarioId: 'user-002', usuarioNome: 'Maria Operações', acao: 'UPDATE', recurso: 'pedido', recursoId: 'ped-001', dadosAntigos: { status: 'em_transito' }, dadosNovos: { status: 'entregue' }, ipAddress: '192.168.1.101', criadoEm: '2024-06-10T14:30:00Z' },
];
