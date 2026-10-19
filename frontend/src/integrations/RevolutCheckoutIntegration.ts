import RevolutCheckout from "@revolut/checkout";
import type { PublicConfig } from "@demo/shared";
import { api } from "../api";
import type { PaymentContext, PaymentIntegration } from "./PaymentIntegration";

export class RevolutCheckoutIntegration implements PaymentIntegration {
  readonly kind = "revolut_checkout" as const;
  readonly label = "Embedded Checkout";
  private destroyWidget: (() => void) | null = null;
  private generation = 0;
  private localOrderTask: Promise<string> | null = null;

  constructor(private readonly config: PublicConfig) {}

  async start(context: PaymentContext): Promise<void> {
    if (!context.target) {
      throw new Error("Embedded Checkout requires a mount target.");
    }
    if (!this.config.revolutPublicKey) {
      throw new Error("REVOLUT_PUBLIC_KEY is required for Embedded Checkout.");
    }

    const generation = ++this.generation;
    this.localOrderTask = context.localOrderId ? Promise.resolve(context.localOrderId) : null;

    const instance = await RevolutCheckout.embeddedCheckout({
      publicToken: this.config.revolutPublicKey,
      mode: this.config.revolutMode,
      locale: "en",
      target: context.target,
      email: context.email,
      createOrder: async () => {
        const localOrderId = await this.resolveLocalOrderId(context);
        const order = await api.createEmbedded(localOrderId);
        return { publicId: order.token };
      },
      onSuccess: ({ orderId }) => {
        console.log("Payment successful!", orderId);
        window.location.href = "/confirmation";
      },
      onError: ({ error, orderId }) => {
        console.error("Payment failed:", error.message, orderId);
        alert(`Payment failed: ${error.message}`);
        context.onPaymentError?.(error.message || "Payment failed");
      },
      onCancel: ({ orderId }) => {
        console.log("Payment cancelled", orderId);
        alert("Payment was cancelled.");
        context.onPaymentCancel?.();
      },
    });

    if (generation !== this.generation) {
      instance.destroy();
      return;
    }
    this.destroyWidget = instance.destroy;
  }

  destroy(): void {
    this.generation += 1;
    this.destroyWidget?.();
    this.destroyWidget = null;
    this.localOrderTask = null;
  }

  private resolveLocalOrderId(context: PaymentContext): Promise<string> {
    if (!this.localOrderTask) {
      if (!context.ensureLocalOrder) {
        return Promise.reject(new Error("Embedded Checkout is missing a merchant order."));
      }
      const task = context.ensureLocalOrder();
      this.localOrderTask = task;
      task.catch(() => {
        if (this.localOrderTask === task) this.localOrderTask = null;
      });
    }
    return this.localOrderTask;
  }
}
