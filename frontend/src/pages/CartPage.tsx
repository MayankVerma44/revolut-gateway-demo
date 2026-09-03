import { Link } from "react-router-dom";
import { formatGbp, PRODUCT } from "@demo/shared";
import { useCart } from "../cart";
import { HeadphonesArt } from "../components/HeadphonesArt";
import { Layout } from "../components/Layout";
import { OrderSummary } from "../components/OrderSummary";

export function CartPage() {
  const cart = useCart();

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-4xl">Cart</h1>
        {cart.quantity === 0 ? (
          <p className="mt-6 text-ink-soft">
            Your cart is empty. <Link to="/product" className="text-teal">Add the headphones</Link>.
          </p>
        ) : (
          <div className="mt-8 grid md:grid-cols-[1fr_320px] gap-8">
            <div className="rounded-3xl border border-line bg-paper p-6 flex gap-5">
              <div className="w-36">
                <HeadphonesArt className="rounded-2xl" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl">{PRODUCT.name}</h2>
                <p className="text-ink-soft mt-1">{formatGbp(PRODUCT.priceMinor)}</p>
                <div className="mt-4 flex items-center gap-3">
                  <select
                    className="rounded-xl border border-line px-3 py-2"
                    value={cart.quantity}
                    onChange={(event) => cart.setQuantity(Number(event.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <button className="text-sm text-rose" onClick={cart.clear}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div>
              <OrderSummary quantity={cart.quantity} />
              <Link
                to="/checkout"
                className="mt-4 flex justify-center rounded-full bg-ink text-cream px-6 py-3"
              >
                Continue to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
