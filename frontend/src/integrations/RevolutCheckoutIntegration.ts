import RevolutCheckout from "@revolut/checkout";
import type { PublicConfig } from "@demo/shared";
import { api } from "../api";
import type { PaymentContext, PaymentIntegration } from "./PaymentIntegration";

export class RevolutCheckoutIntegration implements PaymentIntegration {
  readonly kind = "revolut_checkout" as const;
  readonly label = "Revolut Checkout";
  private destroyWidget: (() => void) | null = null;

  constructor(private readonly config: PublicConfig) {}

  async start(context: PaymentContext): Promise<void> {
    if (!context.target) {
      throw new Error("Embedded checkout requires a mount target.");
    }
    if (!this.config.revolutPublicKey) {
      throw new Error("REVOLUT_PUBLIC_KEY is required for Revolut Checkout.");
    }

    const instance = await RevolutCheckout.embeddedCheckout({
      publicToken: this.config.revolutPublicKey,
      mode: this.config.revolutMode,
      locale: "en",
      target: context.target,
      email: context.email,
      createOrder: async () => {
        const order = await api.createEmbedded(context.localOrderId);
        return { publicId: order.token };
      },
      onSuccess: ({ orderId }) => {
        window.location.assign(`/order/${context.localOrderId}/return?revolutOrder=${orderId}`);
      },
      onError: () => {
        window.location.assign(`/order/${context.localOrderId}/failure`);
      },
      onCancel: () => {
        window.location.assign(`/order/${context.localOrderId}/failure?reason=cancelled`);
      },
    });
    this.destroyWidget = instance.destroy;
  }

  destroy(): void {
    this.destroyWidget?.();
    this.destroyWidget = null;
  }
}
