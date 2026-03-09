import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Check, Truck, Shield, RotateCcw, Gift, X, Search } from 'lucide-react';
import { categories, Product } from '../data/products_categorized';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { trackViewContent, trackAddToCart } from '../utils/pixel';

interface Size {
  label: string;
  available: boolean;
}

const SIZES: Size[] = [
  { label: 'P',   available: true },
  { label: 'M',   available: true },
  { label: 'G',   available: true },
  { label: 'GG',  available: true },
  { label: 'XG',  available: true },
  { label: 'XXG', available: true },
];

const allProducts: Product[] = categories.flatMap(cat => cat.products);

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity]         = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite]     = useState(false);
  const [sizeError, setSizeError]       = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  
  const [promoType, setPromoType] = useState<'none' | '1x1' | '2x2'>('none');
  const [selectedGift, setSelectedGift] = useState<Product | null>(null);
  const [selectedGiftSize, setSelectedGiftSize] = useState<string>('');
  const [giftSearch, setGiftSearch] = useState('');

  const availableGifts = allProducts.filter(p => p.id !== id).filter(p => 
    giftSearch === '' || p.name.toLowerCase().includes(giftSearch.toLowerCase())
  ).slice(0, 20);

  let product: { id: string; name: string; price: number; image: string; category: string; originalPrice?: number } | null = null;
  for (const cat of categories) {
    const found = cat.products.find(p => p.id === id);
    if (found) { product = found; break; }
  }

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [id]);

  // Rastreia visualização do produto quando product for definido
  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      });
    }
  }, [product?.id, product?.name, product?.price, product?.category]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-body">
        <div className="text-center">
          <p className="text-white/40 text-lg mb-8 uppercase tracking-widest font-bold">Peça não encontrada</p>
          <button onClick={() => navigate('/')} className="bg-white text-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white border border-white transition-all">
            Voltar ao Acervo
          </button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productImages = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2200);
      return;
    }
    
    if (promoType !== 'none' && !selectedGiftSize) {
      return;
    }
    
    setSizeError(false);
    const finalQuantity = promoType === '2x2' ? Math.max(2, quantity) : quantity;
    const giftQuantity = finalQuantity;
    const mainItemId = `${product!.id}-${selectedSize}-${Date.now()}`;
    
    addItem({
      id: mainItemId,
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      image: product!.image,
      size: selectedSize,
      quantity: finalQuantity,
    });
    
    // Rastreia adição ao carrinho
    trackAddToCart({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      quantity: finalQuantity,
      size: selectedSize,
    });
    
    if (promoType !== 'none' && selectedGift) {
      addItem({
        id: `${selectedGift.id}-${selectedGiftSize}-${Date.now()}-gift`,
        productId: selectedGift.id,
        name: selectedGift.name,
        price: 0,
        image: selectedGift.image,
        size: selectedGiftSize,
        quantity: giftQuantity,
        isGift: true,
        giftOfId: mainItemId,
      });
    }
    
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-body">

      {/* Luxury Minimal Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar</span>
          </button>

          <span className="text-[11px] font-black uppercase tracking-[0.4em] hidden sm:block">Exclusividade Bravio</span>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 transition-colors ${isFavorite ? 'text-white' : 'text-white/20 hover:text-white'}`}
          >
            <Heart size={18} strokeWidth={1.5} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left: Image gallery (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="aspect-[4/5] bg-[#0A0A0A] overflow-hidden border border-white/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-24 shrink-0 bg-[#0A0A0A] border transition-all duration-500 ${
                    selectedImage === index ? 'border-white' : 'border-white/5 opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} — ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product info (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-10"
          >

            {/* Title & Price */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                  {categories.find(c => c.key === product?.category)?.name || 'Acervo'}
                </span>
                {discount > 0 && (
                  <span className="bg-white text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
                    -{discount}% Limitada
                  </span>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold uppercase tracking-tighter leading-none font-sans">{product.name}</h1>
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-2xl font-bold">
                  R$&nbsp;{product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice && (
                  <span className="text-white/20 text-lg line-through font-medium">
                    R$&nbsp;{product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>

            {/* Size selection */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Selecionar Tamanho</span>
                <button className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors border-b border-white/10 pb-1">
                  Guia de Medidas
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => { if (size.available) { setSelectedSize(size.label); setSizeError(false); } }}
                    disabled={!size.available}
                    className={`h-12 border font-bold text-[11px] transition-all duration-500 ${
                      selectedSize === size.label
                        ? 'border-white bg-white text-black'
                        : size.available
                        ? `border-white/10 hover:border-white/40 text-white ${sizeError ? 'border-red-500 animate-pulse' : ''}`
                        : 'border-white/5 text-white/10 cursor-not-allowed overflow-hidden relative'
                    }`}
                  >
                    {size.label}
                    {!size.available && <div className="absolute inset-0 bg-white/5 backdrop-grayscale rotate-45 scale-150" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Quantidade</span>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-white/10 hover:border-white flex items-center justify-center transition-colors group"
                >
                  <Minus size={14} className="group-active:scale-90" />
                </button>
                <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-white/10 hover:border-white flex items-center justify-center transition-colors group"
                >
                  <Plus size={14} className="group-active:scale-90" />
                </button>
              </div>
            </div>

            {/* Promotions */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Ofertas Especiais</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (promoType === '1x1') { setPromoType('none'); setSelectedGift(null); }
                    else { setPromoType('1x1'); }
                  }}
                  className={`p-6 border text-left transition-all duration-500 relative overflow-hidden ${
                    promoType === '1x1' ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <Gift size={20} className={`mb-4 ${promoType === '1x1' ? 'text-white' : 'text-white/20'}`} />
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1">Pague 1 Leve 2</p>
                  <p className="text-[10px] text-white/40 font-bold">Escolha sua peça cortesia</p>
                  {promoType === '1x1' && <motion.div layoutId="promoCheck" className="absolute top-4 right-4"><Check size={16} /></motion.div>}
                </button>

                <button
                  onClick={() => {
                    if (promoType === '2x2') { setPromoType('none'); setSelectedGift(null); }
                    else { setPromoType('2x2'); setQuantity(Math.max(2, quantity)); }
                  }}
                  className={`p-6 border text-left transition-all duration-500 relative overflow-hidden ${
                    promoType === '2x2' ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <Gift size={20} className={`mb-4 ${promoType === '2x2' ? 'text-white' : 'text-white/20'}`} />
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1">Pague 2 Leve 4</p>
                  <p className="text-[10px] text-white/40 font-bold">Duplique seu acervo hoje</p>
                  {promoType === '2x2' && <motion.div layoutId="promoCheck" className="absolute top-4 right-4"><Check size={16} /></motion.div>}
                </button>
              </div>

              {/* Gift Selector */}
              <AnimatePresence>
                {promoType !== 'none' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4 pt-4"
                  >
                    {!selectedGift ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                            type="text"
                            placeholder="BUSCAR PEÇA CORTESIA"
                            value={giftSearch}
                            onChange={(e) => setGiftSearch(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/5 py-3 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-white/20 outline-none"
                          />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                          {availableGifts.map((gift) => (
                            <button
                              key={gift.id}
                              onClick={() => setSelectedGift(gift)}
                              className="shrink-0 w-24 space-y-2 group"
                            >
                              <div className="aspect-square bg-[#0A0A0A] overflow-hidden border border-white/5 group-hover:border-white/20">
                                <img src={gift.image} alt={gift.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              </div>
                              <p className="text-[8px] font-black uppercase tracking-widest line-clamp-1 text-white/40">{gift.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 border border-white/10 bg-[#0A0A0A] space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img src={selectedGift.image} className="w-12 h-12 object-cover" alt="" />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Cortesia</p>
                              <p className="text-[10px] font-bold uppercase">{selectedGift.name}</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedGift(null)} className="text-white/20 hover:text-white transition-colors"><X size={16} /></button>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {SIZES.map((size) => (
                            <button
                              key={`gift-${size.label}`}
                              onClick={() => setSelectedGiftSize(size.label)}
                              className={`h-10 border text-[10px] font-bold transition-all ${
                                selectedGiftSize === size.label ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Final Action */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-6 font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all duration-500 ${
                addedFeedback
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white border border-white'
              }`}
            >
              {addedFeedback ? <><Check size={18} /> Peça Adicionada</> : <><ShoppingCart size={18} /> Adicionar ao Acervo</>}
            </button>

            {/* Benefits & Details */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
              {[
                { icon: Truck,      text: 'Frete Global' },
                { icon: Shield,     text: 'Cofre Seguro' },
                { icon: RotateCcw,  text: 'Termos de Troca' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-3 text-center opacity-30 hover:opacity-100 transition-opacity">
                  <Icon size={16} strokeWidth={1.5} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-10 border-t border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Notas de Coleção</h3>
              <div className="space-y-3">
                {[
                  'Tecido atlético de nível profissional',
                  'Respirabilidade de precisão',
                  'Detalhes de clube em alta definição',
                  'Ciclo de lançamento limitado',
                ].map((detail) => (
                  <div key={detail} className="flex items-center gap-3 text-white/60 text-[11px] font-medium tracking-wide">
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <AnimatePresence>
        {!addedFeedback && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 safe-area-pb"
          >
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              <ShoppingCart size={16} /> Adicionar ao Acervo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
