import { Link } from "react-router-dom";
import { formatGbp, PRODUCT } from "@demo/shared";
import { HeadphonesArt } from "../components/HeadphonesArt";
import { Layout } from "../components/Layout";

export function HomePage() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-teal">Merchant storefront</p>
          <h1 className="font-display text-5xl mt-4 leading-tight">
            A quiet flagship pair, built to demonstrate checkout architecture.
          </h1>
          <p className="mt-5 text-ink-soft max-w-md">
            Northline Audio is a fictional store. Use it to compare Revolut Checkout
            (embedded) with Hosted Checkout (redirect) in a realistic basket flow.
          </p>
          <Link
            to="/product"
            className="inline-flex mt-8 rounded-full bg-ink text-cream px-6 py-3"
          >
            View the product
          </Link>
        </div>
        <HeadphonesArt className="w-full rounded-[40px] shadow-sm" />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Link
          to="/product"
          className="flex flex-col md:flex-row gap-6 rounded-3xl border border-line bg-paper p-6 hover:border-teal"
        >
          <div className="md:w-48">
            <HeadphonesArt className="rounded-2xl" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-3xl">{PRODUCT.name}</h2>
            <p className="mt-2 text-ink-soft">{PRODUCT.description}</p>
            <p className="mt-4 text-xl">{formatGbp(PRODUCT.priceMinor)}</p>
          </div>
        </Link>
      </section>
    </Layout>
  );
}
