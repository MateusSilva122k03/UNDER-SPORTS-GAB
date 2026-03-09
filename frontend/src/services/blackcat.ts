const API_BASE_URL = '/api/blackcat-payment';

export interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string;
}

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface BlackCatPaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  amount: number;
  netAmount?: number;
  fees?: number;
  invoiceUrl?: string;
  paymentData?: {
    qrCode?: string;
    qrCodeBase64?: string;
    copyPaste?: string;
    expiresAt?: string;
  };
  createdAt?: string;
  error?: string;
}

class BlackCatService {
  async createPixPayment(
    items: CartItem[],
    customer: CustomerData,
    address?: AddressData
  ): Promise<BlackCatPaymentResponse> {
    const payload = {
      items,
      customer,
      address,
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Erro ao criar pagamento');
    }

    return data;
  }

  async getPaymentStatus(transactionId: string): Promise<BlackCatPaymentResponse> {
    const response = await fetch(`${API_BASE_URL}/status/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao consultar pagamento');
    }

    return data;
  }
}

export const blackcatService = new BlackCatService();
export default blackcatService;
