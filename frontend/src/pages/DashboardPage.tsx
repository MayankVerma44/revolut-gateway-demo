// import { DecisionMatrix } from "../components/dashboard/DecisionMatrix";
// import { KeyTakeaways } from "../components/dashboard/KeyTakeaways";
// import { SolutionCard } from "../components/dashboard/SolutionCard";
// import { SolutionOverviewPanel } from "../components/dashboard/SolutionOverviewPanel";
// import { TechnicalComparisonMatrix } from "../components/dashboard/TechnicalComparisonMatrix";
// import { Layout } from "../components/Layout";
// import {
//   HOSTED_CHECKOUT_OVERVIEW,
//   REVOLUT_CHECKOUT_OVERVIEW,
// } from "../constants/comparisonOverview";
// import { SOLUTIONS } from "../constants/solutions";
// import { useConfig } from "../config";

// export function DashboardPage() {
//   const config = useConfig();

//   return (
//     <Layout mode="dashboard">
//       <div className="page-container py-12 md:py-16 space-y-20">
//         {/* Hero */}
//         <section className="max-w-3xl">
//           <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft mb-4">
//             <span className="badge">Knowledge Base</span>
//             <span>Product Comparison</span>
//             <span className="text-ink-soft/50">·</span>
//             {/* <span>v1.2 Draft</span> */}
//           </div>
//           <h1 className="hero-title">Revolut Checkout vs Hosted Checkout</h1>
//           <p className="mt-5 text-lg text-ink-soft leading-relaxed">
//             A guide to choosing the right payment integration for your merchants. Compare
//             approaches, explore interactive demos, and walk through each checkout experience.
//           </p>
//           <div className="mt-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-ink-soft">
//             <span className="status-dot" />
//             {config.sandboxReady
//               ? `${config.revolutMode}`
//               : "Configure Revolut sandbox keys to enable checkout"}
//           </div>
//         </section>

//         {/* Overview */}
//         <section>
//           <div className="mb-8">
//             <h2 className="section-title">Overview</h2>
//             <p className="mt-2 text-sm text-ink-soft max-w-2xl">
//               Two integration patterns for accepting payments with Revolut — each optimised for
//               different merchant needs and technical constraints.
//             </p>
//           </div>
//           <div className="grid gap-6 lg:grid-cols-2">
//             <SolutionOverviewPanel
//               data={{ title: "Revolut Checkout", ...REVOLUT_CHECKOUT_OVERVIEW }}
//             />
//             <SolutionOverviewPanel
//               data={{
//                 title: "Hosted Checkout",
//                 subtitle: HOSTED_CHECKOUT_OVERVIEW.subtitle,
//                 bestSuitedFor: HOSTED_CHECKOUT_OVERVIEW.bestSuitedFor,
//                 merchantExperience: HOSTED_CHECKOUT_OVERVIEW.merchantExperience,
//                 whyChoose: HOSTED_CHECKOUT_OVERVIEW.whyChoose,
//               }}
//             />
//           </div>
//         </section>

//         {/* Launch demos */}
//         <section>
//           <div className="flex items-end justify-between gap-4 mb-8">
//             <div>
//               <h2 className="section-title">Interactive demos</h2>
//               <p className="mt-2 text-sm text-ink-soft">
//                 Launch a live walkthrough of each checkout solution.
//               </p>
//             </div>
//           </div>
//           <div className="grid gap-6 lg:grid-cols-2">
//             {SOLUTIONS.map((solution) => (
//               <SolutionCard key={solution.id} solution={solution} />
//             ))}
//           </div>
//         </section>

//         {/* Technical matrix */}
//         <section>
//           <div className="mb-8">
//             <h2 className="section-title">Technical comparison</h2>
//             <p className="mt-2 text-sm text-ink-soft max-w-2xl">
//               Side-by-side feature matrix for merchant conversations.
//             </p>
//           </div>
//           <TechnicalComparisonMatrix />
//         </section>

//         {/* Decision matrix */}
//         <section>
//           <div className="mb-8">
//             <h2 className="section-title">Decision matrix</h2>
//             <p className="mt-2 text-sm text-ink-soft max-w-2xl">
//               Which solution should I recommend?
//             </p>
//           </div>
//           <DecisionMatrix />
//         </section>

//         {/* Key takeaways */}
//         <section>
//           <h2 className="section-title mb-8">Key takeaways</h2>
//           <KeyTakeaways />
//         </section>
//       </div>
//     </Layout>
//   );
// }


import { lazy, Suspense, useEffect, useState } from "react";
import { DecisionMatrix } from "../components/dashboard/DecisionMatrix";
import { FlowSection } from "../components/dashboard/FlowSection";
import { FloatingOverview } from "../components/dashboard/FloatingOverview";
import { IndividualApiDemoCard, SubscriptionApiDemoCard } from "../components/dashboard/IndividualApiDemos";
import { RevolutWordmark } from "../components/RevolutWordmark";
import { RevolutCardHero } from "../components/dashboard/RevolutCardHero";
import { SolutionCard } from "../components/dashboard/SolutionCard";
import { TechnicalComparisonMatrix } from "../components/dashboard/TechnicalComparisonMatrix";
import { Layout } from "../components/Layout";
import "./dashboard-flow.css";
import { SOLUTIONS } from "../constants/solutions";
import { useConfig } from "../config";

const delay = (index: number) => ({ animationDelay: `${70 + index * 70}ms` });
const DashboardTopDock = lazy(() =>
  import("../components/dashboard/DashboardTopDock").then(({ DashboardTopDock }) => ({
    default: DashboardTopDock,
  })),
);

function DeferredDashboardTopDock() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeout = 0;
    const frame = window.requestAnimationFrame(() => {
      timeout = window.setTimeout(() => setReady(true), 450);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <DashboardTopDock />
    </Suspense>
  );
}

export function DashboardPage() {
  const config = useConfig();
  return (
    <Layout mode="dashboard">
      <DeferredDashboardTopDock />
      <RevolutCardHero>
        <div className="hero-in flex flex-wrap items-center gap-3 text-xs text-ink-soft mb-4">
          <span className="badge">Knowledge Base</span>
          <span>Product Comparison</span>
          <span className="text-ink-soft/50">·</span>
          {/* <span>v1.2 Draft</span> */}
        </div>
        <h1 className="hero-in hero-title" style={delay(0)}>
          <span>
            Embedded Checkout, Hosted Payment Page, Plugins, Individual SDKs, Subscriptions API &
            Server-to-Server API
          </span>
          <span className="hero-powered">
            — Powered by
            <span className="sr-only"> Revolut</span>
            <RevolutWordmark className="hero-powered-logo" />
          </span>
        </h1>
        <div className="hero-lede">
          <p className="hero-in hero-lede-intro" style={delay(1)}>
            A guide to choosing the right payment gateway integration methods for you.
          </p>
          <ul className="hero-points">
            {[
              "Compare integration approaches side by side",
              "Explore interactive demos and checkout experiences",
              "Understand the key capabilities, trade-offs, and use cases",
              "Walk through each payment journey before making a decision",
            ].map((point, index) => (
              <li key={point} className="hero-in" style={delay(index + 2)}>
                <span className="hero-point-mark" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="hero-in mt-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-ink-soft"
          style={delay(6)}
        >
          <span className="status-dot" />
          {config.sandboxReady
            ? `${config.revolutMode}`
            : "Configure Revolut sandbox keys to enable checkout"}
        </div>
      </RevolutCardHero>

      <div className="page-container pb-12 md:pb-16 space-y-20">
        {/* Overview */}
        <FlowSection id="dashboard-overview">
          <div className="flow-item mb-8">
            <h2 className="section-title">Overview</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-2xl">
              Integration patterns for accepting payments with Revolut — each one fits a different
              need and technical constraint.
            </p>
          </div>
          <div className="flow-card">
            <FloatingOverview />
          </div>
        </FlowSection>

        {/* Technical matrix */}
        <FlowSection id="dashboard-comparison">
          <div className="flow-item mb-8">
            <h2 className="section-title">Technical comparison</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-2xl">
              A side-by-side view of the features, so you can compare.
            </p>
          </div>
          <div className="flow-card" style={delay(0)}>
            <TechnicalComparisonMatrix />
          </div>
        </FlowSection>

        {/* Decision matrix */}
        <FlowSection id="dashboard-decision">
          <div className="flow-item mb-8">
            <h2 className="section-title">Decision matrix</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-2xl">
              Which solution should you choose?
            </p>
          </div>
          <DecisionMatrix />
        </FlowSection>

        {/* Interactive demos — kept last on the dashboard */}
        <FlowSection id="dashboard-demos">
          <div className="flow-item flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="section-title">Interactive demos</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Launch a live walkthrough of each checkout solution.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {SOLUTIONS.map((solution, index) => (
              <div key={solution.id} className="flow-card h-full" style={delay(index)}>
                <SolutionCard solution={solution} />
              </div>
            ))}
            <div className="flow-card h-full" style={delay(SOLUTIONS.length)}>
              <IndividualApiDemoCard />
            </div>
            <div className="flow-card h-full" style={delay(SOLUTIONS.length + 1)}>
              <SubscriptionApiDemoCard />
            </div>
          </div>
        </FlowSection>
      </div>
    </Layout>
  );
}