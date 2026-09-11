import { ComparisonTable } from "../components/dashboard/ComparisonTable";
import { SolutionCard } from "../components/dashboard/SolutionCard";
import { Layout } from "../components/Layout";
import { SOLUTIONS } from "../constants/solutions";
import { useConfig } from "../config";

export function DashboardPage() {
  const config = useConfig();

  return (
    <Layout mode="dashboard">
      <div className="page-container py-12 md:py-16 space-y-16">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-teal tracking-wide">
            Compare and experience Revolut checkout solutions
          </p>
          <h1 className="hero-title mt-4">Compare Revolut Checkout Solutions</h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed">
            Explore how each integration pattern works for merchants — from embedded widgets on
            your site to fully hosted checkout pages. Select a solution below to launch an
            interactive walkthrough.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-ink-soft">
            <span className="status-dot" />
            {config.demoMode
              ? "DEMO environment — simulated Revolut responses"
              : `Live ${config.revolutMode} sandbox — real Revolut API`}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="section-title">Checkout solutions</h2>
            <p className="text-sm text-ink-soft hidden sm:block">Select a demo to begin</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {SOLUTIONS.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-2">Side-by-side comparison</h2>
          <p className="text-ink-soft text-sm mb-8 max-w-2xl">
            Use this overview during merchant conversations to explain trade-offs at a glance.
          </p>
          <ComparisonTable />
        </section>
      </div>
    </Layout>
  );
}
