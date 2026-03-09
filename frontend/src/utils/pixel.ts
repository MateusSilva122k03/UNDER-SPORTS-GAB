/**
 * Utility para rastrear eventos no Facebook Pixel e UTMify
 */

// Declaração global para o Facebook Pixel
declare global {
  interface Window {
    fbq: any;
    pixelId: string;
    utms: any;
  }
}

/**
 * Dispara um evento customizado para o Facebook Pixel
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Pixel] Evento disparado: ${eventName}`, params);
  } else {
    console.warn(`[Pixel] Facebook Pixel não disponível para evento: ${eventName}`);
  }
}

/**
 * Dispara evento PageView (útil para SPA)
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
    console.log('[Pixel] PageView disparado');
  }
}

/**
 * Dispara evento ViewContent - quando um produto é visualizado
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  trackEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: 'BRL',
    content_type: 'product',
    category: product.category,
  });
}

/**
 * Dispara evento AddToCart - quando um produto é adicionado ao carrinho
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}) {
  trackEvent('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price * product.quantity,
    currency: 'BRL',
    contents: [
      {
        id: product.id,
        quantity: product.quantity,
        item_price: product.price,
        size: product.size,
      },
    ],
  });
}

/**
 * Dispara evento InitiateCheckout - quando o checkout é iniciado
 */
export function trackInitiateCheckout(cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
  }>;
  total: number;
}) {
  trackEvent('InitiateCheckout', {
    value: cart.total,
    currency: 'BRL',
    contents: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
      size: item.size,
    })),
    num_items: cart.items.length,
  });
}

/**
 * Dispara evento Purchase - quando a compra é finalizada
 */
export function trackPurchase(order: {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}) {
  trackEvent('Purchase', {
    value: order.total,
    currency: 'BRL',
    contents: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    num_items: order.items.length,
    order_id: order.orderId,
  });
}

/**
 * Dispara evento Lead - quando um lead é capturado
 */
export function trackLead(source?: string) {
  trackEvent('Lead', {
    source: source || 'website',
  });
}

/**
 * Dispara evento CompleteRegistration - quando há registro/cadastro
 */
export function trackCompleteRegistration() {
  trackEvent('CompleteRegistration', {
    currency: 'BRL',
  });
}
