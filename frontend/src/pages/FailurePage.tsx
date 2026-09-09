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
      <div className="page-container py-16 max-w-xl">
        <span className="badge bg-rose-500/20 border-rose-400/30 text-rose-300">
          Payment unsuccessful
        </span>
        <h1 className="page-title mt-4 text-3xl">This payment did not complete.</h1>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Reason: {reason}. You can return to checkout and try the other integration path.
        </p>
        {order && (
          <p className="mt-4 text-sm text-ink-soft">
            Order <span className="font-mono text-xs">{order.id}</span> is currently{" "}
            <span className="capitalize">{order.paymentStatus}</span>.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/checkout" className="btn-primary">
            Return to checkout
          </Link>
          <Link to="/" className="btn-secondary">
            Store
          </Link>
        </div>
      </div>
    </Layout>
  );
}
