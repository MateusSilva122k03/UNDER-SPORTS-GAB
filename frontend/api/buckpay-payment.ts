export const config = {
  runtime: 'edge',
};

const BUCKPAY_API_URL = 'https://api.realtechdev.com.br/v1';
const BUCKPAY_TOKEN = process.env.BUCKPAY_TOKEN;
const USER_AGENT = 'Buckpay API';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { items, customer } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Itens do carrinho são obrigatórios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!customer || !customer.name || !customer.email || !customer.document) {
      return new Response(JSON.stringify({ 
        error: 'Dados do cliente são obrigatórios: nome, e-mail e documento' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const firstItem = items[0];
    
    const payload = {
      external_id: `ORDER-${Date.now()}`,
      payment_method: 'pix',
      amount: totalAmount,
      buyer: {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ''),
        phone: customer.phone ? customer.phone.replace(/\D/g, '') : undefined
      },
      product: {
        id: firstItem.id || 'order-summary',
        name: items.length > 1 ? `${firstItem.name} + ${items.length - 1} itens` : firstItem.name
      },
      offer: {
        id: 'standard',
        name: 'Venda Ecommerce',
        quantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0)
      }
    };

    console.log('Sending payload to Buckpay:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${BUCKPAY_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BUCKPAY_TOKEN}`,
        'User-Agent': USER_AGENT
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Buckpay API error:', data);
      return new Response(JSON.stringify({ 
        error: data.error?.message || data.message || 'Falha ao criar pagamento na Buckpay',
        details: data
      }), {
        status: response.status || 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Adapt Buckpay response to our frontend format (compatible with BlackCat response structure used in CheckoutPix)
    return new Response(JSON.stringify({
      success: true,
      transactionId: data.data.id,
      status: data.data.status,
      amount: data.data.total_amount,
      paymentData: {
        copyPaste: data.data.pix.code,
        qrCodeBase64: data.data.pix.qrcode_base64,
        expiresAt: new Date(new Date(data.data.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString() // Default 24h if not specified
      },
      createdAt: data.data.created_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Buckpay payment error:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno no servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
