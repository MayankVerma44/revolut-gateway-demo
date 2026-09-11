import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../../.env") });
dotenv.config({ path: path.resolve(here, "../.env") });

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  demoMode: bool(process.env.DEMO_MODE, true),
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:5173",
  logLevel: process.env.LOG_LEVEL ?? "info",
  revolutPublicKey: process.env.REVOLUT_PUBLIC_KEY?.trim() || "",
  revolutSecretKey: process.env.REVOLUT_SECRET_KEY?.trim() || "",
  revolutMode: (process.env.REVOLUT_MODE === "prod" ? "prod" : "sandbox") as
    | "sandbox"
    | "prod",
  revolutApiVersion: process.env.REVOLUT_API_VERSION ?? "2026-04-20",
  revolutWebhookSecret: process.env.REVOLUT_WEBHOOK_SECRET?.trim() || "",
  sqlitePath: process.env.SQLITE_PATH ?? path.resolve(here, "../data/orders.sqlite"),
};

export function revolutMerchantBaseUrl(): string {
  return config.revolutMode === "prod"
    ? "https://merchant.revolut.com"
    : "https://sandbox-merchant.revolut.com";
}

export function isSandboxReady(): boolean {
  return !config.demoMode && Boolean(config.revolutPublicKey && config.revolutSecretKey);
}

export function isHostedCheckoutAvailable(): boolean {
  if (config.demoMode) return true;
  try {
    const host = new URL(config.appBaseUrl).hostname;
    return host !== "localhost" && host !== "127.0.0.1" && !/^\d+\.\d+\.\d+\.\d+$/.test(host);
  } catch {
    return false;
  }
}

export function assertLiveModeReady(): void {
  if (config.demoMode) return;
  if (!config.revolutSecretKey) {
    throw new Error(
      "REAL SANDBOX mode requires REVOLUT_SECRET_KEY. Set DEMO_MODE=true to run without credentials.",
    );
  }
  if (!config.revolutPublicKey) {
    throw new Error(
      "REAL SANDBOX mode requires REVOLUT_PUBLIC_KEY for the embedded Revolut Checkout widget.",
    );
  }
}
