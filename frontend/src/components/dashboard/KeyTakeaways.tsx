import { KEY_TAKEAWAYS } from "../../constants/comparisonOverview";

export function KeyTakeaways() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <article className="glass flow-card rounded-3xl p-6 md:p-8" style={{ animationDelay: "70ms" }}>
        <h3 className="font-display text-base font-semibold text-teal">Embedded Checkout</h3>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">{KEY_TAKEAWAYS.revolutCheckout}</p>
      </article>
      <article className="glass flow-card rounded-3xl p-6 md:p-8" style={{ animationDelay: "140ms" }}>
        <h3 className="font-display text-base font-semibold text-teal">Hosted payment page/redirect Checkout</h3>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">{KEY_TAKEAWAYS.hostedCheckout}</p>
      </article>
    </div>
  );
}
