import type { PublicConfig } from "@demo/shared";
import { HostedCheckoutIntegration } from "./HostedCheckoutIntegration";
import type { PaymentIntegration } from "./PaymentIntegration";
import { RevolutCheckoutIntegration } from "./RevolutCheckoutIntegration";
import type { IntegrationType } from "@demo/shared";

export function createPaymentIntegration(
  kind: IntegrationType,
  config: PublicConfig,
): PaymentIntegration {
  if (kind === "hosted_checkout") {
    return new HostedCheckoutIntegration(config);
  }
  return new RevolutCheckoutIntegration(config);
}
