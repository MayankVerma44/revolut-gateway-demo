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
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        {SDK_COLUMN?.description}. You can compare it with Embedded and Hosted in the technical
        comparison.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Best suited for
          </h4>
          <ul className="space-y-2">
            {[
              "You need standalone buttons on a custom storefront",
              "You want checkout to stay on your website",
              "You want to place each payment SDK yourself",
              "You need support for CIT/MIT payments",
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
            Supported payment methods
          </h4>
          <ol className="space-y-2">
            {["Revolut Pay", "Cards", "ApplePay", "Google Pay", "Pay By Bank"].map((item, index) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                <span className="flow-step shrink-0">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Tag>
  );
}
