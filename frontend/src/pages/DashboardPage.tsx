import { DecisionMatrix } from "../components/dashboard/DecisionMatrix";
import { KeyTakeaways } from "../components/dashboard/KeyTakeaways";
import { SolutionCard } from "../components/dashboard/SolutionCard";
import { SolutionOverviewPanel } from "../components/dashboard/SolutionOverviewPanel";
import { TechnicalComparisonMatrix } from "../components/dashboard/TechnicalComparisonMatrix";
import { Layout } from "../components/Layout";
import {
  HOSTED_CHECKOUT_OVERVIEW,
  REVOLUT_CHECKOUT_OVERVIEW,
} from "../constants/comparisonOverview";
import { SOLUTIONS } from "../constants/solutions";
import { useConfig } from "../config";

export function DashboardPage() {
  const config = useConfig();

  return (
    <Layout mode="dashboard">
      <div className="page-container py-12 md:py-16 space-y-20">
        {/* Hero */}
        <section className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft mb-4">
            <span className="badge">Knowledge Base</span>
            <span>Product Comparison</span>
            <span className="text-ink-soft/50">·</span>
            <span>v1.2 Draft</span>
          </div>
          <h1 className="hero-title">Revolut Checkout vs Hosted Checkout</h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed">
            A guide to choosing the right payment integration for your merchants. Compare
            approaches, explore interactive demos, and walk through each checkout experience.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-ink-soft">
            <span className="status-dot" />
            {config.demoMode
              ? "DEMO environment — simulated Revolut responses"
              : `Live ${config.revolutMode} sandbox — real Revolut API`}
          </div>
        </section>

        {/* Overview */}
        <section>
          <div className="mb-8">
            <h2 className="section-title">Overview</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-2xl">
              Two integration patterns for accepting payments with Revolut — each optimised for
              different merchant needs and technical constraints.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SolutionOverviewPanel
              data={{ title: "Revolut Checkout", ...REVOLUT_CHECKOUT_OVERVIEW }}
            />
            <SolutionOverviewPanel
              data={{
                title: "Hosted Checkout",
                subtitle: HOSTED_CHECKOUT_OVERVIEW.subtitle,
                bestSuitedFor: HOSTED_CHECKOUT_OVERVIEW.bestSuitedFor,
                merchantExperience: HOSTED_CHECKOUT_OVERVIEW.merchantExperience,
                whyChoose: HOSTED_CHECKOUT_OVERVIEW.whyChoose,
              }}
            />
          </div>
        </section>

        {/* Launch demos */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="section-title">Interactive demos</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Launch a live walkthrough of each checkout solution.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {SOLUTIONS.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </section>

        {/* Technical matrix */}
        <section>
          <div className="mb-8">
            <h2 className="section-title">Technical comparison</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-2xl">
              Side-by-side feature matrix for merchant conversations.
            </p>
          </div>
          <TechnicalComparisonMatrix />
        </section>

        {/* Decision matrix */}
        <section>
          <div className="mb-8">
            <h2 className="section-title">Decision matrix</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-2xl">
              Which solution should I recommend?
            </p>
          </div>
          <DecisionMatrix />
        </section>

        {/* Key takeaways */}
        <section>
          <h2 className="section-title mb-8">Key takeaways</h2>
          <KeyTakeaways />
        </section>
      </div>
    </Layout>
  );
}
