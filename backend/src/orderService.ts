import { randomUUID } from "node:crypto";
import {
  computeOrderAmountMinor,
  PRODUCT,
  type CreateOrderRequest,
  type PaymentStatus,
} from "@demo/shared";
import { assertLiveModeReady, hostedCheckoutRedirectUrl } from "./config.js";
import type { StoredOrder } from "./domain.js";
import { log } from "./logger.js";
import { mapRevolutState, toPublicOrder } from "./mappers.js";
import type { RevolutProvider } from "./providers/revolutProvider.js";
import type { OrderRepository } from "./repositories/types.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export class OrderService {
  constructor(
    private orders: OrderRepository,
    private revolut: RevolutProvider,
  ) {}

  async createLocalOrder(input: CreateOrderRequest) {
    const quantity = Math.max(1, Math.min(5, input.quantity));
    const now = new Date().toISOString();
    const order: StoredOrder = {
      id: randomUUID(),
      productId: PRODUCT.id,
      productName: PRODUCT.name,
      quantity,
      unitAmountMinor: PRODUCT.priceMinor,
      amountMinor: computeOrderAmountMinor(quantity),
      currency: PRODUCT.currency,
      customer: input.customer,
      integration: input.integration,
      paymentStatus: "created",
      createdAt: now,
      updatedAt: now,
    };
    await this.orders.create(order);
    log("info", "local.order.created", {
      orderId: order.id,
      integration: order.integration,
      amountMinor: order.amountMinor,
      currency: order.currency,
    });
    return toPublicOrder(order);
  }

  async getPublic(id: string) {
    const order = await this.orders.getById(id);
    if (!order) throw new HttpError(404, "Order not found");
    return toPublicOrder(order);
  }

  async require(id: string): Promise<StoredOrder> {
    const order = await this.orders.getById(id);
    if (!order) throw new HttpError(404, "Order not found");
    return order;
  }

  private requireRevolutKeys(): void {
    try {
      assertLiveModeReady();
    } catch (error) {
      throw new HttpError(
        503,
        error instanceof Error ? error.message : "Revolut keys not configured",
      );
    }
  }

  async createEmbeddedRevolutOrder(localOrderId: string) {
    this.requireRevolutKeys();
    const order = await this.require(localOrderId);
    if (order.integration !== "revolut_checkout") {
      throw new HttpError(409, "Order was not created for Embedded Checkout");
    }
    const revolutOrder = await this.revolut.createOrder({
      amountMinor: order.amountMinor,
      currency: order.currency,
      description: `${order.productName} x${order.quantity}`,
      merchantReference: order.id,
      customerEmail: order.customer.email,
    });
    const updated = await this.orders.update(order.id, {
      revolutOrderId: revolutOrder.id,
      revolutOrderToken: revolutOrder.token,
      paymentStatus: "pending",
    });
    log("info", "payment.status", {
      orderId: order.id,
      integration: order.integration,
      paymentStatus: "pending",
      revolutOrderId: revolutOrder.id,
    });
    return {
      orderId: order.id,
      token: updated?.revolutOrderToken ?? revolutOrder.token,
    };
  }

  async createHostedRevolutOrder(localOrderId: string) {
    this.requireRevolutKeys();
    const order = await this.require(localOrderId);
    if (order.integration !== "hosted_checkout") {
      throw new HttpError(409, "Order was not created for Hosted payment page/redirect Checkout");
    }
    const redirectUrl = hostedCheckoutRedirectUrl(order.id);
    const revolutOrder = await this.revolut.createOrder({
      amountMinor: order.amountMinor,
      currency: order.currency,
      description: `${order.productName} x${order.quantity}`,
      merchantReference: order.id,
      customerEmail: order.customer.email,
      redirectUrl,
    });
    if (!revolutOrder.checkoutUrl) {
      throw new HttpError(502, "Revolut did not return a checkout_url");
    }
    await this.orders.update(order.id, {
      revolutOrderId: revolutOrder.id,
      revolutOrderToken: revolutOrder.token,
      checkoutUrl: revolutOrder.checkoutUrl,
      paymentStatus: "pending",
    });
    log("info", "hosted.redirect", {
      orderId: order.id,
      integration: order.integration,
      revolutOrderId: revolutOrder.id,
      redirectUrl: revolutOrder.checkoutUrl,
    });
    return {
      orderId: order.id,
      token: revolutOrder.token,
      checkoutUrl: revolutOrder.checkoutUrl,
    };
  }

  async refreshFromRevolut(localOrderId: string) {
    const order = await this.require(localOrderId);
    if (!order.revolutOrderId) {
      return toPublicOrder(order);
    }
    try {
      const remote = await this.revolut.retrieveOrder(order.revolutOrderId);
      const mapped = mapRevolutState(remote.state);
      if (mapped && mapped !== order.paymentStatus) {
        const updated = await this.orders.updateStatus(order.id, mapped);
        log("info", "payment.status", {
          orderId: order.id,
          integration: order.integration,
          paymentStatus: mapped,
          revolutOrderId: order.revolutOrderId,
          source: "retrieve",
        });
        return toPublicOrder(updated ?? order);
      }
    } catch (error) {
      log("warn", "revolut.retrieve.failed", {
        orderId: order.id,
        revolutOrderId: order.revolutOrderId,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
    return toPublicOrder(order);
  }

  async refreshByRevolutOrderId(revolutOrderId: string) {
    const order = await this.orders.getByRevolutOrderId(revolutOrderId);
    if (!order) throw new HttpError(404, "Order not found");
    log("info", "confirmation.verify", {
      revolutOrderId,
      orderId: order.id,
    });
    return this.refreshFromRevolut(order.id);
  }

  async applyStatus(
    localOrderId: string,
    paymentStatus: PaymentStatus,
    source: string,
  ) {
    const updated = await this.orders.updateStatus(localOrderId, paymentStatus);
    if (!updated) throw new HttpError(404, "Order not found");
    log("info", "payment.status", {
      orderId: localOrderId,
      integration: updated.integration,
      paymentStatus,
      revolutOrderId: updated.revolutOrderId,
      source,
    });
    return toPublicOrder(updated);
  }
}
