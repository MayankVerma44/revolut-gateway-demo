import type { PaymentStatus } from "@demo/shared";
import type { StoredOrder, WebhookEventRecord } from "../domain.js";

export interface OrderRepository {
  create(order: StoredOrder): Promise<StoredOrder>;
  getById(id: string): Promise<StoredOrder | undefined>;
  getByRevolutOrderId(revolutOrderId: string): Promise<StoredOrder | undefined>;
  update(id: string, patch: Partial<StoredOrder>): Promise<StoredOrder | undefined>;
  updateStatus(id: string, paymentStatus: PaymentStatus): Promise<StoredOrder | undefined>;
}

export interface WebhookEventRepository {
  append(event: WebhookEventRecord): Promise<void>;
  listRecent(limit: number): Promise<WebhookEventRecord[]>;
}
