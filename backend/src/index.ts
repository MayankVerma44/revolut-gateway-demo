import { config } from "./config.js";
import { createApp } from "./app.js";
import { log } from "./logger.js";
import { OrderService } from "./orderService.js";
import { LiveRevolutProvider } from "./providers/liveRevolutProvider.js";
import { SqliteStore } from "./repositories/sqliteStore.js";
import { WebhookService } from "./webhookService.js";

const store = new SqliteStore(config.sqlitePath);
await store.init();

const revolut = new LiveRevolutProvider();

const orderService = new OrderService(store, revolut);
const webhookService = new WebhookService(store, store, orderService);
const app = createApp(orderService, webhookService);

app.listen(config.port, "0.0.0.0", () => {
  log("info", "server.started", {
    port: config.port,
    revolutMode: config.revolutMode,
    sandboxReady: Boolean(config.revolutPublicKey && config.revolutSecretKey),
    appBaseUrl: config.appBaseUrl,
  });
});
