import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function formatPlaca(placa: string): string {
  return placa.toUpperCase();
}

export const statusLabels: Record<string, string> = {
  'pendente': 'Pendente',
  'separando': 'Separando',
  'expedido': 'Expedido',
  'em_transito': 'Em Trânsito',
  'entregue': 'Entregue',
  'planejada': 'Planejada',
  'em_andamento': 'Em Andamento',
  'concluida': 'Concluída',
  'cancelada': 'Cancelada',
  'disponivel': 'Disponível',
  'em_viagem': 'Em Viagem',
  'manutencao': 'Manutenção',
  'separado': 'Separado',
  'validado': 'Validado',
  'rejeitado': 'Rejeitado',
};

export const statusColors: Record<string, string> = {
  'pendente': 'bg-yellow-100 text-yellow-800',
  'separando': 'bg-blue-100 text-blue-800',
  'expedido': 'bg-purple-100 text-purple-800',
  'em_transito': 'bg-orange-100 text-orange-800',
  'entregue': 'bg-green-100 text-green-800',
  'planejada': 'bg-blue-100 text-blue-800',
  'em_andamento': 'bg-orange-100 text-orange-800',
  'concluida': 'bg-green-100 text-green-800',
  'cancelada': 'bg-red-100 text-red-800',
  'disponivel': 'bg-green-100 text-green-800',
  'em_viagem': 'bg-orange-100 text-orange-800',
  'manutencao': 'bg-red-100 text-red-800',
};
