import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./cart";
import { ConfigProvider } from "./config";
import { CheckoutSessionProvider } from "./checkoutSession";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <CheckoutSessionProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CheckoutSessionProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
