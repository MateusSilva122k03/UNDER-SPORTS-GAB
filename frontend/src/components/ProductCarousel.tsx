import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';

interface ProductCarouselProps {
  title: string;
  products: any[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
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
    <section className="py-20 bg-black text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title={title} className="mb-12" />

        <div className="relative group">
          {/* Controls - Visíveis em mobile e desktop, posicionados nos cantos da tela */}
          <div className="absolute top-[40%] -left-2 lg:-left-6 -translate-y-1/2 z-20">
             <button
              onClick={() => scroll('left')}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-black/50 backdrop-blur-xl border border-white/10 hover:border-white flex items-center justify-center transition-all text-white/80 hover:text-black hover:bg-white rounded-full shadow-2xl"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} strokeWidth={1.5} className="ml-[-2px]" />
            </button>
          </div>
          
          <div className="absolute top-[40%] -right-2 lg:-right-6 -translate-y-1/2 z-20">
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-black/50 backdrop-blur-xl border border-white/10 hover:border-white flex items-center justify-center transition-all text-white/80 hover:text-black hover:bg-white rounded-full shadow-2xl"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} strokeWidth={1.5} className="mr-[-2px]" />
            </button>
          </div>

          {/* Carousel track (Suporta Swipe Mobile nativo via CSS Snap) */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 lg:gap-8 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {products.map((product, index) => (
              <div
                key={product.id || index}
                className="snap-start shrink-0 w-[220px] sm:w-[260px] md:w-[280px] lg:w-[320px]"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
