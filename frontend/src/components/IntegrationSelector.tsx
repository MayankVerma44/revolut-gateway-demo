import type { IntegrationType } from "@demo/shared";
import { SOLUTIONS } from "../constants/solutions";

export function IntegrationSelector({
  value,
  onChange,
}: {
  value: IntegrationType;
  onChange: (value: IntegrationType) => void;
}) {
  return (
    <section>
      <h2 className="section-title">Payment experience</h2>
      <p className="mt-2 text-ink-soft text-sm">
        This selector chooses an integration architecture, not a card brand.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {SOLUTIONS.map((solution) => (
          <Option
            key={solution.id}
            selected={value === solution.id}
            title={solution.name}
            subtitle={solution.comparison.checkoutExperience}
            onClick={() => onChange(solution.id)}
          />
        ))}
      </div>
      <div className="mt-4 glass rounded-2xl p-5 text-sm leading-6 text-ink-soft">
        {value === "revolut_checkout" ? (
          <>
            The customer stays on the merchant checkout. The backend creates a Revolut order with
            the secret key and returns only a public order token. The Web SDK mounts the widget in
            this page.
          </>
        ) : (
          <>
            The merchant backend creates a Revolut order and receives a{" "}
            <code className="text-teal text-xs">checkout_url</code>. The browser leaves this
            website and completes payment on Revolut-hosted checkout before returning to the
            merchant success page.
          </>
        )}
      </div>
    </section>
  );
}

export function LockedIntegrationBadge({ integration }: { integration: IntegrationType }) {
  const solution = SOLUTIONS.find((s) => s.id === integration);
  if (!solution) return null;
  return (
    <section>
      <h2 className="section-title">Checkout solution</h2>
      <div className="demo-locked-badge mt-4">
        <span className="font-medium text-ink">{solution.name}</span>
        <span className="text-ink-soft/50">·</span>
        <span className="text-teal">{solution.demoLabel}</span>
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{solution.description}</p>
    </section>
  );
}

function Option({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl p-5 transition ${
        selected
          ? "glass-strong ring-1 ring-teal/30"
          : "glass hover:border-white/15"
      }`}
    >
      <div className="text-xs uppercase tracking-[0.18em] text-teal">
        {selected ? "Selected" : "Option"}
      </div>
      <div className="mt-2 font-display text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
    </button>
  );
}
