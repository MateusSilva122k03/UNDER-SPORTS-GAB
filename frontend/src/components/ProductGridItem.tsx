import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface ProductGridItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
}

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23050505' width='400' height='500'/%3E%3Ctext fill='%23333' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle'%3ESem imagem%3C/text%3E%3C/svg%3E";

export default function ProductGridItem({ id, name, image, price }: ProductGridItemProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => navigate(`/product/${id}`);

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer relative flex flex-col"
    >
      {/* Image Container */}
      <div className="aspect-[3/4] bg-[#0A0A0A] relative overflow-hidden mb-4 border border-white/5 transition-colors group-hover:border-white/20">
        <motion.img
          src={imageError ? FALLBACK : image}
          alt={name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Hover Action Overlay (visual apenas) */}
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

        {/* Badge - Example for Exclusive items */}
        {name.toLowerCase().includes('copa') && (
          <div className="absolute top-3 left-3 bg-white text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-widest z-10">
            Exclusivo
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-[11px] lg:text-[12px] font-bold uppercase tracking-wider text-white/90 group-hover:text-white transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="text-[10px] lg:text-[11px] font-medium tracking-[0.1em] text-white/40">
          R$&nbsp;{price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </motion.div>
  );
}
