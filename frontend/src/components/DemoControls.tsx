import { api } from "../api";

export function DemoControls({
  orderId,
  onDone,
}: {
  orderId: string;
  onDone: (path: string) => void;
}) {
  async function simulate(outcome: "completed" | "failed" | "cancelled" | "pending") {
    await api.simulate(orderId, outcome);
    if (outcome === "completed") onDone(`/order/${orderId}/success`);
    else if (outcome === "pending") onDone(`/order/${orderId}/return`);
    else onDone(`/order/${orderId}/failure?reason=${outcome}`);
  }

  return (
    <div className="alert-demo">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-amber">
        Demo-only controls
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        Simulate a Revolut payment outcome without calling the live Merchant API.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <DemoButton onClick={() => simulate("completed")}>Success</DemoButton>
        <DemoButton onClick={() => simulate("failed")}>Failed</DemoButton>
        <DemoButton onClick={() => simulate("cancelled")}>Cancelled</DemoButton>
        <DemoButton onClick={() => simulate("pending")}>Pending</DemoButton>
      </div>
    </div>
  );
}

function DemoButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="btn-secondary w-full text-sm py-2">
      {children}
    </button>
  );
}
