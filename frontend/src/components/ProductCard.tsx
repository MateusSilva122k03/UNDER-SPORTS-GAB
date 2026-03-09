import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  id?: string;
  name?: string;
  image: string;
  title?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23050505' width='400' height='500'/%3E%3Ctext fill='%23333' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle'%3ESem imagem%3C/text%3E%3C/svg%3E";

export default function ProductCard({
  id,
  name,
  image,
  title,
  price,
  originalPrice,
  discount,
}: ProductCardProps) {
  const displayTitle = title || name || 'Produto';
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : discount;

  const to = id ? `/product/${id}` : '#';
  const handleClick = () => { if (id) navigate(to); };

  return (
    <motion.div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col group cursor-pointer relative"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A] mb-4 border border-white/5 transition-colors group-hover:border-white/20">
        <motion.img
          src={imageError ? FALLBACK : image}
          alt={displayTitle}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Discount badge — minimalist black & white */}
        {discountPercent ? (
          <div className="absolute top-3 left-3 bg-white text-black text-[8px] font-black px-2 py-0.5 tracking-widest uppercase z-10">
            -{discountPercent}%
          </div>
        ) : null}

        {/* Hover overlay indicator (somente visual, o clique é no card todo) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-6 pointer-events-none"
            >
              <span className="text-white text-[11px] font-black uppercase tracking-[0.3em] border-b border-white pb-1 shadow-black drop-shadow-lg">
                Ver Peça
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-[11px] lg:text-[12px] font-bold uppercase tracking-wider text-white/90 group-hover:text-white transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-[10px] lg:text-[11px] font-medium tracking-[0.1em] text-white/40">
            R$&nbsp;{price.toFixed(2).replace('.', ',')}
          </p>
          {originalPrice && originalPrice > price && (
            <p className="text-[10px] lg:text-[11px] font-medium tracking-[0.1em] text-white/20 line-through">
              R$&nbsp;{originalPrice.toFixed(2).replace('.', ',')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
