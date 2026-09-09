import {
  HOSTED_CHECKOUT_OVERVIEW,
  REVOLUT_CHECKOUT_OVERVIEW,
} from "../../constants/comparisonOverview";

export function DecisionMatrix() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DecisionPanel
        title="Choose Revolut Checkout if…"
        items={REVOLUT_CHECKOUT_OVERVIEW.decisionCriteria}
        accent="teal"
      />
      <DecisionPanel
        title="Choose Hosted Checkout if…"
        items={HOSTED_CHECKOUT_OVERVIEW.decisionCriteria}
        accent="sky"
      />
    </div>
  );
}

function DecisionPanel({
  title,
  items,
  accent,
}: {
  title: string;
  items: readonly string[];
  accent: "teal" | "sky";
}) {
  return (
    <article className={`glass rounded-3xl p-6 md:p-8 decision-panel decision-panel-${accent}`}>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
            <span className="decision-bullet shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
