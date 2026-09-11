import { Route, Routes } from "react-router-dom";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { FailurePage } from "./pages/FailurePage";
import { DashboardPage } from "./pages/DashboardPage";
import { OrderReturnPage } from "./pages/OrderReturnPage";
import { ProductPage } from "./pages/ProductPage";
import { SuccessPage } from "./pages/SuccessPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/:id/return" element={<OrderReturnPage />} />
      <Route path="/order/:id/success" element={<SuccessPage />} />
      <Route path="/order/:id/failure" element={<FailurePage />} />
    </Routes>
  );
}
