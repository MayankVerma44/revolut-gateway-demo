import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TERMINAL_FAILURE_STATUSES,
  TERMINAL_SUCCESS_STATUSES,
  type PublicOrder,
} from "@demo/shared";
import { api } from "../api";
import { Layout } from "../components/Layout";

export function OrderReturnPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying payment with the merchant server…");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { order } = await api.getStatus(id);
        if (cancelled) return;
        route(order);
      } catch {
        setMessage("Could not verify this order. Retrying…");
        const { order } = await api.getOrder(id);
        if (!cancelled) route(order);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  function route(order: PublicOrder) {
    if (TERMINAL_SUCCESS_STATUSES.includes(order.paymentStatus)) {
      navigate(`/order/${order.id}/success`, { replace: true });
      return;
    }
    if (TERMINAL_FAILURE_STATUSES.includes(order.paymentStatus)) {
      navigate(`/order/${order.id}/failure`, { replace: true });
      return;
    }
    setMessage(
      `Payment is ${order.paymentStatus}. Fulfilment waits for a verified server-side status, not the browser redirect.`,
    );
  }

  return (
    <Layout>
      <div className="page-container py-20 text-center max-w-xl mx-auto">
        <div className="glass rounded-2xl p-10">
          <div className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
          <h1 className="page-title text-2xl">Checking payment</h1>
          <p className="mt-4 text-ink-soft">{message}</p>
        </div>
      </div>
    </Layout>
  );
}
