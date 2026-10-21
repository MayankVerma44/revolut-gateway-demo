const PLATFORMS = ["WooCommerce", "Magento", "PrestaShop", "Other supported platforms"] as const;

export function PluginsPanel({
  className = "glass rounded-3xl p-6 md:p-8 h-full",
  as: Tag = "article",
}: {
  className?: string;
  as?: "article" | "div";
}) {
  return (
    <Tag className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold tracking-tight">Plugins</h3>
        <span className="text-xs text-ink-soft uppercase tracking-wider">Not in this demo</span>
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        Use a supported ecommerce plugin when the merchant already has a storefront and wants
        Revolut without a custom checkout build. This demo does not include a plugin walkthrough.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Supported platforms
          </h4>
          <ul className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <li
                key={platform}
                className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-sm text-ink-soft"
              >
                {platform}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-teal mb-3">
            Best suited for
          </h4>
          <ul className="space-y-2">
            {[
              "Merchants already on a supported ecommerce platform",
              "Teams that prefer a plugin over a custom checkout",
              "Faster storefront setup than a from-scratch integration",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                <span className="text-teal shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tag>
  );
}
