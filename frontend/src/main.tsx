import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import App from './App.tsx';
import './index.css';
import { trackPageView } from './utils/pixel';

// Componente para rastrear pageviews no Facebook Pixel
function PixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Dispara evento de pageview quando a rota muda (SPA)
    trackPageView();
  }, [location]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <PixelTracker />
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
