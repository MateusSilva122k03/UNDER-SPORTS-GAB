import { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutPix from './CheckoutPix';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] font-body">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-black border-l border-white/5 flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)]"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-8 border-b border-white/5">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Seleção do Acervo</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold uppercase tracking-tighter">Sua Sacola</span>
                  {items.length > 0 && (
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      [{items.length} {items.length === 1 ? 'Peça' : 'Peças'}]
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 hide-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={1} className="text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">O Acervo está Vazio</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] font-bold uppercase tracking-widest text-white border-b border-white/10 hover:border-white pb-1 transition-all"
                    >
                      Explorar Coleção
                    </button>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-6 group"
                  >
                    <div className="w-24 h-32 bg-[#0A0A0A] shrink-0 border border-white/5 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-white/90 line-clamp-2 leading-relaxed">{item.name}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-white/10 hover:text-red-500 transition-colors shrink-0"
                            aria-label="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tamanho: {item.size}</p>
                        {item.isGift && (
                          <span className="inline-block text-[8px] font-black uppercase tracking-widest text-green-500 mt-1">Peça Cortesia</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-white transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[11px] font-black w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-white transition-colors"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-[11px] font-black uppercase tracking-widest">
                          {item.price === 0 ? 'GRÁTIS' : `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-10 border-t border-white/5 bg-[#050505] space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Subtotal</span>
                    <span className="text-[12px] font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Valor Total do Acervo</span>
                    <span className="text-2xl font-black tracking-tighter">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-white text-black py-5 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-black hover:text-white border border-white transition-all duration-500"
                  >
                    Finalizar Compra
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-white/20 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2"
                  >
                    Continuar Explorando
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Checkout Pix modal */}
          <CheckoutPix
            isOpen={showCheckout}
            onClose={() => {
              setShowCheckout(false);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
