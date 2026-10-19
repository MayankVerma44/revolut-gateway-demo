import { useEffect } from "react";
import { useCart } from "../cart";
import { Layout } from "../components/Layout";
import { useCheckoutSession } from "../checkoutSession";

export function ConfirmationPage() {
  const cart = useCart();
  const session = useCheckoutSession();

  useEffect(() => {
    if (cart.quantity > 0) cart.clear();
  }, [cart]);

  return (
    <Layout>
      <div className="page-container py-16 max-w-xl">
        <span className="badge">Payment successful</span>
        <h1 className="page-title mt-4 text-3xl">Payment successful</h1>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Revolut reported the payment as successful. The customer can leave checkout.
        </p>
        <button type="button" className="btn-primary mt-8" onClick={session.clear}>
          Back to dashboard
        </button>
      </div>
    </Layout>
  );
}
