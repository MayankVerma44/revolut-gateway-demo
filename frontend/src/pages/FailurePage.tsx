import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { PublicOrder } from "@demo/shared";
import { api } from "../api";
import { Layout } from "../components/Layout";

export function FailurePage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const [order, setOrder] = useState<PublicOrder | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getStatus(id).then((result) => setOrder(result.order)).catch(() => undefined);
  }, [id]);

  const reason = params.get("reason") ?? order?.paymentStatus ?? "failed";

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.18em] text-rose">Payment unsuccessful</p>
        <h1 className="font-display text-4xl mt-3">This payment did not complete.</h1>
        <p className="mt-4 text-ink-soft">
          Reason: {reason}. You can return to checkout and try the other integration path.
        </p>
        {order && (
          <p className="mt-4 text-sm">
            Order {order.id} is currently <span className="capitalize">{order.paymentStatus}</span>.
          </p>
        )}
        <div className="mt-8 flex gap-3">
          <Link to="/checkout" className="rounded-full bg-ink text-cream px-6 py-3">
            Return to checkout
          </Link>
          <Link to="/" className="rounded-full border border-line px-6 py-3">
            Store
          </Link>
        </div>
      </div>
    </Layout>
  );
}
