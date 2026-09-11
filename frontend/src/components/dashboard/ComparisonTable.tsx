import { SOLUTIONS } from "../../constants/solutions";

const ROWS: { key: keyof (typeof SOLUTIONS)[0]["comparison"]; label: string }[] = [
  { key: "checkoutExperience", label: "Checkout experience" },
  { key: "redirectRequired", label: "Redirect required" },
  { key: "integrationType", label: "Integration type" },
  { key: "customisation", label: "Customisation" },
  { key: "paymentMethods", label: "Payment methods" },
  { key: "mobileExperience", label: "Mobile experience" },
  { key: "bestSuitedFor", label: "Best suited for" },
];

export function ComparisonTable() {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="comparison-table w-full min-w-[640px] text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-ink-soft">Capability</th>
              {SOLUTIONS.map((solution) => (
                <th key={solution.id} className="text-left font-display font-semibold">
                  {solution.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <td className="text-ink-soft">{row.label}</td>
                {SOLUTIONS.map((solution) => (
                  <td key={solution.id}>{solution.comparison[row.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-6 pb-5 text-xs text-ink-soft/70">
        * Payment method availability depends on Revolut account configuration and environment.
      </p>
    </div>
  );
}
