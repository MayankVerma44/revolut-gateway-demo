import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatGbp, PRODUCT } from "@demo/shared";
import { useCart } from "../cart";
import { useDemo } from "../demo";
import { HeadphonesArt } from "../components/HeadphonesArt";
import { Layout } from "../components/Layout";

export function ProductPage() {
  const cart = useCart();
  const demo = useDemo();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  return (
    <Layout>
      <div className="page-container py-10 md:py-12">
        {demo.isActive && (
          <p className="text-sm text-ink-soft mb-8 max-w-2xl">
            You&apos;re exploring the <span className="text-teal">{demo.demoLabel}</span>. Add the
            product to cart and proceed to checkout to experience the integration.
          </p>
        )}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <div className="glass rounded-3xl p-4">
            <HeadphonesArt className="w-full rounded-2xl" />
          </div>
          <div className="glass rounded-3xl p-8">
            <span className="badge">Demo SKU</span>
            <h1 className="page-title mt-4 text-3xl">{PRODUCT.name}</h1>
            <p className="mt-4 text-ink-soft leading-relaxed">{PRODUCT.description}</p>
            <p className="mt-6 text-3xl font-semibold text-teal">{formatGbp(PRODUCT.priceMinor)}</p>
            <div className="mt-8 flex items-center gap-4">
              <label className="text-sm text-ink-soft">Quantity</label>
              <select
                className="glass-input rounded-xl px-3 py-2 text-sm"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value} className="bg-[#0f1524]">
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="btn-primary"
                onClick={() => {
                  cart.setQuantity(quantity);
                  navigate("/cart");
                }}
              >
                Add to cart
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  cart.setQuantity(quantity);
                  navigate("/checkout");
                }}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
