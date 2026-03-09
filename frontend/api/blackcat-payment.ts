export const config = {
  runtime: 'edge',
};

const BLACKCAT_API_URL = 'https://api.blackcatpay.com.br/api';
const BLACKCAT_API_KEY = process.env.BLACKCAT_SECRET_KEY;

interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { items, customer, address } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Items are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.document) {
      return new Response(JSON.stringify({ 
        error: 'Customer data is required: name, email, phone, document' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!address || !address.cep || !address.city || !address.state) {
      return new Response(JSON.stringify({ 
        error: 'Endereço de entrega é obrigatório para produtos físicos' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const totalAmount = items.reduce((sum: number, item: CartItem) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const documentType = customer.document.length === 11 ? 'cpf' : 'cnpj';

    const payload: Record<string, unknown> = {
      amount: totalAmount,
      currency: 'BRL',
      paymentMethod: 'pix',
      items: items.map((item: CartItem) => ({
        title: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        tangible: true
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone.replace(/\D/g, ''),
        document: {
          number: customer.document.replace(/\D/g, ''),
          type: documentType
        }
      },
      shipping: {
        name: customer.name,
        street: address.street || '',
        number: address.number || '1',
        complement: address.complement || '',
        neighborhood: address.neighborhood || '',
        city: address.city,
        state: address.state,
        zipCode: address.cep.replace(/\D/g, '')
      },
      pix: {
        expiresInDays: 1
      },
      externalRef: `ORDER-${Date.now()}`,
      metadata: 'Compra via Bravio Ecommerce'
    };

    const response = await fetch(`${BLACKCAT_API_URL}/sales/create-sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLACKCAT_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return new Response(JSON.stringify({ 
        error: data.message || data.error || 'Failed to create payment',
        details: data
      }), {
        status: response.status || 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      transactionId: data.data.transactionId,
      status: data.data.status,
      amount: data.data.amount,
      netAmount: data.data.netAmount,
      fees: data.data.fees,
      invoiceUrl: data.data.invoiceUrl,
      paymentData: data.data.paymentData,
      createdAt: data.data.createdAt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('BlackCat payment error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
