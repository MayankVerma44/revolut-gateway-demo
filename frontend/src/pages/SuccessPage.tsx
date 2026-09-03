import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatGbp, type PublicOrder } from "@demo/shared";
import { api } from "../api";
import { useCart } from "../cart";
import { Layout } from "../components/Layout";

export function SuccessPage() {
  const { id } = useParams();
  const cart = useCart();
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
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.18em] text-teal">Payment success</p>
        <h1 className="font-display text-4xl mt-3">Thank you. The order is confirmed.</h1>
        <p className="mt-4 text-ink-soft">
          Status was verified by the merchant backend, not trusted from the redirect alone.
        </p>
        {error && <p className="mt-4 text-rose">{error}</p>}
        {order && (
          <div className="mt-8 rounded-3xl border border-line bg-paper p-6 space-y-2 text-sm">
            <div>Order {order.id}</div>
            <div>
              {order.product.name} × {order.quantity}
            </div>
            <div>{formatGbp(order.amountMinor)}</div>
            <div className="capitalize">Status: {order.paymentStatus}</div>
            <div>Integration: {order.integration.replace("_", " ")}</div>
          </div>
        )}
        <Link to="/" className="inline-flex mt-8 rounded-full bg-ink text-cream px-6 py-3">
          Back to the store
        </Link>
      </div>
    </Layout>
  );
}
