import { Link } from "react-router-dom";
import { formatGbp, PRODUCT } from "@demo/shared";
import { HeadphonesArt } from "../components/HeadphonesArt";
import { Layout } from "../components/Layout";

export function HomePage() {
  return (
    <Layout>
      <section className="page-container py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="badge">Merchant storefront</span>
          <h1 className="page-title mt-5">
            A quiet flagship pair, built to demonstrate checkout architecture.
          </h1>
          <p className="mt-5 text-ink-soft max-w-md leading-relaxed">
            Northline Audio is a fictional store. Use it to compare Revolut Checkout
            (embedded) with Hosted Checkout (redirect) in a realistic basket flow.
          </p>
          <Link to="/product" className="btn-primary mt-8">
            View the product
          </Link>
        </div>
        <div className="glass rounded-3xl p-4 overflow-hidden">
          <HeadphonesArt className="w-full rounded-2xl" />
        </div>
      </section>
      <section className="page-container pb-12">
        <Link
          to="/product"
          className="glass flex flex-col md:flex-row gap-6 rounded-2xl p-6 hover:border-white/20 transition-colors"
        >
          <div className="md:w-48 shrink-0">
            <HeadphonesArt className="rounded-xl" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold">{PRODUCT.name}</h2>
            <p className="mt-2 text-ink-soft leading-relaxed">{PRODUCT.description}</p>
            <p className="mt-4 text-2xl font-semibold text-teal">{formatGbp(PRODUCT.priceMinor)}</p>
          </div>
        </Link>
      </section>
    </Layout>
  );
}
