import type { PublicConfig } from "@demo/shared";
import { api } from "../api";
import type { PaymentContext, PaymentIntegration } from "./PaymentIntegration";

export class HostedCheckoutIntegration implements PaymentIntegration {
  readonly kind = "hosted_checkout" as const;
  readonly label = "Hosted payment page/redirect Checkout";

  constructor(_config: PublicConfig) {}

  async start(context: PaymentContext): Promise<void> {
    if (!context.localOrderId) {
      throw new Error("Hosted payment page/redirect Checkout requires a local order.");
    }
    const result = await api.createHosted(context.localOrderId);
    window.location.assign(result.checkoutUrl);
  }

  destroy(): void {}
}
