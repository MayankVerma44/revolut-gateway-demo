import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CustomerDetails, IntegrationType } from "@demo/shared";
import { api } from "../api";
import { useCart } from "../cart";
import { useConfig } from "../config";
import { DemoControls } from "../components/DemoControls";
import { IntegrationSelector } from "../components/IntegrationSelector";
import { Layout } from "../components/Layout";
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
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [integration, setIntegration] = useState<IntegrationType>("revolut_checkout");
  const [localOrderId, setLocalOrderId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<ReturnType<typeof createPaymentIntegration> | null>(null);

  useEffect(() => {
    return () => integrationRef.current?.destroy();
  }, []);

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
      setLocalOrderId(null);
      const orderId = (
        await api.createOrder({
          quantity: cart.quantity,
          customer,
          integration,
        })
      ).order.id;
      setLocalOrderId(orderId);

      if (integration === "hosted_checkout") {
        setLeaving(true);
        const hosted = createPaymentIntegration("hosted_checkout", config);
        integrationRef.current = hosted;
        await hosted.start({ localOrderId: orderId, email: customer.email });
        return;
      }

      if (config.demoMode) {
        await api.createEmbedded(orderId);
        setBusy(false);
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

          {!config.demoMode && !config.sandboxReady && (
            <div className="alert-warning">
              <p className="font-medium text-amber">Sandbox keys required</p>
              <p className="mt-2 text-ink-soft">
                Set <code className="text-xs">DEMO_MODE=false</code> and add your Revolut sandbox
                keys to <code className="text-xs">.env</code>, then restart{" "}
                <code className="text-xs">npm run dev</code>.
              </p>
            </div>
          )}

          <IntegrationSelector
            value={integration}
            onChange={(next) => {
              setIntegration(next);
              setLocalOrderId(null);
              integrationRef.current?.destroy();
            }}
          />

          <section className="glass rounded-2xl p-6">
            <h2 className="section-title">Payment</h2>
            {integration === "revolut_checkout" ? (
              <p className="mt-2 text-sm text-ink-soft">
                Revolut Checkout renders inside this merchant page after you continue.
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                Hosted Checkout sends the customer to Revolut, then returns to your local success
                page after payment.
              </p>
            )}

            {integration === "hosted_checkout" &&
              !config.demoMode &&
              config.sandboxReady &&
              config.localHostedRedirect && (
                <p className="mt-3 text-xs text-ink-soft/80 leading-relaxed">
                  Revolut cannot redirect to localhost in live sandbox. Payment completes on
                  Revolut&apos;s page — use demo controls on the simulated page, or set{" "}
                  <code className="text-teal">REVOLUT_HOSTED_REDIRECT_URL</code> to a public tunnel
                  URL for automatic return.
                </p>
              )}

            <div ref={widgetRef} id="checkout-container" className="mt-4 min-h-16" />

            {config.demoMode && integration === "revolut_checkout" && localOrderId && (
              <div className="mt-4 space-y-4">
                <div className="glass-strong rounded-xl p-4">
                  <div className="text-sm font-medium">Embedded widget (simulated)</div>
                  <p className="text-sm text-ink-soft mt-1">
                    In sandbox mode this region is replaced by the official Revolut Checkout Web
                    SDK.
                  </p>
                </div>
                <DemoControls orderId={localOrderId} onDone={(path) => navigate(path)} />
              </div>
            )}

            {error && <p className="mt-4 text-rose text-sm">{error}</p>}

            <button
              type="submit"
              disabled={busy || (!config.demoMode && !config.sandboxReady)}
              className="btn-primary mt-6"
            >
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
