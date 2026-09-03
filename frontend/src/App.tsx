import { Route, Routes } from "react-router-dom";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { DemoHostedCheckoutPage } from "./pages/DemoHostedCheckoutPage";
import { FailurePage } from "./pages/FailurePage";
import { HomePage } from "./pages/HomePage";
import { OrderReturnPage } from "./pages/OrderReturnPage";
import { ProductPage } from "./pages/ProductPage";
import { SuccessPage } from "./pages/SuccessPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/:id/return" element={<OrderReturnPage />} />
      <Route path="/order/:id/success" element={<SuccessPage />} />
      <Route path="/order/:id/failure" element={<FailurePage />} />
      <Route path="/demo/hosted-checkout" element={<DemoHostedCheckoutPage />} />
    </Routes>
  );
}
