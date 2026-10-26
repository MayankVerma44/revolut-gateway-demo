interface OverviewData {
  title: string;
  subtitle?: string;
  summary?: string;
  bestSuitedFor: readonly string[];
  bestSuitedLabel?: string;
  merchantExperience?: readonly string[];
  merchantExperienceLabel?: string;
  whyChoose?: readonly string[];
  whyChooseLabel?: string;
  paymentMethods?: readonly string[];
}

export function SolutionOverviewPanel({
  data,
  className = "glass rounded-3xl p-6 md:p-8 h-full",
  as: Tag = "article",
}: {
  data: OverviewData;
  className?: string;
  as?: "article" | "div";
}) {
  const steps = data.merchantExperience ?? [];
  return (
    <Tag className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold tracking-tight text-balance">{data.title}</h3>
        {data.subtitle && (
          <span className="text-xs text-ink-soft uppercase tracking-wider">{data.subtitle}</span>
        )}
      </div>

      {data.summary && (
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">{data.summary}</p>
      )}

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            {data.bestSuitedLabel ?? "Best suited for"}
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

        {steps.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
              {data.merchantExperienceLabel ?? "Customer Experience"}
            </h4>
            <ol className="flex flex-wrap items-center gap-2">
              {steps.map((step, index) => (
                <li key={step} className="flex min-w-0 max-w-full items-center gap-2 text-sm">
                  <span className="flow-step">{index + 1}</span>
                  <span className="text-ink-soft text-balance">{step}</span>
                  {index < steps.length - 1 && (
                    <span className="text-ink-soft/40 hidden sm:inline" aria-hidden="true">→</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {data.whyChoose && data.whyChoose.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
              {data.whyChooseLabel ?? "Why choose this?"}
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
        )}

        {data.paymentMethods && data.paymentMethods.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
              Supported payment methods
            </h4>
            <ul className="space-y-2">
              {data.paymentMethods.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                  <span className="text-teal shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Tag>
  );
}
