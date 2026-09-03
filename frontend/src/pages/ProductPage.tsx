import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatGbp, PRODUCT } from "@demo/shared";
import { useCart } from "../cart";
import { HeadphonesArt } from "../components/HeadphonesArt";
import { Layout } from "../components/Layout";

export function ProductPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-10">
        <HeadphonesArt className="w-full rounded-[36px]" />
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-teal">Limited demonstration SKU</p>
          <h1 className="font-display text-4xl mt-3">{PRODUCT.name}</h1>
          <p className="mt-4 text-ink-soft">{PRODUCT.description}</p>
          <p className="mt-6 text-3xl">{formatGbp(PRODUCT.priceMinor)}</p>
          <div className="mt-8 flex items-center gap-4">
            <label className="text-sm text-ink-soft">Quantity</label>
            <select
              className="rounded-xl border border-line bg-paper px-3 py-2"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              className="rounded-full bg-ink text-cream px-6 py-3"
              onClick={() => {
                cart.setQuantity(quantity);
                navigate("/cart");
              }}
            >
              Add to cart
            </button>
            <button
              className="rounded-full border border-line px-6 py-3"
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
    </Layout>
  );
}
