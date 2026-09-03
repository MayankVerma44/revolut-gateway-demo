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
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Checking payment</h1>
        <p className="mt-4 text-ink-soft">{message}</p>
      </div>
    </Layout>
  );
}
