const API_BASE_URL = '/api/buckpay-payment';

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

export interface BuckpayPaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  amount: number;
  paymentData?: {
    qrCodeBase64?: string;
    copyPaste?: string;
    expiresAt?: string;
  };
  createdAt?: string;
  error?: string;
}

class BuckpayService {
  async createPixPayment(
    items: CartItem[],
    customer: CustomerData
  ): Promise<BuckpayPaymentResponse> {
    const payload = {
      items,
      customer,
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
      throw new Error(data.error || data.message || 'Erro ao criar pagamento na Buckpay');
    }

    return data;
  }
}

export const buckpayService = new BuckpayService();
export default buckpayService;
