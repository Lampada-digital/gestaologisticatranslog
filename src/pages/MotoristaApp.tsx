import { useState, useRef, useEffect } from 'react';
import { useTripStore, useOrderStore, useClientStore, useFleetStore } from '../stores';
import { ArrowLeft, MapPin, Phone, Camera, Check, Package, Truck, Navigation } from 'lucide-react';
import { cn, statusLabels, statusColors, formatCurrency } from '../lib/utils';

export function MotoristaApp() {
  const [screen, setScreen] = useState<'login' | 'dashboard' | 'viagem' | 'entrega'>('login');
  const [selectedViagem, setSelectedViagem] = useState<string | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null);
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [assinatura, setAssinatura] = useState(false);
  const [fotoCanhoto, setFotoCanhoto] = useState(false);
  const [nomeRecebedor, setNomeRecebedor] = useState('');
  const [docRecebedor, setDocRecebedor] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { viagens } = useTripStore();
  const { pedidos } = useOrderStore();
  const { clientes } = useClientStore();
  const { motoristas } = useFleetStore();

  const handleLogin = () => {
    if (cpf && senha) setScreen('dashboard');
  };

  const viagemAtiva = viagens.find(v => v.id === selectedViagem);
  const pedidoAtivo = pedidos.find(p => p.id === selectedPedido);
  const clienteAtivo = pedidoAtivo ? clientes.find(c => c.id === pedidoAtivo.clienteId) : null;

  const viagensMotorista = viagens.filter(v => v.status === 'em_andamento');

  // Canvas signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e40af';
    ctx.lineTo(x, y);
    ctx.stroke();
    setAssinatura(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">TransLog Driver</h1>
            <p className="text-blue-200 text-sm">App do Motorista</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg" />
              </div>
              <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg">
                Entrar
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Demo: qualquer CPF e senha</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-700 text-white px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-200 text-xs">Olá, Motorista</p>
              <p className="text-lg font-bold">Minhas Viagens</p>
            </div>
            <button onClick={() => setScreen('login')} className="text-xs text-blue-200 hover:text-white">Sair</button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {viagensMotorista.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma viagem em andamento</p>
            </div>
          ) : (
            viagensMotorista.map(v => {
              const pedidosViagem = pedidos.filter(p => v.pedidoIds.includes(p.id));
              const entregues = pedidosViagem.filter(p => p.status === 'entregue').length;
              return (
                <button key={v.id} onClick={() => { setSelectedViagem(v.id); setScreen('viagem'); }}
                  className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">{v.numero}</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Em Andamento</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {pedidosViagem.length} entregas</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> {entregues} concluídas</span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(entregues / pedidosViagem.length) * 100}%` }} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (screen === 'viagem' && viagemAtiva) {
    const pedidosViagem = pedidos.filter(p => viagemAtiva.pedidoIds.includes(p.id));
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-700 text-white px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setScreen('dashboard')} className="p-1 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-bold">{viagemAtiva.numero}</p>
              <p className="text-xs text-blue-200">Entregas da Viagem</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {pedidosViagem.map((p, idx) => {
            const cliente = clientes.find(c => c.id === p.clienteId);
            const isEntregue = p.status === 'entregue';
            return (
              <button key={p.id} onClick={() => { if (!isEntregue) { setSelectedPedido(p.id); setScreen('entrega'); } }}
                disabled={isEntregue}
                className={cn('w-full bg-white rounded-xl p-4 shadow-sm text-left', isEntregue && 'opacity-60')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      isEntregue ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    )}>{idx + 1}</div>
                    <span className="text-sm font-bold">{p.numero}</span>
                  </div>
                  {isEntregue ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✓ Entregue</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pendente</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{cliente?.razaoSocial}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {p.enderecoEntrega.logradouro}, {p.enderecoEntrega.numero} - {p.enderecoEntrega.cidade}/{p.enderecoEntrega.estado}
                </p>
                {!isEntregue && (
                  <div className="flex gap-2 mt-3">
                    <span className="flex items-center gap-1 text-xs text-blue-600"><Navigation className="w-3 h-3" /> Navegar</span>
                    <span className="flex items-center gap-1 text-xs text-green-600"><Phone className="w-3 h-3" /> Ligar</span>
                    <span className="flex items-center gap-1 text-xs text-purple-600 ml-auto"><Camera className="w-3 h-3" /> Comprovante</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === 'entrega' && pedidoAtivo) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-700 text-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setScreen('viagem'); setFotoCanhoto(false); setAssinatura(false); setNomeRecebedor(''); setDocRecebedor(''); }} className="p-1 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-bold">Comprovante de Entrega</p>
              <p className="text-xs text-blue-200">{pedidoAtivo.numero}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm font-bold mb-1">{clienteAtivo?.razaoSocial}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {pedidoAtivo.enderecoEntrega.logradouro}, {pedidoAtivo.enderecoEntrega.numero}
            </p>
            <p className="text-xs text-gray-500">{pedidoAtivo.enderecoEntrega.cidade}/{pedidoAtivo.enderecoEntrega.estado}</p>
            <p className="text-xs text-gray-500 mt-1">Valor: {formatCurrency(pedidoAtivo.valorTotal)} • {pedidoAtivo.volumeTotal} volumes</p>
          </div>

          {/* Foto Canhoto */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium mb-2">📸 Foto do Canhoto *</p>
            <button onClick={() => setFotoCanhoto(true)}
              className={cn('w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors',
                fotoCanhoto ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
              )}>
              {fotoCanhoto ? (
                <div className="text-center">
                  <Check className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="text-xs text-green-600 mt-1">Foto capturada</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 mt-1">Toque para fotografar</p>
                </div>
              )}
            </button>
          </div>

          {/* Assinatura */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium mb-2">✍️ Assinatura Digital *</p>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={300}
                height={120}
                className="w-full h-32 touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            {assinatura && <p className="text-xs text-green-600 mt-1">✓ Assinatura coletada</p>}
          </div>

          {/* Recebedor */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <p className="text-sm font-medium">Dados do Recebedor *</p>
            <input
              value={nomeRecebedor}
              onChange={(e) => setNomeRecebedor(e.target.value)}
              placeholder="Nome completo do recebedor"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              value={docRecebedor}
              onChange={(e) => setDocRecebedor(e.target.value)}
              placeholder="CPF ou RG do recebedor"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Geolocalização */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">📍 Geolocalização coletada</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lat: -23.5505, Lng: -46.6333</p>
          </div>

          {/* Confirm Button */}
          <button
            disabled={!fotoCanhoto || !assinatura || !nomeRecebedor || !docRecebedor}
            onClick={() => {
              alert('✓ Entrega confirmada com sucesso! Comprovante salvo.');
              setScreen('viagem');
              setFotoCanhoto(false);
              setAssinatura(false);
              setNomeRecebedor('');
              setDocRecebedor('');
            }}
            className={cn('w-full py-4 rounded-xl font-bold text-white transition-colors text-lg',
              fotoCanhoto && assinatura && nomeRecebedor && docRecebedor
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            Confirmar Entrega
          </button>
        </div>
      </div>
    );
  }

  return null;
}
