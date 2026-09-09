import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./cart";
import { ConfigProvider } from "./config";
import { DemoProvider } from "./demo";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <DemoProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </DemoProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
