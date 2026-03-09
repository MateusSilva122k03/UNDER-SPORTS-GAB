import { ChevronLeft, ChevronRight, Trophy, Sparkles, Medal, Flame } from 'lucide-react';
import { useRef } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'motion/react';

interface CopaEliteSectionProps {
  products: any[];
}

export default function CopaEliteSection({ products }: CopaEliteSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -(clientWidth * 0.8) : clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-[#050A08] text-white relative overflow-hidden py-32 border-y border-[#FFDF00]/20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#16A34A]/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#002776]/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-[#FFDF00]/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Elite Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-[#FFDF00] mb-6"
          >
            <Trophy size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] pt-1">Edição Limitada</span>
            <Trophy size={20} strokeWidth={1.5} />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-[#FFDF00] to-[#B8860B]"
          >
            Rumo ao Hexa
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-white/60 text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] leading-relaxed"
          >
            O maior palco do futebol exige o manto perfeito. Peças originais, material de elite e a paixão de 200 milhões. Garanta a sua e faça parte da história em 2026.
          </motion.p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Sparkles, title: "Qualidade Premium", desc: "Acabamento de alto nível" },
            { icon: Medal, title: "Design Exclusivo", desc: "Detalhes únicos da copa" },
            { icon: Flame, title: "Estoque Limitado", desc: "Esgotando rapidamente" }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="flex flex-col items-center text-center p-8 border border-[#FFDF00]/10 bg-black/40 backdrop-blur-sm rounded-2xl hover:border-[#FFDF00]/40 transition-colors"
            >
              <feature.icon size={32} className="text-[#FFDF00] mb-4" strokeWidth={1.5} />
              <h3 className="text-[14px] font-black uppercase tracking-widest text-white mb-2">{feature.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Exclusive Carousel */}
        <div className="relative group mb-24">
          <div className="absolute top-1/2 -left-4 lg:-left-8 -translate-y-1/2 z-20">
            <button
              onClick={() => scroll('left')}
              className="w-14 h-14 bg-black/80 backdrop-blur-xl border border-[#FFDF00]/20 hover:border-[#FFDF00] hover:bg-[#FFDF00] hover:text-black flex items-center justify-center rounded-full transition-all text-[#FFDF00] shadow-[0_0_30px_rgba(255,223,0,0.1)]"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} strokeWidth={1.5} className="ml-[-2px]" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 lg:-right-8 -translate-y-1/2 z-20">
            <button
              onClick={() => scroll('right')}
              className="w-14 h-14 bg-black/80 backdrop-blur-xl border border-[#FFDF00]/20 hover:border-[#FFDF00] hover:bg-[#FFDF00] hover:text-black flex items-center justify-center rounded-full transition-all text-[#FFDF00] shadow-[0_0_30px_rgba(255,223,0,0.1)]"
              aria-label="Próximo"
            >
              <ChevronRight size={24} strokeWidth={1.5} className="mr-[-2px]" />
            </button>
          </div>

          {/* Carousel track */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {products.slice(0, 15).map((product, index) => (
              <div
                key={product.id || index}
                className="snap-center shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px]"
              >
                <div className="relative p-[1px] rounded-xl bg-gradient-to-b from-[#FFDF00]/40 via-transparent to-transparent hover:from-[#FFDF00] transition-colors duration-500">
                  <div className="bg-black rounded-xl p-4 h-full">
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      price={product.price}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Archive Grid for Copa */}
        <div className="pt-24 border-t border-[#FFDF00]/20">
          <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-center mb-16 text-white">Acervo Completo da Copa</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            {products.slice(15).map((product, index) => (
              <ProductCard
                key={product.id || index}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
