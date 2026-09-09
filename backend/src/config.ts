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
  hostedRedirectBaseUrl:
    process.env.REVOLUT_HOSTED_REDIRECT_URL?.trim() ||
    process.env.APP_BASE_URL?.trim() ||
    "http://localhost:5173",
  sqlitePath: process.env.SQLITE_PATH ?? path.resolve(here, "../data/orders.sqlite"),
};

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
}

/** Revolut rejects localhost redirect_url in live mode — returns undefined to omit it. */
export function hostedCheckoutRedirectUrl(localOrderId: string): string | undefined {
  const base = config.hostedRedirectBaseUrl.replace(/\/$/, "");
  const redirectUrl = `${base}/order/${localOrderId}/success`;
  if (config.demoMode) return redirectUrl;
  try {
    const host = new URL(base).hostname;
    if (isLocalHostname(host)) return undefined;
  } catch {
    return undefined;
  }
  return redirectUrl;
}

export function isLocalHostedRedirect(): boolean {
  try {
    const host = new URL(config.hostedRedirectBaseUrl).hostname;
    return isLocalHostname(host);
  } catch {
    return true;
  }
}

export function revolutMerchantBaseUrl(): string {
  return config.revolutMode === "prod"
    ? "https://merchant.revolut.com"
    : "https://sandbox-merchant.revolut.com";
}

export function isSandboxReady(): boolean {
  return !config.demoMode && Boolean(config.revolutPublicKey && config.revolutSecretKey);
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
