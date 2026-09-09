import { useNavigate, useSearchParams } from "react-router-dom";
import { DemoControls } from "../components/DemoControls";

export function DemoHostedCheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("orderId");

  if (!orderId) {
    return (
      <div className="min-h-screen grid place-items-center text-ink-soft">
        Missing order.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="glass-strong border-b border-white/10 text-center text-xs uppercase tracking-[0.2em] py-2.5 text-ink-soft">
        Simulated Revolut-hosted checkout — you have left the merchant website
      </div>
      <div className="page-container py-16 max-w-md">
        <div className="glass-strong rounded-3xl p-8">
          <span className="badge">Hosted Checkout</span>
          <h1 className="page-title mt-4 text-2xl">Complete your payment</h1>
          <p className="mt-3 text-ink-soft text-sm leading-relaxed">
            In REAL SANDBOX mode this page is Revolut&apos;s hosted checkout. Here, DEMO mode
            keeps you inside the app so the architecture can still be walked through.
          </p>
          <div className="mt-8">
            <DemoControls orderId={orderId} onDone={(path) => navigate(path)} />
          </div>
        </div>
      </div>
    </div>
  );
}
