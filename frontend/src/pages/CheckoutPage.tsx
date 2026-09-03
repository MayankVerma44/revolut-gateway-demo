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
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-4xl">Checkout</h1>
          <p className="mt-4">
            Nothing to pay for yet. <Link to="/product" className="text-teal">Choose a product</Link>.
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
        <div className="bg-teal text-cream text-center py-3 px-4 text-sm">
          Leaving Northline Audio — you are being redirected to Revolut-hosted checkout.
        </div>
      )}
      <form onSubmit={onSubmit} className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-10">
          <div>
            <h1 className="font-display text-4xl">Checkout</h1>
            <p className="mt-2 text-ink-soft">
              Complete customer details, then choose how this merchant talks to Revolut.
            </p>
          </div>

          <section>
            <h2 className="font-display text-2xl">Customer information</h2>
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

          <IntegrationSelector
            value={integration}
            onChange={(next) => {
              setIntegration(next);
              setLocalOrderId(null);
              integrationRef.current?.destroy();
            }}
          />

          <section className="rounded-3xl border border-line bg-paper p-6">
            <h2 className="font-display text-2xl">Payment</h2>
            {integration === "revolut_checkout" ? (
              <p className="mt-2 text-sm text-ink-soft">
                Revolut Checkout renders inside this merchant page after you continue.
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                Hosted Checkout will send the customer away from this website.
              </p>
            )}

            <div ref={widgetRef} id="checkout-container" className="mt-4 min-h-16" />

            {config.demoMode && integration === "revolut_checkout" && localOrderId && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-line p-4 bg-cream">
                  <div className="text-sm font-medium">Embedded widget (simulated)</div>
                  <p className="text-sm text-ink-soft mt-1">
                    In sandbox mode this region is replaced by the official Revolut Checkout
                    Web SDK.
                  </p>
                </div>
                <DemoControls orderId={localOrderId} onDone={(path) => navigate(path)} />
              </div>
            )}

            {error && <p className="mt-4 text-rose text-sm">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 rounded-full bg-teal text-cream px-6 py-3 disabled:opacity-60"
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
        className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
      />
    </label>
  );
}
