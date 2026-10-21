import { COMPARISON_COLUMNS } from "../../constants/comparisonOverview";

const SDK_COLUMN = COMPARISON_COLUMNS.find((column) => column.id === "individual-sdks");

export function IndividualSDKPanel({
  className = "glass rounded-3xl p-6 md:p-8 h-full",
  as: Tag = "article",
}: {
  className?: string;
  as?: "article" | "div";
}) {
  return (
    <Tag className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {SDK_COLUMN?.name ?? "Individual SDKs"}
        </h3>
        <span className="text-xs text-ink-soft uppercase tracking-wider">Not in this demo</span>
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        {SDK_COLUMN?.description}. This option already appears in the technical comparison beside
        Embedded and Hosted.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Best suited for
          </h4>
          <ul className="space-y-2">
            {[
              "Custom storefronts that need standalone express buttons",
              "Checkout that stays on the merchant website",
              "Modular frontend SDK placements",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                <span className="text-teal shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            From the comparison matrix
          </h4>
          <ul className="space-y-2">
            {[
              "Technical stack: modular frontend SDKs",
              "Customer stays on merchant site",
              "Integration effort: high / pro code",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                <span className="text-success shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a href="#dashboard-comparison" className="mt-6 inline-flex text-sm text-teal hover:underline">
        Open technical comparison
      </a>
    </Tag>
  );
}
