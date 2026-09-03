import { computeOrderAmountMinor, formatGbp, PRODUCT } from "@demo/shared";

export function OrderSummary({ quantity }: { quantity: number }) {
  const subtotal = PRODUCT.priceMinor * quantity;
  const total = computeOrderAmountMinor(quantity);
  return (
    <aside className="rounded-3xl bg-paper border border-line p-6">
      <h2 className="font-display text-2xl">Order summary</h2>
      <div className="mt-5 space-y-3 text-sm">
        <Row label={`${PRODUCT.name} × ${quantity}`} value={formatGbp(subtotal)} />
        <Row label="Shipping" value="Free" />
        <div className="border-t border-line pt-3 flex justify-between font-medium text-base">
          <span>Total</span>
          <span>{formatGbp(total)}</span>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-ink-soft">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
