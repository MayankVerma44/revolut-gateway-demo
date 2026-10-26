import type { CSSProperties } from "react";
import {
  HOSTED_CHECKOUT_OVERVIEW,
  INDIVIDUAL_SDK_DECISION,
  PLUGINS_DECISION,
  REVOLUT_CHECKOUT_OVERVIEW,
  SERVER_TO_SERVER_OVERVIEW,
  SUBSCRIPTION_APIS_OVERVIEW,
} from "../../constants/comparisonOverview";

const DECISIONS = [
  {
    title: "Choose Embedded Checkout if…",
    items: REVOLUT_CHECKOUT_OVERVIEW.decisionCriteria,
    accent: "teal",
  },
  {
    title: "Choose Hosted payment page/redirect Checkout if…",
    items: HOSTED_CHECKOUT_OVERVIEW.decisionCriteria,
    accent: "sky",
  },
  {
    title: "Choose Individual SDK if…",
    items: INDIVIDUAL_SDK_DECISION,
    accent: "teal",
  },
  {
    title: "Choose Plugins if…",
    items: PLUGINS_DECISION,
    accent: "sky",
  },
  {
    title: "Choose Subscription APIs if…",
    items: SUBSCRIPTION_APIS_OVERVIEW.decisionCriteria,
    accent: "teal",
  },
  {
    title: "Choose Server-to-Server if…",
    items: SERVER_TO_SERVER_OVERVIEW.decisionCriteria,
    accent: "sky",
  },
] as const;

export function DecisionMatrix() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {DECISIONS.map((decision, index) => (
        <DecisionPanel
          key={decision.title}
          title={decision.title}
          items={decision.items}
          accent={decision.accent}
          className="flow-card"
          style={{ animationDelay: `${70 + index * 70}ms` }}
        />
      ))}
    </div>
  );
}

function DecisionPanel({
  title,
  items,
  accent,
  className = "",
  style,
}: {
  title: string;
  items: readonly string[];
  accent: "teal" | "sky";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <article
      className={`glass rounded-3xl p-6 md:p-8 decision-panel decision-panel-${accent} ${className}`.trim()}
      style={style}
    >
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
