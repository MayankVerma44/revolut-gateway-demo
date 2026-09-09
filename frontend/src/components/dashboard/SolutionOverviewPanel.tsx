interface OverviewData {
  title: string;
  subtitle?: string;
  bestSuitedFor: readonly string[];
  merchantExperience: readonly string[];
  whyChoose: readonly string[];
}

export function SolutionOverviewPanel({ data }: { data: OverviewData }) {
  return (
    <article className="glass rounded-3xl p-6 md:p-8 h-full">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold tracking-tight">{data.title}</h3>
        {data.subtitle && (
          <span className="text-xs text-ink-soft uppercase tracking-wider">{data.subtitle}</span>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Best suited for
          </h4>
          <ul className="space-y-2">
            {data.bestSuitedFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                <span className="text-teal shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Merchant experience
          </h4>
          <ol className="flex flex-wrap items-center gap-2">
            {data.merchantExperience.map((step, index) => (
              <li key={step} className="flex items-center gap-2 text-sm">
                <span className="flow-step">{index + 1}</span>
                <span className="text-ink-soft">{step}</span>
                {index < data.merchantExperience.length - 1 && (
                  <span className="text-ink-soft/40 hidden sm:inline" aria-hidden="true">→</span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Why choose this?
          </h4>
          <ul className="space-y-2">
            {data.whyChoose.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                <span className="text-success shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
