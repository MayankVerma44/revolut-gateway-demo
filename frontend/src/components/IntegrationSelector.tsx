import type { IntegrationType } from "@demo/shared";

export function IntegrationSelector({
  value,
  onChange,
}: {
  value: IntegrationType;
  onChange: (value: IntegrationType) => void;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl">Payment experience</h2>
      <p className="mt-2 text-ink-soft text-sm">
        This selector chooses an integration architecture, not a card brand.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Option
          selected={value === "revolut_checkout"}
          title="Revolut Checkout"
          subtitle="Embedded payment experience on this page"
          onClick={() => onChange("revolut_checkout")}
        />
        <Option
          selected={value === "hosted_checkout"}
          title="Hosted Checkout"
          subtitle="Redirect customer to a Revolut-hosted payment page"
          onClick={() => onChange("hosted_checkout")}
        />
      </div>
      <div className="mt-4 rounded-2xl bg-ink text-cream p-5 text-sm leading-6">
        {value === "revolut_checkout" ? (
          <>
            The customer stays on the merchant checkout. The backend creates a Revolut
            order with the secret key and returns only a public order token. The Web SDK
            mounts the widget in this page.
          </>
        ) : (
          <>
            The merchant backend creates a Revolut order and receives a <code>checkout_url</code>.
            The browser then leaves this website and completes payment on Revolut-hosted
            checkout before returning to a merchant confirmation page.
          </>
        )}
      </div>
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
      className={`text-left rounded-2xl border p-5 transition ${
        selected ? "border-teal bg-paper shadow-sm" : "border-line bg-transparent"
      }`}
    >
      <div className="text-xs uppercase tracking-[0.18em] text-teal">
        {selected ? "Selected" : "Option"}
      </div>
      <div className="mt-2 font-display text-xl">{title}</div>
      <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
    </button>
  );
}
