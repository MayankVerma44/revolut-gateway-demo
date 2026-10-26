import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatGbp, type PublicOrder } from "@demo/shared";
import { api } from "../api";
import { useCart } from "../cart";
import { Layout } from "../components/Layout";
import { useCheckoutSession } from "../checkoutSession";

export function SuccessPage() {
  const { id } = useParams();
  const cart = useCart();
  const session = useCheckoutSession();
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getStatus(id)
      .then((result) => {
        setOrder(result.order);
        cart.clear();
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  return (
    <Layout>
      <div className="page-container py-16 max-w-xl">
        <span className="badge bg-emerald-500/20 border-emerald-400/30 text-emerald-300">
          Payment success
        </span>
        <h1 className="page-title mt-4 text-3xl">Thank you. The order is confirmed.</h1>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Status was verified by your backend, not trusted from the redirect alone.
        </p>
        {error && <p className="mt-4 text-rose">{error}</p>}
        {order && (
          <div className="mt-8 glass rounded-2xl p-6 space-y-2 text-sm">
            <div className="text-ink-soft">Order</div>
            <div className="font-mono text-xs text-ink-soft/80">{order.id}</div>
            <div className="pt-2">
              {order.product.name} × {order.quantity}
            </div>
            <div className="text-teal font-medium">{formatGbp(order.amountMinor)}</div>
            <div className="capitalize text-ink-soft">Status: {order.paymentStatus}</div>
            <div className="text-ink-soft">Integration: {order.integration.replace("_", " ")}</div>
          </div>
        )}
        <button type="button" className="btn-primary mt-8" onClick={session.clear}>
          Back to dashboard
        </button>
      </div>
    </Layout>
  );
}
