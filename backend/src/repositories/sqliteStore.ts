import fs from "node:fs";
import path from "node:path";
import initSqlJs, { type Database } from "sql.js";
import type { PaymentStatus } from "@demo/shared";
import type { StoredOrder, WebhookEventRecord } from "../domain.js";
import { log } from "../logger.js";
import type { OrderRepository, WebhookEventRepository } from "./types.js";

function nowIso(): string {
  return new Date().toISOString();
}

function rowToOrder(row: Record<string, unknown>): StoredOrder {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    productName: String(row.product_name),
    quantity: Number(row.quantity),
    unitAmountMinor: Number(row.unit_amount_minor),
    amountMinor: Number(row.amount_minor),
    currency: "GBP",
    customer: JSON.parse(String(row.customer_json)),
    integration: row.integration as StoredOrder["integration"],
    revolutOrderId: row.revolut_order_id ? String(row.revolut_order_id) : undefined,
    revolutOrderToken: row.revolut_order_token
      ? String(row.revolut_order_token)
      : undefined,
    checkoutUrl: row.checkout_url ? String(row.checkout_url) : undefined,
    paymentStatus: String(row.payment_status) as PaymentStatus,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class SqliteStore implements OrderRepository, WebhookEventRepository {
  private db!: Database;
  private persistPath: string;

  constructor(persistPath: string) {
    this.persistPath = persistPath;
  }

  async init(): Promise<void> {
    const SQL = await initSqlJs();
    fs.mkdirSync(path.dirname(this.persistPath), { recursive: true });
    if (fs.existsSync(this.persistPath)) {
      const fileBuffer = fs.readFileSync(this.persistPath);
      this.db = new SQL.Database(fileBuffer);
    } else {
      this.db = new SQL.Database();
    }
    this.db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_amount_minor INTEGER NOT NULL,
        amount_minor INTEGER NOT NULL,
        currency TEXT NOT NULL,
        customer_json TEXT NOT NULL,
        integration TEXT NOT NULL,
        revolut_order_id TEXT,
        revolut_order_token TEXT,
        checkout_url TEXT,
        payment_status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS webhook_events (
        id TEXT PRIMARY KEY,
        received_at TEXT NOT NULL,
        event_type TEXT NOT NULL,
        revolut_order_id TEXT,
        local_order_id TEXT,
        signature_valid INTEGER,
        payload_json TEXT NOT NULL
      );
    `);
    this.save();
    log("info", "sqlite.ready", { path: this.persistPath });
  }

  private save(): void {
    const data = this.db.export();
    fs.writeFileSync(this.persistPath, Buffer.from(data));
  }

  private one(sql: string, params: unknown[]): Record<string, unknown> | undefined {
    const stmt = this.db.prepare(sql);
    stmt.bind(params as never[]);
    const row = stmt.step() ? (stmt.getAsObject() as Record<string, unknown>) : undefined;
    stmt.free();
    return row;
  }

  async create(order: StoredOrder): Promise<StoredOrder> {
    this.db.run(
      `INSERT INTO orders (
        id, product_id, product_name, quantity, unit_amount_minor, amount_minor,
        currency, customer_json, integration, revolut_order_id, revolut_order_token,
        checkout_url, payment_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        order.productId,
        order.productName,
        order.quantity,
        order.unitAmountMinor,
        order.amountMinor,
        order.currency,
        JSON.stringify(order.customer),
        order.integration,
        order.revolutOrderId ?? null,
        order.revolutOrderToken ?? null,
        order.checkoutUrl ?? null,
        order.paymentStatus,
        order.createdAt,
        order.updatedAt,
      ],
    );
    this.save();
    return order;
  }

  async getById(id: string): Promise<StoredOrder | undefined> {
    const row = this.one("SELECT * FROM orders WHERE id = ?", [id]);
    return row ? rowToOrder(row) : undefined;
  }

  async getByRevolutOrderId(revolutOrderId: string): Promise<StoredOrder | undefined> {
    const row = this.one("SELECT * FROM orders WHERE revolut_order_id = ?", [
      revolutOrderId,
    ]);
    return row ? rowToOrder(row) : undefined;
  }

  async update(id: string, patch: Partial<StoredOrder>): Promise<StoredOrder | undefined> {
    const current = await this.getById(id);
    if (!current) return undefined;
    const next: StoredOrder = {
      ...current,
      ...patch,
      id: current.id,
      updatedAt: nowIso(),
    };
    this.db.run(
      `UPDATE orders SET
        product_id = ?, product_name = ?, quantity = ?, unit_amount_minor = ?,
        amount_minor = ?, currency = ?, customer_json = ?, integration = ?,
        revolut_order_id = ?, revolut_order_token = ?, checkout_url = ?,
        payment_status = ?, updated_at = ?
      WHERE id = ?`,
      [
        next.productId,
        next.productName,
        next.quantity,
        next.unitAmountMinor,
        next.amountMinor,
        next.currency,
        JSON.stringify(next.customer),
        next.integration,
        next.revolutOrderId ?? null,
        next.revolutOrderToken ?? null,
        next.checkoutUrl ?? null,
        next.paymentStatus,
        next.updatedAt,
        id,
      ],
    );
    this.save();
    return next;
  }

  async updateStatus(id: string, paymentStatus: PaymentStatus): Promise<StoredOrder | undefined> {
    return this.update(id, { paymentStatus });
  }

  async append(event: WebhookEventRecord): Promise<void> {
    this.db.run(
      `INSERT INTO webhook_events (
        id, received_at, event_type, revolut_order_id, local_order_id, signature_valid, payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.id,
        event.receivedAt,
        event.eventType,
        event.revolutOrderId ?? null,
        event.localOrderId ?? null,
        event.signatureValid === null ? null : event.signatureValid ? 1 : 0,
        JSON.stringify(event.payload),
      ],
    );
    this.save();
  }

  async listRecent(limit: number): Promise<WebhookEventRecord[]> {
    const stmt = this.db.prepare(
      "SELECT * FROM webhook_events ORDER BY received_at DESC LIMIT ?",
    );
    stmt.bind([limit]);
    const events: WebhookEventRecord[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as Record<string, unknown>;
      events.push({
        id: String(row.id),
        receivedAt: String(row.received_at),
        eventType: String(row.event_type),
        revolutOrderId: row.revolut_order_id ? String(row.revolut_order_id) : undefined,
        localOrderId: row.local_order_id ? String(row.local_order_id) : undefined,
        signatureValid:
          row.signature_valid === null || row.signature_valid === undefined
            ? null
            : Number(row.signature_valid) === 1,
        payload: JSON.parse(String(row.payload_json)),
      });
    }
    stmt.free();
    return events;
  }
}
