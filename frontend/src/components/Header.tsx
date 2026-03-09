import { type FormEvent, type ChangeEvent, useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { categories } from '../data/products_categorized';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeCategory: number;
  onCategoryChange: (index: number) => void;
  onSearch?: (query: string) => void;
}

export default function Header({ activeCategory, onCategoryChange, onSearch }: HeaderProps) {
  const { setIsOpen, itemCount, isOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setShowSearch(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-0'
          : 'bg-black py-2'
      }`}
    >
      {/* Premium Marquee */}
      <div className="bg-white py-1.5 overflow-hidden border-b border-white/10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="whitespace-nowrap flex items-center"
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="text-black text-[9px] font-bold uppercase mx-12 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1 h-1 bg-black rounded-full" />
              Frete Grátis em todos os produtos
              <span className="w-1 h-1 bg-black rounded-full" />
              Coleção Copa 2026
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-24 transition-all duration-500">
          
          {/* Menu Button - Mobile */}
          <button
            className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo - Centered on Mobile, Left on Desktop */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center cursor-pointer absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0"
            onClick={() => navigate('/')}
          >
            <img src="/Logo-Under.svg" alt="Under Sports" className="h-8 lg:h-10 w-auto brightness-200" />
          </motion.div>

          {/* Nav - Desktop */}
          <nav className="hidden lg:flex items-center gap-8 ml-12">
            {categories.map((cat, index) => {
              const isActive = activeCategory === index;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    onCategoryChange(index);
                    if (onSearch) onSearch('');
                    setSearchQuery('');
                  }}
                  className={`relative group py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                    isActive ? 'text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {cat.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden lg:block relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="BUSCAR"
                className="bg-transparent border-b border-white/10 focus:border-white/40 text-[10px] tracking-widest text-white px-0 py-1 w-24 focus:w-48 transition-all duration-500 outline-none placeholder:text-white/20 uppercase font-bold"
              />
              <Search size={14} className="absolute right-0 top-1.5 text-white/20 group-focus-within:text-white transition-colors" />
            </div>

            <button className="p-2 text-white/50 hover:text-white transition-colors">
              <User size={18} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 text-white/50 hover:text-white transition-colors"
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1 right-1 bg-white text-black text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-0 top-[110px] bg-black z-40 px-6 py-12"
          >
            <div className="flex flex-col gap-8">
              {categories.map((cat, index) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    onCategoryChange(index);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-2xl font-bold uppercase tracking-tighter text-left ${
                    activeCategory === index ? 'text-white' : 'text-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
