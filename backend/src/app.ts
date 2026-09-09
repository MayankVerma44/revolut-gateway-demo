import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { config, isLocalHostedRedirect, isSandboxReady } from "./config.js";
import { log } from "./logger.js";
import { HttpError, type OrderService } from "./orderService.js";
import {
  createOrderSchema,
  localOrderIdSchema,
  simulateSchema,
} from "./validation.js";
import type { WebhookService } from "./webhookService.js";

export function createApp(orderService: OrderService, webhookService: WebhookService) {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as Request & { rawBody?: string }).rawBody = buf.toString("utf8");
      },
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, demoMode: config.demoMode, revolutMode: config.revolutMode });
  });

  app.get("/api/config", (_req, res) => {
    res.json({
      demoMode: config.demoMode,
      revolutMode: config.revolutMode,
      revolutPublicKey: config.demoMode ? null : config.revolutPublicKey || null,
      appBaseUrl: config.appBaseUrl,
      sandboxReady: isSandboxReady(),
      localHostedRedirect: isLocalHostedRedirect(),
    });
  });

  app.post("/api/orders", async (req, res, next) => {
    try {
      const body = createOrderSchema.parse(req.body);
      const order = await orderService.createLocalOrder(body);
      res.status(201).json({ order });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", async (req, res, next) => {
    try {
      const order = await orderService.getPublic(req.params.id);
      res.json({ order });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id/status", async (req, res, next) => {
    try {
      const order = await orderService.refreshFromRevolut(req.params.id);
      res.json({ order, verifiedServerSide: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/revolut/embedded/create-order", async (req, res, next) => {
    try {
      const { localOrderId } = localOrderIdSchema.parse(req.body);
      const result = await orderService.createEmbeddedRevolutOrder(localOrderId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/revolut/hosted/create-order", async (req, res, next) => {
    try {
      const { localOrderId } = localOrderIdSchema.parse(req.body);
      const result = await orderService.createHostedRevolutOrder(localOrderId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/webhooks/revolut", async (req, res, next) => {
    try {
      const raw =
        (req as Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body ?? {});
      const headerMap: Record<string, string | undefined> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        headerMap[key.toLowerCase()] = Array.isArray(value) ? value[0] : value;
      }
      const result = await webhookService.handle(raw, headerMap);
      res.status(result.accepted ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/demo/orders/:id/simulate", async (req, res, next) => {
    try {
      if (!config.demoMode) {
        throw new HttpError(403, "Simulation is only available in DEMO mode");
      }
      const { outcome } = simulateSchema.parse(req.body);
      const order = await orderService.applyStatus(req.params.id, outcome, "demo.simulate");
      res.json({ order });
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error && typeof error === "object" && "issues" in error) {
      res.status(400).json({ error: "Invalid request", details: error });
      return;
    }
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    log("error", "unhandled", {
      message: error instanceof Error ? error.message : "unknown",
    });
    res.status(500).json({ error: "Unexpected server error" });
  });

  return app;
}
