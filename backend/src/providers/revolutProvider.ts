export interface RevolutOrderResult {
  id: string;
  token: string;
  checkoutUrl?: string;
  state: string;
}

export interface CreateRevolutOrderInput {
  amountMinor: number;
  currency: string;
  description: string;
  merchantReference: string;
  customerEmail: string;
  redirectUrl?: string;
}

export interface RevolutProvider {
  createOrder(input: CreateRevolutOrderInput): Promise<RevolutOrderResult>;
  retrieveOrder(revolutOrderId: string): Promise<RevolutOrderResult>;
}
