import { useState } from 'react';
import { X, Copy, Check, QrCode, Loader2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { buckpayService, BuckpayPaymentResponse, CustomerData } from '../services/buckpay';
import { trackInitiateCheckout, trackPurchase } from '../utils/pixel';

interface CheckoutPixProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const formatPhone    = (v: string) => { const n = v.replace(/\D/g, '').slice(0, 11); if (n.length <= 2) return `(${n}`; if (n.length <= 7) return `(${n.slice(0,2)}) ${n.slice(2)}`; return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`; };
const formatCPF      = (n: string) => { if (n.length <= 3) return n; if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`; if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`; return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`; };
const formatCNPJ     = (n: string) => { if (n.length <= 2) return n; if (n.length <= 5) return `${n.slice(0,2)}.${n.slice(2)}`; if (n.length <= 8) return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5)}`; if (n.length <= 12) return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}/${n.slice(8)}`; return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}/${n.slice(8,12)}-${n.slice(12)}`; };
const formatDocument = (v: string) => { const n = v.replace(/\D/g, ''); return n.length <= 11 ? formatCPF(n.slice(0,11)) : formatCNPJ(n.slice(0,14)); };
const formatCEP      = (v: string) => { const n = v.replace(/\D/g, '').slice(0,8); return n.length <= 5 ? n : `${n.slice(0,5)}-${n.slice(5)}`; };

const INPUT = 'w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white px-3 py-2.5 text-sm focus:outline-none transition-all rounded-lg placeholder-zinc-600';
const LABEL = 'block text-xs text-zinc-400 mb-1.5 font-medium uppercase tracking-wide';

export default function CheckoutPix({ isOpen, onClose }: CheckoutPixProps) {
  const { items, total, clearCart } = useCart();
  const [customerData, setCustomerData] = useState<CustomerData>({ name: '', email: '', phone: '', document: '' });
  const [addressData, setAddressData] = useState<AddressData>({ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [paymentData, setPaymentData] = useState<BuckpayPaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCepChange = async (cep: string) => {
    const formatted = formatCEP(cep);
    setAddressData({ ...addressData, cep: formatted });
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsLoadingCep(true);
      try {
        const res  = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddressData(prev => ({ ...prev, cep: formatCEP(clean), street: data.logradouro || '', neighborhood: data.bairro || '', city: data.localidade || '', state: data.uf || '' }));
        }
      } catch { /* silent */ } finally { setIsLoadingCep(false); }
    }
  };

  if (!isOpen) return null;

  const handleCreatePayment = async () => {
    if (!customerData.name || !customerData.email || !customerData.document) { 
      setError('Por favor, preencha nome, e-mail e CPF'); 
      return; 
    }
    if (!addressData.cep || !addressData.city || !addressData.state) {
      setError('Por favor, preencha o CEP, cidade e estado'); 
      return; 
    }
    setIsLoading(true); setError(null);
    try {
      const cartItems = items.map(item => ({
        id: item.id,
        name: item.size ? `${item.name} - Tamanho: ${item.size}` : item.name,
        price: Math.round(item.price * 100),
        quantity: item.quantity,
        image: item.image
      }));
      
      const response = await buckpayService.createPixPayment(cartItems, customerData);
      setPaymentData(response);
      
      // Rastreia início do checkout (InitiateCheckout)
      trackInitiateCheckout({
        items: items.map(item => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        total: total,
      });
      
      // Rastreia compra (Purchase) - quando o pagamento é gerado
      trackPurchase({
        orderId: response.transactionId || `order_${Date.now()}`,
        items: items.map(item => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pagamento');
    } finally { setIsLoading(false); }
  };

  const handleCopyPix = () => {
    if (paymentData?.paymentData?.copyPaste) {
      navigator.clipboard.writeText(paymentData.paymentData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinish = () => {
    clearCart();
    setPaymentData(null);
    setCustomerData({ name: '', email: '', phone: '', document: '' });
    onClose();
  };

  const handleClose = () => { if (!paymentData) onClose(); };

  const qrCodeImage = paymentData?.paymentData?.qrCodeBase64 
    ? `data:image/png;base64,${paymentData.paymentData.qrCodeBase64}` 
    : undefined;
  const pixCode = paymentData?.paymentData?.copyPaste;
  const expiresAt = paymentData?.paymentData?.expiresAt;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl">

        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="font-bold text-base flex items-center gap-2.5">
            <QrCode size={18} className="text-zinc-400" />
            Pagamento PIX
          </h2>
          <button onClick={handleClose} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!paymentData ? (
            <>
              <div className="mb-6 bg-zinc-900 rounded-xl p-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-3">Resumo do Pedido</h3>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-zinc-400 truncate flex-1 mr-3">{item.name} ({item.size})</span>
                      <span className="text-white shrink-0">R$&nbsp;{(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 mt-3 pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Total</span>
                    <span className="text-white">R$&nbsp;{total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400">Dados do Cliente</h3>

                <div>
                  <label className={LABEL}>CPF *</label>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={customerData.document} 
                    onChange={e => setCustomerData({ ...customerData, document: formatDocument(e.target.value) })} 
                    className={INPUT} 
                    placeholder="000.000.000-00" 
                    maxLength={14} 
                    autoFocus
                  />
                </div>

                <div>
                  <label className={LABEL}>Nome completo *</label>
                  <input type="text" value={customerData.name} onChange={e => setCustomerData({ ...customerData, name: e.target.value })} className={INPUT} placeholder="Seu nome" autoComplete="name" />
                </div>
                <div>
                  <label className={LABEL}>E-mail *</label>
                  <input type="email" value={customerData.email} onChange={e => setCustomerData({ ...customerData, email: e.target.value })} className={INPUT} placeholder="seu@email.com" autoComplete="email" />
                </div>
                <div>
                  <label className={LABEL}>Telefone</label>
                  <input type="tel" inputMode="tel" value={customerData.phone} onChange={e => setCustomerData({ ...customerData, phone: formatPhone(e.target.value) })} className={INPUT} placeholder="(00) 00000-0000" maxLength={15} autoComplete="tel" />
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <MapPin size={13} /> Endereço de Entrega
                  </h3>

                  <div className="relative">
                    <label className={LABEL}>CEP *</label>
                    <input type="text" inputMode="numeric" value={addressData.cep} onChange={e => handleCepChange(e.target.value)} className={INPUT} placeholder="00000-000" maxLength={9} />
                    {isLoadingCep && <Loader2 size={14} className="absolute right-3 bottom-3 animate-spin text-zinc-500" />}
                  </div>
                  <div>
                    <label className={LABEL}>Rua / Avenida</label>
                    <input type="text" value={addressData.street} onChange={e => setAddressData({ ...addressData, street: e.target.value })} className={INPUT} placeholder="Rua/Avenida" autoComplete="street-address" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Número</label>
                      <input type="text" inputMode="numeric" value={addressData.number} onChange={e => setAddressData({ ...addressData, number: e.target.value })} className={INPUT} placeholder="Nº" />
                    </div>
                    <div>
                      <label className={LABEL}>Complemento</label>
                      <input type="text" value={addressData.complement} onChange={e => setAddressData({ ...addressData, complement: e.target.value })} className={INPUT} placeholder="Apto, sala..." />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Bairro</label>
                    <input type="text" value={addressData.neighborhood} onChange={e => setAddressData({ ...addressData, neighborhood: e.target.value })} className={INPUT} placeholder="Bairro" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Cidade</label>
                      <input type="text" value={addressData.city} onChange={e => setAddressData({ ...addressData, city: e.target.value })} className={INPUT} placeholder="Cidade" autoComplete="address-level2" />
                    </div>
                    <div>
                      <label className={LABEL}>Estado</label>
                      <input type="text" value={addressData.state} onChange={e => setAddressData({ ...addressData, state: e.target.value.toUpperCase() })} className={INPUT} placeholder="UF" maxLength={2} autoComplete="address-level1" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-zinc-300 text-sm bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCreatePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 text-white py-3.5 font-bold text-sm uppercase tracking-widest rounded-lg hover:from-yellow-500 hover:via-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  {isLoading ? <><Loader2 size={18} className="animate-spin" /> Gerando QR Code...</> : '🏆 Garanta Já - Copa 2026 🏆'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-white p-5 rounded-2xl inline-block mb-5 shadow-lg">
                {qrCodeImage ? (
                  <img src={qrCodeImage} alt="QR Code PIX" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-zinc-100 rounded-lg">
                    <QrCode size={64} className="text-zinc-400" />
                  </div>
                )}
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-zinc-400 text-sm">
                  Valor: <span className="text-white font-bold">R$&nbsp;{total.toFixed(2).replace('.', ',')}</span>
                </p>
                {expiresAt && (
                  <p className="text-zinc-500 text-sm">
                    Expira em: {new Date(expiresAt).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              {pixCode && (
                <div className="mb-6 text-left">
                  <label className={LABEL}>Código PIX copia e cola</label>
                  <div className="flex gap-2">
                    <input type="text" value={pixCode} readOnly className={`${INPUT} text-xs`} />
                    <button onClick={handleCopyPix} className="bg-zinc-800 hover:bg-zinc-700 px-3 rounded-lg transition-colors shrink-0" aria-label="Copiar código">
                      {copied ? <Check size={16} className="text-zinc-200" /> : <Copy size={16} className="text-zinc-400" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-zinc-800/60 border border-zinc-700 p-4 rounded-xl mb-6 text-left">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  📱 Abra seu app do banco, escaneie o QR Code ou copie o código PIX para concluir o pagamento.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
