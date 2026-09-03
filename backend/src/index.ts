import { assertLiveModeReady, config } from "./config.js";
import { createApp } from "./app.js";
import { log } from "./logger.js";
import { OrderService } from "./orderService.js";
import { DemoRevolutProvider } from "./providers/demoRevolutProvider.js";
import { LiveRevolutProvider } from "./providers/liveRevolutProvider.js";
import { SqliteStore } from "./repositories/sqliteStore.js";
import { WebhookService } from "./webhookService.js";

assertLiveModeReady();

const store = new SqliteStore(config.sqlitePath);
await store.init();

const revolut = config.demoMode
  ? new DemoRevolutProvider()
  : new LiveRevolutProvider();

const orderService = new OrderService(store, revolut);
const webhookService = new WebhookService(store, store, orderService);
const app = createApp(orderService, webhookService);

app.listen(config.port, () => {
  log("info", "server.started", {
    port: config.port,
    demoMode: config.demoMode,
    revolutMode: config.revolutMode,
    appBaseUrl: config.appBaseUrl,
  });
});
