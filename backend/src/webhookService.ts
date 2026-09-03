import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { config } from "./config.js";
import { log } from "./logger.js";
import { mapWebhookEvent } from "./mappers.js";
import type { OrderService } from "./orderService.js";
import type { OrderRepository, WebhookEventRepository } from "./repositories/types.js";

function extractOrderId(payload: Record<string, unknown>): string | undefined {
  const candidates = [
    payload.order_id,
    payload.orderId,
    (payload.order as Record<string, unknown> | undefined)?.id,
    payload.id,
  ];
  return candidates.find((value): value is string => typeof value === "string");
}

function extractEventType(payload: Record<string, unknown>): string {
  if (typeof payload.event === "string") return payload.event;
  if (typeof payload.event_type === "string") return payload.event_type;
  if (typeof payload.type === "string") return payload.type;
  return "UNKNOWN";
}

export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string | undefined,
  signatureHeader: string | undefined,
  secret: string,
): boolean {
  if (!timestamp || !signatureHeader) return false;
  const payloadToSign = `v1.${timestamp}.${rawBody}`;
  const digest = createHmac("sha256", secret).update(payloadToSign).digest("hex");
  const expected = `v1=${digest}`;
  const provided = signatureHeader.split(",").map((part) => part.trim());
  return provided.some((candidate) => {
    const a = Buffer.from(candidate);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  });
}

export class WebhookService {
  constructor(
    private events: WebhookEventRepository,
    private orders: OrderRepository,
    private orderService: OrderService,
  ) {}

  async handle(rawBody: string, headers: Record<string, string | undefined>) {
    let payload: Record<string, unknown> = {};
    try {
      payload = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
    } catch {
      log("error", "webhook.invalid_json", {});
      return { accepted: false };
    }

    const timestamp = headers["revolut-request-timestamp"];
    const signature = headers["revolut-signature"];
    let signatureValid: boolean | null = null;
    if (config.revolutWebhookSecret) {
      signatureValid = verifyWebhookSignature(
        rawBody,
        timestamp,
        signature,
        config.revolutWebhookSecret,
      );
      if (!signatureValid) {
        log("warn", "webhook.signature_invalid", {});
        await this.events.append({
          id: randomUUID(),
          receivedAt: new Date().toISOString(),
          eventType: extractEventType(payload),
          signatureValid: false,
          payload,
        });
        return { accepted: false };
      }
    }

    const eventType = extractEventType(payload);
    const revolutOrderId = extractOrderId(payload);
    const local =
      (revolutOrderId
        ? await this.orders.getByRevolutOrderId(revolutOrderId)
        : undefined) ??
      (typeof payload.merchant_order_ext_ref === "string"
        ? await this.orders.getById(payload.merchant_order_ext_ref)
        : undefined);

    await this.events.append({
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
      eventType,
      revolutOrderId,
      localOrderId: local?.id,
      signatureValid,
      payload,
    });

    log("info", "webhook.received", {
      eventType,
      revolutOrderId,
      localOrderId: local?.id,
      signatureValid,
    });

    const mapped = mapWebhookEvent(eventType);
    if (local && mapped) {
      await this.orderService.applyStatus(local.id, mapped, `webhook:${eventType}`);
    }

    return { accepted: true };
  }
}
