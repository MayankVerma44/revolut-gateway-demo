import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";

const CartPage = lazy(() => import("./pages/CartPage").then(({ CartPage }) => ({ default: CartPage })));
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then(({ CheckoutPage }) => ({ default: CheckoutPage })),
);
const ConfirmationPage = lazy(() =>
  import("./pages/ConfirmationPage").then(({ ConfirmationPage }) => ({ default: ConfirmationPage })),
);
const FailurePage = lazy(() =>
  import("./pages/FailurePage").then(({ FailurePage }) => ({ default: FailurePage })),
);
const OrderReturnPage = lazy(() =>
  import("./pages/OrderReturnPage").then(({ OrderReturnPage }) => ({ default: OrderReturnPage })),
);
const ProductPage = lazy(() =>
  import("./pages/ProductPage").then(({ ProductPage }) => ({ default: ProductPage })),
);
const SuccessPage = lazy(() =>
  import("./pages/SuccessPage").then(({ SuccessPage }) => ({ default: SuccessPage })),
);

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/order/:id/return" element={<OrderReturnPage />} />
        <Route path="/order/:id/success" element={<SuccessPage />} />
        <Route path="/order/:id/failure" element={<FailurePage />} />
      </Routes>
    </Suspense>
  );
}
