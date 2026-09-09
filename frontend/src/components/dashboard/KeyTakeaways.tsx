import { KEY_TAKEAWAYS } from "../../constants/comparisonOverview";

export function KeyTakeaways() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <article className="glass rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-base font-semibold text-teal">Revolut Checkout</h3>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">{KEY_TAKEAWAYS.revolutCheckout}</p>
      </article>
      <article className="glass rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-base font-semibold text-teal">Hosted Checkout</h3>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">{KEY_TAKEAWAYS.hostedCheckout}</p>
      </article>
    </div>
  );
}
