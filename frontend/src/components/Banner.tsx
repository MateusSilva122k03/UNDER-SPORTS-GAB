import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BannerProps {
  image: string;
  image2?: string;
  image3?: string;
  alt: string;
  alt2?: string;
  alt3?: string;
  className?: string;
}

export default function Banner({ image, image2, image3, alt, alt2, alt3, className = '' }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = [image, image2, image3].filter(Boolean) as string[];
  const alts   = [alt, alt2, alt3];

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  if (images.length === 0) return null;

  const prev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((p) => (p + 1) % images.length);

  return (
    <div
      className={`w-full overflow-hidden relative bg-black group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center'
          }}
          role="img"
          aria-label={alts[currentIndex] || alt}
        >
          {/* Vinheta leve para não deixar a imagem crua, mas sem os textos sobrepostos */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 hover:border-white/40 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={20} strokeWidth={1} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 hover:border-white/40 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md"
            aria-label="Próximo slide"
          >
            <ChevronRight size={20} strokeWidth={1} />
          </button>
        </>
      )}

      {/* Progressive indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group py-2"
          >
            <div className={`h-0.5 rounded-full transition-all duration-700 ${
              index === currentIndex
                ? 'bg-white w-12'
                : 'bg-white/20 hover:bg-white/40 w-4'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
