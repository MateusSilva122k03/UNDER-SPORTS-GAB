import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import ProductGridItem from './components/ProductGridItem';
import ProductCarousel from './components/ProductCarousel';
import Banner from './components/Banner';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import WhatsAppButton from './components/WhatsAppButton';
import CopaEliteSection from './components/CopaEliteSection';
import { categories } from './data/products_categorized';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = useMemo(() => categories.flatMap(cat => cat.products), []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.name.toLowerCase().split(' ').some((w: string) => w.includes(query))
    );
  }, [searchQuery, allProducts]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index);
    setSearchQuery('');
  };

  const currentCategory  = categories[activeCategory];
  const shuffledProducts = useMemo(
    () => [...currentCategory.products].sort(() => Math.random() - 0.5),
    [currentCategory.products]
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white selection:text-black">
      <Cart />
      <WhatsAppButton />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
              />

              <main className="flex-1">
                {/* Hero banner - oculto na seção da copa ou pesquisa para dar mais destaque ao tema */}
                {!isSearching && currentCategory.key !== 'copa_mundo_2026' && (
                  <Banner
                    image="/banner1.jpg"
                    image2="/banner2.jpg"
                    image3="/banner3.jpg"
                    alt="Copa do Mundo 2026 — Coleção Exclusiva"
                    alt2="Bravio — Coleção 2026"
                    alt3="Bravio — Modelos Exclusivos"
                    className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px]"
                  />
                )}

                {isSearching ? (
                  /* Search results */
                  <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="mb-16">
                      <h2 className="text-4xl lg:text-6xl font-bold uppercase tracking-tighter mb-4">
                        Resultados para &ldquo;{searchQuery}&rdquo;
                      </h2>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                        {filteredProducts?.length || 0} Peça(s) Encontrada(s)
                      </p>
                    </div>

                    {filteredProducts && filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {filteredProducts.map((product, index) => (
                          <ProductGridItem
                            key={product.id || index}
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-32 border-t border-white/5">
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Nenhuma peça corresponde à sua busca</p>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="mt-8 text-[11px] font-bold uppercase tracking-widest border-b border-white/10 hover:border-white pb-1 transition-all"
                        >
                          Limpar Busca
                        </button>
                      </div>
                    )}
                  </div>

                ) : currentCategory.products.length === 0 ? (
                  <div className="text-center py-32">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Novidades Chegando em Breve</p>
                  </div>

                ) : currentCategory.key === 'copa_mundo_2026' ? (
                  <CopaEliteSection products={shuffledProducts} />
                ) : (
                  <div className="space-y-24 py-20">
                    <ProductCarousel
                      title={currentCategory.name}
                      products={shuffledProducts.slice(0, 20)}
                    />
                    <ProductGrid
                      title="O Acervo"
                      products={shuffledProducts.slice(20)}
                    />
                  </div>
                )}
              </main>

              <Footer />
            </>
          }
        />

        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}
