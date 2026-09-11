import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CustomerDetails, IntegrationType } from "@demo/shared";
import { api } from "../api";
import { useCart } from "../cart";
import { useConfig } from "../config";
import { IntegrationSelector, LockedIntegrationBadge } from "../components/IntegrationSelector";
import { Layout } from "../components/Layout";
import { useCheckoutSession } from "../checkoutSession";
import { OrderSummary } from "../components/OrderSummary";
import { createPaymentIntegration } from "../integrations/createPaymentIntegration";

const emptyCustomer: CustomerDetails = {
  fullName: "Alex Merchant",
  email: "alex@northline.example",
  phone: "+44 20 7946 0958",
  country: "United Kingdom",
  city: "London",
  postcode: "EC2A 2BB",
  addressLine1: "14 Finsbury Square",
};

export function CheckoutPage() {
  const cart = useCart();
  const config = useConfig();
  const session = useCheckoutSession();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [integration, setIntegration] = useState<IntegrationType>("revolut_checkout");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<ReturnType<typeof createPaymentIntegration> | null>(null);

  useEffect(() => {
    return () => integrationRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (session.integration) setIntegration(session.integration);
  }, [session.integration]);

  if (cart.quantity === 0) {
    return (
      <Layout>
        <div className="page-container py-16">
          <h1 className="page-title">Checkout</h1>
          <p className="mt-4 text-ink-soft">
            Nothing to pay for yet.{" "}
            <Link to="/product" className="text-teal hover:underline">Choose a product</Link>.
          </p>
        </div>
      </Layout>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const orderId = (
        await api.createOrder({
          quantity: cart.quantity,
          customer,
          integration,
        })
      ).order.id;

      if (integration === "hosted_checkout") {
        setLeaving(true);
        const hosted = createPaymentIntegration("hosted_checkout", config);
        integrationRef.current = hosted;
        await hosted.start({ localOrderId: orderId, email: customer.email });
        return;
      }

      integrationRef.current?.destroy();
      const embedded = createPaymentIntegration("revolut_checkout", config);
      integrationRef.current = embedded;
      if (!widgetRef.current) throw new Error("Checkout widget target missing");
      await embedded.start({
        localOrderId: orderId,
        email: customer.email,
        target: widgetRef.current,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLeaving(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      {leaving && (
        <div className="glass-strong border-b border-teal/30 text-center py-3 px-4 text-sm text-teal">
          Leaving the merchant site — redirecting to Revolut-hosted checkout…
        </div>
      )}
      <form onSubmit={onSubmit} className="page-container py-12 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-8">
          <div>
            <h1 className="page-title">Checkout</h1>
            <p className="mt-2 text-ink-soft">
              Complete customer details, then choose how this merchant talks to Revolut.
            </p>
          </div>

          <section className="glass rounded-2xl p-6">
            <h2 className="section-title">Customer information</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Field
                label="Full name"
                value={customer.fullName}
                onChange={(fullName) => setCustomer({ ...customer, fullName })}
              />
              <Field
                label="Email"
                type="email"
                value={customer.email}
                onChange={(email) => setCustomer({ ...customer, email })}
              />
              <Field
                label="Phone"
                value={customer.phone ?? ""}
                onChange={(phone) => setCustomer({ ...customer, phone })}
              />
              <Field
                label="Country"
                value={customer.country}
                onChange={(country) => setCustomer({ ...customer, country })}
              />
              <Field
                label="City"
                value={customer.city}
                onChange={(city) => setCustomer({ ...customer, city })}
              />
              <Field
                label="Postcode"
                value={customer.postcode}
                onChange={(postcode) => setCustomer({ ...customer, postcode })}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  value={customer.addressLine1}
                  onChange={(addressLine1) => setCustomer({ ...customer, addressLine1 })}
                />
              </div>
            </div>
          </section>

          {!config.sandboxReady && (
            <div className="alert-warning">
              <p className="font-medium text-amber">Sandbox keys required</p>
              <p className="mt-2 text-ink-soft">
                Add your Revolut sandbox keys to <code className="text-xs">.env</code> (or the
                Render service environment), then restart{" "}
                <code className="text-xs">npm run dev</code>.
              </p>
            </div>
          )}

          {session.isActive && session.integration ? (
            <LockedIntegrationBadge integration={session.integration} />
          ) : (
            <IntegrationSelector
              value={integration}
              onChange={(next) => {
                setIntegration(next);
                integrationRef.current?.destroy();
              }}
            />
          )}

          <section className="glass rounded-2xl p-6">
            <h2 className="section-title">Payment</h2>
            {integration === "revolut_checkout" ? (
              <p className="mt-2 text-sm text-ink-soft">
                Revolut Checkout renders inside this merchant page after you continue.
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                Hosted Checkout sends the customer to Revolut, then returns to your success page
                after payment.
              </p>
            )}

            {integration === "hosted_checkout" &&
              config.sandboxReady &&
              config.localHostedRedirect && (
                <p className="mt-3 text-xs text-ink-soft/80 leading-relaxed">
                  Revolut cannot redirect to localhost in sandbox. Payment completes on
                  Revolut&apos;s page — set{" "}
                  <code className="text-teal">REVOLUT_HOSTED_REDIRECT_URL</code> to a public URL
                  for automatic return after payment.
                </p>
              )}

            <div ref={widgetRef} id="checkout-container" className="mt-4 min-h-16" />

            {error && <p className="mt-4 text-rose text-sm">{error}</p>}

            <button type="submit" disabled={busy || !config.sandboxReady} className="btn-primary mt-6">
              {busy
                ? "Working…"
                : integration === "hosted_checkout"
                  ? "Continue to payment"
                  : "Continue with embedded checkout"}
            </button>
          </section>
        </div>
        <OrderSummary quantity={cart.quantity} />
      </form>
    </Layout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-ink-soft">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="glass-input mt-1 w-full rounded-xl px-3 py-2"
      />
    </label>
  );
}
