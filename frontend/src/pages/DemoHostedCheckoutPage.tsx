import { useSearchParams } from "react-router-dom";
import { DemoControls } from "../components/DemoControls";
import { useNavigate } from "react-router-dom";

export function DemoHostedCheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("orderId");

  if (!orderId) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0b1c2c] text-white">
        Missing order.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07131f] text-white">
      <div className="bg-[#12324a] text-center text-xs uppercase tracking-[0.2em] py-2">
        Simulated Revolut-hosted checkout — you have left the merchant website
      </div>
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl bg-[#0e2233] border border-white/10 p-8">
          <p className="text-sm text-white/60">Hosted Checkout</p>
          <h1 className="text-3xl mt-2 font-semibold">Complete your payment</h1>
          <p className="mt-3 text-white/70 text-sm">
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
