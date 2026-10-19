import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Dev-only. Rewrites /v2 to the separate V2 entry. Not part of `vite build`. */
function v2DevRoute(): Plugin {
  return {
    name: "v2-dev-route",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? "";
        const path = url.split("?")[0] ?? "";
        if (path === "/v2" || path.startsWith("/v2/")) {
          const query = url.includes("?") ? url.slice(url.indexOf("?")) : "";
          req.url = `/v2.html${query}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), v2DevRoute()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
