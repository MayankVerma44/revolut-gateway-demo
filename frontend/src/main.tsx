import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./cart";
import { ConfigProvider } from "./config";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
