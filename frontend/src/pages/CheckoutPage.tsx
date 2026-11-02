import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CustomerDetails, IntegrationType } from "@demo/shared";
import { api } from "../api";
import { useCart } from "../cart";
import { ConfigGate, useConfig } from "../config";
import { IntegrationSelector, LockedIntegrationBadge } from "../components/IntegrationSelector";
import { Layout } from "../components/Layout";
import { useCheckoutSession } from "../checkoutSession";
import { OrderSummary } from "../components/OrderSummary";
import { PaymentMethodBadges } from "../components/ui/PaymentMethodBadges";
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
  const [integration, setIntegration] = useState<IntegrationType>(
    () => session.integration ?? "revolut_checkout",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<ReturnType<typeof createPaymentIntegration> | null>(null);
  const customerRef = useRef(customer);
  const quantityRef = useRef(cart.quantity);
  const localOrderTask = useRef<Promise<string> | null>(null);
  const onPaymentErrorRef = useRef<(message: string) => void>(() => {});
  const onPaymentCancelRef = useRef<() => void>(() => {});
  customerRef.current = customer;
  quantityRef.current = cart.quantity;
  onPaymentErrorRef.current = (message) => {
    setNotice(null);
    setError(message);
  };
  onPaymentCancelRef.current = () => {
    setError(null);
    setNotice("Payment was cancelled.");
  };

  useEffect(() => {
    if (session.integration) setIntegration(session.integration);
  }, [session.integration]);

  useEffect(() => {
    if (!config || integration !== "revolut_checkout" || !config.sandboxReady) return;
    const target = widgetRef.current;
    if (!target) return;

    let cancelled = false;
    integrationRef.current?.destroy();
    target.replaceChildren();
    const embedded = createPaymentIntegration("revolut_checkout", config);
    integrationRef.current = embedded;

    embedded
      .start({
        email: customerRef.current.email,
        target,
        ensureLocalOrder: () => {
          if (!localOrderTask.current) {
            localOrderTask.current = api
              .createOrder({
                quantity: quantityRef.current,
                customer: customerRef.current,
                integration: "revolut_checkout",
              })
              .then((result) => result.order.id)
              .catch((err: unknown) => {
                localOrderTask.current = null;
                throw err;
              });
          }
          return localOrderTask.current;
        },
        onPaymentError: (message) => onPaymentErrorRef.current(message),
        onPaymentCancel: () => onPaymentCancelRef.current(),
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Embedded Checkout failed to load");
      });

    return () => {
      cancelled = true;
      embedded.destroy();
      if (integrationRef.current === embedded) integrationRef.current = null;
    };
  }, [integration, config]);

  if (!config) return <ConfigGate />;

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
    if (!config || integration !== "hosted_checkout") return;

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

      setLeaving(true);
      const hosted = createPaymentIntegration("hosted_checkout", config);
      integrationRef.current = hosted;
      await hosted.start({ localOrderId: orderId, email: customer.email });
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
          Leaving your site — redirecting to Revolut-hosted checkout…
        </div>
      )}
      <form onSubmit={onSubmit} className="page-container py-12 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-8">
          <div>
            <h1 className="page-title">Checkout</h1>
            <p className="mt-2 text-ink-soft">
              Complete your customer details, then choose how you connect to Revolut.
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
                Embedded Checkout loads on this page. It starts when the page is ready, including
                after a refresh or a return from Revolut.
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                Hosted payment page/redirect Checkout sends the customer to Revolut, then returns to your success page
                after payment.
              </p>
            )}

            <div ref={widgetRef} id="checkout-container" className="mt-4 min-h-16">
              {integration === "hosted_checkout" && <PaymentMethodBadges />}
            </div>

            {error && <p className="mt-4 text-rose text-sm">{error}</p>}
            {notice && <p className="mt-4 text-amber text-sm">{notice}</p>}

            {integration === "hosted_checkout" && (
              <button type="submit" disabled={busy || !config.sandboxReady} className="btn-primary mt-6">
                {busy ? "Working…" : "Continue to payment"}
              </button>
            )}
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
