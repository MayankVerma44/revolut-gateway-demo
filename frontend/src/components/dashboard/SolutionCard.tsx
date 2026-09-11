import type { SolutionMeta } from "../../constants/solutions";
import { useCheckoutSession } from "../../checkoutSession";
import { SolutionIcon } from "./SolutionIcon";

export function SolutionCard({ solution }: { solution: SolutionMeta }) {
  const session = useCheckoutSession();

  return (
    <article className="solution-card group">
      <div className="flex items-start justify-between gap-4">
        <div className="icon-well text-teal">
          <SolutionIcon integration={solution.id} />
        </div>
        <span className="badge">{solution.demoLabel}</span>
      </div>

      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
        {solution.name}
      </h3>
      <p className="mt-3 text-ink-soft text-sm leading-relaxed">{solution.description}</p>

      <ul className="mt-5 space-y-2">
        {solution.characteristics.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal" />
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn-primary mt-8 w-full"
        onClick={() => session.launch(solution.id)}
      >
        Launch Demo
      </button>
    </article>
  );
}
