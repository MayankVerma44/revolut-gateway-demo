import type { SolutionMeta } from "../../constants/solutions";
import { useCheckoutSession } from "../../checkoutSession";
import { SolutionIcon } from "./SolutionIcon";

export function SolutionCard({ solution }: { solution: SolutionMeta }) {
  const session = useCheckoutSession();

  return (
    <article className="solution-card group h-full">
      <div className="flex items-center justify-between gap-4">
        <div className="icon-well shrink-0 text-teal">
          <SolutionIcon integration={solution.id} />
        </div>
        <span className="badge ml-auto min-w-0 max-w-[16rem] justify-center px-3 py-1.5 text-center leading-snug whitespace-normal text-balance">
          {solution.demoLabel}
        </span>
      </div>

      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-balance">
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

      <div className="mt-auto pt-8">
        <button type="button" className="btn-pearl" onClick={() => session.launch(solution.id)}>
          Launch Demo
        </button>
      </div>
    </article>
  );
}
